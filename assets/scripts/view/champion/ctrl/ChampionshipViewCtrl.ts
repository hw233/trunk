import ActUtil from '../../act/util/ActUtil';
import BagUtils from '../../../common/utils/BagUtils';
import ChampionModel from '../model/ChampionModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import { Champion_divisionCfg, Champion_dropCfg, Champion_mainCfg } from '../../../a/config';

/**
 * @Description: 锦标赛界面
 * @Author: yaozu.hu
 * @Date: 2020-11-26 14:03:28
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-22 19:48:59
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChampionshipEnterViewCtrl")
export default class ChampionshipView extends gdk.BasePanel {

    @property(cc.Sprite)
    headFrame: cc.Sprite = null;
    @property(cc.Sprite)
    headIcon: cc.Sprite = null;
    @property(cc.Label)
    pointLb: cc.Label = null;
    @property(cc.Label)
    scoreLb: cc.Label = null;
    @property(cc.Sprite)
    divisionIcon: cc.Sprite = null;
    @property(cc.Label)
    endTimeLb: cc.Label = null;

    @property(cc.Node)
    curDivisionNode: cc.Node = null;
    @property(gdk.List)
    curRewardList: gdk.List = null;
    @property(cc.Label)
    curPointLb: cc.Label = null;
    @property(cc.Label)
    curScoreLb: cc.Label = null;
    @property(cc.Sprite)
    curDivisionIcon: cc.Sprite = null;
    @property(cc.Node)
    boxRedNode: cc.Node = null;
    @property(cc.Node)
    jinduNode: cc.Node = null;
    @property(cc.Label)
    jinduLb: cc.Label = null;

    @property(cc.Node)
    oldDivisionNode: cc.Node = null;
    @property(cc.Label)
    oldPointLb: cc.Label = null;
    @property(cc.Label)
    oldDivisionName: cc.Label = null;
    @property(cc.Sprite)
    oldDivisionIcon: cc.Sprite = null;


    @property(cc.Node)
    nextDivisionNode: cc.Node = null;
    @property(gdk.List)
    nextRewardList: gdk.List = null;
    @property(cc.Label)
    nextPointLb: cc.Label = null;
    @property(cc.Label)
    nextScoreLb: cc.Label = null;
    @property(cc.Label)
    nextDivisionName: cc.Label = null;
    @property(cc.Sprite)
    nextDivisionIcon: cc.Sprite = null;

    @property(cc.Node)
    show1: cc.Node = null;
    @property(cc.Label)
    show1Lb: cc.Label = null;
    @property(cc.Node)
    show2: cc.Node = null;
    @property(cc.Label)
    show2Lb: cc.Label = null;
    @property(cc.Node)
    show3: cc.Node = null;
    @property(cc.Label)
    show3Lb: cc.Label = null;

    @property(cc.Node)
    defenceRedPoint: cc.Node = null;

    @property(cc.Label)
    freeNumLb: cc.Label = null;

    get heroModel() { return ModelManager.get(HeroModel); }
    get roleModel() { return ModelManager.get(RoleModel); }
    cfg: Champion_mainCfg;

    isEnd: boolean = false;
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
    get championModel() { return ModelManager.get(ChampionModel); }

    showGoodsList: icmsg.GoodsInfo[] = []
    playAnim: boolean = false

    freeNumTime: number = 0;
    isSend: boolean = false;
    showFreeTime: boolean = false;
    sendInfo: boolean = false;
    onEnable() {
        this.isEnd = false
        this.showGoodsList = []
        this.playAnim = this.championModel.isUpDivision;

        //判断是否有新的可领取段位奖励
        let infoData = this.championModel.infoData;
        this.cfg = null;
        let cfg: Champion_mainCfg = ConfigManager.getItemById(Champion_mainCfg, infoData.seasonId);
        if (cfg) {
            this.cfg = cfg;
        }
        if (infoData.level > infoData.lvRewarded && infoData.level > 1) {
            //发送领取段位奖励消息
            NetManager.send(new icmsg.ChampionLvRewardsReq(), (rsp: icmsg.ChampionLvRewardsRsp) => {
                infoData.lvRewarded = infoData.level;
                if (!this.playAnim) {
                    gdk.panel.setArgs(PanelId.ChampionUpRewardView, rsp.goodsList);
                    gdk.panel.open(PanelId.ChampionUpRewardView);
                } else {
                    this.showGoodsList = rsp.goodsList;
                }
                //刷新当前奖励领取状态
                let curCfg = ConfigManager.getItemByField(Champion_divisionCfg, 'lv', infoData.level);
                let temState = 0;
                if (curCfg.lv <= infoData.lvRewarded) {
                    temState = 1;
                }
                let data = []
                let dropCfg = ConfigManager.getItem(Champion_dropCfg, { 'season': infoData.seasonId, 'lv': curCfg.lv })
                if (curCfg.lv > 1) {
                    dropCfg.drop_division.forEach(item => {
                        let temData = [item[0], item[1], temState]
                        data.push(temData);
                    })
                }
                this.curRewardList.datas = data
            }, this)
        }
        NetManager.on(icmsg.ChampionInfoRsp.MsgType, this.refreshInfo, this)
        //更新个人信息
        this.initSelfData()
        //更新段位信息
        this.initDivisionData()
    }

    _dtime: number = 0;
    update(dt: number) {
        if (!this.leftTime) {
            return;
        }
        this._dtime += dt;

        if (this.showFreeTime) {
            if (this.freeNumTime > 0) {
                this.freeNumTime -= dt;
            } else if (!this.sendInfo && this.championModel.infoData.freeFightNum > 0) {
                this.sendInfo = true;
                NetManager.send(new icmsg.ChampionInfoReq())
            }
        }

        if (this._dtime >= 1) {
            this._dtime -= 1;
            this._updateTime();
            if (this.showFreeTime && this.freeNumTime > 0) {
                this.freeNumLb.string = TimerUtils.format2(Math.floor(this.freeNumTime));
            }
        }
    }

    onDisable() {
        NetManager.targetOff(this)
    }

    refreshInfo(rsp: icmsg.ChampionInfoRsp) {
        this.championModel.infoData = rsp;
        this.showEnterNumInfo()
    }
    //更新个人信息
    initSelfData() {
        //设置头像信息
        let roleModel = ModelManager.get(RoleModel)

        GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(roleModel.frame));
        GlobalUtil.setSpriteIcon(this.node, this.headIcon, GlobalUtil.getHeadIconById(roleModel.head));

        let infoData = this.championModel.infoData
        let curCfg = ConfigManager.getItemByField(Champion_divisionCfg, 'lv', infoData.level);
        let path2 = 'view/champion/texture/champion/jbs_duanwei0' + curCfg.division;
        GlobalUtil.setSpriteIcon(this.node, this.divisionIcon, path2);

        //设置个人段位信息
        this.pointLb.string = infoData.points + ''
        this.scoreLb.string = roleModel.champion + ''

        //设置结束时间
        this._updateTime();


    }

    @gdk.binding('roleModel.champion')
    updateMoney() {
        this.scoreLb.string = this.roleModel.champion + ''
    }

    //更新段位信息
    initDivisionData() {
        let infoData = this.championModel.infoData
        let season = this.championModel.infoData.seasonId

        this.showEnterNumInfo()

        let curCfg = ConfigManager.getItemByField(Champion_divisionCfg, 'lv', infoData.level);
        let nextCfg = ConfigManager.getItemByField(Champion_divisionCfg, 'lv', curCfg.lv + 1);
        let oldCfg = ConfigManager.getItemByField(Champion_divisionCfg, 'lv', curCfg.lv - 1);

        this.curPointLb.string = curCfg.point + (nextCfg ? '-' + (nextCfg.point - 1) : '')
        this.curScoreLb.string = curCfg.c_point + gdk.i18n.t("i18n:CHAMPION_VIEW_TIP1")
        let data = []
        let dropCfg = ConfigManager.getItem(Champion_dropCfg, { 'season': season, 'lv': curCfg.lv })
        let temState = 0;
        if (curCfg.lv <= infoData.lvRewarded) {
            temState = 1;
        }
        if (curCfg.lv > 1) {
            dropCfg.drop_division.forEach(item => {
                let temData = [item[0], item[1], temState]
                data.push(temData);
            })
        }

        this.curRewardList.datas = data
        this.boxRedNode.active = infoData.score > 0;
        this.jinduLb.string = infoData.score + '/10000'
        this.jinduNode.width = infoData.score / 10000 * 120




        this.nextDivisionNode.active = nextCfg != null;
        if (nextCfg) {
            let temCfgs = ConfigManager.getItemByField(Champion_divisionCfg, 'lv', nextCfg.lv + 1)
            // let path1 = 'view/champion/texture/champion/jbs_duanweimingcheng0' + nextCfg.division;
            // GlobalUtil.setSpriteIcon(this.node, this.nextDivisionName, path1);
            let path2 = 'view/champion/texture/champion/jbs_duanwei0' + nextCfg.division;
            GlobalUtil.setSpriteIcon(this.node, this.nextDivisionIcon, path2);
            this.nextDivisionName.string = nextCfg.name;
            this.nextPointLb.string = nextCfg.point + (temCfgs ? '-' + (temCfgs.point - 1) : '')//'~' + temCfgs.point
            this.nextScoreLb.string = nextCfg.c_point + gdk.i18n.t("i18n:CHAMPION_VIEW_TIP1")
            let data = []
            let dropCfg = ConfigManager.getItem(Champion_dropCfg, { 'season': season, 'lv': nextCfg.lv })

            let temState = 0;
            if (nextCfg.lv <= infoData.lvRewarded) {
                temState = 1;
            }
            dropCfg.drop_division.forEach(item => {
                let temData = [item[0], item[1], temState]
                data.push(temData);
            })
            this.nextRewardList.datas = data
        }

        this.oldDivisionNode.active = oldCfg != null;
        if (oldCfg) {

            this.oldDivisionName.string = oldCfg.name
            let path2 = 'view/champion/texture/champion/jbs_duanwei0' + oldCfg.division;
            GlobalUtil.setSpriteIcon(this.node, this.oldDivisionIcon, path2);
            this.oldPointLb.string = oldCfg.point + '-' + (curCfg.point - 1)
            GlobalUtil.setAllNodeGray(this.oldDivisionNode, 1)
        }
        //this.championModel.isUpDivision = true;
        this.championModel.isUpDivision && this.playUpAnim();

    }

    //设置进入次数显示
    showEnterNumInfo() {
        this.sendInfo = false;
        let infoData = this.championModel.infoData
        let num1 = BagUtils.getItemNumById(150003)
        if (infoData.freeFightNum > 0) {
            this.show1.active = false;
            this.show3.active = false;
            this.show2.active = true;
            this.show2Lb.string = infoData.freeFightNum + '/5'
        } else if (num1 > 0) {
            this.show1.active = true;
            this.show2.active = false;
            this.show3.active = false;
            this.show1Lb.string = num1 + '/1'
        } else {
            let num2 = 0
            this.cfg.ex_cost.forEach(data => {
                if (num2 == 0) {
                    num2 = data[1];
                } else if (infoData.boughtFightNum + 1 >= data[0]) {
                    num2 = data[1];
                }
            })
            this.show1.active = false;
            this.show2.active = false;
            this.show3.active = true;
            this.show3Lb.string = num2 + ''
        }

        //设置免费的时间;
        if (this.isEnd || !this.cfg || infoData.freeRecoverTime == 0) {
            this.freeNumLb.node.parent.active = false;
            this.showFreeTime = false;
        } else {
            this.showFreeTime = true;
            this.freeNumLb.node.parent.active = true;
            let resTime = this.cfg.restore * 60 * 60 * 1000
            let curTime = GlobalUtil.getServerTime();
            let startTime = infoData.freeRecoverTime * 1000;
            let tem = curTime - startTime;
            if (tem > resTime) {
                //超过4小时了 发送消息 请求最新数据
                this.freeNumTime = 0;
                this.freeNumLb.string = TimerUtils.format2(this.freeNumTime)
            } else {
                this.freeNumTime = Math.floor((resTime - tem) / 1000);
                this.freeNumLb.string = TimerUtils.format2(this.freeNumTime)
            }
        }
    }

    playUpAnim() {
        //365  75  -235 
        this.championModel.isUpDivision = false
        if (this.nextDivisionNode.active) {
            let tween1 = new cc.Tween()
            this.nextDivisionNode.scale = 0;
            this.nextDivisionNode.position = cc.v2(0, 395);
            tween1.target(this.nextDivisionNode)
                .delay(0.2)
                .to(0.5, { scale: 0.8, position: cc.v2(0, 365) })
                .call(() => {
                    tween1 = null;
                })
                .start()
        }
        let tween2 = new cc.Tween()
        this.curDivisionNode.scale = 0.8;
        this.curDivisionNode.position = cc.v2(0, 365);
        tween2.target(this.curDivisionNode)
            .delay(0.1)
            .to(0.5, { scale: 1, position: cc.v2(0, 75) })
            .call(() => {
                tween2 = null;
                this.playAnim = false;
                gdk.Timer.once(200, this, () => {
                    let infoData = this.championModel.infoData
                    if (this.showGoodsList.length == 0 && infoData.level > infoData.lvRewarded) return;
                    gdk.panel.setArgs(PanelId.ChampionUpRewardView, this.showGoodsList);
                    gdk.panel.open(PanelId.ChampionUpRewardView);
                })
            })
            .start()

        if (this.oldDivisionNode.active) {
            let tween3 = new cc.Tween()
            this.oldDivisionNode.scale = 1;
            this.oldDivisionNode.position = cc.v2(0, 75);
            tween3.target(this.oldDivisionNode)
                .delay(0.08)
                .to(0.5, { scale: 0.8, position: cc.v2(0, -235) })
                .call(() => {
                    tween3 = null;
                })
                .start()
        }

    }

    //挑战按钮点击事件
    onAttackBtnClick() {

        //判断活动是否已经结束
        if (!this.cfg) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3"));
            return;
        }
        // let curTime = GlobalUtil.getServerTime();
        // let c = this.cfg.close_time.split('/');
        // let ct = new Date(c[0] + '/' + c[1] + '/' + c[2] + ' ' + c[3] + ':' + c[4] + ':' + c[5]).getTime();
        // if (ct - curTime <= 0) {
        //     gdk.gui.showMessage(gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3"));
        //     return;
        // }
        if (!ActUtil.ifActOpen(122)) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3"));
            return
        }
        this.championModel.addBuyNum = false;
        let num = BagUtils.getItemNumById(150003)
        let infoData = this.championModel.infoData;
        if (infoData.freeFightNum <= 0 && num <= 0) {
            let num2 = 0
            this.cfg.ex_cost.forEach(data => {
                if (num2 == 0) {
                    num2 = data[1];
                } else if (infoData.boughtFightNum + 1 >= data[0]) {
                    num2 = data[1];
                }
            })
            let temNum = this.roleModel.gems
            if (num2 > temNum) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:CHAMPION_VIEW_TIP2"))
                return;
            }
            this.championModel.addBuyNum = true;
        }
        gdk.panel.open(PanelId.ChampionshipAttackView);
    }

    //打开防守阵营
    openDefentList() {
        gdk.panel.setArgs(PanelId.RoleSetUpHeroSelector, 1, 4)
        gdk.panel.open(PanelId.RoleSetUpHeroSelector);
    }

    //战斗记录
    onAtkList() {
        gdk.panel.open(PanelId.ChampionReportView);
    }

    //排行榜按钮点击事件
    onRankBtnClick() {
        gdk.panel.open(PanelId.ChampionRankView);
    }

    //活动奖励按钮点击事件
    onhdjlBtnClick() {
        gdk.panel.open(PanelId.ChampionGradeView);
    }

    //积分商店按钮点击事件
    onjfsdBtnClick() {
        gdk.panel.open(PanelId.ChampionExchangeView);
    }

    //有奖竞猜按钮点击事件
    onyjjcBtnClick() {
        // let cfg: Champion_mainCfg = ConfigManager.getItemById(Champion_mainCfg, ModelManager.get(ChampionModel).infoData.seasonId);
        // let curTime = GlobalUtil.getServerTime();
        // let o = cfg.open_time.split('/');
        // let c = cfg.close_time.split('/');
        // let ot = new Date(o[0] + '/' + o[1] + '/' + o[2] + ' ' + o[3] + ':' + o[4] + ':' + o[5]).getTime();
        // let ct = new Date(c[0] + '/' + c[1] + '/' + c[2] + ' ' + c[3] + ':' + c[4] + ':' + c[5]).getTime();
        // let openTime = ot + 86400 * 1000;
        // if (curTime < openTime) {
        //     let d = new Date(openTime);
        //     gdk.gui.showMessage(gdk.i18n.t("i18n:CHAMPION_VIEW_TIP3") + `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours() >= 10 ? '' : '0'}${d.getHours()}:${d.getMinutes() >= 10 ? '' : '0'}${d.getMinutes()}:${d.getSeconds() >= 10 ? '' : '0'}${d.getSeconds() - 1}`);
        //     return;
        // }
        // if (curTime > ct) {
        //     gdk.gui.showMessage(gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3"));
        //     return;
        // }
        let curTime = GlobalUtil.getServerTime();
        let ot = ActUtil.getActStartTime(122);
        let ct = ActUtil.getActEndTime(122);
        let openTime = ot + 86400 * 1000;
        if (!ot || !ct) {
            gdk.gui.showMessage("ACTIVITY_TIME_TIP3");
            return;
        }
        if (curTime < openTime) {
            let d = new Date(openTime);
            gdk.gui.showMessage(gdk.i18n.t("i18n:CHAMPION_VIEW_TIP3") + `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours() >= 10 ? '' : '0'}${d.getHours()}:${d.getMinutes() >= 10 ? '' : '0'}${d.getMinutes()}:${d.getSeconds() >= 10 ? '' : '0'}${d.getSeconds()}`);
            return;
        }
        if (curTime > ct) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3"));
            return;
        }
        JumpUtils.openPanel({
            panelId: PanelId.ChampionGuessView,
            currId: this.node
        })
    }

    ExitBtnClick() {
        // gdk.panel.open(PanelId.ChampionshipEnterView);
        this.close()
    }

    fetScoreBtnClick() {
        if (this.championModel.infoData && this.championModel.infoData.score > 0) {
            NetManager.send(new icmsg.ChampionFetchScoreReq(), (rsp: icmsg.ChampionFetchScoreRsp) => {
                this.championModel.infoData.score = 0;
                this.scoreLb.string = rsp.newScore + '';
                this.boxRedNode.active = false;
                this.jinduLb.string = 0 + '/10000'
                this.jinduNode.width = 0;

                let tem = new icmsg.GoodsInfo;
                tem.typeId = 24
                tem.num = rsp.fetchScore;
                GlobalUtil.openRewadrView([tem])
            }, this)
        }
    }

    endTime: number = 0;
    _updateTime() {
        // this.cfg = null;
        // let cfg: Champion_mainCfg = ConfigManager.getItemById(Champion_mainCfg, ModelManager.get(ChampionModel).infoData.seasonId);
        // if (cfg) {
        //     // let curTime = GlobalUtil.getServerTime();
        //     // let c = cfg.close_time.split('/');
        //     // let ct = new Date(c[0] + '/' + c[1] + '/' + c[2] + ' ' + c[3] + ':' + c[4] + ':' + c[5]).getTime();
        //     // this.leftTime = ct - curTime;
        //     // if (ActUtil.ifActOpen(122)) {
        //     //     let curTime = GlobalUtil.getServerTime();
        //     //     let ct = ActUtil.getActEndTime(122);
        //     //     this.leftTime = ct - curTime;
        //     // } else {
        //     //     this.endTimeLb.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3");
        //     // }
        //     this.cfg = cfg;
        // }
        if (this.endTime) {
            let curTime = GlobalUtil.getServerTime();
            this.leftTime = this.endTime - curTime;
        } else {
            if (ActUtil.ifActOpen(122)) {
                let curTime = GlobalUtil.getServerTime();
                this.endTime = ActUtil.getActEndTime(122)
                this.leftTime = this.endTime - curTime;
            } else {
                this.endTimeLb.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3");
            }
        }

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
                    if (ids.indexOf(datas[j].heroId) == -1 && heroInfo.level < datas[j].level) {
                        this.defenceRedPoint.active = true
                        return
                    }
                }
            }
        }
    }
}
