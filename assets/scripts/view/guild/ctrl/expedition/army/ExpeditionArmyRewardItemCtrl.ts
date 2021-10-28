import BagUtils from '../../../../../common/utils/BagUtils';
import ExpeditionModel from '../ExpeditionModel';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import UiListItem from '../../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { Expedition_forcesCfg } from '../../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-16 11:17:42 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/army/ExpeditionArmyRewardItemCtrl")
export default class ExpeditionArmyRewardItemCtrl extends UiListItem {
    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    descContent: cc.Node = null;

    @property(cc.Node)
    descItem: cc.Node = null;

    @property(cc.Node)
    rContent: cc.Node = null;

    @property(cc.Node)
    rLayout: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.Node)
    goBtn: cc.Node = null;

    cfg: Expedition_forcesCfg;
    type: number; //0-奖励 1-特权
    updateView() {
        [this.cfg, this.type] = [this.data.cfg, this.data.type];
        this.lvLab.string = `${this.cfg.id == 1 ? '初始' : `${this.cfg.id - 1}级`}`;
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/guild/texture/expedition/army/${this.cfg.skin}`);
        this.descContent.active = this.type == 1;
        this.rContent.active = this.type == 0;
        this.type == 0 ? this._updateRewardContent() : this._updateDescContent();
    }

    onGoBtnClick() {
        gdk.panel.hide(PanelId.ExpeditionArmyRewardView);
        if (!gdk.panel.isOpenOrOpening(PanelId.ExpeditionArmyView)) {
            gdk.panel.open(PanelId.ExpeditionArmyView);
        }
    }

    _updateDescContent() {
        this.descContent.removeAllChildren()
        let cfg_desc = this.cfg.desc
        let datas = cfg_desc.split("<br>")
        for (let i = 0; i < datas.length; i++) {
            let item = cc.instantiate(this.descItem)
            item.active = true
            let richLab = cc.find("label", item).getComponent(cc.RichText)
            richLab.string = `${datas[i]}`
            this.descContent.addChild(item)
        }
    }

    _updateRewardContent() {
        this.rLayout.removeAllChildren();
        if (this.cfg.rewards && this.cfg.rewards.length >= 1) {
            this.cfg.rewards.forEach(r => {
                let item = cc.instantiate(this.slotPrefab);
                item.parent = this.rLayout;
                let ctrl = item.getComponent(UiSlotItem);
                ctrl.updateItemInfo(r[0], r[1]);
                ctrl.itemInfo = {
                    series: null,
                    itemId: r[0],
                    itemNum: r[1],
                    type: BagUtils.getItemTypeById(r[0]),
                    extInfo: null
                };
            })
        }
        let curLv = ModelManager.get(ExpeditionModel).armyLv;
        this.mask.active = this.cfg.id <= curLv && this.cfg.id !== 1;
        this.goBtn.active = this.cfg.id == curLv + 1;
    }
}
