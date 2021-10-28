import ActUtil from '../../act/util/ActUtil';
import BagUtils from '../../../common/utils/BagUtils';
import ChampionModel from '../../champion/model/ChampionModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import FootHoldModel from '../../guild/ctrl/footHold/FootHoldModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel, { AttTypeName } from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import ShaderHelper from '../../../common/shader/ShaderHelper';
import SiegeModel from '../../guild/ctrl/siege/SiegeModel';
import StoreModel from '../model/StoreModel';
import StoreUtils from '../../../common/utils/StoreUtils';
import StringUtils from '../../../common/utils/StringUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import { AskInfoCacheType } from '../../../common/widgets/AskPanel';
import { BagEvent } from '../../bag/enum/BagEvent';
import { BagItem, BagType } from '../../../common/models/BagModel';
import {
    GlobalCfg,
    Siege_globalCfg,
    Store_chargeCfg,
    Store_giftCfg,
    Store_monthcardCfg,
    Store_runeCfg,
    StoreCfg,
    SystemCfg,
    Unique_globalCfg
    } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { RoleEventId } from '../../role/enum/RoleEventId';
import { StoreEventId } from '../enum/StoreEventId';
import { StoreType } from '../enum/StoreType';
/** 
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-10-13 19:44:20
  * @Date: 2019-05-22 15:39:53 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-29 11:45:46
*/

const { ccclass, property, menu } = cc._decorator;

type TitleType = {
    type: StoreType,
    title: String,
    costType: number[],
}

export type GiftBuyInfo = {
    id: number,
    count: number,
}

type GiftDataType = {
    cfg: Store_giftCfg,
    info: GiftBuyInfo,
}

export enum MoneyType {
    Exp = 1,//经验
    Diamond = 2,//钻石
    Gold = 3,//金币
    HeroExp = 10,//英雄升级经验
    VipExp = 18,//vip经验
    Costume = 25,//神装积分
    Guardian = 29,//守护者积分
}

export enum StoreMenuType {
    Secret = 0,//神秘商店
    Gift = 1,//礼包
    Gold = 2,//金币
    Diamond = 3,//钻石
}

export enum StoreBaseScoreTabType {
    BlackStore = 0,//黑市
    Hero = 1,//英雄积分
    Arena = 2,//竞技（竞技场）
    Turntable = 3,//探宝积分
    Guild = 4,//公会积分
    Survival = 5,//生存积分
    Rune = 6,//符文积分
    Uniqu = 7,//专属装备
    Costume = 8,// 神装
}

export enum StoreActScoreTabType {
    Team = 0, //组队赛
    Siege = 1,//丧尸攻城
    Guardian = 2,//护使秘境
    ArenaHonor = 3,//荣耀赛积分
    Expedition = 4,//团队远征
    Ultimate = 5,//终极试炼
}

@ccclass
@menu("qszc/view/store/StoreViewCtrl")
export default class StoreViewCtrl extends gdk.BasePanel {

    @property(cc.Button)
    menuBtns: cc.Button[] = []

    @property(cc.Button)
    typeBtns: cc.Button[] = []

    @property(cc.Node)
    typeBtnNode: cc.Node = null

    @property(cc.Node)
    shopIcon: cc.Node = null

    @property(cc.Node)
    shopName: cc.Node = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    storeHItem: cc.Prefab = null

    @property(cc.Node)
    refreshPanel: cc.Node = null

    @property(cc.Node)
    tips: cc.Node = null;

    @property(cc.Label)
    refreshLab: cc.Label = null

    @property(cc.Label)
    totalLab: cc.Label = null

    @property(cc.Button)
    refreshBtn: cc.Button = null

    @property(cc.Node)
    costIcon: cc.Node = null

    @property(cc.Label)
    costLab: cc.Label = null

    @property(cc.Label)
    btnLab: cc.Label = null

    @property(cc.Label)
    timeLab: cc.Label = null

    @property(cc.Prefab)
    storeGiftItem: cc.Prefab = null

    @property(cc.Node)
    giftPanel: cc.Node = null;

    //充值界面-充值栏的item
    @property(cc.Prefab)
    storeRechargeItem: cc.Prefab = null
    //充值界面-特权卡栏的item
    @property(cc.Prefab)
    monthCardItem: cc.Prefab = null

    @property(cc.Node)
    moneyIcon: cc.Node = null

    @property(cc.Node)
    moneyAdd: cc.Node = null

    @property(cc.Label)
    moneyLab: cc.Label = null

    @property(cc.Node)
    diamondIcon: cc.Node = null

    @property(cc.Node)
    diamondAdd: cc.Node = null

    @property(cc.Label)
    diamondLab: cc.Label = null

    @property(cc.Node)
    indexPanel: cc.Node = null;

    /**货币类型 2钻石 3 金币 4优精钢 5 良精钢 6 竞技点 7友谊点 8皮肤券 9公会积分 */
    storeTitleConfig = [
        [{ type: 1, title: gdk.i18n.t('i18n:STORE_TIP18'), costType: [2, 3], isShow: true, sysId: 1703, bindId: 0, panelId: null },
        //{ type: StoreType.FRIEND, title: gdk.i18n.t('i18n:STORE_TIP19'), costType: [2, 7], isShow: false, sysId: 1705, bindId: 0, panelId: null },
        { type: 4, title: gdk.i18n.t('i18n:RECHARGE_TIP5'), costType: [2, 21], isShow: true, sysId: 1709, bindId: 11004, panelId: null },
        { type: 3, title: gdk.i18n.t('i18n:STORE_TIP20'), costType: [2, 6], isShow: true, sysId: 1704, bindId: 11005, panelId: null },
        { type: 7, title: gdk.i18n.t('i18n:STORE_TIP21'), costType: [2, 19], isShow: true, sysId: 1710, bindId: 11006, panelId: null },
        { type: 6, title: gdk.i18n.t('i18n:STORE_TIP22'), costType: [2, 9], isShow: true, sysId: 1708, bindId: 11007, panelId: null },
        { type: 5, title: gdk.i18n.t('i18n:STORE_TIP23'), costType: [2, 17], isShow: true, sysId: 1706, bindId: 11008, panelId: null },
        { type: 10, title: gdk.i18n.t('i18n:STORE_TIP24'), costType: [2, 110010], isShow: true, sysId: 1720, bindId: 11009, panelId: null },
        { type: 21, title: gdk.i18n.t('i18n:STORE_TIP49'), costType: [36, 35], isShow: true, sysId: 1726, bindId: 0, panelId: null },
        { type: 14, title: gdk.i18n.t('i18n:RECHARGE_TIP6'), costType: [2, 25], isShow: true, sysId: 1721, bindId: 0, panelId: null }
        ],

        // Hero = 0,//英雄积分
        // Arena = 1,//竞技（竞技场）
        // Turntable = 2,//探宝积分
        // Guild = 3,//公会积分
        // Survival = 4,//生存积分
        // Rune = 5,//符文积分
        // Rune = 17,//护使秘境

        [{ type: 15, title: gdk.i18n.t('i18n:STORE_TIP35'), costType: [2, 26], isShow: true, sysId: 1722, bindId: 0, panelId: null },
        { type: 16, title: gdk.i18n.t('i18n:STORE_TIP38'), costType: [2, 27], isShow: true, sysId: 2870, bindId: 0, panelId: null },
        { type: 17, title: gdk.i18n.t('i18n:STORE_TIP40'), costType: [2, 29], isShow: true, sysId: 1723, bindId: 0, panelId: null },
        { type: 18, title: gdk.i18n.t('i18n:STORE_TIP41'), costType: [31, 32], isShow: true, sysId: 2923, bindId: 0, panelId: null },
        { type: 19, title: gdk.i18n.t('i18n:STORE_TIP42'), costType: [2, 33], isShow: true, sysId: 2925, bindId: 0, panelId: null },
        { type: 20, title: gdk.i18n.t('i18n:STORE_TIP47'), costType: [2, 34], isShow: true, sysId: 2949, bindId: 0, panelId: null },
        ],

        [{ type: StoreType.GEMS, title: "", costType: [2, 3], isShow: true, sysId: null, bindId: 0, panelId: null }],

        [{ type: StoreType.MF, title: gdk.i18n.t('i18n:STORE_TIP46'), costType: [2, 3], isShow: true, sysId: null, bindId: 0, panelId: PanelId.RechargeMF }],
    ]

