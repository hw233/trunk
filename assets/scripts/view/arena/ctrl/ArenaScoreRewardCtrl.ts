import ConfigManager from '../../../common/managers/ConfigManager';
import GuideUtil from '../../../common/utils/GuideUtil';
import UiScrollView from '../../../common/widgets/UiScrollView';
import { Arena_point_awardCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
 * 物品提示面板
 * @Author: jijing.liu
 * @Description: 
 * @Date: 2019-03-21 09:57:55 
 * @Last Modified by: luoyong
 * @Last Modified time: 2019-11-11 20:04:45
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arena/ArenaScoreRewardCtrl")
export default class ArenaScoreRewardCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    scrollNode: cc.Node = null;

    @property(cc.Prefab)
    listItem: cc.Prefab = null;


    list: UiScrollView = null;

    onLoad() {
        this.list = this.scrollNode.getComponent(UiScrollView);
        this.list.init();
    }

    start() {
        let att: Arena_point_awardCfg[] = ConfigManager.getItems(Arena_point_awardCfg).filter(
            (value: Arena_point_awardCfg, index: number, array: Arena_point_awardCfg[]) => {
                return value.win_point == 3;
            }, this);
        // att.reverse();
        this.list.clear_items();
        this.list.set_data(att);

        if (GuideUtil.getCurGuideId() == 102805) {
            this.list.scroll_to_end()
        }

    }
}
