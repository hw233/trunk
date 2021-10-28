import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuardianTowerModel from '../../model/GuardianTowerModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { GlobalCfg, Guardiantower_towerCfg } from '../../../../a/config';
import { InstanceEventId } from '../../../instance/enum/InstanceEnumDef';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';


/**
 * @Description: 护使秘境扫荡界面
 * @Author: yaozu.hu
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-14 10:13:43
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guardianTower/GuardianTowerAskPanelCtrl")
export default class GuardianTowerAskPanelCtrl extends gdk.BasePanel {

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
    get model() { return ModelManager.get(GuardianTowerModel); }
    get roleModel() { return ModelManager.get(RoleModel); }
    list: ListView;
    maxBuy: number = 0;
    payData: number[];

    onEnable() {
        this.payData = ConfigManager.getItemByField(GlobalCfg, 'key', 'guardiantower_sweep_cost').value;
        this.maxBuy = this.payData[0]


        let cfg = ConfigManager.getItemById(Guardiantower_towerCfg, this.model.stateInfo.maxStageId);

        //this.askLab.string = cfg ? StringUtils.format(gdk.i18n.t("i18n:TOWER_ASKPANEL_TIP1"), cfg.name) : gdk.i18n.t("i18n:TOWER_ASKPANEL_TIP2")
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
    initRewardData(cfg: Guardiantower_towerCfg) {
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
        let cfg = ConfigManager.getItemByField(GlobalCfg, 'key', "guardiantower_free_sweep").value
        let stateInfo = this.model.stateInfo
        let allNum = cfg[0] + stateInfo.buyRaidNum;
        this.saoNum.string = StringUtils.format(gdk.i18n.t("i18n:TOWER_ASKPANEL_TIP3"), allNum - stateInfo.raidNum, allNum)//'剩余扫荡次数：' + (allNum - model.raidsNum) + '/' + allNum;
        //this.buyNum.string = StringUtils.format(gdk.i18n.t("i18n:TOWER_PANEL_TIP3"), this.maxBuy - stateInfo.buyRaidNum)//'剩余购买次数：' + (this.maxBuy - model.buyNum);

    }

    cancelClick() {
        this.close()
    }

    sureClick() {
        //cc.log('----------------------------发送扫荡请求')
        NetManager.send(new icmsg.GuardianTowerRaidReq(), (rsp: icmsg.GuardianTowerRaidRsp) => {

            GlobalUtil.openRewadrView(rsp.rewards);
            this.model.stateInfo.raidNum = rsp.raidNum;
            gdk.e.emit(ActivityEventId.ACRIVITY_GUARDIANTOWER_REFRESH_RAINNUM)
            this.close()
        }, this);
    }

    buyBtnClick() {

        //1.判断剩余购买次数
        if (this.maxBuy - this.model.stateInfo.buyRaidNum <= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:TOWER_ASKPANEL_TIP4"))
            return;
        }
        //2.发送购买消息
        //gdk.gui.showMessage('购买次数功能暂未开放')
        //let item = ConfigManager.getItemById(ItemCfg, this.payData[1]);
        let cost = this.payData[1];
        if (this.roleModel.gems >= cost) {
            GlobalUtil.openAskPanel({
                title: gdk.i18n.t("i18n:TIP_TITLE"),
                descText: StringUtils.format(gdk.i18n.t("i18n:GUARDIANTOWER_TIP2"), cost),
                thisArg: this,
                sureText: gdk.i18n.t("i18n:OK"),
                sureCb: () => {
                    NetManager.send(new icmsg.GuardianTowerRaidBuyReq(), (rsp: icmsg.GuardianTowerRaidBuyRsp) => {
                        gdk.gui.showMessage(gdk.i18n.t("i18n:MINECOPY_PASSPORT_TIP9"))
                        this.model.stateInfo.buyRaidNum = rsp.buyRaidNum;
                        this._refreshSaoInfo();
                        gdk.e.emit(ActivityEventId.ACRIVITY_GUARDIANTOWER_REFRESH_RAINNUM)
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
