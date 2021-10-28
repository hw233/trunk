import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import SailingModel, { SailingPointInfo } from '../../model/SailingModel';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Sailing_globalCfg, Sailing_mapCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/sailing/SailingBoxCtrl")
export default class SailingBoxCtrl extends cc.Component {

    @property(cc.Node)
    boxIcon: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    rewardContent: cc.Node = null;

    @property(cc.Node)
    hasGet: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    showNode: cc.Node = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    _info: SailingPointInfo

    _plateCfg: Sailing_mapCfg
    get sailingModel(): SailingModel { return ModelManager.get(SailingModel); }

    updateInfo(info: SailingPointInfo) {
        this._info = info
        this._plateCfg = ConfigManager.getItemByField(Sailing_mapCfg, "map_id", 1001, { type: this.sailingModel.activityType, plate: this._info.type })
        if (this._plateCfg.effects) {
            this.boxIcon.active = false
            this.spine.node.active = true
            this.spine.setAnimation(0, this._plateCfg.effects, true)
            this.showNode.active = false
            if (this._plateCfg.show && this._plateCfg.show.length > 0) {
                this.showNode.active = true
                for (let i = 0; i < this._plateCfg.show.length; i++) {
                    let id = this._plateCfg.show[i][0]
                    let num = this._plateCfg.show[i][1]
                    let slot = this.createSlot(id, num);
                    slot.scale = 0.65
                    cc.find("bg/content", this.showNode).addChild(slot)
                }
            }
        } else {
            this.boxIcon.active = true
            GlobalUtil.setSpriteIcon(this.node, this.boxIcon, `icon/item/${this._plateCfg.icon}`)
            this.spine.node.active = false
        }
        this._plateCfg.reward.forEach(item => {
            let id = item[0];
            let num = item[1];
            let slot = this.createSlot(id, num);
            slot.scale = 0.8
            this.rewardContent.addChild(slot)
        });
        this.hasGet.active = Boolean(Math.pow(2, this._info.type - 1) & this.sailingModel.sailingInfo.mapRewarded)
    }

    showReward(v: boolean) {
        this.boxIcon.active = !v
        this.spine.node.active = !v

        if (this._plateCfg.effects) {
            this.boxIcon.active = false
            if (this.spine.node.active) {
                this.spine.setAnimation(0, this._plateCfg.effects, true)
            }
        } else {
            this.spine.node.active = false
        }

        this.rewardContent.active = v
        this.hasGet.active = Boolean(Math.pow(2, this._info.type - 1) & this.sailingModel.sailingInfo.mapRewarded)

        let itemId = ConfigManager.getItemById(Sailing_globalCfg, "sailing_item").value[0]
        this.redPoint.active = BagUtils.getItemNumById(itemId) >= this._info.cfg.consumption && !this.hasGet.active
    }

    createSlot(id: number, num: number): cc.Node {
        let slot = cc.instantiate(this.slotPrefab);
        let ctrl = slot.getComponent(UiSlotItem);
        ctrl.updateItemInfo(id, num);
        return slot;
    }

    clickFunc() {
        if (this._info.type > 0) {
            let isGet = Boolean(Math.pow(2, this._info.type - 1) & this.sailingModel.sailingInfo.mapRewarded)
            if (isGet) {
                gdk.gui.showMessage("该岛屿已探索")
                return
            }
            gdk.panel.setArgs(PanelId.SailingCheckView, this._info.cfg)
            gdk.panel.open(PanelId.SailingCheckView)
        }
    }

}