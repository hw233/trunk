import HeroUtils from '../../../common/utils/HeroUtils';
import TaskUtil from '../util/TaskUtil';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { TaskEventId } from '../enum/TaskEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-06-05 14:41:09 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/TavernHeroSelectViewCtrl")
export default class TavernHeroSelectViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    heroItem: cc.Prefab = null;

    @property(cc.ToggleContainer)
    groupContatiner: cc.ToggleContainer = null;

    list: ListView;
    preGroup: number;
    onEnable() {
        let groupId = this.args[0];
        let toggleIdx;
        if (groupId) {
            toggleIdx = groupId;
        }
        if (!toggleIdx) toggleIdx = 1;
        this.selectPage(toggleIdx)
        gdk.e.on(TaskEventId.TAVERN_HERO_SELECTED, this._onHeroSelected, this); // 英雄上阵
        gdk.e.on(TaskEventId.TAVERN_HERO_UN_SELECTED, this._onHeroUnSelected, this); // 英雄下阵
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
        this.groupContatiner.toggleItems[idx - 1].check();
        this.onGroupToggleClick(this.groupContatiner.toggleItems[idx - 1]);
    }

    onGroupToggleClick(toggle: cc.Toggle) {
        let name = toggle.node.name;
        let group = parseInt(name.substring('group'.length));
        this.preGroup = group;
        let heroInfos = HeroUtils.getHerosByGroup(group);
        if (!this.list) this._initList();
        let alreadyUpHeroList = TaskUtil.getTavernUpHeroIdList();
        let list = [];
        heroInfos.sort((a, b) => {
            if (a.star == b.star) return b.power - a.power;
            else return b.star - a.star;
        });
        heroInfos.forEach(info => {
            if (alreadyUpHeroList.indexOf(info.heroId) == -1) {
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
