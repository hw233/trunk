'use strcit';

///////////////// build GDK /////////////////

const fs = require('fs');
const Path = require('path');
const through = require("through2");
const gulp = require("gulp");
const uglifyjs = require('uglify-es');
const composer = require('gulp-uglify/composer');
const minify = composer(uglifyjs, console);
const gulpSeq = require('gulp-sequence');
const browserify = require("browserify");
const sourcemaps = require("gulp-sourcemaps");
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const log = Editor.log;

// 输出目标
let output = '';

// 打包的js文件uuid转换
let uuidTransform = function (file) {
    var code = '';
    return through.obj(function (buf, enc, next) {
        var originCode = buf.toString("utf8");
        var exist = fs.existsSync(file + ".meta");
        if (exist) {
            var meta = JSON.parse(fs.readFileSync(file + ".meta", 'utf8'));
            var uuid = Editor.Utils.UuidUtils.compressUuid(meta.uuid);
            var s = process.platform == "win32" ? "\\" : "/";
            var type = file.split(s).pop();

            code += `"use strict";\n`;
            code += `cc._RF.push(module, "${uuid}", "${type.substr(0, type.length - 3)}");\n`;
            // code += `"use strict";\n`;
        }
        code += originCode;
        if (exist) {
            code += `\ncc._RF.pop();\n`;
        }
        next();
    }, function (done) {
        this.push(new Buffer(code));
        done();
    });
};

let builder = {
    buildGDK (opt, callback) {
        output = opt.output;

        // 日志
        for (var key in opt) {
            log(key, ':', opt[key]);
        }

        // 保存版本号至文件中
        if (opt.version) {
            fs.writeFileSync(
                Editor.url("packages://gdk/src/gdk_Version.js"),
                `module.exports = "${opt.version}";`
            );
        }

        var outputDir = output.substr(0, output.lastIndexOf('/') + 1);
        var outputFile = output.substr(output.lastIndexOf('/') + 1);
        var destPath = Path.resolve(__dirname, '../../../', outputDir);

        // 编译打包
        gulp.task("gdk", function (cb) {
            var preludePath = Path.resolve(__dirname, '..', 'static/_prelude.js');
            var b = browserify({
                entries: [
                    Editor.url("packages://gdk/src/gdk.js"),
                    Editor.url("packages://gdk-fsm/src/gdk.fsm.js"),
                ],
                debug: !!opt.debugJs,
                detectGlobals: true,
                insertGlobal: true,
                bundleExternal: !!opt.bundleExternal, // dont bundle external modules

                // define custom prelude to optimize script evaluate time
                prelude: fs.readFileSync(preludePath, 'utf8'),
                preludePath: Path.relative(process.cwd(), preludePath),
            });
            b.external([
                'gdk',
                // 'buffer',
                // 'ham-amf',
                // 'pako',
                // 'mobile-device-detect',
            ]);

            b = b.transform(uuidTransform)
                .bundle()
                .pipe(source(outputFile))
                .pipe(buffer());

            // 开启调试
            if (!!opt.debugJs) {
                b = b.pipe(sourcemaps.init({
                        loadMaps: true
                    }))
                    .pipe(sourcemaps.write("."));
            }

            // 开启代码压缩
            if (!!opt.compressJs) {
                b = b.pipe(minify());
            } else {
                b = b.pipe(minify({
                    mangle: false,
                    compress: false,
                    output: {
                        beautify: true,
                        comments: 'some',
                    }
                }));
            }

            // 保存文件
            return b.pipe(gulp.dest(destPath))
                .on('end', () => {
                    // 刷新资源
                    Editor.assetdb.refresh('db://' + output, function (err, results) {
                        if (err) {
                            log('error: ', err);
                        } else {
                            log('Done.');
                        }
                        callback && callback();
                    });
                });
        });

        // 执行
        gulp.series('gdk')(function (err) {
            if (err) {
                // an error occured
            } else {
                // success
            }
        });
    },
}

module.exports = builder;