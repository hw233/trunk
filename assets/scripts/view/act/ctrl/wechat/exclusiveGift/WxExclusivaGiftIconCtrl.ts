import ActivityUtils from '../../../../../common/utils/ActivityUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import NetManager from '../../../../../common/managers/NetManager';
import RedPointCtrl from '../../../../../common/widgets/RedPointCtrl';
import { Platform_globalCfg } from '../../../../../a/config';

/** 
 * 小游戏专属礼包活动图标
 * @Author: sthoo.huang  
 * @Date: 2021-06-30 10:36:20 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-06 11:15:52
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wechat/exclusiveGift/WxExclusivaGiftIconCtrl")
export default class WxExclusivaGiftIconCtrl extends cc.Component {

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

    private get cfgs() {
        let a = ActivityUtils.getPlatformConfigs(4);
        a = a.concat(ActivityUtils.getPlatformConfigs(5));
        return a;
    }

    _update() {
        let ret = JumpUtils.ifSysOpen(this.sysId);
        if (ret) {
            let cfg = ConfigManager.getItemById(Platform_globalCfg, 'binghu_dbcz_time');
            let days = GlobalUtil.getCurDays() + 1;
            ret = days >= cfg.value[0] && days <= cfg.value[1];
            if (ret) {
                let cfgs = this.cfgs;
                if (!cfgs || !cfgs.length) {
                    ret = false;
                } else {
                    ret = cfgs.some(c => {
                        if (ActivityUtils.getPlatformTaskStatue(c) != 1) {
                            return true;
                        }
                        return false;
                    });
                }
            }
        }
        this.node.active = ret;
        // 更新红点
        let comp = this.node.getComponent(RedPointCtrl);
        if (comp) {
            comp._updateView();
        }
        return ret;
    }

    redPointHandle() {
        let cfgs = this.cfgs;
        if (!cfgs || !cfgs.length) {
            return false;
        }
        let ret = cfgs.some(c => {
            return ActivityUtils.getPlatformTaskStatue(c) == 2;
        });
        return ret;
    }
}
