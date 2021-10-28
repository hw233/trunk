import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import EquipViewCtrl2 from '../../equip/EquipViewCtrl2';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import GuardianEquipBreakPanelCtrl from './GuardianEquipBreakPanelCtrl';
import GuardianEquipOperateViewCtrl from './GuardianEquipOperateViewCtrl';
import GuardianEquipStrengthenPanelCtrl from './GuardianEquipStrengthenPanelCtrl';
import GuardianModel from '../../../model/GuardianModel';
import GuardianUtils from '../GuardianUtils';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../../common/utils/JumpUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../../common/utils/RedPointUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { AttrType } from '../../../../../common/utils/EquipUtils';
import { BagItem, BagType } from '../../../../../common/models/BagModel';
import {
    Global_powerCfg,
    Guardian_equip_skillCfg,
    Guardian_equipCfg,
    Guardian_starCfg,
    GuardianCfg
    } from '../../../../../a/config';
import { GuardianEquipTipsType } from './GuardianEquipTipsCtrl';
import { GuardianItemInfo } from '../GuardianListCtrl';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
import { RoleEventId } from '../../../enum/RoleEventId';
import { SelectInfo } from '../../main/equip/EquipSelectCtrl2';
import { type } from 'os';

const { ccclass, property, menu } = cc._decorator;
/** 
 * @Description: 
 * @Author: luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-20 11:23:53
 */

export type GuardianEquipAttr = {
    atk: number,
    hp: number,
    def: number,
    hit: number,
    dodge: number,
}



@ccclass
@menu("qszc/view/role2/guardian/equip/GuardianEquipPanelCtrl")
export default class GuardianEquipPanelCtrl extends gdk.BasePanel {

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    starLabel: cc.Label = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    attrNodes: cc.Node[] = [];

    @property(cc.Node)
    suitContent: cc.Node = null

    @property(cc.Node)
    suitNode: cc.Node = null

    @property(cc.Node)
    starNode: cc.Node = null

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    topNode: cc.Node = null;

    @property(cc.Node)
    equipNodes: Array<cc.Node> = [];

    @property(cc.Node)
    tipNode: cc.Node = null;

    equipCtrls: Array<UiSlotItem> = [];

    list: ListView = null

    _cfg: GuardianCfg
    _starCfg: Guardian_starCfg
    _extInfo: icmsg.Guardian
    _isSelect: boolean = false

    get guardianModel(): GuardianModel {
        return ModelManager.get(GuardianModel)
    }

    get heroModel(): HeroModel {
        return ModelManager.get(HeroModel)
    }

    onEnable() {
        // 点击事件
        for (let index = 0; index < this.equipNodes.length; index++) {
            const element = this.equipNodes[index];
            this.equipCtrls[index] = element.getComponent(UiSlotItem);
            element.on(cc.Node.EventType.TOUCH_END, () => {
                this._equipClick(index + 1);
            }, this);
        }

        gdk.e.on(RoleEventId.ROLE_ATT_UPDATE, this._updateViewInfo, this)
        gdk.e.on(RoleEventId.GUARDIAN_INHERO_EQUIP_UPDATE, this._updateEquipInfo, this)
        gdk.e.on(RoleEventId.GUARDIANEQUIP_UPDATE, this._updateEquipInfo, this)
        NetManager.on(icmsg.GuardianEquipOffRsp.MsgType, this._onGuardianEquipOffRsp, this)
        NetManager.on(icmsg.GuardianEquipOnRsp.MsgType, this._onGuardianEquipOnRsp, this)
        this._updateViewInfo()

    }

    _onGuardianEquipOffRsp(data: icmsg.GuardianEquipOffRsp) {
        GuardianUtils.updateGuardian(data.guardian.id, data.guardian)
        this._updateEquipInfo()
    }

    _onGuardianEquipOnRsp(data: icmsg.GuardianEquipOnRsp) {
        GuardianUtils.updateGuardian(data.guardian.id, data.guardian)
        this._updateEquipInfo()
    }

