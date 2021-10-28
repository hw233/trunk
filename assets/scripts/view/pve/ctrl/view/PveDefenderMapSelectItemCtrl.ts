import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import PveFsmEventId from '../../enum/PveFsmEventId';
import PvpDefenderCtrl from '../PvpDefenderCtrl';
import UiListItem from '../../../../common/widgets/UiListItem';


/** 
 * @Description: 防御阵营地图设置界面Item
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-10 11:50:06
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/pve/view/PveDefenderMapSelectItemCtrl")
export default class PveDefenderMapSelectItemCtrl extends UiListItem {


    @property(cc.Label)
    nameLb: cc.Label = null;

    get model(): HeroModel { return ModelManager.get(HeroModel); }
    info: { name: string, typeId: number, grayTypes: number[] };
    updateView() {
        this.info = this.data;
        this.nameLb.string = this.info.name
        GlobalUtil.setAllNodeGray(this.node, this.info.grayTypes.indexOf(this.info.typeId) >= 0 ? 1 : 0);
    }

    _itemClick() {
        if (this.model.curDefendType != this.info.typeId) {
            this.model.curDefendType = this.info.typeId
            let node = gdk.panel.get(PanelId.PvpDefender);
            let ctrl = node.getComponent(PvpDefenderCtrl)
            ctrl.model.id = this.model.getDefenderStageId(this.model.curDefendType);
            ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_REINIT);
        }
        gdk.panel.hide(PanelId.PveDefenderMapSelect);

    }
}
