import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import NetManager from '../../../common/managers/NetManager';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Copycup_prizeCfg } from '../../../a/config';

/** 
 * @Description: 新奖杯模式章节奖励Item
 * @Author: yaozu.hu  
 * @Date: 2020-08-20 11:06:18 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:37:56
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/SubEliteGroupRewardItemCtrl")
export default class SubEliteGroupRewardItemCtrl extends cc.Component {

    @property(cc.Node)
    iconNode: cc.Node = null;
    @property(UiSlotItem)
    slot: UiSlotItem = null;
    @property(cc.Node)
    over: cc.Node = null;
    @property(cc.Node)
    onNode: cc.Node = null;

    @property(cc.Animation)
    itemAnim: cc.Animation = null;

    @property(cc.Button)
    itemBtn: cc.Button = null;

    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.Node)
    red: cc.Node = null;

    cfg: Copycup_prizeCfg;

    send: boolean = false;
    initData(cfg: Copycup_prizeCfg, lock: boolean, over: boolean) {
        this.cfg = cfg;
        this.onNode.active = !lock;
        this.over.active = over;
        this.red.active = false;
        let itemId = cfg.drop[0][0];
        let num = cfg.drop[0][1];
        if (lock) {
            this.slot.itemInfo = {
                itemId: itemId,
                series: itemId,
                type: BagUtils.getItemTypeById(itemId),
                itemNum: num,
                extInfo: null,
            };
        }
        this.slot.updateItemInfo(itemId, num);
        GlobalUtil.setAllNodeGray(this.iconNode, lock ? 1 : 0);
        this.itemAnim.stop("reward_shake");
        //this.itemBtn.interactable = false;
        this.send = false;
        if (!lock && !over) {
            this.itemAnim.play('reward_shake');
            //this.itemBtn.interactable = true;
            this.red.active = true;
            this.send = true;
        }
        this.num.string = cfg.cup + ''
    }

    onDisable() {
        this.cfg = null;
    }

    itemClick() {
        if (this.send) {
            //发送领取奖励请求
            let msg = new icmsg.DungeonElitesChapterRewardsReq();
            msg.id = this.cfg.id;
            msg.copyId = this.cfg.copy_id;
            NetManager.send(msg);
        }
    }
}
