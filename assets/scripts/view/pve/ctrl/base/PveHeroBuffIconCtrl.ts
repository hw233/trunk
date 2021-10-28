import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import { CommonCfg, Skill_buffCfg } from '../../../../a/config';

/** 
 * Pve英雄BUFF小图标
 * @Author: sthoo.huang  
 * @Date: 2019-05-24 16:16:35 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-12-27 09:53:33
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/base/PveHeroBuffIconCtrl")
export default class PveHeroBuffIconCtrl extends gdk.ItemRenderer {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    num: cc.Label = null;

    url: string;

    updateView() {
        let config: Skill_buffCfg = this.data.config;
        let url: string = ConfigManager.getItemById(CommonCfg, 'BUFF_ICON').value + config.icon;

        if (this.url != url) {
            this.url = url;
            GlobalUtil.setSpriteIcon(this.node, this.icon, this.url);
        }
        let stack = this.data.stack;
        this.num.string = stack > 1 ? stack + '' : '';

    }

    onDisable() {
        this.url = null;
        GlobalUtil.setSpriteIcon(this.node, this.icon, this.url);
        super.onDisable && super.onDisable();
    }
}