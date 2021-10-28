declare namespace icmsg {

	export const datetime: number;

	export interface IReader {

		readonly HasMessage: boolean;

		// 追加数据到消息缓冲区
		WriteBuff(buf: ArrayBuffer): void;
		// 开始读取一条消息准备处理
		BeginMessage(): number;
		// 完成一条消息处理后调用
		FinishMessage(): void;

		Clear(): void;
		ReadString(): string;
		ReadByte(): number;
		ReadInt16(): number;
		ReadInt32(): number;
		ReadInt64(): number;
		ReadUInt32(): number;
        ReadInt(): number;
        ReadUInt(): number;
		ReadBool(): boolean;
	}

	export interface IWriter {

		StartMessage(msgType: number): void;
		FinishMessage(): void;
		WriteString(value: string): void;
		WriteByte(n: number): void;
		WriteInt16(n: number): void;
		WriteInt32(n: number): void;
		WriteInt64(n: number): void;
		WriteUInt32(n: number): void;
        WriteInt(n: number): void;
        WriteUInt(n: number): void;
		WriteBool(b: boolean): void;
		Buffer(): ArrayBuffer;
	}

	export interface Message {
		encode(writer: IWriter): void;
		decode(reader: IReader): Message;
	}

	export class MessageType {
		static MsgTypeActivityAlchemyFetch = 2814;
		static MsgTypeActivityAlchemyTimes = 2813;
		static MsgTypeActivityAssembledGain = 2836;
		static MsgTypeActivityAssembledInfo = 2835;
		static MsgTypeActivityAwakeGiftGain = 2831;
		static MsgTypeActivityAwakeGiftInfo = 2829;
		static MsgTypeActivityAwakeGiftSet = 2830;
		static MsgTypeActivityCaveAdventureGainBox = 2828;
		static MsgTypeActivityCaveAdventureInfo = 2826;
		static MsgTypeActivityCaveAdventureMove = 2827;
		static MsgTypeActivityCaveBuyTeam = 3510;
		static MsgTypeActivityCaveEndExplore = 3508;
		static MsgTypeActivityCaveEnter = 3502;
		static MsgTypeActivityCaveExchange = 3509;
		static MsgTypeActivityCaveExit = 3503;
		static MsgTypeActivityCaveExploreColor = 3506;
		static MsgTypeActivityCaveGift = 3504;
		static MsgTypeActivityCaveGiftBack = 3513;
		static MsgTypeActivityCavePassAward = 3512;
		static MsgTypeActivityCavePassList = 3511;
		static MsgTypeActivityCaveResetGift = 3505;
		static MsgTypeActivityCaveStartExplore = 3507;
		static MsgTypeActivityCaveState = 3501;
		static MsgTypeActivityCumloginAward = 2804;
		static MsgTypeActivityCumloginList = 2803;
		static MsgTypeActivityDiscount = 2833;
		static MsgTypeActivityDiscountBuy = 2834;
		static MsgTypeActivityDiscountState = 2832;
		static MsgTypeActivityExtraRemain = 2815;
		static MsgTypeActivityFlipCardsAward = 2808;
		static MsgTypeActivityFlipCardsInfo = 2810;
		static MsgTypeActivityFlipCardsList = 2807;
		static MsgTypeActivityGuardianDrawAward = 2825;
		static MsgTypeActivityGuardianDrawInfo = 2824;
		static MsgTypeActivityHotelClean = 2842;
		static MsgTypeActivityHotelFree = 2843;
		static MsgTypeActivityHotelState = 2841;
		static MsgTypeActivityLandGiftAward = 2823;
		static MsgTypeActivityLandGiftInfo = 2822;
		static MsgTypeActivityLuckyFlipCardsAward = 2809;
		static MsgTypeActivityMysteriousGain = 2847;
		static MsgTypeActivityMysteriousInfo = 2846;
		static MsgTypeActivityNewTopUpAward = 2819;
		static MsgTypeActivityNewTopUpList = 2818;
		static MsgTypeActivityRankingInfo = 2801;
		static MsgTypeActivityRankingReward = 2802;
		static MsgTypeActivitySailingCharge = 2838;
		static MsgTypeActivitySailingFree = 2839;
		static MsgTypeActivitySailingInfo = 2837;
		static MsgTypeActivitySailingMapReward = 2840;
		static MsgTypeActivityStoreBuy = 2817;
		static MsgTypeActivityStoreBuyInfo = 2816;
		static MsgTypeActivitySuperValueGain = 2849;
		static MsgTypeActivitySuperValueInfo = 2848;
		static MsgTypeActivitySuperValueNotice = 2850;
		static MsgTypeActivityTimeGiftGain = 2845;
		static MsgTypeActivityTimeGiftInfo = 2844;
		static MsgTypeActivityTopUpAward = 2806;
		static MsgTypeActivityTopUpList = 2805;
		static MsgTypeActivityTwistEggInfo = 2812;
		static MsgTypeActivityTwistEggReward = 2811;
		static MsgTypeActivityWeekendGift = 2820;
		static MsgTypeActivityWeekendGiftInfo = 2821;
		static MsgTypeAdventure2Consumption = 7102;
		static MsgTypeAdventure2DifficultyReward = 7125;
		static MsgTypeAdventure2Enter = 7104;
		static MsgTypeAdventure2EntryExchange = 7127;
		static MsgTypeAdventure2EntryList = 7111;
		static MsgTypeAdventure2EntryReset = 7128;
		static MsgTypeAdventure2EntrySelect = 7112;
		static MsgTypeAdventure2Exit = 7105;
		static MsgTypeAdventure2HeroCareer = 7124;
		static MsgTypeAdventure2HeroImage = 7123;
		static MsgTypeAdventure2HeroOn = 7121;
		static MsgTypeAdventure2Line = 7126;
		static MsgTypeAdventure2Mercenary = 7110;
		static MsgTypeAdventure2MercenaryList = 7109;
		static MsgTypeAdventure2NewHero = 7122;
		static MsgTypeAdventure2Next = 7115;
		static MsgTypeAdventure2PassAward = 7120;
		static MsgTypeAdventure2PassList = 7119;
		static MsgTypeAdventure2PlateEnter = 7103;
		static MsgTypeAdventure2Raid = 7129;
		static MsgTypeAdventure2Random = 7113;
		static MsgTypeAdventure2RankList = 7116;
		static MsgTypeAdventure2SaveState = 7130;
		static MsgTypeAdventure2Skip = 7131;
		static MsgTypeAdventure2State = 7101;
		static MsgTypeAdventure2StoreBuy = 7118;
		static MsgTypeAdventure2StoreList = 7117;
		static MsgTypeAdventure2TravelBuy = 7107;
		static MsgTypeAdventure2TravelFinish = 7108;
		static MsgTypeAdventure2TravelList = 7106;
		static MsgTypeAdventure2Treasure = 7114;
		static MsgTypeAdventureConsumption = 4702;
		static MsgTypeAdventureConsumptionEvent = 4713;
		static MsgTypeAdventureEnter = 4704;
		static MsgTypeAdventureEntryList = 4711;
		static MsgTypeAdventureEntrySelect = 4712;
		static MsgTypeAdventureExit = 4705;
		static MsgTypeAdventureMercenary = 4710;
		static MsgTypeAdventureMercenaryList = 4709;
		static MsgTypeAdventureNext = 4715;
		static MsgTypeAdventurePassAward = 4720;
		static MsgTypeAdventurePassList = 4719;
		static MsgTypeAdventurePlateEnter = 4703;
		static MsgTypeAdventureRankList = 4716;
		static MsgTypeAdventureState = 4701;
		static MsgTypeAdventureStoreBuy = 4718;
		static MsgTypeAdventureStoreList = 4717;
		static MsgTypeAdventureTravelBuy = 4707;
		static MsgTypeAdventureTravelFinish = 4708;
		static MsgTypeAdventureTravelList = 4706;
		static MsgTypeAdventureTreasure = 4714;
		static MsgTypeArenaBuy = 1907;
		static MsgTypeArenaDefence = 1905;
		static MsgTypeArenaDefenceSet = 1904;
		static MsgTypeArenaFight = 1902;
		static MsgTypeArenaFightResult = 1903;
		static MsgTypeArenaHonorDraw = 7506;
		static MsgTypeArenaHonorEnter = 7503;
		static MsgTypeArenaHonorExit = 7504;
		static MsgTypeArenaHonorFlower = 7509;
		static MsgTypeArenaHonorGroup = 7502;
		static MsgTypeArenaHonorGuess = 7505;
		static MsgTypeArenaHonorGuessHistory = 7507;
		static MsgTypeArenaHonorGuild = 7501;
		static MsgTypeArenaHonorRanking = 7508;
		static MsgTypeArenaInfo = 1901;
		static MsgTypeArenaMatch = 1906;
		static MsgTypeArenaPointsAward = 1909;
		static MsgTypeArenaPrepare = 1910;
		static MsgTypeArenaQuery = 1908;
		static MsgTypeArenaRaid = 1911;
		static MsgTypeArenaTeamAgree = 6105;
		static MsgTypeArenaTeamConfirm = 6113;
		static MsgTypeArenaTeamDemise = 6109;
		static MsgTypeArenaTeamFightOrder = 6114;
		static MsgTypeArenaTeamFightOver = 6116;
		static MsgTypeArenaTeamFightRecords = 6117;
		static MsgTypeArenaTeamFightRewards = 6118;
		static MsgTypeArenaTeamFightStart = 6115;
		static MsgTypeArenaTeamInfo = 6101;
		static MsgTypeArenaTeamInvite = 6103;
		static MsgTypeArenaTeamInviters = 6104;
		static MsgTypeArenaTeamMatch = 6112;
		static MsgTypeArenaTeamPlayers = 6102;
		static MsgTypeArenaTeamQuit = 6107;
		static MsgTypeArenaTeamRankList = 6120;
		static MsgTypeArenaTeamRankRewards = 6119;
		static MsgTypeArenaTeamRedPoints = 6111;
		static MsgTypeArenaTeamReject = 6106;
		static MsgTypeArenaTeamRemove = 6108;
		static MsgTypeArenaTeamSetting = 6110;
		static MsgTypeAssistAllianceActivate = 6706;
		static MsgTypeAssistAllianceGift = 6705;
		static MsgTypeAssistAllianceGiftRecord = 6704;
		static MsgTypeAssistAllianceLegion = 6703;
		static MsgTypeAssistAllianceOn = 6702;
		static MsgTypeAssistAllianceState = 6701;
		static MsgTypeBarrackLevels = 905;
		static MsgTypeBarrackLevelup = 906;
		static MsgTypeBarrackList = 901;
		static MsgTypeBarrackSoldiers = 904;
		static MsgTypeBarrackTechUp = 902;
		static MsgTypeBarrackUnlock = 903;
		static MsgTypeBaseBoost = 7404;
		static MsgTypeBaseBuild = 7403;
		static MsgTypeBaseComplete = 7406;
		static MsgTypeBaseDiggerList = 7407;
		static MsgTypeBaseHangRewardFetch = 7408;
		static MsgTypeBaseInfo = 7402;
		static MsgTypeBaseList = 7401;
		static MsgTypeBaseQuickHangReward = 7409;
		static MsgTypeBaseVaria = 7405;
		static MsgTypeBattleArrayOff = 3803;
		static MsgTypeBattleArrayQuery = 3801;
		static MsgTypeBattleArraySet = 3802;
		static MsgTypeBountyComplete = 3608;
		static MsgTypeBountyFightOver = 3607;
		static MsgTypeBountyFightQuery = 3605;
		static MsgTypeBountyFightReply = 3611;
		static MsgTypeBountyFightStart = 3606;
		static MsgTypeBountyList = 3601;
		static MsgTypeBountyListNum = 3609;
		static MsgTypeBountyMine = 3603;
		static MsgTypeBountyPublish = 3602;
		static MsgTypeBountyQuery = 3610;
		static MsgTypeBountyRefresh = 3604;
		static MsgTypeCarnivalInfo = 5504;
		static MsgTypeCarnivalPlayerAddScore = 5502;
		static MsgTypeCarnivalPlayerScoreQuery = 5503;
		static MsgTypeCarnivalPlayerServerRank = 5505;
		static MsgTypeCarnivalServerScoreRank = 5501;
		static MsgTypeChampionExchange = 4809;
		static MsgTypeChampionFetchScore = 4808;
		static MsgTypeChampionFightOver = 4805;
		static MsgTypeChampionFightStart = 4804;
		static MsgTypeChampionGuess = 4813;
		static MsgTypeChampionGuessFight = 4814;
		static MsgTypeChampionGuessFightResult = 4815;
		static MsgTypeChampionGuessHistory = 4816;
		static MsgTypeChampionGuessList = 4812;
		static MsgTypeChampionInfo = 4802;
		static MsgTypeChampionLvRewards = 4810;
		static MsgTypeChampionMatch = 4803;
		static MsgTypeChampionRankRewards = 4811;
		static MsgTypeChampionRanking = 4807;
		static MsgTypeChampionRecords = 4806;
		static MsgTypeChampionRedPoints = 4801;
		static MsgTypeChatHistory = 302;
		static MsgTypeChatSend = 301;
		static MsgTypeCommentInfo = 4904;
		static MsgTypeCommentNum = 4905;
		static MsgTypeCostumeCustom = 5209;
		static MsgTypeCostumeCustomScore = 5208;
		static MsgTypeCostumeCustomScoreUpdate = 5207;
		static MsgTypeCostumeCustomState = 5206;
		static MsgTypeCostumeDisint = 5202;
		static MsgTypeCostumeList = 5201;
		static MsgTypeCostumeOn = 5203;
		static MsgTypeCostumeUpdate = 5205;
		static MsgTypeCostumeUpgrade = 5204;
		static MsgTypeCrossTreasure = 6503;
		static MsgTypeCrossTreasureNum = 6501;
		static MsgTypeCrossTreasureRecordList = 6504;
		static MsgTypeCrossTreasureState = 6502;
		static MsgTypeDoomsDayEnter = 3702;
		static MsgTypeDoomsDayExit = 3703;
		static MsgTypeDoomsDayList = 3701;
		static MsgTypeDoomsDayQuickRaids = 3705;
		static MsgTypeDoomsDayRaids = 3704;
		static MsgTypeDrawEggAward = 4602;
		static MsgTypeDrawEggInfo = 4601;
		static MsgTypeDrawEggSPReward = 4603;
		static MsgTypeDungeonAssists = 2114;
		static MsgTypeDungeonBossBattle = 2111;
		static MsgTypeDungeonBossClick = 2112;
		static MsgTypeDungeonBossFight = 2113;
		static MsgTypeDungeonBossSummon = 2110;
		static MsgTypeDungeonChapterList = 2101;
		static MsgTypeDungeonChapterReward = 2102;
		static MsgTypeDungeonElites = 2115;
		static MsgTypeDungeonElitesChapterRewards = 2117;
		static MsgTypeDungeonElitesRewards = 2126;
		static MsgTypeDungeonEnter = 2104;
		static MsgTypeDungeonExit = 2105;
		static MsgTypeDungeonHangChoose = 2107;
		static MsgTypeDungeonHangPreview = 2116;
		static MsgTypeDungeonHangReward = 2109;
		static MsgTypeDungeonHangStatus = 2108;
		static MsgTypeDungeonHeroEnter = 2123;
		static MsgTypeDungeonHeroExit = 2124;
		static MsgTypeDungeonHeroQuickRaid = 2125;
		static MsgTypeDungeonHeroRaid = 2122;
		static MsgTypeDungeonHeroSweepTimes = 2121;
		static MsgTypeDungeonList = 2103;
		static MsgTypeDungeonMinPower = 2138;
		static MsgTypeDungeonOrdealEnter = 2133;
		static MsgTypeDungeonOrdealExit = 2134;
		static MsgTypeDungeonOrdealInfo = 2132;
		static MsgTypeDungeonOrdealRankList = 2135;
		static MsgTypeDungeonOrdealReward = 2137;
		static MsgTypeDungeonOrdealRewardUpdate = 2136;
		static MsgTypeDungeonRaids = 2106;
		static MsgTypeDungeonRuneEnter = 2127;
		static MsgTypeDungeonRuneExit = 2128;
		static MsgTypeDungeonRuneInfo = 2131;
		static MsgTypeDungeonRuneQuickRaid = 2130;
		static MsgTypeDungeonRuneRaid = 2129;
		static MsgTypeDungeonSevenDayEnter = 2143;
		static MsgTypeDungeonSevenDayExit = 2144;
		static MsgTypeDungeonSevenDayGift = 2146;
		static MsgTypeDungeonSevenDayReward = 2145;
		static MsgTypeDungeonSevenDayState = 2142;
		static MsgTypeDungeonTrialBuyRaids = 2120;
		static MsgTypeDungeonTrialRaids = 2119;
		static MsgTypeDungeonTrialRewards = 2118;
		static MsgTypeDungeonUltimateEnter = 2140;
		static MsgTypeDungeonUltimateExit = 2141;
		static MsgTypeDungeonUltimateState = 2139;
		static MsgTypeEnergizeDraw = 7902;
		static MsgTypeEnergizeGet = 7903;
		static MsgTypeEnergizeState = 7901;
		static MsgTypeEnergyStationAdvance = 5804;
		static MsgTypeEnergyStationInfo = 5801;
		static MsgTypeEnergyStationRedPoint = 5805;
		static MsgTypeEnergyStationUnlock = 5802;
		static MsgTypeEnergyStationUpgrade = 5803;
		static MsgTypeEquipCompose = 704;
		static MsgTypeEquipComposeRecursive = 705;
		static MsgTypeEquipDisint = 703;
		static MsgTypeEquipList = 701;
		static MsgTypeEquipUpdate = 702;
		static MsgTypeExcitingActivityProgress = 4003;
		static MsgTypeExcitingActivityRewards = 4002;
		static MsgTypeExcitingActivityState = 4001;
		static MsgTypeExcitingActivityUpgradeLimit = 4004;
		static MsgTypeExpeditionArmyState = 7620;
		static MsgTypeExpeditionArmyStrengthen = 7621;
		static MsgTypeExpeditionBroadcast = 7614;
		static MsgTypeExpeditionBuyEnergy = 7603;
		static MsgTypeExpeditionFightExit = 7612;
		static MsgTypeExpeditionFightOver = 7611;
		static MsgTypeExpeditionFightStart = 7610;
		static MsgTypeExpeditionGiveUp = 7613;
		static MsgTypeExpeditionHangupItems = 7615;
		static MsgTypeExpeditionHangupReward = 7616;
		static MsgTypeExpeditionHeroChange = 7602;
		static MsgTypeExpeditionHeroList = 7601;
		static MsgTypeExpeditionLogList = 7604;
		static MsgTypeExpeditionMapClear = 7608;
		static MsgTypeExpeditionMapEnter = 7606;
		static MsgTypeExpeditionMapExit = 7607;
		static MsgTypeExpeditionMapList = 7605;
		static MsgTypeExpeditionMissionReward = 7619;
		static MsgTypeExpeditionMissionState = 7617;
		static MsgTypeExpeditionMissionUpdate = 7618;
		static MsgTypeExpeditionOccupiedPoints = 7623;
		static MsgTypeExpeditionPointDetail = 7609;
		static MsgTypeExpeditionRanking = 7622;
		static MsgTypeFeedbackByRole = 2602;
		static MsgTypeFeedbackGmReply = 2603;
		static MsgTypeFeedbackInfo = 2601;
		static MsgTypeFightDamageStatic = 1006;
		static MsgTypeFightDefenceFail = 1005;
		static MsgTypeFightDefend = 1002;
		static MsgTypeFightLookup = 1004;
		static MsgTypeFightQuery = 1001;
		static MsgTypeFightReplay = 1003;
		static MsgTypeFindComment = 4903;
		static MsgTypeFlipCardInfo = 4501;
		static MsgTypeFlipCardNextTurn = 4504;
		static MsgTypeFlipCardReward = 4503;
		static MsgTypeFlipCardSPReward = 4502;
		static MsgTypeFootholdAChatHis = 3439;
		static MsgTypeFootholdAlliance = 3435;
		static MsgTypeFootholdAtkFlagDel = 3438;
		static MsgTypeFootholdAtkFlagGet = 3436;
		static MsgTypeFootholdAtkFlagSet = 3437;
		static MsgTypeFootholdBaseLevel = 3423;
		static MsgTypeFootholdBaseReward = 3422;
		static MsgTypeFootholdBossKilled = 3416;
		static MsgTypeFootholdBuyEnergy = 3421;
		static MsgTypeFootholdCancelRedpoint = 3417;
		static MsgTypeFootholdCatchUp = 3427;
		static MsgTypeFootholdCoopApplyAnswer = 3471;
		static MsgTypeFootholdCoopApplyAsk = 3468;
		static MsgTypeFootholdCoopApplyNotice = 3469;
		static MsgTypeFootholdCoopApplyPlayers = 3470;
		static MsgTypeFootholdCoopApplySetting = 3472;
		static MsgTypeFootholdCoopGuildList = 3461;
		static MsgTypeFootholdCoopGuildMembers = 3473;
		static MsgTypeFootholdCoopGuildPublish = 3474;
		static MsgTypeFootholdCoopInviteAnswer = 3467;
		static MsgTypeFootholdCoopInviteAsk = 3464;
		static MsgTypeFootholdCoopInviteGuilds = 3466;
		static MsgTypeFootholdCoopInviteNotice = 3465;
		static MsgTypeFootholdCoopPlayerList = 3463;
		static MsgTypeFootholdCoopRankList = 3462;
		static MsgTypeFootholdFightBroadcast = 3414;
		static MsgTypeFootholdFightOver = 3413;
		static MsgTypeFootholdFightQuery = 3411;
		static MsgTypeFootholdFightRank = 3460;
		static MsgTypeFootholdFightRecords = 3440;
		static MsgTypeFootholdFightStart = 3412;
		static MsgTypeFootholdFreeEnergy = 3434;
		static MsgTypeFootholdGatherBrief = 3442;
		static MsgTypeFootholdGatherCancel = 3444;
		static MsgTypeFootholdGatherFightOver = 3451;
		static MsgTypeFootholdGatherFightStart = 3450;
		static MsgTypeFootholdGatherInit = 3441;
		static MsgTypeFootholdGatherInvite = 3445;
		static MsgTypeFootholdGatherInviters = 3446;
		static MsgTypeFootholdGatherJoin = 3448;
		static MsgTypeFootholdGatherPoints = 3449;
		static MsgTypeFootholdGatherRefuse = 3447;
		static MsgTypeFootholdGatherTeam = 3443;
		static MsgTypeFootholdGiveUp = 3426;
		static MsgTypeFootholdGuardBrief = 3453;
		static MsgTypeFootholdGuardCancel = 3455;
		static MsgTypeFootholdGuardInit = 3452;
		static MsgTypeFootholdGuardInvite = 3456;
		static MsgTypeFootholdGuardInviters = 3457;
		static MsgTypeFootholdGuardJoin = 3459;
		static MsgTypeFootholdGuardRefuse = 3458;
		static MsgTypeFootholdGuardTeam = 3454;
		static MsgTypeFootholdGuessQuery = 3431;
		static MsgTypeFootholdGuessReward = 3433;
		static MsgTypeFootholdGuessVote = 3432;
		static MsgTypeFootholdGuideCommit = 3429;
		static MsgTypeFootholdGuideQuery = 3430;
		static MsgTypeFootholdGuildJoin = 3407;
		static MsgTypeFootholdLastRank = 3428;
		static MsgTypeFootholdListOutput = 3424;
		static MsgTypeFootholdLookupGuild = 3402;
		static MsgTypeFootholdLookupPlayer = 3401;
		static MsgTypeFootholdMapEnter = 3405;
		static MsgTypeFootholdMapEnter2 = 3475;
		static MsgTypeFootholdMapExit = 3406;
		static MsgTypeFootholdMapProgress = 3419;
		static MsgTypeFootholdMapRanking = 3420;
		static MsgTypeFootholdPlayerJoin = 3408;
		static MsgTypeFootholdPointDetail = 3409;
		static MsgTypeFootholdPointScore = 3410;
		static MsgTypeFootholdRanking = 3418;
		static MsgTypeFootholdRedPoints = 3403;
		static MsgTypeFootholdRoleInfo = 3404;
		static MsgTypeFootholdTakeOutput = 3425;
		static MsgTypeFootholdTop6Guild = 3415;
		static MsgTypeFriendBecome = 508;
		static MsgTypeFriendBlacklist = 502;
		static MsgTypeFriendBlacklistIn = 503;
		static MsgTypeFriendBlacklistOut = 504;
		static MsgTypeFriendDelete = 509;
		static MsgTypeFriendGive = 512;
		static MsgTypeFriendInvite = 506;
		static MsgTypeFriendList = 501;
		static MsgTypeFriendReceive = 514;
		static MsgTypeFriendRecommend = 510;
		static MsgTypeFriendRefuse = 507;
		static MsgTypeFriendRenameNotice = 515;
		static MsgTypeFriendRequest = 505;
		static MsgTypeFriendSearch = 511;
		static MsgTypeFriendTake = 513;
		static MsgTypeGeneDraw = 4101;
		static MsgTypeGeneDrawHistory = 4105;
		static MsgTypeGeneStore = 4104;
		static MsgTypeGeneTrans = 4102;
		static MsgTypeGeneTransConfirm = 4103;
		static MsgTypeGeneralAttr = 1601;
		static MsgTypeGeneralChangeWeapon = 1603;
		static MsgTypeGeneralInfo = 1602;
		static MsgTypeGeneralWeaponGet = 1605;
		static MsgTypeGeneralWeaponInfo = 1604;
		static MsgTypeGeneralWeaponLevelUpgrade = 1607;
		static MsgTypeGeneralWeaponProgressUpgrade = 1608;
		static MsgTypeGeneralWeaponUpgradeInfo = 1606;
		static MsgTypeGiftFetch = 2501;
		static MsgTypeGrowthfundAward = 3104;
		static MsgTypeGrowthfundList = 3103;
		static MsgTypeGuardianCopyEnter = 6606;
		static MsgTypeGuardianCopyExit = 6607;
		static MsgTypeGuardianCopyRaid = 6608;
		static MsgTypeGuardianCopyState = 6605;
		static MsgTypeGuardianCumAward = 6604;
		static MsgTypeGuardianDecompose = 6614;
		static MsgTypeGuardianDraw = 6602;
		static MsgTypeGuardianDrawState = 6601;
		static MsgTypeGuardianEquipDecompose = 6620;
		static MsgTypeGuardianEquipLevelUp = 6621;
		static MsgTypeGuardianEquipList = 6616;
		static MsgTypeGuardianEquipOff = 6618;
		static MsgTypeGuardianEquipOn = 6617;
		static MsgTypeGuardianEquipStarUp = 6622;
		static MsgTypeGuardianEquipUpdate = 6619;
		static MsgTypeGuardianFallback = 6630;
		static MsgTypeGuardianFallbackPreview = 6629;
		static MsgTypeGuardianLevelUp = 6610;
		static MsgTypeGuardianList = 6609;
		static MsgTypeGuardianPutOn = 6612;
		static MsgTypeGuardianStarUp = 6611;
		static MsgTypeGuardianTakeOff = 6613;
		static MsgTypeGuardianTowerEnter = 6624;
		static MsgTypeGuardianTowerExit = 6625;
		static MsgTypeGuardianTowerRaid = 6626;
		static MsgTypeGuardianTowerRaidBuy = 6627;
		static MsgTypeGuardianTowerRankList = 6628;
		static MsgTypeGuardianTowerState = 6623;
		static MsgTypeGuardianUpdate = 6615;
		static MsgTypeGuardianWish = 6603;
		static MsgTypeGuideGroupList = 2301;
		static MsgTypeGuideGroupSave = 2302;
		static MsgTypeGuideGroupStep = 2303;
		static MsgTypeGuildAccelerateAll = 2942;
		static MsgTypeGuildAccelerateBroadcast = 2944;
		static MsgTypeGuildAccelerateList = 2941;
		static MsgTypeGuildAccelerateNotice = 2943;
		static MsgTypeGuildAcceptInvite = 2926;
		static MsgTypeGuildBossEnter = 4304;
		static MsgTypeGuildBossExit = 4305;
		static MsgTypeGuildBossNotice = 4307;
		static MsgTypeGuildBossOpen = 4302;
		static MsgTypeGuildBossRaids = 4308;
		static MsgTypeGuildBossRank = 4303;
		static MsgTypeGuildBossReward = 4306;
		static MsgTypeGuildBossState = 4301;
		static MsgTypeGuildCamp = 2904;
		static MsgTypeGuildCheck = 2908;
		static MsgTypeGuildCreate = 2905;
		static MsgTypeGuildDetail = 2902;
		static MsgTypeGuildDropAllot = 2932;
		static MsgTypeGuildDropFetch = 2934;
		static MsgTypeGuildDropState = 2931;
		static MsgTypeGuildDropStored = 2933;
		static MsgTypeGuildEnvelopeChange = 5403;
		static MsgTypeGuildEnvelopeGet = 5405;
		static MsgTypeGuildEnvelopeList = 5402;
		static MsgTypeGuildEnvelopeRank = 5401;
		static MsgTypeGuildEnvelopeSend = 5404;
		static MsgTypeGuildGatherConfirm = 7305;
		static MsgTypeGuildGatherEnd = 7306;
		static MsgTypeGuildGatherHeroOn = 7304;
		static MsgTypeGuildGatherRank = 7302;
		static MsgTypeGuildGatherReward = 7303;
		static MsgTypeGuildGatherState = 7301;
		static MsgTypeGuildInvite = 2925;
		static MsgTypeGuildInviteInfo = 2927;
		static MsgTypeGuildJoin = 2906;
		static MsgTypeGuildKick = 2910;
		static MsgTypeGuildList = 2901;
		static MsgTypeGuildLogList = 2939;
		static MsgTypeGuildMailSend = 2937;
		static MsgTypeGuildMailTimes = 2936;
		static MsgTypeGuildMissionList = 2928;
		static MsgTypeGuildMissionReward = 2930;
		static MsgTypeGuildMissionUpdate = 2929;
		static MsgTypeGuildQuery = 2903;
		static MsgTypeGuildQuit = 2909;
		static MsgTypeGuildRecruit = 2935;
		static MsgTypeGuildRemind = 2940;
		static MsgTypeGuildReqNotice = 2938;
		static MsgTypeGuildRequests = 2907;
		static MsgTypeGuildSelfTitle = 2924;
		static MsgTypeGuildSetCamp = 2917;
		static MsgTypeGuildSetCheck = 2912;
		static MsgTypeGuildSetIcon = 2913;
		static MsgTypeGuildSetName = 2914;
		static MsgTypeGuildSetNotice = 2915;
		static MsgTypeGuildSetTitle = 2916;
		static MsgTypeGuildSign = 2919;
		static MsgTypeGuildSignBox = 2920;
		static MsgTypeGuildSignInfo = 2918;
		static MsgTypeGuildSthWarDetail = 2922;
		static MsgTypeGuildSthWarFight = 2923;
		static MsgTypeGuildSthWarStart = 2921;
		static MsgTypeGuildUpdate = 2911;
		static MsgTypeGweaponIdInfo = 1704;
		static MsgTypeGweaponList = 1701;
		static MsgTypeGweaponStrength = 1702;
		static MsgTypeGweaponUpgradeStar = 1703;
		static MsgTypeHeroAttr = 804;
		static MsgTypeHeroAwake = 829;
		static MsgTypeHeroAwakeBooks = 831;
		static MsgTypeHeroAwakeEnter = 826;
		static MsgTypeHeroAwakeExit = 827;
		static MsgTypeHeroAwakeGift = 1324;
		static MsgTypeHeroAwakeGiftUpdate = 1325;
		static MsgTypeHeroAwakeMissonUpdate = 825;
		static MsgTypeHeroAwakePreview = 828;
		static MsgTypeHeroAwakeState = 824;
		static MsgTypeHeroCareerTrans = 812;
		static MsgTypeHeroCareerUp = 811;
		static MsgTypeHeroDecompose = 820;
		static MsgTypeHeroDetail = 805;
		static MsgTypeHeroDisplace = 822;
		static MsgTypeHeroEquipOff = 807;
		static MsgTypeHeroEquipOn = 806;
		static MsgTypeHeroEquipUpdate = 808;
		static MsgTypeHeroFallback = 830;
		static MsgTypeHeroInfo = 821;
		static MsgTypeHeroLevelup = 809;
		static MsgTypeHeroList = 801;
		static MsgTypeHeroMaxStarUp = 823;
		static MsgTypeHeroMysticLink = 833;
		static MsgTypeHeroMysticSkillUp = 835;
		static MsgTypeHeroMysticUnLink = 834;
		static MsgTypeHeroPowerUpdate = 803;
		static MsgTypeHeroRebirth = 832;
		static MsgTypeHeroResetConfirm = 819;
		static MsgTypeHeroResetPreview = 818;
		static MsgTypeHeroSoldierActive = 816;
		static MsgTypeHeroSoldierChange = 814;
		static MsgTypeHeroSoldierInfo = 815;
		static MsgTypeHeroSoldierList = 813;
		static MsgTypeHeroStarup = 810;
		static MsgTypeHeroStatusLock = 817;
		static MsgTypeHeroUpdate = 802;
		static MsgTypeInsertComment = 4901;
		static MsgTypeItemCompose = 604;
		static MsgTypeItemDisint = 603;
		static MsgTypeItemList = 601;
		static MsgTypeItemUpdate = 602;
		static MsgTypeJusticeBossReset = 2008;
		static MsgTypeJusticeClick = 2003;
		static MsgTypeJusticeGeneralLvup = 2005;
		static MsgTypeJusticeHeroIn = 2004;
		static MsgTypeJusticeItemsGot = 2009;
		static MsgTypeJusticeMercenaryLvup = 2007;
		static MsgTypeJusticeQuickKill = 2010;
		static MsgTypeJusticeQuickLvup = 2011;
		static MsgTypeJusticeSlotOpen = 2006;
		static MsgTypeJusticeState = 2001;
		static MsgTypeJusticeSummon = 2002;
		static MsgTypeLuckyCompose = 2202;
		static MsgTypeLuckyCreditExchange = 2204;
		static MsgTypeLuckyDraw = 2201;
		static MsgTypeLuckyDrawOptional = 2207;
		static MsgTypeLuckyDrawSummon = 2206;
		static MsgTypeLuckyDrawSummonState = 2205;
		static MsgTypeLuckyNumber = 2203;
		static MsgTypeMailDelete = 404;
		static MsgTypeMailDraw = 403;
		static MsgTypeMailList = 401;
		static MsgTypeMailNotice = 406;
		static MsgTypeMailRead = 402;
		static MsgTypeMailUpdate = 405;
		static MsgTypeMartialSoulEnter = 3902;
		static MsgTypeMartialSoulExit = 3903;
		static MsgTypeMartialSoulState = 3901;
		static MsgTypeMasteryExploreReward = 1204;
		static MsgTypeMasteryExploreStart = 1202;
		static MsgTypeMasteryExploreStop = 1203;
		static MsgTypeMasteryStageIdList = 1205;
		static MsgTypeMasteryStageUpdate = 1206;
		static MsgTypeMasteryTeamList = 1201;
		static MsgTypeMercenaryBorrow = 3207;
		static MsgTypeMercenaryBorrowed = 3208;
		static MsgTypeMercenaryCancel = 3210;
		static MsgTypeMercenaryFight = 3209;
		static MsgTypeMercenaryGain = 3205;
		static MsgTypeMercenaryImage = 3201;
		static MsgTypeMercenaryLendOff = 3203;
		static MsgTypeMercenaryLendOn = 3202;
		static MsgTypeMercenaryLent = 3204;
		static MsgTypeMercenaryList = 3206;
		static MsgTypeMergeCarnivalCurServerRank = 6908;
		static MsgTypeMergeCarnivalExchange = 6905;
		static MsgTypeMergeCarnivalPlayerScore = 6906;
		static MsgTypeMergeCarnivalServerRank = 6907;
		static MsgTypeMergeCarnivalState = 6904;
		static MsgTypeMergeCarnivalStore = 6901;
		static MsgTypeMergeCarnivalStoreBuy = 6902;
		static MsgTypeMergeCarnivalStoreLeft = 6903;
		static MsgTypeMission7daysScoreAward = 1104;
		static MsgTypeMissionAdventureDiaryReward = 1118;
		static MsgTypeMissionAdventureDiaryRewardInfo = 1119;
		static MsgTypeMissionComboInfo = 1121;
		static MsgTypeMissionDailyRoundId = 1120;
		static MsgTypeMissionGrowChapterAward = 1109;
		static MsgTypeMissionGrowList = 1107;
		static MsgTypeMissionGrowTaskAward = 1110;
		static MsgTypeMissionGrowUpdate = 1108;
		static MsgTypeMissionList = 1101;
		static MsgTypeMissionOnlineAward = 1106;
		static MsgTypeMissionOnlineInfo = 1105;
		static MsgTypeMissionReward = 1103;
		static MsgTypeMissionUpdate = 1102;
		static MsgTypeMissionWeaponList = 1115;
		static MsgTypeMissionWeaponTaskAward = 1117;
		static MsgTypeMissionWeaponUpdate = 1116;
		static MsgTypeMissionWelfare2Award = 1114;
		static MsgTypeMissionWelfare2List = 1113;
		static MsgTypeMissionWelfareAward = 1112;
		static MsgTypeMissionWelfareList = 1111;
		static MsgTypeMonthCardBuy = 2408;
		static MsgTypeMonthCardDayReward = 2405;
		static MsgTypeMonthCardDungeonChoose = 2404;
		static MsgTypeMonthCardDungeonInfo = 2403;
		static MsgTypeMonthCardList = 2401;
		static MsgTypeMonthCardPaySumVipReward = 2406;
		static MsgTypeMonthCardQuickCombatInfo = 2407;
		static MsgTypeMonthCardUpdate = 2402;
		static MsgTypeNewOrdealEnter = 5902;
		static MsgTypeNewOrdealExit = 5903;
		static MsgTypeNewOrdealInfo = 5901;
		static MsgTypeNewOrdealRankList = 5904;
		static MsgTypeOperationStoreListInfo = 1321;
		static MsgTypeOperationStoreUpdate = 1320;
		static MsgTypePassAward = 3102;
		static MsgTypePassFundFetch = 3108;
		static MsgTypePassFundList = 3107;
		static MsgTypePassList = 3101;
		static MsgTypePassWeeklyAward = 3110;
		static MsgTypePassWeeklyList = 3109;
		static MsgTypePayCrossRank = 2708;
		static MsgTypePayDailyFirstInfo = 2706;
		static MsgTypePayDailyFirstReward = 2707;
		static MsgTypePayFirstList = 2703;
		static MsgTypePayFirstReward = 2705;
		static MsgTypePayFirstUpdate = 2704;
		static MsgTypePayOrder = 2701;
		static MsgTypePaySucc = 2702;
		static MsgTypePeakBuyEnterTime = 6204;
		static MsgTypePeakEnter = 6205;
		static MsgTypePeakExit = 6207;
		static MsgTypePeakFight = 6206;
		static MsgTypePeakHeroCareer = 6216;
		static MsgTypePeakHeroDisplace = 6210;
		static MsgTypePeakHeroDisplaceConfirm = 6211;
		static MsgTypePeakHeroDisplaceRecord = 6209;
		static MsgTypePeakHeroImage = 6215;
		static MsgTypePeakHeroOn = 6202;
		static MsgTypePeakHeroResetDisplaceRecord = 6212;
		static MsgTypePeakMatching = 6203;
		static MsgTypePeakRanking = 6214;
		static MsgTypePeakRecord = 6213;
		static MsgTypePeakReward = 6208;
		static MsgTypePeakState = 6201;
		static MsgTypePiecesBattleArray = 7217;
		static MsgTypePiecesBuyHero = 7209;
		static MsgTypePiecesBuyHeroPanel = 7206;
		static MsgTypePiecesBuyTime = 7202;
		static MsgTypePiecesCrossServerNum = 7222;
		static MsgTypePiecesEnter = 7216;
		static MsgTypePiecesExit = 7218;
		static MsgTypePiecesFightQuery = 7221;
		static MsgTypePiecesGainDivisionReward = 7205;
		static MsgTypePiecesHeroAttr = 7213;
		static MsgTypePiecesHeroChangeLine = 7211;
		static MsgTypePiecesHeroList = 7214;
		static MsgTypePiecesHeroOnBattle = 7215;
		static MsgTypePiecesHeroUpdate = 7212;
		static MsgTypePiecesInfo = 7201;
		static MsgTypePiecesLightUpTalent = 7203;
		static MsgTypePiecesLockBuyHeroPanel = 7208;
		static MsgTypePiecesRankList = 7204;
		static MsgTypePiecesRefreshBuyHeroPanel = 7207;
		static MsgTypePiecesRoundEnd = 7220;
		static MsgTypePiecesRoundStart = 7219;
		static MsgTypePiecesSellHero = 7210;
		static MsgTypePiecesUpgradeChessBoard = 7223;
		static MsgTypePlatformFriendGemsFetch = 7706;
		static MsgTypePlatformFriendGemsInfo = 7705;
		static MsgTypePlatformFriendGiftList = 7704;
		static MsgTypePlatformMissionList = 7701;
		static MsgTypePlatformMissionReward = 7703;
		static MsgTypePlatformMissionTrigger = 7702;
		static MsgTypeRankArena = 1806;
		static MsgTypeRankDetail = 1811;
		static MsgTypeRankMcups = 1809;
		static MsgTypeRankMcupsValues = 1810;
		static MsgTypeRankMstage = 1807;
		static MsgTypeRankMstageValues = 1808;
		static MsgTypeRankPower = 1802;
		static MsgTypeRankPowerValues = 1803;
		static MsgTypeRankRefine = 1804;
		static MsgTypeRankRefineValues = 1805;
		static MsgTypeRankSelf = 1812;
		static MsgTypeRankYesterday = 1801;
		static MsgTypeRelicBroadcastPoint = 5114;
		static MsgTypeRelicCertReward = 5126;
		static MsgTypeRelicCertState = 5125;
		static MsgTypeRelicClearRank = 5127;
		static MsgTypeRelicExploreTimes = 5115;
		static MsgTypeRelicFetchRewards = 5111;
		static MsgTypeRelicFightClearCD = 5105;
		static MsgTypeRelicFightOver = 5107;
		static MsgTypeRelicFightRank = 5128;
		static MsgTypeRelicFightStart = 5106;
		static MsgTypeRelicGiveUp = 5113;
		static MsgTypeRelicGuildDefenders = 5108;
		static MsgTypeRelicGuildExplorers = 5118;
		static MsgTypeRelicGuildRank = 5124;
		static MsgTypeRelicHelpDefend = 5109;
		static MsgTypeRelicHelpReset = 5116;
		static MsgTypeRelicMapDrops = 5117;
		static MsgTypeRelicPointDetail = 5102;
		static MsgTypeRelicPointExplore = 5103;
		static MsgTypeRelicPointList = 5101;
		static MsgTypeRelicPointRecords = 5104;
		static MsgTypeRelicQueryRewards = 5110;
		static MsgTypeRelicRepair = 5112;
		static MsgTypeRelicTransfer = 5119;
		static MsgTypeRelicTransferCancel = 5122;
		static MsgTypeRelicTransferConfirm = 5121;
		static MsgTypeRelicTransferNotice = 5120;
		static MsgTypeRelicUnderAttackNotice = 5123;
		static MsgTypeResonatingClearCD = 5005;
		static MsgTypeResonatingPutOn = 5002;
		static MsgTypeResonatingState = 5001;
		static MsgTypeResonatingTakeOff = 5003;
		static MsgTypeResonatingUnlock = 5004;
		static MsgTypeRitualList = 5601;
		static MsgTypeRoleAllFramesAdd = 214;
		static MsgTypeRoleAllFramesInfo = 212;
		static MsgTypeRoleAllTitlesAdd = 215;
		static MsgTypeRoleAllTitlesInfo = 213;
		static MsgTypeRoleAntiaddiction = 218;
		static MsgTypeRoleCookieGet = 219;
		static MsgTypeRoleCookieSet = 220;
		static MsgTypeRoleCreate = 203;
		static MsgTypeRoleEquipImage = 211;
		static MsgTypeRoleFrame = 209;
		static MsgTypeRoleHead = 208;
		static MsgTypeRoleHeadFramesExpire = 225;
		static MsgTypeRoleHeroImage = 207;
		static MsgTypeRoleImage = 206;
		static MsgTypeRoleLogin = 201;
		static MsgTypeRoleReconnect = 202;
		static MsgTypeRoleRename = 205;
		static MsgTypeRoleRenameNum = 224;
		static MsgTypeRoleSet = 217;
		static MsgTypeRoleSignContent = 216;
		static MsgTypeRoleTitle = 210;
		static MsgTypeRoleTitlesExpire = 226;
		static MsgTypeRoleUpdate = 204;
		static MsgTypeRoleVipBoughtFlag = 221;
		static MsgTypeRoleVipBuyGift = 222;
		static MsgTypeRoleVipMCDailyRewards = 223;
		static MsgTypeRoyalBuy = 8009;
		static MsgTypeRoyalDiv = 8008;
		static MsgTypeRoyalFightOver = 8005;
		static MsgTypeRoyalFightRank = 8007;
		static MsgTypeRoyalFightRecord = 8006;
		static MsgTypeRoyalFightStart = 8004;
		static MsgTypeRoyalInfo = 8001;
		static MsgTypeRoyalMatch = 8003;
		static MsgTypeRoyalSetMap = 8002;
		static MsgTypeRubyCompose = 1502;
		static MsgTypeRubyPutOn = 1503;
		static MsgTypeRubyTakeOff = 1504;
		static MsgTypeRubyUpgrade = 1501;
		static MsgTypeRuinChallengeEnter = 5705;
		static MsgTypeRuinChallengeExit = 5706;
		static MsgTypeRuinChapterChallenge = 5708;
		static MsgTypeRuinChapterReward = 5707;
		static MsgTypeRuinEnter = 5702;
		static MsgTypeRuinExit = 5703;
		static MsgTypeRuinRaids = 5704;
		static MsgTypeRuinStarRankList = 5709;
		static MsgTypeRuinState = 5701;
		static MsgTypeRune2BreakDown = 6402;
		static MsgTypeRune2Compose = 6403;
		static MsgTypeRune2List = 6401;
		static MsgTypeRune2Mix = 6407;
		static MsgTypeRune2On = 6404;
		static MsgTypeRune2Refine = 6408;
		static MsgTypeRune2Update = 6405;
		static MsgTypeRune2Upgrade = 6406;
		static MsgTypeRuneBlessInfo = 4409;
		static MsgTypeRuneCompose = 4403;
		static MsgTypeRuneDisint = 4402;
		static MsgTypeRuneList = 4401;
		static MsgTypeRuneMix = 4407;
		static MsgTypeRuneOn = 4404;
		static MsgTypeRuneUpdate = 4405;
		static MsgTypeRuneUpgrade = 4406;
		static MsgTypeRuneWash = 4408;
		static MsgTypeShareImage = 303;
		static MsgTypeShareInfo = 304;
		static MsgTypeSiegeBlood = 6006;
		static MsgTypeSiegeBuy = 6002;
		static MsgTypeSiegeEnter = 6003;
		static MsgTypeSiegeExit = 6004;
		static MsgTypeSiegeRankList = 6005;
		static MsgTypeSiegeState = 6001;
		static MsgTypeSignBu = 1403;
		static MsgTypeSignInfo = 1401;
		static MsgTypeSignLogin = 1402;
		static MsgTypeSignPay = 1404;
		static MsgTypeSoldierSkinActive = 6302;
		static MsgTypeSoldierSkinActiveTrammel = 6303;
		static MsgTypeSoldierSkinCompose = 6305;
		static MsgTypeSoldierSkinOn = 6304;
		static MsgTypeSoldierSkinState = 6301;
		static MsgTypeSoldierTechDisintStone = 7807;
		static MsgTypeSoldierTechDoResearch = 7805;
		static MsgTypeSoldierTechEquipStone = 7806;
		static MsgTypeSoldierTechLevelUp = 7802;
		static MsgTypeSoldierTechList = 7801;
		static MsgTypeSoldierTechResearchAward = 7804;
		static MsgTypeSoldierTechResearchList = 7803;
		static MsgTypeStore7daysBought = 1313;
		static MsgTypeStore7daysBuy = 1314;
		static MsgTypeStoreBlackMarketBuy = 1303;
		static MsgTypeStoreBlackMarketList = 1301;
		static MsgTypeStoreBlackMarketRefresh = 1302;
		static MsgTypeStoreBuy = 1305;
		static MsgTypeStoreGiftList = 1306;
		static MsgTypeStoreGiftUpdate = 1307;
		static MsgTypeStoreList = 1304;
		static MsgTypeStoreMiscGiftPowerAward = 1312;
		static MsgTypeStorePushBuy = 1309;
		static MsgTypeStorePushEvents = 1310;
		static MsgTypeStorePushList = 1308;
		static MsgTypeStorePushNotice = 1311;
		static MsgTypeStoreQuickBuy = 1316;
		static MsgTypeStoreRefresh = 1315;
		static MsgTypeStoreRuneBuy = 1318;
		static MsgTypeStoreRuneList = 1317;
		static MsgTypeStoreRuneRefresh = 1319;
		static MsgTypeStoreSiegeList = 1323;
		static MsgTypeStoreUniqueEquipList = 1326;
		static MsgTypeStoreUniqueEquipRefresh = 1327;
		static MsgTypeSurvivalEnter = 3303;
		static MsgTypeSurvivalEquipBuy = 3307;
		static MsgTypeSurvivalEquipPocket = 3306;
		static MsgTypeSurvivalExit = 3304;
		static MsgTypeSurvivalHeroOn = 3305;
		static MsgTypeSurvivalMerRecord = 3313;
		static MsgTypeSurvivalMerRewards = 3312;
		static MsgTypeSurvivalMerRewardsPreview = 3311;
		static MsgTypeSurvivalRaid = 3310;
		static MsgTypeSurvivalRefreshEquipPocket = 3308;
		static MsgTypeSurvivalReset = 3302;
		static MsgTypeSurvivalState = 3301;
		static MsgTypeSurvivalSubType = 3309;
		static MsgTypeSystemBroadcast = 107;
		static MsgTypeSystemClose = 105;
		static MsgTypeSystemError = 101;
		static MsgTypeSystemHeartbeat = 102;
		static MsgTypeSystemManlingKfmsg = 112;
		static MsgTypeSystemNewday = 106;
		static MsgTypeSystemNotice = 104;
		static MsgTypeSystemReady = 113;
		static MsgTypeSystemRedPointCancel = 109;
		static MsgTypeSystemRedPointList = 108;
		static MsgTypeSystemServerName = 111;
		static MsgTypeSystemShowOff = 103;
		static MsgTypeSystemSubscribe = 110;
		static MsgTypeTavernExtraTask = 3006;
		static MsgTypeTavernGoodsStat = 3005;
		static MsgTypeTavernInfo = 3001;
		static MsgTypeTavernTaskRefresh = 3004;
		static MsgTypeTavernTaskReward = 3003;
		static MsgTypeTavernTaskStart = 3002;
		static MsgTypeTimeLimitGift = 1322;
		static MsgTypeTowerfundAward = 3106;
		static MsgTypeTowerfundList = 3105;
		static MsgTypeTurntableDraw = 4203;
		static MsgTypeTurntableList = 4201;
		static MsgTypeTurntableRefresh = 4202;
		static MsgTypeTwistEggDraw = 6803;
		static MsgTypeTwistEggState = 6801;
		static MsgTypeTwistEggWish = 6802;
		static MsgTypeUniqueEquipDisint = 8106;
		static MsgTypeUniqueEquipDraw = 8107;
		static MsgTypeUniqueEquipList = 8102;
		static MsgTypeUniqueEquipOff = 8104;
		static MsgTypeUniqueEquipOn = 8103;
		static MsgTypeUniqueEquipStarUp = 8105;
		static MsgTypeUniqueEquipUpdate = 8101;
		static MsgTypeUniqueEquipWishInfo = 8108;
		static MsgTypeUniqueEquipWishSet = 8109;
		static MsgTypeUpdateComment = 4902;
		static MsgTypeVaultFightOver = 5301;
		static MsgTypeVaultFightReady = 5304;
		static MsgTypeVaultFightStart = 5303;
		static MsgTypeVaultPositionInfo = 5302;
		static MsgTypeWorldEnvelopeGet = 7004;
		static MsgTypeWorldEnvelopeId = 7003;
		static MsgTypeWorldEnvelopeList = 7002;
		static MsgTypeWorldEnvelopeRank = 7001;
	};
	
	export const MessageClass: {[MsgType:number]:new () => icmsg.Message};
	
	export class bytes implements Message {

		encode(writer: IWriter) {}
		decode(reader: IReader): bytes {}
	}
	
	//系统--错误
	export class SystemErrorRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		code:  number;
		args:  string[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemErrorRsp {}
	}
	
	//系统--心跳
	export class SystemHeartbeatReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemHeartbeatReq {}
	}
	
	export class SystemHeartbeatRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		serverTime:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemHeartbeatRsp {}
	}
	
	export class DropGoods implements Message {
		dropId:  number;
		goodsTypeId:  number;
		goodsNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DropGoods {}
	}
	
	export class SystemShowOffRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;
		playerName:  string;
		goodsList:  DropGoods[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemShowOffRsp {}
	}
	
	export class SystemNoticeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		content:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemNoticeRsp {}
	}
	
	//系统--关闭
	//客户端收到system_close后，返回该消息到服务端
	export class SystemCloseReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemCloseReq {}
	}
	
	//服务端关闭前发送该消息通知客户端，客户端收到后将发送消息放到缓冲队列中
	export class SystemCloseRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemCloseRsp {}
	}
	
	export class SystemNewdayRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemNewdayRsp {}
	}
	
	export class SystemBroadcastRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		tplId:  number;
		args:  string[] = [];
		items:  GoodsInfo[] = [];
		data:  Buffer[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemBroadcastRsp {}
	}
	
	//系统--红点列表
	export class SystemRedPointListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemRedPointListReq {}
	}
	
	export class SystemRedPointListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemRedPointListRsp {}
	}
	
	//系统--红点删除
	export class SystemRedPointCancelReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		eventId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemRedPointCancelReq {}
	}
	
	export class SystemRedPointCancelRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		eventId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemRedPointCancelRsp {}
	}
	
	//系统--订阅消息
	export class SystemSubscribeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		cancel:  boolean;//是否取消订阅
		topicId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemSubscribeReq {}
	}
	
	export class SystemSubscribeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemSubscribeRsp {}
	}
	
	export class SystemServerName implements Message {
		serverId:  number;
		serverName:  string;
		xServerId:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemServerName {}
	}
	
	//系统--服务器名
	export class SystemServerNameReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		ids:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemServerNameReq {}
	}
	
	export class SystemServerNameRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		names:  SystemServerName[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemServerNameRsp {}
	}
	
	//系统--漫灵客服通知
	export class SystemManlingKfmsgRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		num:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemManlingKfmsgRsp {}
	}
	
	//系统--客户端准备就绪
	export class SystemReadyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mobPushRid:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemReadyReq {}
	}
	
	export class SystemReadyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SystemReadyRsp {}
	}
	
	export class RoleScore implements Message {
		exp:  number;//1: 经验
		gems:  number;//2: 钻石
		gold:  number;//3: 金币
		sms:  number;//5: 银瓜子
		arp:  number;//6: 竞技点
		frp:  number;//7: 友谊点
		skv:  number;//8: 皮肤卷
		gup:  number;//9: 公会币
		heroExp:  number;//10: 英雄经验
		pass:  number;//12: 通行证积分
		flip:  number;//13: 可翻牌次数
		acpe:  number;//14: 矿洞大作战通行证经验
		career:  number;//15: 进阶消耗货币
		tavern:  number;//16: 悬赏接受货币
		survival:  number;//17: 生存训练积分
		vipExp:  number;//18: vip经验
		turntable:  number;//19: 探宝积分
		agate:  number;//20: 玛瑙
		heroScore:  number;//21: 英雄积分
		badgeExp:  number;//22: 徽章积分
		adventureExp:  number;//23: 探险证经验
		champion:  number;//24: 锦标赛积分
		costume:  number;//25: 神装积分
		teamArena:  number;//26: 组队赛积分
		siege:  number;//27: 丧尸围城积分
		relic:  number;//28: 遗迹之证点数
		guardian:  number;//29: 守护者积分
		adventureEntry:  number;//30: 奇境探险遗物积分
		arenaHonor:  number;//31: 荣耀巅峰积分
		arenaHonorWorld:  number;//32: 荣耀巅峰世界赛积分
		expeditionPoint:  number;//33: 远征积分
		ultimatePoint:  number;//34: 终极积分
		goldEquipPoint:  number;//35: 金色专属装备积分
		purpleEquipPoint:  number;//36: 紫色专属装备积分

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleScore {}
	}
	
	export class RoleInfo implements Message {
		id:  number;
		account:  string;
		name:  string;
		level:  number;
		power:  number;//战力
		maxPower:  number;//历史最高战力
		maxHeroStar:  number;//历史最高英雄星级
		payed:  boolean;
		head:  number;//头像
		headFrame:  number;//头像框
		title:  number;//称号
		createTime:  number;//创角时间用于前端接入某些SDK
		guildId:  number;//公会id
		guildTitle:  number;//公会称号
		setting:  number;
		signContent:  string;//个性签名内容
		score:  RoleScore;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleInfo {}
	}
	
	export class RoleAttr implements Message {
		index:  number;//按顺序：[1:经验,2:钻石,3:金币...,101:等级,102:战力...]
		value:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleAttr {}
	}
	
	//角色--登录
	export class RoleLoginReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		account:  string;
		serverId:  number;
		channelId:  number;//渠道Id
		channelCode:  string;//渠道相关登录参数
		token:  string;//断线重连Token
		brand:  string;//手机品牌
		model:  string;//手机机型
		sessionId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleLoginReq {}
	}
	
	export class RoleLoginRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		errCode:  number;
		sessionId:  number;
		token:  string;
		serverOpenTime:  number;
		worldLevel:  number;
		crossId:  string;
		crossOpenTime:  number;
		serverMegTime:  number;// 合服时间
		serverMegCount:  number;// 合服次数
		serverNum:  number;// 跨服服务器数量
		role:  RoleInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleLoginRsp {}
	}
	
	//断线重连
	export class RoleReconnectRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		succ:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleReconnectRsp {}
	}
	
	//角色--创建角色
	export class RoleCreateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		name:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleCreateReq {}
	}
	
	//角色--更新信息
	export class RoleUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  RoleAttr[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleUpdateRsp {}
	}
	
	//角色--修改名称
	export class RoleRenameReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		name:  string;
		isFemale:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleRenameReq {}
	}
	
	export class RoleRenameRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		errCode:  number;
		name:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleRenameRsp {}
	}
	
	//玩家名片
	export class RoleBrief implements Message {
		id:  number;
		head:  number;
		name:  string;
		level:  number;
		power:  number;
		logoutTime:  number;
		headFrame:  number;//头像框
		title:  number;//称号
		vipExp:  number;
		guildId:  number;
		isFemale:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleBrief {}
		
	get VipFlag(): number {
		return 0;
	}

	get VipLv(): number {
		return 0;
	}
	
	}
	
	export class HeroImage implements Message {
		typeId:  number;
		level:  number;
		careerId:  number;
		careerLv:  number;
		soldierId:  number;
		star:  number;
		power:  number;
		slots:  HeroEquipSlot[] = [];
		runes:  number[] = [];
		skills:  number[] = [];
		hpW:  number;
		hpG:  number;
		atkW:  number;
		atkG:  number;
		defW:  number;
		defG:  number;
		hitW:  number;
		hitG:  number;
		critW:  number;
		critG:  number;
		dodgeW:  number;
		dodgeG:  number;
		critV:  number;//暴击率
		critVRes:  number;//暴击率抗性
		atkDmg:  number;//普攻增伤
		atkRes:  number;//普攻免伤
		dmgPunc:  number;//穿刺伤害
		puncRes:  number;//穿刺抗性
		dmgRadi:  number;//辐射伤害
		radiRes:  number;//辐射抗性
		dmgFire:  number;//火能伤害
		fireRes:  number;//火能抗性
		dmgCold:  number;//冷冻伤害
		coldRes:  number;//冷冻抗性
		dmgElec:  number;//电能伤害
		elecRes:  number;//电能抗性
		costumes:  CostumeInfo[] = [];
		guardian:  Guardian;
		mysticSkills:  number[] = [];//神秘者技能-等级
		uniqueEquip:  UniqueEquip;//专属装备

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroImage {}
	}
	
	export class HeroBrief implements Message {
		heroId:  number;
		typeId:  number;
		level:  number;
		star:  number;
		power:  number;
		careerId:  number;
		careerLv:  number;
		soldierId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroBrief {}
		get color(): number {}
	}
	
	export class HonorData implements Message {
		key:  number;
		value:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): HonorData {}
	}
	
	export class HeroBriefExt implements Message {
		heroBrief:  HeroBrief;
		guardian:  Guardian;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroBriefExt {}
	}
	
	export class HeadFrame implements Message {
		id:  number;// 头像框id
		endTime:  number;// 失效时间

		encode(writer: IWriter) {}
		decode(reader: IReader): HeadFrame {}
	}
	
	export class Title implements Message {
		id:  number;// 称号id
		endTime:  number;// 失效时间

		encode(writer: IWriter) {}
		decode(reader: IReader): Title {}
	}
	
	//角色--获取名片
	export class RoleImageReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;// 0-查询当前信息，1-查询锦标赛信息,2-竞技场防守阵容,3-竞技场机器人,4-皇家竞技场机器人(名字随机生成，需要替换)
		index:  number;// 查询锦标赛时i，需上传查询的组下标
		playerId:  number;
		arrayType:  number;// 防守阵容类型

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleImageReq {}
	}
	
	export class RoleHonor implements Message {
		trial:  number;
		ruin:  number;
		arenaRank:  number;
		vault:  number;
		champion:  number;
		adventure:  number;
		ordeal:  number;
		teamArena:  number;
		peak:  number;
		foothold:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleHonor {}
	}
	
	export class RoleImageRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		brief:  RoleBrief;
		elite:  number;//精英关卡通关数
		mainline:  number;//主线最高关卡Id
		heroes:  HeroBriefExt[] = [];
		arenaScore:  number;//竞技场分数
		signContent:  string;//个性签名内容
		guildName:  string;//公会名
		isGuildMaster:  boolean;//是否会长
		type:  number;
		honor:  RoleHonor;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleImageRsp {}
		get mstageId(): number {
		return this.brief.mainline;
	}
	}
	
	//角色--名片英雄信息
	export class RoleHeroImageReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;// 0-查询当前信息，1-查询锦标赛信息
		index:  number;// 查询锦标赛时i，需上传查询的组下标
		playerId:  number;
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleHeroImageReq {}
	}
	
	export class RoleHeroImageRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		hero:  HeroImage;
		type:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleHeroImageRsp {}
	}
	
	//角色--设置头像
	export class RoleHeadReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleHeadReq {}
	}
	
	export class RoleHeadRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleHeadRsp {}
	}
	
	//角色--设置头像框
	export class RoleFrameReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleFrameReq {}
	}
	
	export class RoleFrameRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleFrameRsp {}
	}
	
	//角色--设置称号
	export class RoleTitleReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleTitleReq {}
	}
	
	export class RoleTitleRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleTitleRsp {}
	}
	
	//角色--名片装备信息
	export class RoleEquipImageReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;
		heroIdx:  number;
		equipType:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleEquipImageReq {}
	}
	
	export class RoleEquipImageRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		equip:  EquipInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleEquipImageRsp {}
	}
	
	//角色--拥有的头像框
	export class RoleAllFramesInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleAllFramesInfoReq {}
	}
	
	export class RoleAllFramesInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		headFrames:  HeadFrame[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleAllFramesInfoRsp {}
	}
	
	//角色--拥有的称号
	export class RoleAllTitlesInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleAllTitlesInfoReq {}
	}
	
	export class RoleAllTitlesInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		titles:  Title[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleAllTitlesInfoRsp {}
	}
	
	//增加获得的头像框，会刷新所有英雄的属性，需要前端主动更新所有英雄战力信息
	export class RoleAllFramesAddRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  HeadFrame;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleAllFramesAddRsp {}
	}
	
	//增加获得的称号，会刷新所有英雄的属性，需要前端主动更新所有英雄战力信息
	export class RoleAllTitlesAddRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		add:  Title;
		del:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleAllTitlesAddRsp {}
	}
	
	//角色--个性签名
	export class RoleSignContentReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		content:  string;//签名内容

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleSignContentReq {}
	}
	
	export class RoleSignContentRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleSignContentRsp {}
	}
	
	//角色--个性设置
	export class RoleSetReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		setting:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleSetReq {}
	}
	
	export class RoleSetRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		setting:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleSetRsp {}
	}
	
	//角色--防沉迷
	export class RoleAntiaddictionReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		age:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleAntiaddictionReq {}
	}
	
	export class RoleAntiaddictionRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		age:  number;
		drawNum:  number[] = [];//今日已抽卡次数，排列方式为:[普通召唤（单抽），普通召唤（10抽），高级召唤（单抽），高级召唤（10抽），装备召唤（单抽），装备召唤（10抽）]

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleAntiaddictionRsp {}
	}
	
	//角色--请求缓存
	export class RoleCookieGetReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleCookieGetReq {}
	}
	
	export class RoleCookieGetRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		cookie:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleCookieGetRsp {}
	}
	
	//角色--设置缓存
	export class RoleCookieSetReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		cookie:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleCookieSetReq {}
	}
	
	export class RoleCookieSetRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleCookieSetRsp {}
	}
	
	//角色--vip已购买特权礼包
	export class RoleVipBoughtFlagReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleVipBoughtFlagReq {}
	}
	
	export class RoleVipBoughtFlagRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		boughtFlag:  number;//按位表示已购买哪些vip礼包，从0位开始
		mCRewardTime:  number;//上次领取月卡每日奖励的时间

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleVipBoughtFlagRsp {}
	}
	
	//角色--vip购买特权礼包
	export class RoleVipBuyGiftReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		vipLv:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleVipBuyGiftReq {}
	}
	
	export class RoleVipBuyGiftRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		boughtFlag:  number;//按位表示已购买哪些vip礼包，从0位开始
		goodsList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleVipBuyGiftRsp {}
	}
	
	//角色--vip领取月卡每日奖励
	export class RoleVipMCDailyRewardsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleVipMCDailyRewardsReq {}
	}
	
	export class RoleVipMCDailyRewardsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		goodsList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleVipMCDailyRewardsRsp {}
	}
	
	//角色--改名次数
	export class RoleRenameNumReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleRenameNumReq {}
	}
	
	export class RoleRenameNumRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		num:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleRenameNumRsp {}
	}
	
	//头像框过期，会刷新所有英雄的属性，需要前端主动更新所有英雄战力信息
	export class RoleHeadFramesExpireRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleHeadFramesExpireRsp {}
	}
	
	//称号过期，会刷新所有英雄的属性，需要前端主动更新所有英雄战力信息
	export class RoleTitlesExpireRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RoleTitlesExpireRsp {}
	}
	
	//聊天--发送信息
	export class ChatSendReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		channel:  number;//1:系统 2:世界 3:公会 4:私聊 5:投诉 6:据点战联盟 7:跨服组聊天
		targetId:  number;
		content:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): ChatSendReq {}
	}
	
	export class ChatSendRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		channel:  number;//1:系统 2:世界 3:公会 4:私聊 5:投诉 6:据点战联盟 7:跨服组聊天
		playerId:  number;
		playerName:  string;
		playerLv:  number;
		playerHead:  number;
		playerFrame:  number;
		playerTitle:  number;
		playerVipExp:  number;
		guildName:  string;
		chatTime:  number;
		content:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): ChatSendRsp {}
		
	get PlayerVipFlag(): number {
		return 0;
	}

	get PlayerVipLv(): number {
		return 0;
	}
	}
	
	//聊天--最近记录
	export class ChatHistoryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ChatHistoryReq {}
	}
	
	//分享--分享信息
	export class ShareImageReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;//唯一Id

		encode(writer: IWriter) {}
		decode(reader: IReader): ShareImageReq {}
	}
	
	export class ShareImageRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		shareId:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): ShareImageRsp {}
	}
	
	//分享--信息查看
	export class ShareInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		shareId:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): ShareInfoReq {}
	}
	
	export class ShareInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  HeroImage;

		encode(writer: IWriter) {}
		decode(reader: IReader): ShareInfoRsp {}
	}
	
	export class MailAttach implements Message {
		typeId:  number;
		num:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MailAttach {}
	}
	
	export class MailInfo implements Message {
		id:  number;
		fromGm:  boolean;
		title:  string;
		startTime:  number;
		endTime:  number;
		isRead:  boolean;
		attachs:  MailAttach[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MailInfo {}
	}
	
	//邮件--邮件列表
	export class MailListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mailTime:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MailListReq {}
	}
	
	export class MailListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  MailInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MailListRsp {}
	}
	
	//邮件--阅读邮件
	export class MailReadReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MailReadReq {}
	}
	
	export class MailReadRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		content:  string;
		isRead:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): MailReadRsp {}
	}
	
	//邮件--提取附件
	export class MailDrawReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		ids:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MailDrawReq {}
	}
	
	export class MailDrawRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		ids:  number[] = [];
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MailDrawRsp {}
	}
	
	//邮件--删除邮件
	export class MailDeleteReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		ids:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MailDeleteReq {}
	}
	
	export class MailDeleteRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		ids:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MailDeleteRsp {}
	}
	
	export class MailUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  MailInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MailUpdateRsp {}
	}
	
	export class MailNoticeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		receivers:  string;
		levels:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): MailNoticeRsp {}
	}
	
	export class Friend implements Message {
		brief:  RoleBrief;
		elite:  number;//精英关卡通关数
		mainline:  number;//主线最高关卡Id
		friendship:  number;//0,0,0,0,0,flagOfReceived,flagOfTaken,flagOfGiven

		encode(writer: IWriter) {}
		decode(reader: IReader): Friend {}
	}
	
	//好友--好友列表
	export class FriendListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendListReq {}
	}
	
	export class FriendListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		friends:  Friend[] = [];
		invites:  RoleBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendListRsp {}
	}
	
	//好友--黑名单列表
	export class FriendBlacklistReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendBlacklistReq {}
	}
	
	export class FriendBlacklistRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  RoleBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendBlacklistRsp {}
	}
	
	//好友--加入黑名单
	export class FriendBlacklistInReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendBlacklistInReq {}
	}
	
	export class FriendBlacklistInRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		brief:  RoleBrief;

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendBlacklistInRsp {}
	}
	
	//好友--移出黑名单
	export class FriendBlacklistOutReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendBlacklistOutReq {}
	}
	
	export class FriendBlacklistOutRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendBlacklistOutRsp {}
	}
	
	//好友--好友申请
	export class FriendRequestReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendRequestReq {}
	}
	
	export class FriendRequestRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendRequestRsp {}
	}
	
	export class FriendInviteRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		brief:  RoleBrief;

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendInviteRsp {}
	}
	
	//好友--拒签申请
	export class FriendRefuseReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendRefuseReq {}
	}
	
	export class FriendRefuseRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendRefuseRsp {}
	}
	
	//好友--同意申请
	export class FriendBecomeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendBecomeReq {}
	}
	
	export class FriendBecomeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		friend:  RoleBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendBecomeRsp {}
	}
	
	//好友--删除好友
	export class FriendDeleteReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendDeleteReq {}
	}
	
	export class FriendDeleteRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendDeleteRsp {}
	}
	
	//好友--推荐列表
	export class FriendRecommendReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendRecommendReq {}
	}
	
	export class FriendRecommendRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  RoleBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendRecommendRsp {}
	}
	
	//好友--搜索好友
	export class FriendSearchReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		name:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendSearchReq {}
	}
	
	export class FriendSearchRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  RoleBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendSearchRsp {}
	}
	
	//好友--赠送友谊
	export class FriendGiveReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendGiveReq {}
	}
	
	export class FriendGiveRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendGiveRsp {}
	}
	
	//好友--领取友谊
	export class FriendTakeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendTakeReq {}
	}
	
	export class FriendTakeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;
		addPoints:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendTakeRsp {}
	}
	
	//收到友谊
	export class FriendReceiveRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendReceiveRsp {}
	}
	
	//好友--改名通知
	export class FriendRenameNoticeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		oldName:  string;//旧的名字
		newName:  string;//新的名字

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendRenameNoticeReq {}
	}
	
	export class FriendRenameNoticeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		noticeType:  number;//1是自己，2是好友
		oldName:  string;//旧的名字
		newName:  string;//新的名字

		encode(writer: IWriter) {}
		decode(reader: IReader): FriendRenameNoticeRsp {}
	}
	
	export class GoodsInfo implements Message {
		typeId:  number;
		num:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GoodsInfo {}
	}
	
	export class ItemInfo implements Message {
		itemId:  number;
		itemNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ItemInfo {}
	}
	
	//道具--道具列表
	export class ItemListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ItemListReq {}
	}
	
	export class ItemListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  ItemInfo[] = [];
		used:  ItemInfo[] = [];//有次数限制的道具的今日已使用次数

		encode(writer: IWriter) {}
		decode(reader: IReader): ItemListRsp {}
	}
	
	export class ItemUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  ItemInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ItemUpdateRsp {}
	}
	
	//道具--道具分解
	export class ItemDisintReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;//使用类型是4的时候，填写自选礼包的位置
		items:  GoodsInfo[] = [];//道具（道具typeId、数量）

		encode(writer: IWriter) {}
		decode(reader: IReader): ItemDisintReq {}
	}
	
	export class ItemDisintRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];
		used:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ItemDisintRsp {}
	}
	
	//道具--道具合成
	export class ItemComposeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stuffId:  number;//合成目标道具的id
		num:  number;//合成目标道具的数量

		encode(writer: IWriter) {}
		decode(reader: IReader): ItemComposeReq {}
	}
	
	export class ItemComposeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ItemComposeRsp {}
	}
	
	export class EquipInfo implements Message {
		equipId:  number;
		equipNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): EquipInfo {}
	}
	
	//装备--列表
	export class EquipListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): EquipListReq {}
	}
	
	export class EquipListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  EquipInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): EquipListRsp {}
	}
	
	export class EquipUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  EquipInfo[] = [];
		deleteList:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): EquipUpdateRsp {}
	}
	
	//装备--分解（出售)
	export class EquipDisintReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		equipList:  GoodsInfo[] = [];//装备的类型id，数量

		encode(writer: IWriter) {}
		decode(reader: IReader): EquipDisintReq {}
	}
	
	export class EquipDisintRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): EquipDisintRsp {}
	}
	
	//装备--合成
	export class EquipComposeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		materialTypeId:  number;//材料装备类型ID
		composeNumber:  number;//合成装备数量

		encode(writer: IWriter) {}
		decode(reader: IReader): EquipComposeReq {}
	}
	
	export class EquipComposeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		goodsList:  GoodsInfo[] = [];//新装备

		encode(writer: IWriter) {}
		decode(reader: IReader): EquipComposeRsp {}
	}
	
	//装备--一键合成
	export class EquipComposeRecursiveReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		partId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): EquipComposeRecursiveReq {}
	}
	
	export class EquipComposeRecursiveRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		goodsList:  GoodsInfo[] = [];//新装备

		encode(writer: IWriter) {}
		decode(reader: IReader): EquipComposeRecursiveRsp {}
	}
	
	export class HeroEquipSlot implements Message {
		equipId:  number;
		rubies:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroEquipSlot {}
	}
	
	export class HeroInfo implements Message {
		heroId:  number;
		typeId:  number;
		careerId:  number;
		soldierId:  number;
		star:  number;
		level:  number;
		slots:  HeroEquipSlot[] = [];//[0:武器,1:头盔,2:铠甲,3:配饰]
		runes:  number[] = [];// 0-1号位，1-2号位
		costumeIds:  CostumeInfo[] = [];// 0-1号位，1-2号位，2-3号位，3-4号位
		power:  number;
		careerLv:  number;
		status:  number;//_,_,_,_,_,_,今日已参加据点战,提示开关（0打开，1关闭）
		soldierSkin:  number;// 军团精甲
		guardian:  Guardian;
		mysticLink:  number;//神秘者-连接或者被连接的英雄
		mysticSkills:  number[] = [];//神秘者技能-等级
		uniqueEquip:  UniqueEquip;//专属装备

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroInfo {}
		get needTips(): boolean {}

		set sthFighted(state: boolean) {}
		get sthFighted(): boolean {}

		get switchFlag(): number {}

		get exp(): number {}
		set exp(n: number) {}
		
		get color(): number {}
	}
	
	//转职升阶使用
	export class HeroDetail implements Message {
		attr:  HeroAttr;
		skills:  number[] = [];
		power:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroDetail {}
	}
	
	export class HeroAttr implements Message {
		hpW:  number;//生命
		atkW:  number;//攻击
		defW:  number;//防御
		hitW:  number;//命中
		dodgeW:  number;//闪避
		critW:  number;//暴击
		hurtW:  number;//爆伤
		hpG:  number;//生命
		atkG:  number;//攻击
		defG:  number;//防御
		hitG:  number;//命中
		dodgeG:  number;//闪避
		critG:  number;//暴击
		hurtG:  number;//爆伤
		atkOrder:  number;//出手顺序（卡牌属性）
		defPene:  number;//防御穿透
		critRes:  number;//暴击抗性
		hurtRes:  number;//爆伤抗性
		puncRes:  number;//穿刺抗性
		radiRes:  number;//辐射抗性
		elecRes:  number;//电能抗性
		fireRes:  number;//火能抗性
		coldRes:  number;//冷冻抗性
		critV:  number;//暴击率
		critVRes:  number;//暴击率抗性
		atkRes:  number;//普攻免伤
		dmgPunc:  number;//穿刺伤害
		dmgRadi:  number;//辐射伤害
		dmgElec:  number;//电能伤害
		dmgFire:  number;//火能伤害
		dmgCold:  number;//冷冻伤害
		atkDmg:  number;//普攻增伤
		addSoldierHp:  number;//士兵加成生命
		addSoldierAtk:  number;//士兵加成攻击
		addSoldierDef:  number;//士兵加成防御
		atkSpeedR:  number;
		dmgRes:  number;
		healthy:  number;
		powerRes:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAttr {}
	}
	
	export class HeroSoldier implements Message {
		soldierId:  number;
		hpW:  number;//生命
		atkW:  number;//攻击
		defW:  number;//防御
		hpG:  number;//生命
		atkG:  number;//攻击
		defG:  number;//防御

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroSoldier {}
	}
	
	//英雄--列表
	export class HeroListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroListReq {}
	}
	
	export class HeroListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  HeroInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroListRsp {}
	}
	
	export class HeroUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		updateList:  HeroInfo[] = [];
		deleteList:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroUpdateRsp {}
	}
	
	//只是更新英雄战斗力，不飘字
	export class HeroPowerUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		power:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroPowerUpdateRsp {}
	}
	
	//更新英雄属性和战斗力
	export class HeroAttrRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		power:  number;
		attr:  HeroAttr;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAttrRsp {}
	}
	
	//英雄--详细信息
	export class HeroDetailReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroDetailReq {}
	}
	
	export class HeroDetailRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		detail:  HeroDetail;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroDetailRsp {}
	}
	
	//英雄--穿戴装备
	export class HeroEquipOnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		equipIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroEquipOnReq {}
	}
	
	//英雄--脱下装备
	export class HeroEquipOffReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		equipParts:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroEquipOffReq {}
	}
	
	//英雄--装备更新
	export class HeroEquipUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		equips:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroEquipUpdateRsp {}
	}
	
	//英雄--升级
	export class HeroLevelupReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		addLv:  number;//提示多少等级

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroLevelupReq {}
	}
	
	export class HeroLevelupRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		heroLv:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroLevelupRsp {}
	}
	
	//英雄--升星
	export class HeroStarupReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		materials1:  number[] = [];
		materials2:  number[] = [];
		materials3:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroStarupReq {}
	}
	
	export class HeroStarupRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		heroStar:  number;
		recoups:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroStarupRsp {}
	}
	
	//英雄--升职
	export class HeroCareerUpReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroCareerUpReq {}
	}
	
	export class HeroCareerUpRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		careerId:  number;
		careerLv:  number;
		heroLv:  number;
		detail:  HeroDetail;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroCareerUpRsp {}
	}
	
	//英雄--转职
	export class HeroCareerTransReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		careerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroCareerTransReq {}
	}
	
	export class HeroCareerTransRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		careerId:  number;
		soldierId:  number;
		detail:  HeroDetail;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroCareerTransRsp {}
	}
	
	//英雄--士兵列表
	export class HeroSoldierListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroSoldierListReq {}
	}
	
	export class HeroSoldierListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		soldierId:  number;
		list:  HeroSoldier[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroSoldierListRsp {}
	}
	
	//英雄--切换士兵
	export class HeroSoldierChangeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		soldierId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroSoldierChangeReq {}
	}
	
	export class HeroSoldierChangeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		soldierId:  number;
		power:  number;
		showPower:  boolean;//是否显示战斗力变化，转职切换士兵不显示和手动切换士兵显示

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroSoldierChangeRsp {}
	}
	
	//英雄--查看士兵
	export class HeroSoldierInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		soldierId:  number;//查看士兵id

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroSoldierInfoReq {}
	}
	
	export class HeroSoldierInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		soldierId:  number;//查看士兵id
		soldier:  HeroSoldier;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroSoldierInfoRsp {}
	}
	
	//士兵激活（如兵营升级后）
	export class HeroSoldierActiveRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroIds:  number[] = [];//携带该士兵的英雄ids
		soldierId:  number;//激活的士兵id

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroSoldierActiveRsp {}
	}
	
	//英雄--英雄锁定
	export class HeroStatusLockReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		switchFlag:  number;//1是锁定，0是解除锁定

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroStatusLockReq {}
	}
	
	export class HeroStatusLockRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		switchFlag:  number;//1是锁定，0是解除锁定

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroStatusLockRsp {}
	}
	
	//英雄--重置预览
	export class HeroResetPreviewReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroResetPreviewReq {}
	}
	
	export class HeroResetPreviewRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number[] = [];
		goods:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroResetPreviewRsp {}
	}
	
	//英雄--重置确认
	export class HeroResetConfirmReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroResetConfirmReq {}
	}
	
	export class HeroResetConfirmRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroes:  HeroInfo[] = [];
		goods:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroResetConfirmRsp {}
	}
	
	//英雄--分解
	export class HeroDecomposeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroDecomposeReq {}
	}
	
	export class HeroDecomposeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroIds:  number[] = [];
		goodsList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroDecomposeRsp {}
	}
	
	//英雄--信息
	export class HeroInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroInfoReq {}
		get needTips(): boolean {}

		set sthFighted(state: boolean) {}
		get sthFighted(): boolean {}

		get switchFlag(): number {}

		get exp(): number {}
		set exp(n: number) {}
		
		get color(): number {}
	}
	
	export class HeroInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  HeroInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroInfoRsp {}
		get needTips(): boolean {}

		set sthFighted(state: boolean) {}
		get sthFighted(): boolean {}

		get switchFlag(): number {}

		get exp(): number {}
		set exp(n: number) {}
		
		get color(): number {}
	}
	
	//英雄--置换
	export class HeroDisplaceReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;//材料A英雄唯一Id >= 7
		targetHeroIds:  number[] = [];//材料B英雄唯一Id

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroDisplaceReq {}
	}
	
	export class HeroDisplaceRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroDisplaceRsp {}
	}
	
	//英雄--历史最高英雄星级，主动推送
	export class HeroMaxStarUpRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		maxHeroStar:  number;
		guardianCopyOpen:  boolean;// 守护者副本开启
		guardianTowerOpen:  boolean;// 守护者秘境开启

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroMaxStarUpRsp {}
	}
	
	export class HeroAwakeState implements Message {
		heroId:  number;
		heroStar:  number;
		awakeLv:  number;// 已经觉醒的等级
		number:  number;// 任务数量
		clear:  boolean;// 觉醒副本战斗结果

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakeState {}
	}
	
	//英雄觉醒--状态
	export class HeroAwakeStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakeStateReq {}
	}
	
	//英雄觉醒--状态，任务更新
	export class HeroAwakeStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heros:  HeroAwakeState[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakeStateRsp {}
	}
	
	//英雄觉醒--任务更新，主动推送
	export class HeroAwakeMissonUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		hero:  HeroAwakeState;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakeMissonUpdateRsp {}
	}
	
	//英雄觉醒--副本进入
	export class HeroAwakeEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakeEnterReq {}
	}
	
	export class HeroAwakeEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakeEnterRsp {}
	}
	
	//英雄觉醒--副本退出
	export class HeroAwakeExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		stageId:  number;
		clear:  boolean;// 是否通关

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakeExitReq {}
	}
	
	export class HeroAwakeExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		stageId:  number;
		clear:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakeExitRsp {}
	}
	
	//英雄觉醒--觉醒预览
	export class HeroAwakePreviewReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakePreviewReq {}
	}
	
	export class HeroAwakePreviewRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		hero:  HeroInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakePreviewRsp {}
	}
	
	//英雄觉醒--觉醒
	export class HeroAwakeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		materials1:  number[] = [];
		materials2:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakeReq {}
	}
	
	export class HeroAwakeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		heroStar:  number;
		awakeLv:  number;// 新的进度

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakeRsp {}
	}
	
	//英雄回退--回退
	export class HeroFallbackReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		preview:  boolean;// 是否预览

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroFallbackReq {}
	}
	
	export class HeroFallbackRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		preview:  boolean;// 是否预览
		info:  HeroInfo;// 信息 非预览时返回
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroFallbackRsp {}
	}
	
	//英雄觉醒--图鉴
	export class HeroAwakeBooksReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakeBooksReq {}
	}
	
	export class HeroAwakeBooksRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		ids:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakeBooksRsp {}
	}
	
	//英雄重生
	export class HeroRebirthReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		preview:  boolean;// 是否预览

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroRebirthReq {}
	}
	
	export class HeroRebirthRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		preview:  boolean;// 是否预览
		info:  HeroInfo;// 信息 非预览时返回
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroRebirthRsp {}
	}
	
	export class HeroMysticAttr implements Message {
		power:  number;
		star:  number;
		level:  number;
		hp:  number;//生命
		atk:  number;//攻击
		def:  number;//防御

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroMysticAttr {}
	}
	
	// 神秘者-连接
	export class HeroMysticLinkReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mystic:  number;// 神秘者id
		heroId:  number;// 英雄id

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroMysticLinkReq {}
	}
	
	export class HeroMysticLinkRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mystic:  number;// 神秘者id
		heroId:  number;// 英雄id
		bf:  HeroMysticAttr;// 前
		af:  HeroMysticAttr;// 后

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroMysticLinkRsp {}
	}
	
	// 神秘者-解除连接
	export class HeroMysticUnLinkReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mystic:  number;// 神秘者id

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroMysticUnLinkReq {}
	}
	
	export class HeroMysticUnLinkRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mystic:  number;// 神秘者id
		heroId:  number;// 英雄id
		bf:  HeroMysticAttr;// 前
		af:  HeroMysticAttr;// 后
		info:  HeroInfo;// 神秘者
		items:  GoodsInfo[] = [];// 卸下的物品

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroMysticUnLinkRsp {}
	}
	
	// 神秘者-技能升级
	export class HeroMysticSkillUpReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mystic:  number;// 神秘者id
		heroId:  number;// 本体,0-消耗材料
		skillId:  number;// 0-随机，1，2，3，4-指定技能

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroMysticSkillUpReq {}
	}
	
	// 神秘者-技能升级
	export class HeroMysticSkillUpRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mystic:  number;// 神秘者id
		mysticSkills:  number[] = [];//神秘者技能-等级

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroMysticSkillUpRsp {}
	}
	
	export class BarrackInfo implements Message {
		id:  number;
		level:  number;
		exp:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BarrackInfo {}
	}
	
	export class BarrackTech implements Message {
		id:  number;
		level:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BarrackTech {}
	}
	
	//兵营--列表（废弃）
	export class BarrackListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): BarrackListReq {}
	}
	
	export class BarrackListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		infos:  BarrackInfo[] = [];
		techs:  BarrackTech[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): BarrackListRsp {}
	}
	
	//兵营--科技列表（废弃）
	export class BarrackTechUpReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BarrackTechUpReq {}
	}
	
	export class BarrackTechUpRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  BarrackInfo;
		tech:  BarrackTech;
		oldPower:  number;
		newPower:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BarrackTechUpRsp {}
	}
	
	export class BarrackUnlockRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BarrackUnlockRsp {}
	}
	
	//兵营--士兵列表（废弃）
	export class BarrackSoldiersReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): BarrackSoldiersReq {}
	}
	
	export class BarrackSoldiersRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): BarrackSoldiersRsp {}
	}
	
	//兵营--等级
	export class BarrackLevelsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): BarrackLevelsReq {}
	}
	
	export class BarrackLevelsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		levels:  number[] = [];//3个兵营的等级

		encode(writer: IWriter) {}
		decode(reader: IReader): BarrackLevelsRsp {}
	}
	
	//兵营--升级
	export class BarrackLevelupReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;//兵营类型：1，3，4

		encode(writer: IWriter) {}
		decode(reader: IReader): BarrackLevelupReq {}
	}
	
	export class BarrackLevelupRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;//兵营类型：1，3，4
		level:  number;//兵营的等级
		diff:  number;//新旧战力差值

		encode(writer: IWriter) {}
		decode(reader: IReader): BarrackLevelupRsp {}
	}
	
	export class FightSkill implements Message {
		skillId:  number;
		skillLv:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FightSkill {}
	}
	
	export class FightHero implements Message {
		heroId:  number;
		heroType:  number;
		heroLv:  number;
		heroStar:  number;
		heroPower:  number;
		careerId:  number;
		careerLv:  number;
		attr:  FightAttr;
		soldier:  FightSoldier;
		skills:  FightSkill[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FightHero {}
	}
	
	export class FightGeneral implements Message {
		weaponId:  number;
		level:  number;
		atk:  number;//攻击
		energyCharge:  number;//充能
		skills:  FightSkill[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FightGeneral {}
		get hit(): number {}
		get crit(): number {}
		get hurt(): number {}
		get def_pene(): number {}
		get atk_speed_w(): number {}
		get atk_speed_r(): number {}
	}
	
	export class FightAttr implements Message {
		empty:  number;//无用
		hp:  number;//生命
		atk:  number;//攻击
		def:  number;//防御
		hit:  number;//命中
		dodge:  number;//闪避
		crit:  number;//暴击
		hurt:  number;//爆伤
		atkSpeed:  number;//攻速
		defPeneFix:  number;//防御穿透
		critRes:  number;//暴击抗性
		hurtRes:  number;//爆伤抗性
		puncRes:  number;//穿刺抗性
		radiRes:  number;//辐射抗性
		elecRes:  number;//电能抗性
		fireRes:  number;//火能抗性
		coldRes:  number;//冷冻抗性
		critV:  number;//暴击率
		critVRes:  number;//暴击率抗性
		atkRes:  number;//普攻免伤
		dmgPunc:  number;//穿刺伤害
		dmgRadi:  number;//辐射伤害
		dmgElec:  number;//电能伤害
		dmgFire:  number;//火能伤害
		dmgCold:  number;//冷冻伤害
		atkDmg:  number;//普攻增伤
		atkSpeedR:  number;//攻速
		atkOrder:  number;//出手速度
		dmgAdd:  number;//伤害加成
		dmgRes:  number;//伤害减免
		powerRes:  number;//技能免伤
		healthy:  number;//回复效果
		powerDmg:  number;//增加技能伤害

		encode(writer: IWriter) {}
		decode(reader: IReader): FightAttr {}
		
	get MaxHp(): number {
		return this.Hp;
	}
	}
	
	export class FightSoldier implements Message {
		soldierId:  number;
		hp:  number;//生命
		atk:  number;//攻击
		def:  number;//防御
		hit:  number;//命中
		dodge:  number;//闪避
		atkSpeed:  number;//攻速
		dmgAdd:  number;//增伤
		dmgRes:  number;//减伤
		skills:  FightSkill[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FightSoldier {}
		
	get level(): number {
		return 0;
	}

	get crit(): number {
		return 0;
	}

	get critV(): number {
		return 0;
	}

	get critRes(): number {
		return 0;
	}

	get atkSpeedR(): number {
		return 0;
	}
	}
	
	//战斗--英雄信息
	export class FightQueryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;// 大于0表示查玩家的防守阵营，不需要传IsTower，HeroIds
		isTower:  boolean;// 是否是塔防战斗，否则是卡牌战斗
		heroIds:  number[] = [];
		general:  boolean;
		arrayType:  number;// 防守阵容类型

		encode(writer: IWriter) {}
		decode(reader: IReader): FightQueryReq {}
	}
	
	export class FightQueryRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;
		heroList:  FightHero[] = [];
		general:  FightGeneral;

		encode(writer: IWriter) {}
		decode(reader: IReader): FightQueryRsp {}
	}
	
	//战斗--多个玩家的战斗信息
	export class FightDefendReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerIds:  number[] = [];// 玩家id
		arrayType:  number;// 防守阵容类型

		encode(writer: IWriter) {}
		decode(reader: IReader): FightDefendReq {}
	}
	
	export class DefendFight implements Message {
		playerId:  number;
		heroList:  FightHero[] = [];
		general:  FightGeneral;

		encode(writer: IWriter) {}
		decode(reader: IReader): DefendFight {}
	}
	
	export class FightDefendRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		player:  DefendFight[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FightDefendRsp {}
	}
	
	//战斗--回放
	export class FightReplayReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		fightId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FightReplayReq {}
	}
	
	export class FightReplayRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		randSeed:  number;
		actions:  string;
		heroList:  FightHero[] = [];
		general:  FightGeneral;

		encode(writer: IWriter) {}
		decode(reader: IReader): FightReplayRsp {}
	}
	
	export class FightBriefHero implements Message {
		typeId:  number;
		level:  number;
		star:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FightBriefHero {}
	}
	
	export class FightBrief implements Message {
		fightId:  number;
		playerId:  number;
		playerHead:  number;
		playerName:  string;
		playerPower:  number;
		heroes:  FightBriefHero[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FightBrief {}
	}
	
	//战斗-记录查询
	export class FightLookupReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FightLookupReq {}
	}
	
	export class FightLookupRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		list:  FightBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FightLookupRsp {}
	}
	
	export class FightDefendHero implements Message {
		heroId:  number;
		typeId:  number;
		pos:  number;
		power:  number;
		level:  number;
		star:  number;
		hp:  number;
		maxHp:  number;
		soldierId:  number;
		careerId:  number;
		careerLv:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FightDefendHero {}
	}
	
	export class FightDefenceFailRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;//0: 锦标赛

		encode(writer: IWriter) {}
		decode(reader: IReader): FightDefenceFailRsp {}
	}
	
	export class FightHeroDamage implements Message {
		heroId:  number;
		atkTimes:  number;
		atkDmg:  number;
		stkTimes:  number;//受击次数
		stkDmg:  number;//受击伤害

		encode(writer: IWriter) {}
		decode(reader: IReader): FightHeroDamage {}
	}
	
	// 战斗--战斗伤害流水统计
	export class FightDamageStaticReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		fightType:  number;
		stageId:  number;
		opPower:  number;
		bossNum:  number;
		damage:  FightHeroDamage[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FightDamageStaticReq {}
	}
	
	export class FightDamageStaticRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FightDamageStaticRsp {}
	}
	
	export class MissionProgress implements Message {
		type:  number;
		arg:  number;
		num:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionProgress {}
	}
	
	export class MissionCategory implements Message {
		progressList:  MissionProgress[] = [];
		missionRewarded:  number[] = [];
		missionIntRewarded:  number[] = [];//范围[1,2,3,4,5,8] => [1,5,8,8]   [1,5,6,7,8] => [1,1,5,8]
		boxOpened:  number;//如果是评分系统，表示已完成阶段

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionCategory {}
	}
	
	//任务--列表
	export class MissionListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionListReq {}
	}
	
	export class MissionListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		daily:  MissionCategory;
		weekly:  MissionCategory;
		achievement:  MissionCategory;
		mainline:  MissionCategory;
		sevenDays:  MissionCategory;
		flipCards:  MissionCategory;
		grading:  MissionCategory;
		adventureDiary:  MissionCategory;
		carnivalDaily:  MissionCategory;
		carnivalUltimate:  MissionCategory;
		footholdDaily:  MissionCategory;
		footholdRank:  MissionCategory;
		relicDaily:  MissionCategory;
		relicWeekly:  MissionCategory;
		mergeCarnivalDaily:  MissionCategory;
		mergeCarnivalUltimate:  MissionCategory;
		combo:  MissionCategory;
		caveAdventure:  MissionCategory;
		costumeCustom:  MissionCategory;

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionListRsp {}
	}
	
	//更新进度
	export class MissionUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		upType:  number;//1日常，2周常，3成就，4主线，5七天，7翻牌 8评分 10冒险日记 11跨服狂欢日常 12跨服狂欢非日常 13据点战日常 14据点战非日常 15遗迹日常 16遗迹周常
		progress:  MissionProgress;

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionUpdateRsp {}
	}
	
	//任务--领奖
	export class MissionRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		kind:  number;//1任务奖励 2积分奖励
		type:  number;//1日常，2周常，3成就，4主线，5七天， 7翻牌  8评分 10冒险日记 11跨服狂欢日常 12跨服狂欢非日常 13据点战日常 14据点战非日常 15遗迹日常 16遗迹周常 17合服狂欢日常 18合服狂欢非日常 21神装定制
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionRewardReq {}
	}
	
	export class MissionRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		kind:  number;//1任务奖励 2积分奖励
		type:  number;
		id:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionRewardRsp {}
	}
	
	//7天活动--积分奖励
	export class Mission7daysScoreAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): Mission7daysScoreAwardReq {}
	}
	
	export class Mission7daysScoreAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Mission7daysScoreAwardRsp {}
	}
	
	//在线任务--信息
	export class MissionOnlineInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionOnlineInfoReq {}
	}
	
	export class MissionOnlineInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		startTime:  number;//当天计时开始时间
		awardBits:  number;//已领取奖励位图

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionOnlineInfoRsp {}
	}
	
	//在线任务--领奖
	export class MissionOnlineAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;//0表示领取所有奖励
		day:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionOnlineAwardReq {}
	}
	
	export class MissionOnlineAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;//0表示领取所有奖励
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionOnlineAwardRsp {}
	}
	
	//成长任务--列表
	export class MissionGrowListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionGrowListReq {}
	}
	
	export class MissionGrowListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		progresses:  MissionProgress[] = [];
		chapter:  number;//章节序号
		awardBits:  number;//已领取奖励位图

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionGrowListRsp {}
	}
	
	export class MissionGrowUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		progress:  MissionProgress;

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionGrowUpdateRsp {}
	}
	
	//成长任务--章节领奖
	export class MissionGrowChapterAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionGrowChapterAwardReq {}
	}
	
	export class MissionGrowChapterAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionGrowChapterAwardRsp {}
	}
	
	//成长任务--领奖
	export class MissionGrowTaskAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionGrowTaskAwardReq {}
	}
	
	export class MissionGrowTaskAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionGrowTaskAwardRsp {}
	}
	
	//福利任务--列表
	export class MissionWelfareListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionWelfareListReq {}
	}
	
	export class MissionWelfareListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewarded:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionWelfareListRsp {}
	}
	
	//福利任务--领奖
	export class MissionWelfareAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionWelfareAwardReq {}
	}
	
	export class MissionWelfareAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionWelfareAwardRsp {}
	}
	
	//福利任务2--列表
	export class MissionWelfare2ListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionWelfare2ListReq {}
	}
	
	export class MissionWelfare2ListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		bought:  boolean;
		loginDays:  number;
		rewarded:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionWelfare2ListRsp {}
	}
	
	//福利任务2--领奖
	export class MissionWelfare2AwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionWelfare2AwardReq {}
	}
	
	export class MissionWelfare2AwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionWelfare2AwardRsp {}
	}
	
	//指挥官神器--列表
	export class MissionWeaponListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionWeaponListReq {}
	}
	
	export class MissionWeaponListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		progress:  MissionProgress[] = [];
		chapter:  number;
		awardBits:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionWeaponListRsp {}
	}
	
	export class MissionWeaponUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		progress:  MissionProgress;

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionWeaponUpdateRsp {}
	}
	
	//指挥官神器--任务领奖
	export class MissionWeaponTaskAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionWeaponTaskAwardReq {}
	}
	
	export class MissionWeaponTaskAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionWeaponTaskAwardRsp {}
	}
	
	//冒险日记--额外奖励
	export class MissionAdventureDiaryRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionAdventureDiaryRewardReq {}
	}
	
	export class MissionAdventureDiaryRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		boxOpened:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionAdventureDiaryRewardRsp {}
	}
	
	//冒险日记--奖励信息
	export class MissionAdventureDiaryRewardInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionAdventureDiaryRewardInfoReq {}
	}
	
	export class MissionAdventureDiaryRewardInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		boxOpened:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionAdventureDiaryRewardInfoRsp {}
	}
	
	//每日任务--当前轮数
	export class MissionDailyRoundIdReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionDailyRoundIdReq {}
	}
	
	export class MissionDailyRoundIdRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		roundId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionDailyRoundIdRsp {}
	}
	
	//幸运连连看--查看面板
	export class MissionComboInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionComboInfoReq {}
	}
	
	export class MissionComboInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		round:  number;//当前轮次
		gainLine:  number[] = [];//已领取连线奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): MissionComboInfoRsp {}
	}
	
	export class MasteryTeamInfo implements Message {
		teamId:  number;
		time:  number;//该队伍探索的开始时间
		achieve:  number;//队伍达成度
		heroId:  number[] = [];//英雄位置id
		typeId:  number[] = [];//英雄id
		rewards:  GoodsInfo[] = [];//奖励列表

		encode(writer: IWriter) {}
		decode(reader: IReader): MasteryTeamInfo {}
	}
	
	//专精--探索信息（废弃）
	export class MasteryTeamListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MasteryTeamListReq {}
	}
	
	export class MasteryTeamListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		count:  number;//每天的剩余探索次数
		team:  MasteryTeamInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MasteryTeamListRsp {}
	}
	
	//专精--探索开始（废弃）
	export class MasteryExploreStartReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		teamId:  number;
		heroId:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MasteryExploreStartReq {}
	}
	
	export class MasteryExploreStartRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		teamId:  number;
		teamInfo:  MasteryTeamInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): MasteryExploreStartRsp {}
	}
	
	//专精--探索停止（废弃）
	export class MasteryExploreStopReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		teamId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MasteryExploreStopReq {}
	}
	
	export class MasteryExploreStopRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		teamId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MasteryExploreStopRsp {}
	}
	
	//专精--探索奖励（废弃）
	export class MasteryExploreRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		teamId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MasteryExploreRewardReq {}
	}
	
	export class MasteryExploreRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		teamId:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MasteryExploreRewardRsp {}
	}
	
	//专精--副本列表（废弃）
	export class MasteryStageIdListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MasteryStageIdListReq {}
	}
	
	export class MasteryStageIdListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageIds:  number[] = [];//所有英雄打的副本关卡id

		encode(writer: IWriter) {}
		decode(reader: IReader): MasteryStageIdListRsp {}
	}
	
	//英雄专精副本信息
	export class MasteryStageUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		stageId:  number;//该英雄专精副本通过的最大关卡id
		id:  number;//最新打的关卡id 等于0的时候，客户端不需要追加到关卡组id里面

		encode(writer: IWriter) {}
		decode(reader: IReader): MasteryStageUpdateRsp {}
	}
	
	export class StoreBlackItem implements Message {
		id:  number;
		count:  number;//购买次数d
		itemType:  number;
		itemNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreBlackItem {}
	}
	
	export class StoreBlackMarket implements Message {
		time:  number;//刷新时间
		count:  number;//每天刷新次数
		item:  StoreBlackItem[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreBlackMarket {}
	}
	
	export class StoreBuyInfo implements Message {
		id:  number;
		count:  number;//购买次数d

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreBuyInfo {}
	}
	
	//商店--黑市信息
	export class StoreBlackMarketListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreBlackMarketListReq {}
	}
	
	export class StoreBlackMarketListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		store:  StoreBlackMarket;

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreBlackMarketListRsp {}
	}
	
	//商店--黑市刷新
	export class StoreBlackMarketRefreshReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreBlackMarketRefreshReq {}
	}
	
	export class StoreBlackMarketRefreshRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		store:  StoreBlackMarket;

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreBlackMarketRefreshRsp {}
	}
	
	//商店--黑市购买
	export class StoreBlackMarketBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		position:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreBlackMarketBuyReq {}
	}
	
	export class StoreBlackMarketBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		position:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreBlackMarketBuyRsp {}
	}
	
	export class StoreItem implements Message {
		id:  number;
		itemType:  number;
		itemNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreItem {}
	}
	
	//商店--购买信息
	export class StoreListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreListReq {}
	}
	
	export class StoreListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  StoreBuyInfo[] = [];
		items:  StoreItem[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreListRsp {}
	}
	
	//商店--购买
	export class StoreBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		num:  number;//购买数量

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreBuyReq {}
	}
	
	export class StoreBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  StoreBuyInfo;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreBuyRsp {}
	}
	
	//商店--购买信息
	export class StoreGiftListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreGiftListReq {}
	}
	
	export class StoreGiftListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  StoreBuyInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreGiftListRsp {}
	}
	
	export class StoreGiftUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  StoreBuyInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreGiftUpdateRsp {}
	}
	
	export class StorePushGift implements Message {
		giftId:  number;
		startTime:  number;
		remainNum:  number;
		totalNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): StorePushGift {}
	}
	
	//推送--礼包列表
	export class StorePushListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): StorePushListReq {}
	}
	
	export class StorePushListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  StorePushGift[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StorePushListRsp {}
	}
	
	//推送--购买礼包
	export class StorePushBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		gift:  StorePushGift;
		items:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StorePushBuyRsp {}
	}
	
	export class StorePushEvent implements Message {
		event:  number;
		num:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): StorePushEvent {}
	}
	
	//推送--事件列表（废弃）
	export class StorePushEventsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): StorePushEventsReq {}
	}
	
	export class StorePushEventsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  StorePushEvent[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StorePushEventsRsp {}
	}
	
	export class StorePushNoticeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		event:  StorePushEvent;

		encode(writer: IWriter) {}
		decode(reader: IReader): StorePushNoticeRsp {}
	}
	
	//礼包--战力礼包奖励
	export class StoreMiscGiftPowerAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;//0:查看已领取奖励，其他表示领取对应奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreMiscGiftPowerAwardReq {}
	}
	
	export class StoreMiscGiftPowerAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		bought:  boolean;//是否已购买
		flag:  number;//按位表示已领取奖励，最低位无用
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreMiscGiftPowerAwardRsp {}
	}
	
	//7天--购买历史
	export class Store7daysBoughtReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): Store7daysBoughtReq {}
	}
	
	export class Store7daysBoughtRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  StoreBuyInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Store7daysBoughtRsp {}
	}
	
	//7天--购买商品
	export class Store7daysBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): Store7daysBuyReq {}
	}
	
	export class Store7daysBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Store7daysBuyRsp {}
	}
	
	//商店--主动刷新
	export class StoreRefreshReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		storeType:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreRefreshReq {}
	}
	
	export class StoreRefreshRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  StoreBuyInfo[] = [];
		items:  StoreItem[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreRefreshRsp {}
	}
	
	//商店--快速购买
	export class StoreQuickBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		num:  number;//购买数量

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreQuickBuyReq {}
	}
	
	export class StoreQuickBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreQuickBuyRsp {}
	}
	
	export class StoreRuneItem implements Message {
		id:  number;
		itemType:  number;
		count:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreRuneItem {}
	}
	
	//符文商店--物品列表
	export class StoreRuneListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreRuneListReq {}
	}
	
	export class StoreRuneListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		refreshNum:  number;//已刷新次数
		list:  StoreRuneItem[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreRuneListRsp {}
	}
	
	//符文商店--购买物品
	export class StoreRuneBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		num:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreRuneBuyReq {}
	}
	
	export class StoreRuneBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		count:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreRuneBuyRsp {}
	}
	
	//符文商店--刷新物品
	export class StoreRuneRefreshReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreRuneRefreshReq {}
	}
	
	export class StoreRuneRefreshRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		refreshNum:  number;//已刷新次数
		list:  StoreRuneItem[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreRuneRefreshRsp {}
	}
	
	export class OperationStoreUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  StoreBuyInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): OperationStoreUpdateRsp {}
	}
	
	//彩蛋、礼券超市--信息
	export class OperationStoreListInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): OperationStoreListInfoReq {}
	}
	
	export class OperationStoreListInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  StoreBuyInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): OperationStoreListInfoRsp {}
	}
	
	export class TimeLimitGift implements Message {
		id:  number;// id
		giftId:  number;// 礼包id
		endTime:  number;// 结束时间

		encode(writer: IWriter) {}
		decode(reader: IReader): TimeLimitGift {}
	}
	
	//限时特惠礼包--列表
	export class TimeLimitGiftReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): TimeLimitGiftReq {}
	}
	
	export class TimeLimitGiftRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		gifts:  TimeLimitGift[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): TimeLimitGiftRsp {}
	}
	
	//丧尸商店--商品列表
	export class StoreSiegeListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreSiegeListReq {}
	}
	
	export class StoreSiegeListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  StoreBlackItem[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreSiegeListRsp {}
	}
	
	export class HeroAwakeGift implements Message {
		id:  number;
		outTime:  number;//过期时间
		count:  number;//购买次数d

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakeGift {}
	}
	
	//英雄觉醒--觉醒礼包
	export class HeroAwakeGiftReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakeGiftReq {}
	}
	
	export class HeroAwakeGiftRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  HeroAwakeGift[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakeGiftRsp {}
	}
	
	//英雄觉醒--推送新增礼包，或者更新购买次数
	export class HeroAwakeGiftUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  HeroAwakeGift[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): HeroAwakeGiftUpdateRsp {}
	}
	
	//专属商店--商品列表
	export class StoreUniqueEquipListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreUniqueEquipListReq {}
	}
	
	export class StoreUniqueEquipListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  StoreBlackItem[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreUniqueEquipListRsp {}
	}
	
	//专属商店--刷新
	export class StoreUniqueEquipRefreshReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreUniqueEquipRefreshReq {}
	}
	
	export class StoreUniqueEquipRefreshRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  StoreBlackItem[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): StoreUniqueEquipRefreshRsp {}
	}
	
	export class Sign implements Message {
		signed:  boolean;//今天是否已经签到
		count:  number;//月已经签到的次数
		buCount:  number;//月补签的次数
		signPay:  boolean;//今天是否充值签到
		signPayAvailable:  boolean;//能否领取充值签到

		encode(writer: IWriter) {}
		decode(reader: IReader): Sign {}
	}
	
	//签到--信息
	export class SignInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SignInfoReq {}
	}
	
	export class SignInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  Sign;

		encode(writer: IWriter) {}
		decode(reader: IReader): SignInfoRsp {}
	}
	
	//签到--签到
	export class SignLoginReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SignLoginReq {}
	}
	
	export class SignLoginRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SignLoginRsp {}
	}
	
	//签到--补签
	export class SignBuReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SignBuReq {}
	}
	
	export class SignBuRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SignBuRsp {}
	}
	
	//签到--充值签到
	export class SignPayReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SignPayReq {}
	}
	
	export class SignPayRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SignPayRsp {}
	}
	
	export class RubyInfo implements Message {
		id:  number;
		exp:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RubyInfo {}
	}
	
	//宝石--升级
	export class RubyUpgradeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		slotIdx:  number;
		rubyIdx:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RubyUpgradeReq {}
	}
	
	export class RubyUpgradeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		slotIdx:  number;
		rubyIdx:  number;
		rubyId:  number;//升级后id

		encode(writer: IWriter) {}
		decode(reader: IReader): RubyUpgradeRsp {}
	}
	
	//宝石--合成
	export class RubyComposeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rubyId:  number;//材料宝石的id

		encode(writer: IWriter) {}
		decode(reader: IReader): RubyComposeReq {}
	}
	
	export class RubyComposeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RubyComposeRsp {}
	}
	
	//宝石--镶嵌
	export class RubyPutOnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;//英雄ID
		slotIdx:  number;//装备槽的序号，从0开始
		rubyIdx:  number;//宝石孔的序号，从0开始
		rubyId:  number;//宝石的id

		encode(writer: IWriter) {}
		decode(reader: IReader): RubyPutOnReq {}
	}
	
	export class RubyPutOnRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;//英雄ID
		slotIdx:  number;//装备槽的序号，从0开始
		rubies:  number[] = [];//英雄身上的宝石

		encode(writer: IWriter) {}
		decode(reader: IReader): RubyPutOnRsp {}
	}
	
	//宝石--拆卸
	export class RubyTakeOffReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;//英雄ID
		slotIdx:  number;//装备槽的序号，从0开始
		rubyIdx:  number;//宝石孔的序号，从0开始

		encode(writer: IWriter) {}
		decode(reader: IReader): RubyTakeOffReq {}
	}
	
	export class RubyTakeOffRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;//英雄ID
		slotIdx:  number;//装备槽的序号，从0开始
		rubies:  number[] = [];//英雄身上的宝石

		encode(writer: IWriter) {}
		decode(reader: IReader): RubyTakeOffRsp {}
	}
	
	export class GeneralInfo implements Message {
		weaponId:  number;
		arr:  GeneralAttr;
		skills:  FightSkill[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneralInfo {}
	}
	
	export class GeneralAttr implements Message {
		atkW:  number;//攻击
		hitW:  number;//命中
		critW:  number;//暴击
		hurtW:  number;//爆伤
		defPeneW:  number;//防御穿透
		speed:  number;//移速
		atkSpeedW:  number;//攻速

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneralAttr {}
	}
	
	//指挥官属性
	export class GeneralAttrRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		attr:  GeneralAttr;
		skills:  FightSkill[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneralAttrRsp {}
	}
	
	//指挥官--信息
	export class GeneralInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneralInfoReq {}
	}
	
	export class GeneralInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		general:  GeneralInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneralInfoRsp {}
	}
	
	export class GweaponAttr implements Message {
		heroHp:  number;
		heroAtk:  number;
		heroDef:  number;
		heroPower:  number;
		soldierHp:  number;
		soldierAtk:  number;
		soldierDef:  number;
		soldierPower:  number;
		dmgAdd:  number;
		dmgRes:  number;
		heroHit:  number;
		heroDodge:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GweaponAttr {}
	}
	
	//指挥官--切换神器
	export class GeneralChangeWeaponReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		weaponId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneralChangeWeaponReq {}
	}
	
	export class GeneralChangeWeaponRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		weaponId:  number;
		newPower:  number;
		diffAttr:  GweaponAttr;

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneralChangeWeaponRsp {}
	}
	
	//指挥官--拥有神器信息
	export class GeneralWeaponInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneralWeaponInfoReq {}
	}
	
	export class GeneralWeaponInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		weaponId:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneralWeaponInfoRsp {}
	}
	
	export class GeneralWeaponGetRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		weaponId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneralWeaponGetRsp {}
	}
	
	//指挥官--神奇升级、精炼信息
	export class GeneralWeaponUpgradeInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneralWeaponUpgradeInfoReq {}
	}
	
	export class GeneralWeaponUpgradeInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		levelId:  number;//当前Id
		levelLv:  number;//当前等级
		progressId:  number;
		progressLv:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneralWeaponUpgradeInfoRsp {}
	}
	
	//指挥官--神器升级
	export class GeneralWeaponLevelUpgradeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		isQuickUpgrade:  boolean;//是否一键升级

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneralWeaponLevelUpgradeReq {}
	}
	
	export class GeneralWeaponLevelUpgradeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		curId:  number;
		curLv:  number;//升级后的等级

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneralWeaponLevelUpgradeRsp {}
	}
	
	//指挥官--神器精炼
	export class GeneralWeaponProgressUpgradeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneralWeaponProgressUpgradeReq {}
	}
	
	export class GeneralWeaponProgressUpgradeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		lv:  number;//当前等级

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneralWeaponProgressUpgradeRsp {}
	}
	
	export class GweaponInfo implements Message {
		gweaponId:  number;
		star:  number;
		skillLv:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GweaponInfo {}
	}
	
	//神器--列表（废弃）
	export class GweaponListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GweaponListReq {}
	}
	
	export class GweaponListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GweaponInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GweaponListRsp {}
	}
	
	//神器--强化（废弃）
	export class GweaponStrengthReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		itemList:  number[] = [];//道具id

		encode(writer: IWriter) {}
		decode(reader: IReader): GweaponStrengthReq {}
	}
	
	export class GweaponStrengthRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		level:  number;
		exp:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GweaponStrengthRsp {}
	}
	
	//神器--升星（废弃）
	export class GweaponUpgradeStarReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		gweaponId:  number;//强化装备ID

		encode(writer: IWriter) {}
		decode(reader: IReader): GweaponUpgradeStarReq {}
	}
	
	export class GweaponUpgradeStarRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		gweapon:  GweaponInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): GweaponUpgradeStarRsp {}
	}
	
	//神器--信息（废弃）
	export class GweaponIdInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GweaponIdInfoReq {}
	}
	
	export class GweaponIdInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  GweaponInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): GweaponIdInfoRsp {}
	}
	
	export class RankBrief implements Message {
		brief:  RoleBrief;
		value:  number;
		yesterday:  number;// 昨天的排名，0表示之前不在排行榜中

		encode(writer: IWriter) {}
		decode(reader: IReader): RankBrief {}
	}
	
	//排行榜--昨日排名
	export class RankYesterdayReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RankYesterdayReq {}
	}
	
	export class RankYesterdayRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		power:  number;
		refine:  number;
		mstage:  number;
		mcups:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RankYesterdayRsp {}
	}
	
	//战力榜--排行
	export class RankPowerReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RankPowerReq {}
	}
	
	export class RankPowerRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		time:  number;
		list:  RankBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RankPowerRsp {}
	}
	
	//战力榜--数值
	export class RankPowerValuesReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RankPowerValuesReq {}
	}
	
	export class RankPowerValuesRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		time:  number;
		values:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RankPowerValuesRsp {}
	}
	
	//试炼榜--排行
	export class RankRefineReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RankRefineReq {}
	}
	
	export class RankRefineRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		time:  number;
		list:  RankBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RankRefineRsp {}
	}
	
	//试炼榜--数值
	export class RankRefineValuesReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RankRefineValuesReq {}
	}
	
	export class RankRefineValuesRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		time:  number;
		values:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RankRefineValuesRsp {}
	}
	
	//竞技榜--排行
	export class RankArenaReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RankArenaReq {}
	}
	
	export class RankArenaRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		time:  number;
		list:  RankBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RankArenaRsp {}
	}
	
	//主线榜--排行
	export class RankMstageReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RankMstageReq {}
	}
	
	export class RankMstageRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		time:  number;
		list:  RankBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RankMstageRsp {}
	}
	
	//主线榜--数值
	export class RankMstageValuesReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RankMstageValuesReq {}
	}
	
	export class RankMstageValuesRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		time:  number;
		values:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RankMstageValuesRsp {}
	}
	
	//奖杯榜--排行
	export class RankMcupsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RankMcupsReq {}
	}
	
	export class RankMcupsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		time:  number;
		list:  RankBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RankMcupsRsp {}
	}
	
	//奖杯榜--数值
	export class RankMcupsValuesReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RankMcupsValuesReq {}
	}
	
	export class RankMcupsValuesRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		time:  number;
		values:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RankMcupsValuesRsp {}
	}
	
	//排行榜--详细情况
	export class RankDetailReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;//1:战力榜 2:主线榜 3:试炼榜 4:精英榜 5:竞技榜 6:正义的反击 7:跨服狂欢 8:合服狂欢

		encode(writer: IWriter) {}
		decode(reader: IReader): RankDetailReq {}
	}
	
	export class RankDetailRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		list:  RankBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RankDetailRsp {}
	}
	
	export class RankSelfRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		numYd:  number;//昨日排名
		numTd:  number;//今日排名

		encode(writer: IWriter) {}
		decode(reader: IReader): RankSelfRsp {}
	}
	
	export class ArenaPlayer implements Message {
		id:  number;
		robotId:  number;
		name:  string;
		head:  number;
		frame:  number;
		level:  number;
		power:  number;
		score:  number;
		vipExp:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaPlayer {}
		
	get VipFlag(): number {
		return 0;
	}

	get VipLv(): number {
		return 0;
	}
	}
	
	export class ArenaFighter implements Message {
		heroList:  FightHero[] = [];
		general:  FightGeneral;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaFighter {}
	}
	
	export class ArenaLog implements Message {
		fightType:  number;//1：进攻、2：防守
		fightTime:  number;
		addScore:  number;
		opponentId:  number;
		opponentName:  string;
		opponentHead:  number;
		opponentFrame:  number;
		opponentLevel:  number;
		opponentPower:  number;
		opponentVipExp:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaLog {}
	}
	
	//竞技场--信息
	export class ArenaInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaInfoReq {}
	}
	
	export class ArenaInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		logList:  ArenaLog[] = [];
		score:  number;
		points:  number;
		rankNum:  number;
		fightNum:  number;
		buyNum:  number;
		awardNums:  number[] = [];
		raidTime:  number;// 满足次数后的一次扫荡时间
		raidTimes:  number;// 剩余扫荡次数

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaInfoRsp {}
	}
	
	//竞技场--战斗开始
	export class ArenaFightReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		opponentId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaFightReq {}
	}
	
	export class ArenaFightRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		opponentId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaFightRsp {}
	}
	
	//竞技场--战斗结果
	export class ArenaFightResultReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		opponentId:  number;
		success:  boolean;
		heroIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaFightResultReq {}
	}
	
	export class ArenaFightResultRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		points:  number;
		score:  number;
		addScore:  number;
		log:  ArenaLog;
		awards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaFightResultRsp {}
	}
	
	//竞技场--设置防守阵容
	export class ArenaDefenceSetReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaDefenceSetReq {}
	}
	
	export class ArenaDefenceSetRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaDefenceSetRsp {}
	}
	
	//竞技场--查看防守阵容（废弃）
	export class ArenaDefenceReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaDefenceReq {}
	}
	
	export class ArenaDefenceRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaDefenceRsp {}
	}
	
	//竞技场--匹配对手
	export class ArenaMatchReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaMatchReq {}
	}
	
	export class ArenaMatchRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		players:  ArenaPlayer[] = [];
		matchTime:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaMatchRsp {}
	}
	
	//竞技场--购买次数
	export class ArenaBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaBuyReq {}
	}
	
	export class ArenaBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		fightNum:  number;
		buyNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaBuyRsp {}
	}
	
	//竞技场--查询对手
	export class ArenaQueryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaQueryReq {}
	}
	
	export class ArenaQueryRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		player:  ArenaPlayer;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaQueryRsp {}
	}
	
	//竞技场--积分奖励
	export class ArenaPointsAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaPointsAwardReq {}
	}
	
	export class ArenaPointsAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		points:  number;
		awardNums:  number[] = [];
		goodsList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaPointsAwardRsp {}
	}
	
	//竞技场--战斗准备
	export class ArenaPrepareReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaPrepareReq {}
	}
	
	export class ArenaPrepareRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		defender:  ArenaFighter;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaPrepareRsp {}
	}
	
	//竞技场--扫荡
	export class ArenaRaidReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		opponentId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaRaidReq {}
	}
	
	export class ArenaRaidRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		raidTime:  number;// 满足次数后的一次扫荡时间
		raidTimes:  number;// 剩余扫荡次数
		fightNum:  number;
		points:  number;
		score:  number;
		addScore:  number;
		log:  ArenaLog;
		awards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaRaidRsp {}
	}
	
	export class JusticeSlot implements Message {
		heroId:  number;
		heroPower:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeSlot {}
	}
	
	export class JusticeGeneral implements Message {
		level:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeGeneral {}
	}
	
	export class JusticeBoss implements Message {
		id:  number;
		hp:  number;
		recoverTime:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeBoss {}
	}
	
	//正义的反击--同步状态
	export class JusticeStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeStateReq {}
	}
	
	export class JusticeStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		score:  number;
		generalDps:  number;
		slotDps:  number;
		atkTime:  number;
		maxKillId:  number;
		boss:  JusticeBoss;
		general:  JusticeGeneral;
		slots:  JusticeSlot[] = [];
		mercenaries:  number[] = [];
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeStateRsp {}
	}
	
	//正义的反击--召唤BOSS
	export class JusticeSummonReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeSummonReq {}
	}
	
	export class JusticeSummonRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		boss:  JusticeBoss;

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeSummonRsp {}
	}
	
	//正义的反击--点击BOSS
	export class JusticeClickReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeClickReq {}
	}
	
	export class JusticeClickRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		isCrit:  boolean;
		isDead:  boolean;
		damage:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeClickRsp {}
	}
	
	//正义的反击--上阵英雄
	export class JusticeHeroInReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeHeroInReq {}
	}
	
	//正义的反击--升级指挥官
	export class JusticeGeneralLvupReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeGeneralLvupReq {}
	}
	
	//正义的反击--开启插槽
	export class JusticeSlotOpenReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeSlotOpenReq {}
	}
	
	export class JusticeSlotOpenRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeSlotOpenRsp {}
	}
	
	//正义的反击--升级佣兵
	export class JusticeMercenaryLvupReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeMercenaryLvupReq {}
	}
	
	//正义的反击--重置BOSS
	export class JusticeBossResetReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeBossResetReq {}
	}
	
	export class JusticeBossResetRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		boss:  JusticeBoss;
		atkTime:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeBossResetRsp {}
	}
	
	//正义的反击--已获得物品
	export class JusticeItemsGotReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeItemsGotReq {}
	}
	
	export class JusticeItemsGotRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeItemsGotRsp {}
	}
	
	//正义的反击--快速击杀
	export class JusticeQuickKillReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeQuickKillReq {}
	}
	
	//正义的反击--一键升级
	export class JusticeQuickLvupReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): JusticeQuickLvupReq {}
	}
	
	//查看章节奖励
	export class DungeonChapter implements Message {
		chapterId:  number;
		boxes:  number;//已经领取的宝箱
		cups:  number[] = [];//已经获得的奖杯

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonChapter {}
	}
	
	//副本--章节列表
	export class DungeonChapterListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonChapterListReq {}
	}
	
	export class DungeonChapterListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  DungeonChapter[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonChapterListRsp {}
	}
	
	//副本--章节奖励
	export class DungeonChapterRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		prizeId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonChapterRewardReq {}
	}
	
	export class DungeonChapterRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		prizeId:  number;
		chapterId:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonChapterRewardRsp {}
	}
	
	export class DungeonInfo implements Message {
		dungeonId:  number;
		stageId:  number;
		hangupId:  number;
		num:  number;//进入次数(无尽黑暗历史最高通关关卡)
		hangupTime:  number;//挂机开始时间(无尽黑暗重置时间)
		rewardFlag:  number[] = [];//无尽黑暗奖励领取记录
		buyRaids:  number;//无尽黑暗，购买的扫荡次数
		raids:  number;//无尽黑暗，已扫荡次数

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonInfo {}
	}
	
	//英雄副本查询信息
	export class DungeonBoss implements Message {
		stageId:  number;
		bossHp:  number;
		lastTime:  number;
		heroList:  number[] = [];
		summonLv:  number;
		killFlag:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonBoss {}
	}
	
	//副本--列表
	export class DungeonListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonListReq {}
	}
	
	export class DungeonListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  DungeonInfo[] = [];
		boss:  DungeonBoss;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonListRsp {}
	}
	
	//副本--进入
	export class DungeonEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonEnterReq {}
	}
	
	export class DungeonEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		minPower:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonEnterRsp {}
	}
	
	//副本--退出（领取奖励）
	export class DungeonExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		clear:  boolean;//是否通关，不通关没有通关奖励，也没有奖杯奖励
		cups:  number;//本次战斗获得奖杯数
		heroes:  number[] = [];//本次战斗上战英雄
		rndseed:  number;//本次战斗随机种子
		actions:  string;//本次战斗指挥官释放技能

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonExitReq {}
	}
	
	export class DungeonExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		cups:  number;
		isFirst:  boolean;
		percent:  number;// 无尽黑暗排名
		rewards:  GoodsInfo[] = [];
		levelUp:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonExitRsp {}
	}
	
	//副本--扫荡
	export class DungeonRaidsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonRaidsReq {}
	}
	
	export class DungeonRaidsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonRaidsRsp {}
	}
	
	//挂机--选择关卡
	export class DungeonHangChooseReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHangChooseReq {}
	}
	
	//挂机--获取状态
	export class DungeonHangStatusReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHangStatusReq {}
	}
	
	export class DungeonHangStatusRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		dungeonId:  number;
		stageId:  number;
		startTime:  number;//开始挂机时间
		exploreTime:  number;//开始探索时间
		hangupReady:  boolean;
		goodsList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHangStatusRsp {}
	}
	
	//挂机--领取奖励
	export class DungeonHangRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;//-1表示新手引导奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHangRewardReq {}
	}
	
	export class DungeonHangRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		dungeonId:  number;
		stageId:  number;
		startTime:  number;
		exploreTime:  number;
		goodsList:  GoodsInfo[] = [];
		monthCardGoodsList:  GoodsInfo[] = [];//月卡特权奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHangRewardRsp {}
	}
	
	//英雄副本--召唤BOSS
	export class DungeonBossSummonReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonBossSummonReq {}
	}
	
	export class DungeonBossSummonRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		bossInfo:  DungeonBoss;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonBossSummonRsp {}
	}
	
	//英雄副本--英雄上阵
	export class DungeonBossBattleReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroList:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonBossBattleReq {}
	}
	
	export class DungeonBossBattleRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		bossInfo:  DungeonBoss;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonBossBattleRsp {}
	}
	
	//英雄副本--玩家点击
	export class DungeonBossClickReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonBossClickReq {}
	}
	
	export class DungeonBossClickRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		bossHp:  number;
		isCrit:  boolean;
		dropList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonBossClickRsp {}
	}
	
	//英雄副本--英雄攻击
	export class DungeonBossFightReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonBossFightReq {}
	}
	
	export class DungeonBossFightRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		bossInfo:  DungeonBoss;
		dropList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonBossFightRsp {}
	}
	
	//引导副本--辅助英雄
	export class DungeonAssistsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		activityId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonAssistsReq {}
	}
	
	export class DungeonAssistsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  FightHero[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonAssistsRsp {}
	}
	
	// 精英
	export class DungeonElitesStage implements Message {
		stageId:  number;// 关卡id
		cups:  number;// 关卡获得的奖杯数

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonElitesStage {}
	}
	
	//精英副本--进度
	export class DungeonElitesReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonElitesReq {}
	}
	
	export class DungeonElitesRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		noviceStage:  DungeonElitesStage[] = [];// 新手的关卡记录
		noviceBits:  number[] = [];// 新手位图，下标减1是奖励序号
		challengeStage:  DungeonElitesStage[] = [];// 挑战
		challengeBits:  number[] = [];// 挑战位图

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonElitesRsp {}
	}
	
	//挂机--奖励预览
	export class DungeonHangPreviewReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		dungeonId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHangPreviewReq {}
	}
	
	export class DungeonHangPreviewRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		dropItems:  GoodsInfo[] = [];
		vipBonus:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHangPreviewRsp {}
	}
	
	//精英副本--章节奖励
	export class DungeonElitesChapterRewardsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		copyId:  number;// 12-精英新手，13-精英挑战
		id:  number;// 奖励序号

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonElitesChapterRewardsReq {}
	}
	
	export class DungeonElitesChapterRewardsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		copyId:  number;// 12-精英新手，13-精英挑战
		bits:  number[] = [];// 奖励位图
		chapterId:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonElitesChapterRewardsRsp {}
	}
	
	//无尽黑暗--一键领取
	export class DungeonTrialRewardsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonTrialRewardsReq {}
	}
	
	//无尽黑暗--一键领取
	export class DungeonTrialRewardsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewardFlag:  number[] = [];// 领取记录
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonTrialRewardsRsp {}
	}
	
	//无尽黑暗--扫荡
	export class DungeonTrialRaidsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonTrialRaidsReq {}
	}
	
	export class DungeonTrialRaidsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonTrialRaidsRsp {}
	}
	
	//无尽黑暗--购买扫荡
	export class DungeonTrialBuyRaidsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonTrialBuyRaidsReq {}
	}
	
	//无尽黑暗--购买扫荡
	export class DungeonTrialBuyRaidsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		buyRaids:  number;//无尽黑暗，购买的扫荡次数
		raids:  number;//无尽黑暗，已扫荡次数

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonTrialBuyRaidsRsp {}
	}
	
	//英雄副本--进度及扫荡次数
	export class DungeonHeroSweepTimesReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHeroSweepTimesReq {}
	}
	
	export class DungeonHeroSweepTimesRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		maxStage:  number[] = [];
		heroSweep:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHeroSweepTimesRsp {}
	}
	
	//英雄副本--扫荡
	export class DungeonHeroRaidReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHeroRaidReq {}
	}
	
	export class DungeonHeroRaidRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHeroRaidRsp {}
	}
	
	//英雄副本--进入
	export class DungeonHeroEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHeroEnterReq {}
	}
	
	export class DungeonHeroEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		minPower:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHeroEnterRsp {}
	}
	
	//英雄副本--退出
	export class DungeonHeroExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		clear:  boolean;//是否通关，不通关没有通关奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHeroExitReq {}
	}
	
	export class DungeonHeroExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		isFirst:  boolean;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHeroExitRsp {}
	}
	
	//英雄副本--一键扫荡
	export class DungeonHeroQuickRaidReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHeroQuickRaidReq {}
	}
	
	//英雄副本--一键扫荡
	export class DungeonHeroQuickRaidRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonHeroQuickRaidRsp {}
	}
	
	//精英副本--领取所有奖励
	export class DungeonElitesRewardsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		copyId:  number;// 12-精英新手，13-精英挑战

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonElitesRewardsReq {}
	}
	
	export class DungeonElitesRewardsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		copyId:  number;// 12-精英新手，13-精英挑战
		bits:  number[] = [];// 奖励位图
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonElitesRewardsRsp {}
	}
	
	//符文副本--进入
	export class DungeonRuneEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonRuneEnterReq {}
	}
	
	export class DungeonRuneEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonRuneEnterRsp {}
	}
	
	export class Monster implements Message {
		monsterId:  number;
		monsterNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): Monster {}
	}
	
	//符文副本--退出
	export class DungeonRuneExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		monsters:  Monster[] = [];
		clear:  boolean;//是否通关

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonRuneExitReq {}
	}
	
	export class DungeonRuneExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		monsterNum:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonRuneExitRsp {}
	}
	
	//符文副本--扫荡
	export class DungeonRuneRaidReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonRuneRaidReq {}
	}
	
	export class DungeonRuneRaidRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonRuneRaidRsp {}
	}
	
	//符文副本--一键扫荡
	export class DungeonRuneQuickRaidReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonRuneQuickRaidReq {}
	}
	
	export class DungeonRuneQuickRaidRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		availableTimes:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonRuneQuickRaidRsp {}
	}
	
	//符文副本--进度、次数信息
	export class DungeonRuneInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonRuneInfoReq {}
	}
	
	export class DungeonRuneInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		maxStageId:  number;
		maxMonsterNum:  number;
		availableTimes:  number;//可用次数

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonRuneInfoRsp {}
	}
	
	export class DungeonOrdealReward implements Message {
		damage:  number;// 伤害
		times:  number;// 剩余多少份奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonOrdealReward {}
	}
	
	//英雄试炼--进度、次数信息
	export class DungeonOrdealInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonOrdealInfoReq {}
	}
	
	export class DungeonOrdealInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		maxStageId:  number;
		stageDamages:  number[] = [];// 伤害（下标=难度-1）
		rankNum:  number;// 名次，0表示没有名次
		rewardRecord:  number[] = [];// 奖励领取记录，伤害档次
		rewardTimes:  DungeonOrdealReward[] = [];// 奖励剩余信息
		serverNum:  number;// 跨服组中游戏服数量

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonOrdealInfoRsp {}
	}
	
	//英雄试炼--开始战斗
	export class DungeonOrdealEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonOrdealEnterReq {}
	}
	
	export class DungeonOrdealEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonOrdealEnterRsp {}
	}
	
	//英雄试炼--结束战斗
	export class DungeonOrdealExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		stageDamage:  number;// 伤害
		clear:  boolean;// 是否通关

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonOrdealExitReq {}
	}
	
	export class DungeonOrdealExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		stageDamage:  number;
		clearRewards:  GoodsInfo[] = [];//首通奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonOrdealExitRsp {}
	}
	
	export class OrdealRankBrief implements Message {
		brief:  RoleBrief;
		value:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): OrdealRankBrief {}
	}
	
	//英雄试炼--排行榜
	export class DungeonOrdealRankListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonOrdealRankListReq {}
	}
	
	export class DungeonOrdealRankListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  OrdealRankBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonOrdealRankListRsp {}
	}
	
	//英雄试炼--更新奖励剩余信息(主动推送)
	export class DungeonOrdealRewardUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		reward:  DungeonOrdealReward[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonOrdealRewardUpdateRsp {}
	}
	
	//英雄试炼--领取奖励
	export class DungeonOrdealRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		damage:  number;// 伤害档次

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonOrdealRewardReq {}
	}
	
	export class DungeonOrdealRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewardRecord:  number[] = [];// 奖励领取记录，伤害档次
		rewardTimes:  DungeonOrdealReward[] = [];// 奖励剩余信息
		rewards:  GoodsInfo[] = [];// 奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonOrdealRewardRsp {}
	}
	
	//副本--最低通关战力
	export class DungeonMinPowerReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonMinPowerReq {}
	}
	
	export class DungeonMinPowerRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		minPower:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonMinPowerRsp {}
	}
	
	//终极副本--状态
	export class DungeonUltimateStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonUltimateStateReq {}
	}
	
	export class DungeonUltimateStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		maxStageId:  number;// 已通过的最高关卡id
		enterNum:  number;// 挑战次数
		leftNum:  number;// 剩余挑战次数
		clear:  boolean;// 上一次战斗是否胜利

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonUltimateStateRsp {}
	}
	
	//终极副本--进入战斗
	export class DungeonUltimateEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonUltimateEnterReq {}
	}
	
	export class DungeonUltimateEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id
		leftNum:  number;// 剩余挑战次数

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonUltimateEnterRsp {}
	}
	
	//终极副本--战斗结束
	export class DungeonUltimateExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id
		clear:  boolean;//是否通关

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonUltimateExitReq {}
	}
	
	export class DungeonUltimateExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id
		clear:  boolean;// 是否通关
		maxStageId:  number;// 已通过的最高关卡id
		rewards:  GoodsInfo[] = [];// 过关奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonUltimateExitRsp {}
	}
	
	//七天之战--状态
	export class DungeonSevenDayStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonSevenDayStateReq {}
	}
	
	export class DungeonSevenDayStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stage:  number;// 通关标志,(1-7,和copy表一致)
		reward:  number;// 通关领取标志
		buy:  number;// 购买礼包标志
		gift:  number;// 礼包领取标志

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonSevenDayStateRsp {}
	}
	
	//七天之战--挑战
	export class DungeonSevenDayEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonSevenDayEnterReq {}
	}
	
	export class DungeonSevenDayEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonSevenDayEnterRsp {}
	}
	
	//七天之战--退出挑战
	export class DungeonSevenDayExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id
		clear:  boolean;// 是否胜利

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonSevenDayExitReq {}
	}
	
	export class DungeonSevenDayExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id
		clear:  boolean;// 是否胜利
		stage:  number;// 通关标志

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonSevenDayExitRsp {}
	}
	
	//七天之战--领取通关奖励
	export class DungeonSevenDayRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonSevenDayRewardReq {}
	}
	
	export class DungeonSevenDayRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id
		reward:  number;// 通关领取标志
		rewards:  GoodsInfo[] = [];// 过关奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonSevenDayRewardRsp {}
	}
	
	//七天之战--领取礼包
	export class DungeonSevenDayGiftReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonSevenDayGiftReq {}
	}
	
	export class DungeonSevenDayGiftRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id
		gift:  number;// 礼包领取标志
		rewards:  GoodsInfo[] = [];// 过关奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): DungeonSevenDayGiftRsp {}
	}
	
	//抽卡--抽卡
	export class LuckyDrawReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): LuckyDrawReq {}
	}
	
	export class LuckyDrawRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): LuckyDrawRsp {}
	}
	
	//抽卡--合卡
	export class LuckyComposeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		compType:  number;
		itemIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): LuckyComposeReq {}
	}
	
	export class LuckyComposeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		compType:  number;
		hero:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): LuckyComposeRsp {}
	}
	
	//抽卡--次数、积分
	export class LuckyNumberReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): LuckyNumberReq {}
	}
	
	export class LuckyNumberRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		numbers:  number[] = [];
		credit:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): LuckyNumberRsp {}
	}
	
	//抽卡积分--兑换
	export class LuckyCreditExchangeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): LuckyCreditExchangeReq {}
	}
	
	export class LuckyCreditExchangeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		remain:  number;//剩余的积分
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): LuckyCreditExchangeRsp {}
	}
	
	//奇趣娃娃机--次数
	export class LuckyDrawSummonStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): LuckyDrawSummonStateReq {}
	}
	
	export class LuckyDrawSummonStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		free:  number;//已使用免费次数
		gems:  number;//已使用砖石次数
		optional:  number;//池子Id

		encode(writer: IWriter) {}
		decode(reader: IReader): LuckyDrawSummonStateRsp {}
	}
	
	//奇趣娃娃机--抽奖，广播协议使用SystemBroadcastRsp协议
	export class LuckyDrawSummonReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		times:  number;// 1-单次，10-十次

		encode(writer: IWriter) {}
		decode(reader: IReader): LuckyDrawSummonReq {}
	}
	
	export class LuckyDrawSummonRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): LuckyDrawSummonRsp {}
	}
	
	//奇趣娃娃机--自选池子
	export class LuckyDrawOptionalReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		optional:  number;//池子Id

		encode(writer: IWriter) {}
		decode(reader: IReader): LuckyDrawOptionalReq {}
	}
	
	export class LuckyDrawOptionalRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		optional:  number;//池子Id

		encode(writer: IWriter) {}
		decode(reader: IReader): LuckyDrawOptionalRsp {}
	}
	
	//引导--已完成记录
	export class GuideGroupListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuideGroupListReq {}
	}
	
	export class GuideGroupListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		taskId:  number;//已经领取奖励的任务ID
		guideList:  number[] = [];//引导ID列表

		encode(writer: IWriter) {}
		decode(reader: IReader): GuideGroupListRsp {}
	}
	
	//引导--记录引导组
	export class GuideGroupSaveReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		groupId:  number;//引导组ID

		encode(writer: IWriter) {}
		decode(reader: IReader): GuideGroupSaveReq {}
	}
	
	export class GuideGroupSaveRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		groupId:  number;//引导组ID

		encode(writer: IWriter) {}
		decode(reader: IReader): GuideGroupSaveRsp {}
	}
	
	//引导--记录引导步骤
	export class GuideGroupStepReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		groupId:  number;//引导组ID
		stepId:  number;//步骤Id

		encode(writer: IWriter) {}
		decode(reader: IReader): GuideGroupStepReq {}
	}
	
	export class GuideGroupStepRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		groupId:  number;//引导组ID
		stepId:  number;//步骤Id

		encode(writer: IWriter) {}
		decode(reader: IReader): GuideGroupStepRsp {}
	}
	
	export class MonthCardInfo implements Message {
		id:  number;//特权卡id
		time:  number;//月卡的结束时间
		paySum:  number;//累计充值金额
		isRewarded:  boolean;//是否已经领取过每日奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardInfo {}
	}
	
	export class MonthCardDungeon implements Message {
		id:  number;//特权卡id
		dungeonType:  number;//当前挂机类型，1主线，2兄贵等，0是没挂机
		isDungeoned:  boolean;//今天是否已经挂机过了，true是已经挂机过不能再切换类型
		dungeonTime:  number;//挂机开始时间

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardDungeon {}
	}
	
	//月卡--列表
	export class MonthCardListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardListReq {}
	}
	
	export class MonthCardListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  MonthCardInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardListRsp {}
	}
	
	export class MonthCardUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  MonthCardInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardUpdateRsp {}
	}
	
	//月卡--挂机信息（废弃）
	export class MonthCardDungeonInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardDungeonInfoReq {}
	}
	
	export class MonthCardDungeonInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  MonthCardDungeon;

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardDungeonInfoRsp {}
	}
	
	//月卡--挂机类型选择（废弃）
	export class MonthCardDungeonChooseReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		dungeonType:  number;//请求挂机类型，1主线，2兄贵等

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardDungeonChooseReq {}
	}
	
	export class MonthCardDungeonChooseRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  MonthCardDungeon;

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardDungeonChooseRsp {}
	}
	
	//月卡--每天可领奖励
	export class MonthCardDayRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;//特权卡id

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardDayRewardReq {}
	}
	
	export class MonthCardDayRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  MonthCardInfo;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardDayRewardRsp {}
	}
	
	//累充月卡--领取
	export class MonthCardPaySumVipRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		cardId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardPaySumVipRewardReq {}
	}
	
	export class MonthCardPaySumVipRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		cardId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardPaySumVipRewardRsp {}
	}
	
	//快速作战--查看已用次数
	export class MonthCardQuickCombatInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardQuickCombatInfoReq {}
	}
	
	export class MonthCardQuickCombatInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		freeRemain:  number;
		payRemain:  number;
		payTimes:  number;//已用的付费次数

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardQuickCombatInfoRsp {}
	}
	
	//月卡--钻石购买
	export class MonthCardBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		cardId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardBuyReq {}
	}
	
	export class MonthCardBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		cardId:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MonthCardBuyRsp {}
	}
	
	//礼包码--领奖
	export class GiftFetchReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		code:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): GiftFetchReq {}
	}
	
	export class GiftFetchRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		frozenTime:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GiftFetchRsp {}
	}
	
	//反馈回复
	export class FeedbackReply implements Message {
		type:  number;//类型，1是玩家，2是gm
		content:  string;//内容
		time:  number;//时间

		encode(writer: IWriter) {}
		decode(reader: IReader): FeedbackReply {}
	}
	
	//反馈--信息（废弃）
	export class FeedbackInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FeedbackInfoReq {}
	}
	
	export class FeedbackInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		topicId:  number;//当前主题
		reply:  FeedbackReply[] = [];//当前主题的对话内容

		encode(writer: IWriter) {}
		decode(reader: IReader): FeedbackInfoRsp {}
	}
	
	//反馈--建议（废弃）
	export class FeedbackByRoleReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		content:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): FeedbackByRoleReq {}
	}
	
	export class FeedbackByRoleRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FeedbackByRoleRsp {}
	}
	
	//gm回复反馈
	export class FeedbackGmReplyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		topicId:  number;//当前主题
		reply:  FeedbackReply;

		encode(writer: IWriter) {}
		decode(reader: IReader): FeedbackGmReplyRsp {}
	}
	
	//充值--请求
	export class PayOrderReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		paymentId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PayOrderReq {}
	}
	
	export class PayOrderRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		paymentId:  number;
		money:  number;
		reserved:  string;
		orderId:  string;
		sign:  string;
		time:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PayOrderRsp {}
	}
	
	//充值成功
	export class PaySuccRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		paymentId:  number;
		money:  number;
		orderId:  string;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PaySuccRsp {}
	}
	
	export class PayFirstList implements Message {
		grade:  number;
		firstPayTime:  number;
		rewarded:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PayFirstList {}
	}
	
	//充值--首充列表
	export class PayFirstListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PayFirstListReq {}
	}
	
	export class PayFirstListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		paymentIds:  number[] = [];
		list:  PayFirstList[] = [];
		firstPaySum:  number;
		paySumDay:  number;//每日充值金额
		paySum:  number;//历史充值累计

		encode(writer: IWriter) {}
		decode(reader: IReader): PayFirstListRsp {}
	}
	
	export class PayFirstUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		grade:  number[] = [];// 新增的，能够领取奖励的档次

		encode(writer: IWriter) {}
		decode(reader: IReader): PayFirstUpdateRsp {}
	}
	
	//充值--首充奖励
	export class PayFirstRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		grade:  number;// 档次，6、30、98、198
		index:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PayFirstRewardReq {}
	}
	
	export class PayFirstRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PayFirstRewardRsp {}
	}
	
	//每日首充--充值信息
	export class PayDailyFirstInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PayDailyFirstInfoReq {}
	}
	
	export class PayDailyFirstInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		worldLevel:  number;//世界等级
		payedMoney:  number;//今日已充额度
		isRewarded:  boolean;//是否已领取礼包

		encode(writer: IWriter) {}
		decode(reader: IReader): PayDailyFirstInfoRsp {}
	}
	
	//每日首充--领取礼包
	export class PayDailyFirstRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PayDailyFirstRewardReq {}
	}
	
	export class PayDailyFirstRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PayDailyFirstRewardRsp {}
	}
	
	//跨服充值--排行榜
	export class PayCrossRankReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PayCrossRankReq {}
	}
	
	export class PayCrossRankRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mine:  RankBrief;
		list:  RankBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PayCrossRankRsp {}
	}
	
	export class ActivityRankingRole implements Message {
		brief:  RoleBrief;
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityRankingRole {}
	}
	
	//活动--冲榜信息
	export class ActivityRankingInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityRankingInfoReq {}
	}
	
	export class ActivityRankingInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		top3:  ActivityRankingRole[] = [];
		history1:  number;//昨日冲榜百分比
		history2:  number;//前日冲榜百分比
		percent3:  number;//3天冲榜百分比
		rewarded3:  boolean;//3天奖励是否已领取
		percent7:  number;//7天冲榜百分比
		rewarded7:  boolean;//7天奖励是否已领取

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityRankingInfoRsp {}
	}
	
	//活动--冲榜领奖
	export class ActivityRankingRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		day:  number;//3：3天冲榜奖励 7：7天冲榜奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityRankingRewardReq {}
	}
	
	export class ActivityRankingRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		day:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityRankingRewardRsp {}
	}
	
	//活动--累计登陆列表
	export class ActivityCumloginListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCumloginListReq {}
	}
	
	export class ActivityCumloginListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		loginDays:  number;
		rewards:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCumloginListRsp {}
	}
	
	//活动--累计登陆奖励
	export class ActivityCumloginAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		loginDays:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCumloginAwardReq {}
	}
	
	export class ActivityCumloginAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCumloginAwardRsp {}
	}
	
	//活动--每月累充列表
	export class ActivityTopUpListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityTopUpListReq {}
	}
	
	export class ActivityTopUpListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		paySum:  number;
		rewards:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityTopUpListRsp {}
	}
	
	//活动--每月累冲奖励
	export class ActivityTopUpAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		paySum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityTopUpAwardReq {}
	}
	
	export class ActivityTopUpAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityTopUpAwardRsp {}
	}
	
	//活动--幸运翻牌列表
	export class ActivityFlipCardsListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityFlipCardsListReq {}
	}
	
	export class ActivityFlipCardsListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		flippedNum:  number;//已经翻牌的数目
		rewards:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityFlipCardsListRsp {}
	}
	
	//活动--幸运翻牌奖励
	export class ActivityFlipCardsAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		flippedNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityFlipCardsAwardReq {}
	}
	
	export class ActivityFlipCardsAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityFlipCardsAwardRsp {}
	}
	
	export class ActivityFlipGoods implements Message {
		index:  number;
		goods:  GoodsInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityFlipGoods {}
	}
	
	//幸运翻牌--幸运翻牌单张奖励
	export class ActivityLuckyFlipCardsAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityLuckyFlipCardsAwardReq {}
	}
	
	export class ActivityLuckyFlipCardsAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		flippedReward:  ActivityFlipGoods;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityLuckyFlipCardsAwardRsp {}
	}
	
	//幸运翻牌--信息
	export class ActivityFlipCardsInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityFlipCardsInfoReq {}
	}
	
	export class ActivityFlipCardsInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		flippedRewards:  ActivityFlipGoods[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityFlipCardsInfoRsp {}
	}
	
	export class TwistEggGoods implements Message {
		rewardType:  number;//扭蛋奖励的类型
		drop:  GoodsInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): TwistEggGoods {}
	}
	
	//活动--幸运扭蛋奖励
	export class ActivityTwistEggRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		number:  number;//扭蛋的次数

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityTwistEggRewardReq {}
	}
	
	export class ActivityTwistEggRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		reward:  TwistEggGoods;
		rewardList:  GoodsInfo[] = [];//最终的奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityTwistEggRewardRsp {}
	}
	
	//活动--幸运扭蛋信息
	export class ActivityTwistEggInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityTwistEggInfoReq {}
	}
	
	export class ActivityTwistEggInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		number:  number;//扭蛋的次数
		rewards:  TwistEggGoods[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityTwistEggInfoRsp {}
	}
	
	//活动--点金已领取次数
	export class ActivityAlchemyTimesReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityAlchemyTimesReq {}
	}
	
	export class ActivityAlchemyTimesRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		times:  number[] = [];//每字节表示一个点金次数

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityAlchemyTimesRsp {}
	}
	
	//活动--点金领取奖励
	export class ActivityAlchemyFetchReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;//从0开始

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityAlchemyFetchReq {}
	}
	
	export class ActivityAlchemyFetchRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		times:  number[] = [];
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityAlchemyFetchRsp {}
	}
	
	//活动--剩余额外次数
	export class ActivityExtraRemainReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityExtraRemainReq {}
	}
	
	export class ActivityExtraRemainRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		remainTimes:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityExtraRemainRsp {}
	}
	
	//活动--商店购买记录
	export class ActivityStoreBuyInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		activityId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityStoreBuyInfoReq {}
	}
	
	export class ActivityStoreBuyInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  StoreBuyInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityStoreBuyInfoRsp {}
	}
	
	//商店--购买
	export class ActivityStoreBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		activityId:  number;
		itemId:  number;
		itemNum:  number;//购买数量

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityStoreBuyReq {}
	}
	
	export class ActivityStoreBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  StoreBuyInfo;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityStoreBuyRsp {}
	}
	
	//活动--限时充值列表
	export class ActivityNewTopUpListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityNewTopUpListReq {}
	}
	
	export class ActivityNewTopUpListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		paySum:  number;
		rewards:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityNewTopUpListRsp {}
	}
	
	//活动--限时充值奖励
	export class ActivityNewTopUpAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		paySum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityNewTopUpAwardReq {}
	}
	
	export class ActivityNewTopUpAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityNewTopUpAwardRsp {}
	}
	
	//活动--周末福利领奖
	export class ActivityWeekendGiftReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityWeekendGiftReq {}
	}
	
	export class ActivityWeekendGiftRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		record:  number;//已领取记录
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityWeekendGiftRsp {}
	}
	
	//活动--周末福利信息
	export class ActivityWeekendGiftInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityWeekendGiftInfoReq {}
	}
	
	export class ActivityWeekendGiftInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		record:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityWeekendGiftInfoRsp {}
	}
	
	//活动--8天登陆信息
	export class ActivityLandGiftInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityLandGiftInfoReq {}
	}
	
	export class ActivityLandGiftInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		record:  number;
		day:  number;//当前累计登陆几天

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityLandGiftInfoRsp {}
	}
	
	//活动--8天登陆领奖
	export class ActivityLandGiftAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityLandGiftAwardReq {}
	}
	
	export class ActivityLandGiftAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		record:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityLandGiftAwardRsp {}
	}
	
	export class ActivityGuardianDrawLimit implements Message {
		awardId:  number;
		limit:  number;// 剩余数量

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityGuardianDrawLimit {}
	}
	
	//活动--守护者召唤有礼信息
	export class ActivityGuardianDrawInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityGuardianDrawInfoReq {}
	}
	
	export class ActivityGuardianDrawInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewarded:  number;
		drawTimes:  number;//累计召唤次数
		playerNum:  number;//符合条件的玩家数量
		limit:  ActivityGuardianDrawLimit[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityGuardianDrawInfoRsp {}
	}
	
	//活动--守护者召唤有礼领奖
	export class ActivityGuardianDrawAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		awardId:  number;//从0开始

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityGuardianDrawAwardReq {}
	}
	
	export class ActivityGuardianDrawAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewarded:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityGuardianDrawAwardRsp {}
	}
	
	//活动-矿洞大冒险结构
	export class ActivityCaveAdventure implements Message {
		layer:  number;//层数
		plate:  number;//当前位置
		passedPlate:  number[] = [];//已走过板块
		rewardedBox:  boolean;//宝箱是否领取

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveAdventure {}
	}
	
	//活动--矿洞大冒险 活动信息
	export class ActivityCaveAdventureInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveAdventureInfoReq {}
	}
	
	export class ActivityCaveAdventureInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		nowLayer:  number;//当前层
		explore:  number;//探索点
		key:  number;//钥匙数量
		layerList:  ActivityCaveAdventure[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveAdventureInfoRsp {}
	}
	
	//活动--矿洞大冒险 走格子
	export class ActivityCaveAdventureMoveReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateList:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveAdventureMoveReq {}
	}
	
	export class ActivityCaveAdventureMoveRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		newPlate:  number;
		explore:  number;//探索点
		key:  number;//钥匙数量
		awardList:  GoodsInfo[] = [];
		passedPlate:  number[] = [];//已走过板块

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveAdventureMoveRsp {}
	}
	
	//活动--矿洞大冒险 领取宝箱
	export class ActivityCaveAdventureGainBoxReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		layer:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveAdventureGainBoxReq {}
	}
	
	export class ActivityCaveAdventureGainBoxRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		goodsInfo:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveAdventureGainBoxRsp {}
	}
	
	export class ActivityAwakeGift implements Message {
		totalStar:  number;
		isCharge:  boolean;
		nowDay:  number;
		awardList:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityAwakeGift {}
	}
	
	//活动--觉醒礼包 活动信息
	export class ActivityAwakeGiftInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityAwakeGiftInfoReq {}
	}
	
	export class ActivityAwakeGiftInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		list:  ActivityAwakeGift[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityAwakeGiftInfoRsp {}
	}
	
	//活动--觉醒礼包 设置英雄
	export class ActivityAwakeGiftSetReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityAwakeGiftSetReq {}
	}
	
	export class ActivityAwakeGiftSetRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityAwakeGiftSetRsp {}
	}
	
	//活动--觉醒礼包 领取奖励
	export class ActivityAwakeGiftGainReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		totalStar:  number;
		day:  number;//0为免费奖励，1~7为天数奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityAwakeGiftGainReq {}
	}
	
	export class ActivityAwakeGiftGainRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		goodsInfo:  GoodsInfo[] = [];
		info:  ActivityAwakeGift;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityAwakeGiftGainRsp {}
	}
	
	export class ActivityDiscount implements Message {
		id:  number;// 礼包id
		times:  number;// 本日砍价次数
		discount:  number;// 已砍金额
		bought:  boolean;// 是否已购买
		payId:  number;// 今日付费砍价id
		over:  number;// 超过本服x%

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityDiscount {}
	}
	
	//砍价大礼包--状态
	export class ActivityDiscountStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityDiscountStateReq {}
	}
	
	export class ActivityDiscountStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		gifts:  ActivityDiscount[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityDiscountStateRsp {}
	}
	
	//砍价大礼包--砍价
	export class ActivityDiscountReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;// 礼包id

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityDiscountReq {}
	}
	
	export class ActivityDiscountRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		discount:  number;// 本次砍掉金额
		gift:  ActivityDiscount;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityDiscountRsp {}
	}
	
	//砍价大礼包--购买
	export class ActivityDiscountBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;// 礼包id

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityDiscountBuyReq {}
	}
	
	export class ActivityDiscountBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		goods:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityDiscountBuyRsp {}
	}
	
	//活动--灵力者集结 查看信息
	export class ActivityAssembledInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityAssembledInfoReq {}
	}
	
	export class ActivityAssembledInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		state:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityAssembledInfoRsp {}
	}
	
	//活动-灵力者集结 返回奖励
	export class ActivityAssembledGainRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		goodsInfo:  GoodsInfo[] = [];
		state:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityAssembledGainRsp {}
	}
	
	//远航寻宝-状态
	export class ActivitySailingInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivitySailingInfoReq {}
	}
	
	export class ActivitySailingInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		money:  number;// 累充金额
		mapRewarded:  number;// 已领取远航寻宝奖励
		chargeRewarded:  number;// 累充奖励序号-1（位图）
		freeRewarded:  boolean;// 是否领取今日免费奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivitySailingInfoRsp {}
	}
	
	//远航寻宝-累充奖励
	export class ActivitySailingChargeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		money:  number;// 金额档次

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivitySailingChargeReq {}
	}
	
	export class ActivitySailingChargeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		chargeRewarded:  number;// 累充奖励序号-1（位图）
		goodsList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivitySailingChargeRsp {}
	}
	
	//远航寻宝-每日免费奖励
	export class ActivitySailingFreeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivitySailingFreeReq {}
	}
	
	export class ActivitySailingFreeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		freeRewarded:  boolean;// 是否领取今日免费奖励
		goodsList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivitySailingFreeRsp {}
	}
	
	//远航寻宝-地图奖励
	export class ActivitySailingMapRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		plateId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivitySailingMapRewardReq {}
	}
	
	export class ActivitySailingMapRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		plateId:  number;
		goodsList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivitySailingMapRewardRsp {}
	}
	
	//宝藏旅馆-层
	export class ActivityHotelLayer implements Message {
		layer:  number;// 层
		num:  number;// 打扫次数

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityHotelLayer {}
	}
	
	//宝藏旅馆-状态
	export class ActivityHotelStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityHotelStateReq {}
	}
	
	export class ActivityHotelStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		cleanNum:  number;// 可用打扫次数
		freeFlag:  boolean;// 是否领取每日奖励
		layers:  ActivityHotelLayer[] = [];// 已解锁的层

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityHotelStateRsp {}
	}
	
	//宝藏旅馆-打扫
	export class ActivityHotelCleanReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityHotelCleanReq {}
	}
	
	export class ActivityHotelCleanRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		cleanNum:  number;// 可用打扫次数
		clean:  ActivityHotelLayer;// 打扫层
		goodsList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityHotelCleanRsp {}
	}
	
	//宝藏旅馆-每日免费奖励
	export class ActivityHotelFreeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityHotelFreeReq {}
	}
	
	export class ActivityHotelFreeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		freeFlag:  boolean;// 是否领取每日奖励
		goodsList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityHotelFreeRsp {}
	}
	
	export class ActivityTimeGift implements Message {
		giftId:  number;
		state:  number;// 0未购买 1已购买未领取 2已领取
		endTime:  number;// 过期时间

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityTimeGift {}
	}
	
	//活动--限时礼包 查看信息
	export class ActivityTimeGiftInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityTimeGiftInfoReq {}
	}
	
	export class ActivityTimeGiftInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  ActivityTimeGift[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityTimeGiftInfoRsp {}
	}
	
	//活动-限时礼包 领取奖励
	export class ActivityTimeGiftGainReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		giftId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityTimeGiftGainReq {}
	}
	
	//活动-限时礼包 领取奖励
	export class ActivityTimeGiftGainRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		goodsInfo:  GoodsInfo[] = [];
		state:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityTimeGiftGainRsp {}
	}
	
	//活动--神秘来客 查看信息
	export class ActivityMysteriousInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityMysteriousInfoReq {}
	}
	
	export class ActivityMysteriousInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		total:  number;//累充金额
		state:  number;//位图,从0开始

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityMysteriousInfoRsp {}
	}
	
	//活动-神秘来客 领取奖励
	export class ActivityMysteriousGainReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityMysteriousGainReq {}
	}
	
	export class ActivityMysteriousGainRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		goodsInfo:  GoodsInfo[] = [];
		state:  number;//位图

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityMysteriousGainRsp {}
	}
	
	//活动--超值购 活动信息
	export class ActivitySuperValueActInfo implements Message {
		id:  number;
		isComplete:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivitySuperValueActInfo {}
	}
	
	//活动--超值购 天数信息
	export class ActivitySuperValueDayInfo implements Message {
		day:  number;
		isGain:  boolean;
		info:  ActivitySuperValueActInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivitySuperValueDayInfo {}
	}
	
	//活动--超值购 查看信息
	export class ActivitySuperValueInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivitySuperValueInfoReq {}
	}
	
	export class ActivitySuperValueInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		infos:  ActivitySuperValueDayInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivitySuperValueInfoRsp {}
	}
	
	//活动--超值购 领取奖励
	export class ActivitySuperValueGainReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		day:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivitySuperValueGainReq {}
	}
	
	export class ActivitySuperValueGainRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		goodsInfo:  GoodsInfo[] = [];
		info:  ActivitySuperValueDayInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivitySuperValueGainRsp {}
	}
	
	//活动--超值购 提醒
	export class ActivitySuperValueNoticeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  ActivitySuperValueDayInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivitySuperValueNoticeRsp {}
	}
	
	//公会信息
	export class GuildBrief implements Message {
		id:  number;
		name:  string;
		level:  number;
		icon:  number;//图标
		frame:  number;//边框
		bottom:  number;//底框

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBrief {}
	}
	
	//公会信息
	export class GuildInfo implements Message {
		id:  number;
		name:  string;
		level:  number;
		icon:  number;//图标
		frame:  number;//边框
		bottom:  number;//底框
		num:  number;//人数
		maxPower:  number;//历史最高战力
		president:  string;//会长名称
		presidents:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildInfo {}
	}
	
	//公会成员
	export class GuildMember implements Message {
		id:  number;
		name:  string;
		head:  number;
		frame:  number;
		title0:  number;
		level:  number;
		power:  number;
		logoutTime:  number;
		vipExp:  number;
		footholdNum:  number;
		signFlag:  number;// 二进制，倒数第一位表示是否已签到，倒数第二、三位表示宝箱是否已打开
		bossNum:  number;// 公会boss挑战次数
		title:  number;// 称号

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildMember {}
		
	get VipFlag(): number {
		return 0;
	}
	get VipLv(): number {
		return 0;
	}
	}
	
	export class GuildCamper implements Message {
		pos:  number;//营地位置
		name:  string;//营地玩家

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildCamper {}
	}
	
	export class GuildCamp implements Message {
		guild:  GuildInfo;
		campers:  GuildCamper[] = [];
		sthWar:  GuildSthWar;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildCamp {}
	}
	
	//公会--公会列表
	export class GuildListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		all:  boolean;// 获取全部公会

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildListReq {}
	}
	
	export class GuildListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GuildInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildListRsp {}
	}
	
	//公会--公会详情
	export class GuildDetailReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildDetailReq {}
	}
	
	export class GuildDetailRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  GuildInfo;
		exp:  number;
		signNum:  number;
		autoJoin:  boolean;
		minLevel:  number;
		notice:  string;
		presidents:  number[] = [];
		members:  GuildMember[] = [];
		recruitNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildDetailRsp {}
	}
	
	//公会--搜索公会
	export class GuildQueryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		name:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildQueryReq {}
	}
	
	export class GuildQueryRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  GuildInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildQueryRsp {}
	}
	
	//公会--营地信息（主界面）
	export class GuildCampReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildCampReq {}
	}
	
	export class GuildCampRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		camp:  GuildCamp;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildCampRsp {}
	}
	
	//公会--创建公会
	export class GuildCreateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		name:  string;
		icon:  number;
		frame:  number;
		bottom:  number;
		costIndex:  number;// 资源的下标

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildCreateReq {}
	}
	
	export class GuildCreateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		camp:  GuildCamp;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildCreateRsp {}
	}
	
	//公会--申请加入
	export class GuildJoinReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildJoinReq {}
	}
	
	export class GuildJoinRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildId:  number;
		error:  number;//0:正常,其它引用error.xls
		minLv:  number;
		camp:  GuildCamp;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildJoinRsp {}
	}
	
	//公会--查看申请
	export class GuildRequestsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildRequestsReq {}
	}
	
	export class GuildRequestsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GuildMember[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildRequestsRsp {}
	}
	
	//公会--会长审批
	export class GuildCheckReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;//申请玩家id
		ok:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildCheckReq {}
	}
	
	export class GuildCheckRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;//申请玩家id
		ok:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildCheckRsp {}
	}
	
	//公会--退出公会
	export class GuildQuitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildQuitReq {}
	}
	
	export class GuildQuitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildQuitRsp {}
	}
	
	//公会--踢出公会
	export class GuildKickReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;//被踢玩家id

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildKickReq {}
	}
	
	export class GuildKickRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;//被踢玩家id

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildKickRsp {}
	}
	
	export class GuildUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildId:  number;//申请通过或被踢出时，通知玩家

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildUpdateRsp {}
	}
	
	//公会--设置公会审批
	export class GuildSetCheckReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		minLevel:  number;//最小申请等级,最低15级
		autoJoin:  boolean;//0:会长审批,1:自动加入

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSetCheckReq {}
	}
	
	export class GuildSetCheckRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		minLevel:  number;//最小申请等级,最低15级
		autoJoin:  boolean;//0:会长审批,1:自动加入

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSetCheckRsp {}
	}
	
	//公会--设置公会图标
	export class GuildSetIconReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		icon:  number;
		frame:  number;
		bottom:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSetIconReq {}
	}
	
	export class GuildSetIconRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		icon:  number;
		frame:  number;
		bottom:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSetIconRsp {}
	}
	
	//公会--设置公会名称
	export class GuildSetNameReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		name:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSetNameReq {}
	}
	
	export class GuildSetNameRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		name:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSetNameRsp {}
	}
	
	//公会--设置公会公告
	export class GuildSetNoticeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		notice:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSetNoticeReq {}
	}
	
	export class GuildSetNoticeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSetNoticeRsp {}
	}
	
	//公会--设置成员职位
	export class GuildSetTitleReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;
		title:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSetTitleReq {}
	}
	
	export class GuildSetTitleRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;
		title:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSetTitleRsp {}
	}
	
	//公会--设置营地位置
	export class GuildSetCampReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSetCampReq {}
	}
	
	export class GuildSetCampRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  number;
		name:  string;//如果为空，表示设置成功，否则表示被其他人占了这个位置

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSetCampRsp {}
	}
	
	//公会--签到界面
	export class GuildSignInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSignInfoReq {}
	}
	
	export class GuildSignInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		flag:  number;//二进制，倒数第一位表示是否已签到，倒数第二、三位表示宝箱是否已打开
		total:  number;
		sthWarStarted:  boolean;//公会据点战是否已开始
		sthWarFnumber:  number;//公会据点战已挑战次数

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSignInfoRsp {}
	}
	
	//公会--签到
	export class GuildSignReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSignReq {}
	}
	
	export class GuildSignRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		exp:  number;
		level:  number;
		rewards:  GoodsInfo[] = [];//签到奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSignRsp {}
	}
	
	//公会--领取签到宝箱
	export class GuildSignBoxReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSignBoxReq {}
	}
	
	export class GuildSignBoxRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		flag:  number;//同guild_sign_info.flag
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSignBoxRsp {}
	}
	
	//公会--据点战（废弃）
	export class GuildSthWar implements Message {
		started:  boolean;//是否已开启
		mapId:  number;
		endTime:  number;
		maxDfc:  number;//可选择难度
		rndSeed:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSthWar {}
	}
	
	export class GuildSthPoint implements Message {
		x:  number;//据点坐标
		y:  number;//据点坐标
		playerId:  number;//玩家Id
		occupyTime:  number;//占领时间

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSthPoint {}
	}
	
	//公会--据点战开始（废弃）
	export class GuildSthWarStartReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;//选择地图难度

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSthWarStartReq {}
	}
	
	export class GuildSthWarStartRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		sthWar:  GuildSthWar;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSthWarStartRsp {}
	}
	
	//公会--据点战详情（废弃）
	export class GuildSthWarDetailReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSthWarDetailReq {}
	}
	
	export class GuildSthWarDetailRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		chance:  number;//可挑战次数
		mapId:  number;
		points:  GuildSthPoint[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSthWarDetailRsp {}
	}
	
	//公会--据点战战斗（废弃）
	export class GuildSthWarFightReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		x:  number;//据点坐标
		y:  number;//据点坐标
		status:  number;//0:开始 1：胜利 2：失败
		heroes:  number[] = [];//上阵英雄

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSthWarFightReq {}
	}
	
	export class GuildSthWarFightRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		x:  number;//据点坐标
		y:  number;//据点坐标
		stauts:  number;//0:开始 1：胜利 2：失败
		playerId:  number;//如果该id不为空，根据status提示，0：该据点正在被XXX（玩家名字）挑战；1：该据点已被XXX（玩家名字）占领

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSthWarFightRsp {}
	}
	
	//公会--获取自己职位
	export class GuildSelfTitleReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSelfTitleReq {}
	}
	
	export class GuildSelfTitleRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildName:  string;
		title:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildSelfTitleRsp {}
	}
	
	//公会--邀请玩家加入公会
	export class GuildInviteReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;//被邀请玩家的Id

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildInviteReq {}
	}
	
	export class GuildInviteRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		isInvite:  boolean;//是否邀请成功

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildInviteRsp {}
	}
	
	//工会--接受邀请
	export class GuildAcceptInviteReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		isAccept:  boolean;//是否接受邀请
		guildId:  number;
		inviterId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildAcceptInviteReq {}
	}
	
	export class GuildAcceptInviteRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildId:  number;
		isSuccess:  boolean;//是否操作成功

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildAcceptInviteRsp {}
	}
	
	export class GuildInvitation implements Message {
		playerId:  number;//邀请人玩家ID
		playerName:  string;
		playerLv:  number;
		playerHead:  number;
		playerFrame:  number;
		playerVipExp:  number;
		guildId:  number;
		guildName:  string;
		guildIcon:  number;
		postion:  number;
		guildFrame:  number;
		guildBottom:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildInvitation {}
	}
	
	//工会--邀请信息
	export class GuildInviteInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildInviteInfoReq {}
	}
	
	export class GuildInviteInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GuildInvitation[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildInviteInfoRsp {}
	}
	
	//公会--任务列表
	export class GuildMissionListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildMissionListReq {}
	}
	
	export class GuildMissionListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		progressList:  MissionProgress[] = [];
		missionRewarded:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildMissionListRsp {}
	}
	
	//公会--任务更新
	export class GuildMissionUpdateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildMissionUpdateReq {}
	}
	
	export class GuildMissionUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		progress:  MissionProgress;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildMissionUpdateRsp {}
	}
	
	//公会--任务领奖
	export class GuildMissionRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildMissionRewardReq {}
	}
	
	export class GuildMissionRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildMissionRewardRsp {}
	}
	
	export class GuildDropGoods implements Message {
		goods:  GoodsInfo;
		count:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildDropGoods {}
	}
	
	export class GuildDropRecord implements Message {
		playerId:  number;
		playerName:  string;
		footholdNum:  number;
		allotedNum:  number;
		goods:  GoodsInfo[] = [];
		lastGoods:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildDropRecord {}
	}
	
	//公会--掉落状态（会长）
	export class GuildDropStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildDropStateReq {}
	}
	
	export class GuildDropStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		goodsList:  GuildDropGoods[] = [];
		recordList:  GuildDropRecord[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildDropStateRsp {}
	}
	
	export class GuildDropAllotItem implements Message {
		itemType:  number;
		itemNum:  number;
		subNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildDropAllotItem {}
	}
	
	export class GuildDropAllotOp implements Message {
		targetId:  number;
		items:  GuildDropAllotItem[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildDropAllotOp {}
	}
	
	//公会--掉落分配（会长）
	export class GuildDropAllotReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		operations:  GuildDropAllotOp[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildDropAllotReq {}
	}
	
	export class GuildDropAllotRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildDropAllotRsp {}
	}
	
	//公会--掉落查看（会员）
	export class GuildDropStoredReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildDropStoredReq {}
	}
	
	export class GuildDropStoredRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildDropStoredRsp {}
	}
	
	//公会--掉落领取（会员）
	export class GuildDropFetchReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildDropFetchReq {}
	}
	
	export class GuildDropFetchRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildDropFetchRsp {}
	}
	
	//公会--招募
	export class GuildRecruitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildRecruitReq {}
	}
	
	export class GuildRecruitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildRecruitRsp {}
	}
	
	//公会邮件--获取次数
	export class GuildMailTimesReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildMailTimesReq {}
	}
	
	export class GuildMailTimesRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		times:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildMailTimesRsp {}
	}
	
	//公会邮件--发送
	export class GuildMailSendReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		content:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildMailSendReq {}
	}
	
	export class GuildMailSendRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		times:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildMailSendRsp {}
	}
	
	//公会--申请通知
	export class GuildReqNoticeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildReqNoticeRsp {}
	}
	
	export class GuildLog implements Message {
		time:  number;
		type:  number;
		args:  string[] = [];
		goodsList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildLog {}
	}
	
	//公会日志--列表
	export class GuildLogListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildLogListReq {}
	}
	
	export class GuildLogListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GuildLog[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildLogListRsp {}
	}
	
	//公会日志--一键提醒
	export class GuildRemindReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;// 只有三个类型，boss、签到、据点战

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildRemindReq {}
	}
	
	export class GuildRemindRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		time:  number;// 剩余多少秒，大于0表示失败

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildRemindRsp {}
	}
	
	export class GuildAccelerateState implements Message {
		playerId:  number;
		baseId:  number;
		lv:  number;
		accelerateTimes:  number;// 加速次数
		hasAccelerated:  boolean;// 是否已加速
		isCompleted:  boolean;// 是否已完成

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildAccelerateState {}
	}
	
	//公会建筑加速--请求列表
	export class GuildAccelerateListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildAccelerateListReq {}
	}
	
	export class GuildAccelerateListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GuildAccelerateState[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildAccelerateListRsp {}
	}
	
	//公会建筑加速--加速全部
	export class GuildAccelerateAllReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildAccelerateAllReq {}
	}
	
	export class GuildAccelerateAllRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GuildAccelerateState[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildAccelerateAllRsp {}
	}
	
	//公会建筑加速--加速提醒
	export class GuildAccelerateNoticeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;
		info:  BaseInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildAccelerateNoticeRsp {}
	}
	
	//公会建筑加速--广播加速请求
	export class GuildAccelerateBroadcastRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildAccelerateBroadcastRsp {}
	}
	
	export class TavernHero implements Message {
		heroId:  number;
		typeId:  number;
		star:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): TavernHero {}
	}
	
	//酒馆任务信息
	export class TavernTask implements Message {
		index:  number;//当前任务的index
		taskId:  number;//ID
		startTime:  number;//任务开始时间，未开始是0
		quality:  number;//英雄星级
		groups:  number[] = [];//随机分组
		heroList:  TavernHero[] = [];//上阵英雄

		encode(writer: IWriter) {}
		decode(reader: IReader): TavernTask {}
	}
	
	//酒馆 -- 信息
	export class TavernInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): TavernInfoReq {}
	}
	
	export class TavernInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		doingTasks:  TavernTask[] = [];//已接受任务
		todoTasks:  TavernTask[] = [];//未接受任务
		refreshTimes:  number;//已刷新次数
		extraFlag:  number;//最低两位表示是否已领取额外紫色、橙色任务
		extraTask1:  TavernTask;
		extraTask2:  TavernTask;

		encode(writer: IWriter) {}
		decode(reader: IReader): TavernInfoRsp {}
	}
	
	//酒馆 -- 任务执行
	export class TavernTaskStartReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		todoIndex:  number;//任务任务index
		heroList:  number[] = [];//上阵英雄Id

		encode(writer: IWriter) {}
		decode(reader: IReader): TavernTaskStartReq {}
	}
	
	export class TavernTaskStartRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		todoIndex:  number;
		doingTask:  TavernTask;

		encode(writer: IWriter) {}
		decode(reader: IReader): TavernTaskStartRsp {}
	}
	
	//酒馆 -- 任务领取
	export class TavernTaskRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;//任务任务index
		isFast:  boolean;//是否快速完成
		isAll:  boolean;//领取所有任务

		encode(writer: IWriter) {}
		decode(reader: IReader): TavernTaskRewardReq {}
	}
	
	export class TavernTaskRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number[] = [];//任务任务index
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): TavernTaskRewardRsp {}
	}
	
	//酒馆 -- 任务刷新
	export class TavernTaskRefreshReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): TavernTaskRefreshReq {}
	}
	
	export class TavernTaskRefreshRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		todoTasks:  TavernTask[] = [];//酒馆任务列表

		encode(writer: IWriter) {}
		decode(reader: IReader): TavernTaskRefreshRsp {}
	}
	
	//酒馆 -- 物品统计
	export class TavernGoodsStatReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): TavernGoodsStatReq {}
	}
	
	export class TavernGoodsStatRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		addList:  GoodsInfo[] = [];//收益
		subList:  GoodsInfo[] = [];//消耗

		encode(writer: IWriter) {}
		decode(reader: IReader): TavernGoodsStatRsp {}
	}
	
	//酒馆 -- 领取额外任务
	export class TavernExtraTaskReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;//1：紫色 2：橙色

		encode(writer: IWriter) {}
		decode(reader: IReader): TavernExtraTaskReq {}
	}
	
	export class TavernExtraTaskRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		task:  TavernTask;

		encode(writer: IWriter) {}
		decode(reader: IReader): TavernExtraTaskRsp {}
	}
	
	// 为了兼容外网已有通行证的玩家，保留他们更新活动类型前的通行证有些时间
	export class PassSETime implements Message {
		startTime:  number;// 开始时间
		endTime:  number;// 结束时间
		cycle:  number;// 轮次

		encode(writer: IWriter) {}
		decode(reader: IReader): PassSETime {}
	}
	
	//通行证任务--列表
	export class PassListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PassListReq {}
	}
	
	export class PassListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		bought:  boolean;
		rewarded1:  number[] = [];
		rewarded2:  number[] = [];
		sETime:  PassSETime;

		encode(writer: IWriter) {}
		decode(reader: IReader): PassListRsp {}
	}
	
	//通行证任务--领奖
	export class PassAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PassAwardReq {}
	}
	
	export class PassAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		rewarded1:  number[] = [];
		rewarded2:  number[] = [];
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PassAwardRsp {}
	}
	
	//成长基金--列表
	export class GrowthfundListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GrowthfundListReq {}
	}
	
	export class GrowthfundListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		bought:  boolean;
		rewarded:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GrowthfundListRsp {}
	}
	
	//成长基金--领奖
	export class GrowthfundAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GrowthfundAwardReq {}
	}
	
	export class GrowthfundAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		rewarded:  number[] = [];
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GrowthfundAwardRsp {}
	}
	
	//试练塔基金--列表
	export class TowerfundListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): TowerfundListReq {}
	}
	
	export class TowerfundListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		bought:  boolean;
		rewarded:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): TowerfundListRsp {}
	}
	
	//试练塔基金--领奖
	export class TowerfundAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): TowerfundAwardReq {}
	}
	
	export class TowerfundAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		rewarded:  number[] = [];
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): TowerfundAwardRsp {}
	}
	
	export class PassFund implements Message {
		startTime:  number;
		rewardTime:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PassFund {}
	}
	
	//超值(豪华)基金--列表
	export class PassFundListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PassFundListReq {}
	}
	
	export class PassFundListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		fund1:  PassFund;
		fund2:  PassFund;

		encode(writer: IWriter) {}
		decode(reader: IReader): PassFundListRsp {}
	}
	
	//超值(豪华)基金--领取
	export class PassFundFetchReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;//1, 2

		encode(writer: IWriter) {}
		decode(reader: IReader): PassFundFetchReq {}
	}
	
	export class PassFundFetchRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		fund:  PassFund;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PassFundFetchRsp {}
	}
	
	//周卡证任务--列表
	export class PassWeeklyListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PassWeeklyListReq {}
	}
	
	export class PassWeeklyListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		bought:  boolean;
		rewarded1:  number;
		rewarded2:  number;
		sETime:  PassSETime;

		encode(writer: IWriter) {}
		decode(reader: IReader): PassWeeklyListRsp {}
	}
	
	//周卡证任务--领奖
	export class PassWeeklyAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		day:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PassWeeklyAwardReq {}
	}
	
	export class PassWeeklyAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		day:  number;
		rewarded1:  number;
		rewarded2:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PassWeeklyAwardRsp {}
	}
	
	//佣兵--查看英雄
	export class MercenaryImageReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;
		heroTypeid:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryImageReq {}
	}
	
	export class MercenaryImageRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		hero:  HeroImage;

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryImageRsp {}
	}
	
	export class MercenaryLentHero implements Message {
		index:  number;
		heroId:  number;
		startTime:  number;
		settlteTime:  number;
		settlteGold:  number;
		gainTime:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryLentHero {}
	}
	
	//佣兵--设置英雄
	export class MercenaryLendOnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryLendOnReq {}
	}
	
	export class MercenaryLendOnRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		hero:  MercenaryLentHero;

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryLendOnRsp {}
	}
	
	//佣兵--取消设置
	export class MercenaryLendOffReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryLendOffReq {}
	}
	
	export class MercenaryLendOffRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		gain:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryLendOffRsp {}
	}
	
	//佣兵--已设英雄
	export class MercenaryLentReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryLentReq {}
	}
	
	export class MercenaryLentRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  MercenaryLentHero[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryLentRsp {}
	}
	
	//佣兵--领取收益
	export class MercenaryGainReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryGainReq {}
	}
	
	export class MercenaryGainRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  MercenaryLentHero[] = [];
		gain:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryGainRsp {}
	}
	
	export class MercenaryListHero implements Message {
		playerId:  number;
		playerName:  string;
		heroPower:  number;
		heroBrief:  HeroBrief;
		lendNum:  number;//借出次数

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryListHero {}
	}
	
	//佣兵--可借英雄
	export class MercenaryListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryListReq {}
	}
	
	export class MercenaryListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  MercenaryListHero[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryListRsp {}
	}
	
	export class MercenaryBorrowedHero implements Message {
		index:  number;
		playerId:  number;
		playerName:  string;
		power:  number;
		brief:  HeroBrief;

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryBorrowedHero {}
	}
	
	//佣兵--雇佣英雄
	export class MercenaryBorrowReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;
		heroTypeid:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryBorrowReq {}
	}
	
	export class MercenaryBorrowRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		hero:  MercenaryBorrowedHero;

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryBorrowRsp {}
	}
	
	//佣兵--已借英雄
	export class MercenaryBorrowedReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryBorrowedReq {}
	}
	
	export class MercenaryBorrowedRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  MercenaryBorrowedHero[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryBorrowedRsp {}
	}
	
	//佣兵--战斗属性
	export class MercenaryFightReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		isTd:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryFightReq {}
	}
	
	export class MercenaryFightRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		hero:  FightHero;

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryFightRsp {}
	}
	
	//佣兵--取消雇佣（只限系统雇佣兵）
	export class MercenaryCancelReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryCancelReq {}
	}
	
	export class MercenaryCancelRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MercenaryCancelRsp {}
	}
	
	export class SurvivalEquipInfo implements Message {
		equipId:  number;
		equipLv:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalEquipInfo {}
	}
	
	export class SurvivalHeroesInfo implements Message {
		typeId:  number;// 0-玩家英雄，1-佣兵
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalHeroesInfo {}
	}
	
	//生存训练--副本状态
	export class SurvivalStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalStateReq {}
	}
	
	export class SurvivalStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		resetedNum:  number;
		endTime:  number;// 结束副本时间，大于0表示开放，小于当前时间表示结束
		avgHeroPower:  number;
		subType:  number;// 难度，0-普通，1-困难
		passTimes:  number;// 通关普通难度次数
		diffTimes:  number;// 通关困难难度次数
		select:  boolean;// 是否已选择
		lastBuy:  boolean;// 上一次通关之后是否有购买装备
		merRewards:  GoodsInfo[] = [];// 可领取的雇佣奖励
		heroes:  SurvivalHeroesInfo[] = [];// 上阵列表
		equips:  SurvivalEquipInfo[] = [];
		totalRewards:  GoodsInfo[] = [];// 历史奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalStateRsp {}
	}
	
	//生存训练--副本重置
	export class SurvivalResetReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		useItem:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalResetReq {}
	}
	
	//生存训练--关卡进入
	export class SurvivalEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalEnterReq {}
	}
	
	export class SurvivalEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalEnterRsp {}
	}
	
	//生存训练--关卡退出
	export class SurvivalExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		clear:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalExitReq {}
	}
	
	export class SurvivalExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		clear:  boolean;
		totalRewards:  GoodsInfo[] = [];// 历史奖励
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalExitRsp {}
	}
	
	// 生存训练--佣兵上阵
	export class SurvivalHeroOnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heros:  SurvivalHeroesInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalHeroOnReq {}
	}
	
	export class SurvivalHeroOnRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heros:  SurvivalHeroesInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalHeroOnRsp {}
	}
	
	//生存训练--装备列表
	export class SurvivalEquipPocketReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalEquipPocketReq {}
	}
	
	export class SurvivalEquipPocketRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		equipIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalEquipPocketRsp {}
	}
	
	//生存训练--装备购买
	export class SurvivalEquipBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		equipIdx:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalEquipBuyReq {}
	}
	
	export class SurvivalEquipBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		equipInfo:  SurvivalEquipInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalEquipBuyRsp {}
	}
	
	//生存训练--刷新购买装备
	export class SurvivalRefreshEquipPocketReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalRefreshEquipPocketReq {}
	}
	
	//生存训练--刷新购买装备
	export class SurvivalRefreshEquipPocketRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		equipIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalRefreshEquipPocketRsp {}
	}
	
	//生存训练--选择难度
	export class SurvivalSubTypeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		subType:  number;//难度，0-普通，1-困难

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalSubTypeReq {}
	}
	
	export class SurvivalSubTypeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		subType:  number;
		heroes:  SurvivalHeroesInfo[] = [];// 上阵列表

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalSubTypeRsp {}
	}
	
	//生存训练--扫荡
	export class SurvivalRaidReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalRaidReq {}
	}
	
	export class SurvivalRaidRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalRaidRsp {}
	}
	
	//生存训练--查看雇佣奖励
	export class SurvivalMerRewardsPreviewReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalMerRewardsPreviewReq {}
	}
	
	export class SurvivalMerRewardsPreviewRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalMerRewardsPreviewRsp {}
	}
	
	//生存训练--领取雇佣奖励
	export class SurvivalMerRewardsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalMerRewardsReq {}
	}
	
	export class SurvivalMerRewardsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalMerRewardsRsp {}
	}
	
	export class SurvivalMerRecord implements Message {
		lendId:  number;// 借出者Id
		lend:  string;// 借出者名称
		borrowId:  number;// 雇佣者Id
		borrow:  string;// 雇佣者名称
		hero:  HeroImage;// 英雄信息
		time:  number;// 时间
		rewards:  GoodsInfo[] = [];// 奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalMerRecord {}
	}
	
	//生存训练--公会雇佣记录
	export class SurvivalMerRecordReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalMerRecordReq {}
	}
	
	export class SurvivalMerRecordRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		merRewards:  GoodsInfo[] = [];// 可领取的雇佣奖励
		list:  SurvivalMerRecord[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SurvivalMerRecordRsp {}
	}
	
	export class FootholdGuild implements Message {
		id:  uint;
		name:  string;
		icon:  uint;//图标
		frame:  uint;//边框
		bottom:  uint;//底框
		level:  uint;//基地等级
		origin:  FootholdPos;//起点

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuild {}
	}
	
	export class FootholdPlayer implements Message {
		id:  uint;
		name:  string;
		level:  uint;
		head:  uint;
		headFrame:  uint;
		vipExp:  uint;
		guildId:  uint;
		power:  uint;
		titleExp:  uint;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdPlayer {}
		
	get VipFlag(): number {
		return 0;
	}

	get VipLv(): number {
		return 0;
	}
	}
	
	export class FootholdPos implements Message {
		x:  number;
		y:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdPos {}
	}
	
	export class FootholdGather implements Message {
		startTime:  number;
		teamNum:  number;
		targetPos:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGather {}
	}
	
	export class FootholdPoint implements Message {
		pos:  FootholdPos;
		status:  number;//按位表示：1:战斗中, 2:受保护, 3：驻守中，4：集结中
		statusEndtime:  uint;//只对 战斗中,受保护 有效
		playerId:  uint;//占领玩家id
		guildId:  uint;//占领公会id
		bossHp:  uint;
		gather:  FootholdGather;//当状态包含集结中时有效

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdPoint {}
	}
	
	//据点战--查询玩家
	export class FootholdLookupPlayerReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdLookupPlayerReq {}
	}
	
	export class FootholdLookupPlayerRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		player:  FootholdPlayer;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdLookupPlayerRsp {}
	}
	
	//据点战--查询公会
	export class FootholdLookupGuildReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdLookupGuildReq {}
	}
	
	export class FootholdLookupGuildRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guild:  FootholdGuild;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdLookupGuildRsp {}
	}
	
	//红点提示
	export class FootholdRedPoints implements Message {
		warId:  number;
		mapId:  number;
		mapType:  number;
		points:  FootholdPos[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdRedPoints {}
	}
	
	//据点战--红点提示
	export class FootholdRedPointsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdRedPointsReq {}
	}
	
	export class FootholdRedPointsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		broadcast:  boolean;
		list:  FootholdRedPoints[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdRedPointsRsp {}
	}
	
	//据点战--角色相关信息
	export class FootholdRoleInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdRoleInfoReq {}
	}
	
	export class FootholdRoleInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		energy:  number;
		recoverTime:  number;
		worldLevel:  number;
		worldLevelIdx:  number;
		activityType:  number;
		activityIndex:  number;
		startTime:  number;
		endTime:  number;
		energyBought:  number;//已购买体力次数
		rewardedBaseLevel:  number;//已领奖基地等级奖励
		guessRewarded:  number;//竞猜已领奖状态，从低到高按位表示:每日免费奖励，第一轮到第n轮奖励
		guessOpened:  boolean;//竞猜活动已开启
		guessRedPoints:  number;
		missionExp:  number;
		freeEnergy:  number;//已领取的免费体力
		freeEnergyBase:  number;//已领取的免费体力（基地领取）
		coopGuildId:  number;
		coopInviteNum:  number;//协战受邀次数
		coopApplyNum:  number;//协战审批次数
		coopStartTime:  number;//协战开始时间

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdRoleInfoRsp {}
	}
	
	//据点战--进入地图
	export class FootholdMapEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdMapEnterReq {}
	}
	
	export class FootholdMapEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapId:  number;
		mapType:  number;
		rndSeed:  number;
		fightingPos:  FootholdPos;
		guilds:  FootholdGuild[] = [];
		players:  FootholdPlayer[] = [];
		points:  FootholdPoint[] = [];
		towers:  number[] = [];
		worldLevelIdx:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdMapEnterRsp {}
	}
	
	//据点战--退出地图
	export class FootholdMapExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdMapExitReq {}
	}
	
	export class FootholdMapExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdMapExitRsp {}
	}
	
	//据点战--公会加入
	export class FootholdGuildJoinRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guild:  FootholdGuild;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuildJoinRsp {}
	}
	
	//据点战--玩家加入
	export class FootholdPlayerJoinRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		player:  FootholdPlayer;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdPlayerJoinRsp {}
	}
	
	export class FootholdDamage implements Message {
		playerId:  number;
		damage:  uint32;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdDamage {}
	}
	
	//据点战--据点详情
	export class FootholdPointDetailReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		pos:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdPointDetailReq {}
	}
	
	export class FootholdPointDetailRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;
		bossId:  number;
		bossHp:  number;
		needEnergy:  number;
		resetTime:  number;
		damageList:  FootholdDamage[] = [];
		scoreRewarded:  boolean;
		isChallenged:  boolean;
		titleExp:  number;//玩家的军衔经验

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdPointDetailRsp {}
	}
	
	//据点战--据点积分奖励
	export class FootholdPointScoreReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		posList:  FootholdPos[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdPointScoreReq {}
	}
	
	export class FootholdPointScoreRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		posList:  FootholdPos[] = [];
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdPointScoreRsp {}
	}
	
	//据点战--查看对手
	export class FootholdFightQueryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		pos:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdFightQueryReq {}
	}
	
	export class FootholdFightQueryRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		pos:  FootholdPos;
		playerId:  number;
		guildId:  number;
		resetTime:  number;
		heroList:  FightDefendHero[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdFightQueryRsp {}
	}
	
	//据点战--战斗开始
	export class FootholdFightStartReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		pos:  FootholdPos;
		pveId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdFightStartReq {}
	}
	
	export class FootholdFightStartRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		pos:  FootholdPos;
		bossHp:  number;
		playerHp:  number;
		heroList:  FightHero[] = [];
		general:  FightGeneral;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdFightStartRsp {}
	}
	
	//据点战--战斗结束
	export class FootholdFightOverReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		pos:  FootholdPos;
		bossDmg:  uint32;
		playerDmg:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdFightOverReq {}
	}
	
	export class FootholdFightOverRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		pos:  FootholdPos;
		energy:  number;
		baseExp:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdFightOverRsp {}
	}
	
	//据点战--战斗广播
	export class FootholdFightBroadcastRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		point:  FootholdPoint;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdFightBroadcastRsp {}
	}
	
	//据点战--前6名通关公会
	export class FootholdTop6GuildReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdTop6GuildReq {}
	}
	
	export class FootholdTop6GuildRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		broadcast:  boolean;
		remain:  number;
		list:  FootholdGuild[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdTop6GuildRsp {}
	}
	
	//据点战--boss被击杀
	export class FootholdBossKilledRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		pos:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdBossKilledRsp {}
	}
	
	//据点战--删除红点
	export class FootholdCancelRedpointReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		pos:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCancelRedpointReq {}
	}
	
	export class FootholdCancelRedpointRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		pos:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCancelRedpointRsp {}
	}
	
	export class FootholdRankingGuild implements Message {
		id:  number;
		name:  string;
		icon:  number;//图标
		frame:  number;//边框
		bottom:  number;//底框
		clearNum:  number;//通关数量
		joinNum:  number;//参与人数

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdRankingGuild {}
	}
	
	//据点战--第一层排行
	export class FootholdRankingReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdRankingReq {}
	}
	
	export class FootholdRankingRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  FootholdRankingGuild[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdRankingRsp {}
	}
	
	//据点战--查看地图进度
	export class FootholdMapProgressReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdMapProgressReq {}
	}
	
	export class FootholdMapProgressRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		clearNum:  number;
		totalNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdMapProgressRsp {}
	}
	
	//据点战--查看地图排名
	export class FootholdMapRankingReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdMapRankingReq {}
	}
	
	export class FootholdMapRankingRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rank:  number;
		score:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdMapRankingRsp {}
	}
	
	//据点战--购买体力
	export class FootholdBuyEnergyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		number:  number;//购买次数

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdBuyEnergyReq {}
	}
	
	export class FootholdBuyEnergyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		bought:  number;//已购买次数
		energy:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdBuyEnergyRsp {}
	}
	
	//据点战--领取基地奖励
	export class FootholdBaseRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdBaseRewardReq {}
	}
	
	export class FootholdBaseRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		level:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdBaseRewardRsp {}
	}
	
	//据点战--获取基地等级
	export class FootholdBaseLevelReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		guildId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdBaseLevelReq {}
	}
	
	export class FootholdBaseLevelRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildId:  number;
		level:  number;
		exp:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdBaseLevelRsp {}
	}
	
	export class FootholdPointOutput implements Message {
		pos:  FootholdPos;
		exp:  number;
		items:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdPointOutput {}
	}
	
	//据点战--查看产出
	export class FootholdListOutputReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		pos:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdListOutputReq {}
	}
	
	export class FootholdListOutputRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  FootholdPointOutput[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdListOutputRsp {}
	}
	
	//据点战--提取产出
	export class FootholdTakeOutputReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		pos:  FootholdPos;
		all:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdTakeOutputReq {}
	}
	
	export class FootholdTakeOutputRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;
		all:  boolean;
		exp:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdTakeOutputRsp {}
	}
	
	//据点战--放弃据点
	export class FootholdGiveUpReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		pos:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGiveUpReq {}
	}
	
	export class FootholdGiveUpRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;
		exp:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGiveUpRsp {}
	}
	
	//据点战--占领据点
	export class FootholdCatchUpReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		warId:  number;
		pos:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCatchUpReq {}
	}
	
	export class FootholdCatchUpRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCatchUpRsp {}
	}
	
	export class LastRankGuild implements Message {
		id:  number;
		name:  string;
		level:  number;
		icon:  number;//图标
		frame:  number;//边框
		bottom:  number;//底框
		score:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): LastRankGuild {}
	}
	
	//据点战--公会上周战场排名
	export class FootholdLastRankReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdLastRankReq {}
	}
	
	export class FootholdLastRankRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		worldLevelLast:  number;//上次活动世界等级序号
		guilds:  LastRankGuild[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdLastRankRsp {}
	}
	
	export class FootholdGuide implements Message {
		eventId:  number;
		number:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuide {}
	}
	
	//据点战--引导提交
	export class FootholdGuideCommitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guide:  FootholdGuide;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuideCommitReq {}
	}
	
	export class FootholdGuideCommitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuideCommitRsp {}
	}
	
	//据点战--引导查询
	export class FootholdGuideQueryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuideQueryReq {}
	}
	
	export class FootholdGuideQueryRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildList:  FootholdGuide[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuideQueryRsp {}
	}
	
	export class FootholdGuessGuild implements Message {
		id:  number;
		name:  string;
		icon:  number;//图标
		frame:  number;//边框
		bottom:  number;//底框
		maxPower:  number;//历史最高战力
		president:  string;//会长名称
		votes:  number;
		score:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuessGuild {}
	}
	
	//据点战竞猜--查看
	export class FootholdGuessQueryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		day:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuessQueryReq {}
	}
	
	export class FootholdGuessQueryRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guessType:  number;
		votedId:  number;
		votedPoints:  number;
		winnerId:  number;
		guilds:  FootholdGuessGuild[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuessQueryRsp {}
	}
	
	//据点战竞猜--选择
	export class FootholdGuessVoteReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildId:  number;
		votedPoints:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuessVoteReq {}
	}
	
	export class FootholdGuessVoteRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildId:  number;
		votedPoints:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuessVoteRsp {}
	}
	
	//据点战竞猜--领奖
	export class FootholdGuessRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;//1 免费奖励 2 竞猜奖励
		day:  number;//2

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuessRewardReq {}
	}
	
	export class FootholdGuessRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		day:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuessRewardRsp {}
	}
	
	//据点战--免费体力领取
	export class FootholdFreeEnergyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		isAll:  boolean;//是否全部领取
		warId:  number;//领取基地免费体力传递所在战场id

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdFreeEnergyReq {}
	}
	
	export class FootholdFreeEnergyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		freeEnergy:  number;//已领取能量数
		energy:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdFreeEnergyRsp {}
	}
	
	//据点战--公会联盟
	export class FootholdAllianceReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdAllianceReq {}
	}
	
	export class FootholdAllianceRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		alliance1:  number[] = [];
		alliance2:  number[] = [];
		alliance3:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdAllianceRsp {}
	}
	
	export class FootholdAtkFlag implements Message {
		pos:  FootholdPos;
		msg:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdAtkFlag {}
	}
	
	//据点战--查看进攻标志
	export class FootholdAtkFlagGetReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdAtkFlagGetReq {}
	}
	
	export class FootholdAtkFlagGetRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		flags:  FootholdAtkFlag[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdAtkFlagGetRsp {}
	}
	
	//据点战--设置进攻标志
	export class FootholdAtkFlagSetReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;
		msg:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdAtkFlagSetReq {}
	}
	
	export class FootholdAtkFlagSetRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdAtkFlagSetRsp {}
	}
	
	//据点战--删除进攻标志
	export class FootholdAtkFlagDelReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdAtkFlagDelReq {}
	}
	
	export class FootholdAtkFlagDelRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdAtkFlagDelRsp {}
	}
	
	//据点战--联盟聊天记录
	export class FootholdAChatHisReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdAChatHisReq {}
	}
	
	export class FootholdAChatHisRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdAChatHisRsp {}
	}
	
	export class FootholdFightRecord implements Message {
		fightTime:  number;
		attackerId:  number;
		attackerName:  string;
		attackerGuild:  string;
		remainPercent:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdFightRecord {}
	}
	
	//据点战--联盟聊天记录
	export class FootholdFightRecordsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;
		ownerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdFightRecordsReq {}
	}
	
	export class FootholdFightRecordsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  FootholdFightRecord[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdFightRecordsRsp {}
	}
	
	export class FootholdTeamBrief implements Message {
		playerId:  number;
		joinedNum:  number;
		joined:  boolean;
		roleBrief:  RoleBrief;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdTeamBrief {}
	}
	
	export class FootholdTeamFighter implements Message {
		index:  number;
		id:  number;
		name:  string;
		hp:  number;
		vipExp:  number;
		head:  number;
		frame:  number;
		heroList:  FightHero[] = [];
		general:  FightGeneral;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdTeamFighter {}
	}
	
	//据点战--集结发起(FootholdGatherBriefRsp）
	export class FootholdGatherInitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		from:  FootholdPos;
		to:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherInitReq {}
	}
	
	//据点战--集结查看玩家
	export class FootholdGatherBriefReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherBriefReq {}
	}
	
	export class FootholdGatherBriefRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  FootholdTeamBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherBriefRsp {}
	}
	
	export class FootholdGatherTeammate implements Message {
		index:  number;
		brief:  RoleBrief;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherTeammate {}
	}
	
	//据点战--集结查看队伍
	export class FootholdGatherTeamReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherTeamReq {}
	}
	
	export class FootholdGatherTeamRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  FootholdGatherTeammate[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherTeamRsp {}
	}
	
	//据点战--集结取消
	export class FootholdGatherCancelReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherCancelReq {}
	}
	
	export class FootholdGatherCancelRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherCancelRsp {}
	}
	
	//据点战--集结邀请
	export class FootholdGatherInviteReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;
		targetId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherInviteReq {}
	}
	
	export class FootholdGatherInviteRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherInviteRsp {}
	}
	
	export class FootholdGatherInviter implements Message {
		brief:  RoleBrief;
		pos:  FootholdPos;
		pointType:  number;
		teamNum:  number;
		initTime:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherInviter {}
	}
	
	//据点战--集结邀请者列表
	export class FootholdGatherInvitersReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;//1：请求数量 2：请求信息

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherInvitersReq {}
	}
	
	export class FootholdGatherInvitersRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		num:  number;//-1：收到通知
		list:  FootholdGatherInviter[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherInvitersRsp {}
	}
	
	//据点战--集结拒绝邀请
	export class FootholdGatherRefuseReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;
		all:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherRefuseReq {}
	}
	
	export class FootholdGatherRefuseRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;
		all:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherRefuseRsp {}
	}
	
	//据点战--集结加入
	export class FootholdGatherJoinReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;
		index:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherJoinReq {}
	}
	
	export class FootholdGatherJoinRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherJoinRsp {}
	}
	
	export class FootholdGatherPoint implements Message {
		pos:  FootholdPos;
		pointType:  number;
		teamNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherPoint {}
	}
	
	//据点战--集结据点列表
	export class FootholdGatherPointsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;//1：请求数量 2：请求信息

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherPointsReq {}
	}
	
	export class FootholdGatherPointsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		num:  number;//-1：收到通知
		list:  FootholdGatherPoint[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherPointsRsp {}
	}
	
	//据点战--集结挑战开始
	export class FootholdGatherFightStartReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;
		typ:  number;//1：Pos为集结点 2：Pos为目标点

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherFightStartReq {}
	}
	
	export class FootholdGatherFightStartRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		teammates:  FootholdTeamFighter[] = [];
		opponents:  FootholdTeamFighter[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherFightStartRsp {}
	}
	
	export class FootholdGatherFightValue implements Message {
		playerId:  number;
		value:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherFightValue {}
	}
	
	//据点战--集结挑战结束
	export class FootholdGatherFightOverReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;//集结者序号: 0, 1, 2, 3...（防止前端重复）,-1表示放弃
		pos:  FootholdPos;
		typ:  number;//1：Pos为集结点 2：Pos为目标点
		damage:  FootholdGatherFightValue;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherFightOverReq {}
	}
	
	export class FootholdGatherFightOverRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;
		energy:  number;
		baseExp:  number;
		list:  GoodsInfo[] = [];
		newHPs:  FootholdGatherFightValue[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGatherFightOverRsp {}
	}
	
	//据点战--驻守发起(返回FootholdGuardBriefRsp）
	export class FootholdGuardInitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardInitReq {}
	}
	
	//据点战--驻守查看玩家
	export class FootholdGuardBriefReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardBriefReq {}
	}
	
	export class FootholdGuardBriefRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  FootholdTeamBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardBriefRsp {}
	}
	
	export class FootholdGuardTeammate implements Message {
		index:  number;
		id:  number;
		name:  string;
		hp:  number;
		vipExp:  number;
		heroes:  HeroBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardTeammate {}
	}
	
	//据点战--驻守查看队伍
	export class FootholdGuardTeamReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;
		includeOwner:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardTeamReq {}
	}
	
	export class FootholdGuardTeamRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  FootholdGuardTeammate[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardTeamRsp {}
	}
	
	//据点战--驻守取消
	export class FootholdGuardCancelReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardCancelReq {}
	}
	
	export class FootholdGuardCancelRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardCancelRsp {}
	}
	
	//据点战--驻守邀请
	export class FootholdGuardInviteReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;
		targetId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardInviteReq {}
	}
	
	export class FootholdGuardInviteRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardInviteRsp {}
	}
	
	export class FootholdGuardInviter implements Message {
		brief:  RoleBrief;
		pos:  FootholdPos;
		pointType:  number;
		teamNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardInviter {}
	}
	
	//据点战--驻守邀请者列表
	export class FootholdGuardInvitersReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;//1：请求数量 2：请求信息

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardInvitersReq {}
	}
	
	export class FootholdGuardInvitersRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		num:  number;//-1：收到通知
		list:  FootholdGuardInviter[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardInvitersRsp {}
	}
	
	//据点战--驻守拒绝邀请
	export class FootholdGuardRefuseReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;
		all:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardRefuseReq {}
	}
	
	export class FootholdGuardRefuseRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;
		all:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardRefuseRsp {}
	}
	
	//据点战--驻守加入
	export class FootholdGuardJoinReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  FootholdPos;
		index:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardJoinReq {}
	}
	
	export class FootholdGuardJoinRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdGuardJoinRsp {}
	}
	
	export class FootholdRankPlayer implements Message {
		brief:  RoleBrief;
		score:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdRankPlayer {}
	}
	
	//据点战--战斗次数排行榜
	export class FootholdFightRankReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdFightRankReq {}
	}
	
	export class FootholdFightRankRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rankList:  FootholdRankPlayer[] = [];
		rankMine:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdFightRankRsp {}
	}
	
	export class FootholdCoopGuild implements Message {
		guildInfo:  LastRankGuild;
		joinNum:  number;
		coopNum:  number;
		coopMax:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopGuild {}
	}
	
	//据点战--协战公会信息
	export class FootholdCoopGuildListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopGuildListReq {}
	}
	
	export class FootholdCoopGuildListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildList:  FootholdCoopGuild[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopGuildListRsp {}
	}
	
	//据点战--协战玩家排名
	export class FootholdCoopRankListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopRankListReq {}
	}
	
	export class FootholdCoopRankListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rankList:  FootholdCoopPlayer[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopRankListRsp {}
	}
	
	export class FootholdCoopPlayer implements Message {
		roleBrief:  RoleBrief;
		guildBrief:  GuildBrief;
		guildTitle:  number;
		score:  number;//贡献积分
		number:  number;//战斗次数

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopPlayer {}
	}
	
	//据点战--协战招募列表
	export class FootholdCoopPlayerListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		count:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopPlayerListReq {}
	}
	
	export class FootholdCoopPlayerListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pubTime:  number;//上次发布招募时间
		coopMax:  number;//公会协战人数上限
		index:  number;
		total:  number;
		list:  FootholdCoopPlayer[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopPlayerListRsp {}
	}
	
	//据点战--协战招募
	export class FootholdCoopInviteAskReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopInviteAskReq {}
	}
	
	export class FootholdCoopInviteAskRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopInviteAskRsp {}
	}
	
	//据点战--协战招募通知
	export class FootholdCoopInviteNoticeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		number:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopInviteNoticeRsp {}
	}
	
	//据点战--协战招募公会
	export class FootholdCoopInviteGuildsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopInviteGuildsReq {}
	}
	
	export class FootholdCoopInviteGuildsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guilds:  FootholdCoopGuild[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopInviteGuildsRsp {}
	}
	
	//据点战--协战招募应答
	export class FootholdCoopInviteAnswerReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildId:  number;//0表示一键拒绝，Agree必须为false
		agree:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopInviteAnswerReq {}
	}
	
	export class FootholdCoopInviteAnswerRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildId:  number;//0表示一键拒绝，Agree必须为false
		agree:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopInviteAnswerRsp {}
	}
	
	//据点战--协战申请
	export class FootholdCoopApplyAskReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopApplyAskReq {}
	}
	
	export class FootholdCoopApplyAskRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildId:  number;
		autoJoin:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopApplyAskRsp {}
	}
	
	//据点战--协战申请通知
	export class FootholdCoopApplyNoticeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		number:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopApplyNoticeRsp {}
	}
	
	//据点战--协战申请玩家
	export class FootholdCoopApplyPlayersReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopApplyPlayersReq {}
	}
	
	export class FootholdCoopApplyPlayersRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		players:  FootholdCoopPlayer[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopApplyPlayersRsp {}
	}
	
	//据点战--协战申请应答
	export class FootholdCoopApplyAnswerReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;//0表示一键拒绝，Agree必须为false
		agree:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopApplyAnswerReq {}
	}
	
	export class FootholdCoopApplyAnswerRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;//0表示一键拒绝，Agree必须为false
		agree:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopApplyAnswerRsp {}
	}
	
	//据点战--协战申请设置
	export class FootholdCoopApplySettingReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		title:  number;//-1:查看 0:自动 4:队长以上审批 7:副会长以上审批 8:会长以上审批
		power:  number;
		level:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopApplySettingReq {}
	}
	
	export class FootholdCoopApplySettingRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		title:  number;//0:自动 4:队长以上审批 7:副会长以上审批 8:会长以上审批
		power:  number;
		level:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopApplySettingRsp {}
	}
	
	//据点战--协战参战人员列表
	export class FootholdCoopGuildMembersReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopGuildMembersReq {}
	}
	
	export class FootholdCoopGuildMembersRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guildId:  number;
		members:  FootholdCoopPlayer[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopGuildMembersRsp {}
	}
	
	//据地战--协战发布招募
	export class FootholdCoopGuildPublishReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopGuildPublishReq {}
	}
	
	export class FootholdCoopGuildPublishRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdCoopGuildPublishRsp {}
	}
	
	export class FootholdPoint2 implements Message {
		pos:  FootholdPos;
		status:  number;//按位表示：1:战斗中, 2:受保护, 3：驻守中，4：集结中
		statusEndtime:  uint;//只对 战斗中,受保护 有效
		playerIdx:  number;//占领玩家id
		guildIdx:  number;//占领公会id
		bossHp:  uint;
		gather:  FootholdGather;//当状态包含集结中时有效

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdPoint2 {}
	}
	
	//据点战--进入地图2
	export class FootholdMapEnter2Rsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapId:  number;
		mapType:  number;
		rndSeed:  number;
		fightingPos:  FootholdPos;
		guilds:  FootholdGuild[] = [];
		players:  FootholdPlayer[] = [];
		points:  FootholdPoint2[] = [];
		towers:  number[] = [];
		worldLevelIdx:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FootholdMapEnter2Rsp {}
	}
	
	export class ActivityCaveTeam implements Message {
		index:  number;// 队列数组下标
		chapterId:  number;// 探索的章节id
		startTime:  number;// 探索开始时间
		heroIds:  number[] = [];// 英雄id

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveTeam {}
	}
	
	export class ActivityCaveGift implements Message {
		giftId:  number;// 天赋id
		level:  number;// 等级

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveGift {}
	}
	
	export class ActivityCaveExchange implements Message {
		exchangeId:  number;// 兑换id
		times:  number;// 次数

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveExchange {}
	}
	
	//矿洞大作战--查询矿洞信息
	export class ActivityCaveStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveStateReq {}
	}
	
	export class ActivityCaveStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 已通过的最高关卡
		buyTeam:  number;// 购买队列数量
		team:  ActivityCaveTeam[] = [];// 队列信息
		gift:  ActivityCaveGift[] = [];// 已点击的天赋
		exchange:  ActivityCaveExchange[] = [];// 兑换次数

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveStateRsp {}
	}
	
	//矿洞大作战--进入关卡
	export class ActivityCaveEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveEnterReq {}
	}
	
	export class ActivityCaveEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveEnterRsp {}
	}
	
	//矿洞大作战--退出关卡
	export class ActivityCaveExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id
		clear:  boolean;// 成功失败

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveExitReq {}
	}
	
	export class ActivityCaveExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveExitRsp {}
	}
	
	//矿洞大作战--点击天赋
	export class ActivityCaveGiftReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		giftId:  number;// 天赋

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveGiftReq {}
	}
	
	export class ActivityCaveGiftRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		giftId:  number;// 天赋
		level:  number;// 等级

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveGiftRsp {}
	}
	
	//矿洞大作战--重置天赋
	export class ActivityCaveResetGiftReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		page:  number;// 重置第几页

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveResetGiftReq {}
	}
	
	export class ActivityCaveResetGiftRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveResetGiftRsp {}
	}
	
	//矿洞大作战--获取探索的品质
	export class ActivityCaveExploreColorReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		chapterId:  number;// 探索的章节id

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveExploreColorReq {}
	}
	
	export class ActivityCaveExploreColorRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		colorId:  number;// 品质，1-绿,2-蓝,3-紫,4-金
		groupIds:  number[] = [];// 随机阵营

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveExploreColorRsp {}
	}
	
	//矿洞大作战--开始探索
	export class ActivityCaveStartExploreReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		chapterId:  number;// 探索的章节id
		heroIds:  number[] = [];// 英雄id

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveStartExploreReq {}
	}
	
	export class ActivityCaveStartExploreRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;// 队列数组下标
		chapterId:  number;// 探索的章节id
		startTime:  number;// 探索开始时间
		heroIds:  number[] = [];// 英雄id

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveStartExploreRsp {}
	}
	
	//矿洞大作战--结束探索
	export class ActivityCaveEndExploreReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		chapterId:  number;// 探索的章节id

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveEndExploreReq {}
	}
	
	export class ActivityCaveEndExploreRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveEndExploreRsp {}
	}
	
	//矿洞大作战--兑换
	export class ActivityCaveExchangeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		exchangeId:  number;// 兑换id

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveExchangeReq {}
	}
	
	export class ActivityCaveExchangeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveExchangeRsp {}
	}
	
	//矿洞大作战--购买队列
	export class ActivityCaveBuyTeamReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveBuyTeamReq {}
	}
	
	export class ActivityCaveBuyTeamRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		buyTeam:  number;// 购买的队列数

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveBuyTeamRsp {}
	}
	
	//通行证--列表
	export class ActivityCavePassListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCavePassListReq {}
	}
	
	export class ActivityCavePassListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		bought:  boolean;
		rewarded1:  number[] = [];
		rewarded2:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCavePassListRsp {}
	}
	
	//通行证--领奖
	export class ActivityCavePassAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCavePassAwardReq {}
	}
	
	export class ActivityCavePassAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		rewarded1:  number[] = [];
		rewarded2:  number[] = [];
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCavePassAwardRsp {}
	}
	
	//矿洞大作战--回退天赋
	export class ActivityCaveGiftBackReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		giftId:  number;// 天赋

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveGiftBackReq {}
	}
	
	export class ActivityCaveGiftBackRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		giftId:  number;// 天赋
		level:  number;// 等级

		encode(writer: IWriter) {}
		decode(reader: IReader): ActivityCaveGiftBackRsp {}
	}
	
	export class BountyMission implements Message {
		missionId:  number;
		stageId:  number;
		endTime:  number;
		gemsNum:  number;
		minPower:  number;
		pubPower:  number;
		publisher:  string;
		committer:  string;
		heroList:  HeroBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyMission {}
	}
	
	//赏金--任务列表
	export class BountyListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyListReq {}
	}
	
	export class BountyListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  BountyMission[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyListRsp {}
	}
	
	//赏金--发布任务
	export class BountyPublishReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionType:  number;//任务类型（决定所需消耗，结束时间）
		notice:  string;//广播内容

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyPublishReq {}
	}
	
	export class BountyPublishRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyPublishRsp {}
	}
	
	//赏金--我的求助
	export class BountyMineReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyMineReq {}
	}
	
	export class BountyMineRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionId:  number;
		missionType:  number;//任务类型
		stageId:  number;
		endTime:  number;
		notice:  string;//广播内容
		publishedFreeNum:  number;//使用钻石发布的次数
		finishedFreeNum:  number;//完成钻石发布的次数

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyMineRsp {}
	}
	
	//赏金--刷新英雄
	export class BountyRefreshReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyRefreshReq {}
	}
	
	export class BountyRefreshRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyRefreshRsp {}
	}
	
	//赏金--查询英雄
	export class BountyFightQueryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionId:  number;
		heroTypeIds:  number[] = [];
		general:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyFightQueryReq {}
	}
	
	export class BountyFightQueryRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionId:  number;
		heroList:  FightHero[] = [];
		general:  FightGeneral;

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyFightQueryRsp {}
	}
	
	//赏金--战斗开始
	export class BountyFightStartReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyFightStartReq {}
	}
	
	export class BountyFightStartRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionId:  number;
		endTime:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyFightStartRsp {}
	}
	
	//赏金--战斗结束
	export class BountyFightOverReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionId:  number;
		clear:  boolean;//是否通关
		heroIds:  number[] = [];
		rndSeed:  number;
		actions:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyFightOverReq {}
	}
	
	export class BountyFightOverRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionId:  number;
		clear:  boolean;
		invalid:  boolean;//是否已失效

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyFightOverRsp {}
	}
	
	//赏金--任务完成
	export class BountyCompleteRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionId:  number;
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyCompleteRsp {}
	}
	
	//赏金--任务数量
	export class BountyListNumReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyListNumReq {}
	}
	
	export class BountyListNumRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		num:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyListNumRsp {}
	}
	
	export class StagePower implements Message {
		stageId:  number;
		minPower:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): StagePower {}
	}
	
	//赏金--查看任务
	export class BountyQueryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyQueryReq {}
	}
	
	export class BountyQueryRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mission:  BountyMission;

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyQueryRsp {}
	}
	
	//赏金--战斗回放
	export class BountyFightReplyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyFightReplyReq {}
	}
	
	export class BountyFightReplyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroList:  FightHero[] = [];
		general:  FightGeneral;
		stageId:  number;
		heroIds:  number[] = [];
		randSeed:  number;
		actions:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): BountyFightReplyRsp {}
	}
	
	export class DoomsDayInfo implements Message {
		subType:  number;// 子类型
		stageId:  number;// 子类型关卡中最高通过关卡id
		num:  number;// 已扫荡次数

		encode(writer: IWriter) {}
		decode(reader: IReader): DoomsDayInfo {}
	}
	
	//末日考验--列表
	export class DoomsDayListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): DoomsDayListReq {}
	}
	
	export class DoomsDayListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  DoomsDayInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DoomsDayListRsp {}
	}
	
	//末日考验--进入
	export class DoomsDayEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DoomsDayEnterReq {}
	}
	
	export class DoomsDayEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DoomsDayEnterRsp {}
	}
	
	//末日考验--退出
	export class DoomsDayExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		clear:  boolean;// 成功失败

		encode(writer: IWriter) {}
		decode(reader: IReader): DoomsDayExitReq {}
	}
	
	export class DoomsDayExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DoomsDayExitRsp {}
	}
	
	//末日考验--扫荡指定关卡
	export class DoomsDayRaidsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DoomsDayRaidsReq {}
	}
	
	export class DoomsDayRaidsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DoomsDayRaidsRsp {}
	}
	
	//末日考验--一键扫荡
	export class DoomsDayQuickRaidsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		subType:  number;// 子类型

		encode(writer: IWriter) {}
		decode(reader: IReader): DoomsDayQuickRaidsReq {}
	}
	
	export class DoomsDayQuickRaidsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		subType:  number;// 子类型
		stageId:  number;// 扫荡的关卡
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DoomsDayQuickRaidsRsp {}
	}
	
	export class BattleArrayQuery implements Message {
		type:  number;//1-塔防 2-竞技场 3-据点战 4-战争遗迹 5-锦标赛 6-组队竞技场 7-荣耀巅峰赛 8-终极副本 9-皇家竞技场
		heroIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): BattleArrayQuery {}
	}
	
	//战斗--查看阵容
	export class BattleArrayQueryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		types:  number[] = [];// 查询指定阵容

		encode(writer: IWriter) {}
		decode(reader: IReader): BattleArrayQueryReq {}
	}
	
	export class BattleArrayQueryRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroes:  BattleArrayQuery[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): BattleArrayQueryRsp {}
	}
	
	//战斗--设置阵容
	export class BattleArraySetReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		heroIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): BattleArraySetReq {}
	}
	
	export class BattleArraySetRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		heroIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): BattleArraySetRsp {}
	}
	
	//战斗--一键下阵某个英雄，推送BattleArrayQueryRsp，只返回有改动的阵容
	export class BattleArrayOffReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BattleArrayOffReq {}
	}
	
	//武魂试炼--状态
	export class MartialSoulStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MartialSoulStateReq {}
	}
	
	export class MartialSoulStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageIds:  number[] = [];// 已通过的关卡

		encode(writer: IWriter) {}
		decode(reader: IReader): MartialSoulStateRsp {}
	}
	
	//武魂试炼--进入战斗
	export class MartialSoulEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MartialSoulEnterReq {}
	}
	
	export class MartialSoulEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		minPower:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MartialSoulEnterRsp {}
	}
	
	//武魂试炼--退出战斗
	export class MartialSoulExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		clear:  boolean;// 成功失败
		heroes:  number[] = [];//本次战斗上战英雄
		rndseed:  number;//本次战斗随机种子
		actions:  string;//本次战斗指挥官释放技能

		encode(writer: IWriter) {}
		decode(reader: IReader): MartialSoulExitReq {}
	}
	
	export class MartialSoulExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		stageIds:  number[] = [];// 已通过的关卡
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MartialSoulExitRsp {}
	}
	
	export class ExcitingActivityUpgrade implements Message {
		taskId:  number;
		limit:  number;// 剩余数量

		encode(writer: IWriter) {}
		decode(reader: IReader): ExcitingActivityUpgrade {}
	}
	
	export class ExcitingActivityProgress implements Message {
		round:  number;
		type:  number;
		arg:  number;
		num:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExcitingActivityProgress {}
	}
	
	export class ExcitingActivity implements Message {
		type:  number;// 1-点金,2-快速作战,3-竞技场,4-探宝，5-累计充值，6-英雄集结，7-升级有礼，8-升星有礼
		rewards:  number[] = [];// 位图，已领取的序号
		progress:  ExcitingActivityProgress[] = [];// 进度

		encode(writer: IWriter) {}
		decode(reader: IReader): ExcitingActivity {}
	}
	
	// 精彩活动--状态
	export class ExcitingActivityStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ExcitingActivityStateReq {}
	}
	
	export class ExcitingActivityStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		state:  ExcitingActivity[] = [];
		limit:  ExcitingActivityUpgrade[] = [];// 升级有礼剩余奖励数量
		cycle:  number;// 累充当前周期
		starGiftRound:  number;// 升星当前第几轮
		starGiftRewardType:  number;// 升星当前周期

		encode(writer: IWriter) {}
		decode(reader: IReader): ExcitingActivityStateRsp {}
	}
	
	// 精彩活动--领取奖励
	export class ExcitingActivityRewardsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;// 1-点金,2-快速作战,3-竞技场,4-探宝，5-累计充值，6-英雄集结，7-升级有礼，8-升星有礼
		taskId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExcitingActivityRewardsReq {}
	}
	
	export class ExcitingActivityRewardsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		taskId:  number;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ExcitingActivityRewardsRsp {}
	}
	
	// 精彩活动--同步进度信息
	export class ExcitingActivityProgressRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;// 1-点金,2-快速作战,3-竞技场,4-探宝，5-累计充值，6-英雄集结，7-升级有礼，8-升星有礼
		progress:  ExcitingActivityProgress;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExcitingActivityProgressRsp {}
	}
	
	// 精彩活动--同步奖励剩余信息
	export class ExcitingActivityUpgradeLimitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		limit:  ExcitingActivityUpgrade[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ExcitingActivityUpgradeLimitRsp {}
	}
	
	//基因--召唤
	export class GeneDrawReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		geneId:  number;//召唤id

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneDrawReq {}
	}
	
	export class GeneDrawRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneDrawRsp {}
	}
	
	//基因--转换
	export class GeneTransReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		oldHeroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneTransReq {}
	}
	
	export class GeneTransRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		newHeroId:  number;//展示用，已消耗道具

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneTransRsp {}
	}
	
	//基因--确定转换
	export class GeneTransConfirmReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		confirm:  boolean;//确定

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneTransConfirmReq {}
	}
	
	export class GeneTransConfirmRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		hero:  GoodsInfo[] = [];//获得新英雄

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneTransConfirmRsp {}
	}
	
	//基因--兑换碎片
	export class GeneStoreReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;//商店id

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneStoreReq {}
	}
	
	export class GeneStoreRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroChip:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneStoreRsp {}
	}
	
	export class GeneDrawHistory implements Message {
		playerName:  string;
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneDrawHistory {}
	}
	
	//基因--召唤出4星历史
	export class GeneDrawHistoryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneDrawHistoryReq {}
	}
	
	export class GeneDrawHistoryRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		drawHistory:  GeneDrawHistory[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GeneDrawHistoryRsp {}
	}
	
	export class TurntableRecord implements Message {
		playerName:  string;
		itemType:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): TurntableRecord {}
	}
	
	export class TurntableItem implements Message {
		itemType:  number;
		itemNum:  number;
		fetched:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): TurntableItem {}
	}
	
	//探宝--列表
	export class TurntableListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;//1:超值探宝 2:豪华探宝

		encode(writer: IWriter) {}
		decode(reader: IReader): TurntableListReq {}
	}
	
	export class TurntableListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		itemList:  TurntableItem[] = [];
		refreshTime:  number;//下次刷新时间戳
		refreshChance:  number;//剩余刷新次数
		drawRecords:  TurntableRecord[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): TurntableListRsp {}
	}
	
	//探宝--刷新
	export class TurntableRefreshReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): TurntableRefreshReq {}
	}
	
	export class TurntableRefreshRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		itemList:  TurntableItem[] = [];
		refreshTime:  number;//下次刷新时间戳
		refreshChance:  number;//剩余刷新次数

		encode(writer: IWriter) {}
		decode(reader: IReader): TurntableRefreshRsp {}
	}
	
	//探宝--抽奖
	export class TurntableDrawReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		num:  number;//次数 1，10

		encode(writer: IWriter) {}
		decode(reader: IReader): TurntableDrawReq {}
	}
	
	export class TurntableDrawRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		itemList:  TurntableItem[] = [];
		refreshTime:  number;//下次刷新时间戳
		refreshChance:  number;//剩余刷新次数
		drawRecords:  TurntableRecord[] = [];
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): TurntableDrawRsp {}
	}
	
	export class GuildBossRank implements Message {
		brief:  RoleBrief;// 玩家id
		blood:  number;// 伤害

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBossRank {}
	}
	
	//公会boss--状态
	export class GuildBossStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBossStateReq {}
	}
	
	export class GuildBossStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		openTime:  number;// 开启时间
		bossType:  number;// boss类型
		bossLevel:  number;// boss等级
		bossBlood:  number;// boss血量,会超过boss血量上限
		rewardFlag:  number[] = [];// 奖励领取记录,下标按顺序对应0-30，1-60，2-100
		top3:  GuildBossRank[] = [];// 前三名
		enter:  number;// 已挑战次数
		bossPoint:  number;// 公会积分
		maxBlood:  number;// 最高伤害

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBossStateRsp {}
	}
	
	//公会boss--开启活动
	export class GuildBossOpenReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBossOpenReq {}
	}
	
	//公会boss--开启活动广播信息给会员，会员签到同步积分信息给会长
	export class GuildBossOpenRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		openTime:  number;// 开启时间
		bossPoint:  number;// 公会积分

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBossOpenRsp {}
	}
	
	//公会boss--排行榜
	export class GuildBossRankReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBossRankReq {}
	}
	
	export class GuildBossRankRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rank:  GuildBossRank[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBossRankRsp {}
	}
	
	//公会boss--开始挑战
	export class GuildBossEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBossEnterReq {}
	}
	
	export class GuildBossEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		enter:  number;// 已挑战次数

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBossEnterRsp {}
	}
	
	//公会boss--挑战结束
	export class GuildBossExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		blood:  number;// 伤害

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBossExitReq {}
	}
	
	export class GuildBossExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewards:  GoodsInfo[] = [];// 通关奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBossExitRsp {}
	}
	
	//公会boss--领取百分比奖励
	export class GuildBossRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewardFlag:  number;// 奖励领取记录,下标按顺序对应0-30，1-60，2-100

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBossRewardReq {}
	}
	
	export class GuildBossRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewardFlag:  number[] = [];// 奖励领取记录,下标按顺序对应0-30，1-60，2-100
		rewards:  GoodsInfo[] = [];// 奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBossRewardRsp {}
	}
	
	//公会boss--同步boss信息
	export class GuildBossNoticeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		bossBlood:  number;// boss血量,会超过boss血量上限
		top3:  GuildBossRank[] = [];// 前三名

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBossNoticeRsp {}
	}
	
	//公会boss--扫荡
	export class GuildBossRaidsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBossRaidsReq {}
	}
	
	export class GuildBossRaidsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		enter:  number;// 已挑战次数
		blood:  number;// 伤害
		rewards:  GoodsInfo[] = [];// 奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildBossRaidsRsp {}
	}
	
	export class RuneInfo implements Message {
		id:  number;
		num:  number;
		heroId:  number;// 前端用这个字段，方便背包排序显示符文所在英雄头像，后端不需要

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneInfo {}
	}
	
	//符文--列表
	export class RuneListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneListReq {}
	}
	
	export class RuneListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  RuneInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneListRsp {}
	}
	
	//符文--分解
	export class RuneDisintReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		runes:  RuneInfo[] = [];// 符文id

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneDisintReq {}
	}
	
	export class RuneDisintRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		runes:  RuneInfo[] = [];// 符文id
		goodsList:  GoodsInfo[] = [];// 物品

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneDisintRsp {}
	}
	
	//符文--合成
	export class RuneComposeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		runeId:  number;// 目标符文ID
		list:  RuneInfo[] = [];// 材料符文

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneComposeReq {}
	}
	
	export class RuneComposeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		runeId:  number;// 强化后得到符文id
		goodsList:  GoodsInfo[] = [];// 新符文

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneComposeRsp {}
	}
	
	//符文--穿戴，卸下，更换
	export class RuneOnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 英雄id
		index:  number;// 符文位置（下标）
		runeId:  number;// 符文id

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneOnReq {}
	}
	
	// 强化、分解英雄身上的符文会推送这个协议
	export class RuneOnRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		runes:  number[] = [];// 0-1号位，1-2号位

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneOnRsp {}
	}
	
	export class RuneUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  RuneInfo[] = [];
		deleteList:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneUpdateRsp {}
	}
	
	//符文--强化
	export class RuneUpgradeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		runeId:  number;// 需要强化的符文id
		top:  boolean;// 是否一键强化

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneUpgradeReq {}
	}
	
	export class RuneUpgradeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		bRuneId:  number;// 强化前的符文id
		aRuneId:  number;// 强化后得到符文id
		goodsList:  GoodsInfo[] = [];// 物品，直接强化英雄身上的符文不会时这个字段是空

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneUpgradeRsp {}
	}
	
	//符文--融合
	export class RuneMixReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		mainRuneId:  number;// 主符文ID
		subRuneId:  number;// 材料符文

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneMixReq {}
	}
	
	export class RuneMixRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		runeId:  number;// 融合后得到符文id, 9位数, 例: 601020100--6010201是runeId, 后两位是洗练等级washLv
		list:  GoodsInfo[] = [];// 物品，直接强化英雄身上的符文时这个字段是空

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneMixRsp {}
	}
	
	//符文--洗练
	export class RuneWashReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		runeId:  number;//要进行洗练的符文Id
		index:  number;//下标值, 从1开始
		tp:  number;//洗练类型

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneWashReq {}
	}
	
	export class RuneWashRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		oldRuneId:  number;//洗练钱的符文Id
		newRuneId:  number;//洗练过后的符文Id
		tp:  number;//洗练类型, 3是祝福升级
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneWashRsp {}
	}
	
	export class RuneBless implements Message {
		index:  number;
		heroId:  number;//0-背包，大于0-英雄
		runeId:  number;
		bless:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneBless {}
	}
	
	//符文--洗练祝福值查询
	export class RuneBlessInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneBlessInfoReq {}
	}
	
	export class RuneBlessInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  RuneBless[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RuneBlessInfoRsp {}
	}
	
	export class FlipGoods implements Message {
		index:  number;
		goods:  GoodsInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): FlipGoods {}
	}
	
	//翻牌--信息
	export class FlipCardInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FlipCardInfoReq {}
	}
	
	export class FlipCardInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		turnId:  number;//第n轮
		diamondTimes:  number;//剩余的翻牌次数
		sPRewardId:  number[] = [];
		flippedRewards:  FlipGoods[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FlipCardInfoRsp {}
	}
	
	//翻牌--选择特殊奖励
	export class FlipCardSPRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		spRewardId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FlipCardSPRewardReq {}
	}
	
	export class FlipCardSPRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		spRewardId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FlipCardSPRewardRsp {}
	}
	
	//翻牌--抽奖
	export class FlipCardRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): FlipCardRewardReq {}
	}
	
	export class FlipCardRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		itemId:  number;
		reward:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): FlipCardRewardRsp {}
	}
	
	//翻牌--下一轮
	export class FlipCardNextTurnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): FlipCardNextTurnReq {}
	}
	
	export class FlipCardNextTurnRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		nextTurnId:  number;//下一轮

		encode(writer: IWriter) {}
		decode(reader: IReader): FlipCardNextTurnRsp {}
	}
	
	//扭蛋--信息
	export class DrawEggInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): DrawEggInfoReq {}
	}
	
	export class DrawEggInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		isFirstDraw:  boolean;//false为第一次
		sPWishId:  number;
		diamondRemain:  number;//剩余钻石次数
		guaranteeRemain:  number;//剩余保底次数

		encode(writer: IWriter) {}
		decode(reader: IReader): DrawEggInfoRsp {}
	}
	
	//扭蛋--抽奖
	export class DrawEggAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DrawEggAwardReq {}
	}
	
	export class DrawEggAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		reward:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): DrawEggAwardRsp {}
	}
	
	//扭蛋--设置特殊奖励
	export class DrawEggSPRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		sPRewardId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DrawEggSPRewardReq {}
	}
	
	export class DrawEggSPRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		sPRewardId:  number;
		sPRewardGuarantee:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): DrawEggSPRewardRsp {}
	}
	
	export class AdventureHero implements Message {
		type:  number;// 0-主题英雄，1-佣兵
		heroId:  number;// 独立id（后端生成）
		group:  number;// 组id
		typeId:  number;// 英雄id
		useTimes:  number;// 使用次数

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureHero {}
	}
	
	export class AdventureEntry implements Message {
		group:  number;// 组
		id:  number;// hardcore_id

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureEntry {}
	}
	
	//奇境探险--进度
	export class AdventureStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureStateReq {}
	}
	
	export class AdventureStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		blood:  number;// 玩家生命值
		difficulty:  number;// 难度
		layerId:  number;// 第几层
		plateIndex:  number;// 当前板块序号
		plateFinish:  boolean;// 板块事件是否完成
		consumption:  number;// 回复泉水每日使用次数
		giveHeros:  AdventureHero[] = [];// 非玩家英雄
		entryList:  AdventureEntry[] = [];// 拥有的增益遗物
		avgPower:  number;// 平均战力
		avgLevel:  number;// 平均等级
		clearTimes:  number;// 战斗胜利次数
		lastPlate:  number;// 前一个板块
		historyPlate:  number[] = [];// 当前层走过的板块

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureStateRsp {}
	}
	
	//奇境探险--回复生命值
	export class AdventureConsumptionReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureConsumptionReq {}
	}
	
	export class AdventureConsumptionRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		blood:  number;// 玩家生命值
		consumption:  number;// 回复泉水每日使用次数

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureConsumptionRsp {}
	}
	
	//奇境探险--选中板块，不能再选同一行的其他板块，关卡、旅人商店事件使用
	export class AdventurePlateEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventurePlateEnterReq {}
	}
	
	export class AdventurePlateEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventurePlateEnterRsp {}
	}
	
	//奇境探险--板块事件--进入关卡战斗
	export class AdventureEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号
		giveHeros:  number[] = [];// 非玩家英雄，填AdventureHero的HeroId

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureEnterReq {}
	}
	
	export class AdventureEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号
		giveHeros:  AdventureHero[] = [];// 非玩家英雄
		group:  number;// 第几波怪物
		fightState:  string;// 战斗状态，需要保存什么数据前端自定义

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureEnterRsp {}
	}
	
	//奇境探险--板块事件--退出关卡战斗
	export class AdventureExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		blood:  number;// 玩家生命值
		plateIndex:  number;// 板块序号
		group:  number;// 第几波怪物
		fightState:  string;// 战斗状态，需要保存什么数据前端自定义

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureExitReq {}
	}
	
	export class AdventureExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		blood:  number;// 玩家生命值
		plateIndex:  number;// 板块序号
		rankBf:  number;// 战斗前排名，0表示没有排名
		rankAf:  number;// 战斗后排名
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureExitRsp {}
	}
	
	export class AdventureTrave implements Message {
		id:  number;// 物品序号
		times:  number;// 已购买次数

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureTrave {}
	}
	
	//奇境探险--板块事件--旅行商人商品列表
	export class AdventureTravelListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureTravelListReq {}
	}
	
	export class AdventureTravelListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号
		travelIndex:  AdventureTrave[] = [];// 物品列表

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureTravelListRsp {}
	}
	
	//奇境探险--板块事件--旅行商人购买
	export class AdventureTravelBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号
		id:  number;// 物品序号

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureTravelBuyReq {}
	}
	
	export class AdventureTravelBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureTravelBuyRsp {}
	}
	
	//奇境探险--板块事件--旅行商人完成事件
	export class AdventureTravelFinishReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureTravelFinishReq {}
	}
	
	export class AdventureTravelFinishRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureTravelFinishRsp {}
	}
	
	//奇境探险--板块事件--佣兵列表
	export class AdventureMercenaryListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureMercenaryListReq {}
	}
	
	export class AdventureMercenaryListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号
		heroList:  AdventureHero[] = [];// 佣兵随机列表，只有Group和TypeId

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureMercenaryListRsp {}
	}
	
	//奇境探险--板块事件--选择佣兵
	export class AdventureMercenaryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号
		group:  number;// 组id
		typeId:  number;// 英雄id

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureMercenaryReq {}
	}
	
	export class AdventureMercenaryRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号
		giveHeros:  AdventureHero[] = [];// 非玩家英雄

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureMercenaryRsp {}
	}
	
	//奇境探险--板块事件--增益遗物列表
	export class AdventureEntryListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号
		giveHeros:  number[] = [];// 非玩家英雄，填AdventureHero的HeroId
		heros:  number[] = [];// 玩家英雄

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureEntryListReq {}
	}
	
	export class AdventureEntryListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号
		entryList:  AdventureEntry[] = [];// 增益遗物随机列表

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureEntryListRsp {}
	}
	
	//奇境探险--板块事件--增益遗物选择
	export class AdventureEntrySelectReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号
		id:  number;// 增益遗物hardcore_id

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureEntrySelectReq {}
	}
	
	export class AdventureEntrySelectRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号
		entryList:  AdventureEntry[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureEntrySelectRsp {}
	}
	
	//奇境探险--板块事件--回复能量
	export class AdventureConsumptionEventReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureConsumptionEventReq {}
	}
	
	export class AdventureConsumptionEventRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号
		blood:  number;// 玩家生命值

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureConsumptionEventRsp {}
	}
	
	//奇境探险--板块事件--宝藏,广播协议使用SystemBroadcastRsp协议
	export class AdventureTreasureReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureTreasureReq {}
	}
	
	export class AdventureTreasureRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		plateIndex:  number;// 板块序号
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureTreasureRsp {}
	}
	
	//奇境探险--进入下一层/下一难度
	export class AdventureNextReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureNextReq {}
	}
	
	export class AdventureNextRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureNextRsp {}
	}
	
	export class AdventureRankBrief implements Message {
		brief:  RoleBrief;
		value:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureRankBrief {}
	}
	
	//奇境探险--排行榜
	export class AdventureRankListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureRankListReq {}
	}
	
	export class AdventureRankListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		serverNum:  number;
		list:  AdventureRankBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureRankListRsp {}
	}
	
	export class AdventureStoreItem implements Message {
		id:  number;
		remain:  number;//剩余购买次数

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureStoreItem {}
	}
	
	//探险商店--列表
	export class AdventureStoreListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureStoreListReq {}
	}
	
	export class AdventureStoreListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  AdventureStoreItem[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureStoreListRsp {}
	}
	
	//探险商店--购买
	export class AdventureStoreBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		storeId:  number;
		num:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureStoreBuyReq {}
	}
	
	export class AdventureStoreBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		storeItem:  AdventureStoreItem;
		items:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventureStoreBuyRsp {}
	}
	
	//探险证任务--列表
	export class AdventurePassListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventurePassListReq {}
	}
	
	export class AdventurePassListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		bought:  boolean;
		rewarded1:  number[] = [];
		rewarded2:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventurePassListRsp {}
	}
	
	//探险任务--领奖
	export class AdventurePassAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventurePassAwardReq {}
	}
	
	export class AdventurePassAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		rewarded1:  number[] = [];
		rewarded2:  number[] = [];
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): AdventurePassAwardRsp {}
	}
	
	export class ChampionPlayer implements Message {
		brief:  RoleBrief;
		points:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionPlayer {}
	}
	
	export class ChampionExchange implements Message {
		id:  number;
		num:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionExchange {}
	}
	
	//锦标赛--红点信息
	export class ChampionRedPointsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionRedPointsReq {}
	}
	
	export class ChampionRedPointsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		points:  number;
		score:  number;
		seasonId:  number;
		lvRewarded:  number;
		rankRewarded:  boolean;
		level:  number;
		exchanged:  ChampionExchange[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionRedPointsRsp {}
	}
	
	//锦标赛--基础信息
	export class ChampionInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionInfoReq {}
	}
	
	export class ChampionInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		legends:  ChampionPlayer[] = [];
		points:  number;
		score:  number;
		seasonId:  number;
		lvRewarded:  number;
		rankRewarded:  boolean;
		level:  number;//段位
		boughtFightNum:  number;//已购买挑战次数
		freeFightNum:  number;//剩余免费挑战次数
		exchanged:  ChampionExchange[] = [];
		freeRecoverTime:  number;//剩余次数开始恢复时间
		reMatch:  number;//重新匹配次数

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionInfoRsp {}
	}
	
	//锦标赛--匹配对手
	export class ChampionMatchReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionMatchReq {}
	}
	
	export class ChampionMatchRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		opponent:  ChampionPlayer;
		addPoints:  number;
		reMatch:  number;//重新匹配次数

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionMatchRsp {}
	}
	
	//锦标赛--战斗开始
	export class ChampionFightStartReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionFightStartReq {}
	}
	
	export class ChampionFightStartRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		opponentId:  number;
		heroList:  FightHero[] = [];
		general:  FightGeneral;

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionFightStartRsp {}
	}
	
	//锦标赛--战斗结束
	export class ChampionFightOverReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		isWin:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionFightOverReq {}
	}
	
	export class ChampionFightOverRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		newPoints1:  number;
		newRankLv1:  number;
		addPoints1:  number;
		addPoints2:  number;
		reMatch:  number;//重新匹配次数
		goodsList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionFightOverRsp {}
	}
	
	export class ChampionRecord implements Message {
		time:  number;
		isAtk:  boolean;
		isWin:  boolean;
		newPoints:  number;
		addPoints:  number;
		opponent:  RoleBrief;

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionRecord {}
	}
	
	//锦标赛--战斗记录
	export class ChampionRecordsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionRecordsReq {}
	}
	
	export class ChampionRecordsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		records:  ChampionRecord[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionRecordsRsp {}
	}
	
	//锦标赛--排行榜
	export class ChampionRankingReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionRankingReq {}
	}
	
	export class ChampionRankingRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  ChampionPlayer[] = [];
		playerRank:  number;
		playerPoints:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionRankingRsp {}
	}
	
	//锦标赛--领取积分
	export class ChampionFetchScoreReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionFetchScoreReq {}
	}
	
	export class ChampionFetchScoreRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		fetchScore:  number;
		newScore:  number;
		newPoints:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionFetchScoreRsp {}
	}
	
	//锦标赛--积分兑换
	export class ChampionExchangeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionExchangeReq {}
	}
	
	export class ChampionExchangeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		exchanged:  ChampionExchange[] = [];
		goodsList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionExchangeRsp {}
	}
	
	//锦标赛--段位奖励
	export class ChampionLvRewardsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionLvRewardsReq {}
	}
	
	export class ChampionLvRewardsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		goodsList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionLvRewardsRsp {}
	}
	
	//锦标赛--排名奖励
	export class ChampionRankRewardsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionRankRewardsReq {}
	}
	
	export class ChampionRankRewardsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		goodsList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionRankRewardsRsp {}
	}
	
	export class ChampionGuessPlayerList implements Message {
		playerId:  number;
		head:  number;
		name:  string;
		level:  number;
		power:  number;
		headFrame:  number;
		points:  number;// 段位分
		bet:  number;// 支持数

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionGuessPlayerList {}
	}
	
	export class ChampionGuess implements Message {
		player1:  ChampionGuessPlayerList;
		player2:  ChampionGuessPlayerList;
		playerId:  number;// 下注哪个玩家
		score:  number;// 下注积分
		rewardScore:  number;// 奖励积分，不等于0表示本组竞猜结束，失败为负数，成功为正数
		guessTime:  number;// 下注时间

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionGuess {}
	}
	
	//锦标赛--有奖竞猜--下注列表
	export class ChampionGuessListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionGuessListReq {}
	}
	
	export class ChampionGuessListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  ChampionGuess[] = [];// 每组匹配的玩家信息

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionGuessListRsp {}
	}
	
	//锦标赛--有奖竞猜--竞猜
	export class ChampionGuessReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		playerId:  number;
		score:  number;// 下注积分

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionGuessReq {}
	}
	
	export class ChampionGuessRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		playerId:  number;
		score:  number;// 下注积分

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionGuessRsp {}
	}
	
	//锦标赛--有奖竞猜--战斗数据
	export class ChampionGuessFightReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionGuessFightReq {}
	}
	
	//锦标赛--有奖竞猜--战斗数据
	export class ChampionGuessFightRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		p1:  FightQueryRsp;
		p2:  FightQueryRsp;

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionGuessFightRsp {}
	}
	
	//锦标赛--有奖竞猜--战斗结果
	export class ChampionGuessFightResultReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionGuessFightResultReq {}
	}
	
	export class ChampionGuessFightResultRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		score:  number;// 获得积分，货币变更有协议通知，不需要手动再加上

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionGuessFightResultRsp {}
	}
	
	//锦标赛--有奖竞猜--竞猜统计
	export class ChampionGuessHistoryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionGuessHistoryReq {}
	}
	
	export class ChampionGuessHistoryRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  ChampionGuess[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ChampionGuessHistoryRsp {}
	}
	
	//英雄评论--新增评论
	export class InsertCommentReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		playerId:  number;
		content:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): InsertCommentReq {}
	}
	
	export class InsertCommentRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		reply:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): InsertCommentRsp {}
	}
	
	//英雄评论--更新评论/点赞/转发
	export class UpdateCommentReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;//HeroId*1000+index , index从0开始排序
		updateType:  number;//0是喜欢英雄，1是点赞，2是转发

		encode(writer: IWriter) {}
		decode(reader: IReader): UpdateCommentReq {}
	}
	
	export class UpdateCommentRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		reply:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): UpdateCommentRsp {}
	}
	
	export class Comment implements Message {
		id:  number;
		heroId:  number;
		playerId:  number;
		playerName:  string;//玩家名
		commentTime:  number;
		likeNum:  number;//点赞
		repostNum:  number;
		content:  string;
		headId:  number;//头像
		frameId:  number;//头像框
		vIPExp:  number;//VIP经验
		isLike:  boolean;//是否点过赞
		isHot:  boolean;//是否热门
		isNew:  boolean;//是否未看过

		encode(writer: IWriter) {}
		decode(reader: IReader): Comment {}
	}
	
	//英雄评论--查找评论
	export class FindCommentReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		pagination:  number;//页码

		encode(writer: IWriter) {}
		decode(reader: IReader): FindCommentReq {}
	}
	
	export class FindCommentRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		fondNum:  number;//喜欢英雄个数
		maxNum:  number;//有多少条评论
		commentData:  Comment[] = [];
		isFond:  boolean;//是否喜欢过该英雄

		encode(writer: IWriter) {}
		decode(reader: IReader): FindCommentRsp {}
	}
	
	//英雄评论--查看评论
	export class CommentInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): CommentInfoReq {}
	}
	
	export class CommentInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  Comment;

		encode(writer: IWriter) {}
		decode(reader: IReader): CommentInfoRsp {}
	}
	
	//英雄评论--评论条数
	export class CommentNumReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): CommentNumReq {}
	}
	
	export class CommentNumRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		commentNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): CommentNumRsp {}
	}
	
	export class ResonatingGrid implements Message {
		heroId:  number;
		heroLv0:  number;//英雄放上共享水晶前的等级
		heroLv:  number;//英雄放上共享水晶后的等级
		offTime:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ResonatingGrid {}
	}
	
	//共鸣水晶--查看
	export class ResonatingStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ResonatingStateReq {}
	}
	
	export class ResonatingStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		upper:  number[] = [];
		lower:  ResonatingGrid[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ResonatingStateRsp {}
	}
	
	//共鸣水晶--放上
	export class ResonatingPutOnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		gridId:  number;
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ResonatingPutOnReq {}
	}
	
	export class ResonatingPutOnRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		gridId:  number;
		grid:  ResonatingGrid;

		encode(writer: IWriter) {}
		decode(reader: IReader): ResonatingPutOnRsp {}
	}
	
	//共鸣水晶--放下
	export class ResonatingTakeOffReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		gridId:  number;
		isDrop:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): ResonatingTakeOffReq {}
	}
	
	export class ResonatingTakeOffRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		gridId:  number;
		grid:  ResonatingGrid;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ResonatingTakeOffRsp {}
	}
	
	//共鸣水晶--解锁
	export class ResonatingUnlockReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ResonatingUnlockReq {}
	}
	
	export class ResonatingUnlockRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		gridId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ResonatingUnlockRsp {}
	}
	
	//共鸣水晶--清除CD
	export class ResonatingClearCDReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		gridId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ResonatingClearCDReq {}
	}
	
	export class ResonatingClearCDRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		gridId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ResonatingClearCDRsp {}
	}
	
	export class RelicPoint implements Message {
		pointId:  number;
		serverId:  number;
		ownerName:  string;
		guildName:  string;
		defenderNum:  number;
		exploreRate:  number;
		outputTime:  number;//当FreezeTime > 0时，表示结算剩余时间，否则表示结算的时间戳
		fightTime:  number;
		freezeTime:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicPoint {}
	}
	
	//战争遗迹--据点列表
	export class RelicPointListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapType:  number;//1：安全区 2：PK区
		needPoints:  boolean;//是否返回据点数据

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicPointListReq {}
	}
	
	export class RelicPointListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapType:  number;//1：安全区 2：PK区
		pointList:  RelicPoint[] = [];
		exploreTimes:  number;//已用探索次数
		exploreExtra:  number;//额外探索次数
		ydLoginNum:  number;//昨日跨服登录人数

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicPointListRsp {}
	}
	
	export class RelicDefender implements Message {
		index:  number;
		brief:  RoleBrief;
		hP:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicDefender {}
	}
	
	export class RelicRecord implements Message {
		type:  number;
		time:  number;
		value:  number;
		serverId1:  number;
		roleName1:  string;
		serverId2:  number;
		roleName2:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicRecord {}
	}
	
	//战争遗迹--据点详情
	export class RelicPointDetailReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapType:  number;//1：安全区 2：PK区1 3：PK区2
		pointId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicPointDetailReq {}
	}
	
	export class RelicPointDetailRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pointId:  number;
		outputTime:  number;
		contestTime:  number;//争夺状态开始时间
		fightTime:  number;//上次战斗开始时间
		exploreRate:  number;//开始探索的时间
		lastAtkTime:  number;//自己上次对该点的攻击时间
		freezeTime:  number;//冻结开始时间
		guildName:  string;
		helperCD:  number;//按位表示协防者是否已被击败
		recordNum:  number;
		records:  RelicRecord[] = [];//战斗记录，只返回前5条
		defenders:  RelicDefender[] = [];//第一个为归属者

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicPointDetailRsp {}
	}
	
	//战争遗迹--开始探索
	export class RelicPointExploreReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapType:  number;//1：安全区 2：PK区 3：PK区2
		pointId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicPointExploreReq {}
	}
	
	export class RelicPointExploreRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapType:  number;//1：安全区 2：PK区 3：PK区2
		pointId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicPointExploreRsp {}
	}
	
	//战争遗迹--战斗记录
	export class RelicPointRecordsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapType:  number;//1：安全区 2：PK区 3：PK区2
		pointId:  number;//0表示查看自己领奖界面的记录
		index:  number;//从第几条开始
		count:  number;//总共返回多少条

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicPointRecordsReq {}
	}
	
	export class RelicPointRecordsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		records:  RelicRecord[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicPointRecordsRsp {}
	}
	
	//战争遗迹--清楚CD
	export class RelicFightClearCDReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pointId:  number;
		mapType:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicFightClearCDReq {}
	}
	
	export class RelicFightClearCDRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicFightClearCDRsp {}
	}
	
	//战争遗迹--开始战斗
	export class RelicFightStartReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pointId:  number;
		mapType:  number;//1：安全区 2：PK区 3：PK区2

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicFightStartReq {}
	}
	
	export class RelicFightStartRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;
		heroList:  FightHero[] = [];
		general:  FightGeneral;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicFightStartRsp {}
	}
	
	//战争遗迹--结束战斗
	export class RelicFightOverReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pointId:  number;
		damage:  number;
		mapType:  number;//1：安全区 2：PK区 3：PK区2

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicFightOverReq {}
	}
	
	export class RelicFightOverRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pointId:  number;
		canExplore:  boolean;
		remainHP:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicFightOverRsp {}
	}
	
	export class RelicGuildDefender implements Message {
		defenderId:  number;
		pointType:  number;
		ownerName:  string;
		endTime:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicGuildDefender {}
	}
	
	//战争遗迹--公会协防者
	export class RelicGuildDefendersReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicGuildDefendersReq {}
	}
	
	export class RelicGuildDefendersRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  RelicGuildDefender[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicGuildDefendersRsp {}
	}
	
	//战争遗迹--请求协防
	export class RelicHelpDefendReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		defenderId:  number;//请求协防时传递
		ownerId:  number;//主动协防时传递
		pointId:  number;//主动协防时传递
		mapType:  number;//1：安全区 2：PK区 3：PK区2

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicHelpDefendReq {}
	}
	
	export class RelicHelpDefendRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		brief:  RoleBrief;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicHelpDefendRsp {}
	}
	
	//战争遗迹--查看奖励
	export class RelicQueryRewardsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicQueryRewardsReq {}
	}
	
	export class RelicQueryRewardsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapType:  number;
		pointType:  number;
		fightCount:  number;
		recordNum:  number;
		records:  RelicRecord[] = [];//只返回前5条记录
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicQueryRewardsRsp {}
	}
	
	//战争遗迹--领取奖励
	export class RelicFetchRewardsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		thankHelpers:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicFetchRewardsReq {}
	}
	
	export class RelicFetchRewardsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicFetchRewardsRsp {}
	}
	
	//战争遗迹--修复
	export class RelicRepairReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;//1，2：第一、二个协防者
		ownerId:  number;
		pointId:  number;
		mapType:  number;//1：安全区 2：PK区 3：PK区2

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicRepairReq {}
	}
	
	export class RelicRepairRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;//1，2：第一、二个协防者
		ownerId:  number;
		pointId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicRepairRsp {}
	}
	
	//战争遗迹--放弃
	export class RelicGiveUpReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicGiveUpReq {}
	}
	
	export class RelicGiveUpRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicGiveUpRsp {}
	}
	
	//战争遗迹--据点广播
	export class RelicBroadcastPointRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapType:  number;
		point:  RelicPoint;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicBroadcastPointRsp {}
	}
	
	//战争遗迹--探索次数更新
	export class RelicExploreTimesRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		number:  number;
		extra:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicExploreTimesRsp {}
	}
	
	//战争遗迹--重置协防
	export class RelicHelpResetReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;//1，2：第一、二个协防者

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicHelpResetReq {}
	}
	
	export class RelicHelpResetRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;//1，2：第一、二个协防者

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicHelpResetRsp {}
	}
	
	export class RelicMapDrop implements Message {
		playerId:  number;
		playerName:  string;
		pointId:  number;
		dropTime:  number;
		itemType:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicMapDrop {}
	}
	
	//战争遗迹--查看掉落记录
	export class RelicMapDropsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapType:  number;
		pointId:  number;
		index:  number;
		size:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicMapDropsReq {}
	}
	
	export class RelicMapDropsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		total:  number;
		list:  RelicMapDrop[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicMapDropsRsp {}
	}
	
	export class RelicGuildExplorer implements Message {
		playerBrief:  RoleBrief;
		remainTimes:  number;
		maxTimes:  number;
		endTime:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicGuildExplorer {}
	}
	
	//战争遗迹--公会探索列表
	export class RelicGuildExplorersReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		minPower:  number;
		minLevel:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicGuildExplorersReq {}
	}
	
	export class RelicGuildExplorersRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  RelicGuildExplorer[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicGuildExplorersRsp {}
	}
	
	//战争遗迹--转让据点
	export class RelicTransferReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		targetId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicTransferReq {}
	}
	
	export class RelicTransferRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicTransferRsp {}
	}
	
	//战争遗迹--转让据点通知
	export class RelicTransferNoticeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		ownerBrief:  RoleBrief;
		mapType:  number;
		pointId:  number;
		endTime:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicTransferNoticeRsp {}
	}
	
	//战争遗迹--转让据点确认
	export class RelicTransferConfirmReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		ownerId:  number;
		mapType:  number;
		pointId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicTransferConfirmReq {}
	}
	
	export class RelicTransferConfirmRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapType:  number;
		pointId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicTransferConfirmRsp {}
	}
	
	//战争遗迹--转让据点取消
	export class RelicTransferCancelReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		ownerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicTransferCancelReq {}
	}
	
	export class RelicTransferCancelRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicTransferCancelRsp {}
	}
	
	//战争遗迹--据点被攻击通知
	export class RelicUnderAttackNoticeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		noticeTime:  number;
		pointId:  number;
		srvName:  string;
		atkName:  string;
		ownerHP:  string;
		helperHP:  string;
		mapType:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicUnderAttackNoticeRsp {}
	}
	
	export class RelicRankGuild implements Message {
		id:  number;
		name:  string;
		icon:  number;
		bottom:  number;
		frame:  number;
		score:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicRankGuild {}
	}
	
	//战争遗迹--公会排行榜
	export class RelicGuildRankReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicGuildRankReq {}
	}
	
	export class RelicGuildRankRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rankList:  RelicRankGuild[] = [];
		serverNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicGuildRankRsp {}
	}
	
	//战争遗迹--遗迹之证已领奖励
	export class RelicCertStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicCertStateReq {}
	}
	
	export class RelicCertStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		bought:  boolean;
		rewarded1:  number[] = [];
		rewarded2:  number[] = [];
		sETime:  PassSETime;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicCertStateRsp {}
	}
	
	//战争遗迹--遗迹之证领取奖励
	export class RelicCertRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicCertRewardReq {}
	}
	
	export class RelicCertRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		rewarded1:  number[] = [];
		rewarded2:  number[] = [];
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicCertRewardRsp {}
	}
	
	export class RelicRankPlayer implements Message {
		brief:  RoleBrief;
		score:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicRankPlayer {}
	}
	
	//战争遗迹--清楚协防排行榜
	export class RelicClearRankReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicClearRankReq {}
	}
	
	export class RelicClearRankRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rankList:  RelicRankPlayer[] = [];
		rankMine:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicClearRankRsp {}
	}
	
	//战争遗迹--战斗次数排行榜
	export class RelicFightRankReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicFightRankReq {}
	}
	
	export class RelicFightRankRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rankList:  RelicRankPlayer[] = [];
		rankMine:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RelicFightRankRsp {}
	}
	
	export class CostumeAttr implements Message {
		id:  number;// 属性id
		initValue:  number;// 基础值
		value:  number;// 值

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeAttr {}
	}
	
	export class CostumeInfo implements Message {
		id:  number;// 神装自定义id
		typeId:  number;// 神装类型id
		level:  number;// 等级（升级次数）
		attrs:  CostumeAttr[] = [];// 属性

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeInfo {}
	}
	
	//神装--列表
	export class CostumeListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeListReq {}
	}
	
	export class CostumeListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  CostumeInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeListRsp {}
	}
	
	//神装--分解
	export class CostumeDisintReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		costumeIds:  number[] = [];// 神装自定义id

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeDisintReq {}
	}
	
	export class CostumeDisintRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		costumes:  number[] = [];// 神装自定义id
		goodsList:  GoodsInfo[] = [];// 物品

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeDisintRsp {}
	}
	
	//神装--穿戴，卸下，更换
	export class CostumeOnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 英雄id
		index:  number;// 神装位置（下标）
		costumeId:  number;// 神装自定义id

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeOnReq {}
	}
	
	// 强化、分解英雄身上的神装会推送这个协议
	export class CostumeOnRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		list:  CostumeInfo[] = [];// 0-1号位，1-2号位，2-3号位，3-4号位

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeOnRsp {}
	}
	
	//神装--强化
	export class CostumeUpgradeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		costumeId:  number;// 需要强化的神装自定义id
		top:  boolean;// 一键强化

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeUpgradeReq {}
	}
	
	export class CostumeUpgradeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		costume:  CostumeInfo;// 升级后的神装

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeUpgradeRsp {}
	}
	
	export class CostumeUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  CostumeInfo[] = [];// 获得
		deleteList:  number[] = [];// 减少

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeUpdateRsp {}
	}
	
	//神装定制--状态
	export class CostumeCustomStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeCustomStateReq {}
	}
	
	export class CostumeCustomStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		score:  number;// 积分
		scoreRecord:  number[] = [];// 积分奖励记录

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeCustomStateRsp {}
	}
	
	//神装定制--积分变更，领取任务奖励获得积分会推送此协议
	export class CostumeCustomScoreUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		score:  number;// 积分

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeCustomScoreUpdateRsp {}
	}
	
	//神装定制--领取
	export class CostumeCustomScoreReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		score:  number;// 领取哪个积分奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeCustomScoreReq {}
	}
	
	export class CostumeCustomScoreRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		score:  number;// 领取哪个积分奖励
		scoreRecord:  number[] = [];// 积分奖励记录
		goodsList:  GoodsInfo[] = [];// 物品

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeCustomScoreRsp {}
	}
	
	//神装定制--定制，还会推送CostumeUpdateRsp
	export class CostumeCustomReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;// Costume表id
		attrs:  number[] = [];// attr表id

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeCustomReq {}
	}
	
	export class CostumeCustomRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		costume:  CostumeInfo;//获得

		encode(writer: IWriter) {}
		decode(reader: IReader): CostumeCustomRsp {}
	}
	
	export class VaultRecord implements Message {
		playerId:  number;
		playerName:  string;
		power:  number;
		date:  number;
		difficulty:  number;
		heroList:  HeroBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): VaultRecord {}
	}
	
	export class PositionInfo implements Message {
		positionId:  number;
		playerId:  number;//当前正在占领的玩家Id，同下
		playerName:  string;
		headId:  number;
		frameId:  number;
		titleId:  number;
		guildName:  string;
		difficulty:  number;
		recordList:  VaultRecord[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PositionInfo {}
	}
	
	//殿堂指挥官--占领
	export class VaultFightOverReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		positionId:  number;//位置Id, 1-6
		isSuccess:  boolean;//是否成功

		encode(writer: IWriter) {}
		decode(reader: IReader): VaultFightOverReq {}
	}
	
	export class VaultFightOverRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  VaultRecord[] = [];//占领历史记录

		encode(writer: IWriter) {}
		decode(reader: IReader): VaultFightOverRsp {}
	}
	
	//殿堂指挥官--信息
	export class VaultPositionInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): VaultPositionInfoReq {}
	}
	
	export class VaultPositionInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		failTime:  number;//上次挑战失败退出的时间，成功为0
		info:  PositionInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): VaultPositionInfoRsp {}
	}
	
	//殿堂指挥官--战斗开始
	export class VaultFightStartReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		positionId:  number;//位置
		difficulty:  number;//难度

		encode(writer: IWriter) {}
		decode(reader: IReader): VaultFightStartReq {}
	}
	
	export class VaultFightStartRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		startSucc:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): VaultFightStartRsp {}
	}
	
	//殿堂指挥官--战斗准备
	export class VaultFightReadyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		positionId:  number;
		difficulty:  number;//难度

		encode(writer: IWriter) {}
		decode(reader: IReader): VaultFightReadyReq {}
	}
	
	export class VaultFightReadyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		enterSucc:  boolean;
		heroList:  FightHero[] = [];
		general:  FightGeneral;

		encode(writer: IWriter) {}
		decode(reader: IReader): VaultFightReadyRsp {}
	}
	
	export class GuildEnvelope implements Message {
		id:  number;// 红包id
		typeId:  number;// gift_id
		name:  string;// 玩家
		left:  number;// 剩余份数
		sendTime:  number;// 发出时间
		got:  boolean;// 是否已抢

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildEnvelope {}
	}
	
	export class GuildEnvelopeRank implements Message {
		brief:  RoleBrief;// 玩家id
		value:  number;// 总价值
		num:  number;// 红包数

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildEnvelopeRank {}
	}
	
	//公会红包--排行榜(变化主动推送)
	export class GuildEnvelopeRankReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildEnvelopeRankReq {}
	}
	
	export class GuildEnvelopeRankRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rank:  GuildEnvelopeRank[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildEnvelopeRankRsp {}
	}
	
	//公会红包--红包列表
	export class GuildEnvelopeListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		my:  boolean;// true-拥有的,false-可抢的

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildEnvelopeListReq {}
	}
	
	export class GuildEnvelopeListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		my:  boolean;// true-拥有的,false-可抢的
		list:  GuildEnvelope[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildEnvelopeListRsp {}
	}
	
	// 主动推送有变动的红包
	export class GuildEnvelopeChangeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		my:  boolean;// true-拥有的,false-可抢的
		list:  GuildEnvelope[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildEnvelopeChangeRsp {}
	}
	
	//公会红包--发红包
	export class GuildEnvelopeSendReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildEnvelopeSendReq {}
	}
	
	export class GuildEnvelopeSendRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		list:  GuildEnvelope[] = [];// 我的红包

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildEnvelopeSendRsp {}
	}
	
	//公会红包--抢红包
	export class GuildEnvelopeGetReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildEnvelopeGetReq {}
	}
	
	export class GuildEnvelopeGetRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		goods:  GoodsInfo[] = [];// 奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildEnvelopeGetRsp {}
	}
	
	export class CarnivalServerInfo implements Message {
		serverId:  number;
		ranking:  number;
		serverScore:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): CarnivalServerInfo {}
	}
	
	//跨服狂欢--服务器排名
	export class CarnivalServerScoreRankReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): CarnivalServerScoreRankReq {}
	}
	
	export class CarnivalServerScoreRankRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rankingInfo:  CarnivalServerInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): CarnivalServerScoreRankRsp {}
	}
	
	export class CarnivalPlayerAddScoreRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		addNum:  number;//增加的数目

		encode(writer: IWriter) {}
		decode(reader: IReader): CarnivalPlayerAddScoreRsp {}
	}
	
	//跨服狂欢--玩家积分
	export class CarnivalPlayerScoreQueryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): CarnivalPlayerScoreQueryReq {}
	}
	
	export class CarnivalPlayerScoreQueryRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		carnivalScore:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): CarnivalPlayerScoreQueryRsp {}
	}
	
	//跨服狂欢--信息
	export class CarnivalInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): CarnivalInfoReq {}
	}
	
	export class CarnivalInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		boxOpened:  number;//如果是评分系统，表示已完成阶段
		numTd:  number;//今日排名
		carnivalScore:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): CarnivalInfoRsp {}
	}
	
	//跨服狂欢--玩家当前服务器排名
	export class CarnivalPlayerServerRankReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): CarnivalPlayerServerRankReq {}
	}
	
	export class CarnivalPlayerServerRankRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rank:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): CarnivalPlayerServerRankRsp {}
	}
	
	export class RitualInfo implements Message {
		id:  number;
		remain:  number;
		total:  number;
		time:  number;//时间戳

		encode(writer: IWriter) {}
		decode(reader: IReader): RitualInfo {}
	}
	
	//每日必做--参数信息
	export class RitualListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RitualListReq {}
	}
	
	export class RitualListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  RitualInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RitualListRsp {}
	}
	
	export class RuinStage implements Message {
		stageId:  number;// 关卡id
		star:  number;// 星星位图

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinStage {}
	}
	
	export class RuinChapter implements Message {
		chapter:  number;// 章节id
		player:  RoleBrief;// 占领的玩家
		challenger:  RoleBrief;// 挑战者，有可能空

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinChapter {}
	}
	
	export class RuinChapterReward implements Message {
		chapter:  number;// 章节id
		reward:  number[] = [];// 已领取的奖励，星星档次，减一

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinChapterReward {}
	}
	
	//末日废墟--状态
	export class RuinStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinStateReq {}
	}
	
	export class RuinStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		maxStageId:  number;// 通关的最大关卡id
		times:  number;// 剩余挑战次数
		raids:  number;// 剩余扫荡次数
		raidsStage:  number;// 今日内，上一次扫荡的关卡
		stages:  RuinStage[] = [];// 历史关卡
		chapters:  RuinChapter[] = [];// 占领情况，只返回被占领的章节
		chapterReward:  RuinChapterReward[] = [];// 章节奖励，只返回领取过的章节

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinStateRsp {}
	}
	
	//末日废墟--进入
	export class RuinEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinEnterReq {}
	}
	
	export class RuinEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinEnterRsp {}
	}
	
	//末日废墟--退出
	export class RuinExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		star:  number;// 星星位图

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinExitReq {}
	}
	
	export class RuinExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		star:  number;// 星星位图，本关卡历史获得的星星
		chapter:  number;// 大于0表示占领此章节
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinExitRsp {}
	}
	
	//末日废墟--扫荡
	export class RuinRaidsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinRaidsReq {}
	}
	
	export class RuinRaidsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 扫荡的关卡id
		raids:  number;// 剩余扫荡次数
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinRaidsRsp {}
	}
	
	//末日废墟--pvp挑战进入
	export class RuinChallengeEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		chapter:  number;// 章节id

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinChallengeEnterReq {}
	}
	
	export class RuinChallengeEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		chapter:  number;// 章节id

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinChallengeEnterRsp {}
	}
	
	//末日废墟--pvp挑战退出
	export class RuinChallengeExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		chapter:  number;// 章节id
		clear:  boolean;// 挑战胜利

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinChallengeExitReq {}
	}
	
	export class RuinChallengeExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		chapter:  number;// 章节id

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinChallengeExitRsp {}
	}
	
	//末日废墟--领取章节奖励
	export class RuinChapterRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		chapter:  number;// 章节id
		star:  number;// 星星档次

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinChapterRewardReq {}
	}
	
	export class RuinChapterRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		chapterReward:  RuinChapterReward[] = [];// 章节奖励，只返回领取过的章节
		rewards:  GoodsInfo[] = [];// 奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinChapterRewardRsp {}
	}
	
	//末日废墟--章节挑战状态(主动给推送)
	export class RuinChapterChallengeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		chapter:  number;// 章节id
		player:  RoleBrief;// 占领的玩家
		challenger:  RoleBrief;// 挑战者，存在-开始战斗，空-结束战斗

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinChapterChallengeRsp {}
	}
	
	export class RuinStarRankBrief implements Message {
		brief:  RoleBrief;
		value:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinStarRankBrief {}
	}
	
	//末日废墟--星星排行榜
	export class RuinStarRankListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinStarRankListReq {}
	}
	
	export class RuinStarRankListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mine:  number;// 玩家排名
		star:  number;// 玩家总星星
		list:  RuinStarRankBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RuinStarRankListRsp {}
	}
	
	export class EnergyStationInfo implements Message {
		stationId:  number;//类型
		upgradeId:  number;//等级Id, 0代表未解锁
		advanceId:  number;//阶级Id， 0代表未解锁
		isRedPoint:  boolean;//是否开启红点提示

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergyStationInfo {}
	}
	
	//能量站--信息
	export class EnergyStationInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergyStationInfoReq {}
	}
	
	export class EnergyStationInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  EnergyStationInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergyStationInfoRsp {}
	}
	
	//能量站--解锁
	export class EnergyStationUnlockReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stationId:  number;//能量站Ids
		heroIds:  number[] = [];//材料英雄的唯一Id

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergyStationUnlockReq {}
	}
	
	export class EnergyStationUnlockRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  EnergyStationInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergyStationUnlockRsp {}
	}
	
	//能量站--升级
	export class EnergyStationUpgradeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		upgradeId:  number;//Id

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergyStationUpgradeReq {}
	}
	
	export class EnergyStationUpgradeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  EnergyStationInfo;//升级后状态

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergyStationUpgradeRsp {}
	}
	
	//能量站--升阶
	export class EnergyStationAdvanceReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		advanceId:  number;
		staffHeroIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergyStationAdvanceReq {}
	}
	
	export class EnergyStationAdvanceRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  EnergyStationInfo;//升阶后状态

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergyStationAdvanceRsp {}
	}
	
	//能量站--红点
	export class EnergyStationRedPointReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stationId:  number;
		open:  boolean;//true-开启 false 关闭

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergyStationRedPointReq {}
	}
	
	export class EnergyStationRedPointRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  EnergyStationInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergyStationRedPointRsp {}
	}
	
	//新英雄试炼--进度、次数信息
	export class NewOrdealInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): NewOrdealInfoReq {}
	}
	
	export class NewOrdealInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		maxStageId:  number;
		stageDamages:  number[] = [];// 伤害（下标=难度-1）
		rankNum:  number;// 名次，0表示没有名次

		encode(writer: IWriter) {}
		decode(reader: IReader): NewOrdealInfoRsp {}
	}
	
	//新英雄试炼--开始战斗
	export class NewOrdealEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): NewOrdealEnterReq {}
	}
	
	export class NewOrdealEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): NewOrdealEnterRsp {}
	}
	
	//新英雄试炼--结束战斗
	export class NewOrdealExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		stageDamage:  number;// 伤害
		clear:  boolean;// 是否通关

		encode(writer: IWriter) {}
		decode(reader: IReader): NewOrdealExitReq {}
	}
	
	export class NewOrdealExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		stageDamage:  number;
		clearRewards:  GoodsInfo[] = [];//首通奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): NewOrdealExitRsp {}
	}
	
	export class NewOrdealRankBrief implements Message {
		brief:  RoleBrief;
		value:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): NewOrdealRankBrief {}
	}
	
	//新英雄试炼--排行榜
	export class NewOrdealRankListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): NewOrdealRankListReq {}
	}
	
	export class NewOrdealRankListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		serverNum:  number;// 跨服组中游戏服数量
		list:  NewOrdealRankBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): NewOrdealRankListRsp {}
	}
	
	//丧尸围城--状态
	export class SiegeStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SiegeStateReq {}
	}
	
	export class SiegeStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		weekGroup:  number;// 本周累计挑战波数
		todayMaxGroup:  number;// 本日最高挑战波数
		todayBlood:  number;// 本日城门受到伤害
		weekBlood:  number;// 本日之前城门受到伤害
		enterTimes:  number;// 挑战次数
		buyTimes:  number;// 购买次数
		serverNum:  number;// 跨服组中游戏服数量
		worldLevelIndex:  number;// 跨服组内世界平均等级
		isActivityOpen:  boolean;// 活动是否开启

		encode(writer: IWriter) {}
		decode(reader: IReader): SiegeStateRsp {}
	}
	
	//丧尸围城--购买次数
	export class SiegeBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SiegeBuyReq {}
	}
	
	export class SiegeBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		enterTimes:  number;// 挑战次数
		buyTimes:  number;// 购买次数

		encode(writer: IWriter) {}
		decode(reader: IReader): SiegeBuyRsp {}
	}
	
	//丧尸围城--开始战斗
	export class SiegeEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SiegeEnterReq {}
	}
	
	export class SiegeEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		enterTimes:  number;// 今日挑战次数

		encode(writer: IWriter) {}
		decode(reader: IReader): SiegeEnterRsp {}
	}
	
	//丧尸围城--结束战斗
	export class SiegeExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		group:  number;// 本次波数
		blood:  number;// 本次城门受到的伤害
		monsters:  Monster[] = [];// 击杀的怪物

		encode(writer: IWriter) {}
		decode(reader: IReader): SiegeExitReq {}
	}
	
	export class SiegeExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		weekGroup:  number;// 本周累计挑战波数
		todayMaxGroup:  number;// 本日最高挑战波数
		todayBlood:  number;// 本日城门受到伤害
		weekBlood:  number;// 本日之前城门受到伤害
		enterTimes:  number;// 今日挑战次数
		rewards:  GoodsInfo[] = [];// 怪物奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): SiegeExitRsp {}
	}
	
	export class SiegeRankBrief implements Message {
		guildId:  number;// 公会id
		guildIcon:  number;// 图标
		guildBottom:  number;// 图标
		guildFrame:  number;// 图标
		guildName:  string;// 名称
		blood:  number;// 本周城门受到的伤害,0-周一，6-周日

		encode(writer: IWriter) {}
		decode(reader: IReader): SiegeRankBrief {}
	}
	
	//丧尸围城--排行榜
	export class SiegeRankListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SiegeRankListReq {}
	}
	
	export class SiegeRankListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  SiegeRankBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SiegeRankListRsp {}
	}
	
	export class SiegeBloodRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		todayBlood:  number;// 本日城门受到伤害
		weekBlood:  number;// 本日之前城门受到伤害

		encode(writer: IWriter) {}
		decode(reader: IReader): SiegeBloodRsp {}
	}
	
	export class ArenaTeamPlayer implements Message {
		rank:  number;
		score:  number;
		brief:  RoleBrief;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamPlayer {}
	}
	
	export class ArenaTeamInfo implements Message {
		teamId:  number;
		players:  ArenaTeamPlayer[] = [];
		fightTimes:  number;
		remainChance:  number;
		addChanceTime:  number;
		setting:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamInfo {}
	}
	
	export class ArenaTeamMatch implements Message {
		matchedNum:  number;//本轮已匹配次数
		fightResults:  number[] = [];
		confirmed:  boolean;//是否已确定对手

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamMatch {}
	}
	
	export class ArenaTeamLegend implements Message {
		player:  ArenaTeamPlayer;
		guildName:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamLegend {}
	}
	
	//组队竞技场--队伍信息
	export class ArenaTeamInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamInfoReq {}
	}
	
	export class ArenaTeamInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		legends:  ArenaTeamLegend[] = [];
		teamInfo:  ArenaTeamInfo;
		matchInfo:  ArenaTeamMatch;
		fightRewarded:  number;//挑战奖励是否已领（按位表示）
		rankRewarded:  boolean;//排名奖励是否已领
		activityId:  number;//活动阶段（组队期，对战期，休战期）

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamInfoRsp {}
	}
	
	//组队竞技场--可组队玩家列表
	export class ArenaTeamPlayersReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerIds:  number[] = [];
		playerName:  string;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamPlayersReq {}
	}
	
	export class ArenaTeamPlayersRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		players:  ArenaTeamPlayer[] = [];
		playerIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamPlayersRsp {}
	}
	
	//组队竞技场--邀请玩家
	export class ArenaTeamInviteReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamInviteReq {}
	}
	
	export class ArenaTeamInviteRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamInviteRsp {}
	}
	
	//组队竞技场--被邀请记录
	export class ArenaTeamInvitersReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamInvitersReq {}
	}
	
	export class ArenaTeamInvitersRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		inviters:  ArenaTeamPlayer[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamInvitersRsp {}
	}
	
	//组队竞技场--同意邀请
	export class ArenaTeamAgreeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		inviterId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamAgreeReq {}
	}
	
	export class ArenaTeamAgreeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		teamInfo:  ArenaTeamInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamAgreeRsp {}
	}
	
	//组队竞技场--拒绝邀请
	export class ArenaTeamRejectReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		inviterId:  number;//0表示全部拒绝

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamRejectReq {}
	}
	
	export class ArenaTeamRejectRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		inviterId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamRejectRsp {}
	}
	
	//组队竞技场--退出队伍
	export class ArenaTeamQuitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamQuitReq {}
	}
	
	export class ArenaTeamQuitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamQuitRsp {}
	}
	
	//组队竞技场--移除队员
	export class ArenaTeamRemoveReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamRemoveReq {}
	}
	
	export class ArenaTeamRemoveRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamRemoveRsp {}
	}
	
	//组队竞技场--移交队长
	export class ArenaTeamDemiseReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamDemiseReq {}
	}
	
	export class ArenaTeamDemiseRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamDemiseRsp {}
	}
	
	//组队竞技场--设置选项
	export class ArenaTeamSettingReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		setting:  number;//按位表示，0,0,0,0,0,0,0,是否允许队员挑战

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamSettingReq {}
	}
	
	export class ArenaTeamSettingRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		setting:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamSettingRsp {}
	}
	
	//组队竞技场--队伍红点
	export class ArenaTeamRedPointsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;//1:收到邀请

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamRedPointsRsp {}
	}
	
	export class ArenaTeamRoleBrief implements Message {
		brief:  RoleBrief;
		score:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamRoleBrief {}
	}
	
	//组队竞技场--匹配对手
	export class ArenaTeamMatchReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		query:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamMatchReq {}
	}
	
	export class ArenaTeamMatchRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		teammates:  ArenaTeamRoleBrief[] = [];
		opponents:  ArenaTeamRoleBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamMatchRsp {}
	}
	
	export class ArenaTeamRoleHeroes implements Message {
		playerId:  number;
		playerName:  string;
		heroes:  HeroBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamRoleHeroes {}
	}
	
	//组队竞技场--确定对手
	export class ArenaTeamConfirmReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamConfirmReq {}
	}
	
	export class ArenaTeamConfirmRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		teammates:  ArenaTeamRoleHeroes[] = [];
		opponents:  ArenaTeamRoleHeroes[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamConfirmRsp {}
	}
	
	//组队竞技场--设置顺序
	export class ArenaTeamFightOrderReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		order:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamFightOrderReq {}
	}
	
	export class ArenaTeamFightOrderRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		order:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamFightOrderRsp {}
	}
	
	export class ArenaTeamFighter implements Message {
		playerId:  number;
		heroList:  FightHero[] = [];
		general:  FightGeneral;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamFighter {}
	}
	
	//组队竞技场--战斗开始
	export class ArenaTeamFightStartReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;//从0开始

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamFightStartReq {}
	}
	
	export class ArenaTeamFightStartRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		teammate:  ArenaTeamFighter;
		opponent:  ArenaTeamFighter;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamFightStartRsp {}
	}
	
	export class ArenaTeamFightResult implements Message {
		playerId:  number;
		newScore:  number;
		oldScore:  number;
		newRank:  number;
		oldRank:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamFightResult {}
	}
	
	//组队竞技场--战斗结束
	export class ArenaTeamFightOverReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;//从0开始
		isWin:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamFightOverReq {}
	}
	
	export class ArenaTeamFightOverRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;//从0开始
		isWin:  boolean;
		results:  ArenaTeamFightResult[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamFightOverRsp {}
	}
	
	export class ArenaTeamRecordTeammate implements Message {
		playerId:  number;
		head:  number;
		frame:  number;
		level:  number;
		newScore:  number;
		oldScore:  number;
		newRank:  number;
		oldRank:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamRecordTeammate {}
	}
	
	export class ArenaTeamRecordOpponent implements Message {
		playerId:  number;
		head:  number;
		frame:  number;
		level:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamRecordOpponent {}
	}
	
	export class ArenaTeamFightRecord implements Message {
		teammates:  ArenaTeamRecordTeammate[] = [];
		opponents:  ArenaTeamRecordOpponent[] = [];
		teammatesPower:  number;
		opponentsPower:  number;
		isFightWin:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamFightRecord {}
	}
	
	//组队竞技场--战斗记录
	export class ArenaTeamFightRecordsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamFightRecordsReq {}
	}
	
	export class ArenaTeamFightRecordsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		records:  ArenaTeamFightRecord[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamFightRecordsRsp {}
	}
	
	//组队竞技场--挑战奖励
	export class ArenaTeamFightRewardsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;//从0开始

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamFightRewardsReq {}
	}
	
	export class ArenaTeamFightRewardsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamFightRewardsRsp {}
	}
	
	//组队竞技场--排名奖励
	export class ArenaTeamRankRewardsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamRankRewardsReq {}
	}
	
	export class ArenaTeamRankRewardsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamRankRewardsRsp {}
	}
	
	//组队竞技场--查看排行榜
	export class ArenaTeamRankListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamRankListReq {}
	}
	
	export class ArenaTeamRankListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rankList:  ArenaTeamPlayer[] = [];
		selfRank:  number;
		selfScore:  number;
		serverNum:  number;//跨服组服务器数量

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaTeamRankListRsp {}
	}
	
	export class PeakHero implements Message {
		typeId:  number;
		level:  number;
		soldierId:  number;
		star:  number;
		careerLv:  number;
		power:  number;
		careerType:  number;
		careerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakHero {}
	}
	
	//巅峰之战--状态
	export class PeakStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakStateReq {}
	}
	
	export class PeakStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		points:  number;// 拥有的积分数
		enterTimes:  number;// 已挑战次数
		totalEnterTimes:  number;// 活动期间已挑战次数
		displaceTimes:  number;// 已置换次数
		heroes:  PeakHero[] = [];// 拥有的英雄
		heroIds:  number[] = [];// 上阵列表
		gradeReward:  number[] = [];// 段位物品奖励领取记录(位图)
		gradeHero:  number[] = [];// 段位英雄奖励领取记录(位图)
		challenge:  number[] = [];// 挑战励领取记录(位图)
		rank:  number;// 当前段位
		maxRank:  number;// 历史最高段位
		rankNumber:  number[] = [];// 段位人数，下标对应段位减1
		buyEnterTimes:  number;// 购买挑战次数
		serverNum:  number;// 游戏服数量
		matchingTimes:  number;// 匹配次数

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakStateRsp {}
	}
	
	//巅峰之战--英雄上阵
	export class PeakHeroOnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakHeroOnReq {}
	}
	
	export class PeakHeroOnRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakHeroOnRsp {}
	}
	
	//巅峰之战--匹配
	export class PeakMatchingReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakMatchingReq {}
	}
	
	export class PeakMatchingRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		brief:  RoleBrief;// 敌方
		points:  number;// 积分
		rank:  number;// 段位
		heroes:  PeakHero[] = [];// 敌方上阵列表

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakMatchingRsp {}
	}
	
	export class PeakEnterHeroes implements Message {
		playerId:  number;
		heroList:  FightHero[] = [];
		general:  FightGeneral;// 前端从配置表读取指挥官信息

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakEnterHeroes {}
	}
	
	//巅峰之战--购买战斗次数
	export class PeakBuyEnterTimeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakBuyEnterTimeReq {}
	}
	
	export class PeakBuyEnterTimeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		buyEnterTimes:  number;// 购买挑战次数

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakBuyEnterTimeRsp {}
	}
	
	//巅峰之战--进入战斗
	export class PeakEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakEnterReq {}
	}
	
	export class PeakEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		enterTimes:  number;// 已挑战次数

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakEnterRsp {}
	}
	
	//巅峰之战--获取战斗数据
	export class PeakFightReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakFightReq {}
	}
	
	export class PeakFightRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mine:  PeakEnterHeroes;
		enemy:  PeakEnterHeroes;

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakFightRsp {}
	}
	
	//巅峰之战--退出战斗
	export class PeakExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		clear:  boolean;// 是否胜利

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakExitReq {}
	}
	
	export class PeakExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		enterTimes:  number;// 已挑战次数
		points:  number;// 拥有的积分数
		rank:  number;// 段位
		addPoints:  number;// 本场得到的积分，输了有可能是负的
		rankBf:  number;// 之前的段位
		rankingBf:  number;// 之前的排名
		ranking:  number;// 新的排名

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakExitRsp {}
	}
	
	//巅峰之战--挑战奖励，段位奖励
	export class PeakRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		career:  number;// 选择的职业
		heroId:  number;// 英雄id
		times:  number;// 挑战次数
		grade:  number;// 段位次数，大于零表示领取挑战奖励，第二次领取英雄

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakRewardReq {}
	}
	
	export class PeakRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		gradeReward:  number[] = [];// 段位物品奖励领取记录(位图)
		gradeHero:  number[] = [];// 段位英雄奖励领取记录(位图)
		challenge:  number[] = [];// 挑战励领取记录(位图)
		heroes:  PeakHero[] = [];// 获得的英雄
		list:  GoodsInfo[] = [];// 挑战奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakRewardRsp {}
	}
	
	//巅峰之战--英雄置换记录
	export class PeakHeroDisplaceRecordReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakHeroDisplaceRecordReq {}
	}
	
	export class PeakHeroDisplaceRecordRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		hero:  number[] = [];// 已随出过的英雄

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakHeroDisplaceRecordRsp {}
	}
	
	//巅峰之战--英雄置换
	export class PeakHeroDisplaceReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakHeroDisplaceReq {}
	}
	
	export class PeakHeroDisplaceRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		displaceTimes:  number;// 已置换次数
		hero:  PeakHero;// 随出的英雄

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakHeroDisplaceRsp {}
	}
	
	//巅峰之战--英雄置换确认
	export class PeakHeroDisplaceConfirmReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakHeroDisplaceConfirmReq {}
	}
	
	export class PeakHeroDisplaceConfirmRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		hero:  PeakHero;// 确认的英雄

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakHeroDisplaceConfirmRsp {}
	}
	
	//巅峰之战--重置英雄置换记录
	export class PeakHeroResetDisplaceRecordReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakHeroResetDisplaceRecordReq {}
	}
	
	export class PeakHeroResetDisplaceRecordRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		hero:  number[] = [];// 已随出过的英雄

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakHeroResetDisplaceRecordRsp {}
	}
	
	export class PeakRecord implements Message {
		brief:  RoleBrief[] = [];// 0-挑战者，1-敌人
		time:  number;// 时间
		points:  number;// 挑战者拥有的积分数
		rank:  number;// 挑战者段位
		addPoints:  number;// 挑战者添加的积分，负数表示失败
		enemyPoints:  number;// 敌人拥有的积分数
		enemyRank:  number;// 敌人段位
		enemyAddPoints:  number;// 敌人添加的积分，负数表示失败

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakRecord {}
	}
	
	//巅峰之战--记录
	export class PeakRecordReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakRecordReq {}
	}
	
	export class PeakRecordRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		records:  PeakRecord[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakRecordRsp {}
	}
	
	export class PeakRankingBrief implements Message {
		brief:  RoleBrief;
		points:  number;// 拥有的积分数
		rank:  number;// 段位
		heroes:  PeakHero[] = [];// 上阵列表

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakRankingBrief {}
	}
	
	//巅峰之战--排行榜
	export class PeakRankingReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakRankingReq {}
	}
	
	export class PeakRankingRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mine:  number;// 自己在第几名
		list:  PeakRankingBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakRankingRsp {}
	}
	
	//巅峰之战--名片英雄信息
	export class PeakHeroImageReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		careerType:  number;
		careerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakHeroImageReq {}
	}
	
	export class PeakHeroImageRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		hero:  HeroImage;
		careerType:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakHeroImageRsp {}
	}
	
	//巅峰之战--转职
	export class PeakHeroCareerReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		careerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakHeroCareerReq {}
	}
	
	export class PeakHeroCareerRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PeakHeroCareerRsp {}
	}
	
	//兵团--状态
	export class SoldierSkinStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierSkinStateReq {}
	}
	
	export class SoldierSkinStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		skins:  number[] = [];// 已激活的精甲
		trammels:  number[] = [];// 已激活的羁绊
		level:  number;// 融甲等级

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierSkinStateRsp {}
	}
	
	//兵团--激活精甲
	export class SoldierSkinActiveReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		skinId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierSkinActiveReq {}
	}
	
	export class SoldierSkinActiveRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		skinId:  number;
		skins:  number[] = [];// 已激活的精甲

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierSkinActiveRsp {}
	}
	
	//兵团--激活羁绊
	export class SoldierSkinActiveTrammelReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		trammelId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierSkinActiveTrammelReq {}
	}
	
	export class SoldierSkinActiveTrammelRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		trammels:  number[] = [];// 已激活的羁绊

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierSkinActiveTrammelRsp {}
	}
	
	export class SoldierSkin implements Message {
		heroId:  number;
		skinId:  number;// 0-脱下

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierSkin {}
	}
	
	//兵团--精甲穿戴
	export class SoldierSkinOnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroes:  SoldierSkin[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierSkinOnReq {}
	}
	
	//兵团--英雄精甲变换会主动推送（下阵、更换士兵等）
	export class SoldierSkinOnRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroes:  SoldierSkin[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierSkinOnRsp {}
	}
	
	//兵团--融甲
	export class SoldierSkinComposeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		items:  GoodsInfo[] = [];// 合成材料

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierSkinComposeReq {}
	}
	
	//兵团--融甲
	export class SoldierSkinComposeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		level:  number;// 融甲等级

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierSkinComposeRsp {}
	}
	
	export class Rune2Info implements Message {
		id:  number;
		type:  number;
		upgradeLv:  number;
		refineLv:  number;
		bless:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): Rune2Info {}
	}
	
	//符文2--列表
	export class Rune2ListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): Rune2ListReq {}
	}
	
	export class Rune2ListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  Rune2Info[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Rune2ListRsp {}
	}
	
	//符文2--分解
	export class Rune2BreakDownReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		runeIds:  number[] = [];// 符文id

		encode(writer: IWriter) {}
		decode(reader: IReader): Rune2BreakDownReq {}
	}
	
	export class Rune2BreakDownRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		goodsList:  GoodsInfo[] = [];// 物品

		encode(writer: IWriter) {}
		decode(reader: IReader): Rune2BreakDownRsp {}
	}
	
	//符文2--合成
	export class Rune2ComposeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		targetType:  number;// 目标符文类型
		staffList:  number[] = [];// 材料符文

		encode(writer: IWriter) {}
		decode(reader: IReader): Rune2ComposeReq {}
	}
	
	export class Rune2ComposeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		newRune:  Rune2Info;// 强化后得到符文
		goodsList:  GoodsInfo[] = [];// 新符文

		encode(writer: IWriter) {}
		decode(reader: IReader): Rune2ComposeRsp {}
	}
	
	//符文2--穿戴，卸下，更换
	export class Rune2OnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 英雄id
		index:  number;// 符文位置（下标）
		runeId:  number;// 符文id

		encode(writer: IWriter) {}
		decode(reader: IReader): Rune2OnReq {}
	}
	
	// 强化、分解英雄身上的符文会推送这个协议
	export class Rune2OnRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		runes:  Rune2Info[] = [];// 0-1号位，1-2号位

		encode(writer: IWriter) {}
		decode(reader: IReader): Rune2OnRsp {}
	}
	
	export class Rune2UpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		updateList:  Rune2Info[] = [];
		deleteList:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Rune2UpdateRsp {}
	}
	
	//符文2--强化
	export class Rune2UpgradeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		runeId:  number;// 需要强化的符文id
		toTop:  boolean;// 是否一键强化

		encode(writer: IWriter) {}
		decode(reader: IReader): Rune2UpgradeReq {}
	}
	
	export class Rune2UpgradeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		runeId:  number;//
		oldLevel:  number;// 强化前等级
		newLevel:  number;// 强化后等级
		goodsList:  GoodsInfo[] = [];// 物品，直接强化英雄身上的符文时这个字段是空

		encode(writer: IWriter) {}
		decode(reader: IReader): Rune2UpgradeRsp {}
	}
	
	//符文2--融合
	export class Rune2MixReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		mainRuneId:  number;// 主符文ID
		subRuneId:  number;// 材料符文ID

		encode(writer: IWriter) {}
		decode(reader: IReader): Rune2MixReq {}
	}
	
	export class Rune2MixRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 0-背包，大于0-英雄
		rune:  Rune2Info;//
		goodsList:  GoodsInfo[] = [];// 物品，直接强化英雄身上的符文时这个字段是空

		encode(writer: IWriter) {}
		decode(reader: IReader): Rune2MixRsp {}
	}
	
	//符文2--洗练
	export class Rune2RefineReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;//0-背包，大于0-英雄
		runeId:  number;//要进行洗练的符文Id
		refineType:  number;//洗练类型

		encode(writer: IWriter) {}
		decode(reader: IReader): Rune2RefineReq {}
	}
	
	export class Rune2RefineRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		runeId:  number;//
		oldLevel:  number;// 强化前等级
		newLevel:  number;// 强化后等级
		refineType:  number;//洗练类型, 3是祝福升级
		goodsList:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Rune2RefineRsp {}
	}
	
	export class CrossTreasureOrderName implements Message {
		order:  number;// 格子序号
		names:  string[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): CrossTreasureOrderName {}
	}
	
	//跨服寻宝-数量信息，主动推送
	//玩家登录,订阅SystemSubscribeReq信息,离开或者关闭游戏取消订阅
	export class CrossTreasureNumRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		dayRound:  number;// 本日第几轮
		refreshTime:  number;// 大于0表示终极大奖被抽取后的刷新时间
		itemNum:  number[] = [];// 物品被抽到次数，数组长度9，下标0对应1号格子
		record:  CrossTreasureRecord[] = [];// 追加的抽奖记录，十连抽会有十条记录
		orderName:  CrossTreasureOrderName[] = [];// 每个格子需要追加的名字

		encode(writer: IWriter) {}
		decode(reader: IReader): CrossTreasureNumRsp {}
	}
	
	//跨服寻宝-首次进入页面时请求
	export class CrossTreasureStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): CrossTreasureStateReq {}
	}
	
	export class CrossTreasureStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		dayRound:  number;// 本日第几轮
		round:  number;// 第几轮
		freeNum:  number;// 今日剩余免费次数
		refreshTime:  number;
		itemNum:  number[] = [];
		orderName:  CrossTreasureOrderName[] = [];// 每个格子三个

		encode(writer: IWriter) {}
		decode(reader: IReader): CrossTreasureStateRsp {}
	}
	
	export class CrossTreasure implements Message {
		order:  number;// 格子
		rewards:  GoodsInfo[] = [];// 奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): CrossTreasure {}
	}
	
	//跨服寻宝-抽奖
	export class CrossTreasureReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		num:  number;// 抽多少次

		encode(writer: IWriter) {}
		decode(reader: IReader): CrossTreasureReq {}
	}
	
	export class CrossTreasureRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		freeNum:  number;// 今日剩余免费次数
		rewards:  CrossTreasure[] = [];// 奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): CrossTreasureRsp {}
	}
	
	export class CrossTreasureRecord implements Message {
		playerName:  string;// 玩家名称
		itemId:  number;// 物品id
		time:  number;// 时间
		type:  number;// 1-本轮大奖，2-终极大奖，3-两个都是
		leftTimes:  number;// 剩余抽数

		encode(writer: IWriter) {}
		decode(reader: IReader): CrossTreasureRecord {}
	}
	
	//跨服寻宝-抽奖记录
	export class CrossTreasureRecordListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): CrossTreasureRecordListReq {}
	}
	
	export class CrossTreasureRecordListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		record:  CrossTreasureRecord[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): CrossTreasureRecordListRsp {}
	}
	
	//守护者--召唤状态
	export class GuardianDrawStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianDrawStateReq {}
	}
	
	export class GuardianDrawStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		wishItemId:  number;//许愿物品
		drawnNum:  number;//累计次数
		numByGems:  number;//本周使用钻石次数
		cumAwardFlag:  number;//已领取累计奖励标志，按位表示
		cumIsMonthGain:  boolean;//领取的是否当月奖励，false是上个月的，true是当月的

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianDrawStateRsp {}
	}
	
	//守护者--召唤
	export class GuardianDrawReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianDrawReq {}
	}
	
	export class GuardianDrawRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianDrawRsp {}
	}
	
	//守护者--许愿
	export class GuardianWishReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		itemId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianWishReq {}
	}
	
	export class GuardianWishRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		itemId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianWishRsp {}
	}
	
	//守护者--累计次数奖励
	export class GuardianCumAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianCumAwardReq {}
	}
	
	export class GuardianCumAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		drawnNum:  number;//新的累计次数
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianCumAwardRsp {}
	}
	
	//守护者副本--信息
	export class GuardianCopyStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianCopyStateReq {}
	}
	
	export class GuardianCopyStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		open:  boolean;// 副本是否开启
		maxStageId:  number;// 通过的最大关卡
		raidNum:  number;// 今日已扫荡次数

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianCopyStateRsp {}
	}
	
	//守护者副本--进入战斗
	export class GuardianCopyEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianCopyEnterReq {}
	}
	
	export class GuardianCopyEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianCopyEnterRsp {}
	}
	
	//守护者副本--结束战斗
	export class GuardianCopyExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		clear:  boolean;// 是否通关

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianCopyExitReq {}
	}
	
	export class GuardianCopyExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		rewards:  GoodsInfo[] = [];//首通奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianCopyExitRsp {}
	}
	
	//守护者副本--扫荡
	export class GuardianCopyRaidReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		all:  boolean;// 一键扫荡

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianCopyRaidReq {}
	}
	
	export class GuardianCopyRaidRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		raidNum:  number;// 今日已扫荡次数
		stageId:  number;// 扫荡的关卡
		rewards:  GoodsInfo[] = [];// 奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianCopyRaidRsp {}
	}
	
	export class Guardian implements Message {
		id:  number;
		type:  number;
		star:  number;
		level:  number;
		equips:  GuardianEquip[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Guardian {}
	}
	
	//守护者系统--列表
	export class GuardianListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianListReq {}
	}
	
	export class GuardianListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  Guardian[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianListRsp {}
	}
	
	//守护者系统--升级
	export class GuardianLevelUpReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		guardianId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianLevelUpReq {}
	}
	
	export class GuardianLevelUpRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroInfo:  HeroInfo;
		guardian:  Guardian;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianLevelUpRsp {}
	}
	
	//守护者系统--升星
	export class GuardianStarUpReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		guardianId:  number;
		stuffIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianStarUpReq {}
	}
	
	export class GuardianStarUpRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroInfo:  HeroInfo;
		guardian:  Guardian;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianStarUpRsp {}
	}
	
	//守护者系统--出战
	export class GuardianPutOnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		guardianId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianPutOnReq {}
	}
	
	export class GuardianPutOnRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		hero:  HeroInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianPutOnRsp {}
	}
	
	//守护者系统--卸下
	export class GuardianTakeOffReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianTakeOffReq {}
	}
	
	export class GuardianTakeOffRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		hero:  HeroInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianTakeOffRsp {}
	}
	
	//守护者系统--分解
	export class GuardianDecomposeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		ids:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianDecomposeReq {}
	}
	
	export class GuardianDecomposeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		ids:  number[] = [];
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianDecomposeRsp {}
	}
	
	//守护者系统--更新背包
	export class GuardianUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  Guardian[] = [];
		delete:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianUpdateRsp {}
	}
	
	//守护者装备结构
	export class GuardianEquip implements Message {
		id:  number;
		type:  number;
		star:  number;
		level:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianEquip {}
	}
	
	export class GuardianInHero implements Message {
		heroId:  number;//背包内守护者为0
		guardianId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianInHero {}
	}
	
	export class GuardianEquipWithPart implements Message {
		equipId:  number;
		part:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianEquipWithPart {}
	}
	
	//守护者装备--列表
	export class GuardianEquipListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianEquipListReq {}
	}
	
	export class GuardianEquipListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GuardianEquip[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianEquipListRsp {}
	}
	
	//守护者装备--穿戴
	export class GuardianEquipOnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		target:  GuardianInHero;
		equipList:  GuardianEquipWithPart[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianEquipOnReq {}
	}
	
	export class GuardianEquipOnRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guardian:  Guardian;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianEquipOnRsp {}
	}
	
	// 守护者装备--脱下
	export class GuardianEquipOffReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		target:  GuardianInHero;
		part:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianEquipOffReq {}
	}
	
	export class GuardianEquipOffRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guardian:  Guardian;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianEquipOffRsp {}
	}
	
	//守护者装备--更新
	export class GuardianEquipUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GuardianEquip[] = [];
		delete:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianEquipUpdateRsp {}
	}
	
	//守护者装备--分解
	export class GuardianEquipDecomposeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianEquipDecomposeReq {}
	}
	
	export class GuardianEquipDecomposeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		ids:  number[] = [];
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianEquipDecomposeRsp {}
	}
	
	//守护者装备--强化
	export class GuardianEquipLevelUpReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		target:  GuardianInHero;
		part:  number;
		top:  boolean;// 是否一键强化

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianEquipLevelUpReq {}
	}
	
	export class GuardianEquipLevelUpRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guardian:  Guardian;
		oldLv:  number;
		newLv:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianEquipLevelUpRsp {}
	}
	
	//守护者装备--突破
	export class GuardianEquipStarUpReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		target:  GuardianInHero;
		part:  number;
		cost1:  number[] = [];
		cost2:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianEquipStarUpReq {}
	}
	
	export class GuardianEquipStarUpRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guardian:  Guardian;
		oldStar:  number;
		newStar:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianEquipStarUpRsp {}
	}
	
	//守护者秘境--状态
	export class GuardianTowerStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianTowerStateReq {}
	}
	
	export class GuardianTowerStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		open:  boolean;// 是否开启
		maxStageId:  number;// 通过的最大关卡
		raidNum:  number;// 今日已扫荡次数
		buyRaidNum:  number;// 今日购买扫荡次数
		mineRank:  number;// 当前玩家排名
		serverNm:  number;// 跨服组服务器数量

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianTowerStateRsp {}
	}
	
	//守护者秘境--进入战斗
	export class GuardianTowerEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;// 关卡id

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianTowerEnterReq {}
	}
	
	export class GuardianTowerEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		enemy:  ArenaFighter;// 对手战斗信息

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianTowerEnterRsp {}
	}
	
	//守护者秘境--结束战斗
	export class GuardianTowerExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		clear:  boolean;// 是否通关

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianTowerExitReq {}
	}
	
	export class GuardianTowerExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stageId:  number;
		rankMine:  number;
		rewards:  GoodsInfo[] = [];//首通奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianTowerExitRsp {}
	}
	
	//守护者秘境--一键扫荡
	export class GuardianTowerRaidReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianTowerRaidReq {}
	}
	
	export class GuardianTowerRaidRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		raidNum:  number;// 今日已扫荡次数
		buyRaidNum:  number;// 今日购买扫荡次数
		stageId:  number;// 扫荡的关卡
		rewards:  GoodsInfo[] = [];// 奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianTowerRaidRsp {}
	}
	
	//守护者秘境--购买扫荡次数
	export class GuardianTowerRaidBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianTowerRaidBuyReq {}
	}
	
	export class GuardianTowerRaidBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		buyRaidNum:  number;// 今日购买扫荡次数

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianTowerRaidBuyRsp {}
	}
	
	export class GuardianTowerRankBrief implements Message {
		brief:  RoleBrief;
		layer:  number;// 层数

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianTowerRankBrief {}
	}
	
	//守护者秘境--排行榜
	export class GuardianTowerRankListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianTowerRankListReq {}
	}
	
	export class GuardianTowerRankListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		serverNum:  number;// 跨服组中游戏服数量
		mine:  number;// 当前玩家排名
		list:  GuardianTowerRankBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianTowerRankListRsp {}
	}
	
	//守护者-守护者回退预览
	export class GuardianFallbackPreviewReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianFallbackPreviewReq {}
	}
	
	export class GuardianFallbackPreviewRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guardian:  Guardian;
		list:  GoodsInfo[] = [];
		equips:  GuardianEquip[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianFallbackPreviewRsp {}
	}
	
	//守护者-守护者回退
	export class GuardianFallbackReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianFallbackReq {}
	}
	
	export class GuardianFallbackRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guardian:  Guardian;
		list:  GoodsInfo[] = [];
		equips:  GuardianEquip[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuardianFallbackRsp {}
	}
	
	export class AssistAlliance implements Message {
		allianceId:  number;
		activeStar:  number;// 当前的星级档次,大于0表示激活
		heroIds:  number[] = [];// 英雄独立id

		encode(writer: IWriter) {}
		decode(reader: IReader): AssistAlliance {}
	}
	
	//协战联盟--状态
	export class AssistAllianceStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): AssistAllianceStateReq {}
	}
	
	export class AssistAllianceStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		legionLevel:  number;
		assistAlliances:  AssistAlliance[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): AssistAllianceStateRsp {}
	}
	
	//协战联盟--上阵
	export class AssistAllianceOnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;// 英雄独立id，0-英雄下阵
		allianceId:  number;// 联盟id
		index:  number;// 下标

		encode(writer: IWriter) {}
		decode(reader: IReader): AssistAllianceOnReq {}
	}
	
	export class AssistAllianceOnRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		assistAlliance:  AssistAlliance;

		encode(writer: IWriter) {}
		decode(reader: IReader): AssistAllianceOnRsp {}
	}
	
	//协战联盟--军团升级
	export class AssistAllianceLegionReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): AssistAllianceLegionReq {}
	}
	
	export class AssistAllianceLegionRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		legionLevel:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): AssistAllianceLegionRsp {}
	}
	
	export class AssistAllianceGiftRecord implements Message {
		giftId:  number;// 礼包id
		record:  number;// 1-免费，2-购买，3-已领取已购买

		encode(writer: IWriter) {}
		decode(reader: IReader): AssistAllianceGiftRecord {}
	}
	
	//协战联盟--礼包记录，只返回购买或者领取过的礼包
	export class AssistAllianceGiftRecordReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): AssistAllianceGiftRecordReq {}
	}
	
	//协战联盟--MaxStar改变主动推送
	export class AssistAllianceGiftRecordRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		maxStar:  number;
		giftRecords:  AssistAllianceGiftRecord[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): AssistAllianceGiftRecordRsp {}
	}
	
	//协战联盟--领取免费，购买走PayOrderReq
	export class AssistAllianceGiftReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		giftId:  number;// 礼包id

		encode(writer: IWriter) {}
		decode(reader: IReader): AssistAllianceGiftReq {}
	}
	
	export class AssistAllianceGiftRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		giftId:  number;// 礼包id
		giftRecords:  AssistAllianceGiftRecord[] = [];
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): AssistAllianceGiftRsp {}
	}
	
	//协战联盟--激活
	export class AssistAllianceActivateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		allianceId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): AssistAllianceActivateReq {}
	}
	
	export class AssistAllianceActivateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		assistAlliance:  AssistAlliance;

		encode(writer: IWriter) {}
		decode(reader: IReader): AssistAllianceActivateRsp {}
	}
	
	//扭蛋--状态
	export class TwistEggStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): TwistEggStateReq {}
	}
	
	export class TwistEggStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewarded:  number;
		wishIdxs:  number[] = [];
		subType:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): TwistEggStateRsp {}
	}
	
	//扭蛋--许愿
	export class TwistEggWishReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		wishIdxs:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): TwistEggWishReq {}
	}
	
	export class TwistEggWishRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		wishIdxs:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): TwistEggWishRsp {}
	}
	
	//扭蛋--抽奖
	export class TwistEggDrawReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): TwistEggDrawReq {}
	}
	
	export class TwistEggDrawRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewarded:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): TwistEggDrawRsp {}
	}
	
	//合服狂欢--限购商店-商品信息
	export class MergeCarnivalStoreGoods implements Message {
		money:  number;// 档次
		left:  number;// 剩余数量
		bought:  boolean;// 是否买过

		encode(writer: IWriter) {}
		decode(reader: IReader): MergeCarnivalStoreGoods {}
	}
	
	//合服狂欢--限购商店
	export class MergeCarnivalStoreReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MergeCarnivalStoreReq {}
	}
	
	export class MergeCarnivalStoreRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		money:  number;// 活动期间内充值
		goods:  MergeCarnivalStoreGoods[] = [];// 只返回有购买记录商品
		ydLoginNum:  number;// 昨日登录人数

		encode(writer: IWriter) {}
		decode(reader: IReader): MergeCarnivalStoreRsp {}
	}
	
	//合服狂欢--限购商店-购买
	export class MergeCarnivalStoreBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		money:  number;// 档次

		encode(writer: IWriter) {}
		decode(reader: IReader): MergeCarnivalStoreBuyReq {}
	}
	
	export class MergeCarnivalStoreBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		goods:  MergeCarnivalStoreGoods;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MergeCarnivalStoreBuyRsp {}
	}
	
	//合服狂欢--限购商店-剩余数量广播
	export class MergeCarnivalStoreLeftRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		money:  number;// 档次
		left:  number;// 剩余数量

		encode(writer: IWriter) {}
		decode(reader: IReader): MergeCarnivalStoreLeftRsp {}
	}
	
	//合服狂欢--信息
	export class MergeCarnivalStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MergeCarnivalStateReq {}
	}
	
	export class MergeCarnivalStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		score:  number;// 玩家积分
		exchangeRecord:  number[] = [];// 兑换记录，位图，id-1
		ranking:  number;// 玩家个人今日排名

		encode(writer: IWriter) {}
		decode(reader: IReader): MergeCarnivalStateRsp {}
	}
	
	//合服狂欢--兑换
	export class MergeCarnivalExchangeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MergeCarnivalExchangeReq {}
	}
	
	export class MergeCarnivalExchangeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		score:  number;// 玩家积分
		exchangeRecord:  number[] = [];// 兑换记录
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MergeCarnivalExchangeRsp {}
	}
	
	//合服狂欢--玩家积分，领取任务奖励后返回玩家添加的积分
	export class MergeCarnivalPlayerScoreRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		addScore:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): MergeCarnivalPlayerScoreRsp {}
	}
	
	//合服狂欢--服务器排名
	export class MergeCarnivalServerRankReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MergeCarnivalServerRankReq {}
	}
	
	export class MergeCarnivalServerRankRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		ranking:  number;// 排名
		score:  number;// 积分
		rankingInfo:  CarnivalServerInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): MergeCarnivalServerRankRsp {}
	}
	
	//合服狂欢--玩家当前服务器排名
	export class MergeCarnivalCurServerRankReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): MergeCarnivalCurServerRankReq {}
	}
	
	export class MergeCarnivalCurServerRankRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		ranking:  number;// 排名
		score:  number;// 积分

		encode(writer: IWriter) {}
		decode(reader: IReader): MergeCarnivalCurServerRankRsp {}
	}
	
	export class WorldEnvelope implements Message {
		id:  number;// 红包id
		typeId:  number;// gift_id
		name:  string;// 玩家名
		guildName:  string;// 公会名
		sendTime:  number;// 发出时间
		got:  boolean;// 是否已抢

		encode(writer: IWriter) {}
		decode(reader: IReader): WorldEnvelope {}
	}
	
	export class WorldEnvelopeRank implements Message {
		role:  RoleBrief;// 玩家
		guild:  GuildBrief;// 公会
		name:  string;// 公会名或玩家名
		value:  number;// 总价值
		num:  number;// 红包数

		encode(writer: IWriter) {}
		decode(reader: IReader): WorldEnvelopeRank {}
	}
	
	//世界红包--排行榜
	export class WorldEnvelopeRankReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;// 1：个人榜 2：公会榜

		encode(writer: IWriter) {}
		decode(reader: IReader): WorldEnvelopeRankReq {}
	}
	
	export class WorldEnvelopeRankRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;// 1：个人榜 2：公会榜
		rank:  WorldEnvelopeRank[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): WorldEnvelopeRankRsp {}
	}
	
	//世界红包--红包列表
	export class WorldEnvelopeListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		minId:  number;
		index:  number;
		count:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): WorldEnvelopeListReq {}
	}
	
	export class WorldEnvelopeListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		list:  WorldEnvelope[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): WorldEnvelopeListRsp {}
	}
	
	//世界红包--红包ID
	export class WorldEnvelopeIdReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): WorldEnvelopeIdReq {}
	}
	
	export class WorldEnvelopeIdRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		maxGotId:  number;
		maxEnvId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): WorldEnvelopeIdRsp {}
	}
	
	//世界红包--抢红包
	export class WorldEnvelopeGetReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): WorldEnvelopeGetReq {}
	}
	
	export class WorldEnvelopeGetRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		maxGotId:  number;
		goods:  GoodsInfo[] = [];// 奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): WorldEnvelopeGetRsp {}
	}
	
	export class Adventure2Hero implements Message {
		type:  number;// 0-解锁拥有（包含主题英雄），1-佣兵
		heroId:  number;// 独立id（后端生成）
		group:  number;// 佣兵组id
		typeId:  number;// 英雄id
		useTimes:  number;// 使用次数
		level:  number;
		soldierId:  number;
		star:  number;
		careerLv:  number;
		power:  number;
		careerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2Hero {}
	}
	
	//奇境探险--难度
	export class Adventure2Difficulty implements Message {
		difficulty:  number;// 难度
		layerId:  number;// 第几层
		plateIndex:  number;// 当前板块序号
		blood:  number;// 玩家生命值
		consumption:  number;// 回复泉水每日使用次数
		clearTimes:  number;// 战斗胜利次数
		plateFinish:  boolean;// 板块事件是否完成
		lastPlate:  number;// 前一个板块
		entryList:  number[] = [];// 拥有的增益遗物
		lastEntryList:  number[] = [];// 上一次死亡拥有的增益遗物
		historyPlate:  number[] = [];// 本次走过的板块
		lastPlates:  number[] = [];// 上一次死亡走过的板块
		allPlates:  number[] = [];// 当前层走过的板块
		randomIds:  number[] = [];// 随机事件id
		line:  number;// 无尽模式选择的路线 ，0-未选择
		stageId:  number;// 战斗关卡
		stageCount:  number;// 本层战斗奖励次数
		finish:  boolean;// 难度是否完成

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2Difficulty {}
	}
	
	//奇境探险--进度
	export class Adventure2StateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2StateReq {}
	}
	
	export class Adventure2StateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		avgPower:  number;// 平均战力
		avgLevel:  number;// 平均等级
		heroes:  Adventure2Hero[] = [];// 拥有的英雄
		heroOn:  number[] = [];// 上阵列表
		normal:  Adventure2Difficulty;// 普通难度状态
		endLess:  Adventure2Difficulty;// 无尽难度状态
		rewarded:  number;// 难度奖励领取状态，位图，难度减1

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2StateRsp {}
	}
	
	//奇境探险--回复生命值
	export class Adventure2ConsumptionReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2ConsumptionReq {}
	}
	
	export class Adventure2ConsumptionRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficultyState:  Adventure2Difficulty;// 难度状态

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2ConsumptionRsp {}
	}
	
	//奇境探险--选中板块，不能再选同一行的其他板块，关卡、旅人商店事件使用
	export class Adventure2PlateEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2PlateEnterReq {}
	}
	
	export class Adventure2PlateEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号
		stageId:  number;// 进入关卡板块时返回关卡id

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2PlateEnterRsp {}
	}
	
	export class Adventure2EnterHeroes implements Message {
		playerId:  number;
		heroList:  FightHero[] = [];
		general:  FightGeneral;

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2EnterHeroes {}
	}
	
	//奇境探险--板块事件--进入关卡战斗
	export class Adventure2EnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2EnterReq {}
	}
	
	export class Adventure2EnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号
		group:  number;// 第几波怪物
		fightState:  string;// 战斗状态，需要保存什么数据前端自定义
		heroes:  Adventure2EnterHeroes;// 战斗数据

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2EnterRsp {}
	}
	
	//奇境探险--板块事件--退出关卡战斗
	export class Adventure2ExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		blood:  number;// 玩家生命值
		plateIndex:  number;// 板块序号
		group:  number;// 第几波怪物
		fightState:  string;// 战斗状态，需要保存什么数据前端自定义

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2ExitReq {}
	}
	
	export class Adventure2ExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		blood:  number;// 玩家生命值
		plateIndex:  number;// 板块序号
		rankBf:  number;// 战斗前排名，0表示没有排名
		rankAf:  number;// 战斗后排名
		heros:  Adventure2Hero[] = [];// 上阵英雄，前端更新佣兵使用次数
		deleteHeroIds:  number[] = [];// 使用次数为0，需要下阵，删除的英雄
		randomIds:  number[] = [];// 拥有的随机事件id
		stageCount:  number;// 本层战斗奖励次数
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2ExitRsp {}
	}
	
	export class Adventure2Trave implements Message {
		id:  number;// 物品序号
		times:  number;// 已购买次数

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2Trave {}
	}
	
	//奇境探险--板块事件--旅行商人商品列表
	export class Adventure2TravelListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2TravelListReq {}
	}
	
	export class Adventure2TravelListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号
		travelIndex:  Adventure2Trave[] = [];// 物品列表

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2TravelListRsp {}
	}
	
	//奇境探险--板块事件--旅行商人购买
	export class Adventure2TravelBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号
		id:  number;// 物品序号

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2TravelBuyReq {}
	}
	
	export class Adventure2TravelBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2TravelBuyRsp {}
	}
	
	//奇境探险--板块事件--旅行商人完成事件
	export class Adventure2TravelFinishReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2TravelFinishReq {}
	}
	
	export class Adventure2TravelFinishRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2TravelFinishRsp {}
	}
	
	//奇境探险--板块事件--佣兵列表
	export class Adventure2MercenaryListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2MercenaryListReq {}
	}
	
	export class Adventure2MercenaryListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号
		heroList:  Adventure2Hero[] = [];// 佣兵随机列表

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2MercenaryListRsp {}
	}
	
	//奇境探险--板块事件--选择佣兵
	export class Adventure2MercenaryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号
		group:  number;// 组id
		typeId:  number;// 英雄id

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2MercenaryReq {}
	}
	
	export class Adventure2MercenaryRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号
		giveHeros:  Adventure2Hero;// 添加的佣兵英雄

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2MercenaryRsp {}
	}
	
	//奇境探险--板块事件--增益遗物列表
	export class Adventure2EntryListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2EntryListReq {}
	}
	
	export class Adventure2EntryListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号
		entryList:  number[] = [];// 增益遗物随机列表

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2EntryListRsp {}
	}
	
	//奇境探险--板块事件--增益遗物选择
	export class Adventure2EntrySelectReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号
		id:  number;// 增益遗物hardcore_id

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2EntrySelectReq {}
	}
	
	export class Adventure2EntrySelectRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号
		entryList:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2EntrySelectRsp {}
	}
	
	//奇境探险--板块事件--随机事件
	export class Adventure2RandomReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2RandomReq {}
	}
	
	export class Adventure2RandomRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号
		randomId:  number;// 本次获得的随机事件id
		randomIds:  number[] = [];// 拥有的随机事件id

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2RandomRsp {}
	}
	
	//奇境探险--板块事件--宝藏,广播协议使用SystemBroadcastRsp协议
	export class Adventure2TreasureReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2TreasureReq {}
	}
	
	export class Adventure2TreasureRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2TreasureRsp {}
	}
	
	//奇境探险--进入下一层，下一难度
	export class Adventure2NextReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2NextReq {}
	}
	
	export class Adventure2NextRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  Adventure2Difficulty;

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2NextRsp {}
	}
	
	export class Adventure2RankBrief implements Message {
		brief:  RoleBrief;
		layerId:  number;// 第几层
		plateIndex:  number;// 板块

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2RankBrief {}
	}
	
	//奇境探险--排行榜
	export class Adventure2RankListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2RankListReq {}
	}
	
	export class Adventure2RankListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		serverNum:  number;
		ranking:  number;// 排名
		layerId:  number;// 第几层
		plateIndex:  number;// 板块
		list:  Adventure2RankBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2RankListRsp {}
	}
	
	export class Adventure2StoreItem implements Message {
		id:  number;
		remain:  number;//剩余购买次数

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2StoreItem {}
	}
	
	//探险商店--列表
	export class Adventure2StoreListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2StoreListReq {}
	}
	
	export class Adventure2StoreListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  Adventure2StoreItem[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2StoreListRsp {}
	}
	
	//探险商店--购买
	export class Adventure2StoreBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		storeId:  number;
		num:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2StoreBuyReq {}
	}
	
	export class Adventure2StoreBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		storeItem:  Adventure2StoreItem;
		items:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2StoreBuyRsp {}
	}
	
	//探险证任务--列表
	export class Adventure2PassListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2PassListReq {}
	}
	
	export class Adventure2PassListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		bought:  boolean;
		rewarded1:  number[] = [];
		rewarded2:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2PassListRsp {}
	}
	
	//探险任务--领奖
	export class Adventure2PassAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2PassAwardReq {}
	}
	
	export class Adventure2PassAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		rewarded1:  number[] = [];
		rewarded2:  number[] = [];
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2PassAwardRsp {}
	}
	
	//奇境探险--英雄上阵
	export class Adventure2HeroOnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2HeroOnReq {}
	}
	
	export class Adventure2HeroOnRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2HeroOnRsp {}
	}
	
	//奇境探险--获得新的英雄广播
	export class Adventure2NewHeroRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroes:  Adventure2Hero;

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2NewHeroRsp {}
	}
	
	//奇境探险--名片英雄信息
	export class Adventure2HeroImageReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2HeroImageReq {}
	}
	
	export class Adventure2HeroImageRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		hero:  HeroImage;

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2HeroImageRsp {}
	}
	
	//奇境探险--英雄转职
	export class Adventure2HeroCareerReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		careerId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2HeroCareerReq {}
	}
	
	export class Adventure2HeroCareerRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		careerId:  number;
		soldierId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2HeroCareerRsp {}
	}
	
	//奇境探险--难度奖励
	export class Adventure2DifficultyRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2DifficultyRewardReq {}
	}
	
	export class Adventure2DifficultyRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewarded:  number;// 难度奖励领取状态，位图，难度减1
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2DifficultyRewardRsp {}
	}
	
	//奇境探险--路线选择
	export class Adventure2LineReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		line:  number;// 1，2，3

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2LineReq {}
	}
	
	export class Adventure2LineRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		line:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2LineRsp {}
	}
	
	//奇境探险--遗物兑换
	export class Adventure2EntryExchangeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		ids:  number[] = [];// 增益遗物hardcore_id

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2EntryExchangeReq {}
	}
	
	export class Adventure2EntryExchangeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		entryList:  number[] = [];// 增益遗物

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2EntryExchangeRsp {}
	}
	
	//奇境探险--重置遗物
	export class Adventure2EntryResetReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2EntryResetReq {}
	}
	
	export class Adventure2EntryResetRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;
		difficultyState:  Adventure2Difficulty;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2EntryResetRsp {}
	}
	
	//奇境探险--扫荡
	export class Adventure2RaidReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2RaidReq {}
	}
	
	export class Adventure2RaidRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		blood:  number;// 玩家生命值
		plateIndex:  number;// 板块序号
		stageCount:  number;// 本层战斗奖励次数
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2RaidRsp {}
	}
	
	//奇境探险--存档
	export class Adventure2SaveStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2SaveStateReq {}
	}
	
	export class Adventure2SaveStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2SaveStateRsp {}
	}
	
	//奇境探险--跳过历史板块，不能跳过战斗和遗物
	export class Adventure2SkipReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2SkipReq {}
	}
	
	export class Adventure2SkipRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		difficulty:  number;// 难度
		plateIndex:  number;// 板块序号

		encode(writer: IWriter) {}
		decode(reader: IReader): Adventure2SkipRsp {}
	}
	
	export class PiecesHero implements Message {
		heroId:  number;// 独立id（后端生成）
		typeId:  number;// 英雄id
		line:  number;// 路线
		star:  number;
		power:  number;
		pos:  number;//0~5为上阵，100~107为备战区

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesHero {}
	}
	
	export class PiecesRankBrief implements Message {
		brief:  RoleBrief;
		rank:  number;// 排名
		totalRound:  number;// 总回合

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesRankBrief {}
	}
	
	//末日自走棋--查看信息
	export class PiecesInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesInfoReq {}
	}
	
	export class PiecesInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		restChallengeTimes:  number;//剩余挑战次数
		restBuyTimes:  number;//剩余购买次数
		score:  number;//积分
		gainRankAward:  number[] = [];//已领取的段位奖励
		talentPoint:  number;//天赋点
		talentList:  number[] = [];//天赋列表

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesInfoRsp {}
	}
	
	//末日自走棋--购买次数
	export class PiecesBuyTimeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesBuyTimeReq {}
	}
	
	export class PiecesBuyTimeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		restBuyTimes:  number;//剩余挑战次数

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesBuyTimeRsp {}
	}
	
	//末日自走棋--点亮天赋
	export class PiecesLightUpTalentReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		talentId:  number;//发0的时候重置天赋

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesLightUpTalentReq {}
	}
	
	export class PiecesLightUpTalentRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		talentId:  number;
		talentPoint:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesLightUpTalentRsp {}
	}
	
	//末日自走棋--查看排行榜
	export class PiecesRankListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesRankListReq {}
	}
	
	export class PiecesRankListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  PiecesRankBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesRankListRsp {}
	}
	
	//末日自走棋--领取段位奖励
	export class PiecesGainDivisionRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rank:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesGainDivisionRewardReq {}
	}
	
	export class PiecesGainDivisionRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rank:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesGainDivisionRewardRsp {}
	}
	
	//末日自走棋--购买英雄界面
	export class PiecesBuyHeroPanelReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesBuyHeroPanelReq {}
	}
	
	export class PiecesBuyHeroPanelRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		isLock:  boolean;
		list:  number[] = [];
		silver:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesBuyHeroPanelRsp {}
	}
	
	//末日自走棋--刷新购买英雄界面
	export class PiecesRefreshBuyHeroPanelReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesRefreshBuyHeroPanelReq {}
	}
	
	export class PiecesRefreshBuyHeroPanelRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  number[] = [];
		silver:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesRefreshBuyHeroPanelRsp {}
	}
	
	//末日自走棋--锁定/解锁购买英雄界面
	export class PiecesLockBuyHeroPanelReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		isLock:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesLockBuyHeroPanelReq {}
	}
	
	export class PiecesLockBuyHeroPanelRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		isLook:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesLockBuyHeroPanelRsp {}
	}
	
	//末日自走棋--购买英雄
	export class PiecesBuyHeroReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  number;//英雄位置

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesBuyHeroReq {}
	}
	
	export class PiecesBuyHeroRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		pos:  number;
		silver:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesBuyHeroRsp {}
	}
	
	//末日自走棋--出售英雄
	export class PiecesSellHeroReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;//英雄Id

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesSellHeroReq {}
	}
	
	export class PiecesSellHeroRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		silver:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesSellHeroRsp {}
	}
	
	//末日自走棋--英雄转换路线
	export class PiecesHeroChangeLineReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;//英雄Id

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesHeroChangeLineReq {}
	}
	
	export class PiecesHeroChangeLineRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		hero:  PiecesHero[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesHeroChangeLineRsp {}
	}
	
	//末日自走棋--英雄更新
	export class PiecesHeroUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		updateHero:  PiecesHero;
		delHeroId:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesHeroUpdateRsp {}
	}
	
	//末日自走棋--更新英雄战力属性
	export class PiecesHeroAttrRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;
		power:  number;
		attr:  HeroAttr;

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesHeroAttrRsp {}
	}
	
	//末日自走棋--英雄列表
	export class PiecesHeroListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesHeroListReq {}
	}
	
	export class PiecesHeroListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  PiecesHero[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesHeroListRsp {}
	}
	
	//末日自走棋--上阵英雄
	export class PiecesHeroOnBattleReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;//备战区英雄id，传0为下阵
		pos:  number;//上阵位置

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesHeroOnBattleReq {}
	}
	
	export class PiecesHeroOnBattleRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		changeList:  PiecesHero[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesHeroOnBattleRsp {}
	}
	
	export class PiecesEnterHeroes implements Message {

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesEnterHeroes {}
	}
	
	//末日自走棋--进入战斗
	export class PiecesEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;// 类型，1无尽模式，2自走棋模式

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesEnterReq {}
	}
	
	export class PiecesEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;// 类型，1无尽模式，2自走棋模式
		computerTeamId:  number;//电脑阵容
		startRound:  number;
		playerHP:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesEnterRsp {}
	}
	
	//末日自走棋--请求阵容
	export class PiecesBattleArrayReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;// 类型，1无尽模式，2自走棋模式

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesBattleArrayReq {}
	}
	
	export class PiecesBattleArrayRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		p1:  FightQueryRsp;//电脑
		p2:  FightQueryRsp;//玩家

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesBattleArrayRsp {}
	}
	
	//末日自走棋--退出战斗
	export class PiecesExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;// 类型，1无尽模式，2自走棋模式
		fightState:  string;// 战斗状态，需要保存什么数据前端自定义
		nowRound:  number;
		playerHP:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesExitReq {}
	}
	
	export class PiecesExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;// 类型，1无尽模式，2自走棋模式
		beforeRank:  number;// 旧排名
		afterRank:  number;// 新排名
		score:  number;// 段位积分
		talentPoint:  number;// 天赋点
		totalRound:  number;// 累计回合数

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesExitRsp {}
	}
	
	//末日自走棋--波次开始
	export class PiecesRoundStartReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesRoundStartReq {}
	}
	
	export class PiecesRoundStartRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesRoundStartRsp {}
	}
	
	//末日自走棋--波次结束
	export class PiecesRoundEndReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;// 类型，1无尽模式，2自走棋模式
		isKillAll:  boolean;// 是否击杀全部怪物
		nowRound:  number;
		playerHP:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesRoundEndReq {}
	}
	
	export class PiecesRoundEndRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;// 类型，1无尽模式，2自走棋模式
		p1:  FightQueryRsp;// 电脑
		silver:  number;// 银币
		divisionPoint:  number;// 段位积分
		boardLv:  number;// 棋盘等级
		boardExp:  number;// 棋盘经验

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesRoundEndRsp {}
	}
	
	//末日自走棋--请求英雄战斗数据
	export class PiecesFightQueryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesFightQueryReq {}
	}
	
	export class PiecesFightQueryRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		hero:  FightHero;

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesFightQueryRsp {}
	}
	
	//末日自走棋--获取跨服组数量
	export class PiecesCrossServerNumReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesCrossServerNumReq {}
	}
	
	export class PiecesCrossServerNumRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		num:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesCrossServerNumRsp {}
	}
	
	//末日自走棋--升级棋盘
	export class PiecesUpgradeChessBoardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesUpgradeChessBoardReq {}
	}
	
	export class PiecesUpgradeChessBoardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		silver:  number;
		boardExp:  number;
		boardLv:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PiecesUpgradeChessBoardRsp {}
	}
	
	//公会末日集结--状态
	export class GuildGatherStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildGatherStateReq {}
	}
	
	export class GuildGatherStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		power:  number;// 个人战力
		numberCount:  number;// 集结人数
		totalPower:  number;// 合计战力
		star:  number;// 集结优势，位图
		heroOn:  number[] = [];// 上阵列表
		reward:  boolean;// 今日是否有奖励
		rewarded:  boolean;// 今日奖励是否领取
		worldLevel:  number;// 世界等级
		confirm:  boolean;// 今日是否确认集结

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildGatherStateRsp {}
	}
	
	export class GuildGatherRank implements Message {
		guildId:  number;// 公会id
		guildIcon:  number;// 图标
		guildBottom:  number;// 图标
		guildFrame:  number;// 图标
		guildName:  string;// 名称
		totalPower:  number;// 合计战力
		numberCount:  number;// 集结人数
		presidentId:  number;// 会长id
		presidentName:  string;// 名称
		presidentHead:  number;// 头像
		presidentHeadFrame:  number;// 底框

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildGatherRank {}
	}
	
	//公会末日集结--排行榜
	export class GuildGatherRankReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildGatherRankReq {}
	}
	
	export class GuildGatherRankRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rank:  number;// 公会所处排名
		list:  GuildGatherRank[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildGatherRankRsp {}
	}
	
	//公会末日集结--本日领取奖励
	export class GuildGatherRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildGatherRewardReq {}
	}
	
	export class GuildGatherRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewarded:  boolean;// 今日奖励领取记录
		rewards:  GoodsInfo[] = [];// 奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildGatherRewardRsp {}
	}
	
	//公会末日集结--上阵
	export class GuildGatherHeroOnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		star:  number;// 集结优势，位图
		heroOn:  number[] = [];// 上阵列表

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildGatherHeroOnReq {}
	}
	
	export class GuildGatherHeroOnRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		power:  number;// 个人战力
		heroOn:  number[] = [];// 上阵列表

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildGatherHeroOnRsp {}
	}
	
	//公会末日集结--确认集结
	export class GuildGatherConfirmReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildGatherConfirmReq {}
	}
	
	export class GuildGatherConfirmRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		power:  number;// 个人战力
		totalPower:  number;// 合计战力
		numberCount:  number;// 集结人数
		star:  number;// 集结优势，位图
		heroOn:  number[] = [];// 上阵列表
		confirm:  boolean;// 今日是否确认集结

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildGatherConfirmRsp {}
	}
	
	//公会末日集结--战斗结束广播
	export class GuildGatherEndRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewards:  GoodsInfo[] = [];// 奖励，空数组说明战斗失败

		encode(writer: IWriter) {}
		decode(reader: IReader): GuildGatherEndRsp {}
	}
	
	export class BaseInfo implements Message {
		id:  number;
		level:  number;
		startTime:  number;
		endTime:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseInfo {}
	}
	
	//基地--列表
	export class BaseListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseListReq {}
	}
	
	export class BaseListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  BaseInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseListRsp {}
	}
	
	//基地--状态
	export class BaseInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseInfoReq {}
	}
	
	export class BaseInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  BaseInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseInfoRsp {}
	}
	
	//基地--建造
	export class BaseBuildReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseBuildReq {}
	}
	
	export class BaseBuildRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  BaseInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseBuildRsp {}
	}
	
	//基地--加速
	export class BaseBoostReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		itemId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseBoostReq {}
	}
	
	export class BaseBoostRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  BaseInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseBoostRsp {}
	}
	
	//基地--杂物
	export class BaseVariaReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseVariaReq {}
	}
	
	export class BaseVariaRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseVariaRsp {}
	}
	
	//基地--确认完成
	export class BaseCompleteReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseCompleteReq {}
	}
	
	export class BaseCompleteRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		info:  BaseInfo;

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseCompleteRsp {}
	}
	
	export class BaseDigger implements Message {
		id:  number;
		startTime:  number;
		dropItems:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseDigger {}
	}
	
	//基地--矿机列表
	export class BaseDiggerListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseDiggerListReq {}
	}
	
	export class BaseDiggerListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  BaseDigger[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseDiggerListRsp {}
	}
	
	//基地--领取挂机奖励
	export class BaseHangRewardFetchReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseHangRewardFetchReq {}
	}
	
	export class BaseHangRewardFetchRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		dropItem:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseHangRewardFetchRsp {}
	}
	
	//基地--快速奖励
	export class BaseQuickHangRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseQuickHangRewardReq {}
	}
	
	export class BaseQuickHangRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		dropItem:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): BaseQuickHangRewardRsp {}
	}
	
	export class ArenaHonorGuild implements Message {
		id:  number;
		name:  string;
		icon:  number;//图标
		frame:  number;//边框
		bottom:  number;//底框
		players:  RoleBrief[] = [];//战力前8玩家信息

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorGuild {}
	}
	
	// 荣耀巅峰赛--4个公会信息
	export class ArenaHonorGuildReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorGuildReq {}
	}
	
	export class ArenaHonorGuildRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		guilds:  ArenaHonorGuild[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorGuildRsp {}
	}
	
	export class ArenaHonorPlayer implements Message {
		id:  number;// 玩家id
		support:  number;// 支持数
		win:  number;// 胜率

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorPlayer {}
	}
	
	export class ArenaHonorMatch implements Message {
		match:  number;// 本场id
		group:  number;// 组id，1，2，3，4，5，最后一组是冠军赛
		players:  ArenaHonorPlayer[] = [];// 两个,玩家1,玩家2
		winner:  number;// 实际结果，0-未结束，1-玩家1胜利，2-玩家2胜利
		guessWinner:  number;// 竞猜结果，0-未结束，1-玩家1胜利，2-玩家2胜利
		guess:  number;// 下注哪个玩家，1-玩家1，2-玩家2
		score:  number;// 下注积分
		addScore:  number;// 奖励积分
		guessTime:  number;// 下注时间
		rewarded:  boolean;// 是否领取了奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorMatch {}
	}
	
	export class ArenaHonorRoleBrief implements Message {
		roleBrief:  RoleBrief;
		flower:  number;// 花数
		guildName:  string;// 公会名

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorRoleBrief {}
	}
	
	// 荣耀巅峰赛--每组比赛
	export class ArenaHonorGroupReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		world:  boolean;// true-世界赛,false-跨服组内赛

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorGroupReq {}
	}
	
	export class ArenaHonorGroupRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		world:  boolean;// true-世界赛,false-跨服组内赛
		list:  ArenaHonorMatch[] = [];// 比赛场次
		players:  ArenaHonorRoleBrief[] = [];// 玩家信息
		draw:  number[] = [];// 位图
		giveFlower:  number;// 今日送花次数

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorGroupRsp {}
	}
	
	// 荣耀巅峰赛--战斗
	export class ArenaHonorEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		world:  boolean;// true-世界赛,false-跨服组内赛
		group:  number;// 组id
		match:  number;// 本场id

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorEnterReq {}
	}
	
	export class ArenaHonorEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		world:  boolean;// true-世界赛,false-跨服组内赛
		group:  number;// 组id
		match:  number;// 本场id

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorEnterRsp {}
	}
	
	// 荣耀巅峰赛--战斗结束
	export class ArenaHonorExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		world:  boolean;// true-世界赛,false-跨服组内赛
		group:  number;// 组id
		match:  number;// 本场id
		winner:  number;// 1-玩家1胜利，2-玩家2胜利

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorExitReq {}
	}
	
	export class ArenaHonorExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		world:  boolean;// true-世界赛,false-跨服组内赛
		group:  number;// 组id
		match:  number;// 本场id
		guess:  number;// 下注哪个玩家，1-玩家1，2-玩家2
		winner:  number;// 1-玩家1胜利，2-玩家2胜利
		rewards:  GoodsInfo[] = [];// 竞猜奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorExitRsp {}
	}
	
	// 荣耀巅峰赛--下注
	export class ArenaHonorGuessReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		world:  boolean;// true-世界赛,false-跨服组内赛
		group:  number;// 组id
		match:  number;// 本场id
		winner:  number;// 1-玩家1胜利，2-玩家2胜利
		score:  number;// 下注积分

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorGuessReq {}
	}
	
	export class ArenaHonorGuessRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		match:  number;// 本场id
		group:  number;// 组id，1，2，3，4，5，最后一组是冠军赛
		guess:  number;// 下注哪个玩家，1-玩家1，2-玩家2
		score:  number;// 下注积分
		guessTime:  number;// 下注时间

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorGuessRsp {}
	}
	
	// 荣耀巅峰赛--领取积分
	export class ArenaHonorDrawReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		world:  boolean;// true-世界赛,false-跨服组内赛
		id:  number;// 序号

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorDrawReq {}
	}
	
	export class ArenaHonorDrawRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		draw:  number[] = [];// 位图
		goods:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorDrawRsp {}
	}
	
	// 荣耀巅峰赛--竞猜统计
	export class ArenaHonorGuessHistoryReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		world:  boolean;// true-世界赛,false-跨服组内赛

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorGuessHistoryReq {}
	}
	
	export class ArenaHonorGuessHistoryRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  ArenaHonorMatch[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorGuessHistoryRsp {}
	}
	
	export class ArenaHonorRanking implements Message {
		brief:  RoleBrief;
		count:  number;// 胜利次数
		firstTime:  number;// 第一次胜利时间
		guildName:  string;// 公会名

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorRanking {}
	}
	
	// 荣耀巅峰赛--排行榜
	export class ArenaHonorRankingReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		world:  boolean;// true-世界赛,false-跨服组内赛

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorRankingReq {}
	}
	
	export class ArenaHonorRankingRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		world:  boolean;// true-世界赛,false-跨服组内赛
		list:  ArenaHonorRanking[] = [];// 玩家信息
		mine:  number;// 自己的排名
		count:  number;// 胜利次数
		firstTime:  number;// 第一次胜利时间

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorRankingRsp {}
	}
	
	// 荣耀巅峰赛--送花
	export class ArenaHonorFlowerReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;// 玩家

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorFlowerReq {}
	}
	
	export class ArenaHonorFlowerRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		playerId:  number;// 玩家
		flower:  number;// 玩家花数
		giveFlower:  number;// 今日送花次数
		goods:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ArenaHonorFlowerRsp {}
	}
	
	export class ExpeditionPos implements Message {
		x:  number;
		y:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionPos {}
	}
	
	export class ExpeditionHero implements Message {
		gridId:  number;
		heroId:  number;
		energy:  number;
		energyTime:  number;//上次增加时间
		changeTime:  number;//上次更换时间

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionHero {}
	}
	
	//团队远征--查看英雄
	export class ExpeditionHeroListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionHeroListReq {}
	}
	
	export class ExpeditionHeroListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  ExpeditionHero[] = [];
		energyBought:  number;//购买体力次数

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionHeroListRsp {}
	}
	
	//团队远征--更换英雄
	export class ExpeditionHeroChangeReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		gridId:  number;
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionHeroChangeReq {}
	}
	
	export class ExpeditionHeroChangeRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		hero:  ExpeditionHero;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionHeroChangeRsp {}
	}
	
	//团队远征--购买体力
	export class ExpeditionBuyEnergyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		gridId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionBuyEnergyReq {}
	}
	
	export class ExpeditionBuyEnergyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		hero:  ExpeditionHero;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionBuyEnergyRsp {}
	}
	
	export class ExpeditionLog implements Message {
		playerName:  string;
		time:  number;
		value:  number;
		isBoss:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionLog {}
	}
	
	//团队远征--查看日志
	export class ExpeditionLogListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		count:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionLogListReq {}
	}
	
	export class ExpeditionLogListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		index:  number;
		total:  number;
		list:  ExpeditionLog[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionLogListRsp {}
	}
	
	export class ExpeditionPoint implements Message {
		pos:  ExpeditionPos;
		playerIds:  number[] = [];
		status:  number;//0:空闲 1:战斗中 2:挂机中
		time:  number;//状态开始时间
		progress:  number;//进度
		hasOccupied:  boolean;//是否被占领过

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionPoint {}
	}
	
	export class ExpeditionEvent implements Message {
		pos:  ExpeditionPos;
		type:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionEvent {}
	}
	
	export class ExpeditionMapPoint implements Message {
		point:  ExpeditionPoint;
		mapId:  number;
		type:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionMapPoint {}
	}
	
	export class ExpeditionMap implements Message {
		mapId:  number;
		isClear:  boolean;
		points:  ExpeditionPoint[] = [];
		events:  ExpeditionEvent[] = [];
		process:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionMap {}
	}
	
	//团队远征--查看地图
	export class ExpeditionMapListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionMapListReq {}
	}
	
	export class ExpeditionMapListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  ExpeditionMap[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionMapListRsp {}
	}
	
	//团队远征--进入地图
	export class ExpeditionMapEnterReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionMapEnterReq {}
	}
	
	export class ExpeditionMapEnterRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		map:  ExpeditionMap;
		occupiedNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionMapEnterRsp {}
	}
	
	//团队远征--退出地图
	export class ExpeditionMapExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionMapExitReq {}
	}
	
	export class ExpeditionMapExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionMapExitRsp {}
	}
	
	//团队远征--通关地图
	export class ExpeditionMapClearRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionMapClearRsp {}
	}
	
	export class ExpeditionStage implements Message {
		playerId:  number;
		fightTime:  number;//战斗开始时间
		heroIds:  number[] = [];//通关英雄id

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionStage {}
	}
	
	//团队远征--查看据点
	export class ExpeditionPointDetailReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapId:  number;
		pos:  ExpeditionPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionPointDetailReq {}
	}
	
	export class ExpeditionPointDetailRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stages:  ExpeditionStage[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionPointDetailRsp {}
	}
	
	//团队远征--查看所有占领据点
	export class ExpeditionOccupiedPointsReq0 implements Message {

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionOccupiedPointsReq0 {}
	}
	
	export class ExpeditionOccupiedPointsRsp0 implements Message {
		point:  ExpeditionMapPoint[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionOccupiedPointsRsp0 {}
	}
	
	//团队远征--开始战斗
	export class ExpeditionFightStartReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapId:  number;
		pos:  ExpeditionPos;
		index:  number;
		grids:  number[] = [];//通关英雄位置id

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionFightStartReq {}
	}
	
	export class ExpeditionFightStartRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionFightStartRsp {}
	}
	
	//团队远征--战斗结束
	export class ExpeditionFightOverReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		isClear:  boolean;
		grids:  number[] = [];//通关英雄位置id

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionFightOverReq {}
	}
	
	export class ExpeditionFightOverRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		point:  ExpeditionPoint;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionFightOverRsp {}
	}
	
	//团队远征--战斗退出
	export class ExpeditionFightExitReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionFightExitReq {}
	}
	
	export class ExpeditionFightExitRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		point:  ExpeditionPoint;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionFightExitRsp {}
	}
	
	//团队远征--放弃据点
	export class ExpeditionGiveUpReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapId:  number;
		pos:  ExpeditionPos;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionGiveUpReq {}
	}
	
	export class ExpeditionGiveUpRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		point:  ExpeditionPoint;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionGiveUpRsp {}
	}
	
	export class ExpeditionBroadcastRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		point:  ExpeditionPoint;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionBroadcastRsp {}
	}
	
	//团队远征--挂机累计
	export class ExpeditionHangupItemsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionHangupItemsReq {}
	}
	
	export class ExpeditionHangupItemsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		hourReward:  GoodsInfo[] = [];//每小时奖励
		items:  GoodsInfo[] = [];//当前奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionHangupItemsRsp {}
	}
	
	//团队远征--挂机领奖
	export class ExpeditionHangupRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionHangupRewardReq {}
	}
	
	export class ExpeditionHangupRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionHangupRewardRsp {}
	}
	
	//团队远征--任务信息
	export class ExpeditionMissionStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionMissionStateReq {}
	}
	
	export class ExpeditionMissionStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		armyExp:  number;
		rewarded:  number;
		progress:  MissionProgress[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionMissionStateRsp {}
	}
	
	//团队远征--任务进度更新
	export class ExpeditionMissionUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		progress:  MissionProgress;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionMissionUpdateRsp {}
	}
	
	//团队远征--任务领奖
	export class ExpeditionMissionRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionMissionRewardReq {}
	}
	
	export class ExpeditionMissionRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionId:  number;
		armyExp:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionMissionRewardRsp {}
	}
	
	//团队远征--部队状态
	export class ExpeditionArmyStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionArmyStateReq {}
	}
	
	export class ExpeditionArmyStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		levels1:  number[] = [];//枪兵
		levels2:  number[] = [];//炮兵
		levels3:  number[] = [];//守卫

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionArmyStateRsp {}
	}
	
	//团队远征--部队强化
	export class ExpeditionArmyStrengthenReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		professionalType:  number;
		buffType:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionArmyStrengthenReq {}
	}
	
	export class ExpeditionArmyStrengthenRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		professionalType:  number;
		buffType:  number;
		level:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionArmyStrengthenRsp {}
	}
	
	export class ExpeditionRankBrief implements Message {
		roleBrief:  RoleBrief;
		guildName:  string;
		value:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionRankBrief {}
	}
	
	//团队远征--远征排名
	export class ExpeditionRankingReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionRankingReq {}
	}
	
	export class ExpeditionRankingRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  ExpeditionRankBrief[] = [];
		mine:  ExpeditionRankBrief;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionRankingRsp {}
	}
	
	export class ExpeditionOccupiedPoint implements Message {
		index:  number;
		num:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionOccupiedPoint {}
	}
	
	//团队远征--查看所有占领据点
	export class ExpeditionOccupiedPointsReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionOccupiedPointsReq {}
	}
	
	export class ExpeditionOccupiedPointsRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		point:  ExpeditionOccupiedPoint[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): ExpeditionOccupiedPointsRsp {}
	}
	
	export class PlatformMission implements Message {
		missionId:  number;
		number:  number;
		rewarded:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): PlatformMission {}
	}
	
	//平台活动--任务列表
	export class PlatformMissionListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PlatformMissionListReq {}
	}
	
	export class PlatformMissionListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  PlatformMission[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PlatformMissionListRsp {}
	}
	
	//平台活动--任务触发
	export class PlatformMissionTriggerReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionType:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PlatformMissionTriggerReq {}
	}
	
	export class PlatformMissionTriggerRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missions:  PlatformMission[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PlatformMissionTriggerRsp {}
	}
	
	//平台活动--领取奖励
	export class PlatformMissionRewardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		missionId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PlatformMissionRewardReq {}
	}
	
	export class PlatformMissionRewardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mission:  PlatformMission;
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PlatformMissionRewardRsp {}
	}
	
	//平台活动--豪礼列表
	export class PlatformFriendGiftListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		level:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): PlatformFriendGiftListReq {}
	}
	
	export class PlatformFriendGiftListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		level:  number;
		list:  RoleBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PlatformFriendGiftListRsp {}
	}
	
	//平台活动--返利信息
	export class PlatformFriendGemsInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PlatformFriendGemsInfoReq {}
	}
	
	export class PlatformFriendGemsInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		fetchedNum:  number;//已领取钻石
		unfetchedNum:  number;//未领取钻石

		encode(writer: IWriter) {}
		decode(reader: IReader): PlatformFriendGemsInfoRsp {}
	}
	
	//平台活动--返利领取
	export class PlatformFriendGemsFetchReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): PlatformFriendGemsFetchReq {}
	}
	
	export class PlatformFriendGemsFetchRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		rewards:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): PlatformFriendGemsFetchRsp {}
	}
	
	export class SoldierTech implements Message {
		type:  number;
		lv:  number;
		exp:  number;
		slots:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTech {}
	}
	
	//士兵科技--列表
	export class SoldierTechListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTechListReq {}
	}
	
	export class SoldierTechListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  SoldierTech[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTechListRsp {}
	}
	
	//士兵科技--科技升级
	export class SoldierTechLevelUpReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		itemId:  number;
		itemNum:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTechLevelUpReq {}
	}
	
	export class SoldierTechLevelUpRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		soldierTech:  SoldierTech;

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTechLevelUpRsp {}
	}
	
	export class SoldierTechResearch implements Message {
		type:  number;
		heroId:  number;
		startTime:  number;
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTechResearch {}
	}
	
	//士兵科技--研究列表
	export class SoldierTechResearchListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTechResearchListReq {}
	}
	
	export class SoldierTechResearchListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  SoldierTechResearch[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTechResearchListRsp {}
	}
	
	//士兵科技--领取奖励
	export class SoldierTechResearchAwardReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTechResearchAwardReq {}
	}
	
	export class SoldierTechResearchAwardRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTechResearchAwardRsp {}
	}
	
	//士兵科技--开始研究
	export class SoldierTechDoResearchReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTechDoResearchReq {}
	}
	
	export class SoldierTechDoResearchRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		research:  SoldierTechResearch;

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTechDoResearchRsp {}
	}
	
	//士兵科技--装备能量石
	export class SoldierTechEquipStoneReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		type:  number;
		slot:  number;
		itemId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTechEquipStoneReq {}
	}
	
	export class SoldierTechEquipStoneRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		itemId:  number;
		soldierTech:  SoldierTech;

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTechEquipStoneRsp {}
	}
	
	export class SoldierTechDisint implements Message {
		itemId:  number;
		num:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTechDisint {}
	}
	
	//士兵科技--分解能量石
	export class SoldierTechDisintStoneReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		stones:  SoldierTechDisint[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTechDisintStoneReq {}
	}
	
	export class SoldierTechDisintStoneRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): SoldierTechDisintStoneRsp {}
	}
	
	export class EnergizePlace implements Message {
		place:  number;// 位置，0，1，2，3
		items:  GoodsInfo;// 物品

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergizePlace {}
	}
	
	//聚能魔方--状态
	export class EnergizeStateReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergizeStateReq {}
	}
	
	export class EnergizeStateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		round:  number;// 当前轮次
		today:  number;// 本日抽奖次数
		total:  number;// 本轮抽奖次数
		places:  EnergizePlace[] = [];// 位置物品

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergizeStateRsp {}
	}
	
	//聚能魔方--抽奖
	export class EnergizeDrawReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergizeDrawReq {}
	}
	
	export class EnergizeDrawRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		round:  number;// 当前轮次
		today:  number;// 本日抽奖次数
		total:  number;// 本轮抽奖次数
		place:  EnergizePlace;// 位置物品

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergizeDrawRsp {}
	}
	
	//聚能魔方--领取，开启下一轮，清空位置上的物品
	export class EnergizeGetReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergizeGetReq {}
	}
	
	export class EnergizeGetRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		round:  number;// 当前轮次
		today:  number;// 本日抽奖次数
		total:  number;// 本轮抽奖次数
		items:  GoodsInfo[] = [];// 物品

		encode(writer: IWriter) {}
		decode(reader: IReader): EnergizeGetRsp {}
	}
	
	//皇家竞技场--查看信息
	export class RoyalInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalInfoReq {}
	}
	
	export class RoyalInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapIds:  number[] = [];// 地图
		rank:  number;// 排名
		score:  number;// 积分
		enterNum:  number;// 挑战次数
		buyNum:  number;// 购买的挑战次数
		matchNum:  number;// 匹配次数
		opponent:  RoyalBrief;// 上一次匹配到的玩家
		round:  number;// 上一次战斗了第几轮
		winFlag:  number;// 胜利位图，1-第一局，2-第二局，3-赢第一、二局
		serverNum:  number;// 游戏服数量
		div:  number;// 段位
		divFlag:  number;// 段位奖励记录，位图

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalInfoRsp {}
	}
	
	//皇家竞技场--设置地图
	export class RoyalSetMapReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		mapIds:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalSetMapReq {}
	}
	
	export class RoyalSetMapRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		maps:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalSetMapRsp {}
	}
	
	export class RoyalBrief implements Message {
		brief:  RoleBrief;
		maps:  number[] = [];
		heroes:  HeroBrief[] = [];
		score:  number;// 积分
		addScore:  number;// 获得积分
		div:  number;// 段位

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalBrief {}
	}
	
	//皇家竞技场--匹配对手
	export class RoyalMatchReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalMatchReq {}
	}
	
	export class RoyalMatchRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		matchNum:  number;// 匹配次数
		opponent:  RoyalBrief;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalMatchRsp {}
	}
	
	//皇家竞技场--战斗开始
	export class RoyalFightStartReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalFightStartReq {}
	}
	
	export class RoyalFightStartRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		enterNum:  number;// 挑战次数
		playerId:  number;
		heroList:  FightHero[] = [];
		general:  FightGeneral;// 机器人由前端从配置表读取指挥官信息

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalFightStartRsp {}
	}
	
	//皇家竞技场--战斗结束
	export class RoyalFightOverReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		round:  number;
		isWin:  boolean;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalFightOverReq {}
	}
	
	export class RoyalFightOverRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		round:  number;
		isWin:  boolean;
		newRank:  number;// 打完三场才会有新的排名、积分、段位
		newScore:  number;
		newDiv:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalFightOverRsp {}
	}
	
	export class RoyalFightRecord implements Message {
		player:  RoyalBrief;// 进攻
		opponent:  RoyalBrief;// 防守
		time:  number;// 三场战斗后的结算时间
		winFlag:  number;// 胜利位图，1-第一局，2-第二局，3-赢第一、二局

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalFightRecord {}
	}
	
	//皇家竞技场--战斗记录
	export class RoyalFightRecordReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalFightRecordReq {}
	}
	
	export class RoyalFightRecordRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  RoyalFightRecord[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalFightRecordRsp {}
	}
	
	//皇家竞技场--排行榜
	export class RoyalFightRankReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		page:  number;
		size:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalFightRankReq {}
	}
	
	export class RoyalFightRankRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		page:  number;
		size:  number;
		rankNum:  number;//自己的名次
		score:  number;//自己的积分
		div:  number;//自己的段位
		total:  number;//总数
		rankList:  RoyalBrief[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalFightRankRsp {}
	}
	
	//皇家竞技场--段位奖励
	export class RoyalDivReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		div:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalDivReq {}
	}
	
	export class RoyalDivRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		div:  number;
		divFlag:  number;// 段位奖励记录，位图
		list:  GoodsInfo[] = [];// 挑战奖励

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalDivRsp {}
	}
	
	//皇家竞技场--购买挑战次数
	export class RoyalBuyReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalBuyReq {}
	}
	
	export class RoyalBuyRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		buyNum:  number;// 购买的挑战次数

		encode(writer: IWriter) {}
		decode(reader: IReader): RoyalBuyRsp {}
	}
	
	export class UniqueEquip implements Message {
		id:  number;
		itemId:  number;
		star:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquip {}
	}
	
	export class UniqueEquipUpdateRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  UniqueEquip[] = [];// 获得
		deleteList:  number[] = [];// 减少

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipUpdateRsp {}
	}
	
	//专属装备--查看
	export class UniqueEquipListReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipListReq {}
	}
	
	export class UniqueEquipListRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		equips:  UniqueEquip[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipListRsp {}
	}
	
	//专属装备--穿戴
	export class UniqueEquipOnReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipOnReq {}
	}
	
	export class UniqueEquipOnRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipOnRsp {}
	}
	
	//专属装备--脱下
	export class UniqueEquipOffReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		heroId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipOffReq {}
	}
	
	export class UniqueEquipOffRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipOffRsp {}
	}
	
	//专属装备--升星
	export class UniqueEquipStarUpReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;
		heroId:  number;
		cost:  GoodsInfo;
		costUniqueId:  number;

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipStarUpReq {}
	}
	
	export class UniqueEquipStarUpRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		equip:  UniqueEquip;

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipStarUpRsp {}
	}
	
	//专属装备--分解
	export class UniqueEquipDisintReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipDisintReq {}
	}
	
	export class UniqueEquipDisintRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipDisintRsp {}
	}
	
	//专属装备--召唤
	export class UniqueEquipDrawReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number;//召唤id
		type:  number;//类型，0单抽，1十连抽

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipDrawReq {}
	}
	
	export class UniqueEquipDrawRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		list:  GoodsInfo[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipDrawRsp {}
	}
	
	//专属装备--查看心愿单
	export class UniqueEquipWishInfoReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipWishInfoReq {}
	}
	
	export class UniqueEquipWishInfoRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipWishInfoRsp {}
	}
	
	//专属装备--设置心愿单
	export class UniqueEquipWishSetReq implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipWishSetReq {}
	}
	
	export class UniqueEquipWishSetRsp implements Message {
		static MsgType: number;
		constructor(data?: any) {}
		id:  number[] = [];

		encode(writer: IWriter) {}
		decode(reader: IReader): UniqueEquipWishSetRsp {}
	}
}