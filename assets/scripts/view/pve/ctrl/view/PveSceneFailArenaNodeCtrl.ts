import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MainSetGuardianItemCtrl from '../../../../scenes/main/ctrl/MainSetGuardianItemCtrl';
import MainSetHeroItemCtrl from '../../../../scenes/main/ctrl/MainSetHeroItemCtrl';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';

/**
 * Pve失败界面控制类
 * @Author: sthoo.huang
 * @Date: 2019-08-01 14:12:48
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-28 18:32:27
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveSceneFailArenaNodeCtrl")
export default class PveSceneFailArenaNodeCtrl extends cc.Component {


    @property(cc.Node)
    titleNode1: cc.Node = null;
    @property(cc.Node)
    titleNode2: cc.Node = null;
    @property(cc.Label)
    title2Lb: cc.Label = null;
    @property(cc.Node)
    jinduNode: cc.Node = null;


    @property(cc.Node)
    winNode: cc.Node = null;

    @property(MainSetHeroItemCtrl)
    winHeroItems: MainSetHeroItemCtrl[] = [];
    @property(MainSetGuardianItemCtrl)
    winGuardianItems: MainSetGuardianItemCtrl[] = [];

    @property(cc.Node)
    winGuardianNode: cc.Node = null;


    @property(cc.Node)
    winFrame: cc.Node = null;
    @property(cc.Node)
    winIcon: cc.Node = null;
    @property(cc.Label)
    winName: cc.Label = null;
    @property(cc.Label)
    winPower: cc.Label = null;
    @property(cc.Label)
    winScore: cc.Label = null;
    @property(cc.Node)
    winScoreIcon: cc.Node = null;
    @property(cc.Label)
    winRank: cc.Label = null;
    @property(cc.Node)
    winRankNode: cc.Node = null;

    @property(cc.Node)
    lossNode: cc.Node = null;

    @property(MainSetHeroItemCtrl)
    lossHeroItems: MainSetHeroItemCtrl[] = [];
    @property(MainSetGuardianItemCtrl)
    lossGuardianItems: MainSetGuardianItemCtrl[] = [];
    @property(cc.Node)
    lossGuardianNode: cc.Node = null;

    @property(cc.Node)
    lossFrame: cc.Node = null;
    @property(cc.Node)
    lossIcon: cc.Node = null;
    @property(cc.Label)
    lossName: cc.Label = null;
    @property(cc.Label)
    lossPower: cc.Label = null;
    @property(cc.Label)
    lossScore: cc.Label = null;
    @property(cc.Node)
    lossScoreIcon: cc.Node = null;
    @property(cc.Label)
    lossRank: cc.Label = null;
    @property(cc.Node)
    lossRankNode: cc.Node = null;


    infos: any[] = []
    type: number = 1; //1 竞技场 2 锦标赛 3 据点战 4战争遗迹
    change: number[][] = []
    get model() {
        return ModelManager.get(RoleModel);
    }

    onEnable() {

        NetManager.on(icmsg.RoleImageRsp.MsgType, this._onRoleImageRsp, this)

    }

    onDisable() {
        NetManager.off(icmsg.RoleImageRsp.MsgType, this._onRoleImageRsp, this)
    }

    setPlayerData(infos: any[], change: number[][], type: number, str?: string, witch?: number) {

        this.infos = infos;
        this.type = type;
        this.change = change;
        this.titleNode1.active = type <= 2;
        this.titleNode2.active = type >= 3;

        if (type >= 3) {
            this.title2Lb.string = str;
            this.jinduNode.width = witch;
        }

        infos.forEach((info, index) => {

            //设置玩家信息
            //设置英雄信息
            let msg = new icmsg.RoleImageReq()
            msg.type = 0
            if (info < 100) {
                switch (this.type) {
                    case 1:
                        msg.type = 3;
                        break;
                }
            }
            msg.playerId = info;
            NetManager.send(msg)
        })

    }

    _onRoleImageRsp(data: icmsg.RoleImageRsp) {
        if (data.brief.id == this.model.id) {
            this.setPlayerHeroInfo(data, false)
            this.setPlayerInfo(data, false);
        } else {
            this.setPlayerHeroInfo(data, true)
            this.setPlayerInfo(data, true);
        }
    }

    setPlayerInfo(info: icmsg.RoleImageRsp, isWin: boolean) {
        if (isWin) {
            GlobalUtil.setSpriteIcon(this.node, this.winFrame, GlobalUtil.getHeadFrameById(info.brief.headFrame));
            GlobalUtil.setSpriteIcon(this.node, this.winIcon, GlobalUtil.getHeadIconById(info.brief.head));
            this.winName.string = info.brief.name;
            this.winPower.string = info.brief.power + '';
            this.winScore.string = this.change[0][0] + '';
            this.winRank.string = this.change[0][1] + '';

        } else {
            GlobalUtil.setSpriteIcon(this.node, this.lossFrame, GlobalUtil.getHeadFrameById(info.brief.headFrame));
            GlobalUtil.setSpriteIcon(this.node, this.lossIcon, GlobalUtil.getHeadIconById(info.brief.head));
            this.lossName.string = info.brief.name;
            this.lossPower.string = info.brief.power + '';
            this.lossScore.string = this.change[1][0] + '';
            this.lossRank.string = this.change[1][1] + '';
        }

        if (this.type == 1) {
            this.winScoreIcon.width = 28
            this.winScoreIcon.height = 32
            let path1 = 'common/texture/arena/icon_jifen'
            GlobalUtil.setSpriteIcon(this.node, this.winScoreIcon, path1)
            this.lossScoreIcon.width = 28
            this.lossScoreIcon.height = 32
            let path2 = 'common/texture/arena/icon_jifen'
            GlobalUtil.setSpriteIcon(this.node, this.lossScoreIcon, path2)
        } else if (this.type == 2) {
            this.winScoreIcon.width = 32
            this.winScoreIcon.height = 29
            let path1 = 'common/texture/pve/fb_bei'
            GlobalUtil.setSpriteIcon(this.node, this.winScoreIcon, path1)
            this.lossScoreIcon.width = 32
            this.lossScoreIcon.height = 29
            let path2 = 'common/texture/pve/fb_bei'
            GlobalUtil.setSpriteIcon(this.node, this.lossScoreIcon, path2)
        }

        let show = this.type <= 2
        this.winScoreIcon.active = show;
        this.winScore.node.active = show;
        this.lossScoreIcon.active = show;
        this.lossScore.node.active = show;
        this.winRankNode.active = show;
        this.winRank.node.active = show;
        this.lossRankNode.active = show;
        this.lossRank.node.active = show;
    }


    setPlayerHeroInfo(player: icmsg.RoleImageRsp, isWin: boolean) {
        let heros = player.heroes
        //this.selectHeroItemIds = [];

        let heroItems = isWin ? this.winHeroItems : this.lossHeroItems;
        let guardianItems = isWin ? this.winGuardianItems : this.lossGuardianItems;
        let guardianNode = isWin ? this.winGuardianNode : this.lossGuardianNode;
        let guardianNum = 0;
        for (let index = 0; index < 6; index++) {
            let data = heros[index];
            let comp = heroItems[index]
            let guardian = guardianItems[index]
            if (data && data.heroBrief.typeId > 0) {
                comp.node.active = true
                comp.updateView(data, index, player.brief.id, player.type);
                if (data.guardian && data.guardian.type > 0) {
                    guardian.updateView(data.guardian, index, player.brief.id, player.type);
                    guardianNum += 1;
                } else {
                    guardian.updateNullHero()
                }
            } else {
                comp.updateNullHero()
                guardian.updateNullHero()
            }
        }
        guardianNode.active = guardianNum > 0;
    }

}
