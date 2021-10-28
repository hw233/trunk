import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildModel from '../model/GuildModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import { AskInfoType } from '../../../common/widgets/AskPanel';
import { Guild_globalCfg } from '../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-02 13:47:02
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildCreateSelectCtrl")
export default class GuildCreateSelectCtrl extends gdk.BasePanel {

    @property(cc.Label)
    tipLab: cc.Label = null;

    @property(cc.Node)
    iconA: cc.Node = null;

    @property(cc.Label)
    costLabA: cc.Label = null;

    @property(cc.Node)
    iconB: cc.Node = null;

    @property(cc.Label)
    costLabB: cc.Label = null;

    get model() { return ModelManager.get(GuildModel); }
    get roleModel() { return ModelManager.get(RoleModel); }

    _guildName = ''
    _cfgValue = []

    onEnable() {


        this._guildName = this.args[0]

        this.tipLab.string = gdk.i18n.t("i18n:GUILD_TIP54")
        this._cfgValue = ConfigManager.getItemById(Guild_globalCfg, "create_cost").value

        GlobalUtil.setSpriteIcon(this.node, this.iconA, GlobalUtil.getIconById(this._cfgValue[0]))
        this.costLabA.string = `${this._cfgValue[1]}`

        GlobalUtil.setSpriteIcon(this.node, this.iconB, GlobalUtil.getIconById(this._cfgValue[2]))
        this.costLabB.string = `${this._cfgValue[3]}`
    }


    onCreateFunc(e, type) {
        let index = parseInt(type)

        if (index == 0 && !GlobalUtil.checkMoneyEnough(this._cfgValue[1], this._cfgValue[0], this)) {
            gdk.panel.hide(PanelId.GuildCreate)
            return
        }

        if (index == 1 && BagUtils.getItemNumById(this._cfgValue[2]) < this._cfgValue[3]) {
            let info: AskInfoType = {
                sureCb: () => {
                    gdk.panel.hide(PanelId.GuildCreate)
                    gdk.panel.hide(PanelId.GuildCreateSelect)
                    JumpUtils.openRechargetLBPanel([3, 11013])
                },
                descText: gdk.i18n.t("i18n:GUILD_TIP56"),
                thisArg: this,
            }
            GlobalUtil.openAskPanel(info)
            return
        }

        let msg = new icmsg.GuildCreateReq()
        msg.name = this._guildName
        msg.icon = this.model.selectIcon
        msg.frame = this.model.selectFrame
        msg.bottom = this.model.selectBottom
        msg.costIndex = index
        NetManager.send(msg, (data: icmsg.GuildCreateRsp) => {
            this.model.guildCamp = data.camp
            this.roleModel.guildId = data.camp.guild.id
            this.roleModel.guildName = data.camp.guild.name
            gdk.panel.hide(PanelId.GuildCreate)
            gdk.panel.hide(PanelId.GuildCreateSelect)
            gdk.panel.open(PanelId.GuildMain)


            let reqList = [
                icmsg.FootholdRedPointsReq,
                icmsg.GuildBossStateReq,
                icmsg.FootholdRoleInfoReq,
                icmsg.SiegeStateReq,
            ]
            reqList.forEach(element => {
                let clz = element;
                if (clz) {
                    NetManager.send(new clz());
                }
            })
        });
    }

}