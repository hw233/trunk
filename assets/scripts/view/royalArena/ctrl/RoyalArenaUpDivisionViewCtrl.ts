import { Royal_divisionCfg, Royal_sceneCfg } from "../../../a/config";
import ConfigManager from "../../../common/managers/ConfigManager";
import ModelManager from "../../../common/managers/ModelManager";
import RoyalModel from "../../../common/models/RoyalModel";
import GlobalUtil from "../../../common/utils/GlobalUtil";



/** 
 * @Description: 皇家竞技场段位提升View
 * @Author: yaozu.hu
 * @Date: 2021-02-23 10:37:28
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-17 17:36:51
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/RoyalArenaUpDivisionViewCtrl")
export default class RoyalArenaUpDivisionViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    mapSp: cc.Node = null;
    @property(cc.Label)
    mapName: cc.Label = null;

    @property(cc.Label)
    oldIconName: cc.Label = null;
    @property(cc.Sprite)
    oldIcon: cc.Sprite = null;

    @property(cc.Label)
    newIconName: cc.Label = null;
    @property(cc.Sprite)
    newIcon: cc.Sprite = null;

    get royalModel() { return ModelManager.get(RoyalModel); }
    onEnable() {
        GlobalUtil.setLocal('Royal_showDivUpView', false);
        let divCfg = ConfigManager.getItemByField(Royal_divisionCfg, 'division', this.royalModel.division);
        if (cc.js.isString(divCfg)) {
            this.close()
            return;
        }
        let stageId = cc.js.isNumber(divCfg.stage_id) ? divCfg.stage_id : divCfg.stage_id[0];
        let sceneCfg = ConfigManager.getItemById(Royal_sceneCfg, stageId)
        this.mapName.string = sceneCfg.scene_name;
        let mapPath = 'view/royalArena/texture/bg/' + sceneCfg.picture
        GlobalUtil.setSpriteIcon(this.node, this.mapSp, mapPath);

        let newDivCfg = ConfigManager.getItemByField(Royal_divisionCfg, 'division', this.royalModel.division);
        GlobalUtil.setSpriteIcon(this.node, this.newIcon, 'view/act/texture/peak/' + newDivCfg.icon)
        this.newIconName.string = newDivCfg.name;
        let oldDivCfg = ConfigManager.getItemByField(Royal_divisionCfg, 'division', this.royalModel.division - 1);
        GlobalUtil.setSpriteIcon(this.node, this.oldIcon, 'view/act/texture/peak/' + oldDivCfg.icon)
        this.oldIconName.string = oldDivCfg.name;

        this.node.setScale(.7);
        this.node.runAction(cc.sequence(
            cc.scaleTo(.2, 1.05, 1.05),
            cc.scaleTo(.15, 1, 1)
        ));
    }
    onDisable() {
        this.node.stopAllActions();
    }
}
