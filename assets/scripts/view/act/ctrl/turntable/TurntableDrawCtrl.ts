import ActivityModel from '../../model/ActivityModel';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import StoreViewCtrl, { StoreBaseScoreTabType } from '../../../store/ctrl/StoreViewCtrl';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import {
    ItemCfg,
    Luckydraw_turntable2Cfg,
    Luckydraw_turntableCfg,
    Store_time_giftCfg
    } from '../../../../a/config';

const { ccclass, property } = cc._decorator;

@ccclass
export default class TurntableDrawCtrl extends gdk.BasePanel {

    @property([cc.Node])
    selects: cc.Node[] = []

    @property([UiSlotItem])
    rewardItems: UiSlotItem[] = []

    @property(cc.Sprite)
    curItemIcon: cc.Sprite = null;
    @property(cc.Label)
    curItemNum: cc.Label = null;

    @property(cc.Sprite)
    btn1ItemIcon: cc.Sprite = null;
    @property(cc.Label)
    btn1ItemNum: cc.Label = null;

    @property(cc.Sprite)
    btn2ItemIcon: cc.Sprite = null;
    @property(cc.Label)
    btn2ItemNum: cc.Label = null;

    @property(cc.Sprite)
    refreshCostIcon: cc.Sprite = null;
    @property(cc.Label)
    refreshCostNum: cc.Label = null;

    @property(cc.Node)
    refreshBtn1: cc.Node = null;
    @property(cc.Node)
    refreshBtn2: cc.Node = null;

    @property(cc.Label)
    refreshTime: cc.Label = null;

    @property(cc.RichText)
    recordsText: cc.RichText = null;

    //----------------------刷新背景-----------------------------
    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(cc.Sprite)
    refreshBtn1Bg: cc.Sprite = null;
    @property(cc.Sprite)
    refreshBtn2Bg: cc.Sprite = null;
    @property(cc.LabelOutline)
    refreshline1: cc.LabelOutline = null;
    @property(cc.LabelOutline)
    refreshline2: cc.LabelOutline = null;
    @property(cc.Node)
    refreshTimeLb1: cc.Node = null;

    @property(cc.Sprite)
    btn1Bg: cc.Sprite = null;
    @property(cc.Label)
    btn1Lb: cc.Label = null;
    @property(cc.LabelOutline)
    btn1LbLine: cc.LabelOutline = null;
    @property(cc.LabelOutline)
    btn1Line: cc.LabelOutline = null;

    @property(cc.Sprite)
    btn2Bg: cc.Sprite = null;
    @property(cc.Label)
    btn2Lb: cc.Label = null;
    @property(cc.LabelOutline)
    btn2LbLine: cc.LabelOutline = null;
    @property(cc.LabelOutline)
    btn2Line: cc.LabelOutline = null;

    @property(cc.Node)
    recordBtn: cc.Node = null;

    @property(cc.Node)
    redNode: cc.Node = null;
    @property(cc.Sprite)
    recordSp: cc.Sprite = null;
    @property(cc.Toggle)
    skipBtn: cc.Toggle = null;

    @property(cc.Node)
    giftBtn: cc.Node = null;

    res: number = -1;
    canStart: boolean = false
    time1: number = 0;
    sudu: number = 0.5;
    time2: number = 0;
    index: number = 0;
    speed: number = 1;
    stop: boolean = false;

    rewardData: icmsg.TurntableItem[] = [];
    lastRefreshTime: number;
    refreshChance: number;
    recordData: icmsg.TurntableRecord[] = []

    curType: number = -1;
    turntableCfg: Luckydraw_turntableCfg;
    turntable2Cfgs: Luckydraw_turntable2Cfg[] = [];
    needNum: number = 0;
    btnClick: boolean = false;
    isPlayAnim: boolean = false;
    rewardList: icmsg.GoodsInfo[] = [];
    costItem: ItemCfg;
    curNum: number;

    rewardType1Data: icmsg.TurntableItem[] = [];
    rewardRecord1Data: icmsg.TurntableRecord[] = []
    type1RefreshTime: number = 0;
    type1RefreshChance: number = 0;
    rewardType2Data: icmsg.TurntableItem[] = [];
    rewardRecord2Data: icmsg.TurntableRecord[] = []
    type2RefreshTime: number = 0;
    type2RefreshChance: number = 0;
    get roleModel(): RoleModel { return ModelManager.get(RoleModel) }
    recordStr: string = gdk.i18n.t("i18n:TURNTABLE_TIP5")//`<color=#86d651>@pName</c> 获得 <color=@c>@item</color>`;

