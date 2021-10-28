import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import ServerModel from '../../../../common/models/ServerModel';
import SiegeModel from './SiegeModel';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Siege_globalCfg, Siege_rankingCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-02-02 15:39:14
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/siege/SiegeRankRewardCtrl")
export default class SiegeRankRewardCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    rewardItemPrefab: cc.Prefab = null;

    @property(cc.RichText)
    desc1Lab: cc.RichText = null;

    @property(cc.RichText)
    desc2Lab: cc.RichText = null;

    list: ListView;

    get siegeModel() { return ModelManager.get(SiegeModel); }

    onEnable() {
        this._updateViewInfo()

        let requirements = ConfigManager.getItemById(Siege_globalCfg, "requirements").value[0]
        this.desc1Lab.string = StringUtils.format(gdk.i18n.t("i18n:SIEGE_TIP1"), this.siegeModel.weekGroup)
        this.desc2Lab.string = StringUtils.format(gdk.i18n.t("i18n:SIEGE_TIP2"), requirements)
    }

    onDisable() {
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
            item_tpl: this.rewardItemPrefab,
            cb_host: this,
            gap_y: 5,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    _updateViewInfo() {
        this._initList()
        let cfgs = ConfigManager.getItems(Siege_rankingCfg, { world_level: this.siegeModel.worldLevelIndex, server: this.siegeModel.serverNum })
        if (cfgs.length == 0) {
            cfgs = ConfigManager.getItems(Siege_rankingCfg, { world_level: this.siegeModel.worldLevelIndex, server: 1 })
        }
        this.list.set_data(cfgs)
    }
}