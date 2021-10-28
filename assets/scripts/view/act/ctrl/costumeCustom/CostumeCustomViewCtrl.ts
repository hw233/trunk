import ActivityModel from '../../model/ActivityModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import TaskUtil from '../../../task/util/TaskUtil';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { AttrIconPath } from '../../../role/ctrl2/costume/CostumeTipsCtrl';
import {
    Costume_attrCfg,
    Costume_compositeCfg,
    Costume_globalCfg,
    Costume_progressCfg,
    CostumeCfg
    } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-21 15:19:14 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/costumeCustom/CostumeCustomViewCtrl")
export default class CostumeCustomViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    iconBg: cc.Node = null;

    @property(cc.Label)
    curScoreLab: cc.Label = null;

    @property(cc.Node)
    progressBar: cc.Node = null;

    @property([cc.Node])
    scoreRewardItems: cc.Node[] = [];

    @property(UiTabMenuCtrl)
    uitabMenu: UiTabMenuCtrl = null;

    @property(cc.Node)
    taskNode: cc.Node = null;

    @property(cc.Node)
    customNode: cc.Node = null;

    //task
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    taskItemPrefab: cc.Prefab = null;

    //custom
    @property(cc.Node)
    suitTypeNode: cc.Node = null;

    @property(cc.Label)
    suitPartLab: cc.Label = null;

    @property(cc.Label)
    suitBaseAttrLab: cc.Label = null;

    @property([cc.Node])
    suitRandomAttrNodes: cc.Node[] = [];

    @property(cc.Node)
    suitPreIcon: cc.Node = null;

    @property(cc.Node)
    customCostNode: cc.Node = null;

    @property(cc.Node)
    customBtn: cc.Node = null;

    @property(cc.Label)
    taskTimeLab: cc.Label = null;

    @property(cc.Label)
    customTimeLab: cc.Label = null;

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    taskActId: number = 116;
    customActId: number = 117;
    rewardType: number;
    cfgs: Costume_progressCfg[] = [];
    scores: number[] = [];
    curSelectType: number;
    customSelectInfo: CostumeCustomSelectInfo;
    list: ListView;
    onEnable() {
        let startTime = new Date(ActUtil.getActStartTime(this.customActId));
        let endTime = new Date(ActUtil.getActEndTime(this.customActId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.taskTimeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            this.customTimeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
            gdk.e.emit(ActivityEventId.ACTIVITY_TIME_IS_OVER);
            gdk.panel.hide(PanelId.CostumeCustomMain);
            return;
        }
        else {
            this.rewardType = ActUtil.getActRewardType(this.customActId);
            this.cfgs = ConfigManager.getItemsByField(Costume_progressCfg, 'type', this.rewardType);
            this.scores = [0];
            this.cfgs.forEach(c => {
                this.scores.push(c.score);
            });
            this.scores.sort((a, b) => { return a - b; });

            //进度
            this._updateScoreRewards();
            let idx = ActUtil.ifActOpen(this.taskActId) ? 0 : 1;
            this.uitabMenu.setSelectIdx(idx, true);

            //ani
            this.iconBg.runAction(cc.repeatForever(
                cc.sequence(
                    cc.fadeOut(.8),
                    cc.fadeIn(.8)
                )
            ));

            gdk.e.on(ActivityEventId.COSTUME_CUSTOM_SELECT_INFO_CHANGE, this._updateCustomNode, this);
            NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateCost, this);
            NetManager.on(icmsg.MissionRewardRsp.MsgType, this._updateListLater, this);
            this._updateTime();
        }
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
        this.iconBg.stopAllActions();
    }

    onTabMenuSelect(e, utype) {
        if (!e) return;
        let type = parseInt(utype);
        if (this.curSelectType == type) return;
        if (type == 0) {
            if (!ActUtil.ifActOpen(this.taskActId)) {
                gdk.gui.showMessage('任务过期,当前阶段仅可打造神装');
                this.uitabMenu.showSelect(1);
                return;
            }
            this.curSelectType = type;
            this.taskNode.active = true;
            this.customNode.active = false;
            this._updateListLater();
        } else if (type == 1) {
            this.curSelectType = type;
            this.taskNode.active = false;
            this.customNode.active = true;
            this._updateCost();
            this._updateCustomNode();
        }
    }

    _updateTime() {
        let id1 = this.taskActId
        if (!ActUtil.ifActOpen(id1)) {
            this.taskTimeLab.string = `活动时间已过期`;
        } else {
            let startTime1 = new Date(ActUtil.getActStartTime(id1));
            let endTime1 = new Date(ActUtil.getActEndTime(id1) - 5000); //time为零点,减去5s 返回前一天
            if (startTime1 && endTime1) {
                this.taskTimeLab.string = `${startTime1.getFullYear()}.${startTime1.getMonth() + 1}.${startTime1.getDate()}-${endTime1.getFullYear()}.${endTime1.getMonth() + 1}.${endTime1.getDate()}`;
            }
        }
        //custom
        let id2 = this.customActId;
        let startTime2 = new Date(ActUtil.getActStartTime(id2));
        let endTime2 = new Date(ActUtil.getActEndTime(id2) - 5000); //time为零点,减去5s 返回前一天
        if (startTime2 && endTime2) {
            this.customTimeLab.string = `${startTime2.getFullYear()}.${startTime2.getMonth() + 1}.${startTime2.getDate()}-${endTime2.getFullYear()}.${endTime2.getMonth() + 1}.${endTime2.getDate()}`;
        }
    }

    onTopPreBtnClick() {
        gdk.panel.open(PanelId.CostumeCustomRandomTipsView);
    }

    onScoreRewardItemClick(e, utype) {
        if (!e) return;
        let type = parseInt(utype);
        let cfg = this.cfgs[type];
        if (this.actModel.costumeCustomScore >= cfg.score && !this.actModel.costumeCustomRewards[cfg.score]) {
            let req = new icmsg.CostumeCustomScoreReq();
            req.score = cfg.score;
            NetManager.send(req, (resp: icmsg.CostumeCustomScoreRsp) => {
                GlobalUtil.openRewadrView(resp.goodsList);
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                let item = this.scoreRewardItems[type];
                let redPoint = item.getChildByName('RedPoint');
                let slot = item.getChildByName('UiSlotItem');
                slot.getChildByName('mask').active = true;
                redPoint.active = false;
            }, this);
        }
        else {
            GlobalUtil.openItemTips({
                series: null,
                itemId: cfg.rewards[0],
                itemNum: cfg.rewards[1],
                type: BagUtils.getItemTypeById(cfg.rewards[0]),
                extInfo: null
            })
        }
    }

    onSelectBtnClick(e, utype) {
        if (!e) return;
        let type = parseInt(utype);  //0-类型 1-部位 2-随机属性1 3-随机属性2
        if (type !== 0 && this.customSelectInfo.type <= 0) {
            gdk.gui.showMessage('请先选择神装类型');
            return;
        }
        if (type >= 2 && this.customSelectInfo.part < 0) {
            gdk.gui.showMessage('请先选择神装的部位类型');
            return;
        }
        gdk.panel.setArgs(PanelId.CostumeCustomSelectView, [type, this.customSelectInfo]);
        gdk.panel.open(PanelId.CostumeCustomSelectView);
    }

    onCustomBtnClick() {
        let costV = ConfigManager.getItemByField(Costume_globalCfg, 'key', 'custom_item').value;
        if (BagUtils.getItemNumById(costV[0]) < costV[1]) {
            //道具不足 
            GlobalUtil.openGainWayTips(costV[0]);
            return;
        }

        if (this.customSelectInfo.type <= 0) {
            gdk.gui.showMessage('请先选择神装类型');
            return;
        }
        if ([0, 1, 2, 3].indexOf(this.customSelectInfo.part) == -1) {
            gdk.gui.showMessage('请先选择神装部位');
            return;
        }
        if (this.customSelectInfo.random_attr.length < 2 || this.customSelectInfo.random_attr.indexOf(0) !== -1) {
            gdk.gui.showMessage('请先选择随机属性');
            return;
        }

        let cfg = ConfigManager.getItem(CostumeCfg, (cfg: CostumeCfg) => {
            if (cfg.type == this.customSelectInfo.type && cfg.part == this.customSelectInfo.part && cfg.custom == 1) {
                return true;
            }
        });
        let req = new icmsg.CostumeCustomReq();
        req.id = cfg.id;
        req.attrs = this.customSelectInfo.random_attr;
        NetManager.send(req, (resp: icmsg.CostumeCustomRsp) => {
            let goods = new icmsg.GoodsInfo();
            goods.typeId = resp.costume.typeId;
            goods.num = 1;
            GlobalUtil.openRewadrView([goods]);
            if (ActivityUtils.getCostumeCustomGiftDatas().length <= 0) {
                if (this.actModel.costumeCustomRewards[this.cfgs[this.cfgs.length - 1].score] == 1) {
                    NetManager.send(new icmsg.StorePushListReq());
                }
            }
        }, this);
    }

    //更新进度条变化
    @gdk.binding('actModel.costumeCustomScore')
    _updateProgress() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        if (!this.rewardType) return;
        this.curScoreLab.string = this.actModel.costumeCustomScore + '';
        this.progressBar.width = this._getProBarLen();
        this.scoreRewardItems.forEach((n, idx) => {
            let redPoint = n.getChildByName('RedPoint');
            let flag = n.getChildByName('flag');
            let cfg = this.cfgs[idx];
            GlobalUtil.setSpriteIcon(this.node, flag, `view/act/texture/costumeCustom/texture/szdz_guangdian0${this.actModel.costumeCustomScore >= cfg.score ? 2 : 1}`);
            redPoint.active = this.actModel.costumeCustomScore >= cfg.score && !this.actModel.costumeCustomRewards[cfg.score];
        });
    }

    //更新积分奖励
    _updateScoreRewards() {
        this.scoreRewardItems.forEach((n, idx) => {
            let score = n.getChildByName('score').getComponent(cc.Label);
            let slot = n.getChildByName('UiSlotItem');
            let redPoint = n.getChildByName('RedPoint');
            let cfg = this.cfgs[idx];
            score.string = cfg.score + '';
            let ctrl = slot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(cfg.rewards[0], cfg.rewards[1]);
            // ctrl.itemInfo = {
            //     series: null,
            //     itemId: cfg.rewards[0],
            //     itemNum: cfg.rewards[1],
            //     type: BagUtils.getItemTypeById(cfg.rewards[0]),
            //     extInfo: null
            // };
            slot.getChildByName('mask').active = this.actModel.costumeCustomRewards[cfg.score] == 1;
            redPoint.active = this.actModel.costumeCustomScore >= cfg.score && !this.actModel.costumeCustomRewards[cfg.score];
        });
    }

    /**获取积分进度 */
    _getProBarLen() {
        let idx = 0;
        for (let i = this.scores.length - 1; i >= 0; i--) {
            if (this.actModel.costumeCustomScore >= this.scores[i]) {
                idx = i;
                break;
            }
        }
        let len = 0;
        if (idx == this.scores.length - 1) {
            len = 600;
        }
        else {
            let dt = 600 / (this.scores.length - 1);
            len = dt * idx + ((this.actModel.costumeCustomScore - this.scores[idx]) / (this.scores[idx + 1] - this.scores[idx])) * dt;
        }
        return Math.min(600, len);
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.taskItemPrefab,
                cb_host: this,
                gap_y: 5,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateListLater() {
        gdk.Timer.callLater(this, this._updateList);
    }

    _updateList() {
        this._initList();
        let finish = [];
        let todo = [];
        let received = [];
        let task = ActivityUtils.getCurCostumeCustomTask();
        task.sort((a, b) => { return a.theme - b.theme; });
        task.forEach(t => {
            if (TaskUtil.getTaskAwardState(t.task_id)) {
                received.push(t);
            } else {
                if (TaskUtil.getTaskState(t.task_id)) {
                    finish.push(t);
                } else {
                    todo.push(t);
                }
            }
        });
        this.list.clear_items();
        this.list.set_data([...finish, ...todo, ...received]);
    }

    //========customNode============//
    _updateCustomNode() {
        let cfg: CostumeCfg;
        let suitCfg: Costume_compositeCfg;
        let baseAtrCfg: Costume_attrCfg;
        let randomAtrCfgs: Costume_attrCfg[] = [];
        if (!this.customSelectInfo) {
            this.customSelectInfo = {
                type: -1,
                part: -1,
                random_attr: [0, 0]
            }
        }
        if (this.customSelectInfo.type > 0) {
            suitCfg = ConfigManager.getItemByField(Costume_compositeCfg, 'type', this.customSelectInfo.type, { color: 4 });
        }
        if (this.customSelectInfo.type > 0 && this.customSelectInfo.part >= 0) {
            cfg = ConfigManager.getItem(CostumeCfg, (c: CostumeCfg) => {
                if (c.type == this.customSelectInfo.type && c.part == this.customSelectInfo.part && c.custom == 1) {
                    return true;
                }
            });
            baseAtrCfg = ConfigManager.getItemById(Costume_attrCfg, cfg.attr);
            (this.customSelectInfo.random_attr || []).forEach(id => {
                let c = ConfigManager.getItemById(Costume_attrCfg, id) || null;
                randomAtrCfgs.push(c);
            });
        }
        //类型
        this.suitTypeNode.getChildByName('name').getComponent(cc.Label).string = suitCfg ? `${suitCfg.name}套` : '????';
        let icon = this.suitTypeNode.getChildByName('icon');
        icon.active = !!suitCfg;
        if (icon.active) {
            GlobalUtil.setSpriteIcon(this.node, icon, `view/role/texture/costume/suit/sz_icon_${suitCfg.type}_s`);
        }
        //部位
        let partName = [`${gdk.i18n.t("i18n:BAG_TIP18")}`, `${gdk.i18n.t("i18n:BAG_TIP19")}`, `${gdk.i18n.t("i18n:BAG_TIP20")}`, `${gdk.i18n.t("i18n:BAG_TIP21")}`]
        this.suitPartLab.string = cfg ? partName[cfg.part] : '????';
        //基础属性
        let baseAtrVStr = baseAtrCfg ? baseAtrCfg.attr_type == 'r' ? `${baseAtrCfg.initial_value[0] / 100}%` : `${baseAtrCfg.initial_value[0]}` : '';
        this.suitBaseAttrLab.string = baseAtrCfg ? `${baseAtrCfg.attr_show} ${baseAtrVStr}` : '????';
        //随机属性
        this.suitRandomAttrNodes.forEach((n, idx) => {
            let c = randomAtrCfgs[idx];
            let nameLab = n.getChildByName('name').getComponent(cc.Label);
            let num = n.getChildByName('num').getComponent(cc.Label);
            let icon = n.getChildByName('icon');
            let vStr = c ? c.attr_type == 'r' ? `${c.initial_value[0] / 100}%` : `${c.initial_value[0]}` : '';
            nameLab.string = c ? c.attr_show : '????';
            num.string = c ? vStr : '';
            icon.active = !!c;
            if (icon.active) {
                GlobalUtil.setSpriteIcon(this.node, icon, `view/role/texture/equipTip2/${AttrIconPath[c.attr_show] ? AttrIconPath[c.attr_show] : "sz_shanghaitubiao"}`)
            }
        });
        //预览图标
        let preUiSlot = this.suitPreIcon.getChildByName('UiSlotItem');
        let preIcon = this.suitPreIcon.getChildByName('icon');
        preUiSlot.active = !!cfg && this.customSelectInfo.random_attr.length >= 2 && this.customSelectInfo.random_attr.indexOf(0) == -1;
        preIcon.active = !preUiSlot.active;
        if (preUiSlot.active) {
            let ctrl = preUiSlot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(cfg.id);
            //创建神器最终数据
            let attr1 = new icmsg.CostumeAttr();
            attr1.id = randomAtrCfgs[0].id;
            attr1.initValue = randomAtrCfgs[0].initial_value[0];
            attr1.value = randomAtrCfgs[0].initial_value[0];
            let attr2 = new icmsg.CostumeAttr();
            attr2.id = randomAtrCfgs[1].id;
            attr2.initValue = randomAtrCfgs[1].initial_value[0];
            attr2.value = randomAtrCfgs[1].initial_value[0];
            let attr3 = new icmsg.CostumeAttr();
            attr3.id = baseAtrCfg.id;
            attr3.initValue = baseAtrCfg.initial_value[0];
            attr3.value = baseAtrCfg.initial_value[0];
            let extInfo = new icmsg.CostumeInfo();
            extInfo.id = null;
            extInfo.typeId = cfg.id;
            extInfo.level = 1;
            extInfo.attrs = [attr1, attr2, attr3];
            ctrl.itemInfo = {
                series: null,
                itemId: cfg.id,
                itemNum: 1,
                type: BagUtils.getItemTypeById(cfg.id),
                extInfo: extInfo
            };
        }
    }

    _updateCost() {
        //cost
        let costV = ConfigManager.getItemByField(Costume_globalCfg, 'key', 'custom_item').value;
        let lab = this.customCostNode.getChildByName('label').getComponent(cc.Label);
        let hasNum = BagUtils.getItemNumById(costV[0]);
        lab.string = `${hasNum}/${costV[1]}`;
        lab.node.color = cc.color().fromHEX(hasNum >= costV[1] ? '#FFFFFF' : '#FF0000');
        GlobalUtil.setSpriteIcon(this.node, this.customCostNode.getChildByName('icon'), GlobalUtil.getIconById(costV[0]));
        //getBtn
        this.customBtn.getChildByName('label').getComponent(cc.Label).string = hasNum >= costV[1] ? '开始定制' : '获取定制礼包';
    }
}

/**神装定制 当前选择属性 */
export type CostumeCustomSelectInfo = {
    type: number,
    part: number,
    random_attr: number[]
}
