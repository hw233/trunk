import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionModel, { ExpeditionPointInfo } from './ExpeditionModel';
import ExpeditionProduceItemCtrl from './ExpeditionProduceItemCtrl';
import ExpeditionUtils from './ExpeditionUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import VipFlagCtrl from '../../../../common/widgets/VipFlagCtrl';
import {
    Copy_stageCfg,
    Expedition_forcesCfg,
    Expedition_globalCfg,
    Expedition_mapCfg,
    Expedition_pointCfg,
    Expedition_stageCfg,
    MonsterCfg
    } from '../../../../a/config';
import { GuildMemberLocal } from '../../model/GuildModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-28 10:30:29
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionPointDetailCtrl")
export default class ExpeditionPointDetailCtrl extends gdk.BasePanel {

    @property(cc.Label)
    pointName: cc.Label = null;

    @property(cc.Node)
    monsters: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    detailItemPre: cc.Prefab = null;

    @property(cc.Node)
    produceLayout: cc.Node = null;

    @property(cc.Prefab)
    produceItem: cc.Prefab = null;

    @property(cc.Node)
    pointIcon: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;


    @property(cc.Label)
    powerLab: cc.Label = null

    @property(cc.Label)
    killLab: cc.Label = null

    @property(cc.Node)
    vipFlag: cc.Node = null

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Node)
    postionIcon: cc.Node = null

    @property(cc.Node)
    rewardContent: cc.Node = null;

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null;

    @property(cc.Node)
    killState: cc.Node = null;

    @property(cc.Node)
    btnFight: cc.Node = null;

    @property(cc.Node)
    fighting: cc.Node = null;

    @property(cc.Node)
    btnGiveup: cc.Node = null;

    @property(cc.Label)
    stageLab: cc.Label = null;

    list: ListView = null
    _pointInfo: ExpeditionPointInfo
    _pointCfg: Expedition_pointCfg

    _copyStage: Copy_stageCfg
    _epStage: Expedition_stageCfg


    get expeditionModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        this._pointInfo = this.args[0]
        this._pointCfg = this._pointInfo.cfg
        this.expeditionModel.curPointInfo = this._pointInfo
        NetManager.on(icmsg.ExpeditionPointDetailRsp.MsgType, this._onExpeditionPointDetailRsp, this)
        if (ExpeditionUtils.isMapOpen(this._pointCfg.map_id)) {
            let msg = new icmsg.ExpeditionPointDetailReq()
            msg.mapId = this._pointCfg.map_id
            msg.pos = this._pointInfo.pos
            NetManager.send(msg)
        } else {
            this.expeditionModel.expeditionStages = []
        }
        this.initMonster()
        this._initOutput()
        this.updateViewInfo()
    }

    initMonster() {
        for (let i = 0; i < this.monsters.childrenCount; i++) {
            let spine = this.monsters.children[i].getComponent(sp.Skeleton)
            if (this._pointCfg.monster_skin[i]) {
                //设置怪物模型
                let m_cfg = ConfigManager.getItemById(MonsterCfg, this._pointCfg.monster_skin[i][0])
                let url: string = StringUtils.format("spine/monster/{0}/{0}", m_cfg.skin);
                GlobalUtil.setSpineData(spine.node, spine, url, true, 'stand_s', true);
                spine.node.scale = m_cfg.size * (this._pointCfg.monster_skin[i][1] / 100)
                spine.node.opacity = 255;
                spine.node.on(cc.Node.EventType.TOUCH_END, () => {
                    gdk.panel.setArgs(PanelId.ExpeditionMonsterTip, m_cfg)
                    gdk.panel.open(PanelId.ExpeditionMonsterTip)
                }, this);
            }
        }
    }

    _initOutput() {
        let production_time = ConfigManager.getItemById(Expedition_globalCfg, "production_time").value[0]
        let times = 3600 / production_time

        this.produceLayout.removeAllChildren()
        let rewards = this._pointCfg.output_reward
        rewards.forEach(element => {
            let item = cc.instantiate(this.produceItem)
            this.produceLayout.addChild(item)
            let ctrl = item.getComponent(ExpeditionProduceItemCtrl)
            ctrl.updateViewInfo(element[0], `${element[1] * times}${gdk.i18n.t("i18n:EXPEDITION_TIP13")}`)
        });
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.detailItemPre,
            cb_host: this,
            column: 1,
            gap_y: 5,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    _onExpeditionPointDetailRsp(data: icmsg.ExpeditionPointDetailRsp) {
        this.expeditionModel.expeditionStages = data.stages
        this.updateViewInfo()
    }

    updateViewInfo() {
        this.pointName.string = `${this._pointCfg.name}`

        if (this._pointCfg.skin_type == 1) {
            GlobalUtil.setSpriteIcon(this.node, this.pointIcon, `view/guild/texture/icon/${this._pointCfg.point_skin[0]}`)
            this.pointIcon.scale = this._pointCfg.point_skin[1] / 100
        } else {
            let url: string = StringUtils.format("spine/monster/{0}/{0}", this._pointCfg.point_skin[0]);
            GlobalUtil.setSpineData(this.spine.node, this.spine, url, true, 'stand_s', true);
            this.spine.node.scale = this._pointCfg.point_skin[1] / 100
            this.spine.node.opacity = 255;
        }

        if (this._pointInfo.info) {
            if (this._pointInfo.info.progress == this._pointCfg.stage_id2.length + 1) {
                this.spine.node.active = false
                let curCfg = ConfigManager.getItemByField(Expedition_forcesCfg, 'id', this.expeditionModel.armyLv, { type: this.expeditionModel.activityType });
                GlobalUtil.setSpriteIcon(this.node, this.pointIcon, `view/guild/texture/expedition/army/${curCfg.skin}`);
            } else {
                if (this._pointInfo.info.hasOccupied) {
                    //被占领过
                    if (this._pointInfo.cfg.occupation_skin && this._pointInfo.cfg.occupation_skin.length) {
                        this.spine.node.active = false
                        GlobalUtil.setSpriteIcon(this.node, this.pointIcon, `view/guild/texture/icon/${this._pointInfo.cfg.occupation_skin[0]}`)
                        this.pointIcon.scale = this._pointInfo.cfg.occupation_skin[1] / 100
                    } else {
                        if (this._pointInfo.cfg.skin_type == 1) {
                            GlobalUtil.setSpriteIcon(this.node, this.pointIcon, `view/guild/texture/icon/${this._pointInfo.cfg.point_skin[0]}`)
                            this.pointIcon.scale = this._pointInfo.cfg.point_skin[1] / 100
                        }
                    }
                }
            }
        }

        //首领
        this._updateMain()
        //守军
        this._initListView()
        this.list.set_data(this._pointCfg.stage_id2)
    }

    //更新首领信息
    _updateMain() {
        this._epStage = ConfigManager.getItemByField(Expedition_stageCfg, "id", this._pointCfg.stage_id1, { type: this.expeditionModel.activityType })
        this._copyStage = ConfigManager.getItemById(Copy_stageCfg, this._epStage.stage_id)
        this.powerLab.string = `${this._epStage.power}`
        this.btnGiveup.active = false
        this.killState.active = false
        let expeditionStage: icmsg.ExpeditionStage = this.expeditionModel.expeditionStages[0]

        if (expeditionStage && expeditionStage.playerId > 0) {
            if (expeditionStage.heroIds.length > 0) {
                this.btnFight.active = false
                this.fighting.active = false
                this.killLab.node.active = true
                this.killState.active = true
                if (this.roleModel.id == expeditionStage.playerId) {
                    this.btnGiveup.active = true
                }
                this._updateMember()
            } else {
                let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
                if (curTime > expeditionStage.fightTime + 300) {
                    this.btnFight.active = true
                    this.fighting.active = false
                    this.vipFlag.parent.active = false
                } else {
                    this.killLab.node.active = false
                    this.killState.active = false
                    this.btnFight.active = false
                    this.fighting.active = true
                    let ani = this.fighting.getChildByName("ani").getComponent(cc.Animation)
                    ani.play("expeditionFighting")
                    if (this.roleModel.id == expeditionStage.playerId) {
                        this.fighting.active = false
                        this.btnFight.active = true
                    }
                    this._updateMember()
                }
            }

        } else {
            this.btnFight.active = true
            this.fighting.active = false
            this.vipFlag.parent.active = false
        }

        this.rewardContent.removeAllChildren();

        let rewards = []
        this._epStage.reward && this._epStage.reward.forEach(element => {
            rewards.push(element)
        });
        let itemId = ConfigManager.getItemById(Expedition_globalCfg, "value_item").value[0]
        rewards.push([itemId, this._epStage.value])
        rewards.forEach(item => {
            let slot = cc.instantiate(this.rewardItem);
            let ctrl = slot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(item[0], item[1]);
            slot.scale = 0.5
            slot.parent = this.rewardContent;

            if (this.killState.active) {
                slot.opacity = 180
                let icon = new cc.Node()
                icon.angle = 30
                icon.addComponent(cc.Sprite)
                icon.x = 0
                icon.y = 0
                slot.addChild(icon)
                GlobalUtil.setSpriteIcon(slot, icon, `view/guild/texture/expedition/sub_lingqu`)
            }

            ctrl.itemInfo = {
                series: null,
                itemId: item[0],
                itemNum: item[1],
                type: BagUtils.getItemTypeById(item[0]),
                extInfo: null
            };
        });

        let mainNum = 1
        if (expeditionStage) {
            mainNum = expeditionStage.heroIds.length == 0 ? 1 : 0
        }
        this.stageLab.string = StringUtils.format(gdk.i18n.t('i18n:EXPEDITION_TIP14'), mainNum, this._getCanFightNum())//`剩余守军：首领${mainNum} 守军${this._getCanFightNum()}`
    }

    _updateMember() {
        let expeditionStage: icmsg.ExpeditionStage = this.expeditionModel.expeditionStages[0]
        let guildMember: GuildMemberLocal = GuildUtils.getMemberInfo(expeditionStage.playerId)
        if (guildMember) {
            this.vipFlag.parent.active = true
            let path = GuildUtils.getMemberTitlePath(guildMember.position)
            GlobalUtil.setSpriteIcon(this.node, this.postionIcon, `view/guild/texture/common/${path}`)
            let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
            vipCtrl.updateVipLv(guildMember.vipLv)
            this.nameLab.string = `${guildMember.name}`
        } else {
            let msg = new icmsg.GuildDetailReq()
            msg.guildId = this.roleModel.guildId
            NetManager.send(msg, (data: icmsg.GuildDetailRsp) => {
                let members = data.members
                members.forEach(element => {
                    if (element.id == expeditionStage.playerId) {
                        this.vipFlag.parent.active = true
                        let path = GuildUtils.getMemberTitlePath(element.title)
                        GlobalUtil.setSpriteIcon(this.node, this.postionIcon, `view/guild/texture/common/${path}`)
                        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
                        vipCtrl.updateVipLv(GlobalUtil.getVipLv(element.vipExp))
                        this.nameLab.string = `${element.name}`
                    }
                });
            })
        }
    }

    _getCanFightNum() {
        let stages = this.expeditionModel.expeditionStages
        let count = this._pointCfg.stage_id2.length
        for (let i = 0; i < stages.length; i++) {
            if (i != 0) {
                if (stages[i].heroIds.length > 0) {
                    count -= 1
                }
            }
        }
        return count
    }

    openFightFunc() {
        let point_limit = ConfigManager.getItemById(Expedition_globalCfg, "point_limit").value[0]
        let forcesCfg = ConfigManager.getItemByField(Expedition_forcesCfg, 'id', this.expeditionModel.armyLv, { type: this.expeditionModel.activityType });
        if (this.expeditionModel.occupyPointNum >= point_limit + forcesCfg.privilege0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:EXPEDITION_TIP15"))
            return
        }
        if (!ExpeditionUtils.isMapOpen(this.expeditionModel.curMapCfg.map_id)) {
            let preCfg = ConfigManager.getItemByField(Expedition_mapCfg, "map_id", this.expeditionModel.curMapCfg.map_id - 1)
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t('i18n:EXPEDITION_TIP16'), preCfg.name))//`通过${preCfg.name}后才可进行挑战`
            return
        }

        if (this._checkCanFight(this._pointInfo.pos.x, this._pointInfo.pos.y)) {
            this.expeditionModel.curStage = this._epStage
            gdk.panel.setArgs(PanelId.ExpeditionFight, this._copyStage, 0)
            gdk.panel.open(PanelId.ExpeditionFight)
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:EXPEDITION_TIP17"))
        }
    }

    onGiveupFunc() {
        let msg = new icmsg.ExpeditionGiveUpReq()
        msg.mapId = this._pointCfg.map_id
        msg.pos = this._pointInfo.pos
        NetManager.send(msg, (data: icmsg.ExpeditionGiveUpRsp) => {
            if (this._pointInfo.info && this._pointInfo.info.progress == this._pointInfo.cfg.stage_id2.length + 1) {
                this.expeditionModel.occupyPointNum = this.expeditionModel.occupyPointNum - 1
            }
            gdk.panel.hide(PanelId.ExpeditionPointDetail)
            ExpeditionUtils.updatePointInfo(data.point)
        })
    }


    openRewardFunc() {
        gdk.panel.setArgs(PanelId.ExpeditionPointReward, this._pointCfg)
        gdk.panel.open(PanelId.ExpeditionPointReward)
    }


    openLogFunc() {
        gdk.panel.open(PanelId.ExpeditionPointLog)
    }

    openPlayerView() {
        let expeditionStage: icmsg.ExpeditionStage = this.expeditionModel.expeditionStages[0]
        if (expeditionStage.playerId > 0) {
            gdk.panel.setArgs(PanelId.MainSet, expeditionStage.playerId);
            gdk.panel.open(PanelId.MainSet)
        }
    }


    _checkCanFight(x, y) {
        if (this.expeditionModel.isTest) {
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
        let pointMap = this.expeditionModel.pointMap
        let pInfo: ExpeditionPointInfo = pointMap[`${pos.x}-${pos.y}`]
        if (pInfo && ((pInfo.info && pInfo.info.progress == pInfo.cfg.stage_id2.length + 1) || pInfo.type == 0)) {
            return true
        }
        return false
    }
}