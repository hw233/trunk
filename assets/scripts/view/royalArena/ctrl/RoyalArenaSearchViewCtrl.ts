import { Hero_careerCfg, Royal_divisionCfg, Royal_globalCfg, Royal_sceneCfg } from "../../../a/config";
import ConfigManager from "../../../common/managers/ConfigManager";
import ModelManager from "../../../common/managers/ModelManager";
import NetManager from "../../../common/managers/NetManager";
import RoleModel from "../../../common/models/RoleModel";
import RoyalModel from "../../../common/models/RoyalModel";
import GlobalUtil from "../../../common/utils/GlobalUtil";
import HeroUtils from "../../../common/utils/HeroUtils";
import JumpUtils from "../../../common/utils/JumpUtils";
import PanelId from "../../../configs/ids/PanelId";
import RoleHeroItemCtrl2 from "../../role/ctrl2/selector/RoleHeroItemCtrl2";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/RoyalArenaSearchViewCtrl")
export default class RoyalArenaSearchViewCtrl extends gdk.BasePanel {

    @property(cc.Button)
    reSendBtn: cc.Button = null;

    @property(cc.Label)
    resetNumLb: cc.Label = null;

    @property(cc.Node)
    searchBgNode: cc.Node = null;

    @property(cc.Node)
    mapNode: cc.Node = null;

    @property([cc.Node])
    maps: cc.Node[] = []

    @property(cc.Node)
    heroList1: cc.Node = null;

    @property([cc.Node])
    heroList1Items: cc.Node[] = []

    @property(cc.Node)
    heroList2: cc.Node = null;

    @property([cc.Node])
    heroList2Items: cc.Node[] = []

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

    @property(cc.Label)
    addPointLb: cc.Label = null;

    @property(cc.Sprite)
    headIcon: cc.Sprite = null;
    @property(cc.Sprite)
    headFream: cc.Sprite = null;
    // @property(cc.Node)
    // searchNode: cc.Node = null;


    canAttack: boolean = false;
    get royalModel() { return ModelManager.get(RoyalModel); }
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

