import ActivityModel from '../../model/ActivityModel';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import MathUtil from '../../../../common/utils/MathUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { HeroCfg } from '../../../../../boot/configs/bconfig';
import { Hotel_globalCfg, Hotel_mapCfg } from '../../../../a/config';
import { timeStamp } from 'console';

/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-08 13:42:09
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/hotel/HotelTreasureItemCtrl")
export default class HotelTreasureItemCtrl extends UiListItem {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    layerLab: cc.Label = null;

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null;

    @property(cc.Label)
    proLab: cc.Label = null;

    @property(cc.Prefab)
    solt: cc.Prefab = null;

    @property(sp.Skeleton)
    heroSpine: sp.Skeleton = null;

    @property(cc.Node)
    lockState: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    _cfg: Hotel_mapCfg

    /**英雄状态 0停留 1行走 2 扫地 */
    _state: number = 0 //

    _dtTime: number = 0 //计时
    _stayTime = 0
    _moveTime = 0
    _maxDis = 210
    // _itemStates: { [place: number]: cc.Node } = {}

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    updateViewInfo(cfg: Hotel_mapCfg) {
        this._cfg = cfg
        this.layerLab.string = `第${this._cfg.layer}层`

        let heroCfg = ConfigManager.getItemById(HeroCfg, this._cfg.hero)
        let skin = heroCfg.skin
        if (this._cfg.awakening) {
            skin = skin + "_jx"
        }
        let url = StringUtils.format("spine/hero/{0}/0.5/{0}", skin);
        GlobalUtil.setSpineData(this.bg, this.heroSpine, url, true, "stand", true, false);
        this.heroSpine.node.x = MathUtil.rnd(-this._maxDis, this._maxDis)

        this.updateLayerInfo()

        this._stayTime = this.rndStayTime
        this._moveTime = this.rndMoveTime
        this._state = MathUtil.rnd(0, 1)
    }


    updateLayerInfo() {
        let info = this.actModel.hotelLayers[this._cfg.layer]
        let proNum = info ? info.num : 0
        this.proBar.progress = proNum / this._cfg.number
        this.proLab.string = `${Math.floor((proNum > this._cfg.number ? this._cfg.number : proNum) / this._cfg.number * 100)}%`

        let layerInfo = this.actModel.hotelLayers[this._cfg.layer]
        if (!layerInfo) {
            this.lockState.active = true
            GlobalUtil.setAllNodeGray(this.heroSpine.node.parent, 1)
            this.heroSpine.node.active = false

        } else {
            this.lockState.active = false
            GlobalUtil.setAllNodeGray(this.heroSpine.node.parent, 0)
            this.heroSpine.node.active = true

            this.content.removeAllChildren()
            let leftNum = this._cfg.number - layerInfo.num
            let itemId = this._cfg.reward[0][0]
            let num = this._cfg.reward[0][1]
            for (let i = 0; i < leftNum; i++) {
                let item = cc.instantiate(this.solt)
                item.scale = this._cfg.scale
                let ctrl = item.getComponent(UiSlotItem)
                ctrl.updateItemInfo(itemId, num)
                ctrl.itemInfo = {
                    series: 0,
                    itemId: itemId,
                    itemNum: 1,
                    type: BagUtils.getItemTypeById(itemId),
                    extInfo: null
                }
                item.parent = this.content
                item.x = MathUtil.rnd(-230, 230)
                item.y = MathUtil.rnd(-10, 10)
            }
        }
    }

    get rndStayTime() {
        let g_stay = ConfigManager.getItemById(Hotel_globalCfg, "stay").value
        return MathUtil.rnd(g_stay[0], g_stay[1])
    }

    get rndMoveTime() {
        let g_move = ConfigManager.getItemById(Hotel_globalCfg, "move").value
        return MathUtil.rnd(g_move[0], g_move[1])
    }

