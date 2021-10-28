import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyUtil from '../../../../common/utils/CopyUtil';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RuneModel from '../../../../common/models/RuneModel';
import RuneUtils from '../../../../common/utils/RuneUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import UiTabMenuCtrl from '../../../../common/widgets/UiTabMenuCtrl';
import { BagType } from '../../../../common/models/BagModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RoleEventId } from '../../enum/RoleEventId';
import { RuneCfg } from '../../../../a/config';
import { RuneEventId } from '../../enum/RuneEventId';
import { RuneMaterialType } from './RuneMaterialsSelectViewCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-10 16:23:29 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneMergePanelCtrl")
export default class RuneMergePanelCtrl extends gdk.BasePanel {
    @property(UiSlotItem)
    targetSlot: UiSlotItem = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(UiSlotItem)
    slot1: UiSlotItem = null;

    @property(UiSlotItem)
    slot2: UiSlotItem = null;

    @property(UiSlotItem)
    slot3: UiSlotItem = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    cfgs: RuneCfg[];
    curSelectType: number;
    curRuneCfg: RuneCfg;
    openArg: number;
    materialsSelectMap: any = {}; //  costType(0||1)-runeIds[]
    onLoad() {
        this.cfgs = ConfigManager.getItems(RuneCfg, (cfg: RuneCfg) => {
            if (cfg.consumption && cfg.consumption.length >= 1 && cfg.rune_id.toString().length == 6) {
                return true;
            }
        });
        this.cfgs.sort((a, b) => {
            if (a.color == b.color) {
                return a.id - b.id;
            }
            else {
                return a.color - b.color;
            }
        })
    }

    onEnable() {
        let selectId = 1;
        let id = this.args[0];
        let cfg = ConfigManager.getItemById(RuneCfg, id ? parseInt(id.toString().slice(0, 6)) : id);
        if (cfg && cfg.color > 1) {
            this.openArg = id;
            selectId = cfg.color - 1;
        }
        this.uiTabMenu.setSelectIdx(selectId, true);
        gdk.e.on(RoleEventId.RUNE_ADD, this._onRuneChange, this);
        gdk.e.on(RoleEventId.RUNE_REMOVE, this._onRuneChange, this);
        gdk.e.on(RuneEventId.RUNE_MERGE_MATERIALS_SELECT, this._onRuneSelect, this);
    }

    onDisable() {
        this.curSelectType = null;
        this.curRuneCfg = null;
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        gdk.e.targetOff(this);
    }

    selectById(id) {
        let selectId = 1;
        let cfg = ConfigManager.getItemById(RuneCfg, id ? parseInt(id.toString().slice(0, 6)) : id);
        if (cfg && cfg.color > 1) {
            this.openArg = id;
            selectId = cfg.color - 1;
        }
        this.uiTabMenu.setSelectIdx(selectId, true);
    }

