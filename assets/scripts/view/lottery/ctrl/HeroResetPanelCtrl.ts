import { HeroCfg, Hero_careerCfg, Hero_resetCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import { BagItem } from '../../../common/models/BagModel';
import HeroModel from '../../../common/models/HeroModel';
import RoleModel from '../../../common/models/RoleModel';
import GlobalUtil, { CommonNumColor } from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import PanelId from '../../../configs/ids/PanelId';
import ResonatingModel from '../../resonating/model/ResonatingModel';
import { RoleEventId } from '../../role/enum/RoleEventId';
import HeroResetCheckCtrl from './HeroResetCheckCtrl';

/**
 * 英雄重置界面
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-29 19:43:48
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-06 11:50:32
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroResetPanelCtrl")
export default class HeroResetPanelCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    preScrollView: cc.ScrollView = null;

    @property(cc.Node)
    preContent: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    heroResetItem: cc.Prefab = null

    @property(cc.Button)
    careerBtns: cc.Button[] = []

    @property(cc.Button)
    groupBtns: cc.Button[] = []

    @property(cc.Node)
    contentCareer: cc.Node = null

    @property(cc.Node)
    btnUp: cc.Node = null

    @property(cc.Node)
    onNode: cc.Node = null

    @property(cc.Node)
    offNode: cc.Node = null

    @property(cc.Label)
    costLab: cc.Label = null

    @property(cc.Node)
    emptyTips: cc.Node = null

    preList: ListView = null
    list: ListView = null
    selectColor: number = 0
    selectGroup: number = 0     // 筛选阵营
    selectCareer: number = 0    //筛选职业
    isShowGroup: boolean = false

    cfgLists: { [index: number]: ResetHeroInfo[] } = {}   // 英雄当前职业配置,按品质分类,0为全部
    autoSelectHeroId: number = 0

    get heroModel() { return ModelManager.get(HeroModel); }
    get roleModel() { return ModelManager.get(RoleModel); }
    get resonatingModel(): ResonatingModel { return ModelManager.get(ResonatingModel); }
    onLoad() {
        this._initCfg()
    }

    onEnable() {

        this.autoSelectHeroId = this.heroModel.resetHeroId

        NetManager.on(icmsg.HeroResetPreviewRsp.MsgType, this._heroResetPreviewRsp, this)
        gdk.e.on(RoleEventId.UPDATE_ONE_HERO, this._refreshHeroList, this)
        this._initListView()
        this.selectCareerFunc(null, 0)
        this.selectGroupFunc(null, 0)
        this.updateContentState()
        this.autoSelectHero()
    }

    onDisable() {
        NetManager.targetOff(this)
        gdk.e.targetOff(this)
        gdk.Timer.clearAll(this)
        this.heroModel.resetHeroId = 0
    }

    _refreshHeroList() {
        this.cfgLists = {}
        this._initCfg()
        this._updateDataLater()
    }

    _initCfg() {
        let heroItems = this.heroModel.heroInfos
        let lists = this.cfgLists
        lists[0] = []
        for (let index = 0; index < heroItems.length; index++) {
            let bagCfg: BagItem = heroItems[index]
            let extInfo = <icmsg.HeroInfo>bagCfg.extInfo
            let heroCfg = ConfigManager.getItemById(HeroCfg, bagCfg.itemId)
            if (heroCfg.group[0] == 6) {
                continue;
            }
            let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", extInfo.careerId, { career_lv: extInfo.careerLv })

            if (!lists[heroCfg.defaultColor]) {
                lists[heroCfg.defaultColor] = []
            }
            let data: ResetHeroInfo = {
                cfg: heroCfg,
                extInfo: extInfo,
                careerCfg: careerCfg,
                selected: false
            }
            //符合条件的才显示
            if (extInfo.level >= 2 || (careerCfg.career_lv > 1)) {
                lists[0].push(data)
                lists[heroCfg.defaultColor].push(data)
            }
        }
        // 排序  战力>星级> 品质> 阶级 >等级> 英雄id
        for (let index in lists) {
            GlobalUtil.sortArray(lists[index], (a, b) => {
                if (b.extInfo.power == a.extInfo.power) {
                    if (b.extInfo.star == a.extInfo.star) {
                        if (b.cfg.defaultColor == a.cfg.defaultColor) {

                            if (b.extInfo.level == a.extInfo.level) {
                                return a.cfg.id - b.cfg.id
                            }
                            return b.extInfo.level - a.extInfo.level

                        }
                        return b.cfg.defaultColor - a.cfg.defaultColor
                    }
                    return b.extInfo.star - a.extInfo.star
                }
                return b.extInfo.power - a.extInfo.power
            })
        }
    }

    _heroResetPreviewRsp(data: icmsg.HeroResetPreviewRsp) {
        this._initPreListView()
        this._updatePreState()
        if (this.list.selected_index != -1) {
            this.costLab.string = `${this._getResetCost(data.heroId)}`
            if (this.roleModel.gems >= this._getResetCost(data.heroId)) {
                this.costLab.node.color = CommonNumColor.white
            } else {
                this.costLab.node.color = CommonNumColor.red
            }
            let datas = []
            let bagHero = HeroUtils.getHeroItemByHeroId(data.heroId[0])
            let heroItem = {
                typeId: bagHero.itemId,
                num: 1,
                realStar: (bagHero.extInfo as icmsg.HeroInfo).star
            }
            datas.push(heroItem)

            let allequips = (bagHero.extInfo as icmsg.HeroInfo).slots
            for (let i = 0; i < allequips.length; i++) {
                if (allequips[i].equipId > 0) {
                    let rubies = allequips[i].rubies
                    for (let j = 0; j < rubies.length; j++) {
                        if (rubies[j] > 0) {
                            let ruby = {
                                typeId: rubies[j],
                                num: 1,
                            }
                            datas.push(ruby)
                        }
                    }
                }
            }

            this.preList.set_data(datas.concat(GlobalUtil.sortGoodsInfo(data.goods)))
            gdk.Timer.once(100, this, () => {
                this.preList.resize_content()
            })
        }
    }

    _getResetCost(heroId) {
        let heroBagItem = HeroUtils.getHeroInfoBySeries(heroId)
        let cfg = ConfigManager.getItemByField(Hero_resetCfg, "career_lv", (heroBagItem.extInfo as icmsg.HeroInfo).careerLv)
        return cfg.consume[1]
    }

    _initPreListView() {
        if (this.preList) {
            return
        }
        this.preList = new ListView({
            scrollview: this.preScrollView,
            mask: this.preScrollView.node,
            content: this.preContent,
            item_tpl: this.rewardItem,
            cb_host: this,
            column: 5,
            gap_x: 15,
            gap_y: 15,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.heroResetItem,
            cb_host: this,
            column: 5,
            gap_x: 15,
            gap_y: 15,
            async: true,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._onHeroClick, this)
    }

    _onHeroClick(item: ResetHeroInfo, index: number, preItem: ResetHeroInfo, preIndex: number) {
        // let model = ModelManager.get(HeroModel);
        // let str = ['出战列表-塔防战斗', '出战列表-对战进攻', '出战列表-对战防守']
        // for (let i = 0; i < 3; i++) {
        //     let upList = model.curUpHeroList(i);
        //     if (upList.indexOf(item.extInfo.heroId) != -1) {
        //         GlobalUtil.showMessageAndSound(`此英雄已在'${str[i]}'中上阵,不能重置`)
        //         return;
        //     }
        // }
        if (this.resonatingModel.getHeroInUpList(item.extInfo.heroId)) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP55"))
            return;
        }
        if (item != preItem) {
            let datas: ResetHeroInfo[] = this.list.datas
            for (let i = 0; i < datas.length; i++) {
                datas[i].selected = false
                this.list.refresh_item(i)
            }
            item.selected = !item.selected
            this.list.refresh_item(index)
        } else {
            item.selected = !item.selected
            this.list.refresh_item(index)
            this.onNode.active = false
            this.offNode.active = true
        }
    }

    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _updateScroll() {
        this.list.clear_items()
        this._updatePreState()
        let datas = this.cfgLists[this.selectColor] || []
        //全职业
        let tempList: ResetHeroInfo[] = [];
        if (this.selectCareer != 0) {
            //英雄职业数据
            for (let i = 0; i < datas.length; i++) {
                datas[i].selected = false
                if (datas[i].careerCfg && datas[i].careerCfg.career_type == this.selectCareer) {
                    tempList.push(datas[i])
                }
            }
        } else {
            datas.forEach(element => {
                element.selected = false
            });
            tempList = datas
        }

        if (this.selectGroup != 0) {
            let groupDatas = []
            //英雄阵营数据
            for (let i = 0; i < tempList.length; i++) {
                if (tempList[i].cfg.group.indexOf(this.selectGroup) != -1) {
                    groupDatas.push(tempList[i])
                }
            }
            tempList = groupDatas
        }

        this.list.set_data(tempList)
        this.emptyTips.active = tempList.length == 0
    }

    _updatePreState() {
        if (this.list.selected_index != -1) {
            this.onNode.active = true
            this.offNode.active = false
        } else {
            this.onNode.active = false
            this.offNode.active = true
        }
    }

    showCareerContent() {
        this.isShowGroup = true
        this.updateContentState()
    }

    hideCareerContent() {
        this.isShowGroup = false
        this.updateContentState()
    }

    updateContentState() {
        if (this.isShowGroup) {
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


    resetFunc() {
        let data: ResetHeroInfo = this.list.selectd_data
        if (!GlobalUtil.checkMoneyEnough(this._getResetCost(data.extInfo.heroId), 2, null, [PanelId.HeroResetView])) {
            return
        }
        gdk.panel.open(PanelId.HeroResetCheck, (node: cc.Node) => {
            let ctrl = node.getComponent(HeroResetCheckCtrl)
            if (data) {
                ctrl.updateCheckInfo(this._getResetCost(data.extInfo.heroId), data.extInfo.heroId)
            }
        })
    }

    openTipFunc() {
        gdk.panel.setArgs(PanelId.HelpTipsPanel, 13);
        gdk.panel.open(PanelId.HelpTipsPanel);
    }



    autoSelectHero() {
        let model = ModelManager.get(HeroModel);
        let upList = model.curUpHeroList(0).concat(model.curUpHeroList(1)).concat(model.curUpHeroList(2));
        if (this.autoSelectHeroId == 0) {
            return
        }

        let datas: ResetHeroInfo[] = this.list.datas
        for (let i = 0; i < datas.length; i++) {
            if (datas[i].extInfo.heroId == this.autoSelectHeroId) {
                this.list.scroll_to(i)
                datas[i].selected = true
                this.list.select_item(i)
                this.list.refresh_item(i)
                break
            }
        }
    }

}

export type ResetHeroInfo = {
    cfg: HeroCfg,   // 英雄配置信息
    careerCfg: Hero_careerCfg,
    extInfo: icmsg.HeroInfo,  //
    selected: boolean,
}