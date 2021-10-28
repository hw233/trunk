import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildModel from '../model/GuildModel';
import MaskWordUtils from '../../../common/utils/MaskWordUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import StringUtils from '../../../common/utils/StringUtils';
import { Guild_globalCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-15 10:24:58 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildMailSendViewCtrl")
export default class GuildMailSendViewCtrl extends gdk.BasePanel {
    @property(cc.EditBox)
    content: cc.EditBox = null;

    @property(cc.RichText)
    timeTipLab: cc.RichText = null;

    @property(cc.Node)
    sendBtn: cc.Node = null;

    get gModel(): GuildModel { return ModelManager.get(GuildModel); }

    _maxSendTime: number;
    onEnable() {
        this.content.maxLength = ConfigManager.getItemByField(Guild_globalCfg, 'key', 'guild_mail_words').value[0];
        this._maxSendTime = ConfigManager.getItemByField(Guild_globalCfg, 'key', 'guild_mail_limit').value[0];
        //this.timeTipLab.string = StringUtils.format(gdk.i18n.t("i18n:GUILD_TIP37"), this._maxSendTime)//`<color=#A26D22>每日只可发送<color=#00FF00>${this._maxSendTime}</color>次</c>`;
        this.sendBtn.active = false;
        // if (!this.gModel.guildMailTimes && this.gModel.guildMailTimes !== 0) {
        NetManager.send(new icmsg.GuildMailTimesReq(), (resp: icmsg.GuildMailTimesRsp) => {
            ModelManager.get(GuildModel).guildMailTimes = resp.times;
            this._updateSendTime()
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.sendBtn.active = true;
            if (this.gModel.guildMailTimes >= this._maxSendTime) {
                GlobalUtil.setAllNodeGray(this.sendBtn, 1);
            }
        }, this);
        // } else {
        //     this.sendBtn.active = true;
        //     if (this.gModel.guildMailTimes >= this._maxSendTime) {
        //         GlobalUtil.setAllNodeGray(this.sendBtn, 1);
        //     }
        // }
    }

    _updateSendTime() {
        let time = this._maxSendTime - this.gModel.guildMailTimes > 0 ? this._maxSendTime - this.gModel.guildMailTimes : 0
        this.timeTipLab.string = StringUtils.format(gdk.i18n.t("i18n:GUILD_TIP37"), time)
    }

    onDisable() {
        NetManager.targetOff(this);
    }

    onEditDidEnd() {
        this.content.string = MaskWordUtils.filter(this.content.string);
    }

    onSendBtnClick() {
        if (this.gModel.guildMailTimes >= this._maxSendTime) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:GUILD_TIP38"), this._maxSendTime));//`公会邮件每日只可发送${this._maxSendTime}次`
            return;
        }
        if (this.content.string.length <= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP39"));
            return;
        }
        let req = new icmsg.GuildMailSendReq();
        req.content = this.content.string;
        NetManager.send(req, (resp: icmsg.GuildMailSendRsp) => {
            ModelManager.get(GuildModel).guildMailTimes = resp.times;
            this._updateSendTime()
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:GUILD_TIP40"), Math.max(0, this._maxSendTime - resp.times)));//`发送成功,今日发送次数剩余${Math.max(0, this._maxSendTime - resp.times)}次`
            if (this._maxSendTime - resp.times <= 0) {
                GlobalUtil.setAllNodeGray(this.sendBtn, 1);
            }
        }, this);
    }
}
