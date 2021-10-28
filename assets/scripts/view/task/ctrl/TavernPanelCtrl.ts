import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil, { CommonNumColor } from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StoreModel from '../../store/model/StoreModel';
import StringUtils from '../../../common/utils/StringUtils';
import TaskModel from '../model/TaskModel';
import TaskUtil from '../util/TaskUtil';
import TavernDetailPanelCtrl from './TavernDetailPanelCtrl';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { MoneyType } from '../../store/ctrl/StoreViewCtrl';
import { TaskEventId } from '../enum/TaskEventId';
import { Tavern_taskCfg, Tavern_valueCfg, TavernCfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-06-04 14:53:15 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/TavernPanelCtrl")
export default class TavernPanelCtrl extends gdk.BasePanel {
  @property(cc.Button)
  refreshBtn: cc.Button = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  taskItemPrefab: cc.Prefab = null;

  @property(cc.Button)
  getAllBtn: cc.Button = null;

  @property(cc.Prefab)
  aniPrefab: cc.Prefab = null;

  @property(cc.Node)
  creditNode: cc.Node = null;

  @property(cc.Node)
  costNode: cc.Node = null;

  // @property(cc.Node)
  // tqIcon: cc.Node = null;

  @property(cc.Label)
  diamondLab: cc.Label = null;

  @property(cc.Label)
  gainLab: cc.Label = null;

  @property(cc.Label)
  refreshCostLab: cc.Label = null;

  @property(cc.Label)
  refreshGetLab: cc.Label = null;

  @property(cc.Label)
  refreshGetLab2: cc.Label = null;

  @property(cc.Node)
  tq1Btn: cc.Node = null;

  @property(cc.Node)
  tq2Btn: cc.Node = null;

  taskList: ListView = null; // 任务列表
  get taskModel(): TaskModel { return ModelManager.get(TaskModel); }
  get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

  _detailData: icmsg.TavernGoodsStatRsp

  orginalTips: string;
  onEnable() {
    // let tipsCfg = ConfigManager.getItemById(TipsCfg, 31);
    // this.orginalTips = tipsCfg.desc21;
    let tq1 = ModelManager.get(StoreModel).isMonthCardActive(500004);
    let tq2 = ModelManager.get(StoreModel).isMonthCardActive(500005);
    GlobalUtil.setGrayState(this.tq1Btn.getChildByName('icon'), tq1 ? 0 : 1);
    GlobalUtil.setGrayState(this.tq2Btn.getChildByName('icon'), tq2 ? 0 : 1);
    // tipsCfg.desc21 = tipsCfg.desc21.replace('{%s1}', tq1 ? '<color=#94FF98>(已激活)</c>' : "<color=#FF0000>(未激活)</c><color=#5EE015><on click='goToTQStore' param=''><u>(前去激活)</u></on></c>");
    // tipsCfg.desc21 = tipsCfg.desc21.replace('{%s2}', tq2 ? '<color=#94FF98>(已激活)</c>' : "<color=#FF0000>(未激活)</c><color=#5EE015><on click='goToTQStore' param=''><u>(前去激活)</u></on></c>");
    // GlobalUtil.setAllNodeGray(this.tqIcon, !tq1 || !tq2 ? 1 : 0);
    this.taskModel.tavernIsOpened = true;
    gdk.e.on(TaskEventId.UPDATE_TAVERN_TASK, this._updateTaskList, this);
    gdk.e.on(TaskEventId.TAVERN_TASK_COUNT_DOWN_OUT, this._updateTaskProgress, this);
    gdk.e.on(TaskEventId.TAVERN_TASK_START, this._onTavernTaskStartRsp, this);
    // NetManager.on(TavernTaskStartRsp.MsgType, this._onTavernTaskStartRsp, this);
    NetManager.on(icmsg.TavernTaskRewardRsp.MsgType, this._onTavernTaskRewardRsp, this);
    NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateRefreshLab, this);
    NetManager.on(icmsg.RoleUpdateRsp.MsgType, this._updateRefreshLab, this)
    this._updateRefreshLab();
    this._updateTaskList();
    this._updateGainInfo()
  }

  onDisable() {
    let node1 = this.tq1Btn.getChildByName('getTQBtn');
    let node2 = this.tq1Btn.getChildByName('getTQBtn');
    [node1, node2].forEach(n => {
      n.stopAllActions();
      n.setScale(1);
    });
    // let tipsCfg = ConfigManager.getItemById(TipsCfg, 31);
    // tipsCfg.desc21 = this.orginalTips;
    if (this.taskList) {
      this.taskList.destroy();
      this.taskList = null;
    }
    gdk.e.targetOff(this);
    NetManager.targetOff(this);
  }

  @gdk.binding("roleModel.tavern")
  _updatecredit() {
    let cfg = ConfigManager.getItemById(TavernCfg, 1);
    GlobalUtil.setSpriteIcon(this.node, this.creditNode.getChildByName('icon'), GlobalUtil.getIconById(cfg.cost[0]));
    let hasNum = BagUtils.getItemNumById(cfg.cost[0]) || 0;
    let limit = ConfigManager.getItemById(TavernCfg, 1).max_task[1];
    this.creditNode.getChildByName('num').getComponent(cc.Label).string = `x${GlobalUtil.numberToStr(hasNum, true)}/${GlobalUtil.numberToStr(limit, true)}`
  }

  _initList() {
    if (!this.taskList) {
      this.taskList = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.taskItemPrefab,
        cb_host: this,
        gap_y: 20,
        async: true,
        direction: ListViewDir.Vertical,
      });
    }
  }

  _updateTaskList() {
    if (!cc.isValid(this.node)) return;
    if (!this.node.activeInHierarchy) return;
    if (!this.taskList) this._initList();
    let list: icmsg.TavernTask[] = [];
    let completeList: icmsg.TavernTask[] = [];
    this.taskModel.tavernDoingTaskList.sort((a, b) => {
      let cfgA = ConfigManager.getItemById(Tavern_taskCfg, a.taskId);
      let cfgB = ConfigManager.getItemById(Tavern_taskCfg, b.taskId);
      if (cfgA.quality == cfgB.quality) return a.taskId - b.taskId;
      else return cfgB.quality - cfgA.quality;
    });

    this.taskModel.tavernDoingTaskList.forEach(task => {
      let cfg = ConfigManager.getItemById(Tavern_taskCfg, task.taskId);
      if (task.startTime > 0 && (GlobalUtil.getServerTime() - task.startTime * 1000) >= cfg.time * 1000) {
        completeList.push(task);
      }
      else {
        list.push(task);
      }
    });

    this.taskModel.tavernTodoTaskList.sort((a, b) => {
      let cfgA = ConfigManager.getItemById(Tavern_taskCfg, a.taskId);
      let cfgB = ConfigManager.getItemById(Tavern_taskCfg, b.taskId);
      if (cfgA.quality == cfgB.quality) return a.taskId - b.taskId;
      else return cfgB.quality - cfgA.quality;
    });

    let list2 = [];
    if (this.taskModel.tavernExtraTask1) {
      let cfg = ConfigManager.getItemById(Tavern_taskCfg, this.taskModel.tavernExtraTask1.taskId);
      if (this.taskModel.tavernExtraTask1.startTime > 0) {
        if ((GlobalUtil.getServerTime() - this.taskModel.tavernExtraTask1.startTime * 1000) >= cfg.time * 1000) {
          completeList.push(this.taskModel.tavernExtraTask1);
        }
        else {
          list.push(this.taskModel.tavernExtraTask1);
        }
      }
      else {
        list2.push(this.taskModel.tavernExtraTask1);
      }
    }

    if (this.taskModel.tavernExtraTask2) {
      let cfg = ConfigManager.getItemById(Tavern_taskCfg, this.taskModel.tavernExtraTask2.taskId);
      if (this.taskModel.tavernExtraTask2.startTime > 0) {
        if ((GlobalUtil.getServerTime() - this.taskModel.tavernExtraTask2.startTime * 1000) >= cfg.time * 1000) {
          completeList.push(this.taskModel.tavernExtraTask2);
        }
        else {
          list.push(this.taskModel.tavernExtraTask2);
        }
      }
      else {
        list2.push(this.taskModel.tavernExtraTask2);
      }
    }

    // list = completeList.concat(list).concat(...this.taskModel.tavernTodoTaskList);
    // list = this.taskModel.tavernTodoTaskList.concat(completeList).concat(list);
    list = completeList.concat(list2).concat(this.taskModel.tavernTodoTaskList).concat(list);
    this.taskList.clear_items();
    this.taskList.set_data([...list]);
    this._updateTaskProgress();
  }

  /**
   * 更新个人任务进度/一键领取按钮状态
   */
  _updateTaskProgress() {
    //TODO  更新个人任务进度/一键领取按钮状态
    let list = this.taskModel.tavernDoingTaskList;
    this.getAllBtn.node.active = false;
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        let startTime = list[i].startTime;
        let taskCfg = ConfigManager.getItemById(Tavern_taskCfg, list[i].taskId);
        if (startTime > 0 && GlobalUtil.getServerTime() - startTime * 1000 >= taskCfg.time * 1000) {
          this.getAllBtn.node.active = true;
          return;
        }
      }
    }
  }

  /**
   * 奖励领取回调
   * @param resp 
   */
  _onTavernTaskRewardRsp(resp: icmsg.TavernTaskRewardRsp) {
    for (let i = 0; i < this.taskModel.tavernDoingTaskList.length; i++) {
      if (resp.index.indexOf(this.taskModel.tavernDoingTaskList[i].index) != -1) {
        let heroList = this.taskModel.tavernDoingTaskList[i].heroList;
        heroList.forEach(info => {
          TaskUtil.updatTavernHeroSendState(info.heroId, 0);
        })
        this.taskModel.tavernDoingTaskList.splice(i, 1);
        i--;
      }
    }
    if (this.taskModel.tavernExtraTask1) {
      if (resp.index.indexOf(this.taskModel.tavernExtraTask1.index) !== -1) {
        let heroList = this.taskModel.tavernExtraTask1.heroList;
        heroList.forEach(info => {
          TaskUtil.updatTavernHeroSendState(info.heroId, 0);
        });
        this.taskModel.tavernExtraTask1 = null;
      }
    }

    if (this.taskModel.tavernExtraTask2) {
      if (resp.index.indexOf(this.taskModel.tavernExtraTask2.index) !== -1) {
        let heroList = this.taskModel.tavernExtraTask2.heroList;
        heroList.forEach(info => {
          TaskUtil.updatTavernHeroSendState(info.heroId, 0);
        });
        this.taskModel.tavernExtraTask2 = null;
      }
    }

    GlobalUtil.openRewadrView(resp.list);
    this._updateTaskList();
    this._updateGainInfo()
  }

  /**
   * 任务执行回调
   * @param resp 
   */
  _onTavernTaskStartRsp(e) {
    if (!cc.isValid(this.node)) return;
    if (!this.node.activeInHierarchy) return;
    let resp: icmsg.TavernTaskStartRsp = e.data;


    let oldSelectIndex = 0;
    for (let i = 0; i < this.taskList.items.length; i++) {
      if (this.taskList.items[i].node) {
        oldSelectIndex = i;
        break;
      }
    }
    this._updateTaskList();
    this.taskList.scroll_to(Math.min(this.taskList.items.length, oldSelectIndex));

    this._updateGainInfo()
  }

  _updateRefreshLab() {
    let cfg = ConfigManager.getItemById(TavernCfg, 1);
    let num;
    let itemId = cfg.reset[0];
    let tavernItemNum = BagUtils.getItemNumById(140018) || 0;
    let icon = cc.find('Background/layout/icon', this.refreshBtn.node);
    let costNum = cc.find('Background/layout/costNum', this.refreshBtn.node).getComponent(cc.Label);
    let tips = cc.find('Background/layout/label', this.refreshBtn.node).getComponent(cc.Label);
    icon.active = true;
    costNum.node.active = true;
    tips.string = gdk.i18n.t('i18n:TASK_TIP18');
    costNum.node.color = new cc.Color().fromHEX('#FFFFFF');
    this.diamondLab.string = `${this.roleModel.gems}`
    if (this.taskModel.tavernRefreshTimes < cfg.free_reset) {
      num = '0';
      icon.active = false;
      costNum.node.active = false;
      tips.string = gdk.i18n.t('i18n:TASK_TIP19');
    }
    else {
      if (tavernItemNum > 0) {
        num = 'x1';
        itemId = 140018;
      }
      else {
        num = cfg.reset[1];
        if (BagUtils.getItemNumById(cfg.reset[0]) < num) {
          costNum.node.color = CommonNumColor.red;
        }
      }
    }
    GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getIconById(itemId));
    costNum.string = num;
    GlobalUtil.setSpriteIcon(this.node, this.costNode.getChildByName('icon'), GlobalUtil.getIconById(140018));
    this.costNode.getChildByName('num').getComponent(cc.Label).string = tavernItemNum + '';
  }

  /**
   * 一键领取
   */
  onGetAllBtnClick() {
    let req = new icmsg.TavernTaskRewardReq();
    // req.index = -1;
    req.isAll = true;
    NetManager.send(req, null, this);
  }

  /**
   * 任务刷新界面
   */
  onRefreshBtnClick() {
    let cb = () => {
      let req = new icmsg.TavernTaskRefreshReq();
      NetManager.send(req, (resp: icmsg.TavernTaskRefreshRsp) => {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        this.taskModel.tavernRefreshTimes += 1;
        this._updateRefreshLab();
        this._updateGainInfo()
        // gdk.gui.showMessage('刷新成功');
      }, this);
    }

    let todoList = this.taskModel.tavernTodoTaskList;
    let hasHighQualityTask: boolean = false;
    for (let i = 0; i < todoList.length; i++) {
      let cfg = ConfigManager.getItemById(Tavern_taskCfg, todoList[i].taskId);
      if (cfg.quality >= 3) {
        hasHighQualityTask = true;
        break;
      }
    }

    if (hasHighQualityTask) {
      GlobalUtil.openAskPanel({
        title: gdk.i18n.t('i18n:TIP_TITLE'),
        descText: gdk.i18n.t('i18n:TASK_TIP20'),
        sureText: gdk.i18n.t('i18n:OK'),
        closeText: gdk.i18n.t('i18n:CANCEL'),
        sureCb: cb
      })
    }
    else {
      cb();
    }
  }

  @gdk.binding("taskModel.tavernRefreshTimes")
  @gdk.binding("taskModel.tavernExtraFlag")
  _updateTQ() {
    let time = this.taskModel.tavernRefreshTimes;
    // let tq1 = ModelManager.get(StoreModel).isMonthCardActive(500004);
    // let tq2 = ModelManager.get(StoreModel).isMonthCardActive(500005);
    let red1 = this.tq1Btn.getChildByName('RedPoint');
    let red2 = this.tq2Btn.getChildByName('RedPoint');
    red1.active = false;
    red2.active = false;
    this.tq1Btn.getChildByName('lab').getComponent(cc.Label).string = time >= 1 ? '200' : '100';
    this.tq2Btn.getChildByName('lab').getComponent(cc.Label).string = '2'.repeat(Math.min(3, time)) + '1'.repeat(Math.max(0, 3 - time));
    let node1 = this.tq1Btn.getChildByName('getTQBtn');
    let node2 = this.tq2Btn.getChildByName('getTQBtn');
    [node1, node2].forEach(n => {
      n.stopAllActions();
      n.setScale(1);
    });
    if (time >= 1) {
      if ((this.taskModel.tavernExtraFlag & 1 << 0) <= 0) {
        red1.active = true;
        node1.setScale(1);
        node1.runAction(
          cc.repeatForever(
            cc.sequence(
              cc.scaleTo(.5, 1.3, 1.3),
              cc.scaleTo(.5, 1, 1)
            )
          )
        );
      }
    }

    if (time >= 3) {
      if ((this.taskModel.tavernExtraFlag & 1 << 1) <= 0) {
        red2.active = true;
        node2.setScale(1);
        node2.runAction(
          cc.repeatForever(
            cc.sequence(
              cc.scaleTo(.5, 1.3, 1.3),
              cc.scaleTo(.5, 1, 1)
            )
          )
        );
      }
    }
  }

  onTQBtnClick(e, idx) {
    let ids = [500004, 500005];
    let tq = ModelManager.get(StoreModel).isMonthCardActive(ids[parseInt(idx)]);
    if (!tq) {
      // gdk.gui.showMessage(`${['悬赏高级特权', '悬赏豪华特权'][parseInt(idx)]}尚未激活`);
      gdk.panel.open(PanelId.TavernTQBuyView, (node: cc.Node) => {
        let _onhide = gdk.NodeTool.onHide(node);
        _onhide.on(() => {
          _onhide.targetOff(this);
          if (!cc.isValid(this.node)) return
          let tq1 = ModelManager.get(StoreModel).isMonthCardActive(500004);
          let tq2 = ModelManager.get(StoreModel).isMonthCardActive(500005);
          GlobalUtil.setGrayState(this.tq1Btn.getChildByName('icon'), tq1 ? 0 : 1);
          GlobalUtil.setGrayState(this.tq2Btn.getChildByName('icon'), tq2 ? 0 : 1);
          this._updateTQ();
        });
      });
      return;
    }
    else {
      let t = [1, 3][parseInt(idx)];
      if (this.taskModel.tavernRefreshTimes >= t) {
        if ((this.taskModel.tavernExtraFlag & 1 << parseInt(idx)) >= 1) {
          gdk.gui.showMessage(gdk.i18n.t('i18n:TASK_TIP21'));
        }
        else {
          let req = new icmsg.TavernExtraTaskReq();
          req.type = parseInt(idx) + 1;
          NetManager.send(req, (resp: icmsg.TavernExtraTaskRsp) => {
            let model = ModelManager.get(TaskModel);
            if (resp.type == 1) {
              model.tavernExtraTask1 = resp.task;
            } else {
              model.tavernExtraTask2 = resp.task;
            }
            model.tavernExtraFlag |= 1 << resp.type - 1;
            gdk.e.emit(TaskEventId.UPDATE_TAVERN_TASK);
          }, this);
        }
      }
      else {
        gdk.gui.showMessage(StringUtils.format(gdk.i18n.t('i18n:TASK_TIP22'), [1, 3][parseInt(idx)]));
      }
    }
  }


  /**更新收益状况 */
  _updateGainInfo() {
    let msg = new icmsg.TavernGoodsStatReq()
    NetManager.send(msg, (data: icmsg.TavernGoodsStatRsp) => {
      this._detailData = data
      this.gainLab.node.parent.active = false
      this.refreshCostLab.string = `${this._getCostNum(data.subList)}`
      this.refreshGetLab.string = `${this._getRefreshGetDiamondNum(data.addList)}`
      this.refreshGetLab2.string = `${this._getRefreshGetItemNum(data.addList)}`
      let gainNum = this._getRefreshGetDiamondNum(data.addList) - this._getCostNum(data.subList)
      if (gainNum > 0) {
        this.gainLab.node.parent.active = true
        this.gainLab.string = `${gainNum}`
      }
    })
  }


  _getCostNum(goods: icmsg.GoodsInfo[]) {
    let num = 0
    let cfg = ConfigManager.getItemById(TavernCfg, 1);
    for (let i = 0; i < goods.length; i++) {
      if (goods[i].typeId == MoneyType.Diamond) {
        num += goods[i].num
      } else if (goods[i].typeId == cfg.reset_item[0]) {
        num += goods[i].num * cfg.reset[1]
      }
    }
    return num
  }

  _getRefreshGetDiamondNum(goods: icmsg.GoodsInfo[]) {
    let num = 0
    for (let i = 0; i < goods.length; i++) {
      if (goods[i].typeId == MoneyType.Diamond) {
        num += goods[i].num
      }
    }
    return num
  }

  _getRefreshGetItemNum(goods: icmsg.GoodsInfo[]) {
    let num = 0
    for (let i = 0; i < goods.length; i++) {
      let cfg = ConfigManager.getItemByField(Tavern_valueCfg, "item", goods[i].typeId)
      if (cfg) {
        num += cfg.value * goods[i].num
      }
    }
    return num
  }

  openDetail(e: cc.Event.EventTouch, type) {
    let goods = parseInt(type) == 0 ? this._detailData.subList : this._detailData.addList
    if (goods.length == 0) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:TASK_TIP23'))
      return
    }
    let title = parseInt(type) == 0 ? gdk.i18n.t('i18n:TASK_TIP24') : gdk.i18n.t('i18n:TASK_TIP25')
    let posY = this.node.convertToNodeSpaceAR(e.touch.getLocation()).y + 30
    gdk.panel.open(PanelId.TavernDetailPanel, (node) => {
      let ctrl = node.getComponent(TavernDetailPanelCtrl)
      ctrl.updateViewInfo(posY, title, goods)
    })
  }

}

export enum TavernTaskQuality {
  green = 1, //绿色
  blue,      //蓝色
  purple,     //紫色
  golden      //金色
}

export const TavernQualityColorInfo = [
  { title: "绿色", color: "#78EBE4", outline: "#5D2401" },
  { title: "蓝色", color: "#b7e6ff", outline: "#5D2401" },
  { title: "紫色", color: "#CE6FF5", outline: "#5D2401" },
  { title: "金色", color: "#FF9936", outline: "#5D2401" },
]
