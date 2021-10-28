import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import CarnivalUtil from '../../util/CarnivalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RewardItem from '../../../../common/widgets/RewardItem';
import ServerModel from '../../../../common/models/ServerModel';


/** 
 * @Description:跨服狂欢奖励界面
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-04-01 19:52:22
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class CServerRankRewardViewCtrl extends gdk.BasePanel {

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

    get model(): ActivityModel { return ModelManager.get(ActivityModel); }
    activityId: number = 64;
    async onEnable() {
        let cfgs = CarnivalUtil.getCrossRankConfigs(true);
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
            let data = this.model.cServerRankData ? this.model.cServerRankData.rankingInfo[i] : null
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
                let data = this.model.cServerRankData ? this.model.cServerRankData.rankingInfo[index] : null;
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
        gdk.panel.open(PanelId.CServerPrivilegeTips);
    }

}
