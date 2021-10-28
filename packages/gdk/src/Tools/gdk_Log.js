/**
 * 日志类
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-15 19:03:04
 */
var LogLevel = require("../const/gdk_LogLevel");
var Log = {
    isShowLog: true,
    logLevel: LogLevel.LOG | LogLevel.WARN | LogLevel.ERROR,
    get logEnable() {
        return this.isShowLog && this.logLevel & LogLevel.LOG;
    },
    get warnEnable() {
        return this.isShowLog && this.logLevel & LogLevel.WARN;
    },
    get errorEnable() {
        return this.isShowLog && this.logLevel & LogLevel.ERROR;
    },
    log() {
        if (this.logEnable)
            console.log.apply(console, arguments);
    },
    info() {
        if (this.logEnable)
            console.info.apply(console, arguments);
    },
    debug() {
        if (this.logEnable)
            console.debug.apply(console, arguments);
    },
    warn() {
        if (this.warnEnable)
            console.warn.apply(console, arguments);
    },
    error() {
        if (this.errorEnable)
            console.error.apply(console, arguments);
    },
};

module.exports = Log;