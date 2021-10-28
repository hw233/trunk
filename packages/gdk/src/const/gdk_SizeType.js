const SizeType = cc.Enum({
    NONE: -1,
    FULL: -1, //长宽不按比例完全填满
    WIDTH: -1, //按比例适配宽度
    HEIGHT: -1, //按比例适配高度
    SHOW_ALL: -1, //按比例全显示,有黑边
    CLIP: -1, //按比例填满,部分裁切内容。
});

module.exports = SizeType;