import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GeneHeroItemCtrl from './GeneHeroItemCtrl';
import GeneTransItemCtrl from './GeneTransItemCtrl';
import GeneTransUpHeroItemCtrl from './GeneTransUpHeroItemCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroLockTipsCtrl from '../../../role/ctrl2/main/common/HeroLockTipsCtrl';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import LotteryModel from '../../model/LotteryModel';
import MercenaryModel from '../../../mercenary/model/MercenaryModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import { Gene_globalCfg, Gene_transitionCfg, HeroCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RoleEventId } from '../../../role/enum/RoleEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-14 14:25:37 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/GeneTransViewCtrl')
export default class GeneTransViewCtrl extends gdk.BasePanel {
  @property(GeneTransItemCtrl)
  originalHeroNode: GeneTransItemCtrl = null;

  @property(GeneTransItemCtrl)
  targetHeroNode: GeneTransItemCtrl = null;

  @property(cc.Node)
  costNode: cc.Node = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  heroItemPrefab: cc.Prefab = null;

  @property(cc.ToggleContainer)
  groupToggleContainer: cc.ToggleContainer = null;

  @property(cc.Node)
  cancelBtn: cc.Node = null;

  @property(cc.Node)
  confirmBtn: cc.Node = null;

  @property(cc.Node)
  heroListlayout: cc.Node = null;
  @property(cc.Prefab)
  heroUpItem: cc.Prefab = null;

  @property(cc.Toggle)
  skipBtn: cc.Toggle = null;

  get lotteryModel(): LotteryModel { return ModelManager.get(LotteryModel); }

  cfgs: Gene_transitionCfg[] = [];
  groups: number[] = [];
  selectGroup: number = 0;
  selectHeroInfo: icmsg.HeroInfo;
  list: ListView;
  isInTrans: boolean = false;
  onLoad() {
    this.cfgs = ConfigManager.getItems(Gene_transitionCfg);
    this.groups = [];
    this.cfgs.forEach(cfg => {
      if (this.groups.indexOf(cfg.camp) == -1) {
        this.groups.push(cfg.camp);
      }
    });
  }

  onEnable() {
    this._initGroup();
    gdk.e.on(RoleEventId.REMOVE_ONE_HERO, this._updateHeroList, this);
  }

  onDisable() {
    this.selectHeroInfo = null;
    this.selectGroup = null;
    gdk.e.targetOff(this);
    gdk.Timer.clearAll(this);
  }

  onCancelBtnClick() {
    let req = new icmsg.GeneTransConfirmReq();
    req.confirm = false;
    NetManager.send(req, (resp: icmsg.GeneTransConfirmRsp) => {
      ModelManager.get(LotteryModel).geneTransOrgianlHeroId = null;
      ModelManager.get(LotteryModel).geneTransTargetHeroTypeId = null;
      this.selectHero(this.selectHeroInfo.heroId);
    });
  }

  onConfirmBtnClick() {
    let req = new icmsg.GeneTransConfirmReq();
    req.confirm = true;
    NetManager.send(req, (resp: icmsg.GeneTransConfirmRsp) => {
      ModelManager.get(LotteryModel).geneTransOrgianlHeroId = null;
      ModelManager.get(LotteryModel).geneTransTargetHeroTypeId = null;
      GlobalUtil.openRewadrView(resp.hero);
      this._updateHeroList()
    });
  }

