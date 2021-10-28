import ActUtil from '../../act/util/ActUtil';
import CombineModel from '../model/CombineModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import { ChannelCfg } from '../../../../boot/configs/bconfig';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/**
 * @Description: 合服狂欢 合服排行
 * @Author: luoyong
 * @Date: 2019-07-19 16:45:14
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-24 13:46:23
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/combine/CombineServerRankViewCtrl")
export default class CombineServerRankViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;

    @property(cc.Sprite)
    rankSp: cc.Sprite = null;
    @property(cc.Label)
    rankNum: cc.Label = null;
    @property(cc.Label)
    serverScore: cc.Label = null;
    @property(cc.Label)
    timeLabel: cc.Label = null;
    @property(cc.Node)
    redNode: cc.Node = null;

    list: ListView = null;
    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];
    get combineModel(): CombineModel { return ModelManager.get(CombineModel); }
    activityId: number = 94;
    onEnable() {
        // this.redNode.active = !this.model.enterCServerRank;
        // if (!this.model.enterCServerRank) {
        //     this.model.enterCServerRank = true;
        // }
        let temStartTime = ActUtil.getActStartTime(this.activityId)
        let temEndTime = ActUtil.getActEndTime(this.activityId) - 5000
        let startTime = new Date(temStartTime);
        let endTime = new Date(temEndTime); //time为零点,减去5s 返回前一天
        if (!temStartTime || !temEndTime) {
            this.timeLabel.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1")//`活动已过期`;
        }
        else {
            this.timeLabel.string = `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        }

        let msg = new icmsg.MergeCarnivalServerRankReq()
        NetManager.send(msg, async (rsp: icmsg.MergeCarnivalServerRankRsp) => {
            this.combineModel.serverRank = rsp.ranking
            this.combineModel.serverScore = rsp.score
            this.combineModel.cServerRankData = rsp;
            this.combineModel.cServerRankData.rankingInfo.sort((a, b) => {
                return b.serverScore - a.serverScore;
            })
            this.combineModel.cServerRankData.rankingInfo.forEach((data, i) => {
                data.ranking = i + 1;
            })

            let serverIds = [];
            for (let i = 0; i < this.combineModel.cServerRankData.rankingInfo.length; i++) {
                let data = this.combineModel.cServerRankData.rankingInfo[i]
                if (data) {
                    serverIds.push(data.serverId * 100000);
                } else {
                    break;
                }
            }
            await ModelManager.get(ServerModel).reqServerNameByIds(serverIds);
            this._updateScroll();
        }, this);
    }

    onDisable() {
        NetManager.targetOff(this)
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    _updateScroll() {
        this._initListView()
        let listData = [];
        let roleModel = ModelManager.get(RoleModel)
        let xServerId = parseInt(ModelManager.get(ServerModel).serverXIdMap[Math.floor(roleModel.id / 100000)])
        let myServerId = xServerId ? xServerId : Math.floor((roleModel.id % (10000 * 100000)) / 100000)
        let myChannel = GlobalUtil.getChannelIdByPlayerId(roleModel.id)
        let c_cfg = ConfigManager.getItemByField(ChannelCfg, "channel_id", myChannel)
        let myPlatform = c_cfg ? c_cfg.platform_id : myChannel
        let have = false;
        if (this.combineModel.cServerRankData.rankingInfo.length > 0) {
            let rankingInfo = this.combineModel.cServerRankData.rankingInfo;
            // rankingInfo.sort((a, b) => {
            //     return b.serverScore - a.serverScore
            // })
            let maxScore = rankingInfo[0].serverScore
            rankingInfo.forEach((data, index) => {
                // data.ranking = index + 1;
                let temServerId = data.serverId % 10000
                let tempPlatform = Math.floor(data.serverId / 10000)
                if (temServerId == myServerId && myPlatform == tempPlatform) {
                    have = true;
                    this.serverScore.string = data.serverScore + '';
                    if (data.ranking > 0 && data.ranking <= 3) {
                        this.rankSp.node.active = true;
                        this.rankNum.node.active = false;
                        let path = this.rankSpriteName[data.ranking - 1];
                        GlobalUtil.setSpriteIcon(this.node, this.rankSp, path);
                    } else {
                        this.rankSp.node.active = false;
                        this.rankNum.node.active = true;
                        this.rankNum.string = data.ranking + ''
                    }
                }
                let tem = { maxScore: maxScore, data: data }
                listData.push(tem);
            })
            if (!have) {
                this.rankSp.node.active = false;
                this.rankNum.node.active = false;
                this.serverScore.string = '';
            }
            this.list.set_data(listData);
        } else {
            this.rankSp.node.active = false;
            this.rankNum.node.active = false;
            this.serverScore.string = '';
        }
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scroll,
            mask: this.scroll.node,
            content: this.content,
            item_tpl: this.itemPre,
            cb_host: this,
            row: 1,
            gap_x: -50,
            async: true,
            resize_cb: this._updateDataLater,
            direction: ListViewDir.Horizontal,
        })

    }
    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    //打开排名奖励
    openRankReward() {
        this.redNode.active = false;
        gdk.panel.open(PanelId.ComServerRankRewardView);
    }
}