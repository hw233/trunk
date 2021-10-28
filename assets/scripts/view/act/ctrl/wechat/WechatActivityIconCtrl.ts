import NetManager from '../../../../common/managers/NetManager';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';

/** 
 * 小程序平台活动图标
 * @Author: sthoo.huang  
 * @Date: 2021-06-30 10:36:20 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-06 11:12:02
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wechat/WechatActivityIconCtrl")
export default class WechatActivityIconCtrl extends cc.Component {

    @property({ type: cc.Integer, tooltip: "平台活动类型ID" })
    typeId: number = 0;

    @property({ type: cc.Integer, tooltip: "平台活动功能ID" })
    sysId: number = 0;

    onLoad() {
        if (this._update()) {
            NetManager.on(icmsg.PlatformMissionListRsp.MsgType, this._update, this);
            NetManager.on(icmsg.PlatformMissionTriggerRsp.MsgType, this._update, this);
            NetManager.on(icmsg.PlatformMissionRewardRsp.MsgType, this._update, this);
        }
    }

    onDestroy() {
        NetManager.targetOff(this);
    }

    onClick() {
        JumpUtils.openView(this.sysId);
    }

    _update() {
        let cfgs = ActivityUtils.getPlatformConfigs(this.typeId);
        let ret = false;
        if (cfgs && cfgs.length) {
            cfgs.sort((a, b) => { return b.type - a.type; });
            cfgs.some(c => {
                if (JumpUtils.ifSysOpen(this.sysId)) {
                    if (this.typeId == 102 || ActivityUtils.getPlatformTaskStatue(c) == 0) {
                        // 邀请好友图标一直显示
                        ret = true;
                        return true;
                    }
                }
                return false;
            });
        }
        this.node.active = ret;
        return ret;
    }
}
