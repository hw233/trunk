import MathUtil from './MathUtil';
import StringUtils from './StringUtils';
/** 
 * 战斗用到的数学函数类
 * @Author: sthoo.huang  
 * @Date: 2020-04-13 18:10:39 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-22 09:47:59
 */

// 表达式缓存
const MATH_EXPR_CACHE: { [key: string]: Function | { jit: boolean, eval: Function } } = {};
const MATH_EVENTS_CACHE: { [key: string]: any } = { '': {} };

// 环境是否支持new Function方式优化表达式
const MATH_EXPR_SUPPORT_JIT = (() => {
    try {
        return new Function('return true')();
    } catch (err) { };
    return false;
})();

// 表达式预编译缓存
const PRE_EXPR_PARSED_CACHE: { [id: string]: Function } = (() => {
    if (CC_DEBUG) {
        let reg = new RegExp("(^|&)" + "config=([^&]*)(&|$)", "i");
        let r = (window.location.search.substr(1)).match(reg);
        if (r != null) {
            if (decodeURIComponent(r[2])) {
                // 从外部链接下载配置文件
                return null;
            }
        }
    }
    let name = 'getSkillExprCache';
    let func = window[name];
    if (func) {
        window[name] = null;
        return func();
    }
    return null;
})();

class FightingMathClass {

    private _oldFuns: any;
    private _newFuns: any;
    private _seed: number;

    constructor() {
        // 新的函数
        this._newFuns = {
            'random': this.random.bind(this),
            'rate': this.rate.bind(this),
            'rnd': this.rnd.bind(this),
            'shuffle': this.shuffle.bind(this),
        };
        // 备份原函数
        this._oldFuns = {};
        for (let key in this._newFuns) {
            if (typeof gdk.math[key] === 'function') {
                this._oldFuns[key] = gdk.math[key];
            }
        }
    }

    /**
     * 初始化工具类
     * @param m 
     */
    init(seed?: number) {
        for (let key in this._newFuns) {
            delete gdk.math[key];
        }
        gdk.math['import'](this._newFuns);
        this._seed = (seed === void 0) ? this.rnd(1, 99999999) : seed;
        return this._seed;
    }

    /**
     * 还原工具类
     */
    restore() {
        delete this._seed;
        for (let key in this._newFuns) {
            delete gdk.math[key];
        }
        gdk.math['import'](this._oldFuns);
    }

    /**
     * 产生（0-1）间的随机浮点数
     */
    random() {
        let r = MathUtil.random(this._seed);
        this._seed = MathUtil.seed;
        return r;
    }

    /**
     * 以r给定的概率，返回v1或v2值
     * @param r 
     * @param v1 
     * @param v2 
     */
    rate(r: number, v1: any = true, v2: any = false) {
        let b = MathUtil.rate(r, this._seed);
        this._seed = MathUtil.seed;
        return b ? v1 : v2;
    }

    /**
     * 产生(min-max)间的随机整数
     * @param min 
     * @param max 
     */
    rnd(min: number, max: number) {
        let r = MathUtil.rnd(min, max, this._seed);
        this._seed = MathUtil.seed;
        return r;
    }

    /**
     * 随机打乱数组排序（洗牌算法）
     * @param arr
     */
    shuffle(arr: any[]) {
        let r = MathUtil.shuffle(arr, this._seed);
        this._seed = MathUtil.seed;
        return r;
    }

    /**
     * 得到表达式的解析项
     * @param key
     * @param item  缓存表达式parser实例的对象 { _$N_parser_+key: parser }，为null时则不缓存
     */
    getConfigExprParser(key: string, item: any) {
        if (!item) {
            return gdk.math.parse(key);
        }
        let n1 = '_$N_parser_' + key;
        let parser: any = item[n1];
        if (parser === void 0) {
            let mtype = gdk.math['type'];
            parser = gdk.math.parse(key);
            // 多节点表达式
            if (mtype.isBlockNode(parser)) {
                let blocks: any[] = parser.blocks;
                for (let i = blocks.length - 1; i >= 0; i--) {
                    let n = blocks[i].node;
                    if (mtype.isAssignmentNode(n)) {
                        // 赋值表达式
                        let n1: string = n.name;
                        if (n1.indexOf('on') == 0) {
                            // 事件节点
                            blocks.splice(i, 1);
                        }
                    }
                }
                // 没有剩余的节点，则说明此表达式不需要计算
                if (blocks.length == 0) {
                    parser = null;
                }
            } else if (mtype.isAssignmentNode(parser)) {
                // 单节点表达式，如果表达式是事件类赋值节点，则无需计算
                let n1: string = parser.name;
                if (n1.indexOf('on') == 0) {
                    parser = null;
                }
            }
            item[n1] = parser;
        }
        return parser;
    }

