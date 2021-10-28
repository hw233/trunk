import {
    Mission_7activityCfg,
    Store_7dayCfg,
    Store_giftCfg
} from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import PanelId from '../../../configs/ids/PanelId';
import ActUtil from '../../act/util/ActUtil';
import ChampionModel from '../../champion/model/ChampionModel';
import StoreModel from '../../store/model/StoreModel';
import TaskUtil from '../util/TaskUtil';
import SevenDaysTaskTypeItemCtrl from './SevenDaysTaskTypeItemCtrl';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-07-14 17:22:28 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/SevenDaysPanelCtrl")
export default class SevenDaysPanelCtrl extends gdk.BasePanel {

    @property(cc.Node)
    timeNode: cc.Node = null;

    @property([cc.Button])
    dayBtns: cc.Button[] = [];

    @property(cc.Node)
    storeItemContent: cc.Node = null;

    /**商品节点数不够,用该节点复制 */
    @property(cc.Node)
    storeItem: cc.Node = null;

    @property(cc.ScrollView)
    taskTypeScrollView: cc.ScrollView = null;

    @property(cc.Node)
    taskTypeContent: cc.Node = null;

    @property(cc.Prefab)
    taskTypeItemPrefab: cc.Prefab = null;

    @property(cc.ScrollView)
    taskScrollView: cc.ScrollView = null;

    @property(cc.Node)
    taskContent: cc.Node = null;

    @property(cc.Prefab)
    taskItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    store: cc.Node = null;

    curDay: number;
    selectDay: number;
    activityId: number = 3;     //活动id
    storeId: number = 8;    //奖励领取and热卖商店 活动id
    taskTypeList: ListView = null; //任务标签列表
    taskList: ListView = null;  //任务列表
    preTaskType: number;

    content2: cc.Node;

    _leftTime: number;
    get leftTime(): number { return this._leftTime; }
    set leftTime(v: number) {
        if (!v && v != 0) return;
        if (v <= 0) {
            this._updateTime();
            return;
        }
        this._leftTime = Math.max(0, v);
        this.timeNode.getChildByName('timeLabel').getComponent(cc.Label).string = TimerUtils.format4(Math.floor(this._leftTime / 1000));
    }

    _dtime: number = 0;
    update(dt: number) {
        if (!this.leftTime || this.leftTime <= 0) return;
        if (this._dtime >= 1) {
            this._updateTime();
            this._dtime = 0;
        }
        else {
            this._dtime += dt;
        }
    }

    onEnable() {
        this.curDay = Math.floor((GlobalUtil.getServerTime() - GlobalUtil.getServerOpenTime() * 1000) / (86400 * 1000)) + 1;
        this.selectDay = Math.min(7, this.curDay);
        this.dayBtns.forEach((btn, idx) => {
            let selectNode = btn.node.getChildByName('select');
            let normalNode = btn.node.getChildByName('normal');
            let frameNode = btn.node.getChildByName('frame');
            selectNode.active = this.selectDay >= idx + 1;
            normalNode.active = this.selectDay < idx + 1;
            frameNode.active = this.selectDay == idx + 1;
            if (idx == 6) {
                let cfg = ConfigManager.getItemByField(Mission_7activityCfg, 'day', 7, { target: 110 });
                [selectNode, normalNode].forEach(n => {
                    let lab = n.getChildByName("label").getComponent(cc.RichText);
                    // lab.string = `第七天(登录送<color=>${cfg.reward1[0][1]}钻</c>)`
                    lab.string = lab.string.replace('2000', cfg.reward1[0][1] + '');
                });
            }
        })
        this._initList();
        this._updateTime();
        this._updateStoreItem();
        this._updateRedPoint();
        NetManager.on(icmsg.MissionRewardRsp.MsgType, this._onMissionRewardRsp, this);

        this.node.setScale(.7);
        this.node.runAction(cc.sequence(
            cc.scaleTo(.2, 1.05, 1.05),
            cc.scaleTo(.15, 1, 1)
        ));
    }

    onDisable() {
        if (this.content2) {
            this.content2.removeFromParent();
            this.content2 = null;
        }
        gdk.Timer.clearAll(this);
        NetManager.targetOff(this);
        this.node.stopAllActions();
    }

    onDaysBtnClick(btn, data) {
        // console.log(btn, data);
        if (parseInt(data) > this.curDay) {
            gdk.panel.setArgs(PanelId.SevenDaysRewardsPre, parseInt(data));
            gdk.panel.open(PanelId.SevenDaysRewardsPre);
        }
        else {
            if (parseInt(data) == this.selectDay) return;
            else {
                this.dayBtns[this.selectDay - 1].node.getChildByName('frame').active = false;
                this.selectDay = parseInt(data);
                this.dayBtns[this.selectDay - 1].node.getChildByName('frame').active = true;
                this._initList();
                this._updateStoreItem();
            }
        }
    }

    onTaskTypeClick(data, idx) {
        // console.log(data, idx);
        if (this.preTaskType && this.preTaskType == data) return;
        this.preTaskType = data;
        this._updateTask(data);
    }

