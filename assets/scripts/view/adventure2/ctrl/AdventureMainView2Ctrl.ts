import ActUtil from '../../act/util/ActUtil';
import AdventureMap2Ctrl from './AdventureMap2Ctrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureModel from '../model/NewAdventureModel';
import NewAdventurePointCtrl from './NewAdventurePointCtrl';
import PanelId from '../../../configs/ids/PanelId';
import StringUtils from '../../../common/utils/StringUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import {
    Adventure_themeheroCfg,
    Adventure2_adventureCfg,
    Adventure2_hireCfg,
    Adventure2_themeheroCfg,
    HeroCfg,
    Store_pushCfg
    } from '../../../a/config';
import { AdvPointInfo } from '../../adventure/model/AdventureModel';

/**
 * @Description: 探险主界面
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-02 14:45:06
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdventureMainView2Ctrl")
export default class AdventureMainView2Ctrl extends gdk.BasePanel {

    @property(cc.Node)
    titleNode: cc.Node = null

    @property(cc.Node)
    difficultNode: cc.Node = null

    @property(cc.ScrollView)
    mapScrollview: cc.ScrollView = null

    @property(AdventureMap2Ctrl)
    mapCtrl: AdventureMap2Ctrl = null

    @property(cc.Node)
    heroUpNode: cc.Node = null;
    @property(cc.Prefab)
    heroUpPre: cc.Prefab = null;

    @property(cc.RichText)
    descLab: cc.RichText = null

    @property(cc.Prefab)
    generalPre: cc.Prefab = null;

    // @property(cc.Node)
    // rankNode: cc.Node = null;

    // @property(cc.Label)
    // rankServerLabs: cc.Label[] = [];

    // @property(cc.Label)
    // rankNameLabs: cc.Label[] = [];

    // @property(cc.Label)
    // rankValueLabs: cc.Label[] = [];

    @property(cc.Node)
    timeNode: cc.Node = null;

    @property(cc.Node)
    lastLineBtn: cc.Node = null;
    @property(cc.Node)
    lastLineBtnOff: cc.Node = null;
    @property(cc.Node)
    lastLineBtnOn: cc.Node = null;

    @property(cc.Node)
    lastEntryBtn: cc.Node = null;

    _isLoad = false

    advCfg: Adventure2_adventureCfg
    _recommendIds = []

    actId: number = 107;
    actType: number = 1;
    nextUnlockCfg: Adventure_themeheroCfg;

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    onEnable() {
        this.initHeroUpData()
        NetManager.on(icmsg.Adventure2StateRsp.MsgType, this._onAdventureStateRsp, this);

        let msg = new icmsg.Adventure2StateReq()
        NetManager.send(msg)
    }

    onDisable() {
        NetManager.targetOff(this)
        this.unschedule(this._updateTimeNode)

        //检测是否需要弹出礼包界面
        let curTime = GlobalUtil.getServerTime() / 1000
        if (this.adventureModel.GiftTime.length > 0) {
            let have = false;
            for (let i = 0, n = this.adventureModel.GiftTime.length; i < n; i++) {
                let startTime = this.adventureModel.GiftTime[i].startTime
                if (startTime > 0) {
                    let temCfg2 = ConfigManager.getItemByField(Store_pushCfg, "gift_id", this.adventureModel.GiftTime[i].giftId);
                    if (startTime + temCfg2.duration > curTime) {
                        have = true;
                        break
                    }
                }
            }
            if (have && this.adventureModel.firstShowPushView) {
                this.adventureModel.needShowPushView = true;
            }
        }
    }

    close() {
        super.close()
        this.adventureModel.isFirstEnter = true;
    }

    _onAdventureStateRsp(data: icmsg.Adventure2StateRsp) {
        this.adventureModel.normalState = data.normal;
        this.adventureModel.normal_blood = data.normal.blood
        this.adventureModel.difficulty = data.normal.difficulty
        this.adventureModel.normal_layerId = data.normal.layerId
        this.adventureModel.normal_plateIndex = data.normal.plateIndex
        this.adventureModel.normal_plateFinish = data.normal.plateFinish
        this.adventureModel.normal_consumption = data.normal.consumption
        this.adventureModel.normal_giveHeros = data.heroes
        this.adventureModel.normal_entryList = data.normal.entryList
        this.adventureModel.avgPower = data.avgPower
        this.adventureModel.avgLevel = data.avgLevel
        this.adventureModel.fightTimes = data.normal.clearTimes
        this.adventureModel.normal_lastPlate = data.normal.lastPlate
        this.adventureModel.normal_historyPlate = data.normal.historyPlate;
        this.adventureModel.normal_stageId = data.normal.stageId
        this.adventureModel.normal_randomIds = data.normal.randomIds;
        this.adventureModel.upHerosId = data.heroOn;
        this.adventureModel.normal_lastEntryList = data.normal.lastEntryList;
        this.adventureModel.normal_lastPlates = data.normal.lastPlates;
        this.adventureModel.normal_allPlates = data.normal.allPlates;


        //测试数据
        // this.adventureModel.normal_lastPlates = [0, 2, 5];
        // this.adventureModel.showLastPlateIndex = 5;
        // this.adventureModel.showEffect = true;

        this.advCfg = ConfigManager.getItemByField(Adventure2_adventureCfg, "difficulty", data.normal.difficulty, { layer_id: data.normal.layerId })
        this.titleNode.active = true
        //GlobalUtil.setSpriteIcon(this.node, this.titleNode, `view/adventure/texture/common/qjtx_wenzi0${data.normal.layerId}`)
        GlobalUtil.setSpriteIcon(this.node, this.difficultNode, `view/adventure/texture/common/qjtx_wenzi00${data.normal.difficulty}`)




        this.schedule(this._updateTimeNode, 1)
        this._updateTimeNode()

        this._loadMap(this.advCfg.map_id)
    }

    _loadMap(mapId) {
        // 加载并初始化地图
        gdk.rm.loadRes(this.resId, `tileMap/adventure/${mapId}`, cc.TiledMapAsset, (tmx: cc.TiledMapAsset) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.mapCtrl.initMap(this, tmx);
        });
    }

    /**刷新据点信息 */
    refreshPoints() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabled) return;
        let platePoints = this.adventureModel.platePoints;
        let ctrls = this.adventureModel.platePointsCtrl
        let curPlate = this.adventureModel.normal_plateIndex
        let curPointInfo = platePoints[curPlate]

        //刷新探险回忆显示
        this.lastLineBtn.active = this.adventureModel.normal_lastPlates.length > 0;
        this.lastLineBtnOff.active = !this.adventureModel.showLastLine;
        this.lastLineBtnOn.active = this.adventureModel.showLastLine;
        this.lastEntryBtn.active = this.adventureModel.showLastLine;

        //刷新据点信息
        for (let key in platePoints) {
            let info: AdvPointInfo = platePoints[key]
            let ctrl: NewAdventurePointCtrl = ctrls[info.index]
            if (info.index == curPlate) {
                ctrl.setPointMask(false)
            } else {
                if (info.pos.y < curPointInfo.pos.y) {
                    ctrl.setPointMask(true)
                }
                ctrl.typeIcon.active = false
            }
            ctrl.setPointGoState(false)
        }
        this._checkRoundPoints(platePoints[curPlate])

        //打开恭喜通关
        if (this.adventureModel.isShowFinishTip) {
            gdk.panel.open(PanelId.AdventureFinishTip2)
        }
    }

    _checkRoundPoints(info: AdvPointInfo) {
        let round1 = [
            cc.v2(info.pos.x - 1, info.pos.y - 1),
            cc.v2(info.pos.x + 1, info.pos.y - 1)]
        let points1 = round1
        let platePoints = this.adventureModel.platePoints;
        let ctrls = this.adventureModel.platePointsCtrl
        let plateFinish = this.adventureModel.normal_plateFinish
        let isEnd: boolean = true
        let curPointInfo = platePoints[this.adventureModel.normal_plateIndex]
        for (let key in platePoints) {
            let a_info: AdvPointInfo = platePoints[key]
            let ctrl: NewAdventurePointCtrl = ctrls[a_info.index]
            if (this.adventureModel.difficulty == 4) {
                if (a_info.index == 0) {
                    ctrl.typeIcon.active = false
                    ctrl.setPointMask(false)
                    ctrl.setPointGoState(false)
                    ctrl.setLastLineState(false);
                } else {
                    ctrl.typeIcon.active = true
                    ctrl.setPointMask(false)
                    ctrl.setPointGoState(true)
                    ctrl.setLastLineState(false);
                }
            } else {
                for (let i = 0; i < points1.length; i++) {
                    if (plateFinish && a_info && a_info.pos.x == points1[i].x && a_info.pos.y == points1[i].y) {
                        ctrl.typeIcon.active = true
                        ctrl.setPointMask(false)
                        ctrl.setPointGoState(true)
                        isEnd = false
                    }
                }

                if (plateFinish && a_info && a_info.pos.y >= curPointInfo.pos.y) {
                    ctrl.typeIcon.active = false
                    ctrl.setPointMask(false)
                    ctrl.setPointGoState(false)
                }

                if (!plateFinish && a_info && a_info.index == this.adventureModel.normal_plateIndex) {
                    ctrl.typeIcon.active = true
                    ctrl.setPointMask(false)
                    ctrl.setPointGoState(true)
                }

                //判断是否需要显示上次的路线
                if (this.adventureModel.showLastLine && a_info && this.adventureModel.normal_lastPlates.indexOf(a_info.index) >= 0) {
                    ctrl.typeIcon.active = true
                    // ctrl.setPointMask(false)
                    // ctrl.setPointGoState(false)
                    ctrl.setLastLineState(true);
                } else {
                    ctrl.setLastLineState(false);
                }

            }
        }

        // let ctrl: AdventurePointCtrl = ctrls[99]
        // if (ctrl) {
        //     ctrl.typeIcon.active = false
        //     ctrl.setPointMask(false)
        //     ctrl.setPointGoState(false)
        //     ctrl.gateSpine.node.active = true
        //     if (this.adventureModel.difficulty == 3 && this.adventureModel.normal_layerId == 3) {
        //         if (AdventureUtils.isLayerPass()) {
        //             ctrl.gateSpine.setAnimation(0, "stand2", true)
        //         } else {
        //             ctrl.gateSpine.paused = true
        //         }
        //     } else {
        //         if (AdventureUtils.isLayerPass()) {
        //             ctrl.gateSpine.setAnimation(0, "stand", true)
        //         } else {
        //             ctrl.gateSpine.paused = true
        //         }
        //     }
        // }

        //指挥官位置
        let generalNode = this.mapCtrl.mapLayer.node.getChildByName("adv_general")
        if (!generalNode) {
            generalNode = cc.instantiate(this.generalPre)
            generalNode.name = "adv_general"
            this.mapCtrl.mapLayer.node.addChild(generalNode)
        }
        let index = this.adventureModel.normal_lastPlate
        let lastPointInfo = platePoints[index]
        if (this.adventureModel.normal_plateFinish) {
            index = this.adventureModel.normal_plateIndex
        }
        let newPointInfo = platePoints[index]

        let lastPos = platePoints[this.adventureModel.showLastPlateIndex].tilePos;


        let timeNum = this.adventureModel.showEffect ? (newPointInfo.tilePos.y - lastPos.y) * 0.4 : 0.5;
        if (this.adventureModel.isMove) {
            this.adventureModel.isMove = false
            generalNode.setPosition(lastPointInfo.mapPoint.x, lastPointInfo.mapPoint.y + 35);//
            generalNode.runAction(cc.moveTo(timeNum, cc.v2(newPointInfo.mapPoint.x, newPointInfo.mapPoint.y + 35)))
            if (this.adventureModel.difficulty != 4) {
                this.mapCtrl.node.runAction(cc.moveTo(timeNum, cc.v2(this.mapCtrl.node.x, this.mapCtrl.node.y - 117)))
            }
        } else {

            if (this.adventureModel.showEffect) {
                generalNode.runAction(cc.moveTo(timeNum, cc.v2(newPointInfo.mapPoint.x, newPointInfo.mapPoint.y + 35)))
                this.mapCtrl.node.runAction(cc.moveTo(timeNum, cc.v2(-newPointInfo.mapPoint.x, -newPointInfo.mapPoint.y - 100)))
            } else {
                generalNode.setPosition(newPointInfo.mapPoint.x, newPointInfo.mapPoint.y + 35);//
                this.mapCtrl.node.setPosition(-newPointInfo.mapPoint.x, -newPointInfo.mapPoint.y - 100)
            }
        }

        if (this.adventureModel.difficulty != 4) {
            this.mapCtrl.clearHistoryPlate()
        }
    }

    onLastLineBtnClick() {
        this.adventureModel.showLastLine = !this.adventureModel.showLastLine;
        this.lastLineBtnOff.active = !this.adventureModel.showLastLine;
        this.lastLineBtnOn.active = this.adventureModel.showLastLine;
        this.lastEntryBtn.active = this.adventureModel.showLastLine
        this.refreshPoints();
    }

    onLasrEntryBtnClick() {
        gdk.panel.setArgs(PanelId.AdventureEntryList2, 2);
        gdk.panel.open(PanelId.AdventureEntryList2)
    }


    /**回复泉水 */
    openResume() {
        gdk.panel.open(PanelId.AdventureMainResume2)
    }

    /**遗物列表 */
    openEntry() {
        gdk.panel.open(PanelId.AdventureEntryList2)
    }

    /**商店 */
    openStore() {
        // gdk.panel.open(PanelId.AdventureStoreView)
        JumpUtils.openActivityMain(11);
    }

    /* 探险证*/
    openPassPort() {
        JumpUtils.openPanel({
            panelId: PanelId.AdventurePassPortView2,
            currId: this.node
        })
        // gdk.panel.open(PanelId.AdventurePassPortView)
    }

    openHeroList() {
        gdk.panel.open(PanelId.AdventureSetUpHeroSelector2);
    }

    showTip() {
        gdk.gui.showMessage(`${gdk.i18n.t("i18n:ADVENTURE_TIP10")}`)
    }

    //设置关卡推荐英雄信息
    initHeroUpData() {
        let actCfg = ActUtil.getCfgByActId(this.actId);
        this.actType = ActUtil.getActRewardType(this.actId)
        let themeheroCfg = ConfigManager.getItemByField(Adventure2_themeheroCfg, "type", this.actType, { difficulty: this.adventureModel.difficulty })
        this.descLab.string = `${themeheroCfg.theme_desc}`
        let strs = themeheroCfg.theme_hero.split('|');
        for (let i = 0; i < strs.length; i++) {
            let heroId = Number(strs[i].split(';')[0]);
            this._recommendIds.push(heroId)
            let node = cc.instantiate(this.heroUpPre);
            node.setParent(this.heroUpNode);
            let solt = node.getChildByName('UiSlotItem').getComponent(UiSlotItem);
            let group = node.getChildByName('group');
            let cfg: HeroCfg = ConfigManager.getItemById(HeroCfg, heroId);
            let icon: string = `icon/hero/${cfg.icon}_s`;
            solt.updateItemIcon(icon);
            solt.updateQuality(cfg.defaultColor);
            let path = `common/texture/role/select/group_${cfg.group[0]}`
            GlobalUtil.setSpriteIcon(this.node, group, path);
        }
    }

    @gdk.binding("adventureModel.normal_giveHeros")
    refreshHeroState() {
        let heroModel = ModelManager.get(HeroModel)
        let allHeroId = []
        // for (let i = 0; i < heroModel.heroInfos.length; i++) {
        //     let id = heroModel.heroInfos[i].itemId
        //     if (allHeroId.indexOf(id) == -1) {
        //         allHeroId.push(id)
        //     }
        // }
        for (let j = 0; j < this.adventureModel.normal_giveHeros.length; j++) {
            let info = this.adventureModel.normal_giveHeros[j]
            if (info.type == 0) {
                if (allHeroId.indexOf(info.typeId) == -1) {
                    allHeroId.push(info.typeId)
                }
            } else {
                let hireCfg = ConfigManager.getItemByField(Adventure2_hireCfg, "group", info.group, { hero: info.typeId })
                if (allHeroId.indexOf(info.typeId) == -1 && info.useTimes < hireCfg.hire_times) {
                    allHeroId.push(info.typeId)
                }
            }
        }

        let isHave = false
        for (let i = 0; i < this._recommendIds.length; i++) {
            if (allHeroId.indexOf(this._recommendIds[i]) == -1) {
                GlobalUtil.setAllNodeGray(this.heroUpNode.children[i], 1);
            } else {
                GlobalUtil.setAllNodeGray(this.heroUpNode.children[i], 0);
                isHave = true
            }
        }
    }

    _updateTimeNode() {
        let actCfg = ActUtil.getCfgByActId(this.actId);
        if (!actCfg) return;
        let cfgs = ConfigManager.getItemsByField(Adventure2_themeheroCfg, 'type', actCfg.reward_type);
        let startTime = ActUtil.getActStartTime(this.actId);
        let curTime = GlobalUtil.getServerTime();
        let timeLab = this.timeNode.getChildByName('lockLab').getComponent(cc.Label);
        let lvLab = this.timeNode.getChildByName('levelLab').getComponent(cc.Label);
        let txtLab = this.timeNode.getChildByName('lab').getComponent(cc.Label);
        for (let i = 0; i < cfgs.length; i++) {
            let time = cfgs[i].unlocktime;
            let unLockTime = startTime + (time[2] * 24 * 60 * 60 + time[3] * 60 * 60 + time[4] * 60) * 1000;
            if (unLockTime > curTime) {
                this.nextUnlockCfg = cfgs[i];
                timeLab.string = TimerUtils.format1((unLockTime - curTime) / 1000) + `${gdk.i18n.t("i18n:ADVENTURE_TIP1")}`;
                lvLab.string = this.nextUnlockCfg.difficulty_name;
                return;
            }
        }
        this.nextUnlockCfg = null;
        let endTime = ActUtil.getActEndTime(this.actId)
        timeLab.string = ``
        lvLab.string = ``
        timeLab.node.width = 0
        lvLab.node.width = 0
        if (endTime - curTime > 0) {
            txtLab.string = StringUtils.format(gdk.i18n.t("i18n:ADVENTURE_TIP14"), `${TimerUtils.format1((endTime - curTime) / 1000)}`)//`活动${TimerUtils.format1((endTime - curTime) / 1000)}后结束`
        } else {
            txtLab.string = `${gdk.i18n.t("i18n:ADVENTURE_TIP15")}`
        }
    }
}
