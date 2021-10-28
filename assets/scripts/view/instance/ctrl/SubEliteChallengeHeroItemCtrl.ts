import CareerIconItemCtrl from '../../role/ctrl2/main/career/CareerIconItemCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import { BagItem } from '../../../common/models/BagModel';
import { HeroCfg } from '../../../a/config';

/** 
 * 奖杯模式（挑战模式）英雄选择Item
 * @Author: yaozu.hu
 * @Date: 2019-06-19 13:43:54 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 20:55:48
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/SubEliteChallengeHeroItemCtrl")
export default class SubEliteChallengeHeroItemCtrl extends cc.Component {

    @property(cc.Node)
    selectNode: cc.Node = null

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Label)
    starLab: cc.Label = null;

    @property(cc.Node)
    careerIconItem: cc.Node = null

    @property(cc.Sprite)
    colorBg: cc.Sprite = null

    _poolKey: string = "ROLE_ITEM_STAR"
    soldierId: number = 0
    quality: number = 0
    heroInfo: icmsg.HeroInfo = null
    isSelect = false;

    call: Function;
    thisArg: any;
    item: BagItem
    cupHeroId: number;
    initData(data: BagItem, cupHeroId: number, isSelect: boolean, gray: boolean, call: Function, arg: any) {
        this.cupHeroId = cupHeroId;
        this.item = data
        this.thisArg = arg;
        this.call = call;
        this.selectNode.active = isSelect
        GlobalUtil.setAllNodeGray(this.node, 0);
        if (!this.isSelect && gray) {
            GlobalUtil.setAllNodeGray(this.node, 1);
        }

        // if (!this.heroInfo || this.heroInfo.typeId != this.item.itemId) {
        //     let cfg = BagUtils.getConfigById(this.item.itemId)
        //     let icon = `icon/hero/${cfg.icon}`//GlobalUtil.getIconById(item.itemId, BagType.HERO)
        //     GlobalUtil.setSpriteIcon(this.node, this.icon, icon)
        // }
        this.heroInfo = <icmsg.HeroInfo>this.item.extInfo

        let icon = HeroUtils.getHeroHeadIcon(this.heroInfo.typeId, this.heroInfo.star, false)
        GlobalUtil.setSpriteIcon(this.node, this.icon, icon)

        //this.systemFlag.active = item.series > 600000 && item.series < 700000
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
            for (let i = 0; i < 7; i++) {
                if (i < heroCfg.star_max) {
                    starTxt += starNum > i ? "1" : "0";
                }
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
            let path1 = `common/texture/juese_txbg03_0${this.heroInfo.color}`
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
        //this.__updateView();
        // 设置已上阵标签
        // let panel = gdk.gui.getCurrentView().getComponent(PveSceneCtrl);
        // let model = panel.model;
        // let isSelected: boolean = model.heros.some(h => {
        //     return h.model.id == this.data.itemId;
        // });
        // if (this.selectIcon) {
        //     this.selectIcon.active = isSelected;
        // }
        // 已上阵的英雄头像变灰
        // let isCurrent: boolean = this.list.items[this.curIndex].is_select;
        // if (isSelected && !isCurrent) {
        //     GlobalUtil.setGrayState(this.icon, 1);
        //     GlobalUtil.setGrayState(this.colorBg, 1);
        //     this.node.targetOff(this);
        // }
        // // 设置选中状态
        // if (this.selectNode) {
        //     this.selectNode.active = isCurrent;
        // }
    }

    BtnClick() {
        if (!this.isSelect) {
            if (this.call && this.thisArg) {
                this.call.call(this.thisArg, this.cupHeroId)
            }
        }
    }

    onDisable() {
        GlobalUtil.setGrayState(this.icon, 0);
        GlobalUtil.setGrayState(this.colorBg, 0);
        this.call = null;
        this.thisArg = null;
    }
}