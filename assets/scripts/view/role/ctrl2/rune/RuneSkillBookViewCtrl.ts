import ConfigManager from '../../../../common/managers/ConfigManager';
import PanelId from '../../../../configs/ids/PanelId';
import RuneSkillBookHItemCtrl from './RuneSkillBookHItemCtrl';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { Rune_showCfg, RuneCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-10 10:37:31 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneSkillBookViewCtrl")
export default class RuneSkillBookViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    bookHItem: cc.Prefab = null;

    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;

    curSelectType: number;
    cfgs: { [genre: number]: { [page: number]: RuneCfg[] } } = {};
    onEnable() {
        this._initCfgs();
        let idx = this.args[0];
        if (!idx) idx = 0;
        this.uiTabMenu.setSelectIdx(idx, true)
    }

    onDisable() {
        this.curSelectType = null;
    }

    selectFunc(e: any, utype: any) {
        if (!e) return;
        if (this.curSelectType && this.curSelectType == utype) return;
        this.curSelectType = utype;
        this._updateList();
    }

    onHelpBtnClick() {
        let node = this.node.getChildByName('ts_tishibg');
        let worldPos = node.parent.convertToWorldSpaceAR(node.position);
        gdk.panel.open(PanelId.RunSkillHelp, (node: cc.Node) => {
            node.setPosition(node.parent.convertToNodeSpaceAR(worldPos));
            node.y -= 20;
        });
    }

    _initCfgs() {
        let showCfgs = ConfigManager.getItems(Rune_showCfg);
        let keys = ['page1', 'page2', 'page3', 'page4', 'page5'];
        showCfgs.forEach(c => {
            if (!this.cfgs[c.genre]) this.cfgs[c.genre] = {};
            keys.forEach((key, idx) => {
                if (!this.cfgs[c.genre][idx]) this.cfgs[c.genre][idx] = [];
                this.cfgs[c.genre][idx].push(ConfigManager.getItemById(RuneCfg, c[key]));
            });
        });
    }

    _updateList() {
        this.content.removeAllChildren();
        for (let i = 0; i < 4; i++) {
            let runeCfgs = this.cfgs[i + 1][this.curSelectType];
            let n = cc.instantiate(this.bookHItem);
            n.parent = this.content;
            let ctrl = n.getComponent(RuneSkillBookHItemCtrl);
            ctrl.updateView(i + 1, runeCfgs);
            let row = Math.floor(runeCfgs.length / 4) + (runeCfgs.length % 4 > 0 ? 1 : 0);
            n.height = 60 + 5 + 35 + row * (130 + 20) - 20;
        };
    }
}
