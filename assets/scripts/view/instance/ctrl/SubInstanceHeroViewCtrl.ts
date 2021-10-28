import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import InstanceModel from '../model/InstanceModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import { Copy_stageCfg, CopyCfg } from '../../../a/config';
import { CopyType } from '../../../common/models/CopyModel';
import { InstanceEventId } from '../enum/InstanceEnumDef';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';


/**
 * @Description: 英雄副本
 * @Author: yaozu.hu
 * @Date: 2020-09-22 09:59:41
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:38:59
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/SubInstanceHeroViewCtrl")
export default class SubInstanceHeroViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    subHeroItem: cc.Prefab = null

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(cc.Label)
    num: cc.Label = null;

    @property(UiTabMenuCtrl)
    menuCtrl: UiTabMenuCtrl = null;

    @property([cc.Node])
    btnsNode: cc.Node[] = [];
    @property([cc.Node])
    redNodes: cc.Node[] = [];

    list: ListView = null
    cfgList: Copy_stageCfg[] = []



    bgStrs: string[] = ['yxfb_beijingban01', 'yxfb_beijingban03', 'yxfb_beijingban02']
    listData: any[] = []
    curIndex = -1;
    subTypes: number[] = [9, 10, 11]
    raidNum: number = 0;
    curStageId: number = 0;
    get roleModel() { return ModelManager.get(RoleModel); }
    get model() { return ModelManager.get(InstanceModel); }

    onEnable() {
        //let curW = (new Date(GlobalUtil.getServerTime())).getDay();// 0-6对应为星期日到星期六 
        //let openW = //(new Date(GlobalUtil.getServerOpenTime() * 1000)).getDay();
        var myday = GlobalUtil.getCurWeek()
        let copyCfgs = ConfigManager.getItemsByField(CopyCfg, 'copy_id', 3);
        let temIndex = -1;
        copyCfgs.forEach((cfg, i) => {
            let date: Array<number> = cfg.subtype_date[1];
            if (date.indexOf(myday) != -1 || myday == 0) {
                if (temIndex < 0) {
                    temIndex = i;
                }
                this.btnsNode[i].active = true;
            } else {
                this.btnsNode[i].active = false;
            }
        })

        //周日特殊处理
        if (myday == 0 && this.model.heroCopyCurIndex >= 0) {
            temIndex = this.model.heroCopyCurIndex;
            this.model.heroCopyCurIndex = -1;
        }
        this.menuCtrl.spacingX = 0;
        this.menuCtrl.setSelectIdx(temIndex);
        this._updateRedpoint();
        gdk.e.on(InstanceEventId.RSP_HEROCOPY_SWEEP_REFRESH, this.raidRefresh, this)
    }

    onDisable() {
        gdk.e.targetOff(this)
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
    refreshData(ref: boolean = false) {
        this._updateScroll(ref)
    }
    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _updateScroll(ref: boolean = false) {
        this._initListView()
        this.listData = []

        this.cfgList.forEach(cfg => {
            let data = { curStageId: this.curStageId, stageData: cfg, raidNum: this.raidNum, curIndex: this.curIndex };
            this.listData.push(data);
        })
        this.list.set_data(this.listData, !ref)
        if (!ref) {
            let index = 0
            if (this.curStageId > 0) {
                for (let i = 0; i < this.cfgList.length; i++) {
                    let cfg = this.cfgList[i];
                    if (this.curStageId == cfg.id) {
                        index = i;
                        break;
                    }
                }
            }
            this.list.scroll_to(index)
        }

    }

    pageSelect(event: any, index: number, refresh: boolean = false) {
        if (this.curIndex == index && !refresh) {
            return;
        }
        let cfgs = ConfigManager.getItems(Copy_stageCfg, { 'copy_id': CopyType.GOD, 'subtype': this.subTypes[index] });
        if (cfgs[0].player_lv && cfgs[0].player_lv > this.roleModel.level) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:INS_HERO_VIEW_TIP1"), cfgs[0].player_lv))//(`指挥官等级达到${cfgs[0].player_lv}级开放`)
            this.menuCtrl.showSelect(this.curIndex);
            return;
        }
        this.cfgList = cfgs;
        this.curIndex = index;
        this.raidRefresh()
        this.curStageId = this.model.heroCopyPassStageIDs.length > this.curIndex ? this.model.heroCopyPassStageIDs[this.curIndex] : 0;

        this.refreshData(refresh);
        let bgPath = 'view/instance/texture/bg/' + this.bgStrs[this.curIndex];
        GlobalUtil.setSpriteIcon(this.node, this.bg, bgPath)
    }

    raidRefresh() {
        //let all = ConfigManager.getItemByField(GlobalCfg, 'key', 'hero_copy_sweep_consumption').value[0];
        let useNum = this.model.heroCopySweepTimes.length > this.curIndex ? this.model.heroCopySweepTimes[this.curIndex] : 0;
        this.raidNum = Math.max(0, useNum)
        this.num.string = this.raidNum + '';
        this._updateRedpoint();
    }

    //一键扫荡按钮点击事件
    oneRaidsClick() {
        if (this.curStageId == 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP8"))//('当前没有关卡可进行扫荡')
            return;
        }
        //当前存在可挑战的新副本，是否继续执行一键扫荡?
        if (this.raidNum > 0) {
            let msg = new icmsg.DungeonHeroQuickRaidReq();
            msg.stageId = this.curStageId
            NetManager.send(msg, (rsp: icmsg.DungeonHeroQuickRaidRsp) => {
                GlobalUtil.openRewadrView(rsp.rewards);
                this.model.heroCopySweepTimes[this.curIndex] = 0;
                this.raidRefresh();
            }, this);
        } else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:INS_RUNE_ITEM_TIP6"))//('已达到今日可扫荡次数上限')
        }
    }

    _updateRedpoint() {
        let copyCfgs = ConfigManager.getItemsByField(CopyCfg, 'copy_id', 3);
        let model = this.model
        var myday = GlobalUtil.getCurWeek()

        copyCfgs.forEach((cfg, i) => {
            let date: Array<number> = cfg.subtype_date[1];
            if (date.indexOf(myday) != -1 || myday == 0) {

                this.redNodes[i].active = model.heroCopySweepTimes[i] > 0 && model.heroEnterCopy.indexOf(cfg.subtype) < 0;
            }
        })
        //return num > 0 && !model.heroEnterCopy;
    }
}
