import GlobalUtil from '../../../common/utils/GlobalUtil';
import PanelId from '../../../configs/ids/PanelId';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { STORE_ICON_PATH } from '../model/StoreModel';
import { Store_monthcardCfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/StoreMonthCardItemCtrl")
export default class StoreMonthCardItemCtrl extends UiListItem {

    //特权卡Icon
    @property(cc.Sprite)
    monthIcon: cc.Sprite = null

    @property(cc.Label)
    nameLabel: cc.Label = null

    //特权卡价格
    @property(cc.Label)
    costNum: cc.Label = null


    onload() {

    }

    updateView() {
        let cfg: Store_monthcardCfg = this.data.cfg;

        this.nameLabel.string = cfg.name;
        this.costNum.string = StringUtils.format(gdk.i18n.t("i18n:ACT_STORE_TIP1"), cfg.RMB_cost)

        let icon = `${STORE_ICON_PATH}/${cfg.icon}`;
        GlobalUtil.setSpriteIcon(this.node, this.monthIcon, icon);
    }

    _itemClick() {
        let ids: number[] = [500001, 500002, 500003];
        let cfg: Store_monthcardCfg = this.data.cfg;
        gdk.panel.setArgs(PanelId.MonthCard, ids.indexOf(cfg.id));
        gdk.panel.open(PanelId.MonthCard);
    }
}
