import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';
import { Arena_buyCfg } from '../../../a/config';
import { getLeftArenaTimes } from '../utils/ArenaUtil';

/** 
 * @Description: 竞技场子项
 * @Author: jijing.liu  
 * @Date: 2019-04-18 13:44:33
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 12:08:58
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arena/ArenaReportItemCtrl")
export default class ArenaReportItemCtrl extends UiListItem {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Label)
    pointLabel: cc.Label = null;

    @property(cc.Node)
    iconCtn: cc.Node = null;

    @property(cc.Node)
    fightBackBtn: cc.Node = null;

    @property(cc.Sprite)
    win_loser: cc.Sprite = null;

    @property(cc.Sprite)
    iconFrame: cc.Sprite = null;

    @property(cc.Node)
    vipFlag: cc.Node = null

    @property([cc.Font])
    font: cc.Font[] = [];

    playerId: number;
    _arenaLogData: icmsg.ArenaLog

    updateView(data: any) {
        this._arenaLogData = data
        let log: icmsg.ArenaLog = data;
        let isWin: boolean = log.addScore > 0;

        this.playerId = data['opponentId'];
        this.nameLabel.string = log.opponentName;
        this.lvLabel.string = `.${log.opponentLevel}`;
        this.pointLabel.string = `/${log.addScore}`.replace(/\+|\-/, '');
        if (log.fightType == 2 && log.addScore < 0) {
            this.fightBackBtn.active = true;
            this.pointLabel.font = this.font[1];
        } else {
            this.fightBackBtn.active = false;
            this.pointLabel.font = this.font[0];
        }
        GlobalUtil.setSpriteIcon(this.node, this.iconCtn, GlobalUtil.getHeadIconById(log.opponentHead));
        GlobalUtil.setSpriteIcon(this.node, this.iconFrame, GlobalUtil.getHeadFrameById(log.opponentFrame));

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        vipCtrl.updateVipLv(GlobalUtil.getVipLv(this._arenaLogData.opponentVipExp))
    }

    battle() {
        let cfg = ConfigManager.getItemById(Arena_buyCfg, 1)
        if (getLeftArenaTimes() == 0 && BagUtils.getItemNumById(cfg.item_cost[0]) < cfg.item_cost[1]) {
            if (BagUtils.getItemNumById(cfg.money_cost[0]) < cfg.money_cost[1]) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:ARENA_TIP7"))
                return
            }
        }

        let player = new icmsg.ArenaPlayer()
        player.name = this._arenaLogData.opponentName
        player.head = this._arenaLogData.opponentHead
        player.frame = this._arenaLogData.opponentFrame
        player.power = this._arenaLogData.opponentPower
        JumpUtils.openPveArenaScene([this.playerId, 0, player], player.name, 'ARENA');

        // if (getLeftArenaTimes() > 0) {
        //     let m = ArenaViewModel.instance;
        //     m.fightType = 1;
        //     m.fightPlayerId = this.playerId;
        //     gdk.panel.open(PanelId.ArenaBattleReadyView);
        // } else {
        //     gdk.gui.showMessage(gdk.i18n.t('i18n:CHALLENG_TIME_OUT'));
        // }
    }

}
