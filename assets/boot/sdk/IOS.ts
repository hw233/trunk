import BaseSdk from './BaseSdk';
import BGlobalUtil from '../common/utils/BGlobalUtil';
import BSdkTool from './BSdkTool';

/** 
 * IOS原生版根据需求选择不同的SDK
 * @Author: sthoo.huang  
 * @Date: 2021-10-15 17:01:16 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-10-15 17:55:14
 */
export default class IOS extends BaseSdk {

    // 获得环境参数配置
    getEnv(def: number = 999) {
        return super.getEnv(def);
    }

    init(): void {
        this.callToSystem("loaded");
    }

    callBySystem(type: any, params: any) {
        switch (type) {
            case "login":
                let ios_source = BGlobalUtil.getUrlValue('ios_source', params);
                if (ios_source == "mrswz") {
                    // 飞趣SDK，明日守望者
                    BSdkTool.init('flyfunny_ios');
                } else {
                    // 漫灵SDK
                    BSdkTool.init('manling_ios');
                }
                // 把参数传入最终的SDK实例中
                BSdkTool.tool['callBySystem'](type, params);
                return;

            case "logout":
                this.logoutSDK();
                return;
        }
        super.callBySystem(type, params);
    }

    logoutSDK(): void {
        this.callToSystem("logouted");
        super.logout();
    }
}