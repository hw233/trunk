import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { FhTeacheGuideType } from './teaching/FootHoldTeachingCtrl';
import { Foothold_baseCfg } from '../../../../a/config';
import { FootHoldEventId } from '../../enum/FootHoldEventId';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-01-19 17:49:46
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHBaseRewardCtrl")
export default class FHBaseRewardCtrl extends gdk.BasePanel {

    @property(cc.Label)
    curLv: cc.Label = null

    @property(cc.Label)
    nextLv: cc.Label = null

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null

    @property(cc.Label)
    expLab: cc.Label = null

    @property(cc.Node)
    rewardNode: cc.Node = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    @property(cc.Node)
    maxNode: cc.Node = null

    @property(cc.Node)
    lvNode: cc.Node = null

    @property(cc.Node)
    btnGet: cc.Node = null

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    onEnable() {
        let msg = new icmsg.FootholdBaseLevelReq()
        msg.warId = this.footHoldModel.curMapData.warId
        msg.guildId = this.roleModel.guildId
        NetManager.send(msg, (data: icmsg.FootholdBaseLevelRsp) => {
            this.updateViewInfo(data)
        })
    }

    updateViewInfo(data: icmsg.FootholdBaseLevelRsp) {
        if (this.footHoldModel.isGuessMode) {
            this.btnGet.active = false
        }
        let cfgs = ConfigManager.getItems(Foothold_baseCfg)
        let baseCfg = ConfigManager.getItemByField(Foothold_baseCfg, "level", data.level)
        if (data.level >= cfgs.length) {
            this.lvNode.active = false
            this.maxNode.active = true
            this.expLab.string = ``
            this.proBar.progress = 1
        } else {
            this.lvNode.active = true
            this.maxNode.active = false
            this.curLv.string = `${data.level}${gdk.i18n.t("i18n:FOOTHOLD_TIP3")}`
            this.nextLv.string = `${data.level + 1}${gdk.i18n.t("i18n:FOOTHOLD_TIP3")}`

            this.expLab.string = `${data.exp}/${baseCfg.exp}`
            this.proBar.progress = data.exp / baseCfg.exp
        }
        if (this.footHoldModel.rewardedBaseLevel >= data.level) {
            this.rewardNode.active = false
        } else {
            this.rewardNode.active = true
            this.content.removeAllChildren()

            let goods = []
            let lv = this.footHoldModel.rewardedBaseLevel
            for (let i = lv; i < cfgs.length; i++) {
                let cfg = cfgs[i]
                if (cfg.level <= data.level) {
                    goods = FootHoldUtils.addBonus(goods, cfg.rewards)
                }
            }

            for (let j = 0; j < goods.length; j++) {
                let solt = cc.instantiate(this.rewardItem)
                let ctrl = solt.getComponent(UiSlotItem)
                ctrl.updateItemInfo(goods[j][0], goods[j][1])
                ctrl.itemInfo = {
                    series: 0,
                    itemId: goods[j][0],
                    itemNum: 1,
                    type: BagUtils.getItemTypeById(goods[j][0]),
                    extInfo: null
                }
                solt.parent = this.content
            }
        }
    }

    /**获取奖励 */
    getRewardFunc() {
        let msg = new icmsg.FootholdBaseRewardReq()
        msg.warId = this.footHoldModel.curMapData.warId
        NetManager.send(msg, (data: icmsg.FootholdBaseRewardRsp) => {
            FootHoldUtils.commitFhGuide(FhTeacheGuideType.event_6)
            this.footHoldModel.rewardedBaseLevel = data.level
            GlobalUtil.openRewadrView(data.list)
            this.close()
            gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)
        }, this)
    }
}