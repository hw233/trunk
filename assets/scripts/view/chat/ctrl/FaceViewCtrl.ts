import ChatModel from '../model/ChatModel';
import ModelManager from '../../../common/managers/ModelManager';
import { ChatEvent } from '../enum/ChatEvent';

/** 
 * @Author: weiliang.huang  
 * @Description: 表情界面
 * @Date: 2019-03-22 19:51:47 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-07-02 18:07:20
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/chat/FaceViewCtrl")
export default class FaceViewCtrl extends gdk.BasePanel {

    @property(gdk.List)
    list: gdk.List = null;

    start() {
        this.list.onItemClick.on(this._selectFace, this)
        this._initFaceView()
    }

    _initFaceView() {
        let model = ModelManager.get(ChatModel)
        let config = model.FaceConfig
        this.list.datas = config
    }


    _selectFace(index, data) {
        gdk.e.emit(ChatEvent.INPUT_TEXT_INFO, data.id)
        this.close()
    }
}
