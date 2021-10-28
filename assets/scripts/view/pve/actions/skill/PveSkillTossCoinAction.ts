import FightingMath from '../../../../common/utils/FightingMath';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PvePool from '../../utils/PvePool';
import PveRes from '../../../pve/const/PveRes';
import PveSkillBaseAction from '../base/PveSkillBaseAction';
import PveTool from '../../utils/PveTool';
import StringUtils from '../../../../common/utils/StringUtils';

/**
 * @Author: chengyou.lin
 * @Date: 2020-02-22 15:02:04
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-31 09:54:59
 */
const { property } = cc._decorator;
const COMM_URL = 'spine/common/E_com_xuli/E_com_xuli';

@gdk.fsm.action("PveSkillTossCoinAction", "Pve/Skill")
export default class PveSkillTossCoinAction extends PveSkillBaseAction {

    // @property({ tooltip: "动画文件" })
    effect_file: string = "E_buff_jiashengming";

    // @property({ tooltip: "音效文件" })
    sound_res: string = "";

    effect_start: string = "hit";
    effect_front: string = "hit";
    effect_back: string = "hit";
    ratio: number = 0.5;
    buff_id: number = 0;
    buff_time: number = 1;
    num: number = 3;
    //特效的宽
    buff_width: number = 40;

    points: cc.Vec2[];
    result: number[];
    onEnter() {
        super.onEnter();

        let attacker = this.model.attacker;
        if (!attacker || !attacker.isAlive) {
            this.finish();
            return;
        }
        let toss_coin: any = attacker.model.prop.toss_coin;
        if (!toss_coin) {
            this.finish();
            return;
        }

        this.num = toss_coin[0] || this.num;
        this.buff_id = toss_coin[1] || this.buff_id;
        this.buff_time = toss_coin[2];
        this.ratio = toss_coin[3] || this.ratio;
        this.buff_width = toss_coin[4] || this.buff_width;
        this.effect_file = toss_coin[5] || this.effect_file;
        this.effect_start = toss_coin[6] || this.effect_start;
        this.effect_front = toss_coin[7] || this.effect_front;
        this.effect_back = toss_coin[8] || this.effect_back;

        this.sound_res = toss_coin[9] || this.sound_res;
        (this.sound_res != "") && GlobalUtil.isSoundOn &&
            gdk.sound.play(
                gdk.Tool.getResIdByNode(this.ctrl.sceneModel.ctrl.node),
                this.sound_res,
            );



        //加载硬币资源
        this.loadRes();
    }

    loadRes() {
        let effect_res = this.effect_file;
        let resId = gdk.Tool.getResIdByNode(this.node);
        let url = StringUtils.format(PveRes.PVE_SKILL_RES, effect_res);
        let res = gdk.rm.getResByUrl(url, sp.SkeletonData, resId);
        if (res) {
            // 资源已经存在，不需要重复加载
            this.loadComplete();
        } else {
            // 资源不存在，则需要加载外部资源
            gdk.rm.loadRes(resId, url, sp.SkeletonData, () => {
                if (!cc.isValid(this.node)) return;
                if (this.effect_file != effect_res) return;
                this.loadComplete();
            }, () => {
                // 加载失败
                if (!cc.isValid(this.node)) return;
                if (this.effect_file != effect_res) return;
                this.loadError();
            });
        }
    }

