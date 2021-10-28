import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Operation_bestCfg, Operation_cardCfg, Operation_poolCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-14 16:02:56 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/flipCards/FlipCardPreviewCtrl")
export default class FlipCardPreviewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    itemPrefab: cc.Node = null;

    @property(cc.Prefab)
    uiSlot: cc.Prefab = null;

    @property(cc.Node)
    state1: cc.Node = null;

    @property(cc.Node)
    state2: cc.Node = null;

    @property(cc.Prefab)
    leftItemPrefab: cc.Prefab = null;

    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;

    get model(): ActivityModel { return ModelManager.get(ActivityModel); }

    curSelect: number;
    list: ListView;
    onEnable() {
        this.uiTabMenu.setSelectIdx(0, true);
        this._updateView();
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    onTabMenuSelect(e, type) {
        if (!e) return;
        if (this.curSelect == parseInt(type)) return;
        this.curSelect = parseInt(type);
        if (this.curSelect == 0) {
            this.state1.active = true;
            this.state2.active = false;
            this._updateView();
        }
        else {
            this.state1.active = false;
            this.state2.active = true;
            this._updateLeftPrize();
        }
    }

    _updateView() {
        let curRewardType = ActUtil.getCfgByActId(46).reward_type;
        let map: { [turn: number]: Operation_bestCfg[] } = {};
        let cfgs = ConfigManager.getItemsByField(Operation_bestCfg, 'reward_type', curRewardType);
        cfgs.forEach(c => {
            if (!map[c.turn]) map[c.turn] = [];
            map[c.turn].push(c);
        });

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
        this.content.removeAllChildren();
        for (let key in map) {
            let turn = parseInt(key);
            let item = cc.instantiate(this.itemPrefab);
            item.parent = this.content;
            item.active = true;
            cc.find('title/lab', item).getComponent(cc.Label).string = `第${s[turn - 1]}轮`;
            let content = item.getChildByName('content');
            content.removeAllChildren();
            map[key].forEach(c => {
                let e = cc.instantiate(this.uiSlot);
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

    _updateLeftPrize() {
        this._updateList();
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: cc.find('scrollview', this.state2).getComponent(cc.ScrollView),
                mask: cc.find('scrollview', this.state2),
                content: cc.find('scrollview/content', this.state2),
                item_tpl: this.leftItemPrefab,
                cb_host: this,
                async: true,
                column: 4,
                gap_y: 10,
                gap_x: 35,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList() {
        this._initList();
        let type = ActUtil.getCfgByActId(46).reward_type;
        let poolId = 0;
        let c = ConfigManager.getItemByField(Operation_cardCfg, 'turn', this.model.flipCardTurnNum, { reward_type: type });
        if (c) {
            poolId = c.pool;
        }
        else {
            let allCfgs = ConfigManager.getItemsByField(Operation_cardCfg, 'reward_type', type);
            poolId = allCfgs[allCfgs.length - 1].pool;
        }
        let cfgs = ConfigManager.getItems(Operation_poolCfg, (cfg: Operation_poolCfg) => {
            if (poolId == cfg.pool && cfg.award && cfg.award.length == 2) {
                return true;
            }
        });
        let datas = [];
        let obj = {};
        cfgs.sort((a, b) => {
            let cfgA = BagUtils.getConfigById(a.award[0]);
            let cfgB = BagUtils.getConfigById(b.award[0]);
            return cfgB.defaultColor - cfgA.defaultColor;
        })
        cfgs.forEach(cfg => {
            let award = cfg.award;
            if (!obj[`${award[0]}_${award[1]}`]) {
                obj[`${award[0]}_${award[1]}`] = {
                    totalNum: 1,
                    cfg: cfg
                };
            }
            else {
                obj[`${award[0]}_${award[1]}`].totalNum += 1;
            }
        })

        let spReward = this.model.filpCardSpReward[this.model.flipCardTurnNum - 1];
        if (spReward) {
            let isRecived = this.model.flipCardRecived;
            let o = {
                cfg: ConfigManager.getItemById(Operation_bestCfg, spReward),
                num: isRecived ? 0 : 1,
                totalNum: 1,
            };
            // o.totalNum = o.cfg.limit;
            // if (o.num > 0) {
            datas.push(o);
            // }
        }

        for (let key in obj) {
            let v = obj[key];
            let num = this._recivedNumById(parseInt(key.split('_')[0]), parseInt(key.split('_')[1]));
            let o = {
                cfg: v.cfg,
                num: v.totalNum - num,
                totalNum: v.totalNum,
            };
            // if (o.num > 0) {
            datas.push(o);
            // }
        }


        this.list.clear_items();
        this.list.set_data(datas);
    }

    _recivedNumById(id: number, num: number) {
        let info = this.model.flipCardFlipInfo;
        let n = 0;
        for (let key in info) {
            let v: icmsg.GoodsInfo = info[key];
            if (v.typeId == id && v.num == num) {
                n += 1;
            }
        }
        return n;
    }
}
