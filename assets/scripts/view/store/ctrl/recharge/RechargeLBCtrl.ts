import ActUtil from '../../../act/util/ActUtil';
import ChampionModel from '../../../champion/model/ChampionModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import ShaderHelper from '../../../../common/shader/ShaderHelper';
import StoreModel from '../../model/StoreModel';
import StoreUtils from '../../../../common/utils/StoreUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';
import { Store_giftCfg, Store_onepriceCfg } from '../../../../a/config';
import { StoreEventId } from '../../enum/StoreEventId';
import { StoreType } from '../../enum/StoreType';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-29 13:35:41
 */

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


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/recharge/RechargeLBCtrl")
export default class RechargeLBCtrl extends gdk.BasePanel {

    @property(cc.Button)
    typeBtns: cc.Button[] = []

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    storeGiftItem: cc.Prefab = null

    @property(cc.Node)
    giftPanel: cc.Node = null;

    storeTitleConfig = [
        { type: StoreType.LIMITTIMEGIFTBAG, title: "xianshi", btnText: gdk.i18n.t('i18n:STORE_TIP36'), costType: [2, 3], isShow: true },
        { type: StoreType.LIMITGIFTBAG, title: "xianding", btnText: gdk.i18n.t('i18n:STORE_TIP37'), costType: [2, 3], isShow: true },
        { type: StoreType.DAILYGIFTBAG, title: "meiri", btnText: gdk.i18n.t('i18n:STORE_TIP8'), costType: [2, 3], isShow: true },
        { type: StoreType.WEEKLYGIFTBAG, title: "meizhou", btnText: gdk.i18n.t('i18n:STORE_TIP9'), costType: [2, 3], isShow: true },
        { type: StoreType.MONTHGIFTBAG, title: "meiyue", btnText: gdk.i18n.t('i18n:STORE_TIP10'), costType: [2, 3], isShow: true },
    ]

    typeSelect: number = 0
    lastSelect: number = 0
    curTitle: TitleType = null
    list: ListView = null
    giftItemWidth = 160
    perRowNum = 4 //商品每行数量

    freeGift: any = {}; // tab-giftId
    dailyGiftId: number[] = [];//每日商店礼包id （不包括免费）

    tabMap = {}

    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get model(): StoreModel { return ModelManager.get(StoreModel); }
    get serverModel(): ServerModel { return ModelManager.get(ServerModel); }
    get copyModel(): CopyModel { return ModelManager.get(CopyModel); }

    onEnable() {

        this.tabMap[StoreType.LIMITTIMEGIFTBAG] = 3
        this.tabMap[StoreType.LIMITGIFTBAG] = 4
        this.tabMap[StoreType.DAILYGIFTBAG] = 1
        this.tabMap[StoreType.WEEKLYGIFTBAG] = 2
        this.tabMap[StoreType.MONTHGIFTBAG] = 6

        let cfgs = ConfigManager.getItems(Store_giftCfg);
        cfgs.forEach(cfg => {
            if (cfg.tab == 1 && cfg.RMB_cost > 0) {
                this.dailyGiftId.push(cfg.gift_id);
            }
            if (cfg.RMB_cost == 0) {
                this.freeGift[cfg.tab] = cfg.gift_id;
            }
        })
        NetManager.send(new icmsg.StoreGiftListReq())
        this.initTypeBtnState()
        this.initMonthGiftBtnState()
        this._updateBtnState()
        this._updateStoreScroll()
        gdk.e.on(StoreEventId.UPDATE_PAY_SUCC, this._updatePaySucc, this)
    }

    onDisable() {
        this._saveGiftData(this.typeSelect)
        gdk.e.targetOff(this)
        gdk.Timer.clear(this, this._updateWeekTimer);
    }

    _initListView() {
        if (this.list) {
            this.list.destroy()
        }
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
        // this.list.updateItemSize(693, this.curTitle.type == StoreType.DAILYGIFTBAG ? 229.1 : 182);
    }

    _updateStoreScroll() {
        this._initListView()
        this._updateGiftInfo()
    }


    initTypeBtnState() {
        this.storeTitleConfig[0].isShow = false; //限时礼包列表为空   隐藏按钮
        let tempList = ConfigManager.getItems(Store_giftCfg);
        for (let i = 0; i < tempList.length; i++) {
            if (this._checkGiftOpen(tempList[i]) && tempList[i].tab == 4 && tempList[i].RMB_cost > 0) {
                return
            }
        }
        this.storeTitleConfig[1].isShow = false //限定关闭
    }

    initMonthGiftBtnState() {
        let tempList = ConfigManager.getItems(Store_giftCfg);
        for (let i = 0; i < tempList.length; i++) {
            if (this._checkGiftOpen(tempList[i]) && tempList[i].tab == 6 && tempList[i].RMB_cost > 0) {
                return
            }
        }
        this.storeTitleConfig[4].isShow = false
    }

