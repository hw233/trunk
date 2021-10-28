import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Foothold_globalCfg, TipsCfg } from '../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-19 21:03:49
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cross/FHCrossTipCtrl")
export default class FHCrossTipCtrl extends gdk.BasePanel {

    @property(cc.Node)
    descContent: cc.Node = null;

    @property(cc.Node)
    descItem: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null;


    onEnable() {
        let tipCfg = ConfigManager.getItemById(TipsCfg, 86)
        let datas = (tipCfg.desc21 as String).split("\n")
        for (let i = 0; i < datas.length; i++) {
            let item = cc.instantiate(this.descItem)
            item.active = true
            this.descContent.addChild(item)
            item.getComponent(cc.RichText).string = `${datas[i]}`
        }
        this._updateReward()
    }

    _updateReward() {
        let ids = ConfigManager.getItemById(Foothold_globalCfg, "cross_rewards_show").value
        this.content.removeAllChildren();
        if (ids.length > 5) this.scrollView.horizontal = true;
        else this.scrollView.horizontal = false;
        ids.forEach(id => {
            let item = cc.instantiate(this.rewardItem);
            this.content.addChild(item);
            let ctrl = item.getComponent(UiSlotItem);
            ctrl.isEffect = true;
            ctrl.updateItemInfo(id);
            ctrl.itemInfo = {
                itemId: id,
                series: 0,
                type: BagUtils.getItemTypeById(id),
                itemNum: 1,
                extInfo: null,
            };
        });
        this.content.getComponent(cc.Layout).updateLayout();
    }
}