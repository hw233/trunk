import ArenaBoxItemCtrl from './ArenaBoxItemCtrl';
import ArenaModel from '../../../common/models/ArenaModel';
import ArenaRankItemCtrl from './ArenaRankItemCtrl';
import BagUtils from '../../../common/utils/BagUtils';
import CommonStoreBuyCtrl from '../../store/ctrl/CommonStoreBuyCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StoreModel from '../../store/model/StoreModel';
import StoreViewCtrl, { MoneyType, StoreBaseScoreTabType } from '../../store/ctrl/StoreViewCtrl';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiScrollView from '../../../common/widgets/UiScrollView';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';
import {
    Arena_clearCfg,
    Arena_point_awardCfg,
    GlobalCfg,
    ItemCfg
    } from '../../../a/config';
import { ArenaEvent } from '../enum/ArenaEvent';
import { BagEvent } from '../../bag/enum/BagEvent';
import { timeFormat } from '../../instance/utils/InstanceUtil';

/**
 * @Description: 竞技场界面控制器
 * @Author: jijing.liu
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-25 17:38:49
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arena/ArenaViewCtrl")
export default class ArenaViewCtrl extends gdk.BasePanel {

    @property(cc.Prefab)
    rankItemPrb: cc.Prefab = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Node)
    sweepTime: cc.Node = null;

    @property(cc.Label)
    sweepTips: cc.Label = null;

    @property(cc.Label)
    arenaTimesLabel: cc.Label = null;

    @property(cc.Node)
    iconCtn: cc.Node = null;

    @property(cc.Node)
    headFrame: cc.Node = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Label)
    powerLabel: cc.Label = null;

    @property(cc.Label)
    rankLabel: cc.Label = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;

    @property(cc.Label)
    matchTimerLabel: cc.Label = null;

    @property([cc.Node])
    boxItems: cc.Node[] = [];

    @property(cc.Node)
    tabPanel: cc.Node[] = [];

    @property(cc.Node)
    defenceRedPoint: cc.Node = null;

    @property(cc.Node)
    fightContent: cc.Node = null;
    fightList: UiScrollView = null;

    @property(cc.Node)
    rankContent: cc.Node = null;
    rankList: UiScrollView = null;

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    // 当前打开的标签页：0 对阵 1 排行 2 战报
    curTab: number = -1;
    heros: icmsg.HeroInfo[] = [];
    pointArray: Arena_point_awardCfg[] = [];
    totalPoint: number = 0;
    _myRankItemCtrl: ArenaRankItemCtrl = null;

    _arenaItemId = 150002

    reqRecords: boolean[] = [];
    listNodes: cc.Node[] = [];

    get roleModel() { return ModelManager.get(RoleModel); }
    get heroModel() { return ModelManager.get(HeroModel); }
    get arenaModel() { return ModelManager.get(ArenaModel); }
    get storeModel() { return ModelManager.get(StoreModel); }

    onLoad() {
        this.title = gdk.i18n.t("i18n:ARENA_VIEW_TITLE");
        this._initListView();
        this.pointArray = ConfigManager.getItems(Arena_point_awardCfg, { win_point: 1 });
    }

    onEnable() {
        gdk.e.on(ArenaEvent.RSP_ARENA_INFO, this._onArenaInfoRsp, this);
        gdk.e.on(ArenaEvent.RSP_ARENA_MATH, this._onArenaMathRsp, this);
        gdk.e.on(ArenaEvent.RSP_ARENA_RANK, this._onArenaRankRsp, this);
        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateFightTimes, this)

        if (!this.arenaModel.battleArrayMsg) {
            let msg = new icmsg.ArenaDefenceReq();
            NetManager.send(msg)
        }
        gdk.Timer.loop(1000, this, () => {
            this.secondTimer();
        });

        for (let i = 0; i < this.tabPanel.length; i++) {
            let element = this.tabPanel[i];
            element.active = false;
        }

        GlobalUtil.setSpriteIcon(this.node, this.iconCtn, GlobalUtil.getHeadIconById(this.roleModel.head));
        GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(this.roleModel.frame));

        this.slotItem.updateItemInfo(this._arenaItemId, 1)
        this.slotItem.itemInfo = {
            series: null,
            itemId: this._arenaItemId,
            itemNum: 1,
            type: BagUtils.getItemTypeById(this._arenaItemId),
            extInfo: null
        }
    }

    onDisable() {
        this.unscheduleAllCallbacks();
        gdk.e.targetOff(this);
        gdk.Timer.clearAll(this);
        // 清除列表
        this.fightList && this.fightList.clear_items();
        this.rankList && this.rankList.clear_items();
        // 关闭相关联的弹窗
        gdk.panel.hide(PanelId.ArenaReportView);
    }

    secondTimer() {
        if (this.matchTime > 0) {
            this.matchTime--;
            if (this.matchTime == 0) {
                // 从新获取一次匹配数据
                let msg = new icmsg.ArenaMatchReq();
                NetManager.send(msg);
            }
        }
    }

    matchTime: number = 0;

    @gdk.binding("matchTime")
    _updateTimeLabel() {
        if (this.matchTime < 0) {
            this.timeLabel.string = `--:--:-- ${gdk.i18n.t("i18n:ARENA_TIP8")}`;
        } else {
            let str: string = timeFormat(this.matchTime);
            this.timeLabel.string = `${str} ${gdk.i18n.t("i18n:ARENA_TIP8")}`;
        }
    }

    @gdk.binding("arenaModel.matchTime")
    _updateMatchTimestamp() {
        let time: number = this.arenaModel.matchTime;
        if (time == 0) {
            // 玩家还没有请求过匹配数据
            this.matchTime = -1;
        } else {
            let curTime = Math.floor(Date.parse(new Date().toString()) / 1000);
            this.matchTime = 60 * 60 - (curTime - time);
        }
    }

    _updateSweepTimer() {
        if (!this.sweepTime.active || (!this.arenaModel.raidTime && this.arenaModel.raidTime !== 0)) {
            this.unscheduleAllCallbacks();
            return;
        }
        let cfg = ConfigManager.getItems(Arena_clearCfg)[0];
        let maxTimes = cfg.max;
        this.sweepTime.getChildByName('times').getComponent(cc.Label).string = `${this.arenaModel.raidTimes}/${maxTimes}`;
        let dt = cfg.recovery_time;
        let timeLab = this.sweepTime.getChildByName('count').getComponent(cc.Label);
        let b = this.arenaModel.raidTimes < maxTimes && this.arenaModel.raidTime > 0;
        if (b) {
            let t = this.arenaModel.raidTime;
            let now = Math.floor(GlobalUtil.getServerTime() / 1000);
            let recoverT = t + dt;
            while (now > recoverT) {
                recoverT += dt;
            }
            let leftTime = recoverT - now;
            timeLab.string = TimerUtils.format2(leftTime) + '后可扫荡';
            if (leftTime <= 0) {
                this.arenaModel.raidTimes += 1;
                if (this.arenaModel.raidTimes == 1) {
                    this.fightListUpdate();
                }
            }
        }
        else {
            timeLab.string = '可扫荡';
        }
    }

    get myRankItemCtrl() {
        if (this._myRankItemCtrl == null) {
            let temp: cc.Node = cc.instantiate(this.rankItemPrb);
            this.tabPanel[1].addChild(temp);
            temp.x = 0;
            temp.y = -220;

            let roleModel = this.roleModel;
            let myRankItemCtrl = temp.getComponent(ArenaRankItemCtrl);
            this._myRankItemCtrl = myRankItemCtrl;

            myRankItemCtrl.nameLabel.string = roleModel.name + '';
            myRankItemCtrl.lvLabel.string = `.${roleModel.level}`;
            myRankItemCtrl.scoreLabel.string = this.arenaModel.score + '';
            GlobalUtil.setSpriteIcon(this.node, myRankItemCtrl.iconNode, GlobalUtil.getHeadIconById(roleModel.head));
            GlobalUtil.setSpriteIcon(this.node, myRankItemCtrl.frameIcon, GlobalUtil.getHeadFrameById(roleModel.frame));

            let vipCtrl = myRankItemCtrl.vipFlag.getComponent(VipFlagCtrl)
            vipCtrl.updateVipLv(this.roleModel.vipLv)
        }
        return this._myRankItemCtrl;
    }

    _onArenaInfoRsp() {
        this.myRankItemCtrl.scoreLabel.string = this.arenaModel.score + '';
        this.scoreLabel.string = this.arenaModel.score + '';
        this.rankLabel.string = this.arenaModel.rank > 0 ? `${this.arenaModel.rank}` : `${gdk.i18n.t("i18n:ARENA_TIP9")}`
        this.fightListUpdate();
        this.unscheduleAllCallbacks();
        let lv = ConfigManager.getItemByField(GlobalCfg, 'key', 'arena_clear_open').value[0];
        if (this.roleModel.level < lv) {
            this.sweepTime.active = false
            this.unscheduleAllCallbacks();
            this.sweepTips.node.active = true;
            this.sweepTips.string = `指挥官${lv}级可扫荡`;
        }
        else {
            this.sweepTips.node.active = false;
            this.sweepTime.active = true
            this._updateSweepTimer();
            this.schedule(this._updateSweepTimer, 1);
        }
    }

    _onArenaMathRsp() {
        this.fightListUpdate();
        this.selectTabPanel(this.curTab)
    }

    _onArenaRankRsp() {
        this.rankListUpdate();
    }

    tabBtnClick(p: TouchEvent, data: number) {
        this.selectTabPanel(data);
    }

    // add animation todo
    selectTabPanel(tabId: number) {
        let pre = this.curTab;
        this.curTab = tabId;

        // 战报界面
        if (tabId == 3) {
            JumpUtils.openPanel({
                panelId: PanelId.ArenaReportView,
                callback: (node: cc.Node) => {
                    let trigger = gdk.NodeTool.onHide(node);
                    trigger.on(() => {
                        trigger.targetOff(this);
                        if (cc.isValid(this.node)) {
                            this.uiTabMenu.setSelectIdx(pre);
                        }
                    }, this);
                },
            });
            return;
        } else if (tabId == 1) {
            JumpUtils.openPanel({
                panelId: PanelId.Store,
                currId: this.node,
                callback: (node: cc.Node) => {
                    let comp = node.getComponent(StoreViewCtrl)
                    comp.menuBtnSelect(null, 0)
                    comp.typeBtnSelect(null, StoreBaseScoreTabType.Arena)
                }
            })
            return;
        }

        // 显示的页卡没有改变
        if (this.tabPanel[tabId].active) {
            return;
        }

        // 页卡数据刷新
        switch (tabId) {
            case 0:
                // 对战
                {
                    let msg = new icmsg.ArenaMatchReq();
                    NetManager.send(msg);
                    //挑战券在战报，需要向申请挑战记录
                    if (!this.reqRecords[1]) {
                        this.reqRecords[1] = true;
                        let msg = new icmsg.ArenaInfoReq();
                        NetManager.send(msg);
                    }
                }
                break;

            case 2:
                // 排行
                {
                    let msg = new icmsg.RankDetailReq()
                    msg.type = 5
                    NetManager.send(msg)
                }
                break;
        }

        // 显示状态
        for (let i = 0; i < this.tabPanel.length; i++) {
            let element = this.tabPanel[i];
            let listNode = this.listNodes[i];
            let v = i == tabId;
            element.active = v;
            listNode.active = v;
        }

        // 刷新列表
        this.fightListUpdate();
        this.rankListUpdate();
    }

    @gdk.binding("roleModel.level")
    _updateLevel() {
        this.lvLabel.string = `.${this.roleModel.level}`
    }

    @gdk.binding("roleModel.name")
    _updateName() {
        this.nameLabel.string = `${this.roleModel.name}`
    }

    @gdk.binding("heroModel.heroInfos")
    _updateHeros() {
        this.powerLabel.string = `${this.roleModel.power}`
    }

    @gdk.binding("arenaModel.score")
    _updateScore() {
        this.scoreLabel.string = `${this.arenaModel.score}`;
    }

    @gdk.binding("arenaModel.rank")
    _updateRank() {
        this.rankLabel.string = `${this.arenaModel.rank > 0 ? this.arenaModel.rank : `${gdk.i18n.t("i18n:ARENA_TIP9")}`}`;
    }

    @gdk.binding("arenaModel.fightNum")
    @gdk.binding("arenaModel.buyNum")
    _updateFightTimes() {
        // this.arenaTimesLabel.string = `${getLeftArenaTimes()}/${getTotalArenaTimes()}`;
        this.arenaTimesLabel.string = `${BagUtils.getItemNumById(this._arenaItemId)}`
    }

    @property(cc.Label)
    pointLabel: cc.Label = null;

    //胜利点更新
    @gdk.binding("arenaModel.points")
    @gdk.binding("arenaModel.awardNums")
    _updatePoint() {
        this.pointLabel.string = `${this.arenaModel.points}`;
        for (let i = 0; i < this.pointArray.length; i++) {
            let item = this.boxItems[i]
            if (item) {
                let ctrl = item.getComponent(ArenaBoxItemCtrl)
                ctrl.updateViewInfo(this.pointArray[i], this._getBoxShowId())
            }
        }
    }

    _getBoxShowId() {
        for (let i = 0; i < this.pointArray.length; i++) {
            if (this.arenaModel.points <= this.pointArray[i].point_number) {
                return i + 1
            }
        }
        return this.pointArray.length
    }

    fightListUpdate() {
        if (!this.fightList.enabledInHierarchy) {
            this.fightList.clear_items();
            return;
        }
        let arr = [];
        let matchPlayers = this.arenaModel.matchPlayers;
        for (let i = matchPlayers.length - 1; i >= 0; i--) {
            let data = {
                index: i,
                player: matchPlayers[i]
            };
            arr.push(data);
        }
        this.fightList.set_data(arr)
    }

    rankListUpdate() {
        if (!this.rankList.enabledInHierarchy) {
            this.rankList.clear_items();
            return;
        }
        let index = 1;
        let myIndex = 0;
        let pid = this.roleModel.id.toLocaleString();
        this.arenaModel.list.forEach(element => {
            if (element.brief.id.toLocaleString() == pid) {
                myIndex = index;
            }
            element['rank'] = index;
            index++;
        });

        let myRankItemCtrl = this.myRankItemCtrl;
        if (myIndex != 0) {
            if (myIndex <= 3) {
                myRankItemCtrl.rankLabel.node.active = false;
                myRankItemCtrl.rankSprite.node.active = true;
                let path = `common/texture/main/gh_gxbhuizhang0${myIndex}`;
                GlobalUtil.setSpriteIcon(this.node, myRankItemCtrl.rankSprite, path);
            } else {
                myRankItemCtrl.rankLabel.node.active = true;
                myRankItemCtrl.rankSprite.node.active = false;
                myRankItemCtrl.rankLabel.string = myIndex + '';
            }
            myRankItemCtrl.noRank.active = false
            let data = this.arenaModel.list[myIndex - 1];

        } else {
            myRankItemCtrl.rankLabel.node.active = false;
            myRankItemCtrl.rankSprite.node.active = false;
            myRankItemCtrl.noRank.active = true
        }
        myRankItemCtrl.scoreLabel.string = `${this.arenaModel.score}`

        this.rankList.set_data(this.arenaModel.list);
    }


    /**购买次数 */
    // buyArenaTimes() {
    //     gdk.panel.open(PanelId.ArenaBuyTimes);
    // }

    _initListView() {
        if (!this.fightList) {
            this.fightList = this.fightContent.parent.getComponent(UiScrollView);
            this.fightList.init();
        }
        if (!this.rankList) {
            this.rankList = this.rankContent.parent.getComponent(UiScrollView);
            this.rankList.init();
        }
        this.listNodes = [this.fightList.node, this.rankList.node, this.rankList.node];
    }

    @gdk.binding("heroModel.PvpArenUpHeroList")
    _updateDefenceRedPoint() {
        this.defenceRedPoint.active = false

        let list = this.heroModel.heroInfos
        let datas: icmsg.HeroInfo[] = []
        list.forEach(element => {
            datas.push((element.extInfo as icmsg.HeroInfo))
        });
        let ids = this.heroModel.PvpArenUpHeroList
        for (let i = 0; i < ids.length; i++) {
            if (ids[i] > 0) {
                let heroInfo = HeroUtils.getHeroInfoByHeroId(ids[i])
                for (let j = 0; j < datas.length; j++) {
                    if (heroInfo && ids.indexOf(datas[j].heroId) == -1 && heroInfo.level < datas[j].level) {
                        this.defenceRedPoint.active = true
                        return
                    }
                }
            }
        }
    }

    onDefenceSetClick() {
        this._updateDefenceRedPoint();
        gdk.panel.setArgs(PanelId.RoleSetUpHeroSelector, 1, 1)
        gdk.panel.open(PanelId.RoleSetUpHeroSelector);
    }

    openBuyFunc() {
        let itemCfg = ConfigManager.getItemById(ItemCfg, this._arenaItemId)
        let storeInfo: icmsg.StoreBuyInfo = new icmsg.StoreBuyInfo()
        storeInfo.id = this._arenaItemId
        storeInfo.count = 0
        gdk.panel.open(PanelId.CommonStoreBuy, (node: cc.Node) => {
            let comp = node.getComponent(CommonStoreBuyCtrl);
            comp.initItemInfo(this._arenaItemId, 1, storeInfo, 99, MoneyType.Diamond, itemCfg.price, (buyNum) => {
                let msg = new icmsg.StoreQuickBuyReq()
                msg.id = this._arenaItemId
                msg.num = buyNum
                NetManager.send(msg, (data: icmsg.StoreQuickBuyRsp) => {
                    GlobalUtil.openRewadrView(data.list)
                })
            })
        })
    }
}