import CareerIconItemCtrl from '../../role/ctrl2/main/career/CareerIconItemCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import MercenarySetViewCtrl, { MercenarySetItemInfo } from './MercenarySetViewCtrl';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Hero_careerCfg, Worker_workCfg } from '../../../a/config';
import { MercenaryEventId } from '../enum/MercenaryEventId';

/**
 * 英雄雇佣设置 确认界面
 * @Author: luoyong
 * @Description:
 * @Date: 2020-07-10 11:12:08
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-25 09:59:30
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/mercenary/MercenarySetCheckCtrl")
export default class MercenarySetCheckCtrl extends gdk.BasePanel {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    careerIconItem: cc.Node = null

    @property(cc.Label)
    heroName: cc.Label = null

    @property(cc.RichText)
    heroTipLab: cc.RichText = null

    _setInfo: MercenarySetItemInfo
    _index: number = 0
    _viewCtrl: MercenarySetViewCtrl

    get roleModel() { return ModelManager.get(RoleModel); }

    onEnable() {
        let arg = this.args
        this._setInfo = arg[0]
        this._index = arg[1]
        this._viewCtrl = arg[2]
        this._updateViewInfo()
    }

    _updateViewInfo() {
        let ctrl = this.slot.getComponent(UiSlotItem)
        this.slot.starNum = this._setInfo.extInfo.star
        ctrl.updateItemInfo(this._setInfo.cfg.id)
        // ctrl.updateStar(this._setInfo.extInfo.star)
        this._updateCareerInfo()
        this.heroName.string = `${this._setInfo.cfg.name}`

        let str = `${this._setInfo.cfg.name} ${StringUtils.format(gdk.i18n.t("i18n:MERCENARY_TIP9"), this._countGainNum(this._setInfo.careerCfg, this._setInfo.extInfo))}`//预计24小时金币收益为 <color=#3BFF00>${this._countGainNum(this._setInfo.careerCfg, this._setInfo.extInfo)}</c>
        this.heroTipLab.string = StringUtils.setRichtOutLine(str, "#37160B", 2)

    }

    _countGainNum(careerCfg: Hero_careerCfg, heroInfo: icmsg.HeroInfo) {
        let cfg = ConfigManager.getItemByField(Worker_workCfg, "career_lv", heroInfo.careerLv)
        if (!cfg) {
            CC_DEBUG && cc.error("配置表Worker_workCfg 缺少 对应的等阶" + careerCfg.career_lv)
            cfg = ConfigManager.getItemByField(Worker_workCfg, "career_lv", 1)
        }
        return GlobalUtil.numberToStr(24 * 60 * cfg.earn, true)
    }

    _updateCareerInfo() {
        let ctrl = this.careerIconItem.getComponent(CareerIconItemCtrl)
        ctrl.updateView(this._setInfo.extInfo.careerId, GlobalUtil.getHeroCareerLv(this._setInfo.extInfo), this._setInfo.extInfo.soldierId)
    }

    clickOkFunc() {
        let msg = new icmsg.MercenaryLendOnReq()
        msg.heroId = this._setInfo.extInfo.heroId
        NetManager.send(msg, (data: icmsg.MercenaryLendOnRsp) => {
            this._viewCtrl.list.remove_data(this._index)
            this._viewCtrl._addHero(data.hero)
            gdk.e.emit(MercenaryEventId.MERCENARY_SET_REFRESH_HERO)
            this.close()
        })
    }
}