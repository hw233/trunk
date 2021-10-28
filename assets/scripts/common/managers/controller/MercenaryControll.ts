import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import MercenaryModel from '../../../view/mercenary/model/MercenaryModel';
import ModelManager from '../ModelManager';

export default class MercenaryControll extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return []
    }
    get netEvents(): NetEventArray[] {
        return [
            [icmsg.MercenaryLentRsp.MsgType, this._onMercenaryLentRsp],
            [icmsg.MercenaryListRsp.MsgType, this._onMercenaryListRsp],
            [icmsg.MercenaryBorrowedRsp.MsgType, this._onMercenaryBorrowedRsp],
        ];
    }

    model: MercenaryModel

    onStart() {
        this.model = ModelManager.get(MercenaryModel)
    }

    onEnd() {

    }

    _onMercenaryLentRsp(data: icmsg.MercenaryLentRsp) {
        this.model.lentHeroList = data.list
    }

    _onMercenaryListRsp(data: icmsg.MercenaryListRsp) {
        this.model.listHero = data.list
    }

    _onMercenaryBorrowedRsp(data: icmsg.MercenaryBorrowedRsp) {
        this.model.borrowedListHero = data.list
    }

}