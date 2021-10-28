import BGlobalUtil from './BGlobalUtil';
import BLoginModel from '../models/BLoginModel';
import BModelManager from '../managers/BModelManager';
import BSdkTool from '../../sdk/BSdkTool';
import BServerModel from '../models/BServerModel';

/** 
 * @Description: 登录工具类
 * @Author: weiliang.huang  
 * @Date: 2019-04-08 16:37:02 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-09 10:53:52
 */
class LoginUtilsClass {

    get serverModel() {
        return BModelManager.get(BServerModel);
    }

    get loginModel() {
        return BModelManager.get(BLoginModel);
    }

    /**
     * LOGO及背景激活状态
     * @param v 
     */
    setLogoActive(v: boolean) {
        let node = gdk.engine.node;
        let background = cc.find('background', node);
        let bg = cc.find('background/bg', node);
        let logo = cc.find('background/logo', node);
        let cfg = BSdkTool.tool ? BSdkTool.tool.config : null;
        if (!v || !cfg) {
            // 回收资源
            let resId = gdk.Tool.getResIdByNode(node);
            [logo, bg].forEach(n => {
                let comp = n.getComponent(cc.Sprite);
                let res = comp.spriteFrame;
                if (!!res) {
                    comp.spriteFrame = null;
                    gdk.rm.releaseRes(resId, res);
                } else {
                    let flag = '$curr_icon_path$';
                    if (comp[flag]) {
                        gdk.rm.releaseRes(resId, comp[flag]);
                        delete comp[flag];
                    }
                }
                n.active = false;
            });
            background.active = false;
            return;
        }
        let url = !!cfg.logo ? `view/login/texture/logo/${cfg.logo}` : null;
        let bgurl = !!cfg.bg ? `view/login/texture/bg/${cfg.bg}` : null;
        background.active = true;
        bg.active = true;
        bg.scale = 1.0;
        logo.active = true;
        BGlobalUtil.setSpriteIcon(node, bg, bgurl, () => {
            if (!cc.isValid(bg)) return;
            if (!bg.activeInHierarchy) return;
            if (bg.width < 720) {
                bg.scale = 720 / bg.width;
            }
        });
        BGlobalUtil.setSpriteIcon(node, logo, url);
    }

    /** 请求角色登录 */
    reqLoginRole(thiz: gdk.fsm.FsmStateAction): boolean {
        return false;
    }
    reqLoginRoleOnExit(thiz: gdk.fsm.FsmStateAction): void {

    }

    /**
     * 发送请求队列，所有请求得到回应后回调cb函数
     * @param arr 
     * @param cb 
     * @param thisArg 
     * @param setSingle 
     */
    sendReqList(arr: { new() }[], cb?: Function, thisArg?: any, setSingle?: boolean): void {

    }
}

const BLoginUtils = gdk.Tool.getSingleton(LoginUtilsClass);
iclib.addProp('LoginUtils', BLoginUtils);
export default BLoginUtils;