    bgStr: string[] = ['tb_xy_zhuanpanbg', 'tb_gj_zhuanpanbg']
    bgPos: cc.Vec2[] = [cc.v2(0, 0), cc.v2(-9, 0)];
    bgWidth: number[] = [661, 680]
    selectBgStr: string[] = ['tb_xy_xuanzhong', 'tb_gj_xuanzhong']

    refreshBgStrs: string[] = ['tb_xy_button', 'tb_gj_button']
    refreshLineColors: cc.Color[] = [cc.color('#173E85'), cc.color('#853617')]
    refreshTimeColors: cc.Color[] = [cc.color('#7082C7'), cc.color('#B58827')]

    tansuoBtnLbColors: cc.Color[] = [cc.color('#C1FFF4'), cc.color('#FEFFE6')]
    tansuoBtnLbLineColors: cc.Color[] = [cc.color('#173E85'), cc.color('#B64000')]

    tansuoBtnLineColors: cc.Color[] = [cc.color('#175593'), cc.color('#282828')]
    tansuoBtnBgStrs: string[] = ['tb_xy_button01', 'tb_gj_button01']
    tansuoBtnSp1Strs: string[] = ['tb_xy_tanbao1ci', 'tb_gj_tanbao1ci']
    tansuoBtnSp2Strs: string[] = ['tb_xy_tanbao15ci', 'tb_gj_tanbao15ci']
    recordSpStrs: string[] = ['tb_xy_tanbaojilu', 'tb_gj_tanbaojilu']

    get aModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    _showGift: { [index: number]: boolean } = {};

