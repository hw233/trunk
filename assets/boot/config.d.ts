/**
 * 由机器生成
 * 此处的代码只用作声明，不要在实际业务代码中使用
 */
declare module iccfg {
    
    export class IActivity {
        index : number;
        id : number;
        reward_type : any;
        type : number;
        open_time : number[];
        close_time : number[];
        icon : string;
        name : string;
        cross_id : any;
        platform_id : string;
    }
    
    export class IActivity_alchemy {
        type : number;
        times : number;
        cost : any;
        profit : number;
        ex_times : number;
        ex_condition : number;
    }
    
    export class IActivity_assembled {
        index : number;
        name : string;
        type : number;
        days : number;
        original_price : number;
        discount_price : number;
        rewards : number[][];
        gift : number;
    }
    
    export class IActivity_awards_show {
        index : number;
        activity_type : number;
        type : number;
        number : number;
        reward : number[];
    }
    
    export class IActivity_collect_hero {
        taskid : number;
        type : number;
        target : number;
        desc : string;
        args : number;
        number : number;
        rewards : number[][];
        forward : number;
    }
    
    export class IActivity_continuous {
        taskid : number;
        cycle : number;
        desc : string;
        target : number;
        args : string;
        number : number;
        rewards : number[][];
        forward : number;
    }
    
    export class IActivity_cumlogin {
        index : number;
        type : number;
        days : number;
        rewards : number[];
    }
    
    export class IActivity_discount {
        id : number;
        free_section : number[];
        pay_section : number[];
        RMB_cost : number;
    }
    
    export class IActivity_discount_gift {
        id : number;
        cost : number;
        rewards : number[][];
    }
    
    export class IActivity_flip_cards {
        index : number;
        type : number;
        number : number;
        box_rewards : number[];
        jackpot : number;
    }
    
    export class IActivity_guardian {
        id : number;
        reward_id : number;
        type : number;
        desc : string;
        number : number;
        rewards : number[][];
        limit : number;
        forward : number;
        star : number;
        players : number[];
    }
    
    export class IActivity_land_gifts {
        index : number;
        cycle : number;
        rewards : number[];
        desc : string;
    }
    
    export class IActivity_mysterious {
        id : number;
        index : number;
        type : number;
        money : number;
        icon : number;
        rewards : number[][];
        hero : any;
        model : string;
        scale : any;
        animation : string;
        action1 : string;
        action2 : string;
        action3 : string;
        title : string;
        background : string;
    }
    
    export class IActivity_mystery_enter {
        index : number;
        activity_id : number;
        reward_type : number;
        background : string;
        hero_id : number;
        name : string;
    }
    
    export class IActivity_newtopup {
        index : number;
        type : number;
        money : number;
        rewards : number[][];
    }
    
    export class IActivity_pool {
        index : number;
        jackpot : number;
        number : number;
        item_id : number[];
        probability : number;
        tv_id : number;
        wish_id : any;
        gifts : any;
        type : any;
    }
    
    export class IActivity_ranking3 {
        id : number;
        rank : number;
        rewards : number[][];
        color : number;
    }
    
    export class IActivity_ranking7 {
        id : number;
        rank : number;
        rewards : number[][];
        color : number;
    }
    
    export class IActivity_recharge {
        id : number;
        activityid : number;
        money : number;
        rewards : number[][];
        cost : number[];
        limit : number;
        mount : number[];
    }
    
    export class IActivity_star_gifts {
        taskid : number;
        reward_type : number;
        rounds : number;
        target : number;
        desc : string;
        args : number;
        number : number;
        rewards : number[][];
        forward : number;
    }
    
    export class IActivity_super_value {
        index : number;
        activity_id : number;
        reward_type : number;
        background : string[];
        rewards : number[][];
        system_id : number;
    }
    
    export class IActivity_top_up {
        index : number;
        type : number;
        money : number;
        rewards : number[][];
    }
    
    export class IActivity_upgrade {
        taskid : number;
        activityid : number;
        desc : string;
        target : number;
        args : string;
        number : number;
        rewards : number[][];
        limit : number;
        forward : number;
    }
    
    export class IActivity_weekend_gifts {
        index : number;
        days : number;
        rewards : number[][];
    }
    
    export class IActivitycave_exchange {
        id : number;
        page : number;
        name : string;
        reward : number[];
        item1 : any[];
        item2 : any;
        item3 : any;
        times : number;
    }
    
    export class IActivitycave_gift {
        id : number;
        gift : number;
        page : number;
        group : number;
        coordinate : string;
        name : string;
        icon : number;
        cost : number;
        limit : number;
        total_gift : number;
        pre_gift : any;
        skill : number[];
        atk_r : number;
        def_r : number;
        hp_r : number;
        crit_v : number;
        atk_speed_r : number;
        des : string;
    }
    
    export class IActivitycave_main {
        id : number;
        hero : number[];
        show : number[][];
    }
    
    export class IActivitycave_privilege {
        id : number;
        level : number;
        desc : string;
        exp : number[];
        reward1 : number[][];
        reward2 : number[][];
    }
    
    export class IActivitycave_stage {
        id : number;
        copy_id : number;
        subtype : number;
        prize : number;
        name : string;
        date : number;
        pre_condition : number;
        hardcoreList : number[];
        type_pk : string;
        born : number;
        first_reward : number[][];
        power : number;
        page : number;
        team : number;
        num : number;
        num_worker : number;
        gift : number;
    }
    
    export class IActivitycave_tansuo {
        id : number;
        cost : number;
        hero_weight : number[];
        hero_num : number;
        reward1 : number[];
        reward2 : number[];
        reward3 : any;
        reward4 : any;
    }
    
    export class IAdventure {
        id : number;
        activity_id : number;
        copy_id : number;
        type : number;
        map_id : number;
        difficulty : number;
        rear : string;
        layer_id : number;
        plate : number;
        event_type : number;
        event_id : number;
        resources : string;
        rewards : any;
        power : any;
        show : any;
        prompt : string;
        event_show : string;
    }
    
    export class IAdventure2_adventure {
        id : number;
        activity_id : number;
        copy_id : number;
        map_id : number;
        difficulty : number;
        power : number;
        layer_id : number;
        line : any;
        plate : number;
        event_type : any;
        event_id : any;
        resources : string;
        rewards : any;
        show : any;
        prompt : string;
        event_show : string;
    }
    
    export class IAdventure2_consumption {
        id : number;
        consumption : any;
    }
    
    export class IAdventure2_copy_group {
        id : number;
        group : number;
        copy_id : number;
    }
    
    export class IAdventure2_endless_entry {
        index : number;
        hardcore_id : number;
        name : string;
        icon : string;
        quality : number;
        apply : number[];
        difficulty : number;
        matching_hero : any;
        cost : number;
    }
    
    export class IAdventure2_entry {
        index : number;
        group : number;
        hardcore_id : number;
        name : string;
        type : number;
        icon : string;
        quality : number;
        apply : number[];
        layer : number[];
        type_weight : number;
        weight : number;
        limit : number;
        matching_hero : any;
    }
    
    export class IAdventure2_global {
        key : string;
        value : number[];
    }
    
    export class IAdventure2_hero {
        id : number;
        level : number[];
        star : number;
    }
    
    export class IAdventure2_hire {
        id : number;
        group : number;
        hero : number;
        name : string;
        hero_star : number;
        career_id : number;
        hero_atk : number;
        hero_hp : number;
        hero_def : number;
        hero_hit : number;
        hero_dodge : number;
        hero_skills : number[];
        soldier_id : number;
        describe : string;
        hire_times : number;
        weight : any;
        must : any;
    }
    
    export class IAdventure2_pass {
        id : number;
        taskid : number;
        activityid : number;
        cycle : number;
        desc : string;
        score : number[];
        reward1 : number[][];
        reward2 : number[][];
        resident : any;
    }
    
    export class IAdventure2_random {
        id : number;
        group : number;
        skill : number[];
        last : number;
        des : string;
    }
    
    export class IAdventure2_ranking {
        id : number;
        activity_id : number;
        type : number;
        rank : number;
        rank_rewards : number[][];
        server : number;
    }
    
    export class IAdventure2_restore {
        id : number;
        section : number[];
        backlayer : number;
    }
    
    export class IAdventure2_store {
        id : number;
        activity : number;
        reward_type : number;
        sorting : number;
        goods : number[];
        item_name : string;
        times_limit : number;
        money_cost : number[];
        discount : any;
        unlock_difficulty : string;
        unlock_layer : string;
    }
    
    export class IAdventure2_themehero {
        id : number;
        activity_id : number;
        type : number;
        difficulty : number;
        difficulty_name : string;
        theme_desc : string;
        theme_heroid : string;
        theme_hero : string;
        activity_rewards : number[][];
        effects : string;
        advertising : string;
        background : string;
        unlocktime : number[];
        hardcoreList : number[];
        rewards : any[][];
        push : any;
    }
    
    export class IAdventure2_travel {
        id : number;
        group : number;
        money_cost : number[];
        item : number;
        name : string;
        item_number : number;
        times_limit : number;
        weight : number;
        discount : number;
    }
    
    export class IAdventure2_treasure {
        id : number;
        group : number;
        item : number;
        name : string;
        item_number : number;
        weight : number;
        tv : any;
    }
    
    export class IAdventure_consumption {
        id : number;
        consumption : any;
    }
    
    export class IAdventure_entry {
        index : number;
        group : number;
        hardcore_id : number;
        name : string;
        type : number;
        icon : string;
        quality : number;
        apply : number[];
        layer : number[];
        type_weight : number;
        weight : number;
        limit : number;
        matching_hero : any;
    }
    
    export class IAdventure_global {
        key : string;
        value : number[];
    }
    
    export class IAdventure_hero {
        id : number;
        level : number[];
        star : number;
    }
    
    export class IAdventure_hire {
        id : number;
        group : number;
        hero : number;
        name : string;
        hero_star : number;
        career_id : number;
        hero_atk : number;
        hero_hp : number;
        hero_def : number;
        hero_hit : number;
        hero_dodge : number;
        hero_skills : number[];
        soldier_id : number;
        describe : string;
        hire_times : number;
        weight : any;
        must : any;
    }
    
    export class IAdventure_layerreward {
        id : number;
        activity : number;
        reward_type : number;
        difficulty : number;
        layer : number;
        rewards : number[][];
    }
    
    export class IAdventure_map {
        id : number;
        tw : number;
        th : number;
    }
    
    export class IAdventure_pass {
        id : number;
        taskid : number;
        activityid : number;
        cycle : number;
        desc : string;
        score : number[];
        reward1 : number[][];
        reward2 : number[][];
        resident : any;
    }
    
    export class IAdventure_ranking {
        id : number;
        activity_id : number;
        type : number;
        rank : number;
        rank_rewards : number[][];
        server : number;
    }
    
    export class IAdventure_store {
        id : number;
        activity : number;
        reward_type : number;
        sorting : number;
        goods : number[];
        item_name : string;
        times_limit : number;
        money_cost : number[];
        discount : any;
        unlock_difficulty : string;
        unlock_layer : string;
    }
    
    export class IAdventure_themehero {
        id : number;
        activity_id : number;
        type : number;
        difficulty : number;
        difficulty_name : string;
        theme_desc : string;
        theme_heroid : string;
        theme_hero : string;
        activity_rewards : number[][];
        effects : string;
        advertising : string;
        background : string;
        unlocktime : number[];
    }
    
    export class IAdventure_travel {
        id : number;
        group : number;
        money_cost : number[];
        item : number;
        name : string;
        item_number : number;
        times_limit : number;
        weight : number;
        discount : number;
    }
    
    export class IAdventure_treasure {
        id : number;
        group : number;
        item : number;
        name : string;
        item_number : number;
        weight : number;
        tv : any;
    }
    
    export class IArena_buy {
        id : number;
        buy_number : number;
        money_cost : number[];
        item_cost : number[];
    }
    
    export class IArena_clear {
        max : number;
        recovery_time : number;
    }
    
    export class IArena_point_award {
        id : number;
        win_point : number;
        point_number : any;
        paiming : any;
        settle : any;
        award_1 : number[];
        award_2 : string;
        mail_id : any;
    }
    
    export class IArenahonor_progress {
        id : number;
        progress : number;
        time_begin : number[];
        time_end : number[];
        progress_name : string;
        subject_name : string;
        group : any;
        match : any;
        point_now : any;
        point_win : any;
        reward : any;
        mail_win : any;
        mail_lose : any;
        mail_win : string;
        mail_lose : string;
        tv : any;
        draw : any;
        section : any;
        pvp : any;
    }
    
    export class IArenahonor_rank_show {
        id : number;
        order : number;
        subtype : number;
        title : number;
        paper : string;
    }
    
    export class IArenahonor_rewards {
        id : number;
        subtype : number;
        rank : number;
        reward : number[][];
        mail : number;
        honor : string;
    }
    
    export class IArenahonor_worldwide {
        id : number;
        progress : number;
        time_begin : number[];
        time_end : number[];
        progress_name : string;
        subject_name : string;
        group : any;
        match : any;
        point_now : any;
        point_win : number;
        reward : any;
        mail_win : any;
        mail_lose : any;
        mail_win : string;
        mail_lose : string;
        tv : any;
        draw : any;
        section : any;
        pvp : any;
    }
    
    export class IArenahonor_worship {
        worship_times : number;
        worship_rewards : number;
        worship_value : number;
    }
    
    export class IAttr {
        id : string;
        name : string;
        type : string;
        magic_type : string;
        barracks_type : string;
    }
    
    export class IBarracks {
        id : number;
        type : number;
        barracks_lv : number;
        rounds : number;
        consumption : any[][];
        desc : string;
        hp_g : any;
        atk_g : any;
        def_g : any;
        hit_g : any;
        dodge_g : any;
        dmg_add : any;
        dmg_res : any;
        soldier_id : any;
        scale : any;
    }
    
    export class IBase {
        id : number;
        name : string;
        page : string;
        syid : any;
        guide_button : any;
        skin : string;
        pos : number[];
        build_condition : [];
        day_condition : any;
        vip_level : any;
        cost : [];
        time : number;
    }
    
    export class IBase_activity {
        id : number;
        name : string;
        skin : string;
        stage : number;
        build_condition : number[][];
        day_condition : number;
        page : string;
    }
    
    export class IBase_alchemy {
        lv : number;
        skin : string;
        build_condition : [];
        cost : any[][];
        time : any;
        coin1 : number[];
        coin2 : number[];
        coin3 : number[];
    }
    
    export class IBase_copycoin {
        lv : number;
        skin : string;
        build_condition : [];
        cost : any[][];
        time : any;
    }
    
