import ConfigManager from '../../../common/managers/ConfigManager';
import PanelId from '../../../configs/ids/PanelId';
import { Arenahonor_progressCfg } from '../../../a/config';


/**
 * enemy荣耀巅峰赛竞猜投注结果界面
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-10 15:18:05
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenaHonor/ArenaHonorResultViewCtrl")
export default class ArenaHonorResultViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    winNode: cc.Node = null;

    @property(cc.Node)
    loseNode: cc.Node = null;

    //rmsg: icmsg.ChampionGuessFightResultRsp;
    onEnable() {

        let state: boolean = true;
        let proId: number = 2;
        let args = gdk.panel.getArgs(PanelId.ArenaHonorResultView)
        if (args) {
            proId = args[0];
            state = args[1];
        }

        let cfg: Arenahonor_progressCfg = ConfigManager.getItemById(Arenahonor_progressCfg, proId);

        if (state) {
            this.winNode.active = true;
            this.loseNode.active = false;
            let nameLb = this.winNode.getChildByName('name').getComponent(cc.RichText);
            nameLb.string = cfg.mail_win
        }
        else {
            this.loseNode.active = true;
            this.winNode.active = false;
            let nameLb = this.loseNode.getChildByName('name').getComponent(cc.RichText);
            nameLb.string = cfg.mail_lose
        }
    }

    onDisable() {
    }
}
