import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Hero_careerCfg, Hero_globalCfg, HeroCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-08-16 13:40:41 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-26 15:03:40
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/geneConnect/GeneConConfirmVeiwCtrl")
export default class GeneConConfirmVeiwCtrl extends gdk.BasePanel {
  @property(UiSlotItem)
  oldSlot: UiSlotItem = null;

  @property(UiSlotItem)
  newSlot: UiSlotItem = null;

  @property(cc.Node)
  titleNode: cc.Node = null;

  @property(cc.Label)
  tips: cc.Label = null;

  @property(cc.Node)
  confirmBtn: cc.Node = null;

  curMysticHeroId: number;
  curConnectHeroId: number;
  onEnable() {
    let args = this.args[0];
    this.curMysticHeroId = args[0];
    this.curConnectHeroId = args[1] || 0;
    this.tips.string = this.curConnectHeroId > 0 ? '英雄星级、等级提升' : '英雄星级、等级将被复原';
    GlobalUtil.setSpriteIcon(this.node, this.titleNode, `view/role/texture/geneConnect/smz_${this.curConnectHeroId > 0 ? 'lianjiexiangqing' : 'jiechulianjie'}`);
    let mysticHeroInfo = HeroUtils.getHeroInfoByHeroId(this.curMysticHeroId);
    let heroCfg = ConfigManager.getItemById(HeroCfg, mysticHeroInfo.typeId);
    let careerType = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', mysticHeroInfo.careerId).career_type;
    //old
    this.oldSlot.starNum = mysticHeroInfo.star;
    this.oldSlot.career = careerType;
    this.oldSlot.lv = mysticHeroInfo.level;
    this.oldSlot.updateItemInfo(mysticHeroInfo.typeId);
    if (this.curConnectHeroId == 0) this.oldSlot.lvLab.color = cc.color().fromHEX('#43FDFF');
    //new
    this.newSlot.starNum = this.curConnectHeroId > 0 ? HeroUtils.getHeroInfoByHeroId(this.curConnectHeroId).star : heroCfg.star_min;
    this.newSlot.career = careerType;
    this.newSlot.lv = this.curConnectHeroId > 0 ? HeroUtils.getHeroInfoByHeroId(this.curConnectHeroId).level : 1;
    this.newSlot.updateItemInfo(mysticHeroInfo.typeId);
    if (this.curConnectHeroId > 0) this.newSlot.lvLab.color = cc.color().fromHEX('#43FDFF');
    //btn
    cc.find('layout/icon', this.confirmBtn).active = mysticHeroInfo.mysticLink > 0;
    cc.find('layout/num', this.confirmBtn).getComponent(cc.Label).string = mysticHeroInfo.mysticLink > 0 ? `${ConfigManager.getItemByField(Hero_globalCfg, 'key', 'mystery_unlink_cost').value[1]}解除` : '确定';
  }

  onDisable() {
    NetManager.targetOff(this);
  }

  onCancelBtnClick() {
    this.close();
  }

  onConfirmBtnClick() {
    if (this.curConnectHeroId > 0) {
      //链接
      let linkReq = new icmsg.HeroMysticLinkReq();
      linkReq.mystic = this.curMysticHeroId;
      linkReq.heroId = this.curConnectHeroId;
      NetManager.send(linkReq, (resp: icmsg.HeroMysticLinkRsp) => {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        //todo
        gdk.panel.setArgs(PanelId.GeneConResultView, resp);
        gdk.panel.open(PanelId.GeneConResultView);
        this.close();
      }, this);
      return;
    }

    //解除
    let cost = ConfigManager.getItemByField(Hero_globalCfg, 'key', 'mystery_unlink_cost').value;
    if (GlobalUtil.checkMoneyEnough(cost[1], cost[0], this)) {
      let unlinkReq = new icmsg.HeroMysticUnLinkReq();
      unlinkReq.mystic = this.curMysticHeroId;
      NetManager.send(unlinkReq, (resp: icmsg.HeroMysticUnLinkRsp) => {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        //todo
        gdk.panel.setArgs(PanelId.GeneConResultView, resp);
        gdk.panel.open(PanelId.GeneConResultView);
        if (resp.items && resp.items.length > 0) {
          GlobalUtil.openRewadrView(resp.items);
        }
        this.close();
      }, this);
    }
  }
}
