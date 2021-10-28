import BagModel, { BagItem, BagType } from '../../../common/models/BagModel';
import BagUtils from '../../../common/utils/BagUtils';
import BYModel, { EnergyStoneInfo } from '../../bingying/model/BYModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import CostumeModel from '../../../common/models/CostumeModel';
import CostumeSuitTypeCtrl from '../../role/ctrl2/costume/CostumeSuitTypeCtrl';
import EquipModel from '../../../common/models/EquipModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuardianModel from '../../role/model/GuardianModel';
import HeroModel from '../../../common/models/HeroModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import MainSceneModel from '../../../scenes/main/model/MainSceneModel';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RedPointUtils, { RedPointEvent } from '../../../common/utils/RedPointUtils';
import RoleModel from '../../../common/models/RoleModel';
import RuneModel from '../../../common/models/RuneModel';
import { BagEvent } from '../enum/BagEvent';
import {
    CostumeCfg,
    GlobalCfg,
    ItemCfg,
    RuneCfg,
    Tech_stoneCfg
    } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { RoleEventId } from '../../role/enum/RoleEventId';

/** 
 * 背包界面
 * @Author: weiliang.huang  
 * @Description: 
 * @Date: 2019-03-19 16:45:57 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-12 10:08:22
 */
const { ccclass, property, menu } = cc._decorator;

