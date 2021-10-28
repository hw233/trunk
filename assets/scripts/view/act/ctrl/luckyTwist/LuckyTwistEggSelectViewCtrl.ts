import ActivityModel from '../../model/ActivityModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import LuckyTwistEggSelectItemCtrl from './LuckyTwistEggSelectItemCtrl';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Twist_eggCfg } from '../../../../a/config';

/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-07 16:11:41
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/luckyTwist/LuckyTwistEggSelectViewCtrl")
export default class LuckyTwistEggSelectViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;

    curIndex: number = 0;
    selectWishItem: icmsg.GoodsInfo;
    _curSelectItemId: number = 0
    _eggCfg: Twist_eggCfg
    //get model() { return ModelManager.get(GuardianModel) }
    onEnable() {
        let arg = this.args
        this._eggCfg = arg[0]
        this._curSelectItemId = arg[1] ? arg[1] : 0
        this._updateView();
    }

    onDisable() {
        gdk.Timer.clearAll(this)
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
    }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                column: 4,
                gap_x: 40,
                gap_y: 40,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
        this.list.onClick.on(this._selectItem, this);
    }

    _selectItem(data: any, index) {
        this.selectWishItem = data;
        this.curIndex = index;
    }

    _updateView(resetPos: boolean = true) {
        this._initListView();
        let listData: icmsg.GoodsInfo[] = []

        let items = this._eggCfg.wish
        for (let i = 0; i < items.length; i++) {
            let goodInfo = new icmsg.GoodsInfo()
            goodInfo.typeId = items[i][0]
            goodInfo.num = items[i][1]
            listData.push(goodInfo)
        }

        this.curIndex = -1;
        listData.forEach((info, index) => {
            if (info.typeId == this._curSelectItemId) {
                this.curIndex = index;
                this.selectWishItem = info;
            }
        })

        this.list.set_data(listData, resetPos);
        if (this.curIndex >= 0) {
            gdk.Timer.once(50, this, () => {
                let tem = this.list.items[this.curIndex];
                this.list.select_item(this.curIndex);
                this.list.scroll_to(this.curIndex)
                if (tem.node) {
                    let ctrl = tem.node.getComponent(LuckyTwistEggSelectItemCtrl);
                    this._selectItem(ctrl.data, this.curIndex)
                }
            })
        }
    }

    selectBtnClick() {
        if (this.selectWishItem && this.selectWishItem.typeId != this._curSelectItemId) {
            let wishIds = []
            let rewardCfgs = ConfigManager.getItemsByField(Twist_eggCfg, "type", ModelManager.get(ActivityModel).luckyTwistEggSubType)
            rewardCfgs.forEach(element => {
                wishIds.push(0)
            });
            wishIds[this._eggCfg.number - 1] = this.curIndex + 1
            //发送许愿消息
            let msg = new icmsg.TwistEggWishReq()
            msg.wishIdxs = wishIds//[this.curIndex + 1]
            NetManager.send(msg, (rsp: icmsg.TwistEggWishReq) => {
                let msg2 = new icmsg.TwistEggStateReq()
                NetManager.send(msg2, () => {
                    this.close();
                })
            }, this)
        } else {
            this.close();
        }
    }
}
