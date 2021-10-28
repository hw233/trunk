import BGlobalUtil from './BGlobalUtil';
import BSdkTool from '../../sdk/BSdkTool';

/**
 * 异常处理工具类
 * @Author: sthoo.huang
 * @Date: 2020-05-30 11:19:51
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-20 17:25:12
 */

const ignores = [
    "Load",
    "Uncaught TypeError: Cannot read property '_assembler' of null",
    "TypeError: null is not an object (evaluating 'e._assembler')",
    "SyntaxError: JSON Parse error:",
    "request error - res",
    "Uncaught request error - res",
    "Uncaught Load",
    "SecurityError: Blocked a frame with origin",
];

class ErrorUtilsClass {

    /**
     * 异常上报
     * @param message 
     * @param url 
     * @param lineNo 
     * @param columnNo 
     * @param error 
     */
    post(message: string, uri: string = '', lineNo: number = 0, columnNo: number = 0, error?: any) {
        // 开发版和测试版忽略上报
        if (CC_DEV || CC_DEBUG || cc.sys.platform === cc.sys.WECHAT_GAME) {
            cc.error(message);
            return false;
        }
        // 无效错误
        if (!uri || !lineNo || !columnNo) {
            return false;
        }
        // 是否在忽略错误列表中
        if (message === 'Uncaught exception' || ignores.some(e => message.indexOf(e) == 0)) {
            return false;
        }
        // 错误是否已经提交
        let name = 'error_report_index';
        let key = gdk.md5(message).substr(0, 5);
        let idx = BGlobalUtil.getLocal(name, false) || {};
        let setting = window['_TDSettings'] || { version: "1.0.0.0" };
        if (idx[key] === setting.version) {
            // 此版本已经提交过此BUG
            return true;
        }
        idx[key] = setting.version;
        BGlobalUtil.setLocal(name, idx, false);
        // 构建错误对象
        let errorObj = {
            "msgtype": "markdown",
            "markdown": {
                "title": "异常警报",
                "text":
                    "前端异常错误信息:\n```\n" +
                    "帐号: " + BSdkTool.tool.account + "\n" +
                    "系统: " + cc.sys.os + "\n" +
                    "平台: " + JSON.stringify(BSdkTool.tool.config) + "\n" +
                    "版本: " + window['_TDSettings'].version + "\n" +
                    "错误: " + message + "\n" +
                    "文件: " + uri + "\n" +
                    "行号: " + lineNo + "\n" +
                    "列号: " + columnNo + "\n" +
                    "堆栈: " + (error && error.stack ? error.stack : '') + "\n" +
                    "\n```",
            },
        };
        // 上传服务器
        let url = 'http://120.132.39.11:9999/';
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.open("post", url + '?timestamp=' + Date.now());
        xhr.send(JSON.stringify(errorObj));
        // 返回true代表已处理
        return true;
    }
}

const BErrorUtils = gdk.Tool.getSingleton(ErrorUtilsClass);
iclib.addProp('ErrorUtils', BErrorUtils);
export default BErrorUtils;