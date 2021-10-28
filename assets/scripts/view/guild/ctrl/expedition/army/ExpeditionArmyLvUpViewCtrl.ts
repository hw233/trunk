import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import ExpeditionModel from '../ExpeditionModel';
import ExpeditionUtils from '../ExpeditionUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { Expedition_descCfg, Expedition_forcesCfg } from '../../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-15 16:07:05 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/army/ExpeditionArmyLvUpViewCtrl")
export default class ExpeditionArmyLvUpViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Node)
    pContent: cc.Node = null;

    @property(cc.Node)
    pItem: cc.Node = null;

    @property(cc.Node)
    rContent: cc.Node = null;

    @property(cc.Prefab)
    rItemPrefab: cc.Prefab = null;

    get eModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }

    onEnable() {
        let curLv = this.eModel.armyLv;
        // let curLv = 2;
        let curCfg = ConfigManager.getItemByField(Expedition_forcesCfg, 'id', curLv, { type: this.eModel.activityType });
        let oldCfg = ConfigManager.getItemByField(Expedition_forcesCfg, 'id', curLv - 1, { type: this.eModel.activityType });
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/guild/texture/expedition/army/${curCfg.skin}`);
        this.nameLab.string = curCfg.name;
        //特权
        this.pContent.removeAllChildren();
        for (let i = 0; i < 7; i++) {
            let curV = ExpeditionUtils.getPrivilegeNum(curCfg.id, i);
            if (curV > 0) {
                let privilegeName = ConfigManager.getItemByField(Expedition_descCfg, 'privilege', i).desc;
                let oldV = oldCfg ? ExpeditionUtils.getPrivilegeNum(oldCfg.id, i) : 0;
                let item = cc.instantiate(this.pItem);
                item.parent = this.pContent;
                item.active = true;
                item.getChildByName('name').getComponent(cc.Label).string = privilegeName;
                item.getChildByName('old').getComponent(cc.Label).string = Math.floor(oldV) + '';
                item.getChildByName('new').getComponent(cc.Label).string = Math.floor(curV) + '';
            }
        }
        //升级奖励
        this.rContent.removeAllChildren();
        curCfg.rewards.forEach(r => {
            let slot = cc.instantiate(this.rItemPrefab);
            slot.parent = this.rContent;
            let ctrl = slot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(r[0], r[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: r[0],
                itemNum: r[1],
                type: BagUtils.getItemTypeById(r[0]),
                extInfo: null
            };
        })

        this.node.setScale(.7);
        this.node.runAction(cc.sequence(
            cc.scaleTo(.2, 1.05, 1.05),
            cc.scaleTo(.15, 1, 1)
        ));
    }

    onDisable() {
        this.node.stopAllActions();
    }
}
