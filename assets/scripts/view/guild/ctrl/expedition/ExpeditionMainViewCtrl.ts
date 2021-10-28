import ActUtil from '../../../act/util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionMainMapCtrl from './ExpeditionMainMapCtrl';
import ExpeditionModel from './ExpeditionModel';
import ExpeditionUtils from './ExpeditionUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import { Expedition_forcesCfg, Expedition_globalCfg, Expedition_mapCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-25 17:56:37
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionMainViewCtrl")
export default class ExpeditionMainViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bg: cc.Node = null

    @property(ExpeditionMainMapCtrl)
    tiledMap: ExpeditionMainMapCtrl = null

    @property(cc.ScrollView)
    tiledMapScrollView: cc.ScrollView = null

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Label)
    pointNumLab: cc.Label = null

    @property(cc.Node)
    showPointNode: cc.Node = null

    @property(cc.Node)
    hidePointNode: cc.Node = null

    @property(cc.ScrollView)
    pointListScrollView: cc.ScrollView = null;

    @property(cc.Node)
    pointListContent: cc.Node = null;

    @property(cc.Prefab)
    pointListItemPre: cc.Prefab = null;

    @property(cc.ScrollView)
    btnScrollView: cc.ScrollView = null;

    @property(cc.Node)
    btnContent: cc.Node = null;

    @property(cc.Prefab)
    btnItemPre: cc.Prefab = null;

    mainMapId: number = 0

    activityId: number = 114

    pointList: ListView
    btnList: ListView

    get expeditionModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }

    onEnable() {
        this.expeditionModel.isEnterCity = true

        let msg = new icmsg.ExpeditionHeroListReq()
        NetManager.send(msg)

        let mapMsg = new icmsg.ExpeditionMapListReq()
        NetManager.send(mapMsg, (data: icmsg.ExpeditionMapListRsp) => {
            let list = data.list
            GlobalUtil.sortArray(list, (a, b) => {
                return a.mapId - b.mapId
            })
            this.expeditionModel.expeditionMaps = list
            ExpeditionUtils.updateMap()
            let mapCfgs = ConfigManager.getItemsByField(Expedition_mapCfg, "type", this.expeditionModel.activityType)
            this.mainMapId = mapCfgs[0].entrance_id
            // 加载并初始化地图
            gdk.rm.loadRes(this.resId, `tileMap/expedition/${this.mainMapId}`, cc.TiledMapAsset, (tmx: cc.TiledMapAsset) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this.tiledMap.initMap(this, tmx);
                this.tiledMap.resetSize();
            });
        })

        //请求据点占领情况
        let msg_2 = new icmsg.ExpeditionOccupiedPointsReq()
        NetManager.send(msg_2, (data: icmsg.ExpeditionOccupiedPointsRsp) => {
            this.expeditionModel.occupyPoints = data.point
            this._updatePointsNum()
        })

        this._updateOccupyNum()

    }

    @gdk.binding("expeditionModel.expedtitionAllPower")
    _updatePower() {
        this.powerLab.string = this.expeditionModel.expedtitionAllPower + '';
    }

    _updateOccupyNum() {
        let point_limit = ConfigManager.getItemById(Expedition_globalCfg, "point_limit").value[0]
        let forcesCfg = ConfigManager.getItemById(Expedition_forcesCfg, this.expeditionModel.armyLv);

        let cfgs = ConfigManager.getItems(Expedition_mapCfg)
        let msg = new icmsg.ExpeditionMapEnterReq()
        msg.mapId = cfgs[0].map_id
        NetManager.send(msg, (data: icmsg.ExpeditionMapEnterRsp) => {
            this.pointNumLab.string = `${data.occupiedNum}/${point_limit + forcesCfg.privilege0}`
        })
    }

    /**刷新据点信息 */
    refreshPoints() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;

        //引导触发
        let b = GlobalUtil.getLocal(`_expedition_guide_state_`) || false
        if (!b) {

            let datas = this.expeditionModel.expeditionMaps
            let mapId = datas[0].mapId
            for (let i = 0; i < datas.length; i++) {
                if (!datas[i].isClear) {
                    mapId = datas[i].mapId
                    break
                }
            }
            let cityCtrls = this.expeditionModel.cityCtrlMap
            for (let key in cityCtrls) {
                let ctrl = cityCtrls[key]
                if (ctrl._info && ctrl._info.cfg.map_id == mapId) {
                    ctrl.bindGuide()
                    GuideUtil.setGuideId(216000)
                }
            }
        }

    }


    onOpenFunc(e, type) {
        let uType = parseInt(type)
        switch (uType) {
            case 0://排行奖励
                gdk.panel.open(PanelId.ExpeditionRankView)
                break;
            case 1://远征商店
                JumpUtils.openScoreStore([1, 4]);
                break;
            case 2://远征奖励
                gdk.panel.setArgs(PanelId.ExpeditionArmyRewardView, 0);
                gdk.panel.open(PanelId.ExpeditionArmyRewardView);
                break;
            case 3://远征英雄
                gdk.panel.open(PanelId.ExpeditionSelectHero)
                break;
            case 4://部队强化
                JumpUtils.openPanel({
                    panelId: PanelId.ExpeditionStrengthenView,
                    currId: this.node
                })
                break;
            case 5://远征部队
                gdk.panel.open(PanelId.ExpeditionArmyView);
                break;
        }
    }

    showPointListFunc() {
        this.hidePointNode.active = false
        this.showPointNode.active = true
        this.showPointNode.getChildByName("node").getComponent(cc.Button).enabled = false
        this.hidePointNode.getComponent(cc.Button).enabled = false
        this.showPointNode.x = -360 - this.showPointNode.width
        let action = cc.sequence(cc.moveTo(0.3, cc.v2(-360, this.showPointNode.y)), cc.callFunc(() => {
            this.showPointNode.getChildByName("node").getComponent(cc.Button).enabled = true
            this.hidePointNode.getComponent(cc.Button).enabled = true
            this._initBtns()
            this._initPointListView()
            this.btnList.select_item(0)

            let totalLab = cc.find("totalLab", this.showPointNode).getComponent(cc.Label)
            totalLab.string = `(${ExpeditionUtils.getOccupiedPointsNum()})`

        }))
        this.showPointNode.runAction(action)
    }

    hidePointListFunc() {
        this.hidePointNode.getComponent(cc.Button).enabled = false
        this.showPointNode.getChildByName("node").getComponent(cc.Button).enabled = false
        let action = cc.sequence(cc.moveTo(0.3, cc.v2(-360 - this.showPointNode.width, this.showPointNode.y)), cc.callFunc(() => {
            this.showPointNode.active = false
            this.hidePointNode.active = true
            this.showPointNode.getChildByName("node").getComponent(cc.Button).enabled = true
            this.hidePointNode.getComponent(cc.Button).enabled = true
        }))
        this.showPointNode.runAction(action)
    }

    _updatePointsNum() {
        let totalLab = cc.find("totalLab", this.hidePointNode).getComponent(cc.Label)
        totalLab.string = `(${ExpeditionUtils.getOccupiedPointsNum()})`
    }

    _initPointListView() {
        if (this.pointList) {
            return
        }
        this.pointList = new ListView({
            scrollview: this.pointListScrollView,
            mask: this.pointListScrollView.node,
            content: this.pointListContent,
            item_tpl: this.pointListItemPre,
            cb_host: this,
            column: 1,
            gap_y: 5,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }


    _initBtns() {
        let mapCfgs = ConfigManager.getItemsByField(Expedition_mapCfg, "type", this.expeditionModel.activityType)
        this.initBtnListView()
        this.btnList.set_data(mapCfgs)
    }

    initBtnListView() {
        if (this.btnList) {
            return
        }
        this.btnList = new ListView({
            scrollview: this.btnScrollView,
            mask: this.btnScrollView.node,
            content: this.btnContent,
            item_tpl: this.btnItemPre,
            cb_host: this,
            gap_x: 2,
            async: true,
            direction: ListViewDir.Horizontal,
        })
        this.btnList.onClick.on(this._btnSelectItem, this);
    }

    _btnSelectItem(data) {
        let cfg: Expedition_mapCfg = data
        let datas = ExpeditionUtils.getOccupiedPoints(cfg.map_id)
        this.pointList.set_data(datas)

        let curLab = cc.find("curLab", this.showPointNode).getComponent(cc.Label)
        curLab.string = StringUtils.format(gdk.i18n.t('i18n:EXPEDITION_TIP12'), cfg.name, datas.length)//`${cfg.name}据点数(${datas.length})`
    }
}