import { Hero_careerCfg, Royal_divisionCfg } from "../../../a/config";
import ConfigManager from "../../../common/managers/ConfigManager";
import ModelManager from "../../../common/managers/ModelManager";
import NetManager from "../../../common/managers/NetManager";
import RoleModel from "../../../common/models/RoleModel";
import RoyalModel from "../../../common/models/RoyalModel";
import GlobalUtil from "../../../common/utils/GlobalUtil";
import HeroUtils from "../../../common/utils/HeroUtils";
import UiListItem from "../../../common/widgets/UiListItem";
import PanelId from "../../../configs/ids/PanelId";
import RoleHeroItemCtrl2 from "../../role/ctrl2/selector/RoleHeroItemCtrl2";

/** 
 * @Description: 皇家竞技场挑战记录View
 * @Author: yaozu.hu
 * @Date: 2021-02-23 10:37:28
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-17 17:36:51
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/RoyalArenaReportItemCtrl")
export default class RoyalArenaReportItemCtrl extends UiListItem {



    @property(cc.Node)
    state: cc.Node = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property([cc.Node])
    itemNodes: cc.Node[] = []

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
    selfAddPoint: cc.Label = null;
    @property(cc.Label)
    selfPowerLb: cc.Label = null;
    @property(cc.Sprite)
    selfdivisionIcon: cc.Sprite = null;
    @property(cc.Label)
    selfdivisionName: cc.Label = null;
    @property([cc.Node])
    selfHeros: cc.Node[] = [];

    //敌人信息
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
    defenderAddPoint: cc.Label = null;
    @property(cc.Label)
    defenderPowerLb: cc.Label = null;
    @property(cc.Sprite)
    defenderdivisionIcon: cc.Sprite = null;
    @property(cc.Label)
    defenderdivisionName: cc.Label = null;
    @property([cc.Node])
    defenderHeros: cc.Node[] = [];

    @property([cc.Node])
    stageState: cc.Node[] = []

    info: icmsg.RoyalFightRecord
    get roleModel() { return ModelManager.get(RoleModel); }
    get royalModel() { return ModelManager.get(RoyalModel); }

    updateView() {
        this.info = this.data;
        let colors = ['#FF0000', '#00FF00'];

        let selfData = this.info.player.brief.id == this.roleModel.id ? this.info.player : this.info.opponent;
        let defenderData = this.info.player.brief.id != this.roleModel.id ? this.info.player : this.info.opponent;
        // 设置自己的信息
        GlobalUtil.setSpriteIcon(this.node, this.selfHeadFream, GlobalUtil.getHeadFrameById(selfData.brief.headFrame));
        GlobalUtil.setSpriteIcon(this.node, this.selfHeadIcon, GlobalUtil.getHeadIconById(selfData.brief.head));
        this.selfName.string = selfData.brief.name;
        this.selfPoint.string = selfData.score + '';
        let tem = selfData.addScore > 0 ? '+' : '-'
        this.selfAddPoint.string = `(${tem}${Math.abs(selfData.addScore)})`
        this.selfAddPoint.node.color = cc.color().fromHEX(colors[selfData.addScore >= 0 ? 1 : 0]);
        this.selfLv.string = '.' + selfData.brief.level;
        //计算当前上阵英雄战力和
        let powerNum = 0;
        let upHeros = selfData.heroes
        let selfheroDatas = []
        upHeros.forEach((data, i) => {
            if (data) {
                if (data.soldierId == 0) {
                    let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', data.careerId);
                    data.soldierId = careerCfg.career_type * 100 + 1
                }
                let tem = HeroUtils.createHeroBagItemBy(data)
                if (tem) {
                    selfheroDatas[i] = tem;
                } else {
                    selfheroDatas[i] = null;
                }
                powerNum += data.power;
            } else {
                selfheroDatas[i] = null;
            }
        })

        this.selfPowerLb.string = powerNum + '';
        let divisionCfg = ConfigManager.getItemByField(Royal_divisionCfg, 'division', selfData.div)
        if (divisionCfg) {
            GlobalUtil.setSpriteIcon(this.node, this.selfdivisionIcon, 'view/act/texture/peak/' + divisionCfg.icon)
            this.selfdivisionName.string = divisionCfg.name;
        }

        this.selfHeros.forEach((item, i) => {
            if (selfheroDatas[i]) {
                item.active = true;
                let ctrl = item.getComponent(RoleHeroItemCtrl2)
                ctrl.data = { data: selfheroDatas[i], heros: [], isSelect: false };
                ctrl.updateView();
            } else {
                item.active = false;
            }
        })

        // 设置敌人的信息
        GlobalUtil.setSpriteIcon(this.node, this.defenderHeadFream, GlobalUtil.getHeadFrameById(defenderData.brief.headFrame));
        GlobalUtil.setSpriteIcon(this.node, this.defenderHeadIcon, GlobalUtil.getHeadIconById(defenderData.brief.head));
        this.defenderName.string = defenderData.brief.name;
        this.defenderPoint.string = defenderData.score + '';
        let tem1 = defenderData.addScore > 0 ? '+' : '-'
        this.defenderAddPoint.string = `(${tem1}${Math.abs(defenderData.addScore)})`
        this.defenderAddPoint.node.color = cc.color().fromHEX(colors[defenderData.addScore >= 0 ? 1 : 0]);
        this.defenderLv.string = '.' + defenderData.brief.level;
        //计算当前上阵英雄战力和
        let powerNum1 = 0;
        let upHeros1 = defenderData.heroes
        let defenderheroDatas = []
        upHeros1.forEach((data, i) => {
            if (data) {
                if (data.soldierId == 0) {
                    let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', data.careerId);
                    data.soldierId = careerCfg.career_type * 100 + 1
                }
                let tem = HeroUtils.createHeroBagItemBy(data)
                if (tem) {
                    defenderheroDatas[i] = tem;
                } else {
                    defenderheroDatas[i] = null;
                }
                powerNum1 += data.power;
            } else {
                defenderheroDatas[i] = null;
            }
        })

        this.defenderPowerLb.string = powerNum1 + '';
        let divisionCfg1 = ConfigManager.getItemByField(Royal_divisionCfg, 'division', defenderData.div)
        if (divisionCfg1) {
            GlobalUtil.setSpriteIcon(this.node, this.defenderdivisionIcon, 'view/act/texture/peak/' + divisionCfg1.icon)
            this.defenderdivisionName.string = divisionCfg1.name;
        }
        this.defenderHeros.forEach((item, i) => {
            if (defenderheroDatas[i]) {
                item.active = true;
                let ctrl = item.getComponent(RoleHeroItemCtrl2)
                ctrl.data = { data: defenderheroDatas[i], heros: [], isSelect: false };
                ctrl.updateView();
            } else {
                item.active = false;
            }
        })

        let winFlag = this.info.winFlag
        let win = winFlag == 3 || winFlag == 5 || winFlag == 6
        GlobalUtil.setSpriteIcon(this.node, this.state, 'view/royalArena/texture/view/' + (win ? 'gh_shengzi' : 'gh_fuzi'))

        this.stageState.forEach((node, i) => {
            let temWin = false
            if ((winFlag & 1 << i) > 0) {
                temWin = true;
            }
            GlobalUtil.setSpriteIcon(this.node, node, 'view/royalArena/texture/view/' + (temWin ? 'sjtj_sheng' : 'sjtj_bai'))
        })

        let showItem3 = winFlag != 0 && winFlag != 3
        this.itemNodes[2].active = showItem3
        let time = new Date(this.info.time * 1000);
        this.timeLab.string = `${time.getMonth() + 1}/${time.getDate()} ${time.getHours() >= 10 ? '' : '0'}${time.getHours()}:${time.getMinutes() >= 10 ? '' : '0'}${time.getMinutes()}:${time.getSeconds() >= 10 ? '' : '0'}${time.getSeconds()}`;

    }

    heroList1ItemBtnClick(e, data) {
        let index = parseInt(data)
        let temHeros = this.info.player.heroes.concat();
        let heroData = temHeros[index]
        if (heroData) {
            let msg = new icmsg.RoleHeroImageReq()
            msg.playerId = this.info.player.brief.id
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
        let temHeros = this.info.opponent.heroes.concat();
        let heroData = temHeros[index]
        if (heroData) {
            let msg = new icmsg.RoleHeroImageReq()
            msg.playerId = this.info.opponent.brief.id
            msg.heroId = heroData.heroId
            msg.type = 0;
            NetManager.send(msg, (data: icmsg.RoleHeroImageRsp) => {
                gdk.panel.setArgs(PanelId.MainSetHeroInfoTip, data)
                gdk.panel.open(PanelId.MainSetHeroInfoTip);
            })
        }
    }

}
