import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildModel from '../../model/GuildModel';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import SiegeModel from './SiegeModel';
import StoreViewCtrl, { StoreActScoreTabType } from '../../../store/ctrl/StoreViewCtrl';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { networkInterfaces } from 'os';
import { Siege_globalCfg, TipsCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-25 17:43:08
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/siege/SiegeMainViewCtrl")
export default class SiegeMainViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    guildItem: cc.Prefab = null

    @property(cc.Node)
    descContent: cc.Node = null;

    @property(cc.Node)
    descItem: cc.Node = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    list: ListView = null;

    get siegeModel() { return ModelManager.get(SiegeModel); }
    get guildModel() { return ModelManager.get(GuildModel); }

    onEnable() {

        if (!this.guildModel.guildDetail) {
            let msg = new icmsg.GuildDetailReq()
            msg.guildId = ModelManager.get(RoleModel).guildId
            NetManager.send(msg)
        }

        NetManager.on(icmsg.SiegeRankListRsp.MsgType, this._onSiegeRankListRsp, this)

        let msg = new icmsg.SiegeRankListReq()
        NetManager.send(msg)

        this._updateDesContent()
        this._createEndTime()
    }

    onDisable() {
        NetManager.targetOff(this)
        this._clearEndTime()
    }

    async _onSiegeRankListRsp(data: icmsg.SiegeRankListRsp) {
        this._initListView()
        let datas = data.list
        let ids = []
        datas.forEach(element => {
            ids.push(element.guildId)
        });
        await ModelManager.get(ServerModel).reqServerNameByIds(ids, 2);

        if (datas.length == 0) {
            let tempDatas = []
            for (let i = 0; i < 4; i++) {
                let info = new icmsg.SiegeRankBrief()
                info.guildId = 0
                tempDatas.push(info)
            }
            this.list.set_data(tempDatas)
        } else {
            this.list.set_data(datas)
        }
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.guildItem,
            cb_host: this,
            gap_y: 5,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    _updateDesContent() {
        let tipCfg = ConfigManager.getItemById(TipsCfg, 98)
        let datas = (tipCfg.desc21 as String).split("<br>")
        for (let i = 0; i < datas.length; i++) {
            let item = cc.instantiate(this.descItem)
            item.active = true
            this.descContent.addChild(item)
            item.getComponent(cc.RichText).string = `${datas[i]}`
        }
    }

    onRankRewardFunc() {
        gdk.panel.open(PanelId.SiegeRankReward)
    }

    onStoreFunc() {
        // gdk.panel.open(PanelId.SiegeStore)
        JumpUtils.openPanel({
            panelId: PanelId.Store,
            panelArgs: { args: [1] },
            currId: this.node,
            callback: (panel) => {
                let comp = panel.getComponent(StoreViewCtrl)
                comp.typeBtnSelect(null, StoreActScoreTabType.Siege)
                gdk.Timer.once(10, this, () => {
                    comp.typeBtnSelect(null, StoreActScoreTabType.Siege)
                })
            }
        });
    }

    onLogFunc() {
        gdk.panel.setArgs(PanelId.GuildLog, 6)
        gdk.panel.open(PanelId.GuildLog)
    }

    onOpenFightFunc() {
        JumpUtils.openPanel({
            panelId: PanelId.SiegeFightView,
            currId: this.node
        })
    }

    _createEndTime() {
        this._updateEndTime()
        this._clearEndTime()
        this.schedule(this._updateEndTime, 1)
    }

    _updateEndTime() {
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let firstDayZero = TimerUtils.getWeekFirstDayZeroTime(curTime)//当周周一0点
        let leftTime = firstDayZero - 3600 + 7 * 86400 - curTime //周日11点结算
        if (leftTime > 0) {
            this.timeLab.string = StringUtils.format(gdk.i18n.t("i18n:SIEGE_TIP6"), TimerUtils.format7(leftTime))//TimerUtils.format7(leftTime) + "后结算"
        } else {
            this.timeLab.string = ""
        }
    }

    _clearEndTime() {
        this.unschedule(this._updateEndTime)
    }

}