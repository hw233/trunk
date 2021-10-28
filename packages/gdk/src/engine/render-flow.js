/**
 * 针对渲染流的修改
 * @Author: sthoo.huang 
 * @Date: 2020-07-30 17:45:10
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-08-18 14:38:29
 */

if (CC_EDITOR) {
    // 针对编辑器不做任何处理
} else {

    let RenderFlow = cc.RenderFlow;
    let flows = RenderFlow.flows;
    let proto = RenderFlow.prototype;

    let _batcher = RenderFlow.getBachther();
    let _cullingMask = 0;

    const WORLD_TRANSFORM = RenderFlow.FLAG_WORLD_TRANSFORM;
    const OPACITY_COLOR = RenderFlow.FLAG_OPACITY_COLOR;

    function parseChildren (ret, node) {
        let a = node._children;
        let n = a.length;

        // 为节点添加跳过子节点渲染标志
        node.___skip_children___ = true;
        node.___z___ = ret.length;
        ret.push(node);

        // 如果当前节点有遮罩组件，则此节点的子节点按正常方式渲染
        if (node.getComponent(cc.Mask)) {
            delete node.___skip_children___;
            return;
        }

        // 分析处理子节点
        for (let i = 0; i < n; i++) {
            parseChildren(ret, a[i]);
        }
    };

    function parseNode (node) {
        let a = [];

        // 生成子节点列表
        let c = node._children;
        let n = c.length;
        let t = [];
        for (let i = 0; i < n; i++) {
            parseChildren(t, c[i]);
            a.push(...t);
            t.length = 0;
        }

        // 深度排序
        a.sort((n1, n2) => {
            return n1.___z___ - n2.___z___;
        });
        return a;
    };

    proto._children = function (node) {
        if (node.___skip_children___ === true) {
            return this._next._func(node);
        }

        let cullingMask = _cullingMask;
        let batcher = _batcher;

        let parentOpacity = batcher.parentOpacity;
        let opacity = (batcher.parentOpacity *= (node._opacity / 255));

        let worldTransformFlag = batcher.worldMatDirty ? WORLD_TRANSFORM : 0;
        let worldOpacityFlag = batcher.parentOpacityDirty ? OPACITY_COLOR : 0;
        let worldDirtyFlag = worldTransformFlag | worldOpacityFlag;

        // 子节点分层合批渲染，减少drawcall
        if (node.___batch_children_render___ === true) {

            let children = parseNode(node);
            for (let i = 0, l = children.length; i < l; i++) {
                let c = children[i];

                // 删除临时排序属性
                delete c.___z___;

                // Advance the modification of the flag to avoid node attribute modification is invalid when opacity === 0.
                c._renderFlag |= worldDirtyFlag;
                if (!c._activeInHierarchy || c._opacity === 0 || c._$N_visible === false) continue;

                _cullingMask = c._cullingMask = c.groupIndex === 0 ? cullingMask : 1 << c.groupIndex;

                // TODO: Maybe has better way to implement cascade opacity
                let colorVal = c._color._val;
                c._color._fastSetA(c._opacity * opacity);
                flows[c._renderFlag]._func(c);
                c._color._val = colorVal;

                // 清除跳过子节点渲染标志
                delete c.___skip_children___;
            }

        } else {
            // 原始渲染逻辑
            let children = node._children;
            for (let i = 0, l = children.length; i < l; i++) {
                let c = children[i];

                // Advance the modification of the flag to avoid node attribute modification is invalid when opacity === 0.
                c._renderFlag |= worldDirtyFlag;
                if (!c._activeInHierarchy || c._opacity === 0 || c._$N_visible === false) continue;

                _cullingMask = c._cullingMask = c.groupIndex === 0 ? cullingMask : 1 << c.groupIndex;

                // TODO: Maybe has better way to implement cascade opacity
                let colorVal = c._color._val;
                c._color._fastSetA(c._opacity * opacity);
                flows[c._renderFlag]._func(c);
                c._color._val = colorVal;
            }
        }

        batcher.parentOpacity = parentOpacity;
        this._next._func(node);
    };

    RenderFlow.visitRootNode = function (rootNode) {
        RenderFlow.validateRenderers();

        let preCullingMask = _cullingMask;
        _cullingMask = rootNode._cullingMask;

        if (rootNode._renderFlag & WORLD_TRANSFORM) {
            _batcher.worldMatDirty++;
            rootNode._calculWorldMatrix();
            rootNode._renderFlag &= ~WORLD_TRANSFORM;

            flows[rootNode._renderFlag]._func(rootNode);

            _batcher.worldMatDirty--;
        } else {
            flows[rootNode._renderFlag]._func(rootNode);
        }

        _cullingMask = preCullingMask;
    };
}