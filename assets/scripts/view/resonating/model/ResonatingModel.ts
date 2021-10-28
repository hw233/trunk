

/** 
 * @Description: 永恒水晶数据模型类
 * @Author: yaozu.hu
 * @Date: 2020-12-23 10:28:06
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-08-20 17:14:24
 */
export default class ResonatingModel {

    //永恒水晶
    minLevel: number = 0;
    Upper: number[] = [];
    Lower: icmsg.ResonatingGrid[] = [];
    UpperHeroInfo: icmsg.HeroInfo[] = []

    //协战联盟
    assistAllianceInfos: { [allianceId: number]: icmsg.AssistAlliance } = {};
    assistViewOpened: boolean = false; //协战联盟or军团界面首次打开
    //军团
    legionLv: number;
    //星级礼包
    allianceMaxStar: number = 0; //同一上阵英雄激活联盟组的最大星级总和
    giftRecords: { [id: number]: icmsg.AssistAllianceGiftRecord } = {} //礼包记录
    giftViewOpened: boolean = false;//每次登陆是否打开过界面

    getHeroInUpList(heroId: number): boolean {
        let res = false;
        for (let i = 0; i < this.Lower.length; i++) {
            if (this.Lower[i].heroId == heroId) {
                res = true;
                break;
            }
        }
        return res
    }


    getInUpperHeroInfo(heroId: number): boolean {
        let res = false;
        this.UpperHeroInfo.forEach(data => {
            if (data.heroId == heroId) {
                res = true;
            }
        })
        return res
    }
}
