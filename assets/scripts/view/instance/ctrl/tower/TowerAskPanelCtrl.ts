import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TrialInfo from '../../trial/model/TrialInfo';
import { Copy_stageCfg, GlobalCfg, ItemCfg } from '../../../../a/config';
import { InstanceEventId } from '../../enum/InstanceEnumDef';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/**
 * @Description: 爬塔 无尽黑暗
 * @Author: luoyong
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:32:59
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/tower/TowerAskPanelCtrl")
export default class TowerAskPanelCtrl extends gdk.BasePanel {

    @property(cc.RichText)
    askLab: cc.RichText = null

    @property(cc.Label)
    saoNum: cc.Label = null

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    rewardPre: cc.Prefab = null;


    buyNum: number = 0;
    model: TrialInfo = ModelManager.get(TrialInfo);//爬塔信息
    roleModel: RoleModel = ModelManager.get(RoleModel)
    list: ListView;
    maxBuy: number = 0;
    payData: number[];
    onEnable() {
        this.payData = ConfigManager.getItemByField(GlobalCfg, 'key', 'tower_sweep_pay_number').value;
        this.maxBuy = this.payData[0]
        let args = gdk.panel.getArgs(PanelId.TowerAskPanel);
        if (args) {

        }

        let cfg = ConfigManager.getItemById(Copy_stageCfg, this.model.lastStageId);

        this.askLab.string = cfg ? StringUtils.format(gdk.i18n.t("i18n:TOWER_ASKPANEL_TIP1"), cfg.name) : gdk.i18n.t("i18n:TOWER_ASKPANEL_TIP2")
        this._refreshSaoInfo()
        this.initRewardData(cfg);
        gdk.e.on(InstanceEventId.RSP_TOWER_BUYNUM_REFRESH, this._refreshSaoInfo, this);
        gdk.e.on(InstanceEventId.RSP_TOWER_SAO_REFRESH, this._refreshSaoInfo, this);
    }

    onDisable() {
        gdk.e.targetOff(this)
        if (this.list) {
            this.list.destroy()
        }
    }
    initRewardData(cfg: Copy_stageCfg) {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scroll,
                mask: this.scroll.node,
                content: this.content,
                item_tpl: this.rewardPre,
                cb_host: this,
                async: true,
                gap_x: 10,
                gap_y: 0,
                direction: ListViewDir.Horizontal,
            })
        }
        let data = []
        let i = 0;
        if (!cc.js.isString(cfg.sweep)) {
            cfg.sweep.forEach(element => {
                let tem = { index: i, typeId: element[0], num: element[1], delayShow: false, effect: false }
                data.push(tem);
                i++
            });
        }
        this.list.set_data(data);

        let x = Math.min(500, ((i) * 110 + (i - 1) * 10))
        this.scroll.node.width = x;
        this.scroll.node.setPosition(cc.v2(-x / 2, 198))
    }

    _refreshSaoInfo() {
        //
        let cfg = ConfigManager.getItemById(GlobalCfg, "tower_sweep_consumption").value
        let model = this.model
        let allNum = cfg[0] + model.buyNum;
        this.saoNum.string = StringUtils.format(gdk.i18n.t("i18n:TOWER_ASKPANEL_TIP3"), allNum - model.raidsNum, allNum)//'剩余扫荡次数：' + (allNum - model.raidsNum) + '/' + allNum;
        if (allNum - model.raidsNum <= 0) {
            this.close();
        }
    }

    cancelClick() {
        this.close()
    }

    sureClick() {
        //cc.log('----------------------------发送扫荡请求')
        NetManager.send(new icmsg.DungeonTrialRaidsReq(), (rsp: icmsg.DungeonTrialRaidsRsp) => {

            GlobalUtil.openRewadrView(rsp.rewards);
            this.model.raidsNum += 1;
            //this.model.lastStageId = rsp.stageId;
            gdk.e.emit(InstanceEventId.RSP_TOWER_SAO_REFRESH)

            //this.close()
        }, this);
    }

    buyBtnClick() {

        if (this.maxBuy - this.model.buyNum <= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:TOWER_ASKPANEL_TIP4"))
            return;
        }
        //gdk.gui.showMessage('购买次数功能暂未开放')
        let item = ConfigManager.getItemById(ItemCfg, this.payData[1]);
        let cost = this.payData[2];
        if (this.roleModel.gems >= cost) {
            GlobalUtil.openAskPanel({
                title: gdk.i18n.t("i18n:TIP_TITLE"),
                descText: StringUtils.format(gdk.i18n.t("i18n:TOWER_ASKPANEL_TIP5"), cost, item.name),//`是否花费${cost}${item.name}购买一次扫荡次数?`,
                thisArg: this,
                sureText: gdk.i18n.t("i18n:TOWER_ASKPANEL_TIP6"),
                sureCb: () => {
                    NetManager.send(new icmsg.DungeonTrialBuyRaidsReq(), (rsp: icmsg.DungeonTrialBuyRaidsRsp) => {
                        //GlobalUtil.openRewadrView(rsp.rewards);
                        //this.model.lastStageId = rsp.stageId;
                        //self._updateListView()
                        this.model.buyNum = rsp.buyRaids;
                        this.model.raidsNum = rsp.raids;
                        gdk.e.emit(InstanceEventId.RSP_TOWER_BUYNUM_REFRESH)
                        //this._refreshSaoInfo()
                    }, this);
                },
            });
        } else {
            //return gdk.gui.showMessage(itemCfg.name + "及钻石数量不足")
            //钻石不足判断
            if (!GlobalUtil.checkMoneyEnough(cost, 2, null, [PanelId.Instance])) {
                return
            }
        }
    }

    refreshSaoNum() {

    }
}
