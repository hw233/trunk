import ModelManager from '../../../common/managers/ModelManager';
import ArenaHonorModel from '../../../common/models/ArenaHonorModel';
import WorldHonorModel from '../../../common/models/WorldHonorModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import PanelId from '../../../configs/ids/PanelId';


/**
 * enemy荣耀巅峰赛界面控制器
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-17 09:53:42
 */
const { ccclass, property, menu } = cc._decorator;
function hasId(v: any): boolean {
    return v.id == this.id;
}
@ccclass
@menu("qszc/view/arenaHonor/ArenaHonorPlayerItemCtrl")
export default class ArenaHonorPlayerItemCtrl extends cc.Component {

    @property(cc.Node)
    playerIcon: cc.Node = null;
    @property(cc.Node)
    playerFrame: cc.Node = null;
    @property(cc.Node)
    playerFrameType: cc.Node = null;
    @property(cc.Label)
    playerLv: cc.Label = null;
    @property(cc.Label)
    playerName: cc.Label = null;
    @property(cc.Label)
    playerGuildName: cc.Label = null;
    @property(cc.Label)
    playerIndex: cc.Label = null;

    info: icmsg.RoleBrief;
    get model1(): ArenaHonorModel { return ModelManager.get(ArenaHonorModel); }
    get model2(): WorldHonorModel { return ModelManager.get(WorldHonorModel); }
    curState: number = 0;//(0无人 1失败 2暂未比赛 3胜利)
    updatePlayerInfo(actType: number, playerInfo: icmsg.RoleBrief, state: number, showName: boolean, grayState: number = 1, showTitle: boolean = true) {
        if (!playerInfo) {
            this.playerIndex.node.active = true;
            this.playerIcon.active = false;
            this.playerFrameType.active = false;
            this.playerName.node.active = false;
            this.playerGuildName.node.active = false;
            this.playerLv.node.active = false;
            GlobalUtil.setSpriteIcon(this.node, this.playerFrame, 'common/texture/sub_touxiangkuang')
        } else {
            this.info = playerInfo;
            this.curState = state;
            this.playerIndex.node.active = false;
            this.playerIcon.active = true;
            //this.playerFrameType.active = false;
            this.playerName.node.active = showName;
            this.playerGuildName.node.active = showName;
            this.playerLv.node.active = true;
            this.playerLv.string = this.info.level + ''
            if (showName) {
                this.playerName.string = this.info.name;
                if (actType == 1) {
                    //荣耀巅峰赛
                    if (this.model1.guildNameMap[this.info.guildId]) {
                        this.playerGuildName.string = `[S${GlobalUtil.getSeverIdByPlayerId(playerInfo.id)}]` + this.model1.guildNameMap[this.info.guildId];
                    } else {
                        this.playerGuildName.string = ''
                    }
                } else {
                    //世界巅峰赛
                    if (this.model2.guildNameMap[this.info.guildId]) {
                        this.playerGuildName.string = `[S${GlobalUtil.getSeverIdByPlayerId(playerInfo.id)}]` + this.model2.guildNameMap[this.info.guildId];
                    } else {
                        this.playerGuildName.string = ''
                    }
                }


            }
            GlobalUtil.setSpriteIcon(this.node, this.playerIcon, GlobalUtil.getHeadIconById(this.info.head));
            GlobalUtil.setSpriteIcon(this.node, this.playerFrame, GlobalUtil.getHeadFrameById(this.info.headFrame));
            GlobalUtil.setSpriteIcon(this.node, this.playerFrameType, GlobalUtil.getHeadTitleById(this.info.title));
            this.playerFrameType.active = showTitle;
            let temGrayState: 0 | 1 = grayState < 1 ? 1 : 0;
            GlobalUtil.setAllNodeGray(this.node, temGrayState)

        }
    }


    headBtnClick() {
        if (this.info) {
            gdk.panel.setArgs(PanelId.MainSet, this.info.id, 7)
            gdk.panel.open(PanelId.MainSet)
        }
    }


}
