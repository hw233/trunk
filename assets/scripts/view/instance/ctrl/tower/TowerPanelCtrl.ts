import { Copy_stageCfg, GlobalCfg, ItemCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import { CopyType } from '../../../../common/models/CopyModel';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import PanelId from '../../../../configs/ids/PanelId';
import SdkTool from '../../../../sdk/SdkTool';
import ActivityModel from '../../../act/model/ActivityModel';
import ActUtil from '../../../act/util/ActUtil';
import { RankTypes } from '../../../rank/enum/RankEvent';
import { InstanceEventId, InstanceID } from '../../enum/InstanceEnumDef';
import TrialInfo from '../../trial/model/TrialInfo';

/**
 * @Description: 爬塔 无尽黑暗
 * @Author: luoyong
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-22 18:34:33
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/tower/TowerPanelCtrl")
export default class TowerPanelCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null;

    @property(cc.Button)
    btnSao: cc.Button = null
    @property(cc.Label)
    saoNum: cc.Label = null;
    @property(cc.Label)
    buyNum: cc.Label = null;
    @property(cc.Label)
    maxLab: cc.Label = null

    //----------------------------新试炼塔参数-----------------------------------
    @property(cc.Node)
    bg1: cc.Node = null;
    @property(cc.Node)
    activityNode: cc.Node = null;
    // @property(cc.Node)
    // rewardList: cc.Node = null;
    @property(cc.ScrollView)
    rewardScro: cc.ScrollView = null;
    @property(cc.Node)
    rewardContent: cc.Node = null;


    @property(cc.RichText)
    rankLb: cc.RichText = null;
    @property(cc.Node)
    timebg: cc.Node = null;
    @property(cc.Label)
    timeLb: cc.Label = null;
    @property(cc.Prefab)
    towerItem2: cc.Prefab = null;
    @property(cc.ScrollView)
    stageRewardScrollView: cc.ScrollView = null
    @property(cc.Node)
    stageRewardContent: cc.Node = null
    @property(cc.Prefab)
    towerRewardItem: cc.Prefab = null
    @property(cc.RichText)
    stageTips: cc.RichText = null;
    @property(cc.Node)
    redP: cc.Node = null;

    @property(cc.Node)
    jijinBtn: cc.Node = null;

    list: ListView = null
    stageRewardList: ListView = null;
    rewardList: ListView = null
    maxBuy: number = 0;
    payData: number[];

    //----------------------------新试炼塔参数-----------------------------------
    rankStr: string = gdk.i18n.t("i18n:TOWER_PANEL_TIP4");//'<outline color=#2a1100 width=2><color=#ffffff>你的全服排名 </c><color=#fcff00>@num</color><color=#ffffff> 名 </c></outline>'
    inActivity: boolean = false;
    activityTime: number = 0;
    dtTime: number = 0

    get model() { return ModelManager.get(TrialInfo); }//爬塔信息
    get roleModel() { return ModelManager.get(RoleModel); }
    get actModel() { return ModelManager.get(ActivityModel); }

    start() {
        if (JumpUtils.ifSysOpen(RedPointUtils.get_copy_open_lv(InstanceID.SPACE_INST), false)) {
            let n = "space_inst";
            GlobalUtil.setLocal(n, ModelManager.get(ServerModel).serverTime);
        }
    }

    onEnable() {
        // 不显示充值按钮
        if (!SdkTool.tool.can_charge) {
            [
                'down/bountyBtn',
            ].forEach(e => {
                let n = cc.find(e, this.node);
                if (n) {
                    n.active = false;
                }
            });
        }
        this.inActivity = false;
        if (!this.model.enterCopy) {
            this.model.enterCopy = true
        }

        this.jijinBtn.active = JumpUtils.ifSysOpen(2958)
        this.payData = ConfigManager.getItemByField(GlobalCfg, 'key', 'tower_sweep_pay_number').value;
        this.maxBuy = this.payData[0]
        this._updateListView()
        this._updateStageRewardListView();
        gdk.e.on(InstanceEventId.RSP_TOWER_SAO_REFRESH, this._refreshSaoInfo, this);
        gdk.e.on(InstanceEventId.RSP_TOWER_BUYNUM_REFRESH, this._refreshSaoInfo, this);
        gdk.e.on(InstanceEventId.RSP_TOWER_REWARD_REFRESH, this.refreshStageRewardScrollView, this)

        //判断冲榜活动是否开启
        //let roleModel = ModelManager.get(RoleModel)
        let kfcb_cfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'kfcb_lv_time').value
        let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let serverOpenTime = GlobalUtil.getServerOpenTime()
        let endTime = serverOpenTime + 3600 * 24 * kfcb_cfg[1] - serverTime
        if (endTime > 0) {
            //gdk.panel.open(PanelId.KfcbActView)
            this.activityNode.active = true;
            this.bg1.active = false;
            this.initActivityData();
        } else {
            this.activityNode.active = false;
            this.bg1.active = true;
        }

        // 更新赏金按钮红点
        let redPoint = cc.find('down/bountyBtn/redPoint', this.node);
        if (redPoint) {
            redPoint.active = false;
            NetManager.send(new icmsg.BountyListReq(), (rmsg: icmsg.BountyListRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                let player = this.roleModel.name;
                let curTime = Math.floor(GlobalUtil.getServerTime() / 1000);
                redPoint.active = rmsg.list.some(i => {
                    if (i.publisher == player) return false;
                    if (i.committer != '') return false;
                    if (i.endTime - curTime <= 0) return false;
                    return true;
                });
            }, this);
        }

        //判断是否打开限时礼包界面
        if (this.actModel.towerShowView) {
            this.actModel.towerShowView = false;
            gdk.panel.setArgs(PanelId.LimitActGiftView, 5)
            gdk.panel.open(PanelId.LimitActGiftView)
        }
    }

    update(dt: number) {
        if (this.inActivity) {
            if (this.activityTime <= 0) {
                this.inActivity = false;
                this.timeLb.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3")//'活动已结束';
                this.timebg.active = false;
            }
            if (this.dtTime >= 1) {
                this.dtTime -= 1;
                this.timeLb.string = TimerUtils.format1(this.activityTime)
            }
            this.dtTime += dt;
            this.activityTime -= dt;
        }
    }
    onDisable() {
        NetManager.targetOff(this);
        gdk.e.targetOff(this);
        this.list && this.list.destroy();
        this.list = null;
        this.stageRewardList && this.stageRewardList.destroy();
        this.stageRewardList = null;
        this.rewardList && this.rewardList.destroy();
        this.rewardList = null;
    }

    _refreshSaoInfo() {
        //
        let cfg = ConfigManager.getItemById(GlobalCfg, "tower_sweep_consumption").value
        let model = this.model
        let allNum = cfg[0] + model.buyNum;
        this.saoNum.string = StringUtils.format(gdk.i18n.t("i18n:TOWER_ASKPANEL_TIP3"), allNum - model.raidsNum, allNum)//'剩余扫荡次数：' + (allNum - model.raidsNum) + '/' + allNum;
        this.buyNum.string = StringUtils.format(gdk.i18n.t("i18n:TOWER_PANEL_TIP3"), this.maxBuy - model.buyNum)//'剩余购买次数：' + (this.maxBuy - model.buyNum);
        if (allNum - model.raidsNum > 0 && this.model.lastStageId != 0) {
            GlobalUtil.setAllNodeGray(this.btnSao.node, 0);
            this.btnSao.interactable = true;
            this.redP.active = true//!model.enterStage;
        } else {
            this.redP.active = false;
            GlobalUtil.setAllNodeGray(this.btnSao.node, 1);
            this.btnSao.interactable = false;
        }
    }

    _updateBtnSaoState() {
        if (this.model.lastStageId == 0) {
            this.btnSao.node.active = false;
            return;
        }
        this.btnSao.node.active = true;

    }
    _updateMaxLab() {
        if (this.model.lastStageId == 0) {
            this.maxLab.node.active = false;
            return;
        }
        this.maxLab.node.active = true;
        let cfg = ConfigManager.getItemById(Copy_stageCfg, this.model.lastStageId)
        this.maxLab.string = StringUtils.format(gdk.i18n.t("i18n:TOWER_PANEL_TIP2"), cfg.des)//`最高通关：${cfg.des}`

    }

    onBuyBtnClick() {
        //1.判断剩余购买次数
        if (this.maxBuy - this.model.buyNum <= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:TOWER_ASKPANEL_TIP4"))
            return;
        }
        //2.发送购买消息
        //gdk.gui.showMessage('购买次数功能暂未开放')
        let item = ConfigManager.getItemById(ItemCfg, this.payData[1]);
        let cost = this.payData[2];
        if (this.roleModel.gems >= cost) {
            GlobalUtil.openAskPanel({
                title: gdk.i18n.t("i18n:TIP_TITLE"),
                descText: StringUtils.format(gdk.i18n.t("i18n:TOWER_ASKPANEL_TIP5"), cost, item.name),//`是否花费${cost}${item.name}购买一次扫荡次数?`,
                thisArg: this,
                sureText: gdk.i18n.t("i18n:OK"),
                sureCb: () => {
                    NetManager.send(new icmsg.DungeonTrialBuyRaidsReq(), (rsp: icmsg.DungeonTrialBuyRaidsRsp) => {
                        gdk.gui.showMessage(gdk.i18n.t("i18n:MINECOPY_PASSPORT_TIP9"))
                        this.model.buyNum = rsp.buyRaids;
                        this.model.raidsNum = rsp.raids;
                        gdk.e.emit(InstanceEventId.RSP_TOWER_BUYNUM_REFRESH)
                    }, this);
                },
            });
        } else {
            //return gdk.gui.showMessage(itemCfg.name + "及钻石数量不足")
            //钻石不足判断
            if (!GlobalUtil.checkMoneyEnough(cost, 2, null, [PanelId.Instance])) {
                return
            }
        }

    }

    onJumpBtnClick() {

        //判断当前可扫荡次数
        //打开提示面板
        //gdk.panel.setArgs(PanelId.TowerAskPanel, 1, 2, 2);
        gdk.panel.open(PanelId.TowerAskPanel);

    }

    initActivityData() {
        //请求排行榜主线数据
        this.rankLb.string = '';
        NetManager.on(icmsg.RankSelfRsp.MsgType, this._onRankSelfRsp, this)
        let msg2 = new icmsg.RankDetailReq()
        msg2.type = RankTypes.Refine
        NetManager.send(msg2)
        let endTime = ActUtil.getActEndTime(3)
        if (!endTime) {
            this.timeLb.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3")//'活动已结束';
            this.timebg.active = false;
        } else {
            let temTime = Math.floor(endTime / 1000)
            this.inActivity = true;
            this.dtTime = 0;
            let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
            this.activityTime = Math.max(0, Math.floor(temTime - nowTime));
            this.timeLb.string = TimerUtils.format1(this.activityTime)
            this.timebg.active = true;
        }

        let rewardIds = ConfigManager.getItemByField(GlobalCfg, 'key', 'tower_rewards').value;

        this._initRewardListView();
        let rewardData = []
        for (let i = 0, l = rewardIds.length; i < l; i++) {
            let awardId = rewardIds[i];
            let awardNum = 1;
            let tem = { typeId: awardId, num: awardNum, effect: false }
            rewardData.push(tem);
        }
        this.rewardList.set_data(rewardData);

    }

    _onRankSelfRsp(rsp: icmsg.RankSelfRsp) {
        if (rsp.type != RankTypes.Refine) return;
        //this.model.towerRank = rsp.numTd;
        let num = rsp.numTd;
        if (num > 0) {
            this.rankLb.string = this.rankStr.replace('@num', num + '');
        } else {
            this.rankLb.string = gdk.i18n.t("i18n:TOWER_PANEL_TIP1")//'<outline color=#2a1100 width=2><color=#ffffff>尚未进入排行榜</c></outline>'
        }

    }

    //挑战按钮点击事件
    attactClick() {
        let stage = this.model.nextStage;
        if (stage != null) {
            if (!this.model.enterStage) {
                this.model.enterStage = true;
            }
            JumpUtils.openInstance(stage.id);
        }
    }

    //打开冲榜界面
    openRankView() {
        gdk.panel.open(PanelId.KfcbActView)
    }

    _updateStageRewardListView() {
        this._initStageRewardListView()
        this.refreshStageRewardScrollView()
        let cfg = ConfigManager.getItem(Copy_stageCfg, (item: Copy_stageCfg) => {
            if (item.id >= this.model.nextStage.id && item.describe != '') {
                return true;
            }
            return false;
        })
        //<color=#00ff00>再通关5关</c><color=#0fffff>领取5星英雄</color>
        if (cfg) {
            let num = cfg.id - this.model.nextStage.id + 1;
            let str = cfg.describe;//'<color=#0fffff>再通关<color=#fffc00>@num</color>关领取5星英雄</color>'
            this.stageTips.string = str.replace('@num', num + '')
        } else {
            this.stageTips.string = ''
        }

    }
    refreshStageRewardScrollView() {
        let cfgs = []
        let items = ConfigManager.getItemsByField(Copy_stageCfg, "copy_id", CopyType.Trial)
        let over = []
        for (let i = 0; i < items.length; i++) {
            if (items[i].drop_2 && items[i].drop_2.length > 0) {
                let type = 1;//type 1未通关 2可领取 3已领取
                if (items[i].id <= this.model.lastStageId) {
                    type = 2;
                    if (this.model.getStageRewardState(items[i].id)) {
                        type = 3;
                    }
                }
                if (type == 3) {
                    over.push({ data: items[i], type: type })
                } else {
                    cfgs.push({ data: items[i], type: type })
                }
            }
        }
        let all = cfgs.concat(over)
        this.stageRewardList.set_data(all)
    }
    _updateListView() {
        //-----------刷新关卡列表--------
        this._initListView()
        let items = ConfigManager.getItemsByField(Copy_stageCfg, "copy_id", 5)
        let fightStageId = this.model.nextStage.id
        let count = 3
        let stagesList = []
        let startIndex = this._getStageIdIndex(fightStageId)
        if (startIndex > 0) {
            let temCfg = items[startIndex - 1]
            if (temCfg) {
                stagesList.push(temCfg)
            }
        }
        for (let i = 0; i <= count; i++) {
            if (startIndex + i < items.length) {
                let stageCfg = items[startIndex + i]
                if (stageCfg) {
                    stagesList.push(stageCfg)
                }
            }
        }
        stagesList.reverse()
        this.list.set_data(stagesList)
        this.list.scroll_to(this.list.datas.length - 1)

        this._updateMaxLab()
        this._refreshSaoInfo()
    }


    _getStageIdIndex(stageId) {
        let items = ConfigManager.getItemsByField(Copy_stageCfg, "copy_id", 5)
        for (let index = 0; index < items.length; index++) {
            if (items[index].id == stageId) {
                return index
            }
        }
        return 0
    }


    _initStageRewardListView() {
        if (this.stageRewardList) {
            this.stageRewardList.destroy()
        }
        this.stageRewardList = new ListView({
            scrollview: this.stageRewardScrollView,
            mask: this.stageRewardScrollView.node,
            content: this.stageRewardContent,
            item_tpl: this.towerRewardItem,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        })
    }
    _initRewardListView() {
        if (this.rewardList) {
            this.list.destroy()
        }
        this.rewardList = new ListView({
            scrollview: this.rewardScro,
            mask: this.rewardScro.node,
            content: this.rewardContent,
            item_tpl: this.rewardItem,
            cb_host: this,
            async: true,
            gap_y: 0,
            direction: ListViewDir.Horizontal,
        })
    }
    _initListView() {
        if (this.list) {
            this.list.destroy()
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.towerItem2,
            cb_host: this,
            async: true,
            gap_y: 0,
            direction: ListViewDir.Vertical,
        })
    }


    /*任务列表 */
    openBountyPublishView() {
        // if (ModelManager.get(RoleModel).guildId <= 0) {
        //     gdk.gui.showMessage(ErrorManager.get(2904));
        //     return;
        // }
        gdk.panel.open(PanelId.BountyPublishView);
    }

    /*任务列表 */
    openRankListView() {
        gdk.panel.setArgs(PanelId.Rank, 3);
        JumpUtils.openPanel({
            panelId: PanelId.Rank,
            panelArgs: { args: 3 },
            currId: gdk.gui.getCurrentView(),
        });
        //gdk.panel.open(PanelId.BountyPublishView);
    }
    openReplayView() {
        JumpUtils.openReplayListView(this.model.nextStage.id)
    }

    //打开试练塔基金
    openJijinView() {
        JumpUtils.openTowerTunds()
    }

}