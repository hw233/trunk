import ConfigManager from '../../../../common/managers/ConfigManager';
import CostumeSuitTypeCtrl from './CostumeSuitTypeCtrl';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Costume_compositeCfg } from '../../../../a/config';
/** 
 * @Description: 装备选择面板子项
 * @Author: weiliang.huang  
 * @Date: 2019-04-02 18:24:37 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-04-21 17:40:54
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/costume/CostumeSuitSelectItem")
export default class CostumeSuitSelectItem extends UiListItem {

    @property(cc.Node)
    suitIcon: cc.Node = null

    @property(cc.Node)
    suitContent: cc.Node = null

    @property(cc.Node)
    suitNode: cc.Node = null

    @property(cc.Node)
    selectIcon: cc.Node = null

    _type = 0
    _part = 0
    _careerType = 0

    updateView() {
        this._type = this.data.type
        this._part = this.data.part
        this._careerType = this.data.careerType

        this.selectIcon.active = this.data.isSelect

        let typeCtrl = this.suitIcon.getComponent(CostumeSuitTypeCtrl)
        typeCtrl.updateSuitSelectInfo(this._type, this._part, this._careerType)

        for (let index = 0; index < this.suitContent.childrenCount; index++) {
            const suitNode = this.suitContent.children[index];
            suitNode.active = false
        }

        let suitCfgs = ConfigManager.getItems(Costume_compositeCfg, { type: this._type, color: 1 })
        for (let index = 0; index < suitCfgs.length; index++) {
            let s_node: cc.Node = this.suitContent[index]
            if (!s_node) {
                s_node = cc.instantiate(this.suitNode)
                s_node.parent = this.suitContent
            }
            this._updateSuitNode(s_node, suitCfgs[index])
        }
    }

    _updateSuitNode(sNode: cc.Node, cfg: Costume_compositeCfg) {
        sNode.active = true
        let suitLab = sNode.getChildByName("suitLab").getComponent(cc.Label)
        let suitDes = sNode.getChildByName("suitDes").getComponent(cc.RichText)
        suitLab.string = `${cfg.name}${cfg.num}${gdk.i18n.t("i18n:ROLE_TIP23")}`
        suitDes.string = ''
        suitDes.string = `${cfg.des}`
        sNode.height = suitDes.node.height
    }
}