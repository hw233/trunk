import ActUtil from '../../act/util/ActUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import ServerModel from '../../../common/models/ServerModel';
import SignModel from '../model/SignModel';
import SignUtil from '../util/SignUtil';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { SignCfg } from '../../../a/config';

/** 
  * @Description: 签到界面
  * @Author: weiliang.huang  
  * @Date: 2019-06-14 21:12:37 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-01-23 13:48:04
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/sign/SignViewCtrl")
export default class SignViewCtrl extends gdk.BasePanel {

    // @property(cc.Label)
    // dayLab: cc.Label = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    signItem: cc.Prefab = null

    list: ListView = null;
    cfgList: SignCfg[] = []
    ifInit: boolean = true

    get model(): SignModel { return ModelManager.get(SignModel); }
    get serModel(): ServerModel { return ModelManager.get(ServerModel); }

    onEnable() {
        this._initSignView()
    }

    onDestroy() {
        if (this.list) {
            this.list.destroy()
        }
    }

    onDisable() {
        //已签到 已显示 关闭显示冲榜信息
        if (this.model.signed && this.model.showSign) {
            this.model.showSign = false
            let serverTime = Math.floor(GlobalUtil.getServerTime() / 1000)
            let serverOpenTime = GlobalUtil.getServerOpenTime()
            let startTime = serverOpenTime + 3600 * 24 * 1 - serverTime
            let endtime = serverOpenTime + 3600 * 24 * 8 - serverTime
            if (startTime < 0 && endtime > 0 && ActUtil.isShowKfcbNotice()) {
                gdk.panel.open(PanelId.KfcbActNotice)
            }
        }
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.signItem,
            cb_host: this,
            column: 4,
            gap_x: 25,
            gap_y: 28,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    _initSignView() {
        this._initListView()
        let day = SignUtil.getCountDays()
        let cfgs = SignUtil.getSignCfgs()
        let list = []
        for (let index = 0; index < day; index++) {
            const element = cfgs[index];
            list.push(element)
        }
        this.cfgList = list
    }

    // @gdk.binding("model.bu_count")
    @gdk.binding("model.count")
    _updateSignView() {
        if (!this.model.signed && this.ifInit) {
            this.scheduleOnce(() => {
                NetManager.send(new icmsg.SignLoginReq())
            })
            return
        }
        this.list.set_data(this.cfgList, this.ifInit)
        this.ifInit = false

        // this.dayLab.string = `${this.model.count}`
    }
}
