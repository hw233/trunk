import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagItem, BagType } from '../../../common/models/BagModel';
import { Guardian_equip_starCfg, Item_dropCfg, ItemCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { RedPointEvent } from '../../../common/utils/RedPointUtils';
import { SelectGiftInfo } from './SelectGiftViewCtrl';

/** 
  * @Description: 可选物品礼包确认框
  * @Author: luoyong
  * @Date: 2019-09-12 13:50:11
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-20 15:34:30
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/SelectGiftGetCtrl")
export default class SelectGiftGetCtrl extends gdk.BasePanel {

    @property(UiSlotItem)
    getItem: UiSlotItem = null

    @property(cc.Label)
    curNum: cc.Label = null

    @property(cc.RichText)
    desc: cc.RichText = null

    @property(cc.Label)
    itemName: cc.Label = null

    @property(cc.EditBox)
    numEditBox: cc.EditBox = null

    @property(cc.Node)
    disintNode: cc.Node = null;
    @property(cc.Sprite)
    disintItemIcon: cc.Sprite = null;
    @property(cc.Label)
    disintNum: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null

    _getData: SelectGiftInfo = null

    maxNum: number = 0;
    getNum: number = 0;

    column: number = 4

    list: ListView = null

    itemCfg
    start() {

    }

    initRewardInfo(data: SelectGiftInfo) {
        this._getData = data
        this.itemCfg = BagUtils.getConfigById(data.itemId)
        let itemType = BagUtils.getItemTypeById(data.itemId)
        let show = false
        if (this.itemCfg instanceof ItemCfg) {
            show = true
        }
        this.itemName.string = this.itemCfg.name
        this.itemName.node.color = BagUtils.getColor(this.itemCfg.color)
        this.itemName.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(this.itemCfg.color);
        this.getItem.updateItemInfo(data.itemId, data.num)
        if (data.star && data.star > 0) {
            this.getItem.updateStar(data.star)
            if (itemType == BagType.GUARDIANEQUIP) {
                let starCfg = ConfigManager.getItemByField(Guardian_equip_starCfg, "star", data.star, { type: this.itemCfg.type, part: this.itemCfg.part })
                this.itemName.node.color = BagUtils.getColor(starCfg.color)
                this.itemName.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(starCfg.color);
            }
        }

        this.curNum.string = `${BagUtils.getItemNumById(data.itemId)}`
        this.desc.string = GlobalUtil.makeItemDes(data.itemId);

        let bagItem = BagUtils.getItemById(data.mainId) as BagItem;
        this.maxNum = bagItem.itemNum;
        if (bagItem.itemId == 130090) {
            this.maxNum = 1;
        }
        this.getNum = 1;
        this.disintNode.active = show && this.itemCfg.disint_item && this.itemCfg.disint_item.length > 0
        if (this.itemCfg.disint_item && this.itemCfg.disint_item.length > 0) {
            GlobalUtil.setSpriteIcon(this.node, this.disintItemIcon, GlobalUtil.getIconById(this.itemCfg.disint_item[0][0]))
        }
        this.updateGetNum();

        this._initListView()
        if (this.itemCfg instanceof ItemCfg) {
            if (this.itemCfg.func_args3) {
                let dropCfgs = ConfigManager.getItemsByField(Item_dropCfg, "drop_id", this.itemCfg.func_args[0])
                let datas = []
                dropCfgs.forEach((element, index) => {
                    if (element.item_id && element.item_id > 0) {
                        let info: SelectGiftInfo = {
                            index: index,
                            itemId: element.item_id,
                            num: element.item_num,
                            mainId: data.itemId,
                            giftType: itemType
                        }
                        datas.push(info)
                    }
                });
                let row = Math.ceil(datas.length / this.column)
                // 计算scrollview的宽高
                this.scrollView.node.height = row * 100
                this.content.height = row * 100

                this.list.set_data(datas)
            }
        }
    }

    updateGetNum() {
        let getNum = this.getNum;
        if (getNum > this.maxNum) {
            getNum = this.maxNum;
            this.getNum = getNum;
        } else if (getNum < 1) {
            getNum = 1;
            this.getNum = getNum;
        }
        this.numEditBox.string = getNum.toString();

        if (this.itemCfg.disint_item && this.itemCfg.disint_item.length > 0) {
            this.disintNum.string = getNum * this.itemCfg.disint_item[0][1] + ''
        }

    }


    _initListView() {
        if (this.list) {
            return
        }

        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.itemPrefab,
            cb_host: this,
            async: true,
            column: this.column,
            gap_x: 16,
            gap_y: 15,
            direction: ListViewDir.Vertical,
        })
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

    //最大数量
    onMaxBtn() {
        this.getNum = this.maxNum;
        this.updateGetNum();
    }

    //最小数量
    onMinBtn() {
        this.getNum = 1;
        this.updateGetNum();
    }

    onEditorDidEnded() {
        this.getNum = parseInt(this.numEditBox.string) || 1;
        this.updateGetNum();
    }

    getFunc() {
        //礼包
        if (this._getData.giftType == -1) {
            let goodInfo: icmsg.GoodsInfo = new icmsg.GoodsInfo()
            goodInfo.num = this.getNum
            goodInfo.typeId = this._getData.mainId
            let msg = new icmsg.ItemDisintReq()
            msg.items = [goodInfo];
            NetManager.send(msg, () => {
                this.close()
                if (this._getData.mainId == 160271 || this._getData.mainId == 160272) {
                    gdk.gui.showMessage(`${gdk.i18n.t("i18n:BAG_TIP12")}${this.getNum}`)
                }
                if (this._getData.mainId == 160271) {
                    let model = ModelManager.get(CopyModel);
                    model.isOpenedQuickFightView = false
                    gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
                }
            })
            return;
        }

        let good: icmsg.GoodsInfo = new icmsg.GoodsInfo()
        good.typeId = this._getData.mainId
        good.num = this.getNum;
        let msg = new icmsg.ItemDisintReq()
        msg.items = [good]
        msg.index = this._getData.index
        NetManager.send(msg, () => {
            this.close()
            gdk.panel.hide(PanelId.SelectGift)
        }, this)
    }
}
