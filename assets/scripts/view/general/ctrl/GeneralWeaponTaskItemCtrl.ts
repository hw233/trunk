import BagUtils from '../../../common/utils/BagUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import SdkTool from '../../../sdk/SdkTool';
import TaskModel from '../../task/model/TaskModel';
import UiListItem from '../../../common/widgets/UiListItem';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { General_weapon_missionCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-12 18:27:46 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/general/GeneralWeaponTaskItemCtrl')
export default class GeneralWeaponTaskItemCtrl extends UiListItem {
    @property(cc.Label)
    taskName: cc.Label = null;

    @property(cc.Label)
    progress: cc.Label = null;

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Node)
    goBtn: cc.Node = null;

    @property(cc.Node)
    getBtn: cc.Node = null;

    @property(cc.Node)
    recived: cc.Node = null;

    cfg: General_weapon_missionCfg;
    state: number; //0：不可领取 1：可领取 2：已领取

    onDisable() {
        GuideUtil.bindGuideNode(17005);
        NetManager.targetOff(this);
    }

    updateView() {
        this.cfg = this.data.cfg;
        this.state = this.data.state;
        this.taskName.string = this.cfg.desc;
        this.slot.updateItemInfo(this.cfg.reward1[0], this.cfg.reward1[1]);
        this.slot.itemInfo = {
            series: null,
            itemId: this.cfg.reward1[0],
            itemNum: this.cfg.reward1[1],
            type: BagUtils.getItemTypeById(this.cfg.reward1[0]),
            extInfo: null
        };
        // let guideIds = [17001, 17002, 17003, 17004];
        // let idx = [1, 2, 3, 4].indexOf(this.cfg.id);
        // if (idx != - 1) {
        //     GuideUtil.bindGuideNode(guideIds[idx], this.goBtn)
        // }
        // gdk.Timer.callLater(this, () => {
        if (this.data.isGuide) {
            GuideUtil.bindGuideNode(17005, this.getBtn);
            GuideUtil.activeGuide('weaponTask#get');
        }
        // })
        //todo
        this._updateState();
        this._updateProgress();
    }

    onGoBtnClick() {
        //todo
        gdk.panel.hide(PanelId.GeneralWeaponTask);
        JumpUtils.openView(this.cfg.forward);
    }

    onGetBtnClick() {
        //todo
        let req = new icmsg.MissionWeaponTaskAwardReq();
        req.id = this.cfg.id;
        NetManager.send(req, (resp: icmsg.MissionWeaponTaskAwardRsp) => {
            GlobalUtil.openRewadrView(resp.list);
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.state = 2;
            this._updateState();
        }, this);
    }

    _updateState() {
        this.goBtn.active = false;
        this.getBtn.active = false;
        this.recived.active = false;
        let node = [this.goBtn, this.getBtn, this.recived];
        node[this.state].active = true;
    }

    _updateProgress() {
        let model = ModelManager.get(TaskModel);
        let weaponDatas = model.weaponDatas
        let args = 0;
        if (cc.js.isNumber(this.cfg.args) && this.cfg.args > 0) {
            args = this.cfg.args
        }
        let curNum = 0;
        if (weaponDatas[this.cfg.target] && weaponDatas[this.cfg.target][args]) {
            curNum = weaponDatas[this.cfg.target][args].num
        }
        let color = ['#90FF01', '#FFE4D0']; //已完成/未完成
        let maxNum = [202, 204, 205, 212, 214, 218].indexOf(this.cfg.target) != -1 ? 1 : this.cfg.number;
        curNum = [202, 204, 205, 212, 214, 218].indexOf(this.cfg.target) != -1 ? (curNum >= this.cfg.number ? 1 : 0) : curNum;
        if (this.cfg.target == 119) {
            //充值类任务,多语言需转换货币单位
            curNum = SdkTool.tool.getRealRMBCost(curNum);
            maxNum = SdkTool.tool.getRealRMBCost(maxNum);
        }
        let info = [curNum, maxNum];
        this.progress.string = `(${Math.min(info[0], info[1])}/${info[1]})`;
        this.progress.node.color = new cc.Color().fromHEX(info[0] >= info[1] ? color[0] : color[1]);
    }
}
