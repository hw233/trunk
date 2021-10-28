import ArenaTeamViewModel from '../model/ArenaTeamViewModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { ArenaTeamEvent } from '../enum/ArenaTeamEvent';
import { Teamarena_divisionCfg } from '../../../a/config';




/** 
 * @Description: 组队竞技场View
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-02 11:07:22
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
//@menu("qszc/scene/pve/PveSceneCtrl")
export default class NewClass extends UiListItem {

    @property(cc.Node)
    infoNode: cc.Node = null;
    @property(cc.Node)
    maskNode: cc.Node = null;
    @property(cc.Sprite)
    duanweiSp: cc.Sprite = null;
    @property(cc.Label)
    rankLb: cc.Label = null;
    @property(cc.Label)
    scoreLb: cc.Label = null;

    @property(cc.Node)
    headFrame: cc.Node = null

    @property(cc.Node)
    headImg: cc.Node = null

    @property(cc.Node)
    titleIcon: cc.Node = null


    @property(cc.Label)
    lv: cc.Label = null;

    @property(cc.Label)
    playerName: cc.Label = null

    @property(cc.Label)
    power: cc.Label = null

    @property(cc.Node)
    quitBtn: cc.Node = null;
    @property(cc.Node)
    changeBtn: cc.Node = null;
    @property(cc.Node)
    moveBtn: cc.Node = null;
    @property(cc.Node)
    teamIcon: cc.Node = null;

    @property(cc.Node)
    state1Icon: cc.Node = null;
    @property(cc.Node)
    state2Icon: cc.Node = null;

    playerData: icmsg.ArenaTeamPlayer;
    isTeamer: boolean = false;
    state: number = 0;
    isSelf: boolean = false;
    get model(): ArenaTeamViewModel { return ModelManager.get(ArenaTeamViewModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    updateView() {

        this.playerData = this.data.playerInfo;
        this.isTeamer = this.data.isTeamer;
        this.state = this.data.state;
        this.isSelf = this.data.isSelf;



        if (this.playerData) {
            this.infoNode.active = true;
            this.maskNode.active = false;
            this.quitBtn.active = false;
            this.changeBtn.active = false;
            this.moveBtn.active = false;

            this.teamIcon.active = this.data.index == 0;

            //在线状态
            let offTime = this.playerData.brief.logoutTime * 1000
            this.state1Icon.active = offTime == 0
            this.state2Icon.active = offTime != 0

            //设置段位图片 积分
            let curCfgs = ConfigManager.getItems(Teamarena_divisionCfg, (cfg: Teamarena_divisionCfg) => {
                if (cfg.point <= this.playerData.score) {
                    return true;
                }
                return false
            });
            let path2 = 'view/champion/texture/champion/jbs_duanwei0' + curCfgs[curCfgs.length - 1].division;
            GlobalUtil.setSpriteIcon(this.node, this.duanweiSp, path2);

            this.rankLb.string = this.playerData.rank > 0 ? StringUtils.format(gdk.i18n.t("i18n:ARENATEAM_TIP5"), this.playerData.rank) : gdk.i18n.t("i18n:ARENATEAM_TIP6");
            let brief = this.playerData.brief
            this.lv.string = "." + brief.level;
            this.playerName.string = brief.name;
            let headId = brief.head
            let headFrame = brief.headFrame;
            this.scoreLb.string = this.playerData.score + '';
            this.power.string = brief.power + '';
            GlobalUtil.setSpriteIcon(this.node, this.headImg, GlobalUtil.getHeadIconById(headId));
            GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(headFrame));
            GlobalUtil.setSpriteIcon(this.node, this.titleIcon, GlobalUtil.getHeadTitleById(brief.title));

            if (this.state == 1) {
                //组队状态
                if (this.isSelf) {
                    this.quitBtn.active = this.model.arenaTeamInfo.players.length > 1;
                } else if (this.isTeamer) {
                    this.changeBtn.active = true;
                    this.moveBtn.active = true;
                }

            } else if (this.state == 2) {
                //挑战状态  
                if (this.isTeamer && this.roleModel.id != this.playerData.brief.id) {
                    this.changeBtn.active = true;
                }
            }

        } else {
            this.infoNode.active = false;
            this.maskNode.active = true
        }
    }

    onDisable() {
        NetManager.targetOff(this);
    }
    //退出按钮
    quitBtnClick() {
        NetManager.send(new icmsg.ArenaTeamQuitReq(), (rsp: icmsg.ArenaTeamQuitRsp) => {
            this.model.arenaTeamInfo.players = [this.playerData];
            gdk.e.emit(ArenaTeamEvent.RSP_ARENATEAM_TEAMCHANGE)
        }, this)
    }

    //转让队长按钮
    changeTeamerClick() {
        let msg = new icmsg.ArenaTeamDemiseReq()
        msg.playerId = this.playerData.brief.id
        NetManager.send(msg, (rsp: icmsg.ArenaTeamDemiseRsp) => {

            let index = this.model.arenaTeamInfo.players.indexOf(this.playerData);
            if (index >= 0) {
                let data = this.model.arenaTeamInfo.players.splice(index, 1);
                this.model.arenaTeamInfo.players.splice(0, 0, data[0]);
            }
            gdk.e.emit(ArenaTeamEvent.RSP_ARENATEAM_TEAMCHANGE)
        }, this)
    }

    //移除队员
    moveBtnClick() {
        let msg = new icmsg.ArenaTeamRemoveReq()
        msg.playerId = this.playerData.brief.id
        NetManager.send(msg, (rsp: icmsg.ArenaTeamRemoveRsp) => {
            let index = this.model.arenaTeamInfo.players.indexOf(this.playerData);
            this.model.arenaTeamInfo.players.splice(index, 1);
            gdk.e.emit(ArenaTeamEvent.RSP_ARENATEAM_TEAMCHANGE)
        }, this)
    }

    //显示玩家信息
    showPlayerInfoBtnClick() {
        gdk.panel.setArgs(PanelId.MainSet, this.playerData.brief.id)
        gdk.panel.open(PanelId.MainSet)
    }


}
