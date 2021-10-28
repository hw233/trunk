import JumpUtils from '../../../common/utils/JumpUtils';
import PanelId from '../../../configs/ids/PanelId';

/** 
 * 战斗回放界面
 * @Author: sthoo.huang  
 * @Date: 2020-05-13 21:11:15 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-19 15:25:37
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bounty/BountyItemReplayCtrl")
export default class BountyItemReplayCtrl extends gdk.BasePanel {

    @property(cc.Label)
    playerName: cc.Label = null;

    @property(cc.Label)
    powerLb: cc.Label = null;

    @property(gdk.List)
    heroIconList: gdk.List = null;

    @property(cc.Prefab)
    heroIconPre: cc.Prefab = null;

    _bountyMission: icmsg.BountyMission
    _fightRsp: icmsg.BountyFightReplyRsp

    onEnable() {
        let arg = this.args
        this._bountyMission = arg[0]
        this._fightRsp = arg[1]
        this.playerName.string = `${this._bountyMission.publisher}`
        this.powerLb.string = `${this._bountyMission.pubPower}`
        this.heroIconList.datas = this._fightRsp.heroList
    }

    playRecord() {
        gdk.panel.isOpenOrOpening(PanelId.BountyPublishView) && gdk.panel.hide(PanelId.BountyPublishView);
        gdk.panel.isOpenOrOpening(PanelId.BountyList) && gdk.panel.hide(PanelId.BountyList);
        gdk.panel.isOpenOrOpening(PanelId.BountyItemReplay) && gdk.panel.hide(PanelId.BountyItemReplay);

        gdk.panel.isOpenOrOpening(PanelId.Mail) && gdk.panel.hide(PanelId.Mail);
        gdk.panel.isOpenOrOpening(PanelId.MailInfo) && gdk.panel.hide(PanelId.MailInfo);


        let rsp = new icmsg.FightReplayRsp()
        rsp.stageId = this._fightRsp.stageId
        rsp.randSeed = this._fightRsp.randSeed
        rsp.heroList = this._fightRsp.heroList
        rsp.general = this._fightRsp.general
        rsp.actions = this._fightRsp.actions
        JumpUtils.bountyReplay(rsp);
    }
}