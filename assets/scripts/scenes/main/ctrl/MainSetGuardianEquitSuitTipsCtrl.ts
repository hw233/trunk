import { Costume_compositeCfg, Guardian_equip_skillCfg } from '../../../a/config';


/**
 * @Description: 个人名片-守护者装备套装展示tips
 * @Author: yaozu.hu
 * @Date: 2019-03-28 17:21:18
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-11 15:57:23
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainSetGuardianEquitSuitTipsCtrl")
export default class MainSetGuardianEquitSuitTipsCtrl extends gdk.BasePanel {


    @property(cc.Node)
    equipSuitContent: cc.Node = null;

    @property(cc.Node)
    suitNode: cc.Node = null

    suitCfgs: Guardian_equip_skillCfg[] | Costume_compositeCfg[] = []

    onEnable() {
        let arg = this.args
        this.suitCfgs = arg[0]
        this._updateEquipSuitInfo()
    }

    _updateEquipSuitInfo() {
        for (let index = 0; index < this.equipSuitContent.childrenCount; index++) {
            const suitNode = this.equipSuitContent.children[index];
            suitNode.active = false
        }
        for (let index = 0; index < this.suitCfgs.length; index++) {
            let s_node: cc.Node = this.equipSuitContent[index]
            if (!s_node) {
                s_node = cc.instantiate(this.suitNode)
                s_node.parent = this.equipSuitContent
            }
            this._updateSuitNode(s_node, this.suitCfgs[index])
        }
    }

    _updateSuitNode(sNode: cc.Node, cfg: Guardian_equip_skillCfg | Costume_compositeCfg) {
        sNode.active = true
        let suitDes = sNode.getChildByName("suitDes").getComponent(cc.RichText)
        if (cfg instanceof Guardian_equip_skillCfg) {
            suitDes.string = `${cfg.des}`
        } else {
            //<color=#F1B77F>焰红4件套:</color>
            suitDes.string = `<color=#F1B77F>${cfg.name}${cfg.num}${gdk.i18n.t("i18n:ROLE_TIP23")}</color>` + cfg.des;
        }
        sNode.height = suitDes.node.height
    }
}
