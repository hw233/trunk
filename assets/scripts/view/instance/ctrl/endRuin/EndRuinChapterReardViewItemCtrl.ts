import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel, { CopyEventId } from '../../../../common/models/CopyModel';
import CopyUtil from '../../../../common/utils/CopyUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import StringUtils from '../../../../common/utils/StringUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Copy_ruin_rewardCfg, Copy_stageCfg } from '../../../../a/config';

/** 
 * @Description: 末日废墟每日奖励Item
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-01-28 13:49:00
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/endruin/EndRuinChapterReardViewItemCtrl")
export default class EndRuinChapterReardViewItemCtrl extends UiListItem {
    [x: string]: any;

    @property(cc.Label)
    chapterName: cc.Label = null;

    @property(cc.Node)
    goBtn: cc.Node = null;
    @property(cc.Node)
    overNode: cc.Node = null;
    @property(cc.Node)
    jinduMask: cc.Node = null;
    @property(cc.Label)
    starLb: cc.Label = null;
    @property(cc.Node)
    bgMask: cc.Node = null;
    @property(cc.Node)
    red: cc.Node = null;

    state: number = 1; //1 未完全通关 2完全通关
    chapterId: number = 0;
    get model(): CopyModel { return ModelManager.get(CopyModel); }

    curStarNum: number;
    maxStarNum: number
    maxWidth: number = 180;

    onEnable() {
        gdk.e.on(CopyEventId.UPDATE_COPY_ENDRUIN_STAR_REWARD, this.refreshRed, this);
    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    updateView() {
        this.chapterId = this.data.chapterId;
        let temCfg = ConfigManager.getItemByField(Copy_stageCfg, 'copy_id', 20, { prize: this.chapterId })
        let names = temCfg.des.split('-');
        this.chapterName.string = StringUtils.format(gdk.i18n.t("i18n:ENDRUIN_TIP5"), this.chapterId, names[names.length - 2])
        //this.curStarNum = this.data.curStarNum
        let temStarNum = CopyUtil.getEndRuinChapterAllStarNum(this.chapterId)
        this.curStarNum = temStarNum[0]
        this.maxStarNum = temStarNum[1]
        this.state = this.curStarNum == this.maxStarNum ? 2 : 1;
        this.starLb.string = this.curStarNum + '/' + this.maxStarNum;
        this.jinduMask.width = Math.floor(this.curStarNum / this.maxStarNum * this.maxWidth);
        this.goBtn.active = this.state != 2;
        this.overNode.active = this.state == 2;
        this.bgMask.active = false//this.state == 2;
        this.refreshRed();

    }

    refreshRed() {
        let haveReward = false
        let cfgs = ConfigManager.getItems(Copy_ruin_rewardCfg, { chapter: this.chapterId });
        cfgs.forEach(cfg => {
            if (this.curStarNum >= cfg.star && !CopyUtil.getEndRuinChapterStarRewardState(this.chapterId, cfg.star)) {
                haveReward = true;
            }
        })
        this.red.active = haveReward;
    }

    rewardBtnClick() {
        // if (this.state != 2) {

        // }
        //打开当前章节的星星奖励列表
        gdk.panel.setArgs(PanelId.EndRuinStarRewardView, this.chapterId, this.curStarNum);
        gdk.panel.open(PanelId.EndRuinStarRewardView)
    }

    goBtnClick() {
        gdk.e.emit(CopyEventId.CHANGE_COPY_ENDRUIN_CHAPTER, this.chapterId);
    }

}
