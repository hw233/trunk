import PveSceneCtrl from './PveSceneCtrl';
import StringUtils from '../../../common/utils/StringUtils';

/**
 * Pve回放场景控制类
 * @Author: sthoo.huang
 * @Date: 2020-04-16 20:46:22
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-22 12:26:39
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/PveReplayCtrl")
export default class PveReplayCtrl extends PveSceneCtrl {

    @property(gdk.List)
    generalSkillList: gdk.List = null;

    rmsg: icmsg.FightReplayRsp;    // 战斗回放数据
    heroes: number[];        // 英雄阵形
    general: icmsg.FightGeneral;   // 指挥官属性

    onEnable() {
        let args = this.args[0];
        this.rmsg = args[0];
        this.updateTitle(args[1]);
        this.generalSkillList.selectable = false;
        super.onEnable();
    }

    updateTitle(info: icmsg.FightBrief) {
        this.title = info ? StringUtils.format(gdk.i18n.t("i18n:PVE_REPLAY_TIP"), info.playerPower) : ''//`通关战力  ${info.playerPower}` : '';
    }

    _updateStateLater() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabledInHierarchy) return;
        super._updateStateLater();
        gdk.NodeTool.show(cc.find('UI/GenralSkills', this.node));
    }

    _updateTotalPower() { }
    _updateOneKeyRedPoint() { }
    _initsuperSkillData() { }
    _updateEnemyDropInfo() { }
    _updateFhPanel() { }
}