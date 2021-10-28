import ActUtil from '../../view/act/util/ActUtil';

/** 
 * @Description: 皇家竞技场数据
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-09 09:42:09
 */
export default class RoyalModel {


    mapIds: number[] = [];
    rank: number = 0;
    score: number = 0;
    division: number = 0;
    playerData: icmsg.RoyalBrief;
    showDivUpView: boolean = false; //播放段位升级效果
    matchNum: number = 0;
    serverNum: number = 1;
    divFlag: number = 0;
    enterNum: number = 0;
    buyNum: number = 0;

    scenneIndex: number = 0;
    defenderSceneId: number = 0;//设置防御阵容场景id


    //战斗数据 
    curFightNum: number = 0;    //当前已经的战斗场次
    addSkillId: number = 0; //战斗前随机的技能id
    defendPlayerFightData: icmsg.RoyalFightStartRsp;    //防守玩家战斗数据
    // 0未战斗 1失败 2胜利
    attackWinList: number[] = [0, 0, 0];
    attackWinSpStr: string[] = ['zdjjc_weizhandou', 'zdjjc_bai', 'zdjjc_sheng']

    winElite: any = {}; //当前关卡的战斗胜利条件

    //切换地图
    curIndex: number = 0;//当前选择的切换Id
    curSceneId: number = 0;//当前选择的场景Id

    //练习模式
    testSceneId: number = 0;
    testGeneral: icmsg.FightGeneral;

    clearFightData() {
        this.curFightNum = 0
        this.playerData = null
        this.addSkillId = 0
        this.defendPlayerFightData = null;
        this.attackWinList = [0, 0, 0];
        this.winElite = {};
    }

    clearTestFightData() {
        this.testSceneId = 0
        this.testGeneral = null
    }

    get rewardType() {
        let type = ActUtil.getActRewardType(133)
        if (type == 0) {
            type = 1
        }
        return type
    }
}
