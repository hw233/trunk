import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PveEventId from '../../enum/PveEventId';
import PveSceneCtrl from '../PveSceneCtrl';
import PveSceneModel from '../../model/PveSceneModel';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-03-11 17:24:05 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveEndRuinsChapterConditionCtrl")
export default class PveEndRuinsChapterConditionCtrl extends cc.Component {
    // @property(cc.Node)
    // content: cc.Node = null;

    @property(cc.Node)
    shrinkBtn: cc.Node = null;

    @property([cc.Node])
    conditions: cc.Node[] = [];

    starSpStrs: string[] = ['view/instance/texture/endRuins/xsl_xingxing', 'view/instance/texture/endRuins/fb_xingxing01'];
    sceneModel: PveSceneModel;
    isShrink: boolean = false;
    onEnable() {
        this.node.setPosition(-cc.view.getVisibleSize().width / 2 + 10, cc.view.getVisibleSize().height / 2 - 180)
        this._updateView();
        gdk.e.on(PveEventId.PVE_GATE_CONDITION_UPDATE, this._updateView, this);
    }

    onDisable() {
        this.node.stopAllActions();
        gdk.e.targetOff(this);
    }

    _updateView() {
        let view = gdk.gui.getCurrentView();
        this.sceneModel = view.getComponent(PveSceneCtrl).model;
        if (this.sceneModel.gateconditionUtil) {
            let dataList = this.sceneModel.gateconditionUtil.DataList;
            this.conditions.forEach((n, idx) => {
                let data = dataList[idx];
                n.active = !!data;
                if (n.active) {
                    let starIcon = n.getChildByName('star');
                    let lab = n.getChildByName('lab').getComponent(cc.RichText);
                    let state = data.start && data.state
                    GlobalUtil.setSpriteIcon(this.node, starIcon, this.starSpStrs[state ? 0 : 1]);
                    lab.string = `<color=#FFF6A5><outline color=#943B0D width=2>${data.cfg.des}</outline></c>`;
                }
            });
        }
        else {
            this.node.active = false;
        }
    }

    onShrinkBtnClick() {
        if (this.isShrink) this._extendAni();
        else this._shrinkAni();
    }

    _shrinkAni() {
        this.isShrink = true;
        this.node.stopAllActions();
        this.shrinkBtn.getChildByName('icon').scale = -1;
        this.node.runAction(cc.moveTo(.5, cc.v2(-cc.view.getVisibleSize().width / 2 - this.node.width + 10, this.node.y)));
    }

    _extendAni() {
        this.isShrink = false;
        this.node.stopAllActions();
        this.shrinkBtn.getChildByName('icon').scale = 1;
        this.node.runAction(cc.moveTo(.5, cc.v2(-cc.view.getVisibleSize().width / 2 + 10, this.node.y)));
    }
}