    /**
     * 根据表达式，提取出事件属性
     * @param key 
     */
    getConfigExprEvents(key: string) {
        if (!MATH_EVENTS_CACHE[key]) {
            // 表太式有效则解析表达式
            if (key) {
                let mtype = gdk.math['type'];
                let parser: any = gdk.math.parse(key);
                // 多节点表达式
                if (mtype.isBlockNode(parser)) {
                    let blocks: any[] = parser.blocks;
                    for (let i = blocks.length - 1; i >= 0; i--) {
                        let n = blocks[i].node;
                        if (mtype.isAssignmentNode(n)) {
                            // 赋值表达式
                            let n1: string = n.name;
                            if (n1.indexOf('on') != 0) {
                                // 非事件节点
                                blocks.splice(i, 1);
                            }
                        } else {
                            // 不是赋值节点
                            blocks.splice(i, 1);
                        }
                    }
                    // 没有剩余的节点，则说明此表达式不包含事件节点
                    if (blocks.length == 0) {
                        MATH_EVENTS_CACHE[key] = MATH_EVENTS_CACHE[''];
                        return MATH_EVENTS_CACHE[key];
                    }
                } else if (mtype.isAssignmentNode(parser)) {
                    // 单节点表达式，如果表达式不是事件类赋值节点，则无需计算
                    let n1: string = parser.name;
                    if (n1.indexOf('on') != 0) {
                        MATH_EVENTS_CACHE[key] = MATH_EVENTS_CACHE[''];
                        return MATH_EVENTS_CACHE[key];
                    }
                } else {
                    // 不是事件类赋值节点，则无需计算
                    MATH_EVENTS_CACHE[key] = MATH_EVENTS_CACHE[''];
                    return MATH_EVENTS_CACHE[key];
                }
                // 计算表达式的值
                let scope = MATH_EVENTS_CACHE[key] = {};
                parser._compile(gdk.math['expression'].mathWithTransform, {})(scope, {}, null);
            }
        }
        return MATH_EVENTS_CACHE[key];
    }

    /**
     * 得到配置项的eval执行函数
     * @param key
     * @param item
     */
    getConfigExprEval(key: string, item: any) {
        // 表达式如果已经编译则直接返回
        if (MATH_EXPR_CACHE[key] !== void 0) {
            return MATH_EXPR_CACHE[key];
        }
        // 解析出来的表达式无效，则无需编译
        let parser = this.getConfigExprParser(key, item);
        if (!parser) {
            MATH_EXPR_CACHE[key] = null;
            return null;
        }
        // 表达式预编译缓存
        if (PRE_EXPR_PARSED_CACHE != null) {
            let id = gdk.md5(key);
            if (PRE_EXPR_PARSED_CACHE[id]) {
                // 缓存并返回
                MATH_EXPR_CACHE[key] = {
                    jit: true,
                    eval: PRE_EXPR_PARSED_CACHE[id],
                };
                return MATH_EXPR_CACHE[key];
            }
        }
        // 编译表达式
        let utils = gdk.math['expression'].mathWithTransform;
        if (MATH_EXPR_SUPPORT_JIT) {
            // 支持JIT优化，则生成函数
            let vars = {
                temp: {},   // 临时变量
                scope: {},  // 环境变量
                result: {}, // 结果变量
                thiz: {},  // 工具类变量或方法
                mathjs: {}, // 库函数变量或方法
            };
            let mtype = gdk.math['type'];
            parser.filter((node: any) => {
                let n1: string = node.name;
                if (mtype.isAssignmentNode(node)) { // 赋值表达式
                    // 临时
                    if (n1.indexOf('TEMP') == 0) {
                        vars.temp[n1] = true;
                        return;
                    }
                    // 结果变量
                    vars.result[n1] = true;

                } else if (mtype.isSymbolNode(node)) { // 变量
                    // 临时
                    if (n1.indexOf('TEMP') == 0) {
                        return;
                    }
                    // mathjs常量
                    if (utils[n1]) {
                        vars.mathjs[n1] = true;
                        return;
                    }
                    // 环境变量
                    vars.scope[n1] = true;

                } else if (mtype.isFunctionNode(node)) { // 函数调用
                    // mathjs方法
                    if (utils[n1]) {
                        vars.mathjs[n1] = true;
                        return;
                    }
                    // 工具类方法
                    vars.thiz[n1] = true;
                } else if (mtype.isOperatorNode(node) && node.fn == 'not') {
                    // 针对not操作特殊处理
                    vars.mathjs[node.fn] = true;
                }
            });
            let a = [];
            let o = {};
            if (Object.keys(vars.mathjs).length > 0) {
                a.push(`let mathjs = gdk.math.expression.mathWithTransform;`);
            }
            // a.push(`return function _eval(thiz, scope) {`);
            // 临时变量
            for (let e in vars.temp) {
                o[e] = true;
                a.push(`let ${e};`);
            }
            // mathjs库变量或函数
            for (let e in vars.mathjs) {
                o[e] = true;
                a.push(`let ${e} = mathjs.${e};`);
            }
            // 工具类变量或方法
            for (let e in vars.thiz) {
                o[e] = true;
                a.push(`let ${e} = thiz.${e};`);
            }
            // 环境变量
            for (let e in vars.scope) {
                if (o[e]) continue;
                o[e] = true;
                a.push(`let ${e} = scope.${e};`);
            }
            // 结果变量
            for (let e in vars.result) {
                if (o[e]) continue;
                o[e] = true;
                a.push(`let ${e} = scope.${e};`);
            }
            // 配置表达式
            if (StringUtils.endsWith(key, ';')) {
                a.push(`${key}`);
            } else {
                a.push(`${key};`);
            }
            // 结果变量
            for (let e in vars.result) {
                a.push(`(${e} !== void 0) && (scope.${e} = ${e});`);
            }
            // a.push(`}`);
            // 缓存并返回
            MATH_EXPR_CACHE[key] = {
                jit: true,
                eval: new Function('thiz', 'scope', a.join(CC_DEBUG ? '\n' : '')),
            };
        } else {
            // 使用原始mathjs编译方式
            MATH_EXPR_CACHE[key] = parser._compile(utils, {});
        }
        return MATH_EXPR_CACHE[key];
    }
}

export default gdk.Tool.getSingleton(FightingMathClass);