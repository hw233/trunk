import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import ShaderHelper from '../../../../common/shader/ShaderHelper';
import StringUtils from '../../../../common/utils/StringUtils';
import TaskModel from '../../../task/model/TaskModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagType } from '../../../../common/models/BagModel';
import { Diary_rewardCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-22 15:00:15 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/diary/DiaryLvRewardItemCtrl")
export default class DiaryLvRewardItemCtrl extends UiListItem {
  @property(cc.Node)
  titleNode: cc.Node = null;

  @property(cc.Button)
  getBtn: cc.Button = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Node)
  mask: cc.Node = null;

  @property(cc.Prefab)
  slotItemPrefab: cc.Prefab = null;

  @property(cc.Node)
  progressNode: cc.Node = null;

  get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

  cfg: Diary_rewardCfg;
  updateView() {
    this.cfg = this.data;
    this.titleNode.getChildByName('title').getComponent(cc.RichText).string = StringUtils.format(this.cfg.desc, this.cfg.level, this.cfg.value[1], BagUtils.getConfigById(this.cfg.value[0]).name) + ' ';
    GlobalUtil.setSpriteIcon(this.node, this.titleNode.getChildByName('icon'), GlobalUtil.getIconById(this.cfg.value[0]));
    let rewards = this.cfg.rewards;
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
    let info = [BagUtils.getItemNumById(this.cfg.value[0]), this.cfg.value[1]];
    label.string = `${Math.min(info[0], info[1])}/${info[1]}`;
    label.node.color = new cc.Color().fromHEX(info[0] >= info[1] ? color[0] : color[1]);
    bar.width = Math.min(maxBarLen, maxBarLen * (info[0] / info[1]));
  }

  _updateTaskState() {
    if (!this.cfg) return;
    GlobalUtil.setAllNodeGray(this.getBtn.node, 0);
    this.getBtn.node.getChildByName('label').getComponent(ShaderHelper).enabled = false;
    if (BagUtils.getItemNumById(this.cfg.value[0]) >= this.cfg.value[1]) {
      if ((this.taskModel.diaryLvRewards & 1 << this.cfg.level) >= 1) {
        this.getBtn.node.active = false;
        this.mask.active = true;
      }
      else {
        this.getBtn.node.active = true;
        this.mask.active = false;
      }
    } else {
      this.getBtn.node.active = true;
      GlobalUtil.setAllNodeGray(this.getBtn.node, 1);
      this.getBtn.node.getChildByName('label').getComponent(ShaderHelper).enabled = true;
      this.mask.active = false;
    }
  }

  onGetBtnClick() {
    if (BagUtils.getItemNumById(this.cfg.value[0]) >= this.cfg.value[1]) {
      let req = new icmsg.MissionRewardReq();
      req.kind = 2;
      req.type = 10;
      req.id = this.cfg.id;
      NetManager.send(req, (resp: icmsg.MissionRewardRsp) => {
        GlobalUtil.openRewadrView(resp.list);
        this._updateTaskState();
      });
    }
    else {
      //todo
      GlobalUtil.openGainWayTips(this.cfg.value[0]);
    }

  }
}
