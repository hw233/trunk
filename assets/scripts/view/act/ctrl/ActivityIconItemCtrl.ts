import ActivityModel from '../model/ActivityModel';
import ActivityUtils from '../../../common/utils/ActivityUtils';
import ActUtil from '../util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import SiegeModel from '../../guild/ctrl/siege/SiegeModel';
import StorageActViewCtrl from './storageAct/StorageActViewCtrl';
import TimerUtils from '../../../common/utils/TimerUtils';
import { ActivityEventId } from '../enum/ActivityEventId';
import {
  MainInterface_mainCfg,
  MainInterface_sortCfg,
  SiegeCfg,
  SystemCfg
  } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-10 14:53:25 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/ActivityIconItemCtrl")
export default class ActivityIconItemCtrl extends cc.Component {
  @property({ type: cc.Integer, tooltip: "图标id,配置表mainInterface" })
  id: number = 0;

  get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

  cfg: MainInterface_mainCfg;
  onLoad() {
    this.cfg = ConfigManager.getItemById(MainInterface_mainCfg, this.id);
    gdk.e.on(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, this.updateFlag, this);
  }

  onEnable() {
    gdk.e.emit(ActivityEventId.ACTIVITY_ICON_SHOW, this.id);
    if (this.cfg) {
      if (this.cfg.hidden == 1) {
        this.node.active = false;
        gdk.e.emit(ActivityEventId.ACTIVITY_ICON_HIDE, this.id);
        return;
      }
      let storageCtrl = this.node.parent.parent.getComponent(StorageActViewCtrl);
      if (storageCtrl) {
        //集合活动界面内
        if (!this.cfg.entrance || this.cfg.entrance.indexOf(storageCtrl.curEntranceType) == -1) {
          this.node.active = false;
          gdk.e.emit(ActivityEventId.ACTIVITY_ICON_HIDE, this.id);
          return;
        }
      } else {
        //主界面
        if (this.cfg.entrance && this.cfg.entrance.indexOf(0) == -1) {
          this.node.active = false;
          gdk.e.emit(ActivityEventId.ACTIVITY_ICON_HIDE, this.id);
          return;
        }
      }


      let url = 'view/act/texture/common/';
      if (this.cfg.isCustom) {
        let actCfg = ActUtil.getCfgByActId(this.cfg.isCustom);
        if (actCfg) {
          let icon = this.node.getChildByName('bg').getChildByName('icon');
          let title = this.node.getChildByName('bg').getChildByName('title');
          GlobalUtil.setSpriteIcon(this.node, title, url + actCfg.name);
          //丧尸活动图标每天不一样
          if (this.cfg.isCustom == 79) {
            let siegeCfg = ConfigManager.getItemById(SiegeCfg, ModelManager.get(SiegeModel).weekDay)
            GlobalUtil.setSpriteIcon(this.node, icon, url + siegeCfg.icon);
          } else {
            GlobalUtil.setSpriteIcon(this.node, icon, url + actCfg.icon);
          }
        }
      }
      if (this.cfg.icon) {
        let icon = this.node.getChildByName('bg').getChildByName('icon');
        GlobalUtil.setSpriteIcon(this.node, icon, url + this.cfg.icon);
      }
      if (this.cfg.resources) {
        let title = this.node.getChildByName('bg').getChildByName('title');
        GlobalUtil.setSpriteIcon(this.node, title, url + this.cfg.resources);
      }
    }
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
    // this.node.on(cc.Node.EventType.CHILD_ADDED, this._adjustSiblingIndex, this);
    // this.node.on(cc.Node.EventType.CHILD_REMOVED, this._adjustSiblingIndex, this);
    // this.node.on(cc.Node.EventType.CHILD_REORDER, this._adjustSiblingIndex, this);
  }

  onDisable() {
    let newFlag = this.node.getChildByName('newFlag');
    if (newFlag) {
      newFlag.active = false;
    }
    gdk.e.emit(ActivityEventId.ACTIVITY_ICON_HIDE, this.id);
    this.node.targetOff(this);
  }

