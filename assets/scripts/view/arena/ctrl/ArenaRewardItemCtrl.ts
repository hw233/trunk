import GlobalUtil from '../../../common/utils/GlobalUtil';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Arena_point_awardCfg } from '../../../a/config';

/** 
 * @Description: 竞技场子项
 * @Author: jijing.liu  
 * @Date: 2019-04-18 13:44:33
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-05-19 17:01:51
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/arena/ArenaRewardItemCtrl")
export default class ArenaRewardItemCtrl extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    rankIcon: cc.Node = null;

    @property(cc.Label)
    rankLab: cc.Label = null;

    @property(cc.Node)
    rewardCtn: cc.Node = null;

    @property(cc.Prefab)
    rewardIconPrefab: cc.Prefab = null;

    rankSpriteName: string[] = [
        'common/texture/main/gh_gxbhuizhang01',
        'common/texture/main/gh_gxbhuizhang02',
        'common/texture/main/gh_gxbhuizhang03',
    ];

    updateView(data) {
        let d: Arena_point_awardCfg = data;
        if (d.paiming.length == 1) {
            this.rankIcon.active = true
            this.rankLab.node.active = false
            GlobalUtil.setSpriteIcon(this.node, this.rankIcon, this.rankSpriteName[d.paiming[0] - 1])
        } else {
            this.rankIcon.active = false
            this.rankLab.node.active = true
            this.rankLab.string = `${d.paiming[0]}-${d.paiming[1]}`
        }
        this.rewardCtn.destroyAllChildren();
        d.award_1 && cc.js.isNumber(d.award_1[0]) && this.addReward(d.award_1[0], d.award_1[1]);
        //d.award_2 && cc.js.isNumber(d.award_2[0]) && this.addReward(d.award_2[0], d.award_2[1]);

        if (d.id % 2 == 0) {
            this.bg.opacity = 255;
        } else {
            this.bg.opacity = 102;
        }
    }

    addReward(id: number, num: number) {
        let n: cc.Node = cc.instantiate(this.rewardIconPrefab);
        n.scaleX = 0.7;
        n.scaleY = 0.7;
        this.rewardCtn.addChild(n);
        let uislot: UiSlotItem = n.getComponent(UiSlotItem);
        uislot.updateItemInfo(id, num);
    }

    battle() {

    }

}
