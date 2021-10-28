import ActUtil from '../../act/util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureMapCtrl from './NewAdventureMapCtrl';
import NewAdventureModel, { NewAdvPointInfo } from '../model/NewAdventureModel';
import NewAdventurePointCtrl from './NewAdventurePointCtrl';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Adventure2_adventureCfg, Adventure2_themeheroCfg, HeroCfg } from '../../../a/config';
/**
 * @Description: 探险主界面
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-02 15:48:22
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/NewAdventureMainViewCtrl")
export default class NewAdventureMainViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    titleNode: cc.Node = null

    @property(cc.Node)
    difficultNode: cc.Node = null

    @property(cc.ScrollView)
    mapScrollview: cc.ScrollView = null

    @property(NewAdventureMapCtrl)
    mapCtrl: NewAdventureMapCtrl = null

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

    advCfg: Adventure2_adventureCfg
    _recommendIds = []

    actId: number = 107;
    actTypy: number = 1;
    nextUnlockCfg: Adventure2_themeheroCfg;

    inRankShow: boolean = false;

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    onEnable() {
        this.adventureModel.copyType = 1;
        this.initHeroUpData()
        NetManager.on(icmsg.Adventure2StateRsp.MsgType, this._onAdventureStateRsp, this);

        let msg = new icmsg.Adventure2StateReq()
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

    _onAdventureStateRsp(data: icmsg.Adventure2StateRsp) {
        this.adventureModel.endLessState = data.endLess;
        this.adventureModel.endless_blood = data.endLess.blood
        this.adventureModel.endless_layerId = data.endLess.layerId
        this.adventureModel.endless_plateIndex = data.endLess.plateIndex
        this.adventureModel.endless_plateFinish = data.endLess.plateFinish
        this.adventureModel.endless_consumption = data.endLess.consumption
        //this.adventureModel.endless_giveHeros = data.heroes
        this.adventureModel.endless_entryList = data.endLess.entryList
        this.adventureModel.avgPower = data.avgPower
        this.adventureModel.avgLevel = data.avgLevel
        this.adventureModel.endless_fightTimes = data.endLess.clearTimes
        this.adventureModel.endless_lastPlate = data.endLess.lastPlate
        this.adventureModel.endless_historyPlate = data.endLess.historyPlate;
        this.adventureModel.endless_stageId = data.endLess.stageId
        this.adventureModel.endless_line = data.endLess.line;
        this.adventureModel.endless_randomIds = data.endLess.randomIds;

        //let actTypy = ActUtil.getActRewardType(this.actId)
        this.advCfg = ConfigManager.getItemByField(Adventure2_adventureCfg, "difficulty", data.endLess.difficulty, { layer_id: data.endLess.layerId })
        this.titleNode.active = true
        //GlobalUtil.setSpriteIcon(this.node, this.titleNode, `view/adventure/texture/common/qjtx_wenzi0${data.endLess.layerId}`)
        //GlobalUtil.setSpriteIcon(this.node, this.difficultNode, `view/adventure/texture/common/qjtx_wenzi00${data.endLess.difficulty}`)

        this.titleNode.active = false
        this.rankNode.active = true
        this._updateRankNode()

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
        // let platePoints = this.adventureModel.platePoints;
        // let ctrls = this.adventureModel.platePointsCtrl

        let curPlate = this.adventureModel.endless_lastPlate
        if (this.adventureModel.endless_plateFinish) {
            curPlate = this.adventureModel.endless_plateIndex
        }
        let curPointInfo: NewAdvPointInfo//platePoints[curPlate]

        switch (this.adventureModel.endless_line) {
            case 0:
                let plate0Points = this.adventureModel.plate0Points;
                let ctrls0 = this.adventureModel.plate0PointsCtrl;
                for (let key in plate0Points) {
                    let info: NewAdvPointInfo = plate0Points[key]
                    let ctrl: NewAdventurePointCtrl = ctrls0[info.index]
                    if (ctrl) {
                        if (info.index > 90) {
                            ctrl.setPointGoState(true)
                        } else {
                            ctrl.setPointGoState(false)
                        }

                        ctrl.setPointMask(false)
                    }
                    if (info.index == 10) {
                        curPointInfo = info
                    }
                }
                break
            case 1:
                this.startEndStateInit()
                let plate1Points = this.adventureModel.plate1Points;
                let ctrls1 = this.adventureModel.plate1PointsCtrl;
                for (let key in plate1Points) {
                    let info: NewAdvPointInfo = plate1Points[key]
                    let ctrl: NewAdventurePointCtrl = ctrls1[info.index]
                    if (ctrl && info.line == 1) {
                        ctrl.setPointGoState(false)
                        if (info.index > curPlate) {
                            ctrl.setPointMask(true)
                        } else {
                            ctrl.setPointMask(false)
                        }
                    }
                    if (info.index == curPlate) {
                        curPointInfo = info
                    }

                }
                if (curPlate == 0) {
                    curPointInfo = this.adventureModel.endlessStartPoint;
                }
                break
            case 2:
                this.startEndStateInit()
                let plate2Points = this.adventureModel.plate2Points;
                let ctrls2 = this.adventureModel.plate2PointsCtrl;
                for (let key in plate2Points) {
                    let info: NewAdvPointInfo = plate2Points[key]
                    let ctrl: NewAdventurePointCtrl = ctrls2[info.index]
                    if (ctrl && info.line == 2) {
                        ctrl.setPointGoState(false)
                        if (info.index > curPlate) {
                            ctrl.setPointMask(true)
                        } else {
                            ctrl.setPointMask(false)
                        }
                    }
                    if (info.index == curPlate) {
                        curPointInfo = info
                    }
                }
                if (curPlate == 0) {
                    curPointInfo = this.adventureModel.endlessStartPoint;
                }
                break
            case 3:
                this.startEndStateInit()
                let plate3Points = this.adventureModel.plate3Points;
                let ctrls3 = this.adventureModel.plate3PointsCtrl;
                for (let key in plate3Points) {
                    let info: NewAdvPointInfo = plate3Points[key]
                    let ctrl: NewAdventurePointCtrl = ctrls3[info.index]
                    if (ctrl && info.line == 3) {
                        ctrl.setPointGoState(false)
                        if (info.index > curPlate) {
                            ctrl.setPointMask(true)
                        } else {
                            ctrl.setPointMask(false)
                        }
                    }
                    if (info.index == curPlate) {
                        curPointInfo = info
                    }
                }
                if (curPlate == 0) {
                    curPointInfo = this.adventureModel.endlessStartPoint;
                }
                break
        }
        //刷新据点信息

        this._checkRoundPoints(curPointInfo)


    }

    startEndStateInit() {
        let plate0Points = this.adventureModel.plate0Points;
        let ctrls0 = this.adventureModel.plate0PointsCtrl;
        for (let key in plate0Points) {
            let info: NewAdvPointInfo = plate0Points[key]
            let ctrl: NewAdventurePointCtrl = ctrls0[info.index]
            if (ctrl) {
                ctrl.typeIcon.active = false
                ctrl.setPointGoState(false)
                ctrl.setPointMask(false)
                ctrl.setLastLineState(false)
            }
        }
    }


    _checkRoundPoints(info: NewAdvPointInfo) {
        // let round1 = [
        //     cc.v2(info.pos.x - 1, info.pos.y - 1),
        //     cc.v2(info.pos.x + 1, info.pos.y - 1)]
        let points1 = []

        let platePoints = {}//this.adventureModel.platePoints;
        let ctrls = {};//this.adventureModel.platePointsCtrl
        let plateFinish = this.adventureModel.endless_plateFinish
        let isEnd: boolean = true
        switch (this.adventureModel.endless_line) {
            case 0:
                platePoints = {}
                ctrls = {}
                break;
            case 1:
                platePoints = this.adventureModel.plate1Points;
                ctrls = this.adventureModel.plate1PointsCtrl;
                break;
            case 2:
                platePoints = this.adventureModel.plate2Points;
                ctrls = this.adventureModel.plate2PointsCtrl;
                break
            case 3:
                platePoints = this.adventureModel.plate3Points;
                ctrls = this.adventureModel.plate3PointsCtrl;
                break
        }

        if (info.index == 0 && this.adventureModel.endless_line != 0) {
            points1 = [cc.v2(platePoints[1].pos.x, platePoints[1].pos.y)]
        } else if (this.adventureModel.endless_line != 0) {
            points1 = [cc.v2(platePoints[info.index + 1].pos.x, platePoints[info.index + 1].pos.y)]
        }

        let curPointInfo = platePoints[this.adventureModel.endless_plateIndex]
        for (let key in platePoints) {
            let a_info: NewAdvPointInfo = platePoints[key]
            let ctrl: NewAdventurePointCtrl = ctrls[a_info.index]
            if (ctrl) {
                for (let i = 0; i < points1.length; i++) {
                    if (plateFinish && a_info && a_info.pos.x == points1[i].x && a_info.pos.y == points1[i].y) {
                        ctrl.typeIcon.active = true
                        ctrl.setPointMask(false)
                        ctrl.setPointGoState(true)
                        ctrl.setLastLineState(false)
                        isEnd = false
                    }
                }

                if (plateFinish && a_info && a_info.pos.y >= curPointInfo.pos.y) {
                    ctrl.typeIcon.active = false
                    ctrl.setPointMask(false)
                    ctrl.setPointGoState(false)
                    ctrl.setLastLineState(false)
                }

                if (!plateFinish && a_info && a_info.index == this.adventureModel.endless_plateIndex) {
                    ctrl.typeIcon.active = true
                    ctrl.setPointMask(false)
                    ctrl.setPointGoState(true)
                    ctrl.setLastLineState(false)
                }
            }
        }

        //刷新传送门状态
        //let ctrl: NewAdventurePointCtrl = ctrls[99]
        if (this.adventureModel.endless_line == 0) {
            let ctrls = this.adventureModel.plate0PointsCtrl;
            let indexs = [91, 92, 93]
            for (let i = 0; i < 3; i++) {
                let ctrl: NewAdventurePointCtrl = ctrls[indexs[i]]
                ctrl.typeIcon.active = false
                ctrl.setPointMask(false)
                ctrl.setPointGoState(false)
                ctrl.setLastLineState(false)
                // ctrl.gateSpine.node.active = false
                // ctrl.gateSpine.setAnimation(0, "stand2", true)
                ctrl.gateSp.node.active = true
            }
        }

        //指挥官位置
        let generalNode = this.mapCtrl.mapLayer.node.getChildByName("adv_general")
        if (!generalNode) {
            generalNode = cc.instantiate(this.generalPre)
            generalNode.name = "adv_general"
            this.mapCtrl.mapLayer.node.addChild(generalNode)
        }
        let index = this.adventureModel.endless_lastPlate
        let lastPointInfo = platePoints[index]
        if (this.adventureModel.endless_plateFinish) {
            index = this.adventureModel.endless_plateIndex
        }
        let newPointInfo = platePoints[index]

        if (this.adventureModel.endless_line == 0) {
            if (this.adventureModel.endlesslastLine > 0) {
                switch (this.adventureModel.endlesslastLine) {
                    case 1:
                        lastPointInfo = this.adventureModel.plate1Points[9];
                        break;
                    case 2:
                        lastPointInfo = this.adventureModel.plate2Points[9];
                        break;
                    case 3:
                        lastPointInfo = this.adventureModel.plate3Points[9];
                        break;
                }
            }
            newPointInfo = this.adventureModel.endlessEndPoint
        }

        if (this.adventureModel.isMove) {
            this.adventureModel.isMove = false
            generalNode.setPosition(lastPointInfo.mapPoint.x, lastPointInfo.mapPoint.y + 35);//
            generalNode.runAction(cc.moveTo(0.5, cc.v2(newPointInfo.mapPoint.x, newPointInfo.mapPoint.y + 35)))
            this.mapCtrl.node.runAction(cc.moveTo(0.5, cc.v2(this.mapCtrl.node.x, this.mapCtrl.node.y - 117)))
        } else {
            generalNode.setPosition(newPointInfo.mapPoint.x, newPointInfo.mapPoint.y + 35);//
            this.mapCtrl.node.setPosition(-newPointInfo.mapPoint.x, -newPointInfo.mapPoint.y - 100)
        }

        this.mapCtrl.clearHistoryPlate()
    }

    // /**回复泉水 */
    // openResume() {
    //     gdk.panel.open(PanelId.AdventureMainResume)
    // }

    /**遗物列表 */
    openEntry() {
        gdk.panel.open(PanelId.NewAdventureEntryListView)
    }

    /**商店 */
    openStore() {
        // gdk.panel.open(PanelId.AdventureStoreView)
        JumpUtils.openActivityMain(11);
    }

    /* 排行*/
    openRank() {
        gdk.panel.open(PanelId.AdventureRankView2)
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
        gdk.panel.open(PanelId.NewAdventureSetUpHeroSelector);
    }

    showTip() {
        gdk.gui.showMessage(`${gdk.i18n.t("i18n:ADVENTURE_TIP10")}`)
    }

    //设置关卡推荐英雄信息
    initHeroUpData() {
        let actCfg = ActUtil.getCfgByActId(this.actId);
        let themeheroCfg = ConfigManager.getItemByField(Adventure2_themeheroCfg, "type", actCfg.reward_type, { difficulty: 4 })
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

    @gdk.binding("adventureModel.endless_giveHeros")
    refreshHeroState() {
        let heroModel = ModelManager.get(HeroModel)
        let allHeroId = []
        for (let i = 0; i < heroModel.heroInfos.length; i++) {
            let id = heroModel.heroInfos[i].itemId
            if (allHeroId.indexOf(id) == -1) {
                allHeroId.push(id)
            }
        }
        // for (let j = 0; j < this.adventureModel.endless_giveHeros.length; j++) {
        //     let info = this.adventureModel.endless_giveHeros[j]
        //     let hireCfg = ConfigManager.getItemByField(Adventure2_hireCfg, "group", info.group, { hero: info.typeId })
        //     if (allHeroId.indexOf(info.typeId) == -1 && info.useTimes < hireCfg.hire_times) {
        //         allHeroId.push(info.typeId)
        //     }
        // }

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
        let roleModel = ModelManager.get(RoleModel)
        let msg = new icmsg.Adventure2RankListReq()
        NetManager.send(msg, (data: icmsg.Adventure2RankListRsp) => {
            for (let i = 0; i < data.list.length; i++) {
                if (i < 3) {
                    if (data.list[i].brief.id == roleModel.id) {
                        this.inRankShow = true;
                    }
                    this.rankServerLabs[i].string = `[s${GlobalUtil.getSeverIdByPlayerId(data.list[i].brief.id)}]`
                    this.rankNameLabs[i].string = `${data.list[i].brief.name}`
                    this.rankValueLabs[i].string = `${gdk.i18n.t("i18n:ADVENTURE_TIP13")}${data.list[i].layerId}-${data.list[i].plateIndex}`
                }
            }
        })
    }

    _updateTimeNode() {
        let actCfg = ActUtil.getCfgByActId(this.actId);
        if (!actCfg) return;
        // let cfgs = ConfigManager.getItemsByField(Adventure_themeheroCfg, 'type', actCfg.reward_type);
        // let startTime = ActUtil.getActStartTime(this.actId);
        // let curTime = GlobalUtil.getServerTime();
        // let timeLab = this.timeNode.getChildByName('lockLab').getComponent(cc.Label);
        // let lvLab = this.timeNode.getChildByName('levelLab').getComponent(cc.Label);
        let txtLab = this.timeNode.getChildByName('lab').getComponent(cc.Label);
        // for (let i = 0; i < cfgs.length; i++) {
        //     let time = cfgs[i].unlocktime;
        //     let unLockTime = startTime + (time[2] * 24 * 60 * 60 + time[3] * 60 * 60 + time[4] * 60) * 1000;
        //     if (unLockTime > curTime) {
        //         this.nextUnlockCfg = cfgs[i];
        //         timeLab.string = TimerUtils.format1((unLockTime - curTime) / 1000) + `${gdk.i18n.t("i18n:ADVENTURE_TIP1")}`;
        //         lvLab.string = this.nextUnlockCfg.difficulty_name;
        //         return;
        //     }
        // }
        // this.nextUnlockCfg = null;
        // let endTime = ActUtil.getActEndTime(this.actId)
        // timeLab.string = ``
        // lvLab.string = ``
        // timeLab.node.width = 0
        // lvLab.node.width = 0
        // if (endTime - curTime > 0) {
        //     txtLab.string = StringUtils.format(gdk.i18n.t("i18n:ADVENTURE_TIP14"), `${TimerUtils.format1((endTime - curTime) / 1000)}`)//`活动${TimerUtils.format1((endTime - curTime) / 1000)}后结束`
        // } else {
        //     txtLab.string = `${gdk.i18n.t("i18n:ADVENTURE_TIP15")}`
        // }
        txtLab.string = StringUtils.format(gdk.i18n.t('i18n:NEW_ADVENTURE_TIP5'), this.adventureModel.endless_layerId)
    }
}
