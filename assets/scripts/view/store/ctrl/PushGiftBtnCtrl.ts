import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
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
@menu("qszc/view/store/PushGiftBtnCtrl")
export default class PushGiftBtnCtrl extends cc.Component {


    @property(cc.Label)
    timeLab: cc.Label = null;

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }
    get serverModel(): ServerModel { return ModelManager.get(ServerModel) }

    _maxStartTime: number = 0
    _cfg: Store_pushCfg

    onEnable() {
        this.updateState()
    }

    onDisable() {
        this._clearTimer()
    }


    @gdk.binding("storeModel.starGiftDatas")
    updateState() {
        let datas = this.storeModel.starGiftDatas
        let newDatas: icmsg.StorePushGift[] = []
        let curTime = Math.floor(this.serverModel.serverTime / 1000)
        datas.forEach(element => {
            let cfg = ConfigManager.getItemByField(Store_pushCfg, "gift_id", element.giftId)
            if (cfg && cfg.event_type == 1 && element.startTime + cfg.duration >= curTime) {
                newDatas.push(element)
            }
        });
        GlobalUtil.sortArray(newDatas, (a, b) => {
            return b.startTime - a.startTime
        })

        if (newDatas.length > 0) {
            this._maxStartTime = newDatas[0].startTime
            this._cfg = ConfigManager.getItemById(Store_pushCfg, newDatas[0].giftId)
            let count = 0
            for (let i = 0; i < newDatas.length; i++) {
                if (newDatas[i].remainNum == 0) {
                    count++
                }
            }
            if (count == newDatas.length) {
                this._maxStartTime = 0
            }
        }

        this._createRfreshTime()
    }

    _createRfreshTime() {
        this._updateTime()
        this._clearTimer()
        this.schedule(this._updateTime, 1)
    }

    _updateTime() {
        if (this._maxStartTime > 0) {
            let endTime = this._maxStartTime + this._cfg.duration
            let curTime = Math.floor(this.serverModel.serverTime / 1000)
            if (endTime - curTime <= 0) {
                this._clearTimer()
                this.node.active = false
            } else {
                this.node.active = true
                this.timeLab.string = `${TimerUtils.format2(Math.floor(endTime - curTime))}`
            }
        } else {
            this.node.active = false
        }
    }

    _clearTimer() {
        this.unschedule(this._updateTime)
    }

}
