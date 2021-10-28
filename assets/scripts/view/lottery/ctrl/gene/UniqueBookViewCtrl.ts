import ConfigManager from '../../../../common/managers/ConfigManager';
import UniqueBookHItemCtrl from './UniqueBookHItemCtrl';
import { UniqueCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-09-14 14:00:29 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-13 14:28:00
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/UniqueBookViewCtrl')
export default class UniqueBookViewCtrl extends gdk.BasePanel {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  onEnable() {
    this._updateDataLater();
  }

  onDisable() {
  }

  _updateDataLater() {
    gdk.Timer.callLater(this, this._updateScroll);
  }

  _updateScroll() {
    this.content.removeAllChildren();
    let color = [5, 4, 3, 2];
    let nodes = [];
    color.forEach(c => {
      let cfgs = ConfigManager.getItems(UniqueCfg, (cfg: UniqueCfg) => {
        if (cfg.color == c && cfg.show == 1) {
          return true;
        }
      });
      if (cfgs.length > 0) {
        cfgs.sort((a, b) => { return a.index - b.index; })
        let item = cc.instantiate(this.itemPrefab);
        item.parent = this.content;
        let ctrl = item.getComponent(UniqueBookHItemCtrl);
        ctrl.updateView(c, cfgs);
        let row = Math.floor(cfgs.length / 5) + (cfgs.length % 5 > 0 ? 1 : 0);
        item.height = 60 + 5 + row * 130 - 20;
        nodes.push(item);
      }
    });
    // gdk.Timer.callLater(this, () => {
    //   if (cc.isValid(this.node)) {
    //     nodes.forEach(n => { n.parent = this.content; });
    //     this.content.getComponent(cc.Layout).updateLayout();
    //   }
    // })
  }
}