    export class IBase_copyexp {
        lv : number;
        skin : string;
        build_condition : [];
        cost : any[][];
        time : any;
    }
    
    export class IBase_copypaobing {
        lv : number;
        skin : string;
        build_condition : [];
        cost : any[][];
        time : any;
    }
    
    export class IBase_copyqiangbing {
        lv : number;
        skin : string;
        build_condition : [];
        cost : any[][];
        time : any;
    }
    
    export class IBase_copyrune {
        lv : number;
        skin : string;
        build_condition : [];
        cost : any[][];
        time : any;
    }
    
    export class IBase_copyshouwei {
        lv : number;
        skin : string;
        build_condition : [];
        cost : any[][];
        time : any;
    }
    
    export class IBase_copysurvival {
        lv : number;
        skin : string;
        build_condition : [];
        cost : any[][];
        time : any;
    }
    
    export class IBase_digger {
        lv : number;
        skin : string;
        stage : number;
        build_condition : any;
        cost : any[][];
        time : number;
        reward1 : number[];
        reward2 : number[];
        reward3 : number[];
        reward4 : number[];
        reward5 : number[];
    }
    
    export class IBase_draw {
        lv : number;
        skin : string;
        build_condition : [];
        cost : any[][];
        time : number;
    }
    
    export class IBase_equip {
        lv : number;
        skin : string;
        build_condition : [];
        cost : any[][];
        time : any;
    }
    
    export class IBase_global {
        key : string;
        value : number[];
    }
    
    export class IBase_host {
        lv : number;
        skin : string;
        build_condition : [];
        cost : [];
        time : any;
        open : string;
    }
    
    export class IBase_mainline {
        lv : number;
        skin : string;
        stage : any;
        build_condition : number[][];
        cost : any[][];
        time : number;
        open_stage : number;
    }
    
    export class IBase_queue {
        id : number;
        build_condition : any;
        vip_level : any;
    }
    
    export class IBase_rune {
        lv : number;
        skin : string;
        build_condition : [];
        cost : any[][];
        time : any;
    }
    
    export class IBase_store {
        lv : number;
        skin : string;
        build_condition : [];
        cost : any[][];
        time : any;
    }
    
    export class IBase_varia {
        id : number;
        name : string;
        skin : string;
        stage : number;
        build_condition : number[][];
        day_condition : number;
        time : number;
        item : number[][];
    }
    
    export class IBounty_cost {
        id : number;
        name : string;
        item : number[];
        store : any;
        first_reward : number[];
        num : number;
        reward : number[];
        send_limit : any;
        earn_limit : any;
    }
    
    export class IBounty_main {
        id : number;
        hero_num : number;
        time : number;
        mail : number;
        mail_fail : number;
        mail_quitguild : number;
        mail_timeout : number;
        mail_win : number;
        mail_second : number;
    }
    
    export class ICarnival_cross_rank {
        id : number;
        type : number;
        interval : number[];
        rewards : number[][];
        privilege1 : any;
        privilege2 : any;
        privilege3 : any;
        desc : string;
        preview : string;
    }
    
    export class ICarnival_daily {
        id : number;
        type : number;
        index : number;
        day : number;
        sorting : number;
        desc : string;
        target : number;
        args : any;
        number : number;
        rewards : number[][];
        score : number;
        forward : number;
        level : any;
        fbId : any;
        unlock : string;
    }
    
    export class ICarnival_global {
        key : string;
        value : number[];
    }
    
    export class ICarnival_personal_rank {
        id : number;
        type : number;
        interval : number[];
        rewards : number[][];
    }
    
    export class ICarnival_rewards {
        id : number;
        type : number;
        value : number;
        rewards : number[][];
        icon : string;
    }
    
    export class ICarnival_score {
        days : number;
        ceiling : number;
    }
    
    export class ICarnival_topup {
        id : number;
        type : number;
        interval : number[];
        rewards : number[][];
    }
    
    export class ICarnival_ultimate {
        id : number;
        type : number;
        index : number;
        sorting : number;
        theme : number;
        desc : string;
        prev : any;
        target : number;
        args : any;
        number : number;
        rewards : number[][];
        score : number;
        forward : number;
        level : any;
        fbId : any;
        unlock : string;
    }
    
    export class ICave_adventure {
        id : number;
        type : number;
        map_id : number;
        layer : number;
        plate : number;
        reward : any;
        door : any;
        progress : any;
        explore_reward : any[][];
        gift_icon : any;
        gift_id : any;
        starting_point : any;
    }
    
    export class ICave_global {
        key : string;
        value : number[];
    }
    
    export class ICave_task {
        taskid : number;
        type : number;
        layer : number;
        target : number;
        args : any;
        number : number;
        desc : string;
        rewards : string;
        explore : number;
        key : any;
        forward : number;
    }
    
    export class IChampion_division {
        lv : number;
        division : number;
        name : string;
        point : number;
        limit : number;
        c_point : number;
        score : number;
        lose_score : number;
        match1 : number[];
        match2 : any;
        match3 : any;
        weight1 : number;
        weight2 : any;
        weight3 : any;
    }
    
    export class IChampion_drop {
        id : number;
        season : number;
        lv : number;
        drop_division : any;
        drop_rank : number[][];
        drop_fight : number[];
    }
    
    export class IChampion_exchange {
        id : number;
        season : number;
        drop : number[][];
        cost : number[];
        limit_times : number;
        limit_lv : number;
        tag : any;
    }
    
    export class IChampion_main {
        season : number;
        free : number;
        restore : number;
        limit : number;
        lv : number;
        cost : number[];
        ex_cost : number[][];
        match : number[];
        stage_id : number[];
        bossborn : number[];
        min : number;
        anew : number;
    }
    
    export class IChannel {
        id : number;
        platform_id : number;
        channel_id : number;
        channel_code : any;
        name : string;
        logo : string;
        bg : string;
        cr : string;
        api_urls : string[];
    }
    
    export class ICharge_filter {
        id : number;
    }
    
    export class ICharge_recoup {
        index : number;
        account : number;
        cid : number;
        money : number;
        days : number;
        rate : number;
    }
    
    export class ICheck {
        id : number;
        copy_id : number;
        subtype : any;
        pvp_type : string;
    }
    
    export class ICode {
        id : number;
        code : string;
        reward : number[][];
    }
    
    export class ICombine_cross_rank {
        id : number;
        type : number;
        interval : number[];
        rewards : number[][];
        privilege1 : any;
        privilege2 : any;
        privilege3 : any;
        desc : string;
        preview : string;
    }
    
    export class ICombine_daily {
        id : number;
        type : number;
        index : number;
        day : number;
        sorting : number;
        desc : string;
        target : number;
        args : any;
        number : number;
        rewards : number[][];
        score : number;
        forward : number;
        level : any;
        fbId : any;
        unlock : string;
    }
    
    export class ICombine_global {
        key : string;
        value : number[];
    }
    
    export class ICombine_personal_rank {
        id : number;
        type : number;
        interval : number[];
        rewards : number[][];
    }
    
    export class ICombine_rewards {
        id : number;
        type : number;
        value : number;
        convert_times : number;
        rewards : number[][];
    }
    
    export class ICombine_topup {
        id : number;
        type : number;
        interval : number[];
        rewards : number[][];
    }
    
    export class ICombine_ultimate {
        id : number;
        type : number;
        index : number;
        sorting : number;
        theme : number;
        desc : string;
        prev : any;
        target : number;
        args : any;
        number : number;
        rewards : number[][];
        score : number;
        forward : number;
        level : any;
        fbId : any;
        unlock : string;
    }
    
    export class ICombo {
        task_id : number;
        reward_type : number;
        rounds : number;
        card_id : number;
        target : number;
        args : any;
        number : number;
        desc : string;
        rewards : number[][];
        describe : string;
        system : number;
    }
    
    export class ICombo_gift {
        id : number;
        reward_type : number;
        rounds : number;
        card_id : number[][];
        gift_id : number;
    }
    
    export class ICombo_line {
        id : number;
        reward_type : number;
        rounds : number;
        line_id : number;
        card_id : number[];
        line_rewards : number[];
    }
    
    export class IComments {
        id : number;
        hero_id : number;
        sort : number;
        hot : number;
        head : number;
        name : string;
        content : any;
        review : number;
        forwarding : number;
        label : string[][];
    }
    
    export class IComments_global {
        key : string;
        value : number[];
    }
    
    export class ICommon {
        id : string;
        value : any;
    }
    
    export class ICommon_banner {
        id : number;
        banner : string[];
        sorting : number;
        des : string;
        show : any;
        system : number;
    }
    
    export class ICommon_bubbling {
        index : number;
        level : number;
        bubbling : string;
    }
    
    export class ICommon_carousel {
        id : number;
        activity_id : number;
        background : string;
        sorting : number;
        title : string;
        show : number;
        system : number;
        des : string;
    }
    
    export class ICommon_name {
        id : number;
        rate : number;
        val : string;
    }
    
    export class ICommon_red_point {
        id : number;
        expr : string;
        arg0 : any;
        arg1 : any;
        arg2 : string;
        arg3 : any;
        arg4 : any;
        events : string;
    }
    
    export class ICommon_stronger {
        index : number;
        level : number;
        strengthening : string;
        atk_g : string;
        def_g : string;
        hp_g : string;
        atk_r : string;
        def_r : string;
        hp_r : string;
        class_1 : string;
        class_3 : string;
        class_4 : string;
    }
    
    export class ICommon_tasklist {
        system_id : number;
        task_id : any[][];
    }
    
    export class ICopy {
        id : number;
        copy_id : number;
        name : string;
        subtype : any;
        subtype_name : any;
        subtype_stage : number;
        subtype_date : any;
        quick : number;
        quick_cost : any;
        search : number;
        search_limit : number;
        times : number;
        participate : number;
        item_1 : any;
        des : string;
        title : string;
        activityid : any;
        drop_description : string;
        drop_item : any;
    }
    
    export class ICopy_assist {
        id : number;
        stage_id : any;
        activity_id : number;
        once : number;
        hero_id : number;
        hero_star : number;
        pos : number;
        hero_atk : number;
        hero_hp : number;
        hero_def : number;
        hero_hit : number;
        hero_dodge : number;
        hero_skills : number[];
        soldier_id : number;
        soldier_atk : number;
        soldier_hp : number;
        soldier_def : number;
        soldier_hit : number;
        soldier_dodge : number;
        soldier_skills : number[];
        present : string;
    }
    
    export class ICopy_attrAddition {
        id : number;
        career_type : number;
        atk : number;
        hp : number;
        def : number;
        hit : number;
        dodge : number;
    }
    
    export class ICopy_gateCondition {
        id : number;
        type : number;
        subType : any;
        data1 : any;
        data2 : any;
        data3 : any;
        des : string;
    }
    
    export class ICopy_hardcore {
        id : any;
        camp : any;
        type : any;
        target : any;
        data : any;
        dec : string;
    }
    
    export class ICopy_prize {
        id : number;
        prize_id : number;
        cup : number;
        drop : number[][];
    }
    
    export class ICopy_pvpAddition {
        id : number;
        world_level : number;
        point_type : number;
        power : number;
    }
    
    export class ICopy_ruin_reward {
        index : number;
        chapter : number;
        star : number;
        reward : number[][];
    }
    
    export class ICopy_stage {
        id : number;
        copy_id : any;
        name : string;
        monster : any;
        scale : any;
        power : any;
        type_stage : any;
        subtype : any;
        player_lv : any;
        advice_lv : any;
        order : any;
        pre_condition : any;
        main_condition : any;
        push_condition : any;
        type_pk : string;
        born : number;
        atk_correct : any;
        hp_correct : any;
        protegeId : any;
        drop : any;
        drop_show : any;
        drop_show2 : any;
        wait_drop : any;
        wipe_drop : any;
        drop_2 : any;
        first_reward : any;
        monster_drop : any;
        hardcoreList : any[];
        gateconditionList : any;
        target : any;
        prize : any;
        showitem_1 : any;
        showitem_2 : any;
        showitem_3 : any;
        showitem_4 : any;
        cuptask_1 : string;
        cupaward_1 : any;
        cuptitle_1 : string;
        cupdes_1 : string;
        cuptask_2 : any;
        cupaward_2 : any;
        cuptitle_2 : string;
        cupdes_2 : string;
        cuptask_3 : any;
        cupaward_3 : any;
        cuptitle_3 : string;
        cupdes_3 : string;
        hero : string;
        connect_hero : string;
        drop_limit : any;
        pass_limit : any;
        power_limit : any;
        hangup_type : any;
        des : any;
        bonus : any;
        monster_hp : any;
        sweep : any;
        quality : any;
        city_map : string;
        radio : any;
        describe : string;
        guide : any;
        guaranteed_rewards : string;
        monsters : any;
        time : any;
        hero_awaken : any;
        guide_id : any;
    }
    
    export class ICopy_stage_mastery {
        id : number;
        copy_id : number;
        name : string;
        subtype : number;
        power : number;
        player_lv : number;
        order : number;
        pre_condition : any;
        type_pk : string;
        born : number;
        drop_2 : number[];
        first_reward : number[][];
        hero : number;
        connect_hero : any;
        quick_limit : number;
        des : string;
    }
    
    export class ICopy_towerType {
        id : number;
        stageId : number;
        tower1 : string;
        tower2 : string;
        tower3 : string;
        tower4 : string;
        tower5 : string;
        tower6 : string;
    }
    
    export class ICopy_towerhalo {
        id : number;
        group : number[];
        num : number;
        only : number;
        skill : number;
        cardskill : number;
        des : string;
        des1 : string;
    }
    
    export class ICopy_towerlist {
        num : number;
        general_lv : number;
        cannon : number;
        guard : number;
        gun : number;
    }
    
    export class ICopycup_challenge {
        id : number;
        copy_id : number;
        group_1 : number[];
        group_2 : number[];
        group_3 : number[];
        group_4 : number[];
        group_5 : number[];
        group_6 : number[];
    }
    
    export class ICopycup_hero {
        id : number;
        hero_id : number;
        hero_star : number;
        career_id : number;
        hero_level : number;
        name : string;
        hero_atk : number;
        hero_hp : number;
        hero_def : number;
        hero_hit : number;
        hero_dodge : number;
        hero_skills : number[];
        soldier_id : number;
        soldier_atk : number;
        soldier_hp : number;
        soldier_def : number;
        soldier_hit : number;
        soldier_dodge : number;
        soldier_skills : number[];
        describe : string;
    }
    
