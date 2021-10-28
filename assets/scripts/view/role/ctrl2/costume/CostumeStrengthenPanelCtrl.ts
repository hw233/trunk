import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CostumeModel from '../../../../common/models/CostumeModel';
import CostumeUtils from '../../../../common/utils/CostumeUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { AttrType, EquipAttrTYPE } from '../../../../common/utils/EquipUtils';
import { BagItem, BagType } from '../../../../common/models/BagModel';
import { Costume_attrCfg, Costume_costCfg, CostumeCfg } from '../../../../a/config';
import { CostumeTipsType } from './CostumeTipsCtrl';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RoleEventId } from '../../enum/RoleEventId';
/**
 * @Description: 神装
 * @Author: luoyong
 * @Date: 2019-03-28 14:49:36
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-14 18:11:01
 */


/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-03 16:58:27 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/costume/CostumeStrengthenPanelCtrl")
export default class CostumeStrengthenPanelCtrl extends gdk.BasePanel {
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

    @property(cc.Node)
    noCostumeTips: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Label)
    oldLvLab: cc.Label = null;

    @property(cc.Label)
    newLvLab: cc.Label = null;

    @property(cc.Node)
    lvArrow: cc.Node = null;

    get costumeModel(): CostumeModel { return ModelManager.get(CostumeModel); }

    list: ListView;
    curSelectType: number;
    curCostume: BagItem;
    openArg: icmsg.CostumeInfo;
    onEnable() {
        let selectId = 0;
        let id = this.args[0];
        // let cfg = ConfigManager.getItemById(RuneCfg, id);
        // if (cfg && cfg.color > 1) {
        //     this.openArg = id;
        //     selectId = cfg.color - 1;
        // }
        //this.uiTabMenu.setSelectIdx(selectId, true);
        this._updateList();
        gdk.e.on(RoleEventId.COSTUME_ADD, this._onCostumeChange, this);
        gdk.e.on(RoleEventId.COSTUME_REMOVE, this._onCostumeChange, this);
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateCostNode, this);
        NetManager.on(icmsg.RoleUpdateRsp.MsgType, this._updateCostNode, this);
    }

    onDisable() {
        this.curSelectType = null;
        this.curCostume = null;
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        this.spine.setCompleteListener(null);
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    selectById(costumeInfo: icmsg.CostumeInfo) {
        this.openArg = costumeInfo
        this._updateList();
    }

    onGetBtnClick() {
        JumpUtils.openView(2861);
    }

    onStrengthenBtnClick() {
        this._strengthenReq(false);
    }

    onOneKeyStrengthenBtnClick() {
        this._strengthenReq(true);
    }

    _strengthenReq(top: boolean) {
        let cfg = ConfigManager.getItemById(CostumeCfg, this.curCostume.itemId);
        let extInfo = this.curCostume.extInfo as icmsg.CostumeInfo
        let nextCfg = ConfigManager.getItemByField(Costume_costCfg, 'level', extInfo.level + 1)
        if (nextCfg && !nextCfg[`cost_${cfg.color}`]) {
            return
        }
        let hasNum = BagUtils.getItemNumById(nextCfg[`cost_${cfg.color}`][0][0]);
        if (hasNum < nextCfg[`cost_${cfg.color}`][0][1]) {
            gdk.gui.showMessage(`${BagUtils.getConfigById(nextCfg[`cost_${cfg.color}`][0][0]).name}不足`);
            return;
        }
        let cb = () => {
            let info = CostumeUtils.getHeroInfoBySeriesId(this.curCostume.series)
            let req = new icmsg.CostumeUpgradeReq();
            req.heroId = info ? info.heroId : 0
            req.costumeId = this.curCostume.series;
            req.top = top;
            NetManager.send(req, (rsp: icmsg.CostumeUpgradeRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                gdk.gui.showMessage(gdk.i18n.t("i18n:ROLE_TIP17"));
                this._updateList();
                (this.curCostume.extInfo as icmsg.CostumeInfo) = rsp.costume
                this._updateTopView(this.curCostume)
                this.openArg = this.curCostume.extInfo as icmsg.CostumeInfo
                this.spine.node.active = true;
                this.spine.setCompleteListener(() => {
                    this.spine.setCompleteListener(null);
                    this.spine.node.active = false;
                });
                this.spine.setAnimation(0, 'stand', true);
            });
        };
        if (top) {
            let costNum: number = 0
            let topLv: number = extInfo.level + 1
            let nextCfg = ConfigManager.getItemByField(Costume_costCfg, 'level', extInfo.level + 1);
            let name = ''
            while (nextCfg &&
                nextCfg[`cost_${cfg.color}`] &&
                nextCfg[`cost_${cfg.color}`].length > 0 &&
                hasNum >= costNum + nextCfg[`cost_${cfg.color}`][0][1]) {
                costNum += nextCfg[`cost_${cfg.color}`][0][1];
                topLv = nextCfg.level;
                nextCfg = ConfigManager.getItemByField(Costume_costCfg, 'level', nextCfg.level + 1);
                if (name == '') {
                    let itemCfg = BagUtils.getConfigById(nextCfg[`cost_${cfg.color}`][0][0])
                    name = itemCfg.name
                }
            }

            GlobalUtil.openAskPanel({
                descText: StringUtils.format(gdk.i18n.t("i18n:ROLE_TIP18"), costNum, name, topLv),
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

    _onCostumeChange() {
        if (!this.curCostume) return;
        this._updateTopView(this.curCostume);
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
        let list1 = this.costumeModel.costumeInHeros;
        if (list1.length <= 0) {
            this._clickItem(null);
            this.scrollView.node.active = false;
            this.noCostumeTips.active = true;
            this.oldLvLab.node.parent.active = false
            this.noCostumeTips.getChildByName('lab').getComponent(cc.Label).string = gdk.i18n.t("i18n:ROLE_TIP19")
        }
        else {
            this.scrollView.node.active = true;
            this.noCostumeTips.active = false;
            let sortFunc = (a: BagItem, b: BagItem) => {
                let cfgA = ConfigManager.getItemById(CostumeCfg, a.itemId);
                let cfgB = ConfigManager.getItemById(CostumeCfg, b.itemId);
                if ((a.extInfo as icmsg.CostumeInfo).level == (b.extInfo as icmsg.CostumeInfo).level) {
                    return cfgB.color - cfgA.color;
                }
                else {
                    return (b.extInfo as icmsg.CostumeInfo).level - (a.extInfo as icmsg.CostumeInfo).level;
                }
            };
            list1.sort(sortFunc);
            datas = [...list1];
            this.list.clear_items();
            this.list.set_data(datas);
            gdk.Timer.clearAll(this);
            gdk.Timer.callLater(this, () => {
                if (cc.isValid(this.node)) {
                    let idx = 0;
                    if (this.openArg) {
                        for (let i = 0; i < datas.length; i++) {
                            if ((<icmsg.CostumeInfo>datas[i].extInfo).id == this.openArg.id) {
                                idx = i;
                                break;
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
        }
        else {
            this.curCostume = item;
            this._updateTopView(item);
        }
    }

    _updateTopView(item: BagItem) {
        this.costNode.active = true;
        this.attrNode.active = true;
        this.targetSlot.node.active = true;
        let cfg = ConfigManager.getItemById(CostumeCfg, item.itemId);
        this.nameLab.string = cfg.name;
        let colorInfo = BagUtils.getColorInfo(cfg.color);
        this.nameLab.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.nameLab.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline);
        this.lvLab.string = '.' + (item.extInfo as icmsg.CostumeInfo).level + '';
        this.targetSlot.updateItemInfo(cfg.id);
        this.targetSlot.updateStar(cfg.star)
        this.targetSlot.starNum = cfg.star
        this.targetSlot.onClick.off(this._clickTopItem, this)
        this.targetSlot.onClick.on(this._clickTopItem, this);
        //attrNode
        let attrArr = CostumeUtils.getCostumeAttrNum(item)
        let costumeInfo = item.extInfo as icmsg.CostumeInfo
        let attr_cfg = ConfigManager.getItemByField(Costume_attrCfg, 'type', cfg.type, { color: cfg.color, star: cfg.star });
        this.oldLvLab.string = `L${costumeInfo.level}`
        this.newLvLab.string = `L${Math.min(costumeInfo.level + 1, cfg.lv_limit)}`

        this.lvArrow.active = true
        this.newLvLab.node.active = true
        if (costumeInfo.level >= cfg.lv_limit) {
            this.lvArrow.active = false
            this.newLvLab.node.active = false
        }
        this.attrNode.children.forEach((node, idx) => {
            let nameLab = node.getChildByName('name').getComponent(cc.Label);
            let oldVLab = node.getChildByName('old').getComponent(cc.Label);
            let arrow = node.getChildByName('arrow');
            let newVLab = node.getChildByName('new').getComponent(cc.Label);
            let attr: AttrType = attrArr[idx];
            if (attr) {
                node.active = true;
                nameLab.string = attr.name;
                let value = `${attr.value}`
                if (attr.type == EquipAttrTYPE.R) {
                    value = `${Number(attr.value / 100).toFixed(1)}%`
                }
                oldVLab.string = value
                let target_arrCfg = ConfigManager.getItemById(Costume_attrCfg, attr.id);
                let newValue = `${Math.floor(attr.initValue * (10000 + costumeInfo.level * target_arrCfg.group) / 10000)}`
                if (attr.type == EquipAttrTYPE.R) {
                    newValue = `${(Math.floor(attr.initValue * (10000 + costumeInfo.level * target_arrCfg.group) / 10000) / 100).toFixed(1)}% `
                }
                newVLab.string = newValue
                arrow.active = true
                newVLab.node.active = true
                if (costumeInfo.level >= cfg.lv_limit) {
                    arrow.active = false
                    newVLab.node.active = false
                }
            }
            else {
                node.active = false;
            }
        });
        //costNode
        this._updateCostNode();
    }

    _clickTopItem() {
        let type = BagUtils.getItemTypeById(this.curCostume.itemId);
        if (type == BagType.COSTUME) {
            let tipsInfo: CostumeTipsType = {
                itemInfo: this.curCostume,
                from: PanelId.Bag.__id__,
            };
            gdk.panel.open(PanelId.CostumeTips, null, null, { args: tipsInfo });
        }
        else {
            let itemInfo: BagItem = {
                series: null,
                itemId: this.curCostume.itemId,
                itemNum: 1,
                type: type,
                extInfo: null
            }
            GlobalUtil.openItemTips(itemInfo);
        }
    }

    _updateCostNode() {
        if (!this.curCostume) return;
        let cfg = ConfigManager.getItemById(CostumeCfg, this.curCostume.itemId);
        let extInfo = this.curCostume.extInfo as icmsg.CostumeInfo
        let nextCfg = ConfigManager.getItemByField(Costume_costCfg, 'level', extInfo.level + 1)
        if (nextCfg && nextCfg[`cost_${cfg.color}`]) {
            this.strengthenBtn.active = true;
            this.oneKeyBtn.active = true;
            this.costNode.active = true;
            let hasNum = BagUtils.getItemNumById(nextCfg[`cost_${cfg.color}`][0][0]);
            let labNode = cc.find('layout/costLab', this.costNode);
            GlobalUtil.setSpriteIcon(this.node, cc.find('layout/icon', this.costNode), GlobalUtil.getIconById(nextCfg[`cost_${cfg.color}`][0][0]));
            labNode.getComponent(cc.Label).string = `${GlobalUtil.numberToStr2(hasNum, true)} /${GlobalUtil.numberToStr2(nextCfg[`cost_${cfg.color}`][0][1], true)}`;
            labNode.color = hasNum >= nextCfg[`cost_${cfg.color}`][0][1] ? cc.color().fromHEX('#FFCE4B') : cc.color().fromHEX('#FF0000');
        } else {
            this.strengthenBtn.active = false;
            this.oneKeyBtn.active = false;
            this.costNode.active = false;
        }
    }
}
