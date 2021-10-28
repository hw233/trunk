import BagUtils from '../../../common/utils/BagUtils';
import CombineModel from '../model/CombineModel';
import CombineUtils from '../util/CombineUtils';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import ShaderHelper from '../../../common/shader/ShaderHelper';
import TechSoldierCtrl from '../../bingying/ctrl/TechSoldierCtrl';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Combine_rewardsCfg } from '../../../a/config';

const { ccclass, property, menu } = cc._decorator;
/**
 * @Description: 
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-29 15:15:09
 */
@ccclass
@menu("qszc/view/combine/CombineCarnivalRewardItemCtrl")
export default class CombineCarnivalRewardItemCtrl extends cc.Component {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null;

    @property(cc.Node)
    hasGet: cc.Node = null;

    @property(cc.Label)
    descLab: cc.Label = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    _cfg: Combine_rewardsCfg
    get combineModel(): CombineModel { return ModelManager.get(CombineModel); }

    onEnable() {

    }

    updateViewInfo(cfg: Combine_rewardsCfg) {
        this._cfg = cfg
        this.slotItem.updateItemInfo(cfg.rewards[0][0], cfg.rewards[0][1])
        this.descLab.string = `${this.combineModel.playerScore}/${cfg.value}积分`

        GlobalUtil.setAllNodeGray(this.slotItem.node, 0)
        this.slotItem.UiItemIcon.getComponent(ShaderHelper).enabled = false
        this.redPoint.active = false
        if (this.combineModel.exchangeRecord[cfg.id]) {
            this.hasGet.active = true
        } else {
            this.hasGet.active = false
            this.redPoint.active = true
            if (this.combineModel.playerScore < cfg.value) {
                GlobalUtil.setAllNodeGray(this.slotItem.node, 1)
                this.slotItem.UiItemIcon.getComponent(ShaderHelper).enabled = true
                this.redPoint.active = false
            }
        }
    }

    onClickFunc() {
        if (this.combineModel.playerScore >= this._cfg.value && !this.combineModel.exchangeRecord[this._cfg.id]) {
            //可领取
            this.slotItem.itemInfo = null
            let msg = new icmsg.MergeCarnivalExchangeReq()
            msg.id = this._cfg.id
            NetManager.send(msg, (data: icmsg.MergeCarnivalExchangeRsp) => {
                GlobalUtil.openRewadrView(data.list)
                this.combineModel.exchangeRecord = CombineUtils.checkScoreRewards(data.exchangeRecord)
                this.combineModel.playerScore = data.score
            })
        } else {
            let bagItem = {
                series: null,
                itemId: this._cfg.rewards[0][0],
                itemNum: this._cfg.rewards[0][1],
                type: BagUtils.getItemTypeById(this._cfg.rewards[0][0]),
                extInfo: null
            }
            GlobalUtil.openItemTips(bagItem)
        }
    }
}