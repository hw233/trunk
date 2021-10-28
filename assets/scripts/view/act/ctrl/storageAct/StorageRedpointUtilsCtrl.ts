import ActivityIconItemCtrl from '../ActivityIconItemCtrl';
import RedPointCtrl from '../../../../common/widgets/RedPointCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-08-09 15:31:11 
  */
const { ccclass, property, menu, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
@menu("qszc/view/act/storageAct/StorageRedpointUtilsCtrl")
export default class StorageRedpointUtilsCtrl extends cc.Component {
    @property({ type: cc.Integer, tooltip: "图标入口类型,配置表mainInterface" })
    entranceType: number = 0;

    @property(cc.Boolean)
    _culAllRed: boolean = false;
    @property({ tooltip: "刷新红点ids" })
    get culAllRed(): boolean {
        return this._culAllRed;
    }
    set culAllRed(b: boolean) {
        this._culAllRed = b;
        this._updatePrefab();
    }

    @property({ type: cc.Node, tooltip: "修改节点" })
    targetNode: cc.Node = null;

    @property({ type: cc.Prefab, tooltip: "统计节点" })
    culNodePrefab: cc.Prefab = null;

    map: { [id: number]: number[] } = {
        1: [3], 2: [1], 3: [5], 4: [5], 5: [5], 7: [2], 12: [7],
        16: [1], 18: [5], 19: [7], 20: [7], 21: [7], 22: [7], 23: [0, 7], 25: [0, 6],
        26: [0, 6], 28: [5], 29: [7], 30: [7], 31: [0, 6], 32: [0, 7], 33: [7], 34: [0, 6],
        35: [0, 7], 36: [7], 37: [7], 39: [7], 40: [7], 41: [7], 42: [6], 43: [6],
        44: [0, 7], 45: [5], 46: [7], 47: [0, 7], 49: [0, 7], 52: [0, 7], 53: [7],
        54: [3], 55: [4], 56: [5], 57: [5], 58: [5], 59: [5], 68: [0, 7], 69: [4],
        70: [4], 71: [4], 72: [0, 7], 73: [0, 7], 74: [7]
    }

    _redpointOrIds: number[] = [];
    _creatNode: cc.Node;
    _updatePrefab() {
        if (!this.culAllRed) return;
        if (!CC_EDITOR) return;
        this._culAllRed = false;
        this._redpointOrIds = [];
        let redpointCtrl1 = this.targetNode.getComponent(RedPointCtrl);
        if (this._creatNode) {
            this._creatNode.destroy();
            this._creatNode = null;
        }
        this._creatNode = cc.instantiate(this.culNodePrefab);
        this._deepSerach(this._creatNode);
        redpointCtrl1.orIds = this._redpointOrIds;
        cc.log(this._redpointOrIds);
        cc.log(`数量:${this._redpointOrIds.length}`);
        cc.log("culAllRed  done!!");
    }

    _deepSerach(node: cc.Node) {
        let iconItemCtrl = node.getComponent(ActivityIconItemCtrl);
        if (iconItemCtrl && iconItemCtrl.id) {
            let e = this.map[iconItemCtrl.id];
            if (e && e.indexOf(this.entranceType) !== -1) {
                let ctrl = node.getComponent(RedPointCtrl);
                if (ctrl && ctrl.enabled) {
                    this._redpointOrIds.push(...ctrl.orIds);
                }
            }
        }

        for (let i = 0; i < node.children.length; i++) {
            this._deepSerach(node.children[i]);
        }
    }
}
