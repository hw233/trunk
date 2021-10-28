import ActivityUtils from '../../../../../common/utils/ActivityUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import RoleModel from '../../../../../common/models/RoleModel';
import UiListItem from '../../../../../common/widgets/UiListItem';
import { Platform_activityCfg } from '../../../../../a/config';

/** 
 * 小程序发送红包列表项
 * @Author: sthoo.huang  
 * @Date: 2021-07-13 14:33:13
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-30 16:24:03
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wechat/RedPacket/RedPacketItemCtrl")
export default class RedPacketItemCtrl extends UiListItem {

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(cc.Node)
    putBtn: cc.Node = null;
    @property(cc.Node)
    getBtn: cc.Node = null;

    cfg: Platform_activityCfg;
    updateView() {
        this.cfg = this.data;
        this._updateState();
    }

    onPutBtnClick() {
        let sdk: any = iclib.SdkTool.tool['_bhSdk'];
        if (sdk && typeof sdk.goShare === 'function') {
            sdk.goShare({ query: 'friend=' + ModelManager.get(RoleModel).id });
        }
    }

    onGetBtnClick() {
        let req = new icmsg.PlatformMissionRewardReq();
        req.missionId = this.cfg.id;
        NetManager.send(req, () => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateState();
        }, this);
        this.getBtn.getComponent(cc.Button).interactable = false;
    }

    _updateState() {
        let status = ActivityUtils.getPlatformTaskStatue(this.cfg);
        let url = 'view/act/texture/bg/wechat/ghhb_weikaiihongbao';
        switch (status) {
            case 1:
                // 奖励已经领取
                this.putBtn.active = false;
                this.getBtn.active = false;
                url = 'view/act/texture/bg/wechat/ghhb_yikaihongbao';
                break;

            case 2:
                // 已经完成，但没有领取奖励
                this.putBtn.active = false;
                this.getBtn.active = true;
                break;

            default:
                // 默认，没有完成，并且没有领取奖励
                this.putBtn.active = true;
                this.getBtn.active = false;
                break;
        }
        GlobalUtil.setSpriteIcon(this.node, this.bg, url);
    }
}
