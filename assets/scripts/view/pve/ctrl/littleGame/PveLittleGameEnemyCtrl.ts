import { Little_gameCfg } from "../../../../a/config";
import MathUtil from "../../../../common/utils/MathUtil";
import StringUtils from "../../../../common/utils/StringUtils";
import { PveEnemyDir, PveFightDirName } from "../../const/PveDir";
import { PveFightAnimationOption } from "../../core/PveFightCtrl";
import PveFsmEventId from "../../enum/PveFsmEventId";
import PveSceneState from "../../enum/PveSceneState";
import PveLittleGameModel from "../../model/PveLittleGameModel";
import PveTool from "../../utils/PveTool";

const { ccclass, property } = cc._decorator;

// 缓存的模型对象包围框
const _rectCache: { [url: string]: cc.Rect } = {};
@ccclass
export default class PveLittleGameEnemyCtrl extends cc.Component {

    @property(sp.Skeleton)
    spines: Array<sp.Skeleton> = [];

    @property(cc.Label)
    hpLb: cc.Label = null;

    @property(cc.Sprite)
    weaponSp: cc.Sprite = null;
    @property(cc.Animation)
    weaponAni: cc.Animation = null;

    towerNode: cc.Node = null;

    fsm: gdk.fsm.Fsm;
    rect: cc.Rect;
    sceneModel: PveLittleGameModel;
    loaded: boolean = false;
    cfg: Little_gameCfg;
    dir: PveEnemyDir = PveEnemyDir.DOWN;
    type: number = 2;
    roadPosIndex: number;  // 最近路线点索引号

