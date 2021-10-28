import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import TaskModel from '../../task/model/TaskModel';
import TaskUtil from '../../task/util/TaskUtil';
import { General_weapon_missionCfg, General_weaponCfg } from '../../../a/config';
import { TaskEventId } from '../../task/enum/TaskEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-12 20:52:57 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/general/GeneralWeaponTaskInfoCtrl')
export default class GeneralWeaponTaskInfoCtrl extends cc.Component {
    // @property(UiSlotItem)
    // slot: UiSlotItem = null;

    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.Node)
    pro: cc.Node = null;

    @property(cc.Node)
    weapon: cc.Node = null;

    // @property(cc.Node)
    // flag: cc.Node = null;

    @property(cc.Node)
    state1: cc.Node = null;

    @property(cc.Node)
    unLockNode: cc.Node = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    width: number = 175.4;
    lastChaptercfg: General_weapon_missionCfg;
    get model(): TaskModel { return ModelManager.get(TaskModel); }
    onEnable() {
        gdk.e.on(TaskEventId.UPDATE_TASK_WEAPON_INFO, this.initWeaponTaskData, this)
        this.initWeaponTaskData()
    }
    onDisable() {
        this.weapon.stopAllActions();
        this.redPoint.stopAllActions();
        this.unLockNode.stopAllActions();
        gdk.e.targetOff(this)
    }

    initWeaponTaskData() {
        let model = this.model;
        let chapterCfgs = ConfigManager.getItems(General_weapon_missionCfg)
        this.lastChaptercfg = chapterCfgs[chapterCfgs.length - 1]
        let chapterId = Math.min(model.weaponChapter, this.lastChaptercfg.chapter);
        this.state1.active = true;
        // this.state1.active = model.weaponChapter <= this.lastChaptercfg.chapter;
        // this.state2.active = model.weaponChapter > this.lastChaptercfg.chapter;
        let cfgs: General_weapon_missionCfg[] = ConfigManager.getItems(General_weapon_missionCfg, { chapter: chapterId });
        if (!JumpUtils.ifSysOpen(2814)) {
            this.node.active = false;
            return;
        }
        this.node.active = true;
        // if (this.state1) {
        let comNum = 0;
        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i];
            let state = TaskUtil.getWeaponTaskItemState(cfg, i);
            if (state != 0 || model.weaponChapter > this.lastChaptercfg.chapter) {
                comNum += 1;
            }
        }
        this.unLockNode.stopAllActions();
        this.unLockNode.active = false;
        if (model.weaponChapter <= this.lastChaptercfg.chapter) {
            this.num.node.active = true;
            this.pro.parent.active = true;
            this.num.string = comNum + '/' + cfgs.length
            this.pro.width = Math.floor(comNum / cfgs.length * this.width);
            if (comNum == cfgs.length) {
                this.unLockNode.active = true;
                this.unLockNode.runAction(
                    cc.repeatForever(
                        cc.sequence(
                            cc.fadeIn(.5),
                            cc.delayTime(2),
                            cc.fadeOut(.3),
                            cc.delayTime(2)
                        )
                    )
                )
            }
        }
        else {
            this.num.node.active = false;
            this.pro.parent.active = false;
        }

        // let rewardCfg = ConfigManager.getItemById(General_weapon_missionCfg, chapterId);
        let weaponCfg = ConfigManager.getItemByField(General_weaponCfg, 'chapter', chapterId);
        let url = `view/item/${weaponCfg.icon}`;
        GlobalUtil.setSpriteIcon(this.node, this.weapon, url);
        this.weapon.stopAllActions();
        this.weapon.setPosition(37, 40);
        this.weapon.runAction(cc.repeatForever(
            cc.sequence(
                cc.moveBy(1, 0, -20),
                cc.moveBy(1, 0, 20)
            )
        ));
        // this.slot.updateItemIcon(`icon/item/${weaponCfg.icon}`)
        // this.slot.updateQuality(weaponCfg.quality);
        // if (comNum == cfgs.length) {
        //     this.slot.qualityEffect(weaponCfg.quality);
        //     // this.flag.active = true;
        // }
        // else {
        //     this.slot.qualityEffect(-1);
        //     // this.flag.active = false;
        // }
        // }
        // if (this.state2.active) {
        //     let slot = this.state2.getChildByName('UiSlotItem').getComponent(UiSlotItem);
        //     let weaponCfg = ConfigManager.getItemById(General_weaponCfg, ModelManager.get(GeneralModel).curUseWeapon);
        //     // GlobalUtil.setSpriteIcon(this.node, weaponIconBg, `common/texture/sub_itembg0${color}`)
        //     // GlobalUtil.setSpriteIcon(this.node, weaponIcon, `icon/item/${weaponCfg.icon}`)
        //     slot.updateItemIcon(`icon/item/${weaponCfg.icon}`);
        //     slot.updateQuality(weaponCfg.quality);
        // }
    }

    onClick() {
        JumpUtils.openGeneralWeaponView();
    }

    redPointHandler() {
        let b = RedPointUtils.is_can_reward_weapon();
        if (b) {
            this.redPoint.active = true;
            this.redPoint.setScale(1);
            this.redPoint.runAction(
                cc.repeatForever(
                    cc.sequence(
                        cc.scaleTo(.5, 1.3, 1.3),
                        cc.scaleTo(.5, 1, 1)
                    )
                )
            );
        }
        else {
            this.redPoint.active = false;
            this.redPoint.stopAllActions();
        }
        return b;
    }
}
