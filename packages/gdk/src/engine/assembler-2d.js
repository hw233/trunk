/** 
 * 修复或优化cc.Assembler2D类
 * @Author: sthoo.huang  
 * @Date: 2020-06-12 14:37:19 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-07-28 18:22:44
 */

if (CC_EDITOR) {
    // 针对编辑器不做任何处理
} else {

    const dynamicAtlasManager = cc.dynamicAtlasManager;

    var Assembler2D = cc.Assembler2D;
    var proto = Assembler2D.prototype;

    proto.packToDynamicAtlas = function (comp, frame) {
        if (CC_TEST) return;

        let material = comp._materials[0];
        if (!material) return;
        if (!frame) return;
        if (!frame._texture) return;

        if (!frame._original && frame._texture.packable && dynamicAtlasManager) {
            let packedFrame = dynamicAtlasManager.insertSpriteFrame(frame);
            if (packedFrame) {
                frame._setDynamicAtlasFrame(packedFrame);
            }
        }

        if (material.getProperty('texture') !== frame._texture._texture) {
            // texture was packed to dynamic atlas, should update uvs
            comp._vertsDirty = true;
            comp._updateMaterial();
        }
    };
}