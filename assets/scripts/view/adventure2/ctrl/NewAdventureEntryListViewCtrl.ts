import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureEntryListItemCtrl from './NewAdventureEntryListItemCtrl';
import NewAdventureMainViewCtrl from './NewAdventureMainViewCtrl';
import NewAdventureModel from '../model/NewAdventureModel';
import NewAdventureUtils from '../utils/NewAdventureUtils';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import { Adventure2_endless_entryCfg, Adventure2_globalCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';


/**
 * @Description: 新奇境探险遗物兑换界面
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-26 11:15:39
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/NewAdventureEntryListViewCtrl")
export default class NewAdventureEntryListViewCtrl extends gdk.BasePanel {

    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    entryItem: cc.Prefab = null;

    @property(cc.Button)
    groupBtns: cc.Button[] = []

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    selectGroup: number = 0     // 筛选阵营
    list: ListView = null

    curNum: number = 0;
    onEnable() {
        //获取探索积分个数
        this.adventureModel.selectEntyrCostNum = 0;
        this.adventureModel.selectEntyrIds = []
        //let itemId = ConfigManager.getItemByField(Adventure2_globalCfg, 'key', 'endless_entry_item').value[0]
        this.curNum = this.roleModel.adventureEntry//BagUtils.getItemNumById(itemId);
        if (this.curNum == null) {
            this.curNum = 0
        }
        this.num.string = this.curNum + '';
        this.selectGroupFunc(null, 0);
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
            item_tpl: this.entryItem,
            cb_host: this,
            column: 3,
            gap_x: 21,
            gap_y: 10,
            async: true,
            resize_cb: this._updateDataLater,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._selectItem, this);
    }

    _updateDataLater() {
        if (!cc.isValid(this.node)) return;
        if (!this.enabledInHierarchy) return;
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _updateScroll() {
        this._initListView()

        let listData = []
        let lockData = []
        let tempList: Adventure2_endless_entryCfg[] = [];

        let cfgs = ConfigManager.getItems(Adventure2_endless_entryCfg)
        tempList = cfgs.concat();
        if (this.selectGroup != 0) {
            let tem = []
            tempList.forEach(cfg => {
                if (cfg.quality == this.selectGroup) {
                    tem.push(cfg);
                }
            })
            tempList = tem;
        }

        let pass = NewAdventureUtils.passDifficulty()

        tempList.forEach(cfg => {
            if (pass.indexOf(cfg.difficulty) >= 0) {
                let temData = { cfg: cfg, select: false, lock: false }
                listData.push(temData)
            } else {
                let temData = { cfg: cfg, select: false, lock: true }
                lockData.push(temData)
            }
        })
        listData = listData.concat(lockData)
        this.list.set_data(listData);
    }

    _selectItem(data: any, index) {

        // this.model.curHeroInfo = <icmsg.HeroInfo>data.data.extInfo;
        // JumpUtils.openPanel({
        //     panelId: PanelId.RoleView2,
        //     currId: this.node
        // })

        let ctrl = this.list.items[index].node.getComponent(NewAdventureEntryListItemCtrl);
        if (ctrl.isYdh || ctrl.isLock) {
            return;
        }

        if (!ctrl.curSelect) {
            //判断是否够
            if (this.adventureModel.selectEntyrCostNum + ctrl.entryCfg.cost <= this.curNum) {
                ctrl.selectIcon.active = true;
                ctrl.curSelect = true;
                this.adventureModel.selectEntyrIds.push(ctrl.entryCfg.hardcore_id)
                this.adventureModel.selectEntyrCostNum += ctrl.entryCfg.cost
            } else {
                gdk.gui.showMessage(gdk.i18n.t('i18n:NEW_ADVENTURE_TIP4'))
            }
        } else {
            this.adventureModel.selectEntyrCostNum -= ctrl.entryCfg.cost
            ctrl.selectIcon.active = false;
            ctrl.curSelect = false;
            let index = this.adventureModel.selectEntyrIds.indexOf(ctrl.entryCfg.hardcore_id);
            if (index >= 0) {
                this.adventureModel.selectEntyrIds.splice(index, 1);
            }
        }
        this.num.string = (this.curNum - this.adventureModel.selectEntyrCostNum) + ''

    }

    //打开遗物列表
    openEntryList() {
        gdk.panel.open(PanelId.AdventureEntryList2)
    }


    //重置按钮点击事件
    resetRntryBtnClick() {

        if (this.adventureModel.endless_entryList.length == 0) {
            return;
        }
        let temNum = 0
        this.adventureModel.endless_entryList.forEach(id => {
            let cfg = ConfigManager.getItemByField(Adventure2_endless_entryCfg, 'hardcore_id', id)
            if (cfg) {
                temNum += cfg.cost
            }
        })

        let temData = ConfigManager.getItemByField(Adventure2_globalCfg, 'key', 'entry_reset_cost').value
        GlobalUtil.openAskPanel({
            descText: StringUtils.format(gdk.i18n.t('i18n:NEW_ADVENTURE_TIP3'), temData[1], temNum),
            sureCb: () => {
                let msg = new icmsg.Adventure2EntryResetReq()
                msg.difficulty = 4
                NetManager.send(msg, (rsp: icmsg.Adventure2EntryResetRsp) => {
                    this.adventureModel.endLessState = rsp.difficultyState
                    this.adventureModel.endless_blood = rsp.difficultyState.blood
                    this.adventureModel.endless_layerId = rsp.difficultyState.layerId
                    this.adventureModel.endless_plateIndex = rsp.difficultyState.plateIndex
                    this.adventureModel.endless_plateFinish = rsp.difficultyState.plateFinish
                    this.adventureModel.endless_consumption = rsp.difficultyState.consumption
                    this.adventureModel.endless_entryList = rsp.difficultyState.entryList
                    this.adventureModel.endless_fightTimes = rsp.difficultyState.clearTimes
                    this.adventureModel.endless_lastPlate = rsp.difficultyState.lastPlate
                    this.adventureModel.endless_historyPlate = rsp.difficultyState.historyPlate;
                    this.adventureModel.endless_stageId = rsp.difficultyState.stageId
                    this.adventureModel.endless_line = rsp.difficultyState.line;
                    gdk.panel.hide(PanelId.NewAdventureEntryListView);
                    let curView = gdk.gui.getCurrentView()
                    let ctrl = curView.getComponent(NewAdventureMainViewCtrl)
                    if (ctrl) {
                        //ctrl.refreshPoints()
                        ctrl._loadMap(ctrl.advCfg.map_id)
                    }
                    //this._updateDataLater()
                })
            }
        })


    }

    //保存按钮点击事件
    saveBtnClick() {

        GlobalUtil.openAskPanel({
            descText: StringUtils.format(gdk.i18n.t('i18n:NEW_ADVENTURE_TIP1'), this.adventureModel.selectEntyrCostNum),//`你将使用${this.adventureModel.selectEntyrCostNum}点遗物积分兑换遗物`,
            sureCb: () => {
                let msg = new icmsg.Adventure2EntryExchangeReq()
                msg.difficulty = 4;
                msg.ids = this.adventureModel.selectEntyrIds
                NetManager.send(msg, (rsp: icmsg.Adventure2EntryExchangeRsp) => {
                    this.adventureModel.endLessState.entryList = rsp.entryList
                    this.adventureModel.endless_entryList = rsp.entryList
                    //this._updateDataLater()
                    gdk.panel.hide(PanelId.NewAdventureEntryListView);
                    gdk.gui.showMessage(gdk.i18n.t('i18n:NEW_ADVENTURE_TIP2'))
                })
            }
        })

    }


}
