'use strict';

const {
    createCipher
} = require('crypto');
// const Fs = require('fs');
const Fs = require('fs-extra');
const Path = require('path');
// const cp = require('child_process');

const baseUrl = "packages://gdk-texture";
const PATH = {
    html: Editor.url(baseUrl + '/panel/panel.html'),
    style: Editor.url(baseUrl + '/panel/less.css'),
};

let log = Editor.log.bind(Editor);
let error = Editor.error.bind(Editor);

// 取得打包配置
let $jsonPath = Path.join(Editor.Project.path, "packages/gdk-texture/static/gdk-texture-info.json");
let $jsonValue = JSON.parse(Fs.readFileSync($jsonPath, 'utf8'));

function getInfo (platform, quality) {
    if (platform && quality) {
        if (!$jsonValue[platform]) {
            return null;
        }
        if (!$jsonValue[platform][quality]) {
            quality = 'Default';
        }
        return $jsonValue[platform][quality];
    }
    return $jsonValue;
};

function isObject (object) {
    return object != null && typeof object === 'object';
};

function deepEqual (object1, object2) {
    if (object1 && !object2) {
        return false;
    }
    if (!object1 && object2) {
        return false;
    }
    if (object1 == object2) {
        return true;
    }

    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let index = 0; index < keys1.length; index++) {
        const val1 = object1[keys1[index]];
        const val2 = object2[keys2[index]];
        if (isObject(val1) && isObject(val2)) {
            return deepEqual(val1, val2);
        } else if (val1 != val2) {
            return false;
        }
    }

    return true;
};

