import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import PveFsmEventId from '../enum/PveFsmEventId';
import PveLittleGameModel from '../model/PveLittleGameModel';
import PveSceneState from '../enum/PveSceneState';
import { AskInfoType } from '../../../common/widgets/AskPanel';
import { Little_game_globalCfg } from '../../../a/config';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


/**
 * Pve场景控制类
 * @Author: sthoo.huang
 * @Date: 2019-02-14 18:07:15
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-09-29 15:15:02
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/PveLittleGameViewCtrl")
export default class PveLittleGameViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    root: cc.Node = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    map: cc.Node = null;
    @property(cc.Node)
    floor: cc.Node = null;
    @property(cc.Node)
    thing: cc.Node = null;
    @property(cc.Node)
    effect: cc.Node = null;
    @property(cc.Node)
    hurt: cc.Node = null;
    @property(cc.Node)
    buffTip: cc.Node = null;

    @property(cc.Prefab)
    towerPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    enemyPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    generalPrefab: cc.Prefab = null;

    @property(cc.Node)
    readyNode: cc.Node = null;
    @property(cc.Node)
    fightNode: cc.Node = null;

    model: PveLittleGameModel;
    fsm: gdk.fsm.Fsm;

    maxTime: number = 0
    overTime: number = 0

    onEnable() {
        let model: PveLittleGameModel = this.model;
        let args = this.args;
        if (args && args.length > 0) {
            if (args[0] instanceof PveLittleGameModel) {
                model = args[0];
            } else {
                model = this.model;
                if (!model) {
                    model = new PveLittleGameModel();
                }
                model.id = args[0];
            }
        } else if (!model) {
            model = new PveLittleGameModel();

            // model.id = CopyUtil.getLatelyEnterableStage();
        }
        model.ctrl = this;
        this.model = model;
        this.fsm = this.node.getComponent(gdk.fsm.FsmComponent).fsm;
        // 重新开始fsm
        if (!this.fsm.active) {
            this.fsm.setActive(true);
            this.fsm.start();
        }
        this.maxTime = ConfigManager.getItemByField(Little_game_globalCfg, 'key', 'time').value[0]
        this.overTime = this.maxTime
    }


    update(dt: number) {
        if (this.model.state != PveSceneState.Fight || this.overTime < 0) {
            return;
        }
        this.overTime -= dt;
        if (this.overTime < 0) {
            let info: AskInfoType = {
                title: gdk.i18n.t("i18n:TIP_TITLE"),
                sureCb: () => {
                    this.close()
                },
                oneBtn: true,
                thisArg: this,
                sureText: "退出",
                descText: "挑战失败",
                closeBtnCb: () => {
                    if (JumpUtils.ifSysOpen(1301)) {
                        this.model.id = this.model.id
                        this.model.generalHp = this.model.enterGeneralHp;
                        this.model.ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_LITTLEGAME_SCENE_RESTART)
                    } else {
                        this.model.ctrl.close()
                    }

                },
            }
            GlobalUtil.openAskPanel(info);
            GuideUtil.clearGuide();
        }
    }

    onDisable() {
        let model = this.model
        //PveTool.removeSceneNodes(this, !model.isMirror);
        GlobalUtil.setSpriteIcon(this.node, this.map, null);
        // 移除所有节点
        let props: string[] = [
            'towers',           // 英雄塔座列表
            'enemies',            // 英雄列表
            'generals',         // 指挥官列表
        ];
        props.forEach(prop => {
            let arr: any[] = model[prop].concat();
            arr.forEach(ctrl => {
                if (ctrl.hide) {
                    ctrl.hide(false);
                } else {
                    gdk.NodeTool.hide(ctrl.node, false);
                }
            });
        });
        // 移除所有子节点
        this.map.destroyAllChildren();
        this.floor.destroyAllChildren();
        this.thing.destroyAllChildren();
        this.effect.destroyAllChildren();
        this.hurt.destroyAllChildren();
        this.buffTip.destroyAllChildren();
        // 回收资源
        let resId = this.resId;
        if (resId != 0) {
            gdk.rm.releaseResByPanel(resId);
            gdk.rm.loadResByPanel(resId);
        }
        // 清除数据
        this.model = null;
        this.fsm && this.fsm.setActive(false);
        this.fsm = null;
    }

    close() {
        let panelId: gdk.PanelValue;
        if (JumpUtils.ifSysOpen(1301)) {
            // 基地功能开启
            panelId = PanelId.MainPanel;
        } else {
            let copyModel = ModelManager.get(CopyModel);
            let isFisrt = copyModel.lastCompleteStageId == 0;
            panelId = isFisrt ? PanelId.PveScene : PanelId.PveReady;
        }
        gdk.panel.open(panelId);
        super.close()

    }

    @gdk.binding('model.state')
    _state(v: PveSceneState) {
        switch (v) {
            case PveSceneState.Loading:
            case PveSceneState.Ready:
                this.setTitleInfo();
                this.readyNode.active = true;
                this.fightNode.active = false;
                break;
            case PveSceneState.Fight:
                this.readyNode.active = false;
                this.fightNode.active = true;
                break;
            default:
                this.readyNode.active = true;
                this.fightNode.active = false;
        }
    }

    setTitleInfo() {
        this.title = `第${this.model.id}关`
        this._titleLabel.string = this.title;
    }

    StartBtnClick() {
        this.model.state = PveSceneState.Fight;
        this.fsm.sendEvent(PveFsmEventId.PVE_SCENE_FIGHT);
    }

    // 设置滚动条状态
    setScrollViewEnabled(v: boolean) {
        if (!this.scrollView) return;
        v = v && this.content.width > this.root.width;
        if (v) {
            cc.director.on(cc.Director.EVENT_BEFORE_DRAW, this._beforeDraw, this);
        } else {
            cc.director.off(cc.Director.EVENT_BEFORE_DRAW, this._beforeDraw, this);
        }
        this.scrollView.enabled = v;
        // 更新遮罩状态
        let node = this.scrollView.node;
        let mask = node.getComponent(cc.Mask);
        if (!mask && v) {
            mask = node.addComponent(cc.Mask);
        }
        mask && (mask.enabled = v);
    }

    // 渲染前回调
    _beforeDraw() {
        let s = this.scrollView.node;
        let v = cc.rect(0, 0, s.width, s.height);   // this.node.getChildByName('UI').getBoundingBoxToWorld();
        let c = this.content.children;
        for (let i = c.length - 1; i >= 0; i--) {
            let a = c[i].children;
            for (let j = a.length - 1; j >= 0; j--) {
                let n = a[j];
                if (v.intersects(n.getBoundingBoxToWorld())) {
                    n.visible = true;
                } else {
                    // 滚动区域外的对象不渲染
                    n.visible = false;
                }
            }
        }
    }
}
