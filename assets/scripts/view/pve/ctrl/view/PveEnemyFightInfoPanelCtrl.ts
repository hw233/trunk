import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PanelId from '../../../../configs/ids/PanelId';
import PveEnemyModel from '../../model/PveEnemyModel';
import PveFormatter from '../../utils/PveFormatter';
import StringUtils from '../../../../common/utils/StringUtils';
import { CommonCfg, Skill_buffCfg } from '../../../../a/config';

/**
 * enemy战斗详情界面控制器
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-26 17:23:07
 */
const { ccclass, property, menu } = cc._decorator;
function hasId(v: any): boolean {
    return v.id == this.id;
}
@ccclass
@menu("qszc/scene/pve/view/PveEnemyFightInfoPanelCtrl")
export default class PveEnemyFightInfoPanelCtrl extends gdk.BasePanel {

    @property(cc.Label)
    enemyName: cc.Label = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    boss: cc.Node = null;
    @property(cc.Node)
    jingyin: cc.Node = null;

    @property(cc.RichText)
    desc: cc.RichText = null;

    @property(cc.Label)
    hp: cc.Label = null;

    @property(cc.Label)
    atk: cc.Label = null;
    @property(cc.Label)
    add_atk: cc.Label = null;
    @property(cc.Label)
    def: cc.Label = null;
    @property(cc.Label)
    add_def: cc.Label = null;
    @property(cc.Label)
    hit: cc.Label = null;
    @property(cc.Label)
    add_hit: cc.Label = null;
    @property(cc.Label)
    speed: cc.Label = null;
    @property(cc.Label)
    add_speed: cc.Label = null;
    @property(cc.Label)
    dodge: cc.Label = null;
    @property(cc.Label)
    add_dodge: cc.Label = null;
    @property(cc.Label)
    fire_res: cc.Label = null;
    @property(cc.Label)
    add_fire_res: cc.Label = null;
    @property(cc.Label)
    elec_res: cc.Label = null;
    @property(cc.Label)
    add_elec_res: cc.Label = null;
    @property(cc.Label)
    redi_res: cc.Label = null;
    @property(cc.Label)
    add_redi_res: cc.Label = null;
    @property(cc.Label)
    cold_res: cc.Label = null;
    @property(cc.Label)
    add_cold_res: cc.Label = null;
    @property(cc.Label)
    punc_res: cc.Label = null;
    @property(cc.Label)
    add_punc_res: cc.Label = null;

    @property(cc.Node)
    titleNode: cc.Node = null;
    @property(cc.Node)
    blood: cc.Node = null;
    @property(cc.Node)
    enemyBuffLayout: cc.Node = null;
    @property(cc.Prefab)
    enemyBuffItem: cc.Prefab = null;
    @property(cc.Node)
    buffDescNode: cc.Node = null;
    @property(cc.Node)
    buffDescBg: cc.Node = null;
    @property(cc.RichText)
    buffDesc: cc.RichText = null;


    enemyModel: PveEnemyModel;
    bloodW: number = 228;
    enemyBuffs: any[] = [];
    refreshTime: number = 0.6;

    colorList = [cc.color("#85ED83"), cc.color("#FF1D1D")]

    onEnable() {
        this.buffDescNode.active = false;
        let data = gdk.panel.getArgs(PanelId.PveEnemyFightInfo)
        if (data) {
            this.enemyModel = data[0];
            this.initEnemyInfo();
        }
        this.refreshBuff()
        //this.initEnemyInfo();
    }

    onDisable() {
        if (this.enemyBuffLayout.childrenCount > 0) {
            this.enemyBuffLayout.children.forEach(node => {
                node.targetOff(this);
            })
            this.enemyBuffLayout.destroyAllChildren();
        }
    }

    update(dt: number) {
        if (!this.enemyModel || !this.enemyModel.config) {
            this.close();
            return;
        }
        if (this.enemyModel.ctrl && !this.enemyModel.ctrl.isAlive) {
            this.close();
            return;
        }
        if (this.refreshTime <= 0) {
            // 刷新怪物buff
            this.refreshBuff();
            this.refreshTime = 0.6;
        } else {
            this.refreshTime -= dt;
        }
    }

    initEnemyInfo() {
        if (!this.enemyModel || !this.enemyModel.config) {
            return
        }
        if (this.enemyModel.ctrl && !this.enemyModel.ctrl.isAlive) {
            this.close();
            return;
        }
        this.enemyName.string = this.enemyModel.config.name;
        this.desc.string = this.enemyModel.config.desc;
        this.setEnemyType(this.enemyModel.config.color)
        //设置怪物属性
        this.refreshEnemyInfo();

        //设置怪物模型
        let url: string = StringUtils.format("spine/monster/{0}/{0}", this.enemyModel.config.skin);
        GlobalUtil.setSpineData(this.spine.node, this.spine, url, true, 'stand_s', true);
        this.spine.node.scale = this.enemyModel.config.size + 0.4;//1;
        this.spine.node.opacity = 255;

        //设置怪物特性
        if (cc.js.isString(this.enemyModel.config.type)) {
            this.titleNode.active = false;
        } else {
            let i = 1;
            this.titleNode.active = true;
            this.titleNode.children.forEach(children => {
                if (cc.js.isNumber(this.enemyModel.config.type)) {
                    if (Number(this.enemyModel.config.type) == i) {
                        children.active = true;
                    } else {
                        children.active = false;
                    }
                } else {
                    if (this.enemyModel.config.type.indexOf(i) >= 0) {
                        children.active = true;
                    } else {
                        children.active = false;
                    }
                    i++;
                }
            })
        }

    }

