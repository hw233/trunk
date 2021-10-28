import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldUtils from '../footHold/FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import ServerModel from '../../../../common/models/ServerModel';
import SiegeModel from './SiegeModel';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { info } from 'console';
import { Siege_checkpointCfg, Siege_rankingCfg } from '../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-13 15:14:33
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/siege/SiegeMainGuildItemCtrl")
export default class SiegeMainGuildItemCtrl extends UiListItem {

    @property(cc.Label)
    rankLab: cc.Label = null;

    @property(cc.Node)
    rankIcon: cc.Node = null;

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    guildNameLab: cc.Label = null;

    @property(cc.Label)
    serverLab: cc.Label = null;

    @property(cc.Label)
    gateHp: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null;

    @property(cc.Label)
    precentLab: cc.Label = null;

    _info: icmsg.SiegeRankBrief

    get siegeModel() { return ModelManager.get(SiegeModel); }

    updateView() {
        this._info = this.data

        let index = this.curIndex + 1
        if (index <= 3) {
            this.rankIcon.active = true
            this.rankLab.node.active = false
            GlobalUtil.setSpriteIcon(this.node, this.rankIcon, FootHoldUtils.getTop3RankIconPath(index))
        } else {
            this.rankIcon.active = false
            this.rankLab.node.active = true
            this.rankLab.string = `${index}`
        }

        if (this._info.guildId > 0) {
            GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(this._info.guildBottom))
            GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(this._info.guildFrame))
            GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(this._info.guildIcon))
            this.guildNameLab.string = `${this._info.guildName}`
            let hp = this.siegeModel.gateTotalHP - ((this.siegeModel.curBossTotalHP * this.siegeModel.bossHpCheckDay) - (this._info.blood > this.siegeModel.curBossTotalHP * 7 ? this.siegeModel.curBossTotalHP * 7 : this._info.blood))
            this.gateHp.string = `${hp >= 0 ? hp : 0}`
            this.proBar.progress = hp / this.siegeModel.gateTotalHP
            this.precentLab.string = `${(hp / this.siegeModel.gateTotalHP * 100).toFixed(1)}%`
            this.serverLab.string = `[s${GlobalUtil.getSeverIdByGuildId(this._info.guildId)}]`
            this.serverLab.string += ModelManager.get(ServerModel).serverNameMap[Math.floor(this._info.guildId / 10000)]
        } else {
            this.guildNameLab.string = gdk.i18n.t("i18n:SIEGE_TIP12")
            this.serverLab.node.active = false
            this.gateHp.string = `${this.siegeModel.gateTotalHP}`
            this.proBar.progress = 1
            this.precentLab.string = `100%`
        }

        this.content.removeAllChildren();
        this._getRewardCfg().rank_rewards.forEach(item => {
            let slot = cc.instantiate(this.slotPrefab);
            let ctrl = slot.getComponent(UiSlotItem);
            slot.setScale(.8, .8);
            slot.parent = this.content;
            ctrl.updateItemInfo(item[0], item[1]);
            ctrl.itemInfo = {
                series: null,
                itemId: item[0],
                itemNum: item[1],
                type: BagUtils.getItemTypeById(item[0]),
                extInfo: null
            };
        });
    }

    _getRewardCfg() {
        let cfgs = ConfigManager.getItems(Siege_rankingCfg, { world_level: this.siegeModel.worldLevelIndex, server: this.siegeModel.serverNum })
        if (cfgs.length == 0) {
            cfgs = ConfigManager.getItems(Siege_rankingCfg, { world_level: this.siegeModel.worldLevelIndex, server: 1 })
        }
        for (let i = 0; i < cfgs.length; i++) {
            let curCfg = cfgs[i]
            if (this.curIndex + 1 >= curCfg.rank[0] && this.curIndex + 1 <= curCfg.rank[1]) {
                return curCfg
            }
        }
        return cfgs[cfgs.length - 1]
    }

    clickFunc() {
        gdk.panel.setArgs(PanelId.GuildJoin, this._info.guildId, true)
        gdk.panel.open(PanelId.GuildJoin)
    }
}