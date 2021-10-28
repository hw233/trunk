import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroTrialRankItemCtrl from './HeroTrialRankItemCtrl';
import InstanceModel from '../../../instance/model/InstanceModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Ordeal_rankingCfg, OrdealCfg } from '../../../../a/config';

/** 
 * @Description: 英雄试炼排行榜
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-01-15 15:00:31
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/heroTrial/HeroTrialRankViewCtrl")
export default class HeroTrialRankViewCtrl extends gdk.BasePanel {

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

    @property(HeroTrialRankItemCtrl)
    myRankItem: HeroTrialRankItemCtrl = null;
    @property(HeroTrialRankItemCtrl)
    myRankItem2: HeroTrialRankItemCtrl = null;

    @property(cc.Label)
    label1: cc.Label = null;
    @property(cc.Label)
    label2: cc.Label = null

    @property(cc.Label)
    timeLabel: cc.Label = null;

    list1: ListView;

    list2: ListView;

    model: InstanceModel = ModelManager.get(InstanceModel);
    datas: icmsg.DungeonOrdealRankListRsp;
    ordealCfg: OrdealCfg;
    serverNum: number = 1;
    onEnable() {
        let arg = gdk.panel.getArgs(PanelId.HeroTrialRankView);
        if (arg) {
            this.ordealCfg = arg[0];
            this.serverNum = arg[1]
        } else {
            this.close()
            return;
        }
        NetManager.send(new icmsg.DungeonOrdealRankListReq(), (rsp: icmsg.DungeonOrdealRankListRsp) => {
            this.datas = rsp;
            //刷新排名信息
            this._updateView1()

        }, this);
        //刷新排名奖励信息
        this._updateView2()
        gdk.e.on(ActivityEventId.ACTIVITY_HEROTRIAL_DAMAGEREWARD_UPDATE, this.refreshView2, this)
        //刷新获得时间
        let endTime = ActUtil.getActEndTime(this.ordealCfg.activity_id);
        let temTime = Math.floor(endTime / 1000)
        let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let activityTime = Math.max(0, Math.floor(temTime - nowTime));
        this.timeLabel.string = TimerUtils.format1(activityTime)
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
        let tem = this.model.heroTrialInfo.stageDamages;
        let value = tem[tem.length - 1]
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
            rank: this.model.heroTrialInfo.rankNum
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
        let cfgs = ConfigManager.getItems(Ordeal_rankingCfg, (item: Ordeal_rankingCfg) => {
            if (item.activity_id == this.ordealCfg.activity_id && item.type == this.ordealCfg.type && item.server == this.serverNum) {
                return true;
            }
        })
        let List2Data = []
        let curIndex = 1;
        let tem = this.model.heroTrialInfo.stageDamages;
        let value = tem[tem.length - 1]
        if (cfgs.length > 0) {
            for (let i = 0; i < cfgs.length; i++) {
                // let str1 = StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP3"), cfgs[i].rank);
                // let str2 = StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP4"), curIndex, cfgs[i].rank);
                let nameStr = StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_TIP4"), (cfgs[i].damage / 10000))//"达到" + (cfgs[i].damage / 10000) + '万伤害'//curIndex == cfgs[i].rank ? str1 : str2
                curIndex = cfgs[i].rank + 1;
                let temData = { name: nameStr, cfg: cfgs[i], rewardData: this.model.heroTrialInfo.rewardTimes[i], myDamage: value }
                List2Data.push(temData);
            }
        }
        this.list2.clear_items();
        this.list2.set_data(List2Data, resetPos);
        let roleModel = ModelManager.get(RoleModel);
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
            rank: this.model.heroTrialInfo.rankNum
        };
        this.myRankItem2.updateItemView(myInfo);
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
            this.rankNode.active = false;
            this.rewardNode.active = true;
            this.label1.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP7")//'伤害奖励'
            this.label2.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP8")//'奖励'
        } else {
            this.rankNode.active = true;
            this.rewardNode.active = false;
            this.label1.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP5")//'名次'
            this.label2.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP6")//'玩家'
        }
    }

}
