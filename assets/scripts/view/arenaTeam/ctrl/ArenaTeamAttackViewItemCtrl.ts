import UiListItem from '../../../common/widgets/UiListItem';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';



/**
 * @Description: 组队竞技场挑战顺序排列item
 * @Author: yaozu.hu
 * @Date: 2021-02-01 16:39:37
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-02-02 21:55:53
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenaTeam/ArenaTeamAttackViewItemCtrl")
export default class ArenaTeamAttackViewItemCtrl extends UiListItem {

    @property(cc.Label)
    nameLb: cc.Label = null;
    @property(cc.Label)
    powerLb: cc.Label = null;
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    heroItem: cc.Prefab = null;
    @property(cc.Node)
    hideNode: cc.Node = null;

    info: icmsg.ArenaTeamRoleHeroes
    show: boolean = true;
    heroListView: ListView;
    updateView() {
        this.info = this.data.data;
        this.show = this.data.show;
        this.nameLb.string = this.info.playerName;
        this.hideNode.active = !this.show;
        this.scrollView.node.active = this.show;
        this.powerLb.node.parent.active = this.show;
        if (this.show) {
            this.updateScroll();
        }
    }

    updateScroll() {
        this._initListView();
        let listData = [];
        let powerNum = 0;
        this.info.heroes.forEach(data => {
            let tem = { hero: data, playerId: this.info.playerId };
            listData.push(tem);
            powerNum += data.power;
        })
        this.powerLb.string = powerNum + '';
        this.heroListView.set_data(listData);
    }

    _initListView() {
        if (this.heroListView) {
            return
        }
        this.heroListView = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.heroItem,
            cb_host: this,
            column: 3,
            gap_x: 10,
            gap_y: 5,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    onDisable() {
        if (this.heroListView) {
            this.heroListView.destroy()
            this.heroListView = null;
        }
    }

}
