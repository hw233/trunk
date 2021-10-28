import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import ServerModel from '../../../common/models/ServerModel';
import StoreModel from '../../store/model/StoreModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import { Store_pushCfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/MainLineGiftBtnCtrl")
export default class MainLineGiftBtnCtrl extends cc.Component {

    @property(cc.Node)
    giftIcon: cc.Node = null;

    @property(cc.Node)
    giftTitle: cc.Node = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Node)
    heroIcon: cc.Node = null;

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }
    get serverModel(): ServerModel { return ModelManager.get(ServerModel) }

    _startTime: number = 0
    _cfg: Store_pushCfg

    onEnable() {

    }

    onDisable() {
        this._clearTimer()
    }

    @gdk.binding("storeModel.starGiftDatas")
    updateState() {
        this._startTime = 0
        let datas = this.storeModel.starGiftDatas
        let newDatas: icmsg.StorePushGift[] = []
        datas.forEach(element => {
            let cfg = ConfigManager.getItemByField(Store_pushCfg, "gift_id", element.giftId)
            if (cfg && cfg.event_type == 8 && element.remainNum > 0) {
                newDatas.push(element)
            }
        });
        if (newDatas.length > 0) {
            this._startTime = newDatas[0].startTime
            this._cfg = ConfigManager.getItemById(Store_pushCfg, newDatas[0].giftId)

            let url = 'view/act/texture/common/';
            GlobalUtil.setSpriteIcon(this.node, this.giftIcon, url + this._cfg.gift_icon);
            GlobalUtil.setSpriteIcon(this.node, this.giftTitle, url + this._cfg.gift_name);

            GlobalUtil.setSpriteIcon(this.node, this.heroIcon, HeroUtils.getHeroHeadIcon(this._cfg.themehero));
        }
        this._createRfreshTime()
    }

    _createRfreshTime() {
        this._updateTime()
        this._clearTimer()
        this.schedule(this._updateTime, 1)
    }

    _updateTime() {
        if (this._startTime > 0) {
            let endTime = this._startTime + this._cfg.duration
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

    onClick() {
        gdk.panel.open(PanelId.MainLineGiftView)
    }

}