    export class ICopycup_prize {
        id : number;
        copy_id : number;
        chapter : number;
        cup : number;
        drop : number[][];
    }
    
    export class ICopycup_rookie {
        id : number;
        stage_id : number;
        commander : number;
        tower_1 : number[];
        tower_2 : any;
        tower_3 : any;
        tower_4 : any;
        tower_5 : string;
        tower_6 : string;
    }
    
    export class ICopysurvival_drop {
        stage_id : number;
        first_reward1 : number[][];
        drop_heroexp : number;
        drop_coin : number;
        drop_point : number;
    }
    
    export class ICopysurvival_drop_add {
        power : number;
        heroexp_add : number;
        coin_add : number;
        point_add : number;
    }
    
    export class ICopysurvival_drop_show {
        stage_id : number;
        drop_show : number[][];
    }
    
    export class ICopysurvival_equip {
        id : number;
        id_equip : number;
        icon : number;
        skill : number;
        group : any;
        weight : number;
        color : number;
        lvmax : number;
        type : any;
        dec : string;
        heroGroup : number;
        career : number;
    }
    
    export class ICopysurvival_hire {
        id : number;
        rewards : number[][];
    }
    
    export class ICopysurvival_stage {
        id : number;
        copy_id : number;
        subtype : number;
        type_stage : number;
        sort : number;
        name : string;
        scale : number;
        power : number;
        type_pk : string;
        born : number;
        num : number;
        num_worker : number;
        hardcoreList : number[];
    }
    
    export class ICopysurvival_strong {
        count : number;
        change : number;
        id_equip : number;
    }
    
    export class ICopyultimate_cycle {
        id : number;
        reward_id : number;
        sort : number;
        power : number;
        born : number;
        first_reward : number[][];
    }
    
    export class ICopyultimate_global {
        key : string;
        value : number[];
    }
    
    export class ICopyultimate_show {
        id : number;
        power : number;
        reward : number[];
    }
    
    export class ICopyultimate_stage {
        id : number;
        reward_id : number;
        copy_id : number;
        subtype : number;
        type_stage : number;
        sort : number;
        name : string;
        scale : number;
        type_pk : string;
        num : number;
        hardcoreList : number[];
        power : number;
        born : number;
        first_reward : number[][];
    }
    
    export class ICostume {
        id : number;
        name : string;
        icon : string;
        career_type : number;
        type : number;
        part : number;
        color : number;
        star : number;
        lv_limit : number;
        attr : any;
        random_attr : any[];
        random_num : any[];
        random_type : any[][];
        des : string;
        show_power : any;
        new_get : any;
        custom : any;
    }
    
    export class ICostume_attr {
        id : number;
        type : number;
        color : number;
        star : number;
        attr : string[];
        attr_show : string;
        attr_type : string;
        group : number;
        initial_value : number[];
    }
    
    export class ICostume_composite {
        id : number;
        type : number;
        color : number;
        num : number;
        icon : string;
        skill_id : any;
        equip_atk_r : any;
        equip_hp_r : any;
        equip_def_r : any;
        des : string;
        name : string;
        power : any;
    }
    
    export class ICostume_cost {
        id : number;
        level : number;
        cost_1 : any;
        cost_2 : any;
        cost_3 : any;
        cost_4 : any;
    }
    
    export class ICostume_decompose {
        id : number;
        color : number;
        star : number;
        decompose : number;
    }
    
    export class ICostume_global {
        key : string;
        value : number[];
    }
    
    export class ICostume_mission {
        task_id : number;
        reward_type : number;
        theme : number;
        prev : any;
        target : number;
        args : any;
        number : number;
        desc : string;
        rewards : [];
        score : number;
        forward : any;
    }
    
    export class ICostume_progress {
        id : number;
        type : number;
        score : number;
        rewards : number[];
    }
    
    export class ICostume_quality {
        id : number;
        attr : string[];
        quality : number[];
    }
    
    export class ICross_etcd {
        id : string;
        cross_open : any;
        meg_open : any;
    }
    
    export class IDiary {
        taskid : number;
        index : number;
        days : number;
        reward_type : number;
        sorting : number;
        desc : string;
        target : number;
        args : any;
        number : number;
        reward : number[][];
        forward : number;
        color : any;
    }
    
    export class IDiary_global {
        key : string;
        value : number[];
    }
    
    export class IDiary_reward {
        id : number;
        index : number;
        reward_type : number;
        level : number;
        desc : string;
        value : any;
        rewards : any;
    }
    
    export class IDiary_reward1 {
        id : number;
        index : number;
        reward_type : number;
        level : number;
        desc : string;
        value : any;
        rewards : any;
    }
    
    export class IEnergystation_advanced {
        id : number;
        index : number;
        type : number;
        class : number;
        level : number;
        limit : any;
        consumption : any;
        hero_consumption : any;
        hero_atk_r : number;
        hero_hp_r : number;
        hero_def_r : number;
        camp : any;
        desc : string;
    }
    
    export class IEnergystation_type {
        type : number;
        name : string;
        consumption : number[];
        resources : string;
    }
    
    export class IEnergystation_upgrade {
        id : number;
        type : number;
        level : number;
        times : number;
        exp : number;
        consumption : any;
        hero_atk : number;
        hero_hp : number;
        hero_def : number;
        hero_hit : number;
        hero_dodge : number;
    }
    
    export class IError {
        id : number;
        code : string;
        desc : string;
    }
    
    export class IEternal_global {
        key : string;
        value : number[];
    }
    
    export class IEternal_stage {
        id : number;
        copy_id : number;
        subtype : number;
        monster : number;
        scale : number;
        interface : number;
        level : number;
        head : number;
        quality : number;
        name : string;
        type_pk : string;
        born : number;
        hardcoreList : any[];
        difficulty : number;
        recommended : number;
        pass_limit : string;
        power_limit : number;
        show_rewards : number[][];
        camp : any[];
    }
    
    export class IExchange {
        RMB_cost : number;
        USD_cost : number;
    }
    
    export class IExpedition_buff {
        id : number;
        professional_type : number;
        strengthen_level : number;
        buff_id : any;
        buff_icon : any;
        buff_color : any;
        power : string;
    }
    
    export class IExpedition_desc {
        id : number;
        privilege : number;
        desc : string;
    }
    
    export class IExpedition_energy {
        energy : number;
        consumption : number[];
    }
    
    export class IExpedition_forces {
        index : number;
        type : number;
        id : number;
        name : string;
        exp : any;
        skin : string;
        rewards : any;
        privilege0 : number;
        privilege1 : any;
        privilege2 : any;
        privilege3 : any;
        privilege4 : string;
        privilege5 : string;
        privilege6 : string;
        privilege7 : string;
        desc : string;
    }
    
    export class IExpedition_global {
        key : string;
        value : number[];
    }
    
    export class IExpedition_map {
        id : number;
        type : number;
        entrance_id : number;
        map_id : number;
        name : string;
        rewards : [];
        head : string;
        prompt : string;
        conditions_type : number;
        parameter : number[][];
        skin : any[];
        background : string;
    }
    
    export class IExpedition_mission {
        index : number;
        type : number;
        id : number;
        mission_id : number;
        node : number;
        group : number;
        index : number;
        prev : string;
        desc : string;
        target : number;
        args : any;
        number : number;
        exp : number;
        map_limit : string;
    }
    
    export class IExpedition_point {
        id : number;
        type : number;
        index : number;
        map_id : number;
        point_type : number;
        skin_type : number;
        point_skin : any[];
        occupation_skin : any;
        time_limit : string;
        output_reward : number[][];
        stage_id1 : number;
        stage_id2 : any;
        monster_skin : number[][];
        show_reward : number[][];
        name : string;
        map_name : string;
        before : string;
        after : string;
    }
    
    export class IExpedition_power {
        id : number;
        proportion : number;
        bonus : number;
    }
    
    export class IExpedition_ranking {
        id : number;
        type : number;
        rank : number[];
        rank_rewards : number[][];
        server : number;
    }
    
    export class IExpedition_stage {
        index : number;
        type : number;
        id : number;
        stage_id : number;
        reward : any;
        value : number;
        power : number;
    }
    
    export class IExpedition_strengthen {
        id : number;
        professional_type : number;
        type : number;
        level : number;
        consumption : any;
        atk : any;
        def : any;
        hp : any;
        dmg_add : any;
        dmg_res : any;
        attribute : any;
        limit : number;
    }
    
    export class IExpedition_unlock {
        location : number;
        level : number;
    }
    
    export class IFoothold_ascension {
        id : number;
        ascension : number[];
    }
    
    export class IFoothold_base {
        level : number;
        exp : any;
        rewards : [][];
        name : string;
        skin : string;
        skin1 : string;
        skin2 : string;
        skin3 : string;
        privilege0 : any;
        privilege1 : any;
        privilege2 : number;
        privilege3 : any;
        privilege4 : number;
        privilege5 : any;
        privilege6 : any;
        privilege7 : [];
        desc : string;
    }
    
    export class IFoothold_bg {
        id : number;
        map_id : number;
        background : string;
    }
    
    export class IFoothold_bonus {
        id : number;
        map_id : number;
        map_type : number;
        world_level : number;
        resources_skin : string;
        attribute_skin : string;
        attenuation_skin : string;
        base_exp : number;
        bonus_resources : [];
        bonus_attribute1 : number[];
        bonus_attribute : number[];
        bonus_attenuation : number[];
        round : number[];
    }
    
    export class IFoothold_city {
        index : number;
        level : number;
        score : number;
        scale : number;
        reply : number;
        team : number;
        effect : string;
        bonus : [];
        resources : string;
        resources_scale : number;
    }
    
    export class IFoothold_cooperation_ranking {
        id : number;
        ranking : number[];
        sorting : number[];
        rewards : number[][];
    }
    
    export class IFoothold_dailytask {
        id : number;
        index : number;
        desc : string;
        target : number;
        args : string;
        number : number;
        exp : number;
        rewards : string;
        forward : string;
    }
    
    export class IFoothold_energy {
        index : number;
        consumption : number;
    }
    
    export class IFoothold_global {
        key : string;
        value : number[];
    }
    
    export class IFoothold_open {
        id : number;
        map_type : number;
        interval : number[];
        map_monster : number[][];
    }
    
    export class IFoothold_point {
        id : number;
        map_id : number;
        map_type : number;
        world_level : number;
        point_type : number;
        resources : string;
        score : number;
        round : number[];
        rewards : number[][];
        time_limit : any;
        guild_pve_awards : any[][];
        world_pve_awards_2 : any;
        world_pvp_win_awards_2 : any;
        world_pvp_lose_awards_2 : any;
        world_pve_awards_3 : any;
        world_pvp_win_awards_3 : any;
        world_pvp_lose_awards_3 : any;
        interval : any;
        output_reward : any;
        base_exp : any;
        reply : any;
        robot : any;
        describe : string;
        HP : any;
        guard_HP : any;
        map_monster : number[][];
    }
    
    export class IFoothold_quiz {
        type_id : number;
        order : number;
        desc : string;
        number : number;
        rounds1 : any;
        rounds2 : any;
        rounds3 : any;
        rounds4 : any;
        rounds5 : any;
        rounds6 : any;
        rounds7 : any;
        rounds8 : any;
        rounds9 : any;
        rounds10 : any;
        rounds11 : any;
        rounds12 : any;
        icon : number;
        content : string;
    }
    
    export class IFoothold_ranking {
        id : number;
        index : number;
        map_type : number;
        ranking : number;
        rewards : number[][];
        warehouse : number[][];
        warehouse_show : number[][];
    }
    
    export class IFoothold_ranktask {
        id : number;
        index : number;
        theme : number;
        desc : string;
        target : number;
        args : any;
        number : number;
        prev : any;
        exp : number;
        rewards : string;
        forward : string;
    }
    
    export class IFoothold_recommend {
        index : number;
        cycle : number;
        group : number[];
        hardcoreList : number[];
    }
    
    export class IFoothold_special_reward {
        id : number;
        quality : number;
        item_id : number;
        item_name : string;
    }
    
    export class IFoothold_teaching {
        id : number;
        order : number;
        title : string;
        rewards : number[][];
        desc : string;
        stage : number;
        eventid : number;
        number : number;
        pictures : string[][];
        guide : number;
    }
    
    export class IFoothold_title {
        id : number;
        level : number;
        name : string;
        icon : string;
        exp : any;
        privilege0 : any;
        privilege1 : any;
        privilege2 : any;
        privilege3 : any;
        privilege4 : any;
        privilege5 : any;
        privilege6 : any;
        privilege7 : any;
        rewards : string;
        desc : string;
        desc1 : string;
    }
    
    export class IFoothold_tower {
        index : number;
        map_id : number;
        tower_id : number;
        weights : number[];
        buff_effect : number[][];
        buff : any;
        tower_type : number;
        resources_scale : number;
    }
    
    export class IFoothold_world_level {
        index : number;
        average_level : number[];
        monster_level : number;
    }
    
    export class IForbidtips {
        id : number;
        code : number;
        desc : string;
        style : number;
        opt : string;
    }
    
    export class IGene {
        id : number;
        type : number;
        camp : number;
        pool : number;
        item : number[];
        drop : any[][];
        show : [];
    }
    
    export class IGene_global {
        key : string;
        value : number[];
        desc : string;
    }
    
    export class IGene_group {
        index : number;
        pool_id : number;
        hero_id : number;
    }
    
    export class IGene_pool {
        id : number;
        name : string;
        drop_0 : any;
        drop_1 : number;
        weight_1 : number;
        drop_2 : any;
        weight_2 : any;
    }
    
    export class IGene_store {
        id : number;
        camp : number;
        order : number;
        target : number[];
        cost : number[];
        VIP_limit : any;
    }
    
    export class IGene_transition {
        id : number;
        camp : number;
        star : number;
        pool : number;
        item : number[];
    }
    
    export class IGeneral {
        lv : number;
        energy_charge : number;
        exp : number;
        atk_w : number;
        hp : number;
        range : number;
        hit_w : number;
        crit_w : number;
        hurt_w : number;
        def_pene_w : number;
        speed : number;
        atk_speed_w : number;
        atk_speed_r : number;
        ratio : number;
        cd : number;
        artifact : string;
    }
    
    export class IGeneral_commander {
        id : number;
        skill_id : number;
        skill_level : number;
        describe : string;
        attrDesc : string;
        show : any;
        unlock : string;
    }
    
    export class IGeneral_skin {
        ID : number;
        name : string;
        size : number;
        road : string;
    }
    
