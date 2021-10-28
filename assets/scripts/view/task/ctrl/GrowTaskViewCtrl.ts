import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import MathUtil from '../../../common/utils/MathUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PvePool from '../../pve/utils/PvePool';
import TaskModel from '../model/TaskModel';
import TaskUtil from '../util/TaskUtil';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../common/models/BagModel';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { Mission_grow_chapterCfg, Mission_growCfg } from '../../../a/config';
import { TaskEventId } from '../enum/TaskEventId';

/**
 * @Description: 成长任务界面控制器
 * @Author: yaozu.hu
 * @Date: 2019-03-25 15:22:12
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-22 12:55:40
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/GrowTaskViewCtrl")
export default class GrowTaskViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Label)
    chapter: cc.Label = null;

    @property(cc.Node)
    mask: cc.Node = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    taskItem: cc.Prefab = null

    @property(sp.Skeleton)
    titleSpine: sp.Skeleton = null;

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Node)
    slotIcon: cc.Node = null;

    @property(sp.Skeleton)
    slotIconSpine: sp.Skeleton = null;

    @property(sp.Skeleton)
    iconEffectSpine: sp.Skeleton = null;

    @property(cc.Button)
    chapterBtn: cc.Button = null;

    @property(cc.Node)
    pzgjinNode: cc.Node = null;
    @property(cc.Node)
    pzgziNode: cc.Node = null;
    @property(cc.Node)
    pzgtyNode: cc.Node = null;

    @property(cc.Animation)
    pzgjin: cc.Animation = null;
    @property(cc.Animation)
    pzgzi: cc.Animation = null;
    @property(cc.Animation)
    pzgty: cc.Animation = null;
    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.ProgressBar)
    pro: cc.ProgressBar = null;

    @property(cc.Node)
    proBarTarget: cc.Node = null;//光标
    @property(cc.Node)
    proBarContent: cc.Node = null;

    @property(cc.Prefab)
    energyItem: cc.Prefab = null;
    @property(cc.Animation)
    energyAnim: cc.Animation = null;
    @property(cc.Node)
    energyEffectNode: cc.Node = null;

    growdata: GrowTaskItemType[] = [];
    private list: ListView = null;

    get model(): TaskModel { return ModelManager.get(TaskModel); }
    chapterCfg: Mission_grow_chapterCfg;
    chapterState: number = 1;
    growLevelCfg: Mission_growCfg[] = [];

    posList: cc.Vec2[] = [cc.v2(-76, -102), cc.v2(229, -102), cc.v2(-76, -267), cc.v2(229, -267)];
    tween: cc.Tween;
    curNum: number;
    cfgs: Mission_growCfg[];

    onEnable() {
        this.initGrowTaskData();
        this._updateTaskScroll();

        gdk.e.on(TaskEventId.UPDATE_TASK_GROW_INFO, this._updateTaskAward, this);
        // gdk.Timer.once(600, this, () => {
        //     this.node.getChildByName('SCSC_shoubingdiban').runAction(cc.fadeIn(1));
        // })
    }

    onDisable() {
        this.node.getChildByName('SCSC_shoubingdiban').stopAllActions();
        if (this.list) {
            this.list.destroy()
        }
        this.tween && this.tween.stop();
        this.tween = null;
        this.node.off(cc.Node.EventType.TOUCH_END);

        gdk.e.targetOff(this);
        gdk.Timer.clearAll(this);
        let ani = this.slot.node.getComponent(cc.Animation);
        ani.stop('reward_shake');
        ani.targetOff(this);
    }

    initGrowTaskData(showEnergy?: boolean) {
        this.pzgjinNode.active = false;
        this.pzgziNode.active = false;
        this.pzgtyNode.active = false;
        this.growdata = []
        let model = this.model;
        let chapterCfgs = ConfigManager.getItems(Mission_grow_chapterCfg)
        let lastChaptercfg = chapterCfgs[chapterCfgs.length - 1]
        //获取当前章节信息，如果没有就向服务器请求数据
        if (model.GrowChapter == 0) {
            NetManager.send(new icmsg.MissionGrowListReq())
            return;
        }
        let chapterId = Math.min(model.GrowChapter, lastChaptercfg.id)
        let growChapter = ConfigManager.getItemByField(Mission_grow_chapterCfg, "id", chapterId)
        this.chapter.string = growChapter.title1.replace("-", "/")
        let cfgs: Mission_growCfg[] = ConfigManager.getItems(Mission_growCfg, { chapter: chapterId });
        if (cfgs.length == 0) {
            return;
        }
        this.growLevelCfg = cfgs.concat();
        this.chapterState = 1;
        let comNum = 0;
        for (let i = 0; i < cfgs.length; i++) {
            let cfg = cfgs[i];
            let state = TaskUtil.getGrowTaskItemState(cfg, i);
            if (model.GrowChapter > lastChaptercfg.id) {
                state = 2;
            }
            if (state != 2) {
                this.chapterState = 0;
            }
            if (state == 2) {
                comNum += 1;
            }
            let data: GrowTaskItemType = {
                state: state,
                cfg: cfg
            }
            this.growdata.push(data)
        }
        this.curNum = comNum
        this.cfgs = cfgs
        this._initProBarPoint();
        // 显示能量球
        if (showEnergy) {
            this.tween && this.tween.stop();
            this.tween = cc.tween(this.pro)
                .to(0.5, {
                    progress: {
                        value: this.curNum / this.cfgs.length,
                        progress: (start: number, end: number, current: number, ratio: number) => {
                            let val = start + (end - start) * ratio;
                            // this.updateProBarPoint(val);
                            this._updateProBarPoint();
                            return val;
                        },
                    }
                })
                .call(() => {
                    this.num.string = this.curNum + '/' + this.cfgs.length;
                    this.tween = null;
                    // this.updateProBarPoint();
                    this._updateProBarPoint();
                })
                .start();
        } else {
            this.num.string = this.curNum + '/' + this.cfgs.length;
            this.pro.progress = this.curNum / this.cfgs.length;
            this.tween && this.tween.stop();
            this.tween = null;
            // this.updateProBarPoint();
            this._updateProBarPoint();
        }

        // 设置章节奖励Icon
        if (model.GrowChapter > lastChaptercfg.id) {
            this.chapterCfg = chapterCfgs[-1];
            // this.over.active = true;
            // this.component.active = false;
            // this.nameLab.string = ''
        } else {
            this.chapterCfg = ConfigManager.getItemById(Mission_grow_chapterCfg, this.model.GrowChapter)
            // this.over.active = false;
            // if (this.chapterState == 1) {
            // this.component.active = true;
            // this.showItemPz();
            // } else {
            // this.component.active = false;
            // }
        }
        // this.chapterName.string = this.chapterCfg.title;

        // this.slotIconSpine.setAnimation(0, 'stand6', true);
        this.slot.updateItemInfo(this.chapterCfg.reward[0], this.chapterCfg.reward[1])
        // this.slot.itemInfo = {
        //     series: null,
        //     itemId: this.chapterCfg.reward[0],
        //     itemNum: this.chapterCfg.reward[1],
        //     type: BagUtils.getItemTypeById(this.chapterCfg.reward[0]),
        //     extInfo: null
        // }
        this._updateSpine();

        // if (this.chapterState == 1) {
        //     this.iconEffectSpine.node.active = true;
        //     this.iconEffectSpine.setAnimation(0, 'stand7', true);
        // }
        //let cfg = BagUtils.getConfigById(this.chapterCfg.reward[0])
        //this.slot.updateItemName(cfg.name)
        // this.nameLab.string = cfg.name
    }

    /**
     * 角度转弧度
     */
    angleToRad(angle: number) {
        return angle * Math.PI / 180;
    }

    _initProBarPoint() {
        this.proBarContent.removeAllChildren();
        let len = this.cfgs.length;
        let avgPercent = 1 / len;
        for (let i = 0; i < len - 1; i++) {
            let item = cc.instantiate(this.proBarTarget);
            item.parent = this.proBarContent;
            this.updateProBarPoint(avgPercent * (i + 1), item, false);
        }
    }

    _updateProBarPoint() {
        let nodes = this.proBarContent.children;
        let len = this.cfgs.length;
        nodes.forEach((node, idx) => {
            node.active = true;
            let avgPercent = 1 / len;
            let satisfy = this.pro.progress >= avgPercent * (idx + 1);
            this.updateProBarPoint(avgPercent * (idx + 1), node, satisfy);
        });
    }

    updateProBarPoint(v: number, node: cc.Node, satisfy: boolean) {
        // if (v === void 0) {
        //     v = this.pro.progress;
        // }
        let circleR = 145;
        let radian = this.angleToRad(180 * v);
        let x = -circleR * Math.cos(radian) + this.num.node.x;
        let y = circleR * Math.sin(radian) + this.num.node.y;
        let angle = -270 - 180 / Math.PI * radian;
        // this.proBarTarget.angle = angle;
        // this.proBarTarget.setPosition(x, y);
        node.angle = angle;
        node.setPosition(x, y);
        GlobalUtil.setSpriteIcon(this.node, node, `view/task/texture/grow/${satisfy ? 'SCSC_guangbiao' : 'SCSC_kedu2'}`);
    }

    energyMove(index: number) {
        let from = this.posList[index];
        for (let i = 0; i < 3; i++) {
            let to = cc.v2(from.x + MathUtil.rnd(-50, 50), from.y);
            let end = cc.v2(this.slot.node.x, this.slot.node.y)
            let n: cc.Node = PvePool.get(this.energyItem);
            n.setPosition(from);
            n.scale = 1
            n.parent = this.energyEffectNode;
            let dis: number = MathUtil.distance(from, to);
            let dt: number = Math.min(0.5, dis / 1000);
            let width = to.x - from.x;
            let param1 = 4.0
            let param2 = 1.0
            let pts: cc.Vec2[] = [
                cc.v2(
                    width * (1 - param1 / 10),
                    dis * (1 - param1 / 10),
                ),
                cc.v2(
                    width * (1 - param2 / 10),
                    dis * (1 - param2 / 10),
                ),
                cc.v2(width, to.y - from.y),
            ];
            let action: cc.Action = cc.speed(
                cc.sequence(
                    cc.delayTime(0.1 * i),
                    cc.bezierBy(0.3, pts),
                    cc.moveTo(0.5, end),
                    cc.callFunc(() => {
                        this.energyAnim.node.setPosition(cc.v2(end.x, end.y));
                        this.energyAnim.play();
                        PvePool.put(n);
                    })
                ),
                1
            )
            n.runAction(action);
        }
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.mask,
            content: this.content,
            item_tpl: this.taskItem,
            cb_host: this,
            gap_y: 5,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    /**更新滑动列表 */
    _updateTaskScroll(resetPos: boolean = true) {
        this._initListView()
        if (resetPos) {
            this.scrollView.stopAutoScroll()
        }
        this.list.set_data(this.growdata, resetPos)

        this.scheduleOnce(() => {
            let index = 0
            for (let i = 0; i < this.growdata.length; i++) {
                if (this.growdata[i].state == 1) {
                    index = i
                    break
                }
            }
            this.list.scroll_to(index)
        })
    }

    _updateTaskAward(e?: gdk.Event) {
        if (e && e.data) {
            let data = e.data;
            if (this.growLevelCfg.length > 0) {
                for (let i = 0; i < this.growLevelCfg.length; i++) {
                    let cfg = this.growLevelCfg[i];
                    if (cfg.id == data.id) {
                        this.energyMove(i);
                        this.initGrowTaskData(true);
                        this.list.refresh_item(i, this.growdata[i]);
                        break;
                    }
                }
            }
        } else {
            this.initGrowTaskData();
            this._updateTaskScroll();
        }
    }

    _updateSpine() {
        // this.slotIconSpine.setAnimation(0, 'stand5', false);
        this.iconEffectSpine.node.active = true;
        this.slot.node.stopAllActions();
        this.slot.node.angle = 0;
        if (this.chapterState == 1) {
            this.iconEffectSpine.setCompleteListener(null);
            this.iconEffectSpine.setAnimation(0, 'stand7', true);
            this.slot.node.runAction(cc.repeatForever(cc.sequence(
                cc.rotateBy(.05, 10),
                cc.rotateBy(.05, -10),
                cc.rotateBy(.05, -10),
                cc.rotateBy(.05, 10)
            )));
        }
        else {
            this.iconEffectSpine.setCompleteListener(() => {
                this.iconEffectSpine.setCompleteListener(null);
                this.iconEffectSpine.node.active = false;
            })
            this.iconEffectSpine.setAnimation(0, 'stand2', true);
        }

        this.titleSpine.node.active = true;
        this.titleSpine.setCompleteListener(() => {
            this.titleSpine.setCompleteListener(null);
            this.titleSpine.node.active = false;
        })
        this.titleSpine.setAnimation(0, 'stand', true);
    }

    onChapterClick() {
        if (this.chapterState == 1) {
            if (this.slot.node.getNumberOfRunningActions() >= 1) {
                this.slot.node.stopAllActions();
                this.slot.node.angle = 0;
            }
            // if (this.iconEffectSpine.animation == 'stand7') this.iconEffectSpine.node.active = false;
            NetManager.send(new MissionGrowChapterAwardReq())
        } else {
            let type = BagUtils.getItemTypeById(this.chapterCfg.reward[0])
            let item: BagItem = {
                series: this.chapterCfg.reward[0],
                itemId: this.chapterCfg.reward[0],
                itemNum: this.chapterCfg.reward[1],
                type: type,
                extInfo: null,
            }
            GlobalUtil.openItemTips(item, true)
        }
    }
    //设置品质动画
    // showItemPz() {
    //     //播放品质特效
    //     let itemConfig = <any>BagUtils.getConfigById(this.chapterCfg.reward[0])
    //     if (itemConfig) {
    //         if (itemConfig.color == 3) {
    //             this.pzgziNode.active = true;
    //             this.pzgzi.play();
    //         } else if (itemConfig.color == 4) {
    //             this.pzgjinNode.active = true;
    //             this.pzgjin.play();
    //         } else {
    //             this.pzgtyNode.active = true;
    //             this.pzgty.play();
    //         }
    //     }
    // }
}
export type GrowTaskItemType = {
    state: number,   // 任务状态 0:可领取 1:未完成 2:已领取
    cfg: Mission_growCfg
}
