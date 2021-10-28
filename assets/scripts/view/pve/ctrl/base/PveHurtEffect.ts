import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MathUtil from '../../../../common/utils/MathUtil';
import { PveFightCtrl } from '../../core/PveFightCtrl';
import PveSceneModel from '../../model/PveSceneModel';
import PvePool from '../../utils/PvePool';
import PveTool from '../../utils/PveTool';

/**
 * PVE伤害效果（伤害飘字）控制类
 * @Author: sthoo.huang
 * @Date: 2019-04-20 11:26:53
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-31 15:26:09
 */

const { ccclass, property, menu } = cc._decorator;

export enum PveHurtType {
    NORMAL,
    SKILL,
    BUFF,
    RECOVER,
    CRIT,
}

interface PveHurtEffectMap {
    [type: number]: PveHurtEffect[];
    length: number;
}

let nodesMap: { [fightId: number]: PveHurtEffectMap } = {};

@ccclass
@menu("qszc/scene/pve/other/PveHurtEffect")
export default class PveHurtEffect extends cc.Component {

    @property(cc.LabelAtlas)
    hp0Font: cc.LabelAtlas = null;

    @property(cc.LabelAtlas)
    hpFont: cc.LabelAtlas = null;

    @property(cc.LabelAtlas)
    mpFont: cc.LabelAtlas = null;

    @property(cc.Label)
    hurtLb: cc.Label = null;

    @property(cc.Node)
    hurtNode_crit: cc.Node = null;
    @property(cc.Label)
    hurtLb_crit: cc.Label = null;
    @property(cc.Sprite)
    dmg_typeSprite: cc.Sprite = null;

    sceneModel: PveSceneModel;
    target: PveFightCtrl;
    target_id: number = -1;
    type: PveHurtType = PveHurtType.SKILL;
    dmg_type: number = 0;
    dir: number = 1;
    value: string = '';

    //------------------------->':'表示'+',';'表示'-'
    dmg_typeIcon1 = ['', 'zd_pzhy01', 'zd_pzfushe01', 'zd_pzld01', 'zd_pzdl01', 'zd_pzcc01', '', '', '', 'zd_pzpiaoxue01']  //技能
    dmg_typeIcon2 = ['', 'zd_pzhy02', 'zd_pzfushe02', 'zd_pzld02', 'zd_pzdl02', 'zd_pzcc02', '', '', '', 'zd_pzpiaoxue02']  //普攻，buff

