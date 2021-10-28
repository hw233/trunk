import { Store_7dayCfg, Store_giftCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import StoreUtils from '../../../common/utils/StoreUtils';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import ActUtil from '../../act/util/ActUtil';
import ChampionModel from '../../champion/model/ChampionModel';
import StoreModel from '../../store/model/StoreModel';
import { TaskEventId } from '../enum/TaskEventId';
import SevenDaysStoreGiftItem from './SevenDaysStoreGiftItemCtrl';
import UIScrollSelectCtrl from './UIScrollSelectCtlr';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-15 15:35:59 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/SevenDaysStoreViewCtrl")
export default class SevenDaysStoreViewCtrl extends gdk.BasePanel {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  storeItemPrefab: cc.Prefab = null;

  @property(cc.Node)
  giftNode: cc.Node = null;

  @property(cc.Node)
  giftContent: cc.Node = null;

  @property(cc.Prefab)
  giftItemPrefab: cc.Prefab = null;

  @property(cc.ToggleContainer)
  giftIdxToggleContainer: cc.ToggleContainer = null;

  @property([cc.Button])
  dayBtns: cc.Button[] = [];

  get roleModel() { return ModelManager.get(RoleModel); }
  get storeModel() { return ModelManager.get(StoreModel); }

  list: ListView = null;
  defaultDay: number;
  selectDay: number;
  specialGiftLen: number = 0;
  curToggleIdx: number = 0;
  sevenStoreScrollViewHeight: number[] = [332, 528];
  onEnable() {
    ModelManager.get(StoreModel).isFirstInSevenStore = false;
    gdk.e.emit(TaskEventId.UPDATE_TASK_SEVEN_DAYS_SCORE_AWARD_STATE);
    let arg = this.args;
    if (arg) {
      if (arg instanceof Array) this.defaultDay = arg[0];
      else this.defaultDay = arg;
    }
    if (!this.defaultDay) this.defaultDay = Math.floor((GlobalUtil.getServerTime() - GlobalUtil.getServerOpenTime() * 1000) / (86400 * 1000)) + 1;
    this.selectDay = this.defaultDay;
    this.dayBtns.forEach((btn, idx) => {
      this.storeModel.firstInSevenStoreDays[this.selectDay] = true;
      btn.node.getChildByName('select').active = idx == this.selectDay - 1;
      btn.node.getChildByName('normal').active = idx != this.selectDay - 1;
    });
    this._updateDaysRedPoint();
    this._initList();
    gdk.e.on(TaskEventId.SEVENDAYS_STORE_SELL_OUT, this._onSevenDaysStoreSellOut, this);
    this.giftContent.on(cc.Node.EventType.MOUSE_ENTER, this._onMouseEnter, this, true);
    this.giftContent.on(cc.Node.EventType.MOUSE_LEAVE, this._onMouseLeave, this, true);
    this.giftContent.on(cc.Node.EventType.TOUCH_START, this._onMouseEnter, this, true);
    this.giftContent.on(cc.Node.EventType.TOUCH_END, this._onMouseLeave, this, true);
    this.giftContent.on(cc.Node.EventType.TOUCH_CANCEL, this._onMouseLeave, this, true);
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
    gdk.Timer.clearAll(this);
    gdk.e.targetOff(this);
    this.giftContent.off(cc.Node.EventType.MOUSE_ENTER, this._onMouseEnter, this);
    this.giftContent.off(cc.Node.EventType.MOUSE_LEAVE, this._onMouseLeave, this);
    this.giftContent.off(cc.Node.EventType.TOUCH_START, this._onMouseEnter, this);
    this.giftContent.off(cc.Node.EventType.TOUCH_END, this._onMouseLeave, this);
    this.giftContent.off(cc.Node.EventType.TOUCH_CANCEL, this._onMouseLeave, this);
  }

  onDaysBtnClick(btn, data) {
    if (parseInt(data) == this.selectDay) return;

    this.dayBtns[this.selectDay - 1].node.getChildByName('select').active = false;
    this.dayBtns[this.selectDay - 1].node.getChildByName('normal').active = true;

    this.selectDay = parseInt(data);

    this.dayBtns[this.selectDay - 1].node.getChildByName('select').active = true;
    this.dayBtns[this.selectDay - 1].node.getChildByName('normal').active = false;
    this.storeModel.firstInSevenStoreDays[this.selectDay] = true;
    this._updateDaysRedPoint();
    this._updateList();
  }

  _initList() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.storeItemPrefab,
        gap_y: 5,
        cb_host: this,
        async: true,
        direction: ListViewDir.Vertical,
      });
    }
    this._updateList();
  }

  _updateList() {
    let cfgs = ConfigManager.getItemsByField(Store_7dayCfg, 'day', this.selectDay);
    let storeInfo = ModelManager.get(StoreModel).sevenStoreInfo;
    let sellOutItems: Store_7dayCfg[] = [];
    let others: Store_7dayCfg[] = [];

    let specialCfgs: Store_giftCfg[] = [];
    cfgs.forEach(cfg => {
      if (cfg.item && cfg.item.length >= 1) {
        if (storeInfo && storeInfo[cfg.id] && storeInfo[cfg.id] == cfg.times_limit) sellOutItems.push(cfg);
        else others.push(cfg);
      }
      else {
        let giftBuyInfo = StoreUtils.getStoreGiftBuyInfo(cfg.id);
        let giftCfg = ConfigManager.getItemById(Store_giftCfg, cfg.id);
        if (this._checkGiftOpen(giftCfg)) {
          if (!giftBuyInfo || giftBuyInfo.count < giftCfg.times_limit) specialCfgs.push(giftCfg);
        }
      }
    });

    this.specialGiftLen = specialCfgs.length;
    if (specialCfgs.length <= 0) {
      this.giftNode.active = false;
      this.scrollView.node.height = this.sevenStoreScrollViewHeight[1];
    }
    else {
      this.giftNode.active = true;
      this._updateSpecialGift(specialCfgs)
      this.scrollView.node.height = this.sevenStoreScrollViewHeight[0];
    }

    this.list.clear_items();
    this.list.set_data(others.concat(sellOutItems));
  }

  _updateSpecialGift(cfgs: Store_giftCfg[]) {
    this.giftContent.removeAllChildren();
    if (cfgs.length > 0) {
      for (let i = 0; i < cfgs.length; i++) {
        let item = cc.instantiate(this.giftItemPrefab);
        item.parent = this.giftContent;
        item.name = `specialGift${i}`;
        let ctrl = item.getComponent(SevenDaysStoreGiftItem);
        ctrl.updateView(cfgs[i]);
      }

      this.giftIdxToggleContainer.node.children.forEach((child, idx) => {
        if (cfgs[idx]) {
          child.active = true;
        }
        else {
          child.active = false;
        }
      });
      if (cfgs.length >= 1) {
        this.curToggleIdx = 0;
        this.giftIdxToggleContainer.toggleItems[0].check();
      }
      this.giftContent.getComponent(UIScrollSelectCtrl).updateChilds();
      this.autoScrollGift();
    }
  }

  _onMouseEnter(e: any) {
    gdk.Timer.clearAll(this);
  }

  _onMouseLeave(e: any) {
    this.autoScrollGift();
  }

  autoScrollGift() {
    gdk.Timer.clearAll(this);
    gdk.Timer.loop(3000, this, () => {
      let ctrl = this.giftContent.getComponent(UIScrollSelectCtrl);
      if (ctrl.isTestX) return;
      if (this.specialGiftLen == 1) return;
      if (this.specialGiftLen == 2) ctrl.fix(-1);
      ctrl.scrollToRight();

      let idx = this.curToggleIdx;
      idx = idx + 1 > this.specialGiftLen - 1 ? 0 : idx + 1;
      let toggleItems = this.giftIdxToggleContainer.toggleItems;
      if (toggleItems[idx]) {
        toggleItems[idx].check();
        this.curToggleIdx = idx;
      }
    });
  }

  onUIScrollSelect(event: any) {
    let target: cc.Node = event.target;
    if (!target.parent || !target.parent.parent) return;
    let name;
    if (target.name.indexOf('specialGift') != -1) {
      name = target.name;
    }
    else if (target.parent.name.indexOf('specialGift') != -1) {
      name = target.parent.name;
    }
    if (!name) return;
    let idx = parseInt(name.charAt(name.length - 1));
    let ctrl = this.giftContent.getComponent(UIScrollSelectCtrl);
    let toggle;
    let len = this.specialGiftLen;
    if (len == 1) return;
    if (event.direction < 0) {
      idx = idx + 1 > len - 1 ? 0 : idx + 1;
      toggle = this.giftIdxToggleContainer.toggleItems[idx];
      if (len == 2) ctrl.fix(-1)
      ctrl.scrollToRight();
    }
    else {
      idx = idx - 1 < 0 ? len - 1 : idx - 1;
      toggle = this.giftIdxToggleContainer.toggleItems[idx];
      if (len == 2) ctrl.fix(1);
      ctrl.scrollToLeft();
    }
    if (toggle) {
      this.curToggleIdx = idx;
      toggle.check();
    }
  }

  //检查礼包是否可以购买
  _checkGiftOpen(cfg: Store_giftCfg) {
    let openLv: number = parseInt(cfg.gift_level) || 0;
    if (cfg.open_conds) {
      let info = this.storeModel.storeInfo[cfg.open_conds];
      if (!info || info.count <= 0) {
        return false;
      }
    }
    if (cfg.cross_id && cfg.cross_id.indexOf(this.roleModel.crossId) === -1) {
      return false;
    }
    if (cfg.unlock) {
      let star = ModelManager.get(RoleModel).maxHeroStar;
      if (star < cfg.unlock) return false;
    }
    if (openLv > ModelManager.get(RoleModel).level) {
      // 等级达不到要求
      return false;
    } else if (cfg.timerule == 0) {
      // 没有限制开放
      return true;
    } else {
      let timeCfg: any = cfg.restricted;
      // 刚开始只有一个时间段格式，按此方式解析
      if (timeCfg.length > 0) {
        if (timeCfg[0] == 3) {
          let startArr = timeCfg[2]
          let endArr: any = timeCfg[3]
          let time = GlobalUtil.getServerOpenTime() * 1000;
          let startDate = time + (startArr[2] * 24 * 60 * 60 + startArr[3] * 60 * 60 + startArr[4] * 60) * 1000;
          let endDate = time + (endArr[2] * 24 * 60 * 60 + endArr[3] * 60 * 60 + endArr[4] * 60) * 1000;
          let nowDay = GlobalUtil.getServerTime();
          if (nowDay >= startDate && nowDay <= endDate) {
            return true;
          }
        }
        else if (timeCfg[0] == 1) {
          let startArr = timeCfg[2];
          let endArr: any = timeCfg[3];
          let startDate = new Date(startArr[0] + '/' + startArr[1] + '/' + startArr[2] + ' ' + startArr[3] + ':' + startArr[4] + ':0')
          let endDate = new Date(endArr[0] + '/' + endArr[1] + '/' + endArr[2] + ' ' + endArr[3] + ':' + endArr[4] + ':0')
          let nowDay = GlobalUtil.getServerTime();
          if (nowDay >= startDate.getTime() && nowDay <= endDate.getTime()) {
            return true;
          }
        }
        else if (timeCfg[0] == 6) {
          if (ActUtil.ifActOpen(timeCfg[1][0])) {
            return true;
          }
        }
        else if (timeCfg[0] == 7) {
          if (JumpUtils.ifSysOpen(2856)) {
            let model = ModelManager.get(ChampionModel);
            if (model.infoData && model.infoData.seasonId) {
              // let cfg: Champion_mainCfg = ConfigManager.getItemById(Champion_mainCfg, model.infoData.seasonId);
              // if (cfg) {
              //   let o = cfg.open_time.split('/');
              //   let c = cfg.close_time.split('/');
              //   let ot = new Date(o[0] + '/' + o[1] + '/' + o[2] + ' ' + o[3] + ':' + o[4] + ':' + o[5]).getTime();
              //   let ct = new Date(c[0] + '/' + c[1] + '/' + c[2] + ' ' + c[3] + ':' + c[4] + ':' + c[5]).getTime();
              //   let curTime = GlobalUtil.getServerTime();
              //   if (curTime >= ot && curTime <= ct) {
              //     return true;
              //   }
              // }
              if (ActUtil.ifActOpen(122)) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  _onSevenDaysStoreSellOut() {
    this._updateList();
  }

  @gdk.binding("roleModel.level")
  _updateLimit() {
    this._updateList();
  }

  _updateDaysRedPoint() {
    let curDay = Math.floor((GlobalUtil.getServerTime() - GlobalUtil.getServerOpenTime() * 1000) / (86400 * 1000)) + 1;
    let selectDay = Math.min(7, curDay);
    this.dayBtns.forEach((btn, idx) => {
      if (!this.storeModel.firstInSevenStoreDays[idx + 1] && idx <= selectDay - 1) {
        let cfgs = ConfigManager.getItemsByField(Store_7dayCfg, 'day', idx + 1);
        for (let j = 0; j < cfgs.length; j++) {
          let storeInfo = this.storeModel.sevenStoreInfo[cfgs[j].id];
          let boughtTime = storeInfo | 0;
          if (boughtTime < cfgs[j].times_limit) {
            if (!cfgs[j].VIP_commit || this.roleModel.vipLv >= cfgs[j].VIP_commit) {
              btn.node.getChildByName('RedPoint').active = true;
              return;
            }
          }
        }
      }
      btn.node.getChildByName('RedPoint').active = false;
    })
  }
}
