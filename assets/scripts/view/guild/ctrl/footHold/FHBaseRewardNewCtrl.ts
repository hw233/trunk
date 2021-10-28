import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildModel from '../../model/GuildModel';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import { Foothold_baseCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-14 10:40:24 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHBaseRewardNewCtrl")
export default class FHBaseRewardNewCtrl extends gdk.BasePanel {
  @property(cc.Node)
  energyBtn: cc.Node = null;

  @property(cc.Node)
  iconNode: cc.Node = null;

  @property(cc.Node)
  curLvDescContent: cc.Node = null;

  @property(cc.Node)
  curLvDescItem: cc.Node = null;

  @property(cc.Node)
  upgradeNode: cc.Node = null;

  @property(cc.RichText)
  nextLvDesc: cc.RichText = null;

  @property(cc.RichText)
  nextLvTips: cc.RichText = null;

  @property(cc.Node)
  maxLvTips: cc.Node = null;

  get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
  get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
  get guildModel(): GuildModel { return ModelManager.get(GuildModel); }

  curLvCfg: Foothold_baseCfg;
  nextLvCfg: Foothold_baseCfg;
  onEnable() {
    let msg = new icmsg.FootholdBaseLevelReq()
    msg.warId = this.footHoldModel.curMapData.warId
    msg.guildId = this.footHoldModel.roleTempGuildId
    NetManager.send(msg, (data: icmsg.FootholdBaseLevelRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      this.curLvCfg = ConfigManager.getItemById(Foothold_baseCfg, this.footHoldModel.baseLevel);
      this.nextLvCfg = ConfigManager.getItemById(Foothold_baseCfg, this.footHoldModel.baseLevel + 1);
      this._updateView();
    }, this);
  }

  onDisable() {
    this.energyBtn.stopAllActions();
    NetManager.targetOff(this);
  }

  async _updateView() {
    //iconInfo
    let sM = ModelManager.get(ServerModel);
    await sM.reqServerNameByIds([this.footHoldModel.roleTempGuildId], 2);
    this.iconNode.getChildByName('serverName').getComponent(cc.Label).string = `S${GlobalUtil.getSeverIdByGuildId(this.footHoldModel.roleTempGuildId)}${gdk.i18n.t('i18n:RELIC_TIP1')} ${sM.serverNameMap[Math.floor(this.footHoldModel.roleTempGuildId / 10000)]}`;
    this.iconNode.getChildByName('baseName').getComponent(cc.Label).string = this.curLvCfg.name;
    let guildInfo = FootHoldUtils.findGuild(this.footHoldModel.roleTempGuildId)
    if (guildInfo) {
      GlobalUtil.setSpriteIcon(this.node, this.iconNode.getChildByName('icon'), GuildUtils.getIcon(guildInfo.icon))
      GlobalUtil.setSpriteIcon(this.node, this.iconNode.getChildByName('frame'), GuildUtils.getIcon(guildInfo.frame))
      GlobalUtil.setSpriteIcon(this.node, this.iconNode.getChildByName('bottom'), GuildUtils.getIcon(guildInfo.bottom))
    }
    let idx = 0;
    for (let i = 0; i < this.footHoldModel.fhGuilds.length; i++) {
      if (this.footHoldModel.fhGuilds[i].id == this.footHoldModel.roleTempGuildId) {
        idx = i;
        break;
      }
    }
    GlobalUtil.setSpriteIcon(this.node, this.iconNode.getChildByName('iconBg'), `view/guild/texture/icon/${this.curLvCfg['skin' + `${idx == 0 ? '' : `${idx}`}`]}`);
    // this.curLvDesc.string = `<color=#ffe08b><outline color=#4d1d14 width=2>${this.curLvCfg.desc}</outline></c>`;
    this._updateDescContent();

    //upgradeInfo
    let cfgs = [this.curLvCfg, this.nextLvCfg];
    [this.upgradeNode.getChildByName('curIcon'), this.upgradeNode.getChildByName('nextIcon')].forEach((n, i) => {
      let cfg = cfgs[i];
      n.active = !!cfg;
      if (n.active) {
        if (guildInfo) {
          GlobalUtil.setSpriteIcon(this.node, n.getChildByName('icon'), GuildUtils.getIcon(guildInfo.icon))
          GlobalUtil.setSpriteIcon(this.node, n.getChildByName('frame'), GuildUtils.getIcon(guildInfo.frame))
          GlobalUtil.setSpriteIcon(this.node, n.getChildByName('bottom'), GuildUtils.getIcon(guildInfo.bottom))
          GlobalUtil.setSpriteIcon(this.node, n.getChildByName('iconBg'), `view/guild/texture/icon/${cfg['skin' + `${idx == 0 ? '' : `${idx}`}`]}`);
        }
        n.getChildByName('name').getComponent(cc.Label).string = cfg.name;
      }
    });
    let progressNode = this.upgradeNode.getChildByName('progressNode');
    progressNode.active = !!this.nextLvCfg;
    if (progressNode.active) {
      let bar = progressNode.getChildByName('bar');
      let num = progressNode.getChildByName('num').getComponent(cc.Label);
      bar.width = Math.min(247, 247 * (this.footHoldModel.baseLvExp / this.curLvCfg.exp));
      num.string = `${this.footHoldModel.baseLvExp}/${this.curLvCfg.exp}`;
    }

    //nextLv
    if (this.nextLvCfg) {
      this.nextLvTips.node.active = true;
      this.nextLvDesc.node.active = true;
      this.maxLvTips.active = false;
      this.nextLvTips.string = `<color=#ffe08b><outline color=#4c1d00 width=2>基地提升至${this.nextLvCfg.level}级获得以下加成</outline></c>`;
      this.nextLvDesc.string = `<color=#ffe08b><outline color=#4c1d00 width=2>${this.nextLvCfg.desc}</outline></c>`;
    }
    else {
      this.nextLvTips.node.active = false;
      this.nextLvDesc.node.active = false;
      this.maxLvTips.active = true;
    }
    this._updateEnergyBtn();
  }

  _updateDescContent() {
    this.curLvDescContent.removeAllChildren()
    let cfg_desc = this.curLvCfg.desc
    let datas = cfg_desc.split("<br/>")

    for (let i = 0; i < datas.length; i++) {
      let item = cc.instantiate(this.curLvDescItem)
      item.active = true
      let richLab = cc.find("label", item).getComponent(cc.RichText)
      richLab.string = `<color=#ffe08b><outline color=#4d1d14 width=2>${datas[i]}</outline></c>`
      this.curLvDescContent.addChild(item)
    }
  }

  @gdk.binding('footHoldModel.freeEnergy')
  @gdk.binding('footHoldModel.baseLevel')
  _updateEnergyBtn() {
    if (!this.curLvCfg) return;
    this.energyBtn.active = this.curLvCfg.privilege2 > this.footHoldModel.freeEnergy
    if (this.energyBtn.active) {
      this.energyBtn.setScale(1);
      this.energyBtn.runAction(
        cc.repeatForever(
          cc.sequence(
            cc.scaleTo(.5, 1.3, 1.3),
            cc.scaleTo(.5, 1, 1)
          )
        )
      );
    }
    else {
      this.energyBtn.stopAllActions();
    }
  }

  /**领取体力 */
  onEnergyBtnClick() {
    gdk.panel.open(PanelId.FHBaseEnergyGetView);
  }

  /**等级预览 */
  onPreviewBtnClick() {
    gdk.panel.open(PanelId.FHBaseUpgradePreview);
  }
}
