import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RedPointCtrl from '../../../common/widgets/RedPointCtrl';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-06 13:41:18 
  */
const { ccclass, property, menu } = cc._decorator;

/**systemId - {panelId,redpointCb} */
const viewList: any = [
    { panelId: PanelId.ResonatingView, sysId: 2857, rpIds: [], btnRes: "xzlm_zhulishuijing", sortId: 1, showHandler: null }, //永恒水晶
    // { panelId: PanelId.GeneralWeaponUpgradePanel, sysId: 2814, rpIds: [20101, 20102], btnRes: "fb_shenqi", sortId: 2, showHandler: () => { return !GeneralUtils.weaponActIconShowFunc(); } }, //神器
    { panelId: PanelId.EnergyStationView, sysId: 2871, rpIds: [20106], btnRes: "xzlm_nengliangzhan", sortId: 3, showHandler: null }, //能量站
    { panelId: PanelId.AssistAllianceView, sysId: 2900, rpIds: [20131], btnRes: "xzlm_xiezhanlianmeng", sortId: 4, showHandler: null }, //协战联盟
    { panelId: PanelId.LegionView, sysId: 2901, rpIds: [20132], btnRes: "xzlm_juntuan", sortId: 5, showHandler: null }, //军团
    { panelId: PanelId.GeneConnectView, sysId: 2948, rpIds: [], btnRes: "gk_jiyinlianjie", sortId: 6, showHandler: () => { return ModelManager.get(HeroModel).hasMysticHero; } }, //基因链接
]

@ccclass
@menu("qszc/view/resonating/SupportMainViewCtrl")
export default class SupportMainViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(UiTabMenuCtrl)
    tabMenu: UiTabMenuCtrl = null;

    @property(cc.Node)
    panelParent: cc.Node = null;

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
                if (JumpUtils.ifSysOpen(sysId) && (!obj.showHandler || obj.showHandler())) {
                    l += 1;
                    let url = `view/resonating/texture/${obj.btnRes}`;
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
                    // btn.active = false
                    btn.opacity = 0;
                    btn.width = btn.height = 0;
                }
            } else {
                btn && btn.removeFromParent();
            }
        });
        // this.scrollView.scrollToRight();
        this.scrollView.horizontal = l > 5;
    }

    selectPanel(sortId: number) {
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
        gdk.panel.open(viewList[this.panelIndex].panelId, null, null, {
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