    export class IGeneral_weapon {
        artifactid : number;
        sorting : number;
        chapter : number;
        item : number;
        skill : any;
        skillEffect : string;
        resources : number;
        name : string;
        icon : any;
        quality : number;
        des : string;
        way_des : string;
        content : string;
        tip : string;
        atk_h : number;
        hp_h : number;
        def_h : number;
        atk_s : number;
        hp_s : number;
        def_s : number;
        leave_for : number;
        show : any;
    }
    
    export class IGeneral_weapon_level {
        id : number;
        lv : number;
        times : number;
        atk_g : number;
        hp_g : number;
        def_g : number;
        power : number;
        exp : any;
        cost : any;
    }
    
    export class IGeneral_weapon_mission {
        id : number;
        desc : string;
        chapter : number;
        target : number;
        args : any;
        number : number;
        reward1 : number[];
        reward2 : string;
        reward3 : string;
        forward : number;
    }
    
    export class IGeneral_weapon_progress {
        id : number;
        lv : number;
        skill : any;
        dmg_add : number;
        dmg_res : number;
        consumption : number[][];
    }
    
    export class IGift_daily_first {
        index : number;
        world_level : number[];
        RMB_cost : number;
        rewards : number[][];
    }
    
    export class IGift_power {
        index : number;
        desc : string;
        name : string;
        power : number;
        reward : number[][];
    }
    
    export class IGlobal {
        key : string;
        value : any[];
    }
    
    export class IGlobal_conversion {
        id : number;
        exp : number;
        conversion : number[][];
    }
    
    export class IGlobal_holiday {
        index : number;
        date : string;
        desc : string;
    }
    
    export class IGlobal_power {
        key : string;
        value : any;
    }
    
    export class IGlobal_push {
        key : string;
    }
    
    export class IGlobal_pvp {
        power : number;
        atk_ratio : number;
        hp_ratio : number;
        def_ratio : number;
        hit_ratio : number;
        dodge_ratio : number;
        atk_ratio_hero : number;
        hp_ratio_hero : number;
        def_ratio_hero : number;
        hit_ratio_hero : number;
        dodge_ratio_hero : number;
    }
    
    export class IGlobal_white_ip {
        index : number;
        ip : string;
    }
    
    export class IGlobal_words {
        key : string;
        value : string;
    }
    
    export class IGroup {
        id : number;
        name : string;
        icon : string;
        desc : string;
        show : number;
    }
    
    export class IGrowthfund {
        id : number;
        desc : string;
        level : number;
        reward : number[][];
    }
    
    export class IGrowthfund_towerfund {
        id : number;
        desc : string;
        layer : number;
        reward : number[][];
    }
    
    export class IGuardian {
        id : number;
        name : string;
        star_min : number;
        star_max : number;
        color : number;
        icon : number;
        skin : string;
        atk_w : number;
        hp_w : number;
        def_w : number;
        skill : number[];
        skill_show : number;
        tag : string;
        disint_item : number[][];
        show : number;
        desc : string;
    }
    
    export class IGuardian_copy_skill {
        color : number;
        skill : number;
    }
    
    export class IGuardian_cumulative {
        index : number;
        reward_type : number;
        reward_id : number;
        integral : number;
        awards : number[][];
        days : number;
    }
    
    export class IGuardian_draw {
        index : number;
        activityid : number;
        reward_type : number;
        type : number;
        award : number[];
        weight : number;
        wish : any;
        must : any;
        tv_id : number;
        bg : string;
    }
    
    export class IGuardian_equip {
        id : number;
        name : string;
        icon : number;
        part : number;
        part_des : string;
        type : number;
        des : string;
    }
    
    export class IGuardian_equip_lv {
        id : number;
        star : number;
        type : number;
        lv : number;
        part : number;
        consumption : number[][];
        atk_growth : number;
        hp_growth : number;
        def_growth : number;
        hit_growth : number;
        dodge_growth : number;
    }
    
    export class IGuardian_equip_skill {
        id : number;
        type : number;
        star : number;
        number : number;
        equip_hp : number;
        equip_def : number;
        equip_atk : number;
        equip_hit : number;
        equip_dodge : number;
        equip_skill : any;
        des_title : string;
        des : string;
    }
    
    export class IGuardian_equip_star {
        id : number;
        type : number;
        part : number;
        color : number;
        star : number;
        limit : number;
        disint_item : number[];
        atk_g : number;
        hp_g : number;
        def_g : number;
        hit_g : number;
        dodge_g : number;
        consumption : any[][];
        special : any[][];
        alternative : number[][];
    }
    
    export class IGuardian_fallback {
        id : number;
        star : number;
        item_id : number[];
    }
    
    export class IGuardian_global {
        key : string;
        value : number[];
    }
    
    export class IGuardian_lv {
        id : number;
        cost_color2 : any;
        cost_color3 : any;
        cost_color4 : any;
    }
    
    export class IGuardian_star {
        id : number;
        guardian_id : number;
        guardian_lv : number;
        star : number;
        cost_star : any;
        atk_g : number;
        hp_g : number;
        def_g : number;
        grow_atk : number;
        grow_hp : number;
        grow_def : number;
        skill_lv : number;
    }
    
    export class IGuardian_tips {
        index : number;
        reward_type : number;
        item_icon : number;
        item : string;
        weight : number;
    }
    
    export class IGuardian_trailer {
        id : number;
        activityid : number;
        reward_type : number;
        guardian_id : number[][];
        desc : string;
    }
    
    export class IGuardiantower_guardian {
        index : number;
        id : number;
        guardian_id : number;
        name : string;
        size : number;
        star : number;
        color : number;
        atk_w : number;
        hp_w : number;
        def_w : number;
        skill : any[];
        skill_level : number;
    }
    
    export class IGuardiantower_prize {
        index : number;
        subtype : number;
        order : number;
        rank_prize : number[][];
        rank1 : number[];
        rank2 : number[];
        rank3 : number[];
        rank4 : number[];
    }
    
    export class IGuardiantower_show {
        subtype : number;
        prize_show : number[][];
    }
    
    export class IGuardiantower_tower {
        id : number;
        copy_name : string;
        subtype : number;
        type_stage : any;
        copy_id : string[];
        power : number;
        first_reward : number[][];
        sweep : number[][];
        show : number[];
        enemy_name : string;
        enemy_level : number;
        hero_place_1 : number;
        hero_place_2 : number;
        hero_place_3 : number;
        hero_place_4 : number;
        hero_place_5 : number;
        hero_place_6 : number;
        guardian_place_1 : any;
        guardian_place_2 : any;
        guardian_place_3 : any;
        guardian_place_4 : any;
        guardian_place_5 : any;
        guardian_place_6 : any;
        soldier1 : number;
        soldier2 : number;
        soldier3 : number;
        soldier4 : number;
        soldier5 : number;
        soldier6 : number;
        hardcore : any;
        hardcore_show : any;
        tv : any;
    }
    
    export class IGuardiantower_unlock {
        index : number;
        copy_section : number[];
        unlocktime : number[];
    }
    
    export class IGuide {
        id : number;
        group : number;
        type : any;
        nextTask : any;
        force : any;
        maskAlpha : number;
        maskInverted : any;
        dependence : any;
        activeCondition : string;
        finishCondition : string;
        turn : any;
        openSys : any;
        forward : any;
        function : any;
        preload : string;
        bindBtnId : any;
        bindBtnOffset : any;
        dragPos : any;
        delay : any;
        bg : string;
        skip : string;
        npcName : string;
        npcHead : any;
        scale : any;
        text : string;
        textPos : any;
        textSize : string;
        des : string;
        operation : string;
        order : any;
        step : any;
        des2 : string;
    }
    
    export class IGuide_button {
        id : number;
        button : string;
        interface : string;
    }
    
    export class IGuild_access {
        id : number;
        position : number;
    }
    
    export class IGuild_active {
        id : number;
        value : number;
        rewards : number[][];
    }
    
    export class IGuild_donation {
        id : number;
        type : number;
        consumption : number[];
        exp : number;
        guild_exp : number;
    }
    
    export class IGuild_enter {
        id : number;
        system : number;
        sorting : number;
        rewards_show : number[];
        time_show : string;
    }
    
    export class IGuild_global {
        key : string;
        value : number[];
    }
    
    export class IGuild_icon {
        id : number;
        type : number;
        name : string;
        skin : number;
    }
    
    export class IGuild_log {
        id : number;
        type : number;
        text : string;
        title : string;
        label : string;
        desc : string;
    }
    
    export class IGuild_lv {
        id : number;
        exp : number;
        clv : number;
        number : number;
    }
    
    export class IGuild_name {
        id : number;
        name : string;
    }
    
    export class IGuild_robot {
        id : number;
        level : number;
        vip : number;
        battle_hero : number[][];
        equip : number[][];
        tower : number;
    }
    
    export class IGuild_sign {
        id : number;
        reward1 : number[][];
        exp : number;
        boss_point : number;
        number2 : number;
        reward2 : number[][];
        number3 : number;
        reward3 : number[][];
    }
    
    export class IGuildboss {
        id : number;
        type : number;
        name : string;
        copy_id : number;
        level : number;
        type_pk : string;
        born : number;
        reward : number[][];
        percent_reward1 : number[][];
        percent_reward2 : number[][];
        percent_reward3 : number[][];
        boss_hp : number;
        reward_show : number[][];
        hardcoreList : number[];
    }
    
    export class IGuildboss_ranking {
        id : number;
        level : number;
        rank : number[];
        rank_reward : number[][];
    }
    
    export class IGuildpower_boss {
        id : number;
        type : number;
        open : number;
        name : string;
        skin : string;
        size : number;
        reward : any[][];
        gateconditionList : number[];
        percent_reward1 : any;
        percent_reward2 : any;
        percent_reward3 : any;
        extra_reward : any;
        reward_show : number[][];
    }
    
    export class IGuildpower_boss_hp {
        id : number;
        world_lv : number;
        common_hp : number;
        endless_hp : number;
    }
    
    export class IGuildpower_global {
        key : string;
        value : number[];
    }
    
    export class IHeadframe {
        id : number;
        name : string;
        order : number;
        sub_order : number;
        icon : any;
        desc : string;
        paper : string;
        attribute_desc : string;
        paging : any;
        timeliness : any;
        object : any;
        atk_w : string;
        hp_w : string;
        def_w : string;
        hit_w : string;
        dodge_w : string;
        crit_w : string;
        atk_p : any;
        hp_p : any;
        def_p : any;
        hit_p : string;
        dodge_p : string;
        crit_p : string;
        forward : string;
    }
    
    export class IHeadframe_title {
        id : number;
        title_id : number;
        name : string;
        level : number;
        order : number;
        sub_order : number;
        icon : any;
        desc : string;
        paper : string;
        attribute_desc : string;
        timeliness : any;
        object : any;
        atk_w : string;
        hp_w : string;
        def_w : string;
        hit_w : string;
        dodge_w : string;
        crit_w : string;
        atk_p : any;
        hp_p : any;
        def_p : any;
        hit_p : string;
        dodge_p : string;
        crit_p : string;
        forward : string;
    }
    
    export class IHero {
        id : number;
        name : string;
        skin : string;
        size : number;
        icon : number;
        star_min : number;
        star_max : number;
        awake : any;
        career_id : number;
        speech : string;
        desc : string;
        soldier_id : number[];
        group : number[];
        sex : number;
        atk_speed : number;
        atk_w : number;
        hp_w : number;
        def_w : number;
        hit_w : number;
        dodge_w : number;
        crit_w : number;
        hurt_w : number;
        grow_atk : number;
        grow_hp : number;
        grow_def : number;
        grow_hit : number;
        grow_dodge : number;
        grow_crit : number;
        grow_hurt : number;
        gift_tower_id : number;
        range : number;
        cd : number;
        add_soldier_atk : number;
        add_soldier_def : number;
        add_soldier_hp : number;
        show : number;
        size_ui : number;
        coordinate : number[];
        compose_show : any[];
        best : number;
        new_get : any[][];
    }
    
    export class IHero_awake {
        id : number;
        hero_id : number;
        icon : number;
        awake_lv : number;
        star : number;
        atk_w : number;
        hp_w : number;
        def_w : number;
        hit_w : number;
        dodge_w : number;
        ul_awake_skill : any;
        gift_tower_id : any;
        ul_skill1 : any;
        ul_skill2 : any;
        ul_skin : string;
        target : any;
        args1 : any;
        args2 : any;
        number : any;
        forward : any;
        desc : string;
        awake_item1 : any;
        awake_item2 : any;
        awake_item3 : any;
        copy_id : any;
    }
    
    export class IHero_career {
        id : number;
        hero_id : number;
        career_id : number;
        career_type : number;
        icon : string;
        name : string;
        line : number;
        career_lv : number;
        hero_lv : number;
        trans_cost : any[];
        career_item1 : any[][];
        atk_w : number;
        hp_w : number;
        def_w : number;
        hit_w : number;
        dodge_w : number;
        crit_w : number;
        range : number;
        speed : number;
        hate_num : number;
        revive : number;
        heal : number;
        atk_order : number;
        grow_atk : number;
        grow_hp : number;
        grow_def : number;
        grow_hit : number;
        grow_dodge : number;
        grow_crit : number;
        atk_speed : number;
        ul_skill : any[];
    }
    
    export class IHero_career_desc {
        id : number;
        name : string;
        desc : string;
    }
    
    export class IHero_crystal {
        id : number;
        level : number;
        consume : any;
        deduction : any;
        bubbles : any[][];
    }
    
    export class IHero_displace {
        id : number;
        star : number;
        group : number[];
        cost : number[];
        num : number;
    }
    
    export class IHero_fallback {
        id : number;
        group : number;
        star : number;
        item_id : number;
    }
    
    export class IHero_global {
        key : string;
        value : number[];
    }
    
    export class IHero_grow {
        id : number;
        name : string;
        grow_lv : number;
        show : string;
        grow : number;
    }
    
    export class IHero_legion {
        legion_lv : number;
        legion_consumption : number[];
        legion_r : number;
    }
    
    export class IHero_lv {
        id : number;
        clv : number;
        rlv : number;
        cost : any[][];
    }
    
    export class IHero_mystery_skill {
        hero_id : number;
        skill1 : number;
        skill2 : number;
        skill3 : number;
        skill4 : number;
        weight1 : number;
        weight2 : number;
        weight3 : number;
        weight4 : number;
    }
    
    export class IHero_rebirth {
        id : number;
        group : number;
        star : number;
        item_id : number;
    }
    
    export class IHero_rebirth_hero {
        id : number;
        type : number;
        star : number[][];
    }
    
    export class IHero_reset {
        career_lv : number;
        consume : number[];
    }
    
