import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import ServerModel from '../../../../common/models/ServerModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import VipFlagCtrl from '../../../../common/widgets/VipFlagCtrl';
import { FhDetailDmgInfo } from './FootHoldPointDetailCtrl';


/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-04 01:54:31
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHPointDetailItemCtrl")
export default class FHPointDetailItemCtrl extends UiListItem {

    @property(cc.Node)
    rank1: cc.Node = null;

    @property(cc.Label)
    rank2: cc.Label = null;

    @property(cc.Node)
    rankNum: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    head: cc.Node = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    vipFlag: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    dmgLab: cc.Label = null;

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    serverLab: cc.Label = null;

    _info: FhDetailDmgInfo

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    updateView() {
        this._info = this.data
        let player = FootHoldUtils.findPlayer(this._info.playerId)
        if (!player) {
            let msg = new icmsg.FootholdLookupPlayerReq()
            msg.playerId = this._info.playerId
            NetManager.send(msg, (data: icmsg.FootholdLookupPlayerRsp) => {
                this.footHoldModel.fhPlayers.push(data.player)
                this._updatePlayerData(data.player)
            })
        } else {
            this._updatePlayerData(player)
        }
        this.dmgLab.string = `${GlobalUtil.numberToStr(this._info.dmg, true)}`
        this.rank2.string = `${this._info.index}`
        this.slot.updateItemInfo(this._info.reward[0], Math.floor(this._info.dmg / this._info.totalHp * this._info.reward[1]))
        this.slot.itemInfo = {
            series: this._info.reward[0],
            itemId: this._info.reward[0],
            itemNum: 1,
            type: BagUtils.getItemTypeById(this._info.reward[0]),
            extInfo: null
        }
    }

    async _updatePlayerData(data: icmsg.FootholdPlayer) {
        this.nameLab.string = `${data.name}`
        this.lvLab.string = `.${data.level}`
        GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(data.headFrame))
        GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(data.head))
        let ctrl = this.vipFlag.getComponent(VipFlagCtrl)
        ctrl.updateVipLv(GlobalUtil.getVipLv(data.vipExp))
        this.serverLab.node.active = false
        if (FootHoldUtils.isCrossWar) {
            this.serverLab.node.active = true
            this.serverLab.string = `[s${GlobalUtil.getSeverIdByPlayerId(data.id)}]`
            await ModelManager.get(ServerModel).reqServerNameByIds([data.id]);
            this.serverLab.string = `[s${GlobalUtil.getSeverIdByPlayerId(data.id)}]` + ModelManager.get(ServerModel).serverNameMap[Math.floor(data.id / 100000)]
        }
    }
}