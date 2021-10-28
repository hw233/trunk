import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroGetCtrl from '../ctrl/HeroGetCtrl';
import LotteryModel from '../model/LotteryModel';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import { BagItem, BagType } from '../../../common/models/BagModel';
import { ItemCfg } from '../../../a/config';

/** 
  * @Description: 抽卡-合卡工具类
  * @Author: weiliang.huang  
  * @Date: 2019-05-28 15:56:55 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 13:35:12
*/

export default class LotteryUtil {


    static get lotteryModel(): LotteryModel {
        return ModelManager.get(LotteryModel)
    }

    /**
     * 获取非指定类 满足条件的英雄材料列表
     * @param id 
     */
    static getComposeHeros(id: number): BagItem[] {
        // let cfg = ConfigManager.getItemById(Luckydraw_composeCfg, id)
        // if (cfg.herolist && cfg.herolist.length > 0) {
        //     return
        // }
        // let color = cfg.color || 1
        // //let star = cfg.star || 0
        // let cond = { color: color }
        // let func = null
        // // if (star > 0) {
        // //     func = (item: BagItem) => {
        // //         let info = <HeroInfo>item.extInfo
        // //         return info.star >= star
        // //     }
        // // }
        // let heros = BagUtils.getItemsByType(BagType.HERO, cond, func)

        return []
    }

    /**
     * 指定合卡的材料获取方法
     * @param id 英雄配表id
     * @param star 星级限制
     */
    static getComposeHeros2(id: number, star: number = 0): BagItem[] {

        let cond = { id: id }
        let func = (item: BagItem) => {
            let heroInfo = <icmsg.HeroInfo>item.extInfo
            return heroInfo.star >= star
        }
        let heros = BagUtils.getItemsByType(BagType.HERO, cond, func)
        GlobalUtil.sortArray(heros, this.sortFunc)
        return heros
    }

    /**列表排序 */
    static sortFunc(a: BagItem, b: BagItem) {
        let infoa = <icmsg.HeroInfo>a.extInfo
        let infob = <icmsg.HeroInfo>b.extInfo
        if (infoa.power == infob.power) {
            return a.itemId - b.itemId
        }
        return infoa.power - infob.power
    }

    /**英雄战力比较 */
    static compareFunc(a: BagItem, b: BagItem) {
        let infoa = <icmsg.HeroInfo>a.extInfo
        let infob = <icmsg.HeroInfo>b.extInfo
        return infoa.power > infob.power
    }
    /**获取非指定类 满足条件的英雄材料列表 
     * 并进行排序处理, 把有重复/战力低的英雄放前面,
    */
    static getComposeHeros3(id: number): BagItem[] {
        let list1: Object = {}    // 单个英雄的列表
        let list2 = []    // 多个英雄的列表
        let heros = this.getComposeHeros(id)
        for (let index = 0; index < heros.length; index++) {
            const hero = heros[index];
            if (list1[hero.itemId]) {
                // 如果有同类英雄,则保存战力高的,战力低的放入list2列表
                if (this.compareFunc(hero, list1[hero.itemId])) {
                    list2.push(list1[hero.itemId])
                    list1[hero.itemId] = hero
                } else {
                    list2.push(hero)
                }
            } else {
                // 如果list1无同类英雄,则直接放入
                list1[hero.itemId] = hero
            }
        }
        // 先对重复列表进行战力排序
        GlobalUtil.sortArray(list2, this.sortFunc)
        // 然后把list1列表转成数组表,排序后插入list2表
        let list3 = []
        for (const key in list1) {
            const element = list1[key];
            list3.push(element)
        }
        GlobalUtil.sortArray(list3, this.sortFunc)
        return [...list2, ...list3]
    }


    static getAllClips(): BagItem[] {
        let list: BagItem[] = BagUtils.getItemsByType(BagType.ITEM);
        let newList: BagItem[] = [];
        list.forEach(element => {
            if (element.itemId >= 180001 && element.itemId <= 189999) {
                newList.push(element);
            }
        });
        return newList;
    }

    static getClipsByColor(color: number) {
        let list = this.getAllClips();
        let newList: BagItem[] = [];
        list.forEach(element => {
            let item: ItemCfg = ConfigManager.getItemById(ItemCfg, element.itemId);
            if (item.color == color) {
                newList.push(element);
            }
        });
        GlobalUtil.sortArray(newList, (a, b) => {
            return b.itemNum - a.itemNum;
        })
        return newList;
    }


    /**抽卡获取效果 
     * 有多个符合展示条件的要顺序展示
     * 最后再展示所有
     * 
    */
    static lotteryRewardView(list: icmsg.GoodsInfo[]) {
        this.lotteryModel.resultGoods = list
        this.lotteryModel.showGoodsId = []
        this.lotteryModel.showGoodsInfo = {};

        //转换为id--num格式
        let showGoodsInfo = this.lotteryModel.showGoodsInfo;
        for (let i = 0; i < list.length; i++) {
            let cfg = BagUtils.getConfigById(list[i].typeId)
            //符合条件的才要展示效果 金色及金色以上
            if (cfg && cfg.defaultColor >= 4) {
                if (!showGoodsInfo[list[i].typeId]) {
                    showGoodsInfo[list[i].typeId] = list[i].num
                } else {
                    showGoodsInfo[list[i].typeId] += list[i].num
                }
            }
        }

        //特殊的展示效果
        if (Object.keys(showGoodsInfo).length > 0) {
            gdk.panel.open(PanelId.HeroReward, (node: cc.Node) => {
                let comp = node.getComponent(HeroGetCtrl)
                comp.isLotteryShow = true
                comp.showLotteryResult()
            })
        } else {
            //常规的物品获得展示
            GlobalUtil.openRewadrView(list)
        }
    }

}