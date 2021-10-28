import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import MercenaryModel from '../model/MercenaryModel';
import MercenarySetHeroCtrl from './MercenarySetHeroCtrl';
import MercenaryUtils from '../utils/MercenaryUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import { BagItem } from '../../../common/models/BagModel';
import { Hero_careerCfg, HeroCfg, WorkerCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { MercenaryEventId } from '../enum/MercenaryEventId';
import { RedPointEvent } from '../../../common/utils/RedPointUtils';

/**
 * 英雄雇佣设置界面
 * @Author: luoyong
 * @Description:
 * @Date: 2020-07-10 11:12:08
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-25 09:59:55
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/mercenary/MercenarySetViewCtrl")
export default class MercenarySetViewCtrl extends gdk.BasePanel {


    @property(MercenarySetHeroCtrl)
    heroSetCtrl: MercenarySetHeroCtrl[] = []

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    heroSetItem: cc.Prefab = null

    _countTime = 30 //请求结算 时间间隔

    list: ListView = null
    cfgLists: { [index: number]: MercenarySetItemInfo[] } = {}   // 英雄当前职业配置,按品质分类,0为全部

    get heroModel() { return ModelManager.get(HeroModel); }
    get roleModel() { return ModelManager.get(RoleModel); }
    get mercenaryModel() { return ModelManager.get(MercenaryModel); }

    onLoad() {
        this._initCfg()
    }

    onEnable() {
        gdk.e.on(MercenaryEventId.MERCENARY_SET_REFRESH_HERO, this._updateScroll, this)
        NetManager.on(icmsg.MercenaryLentRsp.MsgType, this._onMercenaryLentRsp, this)
        this._initListView()
        //请求已设英雄列表
        let msg = new icmsg.MercenaryLentReq()
        NetManager.send(msg, (data: icmsg.MercenaryLentRsp) => {
            this.mercenaryModel.lentHeroList = data.list
            // //英雄列表排除已设英雄
            this._updateDataLater()
        })
        //请求挂机收益
        this.schedule(this._updateTime.bind(this), this._countTime)
    }

    _updateTime() {
        let msg = new icmsg.MercenaryLentReq()
        NetManager.send(msg)
    }

    _onMercenaryLentRsp(data: icmsg.MercenaryLentRsp) {
        this.mercenaryModel.lentHeroList = data.list
        this._updateDataLater()
    }

    onDisable() {
        NetManager.targetOff(this)
        gdk.e.targetOff(this)
        this.unscheduleAllCallbacks()
    }

    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _initCfg() {
        let heroItems = this.heroModel.heroInfos
        let lists = this.cfgLists
        lists[0] = []

        let workerCfg = ConfigManager.getItemById(WorkerCfg, 1)
        let limit = workerCfg.limit

        for (let index = 0; index < heroItems.length; index++) {
            let bagCfg: BagItem = heroItems[index]
            let extInfo = <icmsg.HeroInfo>bagCfg.extInfo
            let heroCfg = ConfigManager.getItemById(HeroCfg, bagCfg.itemId)
            let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", extInfo.careerId)

            if (!lists[extInfo.color]) {
                lists[extInfo.color] = []
            }
            let data: MercenarySetItemInfo = {
                cfg: heroCfg,
                extInfo: extInfo,
                careerCfg: careerCfg,
                selected: false
            }
            //符合条件的才显示
            if (careerCfg.career_lv >= limit[1]) {
                lists[0].push(data)
                lists[extInfo.color].push(data)
            }
        }
        // 排序  战力>星级> 品质> 阶级 >等级> 英雄id
        for (let index in lists) {
            GlobalUtil.sortArray(lists[index], (a, b) => {
                if (b.extInfo.power == a.extInfo.power) {
                    if (b.extInfo.star == a.extInfo.star) {
                        if (b.extInfo.color == a.extInfo.color) {
                            if (b.extInfo.level == a.extInfo.level) {
                                return a.cfg.id - b.cfg.id
                            }
                            return b.extInfo.level - a.extInfo.level
                        }
                        return b.extInfo.color - a.extInfo.color
                    }
                    return b.extInfo.star - a.extInfo.star
                }
                return b.extInfo.power - a.extInfo.power
            })
        }
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.heroSetItem,
            cb_host: this,
            column: 5,
            gap_x: 15,
            gap_y: 15,
            async: true,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._onHeroClick, this)
    }

    _updateScroll() {
        let datas = this.cfgLists[0]
        let tempDatas = []
        for (let i = 0; i < datas.length; i++) {
            if (!this._hasHired(datas[i].extInfo.heroId)) {
                tempDatas.push(datas[i])
            }
        }
        this.list.set_data(tempDatas)
        this._updateHeroState()
    }

    _updateHeroState() {
        //更新已设英雄状态
        for (let i = 0; i < this.heroSetCtrl.length; i++) {
            this.heroSetCtrl[i].updateState(this._getHero(i + 1))
        }
    }

    _onHeroClick(data: MercenarySetItemInfo, index) {

        if (MercenaryUtils.setHeroLength <= MercenaryUtils.hiredHeroLength) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:MERCENARY_TIP7"))
            return
        }
        let ctrl = this.node.getComponent(MercenarySetViewCtrl)
        gdk.panel.setArgs(PanelId.MercenarySetCheck, data, index, ctrl)
        gdk.panel.open(PanelId.MercenarySetCheck)

    }

    /*设置雇佣的英雄*/
    _addHero(heroData) {
        let addMid = false
        let list = this.mercenaryModel.lentHeroList
        for (let i = 0; i < list.length; i++) {
            if (list[i] && list[i].heroId == 0) {
                addMid = true
                this.mercenaryModel.lentHeroList[i] = heroData
                return
            }
        }

        if (!addMid) {
            this.mercenaryModel.lentHeroList.push(heroData)
        }
    }

    /*获得雇佣英雄的数据*/
    _getHero(index) {
        let list = this.mercenaryModel.lentHeroList
        for (let i = 0; i < list.length; i++) {
            if (list[i] && list[i].index == index) {
                return list[i]
            }
        }

        let info = new icmsg.MercenaryLentHero()
        info.index = index
        info.heroId = 0
        return info
    }

    /**是否被雇佣 */
    _hasHired(heroId) {
        let list = this.mercenaryModel.lentHeroList
        for (let i = 0; i < list.length; i++) {
            if (list[i] && list[i].heroId == heroId) {
                return true
            }
        }
        return false
    }

    /**领取收益*/
    gainFunc() {
        let gainNum = 0
        let list = this.mercenaryModel.lentHeroList
        for (let i = 0; i < list.length; i++) {
            if (list[i].settlteGold > 0) {
                gainNum += list[i].settlteGold
            }
        }
        if (gainNum <= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:MERCENARY_TIP10"))
            return
        }
        let msg = new icmsg.MercenaryGainReq()
        NetManager.send(msg, (data: icmsg.MercenaryGainRsp) => {
            this.mercenaryModel.lentHeroList = data.list
            this._updateHeroState()
            GlobalUtil.openRewadrView(data.gain)
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
            gdk.e.emit(MercenaryEventId.MERCENARY_SET_REFRESH_HERO)
        })
    }
}

export type MercenarySetItemInfo = {
    cfg: HeroCfg,   // 英雄配置信息
    careerCfg: Hero_careerCfg,
    extInfo: icmsg.HeroInfo,  //
    selected: boolean,
}