    export class IHero_star {
        star : number;
        color : number;
        add : number;
        add_grow : number;
        add_grow_mystery : number;
        gift_lv : number;
        career_lv : number;
        cost_1 : any;
        cost_2 : any;
        cost_3 : any;
        decompose : number[];
        star_limit : any;
        cost_4 : [];
        awake : any;
        fallback : any;
        rebirth : any;
    }
    
    export class IHero_trammel {
        index : number;
        trammel_id : number;
        hero_id : number;
        trammel_name : string;
        trammel_hero : number[];
        star_colour : number;
        star_lv : number;
        atk_g : any;
        hp_g : any;
        def_g : any;
        hit_g : string;
        dodge_g : string;
        crit_v : any;
        atk_speed_r : any;
        dmg_add : any;
        dmg_res : any;
        atk_dmg : any;
        atk_res : any;
        power_dmg : any;
        power_res : any;
        dmg_fire : any;
        fire_res : any;
        dmg_cold : any;
        cold_res : any;
        dmg_elec : any;
        elec_res : any;
        dmg_radi : any;
        radi_res : any;
        dmg_punc : any;
        punc_res : any;
    }
    
    export class IHero_undersand_level {
        mystery_skill : number;
        undersand_level : number;
        desc : number;
        atk_r : number;
        def_r : number;
        hp_r : number;
        hit_r : number;
        dodge_r : number;
        effect_res : string;
    }
    
    export class IHonour {
        id : number;
        sorting : number;
        name : string;
        target : number;
        forward : number;
    }
    
    export class IHotel_freereward {
        index : number;
        type : number;
        rewards : number[][];
    }
    
    export class IHotel_global {
        key : string;
        value : number[];
    }
    
    export class IHotel_map {
        id : number;
        type : number;
        layer : number;
        pre : any;
        number : number;
        reward : number[][];
        hero : number;
        awakening : any;
        progress : any;
        weight : number;
        scale : number;
    }
    
    export class IItem {
        id : number;
        name : string;
        icon : any;
        color : number;
        page : number;
        max : any;
        lv_limit : any;
        get : any;
        stage_id : any;
        use_type : number;
        disint_desc : string;
        disint_type : number;
        disint_item : any;
        des : string;
        func_id : string;
        func_args : any;
        store_id : any;
        exclusive : any;
        random_hero_chip : any;
        career : any;
        effects : any;
        new_get : any;
        price : any;
        func_args2 : any;
        func_args3 : any;
        style : any;
    }
    
    export class IItem_compose {
        id : number;
        amount : number;
        target : any;
        drop : any;
    }
    
    export class IItem_drop {
        id : number;
        drop_id : number;
        run : string;
        drop_num : number;
        range_1 : [];
        range_2 : [];
        weight : any;
        probability : any;
        item_id : any;
        item_num : number;
        group_id : any;
        tv_id : any;
        gift_id : any;
    }
    
    export class IItem_drop_group {
        index : number;
        group_id : number;
        item_id : number;
        item_num : number;
        weight : number;
    }
    
    export class IItem_equip {
        id : number;
        name : string;
        icon : number;
        power : number;
        part : number;
        color : number;
        star : number;
        target_equip : any;
        material_number : any;
        consumption : any[];
        disint_item : number;
        disint_num : number;
        isShow : string;
        atk_g : number;
        hp_g : any;
        def_g : any;
        hit_g : any;
        dodge_g : number;
        crit_g : number;
        des : string;
        store_id : [];
        diamond_lv : number;
        effects : any;
    }
    
    export class IItem_equip_suitskill {
        id : number;
        color : number;
        star : number;
        number : number;
        equip_hp : any;
        equip_def : any;
        equip_atk : any;
        des_title : string;
        des : string;
    }
    
    export class IItem_ruby {
        id : number;
        type : number;
        sub_type : number;
        level : number;
        name : string;
        icon : number;
        des : string;
        color : number;
        atk_g : number;
        def_g : number;
        hp_g : number;
        hit_g : number;
        crit_g : number;
        dmg_add : number;
        dmg_res : number;
        cost : number;
        equip_part : number;
        part : number[];
        decompose : string;
        exp : number;
        number : number;
        ruby_des : string;
        get : number;
    }
    
    export class IJustice_bonus {
        lv : number;
        general : number;
        hero : number;
    }
    
    export class IJustice_boss {
        id : number;
        name : string;
        head : number;
        scene : string;
        skin : string;
        size : number;
        hp : number;
        limit : any;
        recommended : any;
        sceneBg : string;
        score : number;
        show : number[][];
        box : string;
        max_box : number;
        slot : number;
        mercenary : number;
        automatic : number;
        general_lv : number;
        first_reward : string;
        crit_reward : number[];
        drop : number[];
        rewards : string;
        upper_limit : number;
        probability : number;
        ratio : number;
        drop_show : number[];
        des_showTime : any;
        des : string;
        save : any;
    }
    
    export class IJustice_frame {
        lv : number;
        interval_1 : number;
        interval_3 : number;
        interval_4 : number;
        damage_1 : number;
        damage_3 : number;
        damage_4 : number;
        frame_1 : string;
        frame_3 : string;
        frame_4 : string;
        ballistic_1 : string;
        ballistic_3 : string;
        ballistic_4 : string;
        sound_1 : string;
        sound_3 : string;
        sound_4 : string;
        emission_1 : string;
        emission_3 : string;
        emission_4 : string;
    }
    
    export class IJustice_general {
        lv : number;
        exp : number;
        output : number;
        interval : number;
    }
    
    export class IJustice_mercenary {
        id : number;
        type : number;
        name : string;
        lv : number;
        skillid : any;
        damage : number;
        icon : number;
        exp : number;
    }
    
    export class IJustice_skill {
        index : number;
        id : number;
        level : number;
        icon : number;
        effect_code : number;
        des : string;
        name : string;
    }
    
    export class IJustice_slot {
        lv : number;
        exp : number;
        damage : number;
    }
    
    export class ILittle_game {
        id : number;
        map_id : string;
        point : number;
        line : string;
        skin : any[];
        blood : number;
        type : number;
        end : any;
    }
    
    export class ILittle_game_channel {
        id : number;
        value : boolean;
    }
    
    export class ILittle_game_global {
        key : string;
        value : any[];
    }
    
    export class ILuckydraw {
        id : number;
        type : number;
        act_type : number;
        activity : string;
        name : string;
        hero : any;
        order : number;
        title : string;
        paper : any;
        system : number;
        hero_type : number;
        num : number;
        pools : any;
        guaranteed : number;
        item_id : number;
        credit : number;
        preitem_id : string;
        item_num : number;
        cost : any;
        des : string;
        des2 : string;
        des3 : any;
        des4 : string;
    }
    
    export class ILuckydraw_optional {
        index : number;
        optional : number;
        reward : number[];
        weight : number;
    }
    
    export class ILuckydraw_pool {
        id : number;
        name : string;
        guarantee_1 : any;
        guarantee_2 : any;
        drop_1 : any;
        weight_1 : any;
        drop_2 : any;
        weight_2 : any;
        drop_3 : any;
        weight_3 : any;
        drop_4 : any;
        weight_4 : any;
        up_id : any;
        drop_5 : any;
        weight_set : any;
        weight_recovery : any;
    }
    
    export class ILuckydraw_summon {
        index : number;
        activityid : number;
        reward_type : number;
        number : number;
        award : any;
        weight : number;
        tv_id : number;
        reward_show : any[][];
        optional : any;
    }
    
    export class ILuckydraw_summon_tips {
        index : number;
        activityid : number;
        reward_type : number;
        item_icon : number;
        item : string;
        weight : string;
        tv : any;
    }
    
    export class ILuckydraw_turntable {
        type : number;
        name : string;
        cost : number[];
        cost2 : number[];
        reset : number[];
        reset_time : number[];
        auto_reset : number[];
        point : number[];
        times : number;
    }
    
    export class ILuckydraw_turntable2 {
        id : number;
        type : number;
        position : number;
        weight : number;
        drop_id : number;
        tab : number;
        show : number;
    }
    
    export class ILuckydraw_turntable_tips {
        index : number;
        type : number;
        item_icon : number;
        item : string;
        weight : string;
    }
    
    export class IMail_tpl {
        id : number;
        attachs : any[][];
    }
    
    export class IMainInterface_main {
        id : number;
        name : string;
        sorting : any;
        hidden : any;
        resident : any;
        isCustom : any;
        integration : any;
        systemid : any;
        entrance : any[];
        entrance_type : any;
        icon : string;
        resources : string;
    }
    
    export class IMainInterface_sort {
        id : number;
        name : string;
        resource : string[];
        systemid : number;
        sorting : number;
        whether : any;
    }
    
    export class IMainInterface_sort_1 {
        id : number;
        name : string;
        resource : string;
        systemid : number;
        dec : string;
        sorting : number;
        hidden : string;
    }
    
    export class IMainInterface_sort_2 {
        id : number;
        name : string;
        resource : string[];
        systemid : number;
        sorting : number;
    }
    
    export class IMainInterface_timeplay {
        id : number;
        name : string;
        activity_id : number;
        sorting : number;
        before_open : string;
        show : string;
        system : any;
    }
    
    export class IMainInterface_welfare {
        id : number;
        name : string;
        sorting : number;
    }
    
    export class IMap_adventure {
        id : number;
        tw : number;
        th : number;
        points : number[][];
        point1 : any[][];
        point2 : any[][];
        point3 : any[][];
        event : number[][];
    }
    
    export class IMap_cave {
        id : number;
        tw : number;
        th : number;
        points : number[][];
    }
    
    export class IMap_expedition {
        id : number;
        event1 : any;
        event2 : any;
        event3 : any;
        event4 : any;
        event5 : any;
        tw : number;
        th : number;
        points : number[][];
    }
    
    export class IMap_footHold {
        id : number;
        tw : number;
        th : number;
        points : number[][];
        cities : any;
        bonus16 : any;
        bonus15 : any;
        bonus14 : any;
        bonus13 : any;
        bonus12 : any;
        bonus11 : any;
        bonus10 : any;
        bonus9 : any;
        bonus8 : any;
        bonus7 : any;
        bonus6 : any;
        bonus5 : any;
        bonus4 : any;
        bonus3 : any;
        bonus2 : any;
        bonus1 : any;
    }
    
    export class IMap_relic {
        id : number;
        tw : number;
        th : number;
        cities : number[][];
        points : number[][];
        number : number[][];
    }
    
    export class IMask_word {
        word : any;
    }
    
    export class IMastery {
        id : number;
        masteryid : number;
        hero_id : number;
        name : string;
        lv : any;
        ownid : any;
        masterylv : any;
        masterylv2 : any;
        reward : number[];
        icon : string;
    }
    
    export class IMastery_explore {
        id : number;
        lv : number;
        fight : number;
        item_1 : number;
        item_2 : any;
        item_3 : any;
        item_4 : any;
        get1 : number;
        award1 : number[];
        get2 : number;
        award2 : number[];
        get3 : number;
        award3 : number[];
        get4 : number;
        award4 : number[];
        get5 : number;
        award5 : number[];
    }
    
    export class IMastery_lv {
        id : number;
        masteryid : number;
        lv : number;
        mastery_desc : string;
        atk_g : number;
        hp_g : number;
        def_g : number;
        hit_g : number;
        dodge_g : number;
        crit_g : number;
        hurt_g : number;
        atk_r : number;
        hp_r : number;
        def_r : number;
        hit_r : number;
        dodge_r : number;
        crit_r : number;
        hurt_r : number;
        crit_v : number;
        crit_v_res : number;
        add_soldier_atk : number;
        add_soldier_def : number;
        add_soldier_hp : number;
        add_soldier_crit_v : number;
        add_soldier_crit_v_res : number;
        skillid : string;
        item_1 : number;
        count_1 : number;
        item_2 : number;
        count_2 : number;
        item_3 : number;
        count_3 : number;
        item_4 : number;
        count_4 : number;
        item_5 : number;
        count_5 : number;
    }
    
    export class IMastery_recommend {
        id : number;
        group : number[];
        ratio_add : number;
    }
    
    export class IMd5_msg {
        id : number;
        name : string;
    }
    
    export class IMission_7activity {
        id : number;
        index : number;
        day : number;
        type : number;
        desc : string;
        target : number;
        args : any;
        number : number;
        reward1 : number[][];
        forward : any;
    }
    
    export class IMission_7score {
        id : number;
        score : number;
        reward : number[];
    }
    
    export class IMission_7show {
        id : number;
        day : number;
        type : number[];
        reward1 : number[][];
        reward2 : number[][];
    }
    
    export class IMission_achievement {
        id : number;
        group : number;
        index : number;
        title : string;
        desc : string;
        prev : any;
        subject : any;
        target : any;
        args : any;
        args2 : any;
        number : any;
        rewards : any[][];
        fbId : any;
        level : any;
    }
    
    export class IMission_cards {
        index : number;
        sorting : number;
        desc : string;
        target : number;
        args : any;
        number : number;
        forward : number;
        level : number;
        fbId : number;
        addFlips : number[][];
    }
    
    export class IMission_daily {
        id : number;
        title : string;
        desc : string;
        target : number;
        args : any;
        number : number;
        forward : number;
        level : any;
        fbId : any;
        active : number;
        icon : number;
        reward1 : string;
        reward2 : string;
        reward3 : string;
        unlock : string;
    }
    
    export class IMission_daily_active {
        id : number;
        index : number;
        order : number;
        value : number;
        reward : number[][];
        reward_icon : string;
    }
    
    export class IMission_daily_ritual {
        id : number;
        index : number;
        desc : string;
        forward : number;
        level : any;
        fbId : any;
        unlock : string;
    }
    
    export class IMission_grow {
        id : number;
        desc : string;
        chapter : number;
        target : number;
        args : any;
        number : number;
        reward1 : number[];
        reward2 : string;
        reward3 : string;
        forward : number;
    }
    
    export class IMission_grow_chapter {
        id : number;
        big_chapter : number;
        title1 : string;
        title2 : string;
        title3 : string;
        reward : number[];
    }
    
    export class IMission_guild {
        id : number;
        sorting : number;
        period : number;
        desc : string;
        target : number;
        args : any;
        number : number;
        rewards : number[][];
        hidden : any;
        forward : any;
    }
    
    export class IMission_main_line {
        id : number;
        title : string;
        desc : string;
        prev : any;
        subject : number;
        target : number;
        args : string;
        number : number;
        reward1 : number[];
        reward2 : any;
        reward3 : any;
        reward4 : any;
        logo : number;
        fbId : number;
        show : any;
        show_hero : any;
        show_reward : any;
        show_desc : string;
        resources : string;
    }
    
