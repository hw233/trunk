import { CopyType } from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ButtonSoundId from '../../../../configs/ids/ButtonSoundId';
import PanelId from '../../../../configs/ids/PanelId';
import PveSceneCtrl from '../PveSceneCtrl';

/**
 * Pve开始战斗界面控制组件
 * @Author: sthoo.huang
 * @Date: 2019-04-04 14:37:37
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-26 10:27:45
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/PveSceneFightingCtrl")
export default class PveSceneFightingCtrl extends gdk.BasePanel {

    @property(cc.Label)
    lvName: cc.Label = null;

    @property(cc.Node)
    arenaNode: cc.Node = null;

    @property(cc.Node)
    mainNode: cc.Node = null;

    @property(cc.Node)
    ultimateNode: cc.Node = null;

    RuneShow: boolean = false;
    tween: cc.Tween;
    onEnable() {
        let args = this.args;
        this.mainNode.active = true;
        this.arenaNode.active = false;
        this.ultimateNode.active = false
        if (args && cc.js.isString(args[0])) {
            this.lvName.string = args[0];
        } else {
            let p = gdk.gui.getCurrentView();
            let c = p.getComponent(PveSceneCtrl);
            if (c) {
                let m = c.model;
                if (m.stageConfig) {
                    if (m.stageConfig.copy_id == CopyType.NONE) {
                        this.mainNode.active = false;
                        if (!(m.arenaSyncData.fightType == 'ROYAL' || m.arenaSyncData.fightType == 'ROYAL_TEST')) {
                            this.arenaNode.active = true;
                            this.arenaNode.opacity = 0;
                            this.arenaNode.runAction(cc.fadeIn(.5));
                            let sprite = this.arenaNode.getChildByName('tips').getComponent(cc.Sprite);
                            sprite.fillRange = 0;
                            this.node.runAction(cc.sequence(
                                cc.delayTime(.2),
                                cc.callFunc(() => {
                                    if (cc.isValid(this.node)) {
                                        this.tween = cc.tween(sprite)
                                            .to(.5, { fillRange: 1 })
                                            .start();
                                    }
                                })
                            ))
                        } else {
                            this.arenaNode.active = false;
                        }


                    }
                    else {
                        this.lvName.string = c.title;   // m.stageConfig.name;
                        if (m.stageConfig.copy_id == CopyType.Rune) {
                            this.RuneShow = true;
                        } else if (m.stageConfig.copy_id == CopyType.Ultimate) {
                            this.mainNode.opacity = 0
                            this.ultimateNode.active = true
                            cc.find("bg/sortNum", this.ultimateNode).getComponent(cc.Label).string = `${m.stageConfig["sort"]}`
                        }
                    }
                } else {
                    this.lvName.string = '';
                }
            }
        }
        // 播放战斗开始音乐
        GlobalUtil.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.fightStart);
        GlobalUtil.isMusicOn && gdk.music.stop();
    }

    onDisable() {
        this.arenaNode.stopAllActions();
        this.node.stopAllActions();
        this.tween && this.tween.stop();
        this.lvName.string = '';
        GlobalUtil.isMusicOn && gdk.music.on();
        if (this.RuneShow) {
            gdk.panel.open(PanelId.PveSceneRuneTipPanel);
            this.RuneShow = false;
        }
    }
}