  onTransBtnClick() {
    let group = ConfigManager.getItemById(HeroCfg, this.selectHeroInfo.typeId).group[0];
    let cfg = ConfigManager.getItemByField(Gene_transitionCfg, 'camp', group, { star: this.selectHeroInfo.star });
    let itemNum = BagUtils.getItemById(cfg.item[0]) || 0;
    if (itemNum < cfg.item[1]) {
      gdk.gui.showMessage(`${BagUtils.getConfigById(cfg.item[0]).name}${gdk.i18n.t("i18n:LOTTERY_TIP2")}`);
      return;
    }
    let id = this.selectHeroInfo.heroId;

    let mercenaryModel = ModelManager.get(MercenaryModel)
    let m_list = mercenaryModel.lentHeroList
    for (let i = 0; i < m_list.length; i++) {
      if (m_list[i].heroId == id) {
        GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:LOTTERY_TIP8"))
        return
      }
    }

    let req = new icmsg.GeneTransReq();
    req.oldHeroId = id;
    NetManager.send(req, (resp: icmsg.GeneTransRsp) => {
      ModelManager.get(LotteryModel).geneTransOrgianlHeroId = id;
      ModelManager.get(LotteryModel).geneTransTargetHeroTypeId = resp.newHeroId;
      if (!cc.isValid(this.node)) return;
      this.targetHeroNode.playTargetAnim(resp.newHeroId);
    });
  }

  onGroupToggleClick(toggle: cc.Toggle) {
    if (this.isInTrans) {
      this.groupToggleContainer.node.getChildByName(`group${this.selectGroup}`).getComponent(cc.Toggle).check();
      return;
    }
    let name = toggle.node.name;
    this.selectGroup = parseInt(name.substring('group'.length));
    this._updateHeroList();
  }

  _initGroup() {

    let state = GlobalUtil.getLocal('geneTransSkipAni', true)
    this.skipBtn.isChecked = state == null ? false : state;

    let toggles = this.groupToggleContainer.toggleItems;
    toggles.forEach(toggle => {
      let name = toggle.name;
      let idx = parseInt(name.slice('group'.length));
      if (idx == 0) {
        toggle.node.active = true;
      }
      else {
        toggle.node.active = this.groups.indexOf(idx) !== -1;
      }
    });
    this.groupToggleContainer.toggleItems[0].check();
    this.onGroupToggleClick(this.groupToggleContainer.toggleItems[0]);

    //设置展示英雄图标
    this.heroListlayout.removeAllChildren()
    let heroIds: number[] = ConfigManager.getItemByField(Gene_globalCfg, 'key', 'transition_presentation').value
    heroIds.forEach(heroId => {
      let node = cc.instantiate(this.heroUpItem)
      let ctrl = node.getComponent(GeneTransUpHeroItemCtrl)
      ctrl.initHeroInfo(heroId)
      node.setParent(this.heroListlayout);
    })

  }

  _initList() {
    if (!this.list) {
      this.list = new ListView({
        scrollview: this.scrollView,
        mask: this.scrollView.node,
        content: this.content,
        item_tpl: this.heroItemPrefab,
        cb_host: this,
        gap_x: 10,
        async: true,
        direction: ListViewDir.Horizontal,
      });
      this.list.onClick.on(this._onItemClick, this);
    }
    this.selectHeroInfo = null;
    this.list['selectId'] = null;
  }

  selectHero(id: number) {
    let heroInfos = this.list.datas;
    for (let i = 0; i < heroInfos.length; i++) {
      if (heroInfos[i].heroId == id) {
        this.list.select_item(i);
        this.list.scroll_to(i);
        return;
      }
    }
  }

  _updateHeroList() {
    this._initList();
    let heroInfos = this._getHeroList(this.selectGroup);
    heroInfos.sort((a, b) => { return b.star - a.star; });
    this.list.clear_items();
    this.list.set_data(heroInfos);

    if (heroInfos.length > 0) {
      for (let i = 0; i < heroInfos.length; i++) {
        if (!HeroUtils.heroLockCheck(heroInfos[i], false)) {
          this.selectHero(heroInfos[i].heroId);
          break;
        }
      }
    }

    gdk.Timer.callLater(this, () => {
      if (!cc.isValid(this.node)) return;
      let orgianlHeroInd = ModelManager.get(LotteryModel).geneTransOrgianlHeroId;
      if (orgianlHeroInd) {
        this.selectHero(orgianlHeroInd);
      }
      else {
        this._updateHeorNode();
      }
    })
  }

