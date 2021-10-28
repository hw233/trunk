import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import PanelId from '../../../../../configs/ids/PanelId';
import UiListItem from '../../../../../common/widgets/UiListItem';
import { BagType } from '../../../../../common/models/BagModel';
import { HeroCfg } from '../../../../../a/config';

/** 
 * @Description: 阵营-英雄列表Item
 * @Author: yaozu.hu  
 * @Date: 2019-09-16 10:19:03 
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-08-27 11:58:31
 */


const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/role/GroupHeroItemCtrl")
export default class GroupHeroItemCtrl extends UiListItem {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Sprite)
    qualityFrame: cc.Sprite = null

    @property(cc.Sprite)
    qualityBg: cc.Sprite = null;

    @property(cc.Node)
    select: cc.Node = null;

    quality: number = 0
    curHeroId: number = 0;  //当前选择的英雄
    heroCfg: HeroCfg;
    curGroupId: number = 0;

    updateView() {

        this.heroCfg = this.data.cfg
        this.curHeroId = this.data.curHeroId
        this.curGroupId = this.data.curGroupId
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
        //更新选中框
        if (this.curHeroId == this.heroCfg.id) {
            this.select.active = true;
        } else {
            this.select.active = false;
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

    _listItemClick() {
        gdk.panel.setArgs(PanelId.GroupHeroInfo, this.heroCfg, this.curHeroId, this.curHeroId, this.curGroupId)
        gdk.panel.open(PanelId.GroupHeroInfo)
    }
}
