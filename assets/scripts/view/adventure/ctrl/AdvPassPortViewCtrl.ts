import ActUtil from '../../act/util/ActUtil';
import AdventureModel from '../model/AdventureModel';
import AdventureUtils from '../utils/AdventureUtils';
import AdvPassPortItemCtrl from './AdvPassPortItemCtrl';
import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import { Adventure_passCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { RoleEventId } from '../../role/enum/RoleEventId';
import { StoreEventId } from '../../store/enum/StoreEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-11 10:05:13 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdvPassPortViewCtrl")
export default class AdvPassPortViewCtrl extends gdk.BasePanel {

  @property(cc.Button)
  buyBtn: cc.Button = null;

  @property(cc.Button)
  getExpBtn: cc.Button = null;

  @property(cc.Label)
  expLabel: cc.Label = null;

  @property(cc.Label)
  resetTimeLabel: cc.Label = null;

  @property(cc.ScrollView)
  rewardScrollView: cc.ScrollView = null;

  @property(cc.Node)
  rewardContent: cc.Node = null;

  @property(cc.ScrollView)
  progressScrollView: cc.ScrollView = null;

  @property(cc.Node)
  progressContent: cc.Node = null;

  @property(cc.Node)
  specialItem: cc.Node = null;

  @property(cc.Prefab)
  rewardItemPrefab: cc.Prefab = null;

  get adModel() { return ModelManager.get(AdventureModel); }
  get rModel() { return ModelManager.get(RoleModel); }

  list: ListView = null;
  cfgs: Adventure_passCfg[] = [];
  actId: number = 53;

  _leftTime: number;
  get leftTime(): number { return this._leftTime; }
  set leftTime(v: number) {
    if (!v && v != 0) return;
    v = Math.max(0, v);
    this._leftTime = v;
    this.resetTimeLabel.string = `${gdk.i18n.t("i18n:ADVENTURE_TIP35")}` + TimerUtils.format3(v / 1000);
    if (v == 0) {
      //TODO
      this.adModel.isBuyPassPort = false;
      this.adModel.passPortFreeReward = [];
      this.adModel.passPortChargeReward = [];
      this.rModel.adventureExp = 0;
      // gdk.e.emit(StoreEventId.UPDATE_PASS_PORT);
      gdk.gui.showMessage(`${gdk.i18n.t("i18n:ADVENTURE_TIP36")}`);
      this.close();
    }
  }

  dtime: number = 0;
  update(dt: number) {
    if (this.progressContent.y == 0) this.onTaskScroll();
    if (!this.leftTime || this.leftTime <= 0) return;
    if (this.dtime >= 1) {
      this._initTime();
      this.dtime = 0;
    }
    else {
      this.dtime += dt;
    }
  }

  onEnable() {
    this._initTime();
    gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._onPaySucc, this);
    NetManager.on(icmsg.AdventurePassAwardRsp.MsgType, this._onPassAwardRsp, this);
    gdk.e.on(RoleEventId.ROLE_ATT_UPDATE, this._updateScore, this);
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
    gdk.Timer.clearAll(this);
    NetManager.targetOff(this);
    gdk.e.targetOff(this);
  }

  @gdk.binding('adModel.isBuyPassPort')
  updateView() {
    if (!cc.isValid(this.node)) return;
    let cfg = ActUtil.getCfgByActId(this.actId);
    if (!cfg) return;
    this._initList();
    this.expLabel.string = `${BagUtils.getItemNumById(23)}`;
    let b = this.adModel.isBuyPassPort;
    let url = b ? 'view/store/textrue/passPort/txz_goumaitongxingzheng02' : 'view/adventure/texture/others/txz_goumaitanxianzheng'
    GlobalUtil.setSpriteIcon(this.node, this.buyBtn.node, url);
    this.buyBtn.interactable = !b;
    this.buyBtn.node.getChildByName('spine').active = !b;
  }

  _updateScore(data) {
    let { index, value, oldv, } = data;
    if (index !== 23 || value == oldv) return;
    this.expLabel.string = `${BagUtils.getItemNumById(23)}`;
    this.list.clear_items();
    this.cfgs && this.list.set_data(this.cfgs);
    gdk.Timer.callLater(this, () => {
      let bg = this.progressContent.getChildByName('progressBg');
      bg.height = this.rewardContent.height - 100;
      this._updateProgress();
      this._updateSpecialItem();
    })
  }

  _initTime() {
    let cfg = ActUtil.getCfgByActId(this.actId);
    if (!cfg) return;
    let endTime = ActUtil.getActEndTime(this.actId);
    this.leftTime = endTime - GlobalUtil.getServerTime();
    this.cfgs = ConfigManager.getItemsByField(Adventure_passCfg, 'cycle', cfg.reward_type);
    if (!this.cfgs || this.cfgs.length <= 0) {
      let c = ConfigManager.getItems(Adventure_passCfg);
      this.cfgs = ConfigManager.getItemsByField(Adventure_passCfg, 'cycle', c[c.length - 1].cycle);
    }
  }

  _initList() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
    this.list = new ListView({
      scrollview: this.rewardScrollView,
      mask: this.rewardScrollView.node,
      content: this.rewardContent,
      item_tpl: this.rewardItemPrefab,
      cb_host: this,
      async: true,
      gap_y: 5,
      direction: ListViewDir.Vertical,
    })

    this.list.clear_items();
    this.cfgs && this.list.set_data(this.cfgs);
    gdk.Timer.callLater(this, () => {
      if (!this.list || !cc.isValid(this.node)) return;
      let bg = this.progressContent.getChildByName('progressBg');
      bg.height = this.rewardContent.height - 100;
      this._updateProgress();
      this._updateSpecialItem();
      for (let i = 0; i < this.cfgs.length; i++) {
        let pass = this.rModel.adventureExp;
        if (this.cfgs[i].score[1] <= pass) {
          if (!AdventureUtils.getPassPortRewardState(this.cfgs[i].taskid, 1)) {
            this.list.scroll_to(Math.max(0, i - 1));
            this.onTaskScroll();
            return;
          }
          if (this.adModel.isBuyPassPort && !AdventureUtils.getPassPortRewardState(this.cfgs[i].taskid, 2)) {
            this.list.scroll_to(Math.max(0, i - 1));
            this.onTaskScroll();
            return;
          }
        }
        else {
          this.list.scroll_to(Math.max(0, i - 1));
          this.onTaskScroll();
          return;
        }
      }
    })
  }

  onTaskScroll() {
    this.progressContent.y = this.rewardContent.y - 50;
  }

  _updateProgress() {
    let bg = this.progressContent.getChildByName('progressBg');
    let bar = bg.getChildByName('progressbar');
    bar.height = 0;
    // let dl = bg.height / this.cfgs.length;
    let dl = 126 + 5;
    let pass = this.rModel.adventureExp;
    if (pass < 50) return;
    for (let i = 0; i < this.cfgs.length; i++) {
      if (this.cfgs[i].score[1] <= pass) {
        bar.height += (i == 0 ? 20 : dl);
      }
      else {
        let preScroe = this.cfgs[i - 1] ? this.cfgs[i - 1].score[1] : 0;
        let targetScroe = this.cfgs[i].score[1];
        let ddl = dl / (targetScroe - preScroe);
        bar.height += (ddl * (pass - preScroe));
        return;
      }
    }
    bar.height = Math.min(bg.height, dl * this.rModel.adventureExp);
  }

  _updateSpecialItem() {
    let cfgs: Adventure_passCfg[] = this.cfgs.filter(cfg => {
      return cfg.resident == 1;
    })

    for (let i = 0; i < cfgs.length; i++) {
      if (i != cfgs.length - 1 && AdventureUtils.getPassPortRewardState(cfgs[i].taskid, 1) && AdventureUtils.getPassPortRewardState(cfgs[0].taskid, 2)) continue;
      else {
        let ctrl = this.specialItem.getChildByName('PassPortRewardItem').getComponent(AdvPassPortItemCtrl);
        ctrl.data = cfgs[i];
        ctrl.updateView();
        break;
      }
    }
  }

  // showHeroTip() {
  //   let heroCfg = ConfigManager.getItemById(HeroCfg, 300016);
  //   gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
  //     let comp = node.getComponent(HeroDetailViewCtrl)
  //     comp.initHeroInfo(heroCfg)
  //   })
  // }

  onBuyBtnClick() {
    if (this.adModel.isBuyPassPort) {
      gdk.gui.showMessage(`${gdk.i18n.t("i18n:ADVENTURE_TIP37")}`);
    }
    else {
      gdk.panel.setArgs(PanelId.AdvPassPortBuyView, this.cfgs);
      gdk.panel.open(PanelId.AdvPassPortBuyView);
    }
  }

  _onPaySucc(data: gdk.Event) {
    if (data.data.paymentId == 700008) {
      gdk.gui.showMessage(`${gdk.i18n.t("i18n:ADVENTURE_TIP38")}`);
      GlobalUtil.setSpriteIcon(this.node, this.buyBtn.node, `view/store/textrue/passPort/txz_goumaitongxingzheng02`);
      this.buyBtn.interactable = false;
      this.buyBtn.node.getChildByName('spine').active = false;
      this.list.clear_items();
      this.cfgs && this.list.set_data(this.cfgs);
      gdk.Timer.callLater(this, () => {
        let bg = this.progressContent.getChildByName('progressBg');
        bg.height = this.rewardContent.height - 100;
        this._updateProgress();
        this._updateSpecialItem();
      })
    }
  }

  _onPassAwardRsp(resp: icmsg.AdventurePassAwardRsp) {
    let cfg = ConfigManager.getItem(Adventure_passCfg, (cfg: Adventure_passCfg) => {
      if (cfg.taskid == resp.id && cfg.cycle == this.cfgs[0].cycle) {
        return true;
      }
    });
    if (cfg.resident == 1) this._updateSpecialItem();
  }
}
