import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import LuckyTwistEggUiSlotItemCtrl from './LuckyTwistEggUiSlotItemCtrl';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Twist_eggCfg } from '../../../../a/config';


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/luckyTwist/LuckyTwistEggRewardItemCtrl")
export default class LuckyTwistEggRewardItemCtrl extends UiListItem {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    title: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    info: {
        lv: number,
        cfgs: Twist_eggCfg[]
    };
    updateView() {
        this.info = this.data;
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/act/texture/twistedEgg/xynd_qiu0${this.info.lv}`)
        GlobalUtil.setSpriteIcon(this.node, this.title, `view/act/texture/twistedEgg/xynd_lv0${this.info.lv}`)
        this._updateItemState();
    }

    _updateItemState() {
        let cfgs = this.info.cfgs;
        cfgs.sort((a, b) => { return a.number - b.number; });
        this.content.removeAllChildren();
        cfgs.forEach(cfg => {
            let slot = cc.instantiate(this.slotPrefab);
            slot.parent = this.content;
            let ctrl = slot.getComponent(LuckyTwistEggUiSlotItemCtrl);
            ctrl.updateState(cfg);
        });
    }
}
