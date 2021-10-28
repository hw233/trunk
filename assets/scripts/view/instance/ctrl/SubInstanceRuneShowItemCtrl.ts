import BagUtils from '../../../common/utils/BagUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { RuneunlockCfg } from '../../../a/config';

/**
 * @Description:符文副本列表子项
 * @Author: yaozu.hu
 * @Date: 2020-09-22 15:53:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-10-14 15:37:49
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/instance/SubInstanceRuneItemCtrl")
export default class SubInstanceRuneShowItemCtrl extends UiListItem {

    @property(cc.Label)
    nameLb: cc.Label = null;

    @property(cc.Node)
    layoutNode: cc.Node = null;

    @property(cc.Prefab)
    runeItem: cc.Prefab = null;

    private info: { cfgs: RuneunlockCfg[], lock: boolean }

    updateView() {
        this.info = this.data;
        this.nameLb.string = this.info.cfgs[0].difficulty//ConfigManager.getItemById(Copy_stageCfg, this.info.cfgs[0].star).name;
        this.layoutNode.removeAllChildren();
        this.info.cfgs.forEach(cfg => {
            let node = cc.instantiate(this.runeItem);
            let solt = node.getChildByName('UiSlotItem').getComponent(UiSlotItem);
            let temName = node.getChildByName('name').getComponent(cc.Label)
            let lock = node.getChildByName('lock');
            solt.updateItemInfo(cfg.rune_id);
            solt.itemInfo = {
                series: cfg.rune_id,
                itemId: cfg.rune_id,
                itemNum: 1,
                type: BagUtils.getItemTypeById(cfg.rune_id),
                extInfo: null,
            }
            temName.string = cfg.rune_name;
            lock.active = this.info.lock;
            node.setParent(this.layoutNode);
        })
    }


}
