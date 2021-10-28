import BYMainViewCtrl from '../../../bingying/ctrl/BYMainViewCtrl';
import BYModel from '../../../bingying/model/BYModel';
import BYViewCtrl from '../../../bingying/ctrl/BYViewCtrl';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import SoldierModel, { SoldierType } from '../../../../common/models/SoldierModel';
import SoldierUtils from '../../../../common/utils/SoldierUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import {
    BarracksCfg,
    Hero_careerCfg,
    SkillCfg,
    Soldier_army_skinCfg,
    SoldierCfg
    } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RoleEventId } from '../../enum/RoleEventId';
import { SoldierEventId } from '../../enum/SoldierEventId';

/**
 * 士兵面板
 * @Author: sthoo.huang
 * @Date: 2020-01-14 17:49:04
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-14 18:02:33
 */
const { ccclass, property, menu } = cc._decorator;

const CfgWKeys = ["hp_w", "atk_w", "def_w"];
const AttGKeys = ["hpG", "atkG", "defG"];
const AttWKeys = ["hpW", "atkW", "defW"];
const AttAKeys = ["addSoldierHp", "addSoldierAtk", "addSoldierDef"];

interface SoldierListItemType {
    heroId: number,
    solId: number,
    color: number,
    type: number,
    isSelect: boolean,
}

