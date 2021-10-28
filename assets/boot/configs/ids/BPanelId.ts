
/**
 * Id的定义与配置整合到在一起
 * xxx :{
 *  prefab: "resource目录下的prefab"，
 *  module: 依赖的资源Array<string>
 *  isPopup: boolean，是弹窗，还是栈式的view，默认true
 *  isDisableView: boolean，为Popup值为true时，是否隐藏View窗口，针对全屏弹窗优化，默认false
 *  isMask: boolean，如果是弹窗，是否模态，默认false"
 *  maskAlpha: number，遮照透明度
 *  maskColor: cc.Color，遮照颜色
 *  isTouchMaskClose: boolean，如果是模态，点击遮罩层是，是否关闭弹窗，默认false
 *  hideMode: 默认为 HideMode.DESTROY
 * }
 * @Author: sthoo.huang
 * @Date: 2019-02-14 18:07:10
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-07 16:39:31
 */
class PanelIdClass {

    // 原生模式热更新界面
    HotUpdate: gdk.PanelValue = {
        prefab: "view/hotupdate/prefab/HotUpdateView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false,
        isKeep: true,
        zIndex: cc.macro.MAX_ZINDEX,
    }

    ///////////////////////////////////////////view/login
    // 加载界面
    LoadingView: gdk.PanelValue = {
        prefab: "gdk/prefab/LoadingUI",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    };

    // 登录界面
    LoginView: gdk.PanelValue = {
        prefab: "view/login/prefab/LoginView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    };

    // 用户协议提示
    ServiceAlert: gdk.PanelValue = {
        prefab: "view/login/prefab/ServiceAlert",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    };
    ServiceView: gdk.PanelValue = {
        prefab: "view/login/prefab/ServiceView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
    };

    // 服务器列表
    ServerList: gdk.PanelValue = {
        prefab: "view/login/prefab/ServerList",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
    };

    // 游戏公告
    NoticeView: gdk.PanelValue = {
        prefab: "view/login/prefab/NoticeView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
    };

    // 弹窗提示
    ForceTipsPanel: gdk.PanelValue = {
        prefab: "common/prefab/ForceTipsPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

};

//混合进GDK
const BPanelId = gdk.Tool.getSingleton(PanelIdClass);
gdk.PanelId.mixins(BPanelId);
// 导出默认包
export default BPanelId;