import GlobalUtil from '../utils/GlobalUtil';
import GuideBind from '../../guide/ctrl/GuideBind';
import GuideUtil from '../utils/GuideUtil';
import JumpUtils from '../utils/JumpUtils';
import ModelManager from '../managers/ModelManager';
import PanelId from '../../configs/ids/PanelId';
import RoleModel from '../models/RoleModel';
import SdkTool from '../../sdk/SdkTool';
import StoreViewCtrl, { StoreMenuType } from '../../view/store/ctrl/StoreViewCtrl';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/BaseViewTitleCtrl")
export default class BaseViewTitleCtrl extends cc.Component {

    @property(cc.Label)
    goldLab: cc.Label = null

    @property(cc.Label)
    diamondLab: cc.Label = null

    @property(cc.Label)
    careerLab: cc.Label = null

    @property(cc.Label)
    heroExpLab: cc.Label = null

    @property(cc.Label)
    title: cc.Label = null

    panel: gdk.BasePanel;
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        // 不显示充值按钮
        if (!SdkTool.tool.can_charge) {
            [
                'sub_titlebg/layout/sub_moneybg2/sub_item+',
                'sub_titlebg/sub_moneybg/sub_item+',
                'sub_titlebg/sub_moneybg2/sub_item+',
                'sub_titlebg/sub_moneybg3/sub_item+',
                'sub_titlebg/sub_moneybg4/sub_item+',
                'sub_titlebg/sub_moneybg5/sub_item+',
            ].forEach(e => {
                let n = cc.find(e, this.node);
                if (n) {
                    n.active = false;
                }
            });
        }
        let id = gdk.Tool.getResIdByNode(this.node);
        let node = gdk.panel.get(id);
        if (node) {
            this.panel = node.getComponent(gdk.BasePanel);
            if (this.panel) {
                gdk.Binding.bind(this, 'updateTitle', this.panel, 'title');
            }
        }
    }

    onDisable() {
        gdk.Binding.unbind(this);
    }

    /**标题更新 */
    updateTitle(str: string) {
        if (!this.title) return;
        this.title.string = gdk.i18n.t(str);
    }

    /**更新金币数量 */
    @gdk.binding("roleModel.gold")
    _updateGold() {
        if (!this.goldLab) return;
        this.goldLab.string = GlobalUtil.numberToStr(this.roleModel.gold, true);
    }

    /**更新钻石数量 */
    @gdk.binding("roleModel.gems")
    _updateDiamond() {
        if (!this.diamondLab) return;
        this.diamondLab.string = GlobalUtil.numberToStr(this.roleModel.gems);
    }

    /**更新进阶粉尘数量 */
    @gdk.binding("roleModel.career")
    _updateCareerNum() {
        if (!this.careerLab) return;
        this.careerLab.string = GlobalUtil.numberToStr(this.roleModel.career, true);
    }

    /**更新英雄经验 */
    @gdk.binding("roleModel.heroExp")
    _updateHeroExp() {
        if (!this.heroExpLab) return;
        this.heroExpLab.string = GlobalUtil.numberToStr(this.roleModel.heroExp, true);
    }

    /**检查点击的按钮是否符合当前引导的要求 */
    _checkEvent(e: cc.Event.EventTouch): boolean {
        let cfg = GuideUtil.getCurGuide();
        if (!cfg) return true;
        if (!cc.js.isNumber(cfg.bindBtnId)) return false;
        if (!e || typeof e != 'object' || !(e.target instanceof cc.Node)) {
            return true;
        }
        let ctrl = e.target.getComponent(GuideBind);
        if (!ctrl || !ctrl.guideIds || ctrl.guideIds.length == 0) {
            return false;
        }
        return ctrl.guideIds.indexOf(cfg.bindBtnId) >= 0;
    }

    /**跳转购买金币 */
    buyGoldFunc(e?: cc.Event.EventTouch) {
        if (!this._checkEvent(e)) {
            return;
        }
        if (!JumpUtils.ifSysOpen(2830, true)) {
            return
        }
        gdk.panel.open(PanelId.Alchemy)
    }

    /**跳转购买钻石 */
    buyDiamondFunc(e?: cc.Event.EventTouch) {
        if (!this._checkEvent(e)) {
            return;
        }
        if (!SdkTool.tool.can_charge) {
            return;
        }
        JumpUtils.openPanel({
            panelId: PanelId.Recharge,
            panelArgs: { args: [3] },
            currId: this.node,
            hideArgs: this.panel ? this.panel.hideArgs : null,
        });
    }

    /**跳转进阶粉尘 */
    buySecretFunc(e?: cc.Event.EventTouch) {

        if (!JumpUtils.ifSysOpen(1703, true)) {
            return
        }

        if (!this._checkEvent(e)) {
            return;
        }
        if (!SdkTool.tool.can_charge) {
            return;
        }
        JumpUtils.openPanel({
            panelId: PanelId.Store,
            panelArgs: { args: StoreMenuType.Secret },
            currId: this.node,
            hideArgs: this.panel ? this.panel.hideArgs : null,
        });
    }

    /**跳转友谊点购买 */
    buyFriendShipFunc(e?: cc.Event.EventTouch) {
        if (!this._checkEvent(e)) {
            return;
        }
        if (!SdkTool.tool.can_charge) {
            return;
        }
        JumpUtils.openPanel({
            panelId: PanelId.Store,
            callback: (node) => {
                let comp = node.getComponent(StoreViewCtrl)
                comp.menuBtnSelect(null, 1)
                comp.typeBtnSelect(null, 2)
            },
            panelArgs: { args: 0 },
            currId: this.node,
            hideArgs: this.panel ? this.panel.hideArgs : null,
        });
        // JumpUtils.openItemStore([2]);
    }

    /**关闭窗口 */
    closeFunc() {
        this.panel && this.panel.close(-1);
    }
}