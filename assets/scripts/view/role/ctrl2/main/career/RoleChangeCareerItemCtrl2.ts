import ConfigManager from '../../../../../common/managers/ConfigManager';
import CostumeUtils from '../../../../../common/utils/CostumeUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from '../skill/SkillInfoPanelCtrl';
import { Hero_careerCfg } from '../../../../../a/config';

/*
   //英雄切换职业
 * @Author: luoyong 
 * @Date: 2020-02-27 10:33:07 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-25 14:30:55
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/career/RoleChangeCareerItemCtrl2")
export default class RoleChangeCareerItemCtrl2 extends cc.Component {

    @property(cc.Node)
    typeIcon: cc.Node = null

    @property(cc.Label)
    careerLab: cc.Label = null

    @property(cc.Node)
    skillLayer: cc.Node = null

    @property(cc.Node)
    btnNode: cc.Node = null

    @property(cc.Label)
    costLab: cc.Label = null

    @property(cc.Node)
    curCareerState: cc.Node = null

    @property(cc.Prefab)
    skillItem: cc.Prefab = null

    _careerId: number = 0
    _curHeroInfo: icmsg.HeroInfo
    _index = 0

    get heroModel() { return ModelManager.get(HeroModel); }

    updateViewInfo(id, index) {
        this._curHeroInfo = this.heroModel.curHeroInfo
        this._careerId = id
        this._index = index

        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "hero_id", this._curHeroInfo.typeId, { career_id: this._careerId })
        if (this._curHeroInfo.careerId == this._careerId) {
            this.btnNode.active = false
            this.curCareerState.active = true
        } else {
            this.btnNode.active = true
            this.costLab.string = `x${GlobalUtil.numberToStr(careerCfg.trans_cost[1], true)}`
            this.curCareerState.active = false
        }

        GlobalUtil.setSpriteIcon(this.node, this.typeIcon, GlobalUtil.getSoldierTypeIcon(careerCfg.career_type))
        this.careerLab.string = `${careerCfg.name}`

        let skills = HeroUtils.getCareerLineSkills(this._careerId, 0)
        for (let i = 0; i < skills.length; i++) {
            let id = skills[i].skillId
            let skillcfg = GlobalUtil.getSkillCfg(id)
            if (skillcfg && (skillcfg.show >= 1 || skillcfg.type == 501)) {
                continue;
            }
            let node = cc.instantiate(this.skillItem)
            this.skillLayer.addChild(node)
            let icon = node.getChildByName("icon");
            GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getSkillIcon(id))
            node.on(cc.Node.EventType.TOUCH_END, () => {
                this._skillIconClick(id)
            }, this)
        }
    }

    changeCareerFunc() {

        // let heroId = this._curHeroInfo.heroId;
        // let tem1: number[] = GlobalUtil.getLocal('Role_setUpHero_pve');
        // let tem2: number[] = GlobalUtil.getLocal('Role_setUpHero_pvp_arena');
        // let tem3: number[] = GlobalUtil.getLocal('Role_setUpHero_pve_copy');
        // let index1 = tem1 ? tem1.indexOf(heroId) : -1;
        // let index2 = tem2 ? tem2.indexOf(heroId) : -1;
        // let index3 = tem3 ? tem3.indexOf(heroId) : -1;
        // if (index1 >= 0 || index2 >= 0 || index3 >= 0) {
        //     gdk.gui.showMessage(gdk.i18n.t("i18n:ROLE_UP_CANNOT_CHANGECAREER"))
        //     return;
        // }
        let c_cfgs = CostumeUtils.getAllCostumeAttrs(this._curHeroInfo.costumeIds)
        let cur_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this._curHeroInfo.careerId)
        let target_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this._careerId)
        if (cur_careerCfg.career_type != target_careerCfg.career_type && c_cfgs.length > 0) {
            GlobalUtil.openAskPanel({
                title: gdk.i18n.t("i18n:TIP_TITLE"),
                descText: gdk.i18n.t("i18n:ROLE_TIP51"),
                sureText: gdk.i18n.t("i18n:OK"),
                thisArg: this,
                oneBtn: true,
                sureCb: () => {
                    this._changeReq()
                },
            });
            return
        }
        this._changeReq()
    }

    _changeReq() {
        let msg = new icmsg.HeroCareerTransReq()
        msg.heroId = this._curHeroInfo.heroId
        msg.careerId = this._careerId
        NetManager.send(msg, (data: icmsg.HeroCareerTransRsp) => {
            this._curHeroInfo.careerId = data.careerId
            this.heroModel.curHeroInfo = this._curHeroInfo
            this.heroModel.heroDeatils[data.heroId] = data.detail
            gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_TIP15"))
            gdk.panel.hide(PanelId.RoleChangeCareer2)

        })
    }

    _skillIconClick(id) {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            node.y = this._index == 0 ? 80 : -110
            let comp = node.getComponent(SkillInfoPanelCtrl)
            comp.showSkillInfo(id)
        })
    }
}