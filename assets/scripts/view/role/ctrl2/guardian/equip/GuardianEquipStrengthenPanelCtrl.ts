import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import CostumeUtils from '../../../../../common/utils/CostumeUtils';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GuardianEquipBreakPanelCtrl from './GuardianEquipBreakPanelCtrl';
import GuardianEquipOperateViewCtrl from './GuardianEquipOperateViewCtrl';
import GuardianModel from '../../../model/GuardianModel';
import GuardianUtils from '../GuardianUtils';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import StringUtils from '../../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { AttrType, EquipAttrTYPE } from '../../../../../common/utils/EquipUtils';
import { BagItem, BagType } from '../../../../../common/models/BagModel';
import { Guardian_equip_lvCfg, Guardian_equip_starCfg, Guardian_equipCfg } from '../../../../../a/config';
import { GuardianEquipTipsType } from './GuardianEquipTipsCtrl';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
import { RoleEventId } from '../../../enum/RoleEventId';

const { ccclass, property, menu } = cc._decorator;
/** 
 * @Description: 
 * @Author:luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-20 11:17:49
 */
export type GuardianEquipItemInfo = {
    heroId: number,
    heroTypeId: number,
    guardianId: number,
    guardianTypeId: number,
    bagItem: BagItem,
    selected: boolean,
    power?: number,
}



@ccclass
@menu("qszc/view/role2/guardian/equip/GuardianEquipStrengthenPanelCtrl")
export default class GuardianEquipStrengthenPanelCtrl extends gdk.BasePanel {

    @property(UiSlotItem)
    targetSlot: UiSlotItem = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    @property(cc.Prefab)
    costItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    strengthenBtn: cc.Node = null;

    @property(cc.Node)
    oneKeyBtn: cc.Node = null;

    @property(cc.Node)
    attrNode: cc.Node = null;

