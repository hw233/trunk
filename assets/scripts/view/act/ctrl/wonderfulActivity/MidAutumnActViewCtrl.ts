import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagEvent } from '../../../bag/enum/BagEvent';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';
import { Secretarea_store1Cfg, TipsCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-09-15 10:49:33 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-15 17:37:12
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wonderfulActivity/MidAutumnActViewCtrl")
export default class MidAutumnActViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    timeTxtLab: cc.Label = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Label)
    hasLab: cc.Label = null;

    @property(cc.Node)
    hasIcon: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    desNode: cc.Node = null;

    @property(cc.Node)
    rewardContent: cc.Node = null;

    @property(cc.Node)
    heroIcon: cc.Node = null;

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null;


    get roleModel(): RoleModel { return ModelManager.get(RoleModel) }
    get activityModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    onEnable() {
        GlobalUtil.setLocal('firstInMidAutumn', TimerUtils.getZerohour(GlobalUtil.getServerTime() / 1000))
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        let cfg = ConfigManager.getItemByField(Secretarea_store1Cfg, "activity", 135)
        GlobalUtil.setSpriteIcon(this.node, this.hasIcon, GlobalUtil.getIconById(cfg.money_cost[0]))

        this._updateBagItem()
        this._updateContentDes()
        this._updateRewardContent()
        this._updateTime()
        gdk.Timer.loop(1000, this, this._updateTime)
        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateBagItem, this)

    }

    onDisable() {
        gdk.Timer.clear(this, this._updateTime)
        gdk.e.targetOff(this)
    }

    _updateBagItem() {
        let cfg = ConfigManager.getItemByField(Secretarea_store1Cfg, "activity", 135)
        GlobalUtil.setSpriteIcon(this.node, this.hasIcon, GlobalUtil.getIconById(cfg.money_cost[0]))
        this.hasLab.string = `${BagUtils.getItemNumById(cfg.money_cost[0])}`
    }

    _updateTime() {
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let endTime = Math.floor(ActUtil.getActEndTime(134) / 1000)
        let leftTime = endTime - curTime
        if (leftTime > 0) {
            this.timeTxtLab.string = `${gdk.i18n.t("i18n:MAGIC_EXCHANGE_TIP1")}`
            this.timeLab.string = `${TimerUtils.format1(leftTime)}`
        } else {
            this.timeTxtLab.string = `${gdk.i18n.t("i18n:MAGIC_EXCHANGE_TIP2")}`
            let c_endTime = Math.floor(ActUtil.getActEndTime(135) / 1000)
            let chargeLeftTime = c_endTime - curTime
            this.timeLab.string = `${TimerUtils.format1(chargeLeftTime)}`
        }
    }

    _updateContentDes() {
        this.content.removeAllChildren()
        let tipCfg = ConfigManager.getItemById(TipsCfg, 159)
        let descArr = (tipCfg.desc21 as String).split("<br>")
        for (let i = 0; i < descArr.length; i++) {
            if (descArr[i]) {
                let desNode = cc.instantiate(this.desNode)
                desNode.x = 0
                desNode.active = true
                let des = desNode.getChildByName("desLab").getComponent(cc.RichText)
                des.string = `${descArr[i]}`
                this.content.addChild(desNode)
            }

        }
    }

    _updateRewardContent() {
        let actCfg = ActUtil.getCfgByActId(135)
        let storeCfg = ConfigManager.getItemByField(Secretarea_store1Cfg, "activity", 135, { reward_type: actCfg.reward_type })
        let rewards = storeCfg.rewards
        // GlobalUtil.setSpriteIcon(this.node, this.heroIcon, `view/act/texture/wonderfulActivitys/magicStore/icon/${storeCfg.main_hero}`)
        this.rewardContent.removeAllChildren()
        for (let i = 0; i < rewards.length; i++) {
            let item = cc.instantiate(this.rewardItem)
            this.rewardContent.addChild(item)
            let ctrl = item.getComponent(UiSlotItem)
            ctrl.updateItemInfo(rewards[i][0], rewards[i][1])
            ctrl.itemInfo = {
                series: null,
                itemId: rewards[i][0],
                itemNum: rewards[i][1],
                type: BagUtils.getItemTypeById(rewards[i][0]),
                extInfo: null,
            }
        }
    }

    openMagicStore() {
        gdk.panel.open(PanelId.MidAutumnStoreView)
    }
}