    update(dt: number) {
        this._dtTime += dt
        if (this._state == 0) {
            if (this._dtTime >= this._stayTime) {
                //停留结束,重置行走时间
                this._moveTime = this.rndMoveTime
                this._state = 1

                this._dtTime = 0
            } else {
                //this.heroSpine.setAnimation(0, "stand", true)
            }
        } else if (this._state == 1) {
            if (this._dtTime >= this._moveTime) {
                //行走结束,重置停留时间
                this._stayTime = this.rndStayTime
                this._state = 0

                this._dtTime = 0
            } else {
                if (this.heroSpine.node.getNumberOfRunningActions() == 0) {
                    // this.heroSpine.setAnimation(0, "stand", true)
                    let heroX = this.heroSpine.node.x
                    if (heroX >= 0) {
                        this.heroSpine.node.scaleX = 1
                    } else {
                        this.heroSpine.node.scaleX = -1
                    }
                    let dis = this._moveTime * 25
                    if (dis > this._maxDis) {
                        dis = this._maxDis
                    }
                    this.heroSpine.node.runAction(cc.moveTo(this._moveTime, cc.v2(-dis * this.heroSpine.node.scaleX, this.heroSpine.node.y)))
                }
            }
        } else if (this._state == 2) {
            if (this.heroSpine.node.getNumberOfRunningActions() == 0) {
                let isSkip = GlobalUtil.getLocal('hotelTreasureIsSkipAni', true) || false;
                if (isSkip) {
                    gdk.Timer.callLater(this, () => {
                        if (this.actModel.hotelReward.length > 0) {
                            GlobalUtil.openRewadrView(this.actModel.hotelReward)
                            this.actModel.hotelReward = []
                            this.actModel.hotelCleaning = false
                            this._state = 0
                            this._dtTime = 0
                        }
                    })
                    return
                }
                this.heroSpine.setAnimation(0, "saodi", true)
                let heroX = this.heroSpine.node.x
                let targetX = this._maxDis
                if (heroX >= 0) {
                    this.heroSpine.node.scaleX = 1
                    targetX = -this._maxDis
                } else {
                    this.heroSpine.node.scaleX = -1
                }

                let clean_time = ConfigManager.getItemById(Hotel_globalCfg, "clean_time").value[0]

                this.heroSpine.node.runAction(cc.sequence(cc.moveTo(clean_time, cc.v2(targetX, this.heroSpine.node.y)),
                    cc.callFunc(() => {
                        this.heroSpine.node.scaleX = -this.heroSpine.node.scaleX
                    }),
                    cc.moveTo(clean_time, cc.v2(-targetX, this.heroSpine.node.y)),
                    cc.callFunc(() => {
                        this.heroSpine.setAnimation(0, "stand", true)
                        this._stayTime = this.rndStayTime
                        this._state = 0
                        this._dtTime = 0

                        if (this.actModel.hotelReward.length > 0) {
                            GlobalUtil.openRewadrView(this.actModel.hotelReward)
                            this.actModel.hotelReward = []
                            this.actModel.hotelCleaning = false
                        }
                    })))
            }
        }
    }

    /**扫地模式 */
    setCleanMode() {
        this.updateLayerInfo()
        this.heroSpine.node.stopAllActions()
        this._state = 2
    }

    /**解锁层  播放动画 */
    unLockLayer() {
        cc.find("lockIcon", this.lockState).active = false
        let spine = cc.find("unlockSpine", this.lockState).getComponent(sp.Skeleton)
        spine.setAnimation(0, "stand2", false)
        spine.setCompleteListener((trackEntry, loopCount) => {
            this.setCleanMode()
        })
    }

    onShowReward() {
        gdk.panel.setArgs(PanelId.HotelLayerRewardView, this._cfg.layer)
        gdk.panel.open(PanelId.HotelLayerRewardView)
    }


    onLockTip() {
        let preCfg = ConfigManager.getItemByField(Hotel_mapCfg, "type", this._cfg.type, { layer: this._cfg.layer - 1 })
        gdk.gui.showMessage(`第${preCfg.layer}层打扫进度达到${Math.floor((preCfg.progress - 1) / preCfg.number * 100)}%时解锁`)
    }
}