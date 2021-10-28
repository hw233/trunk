import ConfigManager from '../../../../common/managers/ConfigManager';
import ErrorManager from '../../../../common/managers/ErrorManager';
import FHPVPHeroItemCtrl from './FHPVPHeroItemCtrl';
import FootHoldModel, { FhPointInfo } from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import HeroModel from '../../../../common/models/HeroModel';
import JumpUtils from '../../../../common/utils/JumpUtils';
import MilitaryRankUtils from '../militaryRank/MilitaryRankUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import PveSceneModel from '../../../pve/model/PveSceneModel';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { FhTeacheGuideType } from './teaching/FootHoldTeachingCtrl';
import {
    Foothold_bonusCfg,
    Foothold_globalCfg,
    Foothold_pointCfg,
    PvpCfg
    } from '../../../../a/config';
import { FootHoldEventId } from '../../enum/FootHoldEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { MRPrivilegeType } from '../militaryRank/MilitaryRankViewCtrl';

/**
 * PVP副本战斗准备界面
 * @Author: yaozu.hu
 * @Date: 2019-09-24 13:43:09
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-28 17:29:04
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHPVPBattleReadyViewCtrl")
export default class FHPVPBattleReadyViewCtrl extends gdk.BasePanel {

    // 战力数字
    @property(cc.Label)
    enemyPower: cc.Label = null;

    @property(cc.Label)
    enemyGHName: cc.Label = null;
    @property(cc.Label)
    enemyName: cc.Label = null;

    @property(cc.Label)
    serverLab: cc.Label = null;

    @property(cc.Label)
    ghServerLab: cc.Label = null;

    @property(cc.Label)
    energyLab: cc.Label = null;

    @property(cc.Sprite)
    enemyGHIcon: cc.Sprite = null;
    @property(cc.Sprite)
    enemyGHFrame: cc.Sprite = null;
    @property(cc.Sprite)
    enemyGHBottom: cc.Sprite = null;

    @property(cc.Node)
    enemyPowerFlag: cc.Node = null;

    // 数组下标0~5对应英雄上场的位置
    @property([cc.Node])
    enemySlots: cc.Node[] = [];

    // 预制体
    @property(cc.Prefab)
    heroIconPre: cc.Prefab = null;

    // @property(cc.Prefab)
    // heroSelectorPre: cc.Prefab = null;

    @property(cc.Node)
    preBtn: cc.Node = null;

    @property(cc.Node)
    pointIcon: cc.Node = null;

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null;

    @property(cc.Label)
    leftLab: cc.Label = null;

    @property(cc.Node)
    btnMark: cc.Node = null

    @property(cc.Node)
    fightBtn: cc.Node = null;

    @property(cc.Label)
    resetTimeLab: cc.Label = null;

    @property(cc.RichText)
    teamLab: cc.RichText = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    detailItem: cc.Prefab = null

    stageId: number = 0;
    pvpcfg: PvpCfg;
    enemyData: any[] = [];

    // readyNode: cc.Node = null;
    // isBattle: boolean = false;

    warId: number;
    pos: icmsg.FootholdPos;
    playerId: number;
    resetTime: number;

    list: ListView = null;
    _guardTeamDatas = []

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    onLoad() {

    }

    onEnable() {
        gdk.e.on(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST, this._updatePointMarkInfo, this)

        let args = gdk.panel.getArgs(PanelId.FHPVPBattleReadyView);
        this.pos = args[0];
        this.warId = args[1];

        this.energyLab.string = `${this.footHoldModel.pointDetailInfo.needEnergy}`
        let fhPointInfo: FhPointInfo = this.footHoldModel.warPoints[`${this.footHoldModel.pointDetailInfo.pos.x}-${this.footHoldModel.pointDetailInfo.pos.y}`]
        this.preBtn.active = fhPointInfo.bonusType != 0

        this._updatePointMarkInfo()

        if (this.footHoldModel.isGuessMode) {
            this.fightBtn.active = false
            this.btnMark.active = false
        }

        let pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_id", this.footHoldModel.curMapData.mapId, { world_level: this.footHoldModel.worldLevelIndex, point_type: fhPointInfo.type, map_type: this.footHoldModel.curMapData.mapType })
        if (fhPointInfo.bonusType == 0) {
            let path = ""
            let bonusCfg = ConfigManager.getItemByField(Foothold_bonusCfg, "map_type", this.footHoldModel.curMapData.mapType, { world_level: this.footHoldModel.worldLevelIndex })
            if (FootHoldUtils.getBuffTowerType(fhPointInfo.pos.x, fhPointInfo.pos.y) == 1) {
                path = `view/guild/texture/icon/${bonusCfg.resources_skin}`
            } else if (FootHoldUtils.getBuffTowerType(fhPointInfo.pos.x, fhPointInfo.pos.y) == 2) {
                path = `view/guild/texture/icon/${bonusCfg.attribute_skin}`
            } else if (FootHoldUtils.getBuffTowerType(fhPointInfo.pos.x, fhPointInfo.pos.y) == 3) {
                path = `view/guild/texture/icon/${bonusCfg.attenuation_skin}`
            }
            GlobalUtil.setSpriteIcon(this.node, this.pointIcon, path)
        } else {
            let path = `view/guild/texture/icon/${pointCfg.resources}`
            GlobalUtil.setSpriteIcon(this.node, this.pointIcon, path)
        }
        let targetLv = MilitaryRankUtils.getMilitaryRankLvByExp(this.footHoldModel.pointDetailInfo.titleExp)
        let maxHp = pointCfg.HP + MilitaryRankUtils.getPrivilegeCommon(MRPrivilegeType.p4, targetLv)
        this.leftLab.string = `${this.footHoldModel.pointDetailInfo.bossHp}/${maxHp}`
        this.proBar.progress = this.footHoldModel.pointDetailInfo.bossHp / maxHp

        //更新守方列表
        let msg = new icmsg.FootholdFightQueryReq();
        msg.warId = args[1];
        msg.pos = args[0];
        NetManager.send(msg, (rmsg: icmsg.FootholdFightQueryRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.enabled) return;
            //this.defender = rmsg.player;
            this.enemyData = rmsg.heroList;
            this.playerId = rmsg.playerId;
            this.resetTime = rmsg.resetTime
            let playerData = FootHoldUtils.findPlayer(rmsg.playerId);
            if (playerData) {
                this.enemyName.string = playerData.name;
                if (FootHoldUtils.isCrossWar) {
                    this.serverLab.node.active = true
                    this.ghServerLab.node.active = true
                    this.serverLab.string = `[s${GlobalUtil.getSeverIdByPlayerId(playerData.id)}]`
                    this.ghServerLab.string = `[s${GlobalUtil.getSeverIdByPlayerId(playerData.id)}]`
                }
            } else {
                this.enemyName.string = '';
            }
            let guildData = FootHoldUtils.findGuild(rmsg.guildId);
            this.enemyGHName.string = guildData ? guildData.name : '';
            GlobalUtil.setSpriteIcon(this.node, this.enemyGHBottom, GuildUtils.getIcon(guildData.bottom))
            GlobalUtil.setSpriteIcon(this.node, this.enemyGHFrame, GuildUtils.getIcon(guildData.frame))
            GlobalUtil.setSpriteIcon(this.node, this.enemyGHIcon, GuildUtils.getIcon(guildData.icon))
            this._updateEnemyIcons();

            if (this.footHoldModel.pointDetailInfo.bossHp < maxHp) {
                this._updateTime()
                this.schedule(this._updateTime, 1)
            }
        }, this);

        //更新驻守队伍
        if (fhPointInfo.fhPoint.status & 4) {
            let gmsg = new icmsg.FootholdGuardTeamReq()
            gmsg.pos = this.footHoldModel.pointDetailInfo.pos
            gmsg.includeOwner = false
            NetManager.send(gmsg, (data: icmsg.FootholdGuardTeamRsp) => {
                if (data.list.length > 0) {
                    this._initGuardList(data)
                }
            }, this)
        }
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.detailItem,
            cb_host: this,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    onDisable() {
        ErrorManager.targetOff(this);
        NetManager.targetOff(this);
        gdk.e.targetOff(this)
    }

    _initGuardList(data) {
        this._guardTeamDatas = data.list
        this.teamLab.node.parent.active = true
        this.scrollView.node.active = true
        this.scrollView.node.height = 145 * data.list.length
        let guard_forces = ConfigManager.getItemById(Foothold_globalCfg, "guard_forces").value[0]
        let str = `驻守部队(<color=#00ff00>${data.list.length}/${guard_forces - 1}</color>)`
        this.teamLab.string = StringUtils.setRichtOutLine(str, "#1B0F0A", 2)

        this._initListView()
        this.list.set_data(data.list)
    }

    _getHeroInfoById(id: number): icmsg.HeroInfo {
        let ret: icmsg.HeroInfo;
        ModelManager.get(HeroModel).heroInfos.some(e => {
            if (e.extInfo instanceof icmsg.HeroInfo) {
                if (e.extInfo.heroId == id) {
                    ret = e.extInfo;
                    return true;
                }
            }
            return false;
        });
        return ret;
    }

    // 更新防守方图标列表
    _updateEnemyIcons() {
        // if (this.pvpcfg == null) {
        //     return;
        // }
        // 更新标题栏
        //this.title = this.pvpcfg.name;
        // 更新防守方头像列表
        this.enemySlots.forEach((node, i) => {
            node.destroyAllChildren();
        });
        let isMonster = false;
        let power = 0;
        this.enemyData.forEach((data, index) => {
            let tem = data as icmsg.FightDefendHero
            if (tem.typeId > 0) {
                this._createIcon(data, this.enemySlots[index], isMonster);
                power += tem.power;
            }
        });
        //显示敌方战力
        this.enemyPower.string = power + '';

    }

    // 创建图标
    _createIcon(data: icmsg.FightDefendHero, parent: cc.Node, isMonster: boolean = false) {
        let node = cc.instantiate(this.heroIconPre);
        node.parent = parent;
        if (data) {
            let item = node.getComponent(FHPVPHeroItemCtrl);
            item['_data'] = {
                hero: data,
                is_monster: isMonster,
            };
            item.updateView();
        }
        return node;
    }

    // 挑战按钮动作
    battle() {
        if (this.footHoldModel.energy < this.footHoldModel.pointDetailInfo.needEnergy) {
            let needEnergy = this.footHoldModel.pointDetailInfo.needEnergy - this.footHoldModel.energy
            gdk.panel.setArgs(PanelId.FHBuyEngergy, needEnergy)
            gdk.panel.open(PanelId.FHBuyEngergy)
            return
        }

        let gmsg = new icmsg.FootholdGuardTeamReq()
        gmsg.pos = this.footHoldModel.pointDetailInfo.pos
        gmsg.includeOwner = false
        NetManager.send(gmsg, (data: icmsg.FootholdGuardTeamRsp) => {
            if (data.list.length != 0 && this._guardTeamDatas.length != 0 && data.list.length > this._guardTeamDatas.length) {
                this._initGuardList(data)
                gdk.gui.showMessage("驻守队伍发生改变,请重新发起挑战")
                return
            }
            this._battleReq()
        }, this)
    }

    _battleReq() {
        FootHoldUtils.commitFhGuide(FhTeacheGuideType.event_3)
        //保存对手的玩家id
        ModelManager.get(PveSceneModel).pvpRivalPlayerId = this.playerId
        if (this._guardTeamDatas.length > 0) {
            this.footHoldModel.gatherFightType = 2
            gdk.panel.open(PanelId.FHGatherReadyFight)
        } else {
            let playerData = FootHoldUtils.findPlayer(this.playerId);
            this.footHoldModel.fightPoint = this.pos;
            let player = new icmsg.ArenaPlayer()
            player.name = playerData.name
            player.head = playerData.head
            player.frame = playerData.headFrame
            player.power = playerData.power
            JumpUtils.openPveArenaScene([this.warId, this.pos, player, this.playerId], playerData ? playerData.name : '', 'FOOTHOLD');
            this.close(-1);
        }

    }

    openPreOutputView() {
        gdk.panel.open(PanelId.FHPVPBattlePreView)
    }

    _updateTime() {
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let endTime = this.resetTime || 0
        let leftTime = endTime - curTime
        if (leftTime <= 0) {
            this.unschedule(this._updateTime)
            this.resetTimeLab.string = ``
        } else {
            this.resetTimeLab.string = StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP73"), TimerUtils.format4(leftTime))
        }
    }

    openMarkFunc() {
        if (!this.footHoldModel.markFlagPoints[`${this.pos.x}-${this.pos.y}`] && !FootHoldUtils.isPlayerCanMark) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP87"))
            return
        }

        let tag = ConfigManager.getItemById(Foothold_globalCfg, "tag").value[0]
        if (FootHoldUtils.getMarkPointsNum() >= tag && !this.footHoldModel.markFlagPoints[`${this.pos.x}-${this.pos.y}`]) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP86"), tag))
            return
        }
        gdk.panel.open(PanelId.FHPointMarkPanel)
    }

    _updatePointMarkInfo() {
        let markLab = this.btnMark.getChildByName("txt").getComponent(cc.Label)
        if (FootHoldUtils.isPlayerCanMark) {
            let tag = ConfigManager.getItemById(Foothold_globalCfg, "tag").value[0]
            markLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP79") + `(${FootHoldUtils.getMarkPointsNum()}/${tag})`//`标记设置`
        } else {
            markLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP80")//`标记查看`
        }
    }

    openFightLog() {
        gdk.panel.open(PanelId.FHPointFightLog)
    }

}