        this.initSelfData();
        //发送消息
        this.sendReq()
    }

    initSelfData() {
        //let temStateInfo = this.royalModel.peakStateInfo
        let freeNum = ConfigManager.getItemByField(Royal_globalCfg, 'key', 'challenge_limit').value[0];
        this.attackNum = 1//freeNum + temStateInfo.buyEnterTimes - temStateInfo.enterTimes
        //this.show1Lb.string = this.attackNum + '/1'

        GlobalUtil.setSpriteIcon(this.node, this.selfHeadFream, GlobalUtil.getHeadFrameById(this.roleModel.frame));
        GlobalUtil.setSpriteIcon(this.node, this.selfHeadIcon, GlobalUtil.getHeadIconById(this.roleModel.head));
        this.selfName.string = this.roleModel.name;
        this.selfPoint.string = this.royalModel.score + '';
        this.selfLv.string = '.' + this.roleModel.level;
        //计算当前上阵英雄战力和
        let powerNum = 0;
        let temHeroList: number[] = GlobalUtil.getLocal('Royal_setUpHero_atk')
        let upHeros = temHeroList.concat();
        let heroDatas = []

        upHeros.forEach((heroId, i) => {
            let tem = HeroUtils.getHeroItemByHeroId(heroId)
            if (tem) {
                let info = tem.extInfo as icmsg.HeroInfo;
                powerNum += info.power
                heroDatas.push(tem);
            } else {
                heroDatas.push(null);
            }
        })

        this.selfPowerLb.string = powerNum + '';
        let divisionCfg = ConfigManager.getItemByField(Royal_divisionCfg, 'division', this.royalModel.division)
        this.addPointLb.string = divisionCfg.score + ''
        if (divisionCfg) {
            GlobalUtil.setSpriteIcon(this.node, this.selfdivisionIcon, 'view/act/texture/peak/' + divisionCfg.icon)
            this.selfdivisionName.string = divisionCfg.name;
        }

        this.heroList2Items.forEach((item, i) => {
            if (heroDatas[i]) {
                item.active = true;
                let ctrl = item.getComponent(RoleHeroItemCtrl2)
                ctrl.data = { data: heroDatas[i], heros: [], isSelect: false };
                ctrl.updateView();
            } else {
                item.active = false;
            }
        })
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    sendReq() {


        //播放动画
        this.playAnim = true;
        this.playAnimTimme = 1.2;
        this.oneAnimTime = 0;
        this.addAnimNum = 0;
        this.royalModel.playerData = null;
        this.reSendBtn.interactable = false;
        this.defenderNode.active = false;
        this.headFream.node.active = true;
        this.headIcon.node.active = true;

        this.mapNode.active = false;
        this.searchBgNode.active = true;
        this.heroList1.active = false;

        GlobalUtil.setAllNodeGray(this.reSendBtn.node, 1);

        NetManager.send(new icmsg.RoyalMatchReq(), (rsp: icmsg.RoyalMatchRsp) => {

            this.royalModel.matchNum = rsp.matchNum;
            this.canAttack = true;
            this.royalModel.playerData = rsp.opponent;
            // let tem = this.royalModel.peakStateInfo.matchingTimes + 1
            // this.peakModel.peakStateInfo.matchingTimes = Math.min(this.freeChange, tem);
            this.refreshMatchingTime();
        }, this)
    }

    refreshMatchingTime() {
        this.resetNum = this.freeChange - this.royalModel.matchNum;
        this.resetNum = Math.max(0, this.resetNum);
        this.resetNumLb.string = this.resetNum + '';
        if (this.resetNum == 0) {
            //this.attackTimeTips.node.active = false;
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
                    this.initMatchData(this.royalModel.playerData)
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

        // if (this.canAttack && this.timeNum > 0 && this.resetNum > 0) {
        //     this.timeNum -= dt;
        //     this.refreshTipTime += dt;
        //     if (this.refreshTipTime >= 1) {
        //         this.refreshTipTime -= 1;
        //         this.attackTimeTips.string = StringUtils.format(gdk.i18n.t("i18n:PEAK_TIP6"), Math.ceil(this.timeNum))//'等待' + Math.ceil(this.timeNum) + '秒'
        //     }
        //     if (this.timeNum <= 0) {
        //         this.attackTimeTips.node.active = false;
        //         this.reSendBtn.interactable = true;
        //         GlobalUtil.setAllNodeGray(this.reSendBtn.node, 0);
        //     }
        // }
    }


    initMatchData(rsp: icmsg.RoyalBrief) {


        this.headFream.node.active = false;
        this.headIcon.node.active = false;
        this.searchBgNode.active = false;
        this.defenderNode.active = true;
        this.mapNode.active = true;

        GlobalUtil.setSpriteIcon(this.node, this.defenderHeadFream, GlobalUtil.getHeadFrameById(rsp.brief.headFrame));
        GlobalUtil.setSpriteIcon(this.node, this.defenderHeadIcon, GlobalUtil.getHeadIconById(rsp.brief.head));

        if (this.resetNum > 0) {
            //this.attackTimeTips.node.active = false;
            this.reSendBtn.interactable = true;
            GlobalUtil.setAllNodeGray(this.reSendBtn.node, 0);
        }
        // this.attackTimeTips.node.active = this.resetNum > 0;
        // this.attackTimeTips.string = StringUtils.format(gdk.i18n.t("i18n:CHAMPION_ATTACK_TIP2"), Math.ceil(this.timeNum))//'等待' + Math.ceil(this.timeNum) + '秒'

        this.defenderName.string = rsp.brief.name;
        this.defenderPoint.string = rsp.score + ''

        this.defenderLv.string = '.' + rsp.brief.level;
        let divNum = Math.max(1, rsp.div)
        let divisionCfg = ConfigManager.getItemByField(Royal_divisionCfg, 'division', divNum)
        if (divisionCfg) {
            GlobalUtil.setSpriteIcon(this.node, this.defenderdivisionIcon, 'view/act/texture/peak/' + divisionCfg.icon)
            this.defenderdivisionName.string = divisionCfg.name;
        }
        //设置场地地图
        this.maps.forEach((node, i) => {
            let sceneCfg = ConfigManager.getItemById(Royal_sceneCfg, rsp.maps[i])
            let path = 'map/' + sceneCfg.background
            GlobalUtil.setSpriteIcon(this.node, node, path);
        })

        this.heroList1.active = true;

        let heroDatas = []
        let powerNum = 0;
        for (let i = 0, n = rsp.heroes.length; i < n; i++) {
            let data = rsp.heroes[i]
            if (data) {
                if (data.soldierId == 0) {
                    let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', data.careerId);
                    data.soldierId = careerCfg.career_type * 100 + 1
                }
                let tem = HeroUtils.createHeroBagItemBy(data);
                if (tem) {
                    heroDatas.push(tem);
                } else {
                    heroDatas.push(null);
                }
                powerNum += data.power;
            } else {
                heroDatas.push(null);
            }
        }
        this.defenderPowerLb.string = powerNum + ''//rsp.brief.power + '';
        // rsp.heroes.forEach((heroData, i) => {
        //     if (heroData.soldierId == 0) {
        //         let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', heroData.careerId);
        //         heroData.soldierId = careerCfg.career_type * 100 + 1
        //     }
        //     let tem = HeroUtils.createHeroBagItemBy(heroData)
        //     if (tem) {
        //         // let info = tem.extInfo as icmsg.HeroInfo;
        //         // powerNum += info.power
        //         heroDatas.push(tem);
        //     } else {
        //         heroDatas.push(null);
        //     }
        // })

        this.heroList1Items.forEach((item, i) => {
            if (heroDatas[i]) {
                item.active = true;
                let ctrl = item.getComponent(RoleHeroItemCtrl2)
                ctrl.data = { data: heroDatas[i], heros: [], isSelect: false };
                ctrl.updateView();
            } else {
                item.active = false;
            }
        })
        // this.defenderHeroList.removeAllChildren();
        // rsp.heroes.forEach(data => {
        //     if (data.typeId > 0) {
        //         let node = cc.instantiate(this.heroItem);
        //         let ctrl = node.getComponent(PeakUpHeroItemCtrl);
        //         //{heroData:icmsg.PeakHero,isSelect:boolean,isHero:boolean,ordealHero:boolean}
        //         ctrl.data = { heroData: data, isSelect: false, isHero: false, ordealHero: false, showInfo: true }
        //         ctrl.updateView();
        //         node.setParent(this.defenderHeroList);
        //     }
        // })

    }


    onAttackBtnClick() {
        if (!this.canAttack) return;
        if (this.playAnim) return;
        if (this.attackNum <= 0) return;

        let model = this.royalModel;
        model.clearTestFightData();
        model.curFightNum = 0;
        let sceneCfg = ConfigManager.getItemById(Royal_sceneCfg, model.playerData.maps[model.curFightNum])
        model.winElite = {};
        sceneCfg.victory.forEach(data => {
            switch (data[0]) {
                case 1:
                case 2:
                case 3:
                    model.winElite[data[0]] = data[1];
                    break
                case 4:
                case 5:
                    model.winElite[data[0]] = true;
                    break;
                case 6:
                    model.winElite[data[0]] = [data[1], data[2]];
            }
        })

        let brief: icmsg.RoleBrief = this.royalModel.playerData.brief
        let player = new icmsg.ArenaPlayer()
        player.name = brief.name
        player.head = brief.head
        player.frame = brief.headFrame
        player.power = brief.power
        JumpUtils.openPveArenaScene([brief.id, 0, player], brief.name, "ROYAL");
        gdk.panel.hide(PanelId.RoyalArenaSearchView)
    }

    onRescendRspBtnClick() {
        this.sendReq()
    }


    heroList1ItemBtnClick(e, data) {

        let index = parseInt(data)
        let temHeros = this.royalModel.playerData.heroes.concat();
        let heroData = temHeros[index]
        if (heroData) {
            let msg = new icmsg.RoleHeroImageReq()
            msg.playerId = this.royalModel.playerData.brief.id
            msg.heroId = heroData.heroId
            msg.type = 0;
            NetManager.send(msg, (data: icmsg.RoleHeroImageRsp) => {
                gdk.panel.setArgs(PanelId.MainSetHeroInfoTip, data)
                gdk.panel.open(PanelId.MainSetHeroInfoTip);
            })
        }


    }

    heroList2ItemBtnClick(e, data) {

        let index = parseInt(data)
        let temHeroList: number[] = GlobalUtil.getLocal('Royal_setUpHero_atk')
        let heroData = temHeroList[index]
        if (heroData) {
            let msg = new icmsg.RoleHeroImageReq()
            msg.playerId = this.roleModel.id
            msg.heroId = heroData
            msg.type = 0;
            NetManager.send(msg, (data: icmsg.RoleHeroImageRsp) => {
                gdk.panel.setArgs(PanelId.MainSetHeroInfoTip, data)
                gdk.panel.open(PanelId.MainSetHeroInfoTip);
            })
        }
    }

}
