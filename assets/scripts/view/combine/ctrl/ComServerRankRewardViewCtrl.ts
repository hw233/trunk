import ActUtil from '../../act/util/ActUtil';
import CombineModel from '../model/CombineModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RewardItem from '../../../common/widgets/RewardItem';
import RoleModel from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import { Combine_cross_rankCfg } from '../../../a/config';

/**
 * @Description: 合服狂欢 合服排行
 * @Author: luoyong
 * @Date: 2019-07-19 16:45:14
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-07 14:43:05
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/combine/ComServerRankRewardViewCtrl")
export default class ComServerRankRewardViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property([cc.Node])
    layoutList: cc.Node[] = [];
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;

    @property([cc.Label])
    serverName: cc.Label[] = []
    @property([cc.Label])
    serverScore: cc.Label[] = []

    @property(cc.Label)
    lastRank: cc.Label = null;

    get combineModel(): CombineModel { return ModelManager.get(CombineModel); }
    activityId: number = 94;
    async onEnable() {
        let cfgs = ConfigManager.getItems(Combine_cross_rankCfg, { type: ModelManager.get(RoleModel).serverMegCount });
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
        let serverIds = [];
        for (let i = 0; i < 3; i++) {
            let data = this.combineModel.cServerRankData ? this.combineModel.cServerRankData.rankingInfo[i] : null
            if (data) {
                serverIds.push(data.serverId * 100000);
            } else {
                break;
            }
        }
        await ModelManager.get(ServerModel).reqServerNameByIds(serverIds);
        cfgs.forEach((cfg, idx) => {
            if (cfg.interval[0] <= 3) {
                let index = cfg.interval[0] - 1
                let data = this.combineModel.cServerRankData ? this.combineModel.cServerRankData.rankingInfo[index] : null;
                if (!data) {
                    this.serverName[index].string = '';
                    this.serverScore[index].string = ''
                } else {
                    //await ModelManager.get(ServerModel).reqServerNameByIds([data.serverId]);
                    this.serverName[index].string = 'S' + (data.serverId % 10000) + ModelManager.get(ServerModel).serverNameMap[data.serverId]
                    this.serverScore[index].string = data.serverScore + '';
                }

            } else {
                this.lastRank.string = cfg.interval[0] + '~' + cfg.interval[1]
            }
            let layout = this.layoutList[idx]
            layout.removeAllChildren()
            cfg.rewards.forEach((data, index) => {
                let node = cc.instantiate(this.itemPre)
                let ctrl = node.getComponent(RewardItem);
                let tem = data;
                let temData = { index: index, typeId: tem[0], num: tem[1], delayShow: false, effct: false }
                ctrl.data = temData;
                ctrl.updateView();
                node.setParent(layout)
            })
        })

    }

    onDisable() {

    }

    tequanBtnClick() {
        gdk.panel.open(PanelId.CombineSerPrivilegeTip);
    }
}