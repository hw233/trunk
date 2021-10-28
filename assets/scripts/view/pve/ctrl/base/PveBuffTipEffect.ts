import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PveEnemyModel from '../../model/PveEnemyModel';
import PvePool from '../../utils/PvePool';
import PveSceneModel from '../../model/PveSceneModel';
import PveSceneState from '../../enum/PveSceneState';
import { PveFightCtrl } from '../../core/PveFightCtrl';
import { PveFightType } from '../../core/PveFightModel';
import { Skill_buffCfg } from '../../../../a/config';

/**
 * PVE BUff Tip显示效果（飘字）控制类
 * @Author: yaozu.hu
 * @Date: 2019-11-25 17:54:27
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-11-26 20:51:39
 */
const { ccclass, property, menu } = cc._decorator;

export enum PveBuffTipType {
    BUFF,
    DEBUFF,
}

@ccclass
@menu("qszc/scene/pve/other/PveBuffTipEffect")
export default class PveBuffTipEffect extends cc.Component {

    @property(cc.Node)
    buffNameNode: cc.Node = null;
    @property(cc.Sprite)
    buffAttackIcon: cc.Sprite = null;
    @property(cc.Node)
    buffNameIconNode: cc.Node = null;
    @property(cc.Sprite)
    buffNameBg: cc.Sprite = null;

    @property(cc.Label)
    buffTipName: cc.Label = null;

    @property(cc.LabelOutline)
    outline: cc.LabelOutline = null;

    @property(cc.Sprite)
    buffTip: cc.Sprite = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    type: PveBuffTipType = PveBuffTipType.BUFF;
    sceneModel: PveSceneModel;
    target: PveFightCtrl;
    //dir: number = 1;
    value: string = '';
    _isHideCalled: boolean = false;

    action: cc.Action = null;

    isEnemy: boolean = false;

    buffCfg: Skill_buffCfg;

