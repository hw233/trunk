export function init(data: object) {
    let classes = this;
    for (let e in classes) {
        let i = data[e];
        let o = classes[e];
        if (i && typeof (i) === 'object') {
            o.array = o.array || i.a;
            o.keys = o.keys || i.k;
            o.list = o.list || {};
        }
    }
}


export class ActivityCfg extends iccfg.IActivity {
}

export class Activity_alchemyCfg extends iccfg.IActivity_alchemy {
}

export class Activity_assembledCfg extends iccfg.IActivity_assembled {
}

export class Activity_awards_showCfg extends iccfg.IActivity_awards_show {
}

export class Activity_collect_heroCfg extends iccfg.IActivity_collect_hero {
}

export class Activity_continuousCfg extends iccfg.IActivity_continuous {
}

export class Activity_cumloginCfg extends iccfg.IActivity_cumlogin {
}

export class Activity_discountCfg extends iccfg.IActivity_discount {
}

export class Activity_discount_giftCfg extends iccfg.IActivity_discount_gift {
}

export class Activity_flip_cardsCfg extends iccfg.IActivity_flip_cards {
}

export class Activity_guardianCfg extends iccfg.IActivity_guardian {
}

export class Activity_land_giftsCfg extends iccfg.IActivity_land_gifts {
}

export class Activity_mysteriousCfg extends iccfg.IActivity_mysterious {
}

export class Activity_mystery_enterCfg extends iccfg.IActivity_mystery_enter {
}

export class Activity_newtopupCfg extends iccfg.IActivity_newtopup {
}

export class Activity_poolCfg extends iccfg.IActivity_pool {
}

export class Activity_ranking3Cfg extends iccfg.IActivity_ranking3 {
}

export class Activity_ranking7Cfg extends iccfg.IActivity_ranking7 {
}

export class Activity_rechargeCfg extends iccfg.IActivity_recharge {
}

export class Activity_star_giftsCfg extends iccfg.IActivity_star_gifts {
}

export class Activity_super_valueCfg extends iccfg.IActivity_super_value {
}

export class Activity_top_upCfg extends iccfg.IActivity_top_up {
}

export class Activity_upgradeCfg extends iccfg.IActivity_upgrade {
}

export class Activity_weekend_giftsCfg extends iccfg.IActivity_weekend_gifts {
}

export class Activitycave_exchangeCfg extends iccfg.IActivitycave_exchange {
}

export class Activitycave_giftCfg extends iccfg.IActivitycave_gift {
}

export class Activitycave_mainCfg extends iccfg.IActivitycave_main {
}

export class Activitycave_privilegeCfg extends iccfg.IActivitycave_privilege {
}

export class Activitycave_stageCfg extends iccfg.IActivitycave_stage {
}

export class Activitycave_tansuoCfg extends iccfg.IActivitycave_tansuo {
}

export class AdventureCfg extends iccfg.IAdventure {
}

export class Adventure2_adventureCfg extends iccfg.IAdventure2_adventure {
}

export class Adventure2_consumptionCfg extends iccfg.IAdventure2_consumption {
}

export class Adventure2_copy_groupCfg extends iccfg.IAdventure2_copy_group {
}

export class Adventure2_endless_entryCfg extends iccfg.IAdventure2_endless_entry {
}

export class Adventure2_entryCfg extends iccfg.IAdventure2_entry {
}

export class Adventure2_globalCfg extends iccfg.IAdventure2_global {
}

export class Adventure2_heroCfg extends iccfg.IAdventure2_hero {
}

export class Adventure2_hireCfg extends iccfg.IAdventure2_hire {
}

export class Adventure2_passCfg extends iccfg.IAdventure2_pass {
}

export class Adventure2_randomCfg extends iccfg.IAdventure2_random {
}

export class Adventure2_rankingCfg extends iccfg.IAdventure2_ranking {
}

export class Adventure2_restoreCfg extends iccfg.IAdventure2_restore {
}

export class Adventure2_storeCfg extends iccfg.IAdventure2_store {
}

export class Adventure2_themeheroCfg extends iccfg.IAdventure2_themehero {
}

export class Adventure2_travelCfg extends iccfg.IAdventure2_travel {
}

export class Adventure2_treasureCfg extends iccfg.IAdventure2_treasure {
}

export class Adventure_consumptionCfg extends iccfg.IAdventure_consumption {
}

export class Adventure_entryCfg extends iccfg.IAdventure_entry {
}

export class Adventure_globalCfg extends iccfg.IAdventure_global {
}

export class Adventure_heroCfg extends iccfg.IAdventure_hero {
}

export class Adventure_hireCfg extends iccfg.IAdventure_hire {
}

export class Adventure_layerrewardCfg extends iccfg.IAdventure_layerreward {
}

export class Adventure_mapCfg extends iccfg.IAdventure_map {
}

export class Adventure_passCfg extends iccfg.IAdventure_pass {
}

export class Adventure_rankingCfg extends iccfg.IAdventure_ranking {
}

export class Adventure_storeCfg extends iccfg.IAdventure_store {
}

export class Adventure_themeheroCfg extends iccfg.IAdventure_themehero {
}

export class Adventure_travelCfg extends iccfg.IAdventure_travel {
}

export class Adventure_treasureCfg extends iccfg.IAdventure_treasure {
}

export class Arena_buyCfg extends iccfg.IArena_buy {
}

export class Arena_clearCfg extends iccfg.IArena_clear {
}

export class Arena_point_awardCfg extends iccfg.IArena_point_award {
}

export class Arenahonor_progressCfg extends iccfg.IArenahonor_progress {
}

export class Arenahonor_rank_showCfg extends iccfg.IArenahonor_rank_show {
}

export class Arenahonor_rewardsCfg extends iccfg.IArenahonor_rewards {
}

