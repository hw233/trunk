import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroResetViewCtrl from '../../../lottery/ctrl/HeroResetViewCtrl';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RuneModel from '../../../../common/models/RuneModel';
import StringUtils from '../../../../common/utils/StringUtils';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RoleEventId } from '../../enum/RoleEventId';
import { RuneCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-10 13:37:53 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneDecomposePanelCtrl")
export default class RuneDecomposePanelCtrl extends gdk.BasePanel {

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
    runeDecomposeItem: cc.Prefab = null

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

    _maxNum = 15
    _selectIds: string[] = []
    _datas: any = {}; // id-resetRuneInfo
    onEnable() {
        this._initListView()
        this._updateScroll();
        gdk.e.on(RoleEventId.RUNE_ADD, this._onRuneChange, this);
        gdk.e.on(RoleEventId.RUNE_REMOVE, this._onRuneChange, this);
    }

    onDisable() {
        gdk.e.targetOff(this)
        gdk.Timer.clearAll(this)
        NetManager.targetOff(this)
    }

    _onRuneChange() {
        this._updateScroll();
    }

    _heroResetPreviewRsp(selectIds: string[]) {
        this._initPreListView()
        this._updatePreState()
        let datas: any = {};
        selectIds.forEach(id => {
            let cfg = ConfigManager.getItemById(RuneCfg, parseInt(this._datas[id].runeInfo.id.toString().slice(0, 6)));
            let disintItem = cfg.disint_item;
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
            item_tpl: this.runeDecomposeItem,
            cb_host: this,
            column: 5,
            gap_x: 15,
            gap_y: 15,
            async: true,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._onHeroClick, this)
    }

    _onHeroClick(item: ResetRuneInfo) {
        let idIndex = this._selectIds.indexOf(item.id)
        if (idIndex == -1) {
            if (this._selectIds.length >= this._maxNum) {
                gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:RUNE_TIP1"), this._maxNum));
                return;
            }
            this._selectIds.push(item.id)
        } else {
            this._selectIds.splice(idIndex, 1)
        }

        let datas: ResetRuneInfo[] = this.list.datas
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
            this._heroResetPreviewRsp(this._selectIds);
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
        let items = ModelManager.get(RuneModel).runeItems;
        let tempList: ResetRuneInfo[] = [];
        this._datas = {};
        items.sort((a, b) => {
            let cfgA = ConfigManager.getItemById(RuneCfg, parseInt(a.itemId.toString().slice(0, 6)));
            let cfgB = ConfigManager.getItemById(RuneCfg, parseInt(b.itemId.toString().slice(0, 6)));
            if (cfgA.color == cfgB.color) {
                return cfgA.id - cfgB.id;
            }
            else {
                return cfgA.color - cfgB.color;
            }
        })
        items.forEach(item => {
            for (let i = 0; i < item.itemNum; i++) {
                let obj = {
                    id: (<icmsg.RuneInfo>item.extInfo).id.toString() + `_${i}`,  // runeId + idx
                    runeInfo: <icmsg.RuneInfo>item.extInfo,
                    selected: false,
                };
                tempList.push(obj)
                this._datas[obj.id] = obj;
            }
        });
        this.list.set_data(tempList)
        this.emptyTips.active = false
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
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:RUNE_TIP2"))
            return
        }

        let isTip = false
        for (let i = 0; i < this._selectIds.length; i++) {
            let cfg = ConfigManager.getItemById(RuneCfg, parseInt(this._datas[this._selectIds[i]].runeInfo.id.toString().slice(0, 6)));
            if (cfg.color >= 3) {
                isTip = true
                break
            }
        }

        if (isTip) {
            GlobalUtil.openAskPanel({
                title: gdk.i18n.t("i18n:TIP_TITLE"),
                descText: gdk.i18n.t("i18n:RUNE_TIP3"),
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
        let ids = {}; //id-runeInfo
        this._selectIds.forEach(id => {
            if (!ids[id]) {
                ids[id] = 0;
            }
            ids[id] += 1;
        });
        let infos: icmsg.RuneInfo[] = [];
        for (let key in ids) {
            let id = parseInt(key.split('_')[0]);
            // if (key.length >= 8) {
            //     id = parseInt(key.slice(0, 8));
            // }
            // else {
            //     id = parseInt(key.slice(0, 6));
            // }
            // let id = parseInt(key);
            let info = new icmsg.RuneInfo();
            info.id = id;
            info.num = ids[key];
            infos.push(info);
        }
        let msg = new icmsg.RuneDisintReq()
        msg.heroId = 0;
        msg.runes = infos;
        NetManager.send(msg, (data: icmsg.RuneDisintRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this._selectIds = []
            this._updateScroll();
            let panel = gdk.panel.get(PanelId.HeroResetView);
            if (panel) {
                let ctrl = panel.getComponent(HeroResetViewCtrl);
                let node = ctrl.runeScoreNode;
                let worldPos = node.parent.convertToWorldSpaceAR(node.getPosition());
                GlobalUtil.openRewadrView(data.goodsList, null, {
                    110010: worldPos
                });
                return;
            }
            GlobalUtil.openRewadrView(data.goodsList)
        }, this);
    }

    quickPutFunc() {
        for (let i = 0; i < this.list.datas.length; i++) {
            if (this._selectIds.length >= this._maxNum) {
                break
            }
            let info = this.list.datas[i].runeInfo as icmsg.RuneInfo
            let cfg = ConfigManager.getItemById(RuneCfg, parseInt(info.id.toString().slice(0, 6)));
            if (this._selectIds.indexOf(this.list.datas[i].id) == -1 && cfg.color <= 2) {
                this._selectIds.push(this.list.datas[i].id)
                this.list.datas[i].selected = true
            }
        }
        if (this._selectIds.length == 0) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:RUNE_TIP4"))
            return
        }

        this.list.refresh_items()

        if (this._selectIds.length < this._maxNum) {
            GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:RUNE_TIP4"))
        }

        this._heroResetPreviewRsp(this._selectIds);
    }
}

export type ResetRuneInfo = {
    id: string,
    runeInfo: icmsg.RuneInfo,
    selected: boolean,
}