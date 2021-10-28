import CareerTipCtrl from '../../../../../common/widgets/CareerTipCtrl';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import ErrorManager from '../../../../../common/managers/ErrorManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RoleEliteAttTipsCtrl from './RoleEliteAttTipsCtrl';
import RoleModel from '../../../../../common/models/RoleModel';
import RoleViewCtrl2 from '../RoleViewCtrl2';
import SoldierModel from '../../../../../common/models/SoldierModel';
import { Hero_careerCfg } from '../../../../../a/config';
import { RoleEventId } from '../../../enum/RoleEventId';
import { SoldierEventId } from '../../../enum/SoldierEventId';

/**
 * 角色界面属性面板控制
 * @Author: luoyong
 * @Date: 2020-02-21 18:31:30
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-25 10:39:51
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/common/RoleAttrCtrl2")
export default class RoleAttrCtrl2 extends cc.Component {
    @property(cc.Node)
    labsNode: cc.Node = null;

    @property(cc.Sprite)
    solIcon: cc.Sprite = null;

    @property(cc.Node)
    hateIcon: cc.Node = null;

    @property(cc.Label)
    fightLab: cc.Label = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Label)
    lvLimitLab: cc.Label = null;

    @property(sp.Skeleton)
    upgradeEffect: sp.Skeleton = null;

    @property(sp.Skeleton)
    upgradeEffect2: sp.Skeleton = null;

    attLabs: Array<cc.Label> = [];      // 白字属性lab数组
    extLabs: Array<cc.Label> = [];      // 绿字属性lab数组
    stageLabs: Array<cc.Sprite> = [];    // 评级lab数组

    _roleSelectIndex: number = 0

    get model() {
        return ModelManager.get(HeroModel);
    }

    get heroInfo() {
        return this.model.curHeroInfo;
    }

    get roleModel() {
        return ModelManager.get(RoleModel);
    }

    onEnable() {
        // 事件
        gdk.e.on(RoleEventId.UPDATE_HERO_ATTR, this._updateHeroArr, this);
        gdk.e.on(RoleEventId.SHOW_HERO_UP_EFFECT, this._showHeroUpEffectFunc, this);
        gdk.e.on(SoldierEventId.RSP_SOLDIER_LIST, this._updateHeroArr, this)

        // 属性文本
        let labsNode = this.labsNode;
        for (let index = 0; index < 4; index++) {
            let stageLab = labsNode.getChildByName(`stageLab${index + 1}`);
            let attLab = labsNode.getChildByName(`attLab${index + 1}`);
            let extLab = labsNode.getChildByName(`extLab${index + 1}`);
            this.stageLabs[index] = stageLab.getComponent(cc.Sprite);
            this.attLabs[index] = attLab.getComponent(cc.Label);
            this.extLabs[index] = extLab.getComponent(cc.Label);
        }
        this.labsNode.active = false
        this.hateIcon.active = false;
    }

    onDisable() {
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
        ErrorManager.targetOff(this);
    }

    // updateSelect(index) {
    //     this._roleSelectIndex = index
    //     if (index == 1) {
    //         this.hideBtn()
    //     } else {
    //         this._updateLevel(this.model.curHeroInfo.level)
    //     }
    // }

    /**更新英雄信息 */
    @gdk.binding("model.curHeroInfo")
    _updateHero(curHero: icmsg.HeroInfo) {
        if (!curHero) {
            return;
        }
        this._updateHeroArr();
        this._updateHeroPower(curHero.power);
        this._updateLevel(curHero.level);
        this._updateSoldierInfo();
        gdk.e.emit(RoleEventId.UPDATE_ONE_HERO)
    }

    /**更新英雄战力 */
    @gdk.binding("model.curHeroInfo.power")
    _updateHeroPower(power: number) {
        if (!cc.js.isNumber(power)) {
            return;
        }
        this.fightLab.string = power.toFixed(0);
    }

    /**更新英雄属性 */
    _updateHeroArr(e?: gdk.Event) {
        this.labsNode.active = true
        let curHero = this.heroInfo;
        if (!this.node.active || !curHero) {
            return
        }
        if (e && e.data) {
            let uId = e.data
            if (uId != curHero.heroId) {
                return
            }
        }
        let heroAtt = HeroUtils.getHeroAttrById(curHero.heroId);
        if (!heroAtt) {
            let msg = new icmsg.HeroDetailReq()
            msg.heroId = curHero.heroId
            NetManager.send(msg)
            return;
        }

        let sModel = ModelManager.get(SoldierModel)
        let heroSoldiers = sModel.heroSoldiers
        let soldierType = heroSoldiers[curHero.heroId]
        if (!soldierType) {
            let msg = new icmsg.HeroSoldierListReq()
            msg.heroId = curHero.heroId
            NetManager.send(msg)
            return
        }

        let cfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", curHero.careerId, null)
        // 更新英雄属性等级
        let attIconName = ["atk", "def", "hp", "speed"];
        let stageKeys = [
            "grow_atk", // 攻击
            "grow_def", // 防御
            "grow_hp",  // 生命
            "atk_speed",// 出手顺序
        ]
        for (let index = 0; index < this.stageLabs.length; index++) {
            const lab = this.stageLabs[index];
            let key = stageKeys[index];
            let val = cfg[key];
            let tInfo = HeroUtils.getGrowInfoById(key, val);
            let show = tInfo ? tInfo.show : "A";
            let name = attIconName[index];
            if (index <= 3) {
                GlobalUtil.setSpriteIcon(this.node, lab, `view/role/texture/common2/yx_${name}_${show}`);
            }
        }
        let attName = ["atkW", "defW", "hpW", "atk_order"];
        let extName = ["atkG", "defG", "hpG", "atk_order"];
        for (let index = 0; index < attName.length; index++) {
            const key = attName[index];
            const key2 = extName[index];
            if (key == "atk_order") {
                let hero = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', curHero.careerId);
                this.attLabs[index].string = hero.atk_order.toString();
                this.extLabs[index].string = ``;
            } else {
                let val = heroAtt[key];
                let val2 = heroAtt[key2];
                this.attLabs[index].string = val;

                let heroSoldier: icmsg.HeroSoldier = soldierType.items[soldierType.curId]
                let soliderAdd = heroSoldier[key] + heroSoldier[key2]
                val2 += soliderAdd

                if (val2 > 0) {
                    this.extLabs[index].string = `+${val2}`;
                } else {
                    this.extLabs[index].string = "";
                }
            }
        }
    }

    /**更新等级 */
    _updateLevel(curLv: number) {
        if (!cc.js.isNumber(curLv)) {
            return;
        }
        this.lvLab.string = `${curLv}`;
        // let starCfg = ConfigManager.getItemById(Hero_starCfg, this.model.curHeroInfo.star);
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.model.curHeroInfo.careerId, { career_lv: this.model.curHeroInfo.careerLv });
        this.lvLimitLab.string = `/${careerCfg.hero_lv}`;
    }

    /**当前士兵变更 */
    _updateSoldierInfo() {
        if (!this.heroInfo) {
            return
        }
        let nameArr = ["yx_chengse", "yx_chengse", "yx_lanse", "yx_lvse"]
        let cfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.heroInfo.careerId, null)
        GlobalUtil.setSpriteIcon(this.node, this.solIcon, `common/texture/soldier/${nameArr[cfg.career_type - 1]}`);
        this.hateIcon.active = cfg.career_type == 4
        if (cfg.career_type == 4) {
            let num = this.hateIcon.getChildByName('num').getComponent(cc.Label);
            num.string = 'x' + cfg.hate_num
        }
    }


    openEliteAttTipsFunc() {
        let heroAtt = HeroUtils.getHeroAttrById(this.heroInfo.heroId);
        if (heroAtt) {
            gdk.panel.open(PanelId.RoleEliteAttTips, (node: cc.Node) => {
                let comp = node.getComponent(RoleEliteAttTipsCtrl);
                if (comp) {
                    comp.showEliteAttr(heroAtt);
                }
            });
        }
    }

    // onAddExpClick() {
    //     let msg = new HeroLevelupReq()
    //     msg.heroId = this.heroInfo.heroId
    //     NetManager.send(msg)
    // }

    _showHeroUpEffectFunc() {
        let curTime = GlobalUtil.getServerTime()
        if (curTime - this.model.lastUpgradeTime > 1000) {
            this.model.lastUpgradeTime = curTime
            this.upgradeEffect.node.active = true
            this.upgradeEffect.setAnimation(0, "stand", false)
            this.upgradeEffect.setCompleteListener(() => {
                this.upgradeEffect.node.active = false
            })
        }
        this.upgradeEffect2.node.active = true
        this.upgradeEffect2.setAnimation(0, "stand", false)
        this.upgradeEffect2.setCompleteListener(() => {
            this.upgradeEffect2.node.active = false
        })
    }

    openCareerFunc() {
        let node = gdk.panel.get(PanelId.RoleView2)
        if (node) {
            let ctrl = node.getComponent(RoleViewCtrl2)
            ctrl.selectFunc(null, 2)
        }
    }

    openCareerTipFunc() {
        let cfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.heroInfo.careerId, null)
        GlobalUtil.openCareerTip(this.solIcon.node, cfg.career_type)
    }

    //打开拦截数量提示
    openhateNumTipFunc() {
        let cfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.heroInfo.careerId, null)
        let str = gdk.i18n.t("i18n:HERO_TIP27") + cfg.hate_num
        let panel = gdk.panel.get(PanelId.CareerTip)
        if (panel) {
            let comp = panel.getComponent(CareerTipCtrl)
            comp.showTip(this.hateIcon, 0)
            comp.tips.string = str
        } else {
            gdk.panel.open(PanelId.CareerTip, (node: cc.Node) => {
                let comp = node.getComponent(CareerTipCtrl)
                comp.showTip(this.hateIcon, 0)
                comp.tips.string = str
            })
        }
    }
}
