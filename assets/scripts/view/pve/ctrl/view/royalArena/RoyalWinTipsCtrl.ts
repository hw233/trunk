import { Royal_sceneCfg } from "../../../../../a/config";
import ConfigManager from "../../../../../common/managers/ConfigManager";
import PveSceneState from "../../../enum/PveSceneState";
import PveSceneModel from "../../../model/PveSceneModel";
import PveSceneCtrl from "../../PveSceneCtrl";



/** 
 * 皇家竞技场胜利条件窗口
 * @Author:  yaozu.hu
 * @Date: 2021-04-26 10:43:06
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-28 17:53:25
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/RoyalWinTipsCtrl")
export default class RoyalWinTipsCtrl extends cc.Component {


    @property(cc.Sprite)
    heroIcon: cc.Sprite = null;
    @property(cc.Label)
    desLb: cc.Label = null;
    @property(cc.Node)
    btn1: cc.Node = null;

    sceneModel: PveSceneModel;
    isShrink: boolean = false;

    onEnable() {
        this.node.setPosition(-cc.view.getVisibleSize().width / 2 + 10, cc.view.getVisibleSize().height / 2 - 180)
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
            this.desLb.string = temCfg.prompt;
        }
    }
    @gdk.binding('sceneModel.state')
    _updateState(v: PveSceneState) {
        //!this.model.isMirror && gdk.Timer.once(100, this, this._updateStateLater);
        switch (v) {
            case PveSceneState.Fight:
                gdk.Timer.once(100, this, this._shrinkAni)
                break;
            case PveSceneState.Ready:
                this.node.setPosition(-cc.view.getVisibleSize().width / 2 + 10, cc.view.getVisibleSize().height / 2 - 180)
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
        this.btn1.active = true;
        this.node.runAction(cc.moveTo(.5, cc.v2(-cc.view.getVisibleSize().width / 2 - this.node.width + 10, this.node.y)));
    }

    _extendAni() {
        this.isShrink = false;
        this.node.stopAllActions();
        this.btn1.active = false;
        this.node.runAction(cc.moveTo(.5, cc.v2(-cc.view.getVisibleSize().width / 2 + 10, this.node.y)));
    }
}
