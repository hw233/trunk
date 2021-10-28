import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import UiListItem from '../../../common/widgets/UiListItem';


/** 
 * @Description: 组队竞技场对战记录Item
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-02-07 10:53:20
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenaTeam/ArenaTeamRecordViewItemCtrl")
export default class ArenaTeamRecordViewItemCtrl extends UiListItem {

    @property(cc.Node)
    winNode: cc.Node = null;
    @property(cc.Node)
    loseNode: cc.Node = null;
    @property([cc.Node])
    teamplayerNodes: cc.Node[] = []
    @property([cc.Sprite])
    teamheadIcons: cc.Sprite[] = []
    @property([cc.Sprite])
    teamheadFrames: cc.Sprite[] = []
    @property([cc.Label])
    teamplayerLvs: cc.Label[] = []
    @property(cc.Label)
    teamPower: cc.Label = null
    @property([cc.Node])
    enemyplayerNodes: cc.Node[] = []
    @property([cc.Sprite])
    enemyheadIcons: cc.Sprite[] = []
    @property([cc.Sprite])
    enemyheadFrames: cc.Sprite[] = []
    @property([cc.Label])
    enemyplayerLvs: cc.Label[] = []
    @property(cc.Label)
    enemyPower: cc.Label = null
    @property(cc.Label)
    myRank: cc.Label = null
    @property(cc.Label)
    myRankAdd: cc.Label = null
    @property(cc.LabelOutline)
    myRankAddOutline: cc.LabelOutline = null;
    @property(cc.Sprite)
    myRankSp: cc.Sprite = null

    @property(cc.Label)
    myScore: cc.Label = null
    @property(cc.Label)
    myScoreAdd: cc.Label = null
    @property(cc.LabelOutline)
    myScoreAddOutline: cc.LabelOutline = null;
    @property(cc.Sprite)
    myScoreSp: cc.Sprite = null
    @property(cc.Label)
    timeLb: cc.Label = null;

    colors: cc.Color[] = [cc.color('#BEE801'), cc.color('#FA3535')]
    lineColors: cc.Color[] = [cc.color('#083B05'), cc.color('#3F0A05')]
    info: icmsg.ArenaTeamFightRecord;
    updateView() {
        this.info = this.data;
        this.winNode.active = this.info.isFightWin;
        this.loseNode.active = !this.info.isFightWin;
        let roleModel = ModelManager.get(RoleModel)
        let myInfo: icmsg.ArenaTeamRecordTeammate;
        this.timeLb.string = '';
        this.teamplayerNodes.forEach((node, i) => {
            if (this.info.teammates.length > i) {
                node.active = true;
                let playerInfo = this.info.teammates[i];
                GlobalUtil.setSpriteIcon(this.node, this.teamheadIcons[i], GlobalUtil.getHeadIconById(playerInfo.head));
                GlobalUtil.setSpriteIcon(this.node, this.teamheadFrames[i], GlobalUtil.getHeadFrameById(playerInfo.frame));
                this.teamplayerLvs[i].string = '.' + playerInfo.level
                this.teamPower.string = this.info.teammatesPower + '';
                if (roleModel.id == playerInfo.playerId) {
                    myInfo = playerInfo;
                }
            } else {
                node.active = false;
            }
        })

        this.enemyplayerNodes.forEach((node, i) => {
            if (this.info.opponents.length > i) {
                node.active = true;
                let playerInfo = this.info.opponents[i];
                GlobalUtil.setSpriteIcon(this.node, this.enemyheadIcons[i], GlobalUtil.getHeadIconById(playerInfo.head));
                GlobalUtil.setSpriteIcon(this.node, this.enemyheadFrames[i], GlobalUtil.getHeadFrameById(playerInfo.frame));
                this.enemyplayerLvs[i].string = '.' + playerInfo.level
                this.enemyPower.string = this.info.opponentsPower + '';

            } else {
                node.active = false;
            }
        })

        if (myInfo) {
            this.myRank.string = myInfo.newRank + '';
            let index1 = 1;
            if (myInfo.newRank < myInfo.oldRank) {
                index1 = 0;
            }
            this.myRankAdd.string = Math.abs((myInfo.newRank - myInfo.oldRank)) + ''
            this.myRankAdd.node.color = this.colors[index1];
            this.myRankAddOutline.color = this.lineColors[index1];

            let path1 = myInfo.newRank < myInfo.oldRank ? 'view/act/texture/kfcb/gh_shangsheng' : 'view/act/texture/kfcb/gh_xiajiang';
            this.myRankSp.node.active = myInfo.newRank != myInfo.oldRank;
            this.myRankAdd.node.active = myInfo.newRank != myInfo.oldRank;
            GlobalUtil.setSpriteIcon(this.node, this.myRankSp, path1)


            this.myScore.string = myInfo.newScore + '';
            let index2 = 0;
            if (myInfo.newScore < myInfo.oldScore) {
                index2 = 1;
            }
            this.myScoreAdd.string = (myInfo.newScore - myInfo.oldScore) + ''
            this.myScoreAdd.node.color = this.colors[index2];
            this.myScoreAddOutline.color = this.lineColors[index2];
            let path2 = myInfo.newScore > myInfo.oldScore ? 'view/act/texture/kfcb/gh_shangsheng' : 'view/act/texture/kfcb/gh_xiajiang';
            this.myScoreSp.node.active = myInfo.newScore != myInfo.oldScore;
            this.myScoreAdd.node.active = myInfo.newScore != myInfo.oldScore;
            GlobalUtil.setSpriteIcon(this.node, this.myScoreSp, path2)

        }
    }
}
