import AdventureMainViewCtrl from './AdventureMainViewCtrl';
import AdventureModel from '../model/AdventureModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import PveGeneralModel from '../../pve/model/PveGeneralModel';
import StringUtils from '../../../common/utils/StringUtils';
import { Adventure_globalCfg } from '../../../a/config';
import { AskInfoType } from '../../../common/widgets/AskPanel';
/**
 * @Description: 探险事件--泉水回复
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 12:08:09
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdvPlateResumePanelCtrl")
export default class AdvPlateResumePanelCtrl extends gdk.BasePanel {

    @property(cc.Label)
    hpLab: cc.Label = null;

    @property(sp.Skeleton)
    playerSpine: sp.Skeleton = null

    @property(cc.Label)
    desLab: cc.Label = null;

    get adventureModel(): AdventureModel { return ModelManager.get(AdventureModel); }

    onEnable() {
        let spineName = ModelManager.get(PveGeneralModel).skin;
        let url = StringUtils.format("spine/hero/{0}/1/{0}", spineName);
        this.playerSpine.node.scale = 0.4
        GlobalUtil.setSpineData(this.node, this.playerSpine, url, true, "stand_s", true, true);
        this.updateHp()
    }

    onDisable() {

    }

    updateHp() {
        let blood = ConfigManager.getItemById(Adventure_globalCfg, "commander_HP").value[0]
        let hpTxt = "";
        hpTxt = '0'.repeat(blood);
        this.hpLab.string = hpTxt
        this.desLab.string = StringUtils.format(gdk.i18n.t("i18n:ADVENTURE_TIP5"), blood) //`使用后探险者生命值回复至${blood}点`
    }

    clickFunc() {
        let blood = ConfigManager.getItemById(Adventure_globalCfg, "commander_HP").value[0]
        if (this.adventureModel.blood >= blood) {
            let info: AskInfoType = {
                title: gdk.i18n.t("i18n:ADVENTURE_TIP8"),
                sureCb: () => {
                    this._reqFunc()
                },
                descText: gdk.i18n.t("i18n:ADVENTURE_TIP7"),
                thisArg: this,
            }
            GlobalUtil.openAskPanel(info)
        } else {
            this._reqFunc()
        }
    }

    _reqFunc() {
        let msg = new icmsg.AdventureConsumptionEventReq()
        msg.plateIndex = this.adventureModel.selectIndex
        NetManager.send(msg, (data: icmsg.AdventureConsumptionEventRsp) => {
            this.adventureModel.blood = data.blood
            this.adventureModel.historyPlate.push(this.adventureModel.plateIndex)//上一个点
            this.adventureModel.lastPlate = this.adventureModel.plateIndex
            this.adventureModel.plateIndex = data.plateIndex
            this.adventureModel.plateFinish = true
            this.adventureModel.isMove = true
            gdk.panel.hide(PanelId.AdvPlateResumePanel)
            gdk.gui.showMessage(gdk.i18n.t("i18n:ADVENTURE_TIP43"))
            let curView = gdk.gui.getCurrentView()
            let ctrl = curView.getComponent(AdventureMainViewCtrl)
            ctrl.refreshPoints()
        })
    }
}