export class Arenahonor_worldwideCfg extends iccfg.IArenahonor_worldwide {
}

export class Arenahonor_worshipCfg extends iccfg.IArenahonor_worship {
}

export class AttrCfg extends iccfg.IAttr {
}

export class BarracksCfg extends iccfg.IBarracks {
}

export class BaseCfg extends iccfg.IBase {
}

export class Base_activityCfg extends iccfg.IBase_activity {
}

export class Base_alchemyCfg extends iccfg.IBase_alchemy {
}

export class Base_copycoinCfg extends iccfg.IBase_copycoin {
}

export class Base_copyexpCfg extends iccfg.IBase_copyexp {
}

export class Base_copypaobingCfg extends iccfg.IBase_copypaobing {
}

export class Base_copyqiangbingCfg extends iccfg.IBase_copyqiangbing {
}

export class Base_copyruneCfg extends iccfg.IBase_copyrune {
}

export class Base_copyshouweiCfg extends iccfg.IBase_copyshouwei {
}

export class Base_copysurvivalCfg extends iccfg.IBase_copysurvival {
}

export class Base_diggerCfg extends iccfg.IBase_digger {
}

export class Base_drawCfg extends iccfg.IBase_draw {
}

export class Base_equipCfg extends iccfg.IBase_equip {
}

export class Base_globalCfg extends iccfg.IBase_global {
}

export class Base_hostCfg extends iccfg.IBase_host {
}

export class Base_mainlineCfg extends iccfg.IBase_mainline {
}

export class Base_queueCfg extends iccfg.IBase_queue {
}

export class Base_runeCfg extends iccfg.IBase_rune {
}

export class Base_storeCfg extends iccfg.IBase_store {
}

export class Base_variaCfg extends iccfg.IBase_varia {
}

export class Bounty_costCfg extends iccfg.IBounty_cost {
}

export class Bounty_mainCfg extends iccfg.IBounty_main {
}

export class Carnival_cross_rankCfg extends iccfg.ICarnival_cross_rank {
}

export class Carnival_dailyCfg extends iccfg.ICarnival_daily {
}

export class Carnival_globalCfg extends iccfg.ICarnival_global {
}

export class Carnival_personal_rankCfg extends iccfg.ICarnival_personal_rank {
}

export class Carnival_rewardsCfg extends iccfg.ICarnival_rewards {
}

export class Carnival_scoreCfg extends iccfg.ICarnival_score {
}

export class Carnival_topupCfg extends iccfg.ICarnival_topup {
}

export class Carnival_ultimateCfg extends iccfg.ICarnival_ultimate {
}

export class Cave_adventureCfg extends iccfg.ICave_adventure {
}

export class Cave_globalCfg extends iccfg.ICave_global {
}

export class Cave_taskCfg extends iccfg.ICave_task {
}

export class Champion_divisionCfg extends iccfg.IChampion_division {
}

export class Champion_dropCfg extends iccfg.IChampion_drop {
}

export class Champion_exchangeCfg extends iccfg.IChampion_exchange {
}

export class Champion_mainCfg extends iccfg.IChampion_main {
}

export class ChannelCfg extends iccfg.IChannel {
}

export class Charge_filterCfg extends iccfg.ICharge_filter {
}

export class Charge_recoupCfg extends iccfg.ICharge_recoup {
}

export class CheckCfg extends iccfg.ICheck {
}

export class CodeCfg extends iccfg.ICode {
}

export class Combine_cross_rankCfg extends iccfg.ICombine_cross_rank {
}

export class Combine_dailyCfg extends iccfg.ICombine_daily {
}

export class Combine_globalCfg extends iccfg.ICombine_global {
}

export class Combine_personal_rankCfg extends iccfg.ICombine_personal_rank {
}

export class Combine_rewardsCfg extends iccfg.ICombine_rewards {
}

export class Combine_topupCfg extends iccfg.ICombine_topup {
}

export class Combine_ultimateCfg extends iccfg.ICombine_ultimate {
}

export class ComboCfg extends iccfg.ICombo {
}

export class Combo_giftCfg extends iccfg.ICombo_gift {
}

export class Combo_lineCfg extends iccfg.ICombo_line {
}

export class CommentsCfg extends iccfg.IComments {
}

export class Comments_globalCfg extends iccfg.IComments_global {
}

export class CommonCfg extends iccfg.ICommon {
}

export class Common_bannerCfg extends iccfg.ICommon_banner {
}

export class Common_bubblingCfg extends iccfg.ICommon_bubbling {
}

export class Common_carouselCfg extends iccfg.ICommon_carousel {
}

export class Common_nameCfg extends iccfg.ICommon_name {
}

export class Common_red_pointCfg extends iccfg.ICommon_red_point {
}

export class Common_strongerCfg extends iccfg.ICommon_stronger {
}

export class Common_tasklistCfg extends iccfg.ICommon_tasklist {
}

export class CopyCfg extends iccfg.ICopy {
}

export class Copy_assistCfg extends iccfg.ICopy_assist {
}

export class Copy_attrAdditionCfg extends iccfg.ICopy_attrAddition {
}

export class Copy_gateConditionCfg extends iccfg.ICopy_gateCondition {
}

export class Copy_hardcoreCfg extends iccfg.ICopy_hardcore {
}

export class Copy_prizeCfg extends iccfg.ICopy_prize {
}

export class Copy_pvpAdditionCfg extends iccfg.ICopy_pvpAddition {
}

export class Copy_ruin_rewardCfg extends iccfg.ICopy_ruin_reward {
}

export class Copy_stageCfg extends iccfg.ICopy_stage {
}

export class Copy_stage_masteryCfg extends iccfg.ICopy_stage_mastery {
}

export class Copy_towerTypeCfg extends iccfg.ICopy_towerType {
}

