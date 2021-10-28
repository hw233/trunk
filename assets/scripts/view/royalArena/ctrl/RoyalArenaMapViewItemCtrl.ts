import { Royal_divisionCfg, Royal_sceneCfg } from "../../../a/config";
import ConfigManager from "../../../common/managers/ConfigManager";
import ModelManager from "../../../common/managers/ModelManager";
import RoleModel from "../../../common/models/RoleModel";
import RoyalModel from "../../../common/models/RoyalModel";
import GlobalUtil from "../../../common/utils/GlobalUtil";
import JumpUtils from "../../../common/utils/JumpUtils";
import UiListItem from "../../../common/widgets/UiListItem";
import PanelId from "../../../configs/ids/PanelId";


/** 
 * @Description: 皇家竞技场场景选择界面Itme
 * @Author: yaozu.hu
 * @Date: 2021-02-23 10:37:28
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-17 17:36:51
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/RoyalArenaMapViewItemCtrl")
export default class RoyalArenaMapViewItemCtrl extends UiListItem {

    @property(cc.Sprite)
    mapSp: cc.Sprite = null;

    @property(cc.Label)
    nameLb: cc.Label = null;

    @property(cc.Node)
    btn1: cc.Node = null;

    @property(cc.Node)
    lockNode: cc.Node = null;
    @property(cc.Sprite)
    divIcon: cc.Sprite = null;
    @property(cc.Label)
    divName: cc.Label = null;
    @property(cc.Label)
    tipsLb: cc.Label = null;

    cfg: Royal_sceneCfg;

    get royalModel() { return ModelManager.get(RoyalModel); }
    state: number = 0; //0 可选择 1可替换 2已选择
    lockState: boolean = false;

    updateView() {
        this.cfg = this.data;


        this.nameLb.string = this.cfg.scene_name;
        let divCfg = ConfigManager.getItemByField(Royal_divisionCfg, 'stage_id', this.cfg.id)
        if (divCfg) {
            this.lockState = this.royalModel.division < divCfg.division
        } else {
            this.lockState = false;
        }
        let mapPath = 'map/' + this.cfg.background;
        GlobalUtil.setSpriteIcon(this.node, this.mapSp, mapPath)
        this.btn1.active = true//!this.lockState;

        this.lockNode.active = this.lockState;
        if (this.lockState && divCfg) {
            GlobalUtil.setSpriteIcon(this.node, this.divIcon, 'view/act/texture/peak/' + divCfg.icon)
            this.divName.string = divCfg.name;
            this.tipsLb.string = divCfg.name + '段位解锁'
        }

    }

    onDisable() {

    }

    //练习按钮
    btn1Click() {
        ///gdk.gui.showMessage('练习模式即将开放，敬请期待')

        let model = this.royalModel
        model.curFightNum = 0;
        //let sceneCfg = ConfigManager.getItemById(Royal_sceneCfg, this.curCfg.stage_id)
        model.winElite = {};
        this.cfg.victory.forEach(data => {
            switch (data[0]) {
                case 1:
                case 2:
                case 3:
                    model.winElite[data[0]] = data[1];
                    break
                case 4:
                case 5:
                    model.winElite[data[0]] = true;
                    break;
                case 6:
                    model.winElite[data[0]] = [data[1], data[2]];
            }
        })
        model.testSceneId = this.cfg.id
        model.addSkillId = 0;
        //let brief: icmsg.RoleBrief = this.royalModel.playerData.brief
        let rmodel = ModelManager.get(RoleModel)
        let player = new icmsg.ArenaPlayer()
        player.name = 'test'
        player.head = rmodel.head
        player.frame = rmodel.frame
        player.power = 0//brief.power
        JumpUtils.openPveArenaScene([1, 0, player], 'test', "ROYAL_TEST");
        gdk.panel.hide(PanelId.RoyalArenaMapView)

    }


}
