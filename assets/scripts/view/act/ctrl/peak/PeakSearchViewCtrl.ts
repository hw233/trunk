import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import PeakModel from '../../model/PeakModel';
import PeakUpHeroItemCtrl from './PeakUpHeroItemCtrl';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import { Peak_divisionCfg, Peak_globalCfg } from '../../../../a/config';

/**
 * @Description: 巅峰之战搜索界面
 * @Author: yaozu.hu
 * @Date: 2021-02-23 14:16:01
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-10 17:29:51
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakSearchViewCtrl")
export default class PeakSearchViewCtrl extends gdk.BasePanel {


    @property(cc.Sprite)
    headIcon: cc.Sprite = null;
    @property(cc.Sprite)
    headFream: cc.Sprite = null;
    @property(cc.Node)
    searchNode: cc.Node = null;

    @property(cc.Prefab)
    heroItem: cc.Prefab = null;

    //敌人信息
    @property(cc.Node)
    defenderNode: cc.Node = null;
    @property(cc.Sprite)
    defenderHeadIcon: cc.Sprite = null;
    @property(cc.Sprite)
    defenderHeadFream: cc.Sprite = null;
    @property(cc.Label)
    defenderLv: cc.Label = null;
    @property(cc.Label)
    defenderName: cc.Label = null;
    @property(cc.Label)
    defenderPoint: cc.Label = null;
    @property(cc.Label)
    defenderPowerLb: cc.Label = null;
    @property(cc.Sprite)
    defenderdivisionIcon: cc.Sprite = null;
    @property(cc.Label)
    defenderdivisionName: cc.Label = null;
    @property(cc.Node)
    defenderHeroList: cc.Node = null;

    //自己信息
    @property(cc.Sprite)
    selfHeadIcon: cc.Sprite = null;
    @property(cc.Sprite)
    selfHeadFream: cc.Sprite = null;
    @property(cc.Label)
    selfLv: cc.Label = null;
    @property(cc.Label)
    selfName: cc.Label = null;
    @property(cc.Label)
    selfPoint: cc.Label = null;
    @property(cc.Label)
    selfPowerLb: cc.Label = null;
    @property(cc.Sprite)
    selfdivisionIcon: cc.Sprite = null;
    @property(cc.Label)
    selfdivisionName: cc.Label = null;
    @property(cc.Node)
    selfHeroList: cc.Node = null;


    timeNum = 5;
    canAttack: boolean = false;
    // @property(cc.Node)
    // infoNode: cc.Node = null;

    @property(cc.RichText)
    attackTimeTips: cc.RichText = null;

    @property(cc.Label)
    addPointLb: cc.Label = null;

    @property(cc.Node)
    show1: cc.Node = null;
    @property(cc.Label)
    show1Lb: cc.Label = null;
    // @property(cc.Node)
    // show2: cc.Node = null;
    // @property(cc.Label)
    // show2Lb: cc.Label = null;
    // @property(cc.Node)
    // show3: cc.Node = null;
    // @property(cc.Label)
    // show3Lb: cc.Label = null;

    @property(cc.Button)
    reSendBtn: cc.Button = null;
    @property(cc.Label)
    resetNumLb: cc.Label = null;

    get peakModel() { return ModelManager.get(PeakModel); }
    get roleModel() { return ModelManager.get(RoleModel); }

    headList: number[] = [0, 300011, 300012, 300013, 300014, 300015, 300016]
    headFreamList: number[] = [102006, 102008, 102016, 102021, 102008, 102006, 102021]
    playAnim: boolean = false;
    playAnimTimme: number = 1.2;
    oneAnimTime: number = 0;
    index: number = 0;
    addAnimNum: number = 0;

    attackNum: number = 0;
    resetNum: number = 0;
    freeChange: number = 3;
    onEnable() {

        this.freeChange = ConfigManager.getItemByField(Peak_globalCfg, 'key', 'challenge_limit').value[0]

        this.initSelfData();
        this.sendReq()
    }


    sendReq() {

        //设置剩余次数
        this.refreshMatchingTime();

        this.canAttack = false;
        this.timeNum = 5
        //播放动画
        this.playAnim = true;
        this.playAnimTimme = 1.2;
        this.oneAnimTime = 0;
        this.addAnimNum = 0;
        this.peakModel.PeakMatchData = null;
        this.reSendBtn.interactable = false;
        this.defenderNode.active = false;
        this.headFream.node.active = true;
        this.headIcon.node.active = true;
        this.searchNode.active = true;
        GlobalUtil.setAllNodeGray(this.reSendBtn.node, 1);
        //发送消息
        NetManager.send(new icmsg.PeakMatchingReq(), (rsp: icmsg.PeakMatchingRsp) => {

            this.canAttack = true;
            this.peakModel.PeakMatchData = rsp;
            let tem = this.peakModel.peakStateInfo.matchingTimes + 1
            this.peakModel.peakStateInfo.matchingTimes = Math.min(this.freeChange, tem);
            this.refreshMatchingTime();
        }, this)
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    refreshMatchingTime() {
        this.resetNum = this.freeChange - this.peakModel.peakStateInfo.matchingTimes;
        this.resetNum = Math.max(0, this.resetNum);
        this.resetNumLb.string = this.resetNum + '';
        if (this.resetNum == 0) {
            this.attackTimeTips.node.active = false;
            this.reSendBtn.interactable = false;
            GlobalUtil.setAllNodeGray(this.reSendBtn.node, 1);
        }
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
                    this.initMatchData(this.peakModel.PeakMatchData)
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
        if (this.canAttack && this.timeNum > 0 && this.resetNum > 0) {
            this.timeNum -= dt;
            this.refreshTipTime += dt;
            if (this.refreshTipTime >= 1) {
                this.refreshTipTime -= 1;
                this.attackTimeTips.string = StringUtils.format(gdk.i18n.t("i18n:PEAK_TIP6"), Math.ceil(this.timeNum))//'等待' + Math.ceil(this.timeNum) + '秒'
            }
            if (this.timeNum <= 0) {
                this.attackTimeTips.node.active = false;
                this.reSendBtn.interactable = true;
                GlobalUtil.setAllNodeGray(this.reSendBtn.node, 0);
            }
        }
    }

    initSelfData() {
        let temStateInfo = this.peakModel.peakStateInfo
        let freeNum = ConfigManager.getItemByField(Peak_globalCfg, 'key', 'free_challenge').value[0];
        this.attackNum = freeNum + temStateInfo.buyEnterTimes - temStateInfo.enterTimes
        //this.show1Lb.string = this.attackNum + '/1'

        GlobalUtil.setSpriteIcon(this.node, this.selfHeadFream, GlobalUtil.getHeadFrameById(this.roleModel.frame));
        GlobalUtil.setSpriteIcon(this.node, this.selfHeadIcon, GlobalUtil.getHeadIconById(this.roleModel.head));
        this.selfName.string = this.roleModel.name;
        this.selfPoint.string = temStateInfo.points + '';
        this.selfLv.string = '.' + this.roleModel.level;
        //计算当前上阵英雄战力和
        let powerNum = 0;
        let upHeros = temStateInfo.heroIds;
        let upHeroData: icmsg.PeakHero[] = []
        temStateInfo.heroes.forEach(data => {
            if (upHeros.indexOf(data.typeId) >= 0) {
                powerNum += data.power;
                upHeroData.push(data);
            }
        })
        this.selfPowerLb.string = powerNum + '';
        let divisionCfg = ConfigManager.getItemByField(Peak_divisionCfg, 'division', temStateInfo.rank)
        this.addPointLb.string = divisionCfg.score + ''
        if (divisionCfg) {
            GlobalUtil.setSpriteIcon(this.node, this.selfdivisionIcon, 'view/act/texture/peak/' + divisionCfg.icon)
            this.selfdivisionName.string = divisionCfg.name;
        }

        this.selfHeroList.removeAllChildren();
        upHeroData.forEach(data => {
            let node = cc.instantiate(this.heroItem);
            let ctrl = node.getComponent(PeakUpHeroItemCtrl);
            ctrl.data = { heroData: data, isSelect: false, isHero: false, ordealHero: false, showInfo: true }
            ctrl.updateView();
            node.setParent(this.selfHeroList);

        })


    }

    initMatchData(rsp: icmsg.PeakMatchingRsp) {


        this.headFream.node.active = false;
        this.headIcon.node.active = false;
        this.searchNode.active = false;
        this.defenderNode.active = true;

        GlobalUtil.setSpriteIcon(this.node, this.defenderHeadFream, GlobalUtil.getHeadFrameById(rsp.brief.headFrame));
        GlobalUtil.setSpriteIcon(this.node, this.defenderHeadIcon, GlobalUtil.getHeadIconById(rsp.brief.head));

        this.attackTimeTips.node.active = this.resetNum > 0;
        this.attackTimeTips.string = StringUtils.format(gdk.i18n.t("i18n:CHAMPION_ATTACK_TIP2"), Math.ceil(this.timeNum))//'等待' + Math.ceil(this.timeNum) + '秒'

        this.defenderName.string = rsp.brief.name;
        this.defenderPoint.string = rsp.points + ''
        this.defenderPowerLb.string = rsp.brief.power + '';
        this.defenderLv.string = '.' + rsp.brief.level;
        let rankNum = Math.max(1, rsp.rank)
        let divisionCfg = ConfigManager.getItemByField(Peak_divisionCfg, 'division', rankNum)
        if (divisionCfg) {
            GlobalUtil.setSpriteIcon(this.node, this.defenderdivisionIcon, 'view/act/texture/peak/' + divisionCfg.icon)
            this.defenderdivisionName.string = divisionCfg.name;
        }
        this.defenderHeroList.removeAllChildren();
        rsp.heroes.forEach(data => {
            if (data.typeId > 0) {
                let node = cc.instantiate(this.heroItem);
                let ctrl = node.getComponent(PeakUpHeroItemCtrl);
                //{heroData:icmsg.PeakHero,isSelect:boolean,isHero:boolean,ordealHero:boolean}
                ctrl.data = { heroData: data, isSelect: false, isHero: false, ordealHero: false, showInfo: true }
                ctrl.updateView();
                node.setParent(this.defenderHeroList);
            }
        })

    }

    onAttackBtnClick() {
        if (this.playAnim) return;
        if (this.attackNum <= 0) return;
        let brief: icmsg.RoleBrief = this.peakModel.PeakMatchData.brief
        let player = new icmsg.ArenaPlayer()
        player.name = brief.name
        player.head = brief.head
        player.frame = brief.headFrame
        player.power = brief.power
        JumpUtils.openPveArenaScene([brief.id, 0, player], brief.name, "PEAK");
        gdk.panel.hide(PanelId.PeakSearchView)
    }

    onRescendRspBtnClick() {
        this.sendReq()
    }

}
