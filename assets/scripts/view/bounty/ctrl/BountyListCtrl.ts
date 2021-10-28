import BountyModel from './BountyModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import StringUtils from '../../../common/utils/StringUtils';
import { Bounty_costCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
/** 
 * @Description: 赏金求助
 * @Author: weiliang.huang  
 * @Date: 2019-05-07 09:34:24 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 12:12:07
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bounty/BountyListCtrl")
export default class BountyListCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    tips: cc.Node = null;

    @property(cc.Node)
    txtNode: cc.Node = null;

    @property(cc.Label)
    numLab: cc.Label = null;

    @property(cc.Node)
    leftNode: cc.Node = null;

    @property(cc.Label)
    leftLab: cc.Label = null;

    list: ListView = null;

    get bountyModel() { return ModelManager.get(BountyModel); }

    onEnable() {

        let msg2 = new icmsg.BountyMineReq();
        NetManager.send(msg2, (data: icmsg.BountyMineRsp) => {
            this._updateLeftTime(data)

            let msg = new icmsg.BountyListReq()
            NetManager.send(msg, (data: icmsg.BountyListRsp) => {
                this.updateDatas(data.list)
            })
        });

        this.tips.active = false
        this.txtNode.active = false
        this.leftNode.active = false

        let msg = new icmsg.BountyListNumReq()
        NetManager.send(msg)
    }

    onDisable() {

    }

    _initListView() {
        if (this.list) return;
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.itemPrefab,
            cb_host: this,
            async: true,
            column: 1,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        });
    }

    updateDatas(datas: icmsg.BountyMission[]) {
        this._initListView()
        if (datas.length == 0) {
            this.tips.active = true
            this.txtNode.active = false
            this.leftNode.active = false
        } else {
            this.tips.active = false
            this.txtNode.active = true
            let list1 = []//可挑战
            let list2 = []//已完成
            let list3 = []//已失效
            let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
            datas.sort((a, b) => {
                if (a.gemsNum == b.gemsNum) {
                    if (a.pubPower == b.pubPower) {
                        return a.endTime - b.endTime;
                    }
                    else {
                        return b.pubPower - a.pubPower;
                    }
                }
                else {
                    return b.gemsNum - a.gemsNum;
                }
            })
            for (let i = 0; i < datas.length; i++) {
                if (datas[i].endTime > curTime) {
                    if (datas[i].committer == "") {
                        list1.push(datas[i])
                    } else {
                        list2.push(datas[i])
                    }
                } else {
                    list3.push(datas[i])
                }
            }
            // GlobalUtil.sortArray(list1, this._sortFunc)
            // GlobalUtil.sortArray(list2, this._sortFunc)
            // GlobalUtil.sortArray(list3, this._sortFunc)
            this.list.set_data(list1.concat(list2).concat(list3))
            this.numLab.string = `${list1.length}${gdk.i18n.t("i18n:BOUNTY_TIP1")}`
        }
    }

    _updateLeftTime(data: icmsg.BountyMineRsp) {
        this.bountyModel.myBountyInfo = data
        this.leftNode.active = true
        let cfg_b = ConfigManager.getItemById(Bounty_costCfg, 3)
        let leftTime = cfg_b.earn_limit - data.finishedFreeNum > 0 ? cfg_b.earn_limit - data.finishedFreeNum : 0
        this.leftLab.string = `${StringUtils.format(gdk.i18n.t("i18n:BOUNTY_TIP2"), leftTime, cfg_b.earn_limit)}`//`钻石赏金：本周剩余${leftTime}/${cfg_b.earn_limit}次`
    }

    // _sortFunc(a: BountyMission, b: BountyMission) {
    //     if (a.gemsNum == b.gemsNum) {
    //         return a.endTime - b.endTime
    //     }
    //     return b.gemsNum - a.gemsNum
    // }

}