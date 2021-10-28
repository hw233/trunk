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
 * @Last Modified time: 2021-07-29 20:17:11
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHLastRankViewCtrl")
export default class FHLastRankViewCtrl extends gdk.BasePanel {

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
    _lastWorldLv = 2001

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {

        let msg = new icmsg.FootholdLastRankReq()
        NetManager.send(msg, (data: icmsg.FootholdLastRankRsp) => {
            this.footHoldModel.fhLastRankGuilds = data.guilds
            this._lastWorldLv = data.worldLevelLast
            if (FootHoldUtils.isCrossWar) {
                this.selectType(null, 0)
            } else {
                this.selectType(null, 1)
            }
            this.tabBtns[0].active = false
            this.tabBtns[1].active = false
        })

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

    async _updateViewData() {
        this._initRankListView()
        let guilds = this.footHoldModel.fhLastRankGuilds
        let cfgs = ConfigManager.getItems(Foothold_rankingCfg, { map_type: this._typeDatas[this._curIndex], index: this._lastWorldLv })
        let newList = []
        let list = []
        for (let i = 0; i < guilds.length; i++) {
            let info: FhRankInfo = {
                index: i + 1,
                type: this._openType,
                id: guilds[i].id,
                name: guilds[i].name,
                bottom: guilds[i].bottom,
                frame: guilds[i].frame,
                icon: guilds[i].icon,
                score: guilds[i].score,
                reward: this._getRewards(cfgs[i].warehouse_show, true).concat(this._getRewards(cfgs[i].rewards)),
            }
            list.push(info)
        }
        GlobalUtil.sortArray(list, (a, b) => {
            return b.score - a.score
        })
        for (let i = 0; i < list.length; i++) {
            list[i].index = i + 1
            list[i].reward = this._getRewards(cfgs[i].warehouse_show, true).concat(this._getRewards(cfgs[i].rewards))
            newList.push(list[i])
        }
        let firstInfo = newList.splice(0, 1)
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
        if (newList.length < cfgs.length - 1) {
            for (let j = 0; j < cfgs.length - newList.length - 1; j++) {
                let info: FhRankInfo = {
                    index: j + newList.length + 2,
                    type: this._openType,
                    id: 0,
                    name: "",
                    bottom: 0,
                    frame: 0,
                    icon: 0,
                    score: 0,
                    reward: this._getRewards(cfgs[newList.length + j + 1].warehouse_show, true).concat(this._getRewards(cfgs[newList.length + j + 1].rewards)),
                }
                showList.push(info)
            }
        }
        let ids = []
        newList.forEach(i => {
            if (i.id > 0) {
                ids.push(i.id);
            }
        });
        await ModelManager.get(ServerModel).reqServerNameByIds(ids, 2);
        newList = newList.concat(showList)

        this.ranklist.set_data(newList)
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
        let cfgs = ConfigManager.getItems(Foothold_rankingCfg, { map_type: this._typeDatas[this._curIndex], index: this._lastWorldLv })
        let rewards1 = this._getRewards(cfgs[0].warehouse_show, true)
        let rewards2 = this._getRewards(cfgs[0].rewards, false)
        this.itemlist.set_data(rewards1.concat(rewards2))
    }

    _getRewards(rewards, isLimit: boolean = false) {
        let list = []
        //let cfgs = ConfigManager.getItems(Foothold_rankingCfg, { map_type: this._openType, index: this._lastWorldLv })
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