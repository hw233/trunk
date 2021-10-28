'use strcit';

///////////////// Common /////////////////

const fs = require('fs');
const Path = require('path');
const crypto = require('crypto');
const baseUrl = "packages://gdk-builder";
const builder = Editor.require(baseUrl + "/panel/builder.js");

///////////////// Panel /////////////////

Editor.Panel.extend({
    template: fs.readFileSync(Editor.url(baseUrl + '/panel/template.html')),
    style: fs.readFileSync(Editor.url(baseUrl + '/panel/index.css')),

    $: {

    },

    ready () {

        var vue = new window.Vue({
            el: this.shadowRoot,
            data: {
                tabIndex: '',
                template: {},
                setting: {},
            },
            created () {
                [
                    this.template,
                    this.setting,
                ] = builder.getInfo();
                this.tabIndex = Object.keys(this.setting)[0];
            },
            methods: {
                // 保存设置
                saveInfo () {
                    builder.saveInfo(this.setting);
                },
                // 打开文件对话框
                openFile (info, key, title, filters) {
                    let adb = Editor.assetdb.remote;
                    let defaultPath = info[key] ? Path.join(adb.urlToFspath(info[key]), '..') : null;
                    let files = Editor.Dialog.openFile({
                        browserWindow: null,
                        title: title,
                        defaultPath: defaultPath || Path.join(Editor.Project.path, 'assets'),
                        properties: [
                            "openFile",
                        ],
                        filters: filters,
                    });
                    if (files && files.length > 0) {
                        // 更新属性
                        let url = adb.fspathToUrl(files[0]);
                        if (url) {
                            info[key] = url;
                        }
                    }
                },
                // 生成密码
                randomString (info, key, len = 16) {
                    info[key] = crypto.randomBytes(100).toString('base64').replace(/[+/]/g, '').substr(0, len);
                }
            },
        });
        return vue;
    },
});