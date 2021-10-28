import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ConfigManager from '../ConfigManager';
import GeneralModel from '../../models/GeneralModel';
import ModelManager from '../ModelManager';
import TaskModel from '../../../view/task/model/TaskModel';
import { General_weaponCfg } from '../../../a/config';
import { TaskEventId } from '../../../view/task/enum/TaskEventId';


export default class GeneralController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return []
    }
    get netEvents(): NetEventArray[] {
        return [
            [icmsg.GeneralInfoRsp.MsgType, this._onGeneralInfoRsp],
            [icmsg.GeneralAttrRsp.MsgType, this._onGeneralAttrRsp],
            [icmsg.GeneralChangeWeaponRsp.MsgType, this._onGeneralChangeWeaponRsp],
            [icmsg.GeneralWeaponInfoRsp.MsgType, this._onGeneralWeaponInfoRsp],
            [icmsg.GeneralWeaponGetRsp.MsgType, this._onGeneralWeaponGetRsp],
            [icmsg.GeneralWeaponLevelUpgradeRsp.MsgType, this._onGeneralWeaponUpgradeRsp],
            [icmsg.GeneralWeaponProgressUpgradeRsp.MsgType, this._onGeneralWeaponRefineRsp],
            [icmsg.GeneralWeaponUpgradeInfoRsp.MsgType, this._onGeneralWeaponUpgradeInfoRsp]
        ];
    }
    model: GeneralModel = null

    onStart() {
        this.model = ModelManager.get(GeneralModel)
        this.model.generalInfo = null
        this.model.weaponList = [];
        this.model.newWeapon = null;
        this.model.preUseWeapon = null;
        this.model.curUseWeapon = null;
    }

    onEnd() {
        this.model = null;
    }

    /**服务器返回指挥官数据 */
    _onGeneralInfoRsp(data: icmsg.GeneralInfoRsp) {
        this.model.generalInfo = data.general
        this.model.preUseWeapon = data.general.weaponId
        this.model.curUseWeapon = data.general.weaponId
    }

    /**指挥官属性更新 */
    _onGeneralAttrRsp(data: icmsg.GeneralAttrRsp) {
        this.model.generalInfo.arr = data.attr
        this.model.generalInfo.skills = data.skills
        this.model.generalInfo = this.model.generalInfo
    }

    /**切换神器 */
    _onGeneralChangeWeaponRsp(resp: icmsg.GeneralChangeWeaponRsp) {
        this.model.preUseWeapon = this.model.generalInfo.weaponId;
        this.model.generalInfo.weaponId = resp.weaponId;
        this.model.curUseWeapon = resp.weaponId;
        if (this.model.weaponList.indexOf(resp.weaponId) == -1) {
            //新神器
            this.model.weaponList.push(resp.weaponId);
            this.model.weaponList.sort((a, b) => { return ConfigManager.getItemById(General_weaponCfg, a).sorting - ConfigManager.getItemById(General_weaponCfg, b).sorting; })

            ModelManager.get(TaskModel).weaponChapter += 1;
            ModelManager.get(TaskModel).weaponBits = 0;
            this.model.newWeapon = resp.weaponId;
            gdk.e.emit(TaskEventId.UPDATE_TASK_WEAPON_INFO);
        }
        //TODO 
        // resp.diffAttr
    }

    /**拥有的神器列表 */
    _onGeneralWeaponInfoRsp(resp: icmsg.GeneralWeaponInfoRsp) {
        this.model.weaponList = resp.weaponId;
        this.model.weaponList.sort((a, b) => { return ConfigManager.getItemById(General_weaponCfg, a).sorting - ConfigManager.getItemById(General_weaponCfg, b).sorting; })
    }

    /**获得新神器推送 */
    _onGeneralWeaponGetRsp(resp: icmsg.GeneralWeaponGetRsp) {
        // if (this.model.weaponList.indexOf(resp.weaponId) == -1) {
        //     this.model.weaponList.push(resp.weaponId);
        //     this.model.weaponList.sort((a, b) => { return ConfigManager.getItemById(General_weaponCfg, a).sorting - ConfigManager.getItemById(General_weaponCfg, b).sorting; })
        //     this.model.preUseWeapon = this.model.generalInfo.weaponId;
        //     this.model.generalInfo.weaponId = resp.weaponId;
        //     this.model.newWeapon = resp.weaponId;
        //     this.model.curUseWeapon = resp.weaponId;
        // }
    }

    _onGeneralWeaponUpgradeInfoRsp(resp: icmsg.GeneralWeaponUpgradeInfoRsp) {
        this.model.weaponLv = resp.levelLv;
        this.model.waponLvCfgId = resp.levelId;
        this.model.weaponRefineLv = resp.progressLv;
    }

    _onGeneralWeaponUpgradeRsp(resp: icmsg.GeneralWeaponLevelUpgradeRsp) {
        this.model.weaponLv = resp.curLv;
        this.model.oldWaponLvCfgId = this.model.waponLvCfgId;
        this.model.waponLvCfgId = resp.curId;
    }

    _onGeneralWeaponRefineRsp(resp: icmsg.GeneralWeaponProgressUpgradeRsp) {
        this.model.oldWeaponRefineLv = this.model.weaponRefineLv;
        this.model.weaponRefineLv = resp.lv;
    }
}