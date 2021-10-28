import { BagItem } from '../../../common/models/BagModel';
import { Copy_stageCfg } from '../../../a/config';

/** 
 * @Description: 主线数据模型类
 * @Author: jijing.liu  
 * @Date: 2019-04-18 11:13:54
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:40:01
 */

export default class MainLineModel {

    // 最近过关的关卡id
    completeStageCfgId: number = 0;

    isCopyDataGet = false;

    //当前挂机关卡的探索奖励列表
    rewardList: Array<icmsg.GoodsInfo> = [];

    // 当前要进入的关卡相关id
    curChapterId: string = '';
    curAreaId: string = '';
    curStageId: string = '';

    //当前选择的地图id 
    curSelectChapterId: string = ''
    //当前选择的区域id 
    curSelectAreaId: string = ''
    //当前选择的关卡id 
    curSelectStageId: string = ''

    // 主线关卡配置数据
    stageDatas: Copy_stageCfg[] = null;

    // {chapterId，{{areaId, {{stageId, Copy_stageCfg}}}}}
    parsedStageDatas: any = {};

    // {'chapterId'，chapterName}
    chapterNames: any = {};
    // {'chapterId'+'areaId'，areaName}
    areaNames: any = {};
    // {'chapterId'+'areaId'+'stageId'，stageName}
    stageNames: any = {};

    // {stageCfgId, number}
    // 关卡的奖杯总数
    stageCupsNum: any = {};

    // {chapterId，{areaId, [Copy_prizeCfg]}}
    areaCupsCfg: any = {};
    // 区域奖励最高奖杯数 {chapterId, {area, number}}
    areaCupNumber: any = {};

    // 玩家已经获得的区域奖杯数 
    // {prize_id, cupsNumber} 每个区域一个prize_id配置
    ownAreaCupNumber: any = {};
    // 玩家已经领取的区域奖励
    // {prize_id, boxs} 
    receiveAreaCupReward: any = {};
    // 关卡奖杯信息
    // {stageCfgId，byte}
    stageCupInfo: any = {};

    needItem: BagItem;//当前需要的物品
    // 获取章节中过关的百分比
    getChapterPersent(cid: string) {
        // let cid = ParseMainLineId(this.completeStageCfgId, 0);
        for (const c in this.parsedStageDatas) {
            if (c == cid) {
                let pass: number = 0;
                let total: number = 0;
                for (const a in this.parsedStageDatas[c]) {
                    for (const s in this.parsedStageDatas[c][a]) {
                        if (this.parsedStageDatas[c][a][s].id <= this.completeStageCfgId) {
                            pass++;
                        }
                        total++;
                    }
                }
                return Math.ceil(pass / total * 100);
            }
        }
        return 0;
    }

    // 获取奖杯数
    // cupInfo： byte 0 未获取 1 已经获取
    getCupCount(cupInfo: number) {
        if (!cupInfo)
            return 0;
        let ret: number = 0;
        for (let i = 7; i >= 0; i--) {
            if ((cupInfo >> i) & 1) {
                ret++;
            }
        }
        return ret;
    }

    // index: 0 第一个 1 第二个 ...
    isCupGot(cupInfo: number, index: number) {
        return (cupInfo >> index) & 1;
    }

}