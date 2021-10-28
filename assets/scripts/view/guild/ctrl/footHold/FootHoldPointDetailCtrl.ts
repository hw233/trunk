import ConfigManager from '../../../../common/managers/ConfigManager';
import FHProduceItem2Ctrl from './FHProduceItem2Ctrl';
import FootHoldModel, { FhMapType, FhPointInfo } from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import {
    Copy_hardcoreCfg,
    Copy_stageCfg,
    Foothold_bonusCfg,
    Foothold_globalCfg,
    Foothold_pointCfg,
    Foothold_world_levelCfg,
    MonsterCfg,
    Pve_bornCfg,
    Pve_mainCfg,
    TipsCfg
    } from '../../../../a/config';
import { FootHoldEventId } from '../../enum/FootHoldEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FootHoldPointDetailCtrl")
export default class FootHoldPointDetailCtrl extends gdk.BasePanel {

    @property(cc.Label)
    monsterLab: cc.Label = null

    @property(cc.Node)
    tip0Node: cc.Node = null

    @property(cc.Label)
    tip0Lab: cc.Label = null

    @property(cc.Node)
    tip1Node: cc.Node = null

    @property(cc.Node)
    tip4Node: cc.Node = null

    @property(cc.Node)
    tower1Node: cc.Node = null

    @property(cc.Node)
    tower2Node: cc.Node = null

    @property(cc.Node)
    produceItems: cc.Node[] = []

    @property(cc.Label)
    tip1Lab: cc.Label = null

    @property(cc.Label)
    tip2Lab: cc.Label = null

    @property(cc.ProgressBar)
    tip2ProBar: cc.ProgressBar = null

    @property(cc.Node)
    finishTip: cc.Node = null

    @property(cc.Node)
    tip3Node: cc.Node = null

    @property(cc.Label)
    tip3Lab: cc.Label = null

    @property(cc.Label)
    energyLab: cc.Label = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    detailItem: cc.Prefab = null

    @property(cc.Node)
    btnFight: cc.Node = null

    @property(cc.Node)
    btnMark: cc.Node = null

    @property(cc.Node)
    btnGet: cc.Node = null

    @property(cc.Node)
    btnAdd: cc.Node = null

    @property(cc.Node)
    title1: cc.Node = null

    @property(cc.Node)
    title2: cc.Node = null

    @property(cc.Label)
    title3: cc.Label = null

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    list: ListView = null;

    _pointInfo: FhPointInfo
    _pointCfg: Foothold_pointCfg
    _stageCfg: Copy_stageCfg
    _detailInfo: icmsg.FootholdPointDetailRsp
    _totalHp: number

    onEnable() {

        let arg = this.args
        this._pointInfo = arg[0]
        this._stageCfg = arg[1]

        this._detailInfo = this.footHoldModel.pointDetailInfo
        this._updateViewData()
        gdk.e.on(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST, this._updateViewData, this);
    }

