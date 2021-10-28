import ConfigManager from '../../../common/managers/ConfigManager';
import ErrorManager from '../../../common/managers/ErrorManager';
import GuideUtil from '../../../common/utils/GuideUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import MathUtil from '../../../common/utils/MathUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel, { RoleSettingValue } from '../../../common/models/RoleModel';
import SdkTool from '../../../sdk/SdkTool';
import { Common_nameCfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/login/CreateRoleCtrl")
export default class CreateRoleCtrl extends gdk.BasePanel {

    @property(cc.EditBox)
    nameBox: cc.EditBox = null
    @property(cc.Node)
    checkBoxs: cc.Node[] = [];

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    showName: cc.Label = null;
    @property(cc.Node)
    labMask: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;
    @property(sp.Skeleton)
    spine1: sp.Skeleton = null;
    @property(sp.Skeleton)
    spine2: sp.Skeleton = null;

    _gender: number = 0;

    onEnable() {
        this.spine.setAnimation(0, "stand", true)
        this.spine1.setAnimation(0, "stand2", true)

        let model = ModelManager.get(RoleModel);
        this.setGender(model.gender);
        this.randomHandle();
    }

    onDisable() {
        NetManager.targetOff(this);
        gdk.Timer.clearAll(this);
    }

    createRole() {
        let name = this.nameBox.string
        if (!name) {
            gdk.GUIManager.showMessage("请输入名字");
            return
        }
        if (name.length < 3) {
            gdk.GUIManager.showMessage("名字长度不符合要求");
            return
        }
        SdkTool.tool.hasMaskWord(name, ret => {
            if (ret) {
                gdk.GUIManager.showMessage("不能含有屏蔽字");
                return;
            }
            JumpUtils.showGuideMask();
            let msg = new icmsg.RoleRenameReq();
            msg.name = name;
            NetManager.send(msg, this.onRoleRenameRsp, this);
        });
    }

    onRoleRenameRsp(data: icmsg.RoleRenameRsp) {
        if (data.errCode != 0) {
            // 改变昵称失败，显示错误信息并允许用户操作
            gdk.gui.showMessage(ErrorManager.get(data.errCode));
            JumpUtils.hideGuideMask();
            return;
        }
        this.spine1.paused = true;
        this.spine1.node.active = false;
        this.spine2.setAnimation(0, "stand3", false);
        this.spine2.setCompleteListener(() => {
            if (!cc.isValid(this.node)) return;
            if (!this.enabled) return;
            this.spine2.setCompleteListener(null);
            this.spine.node.active = false;
            this.spine2.node.active = false;

            let model = ModelManager.get(RoleModel);
            model.name = data.name;
            let setting = model.setting;
            if (this._gender) {
                setting = setting | (1 << RoleSettingValue.Gender);
            } else {
                setting = setting & (~(1 << RoleSettingValue.Gender));
            }
            NetManager.send(new icmsg.RoleSetReq({ setting: setting }), function (rsp: icmsg.RoleSetRsp) {
                model.setting = setting;
            });

            this.showName.string = `指挥官\n${data.name}`;
            this.showName['_forceUpdateRenderData'](true);
            this.labMask.x = this.showName.node.getContentSize().width / 2;
            let ani = this.bg.getComponent(cc.Animation);
            ani.play("createAni");
            ani.on("finished", () => {
                this.showName.string = `指挥官\n${data.name}\n登录成功`;
                gdk.Timer.once(2000, this, () => {
                    this.close();
                    JumpUtils.hideGuideMask();
                    GuideUtil.activeGuide('changename');
                });
            }, this);
        });
    }

    // 随机名字
    randomHandle() {
        let val: string = '';
        let i = this._gender * 3 + 1;
        let n = i + 3;
        for (; i < n; i++) {
            let c = ConfigManager.getItemById(Common_nameCfg, i);
            if (Math.random() <= c.rate) {
                let a = c.val.split(',');
                val += a[MathUtil.rnd(0, a.length - 1)];
            }
        }
        this.nameBox.string = val;
    }

    // 设置性别
    setGender(gender: number) {
        gender = gender == 1 ? 1 : 0;
        this._gender = gender;
        for (let i = 0; i < this.checkBoxs.length; i++) {
            const checkBox = this.checkBoxs[i];
            checkBox.active = gender == i;
        }
    }

    onManHandle() {
        this.setGender(0);
    }

    onWomanHandle() {
        this.setGender(1);
    }
}
