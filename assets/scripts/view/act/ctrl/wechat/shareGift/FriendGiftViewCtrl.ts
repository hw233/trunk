import ModelManager from "../../../../../common/managers/ModelManager";
import NetManager from "../../../../../common/managers/NetManager";
import RoleModel from "../../../../../common/models/RoleModel";
import ActivityUtils from "../../../../../common/utils/ActivityUtils";
import ActivityModel from "../../../model/ActivityModel";

/** 
 * 好友助力
 * @Author: sthoo.huang  
 * @Date: 2021-07-13 14:33:13
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-06 11:19:18
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wechat/ShareGift/FriendGiftViewCtrl")
export default class FriendGiftViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    num1: cc.Label = null;
    @property(cc.Label)
    num2: cc.Label = null;
    @property(cc.Label)
    num3: cc.Label = null;
    @property(cc.Node)
    proNode: cc.Node = null;

    @property(cc.Node)
    jiantou: cc.Node = null;

    @property({ type: cc.Integer, tooltip: "平台活动类型ID" })
    typeId: number = 0;

    maxWidth: number = 390;

    addNum: number = 5;

    onEnable() {
        NetManager.on(icmsg.PlatformMissionTriggerRsp.MsgType, this._updateView, this);
        this._updateView()
    }

    onDisable() {
        NetManager.targetOff(this)
    }
    _updateView() {
        let cfgs = ActivityUtils.getPlatformConfigs(this.typeId);
        if (cfgs.length > 0) {
            let num = 0;
            let isfirst = true;
            let model = ModelManager.get(ActivityModel);
            cfgs.forEach(cfg => {
                let status = ActivityUtils.getPlatformTaskStatue(cfg);
                if (status > 0) {
                    num++;
                }
                if (status == 0 && isfirst) {
                    let exist = model.platformTask.some(t => {
                        if (t.missionId == cfg.id) {
                            this.num3.string = `${t.number}/${cfg.args}`;
                            return true;
                        }
                        return false;
                    });
                    if (!exist) {
                        this.num3.string = `0/${cfg.args}`;
                    }
                    isfirst = false;
                }
            })

            this.num1.string = this.addNum * num + '%'
            this.num2.string = this.addNum * (num + 1) + '%'
            this.jiantou.active = num < cfgs.length
            this.num2.node.active = num < cfgs.length

            this.proNode.width = Math.floor(this.maxWidth * (num / cfgs.length))

            if (isfirst) {
                let cfg = cfgs[cfgs.length - 1]
                let exist = model.platformTask.some(t => {
                    if (t.missionId == cfg.id) {
                        this.num3.string = `${t.number}/${cfg.args}`;
                        return true;
                    }
                    return false;
                });
                if (!exist) {
                    this.num3.string = `0/${cfg.args}`;
                }
            }
        }
    }

    // 只针对冰狐小游戏平台
    onShareBtnClick() {
        let sdk: any = iclib.SdkTool.tool['_bhSdk'];
        if (sdk && typeof sdk.goShare === 'function') {
            sdk.goShare({ query: 'friend=' + ModelManager.get(RoleModel).id });
        }
    }
}
