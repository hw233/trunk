import ActUtil from '../../../act/util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import StoreModel from '../../model/StoreModel';
import StoreUtils from '../../../../common/utils/StoreUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { MainInterface_mainCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-11 13:38:04 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/heroAwake/HeroAwakeIconCtrl")
export default class HeroAwakeIconCtrl extends cc.Component {
    @property(cc.Node)
    heroIcon: cc.Node = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    actIconId: number;
    heroTypeId: number;
    onDisable() {
        this.unscheduleAllCallbacks();
    }

    init(actIconId: number, heroTypeId: number) {
        [this.actIconId, this.heroTypeId] = [actIconId, heroTypeId];
        let c = ConfigManager.getItemById(MainInterface_mainCfg, this.actIconId);
        let actCfg = ActUtil.getCfgByActId(c.isCustom);
        if (actCfg) {
            let icon = this.node.getChildByName('bg').getChildByName('icon');
            let title = this.node.getChildByName('bg').getChildByName('title');
            let url = 'view/act/texture/common/';
            GlobalUtil.setSpriteIcon(this.node, title, url + actCfg.name);
            GlobalUtil.setSpriteIcon(this.node, icon, url + actCfg.icon);
        }
        GlobalUtil.setSpriteIcon(this.node, this.heroIcon, HeroUtils.getHeroHeadIcon(heroTypeId, 11));
        this._updateTime();
        this.schedule(this._updateTime, 1);
    }

    onClick() {
        let awakeLv;
        let lvs = HeroUtils.getHeroAwakeLvs(this.heroTypeId);
        lvs.sort((a, b) => { return b - a; });
        for (let i = 0; i < lvs.length; i++) {
            for (let j = 1; j + lvs[i] <= 7; j++) {
                let lv = j + lvs[i];
                if (StoreUtils.getHeroAwakeGiftState(this.heroTypeId, lv) == 1) {
                    awakeLv = lv;
                    break;
                }
            }
            if (awakeLv >= 0) break;
        }
        gdk.panel.setArgs(PanelId.HeroAwakeGiftView, [this.heroTypeId, awakeLv]);
        gdk.panel.open(PanelId.HeroAwakeGiftView);
    }

    _updateTime() {
        let info = this.storeModel.heroAwakeGiftMap[this.heroTypeId];
        if (!info) return;
        let keys = Object.keys(info);
        let outTime = info[keys[0]].outTime * 1000;
        let now = GlobalUtil.getServerTime();
        let leftTime = Math.max(0, outTime - now);
        if (leftTime <= 0) {
            this.unscheduleAllCallbacks();
            this.node.removeFromParent();
            return;
        }
        this.timeLab.string = TimerUtils.format2(leftTime / 1000);
    }
}
