import CareerIconItemCtrl from '../../role/ctrl2/main/career/CareerIconItemCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import ResonatingModel from '../../resonating/model/ResonatingModel';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { HeroCfg } from '../../../a/config';
import { ResetHeroInfo } from './HeroResetPanelCtrl';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-26 11:41:07
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroResetItemCtrl")
export default class HeroResetItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    mask: cc.Node = null

    @property(cc.Node)
    careerIconItem: cc.Node = null

    @property(cc.Node)
    redPoint: cc.Node = null;

    @property(cc.Node)
    upNode: cc.Node = null;

    @property(cc.Node)
    lock: cc.Node = null

    info: ResetHeroInfo
    get resonatingModel(): ResonatingModel { return ModelManager.get(ResonatingModel); }
    /* 更新格子数据*/
    updateView() {
        this.info = this.data
        let ctrl = this.slot.getComponent(UiSlotItem)
        ctrl.updateItemInfo(this.info.cfg.id)
        ctrl.updateStar(this.info.extInfo.star)
        this.lvLab.string = `${this.info.extInfo.level}`

        this.mask.active = this.info.selected
        if (this.info.selected) {
            let msg = new icmsg.HeroResetPreviewReq()
            msg.heroId = [this.info.extInfo.heroId]
            NetManager.send(msg)
        }

        this._updateCareerInfo()
        let model = ModelManager.get(HeroModel);
        let upList = model.curUpHeroList(0); //只考虑 出战列表-塔防
        this.upNode.active = upList.indexOf(this.info.extInfo.heroId) !== -1;
        this._updateRedpoint();

        GlobalUtil.setAllNodeGray(this.node, 0);
        if (this.resonatingModel.getHeroInUpList(this.info.extInfo.heroId)) {
            GlobalUtil.setAllNodeGray(this.node, 1);
            this.lock.active = true;
            this.redPoint.active = false;
        } else {
            if (this.resonatingModel.getInUpperHeroInfo(this.info.extInfo.heroId)) {
                this.redPoint.active = false;
            } else {
                this.lock.active = false;
                // GlobalUtil.setAllNodeGray(this.node, 0);
            }
        }
    }

    _updateCareerInfo() {
        let ctrl = this.careerIconItem.getComponent(CareerIconItemCtrl)
        ctrl.updateView(this.info.careerCfg.career_id, this.info.careerCfg.career_lv, this.info.extInfo.soldierId)
    }

    _updateRedpoint() {
        let heroModel = ModelManager.get(HeroModel);
        let upList = heroModel.curUpHeroList(0);
        if (this.info.extInfo.level >= 2 || this.info.extInfo.careerLv >= 2) {
            let heroCfg = ConfigManager.getItemById(HeroCfg, this.info.extInfo.typeId);
            if (upList.indexOf(this.info.extInfo.heroId) == -1
                && heroCfg.group[0] !== 6
                && !this.info.extInfo.mysticLink) {
                this.redPoint.active = true;
                return;
            }
        }
        this.redPoint.active = false;
    }
}