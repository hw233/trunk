import BagUtils from '../../../../common/utils/BagUtils';
import BYModel from '../../model/BYModel';
import BYUtils from '../../utils/BYUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { Tech_consumptionCfg, Tech_globalCfg, TechCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-15 20:18:33 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/tech/BYTechUpgradeViewCtrl")
export default class BYTechUpgradeViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Node)
    progressNode: cc.Node = null;

    @property(cc.Node)
    attrNode: cc.Node = null;

    @property(cc.Node)
    tips: cc.Node = null;

    @property(cc.Node)
    maxLvTip: cc.Node = null;

    @property(cc.Node)
    materialscontent: cc.Node = null;

    @property(cc.Prefab)
    materialsPrefab: cc.Prefab = null;

    careerNames: string[] = [gdk.i18n.t('i18n:BINGYING_TIP17'), '', gdk.i18n.t('i18n:BINGYING_TIP18'), gdk.i18n.t('i18n:BINGYING_TIP19')]
    iconUrls: string[] = ['view/bingying/texture/energize/kj_qiangbing02', '', 'view/bingying/texture/energize/kj_paobing02', 'view/bingying/texture/energize/kj_shouwei02'];
    careerType: number;
    touchTime: number = 0;
    press_rhythm: number[] = [];
    onEnable() {
        this.press_rhythm = ConfigManager.getItemByField(Tech_globalCfg, 'key', 'press_rhythm').value;
        this.careerType = this.args[0];
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, this.iconUrls[this.careerType - 1]);
        let strs = [gdk.i18n.t('i18n:BINGYING_TIP21'), gdk.i18n.t('i18n:ATTR_NAME_ATK'), gdk.i18n.t('i18n:ATTR_NAME_DEF'), gdk.i18n.t('i18n:ATTR_NAME_HP')]
        this.attrNode.getChildByName('lab1').children.forEach((n, idx) => {
            n.getComponent(cc.Label).string = `${this.careerNames[this.careerType - 1]}${strs[idx]}`;
        });
        let info = ModelManager.get(BYModel).techMap[this.careerType];
        if (!info) {
            info = new icmsg.SoldierTech();
            info.type = this.careerType;
            info.lv = 0;
            info.exp = 0;
            info.slots = [];
        }
        this._updateView(info);
        NetManager.on(icmsg.SoldierTechLevelUpRsp.MsgType, (resp: icmsg.SoldierTechLevelUpRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._updateView(resp.soldierTech);
        }, this);
        //cost
        this._updateCost();
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateCost, this);
    }

    onDisable() {
        this.materialscontent.removeAllChildren();
        this.unscheduleAllCallbacks();
        gdk.Timer.clearAll(this);
        NetManager.targetOff(this);
    }

    _updateView(info: icmsg.SoldierTech) {
        let curCfg = ConfigManager.getItemByField(TechCfg, 'type', this.careerType, { lv: info.lv });
        let nextCfg = ConfigManager.getItemByField(TechCfg, 'type', this.careerType, { lv: info.lv + 1 });
        let keys = ['lv', 'atk_g', 'def_g', 'hp_g'];
        this.attrNode.getChildByName('lab2').children.forEach((n, idx) => {
            n.getComponent(cc.Label).string = (idx == 0 ? 'Lv' : '') + `${idx == 0 ? curCfg.lv : BYUtils.getTechTotalVBylv(this.careerType, curCfg.lv, keys[idx])}`;
        });
        this.attrNode.getChildByName('arrow').active = !!nextCfg;
        let lab3 = this.attrNode.getChildByName('lab3');
        lab3.active = !!nextCfg;
        if (lab3.active) {
            lab3.children.forEach((n, idx) => {
                n.getComponent(cc.Label).string = (idx == 0 ? 'Lv' : '') + `${idx == 0 ? nextCfg.lv : BYUtils.getTechTotalVBylv(this.careerType, nextCfg.lv, keys[idx])}`;
            })
        }
        //progress
        this.progressNode.getChildByName('bar').width = Math.min(147, 147 * (nextCfg ? (info.exp / curCfg.consumption) : 1))
        this.progressNode.getChildByName('num').getComponent(cc.Label).string = nextCfg ? `${info.exp}/${curCfg.consumption}` : gdk.i18n.t('i18n:BINGYING_TIP22');
    }

    _updateCost() {
        let nodes = this.materialscontent.children;
        if (nodes.length <= 0) {
            let cfgs = ConfigManager.getItemsByField(Tech_consumptionCfg, 'type', this.careerType);
            cfgs.sort((a, b) => { return a.exp - b.exp; });
            cfgs.forEach(c => {
                let slot = cc.instantiate(this.materialsPrefab);
                slot.parent = this.materialscontent;
                slot['cfg'] = c;
                let ctrl = slot.getComponent(UiSlotItem);
                ctrl.updateItemInfo(c.item);
                ctrl.updateNumLab(`${BagUtils.getItemNumById(c.item)}`);
                ctrl.node.targetOff(this);
                ctrl.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
            });
        }
        this.materialscontent.children.forEach(n => {
            let ctrl = n.getComponent(UiSlotItem);
            ctrl.updateNumLab(`${BagUtils.getItemNumById(n['cfg'].item)}`);
        });
    }

    _onTouchStart(e: cc.Event) {
        let node = e.currentTarget;
        node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);

        this.touchTime = 0;
        this.schedule((dt) => {
            this.touchTime += dt;
        }, 1);
        this._reqLvUp(node['cfg'].item);
        gdk.Timer.loop(100, this, () => {
            this._reqLvUp(node['cfg'].item);
        });
    }

    _onTouchEnd(e: cc.Event) {
        let node: cc.Node = e.currentTarget;
        node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
        gdk.Timer.clearAll(this);
        this.unscheduleAllCallbacks();
    }

    _reqLvUp(itemId: number) {
        let info = ModelManager.get(BYModel).techMap[this.careerType];
        if (!info) {
            info = new icmsg.SoldierTech();
            info.type = this.careerType;
            info.lv = 0;
            info.exp = 0;
            info.slots = [];
        }
        let nextCfg = ConfigManager.getItemByField(TechCfg, 'type', this.careerType, { lv: info.lv + 1 });
        if (!nextCfg) {
            GlobalUtil.showMessageAndSound('已升至最大等级');
            gdk.Timer.clearAll(this);
            this.unscheduleAllCallbacks();
            return
        }

        let value = this.press_rhythm;
        let reqItemNum = 1;
        for (let i = value.length - 2; i >= 0; i -= 2) {
            if (this.touchTime >= value[i]) {
                reqItemNum = value[i + 1];
                break;
            }
        }
        if (BagUtils.getItemNumById(itemId) < 1) {
            gdk.gui.showMessage(`${BagUtils.getConfigById(itemId).name}${gdk.i18n.t('i18n:RELIC_TIP11')}`);
            gdk.Timer.clearAll(this);
            return;
        }
        let req = new icmsg.SoldierTechLevelUpReq();
        req.type = this.careerType;
        req.itemId = itemId;
        req.itemNum = Math.min(BagUtils.getItemNumById(itemId), reqItemNum);
        NetManager.send(req);
    }
}
