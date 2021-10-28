import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import PiecesModel from '../../../../../common/models/PiecesModel';
import PiecesUtils from '../../../../pieces/utils/PiecesUtils';
import PveSceneModel from '../../../model/PveSceneModel';
import PveSceneState from '../../../enum/PveSceneState';
import { Pieces_fetterCfg } from '../../../../../a/config';
import { PiecesEventId } from '../../../../pieces/enum/PiecesEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-20 10:23:29 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesFetterCtrl")
export default class PvePiecesFetterCtrl extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    shrinkBtn: cc.Node = null;

    @property(cc.Node)
    fetterItem: cc.Node = null;

    get piecesModel(): PiecesModel { return ModelManager.get(PiecesModel); }

    model: PveSceneModel;
    cfgsMap: { [type: number]: Pieces_fetterCfg[] } = {};
    curShrinkState: number = 1; //1-展开 2-收缩
    onEnable() {
        this._initItems();
        this._updateItems();
        gdk.e.on(PiecesEventId.PIECES_PVP_HERO_ON_BATTLE, this._updateItems, this);
    }

    onDisable() {
        gdk.e.targetOff(this);
        this.node.stopAllActions();
    }

    clear() {
        this.cfgsMap = {};
        this.model = null;
    }

    updateState(m: PveSceneModel) {
        this.model = m;
        this.node.stopAllActions();
        if (this.model.state == PveSceneState.Fight) {
            if (this.curShrinkState !== 2) {
                this.curShrinkState = 2;
                this.node.runAction(cc.moveTo(.3, cc.v2(-502, 300)));
                this.shrinkBtn.scaleY = -1 * this.shrinkBtn.scaleY;
            }
        }
        else {
            if (this.curShrinkState !== 1) {
                this.curShrinkState = 1;
                this.node.runAction(cc.moveTo(.3, cc.v2(-360, 300)));
                this.shrinkBtn.scaleY = -1 * this.shrinkBtn.scaleY;
            }
        }
    }

    onShrinkBtnClick() {
        if (this.node.getNumberOfRunningActions() >= 1) return;
        if (this.curShrinkState == 1) {
            this.curShrinkState = 2;
            this.node.runAction(cc.moveTo(.3, cc.v2(-502, 300)));
        }
        else {
            this.curShrinkState = 1;
            this.node.runAction(cc.moveTo(.3, cc.v2(-360, 300)));
        }
        this.shrinkBtn.scaleY = -1 * this.shrinkBtn.scaleY;
    }

    _initItems() {
        this.cfgsMap = {};
        let cfgs = ConfigManager.getItems(Pieces_fetterCfg);
        cfgs.forEach(c => {
            if (!this.cfgsMap[c.fetter_type]) this.cfgsMap[c.fetter_type] = [];
            this.cfgsMap[c.fetter_type].push(c);
        });
        //create
        this.content.removeAllChildren();
        for (let key in this.cfgsMap) {
            let type = parseInt(key);
            let n = cc.find(`item${type}`, this.content);
            if (!n) {
                n = cc.instantiate(this.fetterItem);
                n.name = `item${type}`;
                n.parent = this.content;
            }
            n.targetOff(this);
            n.on('click', () => {
                //open details
                gdk.panel.setArgs(PanelId.PvePiecesFetterView, [...this.cfgsMap[key]]);
                gdk.panel.open(PanelId.PvePiecesFetterView);
            }, this);
        }
    }

    _updateItems() {
        for (let key in this.cfgsMap) {
            let type = parseInt(key);
            let n = cc.find(`item${type}`, this.content);
            //update
            let nums = PiecesUtils.getFetterNumState(type);
            GlobalUtil.setSpriteIcon(this.content, cc.find('icon', n), `view/pve/texture/ui/pieces/${this.cfgsMap[key][0].icon}`);
            cc.find('proNum', n).getComponent(cc.Label).string = `${nums[0]}/${nums[1]}`;
            cc.find('proBar', n).getComponent(cc.Label).string = '';
            if (nums[0] <= 0) {
                n.active = false;
            }
            else {
                n.active = true;
            }
        }
    }
}