export class Copy_towerhaloCfg extends iccfg.ICopy_towerhalo {
}

export class Copy_towerlistCfg extends iccfg.ICopy_towerlist {
}

export class Copycup_challengeCfg extends iccfg.ICopycup_challenge {
}

export class Copycup_heroCfg extends iccfg.ICopycup_hero {
}

export class Copycup_prizeCfg extends iccfg.ICopycup_prize {
}

export class Copycup_rookieCfg extends iccfg.ICopycup_rookie {
}

export class Copysurvival_dropCfg extends iccfg.ICopysurvival_drop {
}

export class Copysurvival_drop_addCfg extends iccfg.ICopysurvival_drop_add {
}

export class Copysurvival_drop_showCfg extends iccfg.ICopysurvival_drop_show {
}

export class Copysurvival_equipCfg extends iccfg.ICopysurvival_equip {
}

export class Copysurvival_hireCfg extends iccfg.ICopysurvival_hire {
}

export class Copysurvival_stageCfg extends iccfg.ICopysurvival_stage {
}

export class Copysurvival_strongCfg extends iccfg.ICopysurvival_strong {
}

export class Copyultimate_cycleCfg extends iccfg.ICopyultimate_cycle {
}

export class Copyultimate_globalCfg extends iccfg.ICopyultimate_global {
}

export class Copyultimate_showCfg extends iccfg.ICopyultimate_show {
}

export class Copyultimate_stageCfg extends iccfg.ICopyultimate_stage {
}

export class CostumeCfg extends iccfg.ICostume {
    
    get defaultColor(): number {
        return this.color;
    }
}

export class Costume_attrCfg extends iccfg.ICostume_attr {
}

export class Costume_compositeCfg extends iccfg.ICostume_composite {
}

export class Costume_costCfg extends iccfg.ICostume_cost {
}

export class Costume_decomposeCfg extends iccfg.ICostume_decompose {
}

export class Costume_globalCfg extends iccfg.ICostume_global {
}

export class Costume_missionCfg extends iccfg.ICostume_mission {
}

export class Costume_progressCfg extends iccfg.ICostume_progress {
}

export class Costume_qualityCfg extends iccfg.ICostume_quality {
}

export class Cross_etcdCfg extends iccfg.ICross_etcd {
}

export class DiaryCfg extends iccfg.IDiary {
}

export class Diary_globalCfg extends iccfg.IDiary_global {
}

export class Diary_rewardCfg extends iccfg.IDiary_reward {
}

export class Diary_reward1Cfg extends iccfg.IDiary_reward1 {
}

export class Energystation_advancedCfg extends iccfg.IEnergystation_advanced {
}

export class Energystation_typeCfg extends iccfg.IEnergystation_type {
}

export class Energystation_upgradeCfg extends iccfg.IEnergystation_upgrade {
}

export class ErrorCfg extends iccfg.IError {
}

export class Eternal_globalCfg extends iccfg.IEternal_global {
}

export class Eternal_stageCfg extends iccfg.IEternal_stage {
}

export class ExchangeCfg extends iccfg.IExchange {
}

export class Expedition_buffCfg extends iccfg.IExpedition_buff {
}

export class Expedition_descCfg extends iccfg.IExpedition_desc {
}

export class Expedition_energyCfg extends iccfg.IExpedition_energy {
}

export class Expedition_forcesCfg extends iccfg.IExpedition_forces {
}

export class Expedition_globalCfg extends iccfg.IExpedition_global {
}

export class Expedition_mapCfg extends iccfg.IExpedition_map {
}

export class Expedition_missionCfg extends iccfg.IExpedition_mission {
}

export class Expedition_pointCfg extends iccfg.IExpedition_point {
}

export class Expedition_powerCfg extends iccfg.IExpedition_power {
}

export class Expedition_rankingCfg extends iccfg.IExpedition_ranking {
}

export class Expedition_stageCfg extends iccfg.IExpedition_stage {
}

export class Expedition_strengthenCfg extends iccfg.IExpedition_strengthen {
}

export class Expedition_unlockCfg extends iccfg.IExpedition_unlock {
}

export class Foothold_ascensionCfg extends iccfg.IFoothold_ascension {
}

export class Foothold_baseCfg extends iccfg.IFoothold_base {
}

export class Foothold_bgCfg extends iccfg.IFoothold_bg {
}

export class Foothold_bonusCfg extends iccfg.IFoothold_bonus {
}

export class Foothold_cityCfg extends iccfg.IFoothold_city {
}

export class Foothold_cooperation_rankingCfg extends iccfg.IFoothold_cooperation_ranking {
}

export class Foothold_dailytaskCfg extends iccfg.IFoothold_dailytask {
}

export class Foothold_energyCfg extends iccfg.IFoothold_energy {
}

export class Foothold_globalCfg extends iccfg.IFoothold_global {
}

export class Foothold_openCfg extends iccfg.IFoothold_open {
}

export class Foothold_pointCfg extends iccfg.IFoothold_point {
}

export class Foothold_quizCfg extends iccfg.IFoothold_quiz {
}

export class Foothold_rankingCfg extends iccfg.IFoothold_ranking {
}

export class Foothold_ranktaskCfg extends iccfg.IFoothold_ranktask {
}

export class Foothold_recommendCfg extends iccfg.IFoothold_recommend {
}

export class Foothold_special_rewardCfg extends iccfg.IFoothold_special_reward {
}

export class Foothold_teachingCfg extends iccfg.IFoothold_teaching {
}

export class Foothold_titleCfg extends iccfg.IFoothold_title {
}

export class Foothold_towerCfg extends iccfg.IFoothold_tower {
}

export class Foothold_world_levelCfg extends iccfg.IFoothold_world_level {
}

export class ForbidtipsCfg extends iccfg.IForbidtips {
}

