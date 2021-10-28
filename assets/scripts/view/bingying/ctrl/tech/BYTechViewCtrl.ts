import BYModel, { EnergyStoneInfo } from '../../model/BYModel';
import BYUtils from '../../utils/BYUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointUtils, { RedPointEvent } from '../../../../common/utils/RedPointUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { BYEventId } from '../../enum/BYEventId';
import { Tech_globalCfg, Tech_stoneCfg, TechCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-13 15:07:11 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/tech/BYTechViewCtrl")
export default class BYTechViewCtrl extends gdk.BasePanel {
  @property(cc.Label)
  lvLab: cc.Label = null;

  @property([cc.Node])
  slots: cc.Node[] = [];

  @property(cc.Node)
  researchBtn: cc.Node = null;

  @property(cc.Node)
  careerIcon: cc.Node = null;

  @property([cc.Label])
  attrLabs: cc.Label[] = [];

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Node)
  skillItem: cc.Node = null;

  @property(UiTabMenuCtrl)
  uiTabMenu: UiTabMenuCtrl = null;

  @property(cc.Label)
  title1: cc.Label = null;

  @property(cc.Label)
  title2: cc.Label = null;

  @property([cc.Node])
  atrIcon: cc.Node[] = [];

  get byModel(): BYModel { return ModelManager.get(BYModel); }

  careerNames: string[] = [gdk.i18n.t('i18n:BINGYING_TIP17'), '', gdk.i18n.t('i18n:BINGYING_TIP18'), gdk.i18n.t('i18n:BINGYING_TIP19')]
  iconUrls: string[] = ['view/bingying/texture/energize/kj_qiangbing', '', 'view/bingying/texture/energize/kj_paobing', 'view/bingying/texture/energize/kj_shouwei'];
  curSelectType: number; //1-枪 3-炮 4-守
  onEnable() {
    if (this.byModel.firstInTechView) {
      this.byModel.firstInTechView = false;
      gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }
    this._updateResearchProgress();
    this.schedule(this._updateResearchProgress, 1);
    this.uiTabMenu.setSelectIdx(0, true);
    gdk.e.on(BYEventId.BY_TECH_LV_UP, this._updateView, this);
    NetManager.on(icmsg.SoldierTechEquipStoneRsp.MsgType, this._updateView, this);
  }

  onDisable() {
    this.unscheduleAllCallbacks();
    gdk.e.targetOff(this);
    NetManager.targetOff(this);
  }

  onSlotClick(e, type) {
    let idx = parseInt(type)
    let info = this.byModel.techMap[this.curSelectType];
    let cfg = ConfigManager.getItemByField(TechCfg, 'type', this.curSelectType, { unlock: idx });
    if (info && info.lv >= cfg.lv) {
      if (info.slots[idx - 1] > 0) {
        let stoneInfo: EnergyStoneInfo = {
          slot: idx - 1,
          itemId: info.slots[idx - 1],
          itemNum: 1
        }
        gdk.panel.setArgs(PanelId.BYTechStoneInfoView, [stoneInfo, idx]);
        gdk.panel.open(PanelId.BYTechStoneInfoView);
      } else {
        gdk.panel.setArgs(PanelId.BYTechStoneSelectView, [this.curSelectType, idx]);
        gdk.panel.open(PanelId.BYTechStoneSelectView);
      }
    }
  }

  onTechUpBtnClick() {
    gdk.panel.setArgs(PanelId.BYTechUpgradeView, this.curSelectType);
    gdk.panel.open(PanelId.BYTechUpgradeView);
  }

  onTechResearchBtnClick() {
    gdk.panel.open(PanelId.BYResearchView);
  }

  onUiTabMenuSelect(e, utype) {
    if (!e) return;
    let type = [1, 3, 4][parseInt(utype)];
    if (this.curSelectType == type) return;
    this.curSelectType = type;
    this._updateView();
  }

  _updateView() {
    GlobalUtil.setSpriteIcon(this.node, this.careerIcon, this.iconUrls[this.curSelectType - 1]);
    let info = this.byModel.techMap[this.curSelectType];
    this.lvLab.string = `${this.careerNames[this.curSelectType - 1]}${gdk.i18n.t('i18n:BINGYING_TIP21')}Lv.${info ? info.lv : 0}`;
    this.title1.string = `${this.careerNames[this.curSelectType - 1]}${gdk.i18n.t('i18n:BINGYING_TIP23')}`;
    this.title2.string = `${this.careerNames[this.curSelectType - 1]}${gdk.i18n.t('i18n:BINGYING_TIP24')}`;
    let iconNames = ['gongji', 'fangyu', 'shengming']
    let m = { 1: 3, 3: 1, 4: 2 }; //映射资源命名
    this.atrIcon.forEach((icon, idx) => {
      GlobalUtil.setSpriteIcon(this.node, icon, `common/texture/bingying/by_${iconNames[idx]}0${m[this.curSelectType]}`);
    });
    //slot
    this.slots.forEach((n, idx) => {
      let lockNode = n.getChildByName('lock');
      let addBtn = n.getChildByName('add');
      let slot = n.getChildByName('UiSlotItem');
      let cfg = ConfigManager.getItemByField(TechCfg, 'type', this.curSelectType, { unlock: idx + 1 });
      lockNode.active = !info || info.lv < cfg.lv;
      slot.active = info && info.slots[idx] > 0;
      addBtn.active = !lockNode.active && !slot.active;
      if (lockNode.active) {
        cc.find('lab', lockNode).getComponent(cc.RichText).string = `${this.careerNames[this.curSelectType - 1]}${gdk.i18n.t('i18n:BINGYING_TIP21')}<color=#5effaa>Lv${cfg.lv}</c>${gdk.i18n.t('i18n:BINGYING_TIP25')}`;
      }
      if (slot.active) {
        let ctrl = slot.getComponent(UiSlotItem);
        ctrl.updateItemInfo(info.slots[idx]);
      }
    });
    //attr
    let atrKeys = ['atk_g', 'def_g', 'hp_g'];
    this.attrLabs.forEach((l, idx) => {
      // let techV = ConfigManager.getItemByField(TechCfg, 'type', this.curSelectType, { lv: info ? info.lv : 0 })[atrKeys[idx]];
      let techV = BYUtils.getTechTotalVBylv(this.curSelectType, info ? info.lv : 0, atrKeys[idx]);
      let stoneV = 0;
      if (info && info.slots.length > 0) {
        info.slots.forEach(s => {
          if (s > 0) {
            stoneV += ConfigManager.getItemById(Tech_stoneCfg, s)[atrKeys[idx]];
          }
        });
      }
      l.string = techV + stoneV + '';
    });
    //skill
    this.content.removeAllChildren();
    if (info && info.slots.length > 0) {
      info.slots.forEach(s => {
        if (s > 0) {
          let cfg = ConfigManager.getItemById(Tech_stoneCfg, s);
          let item = cc.instantiate(this.skillItem);
          item.parent = this.content;
          item.x = 0;
          item.active = true;
          //icon todo
          GlobalUtil.setSpriteIcon(this.node, item.getChildByName('icon'), `common/texture/bingying/stone/${cfg.type}`);
          item.getChildByName('desc').getComponent(cc.RichText).string = `${GlobalUtil.getSkillCfg(cfg.unique[0]).des}`;
          item.height = item.getChildByName('desc').height + 10;
        }
      });
    }
  }

  _updateResearchProgress() {
    let maxT = ConfigManager.getItemByField(Tech_globalCfg, 'key', 'research_limit').value[0] * 3;
    let hours = 0;
    for (let key in this.byModel.techResearchMap) {
      let info = this.byModel.techResearchMap[key];
      if (info && info.type !== 2 && info.startTime) {
        hours += Math.floor((GlobalUtil.getServerTime() - info.startTime * 1000) / 1000 / 3600);
      }
    }
    cc.find('progress/bar', this.researchBtn).width = Math.min(84, 84 * (hours / maxT));
  }

  updateResearchRed() {
    return RedPointUtils.has_soldier_tech_research_place() || RedPointUtils.has_soldier_tech_research_rewards();
  }


  updateTechUpgradeRed(type) {
    if (parseInt(type) == -1) return RedPointUtils.is_can_soldier_tech_upgrade(this.curSelectType);
    else return RedPointUtils.is_can_soldier_tech_upgrade(parseInt(type));
  }
}
