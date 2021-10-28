import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import { Foothold_cityCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-23 18:36:33
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/guild/footHold/FootHoldCityPointCtrl")
export default class FootHoldCityPointCtrl extends cc.Component {

    @property(cc.Node)
    guildNode: cc.Node = null;

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    updateCity(type: number, guild: icmsg.FootholdGuild) {
        if (type == 0) {
            this.node.active = false
        } else {
            this.node.active = true
            GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(guild.bottom))
            GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(guild.frame))
            GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(guild.icon))
            this.lvLab.string = `${guild.level}${gdk.i18n.t("i18n:FOOTHOLD_TIP3")}`
            this.nameLab.string = `${guild.name}`
        }
    }
}