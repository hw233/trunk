import JumpUtils from '../../../common/utils/JumpUtils';
import PanelId from '../../../configs/ids/PanelId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-03 20:12:41 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/GrowTaskBtnViewCtrl")
export default class GrowTaskBtnViewCtrl extends cc.Component {
  @property(cc.Node)
  panelNode: cc.Node = null;

  onLoad() {
    this.panelNode.children.forEach(node => {
      gdk.NodeTool.hide(node, false);
    });
  }

  onEnable() {
    gdk.gui.onViewChanged.on(this._onViewChanged, this);
    this._onViewChanged(gdk.gui.getCurrentView());
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
    let panelId = gdk.Tool.getResIdByNode(node);
    switch (panelId) {
      case PanelId.PveScene.__id__:
      case PanelId.PvpScene.__id__:
        // 显示
        if (JumpUtils.ifSysOpen(2818)) {
          this.panelNode.children.forEach(node => {
            gdk.NodeTool.show(node);
          });
        }
        break;
      default:
        // 隐藏
        this.panelNode.children.forEach(node => {
          gdk.NodeTool.hide(node, false);
        });
        break;
    }
  }
}
