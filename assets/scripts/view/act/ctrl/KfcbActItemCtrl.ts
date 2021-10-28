import ActivityModel from '../model/ActivityModel';
import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { ActivityEventId } from '../enum/ActivityEventId';
import { KfcbActItemInfo } from './KfcbActViewCtrl';

/** 
  * @Description: 
  * @Author: luoyong 
  * @Date: 2019-09-12 14:24:36
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-31 15:45:59
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/KfcbActItemCtrl")
export default class KfcbActItemCtrl extends UiListItem {


  @property(UiSlotItem)
  slots: UiSlotItem[] = [];

  @property(cc.Node)
  getBtn: cc.Node = null;

  @property(cc.Node)
  hasGet: cc.Node = null;

  @property(cc.Node)
  mask: cc.Node = null;

  @property(cc.Node)
  rankIcon: cc.Node = null;

  @property(cc.Node)
  targetFlag: cc.Node = null;

  @property(cc.Label)
  rankStr: cc.Label = null;

  @property(cc.LabelOutline)
  rankStrLine: cc.LabelOutline = null;

  info: KfcbActItemInfo

  get model(): ActivityModel {
    return ModelManager.get(ActivityModel)
  }

  rankStrColor: cc.Color[] = [cc.color('#BB0200'), cc.color('#003350'), cc.color('#2F2001'), cc.color('#794D30')]


  updateView() {
    this.info = this.data
    let rewards = this.info.cfg.rewards
    let path = "view/act/texture/kfcb/kfcb_huizhangdi0"
    GlobalUtil.setSpriteIcon(this.node, this.rankIcon, `${path}${this.info.cfg.color}`);
    this.rankStrLine.color = this.rankStrColor[this.info.cfg.color - 1];
    this.rankStr.string = this.info.cfg.rank == 1 ? '第' + this.info.cfg.rank : '前' + this.info.cfg.rank

    for (let i = 0; i < this.slots.length; i++) {
      this.slots[i].node.active = false
      if (rewards[i]) {
        this.slots[i].node.active = true
        this.slots[i].starNum = 0;
        this.slots[i].updateItemInfo(rewards[i][0], rewards[i][1])
        let cfg = BagUtils.getConfigById(rewards[i][0])
        if (cfg) {
          this.slots[i].itemInfo = {
            itemId: rewards[i][0],
            series: 0,
            type: BagUtils.getItemTypeById(rewards[i][0]),
            itemNum: 1,
            extInfo: null,
          }
        }
      }
    }

    this.getBtn.active = false
    this.hasGet.active = false
    this.targetFlag.active = false


    if (this.info.isLight) {
      // this.mask.active = false
      this.targetFlag.active = true
    } else {
      // this.mask.active = true
    }

    if (this.info.canGet) {
      this.mask.active = false
      this.targetFlag.active = false

      if (this.info.hasGet) {
        this.getBtn.active = false
        this.hasGet.active = true
      } else {
        this.getBtn.active = true
        this.hasGet.active = false
      }
    } else {
      if (this.info.isEnd) {
        this.mask.active = true
      } else {
        this.mask.active = false
      }
    }
  }

  getReward() {
    if (!this.info.hasGet && this.info.canGet && this.info.day) {
      let rewards = this.info.cfg.rewards
      let msg = new icmsg.ActivityRankingRewardReq()
      msg.day = this.info.day
      NetManager.send(msg, (data: icmsg.ActivityRankingRewardRsp) => {
        if (data.day == 3) {
          this.model.kfcb_rewarded3 = true
        }
        if (data.day == 7) {
          this.model.kfcb_rewarded7 = true
        }
        let awards: icmsg.GoodsInfo[] = []
        for (let index = 0; index < rewards.length; index++) {
          let award = new icmsg.GoodsInfo()
          award.typeId = rewards[index][0]
          award.num = rewards[index][1]
          awards.push(award)
        }
        GlobalUtil.openRewadrView(awards)
        gdk.e.emit(ActivityEventId.UPDATE_KFCB_ACT_REWARD)
      })
    }
  }

}
