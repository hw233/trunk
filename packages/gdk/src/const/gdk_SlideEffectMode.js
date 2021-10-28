/**
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-15 14:28:27
 */

var SlideEffectMode = cc.Enum({
   CENTER: -1, //中间上下滑
   TOP: -1, // 顶部上下滑
   BOTTOM: -1, //底下上下滑
   LEFT: -1, //左侧水平滑
   RIGHT: -1, //右侧水平滑
   VERTICAL: -1, //当前位置上下滑
   HORIZONTAL: -1 //当前位置左右滑
});

module.exports = SlideEffectMode;