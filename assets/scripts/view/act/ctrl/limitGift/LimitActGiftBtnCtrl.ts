import ActivityModel from '../../model/ActivityModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import ServerModel from '../../../../common/models/ServerModel';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { Store_time_giftCfg } from '../../../../a/config';


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/LimitActGiftBtnCtrl")
export default class LimitActGiftBtnCtrl extends cc.Component {

    // @property(cc.Node)
    // giftIcon: cc.Node = null;

    // @property(cc.Node)
    // giftTitle: cc.Node = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    // @property(cc.Node)
    // heroIcon: cc.Node = null;

    get aModel(): ActivityModel { return ModelManager.get(ActivityModel); }
    get serverModel(): ServerModel { return ModelManager.get(ServerModel) }

    _endTime: number = 0
    _cfg: Store_time_giftCfg
    _curGift: icmsg.ActivityTimeGift = null;
    onEnable() {

    }

    onDisable() {
        this._clearTimer()
    }

    @gdk.binding("aModel.LimitGiftDatas")
    updateState() {
        this._endTime = 0
        let datas = this.aModel.LimitGiftDatas
        let newDatas: icmsg.ActivityTimeGift[] = [];
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000);


        for (let i = 0; i < datas.length; i++) {
            let element = datas[i]
            let cfg = ConfigManager.getItemByField(Store_time_giftCfg, "id", element.giftId)
            if (cfg.gift_type == 4 || cfg.gift_type == 5) {
                continue
            }
            if (cfg && element.state == 1 || (element.state == 0 && curTime < element.endTime)) {
                newDatas.push(element)
            }
        }
        if (newDatas.length > 0) {
            for (let i = 0, n = newDatas.length; i < n; i++) {
                let data = newDatas[i]
                if (data.state == 0) {
                    this._curGift = data;
                    break;
                }
            }
            if (!this._curGift) {
                this._curGift = newDatas[0]
            }
            this._endTime = newDatas[0].endTime
        }
        // if (newDatas.length > 0) {
        //     this._startTime = newDatas[0].endTime
        //     this._cfg = ConfigManager.getItemById(Store_time_giftCfg, newDatas[0].giftId)

        //     let url = 'view/act/texture/common/';
        // GlobalUtil.setSpriteIcon(this.node, this.giftIcon, url + this._cfg.gift_icon);
        // GlobalUtil.setSpriteIcon(this.node, this.giftTitle, url + this._cfg.gift_name);

        // GlobalUtil.setSpriteIcon(this.node, this.heroIcon, HeroUtils.getHeroHeadIcon(this._cfg.themehero));
        // }
        this._createRfreshTime()
    }

    _createRfreshTime() {
        this._updateTime()
        this._clearTimer()
        this.schedule(this._updateTime, 1)
    }

    _updateTime() {
        if (this._endTime > 0) {
            let endTime = this._endTime
            let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
            if (endTime - curTime <= 0 && this._curGift.state == 0) {
                this.updateState()
                this.node.active = false
            } else {
                this.node.active = true
                if (this._curGift.state == 0) {
                    this.timeLab.string = `${TimerUtils.format2(Math.floor(endTime - curTime))}`
                } else {
                    this.timeLab.string = ''
                }

            }
        } else {
            this.node.active = false
        }
    }

    _clearTimer() {
        this.unschedule(this._updateTime)
    }

    onClick() {
        gdk.panel.open(PanelId.LimitActGiftView)
    }

}