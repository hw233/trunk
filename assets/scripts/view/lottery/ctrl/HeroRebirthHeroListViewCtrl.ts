/** 
 * @Description: 重生英雄选择界面
 * @Author: weiliang.huang  
 * @Date: 2019-03-28 17:21:18 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-25 17:03:41
 */

import { GlobalCfg, HeroCfg, Hero_rebirth_heroCfg } from "../../../a/config";
import ConfigManager from "../../../common/managers/ConfigManager";
import ModelManager from "../../../common/managers/ModelManager";
import { BagItem } from "../../../common/models/BagModel";
import HeroModel from "../../../common/models/HeroModel";
import HeroUtils from "../../../common/utils/HeroUtils";
import { ListView, ListViewDir } from "../../../common/widgets/UiListview";
import PanelId from "../../../configs/ids/PanelId";
import ActUtil from "../../act/util/ActUtil";
import HeroLockTipsCtrl from "../../role/ctrl2/main/common/HeroLockTipsCtrl";
import HeroRebirthHeroItemCtrl from "./HeroRebirthHeroItemCtrl";
import HeroRebirthViewCtrl from "./HeroRebirthViewCtrl";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroRebirthHeroListViewCtrl")
export default class HeroRebirthHeroListViewCtrl extends gdk.BasePanel {

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

    @property(cc.Node)
    tipNode: cc.Node = null;
    @property(cc.Node)
    backBtn: cc.Node = null;

    tempList: BagItem[] = []; //所有英雄的临时数据(区分后的)
    datas: BagItem[] = []; //所有英雄的临时数据

    list: ListView = null
    selectGroup: number = 0     // 筛选阵营
    selectCareer: number = 0    //筛选职业
    isShowCareer: boolean = false
    get model(): HeroModel { return ModelManager.get(HeroModel); }

    curHeroInfo: icmsg.HeroInfo;
    actId: number = 121;
    //curIndex: number = -1;
    onEnable() {

        let actType = ActUtil.getActRewardType(this.actId);
        if (!actType) {
            actType = 1
        }
        let cfg = ConfigManager.getItemByField(Hero_rebirth_heroCfg, 'type', actType)
        let heroId = []
        cfg.star.forEach(hero => {
            heroId.push(hero[0])
        })

        this.datas = this.model.heroInfos.concat()//.concat(hireList);
        this.datas.sort(this.sortFunc1)
        let temData = [];
        //筛选出6-11星英雄并且在重生预览英雄里
        let temCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'rebirth')
        this.datas.forEach(data => {
            let hero = <icmsg.HeroInfo>data.extInfo
            let heroCfg = ConfigManager.getItemById(HeroCfg, hero.typeId)
            if (hero.star >= temCfg.value[0] && hero.star <= temCfg.value[1] && heroId.indexOf(hero.heroId) >= 0 && heroCfg.group[0] != 6) {
                temData.push(data);
            }
        })
        this.datas = temData

        let tipLb = this.tipNode.getComponent(cc.Label)
        if (tipLb) {
            tipLb.string = `${temCfg.value[0]}星~${temCfg.value[1]}星的英雄才可以进行重生操作`
        }
        this.tipNode.active = this.datas.length == 0;
        this.backBtn.active = this.datas.length != 0;

        let args = gdk.panel.getArgs(PanelId.HeroGoBackHeroListView)
        if (args) {
            this.curHeroInfo = args[0]
        }

        this.selectGroupFunc(null, 0)
        this.selectCareerFunc(null, 0)
        this.updateContentState()
    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
    }

    //排序方法(星星>战力>ID)
    sortFunc1(a: any, b: any) {
        let heroInfoA = <icmsg.HeroInfo>a.extInfo;
        let heroInfoB = <icmsg.HeroInfo>b.extInfo;
        if (heroInfoA.star == heroInfoB.star) {
            if (heroInfoA.power == heroInfoB.power) {
                return heroInfoA.typeId - heroInfoB.typeId;
            }
            else {
                return heroInfoB.power - heroInfoA.power;
            }
        }
        else {
            return heroInfoB.star - heroInfoA.star;
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
            let isSelect = false
            if (this.curHeroInfo && this.curHeroInfo.heroId == info.series) {
                isSelect = true
            }
            scollData.push({ data: info, isSelect: isSelect, heros: this.model.PveUpHeroList })
        })
        this.list.set_data(scollData);

    }

    _selectItem(data: any, idx: number, preData, preIdx) {
        let heroInfo = <icmsg.HeroInfo>data.data.extInfo;
        if (this.curHeroInfo && this.curHeroInfo.heroId == heroInfo.heroId) return;
        let b = HeroUtils.heroLockCheck(heroInfo, false);
        if (!b) {
            // let preItem = this.list.items[preIdx];
            // if (preItem && preItem.node) {
            //     let preCtrl = preItem.node.getComponent(HeroGoBackItemCtrl);
            //     if (!preCtrl.lock.active) {
            //         preCtrl.check();
            //     }
            // }
            // else {
            //     if (preData) {
            //         this.list.datas[preIdx].isSelect = false;
            //     }
            // }

            if (this.curHeroInfo) {
                this.list.items.forEach(item => {
                    if (item && item.node) {
                        let preCtrl = item.node.getComponent(HeroRebirthHeroItemCtrl);
                        let tem = <icmsg.HeroInfo>preCtrl.data.data.extInfo;
                        if (tem.heroId == this.curHeroInfo.heroId && !preCtrl.lock.active) {
                            preCtrl.check();
                        }
                    }
                })
                // let preItem = this.list.items[this.curIndex];
                // if (preItem && preItem.node) {
                //     let preCtrl = preItem.node.getComponent(HeroGoBackItemCtrl);
                //     if (!preCtrl.lock.active) {
                //         preCtrl.check();
                //     }
                // }
            }

            let item = this.list.items[idx].node;
            let ctrl = item.getComponent(HeroRebirthHeroItemCtrl);
            ctrl.check();
            this.curHeroInfo = heroInfo;
            //this.curIndex = idx;
            // this.materialIds = [];
            // this.targetHeroType = null;
            //this._updateView();
        } else {
            gdk.panel.open(PanelId.HeroLockTips, (node: cc.Node) => {
                let ctrl = node.getComponent(HeroLockTipsCtrl);
                ctrl.initArgs(heroInfo.heroId, [], () => { this.list.select_item(idx) });
            });
            return
        }
        this.list.refresh_items();
    }

    sureBtnClick() {
        if (!this.curHeroInfo) {
            gdk.gui.showMessage('请选择需要重生的英雄')
        } else {
            let tem = gdk.panel.get(PanelId.HeroRebirthView)
            let ctrl = tem.getComponent(HeroRebirthViewCtrl)
            ctrl.heroData = this.curHeroInfo;
            ctrl.refreshHeroData()
            this.close()
        }
    }
}
