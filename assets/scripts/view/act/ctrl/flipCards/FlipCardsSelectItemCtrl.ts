import ActivityModel from '../../model/ActivityModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Operation_bestCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-21 14:58:58 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/flipCards/FlipCardsSelectItemCtrl")
export default class FlipCardsSelectItemCtrl extends UiListItem {
    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Label)
    tipsLab: cc.Label = null;

    @property(cc.Node)
    selected: cc.Node = null;

    @property(cc.Node)
    hadFlag: cc.Node = null;

    cfg: Operation_bestCfg;
    select: boolean;
    updateView() {
        this.cfg = this.data.cfg;
        this.select = this.data.select;
        this.slot.updateItemInfo(this.cfg.award[0], this.cfg.award[1]);
        this._updateState();
        this.selected.active = this.list['selectIdx'] == this.cfg.id;
        this.itemSelect(this.select);
    }

    _updateState() {
        let model = ModelManager.get(ActivityModel);
        let turnId = model.flipCardTurnNum;
        let spRewardIds = model.filpCardSpReward;
        this.mask.active = false;
        this.hadFlag.active = false;
        GlobalUtil.setAllNodeGray(this.slot.node, 0);
        if (this.cfg.turn > turnId) {
            this.mask.active = true;
            let s = gdk.i18n.t("i18n:ACT_FLIPCARD_TIP4");
            this.tipsLab.string = StringUtils.format(s, this.cfg.turn);
            return;
        }

        let len = 0;
        spRewardIds.forEach((id, idx) => {
            if (id == this.cfg.id && idx + 1 !== turnId) len += 1;
            if (idx + 1 === turnId && model.flipCardRecived) len += 1;
        });
        // let idx = spRewardIds.indexOf(this.cfg.id);
        this.tipsLab.string = `${this.cfg.limit - len}/${this.cfg.limit}`;
        if (len == this.cfg.limit || model.flipCardRecived) {
            GlobalUtil.setAllNodeGray(this.slot.node, 1);
            this.hadFlag.active = true;
            this.tipsLab.string = '0/1';
        }
    }
}
