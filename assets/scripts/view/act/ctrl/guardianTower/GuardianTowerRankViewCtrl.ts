import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GuardianTowerModel from '../../model/GuardianTowerModel';
import GuardianTowerRankViewItemCtrl from './GuardianTowerRankViewItemCtrl';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import StringUtils from '../../../../common/utils/StringUtils';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { Guardiantower_prizeCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';



/**
 * @Description: 护使秘境排行榜
 * @Author: yaozu.hu
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-15 15:00:36
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guardianTower/GuardianTowerRankViewCtrl")
export default class GuardianTowerRankViewCtrl extends gdk.BasePanel {

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

    @property(GuardianTowerRankViewItemCtrl)
    myRankItem: GuardianTowerRankViewItemCtrl = null;


    @property(cc.Label)
    label1: cc.Label = null;
    @property(cc.Label)
    label2: cc.Label = null
    @property(cc.Label)
    label3: cc.Label = null

    @property(UiTabMenuCtrl)
    menuCtrl: UiTabMenuCtrl = null;

    list1: ListView;

    list2: ListView;

    datas: icmsg.GuardianTowerRankListRsp;

    lock: boolean = false;
    serverNum: number = 1;
    actRewardType: number = 1;
    actId: number = 89;
    get model(): GuardianTowerModel { return ModelManager.get(GuardianTowerModel); }
    onEnable() {

        // let arg = gdk.panel.getArgs(PanelId.ArenaTeamRankView)
        // if (arg) {
        //     this.lock = arg[0];
        // }
        this.actRewardType = ActUtil.getActRewardType(this.actId)
        let msg = new icmsg.GuardianTowerRankListReq()
        NetManager.send(msg, (rsp: icmsg.GuardianTowerRankListRsp) => {
            this.datas = rsp;
            this.serverNum = rsp.serverNum;
            //刷新排名信息
            this._updateView1()
            //刷新排名奖励信息
            this._updateView2()
        }, this);

        this.menuCtrl.selectIdx = 0;

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

    _updateView1(resetPos: boolean = true) {
        this._initListView1();
        let roleModel = ModelManager.get(RoleModel);
        let infos = this.datas.list;//this.guildModel.gbRankInfo;
        //infos.sort((a, b) => { return b.score - a.score; });
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
        let myInfo = {
            brief: brief,
            value: this.model.stateInfo.maxStageId % 100,
            rank: this.datas.mine
        };
        infos.forEach((info, idx) => {
            let obj = {
                brief: info.brief,
                value: info.layer,
                rank: idx + 1
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

        let cfgs = ConfigManager.getItems(Guardiantower_prizeCfg, (cfg: Guardiantower_prizeCfg) => {
            if (cfg.subtype == this.actRewardType) {
                return true;
            }
        })

        let List2Data = []

        if (cfgs.length > 0) {
            for (let i = 0; i < cfgs.length; i++) {
                let cfg = cfgs[i];
                let serverNum = Math.min(4, this.serverNum);
                let str = 'rank' + serverNum;
                let nameStr = cfg[str][0] == cfg[str][1] ? StringUtils.format(gdk.i18n.t("i18n:ARENATEAM_TIP5"), cfg[str][0]) : StringUtils.format(gdk.i18n.t("i18n:ARENATEAM_TIP12"), cfg[str][0], cfg[str][1]);//StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_TIP4"), (cfgs[i].interval / 10000))//"达到" + (cfgs[i].damage / 10000) + '万伤害'//curIndex == cfgs[i].rank ? str1 : str2
                nameStr = nameStr //+ StringUtils.format(gdk.i18n.t("i18n:ARENATEAM_TIP11"), cfg.rank_limit)
                let temData = { name: nameStr, cfg: cfgs[i] }
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
            this.label3.string = gdk.i18n.t("i18n:GUARDIANTOWER_TIP1")//'段位'
        } else {
            this.rankNode.active = false;
            this.rewardNode.active = true;
            this.label1.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP5")//'名次'
            this.label2.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP8")//'奖励'
            this.label3.string = ''
        }
    }
}