Editor.Panel.extend({
    template: Fs.readFileSync(PATH.html, 'utf-8'),
    style: Fs.readFileSync(PATH.style, 'utf-8'),

    $: {

    },

    ready () {
        var vue = new window.Vue({
            el: this.shadowRoot,
            data: {
                tabIndex: 0,
                tabs: ['Add', 'Remove', 'Change'],

                searched: {}, // [uuid] = true
                results: [], // [uuid, uuid...]
                items: [], // [url] = {checked:boolean, arr:[{uuid, url, path, checked}...]}

                folder: '',
                exclude: '',
                platform: {},
                quality: 'Default',
                types: 'texture,auto-atlas',

                busy: false,
                platformSettings: {},
            },
            created () {
                this.platformSettings = getInfo();
                this.platform = {};
                for (let key in this.platformSettings) {
                    let o = this.platformSettings[key];
                    this.platform[key] = !!o && !deepEqual(o, {});
                }
            },
            methods: {

                refreshTab (i) {
                    if (this.tabIndex == i) {
                        // 无需改变
                        return;
                    }
                    this.tabIndex = i;
                    this.refresh();
                },

                refreshFolder () {
                    let adb = Editor.assetdb.remote;
                    let defaultPath = this.folder ? Path.join(adb.urlToFspath(this.folder), '..') : null;
                    let folders = Editor.Dialog.openFile({
                        // 打开选择目标文件夹对话框
                        browserWindow: null,
                        title: "Folder",
                        defaultPath: defaultPath || Path.join(Editor.Project.path, 'assets/resources'),
                        properties: [
                            "openDirectory",
                        ],
                    });
                    if (folders && folders.length > 0) {
                        // 点击了选择目录按钮
                        let folderUrl = adb.fspathToUrl(folders[0]);
                        if (folderUrl) {
                            this.folder = folderUrl;
                        }
                    }
                    this.refresh();
                },

                refresh () {
                    // 初始化
                    this.searched = {};
                    this.items = {};
                    this.results = [];
                    this.busy = true;
                    // 检查资源文件夹
                    if (this.folder) {
                        Editor.assetdb.queryAssets(
                            this.folder + "/**\/*", ["texture", "auto-atlas"],
                            (err, objs) => {
                                // 标记所有资源
                                let items = {};
                                objs.forEach(obj => {
                                    items[obj.uuid] = true;
                                });
                                // 生成资源uuid列表
                                this.results = Object.keys(items);
                                // 刷新资源
                                this.refreshResources();
                            }
                        );
                    } else {
                        // 刷新资源
                        this.refreshResources();
                    }
                },

                // 刷新资源
                refreshResources () {
                    this.busy = true;
                    if (this.timeoutID >= 0) {
                        clearTimeout(this.timeoutID);
                    }
                    this.timeoutID = setTimeout(() => {
                        this.timeoutID = -1;
                        this.refreshResourcesLater();
                    }, 30);
                },

                refreshResourcesLater () {
                    // uuid转换为自定义结构
                    let adb = Editor.assetdb.remote;
                    let pacs = [];
                    let items = {};
                    let exds = this.exclude ? this.exclude.split(',') : null;
                    for (let i = 0, n = this.results.length; i < n; i++) {
                        let uuid = this.results[i];
                        let info = adb.assetInfoByUuid(uuid);
                        let url = info.url;
                        let path = info.path;
                        // 没有记录的路径
                        if ((!exds || !exds.some(s => url.indexOf(s) >= 0))) {
                            // 按目录分类标记
                            let key = Path.dirname(url);
                            if (!pacs.some(s => key.indexOf(s) >= 0)) {
                                if (!items[key]) {
                                    items[key] = {
                                        checked: false,
                                        arr: [],
                                    };
                                }
                                if (info.type == 'auto-atlas') {
                                    pacs.push(key);
                                    items[key].arr.length = 0;
                                    // 删除带自动图集的子目录
                                    Object.keys(items).forEach(s => {
                                        if (s == key) return;
                                        if (s.indexOf(key) >= 0) {
                                            delete items[s];
                                        }
                                    });
                                }
                                items[key].arr.push({
                                    uuid: uuid,
                                    url: url,
                                    path: path,
                                    checked: false,
                                    type: info.type,
                                });
                            }
                        }
                    }
                    // 移除
                    for (let key in items) {
                        let arr = items[key].arr;
                        for (let i = arr.length - 1; i >= 0; i--) {
                            let obj = arr[i];
                            // 类型
                            if (this.types.indexOf(obj.type) == -1) {
                                arr.splice(i, 1);
                                continue;
                            }
                            // 功能
                            let file = `${obj.path}.meta`;
                            let meta = JSON.parse(Fs.readFileSync(file));
                            let type = obj.path.split('.')[1].toUpperCase() == "JPG" ? "JPG" : "PNG";
                            let m = meta.platformSettings;
                            let t = {};
                            let b = true;
                            switch (this.tabIndex) {
                                case 0:
                                    // 添加
                                    for (let p in this.platform) {
                                        if (this.platform[p]) {
                                            let o = getInfo(p, this.quality);
                                            if (o && o[type]) {
                                                if (!m[p] || deepEqual(m[p], t)) {
                                                    // 当前没值，或者为空对象
                                                    b = false;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    break;

                                case 1:
                                    // 移除
                                    for (let p in this.platform) {
                                        if (this.platform[p]) {
                                            if (m[p] && !deepEqual(m[p], t)) {
                                                // 当前有值，并且不为空对象
                                                b = false;
                                                break;
                                            }
                                        }
                                    }
                                    break;

                                case 2:
                                    // 修改
                                    for (let p in this.platform) {
                                        if (m[p] && this.platform[p]) {
                                            let o = getInfo(p, this.quality);
                                            if (o && o[type]) {
                                                if (!deepEqual(m[p], t) && !deepEqual(m[p], o[type])) {
                                                    // 当前有值，并且不为空对象，不与目标配置相同
                                                    b = false;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    break;
                            }
                            if (b) {
                                arr.splice(i, 1);
                            }
                        }
                        if (arr.length == 0) {
                            delete items[key];
                        }
                    }
                    // 排序
                    for (let key in items) {
                        items[key].arr.sort((a, b) => {
                            let v1 = a.url;
                            let v2 = b.url;
                            if (v1 < v2) {
                                return -1;
                            } else if (v1 > v2) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                    }
                    // 刷新items
                    this.items = items;
                    this.busy = false;
                },

                /**
                 * 编辑配置
                 * @param {*} e 
                 */
                editJsonClick (e) {
                    let jsEditor = Editor.remote.App._profile.data['script-editor'];
                    if (jsEditor == 'default') {
                        return;
                    }
                    Editor.Ipc.sendToMain("gdk-fsm:open-source", jsEditor, $jsonPath);
                },

                /**
                 * 跳转到资源
                 * @param {*} uuid 
                 */
                jumpRes (uuid) {
                    Editor.Ipc.sendToAll('assets:hint', uuid);
                    Editor.Selection.select('asset', uuid, true);
                },

                /**
                 * 选择或取消选中某个目录下所有项
                 * @param {*} key 
                 */
                checkedRes (key) {
                    let item = this.items[key];
                    if (!item) return;
                    let arr = item.arr;
                    let b = arr.some(i => !i.checked); // 有没选中的项
                    for (let i = 0, n = arr.length; i < n; i++) {
                        arr[i].checked = b;
                    }
                    item.checked = b;
                },

                /**
                 * 刷新某个目录的选中状态
                 * @param {*} key 
                 */
                refreshChecked (key) {
                    let item = this.items[key];
                    if (!item) return;
                    let arr = item.arr;
                    let b = arr.some(i => !i.checked); // 有没选中的项
                    item.checked = !b;
                },

                /**
                 * 全选
                 */
                selectAll () {
                    let b = false;
                    for (let key in this.items) {
                        let arr = this.items[key].arr;
                        b = arr.some(i => !i.checked); // 有没选中的项
                        if (b) {
                            break;
                        }
                    }
                    for (let key in this.items) {
                        let arr = this.items[key].arr;
                        for (let i = 0, n = arr.length; i < n; i++) {
                            arr[i].checked = b;
                        }
                        this.items[key].checked = b;
                    }
                },

                /**
                 * 设置资源格式保存至meta文件
                 */
                doit () {
                    if (this.busy) return;
                    this.busy = true;
                    // 处理
                    const adb = Editor.assetdb;
                    for (let key in this.items) {
                        let arr = this.items[key].arr;
                        for (let i = 0, n = arr.length; i < n; i++) {
                            let item = arr[i];
                            if (item.checked) {
                                let file = `${item.path}.meta`;
                                let meta = JSON.parse(Fs.readFileSync(file));
                                let type = item.path.split('.')[1].toUpperCase() == "JPG" ? "JPG" : "PNG";
                                let m = meta.platformSettings;
                                switch (this.tabIndex) {
                                    case 2:
                                        // 修改
                                    case 0:
                                        // 添加
                                        for (let p in this.platform) {
                                            if (this.platform[p]) {
                                                let o = getInfo(p, this.quality);
                                                if (o && o[type]) {
                                                    m[p] = o[type];
                                                }
                                            }
                                        }
                                        break;

                                    case 1:
                                        // 清除
                                        for (let p in this.platform) {
                                            if (this.platform[p]) {
                                                delete m[p];
                                            }
                                        }
                                        break;
                                }
                                let jstr = JSON.stringify(meta, null, 2);
                                adb.saveMeta(item.uuid, jstr, (err, meta) => {
                                    if (err) {
                                        error(`save error: ${item.path}`);
                                    }
                                });
                            }
                        }
                    }
                    // 刷新资源
                    this.busy = false;
                    this.refresh();
                },
            }
        });
    },
});