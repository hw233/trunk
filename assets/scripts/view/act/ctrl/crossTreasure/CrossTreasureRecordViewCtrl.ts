import BagUtils from '../../../../common/utils/BagUtils';
import NetManager from '../../../../common/managers/NetManager';
import StringUtils from '../../../../common/utils/StringUtils';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-24 13:43:00 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/crossTreasure/CrossTreasureRecordViewCtrl")
export default class CrossTreasureRecordViewCtrl extends gdk.BasePanel {
  @property(cc.ScrollView)
  superScrollView: cc.ScrollView = null;

  @property(cc.Node)
  superContent: cc.Node = null;

  @property(cc.ScrollView)
  curTurnScrollView: cc.ScrollView = null;

  @property(cc.Node)
  curTurnContent: cc.Node = null;

  @property(cc.Node)
  itemPrefab: cc.Node = null;

  r1: icmsg.CrossTreasureRecord[] = [];  //本轮大奖
  r2: icmsg.CrossTreasureRecord[] = [];  //超级大奖
  onEnable() {
    let req = new icmsg.CrossTreasureRecordListReq();
    NetManager.send(req, (resp: icmsg.CrossTreasureRecordListRsp) => {
      if (!cc.isValid(this.node)) return;
      if (!this.node.activeInHierarchy) return;
      resp.record.sort((a, b) => { return b.time - a.time; });
      resp.record.forEach(r => {
        if (r.type == 1) {
          if (this.r1.length < 100) {
            this.r1.push(r);
          }
        }
        else if (r.type == 2) {
          this.r2.push(r);
        }
        else {
          if (this.r1.length < 100) {
            this.r1.push(r);
          }
          this.r2.push(r);
        }
      });
      this._updateView();
    }, this);
  }

  onDisable() {
    NetManager.targetOff(this);
  }

  _updateView() {
    [this.r1, this.r2].forEach((records, idx) => {
      // let scrollView = [this.curTurnScrollView, this.superScrollView][idx];
      let content = [this.curTurnContent, this.superContent][idx];
      content.removeAllChildren();
      records.forEach(r => {
        let item = cc.instantiate(this.itemPrefab);
        item.parent = content;
        item.active = true;
        item.x = 0;
        item.getChildByName('lab').getComponent(cc.RichText).string = `<outline color=#5F361E width=2><color=#A3B929>${r.playerName}</c><color=#94674c>${r.type == 1 ? gdk.i18n.t('i18n:CROSS_TREASURE_TIP6') : StringUtils.format(gdk.i18n.t('i18n:CROSS_TREASURE_TIP2'), r.leftTimes)}</c><color=#d9ac1e>${BagUtils.getConfigById(r.itemId).name}</c></outline>`
        item.height = Math.max(55, item.getChildByName('lab').height);
      });
      content.height += 10;
    });
  }
}