    _updateBtnState() {
        let startIdx: number;
        for (let index = 0; index < this.typeBtns.length; index++) {
            const btn = this.typeBtns[index];
            let info = this.storeTitleConfig[index]
            btn.node.active = !!info && info.isShow
            btn.node.getChildByName('RedPoint').active = false;
            if (!startIdx && startIdx != 0 && btn.node.active) startIdx = index;

            if (!!info && info.isShow) {
                let commonText = btn.node.getChildByName("common").getChildByName("label")
                let selectText = btn.node.getChildByName("select").getChildByName("label")
                if ([StoreType.DAILYGIFTBAG, StoreType.WEEKLYGIFTBAG, StoreType.MONTHGIFTBAG].indexOf(info.type) != -1) {
                    let freeGiftId = this.freeGift[this.tabMap[info.type]]
                    let giftCfg = ConfigManager.getItemById(Store_giftCfg, freeGiftId)
                    if (!this._checkGiftOpen(giftCfg)) {
                        btn.node.getChildByName('RedPoint').active = false
                    }
                    else {
                        let buyInfo = StoreUtils.getStoreGiftBuyInfo(freeGiftId)
                        btn.node.getChildByName('RedPoint').active = (buyInfo && buyInfo.count >= 1) ? false : true


                    }
                }
                if (info.btnText) {
                    commonText.getComponent(cc.Label).string = `${info.btnText}`
                    selectText.getComponent(cc.Label).string = `${info.btnText}`
                }
            }
        }

        this.lastSelect = startIdx

        this.typeBtnSelect(null, startIdx)
    }

