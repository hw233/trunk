import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import NetManager from '../../../../../common/managers/NetManager';
import UiListItem from '../../../../../common/widgets/UiListItem';
import { Platform_globalCfg } from './../../../../../a/config';

/** 
 * 小程序发充值返利列表项
 * @Author: sthoo.huang  
 * @Date: 2021-07-13 14:33:13
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-31 16:58:04
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/wechat/Rebate/RebateItemCtrl")
export default class RebateItemCtrl extends UiListItem {

    @property(cc.Node)
    progress: cc.Node = null;
    @property(cc.Label)
    progressLb: cc.Label = null;

    @property(cc.Label)
    rewardLb: cc.Label = null;
    @property(cc.Node)
    getBtn: cc.Node = null;

    msg: icmsg.PlatformFriendGemsInfoRsp;
    updateView() {
        let req = new icmsg.PlatformFriendGemsInfoReq();
        NetManager.send(req, (rsp: icmsg.PlatformFriendGemsInfoRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.msg = rsp;
            this._updateState();
        });
        this.progressLb.string = '';
        this.progress.scaleX = 0.0;
        this.rewardLb.string = 'x0';
        this.getBtn.getComponent(cc.Button).interactable = false;
    }

    onGetBtnClick() {
        let req = new icmsg.PlatformFriendGemsFetchReq();
        NetManager.send(req, (rsp: icmsg.PlatformFriendGemsFetchRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            GlobalUtil.openRewadrView(rsp.rewards);
            this.msg.fetchedNum += this.msg.unfetchedNum;
            this.msg.unfetchedNum = 0;
            this._updateState();
        }, this);
        this.getBtn.getComponent(cc.Button).interactable = false;
    }

    _updateState() {
        let max = ConfigManager.getItemById(Platform_globalCfg, 'bignhu_yqfl_limit').value[0];
        this.progressLb.string = this.msg.fetchedNum + '/' + max;
        this.progress.scaleX = Math.min(this.msg.fetchedNum / max, 1.0);
        this.rewardLb.string = 'x' + this.msg.unfetchedNum;
        if (this.msg.unfetchedNum > 0) {
            // 有领取奖励
            this.getBtn.active = true;
            this.getBtn.getComponent(cc.Button).interactable = true;
        } else {
            // 没有领取奖励
            this.getBtn.active = true;
            this.getBtn.getComponent(cc.Button).interactable = false;
        }
    }
}
