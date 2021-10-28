import * as vm from '../../../../a/vm';
import ConfigManager from '../../../../common/managers/ConfigManager';
import { Copy_stageCfg } from '../../../../a/config';

export default class TrialInfo {

    _lastStageId: number = 0;

    @vm.mutable
    get lastStageId(): number {
        return this._lastStageId;
    }

    set lastStageId(lastStageId: number) {
        this._lastStageId = lastStageId;
        if (lastStageId == 0) {
            this.nextStage = ConfigManager.getItemByField(Copy_stageCfg, "copy_id", 5);
        } else if (lastStageId > 0) {
            this.nextStage = ConfigManager.getItemByField(Copy_stageCfg, "pre_condition", lastStageId);
            if (!this.nextStage) {
                this.nextStage = ConfigManager.getItemById(Copy_stageCfg, lastStageId);
            }
        }
        this.curSubType = this.nextStage.subtype;
    }

    nextStage: Copy_stageCfg;

    @vm.mutable
    curSubType: number = 20;//当前关卡难度

    @vm.mutable
    bestStageId: number = 0;//历史记录最高关卡

    @vm.mutable
    resetTime: number = 0;//重置时间点

    runAction: boolean = false;//打开界面时播放动作

    buyNum: number = 0;//购买的扫荡次数
    raidsNum: number = 0;//已经扫荡的次数

    enterCopy: boolean = false;

    enterStage: boolean = false;

    rewardBit: number[] = [];
    get isAllStageClear(): boolean {
        return this._lastStageId == this.nextStage.id;
    }

    // get jumpStageId(): number {
    //     let cfg = ConfigManager.getItemById(Copy_stageCfg, this.bestStageId);
    //     return cfg ? cfg.push_condition : 0;
    // }

    //返回通关奖励是否领取
    getStageRewardState(stageId: number): boolean {
        let res = false;
        let id = stageId % 10000;
        let old = this.rewardBit[Math.floor((id - 1) / 8)];
        if ((old & 1 << (id - 1) % 8) >= 1) {
            res = true;
        }
        return res;
    }
    stageLevel(subType: number): string {
        let levels = ["D", "D+", "C", "C+", "B", "B+", "A", "A+", "S", "SS", "SSS"];
        return "<outline color=#AB5000 width=2><i><b>" + levels[subType - 20] + "</b></i></outline>"
    }

    stageName(stageId?: number): string {
        if (stageId) {
            return "当前进度：" + ConfigManager.getItemById(Copy_stageCfg, stageId).des.replace("超时空试炼", "");
        }
        return "当前进度：" + (this.nextStage ? this.nextStage.des.replace("超时空试炼", "") : "");
    }


}