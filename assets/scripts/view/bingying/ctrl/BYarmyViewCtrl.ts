import HeroModel from '../../../common/models/HeroModel';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';

/** 
 * @Description: 兵营-兵团界面
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-09 13:54:38
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYarmyViewCtrl")
export default class BYarmyViewCtrl extends gdk.BasePanel {

    @property(UiTabMenuCtrl)
    tabMenu: UiTabMenuCtrl = null;

    @property(cc.Node)
    panelParent: cc.Node = null;

    @property({ type: cc.String })
    _panelNames: string[] = [];

    @property({ type: gdk.PanelId, tooltip: "子界面，如果没可选值，请先配置gdk.PanelId" })
    get panels() {
        let ret = [];
        for (let i = 0; i < this._panelNames.length; i++) {
            ret[i] = gdk.PanelId[this._panelNames[i]] || 0;
        }
        return ret;
    }
    set panels(value) {
        this._panelNames = [];
        for (let i = 0; i < value.length; i++) {
            this._panelNames[i] = gdk.PanelId[value[i]];
        }
    }

    panelIndex: number = -1;    // 当前打开的界面索引
    get model() {
        return ModelManager.get(HeroModel);
    }

    //精甲界面参数
    skinData: any = null;

    onEnable() {

        this.scheduleOnce(this.checkArgs, 0);

    }
    onDisable() {
        this.skinData = null;
        // 关闭打开或打开中的子界面
        for (let i = 0, n = this._panelNames.length; i < n; i++) {
            let panelId = gdk.PanelId.getValue(this._panelNames[i]);
            if (panelId) {
                gdk.panel.hide(panelId);
            }
        }
        this.panelIndex = -1;
        this._onPanelShow = null;
    }
    /**
     * 打开角色面板,额外参数可带一个次级面板数据,
     * 0:强化界面 1:突破界面 2:镶嵌界面 3:附魔界面 4:融合界面 5.符文合成
     */
    _onPanelShow: (node?: cc.Node) => void;   // 当子界面打开时回调
    checkArgs() {
        let args = gdk.panel.getArgs(PanelId.BYarmyView)
        let idx = 0;
        if (args && args.length > 0) {
            // 有外部参数
            if (args[0] instanceof Array) {
                args = args[0];
            }
            // 更新当前选中的下层子界面索引
            idx = args[0];
            if (args[1]) {
                this.skinData = args[1];
            }
        } else {
            // 没有参数时
            idx = 0;
        }
        this.tabMenu.setSelectIdx(idx, true);
    }
    selectFunc(e: any, utype: any) {
        if (!e) return;
        utype = utype ? parseInt(utype) : 0;
        if (this.panelIndex > -1) {
            let panelId = gdk.PanelId.getValue(this._panelNames[this.panelIndex]);
            if (panelId) {
                gdk.panel.hide(panelId);
            }
            this.panelIndex = -1;
        }
        // 打开新的子界面
        let panelId = gdk.PanelId.getValue(this._panelNames[utype]);
        if (this.skinData) {
            gdk.panel.setArgs(panelId, this.skinData)
            this.skinData = null;
        }
        if (panelId) {
            gdk.panel.open(
                panelId,
                this._onPanelShow,
                this,
                {
                    parent: this.panelParent
                },
            );
        }
        this.panelIndex = utype;
        //this._updateSelectBtns();
    }



}
