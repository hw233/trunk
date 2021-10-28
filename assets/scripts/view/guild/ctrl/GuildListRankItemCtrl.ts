import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildUtils from '../utils/GuildUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { Guild_lvCfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-14 15:27:43 
  */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildListRankItemCtrl")
export default class GuildListRankItemCtrl extends UiListItem {
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
  lvLab: cc.Label = null;

  @property(cc.Label)
  peopleNumLab: cc.Label = null;

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

  _updateInfo(data?: icmsg.GuildInfo) {
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
      let cfg = ConfigManager.getItemByField(Guild_lvCfg, "clv", data.level)
      this.guildNameLab.string = data.name;
      this.presidentNameLab.string = gdk.i18n.t("i18n:GUILD_TIP27") + data.president;
      this.lvLab.string = data.level + '';
      this.peopleNumLab.string = `${data.num}/${cfg.number}`;
      this.powerLab.string = data.maxPower + '';
      GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(data.icon))
      GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(data.frame))
      GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(data.bottom))
    }
    else {
      this.state1.active = false;
      this.state2.active = true;
    }
  }
}
