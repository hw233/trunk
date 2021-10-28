import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiListItem from '../../../common/widgets/UiListItem';


/** 
 * @Description: 组队竞技场组队大厅TeamNodeItem
 * @Author: yaozu.hu
 * @Date: 2021-02-01 10:50:41
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-02-02 22:26:23
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arenaTeam/ArenaTeamSeachEnemyViewItemCtrl")
export default class ArenaTeamSeachEnemyViewItemCtrl extends UiListItem {

    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    lvLabel: cc.Label = null;
    @property(cc.Label)
    powerLabel: cc.Label = null;
    @property(cc.Node)
    iconNode: cc.Node = null;
    @property(cc.Sprite)
    frameIcon: cc.Sprite = null;
    @property(cc.Label)
    scoreLabel: cc.Label = null;
    // @property(cc.Label)
    // rankLabel: cc.Label = null;
    // @property(cc.Sprite)
    // rankIcon: cc.Sprite = null;
    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    info: icmsg.ArenaTeamRoleBrief
    show: boolean = true;
    isEnemy: boolean = false;
    index: number = 0
    pos1 = [cc.v2(-100, 300), cc.v2(-160, 170), cc.v2(-220, 40)]
    pos2 = [cc.v2(220, -40), cc.v2(160, -170), cc.v2(100, -300)]

    updateView() {
        this.info = this.data.data;
        this.show = this.data.show;
        this.isEnemy = this.data.isEnemy;
        this.index = this.data.index;

        let d = this.info.brief
        this.nameLabel.string = d.name;
        this.lvLabel.string = '.' + d.level;
        this.powerLabel.string = this.show ? d.power + '' : '???????';
        this.scoreLabel.string = this.show ? this.info.score + '' : '????';
        GlobalUtil.setSpriteIcon(this.node, this.iconNode, GlobalUtil.getHeadIconById(d.head));
        GlobalUtil.setSpriteIcon(this.node, this.frameIcon, GlobalUtil.getHeadFrameById(d.headFrame));

        let delayTime = 0;
        let endPos: cc.Vec2;
        let animName: string;
        if (this.isEnemy) {
            animName = 'stand2'
            endPos = this.pos2[this.index];
            this.node.setPosition(cc.v2(endPos.x + 650, endPos.y))
            delayTime = (2 - this.index) * 0.2
        } else {
            animName = 'stand'
            endPos = this.pos1[this.index];
            this.node.setPosition(cc.v2(endPos.x - 650, endPos.y))
            delayTime = this.index * 0.2
        }
        gdk.Timer.once(delayTime * 1000 + 100, this, () => {
            this.spine.setAnimation(0, animName, false);
        })
        let action: cc.Action = cc.speed(
            cc.sequence(
                cc.delayTime(delayTime),
                cc.moveTo(0.4, endPos),
                // cc.callFunc(() => {

                // }),
            ),
            1,
        )
        this.node.runAction(action);

    }

    onDisable() {
        gdk.Timer.clearAll(this)
        this.node.stopAllActions();
    }
}
