import ArenaModel from '../../../../common/models/ArenaModel';
import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import GuildModel from '../../model/GuildModel';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import PveSceneCtrl from '../../../pve/ctrl/PveSceneCtrl';
import RoleHeroItemCtrl2 from '../../../role/ctrl2/selector/RoleHeroItemCtrl2';
import StringUtils from '../../../../common/utils/StringUtils';
import { BagItem } from '../../../../common/models/BagModel';
import {
    Copy_gateConditionCfg,
    Copy_stageCfg,
    Copy_towerhaloCfg,
    Copy_towerlistCfg,
    Guildpower_boss_hpCfg,
    Guildpower_bossCfg,
    Guildpower_globalCfg,
    Hero_awakeCfg,
    Hero_careerCfg,
    HeroCfg,
    SystemCfg
    } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RoleEventId } from '../../../role/enum/RoleEventId';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-24 20:51:03
 */
const { ccclass, property, menu } = cc._decorator;


class GataConditionData {
    cfg: Copy_gateConditionCfg;
    curData: number;
    limitData: number;
    state: boolean;
}


@ccclass
@menu("qszc/view/guild/power/GuildPowerSetUpHeroSelectorCtrl")
export default class GuildPowerSetUpHeroSelectorCtrl extends gdk.BasePanel {

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

    @property(cc.Label)
    upHeroPower: cc.Label = null;

    @property(cc.Label)
    addPower: cc.Label = null;

    @property(cc.Node)
    upHero1Node: cc.Node = null;
    @property([cc.Node])
    upHero1List: cc.Node[] = []

    @property(cc.RichText)
    fightLab: cc.RichText = null;

    @property(cc.Node)
    attack: cc.Node = null;

    @property(cc.Node)
    conditionNode: cc.Node = null;
    @property(cc.Node)
    leftBg: cc.Node = null;
    @property(cc.Node)
    rightBg: cc.Node = null;
    @property(cc.Node)
    conditionBgNode: cc.Node = null;
    @property([cc.RichText])
    conditionLbs: cc.RichText[] = [];

    @property([cc.Node])
    star1Nodes: cc.Node[] = [];
    @property([cc.Node])
    star2Nodes: cc.Node[] = [];


    list: ListView = null
    selectGroup: number = 0     // 筛选阵营
    selectCareer: number = 0    //筛选职业
    isShowCareer: boolean = false
    get model(): HeroModel { return ModelManager.get(HeroModel); }
    //get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get copyModel(): CopyModel { return ModelManager.get(CopyModel); }
    get arenaModel(): ArenaModel { return ModelManager.get(ArenaModel); }
    curIndex: number = -1;

    copyCfg: Copy_towerlistCfg;

    tempList: BagItem[] = []; //所有英雄的临时数据(区分后的)
    datas: BagItem[] = []; //所有英雄的临时数据
    selectHeros: number[] = []
    selectHeroInfos: BagItem[] = []
    selectHeroItemIds: number[] = []

    addCfgs: Copy_towerhaloCfg[] = [];
    lastAlive: boolean = false;

    moveNode: cc.Node;
    playerId: number;
    defender: icmsg.ArenaPlayer;
    //当前上阵的位置
    upHeroIndex: number = -1;
    bossCfg: Guildpower_bossCfg;
    cfgHeroId: number[] = [];

    sceneCtrl: PveSceneCtrl;

    _heroNum: number = 0//可上阵英雄数量
    DataList: GataConditionData[] = []
    _upHeroGatherStar: number = 0//上阵英雄位图 累积
    _realTotalPower: number = 0//未加成的英雄战力

    get guildModel() { return ModelManager.get(GuildModel); }

