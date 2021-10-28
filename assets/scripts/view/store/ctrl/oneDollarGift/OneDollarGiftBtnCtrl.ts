import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import StoreModel from '../../model/StoreModel';
import StoreUtils from '../../../../common/utils/StoreUtils';
import { StoreEventId } from '../../enum/StoreEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-02 16:34:05 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/oneDollarGift/OneDollarGiftBtnCtrl")
export default class OneDollarGiftBtnCtrl extends cc.Component {

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    onLoad() {
        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._onPaySucc, this);
        NetManager.on(icmsg.StoreMiscGiftPowerAwardRsp.MsgType, this._onStoreMiscGiftPowerAwardRsp, this);
    }

    onEnable() {
        if (this.storeModel.firstPayTime && JumpUtils.ifSysOpen(2807) && !StoreUtils.isAllRewardRecivedInOneDollarGiftView()) {
            this.node.active = true;
        }
        else {
            this.node.active = false;
        }
    }

    onDisable() {
    }

    onDestroy() {
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    onClick() {
        JumpUtils.openView(2807, true);
    }

    _onPaySucc(data: gdk.Event) {
        if (this.node.active) return;
        if (this.storeModel.firstPayTime && JumpUtils.ifSysOpen(2807)) {
            this.node.active = true;
        }
    }

    _onStoreMiscGiftPowerAwardRsp(resp: icmsg.StoreMiscGiftPowerAwardRsp) {
        if (!this.node.active) return;
        if (StoreUtils.isAllRewardRecivedInOneDollarGiftView()) this.node.active = false;
    }
}
