import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MathUtil from '../../../../common/utils/MathUtil';
import { ActivityEventId } from '../../enum/ActivityEventId';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/twistedEgg/TwistedEggItemCtrl")
export default class TwistedEggItemCtrl extends cc.Component {
    @property(cc.Node)
    icon: cc.Node = null;

    color: number;
    onEnable() {
        this.reset();
    }

    onDisable() {
        this.reset();
        gdk.Timer.clearAll(this);
    }

    // update() {
    //     if (this.isJackPot && this.isNeedPush) {
    //         this.isNeedPush = false;
    //         let circleCollider = this.node.getComponent(cc.PhysicsCircleCollider);
    //         let rigid = this.node.getComponent(cc.RigidBody);
    //         if (!circleCollider || !rigid) return;
    //         circleCollider.friction = 0;
    //         circleCollider.apply();
    //         rigid.applyLinearImpulse(cc.v2(-1000, 0), rigid.getWorldCenter(), true);
    //     }
    // }

    updateView(color: number) {
        this.color = color;
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/act/texture/twistedEgg/xynd_qiu0${this.color}`)
    }

    reset() {
        let rigid = this.node.getComponent(cc.RigidBody);
        if (!rigid) {
            rigid = this.node.addComponent(cc.RigidBody);
            rigid.fixedRotation = true;
        }
        rigid.linearDamping = 0.1;
        rigid.angularDamping = 0.1;
        rigid.linearVelocity = cc.v2();
        rigid.angularVelocity = 0;
        rigid.gravityScale = 0;
        rigid.enabledContactListener = true;

        let circleCollider = this.node.getComponent(cc.PhysicsCircleCollider);
        circleCollider.friction = 0.5;
        circleCollider.restitution = 1;
        circleCollider.apply();
    }

    playAni() {
        gdk.Timer.clearAll(this);
        this.reset();

        let circleCollider = this.node.getComponent(cc.PhysicsCircleCollider);
        let rigid = this.node.getComponent(cc.RigidBody);
        rigid.angularVelocity = MathUtil.rnd(300, 600);
        rigid.gravityScale = 0.3;
        let numx = 0
        let number = MathUtil.rnd(0, 1)
        let number1 = MathUtil.rnd(300, 600)
        if (number >= 0.5) {
            numx = -number1;
        } else {
            numx = number1;
        }
        let numY = MathUtil.rnd(1200, 1400)
        rigid.linearVelocity = cc.v2(numx, numY);

        rigid.onPreSolve = () => {
            rigid.angularVelocity *= -1;
        };

        gdk.Timer.once(4000, this, () => {
            if (!circleCollider || !rigid) return;
            circleCollider.restitution = 0.1;
            circleCollider.apply();
            gdk.Timer.once(2500, this, () => {
                rigid.onPreSolve = null;
                if (!circleCollider || !rigid) return;
                this.node.y = 50;
                rigid.linearVelocity = cc.v2();
                circleCollider.friction = 1;
                rigid.angularVelocity = 0;
                circleCollider.apply();
                this.node.removeComponent(rigid);
                gdk.e.emit(ActivityEventId.ACTIVITY_TWISTED_ANI_END);
            })
        })
    }
}
