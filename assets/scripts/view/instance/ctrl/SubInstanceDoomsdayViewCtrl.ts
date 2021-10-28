import ActivityModel from '../../act/model/ActivityModel';
import ActUtil from '../../act/util/ActUtil';
import BagUtils from '../../../common/utils/BagUtils';
import CarnivalUtil from '../../act/util/CarnivalUtil';
import CombineModel from '../../combine/model/CombineModel';
import CombineUtils from '../../combine/util/CombineUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import DoomsDayModel from '../model/DoomsDayModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import SubInsSweepViewCtrl from './SubInsSweepViewCtrl';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import {
    Copy_stageCfg,
    CopyCfg,
    GlobalCfg,
    ItemCfg,
    VipCfg
    } from '../../../a/config';
import { CopyType } from './../../../common/models/CopyModel';
import { InstanceEventId } from '../enum/InstanceEnumDef';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
/** 
 * @Description: 副本奖杯界面控制器
 * @Author: luoyong  
 * @Date: 2020-07-02 14:00:53
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-04-01 11:29:21
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/SubInstanceDoomsdayViewCtrl")
export default class SubInstanceDoomsdayViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    subEliteItem: cc.Prefab = null

    @property(cc.Sprite)
    bg: cc.Sprite = null;
    @property(cc.Sprite)
    bg1: cc.Sprite = null;
    @property(cc.Sprite)
    bg2: cc.Sprite = null;
    @property(cc.Sprite)
    bg3: cc.Sprite = null;
    @property(cc.Label)
    num: cc.Label = null;
    @property(cc.Node)
    oneRaidsNode: cc.Node = null;

    @property([cc.Node])
    redNodes: cc.Node[] = [];

    @property(UiTabMenuCtrl)
    menuCtrl: UiTabMenuCtrl = null;

    list: ListView = null
    cfgList: Copy_stageCfg[] = []

    listData: any[] = []
    curIndex = -1;
    get doomsDayModel() { return ModelManager.get(DoomsDayModel); }
    get roleModel() { return ModelManager.get(RoleModel); }
    bgStrs: string[] = ['mrky_jinbifubenbg', 'mrky_jingyanfubenbg', 'mrky_guanggaobg', 'mrky_guanggaobg', 'mrky_guanggaobg']
    bg1Strs: string[] = ['mrky_jinbifuben01', 'mrky_jingyanfuben01', 'mrky_jiqiangcailiao01', 'mrky_paobingcailiao01', 'mrky_shouweicailiao01']
    bg2Strs: string[] = ['mrky_jinbifuben', 'mrky_jingyanfuben', 'mrky_jiqiangcailiao', 'mrky_paobingcailiao', 'mrky_shouweicailiao']
    bg3Strs: string[] = [null, null, 'mrky_qiangbingjinjie', 'mrky_paobingjinjie', 'mrky_shouweijinjie']
    subTypes: number[] = [46, 47, 36, 37, 38]

    info: icmsg.DoomsDayInfo;
    allnum: number = 0;
    freeNum: number = 0;
    //isAttack: boolean = true;
    powerNum: number = 0;
    quickCost: number[] = [];
    onLoad() {

    }

    onEnable() {
        this._updateMenuBtn();
        gdk.e.on(InstanceEventId.RSP_DOOMSDAY_INFO_REFRESH, this._refreshInfoData, this)
        if (this.doomsDayModel.curIndex > 0) {
            this.menuCtrl.setSelectIdx(this.doomsDayModel.curIndex);
            this.doomsDayModel.curIndex = 0;
        }
    }

    onDisable() {

        gdk.e.off(InstanceEventId.RSP_DOOMSDAY_INFO_REFRESH, this._refreshInfoData, this)
    }

    onDestroy() {
        if (this.list) {
            this.list.destroy();
        }
    }

    @gdk.binding("roleModel.level")
    _updateMenuBtn() {
        this.menuCtrl.node.children.forEach((btn, idx) => {
            let limitNode = btn.getChildByName('limit');
            let cfgs = ConfigManager.getItems(Copy_stageCfg, { 'copy_id': CopyType.DoomsDay, 'subtype': this.subTypes[idx] });
            if (cfgs[0].player_lv && cfgs[0].player_lv > this.roleModel.level) {
                if (limitNode) {
                    limitNode.active = true
                    limitNode.getChildByName('lvLab').getComponent(cc.Label).string = StringUtils.format(gdk.i18n.t("i18n:INS_LIST_TIP1"), cfgs[0].player_lv)//`${cfgs[0].player_lv}级开放`;
                }
            }
            else {
                limitNode && (limitNode.active = false);
            }
        });
        this._updateRedpoint();
    }

    _updateRedpoint() {
        let vipCfg = ConfigManager.getItemByField(VipCfg, "level", this.roleModel.vipLv)
        //let vipNum = (vipCfg && cc.js.isNumber(vipCfg.vip7)) ? vipCfg.vip7 : 0;

        this.freeNum = ConfigManager.getItemByField(GlobalCfg, 'key', 'doomsday_free_sweep').value[0];
        let activityModel = ModelManager.get(ActivityModel);
        let rank = activityModel.roleServerRank ? activityModel.roleServerRank.rank : -1;
        if (rank >= 1 && rank <= 3) {
            let cServerRankTCfg = CarnivalUtil.getCrossRankConfig(rank);
            if (cc.js.isNumber(cServerRankTCfg.privilege1)) {
                this.freeNum += cServerRankTCfg.privilege1
            }
        }

        //合服特权
        let combineModel = ModelManager.get(CombineModel)
        let combineRank = combineModel.serverRank ? combineModel.serverRank : -1
        if (ActUtil.ifActOpen(95) && combineRank >= 1 && combineRank <= 3) {
            let combineRankTCfg = CombineUtils.getCrossRankConfig(combineRank);
            if (cc.js.isNumber(combineRankTCfg.privilege1)) {
                this.freeNum += combineRankTCfg.privilege1
            }
        }

        this.redNodes.forEach((node, i) => {
            // if (i == this.curIndex) {
            //     node.active = false;
            //     return;
            // }
            //等级限制
            let cfgs = ConfigManager.getItems(Copy_stageCfg, { 'copy_id': CopyType.DoomsDay, 'subtype': this.subTypes[i] });
            if (cfgs[0].player_lv && cfgs[0].player_lv > this.roleModel.level) {
                node.active = false;
                return;
            }
            let copyCfg = ConfigManager.getItem(CopyCfg, { 'copy_id': CopyType.DoomsDay, 'subtype': this.subTypes[i] });
            if (copyCfg) {
                let vipNum = 0;
                if (copyCfg.subtype < 46) {
                    vipNum = (vipCfg && cc.js.isNumber(vipCfg.vip7)) ? vipCfg.vip7 : 0;
                }
                let all = copyCfg.participate + vipNum + this.freeNum;
                let use = 0;
                let stageid = 0;

                this.doomsDayModel.doomsDayInfos.some(data => {
                    if (data.subType == copyCfg.subtype) {
                        use = data.num;
                        stageid = data.stageId;
                        return true;
                    }
                    return false;
                })
                // if (copyCfg.subtype >= 46) {
                //     node.active = all > use && this.doomsDayModel.enterStageIDs.indexOf(copyCfg.subtype) < 0
                //     return;
                // }
                if (stageid > 0) {
                    let state = all > use;
                    if (!state) {
                        let cfg = ConfigManager.getItemByField(Copy_stageCfg, 'id', stageid + 1, { 'subtype': copyCfg.subtype });
                        if (cfg && this.roleModel.MaxPower >= cfg.power && this.doomsDayModel.enterStageIDs.indexOf(copyCfg.subtype) < 0) {
                            state = true;
                        }
                    }
                    node.active = state //&& this.doomsDayModel.enterStageIDs.indexOf(copyCfg.subtype) < 0;
                } else {
                    let cfgList = ConfigManager.getItems(Copy_stageCfg, { 'copy_id': CopyType.DoomsDay, 'subtype': this.subTypes[i] });
                    if (cfgList[0].power > this.roleModel.power) {
                        node.active = false;
                    } else {
                        node.active = all > use && this.doomsDayModel.enterStageIDs.indexOf(copyCfg.subtype) < 0;
                    }
                }

            } else {
                node.active = false;
            }
        })
    }

    _refreshInfoData() {
        this.pageSelect(null, this.curIndex, true);
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
            column: 1,
            gap_x: 0,
            gap_y: 10,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _updateScroll(ref: boolean = false) {
        this._initListView()
        this.listData = []
        //let power = 11111
        //let copyCfg = ConfigManager.getItem(CopyCfg, { 'copy_id': 14, 'subtype': this.info.subType })
        let firstPower = false;
        this.cfgList.forEach(cfg => {
            let state = false;
            if (this.powerNum < cfg.power && !firstPower && this.info.stageId < cfg.id) {
                firstPower = true;
                state = true;
            }
            let data = { info: this.info, power: this.powerNum, stageData: cfg, allNum: this.allnum, freeNum: this.freeNum, quickCost: this.quickCost, state: state };
            this.listData.push(data);
        })

        this.list.set_data(this.listData, !ref)


        if (!ref) {
            let index = 0
            if (this.info.stageId > 0) {
                for (let i = 0; i < this.cfgList.length; i++) {
                    let cfg = this.cfgList[i];
                    if (this.info.stageId == cfg.id) {
                        index = i;
                        break;
                    }
                }
            }
            this.list.scroll_to(index)
        }

    }



    pageSelect(event: any, index: number, refresh: boolean = false) {

        let subType = this.subTypes[index]
        // if (this.doomsDayModel.enterStageIDs.indexOf(subType) < 0) {
        //     this.doomsDayModel.enterStageIDs.push(subType);
        // }
        if (this.curIndex == index && !refresh) {
            return;
        }
        let cfgs = ConfigManager.getItems(Copy_stageCfg, { 'copy_id': CopyType.DoomsDay, 'subtype': this.subTypes[index] });
        if (cfgs[0].player_lv && cfgs[0].player_lv > this.roleModel.level) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:INS_HERO_VIEW_TIP1"), cfgs[0].player_lv))//(`指挥官等级达到${cfgs[0].player_lv}级开放`)
            this.menuCtrl.showSelect(this.curIndex);
            return;
        }
        this.cfgList = cfgs;
        this.curIndex = index;

        this.info = null;
        this.doomsDayModel.doomsDayInfos.forEach(data => {
            if (data.subType == this.subTypes[index]) {
                this.info = data;
            }
        })

        let vipCfg = ConfigManager.getItemByField(VipCfg, "level", this.roleModel.vipLv)
        let vipNum = (vipCfg && cc.js.isNumber(vipCfg.vip7)) ? vipCfg.vip7 : 0;
        if (this.subTypes[this.curIndex] >= 46) {
            vipNum = 0;
        }
        this.freeNum = ConfigManager.getItemByField(GlobalCfg, 'key', 'doomsday_free_sweep').value[0];
        let activityModel = ModelManager.get(ActivityModel);
        let rank = activityModel.roleServerRank ? activityModel.roleServerRank.rank : -1;
        if (rank >= 1 && rank <= 3) {
            let cServerRankTCfg = CarnivalUtil.getCrossRankConfig(rank);
            if (cc.js.isNumber(cServerRankTCfg.privilege1)) {
                this.freeNum += cServerRankTCfg.privilege1
            }
        }

        //合服特权
        let combineModel = ModelManager.get(CombineModel)
        let combineRank = combineModel.serverRank ? combineModel.serverRank : -1
        if (ActUtil.ifActOpen(95) && combineRank >= 1 && combineRank <= 3) {
            let combineRankTCfg = CombineUtils.getCrossRankConfig(combineRank);
            if (cc.js.isNumber(combineRankTCfg.privilege1)) {
                this.freeNum += combineRankTCfg.privilege1
            }
        }

        //刷新页签红点
        this._updateRedpoint();

        if (!this.info) {
            //cc.log('缺少末日副本-----' + this.subTypes[index] + '类型的数据')
            this.info = new icmsg.DoomsDayInfo();
            this.info.subType = this.subTypes[index];
            this.info.stageId = 0;
            this.info.num = 0;
        }
        // let heroInfos = ModelManager.get(HeroModel).heroInfos;
        // heroInfos.sort((a: any, b: any) => {
        //     let infoA = <HeroInfo>a.extInfo;
        //     let infoB = <HeroInfo>b.extInfo;
        //     return infoB.power - infoA.power;
        // })
        // if (heroInfos.length > 6) {
        //     heroInfos.length == 6;
        // }
        this.powerNum = this.roleModel.MaxPower//0;
        // heroInfos.forEach(info => {
        //     let tem = <HeroInfo>info.extInfo;
        //     this.powerNum += tem.power;
        // })

        // this.isAttack = this.cfgList[this.cfgList.length - 1].id != this.info.stageId;
        // if (this.isAttack) {
        //     if (this.info.stageId > 0) {
        //         //let power = 11111;
        //         let cfg = ConfigManager.getItemById(Copy_stageCfg, this.info.stageId + 1);
        //         if (cfg.power > this.powerNum) {
        //             this.isAttack = false;
        //         }
        //     }
        // }
        let state: 0 | 1 = this.info.stageId > 0 ? 0 : 1;
        GlobalUtil.setAllNodeGray(this.oneRaidsNode, state);
        let copyCfg = ConfigManager.getItem(CopyCfg, { 'copy_id': CopyType.DoomsDay, 'subtype': this.subTypes[index] })
        this.quickCost = copyCfg.quick_cost;
        this.allnum = vipNum + copyCfg.participate + this.freeNum;
        let path = 'view/instance/texture/bg/' + this.bgStrs[index]
        let path1 = 'view/instance/texture/bg/' + this.bg1Strs[index]
        let path2 = 'view/instance/texture/view/' + this.bg2Strs[index]
        GlobalUtil.setSpriteIcon(this.node, this.bg, path)
        GlobalUtil.setSpriteIcon(this.node, this.bg1, path1)
        GlobalUtil.setSpriteIcon(this.node, this.bg2, path2)
        this.bg3.node.active = !!this.bg3Strs[index];
        if (!!this.bg3Strs[index]) {
            let path3 = 'view/instance/texture/bg/' + this.bg3Strs[index]
            GlobalUtil.setSpriteIcon(this.node, this.bg3.node.getChildByName('bg3'), path3)
        }
        this.num.string = (this.allnum - this.info.num) + ''
        this.refreshData(refresh);
    }

    refreshData(ref: boolean = false) {
        this._updateScroll(ref)
    }


    //一键扫荡按钮点击事件
    oneRaidsClick() {
        if (this.info.stageId == 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP8"))
            return;
        }
        //当前存在可挑战的新副本，是否继续执行一键扫荡?
        if (this.allnum - this.info.num > 0) {
            this.oneKeyShowTip();
        } else {
            if (this.subTypes[this.curIndex] < 46) {
                let vipCfg = ConfigManager.getItemByField(VipCfg, "level", this.roleModel.vipLv);
                let vipNum = (vipCfg && cc.js.isNumber(vipCfg.vip7)) ? vipCfg.vip7 : 0;
                let nextCfg = ConfigManager.getItem(VipCfg, (item) => {
                    if (cc.js.isNumber(item.vip7) && item.vip7 > vipNum) {
                        return true;
                    }
                    return false;
                })
                if (nextCfg) {
                    gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP5"), nextCfg.level))//(`达到VIP${nextCfg.level}可提升扫荡次数`);
                    return;
                }
            }
            gdk.gui.showMessage(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP6"))
        }
    }

    oneKeyShowTip() {
        let item = ConfigManager.getItemById(ItemCfg, this.quickCost[0])
        let freeNum = this.info.num < this.freeNum ? this.freeNum - this.info.num : 0;
        let costNum = this.info.num < this.freeNum ? this.allnum - this.freeNum : this.allnum - this.info.num;
        let cost = costNum * this.quickCost[1];
        let curNum = BagUtils.getItemNumById(this.quickCost[0])
        let canNum = Math.min(Math.floor(curNum / this.quickCost[1]), costNum);
        if (canNum == 0 && freeNum == 0) {
            if (!GlobalUtil.checkMoneyEnough(cost, this.quickCost[0], null, [PanelId.Instance])) {
                return
            }
        }
        let str1 = StringUtils.format(gdk.i18n.t("i18n:INS_DOOMSDAY_VIEW_TIP1"), freeNum)//`本次操作将<color=#C7E835>免费扫荡${freeNum}次</c>`;
        let str2 = StringUtils.format(gdk.i18n.t("i18n:INS_DOOMSDAY_VIEW_TIP2"), canNum, canNum * this.quickCost[1], item.name)//`<color=#C7E835>VIP钻石扫荡${canNum}次</c>共消耗${canNum * this.quickCost[1]}${item.name}`;
        let str3 = ``; //升级到vip5,可额外扫荡5次
        let descStr = (freeNum > 0 ? str1 : '') + `${freeNum * canNum > 0 ? '、<br/>' : ''}` + (canNum > 0 ? str2 : '');
        if (this.subTypes[this.curIndex] >= 46) {
            descStr = str1;
        }
        else {
            let curVipCfg = ConfigManager.getItemByField(VipCfg, 'level', this.roleModel.vipLv);
            let nextVip = ConfigManager.getItem(VipCfg, (cfg: VipCfg) => {
                if (cfg.level > curVipCfg.level) {
                    if (!curVipCfg.vip7 || cfg.vip7 > curVipCfg.vip7) {
                        return true;
                    }
                }
            });
            if (nextVip) {
                let curVipTime = curVipCfg.vip7 || 0;
                str3 = StringUtils.format(gdk.i18n.t("i18n:INS_DOOMSDAY_VIEW_TIP3"), nextVip.level, nextVip.vip7 - curVipTime)//`升级到vip${nextVip.level},可额外增加${nextVip.vip7 - curVipTime}次扫荡`;
            }
            else {
                str3 = '';
            }
        }
        let sureCb = () => {
            let msg = new icmsg.DoomsDayQuickRaidsReq();
            msg.subType = this.info.subType
            NetManager.send(msg, (rsp: icmsg.DoomsDayQuickRaidsRsp) => {
                GlobalUtil.openRewadrView(rsp.rewards);
                this.doomsDayModel.doomsDayInfos.forEach(data => {
                    if (data.subType == this.info.subType) {
                        data.num = this.allnum;
                    }
                    gdk.e.emit(InstanceEventId.RSP_DOOMSDAY_INFO_REFRESH)
                })
            }, this);
        };
        gdk.panel.open(PanelId.SubInsSweepView, (node: cc.Node) => {
            let ctrl = node.getComponent(SubInsSweepViewCtrl);
            ctrl.updateView(descStr, str3, sureCb);
        });
        // GlobalUtil.openAskPanel({
        //     title: "提示",
        //     descText: descStr,
        //     thisArg: this,
        //     sureText: "确认",
        //     sureCb: () => {
        //         let msg = new DoomsDayQuickRaidsReq();
        //         msg.subType = this.info.subType
        //         NetManager.send(msg, (rsp: DoomsDayQuickRaidsRsp) => {
        //             GlobalUtil.openRewadrView(rsp.rewards);
        //             this.doomsDayModel.doomsDayInfos.forEach(data => {
        //                 if (data.subType == this.info.subType) {
        //                     data.num = this.allnum;
        //                 }
        //                 gdk.e.emit(InstanceEventId.RSP_DOOMSDAY_INFO_REFRESH)
        //             })
        //         }, this);
        //     },
        // });
    }
}