import FriendModel from '../../friend/model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import UiListItem from '../../../common/widgets/UiListItem';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-07 16:43:00 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenahonor/ArenaHonorGuildPlayerItemCtrl")
export default class ArenaHonorGuildPlayerItemCtrl extends UiListItem {
  @property(cc.Node)
  headFrame: cc.Node = null;

  @property(cc.Node)
  headIcon: cc.Node = null;

  @property(cc.Label)
  lvLab: cc.Label = null;

  @property(cc.Node)
  vipNode: cc.Node = null;

  @property(cc.Label)
  nameLab: cc.Label = null;

  @property(cc.Label)
  powerLab: cc.Label = null;

  brief: icmsg.RoleBrief;
  updateView() {
    this.brief = this.data;
    this.nameLab.string = this.brief.name;
    this.lvLab.string = '.' + this.brief.level;
    GlobalUtil.setSpriteIcon(this.node, this.headIcon, GlobalUtil.getHeadIconById(this.brief.head));
    GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(this.brief.headFrame));
    let vipCtrl = this.vipNode.getComponent(VipFlagCtrl);
    vipCtrl.updateVipLv(GlobalUtil.getVipLv(this.brief.vipExp));
    this.powerLab.string = this.brief.power + '';
  }

  /** 子项点击 */
  onClick() {
    if (!this.brief || (this.brief && this.brief.id == ModelManager.get(RoleModel).id)) {
      return
    }
    let friendModel = ModelManager.get(FriendModel)
    let btns = [1, 0, 11]
    let friendIdList = friendModel.friendIdList
    let idList = friendModel.backIdList
    // // 判断添加屏蔽/取消屏蔽按钮
    if (idList[this.brief.id.toLocaleString()]) {
      btns.splice(1, 0, 5)
    } else {
      btns.splice(1, 0, 4)
    }
    // 非好友的情况下增加添加好友按钮
    if (!friendIdList[this.brief.id.toLocaleString()]) {
      btns.splice(1, 0, 2);
    }

    //非普通成员可 发出 公会邀请
    if (ModelManager.get(RoleModel).guildTitle != 0 && this.brief.guildId == 0) {
      btns.push(10)
    }

    GlobalUtil.openBtnMenu(this.node, btns, {
      id: this.brief.id,
      name: this.brief.name,
      headId: this.brief.head,
      headBgId: this.brief.headFrame,
      level: this.brief.level,
    })

  }
}
