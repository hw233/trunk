import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import RoyalModel from '../../../common/models/RoyalModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { Royal_divisionCfg, Royal_rankingCfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/RoyalArenaRankCtrl")
export default class RoyalArenaRankCtrl extends gdk.BasePanel {
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

    @property(cc.Label)
    label1: cc.Label = null;
    @property(cc.Label)
    label2: cc.Label = null
    @property(cc.Label)
    label3: cc.Label = null

    @property(UiTabMenuCtrl)
    menuCtrl: UiTabMenuCtrl = null;

    @property(cc.Node)
    myRank: cc.Node = null;

    list1: ListView;

    list2: ListView;

    data: icmsg.RoyalFightRankRsp;

    lock: boolean = false;

    serverNum: number = 1;
    reward_type: number = 1;

    _curPage = 1
    _size = 20
    _maxPage = 0
    _showRankDatas = []

    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];

    get model(): RoyalModel { return ModelManager.get(RoyalModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        NetManager.on(icmsg.RoyalFightRankRsp.MsgType, this._onRoyalFightRankRsp, this)
        this._reqDatas()
        this._updateView2()
    }

    _onRoyalFightRankRsp(rsp: icmsg.RoyalFightRankRsp) {
        this._maxPage = Math.ceil(rsp.total / this._size)
        this.data = rsp;
        this._showRankDatas = this._showRankDatas.concat(rsp.rankList)
        //刷新排名信息
        this._updateView1(false)
        this._updateMyRank()
        //刷新排名奖励信息
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
        this.list1.clear_items();
        let list = this._showRankDatas
        GlobalUtil.sortArray(list, (a, b) => {
            return b.score - a.score
        })
        this.list1.set_data(list, resetPos);

    }
    refreshView2() {
        this._updateView2(false);
    }
    _updateView2(resetPos: boolean = true) {
        this._initListView2();
        let allCfgs = ConfigManager.getItems(Royal_rankingCfg)
        let maxServer = allCfgs[allCfgs.length - 1].server
        if (this.model.serverNum > maxServer) {
            this.model.serverNum = maxServer
        }
        let cfgs = ConfigManager.getItems(Royal_rankingCfg, (cfg: Royal_rankingCfg) => {
            if (cfg.type == this.model.rewardType && cfg.server == this.model.serverNum) {
                return true;
            }
            return false;
        })
        let List2Data = []
        if (cfgs.length > 0) {
            for (let i = 0; i < cfgs.length; i++) {
                let cfg = cfgs[i]
                let str = 'rank' //+ serverNum;
                let nameStr = cfg[str][0] == cfg[str][1] ? StringUtils.format(gdk.i18n.t("i18n:ARENATEAM_TIP5"), cfg[str][0]) : StringUtils.format(gdk.i18n.t("i18n:ARENATEAM_TIP12"), cfg[str][0], cfg[str][1]);//StringUtils.format(gdk.i18n.t("i18n:HEROTRIAL_TIP4"), (cfgs[i].interval / 10000))//"达到" + (cfgs[i].damage / 10000) + '万伤害'//curIndex == cfgs[i].rank ? str1 : str2
                let tem = ConfigManager.getItemByField(Royal_divisionCfg, 'division', cfg.requirements)
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
                scroll_to_end_cb: this._endCallFunc,
            })
        }
    }

    _endCallFunc() {
        if (this._curPage < this._maxPage) {
            this._curPage++
            this._reqDatas()
        }
    }

    _reqDatas() {
        let msg = new icmsg.RoyalFightRankReq()
        msg.page = this._curPage
        msg.size = this._size
        NetManager.send(msg);
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
            this.label2.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP10")//'段位'
            this.label3.string = '最强9名英雄'
        } else {
            this.rankNode.active = false;
            this.rewardNode.active = true;
            this.label1.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP5")//'名次'
            this.label2.string = ''
            this.label3.string = gdk.i18n.t("i18n:HEROTRIAL_RANK_TIP8")//'奖励'
        }
    }


    _updateMyRank() {
        let nameLab = cc.find("name", this.myRank).getComponent(cc.Label)
        let lvLab = cc.find("lv", this.myRank).getComponent(cc.Label)

        let head = cc.find("heroSlot/mask/icon", this.myRank)
        let frame = cc.find("heroSlot/iconBg", this.myRank)

        let rankIcon = cc.find("rankSprite", this.myRank)
        let rankLab = cc.find("rankLabel", this.myRank).getComponent(cc.Label)
        let noRank = cc.find("noRank", this.myRank)

        let duanweiSp = cc.find("duanweiSp", this.myRank)
        let scoreLab = cc.find(`sbg/scoreLab`, this.myRank).getComponent(cc.Label)

        nameLab.string = `${this.roleModel.name}`
        lvLab.string = `${this.roleModel.level}`

        GlobalUtil.setSpriteIcon(this.node, head, GlobalUtil.getHeadIconById(this.roleModel.head));
        GlobalUtil.setSpriteIcon(this.node, frame, GlobalUtil.getHeadFrameById(this.roleModel.frame));

        if (this.data.rankNum <= 3 && this.data.rankNum > 0) {
            rankLab.node.active = false;
            rankIcon.active = true;
            noRank.active = false
            let path = this.rankSpriteName[this.data.rankNum - 1];
            GlobalUtil.setSpriteIcon(this.node, rankIcon, path);
        } else {
            rankIcon.active = false;
            if (this.data.rankNum <= 0) {
                rankLab.node.active = false;
                noRank.active = true
            } else {
                noRank.active = false
                rankLab.node.active = true
                rankLab.string = this.data.rankNum + '';
            }
        }

        //设置段位图标
        let div = this.data.div == 0 ? 1 : this.data.div
        let curCfg = ConfigManager.getItemByField(Royal_divisionCfg, 'division', div);
        let path2 = 'view/act/texture/peak/' + curCfg.icon;
        GlobalUtil.setSpriteIcon(this.node, duanweiSp, path2)
        scoreLab.string = `${this.data.score}`
    }

}