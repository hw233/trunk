import BagUtils from '../../../../common/utils/BagUtils';
import CopyModel from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
 * @Description: 新生存训练 
 * @Author: yaozu.hu
 * @Date: 2020-11-06 11:36:43
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-08 17:12:20
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/survival/InstanceSurvivalHireRewardCtrl")
export default class InstanceSurvivalHireRewardCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    logItem: cc.Prefab = null

    @property(cc.Node)
    rewardLayout: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    list: ListView = null

    get copyModel() { return ModelManager.get(CopyModel); }

    onEnable() {
        this._initListView()
        let msg = new icmsg.SurvivalMerRecordReq()
        NetManager.send(msg, (data: icmsg.SurvivalMerRecordRsp) => {
            GlobalUtil.sortArray(data.list, (a, b) => {
                return b.time - a.time
            })
            this.list.set_data(data.list)
        })

        this.rewardLayout.removeAllChildren();
        this.copyModel.survivalStateMsg.merRewards.forEach(item => {
            let id = item.typeId
            let num = item.num
            let slot = this.createSlot(id, num);
            this.rewardLayout.addChild(slot)
        });
    }


    createSlot(id: number, num: number): cc.Node {
        let slot = cc.instantiate(this.rewardItem);
        slot.scale = 0.8
        let ctrl = slot.getComponent(UiSlotItem);
        ctrl.updateItemInfo(id, num);
        ctrl.itemInfo = {
            series: 0,
            itemId: id,
            itemNum: num,
            type: BagUtils.getItemTypeById(id),
            extInfo: null
        };
        return slot;
    }


    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.logItem,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,

        })
    }

    onGetReward() {
        if (this.rewardLayout.childrenCount == 0) {
            gdk.gui.showMessage("暂时还没有奖励")
            return
        }
        let msg = new icmsg.SurvivalMerRewardsReq()
        NetManager.send(msg, (data: icmsg.SurvivalMerRewardsRsp) => {
            GlobalUtil.openRewadrView(data.rewards)
            this.copyModel.survivalStateMsg.merRewards = []
            this.copyModel.survivalStateMsg = this.copyModel.survivalStateMsg
            this.rewardLayout.removeAllChildren();
        })
    }

}