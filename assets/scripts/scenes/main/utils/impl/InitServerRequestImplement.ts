import LoginFsmEventId from '../../enum/LoginFsmEventId';
import LoginUtils from '../LoginUtils';
import NetManager from '../../../../common/managers/NetManager';

/** 
 * 进入游戏前初始化请求
 * @Author: sthoo.huang  
 * @Date: 2021-04-01 17:54:56 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-14 15:18:52
 */
export default class InitServerRequestImplement {

    fsm: gdk.fsm.FsmStateAction;

    onEnter(): void {

        // 上线前等待返回后才能进入游戏
        let needRspArr: { new() }[] = [
            icmsg.SignInfoReq,
            icmsg.ItemListReq,
            icmsg.EquipListReq,
            icmsg.HeroListReq,
            icmsg.MissionListReq,
            icmsg.GuideGroupListReq,
            icmsg.DungeonListReq,
            icmsg.DungeonChapterListReq,
            icmsg.GeneralInfoReq,
            icmsg.GeneralWeaponInfoReq,
            icmsg.FootholdRoleInfoReq,
        ];

        // 进入游戏前发送请求，但不必等待返回
        let preReqArr: { new() }[] = [
            icmsg.MissionOnlineInfoReq,
            icmsg.MissionGrowListReq,
            icmsg.MissionWelfareListReq,
            icmsg.PassListReq,
            icmsg.MailListReq,
            icmsg.ActivityAssembledInfoReq,
            icmsg.SurvivalStateReq,
            icmsg.FriendListReq,
            icmsg.FriendBlacklistReq,
            icmsg.StoreBlackMarketListReq,
            icmsg.StoreListReq,
            icmsg.PayFirstListReq,
            icmsg.LuckyNumberReq,
            icmsg.MasteryStageIdListReq,
            icmsg.MonthCardListReq,
            icmsg.ActivityRankingInfoReq,
            // icmsg.FootholdRoleInfoReq,
            icmsg.DungeonElitesReq,
            icmsg.StorePushListReq,
            icmsg.StorePushEventsReq,
            icmsg.RoleCookieGetReq,
            icmsg.JusticeStateReq,
            icmsg.TavernInfoReq,
            icmsg.StoreMiscGiftPowerAwardReq,
            icmsg.StoreGiftListReq,
            icmsg.MercenaryLentReq,
            icmsg.MercenaryBorrowedReq,
            icmsg.Store7daysBoughtReq,
            icmsg.GrowthfundListReq,
            icmsg.TowerfundListReq,
            icmsg.MissionWelfare2ListReq,
            icmsg.ActivityTopUpListReq,
            icmsg.ActivityCumloginListReq,
            icmsg.ActivityCaveStateReq,
            icmsg.DoomsDayListReq,
            icmsg.BarrackLevelsReq,
            icmsg.MonthCardQuickCombatInfoReq,
            icmsg.BattleArrayQueryReq,
            icmsg.ActivityAlchemyTimesReq,
            icmsg.PassFundListReq,
            icmsg.MartialSoulStateReq,
            icmsg.RoleVipBoughtFlagReq,
            icmsg.ExcitingActivityStateReq,
            icmsg.PayDailyFirstInfoReq,
            icmsg.DungeonHeroSweepTimesReq,
            icmsg.RuneListReq,
            icmsg.DungeonRuneInfoReq,
            icmsg.MissionWeaponListReq,
            icmsg.StoreRuneListReq,
            icmsg.FlipCardInfoReq,
            icmsg.DrawEggInfoReq,
            icmsg.DungeonOrdealInfoReq,
            icmsg.GeneDrawHistoryReq,
            icmsg.AdventurePassListReq,
            icmsg.LuckyDrawSummonStateReq,
            icmsg.RoleRenameNumReq,
            icmsg.MissionDailyRoundIdReq,
            icmsg.ResonatingStateReq,
            icmsg.CostumeListReq,
            icmsg.SystemRedPointListReq,
            icmsg.TimeLimitGiftReq,
            icmsg.CarnivalPlayerServerRankReq,
            icmsg.CarnivalInfoReq,
            icmsg.GeneralWeaponUpgradeInfoReq,
            icmsg.RuinStateReq,
            icmsg.SiegeStateReq,
            icmsg.EnergyStationInfoReq,
            icmsg.ActivityLandGiftInfoReq,
            icmsg.ActivityNewTopUpListReq,
            icmsg.RelicCertStateReq,
            icmsg.SoldierSkinStateReq,
            icmsg.CrossTreasureStateReq,
            icmsg.GuardianCopyStateReq,
            icmsg.GuardianDrawStateReq,
            icmsg.GuardianListReq,
            icmsg.PassWeeklyListReq,
            icmsg.AssistAllianceStateReq,
            icmsg.TwistEggStateReq,
            icmsg.AssistAllianceGiftRecordReq,
            icmsg.GuardianEquipListReq,
            icmsg.GuardianTowerStateReq,
            icmsg.ActivityGuardianDrawInfoReq,
            icmsg.MergeCarnivalStoreReq,
            icmsg.MergeCarnivalStateReq,
            icmsg.MissionComboInfoReq,
            icmsg.MergeCarnivalCurServerRankReq,
            icmsg.ActivityCaveAdventureInfoReq,
            icmsg.WorldEnvelopeIdReq,
            icmsg.Adventure2PassListReq,
            icmsg.PiecesInfoReq,
            icmsg.ActivityAwakeGiftInfoReq,
            icmsg.ExpeditionMissionStateReq,
            icmsg.ExpeditionArmyStateReq,
            icmsg.PlatformMissionListReq,
            icmsg.SoldierTechListReq,
            icmsg.SoldierTechResearchListReq,
            icmsg.EnergizeStateReq,
            icmsg.CostumeCustomStateReq,
            icmsg.ActivityDiscountStateReq,
            icmsg.ActivitySailingInfoReq,
            icmsg.ActivityHotelStateReq,
            icmsg.ActivityTimeGiftInfoReq,
            icmsg.DungeonUltimateStateReq,
            icmsg.ActivityMysteriousInfoReq,
            icmsg.UniqueEquipListReq,
            icmsg.RoyalInfoReq,
            icmsg.DungeonSevenDayStateReq,
            icmsg.ActivitySuperValueInfoReq,
        ];
        // 超时处理
        gdk.Timer.once(3 * 60 * 1000, this, () => {
            if (!this.fsm) return;
            if (!this.fsm.active) return;
            this.fsm.sendEvent(LoginFsmEventId.CONN_BREAK);
        });
        // 出现错误
        NetManager.once(icmsg.SystemErrorRsp.MsgType, () => {
            if (!this.fsm) return;
            if (!this.fsm.active) return;
            this.fsm.sendEvent(LoginFsmEventId.CONN_BREAK);
        }, this);
        // 发送请求
        LoginUtils.sendReqList(needRspArr, () => {
            if (!this.fsm) return;
            if (!this.fsm.active) return;
            gdk.Timer.clearAll(this);
            NetManager.targetOff(this);
            LoginUtils.sendReqList(preReqArr, null, null, true);
            // 发送订阅请求
            iclib.MobPushUtil.getRegistrationID((seqId: number, regId: string) => {
                let rmsg = new icmsg.SystemReadyReq();
                rmsg.mobPushRid = regId || '';
                NetManager.send(rmsg);
            });
            this.fsm.finish();
        }, this, true);
    }

    onExit(): void {
        gdk.Timer.clearAll(this);
        NetManager.targetOff(this);
        this.fsm = null;
    }
}