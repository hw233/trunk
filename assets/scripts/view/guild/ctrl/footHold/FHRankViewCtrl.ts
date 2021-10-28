import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel, { FhMapType, FhPointInfo, FhRankItemInfo } from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import ServerModel from '../../../../common/models/ServerModel';
import { FhRankInfo } from './GlobalFootHoldViewCtrl';
import {
    Foothold_globalCfg,
    Foothold_pointCfg,
    Foothold_rankingCfg,
    TipsCfg
    } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-07-29 20:15:44
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHRankViewCtrl")
export default class FHRankViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    itemScrollView: cc.ScrollView = null;

    @property(cc.Node)
    itemContent: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    @property(cc.Node)
    tabBtns: cc.Node[] = [];

    @property(cc.ScrollView)
    rankScrollView: cc.ScrollView = null;

    @property(cc.Node)
    rankContent: cc.Node = null

    @property(cc.Prefab)
    rankItem: cc.Prefab = null

    @property(cc.Node)
    guildBottom: cc.Node = null;

    @property(cc.Node)
    guildFrame: cc.Node = null;

    @property(cc.Node)
    guildIcon: cc.Node = null;

    @property(cc.Label)
    guildName: cc.Label = null;

    @property(cc.Label)
    serverLab: cc.Label = null;

    @property(cc.RichText)
    tipLab: cc.RichText = null;

    @property(cc.Node)
    bg1: cc.Node = null;

    @property(cc.Label)
    scoreLab: cc.Label = null;

    _curIndex: number = 0
    _typeDatas = [FhMapType.Elite, FhMapType.Normal]

    ranklist: ListView = null;
    itemlist: ListView = null;

    _openType = 1 //

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {

        if (FootHoldUtils.isCrossWar) {
            this.selectType(null, 0)
        } else {
            this.selectType(null, 1)
        }
        this.tabBtns[0].active = false
        this.tabBtns[1].active = false

    }

    _initRankListView() {
        if (this.ranklist) {
            return
        }
        this.ranklist = new ListView({
            scrollview: this.rankScrollView,
            mask: this.rankScrollView.node,
            content: this.rankContent,
            item_tpl: this.rankItem,
            cb_host: this,
            async: true,
            gap_y: 2,
            direction: ListViewDir.Vertical,
        })
    }

    _updateViewData() {
        this._initRankListView()
        //公会积分
        let msg = new icmsg.FootholdCoopGuildListReq()
        NetManager.send(msg, async (data: icmsg.FootholdCoopGuildListRsp) => {
            let guilds = data.guildList
            GlobalUtil.sortArray(guilds, (a, b) => {
                return b.guildInfo.score - a.guildInfo.score
            })
            let list = []
            let cfgs = ConfigManager.getItems(Foothold_rankingCfg, { map_type: this._typeDatas[this._curIndex], index: this.footHoldModel.worldLevelIndex })
            if (guilds.length > 0) {
                for (let i = 0; i < guilds.length; i++) {

                    let info: FhRankInfo = {
                        index: i + 1,
                        type: this._openType,
                        id: guilds[i].guildInfo.id,
                        name: guilds[i].guildInfo.name,
                        bottom: guilds[i].guildInfo.bottom,
                        frame: guilds[i].guildInfo.frame,
                        icon: guilds[i].guildInfo.icon,
                        score: guilds[i].guildInfo.score,
                        reward: this._getRewards(cfgs[i].warehouse_show, true).concat(this._getRewards(cfgs[i].rewards)),
                    }
                    list.push(info)
                }

                let firstInfo = list.splice(0, 1)
                if (firstInfo.length > 0) {
                    GlobalUtil.setSpriteIcon(this.node, this.guildBottom, GuildUtils.getIcon(firstInfo[0].bottom))
                    GlobalUtil.setSpriteIcon(this.node, this.guildFrame, GuildUtils.getIcon(firstInfo[0].frame))
                    GlobalUtil.setSpriteIcon(this.node, this.guildIcon, GuildUtils.getIcon(firstInfo[0].icon))
                    this.guildName.string = `${firstInfo[0].name}`
                    this.serverLab.string = `[s${GlobalUtil.getSeverIdByGuildId(firstInfo[0].id)}]`
                    await ModelManager.get(ServerModel).reqServerNameByIds([firstInfo[0].id], 2);
                    this.serverLab.string += ModelManager.get(ServerModel).serverNameMap[Math.floor(firstInfo[0].id / 10000)]
                    this.scoreLab.string = gdk.i18n.t("i18n:FOOTHOLD_TIP154") + ":" + firstInfo[0].score
                } else {
                    this.guildName.string = gdk.i18n.t("i18n:FOOTHOLD_TIP51")
                    this.serverLab.string = ``
                    this.scoreLab.string = ``
                }

                let showList = []
                if (list.length < cfgs.length - 1) {
                    for (let j = 0; j < cfgs.length - list.length - 1; j++) {
                        let info: FhRankInfo = {
                            index: j + list.length + 2,
                            type: this._openType,
                            id: 0,
                            name: "",
                            bottom: 0,
                            frame: 0,
                            icon: 0,
                            score: 0,
                            reward: this._getRewards(cfgs[list.length + j + 1].warehouse_show, true).concat(this._getRewards(cfgs[list.length + j + 1].rewards)),
                        }
                        showList.push(info)
                    }
                }
                list = list.concat(showList)
            } else {
                this.guildName.string = gdk.i18n.t("i18n:GUILDBOSS_TIP13")
                for (let i = 1; i < cfgs.length; i++) {
                    let info: FhRankInfo = {
                        index: i + 1,
                        type: this._openType,
                        id: 0,
                        name: "",
                        bottom: 0,
                        frame: 0,
                        icon: 0,
                        score: 0,
                        reward: this._getRewards(cfgs[i].warehouse_show, true).concat(this._getRewards(cfgs[i].rewards)),
                    }
                    list.push(info)
                }
            }
            let ids = []
            list.forEach(i => {
                if (i.id > 0) {
                    ids.push(i.id);
                }
            });
            await ModelManager.get(ServerModel).reqServerNameByIds(ids, 2);
            this.ranklist.set_data(list)
        })
    }

    _getCityScore(guildId) {
        let datas = this.footHoldModel.cityScores
        return datas[guildId] ? datas[guildId] : 0
    }

    selectType(e, index) {
        this._curIndex = index
        for (let i = 0; i < this.tabBtns.length; i++) {
            let node = this.tabBtns[i]
            let btn = node.getComponent(cc.Button)
            btn.interactable = index != i
            let select = node.getChildByName("on")
            select.active = index == i
        }
        this._updateViewData()
        this._updateRewardViewData()

        let path = `view/guild/texture/bg/gh_huizhangdi0${this._typeDatas[this._curIndex]}`
        GlobalUtil.setSpriteIcon(this.node, this.bg1, path)
    }

    _initItemListView() {
        if (this.itemlist) {
            return
        }
        this.itemlist = new ListView({
            scrollview: this.itemScrollView,
            mask: this.itemScrollView.node,
            content: this.itemContent,
            item_tpl: this.rewardItem,
            cb_host: this,
            async: true,
            column: 4,
            gap_x: 5,
            gap_y: 5,
            direction: ListViewDir.Horizontal,
        })
    }

    _updateRewardViewData() {
        this._initItemListView()
        let cfgs = ConfigManager.getItems(Foothold_rankingCfg, { map_type: this._typeDatas[this._curIndex], index: this.footHoldModel.worldLevelIndex })
        let rewards1 = this._getRewards(cfgs[0].warehouse_show, true)
        let rewards2 = this._getRewards(cfgs[0].rewards, false)
        this.itemlist.set_data(rewards1.concat(rewards2))
    }

    _getRewards(rewards, isLimit: boolean = false) {
        let list = []
        let cfgs = ConfigManager.getItems(Foothold_rankingCfg, { map_type: this._openType, index: this.footHoldModel.worldLevelIndex })
        for (let i = 0; i < rewards.length; i++) {
            let showNum = rewards[i][1]
            let info: FhRankItemInfo = {
                id: rewards[i][0],
                num: showNum,
                isLimit: isLimit,
                openType: this._openType,
            }
            list.push(info)
        }
        return list
    }
}