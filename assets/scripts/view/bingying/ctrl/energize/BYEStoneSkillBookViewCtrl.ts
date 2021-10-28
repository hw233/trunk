import ConfigManager from '../../../../common/managers/ConfigManager';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Tech_stoneCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-09-01 10:38:13 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-01 10:50:32
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/energize/BYEStoneSkillBookViewCtrl")
export default class BYEStoneSkillBookViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    skillPrefab: cc.Prefab = null;

    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;

    curSelectType: number;
    list: ListView;
    onEnable() {
        let idx = this.args[0];
        if (!idx) idx = 0;
        this.uiTabMenu.setSelectIdx(idx, true)
    }

    onDisable() {
        this.curSelectType = null;
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    selectFunc(e: any, utype: any) {
        if (!e) return;
        if (this.curSelectType && this.curSelectType == utype) return;
        this.curSelectType = utype;
        this._updateList();
    }

    onHelpBtnClick() {
        // let node = this.node.getChildByName('ts_tishibg');
        // let worldPos = node.parent.convertToWorldSpaceAR(node.position);
        // gdk.panel.open(PanelId.RunSkillHelp, (node: cc.Node) => {
        //     node.setPosition(node.parent.convertToNodeSpaceAR(worldPos));
        //     node.y -= 20;
        // });
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.skillPrefab,
                cb_host: this,
                column: 4,
                async: true,
                gap_y: 10,
                gap_x: 36,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList() {
        this._initList();
        let cfgs = ConfigManager.getItems(Tech_stoneCfg, (cfg: Tech_stoneCfg) => {
            if (cfg.color == this.curSelectType + 1) {
                return true;
            }
        });
        this.list.clear_items();
        this.list.set_data(cfgs);
    }
}