    list: ListView = null
    menuSelect: number = 0
    typeSelect: number = 0
    curTitle: TitleType = null
    refreshCfg: number[] = []   // [刷新时间间隔，刷新消耗钻石，刷新次数上限，刷新物品数量，免费刷新次数]

    giftList: ListView = null
    giftItemWidth = 160
    perRowNum = 4 //商品每行数量

    shopNameArr = ["text_shenqishangdian", "text_jifenshangdian", "text_zhuangshishangdian", "text_chonzhishangdian"]

    freeGift: any = {}; // tab-giftId
    dailyGiftId: number[] = [];//每日商店礼包id （不包括免费）
    isRefreshBlackInfo: boolean = false;
    isRefreshRuneInfo: boolean = false;

    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get model(): StoreModel { return ModelManager.get(StoreModel); }
    get serverModel(): ServerModel { return ModelManager.get(ServerModel); }
    get copyModel(): CopyModel { return ModelManager.get(CopyModel); }

    onLoad() {

        let cfg = ConfigManager.getItemById(GlobalCfg, "store_refresh")
        this.refreshCfg = cfg.value
        this.title = 'i18n:STORE_TITLE'

        gdk.e.on(StoreEventId.UPDATE_SHOP_INFO, this._updateStoreInfo, this)
        gdk.e.on(StoreEventId.UPDATE_BLACK_ITEM, this._updateOneBlackItem, this)
        gdk.e.on(StoreEventId.UPDATE_SHOP_ITEM, this._updateOneStoreItem, this)
        gdk.e.on(StoreEventId.UPDATE_SIEGE_SHOP_ITEM, this._updateOneSiegeStoreItem, this)
        gdk.e.on(StoreEventId.UPDATE_UNIQUE_SHOP_ITEM, this._updateOneUniqueStoreItem, this)
        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._updatePaySucc, this)
        gdk.e.on(StoreEventId.UPDATE_MONTHCARD_RECEIVE, this._updateStoreInfo, this);
        gdk.e.on(StoreEventId.UPDATE_RUNE_ITEM, this._updateRuneItem, this);

