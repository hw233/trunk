import ActUtil from '../../act/util/ActUtil';
import AdventureModel from '../model/AdventureModel';
import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroDetailViewCtrl from '../../lottery/ctrl/HeroDetailViewCtrl';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { ActivityEventId } from '../../act/enum/ActivityEventId';
import { Adventure_themeheroCfg, HeroCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-09 18:28:24 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdventureAccessViewCtrl")
export default class AdventureAccessViewCtrl extends gdk.BasePanel {
  @property(cc.Label)
  timeLab: cc.Label = null;

  @property(cc.Node)
  lvFrame: cc.Node = null;

  @property(sp.Skeleton)
  frameSp: sp.Skeleton = null;

  @property([cc.Node])
  herosNode: cc.Node[] = [];

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  slotPrefab: cc.Prefab = null;

  @property(cc.Node)
  lvTips: cc.Node = null;

  get adModel(): AdventureModel { return ModelManager.get(AdventureModel); }
  frameSpUrl = ['spine/ui/UI_adv_access_red/UI_huodongrukouhong', 'spine/ui/UI_adv_access_blue/UI_huodongrukoulan', 'spine/ui/UI_adv_access_green/UI_huodongrukoulv']
  actId: number = 53;
  nextUnlockCfg: Adventure_themeheroCfg;
  _nextLvTime: number;
  get nextLvTime() { return this._nextLvTime; }
  set nextLvTime(v: number) {
    if (!v && v !== 0) {
      return;
    }
    this._nextLvTime = Math.max(0, v);
    if (this._nextLvTime == 0) {
      this._updateNextLvTips();
    }
    else {
      this.lvTips.active = true;
      let timeLab = this.lvTips.getChildByName('lockLab').getComponent(cc.Label);
      let lvLab = this.lvTips.getChildByName('levelLab').getComponent(cc.Label);
      timeLab.string = TimerUtils.format1(this._nextLvTime / 1000) + `${gdk.i18n.t("i18n:ADVENTURE_TIP1")}`;
      lvLab.string = this.nextUnlockCfg.difficulty_name;
    }
  }

  onEnable() {
    let cfg = ActUtil.getCfgByActId(this.actId);
    if (!cfg) {
      this.timeLab.string = `${gdk.i18n.t("i18n:ADVENTURE_TIP2")}`;
      gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
    }
    else {
      let startTime = new Date(ActUtil.getActStartTime(this.actId));
      let endTime = new Date(ActUtil.getActEndTime(this.actId) - 5000); //time为零点,减去5s 返回前一天
      this.timeLab.string = `${gdk.i18n.t("i18n:ADVENTURE_TIP3")}${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
      this._updateView();
    }
  }

  onDisable() {
  }

  onGoBtnClick() {
    let cfg = ActUtil.getCfgByActId(this.actId);
    if (!cfg) {
      this.timeLab.string = `${gdk.i18n.t("i18n:ADVENTURE_TIP2")}`;
      gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
      return;
    }
    gdk.panel.hide(PanelId.ActivityMainView);
    gdk.panel.open(PanelId.AdventureMainView);
  }

  _dtime: number = 0;
  update(dt: number) {
    if (!this._nextLvTime && !this.nextUnlockCfg) {
      return;
    }
    if (this._dtime >= 1) {
      this._dtime = 0;
      this._updateNextLvTips();
    }
    else {
      this._dtime += dt;
    }
  }

  @gdk.binding('adModel.difficulty')
  _updateView() {
    let actCfg = ActUtil.getCfgByActId(this.actId);
    if (!actCfg) {
      this.timeLab.string = `${gdk.i18n.t("i18n:ADVENTURE_TIP2")}`;
      gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
    }
    else {
      let curLvCfg = ConfigManager.getItemByField(Adventure_themeheroCfg, 'type', actCfg.reward_type, { difficulty: this.adModel.difficulty });
      GlobalUtil.setSpriteIcon(this.node, this.lvFrame, `view/adventure/texture/bg/${curLvCfg.background}`);
      GlobalUtil.setSpineData(this.node, this.frameSp, this.frameSpUrl[curLvCfg.type - 1], true, 'stand', true, false);
      //hero
      let heroStrs = curLvCfg.theme_hero.split('|');
      this.herosNode.forEach((node, idx) => {
        let str = heroStrs[idx];
        if (str) {
          node.active = true;
          let id = str.split(';')[0];
          let spine = node.getChildByName('spine').getComponent(sp.Skeleton);
          // let desc = node.getChildByName('desc').getComponent(cc.RichText);
          let previewBtn = node.getChildByName('yulan').getComponent(cc.Button);
          let heroCfg = ConfigManager.getItemById(HeroCfg, parseInt(id));
          HeroUtils.setSpineData(this.node, spine, heroCfg.skin, true, false);
          // desc.string = str.split(';')[1];
          previewBtn.clickEvents = [];
          let e = new cc.Component.EventHandler();
          e.component = 'AdventureAccessViewCtrl';
          e.handler = 'showHero';
          e.customEventData = id;
          e.target = this.node;
          previewBtn.clickEvents[0] = e;
        }
        else {
          node.active = false;
        }
      });
      //reward
      this.content.removeAllChildren();
      curLvCfg.activity_rewards.forEach(item => {
        let slot = cc.instantiate(this.slotPrefab);
        let ctrl = slot.getComponent(UiSlotItem);
        slot.parent = this.content;
        ctrl.updateItemInfo(item[0], item[1]);
        ctrl.itemInfo = {
          series: null,
          itemId: item[0],
          itemNum: item[1],
          type: BagUtils.getItemTypeById(item[0]),
          extInfo: null
        }
      });
      if (curLvCfg.activity_rewards.length <= 5) {
        this.scrollView.enabled = false;
        this.content.setPosition(0, 0);
      }
      else {
        this.scrollView.enabled = true;
      }
      //nextLv
      this._updateNextLvTips();
    }
  }

  _updateNextLvTips() {
    let actCfg = ActUtil.getCfgByActId(this.actId);
    if (!actCfg) return;
    let cfgs = ConfigManager.getItemsByField(Adventure_themeheroCfg, 'type', actCfg.reward_type);
    let startTime = ActUtil.getActStartTime(this.actId);
    let curTime = GlobalUtil.getServerTime();
    for (let i = 0; i < cfgs.length; i++) {
      let time = cfgs[i].unlocktime;
      let unLockTime = startTime + (time[2] * 24 * 60 * 60 + time[3] * 60 * 60 + time[4] * 60) * 1000;
      if (unLockTime > curTime) {
        this.nextUnlockCfg = cfgs[i];
        this.nextLvTime = unLockTime - curTime;
        return;
      }
    }
    this.nextUnlockCfg = null;
    this.nextLvTime = null;
    this.lvTips.active = false;
  }

  showHero(e, id: string) {
    let heroCfg = ConfigManager.getItemById(HeroCfg, parseInt(id));
    gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
      let comp = node.getComponent(HeroDetailViewCtrl)
      comp.initHeroInfo(heroCfg)
    })
  }
}
