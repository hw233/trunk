var gulp = require("gulp");
var through = require("through2");
var rename = require("gulp-rename");
var del = require('del');
const { Buffer } = require("buffer");

var GDKI18nUtils = {
    newTips: {},
    tipsIndex: {},
    lanMap: {}, // id-string
    reversalLanMap:  {}, //string-id
    zhCnPath:"./assets/resources/i18n/zh_CN.js",
    prefabsRoot:"./assets/resources/view/act",

    initMap: function() {
        GDKI18nUtils.newTips = {};
        GDKI18nUtils.tipsIndex = {};
        GDKI18nUtils.lanMap = {};
        GDKI18nUtils.reversalLanMap = {};

        return gulp.src(this.zhCnPath)
            .pipe(through.obj(function(file, enc, cb) {
                let noCommentContent = file.contents.toString().replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n').replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '\n');
                let str = noCommentContent.match(/languages\['zh_CN'\] = \{[\S\s]*\};/g);
                let strs = str[0].split('\n');
                let s1=[];
                for(let i = 0; i < strs.length; i++) {
                    let s = strs[i].split(':');
                    let key = s[0].replace(/\s/g,'');
                    let value = '';
                    for(let i = 1; i < s.length; i++) {
                        value += s[i];
                    }
                    if(key !== '' && value !== '') {
                        s1.push(`"${key}":${value}`);
                    }
                }
                let s = '';
                for(let i = 0; i < s1.length; i++) {
                    s += `${s1[i]}\n`;
                }
                s = '{'+s+'}';
                GDKI18nUtils.lanMap = JSON.parse(s);
                GDKI18nUtils.reversalLanMap = {};
                for (let key in GDKI18nUtils.lanMap) {
                    GDKI18nUtils.reversalLanMap[GDKI18nUtils.lanMap[key]] = key;
                }
                this.push(file);
                cb();
            }))
    },

    deepSerachPrefab: function() {
        // let src = [`./assets/resources/view/act/**/*.prefab`, `!./assets/resources/view/act/**/*.prefab.meta`];
        // `${this.prefabsRoot}/act/prefab/alchemy/**/*.prefab`
       return gulp.src([`${GDKI18nUtils.prefabsRoot}/**/*.prefab`, `!${GDKI18nUtils.prefabsRoot}/**/*.prefab.meta`])
            .pipe(rename(function (path) {
                // path.dirname += "/ciao";
                path.basename += "-tempJson";
                path.extname = ".json";
            }))
            .pipe(gulp.dest(`${this.prefabsRoot}`))
            .pipe(through.obj(function(file, enc, cb) {
                let info = require(file.path);
                for(let i = 0; i < info.length; i++) {
                    let obj = info[i];
                    if(obj["__type__"] === "cc.Label" 
                    || obj["__type__"] === "cc.RichText") {
                        if(!obj["_N$file"]) {
                            let string = obj["_string"] || obj["_N$string"];
                            if(!string.startsWith("i18n:")
                            && RegExp(/[\u4e00-\u9fa5]+/g).test(string)
                            && string !== ""
                            && string !== "Label"
                            && string !== "Rich"
                            && string !== "Text"
                            && string !== "<color=#00ff00>Rich</c><color=#0fffff>Text</color>") {
                                if(GDKI18nUtils.reversalLanMap[string]) {
                                    if(obj["_string"]) obj["_string"]= `i18n:${GDKI18nUtils.reversalLanMap[string]}`;
                                    if(obj["_N$string"]) obj["_N$string"]= `i18n:${GDKI18nUtils.reversalLanMap[string]}`;
                                }
                                else {
                                    let strs = file.path.split('\\');
                                    let preS = `${strs[strs.length - 2]}_${strs[strs.length - 3]}`
                                    if(!GDKI18nUtils.tipsIndex[preS]) {
                                        GDKI18nUtils.tipsIndex[preS] = 1;
                                    }
                                    let idx = GDKI18nUtils.tipsIndex[preS];
                                    let baseName = preS.toUpperCase() + `_TIP${idx}`;
                                    let value = string;
                                    GDKI18nUtils.tipsIndex[preS] += 1;
                                    if(!GDKI18nUtils.newTips) GDKI18nUtils.newTips = {};
                                    GDKI18nUtils.newTips[baseName] = value;
                                    GDKI18nUtils.lanMap[baseName] = value;
                                    GDKI18nUtils.reversalLanMap[value] = baseName;
                                    if(obj["_string"]) obj["_string"]= `i18n:${baseName}`;
                                    if(obj["_N$string"]) obj["_N$string"]= `i18n:${baseName}`;
                                }
                            }
                        }
                    }
                }
                file.contents = Buffer.from(JSON.stringify(info));
                this.push(file);
                cb();
            }))
            .pipe(rename(function (path) {
                path.basename = path.basename.slice(0, path.basename.length - '-tempJson'.length);
                path.extname = '.prefab';
            }))
            .pipe(gulp.dest(`${GDKI18nUtils.prefabsRoot}`));
    },

    publishNewTips: function() {
        return new gulp.src(this.zhCnPath, {base: './'})
                        .pipe(through.obj(function(file, enc, cb) {
                            let len = Object.keys(GDKI18nUtils.newTips).length;
                            if(len > 0) {
                                let str = file.contents.toString().match(/languages\['zh_CN'\] = \{[\S\s]*\};/g)[0];
                                str = str.slice(0, str.length - '\\n};'.length);
                                for(let key in GDKI18nUtils.newTips) {
                                    str += `,\n\xa0\xa0\xa0\xa0${key}:"${GDKI18nUtils.newTips[key]}"`;
                                }
                                str += '\n};'
                                file.contents = Buffer.from(file.contents.toString().replace(/languages\['zh_CN'\] = \{[\S\s]*\};/g, str));
                            }
                            this.push(file);
                            cb();
                        }))
                        .pipe(gulp.dest('./'), {overwrite: true});
    },

    clearTempJson: function() {
        return del([ `./assets/resources/view/act/**/*-tempJson.*`])
    },
}

module.exports = {
    newTips: GDKI18nUtils.newTips,
    tipsIndex: GDKI18nUtils.tipsIndex,
    lanMap: GDKI18nUtils.lanMap,
    reversalLanMap: GDKI18nUtils.reversalLanMap,
    zhCnPath: GDKI18nUtils.zhCnPath,
    prefabsRoot: GDKI18nUtils.prefabsRoot,
    initMap: GDKI18nUtils.initMap,
    deepSerachPrefab: GDKI18nUtils.deepSerachPrefab,
    publishNewTips: GDKI18nUtils.publishNewTips,
    clearTempJson: GDKI18nUtils.clearTempJson,

}