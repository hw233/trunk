import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import SubActivityViewCtrl from './SubActivityViewCtrl';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { MainInterface_sort_1Cfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-09 17:43:41 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

/**systemId - {panelId,redpointCb} */
const activityPanelInfo: any = {
  2821: { panelId: PanelId.SubActivityView, redPointCb: RedPointUtils.has_reward_exciting_act, args: 2821 }, //累充豪礼
  2822: { panelId: PanelId.SubActivityView, redPointCb: RedPointUtils.has_reward_exciting_act, args: 2822 }, //升级有礼
  2823: { panelId: PanelId.SubActivityView, redPointCb: RedPointUtils.has_reward_exciting_act, args: 2823 }, //点金达人
  2824: { panelId: PanelId.SubActivityView, redPointCb: RedPointUtils.has_reward_exciting_act, args: 2824 }, //速战达人
  2825: { panelId: PanelId.SubActivityView, redPointCb: RedPointUtils.has_reward_exciting_act, args: 2825 }, //竞技达人
  2826: { panelId: PanelId.SubActivityView, redPointCb: RedPointUtils.has_reward_exciting_act, args: 2826 }, //探宝达人
  // 2827: { panelId: PanelId.SubMagicExchange, redPointCb: null, args: 2827 }, //魔幻迷境
  2828: { panelId: PanelId.SubActivityView, redPointCb: RedPointUtils.has_reward_exciting_act, args: 2828 }, //英雄集结
  2875: { panelId: PanelId.WeekendGiftView, redPointCb: RedPointUtils.has_weekend_gift, args: null }, //周末福利
}

@ccclass
@menu("qszc/view/act/wonderfulActivity/WonderfulActivityViewCtrl")
export default class WonderfulActivityViewCtrl extends gdk.BasePanel {
  @property(cc.Node)
  panelNode: cc.Node = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(UiTabMenuCtrl)
  tabMenu: UiTabMenuCtrl = null;

  actCfgs: MainInterface_sort_1Cfg[] = [];
  curCfg: MainInterface_sort_1Cfg;
  onEnable() {
    this._initCfg();
    this._preloadPanel();
    this._initMenu();
    let arg = this.args;
    let idx;
    if (arg) {
      let sysId;
      if (arg instanceof Array) sysId = arg[0];
      else sysId = arg;
      if (sysId) {
        for (let i = 0; i < this.actCfgs.length; i++) {
          if (sysId == this.actCfgs[i].systemid) {
            idx = i;
            break;
          }
        }
      }
    }
    if (!idx) idx = 0;
    this.tabMenu.setSelectIdx(idx, true);
    gdk.e.on(ActivityEventId.ACTIVITY_TIME_IS_OVER, this._onActivityTimeIsOver, this);
    NetManager.on(icmsg.ExcitingActivityRewardsRsp.MsgType, this._onRewardsRsp, this);
  }

  onDisable() {
    // 关闭打开或打开中的子界面
    for (let key in activityPanelInfo) {
      if (activityPanelInfo[key]) {
        let panelId = activityPanelInfo[key].panelId;
        panelId && gdk.panel.hide(panelId);
      }
    }
    this.actCfgs = [];
    this.curCfg = null;
    gdk.e.targetOff(this);
    NetManager.targetOff(this);
  }

  onMenuSelect(e, idx) {
    if (e) {
      if (!JumpUtils.ifSysOpen(this.actCfgs[idx].systemid)) {
        gdk.gui.showMessage(gdk.i18n.t("i18n:ADVENTURE_TIP2"));
        this.close();
        return;
      }

      if (this.curCfg) {
        let info = activityPanelInfo[this.curCfg.systemid];
        let panelId = info ? info.panelId : null;
        if (panelId) {
          let newInfo = activityPanelInfo[this.actCfgs[idx].systemid];
          let newPanelId = newInfo ? newInfo.panelId : null;
          let node = gdk.panel.get(panelId);
          if (panelId == newPanelId && node) {
            let ctrl = node.getComponent(SubActivityViewCtrl);
            this.curCfg = this.actCfgs[idx];
            if (ctrl) {
              ctrl.selectView(this.curCfg);
              return;
            }
          }
          else {
            gdk.panel.hide(panelId);
          }
        }
      }

      gdk.Timer.callLater(this, () => {
        if (!cc.isValid(this.node)) return;
        this.curCfg = this.actCfgs[idx];
        let info = activityPanelInfo[this.curCfg.systemid];
        let panelId: gdk.PanelValue = info ? info.panelId : null;
        if (panelId) {
          panelId.isMask = false;
          panelId.isTouchMaskClose = false;
          gdk.panel.open(panelId, null, null, {
            parent: this.panelNode,
            args: this.curCfg
          });
        }
      });
    }
  }

  _initCfg() {
    this.actCfgs = [];
    this.actCfgs = ConfigManager.getItems(MainInterface_sort_1Cfg, (cfg: MainInterface_sort_1Cfg) => {
      if (!cfg.hidden && JumpUtils.ifSysOpen(cfg.systemid)) {
        return true;
      }
    });
    this.actCfgs.sort((a, b) => {
      return a.sorting - b.sorting;
    });
  }

  _preloadPanel() {
    this.actCfgs.forEach(cfg => {
      let panelId: gdk.PanelValue = activityPanelInfo[cfg.systemid]['panelId'];
      panelId && gdk.panel.preload(panelId);
    });
  }

  _initMenu() {
    let str = '1'.repeat(this.actCfgs.length);
    this.tabMenu.itemNames = Array.from(str);
    this.tabMenu.node.children.forEach((btn, idx) => {
      let cfg = this.actCfgs[idx];
      if (cfg) {
        let url = `view/act/texture/wonderfulActivitys/${cfg.resource}`;
        GlobalUtil.setSpriteIcon(this.node, cc.find('select/icon', btn), url);
        GlobalUtil.setSpriteIcon(this.node, cc.find('normal/icon', btn), url + '01');
        let cb = activityPanelInfo[cfg.systemid]['redPointCb'];
        let args = activityPanelInfo[cfg.systemid]['args'];
        btn.getChildByName('RedPoint').active = cb ? args ? cb(args) : cb() : false;
      }
      else {
        btn && btn.removeFromParent();
      }
    });
    this.scrollView.horizontal = this.actCfgs.length > 5;
  }

  _updateBtnRedpoint() {
    this.tabMenu.node.children.forEach((btn, idx) => {
      let cfg = this.actCfgs[idx];
      if (cfg) {
        let cb = activityPanelInfo[cfg.systemid]['redPointCb'];
        let args = activityPanelInfo[cfg.systemid]['args'];
        btn.getChildByName('RedPoint').active = cb ? args ? cb(args) : cb() : false;
      }
    });
  }

  /**活动过期 */
  _onActivityTimeIsOver() {
    gdk.gui.showMessage(gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1"));
    this.close();
  }

  _onRewardsRsp() {
    this._updateBtnRedpoint();
  }
}
