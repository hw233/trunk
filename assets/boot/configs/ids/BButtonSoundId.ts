/**
 * 按钮音效定义
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-17 18:13:42
 */
enum ButtonSoundId {
    click = 'sound_click',
    invalid = "sound_invalid",//操作无效
};

gdk.ButtonSoundId.mixins(ButtonSoundId);

export default ButtonSoundId;