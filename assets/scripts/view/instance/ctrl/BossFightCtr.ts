/** 
 * @Description: 探索详情弹窗
 * @Author: jijing.liu  
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2019-07-05 09:39:33
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class BossFightCtr extends cc.Component {

    @property(cc.Node)
    bloodFgNode: cc.Node = null;

    private bloodImgLen: number;
    private monsterHp: number;
    private monsterCurHp: number;

    onDestroy() {

    }

    start() {
        this.bloodImgLen = this.bloodFgNode.width;
        this.resetBossData();
    }

    //从怪物表读取怪物的属性数据
    resetBossData(mosterID: number = 0) {
        //测试数据
        this.monsterHp = 100;
        this.monsterCurHp = this.monsterHp;
        this.bloodFgNode.width = this.bloodImgLen;
    }

    hit(damage: number = 10) {
        if (this.monsterCurHp <= 0) return;
        this.monsterCurHp -= damage;
        this.setHp(this.monsterCurHp);
        this._playHitAnimation();

    }

    setHp(hp: number) {
        this.monsterCurHp = hp;
        this._updateHp();
    }

    _playHitAnimation() {
        let anim: cc.Animation = this.node.getChildByName('role').getComponent(cc.Animation);
        anim.play('hit');
    }

    _updateHp() {
        this.bloodFgNode.width = this.monsterCurHp / this.monsterHp * this.bloodImgLen;
    }


}
