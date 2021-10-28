import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RuneMainViewCtrl from './RuneMainViewCtrl';
import RuneModel from '../../../../common/models/RuneModel';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem, BagType } from '../../../../common/models/BagModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RoleEventId } from '../../enum/RoleEventId';
import { RuneCfg, TipsCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-03 16:58:27 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneStrengthenPanelCtrl")
export default class RuneStrengthenPanelCtrl extends gdk.BasePanel {
    @property(UiSlotItem)
    targetSlot: UiSlotItem = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.Node)
    strengthenBtn: cc.Node = null;

    @property(cc.Node)
    oneKeyBtn: cc.Node = null;

    @property(cc.Node)
    attrNode: cc.Node = null;

    @property(cc.RichText)
    topLvTips: cc.RichText = null;

    @property(cc.Node)
    composeBtn: cc.Node = null;

    @property(cc.Node)
    noRuneTips: cc.Node = null;

    // @property(UiTabMenuCtrl)
    // uiTabMenu: UiTabMenuCtrl = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Label)
    lvMaxLab: cc.Label = null;

    get runeModel(): RuneModel { return ModelManager.get(RuneModel); }

    list: ListView;
    curSelectType: number;
    curRune: BagItem;
    openArg: icmsg.RuneInfo;
    onEnable() {
        let selectId = 0;
        let id = this.args[0];
        let cfg = ConfigManager.getItemById(RuneCfg, id ? parseInt(id.toString().slice(0, 6)) : id);
        if (cfg && cfg.color > 1) {
            this.openArg = id;
            selectId = cfg.color - 1;
        }
        // this.uiTabMenu.setSelectIdx(selectId, true);
        this._updateList();
        gdk.e.on(RoleEventId.RUNE_ADD, this._onRuneChange, this);
        gdk.e.on(RoleEventId.RUNE_REMOVE, this._onRuneChange, this);
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateCostNode, this);
        NetManager.on(icmsg.RoleUpdateRsp.MsgType, this._updateCostNode, this);
    }

    onDisable() {
        this.curSelectType = null;
        this.curRune = null;
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        this.spine.setCompleteListener(null);
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    selectById(runeInfo: icmsg.RuneInfo) {
        let selectId = 0;
        let cfg = ConfigManager.getItemById(RuneCfg, parseInt(runeInfo.id.toString().slice(0, 6)));
        if (cfg && cfg.color > 0) {
            this.openArg = runeInfo;
            selectId = cfg.color - 1;
        }
        this._updateList();
        // this.uiTabMenu.setSelectIdx(selectId, true);
    }

    onComposeBtnClick() {
        let cfg = ConfigManager.getItemById(RuneCfg, parseInt(this.curRune.itemId.toString().slice(0, 6)));
        let node = gdk.panel.get(PanelId.RuneMainPanel);
        let ctrl = node.getComponent(RuneMainViewCtrl);
        if (cfg.level == 140) {
            ctrl.uiTabMenu.setSelectIdx(2, true);
        }
        else {
            let id = ConfigManager.getItemByField(RuneCfg, 'type', cfg.type, { level: cfg.level + 1 }).rune_id;
            ctrl.uiTabMenu.setSelectIdx(1, true);
            // ctrl._onPanelShow = (node: cc.Node) => {
            //     if (!node) return;
            //     let runeMergeCtrl = node.getComponent(RuneMergePanelCtrl);
            //     runeMergeCtrl.selectById(id);
            //     ctrl._onPanelShow = null;
            // };
            // ctrl.tabMenu.setSelectIdx(1, true);
        }
    }

    onGetBtnClick() {
        //跳转符文获取界面
        // GlobalUtil.openGainWayTips(601101);
        JumpUtils.openView(716);
    }

    onStrengthenBtnClick() {
        this._strengthenReq(false);
    }

    onOneKeyStrengthenBtnClick() {
        this._strengthenReq(true);
    }

    _strengthenReq(top: boolean) {
        let cfg = ConfigManager.getItemById(RuneCfg, parseInt(this.curRune.itemId.toString().slice(0, 6)));
        let hasNum = BagUtils.getItemNumById(cfg.strengthening[0][0]);
        if (hasNum < cfg.strengthening[0][1]) {
            gdk.gui.showMessage(`${BagUtils.getConfigById(cfg.strengthening[0][0]).name}不足`);
            return;
        }
        let cb = () => {
            let req = new icmsg.RuneUpgradeReq();
            req.heroId = (<icmsg.RuneInfo>this.curRune.extInfo).heroId;
            req.runeId = this.curRune.itemId;
            req.top = top;
            NetManager.send(req, (resp: icmsg.RuneUpgradeRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                let runeInfo = new icmsg.RuneInfo();
                runeInfo.id = resp.aRuneId;
                runeInfo.heroId = resp.heroId;
                this.selectById(runeInfo);
                gdk.gui.showMessage(gdk.i18n.t('i18n:RUNE_TIP15'));
                this.spine.node.active = true;
                this.spine.setCompleteListener(() => {
                    this.spine.setCompleteListener(null);
                    this.spine.node.active = false;
                });
                this.spine.setAnimation(0, 'stand', true);
            });
        };
        if (top) {
            let costNum: number = cfg.strengthening[0][1];
            let topLv: number = cfg.level + 1;
            let nextCfg = ConfigManager.getItemByField(RuneCfg, 'id', cfg.id, { level: cfg.level + 1 });
            while (nextCfg &&
                nextCfg.strengthening &&
                nextCfg.strengthening.length > 0 &&
                hasNum >= costNum + nextCfg.strengthening[0][1]) {
                costNum += nextCfg.strengthening[0][1];
                topLv = nextCfg.level + 1;
                nextCfg = ConfigManager.getItemByField(RuneCfg, 'id', nextCfg.id, { level: nextCfg.level + 1 });
            }
            GlobalUtil.openAskPanel({
                descText: StringUtils.format(gdk.i18n.t('i18n:RUNE_TIP16'), costNum, topLv),
                sureCb: cb
            });
        }
        else {
            cb();
        }

    }

    // selectFunc(e: any, utype: any) {
    //     if (!e) return;
    //     if (this.curSelectType && this.curSelectType == utype) return;
    //     this.curSelectType = utype;
    //     this._updateList();
    // }

    _onRuneChange() {
        if (!this.curRune) return;
        this._updateTopView(this.curRune);
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
        this._initListView();
        let datas = [];
        let list1 = this.runeModel.runeInHeros;
        // let list2 = this.runeModel.runeItems;
        // list1 = list1.filter(item => {
        //     let cfg = ConfigManager.getItemById(RuneCfg, item.itemId);
        //     let cfgs = ConfigManager.getItemsByField(RuneCfg, 'type', cfg.type);
        //     let maxLv = cfgs[cfgs.length - 1].level;
        //     if (cfg.level < maxLv && cfg.color == this.curSelectType + 1) {
        //         return true;
        //     }
        // });
        // list2 = list2.filter(item => {
        //     let cfg = ConfigManager.getItemById(RuneCfg, item.itemId);
        //     let cfgs = ConfigManager.getItemsByField(RuneCfg, 'type', cfg.type);
        //     let maxLv = cfgs[cfgs.length - 1].level;
        //     if (cfg.level < maxLv && cfg.color == this.curSelectType + 1) {
        //         return true;
        //     }
        // });
        if (list1.length <= 0) {
            this._clickItem(null);
            this.scrollView.node.active = false;
            this.noRuneTips.active = true;
            this.noRuneTips.getChildByName('lab').getComponent(cc.Label).string = ConfigManager.getItemById(TipsCfg, 68).desc21;
        }
        else {
            this.scrollView.node.active = true;
            this.noRuneTips.active = false;
            let sortFunc = (a: BagItem, b: BagItem) => {
                let cfgA = ConfigManager.getItemById(RuneCfg, parseInt(a.itemId.toString().slice(0, 6)));
                let cfgB = ConfigManager.getItemById(RuneCfg, parseInt(b.itemId.toString().slice(0, 6)));
                if (cfgA.level == cfgB.level) {
                    return cfgA.id - cfgB.id;
                }
                else {
                    return cfgB.level - cfgA.level;
                }
            };
            list1.sort(sortFunc);
            // list2.sort(sortFunc);
            datas = [...list1];
            this.list.clear_items();
            this.list.set_data(datas);
            gdk.Timer.clearAll(this);
            gdk.Timer.callLater(this, () => {
                if (cc.isValid(this.node)) {
                    let idx = 0;
                    if (this.openArg) {
                        let cfg = ConfigManager.getItemById(RuneCfg, parseInt(this.openArg.id.toString().slice(0, 6)));
                        if (cfg && cfg.color > 0) {
                            for (let i = 0; i < datas.length; i++) {
                                if (datas[i].itemId == this.openArg.id && (<icmsg.RuneInfo>datas[i].extInfo).heroId == this.openArg.heroId) {
                                    idx = i;
                                    // this.openArg = null;
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
    }

    _clickItem(item: BagItem) {
        if (!item) {
            this.nameLab.string = '';
            this.costNode.active = false;
            this.strengthenBtn.active = false;
            this.oneKeyBtn.active = false;
            this.attrNode.active = false;
            this.targetSlot.node.active = false;
            this.topLvTips.node.active = false;
            this.composeBtn.active = false;
            this.lvMaxLab.node.active = false;
        }
        else {
            this.curRune = item;
            this._updateTopView(item);
        }
    }

    _updateTopView(item: BagItem) {
        this.costNode.active = true;
        this.attrNode.active = true;
        this.targetSlot.node.active = true;
        this.lvMaxLab.node.active = true;
        let cfg = ConfigManager.getItemById(RuneCfg, parseInt(item.itemId.toString().slice(0, 6)));
        this.nameLab.string = cfg.name;
        let colorInfo = BagUtils.getColorInfo(cfg.color);
        this.nameLab.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.nameLab.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline);
        this.lvLab.string = '.' + cfg.level + '';
        this.targetSlot.updateItemInfo(cfg.rune_id);
        this.targetSlot.onClick.on(() => {
            let type = BagUtils.getItemTypeById(cfg.rune_id);
            if (type == BagType.RUNE) {
                gdk.panel.setArgs(PanelId.RuneInfo, [item.itemId, null]);
                gdk.panel.open(PanelId.RuneInfo);
            }
            else {
                let itemInfo: BagItem = {
                    series: null,
                    itemId: cfg.rune_id,
                    itemNum: 1,
                    type: type,
                    extInfo: null
                }
                GlobalUtil.openItemTips(itemInfo);
            }
        }, this);
        //attrNode
        let nextCfg = ConfigManager.getItemByField(RuneCfg, 'type', cfg.type, { level: cfg.level + 1 });
        let oldInfos = [];
        let nextInfos = [];
        let str = ['level', 'hero_atk', 'hero_hp', 'hero_def', 'hero_hit', 'hero_dodge'];
        str.forEach((s, idx) => {
            if (nextCfg) {
                let data = nextCfg[s];
                if (data) {
                    nextInfos.push(data);
                    oldInfos.push(cfg[s] || 0);
                }
            }
            else {
                let data = cfg[s];
                if (data) {
                    oldInfos.push(cfg[s] || 0);
                }
            }
        });

        let nameStr = [
            gdk.i18n.t('i18n:RUNE_TIP5'),
            gdk.i18n.t('i18n:ATTR_NAME_ATK'),
            gdk.i18n.t('i18n:ATTR_NAME_HP'),
            gdk.i18n.t('i18n:ATTR_NAME_DEF'),
            gdk.i18n.t('i18n:ATTR_NAME_HIT'),
            gdk.i18n.t('i18n:ATTR_NAME_DODGE')
        ];
        this.attrNode.children.forEach((node, idx) => {
            let nameLab = node.getChildByName('name').getComponent(cc.Label);
            let oldVLab = node.getChildByName('old').getComponent(cc.Label);
            let arrow = node.getChildByName('arrow');
            let newVLab = node.getChildByName('new').getComponent(cc.Label);
            let oldInfo = oldInfos[idx];
            if (oldInfo) {
                node.active = true;
                nameLab.string = nameStr[idx];
                oldVLab.string = `${idx == 0 ? 'L' : ''}` + oldInfo + '';
                arrow.active = !!nextInfos[idx];
                newVLab.string = !!nextInfos[idx] ? `${idx == 0 ? 'L' : ''}` + `${nextInfos[idx]}` : '';
            }
            else {
                node.active = false;
            }
        });
        //topLv
        let topLv: number = cfg.level;
        while (nextCfg && nextCfg.strengthening && nextCfg.strengthening.length > 0) {
            topLv = nextCfg.level + 1;
            nextCfg = ConfigManager.getItemByField(RuneCfg, 'id', nextCfg.id, { level: nextCfg.level + 1 });
        }
        this.lvMaxLab.string = `(${gdk.i18n.t('i18n:RUNE_TIP35')}:L${topLv})`;
        //costNode
        this._updateCostNode();
    }

    _updateCostNode() {
        if (!this.curRune) return;
        let cfg = ConfigManager.getItemById(RuneCfg, parseInt(this.curRune.itemId.toString().slice(0, 6)));
        let nextCfg = ConfigManager.getItemByField(RuneCfg, 'id', cfg.id, { level: cfg.level + 1 });
        if (nextCfg) {
            this.strengthenBtn.active = true;
            this.oneKeyBtn.active = true;
            this.topLvTips.node.active = false;
            this.composeBtn.active = false;
            this.costNode.active = true;
            let hasNum = BagUtils.getItemNumById(cfg.strengthening[0][0]);
            let labNode = cc.find('layout/costLab', this.costNode);
            GlobalUtil.setSpriteIcon(this.node, cc.find('layout/icon', this.costNode), GlobalUtil.getIconById(cfg.strengthening[0][0]));
            labNode.getComponent(cc.Label).string = `${GlobalUtil.numberToStr2(hasNum, true)}/${GlobalUtil.numberToStr2(cfg.strengthening[0][1], true)}`;
            labNode.color = hasNum >= cfg.strengthening[0][1] ? cc.color().fromHEX('#FFCE4B') : cc.color().fromHEX('#FF0000');
        }
        else {
            if (!ConfigManager.getItemByField(RuneCfg, 'type', cfg.type, { level: cfg.level + 1 })) {
                this.topLvTips.string = `<outline color=#271812 width=2><color=#DDBD93>${gdk.i18n.t('i18n:RUNE_TIP36')}</c></outline>`;
                this.composeBtn.active = false;
            }
            else {
                let str = [
                    gdk.i18n.t('i18n:RUNE_TIP39'),
                    gdk.i18n.t('i18n:RUNE_TIP40'),
                    gdk.i18n.t('i18n:RUNE_TIP41'),
                    gdk.i18n.t('i18n:RUNE_TIP42'),
                    gdk.i18n.t('i18n:RUNE_TIP43')
                ];
                let colorInfo = BagUtils.getColorInfo(cfg.color + 1);
                this.topLvTips.string = `<outline color=#271812 width=2><color=#DDBD93>${gdk.i18n.t('i18n:RUNE_TIP36')}，${cfg.color == 4 ? gdk.i18n.t('i18n:RUNE_TIP26') : gdk.i18n.t('i18n:BAG_TIP8')}${gdk.i18n.t('i18n:RUNE_TIP37')}</c><outline color=${colorInfo.outline} width=2><color=${colorInfo.color}>${str[cfg.color]}</color></outline><color=#DDBD93>${gdk.i18n.t('i18n:RUNE_TIP38')}</c></outline>`;
                this.composeBtn.active = true;
            }
            this.topLvTips.node.active = true;
            this.strengthenBtn.active = false;
            this.oneKeyBtn.active = false;
            this.costNode.active = false;
        }
    }
}