    onEnable() {
        this.upHeroIndex = -1;
        let tems = ConfigManager.getItems(Copy_towerlistCfg, (item: Copy_towerlistCfg) => {
            if (item.general_lv <= this.copyModel.lastCompleteStageId) {
                return true;
            }
            return false
        })
        this._heroNum = ConfigManager.getItemById(Guildpower_globalCfg, "hero_number").value[0]

        let view = gdk.gui.getCurrentView();
        this.sceneCtrl = view.getComponent(PveSceneCtrl);
        this.curIndex = 0;
        this.copyCfg = tems[tems.length - 1];
        this.datas = this.model.heroInfos.concat();
        this.datas.sort(this.sortFunc1);

        gdk.e.on(RoleEventId.UPDATE_HERO_LIST, this._updateScroll, this);
        gdk.e.on(RoleEventId.REMOVE_ONE_HERO, this._updateScroll, this);
        gdk.e.on(RoleEventId.UPDATE_ONE_HERO, this._updateScroll, this);

        this.selectGroupFunc(null, 0)
        this.selectCareerFunc(null, 0)
        this.updateContentState()
        let arg = gdk.panel.getArgs(PanelId.GuildPowerSetUpHeroSelector);
        if (arg) {
            this.bossCfg = arg[0];
        }
        this.initConditionData();
        this.pageSelect(null, 0);

    }

    onDisable() {
        gdk.Timer.clearAll(this)
        gdk.e.targetOff(this);
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        this.cfgHeroId = []
    }

    close() {
        super.close();
    }

    //显示关卡通关条件
    initConditionData() {
        for (let i = 0; i < this.conditionLbs.length; i++) {
            if (i < this.bossCfg.gateconditionList.length) {
                let gcfg = ConfigManager.getItemById(Copy_gateConditionCfg, this.bossCfg.gateconditionList[i]);
                this.conditionLbs[i].string = gcfg.des;
            } else {
                this.conditionLbs[i].node.active = false
            }
        }
        gdk.Timer.once(80, this, () => {
            this.leftBg.height = this.conditionBgNode.height + 18;
            this.rightBg.height = this.conditionBgNode.height + 18;
        })
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

        this.list.clear_items();
        let scollData = []
        this.model.selectHeros = [];
        this.tempList.forEach(info => {
            this.model.selectHeros.push({
                data: info,
            })
            let index = this.selectHeros.indexOf(info.series);
            let idx = this.selectHeroItemIds.indexOf(info.itemId);
            let isSelect = idx >= 0;
            let isHero = index >= 0;
            scollData.push({ data: info, isSelect: isSelect, isHero: isHero })
        })
        this.list.set_data(scollData);
    }


