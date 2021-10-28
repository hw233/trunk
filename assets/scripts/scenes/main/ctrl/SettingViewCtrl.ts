import GlobalUtil from '../../../common/utils/GlobalUtil';


export enum LocalSetType {
    music = "music",
    sound = "sound",
    savePower = "savePower"
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/SettingViewCtrl")
export default class SettingViewCtrl extends gdk.BasePanel {


    @property(cc.Node)
    musicNode: cc.Node = null;

    @property(cc.Node)
    soundNode: cc.Node = null;

    @property(cc.Toggle)
    powerToggle: cc.Toggle = null;

    @property(cc.Node)
    musicIcon: cc.Node = null;

    @property(cc.Node)
    soundIcon: cc.Node = null;


    musicPro: cc.ProgressBar
    soundPro: cc.ProgressBar
    musicSlider: cc.Slider
    soundSlider: cc.Slider

    onEnable() {
        this._updateSetting()
    }

    _updateSetting() {
        let music = GlobalUtil.getLocal(LocalSetType.music, true, 1);
        let sound = GlobalUtil.getLocal(LocalSetType.sound, true, 1);
        let power = GlobalUtil.getLocal(LocalSetType.savePower, true, false);

        this.musicPro = this.musicNode.getComponent(cc.ProgressBar);
        this.musicSlider = this.musicNode.getComponent(cc.Slider);

        this.soundPro = this.soundNode.getComponent(cc.ProgressBar);
        this.soundSlider = this.soundNode.getComponent(cc.Slider);

        this.musicSlider.progress = music;
        this.soundSlider.progress = sound;
        this.powerToggle.isChecked = power;

        this.onPowerToggle();
        this.onSliderMusic();
        this.onSlideSound();
    }

    saveFunc() {
        this.onPowerToggle();
        this.onSliderMusic();
        this.onSlideSound();
        this.close()
    }

    onSliderMusic() {
        let v = this.musicSlider.progress;
        this.musicPro.progress = v;
        gdk.music.volume = v;
        gdk.music.isOn = v > 0;
        GlobalUtil.setGrayState(this.musicIcon, v > 0 ? 0 : 1);
        GlobalUtil.setLocal(LocalSetType.music, v);
    }

    onSlideSound() {
        let v = this.soundSlider.progress;
        this.soundPro.progress = v;
        gdk.sound.volume = v;
        gdk.sound.isOn = v > 0;
        GlobalUtil.setGrayState(this.soundIcon, v > 0 ? 0 : 1);
        GlobalUtil.setLocal(LocalSetType.sound, v);
    }

    onPowerToggle() {
        let v = !!this.powerToggle.isChecked;
        this.powerToggle.isChecked = v;
        GlobalUtil.setFrameRate(v ? 30 : 60);
        GlobalUtil.setLocal(LocalSetType.savePower, v ? 1 : 0);
    }

}