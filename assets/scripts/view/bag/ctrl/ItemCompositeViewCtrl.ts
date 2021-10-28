import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroDetailViewCtrl from '../../lottery/ctrl/HeroDetailViewCtrl';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { HeroCfg, Item_composeCfg, ItemCfg } from '../../../a/config';

/** 
  * @Description: 可选物品礼包确认框
  * @Author: yaozu.hu
  * @Date: 2019-09-12 13:50:11
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:51:52
*/

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/ItemCompositeViewCtrl")
export default class ItemCompositeViewCtrl extends gdk.BasePanel {

    @property(UiSlotItem)
    getItem: UiSlotItem = null

    @property(cc.Label)
    curNum: cc.Label = null

    @property(cc.RichText)
    desc: cc.RichText = null

    @property(cc.Label)
    itemName: cc.Label = null

    @property(cc.Slider)
    numSlider: cc.Slider = null
    @property(cc.Label)
    compositeNum: cc.Label = null;

    @property(cc.Node)
    heroLookBtn: cc.Node = null;

    _itemId: number = 0;
    _itemNum: number = 0;
    _itemCfg: ItemCfg;
    _comNum: number = 0;
    _comCfg: ItemCfg;
    maxNum: number = 0;
    getNum: number = 0;

    _heroCfg: HeroCfg

    onEnable() {
        NetManager.on(icmsg.ItemComposeRsp.MsgType, this.onItemCompositeRsp, this)
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    initRewardInfo(itemId: number) {
        this._itemId = itemId
        this._itemNum = BagUtils.getItemNumById(itemId)
        let cfg = <ItemCfg>BagUtils.getConfigById(itemId)
        this._itemCfg = cfg;
        this.itemName.string = cfg.name
        this.itemName.node.color = BagUtils.getColor(cfg.color)
        this.itemName.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(cfg.color);
        this.getItem.updateItemInfo(itemId, 1)

        this.curNum.string = `${this._itemNum}`
        this.desc.string = GlobalUtil.makeItemDes(itemId);
        //let bagItem = BagUtils.getItemById(itemId) as BagItem;
        let comCfg = ConfigManager.getItemById(Item_composeCfg, itemId);
        if (comCfg) {
            this._comNum = BagUtils.getItemNumById(comCfg.target)
            this._comCfg = ConfigManager.getItemById(ItemCfg, comCfg.target);
            this.maxNum = Math.floor(this._itemNum / comCfg.amount);
            this.getNum = this.maxNum;

            if (comCfg && comCfg.target) {
                this._heroCfg = ConfigManager.getItemById(HeroCfg, comCfg.target)
                this.heroLookBtn.active = !!this._heroCfg
            }
        }
        //this.maxNum = bagItem.itemNum;
        if (this.maxNum == 0) {
            this.compositeNum.node.color = cc.color("#F14444")
        } else {
            this.compositeNum.node.color = cc.color("#FFFFFF")
        }

        this.updateGetNum();
    }

    updateGetNum() {
        let getNum = this.getNum;
        if (getNum > this.maxNum) {
            getNum = this.maxNum;
            this.getNum = getNum;
        } else if (getNum < 0) {
            getNum = 0;
            this.getNum = getNum;
        }
        this.compositeNum.string = this.getNum + '/' + this.maxNum;
        this.numSlider.progress = this.maxNum == 0 ? 0 : this.getNum / this.maxNum;
    }

    //减数量
    onMinusBtn() {
        this.getNum--;
        this.updateGetNum();
    }

    //加数量
    onPlusBtn() {
        this.getNum++;
        this.updateGetNum();
    }

    //合成按钮，发送合成消息
    getFunc() {
        if (this.maxNum == 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t('i18n:ITEM_COMPOSITE_TIP2'));
            this.ItemClick(false);
            return;
        }
        if (this.getNum == 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t('i18n:ITEM_COMPOSITE_TIP1'))
            return;
        }

        let comCfg = ConfigManager.getItemById(Item_composeCfg, this._itemId);

        let msg = new icmsg.ItemComposeReq()
        msg.stuffId = comCfg.id;
        msg.num = this.getNum;
        NetManager.send(msg, (resp: icmsg.ItemComposeRsp) => {
            GlobalUtil.openRewadrView(resp.list);
            this.close()
        })
    }

    /**
     * 物品点击
     */
    ItemClick(showTips: boolean = true) {
        //物品获取路径提示框
        // if (this._itemCfg && this._itemCfg.stage_id.length > 0) {
        //     let itemInfo = BagUtils.getItemById(this._itemId);
        //     GlobalUtil.openGainWayTips(itemInfo)
        //     let panel = gdk.panel.get(PanelId.Bag)
        //     if (panel) {
        //         BagUtils.model.tipsRecordItem = itemInfo
        //     }
        //     this.close()
        // } else {
        //     if (showTips) gdk.gui.showMessage(gdk.i18n.t('i18n:ITEM_COMPOSITE_TIP3'))
        // }
    }

    heroLookFunc() {
        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let comp = node.getComponent(HeroDetailViewCtrl)
            comp.initHeroInfo(this._heroCfg)
        })
    }

    onItemCompositeRsp() {

    }

    onSliderChange() {
        this.getNum = Math.floor(this.maxNum * this.numSlider.progress)
        this.updateGetNum();
    }
}
