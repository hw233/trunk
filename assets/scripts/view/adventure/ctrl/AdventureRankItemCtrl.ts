import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-10 17:36:44 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdventureRankItemCtrl")
export default class AdventureRankItemCtrl extends UiListItem {
  @property(cc.Node)
  rankSprite: cc.Node = null;

  @property(cc.Label)
  rankLab: cc.Label = null;

  @property(cc.Node)
  noRank: cc.Node = null;

  @property(cc.Label)
  serverLab: cc.Label = null;

  @property(cc.Label)
  nameLabel: cc.Label = null;

  @property(cc.Label)
  lvLabel: cc.Label = null;

  @property(cc.Node)
  iconNode: cc.Node = null;

  @property(cc.Sprite)
  frameIcon: cc.Sprite = null;

  @property(cc.Node)
  vipFlag: cc.Node = null

  @property(cc.Label)
  scoreLabel: cc.Label = null;

  rankSpriteName: string[] = [
    'common/texture/main/gh_gxbhuizhang01',
    'common/texture/main/gh_gxbhuizhang02',
    'common/texture/main/gh_gxbhuizhang03',
  ];
  updateView() {
    let info = this.data;
    this.updateItem(info);
  }

  updateItem(d: icmsg.AdventureRankBrief) {
    this.serverLab.string = `[s${GlobalUtil.getSeverIdByPlayerId(d.brief.id)}]`
    this.nameLabel.string = d.brief.name;
    this.lvLabel.string = '.' + d.brief.level;
    this.scoreLabel.string = `${gdk.i18n.t("i18n:ADVENTURE_TIP13")}` + d.value;
    this.scoreLabel.node.active = this.curIndex >= 0
    GlobalUtil.setSpriteIcon(this.node, this.iconNode, GlobalUtil.getHeadIconById(d.brief.head));
    GlobalUtil.setSpriteIcon(this.node, this.frameIcon, GlobalUtil.getHeadFrameById(d.brief.headFrame));
    if (0 <= this.curIndex && this.curIndex < 3) {
      this.rankLab.node.active = false;
      this.noRank.active = false;
      this.rankSprite.active = true;
      let path = this.rankSpriteName[this.curIndex];
      GlobalUtil.setSpriteIcon(this.node, this.rankSprite, path);
    }
    else {
      this.rankLab.node.active = this.curIndex > 0;
      this.noRank.active = this.curIndex < 0;
      this.rankSprite.active = false;
      this.rankLab.string = this.curIndex > 0 ? this.curIndex + 1 + '' : '';
    }

    let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
    vipCtrl.updateVipLv(GlobalUtil.getVipLv(d.brief.vipExp))
  }
}
