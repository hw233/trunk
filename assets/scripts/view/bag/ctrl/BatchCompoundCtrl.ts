import BagUtils, { jewelSubType, jewelType } from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagType } from '../../../common/models/BagModel';
import { Item_rubyCfg } from '../../../a/config';

/** 
 * 物品提示面板
 * @Author: weiliang.huang  
 * @Description: 
 * @Date: 2019-03-21 09:57:55 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-05 19:28:31
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/JewelUpdateCtrl")
export default class JewelUpdateCtrl extends gdk.BasePanel {

    // @property(cc.Label)
    // numLabel: cc.Label = null;

    // @property(cc.Label)
    // lvLabel: cc.Label = null;

    @property(cc.Label)
    previewLabel: cc.Label = null;

    @property(cc.RichText)
    tipsLabel: cc.RichText = null;

    // @property(cc.Label)
    // tips2Label: cc.Label = null;

    // @property(cc.Node)
    // numNode: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    pageType: number = 0;  //   0-全部类型宝石合成  1-单个类型宝石合成
    jewelId: number; // pageType为1时, 宝石Id

    jewelSubType: jewelSubType[] = [jewelSubType.hurt, jewelSubType.resistance];
    jewelType: jewelType[] = [jewelType.radiate, 2, 3, 4, 5, 6];
    exps: any = {}; // key-vlaue: 'subtype_type_level'-exp
    showList: { id: number, num: number }[] = [];

    onEnable() {
        let arg = gdk.panel.getArgs(PanelId.BatchCompound);
        if (arg) {
            this.pageType = arg[0][0];
            if (this.pageType == 1) this.jewelId = arg[0][1];
        }
        this._initJewelExp();
        this._updatePreview();
    }

    onDisable() {
        this.content.removeAllChildren();
    }

    onCompoundBtn() {
        if (!this.showList || this.showList.length <= 0) {
            gdk.gui.showMessage(`${gdk.i18n.t("i18n:BAG_TIP1")}`);
        }
        else {
            let req = new icmsg.RubyComposeReq();
            req.rubyId = this.pageType == 1 ? this.jewelId : -1;
            NetManager.send(req, (resp: icmsg.RubyComposeRsp) => {
                let list: icmsg.GoodsInfo[] = [];

                this.showList.forEach(item => {
                    let goodsInfo = new icmsg.GoodsInfo();
                    goodsInfo.typeId = item.id;
                    goodsInfo.num = item.num;
                    list.push(goodsInfo);
                });
                GlobalUtil.openRewadrView(list);
                this.close();
            });
        }
    }

    _initJewelExp() {
        this.exps = {};
        let lvs = [1, 2, 3, 4, 5, 6, 7, 8];
        for (let i = 0; i < this.jewelSubType.length; i++) {
            for (let j = 0; j < this.jewelType.length; j++) {
                for (let k = 0; k < lvs.length; k++) {
                    let subType = this.jewelSubType[i];
                    let type = this.jewelType[j];
                    let lv = lvs[k];
                    this.exps[`${subType}_${type}_${lv}`] = BagUtils.getJewelExpByType(subType, type, lv);
                }
            }
        }
    }

    _initShowList() {
        if (!this.exps || this.exps.length <= 0) this._initJewelExp();
        this.showList = [];
        for (let key in this.exps) {
            let str = key.split('_');
            if (str.length != 3) continue;
            let subType = parseInt(str[0]);
            let type = parseInt(str[1]);
            let lv = parseInt(str[2]);
            let exp = this.exps[key];
            let cfg = ConfigManager.getItem(Item_rubyCfg, { type: type, sub_type: subType, level: lv });
            if (this.pageType == 1 && this.jewelId && this.jewelId != cfg.id) continue;
            let nextCfg = lv >= 8 ? null : ConfigManager.getItem(Item_rubyCfg, { type: type, sub_type: subType, level: lv + 1 });
            let composeNum = nextCfg ? Math.floor(exp / nextCfg.exp) : 0;
            if (composeNum > 0) {
                this.showList.push({
                    id: nextCfg.id,
                    num: composeNum
                })
            }
        }

    }

    _updatePreview() {
        this._initShowList();
        this.content.removeAllChildren(true);
        if (this.showList.length == 0) {
            this.tipsLabel.node.active = true;
            this.previewLabel.node.active = false;
            if (this.pageType == 1) {
                this.tipsLabel.string = `${gdk.i18n.t("i18n:BAG_TIP1")}<br/><br/>` + ConfigManager.getItemById(Item_rubyCfg, this.jewelId).ruby_des;
            }
            else {
                this.tipsLabel.string = `${gdk.i18n.t("i18n:BAG_TIP1")}`;
            }
        }
        else {
            this.tipsLabel.node.active = false;
            this.previewLabel.node.active = true;
            if (this.showList.length > 4) this.scrollView.horizontal = true;
            else this.scrollView.horizontal = false;
            this.showList.sort((a, b) => { return b.id - a.id; });
            this.showList.forEach(item => {
                let slotItem = cc.instantiate(this.itemPrefab);
                slotItem.parent = this.content;
                let ctrl = slotItem.getComponent(UiSlotItem);
                let info = BagUtils.getItemById(item.id);
                let itemInfo = {
                    series: info ? info.series : 0,
                    itemId: info ? info.itemId : item.id,
                    itemNum: 0,
                    type: BagType.JEWEL,
                    extInfo: info ? info.extInfo : null
                }
                ctrl.itemInfo = itemInfo;
                ctrl.updateItemInfo(item.id, item.num);
            });
        }
    }
}
