import CareerIconItemCtrl from '../../role/ctrl2/main/career/CareerIconItemCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import MercenaryModel from '../model/MercenaryModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import { HeroCfg, WorkerCfg } from '../../../a/config';
import { MercenaryEventId } from '../enum/MercenaryEventId';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2020-07-10 11:42:28
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 21:26:42
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/mercenary/MercenaryGetHeroCtrl")
export default class MercenaryGetHeroCtrl extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.Node)
    lockNode: cc.Node = null

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Node)
    activeNode: cc.Node = null

    @property(sp.Skeleton)
    heroSpine: sp.Skeleton = null

    @property(cc.Label)
    heroName: cc.Label = null

    @property(cc.Label)
    playerName: cc.Label = null

    @property(cc.Node)
    careerIconItem: cc.Node = null

    _borrowedInfo: icmsg.MercenaryBorrowedHero
    get mercenaryModel() { return ModelManager.get(MercenaryModel); }
    get copyModel() { return ModelManager.get(CopyModel); }
    get roleModel() { return ModelManager.get(RoleModel); }

    updateState(info: icmsg.MercenaryBorrowedHero) {
        this._borrowedInfo = info
        let sort = this.getOpenSort(info.index)
        // let maxSort = 0
        // let stageCfg = ConfigManager.getItemById(Copysurvival_stageCfg, this.copyModel.survivalStateMsg.maxStageId)
        // if (stageCfg) {
        //     maxSort = stageCfg.sort
        // }
        if (this.roleModel.level < sort) {
            this.activeNode.active = false
            this.lockNode.active = true
            this.lvLab.string = `${sort}级`
            GlobalUtil.setGrayState(this.bg, 1)
            return
        }
        GlobalUtil.setGrayState(this.bg, 0)
        //已解锁状态
        if (this._borrowedInfo && this._borrowedInfo.brief) {
            this.lockNode.active = false
            this.activeNode.active = true
            let heroCfg = ConfigManager.getItemById(HeroCfg, this._borrowedInfo.brief.typeId)
            let url = StringUtils.format("spine/hero/{0}/0.5/{0}", HeroUtils.getHeroSkin(this._borrowedInfo.brief.typeId, this._borrowedInfo.brief.star));
            GlobalUtil.setSpineData(this.node, this.heroSpine, url, true, "stand", true, true);
            this.heroName.string = `${heroCfg.name}`
            this.playerName.string = `${this._borrowedInfo.playerName}`
            this._updateCareerInfo()
        } else {
            this.lockNode.active = false
            this.activeNode.active = false
        }
    }

    _updateCareerInfo() {
        let ctrl = this.careerIconItem.getComponent(CareerIconItemCtrl)
        ctrl.updateView(this._borrowedInfo.brief.careerId, this._borrowedInfo.brief.careerLv, this._borrowedInfo.brief.soldierId)
        ctrl.hideIcon()
    }


    /*开启等级*/
    getOpenSort(index) {
        let workerCfg = ConfigManager.getItemById(WorkerCfg, 1)
        let sort = workerCfg["open_sort" + index]
        return sort
    }

    clickFunc() {
        if (this._borrowedInfo && this._borrowedInfo.brief) {
            // if (!this.copyModel.survivalNeedSaveHeros) {
            //     gdk.gui.showMessage("战斗已经开始了，佣兵无法调整")
            //     return
            // }

            if (this._borrowedInfo.playerId != 0) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:MERCENARY_TIP5"))
                return
            }
            let msg = new icmsg.MercenaryCancelReq()
            msg.index = this._borrowedInfo.index
            NetManager.send(msg, (data: icmsg.MercenaryCancelRsp) => {
                let list = this.mercenaryModel.borrowedListHero
                for (let i = 0; i < list.length; i++) {
                    if (list[i].index == data.index) {
                        this.mercenaryModel.borrowedListHero.splice(i, 1)
                        break
                    }
                }
                this.mercenaryModel.borrowedListHero = this.mercenaryModel.borrowedListHero;
                gdk.e.emit(MercenaryEventId.MERCENARY_GET_REFRESH_HERO)
            })
        }
    }
}