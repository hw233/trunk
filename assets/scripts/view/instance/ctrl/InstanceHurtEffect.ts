import GlobalUtil from '../../../common/utils/GlobalUtil';
import PvePool from '../../pve/utils/PvePool';

/**
 * PVE伤害效果（伤害飘字）控制类
 * @Author: yaozu.hu
 * @Date: 2019-09-06 10:07:57
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-07-03 15:07:44
 */
const { ccclass, property, menu } = cc._decorator;
export enum InstanceHurtType {
    NORMAL,
    CARE,
}
interface InstanceHurtEffectMap {
    [type: number]: InstanceHurtEffect[];
    length: number;
}
const TARGET_NODE_MAP: any = new window['Map']();
@ccclass
@menu("qszc/view/instance/InstanceHurtEffect")
export default class InstanceHurtEffect extends cc.Component {

    @property(cc.LabelAtlas)
    hp0Font: cc.LabelAtlas = null;

    @property(cc.LabelAtlas)
    hpFont: cc.LabelAtlas = null;

    @property(cc.Label)
    hurtLb: cc.Label = null;

    type: InstanceHurtType = InstanceHurtType.NORMAL;
    dir: number = 1;
    value: string = '';

    showHurt(dir: number, value: string, type: InstanceHurtType, curPos?: cc.Vec2) {
        this.dir = dir;
        this.value = value;
        this.type = type;
        this.node.stopAllActions();
        let font = this.hp0Font;
        if (this.type == InstanceHurtType.CARE) font = this.hpFont;
        this.hurtLb.font = font;
        this.hurtLb.fontSize = 28;

        let pos = curPos ? curPos : cc.v2(0, 160)
        this.node.setPosition(pos);
        this.node.opacity = 255;
        this.hurtLb.string = GlobalUtil.numberToStr2(Number(this.value), true, true)//this.value;

        let action: cc.Action;
        this.node.scale = 1;
        if (this.type == InstanceHurtType.CARE) {
            action = cc.speed(
                cc.sequence(
                    cc.fadeIn(0.1),
                    cc.scaleTo(0.2, 1.6),
                    cc.spawn(
                        cc.moveBy(0.8, 0, 100),
                        cc.fadeOut(0.8)
                    ),
                    cc.callFunc(() => {
                        this.hide();
                    }),
                ),
                1,
            )
        } else {
            action = cc.speed(
                cc.sequence(
                    cc.fadeIn(0.1),
                    cc.spawn(
                        cc.moveBy(0.8, 0, 160),
                        cc.fadeOut(0.8)
                    ),
                    cc.callFunc(() => {
                        this.hide();
                    }),
                ),
                1,
            )
        }
        this.node.runAction(action);
    }

    hide(effect: boolean = true) {
        this.value = '';
        this.node.opacity = 255;
        gdk.NodeTool.hide(this.node, effect, () => {
            PvePool.put(this.node);
        });
    }
}
