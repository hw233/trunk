import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import InstanceModel from '../../../instance/model/InstanceModel';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RewardItem from '../../../../common/widgets/RewardItem';
import SkillInfoPanelCtrl from '../../../role/ctrl2/main/skill/SkillInfoPanelCtrl';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import {
    ActivityCfg,
    Copy_stageCfg,
    CopyCfg,
    MonsterCfg,
    OrdealCfg,
    Pve_bornCfg,
    Pve_mainCfg,
    SkillCfg
    } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';

/** 
 * @Description: 英雄试炼入口
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-15 15:23:19
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/heroTrial/HeroTrialMonsterViewCtrl")
export default class HeroTrialMonsterViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    hurtLb: cc.Label = null;
    @property(cc.Label)
    rankLb: cc.Label = null;

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null;
    @property(cc.Prefab)
    monsterTipsItem: cc.Prefab = null;
    @property(cc.Prefab)
    monsterSkillItem: cc.Prefab = null;

    @property(cc.Label)
    monsterName: cc.Label = null;
    @property(sp.Skeleton)
    monsterSpine: sp.Skeleton = null;

    @property(cc.Node)
    monsterInfoNode: cc.Node = null;
    @property(cc.Node)
    stageRewardNode: cc.Node = null;

    @property(cc.Node)
    monsterTipLayout: cc.Node = null;
    @property(cc.RichText)
    monsterTipDes: cc.RichText = null;
    @property(cc.Node)
    monsterSkillLayout: cc.Node = null;


    @property(cc.Label)
    attacckNumLb: cc.Label = null;
    @property(cc.Label)
    allAttackNumLb: cc.Label = null;

    @property(cc.Node)
    rewardIcon: cc.Node = null;
    @property(cc.Node)
    redNode: cc.Node = null;
    @property(cc.Node)
    red2Node: cc.Node = null;

    @property([cc.Label])
    stageSelectLbs: cc.Label[] = []
    @property([cc.Label])
    stageNormalLbs: cc.Label[] = []
    @property([cc.Node])
    zhezhaoList: cc.Node[] = []

    @property(UiTabMenuCtrl)
    stageMenuBtn: UiTabMenuCtrl = null
    @property(UiTabMenuCtrl)
    infoMenuBtn: UiTabMenuCtrl = null

    @property(cc.Sprite)
    titleSp: cc.Sprite = null;
    @property(cc.Sprite)
    bgSp: cc.Sprite = null;

    @property(cc.Node)
    attackBtnNode: cc.Node = null;

    activityId: number = 44;
    cfg: ActivityCfg;
    ordealCfg: OrdealCfg;

    model: InstanceModel = ModelManager.get(InstanceModel);
    allAttackNum: number = 0;

    ordealCfgList: OrdealCfg[] = []

    curStageIndex = -1;

    stageIndexNum = -1;

    curDay: number = 1;
    onEnable() {
        let temStartTime = ActUtil.getActStartTime(this.activityId)
        let temEndTime = ActUtil.getActEndTime(this.activityId) - 5000
        let startTime = new Date(temStartTime);
        let endTime = new Date(temEndTime); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            this.close();
            return;
        } else {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
            this.cfg = ActUtil.getCfgByActId(this.activityId);
            let temCfg = ConfigManager.getItem(OrdealCfg, (item: OrdealCfg) => {
                if (item.activity_id == this.cfg.id && item.type == this.cfg.reward_type) {
                    return true;
                }
            })
            let path1 = '/view/act/texture/heroTrial/' + temCfg.advertising
            let path2 = '/view/act/texture/bg/' + temCfg.background
            GlobalUtil.setSpriteIcon(this.node, this.titleSp, path1);
            GlobalUtil.setSpriteIcon(this.node, this.bgSp, path2);

            //let temStart = ActUtil.getActStartTime(this.activityId)
            let curTime = GlobalUtil.getServerTime();
            let temDay = Math.floor(((curTime - temStartTime) / 1000) / 86400) + 1
            this.curDay = temDay > 5 ? 5 : temDay;
        }

        //gdk.e.on(ActivityEventId.ACTIVITY_HEROTRIAL_CHALLENGEREWARD_UPDATE, this.refreshAttackNumInfo, this)
        gdk.e.on(ActivityEventId.ACTIVITY_HEROTRIAL_DAMAGEREWARD_UPDATE, this.refreshAttackNumInfo, this)
        NetManager.send(new icmsg.DungeonOrdealInfoReq(), (rsp: icmsg.DungeonOrdealInfoRsp) => {
            this.model.heroTrialInfo = rsp;
            let stageId = this.model.heroTrialInfo.maxStageId > 0 ? this.model.heroTrialInfo.maxStageId : 0;
            let cfgs = ConfigManager.getItems(OrdealCfg, (item: OrdealCfg) => {
                if (item.activity_id == this.cfg.id && item.type == this.cfg.reward_type) {
                    return true;
                }
            })
            //GlobalUtil.setAllNodeGray(this.attackBtnNode, 0);
            if (cfgs[cfgs.length - 1].round == stageId) {
                this.ordealCfg = cfgs[cfgs.length - 1]
            } else if (stageId == 0) {
                this.ordealCfg = ConfigManager.getItem(OrdealCfg, (item: OrdealCfg) => {
                    if (item.activity_id == this.cfg.id && item.type == this.cfg.reward_type && item.round > stageId) {
                        return true;
                    }
                })
            } else {
                this.ordealCfg = ConfigManager.getItem(OrdealCfg, (item: OrdealCfg) => {
                    if (item.activity_id == this.cfg.id && item.type == this.cfg.reward_type && item.round > stageId) {
                        return true;
                    }
                })
                if (this.curDay < this.ordealCfg.quality) {
                    this.ordealCfg = ConfigManager.getItemByField(OrdealCfg, 'round', stageId);
                    //GlobalUtil.setAllNodeGray(this.attackBtnNode, 1);
                }
            }
            if (!this.ordealCfg) {
                //cc.log('数据配置有问题:' + this.cfg.reward_type + '------->' + stageId);
                this.close();;
            }
            this.ordealCfgList = ConfigManager.getItems(OrdealCfg, (item: OrdealCfg) => {
                if (item.activity_id == this.cfg.id && item.type == this.cfg.reward_type) {
                    return true;
                }
            })
            let tem = this.model.heroTrialInfo.stageDamages;
            let value = tem[tem.length - 1]
            this.hurtLb.string = value > 10000 ? (value / 10000).toFixed(1) + gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP1") : value + '';//GlobalUtil.numberToStr(this.model.heroTrialInfo.damage, true);
            let rankNum = this.model.heroTrialInfo.rankNum;
            this.rankLb.string = rankNum > 0 ? rankNum + '' : gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP2");
            let stageCfg = ConfigManager.getItemById(Copy_stageCfg, this.ordealCfg.round)
            let copyCfg = ConfigManager.getItemByField(CopyCfg, 'copy_id', stageCfg.copy_id, { 'subtype': stageCfg.subtype })
            this.allAttackNum = copyCfg.times;
            this.refreshAttackNumInfo()
            let index = this.ordealCfg.quality - 1;
            for (let i = 0; i < this.zhezhaoList.length; i++) {
                this.zhezhaoList[i].active = !((i == index) || i == this.zhezhaoList.length - 1);
                if (i == index && i < this.zhezhaoList.length - 1) {
                    let curDamage = this.model.heroTrialInfo.stageDamages[i];
                    curDamage = curDamage == null ? 0 : curDamage;
                    let allDamage = this.getStageAllEnemyHp(this.ordealCfg.round);
                    let num = Math.floor((curDamage / allDamage) * 100)
                    let str = this.stageSelectLbs[i].string
                    this.stageSelectLbs[i].string = str + '(' + num + '%)'
                }
            }
            this.stageIndexNum = index;
            this.stageMenuBtn.setSelectIdx(index);

            // this.updateInfoData();
        }, this);

    }

    onDisable() {
        gdk.Timer.clearAll(this);
        NetManager.targetOff(this);
        //gdk.e.off(ActivityEventId.ACTIVITY_HEROTRIAL_CHALLENGEREWARD_UPDATE, this.refreshAttackNumInfo, this)
        gdk.e.off(ActivityEventId.ACTIVITY_HEROTRIAL_DAMAGEREWARD_UPDATE, this.refreshAttackNumInfo, this)
    }


    updateInfoData(cfg: OrdealCfg) {
        //1.设置怪物模型
        let monsterCfg = ConfigManager.getItemById(MonsterCfg, cfg.monster);
        let url: string = StringUtils.format("spine/monster/{0}/{0}", monsterCfg.skin);
        GlobalUtil.setSpineData(this.node, this.monsterSpine, url, true, 'stand_s', true);
        this.monsterSpine.node.scale = cfg.interface;
        this.monsterName.string = monsterCfg.name;

        this.ordealCfg = cfg;

        GlobalUtil.setAllNodeGray(this.attackBtnNode, 0);
        if (this.ordealCfg.round == this.model.heroTrialInfo.maxStageId) {
            GlobalUtil.setAllNodeGray(this.attackBtnNode, 1);
        }
        //设置提示信息
        //this.monsterTipLayout.removeAllChildren()
        this.monsterTipDes.string = cfg.strategy
        // for (let i = 0; i < cfg.strategy.length; i++) {
        //     let info = cfg.strategy[i];
        //     let node = cc.instantiate(this.monsterTipsItem);
        //     let tip = node.getChildByName('tip').getComponent(cc.Label);
        //     let up = node.getChildByName('up')
        //     let down = node.getChildByName('down');
        //     tip.string = info[0];
        //     up.active = info[1] == 1;
        //     down.active = info[1] != 1;
        //     //GlobalUtil.setSpriteIcon(this.node, icon, path);
        //     node.setParent(this.monsterTipLayout);
        // }
        //设置技能信息
        this.monsterSkillLayout.removeAllChildren()
        for (let i = 0; i < cfg.skill.length; i++) {
            let skillId = cfg.skill[i];
            let node = cc.instantiate(this.monsterSkillItem);
            let skillcfg = ConfigManager.getItemByField(SkillCfg, 'skill_id', skillId)
            let path = 'icon/skill/' + skillcfg.icon
            let icon = node.getChildByName('icon');
            GlobalUtil.setSpriteIcon(this.node, icon, path);
            node.name = skillId + '';
            node.on(cc.Node.EventType.TOUCH_END, this._skillClick, this);
            node.setParent(this.monsterSkillLayout);
        }

        //设置首通奖励信息
        this.stageRewardNode.removeAllChildren()
        for (let i = 0; i < cfg.first_rewards.length; i++) {
            let itemData = cfg.first_rewards[i];
            let node = cc.instantiate(this.rewardItem);
            let rewarItem = node.getComponent(RewardItem);
            let temData = { index: i, typeId: itemData[0], num: itemData[1], delayShow: false, effct: false }
            rewarItem.data = temData;
            rewarItem.updateView();
            node.setParent(this.stageRewardNode);
        }

    }

    curShowSkillId: number = 0;
    skillInfoShowPos: cc.Vec2;
    _skillClick(event: any) {
        let node = event.target;
        this.curShowSkillId = Number(node.name);
        this.skillInfoShowPos = node.convertToWorldSpaceAR(cc.v2(0, -50));
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            let comp = node.getComponent(SkillInfoPanelCtrl);
            comp.showSkillInfo(this.curShowSkillId);
            let pos = this.node.parent.convertToNodeSpaceAR(this.skillInfoShowPos)
            pos.x = node.x;
            node.setPosition(pos);
        });
    }


    refreshAttackNumInfo() {
        //设置进入次数和挑战奖励
        //this.attacckNumLb.string = Math.max(0, this.allAttackNum - this.model.heroTrialInfo.enterTimes) + '';

        //获取最新可领取或者最近达到的目标
        let have = false;
        // let curNum = this.model.heroTrialInfo.challengeTimes;
        // let cfgs = ConfigManager.getItems(Ordeal_challengeCfg, (item: Ordeal_challengeCfg) => {
        //     if (item.type == this.ordealCfg.type && item.challenge_times <= curNum) {
        //         return true;
        //     }
        // })
        // let temNum = 0;
        // let reward = this.model.heroTrialInfo.challengeReward;
        // for (let i = 0; i < cfgs.length; i++) {
        //     let id = cfgs[i].challenge_times
        //     let old = reward[Math.floor((id - 1) / 8)];
        //     if (!((old & 1 << (id - 1) % 8) >= 1)) {
        //         have = true;
        //         temNum = id
        //         break;
        //     }
        // }

        // let tem = this.model.heroTrialInfo.stageDamages;
        // let myDamage = tem[tem.length - 1]
        // this.model.heroTrialInfo.rewardTimes.forEach(data => {
        //     if (myDamage >= data.damage && data.times > 0 && this.model.heroTrialInfo.rewardRecord.indexOf(data.damage) < 0) {
        //         have = true;
        //     }
        // })

        this.redNode.active = have;


        // if (!have) {
        //     let cfg = ConfigManager.getItem(Ordeal_challengeCfg, (item: Ordeal_challengeCfg) => {
        //         if (item.type == this.ordealCfg.type && item.challenge_times > curNum) {
        //             return true;
        //         }
        //     })
        //     if (cfg) {
        //         temNum = cfg.challenge_times;
        //     } else {
        //         temNum = cfgs[cfgs.length - 1].challenge_times
        //     }
        // }
        // this.allAttackNumLb.string = curNum + '/' + temNum
    }

    openRewadView() {
        //cc.log('打开挑战奖励界面')
        gdk.panel.setArgs(PanelId.HeroTrialChallengeRewardView, this.ordealCfg);
        gdk.panel.open(PanelId.HeroTrialChallengeRewardView);
    }

    //打开排行榜
    openRankClick() {
        //cc.log('打开排行榜按钮')

        gdk.panel.setArgs(PanelId.HeroTrialRankView, this.ordealCfg, this.model.heroTrialInfo.serverNum);
        gdk.panel.open(PanelId.HeroTrialRankView);
    }

    attackClick() {

        // if (this.allAttackNum - this.model.heroTrialInfo.enterTimes <= 0) {
        //     gdk.gui.showMessage(gdk.i18n.t("i18n:HEROTRIAL_TIP1"))
        //     return;
        // }
        if (this.ordealCfg.round == this.model.heroTrialInfo.maxStageId) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:HEROTRIAL_TIP2"))
            return;
        }
        if (this.ordealCfg) {
            gdk.panel.setArgs(PanelId.HeroTrialSetUpHeroSelector, this.ordealCfg);
            gdk.panel.open(PanelId.HeroTrialSetUpHeroSelector);
        } else {
            //cc.log('英雄试炼UI点击挑战按钮，没找到对应的关卡配置');
        }
    }

    infoPageSelect(event, index, refresh: boolean = false) {
        //cc.log('---------------------显示怪物信息页签：' + index)
        if (index == 0) {
            this.monsterInfoNode.active = true;
            this.stageRewardNode.active = false;
        } else {
            this.monsterInfoNode.active = false;
            this.stageRewardNode.active = true;
        }
    }

    stagePageSelect(event, index, refresh: boolean = false) {
        //cc.log('---------------------显示关卡页签：' + index)

        if (this.ordealCfgList.length == 0 || this.curStageIndex == index) {
            return;
        }
        if (index < this.stageIndexNum && index != 4) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:HEROTRIAL_TIP2"))
            this.stageMenuBtn.setSelectIdx(this.curStageIndex);
            return;
        } else if (index > this.stageIndexNum && index != 4) {
            //判断是否通过了当前关卡
            if (this.model.heroTrialInfo.maxStageId == this.ordealCfg.round && index == this.ordealCfg.quality) {
                //计算剩余时间
                let temTime = ActUtil.getActStartTime(this.activityId) / 1000 + this.curDay * 86400
                let curTime = GlobalUtil.getServerTime() / 1000;
                let time = TimerUtils.format5(temTime - curTime)
                gdk.gui.showMessage(time + gdk.i18n.t("i18n:HEROTRIAL_TIP9"))
            } else {
                gdk.gui.showMessage(gdk.i18n.t("i18n:HEROTRIAL_TIP3"))
            }
            //gdk.gui.showMessage(gdk.i18n.t("i18n:HEROTRIAL_TIP3"))
            this.stageMenuBtn.setSelectIdx(this.curStageIndex);
            return;
        }

        this.rewardIcon.active = index == 4
        if (index == 4) {
            if (!this.model.ClickHeroTrialEndless) {
                this.model.ClickHeroTrialEndless = true;
                gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
            }
            this.infoMenuBtn.itemNames = ['Boss资料']
        } else {
            this.infoMenuBtn.itemNames = ['Boss资料', '首通奖励']
        }
        this.red2Node.active = !this.model.ClickHeroTrialEndless;

        this.curStageIndex = index
        let curOrdeal = this.ordealCfgList[index];
        this.updateInfoData(curOrdeal);


    }

    getStageAllEnemyHp(stageId: number): number {
        let enemyCfg = [];
        let stageAllEnemyHpNum = 0;
        let stageCfg = ConfigManager.getItemById(Copy_stageCfg, stageId)
        let config = ConfigManager.getItemById(Pve_mainCfg, stageCfg.born);
        // 取出配置
        for (let i = 0, n = config.monster_born_cfg.length; i < n; i++) {
            let item: any = config.monster_born_cfg[i];
            if (cc.js.isString(item)) {
                // 字符串格式，范围配置模式
                let a = item.split('-');
                let b = parseInt(a[0]);
                let e = a[1] ? parseInt(a[1]) : b;
                for (let id = b; id <= e; id++) {
                    let cfg = ConfigManager.getItemById(Pve_bornCfg, id);
                    if (cfg && cfg.num > 0) {
                        enemyCfg.push(cfg);
                    }
                }
            } else {
                let cfg = ConfigManager.getItemById(Pve_bornCfg, item);
                if (cfg && cfg.num > 0) {
                    enemyCfg.push(cfg);
                }
            }
        }
        for (let i = enemyCfg.length - 1; i >= 0; i--) {
            let o = enemyCfg[i];

            // 排除不可计数的怪物
            let cfg = ConfigManager.getItemById(MonsterCfg, o.enemy_id);

            if (!config.endless) {
                if (cfg && cfg.type != 4) {
                    let tem = cc.js.isNumber(stageCfg.hp_correct) ? stageCfg.hp_correct : 0;
                    stageAllEnemyHpNum += o.num * (cfg.hp * (1 + tem));
                }
            } else {
                stageAllEnemyHpNum = Number.MAX_VALUE;
            }
        }
        return stageAllEnemyHpNum
    }

    close() {
        super.close();
        //gdk.panel.open(PanelId.HeroTrialActionView);
        JumpUtils.openActivityMain(8);
    }

}
