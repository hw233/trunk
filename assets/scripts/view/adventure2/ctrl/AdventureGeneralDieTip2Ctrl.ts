import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NewAdventureModel from '../model/NewAdventureModel';
import PanelId from '../../../configs/ids/PanelId';
import PveGeneralModel from '../../pve/model/PveGeneralModel';
import StringUtils from '../../../common/utils/StringUtils';
import { Adventure2_globalCfg } from '../../../a/config';
/**
 * @Description: 探险事件--泉水回复
 * @Author: luoyong
 * @Date: 2020-11-09 11:02:40
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-14 09:59:58
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/adventure2/AdventureGeneralDieTip2Ctrl")
export default class AdventureGeneralDieTip2Ctrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    playerSpine: sp.Skeleton = null

    @property(cc.Label)
    hpLab: cc.Label = null;

    get adventureModel(): NewAdventureModel { return ModelManager.get(NewAdventureModel); }

    onEnable() {
        let spineName = ModelManager.get(PveGeneralModel).skin;
        let url = StringUtils.format("spine/hero/{0}/1/{0}", spineName);
        this.playerSpine.node.scale = 0.4
        GlobalUtil.setSpineData(this.node, this.playerSpine, url, true, "stand_s", true, true);

        let blood = ConfigManager.getItemById(Adventure2_globalCfg, "commander_HP").value[0]
        let hpTxt = "";
        hpTxt = '0'.repeat(blood);
        this.hpLab.string = hpTxt
    }

    onDisable() {

    }

    goFunc() {
        gdk.panel.hide(PanelId.AdventureGeneralDieTip2)
        gdk.panel.open(PanelId.AdventureMainResume2)
    }
}