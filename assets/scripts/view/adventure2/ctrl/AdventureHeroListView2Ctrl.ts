import AdventureHeroDetailView2Ctrl from './AdventureHeroDetailView2Ctrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NewAdventureModel from '../model/NewAdventureModel';
import NewAdventureUtils from '../utils/NewAdventureUtils';
import PanelId from '../../../configs/ids/PanelId';
import { ActivityEventId } from '../../act/enum/ActivityEventId';
import { BagItem } from '../../../common/models/BagModel';
import { Hero_starCfg, HeroCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
/** 
 * @Description: 角色英雄面板-选择面板
 * @Author:yaozu.hu  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-22 11:39:00
 */



const { ccclass, property, menu } = cc._decorator;


@ccclass
@menu("qszc/view/adventure2/AdventureHeroList2Ctrl")
export default class AdventureHeroList2Ctrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    heroItem: cc.Prefab = null;

    @property(cc.Button)
    careerBtns: cc.Button[] = []

    @property(cc.Button)
    groupBtns: cc.Button[] = []

    @property(cc.Node)
    contentCareer: cc.Node = null

    @property(cc.Node)
    btnUp: cc.Node = null

    tempList: BagItem[] = []; //所有英雄的临时数据(区分后的)
    datas: BagItem[] = []; //所有英雄的临时数据

    list: ListView = null
    selectGroup: number = 0     // 筛选阵营
    selectCareer: number = 0    //筛选职业
    isShowCareer: boolean = false

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    onEnable() {
        let hireList = []
        //添加雇佣兵数据
        this.adventureModel.normal_giveHeros.forEach(hero => {
            // 创建BagItem数据
            let d = NewAdventureUtils.createHeroBagItem(hero)
            if (hero.type == 0) {
                hireList.push(d);
            }
        });
        this.datas = hireList//this.model.heroInfos.concat(hireList);
        this.datas.sort(this.sortFunc1);
        this.selectGroupFunc(null, 0)
        this.selectCareerFunc(null, 0)
        this.updateContentState()
        gdk.e.on(ActivityEventId.ACTIVITY_PEAK_CHANGE_CAREER_UPDATE, this._refreshHeroCareer, this)
    }

    onDisable() {
        gdk.e.targetOff(this)
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
    }

    //排序方法(颜色高低>星级高低>战力高低>等级高低)
    sortFunc1(a: any, b: any) {
        let heroInfoA = <icmsg.HeroInfo>a.extInfo;
        let heroInfoB = <icmsg.HeroInfo>b.extInfo;
        let cfgA = ConfigManager.getItemByField(Hero_starCfg, 'star', heroInfoA.star)
        let cfgB = ConfigManager.getItemByField(Hero_starCfg, 'star', heroInfoB.star)
        if (cfgA.color == cfgB.color) {
            if (heroInfoA.star == heroInfoB.star) {
                if (heroInfoA.power == heroInfoB.power) {
                    return heroInfoB.level - heroInfoA.level;
                }
                else {
                    return heroInfoB.power - heroInfoA.power;
                }
            } else {
                return heroInfoB.star - heroInfoA.star;
            }
        } else {
            return cfgB.color - cfgA.color;
        }
    }


    //排序方法(战力>星星>ID)
    sortFunc2(a: any, b: any) {
        let heroInfoA = <icmsg.HeroInfo>a.extInfo;
        let heroInfoB = <icmsg.HeroInfo>b.extInfo;
        if (heroInfoA.power == heroInfoB.power) {
            if (heroInfoA.star == heroInfoB.star) {
                return heroInfoA.typeId - heroInfoB.typeId;
            }
            else {
                return heroInfoB.star - heroInfoA.star;
            }
        }
        else {
            return heroInfoB.power - heroInfoA.power;
        }
    }

    showCareerContent() {
        this.isShowCareer = true
        this.updateContentState()
    }

    hideCareerContent() {
        this.isShowCareer = false
        this.updateContentState()
    }

    updateContentState() {
        if (this.isShowCareer) {
            this.contentCareer.active = true
            this.btnUp.active = false
        } else {
            this.contentCareer.active = false
            this.btnUp.active = true
        }
    }

    /**选择页签, 筛选职业*/
    selectCareerFunc(e, utype) {
        this.selectCareer = parseInt(utype)
        for (let idx = 0; idx < this.careerBtns.length; idx++) {
            const element = this.careerBtns[idx];
            element.interactable = idx != this.selectCareer
            let select = element.node.getChildByName("select")
            select.active = idx == this.selectCareer
        }
        this._updateScroll()
    }

    /**选择页签, 筛选阵营*/
    selectGroupFunc(e, utype) {
        this.selectGroup = parseInt(utype)
        for (let idx = 0; idx < this.groupBtns.length; idx++) {
            const element = this.groupBtns[idx];
            let nodeName = element.name
            let group = parseInt(nodeName.substring('group'.length));
            element.interactable = group != this.selectGroup
            let select = element.node.getChildByName("select")
            select.active = group == this.selectGroup
        }
        this._updateScroll()
    }


    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.heroItem,
            cb_host: this,
            column: 4,
            gap_x: 35,
            gap_y: 25,
            async: true,
            resize_cb: this._updateDataLater,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._selectItem, this);
    }

    _refreshHeroCareer() {
        let hireList = []
        this.adventureModel.normal_giveHeros.forEach(hero => {
            // 创建BagItem数据
            let d = NewAdventureUtils.createHeroBagItem(hero)
            if (hero.type == 0) {
                hireList.push(d);
            }
        });
        this.datas = hireList;
        this.datas.sort(this.sortFunc1);
        this._updateScroll()
    }

    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _updateScroll() {
        this._initListView()

        this.tempList = [];
        if (this.selectGroup != 0) {
            //英雄阵营数据
            for (let i = 0; i < this.datas.length; i++) {
                let heroCfg = ConfigManager.getItemById(HeroCfg, this.datas[i].itemId);
                if (heroCfg.group.indexOf(this.selectGroup) != -1) {
                    this.tempList.push(this.datas[i])
                }
            }
        }
        else {
            this.tempList = this.datas
        }

        //全职业
        if (this.selectCareer != 0) {
            //英雄职业数据
            let groupDatas = []
            for (let i = 0; i < this.tempList.length; i++) {
                //let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", (<HeroInfo>this.tempList[i].extInfo).careerId)
                let type = Math.floor((<icmsg.HeroInfo>this.tempList[i].extInfo).soldierId / 100);
                if (type == this.selectCareer) {
                    groupDatas.push(this.tempList[i])
                }
            }
            this.tempList = groupDatas
        }
        let scollData = []
        this.list.clear_items();

        this.tempList.forEach(info => {

            scollData.push({ data: info, isSelect: false, isHero: false, ordealHero: false })
        })
        this.list.set_data(scollData);

    }

    _selectItem(data: any, index) {

        let info: BagItem = data.data;
        let heroInfo = <icmsg.HeroInfo>info.extInfo
        gdk.panel.setArgs(PanelId.AdvHeroDetailView2, 1);
        gdk.panel.open(PanelId.AdvHeroDetailView2, (node: cc.Node) => {
            let comp = node.getComponent(AdventureHeroDetailView2Ctrl)
            comp.initHeroInfo(info.series, heroInfo.typeId, heroInfo.star, Math.floor(heroInfo.soldierId / 100), heroInfo.careerId)
        })
    }

}
