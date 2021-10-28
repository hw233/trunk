import { Adventure2_rankingCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import TimerUtils from '../../../common/utils/TimerUtils';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import { ActivityEventId } from '../../act/enum/ActivityEventId';
import ActUtil from '../../act/util/ActUtil';
import NewAdventureModel from '../model/NewAdventureModel';
import AdventureRankItem2Ctrl from './AdventureRankItem2Ctrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-10 17:35:53 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdventureRankView2Ctrl")
export default class AdventureRankView2Ctrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    rankItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    rewardItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    myRankItem: cc.Node = null;

    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Label)
    titleLab1: cc.Label = null;

    @property(cc.Label)
    titleLab2: cc.Label = null;

    curSelectView: number;
    list: ListView;
    actId: number = 107;

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
        NetManager.on(icmsg.Adventure2RankListRsp.MsgType, this._updateList, this);
        this.uiTabMenu.setSelectIdx(0, true);
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

    onTabMenuSelect(e, data) {
        if (!e) return;
        this.curSelectView = data;
        this.titleLab1.string = data == 0 ? `${gdk.i18n.t("i18n:ADVENTURE_TIP18")}` : `${gdk.i18n.t("i18n:ADVENTURE_TIP19")}`;
        this.titleLab2.string = data == 0 ? `${gdk.i18n.t("i18n:ADVENTURE_TIP20")}` : `${gdk.i18n.t("i18n:ADVENTURE_TIP21")}`;
        this.scrollView.node.height = data == 0 ? 607 : 710;
        if (data == 0) {
            let req = new icmsg.Adventure2RankListReq();
            NetManager.send(req);
        }
        else {
            this._updateList();
        }
    }

    _initList() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.curSelectView == 0 ? this.rankItemPrefab : this.rewardItemPrefab,
            cb_host: this,
            gap_y: 15,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    _updateList() {
        this._initList();
        let datas;
        if (this.curSelectView == 0) {
            //rank
            datas = ModelManager.get(NewAdventureModel).adventRankInfo;
        }
        else {
            //reward
            let cfg = ActUtil.getCfgByActId(107);
            if (cfg) {
                datas = ConfigManager.getItems(Adventure2_rankingCfg, { type: cfg.reward_type, server: ModelManager.get(NewAdventureModel).adventServerNum });
                if (datas.length == 0) {
                    datas = ConfigManager.getItems(Adventure2_rankingCfg, { type: cfg.reward_type, server: 1 });
                }
            }
        }
        this.list.clear_items();
        this.list.set_data(datas);
        this._updateMyRankItem();
        this._updateTime();
    }

    _updateMyRankItem() {
        if (this.curSelectView == 0) {
            this.myRankItem.active = true;
            let ctrl = this.myRankItem.getChildByName('AdventureRankItem').getComponent(AdventureRankItem2Ctrl);
            let aM = ModelManager.get(NewAdventureModel);
            let info = aM.adventMyRankInfo;
            if (!info) {
                info = new icmsg.Adventure2RankBrief();
                let rBrief = new icmsg.RoleBrief();
                let rM = ModelManager.get(RoleModel);
                rBrief.id = rM.id
                rBrief.name = rM.name;
                rBrief.level = rM.level;
                rBrief.head = rM.head;
                rBrief.headFrame = rM.frame;
                info.brief = rBrief;
                //info.value = 0;
                info.layerId = aM.endless_layerId
                info.plateIndex = aM.endless_plateIndex
                aM.adventMyRankInfo = info;
                //aM.adventMyRankNum = 998;
            }
            ctrl.curIndex = aM.adventMyRankNum - 1;
            ctrl.updateItem(info);
        }
        else {
            this.myRankItem.active = false;
        }
    }

    _updateTime() {
        let actCfg = ActUtil.getCfgByActId(this.actId);
        if (actCfg) {
            let endTime = ActUtil.getActEndTime(this.actId);
            this.leftTime = endTime - GlobalUtil.getServerTime();
        }
    }
}