        let cfgs = ConfigManager.getItems(Store_giftCfg);
        cfgs.forEach(cfg => {
            if (cfg.tab == 1 && cfg.RMB_cost > 0) {
                this.dailyGiftId.push(cfg.gift_id);
            }
            if (cfg.RMB_cost == 0) {
                this.freeGift[cfg.tab] = cfg.gift_id;
            }
        })
    }

    onEnable() {
        gdk.e.on(RoleEventId.ROLE_ATT_UPDATE, this._updateMoneyNum, this)
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateMoneyNum, this)
        let args = this.args
        let select = 0
        if (args && args.length > 0) {
            select = args[0];
        }
        this.initMenuBtnState();

        if (!this.menuBtns[select].node.active) {
            for (let i = 0; i < this.menuBtns.length; i++) {
                if (this.menuBtns[i].node.active) {
                    select = i + 1;
                    break;
                }
            }
        }
        if (select == 3 && !JumpUtils.ifSysOpen(2845)) { select = 0; }
        this.menuBtnSelect(null, select)
    }

    onDestroy() {
        NetManager.targetOff(this);
        gdk.e.targetOff(this)
        if (this.list) {
            this.list.destroy()
        }
        this._clearTimer()
    }

    menuBtnSelect(e, utype) {
        utype = parseInt(utype)
        if (this.menuSelect == 3) {
            gdk.panel.hide(this.storeTitleConfig[3][0].panelId);
            this.indexPanel.removeAllChildren();
        }
        this.menuSelect = utype
        if (this.menuSelect == 3) {
            let sysCfg = ConfigManager.getItemById(SystemCfg, 2845);
            if (cc.js.isNumber(sysCfg.activity) && !ActUtil.ifActOpen(sysCfg.activity)) {
                let startT = ActUtil.getNextActStartTime(sysCfg.activity);
                gdk.gui.showMessage(`${TimerUtils.format8((startT - GlobalUtil.getServerTime()) / 1000)}后开启`);
                return;
            }
            if (!JumpUtils.ifSysOpen(2845, true)) {
                return;
            }
            gdk.panel.open(this.storeTitleConfig[utype][0].panelId, null, this, {
                parent: this.indexPanel
            })
        }
        this.isRefreshBlackInfo = false;
        this.isRefreshRuneInfo = false;
        // if (utype == StoreMenuType.Gift) {
        //     this.shopName.parent.active = false
        //     GlobalUtil.setSpriteIcon(this.node, this.shopIcon, `view/store/textrue/bg/lb_guanggaobg`)
        // } else {
        this.shopName.parent.active = true
        GlobalUtil.setSpriteIcon(this.node, this.shopName, `view/store/textrue/store/${this.shopNameArr[utype]}`)
        GlobalUtil.setSpriteIcon(this.node, this.shopIcon, `view/store/textrue/bg/bg_shandianchangjinditu`)
        // }


        let scrollWidget = this.scrollView.getComponent(cc.Widget)
        for (let idx = 0; idx < this.menuBtns.length; idx++) {
            const element = this.menuBtns[idx]
            element.interactable = idx != utype
            let select = element.node.getChildByName("select");
            select.active = idx == utype
            let common = element.node.getChildByName("common");
            common.active = idx != utype
        }
        this.typeBtnNode.active = true
        scrollWidget.bottom = 288
        let btnInfos = this.storeTitleConfig[utype]
        let startIdx: number;
        for (let index = 0; index < this.typeBtns.length; index++) {
            const btn = this.typeBtns[index];
            let info = btnInfos[index]
            btn.node.active = !!info && info.isShow
            btn.node.getChildByName('RedPoint').active = false;

            //绑定指引
            if (this.menuSelect == 1 && info && info.bindId > 0) {
                GuideUtil.bindGuideNode(info.bindId, btn.node)
            }
            if (!!info && info.isShow) {
                let show = true;
                if (!JumpUtils.ifSysOpen(info.sysId, false)
                    || ([1708, 2925].indexOf(info.sysId) !== -1 && this.roleModel.guildId <= 0)
                    || (info.sysId == 2870 && !ModelManager.get(SiegeModel).isActivityOpen)
                    || (info.sysId == 1726 && !StoreUtils.uniqueStoreOpenState())) {
                    show = false;
                }
                GlobalUtil.setAllNodeGray(btn.node, show ? 0 : 1)
                if (!startIdx && startIdx != 0 && show) startIdx = index;
                let commonText = btn.node.getChildByName("common").getChildByName("label")
                let selectText = btn.node.getChildByName("select").getChildByName("label")
                if ([StoreType.DAILYGIFTBAG, StoreType.WEEKLYGIFTBAG].indexOf(info.type) != -1) {
                    let freeGiftId = info.type == StoreType.DAILYGIFTBAG ? this.freeGift[1] : this.freeGift[2]
                    let giftCfg = ConfigManager.getItemById(Store_giftCfg, freeGiftId)
                    if (!this._checkGiftOpen(giftCfg)) {
                        btn.node.getChildByName('RedPoint').active = false
                    }
                    else {
                        let buyInfo = StoreUtils.getStoreGiftBuyInfo(freeGiftId)
                        btn.node.getChildByName('RedPoint').active = (buyInfo && buyInfo.count >= 1) ? false : true
                    }
                }
                if (info.title) {
                    // let path = `view/store/textrue/store/${info.title}`
                    // GlobalUtil.setSpriteIcon(btn.node, commonText, path)
                    // GlobalUtil.setSpriteIcon(btn.node, selectText, path + '01')
                    commonText.getComponent(cc.Label).string = info.title;
                    selectText.getComponent(cc.Label).string = info.title;
                } else {
                    this.typeBtnNode.active = false
                    scrollWidget.bottom = 144
                    break
                }
            }
        }
        scrollWidget.updateAlignment()
        this.typeBtnSelect(null, startIdx)
        //点击充值后获取首充和特权卡信息
        // if (utype == 3) {
        //     NetManager.send(new icmsg.PayFirstListReq())
        //     NetManager.send(new icmsg.MonthCardListReq())
        // }
        // if (utype == 3) {
        //     NetManager.send(new StoreGiftListReq())
        // }
    }

    initMenuBtnState() {
        this.menuBtns.forEach((btn, idx) => {
            let info = this.storeTitleConfig[idx];
            if (info) {
                for (let i = 0; i < info.length; i++) {
                    if (info[i] && JumpUtils.ifSysOpen(info[i].sysId, false, false)) {
                        if (info[i].sysId == 1708 && this.roleModel.guildId > 0) {
                            btn.node.active = true;
                            return;
                        }
                        btn.node.active = true;
                        return;
                    }
                }
            }
            btn.node.active = false;
        });
    }

    typeBtnSelect(e, utype) {
        utype = parseInt(utype)
        let title = this.storeTitleConfig[this.menuSelect][utype];
        if (!title || !JumpUtils.ifSysOpen(title.sysId, true)) {
            return;
        }
        if (title.sysId == 1708 || title.sysId == 2925) {
            if (this.roleModel.guildId <= 0) {
                gdk.gui.showMessage(gdk.i18n.t('i18n:STORE_TIP26'));
                return;
            }
        }

        if (title.sysId == 2870 && !ModelManager.get(SiegeModel).isActivityOpen) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:ACT_LIMIT_TIP3'));
            return;
        }

        if (title.sysId == 1726 && !StoreUtils.uniqueStoreOpenState()) {
            let v = ConfigManager.getItemByField(Unique_globalCfg, 'key', 'uniquestore_unlock').value;
            gdk.gui.showMessage(`拥有第一个${v[0]}星英雄或玩家达到${v[1]}级时,开启专属商店`);
            return;
        }

        this.isRefreshBlackInfo = false;
        this.isRefreshRuneInfo = false;
        this.curTitle = this.storeTitleConfig[this.menuSelect][utype]
        this.typeSelect = utype
        this._updateGiftTopPanel();
        for (let idx = 0; idx < this.typeBtns.length; idx++) {
            const element = this.typeBtns[idx];
            element.interactable = idx != utype
            let select = element.node.getChildByName("select");
            select.active = idx == utype
            let common = element.node.getChildByName("common");
            common.active = idx != utype


            let tempTitle = this.storeTitleConfig[this.menuSelect][idx]
            let show = true;
            if (tempTitle && (!JumpUtils.ifSysOpen(tempTitle.sysId, false)
                || ([1708, 2925].indexOf(tempTitle.sysId) !== -1 && this.roleModel.guildId <= 0)
                || (tempTitle.sysId == 2870 && !ModelManager.get(SiegeModel).isActivityOpen)
                || (tempTitle.sysId == 1726 && !StoreUtils.uniqueStoreOpenState()))) {
                show = false;
            }
            GlobalUtil.setAllNodeGray(element.node, show ? 0 : 1)
        }



        if (this.curTitle && this.curTitle.type <= StoreType.MONTHCARD) {
            this._updateStoreScroll()
        }

        let money = this.curTitle.costType

        if (money[0] != 2 && money[1] != 4 && money[1] != 5) {
            this.diamondAdd.active = false
        } else {
            this.diamondAdd.active = true
        }
        GlobalUtil.setSpriteIcon(this.node, this.diamondIcon, GlobalUtil.getSmallMoneyIcon(money[0]))

        if (money[1] != 3 && money[1] != 4 && money[1] != 5) {
            this.moneyAdd.active = false
        } else {
            this.moneyAdd.active = true
        }
        GlobalUtil.setSpriteIcon(this.node, this.moneyIcon, GlobalUtil.getSmallMoneyIcon(money[1]))
        this._updateMoneyNum()
    }

    _initListView() {
        if (this.list) {
            this.list.destroy()
        }
        if (this.curTitle.type == StoreType.MF) {
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
        else if (this.curTitle.type == StoreType.MONTHCARD) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.monthCardItem,
                cb_host: this,
                async: true,
                column: 3,
                gap_x: -20,
                gap_y: 15,
                direction: ListViewDir.Vertical,
            })
        } else if ([StoreType.DAILYGIFTBAG, StoreType.LIMITGIFTBAG, StoreType.WEEKLYGIFTBAG, StoreType.LIMITTIMEGIFTBAG].indexOf(this.curTitle.type) != -1) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.storeGiftItem,
                cb_host: this,
                async: true,
                gap_y: 15,
                direction: ListViewDir.Vertical,
            })
            this.list.updateItemSize(693, this.curTitle.type == StoreType.DAILYGIFTBAG ? 229.1 : 182);
        } else {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.storeHItem,
                cb_host: this,
                async: true,
                column: 1,
                gap_y: 18,
                direction: ListViewDir.Vertical,
            })
        }

    }

    _updateStoreScroll() {
        if (this.curTitle.type == StoreType.MF) return;
        this._initListView()
        let list = []
        this.refreshPanel.active = this.curTitle.type == StoreType.BLACK || this.curTitle.type == StoreType.RUNE || this.curTitle.type == 4 || this.curTitle.type == 7 || this.curTitle.type == StoreType.SIEGE || this.curTitle.type == StoreType.EXPEDITION || this.curTitle.type == StoreType.UNIQUE
        let blackInfo = this.model.blackInfo
        let storeInfo = this.model.storeInfo
        let runeInfo = this.model.runeInfo
        if (this.curTitle.type == StoreType.BLACK) {
            if (!this.model.blackInfo) {
                NetManager.send(new icmsg.StoreBlackMarketListReq())
                return
            }
            let time = blackInfo.time
            let serverTime = this.serverModel.serverTime
            let refreshTime = this.refreshCfg[0] * 1000
            // console.log("--", time, refreshTime, serverTime)
            if (time + refreshTime <= serverTime) {
                NetManager.send(new icmsg.StoreBlackMarketListReq())
                return
            }
            let items = blackInfo.item
            let resutl = []
            for (let index = 0; index < items.length; index++) {
                let data = items[index];
                let cfg = ConfigManager.getItemById(StoreCfg, data.id)
                resutl.push({ pos: index, cfg: cfg, info: data, showAni: this.isRefreshBlackInfo })
            }
            resutl.sort((a, b) => { return a.cfg.sorting - b.cfg.sorting; });
            //数组分割 4个为一组
            for (let i = 0; i < resutl.length; i += this.perRowNum) {
                list.push(resutl.slice(i, i + this.perRowNum))
            }

        }
        else if (this.curTitle.type == StoreType.RUNE) {
            if (!runeInfo || Object.keys(runeInfo).length <= 0) {
                NetManager.send(new icmsg.StoreRuneListReq())
                return
            }
            let index = 0;
            let resutl = []
            for (let key in runeInfo) {
                let id = parseInt(key);
                let data = runeInfo[id];
                let cfg = ConfigManager.getItemById(Store_runeCfg, id);
                resutl.push({ pos: index, cfg: cfg, info: data, showAni: this.isRefreshRuneInfo })
                index += 1;
            }
            resutl.sort((a, b) => { return a.cfg.sorting - b.cfg.sorting; });
            //数组分割 4个为一组
            for (let i = 0; i < resutl.length; i += this.perRowNum) {
                list.push(resutl.slice(i, i + this.perRowNum))
            }
        }
        else if (this.curTitle.type == StoreType.RECHARGE) {
            this._clearTimer()
            let rechargeList = this.model.rechargeList
            let items = ConfigManager.getItems(Store_chargeCfg)
            for (let index = 0; index < items.length; index++) {
                const cfg = items[index];
                let info = false;
                if (rechargeList.indexOf(cfg.id) != -1) {
                    info = true;
                }
                list.push({ pos: index, cfg: cfg, info: info, showAni: false })
            }
        }
        else if (this.curTitle.type == StoreType.MONTHCARD) {
            this._clearTimer()
            let items = ConfigManager.getItems(Store_monthcardCfg)
            items.sort((a, b) => a.show - b.show);
            for (let index = 0; index < items.length; index++) {
                const cfg = items[index];
                let time = 0;
                list.push({ pos: index, cfg: cfg, info: time, showAni: false })
            }
        } else if ([StoreType.DAILYGIFTBAG, StoreType.LIMITGIFTBAG, StoreType.WEEKLYGIFTBAG, StoreType.LIMITTIMEGIFTBAG].indexOf(this.curTitle.type) != -1) {
            this._updateGiftInfo()
            return;
        } else if (this.curTitle.type == StoreType.SIEGE) {
            this._clearTimer()
            cc.find("countTime", this.refreshPanel).active = true
            cc.find("refreshTime", this.refreshPanel).active = false
            cc.find("refreshBtn", this.refreshPanel).active = false
            cc.find("goSiegeBtn", this.refreshPanel).active = true
            if (!this.model.siegeItems) {
                NetManager.send(new icmsg.StoreSiegeListReq())
                return
            }
            let items = this.model.siegeItems
            let resutl = []
            let index = 0;
            for (let key in items) {
                let data = items[key];
                let cfg = ConfigManager.getItemById(StoreCfg, data.id)
                resutl.push({ pos: index, cfg: cfg, info: data, showAni: false })
                index += 1
            }
            resutl.sort((a, b) => { return a.cfg.sorting - b.cfg.sorting; });
            //数组分割 4个为一组
            for (let i = 0; i < resutl.length; i += this.perRowNum) {
                list.push(resutl.slice(i, i + this.perRowNum))
            }
            this._creataSiegeRefreshTime()
        } else if (this.curTitle.type == StoreType.UNIQUE) {
            // this._clearTimer()
            // cc.find("countTime", this.refreshPanel).active = true
            // cc.find("refreshTime", this.refreshPanel).active = false
            // cc.find("refreshBtn", this.refreshPanel).active = false
            // cc.find("goSiegeBtn", this.refreshPanel).active = true
            if (!this.model.uniqueItems) {
                NetManager.send(new icmsg.StoreUniqueEquipListReq())
                return
            }
            let items = this.model.uniqueItems
            let resutl = []
            let index = 0;
            for (let key in items) {
                let data = items[key];
                let cfg = ConfigManager.getItemById(StoreCfg, data.id)
                resutl.push({ pos: index, cfg: cfg, info: data, showAni: false })
                index += 1
            }
            resutl.sort((a, b) => { return a.cfg.sorting - b.cfg.sorting; });
            //数组分割 4个为一组
            for (let i = 0; i < resutl.length; i += this.perRowNum) {
                list.push(resutl.slice(i, i + this.perRowNum))
            }
            // this._creataSiegeRefreshTime()
        } else {
            this._clearTimer()
            let items = ConfigManager.getItemsByField(StoreCfg, "type", this.curTitle.type)
            items.sort((a, b) => { return a.sorting - b.sorting; });
            let resutl = []
            for (let index = 0; index < items.length; index++) {
                const cfg = items[index];
                if (cfg.refresh == 6) {
                    //终生限购系列 超过次数不显示
                    if (storeInfo[cfg.id] && storeInfo[cfg.id].count >= cfg.times_limit) {
                        continue;
                    }
                }

                //钻石商店的商品显示根据活动是否开启
                if (cfg.type == StoreType.GEMS && cfg.activity_id > 0 && !ActUtil.ifActOpen(cfg.activity_id)) {
                    continue
                }

                if (cfg.type == StoreType.COSTUME && cfg.level > this.roleModel.level) {
                    continue
                }

                if (cfg.type == StoreType.GUILD && cfg.foothold && cfg.foothold >= ModelManager.get(FootHoldModel).activityIndex) {
                    continue
                }

                resutl.push({ pos: index, cfg: cfg, info: storeInfo[cfg.id], showAni: false })
            }

            //数组分割 4个为一组
            for (let i = 0; i < resutl.length; i += this.perRowNum) {
                list.push(resutl.slice(i, i + this.perRowNum))
            }
            this.refreshPanel.active = this.curTitle.type == 4 || this.curTitle.type == 7

            if (this.curTitle.type == 7) {
                this._creataTBRefreshTime()
            }
        }
        let isReset = true
        if (this.curTitle.type == StoreType.RECHARGE) {
            isReset = false
        }
        if (this.isRefreshBlackInfo || this.isRefreshRuneInfo) {
            this.content['_components'][0].enabled = false;
        } else {
            this.content['_components'][0].enabled = true;
        }
        this.list.set_data(list, isReset)
        // gdk.Timer.clear(this, this._openBatchChildrenRender);
        // this.content['_components'][0].enabled = false;
        // gdk.Timer.once(1000, this, this._openBatchChildrenRender);
    }

    _openBatchChildrenRender() {
        if (!cc.isValid(this.node)) {
            gdk.Timer.clear(this, this._openBatchChildrenRender);
            return;
        }
        this.content['_components'][0].enabled = true;
    }

    /**更新礼包界面顶部UI */
    _updateGiftTopPanel() {
        this.giftPanel.active = false;
    }

    onFreeGiftClick() {
        let idx = [StoreType.DAILYGIFTBAG, StoreType.WEEKLYGIFTBAG].indexOf(this.curTitle.type);
        if (idx != -1) {
            let giftId = idx == 0 ? this.freeGift[1] : this.freeGift[2];
            let giftCfg = ConfigManager.getItemById(Store_giftCfg, giftId);
            let buyInfo = StoreUtils.getStoreGiftBuyInfo(giftId);
            let buyNum = buyInfo ? buyInfo.count : 0;
            let limitNum = giftCfg.times_limit;
            if (limitNum - buyNum > 0) {
                let msg = new icmsg.PayOrderReq()
                msg.paymentId = giftCfg.gift_id
                NetManager.send(msg)
            } else {
                gdk.gui.showMessage(gdk.i18n.t('i18n:RECHARGE_TIP4'))
                return;
            }
        }
    }

    onAllBuyBtnClick() {
        let b: boolean = false;
        for (let i = 0; i < this.dailyGiftId.length; i++) {
            let buyInfo = StoreUtils.getStoreGiftBuyInfo(this.dailyGiftId[i]);
            if (buyInfo && buyInfo.count >= 1) {
                b = true;
                break;
            }
        }
        if (!b && this.curTitle.type == StoreType.DAILYGIFTBAG) {
            let req = new icmsg.PayOrderReq();
            req.paymentId = 20001;
            NetManager.send(req);
        }
    }

    //打开指定的物品购买界面
    openSelectItem(storeItemId: number, itemId?: number) {
        gdk.Timer.once(80, this, () => {
            gdk.e.emit(BagEvent.SELECT_CLICK_ITEM, { storeId: storeItemId, itemId: itemId });
        })
    }

    /**更新普通商店信息 */
    _updateStoreInfo() {
        if (this.curTitle.type != StoreType.BLACK) {
            // this._updateStoreScroll()
            if (!this.list) {
                return
            }
            this._updateStoreScroll()
        }
    }

    @gdk.binding("model.blackInfo")
    /**更新黑店信息 */
    _updateBlackStore() {
        if (this.curTitle && this.curTitle.type == StoreType.BLACK) {
            this._updateStoreScroll()
            this._updateBlackRefreshInfo()
            this.isRefreshBlackInfo = false;
        }
    }

    @gdk.binding("model.siegeItems")
    /**更新丧尸攻城 商店 */
    _updateSiegeStore() {
        if (this.curTitle && this.curTitle.type == StoreType.SIEGE) {
            this._updateStoreScroll()
        }
    }

    @gdk.binding("model.uniqueItems")
    /**更新丧尸攻城 商店 */
    _updateUniqueStore() {
        if (this.curTitle && this.curTitle.type == StoreType.UNIQUE) {
            this._updateStoreScroll()
        }
    }

    /**更新刷新信息 */
    _updateBlackRefreshInfo() {
        cc.find("countTime", this.refreshPanel).active = true
        cc.find("refreshTime", this.refreshPanel).active = true
        cc.find("refreshBtn", this.refreshPanel).active = true
        cc.find("goSiegeBtn", this.refreshPanel).active = false
        cc.find("goExpeditionBtn", this.refreshPanel).active = false

        let usedNum = this.model.blackInfo.count
        this.costIcon.active = false
        if (usedNum < this.refreshCfg[4]) {
            this.costLab.string = ``
            this.costLab.node.width = 0
            this.btnLab.string = `${gdk.i18n.t('i18n:STORE_TIP27')}(${this.refreshCfg[4] - usedNum}/${this.refreshCfg[4]})`
        } else {
            this.costIcon.active = true
            GlobalUtil.setSpriteIcon(this.node, this.costIcon, GlobalUtil.getSmallMoneyIcon(MoneyType.Diamond))
            this.costLab.string = `${this.refreshCfg[1]}`
            this.btnLab.string = ` ${gdk.i18n.t('i18n:STORE_TIP28')}`
            this.costLab.node.color = cc.color("#FFF9DF")
            if (GlobalUtil.getMoneyNum(MoneyType.Diamond) < this.refreshCfg[1]) {
                this.costLab.node.color = cc.color("#ff0000")
            }
        }
        let maxNum = this.refreshCfg[2]
        this.refreshLab.string = `${maxNum - usedNum}`
        this.totalLab.string = `/${maxNum}`
        this._createRefreshTimer()
    }

    /** 英雄刷新*/
    _updateYXRefreshInfo() {
        cc.find("countTime", this.refreshPanel).active = false
        cc.find("refreshTime", this.refreshPanel).active = false
        cc.find("refreshBtn", this.refreshPanel).active = true
        cc.find("goSiegeBtn", this.refreshPanel).active = false
        cc.find("goExpeditionBtn", this.refreshPanel).active = false
        this.tips.active = true
        GlobalUtil.setSpriteIcon(this.node, this.tips, 'view/store/textrue/store/sd_shuaxinxinxi')
        let cfg = ConfigManager.getItemById(GlobalCfg, "hero_store_refresh")
        this.costIcon.active = true
        GlobalUtil.setSpriteIcon(this.node, this.costIcon, GlobalUtil.getSmallMoneyIcon(cfg.value[0]))
        this.costLab.string = `${cfg.value[1]}`
        this.btnLab.string = gdk.i18n.t('i18n:STORE_TIP28')

        this.costLab.node.color = cc.color("#FFF9DF")
        if (GlobalUtil.getMoneyNum(cfg.value[0]) < cfg.value[1]) {
            this.costLab.node.color = cc.color("#ff0000")
        }
    }

    /** 探宝刷新*/
    _updateTBRefreshInfo() {
        cc.find("countTime", this.refreshPanel).active = true
        cc.find("refreshTime", this.refreshPanel).active = false
        cc.find("refreshBtn", this.refreshPanel).active = true
        cc.find("goSiegeBtn", this.refreshPanel).active = false
        cc.find("goExpeditionBtn", this.refreshPanel).active = false
        let cfg = ConfigManager.getItemById(GlobalCfg, "turntable_store_refresh")
        this.costIcon.active = true
        GlobalUtil.setSpriteIcon(this.node, this.costIcon, GlobalUtil.getSmallMoneyIcon(cfg.value[1]))
        this.costLab.string = `${cfg.value[2]}`
        this.btnLab.string = gdk.i18n.t('i18n:STORE_TIP28')
        this.costLab.node.color = cc.color("#FFF9DF")
        if (GlobalUtil.getMoneyNum(cfg.value[1]) < cfg.value[2]) {
            this.costLab.node.color = cc.color("#ff0000")
        }
        this._creataTBRefreshTime()
    }

    /**公会刷新 */
    _updateGHRefreshInfo() {
        this.tips.active = true
        GlobalUtil.setSpriteIcon(this.node, this.tips, 'view/store/textrue/store/sd_text001')
    }

    _updateRuneItem() {
        this._updateStoreScroll()
        this._updateRuneRefreshInfo();
        this.isRefreshRuneInfo = false;
    }

    /** 符文刷新*/
    _updateRuneRefreshInfo() {
        cc.find("countTime", this.refreshPanel).active = true
        cc.find("refreshTime", this.refreshPanel).active = false
        cc.find("refreshBtn", this.refreshPanel).active = true
        cc.find("goSiegeBtn", this.refreshPanel).active = false
        cc.find("goExpeditionBtn", this.refreshPanel).active = false
        let storeRuneCfg = ConfigManager.getItems(Store_runeCfg)[0];
        let freeNum = ConfigManager.getItemById(GlobalCfg, "rune_store_free_refresh").value[0];
        if (this.model.runeRefreshNum >= freeNum) {
            this.costIcon.active = true
            // this.costLab.node.active = true;
            this.btnLab.string = gdk.i18n.t('i18n:STORE_TIP28')
            this.costLab.node.color = cc.color("#FFF9DF")
            if (this.model.runeRefreshNum >= freeNum && BagUtils.getItemNumById(storeRuneCfg.initiative[0]) < storeRuneCfg.initiative[1]) {
                this.costLab.node.color = cc.color("#ff0000")
            }
            this.costLab.string = `${storeRuneCfg.initiative[1]}`;
            GlobalUtil.setSpriteIcon(this.node, this.costIcon, GlobalUtil.getSmallMoneyIcon(storeRuneCfg.initiative[0]))
        }
        else {
            this.costIcon.active = false
            this.costLab.string = '';
            this.costLab.node.width = 0;
            this.btnLab.string = `${gdk.i18n.t('i18n:STORE_TIP27')}(${freeNum - this.model.runeRefreshNum}/${freeNum})`;
        }
        this._createRuneRefreshTimer();
    }

    _updateExpeditionRefreshInfo() {
        cc.find("countTime", this.refreshPanel).active = false
        cc.find("refreshTime", this.refreshPanel).active = false
        cc.find("refreshBtn", this.refreshPanel).active = false
        cc.find("goSiegeBtn", this.refreshPanel).active = false
        cc.find("goExpeditionBtn", this.refreshPanel).active = true
    }

    /** 专属装备刷新*/
    _updateUniqueRefreshInfo() {
        cc.find("countTime", this.refreshPanel).active = true
        cc.find("refreshTime", this.refreshPanel).active = false
        cc.find("refreshBtn", this.refreshPanel).active = true
        cc.find("goSiegeBtn", this.refreshPanel).active = false
        cc.find("goExpeditionBtn", this.refreshPanel).active = false
        let cfg = ConfigManager.getItemById(GlobalCfg, "unique_store_refresh")
        this.costIcon.active = true
        GlobalUtil.setSpriteIcon(this.node, this.costIcon, GlobalUtil.getSmallMoneyIcon(cfg.value[0]))
        this.costLab.string = `${cfg.value[1]}`
        this.btnLab.string = gdk.i18n.t('i18n:STORE_TIP28')
        this.costLab.node.color = cc.color("#FFF9DF")
        if (GlobalUtil.getMoneyNum(cfg.value[1]) < cfg.value[2]) {
            this.costLab.node.color = cc.color("#ff0000")
        }
        this._creataUniqueRefreshTime()
    }

    _creataUniqueRefreshTime() {
        this._clearTimer()
        this._updataUniqueTimer()
        this.schedule(this._updataUniqueTimer, 1)
    }

    _updataUniqueTimer() {
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let curZero = TimerUtils.getZerohour(curTime)//当天0点
        let leftTime = curZero + 86400 * 7 - curTime
        if (leftTime > 0) {
            this.timeLab.string = `${gdk.i18n.t('i18n:ALCHEMY_VIEW_TIP1')}${leftTime >= 86400 ? TimerUtils.format1(leftTime) : TimerUtils.format2(leftTime)}`
        } else {
            this._clearTimer()
            NetManager.send(new icmsg.StoreUniqueEquipRefreshReq())
        }
    }

    /**创建计时器 */
    _createRuneRefreshTimer() {
        this._clearTimer()
        this._updateRuneTimeText()
        this.schedule(this._updateRuneTimeText, 1)
    }

    _updateRuneTimeText() {
        let times = ConfigManager.getItemByField(GlobalCfg, 'key', 'rune_store_free_refresh_time').value;
        let serverTime = this.serverModel.serverTime
        let curZeroTime = TimerUtils.getZerohour(serverTime / 1000);
        let endTime;
        for (let i = 0; i < times.length; i++) {
            if (serverTime <= (times[i] + curZeroTime) * 1000) {
                endTime = times[i] + curZeroTime;
                break;
            }
            if (!endTime) {
                endTime = TimerUtils.getTomZerohour(serverTime / 1000);
            }
        }
        endTime *= 1000;
        let remainTime = endTime - serverTime
        if (remainTime > 0) {
            remainTime = Math.floor(remainTime / 1000)
            let hour = Math.floor(remainTime / 3600)
            let min = Math.floor(remainTime % 3600 / 60)
            let sec = remainTime % 60
            let text = `${GlobalUtil.padLeft(hour, 2)}:${GlobalUtil.padLeft(min, 2)}:${GlobalUtil.padLeft(sec, 2)}`
            this.timeLab.string = `${gdk.i18n.t('i18n:ALCHEMY_VIEW_TIP1')}${text}`
        } else {
            NetManager.send(new icmsg.StoreRuneListReq());
            this._clearTimer()
        }
    }

    _creataTBRefreshTime() {
        this._updataTBTimer()
        this.schedule(this._updataTBTimer, 1)
    }

    _updataTBTimer() {
        let cfg = ConfigManager.getItemById(GlobalCfg, "turntable_store_refresh")
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let zeroTime = TimerUtils.getZerohour(curTime)
        let times = 24 * 3600 / cfg.value[0]
        let endTime = zeroTime + 34 * 3600
        for (let i = 0; i < times; i++) {
            if (zeroTime + (i + 1) * cfg.value[0] >= curTime) {
                endTime = zeroTime + (i + 1) * cfg.value[0]
                break
            }
        }
        if (endTime - curTime > 0) {
            this.timeLab.string = `${gdk.i18n.t('i18n:ALCHEMY_VIEW_TIP1')}${TimerUtils.format2(endTime - curTime)}`
        } else {
            this._clearTimer()
            NetManager.send(new icmsg.StoreListReq())
        }
    }

    _creataSiegeRefreshTime() {
        this._updataSiegeTimer()
        this.schedule(this._updataSiegeTimer, 1)
    }

    _updataSiegeTimer() {
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let curZero = TimerUtils.getZerohour(curTime)//当天0点
        let leftTime = curZero + 86400 - curTime
        if (leftTime > 0) {
            this.timeLab.string = `${gdk.i18n.t('i18n:ALCHEMY_VIEW_TIP1')}${TimerUtils.format4(leftTime)}`
        } else {
            this._clearTimer()
            NetManager.send(new icmsg.StoreSiegeListReq())
        }
    }

    /**创建计时器 */
    _createRefreshTimer() {
        this._clearTimer()
        this._updateTimeText()
        this.schedule(this._updateTimeText, 1)
    }

    _updateTimeText() {
        let time = this.model.blackInfo.time
        let serverTime = this.serverModel.serverTime
        let refreshTime = this.refreshCfg[0] * 1000
        let remainTime = time + refreshTime - serverTime
        if (remainTime > 0) {
            remainTime = Math.floor(remainTime / 1000)
            let hour = Math.floor(remainTime / 3600)
            let min = Math.floor(remainTime % 3600 / 60)
            let sec = remainTime % 60
            let text = `${GlobalUtil.padLeft(hour, 2)}:${GlobalUtil.padLeft(min, 2)}:${GlobalUtil.padLeft(sec, 2)}`
            this.timeLab.string = `${gdk.i18n.t('i18n:ALCHEMY_VIEW_TIP1')}${text}`
        } else {
            NetManager.send(new icmsg.StoreBlackMarketListReq())
            this._clearTimer()
        }
    }

    _clearTimer() {
        this.unschedule(this._updateTimeText)
        this.unschedule(this._updataTBTimer)
        this.unschedule(this._updateRuneTimeText)
        this.unschedule(this._updataSiegeTimer)
        this.unschedule(this._updataUniqueTimer)
    }

    /**更新单个神秘商店项 */
    _updateOneBlackItem(e: gdk.Event) {
        let pos = e.data
        let blackInfo = this.model.blackInfo
        let datas = this.list.datas
        for (let index = 0; index < datas.length; index++) {
            const data = datas[index];
            for (let i = 0; i < data.length; i++) {
                if (data[i].pos == pos) {
                    data[i].info = blackInfo.item[pos]
                    this.list.refresh_item(index, data)
                    break
                }
            }
        }
    }

    /**更新单个普通商店项 */
    _updateOneStoreItem(e: gdk.Event) {
        if (gdk.panel.isOpenOrOpening(PanelId.SelectGift)) {
            gdk.panel.hide(PanelId.SelectGift);
        }
        let id = e.data
        let storeInfo = this.model.storeInfo
        let datas = this.list.datas
        for (let index = 0; index < datas.length; index++) {
            const data = datas[index]
            for (let i = 0; i < data.length; i++) {
                const cfg = data[i].cfg
                if (cfg && id == cfg.id) {
                    data[i].info = storeInfo[id]
                    this.list.refresh_item(index, data)
                    return
                }
            }
        }
    }

    _updateOneSiegeStoreItem(e: gdk.Event) {
        if (gdk.panel.isOpenOrOpening(PanelId.SelectGift)) {
            gdk.panel.hide(PanelId.SelectGift);
        }
        let id = e.data
        let items = this.model.siegeItems
        let datas = this.list.datas
        for (let index = 0; index < datas.length; index++) {
            const data = datas[index]
            for (let i = 0; i < data.length; i++) {
                const cfg = data[i].cfg
                if (cfg && id == cfg.id) {
                    data[i].info = items[id]
                    this.list.refresh_item(index, data)
                    return
                }
            }
        }
    }

    _updateOneUniqueStoreItem(e: gdk.Event) {
        if (gdk.panel.isOpenOrOpening(PanelId.SelectGift)) {
            gdk.panel.hide(PanelId.SelectGift);
        }
        let id = e.data
        let items = this.model.uniqueItems
        let datas = this.list.datas
        for (let index = 0; index < datas.length; index++) {
            const data = datas[index]
            for (let i = 0; i < data.length; i++) {
                const cfg = data[i].cfg
                if (cfg && id == cfg.id) {
                    data[i].info = items[id]
                    this.list.refresh_item(index, data)
                    return
                }
            }
        }
    }

    /**刷新按钮函数 */
    refreshBtnFunc() {
        if (this.curTitle.type == 1) {
            let usedNum = this.model.blackInfo.count;
            let maxNum = this.refreshCfg[2];
            if (maxNum - usedNum <= 0) {
                gdk.gui.showMessage(gdk.i18n.t('i18n:STORE_TIP29'));
                return;
            }

            if (usedNum < this.refreshCfg[4]) {
                this.isRefreshBlackInfo = true;
                NetManager.send(new icmsg.StoreBlackMarketRefreshReq())
            }
            else {
                let str = usedNum < this.refreshCfg[4] ? gdk.i18n.t('i18n:STORE_TIP31') : StringUtils.format(gdk.i18n.t('i18n:STORE_TIP32'), this.refreshCfg[1])
                GlobalUtil.openAskPanel({
                    descText: StringUtils.format(gdk.i18n.t('i18n:STORE_TIP30'), str),
                    thisArg: this,
                    sureCb: () => {
                        this.isRefreshBlackInfo = true;
                        NetManager.send(new icmsg.StoreBlackMarketRefreshReq())
                    },
                    sureText: gdk.i18n.t('i18n:STORE_TIP28'),
                    isShowTip: usedNum >= this.refreshCfg[4],
                    tipSaveCache: AskInfoCacheType.refresh_store_tip
                })
            }
        } else if (this.curTitle.type == 4 || this.curTitle.type == 7) {
            let cfg4 = ConfigManager.getItemById(GlobalCfg, "hero_store_refresh")
            let cfg7 = ConfigManager.getItemById(GlobalCfg, "turntable_store_refresh")

            let costNum = 0
            let costItemId = 0
            if (this.curTitle.type == 4) {
                costNum = cfg4.value[1]
                costItemId = cfg4.value[0]
            } else {
                costNum = cfg7.value[2]
                costItemId = cfg7.value[1]
            }
            let itemCfg = BagUtils.getConfigById(costItemId)
            GlobalUtil.openAskPanel({
                descText: StringUtils.format(gdk.i18n.t('i18n:STORE_TIP33'), costNum, itemCfg.name),
                thisArg: this,
                sureCb: () => {
                    let msg = new icmsg.StoreRefreshReq()
                    msg.storeType = this.curTitle.type
                    NetManager.send(msg, (data: icmsg.StoreRefreshRsp) => {
                        for (let index = 0; index < data.info.length; index++) {
                            const element = data.info[index];
                            this.model.storeInfo[element.id] = element
                        }
                        gdk.e.emit(StoreEventId.UPDATE_SHOP_INFO)
                    })
                },
                sureText: gdk.i18n.t('i18n:STORE_TIP28'),
            })
        }
        else if (this.curTitle.type == StoreType.RUNE) {
            let freeNum = ConfigManager.getItemById(GlobalCfg, "rune_store_free_refresh").value[0];
            if (this.model.runeRefreshNum < freeNum) {
                this.isRefreshRuneInfo = true;
                NetManager.send(new icmsg.StoreRuneRefreshReq());
            }
            else {
                let cost = ConfigManager.getItems(Store_runeCfg)[0].initiative;
                GlobalUtil.openAskPanel({
                    descText: StringUtils.format(gdk.i18n.t('i18n:STORE_TIP33'), cost[1], BagUtils.getConfigById(cost[0]).name),
                    thisArg: this,
                    sureCb: () => {
                        this.isRefreshRuneInfo = true;
                        NetManager.send(new icmsg.StoreRuneRefreshReq(), () => {
                            this.isRefreshRuneInfo = true;
                            gdk.e.emit(StoreEventId.UPDATE_SHOP_INFO)
                        });
                    },
                    sureText: gdk.i18n.t('i18n:STORE_TIP28'),
                })
            }
        } else if (this.curTitle.type == StoreType.UNIQUE) {
            let cfg21 = ConfigManager.getItemById(GlobalCfg, "unique_store_refresh")
            let costNum = cfg21.value[1];
            let costItemId = cfg21.value[0];
            let itemCfg = BagUtils.getConfigById(costItemId)
            GlobalUtil.openAskPanel({
                descText: StringUtils.format(gdk.i18n.t('i18n:STORE_TIP33'), costNum, itemCfg.name),
                thisArg: this,
                sureCb: () => {
                    NetManager.send(new icmsg.StoreUniqueEquipRefreshReq());
                },
                sureText: gdk.i18n.t('i18n:STORE_TIP28'),
            })
        }
    }

    /**礼包信息更新 */
    _updateGiftInfo() {
        let tab = {
            10: 1,//每日
            11: 2,//每周
            12: 3,//限时
            13: 4//限定
        }
        let cfgs: Store_giftCfg[] = [];
        let tempList = ConfigManager.getItems(Store_giftCfg);
        tempList.forEach(element => {
            if (this._checkGiftOpen(element) && element.tab == tab[this.curTitle.type] && element.RMB_cost > 0) {
                cfgs.push(element);
            }
        });
        cfgs.sort((a, b) => {
            return a.show - b.show
        })

        let list = this.model.giftBuyList;
        let sellOutGiftData: GiftDataType[] = [];
        let otherGiftData: GiftDataType[] = [];
        for (let i = 0; i < cfgs.length; i++) {
            let buyInfo: GiftBuyInfo = { id: cfgs[i].gift_id, count: 0 };
            for (let j = 0; j < list.length; j++) {
                if (list[j].id == cfgs[i].gift_id) {
                    buyInfo = list[j];
                    break;
                }
            }
            if (buyInfo.count >= cfgs[i].times_limit) {
                sellOutGiftData.push({ cfg: cfgs[i], info: buyInfo })
            }
            else {
                otherGiftData.push({ cfg: cfgs[i], info: buyInfo })
            }
        }
        this.list.set_data([...otherGiftData, ...sellOutGiftData], false)
    }

    //
    _checkGiftOpen(cfg: Store_giftCfg) {
        let openLv: number = parseInt(cfg.gift_level) || 0;
        if (cfg.open_conds) {
            let info = this.model.storeInfo[cfg.open_conds];
            if (!info || info.count <= 0) {
                return false;
            }
        }
        if (cfg.cross_id && cfg.cross_id.indexOf(this.roleModel.crossId) === -1) {
            return false;
        }
        if (cfg.unlock) {
            let star = ModelManager.get(RoleModel).maxHeroStar;
            if (star < cfg.unlock) return false;
        }
        if (openLv > this.roleModel.level) {
            // 等级达不到要求
            return false;
        } else if (cfg.timerule == 0) {
            // 没有限制开放
            return true;
        } else {
            let timeCfg: any = cfg.restricted;
            // 刚开始只有一个时间段格式，按此方式解析
            if (timeCfg.length > 0) {
                if (timeCfg[0] == 3) {
                    let startArr = timeCfg[2]
                    let endArr: any = timeCfg[3]
                    let time = GlobalUtil.getServerOpenTime() * 1000;
                    let startDate = time + (startArr[2] * 24 * 60 * 60 + startArr[3] * 60 * 60 + startArr[4] * 60) * 1000;
                    let endDate = time + (endArr[2] * 24 * 60 * 60 + endArr[3] * 60 * 60 + endArr[4] * 60) * 1000;
                    let nowDay = GlobalUtil.getServerTime();
                    if (nowDay >= startDate && nowDay <= endDate) {
                        return true;
                    }
                }
                else if (timeCfg[0] == 1) {
                    let startArr = timeCfg[2];
                    let endArr: any = timeCfg[3];
                    // let startDate = new Date(startArr[0] + '/' + startArr[1] + '/' + startArr[2] + ' ' + startArr[3] + ':' + startArr[4] + ':0')
                    // let endDate = new Date(endArr[0] + '/' + endArr[1] + '/' + endArr[2] + ' ' + endArr[3] + ':' + endArr[4] + ':0')
                    let startDate = TimerUtils.transformDate(startArr);
                    let endDate = TimerUtils.transformDate(endArr);
                    let nowDay = GlobalUtil.getServerTime();
                    if (nowDay >= startDate && nowDay <= endDate) {
                        return true;
                    }
                }
                else if (timeCfg[0] == 6) {
                    if (ActUtil.ifActOpen(timeCfg[1][0])) {
                        return true;
                    }
                }
                else if (timeCfg[0] == 7) {
                    if (JumpUtils.ifSysOpen(2856)) {
                        let model = ModelManager.get(ChampionModel);
                        if (model.infoData && model.infoData.seasonId) {
                            // let cfg: Champion_mainCfg = ConfigManager.getItemById(Champion_mainCfg, model.infoData.seasonId);
                            // if (cfg) {
                            //     let o = cfg.open_time.split('/');
                            //     let c = cfg.close_time.split('/');
                            //     let ot = new Date(o[0] + '/' + o[1] + '/' + o[2] + ' ' + o[3] + ':' + o[4] + ':' + o[5]).getTime();
                            //     let ct = new Date(c[0] + '/' + c[1] + '/' + c[2] + ' ' + c[3] + ':' + c[4] + ':' + c[5]).getTime();
                            //     let curTime = GlobalUtil.getServerTime();
                            //     if (curTime >= ot && curTime <= ct) {
                            //         return true;
                            //     }
                            // }
                            if (ActUtil.ifActOpen(122)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    /**更新礼包信息 */
    @gdk.binding("model.giftBuyList")
    _updateGiftBuyList() {
        if (this.curTitle && [StoreType.DAILYGIFTBAG, StoreType.LIMITGIFTBAG, StoreType.WEEKLYGIFTBAG, StoreType.LIMITTIMEGIFTBAG].indexOf(this.curTitle.type) != -1) {
            this._updateGiftInfo();
        }
    }

    //充值成功
    _updatePaySucc(e: gdk.Event) {

        // this._updateStoreScroll()
        GlobalUtil.openRewadrView(e.data.list)

        //免费礼包
        let ids = [];
        for (let key in this.freeGift) {
            ids.push(this.freeGift[key]);
        }

        //每日礼包
        if (this.dailyGiftId.indexOf(e.data.paymentId) != -1 || e.data.paymentId == 20001) {
            let dailyAllBuyNode = cc.find('layout/dailyAllBuyBtn', this.giftPanel);
            dailyAllBuyNode.active = false;
        }
        if (ids.indexOf(e.data.paymentId) != -1) {
            let pageBtn = this.curTitle.type == StoreType.DAILYGIFTBAG ? this.typeBtns[2] : this.typeBtns[3];
            cc.find('layout/freeGiftBtn/RedPoint', this.giftPanel).active = false;
            cc.find('layout/freeGiftBtn/mask', this.giftPanel).active = true;
            cc.find('layout/freeGiftBtn/label', this.giftPanel).getComponent(ShaderHelper).enabled = true;
            pageBtn.node.getChildByName('RedPoint').active = false;
            return;
        }
        // 免费礼包以外的购买弹出 充值成功 的提示
        // gdk.gui.showMessage(gdk.i18n.t('i18n:FUNDS_TIP6'))
    }

    /**更新数量 */
    _updateMoneyNum() {
        let money = this.curTitle.costType
        let model = ModelManager.get(RoleModel)
        let moneyType1 = money[0]
        let moneyType2 = money[1]
        let AttName1 = AttTypeName[moneyType1]
        let AttName2 = AttTypeName[moneyType2]
        // if (AttName1) {
        this.diamondLab.string = GlobalUtil.numberToStr(BagUtils.getItemNumById(moneyType1))
        // }
        // if (AttName2) {
        if (AttName2 == "gold") {
            this.moneyLab.string = GlobalUtil.numberToStr(model[AttName2], true)
        } else {
            this.moneyLab.string = GlobalUtil.numberToStr(BagUtils.getItemNumById(moneyType2))
        }
        // }
        this.tips.active = false;
        if (this.curTitle) {
            if (this.curTitle.type == 1) {
                this._updateBlackRefreshInfo()
            } else if (this.curTitle.type == 4) {
                this._updateYXRefreshInfo()
            } else if (this.curTitle.type == 7) {
                this._updateTBRefreshInfo()
            } else if (this.curTitle.type == 6) {
                this._updateGHRefreshInfo()
            } else if (this.curTitle.type == 10) {
                this._updateRuneRefreshInfo();
            } else if (this.curTitle.type == 19) {
                this.refreshPanel.active = true;
                this._updateExpeditionRefreshInfo();
            } else if (this.curTitle.type == 21) {
                this.refreshPanel.active = true;
                this._updateUniqueRefreshInfo();
            }
        }
    }

    /**跳转丧尸攻城 */
    openSiegeFunc() {
        let activity_time = ConfigManager.getItemById(Siege_globalCfg, "activity_time").value
        let startTime = activity_time[0] * 3600 //怪物开始出现
        let overTime = activity_time[2] * 3600 //怪物消失(发奖时间)
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let curZero = TimerUtils.getZerohour(curTime)//当天0点
        if (curTime > curZero + overTime || curTime < curZero + startTime) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t('i18n:SIEGE_TIP14'), activity_time[0], activity_time[2]))
            return
        }

        if (this.roleModel.guildId <= 0) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:SIEGE_TIP13'))
            return
        }

        gdk.panel.open(PanelId.GuildMain, () => {
            GuideUtil.setGuideId(212011)
        })
    }

    /**跳转团队远征 */
    openExpeditionFunc() {
        if (this.roleModel.guildId <= 0) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:STORE_TIP26'))
            return
        }

        if (ActUtil.ifActOpen(114)) {
            JumpUtils.openView(2922);
            return
        }

        let curTime = ModelManager.get(ServerModel).serverTime
        let nextStartTime = ActUtil.getNextActStartTime(114)
        let leftTime = nextStartTime - curTime
        if (leftTime > 0) {
            gdk.gui.showMessage(`活动开启剩余时间：${TimerUtils.format1(Math.floor(leftTime / 1000))}`);
            return;
        }
    }

    /**跳转购买金币 */
    buyGoldFunc() {
        if (this.curTitle.costType[0] == 4 || this.curTitle.costType[0] == 5) {
            gdk.panel.open(PanelId.Decompose)
            return
        }
        // JumpUtils.openStore([StoreMenuType.Gold])
        if (!JumpUtils.ifSysOpen(2830, true)) {
            return
        }
        gdk.panel.open(PanelId.Alchemy)
    }

    /**跳转购买钻石 */
    buyDiamondFunc() {
        if (this.curTitle.costType[1] == 4 || this.curTitle.costType[1] == 5) {
            gdk.panel.open(PanelId.Decompose)
            return
        }
        // JumpUtils.openStore([StoreMenuType.Diamond])
        JumpUtils.openRechargeView([3]);
    }

    money1ClickFun() {
        let money = this.curTitle.costType[0]
        let bagItem: BagItem = {
            series: money,
            itemId: money,
            itemNum: 1,
            type: BagType.MONEY,
            extInfo: null,
        }
        GlobalUtil.openItemTips(bagItem, true)
    }

    money2ClickFun() {
        let money = this.curTitle.costType[1]
        let bagItem: BagItem = {
            series: money,
            itemId: money,
            itemNum: 1,
            type: BagType.MONEY,
            extInfo: null,
        }
        GlobalUtil.openItemTips(bagItem, true)
    }

}
