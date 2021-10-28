import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel, { HangItemInfo } from '../../../../common/models/CopyModel';
import EnterStageViewCtrl from '../../../map/ctrl/EnterStageViewCtrl';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';
import { Copy_stageCfg } from '../../../../a/config';
import { StageData } from '../../../map/ctrl/CityStageItemCtrl';

/**
 * Pve场景挂机信息
 * @Author: luoyong
 * @Date: 2019-09-29 10:30:26
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-22 12:26:18
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/base/PveReadyHangItemCtrl")
export default class PveReadyHangItemCtrl extends cc.Component {

    @property(cc.Node)
    rewardNode: cc.Node = null;

    @property(cc.Node)
    returnBtn: cc.Node = null;

    @property(cc.Label)
    targetLab: cc.Label = null;

    @property(UiSlotItem)
    targetItem: UiSlotItem = null;

    @property(cc.RichText)
    numLab: cc.RichText = null;

    @property(cc.Node)
    hangBtn: cc.Node = null;

    _hangStageId: number = 0
    _equipSeries: number = 0
    _isEnough: boolean = false
    _needNum: number = 0
    _hangInfo: HangItemInfo

    get model(): CopyModel { return ModelManager.get(CopyModel); }

    onEnable() {
        this._updateInfo()
        NetManager.on(icmsg.ItemUpdateRsp.MsgType, this._updateInfo, this)
    }



    _updateInfo() {
        this._isEnough = false
        this._equipSeries = 0

        let info: HangItemInfo = GlobalUtil.getCookie("hangItem_Flag")
        this._hangInfo = info
        if (info && info.itemId > 0) {
            this.targetItem.updateItemInfo(info.itemId)
            this.targetItem.itemInfo = {
                series: info.itemId,
                itemId: info.itemId,
                itemNum: 1,
                type: BagUtils.getItemTypeById(info.itemId),
                extInfo: null,
            }
            this._hangStageId = info.stageId

            // if (info.equipSeries > 0) {
            //     this._equipSeries = info.equipSeries
            //     let equipBagItem = EquipUtils.getEquipData(info.equipSeries)
            //     let equipCfg = ConfigManager.getItemById(Item_equipCfg, equipBagItem.itemId)
            //     let equipInfo = <EquipInfo>equipBagItem.extInfo
            //     this.targetLab.string = `${equipCfg.name} 突破${Math.floor(equipInfo.level / 10) * 10 + 10}级 `
            //     let equipColorCfg = ConfigManager.getItemById(Item_equip_colorCfg, equipCfg.color)
            //     let equipStarCfg = ConfigManager.getItemByField(Item_equip_starCfg, "color", equipCfg.color, { star: equipColorCfg.star + equipInfo.breakStar, part: equipCfg.part })
            //     let items = equipStarCfg.item_add
            //     let needNum = 0
            //     if (items && items.length > 0) {
            //         for (let i = 0; i < items.length; i++) {
            //             let data = items[i]
            //             if (data && data[0] == info.itemId) {
            //                 needNum = data[1]
            //                 break;
            //             }
            //         }
            //     }
            //     this._needNum = needNum
            //     let hasNum = BagUtils.getItemNumById(info.itemId)
            //     if (hasNum >= needNum) {
            //         this.numLab.string = `<outline=2 color =#532f21 ><color=#01ff1f>(${hasNum}/${needNum})</c></outline>`
            //     } else {
            //         this.numLab.string = `<outline=2 color =#532f21 >(<color=#fc513f>${hasNum}</c>/${needNum})</outline>`
            //     }

            //     if (hasNum >= needNum) {
            //         this._isEnough = true
            //     }
            //     if (this._isEnough) {
            //         GlobalUtil.setSpriteIcon(this.node, this.hangBtn, "view/pve/texture/ready/gj_qianqutupo")
            //     } else {
            //         GlobalUtil.setSpriteIcon(this.node, this.hangBtn, "view/pve/texture/ready/gj_kuaisuguaji")
            //     }
            // } else {
            //     let heroBagItem = HeroUtils.getHeroInfoBySeries(info.heroId)
            //     let targetCareerLv = HeroUtils.getHeroJobLv(info.heroId, info.careerId) + 1
            //     let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", info.careerId, { career_lv: targetCareerLv })
            //     let needNum = 0
            //     if (careerCfg) {
            //         for (let i = 1; i < 4; i++) {
            //             let data = careerCfg["career_item" + i]
            //             if (data && data[0] == info.itemId) {
            //                 needNum = data[1]
            //                 break;
            //             }
            //         }
            //         let heroCfg = ConfigManager.getItemById(HeroCfg, heroBagItem.itemId)
            //         this.targetLab.string = `${heroCfg.name} 进阶 ${careerCfg.name} ${targetCareerLv}级`
            //         this._needNum = needNum
            //         let hasNum = BagUtils.getItemNumById(info.itemId)
            //         if (hasNum >= needNum) {
            //             this.numLab.string = `<outline=2 color =#532f21 ><color=#01ff1f>(${hasNum}/${needNum})</c></outline>`
            //         } else {
            //             this.numLab.string = `<outline=2 color =#532f21 >(<color=#fc513f>${hasNum}</c>/${needNum})</outline>`
            //         }
            //         if (hasNum >= needNum) {
            //             this._isEnough = true
            //         }
            //         if (this._isEnough) {
            //             GlobalUtil.setSpriteIcon(this.node, this.hangBtn, "view/pve/texture/ready/gj_qianqujinjie")
            //         } else {
            //             GlobalUtil.setSpriteIcon(this.node, this.hangBtn, "view/pve/texture/ready/gj_kuaisuguaji")
            //         }
            //     }
            // }
        }
    }

    onDisable() {
        GlobalUtil.setSpriteIcon(this.node, this.hangBtn, null)
        gdk.e.targetOff(this)
    }

    hideFunc() {
        this.node.active = false
        this.rewardNode.active = true
        GlobalUtil.setCookie("hangItem_Flag", null)

        let newStageCfg = ConfigManager.getItemById(Copy_stageCfg, this.model.latelyStageId);
        if (newStageCfg) {
            //设置挂机最新关卡
            NetManager.send(new icmsg.DungeonHangChooseReq({ stageId: newStageCfg.pre_condition }));
        }

    }

    // 扫荡
    quickFight() {
        if (this._isEnough) {
            if (this._equipSeries > 0) {
                if (this._hangInfo) {
                    let heroBagItem = HeroUtils.getHeroInfoBySeries(this._hangInfo.heroId)
                    JumpUtils.openEquipPanelById(heroBagItem.itemId, [1])
                }
            } else {
                if (this._hangInfo) {
                    let heroBagItem = HeroUtils.getHeroInfoBySeries(this._hangInfo.heroId)
                    // JumpUtils.openRolePanel(["job", 2, heroBagItem.itemId])
                    JumpUtils.openEquipPanelById(heroBagItem.itemId, [2])
                }
            }
        } else {
            let bagItem: BagItem = {
                series: this.targetItem.itemInfo.series,
                itemId: this.targetItem.itemInfo.itemId,
                itemNum: this._needNum,
                type: this.targetItem.itemInfo.type,
                extInfo: null,
            }
            let data: StageData = new StageData()
            data.stageCfg = ConfigManager.getItemById(Copy_stageCfg, this._hangStageId)
            gdk.panel.open(PanelId.EnterStageView, (node: cc.Node) => {
                let ctrl = node.getComponent(EnterStageViewCtrl);
                this.model.needItem = bagItem
                ctrl.updateData(data);
            });
        }
    }
}
