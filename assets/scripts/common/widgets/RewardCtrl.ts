import BagModel, { BagItem } from '../models/BagModel';
import ButtonSoundId from '../../configs/ids/ButtonSoundId';
import ConfigManager from '../managers/ConfigManager';
import CopyModel from '../models/CopyModel';
import GlobalUtil from '../utils/GlobalUtil';
import GuideModel from '../../guide/model/GuideModel';
import ModelManager from '../managers/ModelManager';
import PanelId from '../../configs/ids/PanelId';
import RewardItemFlyCtrl from './RewardItemFlyCtrl';
import StoreModel from '../../view/store/model/StoreModel';
import WipeOutChipCtrl from '../../view/map/ctrl/WipeOutChipCtrl';
import { BagEvent } from '../../view/bag/enum/BagEvent';
import { Copy_stageCfg, Item_composeCfg, ItemCfg } from '../../a/config';
import { ListView, ListViewDir } from './UiListview';

/** 
  * @Description: 恭喜获得窗口
  * @Author: weiliang.huang  
  * @Date: 2019-05-14 14:57:28 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-12 10:27:59
*/
const { ccclass, property, menu } = cc._decorator;

export type RewardInfoType = {
    goodList: icmsg.GoodsInfo[],  // 奖励信息
    showType: RewardType,    // 用于区别奖励信息来源,做显示修改用
    bagItems?: BagItem[],    //用于带有extInfo的道具
}

export enum RewardType {
    NORMAL = 0,
    HERO = 1
}
@ccclass
@menu("qszc/common/widgets/RewardCtrl")
export default class RewardCtrl extends gdk.BasePanel {

    @property(cc.Node)
    titleBg: cc.Node = null

