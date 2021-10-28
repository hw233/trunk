import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import StoreModel from '../../model/StoreModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Store_chargeCfg, VipCfg } from '../../../../a/config';
import { StoreEventId } from '../../enum/StoreEventId';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-22 11:23:46
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/recharge/RechargeCZCtrl")
export default class RechargeCZCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    //充值界面-充值栏的item
    @property(cc.Prefab)
    storeRechargeItem: cc.Prefab = null

    @property(cc.Label)
    rechargeLab: cc.Label = null;

    @property(cc.Label)
    curVipNum: cc.Label = null;

    @property(cc.Label)
    nextVipNum: cc.Label = null;

    @property(cc.Label)
    proBarLab: cc.Label = null;

    @property(cc.Node)
    proBarBg: cc.Node = null;

    @property(cc.Node)
    proBarMask: cc.Node = null;

    @property(cc.Node)
    curTitle: cc.Node = null;

    @property(cc.Node)
    vipInfo: cc.Node = null;

    list: ListView = null

    typeSelect: number = 0

    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }
    get serverModel(): ServerModel { return ModelManager.get(ServerModel); }
    get copyModel(): CopyModel { return ModelManager.get(CopyModel); }

    onEnable() {
        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._updatePaySucc, this)
        this._updateStoreScroll()
        this._initVipInfo()
    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    //充值成功
    _updatePaySucc(e: gdk.Event) {
        //弹出 充值成功 的提示
        // gdk.gui.showMessage(gdk.i18n.t('i18n:ADVENTURE_TIP38'))
        GlobalUtil.openRewadrView(e.data.list)
    }

    _initListView() {
        if (this.list) {
            this.list.destroy()
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.storeRechargeItem,
            cb_host: this,
            async: true,
            column: 3,
            gap_x: -10,
            gap_y: 10,
            direction: ListViewDir.Vertical,
        })
    }

    _updateStoreScroll() {
        this._initListView()
        let list = []
        let rechargeList = this.storeModel.rechargeList
        let items = ConfigManager.getItems(Store_chargeCfg)
        for (let index = 0; index < items.length; index++) {
            const cfg = items[index];
            let info = false;
            if (rechargeList.indexOf(cfg.id) != -1) {
                info = true;
            }
            list.push({ pos: index, cfg: cfg, info: info })
        }
        this.list.set_data(list, false)
    }

    @gdk.binding("roleModel.vipExp")
    _initVipInfo() {
        this.curVipNum.string = `${this.roleModel.vipLv}`
        this.nextVipNum.string = `${this.roleModel.vipLv + 1}`
        let curCfg = ConfigManager.getItemByField(VipCfg, "level", this.roleModel.vipLv)
        if (!curCfg.exp || curCfg.exp < 0) {
            this.vipInfo.active = false
            curCfg = ConfigManager.getItemByField(VipCfg, "level", this.roleModel.vipLv - 1)
        }

        this.rechargeLab.string = `${curCfg.exp - this.roleModel.vipExp}`.replace('.', '/')
        this.proBarLab.string = `${this.roleModel.vipExp}/${curCfg.exp}`
        this.proBarMask.width = this.proBarBg.width * (this.roleModel.vipExp / curCfg.exp)
        let path = `view/store/textrue/recharge/vip/${curCfg.resources}`
        GlobalUtil.setSpriteIcon(this.node, this.curTitle, path)
    }

}