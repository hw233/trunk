import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import TaskModel from '../../../task/model/TaskModel';
import TaskUtil from '../../../task/util/TaskUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiProgress from '../../../../common/widgets/UiProgress';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem, BagType } from '../../../../common/models/BagModel';
import {
    Carnival_dailyCfg,
    Carnival_globalCfg,
    Carnival_ultimateCfg,
    Hero_careerCfg,
    HeroCfg,
    Item_equipCfg,
    Item_rubyCfg
    } from '../../../../a/config';

/**
 * @Description: 跨服任务Item
 * @Author: yaozu.hu
 * @Date: 2020-12-22 12:58:41
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-02-25 17:00:13
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class CServerTaskItemCtrl extends UiListItem {


    @property(cc.Sprite)
    bgSp: cc.Sprite = null;
    @property(cc.Label)
    titleLab: cc.Label = null;

    @property(cc.Label)
    descLab: cc.Label = null;

    @property(cc.Button)
    goBtn: cc.Button = null;
    @property(cc.Button)
    getBtn: cc.Button = null;

    @property(cc.Node)
    geted: cc.Node = null;

    @property(UiSlotItem)
    slots: UiSlotItem[] = [];

    @property(UiProgress)
    pro: UiProgress = null;

    @property(cc.Label)
    proLab: cc.Label = null;

    // @property(cc.Label)
    // numLab: cc.Label = null;

    // @property(cc.Node)
    // titleIcon1: cc.Node = null;

    // @property(cc.Node)
    // titleIcon2: cc.Node = null;

    // @property(cc.Layout)
    // layout: cc.Layout = null;

    // @property(cc.Label)
    // activeLab: cc.Label = null;

    @property(cc.Node)
    mask: cc.Node = null;

    // info: TaskItemType = null
    goId: number = 0

    get model(): TaskModel { return ModelManager.get(TaskModel); }

    //info: any;
    cfg: Carnival_ultimateCfg | Carnival_dailyCfg;
    curType: number = 0;
    bgStrs: string[] = ['view/act/texture/cServer/kfkh_renwuxinxilanse', 'view/act/texture/cServer/kfkh_renwuxinxihuangse']
    state: number = 0;  //0 进行中  1 可领取 2 已领取 3 未开放
    updateView() {
        //this.info = this.data.data;
        this.cfg = this.data.cfg;
        this.curType = this.data.type;
        this.state = this.data.state;
        this.goId = this.cfg["forward"]
        let bgPath = this.curType == 0 ? this.bgStrs[0] : this.bgStrs[1]
        GlobalUtil.setSpriteIcon(this.node, this.bgSp, bgPath);
        this.titleLab.string = `${this.cfg["desc"] ? this.cfg["desc"] : 0}`

        this.pro.node.active = this.state == 0;
        let proTab = TaskUtil.getTaskFinishNum(this.cfg.id)
        let cur = proTab[0]
        let max = proTab[1]
        this.proLab.string = `${cur}/${max}`
        let per = cur / max
        per = Math.min(per, 1)
        this.pro.progress = per

        this.goBtn.node.active = this.state == 0;
        this.getBtn.node.active = this.state == 1;
        this.geted.active = this.state == 2;
        this.descLab.node.active = this.state == 3;
        this.mask.active = this.state == 2;
        this.descLab.string = this.cfg.unlock

        this._updateAwardInfo()

    }

    onDisable() {
        NetManager.targetOff(this)
    }

    _updateAwardInfo() {
        let temReward = [[]]
        let itemId = ConfigManager.getItemByField(Carnival_globalCfg, 'key', 'score_item').value[0];
        temReward[0][0] = itemId;
        temReward[0][1] = this.cfg.score;
        let rewards = temReward.concat(this.cfg.rewards)
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

    /**做任务 */
    doTask() {
        if (this.goId && this.goId > 0) {
            gdk.panel.hide(PanelId.CServerActivityMainView);
            JumpUtils.openView(this.goId)
            // if (this.goId == 2300 && gdk.panel.isOpenOrOpening(PanelId.Task)) {
            //     gdk.panel.hide(PanelId.Task);
            // }
        }
    }

    /**领取任务奖励 */
    getAwards() {
        // this.storeModel.vipPreLv = ModelManager.get(RoleModel).vipLv
        //     this.storeModel.vipPreExp = ModelManager.get(RoleModel).vipExp

        let msg = new icmsg.MissionRewardReq();
        msg.kind = 1
        msg.type = this.curType == 0 ? 11 : 12;
        msg.id = this.cfg.id;
        NetManager.send(msg, (data: icmsg.MissionRewardRsp) => {
            //GlobalUtil.openRewadrView(data.list)
        }, this);

        // if (this.info.type == 1 || this.info.type == 2) {
        //     let slot = this.slots[0]
        //     let ctrl = slot.getComponent(DiamondFlyCtrl)
        //     let panel = gdk.panel.get(PanelId.Task)
        //     let pos = null
        //     if (panel) {
        //         let ctrl = panel.getComponent(TaskViewCtrl)
        //         pos = ctrl.flyPosNode.getPos()
        //     }
        //     ctrl.flyAction(pos)
        // }

    }

}
