import BagUtils from '../../../../common/utils/BagUtils';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-30 14:55:09 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/lottery/gene/GeneRecordItemCtrl')
export default class GeneRecordItemCtrl extends cc.Component {
  @property(cc.RichText)
  richlab: cc.RichText = null;

  updateView(data: icmsg.GeneDrawHistory) {
    let info: icmsg.GeneDrawHistory = data;
    let hero = BagUtils.getConfigById(parseInt(info.heroId.toString().slice(0, 6))).name;
    this.richlab.string = `<color=#2ddfc9>${info.playerName}</c><color=#2c8bac>召唤出4星英雄</color><color=#ffd428>${hero}</color>`;
    // this.node.height = this.richlab.node.height + 5;
    this.node.height = this.richlab['_lineCount'] * 32.76;
  }
}
