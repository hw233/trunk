import { Royal_globalCfg, Royal_groupCfg, Royal_sceneCfg } from '../../../../a/config';
import ConfigManager from '../../../../common/managers/ConfigManager';
import FightingMath from '../../../../common/utils/FightingMath';
import MathUtil from '../../../../common/utils/MathUtil';
import RandomSkillItemCtrl from './RandomSkillItemCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-27 09:59:11 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/royalArena/fight/RandomSkillViewCtrl")
export default class RandomSkillViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    content: cc.Node = null;

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Label)
    closeLb: cc.Label = null;

    cfg: Royal_sceneCfg;
    bossId: Royal_groupCfg;
    cb: Function;

    delatX: number = 220;
    randomTime: number = 1.5;
    selectTime: number = .5;
    overX: number[] = [-600, 600];
    dirction: number = 1;
    randomMoveIdx: number = 5 * 3;
    selectMoveIdx: number;
    state: number = 1;
    curMoveDistance: number = 0;
    isPlay: boolean = false;


    closeTime: number = 5;
    onEnable() {
        this.closeTime = ConfigManager.getItemByField(Royal_globalCfg, 'key', 'countdown').value[0];
        this.closeLb.node.active = false;
    }

    onDisable() {
        this.isPlay = false;
        this.curMoveDistance = 0;
        this.state = 1;
        this.cb = null;
        this.node.targetOff(this);
    }

    play(cfg: Royal_sceneCfg, cb?: Function) {
        this.cb = cb;
        this.cfg = cfg;
        let bossList = [];
        let temNum = 0;
        let random = [];
        let maxNum = 0;
        let temCfgs = ConfigManager.getItems(Royal_groupCfg, (tem: Royal_groupCfg) => {
            if (tem.group == cfg.group) {
                return true;
            }
            return false;
        })
        temCfgs.forEach(cfg => {
            maxNum += cfg.weight;
            let tem = [temNum, temNum + cfg.weight - 1];
            temNum = temNum + cfg.weight
            random.push(tem);
        })

        let temshowCfgs = temCfgs.concat();

        let rndNum = MathUtil.rnd(0, maxNum);
        let index = 0;
        random.forEach((tem, i) => {
            if (tem[0] < rndNum && rndNum <= tem[1]) {
                index = i
            }
        })
        let showCfgs = [];
        this.bossId = temshowCfgs[index]
        showCfgs.push(temshowCfgs[index]);

        let lenNum = 1;
        temshowCfgs = FightingMath.shuffle(temshowCfgs);
        for (let i = 0, n = temshowCfgs.length; i < n; i++) {
            let temCfg = temshowCfgs[i];
            if (this.bossId.id != temCfg.id && temCfg.weight > 0) {
                showCfgs.push(temCfg);
                if (lenNum >= 5) {
                    break;
                }
                lenNum++;
            }
        }

        bossList = showCfgs;
        let randomList = FightingMath.shuffle(showCfgs);
        if (randomList.length > 5) {
            bossList = randomList.slice(0, 5);
        }
        else {
            bossList = [...randomList, ...FightingMath.shuffle(randomList).slice(0, 5 - randomList.length)];
        }

        //this.bossId = temshowCfgs[index]//bossList[index]; //FightingMath.shuffle(bossList)[0];
        let idx = bossList.indexOf(this.bossId);
        if (idx < 2) {
            this.selectMoveIdx = 2 - idx;
        }
        else if (idx == 2) {
            this.selectMoveIdx = this.content.children.length;
        }
        else {
            this.selectMoveIdx = this.content.children.length - idx + 2;
        }
        this._updateBoss(bossList);
        this.isPlay = true;
        // this.spine.setCompleteListener(() => {
        //     this.spine.setCompleteListener(null);
        //     this.spine.node.active = false;
        // });
        // this.spine.node.active = true;
        // this.spine.setAnimation(0, 'stand2', true);
    }

    showTime: number = 0;
    update(dt: number) {
        if (!this.isPlay && this.closeTime <= 0) return;

        if (this.isPlay) {
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
                this.closeLb.node.active = true;
                this.closeLb.string = `${Math.ceil(this.closeTime)}秒后自动关闭`
                this.showTime = 0
                this.cb && this.cb(this.bossId);
                // gdk.Timer.once(1000, this, () => {
                //     this.cb && this.cb(this.bossId);
                //     // this.close();
                // })
            }
            else if (this.curMoveDistance >= this.randomMoveIdx * this.delatX) {
                this.state = 2;
            }
            else {
                this.state = 1;
            }
        } else {
            this.closeTime -= dt;
            this.showTime += dt;
            if (this.showTime >= 1) {
                this.showTime -= 1
                this.closeLb.string = `${Math.ceil(this.closeTime)}秒后自动关闭`
            }
            if (this.closeTime <= 0) {
                this.close();
            }
        }

    }

    _updateBoss(list: Royal_groupCfg[]) {
        this.content.children.forEach((node, idx) => {
            let c = node.getComponent(RandomSkillItemCtrl);
            c.updateView(list[idx]);
        });
    }

    close() {
        if (this.isPlay) {
            return;
        }
        super.close()
    }
}
