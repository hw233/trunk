import BagUtils from '../../../common/utils/BagUtils';
import ChampionModel from '../model/ChampionModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import { Hero_awakeCfg, HeroCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-26 10:56:06 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChampionGuessViewCtrl")
export default class ChampionGuessViewCtrl extends gdk.BasePanel {
  @property(cc.Node)
  titleNode: cc.Node = null;

  @property(cc.Node)
  moneyNode: cc.Node = null;

  @property([cc.Node])
  players: cc.Node[] = [];

  @property([cc.Node])
  betBtns: cc.Node[] = [];

  @property([cc.Node])
  betStateNodes: cc.Node[] = [];

  @property(cc.Node)
  fightBtn: cc.Node = null;

  @property(cc.Node)
  resultFlag: cc.Node = null;

  @property(UiTabMenuCtrl)
  uiTabMenu: UiTabMenuCtrl = null;

  get cModel(): ChampionModel { return ModelManager.get(ChampionModel); }
  selectIdx: number;
  onEnable() {
    this.selectIdx = this.args[0];
    if (!this.selectIdx) this.selectIdx = 0;
    this.uiTabMenu.setSelectIdx(this.selectIdx, true);
    NetManager.on(icmsg.ChampionGuessListRsp.MsgType, (resp: icmsg.ChampionGuessListRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      if (resp.list.length <= 0) {
        this.close();
        return;
      }
      this.cModel.guessList = resp.list;
      this.uiTabMenu.setSelectIdx(this.selectIdx, true);
    }, this);
    NetManager.send(new icmsg.ChampionGuessListReq(), null, this);
    NetManager.on(icmsg.RoleUpdateRsp.MsgType, this._updateMoney, this);
    NetManager.on(icmsg.ChampionGuessRsp.MsgType, (rsp: icmsg.ChampionGuessRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      let infos = this.cModel.guessList[this.selectIdx];
      if (infos.player1.playerId == rsp.playerId) {
        infos.player1.bet += 1;
      }
      if (infos.player2.playerId == rsp.playerId) {
        infos.player2.bet += 1;
      }
      this.onTabMenuSelect(true, this.selectIdx);
    }, this);
  }

  onDisable() {
    NetManager.targetOff(this);
  }

  /**查看玩家信息 */
  onPlayerCheckBtnClick(e, data) {
    let id = this.cModel.guessList[this.selectIdx][`player${data}`].playerId;
    gdk.panel.setArgs(PanelId.MainSet, id, 1);
    gdk.panel.open(PanelId.MainSet);
  }

  /**下注 */
  onBetBtnClick(e, data) {
    let info = this.cModel.guessList[this.selectIdx][`player${data}`]
    gdk.panel.setArgs(PanelId.ChampionBetView, [this.selectIdx, info]);
    gdk.panel.open(PanelId.ChampionBetView);
  }

  /**查看战斗 */
  onFightBtnClick() {
    let infos = this.cModel.guessList[this.cModel.guessIndex];
    let p = infos.playerId == infos.player1.playerId ? infos.player2 : infos.player1;
    let player = new icmsg.ArenaPlayer();
    player.id = p.playerId;
    player.robotId = null;
    player.name = p.name;
    player.head = p.head;
    player.frame = p.headFrame;
    player.level = p.level;
    player.power = p.power;
    JumpUtils.openPveArenaScene([player.id, 0, player], player.name, 'CHAMPION_GUESS');
  }

  onReportBtnClick() {
    gdk.panel.open(PanelId.ChampionGuessReportView);
  }

