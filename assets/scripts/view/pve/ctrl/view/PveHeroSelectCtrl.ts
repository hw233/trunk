import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel, { CopyType } from './../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import MercenaryModel from '../../../mercenary/model/MercenaryModel';
import ModelManager from '../../../../common/managers/ModelManager';
import PveSceneCtrl from '../PveSceneCtrl';
import PveSceneModel from '../../model/PveSceneModel';
import { BagItem } from './../../../../common/models/BagModel';
import { Copycup_heroCfg, Copycup_rookieCfg, SoldierCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/**
 * Pve场景英雄选择界面控制类
 * @Author: sthoo.huang
 * @Date: 2019-04-04 16:38:20
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-22 12:28:30
 */

const { ccclass, property, menu } = cc._decorator;

// 选择项数据结构
interface ItemStruct {
    data: BagItem,
    isSelect: boolean,
    towerIdx: number,
}

@ccclass
@menu("qszc/scene/pve/view/PveSceneHeroSelectCtrl")
export default class PveSceneHeroSelectCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    heroItem: cc.Prefab = null;

    @property(cc.Node)
    panel: cc.Node = null;

    @property(cc.Label)
    selectLab: cc.Label = null;

    @property(cc.Node)
    selectNodes: cc.Node[] = [] // 排序按钮选中图

    @property(cc.Node)
    jiantou: cc.Node = null;

    onSelect: gdk.EventTrigger;
    list: ListView;
    sceneModel: PveSceneModel;
    sortType: number = 0;

    listId: number = -1;    // 英雄列表中当前选中的英雄的series
    heroId: number = -1;    // 当前塔位上英雄的series
    towerIdx: number = -1;   // 当前的塔位索引

    onEnable() {

        // 战场场景
        let panel = gdk.gui.getCurrentView();
        if (panel) {
            let ctrl = panel.getComponent(PveSceneCtrl);
            if (ctrl) {
                this.sceneModel = ctrl.model;
            }
        }

        // 外部传参
        let args = this.args;
        this.heroId = args ? args[0] : -1;
        // let isUp = true//args[1];
        // if (!isUp) {
        //     this.node.setPosition(cc.v2(0, 260));
        // } else {
        //     this.node.setPosition(cc.v2(0, -400));
        // }
        this.towerIdx = args[2];
        let pos: cc.Vec2 = cc.v2(0, 0);
        let temX = 0;
        this.sceneModel.towers.forEach(tower => {
            if (tower.id == this.towerIdx) {
                let towerPos = tower.node.position
                let temH = cc.winSize.height / 2;
                temX = towerPos.x - cc.winSize.width / 2
                pos.y = Math.min(temH - 310, towerPos.y - temH + 100)
            }
        })
        temX = Math.max(-300, temX);
        temX = Math.min(300, temX);
        this.jiantou.x = temX
        this.node.setPosition(pos);

        // 组件
        this.onSelect = gdk.EventTrigger.get();
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.heroItem,
            cb_host: this,
            async: true,
            select_cb: this._selectItem,
            row: 1,
            gap_x: 0,
            gap_y: 0,
            direction: ListViewDir.Horizontal,
        });
    }

    onDisable() {
        this.list && this.list.destroy();
        this.list = null;
        this.sceneModel = null;
        this.onSelect && this.onSelect.release();
        this.onSelect = null;
        this.listId = -1;
        this.heroId = -1;
    }

    /**刷新英雄选择列表 */
    @gdk.binding('model.heroInfos')
    _updateHeroScroll() {

        let heroInfo = null;
        let heroDic: { [series: number]: boolean } = {};
        let model = this.sceneModel;
        for (let i = 0, n = model.heros.length; i < n; i++) {
            heroDic[model.heros[i].model.item.series] = true;
        }
        let stageCfg = model.stageConfig;
        let heroList: ItemStruct[] = [];
        if (model.isBounty) {
            // 赏金副本
            model.bountyMission.heroList.forEach(h => {
                let element = HeroUtils.createHeroBagItemBy(h);
                let info = element.extInfo as icmsg.HeroInfo;
                element.series = 700000 + info.heroId;
                if (!heroDic[element.series]) {
                    // 没有上阵的英雄
                    heroList.push({ data: element, isSelect: false, towerIdx: this.towerIdx });
                } else if (element.series == this.heroId) {
                    // 为当前选中的英雄
                    heroInfo = element;
                }
            });
        } else if (model.stageConfig.copy_id == CopyType.RookieCup) {
            let temCfg = ConfigManager.getItem(Copycup_rookieCfg, { 'stage_id': model.stageConfig.id });

            if (temCfg['tower_' + this.towerIdx].length > 0) {
                temCfg['tower_' + this.towerIdx].forEach(id => {
                    let heroCfg = ConfigManager.getItemById(Copycup_heroCfg, id);
                    //let series = heroCfg.hero_id % 300000 + 800000;
                    let element = HeroUtils.createCopyCupHeroBagItem(heroCfg.id);
                    let info = element.extInfo as icmsg.HeroInfo;
                    if (info && !heroDic[element.series]) {
                        heroList.push({ data: element, isSelect: false, towerIdx: this.towerIdx });
                    } else if (element.series == this.heroId) {
                        heroInfo = element;
                    }
                })
            }
            // let element = HeroUtils.createHeroBagItemBy(h);
            // let info = element.extInfo as HeroInfo;
            // element.series = 700000 + info.heroId;
            // if (!heroDic[element.series]) {
            //     // 没有上阵的英雄
            //     heroList.push({ data: element, isSelect: false });
            // } else if (element.series == this.towerId) {
            //     // 为当前选中的英雄
            //     heroInfo = element;
            // }

        } else if (model.stageConfig.copy_id == CopyType.ChallengeCup) {
            let copyModel = ModelManager.get(CopyModel);
            let tem = []
            if (copyModel.eliteChallengeSelectHero['' + model.stageConfig.id]) {
                tem = copyModel.eliteChallengeSelectHero['' + model.stageConfig.id]
            }
            //let temCfg = ConfigManager.getItem(Copycup_rookieCfg, { 'stage_id': model.stageConfig.id });
            if (tem.length > 0) {
                tem.forEach(id => {
                    let heroCfg = ConfigManager.getItemById(Copycup_heroCfg, id);
                    //let series = heroCfg.hero_id % 300000 + 800000;
                    let element = HeroUtils.createCopyCupHeroBagItem(heroCfg.id);
                    let info = element.extInfo as icmsg.HeroInfo;
                    if (info && !heroDic[element.series]) {
                        heroList.push({ data: element, isSelect: false, towerIdx: this.towerIdx });
                    } else if (element.series == this.heroId) {
                        heroInfo = element;
                    }
                })
            }
        }
        else {
            // 普通副本
            let infos = ModelManager.get(HeroModel).heroInfos;
            for (let i = 0, n = infos.length; i < n; i++) {
                let element = infos[i];
                if (!heroDic[element.series]) {
                    if (stageCfg.copy_id == CopyType.Sthwar) {
                        // 当天公会据点战战斗胜利后的英雄不能再次战斗
                        if (!(<icmsg.HeroInfo>element.extInfo).sthFighted) {
                            heroList.push({ data: element, isSelect: false, towerIdx: this.towerIdx });
                        }
                    } else {
                        heroList.push({ data: element, isSelect: false, towerIdx: this.towerIdx });
                    }
                } else if (element.series == this.heroId) {
                    // 为当前选中的英雄
                    heroInfo = element;
                }
            }
            // 生存副本，添加雇佣的英雄
            if (stageCfg.copy_id == CopyType.Survival || stageCfg.copy_id == CopyType.Mine) {
                let mercenaryModel = ModelManager.get(MercenaryModel);
                let heroes = mercenaryModel.borrowedListHero;
                for (let i = 0, n = heroes.length; i < n; i++) {
                    let hero = heroes[i];
                    let element = HeroUtils.createMercenaryHeroBagItem(hero);
                    if (!heroDic[element.series]) {
                        // 添加至列表
                        heroList.push({ data: element, isSelect: false, towerIdx: this.towerIdx });
                    } else if (element.series == this.heroId) {
                        // 为当前选中的英雄
                        heroInfo = element;
                    }
                }
            }
            // 新奖杯模式
        }
        // 英雄类型过滤
        let soldierType = model.eliteStageUtil.getTowerSoldierType(this.towerIdx);
        if (soldierType != 0) {
            for (let i = heroList.length - 1; i >= 0; i--) {
                let info = heroList[i].data.extInfo as icmsg.HeroInfo;
                let cfg = ConfigManager.getItemById(SoldierCfg, info.soldierId);
                if (cfg.type != soldierType) {
                    // 不是指定的英雄类型
                    heroList.splice(i, 1);
                }
            }
        }
        // 没上阵英雄排序
        let sortFunc: any = this['sortFunc' + (this.sortType + 1)];
        if (heroList.length > 0) {
            GlobalUtil.sortArray(heroList, sortFunc);
        }
        // 当前英雄
        if (heroInfo) {
            heroList.unshift({ data: heroInfo, isSelect: false, towerIdx: this.towerIdx });
        }
        // 刷新列表
        this.list.set_data(heroList);
        // 设置当前英雄
        if (heroInfo) {
            for (let i = 0, n = heroList.length; i < n; i++) {
                let data = heroList[i];
                if (data.data.series == this.heroId) {
                    this.list.items[i].is_select = true;
                    data.isSelect = true;
                    this.list.refresh_item(i, data);
                    break;
                }
            }
            this.listId = this.heroId;
        }
    }

    _selectItem(data: ItemStruct, idx: number) {
        // 点击的项为当前选中的英雄
        if (this.listId == data.data.series) {
            // 设置为null则代表当前英雄下阵
            data.data = null;
        }
        // 派发事件并关闭弹窗
        this.onSelect.emit(data.data, idx);
        this.close(-1);
    }

    _removeHero(e: gdk.Event) {
        let heroId = e.data
        let datas: BagItem[] = this.list.datas
        for (let index = 0; index < datas.length; index++) {
            let item = datas[index];
            if (item.series == heroId) {
                this.list.remove_data(index)
            }
        }
    }

    _updateHero(e: gdk.Event) {
        let datas: BagItem[] = this.list.datas;
        for (let index = 0; index < datas.length; index++) {
            let item = datas[index];
            if (item.series == item.series) {
                this.list.refresh_item(index, item);
            }
        }
    }

    /**排序选择函数 */
    sortSelectFunc(e: any, utype: any) {
        utype = parseInt(utype);
        this.hidePanel();
        if (this.sortType == utype) {
            return;
        }
        const BtnTexts = ["战力", "等级", "星级", "稀有度"];
        this.sortType = utype;
        this.selectLab.string = `${BtnTexts[utype]}`;
        this._updateHeroScroll();
    }

    /**排序按钮 */
    btnSelectFunc() {
        for (let index = 0; index < this.selectNodes.length; index++) {
            let element = this.selectNodes[index];
            element.active = index == this.sortType;
        }
        this.panel.active = true;
    }

    hidePanel() {
        this.panel.active = false;
    }

    /**战力排序函数 */
    sortFunc1(a: any, b: any) {
        let infoA = <icmsg.HeroInfo>a.data.extInfo;
        let infoB = <icmsg.HeroInfo>b.data.extInfo;
        return infoB.power - infoA.power;
    }

    /**英雄等级排序函数 */
    sortFunc2(a: any, b: any) {
        let infoA = <icmsg.HeroInfo>a.data.extInfo;
        let infoB = <icmsg.HeroInfo>b.data.extInfo;
        if (infoA.level == infoB.level) {
            return infoB.power - infoA.power;
        }
        return infoB.level - infoA.level;
    }

    /**星级排序函数 */
    sortFunc3(a: any, b: any) {
        let infoA = <icmsg.HeroInfo>a.data.extInfo;
        let infoB = <icmsg.HeroInfo>b.data.extInfo;
        if (infoA.star == infoB.star) {
            return infoB.power - infoA.power;
        }
        return infoB.star - infoA.star;
    }

    /**品质函数 */
    sortFunc4(a: any, b: any) {
        let infoA = <icmsg.HeroInfo>a.data.extInfo;
        let infoB = <icmsg.HeroInfo>b.data.extInfo;
        if (infoA.color == infoB.color) {
            return infoB.power - infoA.power;
        }
        return infoB.color - infoA.color;
    }
}