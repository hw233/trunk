import ActUtil from '../../act/util/ActUtil';
import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureModel from '../../adventure2/model/NewAdventureModel';
import NewAdventureUtils from '../../adventure2/utils/NewAdventureUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import { ActivityCfg, Adventure2_storeCfg } from '../../../a/config';
import { ActivityEventId } from '../../act/enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-10 13:53:43 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdventureStoreViewCtrl")
export default class AdventureStoreViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    get advModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel) }

    actId: number = 56;
    actCfg: ActivityCfg;
    list: ListView;

    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v !== 0) {
            return;
        }
        this._leftTime = Math.max(0, v);
        if (this._leftTime == 0) {
            this.close();
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
        }
        else {
            this.timeLab.string = TimerUtils.format1(this.leftTime / 1000);
        }
    }

    onEnable() {
        this.actCfg = ActUtil.getCfgByActId(this.actId);
        if (this.actCfg) {
            GlobalUtil.setSpriteIcon(this.node, this.costNode.getChildByName('icon'), GlobalUtil.getIconById(100084));
            NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateCostInfo, this);
            let req = new icmsg.Adventure2StoreListReq();
            NetManager.send(req, (resp: icmsg.Adventure2StoreListRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                resp.list.forEach(info => {
                    this.advModel.adventureStoreBuyInfo[info.id] = info.remain;
                });
                this._updateCostInfo();
                this._updateList();
                this._updateTime();
            }, this);

            NetManager.send(new icmsg.Adventure2StateReq(), (resp: icmsg.Adventure2StateRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                // this.advModel.difficulty = resp.difficulty;
                // this.advModel.layerId = resp.layerId;
                // this.advModel.plateIndex = resp.plateIndex
                // this.advModel.plateFinish = resp.plateFinish
                this._updateList();
            }, this);

            NetManager.on(icmsg.Adventure2StoreBuyRsp.MsgType, this._updateList, this);
            NewAdventureUtils.setGuideStep(210016)
        }
        else {
            this.close();
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
        }
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    _dtime: number = 0;
    update(dt: number) {
        if (!this.leftTime) {
            return;
        }
        if (this._dtime >= 1) {
            this._dtime = 0;
            this._updateTime();
        }
        else {
            this._dtime += dt;
        }
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

    _updateList() {
        this._initListView();
        let cfgs: Adventure2_storeCfg[] = [];
        cfgs = ConfigManager.getItemsByField(Adventure2_storeCfg, 'reward_type', this.actCfg.reward_type);
        if (!cfgs || cfgs.length <= 0) {
            let c = ConfigManager.getItems(Adventure2_storeCfg);
            cfgs = ConfigManager.getItemsByField(Adventure2_storeCfg, 'reward_type', c[c.length - 1].reward_type);
        }
        cfgs.sort((a, b) => { return a.sorting - b.sorting; });
        this.list.clear_items();
        this.list.set_data(cfgs);
    }

    _updateCostInfo() {
        let num = BagUtils.getItemNumById(100084) || 0;
        this.costNode.getChildByName('num').getComponent(cc.Label).string = num + '';
    }

    _updateTime() {
        let actCfg = ActUtil.getCfgByActId(this.actId);
        if (actCfg) {
            let endTime = ActUtil.getActEndTime(this.actId);
            this.leftTime = endTime - GlobalUtil.getServerTime();
        }
    }
}
