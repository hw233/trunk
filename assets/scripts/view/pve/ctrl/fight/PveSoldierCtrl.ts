import PveHurtableFightCtrl from './PveHurtableFightCtrl';
import PveSoldierModel from '../../model/PveSoldierModel';
import StringUtils from '../../../../common/utils/StringUtils';
import { PveFightDirName, PveHeroDir, PveSoldierDir } from '../../const/PveDir';

/**
 * Pve小兵控制类
 * @Author: sthoo.huang
 * @Date: 2019-04-11 20:58:29
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-10-28 15:10:04
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/fight/PveSoldierCtrl")
export default class PveSoldierCtrl extends PveHurtableFightCtrl {

    model: PveSoldierModel;

    //战斗时长
    checkTime: number = 1;
    isfight: boolean = false;
    fightTime: number = 0;

    hide(effect: boolean = true) {
        for (let k = 0, n = this.spines.length; k < n; k++) {
            let spine = this.spines[k];
            if (spine.node.parent != this.node) {
                spine.node.setParent(this.node);
            }
        }
        this.checkTime = 1;
        this.isfight = false;
        this.fightTime = 0;
        super.hide(effect);
    }

    getAnimation(animation: string): string {
        switch (this.model.dir) {
            case PveSoldierDir.UP_LEFT:
            case PveSoldierDir.UP_RIGHT:
                animation = StringUtils.format('{0}_{1}', animation, PveFightDirName.DOWN);
                break;

            case PveSoldierDir.DOWN_LEFT:
            case PveSoldierDir.DOWN_RIGHT:
                animation = StringUtils.format('{0}_{1}', animation, PveFightDirName.SIDE);
                break;
        }
        return animation;
    }

    getScale(animation: string): number {
        let scaleX: number = 1;
        switch (this.model.dir) {
            case PveSoldierDir.UP_LEFT:
            case PveSoldierDir.DOWN_RIGHT:
                scaleX = 1;
                break;

            case PveSoldierDir.UP_RIGHT:
            case PveSoldierDir.DOWN_LEFT:
                scaleX = -1;
                break;
        }
        return scaleX;
    }

    setPosBy(i: number, n: number) {
        let m = this.model;
        m.index = i;
        m.total = n;
        this.node.setPosition(this.getOrignalPos());
    }

    getOrignalPos() {
        let m = this.model;
        let h = m.hero;
        let hm = h.model;
        let p = hm.orignalPos || h.node.getPos();
        let i = m.index;
        let n = m.total;
        let tx: number, ty: number;
        switch (hm.dir) {
            case PveHeroDir.RIGHT:
                // 方向为右
                tx = p.x + 50;
                ty = p.y + (i - (n + 1) / n + 1) * 40;
                break;

            case PveHeroDir.LEFT:
            default:
                // 方向为左
                tx = p.x - 50;
                ty = p.y + (i - (n + 1) / n + 1) * 40;
                break;
        }
        p = m.orignalPos;
        if (p) {
            p.x = tx;
            p.y = ty;
        } else {
            p = m.orignalPos = cc.v2(tx, ty);
        }
        return p;
    }

    setDir(to: cc.Vec2) {
        let model: PveSoldierModel = this.model as PveSoldierModel;
        let from: cc.Vec2 = model.hero.getPos();
        let deltaX: number = (to.x - from.x);
        let deltaY: number = (to.y - from.y);
        let dir: PveSoldierDir;
        if (deltaY > 0) {
            dir = deltaX > 0 ? PveSoldierDir.UP_RIGHT : PveSoldierDir.UP_LEFT;
        } else {
            dir = deltaX > 0 ? PveSoldierDir.DOWN_RIGHT : PveSoldierDir.DOWN_LEFT;
        }
        this.model.dir = dir;
    }

    updateBuff() {
        if (!this.model) return;
        if (!this.model.hero) return;
        this.model.hero.updateBuff();
    }

    reset() {
        let model = this.model;
        model.id = model.id;
        model.info = model.info;
        super.reset();
    }
}