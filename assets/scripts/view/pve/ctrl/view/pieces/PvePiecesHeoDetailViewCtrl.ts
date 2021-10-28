import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GroupItemCtrl from '../../../../role/ctrl2/main/camp/GroupItemCtrl';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import PiecesModel from '../../../../../common/models/PiecesModel';
import PvePiecesDetailSkillCtrl from './PvePiecesDetailSkillCtrl';
import StringUtils from '../../../../../common/utils/StringUtils';
import { Hero_careerCfg, Pieces_heroCfg } from '../../../../../a/config';
import { PiecesEventId } from '../../../../pieces/enum/PiecesEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-01 10:34:00 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesHeoDetailViewCtrl")
export default class PvePiecesHeoDetailViewCtrl extends gdk.BasePanel {

  @property(cc.Node)
  bg: cc.Node = null;

  @property(cc.Label)
  heroNameLab: cc.Label = null;

  @property(cc.Label)
  starLabel: cc.Label = null;

  @property(sp.Skeleton)
  spine: sp.Skeleton = null;

  @property(cc.Node)
  labsNode: cc.Node = null;

  @property(cc.Sprite)
  solIcon: cc.Sprite = null;

  @property(cc.Label)
  fightLab: cc.Label = null;

  @property(cc.Node)
  groupLayout: cc.Node = null // 存放阵营图标的

  @property(cc.Prefab)
  groupItem: cc.Prefab = null;

  @property(cc.Node)
  panelParent: cc.Node = null;

  @property({ type: cc.String })
  _panelNames: string[] = [];

  @property({ type: gdk.PanelId, tooltip: "子界面，如果没可选值，请先配置gdk.PanelId" })
  get panels() {
    let ret = [];
    for (let i = 0; i < this._panelNames.length; i++) {
      ret[i] = gdk.PanelId[this._panelNames[i]] || 0;
    }
    return ret;
  }
  set panels(value) {
    this._panelNames = [];
    for (let i = 0; i < value.length; i++) {
      this._panelNames[i] = gdk.PanelId[value[i]];
    }
  }

  panelIndex: number = -1;    // 当前打开的界面索引
  get model() { return ModelManager.get(HeroModel); }
  get piecesModel() { return ModelManager.get(PiecesModel); }
  bgPath = ["yx_bg04", "yx_bg04", "yx_bg05", "yx_bg"]
  _heroCfg: Pieces_heroCfg
  attLabs: Array<cc.Label> = [];      // 白字属性lab数组
  //extLabs: Array<cc.Label> = [];      // 绿字属性lab数组
  stageLabs: Array<cc.Sprite> = [];    // 评级lab数组

  heroInfo: icmsg.PiecesHero;
  onEnable() {
    // 属性文本
    let labsNode = this.labsNode;
    for (let index = 0; index < 6; index++) {
      let stageLab = labsNode.getChildByName(`stageLab${index + 1}`);
      let attLab = labsNode.getChildByName(`attLab${index + 1}`);
      this.stageLabs[index] = stageLab.getComponent(cc.Sprite);
      this.attLabs[index] = attLab.getComponent(cc.Label);
    }
    gdk.e.on(PiecesEventId.PIECES_PVP_CAREER_CHANGE, this._onCareerChange, this);
  }

  onDestroy() {
    gdk.e.targetOff(this);
    NetManager.targetOff(this)
  }

  _onCareerChange(e: gdk.Event) {
    let typeId = e.data;
    if (typeId == this.heroInfo.typeId) {
      this.heroInfo = this.piecesModel.heroMap[this.heroInfo.heroId];
      this.initHeroInfo(this.heroInfo);
    }
  }

  checkArgs() {
    // 打开新的子界面
    let panelId = gdk.PanelId.getValue(this._panelNames[0]);
    if (panelId) {
      gdk.panel.open(
        panelId,
        (node: cc.Node) => {
          if (panelId.__id__ == PanelId.PvePiecesHeroDetailSkill.__id__) {
            let ctrl = node.getComponent(PvePiecesDetailSkillCtrl)
            ctrl.updateView(this.heroInfo)
          }
        },
        this,
        {
          parent: this.panelParent
        },
      );
    }
  }

