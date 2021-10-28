import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel, { FhRankItemInfo } from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import { FhScoreRankInfo } from './GlobalFootHoldViewCtrl';
import { Foothold_rankingCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-08 18:10:34
 */
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("qszc/view/guild/footHold/FHSMapRankItemCtrl")
export default class FHSMapRankItemCtrl extends cc.Component {
    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    scoreLab: cc.Label = null;

    @property(cc.Label)
    rankLab: cc.Label = null;

    @property(cc.ScrollView)
    itemScrollView: cc.ScrollView = null;

    @property(cc.Node)
    itemContent: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    itemlist: ListView = null;

    _colorList = [cc.color("#FFFD61"), cc.color("#308C64"), cc.color("#CB4039"), cc.color("#E487E8")]

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    updateViewInfo(info: FhScoreRankInfo, rank: number) {
        GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(info.bottom))
        GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(info.frame))
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(info.icon))
        this.nameLab.string = `${info.name}`
        this.scoreLab.string = `${info.score}`
        this.rankLab.string = `${rank}`

        let color = this._colorList[FootHoldUtils.getFHGuildColor(info.id) - 1]
        this.nameLab.node.color = color
        this.scoreLab.node.color = color
        this.rankLab.node.color = color
        this._updateRewardViewData(rank)
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
            gap_x: 5,
            direction: ListViewDir.Horizontal,
        })
    }

    _updateRewardViewData(rank) {
        this._initItemListView()
        let cfg = ConfigManager.getItem(Foothold_rankingCfg, { map_type: this.footHoldModel.curMapData.mapType, index: this.footHoldModel.worldLevelIndex, ranking: rank })
        let rewards1 = this._getRewards(cfg.warehouse_show, true)
        let rewards2 = this._getRewards(cfg.rewards, false)
        this.itemlist.set_data(rewards1.concat(rewards2))
    }

    _getRewards(rewards, isLimit: boolean = false) {
        let list = []
        let cfgs = ConfigManager.getItems(Foothold_rankingCfg, { map_type: this.footHoldModel.curMapData.mapType, index: this.footHoldModel.worldLevelIndex })
        for (let i = 0; i < rewards.length; i++) {
            let showNum = Math.floor(rewards[i][1] * this.footHoldModel.fhGuilds.length / cfgs.length)
            let info: FhRankItemInfo = {
                id: rewards[i][0],
                num: showNum,
                isLimit: isLimit,
                openType: 0,
            }
            list.push(info)
        }
        return list
    }
}