    initUpHeroData() {
        let heros = []
        if (this.guildModel.heroOn.length > 0) {
            heros = this.guildModel.heroOn
        }
        // else {
        //     heros = GlobalUtil.getLocal(this.LocalStr) || []
        // }
        this.selectHeros = heros

        for (let i = 0; i < this._heroNum; i++) {
            this.selectHeroInfos[i] = null;
            this.selectHeroItemIds[i] = -1;
        }
        if (!this.selectHeros || this.selectHeros.length == 0) {
            this.selectHeros = []
            for (let i = 0; i < this._heroNum; i++) {
                this.selectHeros[i] = 0;
            }

        }
        this.datas.forEach(info => {
            let index = this.selectHeros.indexOf(info.series)
            if (index >= 0) {
                this.selectHeroInfos[index] = info;
                this.selectHeroItemIds[index] = info.itemId;
            }
        })

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


    refreshTopInfo() {
        //数据排序 上阵英雄>战力>星星>id
        let temList: BagItem[] = [];
        this.selectHeroInfos.forEach(info => {
            if (info) {
                let index = this.datas.indexOf(info);
                if (index >= 0) {
                    let tem = this.datas.splice(index, 1);
                    temList = temList.concat(tem);
                }
            }
        });
        temList.sort(this.sortFunc1)
        this.datas = temList.concat(this.datas);

        let list = this.upHero1List;
        this._realTotalPower = 0
        let temHeroId = []
        let hasHeroNum = 0
        for (let i = 0; i < list.length; i++) {
            let heroItem = list[i];
            if (i >= this._heroNum) {
                heroItem.active = false
                continue
            }
            let add = heroItem.getChildByName('add');
            let roleHeroItem = heroItem.getChildByName('RoleHeroItem');
            let lock = heroItem.getChildByName('lock');
            add.active = false;
            lock.active = false;
            roleHeroItem.active = false

            if (this.selectHeroInfos[i] == null) {
                add.active = true;
            } else {
                roleHeroItem.active = true;
                let ctrl = roleHeroItem.getComponent(RoleHeroItemCtrl2);
                ctrl.data = { data: this.selectHeroInfos[i], heros: this.selectHeroItemIds }
                ctrl.updateView();
                let tem = <icmsg.HeroInfo>this.selectHeroInfos[i].extInfo;
                this._realTotalPower += tem.power;
                hasHeroNum += 1
            }
        }

        cc.log("#######英雄总战力:" + this._realTotalPower)

        //上阵英雄出现在未解锁的位置容错处理
        if (temHeroId.length > 0) {
            //cc.log('上阵英雄出现在未解锁的位置')
            let temZoreIndex = []
            this.selectHeros.forEach((id, i) => {
                if (id <= 0) {
                    temZoreIndex.push(i);
                }
            })
            if (temZoreIndex.length > 0) {
                for (let i = 0; i < temZoreIndex.length; i++) {
                    let zeroIndex = temZoreIndex[0];
                    if (i < temHeroId.length) {
                        let temIndex = temHeroId[i];
                        this.selectHeros[zeroIndex] = this.selectHeros[temIndex];
                        this.selectHeroInfos[zeroIndex] = this.selectHeroInfos[temIndex];
                        this.selectHeroItemIds[zeroIndex] = this.selectHeroItemIds[temIndex];
                        this.selectHeros[temIndex] = 0;
                        this.selectHeroInfos[temIndex] = null;
                        this.selectHeroItemIds[temIndex] = 0;
                    }
                }
                this.refreshTopInfo();
                return;
            }
        }

        this.updatePower()
        this.fightLab.string = StringUtils.setRichtOutLine(`上阵${this._heroNum}名英雄 <color=#f6e707>${hasHeroNum}/${this._heroNum}</c>`, "#27160a", 2)
        this.updateGateConditions()
    }


    @gdk.binding("guildModel.playerPower")
    updatePower() {
        this.upHeroPower.string = `${this.guildModel.playerPower}`
        let addNum = this.guildModel.playerPower - this._realTotalPower
        this.addPower.string = addNum > 0 ? `+${addNum}` : ''
    }

    downHero(e: Event, index) {
        //处于引导时不能下阵
        let guideCfg = GuideUtil.getCurGuide();
        if (guideCfg && guideCfg.bindBtnId == 6001) {
            //
            return
        }
        let num = 0;
        this.selectHeros.forEach(id => {
            if (id > 0) {
                num++;
            }
        })
        let i = parseInt(index);
        let list: cc.Node[];
        if (this.curIndex == 0) {
            list = this.upHero1List;
        }
        let temNode = list[i];
        let roleHeroItem = temNode.getChildByName('RoleHeroItem');
        if (roleHeroItem.active) {
            let ctrl = roleHeroItem.getComponent(RoleHeroItemCtrl2);
            let temData = <BagItem>ctrl.data.data;
            let idx = this.selectHeros.indexOf(temData.series);
            if (idx >= 0) {
                if (this.curIndex == 0) {
                    this.selectHeros.splice(idx, 1)
                    this.selectHeros.push(0);
                    this.selectHeroInfos.splice(idx, 1)
                    this.selectHeroInfos.push(null);
                    this.selectHeroItemIds.splice(idx, 1)
                    this.selectHeroItemIds.push(-1);
                } else {
                    this.selectHeros[idx] = 0;
                    this.selectHeroInfos[idx] = null;
                    this.selectHeroItemIds[idx] = -1;
                }

            }

            this.upHeroIndex = -1;
            this.refreshTopInfo();
            this._updateDataLater();

            this._gatherHeroReq()
        }
    }


    _selectItem(data: any, index) {
        if (data.isSelect) {
            let temIndex = this.selectHeroInfos.indexOf(data.data);
            if (temIndex >= 0) {
                this.downHero(null, temIndex)
            }
            return;
        }
        let info: BagItem = data.data;

        let i = 0;
        this.selectHeros.forEach(heroId => {
            if (heroId > 0) {
                i++;
            }
        })
        if (i >= this._heroNum) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:HEROTRIAL_SELECT_TIP4"))
            return;
        }

        let temList: cc.Node[]
        if (this.curIndex == 0) {
            temList = this.upHero1List;
        }

        for (let i = 0; i < this.selectHeros.length; i++) {
            if (this.selectHeros[i] <= 0) {
                this.selectHeros[i] = info.series;
                this.selectHeroInfos[i] = info;
                this.selectHeroItemIds[i] = info.itemId;
                this.upHeroIndex = i;
                break;
            }
        }

        this.refreshTopInfo();

        this._updateDataLater()

        this._gatherHeroReq()
    }

