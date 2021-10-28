import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { BagEvent } from '../../../bag/enum/BagEvent';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Secretarea_store1Cfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-09-15 10:50:05 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-15 13:45:38
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wonderfulActivity/MidAutumnStoreViewCtrl")
export default class MidAutumnStoreViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Label)
    hasLab: cc.Label = null;

    @property(cc.Node)
    hasIcon: cc.Node = null;

    list: ListView;

    get activityModel(): ActivityModel { return ModelManager.get(ActivityModel) }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel) }

    onEnable() {

        let msg = new icmsg.ActivityStoreBuyInfoReq()
        msg.activityId = 135 //中秋秘境商店兑换活动id
        NetManager.send(msg, (data: icmsg.ActivityStoreBuyInfoRsp) => {
            this.activityModel.midAutumnStoreBuyInfo = {}
            for (let i = 0; i < data.info.length; i++) {
                this.activityModel.midAutumnStoreBuyInfo[data.info[i].id] = data.info[i]
            }
            this._updateStoreView()
        })
        let cfg = ConfigManager.getItemByField(Secretarea_store1Cfg, "activity", 135)
        GlobalUtil.setSpriteIcon(this.node, this.hasIcon, GlobalUtil.getIconById(cfg.money_cost[0]))
        this._updateBagItem()
        this._updateTime()
        gdk.Timer.loop(1000, this, this._updateTime)

        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateBagItem, this)
    }

    onDisable() {
        gdk.Timer.clear(this, this._updateTime)
        gdk.e.targetOff(this)
    }

    _updateTime() {
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let endTime = Math.floor(ActUtil.getActEndTime(135) / 1000)
        let leftTime = endTime - curTime
        if (leftTime > 0) {
            this.timeLab.string = `${TimerUtils.format1(leftTime)}`
        } else {
            this.timeLab.string = `${gdk.i18n.t("i18n:MAGIC_EXCHANGE_TIP3")}`
        }
    }

    _updateBagItem() {
        let cfg = ConfigManager.getItemByField(Secretarea_store1Cfg, "activity", 135)
        GlobalUtil.setSpriteIcon(this.node, this.hasIcon, GlobalUtil.getIconById(cfg.money_cost[0]))
        this.hasLab.string = `${BagUtils.getItemNumById(cfg.money_cost[0])}`
    }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                column: 2,
                gap_x: -2,
                gap_y: 2,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }

    @gdk.binding("activityModel.midAutumnStoreBuyInfo")
    _refreshStoreView() {
        this._updateStoreView()
    }

    _updateStoreView(isReset: boolean = false) {
        this._initListView()
        let actCfg = ActUtil.getCfgByActId(135)
        if (!actCfg) {
            return
        }

        let storeCfgs = ConfigManager.getItems(Secretarea_store1Cfg, { activity: actCfg.id, reward_type: actCfg.reward_type })
        GlobalUtil.sortArray(storeCfgs, (a, b) => {
            return a.sorting - b.sorting
        })
        this.list.set_data(storeCfgs, isReset)
    }
}
