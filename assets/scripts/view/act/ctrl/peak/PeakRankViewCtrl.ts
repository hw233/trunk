import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import PeakModel from '../../model/PeakModel';
import PeakRankViewItemCtrl from './PeakRankViewItemCtrl';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Peak_divisionCfg, Peak_rankingCfg } from '../../../../a/config';

/** 
 * @Description: 巅峰之战排行榜
 * @Author: yaozu.hu
 * @Date: 2021-02-23 10:37:28
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-02 18:22:53
 */




const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakRankViewCtrl")
export default class PeakRankViewCtrl extends gdk.BasePanel {

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

    @property(PeakRankViewItemCtrl)
    myRankItem: PeakRankViewItemCtrl = null;


    @property(cc.Label)
    label1: cc.Label = null;
    @property(cc.Label)
    label2: cc.Label = null
    @property(cc.Label)
    label3: cc.Label = null

    @property(UiTabMenuCtrl)
    menuCtrl: UiTabMenuCtrl = null;
    // @property(cc.Node)
    // rankRed: cc.Node = null;

    list1: ListView;

    list2: ListView;

    datas: icmsg.PeakRankingRsp;

    lock: boolean = false;
    serverNum: number = 1;
    reward_type: number = 1;
    get model(): PeakModel { return ModelManager.get(PeakModel); }
    onEnable() {

        let arg = gdk.panel.getArgs(PanelId.ArenaTeamRankView)
        if (arg) {
            this.lock = arg[0];
        }
        //this.rankRed.active = false;
        this.serverNum = this.model.peakStateInfo.serverNum;
        let msg = new icmsg.PeakRankingReq()
        NetManager.send(msg, (rsp: icmsg.PeakRankingRsp) => {
            this.datas = rsp;

            //刷新排名信息
            this._updateView1()
            //刷新排名奖励信息
            this._updateView2()
            //this.refreshRankRed();
        }, this);

        this.menuCtrl.selectIdx = 0;
        //gdk.e.on(ArenaTeamEvent.RSP_ARENATEAM_RANK_REWARD, this.refreshRankRed, this);

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
        gdk.e.targetOff(this)
        NetManager.targetOff(this);
    }

    // refreshRankRed() {
    //     this.rankRed.active = this.lock && !this.model.rankRewarded && this.datas.selfRank > 0
    // }

    _updateView1(resetPos: boolean = true) {
        this._initListView1();
        let roleModel = ModelManager.get(RoleModel);
        let infos = this.datas.list;//this.guildModel.gbRankInfo;
        //infos.sort((a, b) => { return b.value - a.value; });
        let data = [];
        //let tem = this.model.cServerPersonData.numTd;
        //let value = this.model.cServerPersonData.carnivalScore;
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

        let temStateInfo = this.model.peakStateInfo
        let upHeros = temStateInfo.heroIds;
        let upHeroData: icmsg.PeakHero[] = []
        temStateInfo.heroes.forEach(hero => {
            if (upHeros.indexOf(hero.typeId) >= 0) {
                upHeroData.push(hero);
            }
        })
        let myInfo = {
            brief: brief,
            value: temStateInfo.points,
            rank: this.datas.mine,
            division: temStateInfo.rank,
            heroListData: upHeroData
        };
        infos.forEach((info, idx) => {
            let obj = {
                brief: info.brief,
                value: info.points,
                rank: idx + 1,
                division: info.rank,
                heroListData: info.heroes
            };
            data.push(obj);
            // if (info.brief.id == roleModel.id) {
            //     myInfo = obj;
            // }
        });
        this.list1.clear_items();
        this.list1.set_data(data, resetPos);
        this.myRankItem.data = myInfo;
        this.myRankItem.updateView();
    }
    refreshView2() {
        this._updateView2(false);
    }
    _updateView2(resetPos: boolean = true) {
        this._initListView2();
        let cfgs = ConfigManager.getItems(Peak_rankingCfg, (cfg: Peak_rankingCfg) => {
            //'reward_type', this.reward_type,{'server':this.serverNum}
            if (cfg.type == this.model.reward_type && cfg.server == this.serverNum) {
                return true;
            }
            return false;
        })
        let List2Data = []
        //let tem = this.datas.mine;

        //let index = 1;
        // for (let i = 0; i < cfgs.length; i++) {
        //     let cfg = cfgs[i];
        //     let serverNum = Math.min(4, this.serverNum);
        //     let str = 'rank' + serverNum;
        //     if (tem >= cfg[str][0] && tem <= cfg[str][1]) {
        //         for (let j = i; j < cfgs.length; j++) {
        //             let temCfg = ConfigManager.getItemByField(Peak_divisionCfg, 'division', cfgs[j].grade)//cfgs[j];
        //             if (temCfg.point <= this.datas.selfScore) {
        //                 index = j;
        //                 break;
        //             }
        //         }
        //         break;
        //     }
        // }

        if (cfgs.length > 0) {
            for (let i = 0; i < cfgs.length; i++) {
                let cfg = cfgs[i]
                let str = 'rank' //+ serverNum;
                let nameStr = cfg[str][0] == cfg[str][1] ? StringUtils.format(gdk.i18n.t("i18n:ARENATEAM_TIP5"), cfg[str][0]) : StringUtils.format(gdk.i18n.t("i18n:ARENATEAM_TIP12"), cfg[str][0], cfg[str][1]);//StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_TIP4"), (cfgs[i].interval / 10000))//"达到" + (cfgs[i].damage / 10000) + '万伤害'//curIndex == cfgs[i].rank ? str1 : str2
                let tem = ConfigManager.getItemByField(Peak_divisionCfg, 'division', cfg.requirements)
                if (tem) {
                    nameStr = nameStr + StringUtils.format(gdk.i18n.t("i18n:PEAK_TIP13"), tem.name)
                }
                let temData = { name: nameStr, cfg: cfgs[i], myRank: false, lock: false }
                List2Data.push(temData);
            }
        }
        this.list2.clear_items();
        this.list2.set_data(List2Data, resetPos);
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
            this.label2.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP6")//'玩家'
            this.label3.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP10")//'段位'
        } else {
            this.rankNode.active = false;
            this.rewardNode.active = true;
            this.label1.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP5")//'名次'
            this.label2.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP8")//'奖励'
            this.label3.string = ''
        }
    }

}
