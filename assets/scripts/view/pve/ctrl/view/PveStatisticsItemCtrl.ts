import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import { BagType } from '../../../../common/models/BagModel';
import {
    HeroCfg,
    Monster2Cfg,
    MonsterCfg,
    SoldierCfg
    } from '../../../../a/config';
import { HurtInfoStatistics } from '../../utils/PveBattleInfoUtil';
import { PveFightType } from '../../core/PveFightModel';
/** 
 * Pve伤害统计界面Item类
 * @Author: yaozu.hu  
 * @Date: 2019-06-14 17:38:03 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-15 19:47:09
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveStatisticsItemCtrl")
export default class PveStatisticsItemCtrl extends UiListItem {

    //角色名称
    @property(cc.Label)
    nameLb: cc.Label = null
    //总输出
    @property(cc.Label)
    allOutput: cc.Label = null
    //总承受
    @property(cc.Label)
    allSuffer: cc.Label = null
    //技能输出
    @property(cc.Label)
    outputSkill: cc.Label = null
    //普攻输出
    @property(cc.Label)
    outputNormal: cc.Label = null
    //buff输出
    @property(cc.Label)
    outputBuff: cc.Label = null
    //承受的技能伤害
    @property(cc.Label)
    sufferSkill: cc.Label = null
    //承受的普攻伤害
    @property(cc.Label)
    sufferNormal: cc.Label = null
    //承受的buff伤害
    @property(cc.Label)
    sufferBuff: cc.Label = null
    //总治疗量
    @property(cc.Label)
    allOutputRecover: cc.Label = null
    //总被治疗量
    @property(cc.Label)
    allSufferRecover: cc.Label = null
    //死亡时间
    @property(cc.Label)
    deadTime: cc.Label = null
    @property(cc.Sprite)
    headIcon: cc.Sprite = null;
    @property(cc.Node)
    mvpnode: cc.Node = null;

    pos: number = 0;
    //伤害详细信息
    damageData: HurtInfoStatistics = null;
    //角色的类型
    type: PveFightType = null;

    onLoad() {

    }

    updateView() {
        this.damageData = this.data.damageData;
        this.type = this.data.type
        this.pos = this.data.pos
        this.nameLb.string = this.GetfightName(this.type, this.damageData.baseId, this.damageData.fightId)
        this.allOutput.string = this.damageData.OutputAllDamage + ''
        this.allSuffer.string = this.damageData.SufferAllDamage + ''
        this.outputSkill.string = this.damageData.OutputSkillDamage + ''
        this.outputNormal.string = this.damageData.OutputNormalDamage + ''
        this.outputBuff.string = this.damageData.OutputBuffDamage + ''
        this.sufferSkill.string = this.damageData.SufferSkillDamage + ''
        this.sufferNormal.string = this.damageData.SufferNormalDamage + ''
        this.sufferBuff.string = this.damageData.SufferBuffDamage + ''
        this.allOutputRecover.string = this.damageData.OutputRecoverAllHp + ''
        this.allSufferRecover.string = this.damageData.SufferRecoverAllHp + ''
        let temStr = this.damageData.deadTime + ''
        if (this.type == PveFightType.Soldier || this.type == PveFightType.Call) {
            temStr = Math.floor(this.damageData.fightTime) + ''
        }
        this.deadTime.string = temStr
        if (this.pos == 0) {
            this.mvpnode.active = true;
        } else {
            this.mvpnode.active = false;
        }
    }

    //获取名称
    GetfightName(type: PveFightType, baseID: number, fightId: number): string {
        let name = "";
        this.headIcon.spriteFrame = null;
        switch (type) {
            case PveFightType.Enemy:
                {
                    let monsterCfg: MonsterCfg | Monster2Cfg;
                    monsterCfg = ConfigManager.getItemById(MonsterCfg, baseID)
                    if (!monsterCfg) {
                        // 有可能是卡牌怪物
                        monsterCfg = ConfigManager.getItemById(Monster2Cfg, baseID)
                    }
                    name = monsterCfg.name + '_' + fightId
                    GlobalUtil.setSpriteIcon(
                        this.node,
                        this.headIcon,
                        GlobalUtil.getIconById(baseID, BagType.MONSTER),
                    )
                }
                break;

            case PveFightType.Hero:
                {
                    let heroCfg = ConfigManager.getItemById(HeroCfg, baseID)
                    name = heroCfg.name
                    GlobalUtil.setSpriteIcon(
                        this.node,
                        this.headIcon,
                        GlobalUtil.getIconById(baseID, BagType.HERO),
                    )
                }
                break;

            case PveFightType.Soldier:
                {
                    let soldierCfg: any = ConfigManager.getItemById(SoldierCfg, baseID)
                    if (!soldierCfg) {
                        // 有可能是卡牌怪物
                        soldierCfg = ConfigManager.getItemById(Monster2Cfg, baseID)
                    }
                    name = soldierCfg.name + '_' + fightId
                    GlobalUtil.setSpriteIcon(
                        this.node,
                        this.headIcon,
                        GlobalUtil.getSoldierIcon(baseID) + '_s',
                    )
                }
                break;

            case PveFightType.Genral:
                name = gdk.i18n.t("i18n:GENERAL_TITLE")//"指挥官"
                break;

            case PveFightType.Call:
                {
                    let CallCfg = ConfigManager.getItemById(MonsterCfg, baseID)
                    if (CallCfg) {
                        name = CallCfg.name + '_' + fightId
                        GlobalUtil.setSpriteIcon(
                            this.node,
                            this.headIcon,
                            GlobalUtil.getIconById(baseID, BagType.MONSTER),
                        )
                    }

                }
                break;
        }
        return name;
    }
}
