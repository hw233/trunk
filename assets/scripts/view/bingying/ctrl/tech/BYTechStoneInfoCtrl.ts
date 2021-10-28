import BagUtils from '../../../../common/utils/BagUtils';
import BYModel, { EnergyStoneInfo } from '../../model/BYModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Tech_stoneCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-13 15:06:36 
  */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/tech/BYTechStoneInfoCtrl")
export default class BYTechStoneInfoCtrl extends gdk.BasePanel {
  @property(UiSlotItem)
  slot: UiSlotItem = null;

  @property(cc.Node)
  qualityBg: cc.Node = null;

  @property(cc.Label)
  stoneName: cc.Label = null;

  @property(cc.Label)
  power: cc.Label = null;

  @property(cc.Label)
  careerLab: cc.Label = null;

  @property(cc.Node)
  skillNode: cc.Node = null;

  @property(cc.RichText)
  desc: cc.RichText = null;

  @property(cc.Node)
  attrNode: cc.Node = null;

  @property(cc.Node)
  dressBtn: cc.Node = null;

  @property(cc.Node)
  unloadBtn: cc.Node = null;

  @property(cc.Node)
  decomposeBtn: cc.Node = null;

  @property(cc.Node)
  replaceBtn: cc.Node = null;

  info: EnergyStoneInfo;
  targetSlotIdx: number;
  cfg: Tech_stoneCfg;
  onEnable() {
    [this.info, this.targetSlotIdx] = this.args[0];
    this.cfg = ConfigManager.getItemById(Tech_stoneCfg, parseInt(this.info.itemId.toString().slice(0, 7)));
    //btns
    let num = 0;
    this.dressBtn.active = false;
    this.unloadBtn.active = false;
    this.replaceBtn.active = false;
    this.decomposeBtn.active = this.info.slot == -1; //背包中可分解
    if (this.info.slot == -1) num += 1;

    if (gdk.panel.isOpenOrOpening(PanelId.BYTechView)) {
      if (this.info.slot >= 0) {
        this.unloadBtn.active = true;
        num += 1;
        if (!gdk.panel.isOpenOrOpening(PanelId.BYTechStoneSelectView)) {
          this.replaceBtn.active = true;
          num += 1;
        }
      } else if (this.targetSlotIdx > 0) {
        this.dressBtn.active = true;
        num += 1;
      }
    }
    cc.find('sub_tips/btnNode', this.node).height = num >= 1 ? 45 : 0;
    this.updateView();
  }

  onDisable() {
  }

  updateView() {
    this.slot.updateItemInfo(this.cfg.id);
    this.stoneName.string = this.cfg.name;
    let colorInfo = BagUtils.getColorInfo(this.cfg.color);
    this.stoneName.node.color = new cc.Color().fromHEX(colorInfo.color);
    this.stoneName.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline);
    this.power.string = this.cfg.power + '';
    this.desc.string = this.cfg.des;
    this.careerLab.string = ['机枪兵', '', '炮兵', '守卫'][this.cfg.career_type - 1];
    let str = ['baise', 'lvse', 'lanse', 'zise', 'huangse', 'hongse'];
    GlobalUtil.setSpriteIcon(this.node, this.qualityBg, `view/role/texture/bg/zb_${str[this.cfg.color]}`);

    //skillNode
    let skillIcon = cc.find('skill/icon', this.skillNode);
    let skillName = cc.find('skill/name', this.skillNode).getComponent(cc.Label);
    let skillDesc = cc.find('skillDesc/desc', this.skillNode).getComponent(cc.RichText);
    GlobalUtil.setSpriteIcon(this.node, skillIcon, `common/texture/bingying/stone/${this.cfg.type}`);
    let skillCfg = GlobalUtil.getSkillCfg(this.cfg.unique[0]);
    skillName.string = skillCfg.name + ':';
    // skillName.node.color = new cc.Color().fromHEX(BagUtils.getColorInfo(this.cfg.color).color);
    // skillDesc.maxWidth = Math.max(150, 380 - skillName.node.width);
    skillDesc.string = skillCfg.des;

    //attrNode
    let infos = [this.cfg.atk_g, this.cfg.hp_g, this.cfg.def_g];
    this.attrNode.children.forEach((node, idx) => {
      let info = infos[idx];
      if (!info) {
        node.active = false;
      }
      else {
        node.active = true;
        let curLab = node.getChildByName('old').getComponent(cc.Label);
        // let addLab = node.getChildByName('add').getComponent(cc.Label);
        curLab.string = `+${info}`;
      }
    });
  }

  onSkillPreViewBtnClick() {
    gdk.panel.open(PanelId.BYEStoneSkillBookView);
  }

  onUnloadBtnClick() {
    if (this.info.slot < 0) return;
    let req = new icmsg.SoldierTechEquipStoneReq();
    req.type = this.cfg.career_type;
    req.slot = this.info.slot + 1;
    req.itemId = 0;
    NetManager.send(req);
    this.close();
  }

  ondressBtnClick() {
    if (this.targetSlotIdx < 1) return;
    let info = ModelManager.get(BYModel).techMap[this.cfg.career_type];
    if (info && info.slots.indexOf(this.cfg.id) !== -1) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:BINGYING_TIP16'));
      return;
    }
    let req = new icmsg.SoldierTechEquipStoneReq();
    req.type = this.cfg.career_type;
    req.slot = this.targetSlotIdx;
    req.itemId = this.cfg.id;
    NetManager.send(req);
    this.close();
  }

  onReplaceBtnClick() {
    gdk.gui.removeAllPopup();
    gdk.panel.setArgs(PanelId.BYTechStoneSelectView, [this.cfg.career_type, this.targetSlotIdx]);
    gdk.panel.open(PanelId.BYTechStoneSelectView);
  }

  ondecomposeBtnClick() {
    // this.close();
    gdk.gui.removeAllPopup();
    gdk.panel.setArgs(PanelId.HeroResetView, 8);
    gdk.panel.open(PanelId.HeroResetView);
  }
}
