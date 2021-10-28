import BagModel from '../../../common/models/BagModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import MainSceneModel, { MainSelectType } from '../model/MainSceneModel';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainDockCtrl")
export default class MainDockCtrl extends cc.Component {

    @property(cc.Node)
    btnPanel: cc.Node = null

    @property(cc.Node)
    selectImgs: cc.Node[] = []

    @property(cc.Node)
    btns: cc.Node[] = []

    @property(cc.Node)
    mainComposeTip: cc.Node = null

    panelId: string;  // 当前pannel
    isMain = true; // 当前界面是否主界面 true主界面 false 战斗界面

    _viewStateDef: { [panelId: string]: MainSelectType };   // 界面ID与选中项的对应关系
    _showStateDef: (gdk.PanelValue | Function)[]; // 需显示Dock的窗口定义

    get model(): MainSceneModel { return ModelManager.get(MainSceneModel); }
    get bagModel(): BagModel { return ModelManager.get(BagModel) }

    onLoad() {
        // 初始化对应关系字典
        this._viewStateDef = {};
        this._showStateDef = [];
        [
            { k: PanelId.Bag, v: MainSelectType.BAG },
            { k: PanelId.MainPanel, v: MainSelectType.BASE },
            // { k: PanelId.BYView, v: MainSelectType.BY },
            // { k: PanelId.BYMainView, v: MainSelectType.BY },
            { k: PanelId.Lottery, v: MainSelectType.LOTTERY },
            { k: PanelId.PveReady, v: MainSelectType.PVE },
            { k: PanelId.Role2, v: MainSelectType.ROLE },
        ].forEach(e => {
            this._viewStateDef[e.k.__id__] = e.v;
            this._showStateDef.push(e.k);
        });
        // 初始状态
        this.model.btnState == 1;
        this.btnPanel.active = false;
    }

    onEnable() {
        gdk.gui.onViewChanged.on(this._onViewChanged, this);
        gdk.gui.onPopupChanged.on(this._updatePanelShowHide, this);
        this._onViewChanged(gdk.gui.getCurrentView());
        gdk.e.on("popup#ActivityMainView#close", this._updatePanelShowHide, this)
    }

    onDisable() {
        gdk.gui.onViewChanged.targetOff(this);
        gdk.gui.onPopupChanged.targetOff(this);
        gdk.e.targetOff(this)
    }

    onDestroy() {
        gdk.Timer.clearAll(this);
        gdk.Binding.unbind(this);
    }

    _onViewChanged(node: cc.Node) {
        if (!node) return;
        this.panelId = gdk.Tool.getResIdByNode(node);
        // // 销毁旧的界面
        // let panel: cc.Node;
        // switch (this.panelId) {
        //     case PanelId.PveReady.__id__:
        //         // 打开的是PVE界面，则销毁MainPanel
        //         panel = gdk.panel.get(PanelId.MainPanel.__id__);
        //         break;

        //     case PanelId.MainPanel.__id__:
        //         // 打开的是主城界面，则销毁PveReady
        //         panel = gdk.panel.get(PanelId.PveReady.__id__);
        //         break;
        // }
        // if (panel) {
        //     // 保存至对象池
        //     let key = panel.name;
        //     if (panel['_prefab']) {
        //         key += "#" + panel['_prefab'].fileId;
        //     }
        //     gdk.pool.put(key, panel);
        //     // 清理node在gui中的引用
        //     gdk.Timer.frameOnce(3, gdk.gui, gdk.gui.getView);
        // }
        // 更新按钮状态
        let index = this._viewStateDef[this.panelId];
        if (index) {
            this.model.mainSelectIdx = index;
        }
        // 更新显示隐藏状态
        this._updatePanelShowHide();
    }

    // 更新显示或隐藏状态
    _updatePanelShowHide() {
        gdk.Timer.once(100, this, this._updatePanelShowHideLater);
    }

    _updatePanelShowHideLater() {
        let show = this._showStateDef.some((v) => {
            if (typeof v === 'function') {
                return v();
            } else {
                return gdk.panel.isOpenOrOpening(v as any);
            }
        });
        if (!show) {
            this.model.btnState == 1;
            gdk.NodeTool.hide(this.btnPanel);
        } else {
            this.model.btnState == 0;
            this._updateBtnState();
            gdk.NodeTool.show(this.btnPanel);
        }
        // this._updateComposeTipState(hide)
    }

    // 选中指定的按钮
    _updateBtnState() {
        let select = this.model.mainSelectIdx;
        for (let i = 0, n = this.selectImgs.length; i < n; i++) {
            const img = this.selectImgs[i];
            img.active = false;

            const btn = this.btns[i];
            if (btn) {
                btn.getChildByName("select").active = false
                btn.getComponent(cc.Button).interactable = true;
            }
        }

        if (select > 0) {
            const img = this.selectImgs[select - 1];
            const btn = this.btns[select - 1];
            img.active = true;
            btn.getComponent(cc.Button).interactable = false;
            btn.getChildByName("select").active = true
        }

        // 商店按钮根据是否开放充值显示或隐藏
        let b = iclib.SdkTool.tool.can_charge;
        if (this.btns[6] && this.btns[6].active != b) {
            this.btns[6].active = b;
        }
    }


    // _updateComposeTipState(isHide) {
    //     //显示
    //     if (!isHide && this.bagModel.heroChips.length > 0) {
    //         this.mainComposeTip.active = true
    //     } else {
    //         let ctrl = this.mainComposeTip.getComponent(MainComposeTipCtrl)
    //         ctrl.closeFunc()
    //     }
    // }

    // 绑定界面数据至界面显示隐藏
    _bindUpdateShowHide(source: gdk.BasePanel, sourceProps?: string) {
        let node = source.node;
        // 清除事件和绑定
        gdk.Binding.unbind(this, '_updatePanelShowHide');
        gdk.NodeTool.onHide(node).targetOff(this);
        // 添加事件和绑定
        if (sourceProps) {
            gdk.Binding.bind(this, '_updatePanelShowHide', source, sourceProps);
            gdk.NodeTool.onHide(node).on(() => {
                gdk.NodeTool.onHide(node).targetOff(this);
                gdk.Binding.unbind(this, '_updatePanelShowHide');
            }, this);
        }
    }

    // 基地按钮，红点
    mainCityBtnFunc() {
        return JumpUtils.ifSysOpen(1301, false);
    }

    // 兵营按钮，红点
    bingYingBtnFunc() {
        return JumpUtils.ifSysOpen(1100, false);
    }
}
