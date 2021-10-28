import GlobalUtil from '../../../common/utils/GlobalUtil';

/** 
 * 抽奖-合卡 数据
 * @Author: sthoo.huang  
 * @Date: 2021-05-12 13:48:49 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-12 13:49:11
 */

export default class LotteryModel {

    resultGoods: icmsg.GoodsInfo[] = []//抽奖结果
    showGoodsInfo: { [id: number]: number } = [];//key id value num
    showGoodsId: number[] = [] //已经显示的物品id

    lastLuckydrawCfgId: number = 0

    drawNums: number[] = [];

    isCommonClick: boolean = false

    curSelectId: number;//当前抽奖类型Id 

    curGenePoolId: number; // 基因抽奖id
    geneResultGoods: icmsg.GoodsInfo[] = []//基因抽奖结果
    firstInGene: boolean = true; //每次登陆首次点开界面

    lotteryType: LotteryType; // 当前抽奖模式  普通/基因抽奖

    /**抽奖积分 */
    credit: number = 0;

    /**抽奖动画是否播放 / 获得高品质英雄是否弹窗  */
    get isSkipAni(): boolean {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // 小游戏模式永远跳过抽奖动画
            return true;
        }
        return GlobalUtil.getLocal('isSkipAni', true) || false;
    }
    set isSkipAni(v: boolean) {
        GlobalUtil.setLocal('isSkipAni', v, true);
    }

    /**基因转换源英雄id */
    geneTransOrgianlHeroId: number;
    /**基因转换目标英雄typeId */
    geneTransTargetHeroTypeId: number;
    /**基因召唤记录(全服) */
    geneDrawRecord: icmsg.GeneDrawHistory[] = [];
}

export enum LotteryType {
    normal = 1, //普通
    gene    //基因
}