import { Guardian_equip_skillCfg } from '../../../../../a/config';

const { ccclass, property, menu } = cc._decorator;
/** 
 * @Description: 
 * @Author:luoyong
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-19 13:40:57
 */

@ccclass
@menu("qszc/view/role2/guardian/equip/GuardianEquipSuitPreViewItemCtrl")
export default class GuardianEquipSuitPreViewItemCtrl extends cc.Component {

    @property(cc.Label)
    suitName: cc.Label = null

    @property(cc.Label)
    suitStar: cc.Label = null

    @property(cc.Node)
    descNode: cc.Node = null

    @property(cc.RichText)
    descLab: cc.RichText = null

    _suitNames = ["", "焰红", "岚黄", "湛蓝", "苍绿", "恶魔"]

    onEnable() {

    }

    updateViewInfo(cfg: Guardian_equip_skillCfg) {
        this.suitName.string = `装备总星级达到`
        this.suitStar.string = `${cfg.star}`
        this.descLab.string = ``
        this.descLab.string = `${cfg.des}`
        this.descNode.height = this.descLab.node.height
    }

}