    _gatherHeroReq() {
        let msg = new icmsg.GuildGatherHeroOnReq()
        msg.heroOn = this.selectHeros
        msg.star = this._upHeroGatherStar
        NetManager.send(msg, (data: icmsg.GuildGatherHeroOnRsp) => {
            this.guildModel.heroOn = data.heroOn
            this.guildModel.playerPower = data.power
            // //保存在本地
            // GlobalUtil.setLocal(this.LocalStr, this.selectHeros);
        })
    }

    pageSelect(event, index, refresh: boolean = false) {

        //if (this.curIndex == index && !refresh) return;
        this.curIndex = index;
        this.attack.active = true;
        //if (index == 0) {
        this.upHero1Node.active = true;
        //this.upHero2Node.active = false;
        // this.infoBg.height = 270;
        this.scrollView.node.parent.setPosition(cc.v2(0, 80))
        this.scrollView.node.parent.height = 320;

        this.initUpHeroData();
        this.refreshTopInfo();
        this._updateDataLater()
        this.setUpHeroData()
        this.updateGateConditions()

    }

    //一键上阵按钮
    oneKeyUpHero() {
        let temDatas = this.model.heroInfos.concat();
        temDatas.sort(this.sortFunc2);

        let change = false
        //检测是否还有空余位置
        for (let i = 0; i < this.selectHeros.length; i++) {
            let heroId = this.selectHeros[i];
            if (heroId <= 0) {
                for (let k = 0; k < temDatas.length; k++) {
                    let info = temDatas[k]
                    if (this.selectHeroItemIds.indexOf(info.itemId) < 0) {
                        this.selectHeros[i] = info.series;
                        this.selectHeroInfos[i] = info;
                        this.selectHeroItemIds[i] = info.itemId;
                        change = true;
                        break;
                    }
                }
            }
        }

        if (change) {
            let index = 0;
            this.selectHeroItemIds.forEach(id => {
                if (id > 0) {
                    this.upHeroIndex = index;
                }
                index++;
            })
            this.refreshTopInfo();
            this._updateDataLater();

            this._gatherHeroReq()
        }
    }

    attackBtnClick() {
        let count = 0
        for (let i = 0; i < this.selectHeros.length; i++) {
            if (this.selectHeros[i] <= 0) {
                count++
            }
        }
        if (count > 0) {
            gdk.gui.showMessage(`上阵英雄数量必须达到${this._heroNum}`)
            return
        }

        let msg = new icmsg.GuildGatherConfirmReq()
        NetManager.send(msg, (data: icmsg.GuildGatherConfirmRsp) => {
            this.guildModel.playerPower = data.power
            this.guildModel.totalPower = data.totalPower
            this.guildModel.numberCount = data.numberCount
            this.guildModel.powerStar = data.star
            this.guildModel.heroOn = data.heroOn
            this.guildModel.confirm = data.confirm

            gdk.panel.hide(PanelId.GuildPowerSetUpHeroSelector)
        })

    }

    //同阵营英雄个数限制
    groupHeroNumLimit = [];
    //通职业英雄个数限制
    carrerHeroNumLimit = [];
    //特定英雄和指定英雄通关副本
    upHeroLimit = [];
    //英雄星级 限制
    starHeroNumLimit = [];

    // 设置英雄上阵条件
    setUpHeroData() {
        // this.clearData();
        let gateconditionList: number[] = this.bossCfg.gateconditionList || [];
        if (gateconditionList instanceof Array && gateconditionList.length > 0) {
            gateconditionList.forEach(id => {
                let temCfg = ConfigManager.getItemById(Copy_gateConditionCfg, id);
                if (temCfg) {
                    let data = new GataConditionData()
                    data.cfg = temCfg;
                    data.curData = 0;
                    data.limitData = 0;
                    data.state = false;
                    this.DataList.push(data);
                    let index = this.DataList.indexOf(data);
                    switch (temCfg.type) {
                        case 5:
                            this.groupHeroNumLimit.push(index);
                            break;
                        case 6:
                            this.carrerHeroNumLimit.push(index);
                            break;
                        case 7:
                            switch (temCfg.subType) {
                                case 3:
                                    this.upHeroLimit.push(index)
                                    data.limitData = temCfg.data2.length
                                    break;
                            }
                            break;
                        case 8:
                            this.starHeroNumLimit.push(index);
                            break
                    }
                }
            })
        }
    }


