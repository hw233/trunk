import ConfigManager from '../../../../../common/managers/ConfigManager';
import EquipModel from '../../../../../common/models/EquipModel';
import EquipUtils from '../../../../../common/utils/EquipUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import StringUtils from '../../../../../common/utils/StringUtils';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
import { Unique_starCfg, UniqueCfg } from '../../../../../a/config';

/**
 * @Description: 专属装备分解
 * @Author: luoyong
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-10-13 14:17:28
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/uniqueEquip/UniqueEquipDecomposePanelCtrl")
export default class UniqueEquipDecomposePanelCtrl extends gdk.BasePanel {
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
    decomposeItem: cc.Prefab = null

    @property(cc.Node)
    onNode: cc.Node = null

    @property(cc.Node)
    offNode: cc.Node = null

    @property(cc.Label)
    putNumLab: cc.Label = null

    @property(cc.Label)
    maxNumLab: cc.Label = null

    preList: ListView = null
    list: ListView = null

    _maxNum = 15
    _selectIds: number[] = []
    _datas: { [id: number]: ResetUniqueEquipInfo } = {};
    onEnable() {
        this._initListView()
        this._updateScroll();
    }

    onDisable() {
        gdk.e.targetOff(this)
        gdk.Timer.clearAll(this)
    }

    _onCostumeChange() {
        this._updateScroll();
    }

    _resetPreviewRsp(selectIds: number[]) {
        this._initPreListView()
        this._updatePreState()
        let datas: any = {};
        selectIds.forEach(id => {
            let itemId = this._datas[id].equipInfo.itemId
            let star = this._datas[id].equipInfo.star
            let cfg = ConfigManager.getItemByField(Unique_starCfg, "unique_id", itemId, { star: star });
            let disintItem = cfg.disint_item
            disintItem.forEach(item => {
                if (!datas[item[0]]) {
                    datas[item[0]] = 0;
                }
                datas[item[0]] += item[1];
            });
        });

        let datas2 = [];
        for (let key in datas) {
            let goodsInfo = new icmsg.GoodsInfo();
            goodsInfo.typeId = parseInt(key);
            goodsInfo.num = datas[key];
            datas2.push(goodsInfo)
        }

        this.preList.set_data(GlobalUtil.sortGoodsInfo(datas2))
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
            item_tpl: this.decomposeItem,
            cb_host: this,
            column: 5,
            gap_x: 15,
            gap_y: 15,
            async: true,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._onItemClick, this)
    }

    _onItemClick(item: ResetUniqueEquipInfo) {
        let idIndex = this._selectIds.indexOf(item.id)
        if (idIndex == -1) {
            if (this._selectIds.length >= this._maxNum) {
                gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:ROLE_TIP56"), this._maxNum));
                return;
            }
            this._selectIds.push(item.id)
        } else {
            this._selectIds.splice(idIndex, 1)
        }

        let datas: ResetUniqueEquipInfo[] = this.list.datas
        for (let i = 0; i < datas.length; i++) {
            if (this._selectIds.indexOf(datas[i].id) == -1) {
                datas[i].selected = false
            } else {
                datas[i].selected = true
            }

        }
        this.list.refresh_items()

        if (this._selectIds.length > 0) {
            //preview
            this._resetPreviewRsp(this._selectIds);
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
        let items = ModelManager.get(EquipModel).uniqueEquipItems;
        let tempList: ResetUniqueEquipInfo[] = [];
        this._datas = {};
        items.sort((a, b) => {
            let aExtInfo = a.extInfo as icmsg.UniqueEquip
            let bExtInfo = b.extInfo as icmsg.UniqueEquip
            let cfgA = ConfigManager.getItemById(UniqueCfg, a.itemId);
            let cfgB = ConfigManager.getItemById(UniqueCfg, b.itemId);
            if (cfgA.color == cfgB.color) {
                if (aExtInfo.star == bExtInfo.star) {
                    return a.itemId - b.itemId
                }
                return aExtInfo.star - bExtInfo.star
            } else {
                return cfgA.color - cfgB.color
            }
        })
        items.forEach(item => {
            for (let i = 0; i < item.itemNum; i++) {
                let id = (<icmsg.UniqueEquip>item.extInfo).id
                if (id > 0) {
                    let obj = {
                        id: id,  //唯一id
                        equipInfo: <icmsg.UniqueEquip>item.extInfo,
                        selected: false,
                    };
                    tempList.push(obj)
                    this._datas[obj.id] = obj;
                }
            }
        });
        this.list.set_data(tempList)
        this._updateNum()
    }

    _updatePreState() {
        if (this._selectIds.length > 0) {
            this.onNode.active = true
            this.offNode.active = false
        } else {
            this.onNode.active = false
            this.offNode.active = true
        }
    }

    _updateNum() {
        this.putNumLab.string = `(${this._selectIds.length}`
        this.maxNumLab.string = `/${this._maxNum})`
    }

    openTipFunc() {
        gdk.panel.setArgs(PanelId.HelpTipsPanel, 35);
        gdk.panel.open(PanelId.HelpTipsPanel);
    }


    decomposeFunc() {
        if (this._selectIds.length == 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:ROLE_TIP57"))
            return
        }

        let isTip = false
        for (let i = 0; i < this._selectIds.length; i++) {
            let cfg = ConfigManager.getItemById(UniqueCfg, (this._datas[this._selectIds[i]].equipInfo as icmsg.UniqueEquip).itemId);
            if (cfg.color >= 4) {
                isTip = true
                break
            }
        }

        if (isTip) {
            GlobalUtil.openAskPanel({
                title: gdk.i18n.t("i18n:TIP_TITLE"),
                descText: gdk.i18n.t("i18n:ROLE_TIP58"),
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
        let msg = new icmsg.UniqueEquipDisintReq()
        msg.id = this._selectIds;
        NetManager.send(msg, (data: icmsg.UniqueEquipDisintRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._selectIds.forEach(id => {
                EquipUtils.removeUniqueEquipById(id, false)
            })
            this._selectIds = []
            this._updateScroll()
            GlobalUtil.openRewadrView(data.list)
        }, this);
    }

    quickPutFunc() {
        for (let i = 0; i < this.list.datas.length; i++) {
            if (this._selectIds.length >= this._maxNum) {
                break
            }
            let info = this.list.datas[i].equipInfo as icmsg.UniqueEquip
            let cfg = ConfigManager.getItemById(UniqueCfg, info.itemId);
            if (this._selectIds.indexOf(this.list.datas[i].id) == -1 && cfg.color <= 3) {
                this._selectIds.push(this.list.datas[i].id)
                this.list.datas[i].selected = true
            }
        }
        if (this._selectIds.length == 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:ROLE_TIP59"))
            return
        }

        this.list.refresh_items()

        if (this._selectIds.length < this._maxNum) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:ROLE_TIP59"))
        }

        this._resetPreviewRsp(this._selectIds);
    }
}


export type ResetUniqueEquipInfo = {
    id: number,
    equipInfo: icmsg.UniqueEquip,
    selected: boolean,
}