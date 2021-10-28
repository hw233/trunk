import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import TaskUtil from '../../../task/util/TaskUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Cave_globalCfg, Cave_taskCfg } from '../../../../a/config';
import { RewardType } from '../../../../common/widgets/RewardCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-07 10:46:27 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/cave/CaveTaskItemCtrl")
export default class CaveTaskItemCtrl extends UiListItem {
  @property(cc.RichText)
  nameLab: cc.RichText = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  slotPrefab: cc.Prefab = null;

  @property(cc.Node)
  progressNode: cc.Node = null;

  @property(cc.Node)
  getBtn: cc.Node = null;

  @property(cc.Node)
  goBtn: cc.Node = null;

  @property(cc.Node)
  mask: cc.Node = null;

  cfg: Cave_taskCfg;
  updateView() {
    this.cfg = this.data;
    this.nameLab.string = this.cfg.desc;
    this.content.removeAllChildren();
    let keyId, exploreId;
    [keyId, exploreId] = [
      ConfigManager.getItemByField(Cave_globalCfg, 'key', 'key_item_id').value[0],
      ConfigManager.getItemByField(Cave_globalCfg, 'key', 'explore_item_id').value[0]
    ]
    let rewards = [];
    rewards.push([exploreId, this.cfg.explore]);
    if (this.cfg.key > 0) {
      rewards.push([keyId, this.cfg.key]);
    }
    rewards = rewards.concat(this.cfg.rewards);
    rewards.forEach(r => {
      if (r && r.length == 2) {
        let item = cc.instantiate(this.slotPrefab);
        item.parent = this.content;
        let ctrl = item.getComponent(UiSlotItem);
        ctrl.updateItemInfo(r[0], r[1]);
        ctrl.itemInfo = {
          series: null,
          itemId: r[0],
          itemNum: r[1],
          type: BagUtils.getItemTypeById(r[0]),
          extInfo: null,
        };
      }
    });
    //progress
    let progress = TaskUtil.getTaskFinishNum(this.cfg.taskid);
    cc.find('progress/bar', this.progressNode).width = Math.min(150, progress[0] / progress[1] * 150);
    cc.find('label', this.progressNode).getComponent(cc.Label).string = `${progress[0]}/${progress[1]}`;
    this._updateState();
  }

  _updateState() {
    this.goBtn.active = false;
    this.getBtn.active = false;
    this.mask.active = false;
    let state = TaskUtil.getTaskState(this.cfg.taskid);
    if (state) {
      if (TaskUtil.getTaskAwardState(this.cfg.taskid)) {
        this.mask.active = true;
      }
      else {
        this.getBtn.active = true;
      }
    }
    else {
      this.goBtn.active = true;
    }
  }

  onGoBtnClick() {
    if (this.cfg.forward && this.cfg.forward > 0) {
      gdk.panel.hide(PanelId.CaveTaskView);
      JumpUtils.openView(this.cfg.forward)
    }
  }

  onGetBtnClick() {
    let req = new icmsg.MissionRewardReq();
    req.kind = 1;
    req.type = 20;
    req.id = this.cfg.taskid;
    NetManager.send(req, (resp: icmsg.MissionRewardRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      let cfg = ConfigManager.getItemById(Cave_taskCfg, resp.id);
      let extraFlyInfo = {};
      let n = gdk.panel.get(PanelId.CaveMapView);
      if (cfg.explore > 0) {
        let id = ConfigManager.getItemByField(Cave_globalCfg, 'key', 'explore_item_id').value[0];
        let goodsInfo = new icmsg.GoodsInfo();
        goodsInfo.typeId = id;
        goodsInfo.num = cfg.explore;
        resp.list.push(goodsInfo);

        let exploreIcon = cc.find('downBg/layout/icon', n);
        let pos = exploreIcon.parent.convertToWorldSpaceAR(exploreIcon.getPosition());
        extraFlyInfo[id] = pos;
      }
      if (cfg.key > 0) {
        let id = ConfigManager.getItemByField(Cave_globalCfg, 'key', 'key_item_id').value[0];
        let goodsInfo = new icmsg.GoodsInfo();
        goodsInfo.typeId = id;
        goodsInfo.num = cfg.key;
        resp.list.push(goodsInfo);

        let keyIcon = cc.find('top/layout/icon', n);
        let pos = keyIcon.parent.convertToWorldSpaceAR(keyIcon.getPosition());
        extraFlyInfo[id] = pos;
      }
      GlobalUtil.openRewadrView(resp.list, RewardType.NORMAL, extraFlyInfo);
      this._updateState();
    }, this);
  }
}
