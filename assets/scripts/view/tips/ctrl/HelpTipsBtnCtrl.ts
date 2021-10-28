import PanelId from '../../../configs/ids/PanelId';

/**
 * 给按钮加弹出通用帮助提示框
 * @Author: sthoo.huang
 * @Date: 2019-06-26 19:59:16
 * @Last Modified by: chengyou.lin
 * @Last Modified time: 2019-12-27 13:50:34
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/tips/HelpTipsBtnCtrl")
export default class HelpTipsBtnCtrl extends cc.Component {
    @property({ type: cc.Integer, tooltip: "配置id，读取配置表tips对应的数据" })
    tipsId: number = 0;

    start() {
        let button = this.node.getComponent(cc.Button);
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = "HelpTipsBtnCtrl";
        eventHandler.handler = "showHelpTipsPanel";
        button.clickEvents[0] = eventHandler;
    }

    showHelpTipsPanel() {
        gdk.panel.setArgs(PanelId.HelpTipsPanel, this.tipsId);
        gdk.panel.open(PanelId.HelpTipsPanel);
    }

}
