import AssistAllianceAttrItemCtrl from './AssistAllianceAttrItemCtrl';
import AssistAllianceHeroItemCtrl from './AssistAllianceHeroItemCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import ResonatingModel from '../model/ResonatingModel';
import { Hero_trammelCfg } from '../../../a/config';
import { ResonatingEventId } from '../enum/ResonatingEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-06 13:44:01 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/resonating/AssistAllianceItemCtrl")
export default class AssistAllianceItemCtrl extends cc.Component {
  @property(cc.Label)
  titleLab: cc.Label = null;

  @property(cc.Node)
  heroContent: cc.Node = null;

  @property(cc.Prefab)
  heroItemPrefab: cc.Prefab = null;

  @property(cc.Node)
  attrContent: cc.Node = null;

  @property(cc.Prefab)
  attrItemPrefab: cc.Prefab = null;

  @property(cc.Node)
  tips: cc.Node = null;

  get model(): ResonatingModel { return ModelManager.get(ResonatingModel); }

  cfgs: Hero_trammelCfg[] = [];
  onEnable() {
    gdk.e.on(ResonatingEventId.ASSIST_ALLIANCE_INFO_PUSH, this._onAllianceInfoChanged, this);
  }

  onDisable() {
    this.attrContent.children.forEach(n => { n.stopAllActions(); });
    gdk.e.targetOff(this);
  }

  updateView(cfgs: Hero_trammelCfg[]) {
    this.cfgs = cfgs;
    this.titleLab.string = this.cfgs[0].trammel_name;
    this.heroContent.removeAllChildren();
    this.cfgs[0].trammel_hero.forEach((heroType, idx) => {
      let item = cc.instantiate(this.heroItemPrefab);
      item.parent = this.heroContent;
      let ctrl = item.getComponent(AssistAllianceHeroItemCtrl);
      ctrl.updateView([this.cfgs, idx]);
    });

    this.attrContent.removeAllChildren();
    let attrCfgs = this._getShowCfgs();
    attrCfgs.forEach(c => {
      let item = cc.instantiate(this.attrItemPrefab);
      item.parent = this.attrContent;
      let ctrl = item.getComponent(AssistAllianceAttrItemCtrl);
      ctrl.updateView(c)
    });
    this._updateTips(attrCfgs.length);
  }

  _updateTips(len: number) {
    this.tips.active = len == 1;
    if (this.tips.active) {
      let id = this.cfgs[0].trammel_id;
      let info = this.model.assistAllianceInfos[id] || null;
      let url = ['view/resonating/texture/xzlm_xingjidacheng', 'view/resonating/texture/xzlm_yijihuozuigaoxingji'];
      GlobalUtil.setSpriteIcon(this.node, this.tips, !info || info.activeStar == 0 ? url[0] : url[1]);
    }
  }

  /**更新属性节点 */
  _onAllianceInfoChanged(e: gdk.Event) {
    if (e && e.data && !!this.cfgs && this.cfgs[0].trammel_id == e.data.allianceId) {
      let layout = this.attrContent.getComponent(cc.Layout);
      layout.enabled = true;
      this.attrContent.children.forEach(n => {
        n.stopAllActions();
        n.setPosition(0, n.y);
      });
      let cfgs = this._getShowCfgs();
      this._updateTips(cfgs.length);
      if (cfgs.length < this.attrContent.children.length) {
        this.attrContent.children[1].removeFromParent();
      }
      if (this.attrContent.children.length < 2) e.data.showAni = false;
      if (!e.data.showAni) {
        cfgs.forEach((c, idx) => {
          let n = this.attrContent.children[idx];
          if (!n) {
            n = cc.instantiate(this.attrItemPrefab);
            n.parent = this.attrContent;
          }
          let ctrl = n.getComponent(AssistAllianceAttrItemCtrl);
          ctrl.updateView(c);
        });
      }
      else {
        //0 n.height
        cfgs.forEach((c, idx) => {
          let n = this.attrContent.children[idx];
          layout.enabled = false;
          if (idx == 0) {
            n.runAction(cc.sequence(
              cc.fadeOut(.3),
              cc.callFunc(() => {
                n.y = -n.height;
                let ctrl = n.getComponent(AssistAllianceAttrItemCtrl);
                ctrl.updateView(cfgs[idx + 1])
              }),
              cc.delayTime(.3),
              cc.fadeTo(.3, 255),
            ))
          }
          else {
            n.runAction(cc.sequence(
              cc.delayTime(.3),
              cc.moveTo(.3, cc.v2(0, 0)),
              cc.callFunc(() => {
                let ctrl = n.getComponent(AssistAllianceAttrItemCtrl);
                ctrl.updateView(cfgs[idx - 1]);
              }),
            ))
          }
        });
      }
    }
  }

  /**获取需要显示的配置项 */
  _getShowCfgs(): Hero_trammelCfg[] {
    let id = this.cfgs[0].trammel_id;
    let info = this.model.assistAllianceInfos[id] || null;
    let c = [];
    let upHeroIds = info ? info.heroIds : [];
    let totalStar = 0;
    let upNum = 0;
    upHeroIds.forEach(id => {
      let i = HeroUtils.getHeroInfoByHeroId(id);
      if (i) {
        upNum += 1;
        totalStar += i.star;
      }
    });
    if (!info || info.activeStar == 0) {
      for (let i = 0; i < this.cfgs.length; i++) {
        if (this.cfgs[i].star_lv <= totalStar && (i == this.cfgs.length - 1 || this.cfgs[i + 1].star_lv > totalStar)) {
          c.push(this.cfgs[i]);
          break;
        }
      }
      if (c.length == 0) {
        c.push(this.cfgs[0]);
      }
    }
    else {
      let cur = ConfigManager.getItemByField(Hero_trammelCfg, 'trammel_id', id, { star_lv: info.activeStar });
      c.push(cur);
      let next;
      for (let i = this.cfgs.length - 1; i >= 0; i--) {
        if (upNum >= this.cfgs[i].trammel_hero.length && totalStar >= this.cfgs[i].star_lv) {
          if (this.cfgs[i].star_lv == cur.star_lv) {
            next = this.cfgs[i + 1];
            break;
          }
          else {
            next = this.cfgs[i];
            break;
          }
        }
      }
      if (next) {
        c.push(next);
      }
    }
    return c;
  }
}
