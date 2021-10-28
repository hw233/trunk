import ActivityModel from '../../model/ActivityModel';
import AdvCatecherSelectItemCtrl from './AdvCatecherSelectItemCtrl';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import { Luckydraw_optionalCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-22 15:27:28 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/catcher/AdvCatecherSelectViewCtrl")
export default class AdvCatecherSelectViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }
    curSelectItem: cc.Node = null;
    cancelTouch: boolean = false;
    onEnable() {
        this._updateView();
    }

    onDisable() {
        NetManager.targetOff(this);
        gdk.Timer.clearAll(this);
    }

    onConfirmBtnClick() {
        if (this.curSelectItem) {
            let ctrl = this.curSelectItem.getComponent(AdvCatecherSelectItemCtrl);
            if (ctrl.cfg.optional !== this.actModel.advLuckyOptionalId) {
                let req = new icmsg.LuckyDrawOptionalReq();
                req.optional = ctrl.cfg.optional;
                NetManager.send(req, null, this);
            }
        }
        this.close();
    }

    _updateView() {
        let ids = [];
        this.content.removeAllChildren();
        let cfgs = ConfigManager.getItems(Luckydraw_optionalCfg);
        cfgs.forEach(c => {
            if (ids.indexOf(c.optional) == -1) {
                ids.push(c.optional);
                let item = cc.instantiate(this.itemPrefab);
                item.parent = this.content;
                let b = c.optional == this.actModel.advLuckyOptionalId;
                let ctrl = item.getComponent(AdvCatecherSelectItemCtrl);
                ctrl.updateView(c, b);
                if (b) {
                    this.curSelectItem = item;
                }
                item.targetOff(this);
                item.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
            }
        });
    }

    _onTouchStart(e: cc.Event) {
        let node = e.getCurrentTarget();
        let ctrl = node.getComponent(AdvCatecherSelectItemCtrl);
        node.once(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        node.once(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
        this.cancelTouch = false;
        gdk.Timer.clearAll(this);
        gdk.Timer.once(1000, this, () => {
            this.cancelTouch = true;
            node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
            node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
            GlobalUtil.openItemTips({
                series: null,
                itemId: ctrl.cfg.reward[0],
                itemNum: 1,
                type: BagUtils.getItemTypeById(ctrl.cfg.reward[0]),
                extInfo: null
            });
        });
    }

    _onTouchEnd(e: cc.Event) {
        gdk.Timer.clearAll(this);
        if (!this.cancelTouch) {
            let node = e.getCurrentTarget();
            let ctrl = node.getComponent(AdvCatecherSelectItemCtrl);
            if (this.curSelectItem) {
                let curCtrl = this.curSelectItem.getComponent(AdvCatecherSelectItemCtrl);
                curCtrl.unCheck();
                if (curCtrl.cfg.optional == ctrl.cfg.optional) {
                    this.curSelectItem = null;
                    return;
                }
            }
            ctrl.check();
            this.curSelectItem = node;
        }
    }

    _onTouchCancel() {
        gdk.Timer.clearAll(this);
    }
}
