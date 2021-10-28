import ConfigManager from '../../../../common/managers/ConfigManager';
import FHProduceItem2Ctrl from './FHProduceItem2Ctrl';
import FightingMath from '../../../../common/utils/FightingMath';
import FootHoldModel, { FhMapType, FhPointInfo } from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalFootHoldViewCtrl from './GlobalFootHoldViewCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import GuildUtils from '../../utils/GuildUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import MilitaryRankUtils from '../militaryRank/MilitaryRankUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { AskInfoType } from '../../../../common/widgets/AskPanel';
import {
    Copy_stageCfg,
    Foothold_baseCfg,
    Foothold_bonusCfg,
    Foothold_globalCfg,
    Foothold_pointCfg,
    MonsterCfg,
    Pve_bornCfg,
    Pve_mainCfg,
    TipsCfg
    } from '../../../../a/config';
import { FootHoldEventId } from '../../enum/FootHoldEventId';
import { MRPrivilegeType } from '../militaryRank/MilitaryRankViewCtrl';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FootHoldPointCtrl")
export default class FootHoldPointCtrl extends cc.Component {

    @property(cc.Node)
    pointIcon: cc.Node = null;

    @property(cc.Node)
    typeIcon: cc.Node = null;

    @property(cc.Node)
    fight: cc.Node = null;

    @property(cc.Node)
    occupyNode: cc.Node = null;

    @property(cc.Node)
    occupyColorNodes: cc.Node[] = [];

    @property(cc.Node)
    colorNode: cc.Node = null;

    @property(cc.Node)
    occupyName: cc.Node = null;

    @property(cc.Node)
    fog: cc.Node = null;

    @property(cc.Node)
    guildNode: cc.Node = null;

    @property(cc.Node)
    hpNode: cc.Node = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    @property(cc.Node)
    cityNode: cc.Node = null;

    @property(cc.Node)
    rewardNode: cc.Node = null;

    @property(cc.Prefab)
    produceItem: cc.Prefab = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    markFlag: cc.Node = null;

    @property(cc.Node)
    markFlagTip: cc.Node = null;

    @property(cc.Node)
    gatherNode: cc.Node = null;

    @property(cc.Node)
    gatherState: cc.Node = null;

    @property(cc.Node)
    guardState: cc.Node = null;

    @property(cc.Node)
    gatherArrow: cc.Node = null;

    @property(cc.Node)
    timeBarNode: cc.Node = null;

