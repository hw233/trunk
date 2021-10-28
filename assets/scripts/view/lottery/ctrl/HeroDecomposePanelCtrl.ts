import { HeroCfg, Hero_careerCfg, Hero_starCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import { BagItem } from '../../../common/models/BagModel';
import HeroModel from '../../../common/models/HeroModel';
import RoleModel from '../../../common/models/RoleModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroUtils from '../../../common/utils/HeroUtils';
import StringUtils from '../../../common/utils/StringUtils';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import PanelId from '../../../configs/ids/PanelId';
import MercenaryModel from '../../mercenary/model/MercenaryModel';
import HeroLockTipsCtrl from '../../role/ctrl2/main/common/HeroLockTipsCtrl';
import { RoleEventId } from '../../role/enum/RoleEventId';
import { ResetHeroInfo } from './HeroResetPanelCtrl';

/**
 * 英雄分解界面
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-29 19:43:48
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-07-27 17:03:56
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroDecomposePanelCtrl")
export default class HeroDecomposePanelCtrl extends gdk.BasePanel {

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
    heroDecomposeItem: cc.Prefab = null

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

    @property(cc.Node)
    emptyTips: cc.Node = null

    @property(cc.Label)
    putNumLab: cc.Label = null

    @property(cc.Label)
    maxNumLab: cc.Label = null

    preList: ListView = null
    list: ListView = null
    selectColor: number = 0
    selectGroup: number = 0     // 筛选阵营
    selectCareer: number = 0    //筛选职业
    isShowGroup: boolean = false

    _maxNum = 15

    cfgLists: { [index: number]: ResetHeroInfo[] } = {}   // 英雄当前职业配置,按品质分类,0为全部
    autoSelectHeroId: number = 0

    _heroIds: number[] = []

    get heroModel() { return ModelManager.get(HeroModel); }
    get roleModel() { return ModelManager.get(RoleModel); }

    onLoad() {
        this._initCfg()
    }

    onEnable() {

        NetManager.on(icmsg.HeroResetPreviewRsp.MsgType, this._heroResetPreviewRsp, this)
        // gdk.e.on(RoleEventId.UPDATE_ONE_HERO, this._refreshHeroList, this)
        gdk.e.on(RoleEventId.REMOVE_ONE_HERO, this._refreshHeroList, this)

        this._initListView()
        this.selectCareerFunc(null, 0)
        this.selectGroupFunc(null, 0)
        this.updateContentState()
    }

    onDisable() {
        NetManager.targetOff(this)
        gdk.e.targetOff(this)
        gdk.Timer.clearAll(this)
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
        let groupSort = [4, 5, 2, 1, 3];  //仅为了排序 潜力>灵力>魅力>极光>漫夜
        for (let index = 0; index < heroItems.length; index++) {
            let bagCfg: BagItem = heroItems[index]
            let extInfo = <icmsg.HeroInfo>bagCfg.extInfo
            let heroCfg = ConfigManager.getItemById(HeroCfg, bagCfg.itemId)
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
            if (groupSort.indexOf(heroCfg.group[0]) < 0) {
                continue;
            }
            data['groupSort'] = groupSort[heroCfg.group[0] - 1];
            lists[0].push(data)
            lists[heroCfg.defaultColor].push(data)

        }
        // 排序  星级>等级> 阵营
        for (let index in lists) {
            GlobalUtil.sortArray(lists[index], (a, b) => {
                if (b.extInfo.star == a.extInfo.star) {
                    if (b.extInfo.level == a.extInfo.level) {
                        if (a['groupSort'] == b['groupSort']) {
                            return a.cfg.id - b.cfg.id
                        }
                        else {
                            return a['groupSort'] - b['groupSort']
                        }
                    }
                    return b.extInfo.level - a.extInfo.level
                }
                return a.extInfo.star - b.extInfo.star
            })
        }
    }

    _heroResetPreviewRsp(data: icmsg.HeroResetPreviewRsp) {
        this._initPreListView()
        this._updatePreState()
        let datas = []
        let datas2 = []
        let money = 0
        let score = 0
        for (let i = 0; i < data.heroId.length; i++) {
            let bagHero = HeroUtils.getHeroItemByHeroId(data.heroId[i])
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

            let cfg = ConfigManager.getItemByField(Hero_starCfg, "star", (bagHero.extInfo as icmsg.HeroInfo).star)
            if (cfg && cfg.decompose) {
                if (cfg.decompose[0] == 21) {
                    score += cfg.decompose[1]
                }
                if (cfg.decompose[0] == 3) {
                    money += cfg.decompose[1]
                }
            }
        }

        let item = {
            typeId: 21,
            num: score,
        }
        if (score > 0) {
            datas2.push(item)
        }

        let isAdd = false
        let goods = data.goods
        for (let i = 0; i < goods.length; i++) {
            if (goods[i].typeId == 3) {
                isAdd = true
                goods[i].num += money
            }
        }
        if (!isAdd && money > 0) {
            let moneyItem: icmsg.GoodsInfo = new icmsg.GoodsInfo()
            moneyItem.typeId = 3
            moneyItem.num = money
            goods.push(moneyItem)
        }
        this.preList.set_data(datas2.concat(datas.concat(GlobalUtil.sortGoodsInfo(goods))))
        gdk.Timer.once(100, this, () => {
            this.preList.resize_content()
        })
        this._updateNum()

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
            item_tpl: this.heroDecomposeItem,
            cb_host: this,
            column: 5,
            gap_x: 15,
            gap_y: 15,
            async: true,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._onHeroClick, this)
    }

    _onHeroClick(item: ResetHeroInfo, idx) {
        if (HeroUtils.heroLockCheck(item.extInfo, false)) {
            gdk.panel.open(PanelId.HeroLockTips, (node: cc.Node) => {
                let ctrl = node.getComponent(HeroLockTipsCtrl);
                ctrl.initArgs(item.extInfo.heroId, [], () => { this.list.select_item(idx) });
            });
            return
        }

        let idIndex = this._heroIds.indexOf(item.extInfo.heroId)
        if (idIndex == -1) {
            if (this._heroIds.length >= this._maxNum) {
                gdk.gui.showMessage(`${StringUtils.format(gdk.i18n.t("i18n:LOTTERY_TIP22"), this._maxNum)}`);
                return;
            }
            this._heroIds.push(item.extInfo.heroId)
        } else {
            this._heroIds.splice(idIndex, 1)
        }
        let datas: ResetHeroInfo[] = this.list.datas
        for (let i = 0; i < datas.length; i++) {
            if (this._heroIds.indexOf(datas[i].extInfo.heroId) == -1) {
                datas[i].selected = false
            } else {
                datas[i].selected = true
            }

        }
        this.list.refresh_items()

        if (this._heroIds.length > 0) {
            let msg = new icmsg.HeroResetPreviewReq()
            msg.heroId = this._heroIds
            NetManager.send(msg)
        } else {
            this.onNode.active = false
            this.offNode.active = true
            this._updateNum()
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
                datas[i].selected = this._heroIds.indexOf(datas[i].extInfo.heroId) !== -1;
                if (datas[i].careerCfg && datas[i].careerCfg.career_type == this.selectCareer) {
                    tempList.push(datas[i])
                }
            }
        } else {
            datas.forEach(element => {
                element.selected = this._heroIds.indexOf(element.extInfo.heroId) !== -1;
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

        this._updateNum()
    }

    _updatePreState() {
        if (this._heroIds.length > 0) {
            this.onNode.active = true
            this.offNode.active = false
        } else {
            this.onNode.active = false
            this.offNode.active = true
        }
    }

    _updateNum() {
        this.putNumLab.string = `(${this._heroIds.length}`
        this.maxNumLab.string = `/${this._maxNum})`
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
        this._heroIds = []
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
        this._heroIds = []
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

    openTipFunc() {
        gdk.panel.setArgs(PanelId.HelpTipsPanel, 35);
        gdk.panel.open(PanelId.HelpTipsPanel);
    }


    decomposeFunc() {
        if (this._heroIds.length == 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:LOTTERY_TIP23"))
            return
        }

        let isTip = false
        for (let i = 0; i < this._heroIds.length; i++) {
            let bagHero = HeroUtils.getHeroItemByHeroId(this._heroIds[i])
            if ((bagHero.extInfo as icmsg.HeroInfo).star >= 3) {
                isTip = true
                break
            }
        }

        if (isTip) {
            GlobalUtil.openAskPanel({
                title: gdk.i18n.t("i18n:TIP_TITLE"),
                descText: `${gdk.i18n.t("i18n:LOTTERY_TIP24")}\n${gdk.i18n.t("i18n:LOTTERY_TIP25")}`,
                sureText: gdk.i18n.t("i18n:OK"),
                closeText: gdk.i18n.t("i18n:CANCEL"),
                sureCb: () => {
                    this.doDecompose()
                }
            })
        } else {
            this.doDecompose()
        }
    }

    doDecompose() {
        let msg = new icmsg.HeroDecomposeReq()
        msg.heroIds = this._heroIds
        NetManager.send(msg, (data: icmsg.HeroDecomposeRsp) => {
            this._heroIds = []
            GlobalUtil.openRewadrView(data.goodsList)
        })
    }

    /**
     * 一键分解全部1星,2星
     */
    oneKeyToDecompose() {
        let model = ModelManager.get(HeroModel);
        let upList = model.curUpHeroList(0).concat(model.curUpHeroList(1)).concat(model.curUpHeroList(2));

        let mercenaryModel = ModelManager.get(MercenaryModel)
        let m_list = mercenaryModel.lentHeroList
        let mercenaryIds = []
        m_list.forEach(element => {
            mercenaryIds.push(element.heroId)
        });

        let cb = () => {
            let heroIds: number[] = [];
            let oneStar: number[] = [];
            let twoStar: any = {}; //group - ids[]
            let limitTwoStar: any = {}; //group -ids[]  lock inUplist
            model.heroInfos.forEach(info => {
                let heroInfo = <icmsg.HeroInfo>info.extInfo;
                if ([1, 2].indexOf(heroInfo.star) !== -1) {
                    if (upList.indexOf(heroInfo.heroId) == -1 &&
                        mercenaryIds.indexOf(heroInfo.heroId) == -1 &&
                        !heroInfo.switchFlag) {
                        // [oneStar, twoStar][heroInfo.star - 1].push(heroInfo.heroId);
                        if (heroInfo.star == 1) {
                            oneStar.push(heroInfo.heroId);
                        }
                        else {
                            let group = ConfigManager.getItemById(HeroCfg, heroInfo.typeId).group[0];
                            if (!twoStar[group]) twoStar[group] = [];
                            twoStar[group].push(heroInfo.heroId);
                        }
                    }
                    else {
                        if (heroInfo.star == 2) {
                            let group = ConfigManager.getItemById(HeroCfg, heroInfo.typeId).group[0];
                            if (!limitTwoStar[group]) limitTwoStar[group] = [];
                            limitTwoStar[group].push(heroInfo.heroId);
                        }
                    }
                }
            });
            heroIds.push(...oneStar);
            for (let key in twoStar) {
                let ids: number[] = twoStar[key];
                let limitIds: number[] = limitTwoStar[key] || [];
                if (limitIds.length + ids.length > 10) {
                    let leftIdx = Math.max(0, 10 - limitIds.length);
                    heroIds.push(...ids.slice(leftIdx));
                }
            }

            if (heroIds.length <= 0) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:LOTTERY_TIP26"));
                return;
            }
            else {
                let msg = new icmsg.HeroDecomposeReq()
                msg.heroIds = heroIds
                NetManager.send(msg, (data: icmsg.HeroDecomposeRsp) => {
                    this._heroIds = []
                    GlobalUtil.openRewadrView(data.goodsList)
                })
            }
        };

        GlobalUtil.openAskPanel({
            descText: `${gdk.i18n.t("i18n:LOTTERY_TIP27")}`,
            sureCb: cb,
        });
    }


    quickPutFunc() {

        let model = ModelManager.get(HeroModel);
        let upList = model.curUpHeroList(0).concat(model.curUpHeroList(1)).concat(model.curUpHeroList(2));

        let mercenaryModel = ModelManager.get(MercenaryModel)
        let m_list = mercenaryModel.lentHeroList
        let mercenaryIds = []
        m_list.forEach(element => {
            mercenaryIds.push(element.heroId)
        });

        for (let i = 0; i < this.list.datas.length; i++) {
            if (this._heroIds.length >= this._maxNum) {
                break
            }
            let info = this.list.datas[i].extInfo as icmsg.HeroInfo
            if (this._heroIds.indexOf(info.heroId) == -1 && info.star <= 2
                && upList.indexOf(info.heroId) == -1
                && mercenaryIds.indexOf(info.heroId) == -1
                && !info.switchFlag) {
                this._heroIds.push(info.heroId)
                this.list.datas[i].selected = true
            }
        }
        if (this._heroIds.length == 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:LOTTERY_TIP28"))
            return
        }

        this.list.refresh_items()

        if (this._heroIds.length < this._maxNum) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:LOTTERY_TIP28"))
        }
        let msg = new icmsg.HeroResetPreviewReq()
        msg.heroId = this._heroIds
        NetManager.send(msg)
    }
}