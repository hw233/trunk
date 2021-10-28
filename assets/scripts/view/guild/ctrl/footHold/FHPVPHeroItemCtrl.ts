import CareerIconItemCtrl from '../../../role/ctrl2/main/career/CareerIconItemCtrl';
import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel, { FhPointInfo } from './FootHoldModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import {
    Hero_careerCfg,
    Hero_starCfg,
    HeroCfg,
    Monster2Cfg,
    SoldierCfg
    } from '../../../../a/config';

/** 
 * PVP副本战斗准备界面敌方英雄头像
 * @Author: yaozu.hu  
 * @Date: 2019-09-24 13:43:09
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-20 16:48:36
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHPVPHeroItemCtrl")
export default class FHPVPHeroItemCtrl extends gdk.ItemRenderer {

    @property(cc.Prefab)
    iconPrefab: cc.Prefab = null;

    @property(cc.Node)
    flag: cc.Node = null;

    @property(cc.Node)
    soldierIcon: cc.Node = null;

    @property(cc.Node)
    bloodNode: cc.Node = null;

    @property(cc.Node)
    careerIconItem: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null

    icon: UiSlotItem;
    data: {
        hero: icmsg.FightDefendHero
        is_monster: boolean,
    };

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    updateView() {
        if (!this.data) return;
        if (!this.icon) {
            let node = cc.instantiate(this.iconPrefab);
            node.scaleX = node.scaleY = 0.9
            this.node.addChild(node, -1);
            this.icon = node.getComponent(UiSlotItem);
        }

        // 英雄或怪物头像
        let cfg: HeroCfg = ConfigManager.getItemById(HeroCfg, this.data.hero.typeId);
        let icon = ""
        //cfg = ConfigManager.getItemById(HeroCfg, this.data.hero.typeId);
        //icon = `icon/hero/${cfg.icon}_s`;
        // 更新星星
        this.lvLab.node.active = false
        if (this.data.hero.level > 0) {
            this.lvLab.node.active = true
            this.lvLab.string = `${this.data.hero.level}`
        }

        if (cfg) {
            icon = HeroUtils.getHeroHeadIcon(this.data.hero.typeId, this.data.hero.star, false)//`icon/hero/${cfg.icon}_s`;
            this.icon.updateStar(
                this.data.hero.star,
                this.data.hero.star,//ConfigManager.getItemById(Hero_colorCfg, cfg.color).star,
                false,
            );
            this.icon.updateItemIcon(icon);
            let starCfg = ConfigManager.getItemByField(Hero_starCfg, "star", this.data.hero.star)
            if (starCfg) {
                this.icon.updateQuality(starCfg.color);
            } else {
                this.icon.updateQuality(cfg.defaultColor);
            }
        } else {

            let monster2Cfg = ConfigManager.getItemById(Monster2Cfg, this.data.hero.typeId);
            if (monster2Cfg) {
                if (StringUtils.startsWith(monster2Cfg.skin, 'M_')) {
                    // 怪物
                    icon = `icon/monster/${monster2Cfg.icon}`;
                } else {
                    // 英雄
                    icon = `icon/hero/${monster2Cfg.icon}_s`;
                }
                this.icon.updateItemIcon(icon);
                this.icon.updateQuality(monster2Cfg.color);
                this.icon.updateStar(this.data.hero.star);
            } else {
                this.icon.updateStar(0);
            }
        }

        this.bloodNode.parent.active = false

        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.data.hero.careerId, { career_lv: this.data.hero.careerLv })
        if (careerCfg) {
            let soldierCfg = ConfigManager.getItemById(SoldierCfg, this.data.hero.soldierId)
            this.careerIconItem.active = true
            this._updateCareerInfo(careerCfg, soldierCfg.type)
        } else {
            this.soldierIcon.active = true
            this.careerIconItem.active = false
            GlobalUtil.setSpriteIcon(this.node, this.soldierIcon, GlobalUtil.getSoldierTypeIcon(this.data.hero.soldierId));
        }

        this.flag.active = false//this.data.hero.useSsk;
    }

    _updateCareerInfo(careerCfg: Hero_careerCfg, type) {
        let ctrl = this.careerIconItem.getComponent(CareerIconItemCtrl)
        ctrl.updateView(careerCfg.career_id, careerCfg.career_lv, type)
    }

    onClick() {
        if (this.footHoldModel.pointDetailInfo) {

            let fhPointInfo: FhPointInfo = this.footHoldModel.warPoints[`${this.footHoldModel.pointDetailInfo.pos.x}-${this.footHoldModel.pointDetailInfo.pos.y}`]

            let msg = new icmsg.RoleHeroImageReq()
            msg.playerId = fhPointInfo.fhPoint.playerId
            msg.heroId = this.data.hero.heroId
            msg.type = 0;
            NetManager.send(msg, (data: icmsg.RoleHeroImageRsp) => {
                gdk.panel.setArgs(PanelId.MainSetHeroInfoTip, data)
                gdk.panel.open(PanelId.MainSetHeroInfoTip);

            })
        }

    }
}