export class GeneCfg extends iccfg.IGene {
}

export class Gene_globalCfg extends iccfg.IGene_global {
}

export class Gene_groupCfg extends iccfg.IGene_group {
}

export class Gene_poolCfg extends iccfg.IGene_pool {
}

export class Gene_storeCfg extends iccfg.IGene_store {
}

export class Gene_transitionCfg extends iccfg.IGene_transition {
}

export class GeneralCfg extends iccfg.IGeneral {
}

export class General_commanderCfg extends iccfg.IGeneral_commander {
}

export class General_skinCfg extends iccfg.IGeneral_skin {
}

export class General_weaponCfg extends iccfg.IGeneral_weapon {
}

export class General_weapon_levelCfg extends iccfg.IGeneral_weapon_level {
}

export class General_weapon_missionCfg extends iccfg.IGeneral_weapon_mission {
}

export class General_weapon_progressCfg extends iccfg.IGeneral_weapon_progress {
}

export class Gift_daily_firstCfg extends iccfg.IGift_daily_first {
}

export class Gift_powerCfg extends iccfg.IGift_power {
}

export class GlobalCfg extends iccfg.IGlobal {
}

export class Global_conversionCfg extends iccfg.IGlobal_conversion {
}

export class Global_holidayCfg extends iccfg.IGlobal_holiday {
}

export class Global_powerCfg extends iccfg.IGlobal_power {
}

export class Global_pushCfg extends iccfg.IGlobal_push {
}

export class Global_pvpCfg extends iccfg.IGlobal_pvp {
}

export class Global_white_ipCfg extends iccfg.IGlobal_white_ip {
}

export class Global_wordsCfg extends iccfg.IGlobal_words {
}

export class GroupCfg extends iccfg.IGroup {
}

export class GrowthfundCfg extends iccfg.IGrowthfund {
}

export class Growthfund_towerfundCfg extends iccfg.IGrowthfund_towerfund {
}

export class GuardianCfg extends iccfg.IGuardian {
    
    get defaultColor(): number {
        return this.color;
    }
}

export class Guardian_copy_skillCfg extends iccfg.IGuardian_copy_skill {
}

export class Guardian_cumulativeCfg extends iccfg.IGuardian_cumulative {
}

export class Guardian_drawCfg extends iccfg.IGuardian_draw {
}

export class Guardian_equipCfg extends iccfg.IGuardian_equip {
    
    get defaultColor(): number {
        return 1;
    }
    
    get color(): number {
        return 1;
    }
}

export class Guardian_equip_lvCfg extends iccfg.IGuardian_equip_lv {
}

export class Guardian_equip_skillCfg extends iccfg.IGuardian_equip_skill {
}

export class Guardian_equip_starCfg extends iccfg.IGuardian_equip_star {
}

export class Guardian_fallbackCfg extends iccfg.IGuardian_fallback {
}

export class Guardian_globalCfg extends iccfg.IGuardian_global {
}

export class Guardian_lvCfg extends iccfg.IGuardian_lv {
}

export class Guardian_starCfg extends iccfg.IGuardian_star {
}

export class Guardian_tipsCfg extends iccfg.IGuardian_tips {
}

export class Guardian_trailerCfg extends iccfg.IGuardian_trailer {
}

export class Guardiantower_guardianCfg extends iccfg.IGuardiantower_guardian {
}

export class Guardiantower_prizeCfg extends iccfg.IGuardiantower_prize {
}

export class Guardiantower_showCfg extends iccfg.IGuardiantower_show {
}

export class Guardiantower_towerCfg extends iccfg.IGuardiantower_tower {
}

export class Guardiantower_unlockCfg extends iccfg.IGuardiantower_unlock {
}

export class GuideCfg extends iccfg.IGuide {
}

export class Guide_buttonCfg extends iccfg.IGuide_button {
}

export class Guild_accessCfg extends iccfg.IGuild_access {
}

export class Guild_activeCfg extends iccfg.IGuild_active {
}

export class Guild_donationCfg extends iccfg.IGuild_donation {
}

export class Guild_enterCfg extends iccfg.IGuild_enter {
}

export class Guild_globalCfg extends iccfg.IGuild_global {
}

export class Guild_iconCfg extends iccfg.IGuild_icon {
}

export class Guild_logCfg extends iccfg.IGuild_log {
}

export class Guild_lvCfg extends iccfg.IGuild_lv {
}

export class Guild_nameCfg extends iccfg.IGuild_name {
}

export class Guild_robotCfg extends iccfg.IGuild_robot {
}

export class Guild_signCfg extends iccfg.IGuild_sign {
}

export class GuildbossCfg extends iccfg.IGuildboss {
}

export class Guildboss_rankingCfg extends iccfg.IGuildboss_ranking {
}

export class Guildpower_bossCfg extends iccfg.IGuildpower_boss {
}

export class Guildpower_boss_hpCfg extends iccfg.IGuildpower_boss_hp {
}

export class Guildpower_globalCfg extends iccfg.IGuildpower_global {
}

export class HeadframeCfg extends iccfg.IHeadframe {
}

export class Headframe_titleCfg extends iccfg.IHeadframe_title {
}

export class HeroCfg extends iccfg.IHero {
	
	get defaultColor(): number {
        let m = iclib.ConfigManager;
        if (m && m['_config']) {
            let r = m.getItemById(m['_config'].Hero_starCfg, this.star_min) as any;
            if (r) {
                return r.color;
            }
        }
        return 1;
    }
    
    get color(): number {
        return this.defaultColor;
    }
	
    get iconPath(): string {
        return `icon/hero/${this.icon}`;
    }
	
	get defaultColorBg(): string {
        return `common/texture/sub_itembg0${this.defaultColor}`;
    }
}

export class Hero_awakeCfg extends iccfg.IHero_awake {
}

