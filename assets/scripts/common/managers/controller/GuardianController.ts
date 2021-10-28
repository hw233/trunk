import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import GlobalUtil from '../../utils/GlobalUtil';
import GuardianModel from '../../../view/role/model/GuardianModel';
import GuardianUtils from '../../../view/role/ctrl2/guardian/GuardianUtils';
import HeroModel from '../../models/HeroModel';
import ModelManager from '../ModelManager';
import { RoleEventId } from '../../../view/role/enum/RoleEventId';

/**
 * @Description: 守护者数据管理器
 * @Author: weiliang.huang
 * @Date: 2019-04-10 10:07:00
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-07-30 19:20:06
 */

export default class GuardianController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return []
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.GuardianDrawStateRsp.MsgType, this._onGuardianDrawStateRsp],
            [icmsg.GuardianListRsp.MsgType, this._onGuardianListRsp],
            [icmsg.GuardianUpdateRsp.MsgType, this._onGuardianUpdateRsp],
            [icmsg.GuardianEquipListRsp.MsgType, this._onGuardianEquipListRsp],
            [icmsg.GuardianEquipUpdateRsp.MsgType, this._onGuardianEquipUpdateRsp],
            [icmsg.GuardianFallbackRsp.MsgType, this._onGuardianFallbackRsp],
        ];
    }

    model: GuardianModel = null

    onStart() {
        this.model = ModelManager.get(GuardianModel)
    }

    onEnd() {
        this.model = null
    }

    /**守护者召唤状态 */
    _onGuardianDrawStateRsp(rsp: icmsg.GuardianDrawStateRsp) {
        let model = ModelManager.get(GuardianModel);
        model.guardianDrawState = rsp;
        model.wishItemId = rsp.wishItemId;
    }

    _onGuardianListRsp(data: icmsg.GuardianListRsp) {
        this.model.idItems = {}
        this.model.guardianItems = []
        let list = data.list
        let len = list.length
        for (let index = 0; index < len; index++) {
            const element: icmsg.Guardian = list[index];
            if (element.id > 0) {
                GuardianUtils.updateGuardian(element.id, element, len == index + 1)
            }
        }
        //加入英雄自己身上的
        let heroInfos = ModelManager.get(HeroModel).heroInfos
        heroInfos.forEach((element) => {
            let heroInfo = element.extInfo as icmsg.HeroInfo
            if (heroInfo.guardian && heroInfo.guardian.id > 0) {
                GuardianUtils.updateGuardian(heroInfo.guardian.id, heroInfo.guardian)
            }
        });

        GlobalUtil.sortArray(this.model.guardianItems, (a, b) => {
            return a.series - b.series
        })
    }

    _onGuardianUpdateRsp(data: icmsg.GuardianUpdateRsp) {
        let list = data.list
        if (list) {
            let len = list.length
            for (let index = 0; index < len; index++) {
                const element: icmsg.Guardian = list[index];
                if (element.id > 0) {
                    GuardianUtils.updateGuardian(element.id, element, len == index + 1)
                }
            }
            if (len > 0) {
                gdk.e.emit(RoleEventId.GUARDIAN_ADD)
            }
        }

        let deleteList = data.delete;
        if (deleteList) {
            for (let i = 0; i < deleteList.length; i++) {
                GuardianUtils.removeGuardianById(deleteList[i], i == deleteList.length - 1);
                let heroInfo = GuardianUtils.getGuardianHeroInfo(deleteList[i])
                if (heroInfo && heroInfo.guardian) {
                    GuardianUtils.updateGuardian(heroInfo.guardian.id, heroInfo.guardian)
                }
            }
            if (deleteList.length > 0) {
                gdk.e.emit(RoleEventId.GUARDIAN_REMOVE)
            }
        }
        GlobalUtil.sortArray(this.model.guardianItems, (a, b) => {
            return a.series - b.series
        })
    }

    /**背包 守护者装备数据列表 */
    _onGuardianEquipListRsp(data: icmsg.GuardianEquipListRsp) {
        this.model.equipIdItems = {}
        this.model.equipItems = []
        let list = data.list
        let len = list.length
        for (let index = 0; index < len; index++) {
            const element: icmsg.GuardianEquip = list[index];
            if (element.id > 0) {
                GuardianUtils.updateEquip(element.id, element, len == index + 1)
            }
        }
    }

    /**装备数据更新 */
    _onGuardianEquipUpdateRsp(data: icmsg.GuardianEquipUpdateRsp) {
        let list = data.list
        if (list) {
            let len = list.length
            for (let index = 0; index < len; index++) {
                const element: icmsg.GuardianEquip = list[index];
                if (element.id > 0) {
                    GuardianUtils.updateEquip(element.id, element, len == index + 1)
                }
            }
            if (len > 0) {
                gdk.e.emit(RoleEventId.GUARDIANEQUIP_UPDATE)
            }
        }

        let deleteList = data.delete;
        if (deleteList) {
            for (let i = 0; i < deleteList.length; i++) {
                GuardianUtils.removeEquipById(deleteList[i], i == deleteList.length - 1);
            }
            if (deleteList.length > 0) {
                gdk.e.emit(RoleEventId.GUARDIANEQUIP_UPDATE)
            }
        }
        GlobalUtil.sortArray(this.model.equipItems, (a, b) => {
            return a.series - b.series
        })
    }

    /**守护者回退 */
    _onGuardianFallbackRsp(resp: icmsg.GuardianFallbackRsp) {
        GuardianUtils.updateGuardian(resp.guardian.id, resp.guardian)
        gdk.e.emit(RoleEventId.GUARDIANEQUIP_UPDATE)
    }
}