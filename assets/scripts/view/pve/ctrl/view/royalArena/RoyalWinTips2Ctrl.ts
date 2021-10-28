import { Royal_sceneCfg } from "../../../../../a/config";
import ConfigManager from "../../../../../common/managers/ConfigManager";
import PveSceneState from "../../../enum/PveSceneState";
import PveSceneModel from "../../../model/PveSceneModel";
import PveSceneCtrl from "../../PveSceneCtrl";



/** 
 * 皇家竞技场胜利条件窗口2
 * @Author:  yaozu.hu
 * @Date: 2021-04-26 10:43:06
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-28 17:53:25
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/RoyalWinTips2Ctrl")
export default class RoyalWinTips2Ctrl extends cc.Component {


    @property(cc.Label)
    desLb: cc.Label = null;
    @property(cc.Node)
    testNode: cc.Node = null;
    @property(cc.Node)
    btn1: cc.Node = null;

    sceneModel: PveSceneModel;
    isShrink: boolean = false;

    onEnable() {
        this.node.setPosition(0, 70)
        this.btn1.active = false;
        this.isShrink = false;
        let view = gdk.gui.getCurrentView();
        this.sceneModel = view.getComponent(PveSceneCtrl).model;

        // let temCfg = ConfigManager.getItemByField(Hero_awakeCfg, 'copy_id', this.sceneModel.stageConfig.id)
        // GlobalUtil.setSpriteIcon(this.node, this.heroIcon, GlobalUtil.getHeadIconById(temCfg.hero_id));

        this.refreshDes();

    }

    @gdk.binding('sceneModel.stageConfig')
    refreshDes() {
        if (this.sceneModel) {
            let temCfg = ConfigManager.getItemByField(Royal_sceneCfg, 'stage_id', this.sceneModel.stageConfig.id)
            //this.nameLb.string = temCfg.scene_name;
            this.desLb.string = temCfg.victory_des;
        }
        if (this.sceneModel.arenaSyncData.fightType == 'ROYAL') {
            this.testNode.active = false
        } else {
            this.testNode.active = true
        }
    }
    @gdk.binding('sceneModel.state')
    _updateState(v: PveSceneState) {
        //!this.model.isMirror && gdk.Timer.once(100, this, this._updateStateLater);
        switch (v) {
            case PveSceneState.Fight:
                this.btn1.active = true;
                this.btn1.angle = 90;
                this.node.setPosition(0, 10)
                gdk.Timer.once(2000, this, this._shrinkAni)
                break;
            case PveSceneState.Ready:
                this.node.setPosition(0, 70)
                this.btn1.active = false;
                this.isShrink = false;
                break;
        }
    }

    onDisable() {
        this.node.stopAllActions();
        gdk.Timer.clearAll(this)
    }

    onShrinkBtnClick() {
        if (this.isShrink) this._extendAni();
        else this._shrinkAni();
    }

    _shrinkAni() {
        gdk.Timer.clearAll(this)
        this.isShrink = true;
        this.node.stopAllActions();
        this.btn1.angle = -90;
        this.node.runAction(cc.moveTo(.5, cc.v2(600, this.node.y)));
    }

    _extendAni() {
        this.isShrink = false;
        this.node.stopAllActions();
        this.btn1.angle = 90;
        this.node.runAction(cc.moveTo(.5, cc.v2(0, this.node.y)));
    }
}
