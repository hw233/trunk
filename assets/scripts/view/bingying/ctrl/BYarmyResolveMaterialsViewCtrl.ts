import BagUtils from '../../../common/utils/BagUtils';
import BYarmyResolveMaterialsItemCtrl from './BYarmyResolveMaterialsItemCtrl';
import BYModel from '../model/BYModel';
import ModelManager from '../../../common/managers/ModelManager';
import { BYEventId } from '../enum/BYEventId';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { Soldier_army_skinCfg } from '../../../a/config';

/** 
 * @Description: 兵营-兵团融甲界面
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-16 11:28:04
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYarmyResolveMaterialsViewCtrl")
export default class BYarmyResolveMaterialsViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    selectNum: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView = null

    limit: number = 0;
    goodInfos: icmsg.GoodsInfo[] = []
    materialIds: number[] = [];

    selectItemIds: number[] = [];
    selectItemNums: number[] = [];
    allSelectNum: number = 0;
    get byModel() { return ModelManager.get(BYModel); }

    cfgs: Soldier_army_skinCfg[] = [];

    onEnable() {
        [this.limit, this.goodInfos] = this.args[0];
        if (this.goodInfos.length > 0) {
            this.goodInfos.forEach((goodinfo, idx) => {
                this.selectItemIds[idx] = goodinfo.typeId;
                this.selectItemNums[idx] = goodinfo.num;
                this.allSelectNum += goodinfo.num;
            })
        }
        this.cfgs = this.byModel.skinCfgs//ConfigManager.getItems(Soldier_army_skinCfg)
        this._updateScroll();
        this._updateNum();
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    onAllSelectBtnClick() {
        if (this.allSelectNum >= this.limit) {
            return;
        }

        let len = this.list.items.length;
        for (let i = 0; i < len; i++) {
            let item = this.list.items[i].node;
            let ctrl = item.getComponent(BYarmyResolveMaterialsItemCtrl);
            if (!ctrl.data.select) {
                this._selectItem(ctrl.data, i);
            }
            if (this.allSelectNum >= this.limit) {
                break;
            }
        }

    }

    onSelectBtnClick() {

        gdk.e.emit(BYEventId.BYARMY_RESOLVE_SELECTSKIN, this.goodInfos);
        this.close();
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
                gap_y: 25,
                async: true,
                direction: ListViewDir.Vertical,
            })
            this.list.onClick.on(this._selectItem, this);
        }
    }

    _updateScroll() {
        this._initListView();
        let datas = [];

        let temGoodInfos: icmsg.GoodsInfo[] = [];
        let temSkins = this.byModel.byarmyState.skins;
        this.cfgs.forEach(cfg => {
            let itemId = cfg.consumption[0];
            let itemData = BagUtils.getItemById(itemId);
            if (itemData) {
                if (temSkins.indexOf(cfg.skin_id) >= 0) {
                    if (itemData.itemNum > 0) {
                        let info = new icmsg.GoodsInfo()
                        info.typeId = itemId;
                        info.num = itemData.itemNum;
                        temGoodInfos.push(info)
                    }
                } else if (itemData.itemNum > cfg.consumption[1]) {
                    let info = new icmsg.GoodsInfo()
                    info.typeId = itemId;
                    info.num = itemData.itemNum - cfg.consumption[1];
                    temGoodInfos.push(info)
                }
            }

        })


        temGoodInfos.forEach(goodInfo => {
            let index = this.selectItemIds.indexOf(goodInfo.typeId);
            let isSelect: boolean = false;
            let num = 0;
            if (index >= 0) {
                isSelect = true;
                num = this.selectItemNums[index]
            }
            for (let i = 0; i < goodInfo.num; i++) {
                datas.push({
                    itemId: goodInfo.typeId,
                    select: isSelect && i < num
                })
            }

        })

        this.list.clear_items();
        this.list.set_data(datas);
    }

    _selectItem(data: { itemId: number, select: boolean }, idx: number) {
        let item = this.list.items[idx].node;
        let ctrl = item.getComponent(BYarmyResolveMaterialsItemCtrl);

        if (data.select) {
            let index = this.selectItemIds.indexOf(data.itemId);
            if (index >= 0) {
                let temNum = this.selectItemNums[index] - 1;
                if (temNum <= 0) {
                    this.selectItemIds.splice(index, 1);
                    this.selectItemNums.splice(index, 1);
                } else {
                    this.selectItemNums[index] = temNum;
                }
            }
        } else {
            if (this.allSelectNum >= this.limit) {
                gdk.gui.showMessage(gdk.i18n.t('i18n:BYARMY_TIP18'));
                return
            }
            let index = this.selectItemIds.indexOf(data.itemId);
            if (index >= 0) {
                let temNum = this.selectItemNums[index] + 1;
                this.selectItemNums[index] = temNum;
            } else {
                this.selectItemIds.push(data.itemId)
                this.selectItemNums.push(1);
            }
        }
        let temAllNum = 0
        this.selectItemNums.forEach(num => {
            temAllNum += num;
        })
        this.allSelectNum = temAllNum;
        let temGoodInfos = []
        this.selectItemIds.forEach((id, idx) => {
            if (this.selectItemNums[idx] > 0) {
                let goodInfo = new icmsg.GoodsInfo()
                goodInfo.typeId = id;
                goodInfo.num = this.selectItemNums[idx]
                temGoodInfos.push(goodInfo);
            }
        })
        this.goodInfos = temGoodInfos;

        ctrl.check();


        this._updateNum();
    }

    _updateNum() {
        this.selectNum.string = `${this.allSelectNum}/${this.limit}`;
    }
}
