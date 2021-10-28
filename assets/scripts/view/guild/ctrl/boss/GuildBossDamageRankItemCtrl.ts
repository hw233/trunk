import FriendModel from '../../../friend/model/FriendModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../../common/widgets/VipFlagCtrl';
import { BtnMenuType } from '../../../../common/widgets/BtnMenuCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-22 14:31:01 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/boss/GuildBossDamageRankItemCtrl")
export default class GuildBossDamageRankItemCtrl extends UiListItem {
  @property(cc.Label)
  nameLabel: cc.Label = null;

  @property(cc.Label)
  lvLabel: cc.Label = null;

  @property(cc.Label)
  scoreLabel: cc.Label = null;

  @property(cc.Label)
  rankLabel: cc.Label = null;

  @property(cc.Node)
  iconNode: cc.Node = null;

  @property(cc.Sprite)
  frameIcon: cc.Sprite = null;

  @property(cc.Sprite)
  rankSprite: cc.Sprite = null;

  @property(cc.Node)
  vipFlag: cc.Node = null

  @property(cc.Node)
  selectImg: cc.Node = null;

  rankSpriteName: string[] = [
    'common/texture/main/gh_gxbhuizhang01',
    'common/texture/main/gh_gxbhuizhang02',
    'common/texture/main/gh_gxbhuizhang03',
  ];
  updateView() {
    this.updateItemView(this.data);
  }

  updateItemView(data) {
    let d: icmsg.RoleBrief = data.brief;
    let value = data.value;
    let rank = data.rank;
    this.nameLabel.string = d.name;
    this.lvLabel.string = '.' + d.level;
    this.scoreLabel.string = value > 10000 ? (value / 10000).toFixed(1) + gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP1") : value + '';
    GlobalUtil.setSpriteIcon(this.node, this.iconNode, GlobalUtil.getHeadIconById(d.head));
    GlobalUtil.setSpriteIcon(this.node, this.frameIcon, GlobalUtil.getHeadFrameById(d.headFrame));
    if (rank <= 3) {
      this.rankLabel.node.active = false;
      this.rankSprite.node.active = true;
      let path = this.rankSpriteName[rank - 1];
      GlobalUtil.setSpriteIcon(this.node, this.rankSprite, path);
    } else {
      this.rankLabel.node.active = true;
      this.rankSprite.node.active = false;
      this.rankLabel.string = rank + '';
    }

    let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
    vipCtrl.updateVipLv(GlobalUtil.getVipLv(d.vipExp))
  }

  _itemSelect() {
    if (!this.data.brief) {
      return;
    }
    if (this.selectImg) {
      this.selectImg.active = this.ifSelect
    }
  }

  /**展开菜单栏 */
  onHeadClick() {
    let rM = ModelManager.get(RoleModel);
    let fM = ModelManager.get(FriendModel);
    let brief: icmsg.RoleBrief = this.data.brief;
    if (!brief) {
      return;
    }
    if (this.data.brief.playerId == rM.id) {
      return;
    }
    let friendIdList = fM.friendIdList
    let idList = fM.backIdList

    // 非好友的情况下增加添加好友按钮
    let btns: BtnMenuType[] = [1, 0]
    let id = brief.id;
    if (!friendIdList[id.toLocaleString()]) {
      btns.splice(1, 0, 2)

      // 判断添加屏蔽/取消屏蔽按钮
      if (idList[id.toLocaleString()]) {
        btns.splice(1, 0, 5)
      } else {
        btns.splice(1, 0, 4)
      }
    } else {
      btns.splice(1, 0, 3)
    }

    // //非普通成员可 发出 公会邀请
    if (rM.guildTitle != 0 && brief.guildId == 0) {
      btns.push(10)
    }

    GlobalUtil.openBtnMenu(this.node, btns, {
      id: id,
      name: brief.name,
      headId: brief.head,
      level: brief.level,
      headBgId: brief.headFrame,
    })

    this._itemSelect()
  }
}
