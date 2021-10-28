import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import InstanceModel from '../model/InstanceModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Copy_stageCfg, CopyCfg, VipCfg } from '../../../a/config';
import { CopyType } from '../../../common/models/CopyModel';
import { InstanceEventId } from '../enum/InstanceEnumDef';

/**
 * @Description: 英雄副本列表子项
 * @Author: yaozu.hu
 * @Date: 2020-09-22 15:53:11
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:39:06
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/instance/SubInstanceRuneItemCtrl")
export default class SubInstanceRuneItemCtrl extends UiListItem {

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    listItem: cc.Prefab = null;

    @property(cc.Node)
    RaidBtn: cc.Node = null;

    @property(cc.Node)
    attackBtn: cc.Node = null;
    @property(cc.Node)
    lockNode: cc.Node = null;

    @property(cc.Node)
    tips: cc.Node = null;

    @property(cc.Label)
    stageNum: cc.Label = null;

    @property(cc.Prefab)
    effectPre: cc.Prefab = null;
    @property(cc.Node)
    effectNode: cc.Node = null;
    @property(cc.Node)
    monsterProNode: cc.Node = null;
    @property(cc.Node)
    lockMask: cc.Node = null;
    @property(cc.Sprite)
    monsterPro: cc.Sprite = null;
    @property(cc.Label)
    monsterProNum: cc.Label = null;

    @property(cc.Node)
    redNode: cc.Node = null;

    @property(cc.Label)
    costNum: cc.Label = null;
    @property(cc.Node)
    costIcon: cc.Node = null;

    lock = false;
    private info: { curStageId: number, stageData: Copy_stageCfg, raidNum: number, maxMonsterNum: number, vipNum: number }
    get model() { return ModelManager.get(InstanceModel); }

    updateView() {
        this.info = this.data;
        this.RaidBtn.active = false;
        this.attackBtn.active = false;
        this.lockNode.active = false;
        this.tips.active = false;
        this.lockMask.active = false;
        this.monsterProNode.active = false;
        this.redNode.active = false;
        GlobalUtil.setGrayState(this.lockNode, 1);
        this.lock = false;
        let state = this.info.stageData.id < this.info.curStageId;
        let attack = this.info.stageData.id == this.info.curStageId;
        if (state) {
            this.RaidBtn.active = true;
            this.costIcon.active = this.info.raidNum <= this.info.vipNum && this.info.vipNum > 0
            this.costNum.node.active = this.info.raidNum <= this.info.vipNum && this.info.vipNum > 0
            let copyCfg = ConfigManager.getItem(CopyCfg, { 'copy_id': CopyType.Rune })
            let quickCost = copyCfg.quick_cost;
            this.costNum.string = quickCost[1] + ''
            let state: 0 | 1 = this.info.raidNum > 0 ? 0 : 1;
            GlobalUtil.setAllNodeGray(this.RaidBtn, state)
        } else if (attack) {
            this.attackBtn.active = true;
            this.monsterProNode.active = true;
            let pro = Math.floor(this.info.maxMonsterNum / this.info.stageData.monsters * 100)
            this.monsterPro.fillRange = pro / 100;
            this.monsterProNum.string = pro + '%';
            //红点显示
            this.redNode.active = this.info.raidNum > 0 && !this.model.runeEnterCopy
            // this.tips.active = true;
            // let tipLabel = this.tips.getComponent(cc.Label);
            //tipLabel.string = '挑战不消耗次数'
            GuideUtil.bindGuideNode(13000, this.attackBtn);
            if (this.model.runeMonsterNext) {
                this.model.runeMonsterNext = false;
                gdk.Timer.once(800, this, () => {
                    let effect = cc.instantiate(this.effectPre);
                    effect.setParent(this.effectNode);
                })
            }

        } else {
            this.lockMask.active = true;
            this.lockNode.active = true;
            this.tips.active = true;
            let tipLabel = this.tips.getComponent(cc.Label);
            tipLabel.string = gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP1")//'前置关卡100%通关后开启'
            this.lock = true;
        }
        this.stageNum.string = (this.info.stageData.id % 1000) + '';

        this.content.removeAllChildren();
        let itemIDs: number[] = [];
        let cfg = this.info.stageData
        for (let i = 1; i <= 4; i++) {
            if (cc.js.isNumber(cfg['showitem_' + i]) && cfg['showitem_' + i] > 0) {
                itemIDs.push(cfg['showitem_' + i]);
            }
        }
        //itemIDs = this.info.stageData.sweep//this.info.stageData.id <= this.info.curStageId ? this.info.stageData.sweep : this.info.stageData.first_reward
        for (let i = 0; i < itemIDs.length; i++) {
            let temp: number = itemIDs[i]//BagUtils.getConfigById(itemIDs[i][0])
            //if (temp != null) {
            let node = cc.instantiate(this.listItem)
            this.content.addChild(node);
            let slot: UiSlotItem = node.getChildByName("UiSlotItem").getComponent(UiSlotItem) //.getChildByName('nameLab').getComponent(cc.Label).string = temp.name + '';
            slot.updateItemInfo(temp);
            let first = node.getChildByName("first")
            first.active = !state;//this.info.stageData.id > this.info.curStageId;
            slot.itemInfo = {
                series: temp,
                itemId: temp,
                itemNum: 1,
                type: BagUtils.getItemTypeById(temp),
                extInfo: null,
            }
            //}
        }
    }

    onClick(e: cc.Event.EventTouch, param: string): void {

        //检测是否开启
        if (this.lock) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP2"))
            return;
        }

        if (this.info.raidNum <= 0) {
            //gdk.gui.showMessage('今日次数已经用完')
            let nextCfg = ConfigManager.getItem(VipCfg, (item) => {
                if (cc.js.isNumber(item.vip10) && item.vip10 > this.info.vipNum) {
                    return true;
                }
                return false;
            })
            if (nextCfg) {
                let str = StringUtils.format(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP3"), nextCfg.level)
                gdk.gui.showMessage(str);
                return;
            }
            gdk.gui.showMessage(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP4"))
            return;
        }

        //设置最后进入记录
        let type = this.info.stageData.copy_id + '';
        let instanceM = ModelManager.get(InstanceModel);
        if (instanceM) {
            instanceM.instanceFailStage[type] = this.info.stageData.id
        }

        this.model.runeEnterCopy = true;
        //this.model.heroCopyCurIndex = this.info.curIndex;

        if (this.info.stageData.type_pk == 'pvp') {
            JumpUtils.openPvpCopyScene(this.info.stageData);
        } else {
            JumpUtils.openInstance(this.info.stageData.id);
        }
    }

    //扫荡按钮点击事件
    raidsClick() {

        if (this.info.raidNum > 0) {
            let msg = new icmsg.DungeonRuneRaidReq();
            msg.stageId = this.info.stageData.id
            NetManager.send(msg, (rsp: icmsg.DungeonRuneRaidRsp) => {
                GlobalUtil.openRewadrView(rsp.rewards);
                // if (this.model.heroCopySweepTimes.length > this.info.curIndex) {
                //     this.model.heroCopySweepTimes[this.info.curIndex] -= 1;
                // } else {
                //     this.model.heroCopySweepTimes[this.info.curIndex] = 0;
                // }
                let num = this.model.runeInfo.availableTimes - 1;
                this.model.runeInfo.availableTimes = Math.max(0, num);
                gdk.e.emit(InstanceEventId.RSP_RUNECOPY_SWEEP_REFRESH)
            }, this);
        } else {
            let nextCfg = ConfigManager.getItem(VipCfg, (item) => {
                if (cc.js.isNumber(item.vip10) && item.vip10 > this.info.vipNum) {
                    return true;
                }
                return false;
            })
            if (nextCfg) {
                let str = StringUtils.format(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP5"), nextCfg.level)
                gdk.gui.showMessage(str);
                return;
            }
            gdk.gui.showMessage(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP6"))
            //gdk.gui.showMessage('已达到今日可扫荡次数上限');
        }

    }
}