    typeBtnSelect(e, utype) {
        utype = parseInt(utype)
        this.curTitle = this.storeTitleConfig[utype]
        this.typeSelect = utype
        this._updateGiftTopPanel();
        for (let idx = 0; idx < this.typeBtns.length; idx++) {
            const element = this.typeBtns[idx];
            element.interactable = idx != utype
            let select = element.node.getChildByName("select");
            select.active = idx == utype
            let common = element.node.getChildByName("common");
            common.active = idx != utype
        }
        if (this.curTitle && this.curTitle.type <= StoreType.MONTHCARD) {
            this._updateStoreScroll()
        }

        if (this.lastSelect != this.typeSelect) {
            this._saveGiftData(this.lastSelect)
        }
        this._updateBtnRedpoint()
        this.lastSelect = this.typeSelect
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    _saveGiftData(type) {
        //礼包id录入缓存
        let giftIds = []
        let lastTitle = this.storeTitleConfig[type]
        let cfgs = ConfigManager.getItemsByField(Store_giftCfg, "tab", this.tabMap[lastTitle.type])
        for (let i = 0; i < cfgs.length; i++) {
            if (this._checkGiftOpen(cfgs[i])) {
                giftIds.push(cfgs[i].gift_id)
            }
        }
        GlobalUtil.setLocal("newGiftData" + this.tabMap[lastTitle.type], giftIds)
    }

    _checkGiftOpen(cfg: Store_giftCfg) {
        let openLv: number = parseInt(cfg.gift_level || 0) || 0;
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
        this._updateGiftInfo();
    }

    /**礼包信息更新 */
    _updateGiftInfo() {
        let cfgs: Store_giftCfg[] = [];
        let tempList = ConfigManager.getItems(Store_giftCfg);
        tempList.forEach(element => {
            if (this._checkGiftOpen(element) && element.tab == this.tabMap[this.curTitle.type] && element.RMB_cost > 0) {
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

    _updateBtnRedpoint() {
        for (let index = 0; index < this.typeBtns.length; index++) {
            const btn = this.typeBtns[index]
            let info = this.storeTitleConfig[index]
            let freeGiftId = this.freeGift[this.tabMap[info.type]]
            let buyInfo = StoreUtils.getStoreGiftBuyInfo(this.freeGift[this.tabMap[info.type]]);
            if (freeGiftId > 0) {
                btn.node.getChildByName('RedPoint').active = (buyInfo && buyInfo.count >= 1) ? false : true;
            } else {
                btn.node.getChildByName('RedPoint').active = false
            }
            //礼包是否第一次出现（记录在本地缓存）
            if (this.tabMap[info.type] != 1) {
                let cfgs = ConfigManager.getItemsByField(Store_giftCfg, "tab", this.tabMap[info.type])
                for (let i = 0; i < cfgs.length; i++) {
                    let giftIds = GlobalUtil.getLocal("newGiftData" + this.tabMap[info.type]) || []
                    if (giftIds.indexOf(cfgs[i].gift_id) == -1 && this._checkGiftOpen(cfgs[i])) {
                        btn.node.getChildByName('RedPoint').active = true
                        break
                    }
                }
            }
        }
    }

    scrollToGift(id: number) {
        if (!this.list) return;
        let idx = 0;
        let datas = this.list.datas || [];
        for (let i = 0; i < datas.length; i++) {
            let cfg = <Store_giftCfg>datas[i].cfg;
            if (cfg && cfg.gift_id == id) {
                idx = i;
                break;
            }
        }
        this.list.scroll_to(idx);
    }

    //充值成功
    _updatePaySucc(e: gdk.Event) {

        GlobalUtil.openRewadrView(e.data.list)

        //免费礼包
        let ids = [];
        for (let key in this.freeGift) {
            ids.push(this.freeGift[key]);
        }

        //每日礼包
        if (this.dailyGiftId.indexOf(e.data.paymentId) != -1 || e.data.paymentId == 20001) {
            let dailyAllBuyNode = cc.find('dailyAllBuyBtn', this.giftPanel);
            dailyAllBuyNode.active = false;
        }

        if (ids.indexOf(e.data.paymentId) != -1) {
            let pageBtn = this.curTitle.type == StoreType.DAILYGIFTBAG ? this.typeBtns[2] : this.typeBtns[3];
            if (this.curTitle.type == StoreType.MONTHGIFTBAG) {
                pageBtn = this.typeBtns[4]
            }
            cc.find('layout/freeGiftBtn/RedPoint', this.giftPanel).active = false;
            cc.find('layout/freeGiftBtn/mask', this.giftPanel).active = true;
            cc.find('layout/freeGiftBtn/label', this.giftPanel).getComponent(ShaderHelper).enabled = true;
            pageBtn.node.getChildByName('RedPoint').active = false;
            return
        }

        let limitGiftOpenCondsids = [];
        ConfigManager.getItems(Store_giftCfg, (cfg: Store_giftCfg) => {
            if (cfg.tab == 4 && cfg.open_conds) {
                limitGiftOpenCondsids.push(cfg.open_conds);
            }
        });

        if (limitGiftOpenCondsids.indexOf(e.data.paymentId) != -1) {
            GlobalUtil.openAskPanel({
                descText: gdk.i18n.t('i18n:RECHARGE_TIP1'),
                sureText: gdk.i18n.t('i18n:HERO_TIP50'),
                sureCb: () => {
                },
                oneBtn: true
            })
            this._updateGiftInfo();
        }

        // 免费礼包以外的购买弹出 充值成功 的提示
        // gdk.gui.showMessage(gdk.i18n.t('i18n:MINECOPY_PASSPORT_TIP9'))
    }

    /**更新每周/每日礼包的刷新时间 */
    _updateWeekTimer() {
        let refreshTimeNode = this.giftPanel.getChildByName('refreshTime');
        let timeLabel = refreshTimeNode.getChildByName('timeLabel').getComponent(cc.Label);
        let nowTime = GlobalUtil.getServerTime();
        let nowDate = new Date(nowTime);
        let day = [7, 1, 2, 3, 4, 5, 6];
        let leftDay = 7 - day[nowDate.getDay()];
        let leftTime;
        if (this.curTitle.type == StoreType.WEEKLYGIFTBAG) {
            leftTime = leftDay * 24 * 60 * 60 * 1000 + (TimerUtils.getTomZerohour(nowTime / 1000) * 1000 - nowTime);
        }
        else if (this.curTitle.type == StoreType.DAILYGIFTBAG) {
            leftTime = TimerUtils.getTomZerohour(nowTime / 1000) * 1000 - nowTime;
        } else if (this.curTitle.type == StoreType.MONTHGIFTBAG) {
            let monthDays = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0).getDate()
            leftTime = (monthDays - nowDate.getDate()) * 24 * 60 * 60 * 1000 + (TimerUtils.getTomZerohour(nowTime / 1000) * 1000 - nowTime);
        }
        timeLabel.string = TimerUtils.format3(Math.floor(leftTime / 1000));
        if (leftTime <= 0) {
            gdk.Timer.clear(this, this._updateWeekTimer);
            this.model.giftBuyList = this.model.giftBuyList;
        }
    }

    /**更新礼包界面顶部UI */
    _updateGiftTopPanel() {
        gdk.Timer.clear(this, this._updateWeekTimer);
        this.giftPanel.active = true;
        let title = this.giftPanel.getChildByName('tips');
        let refreshTimeNode = this.giftPanel.getChildByName('refreshTime');
        let dailyTips = this.giftPanel.getChildByName('dailyTips');
        let freeGiftNode = cc.find('layout/freeGiftBtn', this.giftPanel);
        let dailyAllBuyNode = cc.find('dailyAllBuyBtn', this.giftPanel);

        //标题
        let titleUrl = `view/store/textrue/store/lb_guanggao_` + this.curTitle.title;
        GlobalUtil.setSpriteIcon(this.node, title, titleUrl);
        dailyTips.active = this.curTitle.type == StoreType.DAILYGIFTBAG;

        title.setPosition(this.curTitle.type == StoreType.DAILYGIFTBAG ? cc.v2(0, 51.441) : cc.v2(-114.177, -6.763));
        dailyTips.setPosition(this.curTitle.type == StoreType.DAILYGIFTBAG ? cc.v2(0, 5.039) : cc.v2(-74.139, -94.956));

        //倒计时
        if ([StoreType.WEEKLYGIFTBAG, StoreType.DAILYGIFTBAG, StoreType.MONTHGIFTBAG].indexOf(this.curTitle.type) != -1) {
            refreshTimeNode.active = true;
            gdk.Timer.frameLoop(1, this, this._updateWeekTimer);
        }
        else {
            refreshTimeNode.active = false;
        }

        //一口价  每日
        let b: boolean = false;
        for (let i = 0; i < this.dailyGiftId.length; i++) {
            let buyInfo = StoreUtils.getStoreGiftBuyInfo(this.dailyGiftId[i]);
            if (buyInfo && buyInfo.count >= 1) {
                b = true;
                break;
            }
        }
        if (!b && this.curTitle.type == StoreType.DAILYGIFTBAG) {
            dailyAllBuyNode.active = true;
            let onePriceCfg = ConfigManager.getItem(Store_onepriceCfg, (cfg: Store_onepriceCfg) => {
                if (cfg.id == 20001) {
                    return true;
                }
            });
            cc.find('prices', dailyAllBuyNode).getComponent(cc.Label).string = `${onePriceCfg.price}元`;
        }
        else {
            dailyAllBuyNode.active = false;
        }

        //免费礼盒  每日/每周
        if ([StoreType.DAILYGIFTBAG, StoreType.WEEKLYGIFTBAG, StoreType.MONTHGIFTBAG].indexOf(this.curTitle.type) != -1) {
            let freeGiftId = this.freeGift[this.tabMap[this.curTitle.type]]
            let giftCfg = ConfigManager.getItemById(Store_giftCfg, freeGiftId);
            let pageBtn = this.curTitle.type == StoreType.DAILYGIFTBAG ? this.typeBtns[2] : this.typeBtns[3]
            if (this.curTitle.type == StoreType.MONTHGIFTBAG) {
                pageBtn = this.typeBtns[4]
            }
            if (!this._checkGiftOpen(giftCfg)) {
                freeGiftNode.active = false;
                pageBtn.node.getChildByName('RedPoint').active = false;
            }
            else {
                freeGiftNode.active = true;
                let freeGiftIcon = freeGiftNode.getChildByName('icon');
                let label = freeGiftNode.getChildByName('label').getComponent(cc.Label);
                label.string = this.curTitle.type == StoreType.DAILYGIFTBAG ? gdk.i18n.t('i18n:RECHARGE_TIP2') : gdk.i18n.t('i18n:RECHARGE_TIP3');
                if (this.curTitle.type == StoreType.MONTHGIFTBAG) {
                    label.string = gdk.i18n.t('i18n:RECHARGE_TIP12')
                }
                let iconUrl = `view/store/textrue/store/lb_icon_` + this.curTitle.title
                GlobalUtil.setSpriteIcon(this.node, freeGiftIcon, iconUrl);
                let buyInfo = StoreUtils.getStoreGiftBuyInfo(freeGiftId);
                cc.find('layout/freeGiftBtn/RedPoint', this.giftPanel).active = (buyInfo && buyInfo.count >= 1) ? false : true;
                cc.find('layout/freeGiftBtn/mask', this.giftPanel).active = (buyInfo && buyInfo.count >= 1) ? true : false;
                label.getComponent(ShaderHelper).enabled = (buyInfo && buyInfo.count >= 1) ? true : false;
                pageBtn.node.getChildByName('RedPoint').active = (buyInfo && buyInfo.count >= 1) ? false : true;
            }
        }
        else {
            freeGiftNode.active = false;
        }


    }

    onFreeGiftClick() {
        let idx = [StoreType.DAILYGIFTBAG, StoreType.WEEKLYGIFTBAG, StoreType.MONTHGIFTBAG].indexOf(this.curTitle.type);
        if (idx != -1) {
            let giftId = this.freeGift[this.tabMap[this.curTitle.type]]//this.freeGift[1] : this.freeGift[2];
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


}