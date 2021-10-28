import GlobalUtil from '../../../../common/utils/GlobalUtil';
import UniqueBookItemCtrl from './UniqueBookItemCtrl';
import { UniqueCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-09-14 14:01:30 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-15 10:32:22
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/UniqueBookHItemCtrl')
export default class UniqueBookHItemCtrl extends cc.Component {
  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  @property(cc.Node)
  titleNode: cc.Node = null;

  cfgs: UniqueCfg[] = [];
  updateView(color: number, cfgs: UniqueCfg[]) {
    this.cfgs = cfgs;
    let url = ['lansezhuanshu', 'zisezhuanshu', 'jinsezhuanshu', 'hongsezhuanshu'];
    GlobalUtil.setSpriteIcon(this.node, this.titleNode, `view/lottery/texture/gene/zszb_${url[color - 2]}`);
    this.updateList();
  }

  updateList() {
    this.content.removeAllChildren();
    this.cfgs.forEach(c => {
      let node = cc.instantiate(this.itemPrefab);
      node.parent = this.content;
      let ctrl = node.getComponent(UniqueBookItemCtrl);
      ctrl.updateView(c);
    });
  }

  // async updateList() {
  //   this.content.removeAllChildren();
  //   let eachCreatN = 2;
  //   for (let i = 0; i < this.cfgs.length; i += eachCreatN) {
  //     if (!cc.isValid(this.node) || !this.node.activeInHierarchy) return;
  //     await this.createByFrame(this.cfgs.slice(i, i + eachCreatN));
  //   }
  // }

  // async createByFrame(cfgs: UniqueCfg[], frame: number = 1) {
  //   return new Promise((resolve, rejct) => {
  //     gdk.Timer.frameOnce(frame, this, () => {
  //       if (cc.isValid(this.node) && this.node.activeInHierarchy) {
  //         cfgs.forEach(c => {
  //           let node = cc.instantiate(this.itemPrefab);
  //           node.parent = this.content;
  //           let ctrl = node.getComponent(UniqueBookItemCtrl);
  //           ctrl.updateView(c);
  //         })
  //       }
  //       resolve(true);
  //     })
  //   });
  // }
}
