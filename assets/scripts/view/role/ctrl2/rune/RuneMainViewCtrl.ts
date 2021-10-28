import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import PanelId from '../../../../configs/ids/PanelId';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-01 14:33:21 
  */
export enum RuneFuncType {
    Strengthen, //强化
    Merge,  //合成
    Mix,    //融合
    Clear   //洗练
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneMainViewCtrl")
export default class RuneMainViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    panelContent: cc.Node = null;

    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;

    curFuncType: RuneFuncType;
    funcConfig = [
        { type: RuneFuncType.Strengthen, title: gdk.i18n.t('i18n:RUNE_TIP25'), panelId: PanelId.RuneStrengthenPanel, sysId: 2879 },
        { type: RuneFuncType.Merge, title: gdk.i18n.t('i18n:BAG_TIP8'), panelId: PanelId.RuneMergePanel, sysId: 2880 },
        { type: RuneFuncType.Mix, title: gdk.i18n.t('i18n:RUNE_TIP26'), panelId: PanelId.RuneMixPanel, sysId: 2881 },
        { type: RuneFuncType.Clear, title: gdk.i18n.t('i18n:RUNE_TIP27'), panelId: PanelId.RuneClearPanel, sysId: 2882 },
    ];

    onEnable() {
        let arg = this.args[0];
        if (!arg) arg = RuneFuncType.Strengthen;
        let idx = arg;;
        while (!JumpUtils.ifSysOpen(this.funcConfig[idx].sysId)) {
            idx += 1;
        }
        this.initBtn();
        this.uiTabMenu.setSelectIdx(idx, true);
    }

    onDisable() {
        if (this.curFuncType >= 0) {
            gdk.panel.hide(this.funcConfig[this.curFuncType].panelId);
        }
    }

    initBtn() {
        this.funcConfig.forEach((c, idx) => {
            this.uiTabMenu.itemNames[idx] = c.title;
            let isOpen = JumpUtils.ifSysOpen(c.sysId);
            GlobalUtil.setAllNodeGray(this.uiTabMenu.node.children[idx], isOpen ? 0 : 1);
            if (isOpen) {
                gdk.panel.preload(c.panelId);
            }
        });
    }

    onTabMenuSelect(e, type) {
        if (!e) return;
        if (JumpUtils.ifSysOpen(this.funcConfig[parseInt(type)].sysId), true) {
            if (this.curFuncType >= 0) {
                gdk.panel.hide(this.funcConfig[this.curFuncType].panelId);
            }
            this.curFuncType = parseInt(type);
            gdk.panel.open(this.funcConfig[this.curFuncType].panelId);
        }
    }
}