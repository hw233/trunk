import { StageData, StageState } from './CityStageItemCtrl';

/**
 * 精英副本小地图line
 * @Author: yaozu.hu
 * @Date: 2020-04-22 11:00:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-04-22 11:01:43
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/map/EliteCityStageLineCtrl")
export default class EliteCityStageLineCtrl extends cc.Component {
    @property(cc.Node)
    lineSp: cc.Node = null;

    @property(cc.Node)
    lineSpG: cc.Node = null;

    data: StageData = null;
    idx: number = 0;

    _setLineSkin(active: boolean) {
        this.lineSp.active = active
        this.lineSpG.active = !active
    }

    updateData(data: StageData, idx) {
        this.data = data;
        this.idx = idx;
        if (data.state == StageState.Lock) {
            this._setLineSkin(false);
        }
        else {
            this._setLineSkin(true);
        }
    }

}
