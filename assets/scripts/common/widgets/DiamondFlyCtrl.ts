import ButtonSoundId from '../../configs/ids/ButtonSoundId';
import ConfigManager from '../managers/ConfigManager';
import GlobalUtil from '../utils/GlobalUtil';
import RedPointUtils from '../utils/RedPointUtils';
import { Common_red_pointCfg } from '../../a/config';

/**
 * 红点组件
 * @Author: sthoo.huang
 * @Date: 2019-06-26 19:59:16
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-09-11 12:02:29
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/DiamondFlyCtrl")
export default class DiamondFlyCtrl extends cc.Component {

    @property(cc.Prefab)
    diamondPrefab: cc.Prefab = null;

    @property({ tooltip: "生成钻石数量" })
    diamondNum: number = 15

    /**
     * 随机范围(random1~random2之间)
     */
    private random1: number = -200
    private random2: number = 200
    /**
     * 生成到赋予位置的时间
     */
    private createTime: number = 0.1
    /**
     * 停留时间
     */
    private standingTime: number = 0
    /**
     * 金币移动速度
     */
    private speed: number = 1000

    isEnd = true

    onEnable() {

    }

    onDisable() {
        gdk.e.targetOff(this);
    }

    flyAction(flyToPos?) {
        if (!this.isEnd) {
            return
        }
        if (GlobalUtil.isSoundOn) {
            gdk.sound.stop()
            gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.income);
        }


        this.isEnd = false
        let content = gdk.gui.layers.guideLayer
        let tempPlayer = content.convertToNodeSpaceAR(this.node.parent.convertToWorldSpaceAR(cc.v2(this.node.x, this.node.y)))
        let self = this
        for (let i = 0; i < this.diamondNum; i++) {
            let pre = cc.instantiate(this.diamondPrefab)
            pre.parent = content
            pre.setPosition(tempPlayer)
            let rannumx = Math.floor(Math.random() * (this.random2 - this.random1 + 1) + this.random1)
            let rannumy = Math.floor(Math.random() * (this.random2 - this.random1 + 1) / 1.5 + this.random1 / 1.5)
            pre.runAction(cc.moveBy(this.createTime, rannumx, rannumy))
            gdk.Timer.once((this.standingTime + this.createTime) * 1000, this, () => {
                pre.stopAllActions()
                let finshend = cc.callFunc(function () {
                    pre.destroy()
                    if (i == self.diamondNum - 1) {
                        //结束
                        gdk.Timer.once(500, this, () => {
                            self.isEnd = true
                            // callback()
                        })
                    }
                }, this);
                let pos = pre.getPosition()
                let dsz = cc.view.getVisibleSize();
                let endPos = cc.v2(0, dsz.height / 2)
                if (flyToPos) {
                    endPos = flyToPos
                }
                let playTime = 0.5//pos.sub(endPos).mag() / this.speed
                pre.runAction(cc.sequence(cc.moveTo(playTime, endPos.x, endPos.y), finshend))
            });
        }
    }

}