    setEnemyType(type: any) {
        //color 1小怪 11精英 12Boss 13特定小怪
        if (cc.js.isNumber(this.enemyModel.config.color)) {
            if (this.enemyModel.config.color == 12) {
                this.boss.active = true;
                this.jingyin.active = false;
            } else if (this.enemyModel.config.color == 11) {
                this.boss.active = false;
                this.jingyin.active = true;
            } else {
                this.boss.active = false;
                this.jingyin.active = false;
            }
        } else {
            this.boss.active = false;
            this.jingyin.active = false;
        }
    }
    //更新怪物血量
    @gdk.binding('enemyModel.hp')
    refreshBlood() {
        if (!this.enemyModel) return;
        if (this.enemyModel.hp == 0) {
            this.close();
            return;
        }
        this.hp.string = Math.floor(this.enemyModel.hp) + '/' + this.enemyModel.hpMax;
        this.blood.width = this.enemyModel.hp / this.enemyModel.hpMax * this.bloodW;
    }

    refreshEnemyInfo() {
        let baseProp = this.enemyModel.baseProp;
        let prop = this.enemyModel.prop;

        let base_atk = Math.floor(baseProp.atk)
        let prop_atk = Math.floor(prop.atk)
        this.atk.string = base_atk + ''
        this.add_atk.string = prop_atk > base_atk ? '+' + (prop_atk - base_atk) : '' + (prop_atk - base_atk);
        this.add_atk.node.active = prop_atk != base_atk

        let base_def = Math.floor(baseProp.def)
        let prop_def = Math.floor(prop.def)
        this.def.string = base_def + ''
        this.add_def.string = prop_def > base_def ? '+' + (prop_def - base_def) : '' + (prop_def - base_def);
        this.add_def.node.active = prop_def != base_def

        let base_hit = Math.floor(baseProp['hit'] || 0);
        let prop_hit = Math.floor(prop['hit'] || 0);
        this.hit.string = base_hit > 0 ? base_hit + '' : '0';
        this.add_hit.string = prop_hit > base_atk ? '+' + (prop_hit - base_hit) : '' + (prop_hit - base_hit);
        this.add_hit.node.active = prop_hit != base_hit

        let base_speed = Math.floor(baseProp.speed)
        let prop_speed = Math.floor(this.enemyModel.speed)
        this.speed.string = base_speed + ''
        this.add_speed.string = prop_speed > base_speed ? '+' + (prop_speed - base_speed) : '' + (prop_speed - base_speed);
        this.add_speed.node.active = prop_speed != base_speed

        //let base_fire = this.enemyModel.baseProp['fire_res_fix'] ? Math.floor(this.enemyModel.baseProp.fire_res_fix) : 0;
        let prop_fire = prop['fire_res'] || 0;//this.enemyModel.prop['fire_res_fix'] ? Math.floor(this.enemyModel.prop.fire_res_fix) : 0;
        this.fire_res.string = `${PveFormatter.format(prop_fire)}%`;//base_fire > 0 ? base_fire + '' : '0';
        //this.add_fire_res.string = prop_fire > base_fire ? '+' + (prop_fire - base_fire) : '' + (prop_fire - base_fire);
        this.add_fire_res.node.active = false//prop_fire != base_fire

        //let base_elec = this.enemyModel.baseProp['elec_res_fix'] ? Math.floor(this.enemyModel.baseProp.elec_res_fix) : 0;
        let prop_elec = prop['elec_res'] || 0;//this.enemyModel.prop['elec_res_fix'] ? Math.floor(this.enemyModel.prop.elec_res_fix) : 0;
        this.elec_res.string = `${PveFormatter.format(prop_elec)}%`;//base_elec > 0 ? base_elec + '' : '0';
        //this.add_elec_res.string = prop_elec > base_elec ? '+' + (prop_elec - base_elec) : '' + (prop_elec - base_elec);
        this.add_elec_res.node.active = false//prop_elec != base_elec

        //let base_redi = this.enemyModel.baseProp['radi_res_fix'] ? Math.floor(this.enemyModel.baseProp.radi_res_fix) : 0;
        let prop_redi = prop['radi_res'] || 0;//this.enemyModel.prop['radi_res_fix'] ? Math.floor(this.enemyModel.prop.radi_res_fix) : 0;
        this.redi_res.string = `${PveFormatter.format(prop_redi)}%`;//base_redi > 0 ? base_redi + '' : '0';
        //this.add_redi_res.string = prop_redi > base_redi ? '+' + (prop_redi - base_redi) : '' + (prop_redi - base_redi);
        this.add_redi_res.node.active = false// prop_redi != base_redi

        //let base_cold = this.enemyModel.baseProp['cold_res_fix'] ? Math.floor(this.enemyModel.baseProp.cold_res_fix) : 0;
        let prop_cold = prop['cold_res'] || 0;//this.enemyModel.prop['cold_res_fix'] ? Math.floor(this.enemyModel.prop.cold_res_fix) : 0;
        this.cold_res.string = `${PveFormatter.format(prop_cold)}%`;//base_cold > 0 ? base_cold + '' : '0';
        //this.add_cold_res.string = prop_cold > base_cold ? '+' + (prop_cold - base_cold) : '' + (prop_cold - base_cold);
        this.add_cold_res.node.active = false//prop_cold != base_cold

        //let base_punc = this.enemyModel.baseProp['punc_res_fix'] ? Math.floor(this.enemyModel.baseProp.punc_res_fix) : 0;
        let prop_punc = prop['punc_res'] || 0;//this.enemyModel.prop['punc_res_fix'] ? Math.floor(this.enemyModel.prop.punc_res_fix) : 0;
        this.punc_res.string = `${PveFormatter.format(prop_punc)}%`;//base_punc > 0 ? base_punc + '' : '0';
        //this.add_punc_res.string = prop_punc > base_punc ? '+' + (prop_punc - base_punc) : '' + (prop_punc - base_punc);
        this.add_punc_res.node.active = false//prop_punc != base_punc

        let base_dodge = Math.floor(baseProp['dodge'] || 0);
        let prop_dodge = Math.floor(prop['dodge'] || 0);
        if (base_dodge > 0 || prop_dodge > 0) {
            this.dodge.node.parent.active = true
            this.dodge.string = `${base_dodge}`
            this.add_dodge.string = prop_dodge > base_dodge ? '+' + (prop_dodge - prop_dodge) : '' + (prop_dodge - prop_dodge);
            this.add_dodge.node.active = prop_dodge != base_dodge
        }
    }

