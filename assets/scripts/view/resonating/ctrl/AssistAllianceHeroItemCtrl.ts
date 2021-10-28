import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import ResonatingModel from '../model/ResonatingModel';
import ResonatingUtils from '../utils/ResonatingUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagType } from '../../../common/models/BagModel';
import { Hero_trammelCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-06 15:34:29 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/resonating/AssistAllianceHeroItemCtrl")
export default class AssistAllianceHeroItemCtrl extends cc.Component {
    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    @property(cc.Node)
    addBtn: cc.Node = null;

    @property(cc.Node)
    groupIcon: cc.Node = null;

    @property(cc.Node)
    qualityIcon: cc.Node = null;

    cfgs: Hero_trammelCfg[];
    idx: number;
    info: icmsg.AssistAlliance;
    get model(): ResonatingModel { return ModelManager.get(ResonatingModel); }
    onEnable() {
        NetManager.on(icmsg.AssistAllianceOnRsp.MsgType, (resp: icmsg.AssistAllianceOnRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            if (!this.cfgs || this.cfgs.length <= 0) return;
            if (resp.assistAlliance.allianceId == this.cfgs[0].trammel_id) {
                this.updateView([this.cfgs, this.idx]);
            }
        }, this);
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    updateView(data: [Hero_trammelCfg[], number]) {
        [this.cfgs, this.idx] = data;
        this.info = this.model.assistAllianceInfos[this.cfgs[0].trammel_id];
        let heroType = this.cfgs[0].trammel_hero[this.idx];
        this.slot.starNum = this.slot.group = 0;
        this.groupIcon.active = false;
        this.qualityIcon.active = false;
        if (BagUtils.getItemTypeById(heroType) == BagType.HERO) {
            this.slot.updateItemInfo(heroType);
        } else if (this.info && this.info.heroIds[this.idx] > 0) {
            this.slot.updateItemInfo(HeroUtils.getHeroInfoByHeroId(this.info.heroIds[this.idx]).typeId);
        } else {
            this.slot.itemId = -1;
            this.slot.updateItemIcon('icon/item/nlz_hero1');
            this.qualityIcon.active = true;
            this.groupIcon.active = true;
            GlobalUtil.setSpriteIcon(this.node, this.groupIcon, GlobalUtil.getGroupIcon(heroType, false));
        }
        if (this.info && this.info.heroIds[this.idx]) {
            let heroInfo = HeroUtils.getHeroInfoByHeroId(this.info.heroIds[this.idx]);
            this.addBtn.active = false;
            this.slot.updateStar(heroInfo.star);
            GlobalUtil.setAllNodeGray(this.slot.node, 0);
        }
        else {
            this.addBtn.active = true;
            this.slot.updateStar(0);
            GlobalUtil.setAllNodeGray(this.slot.node, 1);
        }
        this._updateRedpoint();
    }

    onClick() {
        gdk.panel.setArgs(PanelId.AssistAllianceSelectView, [this.cfgs[0].trammel_id, this.idx]);
        gdk.panel.open(PanelId.AssistAllianceSelectView);
    }

    _updateRedpoint() {
        if (this.info && this.info.heroIds[this.idx]) {
            this.redPoint.active = false;
        }
        else {
            this.redPoint.active = ResonatingUtils.getAllianceValid(this.cfgs[0].trammel_id);
        }
    }
}