@ccclass
@menu("qszc/view/role2/soldier/RoleSoldierCtrl2")
export default class RoleSoldierCtrl2 extends cc.Component {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Prefab)
    soliderItem: cc.Prefab = null;

    @property(cc.Node)
    attNode: cc.Node = null;

    @property(cc.Node)
    skillNode: cc.Node = null;

    @property(cc.Label)
    soldierName: cc.Label = null;

    @property(cc.Node)
    upTitle: cc.Node = null;

    @property(cc.Node)
    upTip: cc.Node = null;

    @property(cc.Label)
    unLockDesc: cc.Label = null;

    @property(cc.RichText)
    skillDescLabs: cc.RichText[] = [];

    @property(cc.Node)
    btnLink: cc.Node = null;

    @property(cc.Node)
    tabBtns: cc.Node[] = [];


    attLab: Array<cc.Label> = [];
    nextLab: Array<cc.Label> = [];
    perLab: Array<cc.Label> = [];

    list: ListView = null;
    curList: Array<any> = [];
    curSelect: number = -1;
    soldierId: number;
    soldierCfg: SoldierCfg

    _isLinkToBy = true//跳转兵营
    selectSoldierId: number = 0
    selectSoldierCareerId: number = 0

    taCareerCfg = []
    selectCareerCfg: Hero_careerCfg = null
    _initIndex = 0
    _curIndex = 0

    activeIds = []//已激活符合当前职业的士兵id
    // careerActiveIds = []//职业激活的士兵
    //scienceActiveIds = []////科技激活的士兵id

    get model() { return ModelManager.get(HeroModel); }
    get soldierModel() { return ModelManager.get(SoldierModel); }
    get byModel() { return ModelManager.get(BYModel); }

    _nameArr = ["机枪兵", "", "炮兵", "守卫"]

    onLoad() {
        // 列表
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.soliderItem,
            cb_host: this,
            async: true,
            column: 4,
            gap_x: -7,
            gap_y: -8,
            direction: ListViewDir.Vertical,
        });
        // 属性文本
        for (let index = 1; index <= 3; index++) {
            let attLab = this.attNode.getChildByName("attLab" + index).getComponent(cc.Label);
            let nextLab = this.attNode.getChildByName("nextLab" + index).getComponent(cc.Label);
            let perLab = this.attNode.getChildByName("perLab" + index).getComponent(cc.Label);
            this.attLab.push(attLab);
            this.nextLab.push(nextLab);
            this.perLab.push(perLab);
        }
    }

    onEnable() {
        this._initTabBtns()
        gdk.e.on(SoldierEventId.RSP_SOLDIER_INFO, this._updateSoldierAttr, this);
        gdk.e.on(RoleEventId.UPDATE_HERO_ATTR, this._refreshListView, this);
        this.list.onClick.on(this._selectItem, this);
        this._updateListData();
    }

    onDisable() {
        this.curSelect = -1;
        this.list.onClick.targetOff(this);
        gdk.e.targetOff(this);
    }

    close() {
        gdk.panel.hide(PanelId.RoleSoldierPanel2)
    }

    _updateListData() {
        let curHero = this.model.curHeroInfo;
        let infoList: SoldierListItemType[] = this.list.datas || [];
        let list = HeroUtils.getHeroSoldiers(curHero.typeId);
        let length = list.length;
        let sIdx = 0;
        for (let i = 0; i < length; i++) {
            let data = infoList[i];
            let sCfg = ConfigManager.getItemById(SoldierCfg, list[i])
            if (data) {
                // 更新旧对象的数据
                data.heroId = curHero.heroId;
                data.solId = list[i];
                data.color = sCfg.color
                data.type = sCfg.type
                data.isSelect = false;
            } else {
                // 创建新的对象
                infoList[i] = {
                    heroId: curHero.heroId,
                    solId: list[i],
                    color: sCfg.color,
                    type: sCfg.type,
                    isSelect: false,
                };
            }
        }
        if (infoList.length != length) {
            infoList.length = length;
        }
        GlobalUtil.sortArray(infoList, (a, b) => {
            return a.solId - b.solId;
        });
        let activeList = []
        let unActiveList1 = []
        let curSoldier = ConfigManager.getItemById(SoldierCfg, curHero.soldierId)
        //已激活符合当前职业的士兵id
        this.activeIds = []
        let b_lv = this.byModel.byLevelsData[curSoldier.type - 1]
        let cfgs = ConfigManager.getItemsByField(BarracksCfg, "type", curSoldier.type)
        for (let i = 0; i < cfgs.length; i++) {
            if (b_lv >= cfgs[i].barracks_lv && cfgs[i].soldier_id && cfgs[i].soldier_id > 0) {
                this.activeIds.push(cfgs[i].soldier_id)
            }
        }
        for (let i = 0; i < infoList.length; i++) {
            if (this.activeIds.indexOf(infoList[i].solId) != -1) {
                activeList.push(infoList[i])
            } else {
                if (infoList[i].type == curSoldier.type) {
                    unActiveList1.push(infoList[i])
                }
            }
        }
        GlobalUtil.sortArray(activeList, (a, b) => {
            if (a.color == b.color) {
                return a.solId - b.solId
            }
            return b.color - a.color
        });

        this.curList = activeList.concat(unActiveList1)

        let showList = []
        for (let i = 0; i < this.curList.length; i++) {
            showList.push({ info: this.curList[i], isActive: this._initIndex == this._curIndex })
        }
        this.list.set_data(showList, false);
        //默认选择使用的
        for (let i = 0; i < showList.length; i++) {
            if (curHero.soldierId == showList[i].info.solId) {
                sIdx = i
                break
            }
        }
        this.scheduleOnce(() => {
            this.list.select_item(sIdx)
            this.updateHeroInfo()
        });
    }

    _refreshListView() {
        this.list.refresh_items()
    }

    _initTabBtns() {
        let ids = this.model.careerInfos[this.model.curHeroInfo.typeId]
        this.taCareerCfg = []
        for (let i = 0; i < this.tabBtns.length; i++) {
            this.tabBtns[i].active = false
            if (ids[i]) {
                this.tabBtns[i].active = true
                let cfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", ids[i])
                this.taCareerCfg.push(cfg)

                let node = this.tabBtns[i]
                let common = node.getChildByName("common")
                let select = node.getChildByName("select")
                let cIcon = common.getChildByName("icon")
                let cLab = common.getChildByName("lab").getComponent(cc.Label)

                let sIcon = select.getChildByName("icon")
                let sLab = select.getChildByName("lab").getComponent(cc.Label)

                GlobalUtil.setSpriteIcon(node, cIcon, GlobalUtil.getSoldierTypeIcon(cfg.career_type))
                GlobalUtil.setSpriteIcon(node, sIcon, GlobalUtil.getSoldierTypeIcon(cfg.career_type))

                cLab.string = cfg.name
                sLab.string = cfg.name
            }
        }
        let curCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.model.curHeroInfo.careerId)
        this._initIndex = 0
        if (curCfg && curCfg.line == 1) {
            this._initIndex = 1
        }
        this.selectCareerType(null, this._initIndex)
    }

    selectCareerType(e, index) {

        if (this.taCareerCfg[index]) {
            this.selectCareerCfg = this.taCareerCfg[index]
        }
        if (e) {

            gdk.gui.showMessage(`转职为${this.selectCareerCfg.name}后可查看`)
            return
        }
        this._curIndex = index
        for (let i = 0; i < this.tabBtns.length; i++) {
            let node = this.tabBtns[i]
            let btn = node.getComponent(cc.Button)
            btn.interactable = index != i
            let select = node.getChildByName("select")
            select.active = index == i
        }
        this._updateListData()
    }

    @gdk.binding("model.curHeroInfo")
    updateHeroInfo() {
        this.curSelect = -1
        let curHero = this.model.curHeroInfo
        let soldiers = this.soldierModel.heroSoldiers
        if (soldiers[curHero.heroId]) {
            this._updateSoldierAttr()
        }
    }

    /**升级后更新当前士兵的属性显示 */
    _updateSoldierAttr() {
        let info: SoldierType = this.soldierModel.heroSoldiers[this.model.curHeroInfo.heroId];
        this.soldierId = info.selectId ? info.selectId : info.curId;
        let sInfo = info.items[this.soldierId];
        if (sInfo) {
            this._updateViewInfo(sInfo, HeroUtils.getHeroAttrById(this.model.curHeroInfo.heroId));
        }
        //更新模型
        this.soldierCfg = ConfigManager.getItemById(SoldierCfg, this.soldierId);
        GlobalUtil.setUiSoldierSpineData(this.node, this.spine, this.soldierCfg.skin, true);
        this.spine.node.scale = this.soldierCfg.size
        this.soldierName.string = `${this.soldierCfg.name}`
        // 更新技能
        this._updateSkillInfo();
        this._updateUpTip()
    }

    _selectItem(data, index) {
        if (this.curSelect == index) {
            return;
        }
        this.curSelect = index
        let info: SoldierType = this.soldierModel.heroSoldiers[this.model.curHeroInfo.heroId]
        if (info) {
            info.selectId = data.info.solId
        }
        this.selectSoldierId = data.info.solId
        //每次点击都请求
        let msg = new icmsg.HeroSoldierInfoReq()
        msg.heroId = data.info.heroId
        msg.soldierId = data.info.solId
        NetManager.send(msg)
    }

    _updateViewInfo(sInfo: icmsg.HeroSoldier, attr: icmsg.HeroAttr) {
        let cfg = ConfigManager.getItemById(SoldierCfg, sInfo.soldierId)
        for (let index = 0; index < 3; index++) {
            const gkey = AttGKeys[index];//_g
            const wkey = AttWKeys[index];//_w
            const akey = AttAKeys[index];
            this.attLab[index].string = sInfo[wkey] ? sInfo[wkey] : cfg[CfgWKeys[index]]; //士兵属性
            this.nextLab[index].string = `+${sInfo[gkey]}`//修正属性 ，科技表相关
            //this.perLab[index].string = `(${Math.floor(attr[akey] / 100)}%)` //英雄和专精加成士兵%属性
        }
    }

    _updateSkillInfo() {
        for (let i = 0; i < 2; i++) {
            let skillInfo = SoldierUtils.getSkillInfo(this.soldierId, i, 1);
            this.skillDescLabs[i].string = skillInfo.skillId > 0 ? StringUtils.setRichtOutLine(skillInfo.desc, "#432208", 2) : `${StringUtils.setRichtOutLine("无", "#432208", 2)}`;
        }

        //
        if (this.model.curHeroInfo.soldierSkin > 0) {
            let cfg = ConfigManager.getItemByField(Soldier_army_skinCfg, 'skin_id', this.model.curHeroInfo.soldierSkin)
            let skillCfg = ConfigManager.getItemByField(SkillCfg, 'skill_id', cfg.skills);
            if (skillCfg) {
                if (this.skillDescLabs[0].string == '<outline color=#432208 width=2>无</outline>') {
                    this.skillDescLabs[0].string = StringUtils.setRichtOutLine(skillCfg.des, "#432208", 2)//skillCfg.des;
                } else {
                    this.skillDescLabs[0].string += '\n' + StringUtils.setRichtOutLine(skillCfg.des, "#432208", 2);
                }
            }
        }
    }

    _updateUpTip() {
        let b_lv = this.byModel.byLevelsData[this.soldierCfg.type - 1]
        let bCfg = ConfigManager.getItemByField(BarracksCfg, "soldier_id", this.soldierCfg.id)
        if (bCfg) {
            if (b_lv >= bCfg.barracks_lv) {
                this.upTip.active = false
            } else {
                this.upTip.active = true
                this.btnLink.active = true
                this.unLockDesc.string = `兵营-${this._nameArr[this.soldierCfg.type - 1]}训练提升至${bCfg.rounds + 1}级解锁`
            }
        } else {
            this.upTip.active = true
            this.btnLink.active = false
            this.unLockDesc.string = '该士兵暂无途径获得'
        }
    }

    /**士兵获得跳转 */
    linkSoldierFunc() {
        this.close()
        // gdk.panel.setArgs(PanelId.BYView, this.soldierCfg.type)
        // gdk.panel.open(PanelId.BYView)
        let type = this.soldierCfg.type
        gdk.panel.open(PanelId.BYMainView, (node: cc.Node) => {
            gdk.Timer.once(100, this, () => {
                let panel = gdk.panel.get(PanelId.BYView)
                if (panel) {
                    let ctrl2 = panel.getComponent(BYViewCtrl)
                    ctrl2.selectByType(true, type - 1)
                }
            })
        })
    }
}
