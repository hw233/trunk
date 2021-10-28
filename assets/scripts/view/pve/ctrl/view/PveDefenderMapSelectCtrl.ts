import ConfigManager from '../../../../common/managers/ConfigManager';
import HeroModel from '../../../../common/models/HeroModel';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import RoleModel from '../../../../common/models/RoleModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { SystemCfg } from '../../../../a/config';

/** 
 * @Description: 防御阵营地图设置界面
 * @Author: yaozu.hu
 * @Date: 2020-10-21 14:50:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-10 11:41:46
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/pve/view/PveDefenderMapSelectCtrl")
export default class PveDefenderMapSelectCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    get model(): HeroModel { return ModelManager.get(HeroModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    defenderStr: string[] = ['竞技场', '据点战', '战争遗迹', '锦标赛', '组队竞技场'];
    defenderType: number[] = [1, 2, 3, 4, 5];
    defenderOpenSys: number[] = [901, 2401, 2861, 2856, 2877];

    defenderTemStr: any[] = ['ARENA', 'FOOTHOLD', 'RELIC', 'CHAMPION_MATCH', 'ARENATEAM'];
    //功能开启，但未开放
    grayType: number[] = []

    initDefenderData() {
        let temDefenderStr: string[] = ['竞技场', '据点战', '战争遗迹', '锦标赛', '组队竞技场'];
        let temDefenderType: number[] = [1, 2, 3, 4, 5];
        let openStr = [];
        let openType = [];
        let grayStr = [];
        //let grayType = [];
        this.grayType = []
        this.defenderOpenSys.forEach((sysId, idx) => {
            if (JumpUtils.ifSysOpen(sysId)) {
                openStr.push(temDefenderStr[idx]);
                openType.push(temDefenderType[idx])
            } else {
                let cfg = ConfigManager.getItemById(SystemCfg, sysId);
                if (this.roleModel.level >= cfg.openLv) {
                    grayStr.push(temDefenderStr[idx]);
                    this.grayType.push(temDefenderType[idx])
                }
            }
        })

        this.defenderStr = openStr.concat(grayStr);
        this.defenderType = openType.concat(this.grayType);

    }

    onEnable() {
        this.initDefenderData();

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

        let ListData = [];
        this.defenderStr.forEach((str, index) => {
            let temData = { name: str, typeId: this.defenderType[index], grayTypes: this.grayType };
            ListData.push(temData);
        })
        this.list.set_data(ListData, reset);
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
