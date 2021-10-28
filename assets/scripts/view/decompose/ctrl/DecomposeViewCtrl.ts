import BagModel, { BagItem, BagType } from '../../../common/models/BagModel';
import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import EquipModel from '../../../common/models/EquipModel';
import EquipUtils from '../../../common/utils/EquipUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import MainSceneModel from '../../../scenes/main/model/MainSceneModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import { DecomposeEvent } from '../enum/DecomposeEvent';
import {
    GlobalCfg,
    Item_equipCfg,
    Item_rubyCfg,
    ItemCfg
    } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/**
 * 分解界面
 * @Author: luoyong
 * @Description:
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-06 11:05:27
 * @Last Modified time: 2021-01-06 11:07:28
 */
const { ccclass, property, menu } = cc._decorator;

type DecomposeGridInfo = {
    index: number,
    sortNum?: number,
    info: BagItem,
    color?: number,
    isSelect: boolean,
    decomposeNum: number
}

export enum DecomposeType {
    EQUIP = 0, // 装备
    MATERIAL = 1, //职业材料
    OTHER = 2,//其他
}

export enum ItemSubType {
    MATERIAL = 12, //职业材料
    HEROCHIP = 18, //英雄碎片
}

// const _typeIndex = [DecomposeType.EQUIP, DecomposeType.OTHER]