  onTabMenuSelect(e, data) {
    if (!e) return;
    this.selectIdx = data;
    this.cModel.guessIndex = this.selectIdx;
    let infos: icmsg.ChampionGuess = this.cModel.guessList[this.selectIdx];
    if (!infos) return;
    GlobalUtil.setSpriteIcon(this.node, this.titleNode, this.selectIdx == 0 ? 'view/champion/texture/guess/jbs_dianfeng' : 'view/champion/texture/guess/jbs_zhunheng');
    let allNum = infos.player1.bet + infos.player2.bet;
    let player1Bet = allNum > 0 ? Math.floor((infos.player1.bet / allNum) * 100) : 0;
    let player2Bet = allNum > 0 ? 100 - player1Bet : 0;
    this.players.forEach((p, idx) => {
      let info = [infos.player1, infos.player2][idx];
      let betNum = [player1Bet, player2Bet][idx];
      cc.find('layout/label', p).getComponent(cc.Label).string = info.name;
      cc.find('gradeNode/num', p).getComponent(cc.Label).string = info.points + '';
      cc.find('power/num', p).getComponent(cc.Label).string = info.power + '';
      let spine = p.getChildByName('spine').getComponent(sp.Skeleton);
      let path = 'H_zhihuiguan'
      if (info.head == 0) {
        let str = 'H_zhihuiguan'
        path = `spine/hero/${str}/1/${str}`//PveTool.getSkinUrl('H_zhihuiguan')
      } else {
        let heroCfg = ConfigManager.getItemById(HeroCfg, info.head);
        if (heroCfg) {
          path = `spine/hero/${heroCfg.skin}/1/${heroCfg.skin}`//PveTool.getSkinUrl(heroCfg.skin)
        } else {
          //属于觉醒的头像 找到对应的英雄模型
          let cfgs = ConfigManager.getItems(Hero_awakeCfg, { icon: info.head })
          if (cfgs.length > 0) {
            path = `spine/hero/${cfgs[cfgs.length - 1].ul_skin}/1/${cfgs[cfgs.length - 1].ul_skin}`
          } else if ([310149, 310150, 310151].indexOf(info.head) !== -1) {
            let heroCfg = ConfigManager.getItem(HeroCfg, (cfg: HeroCfg) => {
              if (cfg.icon == info.head - 10000 && cfg.group[0] == 6) {
                return true;
              }
            });
            path = `spine/hero/${heroCfg.skin}_jx/1/${heroCfg.skin}_jx`
          } else {
            let str = 'H_zhihuiguan'
            path = `spine/hero/${str}/1/${str}`
          }
        }
      }
      let aniName = info.head == 0 ? 'stand_s' : 'stand';
      let s = [-0.6, 0.6];
      spine.node.scaleX = info.head == 0 ? -1 * s[idx] : s[idx];
      GlobalUtil.setSpineData(this.node, spine, path, false, aniName, true);

      let resultFlag = cc.find('layout/flag', p);
      let betNode = this.betBtns[idx];
      let betState = this.betStateNodes[idx];

      //支持率
      let supportLevel = p.getChildByName('supportLevel').getComponent(cc.Label);
      supportLevel.string = betNum + '%'

      if (!infos.playerId) {
        //未下注
        resultFlag.active = false;
        betNode.active = true;
        betState.active = false;
      }
      else {
        //已下注
        betNode.active = false;
        betState.active = info.playerId == infos.playerId;
        GlobalUtil.setSpriteIcon(this.node, cc.find('icon', betState), GlobalUtil.getIconById(24));
        cc.find('icon/num', betState).getComponent(cc.Label).string = GlobalUtil.numberToStr2(infos.score, true) + '';
        if (!infos.rewardScore) {
          //未战斗
          resultFlag.active = false;
        }
        else {
          //已战斗
          resultFlag.active = true;
          let url = (info.playerId == infos.playerId && infos.rewardScore > 0)
            || (info.playerId !== infos.playerId && infos.rewardScore < 0) ? 'view/champion/texture/guess/jbs_sheng' : 'view/champion/texture/guess/jbs_fu';
          GlobalUtil.setSpriteIcon(this.node, resultFlag, url);
        }
      }
    });

    this.fightBtn.active = infos.playerId > 0 && infos.rewardScore == 0;
    this.resultFlag.active = infos.playerId > 0 && infos.rewardScore !== 0;
    if (this.resultFlag.active) {
      GlobalUtil.setSpriteIcon(this.node, this.resultFlag, infos.rewardScore > 0 ? 'view/champion/texture/guess/jbs_jingcaichenggong' : 'view/champion/texture/guess/jbs_jingcaishiai');
    }

    this._updateBtns();
    this._updateMoney();
  }

  _updateBtns() {
    this.uiTabMenu.node.children.forEach((btn, idx) => {
      let info = this.cModel.guessList[idx];
      if (!info) {
        btn.active = false;
      }
      else {
        btn.active = true;
        let stateLab = btn.getChildByName('state').getComponent(cc.Label);
        let redPoint = btn.getChildByName('RedPoint');
        if (!info.playerId) {
          stateLab.string = gdk.i18n.t("i18n:CHAMPION_GUESS_TIP1");//'可竞猜';
          redPoint.active = true;
        }
        else {
          if (!info.rewardScore) {
            stateLab.string = gdk.i18n.t("i18n:CHAMPION_GUESS_TIP2");//'查看战斗';
            redPoint.active = true;
          }
          else {
            stateLab.string = gdk.i18n.t("i18n:CHAMPION_GUESS_TIP3");//'已结束';
            redPoint.active = false;
          }
        }
      }
    });
  }

  _updateMoney() {
    GlobalUtil.setSpriteIcon(this.node, this.moneyNode.getChildByName('icon'), GlobalUtil.getIconById(24));
    this.moneyNode.getChildByName('num').getComponent(cc.Label).string = BagUtils.getItemNumById(24) + '';
  }
}
