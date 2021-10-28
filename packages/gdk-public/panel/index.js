'use strcit';

///////////////// Common /////////////////

const fs = require('fs');
const Path = require('path');
const baseUrl = "packages://gdk-public";
const builder = Editor.require(baseUrl + "/panel/builder");
const jsonPath = Editor.url(baseUrl + "/static/gdk-public-info.json");
const jsonValuePath = Editor.url(baseUrl + "/static/gdk-public-value.json");

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份  
        "d+": this.getDate(), //日  
        "h+": this.getHours(), //小时  
        "m+": this.getMinutes(), //分  
        "s+": this.getSeconds(), //秒  
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度  
        "S": this.getMilliseconds() //毫秒  
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

///////////////// Panel /////////////////

Editor.Panel.extend({

    template: fs.readFileSync(Editor.url(baseUrl + "/panel/template.html")),
    $: {

    },

    ready () {

        var vue = new window.Vue({
            el: this.shadowRoot,
            data: {
                buildInfo: {},
                // oldVersion: "",
                buildVersion: 0,
                version: "",
            },
            created () {
                if (fs.existsSync(jsonPath)) {
                    var json = fs.readFileSync(jsonPath, 'utf8');
                    this.buildInfo = JSON.parse(json);
                    if (fs.existsSync(jsonValuePath)) {
                        var jsonValue = fs.readFileSync(jsonValuePath, 'utf8');
                        var valueData = JSON.parse(jsonValue);
                        for (var p in valueData) {
                            if (this.buildInfo[p]) {
                                this.buildInfo[p].value = valueData[p];
                            }
                        }
                    }
                    var version = null;
                    for (var p in this.buildInfo) {
                        if (this.buildInfo[p].type == "version") {
                            version = this.buildInfo[p].value;
                            break;
                        }
                    }
                    var index = version.lastIndexOf(".");
                    this.buildVersion = version.substring(index + 1);
                    this.buildVersion = ~~this.buildVersion + 1;
                    // this.oldVersion = version.substring(0, index);
                    // this.version = this.oldVersion;
                    this.version = version.substring(0, index);
                }
                // 重置状态
                if (this.started) delete this.started;
            },
            methods: {
                onClick (e) {
                    // 状态判断
                    if (this.started) return;
                    this.started = true;

                    // 生成编译信息
                    var timestamp = Date.now();
                    var date = new Date(timestamp);
                    var buildTime = date.format("yyyy-MM-dd hh:mm:ss.S");
                    // if (this.version != this.oldVersion) {
                    //     this.buildVersion = 1;
                    // } else {
                    //     this.buildVersion++;
                    // }
                    var version = this.version + "." + (this.buildVersion.toString().padStart(3, "0"));
                    var info = {};
                    for (var p in this.buildInfo) {
                        if (this.buildInfo[p].type == "version") {
                            this.buildInfo[p].value = version;
                        } else if (this.buildInfo[p].type == "time") {
                            this.buildInfo[p].value = buildTime;
                        } else if (this.buildInfo[p].type == "timestamp") {
                            this.buildInfo[p].value = timestamp;
                        }
                        if (this.buildInfo[p].valueType == "float") {
                            this.buildInfo[p].value = this.buildInfo[p].value * 1;
                        } else if (this.buildInfo[p].valueType == "int") {
                            this.buildInfo[p].value = ~~this.buildInfo[p].value;
                        } else if (this.buildInfo[p].valueType == "boolean") {
                            this.buildInfo[p].value = !!this.buildInfo[p].value;
                        }
                        info[p] = this.buildInfo[p].value;
                    }

                    // 编译
                    builder.buildGDK(info, () => {
                        // 完成
                        let json = JSON.stringify(info, null, "  ");
                        fs.writeFileSync(jsonValuePath, json);
                        Editor.Ipc.sendToMain('gdk-public:finished', info);
                        // 重置状态
                        if (this.started) delete this.started;
                    });
                }
            },
        });
    },
});