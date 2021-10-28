import FHSendRewardRankItem from './FHSendRewardRankItem';
import FHSendRewardSetContentCtrl from './FHSendRewardSetContentCtrl';
import FHSendRewardSetItem2 from './FHSendRewardSetItem2';
import FootHoldModel, { FhSendRewardInfo } from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import { AskInfoType } from '../../../../common/widgets/AskPanel';
import { FootHoldEventId } from '../../enum/FootHoldEventId';
import { GuildAccess } from '../../model/GuildModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { type } from 'os';


/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-07 12:07:26
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHSendRewardCtrl")
export default class FHSendRewardCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    rankScrollView: cc.ScrollView = null;

    @property(cc.Node)
    rankContent: cc.Node = null

    @property(cc.Prefab)
    rankItem: cc.Prefab = null

    @property(cc.ScrollView)
    rewardScrollView: cc.ScrollView = null;

    @property(cc.Node)
    rewardContent: cc.Node = null

    @property(cc.Prefab)
    contenItem: cc.Prefab = null

    @property(cc.Label)
    numLab: cc.Label = null

    rankList: ListView
    rewardList: ListView

    _contentCtrl: FHSendRewardSetContentCtrl[] = []
    _rankCtrl: FHSendRewardRankItem[] = []

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        this._initRewardContent()
        gdk.e.on(FootHoldEventId.REFRESH_FOOTHOLD_SEND_REWARD_STATE, this._updateSendData, this)
        gdk.e.on(FootHoldEventId.REFRESH_FOOTHOLD_SEND_LIST, this._updateData, this)


        NetManager.on(icmsg.GuildDropStateRsp.MsgType, this._onGuildDropStateRsp, this)
        let msg = new icmsg.GuildDropStateReq()
        NetManager.send(msg)
    }

    onDisable() {
        NetManager.targetOff(this)
        gdk.e.targetOff(this)

        this.footHoldModel.sendPlayerRecord = {}
        this.footHoldModel.sendPlayerRecordCtrl = {}
        this.footHoldModel.fhSendSelectPlayer = null
        this.footHoldModel.sendPlayerUpdate = false
    }

    // _initRankListView() {
    //     if (this.rankList) {
    //         return
    //     }
    //     this.rankList = new ListView({
    //         scrollview: this.rankScrollView,
    //         mask: this.rankScrollView.node,
    //         content: this.rankContent,
    //         item_tpl: this.rankItem,
    //         cb_host: this,
    //         async: true,
    //         // gap_x: 5,
    //         direction: ListViewDir.Vertical,
    //     })
    //     this.rankList.onClick.on(this._selectRankItem, this);
    // }

    // _selectRankItem(item: any, index: number,) {
    //     let datas: any[] = this.rankList.datas
    //     if (this.footHoldModel.fhSendSelectPlayer && item.info.playerId == this.footHoldModel.fhSendSelectPlayer.info.playerId) {
    //         for (let i = 0; i < datas.length; i++) {
    //             datas[i].isSelect = false
    //             this.rankList.refresh_item(i)
    //         }
    //         this.footHoldModel.fhSendSelectPlayer = null
    //     } else {
    //         this.footHoldModel.fhSendSelectPlayer = item
    //         for (let i = 0; i < datas.length; i++) {
    //             datas[i].isSelect = false
    //             this.rankList.refresh_item(i)
    //         }
    //         item.isSelect = true
    //         this.rankList.refresh_item(index)
    //     }
    //     this._updateSendData()
    // }

    _initRankContent() {
        let list = this.footHoldModel.fhDropRecord
        GlobalUtil.sortArray(list, (a: icmsg.GuildDropRecord, b: icmsg.GuildDropRecord) => {
            return b.footholdNum - a.footholdNum
        })
        for (let i = 0; i < list.length; i++) {
            let item = cc.instantiate(this.rankItem)
            this.rankContent.addChild(item)
            let ctrl = item.getComponent(FHSendRewardRankItem)
            ctrl.updateViewInfo(i + 1, list[i])
            ctrl.updateSelect(false)
            this._rankCtrl.push(ctrl)
        }
    }

    _initRewardContent() {
        let types = [1, 2, 3]
        for (let i = 0; i < types.length; i++) {
            let content = cc.instantiate(this.contenItem)
            this.rewardContent.addChild(content)
            let ctrl = content.getComponent(FHSendRewardSetContentCtrl)
            ctrl.updateTypeIcon(types[i])
            this._contentCtrl.push(ctrl)
        }
    }

    /*成员列表奖励 */
    _updateRankData() {
        if (this._rankCtrl.length == 0) {
            this._initRankContent()
        }
        // this._initRankListView()
        // let list = this.footHoldModel.fhDropRecord
        // let newList = []
        // for (let i = 0; i < list.length; i++) {
        //     let isSelect = false
        //     if (this.footHoldModel.fhSendSelectPlayer && this.footHoldModel.fhSendSelectPlayer.info.playerId == list[i].playerId) {
        //         isSelect = true
        //     }
        //     newList.push({ index: i + 1, info: list[i], isSelect: isSelect })
        // }
        // this.rankList.set_data(newList, false)
        let ctrls = this._rankCtrl
        for (let i = 0; i < ctrls.length; i++) {
            ctrls[i].updateSelect(false)
            if (this.footHoldModel.fhSendSelectPlayer && this.footHoldModel.fhSendSelectPlayer.playerId == ctrls[i]._info.playerId) {
                ctrls[i].updateSelect(true)
            }
            if (ctrls[i]._info) {
                ctrls[i].updateReward()
            }
        }
        this.numLab.string = `${this._getHasSendNum()}/${this.footHoldModel.fhDropRecord.length}`
    }


    _getHasSendNum() {
        let list = this.footHoldModel.fhDropRecord
        let count = 0
        for (let i = 0; i < list.length; i++) {
            if (list[i].goods.length > 0) {
                count++
            }
        }
        return count
    }

    @gdk.binding("footHoldModel.sendPlayerRecord")
    _updateData() {
        this._updateRankData()
        this._updateSendData()
    }

    _onGuildDropStateRsp(data: icmsg.GuildDropStateRsp) {
        this.footHoldModel.fhDropGoods = data.goodsList
        this.footHoldModel.fhDropRecord = data.recordList

        this._updateRankData()
        this._updateSendData()

    }

    _updateSendData() {
        let goods = []
        let datas = this.footHoldModel.fhDropGoods
        for (let j = 0; j < datas.length; j++) {
            let info: FhSendRewardInfo = {
                id: datas[j].goods.typeId,
                num: datas[j].goods.num,
                count: datas[j].count - this._getSendItemCount(datas[j].goods.typeId),
            }
            goods.push(info)
        }
        let types = [1, 2, 3]
        for (let i = 0; i < types.length; i++) {
            this._contentCtrl[i].updateViewInfo(this._getRewardsByType(types[i], goods))
        }
    }

    _getRewardsByType(showType, rewards) {
        let goods = []
        for (let i = 0; i < rewards.length; i++) {
            let type = FootHoldUtils.getRewardType(rewards[i].id)
            if (type == showType) {
                goods.push(rewards[i])
            }
        }
        return goods
    }

    _getSendItemCount(itemId) {
        let ctrls = this.footHoldModel.sendPlayerRecordCtrl
        let count = 0
        for (let key in ctrls) {
            let items: FHSendRewardSetItem2[] = ctrls[key]
            for (let i = 0; i < items.length; i++) {
                if (!items[i].hasSend.active && items[i].itemId == itemId) {
                    count++
                }
            }
        }
        return count
    }


    sendFunc() {
        if (!GuildUtils.isCanOperate(this.roleModel.id, GuildAccess.SendFhReward)) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP18"))
            return
        }
        let datas = this.footHoldModel.sendPlayerRecordCtrl
        let objArr = []
        for (let key in datas) {
            let info = new icmsg.GuildDropAllotOp()
            let ctrls: FHSendRewardSetItem2[] = datas[key]
            info.targetId = parseInt(key)
            for (let i = 0; i < ctrls.length; i++) {
                if (ctrls[i].itemId > 0 && !ctrls[i].hasSend.active) {
                    let item = new icmsg.GuildDropAllotItem()
                    item.itemType = ctrls[i].itemId
                    item.itemNum = 1
                    item.subNum = 1
                    info.items.push(item)
                }
            }
            if (info.items.length > 0) {
                objArr.push(info)
            }
        }
        if (objArr.length > 0) {
            let info: AskInfoType = {
                title: "",
                sureCb: () => {
                    let msg = new icmsg.GuildDropAllotReq()
                    msg.operations = objArr
                    NetManager.send(msg, () => {
                        this.footHoldModel.sendPlayerUpdate = true
                        let s_msg = new icmsg.GuildDropStateReq()
                        NetManager.send(s_msg)

                        let s_msg2 = new icmsg.GuildDropStoredReq()
                        NetManager.send(s_msg2)

                    }, this)
                },
                descText: gdk.i18n.t("i18n:FOOTHOLD_TIP76"),
                thisArg: this,
            }
            GlobalUtil.openAskPanel(info)
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP77"))
        }
    }

    oneKeyPreSendFunc() {
        if (!GuildUtils.isCanOperate(this.roleModel.id, GuildAccess.SendFhReward)) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP18"))
            return
        }

        let datas = this.footHoldModel.sendPlayerRecordCtrl
        let hasPutItems = {}  //id--num
        for (let key in datas) {
            let ctrls: FHSendRewardSetItem2[] = datas[key]
            for (let i = 0; i < ctrls.length; i++) {
                if (ctrls[i].itemId > 0) {
                    if (hasPutItems[ctrls[i].itemId]) {
                        hasPutItems[ctrls[i].itemId] += 1
                    } else {
                        hasPutItems[ctrls[i].itemId] = 1
                    }
                }
            }
        }

        let goods = this.footHoldModel.fhDropGoods
        let newGoods = []
        for (let i = 0; i < goods.length; i++) {
            let id = goods[i].goods.typeId
            let leftNum = goods[i].count
            if (hasPutItems[id]) {
                leftNum = goods[i].count - hasPutItems[id]
            }
            newGoods.push({ id: id, num: leftNum })
        }

        for (let key in datas) {
            let playerId = parseInt(key)
            let ctrls: FHSendRewardSetItem2[] = datas[key]
            for (let i = 0; i < ctrls.length; i++) {
                if (ctrls[i].itemId == 0) {
                    for (let j = 0; j < newGoods.length; j++) {
                        let isPut = false
                        let type = FootHoldUtils.getRewardType(newGoods[j].id)
                        if (ctrls[i].rewardType == type && newGoods[j].num > 0) {
                            ctrls[i].updateViewInfo(playerId, newGoods[j].id)
                            newGoods[j].num--
                            isPut = true
                            break
                        }
                        if (!isPut) {
                            if (ctrls[i].rewardType < type && newGoods[j].num > 0) {
                                ctrls[i].updateViewInfo(playerId, newGoods[j].id)
                                newGoods[j].num--
                                break
                            }
                        }
                    }
                } else {
                    for (let j = 0; j < newGoods.length; j++) {
                        if (newGoods[j].id == ctrls[i].itemId && newGoods[j].num > 0) {
                            newGoods[j].num--
                        }
                    }
                }
            }
            let record = FootHoldUtils.getSendRecord(playerId)
            this.footHoldModel.sendPlayerRecord[playerId] = record
        }
        this.footHoldModel.sendPlayerUpdate = false
        this.footHoldModel.sendPlayerRecord = this.footHoldModel.sendPlayerRecord
    }

}