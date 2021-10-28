import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import UiListItem from '../../../../common/widgets/UiListItem';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-27 14:08:02
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/power/GuildPowerRankItemCtrl")
export default class GuildPowerRankItemCtrl extends UiListItem {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Node)
    rankSprite: cc.Node = null;

    @property(cc.Label)
    rankLab: cc.Label = null;

    @property(cc.Node)
    state1: cc.Node = null;

    @property(cc.Node)
    state2: cc.Node = null;

    @property(cc.Label)
    guildNameLab: cc.Label = null;

    @property(cc.Label)
    presidentNameLab: cc.Label = null;

    @property(cc.Label)
    numCountLab: cc.Label = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];
    updateView() {
        this._updateInfo(this.data);
    }

    _updateInfo(data?: icmsg.GuildGatherRank) {
        if (data) {
            this.state1.active = true;
            this.state2.active = false;
            if (this.curIndex < 3) {
                this.rankLab.node.active = false;
                this.rankSprite.active = true;
                let path = this.rankSpriteName[this.curIndex];
                GlobalUtil.setSpriteIcon(this.node, this.rankSprite, path);
            }
            else {
                this.rankLab.node.active = true;
                this.rankSprite.active = false;
                this.rankLab.string = this.curIndex + 1 + '';
            }
            this.guildNameLab.string = data.guildName;
            this.presidentNameLab.string = gdk.i18n.t("i18n:GUILD_TIP27") + data.presidentName
            this.numCountLab.string = `${data.numberCount}`;
            this.powerLab.string = data.totalPower + '';
            GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(data.guildIcon))
            GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(data.guildFrame))
            GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(data.guildBottom))
        }
        else {
            this.state1.active = false;
            this.state2.active = true;
        }
    }
}
