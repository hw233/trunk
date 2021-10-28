import ConfigManager from '../../../common/managers/ConfigManager';
import { Arenahonor_rewardsCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';



/** 
 * @Description: 荣耀巅峰赛奖励预览界面
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-18 16:34:40
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/worldhonor/WorldHonorRewardViewCtrl")
export default class WorldHonorRewardViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;

    actType: number = 2;
    onEnable() {
        //刷新排名奖励信息
        this._updateView2()
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    refreshView2() {
        this._updateView2(false);
    }
    _updateView2(resetPos: boolean = true) {
        this._initListView2();
        let cfgs: Arenahonor_rewardsCfg[] = ConfigManager.getItems(Arenahonor_rewardsCfg, (item: Arenahonor_rewardsCfg) => {
            if (item.subtype == this.actType) {
                return true;
            }
        })
        let ListData = []
        let temRank = 1;
        if (cfgs.length > 0) {
            for (let i = 0; i < cfgs.length; i++) {
                let nameStr = ''
                let cfg = cfgs[i];
                if (cfg.rank == temRank) {
                    nameStr = `第${cfg.rank}名`
                } else {
                    nameStr = `${temRank}~${cfg.rank}名`
                }
                temRank = cfg.rank + 1;
                let temData = { name: nameStr, cfg: cfgs[i] }
                ListData.push(temData);
            }
        }
        this.list.clear_items();
        this.list.set_data(ListData, resetPos);

    }
    _initListView2() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                gap_y: 5,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }
}
