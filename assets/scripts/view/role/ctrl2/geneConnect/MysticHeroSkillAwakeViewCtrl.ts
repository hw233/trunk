import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import MysticSkillItemCtrl from './MysticSkillItemCtrl';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import {
  Hero_careerCfg,
  Hero_globalCfg,
  Hero_undersand_levelCfg,
  SkillCfg
  } from '../../../../a/config';
import { RoleEventId } from '../../enum/RoleEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-08-17 14:18:03 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-26 13:33:51
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/geneConnect/MysticHeroSkillAwakeViewCtrl")
export default class MysticHeroSkillAwakeViewCtrl extends gdk.BasePanel {
  @property(cc.RichText)
  totalLvLab: cc.RichText = null;

  @property(cc.Node)
  selectTips: cc.Node = null;

  @property([cc.Node])
  skillItems: cc.Node[] = [];

  @property(cc.Node)
  materialsNode: cc.Node = null;

  @property(cc.Button)
  confirmBtn: cc.Button = null;

  @property(cc.Node)
  maxLvTips: cc.Node = null;

  get heroModel(): HeroModel { return ModelManager.get(HeroModel); }

  cfgs: SkillCfg[][] = []; //技能配置
  derect_item: number[] = []; //定向升级道具id
  random_item: number[] = []; //随机升级道具id
  heroInfo: icmsg.HeroInfo;
  curSelect: MysticSkillMaterialsType; //材料选择
  curSelectSkillId: number; //技能选择id
  curSkilllvs: number[] = [];//当前技能等级
  onEnable() {
    this.heroInfo = this.heroModel.curHeroInfo;
    this.curSkilllvs = this.heroInfo.mysticSkills;
    this.derect_item = ConfigManager.getItemByField(Hero_globalCfg, 'key', 'derect_skilllevel_item').value;
    this.random_item = ConfigManager.getItemByField(Hero_globalCfg, 'key', 'random_skilllevel_item').value;
    this._initSkillItems();
    this._updateView();
    gdk.e.on(RoleEventId.MYSTIC_SKILL_MATERIALS_SELECT, this._onMaterialsSelect, this);
  }

  onDisable() {
    gdk.e.targetOff(this);
  }

  onTotalLvBtnClick() {
    let totalLv = this.curSkilllvs[0] + this.curSkilllvs[1] + this.curSkilllvs[2] + this.curSkilllvs[3];
    gdk.panel.setArgs(PanelId.MysticTotalSkillLvView, totalLv);
    gdk.panel.open(PanelId.MysticTotalSkillLvView);
  }

  onConfirmBtnClick() {
    let req = new icmsg.HeroMysticSkillUpReq();
    req.mystic = this.heroInfo.heroId;
    req.heroId = this.curSelect.type == 1 ? this.curSelect.id : 0;
    req.skillId = this.curSelectSkillId ? this.curSelectSkillId : 0;
    NetManager.send(req, (resp: icmsg.HeroMysticSkillUpRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      //todo
      gdk.panel.setArgs(PanelId.MysticSkillUpTips, [this.curSkilllvs, resp.mysticSkills, this.cfgs]);
      gdk.panel.open(PanelId.MysticSkillUpTips);
      this.curSkilllvs = resp.mysticSkills;
      this.curSelect = null;
      this.curSelectSkillId = 0;
      this._initSkillItems();
      this._updateView();
    }, this);
  }

  onMaterialsBtnClick() {
    gdk.panel.setArgs(PanelId.MysticSkillMaterialsSelectView, this.curSelect ? JSON.parse(JSON.stringify(this.curSelect)) : null);
    gdk.panel.open(PanelId.MysticSkillMaterialsSelectView);
  }

  /**技能选择 */
  onSkillSelect(e, type) {
    if (e && this.curSelect && this.derect_item.indexOf(parseInt(this.curSelect.id.toString().slice(0, 6))) !== -1) {
      if (!this.curSelectSkillId || this.curSelectSkillId !== parseInt(type)) {
        let node = this.skillItems[parseInt(type) - 1];
        let ctrl = node.getComponent(MysticSkillItemCtrl);
        if (!ctrl.isMaxLv()) {
          if (this.curSelectSkillId) {
            let preItem = this.skillItems[this.curSelectSkillId - 1];
            let preCtrl = preItem.getComponent(MysticSkillItemCtrl);
            preCtrl.showNextLv(false);
            preCtrl.showSelectFlag(false);
          }
          this.curSelectSkillId = parseInt(type);
          ctrl.showNextLv(true);
          ctrl.showSelectFlag(true);
          this._updateBtn();
        }
      }
    }
  }

