import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import TaskModel from '../model/TaskModel';
import { ItemCfg, Mission_grow_chapterCfg } from '../../../a/config';
import { ItemSubType } from '../../decompose/ctrl/DecomposeViewCtrl';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/**
 * @Description: 爬塔 无尽黑暗
 * @Author: luoyong
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-05-11 11:42:05
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/GrowPreRewardCtrl")
export default class GrowPreRewardCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    preRewardItem: cc.Prefab = null

    list: ListView = null

    get model(): TaskModel { return ModelManager.get(TaskModel); }

    onEnable() {

        this.model.growPreSkillMap = {}

        this._initListView()
        let list = ConfigManager.getItems(Mission_grow_chapterCfg)
        let ids = []
        let data: GrowPreRewardType[] = []
        for (let i = 0; i < list.length; i++) {
            if (ids.indexOf(list[i].big_chapter) == -1) {
                let cfgs = ConfigManager.getItemsByField(Mission_grow_chapterCfg, "big_chapter", list[i].big_chapter)
                let itemIds = []
                let items: GrowPreRewardItemType[] = []
                for (let j = 0; j < cfgs.length; j++) {
                    if (itemIds.indexOf(cfgs[j].reward[0]) == -1) {
                        let itemCfg = ConfigManager.getItemById(ItemCfg, cfgs[j].reward[0])
                        if (itemCfg.func_id == "gnr_skill_lvup") {
                            //技能
                            let skillId = itemCfg.func_args[0]
                            let lv = 2
                            if (this.model.growPreSkillMap[skillId]) {
                                lv = this.model.growPreSkillMap[skillId] + 1
                            }
                            this.model.growPreSkillMap[skillId] = lv
                            let item: GrowPreRewardItemType = {
                                id: skillId,
                                lv: lv,
                                num: 0
                            }
                            items.push(item)
                        } else {
                            //道具
                            let item: GrowPreRewardItemType = {
                                id: cfgs[j].reward[0],
                                lv: 0,
                                num: cfgs[j].reward[1],
                            }
                            items.push(item)
                            itemIds.push(cfgs[j].reward[0])
                        }
                    } else {
                        //同类的数量叠加
                        for (let j = 0; j < items.length; j++) {
                            if (items[j].id == cfgs[j].reward[0]) {
                                items[j].num += cfgs[j].reward[1]
                            }
                        }
                    }
                }
                ids.push(list[i].big_chapter)
                let reward: GrowPreRewardType = {
                    title: cfgs[0].title3,
                    items: items,
                }

                data.push(reward)
            }
        }
        this.list.set_data(data)
    }

    onDestroy() {
        gdk.e.targetOff(this)
        if (this.list) {
            this.list.destroy()
        }
    }

    _initListView() {
        if (this.list) {
            this.list.destroy()
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.preRewardItem,
            cb_host: this,
            async: true,
            gap_y: 6,
            direction: ListViewDir.Vertical,
        })
    }
}

export type GrowPreRewardType = {
    title: string,
    items: GrowPreRewardItemType[],
}

export type GrowPreRewardItemType = {
    id: number,
    lv: number,
    num: number,
}