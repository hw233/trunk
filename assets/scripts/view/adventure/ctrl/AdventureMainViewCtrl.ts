import ActUtil from '../../act/util/ActUtil';
import AdventureMapCtrl from './AdventureMapCtrl';
import AdventureModel, { AdvPointInfo } from '../model/AdventureModel';
import AdventurePointCtrl from './AdventurePointCtrl';
import AdventureUtils from '../utils/AdventureUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import StringUtils from '../../../common/utils/StringUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import {
    Adventure_hireCfg,
    Adventure_themeheroCfg,
    AdventureCfg,
    HeroCfg
    } from '../../../a/config';
/**
 * @Description: 探险主界面
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-20 18:31:13
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdventureMainViewCtrl")
export default class AdventureMainViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    titleNode: cc.Node = null

    @property(cc.Node)
    difficultNode: cc.Node = null

    @property(cc.ScrollView)
    mapScrollview: cc.ScrollView = null

    @property(AdventureMapCtrl)
    mapCtrl: AdventureMapCtrl = null

    @property(cc.Node)
    heroUpNode: cc.Node = null;
    @property(cc.Prefab)
    heroUpPre: cc.Prefab = null;

    @property(cc.RichText)
    descLab: cc.RichText = null

    @property(cc.Prefab)
    generalPre: cc.Prefab = null;

    @property(cc.Node)
    rankNode: cc.Node = null;

    @property(cc.Label)
    rankServerLabs: cc.Label[] = [];

    @property(cc.Label)
    rankNameLabs: cc.Label[] = [];

    @property(cc.Label)
    rankValueLabs: cc.Label[] = [];

    @property(cc.Node)
    timeNode: cc.Node = null;

    _isLoad = false

    advCfg: AdventureCfg
    _recommendIds = []

    actId: number = 53;
    nextUnlockCfg: Adventure_themeheroCfg;

    get adventureModel(): AdventureModel { return ModelManager.get(AdventureModel); }

    onEnable() {
        this.initHeroUpData()
        NetManager.on(icmsg.AdventureStateRsp.MsgType, this._onAdventureStateRsp, this);

        let msg = new icmsg.AdventureStateReq()
        NetManager.send(msg)
    }

    onDisable() {
        NetManager.targetOff(this)
        this.unschedule(this._updateTimeNode)
    }

    close() {
        super.close()
        this.adventureModel.isFirstEnter = true
    }

    _onAdventureStateRsp(data: icmsg.AdventureStateRsp) {
        this.adventureModel.blood = data.blood
        this.adventureModel.difficulty = data.difficulty
        this.adventureModel.layerId = data.layerId
        this.adventureModel.plateIndex = data.plateIndex
        this.adventureModel.plateFinish = data.plateFinish
        this.adventureModel.consumption = data.consumption
        this.adventureModel.giveHeros = data.giveHeros
        this.adventureModel.entryList = data.entryList
        this.adventureModel.avgPower = data.avgPower
        this.adventureModel.avgLevel = data.avgLevel
        this.adventureModel.fightTimes = data.clearTimes
        this.adventureModel.lastPlate = data.lastPlate
        this.adventureModel.historyPlate = data.historyPlate

        this.advCfg = ConfigManager.getItemByField(AdventureCfg, "difficulty", data.difficulty, { type: AdventureUtils.actRewardType, layer_id: data.layerId })
        this.titleNode.active = true
        GlobalUtil.setSpriteIcon(this.node, this.titleNode, `view/adventure/texture/common/qjtx_wenzi0${data.layerId}`)
        GlobalUtil.setSpriteIcon(this.node, this.difficultNode, `view/adventure/texture/common/qjtx_wenzi00${data.difficulty}`)

        if (this.advCfg.difficulty == 4) {
            this.titleNode.active = false
            this.rankNode.active = true
            this._updateRankNode()
        }

        this.schedule(this._updateTimeNode, 1)
        this._updateTimeNode()

        this._loadMap(this.advCfg.map_id)
    }

    _loadMap(mapId) {
        // 加载并初始化地图
        gdk.rm.loadRes(this.resId, `view/adventure/map/${mapId}`, cc.TiledMapAsset, (tmx: cc.TiledMapAsset) => {
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
        let curPlate = this.adventureModel.plateIndex
        let curPointInfo = platePoints[curPlate]
        //刷新据点信息
        for (let key in platePoints) {
            let info: AdvPointInfo = platePoints[key]
            let ctrl: AdventurePointCtrl = ctrls[info.index]
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
            gdk.panel.open(PanelId.AdventureFinishTip)
        }
    }

    _checkRoundPoints(info: AdvPointInfo) {
        let round1 = [
            cc.v2(info.pos.x - 1, info.pos.y - 1),
            cc.v2(info.pos.x + 1, info.pos.y - 1)]
        let points1 = round1
        let platePoints = this.adventureModel.platePoints;
        let ctrls = this.adventureModel.platePointsCtrl
        let plateFinish = this.adventureModel.plateFinish
        let isEnd: boolean = true
        let curPointInfo = platePoints[this.adventureModel.plateIndex]
        for (let key in platePoints) {
            let a_info: AdvPointInfo = platePoints[key]
            let ctrl: AdventurePointCtrl = ctrls[a_info.index]
            if (this.adventureModel.difficulty == 4) {
                if (a_info.index == 0) {
                    ctrl.typeIcon.active = false
                    ctrl.setPointMask(false)
                    ctrl.setPointGoState(false)
                } else {
                    ctrl.typeIcon.active = true
                    ctrl.setPointMask(false)
                    ctrl.setPointGoState(true)
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

                if (!plateFinish && a_info && a_info.index == this.adventureModel.plateIndex) {
                    ctrl.typeIcon.active = true
                    ctrl.setPointMask(false)
                    ctrl.setPointGoState(true)
                }
            }
        }

        let ctrl: AdventurePointCtrl = ctrls[99]
        if (ctrl) {
            ctrl.typeIcon.active = false
            ctrl.setPointMask(false)
            ctrl.setPointGoState(false)
            ctrl.gateSpine.node.active = true
            if (this.adventureModel.difficulty == 3 && this.adventureModel.layerId == 3) {
                if (AdventureUtils.isLayerPass()) {
                    ctrl.gateSpine.setAnimation(0, "stand2", true)
                } else {
                    ctrl.gateSpine.paused = true
                }
            } else {
                if (AdventureUtils.isLayerPass()) {
                    ctrl.gateSpine.setAnimation(0, "stand", true)
                } else {
                    ctrl.gateSpine.paused = true
                }
            }
        }

        //指挥官位置
        let generalNode = this.mapCtrl.mapLayer.node.getChildByName("adv_general")
        if (!generalNode) {
            generalNode = cc.instantiate(this.generalPre)
            generalNode.name = "adv_general"
            this.mapCtrl.mapLayer.node.addChild(generalNode)
        }
        let index = this.adventureModel.lastPlate
        let lastPointInfo = platePoints[index]
        if (this.adventureModel.plateFinish) {
            index = this.adventureModel.plateIndex
        }
        let newPointInfo = platePoints[index]
        if (this.adventureModel.isMove) {
            this.adventureModel.isMove = false
            generalNode.setPosition(lastPointInfo.mapPoint.x, lastPointInfo.mapPoint.y + 35);//
            generalNode.runAction(cc.moveTo(0.5, cc.v2(newPointInfo.mapPoint.x, newPointInfo.mapPoint.y + 35)))
            if (this.adventureModel.difficulty != 4) {
                this.mapCtrl.node.runAction(cc.moveTo(0.5, cc.v2(this.mapCtrl.node.x, this.mapCtrl.node.y - 117)))
            }
        } else {
            generalNode.setPosition(newPointInfo.mapPoint.x, newPointInfo.mapPoint.y + 35);//
        }

        if (this.adventureModel.difficulty != 4) {
            this.mapCtrl.clearHistoryPlate()
        }
    }

    /**回复泉水 */
    openResume() {
        gdk.panel.open(PanelId.AdventureMainResume)
    }

    /**遗物列表 */
    openEntry() {
        gdk.panel.open(PanelId.AdventureEntryList)
    }

    /**商店 */
    openStore() {
        // gdk.panel.open(PanelId.AdventureStoreView)
        JumpUtils.openActivityMain(11);
    }

    /* 排行*/
    openRank() {
        gdk.panel.open(PanelId.AdventureRankView)
    }

    /* 探险证*/
    openPassPort() {
        JumpUtils.openPanel({
            panelId: PanelId.AdventurePassPortView,
            currId: this.node
        })
        // gdk.panel.open(PanelId.AdventurePassPortView)
    }

    openHeroList() {
        gdk.panel.open(PanelId.AdventureSetUpHeroSelector);
    }

    showTip() {
        gdk.gui.showMessage(`${gdk.i18n.t("i18n:ADVENTURE_TIP10")}`)
    }

    //设置关卡推荐英雄信息
    initHeroUpData() {
        let actCfg = ActUtil.getCfgByActId(this.actId);
        let themeheroCfg = ConfigManager.getItemByField(Adventure_themeheroCfg, "type", actCfg.reward_type, { difficulty: this.adventureModel.difficulty })
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

    @gdk.binding("adventureModel.giveHeros")
    refreshHeroState() {
        let heroModel = ModelManager.get(HeroModel)
        let allHeroId = []
        for (let i = 0; i < heroModel.heroInfos.length; i++) {
            let id = heroModel.heroInfos[i].itemId
            if (allHeroId.indexOf(id) == -1) {
                allHeroId.push(id)
            }
        }
        for (let j = 0; j < this.adventureModel.giveHeros.length; j++) {
            let info = this.adventureModel.giveHeros[j]
            let hireCfg = ConfigManager.getItemByField(Adventure_hireCfg, "group", info.group, { hero: info.typeId })
            if (allHeroId.indexOf(info.typeId) == -1 && info.useTimes < hireCfg.hire_times) {
                allHeroId.push(info.typeId)
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

    _updateRankNode() {
        for (let i = 0; i < this.rankNameLabs.length; i++) {
            this.rankServerLabs[i].string = ``
            this.rankNameLabs[i].string = `${gdk.i18n.t("i18n:ADVENTURE_TIP11")}`
            this.rankValueLabs[i].string = `${gdk.i18n.t("i18n:ADVENTURE_TIP12")}`
        }
        let msg = new icmsg.AdventureRankListReq()
        NetManager.send(msg, (data: icmsg.AdventureRankListRsp) => {
            for (let i = 0; i < data.list.length; i++) {
                if (i < 3) {
                    this.rankServerLabs[i].string = `[s${GlobalUtil.getSeverIdByPlayerId(data.list[i].brief.id)}]`
                    this.rankNameLabs[i].string = `${data.list[i].brief.name}`
                    this.rankValueLabs[i].string = `${gdk.i18n.t("i18n:ADVENTURE_TIP13")}${data.list[i].value}`
                }
            }
        })
    }

    _updateTimeNode() {
        let actCfg = ActUtil.getCfgByActId(this.actId);
        if (!actCfg) return;
        let cfgs = ConfigManager.getItemsByField(Adventure_themeheroCfg, 'type', actCfg.reward_type);
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
