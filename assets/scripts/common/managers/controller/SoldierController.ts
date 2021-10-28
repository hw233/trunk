import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import HeroModel from '../../models/HeroModel';
import HeroUtils from '../../utils/HeroUtils';
import JumpUtils from '../../utils/JumpUtils';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import SoldierModel, { SoldierType } from '../../models/SoldierModel';
import { RoleEventId } from '../../../view/role/enum/RoleEventId';
import { SoldierEventId } from '../../../view/role/enum/SoldierEventId';

/**
 * @Description: 士兵通信
 * @Author: weiliang.huang
 * @Date: 2019-05-05 14:16:41
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 10:48:21
 */


export default class SoldierController extends BaseController {

    model: SoldierModel = null;

    get gdkEvents(): GdkEventArray[] {
        return [];
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.HeroSoldierListRsp.MsgType, this._onHeroSoldierListRsp],
            [icmsg.HeroSoldierChangeRsp.MsgType, this._onHeroSoldierChangeRsp],
            [icmsg.HeroSoldierInfoRsp.MsgType, this._onHeroSoldierInfoRsp],
        ];
    }

    onStart() {
        this.model = ModelManager.get(SoldierModel);
    }

    onEnd() {
        this.model = null;
    }

    _onHeroSoldierListRsp(data: icmsg.HeroSoldierListRsp) {
        let heroSoldiers = this.model.heroSoldiers
        let info: SoldierType = {
            curId: data.soldierId,
            // list: data.list,
            items: {},
        }
        for (let index = 0; index < data.list.length; index++) {
            const element = data.list[index];
            info.items[element.soldierId] = element
        }
        heroSoldiers[data.heroId] = info
        gdk.e.emit(SoldierEventId.RSP_SOLDIER_LIST)
    }

    _onHeroSoldierChangeRsp(data: icmsg.HeroSoldierChangeRsp) {
        let heroSoldiers = this.model.heroSoldiers
        if (heroSoldiers[data.heroId]) {
            heroSoldiers[data.heroId].curId = data.soldierId
            if (!heroSoldiers[data.heroId].items[data.soldierId]) {
                let msg = new icmsg.HeroSoldierInfoReq()
                msg.heroId = data.heroId
                msg.soldierId = data.soldierId
                NetManager.send(msg)
            }
        }
        let heroInfo = HeroUtils.getHeroInfoByHeroId(data.heroId);
        let heroModel = ModelManager.get(HeroModel);
        let curHero = heroModel.curHeroInfo;
        if (curHero && heroInfo.heroId == curHero.heroId) {
            JumpUtils.updatePowerTip(curHero.power, data.power);
        }
        heroInfo.power = data.power;
        heroInfo.soldierId = data.soldierId;
        HeroUtils.removeFightHeroInfo(data.heroId);
        gdk.e.emit(SoldierEventId.RSP_SOLDIER_CHANGE, data)
        gdk.e.emit(RoleEventId.UPDATE_CURR_HERO_INFO)
    }

    _onHeroSoldierInfoRsp(data: icmsg.HeroSoldierInfoRsp) {
        let curHeroInfo = ModelManager.get(HeroModel).curHeroInfo;
        let heroSoldiers = this.model.heroSoldiers;
        if (!heroSoldiers[data.heroId]) {
            let info: SoldierType = {
                curId: curHeroInfo.soldierId,
                items: {},
            };
            heroSoldiers[data.heroId] = info;
            info.items[data.soldierId] = data.soldier;
        } else {
            let hasInfo: SoldierType = heroSoldiers[data.heroId];
            hasInfo.items[data.soldierId] = data.soldier;
        }
        gdk.e.emit(SoldierEventId.RSP_SOLDIER_INFO);
        gdk.e.emit(RoleEventId.UPDATE_HERO_ATTR);

    }
} 