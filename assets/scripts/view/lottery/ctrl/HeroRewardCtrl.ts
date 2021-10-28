import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroDetailViewCtrl from './HeroDetailViewCtrl';
import HeroUtils from '../../../common/utils/HeroUtils';
import LotteryModel from '../model/LotteryModel';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import StarItemCtrl from '../../../common/widgets/StarItemCtrl';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { HeroCfg, Item_equipCfg, ItemCfg } from '../../../a/config';

/** 
  * @Description: 获得单个新英雄的展示窗口
  * @Author: weiliang.huang  
  * @Date: 2019-05-30 10:00:51 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-09-27 14:42:26
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroRewardCtrl")
export default class HeroRewardCtrl extends cc.Component {

    @property(sp.Skeleton)
    spine: sp.Skeleton = null

    @property(sp.Skeleton)
    title: sp.Skeleton = null

    @property(cc.Label)
    heroName: cc.Label = null

    @property(cc.RichText)
    heroDesc: cc.RichText = null

    @property(cc.Node)
    soldierIcon: cc.Node = null

    @property(cc.Node)
    rewardItem: cc.Node = null

    @property(cc.Node)
    downPart: cc.Node = null

    @property(cc.Node)
    starLayout: cc.Node = null

    @property(cc.Prefab)
    starItem: cc.Prefab = null

    @property(cc.Node)
    newFlag: cc.Node = null


    // onLoad () {}
    heroCfg: HeroCfg = null

    isLotteryShow = false

    get lotteryModel(): LotteryModel {
        return ModelManager.get(LotteryModel)
    }

    start() {

    }

    onDestroy() {
        if (this.isLotteryShow) {
            if (this.lotteryModel.showGoodsId.length < this._getShowGoodsLen()) {
                //符合条件没展示完的继续展示
                gdk.panel.open(PanelId.HeroReward, (node: cc.Node) => {
                    let comp = node.getComponent(HeroRewardCtrl)
                    comp.showLotteryResult()
                })
            } else {
                GlobalUtil.openRewadrView(this.lotteryModel.resultGoods)
            }
        }
    }

    /**
     * 展示英雄spine
    */
    showHero(id: number, num: number) {
        this.title.setAnimation(0, "UI_gxhd", false)
        let cfg = ConfigManager.getItemById(HeroCfg, id)
        if (cfg) {
            this.newFlag.active = true
            this._initStar()
            this.heroCfg = cfg
            this.spine.node.active = true
            this.rewardItem.active = false
            this.heroName.string = cfg.name
            this.heroDesc.string = cfg.desc
            this._updateStar(cfg.star_min)
            let path = GlobalUtil.getSoldierIcon(cfg.soldier_id[0], true)
            GlobalUtil.setSpriteIcon(this.node, this.soldierIcon, path)
            HeroUtils.setSpineData(this.node, this.spine, cfg.skin)
            return;
        }

        let itemCfg = ConfigManager.getItemById(ItemCfg, id)
        if (itemCfg) {
            this.downPart.active = false
            this.spine.node.active = false
            this.rewardItem.active = true
            this.heroName.string = itemCfg.name
            let uiSlot = this.rewardItem.getChildByName("UiSlotItem").getComponent(UiSlotItem)
            uiSlot.updateItemInfo(id, num)
            return
        }

        let equipCfg = ConfigManager.getItemById(Item_equipCfg, id)
        if (equipCfg) {
            this.downPart.active = false
            this.spine.node.active = false
            this.rewardItem.active = true
            this.heroName.string = equipCfg.name
            let uiSlot = this.rewardItem.getChildByName("UiSlotItem").getComponent(UiSlotItem)
            uiSlot.updateItemInfo(id)
            return
        }
    }

    _initStar() {
        if (this.starLayout.childrenCount == 0) {
            for (let index = 0; index < 5; index++) {
                let item = this._createStar()
                item.active = false
                this.starLayout.addChild(item)
            }
        }
    }

    openDetailFunc() {
        if (!this.heroCfg) return
        gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
            let comp = node.getComponent(HeroDetailViewCtrl)
            comp.initHeroInfo(this.heroCfg)
        })
    }

    _updateStar(starNum: number) {
        let nowCount = this.starLayout.childrenCount
        for (let index = 0; index < nowCount; index++) {
            let child = this.starLayout.children[index]
            let scr: StarItemCtrl = child.getComponent(StarItemCtrl)
            child.active = index < starNum
            scr.updateState(index < starNum ? 1 : 0)
        }
    }

    _createStar() {
        let item = cc.instantiate(this.starItem)
        let ctrl = item.getComponent(StarItemCtrl)
        ctrl.updateSize(36, 36)
        return item
    }


    /**
    * 展示英雄抽奖结果
    */
    showLotteryResult() {
        this.isLotteryShow = true
        this.title.setAnimation(0, "UI_gxhd", false)
        let showIds = this.lotteryModel.showGoodsId
        let showGoodsInfo = this.lotteryModel.showGoodsInfo
        for (let key in showGoodsInfo) {
            let id = parseInt(key)
            let num = showGoodsInfo[id]
            if (showIds.indexOf(id) == -1) {
                showIds.push(id)
                this.showHero(id, num)
                break
            }
        }
    }

    _getShowGoodsLen() {
        return Object.keys(this.lotteryModel.showGoodsInfo).length;
    }
}
