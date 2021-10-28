import AdventureMainViewCtrl from './AdventureMainViewCtrl';
import AdventureModel from '../model/AdventureModel';
import AdvPlateEntryItemCtrl from './AdvPlateEntryItemCtrl';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
/**
 * @Description: 探险事件--增益遗物选择
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 12:07:28
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdvPlateEntryPanelCtrl")
export default class AdvPlateEntryPanelCtrl extends gdk.BasePanel {

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    entryItem: cc.Prefab = null

    _selectIndex: number = 0
    _itemCtrl: AdvPlateEntryItemCtrl[] = []
    _entryDatas = []

    get adventureModel(): AdventureModel { return ModelManager.get(AdventureModel); }

    onEnable() {
        let msg = new icmsg.AdventureEntryListReq()
        msg.plateIndex = this.adventureModel.selectIndex
        msg.giveHeros = this.adventureModel.pveHireHeroIds
        msg.heros = this.adventureModel.pveOwnHeroIds
        NetManager.send(msg, (data: icmsg.AdventureEntryListRsp) => {
            this.adventureModel.plateEntryList = data.entryList
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
            let ctrl = item.getComponent(AdvPlateEntryItemCtrl)
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

        let msg = new icmsg.AdventureEntrySelectReq()
        msg.plateIndex = this.adventureModel.selectIndex
        msg.id = this.selectInfo.id
        NetManager.send(msg, (data: icmsg.AdventureEntrySelectRsp) => {
            this.adventureModel.entryList.push(this.selectInfo)
            gdk.gui.showMessage(gdk.i18n.t("i18n:ADVENTURE_TIP40"))
            this.adventureModel.historyPlate.push(this.adventureModel.plateIndex)//上一个点
            this.adventureModel.lastPlate = this.adventureModel.plateIndex
            this.adventureModel.plateIndex = data.plateIndex
            this.adventureModel.plateFinish = true
            this.adventureModel.isMove = true
            gdk.panel.hide(PanelId.AdvPlateEntryPanel)
            this.flyIconFunc()
            let curView = gdk.gui.getCurrentView()
            let ctrl = curView.getComponent(AdventureMainViewCtrl)
            ctrl.refreshPoints()
        })
    }


    flyIconFunc() {
        let posX = [-221, 0, 221]
        let item = this.content.children[this._selectIndex]
        let ctrl: AdvPlateEntryItemCtrl = item.getComponent(AdvPlateEntryItemCtrl)
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