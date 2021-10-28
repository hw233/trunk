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
import { HeroCfg, Pieces_globalCfg, Pieces_rankingCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-18 10:26:54 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/pieces/PiecesEndlessViewCtrl")
export default class PiecesEndlessViewCtrl extends gdk.BasePanel {
  @property(cc.Label)
  timeLab: cc.Label = null;

  @property(cc.Node)
  heroSpines: cc.Node = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  rankItemPrefab: cc.Prefab = null;

  get model(): PiecesModel { return ModelManager.get(PiecesModel); }

  actId: number = 106;
  list: ListView;
  onEnable() {
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
      this._updateRankList();
      NetManager.send(new icmsg.PiecesInfoReq(), null, this);
    }
  }

  onDisable() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
    NetManager.targetOff(this);
  }

  onRewardBtnClick() {
    gdk.panel.open(PanelId.PiecesRankRewardView);
  }

  onTalentBtnClick() {
    gdk.panel.open(PanelId.PiecesTalentView);
  }

  onAtkBtnClick() {
    this.model.curModel = 1;
    let req = new icmsg.PiecesEnterReq();
    req.type = 1;
    NetManager.send(req, (resp: icmsg.PiecesEnterRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      this.model.startRound = resp.startRound;
      this.model.startHp = resp.playerHP;
      this.model.computerTeamId = resp.computerTeamId;
      this.model.passWave = 0;
      this.model.lastWaveArrivalEnemy = 0;
      let name = PiecesUtils.randomHandle();
      let heroCfgs = ConfigManager.getItems(HeroCfg);
      let p = {
        name: name,
        power: '???',
        frame: 102006,
        head: heroCfgs[Math.floor(Math.random() * heroCfgs.length)].icon,
        id: 8888
      }
      JumpUtils.openPveArenaScene([p.id, 0, p], p.name, 'PIECES_ENDLESS');
      gdk.panel.hide(PanelId.PiecesMain);
    }, this);
  }

  _initListView() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.rankItemPrefab,
        cb_host: this,
        gap_y: 5,
        async: true,
        direction: ListViewDir.Vertical,
      })
    }
  }

  _updateRankList() {
    let req = new icmsg.PiecesRankListReq();
    NetManager.send(req, (resp: icmsg.PiecesRankListRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      let cb = () => {
        let rewardType = this.model.curRewardType;
        let c = ConfigManager.getItems(Pieces_rankingCfg);
        rewardType = Math.min(rewardType, c[c.length - 1].type);
        let cServerNum = ModelManager.get(PiecesModel).croServerNum;
        cServerNum = Math.min(cServerNum, c[c.length - 1].server);
        let cfgs = ConfigManager.getItems(Pieces_rankingCfg, (cfg: Pieces_rankingCfg) => {
          if (cfg.type == rewardType && cfg.server == cServerNum && cfg.rank[1] > resp.list.length) {
            return true;
          }
        });
        let datas = [];
        [...resp.list, ...cfgs].forEach(l => {
          let obj = {
            rankLen: resp.list.length,
            info: l
          }
          datas.push(obj);
        })
        this._initListView();
        this.list.clear_items();
        this.list.set_data(datas);
      }
      if (this.model.croServerNum) {
        cb();
      }
      else {
        let req = new icmsg.PiecesCrossServerNumReq();
        NetManager.send(req, (resp: icmsg.PiecesCrossServerNumRsp) => {
          if (!cc.isValid(this.node)) return;
          if (!this.node.activeInHierarchy) return;
          this.model.croServerNum = resp.num;
          cb();
        }, this);
      }
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
  }
}
