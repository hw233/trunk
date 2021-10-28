import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import NetManager from '../../../../common/managers/NetManager';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import {
  Hero_careerCfg,
  HeroCfg,
  Tech_globalCfg,
  Tech_researchCfg
  } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-15 10:57:37 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/tech/BYResearchHeroConfirmCtrl")
export default class BYResearchHeroConfirmCtrl extends gdk.BasePanel {
  @property(UiSlotItem)
  slot: UiSlotItem = null;

  @property(cc.Label)
  nameLab: cc.Label = null;

  @property(cc.RichText)
  tipsLab: cc.RichText = null;

  curCareerType: number;
  heroInfo: icmsg.HeroInfo;
  onEnable() {
    [this.curCareerType, this.heroInfo] = this.args[0];
    let heroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
    this.slot.starNum = this.heroInfo.star;
    this.slot.career = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', this.heroInfo.careerId).career_type;
    this.slot.group = heroCfg.group[0];
    this.slot.updateItemInfo(this.heroInfo.typeId);
    this.nameLab.string = heroCfg.name;
    let researchCfg = ConfigManager.getItemByField(Tech_researchCfg, 'type', this.curCareerType, { star: this.heroInfo.star });
    let maxT = ConfigManager.getItemByField(Tech_globalCfg, 'key', 'research_limit').value[0];
    this.tipsLab.string = StringUtils.format(gdk.i18n.t('i18n:BINGYING_TIP12'), heroCfg.name, maxT, BagUtils.getConfigById(researchCfg.item).name, maxT * researchCfg.output);
  }

  onDisable() {
  }

  onCancelBtnClick() {
    this.close();
  }

  onConfirmBtnClick() {
    let req = new icmsg.SoldierTechDoResearchReq();
    req.type = this.curCareerType;
    req.heroId = this.heroInfo.heroId;
    NetManager.send(req);
    this.close();
  }
}
