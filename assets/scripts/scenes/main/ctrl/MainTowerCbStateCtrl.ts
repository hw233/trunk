import ActUtil from '../../../view/act/util/ActUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import TrialInfo from '../../../view/instance/trial/model/TrialInfo';
import { RankTypes } from '../../../view/rank/enum/RankEvent';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainTowerCbStateCtrl")
export default class MainTowerCbStateCtrl extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Label)
    rankNum: cc.Label = null;

    model: TrialInfo = ModelManager.get(TrialInfo);
    onEnable() {
        let endTime = ActUtil.getActEndTime(3)
        this.icon.node.active = false;
        if (!endTime) {
            this.content.active = false;
        } else {
            this.content.active = true;
            NetManager.on(icmsg.RankSelfRsp.MsgType, this._onRankSelfRsp, this)
            let msg2 = new icmsg.RankDetailReq()
            msg2.type = RankTypes.Refine
            NetManager.send(msg2)
        }
    }

    onDisable() {
        NetManager.off(icmsg.RankSelfRsp.MsgType, this._onRankSelfRsp, this)
    }
    _onRankSelfRsp(rsp: icmsg.RankSelfRsp) {
        if (rsp.type != 3) return;
        this.rankNum.string = rsp.numTd + '';
        //this.model.towerRank = rsp.numTd;
        if (rsp.numTd == 0) {
            this.content.active = false;
        } else if (rsp.numTd <= 3) {
            this.icon.node.active = true;
            let path = 'common/texture/main/gh_gxbhuizhang0' + rsp.numTd;
            GlobalUtil.setSpriteIcon(this.node, this.icon, path);
        }
    }
    // update (dt) {}
}
