import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CrossRehcargeItemCtrl from './CrossRehcargeItemCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import VipFlagCtrl from '../../../../common/widgets/VipFlagCtrl';
import {
  Carnival_globalCfg,
  Carnival_topupCfg,
  Hero_awakeCfg,
  HeroCfg
  } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-12 10:20:17 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/crossRecharge/CrossRechargeViewCtrl")
export default class CrossRechargeViewCtrl extends gdk.BasePanel {
  @property(cc.Label)
  leftTimeLab: cc.Label = null;

  @property(sp.Skeleton)
  championSpine: sp.Skeleton = null;

  @property(cc.Label)
  myServerName: cc.Label = null;

  @property(cc.Node)
  myInfoNode: cc.Node = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  rechargeItem: cc.Prefab = null;

  @property(cc.Prefab)
  rewardItem: cc.Prefab = null;

  @property(cc.Node)
  scrollTitleNode: cc.Node = null;

  @property(UiTabMenuCtrl)
  uiTabMenu: UiTabMenuCtrl = null;

  @property(cc.Node)
  hideNode: cc.Node = null;

  @property(cc.Node)
  myRankItem: cc.Node = null;

  @property([cc.Node])
  championRewardItems: cc.Node[] = [];

  curPage: number;
  list: ListView;
  resp: icmsg.RankBrief[] = [];
  myRankIdx: number;
  myRankInfo: icmsg.RankBrief;
  onEnable() {
    let arg = this.args[0];
    if (!arg && arg !== 0) arg = 0;
    cc.find('kfcb_xianshiping/tips', this.node).getComponent(cc.RichText).string = `活动期间累计充值<color=#00ff00>${ConfigManager.getItemByField(Carnival_globalCfg, 'key', 'rank_request').value[0]}</c>元或以上才可上榜`
    this.uiTabMenu.setSelectIdx(arg, true);
    this._updateTime();
    this.schedule(this._updateTime, 1);
    let aM = ModelManager.get(ActivityModel);
    if (aM.firstInCrossRecharge) {
      aM.firstInCrossRecharge = false;
      gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }
  }

  onDisable() {
    NetManager.targetOff(this);
    this.unscheduleAllCallbacks();
  }

  onTabMenuSelect(e, type) {
    if (!e) return;
    this.curPage = parseInt(type);
    this.scrollTitleNode.active = this.curPage == 0;
    let req = new icmsg.PayCrossRankReq();
    NetManager.send(req, async (resp: icmsg.PayCrossRankRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      this.resp = resp.list;
      this.myRankInfo = resp.mine;
      this._updateMyInfo();
      if (this.curPage == 0) {
        let ids = [];
        resp.list.forEach(r => { ids.push(r.brief.id); });
        await ModelManager.get(ServerModel).reqServerNameByIds(ids);
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        if (this.curPage !== 0) return;
        this._updateList();
        this._updateMyInfo();
      } else {
        let rM = ModelManager.get(RoleModel);
        for (let i = 0; i < resp.list.length; i++) {
          if (resp.list[i].brief.id == rM.id) {
            this.myRankIdx = i;
            break;
          }
        }
        if (!this.myRankIdx && this.myRankIdx !== 0) this.myRankIdx = 999;
        this._updateList();
      }
    }, this);
  }

  _initList() {
    if (this.list) {
      this.list.destroy();
      this.list = null;
    }
    this.list = new ListView({
      scrollview: this.scrollView,
      mask: this.scrollView.node,
      content: this.content,
      item_tpl: this.curPage == 0 ? this.rechargeItem : this.rewardItem,
      cb_host: this,
      async: true,
      gap_y: 10,
      direction: ListViewDir.Vertical,
    })
    // 416   416+140
    this.scrollView.node.height = this.curPage == 0 ? 416 : 572;
  }

