import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import MineModel from '../../model/MineModel';
import MineUtil from '../../util/MineUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import PveGeneralModel from '../../../pve/model/PveGeneralModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Activitycave_stageCfg, Activitycave_tansuoCfg } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { BagItem } from '../../../../common/models/BagModel';

/** 
 * @Description: 矿洞大作战 
 * @Author:yaozu.hu yaozu
 * @Date: 2020-08-04 11:29:25
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:34:06
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/mineCopy/MineCopyViewCtrl")
export default class MineCopyViewItemCtrl extends UiListItem {

    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Node)
    tzNode: cc.Node = null;
    @property(cc.Node)
    tansuoState: cc.Node = null
    @property(cc.Node)
    tansuoState1: cc.Node = null //探索中
    @property(cc.Node)
    tansuoBtn: cc.Node = null;
    @property(cc.Label)
    tansuoTime: cc.Label = null;    //剩余探索时间
    @property(cc.Node)
    tansuoEnd: cc.Node = null;
    @property(cc.Node)
    rewardList: cc.Node = null;
    @property(cc.Prefab)
    rewardItemPre: cc.Prefab = null;
    @property(cc.Node)
    actionStateNode: cc.Node = null;
    @property(cc.Node)
    actionBtn: cc.Node = null;      //挑战按钮
    @property(cc.Label)
    jinduLb: cc.Label = null;       //挑战进度

    @property([cc.Node])
    stageList: cc.Node[] = [];
    @property([cc.Node])
    lineList: cc.Node[] = [];
    @property(cc.Node)
    curStage: cc.Node = null;
    @property(sp.Skeleton)
    player: sp.Skeleton = null;
    @property(cc.Label)
    prizeName: cc.Label = null;
    @property(cc.Label)
    openTime: cc.Label = null;
    @property(cc.Node)
    tansuoRed: cc.Node = null;

    cfgs: Activitycave_stageCfg[];

    curStageId: number;
    prize: number = 0;
    mineModel: MineModel;

    inTansuoEnd: boolean = false;
    tansuoTimeNum: number = 0;
    onEnable() {
        gdk.e.on(ActivityEventId.ACTIVITY_MINE_TANSUOUPHERO, this._tansuoUpHero, this)
    }

    onDisable() {
        gdk.e.off(ActivityEventId.ACTIVITY_MINE_TANSUOUPHERO, this._tansuoUpHero, this)
    }

    _tansuoUpHero(e) {
        // if (this.prize == e.data) {
        //     this.updateView();
        // }
        this.updateView();
    }

    update(dt: number) {
        if (this.tansuoTimeNum > 0) {

            this.tansuoTime.string = gdk.i18n.t("i18n:MINECOPY_TIME_TIP1") + `${TimerUtils.format2(this.tansuoTimeNum)}`
            this.tansuoTimeNum -= dt;
            if (this.tansuoTimeNum <= 0) {
                this.updateView();
            }
        }
    }

    updateView() {
        this.mineModel = ModelManager.get(MineModel)
        //设置梯子位置
        if (this.data.isMax) {
            this.tzNode.active = false;
        } else {
            this.tzNode.active = true;
            let num = this.data.index % 2 == 0 ? -1 : 1;
            this.tzNode.setPosition(cc.v2(num * 135, 83))
        }

        this.cfgs = this.data.cfgs;
        this.curStageId = this.data.curStageId;
        //设置状态
        let lastCfg = this.cfgs[this.cfgs.length - 1];
        this.prize = lastCfg.prize;
        let curPrize = MineUtil.getCurStagePrizeClearance();
        if (this.curStageId < this.cfgs[0].id && curPrize == this.prize && !this.data.islock) {
            this.tansuoState.active = false;
            this.actionStateNode.active = true;
            this.prizeName.node.active = false;
            this.openTime.node.active = false;
            this.curStageId = this.cfgs[0].id - 100;
            GlobalUtil.setGrayState(this.bg, 0);
            this.getActionState();
            return;
        }
        if (this.data.islock || this.curStageId < this.cfgs[0].id) {

            this.tansuoState.active = false;
            this.actionStateNode.active = false;
            this.prizeName.node.active = true;
            this.openTime.node.active = true;
            this.prizeName.string = lastCfg.name.split('·')[1];
            if (this.data.islock) {
                this.openTime.string = this.data.resDay > 0 ? StringUtils.format(gdk.i18n.t("i18n:MINECOPY_TIME_TIP3"), this.data.resDay) : gdk.i18n.t("i18n:MINECOPY_TIME_TIP4")//`${this.data.resDay}天后开启` : '明天开启'
            } else {
                this.openTime.string = gdk.i18n.t("i18n:MINECOPY_TIME_TIP5")
            }
            GlobalUtil.setGrayState(this.bg, 1);
            // let temcfg = ConfigManager.getItemById(Activitycave_stageCfg, this.curStageId);
            // let state: 0 | 1 = 1;
            // if (temcfg && lastCfg.prize - temcfg.prize == 1) {
            //     state = 0;
            // }
            GlobalUtil.setGrayState(this.tzNode, 1);
            return;
        } else {
            this.prizeName.node.active = false;
            this.openTime.node.active = false;
            GlobalUtil.setGrayState(this.bg, 0);
            GlobalUtil.setGrayState(this.tzNode, 0);
        }


        if (this.curStageId >= lastCfg.id) {
            //已经通关章节，可以探索
            this.tansuoState.active = true;
            this.actionStateNode.active = false;
            this.setTansuoState(lastCfg.prize);
        } else if (this.curStageId < this.cfgs[0].id) {
            this.tansuoState.active = false;
            this.actionStateNode.active = true;
            this.player.node.active = false;
            this.curStage.active = false;
        } else {
            this.tansuoState.active = false;
            this.actionStateNode.active = true;
            //this.player.node.active = true;
            //设置指挥官模型
            this.getActionState();
        }

    }

    //探索状态
    setTansuoState(prizeId: number) {

        //显示奖励物品
        this.rewardList.removeAllChildren();
        let temCfg = ConfigManager.getItemById(Activitycave_tansuoCfg, prizeId)
        if (temCfg) {
            for (let i = 1; i <= 4; i++) {
                if (typeof (temCfg['reward' + i]) == "object") {
                    let node = cc.instantiate(this.rewardItemPre);

                    let slot: UiSlotItem = node.getChildByName('UiSlotItem').getComponent(UiSlotItem);
                    let itemId = temCfg['reward' + i][0];
                    let num = temCfg['reward' + i][1]
                    slot.updateItemInfo(itemId, num)
                    node.setParent(this.rewardList);
                    let item: BagItem = {
                        series: itemId,
                        itemId: itemId,
                        itemNum: 1,
                        type: BagUtils.getItemTypeById(itemId),
                        extInfo: null
                    }
                    slot.itemInfo = item
                }
            }
        }
        let state = MineUtil.getCurPrizeTansuoState(prizeId);
        this.tansuoTimeNum = 0;
        if (state.tansuoState) {
            this.tansuoBtn.active = false;
            let cfg = ConfigManager.getItemById(Activitycave_tansuoCfg, prizeId);
            let endTime = state.startTime + cfg.cost * 60;
            let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
            if (nowTime >= endTime) {
                this.tansuoEnd.active = true;
                this.tansuoTime.node.parent.active = false;
                this.tansuoState1.active = false;
            } else {
                this.tansuoState1.active = true;
                this.tansuoEnd.active = false;
                this.tansuoTime.node.parent.active = true;
                this.tansuoTime.string = gdk.i18n.t("i18n:MINECOPY_TIME_TIP1") + `${TimerUtils.format2(endTime - nowTime)}`
                this.tansuoTimeNum = endTime - nowTime;
            }

        } else {
            this.tansuoBtn.active = true;
            this.tansuoState1.active = false;
            this.tansuoEnd.active = false;

            //判断探索红点
            this.tansuoRed.active = this.getCanTansuo();

        }
    }

    //探索副本状态
    getActionState() {
        this.curStage.active = false;
        this.player.node.active = false;
        for (let i = 0; i < 15; i++) {
            let node = this.stageList[i]
            let lineNode = i > 0 ? this.lineList[i - 1] : null;
            if (i < this.cfgs.length) {
                let cfg = this.cfgs[i]
                node.active = true;
                if (cfg.id > this.curStageId + 100) {
                    GlobalUtil.setGrayState(node, 1)
                    if (lineNode) {
                        GlobalUtil.setGrayState(lineNode, 1)
                    }
                } else {
                    GlobalUtil.setGrayState(node, 0)
                    if (lineNode) {
                        GlobalUtil.setGrayState(lineNode, 0)
                    }
                }
                if (this.curStageId + 100 == cfg.id) {
                    this.curStage.setPosition(node.getPos())
                    this.player.node.setPosition(node.getPos())
                    this.curStage.active = true;
                    this.player.node.active = true;
                    //设置指挥官模型
                    this.player.node.scaleX = Math.abs(this.player.node.scaleX)
                    if (4 < i && i < 10) {
                        this.player.node.scaleX = -Math.abs(this.player.node.scaleX)
                    }
                    // let general = ConfigManager.getItemById(General_skinCfg, 1)
                    // if (!general) {
                    //     CC_DEBUG && cc.log('---------------------英雄副本的General_skinCfgID有问题，请检查-----' + 1)
                    //     return;
                    // }
                    let skin = ModelManager.get(PveGeneralModel).skin;
                    this.jinduLb.string = Math.max(0, Math.floor(i / this.cfgs.length * 100)) + '%'
                    let url: string = StringUtils.format("spine/hero/{0}/0.5/{0}", skin);
                    GlobalUtil.setSpineData(this.node, this.player, url, true, 'stand_d', true);
                }
            } else {
                node.active = false;
                if (lineNode) lineNode.active = false;
            }
        }
    }

    //挑战按钮点击事件
    onActionBtnClick() {
        let stageId = this.curStageId + 100;
        //进入副本
        let msg = new icmsg.ActivityCaveEnterReq();
        msg.stageId = stageId;
        NetManager.send(msg, (data: icmsg.ActivityCaveEnterRsp) => {
            //this.footHoldModel.energy = data.energy

        });
        JumpUtils.openInstance(stageId);
    }


    getCanTansuo(): boolean {
        let nextCfg = ConfigManager.getItem(Activitycave_stageCfg, (item: Activitycave_stageCfg) => {
            if (item.id > this.curStageId) {
                return true;
            }
            return false;
        })
        if (!nextCfg) {
            nextCfg = ConfigManager.getItemById(Activitycave_stageCfg, this.curStageId)
        }
        let num = this.mineModel.curCaveSstate.buyTeam;
        if (nextCfg) {
            num += nextCfg.team;
        }
        let curNum = this.mineModel.curCaveSstate.team.length;
        return num > curNum
    }

    //探索按钮点击事件
    onTansuoBtnClick() {
        let canTansuo = this.getCanTansuo();

        if (canTansuo) {
            //打开探索英雄设置界面
            gdk.panel.setArgs(PanelId.MineTansuoSendView, { id: this.prize });
            gdk.panel.open(PanelId.MineTansuoSendView);
        } else {
            //提示当前探索队伍达到上限了
            gdk.gui.showMessage(gdk.i18n.t("i18n:MINECOPY_TIP1"))
        }
    }
    //探索结束按钮点击事件
    onTansuoEndBtnClick() {
        //发送探索结束消息
        if (!this.inTansuoEnd) {
            this.inTansuoEnd = true;
            let msg = new icmsg.ActivityCaveEndExploreReq();
            msg.chapterId = this.prize;
            NetManager.send(msg, (rsp: icmsg.ActivityCaveEndExploreRsp) => {
                this.inTansuoEnd = false;
                GlobalUtil.openRewadrView(rsp.rewards);
                let tem = this.mineModel.curCaveSstate.team;
                for (let i = tem.length - 1; i >= 0; i--) {
                    if (tem[i].chapterId == this.prize) {
                        tem.splice(i, 1);
                        break;
                    }
                }
                gdk.e.emit(ActivityEventId.ACTIVITY_MINE_TANSUOUPHERO, this.prize);
            })
        }

    }
}
