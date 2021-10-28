import ActivityModel from '../../model/ActivityModel';
import CarnivalUtil from '../../util/CarnivalUtil';
import CServerPersonRankItemCtrl from './CServerPersonRankItemCtrl';
import CServerPersonRewardItemCtrl from './CServerPersonRewardItemCtrl';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
 * @Description: 跨服任务排行榜
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-31 10:54:44
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/heroTrial/CServerPersonRankViewCtrl")
export default class CServerPersonRankViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    rankNode: cc.Node = null;
    @property(cc.Node)
    rewardNode: cc.Node = null;

    @property(cc.ScrollView)
    scrollView1: cc.ScrollView = null;

    @property(cc.Node)
    content1: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab1: cc.Prefab = null;

    @property(cc.ScrollView)
    scrollView2: cc.ScrollView = null;

    @property(cc.Node)
    content2: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab2: cc.Prefab = null;

    @property(CServerPersonRankItemCtrl)
    myRankItem: CServerPersonRankItemCtrl = null;
    @property(CServerPersonRewardItemCtrl)
    myRankItem2: CServerPersonRewardItemCtrl = null;

    @property(cc.Label)
    label1: cc.Label = null;
    @property(cc.Label)
    label2: cc.Label = null;
    @property(cc.Label)
    label3: cc.Label = null

    @property(UiTabMenuCtrl)
    menuCtrl: UiTabMenuCtrl = null;
    // @property(cc.Label)
    // timeLabel: cc.Label = null;

    list1: ListView;

    list2: ListView;

    model: ActivityModel = ModelManager.get(ActivityModel);
    datas: icmsg.RankDetailRsp;


    onEnable() {

        let msg = new icmsg.RankDetailReq()
        msg.type = 7;
        NetManager.send(msg, (rsp: icmsg.RankDetailRsp) => {
            this.datas = rsp;
            //刷新排名信息
            this._updateView1()

        }, this);
        //刷新排名奖励信息
        this._updateView2()
        gdk.e.on(ActivityEventId.ACTIVITY_HEROTRIAL_DAMAGEREWARD_UPDATE, this.refreshView2, this)
        this.menuCtrl.selectIdx = 0;
        //刷新获得时间
        // let endTime = ActUtil.getActEndTime(this.ordealCfg.activity_id);
        // let temTime = Math.floor(endTime / 1000)
        // let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        // let activityTime = Math.max(0, Math.floor(temTime - nowTime));
        //this.timeLabel.string = TimerUtils.format1(activityTime)
    }

    onDisable() {
        if (this.list1) {
            this.list1.destroy();
            this.list1 = null;
        }
        if (this.list2) {
            this.list2.destroy();
            this.list2 = null;
        }
        NetManager.targetOff(this);
        gdk.e.off(ActivityEventId.ACTIVITY_HEROTRIAL_DAMAGEREWARD_UPDATE, this.refreshView2, this)
    }

    _updateView1(resetPos: boolean = true) {
        this._initListView1();
        let roleModel = ModelManager.get(RoleModel);
        let infos = this.datas.list;//this.guildModel.gbRankInfo;
        infos.sort((a, b) => { return b.value - a.value; });
        let data = [];
        //let tem = this.model.cServerPersonData.numTd;
        let value = this.model.cServerPersonData.carnivalScore;
        let brief = new icmsg.RoleBrief();
        brief.id = roleModel.id;
        brief.head = roleModel.head;
        brief.name = roleModel.name;
        brief.level = roleModel.level;
        brief.power = roleModel.power;
        brief.logoutTime = 0;
        brief.headFrame = roleModel.frame;//头像框
        brief.vipExp = roleModel.vipExp;
        brief.guildId = 0;
        let myInfo = {
            brief: brief,
            value: value,
            rank: this.model.cServerPersonData.numTd
        };
        infos.forEach((info, idx) => {
            let obj = {
                brief: info.brief,
                value: info.value,
                rank: idx + 1
            };
            data.push(obj);
            // if (info.brief.id == roleModel.id) {
            //     myInfo = obj;
            // }
        });
        this.list1.clear_items();
        this.list1.set_data(data, resetPos);

        this.myRankItem.updateItemView(myInfo);
    }
    refreshView2() {
        this._updateView2(false);
    }
    _updateView2(resetPos: boolean = true) {
        this._initListView2();
        let cfgs = CarnivalUtil.getPersonalRankConfigs();
        let List2Data = []
        let curIndex = -1;
        let tem = this.model.cServerPersonData.numTd;
        let value = -1//tem[tem.length - 1]
        if (cfgs.length > 0) {
            for (let i = 0; i < cfgs.length; i++) {
                // let str1 = StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP3"), cfgs[i].rank);
                // let str2 = StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP4"), curIndex, cfgs[i].rank);
                let nameStr = cfgs[i].interval[0] == cfgs[i].interval[1] ? `第${cfgs[i].interval[0]}名` : `${cfgs[i].interval[0]}~${cfgs[i].interval[1]}`//StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_TIP4"), (cfgs[i].interval / 10000))//"达到" + (cfgs[i].damage / 10000) + '万伤害'//curIndex == cfgs[i].rank ? str1 : str2
                //curIndex = cfgs[i].rank + 1;
                if (tem >= cfgs[i].interval[0] && tem <= cfgs[i].interval[1] && curIndex == -1) {
                    curIndex = i;
                }
                let temData = { name: nameStr, cfg: cfgs[i], myRank: value }
                List2Data.push(temData);
            }
        }
        this.list2.clear_items();
        this.list2.set_data(List2Data, resetPos);
        let temCfg = cfgs[curIndex]
        if (temCfg) {
            this.myRankItem2.node.active = true
            let nameStr = temCfg.interval[0] == temCfg.interval[1] ? `第${temCfg.interval[0]}名` : `${tem}`
            this.myRankItem2.data = { name: nameStr, cfg: temCfg, myRank: value }
            this.myRankItem2.updateView()
        } else {
            this.myRankItem2.node.active = false
        }

        // let roleModel = ModelManager.get(RoleModel);
        // let brief = new icmsg.RoleBrief();
        // brief.id = roleModel.id;
        // brief.head = roleModel.head;
        // brief.name = roleModel.name;
        // brief.level = roleModel.level;
        // brief.power = roleModel.power;
        // brief.logoutTime = 0;
        // brief.headFrame = roleModel.frame;//头像框
        // brief.vipExp = roleModel.vipExp;
        // brief.guildId = 0;
        // let myInfo = {
        //     brief: brief,
        //     value: value,
        //     rank: this.model.cServerPersonData.numTd
        // };
        //this.myRankItem2.updateItemView(myInfo);
    }

    _initListView1() {
        if (!this.list1) {
            this.list1 = new ListView({
                scrollview: this.scrollView1,
                mask: this.scrollView1.node,
                content: this.content1,
                item_tpl: this.itemPrefab1,
                cb_host: this,
                gap_y: 5,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _initListView2() {
        if (!this.list2) {
            this.list2 = new ListView({
                scrollview: this.scrollView2,
                mask: this.scrollView2.node,
                content: this.content2,
                item_tpl: this.itemPrefab2,
                cb_host: this,
                gap_y: 5,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }


    infoPageSelect(event, index, refresh: boolean = false) {
        if (index == 0) {
            this.rankNode.active = true;
            this.rewardNode.active = false;
            this.label1.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP5")//'名次'
            this.label2.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP6")//'奖励'
            this.label3.node.active = true;
        } else {
            this.rankNode.active = false;
            this.rewardNode.active = true;
            this.label1.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP5")//'名次'
            this.label2.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP8")//'玩家'
            this.label3.node.active = false;
        }
    }

}
