import BYModel from '../../model/BYModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import { Hero_careerCfg, Tech_globalCfg, Tech_researchCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-14 17:42:49 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/tech/BYResearchViewCtrl")
export default class BYResearchViewCtrl extends gdk.BasePanel {
  @property([cc.Node])
  itemNodes: cc.Node[] = [];

  @property(cc.Label)
  limitTimeLab: cc.Label = null;

  //==============英雄选择============//
  @property(cc.Node)
  heroSelectNode: cc.Node = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  get byModel(): BYModel { return ModelManager.get(BYModel); }

  // pos: cc.Vec2[] = [cc.v2(0, -1000), cc.v2(0, -640)];
  curSelectType: number;
  isShrink: boolean = true;
  list: ListView;
  cache_heroList: { [type: number]: icmsg.HeroInfo[] } = {};
  onEnable() {
    this._hideHeroSelect(0);
    this.limitTimeLab.string = StringUtils.format(gdk.i18n.t('i18n:BINGYING_TIP13'), ConfigManager.getItemByField(Tech_globalCfg, 'key', 'research_limit').value[0]);
    NetManager.on(icmsg.SoldierTechResearchListRsp.MsgType, () => {
      this._updateView();
    }, this);
    NetManager.on(icmsg.SoldierTechDoResearchRsp.MsgType, (resp: icmsg.SoldierTechDoResearchRsp) => {
      this._updateView(resp.research.type);
    }, this);
    NetManager.send(new icmsg.SoldierTechResearchListReq());
    gdk.Timer.loop(1000 * 60 * 60, this, () => {
      NetManager.send(new icmsg.SoldierTechResearchListReq());
    })
  }

  onDisable() {
    gdk.Timer.clearAll(this);
    NetManager.targetOff(this);
  }

  onGetRewardBtnClick() {
    NetManager.send(new icmsg.SoldierTechResearchAwardReq(), (resp: icmsg.SoldierTechResearchAwardRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      if (resp.list.length > 0) {
        GlobalUtil.openRewadrView(resp.list);
      } else {
        gdk.gui.showMessage(gdk.i18n.t('i18n:BINGYING_TIP14'));
      }
    }, this);
  }

  onSelectHeroBtnClick(e, utype) {
    let type = parseInt(utype);
    if (type == this.curSelectType) return;
    this.curSelectType = type;
    this._updateList();
    if (this.isShrink) {
      this._showHeroSelect();
    }
  }

  _updateView(targetType?: number) {
    let types = [1, 3, 4];
    let maxT = ConfigManager.getItemByField(Tech_globalCfg, 'key', 'research_limit').value[0];
    this.itemNodes.forEach((n, idx) => {
      if (!targetType || targetType == types[idx]) {
        let info = this.byModel.techResearchMap[types[idx]];
        let state1 = n.getChildByName('state1')
        let state2 = n.getChildByName('state2');
        if (info && info.heroId > 0) {
          state1.active = false;
          state2.active = true;
          let hero = HeroUtils.getHeroInfoByHeroId(info.heroId);
          let url = StringUtils.format("spine/hero/{0}/0.5/{0}", HeroUtils.getHeroSkin(hero.typeId, hero.star));
          GlobalUtil.setSpineData(this.node, state2.getChildByName('spine').getComponent(sp.Skeleton), url, false, "stand", true, false);
          let t = GlobalUtil.getServerTime() - info.startTime * 1000;
          state2.getChildByName('timeLab').getComponent(cc.Label).string = Math.min(maxT, Math.floor(t / 1000 / 3600)) + gdk.i18n.t('i18n:TASK_TIP37');
          let researchCfg = ConfigManager.getItemByField(Tech_researchCfg, 'type', types[idx], { star: hero.star });
          GlobalUtil.setSpriteIcon(this.node, cc.find('layout/icon', state2), GlobalUtil.getIconById(info.list.length > 0 ? info.list[0].typeId : researchCfg.item));
          cc.find('layout/num', state2).getComponent(cc.Label).string = (info.list.length > 0 ? info.list[0].num : 0) + '';
        } else {
          state1.active = true;
          state2.active = false;
        }
      }
    });
    if (this.list) {
      this.list.refresh_items();
    }
    if (!this.isShrink) { this._hideHeroSelect(); }
  }

  //*****************英雄选择***************** */
  _initList() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.itemPrefab,
        column: 5,
        cb_host: this,
        async: true,
        gap_x: 30,
        gap_y: 30,
        direction: ListViewDir.Vertical,
      });
      this.list.onClick.on(this._selectItem, this);
    }
  }

  _updateList() {
    this._initList();
    if (!this.cache_heroList[this.curSelectType]) {
      this.cache_heroList[this.curSelectType] = [];
      ModelManager.get(HeroModel).heroInfos.forEach(h => {
        let info = <icmsg.HeroInfo>h.extInfo;
        if (info.star >= 4 && ConfigManager.getItemByField(Hero_careerCfg, 'career_id', info.careerId).career_type == this.curSelectType) {
          this.cache_heroList[this.curSelectType].push(info);
        }
      });
      //sort
      this.cache_heroList[this.curSelectType].sort((a, b) => {
        if (a.star == b.star) { return a.typeId - b.typeId; }
        else { return b.star - a.star; }
      });
    }
    let heros = [...this.cache_heroList[this.curSelectType]];
    this.list.clear_items();
    this.list.set_data(heros);
  }

  _selectItem(data) {
    let heroInfo = <icmsg.HeroInfo>data;
    if (heroInfo) {
      let info = this.byModel.techResearchMap[this.curSelectType];
      if (info && info.heroId == heroInfo.heroId) {
        GlobalUtil.openAskPanel({
          descText: gdk.i18n.t('i18n:BINGYING_TIP15'),
          sureCb: () => {
            let req = new icmsg.SoldierTechDoResearchReq();
            req.type = this.curSelectType;
            req.heroId = 0;
            NetManager.send(req);
          }
        })
      } else {
        //open confirm pop
        gdk.panel.setArgs(PanelId.BYResearchHeroConfirmView, [this.curSelectType, heroInfo]);
        gdk.panel.open(PanelId.BYResearchHeroConfirmView);
      }
    }
  }

  _showHeroSelect(durT: number = .3) {
    this.isShrink = false;
    let mask = this.heroSelectNode.getChildByName('mask');
    mask.active = true;
    this.heroSelectNode.stopAllActions();
    this.heroSelectNode.runAction(cc.sequence(
      cc.moveTo(durT, cc.v2(0, -cc.view.getVisibleSize().height / 2)),
      cc.callFunc(() => {
        mask.active = false;
      })
    ));
  }

  _hideHeroSelect(durT: number = .3) {
    this.curSelectType = 0;
    this.isShrink = true;
    let mask = this.heroSelectNode.getChildByName('mask');
    mask.active = true;
    this.heroSelectNode.stopAllActions();
    this.heroSelectNode.runAction(cc.sequence(
      cc.moveTo(durT, cc.v2(0, -cc.view.getVisibleSize().height / 2 - 360)),
      cc.callFunc(() => {
        mask.active = false;
      })
    ));
  }
}
