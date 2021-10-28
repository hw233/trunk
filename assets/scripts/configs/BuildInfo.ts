/**
 * 构建信息
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-03-01 17:47:04
 */

const { ccclass, property } = cc._decorator;

export enum Env {
    TEST = 0,
    RELEASE = 1,
    PUBLIC = 2,
};

@ccclass
export default class BuildInfo {
    static version: string = "1.0.0.1";
    static logLevel: gdk.LogLevel = CC_DEBUG ? gdk.LogLevel.LOG : gdk.LogLevel.ERROR;
    static env: Env = CC_DEBUG ? Env.TEST : Env.PUBLIC;
    static debugPanel: boolean = true;
    static buildTime: string = "2018-06-20 20:00:00";
};

gdk.setBuildInfo(BuildInfo);