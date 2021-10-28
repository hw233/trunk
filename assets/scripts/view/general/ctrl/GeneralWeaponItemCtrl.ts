import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GeneralModel from '../../../common/models/GeneralModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import TaskModel from '../../task/model/TaskModel';
import TaskUtil from '../../task/util/TaskUtil';
import UiListItem from '../../../common/widgets/UiListItem';
import { General_weapon_missionCfg, General_weaponCfg } from '../../../a/config';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('qszc/view/general/GeneralWeaponItemCtrl')
export default class GeneralWeaponItemCtrl extends UiListItem {
    // @property(cc.Label)
    // fromLabel: cc.Label = null;

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Node)
    slot: cc.Node = null;

    // @property(cc.Node)
    // attrValueLabels: cc.Node = null;

    @property(cc.RichText)
    skillDesc: cc.RichText = null;

    @property(cc.Button)
    selectBtn: cc.Button = null;

    @property(cc.Node)
    progressNode: cc.Node = null;

    @property(cc.Node)
    lock: cc.Node = null;

    @property(cc.Node)
    flag: cc.Node = null;

    get generalModel() { return ModelManager.get(GeneralModel); }

    cfg: General_weaponCfg;
    updateView() {
        this.cfg = this.data;
        let skillCfg = GlobalUtil.getSkillCfg(this.cfg.skill);
        // this.fromLabel.string = this.cfg.way_des;
        this.nameLabel.string = skillCfg.name;
        let color = this.cfg.quality;
        this.nameLabel.node.color = BagUtils.getColor(color);
        this.nameLabel.node.getComponent(cc.LabelOutline).color = BagUtils.getOutlineColor(color);
        this.skillDesc.string = skillCfg.des;
        //slot
        GlobalUtil.setSpriteIcon(this.node, this.slot.getChildByName('qualityIcon'), `common/texture/sub_itembg0${color}`)
        GlobalUtil.setSpriteIcon(this.node, this.slot.getChildByName('icon'), `icon/item/${this.cfg.icon}`)
        let aniName = ['icon_pzgty', 'icon_pzgzi', 'icon_pzgjin'];
        let aniNode = cc.find(`chipsNode/${aniName[color - 2]}`, this.slot);
        if (aniNode) {
            aniNode.active = true;
            aniNode.getComponent(cc.Animation).play();
        }
        // //attr
        // let attr = ['atk_h', 'hp_h', 'def_h', 'atk_s', 'hp_s', 'def_s'];
        // let colorInfo = ['#ffe87b', '#5DFF05'];
        // attr.forEach(att => {
        //     this.attrValueLabels.getChildByName(att).getComponent(cc.Label).string = '+' + this.cfg[att];
        //     this.attrValueLabels.getChildByName(att).color = cc.color().fromHEX(colorInfo[this.generalModel.curUseWeapon !== this.cfg.artifactid ? 0 : 1])
        // });
        this._updateWeapon();
    }

    // onGoBtnClick() {
    //     if (JumpUtils.openView(this.cfg.leave_for, true)) {
    //         gdk.panel.hide(PanelId.GrowMenuView);
    //     }
    // }

    onSelectBtnClick() {
        let req = new icmsg.GeneralChangeWeaponReq();
        req.weaponId = this.cfg.artifactid;
        NetManager.send(req, (resp: icmsg.GeneralChangeWeaponRsp) => {
            this.progressNode.active = false;
            this.lock.active = false;
            this.selectBtn.node.active = false;
            this.flag.active = true;
        });
    }

    @gdk.binding("generalModel.curUseWeapon")
    _updateWeapon() {
        if (!this.cfg) return
        this.progressNode.active = false;
        this.lock.active = false;
        this.selectBtn.node.active = false;
        this.flag.active = false;
        if (this.generalModel.weaponList.indexOf(this.cfg.artifactid) == -1) {
            if (ModelManager.get(TaskModel).weaponChapter == this.cfg.chapter) {
                this.progressNode.active = true;
                let maxLen = 150;
                let bar = cc.find('progress/bar', this.progressNode);
                let num = cc.find('layout/label', this.progressNode).getComponent(cc.Label);
                //todo
                let cfgs = ConfigManager.getItemsByField(General_weapon_missionCfg, 'chapter', this.cfg.chapter);
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
            else {
                this.lock.active = true;
            }
        }
        else {
            if (this.generalModel.curUseWeapon !== this.cfg.artifactid) {
                this.selectBtn.node.active = true;
            }
            else {
                this.flag.active = true;
            }
        }
        // let attr = ['atk_h', 'hp_h', 'def_h', 'atk_s', 'hp_s', 'def_s'];
        // let colorInfo = ['#FFF8EB', '#5DFF05'];
        // attr.forEach(att => {
        //     this.attrValueLabels.getChildByName(att).color = cc.color().fromHEX(colorInfo[this.generalModel.curUseWeapon !== this.cfg.artifactid ? 0 : 1])
        // });
        // this.selectBtn.node.getChildByName('RedPoint').active = this._updateRedPoint();
    }

    // _updateRedPoint() {
    //     let curUseWeapon = this.generalModel.curUseWeapon;
    //     let curCfg = ConfigManager.getItemById(General_weaponCfg, curUseWeapon);
    //     if (this.cfg.artifactid == this.generalModel.weaponList[this.generalModel.weaponList.length - 1]) {
    //         if (curCfg && curCfg.sorting < this.cfg.sorting) return true;
    //     }
    //     return false;
    // }
}
