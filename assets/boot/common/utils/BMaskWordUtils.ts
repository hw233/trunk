import BGlobalUtil from './BGlobalUtil';
/** 
 * 敏感词工具类
 * @Author: sthoo.huang  
 * @Date: 2020-06-12 16:19:48 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-07 16:28:43
 */

class MaskWordUtilsClass {

    _root: Map<any, any> = new Map();
    _lastUrl: string;

    /**
     * 追加敏感词库
     * @param items 
     */
    append(items: string[]) {
        let i = 0;
        let l = items.length;
        for (; i < l; i++) {
            let word = items[i];
            let map = this._root;
            for (let i = 0; i < word.length; i++) {
                let char = word.charAt(i);
                if (char === '\r') continue;
                if (char === '\n') continue;
                if (map.get(char)) {
                    map = map.get(char);
                } else {
                    if (map.has('laster')) {
                        map.delete('laster');
                    }
                    let item = new Map();
                    // 新增节点默认为结尾节点
                    item.set('laster', true);
                    map.set(char, item);
                    map = map.get(char);
                }
            }
        }
    }

    /**
     * 从index开始检测是否包含敏感词，完整匹配才算
     * @param txt 
     * @param index
     */
    check(txt: string, index: number = 0) {
        let i = index;
        let l = txt.length;
        for (; i < l; i++) {
            let c = txt.charAt(i);
            let map = this._root.get(c);
            if (!map) continue;
            let r = c;
            for (let j = i + 1; j < l; j++) {
                let c = txt.charAt(j);
                map = map.get(c);
                if (!map) break;
                r += c;
                if (map.get('laster') === true) {
                    return { index: i, str: r, length: r.length };
                }
            }
        }
        return null;
    }

    /**
     * 敏感词过滤
     * @param txt 
     * @param val 
     */
    filter(txt: string, val: string = "*") {
        let r = txt;
        let i = 0;
        let l = txt.length;
        while (i < l) {
            let c = this.check(txt, i);
            if (!c || !c.length) break;
            i = c.index + c.length;
            r = r.substr(0, c.index) + val.repeat(c.length) + r.substr(i);
        }
        return r;
    }

    /**
     * 通过url更新敏感词库
     * @param url 
     */
    update(url?: string) {
        if (this._lastUrl == url) return;
        (url === void 0) && (url = this._lastUrl);
        if (!url) return;
        this._lastUrl = url;
        BGlobalUtil.httpGet(url, (err: any, content: string) => {
            if (!err && content) {
                // 加载成功，并且文件内容不为空
                this.append(content.split('\n'));
            } else if (err) {
                // 加载错误，1秒后重试
                err && cc.error("加载屏蔽词库错误：", err);
                // gdk.Timer.once(1000, this, this.update);
            }
        });
    }
}

const BMaskWordUtils = gdk.Tool.getSingleton(MaskWordUtilsClass);
iclib.addProp('MaskWordUtils', BMaskWordUtils);
export default BMaskWordUtils;
