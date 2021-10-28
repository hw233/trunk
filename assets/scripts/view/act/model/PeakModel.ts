import ConfigManager from '../../../common/managers/ConfigManager';
import { Peak_globalCfg, Peak_mainCfg } from '../../../a/config';

/** 
 * @Description: 巅峰之战model
 * @Author: yaozu.hu
 * @Date: 2021-02-23 10:37:28
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-02 12:02:56
 */
export default class PeakModel {

    peakStateInfo: icmsg.PeakStateRsp;
    PeakMatchData: icmsg.PeakMatchingRsp;

    selectHeros: { data: icmsg.PeakHero }[] = [];

    arenaHeroList: icmsg.FightHero[] = [];
    arenaGeneral: icmsg.FightGeneral;

    //巅峰之战塔位记录
    //peakCopyUpHeroList: any = {};

    reward_type: number = 1;

    _freeNum: number = -1;

    //英雄转换选中的英雄
    changeHeroSelectId: number = -1;
    randomData: icmsg.PeakHeroDisplaceRsp = null;

    bookSelectCareerId: number = 0;

    get freeNum() {
        if (this._freeNum < 0) {
            this._freeNum = ConfigManager.getItemByField(Peak_globalCfg, 'key', 'free_challenge').value[0];
        }
        return this._freeNum;
    }
    _maxBuyNum: number = -1;
    get maxBuyNum() {
        if (this._maxBuyNum < 0) {
            let mainCfg = ConfigManager.getItemByField(Peak_mainCfg, 'reward_type', this.reward_type);
            let len = mainCfg.challenge_times.length
            this._maxBuyNum = mainCfg.challenge_times[len - 1][0]
        }
        return this._maxBuyNum;
    }

    _freeChangeNum: number = -1;
    get freeChangeNum() {
        if (this._freeChangeNum < 0) {
            this._freeChangeNum = ConfigManager.getItemByField(Peak_globalCfg, 'key', 'free_conversion').value[0];
        }
        return this._freeChangeNum;
    }
    _maxChangeNum: number = -1;
    get maxChangeNum() {
        if (this._maxChangeNum < 0) {
            let mainCfg = ConfigManager.getItemByField(Peak_mainCfg, 'reward_type', this.reward_type);
            let len = mainCfg.conversion_times.length
            this._maxChangeNum = mainCfg.conversion_times[len - 1][0]
        }
        return this._maxChangeNum;
    }

    _starNum: number = -1;
    get starNum() {
        if (this._starNum < 0) {
            this._starNum = ConfigManager.getItemByField(Peak_globalCfg, 'key', 'star_level').value[0];
        }
        return this._starNum;
    }
    _levelNum: number = -1;
    get levelNum() {
        if (this._levelNum < 0) {
            this._levelNum = ConfigManager.getItemByField(Peak_globalCfg, 'key', 'star_level').value[1];
        }
        return this._levelNum;
    }

}
