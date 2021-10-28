import ActivityModel from '../../model/ActivityModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import ActUtil from '../../util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HelpTipsBtnCtrl from '../../../tips/ctrl/HelpTipsBtnCtrl';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import StoreModel from '../../../store/model/StoreModel';
import TimerUtils from '../../../../common/utils/TimerUtils';
import {
    Activity_collect_heroCfg,
    Activity_continuousCfg,
    Activity_upgradeCfg,
    MainInterface_sort_1Cfg,
    SystemCfg,
    Talent_alchemyCfg,
    Talent_arenaCfg,
    Talent_quick_combatCfg,
    Talent_treasureCfg
    } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

/**1-点金,2-快速作战,3-竞技场,4-探宝，5-累计充值，6-英雄集结，7-升级有礼 */
export enum subActType {
    alchemy = 1,
    quickCombat,
    arena,
    treasure,
    continuous,
    collectHero,
    upgrade,
    starGift,
}

@ccclass
@menu("qszc/view/act/wonderfulActivity/SubActivityViewCtrl")
export default class SubActivityViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    titleSprite: cc.Node = null;

    @property(cc.Node)
    tipsNode: cc.Node = null;

    @property(cc.Node)
    timeNode: cc.Node = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Node)
    quickFightNode: cc.Node = null;

    @property(cc.Node)
    storeBtn: cc.Node = null;

    @property(HelpTipsBtnCtrl)
    helpCtrl: HelpTipsBtnCtrl = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v != 0) return;
        v = Math.max(0, v);
        this._leftTime = v;
        this.timeLab.string = TimerUtils.format4(v);
        if (v <= 0) {
            //TODO 活动到期
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
        }
    }

    cfg: MainInterface_sort_1Cfg;
    sysCfg: SystemCfg;
    list: ListView;
    _dtime: number = 0;
    update(dt: number) {
        if (!this.leftTime || this.leftTime <= 0) return;
        if (this._dtime >= 1) {
            this._initTime();
        }
        else {
            this._dtime += dt;
        }
    }

    onEnable() {
        this.cfg = this.args[0];
        this._init();
        // NetManager.on(ExcitingActivityUpgradeLimitRsp.MsgType, this._onLimitRsp, this);
    }

    onDisable() {
        // NetManager.targetOff(this);
    }

    selectView(cfg: MainInterface_sort_1Cfg) {
        this.cfg = cfg;
        this._init();
    }

    onActiveBtnClick() {
        let isActive: boolean = false;
        let data = ModelManager.get(StoreModel).getMonthCardInfo(500003)
        let nowTime = GlobalUtil.getServerTime() / 1000;
        if (data && data.time - nowTime > 0) {
            isActive = true;
        }
        if (!isActive) {
            if (gdk.panel.isOpenOrOpening(PanelId.WonderfulActivityView)) {
                gdk.panel.hide(PanelId.WonderfulActivityView);
            }
            // gdk.panel.open(PanelId.MonthCard);
            gdk.panel.setArgs(PanelId.Recharge, 0)
            gdk.panel.open(PanelId.Recharge)
        }
        else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:EXC_ACT_TIP4"));
        }
    }

    _init() {
        this.sysCfg = ConfigManager.getItemById(SystemCfg, this.cfg.systemid);
        let type = {
            2821: subActType.continuous,
            2822: subActType.upgrade,
            2823: subActType.alchemy,
            2824: subActType.quickCombat,
            2825: subActType.arena,
            2826: subActType.treasure,
            2828: subActType.collectHero,
        }[this.cfg.systemid];
        this.helpCtrl.tipsId = 22 + type;
        GlobalUtil.setSpriteIcon(this.node, this.titleSprite, `view/act/texture/wonderfulActivitys/title${type}`);
        GlobalUtil.setSpriteIcon(this.node, this.tipsNode, type == subActType.upgrade || type == subActType.continuous ? `view/act/texture/wonderfulActivitys/tipsBg2` : `view/store/textrue/store/bg_shuangxinshijian`);
        // this.tipsNode.getComponent(cc.Layout).type = type == subActType.upgrade || type == subActType.continuous ? cc.Layout.Type.VERTICAL : cc.Layout.Type.HORIZONTAL;
        this.tipsNode.getChildByName('tips').getComponent(cc.RichText).string = this.cfg.dec;
        this.tipsNode.getComponent(cc.Layout).updateLayout();
        this.quickFightNode.active = false;
        this.storeBtn.active = false;

        if (type == subActType.quickCombat) {
            this.quickFightNode.active = true;
            let isActive: boolean = false;
            let data = ModelManager.get(StoreModel).getMonthCardInfo(500003)
            let nowTime = GlobalUtil.getServerTime() / 1000;
            if (data && data.time - nowTime > 0) {
                isActive = true;
            }
            GlobalUtil.setGrayState(this.quickFightNode.getChildByName('icon'), isActive ? 0 : 1);
            this.quickFightNode.getChildByName('activeTips').active = !isActive;
        } else if (type == subActType.treasure) {
            this.storeBtn.active = true;
        }
        this._initTime();
        this._updateList();
    }

    _initTime() {
        if (!this.sysCfg.activity || this.cfg.systemid == 2821) {
            this.timeNode.active = false;
            return;
        }

        let upgradeTaskTime;
        let endTime = ActUtil.getActEndTime(this.sysCfg.activity);
        this.timeNode.active = true;
        if (this.cfg.systemid == 2822) {
            //升级有礼 任务有效期
            upgradeTaskTime = ActUtil.getActEndTime(36);
        }
        if (!endTime) {
            this.leftTime = 0;
        }
        else {
            let curTime = GlobalUtil.getServerTime();
            let timeTitle = this.timeNode.getChildByName('lab').getComponent(cc.Label);
            timeTitle.string = gdk.i18n.t("i18n:MINECOPY_TIME_TIP1");
            if (this.cfg.systemid == 2822) {
                if (curTime < upgradeTaskTime) {
                    this.leftTime = Math.floor((upgradeTaskTime - GlobalUtil.getServerTime()) / 1000);
                }
                else {
                    timeTitle.string = gdk.i18n.t("i18n:EXC_ACT_TIP5");
                    this.leftTime = Math.floor((endTime - GlobalUtil.getServerTime()) / 1000);
                }
            }
            else {
                this.leftTime = Math.floor((endTime - GlobalUtil.getServerTime()) / 1000);
            }
        }
    }

    _initList() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.itemPrefab,
            cb_host: this,
            async: true,
            gap_y: 10,
            direction: ListViewDir.Vertical,
        })
    }

    _updateList() {
        this._initList();
        let cfgs = this._getCfgs();
        let finished: any = [];
        let todo: any = [];
        let recived: any = [];
        cfgs.forEach(cfg => {
            let state = ActivityUtils.getExcitingActTaskState(cfg.taskid);
            if (state == 0) {
                todo.push({
                    type: Math.floor(cfg.taskid / 10000),
                    sysId: this.cfg.systemid,
                    cfg: cfg
                });
            }
            else if (state == 1) {
                if (Math.floor(cfg.taskid / 10000) == subActType.upgrade) {
                    let limit = ModelManager.get(ActivityModel).excitingActOfUpgradeLimitInfo[cfg.taskid] || cfg.limit;
                    if (!limit && limit != 0) limit = cfg.limit;
                    if (limit <= 0) {
                        recived.push({
                            type: Math.floor(cfg.taskid / 10000),
                            sysId: this.cfg.systemid,
                            cfg: cfg
                        });
                        return;
                    }
                }
                finished.push({
                    type: Math.floor(cfg.taskid / 10000),
                    sysId: this.cfg.systemid,
                    cfg: cfg
                });
            }
            else if (state == 2) {
                recived.push({
                    type: Math.floor(cfg.taskid / 10000),
                    sysId: this.cfg.systemid,
                    cfg: cfg
                });
            }
        });

        this.list.clear_items();
        this.list.set_data([...finished, ...todo, ...recived]);
    }

    _getCfgs() {
        let cfgs;
        let actCfg = ActUtil.getCfgByActId(this.sysCfg.activity);
        let type = actCfg ? actCfg.reward_type : null;
        switch (this.cfg.systemid) {
            case 2821:
                let cycle = ModelManager.get(ActivityModel).excitingActOfContinuousCycle;
                cfgs = ConfigManager.getItemsByField(Activity_continuousCfg, 'cycle', cycle);
                break;
            case 2822:
                cfgs = ConfigManager.getItems(Activity_upgradeCfg);
                break;
            case 2823:
                cfgs = ConfigManager.getItemsByField(Talent_alchemyCfg, 'reward_type', type);
                break;
            case 2824:
                cfgs = ConfigManager.getItemsByField(Talent_quick_combatCfg, 'reward_type', type);
                break;
            case 2825:
                cfgs = ConfigManager.getItemsByField(Talent_arenaCfg, 'reward_type', type);
                break;
            case 2826:
                cfgs = ConfigManager.getItemsByField(Talent_treasureCfg, 'reward_type', type);
                break;
            case 2828:
                cfgs = ConfigManager.getItemsByField(Activity_collect_heroCfg, 'type', type);
            default:
                break;
        }
        return cfgs;
    }

    _onLimitRsp(resp: icmsg.ExcitingActivityUpgradeLimitRsp) {
        if (this.cfg.systemid == 2822) {
            this._updateList();
        }
    }

    //打开钻石商店
    onOpenStore() {
        // JumpUtils.openStore([2])
        JumpUtils.openRechargeView([3]);
    }
}
