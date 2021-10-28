import GuideUtil from './GuideUtil';

export default class CCActionUtils {
    private static _instance: CCActionUtils;
    public static get Instance(): CCActionUtils {
        if (this._instance == null) {
            this._instance = new CCActionUtils();
        }
        return this._instance;
    }

    /**
   * 移动到目标位置
   * @param position 目标位置
   * @param duration 时间
   * @param easeObj 缓动动作类型
   */
    moveTo(position: cc.Vec2, duration: number = 1, easeType?: any): cc.ActionInterval {
        let action: cc.ActionInterval = cc.moveTo(duration, position);
        if (easeType != null) {
            action.easing(easeType);
        }
        return action;
    }

    /**
    * 执行动作
    * @param node 
    * @param action 
    */
    runAction(node: cc.Node, action: cc.FiniteTimeAction): void {
        node.runAction(action);
    }

    /* 将节点大小缩放到指定的倍数
    * @param duration 时间
    * @param sx x缩放值
    * @param sy y缩放值
    * @param easeObj 缓动动作类型
    */
    scaleTo(duration: number, sx: number, sy?: number, easeType?: any): cc.ActionInterval {
        let action: cc.ActionInterval = null;
        if (sy != null) {
            action = cc.scaleTo(duration, sx, sy);
        } else {
            action = cc.scaleTo(duration, sx);
        }
        if (easeType != null) {
            action.easing(easeType);
        }
        return action;
    }

    /**
     * 同步执行动作
     * @param finiteTimeActions 动作列表
     */
    spawn(finiteTimeActions: cc.FiniteTimeAction[]): cc.ActionInstant {
        let action: cc.FiniteTimeAction = cc.spawn(finiteTimeActions);
        return action;
    }

    /**
    * 顺序执行动作(动作列表中的动作必须带有 duration 属性) 回调调用creatCallFunc 来创建 然后放置在数组里， 注意除了在最后的回调中可以暂停或者停止动作之外，其他回调都不能这样做
    * @param finiteTimeActions 动作列表
    */
    public sequence(finiteTimeActions: cc.FiniteTimeAction[]): cc.ActionInstant {
        let action: cc.ActionInterval = cc.sequence(finiteTimeActions);
        return action;
    }
}
