import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PveSceneCtrl from '../PveSceneCtrl';
import PveSceneModel from '../../model/PveSceneModel';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { HeroCfg, OrdealCfg } from '../../../../a/config';

/**
 * 英雄试炼推荐英雄展示界面
 * @Author: yaozu.hu
 * @Date: 2020-10-22 20:52:33
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-10-23 10:04:58
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/HeroTrialHeroListCtrl")
export default class HeroTrialHeroListCtrl extends cc.Component {

    @property(cc.Node)
    layoutNode: cc.Node = null;

    @property(cc.Prefab)
    heroItemPre: cc.Prefab = null;

    @property(PveSceneCtrl)
    sceneCtrl: PveSceneCtrl = null;

    model: PveSceneModel;
    cfgHeroId: number[] = [];
    onEnable() {
        this.model = this.sceneCtrl.model;
        this.model.heros
        let ordealCfg = ConfigManager.getItemByField(OrdealCfg, 'round', this.sceneCtrl.model.stageConfig.id);
        if (!ordealCfg) {
            this.node.active = false;
            return;
        }
        let strs = ordealCfg.theme_hero.split('|');
        for (let i = 0; i < strs.length; i++) {
            let heroId = Number(strs[i].split(';')[0]);
            let node = cc.instantiate(this.heroItemPre);
            node.setParent(this.layoutNode);
            let solt = node.getChildByName('UiSlotItem').getComponent(UiSlotItem);
            solt.previewNode.getComponent(cc.Button).enabled = false;
            solt.node.off(cc.Node.EventType.TOUCH_END, solt._listItemClick, solt);
            let group = node.getChildByName('group');
            let cfg: HeroCfg = ConfigManager.getItemById(HeroCfg, heroId);
            let icon: string = `icon/hero/${cfg.icon}_s`;
            solt.updateItemIcon(icon);
            solt.updateQuality(cfg.defaultColor);
            let path = `common/texture/role/select/group_${cfg.group[0]}`
            GlobalUtil.setSpriteIcon(this.node, group, path);
            this.cfgHeroId.push(heroId);
        }


    }

    @gdk.binding('sceneCtrl.model.heros')
    refreshHeroState() {
        for (let i = 0; i < this.cfgHeroId.length; i++) {
            let heroId = this.cfgHeroId[i];
            let state: 0 | 1 = 1;
            for (let j = 0; j < this.model.heros.length; j++) {
                let hero = this.model.heros[j]
                if (heroId == hero.model.config.id) {
                    state = 0;
                    break;
                }
            }
            GlobalUtil.setAllNodeGray(this.layoutNode.children[i], state);
        }
    }


    onDisable() {
        this.layoutNode.removeAllChildren()
        this.cfgHeroId = []
    }



}