    onEnable() {
        this._showGift[0] = false
        this._showGift[1] = false
        this.index = 0;
        this.stop = false;
        this.sudu = 0.5;
        this.isPlayAnim = false;
        this.btnClick = false;
        this.rewardList = []
        this.selects.forEach(node => {
            node.active = false;
        })
        let state = GlobalUtil.getLocal('turnDrawIsSkipAni', true)
        this.skipBtn.isChecked = state == null ? false : state;
        this.selects[this.index].active = true;
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this.updateCostItem, this);
        let time = GlobalUtil.getServerTime();
        GlobalUtil.setLocal('turnDraw_time', time)
    }

    onDisable() {
        gdk.e.targetOff(this)
        gdk.Timer.clearAll(this);
        NetManager.targetOff(this);
        if (this.rewardList.length > 0) {
            let tem = this.rewardList.concat();
            GlobalUtil.openRewadrView(tem);
            this.rewardList = []
        }
    }

    onWeightBtnClick() {
        gdk.panel.setArgs(PanelId.TurntableWeightView, this.curType);
        gdk.panel.open(PanelId.TurntableWeightView);
    }

    pageSelect(event, index, refresh: boolean = false) {

        if (this.curType == index) return
        this.curType = index;


        this.turntableCfg = ConfigManager.getItemByField(Luckydraw_turntableCfg, 'type', this.curType + 1)
        this.turntable2Cfgs = ConfigManager.getItemsByField(Luckydraw_turntable2Cfg, 'type', this.curType + 1);
        this.needNum = 0
        this.turntable2Cfgs.forEach(cfg => {
            if (cfg.tab == 0) {
                this.needNum++;
            }
        })
        this.costItem = ConfigManager.getItemById(ItemCfg, this.turntableCfg.cost[0]);
        this.curNum = BagUtils.getItemNumById(this.turntableCfg.cost[0])

        this.refreshBgInfo()
        //刷新按钮
        this.refreshCostNum.string = this.turntableCfg.reset[1] + gdk.i18n.t("i18n:TURNTABLE_TIP1")
        let path1 = GlobalUtil.getIconById(this.turntableCfg.reset[0])
        GlobalUtil.setSpriteIcon(this.node, this.refreshCostIcon, path1);

        //当前探索消耗物品数量刷新
        this.curItemNum.string = this.curNum + ''
        let path2 = GlobalUtil.getIconById(this.turntableCfg.cost[0])
        GlobalUtil.setSpriteIcon(this.node, this.curItemIcon, path2);

        this.btn1ItemNum.string = this.turntableCfg.cost[1] + ''
        this.btn2ItemNum.string = this.turntableCfg.cost2[1] + ''
        GlobalUtil.setSpriteIcon(this.node, this.btn1ItemIcon, path2);
        GlobalUtil.setSpriteIcon(this.node, this.btn2ItemIcon, path2);


        let tem = this.curType == 0 ? this.rewardType1Data : this.rewardType2Data;
        if (tem.length == 0) {
            let msg = new icmsg.TurntableListReq();
            msg.type = this.curType + 1;
            NetManager.send(msg, (rsp: icmsg.TurntableListRsp) => {

                this.rewardData = rsp.itemList;
                this.lastRefreshTime = rsp.refreshTime;
                this.refreshChance = rsp.refreshChance;
                this.recordData = rsp.drawRecords;
                this.curType == 0 ? this.rewardType1Data = rsp.itemList : this.rewardType2Data = rsp.itemList
                this.curType == 0 ? this.type1RefreshTime = rsp.refreshTime : this.type2RefreshTime = rsp.refreshTime
                this.curType == 0 ? this.type1RefreshChance = rsp.refreshChance : this.type2RefreshChance = rsp.refreshChance
                this.curType == 0 ? this.rewardRecord1Data = rsp.drawRecords : this.rewardRecord2Data = rsp.drawRecords
                this.refreshData()
            }, this)
        } else {
            this.rewardData = tem;
            this.lastRefreshTime = this.curType == 0 ? this.type1RefreshTime : this.type2RefreshTime;
            this.refreshChance = this.curType == 0 ? this.type1RefreshChance : this.type2RefreshChance;
            this.recordData = this.curType == 0 ? this.rewardRecord1Data : this.rewardRecord2Data;
            this.refreshData()
        }

        this._updateGiftBtn()
    }

    //刷新背景信息
    refreshBgInfo() {
        //设置背景图
        let path1 = 'view/act/texture/bg/' + this.bgStr[this.curType];
        GlobalUtil.setSpriteIcon(this.node, this.bg, path1);
        this.bg.node.setPosition(this.bgPos[this.curType])
        this.bg.node.width = this.bgWidth[this.curType]

        //设置刷新按钮
        let path2 = 'view/act/texture/turntable/' + this.refreshBgStrs[this.curType];
        GlobalUtil.setSpriteIcon(this.node, this.refreshBtn1Bg, path2);
        GlobalUtil.setSpriteIcon(this.node, this.refreshBtn2Bg, path2);
        this.refreshline1.color = this.refreshLineColors[this.curType];
        this.refreshline2.color = this.refreshLineColors[this.curType];

        //设置刷新时间描边
        this.refreshTime.node.color = this.refreshTimeColors[this.curType];
        this.refreshTimeLb1.color = this.refreshTimeColors[this.curType];

        //设置选中背景图
        this.selects.forEach(select => {
            let path = 'view/act/texture/turntable/' + this.selectBgStr[this.curType];
            GlobalUtil.setSpriteIcon(this.node, select, path);
        })

        //刷新探索1次按钮
        let path3 = 'view/act/texture/turntable/' + this.tansuoBtnBgStrs[this.curType];
        GlobalUtil.setSpriteIcon(this.node, this.btn1Bg, path3);
        // let path4 = 'view/act/texture/turntable/' + this.tansuoBtnSp1Strs[this.curType];
        // GlobalUtil.setSpriteIcon(this.node, this.btn1Sp, path4);
        this.btn1Lb.string = gdk.i18n.t("i18n:TURNTABLE_TIP2")//'探索1次'
        this.btn1Lb.node.color = this.tansuoBtnLbColors[this.curType];
        this.btn1LbLine.color = this.tansuoBtnLbLineColors[this.curType];

        this.btn1Line.color = this.tansuoBtnLineColors[this.curType]
        //刷新探索10次按钮
        GlobalUtil.setSpriteIcon(this.node, this.btn2Bg, path3);
        // let path5 = 'view/act/texture/turntable/' + this.tansuoBtnSp2Strs[this.curType];
        // GlobalUtil.setSpriteIcon(this.node, this.btn2Sp, path5);
        this.btn2Lb.string = StringUtils.format(gdk.i18n.t("i18n:TURNTABLE_TIP3"), this.turntableCfg.times)//'探索' + this.turntableCfg.times + '次'
        this.btn2Lb.node.color = this.tansuoBtnLbColors[this.curType];
        this.btn2LbLine.color = this.tansuoBtnLbLineColors[this.curType];

        this.btn1Line.color = this.tansuoBtnLineColors[this.curType]

        let path6 = 'view/act/texture/turntable/' + this.recordSpStrs[this.curType];
        GlobalUtil.setSpriteIcon(this.node, this.recordSp, path6);

    }

    refreshData() {
        let curNum = 0;
        for (let i = 0; i < this.rewardData.length; i++) {
            let data = this.rewardData[i]
            if (data.itemType == 0) {
                continue;
            }
            //this.rewardItems[i].recycleItem();
            this.rewardItems[i].starNum = 0;
            this.rewardItems[i].updateItemInfo(data.itemType, data.itemNum);
            this.rewardItems[i].itemInfo = {
                series: 0,
                itemId: data.itemType,
                itemNum: 1,
                type: BagUtils.getItemTypeById(data.itemType),
                extInfo: null
            };
            let state: 0 | 1 = data.fetched ? 1 : 0;
            GlobalUtil.setAllNodeGray(this.rewardItems[i].node, state)
            if (data.fetched) {
                curNum++;
            }

            if (state == 1) {
                let chipEffect = this.rewardItems[i].UiItemIcon.node.getChildByName("chipEffect")
                if (chipEffect && chipEffect.active) {
                    chipEffect.active = false
                }
            }
        }

        //刷新时间设置
        this.refreshBtn1.active = this.refreshChance > 0
        this.refreshBtn2.active = this.refreshChance == 0
        this.refreshTime.node.parent.active = this.refreshChance == 0;
        if (this.refreshChance == 0) {
            let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
            let leftTime = Math.max(0, Math.floor(this.lastRefreshTime - nowTime));
            this.refreshTime.string = '' + TimerUtils.format2(leftTime);
        }
        //刷新探宝记录
        let tem = ''
        let index = 0;
        // let data1 = new TurntableRecord()
        // data1.playerName = '指挥官1'
        // data1.itemType = 180008
        // let data2 = new TurntableRecord()
        // data2.playerName = '指挥官2'
        // data2.itemType = 180009
        // let data3 = new TurntableRecord()
        // data3.playerName = '指挥官3'
        // data3.itemType = 180017
        // let data4 = new TurntableRecord()
        // data4.playerName = '指挥官4'
        // data4.itemType = 180023
        // this.recordData = [data1, data2, data3, data4, data4, data4, data4]
        //`<color=#00ff00>@pName</c> 获得 <color=@c>@item</color>`;

        for (let i = this.recordData.length - 1; i >= 0; i--) {
            let data = this.recordData[i];
            let str = StringUtils.replace(this.recordStr, "@pName", data.playerName);
            let item = BagUtils.getConfigById(data.itemType);
            if (!item) {
                continue;
            }
            let colorStr = '#FFFFFF'
            if (item) {
                colorStr = BagUtils.getColorInfo(item.defaultColor).color
            }
            str = StringUtils.replace(str, "@c", colorStr);
            str = StringUtils.replace(str, "@item", item.name);
            tem += str;

            if (i != 0) {
                tem += '\n'
            }
            index++;
            if (index >= 6) {
                break;
            }
        }
        //this.recordBtn.active = this.recordData.length > 6
        this.recordsText.string = tem
        //刷新刷新按钮红点
        this.redNode.active = curNum == this.needNum;

    }
    dtime: number = 0;
    update(dt: number) {

        if (this.refreshChance == 0) {
            if (this.dtime >= 1) {
                let nowTime = Math.floor(GlobalUtil.getServerTime() / 1000)
                let leftTime = Math.max(0, Math.floor(this.lastRefreshTime - nowTime));
                if (leftTime <= 0) {
                    this.refreshChance = 1;
                    this.refreshBtn1.active = true
                    this.refreshBtn2.active = false
                    this.refreshTime.node.active = false
                    return;
                }
                this.refreshTime.string = '' + TimerUtils.format2(leftTime);
                this.dtime = 0;
            }
            else {
                this.dtime += dt;
            }
        }

        if (this.stop) return;
        if (this.res >= 0 && this.canStart) {
            if (this.time1 > 0) {
                this.time1 -= dt * this.speed;
            }
            this.time2 += dt * this.speed;
            if (this.time2 >= this.sudu) {
                this.time2 -= this.sudu;
                this.selects[this.index].active = false;
                this.index++;
                if (this.index > this.selects.length - 1) {
                    this.index = 0;
                }
                this.selects[this.index].active = true;
                if (this.time1 < 0 && this.sudu < 0.5) {
                    this.sudu += 0.05
                    this.sudu = Math.min(0.5, this.sudu)
                }
                if (this.sudu >= 0.5 && this.index == this.res) {
                    this.res = -1;
                    this.sudu = 0.5
                    this.time2 = 0;
                    this.canStart = false;
                    this.stop = true;
                    if (this.rewardList.length > 0) {
                        let tem = this.rewardList.concat();
                        gdk.e.on("popup#Reward#close", this._closeReward, this);
                        GlobalUtil.openRewadrView(tem);
                        this.rewardList = []
                    }
                    this.refreshData()
                    // for (let i = 0; i < this.rewardData.length; i++) {
                    //     let data = this.rewardData[i]
                    //     let state: 0 | 1 = data.fetched ? 1 : 0;
                    //     GlobalUtil.setAllNodeGray(this.rewardItems[i].node, state)
                    // }
                    gdk.Timer.once(2000, this, () => {
                        this.stop = false;
                        this.isPlayAnim = false;
                    })
                }

            }
        } else {
            this.time2 += dt * this.speed;
            if (this.time2 >= this.sudu) {
                this.time2 -= this.sudu;
                this.selects[this.index].active = false;
                this.index++;
                if (this.index > this.selects.length - 1) {
                    this.index = 0;
                }
                this.selects[this.index].active = true;
            }
        }
    }

    playAnim() {

        this.isPlayAnim = true;
        this.selects.forEach(node => {
            node.active = false;
        })
        this.stop = false;
        //this.res = MathUtil.rnd(0, 7)
        //cc.log('---------------随机获得的物品编号----------------->' + this.res)
        this.canStart = true;
        this.time1 = 2;
        this.sudu = 0.025;
        this.time2 = 0;
        this.index = 0;
        this.selects[this.index].active = true;
    }

    onBtnClick(event, index) {
        let temNum = parseInt(index)
        //cc.log('------------开始探索----------->' + temNum)
        //判断是否符合条件
        let needNum = temNum == 1 ? this.turntableCfg.cost[1] : this.turntableCfg.cost2[1];
        if (this.curNum < needNum) {
            let str = StringUtils.format(gdk.i18n.t("i18n:TURNTABLE_TIP4"), this.costItem.name)
            gdk.gui.showMessage(str)
            return
        }
        if (this.btnClick || this.isPlayAnim) return;
        this.btnClick = true;
        let msg = new icmsg.TurntableDrawReq()
        msg.type = this.curType + 1;
        msg.num = temNum
        NetManager.send(msg, (rsp: icmsg.TurntableDrawRsp) => {
            this.btnClick = false;
            this.rewardData = rsp.itemList;
            this.curType == 0 ? this.rewardType1Data = rsp.itemList : this.rewardType2Data = rsp.itemList
            this.curType == 0 ? this.type1RefreshTime = rsp.refreshTime : this.type2RefreshTime = rsp.refreshTime
            this.curType == 0 ? this.type1RefreshChance = rsp.refreshChance : this.type2RefreshChance = rsp.refreshChance
            this.curType == 0 ? this.rewardRecord1Data = this.rewardRecord1Data.concat(rsp.drawRecords) : this.rewardRecord2Data = this.rewardRecord2Data.concat(rsp.drawRecords)
            this.rewardList = rsp.rewards;
            this.recordData = this.recordData.concat(rsp.drawRecords)
            for (let j = rsp.rewards.length - 1; j >= 0; j--) {
                for (let i = 0; i < rsp.itemList.length; i++) {
                    let data = rsp.itemList[i]
                    if (data.itemType == rsp.rewards[j].typeId) {
                        this.res = i;
                        break;
                    }
                }
                if (this.res >= 0) {
                    break;
                }
            }
            if (this.skipBtn.isChecked) {
                let tem = this.rewardList.concat();
                gdk.e.on("popup#Reward#close", this._closeReward, this);
                GlobalUtil.openRewadrView(tem);
                this.rewardList = [];
                this.refreshData()
            } else {
                this.playAnim()
            }
        }, this)

    }

    refreshRewardData(event, index) {
        let temNum = parseInt(index)
        if (temNum == 2) {
            let item = ConfigManager.getItemById(ItemCfg, this.turntableCfg.reset[0]);
            let cost = this.turntableCfg.reset[1];
            if (this.roleModel.gems >= cost) {
                this._sendRefreshRewardReq()
            } else {
                //钻石不足判断
                if (!GlobalUtil.checkMoneyEnough(cost, 2, null, [PanelId.Instance])) {
                    return
                }
            }
        } else {
            this._sendRefreshRewardReq()
        }
    }

    _sendRefreshRewardReq() {
        let msg = new icmsg.TurntableRefreshReq()
        msg.type = this.curType + 1;
        NetManager.send(msg, (rsp: icmsg.TurntableRefreshRsp) => {
            this.rewardData = rsp.itemList;
            this.curType == 0 ? this.rewardType1Data = rsp.itemList : this.rewardType2Data = rsp.itemList
            this.curType == 0 ? this.type1RefreshTime = rsp.refreshTime : this.type2RefreshTime = rsp.refreshTime
            this.curType == 0 ? this.type1RefreshChance = rsp.refreshChance : this.type2RefreshChance = rsp.refreshChance
            this.lastRefreshTime = rsp.refreshTime;
            this.refreshChance = rsp.refreshChance;
            this.refreshData()
        }, this)
    }

    updateCostItem() {
        if (this.turntableCfg) {
            this.curNum = BagUtils.getItemNumById(this.turntableCfg.cost[0])
            this.curItemNum.string = this.curNum + ''
        }
    }

    showAllRecords() {

    }

    changeSpeed() {

        this.speed = this.speed == 1 ? 2 : 1
    }

    //打开探宝积分商店
    openStoreView() {
        JumpUtils.openPanel({
            panelId: PanelId.Store,
            panelArgs: { args: [0] },
            currId: this.node,
            callback: (panel) => {
                let comp = panel.getComponent(StoreViewCtrl)
                comp.typeBtnSelect(null, StoreBaseScoreTabType.Turntable)
                gdk.Timer.once(10, this, () => {
                    comp.typeBtnSelect(null, StoreBaseScoreTabType.Turntable)
                })
            }
        });
    }

    skipBtnClick() {
        GlobalUtil.setLocal('turnDrawIsSkipAni', this.skipBtn.isChecked, true);
    }

    @gdk.binding("aModel.LimitGiftDatas")
    _updateGiftBtn() {
        this.giftBtn.active = false
        let giftType = this.curType == 0 ? 4 : 5
        let giftDatas = ModelManager.get(ActivityModel).LimitGiftDatas
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        for (let i = 0; i < giftDatas.length; i++) {
            let cfg = ConfigManager.getItemById(Store_time_giftCfg, giftDatas[i].giftId)
            if (cfg.gift_type == giftType && ((curTime < giftDatas[i].endTime && giftDatas[i].state == 0) || giftDatas[i].state == 1)) {
                this.giftBtn.active = true
                break
            }
        }
    }

    _closeReward() {
        if (this.giftBtn.active && !this._showGift[this.curType]) {
            this._showGift[this.curType] = true
            gdk.panel.setArgs(PanelId.TurntableGiftView, this.curType == 0 ? 4 : 5)
            gdk.panel.open(PanelId.TurntableGiftView)
            gdk.e.off("popup#Reward#close", this._closeReward, this);
        }
    }

    onGiftClick() {
        this._updateGiftBtn()
        if (!this.giftBtn.active) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:TURNTABLE_TIP8"))
            return
        }
        gdk.panel.setArgs(PanelId.TurntableGiftView, this.curType == 0 ? 4 : 5)
        gdk.panel.open(PanelId.TurntableGiftView)
    }
}