    onStoreBtnClick() {
        gdk.panel.setArgs(PanelId.SevenDaysStore, this.selectDay);
        gdk.panel.open(PanelId.SevenDaysStore, (node: cc.Node) => {
            let onHide = gdk.NodeTool.onHide(node);
            onHide.on(() => {
                onHide.targetOff(this);
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                this._updateStoreItem();
            }, this);
        });
    }

    _onMissionRewardRsp(resp: icmsg.MissionRewardRsp) {
        if (resp.type == 5) {
            this._updateTask(this.preTaskType);
            this._updateRedPoint();
        }
    }

    /**红点更新 */
    _updateRedPoint() {
        this.dayBtns.forEach((btn, idx) => {
            btn.node.getChildByName('RedPoint').active = RedPointUtils.has_unget_seven_days_reward(idx + 1);
        });

        this.taskTypeList.items.forEach(item => {
            if (item.node) {
                let ctrl = item.node.getComponent(SevenDaysTaskTypeItemCtrl);
                let redPoint = item.node.getChildByName('RedPoint');
                redPoint.active = RedPointUtils.has_unget_seven_days_reward(this.selectDay, ctrl.data);
            }
        });
    }

    _updateTime() {
        let timeTitle = this.timeNode.getChildByName('label').getComponent(cc.Label);
        let curTime = GlobalUtil.getServerTime();
        let actEndTime = ActUtil.getActEndTime(this.activityId);
        let storeEndTime = ActUtil.getActEndTime(this.storeId);
        if (!actEndTime && !storeEndTime) {
            //活动过期
            this.close();
            return;
        }
        if ((!actEndTime && storeEndTime) && curTime <= storeEndTime) {
            timeTitle.string = gdk.i18n.t('i18n:TASK_TIP4');
            this.leftTime = storeEndTime - curTime;
            return;
        }
        if (actEndTime && curTime < actEndTime) {
            timeTitle.string = gdk.i18n.t('i18n:TASK_TIP5');
            this.leftTime = actEndTime - curTime;
        }
    }

