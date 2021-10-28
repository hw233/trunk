import ConfigManager from '../../../../common/managers/ConfigManager';
import FHSendRewardSetItem2 from './FHSendRewardSetItem2';
import FootHoldModel, { FhRankItemInfo, FhSendRewardInfo2 } from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import TriggerEliteTipsViewCtrl from '../../../map/ctrl/TriggerEliteTipsViewCtrl';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Foothold_globalCfg } from '../../../../a/config';
import { FootHoldEventId } from '../../enum/FootHoldEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-25 17:02:47
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHSendRewardRankItem")
export default class FHSendRewardRankItem extends cc.Component {

    @property(cc.Node)
    rank: cc.Node = null;

    @property(cc.Label)
    rank2: cc.Label = null;

    @property(cc.Label)
    fightNum: cc.Label = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    @property(cc.Node)
    selectIcon: cc.Node = null;

    rewardList: ListView = null;
    _info: icmsg.GuildDropRecord = null
    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    _ctrl1 = []
    _ctrl2 = []
    _ctrl3 = []
    _index = 0

    _isInit = true

    onEnable() {
        this._index = 0
        this._initContentReward()
    }

    updateViewInfo(rank, info) {
        let index = rank
        this._info = info

        this.footHoldModel.sendPlayerRecordCtrl[this._info.playerId] = [...this._ctrl1, ...this._ctrl2, ...this._ctrl3]

        if (index <= 3) {
            this.rank.active = true
            this.rank2.node.active = false
            GlobalUtil.setSpriteIcon(this.node, this.rank, FootHoldUtils.getTop3RankIconPath(index))
        } else {
            this.rank.active = false
            this.rank2.node.active = true
            this.rank2.string = `${index}`
        }

        this.fightNum.string = `${this._info.footholdNum}`
        this.nameLab.string = `${this._info.playerName}`

        //this.selectIcon.active = this.data.isSelect

        this.updateReward()
    }

    updateReward() {
        let rewards = this._info.goods
        let preSends = FootHoldUtils.getSendRecord(this._info.playerId)
        let itemIndex = 0
        rewards.forEach(element => {
            for (let i = 0; i < element.num; i++) {
                preSends[itemIndex] = element.typeId
                itemIndex++
            }
        });
        if (this._isInit) {
            this._isInit = false
            this._putReward(preSends)
        } else {
            let preSends = FootHoldUtils.getSendRecord(this._info.playerId)
            this._putPreSend(preSends)
        }

        if (this.footHoldModel.sendPlayerUpdate) {
            let rewards = FootHoldUtils.getSendRecord(this._info.playerId)
            let ctrls: FHSendRewardSetItem2[] = this.footHoldModel.sendPlayerRecordCtrl[this._info.playerId] || []
            for (let index = 0; index < rewards.length; index++) {
                if (rewards[index] == 0) {
                    continue
                }
                ctrls[index].updateViewInfo(this._info.playerId, rewards[index], true)
            }
        }
    }

    updateSelect(isSelect) {
        this.selectIcon.active = isSelect
    }


    selectFunc() {
        if (this.footHoldModel.fhSendSelectPlayer && this._info.playerId == this.footHoldModel.fhSendSelectPlayer.playerId) {
            this.footHoldModel.fhSendSelectPlayer = null
        } else {
            this.footHoldModel.fhSendSelectPlayer = this._info
        }
        gdk.e.emit(FootHoldEventId.REFRESH_FOOTHOLD_SEND_LIST)
    }

    _putReward(ids) {
        if (ids.length == 0) {
            return
        }

        let ctrls: FHSendRewardSetItem2[] = this.footHoldModel.sendPlayerRecordCtrl[this._info.playerId] || []

        for (let index = 0; index < ids.length; index++) {
            if (ids[index] == 0) {
                continue
            }
            let type = FootHoldUtils.getRewardType(ids[index])
            ctrls = this._getCtrlsByType(ctrls, type)
            for (let i = 0; i < ctrls.length; i++) {
                if (ctrls[i].rewardType <= type && ctrls[i].itemId == 0 && !ctrls[i].hasSend.active) {
                    ctrls[i].updateViewInfo(this._info.playerId, ids[index], true)
                    break
                }
            }
        }
    }

    _putPreSend(ids) {
        if (ids.length == 0) {
            return
        }
        let ctrls: FHSendRewardSetItem2[] = this.footHoldModel.sendPlayerRecordCtrl[this._info.playerId] || []
        for (let index = 0; index < ids.length; index++) {
            if (ids[index] == 0) {
                continue
            }
            let type = FootHoldUtils.getRewardType(ids[index])
            if (ctrls[index].rewardType == type && ctrls[index].itemId == 0 && !ctrls[index].hasSend.active) {
                ctrls[index].updateViewInfo(this._info.playerId, ids[index])
            }
        }
    }

    _initContentReward() {
        let show1Cfg = ConfigManager.getItemById(Foothold_globalCfg, "reward_show1").value
        let show2Cfg = ConfigManager.getItemById(Foothold_globalCfg, "reward_show2").value
        let show3Cfg = ConfigManager.getItemById(Foothold_globalCfg, "reward_show3").value
        this.content.removeAllChildren()
        this._ctrl1 = []
        this._ctrl2 = []
        this._ctrl3 = []
        this._createItem(show1Cfg[1], show1Cfg[0])
        this._createItem(show2Cfg[1], show2Cfg[0])
        this._createItem(show3Cfg[1], show3Cfg[0])
    }

    _createItem(num, type) {
        for (let i = 0; i < num; i++) {
            let item = cc.instantiate(this.rewardItem)
            let ctrl = item.getComponent(FHSendRewardSetItem2)
            ctrl.updateBg(type, this._index)
            this.content.addChild(item)
            this["_ctrl" + type].push(ctrl)
            this._index++
        }
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