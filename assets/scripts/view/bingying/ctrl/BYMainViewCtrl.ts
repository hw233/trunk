import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import PanelId from '../../../configs/ids/PanelId';
import RedPointCtrl from '../../../common/widgets/RedPointCtrl';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-13 10:30:57 
  */
const { ccclass, property, menu } = cc._decorator;

/**systemId - {panelId,redpointCb} */
const viewList: any = [
    { panelId: PanelId.BYView, sysId: 1100, rpIds: [4001, 4003, 4004, 20118, 20119, 20121], btnRes: "yx_bingying", sortId: 1 }, //兵营
    { panelId: PanelId.BYTechView, sysId: 2930, rpIds: [20171], btnRes: "yx_keji", sortId: 2 }, //科技
    { panelId: PanelId.BYEnergizeView, sysId: 2931, rpIds: [20172], btnRes: "yx_juneng", sortId: 3 }, //聚能
]

@ccclass
@menu("qszc/view/bingying/BYMainViewCtrl")
export default class BYMainViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(UiTabMenuCtrl)
    tabMenu: UiTabMenuCtrl = null;

    @property(cc.Node)
    panelParent: cc.Node = null;

    cb: Function;
    panelIndex: number = 0;    // 当前打开的界面索引
    onEnable() {
        viewList.sort((a, b) => { return a.sortId - b.sortId; });
        this._preloadPanel()
        this._initMenu()
        this.tabMenu.node.children.forEach((btn, idx) => {
            if (viewList[idx]) {
                btn.active = JumpUtils.ifSysOpen(viewList[idx].sysId);
            }
        });
        let arg = this.args;
        let idx, sortId;
        if (arg) {
            if (arg instanceof Array) sortId = arg[0];
            else sortId = arg;
        }
        if (sortId && sortId > 0) {
            idx = this._getIdxBySortId(sortId);
        }
        else {
            idx = 0;
        }
        while (!JumpUtils.ifSysOpen(viewList[idx].sysId)) {
            idx += 1;
        }

        this._selectPanel(idx);
    }

    onDisable() {
        gdk.e.targetOff(this);
        // this.panelParent.removeAllChildren();
        // 关闭打开或打开中的子界面
        for (let i = 0, n = viewList.length; i < n; i++) {
            let panelId = viewList[i].panelId
            if (panelId) {
                gdk.panel.hide(panelId);
            }
        }
        this.panelIndex = -1;
        this.cb = null;
    }

    // 跳转隐藏参数
    get hideArgs() {
        let r: gdk.PanelHideArg = {
            id: this.resId,
            args: viewList[this.panelIndex].sortId,
        };
        return r;
    }

    _preloadPanel() {
        viewList.forEach(obj => {
            let panelId: gdk.PanelValue = obj.panelId;
            panelId && gdk.panel.preload(panelId);
        });
    }

    _initMenu() {
        let l = 0;
        this.tabMenu.itemNames = viewList
        this.tabMenu.node.children.forEach((btn, idx) => {
            let obj = viewList[idx];
            if (obj) {
                let sysId = obj.sysId
                let rpIds = obj.rpIds
                if (JumpUtils.ifSysOpen(sysId)) {
                    l += 1;
                    let url = `view/bingying/texture/${obj.btnRes}`;
                    GlobalUtil.setSpriteIcon(this.node, cc.find('select/icon', btn), url);
                    GlobalUtil.setSpriteIcon(this.node, cc.find('normal/icon', btn), url + '01');
                    let rpCtrl = btn.getComponent(RedPointCtrl)
                    rpCtrl.orIds = []
                    rpCtrl.enabled = false
                    if (rpIds.length > 0) {
                        rpCtrl.orIds = rpIds
                        rpCtrl.enabled = true
                    }
                } else {
                    btn.active = false
                }
            } else {
                btn && btn.removeFromParent();
            }
        });
        // this.scrollView.scrollToRight();
        this.scrollView.horizontal = l > 5;
    }

    selectPanel(sortId: number, cb?: Function) {
        this.cb = cb;
        let idx = this._getIdxBySortId(sortId);
        if (!JumpUtils.ifSysOpen(viewList[idx].sysId)) {
            idx = 0;
        }
        while (!JumpUtils.ifSysOpen(viewList[idx].sysId)) {
            idx += 1;
        }
        this._selectPanel(idx);
    }

    _selectPanel(idx: number) {
        if (idx > this.tabMenu.itemNames.length - 1) idx = 0;
        idx = Math.max(0, idx);
        this.tabMenu.setSelectIdx(idx, true);
    }

    onTabMenuSelect(e, data) {
        if (!e) return;
        let panelId = viewList[this.panelIndex].panelId//gdk.PanelId.getValue(this._panelNames[this.panelIndex]);
        if (panelId) gdk.panel.hide(panelId);
        this.panelIndex = data;
        if (this.panelIndex >= 5) this.scrollView.scrollToLeft();
        if (this.panelIndex == 0) this.scrollView.scrollToRight();
        gdk.panel.open(viewList[this.panelIndex].panelId, (node: cc.Node) => {
            this.cb && this.cb();
        }, null, {
            parent: this.panelParent
        });
    }

    _getIdxBySortId(id: number) {
        for (let i = 0; i < viewList.length; i++) {
            if (viewList[i].sortId == id) {
                return i;
            }
        }
    }
}
