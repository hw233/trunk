import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ModelManager from '../ModelManager';
import PiecesModel from '../../models/PiecesModel';
import RoleModel from '../../models/RoleModel';
import { PiecesEventId } from '../../../view/pieces/enum/PiecesEventId';
import { RedPointEvent } from '../../utils/RedPointUtils';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-17 17:35:17 
  */
export default class PiecesController extends BaseController {
    get gdkEvents(): GdkEventArray[] {
        return []
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.PiecesInfoRsp.MsgType, this._onPiecesInfoRsp, this],
            [icmsg.PiecesGainDivisionRewardRsp.MsgType, this._onPiecesGainDivisionRewardRsp, this],
            [icmsg.PiecesLightUpTalentRsp.MsgType, this._onPiecesLightUpTalentRsp, this],
            [icmsg.PiecesHeroListRsp.MsgType, this._onPiecesHeroListRsp, this],
            [icmsg.PiecesHeroUpdateRsp.MsgType, this._onPiecesHeroUpdateRsp, this],
            [icmsg.PiecesHeroOnBattleRsp.MsgType, this._onPiecesHeroOnBattleRsp, this],
            [icmsg.PiecesBuyHeroPanelRsp.MsgType, this._onPiecesBuyHeroPanelRsp, this],
            [icmsg.PiecesRefreshBuyHeroPanelRsp.MsgType, this._onPiecesRefreshBuyHeroPanelRsp, this],
            [icmsg.PiecesBuyHeroRsp.MsgType, this._onPiecesBuyHeroRsp, this],
            [icmsg.PiecesLockBuyHeroPanelRsp.MsgType, this._onPiecesLockBuyHeroPanelRsp, this],
            [icmsg.PiecesRoundEndRsp.MsgType, this._onPiecesRoundRsp, this],
            [icmsg.PiecesExitRsp.MsgType, this._onPiecesExitRsp, this],
            [icmsg.PiecesSellHeroRsp.MsgType, this._onPiecesSellHeroRsp, this],
            [icmsg.PiecesBuyTimeRsp.MsgType, this._onPiecesBuyTimeRsp, this],
            [icmsg.PiecesHeroChangeLineRsp.MsgType, this._onPiecesHeroChangeLineRsp, this],
            [icmsg.PiecesUpgradeChessBoardRsp.MsgType, this._onPiecesUpgradeChessBoardRsp, this],
        ];
    }

    model: PiecesModel = null
    onStart() {
        this.model = ModelManager.get(PiecesModel)
    }

    onEnd() {
        this.model = null
    }

    //末日自走棋 基础信息
    _onPiecesInfoRsp(resp: icmsg.PiecesInfoRsp) {
        this.model.restChallengeTimes = resp.restChallengeTimes;
        this.model.restBuyTimes = resp.restBuyTimes;
        this.model.score = resp.score;
        this.model.talentPoint = resp.talentPoint;
        this.model.divisionRewardMap = {};
        this.model.talentMap = {};
        this.model.divisionRewardMap = this._finalCheckRewards(resp.gainRankAward, this.model.divisionRewardMap);
        this.model.talentMap = this._finalCheckRewards(resp.talentList, this.model.talentMap);
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    //领取段位奖励
    _onPiecesGainDivisionRewardRsp(resp: icmsg.PiecesGainDivisionRewardRsp) {
        this.model.divisionRewardMap[resp.rank] = 1;
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
    }

    //点亮天赋
    _onPiecesLightUpTalentRsp(resp: icmsg.PiecesLightUpTalentRsp) {
        this.model.talentPoint = resp.talentPoint;
        if (resp.talentId == 0) this.model.talentMap = {};
        else {
            this.model.talentMap[resp.talentId] = 1;
        }
    }

    //英雄列表
    _onPiecesHeroListRsp(resp: icmsg.PiecesHeroListRsp) {
        this.model.heroMap = {};
        resp.list.forEach(l => {
            if (l.heroId) {
                this.model.heroMap[l.heroId] = l;
            }
        });
    }

    //英雄更新 (买卖升星)
    _onPiecesHeroUpdateRsp(resp: icmsg.PiecesHeroUpdateRsp) {
        if (resp.updateHero && resp.updateHero.heroId) {
            let b = !this.model.heroMap[resp.updateHero.heroId];
            this.model.heroMap[resp.updateHero.heroId] = resp.updateHero;
            if (!b) {
                //升星
                gdk.e.emit(PiecesEventId.PIECES_PVP_HERO_UP_STAR, [1, ModelManager.get(RoleModel).name, resp.updateHero]);
            }
        }

        resp.delHeroId.forEach(l => {
            delete this.model.heroMap[l];
            gdk.e.emit(PiecesEventId.PIECES_PVP_REMOVE_HERO, l);
        });

        gdk.e.emit(PiecesEventId.PIECES_HAND_CARD_UPDATE);
    }

    //英雄上下阵
    _onPiecesHeroOnBattleRsp(resp: icmsg.PiecesHeroOnBattleRsp) {
        resp.changeList.forEach(l => {
            if (l.heroId) {
                let old = JSON.parse(JSON.stringify(this.model.heroMap[l.heroId]));
                this.model.heroMap[l.heroId] = l;
                gdk.e.emit(PiecesEventId.PIECES_PVP_HERO_ON_BATTLE, { old: old, new: l });
            }
        });
        gdk.e.emit(PiecesEventId.PIECES_HAND_CARD_UPDATE);
    }

    /**英雄转换路线 */
    _onPiecesHeroChangeLineRsp(resp: icmsg.PiecesHeroChangeLineRsp) {
        resp.hero.forEach(l => {
            if (l.heroId) {
                this.model.heroMap[l.heroId] = l;
            }
        });
        gdk.e.emit(PiecesEventId.PIECES_PVP_CAREER_CHANGE, resp.hero[0].typeId);
    }

    /**英雄购买界面 */
    _onPiecesBuyHeroPanelRsp(resp: icmsg.PiecesBuyHeroPanelRsp) {
        this.model.refreshHeroList = resp.list;
        this.model.refreshIsLock = resp.isLock;
        this.model.silver = resp.silver;
    }

    /**刷新英雄购买列表 */
    _onPiecesRefreshBuyHeroPanelRsp(resp: icmsg.PiecesRefreshBuyHeroPanelRsp) {
        this.model.refreshHeroList = resp.list;
        this.model.silver = resp.silver;
    }

    /**购买英雄 */
    _onPiecesBuyHeroRsp(resp: icmsg.PiecesBuyHeroRsp) {
        this.model.refreshHeroList[resp.pos] = 0;
        this.model.silver = resp.silver;
    }

    /**解锁购买英雄列表 */
    _onPiecesLockBuyHeroPanelRsp(resp: icmsg.PiecesLockBuyHeroPanelRsp) {
        this.model.refreshIsLock = resp.isLook;
    }

    /**英雄卖出 */
    _onPiecesSellHeroRsp(resp: icmsg.PiecesSellHeroRsp) {
        this.model.silver = resp.silver;
    }

    /**升级棋盘 */
    _onPiecesUpgradeChessBoardRsp(resp: icmsg.PiecesUpgradeChessBoardRsp) {
        this.model.silver = resp.silver;
        if (resp.boardLv !== this.model.chessLv) {
            this.model.chessLv = resp.boardLv;
            gdk.gui.showMessage('升级成功,英雄抽取概率已提升');
        }
        this.model.chessExp = resp.boardExp;
    }

    /**自走棋次数购买 */
    _onPiecesBuyTimeRsp(resp: icmsg.PiecesBuyTimeRsp) {
        gdk.gui.showMessage('购买成功');
        this.model.restBuyTimes = resp.restBuyTimes;
        this.model.restChallengeTimes += 1;
    }

    /**波次结束 */
    _onPiecesRoundRsp(resp: icmsg.PiecesRoundEndRsp) {
        this.model.addScore += resp.divisionPoint;
        this.model.score += resp.divisionPoint;
        this.model.silver = resp.silver;
        if (this.model.chessLv !== resp.boardLv) {
            this.model.chessLv = resp.boardLv;
        }
        this.model.chessExp = resp.boardExp;
    }

    /**退出战斗 */
    _onPiecesExitRsp(resp: icmsg.PiecesExitRsp) {
        // this.model.talentPoint = resp.talentPoint;
        this.model.score = resp.score;
    }

    _finalCheckRewards(intReward: number[], rewardIds) {
        let idsArray = [];
        for (let i = 0; i < intReward.length; i += 2) {
            idsArray.push([intReward[i], intReward[i + 1]]);
        }
        idsArray.forEach(ids => {
            let minId = ids[0];
            let maxId = ids[1];
            while (minId <= maxId) {
                rewardIds[minId] = 1;
                minId += 1;
            }
        });
        return rewardIds;
    }
}
