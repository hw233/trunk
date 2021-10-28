import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import PiecesModel from '../../../../../common/models/PiecesModel';
import SkillInfoPanelCtrl from '../../../../role/ctrl2/main/skill/SkillInfoPanelCtrl';
import {
  Hero_careerCfg,
  HeroCfg,
  Pieces_heroCfg,
  Pieces_starCfg,
  SkillCfg
  } from '../../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-01 10:34:43 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesDetailSkillCtrl")
export default class PvePiecesDetailSkillCtrl extends gdk.BasePanel {

  @property(cc.Node)
  skillNodes: cc.Node[] = [];

  @property(cc.Label)
  nameLabel: cc.Label = null;

  @property(cc.Sprite)
  skillIcon: cc.Sprite = null;

  @property(cc.RichText)
  descText: cc.RichText = null;

  @property(cc.Node)
  careerNode: cc.Node = null;

  @property(cc.Node)
  careerNodeBg: cc.Node = null;

  @property(cc.Node)
  careerItems: cc.Node[] = [];

  _curType: number = 0 //0 塔防 1 卡牌
  _heroCfg: Pieces_heroCfg
  _skillIds = []
  _careerLines = []
  _lineIndex: number = 0
  _heroInfo: icmsg.PiecesHero;

  get model() { return ModelManager.get(HeroModel); }
  get piecesModel() { return ModelManager.get(PiecesModel); }
  onEnable() {
  }

  updateView(heroInfo: icmsg.PiecesHero) {
    this._heroInfo = heroInfo;
    this._heroCfg = ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', heroInfo.typeId);

    this._lineIndex = ConfigManager.getItemByField(Hero_careerCfg, 'hero_id', this._heroInfo.typeId, { career_id: this._heroInfo.line }).line;
    this._updateGiftInfo()
    this._updateSkillInfo()
  }


  _updateSkillInfo() {
    this._careerLines = [...ModelManager.get(HeroModel).careerInfos[this._heroCfg.hero_id]];
    GlobalUtil.sortArray(this._careerLines, (a, b) => {
      return a - b
    })
    this.careerNode.active = this._careerLines.length > 1;
    this._skillIds = this._getShowSkills(this._careerLines[this._lineIndex], this._curType == 1)
    for (let i = 0; i < this.skillNodes.length; i++) {
      let item = this.skillNodes[i]
      item.active = false
      if (this._skillIds[i]) {
        item.active = true
        let icon = item.getChildByName("icon")
        GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getSkillIcon(this._skillIds[i]))
      }

      //技能确认
      if (i == this.skillNodes.length - 1 && this._careerLines.length == 1) {
        let skillCfg = GlobalUtil.getSkillCfg(this._skillIds[i])
        if (item.active && skillCfg.type != 501) {
          item.active = false
        }
      }
    }

    if (this._careerLines.length > 1) {
      let leftCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this._careerLines[0])
      let rightCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this._careerLines[1])
      if (this._lineIndex == 0) {
        this._updateCareerNode(this.careerItems[0], leftCfg.career_type)
        this._updateCareerNode(this.careerItems[1], rightCfg.career_type, true)
        this.careerNodeBg.scaleX = 1
      } else {
        this._updateCareerNode(this.careerItems[0], leftCfg.career_type, true)
        this._updateCareerNode(this.careerItems[1], rightCfg.career_type)
        this.careerNodeBg.scaleX = -1
      }
    }
  }

  _getShowSkills(careerId, isCardSkill = false) {
    let lineIds = []
    let cfgs = this._getCareerLineSkills(careerId)
    for (let index = 0; index < cfgs.length; index++) {
      const cfg = cfgs[index]
      let ul_skill = cfg.ul_skill
      if (ul_skill && ul_skill.length > 0) {
        lineIds = [...lineIds, ...ul_skill]
      }
    }
    //要显示的技能
    let ids = []
    let superIds = []
    for (let i = 0; i < lineIds.length; i++) {
      let skillCfg = GlobalUtil.getSkillCfg(lineIds[i])
      if (skillCfg.show != 1 && skillCfg.show != 2 && ids.indexOf(lineIds[i]) == -1) {
        if (isCardSkill) {
          if (HeroUtils.isCardSkill(lineIds[i])) {
            if (skillCfg.type == 501) {
              superIds.push(lineIds[i])
            } else {
              ids.push(lineIds[i])
            }
          }
        } else {
          if (!HeroUtils.isCardSkill(lineIds[i])) {
            if (skillCfg.type == 501) {
              superIds.push(lineIds[i])
            } else {
              ids.push(lineIds[i])
            }
          }
        }
      }
    }
    ids.sort((a, b) => {
      return a - b
    })
    return ids.concat(superIds)
  }

  _getCareerLineSkills(careerId: number) {
    let type = Math.floor(careerId / 100);
    let cfgs: Hero_careerCfg[] = [];
    ConfigManager.getItems(Hero_careerCfg, function (cfg: Hero_careerCfg) {
      if (Math.floor(cfg.career_id / 100) == type) {
        if (cfg.ul_skill.length > 0) {
          cfgs.push(cfg);
        }
      }
      return false;
    })
    return cfgs;
  }

  _updateGiftInfo() {
    let starcfg = ConfigManager.getItemByField(Pieces_starCfg, "star", this._heroInfo.star);
    let heroCfg = ConfigManager.getItemById(HeroCfg, this._heroInfo.typeId);
    let skillCfg;
    let skillName;
    if (this._curType == 0) {
      skillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", heroCfg.gift_tower_id, { level: starcfg.gift_lv }) as SkillCfg;
      if (!skillCfg) {
        skillCfg = ConfigManager.getItemByField(SkillCfg, "skill_id", heroCfg.gift_tower_id);
      }
      skillName = `${skillCfg.name}`;
    }
    this.nameLabel.string = skillName;
    this.descText.string = "";
    this.descText.string = `${skillCfg.des}`;
    GlobalUtil.setSpriteIcon(this.node, this.skillIcon, GlobalUtil.getSkillIcon(skillCfg.skill_id))
  }

  onShowSkillTip(e, index) {
    gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
      let comp = node.getComponent(SkillInfoPanelCtrl);
      comp.showSkillInfo(this._skillIds[index]);
    });
  }

  onSwitchCareer() {

    if (this._careerLines.length > 1) {
      //发送切换职业消息
      // let msg = new icmsg.PiecesHeroChangeLineReq()
      // msg.id = this._heroInfo.heroId;
      // NetManager.send(msg, (rsp: icmsg.PiecesHeroChangeLineRsp) => {
      //   //刷新数据;
      //   // this.peakModel.bookSelectCareerId = this._careerLines[this._lineIndex]
      //   this._lineIndex = 1 - this._lineIndex;
      //   this._updateGiftInfo()
      //   this._updateSkillInfo()
      // }, this)
      gdk.panel.setArgs(PanelId.PvePiecesChageCareerView, this._heroInfo);
      gdk.panel.open(PanelId.PvePiecesChageCareerView);
    }
  }

  _updateCareerNode(node: cc.Node, careerType: number, isGray: boolean = false) {
    let icon = node.getChildByName("icon");
    icon.scale = 0.9;
    let nameArr = ["yx_chengse", "yx_chengse", "yx_lanse", "yx_lvse"]
    let path = `common/texture/soldier/${nameArr[careerType - 1]}`;
    GlobalUtil.setSpriteIcon(this.node, icon, path);
    GlobalUtil.setGrayState(icon, isGray ? 1 : 0)
  }
}
