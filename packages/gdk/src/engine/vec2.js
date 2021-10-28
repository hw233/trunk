/**
 * 优化引擎的Label组件
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-04-03 09:59:38
 */

if (CC_EDITOR) {
    // 针对编辑器不做任何处理
} else {
    let _TEMP = new cc.Vec2(0.0, 0.0);
    /**
     * !#en return a Vec2 object with x = 1 and y = 0.
     * !#zh 返回 x = 0 和 y = 0 的 临时 Vec2 对象。
     * @property TEMP
     * @type Vec2
     * @static
     */
    cc.js.get(cc.Vec2, 'TEMP', function () {
        return _TEMP;
    });
}