  @gdk.binding("lotteryModel.geneTransOrgianlHeroId")
  _updateState() {
    if (!cc.isValid(this.node)) return;
    this.isInTrans = !!this.lotteryModel.geneTransOrgianlHeroId;

    if (this.isInTrans) {
      let state = GlobalUtil.getLocal('geneTransSkipAni', true)
      if (state != null && state) {
        this.cancelBtn.active = this.isInTrans;
        this.confirmBtn.active = this.isInTrans;
      } else {
        gdk.Timer.once(1600, this, () => {
          this.cancelBtn.active = this.isInTrans;
          this.confirmBtn.active = this.isInTrans;
        })
      }
    } else {
      this.cancelBtn.active = this.isInTrans;
      this.confirmBtn.active = this.isInTrans;
    }

    this.costNode.active = !this.isInTrans && !!this.selectHeroInfo;
  }

  _updateHeorNode() {
    this.originalHeroNode.updateView(this.selectHeroInfo);
    this.targetHeroNode.updateView(ModelManager.get(LotteryModel).geneTransTargetHeroTypeId, this.selectHeroInfo);
    this._updateCostInfo();
  }

  _updateCostInfo() {
    if (this.isInTrans || !this.selectHeroInfo) {
      this.costNode.active = false;
    }
    else {
      this.costNode.active = true;
      let group = ConfigManager.getItemById(HeroCfg, this.selectHeroInfo.typeId).group[0];
      let cfg = ConfigManager.getItemByField(Gene_transitionCfg, 'camp', group, { star: this.selectHeroInfo.star });
      GlobalUtil.setSpriteIcon(this.node, cc.find('cost/icon', this.costNode), GlobalUtil.getIconById(cfg.item[0]));
      cc.find('cost/num', this.costNode).getComponent(cc.Label).string = cfg.item[1] + '';
    }
  }

  _onItemClick(data, idx, preData, preIdx) {
    if (this.isInTrans && data.heroId !== this.lotteryModel.geneTransOrgianlHeroId) {
      gdk.gui.showMessage(gdk.i18n.t("i18n:LOTTERY_TIP9"));
      return;
    }
    if (HeroUtils.heroLockCheck(HeroUtils.getHeroInfoByHeroId(data.heroId), false)) {
      gdk.panel.open(PanelId.HeroLockTips, (node: cc.Node) => {
        let ctrl = node.getComponent(HeroLockTipsCtrl);
        ctrl.initArgs(data.heroId, [], () => { this.list.select_item(idx) });
      });
      return
    }
    this.list['selectId'] = data.heroId;
    this.selectHeroInfo = data;
    this._updateHeorNode();
    let node = this.list.items[idx];
    let preNode = this.list.items[preIdx];
    if (node.node) {
      let ctrl = node.node.getComponent(GeneHeroItemCtrl);
      ctrl.onSelect();
    }
    if (preNode && preNode.node) {
      let ctrl = preNode.node.getComponent(GeneHeroItemCtrl);
      ctrl.onSelect();
    }
    this.list.refresh_items();
  }

  _getHeroList(group: number) {
    let cfgs: Gene_transitionCfg[] = [];
    if (group == 0) {
      cfgs = this.cfgs;
    }
    else {
      cfgs = ConfigManager.getItems(Gene_transitionCfg, (cfg: Gene_transitionCfg) => {
        if (cfg.camp == group) return true;
      });
    }

    let conditions: number[][] = [];
    cfgs.forEach(cfg => {
      conditions.push([cfg.camp, cfg.star]);
    });

    let list: icmsg.HeroInfo[] = [];
    let heroInfos = ModelManager.get(HeroModel).heroInfos;
    heroInfos.forEach(item => {
      let info = <icmsg.HeroInfo>item.extInfo;
      if (info.level <= 1 && info.careerLv <= 1) {
        let cfg = ConfigManager.getItemById(HeroCfg, info.typeId);
        for (let i = 0; i < conditions.length; i++) {
          if (cfg.group[0] == conditions[i][0] && info.star == conditions[i][1]) {
            list.push(info);
            break;
          }
        }
      }
    });
    return list;
  }

  skipBtnClick() {
    GlobalUtil.setLocal('geneTransSkipAni', this.skipBtn.isChecked, true);
  }

}