  /**材料选择回调 */
  _onMaterialsSelect(e: gdk.Event) {
    if (!e.data) return;
    if (!this.curSelect || this.curSelect.id !== e.data.id || this.curSelect.type !== e.data.type) {
      this.curSelect = e.data;
      let isDerect = this.curSelect.type == 0 && this.derect_item.indexOf(parseInt(this.curSelect.id.toString().slice(0, 6))) !== -1;
      this.curSelectSkillId = 0;
      this._updateView();
      this.skillItems.forEach(item => {
        let ctrl = item.getComponent(MysticSkillItemCtrl);
        ctrl.showNextLv(false);
        ctrl.showSelectFlag(false);
        if (isDerect && !ctrl.isMaxLv()) {
          ctrl.changeBg(0);
        }
        else {
          ctrl.changeBg(1);
        }
      });
    }
  }

  /**初始化配置 */
  _initSkillCfgs() {
    this.cfgs = [];
    let cfgs = this._getCareerLineSkills(this.heroInfo.careerId);
    for (let i = 0; i < cfgs.length; i++) {
      let cfg = cfgs[i];
      for (let skillId of cfg.ul_skill) {
        let skillcfgs = ConfigManager.getItemsByField(SkillCfg, 'skill_id', skillId);
        if (skillcfgs && skillcfgs.length == 5) {
          skillcfgs.sort((a, b) => { return a.level - b.level; });
          this.cfgs.push(skillcfgs);
        }
      }
    }
    this.cfgs.sort((a, b) => { return a[0].skill_id - b[0].skill_id; });
  }

  /**初始化技能 */
  _initSkillItems() {
    if (!this.cfgs || this.cfgs.length <= 0) {
      this._initSkillCfgs();
    }
    this.skillItems.forEach((item, idx) => {
      item.getComponent(MysticSkillItemCtrl).updateView(this.cfgs[idx], this.curSkilllvs[idx]);
    });
  }

  _updateView() {
    let totalLv = this.curSkilllvs[0] + this.curSkilllvs[1] + this.curSkilllvs[2] + this.curSkilllvs[3];
    let c = ConfigManager.getItemByField(Hero_undersand_levelCfg, 'mystery_skill', totalLv);
    this.totalLvLab.string = `当前领悟等级Lv.${c.undersand_level} 英雄全属性+<color=#00ff00>${Math.floor(c.desc / 100)}%</c>`;
    this.selectTips.active = this.curSelect && this.derect_item.indexOf(parseInt(this.curSelect.id.toString().slice(0, 6))) !== -1;
    //materials
    let slot = cc.find('UiSlotItem', this.materialsNode).getComponent(UiSlotItem);
    let num = cc.find('num', this.materialsNode).getComponent(cc.Label);
    slot.node.active = this.curSelect && this.curSelect.id > 0;
    if (slot.node.active) {
      let typeId = this.curSelect.type == 0 ? parseInt(this.curSelect.id.toString().slice(0, 6)) : this.heroInfo.typeId;
      if (this.curSelect.type == 1) {
        let info = HeroUtils.getHeroInfoByHeroId(this.curSelect.id);
        slot.starNum = info.star;
        slot.lv = info.level;
        slot.career = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', info.careerId).career_type;
      }
      slot.updateItemInfo(typeId);
    }
    num.string = this.curSelect && this.curSelect.id > 0 ? '1/1' : '0/1';
    //btn
    this._updateBtn();

    this.materialsNode.active = this.confirmBtn.node.active = totalLv < 20;
    this.maxLvTips.active = totalLv == 20;
  }

  _updateBtn() {
    if (!this.curSelect || !this.curSelect.id || (this.derect_item.indexOf(parseInt(this.curSelect.id.toString().slice(0, 6))) !== -1 && !this.curSelectSkillId)) {
      //1.未选择材料  2.定向升级时未选择技能
      this.confirmBtn.interactable = false;
      GlobalUtil.setAllNodeGray(this.confirmBtn.node, 1);
    }
    else {
      this.confirmBtn.getComponent(cc.Button).interactable = true;
      GlobalUtil.setAllNodeGray(this.confirmBtn.node, 0);
    }
  }

  _getCareerLineSkills(careerId: number) {
    let cfgs: Hero_careerCfg[] = [];
    ConfigManager.getItems(Hero_careerCfg, function (cfg: Hero_careerCfg) {
      if (cfg.career_id == careerId) {
        if (cfg.ul_skill.length > 0) {
          cfgs.push(cfg);
        }
      }
      return false;
    })
    return cfgs;
  }
}

/**神秘者 技能升级 材料类型 */
export type MysticSkillMaterialsType = {
  type: number; //0-消耗材料 1-英雄本体
  id: number; //英雄id or typeId
}
