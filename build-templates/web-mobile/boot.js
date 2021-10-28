(function () {
    var g = window;

    // XMLHttpRequest加载二进制数据的方法
    var loadedPer = [];
    var loadZip = function (url, type, index, total, progress, callback) {
        var xhr = g.XMLHttpRequest ? new g.XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP");
        var errInfo = 'Load failed: ' + url + '';
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function () {
            var content = xhr.response;
            if (content) {
                // 加载完成
                loadedPer[index] = 100 / total;
                // 设置进度条
                var percent = 0;
                for (var i = 0; i < total; i++) {
                    if (loadedPer[i] !== void 0) {
                        percent += loadedPer[i];
                    }
                }
                progress && progress(percent);
                setTimeout(function () {
                    callback && callback(index, type, content);
                }, 0);
            } else {
                // 没有内容
                console.error(errInfo + '(no response)');
                setTimeout(function () {
                    loadZip(url, type, index, total, progress, callback);
                }, 1000);
            }
        };
        xhr.onprogress = function (e) {
            loadedPer[index] = e.loaded / e.total * 100 / total;
            // 设置进度条
            var percent = 0;
            for (var i = 0; i < total; i++) {
                if (loadedPer[i] !== void 0) {
                    percent += loadedPer[i];
                }
            }
            progress && progress(percent);
        };
        xhr.onerror = function () {
            // 加载错误
            console.error(errInfo + '(error)');
            setTimeout(function () {
                loadZip(url, type, index, total, progress, callback);
            }, 1000);
        };
        xhr.ontimeout = function () {
            // 加载超时
            console.error(errInfo + '(time out)');
            setTimeout(function () {
                loadZip(url, type, index, total, progress, callback);
            }, 1000);
        };
        xhr.send(null);
    };

    // 被原生包调用的方法，实现心跳回应
    g.callBySystem = function (type) {
        if (type != 'heartbeat') return;
        var url = 'http://qszc/heartbeat';
        var androidFunc = g.AndroidFunction;
        if (androidFunc && androidFunc.receiveFromWebView) {
            androidFunc.receiveFromWebView(url);
            return;
        }
        var xhr = g.XMLHttpRequest ? new g.XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP");
        xhr.open("GET", url, true);
        xhr.send(null);
    };

    g.Boot = function () {
        this.progressBar = null;
        this.setProgress = this.setProgress.bind(this);
        this.loaded = this.loaded.bind(this);
        this.next = this.next.bind(this);
        this.createScript = this.createScript.bind(this);
    };
    var proto = g.Boot.prototype;

    // 设置进度条
    proto.setProgress = function (v) {
        if (!this.progressBar) return;
        this.progressBar.style.width = v.toFixed(2) + '%';
    };

    // 加载压缩包，配置代码
    proto.run = function (files) {
        this.datas = [];
        this.index = 0;
        this.total = files.length;
        for (var i = 0; i < this.total; i++) {
            var url = files[i];
            var type = '';
            if (url.endsWith('.js')) {
                type = '.js';
                url += '.jsz';
            } else if (url.endsWith('.jsz')) {
                type = '.js';
            }
            loadZip(url, type, i, this.total, this.setProgress, this.loaded);
        }
    };

    // 加载一个文件完成
    proto.loaded = function (index, type, content) {
        var self = this;
        if (type != '.js') {
            // 此压缩文件中没有脚本
            self.datas[index] = null;
            self.next();
            return;
        }
        JSZip.loadAsync(content)
            .then(function (zip) {
                if (zip && zip.files) {
                    var fzip;
                    for (var file in zip.files) {
                        fzip = zip.file(file);
                        if (fzip) {
                            // 解压脚本文件
                            fzip.async("string")
                                .then(function (data) {
                                    self.datas[index] = data;
                                    self.next();
                                })
                                .catch(function () {
                                    // 解析时遇到错误
                                    console.error('unzip script error');
                                });
                            return;
                        }
                    }
                }
                // 此压缩文件中没有脚本
                self.datas[index] = null;
                self.next();
            })
            .catch(function () {
                // 解压时遇到异常
                console.error('unzip error');
            });
    };

    // 下一个
    proto.next = function () {
        var data = this.datas[this.index];
        if (data === void 0) {
            return;
        }
        this.createScript(data);
    };

    // 创建脚本
    proto.createScript = function (data) {
        // 有数据为参数时创建脚本
        if (data) {
            var body = document.body;
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.text = data;
            body.appendChild(script);
            body.removeChild(script);
        }
        // 下一项
        this.index++;
        if (this.index >= this.total) {
            this.datas = null;
            this.index = 0;
            this.total = 0;
            window.boot();
            return;
        }
        this.next();
    };
})();