    endTossCoin(result: number[]) {
        if (!this.active) return;
        this.result = result;
        let m = this.model;
        let ctrl = this.ctrl.sceneModel.ctrl;
        let url = StringUtils.format(PveRes.PVE_SKILL_RES, this.effect_file);
        let points = this.points;
        let spines: sp.Skeleton[] = [];
        for (let i = 0; i < points.length; i++) {
            let point = points[i];
            let animation = result[i] ? this.effect_front : this.effect_back;
            PveTool.createSpine(
                ctrl.spineNodePrefab,
                ctrl.effect,
                url,
                animation,
                false,
                Math.max(1, ctrl.model.timeScale),
                (spine: sp.Skeleton, resId: string, res: sp.SkeletonData) => {
                    if (!cc.isValid(spine.node)) return;
                    spines.push(spine);
                    if (spines.length >= this.num) {
                        spines.forEach((_spine) => {
                            PveTool.clearSpine(_spine);
                            PvePool.put(_spine.node);
                        })
                        this._finish();
                        // //释放资源
                        // gdk.rm.releaseRes(resId, res);
                    }
                },
                () => {
                    if (!cc.isValid(this.node)) return false;
                    if (!m.attacker) return false;
                    if (!m.attacker.isAlive) return false;
                    return true;
                },
                point,
                true,
                false,
            );
        }
    }

    startTossCoin() {
        if (!this.active) return;
        let m = this.model;
        let ctrl = this.ctrl.sceneModel.ctrl;
        let url = StringUtils.format(PveRes.PVE_SKILL_RES, this.effect_file);
        let points = this.points;
        let spines: sp.Skeleton[] = [];
        let result = [];
        let animation = this.effect_start;
        for (let i = 0; i < points.length; i++) {
            result.push(FightingMath.random() < this.ratio);
            let point = points[i];
            PveTool.createSpine(
                ctrl.spineNodePrefab,
                ctrl.effect,
                url,
                animation,
                false,
                Math.max(1, ctrl.model.timeScale),
                (spine: sp.Skeleton, resId: string, res: sp.SkeletonData) => {
                    if (!cc.isValid(spine.node)) return;
                    spines.push(spine);

                    if (spines.length >= this.num) {
                        spines.forEach((_spine) => {
                            PveTool.clearSpine(_spine);
                            PvePool.put(_spine.node);
                        })
                        gdk.Timer.clear(this, this.finish);
                        this.endTossCoin(result);
                        // gdk.rm.releaseRes(resId, res);
                    }
                },
                () => {
                    if (!cc.isValid(this.node)) return false;
                    if (!m.attacker) return false;
                    if (!m.attacker.isAlive) return false;
                    return true;
                },
                point,
                true,
                false,
            );
        }
    }

    // 资源加载成功
    loadComplete() {
        if (!this.active) return;
        let attacker = this.model.attacker;
        let r = attacker.getRect();
        let p = cc.v2(attacker.getPos().x, attacker.getPos().y);
        p.y += r.height;
        let points;
        if (this.num == 2) {
            points = [new cc.Vec2(p.x - this.buff_width / 2, p.y), new cc.Vec2(p.x + this.buff_width / 2, p.y)]
        } else if (this.num == 3) {
            points = [new cc.Vec2(p.x - this.buff_width, p.y), p, new cc.Vec2(p.x + this.buff_width, p.y)];
        } else {
            points = [p];
        }
        this.points = points;

        //清除buff
        attacker.buff.removeBuf(this.buff_id, 'all');

        this.startTossCoin();

        //特效超时，忽略
        gdk.Timer.once(1000, this, this.finish);
    }

    // 资源加载失败，退出
    loadError() {
        if (!this.active) return;
        this.finish();
    }

    _finish() {
        if (!this.active) return;
        if (!this.result) return;
        let isTrue = false;
        for (let i = 0; i < this.result.length; i++) {
            if (this.result[i]) {
                isTrue = true;
            }
        }
        if (isTrue) {
            // let buffCfg = ConfigManager.getItemById(Cardskill_buffCfg, this.buff_id);
            // if (buffCfg) {
            let attacker = this.model.attacker;
            let attacker_id = attacker.model.fightId;
            let attacker_prop = attacker.model.prop;
            PveTool.addBuffsTo(attacker_id, attacker_prop, attacker.model.ctrl, this.buff_id, this.buff_time);
            // } else {
            //     cc.error("投币buff未配置指定的buff =", this.buff_id);
            // }
        }
        this.finish();
    }

    onExit() {
        this.points = null;
        this.result = null;
        super.onExit();
    }
}