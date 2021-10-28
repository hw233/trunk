import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Operation_bestCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-21 14:58:37 
  */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/flipCards/FlipCardSelectViewCtrl")
export default class FlipCardSelectViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    unlockNode: cc.Node = null;

    @property(cc.Node)
    unlockContent: cc.Node = null;

    @property(cc.Node)
    unlockItem: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    list: ListView;
    selectId: number;
    activityId: number = 46;
    curRewardType: number;
    onEnable() {
        this.curRewardType = ActUtil.getCfgByActId(this.activityId).reward_type;
        this._updateList();
        this._updateUnlockNode();
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    checkRewardType() {
        let cfg = ActUtil.getCfgByActId(this.activityId);
        if (!cfg || cfg.reward_type != this.curRewardType) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_TIME_UPDATE"));
            this.close();
            gdk.panel.hide(PanelId.ActivityMainView);
            return false;
        }
        return true;
    }

    onConfirmBtnClick() {
        if (!this.checkRewardType()) {
            return;
        }
        if (this.selectId) {
            let model = ModelManager.get(ActivityModel);
            let turnId = model.flipCardTurnNum;
            let oldId = model.filpCardSpReward[turnId - 1] || 0;
            if (oldId == this.selectId) {
                this.close();
                return;
            }
            else {
                let req = new icmsg.FlipCardSPRewardReq();
                req.spRewardId = this.selectId
                NetManager.send(req);
                this.close();
            }
        }
        else {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_FLIPCARD_TIP1"));
        }
    }

    onCancelBtnClick() {
        this.close();
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                async: true,
                column: 4,
                gap_x: 35,
                gap_y: 10,
                direction: ListViewDir.Vertical,
            })
            this.list.onClick.on(this._onItemClick, this);
            this.list['selectIdx'] = null;
        }
    }

    _updateUnlockNode() {
        let model = ModelManager.get(ActivityModel);
        let type = ActUtil.getCfgByActId(46).reward_type;
        let cfgs = ConfigManager.getItems(Operation_bestCfg, (cfg: Operation_bestCfg) => {
            if (cfg.reward_type == type && cfg.turn > model.flipCardTurnNum) {
                return true;
            }
        });
        this.unlockNode.active = cfgs.length > 0;
        if (this.unlockNode.active) {
            let map: { [turn: number]: Operation_bestCfg[] } = {};
            cfgs.forEach(c => {
                if (!map[c.turn]) map[c.turn] = [];
                map[c.turn].push(c);
            })
            let s = [
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM1"),
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM2"),
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM3"),
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM4"),
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM5"),
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM6"),
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM7"),
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM8"),
                gdk.i18n.t("i18n:ACT_FLIPCARD_NUM9"),
            ]
            this.unlockContent.removeAllChildren();
            for (let key in map) {
                let turn = parseInt(key);
                let item = cc.instantiate(this.unlockItem);
                item.parent = this.unlockContent;
                item.active = true;
                cc.find('lab', item).getComponent(cc.Label).string = `第${s[turn - 1]}轮加入奖池:`;
                let content = item.getChildByName('content');
                content.removeAllChildren();
                map[key].forEach(c => {
                    let e = cc.instantiate(this.slotPrefab);
                    e.parent = content;
                    let ctrl = e.getComponent(UiSlotItem);
                    ctrl.updateItemInfo(c.award[0], c.award[1]);
                    ctrl.itemInfo = {
                        series: null,
                        itemId: c.award[0],
                        itemNum: c.award[1],
                        type: BagUtils.getItemTypeById(c.award[0]),
                        extInfo: null
                    };
                });
            }
        }

    }

    _updateList() {
        let model = ModelManager.get(ActivityModel);
        this._initList();
        let cfgs = ConfigManager.getItems(Operation_bestCfg, (cfg: Operation_bestCfg) => {
            let type = ActUtil.getCfgByActId(46).reward_type;
            if (type == cfg.reward_type && cfg.turn <= model.flipCardTurnNum) {
                return true;
            }
        });
        cfgs.sort((a, b) => {
            if (a.turn == b.turn) return a.id - b.id;
            else return b.turn - a.turn;
        })

        let datas = [];
        cfgs.forEach((cfg, idx) => {
            let obj = {
                cfg: cfg,
                select: model.filpCardSpReward[model.flipCardTurnNum - 1] == cfg.id
            };
            if (obj.select) {
                this.list['selectIdx'] = cfg.id;
            }
            datas.push(obj)
        });
        this.list.clear_items();
        this.list.set_data(datas);
    }

    _onItemClick(data: any, idx, preCfg, preIdx) {
        if (!this.checkRewardType()) {
            return;
        }
        let model = ModelManager.get(ActivityModel);
        let turnId = model.flipCardTurnNum;
        let spRewardIds = model.filpCardSpReward;
        let cfg = data.cfg;
        if (cfg.turn > turnId) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:ACT_FLIPCARD_TIP2"), cfg.turn));
            return;
        }
        let len = 0;
        // let index = spRewardIds.indexOf(cfg.id);
        spRewardIds.forEach((id, idx) => {
            if (id == cfg.id && idx + 1 != turnId) len += 1;
        });
        if (len == cfg.limit) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_FLIPCARD_TIP3"));
        }
        else {
            if (preIdx && preIdx == idx) {
                return;
            }
            this.selectId = data.cfg.id;
            this.list['selectIdx'] = data.cfg.id;
            this.list.refresh_items();
        }
    }
}
