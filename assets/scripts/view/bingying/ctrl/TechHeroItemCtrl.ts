import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import { BagType } from '../../../common/models/BagModel';
import { HeroCfg } from '../../../a/config';

/** 
 * @Description: 阵营-英雄列表Item
 * @Author: yaozu.hu  
 * @Date: 2019-09-16 10:19:03 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-04-18 11:27:38
 */



const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/bingying/TechHeroItemCtrl")
export default class TechHeroItemCtrl extends UiListItem {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Sprite)
    qualityFrame: cc.Sprite = null

    @property(cc.Sprite)
    qualityBg: cc.Sprite = null;

    heroCfg: HeroCfg;

    updateView() {
        this.heroCfg = ConfigManager.getItemById(HeroCfg, this.data)
        if (this.heroCfg) {
            let icon = GlobalUtil.getIconById(this.heroCfg.id, BagType.HERO)
            GlobalUtil.setSpriteIcon(this.node, this.icon, icon)
            this._updateQuality()
        }

    }

    /**更新品质显示 */
    _updateQuality() {
        this.qualityBg.node.active = true;
        this.qualityFrame.node.active = true;
        let path1 = `view/role/texture/up/qualityBg0${this.heroCfg.defaultColor}`
        let path2 = `view/role/texture/up/qualityFrame0${this.heroCfg.defaultColor}`
        GlobalUtil.setSpriteIcon(this.node, this.qualityBg, path1)
        GlobalUtil.setSpriteIcon(this.node, this.qualityFrame, path2)
    }
}
