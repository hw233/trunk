import { Champion_mainCfg } from '../../../a/config';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import TimerUtils from '../../../common/utils/TimerUtils';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import ActUtil from '../../act/util/ActUtil';
import ChampionModel from '../model/ChampionModel';
import ChampionRankItemCtrl from './ChampionRankItemCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-23 14:26:04 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChampionRankViewCtrl")
export default class ChampionRankViewCtrl extends gdk.BasePanel {
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
    cfg: Champion_mainCfg;

    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v !== 0) {
            return;
        }
        this._leftTime = Math.max(0, v);
        if (this._leftTime == 0) {
            // this.close();
            this.timeLab.string = '活动已结束';
        }
        else {
            this.timeLab.string = TimerUtils.format1(this.leftTime / 1000);
        }
    }

    onEnable() {
        NetManager.on(icmsg.ChampionRankingRsp.MsgType, this._updateList, this);
        // this.uiTabMenu.setSelectIdx(0, true);
        this.onTabMenuSelect(true, 0);
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
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
        this.titleLab1.string = data == 0 ? gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP5") : gdk.i18n.t("i18n:CHAMPION_RANK_TIP1");
        this.titleLab2.string = data == 0 ? gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP6") : gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP8");
        this.scrollView.node.height = data == 0 ? 607 : 710;
        if (data == 0) {
            let req = new icmsg.ChampionRankingReq();
            NetManager.send(req, null, this);
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
            datas = ModelManager.get(ChampionModel).rankList;
        }
        else {
            //reward
            // if (this.cfg) {
            // datas = ConfigManager.getItemsByField(Adventure_rankingCfg, 'type', cfg.reward_type);
            // }
        }
        this.list.clear_items();
        this.list.set_data(datas);
        this._updateMyRankItem();
        this._updateTime();
    }

    _updateMyRankItem() {
        if (this.curSelectView == 0) {
            this.myRankItem.active = true;
            let ctrl = this.myRankItem.getChildByName('ChampionRankItem').getComponent(ChampionRankItemCtrl);
            let cM = ModelManager.get(ChampionModel);
            let info: icmsg.ChampionPlayer = new icmsg.ChampionPlayer();
            let rBrief = new icmsg.RoleBrief();
            let rM = ModelManager.get(RoleModel);
            rBrief.name = rM.name;
            rBrief.level = rM.level;
            rBrief.head = rM.head;
            rBrief.headFrame = rM.frame;
            rBrief.power = rM.power;
            rBrief.title = rM.title
            info.brief = rBrief;
            info.points = cM.myPoints || 1;
            ctrl.curIndex = cM.myRank ? cM.myRank - 1 : 999;
            ctrl.updateItem(info);
        }
        else {
            this.myRankItem.active = false;
        }
    }

    endTime: number = 0;
    _updateTime() {
        // this.cfg = null;
        // let cfg: Champion_mainCfg = ConfigManager.getItemById(Champion_mainCfg, ModelManager.get(ChampionModel).infoData.seasonId);
        // if (cfg) {
        //     let curTime = GlobalUtil.getServerTime();
        //     let c = cfg.close_time.split('/');
        //     let ct = new Date(c[0] + '/' + c[1] + '/' + c[2] + ' ' + c[3] + ':' + c[4] + ':' + c[5]).getTime();
        //     this.leftTime = ct - curTime;
        // }
        // else {
        //     this.timeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3");
        // }
        if (this.endTime) {
            let curTime = GlobalUtil.getServerTime();
            this.leftTime = this.endTime - curTime;
        } else {
            if (ActUtil.ifActOpen(122)) {
                let curTime = GlobalUtil.getServerTime();
                this.endTime = ActUtil.getActEndTime(122)
                this.leftTime = this.endTime - curTime;
            } else {
                this.timeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP3");
            }
        }

    }
}
