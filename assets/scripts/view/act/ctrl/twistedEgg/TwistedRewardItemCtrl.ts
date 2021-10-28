import BagUtils from '../../../../common/utils/BagUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { HeroCfg, Operation_wishCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/twistedEgg/TwistedRewardItemCtrl")
export default class TwistedRewardItemCtrl extends UiListItem {
    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Node)
    selected: cc.Node = null;

    cfg: Operation_wishCfg;
    updateView() {
        this.cfg = this.data;
        let itemId = parseInt(this.cfg.hero.toString().slice(0, 6));
        let star = parseInt(this.cfg.hero.toString().slice(6));
        let heroCfg: HeroCfg = <HeroCfg>BagUtils.getConfigById(itemId);
        this.slot.starNum = star;
        this.slot.group = heroCfg.group[0];
        this.slot.updateItemInfo(itemId);
        this.nameLab.string = heroCfg.name;
        this.selected.active = this.list['selectIdx'] == this.cfg.hero;
    }
}
