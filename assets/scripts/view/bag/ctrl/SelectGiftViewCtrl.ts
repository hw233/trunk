import ConfigManager from '../../../common/managers/ConfigManager';
import { BagEvent } from '../enum/BagEvent';
import { Item_drop_groupCfg, Item_dropCfg, ItemCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';



export enum SelectGiftType {
    Bag = 0,
    Store = 1
}

export type SelectGiftInfo = {
    index,
    itemId,
    num,
    mainId,
    giftType,
    star?,
}


/** 
  * @Description: 可选物品礼包
  * @Author: luoyong
  * @Date: 2019-09-12 13:50:11
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-16 10:36:54
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/SelectGiftViewCtrl")
export default class SelectGiftViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.Node)
    titleBg: cc.Node = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    selectGiftItem: cc.Prefab = null

    goodList: icmsg.GoodsInfo[] = []

    list: ListView = null

    column: number = 5
    maxRow: number = 3
    callFunc: any = null;

    start() {

    }

    onEnable() {
        gdk.e.on(BagEvent.SELECT_GIFT_ITEM, this._selectGiftItem, this);

    }

    onDisable() {
        gdk.e.targetOff(this);
    }

    onDestroy() {
        if (this.list) {
            this.list.destroy()
            this.list = null
        }
    }

    _initListView() {
        if (this.list) {
            this.list.destroy()
        }

        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.selectGiftItem,
            cb_host: this,
            async: true,
            column: this.column,
            gap_x: 15,
            gap_y: 15,
            direction: ListViewDir.Vertical,
        })
    }


    initRewardInfo(id, type, callFunc = null) {
        this.callFunc = callFunc;
        let itemCfg = ConfigManager.getItemById(ItemCfg, id)
        this.title = itemCfg.name
        if (itemCfg.name.length > 6) {
            this.titleBg.width = itemCfg.name.length * 40
        }
        let dropCfgs = ConfigManager.getItemsByField(Item_dropCfg, "drop_id", itemCfg.func_args[0])
        let list = []
        dropCfgs.forEach((element, index) => {
            if (element.item_id && element.item_id > 0) {
                let info: SelectGiftInfo = {
                    index: index,
                    itemId: element.item_id,
                    num: element.item_num,
                    mainId: id,
                    giftType: type
                }
                list.push(info)
            }
        });

        if (list.length == 0) {
            let dropGroups = []
            dropCfgs.forEach(element => {
                dropGroups = dropGroups.concat(ConfigManager.getItemsByField(Item_drop_groupCfg, "group_id", element.group_id))
            });
            if (dropGroups && dropGroups.length > 0) {
                dropGroups.forEach((cfg, index) => {
                    let info: SelectGiftInfo = {
                        index: index,
                        itemId: cfg.item_id,
                        num: cfg.item_num,
                        mainId: id,
                        giftType: type
                    }
                    list.push(info)
                })
            }
        }

        this.goodList = list
        if (this.goodList.length < 5) {
            this.column = this.goodList.length
        }
        let row = Math.ceil(this.goodList.length / this.column)

        // 计算scrollview的宽高
        let delHeigth = ((this.maxRow - row) >= 0 ? (this.maxRow - row) : 0) * 120 - 70;
        this.bg.height = 507 - delHeigth
        cc.find('yx_tcbg02/yx_tcbg04', this.node).y = 5 - this.bg.height;
        this.scrollView.node.height = 365 - delHeigth
        this.content.height = 365 - delHeigth

        this._initListView()
        this.list.set_data(this.goodList)
    }

    _selectGiftItem(event: gdk.Event) {
        let data = event.data;
        if (this.callFunc) {
            this.callFunc(data);
        }
    }
}
