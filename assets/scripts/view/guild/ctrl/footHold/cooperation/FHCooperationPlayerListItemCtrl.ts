import FootHoldModel from '../FootHoldModel';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../../common/utils/GuideUtil';
import GuildUtils from '../../../utils/GuildUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import UiListItem from '../../../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../../../common/widgets/VipFlagCtrl';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-18 17:45:28
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cooperation/FHCooperationPlayerListItemCtrl")
export default class FHCooperationPlayerListItemCtrl extends UiListItem {

    @property(cc.Node)
    postion: cc.Node = null;

    @property(cc.Node)
    cooperIcon: cc.Node = null;

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
    serverLab: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Label)
    scoreLab: cc.Label = null;

    @property(cc.Label)
    fightNumLab: cc.Label = null;

    _info: icmsg.FootholdCoopPlayer

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    updateView() {
        this._info = this.data
        GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(this._info.roleBrief.head))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(this._info.roleBrief.headFrame))
        this.serverLab.string = `[S${GlobalUtil.getSeverIdByPlayerId(this._info.roleBrief.id)}]`
        this.playerName.string = `${this._info.roleBrief.name}`
        this.lvLab.string = `${this._info.roleBrief.level}`
        this.powerLab.string = `${this._info.roleBrief.power}`
        this.scoreLab.string = `${this._info.score}`
        this.fightNumLab.string = `${this._info.number}`

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(GlobalUtil.getVipLv(this._info.roleBrief.vipExp))

        if (this.footHoldModel.coopTempViewGuildId != this._info.roleBrief.guildId) {
            this.cooperIcon.active = true
            this.postion.active = false
        } else {
            this.cooperIcon.active = false
            this.postion.active = true
            let title = this._info.guildTitle
            if (title == 0) {
                title = this._info.roleBrief.title
            }
            let path = GuildUtils.getMemberTitlePath(title)
            GlobalUtil.setSpriteIcon(this.node, this.postion, `view/guild/texture/common/${path}`)
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