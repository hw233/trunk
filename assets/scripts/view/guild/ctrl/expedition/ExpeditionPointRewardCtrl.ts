import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionModel from './ExpeditionModel';
import ExpeditionProduceItemCtrl from './ExpeditionProduceItemCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Expedition_forcesCfg, Expedition_globalCfg, Expedition_pointCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-28 10:17:52
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionPointRewardCtrl")
export default class ExpeditionPointRewardCtrl extends gdk.BasePanel {

    @property(cc.Node)
    produceLayout: cc.Node = null;

    @property(cc.Prefab)
    produceItem: cc.Prefab = null;

    @property(cc.Node)
    rewardContent: cc.Node = null;

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null;

    @property(cc.Node)
    pointIcon: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;


    _pointCfg: Expedition_pointCfg
    get expeditionModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }

    onEnable() {
        this._pointCfg = this.args[0]
        this._initOutput()

        this.rewardContent.removeAllChildren()
        this._pointCfg.show_reward.forEach(item => {
            let slot = cc.instantiate(this.rewardItem);
            let ctrl = slot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(item[0], item[1]);
            slot.parent = this.rewardContent;
            slot.scale = 0.8
            ctrl.itemInfo = {
                series: null,
                itemId: item[0],
                itemNum: item[1],
                type: BagUtils.getItemTypeById(item[0]),
                extInfo: null
            };
        });

        if (this._pointCfg.skin_type == 1) {
            GlobalUtil.setSpriteIcon(this.node, this.pointIcon, `view/guild/texture/icon/${this._pointCfg.point_skin[0]}`)
            this.pointIcon.scale = this._pointCfg.point_skin[1] / 100
        } else {
            let url: string = StringUtils.format("spine/monster/{0}/{0}", this._pointCfg.point_skin[0]);
            GlobalUtil.setSpineData(this.spine.node, this.spine, url, true, 'stand_s', true);
            this.spine.node.scale = this._pointCfg.point_skin[1] / 100
            this.spine.node.opacity = 255;
        }

        let pointInfo = this.expeditionModel.curPointInfo
        if (pointInfo.info) {
            if (pointInfo.info.progress == this._pointCfg.stage_id2.length + 1) {
                this.spine.node.active = false
                let curCfg = ConfigManager.getItemByField(Expedition_forcesCfg, 'id', this.expeditionModel.armyLv, { type: this.expeditionModel.activityType });
                GlobalUtil.setSpriteIcon(this.node, this.pointIcon, `view/guild/texture/expedition/army/${curCfg.skin}`);
            } else {
                if (pointInfo.info.hasOccupied) {
                    //被占领过
                    if (pointInfo.cfg.occupation_skin && pointInfo.cfg.occupation_skin.length) {
                        this.spine.node.active = false
                        GlobalUtil.setSpriteIcon(this.node, this.pointIcon, `view/guild/texture/icon/${pointInfo.cfg.occupation_skin[0]}`)
                        this.pointIcon.scale = pointInfo.cfg.occupation_skin[1] / 100
                    } else {
                        if (pointInfo.cfg.skin_type == 1) {
                            GlobalUtil.setSpriteIcon(this.node, this.pointIcon, `view/guild/texture/icon/${pointInfo.cfg.point_skin[0]}`)
                            this.pointIcon.scale = pointInfo.cfg.point_skin[1] / 100
                        }
                    }
                }
            }
        }

    }

    _initOutput() {
        let production_time = ConfigManager.getItemById(Expedition_globalCfg, "production_time").value[0]
        let times = 3600 / production_time

        this.produceLayout.removeAllChildren()
        let rewards = this._pointCfg.output_reward
        rewards.forEach(element => {
            let item = cc.instantiate(this.produceItem)
            this.produceLayout.addChild(item)
            let ctrl = item.getComponent(ExpeditionProduceItemCtrl)
            ctrl.updateViewInfo(element[0], `${element[1] * times}${gdk.i18n.t("i18n:EXPEDITION_TIP13")}`)
        });
    }
}