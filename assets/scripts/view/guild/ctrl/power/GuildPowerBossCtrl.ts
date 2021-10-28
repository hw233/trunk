import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ShaderHelper from '../../../../common/shader/ShaderHelper';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { Guildpower_bossCfg, Guildpower_globalCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-28 10:05:43
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/power/GuildPowerBossCtrl")
export default class GuildPowerBossCtrl extends cc.Component {

    @property(cc.Node)
    stage: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.RichText)
    timeLab: cc.RichText = null;

    @property(cc.Node)
    arrow: cc.Node = null;

    @property(cc.Node)
    endIcon: cc.Node = null;

    _cfg: Guildpower_bossCfg

    updateViewInfo(cfg) {
        this._cfg = cfg
        let url: string = StringUtils.format("spine/monster/{0}/{0}", this._cfg.skin);
        this.spine.node.scale = 0.6
        GlobalUtil.setSpineData(this.node, this.spine, url, true, 'stand_s', true, false)
    }

    updateBossState(isActive: boolean) {
        if (isActive) {
            GlobalUtil.setGrayState(this.stage, 0)
            this.spine.node.getComponent(ShaderHelper).enabled = false
        } else {
            GlobalUtil.setGrayState(this.stage, 1)
            this.spine.node.getComponent(ShaderHelper).enabled = true
        }
        this.arrow.active = false
    }

    updateIsEnd(isEnd: boolean) {
        this.endIcon.active = isEnd
    }

    selectBoss() {
        this.arrow.active = true
    }

    updateTimeLab() {
        let timeCfg = ConfigManager.getItemById(Guildpower_globalCfg, "monster_open").value
        let openTime = timeCfg[0] * 3600
        let closeTime = timeCfg[1] * 3600
        let fightTime = 3600
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let zeroTime = TimerUtils.getZerohour(curTime)
        this.timeLab.node.active = false
        if (curTime > zeroTime + openTime) {
            if (curTime < zeroTime + closeTime) {
                this.timeLab.node.active = true
                this.timeLab.string = ``
                this.timeLab.string = StringUtils.setRichtOutLine(`集结剩余<color=#00ff00>${TimerUtils.format3(zeroTime + closeTime - curTime)}</c>`, "#2C0413", 2)
            } else {
                if (curTime < zeroTime + closeTime + fightTime) {
                    this.timeLab.node.active = true
                    this.timeLab.string = ``
                    this.timeLab.string = StringUtils.setRichtOutLine(`战斗剩余<color=#00ff00>${TimerUtils.format3(zeroTime + closeTime + fightTime - curTime)}</c>`, "#2C0413", 2)
                }
            }
        }
    }
}