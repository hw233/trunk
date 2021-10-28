
/**
 * 场景加载进度控制组件
 * @Author: sthoo.huang
 * @Date: 2019-09-12 10:27:44
 * @Last Modified by: chengyou.lin
 * @Last Modified time: 2019-11-07 15:34:12
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/boot/LoadingCtrl")
export default class LoadingCtrl extends gdk.LoadingUI {

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    onLoad() {
        this['_info'] = 'i18n:LOADING_TIP';
    }

    set info(v: string) { }
}
