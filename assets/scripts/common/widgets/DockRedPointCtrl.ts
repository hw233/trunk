import ConfigManager from '../managers/ConfigManager';
import RedPointUtils from '../utils/RedPointUtils';
import { Common_red_pointCfg } from '../../a/config';

/**
 * 红点组件
 * @Author: sthoo.huang
 * @Date: 2019-06-26 19:59:16
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-01-03 19:29:33
 */
const { ccclass, property, menu } = cc._decorator;
const POOL_NAME: string = 'dock_red_point_node';

@ccclass
@menu("qszc/common/widgets/DockRedPointCtrl")
export default class DockRedPointCtrl extends cc.Component {

    @property({ type: cc.Integer, tooltip: "配置id，逻辑关系为 and" })
    andIds: number[] = [];

    @property({ type: cc.Integer, tooltip: "配置id，逻辑关系为 or" })
    orIds: number[] = [];

    @property({ type: cc.SpriteFrame, tooltip: "自定义外观，可以为空" })
    skin: cc.SpriteFrame = null;

    @property({ tooltip: "红点显示位置偏移" })
    position: cc.Vec2 = cc.v2(0, 0);

    @property(cc.Prefab)
    redPointPrefab: cc.Prefab = null;

    @property({ type: cc.Component.EventHandler, tooltip: "逻辑计算函数，可以为空" })
    logicHandles: cc.Component.EventHandler[] = [];

    @property({ tooltip: "定时循环更新" })
    updateLoop: boolean = false;

    private redNode: cc.Node;

    onEnable() {
        if (this.updateLoop) {
            // 定时更新
            this.schedule(this._updateView, 1.0 / 12);
        }
        // 监听更新事件
        let ids: number[] = this.andIds.concat(this.orIds);
        let cache: any = {};
        for (let k = 0; k < ids.length; k++) {
            let c: Common_red_pointCfg = ConfigManager.getItemById(Common_red_pointCfg, ids[k]);
            if (!c) continue;   // 配置不存在
            let events: string[] = c.events.split('|');
            for (let i = 0; i < events.length; i++) {
                let en = events[i];
                if (en != '' && !cache[en]) {
                    cache[en] = true;
                    gdk.e.on(en, this._updateView, this);
                }
            }
        }
        this._updateView();
    }

    onDisable() {
        this.unschedule(this._updateView);
        gdk.e.targetOff(this);
        this.redNode && gdk.Timer.callLater(this, this._clear);
    }

    _clear() {
        if (!cc.isValid(this.redNode)) return;
        if (this.skin) {
            this.redNode.getComponent(cc.Sprite).spriteFrame = null;
            this.skin = null;
        }
        this.redNode.x = 0;
        this.redNode.y = 0;
        this.redNode.active = true;
        gdk.pool.put(POOL_NAME, this.redNode);
        this.redNode = null;
    }

    _updateView() {
        gdk.Timer.callLater(this, this._updateViewLater);
    }

    _updateViewLater() {
        if (!cc.isValid(this)) return;
        if (!this.node) return;
        let b: boolean = true;
        // 计算逻辑运算处理函数
        for (let i = 0, n = this.logicHandles.length; i < n; i++) {
            let h = this.logicHandles[i];
            if (h && h.target && h.target && h.handler) {
                var target = h.target;
                if (!cc.isValid(target)) {
                    // 无效节点
                    b = false;
                } else {
                    h['_genCompIdIfNeeded']();
                    let compType = cc.js['_getClassById'](h['_componentId']);
                    let comp = target.getComponent(compType);
                    if (!cc.isValid(comp)) {
                        // 无效组件
                        b = false;
                    } else {
                        let handler: Function = comp[h.handler];
                        if (typeof (handler) !== 'function') {
                            // 无效函数
                            b = false;
                        } else {
                            // 调用函数并获取返回值
                            b = b && handler.call(comp, h.customEventData);
                        }
                    }
                }
            }
            if (!b) break;
        }
        // 计算配置逻辑表达式
        if (b && RedPointUtils.eval_expr(this.andIds, this.orIds)) {
            if (this.redNode) return;
            // 显示红点
            this.redNode = gdk.pool.get(POOL_NAME);
            if (!this.redNode) {
                this.redNode = cc.instantiate(this.redPointPrefab);
            }
            if (this.skin) {
                this.redNode.getComponent(cc.Sprite).spriteFrame = this.skin;
            }
            this.redNode.x = this.node.width * this.node.anchorX - 20 + this.position.x;
            this.redNode.y = this.node.height * this.node.anchorY - 20 + this.position.y;
            this.node.addChild(this.redNode, 999);
            return;
        }
        // 隐藏红点
        this.redNode && this._clear();
    }

    // 当前红点值
    get value(): boolean {
        return this.redNode && this.redNode.active;
    }

    //红点是否可见
    set isShow(v: boolean) {
        if (this.redNode) {
            this.redNode.active = v
        }
    }
}