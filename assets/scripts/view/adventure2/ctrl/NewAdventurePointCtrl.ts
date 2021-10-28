import AdventureMainView2Ctrl from './AdventureMainView2Ctrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureMainViewCtrl from './NewAdventureMainViewCtrl';
import NewAdventureModel from '../model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import { Adventure_consumptionCfg, Adventure2_adventureCfg, Copy_stageCfg } from '../../../a/config';
import { AdventurePointType } from '../../adventure/model/AdventureModel';



const { ccclass, property, menu } = cc._decorator;
/**
 * @Description: 探险主界面
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-02 16:28:24
 */
@ccclass
@menu("qszc/view/adventure/NewAdventurePointCtrl")
export default class NewAdventurePointCtrl extends cc.Component {

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
    @property(cc.Sprite)
    gateSp: cc.Sprite = null

    @property(cc.Label)
    eventLab: cc.Label = null

    @property(cc.Node)
    powerNode: cc.Node = null

    @property(cc.Node)
    powerbg: cc.Node = null
    @property(cc.Label)
    powerLab: cc.Label = null

    @property(sp.Skeleton)
    missEffect: sp.Skeleton = null

    @property(cc.Node)
    lineIcon: cc.Node = null;

    _pointInfo: any//NewAdvPointInfo
    _advCfg: Adventure2_adventureCfg
    actId: number = 107;
    get model(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    onEnable() {

    }

    updatePointInfo(info: any) {
        this._pointInfo = info;
        let difficulty = this.model.copyType == 0 ? this.model.difficulty : 4;
        let layerId = this.model.copyType == 0 ? this.model.normal_layerId : this.model.endless_layerId;

        this.gateSp.node.active = false;
        if (info && info.line) {
            this._advCfg = ConfigManager.getItemByField(Adventure2_adventureCfg, "difficulty", difficulty, { layer_id: layerId, plate: this._pointInfo.index, line: this._pointInfo.line })
        } else {
            this._advCfg = ConfigManager.getItemByField(Adventure2_adventureCfg, "difficulty", difficulty, { layer_id: layerId, plate: this._pointInfo.index })
        }

        this.eventLab.string = ''
        this.powerNode.active = false
        if (this._advCfg) {
            if (this._advCfg.resources) {
                GlobalUtil.setSpriteIcon(this.node, this.typeIcon, `view/adventure/texture/icon/${this._advCfg.resources}`)
            }
            if (this._advCfg.event_show) {
                this.eventLab.string = `${this._advCfg.event_show}`
                if (this.model.copyType == 0) {
                    this.powerbg.active = false;
                    this.powerLab.string = ''
                } else {
                    this.powerbg.active = true;
                    this.powerLab.string = this._advCfg.power + ''
                }
            } else {
                if (this._advCfg.event_type == 1) {
                    this.eventLab.string = ''
                    this.powerNode.active = true
                    let stageCfg = ConfigManager.getItemById(Copy_stageCfg, this._advCfg.event_id)
                    this.powerLab.string = ''//`${stageCfg.power}`
                    if (this.model.copyType == 0) {
                        this.powerbg.active = false;
                        this.powerLab.string = ''
                    } else {
                        this.powerbg.active = true;
                        this.powerLab.string = this._advCfg.power + ''
                    }
                }
            }
        }
        //设置传送门
        if (90 < info.index && info.index <= 93) {
            GlobalUtil.setSpriteIcon(this.node, this.gateSp, `view/adventure/texture/icon/qjtx_jianzu0${info.index - 90}`)
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
            if (this._advCfg && this._advCfg.event_type == 1) {
                this.typeIcon.setPosition(cc.v2(0, 27))
                this.powerNode.active = true
                this.eventLab.node.active = false;
                let temY1 = this.typeIcon.y + 10
                let temY2 = this.typeIcon.y - 10
                this.typeIcon.stopAllActions()
                this.typeIcon.runAction(cc.sequence(cc.moveTo(1, cc.v2(this.typeIcon.x, temY1)), cc.moveTo(1, cc.v2(this.typeIcon.x, temY2))).repeatForever())
            } else {
                this.powerNode.active = false
                this.typeIcon.stopAllActions()
            }
            this.showIcon.active = false
        }
    }


    setLastLineState(isShow) {
        this.node.opacity = isShow ? 160 : 255;
        this.lineIcon.active = isShow;
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


    /**台子显示特效 */
    playerShowEffect(callFunc: Function) {
        this.node.opacity = 255;
        this.missEffect.node.active = true
        this.missEffect.setAnimation(0, "stand", false)
        this.missEffect.setCompleteListener(() => {
            this.missEffect.node.active = false
            callFunc.call(this)
        })
    }


    clickFunc() {
        if (!this.typeIcon.active && !this.gateSp.node.active) {
            return
        }
        if (!this._advCfg) {
            if (this._pointInfo.index > 90) {
                let msg = new icmsg.Adventure2LineReq()
                msg.difficulty = 4;
                msg.line = this._pointInfo.index - 90
                NetManager.send(msg, (rsp: icmsg.Adventure2LineRsp) => {
                    //请求地图信息
                    this.model.endless_line = rsp.line
                    this.model.endlesslastLine = rsp.line;
                    let curView = gdk.gui.getCurrentView()
                    let ctrl = curView.getComponent(NewAdventureMainViewCtrl)

                    //播放其他线路消失效果
                    ctrl.mapCtrl.clearLineEffect()

                    // let msg = new icmsg.AdventureStateReq()
                    // NetManager.send(msg, () => {
                    //     // let curView = gdk.gui.getCurrentView()
                    //     // let ctrl = curView.getComponent(NewAdventureMainViewCtrl)
                    //     // ctrl.mapScrollview.stopAutoScroll()
                    //     // ctrl.mapCtrl.node.setPosition(-450, -640)
                    // })
                })
            }

            return
        }

        let curView = gdk.gui.getCurrentView()
        if (this.model.copyType == 0) {
            this.model.normal_selectIndex = this._pointInfo.index;
            if (this.model.normal_allPlates.indexOf(this._pointInfo.index) >= 0) {
                if (this._advCfg.event_type != AdventurePointType.Stage && this._advCfg.event_type != AdventurePointType.Entry) {

                    GlobalUtil.openAskPanel({
                        title: gdk.i18n.t("i18n:TIP_TITLE"),
                        descText: gdk.i18n.t("i18n:NEW_ADVENTURE_TIP7"),
                        sureText: gdk.i18n.t("i18n:OK"),
                        sureCb: () => {
                            //JumpUtils.openActivityMain(10);
                            let msg = new icmsg.Adventure2SkipReq()
                            msg.difficulty = this.model.difficulty;
                            msg.plateIndex = this._pointInfo.index
                            NetManager.send(msg, (rsp: icmsg.Adventure2SkipRsp) => {

                                this.model.isMove = true
                                this.model.normal_plateFinish = true;
                                this.model.normal_plateIndex = rsp.plateIndex;
                                let curView = gdk.gui.getCurrentView()
                                let ctrl = curView.getComponent(AdventureMainView2Ctrl)

                                ctrl.refreshPoints()
                            })
                        }
                    });

                    return;
                }

            }
        } else {
            this.model.endless_selectIndex = this._pointInfo.index;
            curView = gdk.gui.getCurrentView()
            let ctrl = curView.getComponent(NewAdventureMainViewCtrl)
            GlobalUtil.setLocal(
                'adventure_fight_pos#4' + "#" + this.model.endless_layerId, {
                x: ctrl.mapCtrl.node.x,
                y: ctrl.mapCtrl.node.y,
            });
        }
        let blood = this.model.copyType == 0 ? this.model.normal_blood : 1;
        switch (this._advCfg.event_type) {
            case AdventurePointType.Stage:
                if (blood <= 0) {
                    GlobalUtil.showMessageAndSound(`${gdk.i18n.t("i18n:ADVENTURE_TIP17")}`)
                    let resumeCfgs = ConfigManager.getItems(Adventure_consumptionCfg)
                    if (this.model.normal_consumption < resumeCfgs.length) {
                        GuideUtil.setGuideId(210012)
                    }
                    return
                }
                gdk.panel.open(PanelId.AdvPlateStagePanel2)
                break
            case AdventurePointType.Travel:
                gdk.panel.open(PanelId.AdvPlateTravelPanel2)
                break
            case AdventurePointType.Hire:
                gdk.panel.open(PanelId.AdvPlateHirePanel2)
                break
            case AdventurePointType.Entry:
                gdk.panel.open(PanelId.AdvPlateEntryPanel2)
                break
            case AdventurePointType.Resume:
                //随机事件
                //gdk.panel.open(PanelId.AdvPlateResumePanel)
                gdk.panel.open(PanelId.AdvPlateRandomEventPanel2)
                break
            case AdventurePointType.Treasure:
                gdk.panel.open(PanelId.AdvPlateTreasurePanel2)
                break
            case AdventurePointType.Save:
                //存档
                gdk.panel.open(PanelId.AdvPlateSavePanel2)
                break
        }
    }
}