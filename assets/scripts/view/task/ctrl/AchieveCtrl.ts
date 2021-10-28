import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import TaskModel from '../model/TaskModel';
import { Mission_achievementCfg } from '../../../a/config';
/** 
 * @Description: 新成就提示
 * @Author: weiliang.huang  
 * @Date: 2019-06-14 21:12:22 
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-07-17 10:53:51
*/

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/AchieveCtrl")
export default class AchieveCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(sp.Skeleton)
    spine2: sp.Skeleton = null;

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Label)
    descLab: cc.Label = null

    achieveAni: cc.Animation = null
    curId: number = -1

    get model(): TaskModel { return ModelManager.get(TaskModel); }

    onDestroy() {
        gdk.Timer.clearAll(this);
        this.unscheduleAllCallbacks()
    }

    start() {
        this.showNewAchieve()
        // this.node.scale = 0
        // this.node.runAction(cc.sequence(
        //     cc.scaleTo(0.1, 1.3),
        //     cc.scaleTo(0.1, 0.9),
        //     cc.scaleTo(0.1, 1),
        // ))
    }

    /**显示成就信息 */
    showNewAchieve() {
        // this.achieveAni = this.node.getComponent(cc.Animation)
        // this.achieveAni.play("UI_cjdc")
        // this.achieveAni.on('finished', this.onFinished, this);
        this.nameLab.node.active = false;
        this.descLab.node.active = false;
        this.spine.node.active = false;
        this.spine2.node.active = true;
        this.spine2.setAnimation(0, 'stand', true);
        this.spine2.setCompleteListener(() => {
            this.spine2.setCompleteListener(null);
            this.spine2.node.active = false;
        })
        gdk.Timer.once(600, this, () => {
            this.spine.node.active = true;
            this.nameLab.node.active = true;
            this.descLab.node.active = true;
            let id = this.model.newAchieves.shift()
            this.curId = id
            let cfg = ConfigManager.getItemById(Mission_achievementCfg, id)
            this.nameLab.string = cfg.title
            let descText = cfg.desc
            // 带{number}需要替换为指定数量
            if (descText.indexOf("{number}") >= 0) {
                let replaceText = `${cfg.number}`
                if (cfg.target == 603) {
                    // 603为竞技场名次要求,替换为目标名次
                    replaceText = `${cfg["args"][0]}`
                }
                descText = descText.replace("{number}", replaceText)
            }
            this.descLab.string = descText
            this.scheduleOnce(() => {
                this.showNextAchieve()
            }, 3)
        });
    }

    // onFinished() {
    // this.achieveAni.off('finished', this.onFinished, this);
    // this.achieveAni.play("UI_cjdc", 0.65)
    // this.achieveAni.schedule(() => {
    //     this.achieveAni.play("UI_cjdc", 0.65)
    // }, 0.4)
    // }

    showNextAchieve() {
        if (this.curId < 0) {
            return
        }
        // this.node.stopAllActions()
        if (this.model.newAchieves.length == 0) {
            this.close()
            this.curId = -1
            // this.node.runAction(cc.sequence(
            //     cc.scaleTo(0.1, 0),
            //     cc.callFunc(() => {
            //         this.close()
            //     })
            // ))
            return
        }
        // this.unscheduleAllCallbacks()
        // this.node.scale = 0
        this.showNewAchieve()

        // this.node.runAction(cc.sequence(
        //     cc.scaleTo(0.1, 1.2),
        //     cc.scaleTo(0.05, 0.9),
        //     cc.scaleTo(0.05, 1),
        // ))
        // this.showNewAchieve()
    }
}