    export class IMission_online {
        id : number;
        days : number;
        time : number;
        reward : number[];
    }
    
    export class IMission_weekly {
        id : number;
        title : string;
        desc : string;
        target : number;
        args : any;
        number : number;
        forward : number;
        level : any;
        fbId : any;
        active : number;
        icon : number;
        reward1 : string;
        reward2 : string;
        reward3 : string;
        unlock : string;
    }
    
    export class IMission_weekly_active {
        id : number;
        value : number;
        reward : number[][];
        reward_icon : string;
    }
    
    export class IMission_welfare {
        id : number;
        index : number;
        desc : string;
        name : string;
        target : number;
        args : number;
        reward : number[][];
        time : string;
    }
    
    export class IMission_welfare2 {
        id : number;
        index : number;
        desc : string;
        name : string;
        target : number;
        days : number;
        reward : number[][];
    }
    
    export class IMoney {
        id : number;
        name : string;
        icon : number;
    }
    
    export class IMonster {
        id : number;
        name : string;
        icon : any;
        color : any;
        type : any;
        star : any;
        skin : string;
        size : number;
        sex : number;
        money : any;
        atk : any;
        hp : number;
        def : number;
        hit : any;
        dodge : any;
        speed : number;
        hurt : number;
        dmg_res : number;
        skills : any[];
        drop : any;
        feature1 : any;
        hate_num : any;
        energy : any;
        range : any;
        desc : string;
        cold_res_fix : string;
        elec_res_fix : string;
        fire_res_fix : string;
        punc_res_fix : any;
        radi_res_fix : any;
        atk_res_fix : any;
        dmg_cold_fix : string;
        dmg_elec_fix : string;
        dmg_fire_fix : string;
        dmg_punc_fix : string;
        dmg_radi_fix : string;
        atk_dmg_fix : string;
        present : string;
        radius : string;
        monster_drop : any;
        feature : string;
    }
    
    export class IMonster2 {
        id : number;
        name : string;
        type : number;
        show_type : number;
        skin : string;
        icon : number;
        color : any;
        star : number;
        level : number;
        size : number;
        group : any;
        sex : number;
        atk : number;
        hp : number;
        def : number;
        hit : number;
        dodge : number;
        crit : number;
        hurt : number;
        atk_speed : number;
        atk_order : number;
        skills : number[];
        talent_skill_lv : any;
        rank : any;
        hero_lv : any;
        career_lv : any;
        super_skill : number;
        cold_res_fix : string;
        elec_res_fix : string;
        fire_res_fix : string;
        punc_res_fix : string;
        radi_res_fix : string;
        atk_res_fix : string;
        dmg_cold_fix : string;
        dmg_elec_fix : string;
        dmg_fire_fix : string;
        dmg_punc_fix : string;
        dmg_radi_fix : string;
        atk_dmg_fix : string;
    }
    
    export class IMonster_simple {
        id : number;
        hp : number;
        monster_drop : any;
        include : number;
    }
    
    export class INewordeal_ordeal {
        id : number;
        copy_id : number;
        activity_id : number;
        type : number;
        quality : number;
        difficulty : string;
        theme_hero : string;
        recommended_career : string;
        strategy : string;
        interface : number;
        name : string;
        fighting_type : string;
        round : number;
        first_rewards : any[][];
        activity_rewards : number[][];
        monster : number;
        skill : number[];
        effects : string;
        advertising : string;
        background : string;
    }
    
    export class INewordeal_ranking {
        id : number;
        activity_id : number;
        type : number;
        rank : number[];
        rank_rewards : number[][];
        server : number;
    }
    
    export class IOperation_best {
        id : number;
        reward_type : number;
        turn : number;
        award : number[];
        name : string;
        limit : number;
    }
    
    export class IOperation_best_show {
        id : number;
        reward_type : number;
        turn : number;
        award : number[];
        name : string;
    }
    
    export class IOperation_card {
        index : number;
        reward_type : number;
        turn : number;
        pool : number;
    }
    
    export class IOperation_drop {
        id : number;
        drop : number;
        item : number[];
        weight : number;
    }
    
    export class IOperation_egg {
        id : number;
        drop_1 : number;
        weight_1 : number;
        drop_2 : number;
        weight_2 : number;
        guarantee2 : number;
        drop_3 : number;
        weight_3 : number;
        drop_4 : number;
        weight_4 : number;
        present : number[][];
        cost : number[];
        money : number[];
        reward_type : number;
    }
    
    export class IOperation_egg_tips {
        index : number;
        reward_type : number;
        stress : string;
        item : string;
        weight : string;
    }
    
    export class IOperation_global {
        index : number;
        item : number[][];
        cost : number[];
        cost_times : number;
        discount : number[];
        discount_times : number;
    }
    
    export class IOperation_pool {
        id : number;
        index : number;
        pool : number;
        number : number;
        award : any[];
        best : any;
        weight : number;
        time : number;
        tv_id : number;
    }
    
    export class IOperation_store {
        id : number;
        activityid : any;
        reward_type : number;
        page : number;
        name : string;
        item : number[][];
        RMB_cost : number;
        buy : number;
    }
    
    export class IOperation_treasure {
        index : number;
        reward_type : number;
        round : number;
        pool : number;
        reset_limit : number;
        amount : number;
    }
    
    export class IOperation_treasure_discount {
        index : number;
        reward_type : number;
        num : number[];
        discount : number;
        cost : number[];
    }
    
    export class IOperation_treasure_left {
        amount : number;
        tv_id : number;
    }
    
    export class IOperation_treasure_pool {
        index : number;
        pool : number;
        order : number;
        award : number[];
        amount : number;
        best : any;
        weight : number;
        weight2 : number;
        weight3 : number;
        weight4 : number;
        weight5 : number;
        weight6 : number;
        tv_id : number;
        show : number[];
        showname : any;
        tag : any;
    }
    
    export class IOperation_wish {
        id : number;
        wish : number;
        hero : number;
        guarantee : number;
        reward_type : number;
    }
    
    export class IOrdeal {
        id : number;
        copy_id : number;
        activity_id : number;
        type : number;
        quality : number;
        difficulty : string;
        theme_hero : string;
        recommended_career : string;
        strategy : string;
        interface : number;
        name : string;
        fighting_type : string;
        round : number;
        first_rewards : any[][];
        activity_rewards : number[][];
        monster : number;
        skill : number[];
        effects : string;
        advertising : string;
        background : string;
    }
    
    export class IOrdeal_challenge {
        index : number;
        copy_id : number;
        activity_id : number;
        type : number;
        challenge_times : number;
        challenge_rewards : number[][];
    }
    
    export class IOrdeal_ranking {
        id : number;
        activity_id : number;
        type : number;
        rank : number;
        rank_rewards : number[][];
        damage : number;
        limit : number;
        server : number;
    }
    
    export class IPass {
        id : number;
        taskid : number;
        cycle : number;
        desc : string;
        score : number;
        reward1 : number[][];
        reward2 : number[][];
        resident : any;
    }
    
    export class IPass_daily_rewards {
        id : number;
        group : number;
        cycle : number;
        day : number;
        rewards : number[][];
    }
    
    export class IPass_fund {
        id : number;
        name : string;
        reward : number[];
        daily_rewards : number;
        limit : number;
    }
    
    export class IPass_month_rewards {
        id : number;
        month : number;
        args : number;
        reward : number[][];
    }
    
    export class IPass_weekly {
        id : number;
        cycle : number;
        day : number;
        reward1 : number[][];
        reward2 : number[][];
        resident : any;
    }
    
    export class IPeak_challenge {
        id : number;
        reward_type : number;
        times : number;
        rewards : number[][];
        hero : any;
        item_icon : any;
    }
    
    export class IPeak_conversion {
        index : number;
        id : number;
        item_id : number;
        career_id : number;
        weight : number;
        camp : number[];
        best : number;
    }
    
    export class IPeak_division {
        division : number;
        name : string;
        point : number;
        icon : string;
        limit : number;
        score : number;
        lose_score : number;
        match1 : number[];
        match2 : any;
        match3 : any;
        weight1 : number;
        weight2 : any;
        weight3 : any;
    }
    
    export class IPeak_global {
        key : string;
        value : number[];
    }
    
    export class IPeak_grade {
        id : number;
        reward_type : number;
        grade : number;
        rewards : any;
        hero : any;
        item_icon : any;
        desc : string;
        desc1 : string;
    }
    
    export class IPeak_main {
        reward_type : number;
        challenge_cost : number[];
        challenge_times : number[][];
        conversion_cost : number[];
        conversion_times : number[][];
    }
    
    export class IPeak_pool {
        hero_reward_id : number;
        reward_type : number;
        optional : number;
        pool : number[][];
        default : any;
        note : string;
    }
    
    export class IPeak_pool_group {
        index : number;
        group_id : number;
        item_id : number;
        career_id : number;
        weight : number;
    }
    
    export class IPeak_ranking {
        id : number;
        type : number;
        requirements : number;
        rank : number[];
        rank_rewards : number[][];
        server : number;
    }
    
    export class IPeak_robot {
        id : number;
        hero_id : number;
        career_id : number;
    }
    
    export class IPieces_coefficient {
        type : number;
        coefficient : number;
    }
    
    export class IPieces_disc {
        level : number;
        exp : any;
        weight : number[][];
    }
    
    export class IPieces_division {
        id : number;
        division : number;
        type : number;
        name : string;
        point : number;
        icon : string;
        rewards : any;
        talent : any;
    }
    
    export class IPieces_fetter {
        id : number;
        name : string;
        fetter_type : number;
        level : number;
        effect : string;
        skill_id : number;
        required : number;
        hero_id : number[];
        icon : number;
    }
    
    export class IPieces_global {
        key : string;
        value : number[];
    }
    
    export class IPieces_hero {
        id : number;
        hero_id : number;
        line : number;
        soldier_id : number;
        hero_name : string;
        star_min : number;
        atk_w : number;
        hp_w : number;
        def_w : number;
        hit_w : number;
        dodge_w : number;
        atk_speed : number;
        silver : number[];
        color : number;
        fetter : number[];
        group : number[];
        number : any;
        weight : any;
    }
    
    export class IPieces_initial {
        id : number;
        team : number;
        place_1 : number;
        place_2 : number;
        place_3 : number;
        place_4 : number;
        place_5 : number;
        place_6 : number;
        power_type : number;
        stage_id : number;
        role_place_1 : number;
        role_place_2 : number;
        role_place_3 : number;
        role_place_4 : number;
        role_place_5 : number;
        role_place_6 : number;
        weight : number;
    }
    
    export class IPieces_interest {
        id : number;
        silver : number[];
        interest : number;
    }
    
    export class IPieces_number {
        id : number;
        consumption : number[];
    }
    
    export class IPieces_pool {
        id : number;
        round : number;
        team : number;
        power_type : number;
        color_star1 : number[];
        color_star2 : number[];
        color_star3 : number[];
        color_star4 : number[];
        color_star5 : number[];
        color_star6 : number[];
        pool1 : number[];
        pool2 : number[];
        pool3 : number[];
        pool4 : number[];
        pool5 : number[];
        pool6 : number[];
    }
    
    export class IPieces_power1 {
        id : number;
        round : number;
        type : number;
        general : number;
    }
    
    export class IPieces_power2 {
        id : number;
        round : number;
        type : number;
        endless : number;
        monster_power : number;
        hero_power : number;
    }
    
    export class IPieces_ranking {
        id : number;
        type : number;
        rank : number[];
        rank_rewards : number[][];
        server : number;
    }
    
    export class IPieces_refresh {
        round : number;
        weight : number[][];
        point : number;
        silver : number;
        time : number;
        exp : number;
    }
    
    export class IPieces_silver {
        id : number;
        color : number;
        star : number;
        silver : number;
    }
    
    export class IPieces_star {
        star : number;
        career_lv : number;
        coefficient : number;
        number : any;
        gift_lv : number;
    }
    
    export class IPieces_talent {
        id : number;
        name : string;
        unlock : any;
        after : any[];
        place : number[];
        icon : number;
        consumption : number;
        type1 : any[];
        type2 : any;
        type3 : any;
        type4 : any;
        type5 : any;
        type6 : any;
        type7 : any;
        type8 : any;
        type9 : any;
        type10 : any;
        type11 : any;
        type12 : any;
        type13 : any;
        desc : string;
    }
    
    export class IPlatform_activity {
        id : number;
        platform_id : number;
        channel_id : any[];
        type : number;
        args : number;
        reward : any[][];
        mail_id : any;
    }
    
    export class IPlatform_global {
        key : string;
        value : number[];
    }
    
    export class IPve_born {
        id : number;
        wave : number;
        time : any;
        interval : any;
        spawn : number[];
        enemy_id : number;
        num : number;
        wait : any;
        wait_delay : any;
        born_animation : string;
    }
    
    export class IPve_bossborn {
        id : number;
        wave : number;
        interval : number;
        bosslist : number[];
        wait : number;
        wait_delay : string;
        born_animation : string;
    }
    
    export class IPve_demo {
        id : number;
        name : string;
        bg : string;
        music : string;
        road : string;
        monster_born_cfg : string[];
        endless : boolean;
        energy_start : number;
        energy_time : number;
        energy_limit : number;
    }
    
    export class IPve_demo2 {
        id : number;
        hero_id : number;
        size : number;
        hero_skills : number[];
        towers_initial : number;
        towers_group : number[][];
    }
    
    export class IPve_main {
        id : number;
        name : string;
        bg : string;
        music : string;
        road : string;
        parse_monster_born : any;
        monster_born_cfg : any[];
        endless : any;
        can_speedup : number;
        energy_start : number;
        energy_time : number;
        energy_limit : number;
        waitTime : any;
    }
    
    export class IPve_protege {
        id : number;
        name : string;
        skin : string;
        hp : number;
    }
    
    export class IPve_spawn {
        id : number;
        name : string;
        skin : string;
        floor : any;
    }
    
    export class IPvp {
        id : number;
        born_id : number;
        level : number;
        name : string;
        scene : string;
        bg : string;
        music : string;
        can_speedup : number;
        skill_big : string;
        robot_power : number;
        robot_lv : number;
        robot_settle : number;
        skill_1 : string;
        skill_2 : string;
        skill_3 : string;
        place_1 : number[];
        place_2 : number[];
        place_3 : number[];
        place_4 : number[];
        place_5 : number[];
        place_6 : [];
    }
    
    export class IQuickcombat {
        index : number;
        consumption : number[];
    }
    
