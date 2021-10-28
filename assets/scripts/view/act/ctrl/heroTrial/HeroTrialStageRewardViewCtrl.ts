import ConfigManager from '../../../../common/managers/ConfigManager';
import InstanceModel from '../../../instance/model/InstanceModel';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { OrdealCfg } from '../../../../a/config';

/** 
 * @Description: 英雄试炼关卡奖励
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-09 14:45:20
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/heroTrial/HeroTrialStageRewardViewCtrl")
export default class HeroTrialStageRewardViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    model: InstanceModel = ModelManager.get(InstanceModel);

    ordealCfg: OrdealCfg;

    onEnable() {
        let arg = gdk.panel.getArgs(PanelId.HeroTrialStageRewardView);
        if (arg) {
            this.ordealCfg = arg[0];
        } else {
            this.close()
            return;
        }
        //刷新排名奖励信息
        this._updateView()

    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null
        }
    }

    _updateView(reset: boolean = true) {
        this._initListView();
        // let cfgs = ConfigManager.getItems(Ordeal_challengeCfg, (item: Ordeal_challengeCfg) => {
        //     if (item.activity_id == this.ordealCfg.activity_id && item.type == this.ordealCfg.type) {
        //         return true;
        //     }
        // })
        let cfgs = ConfigManager.getItems(OrdealCfg, (item: OrdealCfg) => {
            if (item.activity_id == this.ordealCfg.activity_id && item.type == this.ordealCfg.type) {
                return true;
            }
        })
        let List2Data = [];
        let isLastCfg = cfgs[cfgs.length - 2].round == this.model.heroTrialInfo.maxStageId;
        for (let i = 0, n = cfgs.length; i < n - 1; i++) {
            let temData = { cfg: cfgs[i], index: i, curCfg: this.ordealCfg, isLast: isLastCfg };
            List2Data.push(temData);
        }
        this.list.set_data(List2Data, reset);
    }
    _initListView() {
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
