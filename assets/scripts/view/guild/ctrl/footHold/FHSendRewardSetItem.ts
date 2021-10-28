import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import FHSendRewardSetItem2 from './FHSendRewardSetItem2';
import FootHoldModel, { FhSendRewardInfo } from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';
import { Foothold_globalCfg } from '../../../../a/config';
import { GuildAccess } from '../../model/GuildModel';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-18 16:27:21
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHSendRewardSetItem")
export default class FHSendRewardSetItem extends cc.Component {


    @property(UiSlotItem)
    uiSlot: UiSlotItem = null;

    @property(cc.Node)
    selectIcon: cc.Node = null;

    @property(cc.Label)
    leftLab: cc.Label = null;

    @property(cc.Node)
    btnSend: cc.Node = null;

    _info: FhSendRewardInfo

    holdTimeEclipse = 0;    //用来检测长按
    holdClick = false;       //用来检测点击

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        // this.node.on(cc.Node.EventType.TOUCH_START, (e: cc.Event.EventTouch) => {
        //     this.holdClick = true
        // }, this)

        // this.node.on(cc.Node.EventType.TOUCH_END, (e: cc.Event.EventTouch) => {
        //     this.holdClick = false
        //     this.holdTimeEclipse = 0
        // }, this)

        // this.node.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Event.EventTouch) => {
        //     this.holdClick = false
        //     this.holdTimeEclipse = 0
        //     this.footHoldModel.fhLongTouch = false
        // }, this)

    }

    // update() {
    //     if (this.holdClick) {
    //         this.holdTimeEclipse++;
    //         if (this.holdTimeEclipse >= 40) {
    //             let itemInfo: BagItem = {
    //                 series: 0,
    //                 itemId: this._info.id,
    //                 itemNum: 1,
    //                 type: BagUtils.getItemTypeById(this._info.id),
    //                 extInfo: null,
    //             }
    //             GlobalUtil.openItemTips(itemInfo)
    //             this.footHoldModel.fhLongTouch = true
    //             //开始记录时间
    //             this.holdTimeEclipse = 0;
    //             this.holdClick = false;
    //         }
    //     }
    // }

    updateViewInfo(info: FhSendRewardInfo) {
        this._info = info
        this.uiSlot.updateItemInfo(this._info.id, 1)
        this.uiSlot.itemInfo = {
            series: 0,
            itemId: this._info.id,
            itemNum: 1,
            type: BagUtils.getItemTypeById(this._info.id),
            extInfo: null,
        }
        this.leftLab.string = `${this._info.count}`
        GlobalUtil.setGrayState(this.btnSend, 0)
        if (this.footHoldModel.fhSendSelectPlayer) {
            let playerId = this.footHoldModel.fhSendSelectPlayer.playerId
            let ctrls: FHSendRewardSetItem2[] = this.footHoldModel.sendPlayerRecordCtrl[playerId] || []
            let targetType = 0
            for (let i = 0; i < ctrls.length; i++) {
                if (ctrls[i].itemId == 0) {
                    targetType = ctrls[i].rewardType
                    break
                }
            }
            let type = FootHoldUtils.getRewardType(this._info.id)
            if (type < targetType || targetType == 0) {
                GlobalUtil.setGrayState(this.btnSend, 1)
            }
        }

        if (this._info.count == 0) {
            GlobalUtil.setGrayState(this.btnSend, 1)
        }
    }

    sendFunc() {
        if (!GuildUtils.isCanOperate(this.roleModel.id, GuildAccess.SendFhReward)) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP18"))
            return
        }

        if (this.footHoldModel.fhSendSelectPlayer == null) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP74"))
            return
        }

        if (this._info.count <= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP75"))
            return
        }
        let playerId = this.footHoldModel.fhSendSelectPlayer.playerId
        //判断是否符合条件放入
        let type = FootHoldUtils.getRewardType(this._info.id)
        if (FootHoldUtils.checkTypeNumIsFull(playerId, type)) {
            return
        }
        let ctrls: FHSendRewardSetItem2[] = this.footHoldModel.sendPlayerRecordCtrl[playerId] || []

        ctrls = this._getCtrlsByType(ctrls, type)

        //同级别的
        let isPut = false
        for (let i = 0; i < ctrls.length; i++) {
            if (ctrls[i].rewardType == type && ctrls[i].itemId == 0) {
                ctrls[i].updateViewInfo(playerId, this._info.id)
                isPut = true
                break
            }
        }

        if (!isPut) {
            for (let i = 0; i < ctrls.length; i++) {
                if (ctrls[i].rewardType < type && ctrls[i].itemId == 0) {
                    ctrls[i].updateViewInfo(playerId, this._info.id)
                    break
                }
            }
        }

        this.footHoldModel.sendPlayerUpdate = false
        let record = FootHoldUtils.getSendRecord(playerId)
        this.footHoldModel.sendPlayerRecord[playerId] = record
        this.footHoldModel.sendPlayerRecord = this.footHoldModel.sendPlayerRecord
    }

    _getCtrlsByType(ctrls: FHSendRewardSetItem2[], type) {
        let arr1 = []
        let arr2 = []
        let arr3 = []

        let newArr = []
        for (let i = 0; i < ctrls.length; i++) {
            if (ctrls[i]._type == 1) {
                arr1.push(ctrls[i])
            } else if (ctrls[i]._type == 2) {
                arr2.push(ctrls[i])
            } else {
                arr3.push(ctrls[i])
            }
        }
        // arr1 = arr1.reverse()
        // arr2 = arr2.reverse()
        // arr3 = arr3.reverse()
        if (type == 1) {
            newArr = [...arr1, ...arr2, ...arr3]
        } else if (type == 2) {
            newArr = [...arr2, ...arr1, ...arr3]
        } else {
            newArr = [...arr3, ...arr2, ...arr1]
        }
        return newArr
    }
}