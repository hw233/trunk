import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Activity_awards_showCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-10 14:33:08 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/twistedEgg/TwistedUiSlotItemCtrl")
export default class TwistedUiSlotItemCtrl extends UiSlotItem {
  @property(cc.Node)
  mask: cc.Node = null;

  cfg: Activity_awards_showCfg;
  // onEnable() {
  //   super.onEnable();
  //   gdk.e.on(ActivityEventId.ACTIVITY_TWISTED_ANI_END, this._onTwistedAniEnd, this);
  // }

  // onDisable() {
  //   super.onDisable();
  //   gdk.e.targetOff(this);
  // }

  // updateState(cfg: Activity_awards_showCfg) {
  //   this.cfg = cfg;
  //   this.mask.active = ActivityUtils.getTwistEggRewardState(cfg.index);
  //   if (this.mask.active) {
  //     this.isEffect = false;
  //     this.qualityEffect(null);
  //   }
  // }

  // _onTwistedAniEnd() {
  //   this.updateState(this.cfg);
  // }
}
