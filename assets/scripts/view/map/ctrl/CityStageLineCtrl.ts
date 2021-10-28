import GlobalUtil from '../../../common/utils/GlobalUtil';
import { StageData, StageState } from './CityStageItemCtrl';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/map/CityStageLineCtrl")
export default class CityStageLineCtrl extends cc.Component {

    @property(cc.Sprite)
    lineSp: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // update (dt) {}
    data: StageData = null;
    idx: number = 0;

    _setLineSkin(active: boolean) {
        let urlSource = active ? 'view/map/texture/citymap/bg_tuijinxian' : 'view/map/texture/citymap/bg_tuijinxian01';
        GlobalUtil.setSpriteIcon(this.node, this.lineSp, urlSource);
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