    _action: cc.Action;
    _isHideCalled: boolean = false;
    animation: cc.Animation;
    animationState: cc.AnimationState;
    get action() {
        if (!this._action) {
            let pos: cc.Vec2 = PveTool.getCenterPos(this.target.getPos(), this.target.getRect());
            switch (this.type) {
                case PveHurtType.BUFF:
                case PveHurtType.NORMAL:
                    // 普攻
                    // pos.x -= 10;    // 初始x坐标
                    pos.y += 40;    // 初始y坐标
                    this._action = cc.speed(
                        cc.sequence( // 队列
                            cc.spawn(   // 同时
                                cc.fadeIn(0.05),       // 淡入，时间
                                cc.scaleTo(0.05, 1.3, 1.3), // 变大，时间，大小百分比
                            ),
                            cc.scaleTo(0.09, 0.95, 0.95),  // 变小，时间，大小百分比
                            cc.scaleTo(0.09, 1, 1),  // 变大，时间，大小百分比
                            cc.spawn(
                                cc.moveBy(0.5, cc.v2(0, 55)),
                                cc.fadeOut(0.5),
                            ),
                            //cc.delayTime(0.25), // 等待，时间
                            cc.callFunc(this.hide, this)
                        ),
                        this.sceneModel.timeScale
                    );
                    // this._action = cc.speed(
                    //     cc.sequence( // 队列
                    //         cc.spawn(   // 同时
                    //             cc.fadeIn(0.03),       // 淡入，时间
                    //             cc.scaleTo(0.03, 0.65, 0.65), // 变大，时间，大小百分比
                    //             cc.moveBy(0.03, this.dir * 30, 26),
                    //         ),
                    //         cc.spawn(   // 同时
                    //             cc.scaleTo(0.15, 1.0, 1.0), // 变大，时间，大小百分比
                    //             cc.moveBy(0.15, this.dir * 20, 7),
                    //         ),
                    //         cc.moveBy(0.25, this.dir * 19, -12),  // 移动，时间，x,y
                    //         cc.spawn(
                    //             cc.moveBy(0.3, this.dir * 35, -46),  // 移动，时间，x,y
                    //             cc.fadeOut(0.3), // 淡出，时间
                    //         ),
                    //         cc.callFunc(this.hide, this)
                    //     ),
                    //     this.sceneModel.timeScale
                    // );
                    break;

                case PveHurtType.SKILL:
                    // 技能
                    pos.x += 50;    // 初始x坐标
                    pos.y += 110;    // 初始y坐标
                    this._action = cc.speed(
                        cc.sequence( // 队列
                            cc.spawn(   // 同时
                                cc.fadeIn(0.05),       // 淡入，时间
                                cc.scaleTo(0.05, 1.3, 1.3), // 变大，时间，大小百分比
                            ),
                            cc.scaleTo(0.09, 0.95, 0.95),  // 变小，时间，大小百分比
                            cc.scaleTo(0.09, 1, 1),  // 变大，时间，大小百分比
                            cc.delayTime(0.35), // 等待，时间
                            cc.spawn(
                                cc.moveBy(0.5, cc.v2(0, 5)),
                                cc.fadeOut(0.5),
                            ),
                            //cc.delayTime(0.25), // 等待，时间
                            cc.callFunc(this.hide, this)
                        ),
                        this.sceneModel.timeScale
                    );
                    // this._action = cc.speed(
                    //     cc.sequence( // 队列
                    //         cc.spawn(   // 同时
                    //             cc.fadeIn(0.08),       // 淡入，时间
                    //             cc.scaleTo(0.08, 2, 2), // 变大，时间，大小百分比
                    //             cc.moveBy(0.08, this.dir * 27, 43),
                    //         ),
                    //         cc.spawn(   // 同时
                    //             cc.scaleTo(0.15, 1.4, 1.4), // 变大，时间，大小百分比
                    //             cc.moveBy(0.15, this.dir * 22, -4),
                    //         ),
                    //         cc.spawn(   // 同时
                    //             cc.scaleTo(0.3, 1.5, 1.5), // 变大，时间，大小百分比
                    //             cc.moveBy(0.3, this.dir * -1, 4),
                    //         ),
                    //         cc.spawn(
                    //             cc.moveBy(0.8, this.dir * 19, 62),  // 移动，时间，x,y
                    //             cc.fadeOut(0.8), // 淡出，时间
                    //         ),
                    //         cc.callFunc(this.hide, this)
                    //     ),
                    //     this.sceneModel.timeScale
                    // );
                    break;

                case PveHurtType.RECOVER:
                    // 回血
                    pos.x -= MathUtil.rnd(-60, 60);    // 初始x坐标
                    pos.y -= 20;    // 初始y坐标
                    this._action = cc.speed(
                        cc.sequence( // 队列
                            cc.spawn(   // 同时
                                cc.fadeIn(0.05),       // 淡入，时间
                                cc.scaleTo(0.05, 1.3, 1.3), // 变大，时间，大小百分比
                            ),
                            cc.scaleTo(0.09, 0.95, 0.95),  // 变小，时间，大小百分比
                            cc.scaleTo(0.09, 1, 1),  // 变大，时间，大小百分比
                            cc.delayTime(0.35), // 等待，时间
                            cc.spawn(
                                cc.moveBy(0.5, cc.v2(-20, 5)),  // 移动，时间，x,y
                                cc.fadeOut(0.5), // 淡出，时间
                            ),
                            cc.callFunc(this.hide, this)
                        ),
                        this.sceneModel.timeScale
                    );
                    break;
            }
            this.node.setPosition(pos);
        }
        return this._action;
    }