@ccclass
@menu("qszc/view/decompose/DecomposeViewCtrl")
export default class DecomposeViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Node)
    colorContent: cc.Node = null

    @property(cc.Prefab)
    decomposeItem: cc.Prefab = null;

    @property(cc.Toggle)
    colorCheckBtns: Array<cc.Toggle> = []

    @property(cc.ScrollView)
    resultScrollView: cc.ScrollView = null;

    @property(cc.Node)
    resultContent: cc.Node = null

    @property(cc.Prefab)
    resultItem: cc.Prefab = null;

    @property(cc.Label)
    putLab: cc.Label = null;
    @property(cc.Node)
    putRLab: cc.Node = null;

    @property(cc.Label)
    totalGold: cc.Label = null;

    private infoList: Array<DecomposeGridInfo> = []
    private list: ListView = null;
    curIndex: number = 1
    // ifInit: boolean = false
    // startTime: number = 0

    selectIdsMap = {}
    listCache = [];
    resultList: ListView = null;

    isClearAllCheck: boolean = false;

    get bagModel(): BagModel {
        return ModelManager.get(BagModel);
    }

    get equipModel(): EquipModel {
        return ModelManager.get(EquipModel);
    }

    get heroModel(): HeroModel {
        return ModelManager.get(HeroModel);
    }

    get roleModel(): RoleModel {
        return ModelManager.get(RoleModel);
    }

    get mainModel(): MainSceneModel {
        return ModelManager.get(MainSceneModel);
    }

    onLoad() {
        this.title = 'i18n:DECOMPOSE_TITLE'
        // this.startTime = Date.now()
        this._initListView();
        this._initResultListView();

        // gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this._updateBagItem, this)
        // gdk.e.on(RoleEventId.UPDATE_EQUIP_LIST, this._updateBagItem, this)
        // gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateOneItem, this)
        // gdk.e.on(RoleEventId.RSP_EQUIP_OFF, this._equipOff, this)
        // gdk.e.on(RoleEventId.UPDATE_ONE_EQUIP, this._updateOneItem, this)
        // gdk.e.on(BagEvent.REMOVE_ITEM, this._removeOneItem, this)
        // gdk.e.on(RoleEventId.REMOVE_ONE_EQUIP, this._removeOneItem, this)
        NetManager.on(icmsg.EquipUpdateRsp.MsgType, this._updateBgItems, this)
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateBgItems, this)

        gdk.e.on(DecomposeEvent.DECOMPOSE_CLICK_ITEM, this._clickItem, this)
        gdk.e.on(DecomposeEvent.UPDATE_DECOMPOSE_NUM, this._updateDecomposeNum, this)
        gdk.e.on(DecomposeEvent.RSP_DECOMPOSE_ITEM, this._onDecomposeRsp, this)

        this.putLab.node.on(cc.Node.EventType.SIZE_CHANGED, () => {
            this.putRLab.x = this.putLab.node.x + this.putLab.node.width;
        });
    }

    start() {
    }

    onEnable() {
        this.bagModel.openDecompose = true;
    }

    onDisable() {
        this.bagModel.openDecompose = false;
    }

    onDestroy() {
        gdk.e.targetOff(this)
        NetManager.targetOff(this);
        this.list.destroy()
        this.resultList.destroy()
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.decomposeItem,
            cb_host: this,
            column: 5,
            gap_x: 10,
            gap_y: 5,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    _initResultListView() {
        if (this.resultList) {
            return
        }
        this.resultList = new ListView({
            scrollview: this.resultScrollView,
            mask: this.resultScrollView.node,
            content: this.resultContent,
            item_tpl: this.resultItem,
            cb_host: this,
            column: 1,
            gap_x: 10,
            async: true,
            direction: ListViewDir.Horizontal,
        })
    }

    //缓存各类别数据
    getItemListFromCach(type) {
        if (this.listCache[type]) {
            return this.listCache[type];
        }
        let list = [];
        // 背包分类显示逻辑
        switch (this.curIndex) {
            case DecomposeType.EQUIP:
                let equipItems = this.equipModel.equipItems;
                for (let index = 0; index < equipItems.length; index++) {
                    const equipItem = equipItems[index];
                    let cfg = ConfigManager.getItemById(Item_equipCfg, equipItem.itemId)
                    if (!cfg) {
                        cc.error("背包物品 未找到配置表数据 itemId =", equipItem.itemId)
                        continue;
                    }
                    let item: DecomposeGridInfo = {
                        index: -1,
                        color: cfg.color,
                        info: equipItem,
                        isSelect: false,
                        decomposeNum: equipItem.itemNum
                    };
                    list.push(item)
                }
                break;
            case DecomposeType.MATERIAL: {
                let bagItems = this.bagModel.bagItems;
                for (let index = 0; index < bagItems.length; index++) {
                    const bagItem = bagItems[index];
                    if (bagItem.type == BagType.ITEM) {
                        //职业材料
                        let subType = Math.floor(bagItem.itemId / 10000);
                        if (subType == ItemSubType.MATERIAL) {
                            let cfg = ConfigManager.getItemById(ItemCfg, bagItem.itemId);
                            if (!cfg) {
                                cc.error("背包物品 未找到配置表数据 itemId =", bagItem.itemId)
                                continue;
                            }
                            if (cfg.func_id != "add_drop_items" && cfg.disint_item.length > 0) {
                                let item: DecomposeGridInfo = {
                                    index: -1,
                                    color: cfg.color,
                                    info: bagItem,
                                    isSelect: false,
                                    decomposeNum: bagItem.itemNum
                                };
                                list.push(item);
                            }
                        }
                    }
                }
            }
                break;
            case DecomposeType.OTHER: {
                let bagItems = this.bagModel.bagItems;
                for (let index = 0; index < bagItems.length; index++) {
                    const bagItem = bagItems[index];
                    if (bagItem.type == BagType.ITEM) {
                        let subType = Math.floor(bagItem.itemId / 10000);
                        if (subType != ItemSubType.MATERIAL && subType != ItemSubType.HEROCHIP) {
                            let cfg = ConfigManager.getItemById(ItemCfg, bagItem.itemId)
                            if (!cfg) {
                                cc.error("背包物品 未找到配置表数据 itemId =", bagItem.itemId)
                                continue;
                            }
                            // 除了礼包以外的道具均归为其它
                            if (cfg.func_id != "add_drop_items" && cfg.disint_item.length > 0) {
                                let item: DecomposeGridInfo = {
                                    index: -1,
                                    color: cfg.color,
                                    info: bagItem,
                                    isSelect: false,
                                    decomposeNum: bagItem.itemNum
                                };
                                list.push(item);
                            }
                        }
                    }
                }
            }
                break;
            default:
                cc.error("unkown this.curIndex =" + this.curIndex);
                break;
        }
        GlobalUtil.sortArray(list, this._bagSortFunc);
        for (let index = 0; index < list.length; index++) {
            list[index].index = index;
        }
        this.listCache[type] = list;
        return list;
    }

    clearItemListCach() {
        this.listCache = [];
    }

    _updateBgItems() {
        //清理缓存，重新获取背包数据
        this.clearItemListCach();
        this._updateData();
        this._colorCheckBtnsUnCheck();
        this._clearItemsSelect();
    }

    /**初始化,或者背包数据有新增/重新排序时,用该方法刷新背包 */
    _updateData(v: any = null, resetPos: boolean = true) {
        let list = this.getItemListFromCach(this.curIndex);
        list = list.concat();
        // 补齐背包数据,补满一列,并且保证显示满一个背包
        let len = list.length;
        let row = Math.ceil(len / 5);
        let maxNum = (Math.min(row + 2, 5)) * 5;
        for (let index = len; index < maxNum; index++) {
            let item: DecomposeGridInfo = { index: index, info: null, isSelect: false, decomposeNum: 0 };
            list.push(item);
        }
        this.infoList = list;
        this.list.set_data(list, resetPos);
    }

    _bagSortFunc(a: DecomposeGridInfo, b: DecomposeGridInfo) {
        if (a.color != b.color) {
            return b.color - a.color
        }
        return b.info.itemId - a.info.itemId
    }

    /**选择页签, 筛选任务类型*/
    selectType(e, utype) {
        this.curIndex = parseInt(utype);

        this._updateData();
        this._colorCheckBtnsUnCheck();
        this._clearItemsSelect();
    }

    //所有颜色勾选按钮 置为false
    _colorCheckBtnsUnCheck() {
        this.isClearAllCheck = true;
        for (let idx = 0; idx < this.colorCheckBtns.length; idx++) {
            this.colorCheckBtns[idx].isChecked = false
        }
        this.isClearAllCheck = false;
    }

    /**重置所有物品的选中框 */
    _clearItemsSelect() {
        let itemList = this.list.datas;
        let item;
        for (let i = 0; i < itemList.length; i++) {
            item = itemList[i];
            if (item.info) {
                item.isSelect = false
            }
        }
        this.list.refresh_items();
        this.selectIdsMap = {};
        this.resultList.set_data([]);

        this.totalGold.string = "0";
        this.putLab.string = "0";
    }

    //单个颜色勾选
    selectColorCheck(e, utype) {
        //清理check按钮中，阻止没必要的计算
        if (this.isClearAllCheck) {
            return;
        }
        this._updateItemsColorSelect()
    }

    doSelectItems(color: number, isSelect: boolean) {
        let itemList = this.list.datas;
        for (let j = 0; j < itemList.length; j++) {
            let item = itemList[j];
            if (item.info && item.color == color) {
                item.isSelect = isSelect;
                let itemId = item.info.type == BagType.EQUIP ? item.info.series : item.info.itemId
                if (isSelect) {
                    item.decomposeNum = item.info.itemNum;
                    //装备要用背包中的位置标识
                    this.selectIdsMap[itemId] = item.info.itemNum
                } else {
                    item.decomposeNum = 0;
                    if (this.selectIdsMap[itemId]) {
                        delete this.selectIdsMap[itemId];
                    }
                }
            }
        }
    }

    //更新颜色物品选择状态
    _updateItemsColorSelect() {
        for (let idx = 0; idx < this.colorCheckBtns.length; idx++) {
            const element = this.colorCheckBtns[idx];
            let color = idx + 1;
            this.doSelectItems(color, element.isChecked);
        }
        this.list.refresh_items()
        this._updatePreResult()
    }

    //单独点击物品选中
    _clickItem(e: gdk.Event) {
        let index = e.data.index;
        let isSelect = e.data.isSelect;
        let list = this.list.datas;
        let data;
        for (let i = 0, len = list.length; i < len; i++) {
            if (list[i].index == index) {
                data = list[i];
                break;
            }
        }
        if (!data) {
            this.list.refresh_items()
            return;
        }
        data.isSelect = isSelect;
        let itemId = data.info.type == BagType.EQUIP ? data.info.series : data.info.itemId;
        if (isSelect) {
            //装备要用背包中的位置标识
            if (!this.selectIdsMap[itemId]) {
                this.selectIdsMap[itemId] = data.info.itemNum
            }
            data.decomposeNum = data.info.itemNum
        } else {
            if (this.selectIdsMap[itemId]) {
                delete this.selectIdsMap[itemId]
            }
            data.decomposeNum = 0
        }
        this.list.refresh_items()
        this._updatePreResult()
    }

    /**分解结果预览 */
    _updatePreResult() {
        let items = this.selectIdsMap
        let datas = []
        let goodList: icmsg.GoodsInfo[] = []
        let countNum = 0
        if (this.curIndex == DecomposeType.EQUIP) {
            for (let key in items) {
                if (items[key]) {
                    let id = parseInt(key)
                    let equipBagItem = EquipUtils.getEquipData(id)
                    let equipCfg = ConfigManager.getItemById(Item_equipCfg, equipBagItem.itemId)
                    if (equipCfg) {
                        // //装备本身分解 对应equip_star表
                        // let equipExtInfo = equipBagItem.extInfo as EquipInfo
                        // let colorCfg = ConfigManager.getItemById(Item_equip_colorCfg, equipCfg.color)
                        // let equipStarCfg = ConfigManager.getItemByField(Item_equip_starCfg, "color", equipCfg.color, {
                        //     part: equipCfg.part,
                        //     star: equipExtInfo.star
                        // })
                        // if (equipStarCfg) {
                        //     let decomposeItems = equipCfg.skill > 0 ? equipStarCfg.decompose_skill : equipStarCfg.decompose
                        //     for (let i = 0; i < decomposeItems.length; i++) {
                        //         let decomposeId = decomposeItems[i][0]
                        //         let decomposeNum = decomposeItems[i][1]
                        //         if (!datas[decomposeId]) {
                        //             datas[decomposeId] = decomposeNum
                        //         } else {
                        //             datas[decomposeId] += decomposeNum
                        //         }
                        //     }
                        // }
                        let extInfo = equipBagItem.extInfo as icmsg.EquipInfo
                        //装备经验换算
                        let gCfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'equip_decompose_item_id');
                        let resultId = gCfg.value[0]
                        let temItem = ConfigManager.getItemById(ItemCfg, gCfg.value[0])
                        let expUnit = temItem.func_args[0]

                        // let totalExp = (extInfo.level > 1 ? EquipUtils.getEquipExp(equipCfg.id, extInfo.level) : 0) + extInfo.exp
                        // if (extInfo.exp > 0 || extInfo.level > 1) {
                        //     if (!datas[resultId]) {
                        //         datas[resultId] = Math.floor(totalExp / expUnit)
                        //     } else {
                        //         datas[resultId] += Math.floor(totalExp / expUnit)
                        //     }

                        //     let cfg = ConfigManager.getItemByField(GlobalCfg, 'key', 'equip_strength_exp_gold');
                        //     if (!datas[3]) {
                        //         datas[3] = totalExp / cfg.value[0] * cfg.value[1]
                        //     } else {
                        //         datas[3] += totalExp / cfg.value[0] * cfg.value[1]
                        //     }
                        // }

                        //装备镶嵌宝石换算
                        // if (extInfo && extInfo.rubies) {
                        //     for (let i = 0; i < extInfo.rubies.length; i++) {
                        //         let rubyId = extInfo.rubies[i]
                        //         if (rubyId > 0) {
                        //             if (!datas[rubyId]) {
                        //                 datas[rubyId] = 1
                        //             } else {
                        //                 datas[rubyId] += 1
                        //             }
                        //         }
                        //     }
                        // }
                        countNum++
                    }
                }
            }
        } else {
            for (let key in items) {
                if (items[key]) {
                    let id = key
                    let itemCfg = ConfigManager.getItemById(ItemCfg, id)
                    if (itemCfg) {
                        for (let i = 0; i < itemCfg.disint_item.length; i++) {
                            let resultId = itemCfg.disint_item[i][0]
                            let resultNum = itemCfg.disint_item[i][1]
                            if (!datas[resultId]) {
                                datas[resultId] = resultNum * items[key]
                            } else {
                                datas[resultId] += resultNum * items[key]
                            }
                        }
                        countNum++
                    }
                }
            }
        }
        goodList = this._createGoodListData(datas);
        this.resultList.set_data(goodList);
        let totalWidth = goodList.length * this.resultList['item_width'];
        this.resultScrollView.node.x = -totalWidth / 2;
        this.totalGold.string = datas[3] ? datas[3] : "0"
        this.putLab.string = countNum.toString();
    }

    _createGoodListData(datas) {
        let goodList = []
        for (let key in datas) {
            if (datas[key]) {
                let good: icmsg.GoodsInfo = new icmsg.GoodsInfo()
                good.typeId = parseInt(key)
                good.num = datas[key]
                goodList.push(good)
            }
        }
        return goodList
    }

    /**分解数量选择更新 */
    _updateDecomposeNum(e: gdk.Event) {
        let id = e.data.id
        let num = e.data.num
        if (this.selectIdsMap[id]) {
            if (num > 0) {
                this.selectIdsMap[id] = num;
            } else {
                delete this.selectIdsMap[id];
            }
        }

        let itemList = this.list.datas
        for (let i = 0; i < itemList.length; i++) {
            let item = itemList[i];
            if (item.info && item.info.itemId == id) {
                item.decomposeNum = num;
                item.isSelect = num > 0;
                break;
            }
        }
        this.list.refresh_items()
        this._updatePreResult()
    }

    /**分解操作 */
    decomposeFunc() {
        let decomposeItems = this.selectIdsMap;
        let items = []
        let equips = []
        let rubies = []
        let isCanDecompose = false
        //物品二次判断
        let isTip = false

        for (let key in decomposeItems) {
            if (decomposeItems[key]) {
                isCanDecompose = true
                let id = parseInt(key)
                let equipBagItem = EquipUtils.getEquipData(id)
                if (equipBagItem) {
                    equips.push(id)
                    let equipCfg = ConfigManager.getItemById(Item_equipCfg, equipBagItem.itemId)
                    if (equipCfg && equipCfg.color >= 3) {
                        isTip = true
                    }
                } else {
                    let type = BagUtils.getItemTypeById(parseInt(key));
                    let good: icmsg.GoodsInfo = new icmsg.GoodsInfo()
                    good.typeId = id
                    good.num = decomposeItems[key]
                    if (type == BagType.JEWEL) {
                        rubies.push(good)
                        let rubyCfg = ConfigManager.getItemById(Item_rubyCfg, parseInt(key))
                        if (rubyCfg && rubyCfg.level > 3) {
                            isTip = true
                        }
                    } else {
                        items.push(good)
                        let cfg = BagUtils.getConfigById(parseInt(key))
                        if (cfg && cfg.defaultColor >= 3) {
                            isTip = true
                        }
                    }
                }
            }
        }
        if (!isCanDecompose) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:DECOMPOSE_TIP1"));
            return
        }
        if (isTip) {
            let self = this;
            gdk.gui.showAskAlert(
                `${gdk.i18n.t("i18n:DECOMPOSE_TIP2")}\n${gdk.i18n.t("i18n:DECOMPOSE_TIP3")}`,
                `${gdk.i18n.t("i18n:TIP_TITLE")}`, "",
                (index: number) => {
                    if (index === 1) {

                    } else if (index === 0) {
                        // 确定
                        self.clearItemListCach();
                        self.selectIdsMap = {};

                        if (items.length > 0) {
                            let msg = new icmsg.ItemDisintReq();
                            msg.items = items;
                            NetManager.send(msg);
                            return
                        }
                        if (equips.length > 0) {
                            let msg = new icmsg.EquipDisintReq();
                            msg.equipList = equips;
                            NetManager.send(msg);
                            return
                        }
                    }
                }, this, {
                cancel: `${gdk.i18n.t("i18n:CANCEL")}`,
                ok: `${gdk.i18n.t("i18n:OK")}`
            }
            )
        } else {
            this.clearItemListCach();
            this.selectIdsMap = {};

            if (items.length > 0) {
                let msg = new icmsg.ItemDisintReq();
                msg.items = items;
                NetManager.send(msg);
                return
            }
            if (equips.length > 0) {
                let msg = new icmsg.EquipDisintReq();
                msg.equipList = equips;
                NetManager.send(msg);
                return
            }
        }
    }

    //分解成功后返回
    _onDecomposeRsp(e: gdk.Event) {
        //物品数据没到，不能刷新数据
        GlobalUtil.openRewadrView(e.data.list)
        // gdk.Timer.callLater(this, () => {
        //     // this._updateData()
        //     // this._updatePreResult()
        // })
    }

    /**跳转购买金币 */
    // buyGoldFunc() {
    //     this.close()
    //     JumpUtils.openStore([1])
    // }

    /**跳转购买钻石 */
    // buyDiamondFunc() {
    //     this.close()
    //     JumpUtils.openStore([3])
    // }
}
