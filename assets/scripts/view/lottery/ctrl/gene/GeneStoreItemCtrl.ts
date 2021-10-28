import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Gene_storeCfg, ItemCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-14 19:59:43 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/GeneStoreItemCtrl')
export default class GeneStoreItemCtrl extends UiListItem {
    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    itemName: cc.Label = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Node)
    lockNode: cc.Node = null;

    cfg: Gene_storeCfg;
    onDisable() {
        NetManager.targetOff(this);
    }

    updateView() {
        this.cfg = this.data;
        let itemCfg = BagUtils.getConfigById(this.cfg.target[0]);
        this.itemName.string = itemCfg.name;
        this.slot.updateItemInfo(this.cfg.target[0], this.cfg.target[1]);
        this.slot.itemInfo = {
            series: null,
            itemId: this.cfg.target[0],
            itemNum: this.cfg.target[1],
            type: BagUtils.getItemTypeById(this.cfg.target[0]),
            extInfo: null,
        }
        GlobalUtil.setSpriteIcon(this.node, this.costNode.getChildByName('icon'), GlobalUtil.getIconById(this.cfg.cost[0]));
        this.costNode.getChildByName('num').getComponent(cc.Label).string = this.cfg.cost[1] + '';
        // let type = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', cfg.career_id).career_type;
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${(<ItemCfg>itemCfg).career}`);
        this.lockNode.active = false;
        let num = BagUtils.getItemNumById(this.cfg.cost[0]) || 0;
        let costItemName = BagUtils.getConfigById(this.cfg.cost[0]).name;
        if (this.cfg.VIP_limit && ModelManager.get(RoleModel).vipLv < this.cfg.VIP_limit) {
            this.lockNode.active = true;
            this.lockNode.getChildByName('tips').getComponent(cc.RichText).string = `<color=#0fffff>VIP${this.cfg.VIP_limit}解锁</c>`;
        }
        else if (num < this.cfg.cost[1]) {
            this.lockNode.active = true;
            this.lockNode.getChildByName('tips').getComponent(cc.RichText).string = `<color=#0fffff>${costItemName}数量不足</c>`;
        }
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateCostInfo, this);
    }

    onItemClick() {
        let num = BagUtils.getItemNumById(this.cfg.cost[0]) || 0;
        let costItemName = BagUtils.getConfigById(this.cfg.cost[0]).name;
        if (this.cfg.VIP_limit && ModelManager.get(RoleModel).vipLv < this.cfg.VIP_limit) {
            gdk.gui.showMessage(`${StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP6"), this.cfg.VIP_limit)}`);
            return;
        } else if (num < this.cfg.cost[1]) {
            gdk.gui.showMessage(`${costItemName}${gdk.i18n.t("i18n:LOTTERY_TIP2")}`);
            return;
        }
        else {
            GlobalUtil.openAskPanel({
                title: gdk.i18n.t("i18n:BAG_TIP15"),
                descText: `${StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP7"), this.cfg.cost[1], costItemName, BagUtils.getConfigById(this.cfg.target[0]).name)} `,
                sureCb: () => {
                    let req = new icmsg.GeneStoreReq();
                    req.id = this.cfg.id;
                    NetManager.send(req, (resp: icmsg.GeneStoreRsp) => {
                        if (!cc.isValid(this.node)) return;
                        if (!this.node.activeInHierarchy) return;
                        GlobalUtil.openRewadrView(resp.heroChip);
                    }, this);
                },
            })
        }
    }

    _updateCostInfo() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        this.lockNode.active = false;
        let num = BagUtils.getItemNumById(this.cfg.cost[0]) || 0;
        let costItemName = BagUtils.getConfigById(this.cfg.cost[0]).name;
        // if (num < this.cfg.cost[1]) {
        //     this.lockNode.active = true;
        //     this.lockNode.getChildByName('tips').getComponent(cc.RichText).string = `< color=#0fffff > ${costItemName} 数量不足 < /c>`;
        // }
        if (this.cfg.VIP_limit && ModelManager.get(RoleModel).vipLv < this.cfg.VIP_limit) {
            this.lockNode.active = true;
            this.lockNode.getChildByName('tips').getComponent(cc.RichText).string = `<color=#0fffff>VIP${this.cfg.VIP_limit}解锁</c>`;
        }
        else if (num < this.cfg.cost[1]) {
            this.lockNode.active = true;
            this.lockNode.getChildByName('tips').getComponent(cc.RichText).string = `<color=#0fffff>${costItemName}数量不足</c>`;
        }
    }
}
