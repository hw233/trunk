import ChampionModel from '../model/ChampionModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import { Champion_divisionCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/**
 * @Description: 锦标赛晋升奖励界面
 * @Author: yaozu.hu
 * @Date: 2020-11-26 14:03:28
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 12:00:37
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChampionUpRewardViewCtrl")
export default class ChampionUpRewardViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    @property(cc.Label)
    tips1Lb: cc.Label = null;

    @property(cc.Node)
    tips2Node: cc.Node = null;

    goodList: icmsg.GoodsInfo[] = []
    list: ListView = null

    get championModel() { return ModelManager.get(ChampionModel); }
    column: number = 5;
    onEnable() {


        let arg = gdk.panel.getArgs(PanelId.ChampionUpRewardView)
        if (arg) {
            this.goodList = arg[0];
        }

        this.column = this.goodList.length > 5 ? 5 : this.goodList.length
        if (this.goodList.length > 0) {
            this.scrollView.node.active = true;
            this.tips2Node.active = false;
            // 计算scrollview的宽高
            let svWidth = this.column * 110
            let row = Math.ceil(this.goodList.length / this.column)
            let svHeight = row * 110 + 10
            svHeight = Math.min(svHeight, 250)
            //let svHeight = 120
            this.scrollView.node.setContentSize(cc.size(svWidth, svHeight))
            this.scrollView.node.x = -svWidth / 2 + 5
            this.scrollView.node.y = row > 1 ? -15 : -75
            this._initListView()
            gdk.Timer.once(200, this, () => {
                this.list.set_data(GlobalUtil.getEffectItemList(this.goodList, true, true, false, true))
            })
        } else {

            this.scrollView.node.active = false;
            this.tips2Node.active = true;
        }
        let infoData = this.championModel.infoData
        let cfg = ConfigManager.getItemByField(Champion_divisionCfg, 'lv', infoData.level);
        if (!cfg) {
            cc.log('没找到当前段位的数据：' + infoData.level)
        }
        this.tips1Lb.string = (this.goodList.length > 0 ? gdk.i18n.t("i18n:CHAMPION_UPREWARD_TIP1") : gdk.i18n.t("i18n:CHAMPION_UPREWARD_TIP2")) + cfg.name

    }

    _initListView() {
        if (this.list) {
            this.list.destroy()
        }

        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.rewardItem,
            cb_host: this,
            async: true,
            column: this.column,
            gap_x: 0,
            gap_y: 0,
            direction: ListViewDir.Vertical,
        })
    }

}
