import BYUtils from '../utils/BYUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import PanelId from '../../../configs/ids/PanelId';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { SoldierCfg } from '../../../a/config';

/** 
  * @Description: 科技适合英雄界面
  * @Author: weiliang.huang  
  * @Date: 2019-05-08 14:30:04 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-04-18 11:27:46
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/TechHeroCtrl")
export default class TechHeroCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    techHeroItem: cc.Prefab = null

    list: ListView = null

    onEnable() {

        this._initListView()
        let args = gdk.panel.getArgs(PanelId.TechHero)
        let soldierId = args[0]
        let cfg = ConfigManager.getItemById(SoldierCfg, soldierId)
        let heroList = BYUtils.sortHeroId(cfg.use_hero);
        this.list.set_data(heroList)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.techHeroItem,
            cb_host: this,
            async: true,
            column: 4,
            gap_x: 15,
            gap_y: 15,
            direction: ListViewDir.Vertical,
        })
    }

}