import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import StringUtils from '../../../common/utils/StringUtils';
import TaskUtil from '../util/TaskUtil';
import TavernHeroSelectViewCtrl from './TavernHeroSelectViewCtrl';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import {
  GroupCfg,
  Hero_starCfg,
  HeroCfg,
  Tavern_conditionCfg,
  Tavern_taskCfg,
  TavernCfg
  } from '../../../a/config';
import { TaskEventId } from '../enum/TaskEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-06-04 18:21:57 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/TavernSendViewCtrl")
export default class TavernSendViewCtrl extends gdk.BasePanel {
  @property(cc.Label)
  nameLabel: cc.Label = null;

  @property(cc.Label)
  decLabel: cc.Label = null;

  @property(cc.Node)
  slot: cc.Node = null;

  @property(cc.Node)
  heroList: cc.Node = null;

  @property(cc.Node)
  qualityNode: cc.Node = null;

  @property(cc.Node)
  groupList: cc.Node = null;

  @property(cc.Button)
  allSendBtn: cc.Button = null;

  @property(cc.Button)
  sendBtn: cc.Button = null;

  @property(cc.Node)
  numStatusNode: cc.Node = null;

  data: icmsg.TavernTask = null;
  cfg: Tavern_taskCfg = null;
  upHeroList: any = {};
  needHeroNum: number = null;
  onEnable() {
    let args = gdk.panel.getArgs(PanelId.TavernSendView);
    if (args) this.data = args[0];
    this._addEventListener();
    this._updateView();
    this.onHeroClick(null, '1');
  }

  onDisable() {
    if (gdk.panel.isOpenOrOpening(PanelId.TavernHeroSelectView)) {
      gdk.panel.hide(PanelId.TavernHeroSelectView);
    }
    this.data = null;
    this.cfg = null;
    this.upHeroList = {};
    this.needHeroNum = null;
    gdk.e.targetOff(this);
    NetManager.targetOff(this);
  }

  _addEventListener() {
    gdk.e.on(TaskEventId.TAVERN_HERO_CHOOSE_PANEL_CLICK, this._onHeroSelected, this);
  }

  _updateView() {
    if (!this.data) return;
    this.cfg = ConfigManager.getItemById(Tavern_taskCfg, this.data.taskId);
    this.nameLabel.string = this.cfg.name;
    this.nameLabel.node.color = BagUtils.getColor(this.cfg.quality);
    this.nameLabel.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(this.cfg.quality);
    this.decLabel.string = this.cfg.des;
    this.slot.getComponent(UiSlotItem).updateItemInfo(this.cfg.reward[0], this.cfg.reward[1]);
    this.slot.getComponent(UiSlotItem).itemInfo = {
      series: null,
      itemId: this.cfg.reward[0],
      itemNum: this.cfg.reward[1],
      type: BagUtils.getItemTypeById(this.cfg.reward[0]),
      extInfo: null,
    }
    if (this.cfg.type == 99) {
      this.needHeroNum = ConfigManager.getItemByField(Tavern_conditionCfg, 'quality', 0).hero_num;
    }
    else {
      this.needHeroNum = ConfigManager.getItemByField(Tavern_conditionCfg, 'quality', this.cfg.quality).hero_num;
    }
    let heroNodes = this.heroList.children;
    heroNodes.forEach(node => {
      let str = node.name.substring('hero'.length);
      if (parseInt(str) <= this.needHeroNum) {
        node.active = true;
      }
      else {
        node.active = false;
      }
    });
    this.qualityNode.getChildByName('star').getComponent(cc.Label).string = this.data.quality > 5 ? '1'.repeat(this.data.quality - 5) : '0'.repeat(this.data.quality);
    let color = ConfigManager.getItemById(Hero_starCfg, this.data.quality).color;
    GlobalUtil.setSpriteIcon(this.node, this.qualityNode, `view/lottery/texture/common/ck_quality${Math.max(0, 5 - color)}`);
    let groupNodes = this.groupList.children;
    this.data.groups.sort((a, b) => { return a - b; });
    for (let i = 0; i < groupNodes.length; i++) {
      if (this.data.groups[i]) {
        groupNodes[i].active = true;
        let icon = ConfigManager.getItemById(GroupCfg, this.data.groups[i]).icon;
        GlobalUtil.setSpriteIcon(this.node, groupNodes[i], `view/role/texture/up/${icon}_icon`);
      }
      else {
        groupNodes[i].active = false;
      }
    }

    this.checkConditions();
  }

