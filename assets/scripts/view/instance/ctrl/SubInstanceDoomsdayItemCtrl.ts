import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import DoomsDayModel from '../model/DoomsDayModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import InstanceModel from '../model/InstanceModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Copy_stageCfg, VipCfg } from './../../../a/config';
import { InstanceEventId } from '../enum/InstanceEnumDef';

/**
 * @Description: 兄贵、女神副本关卡列表子项
 * @Author: yaozu.hu
 * @Date: 2019-11-15 16:34:45
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:38:20
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/instance/SubInstanceDoomsdayItemCtrl")
export default class SubInstanceDoomsdayItemCtrl extends UiListItem {

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.LabelOutline)
    nameLine: cc.LabelOutline = null;
    @property(cc.Prefab)
    listItem: cc.Prefab = null;

    @property(cc.Node)
    RaidBtn: cc.Node = null;

    @property(cc.Node)
    attackBtn: cc.Node = null;

    @property(cc.Label)
    btnLb: cc.Label = null;

    @property(cc.Label)
    powerLabel: cc.Label = null;

    @property(cc.Sprite)
    bg: cc.Sprite = null;
    @property(cc.Node)
    tuijian: cc.Node = null;
    @property(cc.Node)
    lockNode: cc.Node = null;

    @property(cc.Label)
    costNum: cc.Label = null;
    @property(cc.Node)
    costIcon: cc.Node = null;
    @property(cc.Label)
    needPower: cc.Label = null;

    @property(cc.Node)
    redNode: cc.Node = null;

    // @property(cc.Node)
    // replayButton: cc.Node = null;

    private info: { info: icmsg.DoomsDayInfo, power: number, stageData: Copy_stageCfg, allNum: number, freeNum: number, quickCost: number[], state: boolean };

    get roleModel(): RoleModel {
        return ModelManager.get(RoleModel);
    }
    get doomsDayModel() { return ModelManager.get(DoomsDayModel); }
    bgStrs: string[] = ['mrky_lv', 'mrky_lan', 'mrky_zi', 'mrky_huang', 'mrky_hong'];
    lock: boolean = false;
    lineColors: string[] = ['#346519', '#134a7e', '#5c2084', '#b55b12', '#9f1d11']
    updateView() {
        this.info = this.data;
        this.nameLabel.string = this.info.stageData.name;

        let path = 'view/instance/texture/view/' + this.bgStrs[this.info.stageData.quality - 1]
        GlobalUtil.setSpriteIcon(this.node, this.bg, path)
        this.nameLine.color = cc.color(this.lineColors[this.info.stageData.quality - 1])
        this.RaidBtn.active = false;
        this.attackBtn.active = false;
        this.powerLabel.string = StringUtils.format(gdk.i18n.t("i18n:INS_DOOMSDAY_ITEM_TIP1"), this.info.stageData.power)//'战力' + this.info.stageData.power + '开启'
        this.powerLabel.node.active = false;
        this.lockNode.active = false;
        this.tuijian.active = false;
        this.needPower.node.active = this.info.state;
        this.needPower.string = StringUtils.format(gdk.i18n.t("i18n:INS_DOOMSDAY_ITEM_TIP2"), this.info.stageData.power - this.info.power)//'(还差' + (this.info.stageData.power - this.info.power) + ')'
        this.lock = false;
        this.redNode.active = false;
        if (this.info.stageData.id <= this.info.info.stageId) {
            this.RaidBtn.active = true;
            this.costIcon.active = this.info.info.num >= this.info.freeNum && this.info.info.subType < 46
            this.costNum.node.active = this.info.info.num >= this.info.freeNum && this.info.info.subType < 46
            this.costNum.string = this.info.quickCost[1] + ''
            if (this.info.stageData.id == this.info.info.stageId) {
                let cfg = ConfigManager.getItemById(Copy_stageCfg, this.info.info.stageId + 1);
                if (!cfg) {
                    this.tuijian.active = true;
                } else {
                    this.tuijian.active = cfg.power > this.info.power;
                }
            }
            let state: 0 | 1 = (this.info.info.subType >= 46 && this.info.info.num >= this.info.allNum) ? 1 : 0;
            GlobalUtil.setAllNodeGray(this.RaidBtn, state)
        } else if ((this.info.info.stageId == 0 && this.info.stageData.pre_condition == 0) || this.info.stageData.id == this.info.info.stageId + 1) {
            let lvLimit = cc.js.isNumber(this.info.stageData.player_lv) ? this.info.stageData.player_lv : 0;
            let canAttack = this.info.stageData.power <= this.info.power && (this.roleModel.level >= lvLimit)
            this.tuijian.active = canAttack;
            this.attackBtn.active = canAttack
            this.lockNode.active = !canAttack
            this.redNode.active = canAttack && this.doomsDayModel.enterStageIDs.indexOf(this.info.info.subType) < 0
            GlobalUtil.setGrayState(this.lockNode, 1);
            this.powerLabel.node.active = !canAttack;
            if (this.info.stageData.power <= this.info.power && this.roleModel.level < lvLimit) {
                this.powerLabel.string = StringUtils.format(gdk.i18n.t("i18n:INS_DOOMSDAY_ITEM_TIP3"), lvLimit)//'指挥官' + lvLimit + '级开启'
            }
            else {
                if (canAttack && this.info.info.num < this.info.freeNum) {
                    this.powerLabel.node.active = true;
                    this.powerLabel.string = gdk.i18n.t("i18n:INS_HERO_ITEM_TIP1")//'挑战不消耗次数';
                }
            }

            if (canAttack) {
                GuideUtil.bindGuideNode(5000, this.attackBtn);
            }
        } else {
            this.lockNode.active = true;
            GlobalUtil.setGrayState(this.lockNode, 1);
            this.lock = true;
            if (this.info.stageData.power <= this.info.power) {
                this.powerLabel.string = gdk.i18n.t("i18n:INS_HERO_ITEM_TIP2")//'通关前置关卡后开启'
            }
            this.powerLabel.node.active = true;
        }

        this.content.removeAllChildren();
        let itemIDs: any[][] = [];
        itemIDs = this.info.stageData.id <= this.info.info.stageId ? this.info.stageData.sweep : this.info.stageData.first_reward
        // itemIDs.push(this.info.stageData.showitem_1);
        // itemIDs.push(this.info.stageData.showitem_2);
        // itemIDs.push(this.info.stageData.showitem_3);
        // itemIDs.push(this.info.stageData.showitem_4);

        // 奖励数据
        for (let i = 0; i < itemIDs.length; i++) {
            let temp: number[] = itemIDs[i]//BagUtils.getConfigById(itemIDs[i][0])
            //if (temp != null) {
            let node = cc.instantiate(this.listItem)
            this.content.addChild(node);
            let slot: UiSlotItem = node.getChildByName("UiSlotItem").getComponent(UiSlotItem) //.getChildByName('nameLab').getComponent(cc.Label).string = temp.name + '';
            let first = node.getChildByName("first")
            first.active = this.info.stageData.id > this.info.info.stageId;
            slot.updateItemInfo(temp[0], temp[1]);
            slot.itemInfo = {
                series: temp[0],
                itemId: temp[0],
                itemNum: 1,
                type: BagUtils.getItemTypeById(temp[0]),
                extInfo: null,
            }
            //}
        }

    }

    onClick(e: cc.Event.EventTouch, param: string): void {

        //检测是否开启
        if (this.lock) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP2"))//('请通关前一个关卡')
            return;
        }
        if (this.info.stageData.power > this.info.power) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:INS_DOOMSDAY_ITEM_TIP4"))//('战力不足，请先提升战力')
            return;
        }
        if (cc.js.isNumber(this.info.stageData.player_lv) && this.info.stageData.player_lv > this.roleModel.level) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:INS_DOOMSDAY_ITEM_TIP5"))//('指挥官等级不足，请先提升指挥官等级')
            return;
        }
        // if (this.info.allNum <= this.info.info.num) {
        //     gdk.gui.showMessage('今日次数已经用完')
        //     return;
        // }

        //设置最后进入记录
        let type = this.info.stageData.copy_id + '';
        let instanceM = ModelManager.get(InstanceModel);
        if (instanceM) {
            instanceM.instanceFailStage[type] = this.info.stageData.id
        }

        let subTypes = [46, 47, 36, 37, 38];
        this.doomsDayModel.curIndex = subTypes.indexOf(this.info.info.subType);

        if (this.doomsDayModel.enterStageIDs.indexOf(this.info.info.subType) < 0) {
            this.doomsDayModel.enterStageIDs.push(this.info.info.subType)
        }
        if (this.info.stageData.type_pk == 'pvp') {
            // gdk.panel.setArgs(PanelId.InstancePVPReadyView, this.info.stageData, this.info.readyScene.node);
            // gdk.panel.open(PanelId.InstancePVPReadyView);
            // JumpUtils.openPanel({
            //     panelId: PanelId.InstancePVPReadyView,
            //     panelArgs: { args: this.info.stageData },
            // });

            JumpUtils.openPvpCopyScene(this.info.stageData);


        } else {
            // let msg = new DungeonEnterReq();
            // msg.stageId = this.info.stageData.id;
            // NetManager.send(msg)
            // gdk.panel.setArgs(PanelId.Instance, { instanceId: this.info.instanceId });
            JumpUtils.openInstance(this.info.stageData.id);
        }
    }

    //扫荡按钮点击事件
    raidsClick() {

        if (this.info.allNum <= this.info.info.num) {
            if (this.info.info.subType < 46) {
                let vipCfg = ConfigManager.getItemByField(VipCfg, "level", this.roleModel.vipLv);
                let vipNum = (vipCfg && cc.js.isNumber(vipCfg.vip7)) ? vipCfg.vip7 : 0;
                let nextCfg = ConfigManager.getItem(VipCfg, (item) => {
                    if (cc.js.isNumber(item.vip7) && item.vip7 > vipNum) {
                        return true;
                    }
                    return false;
                })
                if (nextCfg) {
                    gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP5"), nextCfg.level))//(`达到VIP${nextCfg.level}可提升扫荡次数`);
                } else {
                    gdk.gui.showMessage(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP6"))//('已达到今日可扫荡次数上限');
                }
            } else {
                gdk.gui.showMessage(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP6"));
            }
            return;
        }
        let cost = this.info.quickCost[1];
        let itemId = this.info.quickCost[0];
        if (this.info.info.num >= this.info.freeNum) {
            if (!GlobalUtil.checkMoneyEnough(cost, itemId, null, [PanelId.Instance])) {
                return
            }
        }
        let msg = new icmsg.DoomsDayRaidsReq();
        msg.stageId = this.info.stageData.id
        NetManager.send(msg, (rsp: icmsg.DoomsDayRaidsRsp) => {
            GlobalUtil.openRewadrView(rsp.rewards);
            this.doomsDayModel.doomsDayInfos.forEach(data => {
                if (data.subType == this.info.info.subType) {
                    data.num += 1;
                }
            })
            gdk.e.emit(InstanceEventId.RSP_DOOMSDAY_INFO_REFRESH)
        }, this);
        // GlobalUtil.openAskPanel({
        //     title: "提示",
        //     descText: `是否扫荡当前关卡：${this.info.stageData.name}?`,
        //     thisArg: this,
        //     sureText: "扫荡",
        //     sureCb: () => {

        //     },
        // });
    }

    // canFightHandle() {
    //     switch (this.info.instanceId) {
    //         case InstanceID.BRO_INST:
    //         case InstanceID.GOD_INST:
    //             return RedPointUtils.is_inst_2_3_can_fight(this.info.stageData.copy_id, this.info.stageData.id)
    //     }
    //     return false;
    // }

    // // 打开回放列表界面
    // openReplayList() {
    //     JumpUtils.openReplayListView(this.info.stageData.id);
    // }
}
