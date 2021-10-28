import ConfigManager from '../../../../common/managers/ConfigManager';
import FHGuessSupportItemCtrl from './FHGuessSupportItemCtrl';
import FootHoldModel from '../footHold/FootHoldModel';
import ModelManager from '../../../../common/managers/ModelManager';
import StringUtils from '../../../../common/utils/StringUtils';
import { Foothold_quizCfg } from '../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-04 17:26:30
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cross/FHGuessSupportCtrl")
export default class FHGuessSupportCtrl extends gdk.BasePanel {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    supportItem: cc.Node = null;

    @property(cc.RichText)
    guessDesLab: cc.RichText = null;

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        let args = this.args[0]
        let quizCfg = ConfigManager.getItemById(Foothold_quizCfg, this.footHoldModel.guessType)

        if (quizCfg) {
            let datas = this.footHoldModel.guessGuilds
            let str = quizCfg.content
            if (quizCfg.number == 2) {
                for (let i = 0; i < quizCfg.number; i++) {
                    str = str.replace("%s", datas[i].name)
                }
            }
            this.guessDesLab.string = StringUtils.setRichtOutLine(`${StringUtils.format(gdk.i18n.t("i18n:FOOTHOLD_TIP58"), args)}${str}`, "#753300", 2)
        }
        this._updateViewInfo()
    }

    _updateViewInfo() {
        let datas = this.footHoldModel.guessGuilds
        for (let i = 0; i < datas.length; i++) {
            let item = cc.instantiate(this.supportItem)
            item.active = true
            this.content.addChild(item)
            let ctrl = item.getComponent(FHGuessSupportItemCtrl)
            ctrl.updateViewInfo(datas[i])
        }
    }

}
