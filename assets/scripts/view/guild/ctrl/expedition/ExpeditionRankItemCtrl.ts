import FootHoldUtils from '../footHold/FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../../common/widgets/VipFlagCtrl';

/** 
 * @Description: 
 * @Author: yaozu.hu
 * @Date: 2020-12-23 10:28:06
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-28 10:32:08
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionRankItemCtrl")
export default class ExpeditionRankItemCtrl extends UiListItem {

    @property(cc.Node)
    rank: cc.Node = null;

    @property(cc.Label)
    rank2: cc.Label = null;

    @property(cc.Node)
    head: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    vipFlag: cc.Node = null;

    @property(cc.Label)
    playerName: cc.Label = null;

    @property(cc.Label)
    guildName: cc.Label = null;

    @property(cc.Label)
    serverLab: cc.Label = null;

    @property(cc.Label)
    eValueLab: cc.Label = null;//远征值


    _info: icmsg.ExpeditionRankBrief

    updateView() {
        this._info = this.data
        this.updateItem(this.curIndex + 1, this._info)
    }

    updateItem(index, info: icmsg.ExpeditionRankBrief) {
        if (index == 0) {
            this.rank.active = false
            this.rank2.node.active = true
            this.rank2.string = gdk.i18n.t("i18n:EXPEDITION_TIP24")//`未入榜`
            let roleModel = ModelManager.get(RoleModel)
            GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(roleModel.head))
            GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(roleModel.frame))
            this.serverLab.string = `[S${GlobalUtil.getSeverIdByPlayerId(roleModel.id)}]`
            this.playerName.string = `${roleModel.name}`
            this.lvLab.string = `${roleModel.level}`
            let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
            vipCtrl.updateVipLv(GlobalUtil.getVipLv(roleModel.vipExp))
            this.eValueLab.string = `${0}`
            this.guildName.string = `${roleModel.guildName}`
        } else {
            if (index <= 3) {
                this.rank.active = true
                this.rank2.node.active = false
                GlobalUtil.setSpriteIcon(this.node, this.rank, FootHoldUtils.getTop3RankIconPath(index))
            } else {
                this.rank.active = false
                this.rank2.node.active = true
                this.rank2.string = `${index}`
            }

            GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(info.roleBrief.head))
            GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(info.roleBrief.headFrame))
            this.serverLab.string = `[S${GlobalUtil.getSeverIdByPlayerId(info.roleBrief.id)}]`
            this.playerName.string = `${info.roleBrief.name}`
            this.lvLab.string = `${info.roleBrief.level}`
            let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
            vipCtrl.updateVipLv(GlobalUtil.getVipLv(info.roleBrief.vipExp))
            this.eValueLab.string = `${info.value}`
            this.guildName.string = `${info.guildName}`
        }

    }

    _itemClick() {
        let btns = [1]
        GlobalUtil.openBtnMenu(this.node, btns, {
            id: this._info.roleBrief.id,
            name: this._info.roleBrief.name,
            headId: this._info.roleBrief.head,
            headBgId: this._info.roleBrief.headFrame,
            level: this._info.roleBrief.level,
        })
    }
}