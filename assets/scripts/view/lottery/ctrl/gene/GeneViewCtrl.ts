import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import LotteryModel from '../../model/LotteryModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { LotteryEventId } from '../../enum/LotteryEventId';
import { Unique_globalCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-12 14:50:35 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/GeneView')
export default class GeneView extends gdk.BasePanel {
    @property(cc.Node)
    geneChipNode: cc.Node = null;

    @property(cc.Node)
    geneEssenceNode: cc.Node = null;

    @property(cc.Node)
    geneFragment: cc.Node = null;

    // @property(cc.Node)
    // switchNode: cc.Node = null;
    @property(cc.Node)
    geneStoreBtnNode: cc.Node = null;
    @property(cc.Node)
    chipGiftBtnNode: cc.Node = null;

    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Node)
    panelParent: cc.Node = null;

    @property({ type: cc.String })
    _panelNames: string[] = [];

    @property({ type: gdk.PanelId, tooltip: "子界面，如果没可选值，请先配置gdk.PanelId" })
    get panels() {
        let ret = [];
        for (let i = 0; i < this._panelNames.length; i++) {
            ret[i] = gdk.PanelId[this._panelNames[i]] || 0;
        }
        return ret;
    }
    set panels(value) {
        this._panelNames = [];
        for (let i = 0; i < value.length; i++) {
            this._panelNames[i] = gdk.PanelId[value[i]];
        }
    }

    panelIndex: number = -1;    // 当前打开的界面索引
    // panelType: pageType; //当前页面类型  1-装备召唤 2-普通基因抽奖 3-英雄转换
    onEnable() {
        ModelManager.get(LotteryModel).firstInGene = false;
        let args = this.args[0];
        let idx = args;
        if ((!idx && idx !== 0) || [1, 2].indexOf(idx) !== -1) idx = 1;
        this.selectFunc(true, idx);
        this.mask.active = false;
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._onItemUpdateRsp, this);
        gdk.e.on(LotteryEventId.SHOW_ITEM_END, this._onShowItemEnd, this);
    }

    onDisable() {
        gdk.e.targetOff(this);
        // 关闭打开或打开中的子界面
        for (let i = 0, n = this._panelNames.length; i < n; i++) {
            let panelId = gdk.PanelId.getValue(this._panelNames[i]);
            if (panelId) {
                gdk.panel.hide(panelId);
            }
        }
        this.panelIndex = -1;
        NetManager.targetOff(this);
    }

    close(buttonIndex: number = -1): void {
        if (ModelManager.get(LotteryModel).geneTransOrgianlHeroId) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:LOTTERY_TIP10"));
            return;
        }
        super.close(buttonIndex);
    }

    /**面板选择显示 */
    selectFunc(e: any, utype: any) {
        if (!e) return;
        if (ModelManager.get(LotteryModel).geneTransOrgianlHeroId) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:LOTTERY_TIP10"));
            this.uiTabMenu.showSelect(2);
            return;
        }
        (cc.js.isString(utype)) && (utype = parseInt(utype));
        (utype < 0) && (utype = 0);
        // 打开子界面索引变更
        if (this.panelIndex == utype) {
            return;
        }

        if (utype == 0) {
            if (!JumpUtils.ifSysOpen(2955, true)) {
                if (this.panelIndex !== 0) {
                    this.uiTabMenu.showSelect(this.panelIndex);
                } else {
                    this.selectFunc(true, 1);
                }
                return;
            }
            let v = ConfigManager.getItemByField(Unique_globalCfg, 'key', 'uniquedrop_unlock').value;
            let m = ModelManager.get(RoleModel);
            if (m.maxHeroStar < v[0] && m.level < v[1]) {
                gdk.gui.showMessage(`拥有第一个${v[0]}星英雄或玩家达到${v[1]}级时,开启装备召唤`);
                if (this.panelIndex !== 0) {
                    this.uiTabMenu.showSelect(this.panelIndex);
                } else {
                    this.selectFunc(true, 1);
                }
                return;
            }
        }

        // 关闭上一个子界面
        if (this.panelIndex > -1) {
            let panelId = gdk.PanelId.getValue(this._panelNames[this.panelIndex]);
            if (panelId) {
                gdk.panel.hide(panelId);
            }
            this.panelIndex = -1;
        }
        // 打开新的子界面
        // this.panelType = utype * 2 + 1;
        // this.panelType = utype + 1;
        this.panelIndex = utype;
        this.uiTabMenu.showSelect(utype);
        let panelId = gdk.PanelId.getValue(this._panelNames[utype]);
        if (panelId) {
            gdk.panel.open(
                panelId,
                this._initViewInfo,
                this,
                {
                    parent: this.panelParent,
                    args: 1
                },
            );
        }
    }

    // onSwitchClick() {
    //     let type = 3 - this.panelType % 3;
    //     this.panelType = type;
    //     let panelId = gdk.PanelId.getValue(this._panelNames[this.panelIndex]);
    //     let ctrl = gdk.panel.get(panelId).getComponent(GeneLotteryViewCtrl);
    //     //todo  
    //     ctrl.updateView(this.panelType);
    //     this._initViewInfo();
    // }

    /**基因商店 */
    onStoreClick() {
        gdk.panel.open(PanelId.GeneStoreView);
    }

    /**芯片礼包 */
    onChipGiftClick() {
        if (ModelManager.get(LotteryModel).geneTransOrgianlHeroId) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:LOTTERY_TIP10"));
            return;
        }
        this.close();
        // gdk.panel.setArgs(PanelId.Recharge, [1]);
        // gdk.panel.open(PanelId.Recharge);
        JumpUtils.openRechargetLBPanel([3]);
    }

    onUnOpenFuncClick() {
        if (ModelManager.get(LotteryModel).geneTransOrgianlHeroId) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:LOTTERY_TIP10"));
            return;
        }
        gdk.gui.showMessage(gdk.i18n.t("i18n:LOTTERY_TIP11"));
    }

    _onItemUpdateRsp() {
        this._initViewInfo();
    }

    _onShowItemEnd() {
        this.mask.active = false;
    }

    _initViewInfo() {
        let nodes = [this.geneChipNode, this.geneEssenceNode, this.geneFragment];
        let itemIds = [140001, 140015, 140016, 140017];
        nodes.forEach((node, idx) => {
            node.active = this.panelIndex !== 0;
            if (node.active) {
                let itemId = itemIds[idx];
                let itemNum = BagUtils.getItemNumById(itemId) || 0;;
                cc.find(`${idx == 3 ? 'layout/' : ''}num`, node).getComponent(cc.Label).string = itemNum + '';
                if (idx == 3) {
                    GlobalUtil.setSpriteIcon(this.node, cc.find(`${idx == 3 ? 'layout/' : ''}icon`, node), GlobalUtil.getIconById(itemId));
                }
                else {
                    let slot = node.getChildByName('UiSlotItem').getComponent(UiSlotItem);
                    slot.updateItemInfo(itemId, 1);
                    slot.itemInfo = {
                        series: null,
                        itemId: itemId,
                        itemNum: 1,
                        type: BagUtils.getItemTypeById(itemId),
                        extInfo: null
                    }
                }
            }
        });

        this.geneStoreBtnNode.active = this.panelIndex == 1;
        this.chipGiftBtnNode.active = this.panelIndex == 1;
        // this.switchNode.active = this.panelType !== 3;
        // if (this.switchNode.active) {
        //     GlobalUtil.setSpriteIcon(this.node, this.switchNode.getChildByName('icon'), `view/lottery/texture/gene/jyzh_anniu0${this.panelType == 1 ? 6 : 7}`)
        // }
        this._updateRedpoint();
    }

    _updateRedpoint() {
        let geneChipRedpoint = this.geneChipNode.getChildByName('RedPoint');
        // let switchRedpoint = this.switchNode.getChildByName('RedPoint');
        if (this.panelIndex !== 1) {
            geneChipRedpoint.active = false;
            // switchRedpoint.active = false;
        }
        else {
            geneChipRedpoint.active = false;
            let geneChipNum = BagUtils.getItemNumById(140001) || 0;
            let local = GlobalUtil.getLocal(`geneItem140001`, true) || 0;
            if (geneChipNum != local) {
                GlobalUtil.setLocal('geneItem140001', geneChipNum, true);
                gdk.e.emit(LotteryEventId.UPDATE_LOTTERY_ITEM_CHECK);
            }
            let num = BagUtils.getItemNumById(140017) || 0;
            // switchRedpoint.active = num >= 1000;
        }
    }
}

export enum pageType {
    normalGene = 1, //普通基因抽奖
    superGene,  //超级基因抽奖
    heroTrans   //英雄转换
}
