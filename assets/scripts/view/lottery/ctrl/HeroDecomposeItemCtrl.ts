import CareerIconItemCtrl from '../../role/ctrl2/main/career/CareerIconItemCtrl';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import ResonatingModel from '../../resonating/model/ResonatingModel';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { ResetHeroInfo } from './HeroResetPanelCtrl';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-04-08 11:19:29
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroDecomposeItemCtrl")
export default class HeroDecomposeItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    mask: cc.Node = null

    @property(cc.Node)
    careerIconItem: cc.Node = null

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
        this.lvLab.string = `.${this.info.extInfo.level}`

        this.mask.active = this.info.selected

        this._updateCareerInfo()
        let model = ModelManager.get(HeroModel);
        let upList = model.curUpHeroList(0).concat(model.curUpHeroList(1)).concat(model.curUpHeroList(2));
        GlobalUtil.setAllNodeGray(this.node, upList.indexOf(this.info.extInfo.heroId) == -1 ? 0 : 1);

        if (HeroUtils.heroLockCheck(this.info.extInfo, false)) {
            GlobalUtil.setAllNodeGray(this.node, 1);
            this.lock.active = true;
        }
        else {
            GlobalUtil.setAllNodeGray(this.node, 0);
            this.lock.active = false;
        }
        // let mercenaryModel = ModelManager.get(MercenaryModel)
        // let m_list = mercenaryModel.lentHeroList
        // for (let i = 0; i < m_list.length; i++) {
        //     if (m_list[i].heroId == this.info.extInfo.heroId) {
        //         GlobalUtil.setAllNodeGray(this.node, 1);
        //     }
        // }

        // this.lock.active = false
        // if (this.resonatingModel.getHeroInUpList(this.info.extInfo.heroId)) {
        //     GlobalUtil.setAllNodeGray(this.node, 1);
        //     this.lock.active = true
        // } else if (this.info.extInfo.switchFlag) {
        //     GlobalUtil.setAllNodeGray(this.node, 1);
        //     this.lock.active = true
        // }
    }

    _updateCareerInfo() {
        let ctrl = this.careerIconItem.getComponent(CareerIconItemCtrl)
        ctrl.updateView(this.info.careerCfg.career_id, this.info.careerCfg.career_lv, this.info.extInfo.soldierId)
    }

}