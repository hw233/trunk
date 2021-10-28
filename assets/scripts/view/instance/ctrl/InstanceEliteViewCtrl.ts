import CopyModel from '../../../common/models/CopyModel';
import CopyUtil from '../../../common/utils/CopyUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import { Copy_stageCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
/** 
 * @Description: 副本奖杯界面控制器
 * @Author: luoyong  
 * @Date: 2020-07-02 14:00:53
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:36:05
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/InstanceEliteViewCtrl")
export default class InstanceEliteViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    subEliteItem: cc.Prefab = null

    @property(cc.Label)
    cupLab: cc.Label = null;

    @property(cc.Node)
    allCupBtn: cc.Node = null;

    list: ListView = null
    prizeList = []

    listData: any[] = []
    curIndex = 0;
    get copyModel() { return ModelManager.get(CopyModel); }

    onLoad() {

    }

    onEnable() {
        NetManager.send(new icmsg.DungeonElitesReq());
        NetManager.on(icmsg.DungeonListRsp.MsgType, this.refreshData, this)
        this.pageSelect(null, 0)
    }

    onDisable() {
        NetManager.targetOff(this)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.subEliteItem,
            cb_host: this,
            resize_cb: this._updateDataLater,
            column: 3,
            gap_x: 20,
            gap_y: 20,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _updateScroll() {
        this._initListView()
        this.listData = []
        this.prizeList.forEach(prize => {
            let data = { prize: prize, curIndex: this.curIndex }
            this.listData.push(data);
        })

        this.list.set_data(this.listData)

        let index = 0

        for (let i = 0; i < this.prizeList.length; i++) {
            let nums = CopyUtil.getEliteStageCurChaterData(this.prizeList[i], this.curIndex)
            //未完成的
            if (nums[0] < nums[1] && CopyUtil.isOpenEliteStageChapter(this.prizeList[i], this.curIndex)) {
                index = i
                break
            }
        }
        this.list.scroll_to(index)
    }

    _updateCupLab() {
        let getNum = 0
        let totalNum = 0;
        let allNum = 0;
        for (let i = 0; i < this.prizeList.length; i++) {
            let nums = CopyUtil.getEliteStageCurChaterData(this.prizeList[i], this.curIndex)
            if (CopyUtil.isOpenEliteStageChapter(this.prizeList[i], this.curIndex)) {
                getNum += nums[0]
                totalNum += nums[1]
            }
            allNum += nums[1]
        }
        this.cupLab.string = `${getNum}/${totalNum}`;
        let add = CopyUtil.getEliteStageCurCupReward();
        this.allCupBtn.active = getNum == allNum && !add;
    }

    pageSelect(event, index) {

        this.curIndex = index;
        let cfgs: Copy_stageCfg[];
        this.prizeList = []
        if (index == 0) {
            cfgs = this.copyModel.eliteNoviceCfgs;
        } else {
            cfgs = this.copyModel.eliteChallengeCfgs;
        }
        for (let i = 0; i < cfgs.length; i++) {
            if (this.prizeList.indexOf(cfgs[i].prize) == -1) {
                this.prizeList.push(cfgs[i].prize)
            }
        }
        this.refreshData();
    }

    refreshData() {
        this._updateCupLab()
        this._updateScroll()
    }

    //领取所有未领取的奖杯奖励
    allCupBtnClick() {
        let msg = new icmsg.DungeonElitesRewardsReq()
        msg.copyId = 12
        NetManager.send(msg, (rsp: icmsg.DungeonElitesRewardsRsp) => {
            GlobalUtil.openRewadrView(rsp.rewards);
            this.copyModel.eliteNoviceBits = rsp.bits;
            this.refreshData();
        })
    }

}