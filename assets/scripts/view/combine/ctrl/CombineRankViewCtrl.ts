import ActUtil from '../../act/util/ActUtil';
import CombineModel from '../model/CombineModel';
import CombineRankItemCtrl from './CombineRankItemCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildUtils from '../../guild/utils/GuildUtils';
import LoginModel from '../../../common/models/LoginModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import { ActivityEventId } from '../../act/enum/ActivityEventId';
import { Combine_personal_rankCfg, Combine_rewardsCfg, Combine_topupCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { RankTypes } from '../../rank/enum/RankEvent';

/**
 * @Description: 合服狂欢 合服排行
 * @Author: luoyong
 * @Date: 2019-07-19 16:45:14
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-09 20:19:42
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/combine/CombineRankViewCtrl")
export default class CombineRankViewCtrl extends gdk.BasePanel {
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
    titleLab1: cc.Label = null;

    @property(cc.Label)
    titleLab2: cc.Label = null;

    @property(cc.Label)
    titleLab3: cc.Label = null;

    curSelectView: number;
    list: ListView;
    actId = 93

    get combineModel(): CombineModel { return ModelManager.get(CombineModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

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
    }

    onEnable() {
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
            let req = new icmsg.RankDetailReq();
            req.type = RankTypes.Combine
            NetManager.send(req, (data: icmsg.RankDetailRsp) => {
                this.combineModel.rankingList = data.list
                this._updateList()
            });
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

    async _updateList() {
        this._initList();
        let datas;
        if (this.curSelectView == 0) {
            //rank
            datas = this.combineModel.rankingList
            this.titleLab3.node.active = true
            let ids = []
            for (let i = 0; i < datas.length; i++) {
                if (datas[i].brief) {
                    ids.push(datas[i].brief.id)
                }
            }
            await ModelManager.get(ServerModel).reqServerNameByIds(ids);
        }
        else {
            datas = ConfigManager.getItems(Combine_personal_rankCfg, { type: ModelManager.get(RoleModel).serverMegCount });
            if (datas.length == 0) {
                datas = ConfigManager.getItems(Combine_personal_rankCfg, { type: 1 });
            }
            this.titleLab3.node.active = false
        }
        this.list.clear_items();
        this.list.set_data(datas);
        this._updateMyRankItem();
        this._updateTime();
    }

    _updateMyRankItem() {
        if (this.curSelectView == 0) {
            this.myRankItem.active = true;
            let ctrl = this.myRankItem.getChildByName('CombineRankItem').getComponent(CombineRankItemCtrl);

            let brief = new icmsg.RoleBrief()
            brief.id = this.roleModel.id
            brief.head = this.roleModel.head
            brief.headFrame = this.roleModel.frame
            brief.name = this.roleModel.name
            brief.level = this.roleModel.level
            brief.vipExp = this.roleModel.vipExp

            let info = new icmsg.RankBrief()
            info.brief = brief
            info.value = this.combineModel.playerScore
            ctrl.curIndex = this.combineModel.playerRank - 1
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
