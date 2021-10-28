import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Luckydraw_optionalCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-22 15:27:55 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/catcher/AdvCatecherSelectItemCtrl")
export default class AdvCatecherSelectItemCtrl extends cc.Component {
    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Node)
    mask: cc.Node = null;

    cfg: Luckydraw_optionalCfg;
    select: boolean;
    onEnable() {
        if (this.cfg) {
            this.updateView(this.cfg, this.select);
        }
    }

    updateView(c: Luckydraw_optionalCfg, select: boolean) {
        this.cfg = c;
        this.select = select;
        this.slot.updateItemInfo(c.reward[0], 1);
        this.mask.active = this.select;
    }

    unCheck() {
        this.select = false;
        this.mask.active = false;
    }

    check() {
        this.select = true;
        this.mask.active = true;
    }
}
