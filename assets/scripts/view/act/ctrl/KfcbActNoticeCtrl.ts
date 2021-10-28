import ActivityModel from '../model/ActivityModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import TrialInfo from '../../instance/trial/model/TrialInfo';
import { Copy_stageCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
 * 开服冲榜
 * @Author: luoyong  
 * @Description: 
 * @Date: 2019-12-13  09:57:55 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-06 10:55:32
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/KfcbActNoticeCtrl")
export default class KfcbActNoticeCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    noticeItem: cc.Prefab = null

    @property(cc.Node)
    myFrame: cc.Node = null

    @property(cc.Node)
    myHead: cc.Node = null

    @property(cc.Label)
    myLvLab: cc.Label = null

    @property(cc.Label)
    myName: cc.Label = null

    @property(cc.Label)
    myStageName: cc.Label = null

    @property(cc.Label)
    myCurPercent: cc.Label = null

    @property(cc.Label)
    myChangePercent: cc.Label = null

    @property(cc.Label)
    leftTime: cc.Label = null

    @property(cc.Node)
    arrow: cc.Node = null

    list: ListView = null;

    get model(): ActivityModel { return ModelManager.get(ActivityModel) }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel) }
    get copyModel(): CopyModel { return ModelManager.get(CopyModel) }
    get trialInfo(): TrialInfo { return ModelManager.get(TrialInfo) }

    onEnable() {
        let msg = new icmsg.ActivityRankingInfoReq();
        NetManager.send(msg);
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.noticeItem,
            cb_host: this,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    @gdk.binding("model.kfcb_ranksInfo")
    _updateViewInfo() {
        this._initListView()

        let list = this.model.kfcb_ranksInfo
        let newList = []
        for (let i = 0; i < list.length; i++) {
            newList.push({ rank: i + 1, info: list[i] })
        }
        this.list.set_data(newList)
        GlobalUtil.setSpriteIcon(this.node, this.myHead, GlobalUtil.getHeadIconById(this.roleModel.head))
        this.myName.string = this.roleModel.name
        this.myLvLab.string = `${this.roleModel.level}`
        let cfg = this.trialInfo.nextStage//ConfigManager.getItemById(Copy_stageCfg, this.trialInfo.nextStage)
        if (cfg) {
            let stageCfg = ConfigManager.getItemById(Copy_stageCfg, cfg.pre_condition)
            if (stageCfg) {
                this.myStageName.string = stageCfg.name.split(" ")[0]
            } else {
                this.myStageName.string = gdk.i18n.t("i18n:KFCB_TIP1")
            }
        }

        this.myCurPercent.string = `${this.model.kfcb_percent7}${gdk.i18n.t("i18n:KFCB_TIP2")}`
        let changPercent = this.model.kfcb_percent7 - this.model.kfcb_history1
        if (changPercent > 0) {
            GlobalUtil.setSpriteIcon(this.node, this.arrow, "view/act/texture/kfcb/gh_xiajiang")
            this.myChangePercent.string = `${changPercent}`
        } else {
            GlobalUtil.setSpriteIcon(this.node, this.arrow, "view/act/texture/kfcb/gh_shangsheng")
            this.myChangePercent.string = `${Math.abs(changPercent)}`
        }

        let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let serverOpenTime = GlobalUtil.getServerOpenTime()
        let leftTime = serverOpenTime + 3600 * 24 * 7 - serverTime
        if (leftTime > 0) {
            this.leftTime.string = `${TimerUtils.format1(leftTime)}`
        } else {
            this.leftTime.string = gdk.i18n.t("i18n:KFCB_TIP3")
        }
    }

    openRewardView() {
        this.close()
        gdk.panel.open(PanelId.KfcbActView)
    }

    openTowerView() {
        this.close()
        gdk.panel.open(PanelId.TowerPanel)
    }
}
