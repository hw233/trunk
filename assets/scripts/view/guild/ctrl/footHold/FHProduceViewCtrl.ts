import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import { Foothold_pointCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';


/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 12:00:44
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHProduceViewCtrl")
export default class FHProduceViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    produceItem: cc.Prefab = null

    list: ListView = null;

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        this._updateViewData()
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.produceItem,
            cb_host: this,
            async: true,
            gap_y: 5,
            direction: ListViewDir.Vertical,
        })
    }

    _updateViewData() {
        this._initListView()

        let cfgs = ConfigManager.getItems(Foothold_pointCfg, { map_type: this.footHoldModel.curMapData.mapType, world_level: this.footHoldModel.worldLevelIndex })

        let datas = []
        for (let i = 0; i < cfgs.length; i++) {
            let goods: icmsg.GoodsInfo[] = []
            let cfg = cfgs[i]
            let good = new icmsg.GoodsInfo()
            good.typeId = FootHoldUtils.BaseExpId
            good.num = cfg.base_exp
            goods.push(good)

            for (let j = 0; j < cfg.output_reward.length; j++) {
                let good = new icmsg.GoodsInfo()
                good.typeId = cfg.output_reward[j][0]
                good.num = cfg.output_reward[j][1]
                goods.push(good)
            }
            datas.push({ type: cfg.point_type, goods: goods })
        }
        this.list.set_data(datas)
    }
}