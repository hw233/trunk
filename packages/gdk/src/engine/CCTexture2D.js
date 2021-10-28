/**
 * 针对纹理资源的优化
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-28 10:59:40
 */

if (CC_EDITOR) {
    // 针对编辑器不做任何处理
} else {

    // 对纹理资源的内存占用优化
    var Texture2D = cc.Texture2D;
    var __proto = Texture2D.prototype;

    __proto.$Texture2D0_initWithElement = __proto.initWithElement;
    __proto.initWithElement = function (element) {
        if (!element) {
            return;
        }
        if (!cc.isValid(this)) {
            this._image = element;
            this._clearImage(false);
            return;
        }
        if (element.isInAtals) {
            // 已经在动态图集中的纹理
            this.isInAtals = true;
            this.width = element.width;
            this.height = element.height;
            this._packable = true;
            this.loaded = true;
            this.emit("load");
            return;
        }
        this.$Texture2D0_initWithElement(element);
    };

    // 纹理加载处理器
    __proto.$Texture2D0_handleLoadedTexture = __proto.handleLoadedTexture;
    __proto.handleLoadedTexture = function () {
        if (!this._image || !this._image.width || !this._image.height) {
            // 如果纹理已经在动态图集中，则清除此image实例
            if (this.loaded && this.isInAtals) {
                this._clearImage(false);
                this.emit("load");
            }
            return;
        }

        if (!cc.isValid(this)) {
            this._clearImage(false);
            return;
        }

        this.$Texture2D0_handleLoadedTexture();
        this._clearImage();
    };

    // // 发射事件
    // __proto.$Texture2D0_emit = __proto.emit;
    // __proto.emit = function (key, arg1, arg2, arg3, arg4, arg5) {
    //     setTimeout(() => {
    //         if (!cc.isValid(this)) return;
    //         this.$Texture2D0_emit(key, arg1, arg2, arg3, arg4, arg5);
    //     }, 0);
    // };

    // image对象清理
    __proto.$Texture2D0_clearImage = __proto._clearImage;
    __proto._clearImage = function (check = true) {
        if (check && this._packable) {
            return;
        }
        if (this._image instanceof HTMLImageElement) {
            this._image.src = "";
        } else if (cc.sys.capabilities.imageBitmap && this._image instanceof ImageBitmap) {
            this._image.close && this._image.close();
        }
    };

    // 销毁时清理image对象
    __proto.$Texture2D0_destroy = __proto.destroy;
    __proto.destroy = function () {
        this.isInAtals = null;
        this.$Texture2D0_destroy();
    };

    // 记录meta中设置的属性
    __proto.$Texture2D0_deserialize = __proto._deserialize;
    __proto._deserialize = function (data) {
        this.$Texture2D0_deserialize(data);
        this._$deserialize_ackable = this._packable;
    };

    __proto.$Texture2D0_checkPackable = __proto._checkPackable;
    __proto._checkPackable = function () {
        this.$Texture2D0_checkPackable();
        // 防止meta中的设置被异外修改
        if (this._packable && this._packable != this._$deserialize_ackable) {
            this._packable = false;
        }
    };
}