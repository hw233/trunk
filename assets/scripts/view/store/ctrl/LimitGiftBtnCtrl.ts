import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import ServerModel from '../../../common/models/ServerModel';
import StoreModel from '../model/StoreModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import { Store_pushCfg } from '../../../a/config';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/LimitGiftBtnCtrl")
export default class LimitGiftBtnCtrl extends cc.Component {


    @property(cc.Label)
    timeLab: cc.Label = null;

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }
    get serverModel(): ServerModel { return ModelManager.get(ServerModel) }

    _limitGiftInfo: icmsg.TimeLimitGift

    onEnable() {

    }

    onDisable() {
        this._clearTimer()
    }

    updateState(limitGiftInfo: icmsg.TimeLimitGift) {
        this._limitGiftInfo = limitGiftInfo
        this._createRfreshTime()
    }

    _createRfreshTime() {
        this._updateTime()
        this._clearTimer()
        this.schedule(this._updateTime, 1)
    }

    _updateTime() {
        let curTime = Math.floor(this.serverModel.serverTime / 1000)
        if (this._limitGiftInfo.endTime - curTime <= 0) {
            this._clearTimer()
            this.node.active = false
        } else {
            this.node.active = true
            this.timeLab.string = `${TimerUtils.format2(Math.floor(this._limitGiftInfo.endTime - curTime))}`
        }
    }

    _clearTimer() {
        this.unschedule(this._updateTime)
    }

    onClickFunc() {
        gdk.panel.setArgs(PanelId.LimitGiftView, this._limitGiftInfo.id)
        gdk.panel.open(PanelId.LimitGiftView)
    }

}
