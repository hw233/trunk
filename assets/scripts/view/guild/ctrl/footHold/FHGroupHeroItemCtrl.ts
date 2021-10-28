import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import { BagType } from '../../../../common/models/BagModel';
import { HeroCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-07-24 17:41:06
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/guild/footHold/FHGroupHeroItemCtrl")
export default class FHGroupHeroItemCtrl extends UiListItem {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Sprite)
    qualityFrame: cc.Sprite = null

    @property(cc.Sprite)
    qualityBg: cc.Sprite = null;

    @property(cc.Node)
    chaojue: cc.Node = null;

    quality: number = 0
    heroCfg: HeroCfg;
    curGroupId: number = 0;

    updateView() {

        this.heroCfg = this.data.cfg
        let icon = GlobalUtil.getIconById(this.heroCfg.id, BagType.HERO)
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon)

        //更新品质
        this._updateQuality()
        // //更新超绝
        // if (this.heroCfg.ace && this.heroCfg.ace.length > 0) {
        //     if (this.heroCfg.ace.indexOf(this.curGroupId) > -1) {
        //         this.chaojue.active = true;
        //     } else {
        //         this.chaojue.active = false;
        //     }
        // } else {
        //     this.chaojue.active = false;
        // }
        //判断是否拥有该英雄,未拥有则变灰色
        let heroInfo = HeroUtils.getHeroInfoById(this.heroCfg.id)
        if (heroInfo == null) {
            //this.gray.enabled = true;
            GlobalUtil.setGrayState(this.icon, 1)

        } else {
            GlobalUtil.setGrayState(this.icon, 0)
        }
    }

    /**更新品质显示 */
    _updateQuality() {
        //let cfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId)
        if (!this.heroCfg) {
            this.qualityBg.node.active = false;
            this.qualityFrame.node.active = false;
        } else if (this.quality != this.heroCfg.defaultColor) {
            this.qualityBg.node.active = true;
            this.qualityFrame.node.active = true;
            let path1 = `view/role/texture/up/qualityBg0${this.heroCfg.defaultColor}`
            let path2 = `view/role/texture/up/qualityFrame0${this.heroCfg.defaultColor}`
            GlobalUtil.setSpriteIcon(this.node, this.qualityBg, path1)
            GlobalUtil.setSpriteIcon(this.node, this.qualityFrame, path2)
            this.quality = this.heroCfg.defaultColor
        }
    }
}
