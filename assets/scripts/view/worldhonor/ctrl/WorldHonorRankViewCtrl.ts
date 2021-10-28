import { Arenahonor_rank_showCfg, Headframe_titleCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import PanelId from '../../../configs/ids/PanelId';
import WorldHonorRankItem2Ctrl from './WorldHonorRankItem2Ctrl';


/**
 * enemy世界巅峰赛比赛结果界面
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-06-29 11:56:41
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/worldhonor/WorldHonorRankViewCtrl")
export default class WorldHonorRankViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    titleSp: cc.Node = null;

    @property(cc.Node)
    arenaNode: cc.Node = null;
    @property(cc.Node)
    worldNode: cc.Node = null;

    @property(UiTabMenuCtrl)
    stateMenu: UiTabMenuCtrl = null;

    @property(cc.ScrollView)
    scrollView1: cc.ScrollView = null;

    @property(cc.Node)
    content1: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab1: cc.Prefab = null;

    @property(cc.Node)
    goBtn: cc.Node = null;

    @property(cc.ScrollView)
    scrollView2: cc.ScrollView = null;

    @property(cc.Node)
    content2: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab2: cc.Prefab = null;

    @property(cc.Node)
    leftBtn: cc.Node = null;
    @property(cc.Node)
    rightBtn: cc.Node = null;
    @property(cc.Node)
    titleIcon: cc.Node = null;
    @property(cc.Label)
    titletip: cc.Label = null;

    myIndex: number = -1;

    list1: ListView;

    list2: ListView;
    stateNum: number = -1;


    curRankData: icmsg.ArenaHonorRanking[] = []

    arenaRewards: Arenahonor_rank_showCfg[] = [];
    worldRewards: Arenahonor_rank_showCfg[] = []
    curRewards: Arenahonor_rank_showCfg[] = [];
    curIndex: number = 0;
    get roleModel(): RoleModel {
        return ModelManager.get(RoleModel)
    }

    titleSpStrs: string[] = ['view/worldhonor/texture/sjdfs_rongyaodianfengbang', 'view/worldhonor/texture/sjdfs_shijiedianfengbang']
    onEnable() {

        //获取奖励信息
        this.arenaRewards = ConfigManager.getItems(Arenahonor_rank_showCfg, (cfg: Arenahonor_rank_showCfg) => {
            if (cfg.subtype == 1) {
                return true;
            }
        })
        this.worldRewards = ConfigManager.getItems(Arenahonor_rank_showCfg, (cfg: Arenahonor_rank_showCfg) => {
            if (cfg.subtype == 2) {
                return true;
            }
        })

        let args = gdk.panel.getArgs(PanelId.WorldHonorRankView);
        if (args) {
            this.arenaNode.active = false;
            this.worldNode.active = false;
            this.stateNum = args[0];
            this.stateMenu.showSelect(this.stateNum);
            if (this.stateNum == 0) {
                let msg = new icmsg.ArenaHonorRankingReq()
                msg.world = false;
                NetManager.send(msg, (rsp: icmsg.ArenaHonorRankingRsp) => {
                    this.arenaNode.active = true;
                    this.worldNode.active = false;
                    this.curRankData = rsp.list;
                    this.myIndex = -1;
                    this._updateView1()
                }, this);
            } else {
                let msg = new icmsg.ArenaHonorRankingReq()
                msg.world = true;
                NetManager.send(msg, (rsp: icmsg.ArenaHonorRankingRsp) => {
                    this.arenaNode.active = false;
                    this.worldNode.active = true;
                    this.curRankData = rsp.list;
                    this.myIndex = rsp.mine - 1;
                    this._updateView2()
                }, this);
            }
            GlobalUtil.setSpriteIcon(this.node, this.titleSp, this.titleSpStrs[this.stateNum]);
        }



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
        gdk.Timer.clearAll(this);
    }

    _updateView1(resetPos: boolean = true) {
        this._initListView1();

        let data = [];

        for (let i = 0; i < Math.max(10, this.curRankData.length); i++) {
            let obj = {
                rankInfo: this.curRankData[i] || null,
                rank: i + 1,
                index: i,
            };
            data.push(obj);
        }
        this.list1.clear_items();
        this.list1.set_data(data, resetPos);
        this.refreshGoBtnShow()
        this.curRewards = this.arenaRewards;
        this.curIndex = 0;
        this.refreshRewardData();

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


    _updateView2(resetPos: boolean = true) {
        this._initListView2();

        let temData = [];
        this.curRankData.forEach((data, index) => {
            let tem = { playerInfo: data.brief, rank: index + 1, index: index, guildName: data.guildName };
            temData.push(tem);
        })
        this.list2.clear_items();
        this.list2.set_data(temData, resetPos);

        this.refreshGoBtnShow()
        this.curRewards = this.worldRewards;
        this.curIndex = 0;
        this.refreshRewardData();
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
        this.scrollView2.node.on("scrolling", this.on_scrolling, this);
    }


    on_scrolling() {
        gdk.Timer.once(20, this, this.refreshGoBtnShow);
    }


    refreshRewardData() {
        let temCfg = this.curRewards[this.curIndex];
        let headFCfg = ConfigManager.getItemByField(Headframe_titleCfg, 'title_id', temCfg.title)
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, GlobalUtil.getHeadTitleById(headFCfg.id));

        this.leftBtn.active = this.curIndex - 1 >= 0;
        this.rightBtn.active = this.curIndex + 1 < this.curRewards.length;
        this.titletip.string = temCfg.paper;
        if (this.roleModel.titleList[headFCfg.id]) {
            GlobalUtil.setGrayState(this.titletip, 0)
        } else {
            GlobalUtil.setGrayState(this.titletip, 1)
        }
    }

    changeRewardBtnClick(e: any, str: string) {
        if (str == 'left') {
            this.curIndex -= 1;
            this.curIndex = Math.max(0, this.curIndex)
            this.refreshRewardData();

        } else {
            this.curIndex += 1;
            this.curIndex = Math.min(this.curIndex, this.curRewards.length - 1)
            this.refreshRewardData();
        }
    }

    refreshGoBtnShow() {
        let have = false;
        if (this.myIndex < 0) {
            this.goBtn.active = false;
            return;
        }
        if (this.scrollView2.content.childrenCount > 0) {
            this.scrollView2.content.children.forEach(node => {
                let ctrl = node.getComponent(WorldHonorRankItem2Ctrl)
                if (ctrl.data.index == this.myIndex) {
                    have = true;
                }
            })
        }
        this.goBtn.active = !have;
    }

    goBtnClicl() {
        this.list2.scroll_to(this.myIndex);
    }

    statePageSelect(event, index, refresh: boolean = false) {
        if (this.stateNum == index) return;
        this.stateNum = index;
        if (this.stateNum == 0) {
            let msg = new icmsg.ArenaHonorRankingReq()
            msg.world = false;
            NetManager.send(msg, (rsp: icmsg.ArenaHonorRankingRsp) => {
                this.arenaNode.active = true;
                this.worldNode.active = false;
                this.curRankData = rsp.list;
                this.myIndex = -1;
                this._updateView1();
            }, this);
        } else {
            let msg = new icmsg.ArenaHonorRankingReq()
            msg.world = true;
            NetManager.send(msg, (rsp: icmsg.ArenaHonorRankingRsp) => {
                this.arenaNode.active = false;
                this.worldNode.active = true;
                this.curRankData = rsp.list;
                this.myIndex = rsp.mine - 1;
                this._updateView2()
            }, this);
        }
        GlobalUtil.setSpriteIcon(this.node, this.titleSp, this.titleSpStrs[this.stateNum]);
    }

}
