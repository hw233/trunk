import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import {
    Hero_careerCfg,
    Hero_starCfg,
    HeroCfg,
    Peak_globalCfg,
    Peak_pool_groupCfg
    } from '../../../../a/config';

/** 
 * @Description: 英雄选择面板-heroItem
 * @Author:yaozu.hu  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-11 11:10:37
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakSelectHeroItemCtrl")
export default class PeakSelectHeroItemCtrl extends UiListItem {


    @property(cc.Node)
    selectNode: cc.Node = null
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Node)
    groupIcon: cc.Node = null;

    @property(cc.Sprite)
    colorBg: cc.Sprite = null;
    @property(cc.Button)
    clickBtn: cc.Button = null;

    poolCfg: Peak_pool_groupCfg;
    heroCfg: HeroCfg = null

    isGray: 0 | 1 = 0;
    curType: number = 0;
    updateView() {

        this.poolCfg = this.data.cfg;
        this.curType = this.data.curType
        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.poolCfg.item_id);
        this.isGray = this.data.isGray;
        //this.clickBtn.interactable = this.isGray == 0
        let icon = `icon/hero/${this.heroCfg.icon}`;
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon);
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `common/texture/role/select/group_${this.heroCfg.group[0]}`);

        let temCareerCfg = ConfigManager.getItemByField(Hero_careerCfg, 'hero_id', this.poolCfg.item_id, { 'line': 0 })
        let type = this.poolCfg.career_id > 0 ? this.poolCfg.career_id : temCareerCfg.career_type//Math.floor(this.heroInfo.soldierId / 100);
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${type}`);
        let star = ConfigManager.getItemByField(Peak_globalCfg, 'key', 'star_level').value[0]
        let starCfg = ConfigManager.getItemByField(Hero_starCfg, 'star', star);
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, `common/texture/role/select/quality_bg_0${starCfg.color}`);

        GlobalUtil.setAllNodeGray(this.node, this.isGray);

    }
    _itemSelect() {
        if (this.curType == 2 && this.isGray == 0) {
            this.selectNode.active = this.ifSelect;
        }
        //this.selectNode.active = this.ifSelect//this.data.isSelect;
    }

    _itemClick() {

    }
}
