import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideBind from '../../../guide/ctrl/GuideBind';
import GuideUtil from '../../../common/utils/GuideUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import MercenaryModel from '../model/MercenaryModel';
import ModelManager from '../../../common/managers/ModelManager';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { HeroCfg, WorkerCfg } from '../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2020-07-10 11:42:28
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-22 18:17:58
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/mercenary/MercenaryGetItemCtrl")
export default class MercenaryGetItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Node)
    useFlag: cc.Node = null

    @property(cc.Node)
    systemFlag: cc.Node = null

    @property(cc.Sprite)
    soldierIcon: cc.Sprite = null;

    @property(cc.Sprite)
    careerIcon: cc.Sprite = null;

    @property(cc.Node)
    inHeroList: cc.Node = null;

    info: icmsg.MercenaryListHero

    get mercenaryModel() { return ModelManager.get(MercenaryModel); }
    get copyModel() { return ModelManager.get(CopyModel); }

    onDisable() {
        let btnCtrl = this.node.getComponent(GuideBind)
        if (btnCtrl) {
            this.node.removeComponent(GuideBind);
        }
    }

    /* 更新格子数据*/
    updateView() {
        this.info = this.data
        let ctrl = this.slot.getComponent(UiSlotItem)
        ctrl.updateItemInfo(this.info.heroBrief.typeId)
        ctrl.updateStar(this.info.heroBrief.star)
        this._updateCareerInfo()
        this.lvLab.string = `.${this.info.heroBrief.level}`

        let workerCfg = ConfigManager.getItemById(WorkerCfg, 1)
        let b_limit = workerCfg.lend_limit
        let lendNum = this.info.lendNum
        if (this.info.lendNum >= b_limit) {
            lendNum = b_limit
        }
        this.timeLab.string = `(${b_limit - lendNum}/${b_limit})`

        this.useFlag.active = false
        this.systemFlag.active = false
        this.timeLab.node.active = true

        if (b_limit - lendNum == 0) {
            this.timeLab.string = gdk.i18n.t("i18n:MERCENARY_TIP6")
        }

        if (this.info.playerId == 0) {
            this.systemFlag.active = true
            this.timeLab.node.active = false
        }


        //判断当前英雄是否在上阵列表
        let have = false;
        this.copyModel.survivalStateMsg.heroes.forEach(data => {
            if (data.typeId == 0) {
                let item = HeroUtils.getHeroInfoBySeries(data.heroId);
                if (item && item.itemId == this.info.heroBrief.typeId) {
                    have = true;
                }
            } else {
                if (data.typeId == this.info.heroBrief.typeId) {
                    have = true;
                }
            }
        })
        this.inHeroList.active = have;

        if (this._isHeroUsed()) {
            this.useFlag.active = true
        }

        let guideId = GuideUtil.getCurGuideId()
        if (guideId > 0 && this.info.playerId == 0) {
            if (this.mercenaryModel.bindHeroId <= 0) {
                this.mercenaryModel.bindHeroId = this.info.heroBrief.typeId;
                // let cfg = ConfigManager.getItemById(GuideCfg, guideId)
                // if (cfg && cfg.bindBtnId == 1802) {
                //     let btnCtrl = this.node.getComponent(GuideBind)
                //     if (!btnCtrl) {
                //         btnCtrl = this.node.addComponent(GuideBind)
                //     }
                //     btnCtrl.guideIds = [1802]
                //     btnCtrl.bindBtn()
                // }

            }
            if (this.mercenaryModel.bindHeroId == this.info.heroBrief.typeId) {
                let btnCtrl = this.node.getComponent(GuideBind)
                if (!btnCtrl) {
                    btnCtrl = this.node.addComponent(GuideBind)
                }
                btnCtrl.guideIds = [1802]
                btnCtrl.bindBtn()
            }
        }
    }

    _updateCareerInfo() {

        let heroCfg = ConfigManager.getItemById(HeroCfg, this.info.heroBrief.typeId);
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/group_${heroCfg.group[0]}`);
        let type = Math.floor(this.info.heroBrief.soldierId / 100);
        let iconPath = `view/role/texture/careerIcon/c_type_${type}`;
        GlobalUtil.setSpriteIcon(this.node, this.soldierIcon, iconPath);
    }

    _isHeroUsed() {
        let list = this.mercenaryModel.borrowedListHero
        for (let i = 0; i < list.length; i++) {
            if (list[i].playerId == this.info.playerId && list[i].brief.typeId == this.info.heroBrief.typeId) {
                return true
            }
        }
        return false
    }

}