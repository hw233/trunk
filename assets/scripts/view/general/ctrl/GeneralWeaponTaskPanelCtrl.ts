import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GeneralModel from '../../../common/models/GeneralModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import TaskModel from '../../task/model/TaskModel';
import TaskUtil from '../../task/util/TaskUtil';
import { General_skinCfg, General_weapon_missionCfg, General_weaponCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { RedPointEvent } from '../../../common/utils/RedPointUtils';
import { TaskEventId } from '../../task/enum/TaskEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-12 18:27:01 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/general/GeneralWeaponTaskPanelCtrl')
export default class GeneralWeaponTaskPanelCtrl extends gdk.BasePanel {
    // @property(cc.Node)
    // headFram: cc.Node = null;

    // @property(cc.Node)
    // head: cc.Node = null;

    // @property(cc.Label)
    // userName: cc.Label = null;

    // @property(cc.Node)
    // vipFlag: cc.Node = null;

    @property(cc.Label)
    weaponName: cc.Label = null;

    // @property(cc.Node)
    // weapon: cc.Node = null;

    @property(sp.Skeleton)
    weaponSpine: sp.Skeleton = null;

    @property(cc.Node)
    skillNode: cc.Node = null;

    @property(cc.Node)
    state1: cc.Node = null;

    @property(cc.Node)
    state2: cc.Node = null;

    @property(cc.Node)
    taskProgressNode: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    taskItemPrefab: cc.Prefab = null;

    get generalModel() { return ModelManager.get(GeneralModel); }
    get taskModel() { return ModelManager.get(TaskModel); }
    get roleModel() { return ModelManager.get(RoleModel); }

    list: ListView;
    cfgs: General_weapon_missionCfg[] = [];
    onEnable() {
        // this._updateUser();
        this._updateWeapon();
        this._updateTaskView();
        gdk.e.on(TaskEventId.UPDATE_TASK_WEAPON_INFO, this._updateTaskWeaponInfo, this);
        //test
        // this.weapon.on(cc.Node.EventType.MOUSE_DOWN, () => {
        //     let ids = [1001, 1002, 1003, 1004, 1005, 1006, 1007];
        //     let randomId = ids[Math.floor(Math.random() * ids.length)];
        //     this.generalModel.newWeapon = randomId;
        //     console.log(`new weapon${randomId}`);
        // });
    }

    onDisable() {
        // this.weapon.targetOff(this);
        // this.weapon.stopAllActions();
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        this.cfgs = [];
        gdk.e.targetOff(this);
    }

    onWeaponListClick() {
        gdk.panel.open(PanelId.GeneralWeapon);
    }

    /**获得新神器 */
    @gdk.binding("generalModel.newWeapon")
    _updateNewWeapon() {
        if (!cc.isValid(this.node)) return;
        if (this.generalModel.newWeapon && JumpUtils.ifSysOpen(2814)) {
            gdk.panel.hide(PanelId.Reward);
            gdk.panel.setArgs(PanelId.GeneralWeaponGetView, this.generalModel.newWeapon);
            gdk.panel.open(PanelId.GeneralWeaponGetView);
            this._updateWeapon();
        }
    }

    _updateTaskWeaponInfo() {
        this._updateTaskView();
    }

    _updateUser() {
        // let path = GlobalUtil.getHeadFrameById(this.roleModel.frame)
        // GlobalUtil.setSpriteIcon(this.node, this.headFram, path)
        // this.userName.string = this.roleModel.name
        // GlobalUtil.setSpriteIcon(this.node, this.head, GlobalUtil.getHeadIconById(this.roleModel.head))
        // let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)
        // vipCtrl.updateVipLv(this.roleModel.vipLv)
    }

