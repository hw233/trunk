
/**
 * @Description: 雇佣兵数据类
 * @Author: luoyong
 * @Date:2020-07-10 12:09:43
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-22 12:22:15
 */


export default class MercenaryModel {
    //已设雇佣 英雄列表
    lentHeroList: icmsg.MercenaryLentHero[] = []

    //可租用的英雄数据
    listHero: icmsg.MercenaryListHero[] = []

    //已租用的英雄数据
    borrowedListHero: icmsg.MercenaryBorrowedHero[] = []

    //是否已绑定引导点击的系统英雄
    isBindSetHereItem = false;
    bindHeroId: number = 0;
}