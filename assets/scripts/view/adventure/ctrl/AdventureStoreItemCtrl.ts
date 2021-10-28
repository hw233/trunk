import ActUtil from '../../act/util/ActUtil';
import AdvStoreItemBuyCtrl from './AdvStoreItemBuyCtrl';
import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureModel from '../../adventure2/model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { ActivityEventId } from '../../act/enum/ActivityEventId';
import { Adventure_themeheroCfg, Adventure2_storeCfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-10 13:54:00 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdventureStoreItemCtrl")
export default class AdventureStoreItemCtrl extends UiListItem {
    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    itemName: cc.Label = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.Node)
    limitNode: cc.Node = null;

    @property(cc.Node)
    flag: cc.Node = null;

    @property(cc.Node)
    flag2: cc.Node = null;

    @property(cc.Node)
    lock: cc.Node = null;

    @property(cc.Node)
    sellOut: cc.Node = null;

    cfg: Adventure2_storeCfg;
    updateView() {
        this.cfg = this.data;
        let itemCfg = BagUtils.getConfigById(this.cfg.goods[0]);
        this.itemName.string = itemCfg.name;
        let type = BagUtils.getItemTypeById(this.cfg.goods[0]);
        this.slot.updateItemInfo(this.cfg.goods[0], this.cfg.goods[1]);
        this.slot.itemInfo = {
            series: null,
            itemId: this.cfg.goods[0],
            itemNum: this.cfg.goods[1],
            type: type,
            extInfo: null,
        }
        GlobalUtil.setSpriteIcon(this.node, this.costNode.getChildByName('icon'), GlobalUtil.getIconById(this.cfg.money_cost[0]));
        this.costNode.getChildByName('num').getComponent(cc.Label).string = this.cfg.money_cost[1] + '';
        this.flag.active = this.cfg.discount == 1;
        this.flag2.active = this.cfg.discount == 2
        let model = ModelManager.get(NewAdventureModel);
        this.lock.active = false;

        let info = model.adventureStoreBuyInfo[this.cfg.id];
        this.sellOut.active = info == 0;
        this.limitNode.getChildByName('num').getComponent(cc.Label).string = `${!info && info != 0 ? this.cfg.times_limit : info}/${this.cfg.times_limit}`;

        // let advCfgs = ConfigManager.getItems(AdventureCfg, { difficulty: model.difficulty, layer_id: model.layerId, type: AdventureUtils.actRewardType })
        // if (model.difficulty < this.cfg.unlock_difficulty || (model.difficulty == this.cfg.unlock_difficulty && model.layerId <= this.cfg.unlock_layer)) {
        //     if (model.plateIndex == advCfgs.length - 1 && model.plateFinish && model.difficulty == this.cfg.unlock_difficulty && model.layerId == this.cfg.unlock_layer) {
        //         return
        //     }
        //     this.lock.active = true;
        //     // this.lock.getChildByName('richtext').getComponent(cc.RichText).string = `<color=#FBF2D4><outline color=#962e00 width=2>通关<color=#ffd71a>【${['简单', '普通', '困难', '无尽模式'][this.cfg.unlock_difficulty - 1]}】</c>难度解锁</outline></c>`;
        //     let themeheroCfg = ConfigManager.getItemByField(Adventure_themeheroCfg, "difficulty", this.cfg.unlock_difficulty)
        //     let numArr = [`${gdk.i18n.t("i18n:ADVENTURE_NUM_1")}`, `${gdk.i18n.t("i18n:ADVENTURE_NUM_2")}`, `${gdk.i18n.t("i18n:ADVENTURE_NUM_3")}`]
        //     this.lock.getChildByName('richtext').getComponent(cc.RichText).string = StringUtils.format(gdk.i18n.t("i18n:ADVENTURE_TIP26"), themeheroCfg.difficulty_name, numArr[this.cfg.unlock_layer - 1])//`<color=#FBF2D4><outline color=#962e00 width=2><color=#ffd71a>【${themeheroCfg.difficulty_name}难度-第${['一', '二', '三'][this.cfg.unlock_layer - 1]}层】</c>解锁</outline></c>`;
        // }

    }

    onItemClick() {
        if (!ActUtil.getCfgByActId(56)) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ADVENTURE_TIP2"));
            gdk.panel.hide(PanelId.AdventureStoreView);
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            return;
        }
        if (this.lock.active) {
            let themeheroCfg = ConfigManager.getItemByField(Adventure_themeheroCfg, "difficulty", this.cfg.unlock_difficulty)
            let numArr = [`${gdk.i18n.t("i18n:ADVENTURE_NUM_1")}`, `${gdk.i18n.t("i18n:ADVENTURE_NUM_2")}`, `${gdk.i18n.t("i18n:ADVENTURE_NUM_3")}`]
            let str = StringUtils.format(gdk.i18n.t("i18n:ADVENTURE_TIP27"), themeheroCfg.difficulty_name, numArr[this.cfg.unlock_layer - 1])//`通关奇境探险【${themeheroCfg.difficulty_name}难度-第${['一', '二', '三'][this.cfg.unlock_layer - 1]}层】后可购买`
            gdk.gui.showMessage(str);
            return;
        }
        let model = ModelManager.get(NewAdventureModel);
        let info = model.adventureStoreBuyInfo[this.cfg.id];
        if (!info && info !== 0) {
            info = this.cfg.times_limit;
        }
        if (info == 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ADVENTURE_TIP28"));
            return;
        }

        let cb = (n: number) => {
            let num = BagUtils.getItemNumById(this.cfg.money_cost[0]) || 0;
            let costItemName = BagUtils.getConfigById(this.cfg.money_cost[0]).name;
            if (num < this.cfg.money_cost[1]) {
                gdk.gui.showMessage(`${costItemName}${gdk.i18n.t("i18n:ADVENTURE_TIP29")}`);
                return;
            }
            let req = new icmsg.Adventure2StoreBuyReq();
            req.storeId = this.cfg.id;
            req.num = n;
            NetManager.send(req, (resp: icmsg.Adventure2StoreBuyRsp) => {
                GlobalUtil.openRewadrView(resp.items);
                // info = resp.storeItem.remain;
                // this.sellOut.active = info == 0;
                // this.limitNode.getChildByName('num').getComponent(cc.Label).string = `${!info && info != 0 ? this.cfg.times_limit : info}/${this.cfg.times_limit}`;
            });
        };
        gdk.panel.open(PanelId.AdventureStoreItemBuyView, (node: cc.Node) => {
            let ctrl = node.getComponent(AdvStoreItemBuyCtrl);
            ctrl.initItemInfo(this.cfg.id, this.cfg.goods[0], this.cfg.goods[1], info, cb);
        });
    }
}
