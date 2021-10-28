import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import ShaderHelper from '../../../../common/shader/ShaderHelper';
import StoreModel from '../../model/StoreModel';
import StoreUtils from '../../../../common/utils/StoreUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import { BagItem } from '../../../../common/models/BagModel';
import { Gift_powerCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-02 14:33:20 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/oneDollarGift/OneDollarGiftRewardItemCtrl")
export default class OneDollarGiftRewardItemCtrl extends UiListItem {
  @property(cc.Label)
  targetChapterLabel: cc.Label = null;

  @property(cc.Node)
  leftChapterTips: cc.Node = null;

  @property(cc.Label)
  rewardDec: cc.Label = null;

  @property(cc.Node)
  rewardNode: cc.Node = null;

  @property(cc.Node)
  progressFlag: cc.Node = null;

  @property(sp.Skeleton)
  spine: sp.Skeleton = null;

  state: number = 0; // 0-未完成 1-可领取 2-已领取
  isCurTask: boolean = false; //当前任务是否正在进行

  onDisable() {
    // this.progressFlag.stopAllActions();
  }

  updateView() {
    let cfg: Gift_powerCfg = this.data;
    let preLvCfg = ConfigManager.getItemByField(Gift_powerCfg, 'index', cfg.index - 1);
    this.targetChapterLabel.string = `${cfg.power}`;
    this.rewardDec.string = cfg.name;
    let curPower = ModelManager.get(RoleModel).power;
    this.leftChapterTips.active = false;
    this.isCurTask = false;
    if (curPower < cfg.power) {
      if (!preLvCfg || preLvCfg.power <= curPower) {
        this.leftChapterTips.active = true;
        this.leftChapterTips.getChildByName('chapterLeftNum').getComponent(cc.Label).string = `${cfg.power - curPower}战力`;
        this.isCurTask = true;
      }
    }
    this.updateRewardNode();
    this.setProgressFlag();
  }

  updateRewardNode() {
    let curPower = ModelManager.get(RoleModel).power;
    let mask = this.node.getChildByName('mask');
    let getFlag = this.rewardNode.getChildByName('sub_lingqu');
    let num = this.rewardNode.getChildByName('num').getComponent(cc.Label);
    let icon = this.rewardNode.getChildByName('icon')
    let shader1 = num.node.getComponent(ShaderHelper);
    let shader2 = this.rewardNode.getChildByName('hdck_txt02').getComponent(ShaderHelper);
    GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getIconById(this.data.reward[0][0]));
    num.string = this.data.reward[0][1] + '';
    mask.active = false;
    getFlag.active = false;
    GlobalUtil.setAllNodeGray(this.rewardNode, 0);
    shader1.enabled = false;
    shader2.enabled = false;

    if (StoreUtils.getOneDollarGiftRewardState(this.data.index)) {
      mask.active = true;
      getFlag.active = true;
      this.state = 2;
      this.spine.node.active = false;
    }
    else {
      if (curPower < this.data.power) {
        GlobalUtil.setAllNodeGray(this.rewardNode, 1);
        shader1.enabled = true;
        shader2.enabled = true;
        this.state = 0;
        this.spine.node.active = false;
      }
      else {
        this.state = 1;
        this.spine.node.active = true;
      }
    }
  }

  /**
   * 设置进度状态标志
   */
  setProgressFlag() {
    this.progressFlag.active = false;
    let curPower = ModelManager.get(RoleModel).power;
    if (this.data.power <= curPower) {
      this.progressFlag.active = true;
      GlobalUtil.setSpriteIcon(this.node, this.progressFlag, `view/act/texture/kffl/hdck_jingdutiao04`);
    }
    else {
      this.progressFlag.active = false;
    }
  }

  onRewardClick() {
    if (!ModelManager.get(StoreModel).isBuyOneDollarGift) {
      gdk.gui.showMessage(gdk.i18n.t('i18n:ONE_DOLLAR_GIFT_TIP3'));
      return;
    }
    if (this.state != 1) {
      let itemInfo: BagItem = {
        series: 0,
        itemId: this.data.reward[0][0],
        itemNum: 1,
        type: BagUtils.getItemTypeById(this.data.reward[0][0]),
        extInfo: null,
      }
      GlobalUtil.openItemTips(itemInfo);
    }
    else {
      let req = new icmsg.StoreMiscGiftPowerAwardReq();
      req.index = this.data.index;
      NetManager.send(req, (resp: icmsg.StoreMiscGiftPowerAwardRsp) => {
        let mask = this.node.getChildByName('mask');
        let getFlag = this.rewardNode.getChildByName('sub_lingqu');
        mask.active = true;
        getFlag.active = true;
        this.state = 2;
        this.spine.node.active = false;
        GlobalUtil.openRewadrView(resp.list);
      });
    }
  }
}
