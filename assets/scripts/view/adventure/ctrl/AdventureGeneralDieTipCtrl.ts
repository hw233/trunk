import AdventureModel from '../model/AdventureModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import PveGeneralModel from '../../pve/model/PveGeneralModel';
import StringUtils from '../../../common/utils/StringUtils';
import { Adventure_globalCfg } from '../../../a/config';
/**
 * @Description: 探险事件--泉水回复
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-22 11:41:45
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure/AdventureGeneralDieTipCtrl")
export default class AdventureGeneralDieTipCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    playerSpine: sp.Skeleton = null

    @property(cc.Label)
    hpLab: cc.Label = null;

    get adventureModel(): AdventureModel { return ModelManager.get(AdventureModel); }

    onEnable() {
        let spineName = ModelManager.get(PveGeneralModel).skin;
        let url = StringUtils.format("spine/hero/{0}/1/{0}", spineName);
        this.playerSpine.node.scale = 0.4
        GlobalUtil.setSpineData(this.node, this.playerSpine, url, true, "stand_s", true, true);

        let blood = ConfigManager.getItemById(Adventure_globalCfg, "commander_HP").value[0]
        let hpTxt = "";
        hpTxt = '0'.repeat(blood);
        this.hpLab.string = hpTxt
    }

    onDisable() {

    }

    goFunc() {
        gdk.panel.hide(PanelId.AdventureGeneralDieTip)
        gdk.panel.open(PanelId.AdventureMainResume)
    }
}