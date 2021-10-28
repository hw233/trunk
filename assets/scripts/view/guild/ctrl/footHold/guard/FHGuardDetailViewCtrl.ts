import ConfigManager from '../../../../../common/managers/ConfigManager';
import FootHoldModel from '../FootHoldModel';
import FootHoldUtils from '../FootHoldUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GuildModel from '../../../model/GuildModel';
import GuildUtils from '../../../utils/GuildUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import StringUtils from '../../../../../common/utils/StringUtils';
import { AskInfoType } from '../../../../../common/widgets/AskPanel';
import { Foothold_globalCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-25 15:12:43
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/guard/FHGuardDetailViewCtrl")
export default class FHGuardDetailViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    guildName: cc.Label = null

    @property(cc.RichText)
    teamLab: cc.RichText = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    detailItem: cc.Prefab = null

    @property(cc.Node)
    btnCancel: cc.Node = null

    @property(cc.RichText)
    tipLab: cc.RichText = null

    list: ListView = null;

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get guildModel(): GuildModel { return ModelManager.get(GuildModel); }

    onEnable() {

        NetManager.on(icmsg.FootholdGuardTeamRsp.MsgType, this._onFootholdGuardTeamRsp, this)

        let msg = new icmsg.FootholdGuardTeamReq()
        msg.includeOwner = true
        msg.pos = this.footHoldModel.pointDetailInfo.pos
        NetManager.send(msg)

        this.tipLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP125")
        this.guildName.string = `${this.guildModel.guildDetail.info.name}`

        GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(this.guildModel.guildDetail.info.bottom))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(this.guildModel.guildDetail.info.frame))
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(this.guildModel.guildDetail.info.icon))

    }

    onDisable() {
        NetManager.targetOff(this)
    }

    _onFootholdGuardTeamRsp(data: icmsg.FootholdGuardTeamRsp) {
        let guard_forces = ConfigManager.getItemById(Foothold_globalCfg, "guard_forces").value[0]
        let str = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP122"), data.list.length, guard_forces)//`驻守部队(<color=#00ff00>${data.list.length}/${guard_forces}</color>)`
        this.teamLab.string = StringUtils.setRichtOutLine(str, "#543310", 2)
        this._initListView()
        let datas = []
        this.footHoldModel.pointGuardPlayerIds = []
        for (let i = 0; i < 5; i++) {
            if (data.list[i]) {
                datas.push(data.list[i])
                this.footHoldModel.pointGuardPlayerIds.push(data.list[i].id)
            } else {
                let teamInfo = new icmsg.FootholdGuardTeammate()
                teamInfo.index = i
                teamInfo.id = 0
                datas.push(teamInfo)
            }
        }
        this.list.set_data(datas)

        this.btnCancel.active = FootHoldUtils.isPlayerCanSetGuard && data.list.length > 1
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.detailItem,
            cb_host: this,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    onCancelFunc() {
        let askInfo: AskInfoType = {
            sureCb: () => {
                let msg = new icmsg.FootholdGuardCancelReq()
                msg.pos = this.footHoldModel.pointDetailInfo.pos
                NetManager.send(msg, () => {
                    gdk.panel.hide(PanelId.FHGuardDetailView)
                }, this)
            },
            descText: gdk.i18n.t("i18n:FOOTHOLD_TIP123"),
            thisArg: this,
        }
        GlobalUtil.openAskPanel(askInfo)
    }
}