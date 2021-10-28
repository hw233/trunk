import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroDetailViewCtrl from '../../lottery/ctrl/HeroDetailViewCtrl';
import HeroUtils from '../../../common/utils/HeroUtils';
import PanelId from '../../../configs/ids/PanelId';
import UiListItem from '../../../common/widgets/UiListItem';
import { Hero_careerCfg, HeroCfg } from '../../../a/config';
import { SelectGiftInfo } from './SelectGiftViewCtrl';

/** 
  * @Description: 恭喜获得道具子项
  * @Author: luoyong 
  * @Date: 2019-09-12 14:24:36
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-06-15 20:27:33
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/SelectHeroItemCtrl")
export default class SelectHeroItemCtrl extends UiListItem {


    @property(cc.Node)
    selectIcon: cc.Node = null

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Sprite)
    careerIcon: cc.Sprite = null

    @property(cc.Sprite)
    colorBg: cc.Sprite = null

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Node)
    getFlag: cc.Node = null

    _itemData: SelectGiftInfo
    _heroCfg: HeroCfg

    start() {

    }

    updateView() {
        this._itemData = this.data
        this._heroCfg = ConfigManager.getItemById(HeroCfg, this._itemData.itemId)
        this.nameLab.string = this._heroCfg.name
        let outline = this.nameLab.getComponent(cc.LabelOutline)
        outline.color = BagUtils.getOutlineColor(this._heroCfg.defaultColor)
        this.getFlag.active = !!HeroUtils.getHeroInfoById(this._heroCfg.id)
        this._updateQuality()
        this._updateSoldierIcon()
    }


    /**更新品质显示 */
    _updateQuality() {
        let icon = `icon/hero/${this._heroCfg.icon}`;
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon);

        let path = `common/texture/juese_txbg03_0${this._heroCfg.defaultColor}`;
        GlobalUtil.setSpriteIcon(this.node, this.colorBg, path);
    }

    /**更新士兵图标 */
    _updateSoldierIcon() {
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this._heroCfg.career_id)
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, GlobalUtil.getSoldierTypeIcon(careerCfg.career_type));
    }

    _itemSelect() {
        this.selectIcon.active = this.ifSelect
    }

    viewHeroFunc() {
        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let comp = node.getComponent(HeroDetailViewCtrl)
            comp.initHeroInfo(this._heroCfg)

        })
    }
}
