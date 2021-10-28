
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/MercenaryUpEffectCtrl")
export default class MercenaryUpEffectCtrl extends cc.Component {

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    onEnable() {
        this.spine.setAnimation(0, 'stand', false);
        this.spine.setCompleteListener((trackEntry, loopCount) => {
            let name = trackEntry.animation ? trackEntry.animation.name : '';
            if (name === "stand") {
                this.node.destroy();
            }
        })
    }
}
