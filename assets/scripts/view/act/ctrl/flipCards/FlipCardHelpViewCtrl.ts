import ActivityModel from '../../model/ActivityModel';
import ActUtil from '../../util/ActUtil';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import {
    Operation_bestCfg,
    Operation_cardCfg,
    Operation_poolCfg,
    TipsCfg
    } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-22 20:04:19 
  */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/flipCards/FlipCardHelpViewCtrl")
export default class FlipCardHelpViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    tipsContent: cc.Node = null;

    @property(cc.Node)
    tipsLabItem: cc.Node = null;

    get model(): ActivityModel { return ModelManager.get(ActivityModel); }
    list: ListView;
    onEnable() {
        // this._updateList();
        this._updateTips();
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
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

    _updateTips() {
        let startTime = new Date(ActUtil.getActStartTime(46));
        let endTime = new Date(ActUtil.getActEndTime(46) - 5000); //time为零点,减去5s 返回前一天
        let timeLab = `${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        let tipsCfg = ConfigManager.getItemById(TipsCfg, 52);
        let desc: string = tipsCfg.desc21;
        let items = desc.split('<br>');
        this.tipsContent.removeAllChildren();
        for (let i = 0; i < items.length; i++) {
            let str = items[i].replace('s1', timeLab);
            let item = cc.instantiate(this.tipsLabItem);
            item.active = true;
            item.parent = this.tipsContent;
            item.x = 0;
            item.getChildByName('lab').getComponent(cc.RichText).string = str;
            item.height = item.getChildByName('lab').height + 5;
        }
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
