import ActUtil from '../../../act/util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionRankItemCtrl from './ExpeditionRankItemCtrl';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import { Expedition_rankingCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-28 10:18:58
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionRankViewCtrl")
export default class ExpeditionRankViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    lab2: cc.Label = null;

    @property(cc.Label)
    lab3: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    rankItem: cc.Prefab = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    @property(cc.Node)
    myRankItem: cc.Node = null;

    @property(cc.Node)
    tabBtns: cc.Node[] = [];

    @property(cc.Label)
    timeLab: cc.Label = null;

    list: ListView = null

    _selectIndex = 0
    activityId = 114

    onEnable() {
        this.selectType(null, 0)

        let startTime = new Date(ActUtil.getActStartTime(this.activityId));
        let endTime = new Date(ActUtil.getActEndTime(this.activityId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
        }
        else {
            this.timeLab.string = `${gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2")}${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        }
    }

    selectType(e, index) {
        this._selectIndex = index
        for (let i = 0; i < this.tabBtns.length; i++) {
            let node = this.tabBtns[i]
            let btn = node.getComponent(cc.Button)
            btn.interactable = index != i
            let select = node.getChildByName("select")
            let normal = node.getChildByName("normal")
            select.active = index == i
            normal.active = index != i
        }
        this.updateList()
    }

    _initListView() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this._selectIndex == 0 ? this.rankItem : this.rewardItem,
            cb_host: this,
            gap_y: 5,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    updateList() {
        this._initListView();
        let datas = []
        if (this._selectIndex == 0) {
            this.lab2.string = gdk.i18n.t("i18n:EXPEDITION_TIP25")//`玩家`
            this.lab3.node.active = true
            let msg = new icmsg.ExpeditionRankingReq()
            NetManager.send(msg, (data: icmsg.ExpeditionRankingRsp) => {
                datas = data.list
                this.myRankItem.active = true;
                let ctrl = this.myRankItem.getComponent(ExpeditionRankItemCtrl)
                ctrl.updateItem(this._getMyRank(datas), data.mine)
                this.scrollView.node.height = 510;
                this.list.clear_items();
                this.list.set_data(datas);
            })
        }
        else {

            this.lab2.string = gdk.i18n.t("i18n:EXPEDITION_TIP26")//`奖励`
            this.lab3.node.active = false

            let type = ActUtil.getActRewardType(this.activityId)
            let cfgs = ConfigManager.getItems(Expedition_rankingCfg)
            if (type > cfgs[cfgs.length - 1].type) {
                type = cfgs[cfgs.length - 1].type
            }

            let msg = new icmsg.PiecesCrossServerNumReq()
            NetManager.send(msg, (data: icmsg.PiecesCrossServerNumRsp) => {
                let num = data.num
                if (num > cfgs[cfgs.length - 1].server) {
                    num = cfgs[cfgs.length - 1].server
                }
                datas = ConfigManager.getItems(Expedition_rankingCfg, { type: type, server: num });
                this.myRankItem.active = false;
                this.scrollView.node.height = 610;
                this.list.clear_items();
                this.list.set_data(datas);
            })
        }
    }

    _getMyRank(list: icmsg.ExpeditionRankBrief[]) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].roleBrief.id == ModelManager.get(RoleModel).id) {
                return i + 1
            }
        }
        return 0
    }

    openLayView() {
        JumpUtils.openExpeditionMainView()
        gdk.panel.hide(PanelId.ExpeditionRankView)
    }
}