    // 动作超时处理队列
    private timeOutArr: { spine: sp.Skeleton, opt: PveFightAnimationOption }[];
    private addTimeOut(spine: sp.Skeleton, opt: PveFightAnimationOption) {
        this.removeTimeOut(spine);
        this.timeOutArr.push({
            spine: spine,
            opt: opt,
        });
    }
    private removeTimeOut(spine: sp.Skeleton) {
        if (!this.timeOutArr) return false;
        for (let i = this.timeOutArr.length - 1; i >= 0; i--) {
            if (this.timeOutArr[i].spine === spine) {
                this.timeOutArr.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    private timeOutUpdate(dt: number) {
        let spine: sp.Skeleton;
        let opt: PveFightAnimationOption;
        for (let i = this.timeOutArr.length - 1; i >= 0; i--) {
            let item = this.timeOutArr[i];
            spine = item.spine;
            if (!cc.isValid(spine) || !cc.isValid(spine.node) || !spine.node.active) {
                this.timeOutArr.splice(i, 1);
                continue;
            }
            opt = item.opt;
            opt.timeOut -= dt * spine.timeScale;
            if (opt.timeOut <= 0) {
                this.timeOutArr.splice(i, 1);
                // 清除事件监听
                spine.setStartListener(null);
                spine.setEventListener(null);
                spine.setCompleteListener(null);
                // 事件和完成回调
                opt.onEvent && opt.onEvent.call(opt.thisArg, opt.eventName);
                // 设置后续动作
                if (opt.after) {
                    this.setAnimation(opt.after.name, opt.after);
                }
                opt.onComplete && opt.onComplete.call(opt.thisArg);
            }
        }
    }

    onEnable() {
        this.timeOutArr = [];
        this.fsm = this.node.getComponent(gdk.fsm.FsmComponent).fsm;
        // 设置默认尺寸
        let sm = this.sceneModel;
        let scale: number = this.cfg.skin[2] / 100 * sm.scale;
        for (let i = 0, n = this.spines.length; i < n; i++) {
            let spine = this.spines[i];
            spine.node.scale = scale;
            if (spine.node.parent === this.node) {
                spine.node.zIndex = i + 2;
            }
        }
        if (this.type == 1) {
            this.weaponSp.node.active = true;
            this.weaponAni.play()
        } else {
            this.weaponSp.node.active = false;
            this.weaponAni.stop()
        }

        //设置血量
        this.hpLb.node.color = this.type == 2 ? cc.color('#ff0000') : cc.color('#00ff00')
        this.hpLb.string = this.cfg.blood + ''
    }


    //获取离怪物最近的路线点下标
    getRoadPosIndex() {
        let p = this.node.getPos();
        let index = 0;
        let dis = Number.MAX_VALUE;
        let roads = this.sceneModel.tiled.roads;
        let minPos = null;
        for (let key in roads) {
            let r = roads[key];
            for (let i = 0, n = r.length; i < n; i++) {
                let t = MathUtil.distance(p, r[i])
                if (dis > t) {
                    dis = t;
                    index = i;
                    minPos = r[i];
                }
            }
        }
        this.roadPosIndex = index;
        this.setDir(minPos)
    }


    update(dt: number) {
        if (this.timeOutArr.length > 0) {
            this.timeOutUpdate(dt);
        }
        this.fsm && PveTool.execFsmUpdateScript(this.fsm, dt);
    }
    onDisable() {
        let arr = this.sceneModel.enemies;
        let index = arr.indexOf(this);
        if (index >= 0) {
            arr.splice(index, 1);
        }
        this.fsm = null;
        this.sceneModel = null;
        this.rect = null;
        this.timeOutArr = null;
        //GlobalUtil.setSpriteIcon(this.node, this.weaponSp, null)
    }

    // 获得当前坐标
    getPos(dt: number = 0): cc.Vec2 {
        return this.node.getPos();
    }

    // 获得包围框
    getRect(): cc.Rect {
        let r = this.rect;
        if (!r) {
            this.updateRect()
            r = this.rect;
        }

        if (r && this.spines.length == 1) {
            let s = Math.abs(this.spines[0].node.scaleX);
            if (s != 1) {
                r = r.clone();
                r.width *= s;
                r.height *= s;
                return r;
            }
        }
        return r;
    }

    // 更新包围框
    updateRect() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;

        if (this.spines.length == 1) {
            let key = this.cfg.skin[1] + "#" + this.cfg.skin[2] / 100;
            let rect = _rectCache[key];
            if (rect) {
                // 从缓存中直接获取
                return this.rect = rect;
            } else {
                let spine = this.spines[0];
                let skeleton = spine['_skeleton'];
                if (skeleton) {
                    let bones = skeleton.bones;
                    let bone = null;
                    rect = spine.node.getBoundingBox();
                    if (bones && bones.length) {
                        skeleton.updateWorldTransform();
                        for (let i = 0, n = bones.length; i < n; i++) {
                            let bname: string = bones[i].data.name;
                            if (bname == 'head01' ||
                                StringUtils.endsWith(bname, '_head01') ||
                                StringUtils.endsWith(bname, '_head') ||
                                StringUtils.endsWith(bname, '_head1')) {
                                bone = bones[i];
                                break;
                            }
                        }
                        if (bone) {
                            rect.height = bone.worldY + (bone.data.length * bones[0].scaleY);
                            rect.y = 0;
                        }
                        // 保存至缓存中
                        _rectCache[key] = rect;
                    }
                    return this.rect = rect;
                }
            }
        }
        return this.rect = null;
    }

    // 方向计算
    setDir(to: cc.Vec2) {
        let from: cc.Vec2 = this.getPos();
        if (to.x == from.x && to.y == from.y) {
            // 如果当前坐标与目标坐标相同，则方向不变
            return;
        }
        let dir: number = this.dir;
        if (to.x > from.x) {
            dir = to.y > from.y ? PveEnemyDir.UP_RIGHT : PveEnemyDir.DOWN_RIGHT;
        } else {
            dir = to.y > from.y ? PveEnemyDir.UP_LEFT : PveEnemyDir.DOWN_LEFT;
        }
        this.dir = dir;
    }

    // 设置动作
    setAnimation(name: string, opt?: PveFightAnimationOption): boolean {
        let scaleX = this.getScale(name);
        let loop = !opt || (opt.loop === void 0) || opt.loop;
        let cb = opt && opt.onComplete;
        let eb = opt && opt.onEvent;
        let after = opt && opt.after;
        let animation = this.getAnimation(name);

        for (let index = this.spines.length - 1; index >= 0; index--) {
            let spine: sp.Skeleton = this.spines[index];

            // 无spine数据的对象，则不操作
            if (!spine || !spine.skeletonData) continue;

            // 设置播放完成回调、事件回调，如果有多个动画则只监听第一个动画
            if (index == 0) {
                if (cb || eb || after) {
                    if (eb) {
                        // 事件侦听
                        spine.setEventListener((entry: any, event: any) => {
                            eb.call(opt.thisArg, event.data.name);
                        });
                        // 指定的事件不存在，则打印错误信息
                        if (!!opt.eventName &&
                            !PveTool.hasSpineEvent(spine, animation, opt.eventName)) {
                            CC_DEBUG && cc.error(`缺少事件：${opt.eventName}, 文件名：${spine.skeletonData.name}, 动作名：${animation}`);
                            eb.call(opt.thisArg, opt.eventName);
                        }
                    }
                    // 超时处理
                    if (cc.js.isNumber(opt.timeOut)) {
                        this.addTimeOut(spine, opt);
                    } else {
                        this.removeTimeOut(spine);
                    }
                    // 完成监听
                    spine.setCompleteListener(() => {
                        // 清除超时回调
                        if (cc.js.isNumber(opt.timeOut)) {
                            this.removeTimeOut(spine);
                        }
                        // 清除事件
                        spine.setStartListener(null);
                        // 陷阱待机特效范围显示问题修改（range_begin事件）
                        if (!spine.loop) {
                            spine.setEventListener(null);
                        }
                        spine.setCompleteListener(null);
                        // 设置后续动作
                        if (after) {
                            this.setAnimation(after.name, after);
                        }
                        // 完成回调
                        cb && cb.call(opt.thisArg);
                    });
                } else {
                    // 清除事件
                    spine.setStartListener(null);
                    spine.setEventListener(null);
                    spine.setCompleteListener(null);
                    this.removeTimeOut(spine);
                }
            }

            // 设置镜像
            spine.node.scaleX = Math.abs(spine.node.scaleX) * scaleX;

            // 将要设置的动作不存在时
            if (!PveTool.hasSpineAnimation(spine, animation)) {
                CC_DEBUG && cc.error(`缺少动作：${animation} , 文件名：${spine.skeletonData.name}`);
                animation = spine.animation;
            }

            // 设置动画名称
            let oldanm = spine.animation;
            let isadd = true;
            if (oldanm == null || oldanm == '' || (opt && opt.mode === 'set')) {
                // 行走动画为了平顺，则使用添加的方式修改 (怪物的移动动作可能会改变)
                isadd = (oldanm == animation) //&& (name == PveFightAnmNames.WALK );
            }
            let a: any[] = spine['_animationQueue'];
            if (isadd) {
                // 添加动画
                if (a && a.length > 0) {
                    a[0].animationName = animation;
                    a[0].loop = loop;
                } else {
                    spine.addAnimation(0, animation, loop);
                }
            } else {
                // 替换更新
                a && (a.length = 0);
                spine.loop = loop;
                spine.animation = animation;
            }
        }
        // 更新包围框
        if (!this.rect) {
            gdk.Timer.callLater(this, this.updateRect);
        }
        return true;
    }


    getAnimation(animation: string, skip: boolean = true): string {

        if (this.cfg.skin[0] == 1) {
            return animation;
        }
        // 怪物模型外观设置镜像效果
        let side: string;
        switch (this.dir) {
            case PveEnemyDir.DOWN_LEFT:
                side = PveFightDirName.SIDE;
                break;

            case PveEnemyDir.DOWN_RIGHT:
                side = PveFightDirName.SIDE;
                break;

            case PveEnemyDir.UP_LEFT:
                side = PveFightDirName.SIDE;
                break;

            case PveEnemyDir.UP_RIGHT:
                side = PveFightDirName.SIDE;
                break;

            case PveEnemyDir.UP:
                side = PveFightDirName.SIDE;
                break;

            default:
                if (PveTool.hasSpineAnimation(
                    this.spines[0],
                    animation + '_' + PveFightDirName.SIDE,
                )) {
                    // 如果模型中有向下的动作，则使用向下动作
                    side = PveFightDirName.SIDE;
                } else {
                    // 如果没有向下的面向，则使用侧面代替
                    side = PveFightDirName.SIDE;
                }
                break;
        }
        animation = animation + '_' + side;
        return animation;
    }

    getScale(animation: string): number {
        let scaleX: number = this.spines[0].node.scaleX > 0 ? 1 : -1;
        switch (this.dir) {
            case PveEnemyDir.DOWN_LEFT:
            case PveEnemyDir.UP_LEFT:
                scaleX = -1;
                break;

            case PveEnemyDir.DOWN_RIGHT:
            case PveEnemyDir.UP_RIGHT:
                scaleX = 1;
                break;

            case PveEnemyDir.UP:
                break;

            default:
                if (this.spines[0] &&
                    this.spines[0].skeletonData &&
                    this.spines[0].skeletonData.skeletonJson) {
                    // 模型资源已加载
                    let tanm: any = this.spines[0].skeletonData.skeletonJson.animations;
                    let temp: string = animation + '_' + PveFightDirName.DOWN;
                    if (tanm[temp]) {
                        // 如果模型中有向下的动作，则使用向下动作
                        scaleX = 1;
                    }
                }
                break;
        }
        return scaleX;
    }

    enemyClick() {

        if (this.sceneModel.state != PveSceneState.Fight) {
            return;
        }
        //cc.log(this.cfg.point + '塔位被点击了')
        if (this.sceneModel.generalMoveState) {
            //cc.log('指挥官正在移动状态')
            return;
        }
        this.sceneModel.ctrl.overTime = this.sceneModel.ctrl.maxTime
        this.sceneModel.generalTargetPosIndex = this.roadPosIndex;
        this.sceneModel.curEnemy = this;
        this.sceneModel.generals[0].fsm.sendEvent(PveFsmEventId.PVE_LITTLEGAME_GENERAL_WALK);
    }

    hide(effect: boolean = true) {
        //gdk.NodeTool.hide(this.node, effect, this.onRecover, this);
        this.node.destroy();
    }

    // onRecover() {
    //     PvePool.put(this.node);
    // }

}