export class Hero_careerCfg extends iccfg.IHero_career {
}

export class Hero_career_descCfg extends iccfg.IHero_career_desc {
}

export class Hero_crystalCfg extends iccfg.IHero_crystal {
}

export class Hero_displaceCfg extends iccfg.IHero_displace {
}

export class Hero_fallbackCfg extends iccfg.IHero_fallback {
}

export class Hero_globalCfg extends iccfg.IHero_global {
}

export class Hero_growCfg extends iccfg.IHero_grow {
}

export class Hero_legionCfg extends iccfg.IHero_legion {
}

export class Hero_lvCfg extends iccfg.IHero_lv {
}

export class Hero_mystery_skillCfg extends iccfg.IHero_mystery_skill {
}

export class Hero_rebirthCfg extends iccfg.IHero_rebirth {
}

export class Hero_rebirth_heroCfg extends iccfg.IHero_rebirth_hero {
}

export class Hero_resetCfg extends iccfg.IHero_reset {
}

export class Hero_starCfg extends iccfg.IHero_star {
}

export class Hero_trammelCfg extends iccfg.IHero_trammel {
}

export class Hero_undersand_levelCfg extends iccfg.IHero_undersand_level {
}

export class HonourCfg extends iccfg.IHonour {
}

export class Hotel_freerewardCfg extends iccfg.IHotel_freereward {
}

export class Hotel_globalCfg extends iccfg.IHotel_global {
}

export class Hotel_mapCfg extends iccfg.IHotel_map {
}

export class ItemCfg extends iccfg.IItem {
	
	get defaultColor(): number {
        return this.color;
    }
	
    get iconPath(): string {
        return `icon/item/${this.icon}`;
    }

    get defaultColorBg(): string {
        return `common/texture/sub_itembg0${this.color}`;
    }
}

export class Item_composeCfg extends iccfg.IItem_compose {
}

export class Item_dropCfg extends iccfg.IItem_drop {
}

export class Item_drop_groupCfg extends iccfg.IItem_drop_group {
}

export class Item_equipCfg extends iccfg.IItem_equip {
	
	get defaultColor(): number {
        return this.color;
    }
	
    get iconPath(): string {
        return `icon/equip/${this.icon}`;
    }

    get defaultColorBg(): string {
        return `common/texture/sub_itembg0${this.color}`;
    }
}

export class Item_equip_suitskillCfg extends iccfg.IItem_equip_suitskill {
}

export class Item_rubyCfg extends iccfg.IItem_ruby {
	
	get defaultColor(): number {
        return this.color;
    }
}

export class Justice_bonusCfg extends iccfg.IJustice_bonus {
}

export class Justice_bossCfg extends iccfg.IJustice_boss {
}

export class Justice_frameCfg extends iccfg.IJustice_frame {
}

export class Justice_generalCfg extends iccfg.IJustice_general {
}

export class Justice_mercenaryCfg extends iccfg.IJustice_mercenary {
}

export class Justice_skillCfg extends iccfg.IJustice_skill {
}

export class Justice_slotCfg extends iccfg.IJustice_slot {
}

export class Little_gameCfg extends iccfg.ILittle_game {
}

export class Little_game_channelCfg extends iccfg.ILittle_game_channel {
}

export class Little_game_globalCfg extends iccfg.ILittle_game_global {
}

export class LuckydrawCfg extends iccfg.ILuckydraw {
}

export class Luckydraw_optionalCfg extends iccfg.ILuckydraw_optional {
}

export class Luckydraw_poolCfg extends iccfg.ILuckydraw_pool {
}

export class Luckydraw_summonCfg extends iccfg.ILuckydraw_summon {
}

export class Luckydraw_summon_tipsCfg extends iccfg.ILuckydraw_summon_tips {
}

export class Luckydraw_turntableCfg extends iccfg.ILuckydraw_turntable {
}

export class Luckydraw_turntable2Cfg extends iccfg.ILuckydraw_turntable2 {
}

export class Luckydraw_turntable_tipsCfg extends iccfg.ILuckydraw_turntable_tips {
}

export class Mail_tplCfg extends iccfg.IMail_tpl {
}

export class MainInterface_mainCfg extends iccfg.IMainInterface_main {
}

export class MainInterface_sortCfg extends iccfg.IMainInterface_sort {
}

export class MainInterface_sort_1Cfg extends iccfg.IMainInterface_sort_1 {
}

export class MainInterface_sort_2Cfg extends iccfg.IMainInterface_sort_2 {
}

export class MainInterface_timeplayCfg extends iccfg.IMainInterface_timeplay {
}

export class MainInterface_welfareCfg extends iccfg.IMainInterface_welfare {
}

export class Map_adventureCfg extends iccfg.IMap_adventure {
}

export class Map_caveCfg extends iccfg.IMap_cave {
}

export class Map_expeditionCfg extends iccfg.IMap_expedition {
}

export class Map_footHoldCfg extends iccfg.IMap_footHold {
}

export class Map_relicCfg extends iccfg.IMap_relic {
}

export class Mask_wordCfg extends iccfg.IMask_word {
}

export class MasteryCfg extends iccfg.IMastery {
}

export class Mastery_exploreCfg extends iccfg.IMastery_explore {
}

export class Mastery_lvCfg extends iccfg.IMastery_lv {
}

export class Mastery_recommendCfg extends iccfg.IMastery_recommend {
}

export class Md5_msgCfg extends iccfg.IMd5_msg {
}

export class Mission_7activityCfg extends iccfg.IMission_7activity {
}

export class Mission_7scoreCfg extends iccfg.IMission_7score {
}

export class Mission_7showCfg extends iccfg.IMission_7show {
}

export class Mission_achievementCfg extends iccfg.IMission_achievement {
}

export class Mission_cardsCfg extends iccfg.IMission_cards {
}

