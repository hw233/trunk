import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import PeakModel from '../../model/PeakModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { Peak_divisionCfg, Peak_gradeCfg } from '../../../../a/config';


/** 
 * @Description: 巅峰之战段位信息Item
 * @Author: yaozu.hu
 * @Date: 2021-02-24 12:00:32
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-01 20:47:01
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakDivisionItemCtrl")
export default class PeakDivisionItemCtrl extends UiListItem {

    @property(cc.Sprite)
    divisionSp: cc.Sprite = null;
    @property(cc.Label)
    divisionName: cc.Label = null;
    @property(cc.Node)
    attackBtn: cc.Node = null;
    @property(cc.Node)
    scoreNode: cc.Node = null;
    @property(cc.Label)
    scoreLb: cc.Label = null;
    @property(cc.Label)
    playerNum: cc.Label = null;
    @property(cc.Node)
    boxNode: cc.Node = null;
    @property(sp.Skeleton)
    boxSpine: sp.Skeleton = null;
    @property(cc.Node)
    boxSp: cc.Node = null;
    @property(cc.Node)
    boxredNode: cc.Node = null;
    @property(cc.Node)
    spineNode: cc.Node = null;


    //{cfg:Peak_gradeCfg,divisionCfg:Peak_divisionCfg,stage:number,attackNum:number}
    //当前段位状态 0已超越的段位 1当前段位 2未达到的段位
    state: number = 0;
    cfg: Peak_gradeCfg;
    divisionCfg: Peak_divisionCfg;
    attackNum: number = 1;
    get peakModel() { return ModelManager.get(PeakModel); }

    updateView() {
        this.cfg = this.data.cfg;
        this.state = this.data.state;
        this.divisionCfg = this.data.divisionCfg;
        //this.attackNum = this.data.attackNum;
        this.spineNode.active = this.state == 1;
        this.attackBtn.active = this.state == 1;
        this.scoreNode.active = true;//this.state != 0;
        this.boxNode.active = this.cfg.rewards != ''
        GlobalUtil.setSpriteIcon(this.node, this.divisionSp, 'view/act/texture/peak/' + this.divisionCfg.icon)
        this.divisionName.string = this.divisionCfg.name;

        let nextCfg = ConfigManager.getItemByField(Peak_divisionCfg, 'division', this.divisionCfg.division + 1);
        if (nextCfg) {
            this.scoreLb.string = this.divisionCfg.point + '~' + (nextCfg.point - 1)
        } else {
            this.scoreLb.string = this.divisionCfg.point + '以上'
        }
        this.playerNum.string = this.peakModel.peakStateInfo.rankNumber[this.divisionCfg.division - 1] + ''
        //判断当前段位
        this.refreshData()

        gdk.e.on(ActivityEventId.ACTIVITY_PEAK_RANK_REWARD_UPDATE, this.refreshData, this)

    }

    refreshData() {
        let temStateInfo = this.peakModel.peakStateInfo
        let animStr = ''
        let state: 0 | 1 = 0
        if (this.peakModel.peakStateInfo.maxRank >= this.cfg.grade) {

            //判断是否领取物品奖励

            let old = temStateInfo.gradeReward[Math.floor((this.cfg.grade - 1) / 8)];
            if ((old & 1 << (this.cfg.grade - 1) % 8) >= 1) {
                //判断是否领取英雄奖励
                if (this.cfg.hero == '') {
                    state = 1
                } else {
                    let old = temStateInfo.gradeHero[Math.floor((this.cfg.grade - 1) / 8)];
                    if ((old & 1 << (this.cfg.grade - 1) % 8) >= 1) {
                        state = 1
                    }
                }
            }
            this.boxredNode.active = state != 1;
            // GlobalUtil.setAllNodeGray(this.boxNode, state)
            if (state != 1) {
                animStr = 'stand';
            }
        } else {
            this.boxredNode.active = false;

        }
        this.boxSpine.node.active = animStr != ''
        this.boxSp.active = animStr == ''
        if (animStr != '') {
            this.boxSpine.setAnimation(0, animStr, true);
        }
        GlobalUtil.setAllNodeGray(this.boxNode, state)
    }

    onDisable() {
        gdk.e.off(ActivityEventId.ACTIVITY_PEAK_RANK_REWARD_UPDATE, this.refreshData, this)
    }

    boxBtnClick() {
        //打开段位奖励领取界面
        gdk.panel.setArgs(PanelId.PeakRankRewardView, this.divisionCfg);
        gdk.panel.open(PanelId.PeakRankRewardView);
    }

    attackBtnClick() {
        let temStateInfo = this.peakModel.peakStateInfo
        this.attackNum = this.peakModel.freeNum + temStateInfo.buyEnterTimes - temStateInfo.enterTimes
        if (this.attackNum > 0) {
            gdk.panel.open(PanelId.PeakSearchView);
        } else {
            gdk.gui.showMessage(gdk.i18n.t('i18n:PEAK_TIP4'))
        }
    }

}
