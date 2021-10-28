import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RelicModel from '../model/RelicModel';
import RelicRecordCtrl from './RelicRecordCtrl';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Relic_mapCfg, Relic_pointCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-31 17:14:08 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicRewardViewCtrl")
export default class RelicRewardViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Label)
    defTime: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    recordNode: cc.Node = null;

    @property(cc.Node)
    sendTksFlag: cc.Node = null;

    resp: icmsg.RelicQueryRewardsRsp;
    isSendTks: boolean = false;;
    onEnable() {
        this.resp = this.args[0];
        let pointCfg = ConfigManager.getItemById(Relic_pointCfg, this.resp.pointType);
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/guild/texture/icon/${pointCfg.skin}`);
        this.nameLab.string = pointCfg.des;
        this.timeLab.string = TimerUtils.format4(pointCfg.time);
        this.defTime.string = `${this.resp.fightCount}${gdk.i18n.t("i18n:RELIC_TIP27")}`;
        this.sendTksFlag.parent.active = this.resp.mapType == 2;
        if (this.sendTksFlag.parent.active) {
            this.sendTksFlag.active = this.isSendTks;
        }
        this.content.removeAllChildren();
        this.resp.rewards.forEach(reward => {
            let item = cc.instantiate(this.slotPrefab);
            item.parent = this.content;
            let ctrl = item.getComponent(UiSlotItem);
            ctrl.updateItemInfo(reward.typeId, reward.num);
            ctrl.itemInfo = {
                series: null,
                itemId: reward.typeId,
                itemNum: reward.num,
                type: BagUtils.getItemTypeById(reward.typeId),
                extInfo: null
            }
        });
        if (this.resp.rewards.length < 5) {
            this.scrollView.enabled = false;
            this.scrollView.node.width = this.content.width;
        }
        else {
            this.scrollView.enabled = true;
            this.scrollView.node.width = 600;
        }
        let mapType = ConfigManager.getItemById(Relic_mapCfg, ModelManager.get(RelicModel).mapId).mapType;
        this.recordNode.getComponent(RelicRecordCtrl).setReward(this.resp.rewards);
        this.recordNode.getComponent(RelicRecordCtrl).init(mapType, 0, this.resp.recordNum);
    }

    onDisable() {
    }

    onSendTksBtnClick() {
        this.isSendTks = !this.isSendTks;
        this.sendTksFlag.active = this.isSendTks;
    }

    onGetRewardBtnClick() {
        let req = new icmsg.RelicFetchRewardsReq();
        req.thankHelpers = this.isSendTks;
        NetManager.send(req, (resp: icmsg.RelicFetchRewardsRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            GlobalUtil.openRewadrView(resp.rewards);
            this.close();
        });
    }
}
