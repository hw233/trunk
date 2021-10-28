import GlobalUtil from '../../../../common/utils/GlobalUtil';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-08-16 13:38:59 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-26 11:48:18
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/geneConnect/GeneConResultViewCtrl")
export default class GeneConResultViewCtrl extends gdk.BasePanel {
  @property(cc.Node)
  titleNode: cc.Node = null;

  @property(cc.Node)
  oldLabs: cc.Node = null;

  @property(cc.Node)
  newLabs: cc.Node = null;

  onEnable() {
    let resp: icmsg.HeroMysticLinkRsp | icmsg.HeroMysticUnLinkRsp = this.args[0];
    GlobalUtil.setSpriteIcon(this.node, this.titleNode, `view/role/texture/geneConnect/smz_${resp instanceof icmsg.HeroMysticLinkRsp ? 'lianjiechenggong' : 'jiechuchenggong'}`);
    let infos = [resp.bf, resp.af];
    [this.oldLabs, this.newLabs].forEach((n, i) => {
      let info = infos[i];
      n.children.forEach((l, idx) => {
        let lab = l.getComponent(cc.Label);
        let str = '';
        switch (idx) {
          case 0:
            str = info.power + '';
            break;
          case 1:
            let maxStarNode = cc.find('star/maxstar', n);
            if (info.star >= 12) {
              str = '';
              maxStarNode.active = true;
              maxStarNode.getChildByName('maxStarLb').getComponent(cc.Label).string = `${info.star - 11}`;
            } else {
              maxStarNode.active = false;
              str = info.star > 5 ? '1'.repeat(info.star - 5) : '0'.repeat(info.star);
            }
            break;
          case 2:
            str = info.level + '';
            break;
          case 3:
            str = info.atk + '';
            break;
          case 4:
            str = info.def + '';
            break;
          case 5:
            str = info.hp + '';
            break;
          default:
            break;
        }
        lab.string = str;
        if (i == 1 && idx !== 0 && idx !== 1) {
          lab.node.color = cc.color().fromHEX(resp instanceof icmsg.HeroMysticLinkRsp ? '#00FF00' : '#FF0000');
        }
      })
    });
  }
}
