/**
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-04-02 20:17:12
 */

var HideMode = cc.Enum({
    NONE: -1, //什么也不做
    DISABLE: -1, //取消激活
    POOL: -1, //加收进对象池
    DESTROY: -1, //销毁
    CACHE: -1, //与POOL一样，缓存起来，但这里是单一对象的缓存没有池子，
    REMOVE_FROM_PARENT: -1, //从父节点移除
});

module.exports = HideMode;