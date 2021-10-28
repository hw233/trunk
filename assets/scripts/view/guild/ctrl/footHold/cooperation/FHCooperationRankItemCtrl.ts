import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import FootHoldModel from '../FootHoldModel';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import RoleModel from '../../../../../common/models/RoleModel';
import ServerModel from '../../../../../common/models/ServerModel';
import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import VipFlagCtrl from '../../../../../common/widgets/VipFlagCtrl';
import { Foothold_cooperation_rankingCfg } from '../../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-31 15:23:30
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cooperation/FHCooperationRankItemCtrl")
export default class FHCooperationRankItemCtrl extends UiListItem {

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
    scoreLab: cc.Label = null;

    @property(cc.Label)
    fightNumLab: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    cooperIcon: cc.Node = null;

    @property(cc.Node)
    noTip: cc.Node = null;

    _info: icmsg.FootholdCoopPlayer

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    async updateView() {
        this._info = this.data

        let cfg = ConfigManager.getItem(Foothold_cooperation_rankingCfg, (rank: Foothold_cooperation_rankingCfg) => {
            if (this.footHoldModel.activityIndex >= rank.ranking[0] && this.footHoldModel.activityIndex <= rank.ranking[1]
                && (this.curIndex + 1) >= rank.sorting[0] && (this.curIndex + 1) <= rank.sorting[1]) {
                return true;
            }
            return false;
        })

        this.content.removeAllChildren();
        cfg.rewards.forEach(item => {
            let slot = cc.instantiate(this.slotPrefab);
            let ctrl = slot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(item[0], item[1]);
            slot.scale = 0.5
            slot.parent = this.content;
            ctrl.itemInfo = {
                series: null,
                itemId: item[0],
                itemNum: item[1],
                type: BagUtils.getItemTypeById(item[0]),
                extInfo: null
            };
        });

        if (this._info.roleBrief == null) {
            this.noTip.active = true
            this.lvLab.node.parent.active = false
            this.vipFlag.active = false
            this.cooperIcon.active = false
            this.playerName.string = ``
            this.guildName.string = ``
            this.scoreLab.string = `${0}`
            this.fightNumLab.string = `${0}`
            return
        }
        this.noTip.active = false
        this.lvLab.node.parent.active = true
        this.vipFlag.active = true
        this.cooperIcon.active = true

        GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(this._info.roleBrief.head))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(this._info.roleBrief.headFrame))
        this.playerName.string = `${this._info.roleBrief.name}`
        this.lvLab.string = `${this._info.roleBrief.level}`
        this.scoreLab.string = `${this._info.score}`
        this.fightNumLab.string = `${this._info.number}`
        let serverId = GlobalUtil.getSeverIdByPlayerId(this._info.roleBrief.id)
        let serverModel = ModelManager.get(ServerModel)
        await ModelManager.get(ServerModel).reqServerNameByIds([this._info.roleBrief.id]);
        this.guildName.string = `[S${serverId}]${serverModel.serverNameMap[Math.floor(this._info.roleBrief.id / 100000)]} ` + `${this._info.guildBrief.name}`

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(GlobalUtil.getVipLv(this._info.roleBrief.vipExp))

        if (this._info.roleBrief.id == ModelManager.get(RoleModel).id) {
            this.playerName.node.color = cc.color("#04E004")
            this.guildName.node.color = cc.color("#04E004")
            this.scoreLab.node.color = cc.color("#04E004")
            this.fightNumLab.node.color = cc.color("#04E004")
        } else {
            this.playerName.node.color = cc.color("#CCBDFE")
            this.guildName.node.color = cc.color("#CCBDFE")
            this.scoreLab.node.color = cc.color("#CCBDFE")
            this.fightNumLab.node.color = cc.color("#CCBDFE")
        }


    }

    _itemClick() {
        if (this._info.roleBrief == null) {
            return
        }
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