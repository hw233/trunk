import AssistAllianceItemCtrl from './AssistAllianceItemCtrl';
import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RedPointUtils, { RedPointEvent } from '../../../common/utils/RedPointUtils';
import ResonatingModel from '../model/ResonatingModel';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Hero_careerCfg, Hero_trammelCfg, HeroCfg } from '../../../a/config';
import { ResonatingEventId } from '../enum/ResonatingEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-06 13:42:42 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/resonating/AssistAllianceViewCtrl")
export default class AssistAllianceViewCtrl extends gdk.BasePanel {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  allianceItemPrefab: cc.Prefab = null;

  @property(cc.Node)
  upHeroListContent: cc.Node = null;

  @property(cc.Node)
  heroSlot: cc.Node = null;

  @property(cc.Node)
  limitTips: cc.Node = null;

  get resonatingModel(): ResonatingModel { return ModelManager.get(ResonatingModel); }
  get heroModel(): HeroModel { return ModelManager.get(HeroModel); }

  isRendering: boolean = false;
  onEnable() {
    if (!this.resonatingModel.assistViewOpened) {
      this.resonatingModel.assistViewOpened = true;
      gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }
    //联盟上阵信息请求
    NetManager.send(new icmsg.AssistAllianceStateReq(), () => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      this._initUpHeroList();
      this._updateRedpoint();
    }, this);

    gdk.e.on(ResonatingEventId.ASSIST_ALLIANCE_INFO_PUSH, (e: gdk.Event) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      if (e && e.data) {
        this._updateRedpoint();
      }
    }, this);
  }

  onDisable() {
    gdk.e.targetOff(this);
    NetManager.targetOff(this);
  }

  _initUpHeroList() {
    let initIdx = -1;
    let list = this.heroModel.curUpHeroList(0);
    this.upHeroListContent.removeAllChildren();
    list.forEach((l, idx) => {
      let info = HeroUtils.getHeroInfoByHeroId(l);
      if (info) {
        let cfg = <HeroCfg>BagUtils.getConfigById(info.typeId);
        let slot = cc.instantiate(this.heroSlot);
        slot['heroId'] = info.heroId;
        slot.parent = this.upHeroListContent;
        slot.active = true;
        let ctrl = slot.getComponent(UiSlotItem);
        ctrl.group = cfg.group[0];
        ctrl.starNum = info.star;
        ctrl.career = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', info.careerId).career_type;
        ctrl.updateItemInfo(cfg.id);
        slot.getChildByName('lv').active = true;
        slot.getChildByName('lv').getComponent(cc.Label).string = `.${info.level}`;
        ctrl.onClick.targetOff(this);
        ctrl.onClick.on(() => {
          if (info.star >= 11) {
            this._onUpHeroSelect(info.heroId);
          }
          else {
            gdk.gui.showMessage(gdk.i18n.t('i18n:SUPPORT_TIPS3'));
          }
        }, this);
        GlobalUtil.setAllNodeGray(slot, info.star >= 11 ? 0 : 1);
        if (initIdx == -1 && info.star >= 11) {
          initIdx = info.heroId;
        }
      }
    });
    this.limitTips.active = initIdx == -1;
    if (initIdx !== -1) {
      this._onUpHeroSelect(initIdx);
    }
  }

  _onUpHeroSelect(heroId: number) {
    if (!this.isRendering) {
      this.upHeroListContent.children.forEach((n, idx) => {
        let select = n.getChildByName('select');
        select.active = n['heroId'] == heroId;
        if (n['heroId'] == heroId) {
          this._updateView(n['heroId']);
        }
      });
    }
  }

  async _updateView(heroId: number) {
    this.isRendering = true;
    this.limitTips.active = false;
    let heroInfo = <icmsg.HeroInfo>HeroUtils.getHeroInfoByHeroId(heroId);
    let cfgs = ConfigManager.getItemsByField(Hero_trammelCfg, 'hero_id', heroInfo.typeId);
    let map: { [allianceId: number]: Hero_trammelCfg[] } = {};
    cfgs.forEach(c => {
      if (!map[c.trammel_id]) map[c.trammel_id] = [];
      map[c.trammel_id].push(c);
    });
    this.content.removeAllChildren();
    for (let key in map) {
      if (map[key][0].hero_id !== cfgs[0].hero_id) {
        return;
      }
      let item = cc.instantiate(this.allianceItemPrefab);
      item.parent = this.content;
      let ctrl = item.getComponent(AssistAllianceItemCtrl);
      ctrl.updateView(map[key]);
      await this.waitForSomeFrame(5);
    }
    this.isRendering = false;
  }

  _updateRedpoint() {
    this.upHeroListContent.children.forEach(n => {
      if (n.active) {
        let redPoint = n.getChildByName('RedPoint');
        redPoint.active = RedPointUtils.single_hero_alliance_can_do(n['heroId']);
      }
    })
  }

  /**等待几帧 */
  async waitForSomeFrame(delay: number): Promise<any> {
    return new Promise((resolve, reject) => {
      gdk.Timer.frameOnce(delay, this, () => { resolve(true); });
    });
  }
}

export type assistAllianceType = {
  allianceId: number,
  cfgs: Hero_trammelCfg[],
  infos: icmsg.AssistAlliance,
}
