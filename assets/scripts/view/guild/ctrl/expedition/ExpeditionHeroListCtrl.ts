import ConfigManager from '../../../../common/managers/ConfigManager';
import ExpeditionModel from './ExpeditionModel';
import ExpeditionUtils from './ExpeditionUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import { AskInfoCacheType, AskInfoType } from '../../../../common/widgets/AskPanel';
import { BagItem } from '../../../../common/models/BagModel';
import { Expedition_globalCfg, HeroCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-28 10:30:11
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/ExpeditionHeroListCtrl")
export default class ExpeditionHeroListCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    heroItemPre: cc.Prefab = null;


    @property(cc.Button)
    careerBtns: cc.Button[] = []

    @property(cc.Button)
    groupBtns: cc.Button[] = []

    @property(cc.Node)
    contentCareer: cc.Node = null

    @property(cc.Node)
    btnUp: cc.Node = null

    list: ListView = null
    selectGroup: number = 0     // 筛选阵营
    selectCareer: number = 0    //筛选职业
    isShowCareer: boolean = false

    selectData: icmsg.HeroInfo = null;
    expeditionHero: icmsg.ExpeditionHero = null

    get expeditionModel() { return ModelManager.get(ExpeditionModel); }
    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }

    onEnable() {
        this.expeditionHero = this.args[0]
        this.selectGroupFunc(null, 0)
        this.selectCareerFunc(null, 0)
        this.updateContentState()
    }

    onDisable() {
        gdk.Timer.clearAll(this);
        gdk.e.targetOff(this);
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }


    update() {
        if (this.scrollView) {
            this.expeditionModel.isHeroListScrolling = this.scrollView.isScrolling()
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

    _updateScroll() {
        this._initListView()

        let datas = this.heroModel.heroInfos.concat();
        let tempList: BagItem[] = [];
        if (this.selectGroup != 0) {
            //英雄阵营数据
            for (let i = 0; i < datas.length; i++) {
                let heroCfg = ConfigManager.getItemById(HeroCfg, datas[i].itemId);
                if (heroCfg.group.indexOf(this.selectGroup) != -1) {
                    tempList.push(datas[i])
                }
            }
        }
        else {
            tempList = datas
        }

        //全职业
        if (this.selectCareer != 0) {
            //英雄职业数据
            let groupDatas = []
            for (let i = 0; i < tempList.length; i++) {
                //let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", (<HeroInfo>tempList[i].extInfo).careerId)
                let type = Math.floor((<icmsg.HeroInfo>tempList[i].extInfo).soldierId / 100);
                if (type == this.selectCareer) {
                    groupDatas.push(tempList[i])
                }
            }
            tempList = groupDatas
        }
        tempList.sort(this.sortFunc1)

        let upHeroId = [];



        let scorllData = [];
        tempList.forEach(info => {
            let temHeroInfo = <icmsg.HeroInfo>info.extInfo
            if (upHeroId.indexOf(temHeroInfo.heroId) < 0) {
                scorllData.push(temHeroInfo)
            }
        })
        this.list.clear_items();
        this.list.set_data(scorllData)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.heroItemPre,
            cb_host: this,
            column: 4,
            gap_x: 30,
            gap_y: 30,
            async: true,
            resize_cb: this._updateDataLater,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._selectItem, this);
    }

    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _selectItem(data: any, index) {
        let isBattle = ExpeditionUtils.getHeroGirdByHeroId(data.heroId) > 0
        if (isBattle) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:EXPEDITION_TIP9"))
            this.selectData = null
            return
        }
        this.selectData = data;
    }

    upHeroBtnClick() {

        if (!this.selectData) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:EXPEDITION_TIP10"))
            return
        }

        let cooling_time = ConfigManager.getItemById(Expedition_globalCfg, "cooling_time").value[0]
        let info: AskInfoType = {
            sureCb: () => {
                let gridId = this.expeditionHero.gridId
                if (this.expeditionHero.heroId == 0) {
                    gridId = ExpeditionUtils.getNewGridId()
                }
                let msg = new icmsg.ExpeditionHeroChangeReq()
                msg.gridId = gridId
                msg.heroId = this.selectData.heroId
                NetManager.send(msg, (data: icmsg.ExpeditionHeroChangeRsp) => {
                    // ExpeditionUtils.updateExpeditionHero(data.hero)
                    gdk.panel.hide(PanelId.ExpeditionHeroList)
                })
            },
            descText: StringUtils.format(gdk.i18n.t('i18n:EXPEDITION_TIP11'), Math.floor(cooling_time / 3600)),//`是否确认出征该英雄，出征后${Math.floor(cooling_time / 3600)}小时内\n不可更换，是否继续操作`,
            thisArg: this,
            isShowTip: true,
            tipSaveCache: AskInfoCacheType.expedition_select_hero,
        }
        GlobalUtil.openAskPanel(info)
    }

    sortFunc1(a: any, b: any) {
        let heroInfoA = <icmsg.HeroInfo>a.extInfo;
        let heroInfoB = <icmsg.HeroInfo>b.extInfo;
        if (heroInfoA.level == heroInfoB.level) {
            if (heroInfoA.color == heroInfoB.color) {
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
                return heroInfoB.color - heroInfoA.color;
            }
        } else {
            return heroInfoB.level - heroInfoA.level;
        }

    }

}