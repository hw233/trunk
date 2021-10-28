import AdventureMainViewCtrl from './AdventureMainViewCtrl';
import AdventureModel from '../model/AdventureModel';
import AdventureUtils from '../utils/AdventureUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import TimerUtils from '../../../common/utils/TimerUtils';
import { Adventure_themeheroCfg } from '../../../a/config';
/**
 * @Description: 恭喜通关
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 12:06:04
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdventureFinishTipCtrl")
export default class AdventureFinishTipCtrl extends gdk.BasePanel {

    @property(cc.Label)
    typeLab: cc.Label = null;

    get adventureModel(): AdventureModel { return ModelManager.get(AdventureModel); }

    onEnable() {
        let cfg = ConfigManager.getItemByField(Adventure_themeheroCfg, "type", AdventureUtils.actRewardType, { difficulty: this.adventureModel.difficulty })
        this.typeLab.string = `【${cfg.difficulty_name}】`
    }

    onDisable() {
        this.adventureModel.isShowFinishTip = false
    }

    goFunc() {
        gdk.panel.hide(PanelId.AdventureFinishTip)
        if (AdventureUtils.isNextDifficulOpen()) {
            let msg = new icmsg.AdventureNextReq()
            NetManager.send(msg, () => {
                //请求地图信息
                let msg = new icmsg.AdventureStateReq()
                NetManager.send(msg, () => {
                    let curView = gdk.gui.getCurrentView()
                    let ctrl = curView.getComponent(AdventureMainViewCtrl)
                    ctrl.mapScrollview.stopAutoScroll()
                    ctrl.mapCtrl.node.setPosition(-450, -640)
                })
            })
        } else {
            let info = AdventureUtils.getNextDifficulOpenInfo()
            let time = info.time
            if (time > 0) {
                gdk.gui.showMessage(`${TimerUtils.format1(time / 1000)}${gdk.i18n.t("i18n:ADVENTURE_TIP1")}${info.name}${gdk.i18n.t("i18n:ADVENTURE_TIP4")}`)
            }
        }
    }

}