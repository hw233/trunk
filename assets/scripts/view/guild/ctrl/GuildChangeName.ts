import ChatUtils from '../../chat/utils/ChatUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildModel from '../model/GuildModel';
import GuildUtils from '../utils/GuildUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import SdkTool from '../../../sdk/SdkTool';
import StringUtils from '../../../common/utils/StringUtils';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-25 17:00:03
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildChangeName")
export default class GuildChangeName extends gdk.BasePanel {

    @property(cc.EditBox)
    InputBox: cc.EditBox = null;

    @property(cc.Label)
    costLab: cc.Label = null;

    get model() { return ModelManager.get(GuildModel); }

    onLoad() {
    }

    start() {
    }

    onEnable() {
        this.costLab.string = `${GuildUtils.getChangeNameCost()}`
    }

    onDisable() {
        // gdk.e.targetOff(this)
    }

    onDestroy() {

    }

    changeNameFunc() {
        let text = ChatUtils.filter(this.InputBox.string)
        if (text == "") {
            gdk.GUIManager.showMessage(gdk.i18n.t("i18n:GUILD_TIP5"))
            return
        }
        if (!GlobalUtil.checkMoneyEnough(GuildUtils.getChangeNameCost(), 2, this)) {
            return
        }
        SdkTool.tool.hasMaskWord(text, ret => {
            if (ret) {
                gdk.GUIManager.showMessage(gdk.i18n.t("i18n:GUILD_TIP6"));
                return;
            }
            gdk.gui.showAskAlert(
                StringUtils.format(gdk.i18n.t("i18n:GUILD_TIP7"), GuildUtils.getChangeNameCost(), text),//`是否花费${GuildUtils.getChangeNameCost()}钻石修改公会名${text}`,
                gdk.i18n.t("i18n:GUILD_TIP3"),
                "",
                (index: number) => {
                    if (index == 1) {
                        //取消
                    } else {
                        //确定
                        let msg = new icmsg.GuildSetNameReq()
                        msg.name = text
                        NetManager.send(msg, (data: icmsg.GuildSetNameRsp) => {
                            this.model.guildDetail.info.name = data.name
                            this.model.guildCamp.guild.name = data.name
                            this.model.guildDetail = this.model.guildDetail
                            this.close()
                            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP8"))
                        })
                    }
                }, this, {
                cancel: gdk.i18n.t("i18n:CANCEL"),
                ok: gdk.i18n.t("i18n:OK")
            })
        });
    }
}