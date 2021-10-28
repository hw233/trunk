import ChatUtils from '../../../view/chat/utils/ChatUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import ErrorManager from '../../../common/managers/ErrorManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import SdkTool from '../../../sdk/SdkTool';
import { GlobalCfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/ChangeNameCtrl")
export default class ChangeNameCtrl extends gdk.BasePanel {

    @property(cc.EditBox)
    InputBox: cc.EditBox = null;

    @property(cc.Label)
    costLab: cc.Label = null;

    get model(): RoleModel {
        return ModelManager.get(RoleModel);
    }

    onEnable() {
        if (this.model.renameNum >= 1) {
            let cfg = ConfigManager.getItemById(GlobalCfg, "rename_cost").value
            this.costLab.string = `${cfg[1]}`
            this.costLab.node.parent.getChildByName('js_tubiao03').active = true;
        }
        else {
            this.costLab.node.parent.getChildByName('js_tubiao03').active = false;
            this.costLab.string = '确认修改'
        }
    }

    changeFunc() {
        let lastName = this.model.name
        let text = ChatUtils.filter(this.InputBox.string)
        if (text == "") {
            GlobalUtil.showMessageAndSound("请输入要更改的名字")
            return
        }
        if (text.length < 3) {
            gdk.GUIManager.showMessage("名字长度不符合要求");
            return
        }
        SdkTool.tool.hasMaskWord(text, ret => {
            if (ret) {
                gdk.GUIManager.showMessage("不能含有屏蔽字");
                return;
            }
            let cfg = ConfigManager.getItemById(GlobalCfg, "rename_cost").value
            if (this.model.renameNum >= 1 && !GlobalUtil.checkMoneyEnough(cfg[1], cfg[0], this, [PanelId.MainSet])) {
                return
            }

            let msg = new icmsg.RoleRenameReq()
            let panel = this;
            msg.name = text
            NetManager.send(msg, (data: icmsg.RoleRenameRsp) => {
                if (data.errCode == 0) {
                    ModelManager.get(RoleModel).renameNum += 1;
                    gdk.gui.showMessage("改名成功")
                    panel.model.name = data.name
                    panel.close()
                    gdk.gui.showAskAlert(
                        `是否要将新名字告知好友们？`,
                        "提示",
                        "",
                        (index: number) => {
                            //关闭按钮
                            if (index == -1) {

                            } else if (index == 1) {
                                //取消

                            } else {
                                //确定
                                let msg = new icmsg.FriendRenameNoticeReq();
                                msg.oldName = lastName;
                                msg.newName = text;
                                NetManager.send(msg);
                            }
                        }, this, {
                        cancel: "取消",
                        ok: "确定"
                    }
                    )
                } else {
                    gdk.gui.showMessage(ErrorManager.get(data.errCode))
                }
            })
        });
    }
}