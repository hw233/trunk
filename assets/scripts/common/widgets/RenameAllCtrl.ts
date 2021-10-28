/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-09-02 15:55:29 
  */
const { ccclass, property, menu, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
@menu("qszc/common/widgets/RenameAll")
export default class RenameAll extends cc.Component {

    @property(cc.Boolean)
    _renameAll: boolean = false;
    @property({ tooltip: "子节点批量重命名" })
    get renameAll(): boolean {
        return this._renameAll;
    }
    set renameAll(b: boolean) {
        this._renameAll = b;
        this._updatePrefab();
    }

    @property({ type: cc.Node, tooltip: "父节点" })
    parent: cc.Node = null;

    @property({ type: cc.Node, tooltip: "需要排除的子节点" })
    excludeChild: cc.Node[] = [];

    @property({ tooltip: '1.使用*插入原始文件名称 2.使用#以数字插入指定位置' })
    rule: string = '';

    @property({ type: cc.Integer, tooltip: "开始于" })
    startNum: number = 1;

    @property({ type: cc.Integer, tooltip: "增量" })
    add: number = 1;

    @property({ type: cc.Integer, tooltip: "位数" })
    byteLen: number = 1;

    _infos = []

    onEnable() {
        CC_EDITOR && this._updatePrefab();
    }

    _updatePrefab() {
        if (!this.renameAll) return;
        if (!CC_EDITOR) return;
        this.renameAll = false;
        let excludeName = [];
        this.excludeChild.forEach(elemt => {
            excludeName.push(elemt.name);
        });

        let childs = this.parent.children;
        let startIdx = 0;
        childs.forEach(element => {
            let name = element.name;
            if (excludeName.indexOf(name) == -1) {
                let num = (this.startNum + startIdx * this.add).toString();
                if (num.length < this.byteLen) {
                    num = '0'.repeat(this.byteLen - num.length) + num;
                }
                element.name = this.rule.replace('*', name).replace('_', num);
                startIdx += 1;
            }
        })
        cc.log("renameAll  done!!");
    }
}