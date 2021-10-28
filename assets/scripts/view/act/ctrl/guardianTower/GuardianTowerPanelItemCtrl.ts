import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import RewardItem from '../../../../common/widgets/RewardItem';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import {
    Copy_hardcoreCfg,
    GuardianCfg,
    Guardiantower_guardianCfg,
    HeroCfg
    } from '../../../../a/config';

/**
 * @Description: 护使秘境Item
 * @Author: yaozu.hu
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-07 17:40:44
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guardianTower/GuardianTowerPanelItemCtrl")
export default class GuardianTowerPanelItemCtrl extends UiListItem {

    @property(cc.Node)
    bgNode1: cc.Node = null;
    @property(cc.Node)
    bgNode2: cc.Node = null;

    @property(cc.Node)
    showNode: cc.Node = null;
    @property(cc.Node)
    nextNode: cc.Node = null;
    @property(cc.Node)
    curNode: cc.Node = null;
    @property(cc.Node)
    oldNode: cc.Node = null;

    @property(sp.Skeleton)
    heroSpine: sp.Skeleton = null;
    @property(sp.Skeleton)
    guardianSpine: sp.Skeleton = null;

    @property(cc.Label)
    stageLb: cc.Label = null;
    @property(cc.LabelOutline)
    stageLine: cc.LabelOutline = null;
    @property(cc.RichText)
    addSkill: cc.RichText = null;
    @property(cc.Node)
    rewardNode: cc.Node = null;
    @property(cc.Prefab)
    rewardPre: cc.Prefab = null;
    @property(cc.Label)
    powerLb: cc.Label = null;

    @property(cc.Label)
    curLb: cc.Label = null;
    @property(cc.LabelOutline)
    curline: cc.LabelOutline = null;


    @property(cc.Label)
    nextTimeLb: cc.Label = null;
    @property(cc.LabelOutline)
    nextTimeline: cc.LabelOutline = null;

    @property(cc.Label)
    oldLb: cc.Label = null;
    @property(cc.LabelOutline)
    oldLine: cc.LabelOutline = null;

    @property(cc.Node)
    rewardBg1: cc.Node = null;
    @property(cc.Node)
    rewardBg2: cc.Node = null;

    actId: number = 89;
    info: { cfg: any, state: number, curDay?: number }

    tcolorList: cc.Color[] = [cc.color('#36FFF3'), cc.color('#ffdf5d')]
    tlineColorList: cc.Color[] = [cc.color('#19365D'), cc.color('#480d0d')]

    colorList: cc.Color[] = [cc.color('#50BFFF'), cc.color('#efbfac')]
    lineColorList: cc.Color[] = [cc.color('#19365D'), cc.color('#480d0d')]

    updateView() {
        this.info = this.data;
        this.showNode.active = this.info.cfg != null;
        if (!this.info.cfg) return;
        this.nextNode.active = this.info.state == 2 || this.info.state == 3;
        this.curNode.active = this.info.state == 1;
        this.oldNode.active = this.info.state == 0;
        this.nextTimeLb.node.active = false;
        this.stageLb.node.color = this.tcolorList[0]
        this.stageLine.color = this.tlineColorList[0]
        this.bgNode1.active = true;
        this.bgNode2.active = false;
        this.nextTimeLb.node.color = this.tcolorList[0]
        this.nextTimeline.color = this.tlineColorList[0]
        this.oldLb.node.color = this.tcolorList[0]
        this.oldLine.color = this.tlineColorList[0]
        this.curLb.node.color = this.tcolorList[0]
        this.curline.color = this.tlineColorList[0]
        if (this.info.cfg) {
            this.stageLb.string = this.info.cfg.copy_name;
            if (this.info.cfg.type_stage == 1) {
                this.stageLb.node.color = this.tcolorList[1]
                this.stageLine.color = this.tlineColorList[1]
                this.bgNode1.active = false;
                this.bgNode2.active = true;
                this.nextTimeLb.node.color = this.tcolorList[1]
                this.nextTimeline.color = this.tlineColorList[1]
                this.oldLb.node.color = this.tcolorList[1]
                this.oldLine.color = this.tlineColorList[1]
                this.curLb.node.color = this.tcolorList[1]
                this.curline.color = this.tlineColorList[1]
            }
        }
        let temStr = '';
        this.rewardBg1.active = false;
        this.rewardBg2.active = false;
        if (this.info.state == 1) {
            this.rewardBg1.active = true;
            this.rewardBg2.active = true;
            this.info.cfg.hardcore_show.forEach(id => {
                let temCfg = ConfigManager.getItemById(Copy_hardcoreCfg, id);
                if (temStr == '') {
                    temStr = temCfg.dec;
                } else {
                    temStr += '\n' + temCfg.dec;
                }
            })
            this.addSkill.string = temStr;
            this.powerLb.string = this.info.cfg.power + ''
            //设置奖励物品
            this.rewardNode.removeAllChildren();
            this.info.cfg.first_reward.forEach((data, index) => {
                let node = cc.instantiate(this.rewardPre)
                let ctrl = node.getComponent(RewardItem);
                let tem = data;
                let temData = { index: index, typeId: tem[0], num: tem[1], delayShow: false, effct: false }
                ctrl.data = temData;
                ctrl.updateView();
                node.setParent(this.rewardNode)
            })

            //设置模型
            let heroPath = '';
            let heroId = this.info.cfg.show[0]
            let heroCfg = ConfigManager.getItem(HeroCfg, (cfg: HeroCfg) => {
                if (cfg.id == heroId) {
                    return true;
                }
            })
            heroPath = `spine/hero/${heroCfg.skin}/1/${heroCfg.skin}`
            let guardianPath = '';
            let guardianId = this.info.cfg.show[1]
            let temGuardianCfg = ConfigManager.getItem(Guardiantower_guardianCfg, (cfg: Guardiantower_guardianCfg) => {
                if (cfg.id == guardianId) {
                    return true;
                }
            })
            let guardianCfg = ConfigManager.getItem(GuardianCfg, (cfg: GuardianCfg) => {
                if (cfg.id == temGuardianCfg.guardian_id) {
                    return true;
                }
            })
            this.guardianSpine.node.scaleX = -1 * temGuardianCfg.size;
            this.guardianSpine.node.scaleY = temGuardianCfg.size;
            guardianPath = `spine/hero/${guardianCfg.skin}/1/${guardianCfg.skin}`
            GlobalUtil.setSpineData(this.node, this.heroSpine, heroPath, false, 'stand', true)
            GlobalUtil.setSpineData(this.node, this.guardianSpine, guardianPath, false, 'stand', true)
        } else if (this.info.state == 3) {
            this.nextTimeLb.node.active = true;
            let temTime = ActUtil.getActStartTime(this.actId) / 1000 + (this.info.curDay) * 86400
            let curTime = GlobalUtil.getServerTime() / 1000;
            let time = TimerUtils.format5(temTime - curTime) + gdk.i18n.t("i18n:GUARDIANTOWER_TIP3")
            this.nextTimeLb.string = time
        }
    }


    onAttackBtnClick() {

        let player = new icmsg.ArenaPlayer()
        player.name = this.info.cfg.enemy_name
        player.head = this.info.cfg.show[0]
        player.frame = 0
        player.power = this.info.cfg.power;
        JumpUtils.openPveArenaScene([0, 0, player], player.name, 'GUARDIANTOWER');

    }


}
