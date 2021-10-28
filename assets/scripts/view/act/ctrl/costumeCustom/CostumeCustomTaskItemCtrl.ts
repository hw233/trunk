import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import TaskUtil from '../../../task/util/TaskUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Costume_globalCfg, Costume_missionCfg } from '../../../../a/config';
import { RewardType } from '../../../../common/widgets/TaskRewardCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-21 15:33:45 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/costumeCustom/CostumeCustomTaskItemCtrl")
export default class CostumeCustomTaskItemCtrl extends UiListItem {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Label)
    desc: cc.Label = null;

    @property(cc.Node)
    progressNode: cc.Node = null;

    @property(cc.Node)
    getBtn: cc.Node = null;

    @property(cc.Node)
    goBtn: cc.Node = null;

    @property(cc.Node)
    mask: cc.Node = null;

    cfg: Costume_missionCfg;
    updateView() {
        this.cfg = this.data;
        this.desc.string = this.cfg.desc;
        //slot
        let itemId = ConfigManager.getItemByField(Costume_globalCfg, 'key', 'show_item').value[0];
        let rewards = [[itemId, this.cfg.score], ...this.cfg.rewards];
        this.content.removeAllChildren();
        rewards.forEach(r => {
            let item = cc.instantiate(this.itemPrefab);
            item.parent = this.content;
            let ctrl = item.getComponent(UiSlotItem);
            ctrl.updateItemInfo(r[0], r[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: r[0],
                itemNum: r[1],
                type: BagUtils.getItemTypeById(r[0]),
                extInfo: null
            };
        });
        //progress
        let [hasNum, maxNum] = TaskUtil.getTaskFinishNum(this.cfg.task_id);
        cc.find('num', this.progressNode).getComponent(cc.Label).string = `${hasNum}/${maxNum}`;
        cc.find('bar', this.progressNode).width = Math.max(0, 150 * (hasNum / maxNum));
        //state
        this._updateState();
    }

    onGoBtnClick() {
        if (JumpUtils.ifSysOpen(this.cfg.forward)) {
            gdk.panel.hide(PanelId.CostumeCustomMain);
            JumpUtils.openView(this.cfg.forward);
        }
    }

    onGetBtnClick() {
        let req = new icmsg.MissionRewardReq();
        req.kind = 1;
        req.type = 21;
        req.id = this.cfg.task_id;
        NetManager.send(req, (resp: icmsg.MissionRewardRsp) => {
            let itemId = ConfigManager.getItemByField(Costume_globalCfg, 'key', 'show_item').value[0];
            let goods = new icmsg.GoodsInfo();
            goods.typeId = itemId;
            goods.num = this.cfg.score;
            let n = cc.find('progress/szdz_yuanpan', this.node.parent.parent.parent.parent);
            let worldPos = n.parent.convertToWorldSpaceAR(n.getPosition());
            let extraFlyInfo = {};
            extraFlyInfo[itemId] = worldPos;
            GlobalUtil.openRewadrView([...resp.list, goods], RewardType.NORMAL, extraFlyInfo);
        }, this);
    }

    _updateState() {
        this.getBtn.active = false;
        this.mask.active = false;
        this.goBtn.active = false;
        if (TaskUtil.getTaskAwardState(this.cfg.task_id)) {
            this.mask.active = true;
            return;
        }
        if (TaskUtil.getTaskState(this.cfg.task_id)) {
            this.getBtn.active = true;
            return;
        }
        if (this.cfg.forward > 0) {
            this.goBtn.active = true;
        }
    }
}
