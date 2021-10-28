import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PanelId from '../../../../configs/ids/PanelId';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Tech_stoneCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-09-01 10:38:38 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-01 11:09:00
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/energize/BYEStoneSkillBookItemCtrl")
export default class BYEStoneSkillBookItemCtrl extends UiListItem {
    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    // @property(cc.Node)
    // quality: cc.Node = null;

    cfg: Tech_stoneCfg;
    updateView() {
        this.cfg = this.data;
        this.slot.updateItemInfo(this.cfg.id);
        this.nameLab.string = GlobalUtil.getSkillCfg(this.cfg.unique[0]).name;
        let colorInfo = BagUtils.getColorInfo(this.cfg.color);
        this.nameLab.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.nameLab.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline);
        // this.quality.active = false;
    }

    onClick() {
        let worldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        gdk.panel.setArgs(PanelId.BYEStoneSkillDetailView, this.cfg);
        gdk.panel.open(PanelId.BYEStoneSkillDetailView, (node: cc.Node) => {
            // let ctrl = node.getComponent(BYEStoneSkillDetailViewCtrl);
            // ctrl.updateView(this.cfg);
            node.setPosition(node.parent.convertToNodeSpaceAR(worldPos));
            if (node.x + node.getChildByName('zb_dikuan').width >= cc.view.getVisibleSize().width / 2) {
                node.x = cc.view.getVisibleSize().width / 2 - node.getChildByName('zb_dikuan').width;
            }
        })
    }
}
