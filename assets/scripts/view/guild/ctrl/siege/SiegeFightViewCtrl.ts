import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildModel from '../../model/GuildModel';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import PveRes from '../../../pve/const/PveRes';
import RoleModel from '../../../../common/models/RoleModel';
import SiegeModel from './SiegeModel';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { AskInfoType } from '../../../../common/widgets/AskPanel';
import {
    Copy_stageCfg,
    Siege_appearanceCfg,
    Siege_globalCfg,
    SiegeCfg
    } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-02-02 19:07:12
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/siege/SiegeFightViewCtrl")
export default class SiegeFightViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    numLab: cc.Label = null;

    @property(cc.ProgressBar)
    hpBar: cc.ProgressBar = null;

    @property(cc.Label)
    hpLab: cc.Label = null;

    @property(cc.Node)
    groupIcon: cc.Node = null;

    @property(cc.RichText)
    recommendLab: cc.RichText = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    btnAdd: cc.Node = null;

    @property(sp.Skeleton)
    bSpine: sp.Skeleton = null;

    @property(sp.Skeleton)
    sSpine: sp.Skeleton[] = [];

    get siegeModel() { return ModelManager.get(SiegeModel); }
    get guildModel() { return ModelManager.get(GuildModel); }

    _curSiegeCfg: SiegeCfg

    onEnable() {

        if (!this.guildModel.guildDetail) {
            let msg = new icmsg.GuildDetailReq()
            msg.guildId = ModelManager.get(RoleModel).guildId
            NetManager.send(msg)
        }

        this._curSiegeCfg = this.siegeModel.curSiegeCfg
        let curPointCfg = this.siegeModel.curPointCfg

        let hp = this.siegeModel.curBossTotalHP - this.siegeModel.todayBlood
        hp = hp >= 0 ? hp : 0
        this.hpBar.progress = hp / this.siegeModel.curBossTotalHP
        this.hpLab.string = `${hp}`

        this.updateFightNum()

        if (this._curSiegeCfg.camp_type && this._curSiegeCfg.camp_type.length > 0) {
            GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `view/guild/texture/icon/${this._curSiegeCfg.camp_icon}`);
            this.recommendLab.string = `${this._curSiegeCfg.bonus_des}`
        } else {
            this.groupIcon.active = false
            this.recommendLab.string = ``
        }

        this.content.removeAllChildren();
        this._curSiegeCfg.rewards_show.forEach(id => {
            let slot = cc.instantiate(this.slotPrefab);
            let ctrl = slot.getComponent(UiSlotItem);
            slot.parent = this.content;
            ctrl.updateItemInfo(id);
            ctrl.itemInfo = {
                series: null,
                itemId: id,
                itemNum: 1,
                type: BagUtils.getItemTypeById(id),
                extInfo: null
            };
        });


        this._initMonsterType()
    }


    @gdk.binding("siegeModel.buyTimes")
    @gdk.binding("siegeModel.enterTimes")
    updateFightNum() {
        this.numLab.string = StringUtils.format(gdk.i18n.t("i18n:SIEGE_TIP3"), this.siegeModel.canFightNum)//`今日剩余挑战次数：${this.siegeModel.canFightNum}`
        this.btnAdd.active = this.siegeModel.canBuyNum > 0

    }

    onAddFunc() {
        let challengeCfg = ConfigManager.getItemById(Siege_globalCfg, "challenge").value
        let itemName = BagUtils.getConfigById(challengeCfg[1]).name
        let info: AskInfoType = {
            title: "",
            sureCb: () => {
                let msg = new icmsg.SiegeBuyReq()
                NetManager.send(msg, (data: icmsg.SiegeBuyRsp) => {
                    gdk.gui.showMessage(gdk.i18n.t("i18n:SIEGE_TIP11"))
                    this.siegeModel.enterTimes = data.enterTimes
                    this.siegeModel.buyTimes = data.buyTimes
                }, this)
            },
            descText: StringUtils.format(gdk.i18n.t("i18n:SIEGE_TIP4"), challengeCfg[2], itemName, this.siegeModel.canBuyNum),//`是否花费${challengeCfg[2]}${itemName}购买1次挑战次数？\n今日还可购买${this.siegeModel.canBuyNum}次`,
            thisArg: this,
        }
        GlobalUtil.openAskPanel(info)
    }

    onFightFunc() {
        if (!JumpUtils.ifSysOpen(2870, true)) {
            return
        }

        if (this.siegeModel.canFightNum <= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:SIEGE_TIP5"))
            return
        }
        gdk.panel.open(PanelId.SiegeSetUpHeroSelector)
    }


    onLogFunc() {
        gdk.panel.setArgs(PanelId.GuildLog, 6)
        gdk.panel.open(PanelId.GuildLog)
    }

    onMainFunc() {
        JumpUtils.openPanel({
            panelId: PanelId.SiegeMainView,
            currId: this.node
        })
    }


    _initMonsterType() {
        let weekDay = this.siegeModel.weekDay
        let cfgId = 1
        let hpPercent = this.siegeModel.curBossHpPercent
        let cfgs = ConfigManager.getItems(Siege_appearanceCfg)
        for (let i = 0; i < cfgs.length; i++) {
            let interval = cfgs[i].interval
            if (hpPercent >= interval[0] && hpPercent <= interval[1]) {
                cfgId = cfgs[i].id
                break
            }
        }
        let cfg = ConfigManager.getItemById(Siege_appearanceCfg, cfgId)
        let resData = cfg[`days${weekDay}`]
        let bSpinePath = StringUtils.format(PveRes.PVE_MONSTER_RES, resData[0][0])
        GlobalUtil.setSpineData(this.node, this.bSpine, bSpinePath, true, "walk_s", true, false)
        this.bSpine.node.scale = resData[0][3] / 100

        let sSpinePaht = StringUtils.format(PveRes.PVE_MONSTER_RES, resData[1][0])
        let showNum = resData[1][1]
        for (let i = 0; i < this.sSpine.length; i++) {
            GlobalUtil.setSpineData(this.node, this.sSpine[i], sSpinePaht, true, "walk_s", true, false)
            this.sSpine[i].node.scale = resData[1][3] / 100
            if (i < showNum) {
                this.sSpine[i].node.active = true
            } else {
                this.sSpine[i].node.active = false
            }
        }
    }

}