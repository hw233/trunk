import FightingMath from '../../../../common/utils/FightingMath';
import RandomBossItemCtrl from './RandomBossItemCtrl';
import { Pve_bossbornCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-27 09:59:11 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arena/fight/RandomBossViewCtrl")
export default class RandomBossViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    content: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    cfg: Pve_bossbornCfg;
    bossId: number;
    cb: Function;

    delatX: number = 150;
    randomTime: number = 1.5;
    selectTime: number = .5;
    overX: number[] = [-600, 600];
    dirction: number = 1;
    randomMoveIdx: number = 7 * 3;
    selectMoveIdx: number;
    state: number = 1;
    curMoveDistance: number = 0;
    isPlay: boolean = false;

    onEnable() {
    }

    onDisable() {
        this.isPlay = false;
        this.curMoveDistance = 0;
        this.state = 1;
        this.cb = null;
        this.node.targetOff(this);
    }

    play(cfg: Pve_bossbornCfg, cb?: Function) {
        this.cb = cb;
        this.cfg = cfg;
        let bossList = [];
        let randomList = FightingMath.shuffle(this.cfg.bosslist);
        if (randomList.length > 7) {
            bossList = randomList.slice(0, 7);
        }
        else {
            bossList = [...randomList, ...FightingMath.shuffle(randomList).slice(0, 7 - randomList.length)];
        }
        this.bossId = FightingMath.shuffle(bossList)[0];
        let idx = bossList.indexOf(this.bossId);
        if (idx < 3) {
            this.selectMoveIdx = 3 - idx;
        }
        else if (idx == 3) {
            this.selectMoveIdx = this.content.children.length;
        }
        else {
            this.selectMoveIdx = this.content.children.length - idx + 3;
        }
        this._updateBoss(bossList);
        this.isPlay = true;
        this.spine.setCompleteListener(() => {
            this.spine.setCompleteListener(null);
            this.spine.node.active = false;
        });
        this.spine.node.active = true;
        this.spine.setAnimation(0, 'stand2', true);
    }

    update(dt: number) {
        if (!this.isPlay) return;
        let dx;
        if (this.state == 1) {
            dx = dt / this.randomTime * (this.randomMoveIdx * this.delatX) * this.dirction;
        }
        else {
            dx = dt / this.selectTime * (this.selectMoveIdx * this.delatX) * this.dirction;
        }
        dx = Math.floor(dx);
        if (this.curMoveDistance < this.randomMoveIdx * this.delatX && this.curMoveDistance + dx > this.randomMoveIdx * this.delatX) {
            dx = this.randomMoveIdx * this.delatX - this.curMoveDistance;
        }
        if (this.curMoveDistance > this.randomMoveIdx * this.delatX
            && this.curMoveDistance < (this.randomMoveIdx + this.selectMoveIdx) * this.delatX
            && this.curMoveDistance + dx > (this.randomMoveIdx + this.selectMoveIdx) * this.delatX) {
            dx = (this.randomMoveIdx + this.selectMoveIdx) * this.delatX - this.curMoveDistance;
        }
        this.curMoveDistance += dx;
        this.content.children.forEach(node => {
            node.x += dx;
            if (node.x >= this.overX[1]) {
                node.x -= this.content.children.length * this.delatX;
            }
            // if (node.x <= this.overX[0]) {
            // }
        });
        if (this.curMoveDistance >= (this.randomMoveIdx + this.selectMoveIdx) * this.delatX) {
            this.isPlay = false;
            this.curMoveDistance = 0;
            gdk.Timer.once(1000, this, () => {
                this.cb && this.cb(this.bossId);
                this.close();
            })
        }
        else if (this.curMoveDistance >= this.randomMoveIdx * this.delatX) {
            this.state = 2;
        }
        else {
            this.state = 1;
        }
    }

    _updateBoss(list: number[]) {
        this.content.children.forEach((node, idx) => {
            let c = node.getComponent(RandomBossItemCtrl);
            c.updateView(list[idx]);
        });
    }
}
