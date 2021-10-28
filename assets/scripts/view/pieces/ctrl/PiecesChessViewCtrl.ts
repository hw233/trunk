import ActUtil from '../../act/util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import PiecesModel from '../../../common/models/PiecesModel';
import PiecesUtils from '../utils/PiecesUtils';
import StringUtils from '../../../common/utils/StringUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { HeroCfg, Pieces_globalCfg, Pieces_numberCfg } from '../../../a/config';
import { RedPointEvent } from '../../../common/utils/RedPointUtils';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-18 10:27:18 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/pieces/PiecesChessViewCtrl")
export default class PiecesChessViewCtrl extends gdk.BasePanel {
  @property(cc.Label)
  timeLab: cc.Label = null;

  @property(cc.Node)
  heroSpines: cc.Node = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  slotPrefab: cc.Prefab = null;

  @property(cc.Label)
  leftAtkTimesLab: cc.Label = null;

  @property(cc.Label)
  leftBuyTimesLab: cc.Label = null;

  get model(): PiecesModel { return ModelManager.get(PiecesModel); }

  actId: number = 106;
  onEnable() {
    if (this.model.firstInChessView) {
      this.model.firstInChessView = false;
      gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }
    let startTime = new Date(ActUtil.getActStartTime(this.actId));
    let endTime = new Date(ActUtil.getActEndTime(this.actId) - 5000); //time为零点,减去5s 返回前一天
    if (!startTime || !endTime) {
      this.timeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
      gdk.panel.hide(PanelId.PiecesMain);
      return;
    }
    else {
      this.timeLab.string = `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
      this.model.curRewardType = ActUtil.getActRewardType(this.actId);
      this._updateHeros();
      NetManager.send(new icmsg.PiecesInfoReq(), null, this);
    }
  }

  onDisable() {
    NetManager.targetOff(this);
  }

  onAddBtnClick() {
    if (this.model.restBuyTimes <= 0) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:PIECES_TIPS1'));
    }
    else {
      let cfgs = ConfigManager.getItems(Pieces_numberCfg);
      let idx = cfgs.length - this.model.restBuyTimes;
      let c = cfgs[idx];
      GlobalUtil.openAskPanel({
        descText: StringUtils.format(gdk.i18n.t('i18n:PIECES_TIPS2'), c.consumption[1]),
        sureCb: () => {
          let req = new icmsg.PiecesBuyTimeReq();
          NetManager.send(req, null, this);
        }
      })
    }
  }

  onRewardBtnClick() {
    gdk.panel.open(PanelId.PiecesRankRewardView);
  }

  onTalentBtnClick() {
    gdk.panel.open(PanelId.PiecesTalentView);
  }

  onAtkBtnClick() {
    this.model.curModel = 2;
    let req = new icmsg.PiecesEnterReq();
    req.type = 2;
    NetManager.send(req, (resp: icmsg.PiecesEnterRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      this.model.addScore = 0;
      this.model.computerTeamId = resp.computerTeamId;
      let name = PiecesUtils.randomHandle();
      let heroCfgs = ConfigManager.getItems(HeroCfg);
      let p = {
        name: name,
        power: 0,
        frame: 102006,
        head: heroCfgs[Math.floor(Math.random() * heroCfgs.length)].icon,
        id: 8888
      }
      NetManager.send(new icmsg.PiecesHeroListReq(), (resp: icmsg.PiecesHeroListRsp) => {
        this.model.roundRefreshTimes = {};
        this.model.silver = ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'initial_silver').value[0];
        this.model.passWave = 0;
        this.model.chessExp = 0;
        this.model.chessLv = 1;
        this.model.lastWaveArrivalEnemy = 0;
        JumpUtils.openPveArenaScene([p.id, 0, p], p.name, 'PIECES_CHESS');
        gdk.panel.hide(PanelId.PiecesMain);
      }, this);
    }, this);
  }

  _updateHeros() {
    let h1 = ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'our_show').value;
    let h2 = ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'enemy_show').value;
    let n1 = this.heroSpines.getChildByName('my').children;
    let n2 = this.heroSpines.getChildByName('opponent').children;
    let h = [...h1, ...h2];
    [...n1, ...n2].forEach((n, idx) => {
      let heroId = h[idx];
      let url = StringUtils.format("spine/hero/{0}/0.5/{0}", HeroUtils.getHeroSkin(heroId));
      GlobalUtil.setSpineData(this.node, n.getComponent(sp.Skeleton), url, false, 'stand', true);
    });
    //
    this.content.removeAllChildren();
    let heros = ConfigManager.getItemByField(Pieces_globalCfg, 'key', 'hero_show').value;
    heros.forEach(h => {
      let slot = cc.instantiate(this.slotPrefab);
      slot.parent = this.content;
      slot.setScale(.75);
      let ctrl = slot.getComponent(UiSlotItem);
      ctrl.updateItemInfo(h);
    });
  }

  @gdk.binding("model.restChallengeTimes")
  _updateAtkTimes() {
    this.leftAtkTimesLab.string = `${gdk.i18n.t('i18n:PIECES_TIPS3')}:${this.model.restChallengeTimes}`;
  }

  @gdk.binding("model.restBuyTimes")
  _updateBuyTimes() {
    this.leftBuyTimesLab.string = `${gdk.i18n.t('i18n:PIECES_TIPS4')}:${this.model.restBuyTimes}`;
  }
}