    _updateWeapon() {
        let weaponCfg = ConfigManager.getItemByField(General_weaponCfg, 'chapter', this.taskModel.weaponChapter);
        if (!weaponCfg) {
            let cfgs = ConfigManager.getItems(General_weaponCfg);
            weaponCfg = cfgs[cfgs.length - 1];
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
            this.close();
            gdk.gui.showMessage(gdk.i18n.t('i18n:GENERAL_WEAPON_TIP9'));
            gdk.Timer.once(.3, this, () => {
                gdk.panel.open(PanelId.GeneralWeaponUpgradePanel);
            })
            // gdk.Timer.callLater(this, () => {
            // gdk.e.emit(ActivityEventId.ACTIVITY_WEAPON_ICON_HIDE);
            // })
            // GlobalUtil.setLocal('generalWeaponIconAni', false, true);
            // GuideUtil.doneGuideGroup(10193);
            return
        }
        this.weaponName.string = weaponCfg.name;
        let color = weaponCfg.quality;
        this.weaponName.node.color = BagUtils.getColor(color);
        this.weaponName.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(color);
        // let url = `view/general/texture/weapon/${ConfigManager.getItemById(General_skinCfg, weaponCfg.resources).road}`;
        let url = StringUtils.format('spine/weapon/{0}/1/{0}', ConfigManager.getItemById(General_skinCfg, weaponCfg.resources).road);
        GlobalUtil.setSpineData(this.node, this.weaponSpine, url, false, 'stand', true);
        // GlobalUtil.setSpriteIcon(this.node, this.weapon, url);
        // this.weapon.stopAllActions();
        // this.weapon.setPosition(30, 274);
        // this.weapon.runAction(cc.repeatForever(
        //     cc.sequence(
        //         cc.moveBy(1, 0, -20),
        //         cc.moveBy(1, 0, 20)
        //     )
        // ));

        //skill
        let weaponIconBg = this.skillNode.getChildByName('skillBg');
        let weaponIcon = this.skillNode.getChildByName('skillIcon');
        let skillName = this.skillNode.getChildByName('skillName').getComponent(cc.Label);
        let skillDesc = cc.find('scrollview/desc', this.skillNode).getComponent(cc.RichText);
        GlobalUtil.setSpriteIcon(this.node, weaponIconBg, `common/texture/sub_itembg0${color}`)
        GlobalUtil.setSpriteIcon(this.node, weaponIcon, `icon/item/${weaponCfg.icon}`)
        let skillCfg = GlobalUtil.getSkillCfg(weaponCfg.skill);
        skillName.string = skillCfg.name;
        skillDesc.string = skillCfg.des;
        skillName.node.color = BagUtils.getColor(color);
        skillName.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(color);
    }

    _updateTaskView() {
        let chapter = this.taskModel.weaponChapter;
        this.cfgs = ConfigManager.getItemsByField(General_weapon_missionCfg, 'chapter', chapter);
        if (this.cfgs && this.cfgs.length > 0) {
            this.state1.active = true;
            this.state2.active = false;
            //todo
            this._updateList();
            this._updateProgress();
        }
        else {
            this.state1.active = false;
            this.state2.active = true;
        }
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.taskItemPrefab,
                cb_host: this,
                column: 2,
                gap_y: 2,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList() {
        let num = 0;
        this._initList();
        let datas = [];
        this.cfgs.forEach((cfg, idx) => {
            let state = TaskUtil.getWeaponTaskItemState(cfg, idx);
            if (state == 1) {
                num += 1;
            }
            datas.push({
                state: state,
                cfg: cfg,
                isGuide: num == 1 && state == 1,
            });
        });
        this.list.clear_items();
        this.list.set_data(datas);

    }

    _updateProgress() {
        let maxLen = 316;
        let bar = this.taskProgressNode.getChildByName('bar');
        let num = this.taskProgressNode.getChildByName('num').getComponent(cc.Label);
        //todo
        let cfgs = ConfigManager.getItemsByField(General_weapon_missionCfg, 'chapter', this.taskModel.weaponChapter);
        let comNum = 0;
        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i];
            let state = TaskUtil.getWeaponTaskItemState(cfg, i);
            if (state != 0) {
                comNum += 1;
            }
        }
        num.string = comNum + '/' + cfgs.length
        bar.width = Math.floor(comNum / cfgs.length * maxLen);
    }
}
