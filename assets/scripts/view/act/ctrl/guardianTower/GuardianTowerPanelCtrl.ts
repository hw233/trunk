import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianTowerModel from '../../model/GuardianTowerModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RewardItem from '../../../../common/widgets/RewardItem';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { ActivityEventId } from '../../enum/ActivityEventId';
import {
    GlobalCfg,
    Guardiantower_showCfg,
    Guardiantower_towerCfg,
    Guardiantower_unlockCfg
    } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';


/**
 * @Description: 护使秘境
 * @Author: yaozu.hu
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-19 17:04:34
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guardianTower/GuardianTowerPanelCtrl")
export default class GuardianTowerPanelCtrl extends gdk.BasePanel {



    @property(cc.Label)
    myRankLb: cc.Label = null;
    @property(cc.Node)
    rankReward: cc.Node = null;
    @property(cc.Prefab)
    rankRewardPre: cc.Prefab = null;
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null
    @property(cc.Node)
    content: cc.Node = null
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;
    @property(cc.Button)
    btnSao: cc.Button = null
    @property(cc.Label)
    saoNum: cc.Label = null;
    @property(cc.Label)
    buyNum: cc.Label = null;
    @property(cc.Label)
    maxLab: cc.Label = null

    @property(cc.Label)
    endTimeLb: cc.Label = null;

    get model() { return ModelManager.get(GuardianTowerModel); }
    get roleModel() { return ModelManager.get(RoleModel); }

    list: ListView = null
    maxBuy: number = 0;
    payData: number[];
    isEnd: boolean = false;
    actId: number = 89;
    _leftTime: number;
    //actCfg: ActivityCfg;
    curDay: number = 1;
    actRewardType: number = 1;

    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v !== 0) {
            return;
        }
        this._leftTime = Math.max(0, v);
        if (this._leftTime == 0) {
            this.endTimeLb.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3");
            this.isEnd = true;
        }
        else {
            this.endTimeLb.string = TimerUtils.format1(this.leftTime / 1000);
        }
    }

    onEnable() {
        this.model.enterGuardianTower = true;
        this.payData = ConfigManager.getItemByField(GlobalCfg, 'key', 'guardiantower_sweep_cost').value;
        this.maxBuy = this.payData[0]
        this._updateTime();

        //this.actCfg = ActUtil.getCfgByActId(this.actId);
        this.actRewardType = ActUtil.getActRewardType(this.actId)
        let temStartTime = ActUtil.getActStartTime(this.actId)
        let curTime = GlobalUtil.getServerTime();
        let temDay = Math.floor(((curTime - temStartTime) / 1000) / 86400) + 1
        this.curDay = temDay > 5 ? 5 : temDay;

        this.model.curDay = this.curDay;

        let msg = new icmsg.GuardianTowerStateReq()
        NetManager.send(msg, (rsp: icmsg.GuardianTowerStateRsp) => {
            this.model.stateInfo = rsp;
            this.initMyInfo()
        }, this);
        gdk.e.on(ActivityEventId.ACRIVITY_GUARDIANTOWER_REFRESH_RAINNUM, this._refreshSaoInfo, this);

    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
        gdk.e.targetOff(this);
    }
    _dtime: number = 0;
    update(dt: number) {
        if (!this.leftTime) {
            return;
        }
        this._dtime += dt;
        if (this._dtime >= 1) {
            this._dtime -= 1;
            this._updateTime();

        }
    }
    _updateTime() {
        let curTime = GlobalUtil.getServerTime();
        let ct = ActUtil.getActEndTime(this.actId);
        this.leftTime = ct - curTime;
    }

    initMyInfo() {

        let stateInfo = this.model.stateInfo;
        this.myRankLb.string = stateInfo.mineRank > 0 ? stateInfo.mineRank + '' : '未上榜';
        this.rankReward.removeAllChildren();
        let rewardCfg = ConfigManager.getItem(Guardiantower_showCfg, (cfg: Guardiantower_showCfg) => {
            if (cfg.subtype == this.actRewardType) {
                return true;
            }
        })
        if (!rewardCfg) {
            let temCfgs = ConfigManager.getItems(Guardiantower_showCfg)
            rewardCfg = temCfgs[temCfgs.length - 1]
        }
        rewardCfg.prize_show.forEach((tem, index) => {
            let node = cc.instantiate(this.rankRewardPre)
            let ctrl = node.getComponent(RewardItem);
            //let tem = cfg.prize_show;
            let temData = { index: index, typeId: tem[0], num: tem[1], delayShow: false, effct: false }
            ctrl.data = temData;
            ctrl.updateView();
            node.setParent(this.rankReward)
        })

        this._initListView()
        let oldCfg: Guardiantower_towerCfg = null;
        if (stateInfo.maxStageId != 0) {
            oldCfg = ConfigManager.getItemById(Guardiantower_towerCfg, stateInfo.maxStageId);
            this.maxLab.string = oldCfg.copy_name
        } else {
            this.maxLab.string = ''
        }
        let curCfg: Guardiantower_towerCfg = null;
        if (stateInfo.maxStageId == 0) {
            curCfg = ConfigManager.getItem(Guardiantower_towerCfg, (cfg: Guardiantower_towerCfg) => {
                if (cfg.subtype == this.actRewardType) {
                    return true;
                }
            });
        } else {
            curCfg = ConfigManager.getItemById(Guardiantower_towerCfg, stateInfo.maxStageId + 1);
        }

        let cutState: number = 1;
        if (curCfg) {
            let index = curCfg.id % 100;
            let temNuLockCfg = ConfigManager.getItem(Guardiantower_unlockCfg, (cfg: Guardiantower_unlockCfg) => {
                if (index >= cfg.copy_section[0] && index <= cfg.copy_section[1]) {
                    return true;
                }
            })
            if (this.curDay >= temNuLockCfg.unlocktime[2] + 1) {
                cutState = 1;
            } else {
                cutState = 3;
                this.model.nextState = 2
            }
        }

        this.model.curCfg = curCfg;
        let nextCfg: Guardiantower_towerCfg = null;
        let nextState = 2;
        if (curCfg) {
            let temNextCfg = ConfigManager.getItemById(Guardiantower_towerCfg, curCfg.id + 1);
            if (temNextCfg) {
                let index = temNextCfg.id % 100;
                nextCfg = temNextCfg;
                let temNuLockCfg = ConfigManager.getItem(Guardiantower_unlockCfg, (cfg: Guardiantower_unlockCfg) => {
                    if (index >= cfg.copy_section[0] && index <= cfg.copy_section[1]) {
                        return true;
                    }
                })
                if (this.curDay >= temNuLockCfg.unlocktime[2] + 1) {
                    nextState = 2;
                    this.model.nextState = 1
                } else {
                    nextState = 3;
                    this.model.nextState = 2
                }
            } else {
                this.model.nextState = 0;
            }
        } else {
            this.model.nextState = 0;
        }

        let temData = [];
        if (!curCfg && !nextCfg) {
            let data = { cfg: oldCfg, state: 0 }
            temData.push(data);
        } else {
            temData.push({ cfg: nextCfg, state: nextState, curDay: this.curDay });
            temData.push({ cfg: curCfg, state: cutState, curDay: this.curDay });
            temData.push({ cfg: oldCfg, state: 0, curDay: this.curDay });
        }

        this.list.set_data(temData);
        this._refreshSaoInfo()

    }
    _initListView() {

        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.itemPre,
            cb_host: this,
            async: true,
            gap_y: -5,
            direction: ListViewDir.Vertical,
        })
    }

    _refreshSaoInfo() {
        //
        let cfg = ConfigManager.getItemByField(GlobalCfg, 'key', "guardiantower_free_sweep").value
        let stateInfo = this.model.stateInfo
        let allNum = cfg[0] + stateInfo.buyRaidNum;
        this.saoNum.string = StringUtils.format(gdk.i18n.t("i18n:TOWER_ASKPANEL_TIP3"), allNum - stateInfo.raidNum, allNum)//'剩余扫荡次数：' + (allNum - model.raidsNum) + '/' + allNum;
        this.buyNum.string = StringUtils.format(gdk.i18n.t("i18n:TOWER_PANEL_TIP3"), this.maxBuy - stateInfo.buyRaidNum)//'剩余购买次数：' + (this.maxBuy - model.buyNum);
        if (allNum - stateInfo.raidNum > 0 && stateInfo.maxStageId != 0) {
            GlobalUtil.setAllNodeGray(this.btnSao.node, 0);
            this.btnSao.interactable = true;
            //this.redP.active = true//!model.enterStage;
        } else {
            //this.redP.active = false;
            GlobalUtil.setAllNodeGray(this.btnSao.node, 1);
            this.btnSao.interactable = false;
        }
    }


    onBuyBtnClick() {
        //1.判断剩余购买次数
        if (this.maxBuy - this.model.stateInfo.buyRaidNum <= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:TOWER_ASKPANEL_TIP4"))
            return;
        }
        //2.发送购买消息
        //gdk.gui.showMessage('购买次数功能暂未开放')
        //let item = ConfigManager.getItemById(ItemCfg, this.payData[1]);
        let cost = this.payData[1];
        if (this.roleModel.gems >= cost) {
            GlobalUtil.openAskPanel({
                title: gdk.i18n.t("i18n:TIP_TITLE"),
                descText: StringUtils.format(gdk.i18n.t("i18n:GUARDIANTOWER_TIP2"), cost),//`是否花费${cost}${item.name}购买一次扫荡次数?`,
                thisArg: this,
                sureText: gdk.i18n.t("i18n:OK"),
                sureCb: () => {
                    NetManager.send(new icmsg.GuardianTowerRaidBuyReq(), (rsp: icmsg.GuardianTowerRaidBuyRsp) => {
                        gdk.gui.showMessage(gdk.i18n.t("i18n:MINECOPY_PASSPORT_TIP9"))
                        this.model.stateInfo.buyRaidNum = rsp.buyRaidNum;
                        this._refreshSaoInfo();
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

    onSaoDangBtnClick() {
        gdk.panel.open(PanelId.GuardianTowerAskPanel);
    }

    openRankView() {
        gdk.panel.open(PanelId.GuardianTowerRankView);
    }
}
