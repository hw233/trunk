import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import GlobalUtil from '../../utils/GlobalUtil';
import HeroUtils from '../../utils/HeroUtils';
import ModelManager from '../ModelManager';
import RuneModel from '../../models/RuneModel';
import RuneUtils from '../../utils/RuneUtils';
import { BagEvent } from '../../../view/bag/enum/BagEvent';
import { BagType } from '../../models/BagModel';
import { RedPointEvent } from '../../utils/RedPointUtils';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-09 11:23:25 
  */
export default class RuneController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return []
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.RuneListRsp.MsgType, this._onRuneListRsp, this],
            [icmsg.RuneUpdateRsp.MsgType, this._onRuneUpdateRsp, this],
            [icmsg.RuneUpgradeRsp.MsgType, this._onRuneUpgradeRsp, this],
            [icmsg.RuneOnRsp.MsgType, this._onRuneOnRsp, this],
            [icmsg.RuneBlessInfoRsp.MsgType, this._onRuneBlessInfoRsp, this],
        ];
    }

    model: RuneModel = null
    onStart() {
        this.model = ModelManager.get(RuneModel)
        this.model.idItems = {}
        this.model.runeItems = []
    }

    onEnd() {
    }

    _onRuneListRsp(resp: icmsg.RuneListRsp) {
        this.model.idItems = {}
        this.model.runeItems = []
        let list = resp.list
        let len = list.length
        for (let index = 0; index < len; index++) {
            const element: icmsg.RuneInfo = list[index];
            if (element.id !== 0) {
                RuneUtils.updateRuneInfo(element.id, element, len == index + 1)
            }
        }
        GlobalUtil.sortArray(this.model.runeItems, (a, b) => {
            return a.series - b.series
        })
    }

    _onRuneUpdateRsp(resp: icmsg.RuneUpdateRsp) {
        let list = resp.list
        if (list) {
            let len = list.length
            for (let index = 0; index < len; index++) {
                const element: icmsg.RuneInfo = list[index];
                if (element.num > 0) {
                    RuneUtils.updateRuneInfo(element.id, element, len == index + 1)
                }
                else {
                    RuneUtils.removeRuneById(element.id, len == index + 1);
                }
            }
        }

        let deleteList = resp.deleteList;
        if (deleteList) {
            for (let i = 0; i < deleteList.length; i++) {
                RuneUtils.removeRuneById(deleteList[i], i == deleteList.length - 1);
            }
        }

        GlobalUtil.sortArray(this.model.runeItems, (a, b) => {
            return a.series - b.series
        })
    }

    _onRuneUpgradeRsp(resp: icmsg.RuneUpgradeRsp) {
        // if (resp.heroId > 0) {
        //     for (let i = 0; i < this.model.runeInHeros.length; i++) {
        //         if (this.model.runeInHeros[i].series == parseInt(`${resp.heroId}${resp.bRuneId}`)) {
        //             this.model.runeInHeros.splice(i, 1);
        //             break;
        //         }
        //     }
        //     let newItem: BagItem = {
        //         series: parseInt(`${resp.heroId}${resp.aRuneId}`),
        //         itemId: resp.aRuneId,
        //         itemNum: 1,
        //         type: BagType.RUNE,
        //         extInfo: new RuneInfo({
        //             id: resp.aRuneId,
        //             num: 1,
        //             heroId: resp.heroId
        //         }),
        //     }
        //     this.model.runeInHeros.push(newItem);
        //     //todo emit
        // }
    }

    _onRuneOnRsp(resp: icmsg.RuneOnRsp) {
        let info = HeroUtils.getHeroInfoByHeroId(resp.heroId);
        if (info) {
            info.runes = resp.runes;
            gdk.e.emit(BagEvent.UPDATE_BAG_ITEM, BagType.RUNE);
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        }
    }

    /**
     * 洗练祝福值
     * @param resp 
     */
    _onRuneBlessInfoRsp(resp: icmsg.RuneBlessInfoRsp) {
        this.model.blessMap = {};
        resp.list.forEach(l => {
            let blessId: number;
            if (l.heroId > 0) {
                let info = HeroUtils.getHeroInfoByHeroId(l.heroId);
                if (info) {
                    blessId = parseInt(`${l.runeId}${info.typeId}${l.heroId}`);
                }
            }
            else {
                blessId = parseInt(`${l.runeId}${l.index}`);
            }
            this.model.blessMap[blessId] = l;
        });
    }
}