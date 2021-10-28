import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import SiegeModel from './SiegeModel';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { networkInterfaces } from 'os';
import { RoleEventId } from '../../../role/enum/RoleEventId';
import { Siege_storeCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-11 17:40:50
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/siege/SiegeStoreCtrl")
export default class SiegeStoreCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Label)
    hasLab: cc.Label = null;

    @property(cc.Node)
    hasIcon: cc.Node = null;

    list: ListView;

    get siegeModel(): SiegeModel { return ModelManager.get(SiegeModel) }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel) }

    _storeList: icmsg.GoodsInfo[] = []

    onEnable() {
        // gdk.e.on(RoleEventId.ROLE_ATT_UPDATE, this._updateStoreMoney, this);
        // NetManager.on(icmsg.SiegeStoreListRsp.MsgType, this._onSiegeStoreListRsp, this)

        // let msg = new icmsg.SiegeStoreListReq()
        // NetManager.send(msg)

        GlobalUtil.setSpriteIcon(this.node, this.hasIcon, GlobalUtil.getIconById(27))
        this._updateStoreMoney()
        this._createEndTime()
    }

    onDisable() {
        gdk.e.targetOff(this)
        NetManager.targetOff(this)
        this._clearEndTime()
    }

    // _onSiegeStoreListRsp(data: icmsg.SiegeStoreListRsp) {
    //     this._storeList = data.list
    //     this._updateStoreView()
    // }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                column: 2,
                gap_x: -2,
                gap_y: 2,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }

    @gdk.binding("siegeModel.storeTimes")
    _refreshStoreView() {
        this._updateStoreView()
    }

    _updateStoreMoney() {
        this.hasLab.string = `${this.roleModel.siege}`
    }

    _updateStoreView(isReset: boolean = false) {
        this._initListView()
        this.list.set_data(this._storeList, isReset)
    }

    _createEndTime() {
        this._updateEndTime()
        this._clearEndTime()
        this.schedule(this._updateEndTime, 1)
    }

    _updateEndTime() {
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let curZero = TimerUtils.getZerohour(curTime)//当天0点
        let leftTime = curZero + 86400 - curTime
        if (leftTime > 0) {
            this.timeLab.string = TimerUtils.format4(leftTime)
        } else {
            this.timeLab.string = ""
        }
    }

    _clearEndTime() {
        this.unschedule(this._updateEndTime)
    }
}