    /**
    * 判断通关条件 各个阵营英雄数量和各个职业英雄数量
    */
    updateGateConditions() {
        //判断通关条件 各个阵营英雄数量和各个职业英雄数量
        if (this.DataList.length > 0) {
            let groupData = {};
            let soldierData = {};
            let maxGroup = 0;
            let starData = {}
            let heroList = this.selectHeros//ModelManager.get(HeroModel).curUpHeroList(0)

            heroList.forEach(heroId => {
                let heroInfo = HeroUtils.getHeroInfoByHeroId(heroId);
                if (heroInfo) {
                    let temCfg = <HeroCfg>BagUtils.getConfigById(heroInfo.typeId);
                    if (!groupData[temCfg.group[0] + '']) {
                        groupData[temCfg.group[0] + ''] = 1;
                    } else {
                        groupData[temCfg.group[0] + ''] += 1;
                        if (groupData[temCfg.group[0] + ''] > maxGroup) {
                            maxGroup = groupData[temCfg.group[0] + '']
                        }
                    }
                }
            })
            heroList.forEach(heroId => {
                let heroInfo = HeroUtils.getHeroInfoByHeroId(heroId);
                if (heroInfo) {
                    let soldierType = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', heroInfo.careerId).career_type;
                    if (!soldierData[soldierType + '']) {
                        soldierData[soldierType + ''] = 1;
                    } else {
                        soldierData[soldierType + ''] += 1;
                    }

                    if (!starData[heroInfo.star + '']) {
                        starData[heroInfo.star + ''] = 1;
                    } else {
                        starData[heroInfo.star + ''] += 1;
                    }
                }
            })

            if (this.groupHeroNumLimit.length > 0) {
                this.groupHeroNumLimit.forEach(index => {
                    let data = this.DataList[index];
                    if (data.cfg.data1 == 0) {
                        data.state = maxGroup >= data.cfg.data2;
                    } else {
                        data.state = groupData[data.cfg.data1 + ''] >= data.cfg.data2;
                    }
                })
            }
            if (this.carrerHeroNumLimit.length > 0) {
                this.carrerHeroNumLimit.forEach(index => {
                    let data = this.DataList[index];
                    data.state = soldierData[data.cfg.data1 + ''] >= data.cfg.data2;
                })
            }

            if (this.starHeroNumLimit.length > 0) {
                this.starHeroNumLimit.forEach(index => {
                    let data = this.DataList[index];
                    data.state = false
                    for (let star in starData) {
                        if (star >= data.cfg.data1) {
                            data.state = starData[star + ''] >= data.cfg.data2;
                            break
                        }
                    }
                })
            }

            //指定英雄觉醒玩法上阵指定英雄限制
            if (this.upHeroLimit.length > 0) {
                this.upHeroLimit.forEach(index => {
                    let data = this.DataList[index];
                    data.curData = 0
                    if (data.cfg.data2.length > 0) {
                        data.cfg.data2.forEach(typeId => {
                            heroList.forEach(heroId => {
                                let heroInfo = HeroUtils.getHeroInfoByHeroId(heroId);
                                if (heroInfo) {
                                    let temCfg = <HeroCfg>BagUtils.getConfigById(heroInfo.typeId);
                                    if (typeId == temCfg.id) {
                                        data.curData += 1;
                                    }
                                }
                            })

                        })
                    }
                    data.state = data.curData >= data.limitData;
                })
            }

            //更新星星是否满足条件
            this._upHeroGatherStar = 0
            for (let i = 0; i < this.DataList.length; i++) {
                if (this.conditionLbs[i].node.active) {
                    this.star1Nodes[i].active = this.DataList[i].state
                    if (this.DataList[i].state) {
                        this._upHeroGatherStar += Math.pow(2, i)

                    }
                }
            }
        }
    }
}