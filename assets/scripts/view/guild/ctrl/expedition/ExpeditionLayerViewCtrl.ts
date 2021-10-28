import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionLayerMapCtrl from './ExpeditionLayerMapCtrl';
import ExpeditionModel from './ExpeditionModel';
import ExpeditionRewardItemCtrl from './ExpeditionRewardItemCtrl';
import ExpeditionUtils from './ExpeditionUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import { Expedition_forcesCfg, Expedition_globalCfg, Expedition_mapCfg } from '../../../../a/config';
import { ExpeditionEventId } from './ExpeditionEventId';
import { ListView, ListViewDir } from '../../../../../boot/common/widgets/BUiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-25 17:56:29
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionLayerViewCtrl")
export default class ExpeditionLayerViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.Label)
    mapName: cc.Label = null

    @property(ExpeditionLayerMapCtrl)
    tiledMap: ExpeditionLayerMapCtrl = null

    @property(cc.ScrollView)
    tiledMapScrollView: cc.ScrollView = null

    @property(cc.Node)
    showStageNode: cc.Node = null

    @property(cc.Node)
    hideStageNode: cc.Node = null

    @property(cc.Node)
    rewardUp: cc.Node = null

    @property(cc.Node)
    rewardDown: cc.Node = null

    @property(cc.Node)
    rewardLayout: cc.Node = null

    @property(cc.Node)
    rewardItem: cc.Node = null

    @property(cc.Node)
    oneKeyGet: cc.Node = null

    @property(cc.Label)
    pointNumLab: cc.Label = null

    @property(cc.Node)
    btnArmyStrengh: cc.Node = null

    @property(cc.Label)
    powerLab: cc.Label = null;

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

    mapCfg: Expedition_mapCfg
    isShowReward: boolean = false

    get expeditionModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }

    pointList: ListView
    btnList: ListView
    _expeditionMap: icmsg.ExpeditionMap

    onEnable() {
        this.refreshMapView()
    }

    refreshMapView() {
        this.mapCfg = this.expeditionModel.curMapCfg
        this.mapName.string = `${this.mapCfg.name}`
        let showTipTime = ConfigManager.getItemById(Expedition_globalCfg, "show_time").value[0]
        let bgPath = `view/guild/texture/bg/${this.mapCfg.background}`
        GlobalUtil.setSpriteIcon(this.node, this.bg, bgPath)

        if (ExpeditionUtils.isMapOpen(this.mapCfg.map_id)) {
            let msg = new icmsg.ExpeditionMapEnterReq()
            msg.mapId = this.mapCfg.map_id
            NetManager.send(msg, (data: icmsg.ExpeditionMapEnterRsp) => {
                this.expeditionModel.expeditionPoints = data.map.points
                this.expeditionModel.expeditionEvents = data.map.events
                this.expeditionModel.occupyPointNum = data.occupiedNum

                this.tiledMap.tiledMap.tmxAsset = null
                // 加载并初始化地图
                gdk.rm.loadRes(this.resId, `tileMap/expedition/${this.mapCfg.map_id}`, cc.TiledMapAsset, (tmx: cc.TiledMapAsset) => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.node.activeInHierarchy) return;
                    this.tiledMap.initMap(this, tmx);
                    this.tiledMap.resetSize();

                    let production_time = ConfigManager.getItemById(Expedition_globalCfg, "production_time").value[0]
                    gdk.Timer.loop(1000 * production_time, this, this._updateRewardReq)
                    gdk.e.on(ExpeditionEventId.EXPEDITION_POINTS_UPDATE, this.refreshPoints, this)

                    this.showStageFunc()
                    gdk.Timer.once(showTipTime * 1000, this, this.hideStageFunc)
                    this.showRewardNode()
                });
            })
        } else {
            gdk.rm.loadRes(this.resId, `tileMap/expedition/${this.mapCfg.map_id}`, cc.TiledMapAsset, (tmx: cc.TiledMapAsset) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this.tiledMap.initMap(this, tmx);
                this.tiledMap.resetSize();

                // //提示
                // cc.find("bg/lab", this.showStageNode).getComponent(cc.Label).string = this.mapCfg.prompt
                this.showStageFunc()
                gdk.Timer.once(showTipTime * 1000, this, this.hideStageFunc)
            });
        }

        //请求据点占领情况
        let msg = new icmsg.ExpeditionOccupiedPointsReq()
        NetManager.send(msg, (data: icmsg.ExpeditionOccupiedPointsRsp) => {
            this.expeditionModel.occupyPoints = data.point
            this._updatePointsNum()
        })
    }

    onDisable() {
        gdk.e.targetOff(this)
        gdk.Timer.clearAll(this)
        this.expeditionModel.pointMap = {}
        this.expeditionModel.pointCtrlMap = {}
        this.expeditionModel.tilePointMap = {};
        this.expeditionModel.expeditionPoints = []
        this.expeditionModel.expeditionEvents = []
        if (ExpeditionUtils.isMapOpen(this.mapCfg.map_id)) {
            let msg = new icmsg.ExpeditionMapExitReq()
            msg.mapId = this.mapCfg.map_id
            NetManager.send(msg)
        }
    }

    @gdk.binding("expeditionModel.expedtitionAllPower")
    _updatePower() {
        this.powerLab.string = this.expeditionModel.expedtitionAllPower + '';
    }

    @gdk.binding("expeditionModel.occupyPointNum")
    _updateOccupyNum() {
        let point_limit = ConfigManager.getItemById(Expedition_globalCfg, "point_limit").value[0]
        let forcesCfg = ConfigManager.getItemByField(Expedition_forcesCfg, 'id', this.expeditionModel.armyLv, { type: this.expeditionModel.activityType });
        this.pointNumLab.string = `${this.expeditionModel.occupyPointNum}/${point_limit + forcesCfg.privilege0}`
    }

    _updateRewardReq() {
        if (this.isShowReward) {
            this._updateRewardView()
        }
    }

    /**刷新据点信息 */
    refreshPoints() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;
        let pointMap = this.expeditionModel.pointMap

        for (let key in pointMap) {
            let point = pointMap[key]
            let pInfo = ExpeditionUtils.findPointInfo(point.pos.x, point.pos.y)
            if (pInfo) {
                point.info = pInfo
            }
            let ctrl = this.expeditionModel.pointCtrlMap[`${point.pos.x}-${point.pos.y}`]
            ctrl.updateInfo(point)
        }

        this.tiledMap.showTargetBlock()


        let b = GlobalUtil.getLocal(`_expedition_guide_state_`) || false
        if (!b) {
            GuideUtil.setGuideId(216001)
        }

    }

    showRewardNode() {
        if (!this.isShowReward) {
            this.rewardUp.active = false
            this.rewardDown.active = true
            this.isShowReward = true
            this._updateRewardView()
        } else {
            this.rewardUp.active = true
            this.rewardDown.active = false
            this.isShowReward = false
        }
    }

    _updateRewardView() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;

        //挂机累计收益
        let msg = new icmsg.ExpeditionHangupItemsReq()
        NetManager.send(msg, (data: icmsg.ExpeditionHangupItemsRsp) => {
            for (let index = 0; index < this.rewardLayout.childrenCount; index++) {
                let item = this.rewardLayout.children[index];
                item.active = false
            }

            for (let i = 0; i < data.items.length; i++) {
                let item = this.rewardLayout.children[i]
                if (!item) {
                    item = cc.instantiate(this.rewardItem)
                    item.parent = this.rewardLayout
                }
                item.active = true
                let ctrl = item.getComponent(ExpeditionRewardItemCtrl)
                let addNum = data.hourReward[i] ? data.hourReward[i].num : 0
                ctrl.updateViewInfo(data.items[i].typeId, data.items[i].num, addNum)
            }

            this.oneKeyGet.active = data.items.length > 0
        })
    }

    /**展示选择窗口 */
    showStageFunc() {
        this.hideStageNode.active = false
        this.showStageNode.active = true
        this.showStageNode.getComponent(cc.Button).enabled = false
        this.hideStageNode.getComponent(cc.Button).enabled = false
        this.showStageNode.x = -360 - this.showStageNode.width
        let action = cc.sequence(cc.moveTo(0.3, cc.v2(-360, this.showStageNode.y)), cc.callFunc(() => {
            this.showStageNode.getComponent(cc.Button).enabled = true
            this.hideStageNode.getComponent(cc.Button).enabled = true
            this._updatePassTip()
        }))
        this.showStageNode.runAction(action)
    }

    _updatePassTip() {
        //提示
        let proDatas = ExpeditionUtils.getMapProcess()
        let str = this.mapCfg.prompt
        proDatas.forEach(element => {
            str = str.replace("%s", `${element.a}/${element.b}`)
        });
        cc.find("bg/richLab", this.showStageNode).getComponent(cc.RichText).string = str
    }

    /**隐藏选择窗口 */
    hideStageFunc() {
        this.showStageNode.getComponent(cc.Button).enabled = false
        this.hideStageNode.getComponent(cc.Button).enabled = false
        let action = cc.sequence(cc.moveTo(0.3, cc.v2(-360 - this.showStageNode.width, this.showStageNode.y)), cc.callFunc(() => {
            this.showStageNode.active = false
            this.hideStageNode.active = true
            this.showStageNode.getComponent(cc.Button).enabled = true
            this.hideStageNode.getComponent(cc.Button).enabled = true
        }))
        this.showStageNode.runAction(action)
    }

    oneKeyGetFunc() {
        let msg = new icmsg.ExpeditionHangupRewardReq()
        NetManager.send(msg, (data: icmsg.ExpeditionHangupRewardRsp) => {
            let worldPos = this.btnArmyStrengh.parent.convertToWorldSpaceAR(this.btnArmyStrengh.getPosition());
            let extInfo = {}
            data.rewards.forEach(element => {
                extInfo[element.typeId] = worldPos
            });

            GlobalUtil.openRewadrView(data.rewards, null, extInfo)
            this.showRewardNode()
            this.oneKeyGet.active = false
        })
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