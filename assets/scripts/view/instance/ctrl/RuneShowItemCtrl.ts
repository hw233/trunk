import ConfigManager from '../../../common/managers/ConfigManager';
import InstanceModel from '../model/InstanceModel';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Copy_stageCfg, RuneunlockCfg } from '../../../a/config';

/**
 * @Description: 符文副本符文展示列表子项
 * @Author: yaozu.hu
 * @Date: 2020-09-22 15:53:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-15 15:30:16
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/instance/RuneShowItemCtrl")
export default class RuneShowItemCtrl extends UiListItem {

    @property(UiSlotItem)
    solt: UiSlotItem = null;
    @property(cc.Node)
    lock: cc.Node = null;
    @property(cc.Label)
    lockLb: cc.Label = null;

    private info: { cfg: RuneunlockCfg, lock: boolean }
    get model() { return ModelManager.get(InstanceModel); }

    updateView() {
        this.info = this.data;
        this.solt.updateItemInfo(this.info.cfg.rune_id);
        this.lock.active = this.info.lock;
        if (this.info.lock) {
            let temCfg = ConfigManager.getItemById(Copy_stageCfg, this.info.cfg.star)
            this.lockLb.string = StringUtils.format(gdk.i18n.t("i18n:CHAMPION_EXITEM_TIP1"), temCfg.name)//temCfg.name + '解锁'
        }
    }

    _itemClick() {
        //打开符文展示界面
        //cc.log('--------打开符文展示界面-----------')
        gdk.panel.open(PanelId.SubInstanceRuneShowView);
    }
}
