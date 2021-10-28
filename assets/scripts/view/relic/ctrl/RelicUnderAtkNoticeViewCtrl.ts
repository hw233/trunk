import ModelManager from '../../../common/managers/ModelManager';
import RelicModel from '../model/RelicModel';
import RelicUnderAtkNoticeItemCtrl from './RelicUnderAtkNoticeItemCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-02-04 18:04:38 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicGrabRecordViewCtrl")
export default class RelicGrabRecordViewCtrl extends gdk.BasePanel {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;

  @property(cc.Node)
  content: cc.Node = null;

  @property(cc.Prefab)
  itemPrefab: cc.Prefab = null;

  get relicModel(): RelicModel { return ModelManager.get(RelicModel); }

  onEnable() {
  }

  onDisable() {
    this.relicModel.atkNoticeList = [];
    this.relicModel.miniChatatkNoticeVisible = false;
  }

  @gdk.binding("relicModel.atkNoticeList")
  _updateView() {
    let list = this.relicModel.atkNoticeList;
    list.sort((a, b) => { return b.noticeTime - a.noticeTime; });
    list.forEach(l => {
      let item = cc.instantiate(this.itemPrefab);
      let ctrl = item.getComponent(RelicUnderAtkNoticeItemCtrl)
      item.parent = this.content;
      ctrl.init(l);
    })
  }
}
