/**
 * 比例缩放工具类
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-15 19:03:37
 */

const SizeType = require("../const/gdk_SizeType");
const SizeTool = {

    /**长宽不按比例完全填满 */
    full(source, border) {
        source.width = border.width;
        source.height = border.height;
        return source;
    },

    /**按比例适配宽度 */
    sizeByWidth(source, border) {
        let size = source;
        let scale = source.width / source.height;
        size.width = border.width;
        size.height = size.width / scale;
        return size;
    },

    /**按比例适配高度 */
    sizeByHeight(source, border) {
        let size = source;
        let scale = source.width / source.height;
        size.height = border.height;
        size.width = size.height * scale;
        return size;
    },

    /** 按比例全显示 有黑边*/
    showAll(source, border) {
        let scale = source.width / source.height;
        let borderScale = border.width / border.height;
        if (scale > borderScale)
            return this.sizeByWidth(source, border);
        else
            return this.sizeByHeight(source, border);
    },

    /**按比例填满,部分裁切内容。 */
    clip(source, border) {
        let scale = source.width / source.height;
        let borderScale = border.width / border.height;
        if (scale < borderScale)
            return this.sizeByWidth(source, border);
        else
            return this.sizeByHeight(source, border);
    },

    size(source, border, type) {
        if (type == SizeType.FULL) {
            return this.full(source, border);
        } else if (type == SizeType.SHOW_ALL) {
            this.showAll(source, border);
        } else if (type == SizeType.CLIP) {
            this.clip(source, border);
        } else if (type == SizeType.WIDTH) {
            return this.sizeByWidth(source, border);
        } else if (type == SizeType.HEIGHT) {
            return this.sizeByHeight(source, border);
        }
        return source;
    },
};

module.exports = SizeTool;