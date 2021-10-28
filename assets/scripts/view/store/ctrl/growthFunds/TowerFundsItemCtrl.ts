import { Growthfund_towerfundCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import StoreUtils from '../../../../common/utils/StoreUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import StoreModel from '../../model/StoreModel';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-21 20:11:50 
  */// Learn TypeScript:

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/growthFunds/TowerFundsItemCtrl")
export default class TowerFundsItemCtrl extends UiListItem {
    @property(cc.Button)
    getBtn: cc.Button = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    targetLvLabel: cc.Label = null;

    @property(cc.Node)
    tipsNode: cc.Node = null;

    cfg: Growthfund_towerfundCfg;
    maxNum: number = 0;
    updateView() {
        this.cfg = this.data.cfg;
        this.maxNum = this.data.maxNum
        this.targetLvLabel.string = (this.cfg.layer % 520000) + '';
        let itemId = this.cfg.reward[0][0];
        let itemNum = this.cfg.reward[0][1]
        this.slot.updateItemInfo(itemId, itemNum);
        this.slot.itemInfo = {
            series: null,
            itemId: itemId,
            itemNum: itemNum,
            type: BagUtils.getItemTypeById(itemId),
            extInfo: null,
        };

        let preCfg = ConfigManager.getItemById(Growthfund_towerfundCfg, this.cfg.id - 1);
        //let curLv = ModelManager.get(RoleModel).level;
        this.tipsNode.active = false;
        //TODO
        if (this.maxNum < this.cfg.layer) {
            if (!preCfg || preCfg.layer <= this.maxNum) {
                this.tipsNode.active = true;
                this.tipsNode.getChildByName('leftNum').getComponent(cc.Label).string = `${(this.cfg.layer - this.maxNum) % 520000}层`;
            }
            this.mask.active = false;
            this.getBtn.node.active = true;
            this.getBtn.interactable = false;
        }
        else {
            if (StoreUtils.getTowerFundsRewardState(this.cfg.id)) {
                this.mask.active = true;
                this.getBtn.node.active = false;
            }
            else {
                this.mask.active = false;
                this.getBtn.node.active = true;
                this.getBtn.interactable = true;
            }
        }
    }

    onGetBtnClick() {
        if (!ModelManager.get(StoreModel).isBuyTowerFunds) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:FUNDS_TIP7'));
            return;
        }
        if (this.maxNum >= this.cfg.layer && !StoreUtils.getTowerFundsRewardState(this.cfg.id)) {
            let req = new icmsg.TowerfundAwardReq();
            req.id = this.cfg.id;
            NetManager.send(req, (resp: icmsg.TowerfundAwardRsp) => {
                GlobalUtil.openRewadrView(resp.list);
                this.mask.active = true;
                this.getBtn.node.active = false;
            })
        }
    }
}
