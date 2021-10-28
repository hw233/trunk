import AdventureMainViewCtrl from './AdventureMainViewCtrl';
import AdventureModel, { AdventurePointType, AdvPointInfo } from '../model/AdventureModel';
import AdventureUtils from '../utils/AdventureUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import TimerUtils from '../../../common/utils/TimerUtils';
import { Adventure_consumptionCfg, AdventureCfg, Copy_stageCfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;
/**
 * @Description: 探险主界面
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-21 11:59:12
 */
@ccclass
@menu("qszc/view/adventure/AdventurePointCtrl")
export default class AdventurePointCtrl extends cc.Component {

    @property(cc.Node)
    typeIcon: cc.Node = null

    @property(cc.Node)
    showIcon: cc.Node = null

    @property(cc.Node)
    maskNode: cc.Node = null

    @property(sp.Skeleton)
    goSpine: sp.Skeleton = null

    @property(sp.Skeleton)
    arrowSpine: sp.Skeleton = null

    @property(sp.Skeleton)
    gateSpine: sp.Skeleton = null

    @property(cc.Label)
    eventLab: cc.Label = null

    @property(cc.Node)
    powerNode: cc.Node = null

    @property(cc.Label)
    powerLab: cc.Label = null

    @property(sp.Skeleton)
    missEffect: sp.Skeleton = null

    _pointInfo: AdvPointInfo
    _advCfg: AdventureCfg
    actId: number = 53;
    get model(): AdventureModel { return ModelManager.get(AdventureModel); }

    onEnable() {

    }

    updatePointInfo(info: AdvPointInfo) {
        this._pointInfo = info
        this._advCfg = ConfigManager.getItemByField(AdventureCfg, "difficulty", this.model.difficulty, { type: AdventureUtils.actRewardType, layer_id: this.model.layerId, plate: this._pointInfo.index })
        this.eventLab.string = ''
        this.powerNode.active = false
        if (this._advCfg) {
            if (this._advCfg.resources) {
                GlobalUtil.setSpriteIcon(this.node, this.typeIcon, `view/adventure/texture/icon/${this._advCfg.resources}`)
            }
            if (this._advCfg.event_show) {
                this.eventLab.string = `${this._advCfg.event_show}`
            } else {
                if (this._advCfg.event_type == 1) {
                    this.eventLab.string = ''
                    this.powerNode.active = true
                    let stageCfg = ConfigManager.getItemById(Copy_stageCfg, this._advCfg.event_id)
                    this.powerLab.string = `${stageCfg.power}`
                }
            }
        }
    }

    //不可操作
    setPointMask(isMask) {
        // this.maskNode.active = isMask
        this.node.opacity = isMask ? 180 : 255
        this.eventLab.node.active = false
        this.showIcon.active = false
        if (isMask) {
            if (this._advCfg && this._advCfg.show) {
                this.showIcon.active = true
                GlobalUtil.setSpriteIcon(this.node, this.showIcon, `view/adventure/texture/icon/${this._advCfg.resources}`)
            }
        }
    }

    //可前进状态显示
    setPointGoState(state) {
        this.goSpine.node.active = state
        this.eventLab.node.active = state
        this.arrowSpine.node.active = state
        this.powerNode.active = state
        if (state) {
            this.goSpine.setAnimation(0, "stand", true)
            this.arrowSpine.setAnimation(0, "stand2", true)
            if (this._advCfg.event_type == 1) {
                this.powerNode.active = true
                this.eventLab.node.active = false
                this.typeIcon.runAction(cc.sequence(cc.moveTo(1, cc.v2(this.typeIcon.x, this.typeIcon.y + 10)), cc.moveTo(1, cc.v2(this.typeIcon.x, this.typeIcon.y - 10))).repeatForever())
            } else {
                this.powerNode.active = false
                this.typeIcon.stopAllActions()
            }
            this.showIcon.active = false
        }
    }

    /**台子消失特效 */
    playerMissEffect(callFunc: Function) {
        this.missEffect.node.active = true
        this.missEffect.setAnimation(0, "stand", false)
        this.missEffect.setCompleteListener(() => {
            this.missEffect.node.active = false
            callFunc.call(this)
        })
    }

    clickFunc() {
        if (!this.typeIcon.active && !this.gateSpine.node.active) {
            return
        }
        if (!this._advCfg) {
            if (this._pointInfo.index == 99) {
                if (AdventureUtils.isLayerPass()) {
                    if (this.model.layerId != 3) {
                        let msg = new icmsg.AdventureNextReq()
                        NetManager.send(msg, () => {
                            //请求地图信息
                            let msg = new icmsg.AdventureStateReq()
                            NetManager.send(msg, () => {
                                let curView = gdk.gui.getCurrentView()
                                let ctrl = curView.getComponent(AdventureMainViewCtrl)
                                ctrl.mapScrollview.stopAutoScroll()
                                ctrl.mapCtrl.node.setPosition(-450, -640)
                            })
                        })
                    } else {
                        if (AdventureUtils.isNextDifficulOpen()) {
                            let msg = new icmsg.AdventureNextReq()
                            NetManager.send(msg, () => {
                                //请求地图信息
                                let msg = new icmsg.AdventureStateReq()
                                NetManager.send(msg, () => {
                                    let curView = gdk.gui.getCurrentView()
                                    let ctrl = curView.getComponent(AdventureMainViewCtrl)
                                    ctrl.mapScrollview.stopAutoScroll()
                                    ctrl.mapCtrl.node.setPosition(-450, -640)
                                })
                            })
                        } else {
                            let info = AdventureUtils.getNextDifficulOpenInfo()
                            let time = info.time
                            if (time > 0) {
                                gdk.gui.showMessage(`${TimerUtils.format1(time / 1000)}${gdk.i18n.t("i18n:ADVENTURE_TIP1")}${info.name}${gdk.i18n.t("i18n:ADVENTURE_TIP4")}`)
                            }
                        }
                    }
                } else {
                    gdk.gui.showMessage(`${gdk.i18n.t("i18n:ADVENTURE_TIP16")}`)
                }
            }
            return
        }
        this.model.selectIndex = this._pointInfo.index
        switch (this._advCfg.event_type) {
            case AdventurePointType.Stage:
                if (this.model.blood <= 0) {
                    GlobalUtil.showMessageAndSound(`${gdk.i18n.t("i18n:ADVENTURE_TIP17")}`)
                    let resumeCfgs = ConfigManager.getItems(Adventure_consumptionCfg)
                    if (this.model.consumption < resumeCfgs.length) {
                        GuideUtil.setGuideId(210012)
                    }
                    return
                }
                gdk.panel.open(PanelId.AdvPlateStagePanel)
                break
            case AdventurePointType.Travel:
                gdk.panel.open(PanelId.AdvPlateTravelPanel)
                break
            case AdventurePointType.Hire:
                gdk.panel.open(PanelId.AdvPlateHirePanel)
                break
            case AdventurePointType.Entry:
                gdk.panel.open(PanelId.AdvPlateEntryPanel)
                break
            case AdventurePointType.Resume:
                gdk.panel.open(PanelId.AdvPlateResumePanel)
                break
            case AdventurePointType.Treasure:
                gdk.panel.open(PanelId.AdvPlateTreasurePanel)
                break
        }
    }
}