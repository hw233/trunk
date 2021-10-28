import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import { HeadframeCfg } from '../../../a/config';
import { HeadItemInfo } from './HeadChangeViewCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-16 16:02:17 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/FrameDetailsViewCtrl")
export default class FrameDetailsViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    iconNode: cc.Node = null;

    @property(cc.Node)
    frameNode: cc.Node = null;

    @property(cc.Label)
    frameNameLab: cc.Label = null;

    @property(cc.RichText)
    timeLab: cc.RichText = null;

    @property(cc.RichText)
    actConditionLab: cc.RichText = null;

    @property(cc.RichText)
    attrDescLab: cc.RichText = null;

    @property(cc.RichText)
    attrLab: cc.RichText = null;

    @property(cc.Node)
    bgNode: cc.Node = null;

    get rM(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        let headInfo: HeadItemInfo = this.args[0]
        let cfg = ConfigManager.getItemById(HeadframeCfg, headInfo.id);
        let info: icmsg.HeadFrame = this.rM.frameList[headInfo.id];
        GlobalUtil.setSpriteIcon(this.node, this.iconNode, GlobalUtil.getHeadIconById(this.rM.head));
        GlobalUtil.setSpriteIcon(this.node, this.frameNode, GlobalUtil.getHeadFrameById(headInfo.id));
        this.frameNameLab.string = cfg.name;
        if (cfg.timeliness > 0) {
            if (!headInfo.isActive && !info) {
                let s = gdk.i18n.t("i18n:MAIN_SET_TIP1");
                this.timeLab.string = s.replace('{0}', cfg.timeliness); // 使用期限x天
            }
            else {
                let s = gdk.i18n.t("i18n:MAIN_SET_TIP9");
                let endTimeStr = TimerUtils.format5(Math.max(0, info.endTime - GlobalUtil.getServerTime() / 1000));
                this.timeLab.string = s.replace('{0}', endTimeStr);
            }
        }
        else {
            this.timeLab.string = gdk.i18n.t("i18n:MAIN_SET_TIP2");
        }
        this.actConditionLab.string = gdk.i18n.t("i18n:MAIN_SET_TIP3").replace('{0}', cfg.paper);
        if (cfg.attribute_desc) {
            this.attrDescLab.node.active = true;
            this.attrLab.node.active = true;
            this.attrDescLab.string = gdk.i18n.t("i18n:MAIN_SET_TIP4").replace('{0}', cfg.attribute_desc);
            let types = ['w', 'p']; // 固定值 百分比
            let attrs = ['atk', 'hp', 'def', 'hit', 'dodge', 'crit'];
            let attrNames = [
                gdk.i18n.t("i18n:ATTR_NAME_ATK"), //攻击
                gdk.i18n.t("i18n:ATTR_NAME_HP"),    //生命
                gdk.i18n.t("i18n:ATTR_NAME_DEF"),   //防御
                gdk.i18n.t("i18n:ATTR_NAME_HIT"),   //命中
                gdk.i18n.t("i18n:ATTR_NAME_DODGE"), //闪避
                gdk.i18n.t("i18n:ATTR_NAME_CRIT"),  //暴击
            ];
            let str = '';
            attrs.forEach((attr, idx) => {
                for (let i = 0; i < types.length; i++) {
                    let value = cfg[`${attr}_${types[i]}`];
                    let s = `${value}`;
                    if (value) {
                        if (i == 1) {
                            //万分比
                            s = `${value / 100}%`;
                        }
                        str += `<color=#00FF00>${attrNames[idx]}+${s}</c><br/>`;
                        break;
                    }
                }
            });
            if (str.length > 0) {
                str = str.slice(0, str.length - '<br/>'.length);
            }
            this.attrLab.string = str;
        }
        else {
            this.attrDescLab.node.active = false;
            this.attrLab.node.active = false;
        }

        let layout = this.bgNode.getComponent(cc.Layout);
        layout.enabled = true;
        layout.updateLayout();
        gdk.Timer.callLater(this, () => {
            if (this.bgNode.height < 281.96) {
                layout.enabled = false;
                layout.node.height = 281.96;
            }
        });
    }

    onDisable() {
    }
}
