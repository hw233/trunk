import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import InstanceModel from '../../../instance/model/InstanceModel';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RewardItem from '../../../../common/widgets/RewardItem';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import {
    Copy_stageCfg,
    MonsterCfg,
    Newordeal_ordealCfg,
    Pve_bornCfg,
    Pve_mainCfg
    } from '../../../../a/config';
import { ListView } from '../../../../common/widgets/UiListview';

/** 
 * @Description: 新英雄试炼关卡奖励Item
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-09 10:08:14
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/newHeroTrial/NewHeroTrialStageRewardItemCtrl")
export default class NewHeroTrialStageRewardItemCtrl extends UiListItem {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Node)
    jinduNode: cc.Node = null;
    @property(cc.Node)
    jinduSp: cc.Node = null;
    @property(cc.Label)
    jinduLb: cc.Label = null;
    @property(cc.Label)
    desLb: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    yilingqu: cc.Node = null;
    @property(cc.Node)
    attackBtn: cc.Node = null;

    rewardList: ListView;

    info: { cfg: Newordeal_ordealCfg, index: number, curCfg: Newordeal_ordealCfg, isLast: boolean }  //state 0 已领取 1可领取 2 不可领取

    model: InstanceModel = ModelManager.get(InstanceModel);

    btnState: number = 0; //btnState 0可挑战 1时间未到 2通关前置关卡
    activityId: number = 70;
    updateView() {
        this.info = this.data;
        this.nameLabel.string = this.info.cfg.difficulty
        let heroTrialInfo = this.model.newHeroTrialInfo;
        let stageId = heroTrialInfo.maxStageId > 0 ? heroTrialInfo.maxStageId : 0;
        let curDamage = heroTrialInfo.stageDamages.length > this.info.index ? heroTrialInfo.stageDamages[this.info.index] : 0;
        let allDamage = this.getStageAllEnemyHp(this.info.cfg.round);
        let num = Math.floor((curDamage / allDamage) * 100)
        this.jinduLb.string = num + '%'
        this.jinduSp.width = 158 * num / 100;
        if (stageId == 0) {
            this.jinduNode.active = this.info.index == 0;
            this.desLb.node.active = this.info.index != 0;
            this.desLb.string = "";
            this.yilingqu.active = false;
            this.attackBtn.active = true;
            let stage: 0 | 1 = this.info.index == 0 ? 0 : 1;
            GlobalUtil.setAllNodeGray(this.attackBtn, stage);
            this.btnState = this.info.index == 0 ? 0 : 2;

        } else if (this.info.isLast) {
            this.jinduNode.active = false;
            this.desLb.node.active = false;
            this.yilingqu.active = true;
            this.attackBtn.active = false;
        } else {
            if (this.info.cfg.round <= stageId) {
                this.jinduNode.active = true;
                this.desLb.node.active = false;
                this.yilingqu.active = true;
                this.attackBtn.active = false;
            } else if (this.info.cfg.round == stageId + 1) {
                this.jinduNode.active = true;

                this.yilingqu.active = false;
                this.attackBtn.active = true;
                let btnState: 0 | 1 = 0;
                if (this.info.curCfg.round == stageId) {
                    this.btnState = 1;
                    this.jinduNode.active = false;
                    this.desLb.node.active = true;
                    btnState = 1;
                    this.refreshTimeStr();
                    gdk.Timer.loop(2000, this, this.refreshTimeStr)
                } else {
                    this.btnState = 0;
                    this.jinduNode.active = true;
                    this.desLb.node.active = false;
                }
                GlobalUtil.setAllNodeGray(this.attackBtn, btnState);

            } else {
                this.jinduNode.active = false;
                this.desLb.node.active = false;
                this.yilingqu.active = false;
                this.attackBtn.active = true;
                GlobalUtil.setAllNodeGray(this.attackBtn, 1);
                this.btnState = 2;
            }
        }

        //刷新奖励信息
        this._updateRewardData()
    }


    refreshTimeStr() {
        let temTime = ActUtil.getActStartTime(this.activityId) / 1000 + (this.info.cfg.quality - 1) * 86400
        let curTime = GlobalUtil.getServerTime() / 1000;
        let time = TimerUtils.format5(temTime - curTime)
        this.desLb.string = time + gdk.i18n.t("i18n:HEROTRIAL_TIP11")
    }

    onDisable() {
        gdk.Timer.clearAll(this);
    }

    _updateRewardData() {
        this.content.removeAllChildren()
        for (let i = 0; i < this.info.cfg.first_rewards.length; i++) {
            let node = cc.instantiate(this.itemPrefab);
            let ctrl = node.getComponent(RewardItem);
            let tem = this.info.cfg.first_rewards[i];
            let temData = { index: i, typeId: tem[0], num: tem[1], delayShow: false, effct: false }
            ctrl.data = temData;
            ctrl.updateView();
            node.setParent(this.content)
        }
    }



    lingquBtnClick() {
        switch (this.btnState) {
            case 0:
                gdk.panel.setArgs(PanelId.HeroTrialSetUpHeroSelector, this.info.cfg);
                gdk.panel.open(PanelId.HeroTrialSetUpHeroSelector);
                break;
            case 1:
                let temTime = ActUtil.getActStartTime(this.activityId) / 1000 + (this.info.cfg.quality - 1) * 86400
                let curTime = GlobalUtil.getServerTime() / 1000;
                let time = TimerUtils.format5(temTime - curTime)
                gdk.gui.showMessage(time + StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_TIP11"), this.info.cfg.difficulty))
                break;
            case 2:
                gdk.gui.showMessage(gdk.i18n.t("i18n:HEROTRIAL_TIP13"))
                break;
        }
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

}
