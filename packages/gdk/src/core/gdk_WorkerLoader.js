/**
 * @Description: 线程加载器
 * @Author: sthoo.huang 
 * @Date: 2020-09-17 14:25:36
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-09-17 15:14:42
 */

/**
 * 线程加载器
 * @param {*} CONSTS 全局变量声明
 * @param {*} formatFn 处理方法
 */
var WorkerLoader = function (CONSTS, formatFn) {

    // 线程onmessage处理函数
    const onMessageHandlerFn = `self.onmessage = evt => {
        formatFn(evt.data.url, evt.data.options, (err, result) => {
            let ret = {
                flag: evt.data.flag,
                data: {
                    error: err,
                    data: result,
                },
            };
            if(!err) {
                postMessage(ret, [result]);
                return;
            }
            postMessage(ret);
        });
    };`;

    // 返回结果处理函数
    const handleResult = evt => {
        // console.log('main.onmessage', evt);
        const resolve = this.flagMapping[evt.data.flag];
        if (resolve) {
            resolve(evt.data.data);
            delete this.flagMapping[evt.data.flag];
        }
    };

    const blob = new Blob([`(()=>{${CONSTS}${formatFn}${onMessageHandlerFn}})()`]);
    this.worker = new Worker(URL.createObjectURL(blob));
    this.worker.addEventListener('message', handleResult);

    this.flagMapping = {};
    this.flagId = 0;
    this.excludeFiles = {};
    this.host = document.URL.split('?')[0];
    URL.revokeObjectURL(blob);
};

// 动态调用
WorkerLoader.prototype.send = function (url, options) {
    const w = this.worker;
    const flag = ++this.flagId;
    url = this.host + url;
    w.postMessage({
        flag,
        url,
        options,
    });
    return new Promise((res) => {
        this.flagMapping[flag] = res;
    });
};

// 关闭线程
WorkerLoader.prototype.close = function () {
    this.worker.terminate();
};

module.exports = WorkerLoader;