    @property(cc.Node)
    noEquipTips: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Label)
    oldLvLab: cc.Label = null;

    @property(cc.Label)
    newLvLab: cc.Label = null;

    @property(cc.Node)
    lvArrow: cc.Node = null;

    @property(cc.Label)
    strengthLab: cc.Label = null;

    @property(cc.Label)
    strengthTipLab: cc.Label = null;

    @property(cc.Node)
    breakTip: cc.Node = null;

    @property(sp.Skeleton)
    spineEffect: sp.Skeleton = null;

    get guardianModel(): GuardianModel { return ModelManager.get(GuardianModel); }

    list: ListView;
    //curSelectType: number;
    curGuardianEquip: GuardianEquipItemInfo;
    openArg: icmsg.GuardianEquip;


    _equipCfg: Guardian_equipCfg
    _extInfo: icmsg.GuardianEquip
    _lvCfg: Guardian_equip_lvCfg
    _starCfg: Guardian_equip_starCfg
    _curLv: number = 0

    onEnable() {
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateList, this);
        NetManager.on(icmsg.RoleUpdateRsp.MsgType, this._updateList, this);
        this._updateList();
    }

    onDisable() {
        //this.curSelectType = null;
        this.curGuardianEquip = null;
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        gdk.e.targetOff(this);
        NetManager.targetOff(this);
    }

    selectById(equipInfo: icmsg.GuardianEquip) {
        this.openArg = equipInfo
        this.guardianModel.curSelectGuardianEquip = null
        this._updateList();
    }


    onStrengthenBtnClick() {
        this._strengthenReq(false);
    }

    onOneKeyStrengthenBtnClick() {
        this._strengthenReq(true);
    }

    _strengthenReq(top: boolean) {
        if (this._extInfo.level >= this._starCfg.limit) {
            gdk.gui.showMessage("已达等级上限")
            return
        }
        let costItems = this._lvCfg.consumption
        for (let i = 0; i < costItems.length; i++) {
            let hasNum = BagUtils.getItemNumById(costItems[i][0]);
            if (hasNum < costItems[i][1]) {
                gdk.gui.showMessage(`${BagUtils.getConfigById(costItems[i][0]).name}不足`);
                return;
            }
        }

        let cb = () => {
            // let info = CostumeUtils.getHeroInfoBySeriesId(this.curCostume.series)
            // let req = new icmsg.CostumeUpgradeReq();
            // req.heroId = info ? info.heroId : 0
            // req.costumeId = this.curCostume.series;
            // req.top = top;
            // NetManager.send(req, (rsp: icmsg.CostumeUpgradeRsp) => {
            //     if (!cc.isValid(this.node)) return;
            //     if (!this.node.activeInHierarchy) return;
            //     gdk.gui.showMessage(gdk.i18n.t("i18n:ROLE_TIP17"));
            //     this._updateList();
            //     (this.curCostume.extInfo as icmsg.CostumeInfo) = rsp.costume
            //     this._updateTopView(this.curCostume)
            //     this.openArg = this.curCostume.extInfo as icmsg.CostumeInfo
            // });
            let target = new icmsg.GuardianInHero()
            target.heroId = this.curGuardianEquip.heroId
            target.guardianId = this.curGuardianEquip.guardianId

            let msg = new icmsg.GuardianEquipLevelUpReq()
            msg.target = target
            msg.part = this._equipCfg.part
            msg.top = top
            NetManager.send(msg, (data: icmsg.GuardianEquipLevelUpRsp) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                gdk.gui.showMessage(gdk.i18n.t("i18n:ROLE_TIP17"));
                GuardianUtils.updateGuardian(data.guardian.id, data.guardian)
                this.openArg = this.curGuardianEquip.bagItem.extInfo as icmsg.GuardianEquip
                this.spineEffect.node.active = true
                this.spineEffect.setAnimation(0, "stand", false)
                this.spineEffect.setCompleteListener(() => {
                    this.spineEffect.setCompleteListener(null);
                    this.spineEffect.node.active = false;
                });
                this._updateList();
            })
        };
        if (top) {
            // let costNum: number = 0
            // let topLv: number = extInfo.level + 1
            // let nextCfg = ConfigManager.getItemByField(Costume_costCfg, 'level', extInfo.level + 1);
            // let name = ''
            // while (nextCfg &&
            //     nextCfg[`cost_${cfg.color}`] &&
            //     nextCfg[`cost_${cfg.color}`].length > 0 &&
            //     hasNum >= costNum + nextCfg[`cost_${cfg.color}`][0][1]) {
            //     costNum += nextCfg[`cost_${cfg.color}`][0][1];
            //     topLv = nextCfg.level;
            //     nextCfg = ConfigManager.getItemByField(Costume_costCfg, 'level', nextCfg.level + 1);
            //     if (name == '') {
            //         let itemCfg = BagUtils.getConfigById(nextCfg[`cost_${cfg.color}`][0][0])
            //         name = itemCfg.name
            //     }
            // }

            // GlobalUtil.openAskPanel({
            //     descText: StringUtils.format(gdk.i18n.t("i18n:ROLE_TIP18"), costNum, name, topLv),
            //     sureCb: cb
            // });
            cb();
        }
        else {
            cb();
        }

    }

    _onCostumeChange() {
        if (!this.curGuardianEquip) return;
        this._updateTopView(this.curGuardianEquip);
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
        let datas: GuardianEquipItemInfo[] = [];
        let list1 = this.guardianModel.guardianEquipInHeros
        if (list1.length <= 0) {
            this._clickItem(null);
            this.scrollView.node.active = false;
            this.noEquipTips.active = true;
            this.oldLvLab.node.parent.active = false
            // this.noEquipTips.getChildByName('lab').getComponent(cc.Label).string = gdk.i18n.t("i18n:ROLE_TIP19")
        }
        else {
            this.scrollView.node.active = true;
            this.noEquipTips.active = false;
            // let sortFunc = (a: BagItem, b: BagItem) => {
            //     let cfgA = ConfigManager.getItemById(CostumeCfg, a.itemId);
            //     let cfgB = ConfigManager.getItemById(CostumeCfg, b.itemId);
            //     if ((a.extInfo as icmsg.CostumeInfo).level == (b.extInfo as icmsg.CostumeInfo).level) {
            //         return cfgB.color - cfgA.color;
            //     }
            //     else {
            //         return (b.extInfo as icmsg.CostumeInfo).level - (a.extInfo as icmsg.CostumeInfo).level;
            //     }
            // };
            // list1.sort(sortFunc);
            datas = [...list1];
            // this.list.clear_items();
            this.list.set_data(datas, false);
            //gdk.Timer.clearAll(this);
            gdk.Timer.callLater(this, () => {
                if (cc.isValid(this.node)) {
                    let idx = 0;
                    if (this.openArg || this.guardianModel.curSelectGuardianEquip) {
                        for (let i = 0; i < datas.length; i++) {
                            let id = (<icmsg.GuardianEquip>datas[i].bagItem.extInfo).id
                            if ((this.openArg && id == this.openArg.id)
                                || (this.guardianModel.curSelectGuardianEquip && id == this.guardianModel.curSelectGuardianEquip.id)) {
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

    _clickItem(item: GuardianEquipItemInfo) {
        if (!item) {
            this.nameLab.string = '';
            this.costNode.active = false;
            this.strengthenBtn.active = false;
            this.oneKeyBtn.active = false;
            this.attrNode.active = false;
            this.targetSlot.node.active = false;
        }
        else {
            this.curGuardianEquip = item;

            this._updateTopView(item);
        }
    }

    _updateTopView(itemInfo: GuardianEquipItemInfo) {
        this.costNode.active = true;
        this.attrNode.active = true;
        this.targetSlot.node.active = true;

        this._equipCfg = ConfigManager.getItemById(Guardian_equipCfg, itemInfo.bagItem.itemId);
        this.nameLab.string = this._equipCfg.name;

        this._extInfo = itemInfo.bagItem.extInfo as icmsg.GuardianEquip
        this.guardianModel.curSelectGuardianEquip = this._extInfo

        this._starCfg = ConfigManager.getItemByField(Guardian_equip_starCfg, "star", this._extInfo.star, { type: this._equipCfg.type, part: this._equipCfg.part })
        this._curLv = Math.min(this._extInfo.level, this._starCfg.limit)
        this._lvCfg = ConfigManager.getItemByField(Guardian_equip_lvCfg, "type", this._equipCfg.type, { part: this._equipCfg.part, lv: this._curLv })
        this.strengthLab.string = `强化:${this._extInfo.level}/${this._starCfg.limit}`
        this.strengthTipLab.string = `(强化至+${this._starCfg.limit}可突破至${this._extInfo.star + 1}星)`

        let colorInfo = BagUtils.getColorInfo(this._starCfg.color);
        this.nameLab.node.color = new cc.Color().fromHEX(colorInfo.color);
        this.nameLab.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline);
        this.lvLab.string = '.' + this._extInfo.level + '';
        this.targetSlot.updateItemInfo(this._equipCfg.id);
        this.targetSlot.updateStar(this._extInfo.star)
        this.targetSlot.starNum = this._extInfo.star
        //attrNode
        let curAttrArr = GuardianUtils.getTargetEquipAttr(this._extInfo)

        let nextEquipInfo = new icmsg.GuardianEquip()
        nextEquipInfo.id = this._extInfo.id
        nextEquipInfo.level = this._extInfo.level + 1
        nextEquipInfo.star = this._extInfo.star
        nextEquipInfo.type = this._extInfo.type
        let nextAttrArr = GuardianUtils.getTargetEquipAttr(nextEquipInfo)

        this.oldLvLab.string = `L${this._extInfo.level}`
        this.newLvLab.string = `L${this._curLv + 1}`

        this.lvArrow.active = true
        this.newLvLab.node.active = true

        this.strengthenBtn.active = true
        this.oneKeyBtn.active = true
        this.costNode.active = true
        this.breakTip.active = false


        if (this._extInfo.level >= this._starCfg.limit) {
            this.lvArrow.active = false
            this.newLvLab.node.active = false
            this.strengthTipLab.string = ""

            this.costNode.active = false
            this.strengthenBtn.active = false
            this.oneKeyBtn.active = false
            this.breakTip.active = true
        }
        this.attrNode.children.forEach((node, idx) => {
            let nameLab = node.getChildByName('name').getComponent(cc.Label);
            let oldVLab = node.getChildByName('old').getComponent(cc.Label);
            let arrow = node.getChildByName('arrow');
            let newVLab = node.getChildByName('new').getComponent(cc.Label);
            let attr: AttrType = curAttrArr[idx];
            let nextArrr: AttrType = nextAttrArr[idx]
            if (attr) {
                let lvAddValue = this._lvCfg[`${attr.keyName.replace("_g", "")}_growth`]
                if (attr.initValue == 0 && lvAddValue == 0) {
                    node.active = false
                } else {
                    node.active = true;
                    nameLab.string = attr.name;
                    let value = attr.value + attr.initValue
                    oldVLab.string = `${value}`
                    arrow.active = true
                    newVLab.node.active = true
                    if (this._extInfo.level >= this._starCfg.limit) {
                        arrow.active = false
                        newVLab.node.active = false
                    } else {
                        if (nextArrr) {
                            newVLab.string = `${nextArrr.value + nextArrr.initValue}`
                        }
                    }
                }
            }
            else {
                node.active = false;
            }
        });

        this._updateCostNode();
    }

    _updateCostNode() {
        this.costNode.removeAllChildren()
        let costItems = this._lvCfg.consumption
        for (let i = 0; i < costItems.length; i++) {
            let item = cc.instantiate(this.costItemPrefab)
            item.scale = 0.8
            this.costNode.addChild(item)
            let ctrl = item.getComponent(UiSlotItem)
            let itemId = costItems[i][0]
            let needNum = costItems[i][1]
            ctrl.updateItemInfo(itemId)
            ctrl.itemInfo = {
                series: null,
                itemId: itemId,
                itemNum: 1,
                type: BagUtils.getItemTypeById(itemId),
                extInfo: null
            }
            let hasNum = BagUtils.getItemNumById(itemId)
            ctrl.UiNumLab.node.anchorX = 0.5
            ctrl.UiNumLab.node.x = 0
            ctrl.UiNumLab.node.active = true
            ctrl.UiNumLab.string = `${GlobalUtil.numberToStr(hasNum, true, true)}/${GlobalUtil.numberToStr(needNum, true, true)}`
            if (hasNum < costItems[i][1]) {
                ctrl.UiNumLab.node.color = cc.color("#ff0000")
            } else {
                ctrl.UiNumLab.node.color = cc.color("#ffffff")
            }
        }
    }

    onGotoBreakFunc() {
        gdk.panel.setArgs(PanelId.GuardianEquipOperateView, 0)
        gdk.panel.open(PanelId.GuardianEquipOperateView, (node) => {
            let e_ctrl = node.getComponent(GuardianEquipOperateViewCtrl);
            e_ctrl._onPanelShow = (node: cc.Node) => {
                if (!node) return;
                let ctrl = node.getComponent(GuardianEquipBreakPanelCtrl);
                ctrl.selectById(this.guardianModel.curSelectGuardianEquip)
                e_ctrl._onPanelShow = null;
            };
            e_ctrl.selectFunc(true, 0)
            e_ctrl.tabMenu.showSelect(0);
        })

    }

    onTopItemTip() {
        let bagItem: BagItem = {
            series: this._extInfo.id,
            itemId: this._extInfo.type,
            itemNum: 1,
            type: BagType.GUARDIANEQUIP,
            extInfo: this._extInfo,
        }
        //打开装备提示框
        let tipsInfo: GuardianEquipTipsType = {
            itemInfo: bagItem,
            from: PanelId.Bag.__id__,
        };
        gdk.panel.open(PanelId.GuardianEquipTips, null, null, { args: tipsInfo });
    }

    onGetFunc() {
        JumpUtils.openView(2898)
    }

}