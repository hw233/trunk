import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import ServerModel from '../../../../common/models/ServerModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { FhRankInfo } from './GlobalFootHoldViewCtrl';
import { Foothold_rankingCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-07-29 20:22:44
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHRankViewItemCtrl")
export default class FHRankViewItemCtrl extends UiListItem {

    @property(cc.Node)
    rank: cc.Node = null;

    @property(cc.Label)
    rank2: cc.Label = null;

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

    @property(cc.Label)
    scoreLab: cc.Label = null;

    @property(cc.Node)
    onNode: cc.Node = null;

    @property(cc.Node)
    offNode: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    rewardList: ListView = null;
    _info: FhRankInfo

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    async updateView() {
        this._info = this.data
        if (this._info.index <= 3) {
            this.rank.active = true
            this.rank2.node.active = false
            GlobalUtil.setSpriteIcon(this.node, this.rank, FootHoldUtils.getTop3RankIconPath(this._info.index))
        } else {
            this.rank.active = false
            this.rank2.node.active = true
            this.rank2.string = `${this._info.index}`
        }

        if (this._info.id == 0) {
            this.offNode.active = true
            this.onNode.active = false
        } else {
            this.offNode.active = false
            this.onNode.active = true

            GlobalUtil.setSpriteIcon(this.node, this.guildBottom, GuildUtils.getIcon(this._info.bottom))
            GlobalUtil.setSpriteIcon(this.node, this.guildFrame, GuildUtils.getIcon(this._info.frame))
            GlobalUtil.setSpriteIcon(this.node, this.guildIcon, GuildUtils.getIcon(this._info.icon))
            this.guildName.string = `${this._info.name}`
            this.serverLab.string = `[s${GlobalUtil.getSeverIdByGuildId(this._info.id)}]${ModelManager.get(ServerModel).serverNameMap[Math.floor(this._info.id / 10000)]}`
            this.scoreLab.string = `${this._info.score}`
        }
        this._updateViewData()
    }

    _initListView() {
        if (this.rewardList) {
            return
        }
        this.rewardList = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.rewardItem,
            cb_host: this,
            async: true,
            gap_x: 5,
            direction: ListViewDir.Horizontal,
        })
    }

    _updateViewData() {
        this._initListView()
        this.rewardList.set_data(this._info.reward)
    }
}