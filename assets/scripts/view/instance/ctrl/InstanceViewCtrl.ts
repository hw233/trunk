import BYModel from '../../bingying/model/BYModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel, { CopyType } from './../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import HelpTipsBtnCtrl from '../../tips/ctrl/HelpTipsBtnCtrl';
import InstanceModel from '../model/InstanceModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import { GlobalCfg } from '../../../a/config';
import { InstanceData } from './../model/InstanceModel';
import { InstanceEventId, InstanceID } from '../enum/InstanceEnumDef';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/**
 * @Description: 副本界面控制器
 * @Author: jijing.liu
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-26 09:53:17
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/InstanceViewCtrl")
export default class InstanceViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    instanceItem: cc.Prefab = null;

    @property(cc.Node)
    titlePanel: cc.Node = null;
    @property(cc.Sprite)
    titleIcon: cc.Sprite = null;

    @property(cc.Node)
    homePanel: cc.Node = null;
    @property(cc.Node)
    panelParent: cc.Node = null;

    @property(cc.Node)
    btnTip: cc.Node = null;

    @property(HelpTipsBtnCtrl)
    helpBtn: HelpTipsBtnCtrl = null;

    get model(): InstanceModel { return ModelManager.get(InstanceModel); }
    get byModel(): BYModel { return ModelManager.get(BYModel); }

    list: ListView;
    panelIndex: number = -1;    // 当前打开的界面索引
    info: InstanceData = null;  // 当前界面的数据

    /**
     * 获取副本类型对应的界面
     * @param copy_id 
     */
    getPanelName(copy_id: number): gdk.PanelValue {
        switch (copy_id) {
            case CopyType.Boss:
                return PanelId.SubInstanceDetailView2;

            case CopyType.RookieCup:
            case CopyType.ChallengeCup:
                return PanelId.SubInstanceEliteView;

            case CopyType.DoomsDay:
                return PanelId.SubInstanceDoomsdayView;

            case CopyType.Survival:
                return PanelId.SubInstanceSurvivalView;

            case CopyType.Trial:
                return PanelId.TowerPanel;
            case CopyType.GOD:
                return PanelId.SubInstanceHeroView
            case CopyType.Rune:
                return PanelId.SubInstanceRuneView
            case CopyType.EndRuin:
                return PanelId.SubInstanceEndRuinView;
            case CopyType.Guardian:
                return PanelId.SubInstanceGuardianView;
            case CopyType.Ultimate:
                return PanelId.SubInstanceUltimateView;
        }
    }

    onEnable() {
        this.title = 'i18n:INSTANCE_TITLE';
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.instanceItem,
                cb_host: this,
                async: true,
                resize_cb: this.updateListViewContent,
                column: 1,
                gap_x: 0,
                gap_y: 0,
                direction: ListViewDir.Vertical,
            });
        }
        if (!this.checkArgs()) {
            if (this.model.isInstDataCplt) {
                // 如果已请求过数据，则不重复请求
                this.onServerDataUpdate();
            } else {
                gdk.e.emit(InstanceEventId.REQ_INST_LIST);
                gdk.e.on(InstanceEventId.RSP_INST_LIST, this.onServerDataUpdate, this);
            }
        }

        NetManager.send(new icmsg.JusticeStateReq());
        gdk.e.on(InstanceEventId.RSP_BOSS_JUSTICE_STATE, this._onBossJusticeStateRsp, this);
        gdk.e.on(InstanceEventId.SURVIVAL_SUBTYPE_REFRESH, this._onSurvivalSubType, this);
    }

    onDisable() {
        gdk.e.targetOff(this);
        gdk.Timer.clearAll(this);
    }

    onDestroy() {
        this.list && this.list.destroy();
        this.list = null;
    }

    // 跳转隐藏参数
    get hideArgs() {
        let r: gdk.PanelHideArg = {
            id: this.resId,
            args: this.info,
        };
        return r;
    }

    // 预加载子界面列表
    get preloads() {
        let a: gdk.PanelValue[] = [];
        this.model.instanceListItemData.forEach(d => {
            let v = this.getPanelName(d.data.copy_id);
            if (v && a.indexOf(v) == -1) {
                a.push(v);
            }
        });
        return a;
    }

    _onBossJusticeStateRsp(e: gdk.Event) {
        //let info: JusticeStateRsp = e.data.bossInfo;
        this.updateListViewContent();
    }

    _onSurvivalSubType() {
        let copyModel = ModelManager.get(CopyModel);
        if (copyModel.survivalStateMsg.subType == 0) {
            GlobalUtil.setSpriteIcon(this.node, this.titleIcon, `view/instance/texture/comm/copySurvivalName`);//copySurvivalName
        } else {
            GlobalUtil.setSpriteIcon(this.node, this.titleIcon, `view/instance/texture/comm/fb_shengchuankunnan`);
        }
    }

    // 检查是否需要打开副本界面
    checkArgs() {
        let model = this.model;
        if (!model.isInstDataCplt) {
            // 还没请求过副本数据
            return false;
        }
        let args = this.args;
        if (args && args.length > 0) {
            // 处理外部参数
            let index: number = -1;
            let info: InstanceData;
            let p = args[0];
            if (cc.js.isNumber(p)) {
                // copy_id
                model.instanceListItemData.some((d, i) => {
                    if (d.data.copy_id == p) {
                        info = d;
                        index = i;
                        return true;
                    }
                    return false;
                });
            } else if (p != null && typeof p === 'object') {
                // instanceData
                info = p;
            }
            if (info) {
                if (index == -1) {
                    model.instanceListItemData.some((d, i) => {
                        if (d.data.copy_id == info.data.copy_id) {
                            index = i;
                            return true;
                        }
                        return false;
                    });
                }
                if (index != -1) {
                    this.selectItem(info, index);
                }
                return true;
            }
        }
        // 无外部参数，或参数无效
        this.homePanel.active = true;
        this.panelParent.active = false;
        if (this.panelIndex != -1) {
            let info = model.instanceListItemData[0];
            let panelId = this.getPanelName(info.data.copy_id);
            if (panelId) {
                gdk.panel.hide(panelId);
            }
            this.panelIndex = -1;
        }
        return false;
    }

    selectItem(info: InstanceData, index: number) {
        let model = this.model;
        if (!model.isInstDataCplt) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:INS_LIST_TIP3"));
            return;
        }
        if (!JumpUtils.ifSysOpen(RedPointUtils.get_copy_open_lv(info.data.copy_id), true)) {
            return;
        }
        if (info.data.copy_id == CopyType.Guardian && !ModelManager.get(CopyModel).guardianOpen) {
            let cfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'guardian_open');
            gdk.gui.showMessage(`获得${cfg.value[0]}星英雄时开启`);
            return;
        }
        if (info.data.copy_id == InstanceID.ELITE_INST) {
            RedPointUtils.save_state("elite_inst_red_point", false)
        }
        model.selectInstanceData = info;
        // 打开子界面索引变更
        if (this.panelIndex == index) {
            return;
        }
        // 关闭上一个子界面
        if (this.panelIndex > -1) {
            let info = this.model.instanceListItemData[this.panelIndex];
            let panelId = this.getPanelName(info.data.copy_id);
            if (panelId) {
                gdk.panel.hide(panelId);
            }
            this.panelIndex = -1;
        }
        // 打开新的子界面
        let panelId = this.getPanelName(info.data.copy_id);
        if (panelId) {
            gdk.panel.setArgs(panelId, info);
            gdk.panel.open(
                panelId,
                (node: cc.Node) => {
                    // 记录进入的副本类型
                    model.instanceId = info.data.copy_id;
                    model.instanceEnterState[info.data.copy_id] = true;

                    // // 打开更下层的PVP弹出界面
                    // let args = gdk.panel.getArgs(PanelId.InstancePVPReadyView);
                    // if (args && args.length > 0) {
                    //     gdk.panel.setArgs(PanelId.InstancePVPReadyView, ...args);
                    //     gdk.panel.open(PanelId.InstancePVPReadyView);
                    // }

                    // 打开更下层的关卡选择界面
                    let args = gdk.panel.getArgs(PanelId.SubEliteGroupView);
                    if (args && args.length > 0) {
                        gdk.panel.setArgs(PanelId.SubEliteGroupView, ...args);
                        gdk.panel.open(PanelId.SubEliteGroupView);
                    }
                },
                this,
                {
                    parent: this.panelParent
                },
            );
        }
        this.btnTip.active = false;
        if (info.data.copy_id != CopyType.Boss) {
            this.titlePanel.active = true;
            if (info.data.copy_id == CopyType.Survival) {
                this.btnTip.active = true;
                this.helpBtn.tipsId = 4;
                this._onSurvivalSubType()
            } else {
                if (info.data.copy_id == CopyType.Trial) {
                    this.btnTip.active = true;
                    this.helpBtn.tipsId = 19;
                }
                let copy_id = info.data.copy_id;
                if (copy_id == CopyType.EndRuin) {
                    this.btnTip.active = true;
                    this.helpBtn.tipsId = 94;
                } else if (copy_id == CopyType.Ultimate) {
                    this.btnTip.active = true;
                    this.helpBtn.tipsId = 154;
                }
                GlobalUtil.setSpriteIcon(this.node, this.titleIcon, `view/instance/texture/comm/copyName_${copy_id}`);
            }
        } else {
            this.titlePanel.active = false;
            GlobalUtil.setSpriteIcon(this.node, this.titleIcon, null);
        }
        this.panelIndex = index;
        this.info = info;
        this.homePanel.active = false;
        this.panelParent.active = true;
    }

    close(buttonIndex: number = -1) {
        if (this.panelIndex != -1) {
            let info = this.model.instanceListItemData[this.panelIndex];
            let panelId = this.getPanelName(info.data.copy_id);
            if (panelId) {
                gdk.panel.hide(panelId);
            }
            this.panelIndex = -1;
            this.info = null;
            this.homePanel.active = true;
            this.panelParent.active = false;
            this.titlePanel.active = true;
            this.btnTip.active = false
            GlobalUtil.setSpriteIcon(this.node, this.titleIcon, `view/instance/texture/view/fb_rukoubiaoti`);
            // 刷新数据
            this._updateListData(false);
            return;
        }
        super.close(buttonIndex);
    }

    // 获取服务器数据，更新界面
    onServerDataUpdate() {
        if (this.checkArgs()) return;
        this.updateListViewContent();
    }

    updateListViewContent() {
        gdk.Timer.callLater(this, this._updateListViewContentLater);
    }

    _updateListViewContentLater(resetPos: boolean = true): void {
        this._updateListData(resetPos);
        let guide = GuideUtil.getCurGuide();
        if (guide) {
            let idx: { [type: number]: number } = {};
            idx[CopyType.DoomsDay] = 1102;
            idx[CopyType.Survival] = 1103;
            idx[CopyType.Rune] = 1106;
            idx[CopyType.GOD] = 1105;
            idx[CopyType.Boss] = 1100;
            idx[CopyType.RookieCup] = 1101;
            idx[CopyType.EndRuin] = 1104;
            idx[CopyType.Guardian] = 1107;
            this.model.instanceListItemData.some((e, i) => {
                if (i > 0 && idx[e.data.copy_id] == guide.bindBtnId) {
                    gdk.Timer.callLater(this, () => {
                        this.scrollView.enabled = false;
                        this.list.scroll_to(i);
                    });
                    return true;
                }
                return false;
            });
        }
    }

    _updateListData(resetPos: boolean) {
        this.scrollView.enabled = true;
        this.list.set_data(this.model.instanceListItemData, resetPos);
    }
}

