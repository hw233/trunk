import * as BHSDK from './Icefox';
import * as GPSDK from './Guopan';
import * as MLSDK from './Manling';
import BaseSdk from './BaseSdk';
import BErrorUtils from '../common/utils/BErrorUtils';
import BGlobalUtil from '../common/utils/BGlobalUtil';
import IOS from './IOS';
import { RongyaoAndroid } from './Rongyao';

/** 
 * SDK相关功能定义
 * @Author: sthoo.huang
 * @Date: 2020-01-08 09:31:17
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-10-15 17:52:12
 */

// 定义平台与平台SDK类对应关系
const SDK_INDEX: { [name: string]: new () => iclib.ISdkTool } = {
    'manling_android': MLSDK.ManLingAndroid,            // 漫灵 安卓 买量
    'manling_android2': MLSDK.ManLingAndroid2,          // 漫灵 安卓 买量2
    'manling_dist_android': MLSDK.ManLingDistAndroid,   // 漫灵 安卓 渠道
    'manling_hw_android': MLSDK.ManLingHwAndroid,       // 漫灵 安卓 海外
    'manling_h5_android': MLSDK.ManLingH5Android,       // 漫灵 安卓 小游戏互通
    'manling_h5': MLSDK.ManLingH5,                      // 漫灵 H5 小游戏互通
    'manling_ios': MLSDK.ManLingIOS,                    // 漫灵 IOS
    // 'wechat': MLSDK.ManLingWechatGame,               // 漫灵 微信小游戏

    'guopan': GPSDK.GuopanH5,                           // 果盘 H5
    'guopan_android': GPSDK.GuopanAndroid,              // 果盘 安卓
    'flyfunny_android': GPSDK.GuopanAndroid,            // 飞趣 安卓
    'flyfunny_ios': GPSDK.GuopanIOS,                    // 飞趣 IOS

    'icefox_android': BHSDK.IcefoxAndroid,              // 冰狐 安卓
    'wechat': BHSDK.BHWechatGame,                       // 冰狐 微信小游戏
    'icefox_h5': BHSDK.IcefoxH5,                        // 冰狐 H5 小游戏互通
    'icefox_h5_android': BHSDK.IcefoxH5Android,         // 冰狐 安卓 小游戏互通

    'rongyao_android': RongyaoAndroid,                  // 荣耀 安卓

    'ios': IOS,                                         // IOS 选择不同的SDK
}

// SDK通用工具类
class SdkToolClass implements iclib.ISdkToolClass {

    tool: iclib.ISdkTool;

    get loaded() {
        return this.tool && this.tool.loaded;
    }

    init(source?: string) {
        if (this.loaded) return;
        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            source = source || 'ios';
        } else if (cc.sys.platform === cc.sys.WECHAT_GAME && source == null) {
            source = 'wechat';
        } else {
            source = BGlobalUtil.getUrlValue('source');
        }
        CC_DEBUG && cc.log('source:' + source);
        let SDKClazz = SDK_INDEX[source];
        if (SDKClazz) {
            this.tool = gdk.Tool.getSingleton(SDKClazz);
        } else {
            // 没接入第三方SDK
            if (CC_BUILD && !CC_DEBUG && !cc.sys.isNative) {
                // 正式打包版本
                let opt = window['_TDSettings'];
                if (!opt || opt['sdk-key'] != gdk.md5(source)) {
                    // 需要给一个特定的source才允许访问无sdk版本
                    return;
                }
            }
            this.tool = gdk.Tool.getSingleton(BaseSdk);
        }
        // 初始化SDK
        this.tool.preinit();
        this.tool.init();
        // 初始化全局异常捕获代码
        if (CC_BUILD && !CC_DEBUG && !(cc.sys.platform === cc.sys.WECHAT_GAME) && !BGlobalUtil.getUrlValue('noerror')) {
            // let listurl: string = this.tool.config.server_list_url;
            // let url: string = /^https?:\/\/[\w-.]+([^:/]+)?/i.exec(listurl)[0] + ':9999';
            const name = cc.sys.isNative ? '__errorHandler' : 'onerror';
            window[name] = BErrorUtils.post;
        }
    }
}

const BSdkTool = gdk.Tool.getSingleton(SdkToolClass);
iclib.addProp('SdkTool', BSdkTool);
export default BSdkTool;