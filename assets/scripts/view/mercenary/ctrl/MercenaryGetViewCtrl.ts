import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import HeroModel from '../../../common/models/HeroModel';
import MercenaryGetHeroCtrl from './MercenaryGetHeroCtrl';
import MercenaryModel from '../model/MercenaryModel';
import MercenaryUtils from '../utils/MercenaryUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import { GuideCfg, HeroCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { MercenaryEventId } from '../enum/MercenaryEventId';

/**
 * 英雄雇佣 设置界面
 * @Author: luoyong
 * @Description:
 * @Date: 2020-07-10 11:12:08
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-25 09:58:21
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/mercenary/MercenaryGetViewCtrl")
export default class MercenaryGetViewCtrl extends gdk.BasePanel {

    @property(MercenaryGetHeroCtrl)
    heroGetCtrl: MercenaryGetHeroCtrl[] = []

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    heroGetItem: cc.Prefab = null

    @property(cc.Button)
    careerBtns: cc.Button[] = []
    @property(cc.Button)
    groupBtns: cc.Button[] = []

    @property(cc.Node)
    contentCareer: cc.Node = null
    @property(cc.Node)
    btnUp: cc.Node = null

    list: ListView = null
    selectCareer: number = 0    //筛选职业
    selectGroup: number = 0     // 筛选阵营
    isShowCareer: boolean = false

    get heroModel() { return ModelManager.get(HeroModel); }
    get roleModel() { return ModelManager.get(RoleModel); }
    get mercenaryModel() { return ModelManager.get(MercenaryModel); }


    onLoad() {
        let msg = new icmsg.MercenaryListReq()
        NetManager.send(msg)

        let msg2 = new icmsg.MercenaryBorrowedReq()
        NetManager.send(msg2)
    }

    onEnable() {
        gdk.e.on(MercenaryEventId.MERCENARY_GET_REFRESH_HERO, this._refreshViewData, this)
        NetManager.on(icmsg.MercenaryBorrowedRsp.MsgType, this._updateHeroState, this)
        NetManager.on(icmsg.MercenaryListRsp.MsgType, this._onMercenaryListRsp, this)
        // this.selectCareerFunc(null, this.selectCareer)
        // this.selectGroupFunc(null, 0)
        // this.updateContentState()
        if (this.list) {
            this.selectCareerFunc(null, this.selectCareer)
            this.selectGroupFunc(null, 0)
            this.updateContentState()
        }
    }

    onDisable() {
        NetManager.targetOff(this)
        gdk.e.targetOff(this)
        this.unscheduleAllCallbacks()
    }

    _onMercenaryListRsp(data: icmsg.MercenaryListRsp) {
        this.mercenaryModel.listHero = data.list
        this.selectCareerFunc(null, this.selectCareer)
        this.selectGroupFunc(null, 0)
        this.updateContentState()
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.heroGetItem,
            cb_host: this,
            column: 5,
            gap_x: 15,
            gap_y: 40,
            async: true,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._onHeroClick, this)
    }

    _updateScroll() {
        this._initListView()

        let datas = this.mercenaryModel.listHero
        let tempDatas1: icmsg.MercenaryListHero[] = []
        if (this.selectGroup != 0) {
            //英雄阵营数据
            for (let i = 0; i < datas.length; i++) {
                let heroCfg = ConfigManager.getItemById(HeroCfg, datas[i].heroBrief.typeId);
                if (heroCfg.group.indexOf(this.selectGroup) != -1) {
                    tempDatas1.push(datas[i])
                }
            }
        }
        else {
            tempDatas1 = datas
        }
        let tempDatas = []
        if (this.selectCareer != 0) {
            for (let i = 0; i < tempDatas1.length; i++) {
                //let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", tempDatas1[i].heroBrief.careerId)
                let type = Math.floor(tempDatas1[i].heroBrief.soldierId / 100);
                if (type == this.selectCareer) {
                    tempDatas.push(tempDatas1[i])
                }
            }
        } else {
            tempDatas = tempDatas1
        }
        GlobalUtil.sortArray(tempDatas, (a: icmsg.MercenaryListHero, b: icmsg.MercenaryListHero) => {
            return b.heroPower - a.heroPower
        })
        this.list.clear_items();
        this.list.set_data(tempDatas)

        let index = 0
        let guideId = GuideUtil.getCurGuideId()
        if (guideId > 0) {
            let cfg = ConfigManager.getItemById(GuideCfg, guideId)
            if (cfg && cfg.bindBtnId == 1802) {
                for (let j = 0; j < tempDatas.length; j++) {
                    if (tempDatas[j].playerId == 0) {
                        index = j
                        break
                    }
                }
                this.list.scroll_to(index)
            }
        }
    }

    _onHeroClick(info: icmsg.MercenaryListHero) {
        if (MercenaryUtils.canBorrowHeroNum <= MercenaryUtils.hasBorrowHeroNum) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:MERCENARY_TIP7"))
            return
        }
        if (this._checkGetHero(info.heroBrief.typeId)) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:MERCENARY_TIP8"))
            return
        }

        gdk.panel.setArgs(PanelId.MercenaryGetCheck, info)
        gdk.panel.open(PanelId.MercenaryGetCheck)
    }

    _updateHeroState() {
        //更新已设英雄状态
        for (let i = 0; i < this.heroGetCtrl.length; i++) {
            this.heroGetCtrl[i].updateState(this._getHero(i + 1))
        }
    }

    //刷新状态
    _refreshViewData() {
        this._updateHeroState()
        //重新请求可租用英雄列表
        let msg = new icmsg.MercenaryListReq()
        NetManager.send(msg)
    }

    /*获得已借英雄的数据*/
    _getHero(index) {
        let list = this.mercenaryModel.borrowedListHero
        for (let i = 0; i < list.length; i++) {
            if (list[i] && list[i].index == index) {
                return list[i]
            }
        }
        let info = new icmsg.MercenaryBorrowedHero()
        info.index = index
        info.brief = null
        return info
    }

    _checkGetHero(typeId) {
        let list = this.mercenaryModel.borrowedListHero
        for (let i = 0; i < list.length; i++) {
            if (list[i] && list[i].brief.typeId == typeId) {
                return true
            }
        }
        return false
    }

    /**选择页签, 筛选职业*/
    selectCareerFunc(e, utype) {
        this.selectCareer = parseInt(utype)
        for (let idx = 0; idx < this.careerBtns.length; idx++) {
            const element = this.careerBtns[idx];
            element.interactable = idx != this.selectCareer
            let select = element.node.getChildByName("select")
            select.active = idx == this.selectCareer
        }
        this._updateScroll()
    }


    //  /**选择页签, 筛选职业*/
    //  selectCareerFunc(e, utype) {
    //     this.selectCareer = parseInt(utype)
    //     for (let idx = 0; idx < this.careerBtns.length; idx++) {
    //         const element = this.careerBtns[idx];
    //         element.interactable = idx != this.selectCareer
    //         let select = element.node.getChildByName("select")
    //         select.active = idx == this.selectCareer
    //     }
    //     this._updateScroll()
    // }

    /**选择页签, 筛选阵营*/
    selectGroupFunc(e, utype) {
        this.selectGroup = parseInt(utype)
        for (let idx = 0; idx < this.groupBtns.length; idx++) {
            const element = this.groupBtns[idx];
            let nodeName = element.name
            let group = parseInt(nodeName.substring('group'.length));
            element.interactable = group != this.selectGroup
            let select = element.node.getChildByName("select")
            select.active = group == this.selectGroup
        }
        this._updateScroll()
    }

    showCareerContent() {
        this.isShowCareer = true
        this.updateContentState()
    }

    hideCareerContent() {
        this.isShowCareer = false
        this.updateContentState()
    }
    updateContentState() {
        if (this.isShowCareer) {
            this.contentCareer.active = true
            this.btnUp.active = false
        } else {
            this.contentCareer.active = false
            this.btnUp.active = true
        }
    }

}
