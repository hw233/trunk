import { Champion_mainCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import PanelId from '../../../configs/ids/PanelId';
import ChampionModel from '../model/ChampionModel';

/**
 * @Description: 锦标赛挑战界面
 * @Author: yaozu.hu
 * @Date: 2020-11-26 14:03:28
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-26 16:17:13
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChampionshipEnterViewCtrl")
export default class ChampionshipAttackViewCtrl extends gdk.BasePanel {


    @property(cc.Sprite)
    headIcon: cc.Sprite = null;
    @property(cc.Sprite)
    headFream: cc.Sprite = null;
    @property(cc.Label)
    playerName: cc.Label = null;
    @property(cc.Label)
    point: cc.Label = null;
    @property(cc.Label)
    powerLb: cc.Label = null;

    @property(cc.Label)
    addPoint: cc.Label = null;
    timeNum = 5;
    canAttack: boolean = false;
    @property(cc.Node)
    infoNode: cc.Node = null;

    @property(cc.Label)
    attackTimeTips: cc.Label = null;

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

    @property(cc.Button)
    reSendBtn: cc.Button = null;

    get championModel() { return ModelManager.get(ChampionModel); }


    headList: number[] = [0, 300011, 300012, 300013, 300014, 300015, 300016]
    headFreamList: number[] = [102006, 102008, 102016, 102021, 102008, 102006, 102021]
    playAnim: boolean = false;
    playAnimTimme: number = 1.2;
    oneAnimTime: number = 0;
    index: number = 0;
    addAnimNum: number = 0;
    onEnable() {
        this.sendReq()
    }


    sendReq() {
        this.canAttack = false;
        this.timeNum = 5
        //播放动画
        this.playAnim = true;
        this.playAnimTimme = 1.2;
        this.oneAnimTime = 0;
        this.infoNode.active = false;
        this.addAnimNum = 0;
        this.championModel.championMatchData = null;
        this.championModel.championFightData = null;
        this.reSendBtn.interactable = false;
        //发送消息
        NetManager.send(new icmsg.ChampionMatchReq(), (rsp: icmsg.ChampionMatchRsp) => {

            this.canAttack = true;
            this.championModel.championMatchData = rsp;
        }, this)
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    refreshTipTime = 0;
    update(dt: number) {
        if (this.playAnim && this.playAnimTimme > 0) {
            this.playAnimTimme -= dt;
            this.oneAnimTime += dt;
            if (this.oneAnimTime >= 0.05) {
                this.oneAnimTime -= 0.05;
                GlobalUtil.setSpriteIcon(this.node, this.headFream, GlobalUtil.getHeadFrameById(this.headFreamList[this.index]));
                GlobalUtil.setSpriteIcon(this.node, this.headIcon, GlobalUtil.getHeadIconById(this.headList[this.index]));
                this.index++;
                if (this.index >= this.headList.length) {
                    this.index = 0;
                }
            }
            if (this.playAnimTimme < 0) {
                if (this.canAttack) {
                    this.playAnim = false;
                    //设置排名信息
                    this.initMatchData(this.championModel.championMatchData)
                } else {
                    this.playAnimTimme = 1;
                    this.addAnimNum += 1;
                    if (this.addAnimNum > 8) {
                        gdk.gui.showMessage(gdk.i18n.t("i18n:CHAMPION_ATTACK_TIP1"))
                        this.close()
                        return;
                    }
                }
            }
            return
        }
        if (this.canAttack && this.timeNum > 0) {
            this.timeNum -= dt;
            this.refreshTipTime += dt;
            // if (this.refreshTipTime >= 1) {
            //     this.refreshTipTime -= 1;
            //     this.attackTimeTips.string = StringUtils.format(gdk.i18n.t("i18n:CHAMPION_ATTACK_TIP2"), Math.ceil(this.timeNum))//'等待' + Math.ceil(this.timeNum) + '秒'
            // }
            // if (this.timeNum <= 0) {
            //     this.attackTimeTips.node.active = false;
            //     this.reSendBtn.interactable = true;
            //     GlobalUtil.setAllNodeGray(this.reSendBtn.node, 0);
            // }
        }
    }

    @gdk.binding("championModel.reMatchTimes")
    _updateRematchTimes() {
        let t = this.championModel.reMatchTimes;
        this.attackTimeTips.string = `剩余次数 ${3 - t}/3`;
        this.reSendBtn.interactable = t < 3;
        GlobalUtil.setAllNodeGray(this.reSendBtn.node, t < 3 ? 0 : 1);
    }

    initMatchData(rsp: icmsg.ChampionMatchRsp) {
        this.infoNode.active = true;
        GlobalUtil.setSpriteIcon(this.node, this.headFream, GlobalUtil.getHeadFrameById(rsp.opponent.brief.headFrame));
        GlobalUtil.setSpriteIcon(this.node, this.headIcon, GlobalUtil.getHeadIconById(rsp.opponent.brief.head));
        this.playerName.string = rsp.opponent.brief.name;
        this.addPoint.string = rsp.addPoints + '';
        this.point.string = rsp.opponent.points + '';
        this.powerLb.string = rsp.opponent.brief.power + '';
        // this.attackTimeTips.node.active = true
        // this.attackTimeTips.string = StringUtils.format(gdk.i18n.t("i18n:CHAMPION_ATTACK_TIP2"), Math.ceil(this.timeNum))//'等待' + Math.ceil(this.timeNum) + '秒'
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
            let temCfg: Champion_mainCfg;
            //let cfgs = ConfigManager.getItems(Champion_mainCfg);
            //let cTime: number;
            //let curTime = GlobalUtil.getServerTime();
            // for (let i = 0; i < cfgs.length; i++) {
            //     let o = cfgs[i].open_time.split('/');
            //     let c = cfgs[i].close_time.split('/');
            //     let ot = new Date(o[0] + '/' + o[1] + '/' + o[2] + ' ' + o[3] + ':' + o[4] + ':' + o[5]).getTime();
            //     let ct = new Date(c[0] + '/' + c[1] + '/' + c[2] + ' ' + c[3] + ':' + c[4] + ':' + c[5]).getTime();
            //     if (curTime >= ot && curTime <= ct) {
            //         temCfg = cfgs[i];
            //         cTime = ct;
            //         break;
            //     }
            // }
            temCfg = ConfigManager.getItemById(Champion_mainCfg, this.championModel.infoData.seasonId);
            //cTime = ActUtil.getActEndTime(122);

            temCfg.ex_cost.forEach(data => {
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

    }

    onAttackBtnClick() {
        if (this.playAnim) return;
        let brief: icmsg.RoleBrief = this.championModel.championMatchData.opponent.brief
        let player = new icmsg.ArenaPlayer()
        player.name = brief.name
        player.head = brief.head
        player.frame = brief.headFrame
        player.power = brief.power
        JumpUtils.openPveArenaScene([brief.id, 0, player], brief.name, "CHAMPION_MATCH");
        // gdk.panel.hide(PanelId.ChampionshipEnterView)
        gdk.panel.hide(PanelId.ChampionshipAttackView)
        // gdk.panel.hide(PanelId.ChampionshipView)
    }

    onRescendRspBtnClick() {
        this.sendReq()
    }

}
