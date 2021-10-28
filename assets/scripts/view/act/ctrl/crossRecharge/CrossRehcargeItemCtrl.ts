import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import SdkTool from '../../../../sdk/SdkTool';
import ServerModel from '../../../../common/models/ServerModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../../common/widgets/VipFlagCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-12 10:21:42 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/crossRecharge/CrossRehcargeItemCtrl")
export default class CrossRehcargeItemCtrl extends UiListItem {
  @property(cc.Node)
  rankLabNode: cc.Node = null;

  @property(cc.Node)
  rankSprite: cc.Node = null;

  @property(cc.Node)
  head: cc.Node = null;

  @property(cc.Node)
  headFrame: cc.Node = null;

  @property(cc.Label)
  lvLab: cc.Label = null;

  @property(cc.Label)
  nameLab: cc.Label = null;

  @property(cc.Label)
  serverLab: cc.Label = null;

  @property(cc.Node)
  vipNode: cc.Node = null;

  @property(cc.Label)
  rechargeNum: cc.Label = null;

  @property(cc.Label)
  serverNameLab: cc.Label = null;

  @property(cc.Node)
  state1: cc.Node = null;

  @property(cc.Node)
  state2: cc.Node = null;

  rankSpriteName: string[] = [
    'common/texture/main/gh_gxbhuizhang01',
    'common/texture/main/gh_gxbhuizhang02',
    'common/texture/main/gh_gxbhuizhang03',
  ];
  info: icmsg.RankBrief;
  updateView() {
    this._updateView(this.data);
  }

  _updateView(info: icmsg.RankBrief) {
    this.info = info;
    if (this.info && this.info.brief.id > 0) {
      this.state1.active = true;
      this.state2.active = false;
      let d = this.info;
      this.serverLab.string = `[S${GlobalUtil.getSeverIdByPlayerId(d.brief.id)}]`;
      this.nameLab.string = d.brief.name;
      this.lvLab.string = '.' + d.brief.level;
      GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(d.brief.head));
      GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(d.brief.headFrame));
      let vipCtrl = this.vipNode.getComponent(VipFlagCtrl);
      vipCtrl.updateVipLv(GlobalUtil.getVipLv(d.brief.vipExp));
      this.rechargeNum.string = SdkTool.tool.getRealRMBCost(this.info.value) + '';
      this.serverNameLab.string = ModelManager.get(ServerModel).serverNameMap[Math.floor(this.info.brief.id / 100000)]
    }
    else {
      this.state1.active = false;
      this.state2.active = true;
    }

    if (this.curIndex == -1) {
      this.rankLabNode.active = true;
      this.rankSprite.active = false;
      this.rankLabNode.getChildByName('rank').getComponent(cc.Label).string = `未上榜`;
    }
    else {
      if (this.curIndex < 3) {
        this.rankLabNode.active = false;
        this.rankSprite.active = true;
        let path = this.rankSpriteName[this.curIndex];
        GlobalUtil.setSpriteIcon(this.node, this.rankSprite, path);
        this.rechargeNum.string = (info && info.brief.id == ModelManager.get(RoleModel).id) ? info.value + '' : '??????';
      }
      else {
        this.rankLabNode.active = true;
        this.rankSprite.active = false;
        this.rankLabNode.getChildByName('rank').getComponent(cc.Label).string = `${this.curIndex + 1}`;
      }
    }
  }

  onClick() {
    if (this.info && this.info.brief.id > 0) {
      let brief: icmsg.RoleBrief = this.info.brief;
      let id = brief.id;
      GlobalUtil.openBtnMenu(this.node, [1], {
        id: id,
        name: brief.name,
        headId: brief.head,
        level: brief.level,
        headBgId: brief.headFrame,
      })
    }
  }
}
