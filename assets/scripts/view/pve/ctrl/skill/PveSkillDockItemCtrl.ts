import { CommonCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuideUtil from '../../../../common/utils/GuideUtil';
import PanelId from '../../../../configs/ids/PanelId';
import PveEventId from '../../enum/PveEventId';
import PveSceneState from '../../enum/PveSceneState';
import { PveFightSkill } from '../../model/PveBaseFightModel';
import PveSceneModel from '../../model/PveSceneModel';
import PveSkillModel from '../../model/PveSkillModel';
import PvePool from '../../utils/PvePool';
import PveTool from '../../utils/PveTool';
import PveGeneralCtrl from '../fight/PveGeneralCtrl';
import PveManualSkillCtrl from './PveManualSkillCtrl';
import PveSkillDockCtrl from './PveSkillDockCtrl';

/**
 * Pve指挥管技能子项组件
 * @Author: sthoo.huang
 * @Date: 2019-04-24 14:08:37
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-03-15 16:48:32
 */
const { ccclass, property, menu } = cc._decorator;
const FOCUS_COLOR: cc.Color = cc.color(255, 100, 100, 255);

@ccclass
@menu("qszc/scene/pve/PveSkillDockItemCtrl")
export default class PveSkillDockItemCtrl extends gdk.ItemRenderer {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    des: cc.Label = null;
    @property(cc.ProgressBar)
    mask: cc.ProgressBar = null;

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Label)
    energyNum: cc.Label = null;

    @property(cc.Animation)
    skillEffect: cc.Animation = null;

    @property(cc.Node)
    flag: cc.Node = null;

    @property(cc.Node)
    cancelFlag: cc.Node = null;

    general: PveGeneralCtrl;
    skill: PveFightSkill;
    dock: PveSkillDockCtrl;
    drag: PveManualSkillCtrl;
    timeScale: number;
    sceneModel: PveSceneModel;
    isStop: boolean = false
    stopTime: number = 0;
    //stopSKillTime = 0;
    isPause: boolean = false;

    eliteStop: boolean = false;

    desStrs: string[] = ['加速', '减速', '群晕']

    updateView() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        if (!this.data) return;
        if (!this.data.dock) return;
        if (!this.data.dock.sceneModel) return;
        this.general = this.data.general;
        this.dock = this.data.dock;
        this.sceneModel = this.dock.sceneModel;
        this.skill = this.data.skill;
        this.energyNum.string = this.skill.prop.energy;
        this.des.string = this.desStrs[this.index];
        GlobalUtil.setSpriteIcon(
            this.node,
            this.icon,
            ConfigManager.getItemById(CommonCfg, 'SKILL_ICON').value + this.skill.baseProp.icon,
        );
        GuideUtil.bindGuideNode(200 + this.index, this.node);
        this._updateState();
        this._updateEnergy();
        this._updateCD();
        this._updateEffect();
        // 精英副本指挥官禁止使用技能设置
        if (!this.sceneModel.eliteStageUtil.general || this.sceneModel.eliteStageUtil.stopGeneral.indexOf(this.index + 1) >= 0) {
            this.eliteStop = true;
        } else {
            this.eliteStop = false;
        }

        if (this.eliteStop) {
            this.mask.node.active = true;
            this.flag.active = true;
            this.mask.progress = 1;
            GlobalUtil.setGrayState(this.icon, 0);
            GlobalUtil.setGrayState(this.des, 0);
        } else {
            this.flag.active = false;
        }
        this.cancelFlag.active = false;
        this.sceneModel.showMiniChat = true;
        if (this.skill.id == this.data.hideSkill) {
            this.node.opacity = 0;
        }
        gdk.e.on(PveEventId.PVE_STOP_GENERAL_SKILL, this.stopGeneralSkill, this, 0, false);
    }

    update(dt: number) {
        if (!this.sceneModel) return;
        if (!this.isPause && this.stopTime > 0) {
            this.stopTime -= dt * this.sceneModel.timeScale;
            if (this.stopTime <= 0) {
                this.generalSkillRefresh();
            }
        }
    }

    onDisable() {
        gdk.e.targetOff(this);
        GuideUtil.bindGuideNode(200 + this.index);
        GlobalUtil.setSpriteIcon(this.node, this.icon, null);
        this._cancel();
        this.icon.spriteFrame = null;
        this.general = null;
        this.skill = null;
        this.dock = null;
        this.sceneModel = null;
    }

    //禁止指挥官技能
    stopGeneralSkill(params: any[]) {
        this.isStop = params[0];
        this.stopTime = params[1] / 1000;
        if (this.isStop) {
            //this.mask.node.active = true;
            //this.flag.active = true;
            //this.mask.progress = 1;
            //GlobalUtil.setGrayState(this.icon, 0);

            this.skillEffect.node.active = false;
            this.skillEffect.stop()

            this._cancel();
        }
        // else {
        //     this.mask.node.active = false;
        //     this.flag.active = false;
        //     this.mask.progress = 0;
        //     GlobalUtil.setGrayState(this.icon, 1);
        //     this._updateCD();
        //     this._updateEnergy();
        //     this._updateState();
        //     this._updateEffect();
        // }
        //gdk.Timer.clear(this, this.generalSkillRefresh)

        //gdk.Timer.once(this.stopTime, this, this.generalSkillRefresh)
    }

    //解除禁止
    generalSkillRefresh() {
        this.isStop = false;
        this.mask.node.active = false;
        this.flag.active = false;
        this.mask.progress = 0;
        GlobalUtil.setGrayState(this.icon, 1);
        GlobalUtil.setGrayState(this.des, 1);
        this._updateCD();
        this._updateEnergy();
        this._updateState();
        this._updateEffect();
        this.stopTime = 0;
    }

    _cancel() {
        if (this.drag) {
            // 清除目标选中状态
            let m = this.sceneModel;
            this.drag.model.selectedTargets.forEach(id => {
                let t = m.getFightBy(id);
                t && t.spines.forEach(spine => {
                    PveTool.setSpineShader(spine);
                });
            });
            // 隐藏技能指标器
            this.drag.hide(false);
            this.drag = null;
            this.cancelFlag.active = false;
            this.sceneModel.showMiniChat = true
        }
        // 清除计时器
        this.unschedule(this._moveing);
    }

    _touchMove(event: any) {
        if (!this.general) return;
        if (!this.general.model) return;
        if (!this.general.model.canUse(this.skill)) return;
        let camera = cc.Camera.cameras[0];
        let pos: cc.Vec2 = camera.getScreenToWorldPoint(event.getLocation()) as any;
        if (this.icon.node.getBoundingBox().contains(this.icon.node.parent.convertToNodeSpaceAR(pos))) {
            // 在图标按钮区域范围之内时，取消技能施放
            this._cancel();
        } else {
            // 移动到图标按钮之外，才算施法
            let s = this.skill;
            if (!this.drag) {
                let node: cc.Node = PvePool.get(this.dock.manualSkillPrefab);
                let model: PveSkillModel = PvePool.get(PveSkillModel);
                let ctrl: PveManualSkillCtrl = node.getComponent(PveManualSkillCtrl);
                ctrl.model = model;
                ctrl.sceneModel = this.sceneModel;
                ctrl.model.attacker = this.general;
                ctrl.model.config = s.prop;
                node.opacity = 255;
                node.name = 'skill_icon_' + event.currentTarget.name;
                PveManualSkillCtrl.init(ctrl);
                this.drag = ctrl;
                if (s.type == 101 || s.type == 104) {
                    // 定时更新
                    this.schedule(this._moveing, 1 / 15);
                } else {
                    // 清除计时器
                    this.unschedule(this._moveing);
                }
                this.cancelFlag.active = true;
                this.sceneModel.showMiniChat = false
            }
            // 转换为战斗场景坐标
            pos = this.drag.node.parent.convertToNodeSpaceAR(pos);
            pos.x = Math.ceil(pos.x);
            pos.y = Math.ceil(pos.y);
            this._moveing(pos);

            // 显示指挥官技能描述
            if (gdk.panel.isOpenOrOpening(PanelId.GeneralSkillDesPanel)) {
                return;
            }
            let temPos = this.icon.node.parent.parent.convertToWorldSpaceAR(cc.v2(0, 0))
            //let temPos = node.parent.convertToNodeSpaceAR(cc.v2(cc.winSize.width / 2, pos.y + 80));
            gdk.panel.setArgs(PanelId.GeneralSkillDesPanel, temPos, this.skill.config.des)
            gdk.panel.open(PanelId.GeneralSkillDesPanel)
            // gdk.panel.open(PanelId.GeneralSkillDesPanel, (node: cc.Node) => {
            //     if (!cc.isValid(this.node)) return;
            //     if (!this.node.activeInHierarchy) return;
            //     let pos = this.icon.node.parent.parent.convertToWorldSpaceAR(cc.v2(0, 0))
            //     let temPos = node.parent.convertToNodeSpaceAR(cc.v2(cc.winSize.width / 2, pos.y + 80));
            //     node.setPosition(temPos);
            //     // 更新说明文本
            //     let ctrl = node.getComponent(GeneralSkillDesCtrl);
            //     if (ctrl.desNode) {
            //         ctrl.des.maxWidth = 0;
            //         ctrl.des.string = this.skill.config.des;
            //         if (ctrl.des.node.width > 350) {
            //             ctrl.des.maxWidth = 350;
            //             ctrl.des.string = this.skill.config.des;
            //         }
            //         ctrl.bgNode.width = ctrl.des.node.width + 30;
            //         ctrl.bgNode.height = ctrl.des.node.height + 10;
            //     }
            // }, this);
        }
    }

    // 坐标更新
    _moveing(pos: cc.Vec2) {
        if (typeof pos === 'object') {
            this.drag.model.targetPos = pos;
        } else {
            pos = this.drag.model.targetPos;
        }
        // 根据技能的不同类型做处理
        switch (this.skill.type) {
            // 预选目标类型
            case 101:
            // 范围类型
            case 102:
            // 预选友方目标类型
            case 104:
                // 选择目标
                let m = this.drag.model;
                let o = m.selectedTargets.splice(0);
                let p = m.config;
                let a = PveTool.searchMoreTarget({
                    fight: this.general,
                    targetType: p.target_type,
                    pos: pos,
                    range: m.dmgRange,
                    num: p.target_num,
                });
                a && a.length && a.forEach(t => {
                    t && t.spines.forEach(spine => {
                        PveTool.setSpineShader(
                            spine,
                            'spine_add_color',
                            [
                                { key: 'added', value: FOCUS_COLOR },
                            ]
                        );
                    });
                    m.addTarget(t);
                });
                // 旧的目标
                o && o.length && o.forEach(id => {
                    if (m.selectedTargets.indexOf(id) >= 0) return;
                    let t = this.sceneModel.getFightBy(id);
                    t && t.spines.forEach(spine => {
                        PveTool.setSpineShader(spine);
                    });
                });
                //选择友方特效需特殊处理
                if (this.skill.type == 104) {
                    if (a && a.length && (o || o.length)) {
                        let icon: string = 'UI_zhihuiguanzhiyin_green';//this.drag.IconUtil.get(this.drag.model.config);
                        let path = `spine/ui/${icon}/${icon}`
                        GlobalUtil.setSpineData(this.node, this.drag.spine, path, true, 'stand', true, false);
                    } else if ((a || a.length) && o && o.length) {
                        let icon: string = 'UI_zhihuiguanzhiyin_red1'//this.drag.IconUtil.get(this.drag.model.config);
                        let path = `spine/ui/${icon}/${icon}`
                        GlobalUtil.setSpineData(this.node, this.drag.spine, path, true, 'stand', true, false);
                    }
                }
                break;
        }
    }

    _touchEnd() {
        let m = this.sceneModel;
        let node: cc.Node = this.node;
        node.off(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this);
        node.off(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
        node.off(cc.Node.EventType.TOUCH_CANCEL, this._touchEnd, this);
        this.unschedule(this._moveing);

        gdk.panel.hide(PanelId.GeneralSkillDesPanel)
        if (gdk.panel.isOpenOrOpening(PanelId.PveBossComming)) {
            // let bossComming = gdk.panel.get(PanelId.PveBossComming);
            // if (bossComming) {
            //     let ctrl = bossComming.getComponent(PveBossCommingCtrl)
            //     ctrl.timeScale = this.timeScale;
            // }
        } else {
            m.timeScale = this.timeScale;
        }

        if (!this.drag) return;
        let model = this.drag.model;
        // 根据技能的不同类型做处理
        let s = this.skill;
        let b: boolean = m.energy >= this.skill.prop.energy;
        if (b) {
            switch (s.type) {
                // 预选目标类型
                case 101:
                case 104:
                    b = model.selectedTargets.length > 0;
                    break;

                // 坐标目标类型
                case 102:
                // 指向性类型
                case 103:
                    b = model.targetPos != null;
                    break;
            }
            // 清除当前目标
            if (model.selectedTargets.length > 0) {
                model.selectedTargets.forEach(id => {
                    let t = m.getFightBy(id);
                    t && t.spines.forEach(spine => {
                        PveTool.setSpineShader(spine);
                    });
                });
                model.selectedTargets.length = 0;
            }
            // 如果条件满足，则施放技能
            if (b) {
                m.manualSkill = model; // 当前手动使用技能
                m.energy -= this.skill.prop.energy;   // 减能量
                this.general.model.useSkill(this.skill); // 重置CD值
                !m.isBounty && !m.isMirror && GuideUtil.activeGuide(`skill#${m.id}#${this.index}#used`);
            }
        }
        // 隐藏拖动图标
        this._cancel();
    }

    _touchStart() {
        if (this.eliteStop) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:PVE_ELITE_GENERAL_TIP'));
            return;
        }
        if (this.isStop) return;
        let m = this.sceneModel;
        if (m.isReplay) return;
        if (m.energy >= this.skill.prop.energy) {
            let node: cc.Node = this.node;
            node.on(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this);
            node.on(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
            node.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEnd, this);
            // 保存加速倍数
            this.timeScale = m.timeScale;
            // 降低游戏倍数
            if (this.timeScale > 0) {
                let cfg = ConfigManager.getItemById(CommonCfg, 'PVE_TIME_SCALE_SLOW');
                if (cfg &&
                    cc.js.isNumber(cfg.value) &&
                    cfg.value >= 0) {
                    // 配置的值小于0时，则不降速
                    m.timeScale = cfg.value;
                }
            }
        } else {
            gdk.gui.showMessage(gdk.i18n.t('i18n:PVE_NOT_ENOUGH_ENERGY'));
        }
    }

    @gdk.binding('sceneModel.state')
    @gdk.binding('general.model.isInManual')
    @gdk.binding('skill.cd')
    _updateState() {
        if (!this.skill || !this.sceneModel) return;
        if (!this.general || !this.general.model) return;
        let node: cc.Node = this.node;
        let b: boolean = cc.isValid(node);
        let m = this.sceneModel;
        this.isPause = m.state == PveSceneState.Pause
        b = b && m.state == PveSceneState.Fight;
        b = b && this.general.model.canUse(this.skill) && !this.general.model.isInManual;
        if (b) {
            node.on(cc.Node.EventType.TOUCH_START, this._touchStart, this, true);
        } else {
            this._cancel();
            node.off(cc.Node.EventType.TOUCH_START, this._touchStart, this, true);
            node.off(cc.Node.EventType.TOUCH_MOVE, this._touchMove, this);
            node.off(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
            node.off(cc.Node.EventType.TOUCH_CANCEL, this._touchEnd, this);
        }
    }

    @gdk.binding('sceneModel.state')
    @gdk.binding('sceneModel.energy')
    @gdk.binding('general.model.isInManual')
    _updateEnergy() {
        if (!cc.isValid(this.node)) return;
        if (!this.skill) return;
        if (!this.general) return;
        if (!this.general.model) return;
        if (!this.sceneModel) return;
        //----------精英副本指挥官技能判断------elite------------------
        if (this.eliteStop) {
            return;
        }
        if (this.isStop) return;
        let m = this.sceneModel;
        let b: boolean = m.state == PveSceneState.Fight && m.energy >= this.skill.prop.energy;
        let s = GlobalUtil.getGrayState(this.icon);
        if (b && !this.general.model.isInManual) {
            if (s == 1) {
                GlobalUtil.setGrayState(this.icon, 0);
                GlobalUtil.setGrayState(this.des, 0);
                if (!m.isReplay && !m.isBounty && !m.isMirror && this.skill.cd <= 0) {
                    GuideUtil.activeGuide(`skill#${m.id}#${this.index}`);
                }
            }
        } else if (s == 0) {
            GlobalUtil.setGrayState(this.icon, 1);
            GlobalUtil.setGrayState(this.des, 1);
        }
    }

    @gdk.binding('skill.cd')
    _updateCD() {
        if (!this.skill) return;
        let m = this.sceneModel;
        if (!m) return;
        if (this.isStop) return;
        let v = this.skill.cd;
        let cd: number = Math.floor(v) + 1;
        if (v > 0) {
            this.label.node.active = true;
            this.label.string = cd.toString();
            this.mask.node.active = true;
            this.mask.progress = Math.max(0, v) / this.skill.prop.cd;
        } else {
            this.label.node.active = false;
            this.mask.node.active = false;
            if (!m.isReplay && !m.isBounty && !m.isMirror && m.energy >= this.skill.prop.energy) {
                GuideUtil.activeGuide(`skill#${m.id}#${this.index}`);
            }
        }
    }

    @gdk.binding('sceneModel.state')
    @gdk.binding('sceneModel.energy')
    @gdk.binding('general.model.isInManual')
    @gdk.binding('skill.cd')
    _updateEffect() {
        if (!this.skill || !this.sceneModel) return;
        if (!this.general) return;
        if (!this.general.model) return;
        //----------精英副本指挥官技能判断------elite------------------
        if (this.eliteStop) {
            return;
        }
        if (this.isStop) return;
        let m = this.sceneModel;
        let b: boolean = true;
        b = b && m.state == PveSceneState.Fight;
        b = b && m.energy >= this.skill.prop.energy;
        b = b && this.general.model.canUse(this.skill);
        b = b && !this.general.model.isInManual;
        if (b) {
            // 播放特效
            if (!this.skillEffect.node.active) {
                this.skillEffect.node.active = true;
                this.skillEffect.play();
            }
        } else if (this.skillEffect.node.active) {
            // 停止播放特效
            this.skillEffect.node.active = false;
            this.skillEffect.stop()
        }
    }
}