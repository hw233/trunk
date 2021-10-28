import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import SdkTool from '../../../sdk/SdkTool';
import TaskModel from '../model/TaskModel';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { GrowTaskItemType } from './GrowTaskViewCtrl';
/**
 * @Description: 成长任务子项
 * @Author: yaozu.hu
 * @Date: 2019-10-09 17:39:12
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-22 10:11:33
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/GrowTaskItemCtrl")
export default class GrowTaskItemCtrl extends UiListItem {

    @property(cc.Label)
    titleLab: cc.Label = null;

    @property(cc.Node)
    btnGo: cc.Node = null;

    @property(cc.Node)
    btnGet: cc.Node = null;

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Node)
    btnHasGet: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    progressNode: cc.Node = null;

    info: GrowTaskItemType = null
    goId: any = 0;

    updateView() {
        this.info = this.data
        // this.slot.itemId = null;
        this.goId = this.info.cfg.forward
        let titleLab = this.info.cfg.desc.replace("{number}", this.info.cfg.number + '')
        this.titleLab.string = titleLab;
        this._initTasskData()
        this._updateProgress();
        if (this.info.state == 2) {
            this.setHasGetState()
        } else {
            if (this.info.state == 1) {
                this.setGetState()
            } else {
                this.setGoState()
            }
            // GlobalUtil.setAllNodeGray(this.slot.node, 0);
        }
    }

    _updateProgress() {
        let model = TaskModel.get()
        let growDatas = model.GrowDatas
        let args = 0;
        if (cc.js.isNumber(this.info.cfg.args) && this.info.cfg.args > 0) {
            args = this.info.cfg.args
        }
        let curNum = 0;
        if (growDatas[this.info.cfg.target] && growDatas[this.info.cfg.target][args]) {
            curNum = growDatas[this.info.cfg.target][args].num
        }
        let maxBarLen = 150;
        let color = ['#90FF01', '#FFE4D0']; //已完成/未完成
        let bar = cc.find('progress/bar', this.progressNode);
        let label = cc.find('label', this.progressNode).getComponent(cc.Label);
        let maxNum = [202, 204, 205, 212, 214, 218].indexOf(this.info.cfg.target) != -1 ? 1 : this.info.cfg.number;
        curNum = [202, 204, 205, 212, 214, 218].indexOf(this.info.cfg.target) != -1 ? (curNum >= this.info.cfg.number ? 1 : 0) : curNum;
        if (this.info.cfg.target == 119) {
            //充值类任务,多语言需转换货币单位
            curNum = SdkTool.tool.getRealRMBCost(curNum);
            maxNum = SdkTool.tool.getRealRMBCost(maxNum);
        }
        let info = [curNum, maxNum];
        label.string = `${Math.min(info[0], info[1])}/${info[1]}`;
        label.node.color = new cc.Color().fromHEX(info[0] >= info[1] ? color[0] : color[1]);
        bar.width = Math.min(maxBarLen, maxBarLen * (info[0] / info[1]));
    }


    /** 前往*/
    setGoState() {
        this.btnGo.active = true
        this.btnHasGet.active = false
        this.btnGet.active = false
    }

    /**领取*/
    setGetState() {
        this.btnGo.active = false
        this.btnHasGet.active = false
        this.btnGet.active = true
    }

    /** 已领取*/
    setHasGetState() {
        this.btnGo.active = false
        this.btnHasGet.active = true
        this.btnGet.active = false
    }

    _initTasskData() {
        if (!this.info) return;
        if (!this.info.cfg) return;
        if (!this.info.cfg.reward1) return;
        let args = this.info.cfg.reward1;
        this.slot.updateItemInfo(args[0], args[1]);
        this.slot.itemInfo = {
            itemId: args[0],
            series: 0,
            type: BagUtils.getItemTypeById(args[0]),
            itemNum: args[1],
            extInfo: null,
        };
    }

    btnClick() {
        if (this.info.state == 0) {
            let node = gdk.gui.getCurrentView();
            let panelId = gdk.Tool.getResIdByNode(node);
            if (panelId == PanelId.PveScene.__id__ || panelId == PanelId.PvpScene.__id__) {
                GlobalUtil.showMessageAndSound(gdk.i18n.t('i18n:TASK_TIP1'))
                return;
            }
            gdk.panel.hide(PanelId.GrowMenuView)
            if (this.goId == 2600 && this.info.cfg.args) {
                // JumpUtils.openMainPvePanel(this.info.cfg.args)
                JumpUtils.openMainlineSelectStage(this.info.cfg.args);
            }
            else {
                JumpUtils.openView(this.goId)
            }
        } else if (this.info.state == 1) {
            //领取奖励
            //cc.log('领取通关奖励' + this.info.cfg.id)
            this._playReceiveAni();
            gdk.Timer.once(200, this, () => {
                let msg = new icmsg.MissionGrowTaskAwardReq();
                msg.id = this.info.cfg.id;
                NetManager.send(msg)
            });
        }
    }

    _playReceiveAni() {
        //飞行特效
        let slot = this.node.parent.parent.parent.getChildByName('UiSlotItem');
        let icon = slot.getChildByName('icon');

        let tempPos = icon.parent.convertToWorldSpaceAR(icon.getPosition());
        let posInItem = this.node.getChildByName('bg').convertToNodeSpaceAR(tempPos);
        let btnPos = this.btnGet.position;
        let v = new cc.Vec2(posInItem.x - btnPos.x, posInItem.y - btnPos.y);
        let angle = new cc.Vec2(0, 1).angle(v);
        let len = v.mag();
        let scaleY = len / (384 - 110); //384 为特效飞行总长度

        let worldPos = this.spine.node.parent.convertToWorldSpaceAR(this.spine.node.position);
        let posInSlot = slot.convertToNodeSpaceAR(worldPos);
        let tempSpine = cc.instantiate(this.spine.node);
        tempSpine.position = posInSlot;
        tempSpine.parent = slot;
        tempSpine.active = true;
        tempSpine.angle = 180 * angle / Math.PI - 6;
        // tempSpine.scaleY = scaleY;
        tempSpine.setScale(scaleY, scaleY);
        tempSpine.getComponent(sp.Skeleton).setCompleteListener(() => {
            tempSpine.getComponent(sp.Skeleton).setCompleteListener(null);
            tempSpine.removeFromParent(false);
        })
        tempSpine.getComponent(sp.Skeleton).setAnimation(0, 'stand4', true);
        //点击特效
        let spine = this.btnGet.getChildByName('spine').getComponent(sp.Skeleton);
        spine.node.active = true;
        spine.setCompleteListener(() => {
            spine.setCompleteListener(null);
            spine.node.active = false;
        });
        spine.setAnimation(0, 'stand3', true);
    }
}
