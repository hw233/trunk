import ChatUtils from '../../chat/utils/ChatUtils';
import GlobalUtil, { CommonNumColor } from '../../../common/utils/GlobalUtil';
import GuildModel from '../model/GuildModel';
import GuildUtils from '../utils/GuildUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import SdkTool from '../../../sdk/SdkTool';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-30 15:49:04
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildCreateCtrl")
export default class GuildCreateCtrl extends gdk.BasePanel {

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.EditBox)
    InputBox: cc.EditBox = null;

    @property(cc.Label)
    costLab: cc.Label = null;

    get model() { return ModelManager.get(GuildModel); }
    get roleModel() { return ModelManager.get(RoleModel); }

    onLoad() {

    }

    start() {

    }

    onEnable() {
        this.costLab.string = `${GuildUtils.getCreateCost()}`
        if (this.roleModel.gems < GuildUtils.getCreateCost()) {
            this.costLab.node.color = CommonNumColor.red
        }
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(this.model.selectIcon))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(this.model.selectFrame))
        GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(this.model.selectBottom))
    }

    onDisable() {
        gdk.e.targetOff(this)
        this.model.selectIcon = 1
        this.model.selectFrame = 2
        this.model.selectBottom = 3
    }

    onDestroy() {

    }

    @gdk.binding("model.selectIcon")
    updateIcon() {
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(this.model.selectIcon))
    }

    @gdk.binding("model.selectFrame")
    updateFrame() {
        GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(this.model.selectFrame))
    }

    @gdk.binding("model.selectBottom")
    updateBottom() {
        GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(this.model.selectBottom))
    }

    createFunc() {
        let text = ChatUtils.filter(this.InputBox.string)
        if (text == "") {
            gdk.GUIManager.showMessage(gdk.i18n.t("i18n:GUILD_TIP5"))
            return
        }

        if (this.roleModel.vipLv < GuildUtils.getCreateNeedVipLv()) {
            gdk.GUIManager.showMessage(gdk.i18n.t("i18n:GUILD_TIP55"))
            return
        }

        SdkTool.tool.hasMaskWord(text, ret => {
            if (ret) {
                gdk.GUIManager.showMessage(gdk.i18n.t("i18n:GUILD_TIP6"));
                return;
            }
            gdk.panel.setArgs(PanelId.GuildCreateSelect, text)
            gdk.panel.open(PanelId.GuildCreateSelect)
        });
    }

    /** logo设置*/
    setIconFunc() {
        gdk.panel.open(PanelId.GuildSetIcon)
    }

}