    export class IQuickcombat_global {
        key : string;
        value : number[];
    }
    
    export class IRelic_global {
        key : string;
        value : number[];
    }
    
    export class IRelic_main {
        id : number;
        point : number;
        def_add : number;
        repair_cost : number[];
        atk_cd : number;
        atk_cost : number[];
        atk_limit : number;
        def_mail : number;
        def_drop : number[][];
        rob_mail : number;
        cache_time : number;
    }
    
    export class IRelic_map {
        id : number;
        pk : number;
        lv : number;
        mapType : number;
        map_name : string;
        width : number;
    }
    
    export class IRelic_number {
        id : number;
        num : number[];
    }
    
    export class IRelic_open {
        id : number;
        map_id : number;
        open_time : number[];
        close_time : number[];
        opengroups : string;
    }
    
    export class IRelic_pass {
        id : number;
        taskid : number;
        cycle : number;
        desc : string;
        point : number[];
        reward1 : number[][];
        reward2 : number[][];
        resident : any;
    }
    
    export class IRelic_point {
        id : number;
        map_id : number;
        title : string;
        des : string;
        sorting : number;
        fight : number;
        fight_limit : number;
        time : number;
        consumption : number;
        owner_hp : number;
        helper_num : number;
        helper_hp : number;
        drop : number[];
        color : number;
        skin : string;
        drop_show : number[][];
        score : number;
        map_monster : number[][];
    }
    
    export class IRelic_ranking {
        id : number;
        rank : number[];
        rank_rewards : number[][];
        server : number;
    }
    
    export class IRelic_task {
        id : number;
        type : number;
        desc : string;
        target : number;
        args : string;
        number : number;
        point : number[];
    }
    
    export class IRoyal_challenge {
        id : number;
        consumption : number[];
    }
    
    export class IRoyal_division {
        division : number;
        name : string;
        point : number;
        icon : string;
        limit : number;
        score : number;
        lose_score : number;
        match1 : number[];
        match2 : any;
        match3 : any;
        weight1 : number;
        weight2 : any;
        weight3 : any;
        stage_id : any[];
        rewards : number[][];
        item_id : number;
    }
    
    export class IRoyal_global {
        key : string;
        value : number[];
    }
    
    export class IRoyal_group {
        id : number;
        group : number;
        buff_id : number;
        icon : string;
        title : string;
        describe : string;
        color : number;
        weight : number;
    }
    
    export class IRoyal_ranking {
        id : number;
        type : number;
        requirements : number;
        rank : number[];
        rank_rewards : number[][];
        server : number;
    }
    
    export class IRoyal_robot {
        id : number;
        robot : number;
        round : number;
        scene_id : number;
        hero_id : number[];
    }
    
    export class IRoyal_scene {
        id : number;
        scene_name : string;
        thumbnail : string;
        background : string;
        picture : string;
        prompt : string;
        stage_id : number;
        group : number;
        victory_des : string;
        victory : number[][];
        describe : string;
        robot : number[][];
        recommended : number[];
    }
    
    export class IRune {
        rune_id : number;
        id : number;
        name : string;
        color : number;
        type : number;
        mix_type : any;
        level : number;
        hero_atk : number;
        hero_hp : number;
        hero_def : number;
        hero_hit : number;
        hero_dodge : number;
        icon : number;
        power : number;
        disint_item : number[][];
        consumption_main : any;
        consumption_material : any;
        common_material : any;
        mix_material : any;
        consumption : any;
        strengthening : any[][];
        isShow : any;
        Show : any;
        recommended : number[];
        skill : number;
        skill_level : number;
        skill_type : number;
        des : string;
        note : string;
        mix_skill : any;
        mix_skill_level : any;
        mix_skill_type : any;
        mix_des : string;
        store_id : [];
        effects : any;
        new_get : any[][];
        unlock : number;
        unlock_name : string;
    }
    
    export class IRune2 {
        rune_id : number;
        name : string;
        main_rune : number;
        sub_rune : any;
        strength_type : number;
        icon : number;
        recommended : number[];
        skill : number[];
        old_id : number;
    }
    
    export class IRune2_bless {
        index : number;
        refine_lv : number[];
        bless_total : number;
        bless1 : number[];
        bless2 : number[];
        bless3 : number[];
        bless4 : number[];
        weight1 : number;
        weight2 : number;
        weight3 : number;
        weight4 : number;
        bless_result : number;
    }
    
    export class IRune2_compose {
        consumption_main : number;
        consumption_material : number[];
        consumption : number[][];
        result : number;
    }
    
    export class IRune2_mix {
        consumption_main : number;
        consumption_material : number[];
        consumption : number[][];
        result : number;
    }
    
    export class IRune2_refine {
        id : number;
        clear_lv : number;
        type : number;
        add : number;
        result_lv1 : any;
        result_lv2 : any;
        result_lv3 : any;
        weight1 : any;
        weight2 : any;
        weight3 : any;
        bless : any;
        item_cost : any[][];
    }
    
    export class IRune2_strength {
        streng_level : number;
        color : number;
        whether_mix : number;
        color_des : string;
        tpye1_hero_atk : number;
        tpye1_hero_hp : number;
        tpye1_hero_def : number;
        tpye2_hero_atk : number;
        tpye2_hero_hp : number;
        tpye2_hero_def : number;
        tpye3_hero_atk : number;
        tpye3_hero_hp : number;
        tpye3_hero_def : number;
        disint_item : number[];
        strengthening : any[];
        skill_level : number;
    }
    
    export class IRune_bless {
        index : number;
        clear_lv : number[];
        bless_total : number;
        bless1 : number[];
        bless2 : number[];
        bless3 : number[];
        bless4 : number[];
        weight1 : number;
        weight2 : number;
        weight3 : number;
        weight4 : number;
        bless_result : number;
    }
    
    export class IRune_clear {
        id : number;
        clear_lv : number;
        type : number;
        add : number;
        result_lv1 : any;
        result_lv2 : any;
        result_lv3 : any;
        weight1 : any;
        weight2 : any;
        weight3 : any;
        bless : any;
        item_cost : any[][];
    }
    
    export class IRune_return {
        rune_id : number;
        return : number[][];
    }
    
    export class IRune_show {
        id : number;
        genre : number;
        name : string;
        page1 : number;
        page2 : number;
        page3 : number;
        page4 : number;
        page5 : number;
    }
    
    export class IRune_unlock {
        id : number;
        level : number;
        star : number;
    }
    
    export class IRuneunlock {
        id : number;
        rune_id : number;
        rune_name : string;
        star : number;
        difficulty : string;
    }
    
    export class ISailing_freereward {
        index : number;
        type : number;
        rewards : number[][];
    }
    
    export class ISailing_global {
        key : string;
        value : number[];
    }
    
    export class ISailing_map {
        id : number;
        type : number;
        map_id : number;
        plate : number;
        reward : number[][];
        consumption : number;
        icon : any;
        effects : string;
        show : any[][];
    }
    
    export class ISailing_topup {
        index : number;
        type : number;
        money : number;
        rewards : number[][];
    }
    
    export class IScore {
        id : number;
        node : number;
        name : string;
        exp : number[];
        rewards : number[][];
        resources : string;
        tv : any;
    }
    
    export class IScore_guide {
        index : number;
        type : number;
        guide1 : string;
        guide2 : string;
        guide3 : string;
        guide4 : string;
    }
    
    export class IScore_mission {
        index : number;
        id : number;
        node : number;
        type : number;
        prev : any;
        icon : string;
        difficulty : number;
        name : string;
        target : number;
        args : any;
        number : number;
        level : number;
        fbId : number;
        unlock : string;
        unlock_name : string;
        unlock_desc : string;
        forward : number;
        rewards : number[][];
        priority : number;
        content : string;
        gain : any[][];
        guide : string;
        gain_item : number;
    }
    
    export class IScore_problem {
        id : number;
        title : string;
        desc : string;
    }
    
    export class IScore_recommended {
        id : number;
        type : number;
        title : string;
        heroid : number;
        star : number;
        color : number;
        gain : string;
        forward : number;
        kernel : string;
        analyze : string;
    }
    
    export class IScore_recourse {
        id : number;
        theme : string;
        group : number;
        icon : any;
        title : any;
        whether_theme : any;
        name : string;
        desc : string;
        forward : any;
        fbId : string;
        level : any;
        unlock_desc : string;
    }
    
    export class ISecretarea {
        index : number;
        activity : number;
        reward_type : number;
        id : number;
        items1 : string;
        drops1 : number[];
        items2 : string;
        drops2 : number[];
    }
    
    export class ISecretarea_festival {
        index : number;
        activity : number;
        reward_type : number;
        id : number;
        items1 : string;
        drops1 : number[];
        items2 : string;
        drops2 : number[];
    }
    
    export class ISecretarea_global {
        key : string;
        value : number[];
    }
    
    export class ISecretarea_global1 {
        key : string;
        value : number[];
    }
    
    export class ISecretarea_store {
        id : number;
        activity : number;
        reward_type : number;
        sorting : number;
        goods : number[];
        item_name : string;
        times_limit : number;
        money_cost : number[];
        discount : any;
        main_hero : number;
        rewards : number[][];
    }
    
    export class ISecretarea_store1 {
        id : number;
        activity : number;
        reward_type : number;
        sorting : number;
        goods : number[];
        item_name : string;
        times_limit : number;
        money_cost : number[];
        discount : any;
        rewards : number[][];
    }
    
    export class ISiege {
        cycle : number;
        icon : string;
        camp_icon : string;
        camp_type : number[];
        bonus : number[];
        open : number;
        monster : string;
        name : string;
        rewards_show : number[];
        bonus_des : string;
    }
    
    export class ISiege_appearance {
        id : number;
        interval : number[];
        days1 : any[][];
        days2 : any[][];
        days3 : any[][];
        days4 : any[][];
        days5 : any[][];
        days6 : any[][];
        days7 : any[][];
    }
    
    export class ISiege_checkpoint {
        id : number;
        world_level : number;
        days : number;
        stage_id : number;
        rounds : number[][];
    }
    
    export class ISiege_global {
        key : string;
        value : number[];
    }
    
    export class ISiege_ranking {
        id : number;
        world_level : number;
        rank : number[];
        rank_rewards : number[][];
        server : number;
    }
    
    export class ISiege_store {
        id : number;
        sorting : number;
        goods : string;
        drop_id : any;
        daydrop_id : any;
        item_name : string;
        times_limit : number;
        money_cost : number[];
        unlock_ : any;
        discount : string;
    }
    
    export class ISiege_world_level {
        index : number;
        average_level : number[];
    }
    
    export class ISign {
        id : number;
        turn : number;
        item_id : number;
        number : number;
    }
    
    export class ISkill {
        id : number;
        skill_id : number;
        icon : any;
        name : any;
        type : any;
        show_name : any;
        dmg_type : any;
        level : any;
        range : any;
        exskill_id : any;
        hurt_expr : string;
        dmg_code : any;
        weight : any;
        priority : any;
        halo_id : any;
        halo_time : any;
        buff_id : any;
        buff_num : any;
        buff_range : any;
        buff_target_type : any;
        buff_time : any;
        dmg_range : any;
        target_type : any;
        target_num : any;
        cd_type : any;
        relatedSkill : any;
        pre_cd : any;
        cd : any;
        energy : any;
        call_id : any;
        call_num : any;
        call_time : any;
        dmg_law : string;
        dmg_mul : any;
        power : any;
        move_animation : string;
        move_delay : any;
        speed : any;
        animation : string;
        effect_type : any;
        hit_animation : any;
        speed_scale : string;
        size_correction : any;
        effect_res : string;
        super_effect_res : any;
        atk_sound : string;
        hit_sound : string;
        dmg_sound : string;
        time_show : any;
        time : any;
        pre_animation : any;
        show : any;
        des : string;
        des2 : string;
    }
    
    export class ISkill_buff {
        id : number;
        name : string;
        type : any;
        effect_type : any;
        rm_type : any;
        dmg_type : any;
        eject : any;
        effect_expr : string;
        effect_code : any;
        stacking_expr : string;
        stacking_fold : any;
        times : any;
        interval : any;
        from_icon_s : any;
        from_icon_e : any;
        buff_word : string;
        icon : string;
        skin : string;
        skin_pos : any;
        skin_lv : any;
        stacking_class : any;
        des : string;
    }
    
    export class ISkill_call {
        id : number;
        call_id : number;
        caller_lv : any;
        monster : any;
        ai : any;
        args : any;
    }
    
    export class ISkill_effect_type {
        id : number;
        index : number;
        has_atk_animation : boolean;
        track_type : number;
        from_pos_type : number;
        to_pos_type : number;
        to_pos_range : number;
        multiple_effect : boolean;
        sync_rotation : boolean;
        hit_rotation : boolean;
        to_follow_pos : boolean;
        search_after_dmg : boolean;
        store_pos : boolean;
        ignore_type : number;
        motion_streak_args : any;
        motion_bezier_args : any;
    }
    
    export class ISkill_gate {
        id : number;
        name : string;
        skin : string;
        range : number;
        range_type : number;
        target_type : number;
        target_num : number;
    }
    
    export class ISkill_halo {
        id : number;
        name : string;
        type : any;
        num : any;
        range : any;
        target_type : any;
        buff_id : any;
        buff_time : any;
        skin : string;
        skin_pos : any;
    }
    
    export class ISkill_target_type {
        id : number;
        target : number;
        general : number;
        hero : number;
        group : number;
        soldier : number;
        call : number;
        monster : number;
        priority_type : number;
        priority_type2 : number;
    }
    
    export class ISkill_trap {
        id : number;
        name : string;
        skin : string;
        type : any;
        hit_animation : any;
        stand_animation : string;
        complete_animation : string;
        dmg_sound : string;
        size : number;
        size2 : number;
        cd : number;
        range : any;
        range_type : number;
        target_type : number;
        target_num : number;
        buff_id : any[];
        enemy_id : any;
        times : any;
        buff_time : any;
        trap_floor : any;
    }
    
    export class ISoldier {
        id : number;
        type : number;
        name : string;
        range_score : string;
        class : number;
        color : number;
        skin : string;
        icon : number;
        desc : string;
        skills : any;
        atk_speed_w : number;
        speed : number;
        range : number;
        atk_w : number;
        hp_w : number;
        def_w : number;
        hit_w : number;
        dodge_w : number;
        crit_w : number;
        grow_atk : number;
        grow_hp : number;
        grow_def : number;
        grow_hit : number;
        grow_dodge : number;
        grow_crit : number;
        use_hero : number[];
        cd : number;
        size : number;
        revive : number;
        heal : number;
        hate_num : number;
    }
    
