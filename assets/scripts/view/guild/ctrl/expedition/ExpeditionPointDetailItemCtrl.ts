import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionModel, { ExpeditionPointInfo } from './ExpeditionModel';
import ExpeditionUtils from './ExpeditionUtils';
import FlipCardsTaskItemCtrl from '../../../act/ctrl/flipCards/FlipCardsTaskItemCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import VipFlagCtrl from '../../../../common/widgets/VipFlagCtrl';
import {
    Copy_stageCfg,
    Expedition_globalCfg,
    Expedition_mapCfg,
    Expedition_stageCfg
    } from '../../../../a/config';
import { GuildMemberLocal } from '../../model/GuildModel';

/** 
 * @Description: 
 * @Author: yaozu.hu
 * @Date: 2020-12-23 10:28:06
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-28 10:30:41
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionPointDetailItemCtrl")
export default class ExpeditionPointDetailItemCtrl extends UiListItem {

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

    _copyStage: Copy_stageCfg
    _epStage: Expedition_stageCfg
    _expeditionStage: icmsg.ExpeditionStage

    get expeditionModel(): ExpeditionModel { return ModelManager.get(ExpeditionModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    updateView() {
        this._epStage = ConfigManager.getItemByField(Expedition_stageCfg, "id", this.data, { type: this.expeditionModel.activityType })
        this._copyStage = ConfigManager.getItemById(Copy_stageCfg, this._epStage.stage_id)
        this.powerLab.string = `${this._epStage.power}`

        this._expeditionStage = this.expeditionModel.expeditionStages[this.curIndex + 1]

        if (this._expeditionStage && this._expeditionStage.playerId > 0) {
            if (this._expeditionStage.heroIds.length > 0) {
                this.btnFight.active = false
                this.fighting.active = false
                this.killLab.node.active = true
                this.killState.active = true
                this._updateMember()
            } else {
                let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
                if (curTime > this._expeditionStage.fightTime + 300) {
                    this.btnFight.active = true
                    this.fighting.active = false
                    this.killState.active = false
                    this.vipFlag.parent.active = false
                } else {
                    this.killLab.node.active = false
                    this.killState.active = false
                    this.btnFight.active = false
                    this.fighting.active = true
                    let ani = this.fighting.getChildByName("ani").getComponent(cc.Animation)
                    ani.play("expeditionFighting")
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
    }

    openFightFunc() {

        if (!ExpeditionUtils.isMapOpen(this.expeditionModel.curMapCfg.map_id)) {
            let preCfg = ConfigManager.getItemByField(Expedition_mapCfg, "map_id", this.expeditionModel.curMapCfg.map_id - 1)
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t('i18n:EXPEDITION_TIP16'), preCfg.name))//`通过${preCfg.name}后才可进行挑战`
            return
        }

        if (this._checkCanFight(this.expeditionModel.curPointInfo.pos.x, this.expeditionModel.curPointInfo.pos.y)) {
            this.expeditionModel.curStage = this._epStage
            gdk.panel.setArgs(PanelId.ExpeditionFight, this._copyStage, this.curIndex + 1)
            gdk.panel.open(PanelId.ExpeditionFight)
        } else {
            gdk.gui.showMessage(gdk.i18n.t('i18n:EXPEDITION_TIP17'))
        }

    }

    _updateMember() {
        let guildMember: GuildMemberLocal = GuildUtils.getMemberInfo(this._expeditionStage.playerId)
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
                    if (element.id == this._expeditionStage.playerId) {
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

    openPlayerView() {
        if (this._expeditionStage.playerId > 0) {
            gdk.panel.setArgs(PanelId.MainSet, this._expeditionStage.playerId);
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