    @property(sp.Skeleton)
    titleSpine: sp.Skeleton = null

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Node)
    closeTips: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    @property(cc.Prefab)
    uiSoltItem: cc.Prefab = null

    @property(cc.Prefab)
    diamondPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    goldPrefab: cc.Prefab = null;

    @property(cc.Node)
    wipeoutChipNode: cc.Node = null;

    goodList: icmsg.GoodsInfo[] = []

    list: ListView = null

    column: number = 5;


    /**
    * 随机范围(random1~random2之间)
    */
    random1: number = -200
    random2: number = 200
    createTime: number = 0.1
    speed: number = 1000
    specialFly: any = {};// id-worldPos
    delayRatio: number = 1;

    canClose: boolean = false;
    get guideModel(): GuideModel {
        return ModelManager.get(GuideModel);
    }

    get bagModel(): BagModel {
        return ModelManager.get(BagModel);
    }

    get storeModel(): StoreModel {
        return ModelManager.get(StoreModel);
    }

    onLoad() {
        this.titleBg.active = false;
        this.titleSpine.node.active = false;
    }

    onEnable() {
        let arg = this.args[0];
        if (arg) {
            this.delayRatio = arg;
        }
    }

    onDestroy() {
        if (this.list) {
            this.list.destroy()
            this.list = null
        }
        gdk.e.emit(BagEvent.AUTO_COMPOSE_CHIP)
        gdk.Timer.clearAll(this)

        //碎片合成提示窗口
        if (this.bagModel.heroChips.length > 0) {
            if (!gdk.panel.isOpenOrOpening(PanelId.TurntableDrawView)) {
                gdk.panel.open(PanelId.MainComposeTip)
            }
        }

        if (this.storeModel.limitGiftPushInfo) {
            let id = this.storeModel.limitGiftPushInfo.id
            gdk.panel.setArgs(PanelId.LimitGiftView, id)
            gdk.panel.open(PanelId.LimitGiftView)
            this.storeModel.limitGiftPushInfo = null
        }
    }

    _initListView() {
        if (this.list) {
            this.list.destroy()
        }

        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.rewardItem,
            cb_host: this,
            async: true,
            column: this.column,
            gap_x: 0,
            gap_y: 0,
            direction: ListViewDir.Vertical,
        })
    }

    initRewardInfo(info: RewardInfoType, plusDatas: any = null, specialFly: any = {}) {
        this.specialFly = specialFly;
        this.goodList = info.goodList
        this.canClose = false;
        let len = this.goodList.length + (info.bagItems ? info.bagItems.length : 0) + (plusDatas ? plusDatas.length : 0)
        if (len < 5) {
            this.column = len
        }
        let row = Math.ceil(len / this.column)

        // 计算scrollview的宽高
        let svWidth = this.column * 110
        let svHeight = row * 110 + 10
        svHeight = Math.min(svHeight, 350)

        let bgHeihgt = svHeight + 220
        this.bg.height = bgHeihgt
        this.titleBg.active = true;
        this.titleBg.y = bgHeihgt / 2 - 65
        this.closeTips.y = -bgHeihgt / 2 - 60
        this.titleSpine.clearTracks()
        this.titleSpine.setAnimation(0, "UI_gxhd", false)
        this.titleSpine.loop = false
        this.titleSpine.node.active = true
        if (GlobalUtil.isSoundOn) {
            gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.popup)
        }

        this.scrollView.node.setContentSize(cc.size(svWidth, svHeight))
        this.scrollView.node.x = -svWidth / 2 + 5
        this.scrollView.node.y = svHeight / 2 //- 20
        this._initListView()

        let addDatas = []
        if (plusDatas) {
            plusDatas.forEach((element, index) => {
                addDatas.push({
                    index: index,
                    typeId: element.typeId,
                    num: element.num,
                    delayShow: true,
                    effect: true,
                    showCommonEffect: false,
                    cxEffect: true,
                    extInfo: element.extInfo,
                    realStar: element.realStar//英雄的真实星星等级
                });
            });
            this.goodList = GlobalUtil.sortGoodsInfo(this.goodList)
        }
        let extInfoDatas = []
        if (info.bagItems) {
            info.bagItems.forEach((e, idx) => {
                extInfoDatas.push({
                    index: idx,
                    typeId: e.itemId,
                    num: e.itemNum,
                    delayShow: true,
                    effect: true,
                    showCommonEffect: false,
                    cxEffect: true,
                    extInfo: e.extInfo,
                });
            });
        }
        gdk.Timer.once(200, this, () => {
            let datas = addDatas.concat(GlobalUtil.getEffectItemList(this.goodList, true, true, false, true, false)).concat(extInfoDatas);
            datas.forEach((e, idx) => {
                if (e.index >= 0) {
                    e.index = idx * this.delayRatio;
                }
            })
            this.list.set_data(datas);
        })

        let closeTime = Math.min(2000, 200 + len * 300)
        gdk.Timer.once(closeTime, this, () => {
            this.canClose = true;
        })

        if (gdk.panel.isOpenOrOpening(PanelId.PveReady)) {
            let datas = info.goodList
            let copyModel = ModelManager.get(CopyModel)
            let stageCfg = ConfigManager.getItemById(Copy_stageCfg, copyModel.hangStageId)
            let showInfos: icmsg.GoodsInfo[] = []
            datas.forEach(element => {
                let composeCfg = ConfigManager.getItemById(Item_composeCfg, element.typeId)
                if (composeCfg) {
                    let cfg = ConfigManager.getItemById(ItemCfg, composeCfg.id)
                    let haveSame = false
                    for (let i = 0; i < showInfos.length; i++) {
                        if (showInfos[i].typeId == element.typeId) {
                            showInfos[i].num += element.num
                            haveSame = true
                            break
                        }
                    }
                    if (cfg.random_hero_chip && cfg.random_hero_chip.length >= 2) {
                        //英雄随机碎片不参与自动合成,需要背包界面手动合成
                        haveSame = true;
                    }
                    if (!haveSame) {
                        let good = new icmsg.GoodsInfo()
                        good.typeId = element.typeId
                        good.num = element.num
                        showInfos.push(good)
                    }

                }
            });
            for (let i = 0; i < showInfos.length; i++) {
                gdk.Timer.once(i * 1200, this, () => {
                    this.wipeoutChipNode.y = -bgHeihgt / 2 - this.wipeoutChipNode.height / 2 - 20
                    this.wipeoutChipNode.active = true
                    let ctrl = this.wipeoutChipNode.getComponent(WipeOutChipCtrl)
                    ctrl.updateView(showInfos[i].typeId, showInfos[i].num)
                })
            }
        }

    }

    close() {
        if (this.canClose) {
            let ctrl = this.node.getComponent(RewardItemFlyCtrl)
            ctrl.flyAction(this.list.datas, this.specialFly)
            super.close()
        }
    }
}
