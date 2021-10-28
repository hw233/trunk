import ConfigManager from '../../../../common/managers/ConfigManager';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { MainInterface_mainCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-08-10 13:46:28 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/storageAct/StorageActMainIconCtrl")
export default class StorageActMainIconCtrl extends cc.Component {
    @property({ type: cc.Integer, tooltip: "图标入口类型,配置表mainInterface" })
    entranceType: number = 0;

    onLoad() {
        this.node.width = this.node.height = 0;
        this.node.opacity = 0;
        gdk.e.on(ActivityEventId.ACTIVITY_OPEN_CONDITION_SATISFY, this._onActOpen, this);
        gdk.e.on(ActivityEventId.ACTIVITY_STORAGE_MAIN_ICON_HIDE, this._hideMainIcon, this);
    }

    onEnable() {
        gdk.e.on(ActivityEventId.ACTIVITY_STORAGE_NEW_FALG_HIDE, this._onHideNewFlag, this);
    }

    onDisable() {
        this.node.width = this.node.height = 0;
        this.node.opacity = 0;
        gdk.e.off(ActivityEventId.ACTIVITY_STORAGE_NEW_FALG_HIDE, this._onHideNewFlag, this);
    }

    onDestroy() {
        gdk.e.targetOff(this);
    }

    _onHideNewFlag(e: gdk.Event) {
        if (e.data == this.entranceType) {
            let flag = this.node.getChildByName('newFlag');
            if (flag) {
                flag.stopAllActions();
                flag.setScale(1);
                flag.active = false;
            }
        }
    }

    _onActOpen(e: gdk.Event) {
        let id = e.data;
        let cfg = ConfigManager.getItemById(MainInterface_mainCfg, id);
        if (cfg && cfg.entrance && cfg.entrance.indexOf(this.entranceType) !== -1) {
            this.node.width = this.node.height = 110;
            this.node.opacity = 255;
        }
    }

    _hideMainIcon(e: gdk.Event) {
        if (e.data == this.entranceType) {
            this.node.width = this.node.height = 0;
            this.node.opacity = 0;
        }
    }
}
