import ConfigManager from '../managers/ConfigManager';
import JumpUtils from '../utils/JumpUtils';
import ModelManager from '../managers/ModelManager';
import RoleModel from '../models/RoleModel';
import { SystemCfg } from '../../a/config';

/**
 * 图标开启控制器
 * @Author: luoyong
 * @Date:2019-08-20 14:29:01
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-12-11 15:32:36
 */
const { ccclass, property, menu } = cc._decorator;
// const POOL_NAME: string = 'lockIcon_node';

@ccclass
@menu("qszc/common/widgets/IconOpenCtrl")
export default class IconOpenCtrl extends cc.Component {

    @property({ type: cc.Integer, tooltip: "对应system表的id" })
    systemId: number = 0;

    @property(cc.Prefab)
    lockPrefab: cc.Prefab = null;

    @property({ tooltip: "位置偏移" })
    position: cc.Vec2 = cc.v2(0, 0);

    lockNode: cc.Node

    get model(): RoleModel { return ModelManager.get(RoleModel); }

    onLoad() {

    }

    onDisable() {
        gdk.e.targetOff(this);
        this.lockNode && gdk.Timer.callLater(this, this._clear);
    }

    _clear() {
        if (!cc.isValid(this.lockNode)) return;
        this.lockNode.x = 0;
        this.lockNode.y = 0;
        // gdk.pool.put(POOL_NAME, this.lockNode);
        this.lockNode.destroy();
        this.lockNode = null;
    }

    onEnabled() {

    }

    @gdk.binding("model.level")
    updateLockState() {
        // 显示锁
        let sysCfg = ConfigManager.getItemById(SystemCfg, this.systemId)
        if (!sysCfg) {
            return
        }
        if (this.lockNode) {
            if (this.model.level >= sysCfg.openLv) {
                //清除锁状态
                this._clear()
            }
            return
        }
        if (sysCfg.openLv > this.model.level) {
            // this.lockNode = gdk.pool.get(POOL_NAME);
            if (!this.lockNode) {
                this.lockNode = cc.instantiate(this.lockPrefab);
            }
            this.lockNode.x = this.position.x;
            this.lockNode.y = this.position.y;
            this.lockNode.width = this.node.width
            this.lockNode.height = this.node.height
            this.lockNode.on(cc.Node.EventType.TOUCH_END, this.openFunc, this)
            this.node.addChild(this.lockNode, 999);
            return
        }

    }

    openFunc() {
        JumpUtils.ifSysOpen(this.systemId, true)
    }

}