import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PvePool from '../../utils/PvePool';

/**
 * Pve技能名字特效
 * @Author: yaozu.hu
 * @Date: 2019-08-20 11:48:29
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-03-13 10:41:43
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class PveManualSkillNameEffect extends cc.Component {

    @property(cc.Sprite)
    skillName: cc.Sprite = null;

    iconName: string;
    tween: cc.Tween;

    onEnable() {
        this.node.setPosition(-500, 250);
        let path = 'view/pve/texture/ui/common/' + this.iconName
        GlobalUtil.setSpriteIcon(this.node, this.skillName, path);
        this.tween = cc.tween(this.node)
            .to(0.25, { position: cc.v2(0, 250) })
            .delay(1.5)
            .to(0.5, { position: cc.v2(-500, 250) })
            .call(() => {
                this.hide()
            })
            .start();
    }

    onDisable() {
        this.tween && this.tween.stop();
        this.tween = null;
        GlobalUtil.setSpriteIcon(this.node, this.skillName, null);
        gdk.Timer.clear(this, this.hide);
    }

    hide(effect: boolean = true) {
        gdk.NodeTool.hide(this.node, effect, () => {
            PvePool.put(this.node);
        });
    }

}
