import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import FootHoldModel from '../FootHoldModel';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import RedPointUtils, { RedPointEvent } from '../../../../../common/utils/RedPointUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../../common/models/BagModel';
import { Foothold_teachingCfg, GuideCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-06 17:49:53
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/teaching/FootHoldTeachingItemCtrl")
export default class FootHoldTeachingItemCtrl extends cc.Component {


    @property(cc.Label)
    descLab: cc.Label = null

    @property(cc.Node)
    showPart: cc.Node = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Node)
    btnOpen: cc.Node = null;

    @property(cc.Prefab)
    teachPicItem: cc.Prefab = null

    @property(UiSlotItem)
    slotItem: UiSlotItem = null

    @property(cc.Label)
    descLab2: cc.Label = null

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null

    @property(cc.Label)
    proLab: cc.Label = null

    @property(cc.Node)
    btnGo: cc.Node = null

    @property(cc.Node)
    btnGet: cc.Node = null

    @property(cc.Node)
    hasGet: cc.Node = null

    @property(cc.Node)
    redPoint: cc.Node = null

    @property(cc.Node)
    finishState: cc.Node = null

    list: ListView = null;

    _isOpen: boolean = false
    _index = 0
    _teachCfg: Foothold_teachingCfg

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {

    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.teachPicItem,
            cb_host: this,
            async: true,
            column: 2,
            gap_y: 20,
            direction: ListViewDir.Vertical,
        })
    }

    updateViewInfo(cfg: Foothold_teachingCfg, index) {
        this._teachCfg = cfg
        this.descLab.string = cfg.title
        this.descLab2.string = cfg.desc
        this._index = index

        let itemId = cfg.rewards[0][0]
        let num = cfg.rewards[0][1]
        this.slotItem.updateItemInfo(itemId, num)
        let item: BagItem = {
            series: itemId,
            itemId: itemId,
            itemNum: num,
            type: BagUtils.getItemTypeById(itemId),
            extInfo: null
        }
        this.slotItem.itemInfo = item
        this._updateBtn()
    }

    _updateBtn() {
        this.redPoint.active = false
        this.hasGet.active = false
        this.finishState.active = false
        let finishNum = this.footHoldModel.teachTaskEventDatas[this._teachCfg.eventid] || 0
        if (finishNum >= 0) {
            this.proBar.progress = finishNum / this._teachCfg.number
            this.proLab.string = `${finishNum}/${this._teachCfg.number}`
            if (finishNum < this._teachCfg.number) {
                this.btnGo.active = true
                this.btnGet.active = false
            } else {
                this.btnGo.active = false
                this.btnGet.active = true
                this.redPoint.active = true
            }
        } else {
            this.btnGo.active = false
            this.btnGet.active = false
            this.hasGet.active = true
            this.finishState.active = true
            this.proBar.progress = 1
            this.proLab.string = `${this._teachCfg.number}/${this._teachCfg.number}`
        }
    }

    updateState(isShow) {
        this.showPart.active = isShow
        this._isOpen = isShow
        let btnLab = this.btnOpen.getChildByName("label").getComponent(cc.Label)
        let arrow = this.btnOpen.getChildByName("arrow")
        if (!isShow) {
            btnLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP1")
            arrow.scaleY = 1
        } else {
            btnLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP2")
            arrow.scaleY = -1
        }
    }

    openTheme() {
        let btnLab = this.btnOpen.getChildByName("label").getComponent(cc.Label)
        let arrow = this.btnOpen.getChildByName("arrow")
        if (!this._isOpen) {
            btnLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP2")
            arrow.scaleY = -1
            this._isOpen = true
            this.showPart.active = true
            this._initListView()
            this.list.set_data(this._teachCfg.pictures)
            this.footHoldModel.techingSrollIndex = this._index
        } else {
            this._isOpen = false
            btnLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP1")
            arrow.scaleY = 1
            this.showPart.active = false
        }
    }


    onGoFunc() {
        let guideCfg = ConfigManager.getItemById(GuideCfg, this._teachCfg.guide)
        if (guideCfg) {
            gdk.gui.showMessage(`${guideCfg.text}`)
        }
    }

    onGetFunc() {
        let msg = new icmsg.FootholdGuideCommitReq()
        let guide = new icmsg.FootholdGuide()
        guide.eventId = this._teachCfg.eventid
        guide.number = -1
        msg.guide = guide
        NetManager.send(msg, (data: icmsg.FootholdGuideCommitRsp) => {
            GlobalUtil.openRewadrView(data.rewards)
            this.footHoldModel.teachTaskEventDatas[this._teachCfg.eventid] = -1
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
            this._updateBtn()
        })
    }
}