import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import StoreModel from '../../store/model/StoreModel';
import TaskUtil from '../../task/util/TaskUtil';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { Mission_welfare2Cfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-06-29 11:46:43 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/KfflAct2View")
export default class KfflAct2View extends gdk.BasePanel {

    // @property(cc.Label)
    // timeLabel: cc.Label = null;

    @property(cc.Label)
    loginDays: cc.Label = null;

    @property(cc.Label)
    rewardNumLabel: cc.Label = null;

    @property(cc.ScrollView)
    taskScrollView: cc.ScrollView = null;

    @property(cc.Node)
    taskContent: cc.Node = null;

    @property(cc.ScrollView)
    progressScrollView: cc.ScrollView = null;

    @property(cc.Node)
    progressContent: cc.Node = null;

    @property(cc.Prefab)
    taskItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    buyBtn: cc.Node = null;

    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    list: ListView = null;
    cfgs: Mission_welfare2Cfg[] = [];
    onEnable() {
        this.cfgs = ConfigManager.getItems(Mission_welfare2Cfg);
        this.buyBtn.active = !ModelManager.get(StoreModel).isBuyWelfare2;
        this.loginDays.string = this.roleModel.loginDays + '';
        let totalNum: number = 0;
        this.cfgs.forEach(cfg => {
            let rewards = cfg.reward;
            for (let i = 0; i < rewards.length; i++) {
                totalNum += rewards[i][1];
            }
        });
        this.rewardNumLabel.string = totalNum + '';
        this._initList();
        NetManager.on(icmsg.PaySuccRsp.MsgType, this._onPaySuccRsp, this);
    }

    onDisable() {
        NetManager.targetOff(this);
        gdk.e.targetOff(this);
        this.list && this.list.destroy();
        this.list = null;
        this.cfgs = [];
    }

    @gdk.binding('roleModel.loginDays')
    _refresh() {
        //跨天
        this.loginDays.string = this.roleModel.loginDays + '';
        this._initList();
    }

    onBuyBtnClik() {
        if (ModelManager.get(StoreModel).isBuyWelfare2) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:KFFL_TIP1"));
            return;
        }
        let req = new icmsg.PayOrderReq();
        req.paymentId = 700004;
        NetManager.send(req);
    }

    _onPaySuccRsp(resp: icmsg.PaySuccRsp) {
        if (resp.paymentId == 700004) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:KFFL_TIP2"));
            this.buyBtn.active = false;
            ModelManager.get(StoreModel).isBuyWelfare2 = true;
        }
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.taskScrollView,
                mask: this.taskScrollView.node,
                content: this.taskContent,
                item_tpl: this.taskItemPrefab,
                cb_host: this,
                async: true,
                gap_y: 5,
                direction: ListViewDir.Vertical,
            })
        }

        this.list.clear_items();
        this.list.set_data(this.cfgs);
        gdk.Timer.callLater(this, () => {
            let bg = this.progressContent.getChildByName('progressBg');
            bg.height = this.taskContent.height - 66;
            this._updateProgress();
            for (let i = 0; i < this.cfgs.length; i++) {
                let loginDays = ModelManager.get(RoleModel).loginDays;
                if (!TaskUtil.getWelfare2TaskState(this.cfgs[i].id) && loginDays >= this.cfgs[i].days) {
                    this.list.scroll_to(i);
                    this.onTaskScroll();
                    return;
                }
                if (loginDays < this.cfgs[i].days) {
                    this.list.scroll_to(Math.max(0, i - 4));
                    this.onTaskScroll();
                    return;
                }
            }
            this.list.scroll_to(Math.max(0, this.cfgs.length - 1));
            this.onTaskScroll();
        })
    }

    onTaskScroll() {
        this.progressContent.y = this.taskContent.y - 6;
    }

    _updateProgress() {
        let bg = this.progressContent.getChildByName('progressBg');
        let bar = bg.getChildByName('progressbar');
        bar.height = 0;
        let cfgs = ConfigManager.getItems(Mission_welfare2Cfg);
        let dl = this.taskContent.height / cfgs.length - 61;
        let loginDays = ModelManager.get(RoleModel).loginDays;
        for (let i = 0; i < cfgs.length; i++) {
            if (cfgs[i].days <= loginDays) {
                bar.height += (i == 0 ? dl : dl + 61);
            }
            else {

                let startIdx = cfgs[i - 1] ? cfgs[i - 1].days : 1;
                let targetIdx = cfgs[i].days;
                let curIdx = loginDays | 1;
                let ddl = (i == 0 ? dl : dl + 61) / (targetIdx - startIdx);
                bar.height += (ddl * (curIdx - startIdx));
                return;
            }
        }
        bar.height = Math.min(bar.height, this.taskContent.height - 66);
    }
}
