import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import CostumeModel from '../../models/CostumeModel';
import CostumeUtils from '../../utils/CostumeUtils';
import GlobalUtil from '../../utils/GlobalUtil';
import HeroUtils from '../../utils/HeroUtils';
import ModelManager from '../ModelManager';
import RuneUtils from '../../utils/RuneUtils';
import { BagEvent } from '../../../view/bag/enum/BagEvent';
import { BagType } from '../../models/BagModel';
import { RedPointEvent } from '../../utils/RedPointUtils';


/**
 * @Description: 神装相关数据
 * @Author:luoyong
 * @Date: 2020-12-28 10:54:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-30 17:25:23
 */
export default class CostumeController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return []
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.CostumeListRsp.MsgType, this._onCostumeListRsp, this],
            [icmsg.CostumeUpdateRsp.MsgType, this._onCostumeUpdateRsp, this],
            [icmsg.CostumeOnRsp.MsgType, this._onCostumeOnRsp, this],
        ];
    }

    model: CostumeModel = null
    onStart() {
        this.model = ModelManager.get(CostumeModel)
        this.model.idItems = {}
        this.model.costumeItems = []
    }

    onEnd() {
    }

    _onCostumeListRsp(data: icmsg.CostumeListRsp) {
        this.model.idItems = {}
        this.model.costumeItems = []
        let list = data.list
        let len = list.length
        for (let index = 0; index < len; index++) {
            const element: icmsg.CostumeInfo = list[index];
            if (element.id > 0) {
                CostumeUtils.updateCostumeInfo(element.id, element, len == index + 1)
            }
        }
        GlobalUtil.sortArray(this.model.costumeItems, (a, b) => {
            return a.series - b.series
        })
    }

    _onCostumeUpdateRsp(resp: icmsg.CostumeUpdateRsp) {
        let list = resp.list
        if (list) {
            let len = list.length
            for (let index = 0; index < len; index++) {
                const element: icmsg.CostumeInfo = list[index];
                if (element.id > 0) {
                    CostumeUtils.updateCostumeInfo(element.id, element, len == index + 1)
                }
            }
        }

        let deleteList = resp.deleteList;
        if (deleteList) {
            for (let i = 0; i < deleteList.length; i++) {
                CostumeUtils.removeCostumeById(deleteList[i], i == deleteList.length - 1);
            }
        }

        GlobalUtil.sortArray(this.model.costumeItems, (a, b) => {
            return a.series - b.series
        })
    }

    _onCostumeOnRsp(resp: icmsg.CostumeOnRsp) {
        let info = HeroUtils.getHeroInfoByHeroId(resp.heroId);
        if (info) {
            info.costumeIds = resp.list;
            gdk.e.emit(BagEvent.UPDATE_BAG_ITEM, BagType.COSTUME);
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        }
    }
}