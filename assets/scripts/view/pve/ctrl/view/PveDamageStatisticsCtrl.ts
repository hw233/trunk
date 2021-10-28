import PanelId from '../../../../configs/ids/PanelId';
import PveSceneCtrl from '../PveSceneCtrl';
import PveSceneModel from '../../model/PveSceneModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { PveFightType } from '../../core/PveFightModel';
/** 
 * Pve伤害统计界面控制类
 * @Author: yaozu.hu  
 * @Date: 2019-06-14 17:38:03 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-10-24 14:26:49
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveDamageStatisticsCtrl")
export default class PveDamageStatisticsCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    PveStatisticsItem: cc.Prefab = null

    @property([cc.Button])
    btns: cc.Button[] = [];

    curIndex: number = 0;
    list: ListView = null
    onLoad() {

    }

    start() {
        this._updateStoreScroll()
    }
    _initListView() {

        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.PveStatisticsItem,
            cb_host: this,
            async: true,
            column: 1,
            gap_x: 0,
            gap_y: 15,
            direction: ListViewDir.Vertical,
        })
    }
    _updateStoreScroll() {
        this._initListView()
        //this.ShowTypeData(0);
        this.curIndex = -1;
        this.TpyeButtonClick(null, 0);
    }

    ShowTypeData(type: number) {
        let model: PveSceneModel;
        let view = gdk.gui.getCurrentView();
        if (gdk.panel.isOpenOrOpening(PanelId.PveScene)) {
            // 塔防战斗
            model = view.getComponent(PveSceneCtrl).model;
        } else {
            // 异常情况
            this.close(-1);
            return;
        }
        let list = []
        switch (type) {
            case 0:
                //获取英雄数据
                let heroList = model.battleInfoUtil.HeroList
                if (heroList.length > 0) {
                    for (let i = 0; i < heroList.length; i++) {
                        let damageData = model.battleInfoUtil.BattleInfo[heroList[i]]
                        if (damageData != null) {
                            list.push({ pos: i, damageData: damageData, type: PveFightType.Hero })
                        }
                    }
                }
                break;
            case 1:
                //获取小兵数据
                let soldierList = model.battleInfoUtil.SoldierList
                if (soldierList.length > 0) {
                    for (let i = 0; i < soldierList.length; i++) {
                        let damageData = model.battleInfoUtil.BattleInfo[soldierList[i]]
                        if (damageData != null) {
                            list.push({ pos: i, damageData: damageData, type: PveFightType.Soldier })
                        }
                    }
                }
                break;
            case 2:
                //获取召唤物数据
                let callList = model.battleInfoUtil.getCallData();//PveBattleInfoUtil.CallList
                if (callList.length > 0) {

                    for (let i = 0; i < callList.length; i++) {
                        let damageData = callList[i];//PveBattleInfoUtil.BattleInfo[callList[i]]
                        if (damageData != null) {
                            list.push({ pos: i, damageData: damageData, type: PveFightType.Call })
                        }
                    }
                }
                break;
            case 3:
                //获取怪物数据
                let enemyList = model.battleInfoUtil.EnemyList
                if (enemyList.length > 0) {
                    for (let i = 0; i < enemyList.length; i++) {
                        let damageData = model.battleInfoUtil.BattleInfo[enemyList[i]]
                        if (damageData != null) {
                            list.push({ pos: i, damageData: damageData, type: PveFightType.Enemy })
                        }
                    }
                }
                break;
            case 4:
                //获取指挥官数据
                let genralList = model.battleInfoUtil.GenralList
                if (genralList.length > 0) {
                    for (let i = 0; i < genralList.length; i++) {
                        let damageData = model.battleInfoUtil.BattleInfo[genralList[i]]
                        if (damageData != null) {
                            list.push({ pos: i, damageData: damageData, type: PveFightType.Genral })
                        }
                    }
                }
                break;
        }

        //排序 总伤害从大到小
        list.sort((a, b) => {
            return b.damageData.OutputAllDamage - a.damageData.OutputAllDamage
        })
        let pos = 0;
        list.forEach(data => {
            data.pos = pos;
            pos++;
        })

        this.list.set_data(list)
    }
    /**
     * 按钮点击事假
     * @param index 
     */
    TpyeButtonClick(e, index) {
        index = parseInt(index)
        if (index != this.curIndex) {
            this.curIndex = index;
            for (let idx = 0; idx < this.btns.length; idx++) {
                const element = this.btns[idx];
                element.interactable = idx != this.curIndex
            }
            this.ShowTypeData(this.curIndex);
        }

    }
}
