import ArenaTeamAttackViewItemCtrl from './ArenaTeamAttackViewItemCtrl';
import ArenaTeamViewModel from '../model/ArenaTeamViewModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';

/** 
 * @Description: 组队竞技场挑战排序View
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-22 17:14:33
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenaTeam/ArenaTeamAttackViewCtrl")
export default class ArenaTeamAttackViewCtrl extends gdk.BasePanel {

    @property([cc.Node])
    teamItems: cc.Node[] = []
    @property([cc.Node])
    enemyItems: cc.Node[] = []

    @property(cc.Label)
    timeLb: cc.Label = null;

    teamMates: icmsg.ArenaTeamRoleHeroes[] = []
    opponents: icmsg.ArenaTeamRoleHeroes[] = []
    attackTime: number = 60;
    showTime: number = 1;
    get model(): ArenaTeamViewModel { return ModelManager.get(ArenaTeamViewModel); }
    sendEnd: boolean = false;
    onEnable() {
        this.attackTime = this.model.mainCfg.auto;
        this.showTime = 1;
        this.model.AttackEnterView = 2;
        NetManager.send(new icmsg.ArenaTeamConfirmReq, (rsp: icmsg.ArenaTeamConfirmRsp) => {
            this.model.matchInfo.confirmed = true;
            this.teamMates = rsp.teammates
            this.opponents = rsp.opponents;
            this.sendEnd = true;
            this.initTeamPlayerInfo()
            this.initEnemyPlayerInfo()
        }, this)
    }

    onDisable() {
        NetManager.targetOff(this);
    }
    update(dt: number) {
        if (this.attackTime > 0) {
            this.attackTime -= dt;
            this.showTime -= dt;
            if (this.showTime <= 0) {
                this.showTime += 1;
                this.timeLb.string = Math.ceil(this.attackTime) + '';
            }
            if (this.attackTime <= 0) {
                //打开挑战界面
                this.attackBtnClick()
            }
        }
    }

    initTeamPlayerInfo() {
        this.teamItems.forEach((node, i) => {
            let ctrl = node.getComponent(ArenaTeamAttackViewItemCtrl);
            if (this.teamMates.length > i) {
                node.active = true;
                ctrl.data = { data: this.teamMates[i], show: true }
                ctrl.updateView()
            } else {
                node.active = false;
            }

        })
    }

    initEnemyPlayerInfo() {
        this.enemyItems.forEach((node, i) => {
            let ctrl = node.getComponent(ArenaTeamAttackViewItemCtrl);
            if (this.opponents.length > i) {
                node.active = true;
                let show = i != this.model.randomNum;
                ctrl.data = { data: this.opponents[i], show: show }
                ctrl.updateView()
            } else {
                node.active = false;
            }
        })
    }

    upDownBtnClick(event: Event, idx: string) {
        let index = parseInt(idx);
        if (index == 0) {
            let tem = this.teamMates[0]
            this.teamMates[0] = this.teamMates[1];
            this.teamMates[1] = tem;
        } else {
            let tem = this.teamMates[1]
            this.teamMates[1] = this.teamMates[2];
            this.teamMates[2] = tem;
        }
        this.initTeamPlayerInfo()
    }

    attackBtnClick() {
        if (!this.sendEnd) return;
        let playerIds: number[] = []
        this.teamMates.forEach(data => {
            playerIds.push(data.playerId);
        })
        let msg = new icmsg.ArenaTeamFightOrderReq()
        msg.order = playerIds
        NetManager.send(msg, (rsp: icmsg.ArenaTeamFightOrderRsp) => {
            //this.model.teamMates = this.teamMates;
            //this.model.opponents = this.opponents;
            let teamData = [];
            rsp.order.forEach(id => {
                this.model.matchData.teammates.forEach(data => {
                    if (data.brief.id == id) {
                        teamData.push(data);
                    }
                })
            })
            this.model.teamMates = teamData;
            this.model.opponents = this.model.matchData.opponents;

            this.model.matchInfo.confirmed = true;
            //this.model.matchInfo.fightedNum = 0;
            this.model.fightNum = 0;
            this.model.attackWinList = [0, 0, 0]
            //进入战斗
            this.close();
            let index = this.model.fightNum//this.model.matchInfo.fightedNum;
            let p = this.model.opponents[index].brief;
            let player = new icmsg.ArenaPlayer();
            player.id = p.id;
            player.robotId = null;
            player.name = p.name;
            player.head = p.head;
            player.frame = p.headFrame;
            player.level = p.level;
            player.power = p.power;
            JumpUtils.openPveArenaScene([player.id, 0, player], player.name, 'ARENATEAM');

        }, this)
    }

}