    onDisable() {
        gdk.e.targetOff(this)
        NetManager.targetOff(this)
        // this.guardianModel.curHeroId = 0
        // this.guardianModel.curGuardianId = 0
    }

    /**
    * 点击播放idle动作
    */
    _isClickHero = false;
    playHeroIdleAni() {
        if (this.spine && this.spine.skeletonData) {
            if (!this._isClickHero) {
                this._isClickHero = true
                // 英雄动画
                this.spine.setAnimation(0, "idle", false);
                this.spine.setCompleteListener(() => {
                    if (!cc.isValid(this.node)) return;
                    this._isClickHero = false;
                    this.spine.setCompleteListener(null);
                    this.spine.setAnimation(0, "stand", true);
                });
            }
        }
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
            column: 5,
            gap_x: 15,
            gap_y: 15,
            async: true,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._selectItem, this)
    }

    _selectItem(itemInfo: GuardianItemInfo, index: number) {
        for (let i = 0; i < this.list.datas.length; i++) {
            if (i == index) {
                (this.list.datas[i] as GuardianItemInfo).selected = !(this.list.datas[i] as GuardianItemInfo).selected
                this._isSelect = (this.list.datas[i] as GuardianItemInfo).selected
            } else {
                (this.list.datas[i] as GuardianItemInfo).selected = false
            }
        }
        this.list.refresh_items()

        if (this._isSelect) {
            this.topNode.active = true
            this._updateSelectInfo(itemInfo.bagItem)
        } else {
            this.topNode.active = false
        }
    }

    _updateViewInfo() {
        this._initListView()
        let guardianItems = this.guardianModel.guardianItems
        let inHeros = []
        let freeItems = []
        guardianItems.forEach(element => {
            let newBagItem = GuardianUtils.getGuardianData(element.series)
            let extInfo = newBagItem.extInfo as icmsg.Guardian
            let info: GuardianItemInfo = {
                bagItem: newBagItem,
                selected: false,
                power: GuardianUtils.getGuardianPower(element.itemId, extInfo.level, extInfo.star),
            }
            let heroInfo = GuardianUtils.getGuardianHeroInfo(element.series)
            if (heroInfo) {
                inHeros.push(info)
            } else {
                freeItems.push(info)
            }
        });
        GlobalUtil.sortArray(inHeros, this.sortFunc)
        // GlobalUtil.sortArray(freeItems, this.sortFunc)
        let datas = inHeros
        this.list.set_data(datas, false)

        if (this.guardianModel.curGuardianId > 0) {
            let count = 0
            for (let i = 0; i < this.list.datas.length; i++) {
                let info = (this.list.datas[i] as GuardianItemInfo)
                count++
                if (this.guardianModel.curGuardianId == info.bagItem.series) {
                    this._selectItem(info, i)
                    this.list.scroll_to(i)
                    return
                }
            }
            //没有符合匹配的
            if (count > 0 && count == this.list.datas.length) {
                this._selectItem(this.list.datas[0], 0)
                this.list.scroll_to(0)
            } else {
                this.topNode.active = false
                this.tipNode.active = true
            }
        } else {
            this.topNode.active = false
            if (this.list.datas.length > 0) {
                this._selectItem(this.list.datas[0], 0)
            } else {
                this.tipNode.active = true
            }
        }
    }

    /**排序方法 */
    sortFunc(a: GuardianItemInfo, b: GuardianItemInfo) {
        if (a.power == b.power) {
            return b.bagItem.itemId - a.bagItem.itemId
        }
        return b.power - a.power
    }

    _updateSelectInfo(item: BagItem) {
        this._extInfo = item.extInfo as icmsg.Guardian
        this.guardianModel.curGuardianId = this._extInfo.id
        this._cfg = ConfigManager.getItemById(GuardianCfg, item.itemId)
        this._starCfg = ConfigManager.getItemByField(Guardian_starCfg, "guardian_id", this._cfg.id, { star: this._extInfo.star })
        this.nameLab.string = `${this._cfg.name}`
        this.nameLab.node.color = cc.color(GlobalUtil.getHeroNameColor(this._cfg.color))
        let laboutline = this.nameLab.getComponent(cc.LabelOutline)
        laboutline.color = cc.color(GlobalUtil.getHeroNameColor(this._cfg.color, true))
        //星级
        this.starLabel.string = this._extInfo.star > 5 ? '2'.repeat(this._extInfo.star - 5) : '1'.repeat(this._extInfo.star);
        //模型
        HeroUtils.setSpineData(this.node, this.spine, this._cfg.skin, true, false);

        let cfg = ConfigManager.getItemById(GuardianCfg, item.itemId)
        this.nameLab.string = `${cfg.name}`

        this._updateEquipInfo()
    }

    //更新单条属性数据
    _updateOneAttr(attNode: cc.Node, attrInfo: AttrType) {
        let typeLab = attNode.getChildByName("typeLab").getComponent(cc.Label)
        let numLab = attNode.getChildByName("numLab").getComponent(cc.Label)
        let addLab = attNode.getChildByName("addLab").getComponent(cc.Label)
        typeLab.string = attrInfo.name
        numLab.string = `+${attrInfo.initValue}`
        addLab.string = ''
        if (attrInfo.value > 0) {
            addLab.string = `+${attrInfo.value}`
        }
    }

    onDiamondClick() {
        JumpUtils.openPanel({
            panelId: PanelId.Recharge,
            panelArgs: { args: [3] },
            currId: PanelId.GuardianView,
        });
    }

    /**装备点击 */
    _equipClick(part: number) {
        let equipInfo = this._getEquipInfo(part)
        if (equipInfo) {
            let bagItem: BagItem = {
                series: equipInfo.id,
                itemId: equipInfo.type,
                itemNum: 1,
                type: BagType.GUARDIANEQUIP,
                extInfo: equipInfo,
            }
            //打开装备提示框
            let tipsInfo: GuardianEquipTipsType = {
                itemInfo: bagItem,
                from: gdk.Tool.getResIdByNode(this.node),
                equipOnCb: () => {
                    this._openStrengthenPanel(part);
                },
                equipChangeCb: () => {
                    this._openGuardianEquipSelect(part);
                },
            };
            gdk.panel.open(PanelId.GuardianEquipTips, null, null, { args: tipsInfo });
        } else {
            this._openGuardianEquipSelect(part)
        }

    }

    _openStrengthenPanel(part) {
        let equipInfo = this._getEquipInfo(part)
        JumpUtils.openPanel({
            panelId: PanelId.EquipView2,
            panelArgs: { args: 3 },
            callback: (node1: cc.Node) => {
                let e_ctrl = node1.getComponent(EquipViewCtrl2);
                e_ctrl._onPanelShow = (node2: cc.Node) => {
                    if (!node2) return;
                    let e_ctrl2 = node2.getComponent(GuardianEquipOperateViewCtrl);
                    e_ctrl2._onPanelShow = (node3: cc.Node) => {
                        if (!node3) return;
                        let ctrl = node3.getComponent(GuardianEquipStrengthenPanelCtrl);
                        if (ctrl) {
                            gdk.Timer.callLater(this, () => {
                                ctrl.selectById(equipInfo)
                                e_ctrl2._onPanelShow = null;
                                e_ctrl._onPanelShow = null;
                            })
                        }
                    };

                };
            },
        })

    }

    _openGuardianEquipSelect(part) {
        let equipInfo = this._getEquipInfo(part)
        let equipData: BagItem = {
            series: equipInfo ? equipInfo.id : 0,
            itemId: equipInfo ? equipInfo.type : 0,
            itemNum: 1,
            type: BagType.GUARDIANEQUIP,
            extInfo: equipInfo,
        }
        let args: SelectInfo = {
            extData: {
                part: part,
                curEquip: equipData,
            }
        };
        gdk.panel.open(PanelId.GuardianEquipSelect, null, null, {
            args: args,
        });
    }


    _updateEquipInfo() {
        let gudianInfo = GuardianUtils.getGuardianData(this._extInfo.id)
        let suitInfo = GuardianUtils.getGuardianEquipSuitInfo(gudianInfo.extInfo as icmsg.Guardian)
        let suitMap = suitInfo[0]


        for (let i = 0; i < this.equipCtrls.length; i++) {
            let ctrl = this.equipCtrls[i]
            let add = ctrl.node.getChildByName("add")
            let suitEffect = ctrl.node.getChildByName("suitEffect")
            let redPoint = ctrl.node.getChildByName("RedPoint")
            let partIcon = cc.find("partIcon", add)
            let dressTip = cc.find("dressTip", add)
            let lvLab = ctrl.node.getChildByName("lv").getComponent(cc.Label)
            let equipInfo = this._getEquipInfo(i + 1)
            if (equipInfo) {
                add.active = false
                ctrl.updateItemInfo(equipInfo.type)
                ctrl.updateStar(equipInfo.star)
                ctrl.starNum = (equipInfo.star)
                //强化等级
                lvLab.string = `${equipInfo.level}`
                suitEffect.active = false
                let equipCfg = ConfigManager.getItemById(Guardian_equipCfg, equipInfo.type)
                if (suitMap[equipCfg.type] >= 4) {
                    suitEffect.active = true
                    suitEffect.getComponent(cc.Animation).play("icon_pzgjin")
                }
                let heroInfo = GuardianUtils.getGuardianHeroInfo(this.guardianModel.curGuardianId)
                if (heroInfo) {
                    redPoint.active = RedPointUtils.is_can_guardian_equip_strength(heroInfo, i + 1) || RedPointUtils.is_can_guardian_equip_up_by_part(heroInfo, i + 1) || RedPointUtils.is_can_guardian_equip_break_by_part(heroInfo, i + 1)
                } else {
                    redPoint.active = false
                }
            } else {
                add.active = true
                dressTip.active = RedPointUtils.get_free_guardian_equip({ part: i + 1 }).length > 0
                GlobalUtil.setSpriteIcon(add, partIcon, `view/role/texture/guardian/part_${i + 1}`)
                ctrl.updateItemInfo(0)
                ctrl.updateStar(0)
                ctrl.starNum = (0)
                suitEffect.active = false
                lvLab.string = ``
                redPoint.active = false
            }
        }

        // 属性更新

        let attrInfos = GuardianUtils.getGuardianEquipAttrs(gudianInfo.extInfo as icmsg.Guardian)
        for (let i = 0; i < this.attrNodes.length; i++) {
            this._updateOneAttr(this.attrNodes[i], attrInfos[i])
        }

        this._updateSuitInfo()
    }

    _getEquipInfo(part) {
        let gudianInfo = GuardianUtils.getGuardianData(this._extInfo.id)
        let equips = (gudianInfo.extInfo as icmsg.Guardian).equips
        for (let i = 0; i < equips.length; i++) {
            let cfg = ConfigManager.getItemById(Guardian_equipCfg, equips[i].type)
            if (equips[i] && equips[i].id > 0 && cfg.part == part) {
                return equips[i]
            }
        }
        return null
    }

    //套装效果更新
    _updateSuitInfo() {
        for (let index = 0; index < this.suitContent.childrenCount; index++) {
            const suitNode = this.suitContent.children[index];
            suitNode.active = false
        }

        let gudianInfo = GuardianUtils.getGuardianData(this._extInfo.id)
        let suitInfo = GuardianUtils.getGuardianEquipSuitInfo(gudianInfo.extInfo as icmsg.Guardian)
        let suitMap = suitInfo[0]
        let starMap = suitInfo[1]
        let totalStar = 0
        for (let type in starMap) {
            totalStar += starMap[type]
        }
        let starNum = cc.find("starNum", this.starNode).getComponent(cc.Label)
        starNum.string = `${totalStar}`

        let suitCfgs = []
        for (let key in suitMap) {
            let type = parseInt(key)
            let cfgs = ConfigManager.getItems(Guardian_equip_skillCfg, { type: type })
            cfgs = cfgs.reverse()
            let equipNum = suitMap[type]
            for (let i = 0; i < cfgs.length; i++) {
                if (totalStar >= cfgs[i].star && equipNum >= cfgs[i].number) {
                    suitCfgs.push(cfgs[i])
                    break
                }
            }
        }

        for (let index = 0; index < suitCfgs.length; index++) {
            let s_node: cc.Node = this.suitContent[index]
            if (!s_node) {
                s_node = cc.instantiate(this.suitNode)
                s_node.parent = this.suitContent
            }
            this._updateSuitNode(s_node, suitCfgs[index])
        }
    }

    _updateSuitNode(sNode: cc.Node, cfg: Guardian_equip_skillCfg) {
        sNode.active = true
        let suitDes = sNode.getChildByName("suitDes").getComponent(cc.RichText)
        suitDes.string = `${cfg.des}`
        sNode.height = suitDes.node.height
    }

    onOpenRoleFunc() {
        gdk.panel.open(PanelId.Role2)
    }

    onOpenSuitPreView() {
        gdk.panel.open(PanelId.GuardianEquipSuitPreView)
    }

    onOneKeyDress() {
        let guardianId = this.guardianModel.curGuardianId
        let heroInfo = GuardianUtils.getGuardianHeroInfo(guardianId)
        let target = new icmsg.GuardianInHero()
        target.heroId = heroInfo.heroId
        target.guardianId = this.guardianModel.curGuardianId

        let parts = []
        let equipInfos = []

        for (let i = 0; i < 10; i++) {
            let part = i + 1
            let freeEquips = BagUtils.getItemsByType(BagType.GUARDIANEQUIP, { part: part });
            GlobalUtil.sortArray(freeEquips, (a, b) => {
                let extInfoA = a.extInfo as icmsg.GuardianEquip
                let extInfoB = a.extInfo as icmsg.GuardianEquip
                if (GuardianUtils.getTargetEquipPower(extInfoA) == GuardianUtils.getTargetEquipPower(extInfoB)) {
                    return b.itemId - a.itemId
                }
                return GuardianUtils.getTargetEquipPower(extInfoB) - GuardianUtils.getTargetEquipPower(extInfoA)
            })
            if (freeEquips.length == 0) continue

            let equip = this._extInfo.equips[i]
            if (equip && equip.id > 0) {
                //有可以替换的 先脱下
                if (GuardianUtils.getTargetEquipPower(freeEquips[0].extInfo as icmsg.GuardianEquip) > GuardianUtils.getTargetEquipPower(equip)) {
                    // let msgOff = new icmsg.GuardianEquipOffReq()
                    // msgOff.target = target
                    // msgOff.part = part
                    // NetManager.send(msgOff, () => {
                    //     let msg = new icmsg.GuardianEquipOnReq()
                    //     msg.target = target
                    //     msg.equipId = freeEquips[0].series
                    //     msg.part = part
                    //     NetManager.send(msg)
                    // })
                    parts.push(part)
                    let equipInfo = new icmsg.GuardianEquipWithPart()
                    equipInfo.equipId = freeEquips[0].series
                    equipInfo.part = part
                    equipInfos.push(equipInfo)
                }
            } else {
                // let msg = new icmsg.GuardianEquipOnReq()
                // msg.target = target
                // msg.equipId = freeEquips[0].series
                // msg.part = part
                // NetManager.send(msg)
                let equipInfo = new icmsg.GuardianEquipWithPart()
                equipInfo.equipId = freeEquips[0].series
                equipInfo.part = part
                equipInfos.push(equipInfo)
            }
        }

        if (parts.length > 0) {
            //先脱后穿
            let msgOff = new icmsg.GuardianEquipOffReq()
            msgOff.target = target
            msgOff.part = parts
            NetManager.send(msgOff, () => {
                let msg = new icmsg.GuardianEquipOnReq()
                msg.target = target
                msg.equipList = equipInfos
                NetManager.send(msg)
            })
        } else {
            //直接穿
            let msg = new icmsg.GuardianEquipOnReq()
            msg.target = target
            msg.equipList = equipInfos
            NetManager.send(msg)
        }
    }
}

