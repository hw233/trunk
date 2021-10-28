import ConfigManager from '../../../../../common/managers/ConfigManager';
import FootHoldModel from '../FootHoldModel';
import FootHoldTeachingItemCtrl from './FootHoldTeachingItemCtrl';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import { Foothold_teachingCfg } from '../../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-14 16:01:45
 */



/**
 * 1 占领据点
   2 购买体力
   3 据点争夺攻击敌方据点
   4 占领城池
   5 占领辐射塔
   6 领取基地奖励
   7 放弃据点
 */
export enum FhTeacheGuideType {
    event_1 = 1,
    event_2 = 2,
    event_3 = 3,
    event_4 = 4,
    event_5 = 5,
    event_6 = 6,
    event_7 = 7,
}


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/teaching/FootHoldTeachingCtrl")
export default class FootHoldTeachingCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    teachItem: cc.Prefab = null

    _ctrl = []
    _guideType = 1
    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        let args = this.args
        if (args && args.length > 0) {
            this._guideType = args[0]
        }


        NetManager.on(icmsg.FootholdGuideQueryRsp.MsgType, this._updateInfo, this)
        let msg = new icmsg.FootholdGuideQueryReq()
        NetManager.send(msg)
    }

    onDisable() {
        NetManager.targetOff(this)
    }

    _updateInfo() {
        let cfgs = ConfigManager.getItemsByField(Foothold_teachingCfg, "stage", this._guideType)
        this.content.removeAllChildren()
        for (let i = 0; i < cfgs.length; i++) {
            if (this.footHoldModel.activityIndex < cfgs[i].order) {
                continue
            }
            let item = cc.instantiate(this.teachItem)
            this.content.addChild(item)
            let ctrl = item.getComponent(FootHoldTeachingItemCtrl)
            ctrl.updateViewInfo(cfgs[i], i)
            this._ctrl.push(ctrl)
        }
    }

    @gdk.binding("footHoldModel.techingSrollIndex")
    updateScroilView(index) {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;
        let items = this.content.children
        let targetItem = items[index]
        if (!targetItem) {
            return
        }
        for (let i = 0; i < this._ctrl.length; i++) {
            if (i != index) {
                (this._ctrl[i] as FootHoldTeachingItemCtrl).updateState(false)
            }
        }
        let layout = this.content.getComponent(cc.Layout)
        layout.updateLayout()


        this.scrollView.elastic = false
        gdk.Timer.once(100, this, () => {
            this.scrollView.scrollToOffset(cc.v2(0, Math.abs(targetItem.y)))
            this.scrollView.elastic = true
        })
    }

}