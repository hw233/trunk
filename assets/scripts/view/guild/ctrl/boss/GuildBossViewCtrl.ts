import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildBossSkillsItemCtrl from './GuildBossSkillsItemCtrl';
import GuildModel, { GuildAccess } from '../../model/GuildModel';
import GuildUtils from '../../utils/GuildUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RewardPreviewCtrl from '../../../../common/widgets/RewardPreviewCtrl';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import {
    GlobalCfg,
    GuildbossCfg,
    MonsterCfg,
    SkillCfg
    } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-22 14:28:59 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/boss/GuildBossViewCtrl")
export default class GuildBossViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    bossName: cc.Label = null;

    @property(sp.Skeleton)
    bossSpine: sp.Skeleton = null;

    @property(cc.Node)
    bossSkillsContent: cc.Node = null;

    @property(cc.Prefab)
    skillPrefab: cc.Prefab = null;

    @property(cc.Node)
    progressReward: cc.Node = null;

    @property(cc.Node)
    rewardPreviewContent: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    challengeBtn: cc.Node = null;

    @property(cc.Node)
    openBtn: cc.Node = null;

    @property(cc.Label)
    leftTimeLab: cc.Label = null;

    @property(cc.Label)
    countTimeLab: cc.Label = null;

    @property([cc.Node])
    rankNodes: cc.Node[] = [];

    @property(cc.Node)
    sweepBtn: cc.Node = null;

    get guildModel() { return ModelManager.get(GuildModel); }

    curGuildBossCfg: GuildbossCfg;
    bossCfg: MonsterCfg;
    hpBarMaxW: number = 450;
    onEnable() {
        this.curGuildBossCfg = ConfigManager.getItem(GuildbossCfg, (cfg: GuildbossCfg) => {
            if (cfg.type == this.guildModel.gbBossType && cfg.level == this.guildModel.gbBossLv) {
                return true;
            }
        });
        this.bossCfg = ConfigManager.getItemById(MonsterCfg, this.guildModel.gbBossId);
        this._updateBoss();
        this._updateRewardPreview();
    }

    onDisable() {
        let rewardsContent = cc.find('rewards', this.progressReward);
        rewardsContent.children.forEach(item => {
            item.getChildByName('on').stopAllActions();
            item.getChildByName('on').angle = 0;
        });
    }

    onSweepBtnClick() {
        if (!this.guildModel.gbMaxHurt) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILDBOSS_TIP1"));
            return;
        }
        let limitTime = ConfigManager.getItemByField(GlobalCfg, 'key', 'guild_boss_times').value[0];
        let leftTime = Math.max(0, limitTime - this.guildModel.gbEnterTime);
        if (leftTime <= 0) {
            return;
        }
        else {
            GlobalUtil.openAskPanel({
                descText: StringUtils.format(gdk.i18n.t("i18n:GUILDBOSS_TIP2"), this.guildModel.gbMaxHurt),//`确定按历史最高的伤害量<color=#00FF00>${this.guildModel.gbMaxHurt}</c>扫荡一次吗?`,
                sureCb: () => {
                    let req = new icmsg.GuildBossRaidsReq();
                    NetManager.send(req, (resp: icmsg.GuildBossRaidsRsp) => {
                        ModelManager.get(GuildModel).gbEnterTime = resp.enter;
                        if (!cc.isValid(this.node)) return;
                        if (!this.node.activeInHierarchy) return;
                        GlobalUtil.openRewadrView(resp.rewards);
                    }, this);
                }
            })
        }
    }

    onOpenBtnClick() {
        if (!GuildUtils.isCanOperate(ModelManager.get(RoleModel).id, GuildAccess.OpenBoss)) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILDBOSS_TIP3"));
            return;
        }
        else {
            let limitPoint = ConfigManager.getItemByField(GlobalCfg, 'key', 'guild_boss_cost').value[0];
            if (this.guildModel.gbPoint < limitPoint) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:GUILDBOSS_TIP4"));
                return;
            }
            else {
                GlobalUtil.openAskPanel({
                    descText: gdk.i18n.t("i18n:GUILDBOSS_TIP5"),
                    sureCb: () => {
                        let req = new icmsg.GuildBossOpenReq();
                        NetManager.send(req, () => {
                            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILDBOSS_TIP6"));
                        });
                    }
                })
            }
        }
    }

    onChallengeBtnClick() {
        let limitTime = ConfigManager.getItemByField(GlobalCfg, 'key', 'guild_boss_times').value[0];
        if (this.guildModel.gbEnterTime >= limitTime) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILDBOSS_TIP7"));
            return;
        }

        // let req = new GuildBossEnterReq();
        // NetManager.send(req, (resp: GuildBossEnterRsp) => {
        // })
        JumpUtils.openInstance(this.curGuildBossCfg.id);
        gdk.panel.hide(PanelId.GuildBossView);
    }

    onRewardBtnClick() {
        gdk.panel.open(PanelId.GuildRankRewardView);
    }

    onRankDetailsBtnClick() {
        if (this.guildModel.gbOpenTime <= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILDBOSS_TIP8"));
            return;
        }
        gdk.panel.open(PanelId.GuildBossDamageRank);
    }

    @gdk.binding('guildModel.gbBossLv')
    @gdk.binding('guildModel.gbBossType')
    _updateBaseView() {
        if (this.bossCfg
            && this.curGuildBossCfg
            && this.curGuildBossCfg.type == this.guildModel.gbBossType
            && this.curGuildBossCfg.level == this.guildModel.gbBossLv) {
            return;
        }
        this.curGuildBossCfg = ConfigManager.getItem(GuildbossCfg, (cfg: GuildbossCfg) => {
            if (cfg.type == this.guildModel.gbBossType && cfg.level == this.guildModel.gbBossLv) {
                return true;
            }
        });
        this.bossCfg = ConfigManager.getItemById(MonsterCfg, this.guildModel.gbBossId);
        this._updateBoss();
        this._updateRewardPreview();
        this._updateRank();
    }

    @gdk.binding('guildModel.gbOpenTime')
    @gdk.binding('guildModel.gbEnterTime')
    _updateLeftTime() {
        if (!this.curGuildBossCfg || !this.bossCfg) {
            this._updateBaseView();
        }
        let limitTime = ConfigManager.getItemByField(GlobalCfg, 'key', 'guild_boss_times').value[0];
        let leftTime = Math.max(0, limitTime - this.guildModel.gbEnterTime);
        this.leftTimeLab.string = leftTime + '';
        if (this.guildModel.gbOpenTime > 0) {
            this.challengeBtn.active = true;
            this.openBtn.active = false;
            this.challengeBtn.getComponent(cc.Button).interactable = limitTime - this.guildModel.gbEnterTime > 0;
            this.sweepBtn.getComponent(cc.Button).interactable = leftTime > 0;
            //countTime twoDay
            let endTime = new Date(TimerUtils.getTomZerohour(TimerUtils.getTomZerohour(this.guildModel.gbOpenTime)) * 1000);
            this.countTimeLab.node.active = true;
            this.countTimeLab.string = `${gdk.i18n.t("i18n:GUILDBOSS_TIP9")}${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()} 00:00:00${gdk.i18n.t("i18n:GUILDBOSS_TIP10")}`;
        }
        else {
            let limit = ConfigManager.getItemByField(GlobalCfg, 'key', 'guild_boss_cost').value[0];
            this.challengeBtn.active = false;
            this.openBtn.active = true;
            this.openBtn.getComponent(cc.Button).interactable = leftTime > 0;
            this.sweepBtn.getComponent(cc.Button).interactable = leftTime > 0;
            let cost = cc.find('layout/cost', this.openBtn).getComponent(cc.Label);
            cost.string = `${this.guildModel.gbPoint}`;
            cc.find('layout/limit', this.openBtn).getComponent(cc.Label).string = `/${limit}`;
            //#FD3433 #08F108
            cost.node.color = new cc.Color().fromHEX(`${limit <= this.guildModel.gbPoint ? '#08F108' : '#FD3433'}`);
            // if (this.guildModel.gbBossType == 1 && this.guildModel.gbBossLv == 1) {
            //     cost.string = '';
            //     cc.find('layout/limit', this.openBtn).getComponent(cc.Label).string = '本次免费';
            // }
            //countTime
            this.countTimeLab.node.active = false;
        }
    }

    @gdk.binding('guildModel.gbDamage')
    _updateProgress() {
        if (!this.curGuildBossCfg || !this.bossCfg) {
            this._updateBaseView();
        }
        //progressReward
        let bar = cc.find('progress/mask', this.progressReward);
        let rewardsContent = cc.find('rewards', this.progressReward);
        let ratio = this.guildModel.gbDamage / this.curGuildBossCfg.boss_hp;
        let rewardFlag = this.guildModel.gbRewardFlag[0];
        let conditions = [0.3, 0.6, 1];
        let percentReward = [this.curGuildBossCfg.percent_reward1, this.curGuildBossCfg.percent_reward2, this.curGuildBossCfg.percent_reward3];
        bar.width = Math.min(1, ratio) * 649;
        let func = (node: cc.Node, state: number, idx: number) => {
            //state 0-不可领取 1-可领取 2-已领取
            let on = node.getChildByName('on');
            on.active = state !== 2;
            node.getChildByName('off').active = state === 2;
            on.stopAllActions();
            on.angle = 0;
            if (state == 1) {
                on.runAction(cc.repeatForever(cc.sequence(
                    cc.rotateBy(.05, 10),
                    cc.rotateBy(.05, -10),
                    cc.rotateBy(.05, -10),
                    cc.rotateBy(.05, 10)
                )));
            }
            node.targetOff(this);
            node.on('click', () => {
                if (state == 1) {
                    let req = new icmsg.GuildBossRewardReq();
                    req.rewardFlag = idx;
                    NetManager.send(req, (resp: icmsg.GuildBossRewardRsp) => {
                        ModelManager.get(GuildModel).gbRewardFlag = resp.rewardFlag;
                        GlobalUtil.openRewadrView(resp.rewards);
                        if (cc.isValid(this.node)) {
                            this._updateProgress();
                        }
                    });
                }
                else if (state == 0) {
                    //预览
                    gdk.panel.open(PanelId.RewardPreview, (itemNode: cc.Node) => {
                        let worldPos = node.parent.convertToWorldSpaceAR(node.position);
                        let pos = gdk.gui.layers.popupLayer.convertToNodeSpaceAR(worldPos);
                        let ctrl = itemNode.getComponent(RewardPreviewCtrl);
                        let arr: icmsg.GoodsInfo[] = [];
                        percentReward[idx].forEach(reward => {
                            let g = new icmsg.GoodsInfo();
                            [g.typeId, g.num] = reward;
                            arr.push(g);
                        });
                        ctrl.setRewards(arr, gdk.i18n.t("i18n:GUILDBOSS_TIP11"));
                        itemNode.setPosition(pos.x, pos.y + ctrl.scrollView.node.height + 90);
                        if (idx == 2) {
                            itemNode.x -= ctrl.scrollView.node.width / 2;
                        }
                    }, this);
                }
            }, this)
        };
        rewardsContent.children.forEach((item, idx) => {
            let state;
            if ((rewardFlag & 1 << idx) >= 1) {
                state = 2;
            }
            else if (ratio >= conditions[idx]) {
                state = 1;
            }
            else {
                state = 0;
            }
            func(item, state, idx);
        });
        //rank
        this._updateRank();
    }

    _updateRank() {
        let info = this.guildModel.gbRankTop3;
        this.rankNodes.forEach((rank, idx) => {
            let name = rank.getChildByName('name').getComponent(cc.Label);
            let num = rank.getChildByName('num').getComponent(cc.Label);
            if (info[idx]) {
                name.string = info[idx].brief.name;
                num.string = StringUtils.format(gdk.i18n.t("i18n:GUILDBOSS_TIP12"), info[idx].blood > 10000 ? (info[idx].blood / 10000).toFixed(1) + gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP1") : info[idx].blood + '')//`[${GlobalUtil.numberToStr(info[idx].blood, true)}伤害]`;
            }
            else {
                name.string = '';
                num.string = gdk.i18n.t("i18n:GUILDBOSS_TIP13");
            }
        });
    }

    _updateBoss() {
        let url: string = StringUtils.format("spine/monster/{0}/{0}", this.bossCfg.skin);
        GlobalUtil.setSpineData(this.node, this.bossSpine, url, true, 'stand_s', true, false);

        //skills
        this.bossSkillsContent.removeAllChildren();
        let skills = this.bossCfg.skills;
        skills = skills.filter(skil => {
            let skillInfo: SkillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", skil, null)
            if (skillInfo.show !== 1) {
                return true;
            }
        });
        skills.forEach((skill, idx) => {
            let item = cc.instantiate(this.skillPrefab);
            item.parent = this.bossSkillsContent;
            let ctrl = item.getComponent(GuildBossSkillsItemCtrl);
            ctrl.updateSkillInfo(skill);
            if ([0, 3].indexOf(idx) != -1 && skills.length == 4) {
                item.y = 15;
            }
            else {
                item.y = 0;
            }
        });
        //info
        this.bossName.string = this.bossCfg.name;
    }

    _updateRewardPreview() {
        this.rewardPreviewContent.removeAllChildren();
        this.curGuildBossCfg.reward_show.forEach(reward => {
            let slot = cc.instantiate(this.slotPrefab);
            slot.parent = this.rewardPreviewContent;
            let ctrl = slot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(reward[0], reward[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: reward[0],
                itemNum: reward[1],
                type: BagUtils.getItemTypeById(reward[0]),
                extInfo: null
            }
        });
    }
}
