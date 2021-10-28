import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import { BagEvent } from '../enum/BagEvent';
import { BagType } from '../../../common/models/BagModel';
import { HBItemType } from '../../lottery/ctrl/HBViewCtrl';
import { HeroCfg, Item_dropCfg, ItemCfg } from '../../../a/config';
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
}


/** 
  * @Description: 可选英雄礼包
  * @Author: luoyong
  * @Date: 2019-09-12 13:50:11
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 12:11:32
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/SelectHeroViewCtrl")
export default class SelectHeroViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    selectHeroItem: cc.Prefab = null

    goodList: icmsg.GoodsInfo[] = []

    list: ListView = null

    callFunc: any = null;

    get model() { return ModelManager.get(HeroModel); }

    start() {

    }

    onEnable() {
        gdk.e.on(BagEvent.SELECT_GIFT_ITEM, this._selectGiftItem, this);

    }

    onDisable() {

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
            item_tpl: this.selectHeroItem,
            cb_host: this,
            async: true,
            gap_x: 10,
            gap_y: 10,
            direction: ListViewDir.Horizontal,
        })
    }

    selectFunc() {
        let data: SelectGiftInfo = this.list.selectd_data
        if (!data) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:BAG_TIP17"))
            return
        }
        let type = BagUtils.getItemTypeById(data.itemId)
        if (type == BagType.HERO) {
            if (data.giftType == -1) {
                let goodInfo: icmsg.GoodsInfo = new icmsg.GoodsInfo()
                goodInfo.num = 1
                goodInfo.typeId = data.mainId
                let msg = new icmsg.ItemDisintReq()
                msg.items = [goodInfo];
                NetManager.send(msg, () => {
                    this.close()
                })
                return;
            }
            let good: icmsg.GoodsInfo = new icmsg.GoodsInfo()
            good.typeId = data.mainId
            good.num = 1
            let msg = new icmsg.ItemDisintReq()
            msg.items = [good]
            msg.index = data.index
            NetManager.send(msg, () => {
                this.close()
            }, this)
        }
    }


    initRewardInfo(id, type, callFunc = null) {
        this.callFunc = callFunc;
        let itemCfg = ConfigManager.getItemById(ItemCfg, id)
        let dropCfgs = ConfigManager.getItemsByField(Item_dropCfg, "drop_id", itemCfg.func_args[0])
        let list = []
        let heroList = []
        dropCfgs.forEach((element, index) => {
            let info: SelectGiftInfo = {
                index: index,
                itemId: element.item_id,
                num: element.item_num,
                mainId: id,
                giftType: type
            }
            list.push(info)

            let cfg = ConfigManager.getItemById(HeroCfg, element.item_id)
            let data: HBItemType = {
                geted: !!HeroUtils.getHeroInfoById(cfg.id),
                cfg: cfg,
                careerLineIdx: 0,
            }
            heroList.push(data)
        });
        this.goodList = list
        this._initListView()
        this.list.set_data(this.goodList)
        this.model.bookHeroList = heroList


        let maxLen = list.length
        if (maxLen >= 3) {
            maxLen = 3
        }
        this.scrollView.node.width = 175 * maxLen + 10 * (maxLen - 1)
        this.scrollView.node.x = -this.scrollView.node.width / 2
    }

    _selectGiftItem(event: gdk.Event) {
        let data = event.data;
        if (this.callFunc) {
            this.callFunc(data);
        }
    }
}
