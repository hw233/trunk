import ArenaModel from '../../../common/models/ArenaModel';
import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import FriendModel from '../../friend/model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import UiListItem from '../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';
import { Arena_buyCfg, GlobalCfg } from '../../../a/config';
import { BtnMenuType } from '../../../common/widgets/BtnMenuCtrl';
import { getLeftArenaTimes } from '../utils/ArenaUtil';

/**
 * @Description: 竞技场子项
 * @Author: jijing.liu
 * @Date: 2019-04-18 13:44:33
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-18 13:54:32
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arena/ArenaFightItemCtrl")
export default class ArenaFightItemCtrl extends UiListItem {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    powerLabel: cc.Label = null;

    @property(cc.Label)
    pointLabel: cc.Label = null;

    @property(cc.Node)
    iconCtn: cc.Node = null;

    @property(cc.Node)
    headFrame: cc.Node = null;

    @property(cc.Node)
    fightBtn: cc.Node = null;

    @property(cc.Node)
    vipFlag: cc.Node = null

    player: icmsg.ArenaPlayer = null;
    weaponId: number = 0;

    get friendModel(): FriendModel { return ModelManager.get(FriendModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get arenaModel(): ArenaModel { return ModelManager.get(ArenaModel); }

    onDisable() {
        NetManager.targetOff(this);
    }

    updateView(data: any) {
        let cfg: GlobalCfg = ConfigManager.getItem(GlobalCfg, { key: 'arena_win_points' });
        let pointCfg: number[] = cfg.value;
        let index: number = data['index'];
        this.player = data['player'];
        this.nameLabel.string = this.player.name;
        this.lvLabel.string = `.${this.player.level}`;
        this.scoreLabel.string = `${this.player.score}`;
        this.powerLabel.string = `${this.player.power}`;
        this.pointLabel.string = `x${pointCfg[index]}`;

        GlobalUtil.setSpriteIcon(this.node, this.iconCtn, GlobalUtil.getHeadIconById(this.player.head));
        GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(this.player.frame));

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(GlobalUtil.getVipLv(this.player.vipExp))

        // 引导事件
        let arenaModel = ModelManager.get(ArenaModel);
        if (index == arenaModel.matchPlayers.length - 1) {
            GuideUtil.bindGuideNode(1200, this.fightBtn)
        }

        let btnLab = cc.find("layout/btnLab", this.fightBtn).getComponent(cc.Label)
        let costNode = cc.find("layout/cost", this.fightBtn)
        let costLab = cc.find("layout/cost/costLab", this.fightBtn).getComponent(cc.Label)
        let buyCfg = ConfigManager.getItemById(Arena_buyCfg, 1)
        let canSweep: boolean = this.player.power <= this.roleModel.power * 0.7
            && this.arenaModel.raidTimes >= 1
            && this.roleModel.level >= ConfigManager.getItemByField(GlobalCfg, 'key', 'arena_clear_open').value[0];
        GlobalUtil.setSpriteIcon(this.node, this.fightBtn, canSweep ? 'common/texture/zb_lanseanniu' : 'common/texture/zb_huanseanniu');
        if (getLeftArenaTimes() > 0) {
            costNode.active = false
            btnLab.string = canSweep ? gdk.i18n.t('i18n:ARENA_TIP10') : gdk.i18n.t("i18n:ARENA_TIP5")
        } else {
            btnLab.string = canSweep ? gdk.i18n.t('i18n:ARENA_TIP11') : gdk.i18n.t("i18n:ARENA_TIP6")
            if (BagUtils.getItemNumById(buyCfg.item_cost[0]) < buyCfg.item_cost[1]) {
                costNode.active = true
                costLab.string = `${buyCfg.money_cost[1]}`
            } else {
                costNode.active = false
            }
        }
    }

    battle() {
        let cfg = ConfigManager.getItemById(Arena_buyCfg, 1)
        if (getLeftArenaTimes() == 0 && BagUtils.getItemNumById(cfg.item_cost[0]) < cfg.item_cost[1]) {
            if (BagUtils.getItemNumById(cfg.money_cost[0]) < cfg.money_cost[1]) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:ARENA_TIP7"))
                return
            }
        }
        let ratio = ConfigManager.getItemByField(GlobalCfg, 'key', 'arena_power_min').value[0];
        let canSweep: boolean = this.player.power <= this.roleModel.power * ratio / 100
            && this.arenaModel.raidTimes >= 1
            && this.roleModel.level >= ConfigManager.getItemByField(GlobalCfg, 'key', 'arena_clear_open').value[0];
        if (!canSweep) {
            JumpUtils.openPveArenaScene([this.player.id, 0, this.player], this.player.name, 'ARENA');
        }
        else {
            if (ModelManager.get(ArenaModel).raidTimes <= 0) {
                gdk.gui.showMessage('暂无扫荡次数,请稍后再试');
                return
            }
            let req = new icmsg.ArenaRaidReq();
            req.opponentId = this.player.id;
            NetManager.send(req, null, this);
        }
    }

    onHeadClick() {
        if (this.player && this.player.robotId != 0) {
            return
        }
        let btns: BtnMenuType[] = [1, 0, 11]
        let id = this.player.id
        if (id == this.roleModel.id) return;
        let friendIdList = this.friendModel.friendIdList
        let idList = this.friendModel.backIdList
        // // 判断添加屏蔽/取消屏蔽按钮
        if (idList[id.toLocaleString()]) {
            btns.splice(1, 0, 5)
        } else {
            btns.splice(1, 0, 4)
        }
        // 非好友的情况下增加添加好友按钮
        if (!friendIdList[id.toLocaleString()]) {
            btns.splice(1, 0, 2)
        }

        // //非普通成员可 发出 公会邀请
        if (this.roleModel.guildTitle != 0 && this.data && !this.data.guildName) {
            btns.push(10)
        }

        GlobalUtil.openBtnMenu(this.headFrame, btns, {
            id: id,
            name: this.player.name,
            headId: this.player.head,
            headBgId: this.player.frame,
            level: this.player.level,
            chatContent: "",
        })
    }
}
