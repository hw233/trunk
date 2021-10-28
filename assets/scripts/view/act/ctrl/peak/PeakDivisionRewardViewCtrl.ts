import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import PeakModel from '../../model/PeakModel';
import RewardItem from '../../../../common/widgets/RewardItem';
import { Peak_divisionCfg, Peak_gradeCfg } from '../../../../a/config';

/** 
 * @Description: 巅峰之战单个段位奖励View
 * @Author: yaozu.hu
 * @Date: 2021-02-01 10:50:41
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-12 16:46:59
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakDivisionRewardCtrl")
export default class PeakDivisionRewardCtrl extends gdk.BasePanel {

    @property(cc.Sprite)
    divisionSp: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(RewardItem)
    heroReward: RewardItem = null;

    get model(): PeakModel { return ModelManager.get(PeakModel); }

    cfg: Peak_divisionCfg;
    info: { cfg: Peak_gradeCfg, divisionCfg: Peak_divisionCfg, num: number, state: number }
    onEnable() {
        let args = gdk.panel.getArgs(PanelId.PeakDivisionRewardView)
        if (args) {
            let temStateInfo = this.model.peakStateInfo
            this.cfg = args[0];

            let graCfg = ConfigManager.getItemByField(Peak_gradeCfg, 'grade', this.cfg.division);
            let state = 0;
            let myPoints = temStateInfo.points;

            if (graCfg.grade > temStateInfo.maxRank) {
                state = 3
            } else {
                //判断是否领取物品奖励
                //temStateInfo.gradeReward
                let old = temStateInfo.gradeReward[Math.floor((graCfg.grade - 1) / 8)];
                if ((old & 1 << (graCfg.grade - 1) % 8) >= 1) {
                    //判断是否领取英雄奖励
                    if (graCfg.hero == '') {
                        state = 0
                    } else {
                        let old = temStateInfo.gradeHero[Math.floor((graCfg.grade - 1) / 8)];
                        if ((old & 1 << (graCfg.grade - 1) % 8) >= 1) {
                            state = 0
                        } else {
                            state = 2
                        }
                    }
                } else {
                    state = 1
                }
            }
            this.info = { cfg: graCfg, divisionCfg: this.cfg, num: myPoints, state: state };

            this.nameLabel.string = this.info.divisionCfg.name;
            GlobalUtil.setSpriteIcon(this.node, this.divisionSp, 'view/act/texture/peak/' + this.info.divisionCfg.icon)
            let listData = []
            this.content.removeAllChildren()
            if (this.info.cfg.rewards != "") {
                for (let i = 0; i < this.info.cfg.rewards.length; i++) {
                    let node = cc.instantiate(this.itemPrefab);
                    let ctrl = node.getComponent(RewardItem);
                    let tem = this.info.cfg.rewards[i];
                    let isGet = false;
                    if (this.info.state == 0 || this.info.state == 2) {
                        isGet = true
                    }
                    let temData = { index: i, typeId: tem[0], num: tem[1], delayShow: false, effct: false, isGet: isGet }
                    ctrl.data = temData;
                    ctrl.updateView();
                    node.setParent(this.content)
                }
            }

            let tem = this.info.cfg.item_icon[0];
            this.heroReward.node.active = this.info.cfg.hero != ''
            if (this.info.cfg.hero != '') {
                let isGet = false;
                if (this.info.state == 0) {
                    isGet = true
                }
                let temData = { index: 0, typeId: tem[0], num: tem[1], delayShow: false, effct: false, isGet: isGet }
                this.heroReward.data = temData;
                this.heroReward.updateView();
            }
        }
    }

}
