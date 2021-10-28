import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleHeroItemCtrl2 from '../selector/RoleHeroItemCtrl2';
import RoleModel from '../../../../common/models/RoleModel';
import UpgradeCostItemCtrl2 from '../main/career/UpgradeCostItemCtrl2';
import { Copy_towerlistCfg, Hero_careerCfg, Hero_lvCfg } from '../../../../a/config';


/** 
 * @Description: 英雄快捷升级
 * @Author:yaozu.hu  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-25 10:15:58
 */

const { ccclass, property, menu } = cc._decorator;


@ccclass
@menu("qszc/view/role2/common/RoleHeroUpgradeView")
export default class RoleHeroUpgradeView extends gdk.BasePanel {

    @property([cc.Node])
    upHero1List: cc.Node[] = [];

    @property(cc.Label)
    upHeroPower: cc.Label = null;
    @property(cc.Label)
    roleExp: cc.Label = null;

    get model(): HeroModel { return ModelManager.get(HeroModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        let node = this.upHero1List[0];
        for (let i = this.upHero1List.length; i < 6; i++) {
            let item = this.upHero1List[i] = cc.instantiate(node);
            item.parent = node.parent;
        }
        this.refreshTopInfo();
    }

    onDisable() {

    }

    @gdk.binding('roleModel.heroExp')
    _setExp(v: number) {
        this.roleExp.string = GlobalUtil.numberToStr(v, true);
    }

    refreshTopInfo() {
        let copyModel = ModelManager.get(CopyModel);
        let tems = ConfigManager.getItems(Copy_towerlistCfg, (item: Copy_towerlistCfg) => {
            if (item.general_lv <= copyModel.lastCompleteStageId) {
                return true;
            }
            return false;
        });
        let copyCfg = tems[tems.length - 1];
        let selectHeros = this.model.PveUpHeroList;
        let selectHeroInfos = this.model.pveSetupHero;
        let list = this.upHero1List;
        let power = 0;
        for (let i = 0; i < list.length; i++) {
            let heroItem = list[i];

            let add = heroItem.getChildByName('add');
            let roleHeroItem = heroItem.getChildByName('RoleHeroItem');
            let lock = heroItem.getChildByName('lock');

            let expNode = heroItem.getChildByName('expNode');
            let expBtn = expNode.getChildByName('ExpBtn');
            let expLayout = expNode.getChildByName('expLayout');
            let upgradeCostItems = expLayout.children;
            let upgradeTip = expNode.getChildByName('upgradeTip');

            expNode.active = false;
            add.active = false;
            roleHeroItem.active = false;
            lock.active = false;

            if (i < copyCfg.num) {

                let hero = selectHeroInfos[i];
                if (hero == null) {
                    add.active = true;
                } else {

                    let heroInfo = hero.extInfo as icmsg.HeroInfo;

                    // 英雄图标
                    roleHeroItem.active = true;
                    let ctrl = roleHeroItem.getComponent(RoleHeroItemCtrl2);
                    if (ctrl) {
                        ctrl.data = { data: hero, heros: selectHeros };
                        ctrl.updateView();
                    }
                    power += heroInfo.power;

                    // 升级按钮
                    expNode.active = true;
                    let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", heroInfo.careerId, { career_lv: heroInfo.careerLv });
                    let heroLvCfg = ConfigManager.getItemById(Hero_lvCfg, heroInfo.level)
                    if (heroLvCfg &&
                        heroLvCfg.clv <= heroInfo.careerLv &&
                        careerCfg &&
                        heroInfo.level < careerCfg.hero_lv) {
                        // 满足升级条件
                        expBtn.active = true;
                        expLayout.active = true;
                        upgradeTip.active = false;
                        // 升级消耗
                        let cfgs = ConfigManager.getItems(Hero_lvCfg);
                        let costItems = cfgs[heroInfo.level - 1].cost;
                        for (let i = 0; i < upgradeCostItems.length; i++) {
                            if (costItems[i]) {
                                upgradeCostItems[i].active = true;
                                let ctrl = upgradeCostItems[i].getComponent(UpgradeCostItemCtrl2);
                                ctrl.updateItemInfo(costItems[i][0], costItems[i][1]);
                            } else {
                                upgradeCostItems[i].active = false;
                            }
                        }
                        expBtn.once(cc.Node.EventType.TOUCH_END, () => {
                            // 发送升级消息
                            let msg = new icmsg.HeroLevelupReq();
                            msg.heroId = heroInfo.heroId;
                            msg.addLv = 1;
                            NetManager.send(msg, () => {
                                if (!cc.isValid(this.node)) return;
                                if (!this.node.activeInHierarchy) return;
                                this.refreshTopInfo();
                            });
                        }, this);
                    } else {
                        // 已达到最高级
                        expBtn.active = false;
                        expLayout.active = false;
                        upgradeTip.active = true;
                        expBtn.targetOff(this);
                    }
                }
            } else {
                let tem = ConfigManager.getItem(Copy_towerlistCfg, (item: Copy_towerlistCfg) => {
                    if (i < item.num) {
                        return true;
                    }
                    return false;
                });
                if (tem) {
                    let num = lock.getChildByName('openLabel').getComponent(cc.Label);
                    num.string = tem.general_lv + gdk.i18n.t("i18n:HERO_TIP1");
                }
                lock.active = true;
            }
        }
        this.upHeroPower.string = power + '';
    }
}
