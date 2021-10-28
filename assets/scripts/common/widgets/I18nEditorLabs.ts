/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-15 17:39:21 
  */
const { ccclass, property, menu, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
@menu("i18n/editorLabs")
export default class I18nEditorLabs extends cc.Component {
    @property(cc.Boolean)
    _initZhCnMap: boolean = false;
    @property({ tooltip: "生成多语言map" })
    get initZhCnMap(): boolean {
        return this._initZhCnMap;
    }
    set initZhCnMap(b: boolean) {
        this._initZhCnMap = b;
        if (b) {
            CC_EDITOR && this._initLanguagesMap();
            this.showI18nId = true;
        }
        else {
            this.showI18nId = false;
        }
    }

    @property(cc.Boolean)
    _showI18nId: boolean = false;
    @property({ tooltip: "显示多语言id,新id则输出控制台" })
    get showI18nId(): boolean {
        return this._showI18nId;
    }
    set showI18nId(b: boolean) {
        this._showI18nId = b;
        CC_EDITOR && this._update();
    }

    //菜单项名称列表
    @property({})
    _excludeStrs: string[] = [];
    @property({ type: cc.String, displayName: "excludeStrs", tooltip: "排除labString" })
    get excludeStrs(): string[] {
        return this._excludeStrs;
    }
    set excludeStrs(names: string[]) {
        this.initZhCnMap = false;
        this._excludeStrs = names;
    }

    regExps: RegExp[] = [/^[A-Za-z0-9]*$/]
    lanMap: { [id: string]: string } = {}; // id-string
    reversalLanMap: { [str: string]: string } = {} //string-id
    mainName: string;
    tipIdx: number = 1;
    _initLanguagesMap() {
        this.lanMap = {};
        this.reversalLanMap = {};
        this.lanMap = window['languages']['zh_CN'];
        for (let key in this.lanMap) {
            this.reversalLanMap[this.lanMap[key]] = key;
        }
        this.mainName = this.node.name.toUpperCase();
        this.tipIdx = 1;
    }

    _update() {
        if (Object.keys(this.lanMap).length <= 0) {
            this._initLanguagesMap();
        }
        this.node.children.forEach(n => {
            this.deepSerach(n);
        });
    }

    deepSerach(node: cc.Node) {
        let ctrl = node.getComponent(cc.Label) || node.getComponent(cc.RichText);
        if (ctrl && !this.filterNode(ctrl.string)) {
            if (!ctrl.font && !this.filterStr(ctrl.string)) {
                if (this.showI18nId) {
                    if (this.reversalLanMap[ctrl.string]) {
                        ctrl.string = `i18n:${this.reversalLanMap[ctrl.string]}`;
                    }
                    else {
                        this.lanMap[`${this.mainName}_TIP${this.tipIdx}`] = ctrl.string;
                        this.reversalLanMap[ctrl.string] = `${this.mainName}_TIP${this.tipIdx}`;
                        cc.log(`${this.mainName}_TIP${this.tipIdx}: ` + `'${ctrl.string}',`);
                        ctrl.string = `i18n:${this.mainName}_TIP${this.tipIdx}`;
                        this.tipIdx += 1;
                    }
                }
                else {
                    if (this.lanMap[ctrl.string.slice('i18n:'.length)]) {
                        ctrl.string = this.lanMap[ctrl.string.slice('i18n:'.length)];
                    }
                }
            }
        }

        if (node.children.length <= 0 || ctrl instanceof cc.RichText) return;
        else {
            node.children.forEach(n => {
                this.deepSerach(n);
            });
        }
    }

    filterNode(str: string) {
        // if (node.name.startsWith('i18n')) return true;
        for (let i = 0; i < this.excludeStrs.length; i++) {
            if (this.excludeStrs[i] !== "" && this.excludeStrs[i] == str) return true;
        }
        return false;
    }

    filterStr(str: string) {
        if (str === '') return true; //空字符串
        if (str === 'Label') return true; //label组件默认值
        if (str === '<color=#00ff00>Rich</c><color=#0fffff>Text</color>') return true;//richtext组件默认值
        //正则
        for (let i = 0; i < this.regExps.length; i++) {
            if (this.regExps[i].test(str)) {
                return true;
            }
        }
        return false;
    }
}
