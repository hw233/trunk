/**
 * 因为项目中，音频可能会有很多，给声音按钮快速选择一个音频有点困难，所以按钮声音单独出来配置
 * value为音频路径
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-02-15 15:10:13
 */

const Enum = require("./gdk_Enum")

var ButtonSoundId = Enum({
    None: -1
});

module.exports = ButtonSoundId;