    onEnable() {

        let rect = this.target.getRect();
        let pos = this.target.getPos();

        // 设置动画效果
        this.buffTip.node.active = true;
        let path = 'icon/bufftext/' + this.value

        let resId = gdk.Tool.getResIdByNode(this.node);

        //let animaNode = this.buffTip.node;

        let _uuid = gdk.rm.getInfoWithPath(path, cc.SpriteFrame);
        let speed = Math.max(1, this.sceneModel.timeScale)
        if (_uuid) {
            gdk.rm.loadRes(resId, path, cc.SpriteFrame, (sp: cc.SpriteFrame) => {
                if (cc.isValid(this.node)) {
                    this.buffTip.spriteFrame = sp
                    this.buffTip.node.active = true;
                    this.buffNameNode.active = false;
                }
            })
            this.action = cc.speed(
                cc.sequence(
                    cc.spawn(
                        cc.fadeIn(0.3),
                        cc.scaleTo(0.3, 1),
                    ),
                    cc.delayTime(0.5),
                    cc.spawn(
                        cc.fadeOut(0.2),
                        cc.scaleTo(0.2, 0.5),
                    ),
                    cc.callFunc(() => {
                        this.hide();
                    }),
                ),
                speed
            )
        } else {
            let spineName = "stand"

            // switch (this.type) {
            //     case PveBuffTipType.BUFF:
            //         this.buffTipName.node.color = cc.color("ffeaa6");
            //         this.outline.color = cc.color("#c63800")
            //         break;
            //     case PveBuffTipType.DEBUFF:
            //         this.buffTipName.node.color = cc.color("#21ddff");
            //         this.outline.color = cc.color("#0a1355")
            //         break;
            // }
            //设置名称颜色描边颜色
            let bgPath = 'view/pve/texture/ui/common/'   // zd_pzbg01  怪物 zd_pzbg02
            if (this.isEnemy) {
                this.buffTipName.node.color = cc.color("e2abff");
                this.outline.color = cc.color("#240931")
                gdk.rm.loadRes(resId, bgPath + 'zd_pzbg02', cc.SpriteFrame, (sp: cc.SpriteFrame) => {
                    if (cc.isValid(this.node)) {
                        this.buffNameBg.spriteFrame = sp
                    }
                })
            } else {
                this.buffTipName.node.color = cc.color("#ffe063");
                this.outline.color = cc.color("#561906")
                gdk.rm.loadRes(resId, bgPath + 'zd_pzbg01', cc.SpriteFrame, (sp: cc.SpriteFrame) => {
                    if (cc.isValid(this.node)) {
                        this.buffNameBg.spriteFrame = sp
                    }
                })
            }
            //设置图标
            if (this.buffCfg && (this.buffCfg.from_icon_e != '' || this.buffCfg.from_icon_s != '')) {
                let iconPath = ''
                if (this.buffCfg.from_icon_s != '') {
                    iconPath = 'icon/soldier/' + this.buffCfg.from_icon_s + '_s'//GlobalUtil.getSoldierIcon(Number(this.buffCfg.from_icon_s), true)
                } else {
                    iconPath = 'icon/equip/' + this.buffCfg.from_icon_e;//GlobalUtil.getIconById(Number(this.buffCfg.from_icon_e))
                }
                if (iconPath) {
                    gdk.rm.loadRes(resId, iconPath, cc.SpriteFrame, (sp: cc.SpriteFrame) => {
                        if (cc.isValid(this.node)) {
                            this.buffAttackIcon.spriteFrame = sp
                        }
                    })
                    this.buffNameIconNode.active = true;
                } else {
                    CC_DEBUG && cc.error(`Skill_buffCfg 中 from_icon_s 或 from_icon_e 字段配置错误：buff_id: ${this.buffCfg.id}`);
                    this.buffNameIconNode.active = false;
                }
            } else {
                this.buffNameIconNode.active = false;
            }
            this.buffTipName.string = this.value;
            this.buffTip.node.active = false;
            this.buffNameNode.active = true;
            //animaNode = this.buffTipName.node
            this.spine.node.active = false;
            this.action = cc.speed(
                cc.sequence(
                    cc.spawn(
                        cc.fadeIn(0.2),
                        cc.scaleTo(0.2, 1),
                    ),
                    cc.callFunc(() => {
                        this.spine.node.active = true;
                        this.spine.setAnimation(0, spineName, false)
                        this.spine.timeScale = speed;
                    }),
                    cc.delayTime(0.6),
                    cc.spawn(
                        cc.fadeOut(0.2),
                        cc.scaleTo(0.2, 0.5),
                    ),
                    cc.callFunc(() => {
                        this.hide();
                    }),
                ),
                speed
            )
        }
        let add = 45;
        if (this.target.model.type == PveFightType.Enemy) {
            if ((this.target.model as PveEnemyModel).isBoss) {
                add = 75;
            }
        }
        let temY = rect != null ? rect.y + rect.height + add : add; //-90
        this.node.setPosition(pos.x, pos.y + temY); //MathUtil.rnd(-20, 20)
        this.node.runAction(this.action);

    }

    onDisable() {
        this.value = '';
        this.target = null;
        this.sceneModel = null;
        this.buffTipName.string = '';
        GlobalUtil.setSpriteIcon(this.node, this.buffTip, null);
        this._isHideCalled = false;
        this.buffCfg = null;
        this.action = null;

    }
    hide(effect: boolean = true) {
        if (this._isHideCalled) return;
        this._isHideCalled = true;
        gdk.NodeTool.hide(this.node, effect, () => {
            PvePool.put(this.node);
        });

    }

    @gdk.binding('sceneModel.timeScale')
    _setTimeScale(v: number) {
        if (!this.sceneModel) return;
        if (!cc.isValid(this.node)) return;
        this.spine.timeScale = v;
        this.action['setSpeed'](v);

    }
    @gdk.binding('sceneModel.state')
    _sceneState(v: PveSceneState) {
        switch (v) {
            case PveSceneState.Pause:
                this.spine.timeScale = 0;
                this.action['setSpeed'](0);
                break;
            case PveSceneState.Entering:
            case PveSceneState.Fight:
                let speed = Math.max(1, this.sceneModel.timeScale)
                this.spine.timeScale = speed;
                this.action['setSpeed'](speed);
                break;
            default:
                this.hide(false);
        }
    }
}
