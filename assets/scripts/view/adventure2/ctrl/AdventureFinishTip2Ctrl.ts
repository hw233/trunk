import AdventureMainView2Ctrl from './AdventureMainView2Ctrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import NewAdventureModel from '../model/NewAdventureModel';
import NewAdventureUtils from '../utils/NewAdventureUtils';
import PanelId from '../../../configs/ids/PanelId';
import TimerUtils from '../../../common/utils/TimerUtils';
import { Adventure2_themeheroCfg } from '../../../a/config';

/**
 * @Description: 恭喜通关
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-24 20:48:04
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdventureFinishTipCtrl")
export default class AdventureFinishTipCtrl extends gdk.BasePanel {

    @property(cc.Label)
    typeLab: cc.Label = null;

    @property(cc.Node)
    nextNode: cc.Node = null;

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    onEnable() {
        let cfg = ConfigManager.getItemByField(Adventure2_themeheroCfg, "type", NewAdventureUtils.actRewardType, { difficulty: this.adventureModel.difficulty })
        this.typeLab.string = `【${cfg.difficulty_name}】`

        this.nextNode.active = this.adventureModel.difficulty < 3
    }

    onDisable() {

    }

    goFunc() {
        this.adventureModel.isShowFinishTip = false
        gdk.panel.hide(PanelId.AdventureFinishTip2)
        if (NewAdventureUtils.isNextDifficulOpen(this.adventureModel.difficulty + 1)) {
            let msg = new icmsg.Adventure2NextReq()
            msg.difficulty = this.adventureModel.difficulty + 1
            NetManager.send(msg, () => {
                //请求地图信息
                let msg = new icmsg.Adventure2StateReq()
                NetManager.send(msg, () => {
                    let curView = gdk.gui.getCurrentView()
                    let ctrl = curView.getComponent(AdventureMainView2Ctrl)
                    ctrl.mapScrollview.stopAutoScroll()
                    //ctrl.mapCtrl.node.setPosition(-600, -640)
                })
            })
        } else {
            let info = NewAdventureUtils.getNextDifficulOpenInfo()
            let time = info.time
            if (time > 0) {
                gdk.gui.showMessage(`${TimerUtils.format1(time / 1000)}${gdk.i18n.t("i18n:ADVENTURE_TIP1")}${info.name}${gdk.i18n.t("i18n:ADVENTURE_TIP4")}`)
            }
        }
    }

}