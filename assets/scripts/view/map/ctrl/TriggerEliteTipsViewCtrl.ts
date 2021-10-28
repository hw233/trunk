import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import CopyUtil from '../../../common/utils/CopyUtil';
import ModelManager from '../../../common/managers/ModelManager';
import { Copy_stageCfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-05-12 10:52:09 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/map/TriggerEliteTipsViewCtrl")
export default class TriggerEliteTipsViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    chapterLabel: cc.Label = null;

    onEnable() {
        let model = ModelManager.get(CopyModel);
        let triggerChapter = CopyUtil.getEliteStagePreChapters();
        if (triggerChapter.indexOf(model.lastCompleteStageId) != -1) {
            let cfg = ConfigManager.getItemByField(Copy_stageCfg, 'pre_condition', model.lastCompleteStageId);
            this.chapterLabel.string = CopyUtil.getChapterId(cfg.id) + '';
        }
        gdk.Timer.once(3000, this, this.close);
    }

    onDisable() {
        gdk.Timer.clearAll(this);
    }
}
