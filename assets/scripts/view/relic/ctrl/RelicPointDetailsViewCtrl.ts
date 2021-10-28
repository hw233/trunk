import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import RelicModel, { RelicCityState, RelicMapType, RelicRoleType } from '../model/RelicModel';
import RelicRecordCtrl from './RelicRecordCtrl';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import {
    Relic_mainCfg,
    Relic_mapCfg,
    Relic_pointCfg,
    TvCfg
    } from '../../../a/config';
import { RelicEventId } from '../enum/RelicEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-29 10:32:37 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicPointDetailsViewCtrl")
export default class RelicPointDetailsViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    titleNode: cc.Node = null;

    //-------------主要模块节点--------------//
    @property(cc.Node)
    pointInfoNode: cc.Node = null;

    @property(cc.Node)
    ownerTitle: cc.Node = null;

    @property(cc.Node)
    ownerNode: cc.Node = null;

    @property(cc.Node)
    recordTitle: cc.Node = null;

    @property(cc.Node)
    recordNode: cc.Node = null;

    @property(cc.Node)
    btnNode: cc.Node = null;

    //-----------额外节点-------------//
    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    get relicModel(): RelicModel { return ModelManager.get(RelicModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    mapType: number; //地图类型 1-安全区 2-PK区
    roleType: RelicRoleType; //角色类型
    cityId: number; //城池id
    cityCfg: Relic_pointCfg; //城池类型配置
    cityState: RelicCityState;//城池状态
    resp: icmsg.RelicPointDetailRsp;
    onEnable() {
        let mapCfg = ConfigManager.getItemById(Relic_mapCfg, this.relicModel.mapId);
        this.mapType = mapCfg.mapType;
        this.cityId = this.args[0];
        this.cityCfg = ConfigManager.getItemById(Relic_pointCfg, this.relicModel.cityMap[this.cityId].pointType);
        GlobalUtil.setSpriteIcon(this.node, this.titleNode, `view/relic/texture/${this.cityCfg.title}`);
        this.req();
        gdk.e.on(RelicEventId.RELIC_BROAD_CAST_POINT, this._onMapCityInfoChange, this);
    }

    onDisable() {
        this.unscheduleAllCallbacks();
        NetManager.targetOff(this);
        gdk.e.targetOff(this);
    }

    req(showTips: boolean = false) {
        let req = new icmsg.RelicPointDetailReq();
        req.mapType = this.mapType;
        req.pointId = this.cityId;
        NetManager.send(req, (resp: icmsg.RelicPointDetailRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            //todo
            this.resp = resp;
            this._refreshView();
            this._initLog();
            if (showTips) {
                let leftTime = Math.max(0, Math.floor((this.resp.outputTime * 1000 - GlobalUtil.getServerTime()) * (this.resp.exploreRate / 100)));
                gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:RELIC_TIP10"), TimerUtils.format4(leftTime / 1000)));
            }
            this._updateRedpoint();
        }, this);
    }

    onPlayerClick(e, idx) {
        let id = this.resp.defenders[parseInt(idx)].brief.id;
        gdk.panel.setArgs(PanelId.MainSet, id, 2);
        gdk.panel.open(PanelId.MainSet);
    }

    onTransBtnClick() {
        gdk.panel.open(PanelId.RelicTransPointView);
    }

    onJoinAssistBtnClick() {
        let req = new icmsg.RelicGuildDefendersReq();
        NetManager.send(req, (resp: icmsg.RelicGuildDefendersRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            for (let i = 0; i < resp.list.length; i++) {
                if (resp.list[i].defenderId == this.roleModel.id) {
                    gdk.gui.showMessage(gdk.i18n.t('i18n:RELIC_TIP29'));
                    return;
                }
            }
            let nodes = [];
            if (this.cityCfg.helper_num >= 1) nodes.push(this.ownerNode.children[0]);
            if (this.cityCfg.helper_num >= 2) nodes.push(this.ownerNode.children[2]);
            for (let i = 0; i < nodes.length; i++) {
                let blankPlaceNode = nodes[i].getChildByName('blankPlace'); //协防位置状态(无归属/被打掉/空)
                let broken = blankPlaceNode.getChildByName('broken');
                if (!broken.active) {
                    GlobalUtil.openAskPanel({
                        descText: gdk.i18n.t('i18n:RELIC_TIP30'),
                        sureCb: () => {
                            let req = new icmsg.RelicHelpDefendReq();
                            req.mapType = this.mapType;
                            req.ownerId = this.resp.defenders[0].brief.id;
                            req.pointId = this.resp.pointId;
                            NetManager.send(req, (resp: icmsg.RelicHelpDefendRsp) => {
                                if (!cc.isValid(this.node)) return;
                                if (!this.node.activeInHierarchy) return;
                                this.req();
                            }, this);
                        }
                    });
                    return;
                }
            }
            gdk.gui.showMessage(gdk.i18n.t('i18n:RELIC_TIP31'));
        }, this);
    }

    /**修复协防位 */
    onRepairBtnClick(e, idx) {
        let cfg = ConfigManager.getItemById(Relic_mainCfg, 1);
        if (BagUtils.getItemNumById(cfg.repair_cost[0]) < cfg.repair_cost[1]) {
            gdk.gui.showMessage(`${BagUtils.getConfigById(cfg.repair_cost[0]).name}${gdk.i18n.t("i18n:RELIC_TIP11")}`);
            return;
        }
        let req = new icmsg.RelicRepairReq();
        req.mapType = this.mapType;
        req.index = parseInt(idx);
        req.ownerId = this.resp.defenders[0].brief.id;
        req.pointId = this.resp.pointId;
        NetManager.send(req, (resp: icmsg.RelicRepairRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.req();
        }, this);
    }

    /**重置协防位 */
    onResetBtnClick(e, idx) {
        let cfg = ConfigManager.getItemById(Relic_mainCfg, 1);
        if (BagUtils.getItemNumById(cfg.repair_cost[0]) < cfg.repair_cost[1]) {
            gdk.gui.showMessage(`${BagUtils.getConfigById(cfg.repair_cost[0]).name}${gdk.i18n.t("i18n:RELIC_TIP11")}`);
            return;
        }
        let req = new icmsg.RelicHelpResetReq();
        req.index = parseInt(idx);
        NetManager.send(req, (resp: icmsg.RelicHelpResetRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            // this.resp.defenders.slice(resp.index, 1);
            // this._updateOwnerNode();
            this.req();
        }, this);
    }

    /**邀请协防 */
    onInviteAssistBtnClick() {
        gdk.panel.setArgs(PanelId.RelicInviteAssistView, [this.cityId, this.resp.defenders.length - 1]);
        gdk.panel.open(PanelId.RelicInviteAssistView);
        this.close();
    }

    onDropRecordBtnClick() {
        gdk.panel.setArgs(PanelId.RelicDropRecordView, this.cityId);
        gdk.panel.open(PanelId.RelicDropRecordView);
    }

    /**清除抢夺cd */
    onClearAtkCdBtnClick() {
        let isClearCD = GlobalUtil.getLocal('relic_clear_atk_cd', true) || false;
        let flag = this.btnNode.children[3].getChildByName('selectNode').getChildByName('select');
        flag.active = !isClearCD;
        GlobalUtil.setLocal('relic_clear_atk_cd', !isClearCD, true);
    }

    /**呼叫公会抢夺 */
    onGuildHelpBtnClick() {
        if (!this.roleModel.guildId) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:STORE_TIP26'));
            return;
        }
        let owner = this.ownerNode.children[1];
        let playerNode = owner.getChildByName('player'); //玩家
        let leftTimeNode = cc.find('state1/lefttime', this.pointInfoNode);
        let lab = cc.find('progressNode/label', leftTimeNode).getComponent(cc.Label);
        let s1 = cc.find('serverName', playerNode).getComponent(cc.Label).string;
        let s2 = this.cityCfg.des;
        let s3 = lab.string;
        let s4 = `${this.mapType}-${this.cityId}`;
        let str = ConfigManager.getItemByField(TvCfg, 'tv_id', 45).desc;
        let args = [s1, s2, s3, s4];
        for (let i = 0; i < args.length; i++) {
            str = str.replace("%s", args[i])
        }
        let req = new icmsg.ChatSendReq();
        req.channel = 3;
        req.targetId = 0;
        req.content = str;
        NetManager.send(req, (resp: icmsg.ChatSendRsp) => {
            gdk.gui.showMessage(gdk.i18n.t('i18n:RELIC_TIP32'));
        }, this);
    }

    /**开始探索 */
    onExplorBtnClick() {
        if (this.relicModel.totalExploreTime + this.relicModel.extraExploreTimes - this.relicModel.exploreTimes < this.cityCfg.consumption) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP12"));
            return;
        }

        if (this.relicModel.curExploreCity && this.relicModel.curExploreCity.length > 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP13"));
            return;
        }

        if (RedPointUtils.has_relic_reward()) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP14"));
            return
        }

        if (this.roleModel.power < this.cityCfg.fight_limit) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP15"));
            return;
        }

        let req = new icmsg.RelicPointExploreReq();
        req.mapType = this.mapType;
        req.pointId = this.cityId;
        NetManager.send(req, (resp: icmsg.RelicPointExploreRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.req(true);
        }, this);
    }

    /**放弃探索 */
    onGiveUpBtnClick() {
        GlobalUtil.openAskPanel({
            descText: gdk.i18n.t("i18n:RELIC_TIP16"),
            sureCb: () => {
                let req = new icmsg.RelicGiveUpReq();
                NetManager.send(req, (resp: icmsg.RelicGiveUpRsp) => {
                    if (!cc.isValid(this.node)) return;
                    if (!this.node.activeInHierarchy) return;
                    // this.req();
                    gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP17"));
                    this.close();
                }, this);
            }
        })
    }

    /**抢夺据点 */
    onAtkBtnClick() {
        if (this.relicModel.totalExploreTime + this.relicModel.extraExploreTimes - this.relicModel.exploreTimes < this.cityCfg.consumption) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP12"));
            return;
        }

        if (this.relicModel.curExploreCity && this.relicModel.curExploreCity.length > 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP13"));
            return;
        }

        if (RedPointUtils.has_relic_reward()) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP14"));
            return
        }

        if (this.roleModel.power < this.cityCfg.fight_limit) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP15"));
            return;
        }

        let cb = () => {
            let owner = this.resp.defenders[0];
            let defList = this.resp.defenders.length > 1 ? this.resp.defenders.slice(1) : [];
            defList.sort((a, b) => {
                if (a.hP == b.hP) {
                    return a.index - b.index;
                }
                else {
                    return a.hP - b.hP;
                }
            });
            let fightPlayer = defList.length > 0 ? defList[0].brief : owner.brief;
            this.relicModel.curAtkCity = `${this.mapType}-${this.cityId}`;
            this.relicModel.curAtkPlayerType = defList.length > 0 ? 1 : 0;
            JumpUtils.openPveArenaScene([fightPlayer.id, 0, fightPlayer], fightPlayer.name, 'RELIC')
            this.close();
        };

        let cfg = ConfigManager.getItemById(Relic_mainCfg, 1);
        let atkCd = Math.max(0, cfg.atk_cd * 1000 - (GlobalUtil.getServerTime() - this.resp.lastAtkTime * 1000));
        if (atkCd > 0) {
            let isClearCD = GlobalUtil.getLocal('relic_clear_atk_cd', true) || false;
            if (!isClearCD) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP18"));
            }
            else {
                let money = BagUtils.getItemNumById(cfg.atk_cost[0]);
                if (money < cfg.atk_cost[1]) {
                    gdk.gui.showMessage(`${BagUtils.getConfigById(cfg.atk_cost[0]).name}${gdk.i18n.t("i18n:RELIC_TIP11")}`);
                }
                else {
                    let req = new icmsg.RelicFightClearCDReq();
                    req.mapType = this.mapType;
                    req.pointId = this.cityId;
                    NetManager.send(req, () => {
                        if (!cc.isValid(this.node)) return;
                        if (!this.node.activeInHierarchy) return;
                        cb();
                    }, this);
                }
            }
        }
        else {
            let isFightting = this.resp.fightTime && (GlobalUtil.getServerTime() - this.resp.fightTime * 1000 < 5 * 60 * 1000);
            if (isFightting) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP19"));
            }
            else {
                cb();
            }
        }
    }

    /**刷新界面 */
    _refreshView() {
        this._updateRoleType();
        this._updateCityType();
        this._updateInfoNode();
        this._updateOwnerNode();
        this._updateBtnNode();
        this._updateRecordTitle();
    }

    /**更新玩家角色定位 */
    _updateRoleType() {
        let gName = this.roleModel.guildName || "";
        if (!this.resp.defenders || this.resp.defenders.length <= 0) {
            this.roleType = RelicRoleType.None;
        }
        else if (this.roleModel.id == this.resp.defenders[0].brief.id) {
            this.roleType = RelicRoleType.Owner;
        }
        else if (this.mapType !== RelicMapType.SafeArea && (gName.length == 0 || gName !== this.resp.guildName)) {
            this.roleType = RelicRoleType.Atk;
        }
        else {
            let assistIds = [];
            this.resp.defenders.forEach((info, idx) => {
                if (idx !== 0) {
                    assistIds.push(info.brief.id);
                }
            });
            if (assistIds.indexOf(this.roleModel.id) !== -1) {
                this.roleType = RelicRoleType.Assist;
            }
            else if (gName.length !== 0 && gName == this.resp.guildName) {
                this.roleType = RelicRoleType.SameGuild;
            }
            else {
                this.roleType = RelicRoleType.Others;
            }
        }
    }

    /**更新据点状态 */
    _updateCityType() {
        let curTime = GlobalUtil.getServerTime();
        if (!this.resp.defenders || this.resp.defenders.length <= 0) {
            this.cityState = RelicCityState.idle;
        }
        else {
            if (curTime - this.resp.fightTime * 1000 < 5 * 60 * 1000) {
                this.cityState = RelicCityState.atking;
            }
            else if (curTime - this.resp.contestTime * 1000 < 1 * 60 * 60 * 1000) {
                this.cityState = RelicCityState.scramble;
            }
            else {
                this.cityState = RelicCityState.explore;
            }
        }
    }

    //顶部信息
    _updateInfoNode() {
        let icon = cc.find('zzyj_tanchuangjianzudi/icon', this.pointInfoNode);
        // let nameLab = cc.find('name', this.pointInfoNode).getComponent(cc.Label);
        let powerLab = cc.find('state1/power', this.pointInfoNode).getComponent(cc.Label);
        let leftTimeNode = cc.find('state1/lefttime', this.pointInfoNode);
        let explorTimeNode = cc.find('state1/explorTime', this.pointInfoNode);
        let costLab = cc.find('state1/costLab', this.pointInfoNode).getComponent(cc.Label);
        let dropScrollView = cc.find('state1/scrollview', this.pointInfoNode).getComponent(cc.ScrollView);
        let dropContent = cc.find('content', dropScrollView.node);
        //icon
        GlobalUtil.setSpriteIcon(this.node, icon, `view/guild/texture/icon/${this.cityCfg.skin}`);
        //name
        // nameLab.string = this.cityCfg.des;
        //cost
        costLab.string = this.cityCfg.consumption + '';
        //power
        powerLab.string = this.cityCfg.fight + '';
        //drop
        dropContent.removeAllChildren();
        this.cityCfg.drop_show.forEach(reward => {
            let item = cc.instantiate(this.slotPrefab);
            item.parent = dropContent;
            let ctrl = item.getComponent(UiSlotItem);
            ctrl.updateItemInfo(reward[0], reward[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: reward[0],
                itemNum: reward[1],
                type: BagUtils.getItemTypeById(reward[0]),
                extInfo: null
            };
        });
        dropScrollView.scrollToTopLeft();
        dropScrollView.enabled = this.cityCfg.drop_show.length > 3;
        //time
        if (this.cityState == RelicCityState.idle && this.roleType == RelicRoleType.None && this.resp.outputTime == 0) {
            //空闲
            leftTimeNode.active = false;
            explorTimeNode.active = true;
            explorTimeNode.getChildByName('num').getComponent(cc.Label).string = TimerUtils.format4(this.cityCfg.time);
            this.unschedule(this._updateExplorTime);
        }
        else {
            //探索中  归属者/攻击者/协战者
            leftTimeNode.active = true;
            explorTimeNode.active = false;
            this._updateExplorTime();
            this.schedule(this._updateExplorTime, 1);
        }
    }

    //归属
    _updateOwnerNode() {
        let efficientLab = cc.find('efficientLab/lab', this.ownerTitle).getComponent(cc.Label);
        let posNodes = this.ownerNode.children;
        if (this.resp.defenders.length == 0 || this.roleType == RelicRoleType.Atk) {
            //空闲 or 攻击者视角
            efficientLab.node.parent.active = false;
        }
        else {
            //探索中  归属者/攻击者/协战者
            efficientLab.node.parent.active = true;
            efficientLab.string = `${Math.max(70, Math.min(130, Math.floor(this.resp.defenders[0].brief.power / this.cityCfg.fight * 100)))}%` + `${this.resp.defenders.length > 1 ? `+${0.1 * (this.resp.defenders.length - 1) * 100}%` : ''}`;
        }
        //pos
        let nodes = [posNodes[1], posNodes[0], posNodes[2]]; // 归属 协防1  协防2
        nodes.forEach((n, idx) => {
            if (idx == 0) n.active = true;
            if (idx == 1) n.active = this.cityCfg.helper_num >= 1;
            if (idx == 2) n.active = this.cityCfg.helper_num >= 2;
            if (n.active) {
                let playerNode = n.getChildByName('player'); //玩家
                let blankPlaceNode = n.getChildByName('blankPlace'); //协防位置状态(无归属/被打掉/空)
                let add = blankPlaceNode.getChildByName('add');
                let broken = blankPlaceNode.getChildByName('broken');
                let lack = blankPlaceNode.getChildByName('lack');
                let resetNode = playerNode.getChildByName('reset');
                playerNode.active = false;
                blankPlaceNode.active = false;
                resetNode.active = false;
                if (this.cityState == RelicCityState.idle) {
                    blankPlaceNode.active = true;
                    add.active = false;
                    broken.active = false;
                }
                else {
                    let info;
                    for (let i = 0; i < this.resp.defenders.length; i++) {
                        if (this.resp.defenders[i].index == idx) {
                            info = this.resp.defenders[i];
                            break;
                        }
                    }
                    if (info) {
                        playerNode.active = true;
                        let totalHp = idx == 0 ? this.cityCfg.owner_hp : this.cityCfg.helper_hp;
                        GlobalUtil.setSpriteIcon(this.node, cc.find('heroSlot/iconBg', playerNode), GlobalUtil.getHeadFrameById(info.brief.headFrame));
                        GlobalUtil.setSpriteIcon(this.node, cc.find('heroSlot/mask/icon', playerNode), GlobalUtil.getHeadIconById(info.brief.head));
                        cc.find('heroSlot/lv', playerNode).getComponent(cc.Label).string = '.' + info.brief.level;
                        cc.find('layout/power', playerNode).getComponent(cc.Label).string = info.brief.power + '';
                        cc.find('serverName', playerNode).getComponent(cc.Label).string = `S${GlobalUtil.getSeverIdByPlayerId(info.brief.id)}${gdk.i18n.t("i18n:RELIC_TIP1")}  ${info.brief.name}`;
                        cc.find('serverName', playerNode).color = cc.color(this.roleType == RelicRoleType.Atk ? '#FF0000' : '#00FF00');
                        cc.find('playerName', playerNode).getComponent(cc.Label).string = this.resp.guildName;
                        cc.find('hp/label', playerNode).getComponent(cc.Label).string = `${gdk.i18n.t("i18n:RELIC_TIP20")}:${info.hP}/${totalHp}`;
                        cc.find('hp/progress/bar', playerNode).width = Math.min(131, Math.max(0, 129 * (info.hP / totalHp)));
                        this.relicModel.pointHpData = [info.hP, totalHp]
                        resetNode.active = idx !== 0 && this.roleType == RelicRoleType.Owner;
                        if (resetNode.active) {
                            let cfg = ConfigManager.getItemById(Relic_mainCfg, 1);
                            GlobalUtil.setSpriteIcon(this.node, cc.find('resetBtn/gh_dianchitubiao', resetNode), GlobalUtil.getIconById(cfg.repair_cost[0]));
                            cc.find('resetBtn/num', resetNode).getComponent(cc.Label).string = cfg.repair_cost[1] + '';
                        }
                    }
                    else {
                        blankPlaceNode.active = true;
                        let isBroken = (this.resp.helperCD & 1 << (idx - 1)) >= 1;
                        let fixBtn = cc.find('broken/fixBtn', blankPlaceNode);
                        let tip = cc.find('broken/tip', blankPlaceNode);
                        let fixBtnBg = cc.find('broken/zb_lanseanniu', blankPlaceNode);
                        broken.active = isBroken;
                        add.active = !isBroken && this.roleType == RelicRoleType.Owner;
                        lack.active = !isBroken && this.roleType !== RelicRoleType.Owner;
                        if (isBroken) {
                            fixBtn.active = this.roleType == RelicRoleType.Owner || this.roleType == RelicRoleType.SameGuild || this.roleType == RelicRoleType.Assist;
                            tip.active = !fixBtn.active;
                            fixBtnBg.active = fixBtn.active;
                            let cfg = ConfigManager.getItemById(Relic_mainCfg, 1);
                            GlobalUtil.setSpriteIcon(this.node, cc.find('gh_dianchitubiao', fixBtn), GlobalUtil.getIconById(cfg.repair_cost[0]));
                            cc.find('num', fixBtn).getComponent(cc.Label).string = cfg.repair_cost[1] + '';
                            // add.targetOff(this);
                        }
                        // else {
                        // add.on(cc.Node.EventType.TOUCH_END, () => {
                        //     //todo open assistView
                        // }, this);
                        // }
                        // (outTime-now)/rate = remainTime
                    }
                }
            }
        });
    }

    //底部按钮状态
    _updateBtnNode() {
        let exploreBtn, giveUpBtn, transBtn, atkBtn, assistLab, joinAssistBtn, othersLab;
        [exploreBtn, giveUpBtn, transBtn, atkBtn, assistLab, joinAssistBtn, othersLab] = this.btnNode.children;
        exploreBtn.active = this.roleType == RelicRoleType.None;
        giveUpBtn.active = this.roleType == RelicRoleType.Owner;
        transBtn.active = this.roleType == RelicRoleType.Owner;
        atkBtn.active = this.roleType == RelicRoleType.Atk;
        assistLab.active = this.roleType == RelicRoleType.Assist;
        othersLab.active = this.roleType == RelicRoleType.Others;
        joinAssistBtn.active = false;
        if (this.roleType == RelicRoleType.SameGuild) {
            if (this.resp && this.resp.defenders && this.resp.defenders.length - 1 < this.cityCfg.helper_num) {
                joinAssistBtn.active = true;
            }
            else {
                othersLab.active = true;
            }
        }

        //抢夺按钮
        if (atkBtn.active) {
            let cfg = ConfigManager.getItemById(Relic_mainCfg, 1);
            let clearCdNode = cc.find('clearCdBtn', atkBtn);
            let select = cc.find('selectNode/select', atkBtn);
            //clearNode
            GlobalUtil.setSpriteIcon(this.node, cc.find('gh_dianchitubiao', clearCdNode), GlobalUtil.getIconById(cfg.atk_cost[0]));
            cc.find('num', clearCdNode).getComponent(cc.Label).string = cfg.atk_cost[1] + '';
            //select
            select.active = GlobalUtil.getLocal('relic_clear_atk_cd', true) || false;
            //atkCD
            this._updateAktCDTime();
            this.schedule(this._updateAktCDTime, 1);
        }
        if (exploreBtn.active) {
            this._updateFreeLeftTime();
            this.schedule(this._updateFreeLeftTime, 1);
        }
    }

    //日志标题
    _updateRecordTitle() {
        if (this.mapType == 1 || this.cityState == RelicCityState.idle) {
            // this.recordTitle.active = false;
            let lab = cc.find('time', this.recordTitle);
            lab.active = false;
            return;
        }
        this.recordTitle.active = true;
        if (this.resp.contestTime > 0) {
            this._updateAtkLeftTime();
            this.schedule(this._updateAtkLeftTime, 1);
        }
        else {
            let lab = cc.find('time', this.recordTitle);
            lab.active = false;
        }
    }

    //日志Node RelicRecordCtrl 单独处理
    _initLog() {
        if (this.cityState == RelicCityState.idle) {
            this.recordTitle.active = this.recordNode.active = false;
            return;
        }
        this.recordTitle.active = this.recordNode.active = true;
        this.recordNode.getComponent(RelicRecordCtrl).init(this.mapType, this.cityId, this.resp.recordNum);
    }

    _onMapCityInfoChange(e) {
        let [mapType, cityId] = e.data;
        if (this.mapType == mapType && this.cityId == cityId) {
            this.req();
        }
    }

    //--------------------------------//
    //剩余探索时间
    _updateExplorTime() {
        let leftTimeNode = cc.find('state1/lefttime', this.pointInfoNode);
        if (!leftTimeNode.active) return;
        let bar = cc.find('progressNode/progress/bar', leftTimeNode);
        let lab = cc.find('progressNode/label', leftTimeNode).getComponent(cc.Label);
        let leftTime = this.resp.freezeTime > 0 ? this.resp.outputTime * 1000 : Math.max(0, Math.floor((this.resp.outputTime * 1000 - GlobalUtil.getServerTime()) * (this.resp.exploreRate / 100)));
        lab.string = TimerUtils.format4(leftTime / 1000);
        bar.width = Math.min(226, leftTime / (this.cityCfg.time * 1000) * 226);
        if (leftTime == 0) {
            //todo
            gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP21"));
            this.close();
        }
    }

    //抢夺CD
    _updateAktCDTime() {
        let atkBtn = this.btnNode.children[3];
        let cfg = ConfigManager.getItemById(Relic_mainCfg, 1);
        let timeLab = cc.find('atkTime', atkBtn).getComponent(cc.Label);
        let atkCd = Math.max(0, cfg.atk_cd * 1000 - (GlobalUtil.getServerTime() - this.resp.lastAtkTime * 1000));
        if (atkCd == 0) {
            timeLab.node.active = false;
            this.unschedule(this._updateAktCDTime);
        }
        else {
            timeLab.node.active = true;
            timeLab.string = `${TimerUtils.format3(atkCd / 1000)}${gdk.i18n.t("i18n:RELIC_TIP22")}`;
        }
    }

    //抢夺剩余时间
    _updateAtkLeftTime() {
        let cfg = ConfigManager.getItemById(Relic_mainCfg, 1);
        let lab = cc.find('time', this.recordTitle).getComponent(cc.Label);
        let leftTime = Math.max(0, Math.floor(cfg.atk_limit * 1000 - (GlobalUtil.getServerTime() - this.resp.contestTime * 1000)));
        if (leftTime == 0) {
            lab.node.active = false;
            this.unschedule(this._updateAtkLeftTime);
            //todo 重置耐久 协防状态
            this.resp.defenders.forEach((info, idx) => {
                info.hP = idx == 0 ? this.cityCfg.owner_hp : this.cityCfg.helper_hp;
            });
            this.resp.helperCD = 0;
            this._updateOwnerNode();
        }
        else {
            lab.node.active = true;
            lab.string = `${gdk.i18n.t("i18n:RELIC_TIP23")}${TimerUtils.format2(leftTime / 1000)}`;
        }
    }

    //冻结剩余时间
    _updateFreeLeftTime() {
        let cfg = ConfigManager.getItemById(Relic_mainCfg, 1);
        let bar = cc.find('progressNode/progress/bar', this.btnNode.children[0]);
        let lab = cc.find('progressNode/label', this.btnNode.children[0]).getComponent(cc.Label);
        let btnLab = cc.find('btn/lab', this.btnNode.children[0]).getComponent(cc.Label);
        if (this.resp.freezeTime <= 0) {
            btnLab.string = '开始探索';
            lab.node.parent.active = false;
            return;
        }
        let leftTime = Math.max(0, Math.floor(cfg.cache_time * 1000 - (GlobalUtil.getServerTime() - this.resp.freezeTime * 1000)));
        if (leftTime == 0) {
            btnLab.string = '开始探索';
            lab.node.parent.active = false;
            this.unschedule(this._updateFreeLeftTime);
            //重置冻结状态
            this.resp.freezeTime = 0;
            this.resp.outputTime = 0;
            this._updateInfoNode();
        }
        else {
            btnLab.string = '继续探索';
            lab.string = TimerUtils.format4(leftTime / 1000);
            bar.width = Math.min(226, leftTime / (cfg.cache_time * 1000) * 226);
        }
    }

    //-------红点--------//
    _updateRedpoint() {
        let str = this.relicModel.curExploreCity;
        if (str && str.length > 0) {
            let map = parseInt(str.split('-')[0]);
            let pointId = parseInt(str.split('-')[1]);
            if (this.mapType == map && this.cityId == pointId) {
                let req = new icmsg.SystemRedPointCancelReq();
                req.eventId = 51003;
                NetManager.send(req, null, this);
            }
        }
    }
}