export class Mission_dailyCfg extends iccfg.IMission_daily {
}

export class Mission_daily_activeCfg extends iccfg.IMission_daily_active {
}

export class Mission_daily_ritualCfg extends iccfg.IMission_daily_ritual {
}

export class Mission_growCfg extends iccfg.IMission_grow {
}

export class Mission_grow_chapterCfg extends iccfg.IMission_grow_chapter {
}

export class Mission_guildCfg extends iccfg.IMission_guild {
}

export class Mission_main_lineCfg extends iccfg.IMission_main_line {
}

export class Mission_onlineCfg extends iccfg.IMission_online {
}

export class Mission_weeklyCfg extends iccfg.IMission_weekly {
}

export class Mission_weekly_activeCfg extends iccfg.IMission_weekly_active {
}

export class Mission_welfareCfg extends iccfg.IMission_welfare {
}

export class Mission_welfare2Cfg extends iccfg.IMission_welfare2 {
}

export class MoneyCfg extends iccfg.IMoney {
}

export class MonsterCfg extends iccfg.IMonster {
	
	get defaultColor(): number {
        return this.color;
    }
	
    get iconPath(): string {
        return `icon/monster/${this.icon}`;
    }
    
    // 属性保护
    constructor() {
        super();
        ['atk', 'hp', 'def', 'hit', 'dodge', 'speed'].forEach(p => {
            let r = Math.floor(Math.random() * (9999 - 9 + 1) + 9);
            let v = 0;
            Object.defineProperty(this, p, {
                get() { return v + r },
                set(p1) { v = p1 - r },
                enumerable: true,
                configurable: true,
            });
        });
    }
}

export class Monster2Cfg extends iccfg.IMonster2 {
	
	get defaultColor(): number {
        return this.color;
    }
    
    // 属性保护
    constructor() {
        super();
        ['atk', 'hp', 'def', 'hit', 'dodge'].forEach(p => {
            let r = Math.floor(Math.random() * (9999 - 9 + 1) + 9);
            let v = 0;
            Object.defineProperty(this, p, {
                get() { return v + r },
                set(p1) { v = p1 - r },
                enumerable: true,
                configurable: true,
            });
        });
    }
}

export class Monster_simpleCfg extends iccfg.IMonster_simple {
}

export class Newordeal_ordealCfg extends iccfg.INewordeal_ordeal {
}

export class Newordeal_rankingCfg extends iccfg.INewordeal_ranking {
}

export class Operation_bestCfg extends iccfg.IOperation_best {
}

export class Operation_best_showCfg extends iccfg.IOperation_best_show {
}

export class Operation_cardCfg extends iccfg.IOperation_card {
}

export class Operation_dropCfg extends iccfg.IOperation_drop {
}

export class Operation_eggCfg extends iccfg.IOperation_egg {
}

export class Operation_egg_tipsCfg extends iccfg.IOperation_egg_tips {
}

export class Operation_globalCfg extends iccfg.IOperation_global {
}

export class Operation_poolCfg extends iccfg.IOperation_pool {
}

export class Operation_storeCfg extends iccfg.IOperation_store {
}

export class Operation_treasureCfg extends iccfg.IOperation_treasure {
}

export class Operation_treasure_discountCfg extends iccfg.IOperation_treasure_discount {
}

export class Operation_treasure_leftCfg extends iccfg.IOperation_treasure_left {
}

export class Operation_treasure_poolCfg extends iccfg.IOperation_treasure_pool {
}

export class Operation_wishCfg extends iccfg.IOperation_wish {
}

export class OrdealCfg extends iccfg.IOrdeal {
}

export class Ordeal_challengeCfg extends iccfg.IOrdeal_challenge {
}

export class Ordeal_rankingCfg extends iccfg.IOrdeal_ranking {
}

export class PassCfg extends iccfg.IPass {
}

export class Pass_daily_rewardsCfg extends iccfg.IPass_daily_rewards {
}

export class Pass_fundCfg extends iccfg.IPass_fund {
}

export class Pass_month_rewardsCfg extends iccfg.IPass_month_rewards {
}

export class Pass_weeklyCfg extends iccfg.IPass_weekly {
}

export class Peak_challengeCfg extends iccfg.IPeak_challenge {
}

export class Peak_conversionCfg extends iccfg.IPeak_conversion {
}

export class Peak_divisionCfg extends iccfg.IPeak_division {
}

export class Peak_globalCfg extends iccfg.IPeak_global {
}

export class Peak_gradeCfg extends iccfg.IPeak_grade {
}

export class Peak_mainCfg extends iccfg.IPeak_main {
}

export class Peak_poolCfg extends iccfg.IPeak_pool {
}

export class Peak_pool_groupCfg extends iccfg.IPeak_pool_group {
}

export class Peak_rankingCfg extends iccfg.IPeak_ranking {
}

export class Peak_robotCfg extends iccfg.IPeak_robot {
}

export class Pieces_coefficientCfg extends iccfg.IPieces_coefficient {
}

export class Pieces_discCfg extends iccfg.IPieces_disc {
}

export class Pieces_divisionCfg extends iccfg.IPieces_division {
}

export class Pieces_fetterCfg extends iccfg.IPieces_fetter {
}

export class Pieces_globalCfg extends iccfg.IPieces_global {
}

export class Pieces_heroCfg extends iccfg.IPieces_hero {
}

export class Pieces_initialCfg extends iccfg.IPieces_initial {
}

export class Pieces_interestCfg extends iccfg.IPieces_interest {
}

export class Pieces_numberCfg extends iccfg.IPieces_number {
}

export class Pieces_poolCfg extends iccfg.IPieces_pool {
}

export class Pieces_power1Cfg extends iccfg.IPieces_power1 {
}

