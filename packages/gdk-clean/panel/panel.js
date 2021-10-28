'use strict';

const Fs = require('fs');
const FFs = require('fire-fs');
const Path = require('path');
const cp = require('child_process');

const baseUrl = "packages://gdk-clean";
const PATH = {
    html: Editor.url(baseUrl + '/panel/panel.html'),
    style: Editor.url(baseUrl + '/panel/less.css'),
};

var log = Editor.log.bind(Editor);
var error = Editor.error.bind(Editor);
var callLater = function (thiz, func, delay) {
    if (thiz.$timeoutID >= 0) {
        clearTimeout(thiz.$timeoutID);
    }
    thiz.$timeoutID = setTimeout(() => {
        thiz.timeoutID = -1;
        func.call(thiz);
    }, delay);
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
                tabIndex: 1,

                prefabs: [''], // [uuid, uuid, ...]
                assets: [''], // [uuid, uuid, ...]
                assetReplace: '',
                folder: "",

                searched: {}, // [uuid] = true
                results: [], // [uuid, uuid...]
                items: [], // [url] = {checked:boolean, arr:[{uuid, url, path, checked}...]}

                exclude: 'db://internal/',
                types: 'texture,sprite-frame',

                busy: false,
            },
            created () {

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

                refreshPrefab () {
                    this.refresh();
                },

                refreshFolder () {
                    // 打开选择目标文件夹对话框
                    let adb = Editor.assetdb.remote;
                    let defaultPath = this.folder ? Path.join(adb.urlToFspath(this.folder), '..') : null;
                    let folders = Editor.Dialog.openFile({
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

                refreshAsset () {
                    for (let i = this.assets.length - 1; i >= 0; i--) {
                        let uuid = this.assets[i];
                        if (uuid && uuid == this.assetReplace) {
                            this.assetReplace = '';
                            break;
                        }
                    }
                    this.refresh();
                },
                spliceAssets (i, n) {
                    let a = this.assets.splice(i, n);
                    if (!!a) {
                        if (this.assets.length == 0) {
                            this.assets = [''];
                        }
                        for (let i = a.length - 1; i >= 0; i--) {
                            if (!!a[i]) {
                                this.refresh();
                                break;
                            }
                        }
                    }
                },
                refreshAssetReplace () {
                    for (let i = this.assets.length - 1; i >= 0; i--) {
                        let uuid = this.assets[i];
                        if (uuid && uuid == this.assetReplace) {
                            this.assets.splice(i, 1, '');
                            break;
                        }
                    }
                    this.refresh();
                },

                refresh () {
                    callLater(this, this.refreshLater, 30);
                },
                refreshLater () {
                    // 初始化
                    this.searched = {};
                    this.items = {};
                    this.results = [];
                    this.busy = true;
                    // 检查资源文件夹
                    if (this.tabIndex == 2 && this.folder) {
                        let adb = Editor.assetdb;
                        let items = {};
                        adb.queryAssets(
                            this.folder + "/**\/*",
                            ['texture'],
                            (err, objs) => {
                                // 标记所有资源
                                objs.forEach(obj => {
                                    items[obj.uuid] = true;
                                });
                                if (Object.keys(items).length == 0) {
                                    // 没有需要清理的资源
                                    this.refreshResources();
                                    return;
                                }
                                // 回调函数
                                let callback = () => {
                                    // 删除正在使用的资源
                                    for (let i = 0, n = this.results.length; i < n; i++) {
                                        let uuid = this.results[i];
                                        let info = adb.remote.assetInfoByUuid(uuid);
                                        if (info && (info.type == 'sprite-frame' || info.type == 'sprite')) {
                                            let meta = adb.remote.loadMeta(info.url);
                                            delete items[meta.rawTextureUuid];
                                        }
                                        delete items[uuid];
                                    }
                                    // 生成资源uuid列表
                                    this.results = Object.keys(items);
                                    // 刷新资源
                                    this.refreshResources();
                                };
                                // 检查缓存数据
                                let now = Date.now();
                                if (this.__result_cache__) {
                                    // 有缓存数据，并且没有过期
                                    if (this.__result_cache__.time - now > 0) {
                                        this.__result_cache__.time = now + 10 * 60 * 1000;
                                        this.results = this.__result_cache__.results;
                                        callback();
                                        return;
                                    } else {
                                        // 删除缓存结果
                                        log("缓存数据失效了，需重新生成");
                                        delete this.__result_cache__;
                                    }
                                }
                                // 查找所有prefab, scene, bitmap-font, animation-clip是否引用以上资源
                                adb.queryAssets(
                                    'db://assets/**\/*',
                                    ['scene', 'prefab', 'animation-clip', 'bitmap-font', 'label-atlas'],
                                    (err, objs) => {
                                        objs.forEach(obj => {
                                            switch (obj.type) {
                                                case 'bitmap-font':
                                                case 'label-atlas':
                                                    // 位图字体
                                                    let meta = adb.remote.loadMetaByUuid(obj.uuid);
                                                    if (meta) {
                                                        this.push(meta.rawTextureUuid);
                                                    }
                                                    break;

                                                case 'animation-clip':
                                                    // 动画剪辑
                                                    let path = adb.remote.uuidToFspath(obj.uuid);
                                                    let json = JSON.parse(Fs.readFileSync(path, 'utf-8'));
                                                    this.searchClip(json);
                                                    break;

                                                case 'scene':
                                                case 'prefab':
                                                    this.searchPrefab(obj.uuid);
                                                    break;
                                            }
                                        });
                                        // 保存缓存结果
                                        this.__result_cache__ = {
                                            results: this.results,
                                            time: now + 10 * 60 * 1000,
                                        };
                                        // 刷新资源
                                        callback();
                                    }
                                );
                            }
                        );
                    } else if (this.tabIndex == 1) {
                        // 查找预制体所有资源
                        for (let i = 0; i < this.prefabs.length; i++) {
                            let uuid = this.prefabs[i];
                            if (uuid) {
                                this.searchPrefab(uuid);
                            }
                        }
                        // 刷新资源
                        this.refreshResources();
                    } else if (this.tabIndex == 3) {
                        // 查找引用了需要替换的预制体和场景
                        let adb = Editor.assetdb;
                        let items = {};
                        for (let i = 0; i < this.assets.length; i++) {
                            let uuid = this.assets[i];
                            if (uuid) {
                                items[uuid] = true;
                            }
                        }
                        if (Object.keys(items).length == 0) {
                            // 没有需要替换的资源
                            this.refreshResources();
                            return;
                        }
                        // 查找所有prefab, scene是否引用以上资源
                        adb.queryAssets(
                            'db://assets/**\/*',
                            ['scene', 'prefab'],
                            (err, objs) => {
                                let idx = {};
                                let acache = this.__assets_cache__;
                                if (!acache) {
                                    acache = this.__assets_cache__ = {};
                                }
                                objs.forEach(obj => {
                                    if (idx[obj.uuid] === true) {
                                        return;
                                    }
                                    // 检查缓存数据
                                    let arr = null;
                                    let now = Date.now();
                                    if (acache[obj.uuid]) {
                                        // 有缓存数据，并且没有过期
                                        if (acache[obj.uuid].time - now > 0) {
                                            acache[obj.uuid].time = now + 10 * 60 * 1000;
                                            arr = acache[obj.uuid].results;
                                        } else {
                                            delete acache[obj.uuid];
                                        }
                                    }
                                    if (!arr) {
                                        this.results = arr = [];
                                        this.searched = {};
                                        this.searchPrefab(obj.uuid);
                                        // 缓存数据
                                        acache[obj.uuid] = {
                                            results: arr,
                                            time: now + 10 * 60 * 1000,
                                        };
                                    }
                                    if (arr.length == 0) return;
                                    if (arr.some(e => items[e])) {
                                        idx[obj.uuid] = true;
                                    }
                                });
                                // 生成资源uuid列表
                                this.results = Object.keys(idx);
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
                    callLater(this, this.refreshResourcesLater, 30);
                },
                refreshResourcesLater () {
                    // uuid转换为自定义结构
                    let adb = Editor.assetdb.remote;
                    let dic = {};
                    let items = {};
                    let exds, types;
                    if (this.tabIndex == 3) {
                        exds = [];
                        types = {
                            'scene': true,
                            'prefab': true
                        };
                    } else {
                        exds = this.exclude.split(',');
                        types = {
                            'texture': true,
                            'sprite-frame': true
                        };
                    }
                    let arr = this.results;
                    for (let i = 0, n = arr.length; i < n; i++) {
                        let uuid = arr[i];
                        let info = adb.assetInfoByUuid(uuid);
                        if (types[info.type] === true) {
                            let url = info.url;
                            let uuid2 = uuid;
                            let path = info.path;
                            if (info.type == 'sprite-frame' || info.type == 'sprite') {
                                let meta = adb.loadMeta(info.url);
                                uuid2 = meta.rawTextureUuid;
                                path = adb.uuidToFspath(uuid2);
                                url = adb.uuidToUrl(uuid2);
                            }
                            // 没有记录的路径
                            if (!dic[url] &&
                                (!exds || !exds.some(s => url.indexOf(s) >= 0))
                            ) {
                                dic[url] = true;
                                // 按目录分类标记
                                let key = Path.dirname(url);
                                if (!items[key]) {
                                    items[key] = {
                                        checked: false,
                                        arr: [],
                                    };
                                }
                                items[key].arr.push({
                                    uuid: uuid2,
                                    url: url,
                                    path: path,
                                    checked: false,
                                });
                            }
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
                 * @param {String} uuid 
                 */
                push (uuid) {
                    if (!uuid) return;
                    let arr = this.results;
                    if (arr.indexOf(uuid) == -1) {
                        arr.push(uuid);
                    }
                },

                /** 
                 * Recursive
                 * @argument {JSON | Array}     json
                 */
                search (json) {
                    let utils = Editor.Utils.UuidUtils;
                    if (json instanceof Array) {
                        for (let i = 0; i < json.length; i++) {
                            this.search(json[i]);
                        }
                    } else if (json instanceof Object) {
                        let type = json['__type__'];
                        switch (type) {
                            case 'cc.Sprite':
                                if (json._spriteFrame && json._spriteFrame.__uuid__) {
                                    this.push(json._spriteFrame.__uuid__);
                                }
                                break;

                            case 'cc.Button':
                                this.searchButton(json);
                                break;

                            case 'cc.Animation':
                                this.searchClip(json);
                                break;

                            case 'cc.PrefabInfo':
                                if (json.asset && json.asset.__uuid__) {
                                    this.searchPrefab(json.asset.__uuid__);
                                }
                                break;

                            case 'cc.Label':
                                if (json._N$file && json._N$file.__uuid__) {
                                    let meta = Editor.assetdb.remote.loadMetaByUuid(json._N$file.__uuid__);
                                    if (meta) {
                                        this.push(meta.rawTextureUuid);
                                    }
                                }
                                break;

                            default:
                                if (type && type.length > 20) {
                                    if (utils.isUuid(utils.decompressUuid(type))) {
                                        this.searchScript(json);
                                    }
                                }
                                break;
                        }
                    }
                },

                /** 
                 * Recursive
                 * Search for the prefab
                 * @argument {string}     uuid
                 */
                searchPrefab (uuid) {
                    if (this.searched[uuid]) return;
                    this.searched[uuid] = true;
                    // 查找所有资源
                    let adb = Editor.assetdb;
                    let path = adb.remote.uuidToFspath(uuid);
                    let json = JSON.parse(Fs.readFileSync(path, 'utf-8'));
                    for (let key in json) {
                        this.search(json[key]);
                    }
                },

                /** 
                 * Recursive
                 * Search for the script (cc.Class)
                 * @argument {JSON}     json
                 */
                searchScript (json) {
                    let adb = Editor.assetdb.remote;
                    for (let i in json) {
                        if (json[i] && json[i].__uuid__) {
                            let uuid = json[i].__uuid__;
                            let info = adb.assetInfoByUuid(uuid);
                            if (info) {
                                switch (info.type) {
                                    case 'prefab':
                                        this.searchPrefab(uuid);
                                        break;

                                    default:
                                        this.push(uuid);
                                        break;
                                }
                            }
                        }
                    }
                },

                /** 
                 * Recursive
                 * Search for the Button (cc.Button).
                 * @argument {JSON}     json    cc.Button
                 */
                searchButton (json) {
                    json.pressedSprite && this.push(json.pressedSprite.__uuid__);
                    json.hoverSprite && this.push(json.hoverSprite.__uuid__);
                    json._N$normalSprite && this.push(json._N$normalSprite.__uuid__);
                    json._N$disabledSprite && this.push(json._N$disabledSprite.__uuid__);
                },

                /** 
                 * Recursive
                 * Search for the animation clip (cc.Animation).
                 * @argument {JSON}     json    cc.Animation
                 */
                searchClip (json) {
                    let spriteFrame = [];
                    let paths = this.getValue(json, 'paths');
                    if (paths) {
                        for (let i in paths) {
                            spriteFrame = this.getValue(paths[i], 'spriteFrame');
                            if (spriteFrame) {
                                for (let i = 0; i < spriteFrame.length; i++) {
                                    if (spriteFrame[i] && spriteFrame[i].value) {
                                        return this.push(spriteFrame[i].value.__uuid__);
                                    }
                                }
                            }
                        }
                    } else {
                        spriteFrame = this.getValue(json, 'spriteFrame');
                        if (spriteFrame) {
                            for (let i = 0; i < spriteFrame.length; i++) {
                                if (spriteFrame[i].value) {
                                    this.push(spriteFrame[i].value.__uuid__);
                                }
                            }
                        }
                    }
                },

                /**
                 * ..
                 * @param {JSON} json 
                 * @param {String} key  
                 * @param {Boolean} pan 泛查询开关，因为这样叫比较酷
                 */
                getValue (json, key, pan) {
                    key = key ? key : 'spriteFrame';
                    if (typeof json !== 'object') {
                        return null;
                    }

                    for (let i in json) {
                        if (i === key) {
                            return json[i];
                        } else {
                            let value = this.getValue(json[i], key);
                            if (value) {
                                return value;
                            }
                        }

                    }
                    return null;
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
                 * Move或Remove按钮动作
                 */
                doit () {
                    let items = [];
                    for (let key in this.items) {
                        let arr = this.items[key].arr;
                        for (let i = 0, n = arr.length; i < n; i++) {
                            let item = arr[i];
                            if (item.checked) {
                                items.push(item);
                            }
                        }
                    }
                    if (items.length == 0) {
                        // 有没选中的项
                        return;
                    }
                    if (!this.busy) {
                        this.busy = true;
                        switch (this.tabIndex) {
                            case 2:
                                // 移除资源
                                this._removeRes(items);
                                break;

                            case 1:
                                // 移动资源
                                this._moveRes(items);
                                break;

                            case 3:
                                // 替换资源
                                this._replaceRes(items);
                                break;
                        }
                    }
                },

                /**
                 * 移动资源
                 */
                _moveRes (items, cb) {
                    if (!items || items.length == 0) {
                        this.busy = false;
                        cb && cb();
                        return;
                    }
                    let adb = Editor.assetdb;
                    let defaultPath = Path.join(Editor.Project.path, 'assets/resources');
                    for (let i = 0; i < this.prefabs.length; i++) {
                        let uuid = this.prefabs[i];
                        if (uuid) {
                            defaultPath = adb.remote.uuidToFspath(uuid);
                            defaultPath = Path.dirname(defaultPath);
                            defaultPath = Path.join(defaultPath, '..');
                            break;
                        }
                    }
                    // 打开选择目标文件夹对话框
                    let destPath = Editor.Dialog.openFile({
                        browserWindow: null,
                        title: "Folder",
                        defaultPath: defaultPath,
                        properties: [
                            "openDirectory",
                            "createDirectory",
                        ],
                    });
                    if (destPath && destPath.length > 0) {
                        // 点击了选择目录按钮
                        let dest = destPath[0];
                        let destUrl = adb.remote.fspathToUrl(dest);
                        if (destUrl) {
                            items.forEach(item => {
                                if (dest != Path.dirname(item.path)) {
                                    adb.move(item.url, destUrl + '/' + Path.basename(item.path));
                                }
                            });
                            // 刷新资源
                            adb.refresh(destUrl, () => {
                                cb && cb();
                                this.busy = false;
                                this.refresh();
                            });
                        }
                    } else {
                        // 清除忙碌状态
                        this.busy = false;
                        cb && cb();
                    }
                },

                /**
                 * 移除选中资源
                 */
                _removeRes (items, cb) {
                    if (!items || items.length == 0) {
                        this.busy = false;
                        cb && cb();
                        return;
                    }
                    let urls = [];
                    items.forEach(item => {
                        if (typeof item === 'string') {
                            urls.push(item);
                        } else {
                            urls.push(item.url);
                        }
                    });
                    Editor.assetdb.delete(urls, () => {
                        cb && cb();
                        this.busy = false;
                        this.refresh();
                    });
                },

                /**
                 * 替换资源
                 */
                _replaceRes (items, cb) {
                    if (!this.assetReplace || !items || items.length == 0) {
                        this.busy = false;
                        cb && cb();
                        return;
                    }
                    let results = [];
                    let acache = this.__assets_cache__;
                    items.forEach(item => {
                        let jstr = Fs.readFileSync(item.path, 'utf-8');
                        for (let j = this.assets.length - 1; j >= 0; j--) {
                            let uuid = this.assets[j];
                            if (uuid) {
                                jstr = jstr.split(uuid).join(this.assetReplace);
                            }
                        }
                        results.push([item.url, jstr]);
                        // 清除缓存
                        if (acache && acache[item.uuid]) {
                            delete acache[item.uuid];
                        }
                    });
                    // 保存并刷新资源
                    const adb = Editor.assetdb;
                    const callback = () => {
                        if (results.length > 0) {
                            let args = results.pop();
                            adb.saveExists(args[0], args[1], (err, meta) => {
                                if (err) {
                                    error(`save error: ${args[0]}`);
                                }
                                callback();
                            });
                        } else {
                            cb && cb();
                            this.busy = false;
                            this.refresh();
                        }
                    };
                    callback();
                },

                deleteRes () {
                    if (this.busy) {
                        return;
                    }
                    this.busy = true;
                    let adb = Editor.assetdb;
                    let urls = [];
                    for (let j = this.assets.length - 1; j >= 0; j--) {
                        let uuid = this.assets[j];
                        let url = uuid ? adb.remote.uuidToUrl(uuid) : null;
                        if (url) {
                            url = url.substr(0, url.lastIndexOf('/'));
                            urls.push(url);
                        }
                    }
                    // 删除资源
                    this._removeRes(urls, () => this.assets = ['']);
                },
                moveRes () {
                    if (this.busy) {
                        return;
                    }
                    this.busy = true;
                    let adb = Editor.assetdb.remote;
                    let urls = [];
                    for (let j = this.assets.length - 1; j >= 0; j--) {
                        let uuid = this.assets[j];
                        let info = uuid ? adb.assetInfoByUuid(uuid) : null;
                        if (info) {
                            let url = info.url;
                            let uuid2 = uuid;
                            let path = info.path;
                            if (info.type == 'sprite-frame' || info.type == 'sprite') {
                                let meta = adb.loadMeta(info.url);
                                uuid2 = meta.rawTextureUuid;
                                path = adb.uuidToFspath(uuid2);
                                url = adb.uuidToUrl(uuid2);
                            }
                            urls.push({
                                uuid: uuid2,
                                url: url,
                                path: path,
                                checked: true,
                            });
                        }
                    }
                    // 移动资源
                    this._moveRes(urls);
                },
            }
        });
    },
});