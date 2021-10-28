/**
  * @Description: 竞技场数据模型
  * @Author: jijing.liu
  * @Date: 2019-04-10 10:04:32
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-03-16 15:13:17
*/


export default class ArenaModel {

	// 每天免费的竞技次数
	readonly arenaFreeTimes: number = 5;
	// 竞技场数据是否已获取
	isArenaInfoGet: boolean = false;

	logList: icmsg.ArenaLog[] = [];
	score: number = 0;
	rank: number = 0
	points: number = 0;
	fightNum: number = 0;
	buyNum: number = 0;
	awardNums: number[] = [];
	raidTime: number; //满扫荡次数后的第一次扫荡时间
	raidTimes: number; //扫荡次数

	// 匹配到的玩家数据
	matchPlayers: icmsg.ArenaPlayer[] = [];
	// 匹配的时间戳
	matchTime: number = 0;

	// 自己的阵容布局
	battleArrayMsg: icmsg.ArenaDefenceRsp;

	// 排行榜数据
	list: icmsg.RankBrief[] = [];

	//防守阵容红点显示
	isDefenceRPShow = false
}