  /**
   * 英雄选择回调
   */
  _onHeroSelected(e) {
    let group = e.data[0].group;
    let heroInfo: icmsg.HeroInfo = e.data[0].info;
    let upList = [];
    let cfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId);
    for (let key in this.upHeroList) {
      this.upHeroList[key] && upList.push(this.upHeroList[key]);
    }
    let isUp = upList.indexOf(heroInfo.heroId) != -1;
    if (!isUp && this.needHeroNum <= upList.length) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:TASK_TIP26'));
      return;
    }

    for (let i = 0; i < this.needHeroNum; i++) {
      let node = this.heroList.getChildByName(`hero${i + 1}`).getChildByName('upHero');
      if (!isUp && !this.upHeroList[i]) {
        this.upHeroList[i] = heroInfo.heroId;
        node.active = true;
        GlobalUtil.setSpriteIcon(this.node, node.getChildByName('hero'), cfg.iconPath + '_s');
        GlobalUtil.setSpriteIcon(this.node, node.getChildByName('qualityBg'), `common/texture/sub_itembg0${heroInfo.color}`);
        node.getChildByName('star').getComponent(cc.Label).string = heroInfo.star > 5 ? '1'.repeat(heroInfo.star - 5) : '0'.repeat(heroInfo.star);
        let path = 'view/role/texture/up/' + ConfigManager.getItemById(GroupCfg, group).icon + '_icon';
        GlobalUtil.setSpriteIcon(this.node, node.getChildByName('group'), path);
        gdk.e.emit(TaskEventId.TAVERN_HERO_SELECTED, [heroInfo.heroId]); // 派发英雄上阵
        this.checkConditions();
        return;
      }
      else if (isUp && this.upHeroList[i] && this.upHeroList[i] == heroInfo.heroId) {
        delete this.upHeroList[i];
        node.active = false;
        GlobalUtil.setSpriteIcon(this.node, node, '');
        gdk.e.emit(TaskEventId.TAVERN_HERO_UN_SELECTED, [heroInfo.heroId]); // 派发英雄下阵
        this.checkConditions();
        return;
      }
    }
  }

  /**
   * 一键上阵 
   * 满足顺序 星级->阵营->数量
   */
  onAKetToBattleBtnClick() {
    let alreadyUpHeroList = TaskUtil.getTavernUpHeroIdList();
    let recommandHeros: { group: number, info: icmsg.HeroInfo }[] = [];
    let recommandIds: number[] = []
    let star = this.data.quality;
    let groups = [...this.data.groups];
    //满足星级的英雄列表
    let satisfyStarHeroInfos = HeroUtils.getHerosByStar(star).filter(info => {
      return alreadyUpHeroList.indexOf(info.heroId) == -1;
    });
    //品质低-->高
    satisfyStarHeroInfos.sort((a, b) => {
      if (a.star == b.star) return a.power - b.power;
      else return a.star - b.star;
    });
    if (satisfyStarHeroInfos.length <= 0) {
      gdk.gui.showMessage(StringUtils.format(gdk.i18n.t('i18n:TASK_TIP27'), star));
      return;
    }
    for (let i = 0; i < groups.length; i++) {
      //同时满足星级和某阵营的英雄列表, 任取一个
      let satisfyHeroInfos = HeroUtils.getHerosByGroup(groups[i], satisfyStarHeroInfos).filter(info => {
        return alreadyUpHeroList.indexOf(info.heroId) == -1;
      });
      if (satisfyHeroInfos.length >= 1) {
        recommandHeros.push({
          group: groups[i],
          info: satisfyHeroInfos[0]
        });
        recommandIds.push(satisfyHeroInfos[0].heroId);
        //剔除条件已满足的阵营
        let cfg = ConfigManager.getItemById(HeroCfg, satisfyHeroInfos[0].typeId);
        cfg.group.forEach(group => {
          let idx = groups.indexOf(group);
          if (idx != -1) {
            groups.splice(idx, 1);
          }
        });
        break;
      }
    }
    //满足星级的英雄不满足任何一个要求阵营,任取一个
    if (recommandHeros.length == 0) {
      recommandHeros.push({
        group: ConfigManager.getItemById(HeroCfg, satisfyStarHeroInfos[0].typeId).group[0],
        info: satisfyStarHeroInfos[0]
      });
      recommandIds.push(satisfyStarHeroInfos[0].heroId);
    }
    //筛选符合阵营条件的英雄
    for (let i = 0; i < groups.length;) {
      let heroInfos = HeroUtils.getHerosByGroup(groups[i]).filter(info => {
        return alreadyUpHeroList.indexOf(info.heroId) == -1;
      });
      //品质低-->高
      heroInfos.sort((a, b) => {
        if (a.star == b.star) return a.power - b.power;
        else return a.star - b.star;
      });
      if (heroInfos.length <= 0) {
        gdk.gui.showMessage(StringUtils.format(gdk.i18n.t('i18n:TASK_TIP28'), ConfigManager.getItemById(GroupCfg, groups[i]).name));
        return;
      }
      else {
        for (let j = 0; j < heroInfos.length; j++) {
          //上阵英雄已满,但阵营要求尚未满足.   触发情况 符合品质的英雄不满足任一要求的阵营时,上阵英雄数量 <= 阵营数量
          if (groups.length >= 1 && recommandIds.length >= this.needHeroNum) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t('i18n:TASK_TIP28'), ConfigManager.getItemById(GroupCfg, groups[0]).name));
            return;
          }
          if (recommandIds.indexOf(heroInfos[j].heroId) == -1) {
            let cfg = ConfigManager.getItemById(HeroCfg, heroInfos[j].typeId);
            recommandHeros.push({
              group: groups[0],
              info: heroInfos[j]
            });
            recommandIds.push(heroInfos[j].heroId);

            //剔除条件已满足的阵营
            cfg.group.forEach(group => {
              let idx = groups.indexOf(group);
              if (idx != -1) {
                groups.splice(idx, 1);
              }
            });
            break;
          }
          else {
            if (j == heroInfos.length - 1) {
              gdk.gui.showMessage(StringUtils.format(gdk.i18n.t('i18n:TASK_TIP28'), ConfigManager.getItemById(GroupCfg, groups[i]).name));
              return;
            }
          }
        }
      }
      i = 0; //始终匹配第一个阵营
    }

    //品质/阵营要求均满足的情况下,还有剩余上阵位时   补充最低品质的英雄
    let leftNum = this.needHeroNum - recommandIds.length;
    while (leftNum > 0) {
      let allHeroInfos = [...ModelManager.get(HeroModel).heroInfos].filter(info => {
        return alreadyUpHeroList.indexOf(info.extInfo['heroId']) == -1;
      });
      allHeroInfos.sort((a, b) => {
        if ((<icmsg.HeroInfo>a.extInfo).star == (<icmsg.HeroInfo>b.extInfo).star) return (<icmsg.HeroInfo>a.extInfo).power - (<icmsg.HeroInfo>b.extInfo).power;
        else return (<icmsg.HeroInfo>a.extInfo).star - (<icmsg.HeroInfo>b.extInfo).star;

      });
      for (let i = 0; i < allHeroInfos.length; i++) {
        if (recommandIds.indexOf(allHeroInfos[i].extInfo['heroId']) == -1) {
          let cfg = ConfigManager.getItemById(HeroCfg, allHeroInfos[i].extInfo['typeId']);
          recommandHeros.push({
            group: cfg.group[0],
            info: <icmsg.HeroInfo>(allHeroInfos[i].extInfo)
          });
          recommandIds.push(allHeroInfos[i].extInfo['heroId']);
          leftNum -= 1;
          break;
        }
        else {
          if (i == allHeroInfos.length - 1 && leftNum > 0) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:TASK_TIP29'));
            return;
          }
        }
      }
    }

    //下阵玩家所有选择的英雄
    for (let key in this.upHeroList) {
      let node = this.heroList.getChildByName(`hero${parseInt(key) + 1}`).getChildByName('upHero');
      gdk.e.emit(TaskEventId.TAVERN_HERO_UN_SELECTED, [this.upHeroList[parseInt(key)]]); // 派发英雄下阵
      delete this.upHeroList[parseInt(key)]
      node.active = false;
      GlobalUtil.setSpriteIcon(this.node, node, '');
      this.checkConditions();
    }

    //一键上阵
    for (let key in recommandHeros) {
      gdk.e.emit(TaskEventId.TAVERN_HERO_CHOOSE_PANEL_CLICK, [recommandHeros[key]]);
    }
  }

  /**
   * 英雄选择
   * @param idx 
   */
  onHeroClick(e, idx: string) {
    if (this.upHeroList[parseInt(idx) - 1]) {
      let node = this.heroList.getChildByName(`hero${parseInt(idx)}`).getChildByName('upHero');
      gdk.e.emit(TaskEventId.TAVERN_HERO_UN_SELECTED, [this.upHeroList[parseInt(idx) - 1]]); // 派发英雄下阵
      delete this.upHeroList[parseInt(idx) - 1];
      node.active = false;
      GlobalUtil.setSpriteIcon(this.node, node, '');
      this.checkConditions();
    }
    else {
      let unMatchGroup;
      let matchQualityNum = 0;
      let group = [];
      let upList = [];
      for (let key in this.upHeroList) {
        this.upHeroList[key] && upList.push(this.upHeroList[key]);
        let heroInfo = HeroUtils.getHeroInfoByHeroId(this.upHeroList[key]);
        if (!heroInfo) continue;
        if (heroInfo.star >= this.data.quality) {
          matchQualityNum += 1;
        }
        group.push(...ConfigManager.getItemById(HeroCfg, heroInfo.typeId).group);
      }

      for (let j = 1; j <= this.needHeroNum; j++) {
        let idx = group.indexOf(this.data.groups[j - 1]);
        if (idx != -1) {
          group.splice(idx, 1);
        }
        else {
          unMatchGroup = this.data.groups[j - 1];
          break;
        }
      }
      if (matchQualityNum == 0 && !unMatchGroup) {
        let heroInfos = HeroUtils.getHerosByStar(this.data.quality);
        if (heroInfos) {
          let cfg = ConfigManager.getItemById(HeroCfg, heroInfos[0].typeId);
          unMatchGroup = cfg.group[0];
        }
      }
      if (!unMatchGroup) unMatchGroup = 1;

      let panel = gdk.panel.get(PanelId.TavernHeroSelectView);
      if (panel) {
        let ctrl = panel.getComponent(TavernHeroSelectViewCtrl);
        ctrl.selectPage(unMatchGroup);
      }
      else {
        gdk.panel.setArgs(PanelId.TavernHeroSelectView, unMatchGroup);
        if (!gdk.panel.isOpenOrOpening(PanelId.TavernHeroSelectView)) {
          gdk.panel.open(PanelId.TavernHeroSelectView);
        }
      }
    }
  }

  /**
   * 检查条件
   */
  checkConditions() {
    let qualityLabel = this.qualityNode.getChildByName('label').getComponent(cc.Label);
    let statusSpriteNode = [];
    //星级、阵营 条件满足标志
    statusSpriteNode.push(this.qualityNode.getChildByName('sub_gouxuan'));
    this.groupList.children.forEach(child => {
      statusSpriteNode.push(child.getChildByName('sub_gouxuan'));
    })

    let matchQualityNum = 0;
    let group = [];
    let upList = [];
    for (let key in this.upHeroList) {
      this.upHeroList[key] && upList.push(this.upHeroList[key]);
      let heroInfo = HeroUtils.getHeroInfoByHeroId(this.upHeroList[key]);
      let cfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId);
      if (!cfg) continue;
      if (heroInfo.star >= this.data.quality) {
        matchQualityNum += 1;
      }
      group.push(...cfg.group);
      // group = Array.from(new Set(group));
    }

    statusSpriteNode[0].active = matchQualityNum >= 1;
    qualityLabel.string = `${matchQualityNum}/1`;
    for (let j = 1; j <= this.needHeroNum; j++) {
      let idx = group.indexOf(this.data.groups[j - 1]);
      statusSpriteNode[j].active = idx != -1;
      if (idx != -1) {
        group.splice(idx, 1);
      }
    }

    //上阵数量
    if (upList.length == this.needHeroNum) {
      this.sendBtn.node.active = true;
      this.numStatusNode.active = false;
    }
    else {
      this.sendBtn.node.active = false;
      this.numStatusNode.active = true;
      this.numStatusNode.getChildByName('label').getComponent(cc.Label).string = `${upList.length}/${this.needHeroNum}`
    }
  }

  /**派遣 */
  onSendBtnClick() {
    let tavernCfg = ConfigManager.getItemById(TavernCfg, 1);
    let costItem = BagUtils.getItemNumById(tavernCfg.cost[0]) || 0;
    if (costItem < tavernCfg.cost[1]) {
      gdk.gui.showMessage(`${BagUtils.getConfigById(tavernCfg.cost[0]).name}数量不足`);
      return;
    }

    let isSatisfyQuality = false;
    let list = [];
    for (let key in this.upHeroList) {
      if (this.upHeroList[key]) {
        list.push(this.upHeroList[key]);
        let heroInfo = HeroUtils.getHeroInfoByHeroId(this.upHeroList[key]);
        if (heroInfo.star >= this.data.quality) {
          isSatisfyQuality = true;
        }
      }
    }

    if (list.length < this.needHeroNum) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:TASK_TIP30'));
      return;
    }

    if (!isSatisfyQuality) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:TASK_TIP31'));
      return;
    }

    let group = [];
    let satisfyGroupNum = 0;
    for (let key in this.upHeroList) {
      let heroInfo = HeroUtils.getHeroInfoByHeroId(this.upHeroList[key])
      let cfg = ConfigManager.getItemById(HeroCfg, heroInfo.typeId);
      if (!cfg) continue;
      group.push(...cfg.group);
    }

    for (let j = 1; j <= this.needHeroNum; j++) {
      let idx = group.indexOf(this.data.groups[j - 1]);
      if (idx != -1) {
        satisfyGroupNum += 1;
        group.splice(idx, 1);
      }
    }

    if (satisfyGroupNum < this.data.groups.length) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:TASK_TIP32'));
      return;
    }

    let req = new icmsg.TavernTaskStartReq();
    req.heroList = list;
    req.todoIndex = this.data.index;
    NetManager.send(req, (resp: icmsg.TavernTaskStartRsp) => {
      gdk.Timer.callLater(this, () => {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        this.close();
      })
    }, this);
  }
}
