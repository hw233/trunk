import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import SailingModel, { SailingPathInfo } from '../../model/SailingModel';
import SailingTreasureMapCtrl from './SailingTreasureMapCtrl';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagEvent } from '../../../bag/enum/BagEvent';
import { ItemCfg, Sailing_globalCfg } from '../../../../a/config';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';
import { SailingEventId } from './SailingEventId';
/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-05 17:27:42
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/sailing/SailingTreasurePanelCtrl")
export default class SailingTreasurePanelCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bg: cc.Node = null

    @property(SailingTreasureMapCtrl)
    tiledMapCtrl: SailingTreasureMapCtrl = null

    @property(cc.ScrollView)
    tiledMapScrollView: cc.ScrollView = null

    @property(cc.Prefab)
    boatPre: cc.Prefab = null;

    @property(cc.Prefab)
    pathPre: cc.Prefab = null;

    @property(cc.RichText)
    tipLab: cc.RichText = null;

    @property(cc.Node)
    maskNode: cc.Node = null;

    @property(cc.Node)
    tabBtns: cc.Node[] = [];

    @property(cc.Node)
    dailyHasGet: cc.Node = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    _selectIndex = 0
    _speedTime = 0.2
    activityId: number = 123;
    _scaleNum = 0.5

    get sailingModel(): SailingModel { return ModelManager.get(SailingModel); }

    onEnable() {

        let startTime = new Date(ActUtil.getActStartTime(this.activityId));
        let endTime = new Date(ActUtil.getActEndTime(this.activityId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            this.close();
            return;
        }
        else {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        }

        gdk.e.on(SailingEventId.SAILING_BOAT_MOVE, this._updateMoveBoat, this)
        gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this._updateItem, this)
        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateItem, this)

        this._updateItem()
        this._updateDailyFree()
        // 加载并初始化地图
        gdk.rm.loadRes(this.resId, `tileMap/sailing/${1001}`, cc.TiledMapAsset, (tmx: cc.TiledMapAsset) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.tiledMapCtrl.initMap(this, tmx);
            this.tiledMapCtrl.resetSize();
        });

        this.sailingModel.isOpenTreasure = true
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    onDisable() {
        gdk.e.targetOff(this)
        this.unscheduleAllCallbacks()
    }

    selectType(e, index) {
        this._selectIndex = parseInt(index)
        for (let i = 0; i < this.tabBtns.length; i++) {
            let node = this.tabBtns[i]
            let btn = node.getComponent(cc.Button)
            btn.interactable = index != i
            let select = node.getChildByName("select")
            let normal = node.getChildByName("normal")
            select.active = index == i
            normal.active = index != i
        }

        let boxCtrlMap = this.sailingModel.boxCtrlMap
        for (let key in boxCtrlMap) {
            let ctrl = boxCtrlMap[key]
            ctrl.showReward(this._selectIndex == 1)
        }
    }

    /**刷新据点信息 */
    refreshPoints() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;

        this._initBoat()
        this.selectType(null, this._selectIndex)
    }

    /**初始化船的位置 */
    _initBoat() {
        //指挥官位置
        let boatNode = this.tiledMapCtrl.mapLayer.node.getChildByName("sailing_boat")
        if (!boatNode) {
            boatNode = cc.instantiate(this.boatPre)
            boatNode.name = "sailing_boat"
            this.tiledMapCtrl.mapLayer.node.addChild(boatNode)
        }
        let pointDatas = this.sailingModel.pointDatas
        let initPointInfo = pointDatas[0][0]
        this.tiledMapCtrl.pathLayer.removeAllChildren()
        this.tiledMapCtrl.tiledMap.node.setPosition(-initPointInfo.mapPoint.x * this._scaleNum, -initPointInfo.mapPoint.y * this._scaleNum)
        boatNode.setPosition(initPointInfo.mapPoint.x, initPointInfo.mapPoint.y + 100)
    }

    _updateMoveBoat(e: gdk.Event) {
        let target = parseInt(e.data)
        this.moveBoat(target)
    }

    /**小船移动 */
    moveBoat(targetType) {
        this.maskNode.active = true
        let pathLayer = this.tiledMapCtrl.tiledMap.getObjectGroup("path" + targetType);
        let points = pathLayer.getObjects()
        let obj: { [key: string]: boolean } = {};
        let paths: SailingPathInfo[] = []

        for (let i = 0, n = points.length; i < n; i++) {
            let p = points[i];
            let pos = this.tiledMapCtrl._getTilePosByMapPos(cc.v2(p.x, p.y));
            let key = `${pos.x}-${pos.y}`;
            if (obj[key]) {
                CC_DEBUG && cc.error('据点重复', p);
                continue;
            }
            obj[key] = true;
            let type = parseInt(p.name);
            let info: SailingPathInfo = {
                id: p.id,
                type: type,
                mapPoint: cc.v2(p.x, p.y),
                pos: pos,
            }
            paths.push(info)
        }

        this.tiledMapCtrl.pathLayer.removeAllChildren()
        let pathIndex = 0
        this.schedule(() => {
            if (pathIndex < paths.length) {
                let pathItem = cc.instantiate(this.pathPre)
                pathItem.setPosition(paths[pathIndex].mapPoint.x, paths[pathIndex].mapPoint.y + this.tiledMapCtrl.tiledMap.getTileSize().height / 2);
                this.tiledMapCtrl.pathLayer.addChild(pathItem)
            }
            pathIndex++
        }, this._speedTime, paths.length)

        GlobalUtil.sortArray(paths, (a, b) => {
            return a.type - b.type
        })

        this.moveView(paths[paths.length - 1], paths.length * this._speedTime)


        let pointDatas = this.sailingModel.pointDatas
        let initPointInfo = pointDatas[0][0]

        let boatNode = this.tiledMapCtrl.mapLayer.node.getChildByName("sailing_boat")
        let index = 0
        this.schedule(() => {
            let scaleX = 1
            if (paths[index].mapPoint.x < initPointInfo.mapPoint.x) {
                scaleX = -1
            }
            boatNode.scaleX = scaleX
            boatNode.setPosition(paths[index].mapPoint.x, paths[index].mapPoint.y + 100)
            index++
            if (index >= paths.length) {
                this.unscheduleAllCallbacks()
                this.maskNode.active = false

                let msg = new icmsg.ActivitySailingMapRewardReq()
                msg.type = this.sailingModel.activityType
                msg.plateId = targetType
                NetManager.send(msg, (data: icmsg.ActivitySailingMapRewardRsp) => {
                    gdk.e.on("popup#Reward#close", this._closeReward, this);
                    GlobalUtil.openRewadrView(data.goodsList)
                    this.sailingModel.sailingInfo.mapRewarded += Math.pow(2, targetType - 1)
                    gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
                })
            }
        }, this._speedTime, paths.length, 0.4)
    }

    _closeReward() {
        this.refreshPoints()
        gdk.e.off("popup#Reward#close", this._closeReward, this);
    }

    /**视觉移动 */
    moveView(info: SailingPathInfo, durT: number) {
        let node = this.tiledMapCtrl.tiledMap.node;
        node.stopAllActions()
        this.tiledMapScrollView.stopAutoScroll()

        let pointDatas = this.sailingModel.pointDatas
        let initPointInfo = pointDatas[0][0]
        node.setPosition(-initPointInfo.mapPoint.x * this._scaleNum, -initPointInfo.mapPoint.y * this._scaleNum)

        let pos = cc.v2(-info.mapPoint.x * this._scaleNum, -info.mapPoint.y * this._scaleNum)
        node.stopAllActions();
        node.runAction(
            cc.sequence(
                cc.moveTo(durT, pos),
                cc.callFunc(() => {

                }),
            )
        );
    }

    _updateItem() {
        let itemId = ConfigManager.getItemById(Sailing_globalCfg, "sailing_item").value[0]
        let cfg = ConfigManager.getItemById(ItemCfg, itemId)
        this.tipLab.string = `剩余${cfg.name}:<color=#ffc600>${BagUtils.getItemNumById(itemId)}</c>`
        this.slotItem.updateItemInfo(itemId)
        this.slotItem.itemInfo = {
            series: 0,
            itemId: itemId,
            itemNum: 1,
            type: BagUtils.getItemTypeById(itemId),
            extInfo: null
        };
    }

    onGetDailyReward() {
        if (this.sailingModel.sailingInfo.freeRewarded) {
            gdk.gui.showMessage(`奖励已领取`)
            return
        }
        let msg = new icmsg.ActivitySailingFreeReq()
        NetManager.send(msg, (data: icmsg.ActivitySailingFreeRsp) => {
            GlobalUtil.openRewadrView(data.goodsList)
            this.sailingModel.sailingInfo.freeRewarded = data.freeRewarded
            this._updateDailyFree()
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
        })
    }

    _updateDailyFree() {
        this.dailyHasGet.active = this.sailingModel.sailingInfo.freeRewarded
    }
}