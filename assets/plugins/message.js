"use strict";
(function e() {
	const o = window.icmsg = window.icmsg || {};
	o.datetime = "2021-10-18 11:30:03";

	// 定义导出对象
	const t = o.MessageType = {
		MsgTypeActivityAlchemyFetch: 2814,
		MsgTypeActivityAlchemyTimes: 2813,
		MsgTypeActivityAssembledGain: 2836,
		MsgTypeActivityAssembledInfo: 2835,
		MsgTypeActivityAwakeGiftGain: 2831,
		MsgTypeActivityAwakeGiftInfo: 2829,
		MsgTypeActivityAwakeGiftSet: 2830,
		MsgTypeActivityCaveAdventureGainBox: 2828,
		MsgTypeActivityCaveAdventureInfo: 2826,
		MsgTypeActivityCaveAdventureMove: 2827,
		MsgTypeActivityCaveBuyTeam: 3510,
		MsgTypeActivityCaveEndExplore: 3508,
		MsgTypeActivityCaveEnter: 3502,
		MsgTypeActivityCaveExchange: 3509,
		MsgTypeActivityCaveExit: 3503,
		MsgTypeActivityCaveExploreColor: 3506,
		MsgTypeActivityCaveGift: 3504,
		MsgTypeActivityCaveGiftBack: 3513,
		MsgTypeActivityCavePassAward: 3512,
		MsgTypeActivityCavePassList: 3511,
		MsgTypeActivityCaveResetGift: 3505,
		MsgTypeActivityCaveStartExplore: 3507,
		MsgTypeActivityCaveState: 3501,
		MsgTypeActivityCumloginAward: 2804,
		MsgTypeActivityCumloginList: 2803,
		MsgTypeActivityDiscount: 2833,
		MsgTypeActivityDiscountBuy: 2834,
		MsgTypeActivityDiscountState: 2832,
		MsgTypeActivityExtraRemain: 2815,
		MsgTypeActivityFlipCardsAward: 2808,
		MsgTypeActivityFlipCardsInfo: 2810,
		MsgTypeActivityFlipCardsList: 2807,
		MsgTypeActivityGuardianDrawAward: 2825,
		MsgTypeActivityGuardianDrawInfo: 2824,
		MsgTypeActivityHotelClean: 2842,
		MsgTypeActivityHotelFree: 2843,
		MsgTypeActivityHotelState: 2841,
		MsgTypeActivityLandGiftAward: 2823,
		MsgTypeActivityLandGiftInfo: 2822,
		MsgTypeActivityLuckyFlipCardsAward: 2809,
		MsgTypeActivityMysteriousGain: 2847,
		MsgTypeActivityMysteriousInfo: 2846,
		MsgTypeActivityNewTopUpAward: 2819,
		MsgTypeActivityNewTopUpList: 2818,
		MsgTypeActivityRankingInfo: 2801,
		MsgTypeActivityRankingReward: 2802,
		MsgTypeActivitySailingCharge: 2838,
		MsgTypeActivitySailingFree: 2839,
		MsgTypeActivitySailingInfo: 2837,
		MsgTypeActivitySailingMapReward: 2840,
		MsgTypeActivityStoreBuy: 2817,
		MsgTypeActivityStoreBuyInfo: 2816,
		MsgTypeActivitySuperValueGain: 2849,
		MsgTypeActivitySuperValueInfo: 2848,
		MsgTypeActivitySuperValueNotice: 2850,
		MsgTypeActivityTimeGiftGain: 2845,
		MsgTypeActivityTimeGiftInfo: 2844,
		MsgTypeActivityTopUpAward: 2806,
		MsgTypeActivityTopUpList: 2805,
		MsgTypeActivityTwistEggInfo: 2812,
		MsgTypeActivityTwistEggReward: 2811,
		MsgTypeActivityWeekendGift: 2820,
		MsgTypeActivityWeekendGiftInfo: 2821,
		MsgTypeAdventure2Consumption: 7102,
		MsgTypeAdventure2DifficultyReward: 7125,
		MsgTypeAdventure2Enter: 7104,
		MsgTypeAdventure2EntryExchange: 7127,
		MsgTypeAdventure2EntryList: 7111,
		MsgTypeAdventure2EntryReset: 7128,
		MsgTypeAdventure2EntrySelect: 7112,
		MsgTypeAdventure2Exit: 7105,
		MsgTypeAdventure2HeroCareer: 7124,
		MsgTypeAdventure2HeroImage: 7123,
		MsgTypeAdventure2HeroOn: 7121,
		MsgTypeAdventure2Line: 7126,
		MsgTypeAdventure2Mercenary: 7110,
		MsgTypeAdventure2MercenaryList: 7109,
		MsgTypeAdventure2NewHero: 7122,
		MsgTypeAdventure2Next: 7115,
		MsgTypeAdventure2PassAward: 7120,
		MsgTypeAdventure2PassList: 7119,
		MsgTypeAdventure2PlateEnter: 7103,
		MsgTypeAdventure2Raid: 7129,
		MsgTypeAdventure2Random: 7113,
		MsgTypeAdventure2RankList: 7116,
		MsgTypeAdventure2SaveState: 7130,
		MsgTypeAdventure2Skip: 7131,
		MsgTypeAdventure2State: 7101,
		MsgTypeAdventure2StoreBuy: 7118,
		MsgTypeAdventure2StoreList: 7117,
		MsgTypeAdventure2TravelBuy: 7107,
		MsgTypeAdventure2TravelFinish: 7108,
		MsgTypeAdventure2TravelList: 7106,
		MsgTypeAdventure2Treasure: 7114,
		MsgTypeAdventureConsumption: 4702,
		MsgTypeAdventureConsumptionEvent: 4713,
		MsgTypeAdventureEnter: 4704,
		MsgTypeAdventureEntryList: 4711,
		MsgTypeAdventureEntrySelect: 4712,
		MsgTypeAdventureExit: 4705,
		MsgTypeAdventureMercenary: 4710,
		MsgTypeAdventureMercenaryList: 4709,
		MsgTypeAdventureNext: 4715,
		MsgTypeAdventurePassAward: 4720,
		MsgTypeAdventurePassList: 4719,
		MsgTypeAdventurePlateEnter: 4703,
		MsgTypeAdventureRankList: 4716,
		MsgTypeAdventureState: 4701,
		MsgTypeAdventureStoreBuy: 4718,
		MsgTypeAdventureStoreList: 4717,
		MsgTypeAdventureTravelBuy: 4707,
		MsgTypeAdventureTravelFinish: 4708,
		MsgTypeAdventureTravelList: 4706,
		MsgTypeAdventureTreasure: 4714,
		MsgTypeArenaBuy: 1907,
		MsgTypeArenaDefence: 1905,
		MsgTypeArenaDefenceSet: 1904,
		MsgTypeArenaFight: 1902,
		MsgTypeArenaFightResult: 1903,
		MsgTypeArenaHonorDraw: 7506,
		MsgTypeArenaHonorEnter: 7503,
		MsgTypeArenaHonorExit: 7504,
		MsgTypeArenaHonorFlower: 7509,
		MsgTypeArenaHonorGroup: 7502,
		MsgTypeArenaHonorGuess: 7505,
		MsgTypeArenaHonorGuessHistory: 7507,
		MsgTypeArenaHonorGuild: 7501,
		MsgTypeArenaHonorRanking: 7508,
		MsgTypeArenaInfo: 1901,
		MsgTypeArenaMatch: 1906,
		MsgTypeArenaPointsAward: 1909,
		MsgTypeArenaPrepare: 1910,
		MsgTypeArenaQuery: 1908,
		MsgTypeArenaRaid: 1911,
		MsgTypeArenaTeamAgree: 6105,
		MsgTypeArenaTeamConfirm: 6113,
		MsgTypeArenaTeamDemise: 6109,
		MsgTypeArenaTeamFightOrder: 6114,
		MsgTypeArenaTeamFightOver: 6116,
		MsgTypeArenaTeamFightRecords: 6117,
		MsgTypeArenaTeamFightRewards: 6118,
		MsgTypeArenaTeamFightStart: 6115,
		MsgTypeArenaTeamInfo: 6101,
		MsgTypeArenaTeamInvite: 6103,
		MsgTypeArenaTeamInviters: 6104,
		MsgTypeArenaTeamMatch: 6112,
		MsgTypeArenaTeamPlayers: 6102,
		MsgTypeArenaTeamQuit: 6107,
		MsgTypeArenaTeamRankList: 6120,
		MsgTypeArenaTeamRankRewards: 6119,
		MsgTypeArenaTeamRedPoints: 6111,
		MsgTypeArenaTeamReject: 6106,
		MsgTypeArenaTeamRemove: 6108,
		MsgTypeArenaTeamSetting: 6110,
		MsgTypeAssistAllianceActivate: 6706,
		MsgTypeAssistAllianceGift: 6705,
		MsgTypeAssistAllianceGiftRecord: 6704,
		MsgTypeAssistAllianceLegion: 6703,
		MsgTypeAssistAllianceOn: 6702,
		MsgTypeAssistAllianceState: 6701,
		MsgTypeBarrackLevels: 905,
		MsgTypeBarrackLevelup: 906,
		MsgTypeBarrackList: 901,
		MsgTypeBarrackSoldiers: 904,
		MsgTypeBarrackTechUp: 902,
		MsgTypeBarrackUnlock: 903,
		MsgTypeBaseBoost: 7404,
		MsgTypeBaseBuild: 7403,
		MsgTypeBaseComplete: 7406,
		MsgTypeBaseDiggerList: 7407,
		MsgTypeBaseHangRewardFetch: 7408,
		MsgTypeBaseInfo: 7402,
		MsgTypeBaseList: 7401,
		MsgTypeBaseQuickHangReward: 7409,
		MsgTypeBaseVaria: 7405,
		MsgTypeBattleArrayOff: 3803,
		MsgTypeBattleArrayQuery: 3801,
		MsgTypeBattleArraySet: 3802,
		MsgTypeBountyComplete: 3608,
		MsgTypeBountyFightOver: 3607,
		MsgTypeBountyFightQuery: 3605,
		MsgTypeBountyFightReply: 3611,
		MsgTypeBountyFightStart: 3606,
		MsgTypeBountyList: 3601,
		MsgTypeBountyListNum: 3609,
		MsgTypeBountyMine: 3603,
		MsgTypeBountyPublish: 3602,
		MsgTypeBountyQuery: 3610,
		MsgTypeBountyRefresh: 3604,
		MsgTypeCarnivalInfo: 5504,
		MsgTypeCarnivalPlayerAddScore: 5502,
		MsgTypeCarnivalPlayerScoreQuery: 5503,
		MsgTypeCarnivalPlayerServerRank: 5505,
		MsgTypeCarnivalServerScoreRank: 5501,
		MsgTypeChampionExchange: 4809,
		MsgTypeChampionFetchScore: 4808,
		MsgTypeChampionFightOver: 4805,
		MsgTypeChampionFightStart: 4804,
		MsgTypeChampionGuess: 4813,
		MsgTypeChampionGuessFight: 4814,
		MsgTypeChampionGuessFightResult: 4815,
		MsgTypeChampionGuessHistory: 4816,
		MsgTypeChampionGuessList: 4812,
		MsgTypeChampionInfo: 4802,
		MsgTypeChampionLvRewards: 4810,
		MsgTypeChampionMatch: 4803,
		MsgTypeChampionRankRewards: 4811,
		MsgTypeChampionRanking: 4807,
		MsgTypeChampionRecords: 4806,
		MsgTypeChampionRedPoints: 4801,
		MsgTypeChatHistory: 302,
		MsgTypeChatSend: 301,
		MsgTypeCommentInfo: 4904,
		MsgTypeCommentNum: 4905,
		MsgTypeCostumeCustom: 5209,
		MsgTypeCostumeCustomScore: 5208,
		MsgTypeCostumeCustomScoreUpdate: 5207,
		MsgTypeCostumeCustomState: 5206,
		MsgTypeCostumeDisint: 5202,
		MsgTypeCostumeList: 5201,
		MsgTypeCostumeOn: 5203,
		MsgTypeCostumeUpdate: 5205,
		MsgTypeCostumeUpgrade: 5204,
		MsgTypeCrossTreasure: 6503,
		MsgTypeCrossTreasureNum: 6501,
		MsgTypeCrossTreasureRecordList: 6504,
		MsgTypeCrossTreasureState: 6502,
		MsgTypeDoomsDayEnter: 3702,
		MsgTypeDoomsDayExit: 3703,
		MsgTypeDoomsDayList: 3701,
		MsgTypeDoomsDayQuickRaids: 3705,
		MsgTypeDoomsDayRaids: 3704,
		MsgTypeDrawEggAward: 4602,
		MsgTypeDrawEggInfo: 4601,
		MsgTypeDrawEggSPReward: 4603,
		MsgTypeDungeonAssists: 2114,
		MsgTypeDungeonBossBattle: 2111,
		MsgTypeDungeonBossClick: 2112,
		MsgTypeDungeonBossFight: 2113,
		MsgTypeDungeonBossSummon: 2110,
		MsgTypeDungeonChapterList: 2101,
		MsgTypeDungeonChapterReward: 2102,
		MsgTypeDungeonElites: 2115,
		MsgTypeDungeonElitesChapterRewards: 2117,
		MsgTypeDungeonElitesRewards: 2126,
		MsgTypeDungeonEnter: 2104,
		MsgTypeDungeonExit: 2105,
		MsgTypeDungeonHangChoose: 2107,
		MsgTypeDungeonHangPreview: 2116,
		MsgTypeDungeonHangReward: 2109,
		MsgTypeDungeonHangStatus: 2108,
		MsgTypeDungeonHeroEnter: 2123,
		MsgTypeDungeonHeroExit: 2124,
		MsgTypeDungeonHeroQuickRaid: 2125,
		MsgTypeDungeonHeroRaid: 2122,
		MsgTypeDungeonHeroSweepTimes: 2121,
		MsgTypeDungeonList: 2103,
		MsgTypeDungeonMinPower: 2138,
		MsgTypeDungeonOrdealEnter: 2133,
		MsgTypeDungeonOrdealExit: 2134,
		MsgTypeDungeonOrdealInfo: 2132,
		MsgTypeDungeonOrdealRankList: 2135,
		MsgTypeDungeonOrdealReward: 2137,
		MsgTypeDungeonOrdealRewardUpdate: 2136,
		MsgTypeDungeonRaids: 2106,
		MsgTypeDungeonRuneEnter: 2127,
		MsgTypeDungeonRuneExit: 2128,
		MsgTypeDungeonRuneInfo: 2131,
		MsgTypeDungeonRuneQuickRaid: 2130,
		MsgTypeDungeonRuneRaid: 2129,
		MsgTypeDungeonSevenDayEnter: 2143,
		MsgTypeDungeonSevenDayExit: 2144,
		MsgTypeDungeonSevenDayGift: 2146,
		MsgTypeDungeonSevenDayReward: 2145,
		MsgTypeDungeonSevenDayState: 2142,
		MsgTypeDungeonTrialBuyRaids: 2120,
		MsgTypeDungeonTrialRaids: 2119,
		MsgTypeDungeonTrialRewards: 2118,
		MsgTypeDungeonUltimateEnter: 2140,
		MsgTypeDungeonUltimateExit: 2141,
		MsgTypeDungeonUltimateState: 2139,
		MsgTypeEnergizeDraw: 7902,
		MsgTypeEnergizeGet: 7903,
		MsgTypeEnergizeState: 7901,
		MsgTypeEnergyStationAdvance: 5804,
		MsgTypeEnergyStationInfo: 5801,
		MsgTypeEnergyStationRedPoint: 5805,
		MsgTypeEnergyStationUnlock: 5802,
		MsgTypeEnergyStationUpgrade: 5803,
		MsgTypeEquipCompose: 704,
		MsgTypeEquipComposeRecursive: 705,
		MsgTypeEquipDisint: 703,
		MsgTypeEquipList: 701,
		MsgTypeEquipUpdate: 702,
		MsgTypeExcitingActivityProgress: 4003,
		MsgTypeExcitingActivityRewards: 4002,
		MsgTypeExcitingActivityState: 4001,
		MsgTypeExcitingActivityUpgradeLimit: 4004,
		MsgTypeExpeditionArmyState: 7620,
		MsgTypeExpeditionArmyStrengthen: 7621,
		MsgTypeExpeditionBroadcast: 7614,
		MsgTypeExpeditionBuyEnergy: 7603,
		MsgTypeExpeditionFightExit: 7612,
		MsgTypeExpeditionFightOver: 7611,
		MsgTypeExpeditionFightStart: 7610,
		MsgTypeExpeditionGiveUp: 7613,
		MsgTypeExpeditionHangupItems: 7615,
		MsgTypeExpeditionHangupReward: 7616,
		MsgTypeExpeditionHeroChange: 7602,
		MsgTypeExpeditionHeroList: 7601,
		MsgTypeExpeditionLogList: 7604,
		MsgTypeExpeditionMapClear: 7608,
		MsgTypeExpeditionMapEnter: 7606,
		MsgTypeExpeditionMapExit: 7607,
		MsgTypeExpeditionMapList: 7605,
		MsgTypeExpeditionMissionReward: 7619,
		MsgTypeExpeditionMissionState: 7617,
		MsgTypeExpeditionMissionUpdate: 7618,
		MsgTypeExpeditionOccupiedPoints: 7623,
		MsgTypeExpeditionPointDetail: 7609,
		MsgTypeExpeditionRanking: 7622,
		MsgTypeFeedbackByRole: 2602,
		MsgTypeFeedbackGmReply: 2603,
		MsgTypeFeedbackInfo: 2601,
		MsgTypeFightDamageStatic: 1006,
		MsgTypeFightDefenceFail: 1005,
		MsgTypeFightDefend: 1002,
		MsgTypeFightLookup: 1004,
		MsgTypeFightQuery: 1001,
		MsgTypeFightReplay: 1003,
		MsgTypeFindComment: 4903,
		MsgTypeFlipCardInfo: 4501,
		MsgTypeFlipCardNextTurn: 4504,
		MsgTypeFlipCardReward: 4503,
		MsgTypeFlipCardSPReward: 4502,
		MsgTypeFootholdAChatHis: 3439,
		MsgTypeFootholdAlliance: 3435,
		MsgTypeFootholdAtkFlagDel: 3438,
		MsgTypeFootholdAtkFlagGet: 3436,
		MsgTypeFootholdAtkFlagSet: 3437,
		MsgTypeFootholdBaseLevel: 3423,
		MsgTypeFootholdBaseReward: 3422,
		MsgTypeFootholdBossKilled: 3416,
		MsgTypeFootholdBuyEnergy: 3421,
		MsgTypeFootholdCancelRedpoint: 3417,
		MsgTypeFootholdCatchUp: 3427,
		MsgTypeFootholdCoopApplyAnswer: 3471,
		MsgTypeFootholdCoopApplyAsk: 3468,
		MsgTypeFootholdCoopApplyNotice: 3469,
		MsgTypeFootholdCoopApplyPlayers: 3470,
		MsgTypeFootholdCoopApplySetting: 3472,
		MsgTypeFootholdCoopGuildList: 3461,
		MsgTypeFootholdCoopGuildMembers: 3473,
		MsgTypeFootholdCoopGuildPublish: 3474,
		MsgTypeFootholdCoopInviteAnswer: 3467,
		MsgTypeFootholdCoopInviteAsk: 3464,
		MsgTypeFootholdCoopInviteGuilds: 3466,
		MsgTypeFootholdCoopInviteNotice: 3465,
		MsgTypeFootholdCoopPlayerList: 3463,
		MsgTypeFootholdCoopRankList: 3462,
		MsgTypeFootholdFightBroadcast: 3414,
		MsgTypeFootholdFightOver: 3413,
		MsgTypeFootholdFightQuery: 3411,
		MsgTypeFootholdFightRank: 3460,
		MsgTypeFootholdFightRecords: 3440,
		MsgTypeFootholdFightStart: 3412,
		MsgTypeFootholdFreeEnergy: 3434,
		MsgTypeFootholdGatherBrief: 3442,
		MsgTypeFootholdGatherCancel: 3444,
		MsgTypeFootholdGatherFightOver: 3451,
		MsgTypeFootholdGatherFightStart: 3450,
		MsgTypeFootholdGatherInit: 3441,
		MsgTypeFootholdGatherInvite: 3445,
		MsgTypeFootholdGatherInviters: 3446,
		MsgTypeFootholdGatherJoin: 3448,
		MsgTypeFootholdGatherPoints: 3449,
		MsgTypeFootholdGatherRefuse: 3447,
		MsgTypeFootholdGatherTeam: 3443,
		MsgTypeFootholdGiveUp: 3426,
		MsgTypeFootholdGuardBrief: 3453,
		MsgTypeFootholdGuardCancel: 3455,
		MsgTypeFootholdGuardInit: 3452,
		MsgTypeFootholdGuardInvite: 3456,
		MsgTypeFootholdGuardInviters: 3457,
		MsgTypeFootholdGuardJoin: 3459,
		MsgTypeFootholdGuardRefuse: 3458,
		MsgTypeFootholdGuardTeam: 3454,
		MsgTypeFootholdGuessQuery: 3431,
		MsgTypeFootholdGuessReward: 3433,
		MsgTypeFootholdGuessVote: 3432,
		MsgTypeFootholdGuideCommit: 3429,
		MsgTypeFootholdGuideQuery: 3430,
		MsgTypeFootholdGuildJoin: 3407,
		MsgTypeFootholdLastRank: 3428,
		MsgTypeFootholdListOutput: 3424,
		MsgTypeFootholdLookupGuild: 3402,
		MsgTypeFootholdLookupPlayer: 3401,
		MsgTypeFootholdMapEnter: 3405,
		MsgTypeFootholdMapEnter2: 3475,
		MsgTypeFootholdMapExit: 3406,
		MsgTypeFootholdMapProgress: 3419,
		MsgTypeFootholdMapRanking: 3420,
		MsgTypeFootholdPlayerJoin: 3408,
		MsgTypeFootholdPointDetail: 3409,
		MsgTypeFootholdPointScore: 3410,
		MsgTypeFootholdRanking: 3418,
		MsgTypeFootholdRedPoints: 3403,
		MsgTypeFootholdRoleInfo: 3404,
		MsgTypeFootholdTakeOutput: 3425,
		MsgTypeFootholdTop6Guild: 3415,
		MsgTypeFriendBecome: 508,
		MsgTypeFriendBlacklist: 502,
		MsgTypeFriendBlacklistIn: 503,
		MsgTypeFriendBlacklistOut: 504,
		MsgTypeFriendDelete: 509,
		MsgTypeFriendGive: 512,
		MsgTypeFriendInvite: 506,
		MsgTypeFriendList: 501,
		MsgTypeFriendReceive: 514,
		MsgTypeFriendRecommend: 510,
		MsgTypeFriendRefuse: 507,
		MsgTypeFriendRenameNotice: 515,
		MsgTypeFriendRequest: 505,
		MsgTypeFriendSearch: 511,
		MsgTypeFriendTake: 513,
		MsgTypeGeneDraw: 4101,
		MsgTypeGeneDrawHistory: 4105,
		MsgTypeGeneStore: 4104,
		MsgTypeGeneTrans: 4102,
		MsgTypeGeneTransConfirm: 4103,
		MsgTypeGeneralAttr: 1601,
		MsgTypeGeneralChangeWeapon: 1603,
		MsgTypeGeneralInfo: 1602,
		MsgTypeGeneralWeaponGet: 1605,
		MsgTypeGeneralWeaponInfo: 1604,
		MsgTypeGeneralWeaponLevelUpgrade: 1607,
		MsgTypeGeneralWeaponProgressUpgrade: 1608,
		MsgTypeGeneralWeaponUpgradeInfo: 1606,
		MsgTypeGiftFetch: 2501,
		MsgTypeGrowthfundAward: 3104,
		MsgTypeGrowthfundList: 3103,
		MsgTypeGuardianCopyEnter: 6606,
		MsgTypeGuardianCopyExit: 6607,
		MsgTypeGuardianCopyRaid: 6608,
		MsgTypeGuardianCopyState: 6605,
		MsgTypeGuardianCumAward: 6604,
		MsgTypeGuardianDecompose: 6614,
		MsgTypeGuardianDraw: 6602,
		MsgTypeGuardianDrawState: 6601,
		MsgTypeGuardianEquipDecompose: 6620,
		MsgTypeGuardianEquipLevelUp: 6621,
		MsgTypeGuardianEquipList: 6616,
		MsgTypeGuardianEquipOff: 6618,
		MsgTypeGuardianEquipOn: 6617,
		MsgTypeGuardianEquipStarUp: 6622,
		MsgTypeGuardianEquipUpdate: 6619,
		MsgTypeGuardianFallback: 6630,
		MsgTypeGuardianFallbackPreview: 6629,
		MsgTypeGuardianLevelUp: 6610,
		MsgTypeGuardianList: 6609,
		MsgTypeGuardianPutOn: 6612,
		MsgTypeGuardianStarUp: 6611,
		MsgTypeGuardianTakeOff: 6613,
		MsgTypeGuardianTowerEnter: 6624,
		MsgTypeGuardianTowerExit: 6625,
		MsgTypeGuardianTowerRaid: 6626,
		MsgTypeGuardianTowerRaidBuy: 6627,
		MsgTypeGuardianTowerRankList: 6628,
		MsgTypeGuardianTowerState: 6623,
		MsgTypeGuardianUpdate: 6615,
		MsgTypeGuardianWish: 6603,
		MsgTypeGuideGroupList: 2301,
		MsgTypeGuideGroupSave: 2302,
		MsgTypeGuideGroupStep: 2303,
		MsgTypeGuildAccelerateAll: 2942,
		MsgTypeGuildAccelerateBroadcast: 2944,
		MsgTypeGuildAccelerateList: 2941,
		MsgTypeGuildAccelerateNotice: 2943,
		MsgTypeGuildAcceptInvite: 2926,
		MsgTypeGuildBossEnter: 4304,
		MsgTypeGuildBossExit: 4305,
		MsgTypeGuildBossNotice: 4307,
		MsgTypeGuildBossOpen: 4302,
		MsgTypeGuildBossRaids: 4308,
		MsgTypeGuildBossRank: 4303,
		MsgTypeGuildBossReward: 4306,
		MsgTypeGuildBossState: 4301,
		MsgTypeGuildCamp: 2904,
		MsgTypeGuildCheck: 2908,
		MsgTypeGuildCreate: 2905,
		MsgTypeGuildDetail: 2902,
		MsgTypeGuildDropAllot: 2932,
		MsgTypeGuildDropFetch: 2934,
		MsgTypeGuildDropState: 2931,
		MsgTypeGuildDropStored: 2933,
		MsgTypeGuildEnvelopeChange: 5403,
		MsgTypeGuildEnvelopeGet: 5405,
		MsgTypeGuildEnvelopeList: 5402,
		MsgTypeGuildEnvelopeRank: 5401,
		MsgTypeGuildEnvelopeSend: 5404,
		MsgTypeGuildGatherConfirm: 7305,
		MsgTypeGuildGatherEnd: 7306,
		MsgTypeGuildGatherHeroOn: 7304,
		MsgTypeGuildGatherRank: 7302,
		MsgTypeGuildGatherReward: 7303,
		MsgTypeGuildGatherState: 7301,
		MsgTypeGuildInvite: 2925,
		MsgTypeGuildInviteInfo: 2927,
		MsgTypeGuildJoin: 2906,
		MsgTypeGuildKick: 2910,
		MsgTypeGuildList: 2901,
		MsgTypeGuildLogList: 2939,
		MsgTypeGuildMailSend: 2937,
		MsgTypeGuildMailTimes: 2936,
		MsgTypeGuildMissionList: 2928,
		MsgTypeGuildMissionReward: 2930,
		MsgTypeGuildMissionUpdate: 2929,
		MsgTypeGuildQuery: 2903,
		MsgTypeGuildQuit: 2909,
		MsgTypeGuildRecruit: 2935,
		MsgTypeGuildRemind: 2940,
		MsgTypeGuildReqNotice: 2938,
		MsgTypeGuildRequests: 2907,
		MsgTypeGuildSelfTitle: 2924,
		MsgTypeGuildSetCamp: 2917,
		MsgTypeGuildSetCheck: 2912,
		MsgTypeGuildSetIcon: 2913,
		MsgTypeGuildSetName: 2914,
		MsgTypeGuildSetNotice: 2915,
		MsgTypeGuildSetTitle: 2916,
		MsgTypeGuildSign: 2919,
		MsgTypeGuildSignBox: 2920,
		MsgTypeGuildSignInfo: 2918,
		MsgTypeGuildSthWarDetail: 2922,
		MsgTypeGuildSthWarFight: 2923,
		MsgTypeGuildSthWarStart: 2921,
		MsgTypeGuildUpdate: 2911,
		MsgTypeGweaponIdInfo: 1704,
		MsgTypeGweaponList: 1701,
		MsgTypeGweaponStrength: 1702,
		MsgTypeGweaponUpgradeStar: 1703,
		MsgTypeHeroAttr: 804,
		MsgTypeHeroAwake: 829,
		MsgTypeHeroAwakeBooks: 831,
		MsgTypeHeroAwakeEnter: 826,
		MsgTypeHeroAwakeExit: 827,
		MsgTypeHeroAwakeGift: 1324,
		MsgTypeHeroAwakeGiftUpdate: 1325,
		MsgTypeHeroAwakeMissonUpdate: 825,
		MsgTypeHeroAwakePreview: 828,
		MsgTypeHeroAwakeState: 824,
		MsgTypeHeroCareerTrans: 812,
		MsgTypeHeroCareerUp: 811,
		MsgTypeHeroDecompose: 820,
		MsgTypeHeroDetail: 805,
		MsgTypeHeroDisplace: 822,
		MsgTypeHeroEquipOff: 807,
		MsgTypeHeroEquipOn: 806,
		MsgTypeHeroEquipUpdate: 808,
		MsgTypeHeroFallback: 830,
		MsgTypeHeroInfo: 821,
		MsgTypeHeroLevelup: 809,
		MsgTypeHeroList: 801,
		MsgTypeHeroMaxStarUp: 823,
		MsgTypeHeroMysticLink: 833,
		MsgTypeHeroMysticSkillUp: 835,
		MsgTypeHeroMysticUnLink: 834,
		MsgTypeHeroPowerUpdate: 803,
		MsgTypeHeroRebirth: 832,
		MsgTypeHeroResetConfirm: 819,
		MsgTypeHeroResetPreview: 818,
		MsgTypeHeroSoldierActive: 816,
		MsgTypeHeroSoldierChange: 814,
		MsgTypeHeroSoldierInfo: 815,
		MsgTypeHeroSoldierList: 813,
		MsgTypeHeroStarup: 810,
		MsgTypeHeroStatusLock: 817,
		MsgTypeHeroUpdate: 802,
		MsgTypeInsertComment: 4901,
		MsgTypeItemCompose: 604,
		MsgTypeItemDisint: 603,
		MsgTypeItemList: 601,
		MsgTypeItemUpdate: 602,
		MsgTypeJusticeBossReset: 2008,
		MsgTypeJusticeClick: 2003,
		MsgTypeJusticeGeneralLvup: 2005,
		MsgTypeJusticeHeroIn: 2004,
		MsgTypeJusticeItemsGot: 2009,
		MsgTypeJusticeMercenaryLvup: 2007,
		MsgTypeJusticeQuickKill: 2010,
		MsgTypeJusticeQuickLvup: 2011,
		MsgTypeJusticeSlotOpen: 2006,
		MsgTypeJusticeState: 2001,
		MsgTypeJusticeSummon: 2002,
		MsgTypeLuckyCompose: 2202,
		MsgTypeLuckyCreditExchange: 2204,
		MsgTypeLuckyDraw: 2201,
		MsgTypeLuckyDrawOptional: 2207,
		MsgTypeLuckyDrawSummon: 2206,
		MsgTypeLuckyDrawSummonState: 2205,
		MsgTypeLuckyNumber: 2203,
		MsgTypeMailDelete: 404,
		MsgTypeMailDraw: 403,
		MsgTypeMailList: 401,
		MsgTypeMailNotice: 406,
		MsgTypeMailRead: 402,
		MsgTypeMailUpdate: 405,
		MsgTypeMartialSoulEnter: 3902,
		MsgTypeMartialSoulExit: 3903,
		MsgTypeMartialSoulState: 3901,
		MsgTypeMasteryExploreReward: 1204,
		MsgTypeMasteryExploreStart: 1202,
		MsgTypeMasteryExploreStop: 1203,
		MsgTypeMasteryStageIdList: 1205,
		MsgTypeMasteryStageUpdate: 1206,
		MsgTypeMasteryTeamList: 1201,
		MsgTypeMercenaryBorrow: 3207,
		MsgTypeMercenaryBorrowed: 3208,
		MsgTypeMercenaryCancel: 3210,
		MsgTypeMercenaryFight: 3209,
		MsgTypeMercenaryGain: 3205,
		MsgTypeMercenaryImage: 3201,
		MsgTypeMercenaryLendOff: 3203,
		MsgTypeMercenaryLendOn: 3202,
		MsgTypeMercenaryLent: 3204,
		MsgTypeMercenaryList: 3206,
		MsgTypeMergeCarnivalCurServerRank: 6908,
		MsgTypeMergeCarnivalExchange: 6905,
		MsgTypeMergeCarnivalPlayerScore: 6906,
		MsgTypeMergeCarnivalServerRank: 6907,
		MsgTypeMergeCarnivalState: 6904,
		MsgTypeMergeCarnivalStore: 6901,
		MsgTypeMergeCarnivalStoreBuy: 6902,
		MsgTypeMergeCarnivalStoreLeft: 6903,
		MsgTypeMission7daysScoreAward: 1104,
		MsgTypeMissionAdventureDiaryReward: 1118,
		MsgTypeMissionAdventureDiaryRewardInfo: 1119,
		MsgTypeMissionComboInfo: 1121,
		MsgTypeMissionDailyRoundId: 1120,
		MsgTypeMissionGrowChapterAward: 1109,
		MsgTypeMissionGrowList: 1107,
		MsgTypeMissionGrowTaskAward: 1110,
		MsgTypeMissionGrowUpdate: 1108,
		MsgTypeMissionList: 1101,
		MsgTypeMissionOnlineAward: 1106,
		MsgTypeMissionOnlineInfo: 1105,
		MsgTypeMissionReward: 1103,
		MsgTypeMissionUpdate: 1102,
		MsgTypeMissionWeaponList: 1115,
		MsgTypeMissionWeaponTaskAward: 1117,
		MsgTypeMissionWeaponUpdate: 1116,
		MsgTypeMissionWelfare2Award: 1114,
		MsgTypeMissionWelfare2List: 1113,
		MsgTypeMissionWelfareAward: 1112,
		MsgTypeMissionWelfareList: 1111,
		MsgTypeMonthCardBuy: 2408,
		MsgTypeMonthCardDayReward: 2405,
		MsgTypeMonthCardDungeonChoose: 2404,
		MsgTypeMonthCardDungeonInfo: 2403,
		MsgTypeMonthCardList: 2401,
		MsgTypeMonthCardPaySumVipReward: 2406,
		MsgTypeMonthCardQuickCombatInfo: 2407,
		MsgTypeMonthCardUpdate: 2402,
		MsgTypeNewOrdealEnter: 5902,
		MsgTypeNewOrdealExit: 5903,
		MsgTypeNewOrdealInfo: 5901,
		MsgTypeNewOrdealRankList: 5904,
		MsgTypeOperationStoreListInfo: 1321,
		MsgTypeOperationStoreUpdate: 1320,
		MsgTypePassAward: 3102,
		MsgTypePassFundFetch: 3108,
		MsgTypePassFundList: 3107,
		MsgTypePassList: 3101,
		MsgTypePassWeeklyAward: 3110,
		MsgTypePassWeeklyList: 3109,
		MsgTypePayCrossRank: 2708,
		MsgTypePayDailyFirstInfo: 2706,
		MsgTypePayDailyFirstReward: 2707,
		MsgTypePayFirstList: 2703,
		MsgTypePayFirstReward: 2705,
		MsgTypePayFirstUpdate: 2704,
		MsgTypePayOrder: 2701,
		MsgTypePaySucc: 2702,
		MsgTypePeakBuyEnterTime: 6204,
		MsgTypePeakEnter: 6205,
		MsgTypePeakExit: 6207,
		MsgTypePeakFight: 6206,
		MsgTypePeakHeroCareer: 6216,
		MsgTypePeakHeroDisplace: 6210,
		MsgTypePeakHeroDisplaceConfirm: 6211,
		MsgTypePeakHeroDisplaceRecord: 6209,
		MsgTypePeakHeroImage: 6215,
		MsgTypePeakHeroOn: 6202,
		MsgTypePeakHeroResetDisplaceRecord: 6212,
		MsgTypePeakMatching: 6203,
		MsgTypePeakRanking: 6214,
		MsgTypePeakRecord: 6213,
		MsgTypePeakReward: 6208,
		MsgTypePeakState: 6201,
		MsgTypePiecesBattleArray: 7217,
		MsgTypePiecesBuyHero: 7209,
		MsgTypePiecesBuyHeroPanel: 7206,
		MsgTypePiecesBuyTime: 7202,
		MsgTypePiecesCrossServerNum: 7222,
		MsgTypePiecesEnter: 7216,
		MsgTypePiecesExit: 7218,
		MsgTypePiecesFightQuery: 7221,
		MsgTypePiecesGainDivisionReward: 7205,
		MsgTypePiecesHeroAttr: 7213,
		MsgTypePiecesHeroChangeLine: 7211,
		MsgTypePiecesHeroList: 7214,
		MsgTypePiecesHeroOnBattle: 7215,
		MsgTypePiecesHeroUpdate: 7212,
		MsgTypePiecesInfo: 7201,
		MsgTypePiecesLightUpTalent: 7203,
		MsgTypePiecesLockBuyHeroPanel: 7208,
		MsgTypePiecesRankList: 7204,
		MsgTypePiecesRefreshBuyHeroPanel: 7207,
		MsgTypePiecesRoundEnd: 7220,
		MsgTypePiecesRoundStart: 7219,
		MsgTypePiecesSellHero: 7210,
		MsgTypePiecesUpgradeChessBoard: 7223,
		MsgTypePlatformFriendGemsFetch: 7706,
		MsgTypePlatformFriendGemsInfo: 7705,
		MsgTypePlatformFriendGiftList: 7704,
		MsgTypePlatformMissionList: 7701,
		MsgTypePlatformMissionReward: 7703,
		MsgTypePlatformMissionTrigger: 7702,
		MsgTypeRankArena: 1806,
		MsgTypeRankDetail: 1811,
		MsgTypeRankMcups: 1809,
		MsgTypeRankMcupsValues: 1810,
		MsgTypeRankMstage: 1807,
		MsgTypeRankMstageValues: 1808,
		MsgTypeRankPower: 1802,
		MsgTypeRankPowerValues: 1803,
		MsgTypeRankRefine: 1804,
		MsgTypeRankRefineValues: 1805,
		MsgTypeRankSelf: 1812,
		MsgTypeRankYesterday: 1801,
		MsgTypeRelicBroadcastPoint: 5114,
		MsgTypeRelicCertReward: 5126,
		MsgTypeRelicCertState: 5125,
		MsgTypeRelicClearRank: 5127,
		MsgTypeRelicExploreTimes: 5115,
		MsgTypeRelicFetchRewards: 5111,
		MsgTypeRelicFightClearCD: 5105,
		MsgTypeRelicFightOver: 5107,
		MsgTypeRelicFightRank: 5128,
		MsgTypeRelicFightStart: 5106,
		MsgTypeRelicGiveUp: 5113,
		MsgTypeRelicGuildDefenders: 5108,
		MsgTypeRelicGuildExplorers: 5118,
		MsgTypeRelicGuildRank: 5124,
		MsgTypeRelicHelpDefend: 5109,
		MsgTypeRelicHelpReset: 5116,
		MsgTypeRelicMapDrops: 5117,
		MsgTypeRelicPointDetail: 5102,
		MsgTypeRelicPointExplore: 5103,
		MsgTypeRelicPointList: 5101,
		MsgTypeRelicPointRecords: 5104,
		MsgTypeRelicQueryRewards: 5110,
		MsgTypeRelicRepair: 5112,
		MsgTypeRelicTransfer: 5119,
		MsgTypeRelicTransferCancel: 5122,
		MsgTypeRelicTransferConfirm: 5121,
		MsgTypeRelicTransferNotice: 5120,
		MsgTypeRelicUnderAttackNotice: 5123,
		MsgTypeResonatingClearCD: 5005,
		MsgTypeResonatingPutOn: 5002,
		MsgTypeResonatingState: 5001,
		MsgTypeResonatingTakeOff: 5003,
		MsgTypeResonatingUnlock: 5004,
		MsgTypeRitualList: 5601,
		MsgTypeRoleAllFramesAdd: 214,
		MsgTypeRoleAllFramesInfo: 212,
		MsgTypeRoleAllTitlesAdd: 215,
		MsgTypeRoleAllTitlesInfo: 213,
		MsgTypeRoleAntiaddiction: 218,
		MsgTypeRoleCookieGet: 219,
		MsgTypeRoleCookieSet: 220,
		MsgTypeRoleCreate: 203,
		MsgTypeRoleEquipImage: 211,
		MsgTypeRoleFrame: 209,
		MsgTypeRoleHead: 208,
		MsgTypeRoleHeadFramesExpire: 225,
		MsgTypeRoleHeroImage: 207,
		MsgTypeRoleImage: 206,
		MsgTypeRoleLogin: 201,
		MsgTypeRoleReconnect: 202,
		MsgTypeRoleRename: 205,
		MsgTypeRoleRenameNum: 224,
		MsgTypeRoleSet: 217,
		MsgTypeRoleSignContent: 216,
		MsgTypeRoleTitle: 210,
		MsgTypeRoleTitlesExpire: 226,
		MsgTypeRoleUpdate: 204,
		MsgTypeRoleVipBoughtFlag: 221,
		MsgTypeRoleVipBuyGift: 222,
		MsgTypeRoleVipMCDailyRewards: 223,
		MsgTypeRoyalBuy: 8009,
		MsgTypeRoyalDiv: 8008,
		MsgTypeRoyalFightOver: 8005,
		MsgTypeRoyalFightRank: 8007,
		MsgTypeRoyalFightRecord: 8006,
		MsgTypeRoyalFightStart: 8004,
		MsgTypeRoyalInfo: 8001,
		MsgTypeRoyalMatch: 8003,
		MsgTypeRoyalSetMap: 8002,
		MsgTypeRubyCompose: 1502,
		MsgTypeRubyPutOn: 1503,
		MsgTypeRubyTakeOff: 1504,
		MsgTypeRubyUpgrade: 1501,
		MsgTypeRuinChallengeEnter: 5705,
		MsgTypeRuinChallengeExit: 5706,
		MsgTypeRuinChapterChallenge: 5708,
		MsgTypeRuinChapterReward: 5707,
		MsgTypeRuinEnter: 5702,
		MsgTypeRuinExit: 5703,
		MsgTypeRuinRaids: 5704,
		MsgTypeRuinStarRankList: 5709,
		MsgTypeRuinState: 5701,
		MsgTypeRune2BreakDown: 6402,
		MsgTypeRune2Compose: 6403,
		MsgTypeRune2List: 6401,
		MsgTypeRune2Mix: 6407,
		MsgTypeRune2On: 6404,
		MsgTypeRune2Refine: 6408,
		MsgTypeRune2Update: 6405,
		MsgTypeRune2Upgrade: 6406,
		MsgTypeRuneBlessInfo: 4409,
		MsgTypeRuneCompose: 4403,
		MsgTypeRuneDisint: 4402,
		MsgTypeRuneList: 4401,
		MsgTypeRuneMix: 4407,
		MsgTypeRuneOn: 4404,
		MsgTypeRuneUpdate: 4405,
		MsgTypeRuneUpgrade: 4406,
		MsgTypeRuneWash: 4408,
		MsgTypeShareImage: 303,
		MsgTypeShareInfo: 304,
		MsgTypeSiegeBlood: 6006,
		MsgTypeSiegeBuy: 6002,
		MsgTypeSiegeEnter: 6003,
		MsgTypeSiegeExit: 6004,
		MsgTypeSiegeRankList: 6005,
		MsgTypeSiegeState: 6001,
		MsgTypeSignBu: 1403,
		MsgTypeSignInfo: 1401,
		MsgTypeSignLogin: 1402,
		MsgTypeSignPay: 1404,
		MsgTypeSoldierSkinActive: 6302,
		MsgTypeSoldierSkinActiveTrammel: 6303,
		MsgTypeSoldierSkinCompose: 6305,
		MsgTypeSoldierSkinOn: 6304,
		MsgTypeSoldierSkinState: 6301,
		MsgTypeSoldierTechDisintStone: 7807,
		MsgTypeSoldierTechDoResearch: 7805,
		MsgTypeSoldierTechEquipStone: 7806,
		MsgTypeSoldierTechLevelUp: 7802,
		MsgTypeSoldierTechList: 7801,
		MsgTypeSoldierTechResearchAward: 7804,
		MsgTypeSoldierTechResearchList: 7803,
		MsgTypeStore7daysBought: 1313,
		MsgTypeStore7daysBuy: 1314,
		MsgTypeStoreBlackMarketBuy: 1303,
		MsgTypeStoreBlackMarketList: 1301,
		MsgTypeStoreBlackMarketRefresh: 1302,
		MsgTypeStoreBuy: 1305,
		MsgTypeStoreGiftList: 1306,
		MsgTypeStoreGiftUpdate: 1307,
		MsgTypeStoreList: 1304,
		MsgTypeStoreMiscGiftPowerAward: 1312,
		MsgTypeStorePushBuy: 1309,
		MsgTypeStorePushEvents: 1310,
		MsgTypeStorePushList: 1308,
		MsgTypeStorePushNotice: 1311,
		MsgTypeStoreQuickBuy: 1316,
		MsgTypeStoreRefresh: 1315,
		MsgTypeStoreRuneBuy: 1318,
		MsgTypeStoreRuneList: 1317,
		MsgTypeStoreRuneRefresh: 1319,
		MsgTypeStoreSiegeList: 1323,
		MsgTypeStoreUniqueEquipList: 1326,
		MsgTypeStoreUniqueEquipRefresh: 1327,
		MsgTypeSurvivalEnter: 3303,
		MsgTypeSurvivalEquipBuy: 3307,
		MsgTypeSurvivalEquipPocket: 3306,
		MsgTypeSurvivalExit: 3304,
		MsgTypeSurvivalHeroOn: 3305,
		MsgTypeSurvivalMerRecord: 3313,
		MsgTypeSurvivalMerRewards: 3312,
		MsgTypeSurvivalMerRewardsPreview: 3311,
		MsgTypeSurvivalRaid: 3310,
		MsgTypeSurvivalRefreshEquipPocket: 3308,
		MsgTypeSurvivalReset: 3302,
		MsgTypeSurvivalState: 3301,
		MsgTypeSurvivalSubType: 3309,
		MsgTypeSystemBroadcast: 107,
		MsgTypeSystemClose: 105,
		MsgTypeSystemError: 101,
		MsgTypeSystemHeartbeat: 102,
		MsgTypeSystemManlingKfmsg: 112,
		MsgTypeSystemNewday: 106,
		MsgTypeSystemNotice: 104,
		MsgTypeSystemReady: 113,
		MsgTypeSystemRedPointCancel: 109,
		MsgTypeSystemRedPointList: 108,
		MsgTypeSystemServerName: 111,
		MsgTypeSystemShowOff: 103,
		MsgTypeSystemSubscribe: 110,
		MsgTypeTavernExtraTask: 3006,
		MsgTypeTavernGoodsStat: 3005,
		MsgTypeTavernInfo: 3001,
		MsgTypeTavernTaskRefresh: 3004,
		MsgTypeTavernTaskReward: 3003,
		MsgTypeTavernTaskStart: 3002,
		MsgTypeTimeLimitGift: 1322,
		MsgTypeTowerfundAward: 3106,
		MsgTypeTowerfundList: 3105,
		MsgTypeTurntableDraw: 4203,
		MsgTypeTurntableList: 4201,
		MsgTypeTurntableRefresh: 4202,
		MsgTypeTwistEggDraw: 6803,
		MsgTypeTwistEggState: 6801,
		MsgTypeTwistEggWish: 6802,
		MsgTypeUniqueEquipDisint: 8106,
		MsgTypeUniqueEquipDraw: 8107,
		MsgTypeUniqueEquipList: 8102,
		MsgTypeUniqueEquipOff: 8104,
		MsgTypeUniqueEquipOn: 8103,
		MsgTypeUniqueEquipStarUp: 8105,
		MsgTypeUniqueEquipUpdate: 8101,
		MsgTypeUniqueEquipWishInfo: 8108,
		MsgTypeUniqueEquipWishSet: 8109,
		MsgTypeUpdateComment: 4902,
		MsgTypeVaultFightOver: 5301,
		MsgTypeVaultFightReady: 5304,
		MsgTypeVaultFightStart: 5303,
		MsgTypeVaultPositionInfo: 5302,
		MsgTypeWorldEnvelopeGet: 7004,
		MsgTypeWorldEnvelopeId: 7003,
		MsgTypeWorldEnvelopeList: 7002,
		MsgTypeWorldEnvelopeRank: 7001,
	};
	const c = o.MessageClass = Object.create(null);
	const n = 'MsgType';
	let a, m;

	// 读写操作函数定义
	const sm = 'StartMessage';
	const fm = 'FinishMessage';
	const rs = 'ReadString';
	const rbs = 'ReadBytes';
	const ry = 'ReadByte';
	const r1 = 'ReadInt16';
	const r3 = 'ReadInt32';
	const r6 = 'ReadInt64';
	const rU3 = 'ReadUInt32';
    const ri = 'ReadInt';
    const rui = 'ReadUInt';
	const rb = 'ReadBool';
	const ws = 'WriteString';
	const wy = 'WriteByte';
	const w1 = 'WriteInt16';
	const w3 = 'WriteInt32';
	const w6 = 'WriteInt64';
	const wU3 = 'WriteUInt32';
    const wi = 'WriteInt';
    const wui = 'WriteUInt';
	const wb = 'WriteBool';

	function __init__ (thiz, data) {
		for (var e in data) {
			thiz[e] = data[e];
		}
	};
	
	a = o.bytes = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
		}
		decode(r) {
			return this;
		}
	};
	
	//系统--错误
	a = o.SystemErrorRsp = class {
		decode(r) {
			this.code = r[r1]();
			this.args = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.args[i] = r[rs]();   
			}
			return this;
		}
	};
	m = 101;
	a[n] = m;
	c[m] = a;
	
	//系统--心跳
	a = o.SystemHeartbeatReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](102);
			w[fm]();
		}
	};
	m = 102;
	a[n] = m;
	
	a = o.SystemHeartbeatRsp = class {
		decode(r) {
			this.serverTime = r[r3]();
			return this;
		}
	};
	m = 102;
	a[n] = m;
	c[m] = a;
	
	a = o.DropGoods = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.dropId);
			w[w3](this.goodsTypeId);
			w[w3](this.goodsNum);
		}
		decode(r) {
			this.dropId = r[r3]();
			this.goodsTypeId = r[r3]();
			this.goodsNum = r[r3]();
			return this;
		}
	};
	
	a = o.SystemShowOffRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			this.playerName = r[rs]();
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.DropGoods().decode(r);   
			}
			return this;
		}
	};
	m = 103;
	a[n] = m;
	c[m] = a;
	
	a = o.SystemNoticeRsp = class {
		decode(r) {
			this.content = r[rs]();
			return this;
		}
	};
	m = 104;
	a[n] = m;
	c[m] = a;
	
	//系统--关闭
	//客户端收到system_close后，返回该消息到服务端
	a = o.SystemCloseReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](105);
			w[fm]();
		}
	};
	m = 105;
	a[n] = m;
	
	//服务端关闭前发送该消息通知客户端，客户端收到后将发送消息放到缓冲队列中
	a = o.SystemCloseRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 105;
	a[n] = m;
	c[m] = a;
	
	a = o.SystemNewdayRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 106;
	a[n] = m;
	c[m] = a;
	
	a = o.SystemBroadcastRsp = class {
		decode(r) {
			this.tplId = r[r3]();
			this.args = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.args[i] = r[rs]();   
			}
			this.items = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.items[i] = new o.GoodsInfo().decode(r);   
			}
			this.data = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.data[i] = r[rbs]();   
			}
			return this;
		}
	};
	m = 107;
	a[n] = m;
	c[m] = a;
	
	//系统--红点列表
	a = o.SystemRedPointListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](108);
			w[fm]();
		}
	};
	m = 108;
	a[n] = m;
	
	a = o.SystemRedPointListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 108;
	a[n] = m;
	c[m] = a;
	
	//系统--红点删除
	a = o.SystemRedPointCancelReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](109);
			w[w3](this.eventId);
			w[fm]();
		}
	};
	m = 109;
	a[n] = m;
	
	a = o.SystemRedPointCancelRsp = class {
		decode(r) {
			this.eventId = r[r3]();
			return this;
		}
	};
	m = 109;
	a[n] = m;
	c[m] = a;
	
	//系统--订阅消息
	a = o.SystemSubscribeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](110);
			w[wb](this.cancel);
			w[wy](this.topicId);
			w[fm]();
		}
	};
	m = 110;
	a[n] = m;
	
	a = o.SystemSubscribeRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 110;
	a[n] = m;
	c[m] = a;
	
	a = o.SystemServerName = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.serverId);
			w[ws](this.serverName);
			w[ws](this.xServerId);
		}
		decode(r) {
			this.serverId = r[r3]();
			this.serverName = r[rs]();
			this.xServerId = r[rs]();
			return this;
		}
	};
	
	//系统--服务器名
	a = o.SystemServerNameReq = class {
		constructor(d) {
			this.ids = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](111);
			w[w1](this.ids.length);
			for (var i = 0, len = this.ids.length; i < len; i++) {
				w[w3](this.ids[i]);   
			}
			w[fm]();
		}
	};
	m = 111;
	a[n] = m;
	
	a = o.SystemServerNameRsp = class {
		decode(r) {
			this.names = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.names[i] = new o.SystemServerName().decode(r);   
			}
			return this;
		}
	};
	m = 111;
	a[n] = m;
	c[m] = a;
	
	//系统--漫灵客服通知
	a = o.SystemManlingKfmsgRsp = class {
		decode(r) {
			this.num = r[r3]();
			return this;
		}
	};
	m = 112;
	a[n] = m;
	c[m] = a;
	
	//系统--客户端准备就绪
	a = o.SystemReadyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](113);
			w[ws](this.mobPushRid);
			w[fm]();
		}
	};
	m = 113;
	a[n] = m;
	
	a = o.SystemReadyRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 113;
	a[n] = m;
	c[m] = a;
	
	a = o.RoleScore = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.exp);
			w[w3](this.gems);
			w[w6](this.gold);
			w[w3](this.sms);
			w[w3](this.arp);
			w[w3](this.frp);
			w[w3](this.skv);
			w[w3](this.gup);
			w[w6](this.heroExp);
			w[w3](this.pass);
			w[w3](this.flip);
			w[w3](this.acpe);
			w[w3](this.career);
			w[w3](this.tavern);
			w[w3](this.survival);
			w[w3](this.vipExp);
			w[w3](this.turntable);
			w[w3](this.agate);
			w[w3](this.heroScore);
			w[w3](this.badgeExp);
			w[w3](this.adventureExp);
			w[w3](this.champion);
			w[w3](this.costume);
			w[w3](this.teamArena);
			w[w3](this.siege);
			w[w3](this.relic);
			w[w3](this.guardian);
			w[w3](this.adventureEntry);
			w[w3](this.arenaHonor);
			w[w3](this.arenaHonorWorld);
			w[w3](this.expeditionPoint);
			w[w3](this.ultimatePoint);
			w[w3](this.goldEquipPoint);
			w[w3](this.purpleEquipPoint);
		}
		decode(r) {
			this.exp = r[r3]();
			this.gems = r[r3]();
			this.gold = r[r6]();
			this.sms = r[r3]();
			this.arp = r[r3]();
			this.frp = r[r3]();
			this.skv = r[r3]();
			this.gup = r[r3]();
			this.heroExp = r[r6]();
			this.pass = r[r3]();
			this.flip = r[r3]();
			this.acpe = r[r3]();
			this.career = r[r3]();
			this.tavern = r[r3]();
			this.survival = r[r3]();
			this.vipExp = r[r3]();
			this.turntable = r[r3]();
			this.agate = r[r3]();
			this.heroScore = r[r3]();
			this.badgeExp = r[r3]();
			this.adventureExp = r[r3]();
			this.champion = r[r3]();
			this.costume = r[r3]();
			this.teamArena = r[r3]();
			this.siege = r[r3]();
			this.relic = r[r3]();
			this.guardian = r[r3]();
			this.adventureEntry = r[r3]();
			this.arenaHonor = r[r3]();
			this.arenaHonorWorld = r[r3]();
			this.expeditionPoint = r[r3]();
			this.ultimatePoint = r[r3]();
			this.goldEquipPoint = r[r3]();
			this.purpleEquipPoint = r[r3]();
			return this;
		}
	};
	
	a = o.RoleInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.id);
			w[ws](this.account);
			w[ws](this.name);
			w[w3](this.level);
			w[w3](this.power);
			w[w3](this.maxPower);
			w[wy](this.maxHeroStar);
			w[wb](this.payed);
			w[w3](this.head);
			w[w3](this.headFrame);
			w[w3](this.title);
			w[w3](this.createTime);
			w[w6](this.guildId);
			w[wy](this.guildTitle);
			w[wy](this.setting);
			w[ws](this.signContent);
			this.score.encode(w);
		}
		decode(r) {
			this.id = r[r6]();
			this.account = r[rs]();
			this.name = r[rs]();
			this.level = r[r3]();
			this.power = r[r3]();
			this.maxPower = r[r3]();
			this.maxHeroStar = r[ry]();
			this.payed = r[rb]();
			this.head = r[r3]();
			this.headFrame = r[r3]();
			this.title = r[r3]();
			this.createTime = r[r3]();
			this.guildId = r[r6]();
			this.guildTitle = r[ry]();
			this.setting = r[ry]();
			this.signContent = r[rs]();
			this.score = new o.RoleScore().decode(r);
			return this;
		}
	};
	
	a = o.RoleAttr = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.index);
			w[w6](this.value);
		}
		decode(r) {
			this.index = r[ry]();
			this.value = r[r6]();
			return this;
		}
	};
	
	//角色--登录
	a = o.RoleLoginReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](201);
			w[ws](this.account);
			w[w3](this.serverId);
			w[w3](this.channelId);
			w[ws](this.channelCode);
			w[ws](this.token);
			w[ws](this.brand);
			w[ws](this.model);
			w[w3](this.sessionId);
			w[fm]();
		}
	};
	m = 201;
	a[n] = m;
	
	a = o.RoleLoginRsp = class {
		decode(r) {
			this.errCode = r[r1]();
			this.sessionId = r[r3]();
			this.token = r[rs]();
			this.serverOpenTime = r[r3]();
			this.worldLevel = r[r3]();
			this.crossId = r[rs]();
			this.crossOpenTime = r[r3]();
			this.serverMegTime = r[r3]();
			this.serverMegCount = r[r3]();
			this.serverNum = r[r3]();
			if (r[rb]()) {
				this.role = new o.RoleInfo().decode(r);
			}
			return this;
		}
	};
	m = 201;
	a[n] = m;
	c[m] = a;
	
	//断线重连
	a = o.RoleReconnectRsp = class {
		decode(r) {
			this.succ = r[rb]();
			return this;
		}
	};
	m = 202;
	a[n] = m;
	c[m] = a;
	
	//角色--创建角色
	a = o.RoleCreateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](203);
			w[ws](this.name);
			w[fm]();
		}
	};
	m = 203;
	a[n] = m;
	
	//角色--更新信息
	a = o.RoleUpdateRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RoleAttr().decode(r);   
			}
			return this;
		}
	};
	m = 204;
	a[n] = m;
	c[m] = a;
	
	//角色--修改名称
	a = o.RoleRenameReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](205);
			w[ws](this.name);
			w[wb](this.isFemale);
			w[fm]();
		}
	};
	m = 205;
	a[n] = m;
	
	a = o.RoleRenameRsp = class {
		decode(r) {
			this.errCode = r[r1]();
			this.name = r[rs]();
			return this;
		}
	};
	m = 205;
	a[n] = m;
	c[m] = a;
	
	//玩家名片
	a = o.RoleBrief = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.id);
			w[w3](this.head);
			w[ws](this.name);
			w[w3](this.level);
			w[w3](this.power);
			w[w3](this.logoutTime);
			w[w3](this.headFrame);
			w[w3](this.title);
			w[w3](this.vipExp);
			w[w6](this.guildId);
			w[wb](this.isFemale);
		}
		decode(r) {
			this.id = r[r6]();
			this.head = r[r3]();
			this.name = r[rs]();
			this.level = r[r3]();
			this.power = r[r3]();
			this.logoutTime = r[r3]();
			this.headFrame = r[r3]();
			this.title = r[r3]();
			this.vipExp = r[r3]();
			this.guildId = r[r6]();
			this.isFemale = r[rb]();
			return this;
		}
	};
	
	a = o.HeroImage = class {
		constructor(d) {
			this.slots = [];
			this.runes = [];
			this.skills = [];
			this.costumes = [];
			this.mysticSkills = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.typeId);
			w[w3](this.level);
			w[w3](this.careerId);
			w[w3](this.careerLv);
			w[w3](this.soldierId);
			w[wy](this.star);
			w[w3](this.power);
			w[w1](this.slots.length);
			for (var i = 0, len = this.slots.length; i < len; i++) {
				this.slots[i].encode(w);   
			}
			w[w1](this.runes.length);
			for (var i = 0, len = this.runes.length; i < len; i++) {
				w[w3](this.runes[i]);   
			}
			w[w1](this.skills.length);
			for (var i = 0, len = this.skills.length; i < len; i++) {
				w[w3](this.skills[i]);   
			}
			w[w3](this.hpW);
			w[w3](this.hpG);
			w[w3](this.atkW);
			w[w3](this.atkG);
			w[w3](this.defW);
			w[w3](this.defG);
			w[w3](this.hitW);
			w[w3](this.hitG);
			w[w3](this.critW);
			w[w3](this.critG);
			w[w3](this.dodgeW);
			w[w3](this.dodgeG);
			w[w3](this.critV);
			w[w3](this.critVRes);
			w[w3](this.atkDmg);
			w[w3](this.atkRes);
			w[w3](this.dmgPunc);
			w[w3](this.puncRes);
			w[w3](this.dmgRadi);
			w[w3](this.radiRes);
			w[w3](this.dmgFire);
			w[w3](this.fireRes);
			w[w3](this.dmgCold);
			w[w3](this.coldRes);
			w[w3](this.dmgElec);
			w[w3](this.elecRes);
			w[w1](this.costumes.length);
			for (var i = 0, len = this.costumes.length; i < len; i++) {
				this.costumes[i].encode(w);   
			}
			if (!this.guardian) {
				w[wb](false);
			} else {
				w[wb](true);
				this.guardian.encode(w);
			}
			w[w1](this.mysticSkills.length);
			for (var i = 0, len = this.mysticSkills.length; i < len; i++) {
				w[wy](this.mysticSkills[i]);   
			}
			if (!this.uniqueEquip) {
				w[wb](false);
			} else {
				w[wb](true);
				this.uniqueEquip.encode(w);
			}
		}
		decode(r) {
			this.typeId = r[r3]();
			this.level = r[r3]();
			this.careerId = r[r3]();
			this.careerLv = r[r3]();
			this.soldierId = r[r3]();
			this.star = r[ry]();
			this.power = r[r3]();
			this.slots = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.slots[i] = new o.HeroEquipSlot().decode(r);   
			}
			this.runes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.runes[i] = r[r3]();   
			}
			this.skills = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.skills[i] = r[r3]();   
			}
			this.hpW = r[r3]();
			this.hpG = r[r3]();
			this.atkW = r[r3]();
			this.atkG = r[r3]();
			this.defW = r[r3]();
			this.defG = r[r3]();
			this.hitW = r[r3]();
			this.hitG = r[r3]();
			this.critW = r[r3]();
			this.critG = r[r3]();
			this.dodgeW = r[r3]();
			this.dodgeG = r[r3]();
			this.critV = r[r3]();
			this.critVRes = r[r3]();
			this.atkDmg = r[r3]();
			this.atkRes = r[r3]();
			this.dmgPunc = r[r3]();
			this.puncRes = r[r3]();
			this.dmgRadi = r[r3]();
			this.radiRes = r[r3]();
			this.dmgFire = r[r3]();
			this.fireRes = r[r3]();
			this.dmgCold = r[r3]();
			this.coldRes = r[r3]();
			this.dmgElec = r[r3]();
			this.elecRes = r[r3]();
			this.costumes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.costumes[i] = new o.CostumeInfo().decode(r);   
			}
			if (r[rb]()) {
				this.guardian = new o.Guardian().decode(r);
			}
			this.mysticSkills = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.mysticSkills[i] = r[ry]();   
			}
			if (r[rb]()) {
				this.uniqueEquip = new o.UniqueEquip().decode(r);
			}
			return this;
		}
	};
	
	a = o.HeroBrief = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.heroId);
			w[w3](this.typeId);
			w[w3](this.level);
			w[wy](this.star);
			w[w3](this.power);
			w[w3](this.careerId);
			w[w3](this.careerLv);
			w[w3](this.soldierId);
		}
		decode(r) {
			this.heroId = r[r3]();
			this.typeId = r[r3]();
			this.level = r[r3]();
			this.star = r[ry]();
			this.power = r[r3]();
			this.careerId = r[r3]();
			this.careerLv = r[r3]();
			this.soldierId = r[r3]();
			return this;
		}
		get color() {
			let ConfigManager = window['ConfigManager'];
			let config = ConfigManager['_config'];
			let cfg = ConfigManager.getItemById(config.Hero_starCfg, this.star);
			return cfg.color;
		}
	};
	
	a = o.HonorData = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.key);
			w[w3](this.value);
		}
		decode(r) {
			this.key = r[r3]();
			this.value = r[r3]();
			return this;
		}
	};
	
	a = o.HeroBriefExt = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.heroBrief.encode(w);
			if (!this.guardian) {
				w[wb](false);
			} else {
				w[wb](true);
				this.guardian.encode(w);
			}
		}
		decode(r) {
			this.heroBrief = new o.HeroBrief().decode(r);
			if (r[rb]()) {
				this.guardian = new o.Guardian().decode(r);
			}
			return this;
		}
	};
	
	a = o.HeadFrame = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.endTime);
		}
		decode(r) {
			this.id = r[r3]();
			this.endTime = r[r3]();
			return this;
		}
	};
	
	a = o.Title = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.endTime);
		}
		decode(r) {
			this.id = r[r3]();
			this.endTime = r[r3]();
			return this;
		}
	};
	
	//角色--获取名片
	a = o.RoleImageReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](206);
			w[wy](this.type);
			w[wy](this.index);
			w[w6](this.playerId);
			w[wy](this.arrayType);
			w[fm]();
		}
	};
	m = 206;
	a[n] = m;
	
	a = o.RoleHonor = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.trial);
			w[w3](this.ruin);
			w[w3](this.arenaRank);
			w[w3](this.vault);
			w[w3](this.champion);
			w[w3](this.adventure);
			w[w3](this.ordeal);
			w[w3](this.teamArena);
			w[w3](this.peak);
			w[w3](this.foothold);
		}
		decode(r) {
			this.trial = r[r3]();
			this.ruin = r[r3]();
			this.arenaRank = r[r3]();
			this.vault = r[r3]();
			this.champion = r[r3]();
			this.adventure = r[r3]();
			this.ordeal = r[r3]();
			this.teamArena = r[r3]();
			this.peak = r[r3]();
			this.foothold = r[r3]();
			return this;
		}
	};
	
	a = o.RoleImageRsp = class {
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.elite = r[r3]();
			this.mainline = r[r3]();
			this.heroes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroes[i] = new o.HeroBriefExt().decode(r);   
			}
			this.arenaScore = r[r3]();
			this.signContent = r[rs]();
			this.guildName = r[rs]();
			this.isGuildMaster = r[rb]();
			this.type = r[ry]();
			this.honor = new o.RoleHonor().decode(r);
			return this;
		}
	};
	m = 206;
	a[n] = m;
	c[m] = a;
	
	//角色--名片英雄信息
	a = o.RoleHeroImageReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](207);
			w[wy](this.type);
			w[wy](this.index);
			w[w6](this.playerId);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 207;
	a[n] = m;
	
	a = o.RoleHeroImageRsp = class {
		decode(r) {
			this.hero = new o.HeroImage().decode(r);
			this.type = r[ry]();
			return this;
		}
	};
	m = 207;
	a[n] = m;
	c[m] = a;
	
	//角色--设置头像
	a = o.RoleHeadReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](208);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 208;
	a[n] = m;
	
	a = o.RoleHeadRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			return this;
		}
	};
	m = 208;
	a[n] = m;
	c[m] = a;
	
	//角色--设置头像框
	a = o.RoleFrameReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](209);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 209;
	a[n] = m;
	
	a = o.RoleFrameRsp = class {
		decode(r) {
			this.id = r[r3]();
			return this;
		}
	};
	m = 209;
	a[n] = m;
	c[m] = a;
	
	//角色--设置称号
	a = o.RoleTitleReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](210);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 210;
	a[n] = m;
	
	a = o.RoleTitleRsp = class {
		decode(r) {
			this.id = r[r3]();
			return this;
		}
	};
	m = 210;
	a[n] = m;
	c[m] = a;
	
	//角色--名片装备信息
	a = o.RoleEquipImageReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](211);
			w[w6](this.playerId);
			w[w3](this.heroIdx);
			w[w3](this.equipType);
			w[fm]();
		}
	};
	m = 211;
	a[n] = m;
	
	a = o.RoleEquipImageRsp = class {
		decode(r) {
			if (r[rb]()) {
				this.equip = new o.EquipInfo().decode(r);
			}
			return this;
		}
	};
	m = 211;
	a[n] = m;
	c[m] = a;
	
	//角色--拥有的头像框
	a = o.RoleAllFramesInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](212);
			w[fm]();
		}
	};
	m = 212;
	a[n] = m;
	
	a = o.RoleAllFramesInfoRsp = class {
		decode(r) {
			this.headFrames = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.headFrames[i] = new o.HeadFrame().decode(r);   
			}
			return this;
		}
	};
	m = 212;
	a[n] = m;
	c[m] = a;
	
	//角色--拥有的称号
	a = o.RoleAllTitlesInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](213);
			w[fm]();
		}
	};
	m = 213;
	a[n] = m;
	
	a = o.RoleAllTitlesInfoRsp = class {
		decode(r) {
			this.titles = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.titles[i] = new o.Title().decode(r);   
			}
			return this;
		}
	};
	m = 213;
	a[n] = m;
	c[m] = a;
	
	//增加获得的头像框，会刷新所有英雄的属性，需要前端主动更新所有英雄战力信息
	a = o.RoleAllFramesAddRsp = class {
		decode(r) {
			this.id = new o.HeadFrame().decode(r);
			return this;
		}
	};
	m = 214;
	a[n] = m;
	c[m] = a;
	
	//增加获得的称号，会刷新所有英雄的属性，需要前端主动更新所有英雄战力信息
	a = o.RoleAllTitlesAddRsp = class {
		decode(r) {
			this.add = new o.Title().decode(r);
			this.del = r[r3]();
			return this;
		}
	};
	m = 215;
	a[n] = m;
	c[m] = a;
	
	//角色--个性签名
	a = o.RoleSignContentReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](216);
			w[ws](this.content);
			w[fm]();
		}
	};
	m = 216;
	a[n] = m;
	
	a = o.RoleSignContentRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 216;
	a[n] = m;
	c[m] = a;
	
	//角色--个性设置
	a = o.RoleSetReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](217);
			w[wy](this.setting);
			w[fm]();
		}
	};
	m = 217;
	a[n] = m;
	
	a = o.RoleSetRsp = class {
		decode(r) {
			this.setting = r[ry]();
			return this;
		}
	};
	m = 217;
	a[n] = m;
	c[m] = a;
	
	//角色--防沉迷
	a = o.RoleAntiaddictionReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](218);
			w[wy](this.age);
			w[fm]();
		}
	};
	m = 218;
	a[n] = m;
	
	a = o.RoleAntiaddictionRsp = class {
		decode(r) {
			this.age = r[ry]();
			this.drawNum = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.drawNum[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 218;
	a[n] = m;
	c[m] = a;
	
	//角色--请求缓存
	a = o.RoleCookieGetReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](219);
			w[fm]();
		}
	};
	m = 219;
	a[n] = m;
	
	a = o.RoleCookieGetRsp = class {
		decode(r) {
			this.cookie = r[rs]();
			return this;
		}
	};
	m = 219;
	a[n] = m;
	c[m] = a;
	
	//角色--设置缓存
	a = o.RoleCookieSetReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](220);
			w[ws](this.cookie);
			w[fm]();
		}
	};
	m = 220;
	a[n] = m;
	
	a = o.RoleCookieSetRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 220;
	a[n] = m;
	c[m] = a;
	
	//角色--vip已购买特权礼包
	a = o.RoleVipBoughtFlagReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](221);
			w[fm]();
		}
	};
	m = 221;
	a[n] = m;
	
	a = o.RoleVipBoughtFlagRsp = class {
		decode(r) {
			this.boughtFlag = r[r3]();
			this.mCRewardTime = r[r3]();
			return this;
		}
	};
	m = 221;
	a[n] = m;
	c[m] = a;
	
	//角色--vip购买特权礼包
	a = o.RoleVipBuyGiftReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](222);
			w[wy](this.vipLv);
			w[fm]();
		}
	};
	m = 222;
	a[n] = m;
	
	a = o.RoleVipBuyGiftRsp = class {
		decode(r) {
			this.boughtFlag = r[r3]();
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 222;
	a[n] = m;
	c[m] = a;
	
	//角色--vip领取月卡每日奖励
	a = o.RoleVipMCDailyRewardsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](223);
			w[fm]();
		}
	};
	m = 223;
	a[n] = m;
	
	a = o.RoleVipMCDailyRewardsRsp = class {
		decode(r) {
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 223;
	a[n] = m;
	c[m] = a;
	
	//角色--改名次数
	a = o.RoleRenameNumReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](224);
			w[fm]();
		}
	};
	m = 224;
	a[n] = m;
	
	a = o.RoleRenameNumRsp = class {
		decode(r) {
			this.num = r[r3]();
			return this;
		}
	};
	m = 224;
	a[n] = m;
	c[m] = a;
	
	//头像框过期，会刷新所有英雄的属性，需要前端主动更新所有英雄战力信息
	a = o.RoleHeadFramesExpireRsp = class {
		decode(r) {
			this.id = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.id[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 225;
	a[n] = m;
	c[m] = a;
	
	//称号过期，会刷新所有英雄的属性，需要前端主动更新所有英雄战力信息
	a = o.RoleTitlesExpireRsp = class {
		decode(r) {
			this.id = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.id[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 226;
	a[n] = m;
	c[m] = a;
	
	//聊天--发送信息
	a = o.ChatSendReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](301);
			w[wy](this.channel);
			w[w6](this.targetId);
			w[ws](this.content);
			w[fm]();
		}
	};
	m = 301;
	a[n] = m;
	
	a = o.ChatSendRsp = class {
		decode(r) {
			this.channel = r[ry]();
			this.playerId = r[r6]();
			this.playerName = r[rs]();
			this.playerLv = r[r3]();
			this.playerHead = r[r3]();
			this.playerFrame = r[r3]();
			this.playerTitle = r[r3]();
			this.playerVipExp = r[r3]();
			this.guildName = r[rs]();
			this.chatTime = r[r3]();
			this.content = r[rs]();
			return this;
		}
	};
	m = 301;
	a[n] = m;
	c[m] = a;
	
	//聊天--最近记录
	a = o.ChatHistoryReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](302);
			w[fm]();
		}
	};
	m = 302;
	a[n] = m;
	
	//分享--分享信息
	a = o.ShareImageReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](303);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 303;
	a[n] = m;
	
	a = o.ShareImageRsp = class {
		decode(r) {
			this.shareId = r[rs]();
			return this;
		}
	};
	m = 303;
	a[n] = m;
	c[m] = a;
	
	//分享--信息查看
	a = o.ShareInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](304);
			w[ws](this.shareId);
			w[fm]();
		}
	};
	m = 304;
	a[n] = m;
	
	a = o.ShareInfoRsp = class {
		decode(r) {
			this.info = new o.HeroImage().decode(r);
			return this;
		}
	};
	m = 304;
	a[n] = m;
	c[m] = a;
	
	a = o.MailAttach = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.typeId);
			w[w3](this.num);
		}
		decode(r) {
			this.typeId = r[r3]();
			this.num = r[r3]();
			return this;
		}
	};
	
	a = o.MailInfo = class {
		constructor(d) {
			this.attachs = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[wb](this.fromGm);
			w[ws](this.title);
			w[w3](this.startTime);
			w[w3](this.endTime);
			w[wb](this.isRead);
			w[w1](this.attachs.length);
			for (var i = 0, len = this.attachs.length; i < len; i++) {
				this.attachs[i].encode(w);   
			}
		}
		decode(r) {
			this.id = r[r3]();
			this.fromGm = r[rb]();
			this.title = r[rs]();
			this.startTime = r[r3]();
			this.endTime = r[r3]();
			this.isRead = r[rb]();
			this.attachs = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.attachs[i] = new o.MailAttach().decode(r);   
			}
			return this;
		}
	};
	
	//邮件--邮件列表
	a = o.MailListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](401);
			w[w3](this.mailTime);
			w[fm]();
		}
	};
	m = 401;
	a[n] = m;
	
	a = o.MailListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.MailInfo().decode(r);   
			}
			return this;
		}
	};
	m = 401;
	a[n] = m;
	c[m] = a;
	
	//邮件--阅读邮件
	a = o.MailReadReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](402);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 402;
	a[n] = m;
	
	a = o.MailReadRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.content = r[rs]();
			this.isRead = r[rb]();
			return this;
		}
	};
	m = 402;
	a[n] = m;
	c[m] = a;
	
	//邮件--提取附件
	a = o.MailDrawReq = class {
		constructor(d) {
			this.ids = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](403);
			w[w1](this.ids.length);
			for (var i = 0, len = this.ids.length; i < len; i++) {
				w[w3](this.ids[i]);   
			}
			w[fm]();
		}
	};
	m = 403;
	a[n] = m;
	
	a = o.MailDrawRsp = class {
		decode(r) {
			this.ids = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.ids[i] = r[r3]();   
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 403;
	a[n] = m;
	c[m] = a;
	
	//邮件--删除邮件
	a = o.MailDeleteReq = class {
		constructor(d) {
			this.ids = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](404);
			w[w1](this.ids.length);
			for (var i = 0, len = this.ids.length; i < len; i++) {
				w[w3](this.ids[i]);   
			}
			w[fm]();
		}
	};
	m = 404;
	a[n] = m;
	
	a = o.MailDeleteRsp = class {
		decode(r) {
			this.ids = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.ids[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 404;
	a[n] = m;
	c[m] = a;
	
	a = o.MailUpdateRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.MailInfo().decode(r);   
			}
			return this;
		}
	};
	m = 405;
	a[n] = m;
	c[m] = a;
	
	a = o.MailNoticeRsp = class {
		decode(r) {
			this.receivers = r[rs]();
			this.levels = r[rs]();
			return this;
		}
	};
	m = 406;
	a[n] = m;
	c[m] = a;
	
	a = o.Friend = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w3](this.elite);
			w[w3](this.mainline);
			w[wy](this.friendship);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.elite = r[r3]();
			this.mainline = r[r3]();
			this.friendship = r[ry]();
			return this;
		}
	};
	
	//好友--好友列表
	a = o.FriendListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](501);
			w[fm]();
		}
	};
	m = 501;
	a[n] = m;
	
	a = o.FriendListRsp = class {
		decode(r) {
			this.friends = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.friends[i] = new o.Friend().decode(r);   
			}
			this.invites = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.invites[i] = new o.RoleBrief().decode(r);   
			}
			return this;
		}
	};
	m = 501;
	a[n] = m;
	c[m] = a;
	
	//好友--黑名单列表
	a = o.FriendBlacklistReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](502);
			w[fm]();
		}
	};
	m = 502;
	a[n] = m;
	
	a = o.FriendBlacklistRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RoleBrief().decode(r);   
			}
			return this;
		}
	};
	m = 502;
	a[n] = m;
	c[m] = a;
	
	//好友--加入黑名单
	a = o.FriendBlacklistInReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](503);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 503;
	a[n] = m;
	
	a = o.FriendBlacklistInRsp = class {
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			return this;
		}
	};
	m = 503;
	a[n] = m;
	c[m] = a;
	
	//好友--移出黑名单
	a = o.FriendBlacklistOutReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](504);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 504;
	a[n] = m;
	
	a = o.FriendBlacklistOutRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			return this;
		}
	};
	m = 504;
	a[n] = m;
	c[m] = a;
	
	//好友--好友申请
	a = o.FriendRequestReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](505);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 505;
	a[n] = m;
	
	a = o.FriendRequestRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			return this;
		}
	};
	m = 505;
	a[n] = m;
	c[m] = a;
	
	a = o.FriendInviteRsp = class {
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			return this;
		}
	};
	m = 506;
	a[n] = m;
	c[m] = a;
	
	//好友--拒签申请
	a = o.FriendRefuseReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](507);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 507;
	a[n] = m;
	
	a = o.FriendRefuseRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			return this;
		}
	};
	m = 507;
	a[n] = m;
	c[m] = a;
	
	//好友--同意申请
	a = o.FriendBecomeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](508);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 508;
	a[n] = m;
	
	a = o.FriendBecomeRsp = class {
		decode(r) {
			this.friend = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.friend[i] = new o.RoleBrief().decode(r);   
			}
			return this;
		}
	};
	m = 508;
	a[n] = m;
	c[m] = a;
	
	//好友--删除好友
	a = o.FriendDeleteReq = class {
		constructor(d) {
			this.playerIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](509);
			w[w1](this.playerIds.length);
			for (var i = 0, len = this.playerIds.length; i < len; i++) {
				w[w6](this.playerIds[i]);   
			}
			w[fm]();
		}
	};
	m = 509;
	a[n] = m;
	
	a = o.FriendDeleteRsp = class {
		decode(r) {
			this.playerIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.playerIds[i] = r[r6]();   
			}
			return this;
		}
	};
	m = 509;
	a[n] = m;
	c[m] = a;
	
	//好友--推荐列表
	a = o.FriendRecommendReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](510);
			w[fm]();
		}
	};
	m = 510;
	a[n] = m;
	
	a = o.FriendRecommendRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RoleBrief().decode(r);   
			}
			return this;
		}
	};
	m = 510;
	a[n] = m;
	c[m] = a;
	
	//好友--搜索好友
	a = o.FriendSearchReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](511);
			w[ws](this.name);
			w[fm]();
		}
	};
	m = 511;
	a[n] = m;
	
	a = o.FriendSearchRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RoleBrief().decode(r);   
			}
			return this;
		}
	};
	m = 511;
	a[n] = m;
	c[m] = a;
	
	//好友--赠送友谊
	a = o.FriendGiveReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](512);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 512;
	a[n] = m;
	
	a = o.FriendGiveRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			return this;
		}
	};
	m = 512;
	a[n] = m;
	c[m] = a;
	
	//好友--领取友谊
	a = o.FriendTakeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](513);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 513;
	a[n] = m;
	
	a = o.FriendTakeRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			this.addPoints = r[r3]();
			return this;
		}
	};
	m = 513;
	a[n] = m;
	c[m] = a;
	
	//收到友谊
	a = o.FriendReceiveRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			return this;
		}
	};
	m = 514;
	a[n] = m;
	c[m] = a;
	
	//好友--改名通知
	a = o.FriendRenameNoticeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](515);
			w[ws](this.oldName);
			w[ws](this.newName);
			w[fm]();
		}
	};
	m = 515;
	a[n] = m;
	
	a = o.FriendRenameNoticeRsp = class {
		decode(r) {
			this.noticeType = r[ry]();
			this.oldName = r[rs]();
			this.newName = r[rs]();
			return this;
		}
	};
	m = 515;
	a[n] = m;
	c[m] = a;
	
	a = o.GoodsInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.typeId);
			w[w3](this.num);
		}
		decode(r) {
			this.typeId = r[r3]();
			this.num = r[r3]();
			return this;
		}
	};
	
	a = o.ItemInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.itemId);
			w[w3](this.itemNum);
		}
		decode(r) {
			this.itemId = r[r3]();
			this.itemNum = r[r3]();
			return this;
		}
	};
	
	//道具--道具列表
	a = o.ItemListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](601);
			w[fm]();
		}
	};
	m = 601;
	a[n] = m;
	
	a = o.ItemListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.ItemInfo().decode(r);   
			}
			this.used = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.used[i] = new o.ItemInfo().decode(r);   
			}
			return this;
		}
	};
	m = 601;
	a[n] = m;
	c[m] = a;
	
	a = o.ItemUpdateRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.ItemInfo().decode(r);   
			}
			return this;
		}
	};
	m = 602;
	a[n] = m;
	c[m] = a;
	
	//道具--道具分解
	a = o.ItemDisintReq = class {
		constructor(d) {
			this.items = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](603);
			w[w3](this.index);
			w[w1](this.items.length);
			for (var i = 0, len = this.items.length; i < len; i++) {
				this.items[i].encode(w);   
			}
			w[fm]();
		}
	};
	m = 603;
	a[n] = m;
	
	a = o.ItemDisintRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			this.used = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.used[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 603;
	a[n] = m;
	c[m] = a;
	
	//道具--道具合成
	a = o.ItemComposeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](604);
			w[w3](this.stuffId);
			w[w3](this.num);
			w[fm]();
		}
	};
	m = 604;
	a[n] = m;
	
	a = o.ItemComposeRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 604;
	a[n] = m;
	c[m] = a;
	
	a = o.EquipInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.equipId);
			w[w3](this.equipNum);
		}
		decode(r) {
			this.equipId = r[r3]();
			this.equipNum = r[r3]();
			return this;
		}
	};
	
	//装备--列表
	a = o.EquipListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](701);
			w[fm]();
		}
	};
	m = 701;
	a[n] = m;
	
	a = o.EquipListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.EquipInfo().decode(r);   
			}
			return this;
		}
	};
	m = 701;
	a[n] = m;
	c[m] = a;
	
	a = o.EquipUpdateRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.EquipInfo().decode(r);   
			}
			this.deleteList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.deleteList[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 702;
	a[n] = m;
	c[m] = a;
	
	//装备--分解（出售)
	a = o.EquipDisintReq = class {
		constructor(d) {
			this.equipList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](703);
			w[w1](this.equipList.length);
			for (var i = 0, len = this.equipList.length; i < len; i++) {
				this.equipList[i].encode(w);   
			}
			w[fm]();
		}
	};
	m = 703;
	a[n] = m;
	
	a = o.EquipDisintRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 703;
	a[n] = m;
	c[m] = a;
	
	//装备--合成
	a = o.EquipComposeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](704);
			w[w3](this.materialTypeId);
			w[w3](this.composeNumber);
			w[fm]();
		}
	};
	m = 704;
	a[n] = m;
	
	a = o.EquipComposeRsp = class {
		decode(r) {
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 704;
	a[n] = m;
	c[m] = a;
	
	//装备--一键合成
	a = o.EquipComposeRecursiveReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](705);
			w[wy](this.partId);
			w[fm]();
		}
	};
	m = 705;
	a[n] = m;
	
	a = o.EquipComposeRecursiveRsp = class {
		decode(r) {
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 705;
	a[n] = m;
	c[m] = a;
	
	a = o.HeroEquipSlot = class {
		constructor(d) {
			this.rubies = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.equipId);
			w[w1](this.rubies.length);
			for (var i = 0, len = this.rubies.length; i < len; i++) {
				w[w3](this.rubies[i]);   
			}
		}
		decode(r) {
			this.equipId = r[r3]();
			this.rubies = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rubies[i] = r[r3]();   
			}
			return this;
		}
	};
	
	a = o.HeroInfo = class {
		constructor(d) {
			this.slots = [];
			this.runes = [];
			this.costumeIds = [];
			this.mysticSkills = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.heroId);
			w[w3](this.typeId);
			w[w3](this.careerId);
			w[w3](this.soldierId);
			w[wy](this.star);
			w[w3](this.level);
			w[w1](this.slots.length);
			for (var i = 0, len = this.slots.length; i < len; i++) {
				this.slots[i].encode(w);   
			}
			w[w1](this.runes.length);
			for (var i = 0, len = this.runes.length; i < len; i++) {
				w[w3](this.runes[i]);   
			}
			w[w1](this.costumeIds.length);
			for (var i = 0, len = this.costumeIds.length; i < len; i++) {
				this.costumeIds[i].encode(w);   
			}
			w[w3](this.power);
			w[w3](this.careerLv);
			w[wy](this.status);
			w[w3](this.soldierSkin);
			if (!this.guardian) {
				w[wb](false);
			} else {
				w[wb](true);
				this.guardian.encode(w);
			}
			w[w3](this.mysticLink);
			w[w1](this.mysticSkills.length);
			for (var i = 0, len = this.mysticSkills.length; i < len; i++) {
				w[wy](this.mysticSkills[i]);   
			}
			if (!this.uniqueEquip) {
				w[wb](false);
			} else {
				w[wb](true);
				this.uniqueEquip.encode(w);
			}
		}
		decode(r) {
			this.heroId = r[r3]();
			this.typeId = r[r3]();
			this.careerId = r[r3]();
			this.soldierId = r[r3]();
			this.star = r[ry]();
			this.level = r[r3]();
			this.slots = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.slots[i] = new o.HeroEquipSlot().decode(r);   
			}
			this.runes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.runes[i] = r[r3]();   
			}
			this.costumeIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.costumeIds[i] = new o.CostumeInfo().decode(r);   
			}
			this.power = r[r3]();
			this.careerLv = r[r3]();
			this.status = r[ry]();
			this.soldierSkin = r[r3]();
			if (r[rb]()) {
				this.guardian = new o.Guardian().decode(r);
			}
			this.mysticLink = r[r3]();
			this.mysticSkills = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.mysticSkills[i] = r[ry]();   
			}
			if (r[rb]()) {
				this.uniqueEquip = new o.UniqueEquip().decode(r);
			}
			return this;
		}
		get needTips() {
			return (this.status & 1) == 0;
		}

		set sthFighted(state) {
		this.status = this.status & 0xfd | (state ? 2 : 0)
		}

		get sthFighted() {//今日进行过据点战
			return (this.status & 2) > 0;
		}

		get switchFlag() {
			return (this.status & 1);
		}


		get exp() {
			return 0;
		}

		set exp(n) {
		}
		
		get color() {
			let ConfigManager = window['ConfigManager'];
			let config = ConfigManager['_config'];
			let cfg = ConfigManager.getItemById(config.Hero_starCfg, this.star);
			return cfg.color;
		}
	};
	
	//转职升阶使用
	a = o.HeroDetail = class {
		constructor(d) {
			this.skills = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			this.attr.encode(w);
			w[w1](this.skills.length);
			for (var i = 0, len = this.skills.length; i < len; i++) {
				w[w3](this.skills[i]);   
			}
			w[w3](this.power);
		}
		decode(r) {
			this.attr = new o.HeroAttr().decode(r);
			this.skills = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.skills[i] = r[r3]();   
			}
			this.power = r[r3]();
			return this;
		}
	};
	
	a = o.HeroAttr = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.hpW);
			w[w3](this.atkW);
			w[w3](this.defW);
			w[w3](this.hitW);
			w[w3](this.dodgeW);
			w[w3](this.critW);
			w[w3](this.hurtW);
			w[w3](this.hpG);
			w[w3](this.atkG);
			w[w3](this.defG);
			w[w3](this.hitG);
			w[w3](this.dodgeG);
			w[w3](this.critG);
			w[w3](this.hurtG);
			w[w3](this.atkOrder);
			w[w3](this.defPene);
			w[w3](this.critRes);
			w[w3](this.hurtRes);
			w[w3](this.puncRes);
			w[w3](this.radiRes);
			w[w3](this.elecRes);
			w[w3](this.fireRes);
			w[w3](this.coldRes);
			w[w3](this.critV);
			w[w3](this.critVRes);
			w[w3](this.atkRes);
			w[w3](this.dmgPunc);
			w[w3](this.dmgRadi);
			w[w3](this.dmgElec);
			w[w3](this.dmgFire);
			w[w3](this.dmgCold);
			w[w3](this.atkDmg);
			w[w3](this.addSoldierHp);
			w[w3](this.addSoldierAtk);
			w[w3](this.addSoldierDef);
			w[w3](this.atkSpeedR);
			w[w3](this.dmgRes);
			w[w3](this.healthy);
			w[w3](this.powerRes);
		}
		decode(r) {
			this.hpW = r[r3]();
			this.atkW = r[r3]();
			this.defW = r[r3]();
			this.hitW = r[r3]();
			this.dodgeW = r[r3]();
			this.critW = r[r3]();
			this.hurtW = r[r3]();
			this.hpG = r[r3]();
			this.atkG = r[r3]();
			this.defG = r[r3]();
			this.hitG = r[r3]();
			this.dodgeG = r[r3]();
			this.critG = r[r3]();
			this.hurtG = r[r3]();
			this.atkOrder = r[r3]();
			this.defPene = r[r3]();
			this.critRes = r[r3]();
			this.hurtRes = r[r3]();
			this.puncRes = r[r3]();
			this.radiRes = r[r3]();
			this.elecRes = r[r3]();
			this.fireRes = r[r3]();
			this.coldRes = r[r3]();
			this.critV = r[r3]();
			this.critVRes = r[r3]();
			this.atkRes = r[r3]();
			this.dmgPunc = r[r3]();
			this.dmgRadi = r[r3]();
			this.dmgElec = r[r3]();
			this.dmgFire = r[r3]();
			this.dmgCold = r[r3]();
			this.atkDmg = r[r3]();
			this.addSoldierHp = r[r3]();
			this.addSoldierAtk = r[r3]();
			this.addSoldierDef = r[r3]();
			this.atkSpeedR = r[r3]();
			this.dmgRes = r[r3]();
			this.healthy = r[r3]();
			this.powerRes = r[r3]();
			return this;
		}
	};
	
	a = o.HeroSoldier = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.soldierId);
			w[w3](this.hpW);
			w[w3](this.atkW);
			w[w3](this.defW);
			w[w3](this.hpG);
			w[w3](this.atkG);
			w[w3](this.defG);
		}
		decode(r) {
			this.soldierId = r[r3]();
			this.hpW = r[r3]();
			this.atkW = r[r3]();
			this.defW = r[r3]();
			this.hpG = r[r3]();
			this.atkG = r[r3]();
			this.defG = r[r3]();
			return this;
		}
	};
	
	//英雄--列表
	a = o.HeroListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](801);
			w[fm]();
		}
	};
	m = 801;
	a[n] = m;
	
	a = o.HeroListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.HeroInfo().decode(r);   
			}
			return this;
		}
	};
	m = 801;
	a[n] = m;
	c[m] = a;
	
	a = o.HeroUpdateRsp = class {
		decode(r) {
			this.updateList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.updateList[i] = new o.HeroInfo().decode(r);   
			}
			this.deleteList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.deleteList[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 802;
	a[n] = m;
	c[m] = a;
	
	//只是更新英雄战斗力，不飘字
	a = o.HeroPowerUpdateRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.power = r[r3]();
			return this;
		}
	};
	m = 803;
	a[n] = m;
	c[m] = a;
	
	//更新英雄属性和战斗力
	a = o.HeroAttrRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.power = r[r3]();
			this.attr = new o.HeroAttr().decode(r);
			return this;
		}
	};
	m = 804;
	a[n] = m;
	c[m] = a;
	
	//英雄--详细信息
	a = o.HeroDetailReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](805);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 805;
	a[n] = m;
	
	a = o.HeroDetailRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.detail = new o.HeroDetail().decode(r);
			return this;
		}
	};
	m = 805;
	a[n] = m;
	c[m] = a;
	
	//英雄--穿戴装备
	a = o.HeroEquipOnReq = class {
		constructor(d) {
			this.equipIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](806);
			w[w3](this.heroId);
			w[w1](this.equipIds.length);
			for (var i = 0, len = this.equipIds.length; i < len; i++) {
				w[w3](this.equipIds[i]);   
			}
			w[fm]();
		}
	};
	m = 806;
	a[n] = m;
	
	//英雄--脱下装备
	a = o.HeroEquipOffReq = class {
		constructor(d) {
			this.equipParts = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](807);
			w[w3](this.heroId);
			w[w1](this.equipParts.length);
			for (var i = 0, len = this.equipParts.length; i < len; i++) {
				w[wy](this.equipParts[i]);   
			}
			w[fm]();
		}
	};
	m = 807;
	a[n] = m;
	
	//英雄--装备更新
	a = o.HeroEquipUpdateRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.equips = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.equips[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 808;
	a[n] = m;
	c[m] = a;
	
	//英雄--升级
	a = o.HeroLevelupReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](809);
			w[w3](this.heroId);
			w[w3](this.addLv);
			w[fm]();
		}
	};
	m = 809;
	a[n] = m;
	
	a = o.HeroLevelupRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.heroLv = r[r3]();
			return this;
		}
	};
	m = 809;
	a[n] = m;
	c[m] = a;
	
	//英雄--升星
	a = o.HeroStarupReq = class {
		constructor(d) {
			this.materials1 = [];
			this.materials2 = [];
			this.materials3 = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](810);
			w[w3](this.heroId);
			w[w1](this.materials1.length);
			for (var i = 0, len = this.materials1.length; i < len; i++) {
				w[w3](this.materials1[i]);   
			}
			w[w1](this.materials2.length);
			for (var i = 0, len = this.materials2.length; i < len; i++) {
				w[w3](this.materials2[i]);   
			}
			w[w1](this.materials3.length);
			for (var i = 0, len = this.materials3.length; i < len; i++) {
				w[w3](this.materials3[i]);   
			}
			w[fm]();
		}
	};
	m = 810;
	a[n] = m;
	
	a = o.HeroStarupRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.heroStar = r[ry]();
			this.recoups = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.recoups[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 810;
	a[n] = m;
	c[m] = a;
	
	//英雄--升职
	a = o.HeroCareerUpReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](811);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 811;
	a[n] = m;
	
	a = o.HeroCareerUpRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.careerId = r[r3]();
			this.careerLv = r[r3]();
			this.heroLv = r[r3]();
			this.detail = new o.HeroDetail().decode(r);
			return this;
		}
	};
	m = 811;
	a[n] = m;
	c[m] = a;
	
	//英雄--转职
	a = o.HeroCareerTransReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](812);
			w[w3](this.heroId);
			w[w3](this.careerId);
			w[fm]();
		}
	};
	m = 812;
	a[n] = m;
	
	a = o.HeroCareerTransRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.careerId = r[r3]();
			this.soldierId = r[r3]();
			this.detail = new o.HeroDetail().decode(r);
			return this;
		}
	};
	m = 812;
	a[n] = m;
	c[m] = a;
	
	//英雄--士兵列表
	a = o.HeroSoldierListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](813);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 813;
	a[n] = m;
	
	a = o.HeroSoldierListRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.soldierId = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.HeroSoldier().decode(r);   
			}
			return this;
		}
	};
	m = 813;
	a[n] = m;
	c[m] = a;
	
	//英雄--切换士兵
	a = o.HeroSoldierChangeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](814);
			w[w3](this.heroId);
			w[w3](this.soldierId);
			w[fm]();
		}
	};
	m = 814;
	a[n] = m;
	
	a = o.HeroSoldierChangeRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.soldierId = r[r3]();
			this.power = r[r3]();
			this.showPower = r[rb]();
			return this;
		}
	};
	m = 814;
	a[n] = m;
	c[m] = a;
	
	//英雄--查看士兵
	a = o.HeroSoldierInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](815);
			w[w3](this.heroId);
			w[w3](this.soldierId);
			w[fm]();
		}
	};
	m = 815;
	a[n] = m;
	
	a = o.HeroSoldierInfoRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.soldierId = r[r3]();
			this.soldier = new o.HeroSoldier().decode(r);
			return this;
		}
	};
	m = 815;
	a[n] = m;
	c[m] = a;
	
	//士兵激活（如兵营升级后）
	a = o.HeroSoldierActiveRsp = class {
		decode(r) {
			this.heroIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroIds[i] = r[r3]();   
			}
			this.soldierId = r[r3]();
			return this;
		}
	};
	m = 816;
	a[n] = m;
	c[m] = a;
	
	//英雄--英雄锁定
	a = o.HeroStatusLockReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](817);
			w[w3](this.heroId);
			w[wy](this.switchFlag);
			w[fm]();
		}
	};
	m = 817;
	a[n] = m;
	
	a = o.HeroStatusLockRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.switchFlag = r[ry]();
			return this;
		}
	};
	m = 817;
	a[n] = m;
	c[m] = a;
	
	//英雄--重置预览
	a = o.HeroResetPreviewReq = class {
		constructor(d) {
			this.heroId = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](818);
			w[w1](this.heroId.length);
			for (var i = 0, len = this.heroId.length; i < len; i++) {
				w[w3](this.heroId[i]);   
			}
			w[fm]();
		}
	};
	m = 818;
	a[n] = m;
	
	a = o.HeroResetPreviewRsp = class {
		decode(r) {
			this.heroId = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroId[i] = r[r3]();   
			}
			this.goods = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goods[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 818;
	a[n] = m;
	c[m] = a;
	
	//英雄--重置确认
	a = o.HeroResetConfirmReq = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](819);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
			w[fm]();
		}
	};
	m = 819;
	a[n] = m;
	
	a = o.HeroResetConfirmRsp = class {
		decode(r) {
			this.heroes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroes[i] = new o.HeroInfo().decode(r);   
			}
			this.goods = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goods[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 819;
	a[n] = m;
	c[m] = a;
	
	//英雄--分解
	a = o.HeroDecomposeReq = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](820);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
			w[fm]();
		}
	};
	m = 820;
	a[n] = m;
	
	a = o.HeroDecomposeRsp = class {
		decode(r) {
			this.heroIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroIds[i] = r[r3]();   
			}
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 820;
	a[n] = m;
	c[m] = a;
	
	//英雄--信息
	a = o.HeroInfoReq = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](821);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
			w[fm]();
		}
		get needTips() {
			return (this.status & 1) == 0;
		}

		set sthFighted(state) {
		this.status = this.status & 0xfd | (state ? 2 : 0)
		}

		get sthFighted() {//今日进行过据点战
			return (this.status & 2) > 0;
		}

		get switchFlag() {
			return (this.status & 1);
		}


		get exp() {
			return 0;
		}

		set exp(n) {
		}
		
		get color() {
			let ConfigManager = window['ConfigManager'];
			let config = ConfigManager['_config'];
			let cfg = ConfigManager.getItemById(config.Hero_starCfg, this.star);
			return cfg.color;
		}
	};
	m = 821;
	a[n] = m;
	
	a = o.HeroInfoRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.HeroInfo().decode(r);   
			}
			return this;
		}
		get needTips() {
			return (this.status & 1) == 0;
		}

		set sthFighted(state) {
		this.status = this.status & 0xfd | (state ? 2 : 0)
		}

		get sthFighted() {//今日进行过据点战
			return (this.status & 2) > 0;
		}

		get switchFlag() {
			return (this.status & 1);
		}


		get exp() {
			return 0;
		}

		set exp(n) {
		}
		
		get color() {
			let ConfigManager = window['ConfigManager'];
			let config = ConfigManager['_config'];
			let cfg = ConfigManager.getItemById(config.Hero_starCfg, this.star);
			return cfg.color;
		}
	};
	m = 821;
	a[n] = m;
	c[m] = a;
	
	//英雄--置换
	a = o.HeroDisplaceReq = class {
		constructor(d) {
			this.targetHeroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](822);
			w[w3](this.heroId);
			w[w1](this.targetHeroIds.length);
			for (var i = 0, len = this.targetHeroIds.length; i < len; i++) {
				w[w3](this.targetHeroIds[i]);   
			}
			w[fm]();
		}
	};
	m = 822;
	a[n] = m;
	
	a = o.HeroDisplaceRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 822;
	a[n] = m;
	c[m] = a;
	
	//英雄--历史最高英雄星级，主动推送
	a = o.HeroMaxStarUpRsp = class {
		decode(r) {
			this.maxHeroStar = r[ry]();
			this.guardianCopyOpen = r[rb]();
			this.guardianTowerOpen = r[rb]();
			return this;
		}
	};
	m = 823;
	a[n] = m;
	c[m] = a;
	
	a = o.HeroAwakeState = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.heroId);
			w[wy](this.heroStar);
			w[w3](this.awakeLv);
			w[w3](this.number);
			w[wb](this.clear);
		}
		decode(r) {
			this.heroId = r[r3]();
			this.heroStar = r[ry]();
			this.awakeLv = r[r3]();
			this.number = r[r3]();
			this.clear = r[rb]();
			return this;
		}
	};
	
	//英雄觉醒--状态
	a = o.HeroAwakeStateReq = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](824);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
			w[fm]();
		}
	};
	m = 824;
	a[n] = m;
	
	//英雄觉醒--状态，任务更新
	a = o.HeroAwakeStateRsp = class {
		decode(r) {
			this.heros = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heros[i] = new o.HeroAwakeState().decode(r);   
			}
			return this;
		}
	};
	m = 824;
	a[n] = m;
	c[m] = a;
	
	//英雄觉醒--任务更新，主动推送
	a = o.HeroAwakeMissonUpdateRsp = class {
		decode(r) {
			this.hero = new o.HeroAwakeState().decode(r);
			return this;
		}
	};
	m = 825;
	a[n] = m;
	c[m] = a;
	
	//英雄觉醒--副本进入
	a = o.HeroAwakeEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](826);
			w[w3](this.heroId);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 826;
	a[n] = m;
	
	a = o.HeroAwakeEnterRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.stageId = r[r3]();
			return this;
		}
	};
	m = 826;
	a[n] = m;
	c[m] = a;
	
	//英雄觉醒--副本退出
	a = o.HeroAwakeExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](827);
			w[w3](this.heroId);
			w[w3](this.stageId);
			w[wb](this.clear);
			w[fm]();
		}
	};
	m = 827;
	a[n] = m;
	
	a = o.HeroAwakeExitRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.stageId = r[r3]();
			this.clear = r[rb]();
			return this;
		}
	};
	m = 827;
	a[n] = m;
	c[m] = a;
	
	//英雄觉醒--觉醒预览
	a = o.HeroAwakePreviewReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](828);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 828;
	a[n] = m;
	
	a = o.HeroAwakePreviewRsp = class {
		decode(r) {
			this.hero = new o.HeroInfo().decode(r);
			return this;
		}
	};
	m = 828;
	a[n] = m;
	c[m] = a;
	
	//英雄觉醒--觉醒
	a = o.HeroAwakeReq = class {
		constructor(d) {
			this.materials1 = [];
			this.materials2 = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](829);
			w[w3](this.heroId);
			w[w1](this.materials1.length);
			for (var i = 0, len = this.materials1.length; i < len; i++) {
				w[w3](this.materials1[i]);   
			}
			w[w1](this.materials2.length);
			for (var i = 0, len = this.materials2.length; i < len; i++) {
				w[w3](this.materials2[i]);   
			}
			w[fm]();
		}
	};
	m = 829;
	a[n] = m;
	
	a = o.HeroAwakeRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.heroStar = r[ry]();
			this.awakeLv = r[r3]();
			return this;
		}
	};
	m = 829;
	a[n] = m;
	c[m] = a;
	
	//英雄回退--回退
	a = o.HeroFallbackReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](830);
			w[w3](this.heroId);
			w[wb](this.preview);
			w[fm]();
		}
	};
	m = 830;
	a[n] = m;
	
	a = o.HeroFallbackRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.preview = r[rb]();
			if (r[rb]()) {
				this.info = new o.HeroInfo().decode(r);
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 830;
	a[n] = m;
	c[m] = a;
	
	//英雄觉醒--图鉴
	a = o.HeroAwakeBooksReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](831);
			w[fm]();
		}
	};
	m = 831;
	a[n] = m;
	
	a = o.HeroAwakeBooksRsp = class {
		decode(r) {
			this.ids = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.ids[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 831;
	a[n] = m;
	c[m] = a;
	
	//英雄重生
	a = o.HeroRebirthReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](832);
			w[w3](this.heroId);
			w[wb](this.preview);
			w[fm]();
		}
	};
	m = 832;
	a[n] = m;
	
	a = o.HeroRebirthRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.preview = r[rb]();
			if (r[rb]()) {
				this.info = new o.HeroInfo().decode(r);
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 832;
	a[n] = m;
	c[m] = a;
	
	a = o.HeroMysticAttr = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.power);
			w[wy](this.star);
			w[w3](this.level);
			w[w3](this.hp);
			w[w3](this.atk);
			w[w3](this.def);
		}
		decode(r) {
			this.power = r[r3]();
			this.star = r[ry]();
			this.level = r[r3]();
			this.hp = r[r3]();
			this.atk = r[r3]();
			this.def = r[r3]();
			return this;
		}
	};
	
	// 神秘者-连接
	a = o.HeroMysticLinkReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](833);
			w[w3](this.mystic);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 833;
	a[n] = m;
	
	a = o.HeroMysticLinkRsp = class {
		decode(r) {
			this.mystic = r[r3]();
			this.heroId = r[r3]();
			this.bf = new o.HeroMysticAttr().decode(r);
			this.af = new o.HeroMysticAttr().decode(r);
			return this;
		}
	};
	m = 833;
	a[n] = m;
	c[m] = a;
	
	// 神秘者-解除连接
	a = o.HeroMysticUnLinkReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](834);
			w[w3](this.mystic);
			w[fm]();
		}
	};
	m = 834;
	a[n] = m;
	
	a = o.HeroMysticUnLinkRsp = class {
		decode(r) {
			this.mystic = r[r3]();
			this.heroId = r[r3]();
			this.bf = new o.HeroMysticAttr().decode(r);
			this.af = new o.HeroMysticAttr().decode(r);
			if (r[rb]()) {
				this.info = new o.HeroInfo().decode(r);
			}
			this.items = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.items[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 834;
	a[n] = m;
	c[m] = a;
	
	// 神秘者-技能升级
	a = o.HeroMysticSkillUpReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](835);
			w[w3](this.mystic);
			w[w3](this.heroId);
			w[wy](this.skillId);
			w[fm]();
		}
	};
	m = 835;
	a[n] = m;
	
	// 神秘者-技能升级
	a = o.HeroMysticSkillUpRsp = class {
		decode(r) {
			this.mystic = r[r3]();
			this.mysticSkills = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.mysticSkills[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 835;
	a[n] = m;
	c[m] = a;
	
	a = o.BarrackInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.level);
			w[w3](this.exp);
		}
		decode(r) {
			this.id = r[r3]();
			this.level = r[r3]();
			this.exp = r[r3]();
			return this;
		}
	};
	
	a = o.BarrackTech = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.level);
		}
		decode(r) {
			this.id = r[r3]();
			this.level = r[r3]();
			return this;
		}
	};
	
	//兵营--列表（废弃）
	a = o.BarrackListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](901);
			w[fm]();
		}
	};
	m = 901;
	a[n] = m;
	
	a = o.BarrackListRsp = class {
		decode(r) {
			this.infos = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.infos[i] = new o.BarrackInfo().decode(r);   
			}
			this.techs = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.techs[i] = new o.BarrackTech().decode(r);   
			}
			return this;
		}
	};
	m = 901;
	a[n] = m;
	c[m] = a;
	
	//兵营--科技列表（废弃）
	a = o.BarrackTechUpReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](902);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 902;
	a[n] = m;
	
	a = o.BarrackTechUpRsp = class {
		decode(r) {
			this.info = new o.BarrackInfo().decode(r);
			this.tech = new o.BarrackTech().decode(r);
			this.oldPower = r[r3]();
			this.newPower = r[r3]();
			return this;
		}
	};
	m = 902;
	a[n] = m;
	c[m] = a;
	
	a = o.BarrackUnlockRsp = class {
		decode(r) {
			this.id = r[r3]();
			return this;
		}
	};
	m = 903;
	a[n] = m;
	c[m] = a;
	
	//兵营--士兵列表（废弃）
	a = o.BarrackSoldiersReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](904);
			w[fm]();
		}
	};
	m = 904;
	a[n] = m;
	
	a = o.BarrackSoldiersRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 904;
	a[n] = m;
	c[m] = a;
	
	//兵营--等级
	a = o.BarrackLevelsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](905);
			w[fm]();
		}
	};
	m = 905;
	a[n] = m;
	
	a = o.BarrackLevelsRsp = class {
		decode(r) {
			this.levels = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.levels[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 905;
	a[n] = m;
	c[m] = a;
	
	//兵营--升级
	a = o.BarrackLevelupReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](906);
			w[w3](this.type);
			w[fm]();
		}
	};
	m = 906;
	a[n] = m;
	
	a = o.BarrackLevelupRsp = class {
		decode(r) {
			this.type = r[r3]();
			this.level = r[r3]();
			this.diff = r[r3]();
			return this;
		}
	};
	m = 906;
	a[n] = m;
	c[m] = a;
	
	a = o.FightSkill = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.skillId);
			w[w3](this.skillLv);
		}
		decode(r) {
			this.skillId = r[r3]();
			this.skillLv = r[r3]();
			return this;
		}
	};
	
	a = o.FightHero = class {
		constructor(d) {
			this.skills = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.heroId);
			w[w3](this.heroType);
			w[w3](this.heroLv);
			w[wy](this.heroStar);
			w[w3](this.heroPower);
			w[w3](this.careerId);
			w[w3](this.careerLv);
			this.attr.encode(w);
			this.soldier.encode(w);
			w[w1](this.skills.length);
			for (var i = 0, len = this.skills.length; i < len; i++) {
				this.skills[i].encode(w);   
			}
		}
		decode(r) {
			this.heroId = r[r3]();
			this.heroType = r[r3]();
			this.heroLv = r[r3]();
			this.heroStar = r[ry]();
			this.heroPower = r[r3]();
			this.careerId = r[r3]();
			this.careerLv = r[r3]();
			this.attr = new o.FightAttr().decode(r);
			this.soldier = new o.FightSoldier().decode(r);
			this.skills = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.skills[i] = new o.FightSkill().decode(r);   
			}
			return this;
		}
	};
	
	a = o.FightGeneral = class {
		constructor(d) {
			this.skills = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.weaponId);
			w[w3](this.level);
			w[w3](this.atk);
			w[w3](this.energyCharge);
			w[w1](this.skills.length);
			for (var i = 0, len = this.skills.length; i < len; i++) {
				this.skills[i].encode(w);   
			}
		}
		decode(r) {
			this.weaponId = r[r3]();
			this.level = r[r3]();
			this.atk = r[r3]();
			this.energyCharge = r[r3]();
			this.skills = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.skills[i] = new o.FightSkill().decode(r);   
			}
			return this;
		}
		get hit() {
			return 0;
		}

		get crit() {
			return 0;
		}

		get hurt() {
			return 0;
		}

		get def_pene() {
			return 0;
		}

		get atk_speed_w() {
			return 0;
		}

		get atk_speed_r() {
			return 0;
		}
	};
	
	a = o.FightAttr = class {
		constructor(d) {
			// 属性保护
			[
				["empty", "empty"],
				["hp", "hp"],
				["atk", "atk"],
				["def", "def"],
				["hit", "hit"],
				["dodge", "dodge"],
				["crit", "crit"],
				["hurt", "hurt"],
				["atkSpeed", "atk_speed"],
				["defPeneFix", "def_pene_fix"],
				["critRes", "crit_res"],
				["hurtRes", "hurt_res"],
				["puncRes", "punc_res"],
				["radiRes", "radi_res"],
				["elecRes", "elec_res"],
				["fireRes", "fire_res"],
				["coldRes", "cold_res"],
				["critV", "crit_v"],
				["critVRes", "crit_v_res"],
				["atkRes", "atk_res"],
				["dmgPunc", "dmg_punc"],
				["dmgRadi", "dmg_radi"],
				["dmgElec", "dmg_elec"],
				["dmgFire", "dmg_fire"],
				["dmgCold", "dmg_cold"],
				["atkDmg", "atk_dmg"],
				["atkSpeedR", "atk_speed_r"],
				["atkOrder", "atk_order"],
				["dmgAdd", "dmg_add"],
				["dmgRes", "dmg_res"],
				["powerRes", "power_res"],
				["healthy", "healthy"],
				["powerDmg", "power_dmg"],
			].forEach(p => {
                if(p[0].endsWith('Id') || p[0].endsWith('id')) {
                    return;
                }
				let r = Math.floor(Math.random() * (9999 - 9 + 1) + 9);
				let v = 0;
				let o = {
					get() { return v + r },
					set(p1) { v = p1 - r },
					enumerable: true,
					configurable: true,
				};
				if(p[0] !== p[1]){
					Object.defineProperty(this, p[1], o);
				}
				Object.defineProperty(this, p[0], o);
			});
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.empty);
			w[w3](this.hp);
			w[w3](this.atk);
			w[w3](this.def);
			w[w3](this.hit);
			w[w3](this.dodge);
			w[w3](this.crit);
			w[w3](this.hurt);
			w[w3](this.atkSpeed);
			w[w3](this.defPeneFix);
			w[w3](this.critRes);
			w[w3](this.hurtRes);
			w[w3](this.puncRes);
			w[w3](this.radiRes);
			w[w3](this.elecRes);
			w[w3](this.fireRes);
			w[w3](this.coldRes);
			w[w3](this.critV);
			w[w3](this.critVRes);
			w[w3](this.atkRes);
			w[w3](this.dmgPunc);
			w[w3](this.dmgRadi);
			w[w3](this.dmgElec);
			w[w3](this.dmgFire);
			w[w3](this.dmgCold);
			w[w3](this.atkDmg);
			w[w3](this.atkSpeedR);
			w[w3](this.atkOrder);
			w[w3](this.dmgAdd);
			w[w3](this.dmgRes);
			w[w3](this.powerRes);
			w[w3](this.healthy);
			w[w3](this.powerDmg);
		}
		decode(r) {
			this.empty = r[r3]();
			this.hp = r[r3]();
			this.atk = r[r3]();
			this.def = r[r3]();
			this.hit = r[r3]();
			this.dodge = r[r3]();
			this.crit = r[r3]();
			this.hurt = r[r3]();
			this.atkSpeed = r[r3]();
			this.defPeneFix = r[r3]();
			this.critRes = r[r3]();
			this.hurtRes = r[r3]();
			this.puncRes = r[r3]();
			this.radiRes = r[r3]();
			this.elecRes = r[r3]();
			this.fireRes = r[r3]();
			this.coldRes = r[r3]();
			this.critV = r[r3]();
			this.critVRes = r[r3]();
			this.atkRes = r[r3]();
			this.dmgPunc = r[r3]();
			this.dmgRadi = r[r3]();
			this.dmgElec = r[r3]();
			this.dmgFire = r[r3]();
			this.dmgCold = r[r3]();
			this.atkDmg = r[r3]();
			this.atkSpeedR = r[r3]();
			this.atkOrder = r[r3]();
			this.dmgAdd = r[r3]();
			this.dmgRes = r[r3]();
			this.powerRes = r[r3]();
			this.healthy = r[r3]();
			this.powerDmg = r[r3]();
			// 属性需除10000
			this.hurtRes /= 10000;
			this.puncRes /= 10000;
			this.radiRes /= 10000;
			this.elecRes /= 10000;
			this.fireRes /= 10000;
			this.coldRes /= 10000;
			this.atkRes /= 10000;
			this.dmgPunc /= 10000;
			this.dmgRadi /= 10000;
			this.dmgElec /= 10000;
			this.dmgFire /= 10000;
			this.dmgCold /= 10000;
			this.atkDmg /= 10000;
			this.dmgAdd /= 10000;
			this.dmgRes /= 10000;
			this.powerRes /= 10000;
			this.powerDmg /= 10000;
			return this;
		}
	};
	
	a = o.FightSoldier = class {
		constructor(d) {
			// 属性保护
			[
				["soldierId", "soldier_id"],
				["hp", "hp"],
				["atk", "atk"],
				["def", "def"],
				["hit", "hit"],
				["dodge", "dodge"],
				["atkSpeed", "atk_speed"],
				["dmgAdd", "dmg_add"],
				["dmgRes", "dmg_res"],
			].forEach(p => {
                if(p[0].endsWith('Id') || p[0].endsWith('id')) {
                    return;
                }
				let r = Math.floor(Math.random() * (9999 - 9 + 1) + 9);
				let v = 0;
				let o = {
					get() { return v + r },
					set(p1) { v = p1 - r },
					enumerable: true,
					configurable: true,
				};
				if(p[0] !== p[1]){
					Object.defineProperty(this, p[1], o);
				}
				Object.defineProperty(this, p[0], o);
			});
			this.skills = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.soldierId);
			w[w3](this.hp);
			w[w3](this.atk);
			w[w3](this.def);
			w[w3](this.hit);
			w[w3](this.dodge);
			w[w3](this.atkSpeed);
			w[w3](this.dmgAdd);
			w[w3](this.dmgRes);
			w[w1](this.skills.length);
			for (var i = 0, len = this.skills.length; i < len; i++) {
				this.skills[i].encode(w);   
			}
		}
		decode(r) {
			this.soldierId = r[r3]();
			this.hp = r[r3]();
			this.atk = r[r3]();
			this.def = r[r3]();
			this.hit = r[r3]();
			this.dodge = r[r3]();
			this.atkSpeed = r[r3]();
			this.dmgAdd = r[r3]();
			this.dmgRes = r[r3]();
			this.skills = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.skills[i] = new o.FightSkill().decode(r);   
			}
			// 属性需除10000
			this.dmgAdd /= 10000;
			this.dmgRes /= 10000;
			return this;
		}
	};
	
	//战斗--英雄信息
	a = o.FightQueryReq = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1001);
			w[w6](this.playerId);
			w[wb](this.isTower);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
			w[wb](this.general);
			w[wy](this.arrayType);
			w[fm]();
		}
	};
	m = 1001;
	a[n] = m;
	
	a = o.FightQueryRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				if (r[rb]()) {
					this.heroList[i] = new o.FightHero().decode(r);
				}   
			}
			if (r[rb]()) {
				this.general = new o.FightGeneral().decode(r);
			}
			return this;
		}
	};
	m = 1001;
	a[n] = m;
	c[m] = a;
	
	//战斗--多个玩家的战斗信息
	a = o.FightDefendReq = class {
		constructor(d) {
			this.playerIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1002);
			w[w1](this.playerIds.length);
			for (var i = 0, len = this.playerIds.length; i < len; i++) {
				w[w6](this.playerIds[i]);   
			}
			w[wy](this.arrayType);
			w[fm]();
		}
	};
	m = 1002;
	a[n] = m;
	
	a = o.DefendFight = class {
		constructor(d) {
			this.heroList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[w1](this.heroList.length);
			for (var i = 0, len = this.heroList.length; i < len; i++) {
				if (!this.heroList[i]) {
					w[wb](false);
				} else {
					w[wb](true);
					this.heroList[i].encode(w);
				}   
			}
			if (!this.general) {
				w[wb](false);
			} else {
				w[wb](true);
				this.general.encode(w);
			}
		}
		decode(r) {
			this.playerId = r[r6]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				if (r[rb]()) {
					this.heroList[i] = new o.FightHero().decode(r);
				}   
			}
			if (r[rb]()) {
				this.general = new o.FightGeneral().decode(r);
			}
			return this;
		}
	};
	
	a = o.FightDefendRsp = class {
		decode(r) {
			this.player = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.player[i] = new o.DefendFight().decode(r);   
			}
			return this;
		}
	};
	m = 1002;
	a[n] = m;
	c[m] = a;
	
	//战斗--回放
	a = o.FightReplayReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1003);
			w[w3](this.fightId);
			w[fm]();
		}
	};
	m = 1003;
	a[n] = m;
	
	a = o.FightReplayRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.randSeed = r[r3]();
			this.actions = r[rs]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				if (r[rb]()) {
					this.heroList[i] = new o.FightHero().decode(r);
				}   
			}
			this.general = new o.FightGeneral().decode(r);
			return this;
		}
	};
	m = 1003;
	a[n] = m;
	c[m] = a;
	
	a = o.FightBriefHero = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.typeId);
			w[w3](this.level);
			w[wy](this.star);
		}
		decode(r) {
			this.typeId = r[r3]();
			this.level = r[r3]();
			this.star = r[ry]();
			return this;
		}
	};
	
	a = o.FightBrief = class {
		constructor(d) {
			this.heroes = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.fightId);
			w[w6](this.playerId);
			w[w3](this.playerHead);
			w[ws](this.playerName);
			w[w3](this.playerPower);
			w[w1](this.heroes.length);
			for (var i = 0, len = this.heroes.length; i < len; i++) {
				this.heroes[i].encode(w);   
			}
		}
		decode(r) {
			this.fightId = r[r3]();
			this.playerId = r[r6]();
			this.playerHead = r[r3]();
			this.playerName = r[rs]();
			this.playerPower = r[r3]();
			this.heroes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroes[i] = new o.FightBriefHero().decode(r);   
			}
			return this;
		}
	};
	
	//战斗-记录查询
	a = o.FightLookupReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1004);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 1004;
	a[n] = m;
	
	a = o.FightLookupRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.FightBrief().decode(r);   
			}
			return this;
		}
	};
	m = 1004;
	a[n] = m;
	c[m] = a;
	
	a = o.FightDefendHero = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.heroId);
			w[w3](this.typeId);
			w[wy](this.pos);
			w[w3](this.power);
			w[w3](this.level);
			w[w3](this.star);
			w[w3](this.hp);
			w[w3](this.maxHp);
			w[w3](this.soldierId);
			w[w3](this.careerId);
			w[w3](this.careerLv);
		}
		decode(r) {
			this.heroId = r[r3]();
			this.typeId = r[r3]();
			this.pos = r[ry]();
			this.power = r[r3]();
			this.level = r[r3]();
			this.star = r[r3]();
			this.hp = r[r3]();
			this.maxHp = r[r3]();
			this.soldierId = r[r3]();
			this.careerId = r[r3]();
			this.careerLv = r[r3]();
			return this;
		}
	};
	
	a = o.FightDefenceFailRsp = class {
		decode(r) {
			this.type = r[ry]();
			return this;
		}
	};
	m = 1005;
	a[n] = m;
	c[m] = a;
	
	a = o.FightHeroDamage = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.heroId);
			w[w3](this.atkTimes);
			w[w6](this.atkDmg);
			w[w3](this.stkTimes);
			w[w6](this.stkDmg);
		}
		decode(r) {
			this.heroId = r[r3]();
			this.atkTimes = r[r3]();
			this.atkDmg = r[r6]();
			this.stkTimes = r[r3]();
			this.stkDmg = r[r6]();
			return this;
		}
	};
	
	// 战斗--战斗伤害流水统计
	a = o.FightDamageStaticReq = class {
		constructor(d) {
			this.damage = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1006);
			w[w3](this.fightType);
			w[w3](this.stageId);
			w[w3](this.opPower);
			w[w3](this.bossNum);
			w[w1](this.damage.length);
			for (var i = 0, len = this.damage.length; i < len; i++) {
				this.damage[i].encode(w);   
			}
			w[fm]();
		}
	};
	m = 1006;
	a[n] = m;
	
	a = o.FightDamageStaticRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 1006;
	a[n] = m;
	c[m] = a;
	
	a = o.MissionProgress = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.type);
			w[w3](this.arg);
			w[w3](this.num);
		}
		decode(r) {
			this.type = r[r3]();
			this.arg = r[r3]();
			this.num = r[r3]();
			return this;
		}
	};
	
	a = o.MissionCategory = class {
		constructor(d) {
			this.progressList = [];
			this.missionRewarded = [];
			this.missionIntRewarded = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w1](this.progressList.length);
			for (var i = 0, len = this.progressList.length; i < len; i++) {
				this.progressList[i].encode(w);   
			}
			w[w1](this.missionRewarded.length);
			for (var i = 0, len = this.missionRewarded.length; i < len; i++) {
				w[wy](this.missionRewarded[i]);   
			}
			w[w1](this.missionIntRewarded.length);
			for (var i = 0, len = this.missionIntRewarded.length; i < len; i++) {
				w[w3](this.missionIntRewarded[i]);   
			}
			w[wy](this.boxOpened);
		}
		decode(r) {
			this.progressList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.progressList[i] = new o.MissionProgress().decode(r);   
			}
			this.missionRewarded = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.missionRewarded[i] = r[ry]();   
			}
			this.missionIntRewarded = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.missionIntRewarded[i] = r[r3]();   
			}
			this.boxOpened = r[ry]();
			return this;
		}
	};
	
	//任务--列表
	a = o.MissionListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1101);
			w[fm]();
		}
	};
	m = 1101;
	a[n] = m;
	
	a = o.MissionListRsp = class {
		decode(r) {
			this.daily = new o.MissionCategory().decode(r);
			this.weekly = new o.MissionCategory().decode(r);
			this.achievement = new o.MissionCategory().decode(r);
			this.mainline = new o.MissionCategory().decode(r);
			if (r[rb]()) {
				this.sevenDays = new o.MissionCategory().decode(r);
			}
			if (r[rb]()) {
				this.flipCards = new o.MissionCategory().decode(r);
			}
			this.grading = new o.MissionCategory().decode(r);
			this.adventureDiary = new o.MissionCategory().decode(r);
			this.carnivalDaily = new o.MissionCategory().decode(r);
			this.carnivalUltimate = new o.MissionCategory().decode(r);
			this.footholdDaily = new o.MissionCategory().decode(r);
			this.footholdRank = new o.MissionCategory().decode(r);
			this.relicDaily = new o.MissionCategory().decode(r);
			this.relicWeekly = new o.MissionCategory().decode(r);
			this.mergeCarnivalDaily = new o.MissionCategory().decode(r);
			this.mergeCarnivalUltimate = new o.MissionCategory().decode(r);
			this.combo = new o.MissionCategory().decode(r);
			this.caveAdventure = new o.MissionCategory().decode(r);
			this.costumeCustom = new o.MissionCategory().decode(r);
			return this;
		}
	};
	m = 1101;
	a[n] = m;
	c[m] = a;
	
	//更新进度
	a = o.MissionUpdateRsp = class {
		decode(r) {
			this.upType = r[ry]();
			this.progress = new o.MissionProgress().decode(r);
			return this;
		}
	};
	m = 1102;
	a[n] = m;
	c[m] = a;
	
	//任务--领奖
	a = o.MissionRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1103);
			w[wy](this.kind);
			w[wy](this.type);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 1103;
	a[n] = m;
	
	a = o.MissionRewardRsp = class {
		decode(r) {
			this.kind = r[ry]();
			this.type = r[ry]();
			this.id = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1103;
	a[n] = m;
	c[m] = a;
	
	//7天活动--积分奖励
	a = o.Mission7daysScoreAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1104);
			w[wy](this.index);
			w[fm]();
		}
	};
	m = 1104;
	a[n] = m;
	
	a = o.Mission7daysScoreAwardRsp = class {
		decode(r) {
			this.index = r[ry]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1104;
	a[n] = m;
	c[m] = a;
	
	//在线任务--信息
	a = o.MissionOnlineInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1105);
			w[fm]();
		}
	};
	m = 1105;
	a[n] = m;
	
	a = o.MissionOnlineInfoRsp = class {
		decode(r) {
			this.startTime = r[r3]();
			this.awardBits = r[r6]();
			return this;
		}
	};
	m = 1105;
	a[n] = m;
	c[m] = a;
	
	//在线任务--领奖
	a = o.MissionOnlineAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1106);
			w[wy](this.id);
			w[wy](this.day);
			w[fm]();
		}
	};
	m = 1106;
	a[n] = m;
	
	a = o.MissionOnlineAwardRsp = class {
		decode(r) {
			this.id = r[ry]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1106;
	a[n] = m;
	c[m] = a;
	
	//成长任务--列表
	a = o.MissionGrowListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1107);
			w[fm]();
		}
	};
	m = 1107;
	a[n] = m;
	
	a = o.MissionGrowListRsp = class {
		decode(r) {
			this.progresses = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.progresses[i] = new o.MissionProgress().decode(r);   
			}
			this.chapter = r[ry]();
			this.awardBits = r[r3]();
			return this;
		}
	};
	m = 1107;
	a[n] = m;
	c[m] = a;
	
	a = o.MissionGrowUpdateRsp = class {
		decode(r) {
			this.progress = new o.MissionProgress().decode(r);
			return this;
		}
	};
	m = 1108;
	a[n] = m;
	c[m] = a;
	
	//成长任务--章节领奖
	a = o.MissionGrowChapterAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1109);
			w[fm]();
		}
	};
	m = 1109;
	a[n] = m;
	
	a = o.MissionGrowChapterAwardRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1109;
	a[n] = m;
	c[m] = a;
	
	//成长任务--领奖
	a = o.MissionGrowTaskAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1110);
			w[wy](this.id);
			w[fm]();
		}
	};
	m = 1110;
	a[n] = m;
	
	a = o.MissionGrowTaskAwardRsp = class {
		decode(r) {
			this.id = r[ry]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1110;
	a[n] = m;
	c[m] = a;
	
	//福利任务--列表
	a = o.MissionWelfareListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1111);
			w[fm]();
		}
	};
	m = 1111;
	a[n] = m;
	
	a = o.MissionWelfareListRsp = class {
		decode(r) {
			this.rewarded = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 1111;
	a[n] = m;
	c[m] = a;
	
	//福利任务--领奖
	a = o.MissionWelfareAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1112);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 1112;
	a[n] = m;
	
	a = o.MissionWelfareAwardRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1112;
	a[n] = m;
	c[m] = a;
	
	//福利任务2--列表
	a = o.MissionWelfare2ListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1113);
			w[fm]();
		}
	};
	m = 1113;
	a[n] = m;
	
	a = o.MissionWelfare2ListRsp = class {
		decode(r) {
			this.bought = r[rb]();
			this.loginDays = r[r3]();
			this.rewarded = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 1113;
	a[n] = m;
	c[m] = a;
	
	//福利任务2--领奖
	a = o.MissionWelfare2AwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1114);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 1114;
	a[n] = m;
	
	a = o.MissionWelfare2AwardRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1114;
	a[n] = m;
	c[m] = a;
	
	//指挥官神器--列表
	a = o.MissionWeaponListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1115);
			w[fm]();
		}
	};
	m = 1115;
	a[n] = m;
	
	a = o.MissionWeaponListRsp = class {
		decode(r) {
			this.progress = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.progress[i] = new o.MissionProgress().decode(r);   
			}
			this.chapter = r[ry]();
			this.awardBits = r[r3]();
			return this;
		}
	};
	m = 1115;
	a[n] = m;
	c[m] = a;
	
	a = o.MissionWeaponUpdateRsp = class {
		decode(r) {
			this.progress = new o.MissionProgress().decode(r);
			return this;
		}
	};
	m = 1116;
	a[n] = m;
	c[m] = a;
	
	//指挥官神器--任务领奖
	a = o.MissionWeaponTaskAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1117);
			w[wy](this.id);
			w[fm]();
		}
	};
	m = 1117;
	a[n] = m;
	
	a = o.MissionWeaponTaskAwardRsp = class {
		decode(r) {
			this.id = r[ry]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1117;
	a[n] = m;
	c[m] = a;
	
	//冒险日记--额外奖励
	a = o.MissionAdventureDiaryRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1118);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 1118;
	a[n] = m;
	
	a = o.MissionAdventureDiaryRewardRsp = class {
		decode(r) {
			this.boxOpened = r[ry]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1118;
	a[n] = m;
	c[m] = a;
	
	//冒险日记--奖励信息
	a = o.MissionAdventureDiaryRewardInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1119);
			w[fm]();
		}
	};
	m = 1119;
	a[n] = m;
	
	a = o.MissionAdventureDiaryRewardInfoRsp = class {
		decode(r) {
			this.boxOpened = r[ry]();
			return this;
		}
	};
	m = 1119;
	a[n] = m;
	c[m] = a;
	
	//每日任务--当前轮数
	a = o.MissionDailyRoundIdReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1120);
			w[fm]();
		}
	};
	m = 1120;
	a[n] = m;
	
	a = o.MissionDailyRoundIdRsp = class {
		decode(r) {
			this.roundId = r[ry]();
			return this;
		}
	};
	m = 1120;
	a[n] = m;
	c[m] = a;
	
	//幸运连连看--查看面板
	a = o.MissionComboInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1121);
			w[fm]();
		}
	};
	m = 1121;
	a[n] = m;
	
	a = o.MissionComboInfoRsp = class {
		decode(r) {
			this.round = r[r3]();
			this.gainLine = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.gainLine[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 1121;
	a[n] = m;
	c[m] = a;
	
	a = o.MasteryTeamInfo = class {
		constructor(d) {
			this.heroId = [];
			this.typeId = [];
			this.rewards = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.teamId);
			w[w3](this.time);
			w[w3](this.achieve);
			w[w1](this.heroId.length);
			for (var i = 0, len = this.heroId.length; i < len; i++) {
				w[w3](this.heroId[i]);   
			}
			w[w1](this.typeId.length);
			for (var i = 0, len = this.typeId.length; i < len; i++) {
				w[w3](this.typeId[i]);   
			}
			w[w1](this.rewards.length);
			for (var i = 0, len = this.rewards.length; i < len; i++) {
				this.rewards[i].encode(w);   
			}
		}
		decode(r) {
			this.teamId = r[ry]();
			this.time = r[r3]();
			this.achieve = r[r3]();
			this.heroId = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroId[i] = r[r3]();   
			}
			this.typeId = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.typeId[i] = r[r3]();   
			}
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	
	//专精--探索信息（废弃）
	a = o.MasteryTeamListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1201);
			w[fm]();
		}
	};
	m = 1201;
	a[n] = m;
	
	a = o.MasteryTeamListRsp = class {
		decode(r) {
			this.count = r[r3]();
			this.team = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.team[i] = new o.MasteryTeamInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1201;
	a[n] = m;
	c[m] = a;
	
	//专精--探索开始（废弃）
	a = o.MasteryExploreStartReq = class {
		constructor(d) {
			this.heroId = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1202);
			w[wy](this.teamId);
			w[w1](this.heroId.length);
			for (var i = 0, len = this.heroId.length; i < len; i++) {
				w[w3](this.heroId[i]);   
			}
			w[fm]();
		}
	};
	m = 1202;
	a[n] = m;
	
	a = o.MasteryExploreStartRsp = class {
		decode(r) {
			this.teamId = r[ry]();
			this.teamInfo = new o.MasteryTeamInfo().decode(r);
			return this;
		}
	};
	m = 1202;
	a[n] = m;
	c[m] = a;
	
	//专精--探索停止（废弃）
	a = o.MasteryExploreStopReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1203);
			w[wy](this.teamId);
			w[fm]();
		}
	};
	m = 1203;
	a[n] = m;
	
	a = o.MasteryExploreStopRsp = class {
		decode(r) {
			this.teamId = r[ry]();
			return this;
		}
	};
	m = 1203;
	a[n] = m;
	c[m] = a;
	
	//专精--探索奖励（废弃）
	a = o.MasteryExploreRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1204);
			w[wy](this.teamId);
			w[fm]();
		}
	};
	m = 1204;
	a[n] = m;
	
	a = o.MasteryExploreRewardRsp = class {
		decode(r) {
			this.teamId = r[ry]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1204;
	a[n] = m;
	c[m] = a;
	
	//专精--副本列表（废弃）
	a = o.MasteryStageIdListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1205);
			w[fm]();
		}
	};
	m = 1205;
	a[n] = m;
	
	a = o.MasteryStageIdListRsp = class {
		decode(r) {
			this.stageIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.stageIds[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 1205;
	a[n] = m;
	c[m] = a;
	
	//英雄专精副本信息
	a = o.MasteryStageUpdateRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.stageId = r[r3]();
			this.id = r[r3]();
			return this;
		}
	};
	m = 1206;
	a[n] = m;
	c[m] = a;
	
	a = o.StoreBlackItem = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.count);
			w[w3](this.itemType);
			w[w3](this.itemNum);
		}
		decode(r) {
			this.id = r[r3]();
			this.count = r[r3]();
			this.itemType = r[r3]();
			this.itemNum = r[r3]();
			return this;
		}
	};
	
	a = o.StoreBlackMarket = class {
		constructor(d) {
			this.item = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.time);
			w[w3](this.count);
			w[w1](this.item.length);
			for (var i = 0, len = this.item.length; i < len; i++) {
				this.item[i].encode(w);   
			}
		}
		decode(r) {
			this.time = r[r3]();
			this.count = r[r3]();
			this.item = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.item[i] = new o.StoreBlackItem().decode(r);   
			}
			return this;
		}
	};
	
	a = o.StoreBuyInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.count);
		}
		decode(r) {
			this.id = r[r3]();
			this.count = r[r3]();
			return this;
		}
	};
	
	//商店--黑市信息
	a = o.StoreBlackMarketListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1301);
			w[fm]();
		}
	};
	m = 1301;
	a[n] = m;
	
	a = o.StoreBlackMarketListRsp = class {
		decode(r) {
			this.store = new o.StoreBlackMarket().decode(r);
			return this;
		}
	};
	m = 1301;
	a[n] = m;
	c[m] = a;
	
	//商店--黑市刷新
	a = o.StoreBlackMarketRefreshReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1302);
			w[fm]();
		}
	};
	m = 1302;
	a[n] = m;
	
	a = o.StoreBlackMarketRefreshRsp = class {
		decode(r) {
			this.store = new o.StoreBlackMarket().decode(r);
			return this;
		}
	};
	m = 1302;
	a[n] = m;
	c[m] = a;
	
	//商店--黑市购买
	a = o.StoreBlackMarketBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1303);
			w[w3](this.position);
			w[fm]();
		}
	};
	m = 1303;
	a[n] = m;
	
	a = o.StoreBlackMarketBuyRsp = class {
		decode(r) {
			this.position = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1303;
	a[n] = m;
	c[m] = a;
	
	a = o.StoreItem = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.itemType);
			w[w3](this.itemNum);
		}
		decode(r) {
			this.id = r[r3]();
			this.itemType = r[r3]();
			this.itemNum = r[r3]();
			return this;
		}
	};
	
	//商店--购买信息
	a = o.StoreListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1304);
			w[fm]();
		}
	};
	m = 1304;
	a[n] = m;
	
	a = o.StoreListRsp = class {
		decode(r) {
			this.info = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.info[i] = new o.StoreBuyInfo().decode(r);   
			}
			this.items = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.items[i] = new o.StoreItem().decode(r);   
			}
			return this;
		}
	};
	m = 1304;
	a[n] = m;
	c[m] = a;
	
	//商店--购买
	a = o.StoreBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1305);
			w[w3](this.id);
			w[w3](this.num);
			w[fm]();
		}
	};
	m = 1305;
	a[n] = m;
	
	a = o.StoreBuyRsp = class {
		decode(r) {
			this.info = new o.StoreBuyInfo().decode(r);
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1305;
	a[n] = m;
	c[m] = a;
	
	//商店--购买信息
	a = o.StoreGiftListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1306);
			w[fm]();
		}
	};
	m = 1306;
	a[n] = m;
	
	a = o.StoreGiftListRsp = class {
		decode(r) {
			this.info = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.info[i] = new o.StoreBuyInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1306;
	a[n] = m;
	c[m] = a;
	
	a = o.StoreGiftUpdateRsp = class {
		decode(r) {
			this.info = new o.StoreBuyInfo().decode(r);
			return this;
		}
	};
	m = 1307;
	a[n] = m;
	c[m] = a;
	
	a = o.StorePushGift = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.giftId);
			w[w3](this.startTime);
			w[w3](this.remainNum);
			w[w3](this.totalNum);
		}
		decode(r) {
			this.giftId = r[r3]();
			this.startTime = r[r3]();
			this.remainNum = r[r3]();
			this.totalNum = r[r3]();
			return this;
		}
	};
	
	//推送--礼包列表
	a = o.StorePushListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1308);
			w[fm]();
		}
	};
	m = 1308;
	a[n] = m;
	
	a = o.StorePushListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.StorePushGift().decode(r);   
			}
			return this;
		}
	};
	m = 1308;
	a[n] = m;
	c[m] = a;
	
	//推送--购买礼包
	a = o.StorePushBuyRsp = class {
		decode(r) {
			this.gift = new o.StorePushGift().decode(r);
			this.items = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.items[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1309;
	a[n] = m;
	c[m] = a;
	
	a = o.StorePushEvent = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.event);
			w[w3](this.num);
		}
		decode(r) {
			this.event = r[r3]();
			this.num = r[r3]();
			return this;
		}
	};
	
	//推送--事件列表（废弃）
	a = o.StorePushEventsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1310);
			w[fm]();
		}
	};
	m = 1310;
	a[n] = m;
	
	a = o.StorePushEventsRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.StorePushEvent().decode(r);   
			}
			return this;
		}
	};
	m = 1310;
	a[n] = m;
	c[m] = a;
	
	a = o.StorePushNoticeRsp = class {
		decode(r) {
			this.event = new o.StorePushEvent().decode(r);
			return this;
		}
	};
	m = 1311;
	a[n] = m;
	c[m] = a;
	
	//礼包--战力礼包奖励
	a = o.StoreMiscGiftPowerAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1312);
			w[wy](this.index);
			w[fm]();
		}
	};
	m = 1312;
	a[n] = m;
	
	a = o.StoreMiscGiftPowerAwardRsp = class {
		decode(r) {
			this.bought = r[rb]();
			this.flag = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1312;
	a[n] = m;
	c[m] = a;
	
	//7天--购买历史
	a = o.Store7daysBoughtReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1313);
			w[fm]();
		}
	};
	m = 1313;
	a[n] = m;
	
	a = o.Store7daysBoughtRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.StoreBuyInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1313;
	a[n] = m;
	c[m] = a;
	
	//7天--购买商品
	a = o.Store7daysBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1314);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 1314;
	a[n] = m;
	
	a = o.Store7daysBuyRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1314;
	a[n] = m;
	c[m] = a;
	
	//商店--主动刷新
	a = o.StoreRefreshReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1315);
			w[w3](this.storeType);
			w[fm]();
		}
	};
	m = 1315;
	a[n] = m;
	
	a = o.StoreRefreshRsp = class {
		decode(r) {
			this.info = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.info[i] = new o.StoreBuyInfo().decode(r);   
			}
			this.items = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.items[i] = new o.StoreItem().decode(r);   
			}
			return this;
		}
	};
	m = 1315;
	a[n] = m;
	c[m] = a;
	
	//商店--快速购买
	a = o.StoreQuickBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1316);
			w[w3](this.id);
			w[w3](this.num);
			w[fm]();
		}
	};
	m = 1316;
	a[n] = m;
	
	a = o.StoreQuickBuyRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1316;
	a[n] = m;
	c[m] = a;
	
	a = o.StoreRuneItem = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.itemType);
			w[w3](this.count);
		}
		decode(r) {
			this.id = r[r3]();
			this.itemType = r[r3]();
			this.count = r[r3]();
			return this;
		}
	};
	
	//符文商店--物品列表
	a = o.StoreRuneListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1317);
			w[fm]();
		}
	};
	m = 1317;
	a[n] = m;
	
	a = o.StoreRuneListRsp = class {
		decode(r) {
			this.refreshNum = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.StoreRuneItem().decode(r);   
			}
			return this;
		}
	};
	m = 1317;
	a[n] = m;
	c[m] = a;
	
	//符文商店--购买物品
	a = o.StoreRuneBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1318);
			w[w3](this.id);
			w[w3](this.num);
			w[fm]();
		}
	};
	m = 1318;
	a[n] = m;
	
	a = o.StoreRuneBuyRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.count = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1318;
	a[n] = m;
	c[m] = a;
	
	//符文商店--刷新物品
	a = o.StoreRuneRefreshReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1319);
			w[fm]();
		}
	};
	m = 1319;
	a[n] = m;
	
	a = o.StoreRuneRefreshRsp = class {
		decode(r) {
			this.refreshNum = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.StoreRuneItem().decode(r);   
			}
			return this;
		}
	};
	m = 1319;
	a[n] = m;
	c[m] = a;
	
	a = o.OperationStoreUpdateRsp = class {
		decode(r) {
			this.info = new o.StoreBuyInfo().decode(r);
			return this;
		}
	};
	m = 1320;
	a[n] = m;
	c[m] = a;
	
	//彩蛋、礼券超市--信息
	a = o.OperationStoreListInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1321);
			w[fm]();
		}
	};
	m = 1321;
	a[n] = m;
	
	a = o.OperationStoreListInfoRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.StoreBuyInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1321;
	a[n] = m;
	c[m] = a;
	
	a = o.TimeLimitGift = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.giftId);
			w[w3](this.endTime);
		}
		decode(r) {
			this.id = r[r3]();
			this.giftId = r[r3]();
			this.endTime = r[r3]();
			return this;
		}
	};
	
	//限时特惠礼包--列表
	a = o.TimeLimitGiftReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1322);
			w[fm]();
		}
	};
	m = 1322;
	a[n] = m;
	
	a = o.TimeLimitGiftRsp = class {
		decode(r) {
			this.gifts = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.gifts[i] = new o.TimeLimitGift().decode(r);   
			}
			return this;
		}
	};
	m = 1322;
	a[n] = m;
	c[m] = a;
	
	//丧尸商店--商品列表
	a = o.StoreSiegeListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1323);
			w[fm]();
		}
	};
	m = 1323;
	a[n] = m;
	
	a = o.StoreSiegeListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.StoreBlackItem().decode(r);   
			}
			return this;
		}
	};
	m = 1323;
	a[n] = m;
	c[m] = a;
	
	a = o.HeroAwakeGift = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.outTime);
			w[w3](this.count);
		}
		decode(r) {
			this.id = r[r3]();
			this.outTime = r[r3]();
			this.count = r[r3]();
			return this;
		}
	};
	
	//英雄觉醒--觉醒礼包
	a = o.HeroAwakeGiftReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1324);
			w[fm]();
		}
	};
	m = 1324;
	a[n] = m;
	
	a = o.HeroAwakeGiftRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.HeroAwakeGift().decode(r);   
			}
			return this;
		}
	};
	m = 1324;
	a[n] = m;
	c[m] = a;
	
	//英雄觉醒--推送新增礼包，或者更新购买次数
	a = o.HeroAwakeGiftUpdateRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.HeroAwakeGift().decode(r);   
			}
			return this;
		}
	};
	m = 1325;
	a[n] = m;
	c[m] = a;
	
	//专属商店--商品列表
	a = o.StoreUniqueEquipListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1326);
			w[fm]();
		}
	};
	m = 1326;
	a[n] = m;
	
	a = o.StoreUniqueEquipListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.StoreBlackItem().decode(r);   
			}
			return this;
		}
	};
	m = 1326;
	a[n] = m;
	c[m] = a;
	
	//专属商店--刷新
	a = o.StoreUniqueEquipRefreshReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1327);
			w[fm]();
		}
	};
	m = 1327;
	a[n] = m;
	
	a = o.StoreUniqueEquipRefreshRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.StoreBlackItem().decode(r);   
			}
			return this;
		}
	};
	m = 1327;
	a[n] = m;
	c[m] = a;
	
	a = o.Sign = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wb](this.signed);
			w[w3](this.count);
			w[w3](this.buCount);
			w[wb](this.signPay);
			w[wb](this.signPayAvailable);
		}
		decode(r) {
			this.signed = r[rb]();
			this.count = r[r3]();
			this.buCount = r[r3]();
			this.signPay = r[rb]();
			this.signPayAvailable = r[rb]();
			return this;
		}
	};
	
	//签到--信息
	a = o.SignInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1401);
			w[fm]();
		}
	};
	m = 1401;
	a[n] = m;
	
	a = o.SignInfoRsp = class {
		decode(r) {
			this.info = new o.Sign().decode(r);
			return this;
		}
	};
	m = 1401;
	a[n] = m;
	c[m] = a;
	
	//签到--签到
	a = o.SignLoginReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1402);
			w[fm]();
		}
	};
	m = 1402;
	a[n] = m;
	
	a = o.SignLoginRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 1402;
	a[n] = m;
	c[m] = a;
	
	//签到--补签
	a = o.SignBuReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1403);
			w[fm]();
		}
	};
	m = 1403;
	a[n] = m;
	
	a = o.SignBuRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 1403;
	a[n] = m;
	c[m] = a;
	
	//签到--充值签到
	a = o.SignPayReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1404);
			w[fm]();
		}
	};
	m = 1404;
	a[n] = m;
	
	a = o.SignPayRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1404;
	a[n] = m;
	c[m] = a;
	
	a = o.RubyInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.exp);
		}
		decode(r) {
			this.id = r[r3]();
			this.exp = r[r3]();
			return this;
		}
	};
	
	//宝石--升级
	a = o.RubyUpgradeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1501);
			w[w3](this.heroId);
			w[w3](this.slotIdx);
			w[w3](this.rubyIdx);
			w[fm]();
		}
	};
	m = 1501;
	a[n] = m;
	
	a = o.RubyUpgradeRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.slotIdx = r[r3]();
			this.rubyIdx = r[r3]();
			this.rubyId = r[r3]();
			return this;
		}
	};
	m = 1501;
	a[n] = m;
	c[m] = a;
	
	//宝石--合成
	a = o.RubyComposeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1502);
			w[w3](this.rubyId);
			w[fm]();
		}
	};
	m = 1502;
	a[n] = m;
	
	a = o.RubyComposeRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1502;
	a[n] = m;
	c[m] = a;
	
	//宝石--镶嵌
	a = o.RubyPutOnReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1503);
			w[w3](this.heroId);
			w[w3](this.slotIdx);
			w[w3](this.rubyIdx);
			w[w3](this.rubyId);
			w[fm]();
		}
	};
	m = 1503;
	a[n] = m;
	
	a = o.RubyPutOnRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.slotIdx = r[r3]();
			this.rubies = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rubies[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 1503;
	a[n] = m;
	c[m] = a;
	
	//宝石--拆卸
	a = o.RubyTakeOffReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1504);
			w[w3](this.heroId);
			w[w3](this.slotIdx);
			w[w3](this.rubyIdx);
			w[fm]();
		}
	};
	m = 1504;
	a[n] = m;
	
	a = o.RubyTakeOffRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.slotIdx = r[r3]();
			this.rubies = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rubies[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 1504;
	a[n] = m;
	c[m] = a;
	
	a = o.GeneralInfo = class {
		constructor(d) {
			this.skills = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.weaponId);
			this.arr.encode(w);
			w[w1](this.skills.length);
			for (var i = 0, len = this.skills.length; i < len; i++) {
				this.skills[i].encode(w);   
			}
		}
		decode(r) {
			this.weaponId = r[r3]();
			this.arr = new o.GeneralAttr().decode(r);
			this.skills = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.skills[i] = new o.FightSkill().decode(r);   
			}
			return this;
		}
	};
	
	a = o.GeneralAttr = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.atkW);
			w[w3](this.hitW);
			w[w3](this.critW);
			w[w3](this.hurtW);
			w[w3](this.defPeneW);
			w[w3](this.speed);
			w[w3](this.atkSpeedW);
		}
		decode(r) {
			this.atkW = r[r3]();
			this.hitW = r[r3]();
			this.critW = r[r3]();
			this.hurtW = r[r3]();
			this.defPeneW = r[r3]();
			this.speed = r[r3]();
			this.atkSpeedW = r[r3]();
			return this;
		}
	};
	
	//指挥官属性
	a = o.GeneralAttrRsp = class {
		decode(r) {
			this.attr = new o.GeneralAttr().decode(r);
			this.skills = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.skills[i] = new o.FightSkill().decode(r);   
			}
			return this;
		}
	};
	m = 1601;
	a[n] = m;
	c[m] = a;
	
	//指挥官--信息
	a = o.GeneralInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1602);
			w[fm]();
		}
	};
	m = 1602;
	a[n] = m;
	
	a = o.GeneralInfoRsp = class {
		decode(r) {
			this.general = new o.GeneralInfo().decode(r);
			return this;
		}
	};
	m = 1602;
	a[n] = m;
	c[m] = a;
	
	a = o.GweaponAttr = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.heroHp);
			w[w3](this.heroAtk);
			w[w3](this.heroDef);
			w[w3](this.heroPower);
			w[w3](this.soldierHp);
			w[w3](this.soldierAtk);
			w[w3](this.soldierDef);
			w[w3](this.soldierPower);
			w[w3](this.dmgAdd);
			w[w3](this.dmgRes);
			w[w3](this.heroHit);
			w[w3](this.heroDodge);
		}
		decode(r) {
			this.heroHp = r[r3]();
			this.heroAtk = r[r3]();
			this.heroDef = r[r3]();
			this.heroPower = r[r3]();
			this.soldierHp = r[r3]();
			this.soldierAtk = r[r3]();
			this.soldierDef = r[r3]();
			this.soldierPower = r[r3]();
			this.dmgAdd = r[r3]();
			this.dmgRes = r[r3]();
			this.heroHit = r[r3]();
			this.heroDodge = r[r3]();
			return this;
		}
	};
	
	//指挥官--切换神器
	a = o.GeneralChangeWeaponReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1603);
			w[w3](this.weaponId);
			w[fm]();
		}
	};
	m = 1603;
	a[n] = m;
	
	a = o.GeneralChangeWeaponRsp = class {
		decode(r) {
			this.weaponId = r[r3]();
			this.newPower = r[r3]();
			this.diffAttr = new o.GweaponAttr().decode(r);
			return this;
		}
	};
	m = 1603;
	a[n] = m;
	c[m] = a;
	
	//指挥官--拥有神器信息
	a = o.GeneralWeaponInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1604);
			w[fm]();
		}
	};
	m = 1604;
	a[n] = m;
	
	a = o.GeneralWeaponInfoRsp = class {
		decode(r) {
			this.weaponId = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.weaponId[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 1604;
	a[n] = m;
	c[m] = a;
	
	a = o.GeneralWeaponGetRsp = class {
		decode(r) {
			this.weaponId = r[r3]();
			return this;
		}
	};
	m = 1605;
	a[n] = m;
	c[m] = a;
	
	//指挥官--神奇升级、精炼信息
	a = o.GeneralWeaponUpgradeInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1606);
			w[fm]();
		}
	};
	m = 1606;
	a[n] = m;
	
	a = o.GeneralWeaponUpgradeInfoRsp = class {
		decode(r) {
			this.levelId = r[r3]();
			this.levelLv = r[r3]();
			this.progressId = r[r3]();
			this.progressLv = r[r3]();
			return this;
		}
	};
	m = 1606;
	a[n] = m;
	c[m] = a;
	
	//指挥官--神器升级
	a = o.GeneralWeaponLevelUpgradeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1607);
			w[wb](this.isQuickUpgrade);
			w[fm]();
		}
	};
	m = 1607;
	a[n] = m;
	
	a = o.GeneralWeaponLevelUpgradeRsp = class {
		decode(r) {
			this.curId = r[r3]();
			this.curLv = r[r3]();
			return this;
		}
	};
	m = 1607;
	a[n] = m;
	c[m] = a;
	
	//指挥官--神器精炼
	a = o.GeneralWeaponProgressUpgradeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1608);
			w[fm]();
		}
	};
	m = 1608;
	a[n] = m;
	
	a = o.GeneralWeaponProgressUpgradeRsp = class {
		decode(r) {
			this.lv = r[r3]();
			return this;
		}
	};
	m = 1608;
	a[n] = m;
	c[m] = a;
	
	a = o.GweaponInfo = class {
		constructor(d) {
			this.skillLv = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.gweaponId);
			w[w3](this.star);
			w[w1](this.skillLv.length);
			for (var i = 0, len = this.skillLv.length; i < len; i++) {
				w[wy](this.skillLv[i]);   
			}
		}
		decode(r) {
			this.gweaponId = r[r3]();
			this.star = r[r3]();
			this.skillLv = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.skillLv[i] = r[ry]();   
			}
			return this;
		}
	};
	
	//神器--列表（废弃）
	a = o.GweaponListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1701);
			w[fm]();
		}
	};
	m = 1701;
	a[n] = m;
	
	a = o.GweaponListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GweaponInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1701;
	a[n] = m;
	c[m] = a;
	
	//神器--强化（废弃）
	a = o.GweaponStrengthReq = class {
		constructor(d) {
			this.itemList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1702);
			w[w1](this.itemList.length);
			for (var i = 0, len = this.itemList.length; i < len; i++) {
				w[w3](this.itemList[i]);   
			}
			w[fm]();
		}
	};
	m = 1702;
	a[n] = m;
	
	a = o.GweaponStrengthRsp = class {
		decode(r) {
			this.level = r[r3]();
			this.exp = r[r3]();
			return this;
		}
	};
	m = 1702;
	a[n] = m;
	c[m] = a;
	
	//神器--升星（废弃）
	a = o.GweaponUpgradeStarReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1703);
			w[w3](this.gweaponId);
			w[fm]();
		}
	};
	m = 1703;
	a[n] = m;
	
	a = o.GweaponUpgradeStarRsp = class {
		decode(r) {
			this.gweapon = new o.GweaponInfo().decode(r);
			return this;
		}
	};
	m = 1703;
	a[n] = m;
	c[m] = a;
	
	//神器--信息（废弃）
	a = o.GweaponIdInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1704);
			w[fm]();
		}
	};
	m = 1704;
	a[n] = m;
	
	a = o.GweaponIdInfoRsp = class {
		decode(r) {
			this.info = new o.GweaponInfo().decode(r);
			return this;
		}
	};
	m = 1704;
	a[n] = m;
	c[m] = a;
	
	a = o.RankBrief = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w3](this.value);
			w[w3](this.yesterday);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.value = r[r3]();
			this.yesterday = r[r3]();
			return this;
		}
	};
	
	//排行榜--昨日排名
	a = o.RankYesterdayReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1801);
			w[fm]();
		}
	};
	m = 1801;
	a[n] = m;
	
	a = o.RankYesterdayRsp = class {
		decode(r) {
			this.power = r[r3]();
			this.refine = r[r3]();
			this.mstage = r[r3]();
			this.mcups = r[r3]();
			return this;
		}
	};
	m = 1801;
	a[n] = m;
	c[m] = a;
	
	//战力榜--排行
	a = o.RankPowerReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1802);
			w[fm]();
		}
	};
	m = 1802;
	a[n] = m;
	
	a = o.RankPowerRsp = class {
		decode(r) {
			this.time = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RankBrief().decode(r);   
			}
			return this;
		}
	};
	m = 1802;
	a[n] = m;
	c[m] = a;
	
	//战力榜--数值
	a = o.RankPowerValuesReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1803);
			w[fm]();
		}
	};
	m = 1803;
	a[n] = m;
	
	a = o.RankPowerValuesRsp = class {
		decode(r) {
			this.time = r[r3]();
			this.values = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.values[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 1803;
	a[n] = m;
	c[m] = a;
	
	//试炼榜--排行
	a = o.RankRefineReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1804);
			w[fm]();
		}
	};
	m = 1804;
	a[n] = m;
	
	a = o.RankRefineRsp = class {
		decode(r) {
			this.time = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RankBrief().decode(r);   
			}
			return this;
		}
	};
	m = 1804;
	a[n] = m;
	c[m] = a;
	
	//试炼榜--数值
	a = o.RankRefineValuesReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1805);
			w[fm]();
		}
	};
	m = 1805;
	a[n] = m;
	
	a = o.RankRefineValuesRsp = class {
		decode(r) {
			this.time = r[r3]();
			this.values = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.values[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 1805;
	a[n] = m;
	c[m] = a;
	
	//竞技榜--排行
	a = o.RankArenaReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1806);
			w[fm]();
		}
	};
	m = 1806;
	a[n] = m;
	
	a = o.RankArenaRsp = class {
		decode(r) {
			this.time = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RankBrief().decode(r);   
			}
			return this;
		}
	};
	m = 1806;
	a[n] = m;
	c[m] = a;
	
	//主线榜--排行
	a = o.RankMstageReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1807);
			w[fm]();
		}
	};
	m = 1807;
	a[n] = m;
	
	a = o.RankMstageRsp = class {
		decode(r) {
			this.time = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RankBrief().decode(r);   
			}
			return this;
		}
	};
	m = 1807;
	a[n] = m;
	c[m] = a;
	
	//主线榜--数值
	a = o.RankMstageValuesReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1808);
			w[fm]();
		}
	};
	m = 1808;
	a[n] = m;
	
	a = o.RankMstageValuesRsp = class {
		decode(r) {
			this.time = r[r3]();
			this.values = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.values[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 1808;
	a[n] = m;
	c[m] = a;
	
	//奖杯榜--排行
	a = o.RankMcupsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1809);
			w[fm]();
		}
	};
	m = 1809;
	a[n] = m;
	
	a = o.RankMcupsRsp = class {
		decode(r) {
			this.time = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RankBrief().decode(r);   
			}
			return this;
		}
	};
	m = 1809;
	a[n] = m;
	c[m] = a;
	
	//奖杯榜--数值
	a = o.RankMcupsValuesReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1810);
			w[fm]();
		}
	};
	m = 1810;
	a[n] = m;
	
	a = o.RankMcupsValuesRsp = class {
		decode(r) {
			this.time = r[r3]();
			this.values = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.values[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 1810;
	a[n] = m;
	c[m] = a;
	
	//排行榜--详细情况
	a = o.RankDetailReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1811);
			w[wy](this.type);
			w[fm]();
		}
	};
	m = 1811;
	a[n] = m;
	
	a = o.RankDetailRsp = class {
		decode(r) {
			this.type = r[ry]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RankBrief().decode(r);   
			}
			return this;
		}
	};
	m = 1811;
	a[n] = m;
	c[m] = a;
	
	a = o.RankSelfRsp = class {
		decode(r) {
			this.type = r[ry]();
			this.numYd = r[r3]();
			this.numTd = r[r3]();
			return this;
		}
	};
	m = 1812;
	a[n] = m;
	c[m] = a;
	
	a = o.ArenaPlayer = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.id);
			w[w3](this.robotId);
			w[ws](this.name);
			w[w3](this.head);
			w[w3](this.frame);
			w[w3](this.level);
			w[w3](this.power);
			w[w3](this.score);
			w[w3](this.vipExp);
		}
		decode(r) {
			this.id = r[r6]();
			this.robotId = r[r3]();
			this.name = r[rs]();
			this.head = r[r3]();
			this.frame = r[r3]();
			this.level = r[r3]();
			this.power = r[r3]();
			this.score = r[r3]();
			this.vipExp = r[r3]();
			return this;
		}
	};
	
	a = o.ArenaFighter = class {
		constructor(d) {
			this.heroList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w1](this.heroList.length);
			for (var i = 0, len = this.heroList.length; i < len; i++) {
				if (!this.heroList[i]) {
					w[wb](false);
				} else {
					w[wb](true);
					this.heroList[i].encode(w);
				}   
			}
			if (!this.general) {
				w[wb](false);
			} else {
				w[wb](true);
				this.general.encode(w);
			}
		}
		decode(r) {
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				if (r[rb]()) {
					this.heroList[i] = new o.FightHero().decode(r);
				}   
			}
			if (r[rb]()) {
				this.general = new o.FightGeneral().decode(r);
			}
			return this;
		}
	};
	
	a = o.ArenaLog = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.fightType);
			w[w3](this.fightTime);
			w[w3](this.addScore);
			w[w6](this.opponentId);
			w[ws](this.opponentName);
			w[w3](this.opponentHead);
			w[w3](this.opponentFrame);
			w[w3](this.opponentLevel);
			w[w3](this.opponentPower);
			w[w3](this.opponentVipExp);
		}
		decode(r) {
			this.fightType = r[ry]();
			this.fightTime = r[r3]();
			this.addScore = r[r3]();
			this.opponentId = r[r6]();
			this.opponentName = r[rs]();
			this.opponentHead = r[r3]();
			this.opponentFrame = r[r3]();
			this.opponentLevel = r[r3]();
			this.opponentPower = r[r3]();
			this.opponentVipExp = r[r3]();
			return this;
		}
	};
	
	//竞技场--信息
	a = o.ArenaInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1901);
			w[fm]();
		}
	};
	m = 1901;
	a[n] = m;
	
	a = o.ArenaInfoRsp = class {
		decode(r) {
			this.logList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.logList[i] = new o.ArenaLog().decode(r);   
			}
			this.score = r[r3]();
			this.points = r[r3]();
			this.rankNum = r[r3]();
			this.fightNum = r[r3]();
			this.buyNum = r[r3]();
			this.awardNums = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.awardNums[i] = r[ry]();   
			}
			this.raidTime = r[r3]();
			this.raidTimes = r[r3]();
			return this;
		}
	};
	m = 1901;
	a[n] = m;
	c[m] = a;
	
	//竞技场--战斗开始
	a = o.ArenaFightReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1902);
			w[w6](this.opponentId);
			w[fm]();
		}
	};
	m = 1902;
	a[n] = m;
	
	a = o.ArenaFightRsp = class {
		decode(r) {
			this.opponentId = r[r6]();
			return this;
		}
	};
	m = 1902;
	a[n] = m;
	c[m] = a;
	
	//竞技场--战斗结果
	a = o.ArenaFightResultReq = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1903);
			w[w6](this.opponentId);
			w[wb](this.success);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
			w[fm]();
		}
	};
	m = 1903;
	a[n] = m;
	
	a = o.ArenaFightResultRsp = class {
		decode(r) {
			this.points = r[r3]();
			this.score = r[r3]();
			this.addScore = r[r3]();
			this.log = new o.ArenaLog().decode(r);
			this.awards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.awards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1903;
	a[n] = m;
	c[m] = a;
	
	//竞技场--设置防守阵容
	a = o.ArenaDefenceSetReq = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1904);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
			w[fm]();
		}
	};
	m = 1904;
	a[n] = m;
	
	a = o.ArenaDefenceSetRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 1904;
	a[n] = m;
	c[m] = a;
	
	//竞技场--查看防守阵容（废弃）
	a = o.ArenaDefenceReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1905);
			w[fm]();
		}
	};
	m = 1905;
	a[n] = m;
	
	a = o.ArenaDefenceRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 1905;
	a[n] = m;
	c[m] = a;
	
	//竞技场--匹配对手
	a = o.ArenaMatchReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1906);
			w[fm]();
		}
	};
	m = 1906;
	a[n] = m;
	
	a = o.ArenaMatchRsp = class {
		decode(r) {
			this.players = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.players[i] = new o.ArenaPlayer().decode(r);   
			}
			this.matchTime = r[r3]();
			return this;
		}
	};
	m = 1906;
	a[n] = m;
	c[m] = a;
	
	//竞技场--购买次数
	a = o.ArenaBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1907);
			w[fm]();
		}
	};
	m = 1907;
	a[n] = m;
	
	a = o.ArenaBuyRsp = class {
		decode(r) {
			this.fightNum = r[r3]();
			this.buyNum = r[r3]();
			return this;
		}
	};
	m = 1907;
	a[n] = m;
	c[m] = a;
	
	//竞技场--查询对手
	a = o.ArenaQueryReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1908);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 1908;
	a[n] = m;
	
	a = o.ArenaQueryRsp = class {
		decode(r) {
			if (r[rb]()) {
				this.player = new o.ArenaPlayer().decode(r);
			}
			return this;
		}
	};
	m = 1908;
	a[n] = m;
	c[m] = a;
	
	//竞技场--积分奖励
	a = o.ArenaPointsAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1909);
			w[wy](this.index);
			w[fm]();
		}
	};
	m = 1909;
	a[n] = m;
	
	a = o.ArenaPointsAwardRsp = class {
		decode(r) {
			this.points = r[r3]();
			this.awardNums = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.awardNums[i] = r[ry]();   
			}
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1909;
	a[n] = m;
	c[m] = a;
	
	//竞技场--战斗准备
	a = o.ArenaPrepareReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1910);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 1910;
	a[n] = m;
	
	a = o.ArenaPrepareRsp = class {
		decode(r) {
			this.defender = new o.ArenaFighter().decode(r);
			return this;
		}
	};
	m = 1910;
	a[n] = m;
	c[m] = a;
	
	//竞技场--扫荡
	a = o.ArenaRaidReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](1911);
			w[w6](this.opponentId);
			w[fm]();
		}
	};
	m = 1911;
	a[n] = m;
	
	a = o.ArenaRaidRsp = class {
		decode(r) {
			this.raidTime = r[r3]();
			this.raidTimes = r[r3]();
			this.fightNum = r[r3]();
			this.points = r[r3]();
			this.score = r[r3]();
			this.addScore = r[r3]();
			this.log = new o.ArenaLog().decode(r);
			this.awards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.awards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 1911;
	a[n] = m;
	c[m] = a;
	
	a = o.JusticeSlot = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.heroId);
			w[w3](this.heroPower);
		}
		decode(r) {
			this.heroId = r[r3]();
			this.heroPower = r[r3]();
			return this;
		}
	};
	
	a = o.JusticeGeneral = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.level);
		}
		decode(r) {
			this.level = r[r3]();
			return this;
		}
	};
	
	a = o.JusticeBoss = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w6](this.hp);
			w[w3](this.recoverTime);
		}
		decode(r) {
			this.id = r[r3]();
			this.hp = r[r6]();
			this.recoverTime = r[r3]();
			return this;
		}
	};
	
	//正义的反击--同步状态
	a = o.JusticeStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2001);
			w[fm]();
		}
	};
	m = 2001;
	a[n] = m;
	
	a = o.JusticeStateRsp = class {
		decode(r) {
			this.score = r[r6]();
			this.generalDps = r[r6]();
			this.slotDps = r[r6]();
			this.atkTime = r[r3]();
			this.maxKillId = r[r3]();
			this.boss = new o.JusticeBoss().decode(r);
			this.general = new o.JusticeGeneral().decode(r);
			this.slots = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.slots[i] = new o.JusticeSlot().decode(r);   
			}
			this.mercenaries = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.mercenaries[i] = r[r3]();   
			}
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2001;
	a[n] = m;
	c[m] = a;
	
	//正义的反击--召唤BOSS
	a = o.JusticeSummonReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2002);
			w[fm]();
		}
	};
	m = 2002;
	a[n] = m;
	
	a = o.JusticeSummonRsp = class {
		decode(r) {
			this.boss = new o.JusticeBoss().decode(r);
			return this;
		}
	};
	m = 2002;
	a[n] = m;
	c[m] = a;
	
	//正义的反击--点击BOSS
	a = o.JusticeClickReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2003);
			w[fm]();
		}
	};
	m = 2003;
	a[n] = m;
	
	a = o.JusticeClickRsp = class {
		decode(r) {
			this.isCrit = r[rb]();
			this.isDead = r[rb]();
			this.damage = r[r6]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2003;
	a[n] = m;
	c[m] = a;
	
	//正义的反击--上阵英雄
	a = o.JusticeHeroInReq = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2004);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
			w[fm]();
		}
	};
	m = 2004;
	a[n] = m;
	
	//正义的反击--升级指挥官
	a = o.JusticeGeneralLvupReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2005);
			w[fm]();
		}
	};
	m = 2005;
	a[n] = m;
	
	//正义的反击--开启插槽
	a = o.JusticeSlotOpenReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2006);
			w[fm]();
		}
	};
	m = 2006;
	a[n] = m;
	
	a = o.JusticeSlotOpenRsp = class {
		decode(r) {
			this.index = r[r3]();
			return this;
		}
	};
	m = 2006;
	a[n] = m;
	c[m] = a;
	
	//正义的反击--升级佣兵
	a = o.JusticeMercenaryLvupReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2007);
			w[wy](this.type);
			w[fm]();
		}
	};
	m = 2007;
	a[n] = m;
	
	//正义的反击--重置BOSS
	a = o.JusticeBossResetReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2008);
			w[fm]();
		}
	};
	m = 2008;
	a[n] = m;
	
	a = o.JusticeBossResetRsp = class {
		decode(r) {
			this.boss = new o.JusticeBoss().decode(r);
			this.atkTime = r[r3]();
			return this;
		}
	};
	m = 2008;
	a[n] = m;
	c[m] = a;
	
	//正义的反击--已获得物品
	a = o.JusticeItemsGotReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2009);
			w[fm]();
		}
	};
	m = 2009;
	a[n] = m;
	
	a = o.JusticeItemsGotRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2009;
	a[n] = m;
	c[m] = a;
	
	//正义的反击--快速击杀
	a = o.JusticeQuickKillReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2010);
			w[fm]();
		}
	};
	m = 2010;
	a[n] = m;
	
	//正义的反击--一键升级
	a = o.JusticeQuickLvupReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2011);
			w[fm]();
		}
	};
	m = 2011;
	a[n] = m;
	
	//查看章节奖励
	a = o.DungeonChapter = class {
		constructor(d) {
			this.cups = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.chapterId);
			w[wy](this.boxes);
			w[w1](this.cups.length);
			for (var i = 0, len = this.cups.length; i < len; i++) {
				w[wy](this.cups[i]);   
			}
		}
		decode(r) {
			this.chapterId = r[r3]();
			this.boxes = r[ry]();
			this.cups = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.cups[i] = r[ry]();   
			}
			return this;
		}
	};
	
	//副本--章节列表
	a = o.DungeonChapterListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2101);
			w[fm]();
		}
	};
	m = 2101;
	a[n] = m;
	
	a = o.DungeonChapterListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.DungeonChapter().decode(r);   
			}
			return this;
		}
	};
	m = 2101;
	a[n] = m;
	c[m] = a;
	
	//副本--章节奖励
	a = o.DungeonChapterRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2102);
			w[w3](this.prizeId);
			w[fm]();
		}
	};
	m = 2102;
	a[n] = m;
	
	a = o.DungeonChapterRewardRsp = class {
		decode(r) {
			this.prizeId = r[r3]();
			this.chapterId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2102;
	a[n] = m;
	c[m] = a;
	
	a = o.DungeonInfo = class {
		constructor(d) {
			this.rewardFlag = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.dungeonId);
			w[w3](this.stageId);
			w[w3](this.hangupId);
			w[w3](this.num);
			w[w3](this.hangupTime);
			w[w1](this.rewardFlag.length);
			for (var i = 0, len = this.rewardFlag.length; i < len; i++) {
				w[wy](this.rewardFlag[i]);   
			}
			w[wy](this.buyRaids);
			w[wy](this.raids);
		}
		decode(r) {
			this.dungeonId = r[r3]();
			this.stageId = r[r3]();
			this.hangupId = r[r3]();
			this.num = r[r3]();
			this.hangupTime = r[r3]();
			this.rewardFlag = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewardFlag[i] = r[ry]();   
			}
			this.buyRaids = r[ry]();
			this.raids = r[ry]();
			return this;
		}
	};
	
	//英雄副本查询信息
	a = o.DungeonBoss = class {
		constructor(d) {
			this.heroList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.stageId);
			w[w3](this.bossHp);
			w[w3](this.lastTime);
			w[w1](this.heroList.length);
			for (var i = 0, len = this.heroList.length; i < len; i++) {
				w[w3](this.heroList[i]);   
			}
			w[w3](this.summonLv);
			w[w3](this.killFlag);
		}
		decode(r) {
			this.stageId = r[r3]();
			this.bossHp = r[r3]();
			this.lastTime = r[r3]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroList[i] = r[r3]();   
			}
			this.summonLv = r[r3]();
			this.killFlag = r[r3]();
			return this;
		}
	};
	
	//副本--列表
	a = o.DungeonListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2103);
			w[fm]();
		}
	};
	m = 2103;
	a[n] = m;
	
	a = o.DungeonListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.DungeonInfo().decode(r);   
			}
			this.boss = new o.DungeonBoss().decode(r);
			return this;
		}
	};
	m = 2103;
	a[n] = m;
	c[m] = a;
	
	//副本--进入
	a = o.DungeonEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2104);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2104;
	a[n] = m;
	
	a = o.DungeonEnterRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.minPower = r[r3]();
			return this;
		}
	};
	m = 2104;
	a[n] = m;
	c[m] = a;
	
	//副本--退出（领取奖励）
	a = o.DungeonExitReq = class {
		constructor(d) {
			this.heroes = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2105);
			w[w3](this.stageId);
			w[wb](this.clear);
			w[wy](this.cups);
			w[w1](this.heroes.length);
			for (var i = 0, len = this.heroes.length; i < len; i++) {
				w[w3](this.heroes[i]);   
			}
			w[w3](this.rndseed);
			w[ws](this.actions);
			w[fm]();
		}
	};
	m = 2105;
	a[n] = m;
	
	a = o.DungeonExitRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.cups = r[ry]();
			this.isFirst = r[rb]();
			this.percent = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			this.levelUp = r[rb]();
			return this;
		}
	};
	m = 2105;
	a[n] = m;
	c[m] = a;
	
	//副本--扫荡
	a = o.DungeonRaidsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2106);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2106;
	a[n] = m;
	
	a = o.DungeonRaidsRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2106;
	a[n] = m;
	c[m] = a;
	
	//挂机--选择关卡
	a = o.DungeonHangChooseReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2107);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2107;
	a[n] = m;
	
	//挂机--获取状态
	a = o.DungeonHangStatusReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2108);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2108;
	a[n] = m;
	
	a = o.DungeonHangStatusRsp = class {
		decode(r) {
			this.dungeonId = r[r3]();
			this.stageId = r[r3]();
			this.startTime = r[r3]();
			this.exploreTime = r[r3]();
			this.hangupReady = r[rb]();
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2108;
	a[n] = m;
	c[m] = a;
	
	//挂机--领取奖励
	a = o.DungeonHangRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2109);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2109;
	a[n] = m;
	
	a = o.DungeonHangRewardRsp = class {
		decode(r) {
			this.dungeonId = r[r3]();
			this.stageId = r[r3]();
			this.startTime = r[r3]();
			this.exploreTime = r[r3]();
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			this.monthCardGoodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.monthCardGoodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2109;
	a[n] = m;
	c[m] = a;
	
	//英雄副本--召唤BOSS
	a = o.DungeonBossSummonReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2110);
			w[fm]();
		}
	};
	m = 2110;
	a[n] = m;
	
	a = o.DungeonBossSummonRsp = class {
		decode(r) {
			this.bossInfo = new o.DungeonBoss().decode(r);
			return this;
		}
	};
	m = 2110;
	a[n] = m;
	c[m] = a;
	
	//英雄副本--英雄上阵
	a = o.DungeonBossBattleReq = class {
		constructor(d) {
			this.heroList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2111);
			w[w1](this.heroList.length);
			for (var i = 0, len = this.heroList.length; i < len; i++) {
				w[w3](this.heroList[i]);   
			}
			w[fm]();
		}
	};
	m = 2111;
	a[n] = m;
	
	a = o.DungeonBossBattleRsp = class {
		decode(r) {
			this.bossInfo = new o.DungeonBoss().decode(r);
			return this;
		}
	};
	m = 2111;
	a[n] = m;
	c[m] = a;
	
	//英雄副本--玩家点击
	a = o.DungeonBossClickReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2112);
			w[fm]();
		}
	};
	m = 2112;
	a[n] = m;
	
	a = o.DungeonBossClickRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.bossHp = r[r3]();
			this.isCrit = r[rb]();
			this.dropList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.dropList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2112;
	a[n] = m;
	c[m] = a;
	
	//英雄副本--英雄攻击
	a = o.DungeonBossFightReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2113);
			w[fm]();
		}
	};
	m = 2113;
	a[n] = m;
	
	a = o.DungeonBossFightRsp = class {
		decode(r) {
			this.bossInfo = new o.DungeonBoss().decode(r);
			this.dropList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.dropList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2113;
	a[n] = m;
	c[m] = a;
	
	//引导副本--辅助英雄
	a = o.DungeonAssistsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2114);
			w[w3](this.stageId);
			w[w3](this.activityId);
			w[fm]();
		}
	};
	m = 2114;
	a[n] = m;
	
	a = o.DungeonAssistsRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.FightHero().decode(r);   
			}
			return this;
		}
	};
	m = 2114;
	a[n] = m;
	c[m] = a;
	
	// 精英
	a = o.DungeonElitesStage = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.stageId);
			w[wy](this.cups);
		}
		decode(r) {
			this.stageId = r[r3]();
			this.cups = r[ry]();
			return this;
		}
	};
	
	//精英副本--进度
	a = o.DungeonElitesReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2115);
			w[fm]();
		}
	};
	m = 2115;
	a[n] = m;
	
	a = o.DungeonElitesRsp = class {
		decode(r) {
			this.noviceStage = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.noviceStage[i] = new o.DungeonElitesStage().decode(r);   
			}
			this.noviceBits = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.noviceBits[i] = r[ry]();   
			}
			this.challengeStage = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.challengeStage[i] = new o.DungeonElitesStage().decode(r);   
			}
			this.challengeBits = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.challengeBits[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 2115;
	a[n] = m;
	c[m] = a;
	
	//挂机--奖励预览
	a = o.DungeonHangPreviewReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2116);
			w[w3](this.dungeonId);
			w[fm]();
		}
	};
	m = 2116;
	a[n] = m;
	
	a = o.DungeonHangPreviewRsp = class {
		decode(r) {
			this.dropItems = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.dropItems[i] = new o.GoodsInfo().decode(r);   
			}
			this.vipBonus = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.vipBonus[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2116;
	a[n] = m;
	c[m] = a;
	
	//精英副本--章节奖励
	a = o.DungeonElitesChapterRewardsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2117);
			w[w3](this.copyId);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 2117;
	a[n] = m;
	
	a = o.DungeonElitesChapterRewardsRsp = class {
		decode(r) {
			this.copyId = r[r3]();
			this.bits = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.bits[i] = r[ry]();   
			}
			this.chapterId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2117;
	a[n] = m;
	c[m] = a;
	
	//无尽黑暗--一键领取
	a = o.DungeonTrialRewardsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2118);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2118;
	a[n] = m;
	
	//无尽黑暗--一键领取
	a = o.DungeonTrialRewardsRsp = class {
		decode(r) {
			this.rewardFlag = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewardFlag[i] = r[ry]();   
			}
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2118;
	a[n] = m;
	c[m] = a;
	
	//无尽黑暗--扫荡
	a = o.DungeonTrialRaidsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2119);
			w[fm]();
		}
	};
	m = 2119;
	a[n] = m;
	
	a = o.DungeonTrialRaidsRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2119;
	a[n] = m;
	c[m] = a;
	
	//无尽黑暗--购买扫荡
	a = o.DungeonTrialBuyRaidsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2120);
			w[fm]();
		}
	};
	m = 2120;
	a[n] = m;
	
	//无尽黑暗--购买扫荡
	a = o.DungeonTrialBuyRaidsRsp = class {
		decode(r) {
			this.buyRaids = r[ry]();
			this.raids = r[ry]();
			return this;
		}
	};
	m = 2120;
	a[n] = m;
	c[m] = a;
	
	//英雄副本--进度及扫荡次数
	a = o.DungeonHeroSweepTimesReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2121);
			w[fm]();
		}
	};
	m = 2121;
	a[n] = m;
	
	a = o.DungeonHeroSweepTimesRsp = class {
		decode(r) {
			this.maxStage = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.maxStage[i] = r[r3]();   
			}
			this.heroSweep = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroSweep[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 2121;
	a[n] = m;
	c[m] = a;
	
	//英雄副本--扫荡
	a = o.DungeonHeroRaidReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2122);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2122;
	a[n] = m;
	
	a = o.DungeonHeroRaidRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2122;
	a[n] = m;
	c[m] = a;
	
	//英雄副本--进入
	a = o.DungeonHeroEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2123);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2123;
	a[n] = m;
	
	a = o.DungeonHeroEnterRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.minPower = r[r3]();
			return this;
		}
	};
	m = 2123;
	a[n] = m;
	c[m] = a;
	
	//英雄副本--退出
	a = o.DungeonHeroExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2124);
			w[w3](this.stageId);
			w[wb](this.clear);
			w[fm]();
		}
	};
	m = 2124;
	a[n] = m;
	
	a = o.DungeonHeroExitRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.isFirst = r[rb]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2124;
	a[n] = m;
	c[m] = a;
	
	//英雄副本--一键扫荡
	a = o.DungeonHeroQuickRaidReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2125);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2125;
	a[n] = m;
	
	//英雄副本--一键扫荡
	a = o.DungeonHeroQuickRaidRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2125;
	a[n] = m;
	c[m] = a;
	
	//精英副本--领取所有奖励
	a = o.DungeonElitesRewardsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2126);
			w[w3](this.copyId);
			w[fm]();
		}
	};
	m = 2126;
	a[n] = m;
	
	a = o.DungeonElitesRewardsRsp = class {
		decode(r) {
			this.copyId = r[r3]();
			this.bits = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.bits[i] = r[ry]();   
			}
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2126;
	a[n] = m;
	c[m] = a;
	
	//符文副本--进入
	a = o.DungeonRuneEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2127);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2127;
	a[n] = m;
	
	a = o.DungeonRuneEnterRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			return this;
		}
	};
	m = 2127;
	a[n] = m;
	c[m] = a;
	
	a = o.Monster = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.monsterId);
			w[w3](this.monsterNum);
		}
		decode(r) {
			this.monsterId = r[r3]();
			this.monsterNum = r[r3]();
			return this;
		}
	};
	
	//符文副本--退出
	a = o.DungeonRuneExitReq = class {
		constructor(d) {
			this.monsters = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2128);
			w[w3](this.stageId);
			w[w1](this.monsters.length);
			for (var i = 0, len = this.monsters.length; i < len; i++) {
				this.monsters[i].encode(w);   
			}
			w[wb](this.clear);
			w[fm]();
		}
	};
	m = 2128;
	a[n] = m;
	
	a = o.DungeonRuneExitRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.monsterNum = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2128;
	a[n] = m;
	c[m] = a;
	
	//符文副本--扫荡
	a = o.DungeonRuneRaidReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2129);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2129;
	a[n] = m;
	
	a = o.DungeonRuneRaidRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2129;
	a[n] = m;
	c[m] = a;
	
	//符文副本--一键扫荡
	a = o.DungeonRuneQuickRaidReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2130);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2130;
	a[n] = m;
	
	a = o.DungeonRuneQuickRaidRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.availableTimes = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2130;
	a[n] = m;
	c[m] = a;
	
	//符文副本--进度、次数信息
	a = o.DungeonRuneInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2131);
			w[fm]();
		}
	};
	m = 2131;
	a[n] = m;
	
	a = o.DungeonRuneInfoRsp = class {
		decode(r) {
			this.maxStageId = r[r3]();
			this.maxMonsterNum = r[r3]();
			this.availableTimes = r[r3]();
			return this;
		}
	};
	m = 2131;
	a[n] = m;
	c[m] = a;
	
	a = o.DungeonOrdealReward = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.damage);
			w[w3](this.times);
		}
		decode(r) {
			this.damage = r[r3]();
			this.times = r[r3]();
			return this;
		}
	};
	
	//英雄试炼--进度、次数信息
	a = o.DungeonOrdealInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2132);
			w[fm]();
		}
	};
	m = 2132;
	a[n] = m;
	
	a = o.DungeonOrdealInfoRsp = class {
		decode(r) {
			this.maxStageId = r[r3]();
			this.stageDamages = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.stageDamages[i] = r[r6]();   
			}
			this.rankNum = r[r3]();
			this.rewardRecord = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewardRecord[i] = r[r3]();   
			}
			this.rewardTimes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewardTimes[i] = new o.DungeonOrdealReward().decode(r);   
			}
			this.serverNum = r[r3]();
			return this;
		}
	};
	m = 2132;
	a[n] = m;
	c[m] = a;
	
	//英雄试炼--开始战斗
	a = o.DungeonOrdealEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2133);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2133;
	a[n] = m;
	
	a = o.DungeonOrdealEnterRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			return this;
		}
	};
	m = 2133;
	a[n] = m;
	c[m] = a;
	
	//英雄试炼--结束战斗
	a = o.DungeonOrdealExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2134);
			w[w3](this.stageId);
			w[w6](this.stageDamage);
			w[wb](this.clear);
			w[fm]();
		}
	};
	m = 2134;
	a[n] = m;
	
	a = o.DungeonOrdealExitRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.stageDamage = r[r6]();
			this.clearRewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.clearRewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2134;
	a[n] = m;
	c[m] = a;
	
	a = o.OrdealRankBrief = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w6](this.value);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.value = r[r6]();
			return this;
		}
	};
	
	//英雄试炼--排行榜
	a = o.DungeonOrdealRankListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2135);
			w[fm]();
		}
	};
	m = 2135;
	a[n] = m;
	
	a = o.DungeonOrdealRankListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.OrdealRankBrief().decode(r);   
			}
			return this;
		}
	};
	m = 2135;
	a[n] = m;
	c[m] = a;
	
	//英雄试炼--更新奖励剩余信息(主动推送)
	a = o.DungeonOrdealRewardUpdateRsp = class {
		decode(r) {
			this.reward = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.reward[i] = new o.DungeonOrdealReward().decode(r);   
			}
			return this;
		}
	};
	m = 2136;
	a[n] = m;
	c[m] = a;
	
	//英雄试炼--领取奖励
	a = o.DungeonOrdealRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2137);
			w[w3](this.damage);
			w[fm]();
		}
	};
	m = 2137;
	a[n] = m;
	
	a = o.DungeonOrdealRewardRsp = class {
		decode(r) {
			this.rewardRecord = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewardRecord[i] = r[r3]();   
			}
			this.rewardTimes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewardTimes[i] = new o.DungeonOrdealReward().decode(r);   
			}
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2137;
	a[n] = m;
	c[m] = a;
	
	//副本--最低通关战力
	a = o.DungeonMinPowerReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2138);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2138;
	a[n] = m;
	
	a = o.DungeonMinPowerRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.minPower = r[r3]();
			return this;
		}
	};
	m = 2138;
	a[n] = m;
	c[m] = a;
	
	//终极副本--状态
	a = o.DungeonUltimateStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2139);
			w[fm]();
		}
	};
	m = 2139;
	a[n] = m;
	
	a = o.DungeonUltimateStateRsp = class {
		decode(r) {
			this.maxStageId = r[r3]();
			this.enterNum = r[ry]();
			this.leftNum = r[ry]();
			this.clear = r[rb]();
			return this;
		}
	};
	m = 2139;
	a[n] = m;
	c[m] = a;
	
	//终极副本--进入战斗
	a = o.DungeonUltimateEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2140);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2140;
	a[n] = m;
	
	a = o.DungeonUltimateEnterRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.leftNum = r[ry]();
			return this;
		}
	};
	m = 2140;
	a[n] = m;
	c[m] = a;
	
	//终极副本--战斗结束
	a = o.DungeonUltimateExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2141);
			w[w3](this.stageId);
			w[wb](this.clear);
			w[fm]();
		}
	};
	m = 2141;
	a[n] = m;
	
	a = o.DungeonUltimateExitRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.clear = r[rb]();
			this.maxStageId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2141;
	a[n] = m;
	c[m] = a;
	
	//七天之战--状态
	a = o.DungeonSevenDayStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2142);
			w[fm]();
		}
	};
	m = 2142;
	a[n] = m;
	
	a = o.DungeonSevenDayStateRsp = class {
		decode(r) {
			this.stage = r[ry]();
			this.reward = r[ry]();
			this.buy = r[ry]();
			this.gift = r[ry]();
			return this;
		}
	};
	m = 2142;
	a[n] = m;
	c[m] = a;
	
	//七天之战--挑战
	a = o.DungeonSevenDayEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2143);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2143;
	a[n] = m;
	
	a = o.DungeonSevenDayEnterRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			return this;
		}
	};
	m = 2143;
	a[n] = m;
	c[m] = a;
	
	//七天之战--退出挑战
	a = o.DungeonSevenDayExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2144);
			w[w3](this.stageId);
			w[wb](this.clear);
			w[fm]();
		}
	};
	m = 2144;
	a[n] = m;
	
	a = o.DungeonSevenDayExitRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.clear = r[rb]();
			this.stage = r[ry]();
			return this;
		}
	};
	m = 2144;
	a[n] = m;
	c[m] = a;
	
	//七天之战--领取通关奖励
	a = o.DungeonSevenDayRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2145);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2145;
	a[n] = m;
	
	a = o.DungeonSevenDayRewardRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.reward = r[ry]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2145;
	a[n] = m;
	c[m] = a;
	
	//七天之战--领取礼包
	a = o.DungeonSevenDayGiftReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2146);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 2146;
	a[n] = m;
	
	a = o.DungeonSevenDayGiftRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.gift = r[ry]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2146;
	a[n] = m;
	c[m] = a;
	
	//抽卡--抽卡
	a = o.LuckyDrawReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2201);
			w[w3](this.type);
			w[fm]();
		}
	};
	m = 2201;
	a[n] = m;
	
	a = o.LuckyDrawRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2201;
	a[n] = m;
	c[m] = a;
	
	//抽卡--合卡
	a = o.LuckyComposeReq = class {
		constructor(d) {
			this.itemIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2202);
			w[wy](this.compType);
			w[w1](this.itemIds.length);
			for (var i = 0, len = this.itemIds.length; i < len; i++) {
				w[w3](this.itemIds[i]);   
			}
			w[fm]();
		}
	};
	m = 2202;
	a[n] = m;
	
	a = o.LuckyComposeRsp = class {
		decode(r) {
			this.compType = r[ry]();
			this.hero = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.hero[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2202;
	a[n] = m;
	c[m] = a;
	
	//抽卡--次数、积分
	a = o.LuckyNumberReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2203);
			w[fm]();
		}
	};
	m = 2203;
	a[n] = m;
	
	a = o.LuckyNumberRsp = class {
		decode(r) {
			this.numbers = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.numbers[i] = r[r3]();   
			}
			this.credit = r[r3]();
			return this;
		}
	};
	m = 2203;
	a[n] = m;
	c[m] = a;
	
	//抽卡积分--兑换
	a = o.LuckyCreditExchangeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2204);
			w[fm]();
		}
	};
	m = 2204;
	a[n] = m;
	
	a = o.LuckyCreditExchangeRsp = class {
		decode(r) {
			this.remain = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2204;
	a[n] = m;
	c[m] = a;
	
	//奇趣娃娃机--次数
	a = o.LuckyDrawSummonStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2205);
			w[fm]();
		}
	};
	m = 2205;
	a[n] = m;
	
	a = o.LuckyDrawSummonStateRsp = class {
		decode(r) {
			this.free = r[ry]();
			this.gems = r[ry]();
			this.optional = r[r3]();
			return this;
		}
	};
	m = 2205;
	a[n] = m;
	c[m] = a;
	
	//奇趣娃娃机--抽奖，广播协议使用SystemBroadcastRsp协议
	a = o.LuckyDrawSummonReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2206);
			w[wy](this.times);
			w[fm]();
		}
	};
	m = 2206;
	a[n] = m;
	
	a = o.LuckyDrawSummonRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2206;
	a[n] = m;
	c[m] = a;
	
	//奇趣娃娃机--自选池子
	a = o.LuckyDrawOptionalReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2207);
			w[w3](this.optional);
			w[fm]();
		}
	};
	m = 2207;
	a[n] = m;
	
	a = o.LuckyDrawOptionalRsp = class {
		decode(r) {
			this.optional = r[r3]();
			return this;
		}
	};
	m = 2207;
	a[n] = m;
	c[m] = a;
	
	//引导--已完成记录
	a = o.GuideGroupListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2301);
			w[fm]();
		}
	};
	m = 2301;
	a[n] = m;
	
	a = o.GuideGroupListRsp = class {
		decode(r) {
			this.taskId = r[r3]();
			this.guideList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.guideList[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 2301;
	a[n] = m;
	c[m] = a;
	
	//引导--记录引导组
	a = o.GuideGroupSaveReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2302);
			w[w3](this.groupId);
			w[fm]();
		}
	};
	m = 2302;
	a[n] = m;
	
	a = o.GuideGroupSaveRsp = class {
		decode(r) {
			this.groupId = r[r3]();
			return this;
		}
	};
	m = 2302;
	a[n] = m;
	c[m] = a;
	
	//引导--记录引导步骤
	a = o.GuideGroupStepReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2303);
			w[w3](this.groupId);
			w[w3](this.stepId);
			w[fm]();
		}
	};
	m = 2303;
	a[n] = m;
	
	a = o.GuideGroupStepRsp = class {
		decode(r) {
			this.groupId = r[r3]();
			this.stepId = r[r3]();
			return this;
		}
	};
	m = 2303;
	a[n] = m;
	c[m] = a;
	
	a = o.MonthCardInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.time);
			w[w3](this.paySum);
			w[wb](this.isRewarded);
		}
		decode(r) {
			this.id = r[r3]();
			this.time = r[r3]();
			this.paySum = r[r3]();
			this.isRewarded = r[rb]();
			return this;
		}
	};
	
	a = o.MonthCardDungeon = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.dungeonType);
			w[wb](this.isDungeoned);
			w[w3](this.dungeonTime);
		}
		decode(r) {
			this.id = r[r3]();
			this.dungeonType = r[r3]();
			this.isDungeoned = r[rb]();
			this.dungeonTime = r[r3]();
			return this;
		}
	};
	
	//月卡--列表
	a = o.MonthCardListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2401);
			w[fm]();
		}
	};
	m = 2401;
	a[n] = m;
	
	a = o.MonthCardListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.MonthCardInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2401;
	a[n] = m;
	c[m] = a;
	
	a = o.MonthCardUpdateRsp = class {
		decode(r) {
			this.info = new o.MonthCardInfo().decode(r);
			return this;
		}
	};
	m = 2402;
	a[n] = m;
	c[m] = a;
	
	//月卡--挂机信息（废弃）
	a = o.MonthCardDungeonInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2403);
			w[fm]();
		}
	};
	m = 2403;
	a[n] = m;
	
	a = o.MonthCardDungeonInfoRsp = class {
		decode(r) {
			this.info = new o.MonthCardDungeon().decode(r);
			return this;
		}
	};
	m = 2403;
	a[n] = m;
	c[m] = a;
	
	//月卡--挂机类型选择（废弃）
	a = o.MonthCardDungeonChooseReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2404);
			w[w3](this.dungeonType);
			w[fm]();
		}
	};
	m = 2404;
	a[n] = m;
	
	a = o.MonthCardDungeonChooseRsp = class {
		decode(r) {
			this.info = new o.MonthCardDungeon().decode(r);
			return this;
		}
	};
	m = 2404;
	a[n] = m;
	c[m] = a;
	
	//月卡--每天可领奖励
	a = o.MonthCardDayRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2405);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 2405;
	a[n] = m;
	
	a = o.MonthCardDayRewardRsp = class {
		decode(r) {
			this.info = new o.MonthCardInfo().decode(r);
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2405;
	a[n] = m;
	c[m] = a;
	
	//累充月卡--领取
	a = o.MonthCardPaySumVipRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2406);
			w[w3](this.cardId);
			w[fm]();
		}
	};
	m = 2406;
	a[n] = m;
	
	a = o.MonthCardPaySumVipRewardRsp = class {
		decode(r) {
			this.cardId = r[r3]();
			return this;
		}
	};
	m = 2406;
	a[n] = m;
	c[m] = a;
	
	//快速作战--查看已用次数
	a = o.MonthCardQuickCombatInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2407);
			w[fm]();
		}
	};
	m = 2407;
	a[n] = m;
	
	a = o.MonthCardQuickCombatInfoRsp = class {
		decode(r) {
			this.freeRemain = r[r3]();
			this.payRemain = r[r3]();
			this.payTimes = r[r3]();
			return this;
		}
	};
	m = 2407;
	a[n] = m;
	c[m] = a;
	
	//月卡--钻石购买
	a = o.MonthCardBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2408);
			w[w3](this.cardId);
			w[fm]();
		}
	};
	m = 2408;
	a[n] = m;
	
	a = o.MonthCardBuyRsp = class {
		decode(r) {
			this.cardId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2408;
	a[n] = m;
	c[m] = a;
	
	//礼包码--领奖
	a = o.GiftFetchReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2501);
			w[ws](this.code);
			w[fm]();
		}
	};
	m = 2501;
	a[n] = m;
	
	a = o.GiftFetchRsp = class {
		decode(r) {
			this.frozenTime = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2501;
	a[n] = m;
	c[m] = a;
	
	//反馈回复
	a = o.FeedbackReply = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.type);
			w[ws](this.content);
			w[w3](this.time);
		}
		decode(r) {
			this.type = r[ry]();
			this.content = r[rs]();
			this.time = r[r3]();
			return this;
		}
	};
	
	//反馈--信息（废弃）
	a = o.FeedbackInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2601);
			w[fm]();
		}
	};
	m = 2601;
	a[n] = m;
	
	a = o.FeedbackInfoRsp = class {
		decode(r) {
			this.topicId = r[r3]();
			this.reply = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.reply[i] = new o.FeedbackReply().decode(r);   
			}
			return this;
		}
	};
	m = 2601;
	a[n] = m;
	c[m] = a;
	
	//反馈--建议（废弃）
	a = o.FeedbackByRoleReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2602);
			w[ws](this.content);
			w[fm]();
		}
	};
	m = 2602;
	a[n] = m;
	
	a = o.FeedbackByRoleRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 2602;
	a[n] = m;
	c[m] = a;
	
	//gm回复反馈
	a = o.FeedbackGmReplyRsp = class {
		decode(r) {
			this.topicId = r[r3]();
			this.reply = new o.FeedbackReply().decode(r);
			return this;
		}
	};
	m = 2603;
	a[n] = m;
	c[m] = a;
	
	//充值--请求
	a = o.PayOrderReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2701);
			w[w3](this.paymentId);
			w[fm]();
		}
	};
	m = 2701;
	a[n] = m;
	
	a = o.PayOrderRsp = class {
		decode(r) {
			this.paymentId = r[r3]();
			this.money = r[r3]();
			this.reserved = r[rs]();
			this.orderId = r[rs]();
			this.sign = r[rs]();
			this.time = r[r3]();
			return this;
		}
	};
	m = 2701;
	a[n] = m;
	c[m] = a;
	
	//充值成功
	a = o.PaySuccRsp = class {
		decode(r) {
			this.paymentId = r[r3]();
			this.money = r[r3]();
			this.orderId = r[rs]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2702;
	a[n] = m;
	c[m] = a;
	
	a = o.PayFirstList = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.grade);
			w[w3](this.firstPayTime);
			w[wy](this.rewarded);
		}
		decode(r) {
			this.grade = r[r3]();
			this.firstPayTime = r[r3]();
			this.rewarded = r[ry]();
			return this;
		}
	};
	
	//充值--首充列表
	a = o.PayFirstListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2703);
			w[fm]();
		}
	};
	m = 2703;
	a[n] = m;
	
	a = o.PayFirstListRsp = class {
		decode(r) {
			this.paymentIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.paymentIds[i] = r[r3]();   
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.PayFirstList().decode(r);   
			}
			this.firstPaySum = r[r3]();
			this.paySumDay = r[r3]();
			this.paySum = r[r3]();
			return this;
		}
	};
	m = 2703;
	a[n] = m;
	c[m] = a;
	
	a = o.PayFirstUpdateRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.grade = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.grade[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 2704;
	a[n] = m;
	c[m] = a;
	
	//充值--首充奖励
	a = o.PayFirstRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2705);
			w[w3](this.grade);
			w[w3](this.index);
			w[fm]();
		}
	};
	m = 2705;
	a[n] = m;
	
	a = o.PayFirstRewardRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2705;
	a[n] = m;
	c[m] = a;
	
	//每日首充--充值信息
	a = o.PayDailyFirstInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2706);
			w[fm]();
		}
	};
	m = 2706;
	a[n] = m;
	
	a = o.PayDailyFirstInfoRsp = class {
		decode(r) {
			this.worldLevel = r[r3]();
			this.payedMoney = r[r3]();
			this.isRewarded = r[rb]();
			return this;
		}
	};
	m = 2706;
	a[n] = m;
	c[m] = a;
	
	//每日首充--领取礼包
	a = o.PayDailyFirstRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2707);
			w[fm]();
		}
	};
	m = 2707;
	a[n] = m;
	
	a = o.PayDailyFirstRewardRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2707;
	a[n] = m;
	c[m] = a;
	
	//跨服充值--排行榜
	a = o.PayCrossRankReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2708);
			w[fm]();
		}
	};
	m = 2708;
	a[n] = m;
	
	a = o.PayCrossRankRsp = class {
		decode(r) {
			this.mine = new o.RankBrief().decode(r);
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RankBrief().decode(r);   
			}
			return this;
		}
	};
	m = 2708;
	a[n] = m;
	c[m] = a;
	
	a = o.ActivityRankingRole = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w3](this.stageId);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.stageId = r[r3]();
			return this;
		}
	};
	
	//活动--冲榜信息
	a = o.ActivityRankingInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2801);
			w[fm]();
		}
	};
	m = 2801;
	a[n] = m;
	
	a = o.ActivityRankingInfoRsp = class {
		decode(r) {
			this.top3 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.top3[i] = new o.ActivityRankingRole().decode(r);   
			}
			this.history1 = r[r3]();
			this.history2 = r[r3]();
			this.percent3 = r[r3]();
			this.rewarded3 = r[rb]();
			this.percent7 = r[r3]();
			this.rewarded7 = r[rb]();
			return this;
		}
	};
	m = 2801;
	a[n] = m;
	c[m] = a;
	
	//活动--冲榜领奖
	a = o.ActivityRankingRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2802);
			w[wy](this.day);
			w[fm]();
		}
	};
	m = 2802;
	a[n] = m;
	
	a = o.ActivityRankingRewardRsp = class {
		decode(r) {
			this.day = r[ry]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2802;
	a[n] = m;
	c[m] = a;
	
	//活动--累计登陆列表
	a = o.ActivityCumloginListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2803);
			w[fm]();
		}
	};
	m = 2803;
	a[n] = m;
	
	a = o.ActivityCumloginListRsp = class {
		decode(r) {
			this.loginDays = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 2803;
	a[n] = m;
	c[m] = a;
	
	//活动--累计登陆奖励
	a = o.ActivityCumloginAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2804);
			w[w3](this.loginDays);
			w[fm]();
		}
	};
	m = 2804;
	a[n] = m;
	
	a = o.ActivityCumloginAwardRsp = class {
		decode(r) {
			this.index = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2804;
	a[n] = m;
	c[m] = a;
	
	//活动--每月累充列表
	a = o.ActivityTopUpListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2805);
			w[fm]();
		}
	};
	m = 2805;
	a[n] = m;
	
	a = o.ActivityTopUpListRsp = class {
		decode(r) {
			this.paySum = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 2805;
	a[n] = m;
	c[m] = a;
	
	//活动--每月累冲奖励
	a = o.ActivityTopUpAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2806);
			w[w3](this.paySum);
			w[fm]();
		}
	};
	m = 2806;
	a[n] = m;
	
	a = o.ActivityTopUpAwardRsp = class {
		decode(r) {
			this.index = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2806;
	a[n] = m;
	c[m] = a;
	
	//活动--幸运翻牌列表
	a = o.ActivityFlipCardsListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2807);
			w[fm]();
		}
	};
	m = 2807;
	a[n] = m;
	
	a = o.ActivityFlipCardsListRsp = class {
		decode(r) {
			this.flippedNum = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 2807;
	a[n] = m;
	c[m] = a;
	
	//活动--幸运翻牌奖励
	a = o.ActivityFlipCardsAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2808);
			w[w3](this.flippedNum);
			w[fm]();
		}
	};
	m = 2808;
	a[n] = m;
	
	a = o.ActivityFlipCardsAwardRsp = class {
		decode(r) {
			this.index = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2808;
	a[n] = m;
	c[m] = a;
	
	a = o.ActivityFlipGoods = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.index);
			this.goods.encode(w);
		}
		decode(r) {
			this.index = r[ry]();
			this.goods = new o.GoodsInfo().decode(r);
			return this;
		}
	};
	
	//幸运翻牌--幸运翻牌单张奖励
	a = o.ActivityLuckyFlipCardsAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2809);
			w[wy](this.index);
			w[fm]();
		}
	};
	m = 2809;
	a[n] = m;
	
	a = o.ActivityLuckyFlipCardsAwardRsp = class {
		decode(r) {
			this.flippedReward = new o.ActivityFlipGoods().decode(r);
			return this;
		}
	};
	m = 2809;
	a[n] = m;
	c[m] = a;
	
	//幸运翻牌--信息
	a = o.ActivityFlipCardsInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2810);
			w[fm]();
		}
	};
	m = 2810;
	a[n] = m;
	
	a = o.ActivityFlipCardsInfoRsp = class {
		decode(r) {
			this.flippedRewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.flippedRewards[i] = new o.ActivityFlipGoods().decode(r);   
			}
			return this;
		}
	};
	m = 2810;
	a[n] = m;
	c[m] = a;
	
	a = o.TwistEggGoods = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.rewardType);
			this.drop.encode(w);
		}
		decode(r) {
			this.rewardType = r[ry]();
			this.drop = new o.GoodsInfo().decode(r);
			return this;
		}
	};
	
	//活动--幸运扭蛋奖励
	a = o.ActivityTwistEggRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2811);
			w[w3](this.number);
			w[fm]();
		}
	};
	m = 2811;
	a[n] = m;
	
	a = o.ActivityTwistEggRewardRsp = class {
		decode(r) {
			this.reward = new o.TwistEggGoods().decode(r);
			this.rewardList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewardList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2811;
	a[n] = m;
	c[m] = a;
	
	//活动--幸运扭蛋信息
	a = o.ActivityTwistEggInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2812);
			w[fm]();
		}
	};
	m = 2812;
	a[n] = m;
	
	a = o.ActivityTwistEggInfoRsp = class {
		decode(r) {
			this.number = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.TwistEggGoods().decode(r);   
			}
			return this;
		}
	};
	m = 2812;
	a[n] = m;
	c[m] = a;
	
	//活动--点金已领取次数
	a = o.ActivityAlchemyTimesReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2813);
			w[fm]();
		}
	};
	m = 2813;
	a[n] = m;
	
	a = o.ActivityAlchemyTimesRsp = class {
		decode(r) {
			this.times = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.times[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 2813;
	a[n] = m;
	c[m] = a;
	
	//活动--点金领取奖励
	a = o.ActivityAlchemyFetchReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2814);
			w[wy](this.index);
			w[fm]();
		}
	};
	m = 2814;
	a[n] = m;
	
	a = o.ActivityAlchemyFetchRsp = class {
		decode(r) {
			this.times = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.times[i] = r[ry]();   
			}
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2814;
	a[n] = m;
	c[m] = a;
	
	//活动--剩余额外次数
	a = o.ActivityExtraRemainReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2815);
			w[fm]();
		}
	};
	m = 2815;
	a[n] = m;
	
	a = o.ActivityExtraRemainRsp = class {
		decode(r) {
			this.remainTimes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.remainTimes[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 2815;
	a[n] = m;
	c[m] = a;
	
	//活动--商店购买记录
	a = o.ActivityStoreBuyInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2816);
			w[w3](this.activityId);
			w[fm]();
		}
	};
	m = 2816;
	a[n] = m;
	
	a = o.ActivityStoreBuyInfoRsp = class {
		decode(r) {
			this.info = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.info[i] = new o.StoreBuyInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2816;
	a[n] = m;
	c[m] = a;
	
	//商店--购买
	a = o.ActivityStoreBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2817);
			w[w3](this.activityId);
			w[w3](this.itemId);
			w[w3](this.itemNum);
			w[fm]();
		}
	};
	m = 2817;
	a[n] = m;
	
	a = o.ActivityStoreBuyRsp = class {
		decode(r) {
			this.info = new o.StoreBuyInfo().decode(r);
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2817;
	a[n] = m;
	c[m] = a;
	
	//活动--限时充值列表
	a = o.ActivityNewTopUpListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2818);
			w[fm]();
		}
	};
	m = 2818;
	a[n] = m;
	
	a = o.ActivityNewTopUpListRsp = class {
		decode(r) {
			this.paySum = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 2818;
	a[n] = m;
	c[m] = a;
	
	//活动--限时充值奖励
	a = o.ActivityNewTopUpAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2819);
			w[w3](this.paySum);
			w[fm]();
		}
	};
	m = 2819;
	a[n] = m;
	
	a = o.ActivityNewTopUpAwardRsp = class {
		decode(r) {
			this.index = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2819;
	a[n] = m;
	c[m] = a;
	
	//活动--周末福利领奖
	a = o.ActivityWeekendGiftReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2820);
			w[fm]();
		}
	};
	m = 2820;
	a[n] = m;
	
	a = o.ActivityWeekendGiftRsp = class {
		decode(r) {
			this.record = r[ry]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2820;
	a[n] = m;
	c[m] = a;
	
	//活动--周末福利信息
	a = o.ActivityWeekendGiftInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2821);
			w[fm]();
		}
	};
	m = 2821;
	a[n] = m;
	
	a = o.ActivityWeekendGiftInfoRsp = class {
		decode(r) {
			this.record = r[ry]();
			return this;
		}
	};
	m = 2821;
	a[n] = m;
	c[m] = a;
	
	//活动--8天登陆信息
	a = o.ActivityLandGiftInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2822);
			w[fm]();
		}
	};
	m = 2822;
	a[n] = m;
	
	a = o.ActivityLandGiftInfoRsp = class {
		decode(r) {
			this.record = r[ry]();
			this.day = r[r3]();
			return this;
		}
	};
	m = 2822;
	a[n] = m;
	c[m] = a;
	
	//活动--8天登陆领奖
	a = o.ActivityLandGiftAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2823);
			w[fm]();
		}
	};
	m = 2823;
	a[n] = m;
	
	a = o.ActivityLandGiftAwardRsp = class {
		decode(r) {
			this.record = r[ry]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2823;
	a[n] = m;
	c[m] = a;
	
	a = o.ActivityGuardianDrawLimit = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.awardId);
			w[w3](this.limit);
		}
		decode(r) {
			this.awardId = r[r3]();
			this.limit = r[r3]();
			return this;
		}
	};
	
	//活动--守护者召唤有礼信息
	a = o.ActivityGuardianDrawInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2824);
			w[fm]();
		}
	};
	m = 2824;
	a[n] = m;
	
	a = o.ActivityGuardianDrawInfoRsp = class {
		decode(r) {
			this.rewarded = r[r3]();
			this.drawTimes = r[r3]();
			this.playerNum = r[r3]();
			this.limit = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.limit[i] = new o.ActivityGuardianDrawLimit().decode(r);   
			}
			return this;
		}
	};
	m = 2824;
	a[n] = m;
	c[m] = a;
	
	//活动--守护者召唤有礼领奖
	a = o.ActivityGuardianDrawAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2825);
			w[w3](this.awardId);
			w[fm]();
		}
	};
	m = 2825;
	a[n] = m;
	
	a = o.ActivityGuardianDrawAwardRsp = class {
		decode(r) {
			this.rewarded = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2825;
	a[n] = m;
	c[m] = a;
	
	//活动-矿洞大冒险结构
	a = o.ActivityCaveAdventure = class {
		constructor(d) {
			this.passedPlate = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.layer);
			w[w3](this.plate);
			w[w1](this.passedPlate.length);
			for (var i = 0, len = this.passedPlate.length; i < len; i++) {
				w[w3](this.passedPlate[i]);   
			}
			w[wb](this.rewardedBox);
		}
		decode(r) {
			this.layer = r[r3]();
			this.plate = r[r3]();
			this.passedPlate = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.passedPlate[i] = r[r3]();   
			}
			this.rewardedBox = r[rb]();
			return this;
		}
	};
	
	//活动--矿洞大冒险 活动信息
	a = o.ActivityCaveAdventureInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2826);
			w[fm]();
		}
	};
	m = 2826;
	a[n] = m;
	
	a = o.ActivityCaveAdventureInfoRsp = class {
		decode(r) {
			this.nowLayer = r[r3]();
			this.explore = r[r3]();
			this.key = r[r3]();
			this.layerList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.layerList[i] = new o.ActivityCaveAdventure().decode(r);   
			}
			return this;
		}
	};
	m = 2826;
	a[n] = m;
	c[m] = a;
	
	//活动--矿洞大冒险 走格子
	a = o.ActivityCaveAdventureMoveReq = class {
		constructor(d) {
			this.plateList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2827);
			w[w1](this.plateList.length);
			for (var i = 0, len = this.plateList.length; i < len; i++) {
				w[w3](this.plateList[i]);   
			}
			w[fm]();
		}
	};
	m = 2827;
	a[n] = m;
	
	a = o.ActivityCaveAdventureMoveRsp = class {
		decode(r) {
			this.newPlate = r[r3]();
			this.explore = r[r3]();
			this.key = r[r3]();
			this.awardList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.awardList[i] = new o.GoodsInfo().decode(r);   
			}
			this.passedPlate = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.passedPlate[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 2827;
	a[n] = m;
	c[m] = a;
	
	//活动--矿洞大冒险 领取宝箱
	a = o.ActivityCaveAdventureGainBoxReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2828);
			w[w3](this.layer);
			w[fm]();
		}
	};
	m = 2828;
	a[n] = m;
	
	a = o.ActivityCaveAdventureGainBoxRsp = class {
		decode(r) {
			this.goodsInfo = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsInfo[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2828;
	a[n] = m;
	c[m] = a;
	
	a = o.ActivityAwakeGift = class {
		constructor(d) {
			this.awardList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.totalStar);
			w[wb](this.isCharge);
			w[w3](this.nowDay);
			w[w1](this.awardList.length);
			for (var i = 0, len = this.awardList.length; i < len; i++) {
				w[w3](this.awardList[i]);   
			}
		}
		decode(r) {
			this.totalStar = r[r3]();
			this.isCharge = r[rb]();
			this.nowDay = r[r3]();
			this.awardList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.awardList[i] = r[r3]();   
			}
			return this;
		}
	};
	
	//活动--觉醒礼包 活动信息
	a = o.ActivityAwakeGiftInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2829);
			w[fm]();
		}
	};
	m = 2829;
	a[n] = m;
	
	a = o.ActivityAwakeGiftInfoRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.ActivityAwakeGift().decode(r);   
			}
			return this;
		}
	};
	m = 2829;
	a[n] = m;
	c[m] = a;
	
	//活动--觉醒礼包 设置英雄
	a = o.ActivityAwakeGiftSetReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2830);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 2830;
	a[n] = m;
	
	a = o.ActivityAwakeGiftSetRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			return this;
		}
	};
	m = 2830;
	a[n] = m;
	c[m] = a;
	
	//活动--觉醒礼包 领取奖励
	a = o.ActivityAwakeGiftGainReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2831);
			w[w3](this.totalStar);
			w[w3](this.day);
			w[fm]();
		}
	};
	m = 2831;
	a[n] = m;
	
	a = o.ActivityAwakeGiftGainRsp = class {
		decode(r) {
			this.goodsInfo = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsInfo[i] = new o.GoodsInfo().decode(r);   
			}
			this.info = new o.ActivityAwakeGift().decode(r);
			return this;
		}
	};
	m = 2831;
	a[n] = m;
	c[m] = a;
	
	a = o.ActivityDiscount = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[wy](this.times);
			w[w3](this.discount);
			w[wb](this.bought);
			w[wy](this.payId);
			w[wy](this.over);
		}
		decode(r) {
			this.id = r[r3]();
			this.times = r[ry]();
			this.discount = r[r3]();
			this.bought = r[rb]();
			this.payId = r[ry]();
			this.over = r[ry]();
			return this;
		}
	};
	
	//砍价大礼包--状态
	a = o.ActivityDiscountStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2832);
			w[fm]();
		}
	};
	m = 2832;
	a[n] = m;
	
	a = o.ActivityDiscountStateRsp = class {
		decode(r) {
			this.gifts = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.gifts[i] = new o.ActivityDiscount().decode(r);   
			}
			return this;
		}
	};
	m = 2832;
	a[n] = m;
	c[m] = a;
	
	//砍价大礼包--砍价
	a = o.ActivityDiscountReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2833);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 2833;
	a[n] = m;
	
	a = o.ActivityDiscountRsp = class {
		decode(r) {
			this.discount = r[r3]();
			this.gift = new o.ActivityDiscount().decode(r);
			return this;
		}
	};
	m = 2833;
	a[n] = m;
	c[m] = a;
	
	//砍价大礼包--购买
	a = o.ActivityDiscountBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2834);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 2834;
	a[n] = m;
	
	a = o.ActivityDiscountBuyRsp = class {
		decode(r) {
			this.goods = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goods[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2834;
	a[n] = m;
	c[m] = a;
	
	//活动--灵力者集结 查看信息
	a = o.ActivityAssembledInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2835);
			w[fm]();
		}
	};
	m = 2835;
	a[n] = m;
	
	a = o.ActivityAssembledInfoRsp = class {
		decode(r) {
			this.state = r[r3]();
			return this;
		}
	};
	m = 2835;
	a[n] = m;
	c[m] = a;
	
	//活动-灵力者集结 返回奖励
	a = o.ActivityAssembledGainRsp = class {
		decode(r) {
			this.goodsInfo = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsInfo[i] = new o.GoodsInfo().decode(r);   
			}
			this.state = r[r3]();
			return this;
		}
	};
	m = 2836;
	a[n] = m;
	c[m] = a;
	
	//远航寻宝-状态
	a = o.ActivitySailingInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2837);
			w[fm]();
		}
	};
	m = 2837;
	a[n] = m;
	
	a = o.ActivitySailingInfoRsp = class {
		decode(r) {
			this.money = r[r3]();
			this.mapRewarded = r[r3]();
			this.chargeRewarded = r[r3]();
			this.freeRewarded = r[rb]();
			return this;
		}
	};
	m = 2837;
	a[n] = m;
	c[m] = a;
	
	//远航寻宝-累充奖励
	a = o.ActivitySailingChargeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2838);
			w[w3](this.money);
			w[fm]();
		}
	};
	m = 2838;
	a[n] = m;
	
	a = o.ActivitySailingChargeRsp = class {
		decode(r) {
			this.chargeRewarded = r[r3]();
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2838;
	a[n] = m;
	c[m] = a;
	
	//远航寻宝-每日免费奖励
	a = o.ActivitySailingFreeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2839);
			w[fm]();
		}
	};
	m = 2839;
	a[n] = m;
	
	a = o.ActivitySailingFreeRsp = class {
		decode(r) {
			this.freeRewarded = r[rb]();
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2839;
	a[n] = m;
	c[m] = a;
	
	//远航寻宝-地图奖励
	a = o.ActivitySailingMapRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2840);
			w[w3](this.type);
			w[w3](this.plateId);
			w[fm]();
		}
	};
	m = 2840;
	a[n] = m;
	
	a = o.ActivitySailingMapRewardRsp = class {
		decode(r) {
			this.type = r[r3]();
			this.plateId = r[r3]();
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2840;
	a[n] = m;
	c[m] = a;
	
	//宝藏旅馆-层
	a = o.ActivityHotelLayer = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.layer);
			w[wy](this.num);
		}
		decode(r) {
			this.layer = r[ry]();
			this.num = r[ry]();
			return this;
		}
	};
	
	//宝藏旅馆-状态
	a = o.ActivityHotelStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2841);
			w[fm]();
		}
	};
	m = 2841;
	a[n] = m;
	
	a = o.ActivityHotelStateRsp = class {
		decode(r) {
			this.cleanNum = r[r3]();
			this.freeFlag = r[rb]();
			this.layers = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.layers[i] = new o.ActivityHotelLayer().decode(r);   
			}
			return this;
		}
	};
	m = 2841;
	a[n] = m;
	c[m] = a;
	
	//宝藏旅馆-打扫
	a = o.ActivityHotelCleanReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2842);
			w[fm]();
		}
	};
	m = 2842;
	a[n] = m;
	
	a = o.ActivityHotelCleanRsp = class {
		decode(r) {
			this.cleanNum = r[r3]();
			this.clean = new o.ActivityHotelLayer().decode(r);
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2842;
	a[n] = m;
	c[m] = a;
	
	//宝藏旅馆-每日免费奖励
	a = o.ActivityHotelFreeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2843);
			w[fm]();
		}
	};
	m = 2843;
	a[n] = m;
	
	a = o.ActivityHotelFreeRsp = class {
		decode(r) {
			this.freeFlag = r[rb]();
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2843;
	a[n] = m;
	c[m] = a;
	
	a = o.ActivityTimeGift = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.giftId);
			w[wy](this.state);
			w[w3](this.endTime);
		}
		decode(r) {
			this.giftId = r[r3]();
			this.state = r[ry]();
			this.endTime = r[r3]();
			return this;
		}
	};
	
	//活动--限时礼包 查看信息
	a = o.ActivityTimeGiftInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2844);
			w[fm]();
		}
	};
	m = 2844;
	a[n] = m;
	
	a = o.ActivityTimeGiftInfoRsp = class {
		decode(r) {
			this.info = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.info[i] = new o.ActivityTimeGift().decode(r);   
			}
			return this;
		}
	};
	m = 2844;
	a[n] = m;
	c[m] = a;
	
	//活动-限时礼包 领取奖励
	a = o.ActivityTimeGiftGainReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2845);
			w[w3](this.giftId);
			w[fm]();
		}
	};
	m = 2845;
	a[n] = m;
	
	//活动-限时礼包 领取奖励
	a = o.ActivityTimeGiftGainRsp = class {
		decode(r) {
			this.goodsInfo = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsInfo[i] = new o.GoodsInfo().decode(r);   
			}
			this.state = r[ry]();
			return this;
		}
	};
	m = 2845;
	a[n] = m;
	c[m] = a;
	
	//活动--神秘来客 查看信息
	a = o.ActivityMysteriousInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2846);
			w[fm]();
		}
	};
	m = 2846;
	a[n] = m;
	
	a = o.ActivityMysteriousInfoRsp = class {
		decode(r) {
			this.total = r[r3]();
			this.state = r[r3]();
			return this;
		}
	};
	m = 2846;
	a[n] = m;
	c[m] = a;
	
	//活动-神秘来客 领取奖励
	a = o.ActivityMysteriousGainReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2847);
			w[w3](this.index);
			w[fm]();
		}
	};
	m = 2847;
	a[n] = m;
	
	a = o.ActivityMysteriousGainRsp = class {
		decode(r) {
			this.goodsInfo = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsInfo[i] = new o.GoodsInfo().decode(r);   
			}
			this.state = r[r3]();
			return this;
		}
	};
	m = 2847;
	a[n] = m;
	c[m] = a;
	
	//活动--超值购 活动信息
	a = o.ActivitySuperValueActInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[wb](this.isComplete);
		}
		decode(r) {
			this.id = r[r3]();
			this.isComplete = r[rb]();
			return this;
		}
	};
	
	//活动--超值购 天数信息
	a = o.ActivitySuperValueDayInfo = class {
		constructor(d) {
			this.info = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.day);
			w[wb](this.isGain);
			w[w1](this.info.length);
			for (var i = 0, len = this.info.length; i < len; i++) {
				this.info[i].encode(w);   
			}
		}
		decode(r) {
			this.day = r[r3]();
			this.isGain = r[rb]();
			this.info = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.info[i] = new o.ActivitySuperValueActInfo().decode(r);   
			}
			return this;
		}
	};
	
	//活动--超值购 查看信息
	a = o.ActivitySuperValueInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2848);
			w[fm]();
		}
	};
	m = 2848;
	a[n] = m;
	
	a = o.ActivitySuperValueInfoRsp = class {
		decode(r) {
			this.infos = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.infos[i] = new o.ActivitySuperValueDayInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2848;
	a[n] = m;
	c[m] = a;
	
	//活动--超值购 领取奖励
	a = o.ActivitySuperValueGainReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2849);
			w[w3](this.day);
			w[fm]();
		}
	};
	m = 2849;
	a[n] = m;
	
	a = o.ActivitySuperValueGainRsp = class {
		decode(r) {
			this.goodsInfo = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsInfo[i] = new o.GoodsInfo().decode(r);   
			}
			this.info = new o.ActivitySuperValueDayInfo().decode(r);
			return this;
		}
	};
	m = 2849;
	a[n] = m;
	c[m] = a;
	
	//活动--超值购 提醒
	a = o.ActivitySuperValueNoticeRsp = class {
		decode(r) {
			this.info = new o.ActivitySuperValueDayInfo().decode(r);
			return this;
		}
	};
	m = 2850;
	a[n] = m;
	c[m] = a;
	
	//公会信息
	a = o.GuildBrief = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.id);
			w[ws](this.name);
			w[w3](this.level);
			w[w3](this.icon);
			w[w3](this.frame);
			w[w3](this.bottom);
		}
		decode(r) {
			this.id = r[r6]();
			this.name = r[rs]();
			this.level = r[r3]();
			this.icon = r[r3]();
			this.frame = r[r3]();
			this.bottom = r[r3]();
			return this;
		}
	};
	
	//公会信息
	a = o.GuildInfo = class {
		constructor(d) {
			this.presidents = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.id);
			w[ws](this.name);
			w[w3](this.level);
			w[w3](this.icon);
			w[w3](this.frame);
			w[w3](this.bottom);
			w[wy](this.num);
			w[w3](this.maxPower);
			w[ws](this.president);
			w[w1](this.presidents.length);
			for (var i = 0, len = this.presidents.length; i < len; i++) {
				w[w6](this.presidents[i]);   
			}
		}
		decode(r) {
			this.id = r[r6]();
			this.name = r[rs]();
			this.level = r[r3]();
			this.icon = r[r3]();
			this.frame = r[r3]();
			this.bottom = r[r3]();
			this.num = r[ry]();
			this.maxPower = r[r3]();
			this.president = r[rs]();
			this.presidents = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.presidents[i] = r[r6]();   
			}
			return this;
		}
	};
	
	//公会成员
	a = o.GuildMember = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.id);
			w[ws](this.name);
			w[w3](this.head);
			w[w3](this.frame);
			w[w3](this.title0);
			w[w3](this.level);
			w[w3](this.power);
			w[w3](this.logoutTime);
			w[w3](this.vipExp);
			w[w3](this.footholdNum);
			w[wy](this.signFlag);
			w[wy](this.bossNum);
			w[wy](this.title);
		}
		decode(r) {
			this.id = r[r6]();
			this.name = r[rs]();
			this.head = r[r3]();
			this.frame = r[r3]();
			this.title0 = r[r3]();
			this.level = r[r3]();
			this.power = r[r3]();
			this.logoutTime = r[r3]();
			this.vipExp = r[r3]();
			this.footholdNum = r[r3]();
			this.signFlag = r[ry]();
			this.bossNum = r[ry]();
			this.title = r[ry]();
			return this;
		}
	};
	
	a = o.GuildCamper = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.pos);
			w[ws](this.name);
		}
		decode(r) {
			this.pos = r[ry]();
			this.name = r[rs]();
			return this;
		}
	};
	
	a = o.GuildCamp = class {
		constructor(d) {
			this.campers = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			this.guild.encode(w);
			w[w1](this.campers.length);
			for (var i = 0, len = this.campers.length; i < len; i++) {
				this.campers[i].encode(w);   
			}
			this.sthWar.encode(w);
		}
		decode(r) {
			this.guild = new o.GuildInfo().decode(r);
			this.campers = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.campers[i] = new o.GuildCamper().decode(r);   
			}
			this.sthWar = new o.GuildSthWar().decode(r);
			return this;
		}
	};
	
	//公会--公会列表
	a = o.GuildListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2901);
			w[wb](this.all);
			w[fm]();
		}
	};
	m = 2901;
	a[n] = m;
	
	a = o.GuildListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GuildInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2901;
	a[n] = m;
	c[m] = a;
	
	//公会--公会详情
	a = o.GuildDetailReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2902);
			w[w6](this.guildId);
			w[fm]();
		}
	};
	m = 2902;
	a[n] = m;
	
	a = o.GuildDetailRsp = class {
		decode(r) {
			this.info = new o.GuildInfo().decode(r);
			this.exp = r[r3]();
			this.signNum = r[ry]();
			this.autoJoin = r[rb]();
			this.minLevel = r[r3]();
			this.notice = r[rs]();
			this.presidents = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.presidents[i] = r[r6]();   
			}
			this.members = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.members[i] = new o.GuildMember().decode(r);   
			}
			this.recruitNum = r[r3]();
			return this;
		}
	};
	m = 2902;
	a[n] = m;
	c[m] = a;
	
	//公会--搜索公会
	a = o.GuildQueryReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2903);
			w[ws](this.name);
			w[fm]();
		}
	};
	m = 2903;
	a[n] = m;
	
	a = o.GuildQueryRsp = class {
		decode(r) {
			this.info = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.info[i] = new o.GuildInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2903;
	a[n] = m;
	c[m] = a;
	
	//公会--营地信息（主界面）
	a = o.GuildCampReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2904);
			w[fm]();
		}
	};
	m = 2904;
	a[n] = m;
	
	a = o.GuildCampRsp = class {
		decode(r) {
			this.camp = new o.GuildCamp().decode(r);
			return this;
		}
	};
	m = 2904;
	a[n] = m;
	c[m] = a;
	
	//公会--创建公会
	a = o.GuildCreateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2905);
			w[ws](this.name);
			w[w3](this.icon);
			w[w3](this.frame);
			w[w3](this.bottom);
			w[wy](this.costIndex);
			w[fm]();
		}
	};
	m = 2905;
	a[n] = m;
	
	a = o.GuildCreateRsp = class {
		decode(r) {
			this.camp = new o.GuildCamp().decode(r);
			return this;
		}
	};
	m = 2905;
	a[n] = m;
	c[m] = a;
	
	//公会--申请加入
	a = o.GuildJoinReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2906);
			w[w6](this.guildId);
			w[fm]();
		}
	};
	m = 2906;
	a[n] = m;
	
	a = o.GuildJoinRsp = class {
		decode(r) {
			this.guildId = r[r6]();
			this.error = r[r1]();
			this.minLv = r[r3]();
			if (r[rb]()) {
				this.camp = new o.GuildCamp().decode(r);
			}
			return this;
		}
	};
	m = 2906;
	a[n] = m;
	c[m] = a;
	
	//公会--查看申请
	a = o.GuildRequestsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2907);
			w[fm]();
		}
	};
	m = 2907;
	a[n] = m;
	
	a = o.GuildRequestsRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GuildMember().decode(r);   
			}
			return this;
		}
	};
	m = 2907;
	a[n] = m;
	c[m] = a;
	
	//公会--会长审批
	a = o.GuildCheckReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2908);
			w[w6](this.playerId);
			w[wb](this.ok);
			w[fm]();
		}
	};
	m = 2908;
	a[n] = m;
	
	a = o.GuildCheckRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			this.ok = r[rb]();
			return this;
		}
	};
	m = 2908;
	a[n] = m;
	c[m] = a;
	
	//公会--退出公会
	a = o.GuildQuitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2909);
			w[fm]();
		}
	};
	m = 2909;
	a[n] = m;
	
	a = o.GuildQuitRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 2909;
	a[n] = m;
	c[m] = a;
	
	//公会--踢出公会
	a = o.GuildKickReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2910);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 2910;
	a[n] = m;
	
	a = o.GuildKickRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			return this;
		}
	};
	m = 2910;
	a[n] = m;
	c[m] = a;
	
	a = o.GuildUpdateRsp = class {
		decode(r) {
			this.guildId = r[r6]();
			return this;
		}
	};
	m = 2911;
	a[n] = m;
	c[m] = a;
	
	//公会--设置公会审批
	a = o.GuildSetCheckReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2912);
			w[w3](this.minLevel);
			w[wb](this.autoJoin);
			w[fm]();
		}
	};
	m = 2912;
	a[n] = m;
	
	a = o.GuildSetCheckRsp = class {
		decode(r) {
			this.minLevel = r[r3]();
			this.autoJoin = r[rb]();
			return this;
		}
	};
	m = 2912;
	a[n] = m;
	c[m] = a;
	
	//公会--设置公会图标
	a = o.GuildSetIconReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2913);
			w[w3](this.icon);
			w[w3](this.frame);
			w[w3](this.bottom);
			w[fm]();
		}
	};
	m = 2913;
	a[n] = m;
	
	a = o.GuildSetIconRsp = class {
		decode(r) {
			this.icon = r[r3]();
			this.frame = r[r3]();
			this.bottom = r[r3]();
			return this;
		}
	};
	m = 2913;
	a[n] = m;
	c[m] = a;
	
	//公会--设置公会名称
	a = o.GuildSetNameReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2914);
			w[ws](this.name);
			w[fm]();
		}
	};
	m = 2914;
	a[n] = m;
	
	a = o.GuildSetNameRsp = class {
		decode(r) {
			this.name = r[rs]();
			return this;
		}
	};
	m = 2914;
	a[n] = m;
	c[m] = a;
	
	//公会--设置公会公告
	a = o.GuildSetNoticeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2915);
			w[ws](this.notice);
			w[fm]();
		}
	};
	m = 2915;
	a[n] = m;
	
	a = o.GuildSetNoticeRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 2915;
	a[n] = m;
	c[m] = a;
	
	//公会--设置成员职位
	a = o.GuildSetTitleReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2916);
			w[w6](this.playerId);
			w[wy](this.title);
			w[fm]();
		}
	};
	m = 2916;
	a[n] = m;
	
	a = o.GuildSetTitleRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			this.title = r[ry]();
			return this;
		}
	};
	m = 2916;
	a[n] = m;
	c[m] = a;
	
	//公会--设置营地位置
	a = o.GuildSetCampReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2917);
			w[wy](this.pos);
			w[fm]();
		}
	};
	m = 2917;
	a[n] = m;
	
	a = o.GuildSetCampRsp = class {
		decode(r) {
			this.pos = r[ry]();
			this.name = r[rs]();
			return this;
		}
	};
	m = 2917;
	a[n] = m;
	c[m] = a;
	
	//公会--签到界面
	a = o.GuildSignInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2918);
			w[fm]();
		}
	};
	m = 2918;
	a[n] = m;
	
	a = o.GuildSignInfoRsp = class {
		decode(r) {
			this.flag = r[ry]();
			this.total = r[ry]();
			this.sthWarStarted = r[rb]();
			this.sthWarFnumber = r[ry]();
			return this;
		}
	};
	m = 2918;
	a[n] = m;
	c[m] = a;
	
	//公会--签到
	a = o.GuildSignReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2919);
			w[fm]();
		}
	};
	m = 2919;
	a[n] = m;
	
	a = o.GuildSignRsp = class {
		decode(r) {
			this.exp = r[r3]();
			this.level = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2919;
	a[n] = m;
	c[m] = a;
	
	//公会--领取签到宝箱
	a = o.GuildSignBoxReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2920);
			w[wy](this.index);
			w[fm]();
		}
	};
	m = 2920;
	a[n] = m;
	
	a = o.GuildSignBoxRsp = class {
		decode(r) {
			this.flag = r[ry]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2920;
	a[n] = m;
	c[m] = a;
	
	//公会--据点战（废弃）
	a = o.GuildSthWar = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wb](this.started);
			w[w3](this.mapId);
			w[w3](this.endTime);
			w[wy](this.maxDfc);
			w[w3](this.rndSeed);
		}
		decode(r) {
			this.started = r[rb]();
			this.mapId = r[r3]();
			this.endTime = r[r3]();
			this.maxDfc = r[ry]();
			this.rndSeed = r[r3]();
			return this;
		}
	};
	
	a = o.GuildSthPoint = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.x);
			w[wy](this.y);
			w[w6](this.playerId);
			w[w3](this.occupyTime);
		}
		decode(r) {
			this.x = r[ry]();
			this.y = r[ry]();
			this.playerId = r[r6]();
			this.occupyTime = r[r3]();
			return this;
		}
	};
	
	//公会--据点战开始（废弃）
	a = o.GuildSthWarStartReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2921);
			w[wy](this.difficulty);
			w[fm]();
		}
	};
	m = 2921;
	a[n] = m;
	
	a = o.GuildSthWarStartRsp = class {
		decode(r) {
			this.sthWar = new o.GuildSthWar().decode(r);
			return this;
		}
	};
	m = 2921;
	a[n] = m;
	c[m] = a;
	
	//公会--据点战详情（废弃）
	a = o.GuildSthWarDetailReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2922);
			w[fm]();
		}
	};
	m = 2922;
	a[n] = m;
	
	a = o.GuildSthWarDetailRsp = class {
		decode(r) {
			this.chance = r[ry]();
			this.mapId = r[r3]();
			this.points = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.points[i] = new o.GuildSthPoint().decode(r);   
			}
			return this;
		}
	};
	m = 2922;
	a[n] = m;
	c[m] = a;
	
	//公会--据点战战斗（废弃）
	a = o.GuildSthWarFightReq = class {
		constructor(d) {
			this.heroes = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2923);
			w[wy](this.x);
			w[wy](this.y);
			w[wy](this.status);
			w[w1](this.heroes.length);
			for (var i = 0, len = this.heroes.length; i < len; i++) {
				w[w3](this.heroes[i]);   
			}
			w[fm]();
		}
	};
	m = 2923;
	a[n] = m;
	
	a = o.GuildSthWarFightRsp = class {
		decode(r) {
			this.x = r[ry]();
			this.y = r[ry]();
			this.stauts = r[ry]();
			this.playerId = r[r6]();
			return this;
		}
	};
	m = 2923;
	a[n] = m;
	c[m] = a;
	
	//公会--获取自己职位
	a = o.GuildSelfTitleReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2924);
			w[fm]();
		}
	};
	m = 2924;
	a[n] = m;
	
	a = o.GuildSelfTitleRsp = class {
		decode(r) {
			this.guildName = r[rs]();
			this.title = r[ry]();
			return this;
		}
	};
	m = 2924;
	a[n] = m;
	c[m] = a;
	
	//公会--邀请玩家加入公会
	a = o.GuildInviteReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2925);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 2925;
	a[n] = m;
	
	a = o.GuildInviteRsp = class {
		decode(r) {
			this.isInvite = r[rb]();
			return this;
		}
	};
	m = 2925;
	a[n] = m;
	c[m] = a;
	
	//工会--接受邀请
	a = o.GuildAcceptInviteReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2926);
			w[wb](this.isAccept);
			w[w6](this.guildId);
			w[w6](this.inviterId);
			w[fm]();
		}
	};
	m = 2926;
	a[n] = m;
	
	a = o.GuildAcceptInviteRsp = class {
		decode(r) {
			this.guildId = r[r6]();
			this.isSuccess = r[rb]();
			return this;
		}
	};
	m = 2926;
	a[n] = m;
	c[m] = a;
	
	a = o.GuildInvitation = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[ws](this.playerName);
			w[w3](this.playerLv);
			w[w3](this.playerHead);
			w[w3](this.playerFrame);
			w[w3](this.playerVipExp);
			w[w6](this.guildId);
			w[ws](this.guildName);
			w[w3](this.guildIcon);
			w[wy](this.postion);
			w[w3](this.guildFrame);
			w[w3](this.guildBottom);
		}
		decode(r) {
			this.playerId = r[r6]();
			this.playerName = r[rs]();
			this.playerLv = r[r3]();
			this.playerHead = r[r3]();
			this.playerFrame = r[r3]();
			this.playerVipExp = r[r3]();
			this.guildId = r[r6]();
			this.guildName = r[rs]();
			this.guildIcon = r[r3]();
			this.postion = r[ry]();
			this.guildFrame = r[r3]();
			this.guildBottom = r[r3]();
			return this;
		}
	};
	
	//工会--邀请信息
	a = o.GuildInviteInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2927);
			w[fm]();
		}
	};
	m = 2927;
	a[n] = m;
	
	a = o.GuildInviteInfoRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GuildInvitation().decode(r);   
			}
			return this;
		}
	};
	m = 2927;
	a[n] = m;
	c[m] = a;
	
	//公会--任务列表
	a = o.GuildMissionListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2928);
			w[fm]();
		}
	};
	m = 2928;
	a[n] = m;
	
	a = o.GuildMissionListRsp = class {
		decode(r) {
			this.progressList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.progressList[i] = new o.MissionProgress().decode(r);   
			}
			this.missionRewarded = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.missionRewarded[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 2928;
	a[n] = m;
	c[m] = a;
	
	//公会--任务更新
	a = o.GuildMissionUpdateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2929);
			w[fm]();
		}
	};
	m = 2929;
	a[n] = m;
	
	a = o.GuildMissionUpdateRsp = class {
		decode(r) {
			this.progress = new o.MissionProgress().decode(r);
			return this;
		}
	};
	m = 2929;
	a[n] = m;
	c[m] = a;
	
	//公会--任务领奖
	a = o.GuildMissionRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2930);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 2930;
	a[n] = m;
	
	a = o.GuildMissionRewardRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2930;
	a[n] = m;
	c[m] = a;
	
	a = o.GuildDropGoods = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.goods.encode(w);
			w[w3](this.count);
		}
		decode(r) {
			this.goods = new o.GoodsInfo().decode(r);
			this.count = r[r3]();
			return this;
		}
	};
	
	a = o.GuildDropRecord = class {
		constructor(d) {
			this.goods = [];
			this.lastGoods = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[ws](this.playerName);
			w[w3](this.footholdNum);
			w[w3](this.allotedNum);
			w[w1](this.goods.length);
			for (var i = 0, len = this.goods.length; i < len; i++) {
				this.goods[i].encode(w);   
			}
			w[w1](this.lastGoods.length);
			for (var i = 0, len = this.lastGoods.length; i < len; i++) {
				this.lastGoods[i].encode(w);   
			}
		}
		decode(r) {
			this.playerId = r[r6]();
			this.playerName = r[rs]();
			this.footholdNum = r[r3]();
			this.allotedNum = r[r3]();
			this.goods = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goods[i] = new o.GoodsInfo().decode(r);   
			}
			this.lastGoods = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.lastGoods[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	
	//公会--掉落状态（会长）
	a = o.GuildDropStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2931);
			w[fm]();
		}
	};
	m = 2931;
	a[n] = m;
	
	a = o.GuildDropStateRsp = class {
		decode(r) {
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GuildDropGoods().decode(r);   
			}
			this.recordList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.recordList[i] = new o.GuildDropRecord().decode(r);   
			}
			return this;
		}
	};
	m = 2931;
	a[n] = m;
	c[m] = a;
	
	a = o.GuildDropAllotItem = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.itemType);
			w[w3](this.itemNum);
			w[w3](this.subNum);
		}
		decode(r) {
			this.itemType = r[r3]();
			this.itemNum = r[r3]();
			this.subNum = r[r3]();
			return this;
		}
	};
	
	a = o.GuildDropAllotOp = class {
		constructor(d) {
			this.items = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.targetId);
			w[w1](this.items.length);
			for (var i = 0, len = this.items.length; i < len; i++) {
				this.items[i].encode(w);   
			}
		}
		decode(r) {
			this.targetId = r[r6]();
			this.items = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.items[i] = new o.GuildDropAllotItem().decode(r);   
			}
			return this;
		}
	};
	
	//公会--掉落分配（会长）
	a = o.GuildDropAllotReq = class {
		constructor(d) {
			this.operations = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2932);
			w[w1](this.operations.length);
			for (var i = 0, len = this.operations.length; i < len; i++) {
				this.operations[i].encode(w);   
			}
			w[fm]();
		}
	};
	m = 2932;
	a[n] = m;
	
	a = o.GuildDropAllotRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 2932;
	a[n] = m;
	c[m] = a;
	
	//公会--掉落查看（会员）
	a = o.GuildDropStoredReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2933);
			w[fm]();
		}
	};
	m = 2933;
	a[n] = m;
	
	a = o.GuildDropStoredRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2933;
	a[n] = m;
	c[m] = a;
	
	//公会--掉落领取（会员）
	a = o.GuildDropFetchReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2934);
			w[fm]();
		}
	};
	m = 2934;
	a[n] = m;
	
	a = o.GuildDropFetchRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 2934;
	a[n] = m;
	c[m] = a;
	
	//公会--招募
	a = o.GuildRecruitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2935);
			w[fm]();
		}
	};
	m = 2935;
	a[n] = m;
	
	a = o.GuildRecruitRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 2935;
	a[n] = m;
	c[m] = a;
	
	//公会邮件--获取次数
	a = o.GuildMailTimesReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2936);
			w[fm]();
		}
	};
	m = 2936;
	a[n] = m;
	
	a = o.GuildMailTimesRsp = class {
		decode(r) {
			this.times = r[ry]();
			return this;
		}
	};
	m = 2936;
	a[n] = m;
	c[m] = a;
	
	//公会邮件--发送
	a = o.GuildMailSendReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2937);
			w[ws](this.content);
			w[fm]();
		}
	};
	m = 2937;
	a[n] = m;
	
	a = o.GuildMailSendRsp = class {
		decode(r) {
			this.times = r[ry]();
			return this;
		}
	};
	m = 2937;
	a[n] = m;
	c[m] = a;
	
	//公会--申请通知
	a = o.GuildReqNoticeRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 2938;
	a[n] = m;
	c[m] = a;
	
	a = o.GuildLog = class {
		constructor(d) {
			this.args = [];
			this.goodsList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.time);
			w[wy](this.type);
			w[w1](this.args.length);
			for (var i = 0, len = this.args.length; i < len; i++) {
				w[ws](this.args[i]);   
			}
			w[w1](this.goodsList.length);
			for (var i = 0, len = this.goodsList.length; i < len; i++) {
				this.goodsList[i].encode(w);   
			}
		}
		decode(r) {
			this.time = r[r3]();
			this.type = r[ry]();
			this.args = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.args[i] = r[rs]();   
			}
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	
	//公会日志--列表
	a = o.GuildLogListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2939);
			w[fm]();
		}
	};
	m = 2939;
	a[n] = m;
	
	a = o.GuildLogListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GuildLog().decode(r);   
			}
			return this;
		}
	};
	m = 2939;
	a[n] = m;
	c[m] = a;
	
	//公会日志--一键提醒
	a = o.GuildRemindReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2940);
			w[wy](this.type);
			w[fm]();
		}
	};
	m = 2940;
	a[n] = m;
	
	a = o.GuildRemindRsp = class {
		decode(r) {
			this.type = r[ry]();
			this.time = r[r3]();
			return this;
		}
	};
	m = 2940;
	a[n] = m;
	c[m] = a;
	
	a = o.GuildAccelerateState = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[w3](this.baseId);
			w[w3](this.lv);
			w[w3](this.accelerateTimes);
			w[wb](this.hasAccelerated);
			w[wb](this.isCompleted);
		}
		decode(r) {
			this.playerId = r[r6]();
			this.baseId = r[r3]();
			this.lv = r[r3]();
			this.accelerateTimes = r[r3]();
			this.hasAccelerated = r[rb]();
			this.isCompleted = r[rb]();
			return this;
		}
	};
	
	//公会建筑加速--请求列表
	a = o.GuildAccelerateListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2941);
			w[fm]();
		}
	};
	m = 2941;
	a[n] = m;
	
	a = o.GuildAccelerateListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GuildAccelerateState().decode(r);   
			}
			return this;
		}
	};
	m = 2941;
	a[n] = m;
	c[m] = a;
	
	//公会建筑加速--加速全部
	a = o.GuildAccelerateAllReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](2942);
			w[fm]();
		}
	};
	m = 2942;
	a[n] = m;
	
	a = o.GuildAccelerateAllRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GuildAccelerateState().decode(r);   
			}
			return this;
		}
	};
	m = 2942;
	a[n] = m;
	c[m] = a;
	
	//公会建筑加速--加速提醒
	a = o.GuildAccelerateNoticeRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			this.info = new o.BaseInfo().decode(r);
			return this;
		}
	};
	m = 2943;
	a[n] = m;
	c[m] = a;
	
	//公会建筑加速--广播加速请求
	a = o.GuildAccelerateBroadcastRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			return this;
		}
	};
	m = 2944;
	a[n] = m;
	c[m] = a;
	
	a = o.TavernHero = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.heroId);
			w[w3](this.typeId);
			w[wy](this.star);
		}
		decode(r) {
			this.heroId = r[r3]();
			this.typeId = r[r3]();
			this.star = r[ry]();
			return this;
		}
	};
	
	//酒馆任务信息
	a = o.TavernTask = class {
		constructor(d) {
			this.groups = [];
			this.heroList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.index);
			w[w3](this.taskId);
			w[w3](this.startTime);
			w[wy](this.quality);
			w[w1](this.groups.length);
			for (var i = 0, len = this.groups.length; i < len; i++) {
				w[wy](this.groups[i]);   
			}
			w[w1](this.heroList.length);
			for (var i = 0, len = this.heroList.length; i < len; i++) {
				this.heroList[i].encode(w);   
			}
		}
		decode(r) {
			this.index = r[r3]();
			this.taskId = r[r3]();
			this.startTime = r[r3]();
			this.quality = r[ry]();
			this.groups = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.groups[i] = r[ry]();   
			}
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroList[i] = new o.TavernHero().decode(r);   
			}
			return this;
		}
	};
	
	//酒馆 -- 信息
	a = o.TavernInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3001);
			w[fm]();
		}
	};
	m = 3001;
	a[n] = m;
	
	a = o.TavernInfoRsp = class {
		decode(r) {
			this.doingTasks = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.doingTasks[i] = new o.TavernTask().decode(r);   
			}
			this.todoTasks = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.todoTasks[i] = new o.TavernTask().decode(r);   
			}
			this.refreshTimes = r[r3]();
			this.extraFlag = r[ry]();
			if (r[rb]()) {
				this.extraTask1 = new o.TavernTask().decode(r);
			}
			if (r[rb]()) {
				this.extraTask2 = new o.TavernTask().decode(r);
			}
			return this;
		}
	};
	m = 3001;
	a[n] = m;
	c[m] = a;
	
	//酒馆 -- 任务执行
	a = o.TavernTaskStartReq = class {
		constructor(d) {
			this.heroList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3002);
			w[w3](this.todoIndex);
			w[w1](this.heroList.length);
			for (var i = 0, len = this.heroList.length; i < len; i++) {
				w[w3](this.heroList[i]);   
			}
			w[fm]();
		}
	};
	m = 3002;
	a[n] = m;
	
	a = o.TavernTaskStartRsp = class {
		decode(r) {
			this.todoIndex = r[r3]();
			this.doingTask = new o.TavernTask().decode(r);
			return this;
		}
	};
	m = 3002;
	a[n] = m;
	c[m] = a;
	
	//酒馆 -- 任务领取
	a = o.TavernTaskRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3003);
			w[w3](this.index);
			w[wb](this.isFast);
			w[wb](this.isAll);
			w[fm]();
		}
	};
	m = 3003;
	a[n] = m;
	
	a = o.TavernTaskRewardRsp = class {
		decode(r) {
			this.index = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.index[i] = r[r3]();   
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3003;
	a[n] = m;
	c[m] = a;
	
	//酒馆 -- 任务刷新
	a = o.TavernTaskRefreshReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3004);
			w[fm]();
		}
	};
	m = 3004;
	a[n] = m;
	
	a = o.TavernTaskRefreshRsp = class {
		decode(r) {
			this.todoTasks = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.todoTasks[i] = new o.TavernTask().decode(r);   
			}
			return this;
		}
	};
	m = 3004;
	a[n] = m;
	c[m] = a;
	
	//酒馆 -- 物品统计
	a = o.TavernGoodsStatReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3005);
			w[fm]();
		}
	};
	m = 3005;
	a[n] = m;
	
	a = o.TavernGoodsStatRsp = class {
		decode(r) {
			this.addList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.addList[i] = new o.GoodsInfo().decode(r);   
			}
			this.subList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.subList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3005;
	a[n] = m;
	c[m] = a;
	
	//酒馆 -- 领取额外任务
	a = o.TavernExtraTaskReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3006);
			w[wy](this.type);
			w[fm]();
		}
	};
	m = 3006;
	a[n] = m;
	
	a = o.TavernExtraTaskRsp = class {
		decode(r) {
			this.type = r[ry]();
			this.task = new o.TavernTask().decode(r);
			return this;
		}
	};
	m = 3006;
	a[n] = m;
	c[m] = a;
	
	// 为了兼容外网已有通行证的玩家，保留他们更新活动类型前的通行证有些时间
	a = o.PassSETime = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.startTime);
			w[w3](this.endTime);
			w[w3](this.cycle);
		}
		decode(r) {
			this.startTime = r[r3]();
			this.endTime = r[r3]();
			this.cycle = r[r3]();
			return this;
		}
	};
	
	//通行证任务--列表
	a = o.PassListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3101);
			w[fm]();
		}
	};
	m = 3101;
	a[n] = m;
	
	a = o.PassListRsp = class {
		decode(r) {
			this.bought = r[rb]();
			this.rewarded1 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded1[i] = r[ry]();   
			}
			this.rewarded2 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded2[i] = r[ry]();   
			}
			this.sETime = new o.PassSETime().decode(r);
			return this;
		}
	};
	m = 3101;
	a[n] = m;
	c[m] = a;
	
	//通行证任务--领奖
	a = o.PassAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3102);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 3102;
	a[n] = m;
	
	a = o.PassAwardRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.rewarded1 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded1[i] = r[ry]();   
			}
			this.rewarded2 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded2[i] = r[ry]();   
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3102;
	a[n] = m;
	c[m] = a;
	
	//成长基金--列表
	a = o.GrowthfundListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3103);
			w[fm]();
		}
	};
	m = 3103;
	a[n] = m;
	
	a = o.GrowthfundListRsp = class {
		decode(r) {
			this.bought = r[rb]();
			this.rewarded = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 3103;
	a[n] = m;
	c[m] = a;
	
	//成长基金--领奖
	a = o.GrowthfundAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3104);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 3104;
	a[n] = m;
	
	a = o.GrowthfundAwardRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.rewarded = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded[i] = r[ry]();   
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3104;
	a[n] = m;
	c[m] = a;
	
	//试练塔基金--列表
	a = o.TowerfundListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3105);
			w[fm]();
		}
	};
	m = 3105;
	a[n] = m;
	
	a = o.TowerfundListRsp = class {
		decode(r) {
			this.bought = r[rb]();
			this.rewarded = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 3105;
	a[n] = m;
	c[m] = a;
	
	//试练塔基金--领奖
	a = o.TowerfundAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3106);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 3106;
	a[n] = m;
	
	a = o.TowerfundAwardRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.rewarded = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded[i] = r[ry]();   
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3106;
	a[n] = m;
	c[m] = a;
	
	a = o.PassFund = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.startTime);
			w[w3](this.rewardTime);
		}
		decode(r) {
			this.startTime = r[r3]();
			this.rewardTime = r[r3]();
			return this;
		}
	};
	
	//超值(豪华)基金--列表
	a = o.PassFundListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3107);
			w[fm]();
		}
	};
	m = 3107;
	a[n] = m;
	
	a = o.PassFundListRsp = class {
		decode(r) {
			this.fund1 = new o.PassFund().decode(r);
			this.fund2 = new o.PassFund().decode(r);
			return this;
		}
	};
	m = 3107;
	a[n] = m;
	c[m] = a;
	
	//超值(豪华)基金--领取
	a = o.PassFundFetchReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3108);
			w[wy](this.index);
			w[fm]();
		}
	};
	m = 3108;
	a[n] = m;
	
	a = o.PassFundFetchRsp = class {
		decode(r) {
			this.fund = new o.PassFund().decode(r);
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3108;
	a[n] = m;
	c[m] = a;
	
	//周卡证任务--列表
	a = o.PassWeeklyListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3109);
			w[fm]();
		}
	};
	m = 3109;
	a[n] = m;
	
	a = o.PassWeeklyListRsp = class {
		decode(r) {
			this.bought = r[rb]();
			this.rewarded1 = r[r3]();
			this.rewarded2 = r[r3]();
			this.sETime = new o.PassSETime().decode(r);
			return this;
		}
	};
	m = 3109;
	a[n] = m;
	c[m] = a;
	
	//周卡证任务--领奖
	a = o.PassWeeklyAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3110);
			w[w3](this.day);
			w[fm]();
		}
	};
	m = 3110;
	a[n] = m;
	
	a = o.PassWeeklyAwardRsp = class {
		decode(r) {
			this.day = r[r3]();
			this.rewarded1 = r[r3]();
			this.rewarded2 = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3110;
	a[n] = m;
	c[m] = a;
	
	//佣兵--查看英雄
	a = o.MercenaryImageReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3201);
			w[w6](this.playerId);
			w[w3](this.heroTypeid);
			w[fm]();
		}
	};
	m = 3201;
	a[n] = m;
	
	a = o.MercenaryImageRsp = class {
		decode(r) {
			this.hero = new o.HeroImage().decode(r);
			return this;
		}
	};
	m = 3201;
	a[n] = m;
	c[m] = a;
	
	a = o.MercenaryLentHero = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.index);
			w[w3](this.heroId);
			w[w3](this.startTime);
			w[w3](this.settlteTime);
			w[w3](this.settlteGold);
			w[w3](this.gainTime);
		}
		decode(r) {
			this.index = r[ry]();
			this.heroId = r[r3]();
			this.startTime = r[r3]();
			this.settlteTime = r[r3]();
			this.settlteGold = r[r3]();
			this.gainTime = r[r3]();
			return this;
		}
	};
	
	//佣兵--设置英雄
	a = o.MercenaryLendOnReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3202);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 3202;
	a[n] = m;
	
	a = o.MercenaryLendOnRsp = class {
		decode(r) {
			this.hero = new o.MercenaryLentHero().decode(r);
			return this;
		}
	};
	m = 3202;
	a[n] = m;
	c[m] = a;
	
	//佣兵--取消设置
	a = o.MercenaryLendOffReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3203);
			w[wy](this.index);
			w[fm]();
		}
	};
	m = 3203;
	a[n] = m;
	
	a = o.MercenaryLendOffRsp = class {
		decode(r) {
			this.index = r[ry]();
			this.gain = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.gain[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3203;
	a[n] = m;
	c[m] = a;
	
	//佣兵--已设英雄
	a = o.MercenaryLentReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3204);
			w[fm]();
		}
	};
	m = 3204;
	a[n] = m;
	
	a = o.MercenaryLentRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.MercenaryLentHero().decode(r);   
			}
			return this;
		}
	};
	m = 3204;
	a[n] = m;
	c[m] = a;
	
	//佣兵--领取收益
	a = o.MercenaryGainReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3205);
			w[fm]();
		}
	};
	m = 3205;
	a[n] = m;
	
	a = o.MercenaryGainRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.MercenaryLentHero().decode(r);   
			}
			this.gain = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.gain[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3205;
	a[n] = m;
	c[m] = a;
	
	a = o.MercenaryListHero = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[ws](this.playerName);
			w[w3](this.heroPower);
			this.heroBrief.encode(w);
			w[wy](this.lendNum);
		}
		decode(r) {
			this.playerId = r[r6]();
			this.playerName = r[rs]();
			this.heroPower = r[r3]();
			this.heroBrief = new o.HeroBrief().decode(r);
			this.lendNum = r[ry]();
			return this;
		}
	};
	
	//佣兵--可借英雄
	a = o.MercenaryListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3206);
			w[fm]();
		}
	};
	m = 3206;
	a[n] = m;
	
	a = o.MercenaryListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.MercenaryListHero().decode(r);   
			}
			return this;
		}
	};
	m = 3206;
	a[n] = m;
	c[m] = a;
	
	a = o.MercenaryBorrowedHero = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.index);
			w[w6](this.playerId);
			w[ws](this.playerName);
			w[w3](this.power);
			this.brief.encode(w);
		}
		decode(r) {
			this.index = r[r3]();
			this.playerId = r[r6]();
			this.playerName = r[rs]();
			this.power = r[r3]();
			this.brief = new o.HeroBrief().decode(r);
			return this;
		}
	};
	
	//佣兵--雇佣英雄
	a = o.MercenaryBorrowReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3207);
			w[w6](this.playerId);
			w[w3](this.heroTypeid);
			w[fm]();
		}
	};
	m = 3207;
	a[n] = m;
	
	a = o.MercenaryBorrowRsp = class {
		decode(r) {
			this.hero = new o.MercenaryBorrowedHero().decode(r);
			return this;
		}
	};
	m = 3207;
	a[n] = m;
	c[m] = a;
	
	//佣兵--已借英雄
	a = o.MercenaryBorrowedReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3208);
			w[fm]();
		}
	};
	m = 3208;
	a[n] = m;
	
	a = o.MercenaryBorrowedRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.MercenaryBorrowedHero().decode(r);   
			}
			return this;
		}
	};
	m = 3208;
	a[n] = m;
	c[m] = a;
	
	//佣兵--战斗属性
	a = o.MercenaryFightReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3209);
			w[w3](this.index);
			w[wb](this.isTd);
			w[fm]();
		}
	};
	m = 3209;
	a[n] = m;
	
	a = o.MercenaryFightRsp = class {
		decode(r) {
			this.index = r[r3]();
			this.hero = new o.FightHero().decode(r);
			return this;
		}
	};
	m = 3209;
	a[n] = m;
	c[m] = a;
	
	//佣兵--取消雇佣（只限系统雇佣兵）
	a = o.MercenaryCancelReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3210);
			w[w3](this.index);
			w[fm]();
		}
	};
	m = 3210;
	a[n] = m;
	
	a = o.MercenaryCancelRsp = class {
		decode(r) {
			this.index = r[r3]();
			return this;
		}
	};
	m = 3210;
	a[n] = m;
	c[m] = a;
	
	a = o.SurvivalEquipInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.equipId);
			w[wy](this.equipLv);
		}
		decode(r) {
			this.equipId = r[r3]();
			this.equipLv = r[ry]();
			return this;
		}
	};
	
	a = o.SurvivalHeroesInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.typeId);
			w[w3](this.heroId);
		}
		decode(r) {
			this.typeId = r[ry]();
			this.heroId = r[r3]();
			return this;
		}
	};
	
	//生存训练--副本状态
	a = o.SurvivalStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3301);
			w[fm]();
		}
	};
	m = 3301;
	a[n] = m;
	
	a = o.SurvivalStateRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.resetedNum = r[ry]();
			this.endTime = r[r3]();
			this.avgHeroPower = r[r3]();
			this.subType = r[ry]();
			this.passTimes = r[ry]();
			this.diffTimes = r[ry]();
			this.select = r[rb]();
			this.lastBuy = r[rb]();
			this.merRewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.merRewards[i] = new o.GoodsInfo().decode(r);   
			}
			this.heroes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroes[i] = new o.SurvivalHeroesInfo().decode(r);   
			}
			this.equips = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.equips[i] = new o.SurvivalEquipInfo().decode(r);   
			}
			this.totalRewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.totalRewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3301;
	a[n] = m;
	c[m] = a;
	
	//生存训练--副本重置
	a = o.SurvivalResetReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3302);
			w[wb](this.useItem);
			w[fm]();
		}
	};
	m = 3302;
	a[n] = m;
	
	//生存训练--关卡进入
	a = o.SurvivalEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3303);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 3303;
	a[n] = m;
	
	a = o.SurvivalEnterRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			return this;
		}
	};
	m = 3303;
	a[n] = m;
	c[m] = a;
	
	//生存训练--关卡退出
	a = o.SurvivalExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3304);
			w[w3](this.stageId);
			w[wb](this.clear);
			w[fm]();
		}
	};
	m = 3304;
	a[n] = m;
	
	a = o.SurvivalExitRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.clear = r[rb]();
			this.totalRewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.totalRewards[i] = new o.GoodsInfo().decode(r);   
			}
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3304;
	a[n] = m;
	c[m] = a;
	
	// 生存训练--佣兵上阵
	a = o.SurvivalHeroOnReq = class {
		constructor(d) {
			this.heros = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3305);
			w[w1](this.heros.length);
			for (var i = 0, len = this.heros.length; i < len; i++) {
				this.heros[i].encode(w);   
			}
			w[fm]();
		}
	};
	m = 3305;
	a[n] = m;
	
	a = o.SurvivalHeroOnRsp = class {
		decode(r) {
			this.heros = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heros[i] = new o.SurvivalHeroesInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3305;
	a[n] = m;
	c[m] = a;
	
	//生存训练--装备列表
	a = o.SurvivalEquipPocketReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3306);
			w[fm]();
		}
	};
	m = 3306;
	a[n] = m;
	
	a = o.SurvivalEquipPocketRsp = class {
		decode(r) {
			this.equipIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.equipIds[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 3306;
	a[n] = m;
	c[m] = a;
	
	//生存训练--装备购买
	a = o.SurvivalEquipBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3307);
			w[wy](this.equipIdx);
			w[fm]();
		}
	};
	m = 3307;
	a[n] = m;
	
	a = o.SurvivalEquipBuyRsp = class {
		decode(r) {
			this.equipInfo = new o.SurvivalEquipInfo().decode(r);
			return this;
		}
	};
	m = 3307;
	a[n] = m;
	c[m] = a;
	
	//生存训练--刷新购买装备
	a = o.SurvivalRefreshEquipPocketReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3308);
			w[fm]();
		}
	};
	m = 3308;
	a[n] = m;
	
	//生存训练--刷新购买装备
	a = o.SurvivalRefreshEquipPocketRsp = class {
		decode(r) {
			this.equipIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.equipIds[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 3308;
	a[n] = m;
	c[m] = a;
	
	//生存训练--选择难度
	a = o.SurvivalSubTypeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3309);
			w[wy](this.subType);
			w[fm]();
		}
	};
	m = 3309;
	a[n] = m;
	
	a = o.SurvivalSubTypeRsp = class {
		decode(r) {
			this.subType = r[ry]();
			this.heroes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroes[i] = new o.SurvivalHeroesInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3309;
	a[n] = m;
	c[m] = a;
	
	//生存训练--扫荡
	a = o.SurvivalRaidReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3310);
			w[fm]();
		}
	};
	m = 3310;
	a[n] = m;
	
	a = o.SurvivalRaidRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3310;
	a[n] = m;
	c[m] = a;
	
	//生存训练--查看雇佣奖励
	a = o.SurvivalMerRewardsPreviewReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3311);
			w[fm]();
		}
	};
	m = 3311;
	a[n] = m;
	
	a = o.SurvivalMerRewardsPreviewRsp = class {
		decode(r) {
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3311;
	a[n] = m;
	c[m] = a;
	
	//生存训练--领取雇佣奖励
	a = o.SurvivalMerRewardsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3312);
			w[fm]();
		}
	};
	m = 3312;
	a[n] = m;
	
	a = o.SurvivalMerRewardsRsp = class {
		decode(r) {
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3312;
	a[n] = m;
	c[m] = a;
	
	a = o.SurvivalMerRecord = class {
		constructor(d) {
			this.rewards = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.lendId);
			w[ws](this.lend);
			w[w6](this.borrowId);
			w[ws](this.borrow);
			this.hero.encode(w);
			w[w3](this.time);
			w[w1](this.rewards.length);
			for (var i = 0, len = this.rewards.length; i < len; i++) {
				this.rewards[i].encode(w);   
			}
		}
		decode(r) {
			this.lendId = r[r6]();
			this.lend = r[rs]();
			this.borrowId = r[r6]();
			this.borrow = r[rs]();
			this.hero = new o.HeroImage().decode(r);
			this.time = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	
	//生存训练--公会雇佣记录
	a = o.SurvivalMerRecordReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3313);
			w[fm]();
		}
	};
	m = 3313;
	a[n] = m;
	
	a = o.SurvivalMerRecordRsp = class {
		decode(r) {
			this.merRewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.merRewards[i] = new o.GoodsInfo().decode(r);   
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.SurvivalMerRecord().decode(r);   
			}
			return this;
		}
	};
	m = 3313;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdGuild = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
            w[wui](this.id);
			w[ws](this.name);
            w[wui](this.icon);
            w[wui](this.frame);
            w[wui](this.bottom);
            w[wui](this.level);
			this.origin.encode(w);
		}
		decode(r) {
			this.id = r[rui]();
			this.name = r[rs]();
			this.icon = r[rui]();
			this.frame = r[rui]();
			this.bottom = r[rui]();
			this.level = r[rui]();
			this.origin = new o.FootholdPos().decode(r);
			return this;
		}
	};
	
	a = o.FootholdPlayer = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
            w[wui](this.id);
			w[ws](this.name);
            w[wui](this.level);
            w[wui](this.head);
            w[wui](this.headFrame);
            w[wui](this.vipExp);
            w[wui](this.guildId);
            w[wui](this.power);
            w[wui](this.titleExp);
		}
		decode(r) {
			this.id = r[rui]();
			this.name = r[rs]();
			this.level = r[rui]();
			this.head = r[rui]();
			this.headFrame = r[rui]();
			this.vipExp = r[rui]();
			this.guildId = r[rui]();
			this.power = r[rui]();
			this.titleExp = r[rui]();
			return this;
		}
	};
	
	a = o.FootholdPos = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.x);
			w[wy](this.y);
		}
		decode(r) {
			this.x = r[ry]();
			this.y = r[ry]();
			return this;
		}
	};
	
	a = o.FootholdGather = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.startTime);
			w[w1](this.teamNum);
			this.targetPos.encode(w);
		}
		decode(r) {
			this.startTime = r[r3]();
			this.teamNum = r[r1]();
			this.targetPos = new o.FootholdPos().decode(r);
			return this;
		}
	};
	
	a = o.FootholdPoint = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.pos.encode(w);
			w[wy](this.status);
            w[wui](this.statusEndtime);
            w[wui](this.playerId);
            w[wui](this.guildId);
            w[wui](this.bossHp);
			if (!this.gather) {
				w[wb](false);
			} else {
				w[wb](true);
				this.gather.encode(w);
			}
		}
		decode(r) {
			this.pos = new o.FootholdPos().decode(r);
			this.status = r[ry]();
			this.statusEndtime = r[rui]();
			this.playerId = r[rui]();
			this.guildId = r[rui]();
			this.bossHp = r[rui]();
			if (r[rb]()) {
				this.gather = new o.FootholdGather().decode(r);
			}
			return this;
		}
	};
	
	//据点战--查询玩家
	a = o.FootholdLookupPlayerReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3401);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 3401;
	a[n] = m;
	
	a = o.FootholdLookupPlayerRsp = class {
		decode(r) {
			this.player = new o.FootholdPlayer().decode(r);
			return this;
		}
	};
	m = 3401;
	a[n] = m;
	c[m] = a;
	
	//据点战--查询公会
	a = o.FootholdLookupGuildReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3402);
			w[w6](this.guildId);
			w[fm]();
		}
	};
	m = 3402;
	a[n] = m;
	
	a = o.FootholdLookupGuildRsp = class {
		decode(r) {
			this.guild = new o.FootholdGuild().decode(r);
			return this;
		}
	};
	m = 3402;
	a[n] = m;
	c[m] = a;
	
	//红点提示
	a = o.FootholdRedPoints = class {
		constructor(d) {
			this.points = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.warId);
			w[w3](this.mapId);
			w[w3](this.mapType);
			w[w1](this.points.length);
			for (var i = 0, len = this.points.length; i < len; i++) {
				this.points[i].encode(w);   
			}
		}
		decode(r) {
			this.warId = r[r3]();
			this.mapId = r[r3]();
			this.mapType = r[r3]();
			this.points = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.points[i] = new o.FootholdPos().decode(r);   
			}
			return this;
		}
	};
	
	//据点战--红点提示
	a = o.FootholdRedPointsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3403);
			w[fm]();
		}
	};
	m = 3403;
	a[n] = m;
	
	a = o.FootholdRedPointsRsp = class {
		decode(r) {
			this.broadcast = r[rb]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.FootholdRedPoints().decode(r);   
			}
			return this;
		}
	};
	m = 3403;
	a[n] = m;
	c[m] = a;
	
	//据点战--角色相关信息
	a = o.FootholdRoleInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3404);
			w[fm]();
		}
	};
	m = 3404;
	a[n] = m;
	
	a = o.FootholdRoleInfoRsp = class {
		decode(r) {
			this.energy = r[r3]();
			this.recoverTime = r[r3]();
			this.worldLevel = r[r3]();
			this.worldLevelIdx = r[r3]();
			this.activityType = r[r3]();
			this.activityIndex = r[r3]();
			this.startTime = r[r3]();
			this.endTime = r[r3]();
			this.energyBought = r[r3]();
			this.rewardedBaseLevel = r[r3]();
			this.guessRewarded = r[r3]();
			this.guessOpened = r[rb]();
			this.guessRedPoints = r[r3]();
			this.missionExp = r[r3]();
			this.freeEnergy = r[r3]();
			this.freeEnergyBase = r[r3]();
			this.coopGuildId = r[r6]();
			this.coopInviteNum = r[r3]();
			this.coopApplyNum = r[r3]();
			this.coopStartTime = r[r3]();
			return this;
		}
	};
	m = 3404;
	a[n] = m;
	c[m] = a;
	
	//据点战--进入地图
	a = o.FootholdMapEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3405);
			w[w3](this.warId);
			w[fm]();
		}
	};
	m = 3405;
	a[n] = m;
	
	a = o.FootholdMapEnterRsp = class {
		decode(r) {
			this.mapId = r[r3]();
			this.mapType = r[r3]();
			this.rndSeed = r[r3]();
			if (r[rb]()) {
				this.fightingPos = new o.FootholdPos().decode(r);
			}
			this.guilds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.guilds[i] = new o.FootholdGuild().decode(r);   
			}
			this.players = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.players[i] = new o.FootholdPlayer().decode(r);   
			}
			this.points = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.points[i] = new o.FootholdPoint().decode(r);   
			}
			this.towers = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.towers[i] = r[ry]();   
			}
			this.worldLevelIdx = r[r3]();
			return this;
		}
	};
	m = 3405;
	a[n] = m;
	c[m] = a;
	
	//据点战--退出地图
	a = o.FootholdMapExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3406);
			w[w3](this.warId);
			w[fm]();
		}
	};
	m = 3406;
	a[n] = m;
	
	a = o.FootholdMapExitRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 3406;
	a[n] = m;
	c[m] = a;
	
	//据点战--公会加入
	a = o.FootholdGuildJoinRsp = class {
		decode(r) {
			this.guild = new o.FootholdGuild().decode(r);
			return this;
		}
	};
	m = 3407;
	a[n] = m;
	c[m] = a;
	
	//据点战--玩家加入
	a = o.FootholdPlayerJoinRsp = class {
		decode(r) {
			this.player = new o.FootholdPlayer().decode(r);
			return this;
		}
	};
	m = 3408;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdDamage = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[wU3](this.damage);
		}
		decode(r) {
			this.playerId = r[r6]();
			this.damage = r[rU3]();
			return this;
		}
	};
	
	//据点战--据点详情
	a = o.FootholdPointDetailReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3409);
			w[w3](this.warId);
			this.pos.encode(w);
			w[fm]();
		}
	};
	m = 3409;
	a[n] = m;
	
	a = o.FootholdPointDetailRsp = class {
		decode(r) {
			this.pos = new o.FootholdPos().decode(r);
			this.bossId = r[r3]();
			this.bossHp = r[r6]();
			this.needEnergy = r[r3]();
			this.resetTime = r[r3]();
			this.damageList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.damageList[i] = new o.FootholdDamage().decode(r);   
			}
			this.scoreRewarded = r[rb]();
			this.isChallenged = r[rb]();
			this.titleExp = r[r3]();
			return this;
		}
	};
	m = 3409;
	a[n] = m;
	c[m] = a;
	
	//据点战--据点积分奖励
	a = o.FootholdPointScoreReq = class {
		constructor(d) {
			this.posList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3410);
			w[w3](this.warId);
			w[w1](this.posList.length);
			for (var i = 0, len = this.posList.length; i < len; i++) {
				this.posList[i].encode(w);   
			}
			w[fm]();
		}
	};
	m = 3410;
	a[n] = m;
	
	a = o.FootholdPointScoreRsp = class {
		decode(r) {
			this.warId = r[r3]();
			this.posList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.posList[i] = new o.FootholdPos().decode(r);   
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3410;
	a[n] = m;
	c[m] = a;
	
	//据点战--查看对手
	a = o.FootholdFightQueryReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3411);
			w[w3](this.warId);
			this.pos.encode(w);
			w[fm]();
		}
	};
	m = 3411;
	a[n] = m;
	
	a = o.FootholdFightQueryRsp = class {
		decode(r) {
			this.warId = r[r3]();
			this.pos = new o.FootholdPos().decode(r);
			this.playerId = r[r6]();
			this.guildId = r[r6]();
			this.resetTime = r[r3]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroList[i] = new o.FightDefendHero().decode(r);   
			}
			return this;
		}
	};
	m = 3411;
	a[n] = m;
	c[m] = a;
	
	//据点战--战斗开始
	a = o.FootholdFightStartReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3412);
			w[w3](this.warId);
			this.pos.encode(w);
			w[w3](this.pveId);
			w[fm]();
		}
	};
	m = 3412;
	a[n] = m;
	
	a = o.FootholdFightStartRsp = class {
		decode(r) {
			this.warId = r[r3]();
			this.pos = new o.FootholdPos().decode(r);
			this.bossHp = r[r6]();
			this.playerHp = r[r3]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				if (r[rb]()) {
					this.heroList[i] = new o.FightHero().decode(r);
				}   
			}
			if (r[rb]()) {
				this.general = new o.FightGeneral().decode(r);
			}
			return this;
		}
	};
	m = 3412;
	a[n] = m;
	c[m] = a;
	
	//据点战--战斗结束
	a = o.FootholdFightOverReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3413);
			w[w3](this.warId);
			this.pos.encode(w);
			w[wU3](this.bossDmg);
			w[w3](this.playerDmg);
			w[fm]();
		}
	};
	m = 3413;
	a[n] = m;
	
	a = o.FootholdFightOverRsp = class {
		decode(r) {
			this.warId = r[r3]();
			this.pos = new o.FootholdPos().decode(r);
			this.energy = r[r3]();
			this.baseExp = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3413;
	a[n] = m;
	c[m] = a;
	
	//据点战--战斗广播
	a = o.FootholdFightBroadcastRsp = class {
		decode(r) {
			this.warId = r[r3]();
			this.point = new o.FootholdPoint().decode(r);
			return this;
		}
	};
	m = 3414;
	a[n] = m;
	c[m] = a;
	
	//据点战--前6名通关公会
	a = o.FootholdTop6GuildReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3415);
			w[fm]();
		}
	};
	m = 3415;
	a[n] = m;
	
	a = o.FootholdTop6GuildRsp = class {
		decode(r) {
			this.broadcast = r[rb]();
			this.remain = r[ry]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.FootholdGuild().decode(r);   
			}
			return this;
		}
	};
	m = 3415;
	a[n] = m;
	c[m] = a;
	
	//据点战--boss被击杀
	a = o.FootholdBossKilledRsp = class {
		decode(r) {
			this.warId = r[r3]();
			this.pos = new o.FootholdPos().decode(r);
			return this;
		}
	};
	m = 3416;
	a[n] = m;
	c[m] = a;
	
	//据点战--删除红点
	a = o.FootholdCancelRedpointReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3417);
			w[w3](this.warId);
			this.pos.encode(w);
			w[fm]();
		}
	};
	m = 3417;
	a[n] = m;
	
	a = o.FootholdCancelRedpointRsp = class {
		decode(r) {
			this.warId = r[r3]();
			this.pos = new o.FootholdPos().decode(r);
			return this;
		}
	};
	m = 3417;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdRankingGuild = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.id);
			w[ws](this.name);
			w[w3](this.icon);
			w[w3](this.frame);
			w[w3](this.bottom);
			w[w3](this.clearNum);
			w[w3](this.joinNum);
		}
		decode(r) {
			this.id = r[r6]();
			this.name = r[rs]();
			this.icon = r[r3]();
			this.frame = r[r3]();
			this.bottom = r[r3]();
			this.clearNum = r[r3]();
			this.joinNum = r[r3]();
			return this;
		}
	};
	
	//据点战--第一层排行
	a = o.FootholdRankingReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3418);
			w[fm]();
		}
	};
	m = 3418;
	a[n] = m;
	
	a = o.FootholdRankingRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.FootholdRankingGuild().decode(r);   
			}
			return this;
		}
	};
	m = 3418;
	a[n] = m;
	c[m] = a;
	
	//据点战--查看地图进度
	a = o.FootholdMapProgressReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3419);
			w[w3](this.warId);
			w[fm]();
		}
	};
	m = 3419;
	a[n] = m;
	
	a = o.FootholdMapProgressRsp = class {
		decode(r) {
			this.clearNum = r[r3]();
			this.totalNum = r[r3]();
			return this;
		}
	};
	m = 3419;
	a[n] = m;
	c[m] = a;
	
	//据点战--查看地图排名
	a = o.FootholdMapRankingReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3420);
			w[w3](this.warId);
			w[fm]();
		}
	};
	m = 3420;
	a[n] = m;
	
	a = o.FootholdMapRankingRsp = class {
		decode(r) {
			this.rank = r[r3]();
			this.score = r[r3]();
			return this;
		}
	};
	m = 3420;
	a[n] = m;
	c[m] = a;
	
	//据点战--购买体力
	a = o.FootholdBuyEnergyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3421);
			w[w3](this.number);
			w[fm]();
		}
	};
	m = 3421;
	a[n] = m;
	
	a = o.FootholdBuyEnergyRsp = class {
		decode(r) {
			this.bought = r[r3]();
			this.energy = r[r3]();
			return this;
		}
	};
	m = 3421;
	a[n] = m;
	c[m] = a;
	
	//据点战--领取基地奖励
	a = o.FootholdBaseRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3422);
			w[w3](this.warId);
			w[fm]();
		}
	};
	m = 3422;
	a[n] = m;
	
	a = o.FootholdBaseRewardRsp = class {
		decode(r) {
			this.level = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3422;
	a[n] = m;
	c[m] = a;
	
	//据点战--获取基地等级
	a = o.FootholdBaseLevelReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3423);
			w[w3](this.warId);
			w[w6](this.guildId);
			w[fm]();
		}
	};
	m = 3423;
	a[n] = m;
	
	a = o.FootholdBaseLevelRsp = class {
		decode(r) {
			this.guildId = r[r6]();
			this.level = r[r3]();
			this.exp = r[r3]();
			return this;
		}
	};
	m = 3423;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdPointOutput = class {
		constructor(d) {
			this.items = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			this.pos.encode(w);
			w[w3](this.exp);
			w[w1](this.items.length);
			for (var i = 0, len = this.items.length; i < len; i++) {
				this.items[i].encode(w);   
			}
		}
		decode(r) {
			this.pos = new o.FootholdPos().decode(r);
			this.exp = r[r3]();
			this.items = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.items[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	
	//据点战--查看产出
	a = o.FootholdListOutputReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3424);
			w[w3](this.warId);
			if (!this.pos) {
				w[wb](false);
			} else {
				w[wb](true);
				this.pos.encode(w);
			}
			w[fm]();
		}
	};
	m = 3424;
	a[n] = m;
	
	a = o.FootholdListOutputRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.FootholdPointOutput().decode(r);   
			}
			return this;
		}
	};
	m = 3424;
	a[n] = m;
	c[m] = a;
	
	//据点战--提取产出
	a = o.FootholdTakeOutputReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3425);
			w[w3](this.warId);
			this.pos.encode(w);
			w[wb](this.all);
			w[fm]();
		}
	};
	m = 3425;
	a[n] = m;
	
	a = o.FootholdTakeOutputRsp = class {
		decode(r) {
			this.pos = new o.FootholdPos().decode(r);
			this.all = r[rb]();
			this.exp = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3425;
	a[n] = m;
	c[m] = a;
	
	//据点战--放弃据点
	a = o.FootholdGiveUpReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3426);
			w[w3](this.warId);
			this.pos.encode(w);
			w[fm]();
		}
	};
	m = 3426;
	a[n] = m;
	
	a = o.FootholdGiveUpRsp = class {
		decode(r) {
			this.pos = new o.FootholdPos().decode(r);
			this.exp = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3426;
	a[n] = m;
	c[m] = a;
	
	//据点战--占领据点
	a = o.FootholdCatchUpReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3427);
			w[w3](this.warId);
			this.pos.encode(w);
			w[fm]();
		}
	};
	m = 3427;
	a[n] = m;
	
	a = o.FootholdCatchUpRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 3427;
	a[n] = m;
	c[m] = a;
	
	a = o.LastRankGuild = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.id);
			w[ws](this.name);
			w[w3](this.level);
			w[w3](this.icon);
			w[w3](this.frame);
			w[w3](this.bottom);
			w[w3](this.score);
		}
		decode(r) {
			this.id = r[r6]();
			this.name = r[rs]();
			this.level = r[r3]();
			this.icon = r[r3]();
			this.frame = r[r3]();
			this.bottom = r[r3]();
			this.score = r[r3]();
			return this;
		}
	};
	
	//据点战--公会上周战场排名
	a = o.FootholdLastRankReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3428);
			w[fm]();
		}
	};
	m = 3428;
	a[n] = m;
	
	a = o.FootholdLastRankRsp = class {
		decode(r) {
			this.worldLevelLast = r[r3]();
			this.guilds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.guilds[i] = new o.LastRankGuild().decode(r);   
			}
			return this;
		}
	};
	m = 3428;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdGuide = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.eventId);
			w[w3](this.number);
		}
		decode(r) {
			this.eventId = r[r3]();
			this.number = r[r3]();
			return this;
		}
	};
	
	//据点战--引导提交
	a = o.FootholdGuideCommitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3429);
			this.guide.encode(w);
			w[fm]();
		}
	};
	m = 3429;
	a[n] = m;
	
	a = o.FootholdGuideCommitRsp = class {
		decode(r) {
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3429;
	a[n] = m;
	c[m] = a;
	
	//据点战--引导查询
	a = o.FootholdGuideQueryReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3430);
			w[fm]();
		}
	};
	m = 3430;
	a[n] = m;
	
	a = o.FootholdGuideQueryRsp = class {
		decode(r) {
			this.guildList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.guildList[i] = new o.FootholdGuide().decode(r);   
			}
			return this;
		}
	};
	m = 3430;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdGuessGuild = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.id);
			w[ws](this.name);
			w[w3](this.icon);
			w[w3](this.frame);
			w[w3](this.bottom);
			w[w3](this.maxPower);
			w[ws](this.president);
			w[w3](this.votes);
			w[w3](this.score);
		}
		decode(r) {
			this.id = r[r6]();
			this.name = r[rs]();
			this.icon = r[r3]();
			this.frame = r[r3]();
			this.bottom = r[r3]();
			this.maxPower = r[r3]();
			this.president = r[rs]();
			this.votes = r[r3]();
			this.score = r[r3]();
			return this;
		}
	};
	
	//据点战竞猜--查看
	a = o.FootholdGuessQueryReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3431);
			w[w3](this.day);
			w[fm]();
		}
	};
	m = 3431;
	a[n] = m;
	
	a = o.FootholdGuessQueryRsp = class {
		decode(r) {
			this.guessType = r[r3]();
			this.votedId = r[r6]();
			this.votedPoints = r[r3]();
			this.winnerId = r[r6]();
			this.guilds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.guilds[i] = new o.FootholdGuessGuild().decode(r);   
			}
			return this;
		}
	};
	m = 3431;
	a[n] = m;
	c[m] = a;
	
	//据点战竞猜--选择
	a = o.FootholdGuessVoteReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3432);
			w[w6](this.guildId);
			w[w3](this.votedPoints);
			w[fm]();
		}
	};
	m = 3432;
	a[n] = m;
	
	a = o.FootholdGuessVoteRsp = class {
		decode(r) {
			this.guildId = r[r6]();
			this.votedPoints = r[r3]();
			return this;
		}
	};
	m = 3432;
	a[n] = m;
	c[m] = a;
	
	//据点战竞猜--领奖
	a = o.FootholdGuessRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3433);
			w[wy](this.type);
			w[w3](this.day);
			w[fm]();
		}
	};
	m = 3433;
	a[n] = m;
	
	a = o.FootholdGuessRewardRsp = class {
		decode(r) {
			this.type = r[ry]();
			this.day = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3433;
	a[n] = m;
	c[m] = a;
	
	//据点战--免费体力领取
	a = o.FootholdFreeEnergyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3434);
			w[wb](this.isAll);
			w[w3](this.warId);
			w[fm]();
		}
	};
	m = 3434;
	a[n] = m;
	
	a = o.FootholdFreeEnergyRsp = class {
		decode(r) {
			this.freeEnergy = r[r3]();
			this.energy = r[r3]();
			return this;
		}
	};
	m = 3434;
	a[n] = m;
	c[m] = a;
	
	//据点战--公会联盟
	a = o.FootholdAllianceReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3435);
			w[fm]();
		}
	};
	m = 3435;
	a[n] = m;
	
	a = o.FootholdAllianceRsp = class {
		decode(r) {
			this.alliance1 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.alliance1[i] = r[r6]();   
			}
			this.alliance2 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.alliance2[i] = r[r6]();   
			}
			this.alliance3 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.alliance3[i] = r[r6]();   
			}
			return this;
		}
	};
	m = 3435;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdAtkFlag = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.pos.encode(w);
			w[ws](this.msg);
		}
		decode(r) {
			this.pos = new o.FootholdPos().decode(r);
			this.msg = r[rs]();
			return this;
		}
	};
	
	//据点战--查看进攻标志
	a = o.FootholdAtkFlagGetReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3436);
			w[fm]();
		}
	};
	m = 3436;
	a[n] = m;
	
	a = o.FootholdAtkFlagGetRsp = class {
		decode(r) {
			this.flags = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.flags[i] = new o.FootholdAtkFlag().decode(r);   
			}
			return this;
		}
	};
	m = 3436;
	a[n] = m;
	c[m] = a;
	
	//据点战--设置进攻标志
	a = o.FootholdAtkFlagSetReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3437);
			this.pos.encode(w);
			w[ws](this.msg);
			w[fm]();
		}
	};
	m = 3437;
	a[n] = m;
	
	a = o.FootholdAtkFlagSetRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 3437;
	a[n] = m;
	c[m] = a;
	
	//据点战--删除进攻标志
	a = o.FootholdAtkFlagDelReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3438);
			this.pos.encode(w);
			w[fm]();
		}
	};
	m = 3438;
	a[n] = m;
	
	a = o.FootholdAtkFlagDelRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 3438;
	a[n] = m;
	c[m] = a;
	
	//据点战--联盟聊天记录
	a = o.FootholdAChatHisReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3439);
			w[fm]();
		}
	};
	m = 3439;
	a[n] = m;
	
	a = o.FootholdAChatHisRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 3439;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdFightRecord = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.fightTime);
			w[w6](this.attackerId);
			w[ws](this.attackerName);
			w[ws](this.attackerGuild);
			w[w3](this.remainPercent);
		}
		decode(r) {
			this.fightTime = r[r3]();
			this.attackerId = r[r6]();
			this.attackerName = r[rs]();
			this.attackerGuild = r[rs]();
			this.remainPercent = r[r3]();
			return this;
		}
	};
	
	//据点战--联盟聊天记录
	a = o.FootholdFightRecordsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3440);
			this.pos.encode(w);
			w[w6](this.ownerId);
			w[fm]();
		}
	};
	m = 3440;
	a[n] = m;
	
	a = o.FootholdFightRecordsRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.FootholdFightRecord().decode(r);   
			}
			return this;
		}
	};
	m = 3440;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdTeamBrief = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[w3](this.joinedNum);
			w[wb](this.joined);
			if (!this.roleBrief) {
				w[wb](false);
			} else {
				w[wb](true);
				this.roleBrief.encode(w);
			}
		}
		decode(r) {
			this.playerId = r[r6]();
			this.joinedNum = r[r3]();
			this.joined = r[rb]();
			if (r[rb]()) {
				this.roleBrief = new o.RoleBrief().decode(r);
			}
			return this;
		}
	};
	
	a = o.FootholdTeamFighter = class {
		constructor(d) {
			this.heroList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.index);
			w[w6](this.id);
			w[ws](this.name);
			w[w3](this.hp);
			w[w3](this.vipExp);
			w[w3](this.head);
			w[w3](this.frame);
			w[w1](this.heroList.length);
			for (var i = 0, len = this.heroList.length; i < len; i++) {
				if (!this.heroList[i]) {
					w[wb](false);
				} else {
					w[wb](true);
					this.heroList[i].encode(w);
				}   
			}
			if (!this.general) {
				w[wb](false);
			} else {
				w[wb](true);
				this.general.encode(w);
			}
		}
		decode(r) {
			this.index = r[ry]();
			this.id = r[r6]();
			this.name = r[rs]();
			this.hp = r[r3]();
			this.vipExp = r[r3]();
			this.head = r[r3]();
			this.frame = r[r3]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				if (r[rb]()) {
					this.heroList[i] = new o.FightHero().decode(r);
				}   
			}
			if (r[rb]()) {
				this.general = new o.FightGeneral().decode(r);
			}
			return this;
		}
	};
	
	//据点战--集结发起(FootholdGatherBriefRsp）
	a = o.FootholdGatherInitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3441);
			this.from.encode(w);
			this.to.encode(w);
			w[fm]();
		}
	};
	m = 3441;
	a[n] = m;
	
	//据点战--集结查看玩家
	a = o.FootholdGatherBriefReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3442);
			this.pos.encode(w);
			w[fm]();
		}
	};
	m = 3442;
	a[n] = m;
	
	a = o.FootholdGatherBriefRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.FootholdTeamBrief().decode(r);   
			}
			return this;
		}
	};
	m = 3442;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdGatherTeammate = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.index);
			this.brief.encode(w);
		}
		decode(r) {
			this.index = r[ry]();
			this.brief = new o.RoleBrief().decode(r);
			return this;
		}
	};
	
	//据点战--集结查看队伍
	a = o.FootholdGatherTeamReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3443);
			this.pos.encode(w);
			w[fm]();
		}
	};
	m = 3443;
	a[n] = m;
	
	a = o.FootholdGatherTeamRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.FootholdGatherTeammate().decode(r);   
			}
			return this;
		}
	};
	m = 3443;
	a[n] = m;
	c[m] = a;
	
	//据点战--集结取消
	a = o.FootholdGatherCancelReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3444);
			this.pos.encode(w);
			w[fm]();
		}
	};
	m = 3444;
	a[n] = m;
	
	a = o.FootholdGatherCancelRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 3444;
	a[n] = m;
	c[m] = a;
	
	//据点战--集结邀请
	a = o.FootholdGatherInviteReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3445);
			this.pos.encode(w);
			w[w6](this.targetId);
			w[fm]();
		}
	};
	m = 3445;
	a[n] = m;
	
	a = o.FootholdGatherInviteRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 3445;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdGatherInviter = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			this.pos.encode(w);
			w[w3](this.pointType);
			w[w3](this.teamNum);
			w[w3](this.initTime);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.pos = new o.FootholdPos().decode(r);
			this.pointType = r[r3]();
			this.teamNum = r[r3]();
			this.initTime = r[r3]();
			return this;
		}
	};
	
	//据点战--集结邀请者列表
	a = o.FootholdGatherInvitersReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3446);
			w[wy](this.type);
			w[fm]();
		}
	};
	m = 3446;
	a[n] = m;
	
	a = o.FootholdGatherInvitersRsp = class {
		decode(r) {
			this.num = r[r1]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.FootholdGatherInviter().decode(r);   
			}
			return this;
		}
	};
	m = 3446;
	a[n] = m;
	c[m] = a;
	
	//据点战--集结拒绝邀请
	a = o.FootholdGatherRefuseReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3447);
			this.pos.encode(w);
			w[wb](this.all);
			w[fm]();
		}
	};
	m = 3447;
	a[n] = m;
	
	a = o.FootholdGatherRefuseRsp = class {
		decode(r) {
			this.pos = new o.FootholdPos().decode(r);
			this.all = r[rb]();
			return this;
		}
	};
	m = 3447;
	a[n] = m;
	c[m] = a;
	
	//据点战--集结加入
	a = o.FootholdGatherJoinReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3448);
			this.pos.encode(w);
			w[w3](this.index);
			w[fm]();
		}
	};
	m = 3448;
	a[n] = m;
	
	a = o.FootholdGatherJoinRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 3448;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdGatherPoint = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.pos.encode(w);
			w[w3](this.pointType);
			w[w3](this.teamNum);
		}
		decode(r) {
			this.pos = new o.FootholdPos().decode(r);
			this.pointType = r[r3]();
			this.teamNum = r[r3]();
			return this;
		}
	};
	
	//据点战--集结据点列表
	a = o.FootholdGatherPointsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3449);
			w[wy](this.type);
			w[fm]();
		}
	};
	m = 3449;
	a[n] = m;
	
	a = o.FootholdGatherPointsRsp = class {
		decode(r) {
			this.num = r[r1]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.FootholdGatherPoint().decode(r);   
			}
			return this;
		}
	};
	m = 3449;
	a[n] = m;
	c[m] = a;
	
	//据点战--集结挑战开始
	a = o.FootholdGatherFightStartReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3450);
			this.pos.encode(w);
			w[wy](this.typ);
			w[fm]();
		}
	};
	m = 3450;
	a[n] = m;
	
	a = o.FootholdGatherFightStartRsp = class {
		decode(r) {
			this.teammates = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.teammates[i] = new o.FootholdTeamFighter().decode(r);   
			}
			this.opponents = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.opponents[i] = new o.FootholdTeamFighter().decode(r);   
			}
			return this;
		}
	};
	m = 3450;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdGatherFightValue = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[w3](this.value);
		}
		decode(r) {
			this.playerId = r[r6]();
			this.value = r[r3]();
			return this;
		}
	};
	
	//据点战--集结挑战结束
	a = o.FootholdGatherFightOverReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3451);
			w[w3](this.index);
			this.pos.encode(w);
			w[wy](this.typ);
			this.damage.encode(w);
			w[fm]();
		}
	};
	m = 3451;
	a[n] = m;
	
	a = o.FootholdGatherFightOverRsp = class {
		decode(r) {
			this.pos = new o.FootholdPos().decode(r);
			this.energy = r[r3]();
			this.baseExp = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			this.newHPs = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.newHPs[i] = new o.FootholdGatherFightValue().decode(r);   
			}
			return this;
		}
	};
	m = 3451;
	a[n] = m;
	c[m] = a;
	
	//据点战--驻守发起(返回FootholdGuardBriefRsp）
	a = o.FootholdGuardInitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3452);
			this.pos.encode(w);
			w[fm]();
		}
	};
	m = 3452;
	a[n] = m;
	
	//据点战--驻守查看玩家
	a = o.FootholdGuardBriefReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3453);
			this.pos.encode(w);
			w[fm]();
		}
	};
	m = 3453;
	a[n] = m;
	
	a = o.FootholdGuardBriefRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.FootholdTeamBrief().decode(r);   
			}
			return this;
		}
	};
	m = 3453;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdGuardTeammate = class {
		constructor(d) {
			this.heroes = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.index);
			w[w6](this.id);
			w[ws](this.name);
			w[w3](this.hp);
			w[w3](this.vipExp);
			w[w1](this.heroes.length);
			for (var i = 0, len = this.heroes.length; i < len; i++) {
				this.heroes[i].encode(w);   
			}
		}
		decode(r) {
			this.index = r[ry]();
			this.id = r[r6]();
			this.name = r[rs]();
			this.hp = r[r3]();
			this.vipExp = r[r3]();
			this.heroes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroes[i] = new o.HeroBrief().decode(r);   
			}
			return this;
		}
	};
	
	//据点战--驻守查看队伍
	a = o.FootholdGuardTeamReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3454);
			this.pos.encode(w);
			w[wb](this.includeOwner);
			w[fm]();
		}
	};
	m = 3454;
	a[n] = m;
	
	a = o.FootholdGuardTeamRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.FootholdGuardTeammate().decode(r);   
			}
			return this;
		}
	};
	m = 3454;
	a[n] = m;
	c[m] = a;
	
	//据点战--驻守取消
	a = o.FootholdGuardCancelReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3455);
			this.pos.encode(w);
			w[fm]();
		}
	};
	m = 3455;
	a[n] = m;
	
	a = o.FootholdGuardCancelRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 3455;
	a[n] = m;
	c[m] = a;
	
	//据点战--驻守邀请
	a = o.FootholdGuardInviteReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3456);
			this.pos.encode(w);
			w[w6](this.targetId);
			w[fm]();
		}
	};
	m = 3456;
	a[n] = m;
	
	a = o.FootholdGuardInviteRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 3456;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdGuardInviter = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			this.pos.encode(w);
			w[w3](this.pointType);
			w[w3](this.teamNum);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.pos = new o.FootholdPos().decode(r);
			this.pointType = r[r3]();
			this.teamNum = r[r3]();
			return this;
		}
	};
	
	//据点战--驻守邀请者列表
	a = o.FootholdGuardInvitersReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3457);
			w[wy](this.type);
			w[fm]();
		}
	};
	m = 3457;
	a[n] = m;
	
	a = o.FootholdGuardInvitersRsp = class {
		decode(r) {
			this.num = r[r1]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.FootholdGuardInviter().decode(r);   
			}
			return this;
		}
	};
	m = 3457;
	a[n] = m;
	c[m] = a;
	
	//据点战--驻守拒绝邀请
	a = o.FootholdGuardRefuseReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3458);
			this.pos.encode(w);
			w[wb](this.all);
			w[fm]();
		}
	};
	m = 3458;
	a[n] = m;
	
	a = o.FootholdGuardRefuseRsp = class {
		decode(r) {
			this.pos = new o.FootholdPos().decode(r);
			this.all = r[rb]();
			return this;
		}
	};
	m = 3458;
	a[n] = m;
	c[m] = a;
	
	//据点战--驻守加入
	a = o.FootholdGuardJoinReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3459);
			this.pos.encode(w);
			w[w3](this.index);
			w[fm]();
		}
	};
	m = 3459;
	a[n] = m;
	
	a = o.FootholdGuardJoinRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 3459;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdRankPlayer = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w3](this.score);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.score = r[r3]();
			return this;
		}
	};
	
	//据点战--战斗次数排行榜
	a = o.FootholdFightRankReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3460);
			w[fm]();
		}
	};
	m = 3460;
	a[n] = m;
	
	a = o.FootholdFightRankRsp = class {
		decode(r) {
			this.rankList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rankList[i] = new o.FootholdRankPlayer().decode(r);   
			}
			this.rankMine = r[r3]();
			return this;
		}
	};
	m = 3460;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdCoopGuild = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.guildInfo.encode(w);
			w[w3](this.joinNum);
			w[w3](this.coopNum);
			w[w3](this.coopMax);
		}
		decode(r) {
			this.guildInfo = new o.LastRankGuild().decode(r);
			this.joinNum = r[r3]();
			this.coopNum = r[r3]();
			this.coopMax = r[r3]();
			return this;
		}
	};
	
	//据点战--协战公会信息
	a = o.FootholdCoopGuildListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3461);
			w[fm]();
		}
	};
	m = 3461;
	a[n] = m;
	
	a = o.FootholdCoopGuildListRsp = class {
		decode(r) {
			this.guildList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.guildList[i] = new o.FootholdCoopGuild().decode(r);   
			}
			return this;
		}
	};
	m = 3461;
	a[n] = m;
	c[m] = a;
	
	//据点战--协战玩家排名
	a = o.FootholdCoopRankListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3462);
			w[fm]();
		}
	};
	m = 3462;
	a[n] = m;
	
	a = o.FootholdCoopRankListRsp = class {
		decode(r) {
			this.rankList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rankList[i] = new o.FootholdCoopPlayer().decode(r);   
			}
			return this;
		}
	};
	m = 3462;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdCoopPlayer = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.roleBrief.encode(w);
			if (!this.guildBrief) {
				w[wb](false);
			} else {
				w[wb](true);
				this.guildBrief.encode(w);
			}
			w[wy](this.guildTitle);
			w[w3](this.score);
			w[w3](this.number);
		}
		decode(r) {
			this.roleBrief = new o.RoleBrief().decode(r);
			if (r[rb]()) {
				this.guildBrief = new o.GuildBrief().decode(r);
			}
			this.guildTitle = r[ry]();
			this.score = r[r3]();
			this.number = r[r3]();
			return this;
		}
	};
	
	//据点战--协战招募列表
	a = o.FootholdCoopPlayerListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3463);
			w[w3](this.index);
			w[w3](this.count);
			w[fm]();
		}
	};
	m = 3463;
	a[n] = m;
	
	a = o.FootholdCoopPlayerListRsp = class {
		decode(r) {
			this.pubTime = r[r3]();
			this.coopMax = r[r3]();
			this.index = r[r3]();
			this.total = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.FootholdCoopPlayer().decode(r);   
			}
			return this;
		}
	};
	m = 3463;
	a[n] = m;
	c[m] = a;
	
	//据点战--协战招募
	a = o.FootholdCoopInviteAskReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3464);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 3464;
	a[n] = m;
	
	a = o.FootholdCoopInviteAskRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			return this;
		}
	};
	m = 3464;
	a[n] = m;
	c[m] = a;
	
	//据点战--协战招募通知
	a = o.FootholdCoopInviteNoticeRsp = class {
		decode(r) {
			this.number = r[r3]();
			return this;
		}
	};
	m = 3465;
	a[n] = m;
	c[m] = a;
	
	//据点战--协战招募公会
	a = o.FootholdCoopInviteGuildsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3466);
			w[fm]();
		}
	};
	m = 3466;
	a[n] = m;
	
	a = o.FootholdCoopInviteGuildsRsp = class {
		decode(r) {
			this.guilds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.guilds[i] = new o.FootholdCoopGuild().decode(r);   
			}
			return this;
		}
	};
	m = 3466;
	a[n] = m;
	c[m] = a;
	
	//据点战--协战招募应答
	a = o.FootholdCoopInviteAnswerReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3467);
			w[w6](this.guildId);
			w[wb](this.agree);
			w[fm]();
		}
	};
	m = 3467;
	a[n] = m;
	
	a = o.FootholdCoopInviteAnswerRsp = class {
		decode(r) {
			this.guildId = r[r6]();
			this.agree = r[rb]();
			return this;
		}
	};
	m = 3467;
	a[n] = m;
	c[m] = a;
	
	//据点战--协战申请
	a = o.FootholdCoopApplyAskReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3468);
			w[w6](this.guildId);
			w[fm]();
		}
	};
	m = 3468;
	a[n] = m;
	
	a = o.FootholdCoopApplyAskRsp = class {
		decode(r) {
			this.guildId = r[r6]();
			this.autoJoin = r[rb]();
			return this;
		}
	};
	m = 3468;
	a[n] = m;
	c[m] = a;
	
	//据点战--协战申请通知
	a = o.FootholdCoopApplyNoticeRsp = class {
		decode(r) {
			this.number = r[r3]();
			return this;
		}
	};
	m = 3469;
	a[n] = m;
	c[m] = a;
	
	//据点战--协战申请玩家
	a = o.FootholdCoopApplyPlayersReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3470);
			w[fm]();
		}
	};
	m = 3470;
	a[n] = m;
	
	a = o.FootholdCoopApplyPlayersRsp = class {
		decode(r) {
			this.players = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.players[i] = new o.FootholdCoopPlayer().decode(r);   
			}
			return this;
		}
	};
	m = 3470;
	a[n] = m;
	c[m] = a;
	
	//据点战--协战申请应答
	a = o.FootholdCoopApplyAnswerReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3471);
			w[w6](this.playerId);
			w[wb](this.agree);
			w[fm]();
		}
	};
	m = 3471;
	a[n] = m;
	
	a = o.FootholdCoopApplyAnswerRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			this.agree = r[rb]();
			return this;
		}
	};
	m = 3471;
	a[n] = m;
	c[m] = a;
	
	//据点战--协战申请设置
	a = o.FootholdCoopApplySettingReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3472);
			w[w3](this.title);
			w[w3](this.power);
			w[w3](this.level);
			w[fm]();
		}
	};
	m = 3472;
	a[n] = m;
	
	a = o.FootholdCoopApplySettingRsp = class {
		decode(r) {
			this.title = r[r3]();
			this.power = r[r3]();
			this.level = r[r3]();
			return this;
		}
	};
	m = 3472;
	a[n] = m;
	c[m] = a;
	
	//据点战--协战参战人员列表
	a = o.FootholdCoopGuildMembersReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3473);
			w[w6](this.guildId);
			w[fm]();
		}
	};
	m = 3473;
	a[n] = m;
	
	a = o.FootholdCoopGuildMembersRsp = class {
		decode(r) {
			this.guildId = r[r6]();
			this.members = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.members[i] = new o.FootholdCoopPlayer().decode(r);   
			}
			return this;
		}
	};
	m = 3473;
	a[n] = m;
	c[m] = a;
	
	//据地战--协战发布招募
	a = o.FootholdCoopGuildPublishReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3474);
			w[fm]();
		}
	};
	m = 3474;
	a[n] = m;
	
	a = o.FootholdCoopGuildPublishRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 3474;
	a[n] = m;
	c[m] = a;
	
	a = o.FootholdPoint2 = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.pos.encode(w);
			w[wy](this.status);
            w[wui](this.statusEndtime);
			w[wy](this.playerIdx);
			w[wy](this.guildIdx);
            w[wui](this.bossHp);
			if (!this.gather) {
				w[wb](false);
			} else {
				w[wb](true);
				this.gather.encode(w);
			}
		}
		decode(r) {
			this.pos = new o.FootholdPos().decode(r);
			this.status = r[ry]();
			this.statusEndtime = r[rui]();
			this.playerIdx = r[ry]();
			this.guildIdx = r[ry]();
			this.bossHp = r[rui]();
			if (r[rb]()) {
				this.gather = new o.FootholdGather().decode(r);
			}
			return this;
		}
	};
	
	//据点战--进入地图2
	a = o.FootholdMapEnter2Rsp = class {
		decode(r) {
			this.mapId = r[r3]();
			this.mapType = r[r3]();
			this.rndSeed = r[r3]();
			if (r[rb]()) {
				this.fightingPos = new o.FootholdPos().decode(r);
			}
			this.guilds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.guilds[i] = new o.FootholdGuild().decode(r);   
			}
			this.players = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.players[i] = new o.FootholdPlayer().decode(r);   
			}
			this.points = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.points[i] = new o.FootholdPoint2().decode(r);   
			}
			this.towers = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.towers[i] = r[ry]();   
			}
			this.worldLevelIdx = r[r3]();
			return this;
		}
	};
	m = 3475;
	a[n] = m;
	c[m] = a;
	
	a = o.ActivityCaveTeam = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.index);
			w[w3](this.chapterId);
			w[w3](this.startTime);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
		}
		decode(r) {
			this.index = r[r3]();
			this.chapterId = r[r3]();
			this.startTime = r[r3]();
			this.heroIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroIds[i] = r[r3]();   
			}
			return this;
		}
	};
	
	a = o.ActivityCaveGift = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.giftId);
			w[w3](this.level);
		}
		decode(r) {
			this.giftId = r[r3]();
			this.level = r[r3]();
			return this;
		}
	};
	
	a = o.ActivityCaveExchange = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.exchangeId);
			w[w3](this.times);
		}
		decode(r) {
			this.exchangeId = r[r3]();
			this.times = r[r3]();
			return this;
		}
	};
	
	//矿洞大作战--查询矿洞信息
	a = o.ActivityCaveStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3501);
			w[fm]();
		}
	};
	m = 3501;
	a[n] = m;
	
	a = o.ActivityCaveStateRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.buyTeam = r[r3]();
			this.team = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.team[i] = new o.ActivityCaveTeam().decode(r);   
			}
			this.gift = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.gift[i] = new o.ActivityCaveGift().decode(r);   
			}
			this.exchange = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.exchange[i] = new o.ActivityCaveExchange().decode(r);   
			}
			return this;
		}
	};
	m = 3501;
	a[n] = m;
	c[m] = a;
	
	//矿洞大作战--进入关卡
	a = o.ActivityCaveEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3502);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 3502;
	a[n] = m;
	
	a = o.ActivityCaveEnterRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			return this;
		}
	};
	m = 3502;
	a[n] = m;
	c[m] = a;
	
	//矿洞大作战--退出关卡
	a = o.ActivityCaveExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3503);
			w[w3](this.stageId);
			w[wb](this.clear);
			w[fm]();
		}
	};
	m = 3503;
	a[n] = m;
	
	a = o.ActivityCaveExitRsp = class {
		decode(r) {
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3503;
	a[n] = m;
	c[m] = a;
	
	//矿洞大作战--点击天赋
	a = o.ActivityCaveGiftReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3504);
			w[w3](this.giftId);
			w[fm]();
		}
	};
	m = 3504;
	a[n] = m;
	
	a = o.ActivityCaveGiftRsp = class {
		decode(r) {
			this.giftId = r[r3]();
			this.level = r[r3]();
			return this;
		}
	};
	m = 3504;
	a[n] = m;
	c[m] = a;
	
	//矿洞大作战--重置天赋
	a = o.ActivityCaveResetGiftReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3505);
			w[w3](this.page);
			w[fm]();
		}
	};
	m = 3505;
	a[n] = m;
	
	a = o.ActivityCaveResetGiftRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 3505;
	a[n] = m;
	c[m] = a;
	
	//矿洞大作战--获取探索的品质
	a = o.ActivityCaveExploreColorReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3506);
			w[w3](this.chapterId);
			w[fm]();
		}
	};
	m = 3506;
	a[n] = m;
	
	a = o.ActivityCaveExploreColorRsp = class {
		decode(r) {
			this.colorId = r[ry]();
			this.groupIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.groupIds[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 3506;
	a[n] = m;
	c[m] = a;
	
	//矿洞大作战--开始探索
	a = o.ActivityCaveStartExploreReq = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3507);
			w[w3](this.chapterId);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
			w[fm]();
		}
	};
	m = 3507;
	a[n] = m;
	
	a = o.ActivityCaveStartExploreRsp = class {
		decode(r) {
			this.index = r[r3]();
			this.chapterId = r[r3]();
			this.startTime = r[r3]();
			this.heroIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroIds[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 3507;
	a[n] = m;
	c[m] = a;
	
	//矿洞大作战--结束探索
	a = o.ActivityCaveEndExploreReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3508);
			w[w3](this.chapterId);
			w[fm]();
		}
	};
	m = 3508;
	a[n] = m;
	
	a = o.ActivityCaveEndExploreRsp = class {
		decode(r) {
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3508;
	a[n] = m;
	c[m] = a;
	
	//矿洞大作战--兑换
	a = o.ActivityCaveExchangeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3509);
			w[w3](this.exchangeId);
			w[fm]();
		}
	};
	m = 3509;
	a[n] = m;
	
	a = o.ActivityCaveExchangeRsp = class {
		decode(r) {
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3509;
	a[n] = m;
	c[m] = a;
	
	//矿洞大作战--购买队列
	a = o.ActivityCaveBuyTeamReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3510);
			w[fm]();
		}
	};
	m = 3510;
	a[n] = m;
	
	a = o.ActivityCaveBuyTeamRsp = class {
		decode(r) {
			this.buyTeam = r[r3]();
			return this;
		}
	};
	m = 3510;
	a[n] = m;
	c[m] = a;
	
	//通行证--列表
	a = o.ActivityCavePassListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3511);
			w[fm]();
		}
	};
	m = 3511;
	a[n] = m;
	
	a = o.ActivityCavePassListRsp = class {
		decode(r) {
			this.bought = r[rb]();
			this.rewarded1 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded1[i] = r[ry]();   
			}
			this.rewarded2 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded2[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 3511;
	a[n] = m;
	c[m] = a;
	
	//通行证--领奖
	a = o.ActivityCavePassAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3512);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 3512;
	a[n] = m;
	
	a = o.ActivityCavePassAwardRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.rewarded1 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded1[i] = r[ry]();   
			}
			this.rewarded2 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded2[i] = r[ry]();   
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3512;
	a[n] = m;
	c[m] = a;
	
	//矿洞大作战--回退天赋
	a = o.ActivityCaveGiftBackReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3513);
			w[w3](this.giftId);
			w[fm]();
		}
	};
	m = 3513;
	a[n] = m;
	
	a = o.ActivityCaveGiftBackRsp = class {
		decode(r) {
			this.giftId = r[r3]();
			this.level = r[r3]();
			return this;
		}
	};
	m = 3513;
	a[n] = m;
	c[m] = a;
	
	a = o.BountyMission = class {
		constructor(d) {
			this.heroList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.missionId);
			w[w3](this.stageId);
			w[w3](this.endTime);
			w[w3](this.gemsNum);
			w[w3](this.minPower);
			w[w3](this.pubPower);
			w[ws](this.publisher);
			w[ws](this.committer);
			w[w1](this.heroList.length);
			for (var i = 0, len = this.heroList.length; i < len; i++) {
				this.heroList[i].encode(w);   
			}
		}
		decode(r) {
			this.missionId = r[r3]();
			this.stageId = r[r3]();
			this.endTime = r[r3]();
			this.gemsNum = r[r3]();
			this.minPower = r[r3]();
			this.pubPower = r[r3]();
			this.publisher = r[rs]();
			this.committer = r[rs]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroList[i] = new o.HeroBrief().decode(r);   
			}
			return this;
		}
	};
	
	//赏金--任务列表
	a = o.BountyListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3601);
			w[fm]();
		}
	};
	m = 3601;
	a[n] = m;
	
	a = o.BountyListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.BountyMission().decode(r);   
			}
			return this;
		}
	};
	m = 3601;
	a[n] = m;
	c[m] = a;
	
	//赏金--发布任务
	a = o.BountyPublishReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3602);
			w[w3](this.missionType);
			w[ws](this.notice);
			w[fm]();
		}
	};
	m = 3602;
	a[n] = m;
	
	a = o.BountyPublishRsp = class {
		decode(r) {
			this.missionId = r[r3]();
			return this;
		}
	};
	m = 3602;
	a[n] = m;
	c[m] = a;
	
	//赏金--我的求助
	a = o.BountyMineReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3603);
			w[fm]();
		}
	};
	m = 3603;
	a[n] = m;
	
	a = o.BountyMineRsp = class {
		decode(r) {
			this.missionId = r[r3]();
			this.missionType = r[r3]();
			this.stageId = r[r3]();
			this.endTime = r[r3]();
			this.notice = r[rs]();
			this.publishedFreeNum = r[r3]();
			this.finishedFreeNum = r[r3]();
			return this;
		}
	};
	m = 3603;
	a[n] = m;
	c[m] = a;
	
	//赏金--刷新英雄
	a = o.BountyRefreshReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3604);
			w[w3](this.missionId);
			w[fm]();
		}
	};
	m = 3604;
	a[n] = m;
	
	a = o.BountyRefreshRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 3604;
	a[n] = m;
	c[m] = a;
	
	//赏金--查询英雄
	a = o.BountyFightQueryReq = class {
		constructor(d) {
			this.heroTypeIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3605);
			w[w3](this.missionId);
			w[w1](this.heroTypeIds.length);
			for (var i = 0, len = this.heroTypeIds.length; i < len; i++) {
				w[w3](this.heroTypeIds[i]);   
			}
			w[wb](this.general);
			w[fm]();
		}
	};
	m = 3605;
	a[n] = m;
	
	a = o.BountyFightQueryRsp = class {
		decode(r) {
			this.missionId = r[r3]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroList[i] = new o.FightHero().decode(r);   
			}
			if (r[rb]()) {
				this.general = new o.FightGeneral().decode(r);
			}
			return this;
		}
	};
	m = 3605;
	a[n] = m;
	c[m] = a;
	
	//赏金--战斗开始
	a = o.BountyFightStartReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3606);
			w[w3](this.missionId);
			w[fm]();
		}
	};
	m = 3606;
	a[n] = m;
	
	a = o.BountyFightStartRsp = class {
		decode(r) {
			this.missionId = r[r3]();
			this.endTime = r[r3]();
			return this;
		}
	};
	m = 3606;
	a[n] = m;
	c[m] = a;
	
	//赏金--战斗结束
	a = o.BountyFightOverReq = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3607);
			w[w3](this.missionId);
			w[wb](this.clear);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
			w[w3](this.rndSeed);
			w[ws](this.actions);
			w[fm]();
		}
	};
	m = 3607;
	a[n] = m;
	
	a = o.BountyFightOverRsp = class {
		decode(r) {
			this.missionId = r[r3]();
			this.clear = r[rb]();
			this.invalid = r[rb]();
			return this;
		}
	};
	m = 3607;
	a[n] = m;
	c[m] = a;
	
	//赏金--任务完成
	a = o.BountyCompleteRsp = class {
		decode(r) {
			this.missionId = r[r3]();
			this.stageId = r[r3]();
			return this;
		}
	};
	m = 3608;
	a[n] = m;
	c[m] = a;
	
	//赏金--任务数量
	a = o.BountyListNumReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3609);
			w[fm]();
		}
	};
	m = 3609;
	a[n] = m;
	
	a = o.BountyListNumRsp = class {
		decode(r) {
			this.num = r[r3]();
			return this;
		}
	};
	m = 3609;
	a[n] = m;
	c[m] = a;
	
	a = o.StagePower = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.stageId);
			w[w3](this.minPower);
		}
		decode(r) {
			this.stageId = r[r3]();
			this.minPower = r[r3]();
			return this;
		}
	};
	
	//赏金--查看任务
	a = o.BountyQueryReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3610);
			w[w3](this.missionId);
			w[fm]();
		}
	};
	m = 3610;
	a[n] = m;
	
	a = o.BountyQueryRsp = class {
		decode(r) {
			this.mission = new o.BountyMission().decode(r);
			return this;
		}
	};
	m = 3610;
	a[n] = m;
	c[m] = a;
	
	//赏金--战斗回放
	a = o.BountyFightReplyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3611);
			w[w3](this.missionId);
			w[fm]();
		}
	};
	m = 3611;
	a[n] = m;
	
	a = o.BountyFightReplyRsp = class {
		decode(r) {
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroList[i] = new o.FightHero().decode(r);   
			}
			if (r[rb]()) {
				this.general = new o.FightGeneral().decode(r);
			}
			this.stageId = r[r3]();
			this.heroIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroIds[i] = r[r3]();   
			}
			this.randSeed = r[r3]();
			this.actions = r[rs]();
			return this;
		}
	};
	m = 3611;
	a[n] = m;
	c[m] = a;
	
	a = o.DoomsDayInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.subType);
			w[w3](this.stageId);
			w[wy](this.num);
		}
		decode(r) {
			this.subType = r[r3]();
			this.stageId = r[r3]();
			this.num = r[ry]();
			return this;
		}
	};
	
	//末日考验--列表
	a = o.DoomsDayListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3701);
			w[fm]();
		}
	};
	m = 3701;
	a[n] = m;
	
	a = o.DoomsDayListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.DoomsDayInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3701;
	a[n] = m;
	c[m] = a;
	
	//末日考验--进入
	a = o.DoomsDayEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3702);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 3702;
	a[n] = m;
	
	a = o.DoomsDayEnterRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			return this;
		}
	};
	m = 3702;
	a[n] = m;
	c[m] = a;
	
	//末日考验--退出
	a = o.DoomsDayExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3703);
			w[w3](this.stageId);
			w[wb](this.clear);
			w[fm]();
		}
	};
	m = 3703;
	a[n] = m;
	
	a = o.DoomsDayExitRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3703;
	a[n] = m;
	c[m] = a;
	
	//末日考验--扫荡指定关卡
	a = o.DoomsDayRaidsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3704);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 3704;
	a[n] = m;
	
	a = o.DoomsDayRaidsRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3704;
	a[n] = m;
	c[m] = a;
	
	//末日考验--一键扫荡
	a = o.DoomsDayQuickRaidsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3705);
			w[w3](this.subType);
			w[fm]();
		}
	};
	m = 3705;
	a[n] = m;
	
	a = o.DoomsDayQuickRaidsRsp = class {
		decode(r) {
			this.subType = r[r3]();
			this.stageId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3705;
	a[n] = m;
	c[m] = a;
	
	a = o.BattleArrayQuery = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.type);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
		}
		decode(r) {
			this.type = r[ry]();
			this.heroIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroIds[i] = r[r3]();   
			}
			return this;
		}
	};
	
	//战斗--查看阵容
	a = o.BattleArrayQueryReq = class {
		constructor(d) {
			this.types = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3801);
			w[w1](this.types.length);
			for (var i = 0, len = this.types.length; i < len; i++) {
				w[wy](this.types[i]);   
			}
			w[fm]();
		}
	};
	m = 3801;
	a[n] = m;
	
	a = o.BattleArrayQueryRsp = class {
		decode(r) {
			this.heroes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroes[i] = new o.BattleArrayQuery().decode(r);   
			}
			return this;
		}
	};
	m = 3801;
	a[n] = m;
	c[m] = a;
	
	//战斗--设置阵容
	a = o.BattleArraySetReq = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3802);
			w[wy](this.type);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
			w[fm]();
		}
	};
	m = 3802;
	a[n] = m;
	
	a = o.BattleArraySetRsp = class {
		decode(r) {
			this.type = r[ry]();
			this.heroIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroIds[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 3802;
	a[n] = m;
	c[m] = a;
	
	//战斗--一键下阵某个英雄，推送BattleArrayQueryRsp，只返回有改动的阵容
	a = o.BattleArrayOffReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3803);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 3803;
	a[n] = m;
	
	//武魂试炼--状态
	a = o.MartialSoulStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3901);
			w[fm]();
		}
	};
	m = 3901;
	a[n] = m;
	
	a = o.MartialSoulStateRsp = class {
		decode(r) {
			this.stageIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.stageIds[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 3901;
	a[n] = m;
	c[m] = a;
	
	//武魂试炼--进入战斗
	a = o.MartialSoulEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3902);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 3902;
	a[n] = m;
	
	a = o.MartialSoulEnterRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.minPower = r[r3]();
			return this;
		}
	};
	m = 3902;
	a[n] = m;
	c[m] = a;
	
	//武魂试炼--退出战斗
	a = o.MartialSoulExitReq = class {
		constructor(d) {
			this.heroes = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](3903);
			w[w3](this.stageId);
			w[wb](this.clear);
			w[w1](this.heroes.length);
			for (var i = 0, len = this.heroes.length; i < len; i++) {
				w[w3](this.heroes[i]);   
			}
			w[w3](this.rndseed);
			w[ws](this.actions);
			w[fm]();
		}
	};
	m = 3903;
	a[n] = m;
	
	a = o.MartialSoulExitRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.stageIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.stageIds[i] = r[r3]();   
			}
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 3903;
	a[n] = m;
	c[m] = a;
	
	a = o.ExcitingActivityUpgrade = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.taskId);
			w[w3](this.limit);
		}
		decode(r) {
			this.taskId = r[r3]();
			this.limit = r[r3]();
			return this;
		}
	};
	
	a = o.ExcitingActivityProgress = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.round);
			w[w3](this.type);
			w[w3](this.arg);
			w[w3](this.num);
		}
		decode(r) {
			this.round = r[ry]();
			this.type = r[r3]();
			this.arg = r[r3]();
			this.num = r[r3]();
			return this;
		}
	};
	
	a = o.ExcitingActivity = class {
		constructor(d) {
			this.rewards = [];
			this.progress = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.type);
			w[w1](this.rewards.length);
			for (var i = 0, len = this.rewards.length; i < len; i++) {
				w[wy](this.rewards[i]);   
			}
			w[w1](this.progress.length);
			for (var i = 0, len = this.progress.length; i < len; i++) {
				this.progress[i].encode(w);   
			}
		}
		decode(r) {
			this.type = r[ry]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = r[ry]();   
			}
			this.progress = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.progress[i] = new o.ExcitingActivityProgress().decode(r);   
			}
			return this;
		}
	};
	
	// 精彩活动--状态
	a = o.ExcitingActivityStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4001);
			w[fm]();
		}
	};
	m = 4001;
	a[n] = m;
	
	a = o.ExcitingActivityStateRsp = class {
		decode(r) {
			this.state = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.state[i] = new o.ExcitingActivity().decode(r);   
			}
			this.limit = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.limit[i] = new o.ExcitingActivityUpgrade().decode(r);   
			}
			this.cycle = r[ry]();
			this.starGiftRound = r[ry]();
			this.starGiftRewardType = r[ry]();
			return this;
		}
	};
	m = 4001;
	a[n] = m;
	c[m] = a;
	
	// 精彩活动--领取奖励
	a = o.ExcitingActivityRewardsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4002);
			w[wy](this.type);
			w[w3](this.taskId);
			w[fm]();
		}
	};
	m = 4002;
	a[n] = m;
	
	a = o.ExcitingActivityRewardsRsp = class {
		decode(r) {
			this.type = r[ry]();
			this.taskId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4002;
	a[n] = m;
	c[m] = a;
	
	// 精彩活动--同步进度信息
	a = o.ExcitingActivityProgressRsp = class {
		decode(r) {
			this.type = r[ry]();
			this.progress = new o.ExcitingActivityProgress().decode(r);
			return this;
		}
	};
	m = 4003;
	a[n] = m;
	c[m] = a;
	
	// 精彩活动--同步奖励剩余信息
	a = o.ExcitingActivityUpgradeLimitRsp = class {
		decode(r) {
			this.limit = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.limit[i] = new o.ExcitingActivityUpgrade().decode(r);   
			}
			return this;
		}
	};
	m = 4004;
	a[n] = m;
	c[m] = a;
	
	//基因--召唤
	a = o.GeneDrawReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4101);
			w[w3](this.geneId);
			w[fm]();
		}
	};
	m = 4101;
	a[n] = m;
	
	a = o.GeneDrawRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4101;
	a[n] = m;
	c[m] = a;
	
	//基因--转换
	a = o.GeneTransReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4102);
			w[w3](this.oldHeroId);
			w[fm]();
		}
	};
	m = 4102;
	a[n] = m;
	
	a = o.GeneTransRsp = class {
		decode(r) {
			this.newHeroId = r[r3]();
			return this;
		}
	};
	m = 4102;
	a[n] = m;
	c[m] = a;
	
	//基因--确定转换
	a = o.GeneTransConfirmReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4103);
			w[wb](this.confirm);
			w[fm]();
		}
	};
	m = 4103;
	a[n] = m;
	
	a = o.GeneTransConfirmRsp = class {
		decode(r) {
			this.hero = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.hero[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4103;
	a[n] = m;
	c[m] = a;
	
	//基因--兑换碎片
	a = o.GeneStoreReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4104);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 4104;
	a[n] = m;
	
	a = o.GeneStoreRsp = class {
		decode(r) {
			this.heroChip = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroChip[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4104;
	a[n] = m;
	c[m] = a;
	
	a = o.GeneDrawHistory = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[ws](this.playerName);
			w[w3](this.heroId);
		}
		decode(r) {
			this.playerName = r[rs]();
			this.heroId = r[r3]();
			return this;
		}
	};
	
	//基因--召唤出4星历史
	a = o.GeneDrawHistoryReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4105);
			w[fm]();
		}
	};
	m = 4105;
	a[n] = m;
	
	a = o.GeneDrawHistoryRsp = class {
		decode(r) {
			this.drawHistory = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.drawHistory[i] = new o.GeneDrawHistory().decode(r);   
			}
			return this;
		}
	};
	m = 4105;
	a[n] = m;
	c[m] = a;
	
	a = o.TurntableRecord = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[ws](this.playerName);
			w[w3](this.itemType);
		}
		decode(r) {
			this.playerName = r[rs]();
			this.itemType = r[r3]();
			return this;
		}
	};
	
	a = o.TurntableItem = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.itemType);
			w[w3](this.itemNum);
			w[wb](this.fetched);
		}
		decode(r) {
			this.itemType = r[r3]();
			this.itemNum = r[r3]();
			this.fetched = r[rb]();
			return this;
		}
	};
	
	//探宝--列表
	a = o.TurntableListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4201);
			w[wy](this.type);
			w[fm]();
		}
	};
	m = 4201;
	a[n] = m;
	
	a = o.TurntableListRsp = class {
		decode(r) {
			this.type = r[ry]();
			this.itemList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.itemList[i] = new o.TurntableItem().decode(r);   
			}
			this.refreshTime = r[r3]();
			this.refreshChance = r[r3]();
			this.drawRecords = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.drawRecords[i] = new o.TurntableRecord().decode(r);   
			}
			return this;
		}
	};
	m = 4201;
	a[n] = m;
	c[m] = a;
	
	//探宝--刷新
	a = o.TurntableRefreshReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4202);
			w[wy](this.type);
			w[fm]();
		}
	};
	m = 4202;
	a[n] = m;
	
	a = o.TurntableRefreshRsp = class {
		decode(r) {
			this.type = r[ry]();
			this.itemList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.itemList[i] = new o.TurntableItem().decode(r);   
			}
			this.refreshTime = r[r3]();
			this.refreshChance = r[r3]();
			return this;
		}
	};
	m = 4202;
	a[n] = m;
	c[m] = a;
	
	//探宝--抽奖
	a = o.TurntableDrawReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4203);
			w[wy](this.type);
			w[w3](this.num);
			w[fm]();
		}
	};
	m = 4203;
	a[n] = m;
	
	a = o.TurntableDrawRsp = class {
		decode(r) {
			this.type = r[ry]();
			this.itemList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.itemList[i] = new o.TurntableItem().decode(r);   
			}
			this.refreshTime = r[r3]();
			this.refreshChance = r[r3]();
			this.drawRecords = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.drawRecords[i] = new o.TurntableRecord().decode(r);   
			}
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4203;
	a[n] = m;
	c[m] = a;
	
	a = o.GuildBossRank = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w6](this.blood);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.blood = r[r6]();
			return this;
		}
	};
	
	//公会boss--状态
	a = o.GuildBossStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4301);
			w[fm]();
		}
	};
	m = 4301;
	a[n] = m;
	
	a = o.GuildBossStateRsp = class {
		decode(r) {
			this.openTime = r[r3]();
			this.bossType = r[ry]();
			this.bossLevel = r[ry]();
			this.bossBlood = r[r6]();
			this.rewardFlag = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewardFlag[i] = r[ry]();   
			}
			this.top3 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.top3[i] = new o.GuildBossRank().decode(r);   
			}
			this.enter = r[ry]();
			this.bossPoint = r[r3]();
			this.maxBlood = r[r6]();
			return this;
		}
	};
	m = 4301;
	a[n] = m;
	c[m] = a;
	
	//公会boss--开启活动
	a = o.GuildBossOpenReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4302);
			w[fm]();
		}
	};
	m = 4302;
	a[n] = m;
	
	//公会boss--开启活动广播信息给会员，会员签到同步积分信息给会长
	a = o.GuildBossOpenRsp = class {
		decode(r) {
			this.openTime = r[r3]();
			this.bossPoint = r[r3]();
			return this;
		}
	};
	m = 4302;
	a[n] = m;
	c[m] = a;
	
	//公会boss--排行榜
	a = o.GuildBossRankReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4303);
			w[fm]();
		}
	};
	m = 4303;
	a[n] = m;
	
	a = o.GuildBossRankRsp = class {
		decode(r) {
			this.rank = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rank[i] = new o.GuildBossRank().decode(r);   
			}
			return this;
		}
	};
	m = 4303;
	a[n] = m;
	c[m] = a;
	
	//公会boss--开始挑战
	a = o.GuildBossEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4304);
			w[fm]();
		}
	};
	m = 4304;
	a[n] = m;
	
	a = o.GuildBossEnterRsp = class {
		decode(r) {
			this.enter = r[ry]();
			return this;
		}
	};
	m = 4304;
	a[n] = m;
	c[m] = a;
	
	//公会boss--挑战结束
	a = o.GuildBossExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4305);
			w[w6](this.blood);
			w[fm]();
		}
	};
	m = 4305;
	a[n] = m;
	
	a = o.GuildBossExitRsp = class {
		decode(r) {
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4305;
	a[n] = m;
	c[m] = a;
	
	//公会boss--领取百分比奖励
	a = o.GuildBossRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4306);
			w[wy](this.rewardFlag);
			w[fm]();
		}
	};
	m = 4306;
	a[n] = m;
	
	a = o.GuildBossRewardRsp = class {
		decode(r) {
			this.rewardFlag = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewardFlag[i] = r[ry]();   
			}
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4306;
	a[n] = m;
	c[m] = a;
	
	//公会boss--同步boss信息
	a = o.GuildBossNoticeRsp = class {
		decode(r) {
			this.bossBlood = r[r6]();
			this.top3 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.top3[i] = new o.GuildBossRank().decode(r);   
			}
			return this;
		}
	};
	m = 4307;
	a[n] = m;
	c[m] = a;
	
	//公会boss--扫荡
	a = o.GuildBossRaidsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4308);
			w[fm]();
		}
	};
	m = 4308;
	a[n] = m;
	
	a = o.GuildBossRaidsRsp = class {
		decode(r) {
			this.enter = r[ry]();
			this.blood = r[r6]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4308;
	a[n] = m;
	c[m] = a;
	
	a = o.RuneInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.num);
			w[w3](this.heroId);
		}
		decode(r) {
			this.id = r[r3]();
			this.num = r[r3]();
			this.heroId = r[r3]();
			return this;
		}
	};
	
	//符文--列表
	a = o.RuneListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4401);
			w[fm]();
		}
	};
	m = 4401;
	a[n] = m;
	
	a = o.RuneListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RuneInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4401;
	a[n] = m;
	c[m] = a;
	
	//符文--分解
	a = o.RuneDisintReq = class {
		constructor(d) {
			this.runes = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4402);
			w[w3](this.heroId);
			w[w1](this.runes.length);
			for (var i = 0, len = this.runes.length; i < len; i++) {
				this.runes[i].encode(w);   
			}
			w[fm]();
		}
	};
	m = 4402;
	a[n] = m;
	
	a = o.RuneDisintRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.runes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.runes[i] = new o.RuneInfo().decode(r);   
			}
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4402;
	a[n] = m;
	c[m] = a;
	
	//符文--合成
	a = o.RuneComposeReq = class {
		constructor(d) {
			this.list = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4403);
			w[w3](this.heroId);
			w[w3](this.runeId);
			w[w1](this.list.length);
			for (var i = 0, len = this.list.length; i < len; i++) {
				this.list[i].encode(w);   
			}
			w[fm]();
		}
	};
	m = 4403;
	a[n] = m;
	
	a = o.RuneComposeRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.runeId = r[r3]();
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4403;
	a[n] = m;
	c[m] = a;
	
	//符文--穿戴，卸下，更换
	a = o.RuneOnReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4404);
			w[w3](this.heroId);
			w[wy](this.index);
			w[w3](this.runeId);
			w[fm]();
		}
	};
	m = 4404;
	a[n] = m;
	
	// 强化、分解英雄身上的符文会推送这个协议
	a = o.RuneOnRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.runes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.runes[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 4404;
	a[n] = m;
	c[m] = a;
	
	a = o.RuneUpdateRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RuneInfo().decode(r);   
			}
			this.deleteList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.deleteList[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 4405;
	a[n] = m;
	c[m] = a;
	
	//符文--强化
	a = o.RuneUpgradeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4406);
			w[w3](this.heroId);
			w[w3](this.runeId);
			w[wb](this.top);
			w[fm]();
		}
	};
	m = 4406;
	a[n] = m;
	
	a = o.RuneUpgradeRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.bRuneId = r[r3]();
			this.aRuneId = r[r3]();
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4406;
	a[n] = m;
	c[m] = a;
	
	//符文--融合
	a = o.RuneMixReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4407);
			w[w3](this.heroId);
			w[w3](this.mainRuneId);
			w[w3](this.subRuneId);
			w[fm]();
		}
	};
	m = 4407;
	a[n] = m;
	
	a = o.RuneMixRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.runeId = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4407;
	a[n] = m;
	c[m] = a;
	
	//符文--洗练
	a = o.RuneWashReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4408);
			w[w3](this.heroId);
			w[w3](this.runeId);
			w[w3](this.index);
			w[wy](this.tp);
			w[fm]();
		}
	};
	m = 4408;
	a[n] = m;
	
	a = o.RuneWashRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.oldRuneId = r[r3]();
			this.newRuneId = r[r3]();
			this.tp = r[ry]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4408;
	a[n] = m;
	c[m] = a;
	
	a = o.RuneBless = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.index);
			w[w3](this.heroId);
			w[w3](this.runeId);
			w[w3](this.bless);
		}
		decode(r) {
			this.index = r[r3]();
			this.heroId = r[r3]();
			this.runeId = r[r3]();
			this.bless = r[r3]();
			return this;
		}
	};
	
	//符文--洗练祝福值查询
	a = o.RuneBlessInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4409);
			w[fm]();
		}
	};
	m = 4409;
	a[n] = m;
	
	a = o.RuneBlessInfoRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RuneBless().decode(r);   
			}
			return this;
		}
	};
	m = 4409;
	a[n] = m;
	c[m] = a;
	
	a = o.FlipGoods = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.index);
			this.goods.encode(w);
		}
		decode(r) {
			this.index = r[ry]();
			this.goods = new o.GoodsInfo().decode(r);
			return this;
		}
	};
	
	//翻牌--信息
	a = o.FlipCardInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4501);
			w[fm]();
		}
	};
	m = 4501;
	a[n] = m;
	
	a = o.FlipCardInfoRsp = class {
		decode(r) {
			this.turnId = r[r3]();
			this.diamondTimes = r[r3]();
			this.sPRewardId = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.sPRewardId[i] = r[r3]();   
			}
			this.flippedRewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.flippedRewards[i] = new o.FlipGoods().decode(r);   
			}
			return this;
		}
	};
	m = 4501;
	a[n] = m;
	c[m] = a;
	
	//翻牌--选择特殊奖励
	a = o.FlipCardSPRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4502);
			w[w3](this.spRewardId);
			w[fm]();
		}
	};
	m = 4502;
	a[n] = m;
	
	a = o.FlipCardSPRewardRsp = class {
		decode(r) {
			this.spRewardId = r[r3]();
			return this;
		}
	};
	m = 4502;
	a[n] = m;
	c[m] = a;
	
	//翻牌--抽奖
	a = o.FlipCardRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4503);
			w[wy](this.index);
			w[fm]();
		}
	};
	m = 4503;
	a[n] = m;
	
	a = o.FlipCardRewardRsp = class {
		decode(r) {
			this.index = r[ry]();
			this.itemId = r[r3]();
			this.reward = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.reward[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4503;
	a[n] = m;
	c[m] = a;
	
	//翻牌--下一轮
	a = o.FlipCardNextTurnReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4504);
			w[fm]();
		}
	};
	m = 4504;
	a[n] = m;
	
	a = o.FlipCardNextTurnRsp = class {
		decode(r) {
			this.nextTurnId = r[r3]();
			return this;
		}
	};
	m = 4504;
	a[n] = m;
	c[m] = a;
	
	//扭蛋--信息
	a = o.DrawEggInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4601);
			w[fm]();
		}
	};
	m = 4601;
	a[n] = m;
	
	a = o.DrawEggInfoRsp = class {
		decode(r) {
			this.isFirstDraw = r[rb]();
			this.sPWishId = r[r3]();
			this.diamondRemain = r[r3]();
			this.guaranteeRemain = r[r3]();
			return this;
		}
	};
	m = 4601;
	a[n] = m;
	c[m] = a;
	
	//扭蛋--抽奖
	a = o.DrawEggAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4602);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 4602;
	a[n] = m;
	
	a = o.DrawEggAwardRsp = class {
		decode(r) {
			this.reward = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.reward[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4602;
	a[n] = m;
	c[m] = a;
	
	//扭蛋--设置特殊奖励
	a = o.DrawEggSPRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4603);
			w[w3](this.sPRewardId);
			w[fm]();
		}
	};
	m = 4603;
	a[n] = m;
	
	a = o.DrawEggSPRewardRsp = class {
		decode(r) {
			this.sPRewardId = r[r3]();
			this.sPRewardGuarantee = r[r3]();
			return this;
		}
	};
	m = 4603;
	a[n] = m;
	c[m] = a;
	
	a = o.AdventureHero = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.type);
			w[w3](this.heroId);
			w[w3](this.group);
			w[w3](this.typeId);
			w[wy](this.useTimes);
		}
		decode(r) {
			this.type = r[ry]();
			this.heroId = r[r3]();
			this.group = r[r3]();
			this.typeId = r[r3]();
			this.useTimes = r[ry]();
			return this;
		}
	};
	
	a = o.AdventureEntry = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.group);
			w[w3](this.id);
		}
		decode(r) {
			this.group = r[r3]();
			this.id = r[r3]();
			return this;
		}
	};
	
	//奇境探险--进度
	a = o.AdventureStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4701);
			w[fm]();
		}
	};
	m = 4701;
	a[n] = m;
	
	a = o.AdventureStateRsp = class {
		decode(r) {
			this.blood = r[ry]();
			this.difficulty = r[ry]();
			this.layerId = r[ry]();
			this.plateIndex = r[r3]();
			this.plateFinish = r[rb]();
			this.consumption = r[ry]();
			this.giveHeros = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.giveHeros[i] = new o.AdventureHero().decode(r);   
			}
			this.entryList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.entryList[i] = new o.AdventureEntry().decode(r);   
			}
			this.avgPower = r[r3]();
			this.avgLevel = r[r3]();
			this.clearTimes = r[ry]();
			this.lastPlate = r[r3]();
			this.historyPlate = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.historyPlate[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 4701;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--回复生命值
	a = o.AdventureConsumptionReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4702);
			w[fm]();
		}
	};
	m = 4702;
	a[n] = m;
	
	a = o.AdventureConsumptionRsp = class {
		decode(r) {
			this.blood = r[ry]();
			this.consumption = r[ry]();
			return this;
		}
	};
	m = 4702;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--选中板块，不能再选同一行的其他板块，关卡、旅人商店事件使用
	a = o.AdventurePlateEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4703);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 4703;
	a[n] = m;
	
	a = o.AdventurePlateEnterRsp = class {
		decode(r) {
			this.plateIndex = r[r3]();
			return this;
		}
	};
	m = 4703;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--进入关卡战斗
	a = o.AdventureEnterReq = class {
		constructor(d) {
			this.giveHeros = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4704);
			w[w3](this.plateIndex);
			w[w1](this.giveHeros.length);
			for (var i = 0, len = this.giveHeros.length; i < len; i++) {
				w[w3](this.giveHeros[i]);   
			}
			w[fm]();
		}
	};
	m = 4704;
	a[n] = m;
	
	a = o.AdventureEnterRsp = class {
		decode(r) {
			this.plateIndex = r[r3]();
			this.giveHeros = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.giveHeros[i] = new o.AdventureHero().decode(r);   
			}
			this.group = r[r3]();
			this.fightState = r[rs]();
			return this;
		}
	};
	m = 4704;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--退出关卡战斗
	a = o.AdventureExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4705);
			w[wy](this.blood);
			w[w3](this.plateIndex);
			w[w3](this.group);
			w[ws](this.fightState);
			w[fm]();
		}
	};
	m = 4705;
	a[n] = m;
	
	a = o.AdventureExitRsp = class {
		decode(r) {
			this.blood = r[ry]();
			this.plateIndex = r[r3]();
			this.rankBf = r[r3]();
			this.rankAf = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4705;
	a[n] = m;
	c[m] = a;
	
	a = o.AdventureTrave = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[wy](this.times);
		}
		decode(r) {
			this.id = r[r3]();
			this.times = r[ry]();
			return this;
		}
	};
	
	//奇境探险--板块事件--旅行商人商品列表
	a = o.AdventureTravelListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4706);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 4706;
	a[n] = m;
	
	a = o.AdventureTravelListRsp = class {
		decode(r) {
			this.plateIndex = r[r3]();
			this.travelIndex = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.travelIndex[i] = new o.AdventureTrave().decode(r);   
			}
			return this;
		}
	};
	m = 4706;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--旅行商人购买
	a = o.AdventureTravelBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4707);
			w[w3](this.plateIndex);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 4707;
	a[n] = m;
	
	a = o.AdventureTravelBuyRsp = class {
		decode(r) {
			this.plateIndex = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4707;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--旅行商人完成事件
	a = o.AdventureTravelFinishReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4708);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 4708;
	a[n] = m;
	
	a = o.AdventureTravelFinishRsp = class {
		decode(r) {
			this.plateIndex = r[r3]();
			return this;
		}
	};
	m = 4708;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--佣兵列表
	a = o.AdventureMercenaryListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4709);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 4709;
	a[n] = m;
	
	a = o.AdventureMercenaryListRsp = class {
		decode(r) {
			this.plateIndex = r[r3]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroList[i] = new o.AdventureHero().decode(r);   
			}
			return this;
		}
	};
	m = 4709;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--选择佣兵
	a = o.AdventureMercenaryReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4710);
			w[w3](this.plateIndex);
			w[w3](this.group);
			w[w3](this.typeId);
			w[fm]();
		}
	};
	m = 4710;
	a[n] = m;
	
	a = o.AdventureMercenaryRsp = class {
		decode(r) {
			this.plateIndex = r[r3]();
			this.giveHeros = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.giveHeros[i] = new o.AdventureHero().decode(r);   
			}
			return this;
		}
	};
	m = 4710;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--增益遗物列表
	a = o.AdventureEntryListReq = class {
		constructor(d) {
			this.giveHeros = [];
			this.heros = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4711);
			w[w3](this.plateIndex);
			w[w1](this.giveHeros.length);
			for (var i = 0, len = this.giveHeros.length; i < len; i++) {
				w[w3](this.giveHeros[i]);   
			}
			w[w1](this.heros.length);
			for (var i = 0, len = this.heros.length; i < len; i++) {
				w[w3](this.heros[i]);   
			}
			w[fm]();
		}
	};
	m = 4711;
	a[n] = m;
	
	a = o.AdventureEntryListRsp = class {
		decode(r) {
			this.plateIndex = r[r3]();
			this.entryList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.entryList[i] = new o.AdventureEntry().decode(r);   
			}
			return this;
		}
	};
	m = 4711;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--增益遗物选择
	a = o.AdventureEntrySelectReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4712);
			w[w3](this.plateIndex);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 4712;
	a[n] = m;
	
	a = o.AdventureEntrySelectRsp = class {
		decode(r) {
			this.plateIndex = r[r3]();
			this.entryList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.entryList[i] = new o.AdventureEntry().decode(r);   
			}
			return this;
		}
	};
	m = 4712;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--回复能量
	a = o.AdventureConsumptionEventReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4713);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 4713;
	a[n] = m;
	
	a = o.AdventureConsumptionEventRsp = class {
		decode(r) {
			this.plateIndex = r[r3]();
			this.blood = r[ry]();
			return this;
		}
	};
	m = 4713;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--宝藏,广播协议使用SystemBroadcastRsp协议
	a = o.AdventureTreasureReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4714);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 4714;
	a[n] = m;
	
	a = o.AdventureTreasureRsp = class {
		decode(r) {
			this.plateIndex = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4714;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--进入下一层/下一难度
	a = o.AdventureNextReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4715);
			w[fm]();
		}
	};
	m = 4715;
	a[n] = m;
	
	a = o.AdventureNextRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 4715;
	a[n] = m;
	c[m] = a;
	
	a = o.AdventureRankBrief = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w3](this.value);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.value = r[r3]();
			return this;
		}
	};
	
	//奇境探险--排行榜
	a = o.AdventureRankListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4716);
			w[fm]();
		}
	};
	m = 4716;
	a[n] = m;
	
	a = o.AdventureRankListRsp = class {
		decode(r) {
			this.serverNum = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.AdventureRankBrief().decode(r);   
			}
			return this;
		}
	};
	m = 4716;
	a[n] = m;
	c[m] = a;
	
	a = o.AdventureStoreItem = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.remain);
		}
		decode(r) {
			this.id = r[r3]();
			this.remain = r[r3]();
			return this;
		}
	};
	
	//探险商店--列表
	a = o.AdventureStoreListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4717);
			w[fm]();
		}
	};
	m = 4717;
	a[n] = m;
	
	a = o.AdventureStoreListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.AdventureStoreItem().decode(r);   
			}
			return this;
		}
	};
	m = 4717;
	a[n] = m;
	c[m] = a;
	
	//探险商店--购买
	a = o.AdventureStoreBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4718);
			w[w3](this.storeId);
			w[w3](this.num);
			w[fm]();
		}
	};
	m = 4718;
	a[n] = m;
	
	a = o.AdventureStoreBuyRsp = class {
		decode(r) {
			this.storeItem = new o.AdventureStoreItem().decode(r);
			this.items = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.items[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4718;
	a[n] = m;
	c[m] = a;
	
	//探险证任务--列表
	a = o.AdventurePassListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4719);
			w[fm]();
		}
	};
	m = 4719;
	a[n] = m;
	
	a = o.AdventurePassListRsp = class {
		decode(r) {
			this.bought = r[rb]();
			this.rewarded1 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded1[i] = r[ry]();   
			}
			this.rewarded2 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded2[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 4719;
	a[n] = m;
	c[m] = a;
	
	//探险任务--领奖
	a = o.AdventurePassAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4720);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 4720;
	a[n] = m;
	
	a = o.AdventurePassAwardRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.rewarded1 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded1[i] = r[ry]();   
			}
			this.rewarded2 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded2[i] = r[ry]();   
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4720;
	a[n] = m;
	c[m] = a;
	
	a = o.ChampionPlayer = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w3](this.points);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.points = r[r3]();
			return this;
		}
	};
	
	a = o.ChampionExchange = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.num);
		}
		decode(r) {
			this.id = r[r3]();
			this.num = r[r3]();
			return this;
		}
	};
	
	//锦标赛--红点信息
	a = o.ChampionRedPointsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4801);
			w[fm]();
		}
	};
	m = 4801;
	a[n] = m;
	
	a = o.ChampionRedPointsRsp = class {
		decode(r) {
			this.points = r[r3]();
			this.score = r[r3]();
			this.seasonId = r[r3]();
			this.lvRewarded = r[r3]();
			this.rankRewarded = r[rb]();
			this.level = r[r3]();
			this.exchanged = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.exchanged[i] = new o.ChampionExchange().decode(r);   
			}
			return this;
		}
	};
	m = 4801;
	a[n] = m;
	c[m] = a;
	
	//锦标赛--基础信息
	a = o.ChampionInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4802);
			w[fm]();
		}
	};
	m = 4802;
	a[n] = m;
	
	a = o.ChampionInfoRsp = class {
		decode(r) {
			this.legends = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.legends[i] = new o.ChampionPlayer().decode(r);   
			}
			this.points = r[r3]();
			this.score = r[r3]();
			this.seasonId = r[r3]();
			this.lvRewarded = r[r3]();
			this.rankRewarded = r[rb]();
			this.level = r[r3]();
			this.boughtFightNum = r[r3]();
			this.freeFightNum = r[r3]();
			this.exchanged = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.exchanged[i] = new o.ChampionExchange().decode(r);   
			}
			this.freeRecoverTime = r[r3]();
			this.reMatch = r[r3]();
			return this;
		}
	};
	m = 4802;
	a[n] = m;
	c[m] = a;
	
	//锦标赛--匹配对手
	a = o.ChampionMatchReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4803);
			w[fm]();
		}
	};
	m = 4803;
	a[n] = m;
	
	a = o.ChampionMatchRsp = class {
		decode(r) {
			this.opponent = new o.ChampionPlayer().decode(r);
			this.addPoints = r[r3]();
			this.reMatch = r[r3]();
			return this;
		}
	};
	m = 4803;
	a[n] = m;
	c[m] = a;
	
	//锦标赛--战斗开始
	a = o.ChampionFightStartReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4804);
			w[fm]();
		}
	};
	m = 4804;
	a[n] = m;
	
	a = o.ChampionFightStartRsp = class {
		decode(r) {
			this.opponentId = r[r6]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				if (r[rb]()) {
					this.heroList[i] = new o.FightHero().decode(r);
				}   
			}
			if (r[rb]()) {
				this.general = new o.FightGeneral().decode(r);
			}
			return this;
		}
	};
	m = 4804;
	a[n] = m;
	c[m] = a;
	
	//锦标赛--战斗结束
	a = o.ChampionFightOverReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4805);
			w[wb](this.isWin);
			w[fm]();
		}
	};
	m = 4805;
	a[n] = m;
	
	a = o.ChampionFightOverRsp = class {
		decode(r) {
			this.newPoints1 = r[r3]();
			this.newRankLv1 = r[r3]();
			this.addPoints1 = r[r3]();
			this.addPoints2 = r[r3]();
			this.reMatch = r[r3]();
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4805;
	a[n] = m;
	c[m] = a;
	
	a = o.ChampionRecord = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.time);
			w[wb](this.isAtk);
			w[wb](this.isWin);
			w[w3](this.newPoints);
			w[w3](this.addPoints);
			this.opponent.encode(w);
		}
		decode(r) {
			this.time = r[r3]();
			this.isAtk = r[rb]();
			this.isWin = r[rb]();
			this.newPoints = r[r3]();
			this.addPoints = r[r3]();
			this.opponent = new o.RoleBrief().decode(r);
			return this;
		}
	};
	
	//锦标赛--战斗记录
	a = o.ChampionRecordsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4806);
			w[fm]();
		}
	};
	m = 4806;
	a[n] = m;
	
	a = o.ChampionRecordsRsp = class {
		decode(r) {
			this.records = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.records[i] = new o.ChampionRecord().decode(r);   
			}
			return this;
		}
	};
	m = 4806;
	a[n] = m;
	c[m] = a;
	
	//锦标赛--排行榜
	a = o.ChampionRankingReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4807);
			w[fm]();
		}
	};
	m = 4807;
	a[n] = m;
	
	a = o.ChampionRankingRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.ChampionPlayer().decode(r);   
			}
			this.playerRank = r[r3]();
			this.playerPoints = r[r3]();
			return this;
		}
	};
	m = 4807;
	a[n] = m;
	c[m] = a;
	
	//锦标赛--领取积分
	a = o.ChampionFetchScoreReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4808);
			w[fm]();
		}
	};
	m = 4808;
	a[n] = m;
	
	a = o.ChampionFetchScoreRsp = class {
		decode(r) {
			this.fetchScore = r[r3]();
			this.newScore = r[r3]();
			this.newPoints = r[r3]();
			return this;
		}
	};
	m = 4808;
	a[n] = m;
	c[m] = a;
	
	//锦标赛--积分兑换
	a = o.ChampionExchangeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4809);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 4809;
	a[n] = m;
	
	a = o.ChampionExchangeRsp = class {
		decode(r) {
			this.exchanged = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.exchanged[i] = new o.ChampionExchange().decode(r);   
			}
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4809;
	a[n] = m;
	c[m] = a;
	
	//锦标赛--段位奖励
	a = o.ChampionLvRewardsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4810);
			w[fm]();
		}
	};
	m = 4810;
	a[n] = m;
	
	a = o.ChampionLvRewardsRsp = class {
		decode(r) {
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4810;
	a[n] = m;
	c[m] = a;
	
	//锦标赛--排名奖励
	a = o.ChampionRankRewardsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4811);
			w[fm]();
		}
	};
	m = 4811;
	a[n] = m;
	
	a = o.ChampionRankRewardsRsp = class {
		decode(r) {
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 4811;
	a[n] = m;
	c[m] = a;
	
	a = o.ChampionGuessPlayerList = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[w3](this.head);
			w[ws](this.name);
			w[w3](this.level);
			w[w3](this.power);
			w[w3](this.headFrame);
			w[w3](this.points);
			w[w3](this.bet);
		}
		decode(r) {
			this.playerId = r[r6]();
			this.head = r[r3]();
			this.name = r[rs]();
			this.level = r[r3]();
			this.power = r[r3]();
			this.headFrame = r[r3]();
			this.points = r[r3]();
			this.bet = r[r3]();
			return this;
		}
	};
	
	a = o.ChampionGuess = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.player1.encode(w);
			this.player2.encode(w);
			w[w6](this.playerId);
			w[w3](this.score);
			w[w3](this.rewardScore);
			w[w3](this.guessTime);
		}
		decode(r) {
			this.player1 = new o.ChampionGuessPlayerList().decode(r);
			this.player2 = new o.ChampionGuessPlayerList().decode(r);
			this.playerId = r[r6]();
			this.score = r[r3]();
			this.rewardScore = r[r3]();
			this.guessTime = r[r3]();
			return this;
		}
	};
	
	//锦标赛--有奖竞猜--下注列表
	a = o.ChampionGuessListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4812);
			w[fm]();
		}
	};
	m = 4812;
	a[n] = m;
	
	a = o.ChampionGuessListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.ChampionGuess().decode(r);   
			}
			return this;
		}
	};
	m = 4812;
	a[n] = m;
	c[m] = a;
	
	//锦标赛--有奖竞猜--竞猜
	a = o.ChampionGuessReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4813);
			w[wy](this.index);
			w[w6](this.playerId);
			w[w3](this.score);
			w[fm]();
		}
	};
	m = 4813;
	a[n] = m;
	
	a = o.ChampionGuessRsp = class {
		decode(r) {
			this.index = r[ry]();
			this.playerId = r[r6]();
			this.score = r[r3]();
			return this;
		}
	};
	m = 4813;
	a[n] = m;
	c[m] = a;
	
	//锦标赛--有奖竞猜--战斗数据
	a = o.ChampionGuessFightReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4814);
			w[wy](this.index);
			w[fm]();
		}
	};
	m = 4814;
	a[n] = m;
	
	//锦标赛--有奖竞猜--战斗数据
	a = o.ChampionGuessFightRsp = class {
		decode(r) {
			this.p1 = new o.FightQueryRsp().decode(r);
			this.p2 = new o.FightQueryRsp().decode(r);
			return this;
		}
	};
	m = 4814;
	a[n] = m;
	c[m] = a;
	
	//锦标赛--有奖竞猜--战斗结果
	a = o.ChampionGuessFightResultReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4815);
			w[wy](this.index);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 4815;
	a[n] = m;
	
	a = o.ChampionGuessFightResultRsp = class {
		decode(r) {
			this.score = r[r3]();
			return this;
		}
	};
	m = 4815;
	a[n] = m;
	c[m] = a;
	
	//锦标赛--有奖竞猜--竞猜统计
	a = o.ChampionGuessHistoryReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4816);
			w[fm]();
		}
	};
	m = 4816;
	a[n] = m;
	
	a = o.ChampionGuessHistoryRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.ChampionGuess().decode(r);   
			}
			return this;
		}
	};
	m = 4816;
	a[n] = m;
	c[m] = a;
	
	//英雄评论--新增评论
	a = o.InsertCommentReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4901);
			w[w3](this.heroId);
			w[w6](this.playerId);
			w[ws](this.content);
			w[fm]();
		}
	};
	m = 4901;
	a[n] = m;
	
	a = o.InsertCommentRsp = class {
		decode(r) {
			this.reply = r[rs]();
			return this;
		}
	};
	m = 4901;
	a[n] = m;
	c[m] = a;
	
	//英雄评论--更新评论/点赞/转发
	a = o.UpdateCommentReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4902);
			w[w3](this.id);
			w[w3](this.updateType);
			w[fm]();
		}
	};
	m = 4902;
	a[n] = m;
	
	a = o.UpdateCommentRsp = class {
		decode(r) {
			this.reply = r[rs]();
			return this;
		}
	};
	m = 4902;
	a[n] = m;
	c[m] = a;
	
	a = o.Comment = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.heroId);
			w[w6](this.playerId);
			w[ws](this.playerName);
			w[w3](this.commentTime);
			w[w3](this.likeNum);
			w[w3](this.repostNum);
			w[ws](this.content);
			w[w3](this.headId);
			w[w3](this.frameId);
			w[w3](this.vIPExp);
			w[wb](this.isLike);
			w[wb](this.isHot);
			w[wb](this.isNew);
		}
		decode(r) {
			this.id = r[r3]();
			this.heroId = r[r3]();
			this.playerId = r[r6]();
			this.playerName = r[rs]();
			this.commentTime = r[r3]();
			this.likeNum = r[r3]();
			this.repostNum = r[r3]();
			this.content = r[rs]();
			this.headId = r[r3]();
			this.frameId = r[r3]();
			this.vIPExp = r[r3]();
			this.isLike = r[rb]();
			this.isHot = r[rb]();
			this.isNew = r[rb]();
			return this;
		}
	};
	
	//英雄评论--查找评论
	a = o.FindCommentReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4903);
			w[w3](this.heroId);
			w[w3](this.pagination);
			w[fm]();
		}
	};
	m = 4903;
	a[n] = m;
	
	a = o.FindCommentRsp = class {
		decode(r) {
			this.fondNum = r[r3]();
			this.maxNum = r[r3]();
			this.commentData = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.commentData[i] = new o.Comment().decode(r);   
			}
			this.isFond = r[rb]();
			return this;
		}
	};
	m = 4903;
	a[n] = m;
	c[m] = a;
	
	//英雄评论--查看评论
	a = o.CommentInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4904);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 4904;
	a[n] = m;
	
	a = o.CommentInfoRsp = class {
		decode(r) {
			this.info = new o.Comment().decode(r);
			return this;
		}
	};
	m = 4904;
	a[n] = m;
	c[m] = a;
	
	//英雄评论--评论条数
	a = o.CommentNumReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](4905);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 4905;
	a[n] = m;
	
	a = o.CommentNumRsp = class {
		decode(r) {
			this.commentNum = r[r3]();
			return this;
		}
	};
	m = 4905;
	a[n] = m;
	c[m] = a;
	
	a = o.ResonatingGrid = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.heroId);
			w[w3](this.heroLv0);
			w[w3](this.heroLv);
			w[w3](this.offTime);
		}
		decode(r) {
			this.heroId = r[r3]();
			this.heroLv0 = r[r3]();
			this.heroLv = r[r3]();
			this.offTime = r[r3]();
			return this;
		}
	};
	
	//共鸣水晶--查看
	a = o.ResonatingStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5001);
			w[fm]();
		}
	};
	m = 5001;
	a[n] = m;
	
	a = o.ResonatingStateRsp = class {
		decode(r) {
			this.upper = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.upper[i] = r[r3]();   
			}
			this.lower = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.lower[i] = new o.ResonatingGrid().decode(r);   
			}
			return this;
		}
	};
	m = 5001;
	a[n] = m;
	c[m] = a;
	
	//共鸣水晶--放上
	a = o.ResonatingPutOnReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5002);
			w[wy](this.gridId);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 5002;
	a[n] = m;
	
	a = o.ResonatingPutOnRsp = class {
		decode(r) {
			this.gridId = r[ry]();
			this.grid = new o.ResonatingGrid().decode(r);
			return this;
		}
	};
	m = 5002;
	a[n] = m;
	c[m] = a;
	
	//共鸣水晶--放下
	a = o.ResonatingTakeOffReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5003);
			w[wy](this.gridId);
			w[wb](this.isDrop);
			w[fm]();
		}
	};
	m = 5003;
	a[n] = m;
	
	a = o.ResonatingTakeOffRsp = class {
		decode(r) {
			this.gridId = r[ry]();
			this.grid = new o.ResonatingGrid().decode(r);
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5003;
	a[n] = m;
	c[m] = a;
	
	//共鸣水晶--解锁
	a = o.ResonatingUnlockReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5004);
			w[fm]();
		}
	};
	m = 5004;
	a[n] = m;
	
	a = o.ResonatingUnlockRsp = class {
		decode(r) {
			this.gridId = r[ry]();
			return this;
		}
	};
	m = 5004;
	a[n] = m;
	c[m] = a;
	
	//共鸣水晶--清除CD
	a = o.ResonatingClearCDReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5005);
			w[wy](this.gridId);
			w[fm]();
		}
	};
	m = 5005;
	a[n] = m;
	
	a = o.ResonatingClearCDRsp = class {
		decode(r) {
			this.gridId = r[ry]();
			return this;
		}
	};
	m = 5005;
	a[n] = m;
	c[m] = a;
	
	a = o.RelicPoint = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.pointId);
			w[w3](this.serverId);
			w[ws](this.ownerName);
			w[ws](this.guildName);
			w[w3](this.defenderNum);
			w[w3](this.exploreRate);
			w[w3](this.outputTime);
			w[w3](this.fightTime);
			w[w3](this.freezeTime);
		}
		decode(r) {
			this.pointId = r[r3]();
			this.serverId = r[r3]();
			this.ownerName = r[rs]();
			this.guildName = r[rs]();
			this.defenderNum = r[r3]();
			this.exploreRate = r[r3]();
			this.outputTime = r[r3]();
			this.fightTime = r[r3]();
			this.freezeTime = r[r3]();
			return this;
		}
	};
	
	//战争遗迹--据点列表
	a = o.RelicPointListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5101);
			w[w3](this.mapType);
			w[wb](this.needPoints);
			w[fm]();
		}
	};
	m = 5101;
	a[n] = m;
	
	a = o.RelicPointListRsp = class {
		decode(r) {
			this.mapType = r[r3]();
			this.pointList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.pointList[i] = new o.RelicPoint().decode(r);   
			}
			this.exploreTimes = r[r3]();
			this.exploreExtra = r[r3]();
			this.ydLoginNum = r[r3]();
			return this;
		}
	};
	m = 5101;
	a[n] = m;
	c[m] = a;
	
	a = o.RelicDefender = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.index);
			this.brief.encode(w);
			w[w3](this.hP);
		}
		decode(r) {
			this.index = r[ry]();
			this.brief = new o.RoleBrief().decode(r);
			this.hP = r[r3]();
			return this;
		}
	};
	
	a = o.RelicRecord = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.type);
			w[w3](this.time);
			w[w3](this.value);
			w[w3](this.serverId1);
			w[ws](this.roleName1);
			w[w3](this.serverId2);
			w[ws](this.roleName2);
		}
		decode(r) {
			this.type = r[r3]();
			this.time = r[r3]();
			this.value = r[r3]();
			this.serverId1 = r[r3]();
			this.roleName1 = r[rs]();
			this.serverId2 = r[r3]();
			this.roleName2 = r[rs]();
			return this;
		}
	};
	
	//战争遗迹--据点详情
	a = o.RelicPointDetailReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5102);
			w[w3](this.mapType);
			w[w3](this.pointId);
			w[fm]();
		}
	};
	m = 5102;
	a[n] = m;
	
	a = o.RelicPointDetailRsp = class {
		decode(r) {
			this.pointId = r[r3]();
			this.outputTime = r[r3]();
			this.contestTime = r[r3]();
			this.fightTime = r[r3]();
			this.exploreRate = r[r3]();
			this.lastAtkTime = r[r3]();
			this.freezeTime = r[r3]();
			this.guildName = r[rs]();
			this.helperCD = r[r3]();
			this.recordNum = r[r3]();
			this.records = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.records[i] = new o.RelicRecord().decode(r);   
			}
			this.defenders = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.defenders[i] = new o.RelicDefender().decode(r);   
			}
			return this;
		}
	};
	m = 5102;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--开始探索
	a = o.RelicPointExploreReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5103);
			w[w3](this.mapType);
			w[w3](this.pointId);
			w[fm]();
		}
	};
	m = 5103;
	a[n] = m;
	
	a = o.RelicPointExploreRsp = class {
		decode(r) {
			this.mapType = r[r3]();
			this.pointId = r[r3]();
			return this;
		}
	};
	m = 5103;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--战斗记录
	a = o.RelicPointRecordsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5104);
			w[w3](this.mapType);
			w[w3](this.pointId);
			w[w3](this.index);
			w[w3](this.count);
			w[fm]();
		}
	};
	m = 5104;
	a[n] = m;
	
	a = o.RelicPointRecordsRsp = class {
		decode(r) {
			this.records = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.records[i] = new o.RelicRecord().decode(r);   
			}
			return this;
		}
	};
	m = 5104;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--清楚CD
	a = o.RelicFightClearCDReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5105);
			w[w3](this.pointId);
			w[w3](this.mapType);
			w[fm]();
		}
	};
	m = 5105;
	a[n] = m;
	
	a = o.RelicFightClearCDRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 5105;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--开始战斗
	a = o.RelicFightStartReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5106);
			w[w3](this.pointId);
			w[w3](this.mapType);
			w[fm]();
		}
	};
	m = 5106;
	a[n] = m;
	
	a = o.RelicFightStartRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				if (r[rb]()) {
					this.heroList[i] = new o.FightHero().decode(r);
				}   
			}
			if (r[rb]()) {
				this.general = new o.FightGeneral().decode(r);
			}
			return this;
		}
	};
	m = 5106;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--结束战斗
	a = o.RelicFightOverReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5107);
			w[w3](this.pointId);
			w[w3](this.damage);
			w[w3](this.mapType);
			w[fm]();
		}
	};
	m = 5107;
	a[n] = m;
	
	a = o.RelicFightOverRsp = class {
		decode(r) {
			this.pointId = r[r3]();
			this.canExplore = r[rb]();
			this.remainHP = r[r3]();
			return this;
		}
	};
	m = 5107;
	a[n] = m;
	c[m] = a;
	
	a = o.RelicGuildDefender = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.defenderId);
			w[w3](this.pointType);
			w[ws](this.ownerName);
			w[w3](this.endTime);
		}
		decode(r) {
			this.defenderId = r[r6]();
			this.pointType = r[r3]();
			this.ownerName = r[rs]();
			this.endTime = r[r3]();
			return this;
		}
	};
	
	//战争遗迹--公会协防者
	a = o.RelicGuildDefendersReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5108);
			w[fm]();
		}
	};
	m = 5108;
	a[n] = m;
	
	a = o.RelicGuildDefendersRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RelicGuildDefender().decode(r);   
			}
			return this;
		}
	};
	m = 5108;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--请求协防
	a = o.RelicHelpDefendReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5109);
			w[w6](this.defenderId);
			w[w6](this.ownerId);
			w[w3](this.pointId);
			w[w3](this.mapType);
			w[fm]();
		}
	};
	m = 5109;
	a[n] = m;
	
	a = o.RelicHelpDefendRsp = class {
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			return this;
		}
	};
	m = 5109;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--查看奖励
	a = o.RelicQueryRewardsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5110);
			w[fm]();
		}
	};
	m = 5110;
	a[n] = m;
	
	a = o.RelicQueryRewardsRsp = class {
		decode(r) {
			this.mapType = r[r3]();
			this.pointType = r[r3]();
			this.fightCount = r[r3]();
			this.recordNum = r[r3]();
			this.records = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.records[i] = new o.RelicRecord().decode(r);   
			}
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5110;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--领取奖励
	a = o.RelicFetchRewardsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5111);
			w[wb](this.thankHelpers);
			w[fm]();
		}
	};
	m = 5111;
	a[n] = m;
	
	a = o.RelicFetchRewardsRsp = class {
		decode(r) {
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5111;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--修复
	a = o.RelicRepairReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5112);
			w[w3](this.index);
			w[w6](this.ownerId);
			w[w3](this.pointId);
			w[w3](this.mapType);
			w[fm]();
		}
	};
	m = 5112;
	a[n] = m;
	
	a = o.RelicRepairRsp = class {
		decode(r) {
			this.index = r[r3]();
			this.ownerId = r[r6]();
			this.pointId = r[r3]();
			return this;
		}
	};
	m = 5112;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--放弃
	a = o.RelicGiveUpReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5113);
			w[fm]();
		}
	};
	m = 5113;
	a[n] = m;
	
	a = o.RelicGiveUpRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 5113;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--据点广播
	a = o.RelicBroadcastPointRsp = class {
		decode(r) {
			this.mapType = r[r3]();
			this.point = new o.RelicPoint().decode(r);
			return this;
		}
	};
	m = 5114;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--探索次数更新
	a = o.RelicExploreTimesRsp = class {
		decode(r) {
			this.number = r[r3]();
			this.extra = r[r3]();
			return this;
		}
	};
	m = 5115;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--重置协防
	a = o.RelicHelpResetReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5116);
			w[w3](this.index);
			w[fm]();
		}
	};
	m = 5116;
	a[n] = m;
	
	a = o.RelicHelpResetRsp = class {
		decode(r) {
			this.index = r[r3]();
			return this;
		}
	};
	m = 5116;
	a[n] = m;
	c[m] = a;
	
	a = o.RelicMapDrop = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[ws](this.playerName);
			w[w3](this.pointId);
			w[w3](this.dropTime);
			w[w3](this.itemType);
		}
		decode(r) {
			this.playerId = r[r6]();
			this.playerName = r[rs]();
			this.pointId = r[r3]();
			this.dropTime = r[r3]();
			this.itemType = r[r3]();
			return this;
		}
	};
	
	//战争遗迹--查看掉落记录
	a = o.RelicMapDropsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5117);
			w[w3](this.mapType);
			w[w3](this.pointId);
			w[w3](this.index);
			w[w3](this.size);
			w[fm]();
		}
	};
	m = 5117;
	a[n] = m;
	
	a = o.RelicMapDropsRsp = class {
		decode(r) {
			this.total = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RelicMapDrop().decode(r);   
			}
			return this;
		}
	};
	m = 5117;
	a[n] = m;
	c[m] = a;
	
	a = o.RelicGuildExplorer = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.playerBrief.encode(w);
			w[w3](this.remainTimes);
			w[w3](this.maxTimes);
			w[w3](this.endTime);
		}
		decode(r) {
			this.playerBrief = new o.RoleBrief().decode(r);
			this.remainTimes = r[r3]();
			this.maxTimes = r[r3]();
			this.endTime = r[r3]();
			return this;
		}
	};
	
	//战争遗迹--公会探索列表
	a = o.RelicGuildExplorersReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5118);
			w[w3](this.minPower);
			w[w3](this.minLevel);
			w[fm]();
		}
	};
	m = 5118;
	a[n] = m;
	
	a = o.RelicGuildExplorersRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RelicGuildExplorer().decode(r);   
			}
			return this;
		}
	};
	m = 5118;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--转让据点
	a = o.RelicTransferReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5119);
			w[w6](this.targetId);
			w[fm]();
		}
	};
	m = 5119;
	a[n] = m;
	
	a = o.RelicTransferRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 5119;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--转让据点通知
	a = o.RelicTransferNoticeRsp = class {
		decode(r) {
			this.ownerBrief = new o.RoleBrief().decode(r);
			this.mapType = r[r3]();
			this.pointId = r[r3]();
			this.endTime = r[r3]();
			return this;
		}
	};
	m = 5120;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--转让据点确认
	a = o.RelicTransferConfirmReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5121);
			w[w6](this.ownerId);
			w[w3](this.mapType);
			w[w3](this.pointId);
			w[fm]();
		}
	};
	m = 5121;
	a[n] = m;
	
	a = o.RelicTransferConfirmRsp = class {
		decode(r) {
			this.mapType = r[r3]();
			this.pointId = r[r3]();
			return this;
		}
	};
	m = 5121;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--转让据点取消
	a = o.RelicTransferCancelReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5122);
			w[w6](this.ownerId);
			w[fm]();
		}
	};
	m = 5122;
	a[n] = m;
	
	a = o.RelicTransferCancelRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 5122;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--据点被攻击通知
	a = o.RelicUnderAttackNoticeRsp = class {
		decode(r) {
			this.noticeTime = r[r3]();
			this.pointId = r[r3]();
			this.srvName = r[rs]();
			this.atkName = r[rs]();
			this.ownerHP = r[rs]();
			this.helperHP = r[rs]();
			this.mapType = r[r3]();
			return this;
		}
	};
	m = 5123;
	a[n] = m;
	c[m] = a;
	
	a = o.RelicRankGuild = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.id);
			w[ws](this.name);
			w[w3](this.icon);
			w[w3](this.bottom);
			w[w3](this.frame);
			w[w3](this.score);
		}
		decode(r) {
			this.id = r[r6]();
			this.name = r[rs]();
			this.icon = r[r3]();
			this.bottom = r[r3]();
			this.frame = r[r3]();
			this.score = r[r3]();
			return this;
		}
	};
	
	//战争遗迹--公会排行榜
	a = o.RelicGuildRankReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5124);
			w[fm]();
		}
	};
	m = 5124;
	a[n] = m;
	
	a = o.RelicGuildRankRsp = class {
		decode(r) {
			this.rankList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rankList[i] = new o.RelicRankGuild().decode(r);   
			}
			this.serverNum = r[r3]();
			return this;
		}
	};
	m = 5124;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--遗迹之证已领奖励
	a = o.RelicCertStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5125);
			w[fm]();
		}
	};
	m = 5125;
	a[n] = m;
	
	a = o.RelicCertStateRsp = class {
		decode(r) {
			this.bought = r[rb]();
			this.rewarded1 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded1[i] = r[ry]();   
			}
			this.rewarded2 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded2[i] = r[ry]();   
			}
			this.sETime = new o.PassSETime().decode(r);
			return this;
		}
	};
	m = 5125;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--遗迹之证领取奖励
	a = o.RelicCertRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5126);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 5126;
	a[n] = m;
	
	a = o.RelicCertRewardRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.rewarded1 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded1[i] = r[ry]();   
			}
			this.rewarded2 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded2[i] = r[ry]();   
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5126;
	a[n] = m;
	c[m] = a;
	
	a = o.RelicRankPlayer = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w3](this.score);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.score = r[r3]();
			return this;
		}
	};
	
	//战争遗迹--清楚协防排行榜
	a = o.RelicClearRankReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5127);
			w[fm]();
		}
	};
	m = 5127;
	a[n] = m;
	
	a = o.RelicClearRankRsp = class {
		decode(r) {
			this.rankList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rankList[i] = new o.RelicRankPlayer().decode(r);   
			}
			this.rankMine = r[r3]();
			return this;
		}
	};
	m = 5127;
	a[n] = m;
	c[m] = a;
	
	//战争遗迹--战斗次数排行榜
	a = o.RelicFightRankReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5128);
			w[fm]();
		}
	};
	m = 5128;
	a[n] = m;
	
	a = o.RelicFightRankRsp = class {
		decode(r) {
			this.rankList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rankList[i] = new o.RelicRankPlayer().decode(r);   
			}
			this.rankMine = r[r3]();
			return this;
		}
	};
	m = 5128;
	a[n] = m;
	c[m] = a;
	
	a = o.CostumeAttr = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.initValue);
			w[w3](this.value);
		}
		decode(r) {
			this.id = r[r3]();
			this.initValue = r[r3]();
			this.value = r[r3]();
			return this;
		}
	};
	
	a = o.CostumeInfo = class {
		constructor(d) {
			this.attrs = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.typeId);
			w[w3](this.level);
			w[w1](this.attrs.length);
			for (var i = 0, len = this.attrs.length; i < len; i++) {
				this.attrs[i].encode(w);   
			}
		}
		decode(r) {
			this.id = r[r3]();
			this.typeId = r[r3]();
			this.level = r[r3]();
			this.attrs = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.attrs[i] = new o.CostumeAttr().decode(r);   
			}
			return this;
		}
	};
	
	//神装--列表
	a = o.CostumeListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5201);
			w[fm]();
		}
	};
	m = 5201;
	a[n] = m;
	
	a = o.CostumeListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.CostumeInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5201;
	a[n] = m;
	c[m] = a;
	
	//神装--分解
	a = o.CostumeDisintReq = class {
		constructor(d) {
			this.costumeIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5202);
			w[w3](this.heroId);
			w[w1](this.costumeIds.length);
			for (var i = 0, len = this.costumeIds.length; i < len; i++) {
				w[w3](this.costumeIds[i]);   
			}
			w[fm]();
		}
	};
	m = 5202;
	a[n] = m;
	
	a = o.CostumeDisintRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.costumes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.costumes[i] = r[r3]();   
			}
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5202;
	a[n] = m;
	c[m] = a;
	
	//神装--穿戴，卸下，更换
	a = o.CostumeOnReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5203);
			w[w3](this.heroId);
			w[wy](this.index);
			w[w3](this.costumeId);
			w[fm]();
		}
	};
	m = 5203;
	a[n] = m;
	
	// 强化、分解英雄身上的神装会推送这个协议
	a = o.CostumeOnRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.CostumeInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5203;
	a[n] = m;
	c[m] = a;
	
	//神装--强化
	a = o.CostumeUpgradeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5204);
			w[w3](this.heroId);
			w[w3](this.costumeId);
			w[wb](this.top);
			w[fm]();
		}
	};
	m = 5204;
	a[n] = m;
	
	a = o.CostumeUpgradeRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.costume = new o.CostumeInfo().decode(r);
			return this;
		}
	};
	m = 5204;
	a[n] = m;
	c[m] = a;
	
	a = o.CostumeUpdateRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.CostumeInfo().decode(r);   
			}
			this.deleteList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.deleteList[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 5205;
	a[n] = m;
	c[m] = a;
	
	//神装定制--状态
	a = o.CostumeCustomStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5206);
			w[fm]();
		}
	};
	m = 5206;
	a[n] = m;
	
	a = o.CostumeCustomStateRsp = class {
		decode(r) {
			this.score = r[r3]();
			this.scoreRecord = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.scoreRecord[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 5206;
	a[n] = m;
	c[m] = a;
	
	//神装定制--积分变更，领取任务奖励获得积分会推送此协议
	a = o.CostumeCustomScoreUpdateRsp = class {
		decode(r) {
			this.score = r[r3]();
			return this;
		}
	};
	m = 5207;
	a[n] = m;
	c[m] = a;
	
	//神装定制--领取
	a = o.CostumeCustomScoreReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5208);
			w[w3](this.score);
			w[fm]();
		}
	};
	m = 5208;
	a[n] = m;
	
	a = o.CostumeCustomScoreRsp = class {
		decode(r) {
			this.score = r[r3]();
			this.scoreRecord = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.scoreRecord[i] = r[r3]();   
			}
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5208;
	a[n] = m;
	c[m] = a;
	
	//神装定制--定制，还会推送CostumeUpdateRsp
	a = o.CostumeCustomReq = class {
		constructor(d) {
			this.attrs = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5209);
			w[w3](this.id);
			w[w1](this.attrs.length);
			for (var i = 0, len = this.attrs.length; i < len; i++) {
				w[w3](this.attrs[i]);   
			}
			w[fm]();
		}
	};
	m = 5209;
	a[n] = m;
	
	a = o.CostumeCustomRsp = class {
		decode(r) {
			this.costume = new o.CostumeInfo().decode(r);
			return this;
		}
	};
	m = 5209;
	a[n] = m;
	c[m] = a;
	
	a = o.VaultRecord = class {
		constructor(d) {
			this.heroList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[ws](this.playerName);
			w[w3](this.power);
			w[w3](this.date);
			w[w3](this.difficulty);
			w[w1](this.heroList.length);
			for (var i = 0, len = this.heroList.length; i < len; i++) {
				this.heroList[i].encode(w);   
			}
		}
		decode(r) {
			this.playerId = r[r6]();
			this.playerName = r[rs]();
			this.power = r[r3]();
			this.date = r[r3]();
			this.difficulty = r[r3]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroList[i] = new o.HeroBrief().decode(r);   
			}
			return this;
		}
	};
	
	a = o.PositionInfo = class {
		constructor(d) {
			this.recordList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.positionId);
			w[w6](this.playerId);
			w[ws](this.playerName);
			w[w3](this.headId);
			w[w3](this.frameId);
			w[w3](this.titleId);
			w[ws](this.guildName);
			w[w3](this.difficulty);
			w[w1](this.recordList.length);
			for (var i = 0, len = this.recordList.length; i < len; i++) {
				this.recordList[i].encode(w);   
			}
		}
		decode(r) {
			this.positionId = r[r3]();
			this.playerId = r[r6]();
			this.playerName = r[rs]();
			this.headId = r[r3]();
			this.frameId = r[r3]();
			this.titleId = r[r3]();
			this.guildName = r[rs]();
			this.difficulty = r[r3]();
			this.recordList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.recordList[i] = new o.VaultRecord().decode(r);   
			}
			return this;
		}
	};
	
	//殿堂指挥官--占领
	a = o.VaultFightOverReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5301);
			w[w3](this.positionId);
			w[wb](this.isSuccess);
			w[fm]();
		}
	};
	m = 5301;
	a[n] = m;
	
	a = o.VaultFightOverRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.VaultRecord().decode(r);   
			}
			return this;
		}
	};
	m = 5301;
	a[n] = m;
	c[m] = a;
	
	//殿堂指挥官--信息
	a = o.VaultPositionInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5302);
			w[fm]();
		}
	};
	m = 5302;
	a[n] = m;
	
	a = o.VaultPositionInfoRsp = class {
		decode(r) {
			this.failTime = r[r3]();
			this.info = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.info[i] = new o.PositionInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5302;
	a[n] = m;
	c[m] = a;
	
	//殿堂指挥官--战斗开始
	a = o.VaultFightStartReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5303);
			w[w3](this.positionId);
			w[w3](this.difficulty);
			w[fm]();
		}
	};
	m = 5303;
	a[n] = m;
	
	a = o.VaultFightStartRsp = class {
		decode(r) {
			this.startSucc = r[rb]();
			return this;
		}
	};
	m = 5303;
	a[n] = m;
	c[m] = a;
	
	//殿堂指挥官--战斗准备
	a = o.VaultFightReadyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5304);
			w[w3](this.positionId);
			w[w3](this.difficulty);
			w[fm]();
		}
	};
	m = 5304;
	a[n] = m;
	
	a = o.VaultFightReadyRsp = class {
		decode(r) {
			this.enterSucc = r[rb]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroList[i] = new o.FightHero().decode(r);   
			}
			if (r[rb]()) {
				this.general = new o.FightGeneral().decode(r);
			}
			return this;
		}
	};
	m = 5304;
	a[n] = m;
	c[m] = a;
	
	a = o.GuildEnvelope = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.typeId);
			w[ws](this.name);
			w[w3](this.left);
			w[w3](this.sendTime);
			w[wb](this.got);
		}
		decode(r) {
			this.id = r[r3]();
			this.typeId = r[r3]();
			this.name = r[rs]();
			this.left = r[r3]();
			this.sendTime = r[r3]();
			this.got = r[rb]();
			return this;
		}
	};
	
	a = o.GuildEnvelopeRank = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w3](this.value);
			w[w3](this.num);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.value = r[r3]();
			this.num = r[r3]();
			return this;
		}
	};
	
	//公会红包--排行榜(变化主动推送)
	a = o.GuildEnvelopeRankReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5401);
			w[fm]();
		}
	};
	m = 5401;
	a[n] = m;
	
	a = o.GuildEnvelopeRankRsp = class {
		decode(r) {
			this.rank = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rank[i] = new o.GuildEnvelopeRank().decode(r);   
			}
			return this;
		}
	};
	m = 5401;
	a[n] = m;
	c[m] = a;
	
	//公会红包--红包列表
	a = o.GuildEnvelopeListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5402);
			w[wb](this.my);
			w[fm]();
		}
	};
	m = 5402;
	a[n] = m;
	
	a = o.GuildEnvelopeListRsp = class {
		decode(r) {
			this.my = r[rb]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GuildEnvelope().decode(r);   
			}
			return this;
		}
	};
	m = 5402;
	a[n] = m;
	c[m] = a;
	
	// 主动推送有变动的红包
	a = o.GuildEnvelopeChangeRsp = class {
		decode(r) {
			this.my = r[rb]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GuildEnvelope().decode(r);   
			}
			return this;
		}
	};
	m = 5403;
	a[n] = m;
	c[m] = a;
	
	//公会红包--发红包
	a = o.GuildEnvelopeSendReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5404);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 5404;
	a[n] = m;
	
	a = o.GuildEnvelopeSendRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GuildEnvelope().decode(r);   
			}
			return this;
		}
	};
	m = 5404;
	a[n] = m;
	c[m] = a;
	
	//公会红包--抢红包
	a = o.GuildEnvelopeGetReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5405);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 5405;
	a[n] = m;
	
	a = o.GuildEnvelopeGetRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.goods = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goods[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5405;
	a[n] = m;
	c[m] = a;
	
	a = o.CarnivalServerInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.serverId);
			w[w3](this.ranking);
			w[w3](this.serverScore);
		}
		decode(r) {
			this.serverId = r[r3]();
			this.ranking = r[r3]();
			this.serverScore = r[r3]();
			return this;
		}
	};
	
	//跨服狂欢--服务器排名
	a = o.CarnivalServerScoreRankReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5501);
			w[fm]();
		}
	};
	m = 5501;
	a[n] = m;
	
	a = o.CarnivalServerScoreRankRsp = class {
		decode(r) {
			this.rankingInfo = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rankingInfo[i] = new o.CarnivalServerInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5501;
	a[n] = m;
	c[m] = a;
	
	a = o.CarnivalPlayerAddScoreRsp = class {
		decode(r) {
			this.addNum = r[r3]();
			return this;
		}
	};
	m = 5502;
	a[n] = m;
	c[m] = a;
	
	//跨服狂欢--玩家积分
	a = o.CarnivalPlayerScoreQueryReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5503);
			w[fm]();
		}
	};
	m = 5503;
	a[n] = m;
	
	a = o.CarnivalPlayerScoreQueryRsp = class {
		decode(r) {
			this.carnivalScore = r[r3]();
			return this;
		}
	};
	m = 5503;
	a[n] = m;
	c[m] = a;
	
	//跨服狂欢--信息
	a = o.CarnivalInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5504);
			w[fm]();
		}
	};
	m = 5504;
	a[n] = m;
	
	a = o.CarnivalInfoRsp = class {
		decode(r) {
			this.boxOpened = r[ry]();
			this.numTd = r[r3]();
			this.carnivalScore = r[r3]();
			return this;
		}
	};
	m = 5504;
	a[n] = m;
	c[m] = a;
	
	//跨服狂欢--玩家当前服务器排名
	a = o.CarnivalPlayerServerRankReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5505);
			w[fm]();
		}
	};
	m = 5505;
	a[n] = m;
	
	a = o.CarnivalPlayerServerRankRsp = class {
		decode(r) {
			this.rank = r[r3]();
			return this;
		}
	};
	m = 5505;
	a[n] = m;
	c[m] = a;
	
	a = o.RitualInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.remain);
			w[w3](this.total);
			w[w3](this.time);
		}
		decode(r) {
			this.id = r[r3]();
			this.remain = r[r3]();
			this.total = r[r3]();
			this.time = r[r3]();
			return this;
		}
	};
	
	//每日必做--参数信息
	a = o.RitualListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5601);
			w[fm]();
		}
	};
	m = 5601;
	a[n] = m;
	
	a = o.RitualListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RitualInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5601;
	a[n] = m;
	c[m] = a;
	
	a = o.RuinStage = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.stageId);
			w[wy](this.star);
		}
		decode(r) {
			this.stageId = r[r3]();
			this.star = r[ry]();
			return this;
		}
	};
	
	a = o.RuinChapter = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.chapter);
			this.player.encode(w);
			this.challenger.encode(w);
		}
		decode(r) {
			this.chapter = r[r3]();
			this.player = new o.RoleBrief().decode(r);
			this.challenger = new o.RoleBrief().decode(r);
			return this;
		}
	};
	
	a = o.RuinChapterReward = class {
		constructor(d) {
			this.reward = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.chapter);
			w[w1](this.reward.length);
			for (var i = 0, len = this.reward.length; i < len; i++) {
				w[wy](this.reward[i]);   
			}
		}
		decode(r) {
			this.chapter = r[r3]();
			this.reward = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.reward[i] = r[ry]();   
			}
			return this;
		}
	};
	
	//末日废墟--状态
	a = o.RuinStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5701);
			w[fm]();
		}
	};
	m = 5701;
	a[n] = m;
	
	a = o.RuinStateRsp = class {
		decode(r) {
			this.maxStageId = r[r3]();
			this.times = r[ry]();
			this.raids = r[ry]();
			this.raidsStage = r[r3]();
			this.stages = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.stages[i] = new o.RuinStage().decode(r);   
			}
			this.chapters = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.chapters[i] = new o.RuinChapter().decode(r);   
			}
			this.chapterReward = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.chapterReward[i] = new o.RuinChapterReward().decode(r);   
			}
			return this;
		}
	};
	m = 5701;
	a[n] = m;
	c[m] = a;
	
	//末日废墟--进入
	a = o.RuinEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5702);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 5702;
	a[n] = m;
	
	a = o.RuinEnterRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			return this;
		}
	};
	m = 5702;
	a[n] = m;
	c[m] = a;
	
	//末日废墟--退出
	a = o.RuinExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5703);
			w[w3](this.stageId);
			w[wy](this.star);
			w[fm]();
		}
	};
	m = 5703;
	a[n] = m;
	
	a = o.RuinExitRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.star = r[ry]();
			this.chapter = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5703;
	a[n] = m;
	c[m] = a;
	
	//末日废墟--扫荡
	a = o.RuinRaidsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5704);
			w[fm]();
		}
	};
	m = 5704;
	a[n] = m;
	
	a = o.RuinRaidsRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.raids = r[ry]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5704;
	a[n] = m;
	c[m] = a;
	
	//末日废墟--pvp挑战进入
	a = o.RuinChallengeEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5705);
			w[w3](this.chapter);
			w[fm]();
		}
	};
	m = 5705;
	a[n] = m;
	
	a = o.RuinChallengeEnterRsp = class {
		decode(r) {
			this.chapter = r[r3]();
			return this;
		}
	};
	m = 5705;
	a[n] = m;
	c[m] = a;
	
	//末日废墟--pvp挑战退出
	a = o.RuinChallengeExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5706);
			w[w3](this.chapter);
			w[wb](this.clear);
			w[fm]();
		}
	};
	m = 5706;
	a[n] = m;
	
	a = o.RuinChallengeExitRsp = class {
		decode(r) {
			this.chapter = r[r3]();
			return this;
		}
	};
	m = 5706;
	a[n] = m;
	c[m] = a;
	
	//末日废墟--领取章节奖励
	a = o.RuinChapterRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5707);
			w[w3](this.chapter);
			w[w3](this.star);
			w[fm]();
		}
	};
	m = 5707;
	a[n] = m;
	
	a = o.RuinChapterRewardRsp = class {
		decode(r) {
			this.chapterReward = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.chapterReward[i] = new o.RuinChapterReward().decode(r);   
			}
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5707;
	a[n] = m;
	c[m] = a;
	
	//末日废墟--章节挑战状态(主动给推送)
	a = o.RuinChapterChallengeRsp = class {
		decode(r) {
			this.chapter = r[r3]();
			this.player = new o.RoleBrief().decode(r);
			this.challenger = new o.RoleBrief().decode(r);
			return this;
		}
	};
	m = 5708;
	a[n] = m;
	c[m] = a;
	
	a = o.RuinStarRankBrief = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w3](this.value);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.value = r[r3]();
			return this;
		}
	};
	
	//末日废墟--星星排行榜
	a = o.RuinStarRankListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5709);
			w[fm]();
		}
	};
	m = 5709;
	a[n] = m;
	
	a = o.RuinStarRankListRsp = class {
		decode(r) {
			this.mine = r[r3]();
			this.star = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RuinStarRankBrief().decode(r);   
			}
			return this;
		}
	};
	m = 5709;
	a[n] = m;
	c[m] = a;
	
	a = o.EnergyStationInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.stationId);
			w[w3](this.upgradeId);
			w[w3](this.advanceId);
			w[wb](this.isRedPoint);
		}
		decode(r) {
			this.stationId = r[ry]();
			this.upgradeId = r[r3]();
			this.advanceId = r[r3]();
			this.isRedPoint = r[rb]();
			return this;
		}
	};
	
	//能量站--信息
	a = o.EnergyStationInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5801);
			w[fm]();
		}
	};
	m = 5801;
	a[n] = m;
	
	a = o.EnergyStationInfoRsp = class {
		decode(r) {
			this.info = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.info[i] = new o.EnergyStationInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5801;
	a[n] = m;
	c[m] = a;
	
	//能量站--解锁
	a = o.EnergyStationUnlockReq = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5802);
			w[wy](this.stationId);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
			w[fm]();
		}
	};
	m = 5802;
	a[n] = m;
	
	a = o.EnergyStationUnlockRsp = class {
		decode(r) {
			this.info = new o.EnergyStationInfo().decode(r);
			return this;
		}
	};
	m = 5802;
	a[n] = m;
	c[m] = a;
	
	//能量站--升级
	a = o.EnergyStationUpgradeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5803);
			w[w3](this.upgradeId);
			w[fm]();
		}
	};
	m = 5803;
	a[n] = m;
	
	a = o.EnergyStationUpgradeRsp = class {
		decode(r) {
			this.info = new o.EnergyStationInfo().decode(r);
			return this;
		}
	};
	m = 5803;
	a[n] = m;
	c[m] = a;
	
	//能量站--升阶
	a = o.EnergyStationAdvanceReq = class {
		constructor(d) {
			this.staffHeroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5804);
			w[w3](this.advanceId);
			w[w1](this.staffHeroIds.length);
			for (var i = 0, len = this.staffHeroIds.length; i < len; i++) {
				w[w3](this.staffHeroIds[i]);   
			}
			w[fm]();
		}
	};
	m = 5804;
	a[n] = m;
	
	a = o.EnergyStationAdvanceRsp = class {
		decode(r) {
			this.info = new o.EnergyStationInfo().decode(r);
			return this;
		}
	};
	m = 5804;
	a[n] = m;
	c[m] = a;
	
	//能量站--红点
	a = o.EnergyStationRedPointReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5805);
			w[wy](this.stationId);
			w[wb](this.open);
			w[fm]();
		}
	};
	m = 5805;
	a[n] = m;
	
	a = o.EnergyStationRedPointRsp = class {
		decode(r) {
			this.info = new o.EnergyStationInfo().decode(r);
			return this;
		}
	};
	m = 5805;
	a[n] = m;
	c[m] = a;
	
	//新英雄试炼--进度、次数信息
	a = o.NewOrdealInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5901);
			w[fm]();
		}
	};
	m = 5901;
	a[n] = m;
	
	a = o.NewOrdealInfoRsp = class {
		decode(r) {
			this.maxStageId = r[r3]();
			this.stageDamages = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.stageDamages[i] = r[r6]();   
			}
			this.rankNum = r[r3]();
			return this;
		}
	};
	m = 5901;
	a[n] = m;
	c[m] = a;
	
	//新英雄试炼--开始战斗
	a = o.NewOrdealEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5902);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 5902;
	a[n] = m;
	
	a = o.NewOrdealEnterRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			return this;
		}
	};
	m = 5902;
	a[n] = m;
	c[m] = a;
	
	//新英雄试炼--结束战斗
	a = o.NewOrdealExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5903);
			w[w3](this.stageId);
			w[w6](this.stageDamage);
			w[wb](this.clear);
			w[fm]();
		}
	};
	m = 5903;
	a[n] = m;
	
	a = o.NewOrdealExitRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.stageDamage = r[r6]();
			this.clearRewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.clearRewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 5903;
	a[n] = m;
	c[m] = a;
	
	a = o.NewOrdealRankBrief = class {
		constructor(d) {
			this.value = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w1](this.value.length);
			for (var i = 0, len = this.value.length; i < len; i++) {
				w[w6](this.value[i]);   
			}
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.value = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.value[i] = r[r6]();   
			}
			return this;
		}
	};
	
	//新英雄试炼--排行榜
	a = o.NewOrdealRankListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](5904);
			w[fm]();
		}
	};
	m = 5904;
	a[n] = m;
	
	a = o.NewOrdealRankListRsp = class {
		decode(r) {
			this.serverNum = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.NewOrdealRankBrief().decode(r);   
			}
			return this;
		}
	};
	m = 5904;
	a[n] = m;
	c[m] = a;
	
	//丧尸围城--状态
	a = o.SiegeStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6001);
			w[fm]();
		}
	};
	m = 6001;
	a[n] = m;
	
	a = o.SiegeStateRsp = class {
		decode(r) {
			this.weekGroup = r[r3]();
			this.todayMaxGroup = r[r3]();
			this.todayBlood = r[r3]();
			this.weekBlood = r[r3]();
			this.enterTimes = r[r3]();
			this.buyTimes = r[r3]();
			this.serverNum = r[r3]();
			this.worldLevelIndex = r[r3]();
			this.isActivityOpen = r[rb]();
			return this;
		}
	};
	m = 6001;
	a[n] = m;
	c[m] = a;
	
	//丧尸围城--购买次数
	a = o.SiegeBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6002);
			w[fm]();
		}
	};
	m = 6002;
	a[n] = m;
	
	a = o.SiegeBuyRsp = class {
		decode(r) {
			this.enterTimes = r[r3]();
			this.buyTimes = r[r3]();
			return this;
		}
	};
	m = 6002;
	a[n] = m;
	c[m] = a;
	
	//丧尸围城--开始战斗
	a = o.SiegeEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6003);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 6003;
	a[n] = m;
	
	a = o.SiegeEnterRsp = class {
		decode(r) {
			this.enterTimes = r[r3]();
			return this;
		}
	};
	m = 6003;
	a[n] = m;
	c[m] = a;
	
	//丧尸围城--结束战斗
	a = o.SiegeExitReq = class {
		constructor(d) {
			this.monsters = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6004);
			w[w3](this.group);
			w[w3](this.blood);
			w[w1](this.monsters.length);
			for (var i = 0, len = this.monsters.length; i < len; i++) {
				this.monsters[i].encode(w);   
			}
			w[fm]();
		}
	};
	m = 6004;
	a[n] = m;
	
	a = o.SiegeExitRsp = class {
		decode(r) {
			this.weekGroup = r[r3]();
			this.todayMaxGroup = r[r3]();
			this.todayBlood = r[r3]();
			this.weekBlood = r[r3]();
			this.enterTimes = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6004;
	a[n] = m;
	c[m] = a;
	
	a = o.SiegeRankBrief = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.guildId);
			w[w3](this.guildIcon);
			w[w3](this.guildBottom);
			w[w3](this.guildFrame);
			w[ws](this.guildName);
			w[w3](this.blood);
		}
		decode(r) {
			this.guildId = r[r6]();
			this.guildIcon = r[r3]();
			this.guildBottom = r[r3]();
			this.guildFrame = r[r3]();
			this.guildName = r[rs]();
			this.blood = r[r3]();
			return this;
		}
	};
	
	//丧尸围城--排行榜
	a = o.SiegeRankListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6005);
			w[fm]();
		}
	};
	m = 6005;
	a[n] = m;
	
	a = o.SiegeRankListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.SiegeRankBrief().decode(r);   
			}
			return this;
		}
	};
	m = 6005;
	a[n] = m;
	c[m] = a;
	
	a = o.SiegeBloodRsp = class {
		decode(r) {
			this.todayBlood = r[r3]();
			this.weekBlood = r[r3]();
			return this;
		}
	};
	m = 6006;
	a[n] = m;
	c[m] = a;
	
	a = o.ArenaTeamPlayer = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.rank);
			w[w3](this.score);
			this.brief.encode(w);
		}
		decode(r) {
			this.rank = r[r3]();
			this.score = r[r3]();
			this.brief = new o.RoleBrief().decode(r);
			return this;
		}
	};
	
	a = o.ArenaTeamInfo = class {
		constructor(d) {
			this.players = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.teamId);
			w[w1](this.players.length);
			for (var i = 0, len = this.players.length; i < len; i++) {
				this.players[i].encode(w);   
			}
			w[w3](this.fightTimes);
			w[w3](this.remainChance);
			w[w3](this.addChanceTime);
			w[wy](this.setting);
		}
		decode(r) {
			this.teamId = r[r3]();
			this.players = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.players[i] = new o.ArenaTeamPlayer().decode(r);   
			}
			this.fightTimes = r[r3]();
			this.remainChance = r[r3]();
			this.addChanceTime = r[r3]();
			this.setting = r[ry]();
			return this;
		}
	};
	
	a = o.ArenaTeamMatch = class {
		constructor(d) {
			this.fightResults = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.matchedNum);
			w[w1](this.fightResults.length);
			for (var i = 0, len = this.fightResults.length; i < len; i++) {
				w[wy](this.fightResults[i]);   
			}
			w[wb](this.confirmed);
		}
		decode(r) {
			this.matchedNum = r[r3]();
			this.fightResults = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.fightResults[i] = r[ry]();   
			}
			this.confirmed = r[rb]();
			return this;
		}
	};
	
	a = o.ArenaTeamLegend = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.player.encode(w);
			w[ws](this.guildName);
		}
		decode(r) {
			this.player = new o.ArenaTeamPlayer().decode(r);
			this.guildName = r[rs]();
			return this;
		}
	};
	
	//组队竞技场--队伍信息
	a = o.ArenaTeamInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6101);
			w[fm]();
		}
	};
	m = 6101;
	a[n] = m;
	
	a = o.ArenaTeamInfoRsp = class {
		decode(r) {
			this.legends = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.legends[i] = new o.ArenaTeamLegend().decode(r);   
			}
			this.teamInfo = new o.ArenaTeamInfo().decode(r);
			this.matchInfo = new o.ArenaTeamMatch().decode(r);
			this.fightRewarded = r[r3]();
			this.rankRewarded = r[rb]();
			this.activityId = r[r3]();
			return this;
		}
	};
	m = 6101;
	a[n] = m;
	c[m] = a;
	
	//组队竞技场--可组队玩家列表
	a = o.ArenaTeamPlayersReq = class {
		constructor(d) {
			this.playerIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6102);
			w[w1](this.playerIds.length);
			for (var i = 0, len = this.playerIds.length; i < len; i++) {
				w[w6](this.playerIds[i]);   
			}
			w[ws](this.playerName);
			w[fm]();
		}
	};
	m = 6102;
	a[n] = m;
	
	a = o.ArenaTeamPlayersRsp = class {
		decode(r) {
			this.players = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.players[i] = new o.ArenaTeamPlayer().decode(r);   
			}
			this.playerIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.playerIds[i] = r[r6]();   
			}
			return this;
		}
	};
	m = 6102;
	a[n] = m;
	c[m] = a;
	
	//组队竞技场--邀请玩家
	a = o.ArenaTeamInviteReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6103);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 6103;
	a[n] = m;
	
	a = o.ArenaTeamInviteRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			return this;
		}
	};
	m = 6103;
	a[n] = m;
	c[m] = a;
	
	//组队竞技场--被邀请记录
	a = o.ArenaTeamInvitersReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6104);
			w[fm]();
		}
	};
	m = 6104;
	a[n] = m;
	
	a = o.ArenaTeamInvitersRsp = class {
		decode(r) {
			this.inviters = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.inviters[i] = new o.ArenaTeamPlayer().decode(r);   
			}
			return this;
		}
	};
	m = 6104;
	a[n] = m;
	c[m] = a;
	
	//组队竞技场--同意邀请
	a = o.ArenaTeamAgreeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6105);
			w[w6](this.inviterId);
			w[fm]();
		}
	};
	m = 6105;
	a[n] = m;
	
	a = o.ArenaTeamAgreeRsp = class {
		decode(r) {
			this.teamInfo = new o.ArenaTeamInfo().decode(r);
			return this;
		}
	};
	m = 6105;
	a[n] = m;
	c[m] = a;
	
	//组队竞技场--拒绝邀请
	a = o.ArenaTeamRejectReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6106);
			w[w6](this.inviterId);
			w[fm]();
		}
	};
	m = 6106;
	a[n] = m;
	
	a = o.ArenaTeamRejectRsp = class {
		decode(r) {
			this.inviterId = r[r6]();
			return this;
		}
	};
	m = 6106;
	a[n] = m;
	c[m] = a;
	
	//组队竞技场--退出队伍
	a = o.ArenaTeamQuitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6107);
			w[fm]();
		}
	};
	m = 6107;
	a[n] = m;
	
	a = o.ArenaTeamQuitRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 6107;
	a[n] = m;
	c[m] = a;
	
	//组队竞技场--移除队员
	a = o.ArenaTeamRemoveReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6108);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 6108;
	a[n] = m;
	
	a = o.ArenaTeamRemoveRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			return this;
		}
	};
	m = 6108;
	a[n] = m;
	c[m] = a;
	
	//组队竞技场--移交队长
	a = o.ArenaTeamDemiseReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6109);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 6109;
	a[n] = m;
	
	a = o.ArenaTeamDemiseRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			return this;
		}
	};
	m = 6109;
	a[n] = m;
	c[m] = a;
	
	//组队竞技场--设置选项
	a = o.ArenaTeamSettingReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6110);
			w[wy](this.setting);
			w[fm]();
		}
	};
	m = 6110;
	a[n] = m;
	
	a = o.ArenaTeamSettingRsp = class {
		decode(r) {
			this.setting = r[ry]();
			return this;
		}
	};
	m = 6110;
	a[n] = m;
	c[m] = a;
	
	//组队竞技场--队伍红点
	a = o.ArenaTeamRedPointsRsp = class {
		decode(r) {
			this.type = r[ry]();
			return this;
		}
	};
	m = 6111;
	a[n] = m;
	c[m] = a;
	
	a = o.ArenaTeamRoleBrief = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w3](this.score);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.score = r[r3]();
			return this;
		}
	};
	
	//组队竞技场--匹配对手
	a = o.ArenaTeamMatchReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6112);
			w[wb](this.query);
			w[fm]();
		}
	};
	m = 6112;
	a[n] = m;
	
	a = o.ArenaTeamMatchRsp = class {
		decode(r) {
			this.teammates = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.teammates[i] = new o.ArenaTeamRoleBrief().decode(r);   
			}
			this.opponents = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.opponents[i] = new o.ArenaTeamRoleBrief().decode(r);   
			}
			return this;
		}
	};
	m = 6112;
	a[n] = m;
	c[m] = a;
	
	a = o.ArenaTeamRoleHeroes = class {
		constructor(d) {
			this.heroes = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[ws](this.playerName);
			w[w1](this.heroes.length);
			for (var i = 0, len = this.heroes.length; i < len; i++) {
				this.heroes[i].encode(w);   
			}
		}
		decode(r) {
			this.playerId = r[r6]();
			this.playerName = r[rs]();
			this.heroes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroes[i] = new o.HeroBrief().decode(r);   
			}
			return this;
		}
	};
	
	//组队竞技场--确定对手
	a = o.ArenaTeamConfirmReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6113);
			w[fm]();
		}
	};
	m = 6113;
	a[n] = m;
	
	a = o.ArenaTeamConfirmRsp = class {
		decode(r) {
			this.teammates = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.teammates[i] = new o.ArenaTeamRoleHeroes().decode(r);   
			}
			this.opponents = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.opponents[i] = new o.ArenaTeamRoleHeroes().decode(r);   
			}
			return this;
		}
	};
	m = 6113;
	a[n] = m;
	c[m] = a;
	
	//组队竞技场--设置顺序
	a = o.ArenaTeamFightOrderReq = class {
		constructor(d) {
			this.order = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6114);
			w[w1](this.order.length);
			for (var i = 0, len = this.order.length; i < len; i++) {
				w[w6](this.order[i]);   
			}
			w[fm]();
		}
	};
	m = 6114;
	a[n] = m;
	
	a = o.ArenaTeamFightOrderRsp = class {
		decode(r) {
			this.order = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.order[i] = r[r6]();   
			}
			return this;
		}
	};
	m = 6114;
	a[n] = m;
	c[m] = a;
	
	a = o.ArenaTeamFighter = class {
		constructor(d) {
			this.heroList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[w1](this.heroList.length);
			for (var i = 0, len = this.heroList.length; i < len; i++) {
				if (!this.heroList[i]) {
					w[wb](false);
				} else {
					w[wb](true);
					this.heroList[i].encode(w);
				}   
			}
			if (!this.general) {
				w[wb](false);
			} else {
				w[wb](true);
				this.general.encode(w);
			}
		}
		decode(r) {
			this.playerId = r[r6]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				if (r[rb]()) {
					this.heroList[i] = new o.FightHero().decode(r);
				}   
			}
			if (r[rb]()) {
				this.general = new o.FightGeneral().decode(r);
			}
			return this;
		}
	};
	
	//组队竞技场--战斗开始
	a = o.ArenaTeamFightStartReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6115);
			w[w3](this.index);
			w[fm]();
		}
	};
	m = 6115;
	a[n] = m;
	
	a = o.ArenaTeamFightStartRsp = class {
		decode(r) {
			this.teammate = new o.ArenaTeamFighter().decode(r);
			this.opponent = new o.ArenaTeamFighter().decode(r);
			return this;
		}
	};
	m = 6115;
	a[n] = m;
	c[m] = a;
	
	a = o.ArenaTeamFightResult = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[w3](this.newScore);
			w[w3](this.oldScore);
			w[w3](this.newRank);
			w[w3](this.oldRank);
		}
		decode(r) {
			this.playerId = r[r6]();
			this.newScore = r[r3]();
			this.oldScore = r[r3]();
			this.newRank = r[r3]();
			this.oldRank = r[r3]();
			return this;
		}
	};
	
	//组队竞技场--战斗结束
	a = o.ArenaTeamFightOverReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6116);
			w[w3](this.index);
			w[wb](this.isWin);
			w[fm]();
		}
	};
	m = 6116;
	a[n] = m;
	
	a = o.ArenaTeamFightOverRsp = class {
		decode(r) {
			this.index = r[r3]();
			this.isWin = r[rb]();
			this.results = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.results[i] = new o.ArenaTeamFightResult().decode(r);   
			}
			return this;
		}
	};
	m = 6116;
	a[n] = m;
	c[m] = a;
	
	a = o.ArenaTeamRecordTeammate = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[w3](this.head);
			w[w3](this.frame);
			w[w3](this.level);
			w[w3](this.newScore);
			w[w3](this.oldScore);
			w[w3](this.newRank);
			w[w3](this.oldRank);
		}
		decode(r) {
			this.playerId = r[r6]();
			this.head = r[r3]();
			this.frame = r[r3]();
			this.level = r[r3]();
			this.newScore = r[r3]();
			this.oldScore = r[r3]();
			this.newRank = r[r3]();
			this.oldRank = r[r3]();
			return this;
		}
	};
	
	a = o.ArenaTeamRecordOpponent = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[w3](this.head);
			w[w3](this.frame);
			w[w3](this.level);
		}
		decode(r) {
			this.playerId = r[r6]();
			this.head = r[r3]();
			this.frame = r[r3]();
			this.level = r[r3]();
			return this;
		}
	};
	
	a = o.ArenaTeamFightRecord = class {
		constructor(d) {
			this.teammates = [];
			this.opponents = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w1](this.teammates.length);
			for (var i = 0, len = this.teammates.length; i < len; i++) {
				this.teammates[i].encode(w);   
			}
			w[w1](this.opponents.length);
			for (var i = 0, len = this.opponents.length; i < len; i++) {
				this.opponents[i].encode(w);   
			}
			w[w3](this.teammatesPower);
			w[w3](this.opponentsPower);
			w[wb](this.isFightWin);
		}
		decode(r) {
			this.teammates = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.teammates[i] = new o.ArenaTeamRecordTeammate().decode(r);   
			}
			this.opponents = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.opponents[i] = new o.ArenaTeamRecordOpponent().decode(r);   
			}
			this.teammatesPower = r[r3]();
			this.opponentsPower = r[r3]();
			this.isFightWin = r[rb]();
			return this;
		}
	};
	
	//组队竞技场--战斗记录
	a = o.ArenaTeamFightRecordsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6117);
			w[fm]();
		}
	};
	m = 6117;
	a[n] = m;
	
	a = o.ArenaTeamFightRecordsRsp = class {
		decode(r) {
			this.records = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.records[i] = new o.ArenaTeamFightRecord().decode(r);   
			}
			return this;
		}
	};
	m = 6117;
	a[n] = m;
	c[m] = a;
	
	//组队竞技场--挑战奖励
	a = o.ArenaTeamFightRewardsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6118);
			w[w3](this.index);
			w[fm]();
		}
	};
	m = 6118;
	a[n] = m;
	
	a = o.ArenaTeamFightRewardsRsp = class {
		decode(r) {
			this.index = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6118;
	a[n] = m;
	c[m] = a;
	
	//组队竞技场--排名奖励
	a = o.ArenaTeamRankRewardsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6119);
			w[fm]();
		}
	};
	m = 6119;
	a[n] = m;
	
	a = o.ArenaTeamRankRewardsRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6119;
	a[n] = m;
	c[m] = a;
	
	//组队竞技场--查看排行榜
	a = o.ArenaTeamRankListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6120);
			w[fm]();
		}
	};
	m = 6120;
	a[n] = m;
	
	a = o.ArenaTeamRankListRsp = class {
		decode(r) {
			this.rankList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rankList[i] = new o.ArenaTeamPlayer().decode(r);   
			}
			this.selfRank = r[r3]();
			this.selfScore = r[r3]();
			this.serverNum = r[r3]();
			return this;
		}
	};
	m = 6120;
	a[n] = m;
	c[m] = a;
	
	a = o.PeakHero = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.typeId);
			w[w3](this.level);
			w[w3](this.soldierId);
			w[wy](this.star);
			w[w3](this.careerLv);
			w[w3](this.power);
			w[wy](this.careerType);
			w[w3](this.careerId);
		}
		decode(r) {
			this.typeId = r[r3]();
			this.level = r[r3]();
			this.soldierId = r[r3]();
			this.star = r[ry]();
			this.careerLv = r[r3]();
			this.power = r[r3]();
			this.careerType = r[ry]();
			this.careerId = r[r3]();
			return this;
		}
	};
	
	//巅峰之战--状态
	a = o.PeakStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6201);
			w[fm]();
		}
	};
	m = 6201;
	a[n] = m;
	
	a = o.PeakStateRsp = class {
		decode(r) {
			this.points = r[r3]();
			this.enterTimes = r[r3]();
			this.totalEnterTimes = r[r3]();
			this.displaceTimes = r[r3]();
			this.heroes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroes[i] = new o.PeakHero().decode(r);   
			}
			this.heroIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroIds[i] = r[r3]();   
			}
			this.gradeReward = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.gradeReward[i] = r[ry]();   
			}
			this.gradeHero = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.gradeHero[i] = r[ry]();   
			}
			this.challenge = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.challenge[i] = r[ry]();   
			}
			this.rank = r[r3]();
			this.maxRank = r[r3]();
			this.rankNumber = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rankNumber[i] = r[r3]();   
			}
			this.buyEnterTimes = r[r3]();
			this.serverNum = r[r3]();
			this.matchingTimes = r[r3]();
			return this;
		}
	};
	m = 6201;
	a[n] = m;
	c[m] = a;
	
	//巅峰之战--英雄上阵
	a = o.PeakHeroOnReq = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6202);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
			w[fm]();
		}
	};
	m = 6202;
	a[n] = m;
	
	a = o.PeakHeroOnRsp = class {
		decode(r) {
			this.heroIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroIds[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 6202;
	a[n] = m;
	c[m] = a;
	
	//巅峰之战--匹配
	a = o.PeakMatchingReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6203);
			w[fm]();
		}
	};
	m = 6203;
	a[n] = m;
	
	a = o.PeakMatchingRsp = class {
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.points = r[r3]();
			this.rank = r[r3]();
			this.heroes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroes[i] = new o.PeakHero().decode(r);   
			}
			return this;
		}
	};
	m = 6203;
	a[n] = m;
	c[m] = a;
	
	a = o.PeakEnterHeroes = class {
		constructor(d) {
			this.heroList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[w1](this.heroList.length);
			for (var i = 0, len = this.heroList.length; i < len; i++) {
				this.heroList[i].encode(w);   
			}
			if (!this.general) {
				w[wb](false);
			} else {
				w[wb](true);
				this.general.encode(w);
			}
		}
		decode(r) {
			this.playerId = r[r6]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroList[i] = new o.FightHero().decode(r);   
			}
			if (r[rb]()) {
				this.general = new o.FightGeneral().decode(r);
			}
			return this;
		}
	};
	
	//巅峰之战--购买战斗次数
	a = o.PeakBuyEnterTimeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6204);
			w[fm]();
		}
	};
	m = 6204;
	a[n] = m;
	
	a = o.PeakBuyEnterTimeRsp = class {
		decode(r) {
			this.buyEnterTimes = r[r3]();
			return this;
		}
	};
	m = 6204;
	a[n] = m;
	c[m] = a;
	
	//巅峰之战--进入战斗
	a = o.PeakEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6205);
			w[fm]();
		}
	};
	m = 6205;
	a[n] = m;
	
	a = o.PeakEnterRsp = class {
		decode(r) {
			this.enterTimes = r[r3]();
			return this;
		}
	};
	m = 6205;
	a[n] = m;
	c[m] = a;
	
	//巅峰之战--获取战斗数据
	a = o.PeakFightReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6206);
			w[fm]();
		}
	};
	m = 6206;
	a[n] = m;
	
	a = o.PeakFightRsp = class {
		decode(r) {
			this.mine = new o.PeakEnterHeroes().decode(r);
			this.enemy = new o.PeakEnterHeroes().decode(r);
			return this;
		}
	};
	m = 6206;
	a[n] = m;
	c[m] = a;
	
	//巅峰之战--退出战斗
	a = o.PeakExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6207);
			w[wb](this.clear);
			w[fm]();
		}
	};
	m = 6207;
	a[n] = m;
	
	a = o.PeakExitRsp = class {
		decode(r) {
			this.enterTimes = r[r3]();
			this.points = r[r3]();
			this.rank = r[r3]();
			this.addPoints = r[r3]();
			this.rankBf = r[r3]();
			this.rankingBf = r[r3]();
			this.ranking = r[r3]();
			return this;
		}
	};
	m = 6207;
	a[n] = m;
	c[m] = a;
	
	//巅峰之战--挑战奖励，段位奖励
	a = o.PeakRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6208);
			w[wy](this.career);
			w[w3](this.heroId);
			w[w3](this.times);
			w[w3](this.grade);
			w[fm]();
		}
	};
	m = 6208;
	a[n] = m;
	
	a = o.PeakRewardRsp = class {
		decode(r) {
			this.gradeReward = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.gradeReward[i] = r[ry]();   
			}
			this.gradeHero = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.gradeHero[i] = r[ry]();   
			}
			this.challenge = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.challenge[i] = r[ry]();   
			}
			this.heroes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroes[i] = new o.PeakHero().decode(r);   
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6208;
	a[n] = m;
	c[m] = a;
	
	//巅峰之战--英雄置换记录
	a = o.PeakHeroDisplaceRecordReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6209);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 6209;
	a[n] = m;
	
	a = o.PeakHeroDisplaceRecordRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.hero = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.hero[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 6209;
	a[n] = m;
	c[m] = a;
	
	//巅峰之战--英雄置换
	a = o.PeakHeroDisplaceReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6210);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 6210;
	a[n] = m;
	
	a = o.PeakHeroDisplaceRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.displaceTimes = r[r3]();
			this.hero = new o.PeakHero().decode(r);
			return this;
		}
	};
	m = 6210;
	a[n] = m;
	c[m] = a;
	
	//巅峰之战--英雄置换确认
	a = o.PeakHeroDisplaceConfirmReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6211);
			w[fm]();
		}
	};
	m = 6211;
	a[n] = m;
	
	a = o.PeakHeroDisplaceConfirmRsp = class {
		decode(r) {
			this.hero = new o.PeakHero().decode(r);
			return this;
		}
	};
	m = 6211;
	a[n] = m;
	c[m] = a;
	
	//巅峰之战--重置英雄置换记录
	a = o.PeakHeroResetDisplaceRecordReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6212);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 6212;
	a[n] = m;
	
	a = o.PeakHeroResetDisplaceRecordRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.hero = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.hero[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 6212;
	a[n] = m;
	c[m] = a;
	
	a = o.PeakRecord = class {
		constructor(d) {
			this.brief = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w1](this.brief.length);
			for (var i = 0, len = this.brief.length; i < len; i++) {
				this.brief[i].encode(w);   
			}
			w[w3](this.time);
			w[w3](this.points);
			w[w3](this.rank);
			w[w3](this.addPoints);
			w[w3](this.enemyPoints);
			w[w3](this.enemyRank);
			w[w3](this.enemyAddPoints);
		}
		decode(r) {
			this.brief = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.brief[i] = new o.RoleBrief().decode(r);   
			}
			this.time = r[r3]();
			this.points = r[r3]();
			this.rank = r[r3]();
			this.addPoints = r[r3]();
			this.enemyPoints = r[r3]();
			this.enemyRank = r[r3]();
			this.enemyAddPoints = r[r3]();
			return this;
		}
	};
	
	//巅峰之战--记录
	a = o.PeakRecordReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6213);
			w[fm]();
		}
	};
	m = 6213;
	a[n] = m;
	
	a = o.PeakRecordRsp = class {
		decode(r) {
			this.records = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.records[i] = new o.PeakRecord().decode(r);   
			}
			return this;
		}
	};
	m = 6213;
	a[n] = m;
	c[m] = a;
	
	a = o.PeakRankingBrief = class {
		constructor(d) {
			this.heroes = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w3](this.points);
			w[w3](this.rank);
			w[w1](this.heroes.length);
			for (var i = 0, len = this.heroes.length; i < len; i++) {
				this.heroes[i].encode(w);   
			}
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.points = r[r3]();
			this.rank = r[r3]();
			this.heroes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroes[i] = new o.PeakHero().decode(r);   
			}
			return this;
		}
	};
	
	//巅峰之战--排行榜
	a = o.PeakRankingReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6214);
			w[fm]();
		}
	};
	m = 6214;
	a[n] = m;
	
	a = o.PeakRankingRsp = class {
		decode(r) {
			this.mine = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.PeakRankingBrief().decode(r);   
			}
			return this;
		}
	};
	m = 6214;
	a[n] = m;
	c[m] = a;
	
	//巅峰之战--名片英雄信息
	a = o.PeakHeroImageReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6215);
			w[w3](this.heroId);
			w[wy](this.careerType);
			w[w3](this.careerId);
			w[fm]();
		}
	};
	m = 6215;
	a[n] = m;
	
	a = o.PeakHeroImageRsp = class {
		decode(r) {
			this.hero = new o.HeroImage().decode(r);
			this.careerType = r[ry]();
			return this;
		}
	};
	m = 6215;
	a[n] = m;
	c[m] = a;
	
	//巅峰之战--转职
	a = o.PeakHeroCareerReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6216);
			w[w3](this.heroId);
			w[w3](this.careerId);
			w[fm]();
		}
	};
	m = 6216;
	a[n] = m;
	
	a = o.PeakHeroCareerRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 6216;
	a[n] = m;
	c[m] = a;
	
	//兵团--状态
	a = o.SoldierSkinStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6301);
			w[fm]();
		}
	};
	m = 6301;
	a[n] = m;
	
	a = o.SoldierSkinStateRsp = class {
		decode(r) {
			this.skins = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.skins[i] = r[r3]();   
			}
			this.trammels = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.trammels[i] = r[r3]();   
			}
			this.level = r[r3]();
			return this;
		}
	};
	m = 6301;
	a[n] = m;
	c[m] = a;
	
	//兵团--激活精甲
	a = o.SoldierSkinActiveReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6302);
			w[w3](this.skinId);
			w[fm]();
		}
	};
	m = 6302;
	a[n] = m;
	
	a = o.SoldierSkinActiveRsp = class {
		decode(r) {
			this.skinId = r[r3]();
			this.skins = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.skins[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 6302;
	a[n] = m;
	c[m] = a;
	
	//兵团--激活羁绊
	a = o.SoldierSkinActiveTrammelReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6303);
			w[w3](this.trammelId);
			w[fm]();
		}
	};
	m = 6303;
	a[n] = m;
	
	a = o.SoldierSkinActiveTrammelRsp = class {
		decode(r) {
			this.trammels = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.trammels[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 6303;
	a[n] = m;
	c[m] = a;
	
	a = o.SoldierSkin = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.heroId);
			w[w3](this.skinId);
		}
		decode(r) {
			this.heroId = r[r3]();
			this.skinId = r[r3]();
			return this;
		}
	};
	
	//兵团--精甲穿戴
	a = o.SoldierSkinOnReq = class {
		constructor(d) {
			this.heroes = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6304);
			w[w1](this.heroes.length);
			for (var i = 0, len = this.heroes.length; i < len; i++) {
				this.heroes[i].encode(w);   
			}
			w[fm]();
		}
	};
	m = 6304;
	a[n] = m;
	
	//兵团--英雄精甲变换会主动推送（下阵、更换士兵等）
	a = o.SoldierSkinOnRsp = class {
		decode(r) {
			this.heroes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroes[i] = new o.SoldierSkin().decode(r);   
			}
			return this;
		}
	};
	m = 6304;
	a[n] = m;
	c[m] = a;
	
	//兵团--融甲
	a = o.SoldierSkinComposeReq = class {
		constructor(d) {
			this.items = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6305);
			w[w1](this.items.length);
			for (var i = 0, len = this.items.length; i < len; i++) {
				this.items[i].encode(w);   
			}
			w[fm]();
		}
	};
	m = 6305;
	a[n] = m;
	
	//兵团--融甲
	a = o.SoldierSkinComposeRsp = class {
		decode(r) {
			this.level = r[r3]();
			return this;
		}
	};
	m = 6305;
	a[n] = m;
	c[m] = a;
	
	a = o.Rune2Info = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.type);
			w[w3](this.upgradeLv);
			w[w3](this.refineLv);
			w[w3](this.bless);
		}
		decode(r) {
			this.id = r[r3]();
			this.type = r[r3]();
			this.upgradeLv = r[r3]();
			this.refineLv = r[r3]();
			this.bless = r[r3]();
			return this;
		}
	};
	
	//符文2--列表
	a = o.Rune2ListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6401);
			w[fm]();
		}
	};
	m = 6401;
	a[n] = m;
	
	a = o.Rune2ListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.Rune2Info().decode(r);   
			}
			return this;
		}
	};
	m = 6401;
	a[n] = m;
	c[m] = a;
	
	//符文2--分解
	a = o.Rune2BreakDownReq = class {
		constructor(d) {
			this.runeIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6402);
			w[w1](this.runeIds.length);
			for (var i = 0, len = this.runeIds.length; i < len; i++) {
				w[w3](this.runeIds[i]);   
			}
			w[fm]();
		}
	};
	m = 6402;
	a[n] = m;
	
	a = o.Rune2BreakDownRsp = class {
		decode(r) {
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6402;
	a[n] = m;
	c[m] = a;
	
	//符文2--合成
	a = o.Rune2ComposeReq = class {
		constructor(d) {
			this.staffList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6403);
			w[w3](this.heroId);
			w[w3](this.targetType);
			w[w1](this.staffList.length);
			for (var i = 0, len = this.staffList.length; i < len; i++) {
				w[w3](this.staffList[i]);   
			}
			w[fm]();
		}
	};
	m = 6403;
	a[n] = m;
	
	a = o.Rune2ComposeRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.newRune = new o.Rune2Info().decode(r);
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6403;
	a[n] = m;
	c[m] = a;
	
	//符文2--穿戴，卸下，更换
	a = o.Rune2OnReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6404);
			w[w3](this.heroId);
			w[wy](this.index);
			w[w3](this.runeId);
			w[fm]();
		}
	};
	m = 6404;
	a[n] = m;
	
	// 强化、分解英雄身上的符文会推送这个协议
	a = o.Rune2OnRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.runes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.runes[i] = new o.Rune2Info().decode(r);   
			}
			return this;
		}
	};
	m = 6404;
	a[n] = m;
	c[m] = a;
	
	a = o.Rune2UpdateRsp = class {
		decode(r) {
			this.updateList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.updateList[i] = new o.Rune2Info().decode(r);   
			}
			this.deleteList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.deleteList[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 6405;
	a[n] = m;
	c[m] = a;
	
	//符文2--强化
	a = o.Rune2UpgradeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6406);
			w[w3](this.heroId);
			w[w3](this.runeId);
			w[wb](this.toTop);
			w[fm]();
		}
	};
	m = 6406;
	a[n] = m;
	
	a = o.Rune2UpgradeRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.runeId = r[r3]();
			this.oldLevel = r[r3]();
			this.newLevel = r[r3]();
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6406;
	a[n] = m;
	c[m] = a;
	
	//符文2--融合
	a = o.Rune2MixReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6407);
			w[w3](this.heroId);
			w[w3](this.mainRuneId);
			w[w3](this.subRuneId);
			w[fm]();
		}
	};
	m = 6407;
	a[n] = m;
	
	a = o.Rune2MixRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.rune = new o.Rune2Info().decode(r);
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6407;
	a[n] = m;
	c[m] = a;
	
	//符文2--洗练
	a = o.Rune2RefineReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6408);
			w[w3](this.heroId);
			w[w3](this.runeId);
			w[wy](this.refineType);
			w[fm]();
		}
	};
	m = 6408;
	a[n] = m;
	
	a = o.Rune2RefineRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.runeId = r[r3]();
			this.oldLevel = r[r3]();
			this.newLevel = r[r3]();
			this.refineType = r[ry]();
			this.goodsList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goodsList[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6408;
	a[n] = m;
	c[m] = a;
	
	a = o.CrossTreasureOrderName = class {
		constructor(d) {
			this.names = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.order);
			w[w1](this.names.length);
			for (var i = 0, len = this.names.length; i < len; i++) {
				w[ws](this.names[i]);   
			}
		}
		decode(r) {
			this.order = r[ry]();
			this.names = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.names[i] = r[rs]();   
			}
			return this;
		}
	};
	
	//跨服寻宝-数量信息，主动推送
	//玩家登录,订阅SystemSubscribeReq信息,离开或者关闭游戏取消订阅
	a = o.CrossTreasureNumRsp = class {
		decode(r) {
			this.dayRound = r[r3]();
			this.refreshTime = r[r3]();
			this.itemNum = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.itemNum[i] = r[r3]();   
			}
			this.record = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.record[i] = new o.CrossTreasureRecord().decode(r);   
			}
			this.orderName = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.orderName[i] = new o.CrossTreasureOrderName().decode(r);   
			}
			return this;
		}
	};
	m = 6501;
	a[n] = m;
	c[m] = a;
	
	//跨服寻宝-首次进入页面时请求
	a = o.CrossTreasureStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6502);
			w[fm]();
		}
	};
	m = 6502;
	a[n] = m;
	
	a = o.CrossTreasureStateRsp = class {
		decode(r) {
			this.dayRound = r[r3]();
			this.round = r[r3]();
			this.freeNum = r[r3]();
			this.refreshTime = r[r3]();
			this.itemNum = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.itemNum[i] = r[r3]();   
			}
			this.orderName = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.orderName[i] = new o.CrossTreasureOrderName().decode(r);   
			}
			return this;
		}
	};
	m = 6502;
	a[n] = m;
	c[m] = a;
	
	a = o.CrossTreasure = class {
		constructor(d) {
			this.rewards = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.order);
			w[w1](this.rewards.length);
			for (var i = 0, len = this.rewards.length; i < len; i++) {
				this.rewards[i].encode(w);   
			}
		}
		decode(r) {
			this.order = r[ry]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	
	//跨服寻宝-抽奖
	a = o.CrossTreasureReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6503);
			w[w3](this.num);
			w[fm]();
		}
	};
	m = 6503;
	a[n] = m;
	
	a = o.CrossTreasureRsp = class {
		decode(r) {
			this.freeNum = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.CrossTreasure().decode(r);   
			}
			return this;
		}
	};
	m = 6503;
	a[n] = m;
	c[m] = a;
	
	a = o.CrossTreasureRecord = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[ws](this.playerName);
			w[w3](this.itemId);
			w[w3](this.time);
			w[wy](this.type);
			w[w3](this.leftTimes);
		}
		decode(r) {
			this.playerName = r[rs]();
			this.itemId = r[r3]();
			this.time = r[r3]();
			this.type = r[ry]();
			this.leftTimes = r[r3]();
			return this;
		}
	};
	
	//跨服寻宝-抽奖记录
	a = o.CrossTreasureRecordListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6504);
			w[fm]();
		}
	};
	m = 6504;
	a[n] = m;
	
	a = o.CrossTreasureRecordListRsp = class {
		decode(r) {
			this.record = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.record[i] = new o.CrossTreasureRecord().decode(r);   
			}
			return this;
		}
	};
	m = 6504;
	a[n] = m;
	c[m] = a;
	
	//守护者--召唤状态
	a = o.GuardianDrawStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6601);
			w[fm]();
		}
	};
	m = 6601;
	a[n] = m;
	
	a = o.GuardianDrawStateRsp = class {
		decode(r) {
			this.wishItemId = r[r3]();
			this.drawnNum = r[r3]();
			this.numByGems = r[r3]();
			this.cumAwardFlag = r[r3]();
			this.cumIsMonthGain = r[rb]();
			return this;
		}
	};
	m = 6601;
	a[n] = m;
	c[m] = a;
	
	//守护者--召唤
	a = o.GuardianDrawReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6602);
			w[w3](this.type);
			w[fm]();
		}
	};
	m = 6602;
	a[n] = m;
	
	a = o.GuardianDrawRsp = class {
		decode(r) {
			this.type = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6602;
	a[n] = m;
	c[m] = a;
	
	//守护者--许愿
	a = o.GuardianWishReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6603);
			w[w3](this.itemId);
			w[fm]();
		}
	};
	m = 6603;
	a[n] = m;
	
	a = o.GuardianWishRsp = class {
		decode(r) {
			this.itemId = r[r3]();
			return this;
		}
	};
	m = 6603;
	a[n] = m;
	c[m] = a;
	
	//守护者--累计次数奖励
	a = o.GuardianCumAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6604);
			w[w3](this.index);
			w[fm]();
		}
	};
	m = 6604;
	a[n] = m;
	
	a = o.GuardianCumAwardRsp = class {
		decode(r) {
			this.index = r[r3]();
			this.drawnNum = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6604;
	a[n] = m;
	c[m] = a;
	
	//守护者副本--信息
	a = o.GuardianCopyStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6605);
			w[fm]();
		}
	};
	m = 6605;
	a[n] = m;
	
	a = o.GuardianCopyStateRsp = class {
		decode(r) {
			this.open = r[rb]();
			this.maxStageId = r[r3]();
			this.raidNum = r[r3]();
			return this;
		}
	};
	m = 6605;
	a[n] = m;
	c[m] = a;
	
	//守护者副本--进入战斗
	a = o.GuardianCopyEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6606);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 6606;
	a[n] = m;
	
	a = o.GuardianCopyEnterRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			return this;
		}
	};
	m = 6606;
	a[n] = m;
	c[m] = a;
	
	//守护者副本--结束战斗
	a = o.GuardianCopyExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6607);
			w[w3](this.stageId);
			w[wb](this.clear);
			w[fm]();
		}
	};
	m = 6607;
	a[n] = m;
	
	a = o.GuardianCopyExitRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6607;
	a[n] = m;
	c[m] = a;
	
	//守护者副本--扫荡
	a = o.GuardianCopyRaidReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6608);
			w[wb](this.all);
			w[fm]();
		}
	};
	m = 6608;
	a[n] = m;
	
	a = o.GuardianCopyRaidRsp = class {
		decode(r) {
			this.raidNum = r[r3]();
			this.stageId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6608;
	a[n] = m;
	c[m] = a;
	
	a = o.Guardian = class {
		constructor(d) {
			this.equips = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.type);
			w[w3](this.star);
			w[w3](this.level);
			w[w1](this.equips.length);
			for (var i = 0, len = this.equips.length; i < len; i++) {
				this.equips[i].encode(w);   
			}
		}
		decode(r) {
			this.id = r[r3]();
			this.type = r[r3]();
			this.star = r[r3]();
			this.level = r[r3]();
			this.equips = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.equips[i] = new o.GuardianEquip().decode(r);   
			}
			return this;
		}
	};
	
	//守护者系统--列表
	a = o.GuardianListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6609);
			w[fm]();
		}
	};
	m = 6609;
	a[n] = m;
	
	a = o.GuardianListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.Guardian().decode(r);   
			}
			return this;
		}
	};
	m = 6609;
	a[n] = m;
	c[m] = a;
	
	//守护者系统--升级
	a = o.GuardianLevelUpReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6610);
			w[w3](this.heroId);
			w[w3](this.guardianId);
			w[fm]();
		}
	};
	m = 6610;
	a[n] = m;
	
	a = o.GuardianLevelUpRsp = class {
		decode(r) {
			if (r[rb]()) {
				this.heroInfo = new o.HeroInfo().decode(r);
			}
			if (r[rb]()) {
				this.guardian = new o.Guardian().decode(r);
			}
			return this;
		}
	};
	m = 6610;
	a[n] = m;
	c[m] = a;
	
	//守护者系统--升星
	a = o.GuardianStarUpReq = class {
		constructor(d) {
			this.stuffIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6611);
			w[w3](this.heroId);
			w[w3](this.guardianId);
			w[w1](this.stuffIds.length);
			for (var i = 0, len = this.stuffIds.length; i < len; i++) {
				w[w3](this.stuffIds[i]);   
			}
			w[fm]();
		}
	};
	m = 6611;
	a[n] = m;
	
	a = o.GuardianStarUpRsp = class {
		decode(r) {
			if (r[rb]()) {
				this.heroInfo = new o.HeroInfo().decode(r);
			}
			if (r[rb]()) {
				this.guardian = new o.Guardian().decode(r);
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6611;
	a[n] = m;
	c[m] = a;
	
	//守护者系统--出战
	a = o.GuardianPutOnReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6612);
			w[w3](this.heroId);
			w[w3](this.guardianId);
			w[fm]();
		}
	};
	m = 6612;
	a[n] = m;
	
	a = o.GuardianPutOnRsp = class {
		decode(r) {
			this.hero = new o.HeroInfo().decode(r);
			return this;
		}
	};
	m = 6612;
	a[n] = m;
	c[m] = a;
	
	//守护者系统--卸下
	a = o.GuardianTakeOffReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6613);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 6613;
	a[n] = m;
	
	a = o.GuardianTakeOffRsp = class {
		decode(r) {
			this.hero = new o.HeroInfo().decode(r);
			return this;
		}
	};
	m = 6613;
	a[n] = m;
	c[m] = a;
	
	//守护者系统--分解
	a = o.GuardianDecomposeReq = class {
		constructor(d) {
			this.ids = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6614);
			w[w1](this.ids.length);
			for (var i = 0, len = this.ids.length; i < len; i++) {
				w[w3](this.ids[i]);   
			}
			w[fm]();
		}
	};
	m = 6614;
	a[n] = m;
	
	a = o.GuardianDecomposeRsp = class {
		decode(r) {
			this.ids = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.ids[i] = r[r3]();   
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6614;
	a[n] = m;
	c[m] = a;
	
	//守护者系统--更新背包
	a = o.GuardianUpdateRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.Guardian().decode(r);   
			}
			this.delete = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.delete[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 6615;
	a[n] = m;
	c[m] = a;
	
	//守护者装备结构
	a = o.GuardianEquip = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.type);
			w[w3](this.star);
			w[w3](this.level);
		}
		decode(r) {
			this.id = r[r3]();
			this.type = r[r3]();
			this.star = r[r3]();
			this.level = r[r3]();
			return this;
		}
	};
	
	a = o.GuardianInHero = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.heroId);
			w[w3](this.guardianId);
		}
		decode(r) {
			this.heroId = r[r3]();
			this.guardianId = r[r3]();
			return this;
		}
	};
	
	a = o.GuardianEquipWithPart = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.equipId);
			w[wy](this.part);
		}
		decode(r) {
			this.equipId = r[r3]();
			this.part = r[ry]();
			return this;
		}
	};
	
	//守护者装备--列表
	a = o.GuardianEquipListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6616);
			w[fm]();
		}
	};
	m = 6616;
	a[n] = m;
	
	a = o.GuardianEquipListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GuardianEquip().decode(r);   
			}
			return this;
		}
	};
	m = 6616;
	a[n] = m;
	c[m] = a;
	
	//守护者装备--穿戴
	a = o.GuardianEquipOnReq = class {
		constructor(d) {
			this.equipList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6617);
			this.target.encode(w);
			w[w1](this.equipList.length);
			for (var i = 0, len = this.equipList.length; i < len; i++) {
				this.equipList[i].encode(w);   
			}
			w[fm]();
		}
	};
	m = 6617;
	a[n] = m;
	
	a = o.GuardianEquipOnRsp = class {
		decode(r) {
			this.guardian = new o.Guardian().decode(r);
			return this;
		}
	};
	m = 6617;
	a[n] = m;
	c[m] = a;
	
	// 守护者装备--脱下
	a = o.GuardianEquipOffReq = class {
		constructor(d) {
			this.part = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6618);
			this.target.encode(w);
			w[w1](this.part.length);
			for (var i = 0, len = this.part.length; i < len; i++) {
				w[wy](this.part[i]);   
			}
			w[fm]();
		}
	};
	m = 6618;
	a[n] = m;
	
	a = o.GuardianEquipOffRsp = class {
		decode(r) {
			this.guardian = new o.Guardian().decode(r);
			return this;
		}
	};
	m = 6618;
	a[n] = m;
	c[m] = a;
	
	//守护者装备--更新
	a = o.GuardianEquipUpdateRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GuardianEquip().decode(r);   
			}
			this.delete = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.delete[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 6619;
	a[n] = m;
	c[m] = a;
	
	//守护者装备--分解
	a = o.GuardianEquipDecomposeReq = class {
		constructor(d) {
			this.list = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6620);
			w[w1](this.list.length);
			for (var i = 0, len = this.list.length; i < len; i++) {
				w[w3](this.list[i]);   
			}
			w[fm]();
		}
	};
	m = 6620;
	a[n] = m;
	
	a = o.GuardianEquipDecomposeRsp = class {
		decode(r) {
			this.ids = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.ids[i] = r[r3]();   
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6620;
	a[n] = m;
	c[m] = a;
	
	//守护者装备--强化
	a = o.GuardianEquipLevelUpReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6621);
			this.target.encode(w);
			w[wy](this.part);
			w[wb](this.top);
			w[fm]();
		}
	};
	m = 6621;
	a[n] = m;
	
	a = o.GuardianEquipLevelUpRsp = class {
		decode(r) {
			this.guardian = new o.Guardian().decode(r);
			this.oldLv = r[r3]();
			this.newLv = r[r3]();
			return this;
		}
	};
	m = 6621;
	a[n] = m;
	c[m] = a;
	
	//守护者装备--突破
	a = o.GuardianEquipStarUpReq = class {
		constructor(d) {
			this.cost1 = [];
			this.cost2 = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6622);
			this.target.encode(w);
			w[wy](this.part);
			w[w1](this.cost1.length);
			for (var i = 0, len = this.cost1.length; i < len; i++) {
				w[w3](this.cost1[i]);   
			}
			w[w1](this.cost2.length);
			for (var i = 0, len = this.cost2.length; i < len; i++) {
				this.cost2[i].encode(w);   
			}
			w[fm]();
		}
	};
	m = 6622;
	a[n] = m;
	
	a = o.GuardianEquipStarUpRsp = class {
		decode(r) {
			this.guardian = new o.Guardian().decode(r);
			this.oldStar = r[r3]();
			this.newStar = r[r3]();
			return this;
		}
	};
	m = 6622;
	a[n] = m;
	c[m] = a;
	
	//守护者秘境--状态
	a = o.GuardianTowerStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6623);
			w[fm]();
		}
	};
	m = 6623;
	a[n] = m;
	
	a = o.GuardianTowerStateRsp = class {
		decode(r) {
			this.open = r[rb]();
			this.maxStageId = r[r3]();
			this.raidNum = r[r3]();
			this.buyRaidNum = r[r3]();
			this.mineRank = r[r3]();
			this.serverNm = r[r3]();
			return this;
		}
	};
	m = 6623;
	a[n] = m;
	c[m] = a;
	
	//守护者秘境--进入战斗
	a = o.GuardianTowerEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6624);
			w[w3](this.stageId);
			w[fm]();
		}
	};
	m = 6624;
	a[n] = m;
	
	a = o.GuardianTowerEnterRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.enemy = new o.ArenaFighter().decode(r);
			return this;
		}
	};
	m = 6624;
	a[n] = m;
	c[m] = a;
	
	//守护者秘境--结束战斗
	a = o.GuardianTowerExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6625);
			w[w3](this.stageId);
			w[wb](this.clear);
			w[fm]();
		}
	};
	m = 6625;
	a[n] = m;
	
	a = o.GuardianTowerExitRsp = class {
		decode(r) {
			this.stageId = r[r3]();
			this.rankMine = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6625;
	a[n] = m;
	c[m] = a;
	
	//守护者秘境--一键扫荡
	a = o.GuardianTowerRaidReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6626);
			w[fm]();
		}
	};
	m = 6626;
	a[n] = m;
	
	a = o.GuardianTowerRaidRsp = class {
		decode(r) {
			this.raidNum = r[r3]();
			this.buyRaidNum = r[r3]();
			this.stageId = r[r3]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6626;
	a[n] = m;
	c[m] = a;
	
	//守护者秘境--购买扫荡次数
	a = o.GuardianTowerRaidBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6627);
			w[fm]();
		}
	};
	m = 6627;
	a[n] = m;
	
	a = o.GuardianTowerRaidBuyRsp = class {
		decode(r) {
			this.buyRaidNum = r[r3]();
			return this;
		}
	};
	m = 6627;
	a[n] = m;
	c[m] = a;
	
	a = o.GuardianTowerRankBrief = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w3](this.layer);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.layer = r[r3]();
			return this;
		}
	};
	
	//守护者秘境--排行榜
	a = o.GuardianTowerRankListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6628);
			w[fm]();
		}
	};
	m = 6628;
	a[n] = m;
	
	a = o.GuardianTowerRankListRsp = class {
		decode(r) {
			this.serverNum = r[r3]();
			this.mine = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GuardianTowerRankBrief().decode(r);   
			}
			return this;
		}
	};
	m = 6628;
	a[n] = m;
	c[m] = a;
	
	//守护者-守护者回退预览
	a = o.GuardianFallbackPreviewReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6629);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 6629;
	a[n] = m;
	
	a = o.GuardianFallbackPreviewRsp = class {
		decode(r) {
			this.guardian = new o.Guardian().decode(r);
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			this.equips = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.equips[i] = new o.GuardianEquip().decode(r);   
			}
			return this;
		}
	};
	m = 6629;
	a[n] = m;
	c[m] = a;
	
	//守护者-守护者回退
	a = o.GuardianFallbackReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6630);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 6630;
	a[n] = m;
	
	a = o.GuardianFallbackRsp = class {
		decode(r) {
			this.guardian = new o.Guardian().decode(r);
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			this.equips = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.equips[i] = new o.GuardianEquip().decode(r);   
			}
			return this;
		}
	};
	m = 6630;
	a[n] = m;
	c[m] = a;
	
	a = o.AssistAlliance = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.allianceId);
			w[w3](this.activeStar);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
		}
		decode(r) {
			this.allianceId = r[r3]();
			this.activeStar = r[r3]();
			this.heroIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroIds[i] = r[r3]();   
			}
			return this;
		}
	};
	
	//协战联盟--状态
	a = o.AssistAllianceStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6701);
			w[fm]();
		}
	};
	m = 6701;
	a[n] = m;
	
	a = o.AssistAllianceStateRsp = class {
		decode(r) {
			this.legionLevel = r[ry]();
			this.assistAlliances = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.assistAlliances[i] = new o.AssistAlliance().decode(r);   
			}
			return this;
		}
	};
	m = 6701;
	a[n] = m;
	c[m] = a;
	
	//协战联盟--上阵
	a = o.AssistAllianceOnReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6702);
			w[w3](this.heroId);
			w[w3](this.allianceId);
			w[w3](this.index);
			w[fm]();
		}
	};
	m = 6702;
	a[n] = m;
	
	a = o.AssistAllianceOnRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.assistAlliance = new o.AssistAlliance().decode(r);
			return this;
		}
	};
	m = 6702;
	a[n] = m;
	c[m] = a;
	
	//协战联盟--军团升级
	a = o.AssistAllianceLegionReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6703);
			w[fm]();
		}
	};
	m = 6703;
	a[n] = m;
	
	a = o.AssistAllianceLegionRsp = class {
		decode(r) {
			this.legionLevel = r[ry]();
			return this;
		}
	};
	m = 6703;
	a[n] = m;
	c[m] = a;
	
	a = o.AssistAllianceGiftRecord = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.giftId);
			w[wy](this.record);
		}
		decode(r) {
			this.giftId = r[r3]();
			this.record = r[ry]();
			return this;
		}
	};
	
	//协战联盟--礼包记录，只返回购买或者领取过的礼包
	a = o.AssistAllianceGiftRecordReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6704);
			w[fm]();
		}
	};
	m = 6704;
	a[n] = m;
	
	//协战联盟--MaxStar改变主动推送
	a = o.AssistAllianceGiftRecordRsp = class {
		decode(r) {
			this.maxStar = r[r3]();
			this.giftRecords = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.giftRecords[i] = new o.AssistAllianceGiftRecord().decode(r);   
			}
			return this;
		}
	};
	m = 6704;
	a[n] = m;
	c[m] = a;
	
	//协战联盟--领取免费，购买走PayOrderReq
	a = o.AssistAllianceGiftReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6705);
			w[w3](this.giftId);
			w[fm]();
		}
	};
	m = 6705;
	a[n] = m;
	
	a = o.AssistAllianceGiftRsp = class {
		decode(r) {
			this.giftId = r[r3]();
			this.giftRecords = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.giftRecords[i] = new o.AssistAllianceGiftRecord().decode(r);   
			}
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6705;
	a[n] = m;
	c[m] = a;
	
	//协战联盟--激活
	a = o.AssistAllianceActivateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6706);
			w[w3](this.allianceId);
			w[fm]();
		}
	};
	m = 6706;
	a[n] = m;
	
	a = o.AssistAllianceActivateRsp = class {
		decode(r) {
			this.assistAlliance = new o.AssistAlliance().decode(r);
			return this;
		}
	};
	m = 6706;
	a[n] = m;
	c[m] = a;
	
	//扭蛋--状态
	a = o.TwistEggStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6801);
			w[fm]();
		}
	};
	m = 6801;
	a[n] = m;
	
	a = o.TwistEggStateRsp = class {
		decode(r) {
			this.rewarded = r[r3]();
			this.wishIdxs = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.wishIdxs[i] = r[ry]();   
			}
			this.subType = r[r3]();
			return this;
		}
	};
	m = 6801;
	a[n] = m;
	c[m] = a;
	
	//扭蛋--许愿
	a = o.TwistEggWishReq = class {
		constructor(d) {
			this.wishIdxs = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6802);
			w[w1](this.wishIdxs.length);
			for (var i = 0, len = this.wishIdxs.length; i < len; i++) {
				w[wy](this.wishIdxs[i]);   
			}
			w[fm]();
		}
	};
	m = 6802;
	a[n] = m;
	
	a = o.TwistEggWishRsp = class {
		decode(r) {
			this.wishIdxs = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.wishIdxs[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 6802;
	a[n] = m;
	c[m] = a;
	
	//扭蛋--抽奖
	a = o.TwistEggDrawReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6803);
			w[fm]();
		}
	};
	m = 6803;
	a[n] = m;
	
	a = o.TwistEggDrawRsp = class {
		decode(r) {
			this.rewarded = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6803;
	a[n] = m;
	c[m] = a;
	
	//合服狂欢--限购商店-商品信息
	a = o.MergeCarnivalStoreGoods = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.money);
			w[w3](this.left);
			w[wb](this.bought);
		}
		decode(r) {
			this.money = r[r3]();
			this.left = r[r3]();
			this.bought = r[rb]();
			return this;
		}
	};
	
	//合服狂欢--限购商店
	a = o.MergeCarnivalStoreReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6901);
			w[fm]();
		}
	};
	m = 6901;
	a[n] = m;
	
	a = o.MergeCarnivalStoreRsp = class {
		decode(r) {
			this.money = r[r3]();
			this.goods = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goods[i] = new o.MergeCarnivalStoreGoods().decode(r);   
			}
			this.ydLoginNum = r[r3]();
			return this;
		}
	};
	m = 6901;
	a[n] = m;
	c[m] = a;
	
	//合服狂欢--限购商店-购买
	a = o.MergeCarnivalStoreBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6902);
			w[w3](this.money);
			w[fm]();
		}
	};
	m = 6902;
	a[n] = m;
	
	a = o.MergeCarnivalStoreBuyRsp = class {
		decode(r) {
			this.goods = new o.MergeCarnivalStoreGoods().decode(r);
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6902;
	a[n] = m;
	c[m] = a;
	
	//合服狂欢--限购商店-剩余数量广播
	a = o.MergeCarnivalStoreLeftRsp = class {
		decode(r) {
			this.money = r[r3]();
			this.left = r[r3]();
			return this;
		}
	};
	m = 6903;
	a[n] = m;
	c[m] = a;
	
	//合服狂欢--信息
	a = o.MergeCarnivalStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6904);
			w[fm]();
		}
	};
	m = 6904;
	a[n] = m;
	
	a = o.MergeCarnivalStateRsp = class {
		decode(r) {
			this.score = r[r3]();
			this.exchangeRecord = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.exchangeRecord[i] = r[ry]();   
			}
			this.ranking = r[r3]();
			return this;
		}
	};
	m = 6904;
	a[n] = m;
	c[m] = a;
	
	//合服狂欢--兑换
	a = o.MergeCarnivalExchangeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6905);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 6905;
	a[n] = m;
	
	a = o.MergeCarnivalExchangeRsp = class {
		decode(r) {
			this.score = r[r3]();
			this.exchangeRecord = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.exchangeRecord[i] = r[ry]();   
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6905;
	a[n] = m;
	c[m] = a;
	
	//合服狂欢--玩家积分，领取任务奖励后返回玩家添加的积分
	a = o.MergeCarnivalPlayerScoreRsp = class {
		decode(r) {
			this.addScore = r[r3]();
			return this;
		}
	};
	m = 6906;
	a[n] = m;
	c[m] = a;
	
	//合服狂欢--服务器排名
	a = o.MergeCarnivalServerRankReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6907);
			w[fm]();
		}
	};
	m = 6907;
	a[n] = m;
	
	a = o.MergeCarnivalServerRankRsp = class {
		decode(r) {
			this.ranking = r[r3]();
			this.score = r[r3]();
			this.rankingInfo = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rankingInfo[i] = new o.CarnivalServerInfo().decode(r);   
			}
			return this;
		}
	};
	m = 6907;
	a[n] = m;
	c[m] = a;
	
	//合服狂欢--玩家当前服务器排名
	a = o.MergeCarnivalCurServerRankReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](6908);
			w[fm]();
		}
	};
	m = 6908;
	a[n] = m;
	
	a = o.MergeCarnivalCurServerRankRsp = class {
		decode(r) {
			this.ranking = r[r3]();
			this.score = r[r3]();
			return this;
		}
	};
	m = 6908;
	a[n] = m;
	c[m] = a;
	
	a = o.WorldEnvelope = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.typeId);
			w[ws](this.name);
			w[ws](this.guildName);
			w[w3](this.sendTime);
			w[wb](this.got);
		}
		decode(r) {
			this.id = r[r3]();
			this.typeId = r[r3]();
			this.name = r[rs]();
			this.guildName = r[rs]();
			this.sendTime = r[r3]();
			this.got = r[rb]();
			return this;
		}
	};
	
	a = o.WorldEnvelopeRank = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			if (!this.role) {
				w[wb](false);
			} else {
				w[wb](true);
				this.role.encode(w);
			}
			if (!this.guild) {
				w[wb](false);
			} else {
				w[wb](true);
				this.guild.encode(w);
			}
			w[ws](this.name);
			w[w3](this.value);
			w[w3](this.num);
		}
		decode(r) {
			if (r[rb]()) {
				this.role = new o.RoleBrief().decode(r);
			}
			if (r[rb]()) {
				this.guild = new o.GuildBrief().decode(r);
			}
			this.name = r[rs]();
			this.value = r[r3]();
			this.num = r[r3]();
			return this;
		}
	};
	
	//世界红包--排行榜
	a = o.WorldEnvelopeRankReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7001);
			w[w3](this.type);
			w[fm]();
		}
	};
	m = 7001;
	a[n] = m;
	
	a = o.WorldEnvelopeRankRsp = class {
		decode(r) {
			this.type = r[r3]();
			this.rank = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rank[i] = new o.WorldEnvelopeRank().decode(r);   
			}
			return this;
		}
	};
	m = 7001;
	a[n] = m;
	c[m] = a;
	
	//世界红包--红包列表
	a = o.WorldEnvelopeListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7002);
			w[w3](this.minId);
			w[w3](this.index);
			w[w3](this.count);
			w[fm]();
		}
	};
	m = 7002;
	a[n] = m;
	
	a = o.WorldEnvelopeListRsp = class {
		decode(r) {
			this.index = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.WorldEnvelope().decode(r);   
			}
			return this;
		}
	};
	m = 7002;
	a[n] = m;
	c[m] = a;
	
	//世界红包--红包ID
	a = o.WorldEnvelopeIdReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7003);
			w[fm]();
		}
	};
	m = 7003;
	a[n] = m;
	
	a = o.WorldEnvelopeIdRsp = class {
		decode(r) {
			this.maxGotId = r[r3]();
			this.maxEnvId = r[r3]();
			return this;
		}
	};
	m = 7003;
	a[n] = m;
	c[m] = a;
	
	//世界红包--抢红包
	a = o.WorldEnvelopeGetReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7004);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 7004;
	a[n] = m;
	
	a = o.WorldEnvelopeGetRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.maxGotId = r[r3]();
			this.goods = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goods[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7004;
	a[n] = m;
	c[m] = a;
	
	a = o.Adventure2Hero = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.type);
			w[w3](this.heroId);
			w[w3](this.group);
			w[w3](this.typeId);
			w[wy](this.useTimes);
			w[w3](this.level);
			w[w3](this.soldierId);
			w[wy](this.star);
			w[w3](this.careerLv);
			w[w3](this.power);
			w[w3](this.careerId);
		}
		decode(r) {
			this.type = r[ry]();
			this.heroId = r[r3]();
			this.group = r[r3]();
			this.typeId = r[r3]();
			this.useTimes = r[ry]();
			this.level = r[r3]();
			this.soldierId = r[r3]();
			this.star = r[ry]();
			this.careerLv = r[r3]();
			this.power = r[r3]();
			this.careerId = r[r3]();
			return this;
		}
	};
	
	//奇境探险--难度
	a = o.Adventure2Difficulty = class {
		constructor(d) {
			this.entryList = [];
			this.lastEntryList = [];
			this.historyPlate = [];
			this.lastPlates = [];
			this.allPlates = [];
			this.randomIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.difficulty);
			w[w3](this.layerId);
			w[w3](this.plateIndex);
			w[wy](this.blood);
			w[wy](this.consumption);
			w[wy](this.clearTimes);
			w[wb](this.plateFinish);
			w[w3](this.lastPlate);
			w[w1](this.entryList.length);
			for (var i = 0, len = this.entryList.length; i < len; i++) {
				w[w3](this.entryList[i]);   
			}
			w[w1](this.lastEntryList.length);
			for (var i = 0, len = this.lastEntryList.length; i < len; i++) {
				w[w3](this.lastEntryList[i]);   
			}
			w[w1](this.historyPlate.length);
			for (var i = 0, len = this.historyPlate.length; i < len; i++) {
				w[w3](this.historyPlate[i]);   
			}
			w[w1](this.lastPlates.length);
			for (var i = 0, len = this.lastPlates.length; i < len; i++) {
				w[w3](this.lastPlates[i]);   
			}
			w[w1](this.allPlates.length);
			for (var i = 0, len = this.allPlates.length; i < len; i++) {
				w[w3](this.allPlates[i]);   
			}
			w[w1](this.randomIds.length);
			for (var i = 0, len = this.randomIds.length; i < len; i++) {
				w[w3](this.randomIds[i]);   
			}
			w[wy](this.line);
			w[w3](this.stageId);
			w[w3](this.stageCount);
			w[wb](this.finish);
		}
		decode(r) {
			this.difficulty = r[ry]();
			this.layerId = r[r3]();
			this.plateIndex = r[r3]();
			this.blood = r[ry]();
			this.consumption = r[ry]();
			this.clearTimes = r[ry]();
			this.plateFinish = r[rb]();
			this.lastPlate = r[r3]();
			this.entryList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.entryList[i] = r[r3]();   
			}
			this.lastEntryList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.lastEntryList[i] = r[r3]();   
			}
			this.historyPlate = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.historyPlate[i] = r[r3]();   
			}
			this.lastPlates = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.lastPlates[i] = r[r3]();   
			}
			this.allPlates = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.allPlates[i] = r[r3]();   
			}
			this.randomIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.randomIds[i] = r[r3]();   
			}
			this.line = r[ry]();
			this.stageId = r[r3]();
			this.stageCount = r[r3]();
			this.finish = r[rb]();
			return this;
		}
	};
	
	//奇境探险--进度
	a = o.Adventure2StateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7101);
			w[fm]();
		}
	};
	m = 7101;
	a[n] = m;
	
	a = o.Adventure2StateRsp = class {
		decode(r) {
			this.avgPower = r[r3]();
			this.avgLevel = r[r3]();
			this.heroes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroes[i] = new o.Adventure2Hero().decode(r);   
			}
			this.heroOn = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroOn[i] = r[r3]();   
			}
			this.normal = new o.Adventure2Difficulty().decode(r);
			this.endLess = new o.Adventure2Difficulty().decode(r);
			this.rewarded = r[ry]();
			return this;
		}
	};
	m = 7101;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--回复生命值
	a = o.Adventure2ConsumptionReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7102);
			w[wy](this.difficulty);
			w[fm]();
		}
	};
	m = 7102;
	a[n] = m;
	
	a = o.Adventure2ConsumptionRsp = class {
		decode(r) {
			this.difficultyState = new o.Adventure2Difficulty().decode(r);
			return this;
		}
	};
	m = 7102;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--选中板块，不能再选同一行的其他板块，关卡、旅人商店事件使用
	a = o.Adventure2PlateEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7103);
			w[wy](this.difficulty);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 7103;
	a[n] = m;
	
	a = o.Adventure2PlateEnterRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.plateIndex = r[r3]();
			this.stageId = r[r3]();
			return this;
		}
	};
	m = 7103;
	a[n] = m;
	c[m] = a;
	
	a = o.Adventure2EnterHeroes = class {
		constructor(d) {
			this.heroList = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[w1](this.heroList.length);
			for (var i = 0, len = this.heroList.length; i < len; i++) {
				if (!this.heroList[i]) {
					w[wb](false);
				} else {
					w[wb](true);
					this.heroList[i].encode(w);
				}   
			}
			if (!this.general) {
				w[wb](false);
			} else {
				w[wb](true);
				this.general.encode(w);
			}
		}
		decode(r) {
			this.playerId = r[r6]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				if (r[rb]()) {
					this.heroList[i] = new o.FightHero().decode(r);
				}   
			}
			if (r[rb]()) {
				this.general = new o.FightGeneral().decode(r);
			}
			return this;
		}
	};
	
	//奇境探险--板块事件--进入关卡战斗
	a = o.Adventure2EnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7104);
			w[wy](this.difficulty);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 7104;
	a[n] = m;
	
	a = o.Adventure2EnterRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.plateIndex = r[r3]();
			this.group = r[r3]();
			this.fightState = r[rs]();
			this.heroes = new o.Adventure2EnterHeroes().decode(r);
			return this;
		}
	};
	m = 7104;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--退出关卡战斗
	a = o.Adventure2ExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7105);
			w[wy](this.difficulty);
			w[wy](this.blood);
			w[w3](this.plateIndex);
			w[w3](this.group);
			w[ws](this.fightState);
			w[fm]();
		}
	};
	m = 7105;
	a[n] = m;
	
	a = o.Adventure2ExitRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.blood = r[ry]();
			this.plateIndex = r[r3]();
			this.rankBf = r[r3]();
			this.rankAf = r[r3]();
			this.heros = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heros[i] = new o.Adventure2Hero().decode(r);   
			}
			this.deleteHeroIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.deleteHeroIds[i] = r[r3]();   
			}
			this.randomIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.randomIds[i] = r[r3]();   
			}
			this.stageCount = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7105;
	a[n] = m;
	c[m] = a;
	
	a = o.Adventure2Trave = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[wy](this.times);
		}
		decode(r) {
			this.id = r[r3]();
			this.times = r[ry]();
			return this;
		}
	};
	
	//奇境探险--板块事件--旅行商人商品列表
	a = o.Adventure2TravelListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7106);
			w[wy](this.difficulty);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 7106;
	a[n] = m;
	
	a = o.Adventure2TravelListRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.plateIndex = r[r3]();
			this.travelIndex = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.travelIndex[i] = new o.Adventure2Trave().decode(r);   
			}
			return this;
		}
	};
	m = 7106;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--旅行商人购买
	a = o.Adventure2TravelBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7107);
			w[wy](this.difficulty);
			w[w3](this.plateIndex);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 7107;
	a[n] = m;
	
	a = o.Adventure2TravelBuyRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.plateIndex = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7107;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--旅行商人完成事件
	a = o.Adventure2TravelFinishReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7108);
			w[wy](this.difficulty);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 7108;
	a[n] = m;
	
	a = o.Adventure2TravelFinishRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.plateIndex = r[r3]();
			return this;
		}
	};
	m = 7108;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--佣兵列表
	a = o.Adventure2MercenaryListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7109);
			w[wy](this.difficulty);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 7109;
	a[n] = m;
	
	a = o.Adventure2MercenaryListRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.plateIndex = r[r3]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroList[i] = new o.Adventure2Hero().decode(r);   
			}
			return this;
		}
	};
	m = 7109;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--选择佣兵
	a = o.Adventure2MercenaryReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7110);
			w[wy](this.difficulty);
			w[w3](this.plateIndex);
			w[w3](this.group);
			w[w3](this.typeId);
			w[fm]();
		}
	};
	m = 7110;
	a[n] = m;
	
	a = o.Adventure2MercenaryRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.plateIndex = r[r3]();
			this.giveHeros = new o.Adventure2Hero().decode(r);
			return this;
		}
	};
	m = 7110;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--增益遗物列表
	a = o.Adventure2EntryListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7111);
			w[wy](this.difficulty);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 7111;
	a[n] = m;
	
	a = o.Adventure2EntryListRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.plateIndex = r[r3]();
			this.entryList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.entryList[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 7111;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--增益遗物选择
	a = o.Adventure2EntrySelectReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7112);
			w[wy](this.difficulty);
			w[w3](this.plateIndex);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 7112;
	a[n] = m;
	
	a = o.Adventure2EntrySelectRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.plateIndex = r[r3]();
			this.entryList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.entryList[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 7112;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--随机事件
	a = o.Adventure2RandomReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7113);
			w[wy](this.difficulty);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 7113;
	a[n] = m;
	
	a = o.Adventure2RandomRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.plateIndex = r[r3]();
			this.randomId = r[r3]();
			this.randomIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.randomIds[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 7113;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--板块事件--宝藏,广播协议使用SystemBroadcastRsp协议
	a = o.Adventure2TreasureReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7114);
			w[wy](this.difficulty);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 7114;
	a[n] = m;
	
	a = o.Adventure2TreasureRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.plateIndex = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7114;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--进入下一层，下一难度
	a = o.Adventure2NextReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7115);
			w[wy](this.difficulty);
			w[fm]();
		}
	};
	m = 7115;
	a[n] = m;
	
	a = o.Adventure2NextRsp = class {
		decode(r) {
			this.difficulty = new o.Adventure2Difficulty().decode(r);
			return this;
		}
	};
	m = 7115;
	a[n] = m;
	c[m] = a;
	
	a = o.Adventure2RankBrief = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w3](this.layerId);
			w[w3](this.plateIndex);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.layerId = r[r3]();
			this.plateIndex = r[r3]();
			return this;
		}
	};
	
	//奇境探险--排行榜
	a = o.Adventure2RankListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7116);
			w[fm]();
		}
	};
	m = 7116;
	a[n] = m;
	
	a = o.Adventure2RankListRsp = class {
		decode(r) {
			this.serverNum = r[r3]();
			this.ranking = r[r3]();
			this.layerId = r[r3]();
			this.plateIndex = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.Adventure2RankBrief().decode(r);   
			}
			return this;
		}
	};
	m = 7116;
	a[n] = m;
	c[m] = a;
	
	a = o.Adventure2StoreItem = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.remain);
		}
		decode(r) {
			this.id = r[r3]();
			this.remain = r[r3]();
			return this;
		}
	};
	
	//探险商店--列表
	a = o.Adventure2StoreListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7117);
			w[fm]();
		}
	};
	m = 7117;
	a[n] = m;
	
	a = o.Adventure2StoreListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.Adventure2StoreItem().decode(r);   
			}
			return this;
		}
	};
	m = 7117;
	a[n] = m;
	c[m] = a;
	
	//探险商店--购买
	a = o.Adventure2StoreBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7118);
			w[w3](this.storeId);
			w[w3](this.num);
			w[fm]();
		}
	};
	m = 7118;
	a[n] = m;
	
	a = o.Adventure2StoreBuyRsp = class {
		decode(r) {
			this.storeItem = new o.Adventure2StoreItem().decode(r);
			this.items = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.items[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7118;
	a[n] = m;
	c[m] = a;
	
	//探险证任务--列表
	a = o.Adventure2PassListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7119);
			w[fm]();
		}
	};
	m = 7119;
	a[n] = m;
	
	a = o.Adventure2PassListRsp = class {
		decode(r) {
			this.bought = r[rb]();
			this.rewarded1 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded1[i] = r[ry]();   
			}
			this.rewarded2 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded2[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 7119;
	a[n] = m;
	c[m] = a;
	
	//探险任务--领奖
	a = o.Adventure2PassAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7120);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 7120;
	a[n] = m;
	
	a = o.Adventure2PassAwardRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.rewarded1 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded1[i] = r[ry]();   
			}
			this.rewarded2 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewarded2[i] = r[ry]();   
			}
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7120;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--英雄上阵
	a = o.Adventure2HeroOnReq = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7121);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
			w[fm]();
		}
	};
	m = 7121;
	a[n] = m;
	
	a = o.Adventure2HeroOnRsp = class {
		decode(r) {
			this.heroIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroIds[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 7121;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--获得新的英雄广播
	a = o.Adventure2NewHeroRsp = class {
		decode(r) {
			this.heroes = new o.Adventure2Hero().decode(r);
			return this;
		}
	};
	m = 7122;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--名片英雄信息
	a = o.Adventure2HeroImageReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7123);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 7123;
	a[n] = m;
	
	a = o.Adventure2HeroImageRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.hero = new o.HeroImage().decode(r);
			return this;
		}
	};
	m = 7123;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--英雄转职
	a = o.Adventure2HeroCareerReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7124);
			w[w3](this.heroId);
			w[w3](this.careerId);
			w[fm]();
		}
	};
	m = 7124;
	a[n] = m;
	
	a = o.Adventure2HeroCareerRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.careerId = r[r3]();
			this.soldierId = r[r3]();
			return this;
		}
	};
	m = 7124;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--难度奖励
	a = o.Adventure2DifficultyRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7125);
			w[wy](this.difficulty);
			w[fm]();
		}
	};
	m = 7125;
	a[n] = m;
	
	a = o.Adventure2DifficultyRewardRsp = class {
		decode(r) {
			this.rewarded = r[ry]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7125;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--路线选择
	a = o.Adventure2LineReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7126);
			w[wy](this.difficulty);
			w[wy](this.line);
			w[fm]();
		}
	};
	m = 7126;
	a[n] = m;
	
	a = o.Adventure2LineRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.line = r[ry]();
			return this;
		}
	};
	m = 7126;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--遗物兑换
	a = o.Adventure2EntryExchangeReq = class {
		constructor(d) {
			this.ids = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7127);
			w[wy](this.difficulty);
			w[w1](this.ids.length);
			for (var i = 0, len = this.ids.length; i < len; i++) {
				w[w3](this.ids[i]);   
			}
			w[fm]();
		}
	};
	m = 7127;
	a[n] = m;
	
	a = o.Adventure2EntryExchangeRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.entryList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.entryList[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 7127;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--重置遗物
	a = o.Adventure2EntryResetReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7128);
			w[wy](this.difficulty);
			w[fm]();
		}
	};
	m = 7128;
	a[n] = m;
	
	a = o.Adventure2EntryResetRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.difficultyState = new o.Adventure2Difficulty().decode(r);
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7128;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--扫荡
	a = o.Adventure2RaidReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7129);
			w[wy](this.difficulty);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 7129;
	a[n] = m;
	
	a = o.Adventure2RaidRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.blood = r[ry]();
			this.plateIndex = r[r3]();
			this.stageCount = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7129;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--存档
	a = o.Adventure2SaveStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7130);
			w[wy](this.difficulty);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 7130;
	a[n] = m;
	
	a = o.Adventure2SaveStateRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.plateIndex = r[r3]();
			return this;
		}
	};
	m = 7130;
	a[n] = m;
	c[m] = a;
	
	//奇境探险--跳过历史板块，不能跳过战斗和遗物
	a = o.Adventure2SkipReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7131);
			w[wy](this.difficulty);
			w[w3](this.plateIndex);
			w[fm]();
		}
	};
	m = 7131;
	a[n] = m;
	
	a = o.Adventure2SkipRsp = class {
		decode(r) {
			this.difficulty = r[ry]();
			this.plateIndex = r[r3]();
			return this;
		}
	};
	m = 7131;
	a[n] = m;
	c[m] = a;
	
	a = o.PiecesHero = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.heroId);
			w[w3](this.typeId);
			w[w3](this.line);
			w[wy](this.star);
			w[w3](this.power);
			w[w3](this.pos);
		}
		decode(r) {
			this.heroId = r[r3]();
			this.typeId = r[r3]();
			this.line = r[r3]();
			this.star = r[ry]();
			this.power = r[r3]();
			this.pos = r[r3]();
			return this;
		}
	};
	
	a = o.PiecesRankBrief = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w3](this.rank);
			w[w3](this.totalRound);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.rank = r[r3]();
			this.totalRound = r[r3]();
			return this;
		}
	};
	
	//末日自走棋--查看信息
	a = o.PiecesInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7201);
			w[fm]();
		}
	};
	m = 7201;
	a[n] = m;
	
	a = o.PiecesInfoRsp = class {
		decode(r) {
			this.restChallengeTimes = r[r3]();
			this.restBuyTimes = r[r3]();
			this.score = r[r3]();
			this.gainRankAward = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.gainRankAward[i] = r[r3]();   
			}
			this.talentPoint = r[r3]();
			this.talentList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.talentList[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 7201;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--购买次数
	a = o.PiecesBuyTimeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7202);
			w[fm]();
		}
	};
	m = 7202;
	a[n] = m;
	
	a = o.PiecesBuyTimeRsp = class {
		decode(r) {
			this.restBuyTimes = r[r3]();
			return this;
		}
	};
	m = 7202;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--点亮天赋
	a = o.PiecesLightUpTalentReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7203);
			w[w3](this.talentId);
			w[fm]();
		}
	};
	m = 7203;
	a[n] = m;
	
	a = o.PiecesLightUpTalentRsp = class {
		decode(r) {
			this.talentId = r[r3]();
			this.talentPoint = r[r3]();
			return this;
		}
	};
	m = 7203;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--查看排行榜
	a = o.PiecesRankListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7204);
			w[fm]();
		}
	};
	m = 7204;
	a[n] = m;
	
	a = o.PiecesRankListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.PiecesRankBrief().decode(r);   
			}
			return this;
		}
	};
	m = 7204;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--领取段位奖励
	a = o.PiecesGainDivisionRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7205);
			w[w3](this.rank);
			w[fm]();
		}
	};
	m = 7205;
	a[n] = m;
	
	a = o.PiecesGainDivisionRewardRsp = class {
		decode(r) {
			this.rank = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7205;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--购买英雄界面
	a = o.PiecesBuyHeroPanelReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7206);
			w[fm]();
		}
	};
	m = 7206;
	a[n] = m;
	
	a = o.PiecesBuyHeroPanelRsp = class {
		decode(r) {
			this.isLock = r[rb]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = r[r3]();   
			}
			this.silver = r[r3]();
			return this;
		}
	};
	m = 7206;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--刷新购买英雄界面
	a = o.PiecesRefreshBuyHeroPanelReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7207);
			w[fm]();
		}
	};
	m = 7207;
	a[n] = m;
	
	a = o.PiecesRefreshBuyHeroPanelRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = r[r3]();   
			}
			this.silver = r[r3]();
			return this;
		}
	};
	m = 7207;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--锁定/解锁购买英雄界面
	a = o.PiecesLockBuyHeroPanelReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7208);
			w[wb](this.isLock);
			w[fm]();
		}
	};
	m = 7208;
	a[n] = m;
	
	a = o.PiecesLockBuyHeroPanelRsp = class {
		decode(r) {
			this.isLook = r[rb]();
			return this;
		}
	};
	m = 7208;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--购买英雄
	a = o.PiecesBuyHeroReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7209);
			w[w3](this.pos);
			w[fm]();
		}
	};
	m = 7209;
	a[n] = m;
	
	a = o.PiecesBuyHeroRsp = class {
		decode(r) {
			this.pos = r[r3]();
			this.silver = r[r3]();
			return this;
		}
	};
	m = 7209;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--出售英雄
	a = o.PiecesSellHeroReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7210);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 7210;
	a[n] = m;
	
	a = o.PiecesSellHeroRsp = class {
		decode(r) {
			this.silver = r[r3]();
			return this;
		}
	};
	m = 7210;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--英雄转换路线
	a = o.PiecesHeroChangeLineReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7211);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 7211;
	a[n] = m;
	
	a = o.PiecesHeroChangeLineRsp = class {
		decode(r) {
			this.hero = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.hero[i] = new o.PiecesHero().decode(r);   
			}
			return this;
		}
	};
	m = 7211;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--英雄更新
	a = o.PiecesHeroUpdateRsp = class {
		decode(r) {
			this.updateHero = new o.PiecesHero().decode(r);
			this.delHeroId = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.delHeroId[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 7212;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--更新英雄战力属性
	a = o.PiecesHeroAttrRsp = class {
		decode(r) {
			this.heroId = r[r3]();
			this.power = r[r3]();
			this.attr = new o.HeroAttr().decode(r);
			return this;
		}
	};
	m = 7213;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--英雄列表
	a = o.PiecesHeroListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7214);
			w[fm]();
		}
	};
	m = 7214;
	a[n] = m;
	
	a = o.PiecesHeroListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.PiecesHero().decode(r);   
			}
			return this;
		}
	};
	m = 7214;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--上阵英雄
	a = o.PiecesHeroOnBattleReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7215);
			w[w3](this.heroId);
			w[w3](this.pos);
			w[fm]();
		}
	};
	m = 7215;
	a[n] = m;
	
	a = o.PiecesHeroOnBattleRsp = class {
		decode(r) {
			this.changeList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.changeList[i] = new o.PiecesHero().decode(r);   
			}
			return this;
		}
	};
	m = 7215;
	a[n] = m;
	c[m] = a;
	
	a = o.PiecesEnterHeroes = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
		}
		decode(r) {
			return this;
		}
	};
	
	//末日自走棋--进入战斗
	a = o.PiecesEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7216);
			w[wy](this.type);
			w[fm]();
		}
	};
	m = 7216;
	a[n] = m;
	
	a = o.PiecesEnterRsp = class {
		decode(r) {
			this.type = r[ry]();
			this.computerTeamId = r[r3]();
			this.startRound = r[r3]();
			this.playerHP = r[r3]();
			return this;
		}
	};
	m = 7216;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--请求阵容
	a = o.PiecesBattleArrayReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7217);
			w[wy](this.type);
			w[fm]();
		}
	};
	m = 7217;
	a[n] = m;
	
	a = o.PiecesBattleArrayRsp = class {
		decode(r) {
			this.p1 = new o.FightQueryRsp().decode(r);
			this.p2 = new o.FightQueryRsp().decode(r);
			return this;
		}
	};
	m = 7217;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--退出战斗
	a = o.PiecesExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7218);
			w[wy](this.type);
			w[ws](this.fightState);
			w[w3](this.nowRound);
			w[w3](this.playerHP);
			w[fm]();
		}
	};
	m = 7218;
	a[n] = m;
	
	a = o.PiecesExitRsp = class {
		decode(r) {
			this.type = r[ry]();
			this.beforeRank = r[r3]();
			this.afterRank = r[r3]();
			this.score = r[r3]();
			this.talentPoint = r[r3]();
			this.totalRound = r[r3]();
			return this;
		}
	};
	m = 7218;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--波次开始
	a = o.PiecesRoundStartReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7219);
			w[fm]();
		}
	};
	m = 7219;
	a[n] = m;
	
	a = o.PiecesRoundStartRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 7219;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--波次结束
	a = o.PiecesRoundEndReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7220);
			w[wy](this.type);
			w[wb](this.isKillAll);
			w[w3](this.nowRound);
			w[w3](this.playerHP);
			w[fm]();
		}
	};
	m = 7220;
	a[n] = m;
	
	a = o.PiecesRoundEndRsp = class {
		decode(r) {
			this.type = r[ry]();
			this.p1 = new o.FightQueryRsp().decode(r);
			this.silver = r[r3]();
			this.divisionPoint = r[r3]();
			this.boardLv = r[r3]();
			this.boardExp = r[r3]();
			return this;
		}
	};
	m = 7220;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--请求英雄战斗数据
	a = o.PiecesFightQueryReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7221);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 7221;
	a[n] = m;
	
	a = o.PiecesFightQueryRsp = class {
		decode(r) {
			this.hero = new o.FightHero().decode(r);
			return this;
		}
	};
	m = 7221;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--获取跨服组数量
	a = o.PiecesCrossServerNumReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7222);
			w[fm]();
		}
	};
	m = 7222;
	a[n] = m;
	
	a = o.PiecesCrossServerNumRsp = class {
		decode(r) {
			this.num = r[r3]();
			return this;
		}
	};
	m = 7222;
	a[n] = m;
	c[m] = a;
	
	//末日自走棋--升级棋盘
	a = o.PiecesUpgradeChessBoardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7223);
			w[fm]();
		}
	};
	m = 7223;
	a[n] = m;
	
	a = o.PiecesUpgradeChessBoardRsp = class {
		decode(r) {
			this.silver = r[r3]();
			this.boardExp = r[r3]();
			this.boardLv = r[r3]();
			return this;
		}
	};
	m = 7223;
	a[n] = m;
	c[m] = a;
	
	//公会末日集结--状态
	a = o.GuildGatherStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7301);
			w[fm]();
		}
	};
	m = 7301;
	a[n] = m;
	
	a = o.GuildGatherStateRsp = class {
		decode(r) {
			this.power = r[r3]();
			this.numberCount = r[r3]();
			this.totalPower = r[r6]();
			this.star = r[ry]();
			this.heroOn = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroOn[i] = r[r3]();   
			}
			this.reward = r[rb]();
			this.rewarded = r[rb]();
			this.worldLevel = r[r3]();
			this.confirm = r[rb]();
			return this;
		}
	};
	m = 7301;
	a[n] = m;
	c[m] = a;
	
	a = o.GuildGatherRank = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.guildId);
			w[w3](this.guildIcon);
			w[w3](this.guildBottom);
			w[w3](this.guildFrame);
			w[ws](this.guildName);
			w[w6](this.totalPower);
			w[w3](this.numberCount);
			w[w6](this.presidentId);
			w[ws](this.presidentName);
			w[w3](this.presidentHead);
			w[w3](this.presidentHeadFrame);
		}
		decode(r) {
			this.guildId = r[r6]();
			this.guildIcon = r[r3]();
			this.guildBottom = r[r3]();
			this.guildFrame = r[r3]();
			this.guildName = r[rs]();
			this.totalPower = r[r6]();
			this.numberCount = r[r3]();
			this.presidentId = r[r6]();
			this.presidentName = r[rs]();
			this.presidentHead = r[r3]();
			this.presidentHeadFrame = r[r3]();
			return this;
		}
	};
	
	//公会末日集结--排行榜
	a = o.GuildGatherRankReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7302);
			w[fm]();
		}
	};
	m = 7302;
	a[n] = m;
	
	a = o.GuildGatherRankRsp = class {
		decode(r) {
			this.rank = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GuildGatherRank().decode(r);   
			}
			return this;
		}
	};
	m = 7302;
	a[n] = m;
	c[m] = a;
	
	//公会末日集结--本日领取奖励
	a = o.GuildGatherRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7303);
			w[fm]();
		}
	};
	m = 7303;
	a[n] = m;
	
	a = o.GuildGatherRewardRsp = class {
		decode(r) {
			this.rewarded = r[rb]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7303;
	a[n] = m;
	c[m] = a;
	
	//公会末日集结--上阵
	a = o.GuildGatherHeroOnReq = class {
		constructor(d) {
			this.heroOn = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7304);
			w[wy](this.star);
			w[w1](this.heroOn.length);
			for (var i = 0, len = this.heroOn.length; i < len; i++) {
				w[w3](this.heroOn[i]);   
			}
			w[fm]();
		}
	};
	m = 7304;
	a[n] = m;
	
	a = o.GuildGatherHeroOnRsp = class {
		decode(r) {
			this.power = r[r3]();
			this.heroOn = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroOn[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 7304;
	a[n] = m;
	c[m] = a;
	
	//公会末日集结--确认集结
	a = o.GuildGatherConfirmReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7305);
			w[fm]();
		}
	};
	m = 7305;
	a[n] = m;
	
	a = o.GuildGatherConfirmRsp = class {
		decode(r) {
			this.power = r[r3]();
			this.totalPower = r[r6]();
			this.numberCount = r[r3]();
			this.star = r[ry]();
			this.heroOn = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroOn[i] = r[r3]();   
			}
			this.confirm = r[rb]();
			return this;
		}
	};
	m = 7305;
	a[n] = m;
	c[m] = a;
	
	//公会末日集结--战斗结束广播
	a = o.GuildGatherEndRsp = class {
		decode(r) {
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7306;
	a[n] = m;
	c[m] = a;
	
	a = o.BaseInfo = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.level);
			w[w3](this.startTime);
			w[w3](this.endTime);
		}
		decode(r) {
			this.id = r[r3]();
			this.level = r[r3]();
			this.startTime = r[r3]();
			this.endTime = r[r3]();
			return this;
		}
	};
	
	//基地--列表
	a = o.BaseListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7401);
			w[fm]();
		}
	};
	m = 7401;
	a[n] = m;
	
	a = o.BaseListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.BaseInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7401;
	a[n] = m;
	c[m] = a;
	
	//基地--状态
	a = o.BaseInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7402);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 7402;
	a[n] = m;
	
	a = o.BaseInfoRsp = class {
		decode(r) {
			this.info = new o.BaseInfo().decode(r);
			return this;
		}
	};
	m = 7402;
	a[n] = m;
	c[m] = a;
	
	//基地--建造
	a = o.BaseBuildReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7403);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 7403;
	a[n] = m;
	
	a = o.BaseBuildRsp = class {
		decode(r) {
			this.info = new o.BaseInfo().decode(r);
			return this;
		}
	};
	m = 7403;
	a[n] = m;
	c[m] = a;
	
	//基地--加速
	a = o.BaseBoostReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7404);
			w[w3](this.id);
			w[w3](this.itemId);
			w[fm]();
		}
	};
	m = 7404;
	a[n] = m;
	
	a = o.BaseBoostRsp = class {
		decode(r) {
			this.info = new o.BaseInfo().decode(r);
			return this;
		}
	};
	m = 7404;
	a[n] = m;
	c[m] = a;
	
	//基地--杂物
	a = o.BaseVariaReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7405);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 7405;
	a[n] = m;
	
	a = o.BaseVariaRsp = class {
		decode(r) {
			this.id = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7405;
	a[n] = m;
	c[m] = a;
	
	//基地--确认完成
	a = o.BaseCompleteReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7406);
			w[w3](this.id);
			w[fm]();
		}
	};
	m = 7406;
	a[n] = m;
	
	a = o.BaseCompleteRsp = class {
		decode(r) {
			this.info = new o.BaseInfo().decode(r);
			return this;
		}
	};
	m = 7406;
	a[n] = m;
	c[m] = a;
	
	a = o.BaseDigger = class {
		constructor(d) {
			this.dropItems = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.startTime);
			w[w1](this.dropItems.length);
			for (var i = 0, len = this.dropItems.length; i < len; i++) {
				this.dropItems[i].encode(w);   
			}
		}
		decode(r) {
			this.id = r[r3]();
			this.startTime = r[r3]();
			this.dropItems = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.dropItems[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	
	//基地--矿机列表
	a = o.BaseDiggerListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7407);
			w[fm]();
		}
	};
	m = 7407;
	a[n] = m;
	
	a = o.BaseDiggerListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.BaseDigger().decode(r);   
			}
			return this;
		}
	};
	m = 7407;
	a[n] = m;
	c[m] = a;
	
	//基地--领取挂机奖励
	a = o.BaseHangRewardFetchReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7408);
			w[fm]();
		}
	};
	m = 7408;
	a[n] = m;
	
	a = o.BaseHangRewardFetchRsp = class {
		decode(r) {
			this.dropItem = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.dropItem[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7408;
	a[n] = m;
	c[m] = a;
	
	//基地--快速奖励
	a = o.BaseQuickHangRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7409);
			w[fm]();
		}
	};
	m = 7409;
	a[n] = m;
	
	a = o.BaseQuickHangRewardRsp = class {
		decode(r) {
			this.dropItem = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.dropItem[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7409;
	a[n] = m;
	c[m] = a;
	
	a = o.ArenaHonorGuild = class {
		constructor(d) {
			this.players = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.id);
			w[ws](this.name);
			w[w3](this.icon);
			w[w3](this.frame);
			w[w3](this.bottom);
			w[w1](this.players.length);
			for (var i = 0, len = this.players.length; i < len; i++) {
				this.players[i].encode(w);   
			}
		}
		decode(r) {
			this.id = r[r6]();
			this.name = r[rs]();
			this.icon = r[r3]();
			this.frame = r[r3]();
			this.bottom = r[r3]();
			this.players = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.players[i] = new o.RoleBrief().decode(r);   
			}
			return this;
		}
	};
	
	// 荣耀巅峰赛--4个公会信息
	a = o.ArenaHonorGuildReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7501);
			w[fm]();
		}
	};
	m = 7501;
	a[n] = m;
	
	a = o.ArenaHonorGuildRsp = class {
		decode(r) {
			this.guilds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.guilds[i] = new o.ArenaHonorGuild().decode(r);   
			}
			return this;
		}
	};
	m = 7501;
	a[n] = m;
	c[m] = a;
	
	a = o.ArenaHonorPlayer = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.id);
			w[w3](this.support);
			w[w3](this.win);
		}
		decode(r) {
			this.id = r[r6]();
			this.support = r[r3]();
			this.win = r[r3]();
			return this;
		}
	};
	
	a = o.ArenaHonorMatch = class {
		constructor(d) {
			this.players = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.match);
			w[wy](this.group);
			w[w1](this.players.length);
			for (var i = 0, len = this.players.length; i < len; i++) {
				this.players[i].encode(w);   
			}
			w[wy](this.winner);
			w[wy](this.guessWinner);
			w[wy](this.guess);
			w[w3](this.score);
			w[w3](this.addScore);
			w[w3](this.guessTime);
			w[wb](this.rewarded);
		}
		decode(r) {
			this.match = r[ry]();
			this.group = r[ry]();
			this.players = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.players[i] = new o.ArenaHonorPlayer().decode(r);   
			}
			this.winner = r[ry]();
			this.guessWinner = r[ry]();
			this.guess = r[ry]();
			this.score = r[r3]();
			this.addScore = r[r3]();
			this.guessTime = r[r3]();
			this.rewarded = r[rb]();
			return this;
		}
	};
	
	a = o.ArenaHonorRoleBrief = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.roleBrief.encode(w);
			w[w3](this.flower);
			w[ws](this.guildName);
		}
		decode(r) {
			this.roleBrief = new o.RoleBrief().decode(r);
			this.flower = r[r3]();
			this.guildName = r[rs]();
			return this;
		}
	};
	
	// 荣耀巅峰赛--每组比赛
	a = o.ArenaHonorGroupReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7502);
			w[wb](this.world);
			w[fm]();
		}
	};
	m = 7502;
	a[n] = m;
	
	a = o.ArenaHonorGroupRsp = class {
		decode(r) {
			this.world = r[rb]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.ArenaHonorMatch().decode(r);   
			}
			this.players = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.players[i] = new o.ArenaHonorRoleBrief().decode(r);   
			}
			this.draw = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.draw[i] = r[ry]();   
			}
			this.giveFlower = r[ry]();
			return this;
		}
	};
	m = 7502;
	a[n] = m;
	c[m] = a;
	
	// 荣耀巅峰赛--战斗
	a = o.ArenaHonorEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7503);
			w[wb](this.world);
			w[wy](this.group);
			w[wy](this.match);
			w[fm]();
		}
	};
	m = 7503;
	a[n] = m;
	
	a = o.ArenaHonorEnterRsp = class {
		decode(r) {
			this.world = r[rb]();
			this.group = r[ry]();
			this.match = r[ry]();
			return this;
		}
	};
	m = 7503;
	a[n] = m;
	c[m] = a;
	
	// 荣耀巅峰赛--战斗结束
	a = o.ArenaHonorExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7504);
			w[wb](this.world);
			w[wy](this.group);
			w[wy](this.match);
			w[wy](this.winner);
			w[fm]();
		}
	};
	m = 7504;
	a[n] = m;
	
	a = o.ArenaHonorExitRsp = class {
		decode(r) {
			this.world = r[rb]();
			this.group = r[ry]();
			this.match = r[ry]();
			this.guess = r[ry]();
			this.winner = r[ry]();
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7504;
	a[n] = m;
	c[m] = a;
	
	// 荣耀巅峰赛--下注
	a = o.ArenaHonorGuessReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7505);
			w[wb](this.world);
			w[wy](this.group);
			w[wy](this.match);
			w[wy](this.winner);
			w[w3](this.score);
			w[fm]();
		}
	};
	m = 7505;
	a[n] = m;
	
	a = o.ArenaHonorGuessRsp = class {
		decode(r) {
			this.match = r[ry]();
			this.group = r[ry]();
			this.guess = r[ry]();
			this.score = r[r3]();
			this.guessTime = r[r3]();
			return this;
		}
	};
	m = 7505;
	a[n] = m;
	c[m] = a;
	
	// 荣耀巅峰赛--领取积分
	a = o.ArenaHonorDrawReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7506);
			w[wb](this.world);
			w[wy](this.id);
			w[fm]();
		}
	};
	m = 7506;
	a[n] = m;
	
	a = o.ArenaHonorDrawRsp = class {
		decode(r) {
			this.draw = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.draw[i] = r[ry]();   
			}
			this.goods = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goods[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7506;
	a[n] = m;
	c[m] = a;
	
	// 荣耀巅峰赛--竞猜统计
	a = o.ArenaHonorGuessHistoryReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7507);
			w[wb](this.world);
			w[fm]();
		}
	};
	m = 7507;
	a[n] = m;
	
	a = o.ArenaHonorGuessHistoryRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.ArenaHonorMatch().decode(r);   
			}
			return this;
		}
	};
	m = 7507;
	a[n] = m;
	c[m] = a;
	
	a = o.ArenaHonorRanking = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w3](this.count);
			w[w3](this.firstTime);
			w[ws](this.guildName);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.count = r[r3]();
			this.firstTime = r[r3]();
			this.guildName = r[rs]();
			return this;
		}
	};
	
	// 荣耀巅峰赛--排行榜
	a = o.ArenaHonorRankingReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7508);
			w[wb](this.world);
			w[fm]();
		}
	};
	m = 7508;
	a[n] = m;
	
	a = o.ArenaHonorRankingRsp = class {
		decode(r) {
			this.world = r[rb]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.ArenaHonorRanking().decode(r);   
			}
			this.mine = r[r3]();
			this.count = r[r3]();
			this.firstTime = r[r3]();
			return this;
		}
	};
	m = 7508;
	a[n] = m;
	c[m] = a;
	
	// 荣耀巅峰赛--送花
	a = o.ArenaHonorFlowerReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7509);
			w[w6](this.playerId);
			w[fm]();
		}
	};
	m = 7509;
	a[n] = m;
	
	a = o.ArenaHonorFlowerRsp = class {
		decode(r) {
			this.playerId = r[r6]();
			this.flower = r[r3]();
			this.giveFlower = r[ry]();
			this.goods = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.goods[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7509;
	a[n] = m;
	c[m] = a;
	
	a = o.ExpeditionPos = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.x);
			w[wy](this.y);
		}
		decode(r) {
			this.x = r[ry]();
			this.y = r[ry]();
			return this;
		}
	};
	
	a = o.ExpeditionHero = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.gridId);
			w[w3](this.heroId);
			w[w3](this.energy);
			w[w3](this.energyTime);
			w[w3](this.changeTime);
		}
		decode(r) {
			this.gridId = r[r3]();
			this.heroId = r[r3]();
			this.energy = r[r3]();
			this.energyTime = r[r3]();
			this.changeTime = r[r3]();
			return this;
		}
	};
	
	//团队远征--查看英雄
	a = o.ExpeditionHeroListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7601);
			w[fm]();
		}
	};
	m = 7601;
	a[n] = m;
	
	a = o.ExpeditionHeroListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.ExpeditionHero().decode(r);   
			}
			this.energyBought = r[r3]();
			return this;
		}
	};
	m = 7601;
	a[n] = m;
	c[m] = a;
	
	//团队远征--更换英雄
	a = o.ExpeditionHeroChangeReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7602);
			w[w3](this.gridId);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 7602;
	a[n] = m;
	
	a = o.ExpeditionHeroChangeRsp = class {
		decode(r) {
			this.hero = new o.ExpeditionHero().decode(r);
			return this;
		}
	};
	m = 7602;
	a[n] = m;
	c[m] = a;
	
	//团队远征--购买体力
	a = o.ExpeditionBuyEnergyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7603);
			w[w3](this.gridId);
			w[fm]();
		}
	};
	m = 7603;
	a[n] = m;
	
	a = o.ExpeditionBuyEnergyRsp = class {
		decode(r) {
			this.hero = new o.ExpeditionHero().decode(r);
			return this;
		}
	};
	m = 7603;
	a[n] = m;
	c[m] = a;
	
	a = o.ExpeditionLog = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[ws](this.playerName);
			w[w3](this.time);
			w[w3](this.value);
			w[wb](this.isBoss);
		}
		decode(r) {
			this.playerName = r[rs]();
			this.time = r[r3]();
			this.value = r[r3]();
			this.isBoss = r[rb]();
			return this;
		}
	};
	
	//团队远征--查看日志
	a = o.ExpeditionLogListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7604);
			w[w3](this.index);
			w[w3](this.count);
			w[fm]();
		}
	};
	m = 7604;
	a[n] = m;
	
	a = o.ExpeditionLogListRsp = class {
		decode(r) {
			this.index = r[r3]();
			this.total = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.ExpeditionLog().decode(r);   
			}
			return this;
		}
	};
	m = 7604;
	a[n] = m;
	c[m] = a;
	
	a = o.ExpeditionPoint = class {
		constructor(d) {
			this.playerIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			this.pos.encode(w);
			w[w1](this.playerIds.length);
			for (var i = 0, len = this.playerIds.length; i < len; i++) {
				w[w6](this.playerIds[i]);   
			}
			w[wy](this.status);
			w[w3](this.time);
			w[w3](this.progress);
			w[wb](this.hasOccupied);
		}
		decode(r) {
			this.pos = new o.ExpeditionPos().decode(r);
			this.playerIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.playerIds[i] = r[r6]();   
			}
			this.status = r[ry]();
			this.time = r[r3]();
			this.progress = r[r3]();
			this.hasOccupied = r[rb]();
			return this;
		}
	};
	
	a = o.ExpeditionEvent = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.pos.encode(w);
			w[w3](this.type);
		}
		decode(r) {
			this.pos = new o.ExpeditionPos().decode(r);
			this.type = r[r3]();
			return this;
		}
	};
	
	a = o.ExpeditionMapPoint = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.point.encode(w);
			w[w3](this.mapId);
			w[w3](this.type);
		}
		decode(r) {
			this.point = new o.ExpeditionPoint().decode(r);
			this.mapId = r[r3]();
			this.type = r[r3]();
			return this;
		}
	};
	
	a = o.ExpeditionMap = class {
		constructor(d) {
			this.points = [];
			this.events = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.mapId);
			w[wb](this.isClear);
			w[w1](this.points.length);
			for (var i = 0, len = this.points.length; i < len; i++) {
				this.points[i].encode(w);   
			}
			w[w1](this.events.length);
			for (var i = 0, len = this.events.length; i < len; i++) {
				this.events[i].encode(w);   
			}
			w[w3](this.process);
		}
		decode(r) {
			this.mapId = r[r3]();
			this.isClear = r[rb]();
			this.points = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.points[i] = new o.ExpeditionPoint().decode(r);   
			}
			this.events = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.events[i] = new o.ExpeditionEvent().decode(r);   
			}
			this.process = r[r3]();
			return this;
		}
	};
	
	//团队远征--查看地图
	a = o.ExpeditionMapListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7605);
			w[fm]();
		}
	};
	m = 7605;
	a[n] = m;
	
	a = o.ExpeditionMapListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.ExpeditionMap().decode(r);   
			}
			return this;
		}
	};
	m = 7605;
	a[n] = m;
	c[m] = a;
	
	//团队远征--进入地图
	a = o.ExpeditionMapEnterReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7606);
			w[w3](this.mapId);
			w[fm]();
		}
	};
	m = 7606;
	a[n] = m;
	
	a = o.ExpeditionMapEnterRsp = class {
		decode(r) {
			this.map = new o.ExpeditionMap().decode(r);
			this.occupiedNum = r[r3]();
			return this;
		}
	};
	m = 7606;
	a[n] = m;
	c[m] = a;
	
	//团队远征--退出地图
	a = o.ExpeditionMapExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7607);
			w[w3](this.mapId);
			w[fm]();
		}
	};
	m = 7607;
	a[n] = m;
	
	a = o.ExpeditionMapExitRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 7607;
	a[n] = m;
	c[m] = a;
	
	//团队远征--通关地图
	a = o.ExpeditionMapClearRsp = class {
		decode(r) {
			this.mapId = r[r3]();
			return this;
		}
	};
	m = 7608;
	a[n] = m;
	c[m] = a;
	
	a = o.ExpeditionStage = class {
		constructor(d) {
			this.heroIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w6](this.playerId);
			w[w3](this.fightTime);
			w[w1](this.heroIds.length);
			for (var i = 0, len = this.heroIds.length; i < len; i++) {
				w[w3](this.heroIds[i]);   
			}
		}
		decode(r) {
			this.playerId = r[r6]();
			this.fightTime = r[r3]();
			this.heroIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.heroIds[i] = r[r3]();   
			}
			return this;
		}
	};
	
	//团队远征--查看据点
	a = o.ExpeditionPointDetailReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7609);
			w[w3](this.mapId);
			this.pos.encode(w);
			w[fm]();
		}
	};
	m = 7609;
	a[n] = m;
	
	a = o.ExpeditionPointDetailRsp = class {
		decode(r) {
			this.stages = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.stages[i] = new o.ExpeditionStage().decode(r);   
			}
			return this;
		}
	};
	m = 7609;
	a[n] = m;
	c[m] = a;
	
	//团队远征--查看所有占领据点
	a = o.ExpeditionOccupiedPointsReq0 = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
		}
		decode(r) {
			return this;
		}
	};
	
	a = o.ExpeditionOccupiedPointsRsp0 = class {
		constructor(d) {
			this.point = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w1](this.point.length);
			for (var i = 0, len = this.point.length; i < len; i++) {
				this.point[i].encode(w);   
			}
		}
		decode(r) {
			this.point = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.point[i] = new o.ExpeditionMapPoint().decode(r);   
			}
			return this;
		}
	};
	
	//团队远征--开始战斗
	a = o.ExpeditionFightStartReq = class {
		constructor(d) {
			this.grids = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7610);
			w[w3](this.mapId);
			this.pos.encode(w);
			w[w3](this.index);
			w[w1](this.grids.length);
			for (var i = 0, len = this.grids.length; i < len; i++) {
				w[w3](this.grids[i]);   
			}
			w[fm]();
		}
	};
	m = 7610;
	a[n] = m;
	
	a = o.ExpeditionFightStartRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 7610;
	a[n] = m;
	c[m] = a;
	
	//团队远征--战斗结束
	a = o.ExpeditionFightOverReq = class {
		constructor(d) {
			this.grids = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7611);
			w[wb](this.isClear);
			w[w1](this.grids.length);
			for (var i = 0, len = this.grids.length; i < len; i++) {
				w[w3](this.grids[i]);   
			}
			w[fm]();
		}
	};
	m = 7611;
	a[n] = m;
	
	a = o.ExpeditionFightOverRsp = class {
		decode(r) {
			this.point = new o.ExpeditionPoint().decode(r);
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7611;
	a[n] = m;
	c[m] = a;
	
	//团队远征--战斗退出
	a = o.ExpeditionFightExitReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7612);
			w[fm]();
		}
	};
	m = 7612;
	a[n] = m;
	
	a = o.ExpeditionFightExitRsp = class {
		decode(r) {
			this.point = new o.ExpeditionPoint().decode(r);
			return this;
		}
	};
	m = 7612;
	a[n] = m;
	c[m] = a;
	
	//团队远征--放弃据点
	a = o.ExpeditionGiveUpReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7613);
			w[w3](this.mapId);
			this.pos.encode(w);
			w[fm]();
		}
	};
	m = 7613;
	a[n] = m;
	
	a = o.ExpeditionGiveUpRsp = class {
		decode(r) {
			this.point = new o.ExpeditionPoint().decode(r);
			return this;
		}
	};
	m = 7613;
	a[n] = m;
	c[m] = a;
	
	a = o.ExpeditionBroadcastRsp = class {
		decode(r) {
			this.point = new o.ExpeditionPoint().decode(r);
			return this;
		}
	};
	m = 7614;
	a[n] = m;
	c[m] = a;
	
	//团队远征--挂机累计
	a = o.ExpeditionHangupItemsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7615);
			w[fm]();
		}
	};
	m = 7615;
	a[n] = m;
	
	a = o.ExpeditionHangupItemsRsp = class {
		decode(r) {
			this.hourReward = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.hourReward[i] = new o.GoodsInfo().decode(r);   
			}
			this.items = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.items[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7615;
	a[n] = m;
	c[m] = a;
	
	//团队远征--挂机领奖
	a = o.ExpeditionHangupRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7616);
			w[fm]();
		}
	};
	m = 7616;
	a[n] = m;
	
	a = o.ExpeditionHangupRewardRsp = class {
		decode(r) {
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7616;
	a[n] = m;
	c[m] = a;
	
	//团队远征--任务信息
	a = o.ExpeditionMissionStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7617);
			w[fm]();
		}
	};
	m = 7617;
	a[n] = m;
	
	a = o.ExpeditionMissionStateRsp = class {
		decode(r) {
			this.armyExp = r[r3]();
			this.rewarded = r[r6]();
			this.progress = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.progress[i] = new o.MissionProgress().decode(r);   
			}
			return this;
		}
	};
	m = 7617;
	a[n] = m;
	c[m] = a;
	
	//团队远征--任务进度更新
	a = o.ExpeditionMissionUpdateRsp = class {
		decode(r) {
			this.progress = new o.MissionProgress().decode(r);
			return this;
		}
	};
	m = 7618;
	a[n] = m;
	c[m] = a;
	
	//团队远征--任务领奖
	a = o.ExpeditionMissionRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7619);
			w[w3](this.missionId);
			w[fm]();
		}
	};
	m = 7619;
	a[n] = m;
	
	a = o.ExpeditionMissionRewardRsp = class {
		decode(r) {
			this.missionId = r[r3]();
			this.armyExp = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7619;
	a[n] = m;
	c[m] = a;
	
	//团队远征--部队状态
	a = o.ExpeditionArmyStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7620);
			w[fm]();
		}
	};
	m = 7620;
	a[n] = m;
	
	a = o.ExpeditionArmyStateRsp = class {
		decode(r) {
			this.levels1 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.levels1[i] = r[ry]();   
			}
			this.levels2 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.levels2[i] = r[ry]();   
			}
			this.levels3 = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.levels3[i] = r[ry]();   
			}
			return this;
		}
	};
	m = 7620;
	a[n] = m;
	c[m] = a;
	
	//团队远征--部队强化
	a = o.ExpeditionArmyStrengthenReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7621);
			w[w3](this.professionalType);
			w[w3](this.buffType);
			w[fm]();
		}
	};
	m = 7621;
	a[n] = m;
	
	a = o.ExpeditionArmyStrengthenRsp = class {
		decode(r) {
			this.professionalType = r[r3]();
			this.buffType = r[r3]();
			this.level = r[ry]();
			return this;
		}
	};
	m = 7621;
	a[n] = m;
	c[m] = a;
	
	a = o.ExpeditionRankBrief = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.roleBrief.encode(w);
			w[ws](this.guildName);
			w[w3](this.value);
		}
		decode(r) {
			this.roleBrief = new o.RoleBrief().decode(r);
			this.guildName = r[rs]();
			this.value = r[r3]();
			return this;
		}
	};
	
	//团队远征--远征排名
	a = o.ExpeditionRankingReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7622);
			w[fm]();
		}
	};
	m = 7622;
	a[n] = m;
	
	a = o.ExpeditionRankingRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.ExpeditionRankBrief().decode(r);   
			}
			this.mine = new o.ExpeditionRankBrief().decode(r);
			return this;
		}
	};
	m = 7622;
	a[n] = m;
	c[m] = a;
	
	a = o.ExpeditionOccupiedPoint = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.index);
			w[w3](this.num);
		}
		decode(r) {
			this.index = r[r3]();
			this.num = r[r3]();
			return this;
		}
	};
	
	//团队远征--查看所有占领据点
	a = o.ExpeditionOccupiedPointsReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7623);
			w[fm]();
		}
	};
	m = 7623;
	a[n] = m;
	
	a = o.ExpeditionOccupiedPointsRsp = class {
		decode(r) {
			this.point = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.point[i] = new o.ExpeditionOccupiedPoint().decode(r);   
			}
			return this;
		}
	};
	m = 7623;
	a[n] = m;
	c[m] = a;
	
	a = o.PlatformMission = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.missionId);
			w[w3](this.number);
			w[wb](this.rewarded);
		}
		decode(r) {
			this.missionId = r[r3]();
			this.number = r[r3]();
			this.rewarded = r[rb]();
			return this;
		}
	};
	
	//平台活动--任务列表
	a = o.PlatformMissionListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7701);
			w[fm]();
		}
	};
	m = 7701;
	a[n] = m;
	
	a = o.PlatformMissionListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.PlatformMission().decode(r);   
			}
			return this;
		}
	};
	m = 7701;
	a[n] = m;
	c[m] = a;
	
	//平台活动--任务触发
	a = o.PlatformMissionTriggerReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7702);
			w[w3](this.missionType);
			w[fm]();
		}
	};
	m = 7702;
	a[n] = m;
	
	a = o.PlatformMissionTriggerRsp = class {
		decode(r) {
			this.missions = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.missions[i] = new o.PlatformMission().decode(r);   
			}
			return this;
		}
	};
	m = 7702;
	a[n] = m;
	c[m] = a;
	
	//平台活动--领取奖励
	a = o.PlatformMissionRewardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7703);
			w[w3](this.missionId);
			w[fm]();
		}
	};
	m = 7703;
	a[n] = m;
	
	a = o.PlatformMissionRewardRsp = class {
		decode(r) {
			this.mission = new o.PlatformMission().decode(r);
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7703;
	a[n] = m;
	c[m] = a;
	
	//平台活动--豪礼列表
	a = o.PlatformFriendGiftListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7704);
			w[w3](this.level);
			w[fm]();
		}
	};
	m = 7704;
	a[n] = m;
	
	a = o.PlatformFriendGiftListRsp = class {
		decode(r) {
			this.level = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RoleBrief().decode(r);   
			}
			return this;
		}
	};
	m = 7704;
	a[n] = m;
	c[m] = a;
	
	//平台活动--返利信息
	a = o.PlatformFriendGemsInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7705);
			w[fm]();
		}
	};
	m = 7705;
	a[n] = m;
	
	a = o.PlatformFriendGemsInfoRsp = class {
		decode(r) {
			this.fetchedNum = r[r3]();
			this.unfetchedNum = r[r3]();
			return this;
		}
	};
	m = 7705;
	a[n] = m;
	c[m] = a;
	
	//平台活动--返利领取
	a = o.PlatformFriendGemsFetchReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7706);
			w[fm]();
		}
	};
	m = 7706;
	a[n] = m;
	
	a = o.PlatformFriendGemsFetchRsp = class {
		decode(r) {
			this.rewards = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rewards[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7706;
	a[n] = m;
	c[m] = a;
	
	a = o.SoldierTech = class {
		constructor(d) {
			this.slots = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.type);
			w[w3](this.lv);
			w[w3](this.exp);
			w[w1](this.slots.length);
			for (var i = 0, len = this.slots.length; i < len; i++) {
				w[w3](this.slots[i]);   
			}
		}
		decode(r) {
			this.type = r[ry]();
			this.lv = r[r3]();
			this.exp = r[r3]();
			this.slots = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.slots[i] = r[r3]();   
			}
			return this;
		}
	};
	
	//士兵科技--列表
	a = o.SoldierTechListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7801);
			w[fm]();
		}
	};
	m = 7801;
	a[n] = m;
	
	a = o.SoldierTechListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.SoldierTech().decode(r);   
			}
			return this;
		}
	};
	m = 7801;
	a[n] = m;
	c[m] = a;
	
	//士兵科技--科技升级
	a = o.SoldierTechLevelUpReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7802);
			w[wy](this.type);
			w[w3](this.itemId);
			w[w3](this.itemNum);
			w[fm]();
		}
	};
	m = 7802;
	a[n] = m;
	
	a = o.SoldierTechLevelUpRsp = class {
		decode(r) {
			this.soldierTech = new o.SoldierTech().decode(r);
			return this;
		}
	};
	m = 7802;
	a[n] = m;
	c[m] = a;
	
	a = o.SoldierTechResearch = class {
		constructor(d) {
			this.list = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.type);
			w[w3](this.heroId);
			w[w3](this.startTime);
			w[w1](this.list.length);
			for (var i = 0, len = this.list.length; i < len; i++) {
				this.list[i].encode(w);   
			}
		}
		decode(r) {
			this.type = r[ry]();
			this.heroId = r[r3]();
			this.startTime = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	
	//士兵科技--研究列表
	a = o.SoldierTechResearchListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7803);
			w[fm]();
		}
	};
	m = 7803;
	a[n] = m;
	
	a = o.SoldierTechResearchListRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.SoldierTechResearch().decode(r);   
			}
			return this;
		}
	};
	m = 7803;
	a[n] = m;
	c[m] = a;
	
	//士兵科技--领取奖励
	a = o.SoldierTechResearchAwardReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7804);
			w[fm]();
		}
	};
	m = 7804;
	a[n] = m;
	
	a = o.SoldierTechResearchAwardRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7804;
	a[n] = m;
	c[m] = a;
	
	//士兵科技--开始研究
	a = o.SoldierTechDoResearchReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7805);
			w[wy](this.type);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 7805;
	a[n] = m;
	
	a = o.SoldierTechDoResearchRsp = class {
		decode(r) {
			this.research = new o.SoldierTechResearch().decode(r);
			return this;
		}
	};
	m = 7805;
	a[n] = m;
	c[m] = a;
	
	//士兵科技--装备能量石
	a = o.SoldierTechEquipStoneReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7806);
			w[wy](this.type);
			w[wy](this.slot);
			w[w3](this.itemId);
			w[fm]();
		}
	};
	m = 7806;
	a[n] = m;
	
	a = o.SoldierTechEquipStoneRsp = class {
		decode(r) {
			this.itemId = r[r3]();
			this.soldierTech = new o.SoldierTech().decode(r);
			return this;
		}
	};
	m = 7806;
	a[n] = m;
	c[m] = a;
	
	a = o.SoldierTechDisint = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.itemId);
			w[w3](this.num);
		}
		decode(r) {
			this.itemId = r[r3]();
			this.num = r[r3]();
			return this;
		}
	};
	
	//士兵科技--分解能量石
	a = o.SoldierTechDisintStoneReq = class {
		constructor(d) {
			this.stones = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7807);
			w[w1](this.stones.length);
			for (var i = 0, len = this.stones.length; i < len; i++) {
				this.stones[i].encode(w);   
			}
			w[fm]();
		}
	};
	m = 7807;
	a[n] = m;
	
	a = o.SoldierTechDisintStoneRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7807;
	a[n] = m;
	c[m] = a;
	
	a = o.EnergizePlace = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[wy](this.place);
			this.items.encode(w);
		}
		decode(r) {
			this.place = r[ry]();
			this.items = new o.GoodsInfo().decode(r);
			return this;
		}
	};
	
	//聚能魔方--状态
	a = o.EnergizeStateReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7901);
			w[fm]();
		}
	};
	m = 7901;
	a[n] = m;
	
	a = o.EnergizeStateRsp = class {
		decode(r) {
			this.round = r[ry]();
			this.today = r[r3]();
			this.total = r[r3]();
			this.places = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.places[i] = new o.EnergizePlace().decode(r);   
			}
			return this;
		}
	};
	m = 7901;
	a[n] = m;
	c[m] = a;
	
	//聚能魔方--抽奖
	a = o.EnergizeDrawReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7902);
			w[fm]();
		}
	};
	m = 7902;
	a[n] = m;
	
	a = o.EnergizeDrawRsp = class {
		decode(r) {
			this.round = r[ry]();
			this.today = r[r3]();
			this.total = r[r3]();
			this.place = new o.EnergizePlace().decode(r);
			return this;
		}
	};
	m = 7902;
	a[n] = m;
	c[m] = a;
	
	//聚能魔方--领取，开启下一轮，清空位置上的物品
	a = o.EnergizeGetReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](7903);
			w[fm]();
		}
	};
	m = 7903;
	a[n] = m;
	
	a = o.EnergizeGetRsp = class {
		decode(r) {
			this.round = r[ry]();
			this.today = r[r3]();
			this.total = r[r3]();
			this.items = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.items[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 7903;
	a[n] = m;
	c[m] = a;
	
	//皇家竞技场--查看信息
	a = o.RoyalInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8001);
			w[fm]();
		}
	};
	m = 8001;
	a[n] = m;
	
	a = o.RoyalInfoRsp = class {
		decode(r) {
			this.mapIds = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.mapIds[i] = r[r3]();   
			}
			this.rank = r[r3]();
			this.score = r[r3]();
			this.enterNum = r[ry]();
			this.buyNum = r[ry]();
			this.matchNum = r[ry]();
			if (r[rb]()) {
				this.opponent = new o.RoyalBrief().decode(r);
			}
			this.round = r[ry]();
			this.winFlag = r[ry]();
			this.serverNum = r[r3]();
			this.div = r[ry]();
			this.divFlag = r[r3]();
			return this;
		}
	};
	m = 8001;
	a[n] = m;
	c[m] = a;
	
	//皇家竞技场--设置地图
	a = o.RoyalSetMapReq = class {
		constructor(d) {
			this.mapIds = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8002);
			w[w1](this.mapIds.length);
			for (var i = 0, len = this.mapIds.length; i < len; i++) {
				w[w3](this.mapIds[i]);   
			}
			w[fm]();
		}
	};
	m = 8002;
	a[n] = m;
	
	a = o.RoyalSetMapRsp = class {
		decode(r) {
			this.maps = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.maps[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 8002;
	a[n] = m;
	c[m] = a;
	
	a = o.RoyalBrief = class {
		constructor(d) {
			this.maps = [];
			this.heroes = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			this.brief.encode(w);
			w[w1](this.maps.length);
			for (var i = 0, len = this.maps.length; i < len; i++) {
				w[w3](this.maps[i]);   
			}
			w[w1](this.heroes.length);
			for (var i = 0, len = this.heroes.length; i < len; i++) {
				if (!this.heroes[i]) {
					w[wb](false);
				} else {
					w[wb](true);
					this.heroes[i].encode(w);
				}   
			}
			w[w3](this.score);
			w[w3](this.addScore);
			w[wy](this.div);
		}
		decode(r) {
			this.brief = new o.RoleBrief().decode(r);
			this.maps = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.maps[i] = r[r3]();   
			}
			this.heroes = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				if (r[rb]()) {
					this.heroes[i] = new o.HeroBrief().decode(r);
				}   
			}
			this.score = r[r3]();
			this.addScore = r[r3]();
			this.div = r[ry]();
			return this;
		}
	};
	
	//皇家竞技场--匹配对手
	a = o.RoyalMatchReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8003);
			w[fm]();
		}
	};
	m = 8003;
	a[n] = m;
	
	a = o.RoyalMatchRsp = class {
		decode(r) {
			this.matchNum = r[ry]();
			this.opponent = new o.RoyalBrief().decode(r);
			return this;
		}
	};
	m = 8003;
	a[n] = m;
	c[m] = a;
	
	//皇家竞技场--战斗开始
	a = o.RoyalFightStartReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8004);
			w[fm]();
		}
	};
	m = 8004;
	a[n] = m;
	
	a = o.RoyalFightStartRsp = class {
		decode(r) {
			this.enterNum = r[ry]();
			this.playerId = r[r6]();
			this.heroList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				if (r[rb]()) {
					this.heroList[i] = new o.FightHero().decode(r);
				}   
			}
			if (r[rb]()) {
				this.general = new o.FightGeneral().decode(r);
			}
			return this;
		}
	};
	m = 8004;
	a[n] = m;
	c[m] = a;
	
	//皇家竞技场--战斗结束
	a = o.RoyalFightOverReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8005);
			w[wy](this.round);
			w[wb](this.isWin);
			w[fm]();
		}
	};
	m = 8005;
	a[n] = m;
	
	a = o.RoyalFightOverRsp = class {
		decode(r) {
			this.round = r[ry]();
			this.isWin = r[rb]();
			this.newRank = r[r3]();
			this.newScore = r[r3]();
			this.newDiv = r[ry]();
			return this;
		}
	};
	m = 8005;
	a[n] = m;
	c[m] = a;
	
	a = o.RoyalFightRecord = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			this.player.encode(w);
			this.opponent.encode(w);
			w[w3](this.time);
			w[wy](this.winFlag);
		}
		decode(r) {
			this.player = new o.RoyalBrief().decode(r);
			this.opponent = new o.RoyalBrief().decode(r);
			this.time = r[r3]();
			this.winFlag = r[ry]();
			return this;
		}
	};
	
	//皇家竞技场--战斗记录
	a = o.RoyalFightRecordReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8006);
			w[fm]();
		}
	};
	m = 8006;
	a[n] = m;
	
	a = o.RoyalFightRecordRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.RoyalFightRecord().decode(r);   
			}
			return this;
		}
	};
	m = 8006;
	a[n] = m;
	c[m] = a;
	
	//皇家竞技场--排行榜
	a = o.RoyalFightRankReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8007);
			w[w3](this.page);
			w[w3](this.size);
			w[fm]();
		}
	};
	m = 8007;
	a[n] = m;
	
	a = o.RoyalFightRankRsp = class {
		decode(r) {
			this.page = r[r3]();
			this.size = r[r3]();
			this.rankNum = r[r3]();
			this.score = r[r3]();
			this.div = r[ry]();
			this.total = r[r3]();
			this.rankList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.rankList[i] = new o.RoyalBrief().decode(r);   
			}
			return this;
		}
	};
	m = 8007;
	a[n] = m;
	c[m] = a;
	
	//皇家竞技场--段位奖励
	a = o.RoyalDivReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8008);
			w[wy](this.div);
			w[fm]();
		}
	};
	m = 8008;
	a[n] = m;
	
	a = o.RoyalDivRsp = class {
		decode(r) {
			this.div = r[ry]();
			this.divFlag = r[r3]();
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 8008;
	a[n] = m;
	c[m] = a;
	
	//皇家竞技场--购买挑战次数
	a = o.RoyalBuyReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8009);
			w[fm]();
		}
	};
	m = 8009;
	a[n] = m;
	
	a = o.RoyalBuyRsp = class {
		decode(r) {
			this.buyNum = r[ry]();
			return this;
		}
	};
	m = 8009;
	a[n] = m;
	c[m] = a;
	
	a = o.UniqueEquip = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[w3](this.id);
			w[w3](this.itemId);
			w[wy](this.star);
		}
		decode(r) {
			this.id = r[r3]();
			this.itemId = r[r3]();
			this.star = r[ry]();
			return this;
		}
	};
	
	a = o.UniqueEquipUpdateRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.UniqueEquip().decode(r);   
			}
			this.deleteList = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.deleteList[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 8101;
	a[n] = m;
	c[m] = a;
	
	//专属装备--查看
	a = o.UniqueEquipListReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8102);
			w[fm]();
		}
	};
	m = 8102;
	a[n] = m;
	
	a = o.UniqueEquipListRsp = class {
		decode(r) {
			this.equips = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.equips[i] = new o.UniqueEquip().decode(r);   
			}
			return this;
		}
	};
	m = 8102;
	a[n] = m;
	c[m] = a;
	
	//专属装备--穿戴
	a = o.UniqueEquipOnReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8103);
			w[w3](this.id);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 8103;
	a[n] = m;
	
	a = o.UniqueEquipOnRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 8103;
	a[n] = m;
	c[m] = a;
	
	//专属装备--脱下
	a = o.UniqueEquipOffReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8104);
			w[w3](this.id);
			w[w3](this.heroId);
			w[fm]();
		}
	};
	m = 8104;
	a[n] = m;
	
	a = o.UniqueEquipOffRsp = class {
		decode(r) {
			return this;
		}
	};
	m = 8104;
	a[n] = m;
	c[m] = a;
	
	//专属装备--升星
	a = o.UniqueEquipStarUpReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8105);
			w[w3](this.id);
			w[w3](this.heroId);
			this.cost.encode(w);
			w[w3](this.costUniqueId);
			w[fm]();
		}
	};
	m = 8105;
	a[n] = m;
	
	a = o.UniqueEquipStarUpRsp = class {
		decode(r) {
			this.equip = new o.UniqueEquip().decode(r);
			return this;
		}
	};
	m = 8105;
	a[n] = m;
	c[m] = a;
	
	//专属装备--分解
	a = o.UniqueEquipDisintReq = class {
		constructor(d) {
			this.id = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8106);
			w[w1](this.id.length);
			for (var i = 0, len = this.id.length; i < len; i++) {
				w[w3](this.id[i]);   
			}
			w[fm]();
		}
	};
	m = 8106;
	a[n] = m;
	
	a = o.UniqueEquipDisintRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 8106;
	a[n] = m;
	c[m] = a;
	
	//专属装备--召唤
	a = o.UniqueEquipDrawReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8107);
			w[w3](this.id);
			w[wy](this.type);
			w[fm]();
		}
	};
	m = 8107;
	a[n] = m;
	
	a = o.UniqueEquipDrawRsp = class {
		decode(r) {
			this.list = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.list[i] = new o.GoodsInfo().decode(r);   
			}
			return this;
		}
	};
	m = 8107;
	a[n] = m;
	c[m] = a;
	
	//专属装备--查看心愿单
	a = o.UniqueEquipWishInfoReq = class {
		constructor(d) {
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8108);
			w[fm]();
		}
	};
	m = 8108;
	a[n] = m;
	
	a = o.UniqueEquipWishInfoRsp = class {
		decode(r) {
			this.id = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.id[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 8108;
	a[n] = m;
	c[m] = a;
	
	//专属装备--设置心愿单
	a = o.UniqueEquipWishSetReq = class {
		constructor(d) {
			this.id = [];
			if(d) __init__(this, d);
		}
		encode(w) {
			w[sm](8109);
			w[w1](this.id.length);
			for (var i = 0, len = this.id.length; i < len; i++) {
				w[w3](this.id[i]);   
			}
			w[fm]();
		}
	};
	m = 8109;
	a[n] = m;
	
	a = o.UniqueEquipWishSetRsp = class {
		decode(r) {
			this.id = [];
			for (var i = 0, len = r[r1](); i < len; i++) {
				this.id[i] = r[r3]();   
			}
			return this;
		}
	};
	m = 8109;
	a[n] = m;
	c[m] = a;
})();