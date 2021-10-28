import ArenaHonorModel from '../../../common/models/ArenaHonorModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagType } from '../../../common/models/BagModel';


/**
 * enemy荣耀巅峰赛竞猜投注结果界面
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-09 17:54:24
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenaHonor/ArenaHonorGuessResultViewCtrl")
export default class ArenaHonorGuessResultViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    winNode: cc.Node = null;

    @property(cc.Node)
    loseNode: cc.Node = null;

    rmsg: icmsg.ArenaHonorExitRsp;
    get model(): ArenaHonorModel { return ModelManager.get(ArenaHonorModel); }
    onEnable() {
        this.rmsg = this.args[0];
        if (this.rmsg.guess == this.rmsg.winner) {
            this.winNode.active = true;
            this.loseNode.active = false;
            let c = this.winNode.getChildByName('UiSlotItem').getComponent(UiSlotItem);
            let itemId = this.rmsg.rewards[0].typeId;
            let itemNum = this.rmsg.rewards[0].num
            c.updateItemInfo(itemId, itemNum);
            c.itemInfo = {
                series: null,
                itemId: itemId,
                itemNum: itemNum,
                type: BagType.MONEY,
                extInfo: null
            };
        }
        else {
            this.loseNode.active = true;
            this.winNode.active = false;
            GlobalUtil.setSpriteIcon(this.node, cc.find('layout/icon', this.loseNode), GlobalUtil.getIconById(31));
            cc.find('layout/num', this.loseNode).getComponent(cc.Label).string = `${GlobalUtil.numberToStr2(this.model.guessInfo.score, true)}`;
        }
    }

    onDisable() {
    }
}
