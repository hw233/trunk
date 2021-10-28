import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import HeroUtils from '../../utils/HeroUtils';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import ResonatingModel from '../../../view/resonating/model/ResonatingModel';
import { RedPointEvent } from '../../utils/RedPointUtils';
import { ResonatingEventId } from '../../../view/resonating/enum/ResonatingEventId';
/** 
 * @Description: 共鸣水晶协议
 * @Author: yaozu.hu
 * @Date: 2020-12-23 10:28:06
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-04-15 10:22:51
 */
export default class ResonatingControll extends BaseController {

    model: ResonatingModel = null
    get gdkEvents(): GdkEventArray[] {
        return [];
    }

    get netEvents(): NetEventArray[] {
        return [
            //[icmsg.ChampionRankingRsp.MsgType, this._onChampionRankingRsp, this],
            [icmsg.ResonatingStateRsp.MsgType, this._onResonatingStateRsp, this],
            [icmsg.AssistAllianceStateRsp.MsgType, this._onAssistAllianceStateRsp, this],
            [icmsg.AssistAllianceOnRsp.MsgType, this._onAssistAllianceOnRsp, this],
            [icmsg.AssistAllianceLegionRsp.MsgType, this._onAssistAllianceLegionRsp, this],
            [icmsg.AssistAllianceGiftRecordRsp.MsgType, this._onAssistAllianceGiftRecordRsp, this],
            [icmsg.AssistAllianceGiftRsp.MsgType, this._onAssistAllianceGiftRsp, this],
            [icmsg.AssistAllianceActivateRsp.MsgType, this._onAssistAllianceActivateRsp, this],
        ];
    }

    onStart() {
        this.model = ModelManager.get(ResonatingModel)
    }

    onEnd() {
        this.model = null
    }

    _onResonatingStateRsp(resp: icmsg.ResonatingStateRsp) {
        this.model.Upper = resp.upper;
        this.model.Lower = resp.lower;

        if (this.model.minLevel != 0) {
            //NetManager.send(new icmsg.HeroListReq());
            let heroIDs = []
            resp.lower.forEach(data => {
                if (data.heroId > 0) {
                    heroIDs.push(data.heroId);
                }
            })
            let msg1 = new icmsg.HeroInfoReq()
            msg1.heroIds = resp.upper;
            NetManager.send(msg1, (rsp: icmsg.HeroInfoRsp) => {
                let temMinLv = 0
                rsp.list.forEach(data => {
                    if (temMinLv == 0 || data.level < temMinLv) {
                        temMinLv = data.level;
                    }
                })
                let temHero = rsp.list;
                if (temHero.length > 1) {
                    temHero.sort(this.sortFunc1);
                }
                this.model.UpperHeroInfo = temHero;
                this.model.minLevel = temMinLv;
            });
            let msg2 = new icmsg.HeroInfoReq()
            msg2.heroIds = heroIDs;
            NetManager.send(msg2);
        } else {
            let temHero: icmsg.HeroInfo[] = []
            this.model.Upper.forEach(data => {
                let heroInfo: icmsg.HeroInfo = HeroUtils.getHeroInfoByHeroId(data);
                if (heroInfo) {
                    temHero.push(heroInfo);
                }
            })

            if (temHero.length > 1) {
                temHero.sort(this.sortFunc1);
            }
            this.model.UpperHeroInfo = temHero;
            let temMinLv = 0
            if (temHero.length > 0) {
                temMinLv = temHero[temHero.length - 1].level;
            }
            this.model.minLevel = temMinLv;
        }
        gdk.e.emit(ResonatingEventId.RESONATINGSTATE_UPDATA);
    }

    sortFunc1(a: any, b: any) {
        let heroInfoA = a//<icmsg.HeroInfo>a.extInfo;
        let heroInfoB = b//<icmsg.HeroInfo>b.extInfo;
        if (heroInfoA.level == heroInfoB.level) {
            if (heroInfoA.color == heroInfoB.color) {
                if (heroInfoA.star == heroInfoB.star) {
                    if (heroInfoA.power == heroInfoB.power) {
                        return heroInfoB.level - heroInfoA.level;
                    }
                    else {
                        return heroInfoB.power - heroInfoA.power;
                    }
                } else {
                    return heroInfoB.star - heroInfoA.star;
                }
            } else {
                return heroInfoB.color - heroInfoA.color;
            }
        } else {
            return heroInfoB.level - heroInfoA.level;
        }

    }

    /**协战联盟 状态 */
    _onAssistAllianceStateRsp(resp: icmsg.AssistAllianceStateRsp) {
        this.model.legionLv = resp.legionLevel;
        this.model.assistAllianceInfos = {};
        resp.assistAlliances.forEach(l => {
            this.model.assistAllianceInfos[l.allianceId] = l;
        });
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        gdk.e.emit(ResonatingEventId.ASSIST_ALLIANCE_INFO_PUSH);
    }

    /**协战联盟 上下阵 */
    _onAssistAllianceOnRsp(resp: icmsg.AssistAllianceOnRsp) {
        this.model.assistAllianceInfos[resp.assistAlliance.allianceId] = resp.assistAlliance
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        gdk.e.emit(ResonatingEventId.ASSIST_ALLIANCE_INFO_PUSH, { allianceId: resp.assistAlliance.allianceId, showAni: false });
    }

    /**军团升级 */
    _onAssistAllianceLegionRsp(resp: icmsg.AssistAllianceLegionRsp) {
        this.model.legionLv = resp.legionLevel;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**协战联盟礼包记录 */
    _onAssistAllianceGiftRecordRsp(resp: icmsg.AssistAllianceGiftRecordRsp) {
        this.model.allianceMaxStar = resp.maxStar;
        this.model.giftRecords = {};
        resp.giftRecords.forEach(r => {
            this.model.giftRecords[r.giftId] = r;
        })
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**协战联盟礼包领取 */
    _onAssistAllianceGiftRsp(resp: icmsg.AssistAllianceGiftRsp) {
        resp.giftRecords.forEach(r => {
            this.model.giftRecords[r.giftId] = r;
        })
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    /**协战联盟-手动激活 */
    _onAssistAllianceActivateRsp(resp: icmsg.AssistAllianceActivateRsp) {
        this.model.assistAllianceInfos[resp.assistAlliance.allianceId] = resp.assistAlliance
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        gdk.e.emit(ResonatingEventId.ASSIST_ALLIANCE_INFO_PUSH, { allianceId: resp.assistAlliance.allianceId, showAni: true });
    }
}
