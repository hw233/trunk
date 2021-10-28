import PanelId from '../../../../configs/ids/PanelId';
import PveSceneCtrl from '../PveSceneCtrl';
import PveSceneModel from '../../model/PveSceneModel';
import PveSceneState from '../../enum/PveSceneState';

/**
 * Pve实战演练通关条件展示
 * @Author: sthoo.huang
 * @Date: 2019-04-11 16:03:00
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-11 16:06:15
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveHeroDetailCtrl")
export default class PveGateConditionCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bgNode: cc.Node = null;
    @property(cc.Node)
    bg1Node: cc.Node = null;

    @property(cc.Node)
    layoutNode: cc.Node = null;

    @property([cc.Label])
    lbList: cc.Label[] = []

    @property([cc.Node])
    lbOverList: cc.Node[] = []
    @property([cc.Node])
    lbOver1List: cc.Node[] = []

    sceneModel: PveSceneModel;
    lbColorList: cc.Color[] = [cc.color('#37ff28'), cc.color('#f1b77f')]
    onEnable() {


        let arg = gdk.panel.getArgs(PanelId.PveGateConditionView);
        if (arg) {
            gdk.Timer.once(5000, this, this.close)
        }

        let view = gdk.gui.getCurrentView();
        //if (view === gdk.panel.get(PanelId.PveScene)) 
        this.sceneModel = view.getComponent(PveSceneCtrl).model;

        let dataList = this.sceneModel.gateconditionUtil.DataList;
        for (let i = 0; i < this.lbList.length; i++) {
            if (i < dataList.length) {
                this.lbList[i].node.active = true;
                this.lbList[i].string = dataList[i].cfg.des;
                let state = dataList[i].start && dataList[i].state
                //准备界面都未完成
                state = this.sceneModel.state == PveSceneState.Ready ? false : state;
                this.lbOverList[i].active = state
                this.lbOver1List[i].active = false
                let temColor: cc.Color = state ? this.lbColorList[0] : this.lbColorList[1]
                this.lbList[i].node.color = temColor;
            } else {
                this.lbList[i].node.active = false;
            }
        }
        this.bgNode.height = this.layoutNode.height + 160
        this.bg1Node.height = this.layoutNode.height + 40


    }

    onDisable() {
        gdk.Timer.clearAll(this);
    }

    close(buttonIndex: number = -1) {

        let end = cc.v2(300, (cc.winSize.height / 2 - 80))

        let tween = new cc.Tween();
        let mask = this.node.getChildByName('Mask');
        mask.active = false;
        tween.target(this.node)
            .to(0.3, { position: end, scale: 0 })
            .call(() => {
                super.close(buttonIndex);
                mask.active = true;
            })
            .start()

    }
}
