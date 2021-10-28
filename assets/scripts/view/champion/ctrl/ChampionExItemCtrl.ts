import BagUtils from '../../../common/utils/BagUtils';
import ChampionModel from '../model/ChampionModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Champion_divisionCfg, Champion_exchangeCfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-23 14:47:52 
  */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChampionExItemCtrl")
export default class ChampionExItemCtrl extends UiListItem {
  @property(UiSlotItem)
  slot: UiSlotItem = null;

  @property(cc.Node)
  costNode: cc.Node = null;

  @property(cc.Label)
  limitLab: cc.Label = null;

  @property(cc.Button)
  exchangeBtn: cc.Button = null;

  @property(cc.Node)
  flag1: cc.Node = null;

  @property(cc.Node)
  flag2: cc.Node = null;

  @property(cc.Node)
  sellOut: cc.Node = null;

  get cModel(): ChampionModel { return ModelManager.get(ChampionModel); }
  cfg: Champion_exchangeCfg;
  updateView() {
    //TODO
    this.cfg = this.data;
    this.slot.updateItemInfo(this.cfg.drop[0][0], this.cfg.drop[0][1]);
    this.slot.itemInfo = {
      series: null,
      itemId: this.cfg.drop[0][0],
      itemNum: this.cfg.drop[0][1],
      type: BagUtils.getItemTypeById(this.cfg.drop[0][0]),
      extInfo: null
    }
    GlobalUtil.setSpriteIcon(this.node, this.costNode.getChildByName('icon'), GlobalUtil.getIconById(this.cfg.cost[0]));
    this.costNode.getChildByName('num').getComponent(cc.Label).string = `${this.cfg.cost[1]}`;
    let divisionCfg = ConfigManager.getItemById(Champion_divisionCfg, this.cfg.limit_lv);
    let point = this.cModel.myPoints || 0;
    let boughtNum = this.cModel.exchangedInfo[this.cfg.id] || 0;
    if (point < divisionCfg.point) {
      this.limitLab.string = StringUtils.format(gdk.i18n.t("i18n:CHAMPION_EXITEM_TIP1"), divisionCfg.name)//`${divisionCfg.name}解锁`;
      this.limitLab.node.color = cc.color().fromHEX('#FF603B');
    }
    else {
      this.limitLab.string = StringUtils.format(gdk.i18n.t("i18n:CHAMPION_EXITEM_TIP2"), this.cfg.limit_times - boughtNum, this.cfg.limit_times)//`限制(${this.cfg.limit_times - boughtNum}/${this.cfg.limit_times})次`;
      this.limitLab.node.color = cc.color().fromHEX('#FFBA25');
    }
    this.flag1.active = this.cfg.tag == 1;
    this.flag2.active = this.cfg.tag == 2;
    if (this.cfg.limit_times - boughtNum <= 0) {
      this.sellOut.active = true;
      this.limitLab.node.active = false;
      this.exchangeBtn.node.active = false;
    }
    else {
      this.sellOut.active = false;
      this.limitLab.node.active = true;
      this.exchangeBtn.node.active = true;
    }
  }

  onDisable() {
    NetManager.targetOff(this);
  }

  onBuyBtnClick() {
    let divisionCfg = ConfigManager.getItemById(Champion_divisionCfg, this.cfg.limit_lv);
    let point = this.cModel.myPoints || 0;
    if (point < divisionCfg.point) {
      gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:CHAMPION_EXITEM_TIP1"), divisionCfg.name));
      return;
    }
    let boughtNum = this.cModel.exchangedInfo[this.cfg.id] || 0;
    if (boughtNum >= this.cfg.limit_times) {
      gdk.gui.showMessage(gdk.i18n.t("i18n:CHAMPION_EXITEM_TIP3"));
      return;
    }

    let req = new icmsg.ChampionExchangeReq();
    req.id = this.cfg.id;
    NetManager.send(req, (resp: icmsg.ChampionExchangeRsp) => {
      let model = ModelManager.get(ChampionModel);
      resp.exchanged.forEach(info => {
        model.exchangedInfo[info.id] = info.num;
      });
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      GlobalUtil.openRewadrView(resp.goodsList);
      let boughtNum = this.cModel.exchangedInfo[this.cfg.id] || 0;
      this.limitLab.string = StringUtils.format(gdk.i18n.t("i18n:CHAMPION_EXITEM_TIP2"), this.cfg.limit_times - boughtNum, this.cfg.limit_times)//`限制(${this.cfg.limit_times - boughtNum}/${this.cfg.limit_times})次`;
      this.limitLab.node.color = cc.color().fromHEX('#FFBA25');
      if (this.cfg.limit_times - boughtNum <= 0) {
        this.sellOut.active = true;
        this.limitLab.node.active = false;
        this.exchangeBtn.node.active = false;
      }
      else {
        this.sellOut.active = false;
        this.limitLab.node.active = true;
        this.exchangeBtn.node.active = true;
      }
    }, this);
  }
}
