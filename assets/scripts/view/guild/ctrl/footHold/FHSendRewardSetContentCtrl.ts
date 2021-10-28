import FHSendRewardSetItem from './FHSendRewardSetItem';
import FootHoldModel, { FhSendRewardInfo } from './FootHoldModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-11 19:18:09
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHSendRewardSetContentCtrl")
export default class FHSendRewardSetContentCtrl extends cc.Component {

    @property(cc.Node)
    typeIcon: cc.Node = null;

    @property(cc.Node)
    rewardContent: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    _iconArr = ["kfjdz_zhenxi", "kfjdz_jiping", "kfjdz_haohua"]

    onEnable() {

    }

    updateTypeIcon(type) {
        GlobalUtil.setSpriteIcon(this.node, this.typeIcon, `view/guild/texture/footHold/cross/${this._iconArr[type - 1]}`)
    }

    updateViewInfo(goods: FhSendRewardInfo[]) {
        this.rewardContent.removeAllChildren()
        for (let i = 0; i < goods.length; i++) {
            let item = cc.instantiate(this.rewardItem)
            this.rewardContent.addChild(item)
            let ctrl = item.getComponent(FHSendRewardSetItem)
            ctrl.updateViewInfo(goods[i])
        }
    }
}