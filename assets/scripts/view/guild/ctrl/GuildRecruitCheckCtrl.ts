import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildModel from '../model/GuildModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import { Guild_globalCfg } from '../../../a/config';
import { MoneyType } from '../../store/ctrl/StoreViewCtrl';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-24 14:46:36
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildRecruitCheckCtrl")
export default class GuildRecruitCheckCtrl extends gdk.BasePanel {

    @property(cc.Label)
    costLab: cc.Label = null;

    @property(cc.Label)
    hasLab: cc.Label = null;

    @property(cc.Label)
    costLab2: cc.Label = null;

    get model() { return ModelManager.get(GuildModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        let recruiting = ConfigManager.getItemById(Guild_globalCfg, "recruiting").value[1]
        this.costLab.string = `${recruiting}`
        this.costLab2.string = `${recruiting}`
        this.hasLab.string = `${this.roleModel.gems}`
        if (this.roleModel.gems < recruiting) {
            this.hasLab.node.color = cc.color("#ff0000")
        }
    }

    recruitFunc() {
        let recruiting = ConfigManager.getItemById(Guild_globalCfg, "recruiting").value[1]
        if (!GlobalUtil.checkMoneyEnough(recruiting, MoneyType.Diamond, this)) {
            return
        }
        let serverModel = ModelManager.get(ServerModel)
        this.model.recruitTime = serverModel.serverTime;
        let msg = new icmsg.GuildRecruitReq()
        NetManager.send(msg, () => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP18"))
            this.model.guildDetail.recruitNum += 1
            gdk.panel.hide(PanelId.GuildRecruitCheck)
        })
    }
}