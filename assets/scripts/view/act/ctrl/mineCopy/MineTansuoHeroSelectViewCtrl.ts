import HeroUtils from '../../../../common/utils/HeroUtils';
import MineUtil from '../../util/MineUtil';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
/** 
  * @Description: 矿洞大作战探索英雄选择界面
  * @Author: yaozu.hu 
  * @Date: 2019-05-23 18:03:11 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-08-07 16:27:18
*/

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/mineCopy/MineTansuoHeroSelectViewCtrl")
export default class MineTansuoHeroSelectViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    heroItem: cc.Prefab = null;

    @property(cc.ToggleContainer)
    groupContatiner: cc.ToggleContainer = null;

    list: ListView;
    groupMap: {} = { 3: 1, 4: 2, 5: 3, 7: 4, 8: 5, 9: 6 }  // groupID对应toggle 
    preGroup: number;
    onEnable() {
        let groupId = this.args[0];
        let toggleIdx = 3;
        if (groupId) {
            toggleIdx = groupId;
        }
        this.selectPage(toggleIdx)
        gdk.e.on(ActivityEventId.ACTIVITY_MINE_HERO_SELECTED, this._onHeroSelected, this); // 英雄上阵
        gdk.e.on(ActivityEventId.ACTIVITY_MINE_HERO_UN_SELECTED, this._onHeroUnSelected, this); // 英雄下阵
    }

    onDisable() {
        if (this.list) {
            this.list.onClick.targetOff(this);
            this.list.destroy();
            this.list = null;
        }
        this.preGroup = null;
        gdk.e.targetOff(this);
    }

    selectPage(idx: number) {
        if (this.preGroup && idx == this.preGroup) return;
        this.groupContatiner.toggleItems[this.groupMap[idx]].check();
        this.onGroupToggleClick(this.groupContatiner.toggleItems[this.groupMap[idx]]);
    }

    onGroupToggleClick(toggle: cc.Toggle) {
        let name = toggle.node.name;
        let group = parseInt(name.substring('group'.length));
        this.preGroup = group;
        let heroInfos = HeroUtils.getHerosByGroup(group);
        if (!this.list) this._initList();
        let alreadyUpHeroList = MineUtil.getTansuoUpHeroIdList();
        let list = [];
        heroInfos.sort((a, b) => { return a.color - b.color; });
        heroInfos.forEach(info => {
            if (alreadyUpHeroList.indexOf(info.typeId) == -1) {
                list.push({
                    group: group,
                    info: info
                })
            }
        })
        this.list.clear_items();
        this.list.set_data(list);
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.heroItem,
                cb_host: this,
                column: 5,
                gap_x: 35,
                gap_y: 20,
                async: true,
                direction: ListViewDir.Vertical,
            });
            this.list['tempUpHeroList'] = [];
            this.list.onClick.on(this._onItemClick, this);
        }
    }

    _onItemClick(info: any) {
        // gdk.e.emit(TaskEventId.TAVERN_HERO_SELECTED, [info]);
    }

    _onHeroSelected(e) {
        let id = e.data[0];
        this.saveTempUpHeroList(id);
    }

    _onHeroUnSelected(e) {
        let id = e.data[0];
        this.saveTempUpHeroList(id);
    }

    /**
     * 记录预选派遣英雄
     */
    saveTempUpHeroList(id: number) {
        if (!this.list['tempUpHeroList']) this.list['tempUpHeroList'] = [];
        let idx = this.list['tempUpHeroList'].indexOf(id);
        if (idx == -1) {
            this.list['tempUpHeroList'].push(id);
        }
        else {
            this.list['tempUpHeroList'].splice(idx, 1);
        }
    }
}
