/**
 * 场景ID定义
 * {
 *      name: "Login",          //场景的名字
 *      modules: [],            //资源列表(模块)， ResourceId中定义的资源集
 * };
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-20 01:38:36
 */

export default class SceneId {
    static Login = {
        name: "Login",
        resArr: [],
    };
};

//混合进GDK
gdk.SceneId.mixins(SceneId);