import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StoreModel from '../../model/StoreModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import VipDescItemCtrl from './VipDescItemCtrl';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { VipCfg } from '../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-25 14:31:01
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/recharge/RechargeVIPCtrl")
export default class RechargeVIPCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    tabScrollView: cc.ScrollView = null;

    @property(cc.Node)
    tabContent: cc.Node = null;

    @property(cc.Prefab)
    tabItemPrefab: cc.Prefab = null;

    @property(cc.ScrollView)
    rewardScrollView: cc.ScrollView = null;

    @property(cc.Node)
    rewardContent: cc.Node = null;

    @property(cc.Node)
    rewardContent2: cc.Node = null;

    @property(cc.Prefab)
    rewardItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    descContent: cc.Node = null;

    @property(cc.Prefab)
    descItemPrefab: cc.Prefab = null;

    @property(cc.Label)
    rechargeLab: cc.Label = null;

    @property(cc.Label)
    curVipNum: cc.Label = null;

    @property(cc.Label)
    nextVipNum: cc.Label = null;

    @property(cc.Label)
    selectVipNum: cc.Label = null;

    @property(cc.Node)
    buyNode: cc.Node = null;

    @property(cc.Node)
    sellout: cc.Node = null;

    @property(cc.Label)
    oldCostLab: cc.Label = null;

    @property(cc.Label)
    costLab: cc.Label = null;

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

    @property(cc.Label)
    midTotalRecharge: cc.Label = null;

    @property(cc.Node)
    btnGo: cc.Node = null;

    @property(cc.Node)
    btnRedPoint: cc.Node = null;

    tabList: ListView;
    rewardList: ListView;
    _curSelectVipCfg: VipCfg

    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    onEnable() {
        NetManager.on(icmsg.RoleVipBuyGiftRsp.MsgType, this._onRoleVipBuyGiftRsp, this)
        NetManager.on(icmsg.RoleVipMCDailyRewardsRsp.MsgType, this._onRoleVipMCDailyRewardsRsp, this)

        this._initCurVipInfo()
        this._initTabList()
        let lv = this.args[0] || this.roleModel.vipLv;
        this.tabList.select_item(lv)
        this.tabList.scroll_to(this.tabList.selected_index)
    }

    onDisable() {
        NetManager.targetOff(this)
    }

    _initCurVipInfo() {
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

        this._updateMonthCardState()

    }

    _initTabList() {
        if (!this.tabList) {
            this.tabList = new ListView({
                scrollview: this.tabScrollView,
                mask: this.tabScrollView.node,
                content: this.tabContent,
                item_tpl: this.tabItemPrefab,
                cb_host: this,
                async: true,
                gap_y: 10,
                direction: ListViewDir.Vertical,
            })
        }
        let vipCfgs = ConfigManager.getItems(VipCfg)
        let tempCfgs = []
        for (let i = 0; i < vipCfgs.length; i++) {
            if (vipCfgs[i].requirements && this.roleModel.vipLv < vipCfgs[i].requirements) {
                continue
            }
            tempCfgs.push(vipCfgs[i])
        }
        this.tabList.set_data(tempCfgs)
        this.tabList.onClick.on(this._onVipTabClick, this)
    }

    _onVipTabClick(cfg: VipCfg) {
        this._curSelectVipCfg = cfg
        this.selectVipNum.string = `${cfg.level}`
        this.oldCostLab.string = `${cfg.price[1]}`
        this.costLab.string = `${cfg.discount[1]}${gdk.i18n.t('i18n:FUNDS_TIP1')}`

        this._updateRewardContent()
        this._updateRewardContent2()
        this._updateVipDesc()
        this._updateBtnState()
    }

    _updateRewardContent() {
        this.rewardContent.removeAllChildren()
        let rewards = this._curSelectVipCfg.rewards
        for (let i = 0; i < rewards.length; i++) {
            let item = cc.instantiate(this.rewardItemPrefab)
            item.scale = 0.8
            this.rewardContent.addChild(item)
            let ctrl = item.getComponent(UiSlotItem)
            ctrl.updateItemInfo(rewards[i][0], rewards[i][1])
            ctrl.itemInfo = {
                series: rewards[i][0],
                itemId: rewards[i][0],
                type: BagUtils.getItemTypeById(rewards[i][0]),
                itemNum: 1,
                extInfo: null,
            }
        }
    }

    _updateRewardContent2() {
        this.rewardContent2.removeAllChildren()
        let rewards = this._curSelectVipCfg.vip1
        for (let i = 0; i < rewards.length; i++) {
            let item = cc.instantiate(this.rewardItemPrefab)
            item.scale = 0.8
            let ctrl = item.getComponent(UiSlotItem)
            ctrl.updateItemInfo(rewards[i][0], rewards[i][1])
            ctrl.itemInfo = {
                series: rewards[i][0],
                itemId: rewards[i][0],
                type: BagUtils.getItemTypeById(rewards[i][0]),
                itemNum: 1,
                extInfo: null,
            }
            this.rewardContent2.addChild(item)
        }
    }

    _updateVipDesc() {
        let des = this._curSelectVipCfg.des
        let datas = des.split("<br>")
        this.descContent.removeAllChildren()

        let preCfg = ConfigManager.getItemByField(VipCfg, "level", this._curSelectVipCfg.level - 1)
        if (preCfg) {
            this.midTotalRecharge.string = `${preCfg.exp}`
        } else {
            this.midTotalRecharge.string = `${0}`
        }

        for (let i = 0; i < datas.length; i++) {
            let item = cc.instantiate(this.descItemPrefab)
            let ctrl = item.getComponent(VipDescItemCtrl)
            ctrl.updateViewInfo(datas[i], this._curSelectVipCfg.show.indexOf(i + 1) != -1)
            this.descContent.addChild(item)
        }

        let srollView = this.descContent.parent.getComponent(cc.ScrollView)
        srollView.stopAutoScroll()
        srollView.scrollToTop()
    }

    _updateBtnState() {
        let state = !!(this.roleModel.vipGiftBoughtFlag & Math.pow(2, this._curSelectVipCfg.level))

        this.buyNode.active = !state
        this.sellout.active = state

        let preCfg = ConfigManager.getItemByField(VipCfg, "level", this._curSelectVipCfg.level - 1)
        let needExp = 0
        if (preCfg) {
            needExp = preCfg.exp
        }
        this.btnRedPoint.active = !state && this.roleModel.vipExp >= needExp && JumpUtils.ifSysOpen(2851)
    }

    @gdk.binding("roleModel.mcRewardTime")
    @gdk.binding("storeModel.monthCardListInfo")
    _updateMonthCardState() {
        GlobalUtil.setAllNodeGray(this.btnGo, 0)
        let label = this.btnGo.getChildByName("label").getComponent(cc.Label)
        if (this.storeModel.isMonthCardActive(500002)) {
            if (TimerUtils.isCurDay(this.roleModel.mcRewardTime)) {
                label.string = gdk.i18n.t('i18n:MAIL_TIP1')
                GlobalUtil.setAllNodeGray(this.btnGo, 1)
            } else {
                label.string = gdk.i18n.t('i18n:MAIL_TIP2')
            }
        } else {
            label.string = gdk.i18n.t('i18n:RECHARGE_TIP9')
        }
    }

    buyVipFunc() {
        if (this.roleModel.vipLv < this._curSelectVipCfg.level) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t('i18n:RECHARGE_TIP10'), this._curSelectVipCfg.level))
            return
        }
        let msg = new icmsg.RoleVipBuyGiftReq()
        msg.vipLv = this._curSelectVipCfg.level
        NetManager.send(msg)
    }

    _onRoleVipBuyGiftRsp(data: icmsg.RoleVipBuyGiftRsp) {
        this.roleModel.vipGiftBoughtFlag = data.boughtFlag
        this._updateBtnState()
        this.tabList.refresh_item(this.tabList.selected_index)
        GlobalUtil.openRewadrView(data.goodsList)
    }

    openMonthCard() {
        if (this.storeModel.isMonthCardActive(500002)) {
            if (TimerUtils.isCurDay(this.roleModel.mcRewardTime)) {
                GlobalUtil.showMessageAndSound(gdk.i18n.t('i18n:RECHARGE_TIP11'))
            } else {
                let msg = new icmsg.RoleVipMCDailyRewardsReq()
                NetManager.send(msg)
            }
        } else {
            gdk.panel.setArgs(PanelId.TradingPort, 12);
            gdk.panel.open(PanelId.TradingPort, () => {
                gdk.panel.setArgs(PanelId.MonthCard, 1)
                gdk.panel.open(PanelId.MonthCard)
            });
        }
    }

    _onRoleVipMCDailyRewardsRsp(data: icmsg.RoleVipMCDailyRewardsRsp) {
        GlobalUtil.openRewadrView(data.goodsList)
        let msg2 = new icmsg.RoleVipBoughtFlagReq()
        NetManager.send(msg2)
    }
}