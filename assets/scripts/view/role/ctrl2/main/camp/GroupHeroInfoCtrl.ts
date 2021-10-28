import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import PanelId from '../../../../../configs/ids/PanelId';
import { BagType } from '../../../../../common/models/BagModel';
import { HeroCfg } from '../../../../../a/config';


/** 
 * @Description: 阵营-英雄详情
 * @Author: yaozu.hu  
 * @Date: 2019-09-16 10:19:03 
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-08-21 17:21:04
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role/GroupHeroInfoCtrl")
export default class GroupHeroInfoCtrl extends gdk.BasePanel {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Sprite)
    qualityBg: cc.Sprite = null;

    @property(cc.Sprite)
    qualityFrame: cc.Sprite = null;

    @property(cc.Label)
    heroName: cc.Label = null;
    @property(cc.Label)
    heroDec: cc.Label = null;

    quality: number = 0
    curHeroId: number = 0;  //当前选择的英雄
    heroCfg: HeroCfg;
    curGroupId: number = 0;

    start() {
        let data = gdk.panel.getArgs(PanelId.GroupHeroInfo)
        this.heroCfg = data[0]
        this.curHeroId = data[1]
        this.curGroupId = data[2]

        let icon = GlobalUtil.getIconById(this.heroCfg.id, BagType.HERO)
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon)

        this.heroName.string = this.heroCfg.name
        this.heroDec.string = this.heroCfg.desc
        //更新品质
        this._updateQuality()
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