  _updateList() {
    this._initList();
    let datas;
    if (this.curPage == 0) {
      datas = this.resp;
      while (datas.length < 5) {
        datas.push(null);
      }
    }
    else {
      datas = [];
      let type = ActUtil.getActRewardType(69);
      let c = ConfigManager.getItems(Carnival_topupCfg);
      type = Math.min(type, c[c.length - 1].type);
      let cfgs = ConfigManager.getItemsByField(Carnival_topupCfg, 'type', type);
      cfgs.forEach(cfg => {
        let isCurPos: boolean = false;
        if (cfg.interval[0] <= this.myRankIdx + 1 && cfg.interval[1] >= this.myRankIdx + 1) {
          isCurPos = true;
        }
        datas.push({
          isCurPos: isCurPos,
          cfg: cfg
        });
      });
    }
    this.list.clear_items();
    this.list.set_data(datas);
    this._updateMyRankItem();
  }

  _updateTime() {
    let actId = 61;
    let endTime = ActUtil.getActEndTime(actId);
    if (!endTime) {
      this.unschedule(this._updateTime);
      this.leftTimeLab.string = gdk.i18n.t('i18n:ACTIVITY_TIME_TIP3');
    }
    else {
      let leftTime = Math.max(0, endTime - GlobalUtil.getServerTime());
      if (leftTime <= 0) {
        this.unschedule(this._updateTime);
        this.leftTimeLab.string = gdk.i18n.t('i18n:ACTIVITY_TIME_TIP3');
      }
      else {
        this.leftTimeLab.string = gdk.i18n.t('i18n:ACT_STORE_TIP2') + TimerUtils.format1(leftTime / 1000);
      }
    }
  }

