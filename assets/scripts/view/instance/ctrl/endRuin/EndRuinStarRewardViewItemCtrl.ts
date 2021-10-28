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
    Copy_ruin_rewardCfg,
    Hero_careerCfg,
    HeroCfg,
    Item_equipCfg,
    Item_rubyCfg
    } from '../../../../a/config';


/** 
 * @Description: 末日废墟星星奖励Item
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-01-26 19:21:19
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/endruin/EndRuinStarRewardViewItemCtrl")
export default class EndRuinStarRewardViewItemCtrl extends UiListItem {

    @property(cc.Label)
    taskName: cc.Label = null;

    @property(cc.Label)
    starNum: cc.Label = null;

    @property(cc.Node)
    goNode: cc.Node = null;
    @property(cc.Node)
    getNode: cc.Node = null;
    @property(cc.Node)
    overNode: cc.Node = null;
    @property(UiSlotItem)
    slots: UiSlotItem[] = [];

    chapterId: number = 0;
    state: number = 0; //1可领取 2 已领取 3 未解锁
    get model(): CopyModel { return ModelManager.get(CopyModel); }

    cfg: Copy_ruin_rewardCfg;
    curStarNum: number = 0;
    maxStarNum: number = 0;

    updateView() {
        this.cfg = this.data.cfg;
        this.chapterId = this.data.chapterId;
        this.curStarNum = this.data.curStarNum;
        this.state = this.data.state;
        //this.starNum.node.active = true;
        this.taskName.string = StringUtils.format(gdk.i18n.t("i18n:ENDRUIN_TIP6"), this.cfg.star)
        this.starNum.string = '(' + this.curStarNum + '/' + this.cfg.star + ')'
        if (this.state == 1) {
            this.getNode.active = true;
            this.goNode.active = false;
            this.overNode.active = false;
        } else if (this.state == 2) {
            this.getNode.active = false;
            this.goNode.active = false;
            this.overNode.active = true;
        } else {
            this.goNode.active = true;
            this.getNode.active = false;
            this.overNode.active = false;
        }
        this._updateAwardInfo(this.cfg)
    }

    _updateAwardInfo(cfg) {

        let rewards = cfg.reward
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

    getNodeClick() {
        let msg = new icmsg.RuinChapterRewardReq()
        msg.chapter = this.chapterId
        msg.star = this.cfg.star
        NetManager.send(msg, (resp: icmsg.RuinChapterRewardRsp) => {
            this.model.endRuinStateData.chapterReward = resp.chapterReward;
            GlobalUtil.openRewadrView(resp.rewards);
            this.data.state = 2;
            this.updateView();
            gdk.e.emit(CopyEventId.UPDATE_COPY_ENDRUIN_STAR_REWARD, this.chapterId);
        }, this)
    }


    goBtnClick() {
        gdk.e.emit(CopyEventId.CHANGE_COPY_ENDRUIN_CHAPTER, this.chapterId);
    }

}
