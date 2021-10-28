import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import ResonatingModel from '../model/ResonatingModel';
import StringUtils from '../../../common/utils/StringUtils';
import { AttrCfg, Hero_trammelCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-06 13:44:39 
  */
const { ccclass, property, menu } = cc._decorator;

const assistAllianceAttrKey = [
  "atk_g", "hp_g", "def_g", "hit_g", "dodge_g", "dmg_add", "dmg_res", "atk_dmg",
  "atk_res", "power_dmg", "power_res", "dmg_fire", "dmg_cold",
  "dmg_elec", "dmg_radi", "dmg_punc", "atk_speed_r", "crit_v"
]

/**抗性**/
const resistanceAttrKey = [
  "fire_res", "cold_res", "elec_res", "radi_res", "punc_res"
]

@ccclass
@menu("qszc/view/resonating/AssistAllianceAttrItemCtrl")
export default class AssistAllianceAttrItemCtrl extends cc.Component {
  @property(cc.Node)
  flag: cc.Node = null;

  @property(cc.Node)
  activeBtn: cc.Node = null;

  @property(cc.RichText)
  conditionDesc: cc.RichText = null;

  @property(cc.Label)
  fullNum: cc.Label = null;

  @property(cc.RichText)
  attrLab: cc.RichText = null;

  cfg: Hero_trammelCfg;
  info: icmsg.AssistAlliance;
  get model(): ResonatingModel { return ModelManager.get(ResonatingModel); }
  onEnable() {
    // NetManager.on(icmsg.AssistAllianceOnRsp.MsgType, (resp: icmsg.AssistAllianceOnRsp) => {
    //   if (!cc.isValid(this.node)) return;
    //   if (!this.node.activeInHierarchy) return;
    //   if (!this.cfg) return;
    //   if (resp.assistAlliance.allianceId == this.cfg.trammel_id) {
    //     this.updateView(this.cfg);
    //   }
    // }, this);
  }

  onDisable() {
    NetManager.targetOff(this);
  }

  updateView(cfg: Hero_trammelCfg) {
    this.cfg = cfg;
    this.info = this.model.assistAllianceInfos[cfg.trammel_id];
    let upHeroIds = this.info ? this.info.heroIds : [];
    let totalStar = 0;
    let upNum = 0;
    upHeroIds.forEach(id => {
      let i = HeroUtils.getHeroInfoByHeroId(id);
      if (i) {
        upNum += 1;
        totalStar += i.star;
      }
    });
    this.flag.active = this.info && this.info.activeStar == this.cfg.star_lv;
    this.activeBtn.active = !this.flag.active && (upNum >= this.cfg.trammel_hero.length && totalStar >= this.cfg.star_lv);
    let color = BagUtils.getColorInfo(this.cfg.star_colour).color;
    this.conditionDesc.string = StringUtils.format(gdk.i18n.t('i18n:SUPPORT_TIPS5'), this.cfg.trammel_hero.length, color, this.cfg.star_lv, totalStar, this.cfg.star_lv);
    this.fullNum.node.active = this.node.getSiblingIndex() <= 0;
    this.fullNum.string = `(${upNum}/${this.cfg.trammel_hero.length})`;

    //attr
    let str = '';
    let n = 0;
    let atrNameColor = this.flag.active ? '#00FF00' : '#88735C';
    assistAllianceAttrKey.forEach((key, idx) => {
      let v = this.cfg[key];
      if (!!v) {
        let attrCfg = ConfigManager.getItemByField(AttrCfg, 'id', key);
        str += `<outline color=#281B16 width=2><color=${atrNameColor}>${attrCfg.name}+<color=#c57724>${attrCfg.type == 'g' ? Math.floor(v) : `${Math.floor(v / 100)}%`}</c></c></outline> `;
        n += 1;
        if (n == 3 && idx !== assistAllianceAttrKey.length - 1) {
          n = 0;
          str += '<br/>';
        }
      }
    });
    for (let i = 0; i < resistanceAttrKey.length; i++) {
      let v = this.cfg[resistanceAttrKey[i]];
      if (!!v) {
        n == 3 && (str += '<br/>');
        str += `<outline color=#281B16 width=2><color=${atrNameColor}>${gdk.i18n.t('i18n:SUPPORT_TIPS6')}+<color=#c57724>${Math.floor(v / 100)}%</c></c></outline> `;
        break;
      }
    }
    if (str.endsWith('<br/>')) {
      str = str.slice(0, str.length - '<br/>'.length);
    }
    this.attrLab.string = str;
  }

  onActiveBtnClick() {
    let req = new icmsg.AssistAllianceActivateReq();
    req.allianceId = this.cfg.trammel_id;
    NetManager.send(req, null, this);
  }
}
