
/**
 * 指挥官技能描述
 * @Author: sthoo.huang
 * @Date: 2021-02-23 10:53:19
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-02-23 11:01:34
 */

import PanelId from "../../../../configs/ids/PanelId";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/skill/GeneralSkillDesCtrl")
export default class GeneralSkillDesCtrl extends gdk.BasePanel {

    bgNode: cc.Node;
    desNode: cc.Node;
    des: cc.RichText;

    onLoad() {
        this.bgNode = cc.find('bg', this.node);
        this.desNode = cc.find('bg/des', this.node);
        this.des = this.desNode.getComponent(cc.RichText);
        this.bgNode.active = false;
        this.desNode.active = false;
        this.des.string = '';
    }

    onEnable() {
        let args = gdk.panel.getArgs(PanelId.GeneralSkillDesPanel)
        if (args) {
            let pos = args[0];
            let temDes = args[1];
            let temPos = this.node.parent.convertToNodeSpaceAR(cc.v2(cc.winSize.width / 2, pos.y + 80));
            this.node.setPosition(temPos);
            this.des.maxWidth = 0;
            this.des.string = temDes;
            if (this.des.node.width > 350) {
                this.des.maxWidth = 350;
                this.des.string = temDes;
            }
            this.bgNode.width = this.des.node.width + 30;
            this.bgNode.height = this.des.node.height + 10;
        }
        this.bgNode.active = true;
        this.desNode.active = true;
    }

    onDisable() {
        this.des.string = '';
    }
}