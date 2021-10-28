import PveLittleGameModel from "../../model/PveLittleGameModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PveLittleGameBuildTowerCtrl extends cc.Component {

    @property(cc.Node)
    heroNameNode: cc.Node = null;
    @property(cc.Label)
    heroName: cc.Label = null;

    id: number = 0;
    sm: PveLittleGameModel;

    onEnable() {
        // 场景缩放值
        let scale = this.sm.scale;
        this.node.setScale(scale);
    }
}
