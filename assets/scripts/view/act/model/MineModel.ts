export default class MineModel {
    curCaveSstate: icmsg.ActivityCaveStateRsp;

    passBoight: boolean;
    passReward1: number[];
    passReward2: number[];
    exChangeOpen: boolean;

}
//矿洞大作战章节探索信息
export interface MineTansuoData {
    tansuoState: boolean,
    startTime: number
}