  /**not me  , 充值第一的玩家 */
  _updateMyInfo() {
    if (this.resp[0] && this.resp[0].brief.id > 0) {
      let brief = this.resp[0].brief;
      this.hideNode.active = false;
      this.myInfoNode.active = true;
      this.myInfoNode.getChildByName("serverId").getComponent(cc.Label).string = `[S${GlobalUtil.getSeverIdByPlayerId(brief.id)}]`;
      this.myInfoNode.getChildByName("name").getComponent(cc.Label).string = brief.name;
      let vipCtrl = this.myInfoNode.getChildByName("VipFlag").getComponent(VipFlagCtrl);
      vipCtrl.updateVipLv(GlobalUtil.getVipLv(brief.vipExp));
      this.myServerName.string = ModelManager.get(ServerModel).serverNameMap[Math.floor(brief.id / 100000)];
      let path = 'H_zhihuiguan'
      if (brief.head == 0) {
        let str = 'H_zhihuiguan'
        path = `spine/hero/${str}/1/${str}`//PveTool.getSkinUrl('H_zhihuiguan')
      } else {
        let heroCfg = ConfigManager.getItemById(HeroCfg, brief.head);
        if (heroCfg) {
          path = `spine/hero/${heroCfg.skin}/1/${heroCfg.skin}`//PveTool.getSkinUrl(heroCfg.skin)
        } else {
          //属于觉醒的头像 找到对应的英雄模型
          let cfgs = ConfigManager.getItems(Hero_awakeCfg, { icon: brief.head })
          if (cfgs.length > 0) {
            path = `spine/hero/${cfgs[cfgs.length - 1].ul_skin}/1/${cfgs[cfgs.length - 1].ul_skin}`
          } else if ([310149, 310150, 310151].indexOf(brief.head) !== -1) {
            let heroCfg = ConfigManager.getItem(HeroCfg, (cfg: HeroCfg) => {
              if (cfg.icon == brief.head - 10000 && cfg.group[0] == 6) {
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
      let aniName = brief.head == 0 ? 'stand_s' : 'stand';
      this.championSpine.node.active = true;
      this.championSpine.node.scaleX = brief.head == 0 ? 0.6 : -0.6;
      GlobalUtil.setSpineData(this.node, this.championSpine, path, false, aniName, true);
    }
    else {
      this.hideNode.active = true;
      this.myInfoNode.active = false;
      this.myServerName.string = '';
      GlobalUtil.setSpineData(this.node, this.championSpine, null);
      this.championSpine.node.active = false;
    }
    this._updateRewardItems();
  }

  _updateRewardItems() {
    let requestV = ConfigManager.getItemByField(Carnival_globalCfg, 'key', 'topup_first_request').value;
    let rewardsV = ConfigManager.getItemByField(Carnival_globalCfg, 'key', 'topup_first_reward').value;
    let curNum = this.resp[0] && this.resp[0].brief.id > 0 ? this.resp[0].value : 0;
    this.championRewardItems.forEach((n, idx) => {
      let b = curNum >= requestV[idx];
      n.getChildByName('rechargeLab').getComponent(cc.Label).string = `累计充值${requestV[idx]}元`;
      GlobalUtil.setSpriteIcon(this.node, n.getChildByName('bg'), `view/act/texture/crossRecharge/${b ? 'kfkh_pingmukuang01' : 'kfkh_pingmukuang02'}`);
      GlobalUtil.setAllNodeGray(n.getChildByName('star'), b ? 0 : 1);
      n.getChildByName('spine').active = b;
      let btn = n.getChildByName('btn');
      btn.targetOff(this);
      btn.on(cc.Node.EventType.TOUCH_START, () => {
        if (idx == 2) {
          gdk.gui.showMessage('自定义服务器名称');
        } else if (idx == 1) {
          GlobalUtil.openItemTips({
            series: null,
            itemId: rewardsV[2],
            itemNum: rewardsV[1],
            type: BagUtils.getItemTypeById(rewardsV[2]),
            extInfo: null
          });
        } else if (idx == 0) {
          GlobalUtil.openItemTips({
            series: null,
            itemId: rewardsV[0],
            itemNum: rewardsV[1],
            type: BagUtils.getItemTypeById(rewardsV[0]),
            extInfo: null
          });
        }
      }, this);
    });
  }

  _updateMyRankItem() {
    this.myRankItem.active = this.curPage == 0;
    if (this.myRankItem.active) {
      let rankNum = -1;
      if (this.myRankInfo.value < ConfigManager.getItemByField(Carnival_globalCfg, 'key', 'rank_request').value[0]) {
        //未充值
        let m = ModelManager.get(RoleModel);
        this.myRankInfo.brief.head = m.head;
        this.myRankInfo.brief.headFrame = m.frame;
        this.myRankInfo.brief.id = m.id;
        this.myRankInfo.brief.level = m.level;
        this.myRankInfo.brief.name = m.name;
        this.myRankInfo.brief.vipExp = m.vipExp;
      }
      else {
        for (let i = 0; i < this.resp.length; i++) {
          if (this.resp[i].brief.id == this.myRankInfo.brief.id) {
            rankNum = i;
            break;
          }
        }
      }
      let ctrl = this.myRankItem.getComponent(CrossRehcargeItemCtrl);
      ctrl.curIndex = rankNum;
      ctrl._updateView(this.myRankInfo);
      let change = cc.find('contentNode/state1/group', this.myRankItem);
      let upArrow = cc.find('arrowUp', change);
      let downArrow = cc.find('arrowDown', change);
      let num = cc.find('rankNum', change).getComponent(cc.Label);
      upArrow.active = rankNum == -1 || rankNum <= this.myRankInfo.yesterday - 1;
      downArrow.active = !upArrow.active;
      num.string = rankNum == -1 ? '0' : `${Math.abs(rankNum - this.myRankInfo.yesterday + 1)}`;
      if (rankNum == -1 || this.myRankInfo.yesterday == 0 || Math.abs(rankNum - this.myRankInfo.yesterday + 1) == 0) {
        change.active = false;
      }
      else {
        change.active = true;
      }
    }
  }
}
