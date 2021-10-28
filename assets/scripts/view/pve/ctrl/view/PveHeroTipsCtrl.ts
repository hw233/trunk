import PveFormatter from '../../utils/PveFormatter';
import PveHeroModel from '../../model/PveHeroModel';


/**
 * Hero战斗详情界面召唤物图标控制器
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-09 18:15:42
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveHeroTipsCtrl")
export default class PveHeroTipsCtrl extends cc.Component {
    //生命
    @property(cc.Label)
    hpLabel: cc.Label = null;
    @property(cc.Label)
    hpLabelAdd: cc.Label = null;

    //攻速
    @property(cc.Label)
    atk_speedLabel: cc.Label = null;
    @property(cc.Label)
    atk_speedLabelAdd: cc.Label = null;

    //攻击
    @property(cc.Label)
    atkLabel: cc.Label = null;
    @property(cc.Label)
    atkLabelAdd: cc.Label = null;

    //防御
    @property(cc.Label)
    defLabel: cc.Label = null;
    @property(cc.Label)
    defLabelAdd: cc.Label = null;

    //命中
    @property(cc.Label)
    hitLabel: cc.Label = null;
    @property(cc.Label)
    hitLabelAdd: cc.Label = null;

    //闪避
    @property(cc.Label)
    dodgeLabel: cc.Label = null;
    @property(cc.Label)
    dodgeLabelAdd: cc.Label = null;

    //暴击率
    @property(cc.Label)
    crit_vLabel: cc.Label = null;
    @property(cc.Label)
    crit_vLabelAdd: cc.Label = null;

    //暴击率抗性
    @property(cc.Label)
    crit_v_resLabel: cc.Label = null;
    @property(cc.Label)
    crit_v_resLabelAdd: cc.Label = null;

    //普攻增伤
    @property(cc.Label)
    atk_dmg_fixLabel: cc.Label = null;
    //普攻免伤
    @property(cc.Label)
    atk_res_fixLabel: cc.Label = null;

    //穿刺伤害
    @property(cc.Label)
    dmg_punc_fixLabel: cc.Label = null;
    //穿刺抗性
    @property(cc.Label)
    punc_res_fixLabel: cc.Label = null;

    //辐射伤害
    @property(cc.Label)
    dmg_radi_fixLabel: cc.Label = null;
    //辐射抗性
    @property(cc.Label)
    radi_res_fixLabel: cc.Label = null;

    //火能伤害
    @property(cc.Label)
    dmg_fire_fixLabel: cc.Label = null;
    //火能抗性
    @property(cc.Label)
    fire_res_fixLabel: cc.Label = null;

    //冷冻伤害
    @property(cc.Label)
    dmg_cold_fixLabel: cc.Label = null;
    //冷冻抗性
    @property(cc.Label)
    cold_res_fixLabel: cc.Label = null;

    //电能伤害
    @property(cc.Label)
    dmg_elec_fixLabel: cc.Label = null;
    //电能抗性
    @property(cc.Label)
    elec_res_fixLabel: cc.Label = null;

    //伤害
    @property(cc.Label)
    dmgLabel: cc.Label = null;
    //伤害
    @property(cc.Label)
    dmgAddLabel: cc.Label = null;

    //免伤
    @property(cc.Label)
    dmg_resLabel: cc.Label = null;
    //免伤
    @property(cc.Label)
    dmg_resAddLabel: cc.Label = null;

    onLoad() {
        let node = this.node.getChildByName('LabelNode');
        if (node) {
            node.active = false;
        }
    }

    updateProperty(label: cc.Label, value: number, add: boolean = false) {
        if (value > 0) {
            label.string = "+" + value;
            label.node.color = cc.color("#85ED83");
            label.node.active = true;
        } else if (value < 0) {
            label.string = value.toString();
            label.node.color = cc.color("#FF44443");
        }
        if (add) {
            label.string = label.string + '%'
        }

        label.node.active = value != 0;
    }

    setPveHeroModel(model: PveHeroModel) {
        let baseProp = model.baseProp;
        let prop = model.prop;
        this.hpLabel.string = Math.floor(baseProp.hp).toString();
        let hpAdd = Math.floor(prop.hp - baseProp.hp);
        this.updateProperty(this.hpLabelAdd, hpAdd);

        let atk_speed = 100//baseProp.atk_speed * (1 + baseProp.atk_speed_r / 10000) + baseProp.atk_speed_t;
        this.atk_speedLabel.string = Math.floor(atk_speed).toString();
        let atk_speedAdd = Math.floor(prop.atk_speed_r / 100)//prop.atk_speed * (1 + prop.atk_speed_r / 10000) - atk_speed;
        atk_speedAdd = Math.max(-100, atk_speedAdd)
        this.updateProperty(this.atk_speedLabelAdd, atk_speedAdd);

        this.atkLabel.string = Math.floor(baseProp.atk).toString();
        let atkAdd = prop.atk - baseProp.atk;
        this.updateProperty(this.atkLabelAdd, Math.floor(atkAdd));

        this.defLabel.string = Math.floor(baseProp.def).toString();
        let defAdd = prop.def - baseProp.def;
        this.updateProperty(this.defLabelAdd, Math.floor(defAdd));

        this.hitLabel.string = Math.floor(baseProp.hit).toString();
        let hitAdd = prop.hit - baseProp.hit;
        this.updateProperty(this.hitLabelAdd, Math.floor(hitAdd));

        this.dodgeLabel.string = Math.floor(baseProp.dodge).toString();
        let dodgeAdd = prop.dodge - baseProp.dodge;
        this.updateProperty(this.dodgeLabelAdd, Math.floor(dodgeAdd));

        this.dmgLabel.string = `${PveFormatter.format(baseProp.dmg_add)}%`;
        let dmgAdd = parseFloat(PveFormatter.format(prop.dmg_add - baseProp.dmg_add));
        this.updateProperty(this.dmgAddLabel, dmgAdd, true);

        this.dmg_resLabel.string = `${PveFormatter.format(baseProp.dmg_res)}%`;
        let dmg_resAdd = parseFloat(PveFormatter.format(prop.dmg_res - baseProp.dmg_res));
        this.updateProperty(this.dmg_resAddLabel, dmg_resAdd, true);

        this.crit_vLabel.string = `${PveFormatter.format(baseProp.crit_v / 10000)}%`;
        let critVAdd = parseFloat(PveFormatter.format((prop.crit_v - baseProp.crit_v) / 10000));
        this.updateProperty(this.crit_vLabelAdd, critVAdd, true);

        this.crit_v_resLabel.string = `${PveFormatter.format(baseProp.crit_v_res)}%`;
        let critVResAdd = parseFloat(PveFormatter.format(prop.crit_v_res - baseProp.crit_v_res));
        this.updateProperty(this.crit_v_resLabelAdd, critVResAdd, true);

        this.atk_dmg_fixLabel.string = `${PveFormatter.format(prop.atk_dmg)}%`;
        this.atk_res_fixLabel.string = `${PveFormatter.format(prop.atk_res)}%`;

        this.dmg_punc_fixLabel.string = `${PveFormatter.format(prop.dmg_punc)}%`;
        this.punc_res_fixLabel.string = `${PveFormatter.format(prop.punc_res)}%`;

        this.dmg_radi_fixLabel.string = `${PveFormatter.format(prop.dmg_radi)}%`;
        this.radi_res_fixLabel.string = `${PveFormatter.format(prop.radi_res)}%`;

        this.dmg_fire_fixLabel.string = `${PveFormatter.format(prop.dmg_fire)}%`;
        this.fire_res_fixLabel.string = `${PveFormatter.format(prop.fire_res)}%`;

        this.dmg_cold_fixLabel.string = `${PveFormatter.format(prop.dmg_cold)}%`;
        this.cold_res_fixLabel.string = `${PveFormatter.format(prop.cold_res)}%`;

        this.dmg_elec_fixLabel.string = `${PveFormatter.format(prop.dmg_elec)}%`;
        this.elec_res_fixLabel.string = `${PveFormatter.format(prop.elec_res)}%`;

        let node = this.node.getChildByName('LabelNode');
        if (node) {
            node.active = true;
        }
    }
}