    onDisable() {

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
            gap_y: 5,
            direction: ListViewDir.Vertical,
        })
    }

    _updateViewData() {
        this._initListView()
        let worldLvCfg = ConfigManager.getItemByField(Foothold_world_levelCfg, "index", this.footHoldModel.worldLevelIndex)
        this._pointCfg = ConfigManager.getItemByField(Foothold_pointCfg, "map_id", this.footHoldModel.curMapData.mapId, { world_level: worldLvCfg.index, point_type: this._pointInfo.type, map_type: this.footHoldModel.curMapData.mapType })
        this.tip1Lab.string = `${this._pointCfg.score}`
        this.monsterLab.string = `${gdk.i18n.t("i18n:FOOTHOLD_TIP31")} ${worldLvCfg.monster_level}`
        this.energyLab.string = `${this._detailInfo.needEnergy}`
        let bossId = this._detailInfo.bossId
        let bossHp = this._detailInfo.bossHp

        this._updateIncome()

        let cfg = ConfigManager.getItemById(Pve_mainCfg, this._stageCfg.born)
        let id = ConfigManager.getItemById(Pve_bornCfg, cfg.monster_born_cfg[0]).enemy_id

        if (bossId == 0) {
            this._totalHp = ConfigManager.getItemById(MonsterCfg, id).hp
            bossHp = this._totalHp
            this._detailInfo.bossId = id
            this._detailInfo.bossHp = bossHp
        } else {
            if (bossId != id && bossId != -1) {
                this._detailInfo.bossId = id
                bossId = id
            }
            if (bossId != -1) {
                this._totalHp = ConfigManager.getItemById(MonsterCfg, bossId).hp
            } else {
                this._totalHp = ConfigManager.getItemById(MonsterCfg, id).hp
            }
        }
        this.footHoldModel.curBossHp = this._totalHp
        if (bossId >= 0) {
            this.tip2Lab.node.parent.active = true
            this.finishTip.active = false
            this.tip2Lab.string = `${bossHp}/${this._totalHp}`
            this.tip2ProBar.progress = bossHp / this._totalHp

            this.btnFight.active = true
            this.btnMark.active = true
            this.btnAdd.active = true
            this.btnGet.active = false

            if (this._pointCfg.map_type == FhMapType.Base) {
                this.btnMark.active = false
                this.btnFight.x = 0
            }

            this.tip3Node.active = false
            if (this._pointCfg.time_limit && this._pointCfg.time_limit > 0) {
                this.tip3Node.active = true
                //倒数计时
                this._updateTime()
                this.schedule(this._updateTime, 1)
            }

            let markLab = this.btnMark.getChildByName("txt").getComponent(cc.Label)
            if (FootHoldUtils.isPlayerCanMark) {
                let tag = ConfigManager.getItemById(Foothold_globalCfg, "tag").value[0]
                markLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP79") + `(${FootHoldUtils.getMarkPointsNum()}/${tag})`//`标记设置`
            } else {
                markLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP80")//`标记查看`
                if (!this.footHoldModel.markFlagPoints[`${this._pointInfo.pos.x}-${this._pointInfo.pos.y}`]) {
                    GlobalUtil.setAllNodeGray(this.btnMark, 1)
                }
            }
        } else {
            this.tip2Lab.node.parent.active = false
            this.finishTip.active = true
            this.tip3Node.active = false

            this.btnFight.active = false
            this.btnMark.active = false
            this.btnAdd.active = false
            if (this._detailInfo.scoreRewarded) {
                this.btnGet.active = false
            } else {
                this.btnGet.active = true
                if (this._pointInfo.fhPoint.playerId != this.roleModel.id && !FootHoldUtils.isPlayerDmgPoint(this.roleModel.id, this._detailInfo)) {
                    this.btnGet.active = false
                }
            }
        }

        if (this.footHoldModel.curMapData.mapType == FhMapType.Base) {
            this.tip1Node.active = false
            this.title1.active = true
            this.title2.active = false
        } else {
            this.title1.active = false
            this.title2.active = true

            let pointLv = this.title2.getChildByName("pointLv").getComponent(cc.Label)
            let pointType = this.title2.getChildByName("pointType")
            let path = ""
            if (this.footHoldModel.cityAllPoints[`${this._pointInfo.pos.x}-${this._pointInfo.pos.y}`]) {
                let cityCfg = FootHoldUtils.getCityCfg(this._pointInfo.pos.x, this._pointInfo.pos.y)
                if (cityCfg) {
                    this.tip0Node.active = true
                    this.tip0Lab.string = `${cityCfg.score}`
                    pointLv.string = `${cityCfg.level}`
                    path = 'gh_chchengchibiaoti'
                }
            } else {
                this.tip0Node.active = false
                pointLv.string = `${this._pointInfo.type}`
                path = 'gh_judianbiaoti'
            }
            if (path) {
                GlobalUtil.setSpriteIcon(this.node, pointType, `view/guild/texture/footHold/${path}`)
            }

            if (this.footHoldModel.isGuessMode) {
                this.btnFight.active = false
                this.btnMark.active = false
                this.btnAdd.active = false
            }

        }


        //辐射塔类型显示
        if (this._pointInfo.bonusType == 0) {
            this.tip1Node.active = false
            this.tip4Node.active = false

            this.title1.active = false
            this.title2.active = false
            this.title3.node.active = true


            this.tower1Node.active = true
            this.tower2Node.active = true

            let tipCfg = ConfigManager.getItemById(TipsCfg, this._getTipId())
            this.title3.string = `${tipCfg.title1}`
            cc.find("lab", this.tower1Node).getComponent(cc.RichText).string = `${gdk.i18n.t("i18n:FOOTHOLD_TIP32")}<color=#FFEA00>${tipCfg.desc21}</c>`

            let str = ""
            let bonusCfg = ConfigManager.getItemByField(Foothold_bonusCfg, "map_type", this.footHoldModel.curMapData.mapType, { world_level: this.footHoldModel.worldLevelIndex })
            if (FootHoldUtils.getBuffTowerType(this._detailInfo.pos.x, this._detailInfo.pos.y) == 1) {
                let hardcoreCfg1 = ConfigManager.getItemById(Copy_hardcoreCfg, bonusCfg.bonus_attribute1[0])
                str = hardcoreCfg1.dec
            } else if (FootHoldUtils.getBuffTowerType(this._detailInfo.pos.x, this._detailInfo.pos.y) == 2) {
                let hardcoreCfg2 = ConfigManager.getItemById(Copy_hardcoreCfg, bonusCfg.bonus_attribute[0])
                str = hardcoreCfg2.dec
            } else if (FootHoldUtils.getBuffTowerType(this._detailInfo.pos.x, this._detailInfo.pos.y) == 3) {
                let hardcoreCfg3 = ConfigManager.getItemById(Copy_hardcoreCfg, bonusCfg.bonus_attenuation[0])
                str = hardcoreCfg3.dec
            }
            cc.find("lab", this.tower2Node).getComponent(cc.RichText).string = str
        }


        this.list.set_data(this._getDmgList())
    }

    _getTipId() {
        let type = FootHoldUtils.getBuffTowerType(this._detailInfo.pos.x, this._detailInfo.pos.y)
        let tipId = 39
        switch (type) {
            case 1:
                tipId = 44
                break
            case 2:
                tipId = 40
                break
            case 3:
                tipId = 41
                break
        }
        return tipId
    }

    _updateIncome() {
        if (this._pointCfg.map_type == FhMapType.Base) {
            this.tip4Node.active = false
            return
        }
        let goods: icmsg.GoodsInfo[] = []
        let good = new icmsg.GoodsInfo()
        good.typeId = FootHoldUtils.BaseExpId
        good.num = this._pointCfg.base_exp
        goods.push(good)
        for (let j = 0; j < this._pointCfg.output_reward.length; j++) {
            let good = new icmsg.GoodsInfo()
            good.typeId = this._pointCfg.output_reward[j][0]
            good.num = this._pointCfg.output_reward[j][1]
            goods.push(good)
        }
        for (let i = 0; i < this.produceItems.length; i++) {
            this.produceItems[i].active = false
            if (goods[i]) {
                if (goods[i].num) {
                    this.produceItems[i].active = true
                    let ctrl = this.produceItems[i].getComponent(FHProduceItem2Ctrl)
                    ctrl.updateViewInfo(goods[i].typeId, goods[i].num, false)
                }
            }
        }
    }

    _updateTime() {
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let endTime = this._detailInfo.resetTime || 0
        let leftTime = endTime - curTime
        if (leftTime <= 0) {
            this.unschedule(this._updateTime)
            this.tip3Lab.string = `${this._pointCfg.time_limit / 60}${gdk.i18n.t("i18n:FOOTHOLD_TIP33")}`
        } else {
            this.tip3Lab.string = `${TimerUtils.format1(leftTime)}${gdk.i18n.t("i18n:FOOTHOLD_TIP34")}`
        }
    }

    getRewardFunc() {
        let msg = new icmsg.FootholdPointScoreReq()
        msg.warId = this.footHoldModel.curMapData.warId
        msg.posList = [this._detailInfo.pos]
        NetManager.send(msg, (data: icmsg.FootholdPointScoreRsp) => {
            GlobalUtil.openRewadrView(data.list)
            this.btnGet.active = false
            this._detailInfo.scoreRewarded = true
            FootHoldUtils.deletePoint(this._detailInfo.pos.x, this._detailInfo.pos.y)
            //更新红点状态
            gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)
        })
    }

    fightFunc() {
        if (!this._stageCfg) {
            return
        }

        if (this.footHoldModel.fightPoint && !FootHoldUtils.isSameFightFootHold(this._pointInfo.pos.x, this._pointInfo.pos.y)) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP25"))
            return
        }

        let pointInfo = FootHoldUtils.findFootHold(this._pointInfo.pos.x, this._pointInfo.pos.y)
        if (pointInfo && (pointInfo.status & 1) && !FootHoldUtils.isSameFightFootHold(pointInfo.pos.x, pointInfo.pos.y)) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP35"))
            return
        }

        if (this.footHoldModel.energy < this.footHoldModel.pointDetailInfo.needEnergy) {
            // gdk.gui.showMessage("体力不足，无法发起挑战")
            let needEnergy = this.footHoldModel.pointDetailInfo.needEnergy - this.footHoldModel.energy
            gdk.panel.setArgs(PanelId.FHBuyEngergy, needEnergy)
            gdk.panel.open(PanelId.FHBuyEngergy)
            return
        }
        this.footHoldModel.lastSelectPoint = this._pointInfo
        this.close()
        switch (this._stageCfg.type_pk) {
            case 'pve':
                // 塔防战斗类型
                let msg = new icmsg.FootholdFightStartReq();
                msg.warId = this.footHoldModel.curMapData.warId;
                msg.pos = this.footHoldModel.pointDetailInfo.pos;
                msg.pveId = this._stageCfg.id;
                NetManager.send(msg);
                JumpUtils.openInstance(this._stageCfg.id);
                break;
            case 'pvp':
                // 卡牌战斗类型
                break;
            case 'pve_fun':
                // BOSS战斗类型
                break;
        }
    }

    openMarkFunc() {
        if (!this.footHoldModel.markFlagPoints[`${this._pointInfo.pos.x}-${this._pointInfo.pos.y}`] && !FootHoldUtils.isPlayerCanMark) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP87"))
            return
        }

        let tag = ConfigManager.getItemById(Foothold_globalCfg, "tag").value[0]
        if (FootHoldUtils.getMarkPointsNum() >= tag && !this.footHoldModel.markFlagPoints[`${this._pointInfo.pos.x}-${this._pointInfo.pos.y}`]) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP86"), tag))
            return
        }
        gdk.panel.open(PanelId.FHPointMarkPanel)
    }

    _getDmgList() {
        let list = this._detailInfo.damageList
        GlobalUtil.sortArray(list, (a, b) => {
            return b.damage - a.damage
        })
        let newList = []
        for (let i = 0; i < list.length; i++) {
            let info: FhDetailDmgInfo = {
                playerId: list[i].playerId,
                dmg: list[i].damage,
                index: i + 1,
                reward: this._pointCfg.rewards[0],
                totalHp: this._totalHp,
            }
            newList.push(info)
        }
        return newList
    }

    openBuyEngergy() {
        gdk.panel.open(PanelId.FHBuyEngergy)
    }
}


export type FhDetailDmgInfo = {
    playerId: number,
    dmg: number,
    index: number,
    reward: any,
    totalHp: number,
}