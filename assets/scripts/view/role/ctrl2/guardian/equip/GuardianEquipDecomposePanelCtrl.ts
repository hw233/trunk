import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GuardianModel from '../../../model/GuardianModel';
import GuardianUtils from '../GuardianUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import StringUtils from '../../../../../common/utils/StringUtils';
import { Guardian_equip_lvCfg, Guardian_equip_starCfg, Guardian_equipCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';

const { ccclass, property, menu } = cc._decorator;
/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-15 22:15:45
 */

@ccclass
@menu("qszc/view/role2/guardian/equip/GuardianEquipDecomposePanelCtrl")
export default class GuardianEquipDecomposePanelCtrl extends gdk.BasePanel {

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
    costumeDecomposeItem: cc.Prefab = null

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
    _datas: any = {}; // id-resetCostumeInfo
    onEnable() {
        this._initListView()
        this._updateScroll();
        // gdk.e.on(RoleEventId.COSTUME_ADD, this._onCostumeChange, this);
        // gdk.e.on(RoleEventId.COSTUME_REMOVE, this._onCostumeChange, this);
    }

    onDisable() {
        //gdk.e.targetOff(this)
        gdk.Timer.clearAll(this)
        NetManager.targetOff(this)
    }

    _onGuardianEqChange() {
        this._updateScroll();
    }

    _resetPreviewRsp(selectIds: number[]) {
        this._initPreListView()
        this._updatePreState()
        let datas: any = {};
        selectIds.forEach(id => {
            let info = <icmsg.GuardianEquip>this._datas[id].guardianEqInfo
            let disintItem = []

            let eqCfg = ConfigManager.getItemByField(Guardian_equipCfg, 'id', info.type);

            let starCfgs = ConfigManager.getItems(Guardian_equip_starCfg, (cfg: Guardian_equip_starCfg) => {
                if (cfg.type == eqCfg.type && cfg.part == eqCfg.part && cfg.star <= info.star) {
                    return true;
                }
            })
            for (let i = 0, n = starCfgs.length; i < n; i++) {
                let cfg = starCfgs[i]
                if (i < n - 1) {
                    disintItem = disintItem.concat(cfg.consumption);
                } else {
                    disintItem = disintItem.concat([cfg.disint_item])
                }
            }

            let lvCfgs = ConfigManager.getItems(Guardian_equip_lvCfg, (cfg: Guardian_equip_lvCfg) => {
                if (cfg.type == eqCfg.type && cfg.part == eqCfg.part && cfg.lv < info.level) {
                    return true;
                }
            })
            for (let i = 0, n = lvCfgs.length; i < n; i++) {
                let cfg = lvCfgs[i]
                disintItem = disintItem.concat(cfg.consumption)
            }

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
            item_tpl: this.costumeDecomposeItem,
            cb_host: this,
            column: 5,
            gap_x: 15,
            gap_y: 15,
            async: true,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._onItemClick, this)
    }

    _onItemClick(item: ResetGuardianEqInfo) {
        let idIndex = this._selectIds.indexOf(item.id)
        if (idIndex == -1) {
            if (this._selectIds.length >= this._maxNum) {
                gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:ROLE_TIP13"), this._maxNum));
                return;
            }
            this._selectIds.push(item.id)
        } else {
            this._selectIds.splice(idIndex, 1)
        }

        let datas: ResetGuardianEqInfo[] = this.list.datas
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
        let items = ModelManager.get(GuardianModel).equipItems;
        let tempList: ResetGuardianEqInfo[] = [];
        this._datas = {};
        items.sort((a, b) => {
            let temA = <icmsg.GuardianEquip>a.extInfo
            let temB = <icmsg.GuardianEquip>b.extInfo
            if (temA.star == temB.star) {
                return temA.level - temB.level;
            }
            else {
                return temA.star - temB.star;
            }
        })
        items.forEach(item => {
            for (let i = 0; i < item.itemNum; i++) {
                let id = (<icmsg.GuardianEquip>item.extInfo).id
                if (id > 0) {
                    let obj = {
                        id: id,  //唯一id
                        guardianEqInfo: <icmsg.GuardianEquip>item.extInfo,
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
        gdk.panel.setArgs(PanelId.HelpTipsPanel, 118);
        gdk.panel.open(PanelId.HelpTipsPanel);
    }


    decomposeFunc() {
        if (this._selectIds.length == 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:ROLE_TIP53"))
            return
        }

        this.doDecompose()
        // let isTip = false
        // for (let i = 0; i < this._selectIds.length; i++) {
        //     let cfg = ConfigManager.getItemById(CostumeCfg, (this._datas[this._selectIds[i]].costumeInfo as icmsg.CostumeInfo).typeId);
        //     if (cfg.color >= 3) {
        //         isTip = true
        //         break
        //     }
        // }

        // if (isTip) {
        //     GlobalUtil.openAskPanel({
        //         title: gdk.i18n.t("i18n:TIP_TITLE"),
        //         descText: gdk.i18n.t("i18n:ROLE_TIP15"),
        //         sureText: gdk.i18n.t("i18n:OK"),
        //         closeText: gdk.i18n.t("i18n:CANCEL"),
        //         sureCb: () => {
        //             this.doDecompose()
        //         }
        //     })
        // } else {
        //     this.doDecompose()
        // }
    }

    doDecompose() {
        let msg = new icmsg.GuardianEquipDecomposeReq()
        msg.list = this._selectIds;
        NetManager.send(msg, (data: icmsg.GuardianEquipDecomposeRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._selectIds.forEach(id => {
                GuardianUtils.removeEquipById(id, false)
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
            let info = this.list.datas[i].guardianEqInfo as icmsg.GuardianEquip
            if (info.star > 1) {
                continue;
            }
            //let cfg = ConfigManager.getItemById(CostumeCfg, info.typeId);
            if (this._selectIds.indexOf(this.list.datas[i].id) == -1) {
                this._selectIds.push(this.list.datas[i].id)
                this.list.datas[i].selected = true
            }
        }
        if (this._selectIds.length == 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:ROLE_TIP52"))
            return
        }

        this.list.refresh_items()

        if (this._selectIds.length < this._maxNum) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:ROLE_TIP52"))
        }

        this._resetPreviewRsp(this._selectIds);
    }

}

export type ResetGuardianEqInfo = {
    id: number,
    guardianEqInfo: icmsg.GuardianEquip,
    selected: boolean,
}
