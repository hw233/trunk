import GlobalUtil from '../utils/GlobalUtil';
import { ListView, ListViewDir } from './UiListview';

/** 
 * 奖励预览界面
 * @Author: sthoo.huang  
 * @Date: 2019-09-25 17:07:12 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 13:14:04
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/RewardPreviewCtrl")
export default class RewardPreviewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    titleBg: cc.Node = null

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.Node)
    suerBtn: cc.Node = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    goodList: icmsg.GoodsInfo[];
    list: ListView;
    column: number = 5;
    callback: Function;
    thisArg: any;
    onLoad() {
        this.node.active = false;
    }

    onDisable() {
        this.list && this.list.destroy();
        this.list = null;
        this.goodList = null;
        this.callback = null;
        this.thisArg = null;
    }

    /**
     * 设置物品列表，按钮文本，及按钮回调函数
     * @param goodList 
     * @param label 
     * @param callback 
     * @param thisArg 
     */
    setRewards(goodList: icmsg.GoodsInfo[], title?: string, label?: string, callback?: Function, thisArg?: any, isGet: boolean = false) {
        this.node.active = true;
        this.goodList = goodList;
        this.callback = callback;
        this.thisArg = thisArg;
        this.title = title || '';
        this.suerBtn.getComponentInChildren(cc.Label).string = label || '';
        this.suerBtn.active = !!label;
        // 计算列
        if (this.goodList.length < 5) {
            this.column = this.goodList.length;
        }
        let row = Math.ceil(this.goodList.length / this.column);
        // 计算scrollview的宽高
        let svWidth = this.column * 120;
        if (svWidth < 350) {
            svWidth = 350
        }
        let svHeight = row * 110 + 10;
        svHeight = Math.min(svHeight, 350);

        let bgHeihgt = svHeight + 80;
        this.bg.width = svWidth + 50
        this.bg.height = bgHeihgt;
        //this.titleBg.y = this.bg.y + 10//- 70;
        this.suerBtn.y = -bgHeihgt / 2 + 25;

        this.scrollView.node.setContentSize(cc.size(svWidth, svHeight));
        this.scrollView.node.x = -this.column * 120 / 2 + 10;
        this.scrollView.node.y = this.bg.y - 70
        if (this.list) {
            this.list.destroy();
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.rewardItem,
            cb_host: this,
            async: true,
            column: this.column,
            gap_x: 10,
            gap_y: 0,
            direction: ListViewDir.Vertical,
        });
        this.list.set_data(GlobalUtil.getEffectItemList(this.goodList, false, true, false, false, isGet));
    }

    clickHandle() {
        this.callback && this.callback.call(this.thisArg);
        this.close();
    }
}