  initHeroInfo(heroInfo: icmsg.PiecesHero) {
    this.heroInfo = heroInfo;
    this._heroCfg = ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', heroInfo.typeId);

    this.checkArgs()
    this._updateUpInfo()
    this._updateAttr()
    this._updateGroupInfo()
  }

  _updateUpInfo() {
    this.heroNameLab.string = this._heroCfg.hero_name;
    this.heroNameLab.node.color = cc.color(GlobalUtil.getHeroNameColor(this._heroCfg.color))
    let laboutline = this.heroNameLab.getComponent(cc.LabelOutline)
    laboutline.color = cc.color(GlobalUtil.getHeroNameColor(this._heroCfg.color, true))
    let url = StringUtils.format("spine/hero/{0}/1/{0}", HeroUtils.getHeroSkin(this.heroInfo.typeId, this.heroInfo.star));
    GlobalUtil.setSpineData(this.node, this.spine, url, false, 'stand', true, false);


    let bgPath = ["yx_bg04", "yx_bg05", "yx_bg"]
    let idx = 0;
    if (this.heroInfo.star >= 5) idx = 2;
    else if (this.heroInfo.star > 3) idx = 1;
    else idx = 0;
    GlobalUtil.setSpriteIcon(this.node, this.bg, `view/role/texture/bg/${bgPath[idx]}`)
    this._updateStar();
  }

  /**更新星星 */
  _updateStar() {
    let starTxt = "";
    starTxt = this.heroInfo.star > 5 ? '2'.repeat(this.heroInfo.star - 5) : '1'.repeat(this.heroInfo.star);
    this.starLabel.string = starTxt;
  }

  _updateAttr() {
    if (!this.heroInfo || !this._heroCfg) {
      return
    }
    // 更新英雄属性等级
    let attIconName = ["hp", "speed", "atk", "def", "hit", "dodge"];
    for (let index = 0; index < this.stageLabs.length; index++) {
      const lab = this.stageLabs[index];
      let show = "A";
      let name = attIconName[index];
      if (index <= 3) {
        GlobalUtil.setSpriteIcon(this.node, lab, `view/role/texture/common2/yx_${name}_${show}`);
      }
    }

    let nameArr = ["yx_chengse", "yx_chengse", "yx_lanse", "yx_lvse"]
    GlobalUtil.setSpriteIcon(this.node, this.solIcon, `common/texture/soldier/${nameArr[ConfigManager.getItemByField(Hero_careerCfg, 'hero_id', this.heroInfo.typeId, { career_id: this.heroInfo.line }).career_type - 1]}`);
    this._getHeroAttr()
  }

  _getHeroAttr() {
    let msg = new icmsg.PiecesFightQueryReq()
    msg.heroId = this.heroInfo.heroId;
    NetManager.send(msg, (rsp: icmsg.PiecesFightQueryRsp) => {
      //刷新数据
      // 0 生命 1 攻速 2 攻击 3防御
      this.attLabs[0].string = rsp.hero.attr.hp + ''//`${Math.floor(hbAttrBase.hp_w)}`
      this.attLabs[1].string = this._heroCfg.atk_speed + ''
      this.attLabs[2].string = rsp.hero.attr.atk + ''//`${Math.floor(hbAttrBase.atk_w)}`
      this.attLabs[3].string = rsp.hero.attr.def + ''//`${Math.floor(hbAttrBase.def_w)}`

      this.fightLab.string = this.piecesModel.heroMap[this.heroInfo.heroId].power + ''//`${GlobalUtil.getPowerValue(hbAttrBase)}`
    }, this)
  }

  /**更新阵营图标 */
  _updateGroupInfo() {
    if (this._heroCfg) {
      let hero = this._heroCfg
      if (hero.group && hero.group.length > 0) {
        this.groupLayout.removeAllChildren()
        for (let index = 0; index < hero.group.length; index++) {
          let item = cc.instantiate(this.groupItem)
          item.active = false
          this.groupLayout.addChild(item)
        }
        for (let i = 0; i < hero.group.length; i++) {
          let item = this.groupLayout.children[i]
          item.active = true;
          let ctrl = item.getComponent(GroupItemCtrl)
          ctrl.setGruopDate(hero.group[i], hero.id)
        }
      }
    }
  }
}
