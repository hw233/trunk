import ConfigManager from '../../../common/managers/ConfigManager';
import GeneralModel from '../../../common/models/GeneralModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PveGeneralModel from '../../pve/model/PveGeneralModel';
import StringUtils from '../../../common/utils/StringUtils';
import { General_weaponCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-19 10:26:39 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/general/GeneralWeaponViewCtrl')
export default class GeneralWeaponViewCtrl extends gdk.BasePanel {
  @property(sp.Skeleton)
  spine: sp.Skeleton = null;

  @property(sp.Skeleton)
  bgSpine: sp.Skeleton = null;

  @property(cc.Node)
  chatNode: cc.Node = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  get generalModel() { return ModelManager.get(GeneralModel); }

  list: ListView;
  onEnable() {
    this.chatNode.opacity = 0;
    this.bgSpine.node.active = false;
    this._initCommanderSpine();
    this._updateView();
  }

  onDisable() {
    this.firstOpen = true;
    this.chatNode.stopAllActions();
    gdk.Timer.clearAll(this);
  }

  firstOpen: boolean = true;
  @gdk.binding("generalModel.curUseWeapon")
  _updateWeapon() {
    if (this.firstOpen) {
      this.firstOpen = false;
      return;
    }
    let curWeaponId = this.generalModel.curUseWeapon;
    //TODO
    if (curWeaponId) {
      this.commanderAni();
    }
  }

  _initList() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.itemPrefab,
        cb_host: this,
        gap_y: 15,
        async: true,
        direction: ListViewDir.Vertical,
      })
    }
  }

  _updateView() {
    if (!this.list) this._initList();
    let cfgs = ConfigManager.getItems(General_weaponCfg, (cfg: General_weaponCfg) => {
      if (cfg.show && cfg.show == 1) return true;
    });
    cfgs.sort((a, b) => { return a.sorting - b.sorting; });
    this.list.clear_items();
    this.list.set_data(cfgs);
    gdk.Timer.callLater(this, () => {
      if (!cc.isValid(this.node)) return;
      for (let i = 0; i < cfgs.length; i++) {
        if (cfgs[i].artifactid == this.generalModel.curUseWeapon) {
          this.list.scroll_to(i);
          return;
        }
      }
    });
  }

  _initCommanderSpine(cb?: Function) {
    let spineName = ModelManager.get(PveGeneralModel).skin;
    // if (this.generalModel.newWeapon) {
    //   this.generalModel.newWeapon = null;
    //   spineName = GeneralUtils.getSkinByWeaponId(this.generalModel.preUseWeapon);
    // }
    let url = StringUtils.format("spine/hero/{0}/0.5/{0}", spineName);
    GlobalUtil.setSpineData(this.node, this.spine, url, true, "stand_s", true, true, () => {
      cb && cb();
    });
  }

  commanderAni() {
    let curWeaponId = this.generalModel.curUseWeapon;
    let cfg;
    if (curWeaponId) {
      cfg = ConfigManager.getItemById(General_weaponCfg, curWeaponId);
    }
    if (cfg) {
      this._initCommanderSpine(() => {
        this.bgSpine.node.active = true;
        //-------commanderSpine-------//
        this.spine.setCompleteListener(() => {
          this.spine.setCompleteListener(null)
          this.spine.setAnimation(0, "stand_s", true)
        })
        this.spine.setAnimation(0, "atk_s", true)
        //--------chat----------//
        this.chatNode.getChildByName('label').getComponent(cc.RichText).string = cfg.content;
        this.chatNode.getComponent(cc.Layout).updateLayout();
        this.chatNode.opacity = 0;
        this.chatNode.stopAllActions();
        this.chatNode.runAction(cc.fadeIn(.5));
        gdk.Timer.once(2000, this, this._hide);
      });
    }
  }

  _hide() {
    cc.isValid(this.node) && this.chatNode.runAction(cc.sequence(
      cc.fadeOut(.25),
      cc.callFunc(() => {
        this.bgSpine.node.active = false;
        gdk.Timer.clearAll(this);
      })
    ))
  }
}

