import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import ServerModel from '../../../../common/models/ServerModel';
import StoreModel from '../../model/StoreModel';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Store_pushCfg } from '../../../../a/config';
import { StoreEventId } from '../../enum/StoreEventId';

/** 
 * @Description: 
 * @Author: weiliang.huang  
 * @Date: 2019-03-25 17:29:13 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-26 18:36:43
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/starPushGift/StarPushGiftViewCtrl")
export default class StarPushGiftViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    giftItem: cc.Prefab = null

    @property(cc.Button)
    typeBtns: cc.Button[] = []

    @property(cc.Node)
    starIcon: cc.Node = null

    @property(cc.Label)
    timeLab: cc.Label = null

    list: ListView = null

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }
    get serverModel(): ServerModel { return ModelManager.get(ServerModel) }
    _btnTypes = []
    _curSelect: number = 0
    _selectStar: number = 0

    onEnable() {
        let args = this.args
        if (args && args.length > 0) {
            this._selectStar = args[0]
        }
        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._updatePaySucc, this)
        let msg = new icmsg.StorePushListReq()
        NetManager.send(msg)
    }

    onDisable() {
        gdk.e.targetOff(this)
        this._clearTimer()
        HeroUtils.showHeroCommment()
    }

    //充值成功
    _updatePaySucc(e: gdk.Event) {
        GlobalUtil.openRewadrView(e.data.list)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.giftItem,
            cb_host: this,
            gap_x: 0,
            async: true,
            direction: ListViewDir.Horizontal,
        })
    }

    @gdk.binding("storeModel.starGiftDatas")
    updateListView() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabledInHierarchy) return;

        let curTime = Math.floor(this.serverModel.serverTime / 1000)
        this._initListView()
        this._btnTypes = []
        this.storeModel.starGiftDatas.forEach(element => {
            let cfg = ConfigManager.getItemById(Store_pushCfg, element.giftId)
            if (cfg && cfg.event_type == 1 && this._btnTypes.indexOf(cfg.open_conds) == -1 && (element.startTime + cfg.duration > curTime)) {
                this._btnTypes.push(cfg.open_conds)
            }
        });
        GlobalUtil.sortArray(this._btnTypes, (a, b) => {
            return a - b
        })
        for (let i = 0; i < this._btnTypes.length; i++) {
            let btn = this.typeBtns[i].node
            btn.active = true
            let commonText = btn.getChildByName("common").getChildByName("label").getComponent(cc.Label)
            let selectText = btn.getChildByName("select").getChildByName("label").getComponent(cc.Label)
            let cfg = ConfigManager.getItemByField(Store_pushCfg, "open_conds", this._btnTypes[i], { event_type: 1 })
            if (cfg) {
                commonText.string = `${cfg.tag_name}`
                selectText.string = `${cfg.tag_name}`
            } else {
                commonText.string = `${this._btnTypes[i]}${gdk.i18n.t('i18n:STAR_PUSH_TIP3')}`
                selectText.string = `${this._btnTypes[i]}${gdk.i18n.t('i18n:STAR_PUSH_TIP3')}`
            }

        }
        if (this._selectStar > 0) {
            this._curSelect = this._btnTypes.indexOf(this._selectStar)
        }
        this.typeBtnSelect(null, this._curSelect)
    }

    typeBtnSelect(e, utype) {
        utype = parseInt(utype)
        let starType = this._btnTypes[utype]
        if (!starType) {
            return
        }
        this._selectStar = starType
        if (starType >= 10) {
            this.starIcon.active = false
        } else {
            this.starIcon.active = true
            GlobalUtil.setSpriteIcon(this.node, this.starIcon, `view/store/textrue/starPushGift/pushGiftStar_${starType}`)
        }
        for (let idx = 0; idx < this.typeBtns.length; idx++) {
            const element = this.typeBtns[idx];
            if (element.node.active) {
                element.interactable = idx != utype
                let select = element.node.getChildByName("select");
                select.active = idx == utype
                let common = element.node.getChildByName("common");
                common.active = idx != utype
            }
        }

        let newDatas: icmsg.StorePushGift[] = []
        let datas = this.storeModel.starGiftDatas
        for (let i = 0; i < datas.length; i++) {
            let cfg = ConfigManager.getItemById(Store_pushCfg, datas[i].giftId)
            if (cfg && cfg.event_type == 1 && cfg.open_conds == starType) {
                newDatas.push(datas[i])
            }
        }
        GlobalUtil.sortArray(newDatas, (a, b) => {
            return a.giftId - b.giftId
        })
        this.list.set_data(newDatas)
        this._createRfreshTime()
    }

    _createRfreshTime() {
        this._updateTimeText()
        this._clearTimer()
        this.schedule(this._updateTimeText, 1)
    }

    _updateTimeText() {
        let item: icmsg.StorePushGift = this.list.datas[0]
        let targetCfg = ConfigManager.getItemById(Store_pushCfg, item.giftId)
        let endTime = item.startTime + targetCfg.duration
        let curTime = Math.floor(this.serverModel.serverTime / 1000)
        if (endTime - curTime > 0) {
            this.timeLab.string = `${TimerUtils.format2(endTime - curTime)}`
        } else {
            this.timeLab.string = gdk.i18n.t('i18n:KFCB_TIP3')
            this._clearTimer()
        }
    }

    _clearTimer() {
        this.unschedule(this._updateTimeText)
    }

}