    _pointInfo: FhPointInfo
    _pointCfg: Foothold_pointCfg
    _stageCfg: Copy_stageCfg

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        NetManager.on(icmsg.SystemErrorRsp.MsgType, () => {
            //返回错误码去除操作限制
            JumpUtils.hideGuideMask()
        }, this);
    }

    onDisable() {
        gdk.e.targetOff(this)
        NetManager.targetOff(this)
        gdk.Timer.clearAll(this)
    }

    /**
     * 据点类型
     * type 出生点0 据点1-5，阻挡9 传送门10
     * @param info 
     */
    updatePointInfo(info: FhPointInfo) {
        this._pointInfo = info
        //先设置起点 传送门
        let path = `view/guild/texture/icon/gh_judian0${info.type}`
        if (info.type == 0 || info.type == 10) {
            GlobalUtil.setSpriteIcon(this.node, this.pointIcon, path)
        }
        this.guildNode.active = false
        if (info.type == 0 || info.type == 10) {
            this.setPointInit()
            if (info.type == 0 && this.footHoldModel.curMapData.mapType == FhMapType.Base) {
                this.guildNode.active = false
                return
            }
            this.pointIcon.y = 0
            if (info.type == 10) {
                this.pointIcon.active = true
                this.pointIcon.y = 35
            } else {
                this.pointIcon.active = false
            }
            this.guildNode.active = true
            let bg = this.guildNode.getChildByName("bg")
            let bottom = this.guildNode.getChildByName("bottom")
            let frame = this.guildNode.getChildByName("frame")
            let icon = this.guildNode.getChildByName("icon")
            let guildName = this.guildNode.getChildByName("layout").getChildByName("nameLab").getComponent(cc.Label)
            let serverLab = this.guildNode.getChildByName("serverLab")
            let guild = FootHoldUtils.findGuildByPos(this._pointInfo.pos.x, this._pointInfo.pos.y)
            if (guild) {
                GlobalUtil.setSpriteIcon(this.node, bottom, GuildUtils.getIcon(guild.bottom))
                GlobalUtil.setSpriteIcon(this.node, frame, GuildUtils.getIcon(guild.frame))
                GlobalUtil.setSpriteIcon(this.node, icon, GuildUtils.getIcon(guild.icon))
                guildName.string = `${guild.name}`
                let colorId = FootHoldUtils.getFHGuildColor(guild.id)
                let baseLvCfg = ConfigManager.getItemById(Foothold_baseCfg, guild.level);
                GlobalUtil.setSpriteIcon(this.node, bg, `view/guild/texture/icon/${baseLvCfg['skin' + `${colorId == 1 ? '' : `${colorId - 1}`}`]}`)
                serverLab.active = false
                if (FootHoldUtils.isCrossWar) {
                    serverLab.active = true
                    serverLab.getComponent(cc.Label).string = `[s${GlobalUtil.getSeverIdByGuildId(guild.id)}]`
                    serverLab.getComponent(cc.Label).string += ModelManager.get(ServerModel).serverNameMap[Math.floor(guild.id / 10000)]

                }
            }
        } else {
            if (info.fhPoint && info.fhPoint.playerId > 0) {
                this.setPointOccupy()
            } else {
                if (info.fhPoint && (info.fhPoint.status & 1)) {
                    this.setPointFigth()
                } else {
                    this.setPointFog()
                }
            }
        }
    }

    /**设置据点信息 */
    setPointInit() {
        if (this._pointInfo.type != 9) {
            this.pointIcon.active = true
        } else {
            this.pointIcon.active = false
        }
        this.occupyNode.active = false
        this.fight.active = false
        this.fog.active = false
        this.colorNode.active = false
        this.markFlagTip.active = false

        if (this._pointInfo.type == 0 && this.footHoldModel.curMapData.mapType != FhMapType.Base) {
            this.pointIcon.active = false
        }
        this.node.visible = true
    }

    /**设置据点战斗 */
    setPointFigth() {
        this.pointIcon.active = true
        this.occupyNode.active = false
        this.fight.active = true
        this.fog.active = false
        this.colorNode.active = false
        this.node.visible = true
    }

    /**据点占据 */
    setPointOccupy() {
        this.rewardNode.active = false
        this.pointIcon.active = false
        this.occupyNode.active = true
        this.colorNode.active = false
        this.fight.active = false
        this.fog.active = false
        this.typeIcon.active = false
        if (this.footHoldModel.curMapData.mapType != FhMapType.Base) {
            this.pointIcon.active = true
        }
        this.node.visible = true
    }

    /**占领者名字*/
    setOccupyName() {
        this.redPoint.active = false
        this.occupyName.active = false
        this.rewardNode.active = false
        this.colorNode.active = false
        this.markFlagTip.active = false
        this.gatherNode.active = false
        this.guardState.active = false
        this.gatherState.active = false
        this.gatherArrow.active = false
        this.timeBarNode.active = false
        if (this._pointInfo.fhPoint && this._pointInfo.fhPoint.playerId > 0) {
            this.occupyName.active = true
            let nameLab = this.occupyName.getChildByName("bg").getChildByName("nameLab").getComponent(cc.Label)
            let selfIcon = this.occupyName.getChildByName("selfIcon")
            selfIcon.active = false
            let player = FootHoldUtils.findPlayer(this._pointInfo.fhPoint.playerId)
            if (player) {
                nameLab.string = `${player.name}`
            } else {
                let msg = new icmsg.FootholdLookupPlayerReq()
                msg.playerId = this._pointInfo.fhPoint.playerId
                NetManager.send(msg, (data: icmsg.FootholdLookupPlayerRsp) => {
                    this.footHoldModel.fhPlayers.push(data.player)
                    nameLab.string = `${data.player.name}`
                }, this)
            }
            //所属公会颜色
            let outline = this.occupyName.getChildByName("bg").getChildByName("nameLab").getComponent(cc.LabelOutline)
            if (this.footHoldModel.curMapData.mapType != FhMapType.Base) {
                let colorId = FootHoldUtils.getFHGuildColor(this._pointInfo.fhPoint.guildId)
                this.occupyNode.active = true
                this._updatePointColor(colorId)
                if (this._pointInfo.fhPoint.guildId != this.footHoldModel.roleTempGuildId) {
                    if (this.footHoldModel.myAlliance.indexOf(this._pointInfo.fhPoint.guildId) != -1) {
                        nameLab.node.color = cc.color("#50FDFF")//友军 蓝色
                        outline.color = cc.color("#294161")
                    } else {
                        nameLab.node.color = cc.color("#ff6464")//红色敌对
                        outline.color = cc.color("#441500")
                    }
                } else {
                    if (this._pointInfo.fhPoint.playerId == this.roleModel.id) {
                        nameLab.node.color = cc.color("#00ff00")//自己 绿色
                        outline.color = cc.color("#294161")
                        selfIcon.active = true
                    } else {
                        nameLab.node.color = cc.color("#50FDFF")//友军 蓝色
                        outline.color = cc.color("#294161")
                    }
                }
            } else {
                if (this._pointInfo.fhPoint.playerId == this.roleModel.id) {
                    nameLab.node.color = cc.color("#00ff00")
                    outline.color = cc.color("#294161")
                    selfIcon.active = true
                } else {
                    nameLab.node.color = cc.color("#50FDFF")
                    outline.color = cc.color("#294161")
                }
                this.occupyNode.active = true
                this._updatePointColor(0)
            }
            this.redPoint.active = FootHoldUtils.isShowRedPoint(this._pointInfo.pos.x, this._pointInfo.pos.y)

            //驻守状态
            if (this._pointInfo.fhPoint.status & 4) {
                this.guardState.active = true
            }

            //集结状态
            this._clearGatherTime()
            if (this._pointInfo.fhPoint.status & 8) {
                let gather_forces = ConfigManager.getItemById(Foothold_globalCfg, "gather_forces").value[0]
                if (this._pointInfo.fhPoint.gather.teamNum < gather_forces) {
                    this.timeBarNode.active = true
                    cc.find("layout/teamLab", this.timeBarNode).getComponent(cc.Label).string = `(${this._pointInfo.fhPoint.gather.teamNum}/${gather_forces})`
                    this._createGatherTime()
                } else {
                    this.timeBarNode.active = false
                }

                let targetPos = this._pointInfo.fhPoint.gather.targetPos
                let points = this.footHoldModel.warPoints

                let targetInfo: FhPointInfo = points[`${targetPos.x}-${targetPos.y}`]
                this.gatherArrow.active = true
                this.gatherArrow.angle = FootHoldUtils.getTargetArrowAngle(this._pointInfo.pos, targetInfo.pos)
                let pointsCtrl: FootHoldPointCtrl = this.footHoldModel.warPointsCtrl[`${targetPos.x}-${targetPos.y}`]
                if (pointsCtrl) {
                    gdk.Timer.callLater(this, () => {
                        pointsCtrl.gatherState.active = true
                    })
                }
                let gView = gdk.panel.get(PanelId.GlobalFootHoldView)
                this.gatherArrow.position = cc.v2(this._pointInfo.mapPoint.x, this._pointInfo.mapPoint.y + this.gatherArrow.height / 2)
                this.gatherArrow.parent = gView.getComponent(GlobalFootHoldViewCtrl).tiledMap.cityLayer
            }
        }

        this.spine.node.active = false
        //全区战入口红点提示
        if (this._pointInfo.type == 10) {
            this.redPoint.active = this.footHoldModel.globalMapData && this.footHoldModel.energy >= 2
            if (this.footHoldModel.globalMapData) {
                this.pointIcon.active = false
                this.spine.node.active = true
                this.spine.setAnimation(0, "stand", true)
            }
        }

        this.guildNode.active = false
        if (this._pointInfo.type == 0 && this.footHoldModel.curMapData.mapType != FhMapType.Base) {
            let lvLab = this.guildNode.getChildByName("layout").getChildByName("lvLab").getComponent(cc.Label)
            let guild = FootHoldUtils.findGuildByPos(this._pointInfo.pos.x, this._pointInfo.pos.y)
            if (guild) {
                lvLab.string = `${guild.level}${gdk.i18n.t("i18n:FOOTHOLD_TIP3")}`
                this.guildNode.active = true
                //基地体力领取红点
                let baseLvRP = this.guildNode.getChildByName("baseLvRp")
                baseLvRP.active = false
                if (guild.id == this.footHoldModel.roleTempGuildId) {
                    // if (this.footHoldModel.rewardedBaseLevel < guild.level) {
                    //     baseLvRP.active = true
                    // }
                    if (!this.footHoldModel.baseLevel) {
                        let msg = new icmsg.FootholdBaseLevelReq()
                        msg.warId = this.footHoldModel.curMapData.warId
                        msg.guildId = this.footHoldModel.roleTempGuildId
                        NetManager.send(msg, null, this);
                    }
                    else {
                        let lvCfg = ConfigManager.getItemById(Foothold_baseCfg, this.footHoldModel.baseLevel);
                        if (lvCfg && this.footHoldModel.freeEnergy < lvCfg.privilege2) {
                            baseLvRP.active = true;
                        }
                    }
                }
            } else {
                lvLab.string = ``
            }
        }

        this.hpNode.active = false
        if (this._pointInfo.fhPoint && this._pointInfo.fhPoint.playerId == 0) {
            //更新据点剩余血量
            if (this._pointInfo.fhPoint.bossHp > 0) {
                let cfg = ConfigManager.getItemById(Pve_mainCfg, this._stageCfg.born)
                let bossId = ConfigManager.getItemById(Pve_bornCfg, cfg.monster_born_cfg[0]).enemy_id
                let bossHP = ConfigManager.getItemById(MonsterCfg, bossId).hp
                if (bossHP) {
                    this.hpNode.active = true
                    let bar = this.hpNode.getChildByName("hpBar").getComponent(cc.ProgressBar)
                    bar.progress = this._pointInfo.fhPoint.bossHp / bossHP
                }
            }
        }

        this.cityNode.active = false
        if (this.footHoldModel.cityGetPoints[`${this._pointInfo.pos.x}-${this._pointInfo.pos.y}`] && this._pointInfo.fhPoint && this._pointInfo.fhPoint.guildId > 0) {
            GlobalUtil.setGrayState(this.pointIcon, 0)
        }
        //辐射塔样式
        let path = ""
        if (this._pointInfo.bonusType == 0) {
            let bonusCfg = ConfigManager.getItemByField(Foothold_bonusCfg, "map_type", this.footHoldModel.curMapData.mapType, { world_level: this.footHoldModel.worldLevelIndex })
            if (FootHoldUtils.getBuffTowerType(this._pointInfo.pos.x, this._pointInfo.pos.y) == 1) {
                path = `view/guild/texture/icon/${bonusCfg.resources_skin}`
            } else if (FootHoldUtils.getBuffTowerType(this._pointInfo.pos.x, this._pointInfo.pos.y) == 2) {
                path = `view/guild/texture/icon/${bonusCfg.attribute_skin}`
            } else if (FootHoldUtils.getBuffTowerType(this._pointInfo.pos.x, this._pointInfo.pos.y) == 3) {
                path = `view/guild/texture/icon/${bonusCfg.attenuation_skin}`
            }
            GlobalUtil.setSpriteIcon(this.node, this.pointIcon, path)
        }

        this._updateMarkFlag()
    }

    /**据点迷雾 */
    setPointFog() {
        this.rewardNode.active = false
        this.pointIcon.active = false
        this.occupyNode.active = false
        this.fight.active = false
        this.typeIcon.active = false
        this.colorNode.active = false
        this.fog.active = true
        this.node.visible = false
    }

    // /**据点样式 */
    setPointType() {
        if (this._pointInfo.type > 0 && this._pointInfo.type < 9) {
            this._pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_id", this.footHoldModel.curMapData.mapId, { world_level: this.footHoldModel.worldLevelIndex, point_type: this._pointInfo.type, map_type: this.footHoldModel.curMapData.mapType })
            let id = this._pointCfg.round[FightingMath.rnd(0, this._pointCfg.round.length - 1)]
            this._stageCfg = ConfigManager.getItemById(Copy_stageCfg, id);
            let path = `view/guild/texture/icon/${this._pointCfg.resources}`
            GlobalUtil.setSpriteIcon(this.node, this.pointIcon, path)
        }
    }

    /**据点样式 */
    setPointTypeNew(cfg: Foothold_pointCfg, id: number) {
        this._pointCfg = cfg;
        if (cfg && id) {
            this._stageCfg = ConfigManager.getItemById(Copy_stageCfg, id);
            let path = `view/guild/texture/icon/${this._pointCfg.resources}`;
            GlobalUtil.setSpriteIcon(this.node, this.pointIcon, path);
            return;
        }
        GlobalUtil.setSpriteIcon(this.node, this.pointIcon, null);
    }

    /**据点产出 */
    setOutput(isFly: boolean = false) {
        this.rewardNode.active = false
        if (this._pointInfo.type > 0 && this._pointInfo.type < 9) {
            if (this._pointInfo.output && this._pointInfo.output.length > 0) {
                this.rewardNode.active = true
                // let hand = this.rewardNode.getChildByName("hand")
                // let ani = hand.getComponent(cc.Animation)
                // ani.play("fhOutputAni")
                let gView = gdk.panel.get(PanelId.GlobalFootHoldView)
                let childs = gView.getComponent(GlobalFootHoldViewCtrl).tipLayer.children
                for (let i = 0; i < childs.length; i++) {
                    childs[i].stopAllActions()
                }
                //据点产出飘字动画
                gView.getComponent(GlobalFootHoldViewCtrl).tipLayer.removeAllChildren()

                if (!isFly) {
                    return
                }

                let gets = []
                this._pointInfo.output.forEach(element => {
                    if (element.num > 0) {
                        gets.push(element)
                    }
                });
                for (let i = 0; i < gets.length; i++) {
                    gdk.Timer.once(1000 * i, this, () => {
                        let good = gets[i]
                        let item: cc.Node = cc.instantiate(this.produceItem)//GuildWarPool.get(this.produceItem)
                        if (item) {
                            let wPos = this.node.parent.convertToWorldSpaceAR(cc.v2(this._pointInfo.mapPoint.x - item.width / 2, this._pointInfo.mapPoint.y + this.node.height / 2))
                            item.position = gView.getComponent(GlobalFootHoldViewCtrl).tipLayer.convertToNodeSpaceAR(wPos)
                            gView.getComponent(GlobalFootHoldViewCtrl).tipLayer.addChild(item)
                            let ctrl = item.getComponent(FHProduceItem2Ctrl)
                            ctrl.updateViewInfo(good.typeId, good.num)
                            let action = cc.spawn(cc.moveTo(1, item.x, item.y + 100), cc.fadeOut(1))
                            item.runAction(action)
                        }
                    })
                }
            }
        }
    }

    /**设置放弃的地块状态 */
    setGiveupState() {
        this.redPoint.active = false
        this.occupyName.active = false
        this.rewardNode.active = false
        this.colorNode.active = false
        this.occupyNode.active = false
        if (this._pointInfo.fhPoint && this._pointInfo.fhPoint.playerId == 0 && this._pointInfo.fhPoint.guildId > 0 && this._pointInfo.type != 0) {
            if (this.footHoldModel.curMapData.mapType != FhMapType.Base) {
                this.occupyNode.active = true
                let colorId = FootHoldUtils.getFHGuildColor(this._pointInfo.fhPoint.guildId)
                this._updatePointColor(colorId)
            }
        }
    }

    /**更新占领者地块颜色 */
    _updatePointColor(id) {
        for (let i = 0; i < this.occupyColorNodes.length; i++) {
            this.occupyColorNodes[i].active = false
        }
        this.occupyColorNodes[id].active = true
    }

    _updateMarkFlag() {
        this.markFlag.active = false
        if (this.footHoldModel.markFlagPoints[`${this._pointInfo.pos.x}-${this._pointInfo.pos.y}`]) {
            this.markFlag.active = true
            let colorId = FootHoldUtils.getFHGuildColor(this.footHoldModel.roleTempGuildId)
            GlobalUtil.setSpriteIcon(this.node, this.markFlag, `view/guild/texture/icon/gh_qizhi${colorId}`)
        }
    }

    clickFunc() {
        if (this.footHoldModel.isGuessMode && this.footHoldModel.curMapData.mapType != FhMapType.Base) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP88"))
            return
        }

        if (this.footHoldModel.gatherMode) {
            //处于集结设置状态
            if (cc.find("useNode/yesNode", this.gatherNode).active) {
                let info: AskInfoType = {
                    title: ``,
                    sureCb: () => {
                        NetManager.on(icmsg.FootholdGatherBriefRsp.MsgType, this._initGatherInviteView, this)

                        let msg = new icmsg.FootholdGatherInitReq()
                        msg.from = this.footHoldModel.pointDetailInfo.pos
                        msg.to = this._pointInfo.fhPoint.pos
                        NetManager.send(msg)
                    },
                    descText: `${gdk.i18n.t("i18n:FOOTHOLD_TIP94")}`,
                    thisArg: this,
                }
                GlobalUtil.openAskPanel(info)
            } else {
                gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP93"))
            }
            return
        }

        if (this._pointInfo.type != 0 && this._pointInfo.type < 9 && !this.fog.active) {
            if (this._pointInfo.fhPoint) {
                if (this._pointInfo.fhPoint.playerId > 0) {
                    JumpUtils.showGuideMask()
                    let msg = new icmsg.FootholdPointDetailReq()
                    let pos: icmsg.FootholdPos = new icmsg.FootholdPos()
                    pos.x = this._pointInfo.pos.x
                    pos.y = this._pointInfo.pos.y
                    msg.warId = this.footHoldModel.curMapData.warId
                    msg.pos = pos
                    NetManager.send(msg, (data: icmsg.FootholdPointDetailRsp) => {
                        JumpUtils.hideGuideMask()
                        this.footHoldModel.pointDetailInfo = data

                        //标记模式
                        if (this.footHoldModel.markMode) {
                            let tag = ConfigManager.getItemById(Foothold_globalCfg, "tag").value[0]
                            if (FootHoldUtils.getMarkPointsNum() >= tag && !this.footHoldModel.markFlagPoints[`${data.pos.x}-${data.pos.y}`]) {
                                gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP86"), tag))
                                return
                            }
                            gdk.panel.open(PanelId.FHPointMarkPanel)
                            return
                        }

                        if (FootHoldUtils.isPlayerDmgPoint(this.roleModel.id, data)) {
                            if (data.scoreRewarded && this.footHoldModel.curMapData.mapType != FhMapType.Base) {
                                if (this._pointInfo.fhPoint.playerId == this.roleModel.id) {
                                    //自己的据点
                                    gdk.panel.setArgs(PanelId.FHBattleArrayView, data.isChallenged)
                                    gdk.panel.open(PanelId.FHBattleArrayView)
                                } else {
                                    if (this._pointInfo.fhPoint.guildId != this.footHoldModel.roleTempGuildId) {
                                        let time = this._pointInfo.fhPoint.statusEndtime - Math.floor(GlobalUtil.getServerTime() / 1000)
                                        if (time > 0) {
                                            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP23"), time))//`该据点处于保护期,${time}秒后才可进行抢夺`
                                            return
                                        }
                                        this._checkFightFunc(false)
                                    } else {
                                        gdk.panel.open(PanelId.FHBattleArrayView)
                                        //gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP24"))
                                    }
                                }
                            } else {
                                gdk.panel.setArgs(PanelId.FootHoldPointDetail, this._pointInfo, this._stageCfg)
                                gdk.panel.open(PanelId.FootHoldPointDetail)
                            }
                        } else {
                            if (this.footHoldModel.curMapData.mapType != FhMapType.Base) {
                                if (this._checkCanFight(this._pointInfo.pos.x, this._pointInfo.pos.y)) {
                                    if (data.bossId == -1) {
                                        //据点已被占据（bossId为-1表示已被人占领）
                                        this.footHoldModel.lastSelectPoint = this._pointInfo
                                        if (this._pointInfo.fhPoint.playerId == this.roleModel.id) {
                                            //自己的据点
                                            gdk.panel.setArgs(PanelId.FHBattleArrayView, data.isChallenged)
                                            gdk.panel.open(PanelId.FHBattleArrayView)
                                        } else {
                                            if (this.footHoldModel.fightPoint != null && !FootHoldUtils.isSameFightFootHold(this._pointInfo.pos.x, this._pointInfo.pos.y)) {
                                                gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP25"))
                                            } else {
                                                if ((this._pointInfo.fhPoint.status & 1) && this._pointInfo.fhPoint.playerId != this.roleModel.id) {
                                                    if (!FootHoldUtils.isSameFightFootHold(this._pointInfo.pos.x, this._pointInfo.pos.y)) {
                                                        GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FOOTHOLD_TIP26"))
                                                    } else {
                                                        this._checkFightFunc(false)
                                                    }
                                                } else {
                                                    if (this._pointInfo.fhPoint.guildId != this.footHoldModel.roleTempGuildId) {
                                                        if (this.footHoldModel.myAlliance.indexOf(this._pointInfo.fhPoint.guildId) != -1) {
                                                            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FOOTHOLD_TIP78"))
                                                            return
                                                        }
                                                        let time = this._pointInfo.fhPoint.statusEndtime - Math.floor(GlobalUtil.getServerTime() / 1000)
                                                        if (time > 0) {
                                                            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP23"), time))//`该据点处于保护期,${time}秒后才可进行抢夺`
                                                            return
                                                        }
                                                        this._checkFightFunc(false)
                                                    } else {
                                                        gdk.panel.open(PanelId.FHBattleArrayView)
                                                        //GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FOOTHOLD_TIP27"))
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        gdk.panel.setArgs(PanelId.FootHoldPointDetail, this._pointInfo, this._stageCfg)
                                        gdk.panel.open(PanelId.FootHoldPointDetail)
                                    }
                                } else {
                                    GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FOOTHOLD_TIP28"))
                                }
                            }

                            //删除不相关的红点提示
                            if (FootHoldUtils.isShowRedPoint(data.pos.x, data.pos.y) && !FootHoldUtils.isPlayerDmgPoint(this.roleModel.id, data)) {
                                let msg = new icmsg.FootholdCancelRedpointReq()
                                msg.pos = this.footHoldModel.pointDetailInfo.pos
                                msg.warId = this.footHoldModel.curMapData.warId
                                NetManager.send(msg, (rmsg: icmsg.FootholdCancelRedpointRsp) => {
                                    FootHoldUtils.deletePoint(rmsg.pos.x, rmsg.pos.y)
                                }, this)
                            }

                            //本公会据点可以查看其它据点的信息
                            if (this.footHoldModel.curMapData.mapType == FhMapType.Base) {
                                gdk.panel.setArgs(PanelId.FootHoldPointDetail, this._pointInfo, this._stageCfg)
                                gdk.panel.open(PanelId.FootHoldPointDetail)
                            }
                        }
                    }, this)
                } else {
                    if ((this._pointInfo.fhPoint.status & 1) && !FootHoldUtils.isSameFightFootHold(this._pointInfo.pos.x, this._pointInfo.pos.y)) {
                        gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP26"))
                        return
                    } else {
                        if (this._pointInfo.fhPoint.playerId == 0 && this._pointInfo.fhPoint.bossHp == 0 && this._pointInfo.fhPoint.guildId == this.footHoldModel.roleTempGuildId) {
                            gdk.panel.setArgs(PanelId.FHOccupyView, this._pointInfo)
                            gdk.panel.open(PanelId.FHOccupyView)
                        } else {
                            this._checkFightFunc()
                        }
                    }
                }
            } else {
                //标记模式
                if (this.footHoldModel.markMode) {
                    let msg = new icmsg.FootholdPointDetailReq()
                    let pos: icmsg.FootholdPos = new icmsg.FootholdPos()
                    pos.x = this._pointInfo.pos.x
                    pos.y = this._pointInfo.pos.y
                    msg.warId = this.footHoldModel.curMapData.warId
                    msg.pos = pos
                    NetManager.send(msg, (data: icmsg.FootholdPointDetailRsp) => {
                        JumpUtils.hideGuideMask()
                        this.footHoldModel.pointDetailInfo = data
                        let tag = ConfigManager.getItemById(Foothold_globalCfg, "tag").value[0]
                        if (FootHoldUtils.getMarkPointsNum() >= tag && !this.footHoldModel.markFlagPoints[`${data.pos.x}-${data.pos.y}`]) {
                            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP86"), tag))
                            return
                        }
                        gdk.panel.open(PanelId.FHPointMarkPanel)
                    })
                    return
                }

                this._checkFightFunc()
            }
        } else if (this._pointInfo.type == 10) {
            let msg = new icmsg.FootholdCoopGuildListReq()
            NetManager.send(msg, (data: icmsg.FootholdCoopGuildListRsp) => {
                this.footHoldModel.cooperGuildList = data.guildList
                let g_open = ConfigManager.getItemByField(Foothold_globalCfg, "key", "open").value[5]
                if (this.footHoldModel.activityIndex >= g_open
                    && this.footHoldModel.cooperGuildList.length >= 4
                    && FootHoldUtils.isCanCooperation(this.roleModel.guildId)) {
                    //打开协战界面
                    gdk.panel.open(PanelId.FHCooperationMain)
                } else {
                    if (!this.footHoldModel.globalMapData) {
                        if (FootHoldUtils.isCrossWar) {
                            let tipCfg = ConfigManager.getItemById(TipsCfg, 85)
                            gdk.gui.showMessage(tipCfg.desc21)
                        } else {
                            let tipCfg = ConfigManager.getItemById(TipsCfg, 84)
                            gdk.gui.showMessage(tipCfg.desc21)
                        }
                        return
                    }
                    //传送门打开界面
                    JumpUtils.openPanel({
                        panelId: PanelId.GlobalFootHoldView,
                        currId: PanelId.GuildFootHoldView
                    })
                }
            })
        } else if (this._pointInfo.type == 0) {
            //点击起点
            if (this.footHoldModel.curMapData.mapType != FhMapType.Base) {
                let guild = FootHoldUtils.findGuildByPos(this._pointInfo.pos.x, this._pointInfo.pos.y)
                if (guild && guild.id == this.roleModel.guildId) {
                    // gdk.panel.open(PanelId.FHBaseReward)
                    let cfg = ConfigManager.getItemByField(Foothold_globalCfg, 'key', 'open');
                    if (this.footHoldModel.activityIndex >= cfg.value[3]) {
                        gdk.panel.open(PanelId.FHBaseRewardNew);
                    }
                    else {
                        gdk.gui.showMessage(StringUtils.format(gdk.i18n.t('i18n:FOOTHOLD_TIP129'), cfg.value[3], this.footHoldModel.activityIndex, cfg.value[3]));
                    }
                }
            }
        }
    }

    _checkFightFunc(isNeedReq: boolean = true) {
        if (this._checkCanFight(this._pointInfo.pos.x, this._pointInfo.pos.y)) {
            if (this.footHoldModel.curMapData.mapType != FhMapType.Base) {
                //判断占领据点上限
                let g_open = ConfigManager.getItemByField(Foothold_globalCfg, "key", "open").value
                let team_limit = ConfigManager.getItemByField(Foothold_globalCfg, "key", "team_limit").value[0]
                if (this.footHoldModel.activityIndex >= g_open[4]) {
                    team_limit = ConfigManager.getItemByField(Foothold_globalCfg, "key", "team_limit_1").value[0]
                }
                let maxPointNum = team_limit +
                    MilitaryRankUtils.getPrivilegeCommon(MRPrivilegeType.p3, this.footHoldModel.militaryRankLv) +
                    FootHoldUtils.getPrivilegeCommon(MRPrivilegeType.p3, this.footHoldModel.baseLevel)
                if (FootHoldUtils.getPlayerPointNum(this.roleModel.id) >= maxPointNum && (this._pointInfo.bonusType != 0)) {
                    //GlobalUtil.showMessageAndSound(StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP30"), maxPointNum))//`每名玩家最多只可占领${maxPointNum}个据点`
                    let info: AskInfoType = {
                        title: gdk.i18n.t("i18n:TIP_TITLE"),
                        sureCb: () => {
                            this.footHoldModel.isShowPointList = false
                            let gView = gdk.panel.get(PanelId.GlobalFootHoldView)
                            let ctrl = gView.getComponent(GlobalFootHoldViewCtrl)
                            ctrl.showPointList()
                            GuideUtil.setGuideId(212009)
                        },
                        closeText: gdk.i18n.t("i18n:CANCEL"),
                        sureText: gdk.i18n.t("i18n:FOOTHOLD_TIP46"),
                        descText: StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP30"), maxPointNum),
                    }
                    GlobalUtil.openAskPanel(info)
                    return
                }
            }
            if (isNeedReq) {
                this._readyFight()
            } else {
                this._readyOpenPanel()
            }
        } else {
            if (!this.fog.active) {
                GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:FOOTHOLD_TIP28"))
            }
        }
    }

    _readyFight() {
        JumpUtils.showGuideMask()
        let msg = new icmsg.FootholdPointDetailReq()
        let pos: icmsg.FootholdPos = new icmsg.FootholdPos()
        pos.x = this._pointInfo.pos.x
        pos.y = this._pointInfo.pos.y
        msg.warId = this.footHoldModel.curMapData.warId
        msg.pos = pos
        NetManager.send(msg, (data: icmsg.FootholdPointDetailRsp) => {
            JumpUtils.hideGuideMask()
            this.footHoldModel.pointDetailInfo = data
            this._readyOpenPanel()
        }, this)
    }

    _readyOpenPanel() {
        if (this.footHoldModel.pointDetailInfo.bossId == -1) {
            //据点已被占据（bossId为-1表示已被人占领）
            this.footHoldModel.lastSelectPoint = this._pointInfo
            let pos: icmsg.FootholdPos = new icmsg.FootholdPos()
            pos.x = this._pointInfo.pos.x
            pos.y = this._pointInfo.pos.y
            gdk.panel.setArgs(PanelId.FHPVPBattleReadyView, pos, this.footHoldModel.curMapData.warId)
            gdk.panel.open(PanelId.FHPVPBattleReadyView)
        } else {
            gdk.panel.setArgs(PanelId.FootHoldPointDetail, this._pointInfo, this._stageCfg)
            gdk.panel.open(PanelId.FootHoldPointDetail)
        }
    }

    _checkCanFight(x, y) {
        if (this.footHoldModel.isTest) {
            return true
        }

        /**自己的点 */
        if (this._pointInfo.fhPoint && this._pointInfo.fhPoint.playerId == this.roleModel.id) {
            return true
        }

        //左上
        let leftUpPos = cc.v2(x - 1, y - 1)
        //右上
        let rightUpPos = cc.v2(x + 1, y - 1)
        //左
        let leftPos = cc.v2(x - 2, y)
        //右
        let rightPos = cc.v2(x + 2, y)
        //左下
        let leftDownPos = cc.v2(x - 1, y + 1)
        //右下
        let rightDownPos = cc.v2(x + 1, y + 1)

        return (this._checkPointOccupied(leftUpPos) || this._checkPointOccupied(rightUpPos)
            || this._checkPointOccupied(leftPos) || this._checkPointOccupied(rightPos)
            || this._checkPointOccupied(leftDownPos) || this._checkPointOccupied(rightDownPos))
    }

    _checkPointOccupied(pos) {
        let points = this.footHoldModel.warPoints
        let info: FhPointInfo = points[`${pos.x}-${pos.y}`]

        if (this.footHoldModel.curMapData.mapType == FhMapType.Base) {
            if (info && ((info.fhPoint && info.fhPoint.playerId > 0) || info.type == 0)) {
                return true
            }
        } else {
            //被占领且属于同一公会
            let guilds = this.footHoldModel.fhGuilds
            let guild: icmsg.FootholdGuild
            for (let i = 0; i < guilds.length; i++) {
                if (guilds[i].origin.x == pos.x && guilds[i].origin.y == pos.y) {
                    guild = guilds[i]
                    break
                }
            }
            if (info && ((info.fhPoint && info.fhPoint.playerId > 0 && info.fhPoint.guildId == this.footHoldModel.roleTempGuildId)
                || (guild && info.type == 0 && guild.id == this.footHoldModel.roleTempGuildId))) {
                return true
            }

            if (info && (info.fhPoint && info.fhPoint.playerId > 0 && this.footHoldModel.myAlliance.indexOf(info.fhPoint.guildId) != -1)
                || (guild && info.type == 0 && this.footHoldModel.myAlliance.indexOf(guild.id) != -1)) {
                return true
            }
        }
        return false
    }

    /**获取 收益 */
    getOutputFunc() {
        if (this._pointInfo.fhPoint && this._pointInfo.output.length > 0) {
            let msg = new icmsg.FootholdTakeOutputReq()
            msg.warId = this.footHoldModel.curMapData.warId
            msg.pos = this._pointInfo.fhPoint.pos
            msg.all = false
            NetManager.send(msg, (data: icmsg.FootholdTakeOutputRsp) => {
                let goods = []
                if (data.exp > 0) {
                    let good = new icmsg.GoodsInfo()
                    good.typeId = FootHoldUtils.BaseExpId
                    good.num = data.exp
                    goods.push(good)
                }
                GlobalUtil.openRewadrView(goods.concat(data.list))

                FootHoldUtils.clearPointOutput(this._pointInfo.fhPoint.pos.x, this._pointInfo.fhPoint.pos.y)
                gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)
            })
        } else {
            CC_DEBUG && cc.log("据点没有数据")
        }
    }

    setGuideActive() {
        GuideUtil.bindGuideNode(19000, this.node)
    }

    _initGatherInviteView() {
        NetManager.on(icmsg.FootholdGatherBriefRsp.MsgType, this._initGatherInviteView, this)
        gdk.panel.open(PanelId.FHGatherInviteView)
        this.footHoldModel.gatherMode = false
        gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)
    }

    /** 集结操作样式 设置*/
    setOperateGatherAtkState(isGather) {
        this.colorNode.active = false
        this.occupyNode.active = false
        this.gatherNode.active = true
        let banNode = this.gatherNode.getChildByName("banNode")
        let useNode = this.gatherNode.getChildByName("useNode")
        banNode.active = false
        useNode.active = false
        if (isGather) {
            useNode.active = true
            let yes = useNode.getChildByName("yesNode")
            let no = useNode.getChildByName("noNode")
            if (this._pointInfo.fhPoint && this._pointInfo.fhPoint.playerId > 0
                && (this._pointInfo.fhPoint.guildId != this.footHoldModel.roleTempGuildId && this.footHoldModel.myAlliance.indexOf(this._pointInfo.fhPoint.guildId) == -1)) {
                yes.active = true
                no.active = false
            } else {
                yes.active = false
                no.active = true
            }
        } else {
            banNode.active = true
        }
    }

    _createGatherTime() {
        this._updateGatherTime()
        this._clearGatherTime()
        this.schedule(this._updateGatherTime, 1)
    }

    _updateGatherTime() {
        if (!this._pointInfo.fhPoint || !this._pointInfo.fhPoint.gather) {
            this._clearGatherTime()
            return
        }
        let startTime = this._pointInfo.fhPoint.gather.startTime
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let gather_time = ConfigManager.getItemById(Foothold_globalCfg, "gather_time").value[0]
        if (curTime > startTime + gather_time) {
            this._clearGatherTime()
            this.timeBarNode.active = false
        } else {
            cc.find("timeLab", this.timeBarNode).getComponent(cc.Label).string = TimerUtils.format2(startTime + gather_time - curTime)
            cc.find("proBar", this.timeBarNode).getComponent(cc.ProgressBar).progress = (startTime + gather_time - curTime) / gather_time
        }
    }

    _clearGatherTime() {
        this.unschedule(this._updateGatherTime)
    }
}