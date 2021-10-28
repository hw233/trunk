import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import PeakModel from '../../model/PeakModel';
import RewardItem from '../../../../common/widgets/RewardItem';
import StringUtils from '../../../../common/utils/StringUtils';
import SubInsSweepViewCtrl from '../../../instance/ctrl/SubInsSweepViewCtrl';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import {
    Peak_challengeCfg,
    Peak_divisionCfg,
    Peak_globalCfg,
    Peak_gradeCfg,
    Peak_mainCfg
    } from '../../../../a/config';



/** 
 * @Description: 巅峰之战View
 * @Author: yaozu.hu
 * @Date: 2021-02-23 10:37:28
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-17 17:36:51
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakViewCtrl")
export default class PeakViewCtrl extends gdk.BasePanel {


    @property(cc.Sprite)
    myDivisionIcon: cc.Sprite = null;
    @property(cc.Label)
    myDivisionName: cc.Label = null;
    @property(cc.Label)
    myScoreLb: cc.Label = null;

    @property(cc.Node)
    jinduScoreSp: cc.Node = null;
    @property(cc.Label)
    jinduScoreLb: cc.Label = null;

    @property(cc.Label)
    myAttackNum: cc.Label = null;
    @property(cc.Label)
    buyNum: cc.Label = null;


    // @property(cc.Node)
    // curDivisionNode: cc.Node = null;

    // @property(cc.Node)
    // oldDivisionNode: cc.Node = null;

    // @property(cc.Node)
    // nextDivisionNode: cc.Node = null;

    @property(cc.Label)
    endTimeLb: cc.Label = null;

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    divisionItem: cc.Prefab = null;

    @property(cc.Node)
    boxRed: cc.Node = null;
    @property(cc.Label)
    boxLb: cc.Label = null;
    @property(cc.Node)
    boxTip: cc.Node = null;
    @property(cc.Node)
    boxRewardList: cc.Node = null;
    @property(cc.Prefab)
    boxRewardItem: cc.Prefab = null;

    @property([cc.Sprite])
    divisionSpList: cc.Sprite[] = [];

    get peakModel() { return ModelManager.get(PeakModel); }

    listView: ListView;

    isEnd: boolean = false;
    attackNum: number = 0;
    _leftTime: number;
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

    reward_type: number = 1;
    onEnable() {

        let cfg = ActUtil.getCfgByActId(84);
        if (!cfg) {
            this.close()
        }

        //设置段位图标
        let cfgs = ConfigManager.getItems(Peak_divisionCfg);
        cfgs.forEach((cfg, idx) => {
            if (this.divisionSpList.length > idx) {
                let spNode = this.divisionSpList[idx];
                GlobalUtil.setSpriteIcon(this.node, spNode, 'view/act/texture/peak/' + cfg.icon)
            }
        })

        this.reward_type = ActUtil.getActRewardType(84)//cfg.reward_type;
        this.peakModel.reward_type = this.reward_type;
        this._updateTime();
        let msg = new icmsg.PeakStateReq()
        NetManager.send(msg, (rsp: icmsg.PeakStateRsp) => {
            this.peakModel.peakStateInfo = rsp;
            this.initMyInfo()
            this.updivisionInfo()
        }, this);
        gdk.e.on(ActivityEventId.ACTIVITY_PEAK_CHANGE_REWARD_UPDATE, this.refreshBoxRed, this)
    }

    onDisable() {
        NetManager.targetOff(this)
        if (this.listView) {
            this.listView.destroy()
            this.listView = null;
        }
        gdk.e.off(ActivityEventId.ACTIVITY_PEAK_CHANGE_REWARD_UPDATE, this.refreshBoxRed, this)
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
        let ct = ActUtil.getActEndTime(84);
        this.leftTime = ct - curTime;
    }


    initMyInfo() {
        let temStateInfo = this.peakModel.peakStateInfo
        let cfg = ConfigManager.getItemByField(Peak_divisionCfg, 'division', temStateInfo.rank)
        GlobalUtil.setSpriteIcon(this.node, this.myDivisionIcon, 'view/act/texture/peak/' + cfg.icon)
        this.myDivisionName.string = cfg.name;
        this.myScoreLb.string = temStateInfo.points + '';

        let nextDivisionCfg = ConfigManager.getItem(Peak_divisionCfg, (cfg: Peak_divisionCfg) => {
            if (cfg.division > temStateInfo.rank) {
                return true
            }
            return false;
        })
        if (nextDivisionCfg) {
            let tem = (temStateInfo.points - cfg.point) / (nextDivisionCfg.point - cfg.point)
            let temH = (temStateInfo.rank - 1) * 90 + Math.floor(tem * 90)
            this.jinduScoreSp.height = Math.min(810, temH);
            this.jinduScoreLb.node.parent.active = true;
            this.jinduScoreLb.string = nextDivisionCfg.point + '';
            this.jinduScoreLb.node.parent.y = -405 + Math.min(785, temStateInfo.rank * 90 - 25)
        } else {
            this.jinduScoreSp.height = 810;
            this.jinduScoreLb.node.parent.active = false;
        }
        //设置段位信息
        //(temStateInfo.rank - 1) * 90 + 20

        //显示挑战宝箱信息
        let isGet = false
        let nextCfg = ConfigManager.getItem(Peak_challengeCfg, (cfg: Peak_challengeCfg) => {
            if (cfg.times > temStateInfo.totalEnterTimes) {
                return true
            }
            return false;
        })
        if (!nextCfg) {
            let cfgs = ConfigManager.getItems(Peak_challengeCfg, (cfg: Peak_challengeCfg) => {
                if (cfg.times <= temStateInfo.totalEnterTimes) {
                    return true;
                }
                return false
            })
            nextCfg = cfgs[cfgs.length - 1];
            let id = nextCfg.times;
            let reward = temStateInfo.challenge;
            let old = reward[Math.floor(nextCfg.times / 8)];
            if ((old & 1 << (id - 1) % 8) >= 1) {
                isGet = true;

            }
        }
        this.boxLb.string = temStateInfo.totalEnterTimes + '/' + nextCfg.times;
        this.boxLb.node.active = !isGet;
        this.boxTip.active = !isGet;

        this.boxRewardList.removeAllChildren()
        for (let i = 0; i < nextCfg.rewards.length; i++) {
            let node = cc.instantiate(this.boxRewardItem);
            let ctrl = node.getComponent(RewardItem);
            let tem = nextCfg.rewards[i];
            let temData = { index: i, typeId: tem[0], num: tem[1], delayShow: false, effct: false, isGet: isGet }
            ctrl.data = temData;
            ctrl.updateView();
            node.setParent(this.boxRewardList)
        }
        if (nextCfg.item_icon != '') {
            for (let i = 0; i < nextCfg.item_icon.length; i++) {
                let node = cc.instantiate(this.boxRewardItem);
                let ctrl = node.getComponent(RewardItem);
                let tem = nextCfg.item_icon[i];
                let temData = { index: i, typeId: tem[0], num: tem[1], delayShow: false, effct: false, isGet: isGet }
                ctrl.data = temData;
                ctrl.updateView();
                node.setParent(this.boxRewardList)
            }
        }

        //挑战次数
        this.refreshAttackNum();
        this.refreshBoxRed();
    }

    refreshAttackNum() {
        let temStateInfo = this.peakModel.peakStateInfo
        let freeNum = ConfigManager.getItemByField(Peak_globalCfg, 'key', 'free_challenge').value[0];
        let mainCfg = ConfigManager.getItemByField(Peak_mainCfg, 'reward_type', this.reward_type);
        let len = mainCfg.challenge_times.length
        let maxBuyNum = mainCfg.challenge_times[len - 1][0]
        this.attackNum = freeNum + temStateInfo.buyEnterTimes - temStateInfo.enterTimes
        this.myAttackNum.string = this.attackNum + ''
        this.buyNum.string = (maxBuyNum - temStateInfo.buyEnterTimes) + ''
    }

    refreshBoxRed() {
        //显示挑战宝箱红点
        let temStateInfo = this.peakModel.peakStateInfo
        let cfgs = ConfigManager.getItems(Peak_challengeCfg, (cfg: Peak_challengeCfg) => {
            if (cfg.times <= temStateInfo.totalEnterTimes) {
                return true;
            }
            return false
        })
        let have = false
        let reward = temStateInfo.challenge;
        cfgs.forEach(cfg => {
            let id = cfg.times
            let old = reward[Math.floor((id - 1) / 8)];
            if (!((old & 1 << (id - 1) % 8) >= 1)) {
                have = true;
            }
        })
        this.boxRed.active = have;

    }

    _initListView() {
        if (!this.listView) {
            this.listView = new ListView({
                scrollview: this.scroll,
                mask: this.scroll.node,
                content: this.content,
                item_tpl: this.divisionItem,
                cb_host: this,
                gap_y: 0,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }

    updivisionInfo(reset: boolean = true) {
        this._initListView()
        let listData = []
        let cfgs = ConfigManager.getItems(Peak_divisionCfg);

        cfgs.forEach(cfg => {
            let temCfg = ConfigManager.getItemByField(Peak_gradeCfg, 'grade', cfg.division, { 'reward_type': 1 })
            let state = 0;
            if (this.peakModel.peakStateInfo.rank == cfg.division) {
                state = 1;
            } else if (this.peakModel.peakStateInfo.rank < cfg.division) {
                state = 2;
            }
            let temData = { cfg: temCfg, divisionCfg: cfg, state: state, attackNum: this.attackNum }
            listData.push(temData);
        })
        let index = this.peakModel.peakStateInfo.rank;
        if (index > 1 && index < cfgs.length) {
            index = cfgs.length - (index + 1);
        } else if (index == cfgs.length) {
            index = 0;
        } else {
            index = cfgs.length - 1;
        }
        listData.reverse()
        this.listView.set_data(listData, reset)
        this.listView.scroll_to(index);

    }


    //购买挑战次数
    buyAttackNumBtnClick() {

        let temStateInfo = this.peakModel.peakStateInfo;
        if (temStateInfo.buyEnterTimes < this.peakModel.maxBuyNum) {
            //判断是否有足够的钻石购买
            let curNum = BagUtils.getItemNumById(2);
            let costNum = 0;
            let mainCfg = ConfigManager.getItemByField(Peak_mainCfg, 'reward_type', this.peakModel.reward_type);
            mainCfg.challenge_times.forEach(data => {
                if (data[0] == temStateInfo.buyEnterTimes + 1) {
                    costNum = data[1];
                }
            })
            if (costNum > curNum) {
                if (!GlobalUtil.checkMoneyEnough(costNum, 2, null, [PanelId.PeakView])) {
                    return
                }
            } else {
                let descStr = StringUtils.format(gdk.i18n.t('i18n:PEAK_TIP1'), costNum)//`是否消耗<color=#C7E835>${costNum}</c>钻石购买一次挑战次数？`
                let sureCb = () => {
                    NetManager.send(new icmsg.PeakBuyEnterTimeReq(), (rsp: icmsg.PeakBuyEnterTimeRsp) => {
                        this.peakModel.peakStateInfo.buyEnterTimes = rsp.buyEnterTimes;

                        gdk.gui.showMessage(gdk.i18n.t('i18n:PEAK_TIP11'))
                        //刷新挑战次数
                        this.refreshAttackNum();

                    }, this)
                };
                gdk.panel.open(PanelId.SubInsSweepView, (node: cc.Node) => {
                    let ctrl = node.getComponent(SubInsSweepViewCtrl);
                    ctrl.updateView(descStr, '', sureCb);
                });
            }

        } else {
            gdk.gui.showMessage(gdk.i18n.t('i18n:PEAK_TIP2'))
        }
    }

    //战斗记录
    onAtkList() {
        gdk.panel.open(PanelId.PeakReportView);
        //gdk.gui.showMessage(gdk.i18n.t('i18n:PEAK_TIP3'))
    }

    //英雄详情列表按钮点击事件
    onHeroDetailBtnClick() {
        gdk.panel.open(PanelId.PeakHeroListView);
    }

    //排行榜按钮点击事件
    onRankBtnClick() {
        gdk.panel.open(PanelId.PeakRankView);
    }

    //活动奖励按钮点击事件
    ondzjlBtnClick() {
        gdk.panel.open(PanelId.PeakChallengeRewardView);
    }

    //英雄库按钮点击事件
    onHeroListBtnClick() {
        gdk.panel.setArgs(PanelId.PeakSetUpHeroSelector, 0)
        gdk.panel.open(PanelId.PeakSetUpHeroSelector)
    }
    //英雄转化按钮点击事件
    onHeroChangeBtnClick() {
        gdk.panel.setArgs(PanelId.PeakSetUpHeroSelector, 1)
        gdk.panel.open(PanelId.PeakSetUpHeroSelector)
    }

    //段位按钮点击事件
    DivisionBtnClick(e: cc.Event, idx: string) {
        let division = parseInt(idx);
        let cfg = ConfigManager.getItemByField(Peak_divisionCfg, 'division', division)
        gdk.panel.setArgs(PanelId.PeakDivisionRewardView, cfg);
        gdk.panel.open(PanelId.PeakDivisionRewardView);
    }
}
