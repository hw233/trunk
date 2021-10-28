/** 
 * prefab引用
 * @Author: sthoo.huang  
 * @Date: 2019-11-26 11:26:15 
 * @Last Modified by: luoyong
 * @Last Modified time: 2019-12-04 14:45:48
 */
const { ccclass, property, menu, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
@menu("qszc/common/widgets/PrefabAllRefrence")
export default class PrefabAllRefrence extends cc.Component {

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

    @property({ type: cc.Node, tooltip: "所有预制体实" })
    instanceList: cc.Node[] = []

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


    _infos = []

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
        let num = this.instanceList.length
        this._infos = []
        if (this.instanceList.length > 0) {
            // 清除旧的预制体实例
            this.instanceList.forEach(element => {
                index = element.getSiblingIndex();
                pos = element.getPosition();
                name = element.name;
                this._infos.push({ index: index, pos: pos, name: name })
                cc.log("-====" + index)
            });
            // index = this.instance.getSiblingIndex();
            // pos = this.instance.getPosition();
            // name = this.instance.name;
            // this.instance.destroy();

            this.instanceList.forEach(element => {
                element.destroy()
            })
        }

        // 创建新节点
        if (this._prefabRef) {
            this.instanceList = []
            for (let i = 0; i < num; i++) {
                let node = cc.instantiate(this._prefabRef);
                node.setPosition(this._infos[i].pos || node.getPosition());
                node.name = this._infos[i].name || this._prefabRef.name;
                this.parent.insertChild(node, index);
                this.instanceList.push(node)
            }
        } else {
            // 清除节点
            this.instanceList = [];
        }
    }
}