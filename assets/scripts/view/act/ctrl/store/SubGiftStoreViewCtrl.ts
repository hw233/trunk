import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import { ActivityCfg, Operation_storeCfg } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/**
 * 活动--礼券商城
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-29 19:43:48
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:37:48
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/store/SubGiftStoreViewCtrl")
export default class SubGiftStoreViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    activityId: number = 48;
    list: ListView;
    cfg: ActivityCfg;

    get model(): ActivityModel { return ModelManager.get(ActivityModel) }

    onEnable() {
        NetManager.on(icmsg.OperationStoreUpdateRsp.MsgType, this._onOperationStoreUpdateRsp, this)
        NetManager.on(icmsg.PaySuccRsp.MsgType, this._onPaySuccRsp, this);
        let startTime = new Date(ActUtil.getActStartTime(this.activityId));
        let endTime = new Date(ActUtil.getActEndTime(this.activityId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            return;
        }
        else {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2") + `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
            this.cfg = ActUtil.getCfgByActId(this.activityId);
        }

        let msg = new icmsg.OperationStoreListInfoReq()
        NetManager.send(msg, (data: icmsg.OperationStoreListInfoRsp) => {
            let list = data.list
            list.forEach(element => {
                this.model.subStoreBuyInfos[element.id] = element
            });
            this._updateView();
        })
    }

    onDisable() {
        gdk.Timer.clearAll(this);
        NetManager.targetOff(this)
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                async: true,
                gap_y: 5,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateView() {
        this._initList();
        this.list.clear_items();
        let cfgs = ConfigManager.getItems(Operation_storeCfg, (cfg: Operation_storeCfg) => {
            if (cfg.reward_type == this.cfg.reward_type && cfg.page == 2) return true;
        });
        let datas = []
        let outDatas = []
        for (let i = 0; i < cfgs.length; i++) {
            let buyInfo: icmsg.StoreBuyInfo = this.model.subStoreBuyInfos[cfgs[i].id]
            let count = 0
            if (buyInfo) {
                count = buyInfo.count
            }
            if (cfgs[i].buy - count <= 0) {
                outDatas.push(cfgs[i])
            } else {
                datas.push(cfgs[i])
            }
        }
        this.list.set_data(datas.concat(outDatas), false);
    }

    _onOperationStoreUpdateRsp(data: icmsg.OperationStoreUpdateRsp) {
        this.model.subStoreBuyInfos[data.info.id] = data.info
        this._updateView()
    }

    _onPaySuccRsp(data: icmsg.PaySuccRsp) {
        GlobalUtil.openRewadrView(data.list)
    }
}
