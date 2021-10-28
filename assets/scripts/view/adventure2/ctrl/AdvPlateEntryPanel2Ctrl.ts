import AdventureMainView2Ctrl from './AdventureMainView2Ctrl';
import AdvPlateEntryItem2Ctrl from './AdvPlateEntryItem2Ctrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureMainViewCtrl from './NewAdventureMainViewCtrl';
import NewAdventureModel from '../model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import { Adventure2_endless_entryCfg, Adventure2_entryCfg } from '../../../a/config';

/**
 * @Description: 探险事件--增益遗物选择
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-18 19:39:36
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdvPlateEntryPanel2Ctrl")
export default class AdvPlateEntryPanel2Ctrl extends gdk.BasePanel {

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    entryItem: cc.Prefab = null

    _selectIndex: number = 0
    _itemCtrl: AdvPlateEntryItem2Ctrl[] = []
    _entryDatas = []

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    difficulty: number;
    selectIndex: number;
    plateIndex: number;

    onEnable() {
        this.plateIndex = this.adventureModel.copyType == 0 ? this.adventureModel.normal_plateIndex : this.adventureModel.endless_plateIndex;
        this.difficulty = this.adventureModel.copyType == 0 ? this.adventureModel.difficulty : 4;
        this.selectIndex = this.adventureModel.copyType == 0 ? this.adventureModel.normal_selectIndex : this.adventureModel.endless_selectIndex

        let msg = new icmsg.Adventure2EntryListReq()
        msg.difficulty = this.difficulty
        msg.plateIndex = this.selectIndex
        // msg.giveHeros = this.adventureModel.pveHireHeroIds
        // msg.heros = this.adventureModel.pveOwnHeroIds
        NetManager.send(msg, (data: icmsg.Adventure2EntryListRsp) => {
            let temData = []
            data.entryList.forEach(id => {
                let cfg: any = ConfigManager.getItemByField(Adventure2_entryCfg, 'hardcore_id', id)
                if (this.adventureModel.copyType == 1) {
                    cfg = ConfigManager.getItemByField(Adventure2_endless_entryCfg, 'hardcore_id', id)
                }
                let tem = new icmsg.AdventureEntry()
                tem.group = cfg.group;
                tem.id = cfg.hardcore_id;
                temData.push(tem)
            })
            this.adventureModel.plateEntryList = temData

            gdk.Timer.callLater(this, () => {
                this._updateListView()
            })
        })
    }

    onDisable() {
        this.adventureModel.entrySelectIndex = -1
    }


    _updateListView() {
        this._entryDatas = []
        this.adventureModel.plateEntryList.forEach(element => {
            this._entryDatas.push({ info: element, isSelect: false })
        });

        for (let i = 0; i < this._entryDatas.length; i++) {
            let item = cc.instantiate(this.entryItem)
            let ctrl = item.getComponent(AdvPlateEntryItem2Ctrl)
            ctrl.updateViewInfo(i, this._entryDatas[i])
            this.content.addChild(item)
            this._itemCtrl.push(ctrl)
        }
    }


    get selectInfo() {
        for (let i = 0; i < this._itemCtrl.length; i++) {
            if (this._itemCtrl[i].isSelect) {
                this._selectIndex = i
                return this._itemCtrl[i].entryInfo

            }
        }
        return null
    }

    selectFunc() {
        if (this.adventureModel.entrySelectIndex == -1) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:ADVENTURE_TIP39"))
            return
        }

        let msg = new icmsg.Adventure2EntrySelectReq()
        msg.difficulty = this.difficulty;
        msg.plateIndex = this.selectIndex
        msg.id = this.selectInfo.id
        NetManager.send(msg, (data: icmsg.Adventure2EntrySelectRsp) => {
            //let entryCfg = ConfigManager.getItemByField(Adventure2_entryCfg, "group", this.selectInfo.group, { hardcore_id: this.selectInfo.id })
            gdk.gui.showMessage(gdk.i18n.t("i18n:ADVENTURE_TIP40"))
            if (this.adventureModel.copyType == 0) {
                this.adventureModel.normal_entryList = data.entryList
                this.adventureModel.normal_historyPlate.push(this.plateIndex)//上一个点
                this.adventureModel.normal_lastPlate = this.plateIndex
                this.adventureModel.normal_plateIndex = data.plateIndex
                this.adventureModel.normal_plateFinish = true
            } else {
                this.adventureModel.endless_entryList = data.entryList
                this.adventureModel.endless_historyPlate.push(this.plateIndex)//上一个点
                this.adventureModel.endless_lastPlate = this.plateIndex
                this.adventureModel.endless_plateIndex = data.plateIndex
                this.adventureModel.endless_plateFinish = true
            }

            this.adventureModel.isMove = true
            gdk.panel.hide(PanelId.AdvPlateEntryPanel2)
            this.flyIconFunc()
            let curView = gdk.gui.getCurrentView()
            if (this.adventureModel.copyType == 0) {
                let ctrl = curView.getComponent(AdventureMainView2Ctrl)
                ctrl.refreshPoints()
            } else {
                let ctrl = curView.getComponent(NewAdventureMainViewCtrl)
                ctrl.refreshPoints()
            }

        })
    }


    flyIconFunc() {
        let posX = [-221, 0, 221]
        let item = this.content.children[this._selectIndex]
        let ctrl: AdvPlateEntryItem2Ctrl = item.getComponent(AdvPlateEntryItem2Ctrl)
        let flyIcon = cc.instantiate(ctrl.typeIcon)
        flyIcon.x = posX[this._selectIndex]
        let layer = gdk.gui.layers.guideLayer
        flyIcon.parent = layer
        let finshend = cc.callFunc(function () {
            flyIcon.destroy()
        }, this);
        let dsz = cc.view.getVisibleSize();
        let endPos = cc.v2(150, -dsz.height / 2 + 50)
        flyIcon.runAction(cc.sequence(cc.spawn(cc.moveTo(0.5, endPos.x, endPos.y), cc.scaleTo(0.5, 0.4)), finshend))
    }

    @gdk.binding("adventureModel.entrySelectIndex")
    refreshListView() {
        let index = this.adventureModel.entrySelectIndex
        for (let i = 0; i < this._entryDatas.length; i++) {
            if (i == index) {
                this._entryDatas[i].isSelect = true
            } else {
                this._entryDatas[i].isSelect = false
            }
        }
        for (let i = 0; i < this._itemCtrl.length; i++) {
            this._itemCtrl[i].updateViewInfo(i, this._entryDatas[i])
        }
    }
}