    export class ISoldier_army_skin {
        skin_id : number;
        consumption : number[];
        type : number;
        name : string;
        skin : string;
        icon : number;
        atk_p : number;
        hp_p : number;
        def_p : number;
        skills : number;
    }
    
    export class ISoldier_army_trammel {
        trammel_id : number;
        trammel_name : string;
        trammel_skin : number;
        trammel_model : string[];
        trammel_pos : string[];
        skin_id : number[];
        atk1_p : number;
        hp1_p : number;
        def1_p : number;
        atk2_p : number;
        hp2_p : number;
        def2_p : number;
        atk3_p : number;
        hp3_p : number;
        def3_p : number;
    }
    
    export class ISoldier_skin_resolve {
        resolve_lv : number;
        skin_consumption : number;
        atk_all : number;
        hp_all : number;
        def_all : number;
    }
    
    export class ISthwar_choose {
        id : number;
        hard_choose : number;
        map_random : number[];
        monster_lv : number[];
        Occupation : number;
        point_number : number;
        rewards : number[][];
    }
    
    export class ISthwar_group_reward {
        id : number;
        hard : number;
        Occupation : number;
        rewards : number[][];
        mail : number;
    }
    
    export class ISthwar_personal_reward {
        id : number;
        hard : number;
        point_type : number;
        rewards : number[][];
        score : number;
    }
    
    export class ISthwar_point {
        id : number;
        map_id : number;
        point_type : number;
        monster_lv : number;
        round : number[];
    }
    
    export class IStore {
        id : number;
        type : number;
        sorting : number;
        item_id : any;
        drop_id : any;
        item_name : string;
        item_number : number;
        times_limit : any;
        refresh : any;
        initiative : any;
        money_cost : number[];
        fbId : string;
        weight : any;
        discount : any;
        subtypes : any;
        level : any;
        stageid : any;
        will_buy : any;
        VIP_limit : any;
        activity_id : any;
        daydrop_id : any;
        unlock_ : any;
        forces : any;
        foothold : any;
        bargain : any;
        buildlv_limit : any;
        unlock_ultimate : any;
    }
    
    export class IStore_7day {
        id : number;
        item : number[];
        money_cost : number[];
        times_limit : number;
        level : number;
        fbId : number;
        day : number;
        discount : number;
        VIP_commit : any;
    }
    
    export class IStore_awake {
        gift_id : number;
        hero : number;
        open_conds : number;
        awake_lv : number;
        tag_name : string;
        buy_limit : number;
        duration : number;
        rmb : number;
        value : number;
        items : number[][];
        new : number;
        name : string;
    }
    
    export class IStore_awake_gift {
        id : number;
        hero_id : number;
        star_total : number;
        gift_name : string;
        free_rewards : number[][];
        RMB_cost : number;
        RMB_day : number;
        RMB_rewards1 : number[][];
        RMB_rewards2 : number[][];
        RMB_rewards3 : number[][];
        RMB_rewards4 : any;
        RMB_rewards5 : any;
        RMB_rewards6 : any;
        RMB_rewards7 : any;
    }
    
    export class IStore_charge {
        id : number;
        name : string;
        icon : string;
        RMB_cost : number;
        get_gem : number;
        first_gem : number;
        second_gem : number;
    }
    
    export class IStore_first_pay {
        id : number;
        name : string;
        RMB_cost : number;
        model : number;
        first_pay_award_1 : number[];
        first_pay_award_2 : number[];
        first_pay_award_3 : number[];
        title : string;
        des : string;
        des_1 : string;
    }
    
    export class IStore_gift {
        gift_id : number;
        name : string;
        activity_id : any[];
        open_conds : any;
        show : number;
        icon : number;
        times_limit : number;
        refresh : number;
        RMB_cost : number;
        timerule : number;
        unlock : any;
        restricted : any;
        gift_level : any;
        tab : number;
        value : any;
        profit : any;
        cross_id : any;
    }
    
    export class IStore_giftreward {
        id : number;
        gift_id : number;
        name : string;
        activity_id : number;
        reward_type : number;
        show : number;
        icon : number;
        items : number[][];
        value : any;
        profit : any;
        desc : string;
        bargain : any;
    }
    
    export class IStore_misc {
        id : number;
        name : string;
        RMB_cost : number;
        day : any;
        buy : string;
        period : string;
    }
    
    export class IStore_monthcard {
        id : number;
        name : string;
        sorting : any;
        show : any;
        icon : string;
        RMB_cost : any;
        day : number;
        top_up : any;
        diamond_cost : any;
        activation_rewards : any;
        vip_1 : any[];
        vip_2 : any;
        vip_3 : any;
        desc : string;
        radio : any;
        mail_id : any;
    }
    
    export class IStore_oneprice {
        index : number;
        id : number;
        name : string;
        price : number;
        gift : number[];
    }
    
    export class IStore_push {
        gift_id : number;
        group : number;
        type : number;
        tag_name : string;
        activity_id : number;
        event_type : number;
        name : string;
        open_conds : number;
        buy_limit : number;
        duration : number;
        rmb : number;
        items : number[][];
        value : number;
        desc : string;
        themehero : any;
        icon : string;
        gift_icon : string;
        gift_name : string;
    }
    
    export class IStore_red_envelope {
        id : number;
        gift_id : number;
        vip : any;
        name : string;
        red_envelope : number;
        num : number;
        red_envelope2 : any;
    }
    
    export class IStore_rune {
        id : number;
        type : number;
        money_cost : number[];
        refresh : number;
        initiative : number[];
        item_number : number;
        times_limit : number;
        weight : number[][];
        discount : any;
    }
    
    export class IStore_sevenday_war_gift {
        id : number;
        gift_name : string;
        fbId : number;
        free_rewards : number[][];
        RMB_cost : number;
        RMB_rewards : number[][];
    }
    
    export class IStore_skin {
        id : number;
        skin_id : number;
        user_id : number[];
        skin_name : string;
        skin_number : number;
        times_limit : number;
        refresh : any;
        money_cost : number[];
    }
    
    export class IStore_star_gift {
        id : number;
        gift_name : string;
        star_total : number;
        free_rewards : number[][];
        RMB_cost : number;
        RMB_rewards : number[][];
    }
    
    export class IStore_time_gift {
        id : number;
        gift_name : string;
        gift_type : number;
        stage_id : any;
        copy_id : any;
        settle_type : any;
        activeCondition : any;
        duration : number;
        RMB_cost : number;
        value : number;
        RMB_rewards : number[][];
    }
    
    export class ISystem {
        id : number;
        openLv : number;
        fbId : any;
        heroStar : any;
        vip : any;
        activity : any;
        name : string;
        handle : string;
        title : string;
        icon : string;
        params : any;
        pos : any;
        isMainCity : any;
        show : any;
        platform : string;
    }
    
    export class ISystem_crosslist {
        id : number;
        system : number;
        sorting : number;
        rewards_show : number[];
        time_show : string;
    }
    
    export class ISystem_event {
        event_id : number;
        event_desc : string;
        must_send : boolean;
        red_point : number;
        has_action : boolean;
    }
    
    export class ITalent_alchemy {
        taskid : number;
        reward_type : number;
        desc : string;
        target : number;
        args : string;
        number : number;
        rewards : number[][];
        forward : number;
    }
    
    export class ITalent_arena {
        taskid : number;
        reward_type : number;
        desc : string;
        target : number;
        args : string;
        number : number;
        rewards : number[][];
        forward : number;
    }
    
    export class ITalent_extra_chance {
        id : number;
        activityid : number;
        key : string;
        value : number;
    }
    
    export class ITalent_quick_combat {
        taskid : number;
        reward_type : number;
        desc : string;
        target : number;
        args : string;
        number : number;
        rewards : number[][];
        forward : number;
    }
    
    export class ITalent_treasure {
        taskid : number;
        reward_type : number;
        desc : string;
        target : number;
        args : string;
        number : number;
        rewards : number[][];
        forward : number;
    }
    
    export class ITavern {
        id : number;
        task_num : number;
        free_reset : number;
        reset : number[];
        reset_item : number[];
        cost : number[];
        finish_cost : number[];
        max_task : number[];
    }
    
    export class ITavern_condition {
        quality : number;
        weight : number;
        guarantee : number;
        hero_weight : number[];
        hero_num : number;
    }
    
    export class ITavern_task {
        id : number;
        quality : number;
        name : string;
        reward : number[];
        type : number;
        weight : number;
        time : number;
        des : string;
    }
    
    export class ITavern_unlock {
        id : number;
        quality : number;
        unlock : string;
    }
    
    export class ITavern_value {
        id : number;
        item : number;
        name : string;
        value : number;
    }
    
    export class ITeamarena_division {
        lv : number;
        division : number;
        name : string;
        point : number;
        score : number;
        lose_score : any;
        unit_score : number;
        unit_lose_score : any;
        match_partner : number[];
        match1 : number[];
        match2 : any;
        match3 : any;
        weight1 : number;
        weight2 : any;
        weight3 : any;
    }
    
    export class ITeamarena_main {
        free : number;
        restore : number;
        limit : number;
        min : number;
        anew : number;
        auto : number;
        ratio : number[];
        icon_level : number;
    }
    
    export class ITeamarena_prize {
        times : number;
        prize : number[][];
    }
    
    export class ITeamarena_rank_prize {
        order : number;
        rank_prize : number[][];
        rank_limit : number;
        rank1 : number[];
        rank2 : number[];
        rank3 : number[];
        rank4 : number[];
    }
    
    export class ITeamarena_start_score {
        index : number;
        score : number[];
        point : number;
    }
    
    export class ITech {
        id : number;
        type : number;
        lv : number;
        consumption : number;
        atk_g : number;
        def_g : number;
        hp_g : number;
        unlock : any;
    }
    
    export class ITech_consumption {
        id : number;
        type : number;
        item : number;
        exp : number;
    }
    
    export class ITech_energize {
        round : number;
        times : number;
        pool : number;
        desc : string;
    }
    
    export class ITech_global {
        key : string;
        value : number[];
        desc : string;
    }
    
    export class ITech_pool {
        id : number;
        pool : number;
        place : number;
        drop : number;
        best : number;
        pro : number;
    }
    
    export class ITech_research {
        id : number;
        type : number;
        star : number;
        output : number;
        item : number;
    }
    
    export class ITech_stone {
        id : number;
        name : string;
        icon : string;
        career_type : number;
        type : number;
        color : number;
        atk_g : number;
        def_g : number;
        hp_g : number;
        unique : number[];
        disint_item : number[];
        des : string;
        power : number;
    }
    
    export class ITips {
        id : number;
        title_resource : number;
        title1 : string;
        title21 : string;
        desc21 : any;
        title22 : any;
        desc22 : any;
        title23 : any;
        desc23 : any;
    }
    
    export class ITips_relic_log {
        id : number;
        text : string;
    }
    
    export class ITv {
        tv_id : number;
        type : string;
        channels : number[];
        show_type : any;
        desc : string;
    }
    
    export class ITwist_egg {
        index : number;
        type : number;
        number : number;
        consume : number[];
        item_id : number[];
        probability : number;
        tv_id : any;
        wish : any;
        gifts : any;
        must : any;
        sorting : number;
        reward_type : number;
    }
    
    export class IUnique {
        id : number;
        name : string;
        icon : number;
        color : number;
        star_min : number;
        star_max : number;
        hero_id : any;
        hero_name : string;
        skill_icon : number[];
        skill_name : string[];
        show : number;
        index : number;
        unique : any[];
        career_type : any[];
        career_id : any[];
        des : string;
        effects : any;
        wish : any;
    }
    
    export class IUnique_global {
        key : string;
        value : number[];
        desc : string;
    }
    
    export class IUnique_lottery {
        id : number;
        system : number;
        pool : number;
        item : number;
        add_drop : [];
        des : number[];
    }
    
    export class IUnique_pool {
        id : number;
        guarantee_wish : number;
        guarantee_1 : number;
        guarantee_2 : number;
        drop_1 : number;
        weight_1 : number;
        drop_2 : number;
        weight_2 : number;
        drop_3 : number;
        weight_3 : number;
        drop_4 : number;
        weight_4 : number;
    }
    
    export class IUnique_star {
        id : number;
        unique_id : number;
        unique_name : string;
        star : number;
        atk_g : number;
        hp_g : number;
        def_g : number;
        disint_item : number[][];
        skill_unlock1 : number[];
        des1 : string;
        skill_unlock2 : any[];
        des2 : string;
    }
    
    export class IVault {
        id : number;
        born_id : number;
        name : string;
        monster : number;
        size : number;
        prize : number[];
        buff_group : number[];
        buff_skill : number;
        buff_des : string;
        level : number;
        boss : string;
        title : number[];
        initial : number;
        grow : number;
        mail_id : number;
        limit : number;
        place_1 : number[];
        place_2 : number[];
        place_3 : number[];
        place_4 : number[];
        place_5 : number[];
        place_6 : number[];
        tv_login : any;
        tv_rob : number;
    }
    
    export class IVault_exchange {
        id : number;
        headframe : number;
        title : number;
    }
    
    export class IVip {
        id : number;
        level : number;
        exp : any;
        theme : string;
        resources : string;
        des : string;
        rewards : number[][];
        price : number[];
        discount : number[];
        vip1 : number[][];
        vip2 : string;
        vip3 : any;
        vip4 : any;
        vip5 : any;
        vip6 : any;
        vip7 : any;
        vip9 : any;
        vip10 : any;
        vip11 : number;
        vip12 : any;
        show : any;
        requirements : any;
    }
    
    export class IWorker {
        id : number;
        open_lv1 : number;
        open_lv2 : number;
        open_lv3 : number;
        limit : number[];
        lend_limit : number;
        open_sort1 : number;
        open_sort2 : number;
        open_sort3 : number;
        open_sort4 : number;
        borrow_limit : number;
    }
    
    export class IWorker_assist {
        id : number;
        lv : number[];
        hero_id : number;
        hero_power : number;
        career_id : number;
        career_lv : number;
        hero_lv : number;
        hero_star : number;
        hero_atk : number;
        hero_hp : number;
        hero_def : number;
        hero_hit : number;
        hero_dodge : number;
        hero_skills : number[];
        soldier_id : number;
        soldier_atk : number;
        soldier_hp : number;
        soldier_def : number;
        soldier_hit : number;
        soldier_dodge : number;
        soldier_skills : string;
    }
    
    export class IWorker_work {
        id : number;
        rank : number;
        career_lv : number;
        earn : number;
        limit : number;
    }
    
}