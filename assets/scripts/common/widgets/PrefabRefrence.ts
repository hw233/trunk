/** 
 * prefab引用
 * @Author: sthoo.huang  
 * @Date: 2019-11-26 11:26:15 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-11-26 19:54:45
 */
const { ccclass, property, menu, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
@menu("qszc/common/widgets/PrefabRefrence")
export default class PrefabRefrence extends cc.Component {

    @property(cc.Boolean)
    _syncPrefab: boolean = true;
    @property({ tooltip: "同步预制体" })
    get syncPrefab(): boolean {
        return this._syncPrefab;
    }
    set syncPrefab(b: boolean) {
        this._syncPrefab = b;
        this._updatePrefab();
    }

    @property({ type: cc.Node, tooltip: "实例父节点" })
    parent: cc.Node = null;

    @property({ type: cc.Node, tooltip: "自动创建的预制体实例，不要手动指定" })
    instance: cc.Node = null;

    @property({ type: cc.Prefab })
    _prefabRef: cc.Prefab = null;
    @property({ type: cc.Prefab, tooltip: "引用的预制体" })
    get prefab(): cc.Prefab {
        return this._prefabRef;
    }
    set prefab(v: cc.Prefab) {
        this._prefabRef = v;
        CC_EDITOR && this._updatePrefab();
    }

    onEnable() {
        CC_EDITOR && this._updatePrefab();
    }

    _updatePrefab() {
        if (!this.syncPrefab) return;
        if (!CC_EDITOR) return;
        let index: number = -1;
        let pos: cc.Vec2;
        let name: string;
        this.syncPrefab = false;
        if (this.instance) {
            // 清除旧的预制体实例
            index = this.instance.getSiblingIndex();
            pos = this.instance.getPosition();
            name = this.instance.name;
            this.instance.destroy();
        }
        // 创建新节点
        if (this._prefabRef) {
            let node = cc.instantiate(this._prefabRef);
            node.setPosition(pos || node.getPosition());
            node.name = name || this._prefabRef.name;
            this.parent.insertChild(node, index);
            this.instance = node;
        } else {
            // 清除节点
            this.instance = null;
        }
    }
}