    _updateStoreItem() {
        gdk.Timer.clearAll(this);
        let b = false;
        let curDay = Math.floor((GlobalUtil.getServerTime() - GlobalUtil.getServerOpenTime() * 1000) / (86400 * 1000)) + 1;
        curDay = Math.min(7, curDay);
        let sModel = ModelManager.get(StoreModel);
        let rModel = ModelManager.get(RoleModel);
        for (let i = 0; i < curDay; i++) {
            let cfgs = ConfigManager.getItemsByField(Store_7dayCfg, 'day', i + 1);
            for (let j = 0; j < cfgs.length; j++) {
                let storeInfo = sModel.sevenStoreInfo[cfgs[j].id];
                let boughtTime = storeInfo | 0;
                if (boughtTime < cfgs[j].times_limit) {
                    // if (ModelManager.get(StoreModel).isFirstInSevenStore) {
                    if (!sModel.firstInSevenStoreDays[i + 1]) {
                        if (!cfgs[j].VIP_commit || rModel.vipLv >= cfgs[j].VIP_commit) {
                            b = true;
                            break;
                        }
                    }
                }
            }
            if (b) {
                break;
            }
        }
        this.store.getChildByName('RedPoint').active = b;
        GlobalUtil.setSpriteIcon(this.node, this.store.getChildByName('storeIcon'), `view/task/texture/seven/storeIcon_0${this.selectDay}`)
        let cfgs = ConfigManager.getItemsByField(Store_7dayCfg, 'day', this.selectDay);
        let items: number[][] = [];
        cfgs.forEach(cfg => {
            if (cfg.item && cfg.item.length >= 1) {
                items.push(cfg.item);
            }
            else {
                //礼包商店 
                let giftCfg = ConfigManager.getItemById(Store_giftCfg, cfg.id);
                if (giftCfg && this._checkGiftOpen(giftCfg)) {
                    for (let i = 0; i < 6; i++) {
                        let item = giftCfg[`item_${i + 1}`];
                        if (item && item.length >= 2) {
                            items.push(item);
                        }
                    }
                }
            }
        });
        this.storeItemContent.removeAllChildren();
        this.storeItemContent.setPosition(0, 0);
        this.storeItemContent.getComponent(cc.Layout).enabled = true;
        while (this.storeItemContent.children.length < items.length) {
            let item = cc.instantiate(this.storeItem);
            item.parent = this.storeItemContent;
        }
        this.storeItemContent.getComponent(cc.Layout).updateLayout();
        this.storeItemContent.children.forEach((item, idx) => {
            if (items[idx]) {
                let numLabel = item.getChildByName('numLab').getComponent(cc.Label);
                let icon = item.getChildByName('icon');
                GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getIconById(items[idx][0]));
                numLabel.node.active = items[idx][1] > 1;
                numLabel.string = GlobalUtil.numberToStr(items[idx][1], true, true);
            }
            else {
                item.active = false;
            }
        });
        this.content2 && this.content2.removeAllChildren();
        if (this.storeItemContent.children.length >= 4) {
            this.content2 = cc.instantiate(this.storeItemContent);
            this.content2.parent = this.storeItemContent.parent;
            this.content2.setPosition(this.storeItemContent.x + this.storeItemContent.width + 5, this.storeItemContent.y);
            this.content2.children.forEach((item, idx) => {
                if (items[idx]) {
                    let numLabel = item.getChildByName('numLab').getComponent(cc.Label);
                    let icon = item.getChildByName('icon');
                    GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getIconById(items[idx][0]));
                    numLabel.node.active = items[idx][1] > 1;
                    numLabel.string = GlobalUtil.numberToStr(items[idx][1], true, true);
                }
                else {
                    item.active = false;
                }
            });
            this._storeItemAni();
        }
    }

    _storeItemAni() {
        gdk.Timer.clearAll(this);
        gdk.Timer.loop(1, this, () => {
            this.storeItemContent.x -= 1;
            this.content2.x -= 1;
            if (this.storeItemContent.x <= -this.storeItemContent.width) this.storeItemContent.x = this.content2.x + this.content2.width + 5;
            if (this.content2.x <= -this.content2.width) this.content2.x = this.storeItemContent.x + this.storeItemContent.width + 5;
        });
    }

    //检查礼包是否可以购买
    _checkGiftOpen(cfg: Store_giftCfg) {
        let openLv: number = parseInt(cfg.gift_level) || 0;
        if (cfg.open_conds) {
            let info = ModelManager.get(StoreModel).storeInfo[cfg.open_conds];
            if (!info || info.count <= 0) {
                return false;
            }
        }
        if (cfg.cross_id && cfg.cross_id.indexOf(ModelManager.get(RoleModel).crossId) === -1) {
            return false;
        }
        if (cfg.unlock) {
            let star = ModelManager.get(RoleModel).maxHeroStar;
            if (star < cfg.unlock) return false;
        }
        if (openLv > ModelManager.get(RoleModel).level) {
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
                    let startDate = new Date(startArr[0] + '/' + startArr[1] + '/' + startArr[2] + ' ' + startArr[3] + ':' + startArr[4] + ':0')
                    let endDate = new Date(endArr[0] + '/' + endArr[1] + '/' + endArr[2] + ' ' + endArr[3] + ':' + endArr[4] + ':0')
                    let nowDay = GlobalUtil.getServerTime();
                    if (nowDay >= startDate.getTime() && nowDay <= endDate.getTime()) {
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

    _initList() {
        if (!this.taskTypeList) {
            this.taskTypeList = new ListView({
                scrollview: this.taskTypeScrollView,
                mask: this.taskTypeScrollView.node,
                content: this.taskTypeContent,
                item_tpl: this.taskTypeItemPrefab,
                cb_host: this,
                async: true,
                direction: ListViewDir.Horizontal,
            });
            this.taskTypeList.onClick.on(this.onTaskTypeClick, this);
        }

        if (!this.taskList) {
            this.taskList = new ListView({
                scrollview: this.taskScrollView,
                mask: this.taskScrollView.node,
                content: this.taskContent,
                item_tpl: this.taskItemPrefab,
                gap_y: 10,
                cb_host: this,
                async: true,
                direction: ListViewDir.Vertical,
            });
        }

        this._updateTaskType();
        // let defaultTypeId = this.taskTypeList.datas[0];
        // this._updateTask(defaultTypeId);

    }

    /**
     * 更新任务标签列表
     */
    _updateTaskType() {
        let typeIds: number[] = [];
        let cfgs = ConfigManager.getItemsByField(Mission_7activityCfg, 'day', this.selectDay);
        cfgs.forEach(cfg => {
            if (typeIds.indexOf(cfg.type) == -1) typeIds.push(cfg.type);
        });
        typeIds.sort((a, b) => { return a - b; });
        this.taskTypeScrollView.horizontal = typeIds.length >= 3;
        this.taskTypeList.clear_items();
        this.taskTypeList['selectDay'] = this.selectDay;
        this.taskTypeList.set_data(typeIds);
        gdk.Timer.callLater(this, () => {
            typeIds.length > 0 && this.taskTypeList.select_item(0);
            let node = cc.find('taskTypeMenu/qrhd_lvseyeqian03', this.node);
            node.width = typeIds.length >= 3 ? 665 : 220 * typeIds.length;
        });
    }

    /**
     * 更新任务列表
     * @param typeId 任务标签 
     */
    _updateTask(typeId: number) {
        let cfgs = ConfigManager.getItems(Mission_7activityCfg, (item: Mission_7activityCfg) => {
            if (item.day == this.selectDay && item.type == typeId) return true;
            else return false;
        });
        let received: Mission_7activityCfg[] = [];
        let completed: Mission_7activityCfg[] = [];
        let others: Mission_7activityCfg[] = [];
        for (let i = 0; i < cfgs.length; i++) {
            if (TaskUtil.getTaskState(cfgs[i].id)) {
                if (TaskUtil.getTaskAwardState(cfgs[i].id)) {
                    received.push(cfgs[i]);
                }
                else {
                    completed.push(cfgs[i]);
                }
            }
            else {
                others.push(cfgs[i]);
            }
        }
        this.taskList.clear_items();
        this.taskList.set_data(completed.concat(others).concat(received));
    }
}
