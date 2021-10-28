import ActUtil from '../../act/util/ActUtil';
import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import TaskUtil from '../util/TaskUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagType } from '../../../common/models/BagModel';
import { ListView } from '../../../common/widgets/UiListview';
import { Mission_7activityCfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-14 18:23:41 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/SevenDaysTaskItemCtrl")
export default class SevenDaysTaskItemCtrl extends UiListItem {
  @property(cc.Label)
  titleLabel: cc.Label = null;

  @property(cc.Button)
  getBtn: cc.Button = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Node)
  mask: cc.Node = null;

  @property(cc.Node)
  goBtn: cc.Node = null;

  @property(cc.Node)
  passBtn: cc.Node = null;

  @property(cc.Prefab)
  slotItemPrefab: cc.Prefab = null;

  @property(cc.Node)
  progressNode: cc.Node = null;

  cfg: Mission_7activityCfg;
  list: ListView;
  updateView() {
    this.cfg = this.data;
    this.titleLabel.string = this.cfg.desc;
    let rewards = this.cfg.reward1;
    this.content.removeAllChildren();
    rewards.forEach(reward => {
      let slot = cc.instantiate(this.slotItemPrefab);
      let ctrl = slot.getComponent(UiSlotItem);
      slot.parent = this.content;
      if (BagUtils.getItemTypeById(reward[0]) == BagType.HERO) ctrl.isCanPreview = true;
      ctrl.updateItemInfo(reward[0], reward[1]);
      ctrl.itemInfo = {
        series: null,
        itemId: reward[0],
        itemNum: reward[1],
        type: BagUtils.getItemTypeById(reward[0]),
        extInfo: null,
      };
    });
    this.content.getComponent(cc.Layout).updateLayout();
    this.scrollView.scrollToTopLeft();
    this.scrollView.enabled = rewards.length >= 5;
    this._updateProgress();
    this._updateTaskState();
  }

  _updateProgress() {
    let maxBarLen = 150;
    let color = ['#90FF01', '#FFE4D0']; //已完成/未完成
    let bar = cc.find('progress/bar', this.progressNode);
    let label = cc.find('label', this.progressNode).getComponent(cc.Label);
    let info = TaskUtil.getTaskFinishNum(this.cfg.id);
    label.string = `${Math.min(info[0], info[1])}/${info[1]}`;
    label.node.color = new cc.Color().fromHEX(info[0] >= info[1] ? color[0] : color[1]);
    bar.width = Math.min(maxBarLen, maxBarLen * (info[0] / info[1]));
  }

  _updateTaskState() {
    if (!this.cfg) return;
    this.passBtn.active = false;
    if (TaskUtil.getTaskState(this.cfg.id)) {
      if (TaskUtil.getTaskAwardState(this.cfg.id)) {
        this.getBtn.node.active = false;
        this.goBtn.active = false;
        this.mask.active = true;
      }
      else {
        this.getBtn.node.active = true;
        this.goBtn.active = false;
        this.mask.active = false;
      }
    } else {
      if (!ActUtil.ifActOpen(3)) {
        this.getBtn.node.active = false;
        this.goBtn.active = false;
        this.passBtn.active = true;
      }
      else {
        this.getBtn.node.active = false;
        this.goBtn.active = true;
      }
      this.mask.active = false;
    }
  }

  onGetBtnClick() {
    let req = new icmsg.MissionRewardReq();
    req.kind = 1;
    req.type = 5;
    req.id = this.cfg.id;
    NetManager.send(req, (resp: icmsg.MissionRewardRsp) => {
      GlobalUtil.openRewadrView(resp.list);
      this._updateTaskState();
    });
  }

  onGoBtnClick() {
    if (this.cfg.forward) {
      if (gdk.panel.isOpenOrOpening(PanelId.SevenDays) && JumpUtils.openView(this.cfg.forward)) {
        gdk.panel.hide(PanelId.SevenDays);
      }
    }
  }
}
