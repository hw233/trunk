import ButtonSoundId from '../../configs/ids/ButtonSoundId';
import ConfigManager from '../../common/managers/ConfigManager';
import GlobalUtil from '../../common/utils/GlobalUtil';
import { GuideCfg, SystemCfg } from '../../a/config';

/** 
 * 新功能开启提示
 * @Author: sthoo.huang  
 * @Date: 2019-11-05 19:52:12 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-09-08 14:22:49
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/guide/FunctionOpenTipCtrl")
export default class FunctionOpenTipCtrl extends gdk.BasePanel {
    // @property(cc.Animation)
    // openAni: cc.Animation = null;

    @property(cc.Node)
    bgNode: cc.Node = null;

    @property(cc.Node)
    iconNode: cc.Node = null;

    @property(sp.Skeleton)
    spine1: sp.Skeleton = null;

    @property(sp.Skeleton)
    spine2: sp.Skeleton = null;

    cfg: GuideCfg;
    sysCfg: SystemCfg;
    onEnable() {
        this.cfg = this.args[0];
        this.sysCfg = ConfigManager.getItemById(SystemCfg, this.cfg.function);
        // this.iconText.string = sysCfg.name;
        this.bgNode.active = true;
        this.iconNode.active = false;
        this.iconNode.getChildByName('iconText').active = true;
        let icon = this.iconNode.getChildByName('icon');
        let iconText = this.iconNode.getChildByName('iconText');
        GlobalUtil.setSpriteIcon(this.node, icon, this.sysCfg.icon);
        GlobalUtil.setSpriteIcon(this.node, iconText, this.sysCfg.title);
        this.spine1.setCompleteListener(() => {
            this.spine1.setCompleteListener(null);
            this.spine1.setAnimation(0, 'stand2', true);
        });
        this.spine2.setCompleteListener(() => {
            this.spine2.setCompleteListener(null);
            this.spine2.setAnimation(0, 'stand4', true);
            gdk.Timer.once(2000, this, this.flyIcon);
        });

        this.spine1.node.active = true;
        this.spine2.node.active = true;
        this.spine1.setAnimation(0, 'stand', true);
        this.spine2.setAnimation(0, 'stand3', true);
        gdk.Timer.once(550, this, () => {
            this.iconNode.active = true;
            this.iconNode.setScale(1);
            iconText.active = true;
            let action = cc.sequence(
                cc.scaleTo(.4, 1.1, 1.1),
                cc.scaleTo(.4, 1, 1)
            );
            this.iconNode.runAction(cc.repeat(action, 2))
        })

        if (GlobalUtil.isSoundOn) {
            gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.system);
        }

        this.node.once(cc.Node.EventType.TOUCH_START, this.onClick, this, true);
    }

    onDisable() {
        gdk.Timer.clearAll(this);
        this.node.targetOff(this);
        this.iconNode.stopAllActions();
        this.spine1.setCompleteListener(null);
        this.spine2.setCompleteListener(null);
        this.spine1.node.active = false;
        this.spine2.node.active = false;
    }

    onClick() {
        gdk.Timer.clearAll(this);
        this.iconNode.stopAllActions();
        this.iconNode.active = true;
        this.iconNode.setScale(1);
        this.spine2.node.active = true;
        this.spine1.setCompleteListener(null);
        this.spine1.setAnimation(0, 'stand2', true);
        this.spine2.setCompleteListener(null);
        this.spine2.setAnimation(0, 'stand4', true);
        this.flyIcon();
    }

    // 功能图标飞动
    flyIcon() {
        this.bgNode.active = false;
        this.spine2.node.active = false;
        // 设置图标状态
        let icon = this.iconNode.getChildByName('icon');
        let iconText = this.iconNode.getChildByName('iconText');
        iconText.active = false;
        if (this.sysCfg && this.sysCfg.pos && this.sysCfg.icon) {
            let pos: cc.Vec2 = null;
            if (this.sysCfg.pos instanceof Array) {
                // 配置中的坐标
                let dsz = cc.view.getDesignResolutionSize();
                let layer = gdk.gui.layers.guideLayer;
                pos = cc.v2(this.sysCfg.pos[0], this.sysCfg.pos[1]);
                pos.y -= (layer.height - dsz.height) / 2 - this.node.x;
                pos.x -= (layer.width - dsz.width) / 2 - this.node.y;
            } else {
                // 更新后的坐标
                pos = this.iconNode.convertToNodeSpaceAR(this.sysCfg.pos);
            }
            icon.runAction(cc.sequence(
                cc.spawn(
                    cc.moveTo(0.5, pos.x, pos.y),
                    cc.scaleTo(.5, .7, .7),
                    cc.fadeTo(.5, 125),
                ),
                cc.callFunc(this.close, this),
            ));
        } else {
            this.close();
        }
    }
}