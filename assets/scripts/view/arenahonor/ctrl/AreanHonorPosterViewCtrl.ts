import ArenaHonorModel from '../../../common/models/ArenaHonorModel';
import ArenaHonorUtils from '../utils/ArenaHonorUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildUtils from '../../guild/utils/GuildUtils';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import TimerUtils from '../../../common/utils/TimerUtils';
import { Arenahonor_progressCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-07 14:33:17 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenahonor/AreanHonorPosterViewCtrl")
export default class AreanHonorPosterViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    enterBtn: cc.Node = null;

    resp: icmsg.ArenaHonorGuild[] = [];
    curProssId: number;
    get model(): ArenaHonorModel { return ModelManager.get(ArenaHonorModel); }
    onEnable() {
        this.model.enterGuildView = true;
        this._updateCurProssId();
        this._updateTime();
        this.schedule(this._updateTime, 1);
        let req = new icmsg.ArenaHonorGuildReq();
        NetManager.send(req, (resp: icmsg.ArenaHonorGuildRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.resp = resp.guilds;
            this._updateView();
        }, this);
    }

    onDisable() {
        NetManager.targetOff(this);
        this.unscheduleAllCallbacks();
    }

    onEnterBtnClick() {
        //todo
        JumpUtils.openPanel({
            panelId: PanelId.ArenaHonorView,
            currId: this.node
        })
    }

    onAllPlayerCheck() {
        //this.resp
        if (this.resp) {
            gdk.panel.setArgs(PanelId.ArenahonorAllParticipantView, this.resp);
            gdk.panel.open(PanelId.ArenahonorAllParticipantView);
        }
    }

    _updateCurProssId() {
        this.curProssId = ArenaHonorUtils.getCurProgressId();
        this.enterBtn.active = this.curProssId >= 2;
        let cfg = ConfigManager.getItemById(Arenahonor_progressCfg, this.curProssId);
        if (cfg) {
            cc.find('top/progressLab', this.node).getComponent(cc.Label).string = `正在进行中:${cfg.subject_name}`;
        }
    }

    _updateView() {
        this.content.children.forEach((n, idx) => {
            let info = this.resp[idx];
            let bg = cc.find('bg', n);
            let n1 = cc.find('info', n);
            let n2 = cc.find('blank', n);
            if (!info || !info.id) {
                n1.active = false;
                n2.active = true;
                GlobalUtil.setSpriteIcon(this.node, bg, `view/arenahnor/texture/arenahnor/rydfs_gonghuikuang02`);
                cc.find('layout/detailBtn', n1).targetOff(this);
            }
            else {
                n1.active = true;
                n2.active = false;
                GlobalUtil.setSpriteIcon(this.node, bg, `view/arenahnor/texture/arenahnor/rydfs_gonghuikuang01`);
                GlobalUtil.setSpriteIcon(this.node, cc.find('icon', n1), GuildUtils.getIcon(info.icon));
                GlobalUtil.setSpriteIcon(this.node, cc.find('frame', n1), GuildUtils.getIcon(info.frame));
                GlobalUtil.setSpriteIcon(this.node, cc.find('bg', n1), GuildUtils.getIcon(info.bottom));
                cc.find('layout/name', n1).getComponent(cc.Label).string = `[s${GlobalUtil.getSeverIdByGuildId(info.id)}]${info.name}`;
                cc.find('layout/detailBtn', n1).on('click', () => {
                    //info
                    gdk.panel.setArgs(PanelId.ArenahonorGuildPlayersView, info);
                    gdk.panel.open(PanelId.ArenahonorGuildPlayersView);
                });
            }
        });
    }

    _updateTime() {
        let now = GlobalUtil.getServerTime();
        let [sT, eT] = ArenaHonorUtils.getTimesById(this.curProssId)
        if (!sT || !eT) {
            this.unscheduleAllCallbacks();
            gdk.gui.showMessage(gdk.i18n.t('i18n:ARENA_HONOR_TIPS1'));
            this.close();
            return
        }
        let leftT = Math.max(0, eT - now);
        if (leftT > 0) {
            this.timeLab.string = TimerUtils.format2(leftT / 1000);
        }
        else {
            this._updateCurProssId();
        }
    }
}
