import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionLayerViewCtrl from './ExpeditionLayerViewCtrl';
import ExpeditionModel from './ExpeditionModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import { Expedition_globalCfg, Expedition_unlockCfg, HeroCfg } from '../../../../a/config';
import { ExpeditionEventId } from './ExpeditionEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-28 10:20:50
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionSelectHeroCtrl")
export default class ExpeditionSelectHeroCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    heroItemPre: cc.Prefab = null;

    @property(cc.Button)
    careerBtns: cc.Button[] = []

    @property(cc.Button)
    groupBtns: cc.Button[] = []

    @property(cc.Node)
    contentCareer: cc.Node = null

    @property(cc.Node)
    btnUp: cc.Node = null

    @property(cc.Label)
    resumeLab: cc.Label = null

    get expeditionModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }

    list: ListView = null
    selectGroup: number = 0     // 筛选阵营
    selectCareer: number = 0    //筛选职业
    isShowCareer: boolean = false

    onEnable() {

        NetManager.on(icmsg.ExpeditionHeroListRsp.MsgType, this._onExpeditionHeroListRsp, this)
        let msg = new icmsg.ExpeditionHeroListReq()
        NetManager.send(msg)

        let energy = ConfigManager.getItemById(Expedition_globalCfg, "energy").value
        this.resumeLab.string = `${energy[1]}/${energy[0] / 3600}${gdk.i18n.t("i18n:EXPEDITION_TIP27")}`

        gdk.e.on(ExpeditionEventId.EXPEDITION_HEROS_UPDATE, this._updateDataLater, this)
        // this.selectGroupFunc(null, 0);
        // this.selectCareerFunc(null, 0);
        this.updateContentState();
    }

    onDisable() {
        gdk.Timer.clearAll(this)
        gdk.e.targetOff(this)
        NetManager.targetOff(this)
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }

        let b = GlobalUtil.getLocal(`_expedition_guide_state_`) || false
        if (!b) {
            GlobalUtil.setLocal(`_expedition_guide_state_`, true)

            let pointCtrls = this.expeditionModel.pointCtrlMap
            for (let key in pointCtrls) {
                let pointCtrl = pointCtrls[key]
                let pointInfo = this.expeditionModel.pointMap[key]
                if (pointInfo.type != 0 && (!pointInfo.info || pointInfo.info.progress == 0)) {
                    let panel = gdk.panel.get(PanelId.ExpeditionLayerView)
                    if (panel) {
                        let ctrl = panel.getComponent(ExpeditionLayerViewCtrl)
                        ctrl.tiledMap.node.setPosition(-pointInfo.mapPoint.x, -pointInfo.mapPoint.y);
                        GuideUtil.bindGuideNode(22007, pointCtrl.node)
                        GuideUtil.setGuideId(216007)
                    }
                }
            }
        }
    }

    _onExpeditionHeroListRsp(data: icmsg.ExpeditionHeroListRsp) {
        // this.expeditionModel.expeditionHeros = data.list
        // this.expeditionModel.energyBought = data.energyBought
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

    _updateScroll() {
        this._initListView()
        let cfgs = ConfigManager.getItems(Expedition_unlockCfg)
        //默认显示数据
        let datas: { [id: number]: icmsg.ExpeditionHero } = {}
        cfgs.forEach(element => {
            let info = new icmsg.ExpeditionHero()
            info.gridId = element.location
            info.heroId = 0
            info.energy = 0
            info.changeTime = 0
            info.energyTime = 0
            datas[info.gridId] = info
        });

        //已有英雄数据填充
        this.expeditionModel.expeditionHeros.forEach(element => {
            datas[element.gridId] = element
        });

        let showDatas: icmsg.ExpeditionHero[] = [];
        for (let index in datas) {
            showDatas.push(datas[index])
        }

        let tempList: icmsg.ExpeditionHero[] = [];

        if (this.selectGroup != 0) {
            //英雄阵营数据
            for (let i = 0; i < showDatas.length; i++) {
                let heroInfo: icmsg.HeroInfo = HeroUtils.getHeroInfoByHeroId(showDatas[i].heroId)
                if (heroInfo) {
                    let heroCfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId);
                    if (heroCfg.group.indexOf(this.selectGroup) != -1) {
                        tempList.push(showDatas[i])
                    }
                }
            }
        }
        else {
            tempList = showDatas
        }

        //全职业
        if (this.selectCareer != 0) {
            //英雄职业数据
            let groupDatas = []
            for (let i = 0; i < tempList.length; i++) {
                let heroInfo: icmsg.HeroInfo = HeroUtils.getHeroInfoByHeroId(tempList[i].heroId)
                if (heroInfo) {
                    let type = Math.floor(heroInfo.soldierId / 100);
                    if (type == this.selectCareer) {
                        groupDatas.push(tempList[i])
                    }
                }
            }
            tempList = groupDatas
        }
        this.list.clear_items();
        this.list.set_data(tempList, false)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.heroItemPre,
            cb_host: this,
            column: 4,
            gap_x: 30,
            gap_y: 10,
            async: true,
            resize_cb: this._updateDataLater,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._selectItem, this);
    }

    _selectItem(data: any, index) {
        let hero: icmsg.ExpeditionHero = data
        if (hero.heroId > 0) {
            JumpUtils.openExpeditionHeroDetailView(hero.heroId)
        }
    }

    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }
}