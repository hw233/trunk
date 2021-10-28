import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import PveSceneCtrl from '../../PveSceneCtrl';
import PveSceneState from '../../../enum/PveSceneState';
import SkillInfoPanelCtrl from '../../../../role/ctrl2/main/skill/SkillInfoPanelCtrl';
import { Hero_careerCfg } from '../../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-01 10:36:04 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesChangeCareerItemCtrl")
export default class PvePiecesChangeCareerItemCtrl extends cc.Component {
  @property(cc.Node)
  typeIcon: cc.Node = null

  @property(cc.Label)
  careerLab: cc.Label = null

  @property(cc.Node)
  skillLayer: cc.Node = null

  @property(cc.Node)
  btnNode: cc.Node = null

  @property(cc.Node)
  curCareerState: cc.Node = null

  @property(cc.Prefab)
  skillItem: cc.Prefab = null

  _careerId: number = 0
  _curHeroInfo: icmsg.PiecesHero
  _index = 0

  get heroModel() { return ModelManager.get(HeroModel); }

  updateViewInfo(info: icmsg.PiecesHero, careerId, index) {
    this._curHeroInfo = info
    this._careerId = careerId;
    this._index = index

    let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "hero_id", this._curHeroInfo.typeId, { career_id: this._careerId })
    if (this._curHeroInfo.line == this._careerId) {
      this.btnNode.active = false
      this.curCareerState.active = true
    } else {
      this.btnNode.active = true
      this.curCareerState.active = false
    }

    GlobalUtil.setSpriteIcon(this.node, this.typeIcon, GlobalUtil.getSoldierTypeIcon(careerCfg.career_type))
    this.careerLab.string = `${careerCfg.name}`

    let skills = HeroUtils.getCareerLineSkills(this._careerId, 0)
    for (let i = 0; i < skills.length; i++) {
      let id = skills[i].skillId
      let skillcfg = GlobalUtil.getSkillCfg(id)
      if (skillcfg && (skillcfg.show >= 1 || skillcfg.type == 501)) {
        continue;
      }
      let node = cc.instantiate(this.skillItem)
      this.skillLayer.addChild(node)
      let icon = node.getChildByName("icon");
      GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getSkillIcon(id))
      node.on(cc.Node.EventType.TOUCH_END, () => {
        this._skillIconClick(id)
      }, this)
    }
  }

  changeCareerFunc() {
    if (this._curHeroInfo.line !== this._careerId) {
      this._changeReq()
    }
  }

  _changeReq() {
    let v = gdk.gui.getCurrentView();
    let ctrl = v.getComponent(PveSceneCtrl);
    if (ctrl) {
      if (ctrl.model.state !== PveSceneState.Fight) {
        let msg = new icmsg.PiecesHeroChangeLineReq()
        msg.id = this._curHeroInfo.heroId;
        NetManager.send(msg, (data: icmsg.PiecesHeroChangeLineRsp) => {
          gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_TIP15"))
          gdk.panel.hide(PanelId.PvePiecesChageCareerView)
        })
      }
      else { gdk.gui.showMessage('战斗阶段无法转换路线'); }
    }
  }

  _skillIconClick(id) {
    gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
      node.y = this._index == 0 ? 80 : -110
      let comp = node.getComponent(SkillInfoPanelCtrl)
      comp.showSkillInfo(id)
    })
  }
}
