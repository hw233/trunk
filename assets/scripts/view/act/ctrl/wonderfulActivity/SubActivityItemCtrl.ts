import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Activity_upgradeCfg } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { BagType } from '../../../../common/models/BagModel';
import { subActType } from './SubActivityViewCtrl';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wonderfulActivity/SubActivityItemCtrl")
export default class SubActivityItemCtrl extends UiListItem {
    @property([cc.Node])
    titleNodes: cc.Node[] = [];

    @property(cc.RichText)
    progressLab: cc.RichText = null;

    @property(cc.Node)
    goBtn: cc.Node = null;

    @property(cc.Node)
    getBtn: cc.Node = null;

    @property(cc.Node)
    passBtn: cc.Node = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    type: subActType;
    sysId: number;
    cfg: any;
    updateView() {
        [this.type, this.sysId, this.cfg] = [this.data.type, this.data.sysId, this.data.cfg];
        let map = [[1, 2, 3, 4], [5], [6], [7]];
        this.titleNodes.forEach((node, idx) => {
            if (map[idx].indexOf(this.type) != -1) {
                node.active = true;
                node.getChildByName('num').getComponent(cc.Label).string = this.cfg.number;
                if (idx == 0) {
                    GlobalUtil.setSpriteIcon(this.node, node.getChildByName('title'), `view/act/texture/wonderfulActivitys/itemTitle${this.type}`);
                }
                else if (idx == 2) {
                    node.getChildByName('star').getComponent(cc.Label).string = this.cfg.args;
                }
                else if (idx == 3) {
                    let model = ModelManager.get(ActivityModel);
                    let info = model.excitingActInfo || {};
                    let rounds = this.cfg['rounds'] || 0;
                    let args = this.cfg.args || 0;
                    let num;
                    if (info[this.type]
                        && info[this.type][rounds]
                        && info[this.type][rounds][this.cfg.target]) {
                        num = info[this.type][rounds][this.cfg.target][args];
                    }
                    else {
                        num = ModelManager.get(RoleModel).level;
                    }
                    node.getChildByName('progress').getComponent(cc.Label).string = `(${num}/${this.cfg.number})`;
                    if (this.cfg instanceof Activity_upgradeCfg) {
                        //升级有礼 任务有效期
                        node.getChildByName('progress').color = cc.color().fromHEX(ActUtil.ifActOpen(this.cfg.activityid) ? '#87EF50' : '#808080')
                    }
                }
            }
            else {
                node.active = false;
            }
        });
        let rewards = this.cfg.rewards;
        this.content.removeAllChildren();
        rewards.forEach(reward => {
            let slot = cc.instantiate(this.itemPrefab);
            let ctrl = slot.getComponent(UiSlotItem);
            slot.parent = this.content;
            if (BagUtils.getItemTypeById(reward[0]) == BagType.HERO) ctrl.isCanPreview = true;
            ctrl.updateItemInfo(reward[0], reward[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: reward[0],
                itemNum: reward[1],
                type: BagUtils.getItemTypeById(reward[0]),
                extInfo: null,
            };
        });
        this.content.getComponent(cc.Layout).updateLayout();
        this.scrollView.scrollToTopLeft();
        this.scrollView.enabled = rewards.length >= 5;
        this._updateState();
    }

    onGoBtnClick() {
        if (JumpUtils.openView(this.cfg.forward, true)) {
            if (gdk.panel.isOpenOrOpening(PanelId.WonderfulActivityView)) {
                gdk.panel.hide(PanelId.WonderfulActivityView);
            }
        }
    }

    onGetBtnClick() {
        if (!JumpUtils.ifSysOpen(this.sysId)) {
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            return;
        }
        let info = ModelManager.get(ActivityModel).excitingActOfUpgradeLimitInfo[this.cfg.taskid];
        if (!info && info != 0) info = this.cfg.limit;
        if (info <= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:EXC_ACT_TIP1"));
            this._updateState();
            return;
        }
        let req = new icmsg.ExcitingActivityRewardsReq();
        req.type = this.type;
        req.taskId = this.cfg.taskid;
        NetManager.send(req, (resp: icmsg.ExcitingActivityRewardsRsp) => {
            if (cc.isValid(this.node)) {
                this.getBtn.active = false;
                this.goBtn.active = false;
                this.mask.active = true;
                if (this.type == subActType.upgrade) {
                    this.progressLab.node.active = true;
                    let info = ModelManager.get(ActivityModel).excitingActOfUpgradeLimitInfo[this.cfg.taskid];
                    if (!info && info != 0) info = this.cfg.limit;
                    info -= 1;
                    this.progressLab.string = info <= 0 ? `${gdk.i18n.t("i18n:EXC_ACT_TIP2")}` : `${StringUtils.format(gdk.i18n.t("i18n:EXC_ACT_TIP3"), `(${info}/${this.cfg.limit})`)}`;
                }
                else {
                    this.progressLab.node.active = false;
                }
            }
            GlobalUtil.openRewadrView(resp.rewards);
        });
    }

    _updateState() {
        let model = ModelManager.get(ActivityModel);
        let info = model.excitingActInfo || {};
        let rounds = this.cfg['rounds'] || 0;
        let args = this.cfg.args || 0;
        let num;
        if (info[this.type]
            && info[this.type][rounds]
            && info[this.type][rounds][this.cfg.target]) {
            num = info[this.type][rounds][this.cfg.target][args];
        }
        else {
            num = 0;
        }
        this.progressLab.string = `(${Math.min(this.cfg.number, num)}/${this.cfg.number})`;
        this.progressLab.node.active = true;
        this.passBtn.active = false;
        this.progressLab.node.y = -66;
        if (num >= this.cfg.number) {
            if (model.excitingRewards[this.cfg.taskid]) {
                this.getBtn.active = false;
                this.goBtn.active = false;
                this.mask.active = true;
                this.progressLab.node.active = false;
            }
            else {
                this.goBtn.active = false;
                this.mask.active = false;
                this.getBtn.active = true;
            }
        }
        else {
            this.goBtn.active = true;
            this.mask.active = false;
            this.getBtn.active = false;
        }

        if (this.type == subActType.upgrade) {
            this.progressLab.node.active = true;
            let info = model.excitingActOfUpgradeLimitInfo[this.cfg.taskid];
            if (!info && info != 0) info = this.cfg.limit;
            if (info <= 0) {
                this.progressLab.string = gdk.i18n.t("i18n:EXC_ACT_TIP2");
                // this.progressLab.string = `${StringUtils.format(gdk.i18n.t("i18n:EXC_ACT_TIP3"), this._getUpgradeLeftNumStr(info))}`;
                if (!model.excitingRewards[this.cfg.taskid]) {
                    this.progressLab.node.y = -96;
                    this.getBtn.active = false;
                    this.goBtn.active = false;
                    this.mask.active = false;
                }
            }
            else {
                // this.progressLab.string = `${StringUtils.format(gdk.i18n.t("i18n:EXC_ACT_TIP3"), info)}`;
                this.progressLab.string = `${StringUtils.format(gdk.i18n.t("i18n:EXC_ACT_TIP3"), `(${info}/${this.cfg.limit})`)}`;
                if (num < this.cfg.number && !ActUtil.ifActOpen(36)) {
                    this.passBtn.active = true;
                    this.goBtn.active = false;
                    this.getBtn.active = false;
                    this.goBtn.active = false;
                    this.mask.active = false;
                }
            }
        }
    }

    // _getUpgradeLeftNumStr(leftNum) {
    //     let limit = this.cfg.limit;
    //     let radio = leftNum / limit * 100;
    //     let v = ConfigManager.getItemByField(GlobalCfg, 'key', 'color_value').value;
    //     // let color = ['#3cff53', '#fff205', '#ff1200', '#808080']
    //     for (let i = 0; i < v.length; i++) {
    //         if (radio >= v[i]) {
    //             return `(<color=${color[i]}>${leftNum}</>/${limit})`;
    //         }
    //     }
    //     // return `(<color=#CD9F6A>${leftNum}</>/${limit})`;;
    // }
}
