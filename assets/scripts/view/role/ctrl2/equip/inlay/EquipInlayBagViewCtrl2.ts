import JumpUtils from '../../../../../common/utils/JumpUtils';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';

/**
 * @Description: 装备面板控制
 * @Author: chengyou.lin
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: chengyou.lin
 * @Last Modified time: 2020-03-11 20:02:34
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/equip/inlay/EquipInlayBagViewCtrl2")
export default class EquipInlayBagViewCtrl2 extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;
    @property(cc.Node)
    emptyTips: cc.Node = null;

    list: ListView = null;
    onClick: gdk.EventTrigger = null;

    private _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.itemPre,
            cb_host: this,
            async: true,
            column: 1,
            gap_x: 0,
            gap_y: 14,
            direction: ListViewDir.Vertical,
        })
        // this.list.onClick.on(this._clickItem, this)
    }

    onLoad() {
        this._initListView();
        this.onClick = gdk.EventTrigger.get();
    }

    onDestroy() {
        if (this.list) {
            this.list.destroy()
            this.list = null
        }
        this.onClick.offAll();
    }

    private _clickItem(data, evntId: number) {
        this.onClick.emit(data, evntId);
        this.close();
    }

    updateDatas(_datas) {
        //空格填充
        let datas = _datas.concat();
        // let maxNum = datas.length;
        // if (maxNum < 5) {
        //     maxNum = 5;
        // }
        // let emptyItem: BagItem = { series: 0, itemId: 0, itemNum: 0, type: BagType.ITEM, extInfo: null };
        // let data = { bagItem: emptyItem };
        // for (let i = datas.length; i < maxNum; i++) {
        //     datas.push(data);
        // }
        this.list.clear_items();

        let onClick = gdk.EventTrigger.get();
        onClick.on(this._clickItem, this);
        for (let i = 0; i < datas.length; i++) {
            const data = datas[i];
            data.onClick = onClick;
        }
        this.list.set_data(datas);
        this.emptyTips.active = datas.length == 0
    }

    onForwardBtn() {
        if (JumpUtils.openView(705)) {
            this.close();
        }
    }
}
