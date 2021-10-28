import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildUtils from '../utils/GuildUtils';
import PanelId from '../../../configs/ids/PanelId';
import UiListItem from '../../../common/widgets/UiListItem';
import { Guild_lvCfg } from '../../../a/config';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-24 14:36:23
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildListItemCtrl")
export default class GuildListItemCtrl extends UiListItem {

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Label)
    guildName: cc.Label = null;

    @property(cc.Label)
    pName: cc.Label = null;

    @property(cc.Label)
    lv: cc.Label = null;

    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.Label)
    power: cc.Label = null;

    guildInfo: icmsg.GuildInfo = null

    onLoad() {

    }

    updateView() {
        this.guildInfo = this.data
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(this.guildInfo.icon))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(this.guildInfo.frame))
        GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(this.guildInfo.bottom))
        this.guildName.string = this.guildInfo.name
        this.pName.string = gdk.i18n.t("i18n:GUILD_TIP27") + this.guildInfo.president;
        this.power.string = this.guildInfo.maxPower + '';
        this.lv.string = `${this.guildInfo.level}`

        let cfg = ConfigManager.getItemByField(Guild_lvCfg, "clv", this.guildInfo.level)
        this.num.string = `${this.guildInfo.num}/${cfg.number}`
    }

    /**点击 */
    _itemClick() {
        if (this.guildInfo) {
            gdk.panel.setArgs(PanelId.GuildJoin, this.guildInfo.id, false)
            gdk.panel.open(PanelId.GuildJoin)
        }
    }
}