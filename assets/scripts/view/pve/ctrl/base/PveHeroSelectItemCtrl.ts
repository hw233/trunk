import BagUtils from '../../../../common/utils/BagUtils';
import CareerIconItemCtrl from '../../../role/ctrl2/main/career/CareerIconItemCtrl';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import PanelId from '../../../../configs/ids/PanelId';
import PveSceneCtrl from '../PveSceneCtrl';
import UiListItem from '../../../../common/widgets/UiListItem';
import { BagItem } from '../../../../common/models/BagModel';
import { Copycup_heroCfg, Copycup_rookieCfg, HeroCfg } from '../../../../a/config';
import { CopyType } from '../../../../common/models/CopyModel';

/** 
 * Pve英雄选择界面项
 * @Author: sthoo.huang  
 * @Date: 2019-06-19 13:43:54 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 20:56:36
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/base/PveHeroSelectItemCtrl")
export default class PveHeroSelectItemCtrl extends UiListItem {

    @property(cc.Node)
    selectIcon: cc.Node = null;

    @property(cc.Node)
    selectNode: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Label)
    starLab: cc.Label = null;

    // @property(cc.Node)
    // careerBg: cc.Node = null
    // @property(cc.Sprite)
    // careerIcon: cc.Sprite = null
    // @property(cc.Node)
    // careerLv: cc.Node = null

    @property(cc.Node)
    careerIconItem: cc.Node = null

    @property(cc.Sprite)
    colorBg: cc.Sprite = null

    @property(cc.Node)
    systemFlag: cc.Node = null
    @property(cc.Label)
    infoLb: cc.Label = null;

    _poolKey: string = "ROLE_ITEM_STAR"
    soldierId: number = 0
    quality: number = 0
    heroInfo: icmsg.HeroInfo = null
    heroCupCfg: Copycup_heroCfg;
    towerIdx: number = -1;   // 当前的塔位索引
    __updateView() {
        let item: BagItem = this.data.data
        this.selectNode.active = this.data.isSelect
        this.towerIdx = this.data.towerIdx;
        // if (!this.heroInfo || this.heroInfo.typeId != item.itemId) {
        //     let cfg = BagUtils.getConfigById(item.itemId)
        //     let icon = `icon/hero/${cfg.icon}`//GlobalUtil.getIconById(item.itemId, BagType.HERO)
        //     GlobalUtil.setSpriteIcon(this.node, this.icon, icon)
        // }
        this.heroInfo = <icmsg.HeroInfo>item.extInfo

        if (this.heroInfo) {
            let level = this.heroInfo.level || 1
            if (item.series > 800000) {
                this.lvLab.string = ''
            } else {
                this.lvLab.string = `${level}`
            }

            let icon = HeroUtils.getHeroHeadIcon(this.heroInfo.typeId, this.heroInfo.star, false)
            GlobalUtil.setSpriteIcon(this.node, this.icon, icon)
        }

        this.systemFlag.active = item.series > 600000 && item.series < 700000

        let panel = gdk.gui.getCurrentView().getComponent(PveSceneCtrl);
        let model = panel.model;
        if (model.stageConfig.copy_id == CopyType.RookieCup && model.stageConfig.id == 630101) {
            GuideUtil.bindGuideNode(7005, this.node)
        }

        let rookie = ConfigManager.getItemByField(Copycup_rookieCfg, 'stage_id', model.stageConfig.id)
        if (rookie) {
            let heroIds = rookie['tower_' + this.towerIdx];
            if (heroIds.length > 0) {
                for (let i = 0; i < heroIds.length; i++) {
                    let cfg = ConfigManager.getItemByField(Copycup_heroCfg, 'id', heroIds[i])
                    if (cfg && cfg.hero_id == this.heroInfo.typeId) {
                        this.heroCupCfg = cfg;
                        let strs = cfg.describe.split('|')
                        this.infoLb.string = strs.length > 1 ? strs[0] + '\n' + strs[1] : strs[0] + '\n';
                        break;
                    }
                }
            }
        }

        this._updateQuality()
        this._updateStar()
        this._updateSoldierIcon()
    }

    /**更新星星数量 */
    _updateStar() {
        if (this.heroInfo) {
            let starNum = this.heroInfo.star
            if (starNum == 0) {
                this.starLab.node.active = false
                return
            }
            this.starLab.node.active = true

            let heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
            let starTxt = "";
            // for (let i = 0; i < 7; i++) {
            //     if (i < heroCfg.star_max) {
            //         starTxt += starNum > i ? "1" : "0";
            //     }
            // }
            if (starNum > 5) {
                starTxt = '1'.repeat(starNum - 5);
            }
            else {
                starTxt = '0'.repeat(starNum);
            }
            this.starLab.string = starTxt;
        }
    }

    /**更新品质显示 */
    _updateQuality() {
        let cfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId)
        if (!cfg) {
            this.colorBg.node.active = false
            // this.titleBg.node.active = false
        } else if (this.quality != this.heroInfo.color) {
            this.colorBg.node.active = true
            let path1 = `common/texture/sub_itembg0${this.heroInfo.color}`
            GlobalUtil.setSpriteIcon(this.node, this.colorBg, path1)
            this.quality = this.heroInfo.color
        }
    }

    /**更新士兵图标 */
    _updateSoldierIcon() {
        this.soldierId = this.heroInfo.soldierId
        // GlobalUtil.setSpriteIcon(this.node, this.careerBg, GlobalUtil.getCareerSoldierIcon(this.heroInfo));
        // GlobalUtil.setSpriteIcon(this.node, this.careerIcon, GlobalUtil.getCareerSoldierIcon(this.heroInfo, 1));
        // let path = GlobalUtil.getCareerLvIcon(this.heroInfo)
        // if (path) {
        //     this.careerLv.active = true
        //     GlobalUtil.setSpriteIcon(this.node, this.careerLv, GlobalUtil.getCareerLvIcon(this.heroInfo));
        // } else {
        //     this.careerLv.active = false
        // }
        let ctrl = this.careerIconItem.getComponent(CareerIconItemCtrl)
        ctrl.updateView(this.heroInfo.careerId, GlobalUtil.getHeroCareerLv(this.heroInfo), this.soldierId)

    }

    updateView() {
        this.__updateView();
        // 设置已上阵标签
        let panel = gdk.gui.getCurrentView().getComponent(PveSceneCtrl);
        let model = panel.model;
        let isSelected: boolean = model.heros.some(h => {
            return h.model.id == this.data.itemId;
        });
        if (this.selectIcon) {
            this.selectIcon.active = isSelected;
        }
        // 已上阵的英雄头像变灰
        let isCurrent: boolean = this.list.items[this.curIndex].is_select;
        if (isSelected && !isCurrent) {
            GlobalUtil.setGrayState(this.icon, 1);
            GlobalUtil.setGrayState(this.colorBg, 1);
            this.node.targetOff(this);
        }
        // 设置选中状态
        if (this.selectNode) {
            this.selectNode.active = isCurrent;
        }
    }


    onDisable() {
        GlobalUtil.setGrayState(this.icon, 0);
        GlobalUtil.setGrayState(this.colorBg, 0);
    }

    infoBtnClick() {
        //cc.log('--------------------------' + this.heroInfo.heroId);
        if (this.heroCupCfg) {
            gdk.panel.setArgs(PanelId.PveCupHeroDetail, this.heroCupCfg)
            gdk.panel.open(PanelId.PveCupHeroDetail);
        }
    }
}