    onEnable() {
        this.target_id = this.target.model.fightId;
        if (this.type == PveHurtType.CRIT) {
            let rect = this.target.getRect();
            let pos = this.target.getPos();
            // 暴击伤害效果
            this.hurtLb.node.active = false;
            this.hurtNode_crit.active = true;
            this.hurtLb_crit.string = this.value;
            this.animation = this.hurtNode_crit.getComponent(cc.Animation);
            this.node.setPosition(pos.x + MathUtil.rnd(-100, 100), pos.y + rect.y + rect.height + 60);
            this.animation.on('finished', this.hide, this);
            this.animationState = this.animation.play();
            return;
        }
        this.hurtLb.node.active = true;
        this.hurtNode_crit.active = false;
        this.hurtLb.spacingX = -2;
        let font = this.hp0Font;
        let add = ';';
        // if (this.dmg_type > 9) {
        //     this.dmg_type = 0;
        // }
        let dmg_typeStr = ''
        if (this.dmg_type != 0) {
            dmg_typeStr = this.dmg_type + '_n'//this.dmg_typeIcon2[this.dmg_type];
            if (this.type == PveHurtType.SKILL) {
                font = this.hpFont;
                dmg_typeStr = this.dmg_type + '_s'//this.dmg_typeIcon1[this.dmg_type]
            }
        }
        else if (this.type == PveHurtType.RECOVER) {
            font = this.mpFont;
            add = ':'
        }
        this.dmg_typeSprite.node.active = dmg_typeStr != '';
        if (dmg_typeStr != '') {
            let path = `icon/damage/${dmg_typeStr}`
            GlobalUtil.setSpriteIcon(this.node, this.dmg_typeSprite, path)
        }

        this.hurtLb.font = font;
        //this.hurtLb.fontSize = font['fontSize'];
        this.hurtLb.string = add + this.value;

        //设置伤害类型

        // 初始Map
        let map = nodesMap[this.target_id];
        if (!map) {
            map = nodesMap[this.target_id] = { length: 0 };
        }
        map.length++;
        // 初始实例数组
        let childrens = map[this.type];
        if (!childrens) {
            childrens = map[this.type] = [];
        }
        let n = childrens.length - 2;  // 显示飘字的数量 n+1
        if (n > 0) {
            for (let i = 0; i < n; i++) {
                childrens[i].hide(false);
            }
        }
        for (let i = 0; i < childrens.length; i++) {
            let c = childrens[i];
            c.node.runAction(cc.moveBy(
                0.15 / this.sceneModel.timeScale,
                0,
                c.hurtLb.fontSize + 2 - c.hurtLb.node.y, // 上一次伤害被挤上去的坐标
            ));
        }
        childrens.push(this);
        // 初始化节点
        this.hurtLb.node.opacity = 0;
        this.hurtLb.node.scaleX = this.hurtLb.node.scaleY = 0;
        this.hurtLb.node.x = this.hurtLb.node.y = 0;
        this.hurtLb.node.runAction(this.action);
    }

    onDisable() {
        let map = nodesMap[this.target_id];
        if (map) {
            let childrens = map[this.type];
            if (childrens && childrens.length > 0) {
                let index = childrens.indexOf(this);
                if (index >= 0) {
                    childrens.splice(index, 1);
                    map.length--;
                }
                if (map.length == 0) {
                    delete nodesMap[this.target_id];
                }
            }
        }
        this.target = null;
        this.target_id = -1;
        this.sceneModel = null;
        this.value = '';
        // this.hurtLb.font = null;
        // this.hurtLb.string = '';
        // this.hurtLb_crit.string = '';
        this.hurtLb.node.active = false;
        this.hurtNode_crit.active = false;
        this.node.stopAllActions();
        this.hurtLb.node.stopAllActions();
        this._isHideCalled = false;
        this._action = null;
        this.animationState = null;
        if (this.animation) {
            this.animation.off('finished', this.hide, this);
            this.animation.stop();
            this.animation.targetOff(this);
            this.animation = null;
        }
        GlobalUtil.setSpriteIcon(this.node, this.dmg_typeSprite, null)
    }

    hide(effect: boolean = true) {
        if (this._isHideCalled) return;
        this._isHideCalled = true;
        gdk.NodeTool.hide(this.node, effect, () => {
            PvePool.put(this.node);
        });
    }

    // @gdk.binding('sceneModel.timeScale')
    // _setTimeScale(v: number) {
    //     if (!this.sceneModel) return;
    //     if (!cc.isValid(this.node)) return;
    //     if (this.animationState) {
    //         this.animationState.speed = v;
    //     }
    //     if (this._action) {
    //         this._action['setSpeed'](v);
    //     }
    // }

    // @gdk.binding('sceneModel.state')
    // _sceneState(v: PveSceneState) {
    //     switch (v) {
    //         case PveSceneState.Pause:
    //             this.node.pauseAllActions();
    //             this.hurtLb.node.pauseAllActions();
    //             if (this.animationState && this.animationState.isPlaying) {
    //                 this.animation.pause();
    //             }
    //             break;

    //         case PveSceneState.Fight:
    //             this.node.resumeAllActions();
    //             this.hurtLb.node.resumeAllActions();
    //             if (this.animationState && this.animationState.isPaused) {
    //                 this.animation.resume();
    //             }
    //             break;

    //         default:
    //             this.hide(false);
    //     }
    // }
}