export class Pieces_power2Cfg extends iccfg.IPieces_power2 {
}

export class Pieces_rankingCfg extends iccfg.IPieces_ranking {
}

export class Pieces_refreshCfg extends iccfg.IPieces_refresh {
}

export class Pieces_silverCfg extends iccfg.IPieces_silver {
}

export class Pieces_starCfg extends iccfg.IPieces_star {
}

export class Pieces_talentCfg extends iccfg.IPieces_talent {
}

export class Platform_activityCfg extends iccfg.IPlatform_activity {
}

export class Platform_globalCfg extends iccfg.IPlatform_global {
}

export class Pve_bornCfg extends iccfg.IPve_born {
}

export class Pve_bossbornCfg extends iccfg.IPve_bossborn {
}

export class Pve_demoCfg extends iccfg.IPve_demo {
}

export class Pve_demo2Cfg extends iccfg.IPve_demo2 {
}

export class Pve_mainCfg extends iccfg.IPve_main {
}

export class Pve_protegeCfg extends iccfg.IPve_protege {
}

export class Pve_spawnCfg extends iccfg.IPve_spawn {
}

export class PvpCfg extends iccfg.IPvp {
}

export class QuickcombatCfg extends iccfg.IQuickcombat {
}

export class Quickcombat_globalCfg extends iccfg.IQuickcombat_global {
}

export class Relic_globalCfg extends iccfg.IRelic_global {
}

export class Relic_mainCfg extends iccfg.IRelic_main {
}

export class Relic_mapCfg extends iccfg.IRelic_map {
}

export class Relic_numberCfg extends iccfg.IRelic_number {
}

export class Relic_openCfg extends iccfg.IRelic_open {
}

export class Relic_passCfg extends iccfg.IRelic_pass {
}

export class Relic_pointCfg extends iccfg.IRelic_point {
}

export class Relic_rankingCfg extends iccfg.IRelic_ranking {
}

export class Relic_taskCfg extends iccfg.IRelic_task {
}

export class Royal_challengeCfg extends iccfg.IRoyal_challenge {
}

export class Royal_divisionCfg extends iccfg.IRoyal_division {
}

export class Royal_globalCfg extends iccfg.IRoyal_global {
}

export class Royal_groupCfg extends iccfg.IRoyal_group {
}

export class Royal_rankingCfg extends iccfg.IRoyal_ranking {
}

export class Royal_robotCfg extends iccfg.IRoyal_robot {
}

export class Royal_sceneCfg extends iccfg.IRoyal_scene {
}

export class RuneCfg extends iccfg.IRune {
    
	get defaultColor(): number {
        return this.color;
    }
}

export class Rune2Cfg extends iccfg.IRune2 {
}

export class Rune2_blessCfg extends iccfg.IRune2_bless {
}

export class Rune2_composeCfg extends iccfg.IRune2_compose {
}

export class Rune2_mixCfg extends iccfg.IRune2_mix {
}

export class Rune2_refineCfg extends iccfg.IRune2_refine {
}

export class Rune2_strengthCfg extends iccfg.IRune2_strength {
}

export class Rune_blessCfg extends iccfg.IRune_bless {
}

export class Rune_clearCfg extends iccfg.IRune_clear {
}

export class Rune_returnCfg extends iccfg.IRune_return {
}

export class Rune_showCfg extends iccfg.IRune_show {
}

export class Rune_unlockCfg extends iccfg.IRune_unlock {
}

export class RuneunlockCfg extends iccfg.IRuneunlock {
}

export class Sailing_freerewardCfg extends iccfg.ISailing_freereward {
}

export class Sailing_globalCfg extends iccfg.ISailing_global {
}

export class Sailing_mapCfg extends iccfg.ISailing_map {
}

export class Sailing_topupCfg extends iccfg.ISailing_topup {
}

export class ScoreCfg extends iccfg.IScore {
}

export class Score_guideCfg extends iccfg.IScore_guide {
}

export class Score_missionCfg extends iccfg.IScore_mission {
}

export class Score_problemCfg extends iccfg.IScore_problem {
}

export class Score_recommendedCfg extends iccfg.IScore_recommended {
}

export class Score_recourseCfg extends iccfg.IScore_recourse {
}

export class SecretareaCfg extends iccfg.ISecretarea {
}

export class Secretarea_festivalCfg extends iccfg.ISecretarea_festival {
}

export class Secretarea_globalCfg extends iccfg.ISecretarea_global {
}

export class Secretarea_global1Cfg extends iccfg.ISecretarea_global1 {
}

export class Secretarea_storeCfg extends iccfg.ISecretarea_store {
}

export class Secretarea_store1Cfg extends iccfg.ISecretarea_store1 {
}

export class SiegeCfg extends iccfg.ISiege {
}

export class Siege_appearanceCfg extends iccfg.ISiege_appearance {
}

export class Siege_checkpointCfg extends iccfg.ISiege_checkpoint {
}

export class Siege_globalCfg extends iccfg.ISiege_global {
}

export class Siege_rankingCfg extends iccfg.ISiege_ranking {
}

export class Siege_storeCfg extends iccfg.ISiege_store {
}

export class Siege_world_levelCfg extends iccfg.ISiege_world_level {
}

export class SignCfg extends iccfg.ISign {
}

export class SkillCfg extends iccfg.ISkill {
    
    // 属性保护
    constructor() {
        super();
        ['dmg_code'].forEach(p => {
            let r = Math.floor(Math.random() * (9999 - 9 + 1) + 9);
            let v = 0;
            Object.defineProperty(this, p, {
                get() { return v + r },
                set(p1) { v = p1 - r },
                enumerable: true,
                configurable: true,
            });
        });
    }
}

export class Skill_buffCfg extends iccfg.ISkill_buff {
    
