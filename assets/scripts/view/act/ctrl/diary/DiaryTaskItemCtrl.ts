import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import TaskUtil from '../../../task/util/TaskUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagType } from '../../../../common/models/BagModel';
import { DiaryCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-22 14:59:21 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/diary/DiaryTaskItemCtrl")
export default class DiaryTaskItemCtrl extends UiListItem {
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

  @property(cc.Prefab)
  slotItemPrefab: cc.Prefab = null;

  @property(cc.Node)
  progressNode: cc.Node = null;

  cfg: DiaryCfg;
  style: number;
  updateView() {
    this.cfg = this.data;
    this.titleLabel.string = this.cfg.desc;
    this._initStyle();
    let rewards = this.cfg.reward;
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
    let color = ['#90FF01', '#FFE4D0', '#F5DA48']; //已完成/未完成
    let bar = cc.find('progress/bar', this.progressNode);
    let label = cc.find('label', this.progressNode).getComponent(cc.Label);
    let info = TaskUtil.getTaskFinishNum(this.cfg.taskid);
    label.string = `${Math.min(info[0], info[1])}/${info[1]}`;
    label.node.color = new cc.Color().fromHEX(info[0] >= info[1] ? color[0] : (this.style == 1 ? color[1] : color[2]));
    bar.width = Math.min(maxBarLen, maxBarLen * (info[0] / info[1]));
  }

  _updateTaskState() {
    if (!this.cfg) return;
    if (TaskUtil.getTaskState(this.cfg.taskid)) {
      if (TaskUtil.getTaskAwardState(this.cfg.taskid)) {
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
      this.getBtn.node.active = false;
      this.goBtn.active = true;
      this.mask.active = false;
    }
  }

  onGetBtnClick() {
    let req = new icmsg.MissionRewardReq();
    req.kind = 1;
    req.type = 10;
    req.id = this.cfg.taskid;
    NetManager.send(req, (resp: icmsg.MissionRewardRsp) => {
      GlobalUtil.openRewadrView(resp.list);
      this._updateTaskState();
    });
  }

  onGoBtnClick() {
    if (this.cfg.forward) {
      if (gdk.panel.isOpenOrOpening(PanelId.DiaryView) && JumpUtils.openView(this.cfg.forward)) {
        gdk.panel.hide(PanelId.DiaryView);
      }
    }
  }

  //=============style===============//
  _initStyle() {
    let cfg = ConfigManager.getItem(DiaryCfg, (c: DiaryCfg) => {
      if (c.color && c.color >= 1 && c.reward_type == this.cfg.reward_type) {
        return true;
      }
    });
    let color = cfg.color;
    this.style = color;
    GlobalUtil.setSpriteIcon(this.node, cc.find('qrhd_xingxilang', this.node), `view/act/texture/bg/diary/mxrj_xinxidi${color == 1 ? '' : '2'}`);
    //lab
    this.titleLabel.node.color = cc.color().fromHEX(color == 1 ? '#E8EDFF' : '#FFFBCF');
    this.titleLabel.node.getComponent(cc.LabelOutline).color = cc.color().fromHEX(color == 1 ? '#1E5B86' : '#653118');
    // this.progressNode.getChildByName('label').color = cc.color().fromHEX(color == 1 ? '#FFE4D0' : '#F5DA48');
  }
}