  // dtime: number = 0;
  // update(dt: number) {
  // if (this.dtime >= 1) {
  //   this.dtime = 0;
  //   let newFlag = this.node.getChildByName('newFlag');
  //   let child = this.node.children;
  //   if (newFlag && child[child.length - 1].name !== 'newFlag') {
  //     newFlag.zIndex = 1000;
  //   }
  //   return;
  // }
  // this.dtime += dt;
  // }

  updateFlag(e: gdk.Event) {
    if (!cc.isValid(this.node) || !this.node.activeInHierarchy) return;
    if (!this.cfg || (!this.cfg.systemid && !this.cfg.entrance_type)) return;
    let mainInterfaceMainCfg = ConfigManager.getItemById(MainInterface_mainCfg, e.data);
    // if (this.cfg.id == e.data || (this.cfg.id == 14 && this.actModel.storageActIds.indexOf(e.data) !== -1)) {
    if ((this.cfg.id == e.data && !this.cfg.entrance_type)
      || (this.cfg.entrance_type > 0 && mainInterfaceMainCfg.entrance && mainInterfaceMainCfg.entrance.indexOf(this.cfg.entrance_type) !== -1)) {
      let cfgs = [];
      if (this.cfg.id == 12 || mainInterfaceMainCfg.id == 12) {
        //限时活动集合入口
        cfgs.push(...this.actModel.limitActCfgs);
      } else {
        cfgs.push(mainInterfaceMainCfg);
      }

      for (let i = 0; i < cfgs.length; i++) {
        if (ActivityUtils.checkActIsNew(cfgs[i])) {
          let newFlag = this.node.getChildByName('newFlag');
          if (!newFlag) {
            newFlag = new cc.Node();
            // newFlag.parent = this.node;
            this.node.addChild(newFlag, 1000);
            newFlag.name = 'newFlag';
            newFlag.setPosition(35, 35);
            newFlag.addComponent(cc.Sprite);
            newFlag.setSiblingIndex(9999);
            GlobalUtil.setSpriteIcon(this.node, newFlag, `view/act/texture/common/hd_xinhongdian`);
          }
          newFlag.active = true;
          newFlag.stopAllActions();
          newFlag.setScale(1);
          newFlag.runAction(cc.repeatForever(
            cc.sequence(
              cc.scaleTo(.5, 1.3, 1.3),
              cc.scaleTo(.5, 1, 1),
            )
          ))
          return;
        }
      }
    }
  }

  // _adjustSiblingIndex() {
  //   let newFlag = this.node.getChildByName('newFlag');
  //   if (newFlag) {
  //     newFlag.setSiblingIndex(9999);
  //   }
  // }

  _onTouchStart(e: cc.Event) {
    //精彩活动(收纳入口) 排除
    if (!this.cfg || !this.cfg.systemid || this.cfg.entrance_type > 0) return;
    let systemid = [];
    if (this.cfg.systemid == 2946) {
      ConfigManager.getItems(MainInterface_sortCfg, (cfg: MainInterface_sortCfg) => {
        if (cfg.whether == 1) {
          systemid.push(cfg.systemid);
        }
      });
    } else {
      systemid.push(this.cfg.systemid);
    }

    for (let i = 0; i < systemid.length; i++) {
      let sysId = systemid[i];
      let sysCfg = ConfigManager.getItemById(SystemCfg, sysId);
      let actCfgZeroT = sysCfg.activity ? TimerUtils.getZerohour(ActUtil.getActStartTime(sysCfg.activity) / 1000) : 0;
      let obj = { showNewFlag: false, actCfgZeroT: actCfgZeroT };
      GlobalUtil.setLocal(`storage_${sysId}`, obj, true);
    }
    let newFlag = this.node.getChildByName('newFlag');
    newFlag && (newFlag.active = false);
  }
}
