import FootHoldModel from '../FootHoldModel';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import ServerModel from '../../../../../common/models/ServerModel';
import TimerUtils from '../../../../../common/utils/TimerUtils';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-17 16:26:11
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cooperation/FHCooperationNoticeCtrl")
export default class FHCooperationNoticeCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    noticeItem: cc.Prefab = null

    @property(cc.Label)
    timeText: cc.Label = null

    @property(cc.Label)
    leftTime: cc.Label = null

    list: ListView = null

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        this._updateViewInfo()
    }

    onDisable() {
        this._clearEndTimer()
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.noticeItem,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        })
    }

    _updateViewInfo() {
        this._initListView()
        GlobalUtil.sortArray(this.footHoldModel.cooperGuildList, (a, b) => {
            return b.guildInfo.score - a.guildInfo.score
        })
        this.list.set_data(this.footHoldModel.cooperGuildList)
        if (this.footHoldModel.warEndTime == 0) {
            this.timeText.node.active = false
            this.leftTime.string = ``
            return
        }
        this._createEndTime()
    }


    onOpenGuess() {
        gdk.panel.hide(PanelId.FHCooperationNotice)
        JumpUtils.openFootholdGuess()
    }


    onOpenFight() {
        gdk.panel.hide(PanelId.FHCooperationNotice)
        JumpUtils.openFootholdMainView()
    }

    onOpenRankReward() {
        gdk.panel.hide(PanelId.FHCooperationNotice)
        JumpUtils.openFootholdRankView()
    }

    _createEndTime() {
        this._updateEndTime()
        this._clearEndTimer()
        this.schedule(this._updateEndTime, 1)
    }

    _updateEndTime() {
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        if (this.footHoldModel.warEndTime - curTime <= 0) {
            this._clearEndTimer()
            this.timeText.node.active = false
            this.leftTime.string = gdk.i18n.t("i18n:FOOTHOLD_TIP148")//`已结束`
        } else {
            this.leftTime.string = TimerUtils.format1(Math.floor(this.footHoldModel.warEndTime - curTime))
        }
    }

    _clearEndTimer() {
        this.unschedule(this._updateEndTime)
    }

}