    refreshBuff() {
        if (!this.enemyModel) {
            return
        }
        let b = this.enemyModel.buffs;
        let a: any[] = [];
        for (let i = 0, n = b.length; i < n; i++) {
            let item = b[i];
            if (item.config.icon && !a.some(hasId.bind(item))) {
                a.push({
                    id: item.id,
                    addTime: item.addTime,
                    config: item.config,
                    stack: item.stacking,
                });
            }
        }
        if (!this.needRefreshBuff(a)) {
            return;
        }
        //刷新属性值
        this.refreshEnemyInfo();

        this.enemyBuffs = a;
        this.enemyBuffLayout.children.forEach(node => {
            node.targetOff(this);
        })
        this.enemyBuffLayout.destroyAllChildren();

        if (a) {
            a.forEach(buffData => {

                let node = cc.instantiate(this.enemyBuffItem);
                let icon = node.getComponent(cc.Sprite);
                let num = node.getChildByName('num').getComponent(cc.Label);
                let path: string = ConfigManager.getItemById(CommonCfg, 'BUFF_ICON').value + buffData.config.icon;
                GlobalUtil.setSpriteIcon(this.node, icon, path)
                if (buffData.stack > 1) {
                    num.string = buffData.stack + ''
                    num.node.active = true;
                } else {
                    num.node.active = false;;
                }
                node.parent = this.enemyBuffLayout;
                node.on(cc.Node.EventType.TOUCH_START, () => {
                    this.showBuff(buffData.config)
                }, this)
                node.on(cc.Node.EventType.TOUCH_END, () => {
                    this.showBuff(buffData.config, true)
                }, this)
                node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
                    this.showBuff(buffData.config, true)
                }, this)

            })
        }
    }

    //判断buff是否需要刷新
    needRefreshBuff(data: any[]): boolean {

        if (data.length != this.enemyBuffs.length) {
            return true
        } else {
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    if (!(data[i].id == this.enemyBuffs[i].id && data[i].stack == this.enemyBuffs[i].stack)) {
                        return true
                    }
                }
            } else {
                if (this.enemyBuffLayout.childrenCount > 0) {
                    this.enemyBuffLayout.children.forEach(node => {
                        node.targetOff(this);
                    })
                    this.enemyBuffLayout.destroyAllChildren();
                }
            }
        }
        return false;
    }

    //显示buff描述
    showBuff(buffCfg: Skill_buffCfg, isClose: boolean = false) {
        if (isClose) {
            this.buffDescNode.active = false;
            return;
        } else {
            this.buffDescNode.active = true;
        }
        this.buffDesc.string = buffCfg.des;
    }
}
