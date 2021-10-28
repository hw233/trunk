import BagUtils from '../../../common/utils/BagUtils';
import ChatUtils from '../../chat/utils/ChatUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { AttrType, EquipAttrTYPE } from '../../../common/utils/EquipUtils';
import { BagItem } from '../../../common/models/BagModel';
import { Item_rubyCfg } from '../../../a/config';

/** 
 * 物品提示面板
 * @Author: weiliang.huang  
 * @Description: 
 * @Date: 2019-03-21 09:57:55 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-21 15:26:51
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/JewelTipsCtrl")
export default class JewelTipsCtrl extends gdk.BasePanel {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.RichText)
    descLab: cc.RichText = null

    @property(cc.Node)
    attNode: cc.Node = null

    @property(cc.Node)
    attPanel: cc.Node = null

    @property(cc.RichText)
    getLink: cc.RichText = null

    @property(cc.Node)
    composeBtn: cc.Node = null;

    itemInfo: BagItem = null
    baseConfig: Item_rubyCfg = null

    onEnable() {
        let args = this.args;
        if (args) {
            this.initItemInfo(args[0]);
        }
    }

    initItemInfo(itemInfo: BagItem) {
        this.itemInfo = itemInfo
        this.baseConfig = <Item_rubyCfg>BagUtils.getConfigById(itemInfo.itemId)
        this.slot.updateItemInfo(itemInfo.itemId, itemInfo.itemNum)
        this.descLab.string = this.baseConfig.des
        this.title = this.baseConfig.name
        this._titleLabel.node.color = BagUtils.getColor(this.baseConfig.color)
        this._updateAttValue()
        this.composeBtn.active = gdk.panel.isOpenOrOpening(PanelId.Bag)
    }

    _updateAttValue() {
        let arr = BagUtils.getJewelAttrById(this.itemInfo.itemId)
        for (let i = 0; i < arr.length; i++) {
            let node = this.attPanel.children[i];
            if (!node) {
                node = cc.instantiate(this.attNode)
                node.parent = this.attPanel
            }
            this._updateOneAtt(node, arr[i])
        }
    }

    _updateOneAtt(attNode: cc.Node, info: AttrType) {
        let typeLab = attNode.getChildByName("typeLab").getComponent(cc.Label)
        let numLab = attNode.getChildByName("numLab").getComponent(cc.Label)
        typeLab.string = info.name
        let value = `${info.value}`
        if (info.type == EquipAttrTYPE.R) {
            value = `${info.value / 100}%`
        }
        numLab.string = value
    }

    /**装备分享 */
    shareBtnFunc() {
        ChatUtils.sendShareItem(this.itemInfo)
        this.close()
    }

    _showGetLink() {
        // if (this.baseConfig && (this.baseConfig.get.length > 0 || this.baseConfig.stage_id.length > 0)) {
        //     this.getLink.node.active = true
        // } else {
        //     this.getLink.node.active = false
        // }
    }

    //获取途径响应
    getLinkFunc() {
        // if (this.itemInfo) {
        //     GlobalUtil.openGainWayTips(this.itemInfo)
        // }
    }

    onComposeBtn() {
        let cfg = ConfigManager.getItemById(Item_rubyCfg, this.itemInfo.itemId);
        if (cfg.level >= 8) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_EGG_TIP11"));
        }
        else {
            gdk.panel.setArgs(PanelId.BatchCompound, [1, this.itemInfo.itemId]);
            gdk.panel.open(PanelId.BatchCompound);
            this.close();
        }
    }
}
