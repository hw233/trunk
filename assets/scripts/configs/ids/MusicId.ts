/**
 * 音乐ID定义
 * @Author: sthoo.huang 
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: luoyong
 * @Last Modified time: 2019-12-18 14:25:49
 */

enum MusicId {
    // K086 = "K086",
    MAIN_BG = 'main_panel_music',
    WIN_BG = 'music_win',
    FAIL_BG = 'music_fail',
    CARD_BG = "music_card",
    KAPAI_BG = "music_kapai",
    TAFANG_BG = "music_tafang",
};

//混合进GDK
gdk.MusicId.mixins(MusicId);

export default MusicId;