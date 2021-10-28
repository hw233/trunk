import ActivityModel from '../../../view/act/model/ActivityModel';
import ActUtil from '../../../view/act/util/ActUtil';
import CarnivalUtil from '../../../view/act/util/CarnivalUtil';
import CombineModel from '../../../view/combine/model/CombineModel';
import CombineUtils from '../../../view/combine/util/CombineUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import GeneralModel from '../../../common/models/GeneralModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import SdkTool from '../../../sdk/SdkTool';
import { Carnival_cross_rankCfg, GlobalCfg, TavernCfg } from '../../../a/config';

/** 
 * 顶层信息界面
 * @Author: sthoo.huang 
 * @Date: 2020-08-13 21:36:30
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-08-26 10:11:12
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainTopInfoViewCtrl")
export default class MainTopInfoViewCtrl extends cc.Component {

    @property(cc.Node)
    panelNode: cc.Node = null;

    @property(cc.Prefab)
    activityIconViewPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    rightBtnPrefab: cc.Prefab = null;

    @property(cc.Node)
    tavernIcon: cc.Node = null;

    @property(cc.Node)
    worldTipNode: cc.Node = null;

    @property(cc.Node)
    worldIcon: cc.Node = null;

    @property(cc.Node)
    cServerT: cc.Node = null;

    @property(cc.Node)
    combineServerT: cc.Node = null;

    get generalModel(): GeneralModel { return ModelManager.get(GeneralModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get copyModel(): CopyModel { return ModelManager.get(CopyModel); }
    get activityModel(): ActivityModel { return ModelManager.get(ActivityModel); }
    get combineModel(): CombineModel { return ModelManager.get(CombineModel); }
    _tipShow = false
    activityNode: cc.Node;
    rightBtnNode: cc.Node;

    cServerRankTCfg: Carnival_cross_rankCfg;



    onLoad() {
        this.panelNode.children.forEach(node => {
            gdk.NodeTool.hide(node, false);
        });
    }

    onEnable() {
        gdk.gui.onViewChanged.on(this._onViewChanged, this);
        this._onViewChanged(gdk.gui.getCurrentView());

        let activityModel = this.activityModel
        if (activityModel.roleServerRank && activityModel.roleServerRank.rank >= 1 && activityModel.roleServerRank.rank <= 3) {
            this.cServerT.active = true;
            this.cServerRankTCfg = CarnivalUtil.getCrossRankConfig();
        } else {
            this.cServerT.active = false;
        }
    }

    onDisable() {
        gdk.gui.onViewChanged.targetOff(this);
    }

    onDestroy() {
        gdk.Timer.clearAll(this);
        gdk.Binding.unbind(this);
    }


    _onViewChanged(node: cc.Node) {
        if (!node) return;
        this.hideWorldTipNode()
        let panelId = gdk.Tool.getResIdByNode(node);
        switch (panelId) {
            case PanelId.MainPanel.__id__:
            case PanelId.PveReady.__id__:
                // 显示
                this.panelNode.children.forEach(node => {
                    gdk.NodeTool.show(node);
                });
                if (SdkTool.tool.can_charge) {
                    if (!this.activityNode) {
                        this.activityNode = cc.instantiate(this.activityIconViewPrefab);
                    }
                    this.activityNode.opacity = 255;
                    this.activityNode.parent = this.panelNode;
                }
                if (!this.rightBtnNode) {
                    this.rightBtnNode = cc.instantiate(this.rightBtnPrefab);
                }
                this.rightBtnNode.parent = this.panelNode;
                this._updateTavernIcon();
                break;

            default:
                // 隐藏
                if (this.activityNode) {
                    this.activityNode.opacity = 0;
                }
                if (this.rightBtnNode) {
                    this.rightBtnNode.destroy();
                    this.rightBtnNode = null;
                }
                this.panelNode.children.forEach(node => {
                    gdk.NodeTool.hide(node, false);
                });
                break;
        }
    }

    @gdk.binding("copyModel.lastCompleteStageId")
    @gdk.binding("roleModel.level")
    @gdk.binding("roleModel.tavern")
    _updateTavernIcon() {
        if (!cc.isValid(this.node)) return;
        let panelId = gdk.Tool.getResIdByNode(gdk.gui.getCurrentView());
        if (panelId == PanelId.PveReady.__id__) {
            this.tavernIcon.active = true;
            let hasNum = this.roleModel.tavern || 0;
            let limit = ConfigManager.getItemById(TavernCfg, 1).max_task[1];
            this.tavernIcon.getChildByName('progress').getComponent(cc.Sprite).fillRange = hasNum / limit;
            this.tavernIcon.getChildByName('num').getComponent(cc.Label).string = `${GlobalUtil.numberToStr(hasNum, true)}/${GlobalUtil.numberToStr(limit, true)}`
        }
        else {
            this.tavernIcon.active = false;
        }

        this.worldIcon.active = JumpUtils.ifSysOpen(2849)
    }

    showWorldTipNode() {
        if (!this._tipShow) {
            this._tipShow = true
            this.worldTipNode.active = true
            let bgNode = this.worldTipNode.getChildByName("bg")
            let tip1 = bgNode.getChildByName("tip1").getComponent(cc.RichText)
            let tip2 = bgNode.getChildByName("tip2").getComponent(cc.RichText)
            let g_cfg = ConfigManager.getItemById(GlobalCfg, "world_level_num")
            tip1.string = `世界等级由本服等级<color=#92ff55>前${g_cfg.value[0]}名</c>玩家\n的等级决定`
            tip2.string = `当前世界等级：<color=#92ff55>${this.roleModel.worldLevel}级</c>`
        } else {
            this.hideWorldTipNode()
        }
    }

    hideWorldTipNode() {
        this._tipShow = false
        this.worldTipNode.active = false
    }

    cServerTBtnClick() {
        gdk.panel.setArgs(PanelId.CServerPrivilegeTips, this.cServerRankTCfg)
        gdk.panel.open(PanelId.CServerPrivilegeTips)
    }


    @gdk.binding("activityModel.roleServerRank")
    _updateRoleServerRank() {
        let activityModel = this.activityModel
        if (activityModel.roleServerRank && activityModel.roleServerRank.rank >= 1 && activityModel.roleServerRank.rank <= 3) {
            this.cServerT.active = true;
            this.cServerRankTCfg = CarnivalUtil.getCrossRankConfig();
        } else {
            this.cServerT.active = false;
        }
    }

    combineSServerTBtnClick() {
        gdk.panel.setArgs(PanelId.CombineSerPrivilegeTip, CombineUtils.getCrossRankConfig())
        gdk.panel.open(PanelId.CombineSerPrivilegeTip)
    }

    @gdk.binding("combineModel.serverRank")
    _updateCombineServerRank() {
        if (ActUtil.ifActOpen(95) && this.combineModel.serverRank >= 1 && this.combineModel.serverRank <= 3) {
            this.combineServerT.active = true;
        } else {
            this.combineServerT.active = false;
        }
    }
}