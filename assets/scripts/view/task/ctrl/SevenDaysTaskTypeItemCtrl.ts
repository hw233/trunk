import GlobalUtil from '../../../common/utils/GlobalUtil';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import UiListItem from '../../../common/widgets/UiListItem';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-14 18:24:30 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/SevenDaysTaskTypeItemCtrl")
export default class SevenDaysTaskTypeItemCtrl extends UiListItem {
  @property(cc.Node)
  selectNode: cc.Node = null;

  @property(cc.Node)
  normalNode: cc.Node = null;

  updateView() {
    let id: number = this.data;
    let str = id >= 10 ? `${id}` : `0${id}`;
    GlobalUtil.setSpriteIcon(this.node, this.selectNode.getChildByName('titleSprite'), `view/task/texture/seven/title_${str}_select`);
    GlobalUtil.setSpriteIcon(this.node, this.normalNode.getChildByName('titleSprite'), `view/task/texture/seven/title_${str}_normal`);
    this._setSelectStatus(this.ifSelect);
    this.node.getChildByName('RedPoint').active = RedPointUtils.has_unget_seven_days_reward(this.list['selectDay'], id);
  }

  _itemSelect() {
    this._setSelectStatus(this.ifSelect);
  }

  _setSelectStatus(v: boolean) {
    this.selectNode.active = v;
    this.normalNode.active = !v;
  }

  _itemClick() {

  }
}
