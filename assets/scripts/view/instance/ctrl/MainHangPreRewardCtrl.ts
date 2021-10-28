import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StoreModel from '../../store/model/StoreModel';
import {
    Copy_stageCfg,
    CopyCfg,
    TavernCfg,
    VipCfg
    } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { timeFormat } from '../utils/InstanceUtil';
/** 
 * @Description: 主线挂机奖励预览
 * @Author: luoyong  
 * @Date: 2020-07-02 14:00:53
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:36:56
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/MainHangPreRewardCtrl")
export default class MainHangPreRewardCtrl extends gdk.BasePanel {

    @property(cc.Label)
    timeLab: cc.Label = null

    @property(cc.ScrollView)
    upScrollView: cc.ScrollView = null;

    @property(cc.Node)
    upContent: cc.Node = null

    // @property(cc.ScrollView)
    // downScrollView: cc.ScrollView = null;

    // @property(cc.Node)
    // downContent: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    @property(cc.Label)
    getLab1: cc.Label = null

    @property(cc.Label)
    getLab2: cc.Label = null

    @property(cc.Label)
    getLab3: cc.Label = null

    @property(cc.Label)
    getLab4: cc.Label = null

    // @property(cc.Node)
    // upArrowNode: cc.Node = null

    upList: ListView = null
    downList: ListView = null
    _remainTime: number = 0
    _copyCfg: CopyCfg

    _rewardList: icmsg.GoodsInfo[] = []
    // _addRewardList: GoodsInfo[] = []
    _vipAddTime: number = 0

    get copyModel() { return ModelManager.get(CopyModel); }
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        //gdk.e.on(StoreEventId.UPDATE_MONTHCARD_RECEIVE, this._updateMonthCardInfo, this);

        let arg: icmsg.DungeonHangPreviewRsp = this.args[0]
        this._rewardList = GlobalUtil.sortGoodsInfo(arg.dropItems)
        // this._addRewardList = GlobalUtil.sortGoodsInfo(arg.vipBonus)

        this._vipAddTime = 0
        let vipCfg = ConfigManager.getItemByField(VipCfg, "level", this.roleModel.vipLv)
        if (vipCfg) {
            this._vipAddTime = vipCfg.vip5
        }
        let newStageCfg = ConfigManager.getItemById(Copy_stageCfg, this.copyModel.latelyStageId)
        let stageCfg = ConfigManager.getItemById(Copy_stageCfg, newStageCfg.pre_condition)
        if (stageCfg) {
            this.getLab1.string = stageCfg.drop_show2[0] + '/m';
            this.getLab2.string = stageCfg.drop_show2[1] + '/m';
            this.getLab3.string = stageCfg.drop_show2[2] + '/m';
            this.getLab4.string = stageCfg.drop_show2[3] + '/m';
        }
        let stageId = this.copyModel.hangStageId;
        if (stageId) {
            let stageCfg = ConfigManager.getItem(Copy_stageCfg, { id: stageId })
            if (stageCfg) {
                this._copyCfg = ConfigManager.getItem(CopyCfg, { subtype: stageCfg.subtype });
                this._updateEndTime()
                this.schedule(this._updateEndTime.bind(this), 1)
            }
        }
        // this._updateMonthCardInfo()
        this._updateReward()
    }

    onDisable() {
        this.unschedule(this._updateEndTime)
        gdk.e.targetOff(this)
    }

    _updateEndTime() {
        let now = Math.floor(GlobalUtil.getServerTime() / 1000);
        let hmsg = this.copyModel.hangStateMsg;
        this._remainTime = Math.min(now - hmsg.startTime, this._copyCfg.search_limit + this._vipAddTime)
        this.timeLab.string = timeFormat(Math.max(0, this._remainTime));
    }

    _initUpListView() {
        if (this.upList) {
            return
        }
        this.upList = new ListView({
            scrollview: this.upScrollView,
            mask: this.upScrollView.node,
            content: this.upContent,
            item_tpl: this.rewardItem,
            cb_host: this,
            column: 5,
            gap_x: 20,
            gap_y: 15,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    _updateReward() {
        this._initUpListView()
        let num = this._getUpListData(this._rewardList).length
        this.upScrollView.node.height = Math.min((Math.ceil(num / 5)) * 100, 250)
        this.upList.set_data(this._getUpListData(this._rewardList))
    }

    buyMonthCardFunc() {
        gdk.panel.setArgs(PanelId.MonthCard, 2)
        gdk.panel.open(PanelId.MonthCard)
    }

    getRewardFunc() {
        let tavernItem: icmsg.GoodsInfo;
        for (let i = 0; i < this._rewardList.length; i++) {
            if (this._rewardList[i].typeId == 16) {
                tavernItem = this._rewardList[i];
                break;
            }
        }

        if (tavernItem) {
            let limit = ConfigManager.getItemById(TavernCfg, 1).max_task[1];
            let has = BagUtils.getItemNumById(16) || 0;
            if (tavernItem.num + has > limit) {
                GlobalUtil.openAskPanel({
                    descText: `当前已有<color=#5EE015>${has}/${limit}</c>悬赏情报,领取后超出上限部分将损失,是否确认领取?`,
                    sureCb: () => {
                        // 领取奖励
                        let msg = new icmsg.DungeonHangRewardReq();
                        msg.stageId = this.copyModel.hangStageId;
                        NetManager.send(msg, () => {
                            gdk.panel.hide(PanelId.MainHangPreReward)
                        });
                    },
                    closeText: '前往悬赏',
                    closeCb: () => {
                        JumpUtils.openTavern();
                        gdk.panel.hide(PanelId.MainHangPreReward)
                    }
                })
                return;
            }
        }

        // 领取奖励
        let msg = new icmsg.DungeonHangRewardReq();
        msg.stageId = this.copyModel.hangStageId;
        NetManager.send(msg, () => {
            gdk.panel.hide(PanelId.MainHangPreReward)
        });
    }

    _getUpListData(datas) {
        let list = []
        for (let i = 0; i < datas.length; i++) {
            let info: MainHangPreRewardInfo = {
                goodInfo: datas[i],
                state: true,
                up: false
            }
            list.push(info)
        }
        return list
    }
}

export type MainHangPreRewardInfo = {
    goodInfo: icmsg.GoodsInfo,//道具
    state: boolean,//true 亮，false 灰
    up: boolean//true 箭头 false 无
}