type GridInfo = {
    index: number,
    sortNum?: number,
    info: BagItem,
    color?: number,
}
/**按钮下标对应的物品类型,-1为任意数据 */
const _typeIndex = [-1, BagType.EQUIP, BagType.RUNE, BagType.COSTUME, BagType.ITEM, BagType.GUARDIANEQUIP, BagType.ENERGSTONE, BagType.UNIQUEEQUIP]
@ccclass
@menu("qszc/view/bag/BagViewCtrl")
export default class BagViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    bagItem: cc.Prefab = null;

    @property(cc.Label)
    numLab: cc.Label = null;

    @property(cc.Label)
    numMaxLab: cc.Label = null;

    @property(cc.Node)
    compoundBtn: cc.Node = null;

    @property(cc.Node)
    runeDecomposeBtn: cc.Node = null;

    @property(cc.Node)
    runeMenu: cc.Node = null;

    @property([cc.Button])
    runeTypeBtns: cc.Button[] = [];

    @property(cc.Node)
    runeScoreNode: cc.Node = null;

    @property(cc.Node)
    costumeTabMenu: cc.Node = null;

    @property(cc.Node)
    contentUp: cc.Node = null

    @property(cc.Node)
    btnUp: cc.Node = null

    @property(cc.Button)
    suitBtns: cc.Button[] = []

    @property(cc.Button)
    careerBtns: cc.Button[] = []

    @property(cc.Button)
    menuBtns: cc.Button[] = []

    @property(cc.Node)
    guardianEqScoreNode: cc.Node = null;


    private infoList: Array<GridInfo> = []
    private list: ListView = null;
    curIndex: number = -1
    ifInit: boolean = false
    startTime: number = 0
    selectRuneType: number = 0;

    isShowUp = false
    _selectSuitType: number = 0
    _selectCareer: number = 0

    get bagModel(): BagModel { return ModelManager.get(BagModel); }
    get equipModel(): EquipModel { return ModelManager.get(EquipModel); }
    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }
    get mainModel(): MainSceneModel { return ModelManager.get(MainSceneModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get runeModel(): RuneModel { return ModelManager.get(RuneModel); }
    get costumeModel(): CostumeModel { return ModelManager.get(CostumeModel); }
    systemIds = [0, 0, 0, 0, 0, 2897, 0, 2956]
    onLoad() {
        this.startTime = Date.now()
        //this.title = "i18n:BAG_TITLE"
        this.initMenuBtnState();
        this.selectType(null, 0)
    }

    start() {
        console.log("pastTime start", Date.now() - this.startTime)
    }

    onEnable() {
        gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this._updateBagItem, this)
        gdk.e.on(RoleEventId.UPDATE_EQUIP_LIST, this._updateBagItem, this)
        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateOneItem, this)
        gdk.e.on(RoleEventId.RSP_EQUIP_OFF, this._equipOff, this)
        gdk.e.on(RoleEventId.UPDATE_ONE_EQUIP, this._updateOneItem, this)
        gdk.e.on(BagEvent.REMOVE_ITEM, this._removeOneItem, this)
        gdk.e.on(RoleEventId.REMOVE_ONE_EQUIP, this._removeOneItem, this)
        gdk.e.on(RoleEventId.UPDATE_UNIQUEEQUIP_LIST, this._updateBagItem, this)

        // GlobalUtil.updateMainSelect(MainSelectType.BAG, 1)
        // 背包的红点状态置为 true
        // RedPointUtils.save_state('bag_item', true)
        gdk.e.on(RedPointEvent.RED_POINT_STATUS_UPDATE, this._redPointUpdate, this);
        if (this.bagModel.tipsRecordItem) {
            GlobalUtil.openItemTips(this.bagModel.tipsRecordItem, false, false, this.resId)
            this.bagModel.tipsRecordItem = null
        }
        this._updateDataLater()
    }

    onDisable() {
        // GlobalUtil.updateMainSelect(MainSelectType.BAG, 0)
        // 清除物品相关的红点状态
        // RedPointUtils.save_state('bag_item_type_101', false)
        // RedPointUtils.save_state('bag_item_type_2', false)
        // RedPointUtils.save_state('bag_item_type_4', false)
        // RedPointUtils.save_state('bag_item_type_1', false)
        // this.bagModel.bagItems.forEach(item => {
        // RedPointUtils.save_state('bag_item_' + item.itemId, false)
        // })
        gdk.e.targetOff(this)
    }

    _redPointUpdate() {
        let temp = RedPointUtils.temp
        let count = 0
        let giftKey = "bag_item_type_101"
        for (let key in temp) {
            if (key.indexOf("bag_item_") != -1) {
                count++
            }
        }
        //取消标签红点
        if (count == 1) {
            if (temp[giftKey]) {
                RedPointUtils.save_state(giftKey, false)
            }
        }
    }

    onDestroy() {
        this.list.destroy()
    }

    initMenuBtnState() {
        this.menuBtns.forEach((btn, idx) => {
            let systemId = this.systemIds[idx];
            if (systemId > 0) {
                if (JumpUtils.ifSysOpen(systemId)) {
                    btn.node.active = true;
                } else {
                    btn.node.active = false;
                }
            } else {
                btn.node.active = true;
            }
        });
    }
    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.bagItem,
            cb_host: this,
            resize_cb: this._updateDataLater,
            column: 5,
            gap_x: 10,
            gap_y: 5,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    _updateDataLater(v: any = null, resetPos: boolean = true) {
        gdk.Timer.callLater(this, this._updateData, [v, resetPos])
    }

    /**初始化,或者背包数据有新增/重新排序时,用该方法刷新背包 */
    _updateData(v: any = null, resetPos: boolean = true) {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        this.ifInit = true
        let bagItems = this.bagModel.bagItems
        let equipItems = this.equipModel.equipItems
        let runeItems = [...this.runeModel.runeInHeros, ...this.runeModel.runeItems]
        let costumeItems = [...this.costumeModel.costumeInHeros, ...this.costumeModel.costumeItems]
        let guardianEquipItem = ModelManager.get(GuardianModel).equipItems
        let energStoneItem = [...ModelManager.get(BYModel).energStoneInSlot, ...ModelManager.get(BYModel).energStoneInBag];
        let uniEquipItems = this.equipModel.uniqueEquipItems
        this.infoList = [];
        let list = []
        let curType = _typeIndex[this.curIndex]
        this.compoundBtn.active = false;
        this.runeDecomposeBtn.active = false;
        this.runeMenu.active = false;
        this.costumeTabMenu.active = false
        // 背包分类显示逻辑
        switch (this.curIndex) {
            case 0:
                list = [...bagItems, ...equipItems, ...runeItems, ...costumeItems, ...guardianEquipItem, ...uniEquipItems]
                break

            case 1:
                list = [...equipItems]
                break
            case 2:
                if (this.selectRuneType == 0) {
                    list = [...runeItems]
                }
                else {
                    [...runeItems].forEach(item => {
                        let cfg = ConfigManager.getItemById(RuneCfg, parseInt(item.itemId.toString().slice(0, 6)));
                        if (cfg.color == this.selectRuneType) {
                            list.push(item);
                        }
                    });
                }
                this.runeMenu.active = true;
                this.runeDecomposeBtn.active = true;
                break;
            case 3:
                this.costumeTabMenu.active = true
                this.runeDecomposeBtn.active = true
                list = this._updataCostumeDatas()
                this._updteSuitBtns()
                break
            case 5:
                list = [...guardianEquipItem];
                this.runeDecomposeBtn.active = true
                break
            case 6:
                if (this.selectRuneType == 0) {
                    list = [...energStoneItem]
                } else {
                    [...energStoneItem].forEach(item => {
                        let cfg = ConfigManager.getItemById(Tech_stoneCfg, item.itemId);
                        if (cfg.color == this.selectRuneType) {
                            list.push(item);
                        }
                    });
                }
                this.runeMenu.active = true;
                this.runeDecomposeBtn.active = true
                break;
            case 7:
                list = [...uniEquipItems]
                this.runeDecomposeBtn.active = true;
                break
            default:
                for (let index = 0; index < bagItems.length; index++) {
                    const bagItem = bagItems[index];
                    if (bagItem.type == BagType.ITEM) {
                        let cfg = ConfigManager.getItemById(ItemCfg, bagItem.itemId)
                        if (!cfg) {
                            cc.error("背包物品 未找到配置表数据 itemId =", bagItem.itemId)
                            continue;
                        }
                        // 除了礼包以外的道具均归为其它
                        if (cfg.func_id != "add_drop_items" && cfg.func_id != "choose_drop_item") {
                            list.push(bagItem)
                        }
                    }
                }
                break;
        }
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            let sortNum = this._getItemSortNum(element)
            let itemId = element.type == BagType.RUNE ? parseInt(element.itemId.toString().slice(0, 6)) : element.itemId;
            let cfg = BagUtils.getConfigById(itemId)
            if (!cfg) {
                cc.error("背包物品 未找到配置表数据 itemId =", element.itemId)
                continue;
            }
            let item: GridInfo = { index: index, sortNum: sortNum, color: cfg.defaultColor || cfg.color, info: element }
            this.infoList.push(item)
        }
        GlobalUtil.sortArray(this.infoList, this._bagSortFunc)
        let cfg = ConfigManager.getItemById(GlobalCfg, "bag_max");
        let curNum = bagItems.length + equipItems.length + runeItems.length;
        this.numLab.string = `${curNum}`;
        this.numMaxLab.string = `/${cfg.value[0]}`;
        let contentSize = this.numLab.node.getContentSize();
        let position = this.numLab.node.getPosition();
        position.x += contentSize.width;
        this.numMaxLab.node.setPosition(position);

        this._initListView()
        this._fullList()
        this.list.set_data(this.infoList, resetPos)
    }

    _bagSortFunc(a: GridInfo, b: GridInfo) {
        if (a.sortNum != b.sortNum) {
            return a.sortNum - b.sortNum
        }
        if (a.color != b.color) {
            return b.color - a.color
        }
        return b.info.itemId - a.info.itemId
    }

    /**补齐背包数据,补满一列 
     * 并且保证显示满一个背包
    */
    _fullList() {
        let len = this.infoList.length
        let row = Math.ceil(len / 5)
        if (row < 7) {
            row = row + 7
            row = Math.min(row, 7);
        }
        let nullRow = Math.ceil(this.scrollView.node.height / 130)
        row = Math.max(row, nullRow);
        let maxNum = row * 5

        for (let index = this.infoList.length; index < maxNum; index++) {
            let item: GridInfo = { index: index, info: null }
            this.infoList.push(item)
        }
    }

    /**更新背包数据, 这里不走bindIng接口,是为了刷新数据时,不重置位置*/
    _updateBagItem(e: gdk.Event) {
        let uType = e.data  // 更新类型
        let needUpdate = false
        let curType = _typeIndex[this.curIndex]
        if (curType < 0 || curType == uType) {
            needUpdate = true
        }
        if (needUpdate) {
            this._updateDataLater(null, false)
        }
        this.updateRuneScore();
    }

    /**更新单项背包数据 */
    _updateOneItem(e: gdk.Event) {
        let item: BagItem = e.data
        for (let index = 0; index < this.infoList.length; index++) {
            let listData = this.infoList[index]
            const info: BagItem = listData.info;
            if (info && info.series == item.series) {
                listData.info = item
                this.list.refresh_item(index, listData)
                break
            }
        }
        this.updateRuneScore();
    }

    /**装备脱下 */
    _equipOff(e: gdk.Event) {
        let equipId = e.data.equipId
        for (let index = 0; index < this.infoList.length; index++) {
            let listData = this.infoList[index]
            const info: BagItem = listData.info;
            if (info && info.series == equipId) {
                let extInfo = <icmsg.EquipInfo>info.extInfo
                // extInfo.heroId = 0
                this.list.refresh_item(index, listData)
                break
            }
        }
    }

    /**选择页签, 筛选任务类型*/
    selectType(e, utype) {
        utype = parseInt(utype)
        this.curIndex = utype
        for (let idx = 0; idx < this.menuBtns.length; idx++) {
            const element = this.menuBtns[idx]
            element.interactable = idx != utype
            let select = element.node.getChildByName("select");
            select.active = idx == utype
            let common = element.node.getChildByName("normal");
            common.active = idx != utype
        }
        // for (let idx = 0; idx < this.selectBtns.length; idx++) {
        //     const element = this.selectBtns[idx];
        //     element.interactable = idx != this.curIndex
        //     let lab = element.node.getChildByName("Label")
        //     let color = "#c8b89d"
        //     if (idx == this.curIndex) {
        //         color = "#ffeb91"
        //     }
        //     lab.color = cc.color(color)
        // }
        // if (!this.ifInit) {
        //     return
        // }
        this.updateRuneScore();
        this._updateDataLater()
    }

    /**删除一个背包数据 */
    _removeOneItem(e: gdk.Event) {
        let series = e.data
        let len = this.infoList.length
        for (let index = 0; index < this.infoList.length; index++) {
            const info: BagItem = this.infoList[index].info;
            if (info && info.series == series) {
                this.list.remove_data(index)
                let item: GridInfo = { index: index, info: null }
                this.list.insert_data(len - 1, item)
                break
            }
        }
    }

    /**获取物品排序序号 */
    _getItemSortNum(item: BagItem): number {
        let sortNum = 6
        if (item.type == BagType.EQUIP) {
            sortNum = 2
        } else if (item.type == BagType.RUNE && (<icmsg.RuneInfo>item.extInfo).heroId) {
            sortNum = 4
        } else if (item.type == BagType.ENERGSTONE && (<EnergyStoneInfo>item.extInfo).slot >= 0) {
            sortNum = 5
        } else if (item.type == BagType.JEWEL) {
            sortNum = 3
        } else if (item.type == BagType.UNIQUEEQUIP) {
            sortNum = 7
        }
        else {
            // 礼包级别最高
            let cfg = ConfigManager.getItemById(ItemCfg, item.itemId)
            if (cfg && (cfg.func_id == "add_drop_items" || cfg.func_id == "choose_drop_item")) {
                sortNum = 1
            }
        }
        return sortNum
    }

    openRuneDecomposeFunc() {
        if (this.curIndex == 2) {
            gdk.panel.setArgs(PanelId.HeroResetView, 2);
            gdk.panel.open(PanelId.HeroResetView);
        } else if (this.curIndex == 3) {
            if (!JumpUtils.ifSysOpen(2866, true)) {
                return;
            }
            gdk.panel.setArgs(PanelId.HeroResetView, 3);
            gdk.panel.open(PanelId.HeroResetView);
        } else if (this.curIndex == 5) {
            if (!JumpUtils.ifSysOpen(2904, true)) {
                return;
            }
            gdk.panel.setArgs(PanelId.HeroResetView, 6);
            gdk.panel.open(PanelId.HeroResetView);
        } else if (this.curIndex == 6) {
            //能量石
            if (!JumpUtils.ifSysOpen(2931, true)) {
                return;
            }
            gdk.panel.setArgs(PanelId.HeroResetView, 8);
            gdk.panel.open(PanelId.HeroResetView);
        } else if (this.curIndex == 7) {
            //专属装备
            if (!JumpUtils.ifSysOpen(2956, true)) {
                return;
            }
            gdk.panel.setArgs(PanelId.HeroResetView, 11);
            gdk.panel.open(PanelId.HeroResetView);
        }
    }

    openDecomposeFunc() {
        gdk.panel.open(PanelId.Decompose)
    }

    openCompoundFunc() {
        gdk.panel.open(PanelId.BatchCompound)
    }

    /**选择页签, 筛选阵营*/
    selectGroupFunc(e, utype) {
        this.selectRuneType = parseInt(utype)
        for (let idx = 0; idx < this.runeTypeBtns.length; idx++) {
            const element = this.runeTypeBtns[idx];
            let nodeName = element.name
            let group = parseInt(nodeName.substring('group'.length));
            element.interactable = group != this.selectRuneType
            let select = element.node.getChildByName("select")
            select.active = group == this.selectRuneType
        }
        gdk.Timer.callLater(this, this._updateData, [null, true])
    }

    updateRuneScore() {
        if ([0, 3].indexOf(this.curIndex) !== -1) {
            this.runeScoreNode.active = true;
            this.runeScoreNode.getChildByName('number').getComponent(cc.Label).string = `${GlobalUtil.numberToStr2(BagUtils.getItemNumById(110010), true)}`;
        }
        else {
            this.runeScoreNode.active = false;
        }

        if (this.curIndex == 5) {
            this.guardianEqScoreNode.active = true;
            this.guardianEqScoreNode.getChildByName('number').getComponent(cc.Label).string = `${GlobalUtil.numberToStr2(BagUtils.getItemNumById(140024), true)}`;
        }
        else {
            this.guardianEqScoreNode.active = false;
        }

    }

    onRuneScoreBtnClick() {
        JumpUtils.openView(716);
    }

    onGuardianEqScoreBtnClick() {
        //JumpUtils.openView(716);
        GlobalUtil.openGainWayTips(140024);
    }

    _updteSuitBtns() {
        for (let i = 0; i < this.suitBtns.length; i++) {
            let ctrl = this.suitBtns[i].node.getComponent(CostumeSuitTypeCtrl)
            ctrl.updateTotalViewInfo(i)
        }
    }

    showCareerContent() {
        this.isShowUp = true
        this.updateContentState()
    }

    hideCareerContent() {
        this.isShowUp = false
        this.updateContentState()
    }

    updateContentState() {
        if (this.isShowUp) {
            this.contentUp.active = true
            this.btnUp.active = false
        } else {
            this.contentUp.active = false
            this.btnUp.active = true
        }
    }

    /**选择页签, 筛选职业*/
    selectSuitFunc(e, utype) {
        this._selectSuitType = parseInt(utype)
        for (let idx = 0; idx < this.suitBtns.length; idx++) {
            const element = this.suitBtns[idx];
            element.interactable = idx != this._selectSuitType
            let select = element.node.getChildByName("select")
            select.active = idx == this._selectSuitType
        }
        gdk.Timer.callLater(this, this._updateData, [null, true])
    }

    /**选择页签, 筛选职业*/
    selectCareerFunc(e, utype) {
        this._selectCareer = parseInt(utype)
        for (let idx = 0; idx < this.careerBtns.length; idx++) {
            const element = this.careerBtns[idx];
            element.interactable = idx != this._selectCareer
            let select = element.node.getChildByName("select")
            select.active = idx == this._selectCareer
        }
        gdk.Timer.callLater(this, this._updateData, [null, true])
    }

    _updataCostumeDatas() {
        let costumeItems = [...this.costumeModel.costumeInHeros, ...this.costumeModel.costumeItems]
        let s_datas = []
        if (this._selectSuitType != 0) {
            costumeItems.forEach(element => {
                let cfg = ConfigManager.getItemById(CostumeCfg, element.itemId)
                if (cfg.type == this._selectSuitType) {
                    s_datas.push(element)
                }
            });
        } else {
            s_datas = costumeItems
        }
        if (this._selectCareer != 0) {
            let c_datas = []
            s_datas.forEach(element => {
                let cfg = ConfigManager.getItemById(CostumeCfg, element.itemId)
                if (cfg.career_type == this._selectCareer) {
                    c_datas.push(element)
                }
            });
            s_datas = c_datas
        }
        return s_datas
    }
}
