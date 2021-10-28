import FootHoldModel from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { FootHoldEventId } from '../../enum/FootHoldEventId';
import { GuildAccess } from '../../model/GuildModel';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-18 16:27:46
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHSendRewardSetItem2")
export default class FHSendRewardSetItem2 extends cc.Component {

    @property(cc.Node)
    bgIcon: cc.Node = null;

    @property(cc.Label)
    bgLab: cc.Label = null;

    @property(UiSlotItem)
    uiSlot: UiSlotItem = null;

    @property(cc.Node)
    hasSend: cc.Node = null;

    _typeName = ["珍稀", "极品", "豪华"]
    _type = 0
    _itemId = 0
    _playerId = 0
    _index = 0

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    get rewardType() {
        return this._type
    }

    get itemId() {
        return this._itemId
    }

    onEnable() {

    }

    updateBg(type, index) {
        this._type = type
        this._index = index
        GlobalUtil.setSpriteIcon(this.node, this.bgIcon, `view/guild/texture/footHold/cross/rewardBg_${type}`)
        this.bgLab.string = `${this._typeName[type - 1]}`
    }

    updateViewInfo(playerId, itemId, hasSend: boolean = false) {
        this._playerId = playerId
        this._itemId = itemId
        this.uiSlot.node.active = false
        this.hasSend.active = false
        if (this._itemId > 0) {
            this.hasSend.active = hasSend
            this.uiSlot.node.active = true
            this.uiSlot.updateItemInfo(itemId)
        }
    }

    clickFunc() {
        if (!GuildUtils.isCanOperate(this.roleModel.id, GuildAccess.SendFhReward)) {
            return
        }

        if (this._itemId > 0 && this._playerId > 0 && this.hasSend.active == false) {
            let ids = FootHoldUtils.getSendRecord(this._playerId)
            ids[this._index] = 0

            //自动更新格子信息
            let isReplace = false
            if (this._type == 3 || this._type == 2) {
                for (let i = 0; i < ids.length; i++) {
                    let id = ids[i]
                    if (id > 0) {
                        if (this._isItemCanReplace(id, i, this._index)) {
                            ids[i] = 0
                            ids[this._index] = id
                            let ctrls: FHSendRewardSetItem2[] = this.footHoldModel.sendPlayerRecordCtrl[this._playerId] || []
                            if (ctrls[i]) {
                                ctrls[i].updateViewInfo(this._playerId, 0)
                            }

                            if (ctrls[this._index]) {
                                ctrls[this._index].updateViewInfo(this._playerId, id)
                                isReplace = true
                            }
                            break
                        }
                    }
                }
            }
            this.footHoldModel.sendPlayerRecord[this._playerId] = ids
            this.footHoldModel.sendPlayerRecord = this.footHoldModel.sendPlayerRecord
            if (!isReplace) {
                this.uiSlot.node.active = false
                this._playerId = 0
                this._itemId = 0
            }

            gdk.e.emit(FootHoldEventId.REFRESH_FOOTHOLD_SEND_REWARD_STATE)
        }
    }


    _isItemCanReplace(itemId, preIndex, targetIndex) {
        let ctrls: FHSendRewardSetItem2[] = this.footHoldModel.sendPlayerRecordCtrl[this._playerId] || []
        if (ctrls[preIndex] && ctrls[targetIndex]) {
            if (ctrls[preIndex].rewardType < this._type && ctrls[preIndex].itemId > 0 && FootHoldUtils.getRewardType(itemId) >= ctrls[targetIndex].rewardType) {
                return true
            }
        }
        return false
    }
}