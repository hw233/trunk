import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import InstanceModel from '../model/InstanceModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import {
    Copy_stageCfg,
    CopyCfg,
    GlobalCfg,
    ItemCfg,
    RuneunlockCfg,
    VipCfg
    } from '../../../a/config';
import { CopyType } from '../../../common/models/CopyModel';
import { InstanceEventId } from '../enum/InstanceEnumDef';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/**
 * @Description: 英雄副本
 * @Author: yaozu.hu
 * @Date: 2020-09-22 09:59:41
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-03-18 11:11:12
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/SubInstanceRuneViewCtrl")
export default class SubInstanceRuneViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null


    @property(cc.Prefab)
    subHeroItem: cc.Prefab = null;

    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.ScrollView)
    runeScrollView: cc.ScrollView = null;

    @property(cc.Node)
    runeContent: cc.Node = null

    @property(cc.Prefab)
    runeShowItem: cc.Prefab = null;


    list: ListView = null
    runeList: ListView = null
    cfgList: Copy_stageCfg[] = []
    listData: any[] = []
    raidNum: number = 0;
    freeNum: number = 0;
    vipNum: number = 0;
    curStageId: number = 0;
    quickCost: number[] = [];
    maxMonsterNum: number = 0;
    get roleModel() { return ModelManager.get(RoleModel); }
    get model() { return ModelManager.get(InstanceModel); }

    onEnable() {

        NetManager.send(new icmsg.DungeonRuneInfoReq(), this.initData, this);
        gdk.e.on(InstanceEventId.RSP_RUNECOPY_SWEEP_REFRESH, this._refreshRaidNum, this)
        //this.model.runeEnterCopy = true;
        this.freeNum = ConfigManager.getItemByField(GlobalCfg, 'key', 'rune_copy').value[0];
        let vipCfg = ConfigManager.getItemByField(VipCfg, "level", this.roleModel.vipLv)
        this.vipNum = (vipCfg && cc.js.isNumber(vipCfg.vip10)) ? vipCfg.vip10 : 0;
        let copyCfg = ConfigManager.getItem(CopyCfg, { 'copy_id': CopyType.Rune })
        this.quickCost = copyCfg.quick_cost;
        this.initData()
        this.updateRuneShowInfo()

    }

    onDisable() {
        gdk.e.off(InstanceEventId.RSP_RUNECOPY_SWEEP_REFRESH, this._refreshRaidNum, this)
    }

    onDestroy() {
        if (this.list) {
            this.list.destroy();
        }
        if (this.runeList) {
            this.runeList.destroy();
        }
    }

    initData() {
        this.curStageId = this.model.runeInfo.maxStageId;
        if (this.curStageId == 0) {
            let cfg = ConfigManager.getItemByField(Copy_stageCfg, 'copy_id', CopyType.Rune)
            this.curStageId = cfg.id;
        } else {
            this.curStageId += 1;
        }
        this.maxMonsterNum = this.model.runeInfo.maxMonsterNum;
        //this.raidNum = this.model.runeInfo.availableTimes;
        this._refreshRaidNum();
    }

    _refreshRaidNum() {
        this.num.string = this.model.runeInfo.availableTimes + '';
        this.raidNum = this.model.runeInfo.availableTimes;
        this._updateDataLater();
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.subHeroItem,
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
        let cfgs = ConfigManager.getItems(Copy_stageCfg, { 'copy_id': CopyType.Rune });

        this.cfgList = cfgs;
        this.cfgList.forEach(cfg => {
            let data = { curStageId: this.curStageId, stageData: cfg, raidNum: this.model.runeInfo.availableTimes, maxMonsterNum: this.maxMonsterNum, vipNum: this.vipNum };
            this.listData.push(data);
        })
        this.list.set_data(this.listData, !ref)
        if (!ref) {
            let index = 0
            if (this.curStageId > 0) {
                for (let i = 0; i < this.cfgList.length; i++) {
                    let cfg = this.cfgList[i];
                    if (this.curStageId == cfg.id || (i == this.cfgList.length - 1 && index == 0)) {
                        index = i;
                        break;
                    }
                }
            }
            let temIndex = Math.max(0, index - 1)
            this.list.scroll_to(temIndex)
        }

    }

    updateRuneShowInfo() {
        if (!this.runeList) {
            this.runeList = new ListView({
                scrollview: this.runeScrollView,
                mask: this.runeScrollView.node,
                content: this.runeContent,
                item_tpl: this.runeShowItem,
                cb_host: this,
                row: 1,
                gap_x: 0,
                gap_y: 0,
                async: true,
                direction: ListViewDir.Horizontal,
            })
        }

        let runelistData = []
        let cfgs = ConfigManager.getItems(RuneunlockCfg);
        cfgs.forEach(cfg => {
            let lock = this.model.runeInfo.maxStageId < cfg.star;

            let data = { cfg: cfg, lock: lock };
            runelistData.push(data);
        })
        this.runeList.set_data(runelistData)
        let index = 0
        if (this.model.runeInfo.maxStageId > 0) {
            for (let i = 0; i < runelistData.length; i++) {
                let cfg: RuneunlockCfg = runelistData[i].cfg;
                if (this.model.runeInfo.maxStageId < cfg.star) {
                    index = Math.max(0, i - 2)
                    break;
                }
            }
        }
        this.runeList.scroll_to(index)

    }
    //一键扫荡按钮点击事件
    oneRaidsClick() {
        if (this.model.runeInfo.maxStageId == 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP8"))
            return;
        }
        //当前存在可挑战的新副本，是否继续执行一键扫荡?
        if (this.raidNum > 0) {
            let item = ConfigManager.getItemById(ItemCfg, this.quickCost[0])
            let temFree = this.raidNum > this.vipNum ? this.raidNum - this.vipNum : 0;
            let costNum = this.raidNum < this.vipNum ? this.raidNum : this.vipNum;
            let cost = costNum * this.quickCost[1];
            let curNum = BagUtils.getItemNumById(this.quickCost[0])
            let canNum = Math.min(Math.floor(curNum / this.quickCost[1]), costNum);
            if (canNum == 0 && temFree == 0) {
                if (!GlobalUtil.checkMoneyEnough(cost, this.quickCost[0], null, [PanelId.Instance])) {
                    return
                }
            }
            let descStr = StringUtils.format(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP7"), temFree, canNum, canNum * this.quickCost[1], item.name)
            //`本次一键扫荡包含<color=#C7E835>${temFree}次免费扫荡</color>和<color=#C7E835>${canNum}次钻石扫荡</color>共消耗${canNum * this.quickCost[1]}${item.name},是否确认执行一键扫荡?`
            GlobalUtil.openAskPanel({
                title: gdk.i18n.t("i18n:TIP_TITLE"),
                descText: descStr,
                thisArg: this,
                sureText: gdk.i18n.t("i18n:OK"),
                sureCb: () => {
                    let msg = new icmsg.DungeonRuneQuickRaidReq();
                    msg.stageId = this.model.runeInfo.maxStageId
                    NetManager.send(msg, (rsp: icmsg.DungeonRuneQuickRaidRsp) => {
                        GlobalUtil.openRewadrView(rsp.rewards);
                        this.model.runeInfo.availableTimes = rsp.availableTimes;
                        this._refreshRaidNum();
                    }, this);
                },
            });
        } else {

            let nextCfg = ConfigManager.getItem(VipCfg, (item) => {
                if (cc.js.isNumber(item.vip10) && item.vip10 > this.vipNum) {
                    return true;
                }
                return false;
            })
            if (nextCfg) {
                let str = StringUtils.format(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP5"), nextCfg.level)
                gdk.gui.showMessage(str);
                return;
            }
            gdk.gui.showMessage(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP6"))
        }
    }
}