    onComposeBtnClick() {
        if (!CopyUtil.isFbPassedById(this.curRuneCfg.unlock)) {
            gdk.gui.showMessage(`${gdk.i18n.t("i18n:RUNE_TIP9")}-${this.curRuneCfg.unlock_name}`);
            return;
        }

        if (!this.materialsSelectMap[0] || this.materialsSelectMap[0].length < this.curRuneCfg.consumption_main[0][1]) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:RUNE_TIP10'));
            return;
        }
        if (!this.materialsSelectMap[1] || this.materialsSelectMap[1].length < this.curRuneCfg.consumption_material[0][2]) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:RUNE_TIP11'));
            return;
        }
        let condition = this.curRuneCfg.consumption;
        for (let i = 0; i < condition.length; i++) {
            if (BagUtils.getItemNumById(condition[i][0]) < condition[i][1]) {
                gdk.gui.showMessage(`${BagUtils.getConfigById(condition[i][0]).name}${gdk.i18n.t('i18n:RELIC_TIP11')}`);
                // GlobalUtil.openGainWayTips(condition[i][0]);
                return;
            }
        }

        let list: icmsg.RuneInfo[] = [];
        // for (let key in this.materialsSelectMap) {
        //后端只需要材料符文
        let ids: number[] = this.materialsSelectMap[1];
        ids.forEach(id => {
            let info = new icmsg.RuneInfo();
            info.id = parseInt(id.toString().slice(0, 6));
            info.num = 1;
            info.heroId = 0;
            list.push(info);
        });
        // }

        let heroId: number = 0;
        this.materialsSelectMap[0].forEach(id => {
            //英雄身上customRuneId: runeId + heroTypeId + heroId  7+6+n
            let hId = parseInt(id.toString().slice(12)) || 0;
            if (hId > 0) {
                heroId = hId;
            }
        })

        let req = new icmsg.RuneComposeReq();
        req.runeId = this.curRuneCfg.rune_id;
        req.list = list;
        req.heroId = heroId;
        NetManager.send(req, (resp: icmsg.RuneComposeRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            let goodList = [...resp.goodsList];
            if (resp.heroId > 0) {
                let g = new icmsg.GoodsInfo();
                g.typeId = resp.runeId;
                g.num = 1;
                goodList.push(g);
            }
            GlobalUtil.openRewadrView(goodList);
            this.materialsSelectMap = {};
            this._updateMaterials();
        }, this);
    }

    selectFunc(e: any, utype: any) {
        if (!e) return;
        if (this.curSelectType && this.curSelectType == utype) return;
        this.curSelectType = utype;
        this._updateList();
    }

    _onRuneChange() {
        this._updateTopView(this.curRuneCfg);
    }

    _onRuneSelect(e) {
        this.materialsSelectMap = e.data[0];
        this._updateTopView(this.curRuneCfg);
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.itemPrefab,
            cb_host: this,
            async: true,
            column: 5,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._clickItem, this)
    }

    _updateList() {
        gdk.Timer.clearAll(this);
        this._initListView();
        let lock = [];
        let unlock = [];
        let datas = [];
        this.cfgs.sort((a, b) => { return a.id - b.id; });
        this.cfgs.forEach(cfg => {
            if (cfg.color == this.curSelectType + 1) {
                if (CopyUtil.isFbPassedById(cfg.unlock)) {
                    unlock.push(cfg);
                }
                else {
                    lock.push(cfg);
                }
            }
        })
        datas = [...unlock, ...lock];
        this.list.clear_items();
        this.list.set_data(datas);
        gdk.Timer.callLater(this, () => {
            if (cc.isValid(this.node)) {
                let idx = 0;
                if (this.openArg) {
                    let cfg = ConfigManager.getItemById(RuneCfg, parseInt(this.openArg.toString().slice(0, 6)));
                    if (cfg && cfg.color > 1) {
                        for (let i = 0; i < datas.length; i++) {
                            if (datas[i].id == this.openArg) {
                                idx = i;
                                this.openArg = null;
                                break;
                            }
                        }
                    }
                }
                this.list.select_item(idx);
                this.list.scroll_to(idx);
            }
        });
    }

    _clickItem(item: RuneCfg) {
        if (!item) return
        this.curRuneCfg = item;
        this.materialsSelectMap = {};
        this._updateTopView(item);
    }

    _updateTopView(cfg: RuneCfg) {
        this.targetSlot.updateItemInfo(cfg.rune_id);
        this.targetSlot.node.getChildByName('lv').getComponent(cc.Label).string = '.' + cfg.level;
        this.targetSlot.onClick.on(() => {
            let type = BagUtils.getItemTypeById(cfg.rune_id);
            if (type == BagType.RUNE) {
                gdk.panel.setArgs(PanelId.RuneInfo, [cfg.rune_id, null, null]);
                gdk.panel.open(PanelId.RuneInfo);
            }
        }, this);
        this.nameLab.string = cfg.name;
        let colorInfo = BagUtils.getColorInfo(cfg.color);
        this.nameLab.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.nameLab.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline);
        this._updateMaterials();
    }

    _updateMaterials() {
        if (!this.curRuneCfg) return;
        // 主符文/材料符文
        let infos = [this.curRuneCfg.consumption_main[0], this.curRuneCfg.consumption_material[0]];
        [this.slot1, this.slot2].forEach((slot, idx) => {
            let node = slot.node;
            let info = infos[idx];
            let selectNum = this.materialsSelectMap[idx] ? this.materialsSelectMap[idx].length : 0;
            let needNum = idx == 1 ? info[2] : info[1];
            node.getChildByName('addBtn').active = selectNum !== needNum;
            let color = ConfigManager.getItemById(RuneCfg, this.curRuneCfg.consumption_main[0][0]).color;
            if (idx == 1) {
                let commonRune = node.getChildByName('common');
                if (info[0] == 0) {
                    commonRune.active = true;
                    GlobalUtil.setSpriteIcon(this.node, commonRune, `common/texture/sub_itembg0${color}`);
                    node.getChildByName('addBtn').active = false;
                }
                else {
                    commonRune.active = false;
                    let id = ConfigManager.getItemByField(RuneCfg, 'type', info[0] || 1, { color: info[1] || 1 }).rune_id;
                    slot.updateItemInfo(id);
                }
            }
            else {
                slot.updateItemInfo(info[0]);
            }
            let redPoint = node.getChildByName('RedPoint');
            redPoint.active = this.is_enough_to_select(this.curRuneCfg, idx);
            let lab = node.getChildByName('lab');
            let colorInfo = BagUtils.getColorInfo(color);
            lab.color = new cc.Color().fromHEX(colorInfo.color);
            lab.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline);
            let bar = node.getChildByName('barBg');
            bar.getChildByName('bar').getComponent(cc.ProgressBar).progress = selectNum / needNum;
            bar.getChildByName('numLab').getComponent(cc.Label).string = `${selectNum}/${needNum}`;
            let type: RuneMaterialType = {
                targetRuneId: this.curRuneCfg.rune_id,
                costTpye: idx
            }
            slot.onClick.on(() => {
                //todo 打开材料选择界面
                gdk.panel.setArgs(PanelId.RuneMaterialsSelectView, [type, JSON.parse(JSON.stringify(this.materialsSelectMap))]);
                gdk.panel.open(PanelId.RuneMaterialsSelectView);
            });
        });
        //符文积分
        this._updateScore();
        //金币
        this._updateMoney();
    }

    _updateScore() {
        let info = this.curRuneCfg.consumption[0];
        this.slot3.updateItemInfo(info[0]);
        let bar = this.slot3.node.getChildByName('barBg');
        bar.getChildByName('numLab').getComponent(cc.Label).string = `${BagUtils.getItemNumById(info[0])}/${info[1]}`;
        bar.getChildByName('numLab').color = BagUtils.getItemNumById(info[0]) >= info[1] ? new cc.Color().fromHEX('#FFCE4B') : new cc.Color().fromHEX('#FF0000');
        this.slot3.itemInfo = {
            series: null,
            itemId: info[0],
            itemNum: 1,
            type: BagUtils.getItemTypeById(info[0]),
            extInfo: null
        };
    }

    _updateMoney() {
        let info = this.curRuneCfg.consumption[1];
        GlobalUtil.setSpriteIcon(this.node, this.costNode.getChildByName('icon'), GlobalUtil.getIconById(info[0]));
        this.costNode.getChildByName('costLab').getComponent(cc.Label).string = `${GlobalUtil.numberToStr(BagUtils.getItemNumById(info[0]), true)}/${GlobalUtil.numberToStr(info[1], true)}`;
        this.costNode.getChildByName('costLab').color = BagUtils.getItemNumById(info[0]) >= info[1] ? new cc.Color().fromHEX('#FFCE4B') : new cc.Color().fromHEX('#FF0000');
    }


    /**
     * 主符文/材料符文的选择红点
     * @param cfg 合成符文
     * @param type 0-主符文 1-材料符文
     */
    is_enough_to_select(cfg: RuneCfg, type: number) {
        // if (!JumpUtils.ifSysOpen(2855)) return false;
        // if (!CopyUtil.isFbPassedById(cfg.unlock)) {
        //     return false;
        // }
        let heroItemsIds = [];
        ModelManager.get(RuneModel).runeInHeros.forEach(item => {
            if (item.itemId == cfg.consumption_main[0][0]) {
                let heroId = (<icmsg.RuneInfo>item.extInfo).heroId;
                let customId = parseInt(`${item.itemId}${HeroUtils.getHeroInfoByHeroId(heroId).typeId}${heroId}`);
                heroItemsIds.push(customId);
            }
        });
        let mainSeletIds = this.materialsSelectMap[0] || [];
        let matiralsSeletIds = this.materialsSelectMap[1] || [];
        if (type == 0) {
            if (mainSeletIds.length >= cfg.consumption_main[0][1]) {
                return false; //已选择
            }
            let mainItems = [RuneUtils.getRuneData(cfg.consumption_main[0][0])];
            let mainItemIds: number[] = [...heroItemsIds];
            mainItems.forEach(item => {
                if (item) {
                    let num = item.itemNum;
                    let id = item.itemId;
                    for (let i = 0; i < num; i++) {
                        let customId = parseInt(`${id}${i}`); // id+idx 同一道具保证id的唯一性  固定前6位为id
                        if (mainItemIds.indexOf(customId) == -1) {
                            if ([...mainSeletIds, ...matiralsSeletIds].indexOf(customId) == -1) {
                                mainItemIds.push(customId); //未被主符文或材料符文选择
                            }
                        }
                    }
                }
            });
            return mainItemIds.length + mainSeletIds.length >= cfg.consumption_main[0][1]
        }
        else {
            if (matiralsSeletIds.length >= cfg.consumption_material[0][2]) {
                return false; //已选择
            }
            let matiralsItem = RuneUtils.getMaterialsRune(cfg.consumption_material[0]);
            let matiralsItemIds: number[] = [];
            matiralsItem.forEach(item => {
                if (item) {
                    let num = item.itemNum;
                    let id = item.itemId;
                    for (let i = 0; i < num; i++) {
                        let customId = parseInt(`${id}${i}`); // id+idx 同一道具保证id的唯一性  固定前6位为id
                        if ([...mainSeletIds, ...matiralsSeletIds].indexOf(customId) == -1 &&
                            matiralsItemIds.indexOf(customId) == -1) {
                            matiralsItemIds.push(customId);
                        }
                    }
                }
            });
            return matiralsItemIds.length + matiralsSeletIds.length >= cfg.consumption_material[0][2]
        }
    }
}
