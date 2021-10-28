import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import LotteryModel from '../../model/LotteryModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import { Gene_storeCfg, GeneCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-14 19:59:02 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/GeneStoreViewCtrl')
export default class GeneStoreViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.ToggleContainer)
    groupToggleContainer: cc.ToggleContainer = null;

    selectGroup: number;
    list: ListView;
    onEnable() {
        GlobalUtil.setSpriteIcon(this.node, this.costNode.getChildByName('icon'), GlobalUtil.getIconById(140016));
        this._updateCostInfo();
        let id = ModelManager.get(LotteryModel).curGenePoolId;
        if (!id) {
            id = GlobalUtil.getLocal('geneSelectId', true) || 1;
            id = Math.min(4, id);
        }
        let cfg = ConfigManager.getItemById(GeneCfg, id);
        let toggle = this.groupToggleContainer.node.getChildByName(`group${cfg.camp ? cfg.camp : 1}`).getComponent(cc.Toggle);
        toggle.check();
        this.onGroupToggleClick(toggle);
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateCostInfo, this);
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    onGroupToggleClick(toggle: cc.Toggle) {
        let name = toggle.node.name;
        this.selectGroup = parseInt(name.substring('group'.length));
        this._updateHeroList();
    }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                column: 2,
                gap_x: -2,
                gap_y: 2,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateHeroList() {
        this._initListView();
        let cfgs: Gene_storeCfg[] = [];
        if (this.selectGroup == 0) {
            cfgs = ConfigManager.getItems(Gene_storeCfg);
        }
        else {
            cfgs = ConfigManager.getItemsByField(Gene_storeCfg, 'camp', this.selectGroup);
        }
        cfgs.sort((a, b) => {
            if (a.camp == b.camp) {
                return a.order - b.order;
            }
            else {
                return a.camp - b.camp;
            }
        });

        this.list.clear_items();
        this.list.set_data(cfgs);
    }

    _updateCostInfo() {
        let num = BagUtils.getItemNumById(140016) || 0;
        this.costNode.getChildByName('num').getComponent(cc.Label).string = num + '';
    }
}
