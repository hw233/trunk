import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel, { CopyEventId } from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem, BagType } from '../../../../common/models/BagModel';
import {
    Copy_stageCfg,
    Hero_careerCfg,
    HeroCfg,
    Item_equipCfg,
    Item_rubyCfg
    } from '../../../../a/config';


/** 
 * @Description: 末日废墟每日奖励Item
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-02-03 18:16:45
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class EndRuinEveryDayTaskViewItemCtrl extends UiListItem {

    @property(cc.Label)
    taskName: cc.Label = null;

    @property(cc.Label)
    taskTips: cc.Label = null;

    @property(cc.Node)
    getNode: cc.Node = null;
    @property(cc.Node)
    overNode: cc.Node = null;
    @property(cc.Node)
    lockNode: cc.Node = null;
    @property(UiSlotItem)
    slots: UiSlotItem[] = [];
    @property(cc.Node)
    redNode: cc.Node = null;

    info: Copy_stageCfg = null;
    state: number = 0; //1可领取 2 已领取 3 未解锁
    times: number = 0;
    isChapterPlayer: boolean = false

    get model(): CopyModel { return ModelManager.get(CopyModel); }
    updateView() {
        this.info = this.data.cfg;
        this.state = this.data.state;
        this.times = this.data.times;
        this.isChapterPlayer = this.data.isChapterPlayer;
        this.taskTips.node.active = true;
        this.redNode.active = false;
        this.taskName.string = StringUtils.format(gdk.i18n.t("i18n:ENDRUIN_TIP1"), this.info.name)
        let str = this.state == 3 ? '' : StringUtils.format(gdk.i18n.t("i18n:ENDRUIN_TIP2"), this.info.name)
        this.taskTips.string = str
        if (this.state == 1) {
            this.getNode.active = true;
            this.overNode.active = false;
            this.lockNode.active = false;
            this.redNode.active = this.times > 0;
            let temState: 0 | 1 = this.times > 0 ? 0 : 1;
            GlobalUtil.setAllNodeGray(this.getNode, temState);

        } else if (this.state == 2) {
            this.getNode.active = false;
            this.overNode.active = true;
            this.lockNode.active = false;
        } else {
            this.taskTips.node.active = false;
            this.getNode.active = false;
            this.overNode.active = false;
            this.lockNode.active = true;
        }

        this._updateAwardInfo(this.info)

    }

    _updateAwardInfo(cfg: Copy_stageCfg) {

        let rewards: number[][] = cfg.sweep;
        // if (this.isChapterPlayer) {
        //     let temCfg = ConfigManager.getItemByField(Copy_ruin_defendCfg, 'chapter', cfg.prize)
        //     rewards = rewards.concat(temCfg.reward)
        // }
        for (let i = 0; i < this.slots.length; i++) {
            let slot = this.slots[i]
            let reward = rewards[i]
            if (reward) {
                slot.node.active = true
                let itemId = rewards[i][0]
                let num = rewards[i][1]
                slot.updateItemInfo(itemId, num)
                slot.onClick.offAll()
                let itemType = BagUtils.getItemTypeById(itemId)
                if (itemType == BagType.EQUIP) {
                    let cfg = ConfigManager.getItemById(Item_equipCfg, itemId)
                    slot.updateStar(cfg.star)
                } else if (itemType == BagType.JEWEL) {
                    let cfg = ConfigManager.getItemById(Item_rubyCfg, itemId)
                    slot.updateStar(cfg.level)
                    let quality = Math.min(cfg.level, 6)
                    slot.updateQuality(quality)
                } else if (itemType == BagType.HERO) {
                    let cfg = ConfigManager.getItemById(HeroCfg, itemId)
                    let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", cfg.career_id)
                    slot.updateCareer(careerCfg.career_type)
                }
                let item: BagItem = {
                    series: itemId,
                    itemId: itemId,
                    itemNum: num,
                    type: itemType,
                    extInfo: null
                }
                slot.itemInfo = item
            } else {
                slot.itemInfo = null
                slot.node.active = false
            }
        }

    }

    getNodeClicl() {
        if (this.times > 0) {
            NetManager.send(new icmsg.RuinRaidsReq(), (resp: icmsg.RuinRaidsRsp) => {
                this.model.endRuinStateData.raids = resp.raids;
                this.model.endRuinStateData.raidsStage = resp.stageId;
                GlobalUtil.openRewadrView(resp.rewards);
                this.data.state = 2;
                this.updateView();
                gdk.e.emit(CopyEventId.UPDATE_COPY_ENDRUIN_EVERYDAY_REWARD);
            }, this)
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ENDRUIN_TIP4"))
        }
    }

}
