import ButtonSoundId from '../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../common/managers/ConfigManager';
import GeneralModel from '../../../common/models/GeneralModel';
import GeneralWeaponTaskPanelCtrl from './GeneralWeaponTaskPanelCtrl';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import { General_weaponCfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-19 16:35:16 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/general/GeneralWeaponGetViewCtrl')
export default class GeneralWeaponGetViewCtrl extends gdk.BasePanel {
  @property(cc.Node)
  bgNode: cc.Node = null;

  @property(cc.Node)
  iconNode: cc.Node = null;

  @property(sp.Skeleton)
  spine1: sp.Skeleton = null;

  @property(sp.Skeleton)
  spine2: sp.Skeleton = null;

  @property(cc.Node)
  skillNode: cc.Node = null;

  cfg: General_weaponCfg;
  // sysCfg: SystemCfg;
  onEnable() {
    let weaponId = this.args[0];
    this.cfg = ConfigManager.getItemById(General_weaponCfg, weaponId);
    this.bgNode.active = true;
    this.iconNode.active = false;
    this.skillNode.active = false;
    this.iconNode.getChildByName('iconText').active = true;
    let icon = this.iconNode.getChildByName('icon');
    let iconText = this.iconNode.getChildByName('iconText');
    iconText.getComponent(cc.Label).string = this.cfg.name;
    GlobalUtil.setSpriteIcon(this.node, icon, `icon/item/${this.cfg.icon}`);
    this.spine1.setCompleteListener(() => {
      this.spine1.setCompleteListener(null);
      this.spine1.setAnimation(0, 'stand2', true);
    });
    this.spine2.setCompleteListener(() => {
      this.spine2.setCompleteListener(null);
      this.spine2.setAnimation(0, 'stand4', true);
      this.skillNode.active = true;
      this._updateSkillInfo();
      gdk.Timer.once(1000, this, this.flyIcon);
    });

    this.spine2.node.active = true;
    this.spine1.setAnimation(0, 'stand', true);
    this.spine2.setAnimation(0, 'stand3', true);
    gdk.Timer.once(550, this, () => {
      this.iconNode.active = true;
      this.iconNode.setScale(1);
      iconText.active = true;
      let action = cc.sequence(
        cc.scaleTo(.4, 1.1, 1.1),
        cc.scaleTo(.4, 1, 1)
      );
      this.iconNode.runAction(cc.repeat(action, 2))
    })

    if (GlobalUtil.isSoundOn) {
      gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.system);
    }

    this.node.once(cc.Node.EventType.TOUCH_START, this.onClick, this, true);
  }

  onDisable() {
    ModelManager.get(GeneralModel).newWeapon = null;
    gdk.Timer.clearAll(this);
    this.node.targetOff(this);
    this.iconNode.stopAllActions();
    this.spine1.setCompleteListener(null);
    this.spine2.setCompleteListener(null);
  }

  onClick() {
    // gdk.Timer.clearAll(this);
    // this.iconNode.stopAllActions();
    // this.iconNode.active = true;
    // this.iconNode.setScale(1);
    // this.spine2.node.active = true;
    // this.spine1.setCompleteListener(null);
    // this.spine1.setAnimation(0, 'stand2', true);
    // this.spine2.setCompleteListener(null);
    // this.spine2.setAnimation(0, 'stand4', true);
    // this.flyIcon();
  }

  // 功能图标飞动
  flyIcon() {
    this.bgNode.active = false;
    this.spine2.node.active = false;
    this.skillNode.active = false;
    // 设置图标状态
    let icon = this.iconNode.getChildByName('icon');
    let iconText = this.iconNode.getChildByName('iconText');
    iconText.active = false;
    //pos
    let panel = gdk.panel.get(PanelId.GeneralWeaponTask);
    if (panel) {
      let ctrl = panel.getComponent(GeneralWeaponTaskPanelCtrl);
      let targetNode = cc.find('bottomView/weaponListBtn', ctrl.node);
      let worldPos = targetNode.parent.convertToWorldSpaceAR(targetNode.position);
      let pos: cc.Vec2 = icon.parent.convertToNodeSpaceAR(worldPos);
      icon.runAction(cc.sequence(
        cc.spawn(
          cc.moveTo(0.5, pos.x, pos.y),
          cc.scaleTo(.5, .7, .7),
          cc.fadeTo(.5, 125),
        ),
        // cc.delayTime(.3),
        cc.callFunc(this.close, this),
      ));
    }
    else {
      this.close();
    }
  }

  _updateSkillInfo() {
    //skill
    let weaponCfg = this.cfg;
    let color = weaponCfg.quality;
    let weaponIconBg = this.skillNode.getChildByName('skillBg');
    let weaponIcon = this.skillNode.getChildByName('skillIcon');
    let skillName = this.skillNode.getChildByName('skillName').getComponent(cc.Label);
    let skillDesc = cc.find('scrollview/desc', this.skillNode).getComponent(cc.RichText);
    GlobalUtil.setSpriteIcon(this.node, weaponIconBg, `common/texture/sub_itembg0${color}`)
    GlobalUtil.setSpriteIcon(this.node, weaponIcon, `icon/item/${weaponCfg.icon}`)
    let skillCfg = GlobalUtil.getSkillCfg(weaponCfg.skill);
    skillName.string = skillCfg.name;
    skillDesc.string = skillCfg.des;
  }
}
