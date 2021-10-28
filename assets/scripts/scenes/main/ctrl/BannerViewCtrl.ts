import ActUtil from '../../../view/act/util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import { Common_bannerCfg, SystemCfg } from '../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-06-10 16:03:10 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/BannerViewCtrl")
export default class BannerViewCtrl extends cc.Component {
    @property(cc.Sprite)
    poster: cc.Sprite = null;

    @property(cc.Node)
    idxNode: cc.Node = null;

    validCfgs: Common_bannerCfg[] = [];
    curCfg: Common_bannerCfg = null;
    curIdx: number;
    onLoad() {
    }

    onEnable() {
        this.init();
        this.addEventListener();
    }

    onDisable() {
        gdk.Timer.clearAll(this);
        this.removeEventListener();
        this.idxNode.stopAllActions();
    }

    addEventListener() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this, true);
    }

    removeEventListener() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this, true);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this, true);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this, true);
    }

    initCfgs() {
        this.validCfgs = [];
        ConfigManager.getItems(Common_bannerCfg, (cfg: Common_bannerCfg) => {
            if (JumpUtils.ifSysOpen(cfg.system) && cfg.show && cfg.show == 1) {
                this.validCfgs.push(cfg);
            }
        });
        this.validCfgs.sort((a, b) => {
            return b.sorting - a.sorting;
        })
    }

    init() {
        this.initCfgs();
        if (this.validCfgs.length <= 0) {
            this.node.active = false;
            return;
        }
        this.node.active = true;
        this.curIdx = Math.floor(Math.random() * this.validCfgs.length);
        this.updateViewByIdx(this.curIdx);
        gdk.Timer.loop(2000, this, () => {
            this.updateViewByIdx(this.curIdx + 1);
        })
    }

    updateViewByIdx(idx: number) {
        if (this.validCfgs.length <= 0) return;
        if (idx > this.validCfgs.length - 1) idx = 0;
        if (idx < 0) idx = this.validCfgs.length - 1;
        let cfg = this.validCfgs[idx];
        if (!cfg) return;
        this.curCfg = cfg;
        this.curIdx = idx;
        let actCfg = ActUtil.getCfgByActId(ConfigManager.getItemById(SystemCfg, cfg.system).activity);
        if (!actCfg) {
            this.init();
            return;
        }
        let url = cfg.banner[actCfg.reward_type - 1] || cfg.banner[cfg.banner.length - 1];
        GlobalUtil.setSpriteIcon(this.node, this.poster, `view/main/texture/banner/${url}`);
        let dw = Math.floor(266 / this.validCfgs.length);
        this.idxNode.stopAllActions();
        this.idxNode.width = dw;
        this.idxNode.runAction(
            cc.moveTo(.5, new cc.Vec2(dw * idx, 0))
        );
    }

    onItemClick() {
        // if (!this.curCfg) return;
        // if (JumpUtils.ifSysOpen(this.curCfg.system, true)) {
        //     JumpUtils.openView(this.curCfg.system, false);
        // }
        // else {
        //     gdk.Timer.clearAll(this);
        //     this.idxNode.stopAllActions();
        //     this.init();
        // }
    }

    _onTouchStart(e: cc.Event.EventTouch) {
        gdk.Timer.clearAll(this);
    }

    _onTouchEnd(e: cc.Event.EventTouch) {
        let d = e.getLocationX() - e.getStartLocation().x
        if (Math.abs(d) >= 50) {
            this.updateViewByIdx(d > 0 ? this.curIdx - 1 : this.curIdx + 1);
        }
        else {
            if (!this.curCfg) return;
            if (JumpUtils.ifSysOpen(this.curCfg.system, true)) {
                JumpUtils.openView(this.curCfg.system, false);
            }
            else {
                gdk.Timer.clearAll(this);
                this.idxNode.stopAllActions();
                this.init();
            }
        }
        gdk.Timer.loop(2000, this, () => {
            this.updateViewByIdx(this.curIdx + 1);
        })
    }
}
