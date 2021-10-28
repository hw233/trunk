import ActUtil from '../../util/ActUtil';
import CopyModel from '../../../../common/models/CopyModel';
import CopyUtil from '../../../../common/utils/CopyUtil';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TaskUtil from '../../../task/util/TaskUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { Mission_cardsCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-05 15:07:40 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/flipCards/FlipCardsTaskItemCtrl")
export default class FlipCardsTaskItemCtrl extends UiListItem {
  @property(cc.Label)
  dec: cc.Label = null;

  @property(cc.Label)
  rewardLabel: cc.Label = null;

  @property(cc.Node)
  goBtn: cc.Node = null;

  @property(cc.Node)
  getBtn: cc.Node = null;

  @property(cc.Node)
  mask: cc.Node = null;

  @property(cc.Label)
  limitLabel: cc.Label = null;

  cfg: Mission_cardsCfg;
  updateView() {
    this.cfg = this.data;
    this.dec.string = this.cfg.desc;
    this.rewardLabel.string = gdk.i18n.t("i18n:ACT_FLIPCARD_TIP5") + `${this.cfg.addFlips[0][1]}`;
    this._updateState();
  }

  onGoBtnClick() {
    if (JumpUtils.openView(this.cfg.forward)) {
      gdk.panel.hide(PanelId.FlipCardsTaskView);
      gdk.panel.hide(PanelId.ActivityMainView);
    }
  }

  onGetBtnClick() {
    if (!ActUtil.ifActOpen(13)) {
      gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
      return;
    }

    let req = new icmsg.MissionRewardReq();
    req.kind = 1;
    req.type = 7;
    req.id = this.cfg.index;
    NetManager.send(req, (resp: icmsg.MissionRewardRsp) => {
      this.rewardLabel.node.active = false;
      this.goBtn.active = false;
      this.getBtn.active = false;
      this.mask.active = true;
      GlobalUtil.openRewadrView(resp.list);
      gdk.e.emit(ActivityEventId.ACTIVITY_FLIP_CARD_FLIP_TIME_CHANGE);
    });
  }

  _updateState() {
    this.rewardLabel.node.active = false;
    this.goBtn.active = false;
    this.getBtn.active = false;
    this.mask.active = false;
    this.limitLabel.node.active = false;
    if (ModelManager.get(RoleModel).level < this.cfg.level) {
      this.limitLabel.node.active = true;
      this.limitLabel.string = StringUtils.format(gdk.i18n.t("i18n:INS_DOOMSDAY_ITEM_TIP3"), this.cfg.level);
      return;
    }

    if (ModelManager.get(CopyModel).lastCompleteStageId < this.cfg.fbId) {
      this.limitLabel.node.active = true;
      let s = gdk.i18n.t("i18n:ACT_FLIPCARD_TIP6");
      this.limitLabel.string = StringUtils.format(s, CopyUtil.getChapterId(this.cfg.fbId), CopyUtil.getSectionId(this.cfg.fbId));
      return
    }

    this.rewardLabel.node.active = true;
    if (TaskUtil.getTaskState(this.cfg.index)) {
      if (TaskUtil.getTaskAwardState(this.cfg.index)) {
        this.mask.active = true;
        this.rewardLabel.node.active = false;
      }
      else {
        this.getBtn.active = true;
      }
    }
    else {
      this.goBtn.active = true;
    }
  }
}
