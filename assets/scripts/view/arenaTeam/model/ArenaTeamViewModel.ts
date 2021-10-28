import { Teamarena_mainCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
/** 
 * @Description: 组队竞技场数据模型类
 * @Author: yaozu.hu
 * @Date: 2021-01-29 14:47:59
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-22 17:19:05
 */


export default class ArenaTeamViewModel {
    static get instance() {
        return gdk.Tool.getSingleton(ArenaTeamViewModel);
    }

    // 请求挑战的入口：0 匹配 1 战报
    fightType: number = 0;
    // 挑战的对象 player id
    fightPlayerId: number;
    //如果是机器人 阵容配置 对应的是pvp配置中的id
    weaponId: number = 0

    //组队竞技场的当前活动ID
    actId: number = 0;
    //组队竞技场--队伍信息
    arenaTeamInfo: icmsg.ArenaTeamInfo;
    matchInfo: icmsg.ArenaTeamMatch;
    fightRewarded: number = 0;
    rankRewarded: boolean = false;

    //随机隐藏的敌人下标
    randomNum: number = -1;

    //确定后的战斗玩家数据
    teamMates: icmsg.ArenaTeamRoleBrief[] = []
    opponents: icmsg.ArenaTeamRoleBrief[] = [];

    //挑战进入的选择界面
    AttackEnterView: number = 0 //0无 1匹配界面 2排序界面 
    //匹配记录
    matchData: icmsg.ArenaTeamMatchRsp

    //战斗计数
    winNum: number = 0;

    fightNum: number = 0;

    // 0未战斗 1失败 2胜利
    attackWinList: number[] = [0, 0, 0];
    attackWinSpStr: string[] = ['zdjjc_weizhandou', 'zdjjc_bai', 'zdjjc_sheng']
    //arenaHeroList
    arenaHeroList: icmsg.FightHero[] = [];
    arenaGeneral: icmsg.FightGeneral;


    enterView: boolean = false;

    private _mainCfg: Teamarena_mainCfg;

    //邀请红点
    inviterRed: boolean = false;

    get mainCfg() {
        if (!this._mainCfg) {
            this._mainCfg = ConfigManager.getItem(Teamarena_mainCfg, { free: 2 });
        }
        return this._mainCfg;
    }

    //是否队长
    get isTeamLeader() {
        let roleModel = ModelManager.get(RoleModel)
        if (this.arenaTeamInfo && this.arenaTeamInfo.players[0]) {
            return roleModel.id == this.arenaTeamInfo.players[0].brief.id
        }
        return false
    }
}