    // 属性保护
    constructor() {
        super();
        ['effect_code'].forEach(p => {
            let r = Math.floor(Math.random() * (9999 - 9 + 1) + 9);
            let v = 0;
            Object.defineProperty(this, p, {
                get() { return v + r },
                set(p1) { v = p1 - r },
                enumerable: true,
                configurable: true,
            });
        });
    }
}

export class Skill_callCfg extends iccfg.ISkill_call {
}

export class Skill_effect_typeCfg extends iccfg.ISkill_effect_type {
}

export class Skill_gateCfg extends iccfg.ISkill_gate {
}

export class Skill_haloCfg extends iccfg.ISkill_halo {
}

export class Skill_target_typeCfg extends iccfg.ISkill_target_type {
}

export class Skill_trapCfg extends iccfg.ISkill_trap {
}

export class SoldierCfg extends iccfg.ISoldier {
}

export class Soldier_army_skinCfg extends iccfg.ISoldier_army_skin {
}

export class Soldier_army_trammelCfg extends iccfg.ISoldier_army_trammel {
}

export class Soldier_skin_resolveCfg extends iccfg.ISoldier_skin_resolve {
}

export class Sthwar_chooseCfg extends iccfg.ISthwar_choose {
}

export class Sthwar_group_rewardCfg extends iccfg.ISthwar_group_reward {
}

export class Sthwar_personal_rewardCfg extends iccfg.ISthwar_personal_reward {
}

export class Sthwar_pointCfg extends iccfg.ISthwar_point {
}

export class StoreCfg extends iccfg.IStore {
}

export class Store_7dayCfg extends iccfg.IStore_7day {
}

export class Store_awakeCfg extends iccfg.IStore_awake {
}

export class Store_awake_giftCfg extends iccfg.IStore_awake_gift {
}

export class Store_chargeCfg extends iccfg.IStore_charge {
}

export class Store_first_payCfg extends iccfg.IStore_first_pay {
}

export class Store_giftCfg extends iccfg.IStore_gift {
}

export class Store_giftrewardCfg extends iccfg.IStore_giftreward {
}

export class Store_miscCfg extends iccfg.IStore_misc {
}

export class Store_monthcardCfg extends iccfg.IStore_monthcard {
}

export class Store_onepriceCfg extends iccfg.IStore_oneprice {
}

export class Store_pushCfg extends iccfg.IStore_push {
}

export class Store_red_envelopeCfg extends iccfg.IStore_red_envelope {
}

export class Store_runeCfg extends iccfg.IStore_rune {
}

export class Store_sevenday_war_giftCfg extends iccfg.IStore_sevenday_war_gift {
}

export class Store_skinCfg extends iccfg.IStore_skin {
}

export class Store_star_giftCfg extends iccfg.IStore_star_gift {
}

export class Store_time_giftCfg extends iccfg.IStore_time_gift {
}

export class SystemCfg extends iccfg.ISystem {
}

export class System_crosslistCfg extends iccfg.ISystem_crosslist {
}

export class System_eventCfg extends iccfg.ISystem_event {
}

export class Talent_alchemyCfg extends iccfg.ITalent_alchemy {
}

export class Talent_arenaCfg extends iccfg.ITalent_arena {
}

export class Talent_extra_chanceCfg extends iccfg.ITalent_extra_chance {
}

export class Talent_quick_combatCfg extends iccfg.ITalent_quick_combat {
}

export class Talent_treasureCfg extends iccfg.ITalent_treasure {
}

export class TavernCfg extends iccfg.ITavern {
}

export class Tavern_conditionCfg extends iccfg.ITavern_condition {
}

export class Tavern_taskCfg extends iccfg.ITavern_task {
}

export class Tavern_unlockCfg extends iccfg.ITavern_unlock {
}

export class Tavern_valueCfg extends iccfg.ITavern_value {
}

export class Teamarena_divisionCfg extends iccfg.ITeamarena_division {
}

export class Teamarena_mainCfg extends iccfg.ITeamarena_main {
}

export class Teamarena_prizeCfg extends iccfg.ITeamarena_prize {
}

export class Teamarena_rank_prizeCfg extends iccfg.ITeamarena_rank_prize {
}

export class Teamarena_start_scoreCfg extends iccfg.ITeamarena_start_score {
}

export class TechCfg extends iccfg.ITech {
}

export class Tech_consumptionCfg extends iccfg.ITech_consumption {
}

export class Tech_energizeCfg extends iccfg.ITech_energize {
}

export class Tech_globalCfg extends iccfg.ITech_global {
}

export class Tech_poolCfg extends iccfg.ITech_pool {
}

export class Tech_researchCfg extends iccfg.ITech_research {
}

export class Tech_stoneCfg extends iccfg.ITech_stone {
    
    get defaultColor(): number {
        return this.color;
    }
}

export class TipsCfg extends iccfg.ITips {
}

export class Tips_relic_logCfg extends iccfg.ITips_relic_log {
}

export class TvCfg extends iccfg.ITv {
}

export class Twist_eggCfg extends iccfg.ITwist_egg {
}

export class UniqueCfg extends iccfg.IUnique {
    
    get defaultColor(): number {
        return this.color;
    }
}

export class Unique_globalCfg extends iccfg.IUnique_global {
}

export class Unique_lotteryCfg extends iccfg.IUnique_lottery {
}

export class Unique_poolCfg extends iccfg.IUnique_pool {
}

export class Unique_starCfg extends iccfg.IUnique_star {
}

export class VaultCfg extends iccfg.IVault {
}

export class Vault_exchangeCfg extends iccfg.IVault_exchange {
}

export class VipCfg extends iccfg.IVip {
}

export class WorkerCfg extends iccfg.IWorker {
}

export class Worker_assistCfg extends iccfg.IWorker_assist {
}

export class Worker_workCfg extends iccfg.IWorker_work {
}
