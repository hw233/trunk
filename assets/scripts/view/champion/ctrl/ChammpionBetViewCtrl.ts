import BagUtils from '../../../common/utils/BagUtils';
import ChampionModel from '../model/ChampionModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import { Champion_divisionCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-26 11:41:48 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChammpionBetViewCtrl")
export default class ChammpionBetViewCtrl extends gdk.BasePanel {
  @property(cc.Node)
  player: cc.Node = null;

  @property(cc.Label)
  betNum: cc.Label = null;

  @property(cc.Slider)
  numSlider: cc.Slider = null;

  @property(cc.Node)
  icon: cc.Node = null;

  _maxNum: number;
  _minNum: number = 0;
  selectNum: number;
  step: number = 0.1;
  moneyId: number = 24;
  idx: number; //组数
  info: icmsg.ChampionGuessPlayerList;
  onEnable() {
    [this.idx, this.info] = this.args[0];
    cc.find('layout/name', this.player).getComponent(cc.Label).string = this.info.name;
    GlobalUtil.setSpriteIcon(this.node, cc.find('layout/icon', this.player), GlobalUtil.getIconById(this.moneyId));
    GlobalUtil.setSpriteIcon(this.node, cc.find('heroSlot/iconBg', this.player), GlobalUtil.getHeadFrameById(this.info.headFrame));
    GlobalUtil.setSpriteIcon(this.node, cc.find('heroSlot/mask/icon', this.player), GlobalUtil.getHeadIconById(this.info.head));
    GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getIconById(24));
    let m = ConfigManager.getItemById(Champion_divisionCfg, ModelManager.get(ChampionModel).infoData.level).c_point * 2;
    this._maxNum = Math.min(m, BagUtils.getItemNumById(this.moneyId));
    this.selectNum = this._minNum;
    this._updateView();
  }

  onDisable() {
    NetManager.targetOff(this);
  }

  onBetBtnClick() {
    if (this.selectNum <= 0) {
      gdk.gui.showMessage(gdk.i18n.t("i18n:CHAMPION_BET_TIP1"));
      return;
    }

    let req = new icmsg.ChampionGuessReq();
    req.index = this.idx;
    req.playerId = this.info.playerId;
    req.score = this.selectNum;
    NetManager.send(req, () => {
      gdk.gui.showMessage(gdk.i18n.t("i18n:CHAMPION_BET_TIP2"));
      this.close();
    }, this);
  }

  //滑动条
  onSliderChange() {
    this.selectNum = Math.floor(this._maxNum * this.numSlider.progress)
    this._updateView();
  }

  //减数量
  onMinusBtn() {
    this.selectNum -= this._maxNum * this.step;
    this._updateView();
  }

  //加数量
  onPlusBtn() {
    this.selectNum += this._maxNum * this.step;
    this._updateView();
  }

  _updateView() {
    this.selectNum = Math.min(this._maxNum, this.selectNum);
    this.selectNum = Math.max(this._minNum, this.selectNum);
    this.selectNum = Math.floor(this.selectNum);
    this.betNum.string = `${GlobalUtil.numberToStr2(this.selectNum, true)}`;
    this.numSlider.progress = this._maxNum == 0 ? 0 : this.selectNum / this._maxNum;
    this.numSlider.node.getChildByName('sliderBar').width = 335 * this.numSlider.progress;
  }
}
