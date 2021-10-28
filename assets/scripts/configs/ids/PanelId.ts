
/**
 * Id的定义与配置整合到在一起
 * xxx :{
 *  prefab: "resource目录下的prefab"，
 *  module: 依赖的资源Array<string>
 *  isPopup: boolean，是弹窗，还是栈式的view，默认true
 *  isDisableView: boolean，为Popup值为true时，是否隐藏View窗口，针对全屏弹窗优化，默认false
 *  isMask: boolean，如果是弹窗，是否模态，默认false"
 *  maskAlpha: number，遮照透明度
 *  maskColor: cc.Color，遮照颜色
 *  isTouchMaskClose: boolean，如果是模态，点击遮罩层是，是否关闭弹窗，默认false
 *  hideMode: 默认为 HideMode.DESTROY
 * }
 * @Author: sthoo.huang
 * @Date: 2019-02-14 18:07:10
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-18 18:17:55
 */
class PanelIdClass {

    ///////////////////////////////////////////common
    MainLevelUpTip: gdk.PanelValue = {
        prefab: "common/anim/shengji/UI_shengji",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
        maskAlpha: 180,
        zIndex: 999,
        isKeep: true,
        isNoExclusive: true,
    }

    // 奖励预览界面
    RewardPreview: gdk.PanelValue = {
        prefab: "common/prefab/RewardPreview",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
        isKeep: true,
        isNoExclusive: true,
    }

    // PVE战斗开始界面
    PveSceneFightingPanel: gdk.PanelValue = {
        prefab: "common/anim/zhandoukaishi/zd_zdks",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: false,
        isKeep: true,
        isNoExclusive: true,
    }

    // PVE战斗波次提醒
    PveSceneLevelTipPanel: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveSceneLevelTip",
        module: [],
        isPopup: true,
        isMask: false,
        isKeep: true,
        isNoExclusive: true,
        zIndex: cc.macro.MIN_ZINDEX,
    }

    // 符文副本战斗时间提醒
    PveSceneRuneTipPanel: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveSceneRuneTip",
        module: [],
        isPopup: true,
        isMask: false,
        isKeep: true,
        isNoExclusive: true,
        zIndex: cc.macro.MIN_ZINDEX,
    }

    // Pve生存副本购买装备列表界面
    PveSceneEquipBuyPanel: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/equip/PveEquipBuyPanel",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false,
        isNoExclusive: true,
        isKeep: true,
    }

    // PVE生存副本装备列表
    PveSceneEquipListPanel: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/equip/PveEquipListPanel",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false,
        isNoExclusive: true,
    }

    // PVE战斗失败界面
    PveSceneFailPanel: gdk.PanelValue = {
        prefab: "common/anim/jiesuan/jiesuan_lose",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false,
        isKeep: true,
    }
    // PVE战斗胜利界面
    PveSceneWinPanel: gdk.PanelValue = {
        prefab: "common/anim/jiesuan/jiesuan_win",
        module: ['chapterProgress'],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false,
        isKeep: true,
    }

    // 咨询窗口
    AskPanel: gdk.PanelValue = {
        prefab: "common/prefab/AskPanel",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
        zIndex: cc.macro.MAX_ZINDEX,
    }
    // 文本提示窗口
    TipsPanel: gdk.PanelValue = {
        prefab: "common/prefab/TipsPanel",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
        isNoExclusive: true,
    }

    Reward: gdk.PanelValue = {
        prefab: "common/prefab/RewardView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
        isKeep: true,
        isNoExclusive: true,
    }

    TaskRewardView: gdk.PanelValue = {
        prefab: "common/prefab/TaskRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
        isKeep: true,
        isNoExclusive: true,
    }
    HeroReward: gdk.PanelValue = {
        prefab: "common/anim/gethero/UI_hdyx",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
        isKeep: true,
        isNoExclusive: true,
    }
    //守护者获得界面
    GuardianReward: gdk.PanelValue = {
        prefab: "common/anim/gethero/UI_hdshz",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
        isKeep: true,
        isNoExclusive: true,
    }
    BtnMenu: gdk.PanelValue = {
        prefab: "common/prefab/BtnMenu",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
    }


    CareerTip: gdk.PanelValue = {
        prefab: "common/prefab/CareerTip",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
    }

    CommonInfoTip: gdk.PanelValue = {
        prefab: "common/prefab/CommonInfoTip",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
    }

    //抽卡特效
    LotteryEffect: gdk.PanelValue = {
        prefab: "common/anim/chouka/zh_sys",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
        isDisableView: true,
    }

    Achieve: gdk.PanelValue = {
        prefab: "common/anim/chengjiu/UI_cjdc",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
        isNoExclusive: true,
    }


    ///////////////////////////////////////////guide
    // 引导界面
    GuideView: gdk.PanelValue = {
        prefab: "guide/prefab/GuideView",
    }
    // 新功能开启提示界面
    FunctionOpen: gdk.PanelValue = {
        prefab: "guide/prefab/FunctionOpenTip",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false,
        isKeep: true,
        isNoExclusive: true,
    }
    // 移动塔位提示界面
    GuideMoveHero: gdk.PanelValue = {
        prefab: "guide/prefab/GuideMoveHero",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }


    ///////////////////////////////////////////view/act
    //开服冲榜活动
    KfcbActView: gdk.PanelValue = {
        prefab: "view/act/prefab/KfcbActView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //开服冲榜活动日报
    KfcbActNotice: gdk.PanelValue = {
        prefab: "view/act/prefab/KfcbActNotice",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //开服福利120抽
    KfflActView: gdk.PanelValue = {
        prefab: "view/act/prefab/KfflActView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //开服福利二期
    KfflAct2View: gdk.PanelValue = {
        prefab: "view/act/prefab/KfflAct2View",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //每日首充
    DailyFirstRecharge: gdk.PanelValue = {
        prefab: "view/act/prefab/DailyFirstRecharge",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //点金
    Alchemy: gdk.PanelValue = {
        prefab: "view/act/prefab/alchemy/AlchemyView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 150,
        isTouchMaskClose: true,
    }

    //充值入口
    Recharge: gdk.PanelValue = {
        prefab: "view/store/prefab/recharge/RechargeView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    //充值-魔方商店
    RechargeMF: gdk.PanelValue = {
        prefab: "view/store/prefab/recharge/RechargeMFpanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //充值-特权
    RechargeTQ: gdk.PanelValue = {
        prefab: "view/store/prefab/recharge/RechargeTQpanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }
    //充值-礼包
    RechargeLB: gdk.PanelValue = {
        prefab: "view/store/prefab/recharge/RechargeLBpanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //充值-vip
    RechargVIP: gdk.PanelValue = {
        prefab: "view/store/prefab/recharge/RechargeVIPpanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //充值-充值
    RechargeCZ: gdk.PanelValue = {
        prefab: "view/store/prefab/recharge/RechargeCZpanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //vip等级提升提示窗口
    VipUpTipPanel: gdk.PanelValue = {
        prefab: "view/store/prefab/recharge/VipUpTipPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //冒险日记
    DiaryView: gdk.PanelValue = {
        prefab: "view/act/prefab/diary/DiaryView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //冒险日记等级奖励界面
    DiaryLvRewardView: gdk.PanelValue = {
        prefab: "view/act/prefab/diary/DiaryLvRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //----------------战争遗迹--------------------//
    // 战争遗迹界面
    RelicMapView: gdk.PanelValue = {
        prefab: "view/relic/prefab/RelicMapView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }

    // 战争遗迹主界面
    RelicMainView: gdk.PanelValue = {
        prefab: "view/relic/prefab/RelicMainView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }

    // 战争遗迹据点详情
    RelicPointDetailsView: gdk.PanelValue = {
        prefab: "view/relic/prefab/RelicPointDetailsView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 战争遗迹列表
    RelicPointListView: gdk.PanelValue = {
        prefab: "view/relic/prefab/RelicPointListView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 战争遗迹邀请协防列表
    RelicInviteAssistView: gdk.PanelValue = {
        prefab: "view/relic/prefab/RelicInviteAssistView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 战争遗迹奖励领取
    RelicRewardView: gdk.PanelValue = {
        prefab: "view/relic/prefab/RelicRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 战争遗迹掉落记录
    RelicDropRecordView: gdk.PanelValue = {
        prefab: "view/relic/prefab/RelicDropRecordView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 战争遗迹收到的转让据点列表
    RelicPointReciveListView: gdk.PanelValue = {
        prefab: "view/relic/prefab/RelicPointReciveListView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 战争遗迹转让据点
    RelicTransPointView: gdk.PanelValue = {
        prefab: "view/relic/prefab/RelicTransPointView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 战争遗迹被攻击列表
    RelicUnderAtkNoticeView: gdk.PanelValue = {
        prefab: "view/relic/prefab/RelicUnderAtkNoticeView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 战争遗迹公会排名
    RelicRankView: gdk.PanelValue = {
        prefab: "view/relic/prefab/RelicRankView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }


    //遗迹通行证 主界面
    RelicTradingPortView: gdk.PanelValue = {
        prefab: "view/relic/prefab/tradingPort/RelicTradingPortView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //遗迹通行证 子界面 遗迹之证
    RelicPassPortView: gdk.PanelValue = {
        prefab: "view/relic/prefab/tradingPort/RelicPassPortView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //遗迹通行证 子界面 遗迹任务
    RelicTaskView: gdk.PanelValue = {
        prefab: "view/relic/prefab/tradingPort/RelicTaskView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //遗迹通行证 子界面 通行证购买
    RelicPassPortBuyView: gdk.PanelValue = {
        prefab: "view/relic/prefab/tradingPort/RelicPassPortBuyView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 战争遗迹抢夺排名详情
    RelicAtkRankView: gdk.PanelValue = {
        prefab: "view/relic/prefab/RelicAtkRankView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //////////////////////////////////view/act/restriction
    // 限购商城详情
    RestrictionView: gdk.PanelValue = {
        prefab: "view/act/prefab/restriction/RestrictionView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }


    //////////////////////////////////view/combine/合服活动

    //合服活动总页面
    CombineMainView: gdk.PanelValue = {
        prefab: "view/combine/prefab/CombineMainView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //合服狂欢
    CombineCarnivalView: gdk.PanelValue = {
        prefab: "view/combine/prefab/CombineCarnivalView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //合服狂欢 排行
    CombineRankView: gdk.PanelValue = {
        prefab: "view/combine/prefab/CombineRankView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //合服狂欢 登录提示
    CombineCarnivalTip: gdk.PanelValue = {
        prefab: "view/combine/prefab/CombineCarnivalTip",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //合服 服务器排行
    CombineServerRankView: gdk.PanelValue = {
        prefab: "view/combine/prefab/CombineServerRankView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //合服 奖励排行
    ComServerRankRewardView: gdk.PanelValue = {
        prefab: "view/combine/prefab/ComServerRankRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //合服 特权tip
    CombineSerPrivilegeTip: gdk.PanelValue = {
        prefab: "view/combine/prefab/CombineSerPrivilegeTip",
        module: [],
        maskAlpha: 180,
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    ///////////////////////////////////////////view/arena
    // 竞技场界面
    Arena: gdk.PanelValue = {
        prefab: "view/arena/prefab/ArenaView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }
    ArenaPointReward: gdk.PanelValue = {
        prefab: "view/arena/prefab/ScoreReward",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    ArenaReportView: gdk.PanelValue = {
        prefab: "view/arena/prefab/ReportView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    ArenaBuyTimes: gdk.PanelValue = {
        prefab: "view/arena/prefab/ArenaBuyTimes",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // ArenaBattleArray: gdk.PanelValue = {
    //     prefab: "view/arena/prefab/BattleArray",
    //     module: [],
    //     isPopup: true,
    //     isMask: true,
    //     isTouchMaskClose: false,
    //     maskAlpha: 180,
    // }
    // ArenaBattleReadyView: gdk.PanelValue = {
    //     prefab: "view/arena/prefab/BattleReadyView",
    //     module: [],
    //     isPopup: true,
    //     isMask: true,
    //     isTouchMaskClose: false,
    //     maskAlpha: 180,
    // }
    // ArenaBattleSkillSelector: gdk.PanelValue = {
    //     prefab: "view/arena/prefab/BattleReady/SkillSelector",
    //     module: [],
    //     isPopup: true,
    //     isMask: true,
    //     isTouchMaskClose: true,
    //     maskAlpha: 20,
    // }
    // ArenaBattleSkillDetail: gdk.PanelValue = {
    //     prefab: "view/arena/prefab/BattleReady/SkillDetail",
    //     module: [],
    //     isPopup: true,
    //     isMask: true,
    //     isTouchMaskClose: true,
    //     maskAlpha: 0,
    // }

    ArenaBattleHeroDefenceSelector: gdk.PanelValue = {
        prefab: "view/arena/prefab/BattleReady/HeroDefenceSelector",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
        maskAlpha: 0,
    }

    RandomBossView: gdk.PanelValue = {
        prefab: "view/arena/prefab/Fight/RandomBossView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
        maskAlpha: 125,
        isKeep: true,
    }

    ///////////////////////////////////////////view/bag
    // 背包界面
    Bag: gdk.PanelValue = {
        prefab: "view/bag/prefab/BagView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    //碎片合成道具界面
    ItemComposite: gdk.PanelValue = {
        prefab: "view/bag/prefab/ItemCompositeView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //批量合成界面
    BatchCompound: gdk.PanelValue = {
        prefab: "view/bag/prefab/BatchCompoundView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 普通物品提示面板
    ItemTips: gdk.PanelValue = {
        prefab: "view/bag/prefab/ItemTips",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    // 自选礼包物品提示面板
    GiftItemTips: gdk.PanelValue = {
        prefab: "view/bag/prefab/GiftItemTips",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    // 装备提示面板
    EquipTips: gdk.PanelValue = {
        prefab: "view/bag/prefab/EquipTips",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    // 宝石提示面板
    JewelTips: gdk.PanelValue = {
        prefab: "view/bag/prefab/JewelTips",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    // 称号tips
    TitlelTips: gdk.PanelValue = {
        prefab: "view/bag/prefab/TitleTips",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //物品获取途径窗口
    GainWayTips: gdk.PanelValue = {
        prefab: "view/bag/prefab/GainWayTips",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //自主选择礼包--英雄 开启
    SelectHero: gdk.PanelValue = {
        prefab: "view/bag/prefab/SelectHeroView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }


    //自主选择礼包--道具开启
    SelectGift: gdk.PanelValue = {
        prefab: "view/bag/prefab/SelectGiftView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //自主选择礼包选定界面--道具
    SelectGiftGet: gdk.PanelValue = {
        prefab: "view/bag/prefab/SelectGiftGet",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //自主选择礼包选定界面--装备
    SelectGiftGetEquip: gdk.PanelValue = {
        prefab: "view/bag/prefab/SelectGiftGetEquip",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //自主选择礼包选定界面--英雄
    SelectGiftGetHero: gdk.PanelValue = {
        prefab: "view/bag/prefab/SelectGiftGetHero",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    ///////////////////////////////////////////view/bingying
    // 兵营主界面
    BYMainView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/BYMainView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false
    }

    // 科技界面
    BYTechView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/tech/BYTechView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false
    }

    // 科技升级界面
    BYTechUpgradeView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/tech/BYTechUpgradeView",
        module: [],
        isPopup: true,
        maskAlpha: 180,
        isMask: true,
        isTouchMaskClose: true
    }

    // 能源石选择界面
    BYTechStoneSelectView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/tech/BYTechStoneSelectView",
        module: [],
        isPopup: true,
        maskAlpha: 180,
        isMask: true,
        isTouchMaskClose: true
    }

    // 能源石详情界面
    BYTechStoneInfoView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/tech/BYTechStoneInfoView",
        module: [],
        isPopup: true,
        maskAlpha: 180,
        isMask: true,
        isTouchMaskClose: true
    }

    // 聚能界面
    BYEnergizeView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/energize/BYEnergizeView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 180,
        isTouchMaskClose: false
    }

    // 聚能奖励预览
    BYEnergizePreView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/energize/BYEnergizePreView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true
    }

    // 能源石技能预览
    BYEStoneSkillBookView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/energize/BYEStoneSkillBookView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true
    }

    // 聚能奖励预览
    BYEStoneSkillDetailView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/energize/BYEStoneSkillDetailView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true
    }

    // 研发界面
    BYResearchView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/tech/BYResearchView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true
    }

    // 研发 英雄选择确定界面
    BYResearchHeroConfirmView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/tech/BYResearchHeroConfirm",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 30,
        isTouchMaskClose: true
    }

    //能量石分解子界面
    BYEStoneDecomposePanel: gdk.PanelValue = {
        prefab: "view/bingying/prefab/energize/BYEStoneDecomposePanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 兵营界面
    BYView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/BYView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false
    }
    // 兵营训练界面
    BYTrain: gdk.PanelValue = {
        prefab: "view/bingying/prefab/BYTrainView",
        module: [],
        isPopup: false,
        isDisableView: true,
        isMask: false,
        isTouchMaskClose: false,
    }
    // 科技升级界面
    TechTrain: gdk.PanelValue = {
        prefab: "view/bingying/prefab/TechTrainView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 科技适合英雄界面
    TechHero: gdk.PanelValue = {
        prefab: "view/bingying/prefab/TechHero",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 兵营士兵属性界面
    TechSoldier: gdk.PanelValue = {
        prefab: "view/bingying/prefab/TechSoldier",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 士兵图鉴界面
    BYBookView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/BYBookView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // 士兵预览界面
    SoldierView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/BookSoldierView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    // 士兵获得效果
    BYGetSoldierEffect: gdk.PanelValue = {
        prefab: "view/bingying/prefab/BYGetSoldierEffect",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 230,
        isTouchMaskClose: true,
    }

    ///////////////////////////////////////////view/chat
    // 聊天界面
    Chat: gdk.PanelValue = {
        prefab: "view/chat/prefab/ChatView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
        maskAlpha: 0,
    }
    // 表情选择面板
    Face: gdk.PanelValue = {
        prefab: "view/chat/prefab/FaceView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
        maskAlpha: 0,
    }

    // mini聊天窗口
    MiniChat: gdk.PanelValue = {
        prefab: "view/chat/prefab/MiniChat",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
        zIndex: -99,
        isKeep: true,
        isNoExclusive: true,
    }

    ///////////////////////////////////////////view/decompose
    //分解界面
    Decompose: gdk.PanelValue = {
        prefab: "view/decompose/prefab/DecomposeView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true,
    }

    //分解界面
    DecomposeNumPanel: gdk.PanelValue = {
        prefab: "view/decompose/prefab/DecomposeNumPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }


    ///////////////////////////////////////////view/friend
    // 好友界面
    Friend: gdk.PanelValue = {
        prefab: "view/friend/prefab/FriendView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }
    // 黑名单界面
    BlackView: gdk.PanelValue = {
        prefab: "view/friend/prefab/BlackListView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true
    }
    // 搜索界面
    SearchView: gdk.PanelValue = {
        prefab: "view/friend/prefab/SearchListView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false
    }

    ///////////////////////////////////////////view/general
    General: gdk.PanelValue = {
        prefab: "view/general/prefab/GeneralView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    //神器任务界面
    GeneralWeaponTask: gdk.PanelValue = {
        prefab: "view/general/prefab/GeneralWeaponTaskPanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //神器列表界面
    GeneralWeapon: gdk.PanelValue = {
        prefab: "view/general/prefab/GeneralWeaponPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //神器获得界面
    GeneralWeaponGetView: gdk.PanelValue = {
        prefab: "view/general/prefab/GeneralWeaponGetView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        zIndex: 99,
        isTouchMaskClose: false,
    }

    //神器tips界面
    GeneralWeaponTips: gdk.PanelValue = {
        prefab: "view/general/prefab/GeneralWeaponTipsView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    //神器升级精炼界面
    GeneralWeaponUpgradePanel: gdk.PanelValue = {
        prefab: "view/general/prefab/GeneralWeaponUpgradePanel",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }

    //神器tips界面
    GWeaponInfoView: gdk.PanelValue = {
        prefab: "view/general/prefab/GWeaponInfoView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    //神器升级精炼成功界面
    GWeaponUpgradeSucView: gdk.PanelValue = {
        prefab: "view/general/prefab/GWeaponUpgradeSucView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    // 查看玩家英雄信息
    OtherHero: gdk.PanelValue = {
        prefab: "view/general/prefab/OtherHeroView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    ///////////////////////////////////////////view/guild
    //公会创建
    GuildCreate: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildCreate",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会创建选择方式
    GuildCreateSelect: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildCreateSelect",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会发布招募
    GuildRecruitCheck: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildRecruitCheck",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会详情
    GuildDetail: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildDetail",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    //加入公会
    GuildJoin: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildJoin",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会列表
    GuildList: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildList",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    //公会申请列表
    GuildApplyList: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildApplyList",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会改名
    GuildChangeName: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildChangeName",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会验证
    GuildSetCheck: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildSetCheck",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会logo設置
    GuildSetIcon: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildSetIcon",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会签到
    GuildSign: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildSign",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会列表排名
    GuildListRankView: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildListRankView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会邮件发送界面
    GuildMailSendView: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildMailSendView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会日志
    GuildLog: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildLog",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会日志详情
    GuildLogDetail: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildLogDetail",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会邀请列表界面
    GuildInviteListView: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildInviteListView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会主界面
    GuildMain: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildMain",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    //公会战难度选择
    GuildWarSelect: gdk.PanelValue = {
        prefab: "view/guild/prefab/war/GuildWarSelect",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会玩法 末日集结
    GuildPowerView: gdk.PanelValue = {
        prefab: "view/guild/prefab/power/GuildPowerView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    //公会玩法 末日集结 英雄选择
    GuildPowerSetUpHeroSelector: gdk.PanelValue = {
        prefab: "view/guild/prefab/power/GuildPowerSetUpHeroSelector",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会玩法 公会排行
    GuildPowerRankView: gdk.PanelValue = {
        prefab: "view/guild/prefab/power/GuildPowerRankView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会副本界面
    GuildCopyView: gdk.PanelValue = {
        prefab: "view/guild/prefab/GuildCopyView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // //公会战界面
    // GuildWarView: gdk.PanelValue = {
    //     prefab: "view/guild/prefab/war/GuildWarView",
    //     module: [],
    //     isPopup: false,
    //     isMask: false,
    //     isTouchMaskClose: false,
    // }

    //公会据点详情
    GuildWarPointDetail: gdk.PanelValue = {
        prefab: "view/guild/prefab/war/GuildWarPointDetail",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会据点战 活动奖励
    GuildWarAct: gdk.PanelValue = {
        prefab: "view/guild/prefab/war/GuildWarAct",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会据点战 贡献榜
    GuildWarContribute: gdk.PanelValue = {
        prefab: "view/guild/prefab/war/GuildWarContribute",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会可上阵英雄列表
    GuildWarHeroList: gdk.PanelValue = {
        prefab: "view/guild/prefab/war/GuildWarHeroList",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    GuildWarPointTip: gdk.PanelValue = {
        prefab: "view/guild/prefab/war/GuildWarPointTip",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
    }


    //新据点战界面
    GuildFootHoldView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/GuildFootHoldView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    //新据点战界面(全区)
    GlobalFootHoldView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/GlobalFootHoldView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }


    FootHoldPointDetail: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FootHoldPointDetail",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    FHGroupHeroListView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHGroupHeroListView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    FHRankView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHRankView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    FHLastRankView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHLastRankView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    FHSmallMap: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHSmallMap",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    FHSmallMapCityDetail: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHSmallMapCityDetail",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会据点战设置防守阵容界面
    FHBattleArrayView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHBattleArrayView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //公会据点战设置进攻阵容界面
    FHPVPBattleReadyView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHPVPBattleReadyView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
        maskAlpha: 180,
    }

    /**据点战购买体力 */
    FHBuyEngergy: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHBuyEngergy",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**据点战会长发奖 */
    FHSendReward: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHSendReward",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    /**据点战奖励领取 */
    FHRewardGet: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHRewardGet",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**据点战 结果界面 */
    FHResultView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHResultView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    /**据点战 奖励列表 */
    FHRewardList: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHRewardList",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    /**据点战产出 资源界面 */
    FHProduceView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHProduceView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**据点战 新基地升级界面 */
    FHBaseRewardNew: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHBaseRewardNew",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**据点战 基地等级预览界面 */
    FHBaseUpgradePreview: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHBaseUpgradePreview",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**据点战 基地体力领取界面 */
    FHBaseEnergyGetView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHBaseEnergyGetView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**据点战 基地领取奖励 */
    FHBaseReward: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHBaseReward",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**据点战 基地升级奖励预览 */
    FHBasePreReward: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHBasePreReward",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**据点战 基地占领 */
    FHOccupyView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHOccupyView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**据点战 放弃基地占领 */
    FHGiveupView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHGiveupView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**据点战 据点产出预览 */
    FHPVPBattlePreView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHPVPBattlePreView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**竞猜界面 */
    FHCrossGuessView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/cross/FHCrossGuessView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**竞猜下注 */
    FHGuessCheckView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/cross/FhGuessCheckView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**竞猜 支持率 */
    FHGuessSupport: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/cross/FHGuessSupport",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**公会 据点战标记 */
    FHPointMarkPanel: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHPointMarkPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**公会 据点战标记 */
    FHChatView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHChatView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**公会 据点挑战记录 */
    FHPointFightLog: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHPointFightLog",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**公会 据点挑战排行榜 */
    FHFightRankView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/FHFightRankView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**公会 协战主界面 */
    FHCooperationMain: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/cooperation/FHCooperationMain",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }


    /**公会 协战公会排名 */
    FHCooperationGuild: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/cooperation/FHCooperationGuild",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    /**公会 协战成员排名 */
    FHCooperationRank: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/cooperation/FHCooperationRank",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    /**公会 协战成员招募 */
    FHCooperationHire: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/cooperation/FHCooperationHire",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**公会 协战成员邀请 */
    FHCooperationInvite: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/cooperation/FHCooperationInvite",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**公会 协战成员审核设定 */
    FHCooperationCheck: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/cooperation/FHCooperationCheck",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**公会 协战成员申请列表 */
    FHCooperationApply: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/cooperation/FHCooperationApply",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**公会 协战 成员列表 */
    FHCooperationPlayerList: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/cooperation/FHCooperationPlayerList",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**公会 协战 日报 */
    FHCooperationNotice: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/cooperation/FHCooperationNotice",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }


    // 公会boss
    EnvelopeMainView: gdk.PanelValue = {
        prefab: "view/guild/prefab/envelope/EnvelopeMainView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 公会boss
    GuildBossView: gdk.PanelValue = {
        prefab: "view/guild/prefab/guildBoss/GuildBossView",
        module: [],
        isPopup: false,
        isMask: true,
        isTouchMaskClose: false,
    }

    /**公会BOSS伤害排行榜 */
    GuildBossDamageRank: gdk.PanelValue = {
        prefab: "view/guild/prefab/guildBoss/GuildBossDamageRankView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    /**公会BOSS伤害排行榜奖励预览 */
    GuildRankRewardView: gdk.PanelValue = {
        prefab: "view/guild/prefab/guildBoss/GuildRankRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }


    /**据点战教学 */
    FootHoldTeaching: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/teaching/FootHoldTeaching",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }


    /**据点战教学 */
    FHCrossTip: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/cross/FHCrossTip",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: false,
    }

    //丧失攻城--挑战界面
    SiegeFightView: gdk.PanelValue = {
        prefab: "view/guild/prefab/siege/SiegeFightView",
        module: [],
        isPopup: false,
        isMask: false,
        maskAlpha: 225,
        isTouchMaskClose: false,
    }

    //丧失攻城--主界面
    SiegeMainView: gdk.PanelValue = {
        prefab: "view/guild/prefab/siege/SiegeMainView",
        module: [],
        isPopup: false,
        isMask: false,
        maskAlpha: 225,
        isTouchMaskClose: false,
    }

    //丧失攻城--排名奖励
    SiegeRankReward: gdk.PanelValue = {
        prefab: "view/guild/prefab/siege/SiegeRankReward",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    //丧失攻城--积分商店
    SiegeStore: gdk.PanelValue = {
        prefab: "view/guild/prefab/siege/SiegeStore",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    //丧失攻城--英雄设定
    SiegeSetUpHeroSelector: gdk.PanelValue = {
        prefab: "view/guild/prefab/siege/SiegeSetUpHeroSelector",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    //据点战军衔界面
    MilitaryRankView: gdk.PanelValue = {
        prefab: "view/guild/prefab/militaryRank/MilitaryRankView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: false,
    }

    //据点战军衔升级
    MilitaryRankUpgrade: gdk.PanelValue = {
        prefab: "view/guild/prefab/militaryRank/MilitaryRankUpgrade",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    //据点战军衔 预览
    MilitaryRankPreView: gdk.PanelValue = {
        prefab: "view/guild/prefab/militaryRank/MilitaryRankPreView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    //据点战军衔 体力领取
    MilitaryRankGetEngergy: gdk.PanelValue = {
        prefab: "view/guild/prefab/militaryRank/MilitaryRankGetEngergy",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    ///////////////////////////////////////////据点战驻守 集结
    //驻守邀请列表
    FHGuardInviteView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/guard/FHGuardInviteView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    //驻守点详情信息
    FHGuardDetailView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/guard/FHGuardDetailView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    //我的驻守邀请列表
    FHMyGuardInviteList: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/guard/FHMyGuardInviteList",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    //集结邀请列表
    FHGatherInviteView: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/gather/FHGatherInviteView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    //我的集结邀请列表
    FHMyGatherInviteList: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/gather/FHMyGatherInviteList",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    /**集结准备挑战界面 */
    FHGatherReadyFight: gdk.PanelValue = {
        prefab: "view/guild/prefab/footHold/gather/FHGatherReadyFight",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    //英雄锁定提示界面
    HeroLockTips: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/common/HeroLockTips",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 150,
        isTouchMaskClose: true,
    }

    /////////////////////////--------------团队远征
    //远征主界面
    ExpeditionMainView: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/ExpeditionMainView",
        module: [],
        isPopup: false,
        isMask: true,
        isTouchMaskClose: false,
    }

    //远征地图 子界面
    ExpeditionLayerView: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/ExpeditionLayerView",
        module: [],
        isPopup: false,
        isMask: true,
        isTouchMaskClose: false,
    }

    //远征 据点详情界面
    ExpeditionPointDetail: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/ExpeditionPointDetail",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    //远征  英雄列表
    ExpeditionHeroList: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/ExpeditionHeroList",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //远征  英雄选择
    ExpeditionSelectHero: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/ExpeditionSelectHero",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //远征  战斗开始界面
    ExpeditionFight: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/ExpeditionFight",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //远征  怪物tip
    ExpeditionMonsterTip: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/ExpeditionMonsterTip",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //远征  据点奖励 展示
    ExpeditionPointReward: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/ExpeditionPointReward",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //远征  据点攻打记录
    ExpeditionPointLog: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/ExpeditionPointLog",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //远征 体力购买
    ExpeditionBuyEnergy: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/ExpeditionBuyEnergy",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //远征 体力购买
    ExpeditionRankView: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/ExpeditionRankView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //远征 部队任务界面
    ExpeditionArmyView: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/army/ExpeditionArmyView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //远征 部队升级界面
    ExpeditionLvUpView: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/army/ExpeditionLvUpView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //远征 部队预览界面
    ExpeditionArmyRewardView: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/army/ExpeditionArmyRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //远征 部队技能预览界面
    ExpeditionArmySkillPreviewView: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/army/ExpeditionArmySkillPreviewView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //远征 部队技能详情界面
    ExpeditionArmySkillInfo: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/army/ExpeditionArmySkillInfo",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //远征  部队强化主界面
    ExpeditionStrengthenView: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/army/ExpeditionStrengthenView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 战力提升提示界面
    ExpeditionPowerTip: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/army/ExpeditionPowerTip",
        module: [],
        isPopup: true,
        isMask: false,
        zIndex: 999,
        isNoExclusive: true,
    }

    //团队远征 英雄详情界面
    ExpeditionHeroDetailView: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/army/ExpeditionHeroDetailView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //团队远征 英雄详情技能界面
    ExpeditionHeroDetailSkill: gdk.PanelValue = {
        prefab: "view/guild/prefab/expedition/army/ExpeditionHeroDetailSkill",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }


    /**开服8天登陆界面 */
    KfLoginView: gdk.PanelValue = {
        prefab: "view/act/prefab/kfLogin/KfLoginView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    ///////////////////////////////////////////view/bounty
    //赏金求助
    /**赏金求助界面 */
    BountyPublishView: gdk.PanelValue = {
        prefab: "view/bounty/prefab/BountyPublishView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**任务列表 */
    BountyList: gdk.PanelValue = {
        prefab: "view/bounty/prefab/BountyList",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**赏金发布门槛提示界面 */
    BountyPublishTipsView: gdk.PanelValue = {
        prefab: "view/bounty/prefab/BountyPublishTipsView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**赏金回放界面 */
    BountyItemReplay: gdk.PanelValue = {
        prefab: "view/bounty/prefab/BountyItemReplay",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    ///////////////////////////////////////////view/hotupdate
    // 原生模式热更新界面
    HotUpdate: gdk.PanelValue = {
        prefab: "view/hotupdate/prefab/HotUpdateView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false,
    };

    ///////////////////////////////////////////view/instance
    // 副本界面
    Instance: gdk.PanelValue = {
        prefab: "view/instance/prefab/InstanceView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }
    // // 试炼副本界面
    // SubInstanceDetailView: gdk.PanelValue = {
    //     prefab: "view/instance/prefab/SubInstanceDetailView",
    //     module: [],
    //     isPopup: true,
    //     isDisableView: false,
    //     isMask: false,
    //     isTouchMaskClose: false,
    // }
    // 正义的反击副本界面
    SubInstanceDetailView2: gdk.PanelValue = {
        prefab: "view/instance/prefab/SubInstanceDetailView2",
        module: [],
        isPopup: true,
        isDisableView: false,
        isMask: false,
        isTouchMaskClose: false,
    }
    // 末日副本界面
    SubInstanceDoomsdayView: gdk.PanelValue = {
        prefab: "view/instance/prefab/SubInstanceDoomsdayView",
        module: [],
        isPopup: true,
        isDisableView: false,
        isMask: false,
        isTouchMaskClose: false,
    }
    // 末日副本一键扫荡界面
    SubInsSweepView: gdk.PanelValue = {
        prefab: "view/instance/prefab/SubInsSweepView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // 奖杯模式副本界面
    SubInstanceEliteView: gdk.PanelValue = {
        prefab: "view/instance/prefab/SubInstanceEliteView",
        module: [],
        isPopup: true,
        isDisableView: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 新生存副本界面
    SubInstanceSurvivalView: gdk.PanelValue = {
        prefab: "view/instance/prefab/SubInstanceSurvivalView",
        module: [],
        isPopup: true,
        isDisableView: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 英雄副本界面
    SubInstanceHeroView: gdk.PanelValue = {
        prefab: "view/instance/prefab/SubInstanceHeroView",
        module: [],
        isPopup: true,
        isDisableView: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 守护者副本界面
    SubInstanceGuardianView: gdk.PanelValue = {
        prefab: "view/instance/prefab/SubInstanceGuardianView",
        module: [],
        isPopup: true,
        isDisableView: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 终极试炼副本界面
    SubInstanceUltimateView: gdk.PanelValue = {
        prefab: "view/instance/prefab/ultimate/SubInstanceUltimateView",
        module: [],
        isPopup: true,
        isDisableView: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 符文副本界面
    SubInstanceRuneView: gdk.PanelValue = {
        prefab: "view/instance/prefab/SubInstanceRuneView",
        module: [],
        isPopup: true,
        isDisableView: false,
        isMask: false,
        isTouchMaskClose: false,
    }
    // 符文副本符文解锁界面
    SubInstanceRuneShowView: gdk.PanelValue = {
        prefab: "view/instance/prefab/SubInstanceRuneShowView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    // 无尽的黑暗副本界面
    TowerPanel: gdk.PanelValue = {
        prefab: "view/instance/prefab/TowerPanel",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    //无尽的黑暗扫荡提示界面
    TowerAskPanel: gdk.PanelValue = {
        prefab: "view/instance/prefab/TowerAskPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    //无尽的黑暗获得技能tip
    TowerGetSkill: gdk.PanelValue = {
        prefab: "view/instance/prefab/TowerGetSkill",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }


    MainLineView: gdk.PanelValue = {
        prefab: "view/instance/prefab/mainLine/NMainLineView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    //主线关卡选择界面
    ChapterSelect: gdk.PanelValue = {
        prefab: "view/instance/prefab/mainLine/ChapterSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    MLEnterStagePanel: gdk.PanelValue = {
        prefab: "view/instance/prefab/mainLine/mlEnterStagePanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    AreaRewardPreview: gdk.PanelValue = {
        prefab: "view/instance/prefab/mainLine/MlAreaCupsReward",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }


    MlHangRewardView: gdk.PanelValue = {
        prefab: "view/instance/prefab/mainLine/MlHangRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    // 扫荡结果
    RaidReward: gdk.PanelValue = {
        prefab: "view/instance/prefab/mainLine/RaidsRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
        isNoExclusive: true,
    }

    // 扫荡结果 new
    RaidReward2: gdk.PanelValue = {
        prefab: "view/instance/prefab/mainLine/RaidsRewardView2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
        isNoExclusive: true,
    }

    //英雄副本战利品领取界面
    BossReward: gdk.PanelValue = {
        prefab: "view/instance/prefab/InstanceRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // //pvp副本上阵准备界面
    // InstancePVPReadyView: gdk.PanelValue = {
    //     prefab: "view/instance/prefab/InstancePVPBattleReadyView",
    //     module: [],
    //     isPopup: true,
    //     isMask: true,
    //     isTouchMaskClose: false,
    //     maskAlpha: 180,
    // }

    //挂机奖励界面
    InstanceHangRewardView: gdk.PanelValue = {
        prefab: "view/instance/prefab/InstanceHangRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
        isKeep: true,
        isNoExclusive: true,
    }

    //精英副本关卡界面
    SubEliteGroupView: gdk.PanelValue = {
        prefab: "view/instance/prefab/SubEliteGroupView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //奖杯副本挑战模式英雄选择界面
    SubEliteChallengeView: gdk.PanelValue = {
        prefab: "view/instance/prefab/SubEliteChallengeView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //挂机奖励预览
    MainHangPreReward: gdk.PanelValue = {
        prefab: "view/instance/prefab/MainHangPreReward",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 创角界面
    Create: gdk.PanelValue = {
        prefab: "view/login/prefab/CreateRole",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    // 游戏公告
    NoticeView: gdk.PanelValue = {
        prefab: "view/login/prefab/NoticeView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
    };

    // 精彩活动
    WonderfulActivityView: gdk.PanelValue = {
        prefab: "view/act/prefab/wonderfulActivitys/WonderfulActivityView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }

    /**精彩活动-子活动界面 */
    SubActivityView: gdk.PanelValue = {
        prefab: "view/act/prefab/wonderfulActivitys/SubActivityView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**精彩活动-周末福利界面 */
    WeekendGiftView: gdk.PanelValue = {
        prefab: "view/act/prefab/wonderfulActivitys/WeekendGiftView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**砍价大礼包 */
    DiscountView: gdk.PanelValue = {
        prefab: "view/act/prefab/wonderfulActivitys/DiscountView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    //活动整合界面
    ActivityMainView: gdk.PanelValue = {
        prefab: "view/act/prefab/ActivityMainView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    /**精彩活动-魔幻活动子界面 */
    SubMagicExchange: gdk.PanelValue = {
        prefab: "view/act/prefab/wonderfulActivitys/SubMaigcExchange",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }

    /**精彩活动-魔幻兑换界面 */
    MagicStore: gdk.PanelValue = {
        prefab: "view/act/prefab/wonderfulActivitys/MaigcStoreView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**中秋秘镜活动子界面 */
    MidAutumnActView: gdk.PanelValue = {
        prefab: "view/act/prefab/wonderfulActivitys/MidAutumnActView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }

    /**中秋秘镜兑换界面 */
    MidAutumnStoreView: gdk.PanelValue = {
        prefab: "view/act/prefab/wonderfulActivitys/MidAutumnStoreView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**累充大礼活动 */
    LcdlView: gdk.PanelValue = {
        prefab: "view/act/prefab/lcdl/LcdlView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**新累充大礼活动 */
    NewLcdlView: gdk.PanelValue = {
        prefab: "view/act/prefab/newLcdl/NewLcdlView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**升星有礼 */
    StarGiftsView: gdk.PanelValue = {
        prefab: "view/act/prefab/starGifts/StarGiftsView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**幸运翻牌 */
    FlipCardsView: gdk.PanelValue = {
        prefab: "view/act/prefab/flipCards/FlipCardsView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**幸运翻牌 奖励预览*/
    FlipCardsPreview: gdk.PanelValue = {
        prefab: "view/act/prefab/flipCards/FlipCardPreview",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**幸运翻牌任务界面 */
    FlipCardsTaskView: gdk.PanelValue = {
        prefab: "view/act/prefab/flipCards/FlipCardsTaskView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    /**幸运翻牌设置终极大奖界面 */
    FlipCardsSelectView: gdk.PanelValue = {
        prefab: "view/act/prefab/flipCards/FlipCardSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        // maskAlpha: 225,
        isTouchMaskClose: true,
    }

    /**幸运翻牌帮助界面 */
    FlipCardsHelpView: gdk.PanelValue = {
        prefab: "view/act/prefab/flipCards/FlipCardHelpView",
        module: [],
        isPopup: true,
        isMask: true,
        // maskAlpha: 225,
        isTouchMaskClose: true,
    }

    /**超值购*/
    SuperValueView: gdk.PanelValue = {
        prefab: "view/act/prefab/superValue/SuperValueView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**累计登陆 */
    TotalLoginView: gdk.PanelValue = {
        prefab: "view/act/prefab/totalLogin/TotalLoginView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**幸运扭蛋 */
    TwistedEggView: gdk.PanelValue = {
        prefab: "view/act/prefab/twistedEgg/TwistedEggView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**扭蛋心愿英雄选择界面*/
    TwistedRewardView: gdk.PanelValue = {
        prefab: "view/act/prefab/twistedEgg/TwistedRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
    }

    /**扭蛋帮助界面*/
    TwistedHelpView: gdk.PanelValue = {
        prefab: "view/act/prefab/twistedEgg/TwistedHelpView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**扭蛋商城*/
    SubEggStoreView: gdk.PanelValue = {
        prefab: "view/act/prefab/store/SubEggStoreView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**礼券商城 */
    SubGiftStoreView: gdk.PanelValue = {
        prefab: "view/act/prefab/store/SubGiftStoreView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**娃娃机概率界面*/
    AdvCatcherWeightView: gdk.PanelValue = {
        prefab: "view/act/prefab/catcher/AdvCatcherWeightView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    /**娃娃机心愿池自选界面*/
    AdvCatcherSelectView: gdk.PanelValue = {
        prefab: "view/act/prefab/catcher/AdvCatcherSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    /**漫灵 超级viP界面*/
    MLSuperVipView: gdk.PanelValue = {
        prefab: "view/main/prefab/MLSuperVipView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }
    /**漫灵 超级viP界面2*/
    MLSuperVipView2: gdk.PanelValue = {
        prefab: "view/main/prefab/MLSuperVipView2",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }
    /**漫灵 超级viP界面3*/
    MLSuperVipView3: gdk.PanelValue = {
        prefab: "view/main/prefab/MLSuperVipView3",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    /**漫灵 超级viP界面4*/
    MLSuperVipView4: gdk.PanelValue = {
        prefab: "view/main/prefab/MLSuperVipView4",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }
    /**漫灵 超级viP界面5*/
    MLSuperVipView5: gdk.PanelValue = {
        prefab: "view/main/prefab/MLSuperVipView5",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }



    /**冰狐 超级viP界面*/
    SuperVipView: gdk.PanelValue = {
        prefab: "view/main/prefab/SuperVipView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    /**冰狐 超级viP 客服QQ界面*/
    SuperVipCopyView: gdk.PanelValue = {
        prefab: "view/main/prefab/SuperVipCopyView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }


    /**奇趣商城*/
    SubAdvStoreView: gdk.PanelValue = {
        prefab: "view/act/prefab/store/SubAdvStoreView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**奇趣娃娃机*/
    AdvCatcherView: gdk.PanelValue = {
        prefab: "view/act/prefab/catcher/AdvCatcherView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**跨服充值*/
    CrossRechargeView: gdk.PanelValue = {
        prefab: "view/act/prefab/crossRecharge/CrossRechargeView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }


    /**新幸运扭蛋 主界面*/
    LuckyTwistMain: gdk.PanelValue = {
        prefab: "view/act/prefab/luckyTwist/LuckyTwistMain",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 165,
        isTouchMaskClose: false,
    }

    /**新幸运扭蛋 ---扭蛋活动*/
    LuckyTwistEggPanel: gdk.PanelValue = {
        prefab: "view/act/prefab/luckyTwist/LuckyTwistEggPanel",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**新幸运扭蛋 ---扭蛋许愿*/
    LuckyTwistEggSelectView: gdk.PanelValue = {
        prefab: "view/act/prefab/luckyTwist/LuckyTwistEggSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**新幸运扭蛋 ---限时礼包活动*/
    LuckyTwistGiftPanel: gdk.PanelValue = {
        prefab: "view/act/prefab/luckyTwist/LuckyTwistGiftPanel",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    ///////////////////////////////////////////wechatgame
    /**添加到小程序 */
    AddMiniProgramPanel: gdk.PanelValue = {
        prefab: "view/act/prefab/wechat/AddMiniProgramView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false,
    }

    /**关注有礼 */
    FollowGroupPanel: gdk.PanelValue = {
        prefab: "view/act/prefab/wechat/FollowGroupView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false,
    }

    /**小程序专属活动 */
    WxExclusiveGiftPanel: gdk.PanelValue = {
        prefab: "view/act/prefab/wechat/exclusiveGift/WxExclusiveGiftView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false,
    }

    /**小程序活动整合界面 */
    WxActivityMainView: gdk.PanelValue = {
        prefab: "view/act/prefab/wechat/WxActivityMainView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    /**小程序邀请活动 */
    WxShareGiftPanel: gdk.PanelValue = {
        prefab: "view/act/prefab/wechat/shareGift/ShareGiftsView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }
    /**小程序好友助力活动 */
    WxFriendGiftPanel: gdk.PanelValue = {
        prefab: "view/act/prefab/wechat/shareGift/FriendGiftView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }
    /**小程序迎新邀请活动 */
    WxNewShareGiftPanel: gdk.PanelValue = {
        prefab: "view/act/prefab/wechat/shareGift/NewShareGiftsView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }
    /**小程序分享红包活动 */
    WxRedPacketPanel: gdk.PanelValue = {
        prefab: "view/act/prefab/wechat/redPacket/RedPacketView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }
    /**小程序充值返利活动 */
    WxRebatePanel: gdk.PanelValue = {
        prefab: "view/act/prefab/wechat/rebateGift/RebateView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }
    /**小程序成长大礼活动 */
    WxGrowGiftPanel: gdk.PanelValue = {
        prefab: "view/act/prefab/wechat/growGift/GrowGiftView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }
    /**小程序成长豪礼活动 */
    WxAdvGrowGiftPanel: gdk.PanelValue = {
        prefab: "view/act/prefab/wechat/growGift/AdvGrowGiftView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }
    ///////////////////////////////////////////view/lottery
    Lottery: gdk.PanelValue = {
        prefab: "view/lottery/prefab/LotteryView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    LotteryWeight: gdk.PanelValue = {
        prefab: "view/lottery/prefab/LotteyWeightView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
        isKeep: true,
        isNoExclusive: true,
    }

    LotteryCredit: gdk.PanelValue = {
        prefab: "view/lottery/prefab/LotteryCreditView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
        isKeep: true,
        isNoExclusive: true,
    }

    /**基因界面 */
    GeneView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/gene/GeneView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    /**装备召唤 */
    EquipLotteryView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/gene/EquipLotteryView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
        isKeep: true,
        isNoExclusive: true,
    }

    /**装备召唤概率界面 */
    EquipWeightView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/gene/EquipWeightView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    /**专属装备图鉴 */
    UniqueBookView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/gene/UniqueBookView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
        isKeep: true,
        isNoExclusive: true,
    }

    /**专属装备心愿单 */
    UniqueWishListView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/gene/UniqueWishListView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    /**基因抽奖界面 */
    GeneLotteryView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/gene/GeneLotteryView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
        isKeep: true,
        isNoExclusive: true,
    }

    /**基因抽奖结果 */
    GeneLotteryEffect: gdk.PanelValue = {
        prefab: "view/lottery/prefab/gene/GeneLotteryEffectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    /**基因转换界面 */
    GeneTransView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/gene/GeneTransView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    /**基因卡池概率界面 */
    GeneWeightView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/gene/GeneWeightView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    /**基因商店界面 */
    GeneStoreView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/gene/GeneStoreView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
        isKeep: true,
        isNoExclusive: true,
    }

    // HeroConvert: gdk.PanelValue = {
    //     prefab: "view/lottery/prefab/HeroConvertView",
    //     module: [],
    //     isPopup: true,
    //     isMask: true,
    //     maskAlpha: 180,
    //     isTouchMaskClose: true,
    // }

    HeroBook: gdk.PanelValue = {
        prefab: "view/lottery/prefab/HeroBookView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    EquipBook: gdk.PanelValue = {
        prefab: "view/lottery/prefab/EquipBookView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 查看图鉴英雄信息
    HeroDetail: gdk.PanelValue = {
        prefab: "view/lottery/prefab/HeroDetailView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    // 查看英雄技能
    HeroDetailSkill: gdk.PanelValue = {
        prefab: "view/lottery/prefab/HeroDetailSkill",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //英雄主界面
    HeroResetView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/reset/HeroResetView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }


    //英雄重置子界面
    HeroResetPanel: gdk.PanelValue = {
        prefab: "view/lottery/prefab/reset/HeroResetPanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }
    //英雄综合界面
    HeroSumupView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/reset/HeroSumupView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }
    //守护者综合界面
    GuardianSumupView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/reset/GuardianSumupView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }
    //符文综合界面
    RuneSumupView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/reset/RuneSumupView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }
    //神装综合界面
    CostumeSumupView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/reset/CostumeSumupView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }
    //能量石综合界面
    EnergyStoneSumupView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/reset/EnergyStoneSumupView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //专属装备综合界面
    UniqueEquipSumupView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/reset/UniqueEquipSumupView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //英雄回退界面
    HeroGoBackView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/reset/HeroGoBackView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //英雄回退界面
    HeroGoBackHeroListView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/reset/HeroGoBackHeroListView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //英雄重生界面
    HeroRebirthView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/reset/HeroRebirthView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //英雄重生英雄列表界面
    HeroRebirthHeroListView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/reset/HeroRebirthHeroListView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    //英雄重生英雄预览列表界面
    HeroRebirthHeroListPreview: gdk.PanelValue = {
        prefab: "view/lottery/prefab/reset/HeroRebirthHeroListPreview",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //重置确认
    HeroResetCheck: gdk.PanelValue = {
        prefab: "view/lottery/prefab/reset/HeroResetCheck",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //批量重置
    HeroAllResetView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/reset/HeroAllResetView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //英雄分解子界面
    HeroDecomposePanel: gdk.PanelValue = {
        prefab: "view/lottery/prefab/reset/HeroDecomposePanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }


    ///////////////////////////////////////////view/mail
    // 邮件界面
    Mail: gdk.PanelValue = {
        prefab: "view/mail/prefab/MailView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // 邮件详情界面
    MailInfo: gdk.PanelValue = {
        prefab: "view/mail/prefab/MailInfo",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    ///////////////////////////////////////////view/main
    // 主界面
    MainPanel: gdk.PanelValue = {
        prefab: "view/main/prefab/MainPanel",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        hideMode: gdk.HideMode.DISABLE,
        isKeep: true,
    }
    // 角色头像、活动图标、右侧快捷按钮等界面集合
    MainTopInfoView: gdk.PanelValue = {
        prefab: "view/main/prefab/MainTopInfoView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
        zIndex: -1,
        isKeep: true,
        isNoExclusive: true,
    }
    // 主界面下方按钮栏
    MainDock: gdk.PanelValue = {
        prefab: "view/main/prefab/Dock",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
        zIndex: -1,
        isKeep: true,
        isNoExclusive: true,
    }

    //碎片合成提示窗口
    MainComposeTip: gdk.PanelValue = {
        prefab: "view/main/prefab/MainComposeTip",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 主界面设置界面
    MainSet: gdk.PanelValue = {
        prefab: "view/main/prefab/MainSet",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 主界面设置界面荣耀展示Tips
    MainSetHonorTips: gdk.PanelValue = {
        prefab: "view/main/prefab/MainSetHonorTips",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // 主界面设置界面守护者详情界面
    MainSetGuardianInfoTip: gdk.PanelValue = {
        prefab: "view/main/prefab/MainSetGuardianInfoTip",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // 主界面设置界面英雄详情界面
    MainSetHeroInfoTip: gdk.PanelValue = {
        prefab: "view/main/prefab/MainSetHeroInfoTip",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // 主界面设置界面英雄详情界面
    MainSetHeroAttrInfoTip: gdk.PanelValue = {
        prefab: "view/main/prefab/MainSetHeroAttrInfoTip",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 120,
        isTouchMaskClose: true,
    }
    // 主界面设置界面英雄详情界面
    MainSetSkillsInfoTip: gdk.PanelValue = {
        prefab: "view/main/prefab/MainSetSkillsInfoTip",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 120,
        isTouchMaskClose: true,
    }
    // 主界面设置界面守护者装备套装详情界面
    MainSetGuardianEquitSuitTips: gdk.PanelValue = {
        prefab: "view/main/prefab/MainSetGuardianEquitSuitTips",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 120,
        isTouchMaskClose: true,
    }

    // 主界面设置界面
    SettingView: gdk.PanelValue = {
        prefab: "view/main/prefab/SettingView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }


    // 战力提升提示界面
    MainPowerTip: gdk.PanelValue = {
        prefab: "view/main/prefab/PowerTip",
        module: [],
        isPopup: true,
        isMask: false,
        zIndex: 999,
        isNoExclusive: true,
    }

    //头像 头像框切换
    HeadChangeView: gdk.PanelValue = {
        prefab: "view/main/prefab/HeadChangeView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //头像框详情
    FrameDetailsView: gdk.PanelValue = {
        prefab: "view/main/prefab/FrameDetailsView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
    }

    //兑换码
    ExchangeCode: gdk.PanelValue = {
        prefab: "view/main/prefab/ExchangeCode",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    // 改名
    ChangeName: gdk.PanelValue = {
        prefab: "view/main/prefab/ChangeName",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    // 收益展示
    MainIncome: gdk.PanelValue = {
        prefab: "view/main/prefab/MainIncomePanel",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    ///////////////////////////////////////////view/map
    //城市地图
    WorldMapView: gdk.PanelValue = {
        prefab: "view/map/prefab/WorldMapView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    //某个城市内关卡地图
    CityMapView: gdk.PanelValue = {
        prefab: "view/map/prefab/CityMapView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //进入某个关卡(普通关卡和精英关卡)
    EnterStageView: gdk.PanelValue = {
        prefab: "view/map/prefab/EnterStageView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    // 本章精英副本开启提示
    TriggerEliterTipsView: gdk.PanelValue = {
        prefab: "view/map/prefab/TriggerEliteTipsView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false,
        isKeep: true,
        isNoExclusive: true,
    }

    //解锁新章节
    MainLineBuildUpgradeEffect: gdk.PanelValue = {
        prefab: "view/map/prefab/MainLineBuildUpgradeEffect",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 150,
        isTouchMaskClose: false,
    }

    ///////////////////////////////////////////view/mastery
    Mastery: gdk.PanelValue = {
        prefab: "view/mastery/prefab/MasteryView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }
    MasteryUp: gdk.PanelValue = {
        prefab: "view/mastery/prefab/MasteryUp",
        module: [],
        isPopup: false,
        isDisableView: true,
        isMask: false,
        isTouchMaskClose: false,
    }
    MHSelect: gdk.PanelValue = {
        prefab: "view/mastery/prefab/MHSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //专精副本
    MasteryInstance: gdk.PanelValue = {
        prefab: "view/mastery/prefab/MasteryInstanceView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    ///////////////////////////////////////////view/pve
    // PVE通用准备界面
    PveReady: gdk.PanelValue = {
        prefab: "view/pve/prefab/PveReadyView",//"view/pve/prefab/ready/PveReadyView2",  
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        hideMode: gdk.HideMode.DISABLE,
        isKeep: true,
    }
    // PVE战斗回放界面
    PveReplay: gdk.PanelValue = {
        prefab: "view/pve/prefab/PveReplayView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }
    // PVE界面
    PveScene: gdk.PanelValue = {
        prefab: "view/pve/prefab/PveSceneView",
        module: ['Pve'],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        hideMode: gdk.HideMode.POOL,
        releaseAtlas: true,
    }
    // PVP设置防御界面
    PvpDefender: gdk.PanelValue = {
        prefab: "view/pve/prefab/PvpdefenderView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        hideMode: gdk.HideMode.POOL,
        isKeep: true,
    }
    // PVE小游戏界面
    PveLittleGameView: gdk.PanelValue = {
        prefab: "view/pve/prefab/PveLittleGameView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        hideMode: gdk.HideMode.POOL,
        isKeep: true,
    }
    // PVE英雄选择界面
    PveSceneHeroSelectPanel: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveHeroSelect",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
        hideMode: gdk.HideMode.POOL,
    }
    // PVE英雄详情界面
    PveSceneHeroDetailPanel: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveHeroDetail",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
        hideMode: gdk.HideMode.POOL,
    }

    // PVE战斗暂停
    PveScenePause: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveScenePause",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 90,
        isTouchMaskClose: false,
        isKeep: true,
    }

    //PVE伤害统计
    DamageStatistics: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveDamageStatistics",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // PVE战斗中英雄详细信息
    PveHeroFightInfo: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveHeroFightInfoPanel",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
        isNoExclusive: true,
    }
    // PVE战斗中英雄详细信息
    PveHeroDetailFightInfo: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveHeroTips",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
        isNoExclusive: true,
    }
    // PVE战斗中英雄穿戴技能详情界面
    PveHeroEquitSkillInfoTip: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveHeroEquitSkillInfoTip",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
        isNoExclusive: true,
    }
    // PVE战斗中英雄穿戴技能详情界面
    PveHeroEquitSkillInfoTip2: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveHeroEquitSkillInfoTip2",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
        isNoExclusive: true,
    }
    // PVE战斗中英雄专属装备技能详情界面
    PveHeroEquitSkillInfoTip3: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveHeroEquitSkillInfoTip3",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
        isNoExclusive: true,
    }
    // PVE战斗中怪物详细信息
    PveEnemyFightInfo: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveEnemyFightInfoPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
        isNoExclusive: true,
    }

    // PVE固定BOSS血条
    PveBossHpBar: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveBossHpBarPopupCtrl",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
        isNoExclusive: true,
    }

    // PVE指挥官解锁技能界面
    PveGeneralComming: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/assist/PveGeneralComming",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
        isKeep: true,
        maskAlpha: 0,
        isNoExclusive: true,
    }
    // PVE 助战来袭预警窗口
    PveAssistComming: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/assist/PveAssistComming",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
        isKeep: true,
        isNoExclusive: true,
    }
    // PVE BOSS来袭预警窗口
    PveBossComming: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/boss/PveBossComming",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
        isKeep: true,
        isNoExclusive: true,
    }
    // PVE 小怪来袭预警窗口
    PveMonsterComming: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/boss/PveMonsterComming",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
        isKeep: true,
        isNoExclusive: true,
    }

    // 强敌来袭特效
    PveBossCommingEffect: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveBossCommingEffect",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
        isKeep: true,
        isNoExclusive: true,
    }

    // 指挥官技能描述
    GeneralSkillDesPanel: gdk.PanelValue = {
        prefab: "view/pve/prefab/skill/general/GeneralSkillDesPanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
        isKeep: true,
        isNoExclusive: true,
        hideMode: gdk.HideMode.POOL,
    }
    ///////////////////////////////////////////view/pvp
    // PVP界面
    PvpScene: gdk.PanelValue = {
        prefab: "view/pvp/prefab/PvpSceneView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        hideMode: gdk.HideMode.POOL,
    }
    // PVP战斗中卡牌详细信息
    PvpCardInfo: gdk.PanelValue = {
        prefab: "view/pvp/prefab/view/PvpCardInfoPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // PVP战斗失败
    PvpDefeat: gdk.PanelValue = {
        prefab: "view/pvp/prefab/view/PvpDefeat",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false,
    }
    // PVP战斗成功
    PvpVectory: gdk.PanelValue = {
        prefab: "view/pvp/prefab/view/PvpVectory",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false,
    }

    PvpBuffDetail: gdk.PanelValue = {
        prefab: "view/pvp/prefab/buff/PvpBuffDetail",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    PvpBuffDescri: gdk.PanelValue = {
        prefab: "view/pvp/prefab/buff/PvpBuffDescri",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }


    ///////////////////////////////////////////view/rank
    // 排行
    Rank: gdk.PanelValue = {
        prefab: "view/rank/prefab/RankView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }


    ///////////////////////////////////////////view/role/prefab2
    /**新英雄界面 ---------------------------------------------------------------------*/
    TurntableDrawView: gdk.PanelValue = {
        prefab: "view/act/prefab/turntable/TurntableDrawView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    /**探宝概率界面 */
    TurntableWeightView: gdk.PanelValue = {
        prefab: "view/act/prefab/turntable/TurntableWeightView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**探宝礼包界面 */
    TurntableGiftView: gdk.PanelValue = {
        prefab: "view/act/prefab/turntable/TurntableGiftView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 设置英雄上阵界面
    RoleSetUpHeroSelector: gdk.PanelValue = {
        prefab: "view/role/prefab2/selector/RoleSetUpHeroSelector",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // 上阵英雄Halo界面
    RoleUpHeroHaloView: gdk.PanelValue = {
        prefab: "view/role/prefab2/selector/RoleUpHeroHaloView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // 上阵英雄快速升级界面
    RoleHeroUpgradeView: gdk.PanelValue = {
        prefab: "view/role/prefab2/common/RoleHeroUpgradeView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 角色界面UI
    Role2: gdk.PanelValue = {
        prefab: "view/role/prefab2/selector/RoleSelector2",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        // hideMode: gdk.HideMode.POOL,
    }
    // 角色信息界面
    RoleView2: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/RoleView2",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }
    // 角色信息装备子界面
    SubEquipPanel2: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/equip/RoleEquipPanel2",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }
    // 角色信息技能子界面
    SubSkillPanel2: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/skill/SkillPanel2",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }
    // 角色信息职业子界面
    SubCareerPanel2: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/career/RoleCareerPanel2",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 英雄评论子界面
    SubHeroCommentPanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/comment/HeroCommentPanel",
        module: [],
        isPopup: true,
        maskAlpha: 225,
        isMask: true,
        isTouchMaskClose: true,
    }

    //神装子界面
    SubRoleCostumePanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/costume/RoleCostume",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //英雄觉醒子界面
    SubHeroAwakePanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/awake/HeroAwakePanel",
        module: [],
        isPopup: true,
        maskAlpha: 225,
        isMask: true,
        isTouchMaskClose: true,
    }

    //英雄觉醒 预览
    HeroAwakePreView: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/awake/HeroAwakePreView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //英雄觉醒 成功界面
    HeroAwakeSuccess: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/awake/HeroAwakeSuccess",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    //基因链接界面
    GeneConnectView: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/geneConnect/GeneConnectView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    //基因链接结果界面
    GeneConResultView: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/geneConnect/GeneConResultView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //基因链接英雄选择界面
    GeneConHeroSelectView: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/geneConnect/GeneConHeroSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //基因链接二次弹窗界面
    GeneConConfirmView: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/geneConnect/GeneConConfirmView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //神秘者 技能领悟界面
    MysticHeroSkillAwakeView: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/geneConnect/MysticHeroSkillAwakeView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //神秘者 技能领悟材料选择界面
    MysticSkillMaterialsSelectView: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/geneConnect/MysticSkillMaterialsSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //神秘者 技能领悟成功界面
    MysticSkillUpTips: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/geneConnect/MysticSkillUpTips",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //神秘者 技能领悟等级界面
    MysticTotalSkillLvView: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/geneConnect/MysticTotalSkillLvView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //神装tips
    CostumeTips: gdk.PanelValue = {
        prefab: "view/role/prefab2/costume/CostumeTips",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //神装强化
    CostumeStrengthenPanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/costume/CostumeStrengthenPanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //神装分解
    CostumeDecomposePanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/costume/CostumeDecomposePanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //神装选择
    CostumeSelect: gdk.PanelValue = {
        prefab: "view/role/prefab2/costume/CostumeSelect",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //神装属性详情
    CostumeAttrTips: gdk.PanelValue = {
        prefab: "view/role/prefab2/costume/CostumeAttrTips",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    // 神装定制主界面
    CostumeCustomMain: gdk.PanelValue = {
        prefab: "view/act/prefab/costumeCustom/CostumeCustomMain",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 神装定制礼包界面
    CostumeCustomGiftView: gdk.PanelValue = {
        prefab: "view/act/prefab/costumeCustom/CostumeCustomGiftView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 神装定制界面
    CostumeCustomView: gdk.PanelValue = {
        prefab: "view/act/prefab/costumeCustom/CostumeCustomView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 神装定制选择界面
    CostumeCustomSelectView: gdk.PanelValue = {
        prefab: "view/act/prefab/costumeCustom/CostumeCustomSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 神装定制预览界面
    CostumeCustomRandomTipsView: gdk.PanelValue = {
        prefab: "view/act/prefab/costumeCustom/CostumeCustomRandomTips",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    //英雄置换
    HeroTransFormView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/transform/HeroTransFormView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 英雄置换材料选择界面
    HeroTransMaterialsView: gdk.PanelValue = {
        prefab: "view/lottery/prefab/transform/HeroTransMaterialsView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    // 符文详情界面
    RuneInfo: gdk.PanelValue = {
        prefab: "view/role/prefab2/rune/RuneInfoView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    // 符文选择界面
    RuneSelect: gdk.PanelValue = {
        prefab: "view/role/prefab2/rune/RuneSelect",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    // 符文选择界面
    RuneSelectNew: gdk.PanelValue = {
        prefab: "view/role/prefab2/rune/RuneSelectNew",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    // 符文技能图鉴界面
    RuneSkillBookView: gdk.PanelValue = {
        prefab: "view/role/prefab2/rune/RuneSkillBookView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    // 符文技能详情界面
    RuneSkillDetail: gdk.PanelValue = {
        prefab: "view/role/prefab2/rune/RuneSkillDetailView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
    }

    // 符文帮助界面
    RunSkillHelp: gdk.PanelValue = {
        prefab: "view/role/prefab2/rune/RuneSkillHelpView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
    }

    //符文分解子界面
    RuneDecomposePanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/rune/RuneDecomposePanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //符文背包分解界面
    RuneBagDecompose: gdk.PanelValue = {
        prefab: "view/role/prefab2/rune/RuneBagDecomposeView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //符文合成材料选择界面
    RuneMaterialsSelectView: gdk.PanelValue = {
        prefab: "view/role/prefab2/rune/RuneMaterialsSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //符文合成
    RuneMergePanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/rune/RuneMergePanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //符文强化
    RuneStrengthenPanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/rune/RuneStrengthenPanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //符文功能主界面
    RuneMainPanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/rune/RuneMainView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //符文融合
    RuneMixPanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/rune/RuneMixView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //符文洗练
    RuneClearPanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/rune/RuneClearView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //符文洗练结果
    RuneClearResultPanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/rune/RuneClearResultView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //符文融合材料选择界面
    RuneMixMaterialsSelectView: gdk.PanelValue = {
        prefab: "view/role/prefab2/rune/RuneMixMaterialsSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 选择装备UI
    EquipSelect2: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/equip/EquipSelect2",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    // 士兵界面
    RoleSoldierPanel2: gdk.PanelValue = {
        prefab: "view/role/prefab2/soldier/RoleSoldierPanel2",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    //技能面板，单个技能详情
    SkillInfoPanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/skill/SkillInfoPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
        maskAlpha: 0,
    }
    //天赋技能面板，单个技能详情
    GiftSkillInfoPanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/skill/GiftSkillInfoPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
        maskAlpha: 0,
    }

    //装备合成
    EquipMergePanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/equip/merge/EquipMergePanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //技能面板，单个技能详情
    EquipMergeCheck: gdk.PanelValue = {
        prefab: "view/role/prefab2/equip/merge/EquipMergeCheckPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //指挥官技能tip
    CommanderSkillTip: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/skill/CommanderSkillTip",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
        maskAlpha: 0,
    }

    // 转职界面
    ChangeCareerPanel2: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/career/ChangeCareerPanel2",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false,
    }

    // 职业进阶提示窗口
    CareerAdvanceTipCtrl2: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/career/CareerAdvanceTipPanel2",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 230,
        isTouchMaskClose: true,
    }

    // 进阶技能提示
    RoleUpgradeSkillEffect: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/career/RoleUpgradeSkillEffect",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 230,
        isTouchMaskClose: true,
    }

    // 装备信息界面
    EquipView2: gdk.PanelValue = {
        prefab: "view/role/prefab2/equip/EquipView2",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    EquipInlayPanel2: gdk.PanelValue = {
        prefab: "view/role/prefab2/equip/inlay/EquipInlayPanel2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
        maskAlpha: 0,
    }

    // 装备镶嵌选择界面
    EquipInlayBagView2: gdk.PanelValue = {
        prefab: "view/role/prefab2/equip/inlay/EquipInlayBagView2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 英雄升星成功特效
    HeroComposeView: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/star/HeroComposePanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 英雄升星
    StarUpdateView: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/star/StarUpdateView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    // 英雄升星材料选择
    MaterialsSelectView: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/star/MaterialsSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 204,
        isTouchMaskClose: true,
    }

    // 英雄升星成功特效
    StarUpdateSuccess2: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/star/StarUpdateSuccess2",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 204,
        isTouchMaskClose: false,
    }

    //阵营-英雄列表界面
    GroupHeroList: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/camp/GroupHeroListView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 转职界面窗口
    ChangeJob: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/career/ChangeJob",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true
    }

    //职业精通属性统计面板
    CareerMasterPanel2: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/career/CareerMasterPanel2",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true
    }


    // 转职成功窗口
    ChangeJobResult: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/career/ChangeJobResult",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false,
    }

    //阵营-英雄详情界面
    GroupHeroInfo: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/camp/GroupHeroInfo",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //英雄-精英属性界面
    RoleEliteAttTips: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/common/RoleEliteAttTips",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 角色技能提示UI
    RoleSkillTips: gdk.PanelValue = {
        prefab: "view/role/prefab2/common/RoleSkillTips",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }


    // 查看英雄信息
    LookHeroView: gdk.PanelValue = {
        prefab: "view/role/prefab2/lookHero/LookHeroView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    // 查看英雄技能
    LookHeroSkill: gdk.PanelValue = {
        prefab: "view/role/prefab2/lookHero/LookHeroSkill",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 查看英雄装备
    LookHeroEquip: gdk.PanelValue = {
        prefab: "view/role/prefab2/lookHero/LookHeroEquip",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 查看英雄神装
    LookHeroCostume: gdk.PanelValue = {
        prefab: "view/role/prefab2/lookHero/LookHeroCostume",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //英雄升阶
    RoleUpgradePanel2: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/career/RoleUpgradePanel2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    //英雄转职
    RoleChangeCareer2: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/career/RoleChangeCareer2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    ///////////////////////////////////////////view/sign
    Sign: gdk.PanelValue = {
        prefab: "view/sign/prefab/SignView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    ///////////////////////////////////////////view/mercenary 雇佣兵系统
    MercenarySetView: gdk.PanelValue = {
        prefab: "view/mercenary/prefab/MercenarySetView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    MercenarySetCheck: gdk.PanelValue = {
        prefab: "view/mercenary/prefab/MercenarySetCheck",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    MercenaryGetView: gdk.PanelValue = {
        prefab: "view/mercenary/prefab/MercenaryGetView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    MercenaryGetCheck: gdk.PanelValue = {
        prefab: "view/mercenary/prefab/MercenaryGetCheck",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    ///////////////////////////////////////////view/store
    //月卡特权展示
    MonthCard: gdk.PanelValue = {
        prefab: "view/store/prefab/MonthCard",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //月卡激活购买基金提示
    MonthCardTipPanel: gdk.PanelValue = {
        prefab: "view/store/prefab/monthcard/MonthCardTipPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //商店物品购买详情
    StoreItemBuy: gdk.PanelValue = {
        prefab: "view/store/prefab/StoreItemBuy",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //通用商店物品购买详情
    CommonStoreBuy: gdk.PanelValue = {
        prefab: "view/store/prefab/CommonStoreBuy",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 贸易港(通行证/成长基金)
    TradingPort: gdk.PanelValue = {
        prefab: "view/store/prefab/tradingPort/TradingPortView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }

    // 通行证界面
    PassPort: gdk.PanelValue = {
        prefab: "view/store/prefab/passPort/PassPortView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 成长基金界面
    GrowthFunds: gdk.PanelValue = {
        prefab: "view/store/prefab/growthFunds/GrowthFundsView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 超值基金界面
    GoodFunds: gdk.PanelValue = {
        prefab: "view/store/prefab/growthFunds/GoodFundsView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 超值基金界面
    BetterFunds: gdk.PanelValue = {
        prefab: "view/store/prefab/growthFunds/BetterFundsView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }
    // 试练塔基金界面
    TowerFunds: gdk.PanelValue = {
        prefab: "view/store/prefab/growthFunds/TowerFundsView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //基金汇总界面
    FundsView: gdk.PanelValue = {
        prefab: "view/store/prefab/tradingPort/FundsView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //基金购买预览界面
    FundsBuyPreView: gdk.PanelValue = {
        prefab: "view/store/prefab/growthFunds/FundsBuyPreView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //7天活动限时商店
    SevenDaysStore: gdk.PanelValue = {
        prefab: "view/task/prefab/SevenDaysStoreView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    //7天活动奖励预览界面
    SevenDaysRewardsPre: gdk.PanelValue = {
        prefab: "view/task/prefab/SevenDaysRewardsPreView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    // 通行证购买界面
    BuyPassPort: gdk.PanelValue = {
        prefab: "view/store/prefab/passPort/PassPortBuyView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 特惠周卡界面
    WeeklyPassPort: gdk.PanelValue = {
        prefab: "view/store/prefab/weeklyPassport/WeeklyPassPortView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 特惠周卡购买界面
    BuyWeeklyPassPort: gdk.PanelValue = {
        prefab: "view/store/prefab/weeklyPassport/WeeklyPassPortBuyView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //一元礼包
    OneDollarGift: gdk.PanelValue = {
        prefab: "view/store/prefab/oneDollarGift/OneDollarGiftView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 一元礼包购买界面
    BuyOneDollarGift: gdk.PanelValue = {
        prefab: "view/store/prefab/oneDollarGift/OneDollarGiftBuyView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    Store: gdk.PanelValue = {
        prefab: "view/store/prefab/StoreView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 礼包购买
    GiftBuy: gdk.PanelValue = {
        prefab: "view/store/prefab/GiftBuyView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 首充广告
    FirstPayGift: gdk.PanelValue = {
        prefab: "view/store/prefab/FirstPayGiftView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
        isKeep: true,
    }

    // 限时礼包
    LimitGiftView: gdk.PanelValue = {
        prefab: "view/store/prefab/LimitGiftView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 限时礼包(战斗结算触发的)
    LimitActGiftView: gdk.PanelValue = {
        prefab: "view/act/prefab/limitGift/LimitActGiftView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 升星限时礼包
    StarPushGiftView: gdk.PanelValue = {
        prefab: "view/store/prefab/starPushGift/StarPushGiftView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    //////////////view/act/linkGame
    // 幸运连连看主界面
    LinkGameMain: gdk.PanelValue = {
        prefab: "view/act/prefab/linkGame/LinkGameMain",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 幸运连连看界面
    LinkGameView: gdk.PanelValue = {
        prefab: "view/act/prefab/linkGame/LinkGameView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 幸运连连看礼包界面
    LinkGameGiftView: gdk.PanelValue = {
        prefab: "view/act/prefab/linkGame/LinkGameGiftView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //////////////view/pieces
    // 末日自走棋主界面
    PiecesMain: gdk.PanelValue = {
        prefab: "view/pieces/prefab/PiecesMainView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 末日自走棋无尽模式
    PiecesEndlessView: gdk.PanelValue = {
        prefab: "view/pieces/prefab/PiecesEndlessView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 末日自走棋自走棋模式
    PiecesChessView: gdk.PanelValue = {
        prefab: "view/pieces/prefab/PiecesChessView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 末日自走棋天赋界面
    PiecesTalentView: gdk.PanelValue = {
        prefab: "view/pieces/prefab/PiecesTalentView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 末日自走棋段位奖励界面
    PiecesRankRewardView: gdk.PanelValue = {
        prefab: "view/pieces/prefab/PiecesRankRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 末日自走棋天赋激活界面
    PiecesTalentActiveView: gdk.PanelValue = {
        prefab: "view/pieces/prefab/PiecesTalentActiveView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 末日自走棋天赋详情界面
    PiecesTalentInfoView: gdk.PanelValue = {
        prefab: "view/pieces/prefab/PiecesTalentInfoView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }
    // 末日自走棋羁绊详情界面
    PvePiecesFetterView: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/pieces/PvePiecesFetterView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 末日自走棋英雄购买界面
    PvePiecesHeroSelectView: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/pieces/PvePiecesHeroSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 末日自走棋英雄升星提示界面
    PvePiecesUpStarNoticeView: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/pieces/PvePiecesUpStarNoticeView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 末日自走棋英雄列表界面
    PvePiecesHeroListView: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/pieces/PvePiecesHeroListView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 末日自走棋英雄详情界面
    PvePiecesHeroDetailView: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/pieces/PvePiecesHeroDetailView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 末日自走棋英雄详情技能界面
    PvePiecesHeroDetailSkill: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/pieces/PvePiecesHeroDetailSkill",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 末日自走棋英雄职业转换
    PvePiecesChageCareerView: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/pieces/PvePiecesChangeCareerView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 末日自走棋棋盘等级
    PvePiecesChessLvView: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/pieces/PvePiecesChessLvView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 末日自走棋棋盘等级预览界面
    PvePiecesChessLvPreView: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/pieces/PvePiecesChessLvPreView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    //////////////view/act/awakeStarUp
    // 专属英雄升星界面
    AwakeStarUpView: gdk.PanelValue = {
        prefab: "view/act/prefab/awakeStarUp/AwakeStarUpView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 专属英雄升星选择界面
    AwakeStarUpSelectView: gdk.PanelValue = {
        prefab: "view/act/prefab/awakeStarUp/AwakeStarUpSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    //////////////view/act/cave
    // 矿洞大冒险主界面
    CaveMain: gdk.PanelValue = {
        prefab: "view/act/prefab/Cave/prefab/CaveMain",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 矿洞大冒险界面
    CaveView: gdk.PanelValue = {
        prefab: "view/act/prefab/Cave/prefab/CaveView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 矿洞大冒险礼包界面
    CaveGiftView: gdk.PanelValue = {
        prefab: "view/act/prefab/Cave/prefab/CaveGiftView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 矿洞大冒险地图界面
    CaveMapView: gdk.PanelValue = {
        prefab: "view/act/prefab/Cave/prefab/CaveMapView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    // 矿洞大冒险任务界面
    CaveTaskView: gdk.PanelValue = {
        prefab: "view/act/prefab/Cave/prefab/CaveTaskView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }


    ///////////////////////////////////////////view/task
    // 任务界面
    Task: gdk.PanelValue = {
        prefab: "view/task/prefab/TaskView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }

    //在线奖励
    OnlineRewardPanel: gdk.PanelValue = {
        prefab: "view/task/prefab/OnlineRewardPanel",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    GrowMenuView: gdk.PanelValue = {
        prefab: "view/task/prefab/GrowMenuView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    // 生存秘籍图标界面
    GrowTaskBtnView: gdk.PanelValue = {
        prefab: "view/task/prefab/GrowTaskBtnView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
        zIndex: -10,
        isKeep: true,
        isNoExclusive: true,
    }

    //成长任务
    GrowTaskView: gdk.PanelValue = {
        prefab: "view/task/prefab/GrowTaskView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    GrowGetSkill: gdk.PanelValue = {
        prefab: "view/task/prefab/GrowGetSkill",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    GrowPreReward: gdk.PanelValue = {
        prefab: "view/task/prefab/GrowPreReward",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //7天活动
    SevenDays: gdk.PanelValue = {
        prefab: "view/task/prefab/SevenDaysView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 225,
        isTouchMaskClose: true,
    }

    // 酒馆界面
    TavernPanel: gdk.PanelValue = {
        prefab: "view/task/prefab/tavern/TavernPanel",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }

    //酒馆任务刷新界面
    TavernRefreshView: gdk.PanelValue = {
        prefab: "view/task/prefab/tavern/TavernRefreshView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    //酒馆升级界面
    TavernUpdateView: gdk.PanelValue = {
        prefab: "view/task/prefab/tavern/TavernUpdateView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    //酒馆任务派遣界面
    TavernSendView: gdk.PanelValue = {
        prefab: "view/task/prefab/tavern/TavernSendView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    //酒馆任务英雄选择界面
    TavernHeroSelectView: gdk.PanelValue = {
        prefab: "view/task/prefab/tavern/TavernHeroSelectView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    //酒馆收益明细
    TavernDetailPanel: gdk.PanelValue = {
        prefab: "view/task/prefab/tavern/TavernDetailPanel",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 0,
        isTouchMaskClose: true,
    }

    //酒馆特权购买界面
    TavernTQBuyView: gdk.PanelValue = {
        prefab: "view/task/prefab/tavern/TavernTQBuyView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    //评分系统
    ScoreSytemView: gdk.PanelValue = {
        prefab: "view/task/prefab/scoreSystem/ScoreSystemView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    ScoreSysBqPanel: gdk.PanelValue = {
        prefab: "view/task/prefab/scoreSystem/ScoreSysBqPanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    ScoreSysWtPanel: gdk.PanelValue = {
        prefab: "view/task/prefab/scoreSystem/ScoreSysWtPanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    ScoreSysHeroZrPanel: gdk.PanelValue = {
        prefab: "view/task/prefab/scoreSystem/ScoreSysHeroZrPanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    ScoreSysZyPanel: gdk.PanelValue = {
        prefab: "view/task/prefab/scoreSystem/ScoreSysZyPanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    ScoreSysBqPreView: gdk.PanelValue = {
        prefab: "view/task/prefab/scoreSystem/ScoreSysBqPreView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 觉醒礼包界面
    HeroAwakeGiftView: gdk.PanelValue = {
        prefab: "view/store/prefab/heroAwakeGift/HeroAwakeGiftView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }


    // 主线吕布大礼包
    MainLineGiftView: gdk.PanelValue = {
        prefab: "view/task/prefab/MainLineGiftView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 主线吕布展示界面
    MainLineShowHero: gdk.PanelValue = {
        prefab: "view/task/prefab/MainLineShowHero",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //////////////////////////////////champion
    //锦标赛排行榜
    ChampionRankView: gdk.PanelValue = {
        prefab: "view/champion/prefab/ChampionRankView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //锦标赛战斗记录
    ChampionReportView: gdk.PanelValue = {
        prefab: "view/champion/prefab/ChampionReportView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //锦标赛积分兑换
    ChampionExchangeView: gdk.PanelValue = {
        prefab: "view/champion/prefab/ChampionExchangeView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //锦标赛段位奖励
    ChampionGradeView: gdk.PanelValue = {
        prefab: "view/champion/prefab/ChampionGradeView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //锦标赛竞猜界面
    ChampionGuessView: gdk.PanelValue = {
        prefab: "view/champion/prefab/ChampionGuessView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    //锦标赛下注界面
    ChampionBetView: gdk.PanelValue = {
        prefab: "view/champion/prefab/ChampionBetView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //锦标赛竞猜记录
    ChampionGuessReportView: gdk.PanelValue = {
        prefab: "view/champion/prefab/ChampionGuessReportView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //锦标赛竞猜结果
    ChampionGuessResultView: gdk.PanelValue = {
        prefab: "view/champion/prefab/ChampionGuessResultView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
        isKeep: true,
        isNoExclusive: true,
    }

    ///////////////////////////////////////////view/Adventure
    //探险主界面
    AdventureMainView: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdventureMainView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    //增益遗物列表
    AdventureEntryList: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdventureEntryList",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //主界面泉水回复
    AdventureMainResume: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdventureMainResume",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //指挥官死亡复活提示
    AdventureGeneralDieTip: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdventureGeneralDieTip",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //恭喜通关
    AdventureFinishTip: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdventureFinishTip",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //增益遗物选择
    AdvPlateEntryPanel: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdvPlateEntryPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //英雄雇佣
    AdvPlateHirePanel: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdvPlateHirePanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //泉水回复
    AdvPlateResumePanel: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdvPlateResumePanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //关卡战斗
    AdvPlateStagePanel: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdvPlateStagePanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //旅行商人
    AdvPlateTravelPanel: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdvPlateTravelPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //宝藏事件
    AdvPlateTreasurePanel: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdvPlateTreasurePanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //探险英雄上阵
    AdventureSetUpHeroSelector: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdventureSetUpHeroSelector",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //探险入口
    AdventureAccessView: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdventureAccessView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //探险商店
    AdventureStoreView: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdventureStoreView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //探险商店批量购买
    AdventureStoreItemBuyView: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdvStoreItemBuy",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //探险排行榜
    AdventureRankView: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdventureRankView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //探险通行证
    AdventurePassPortView: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdvPassPortView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    //探险通行证购买界面
    AdvPassPortBuyView: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdvPassPortBuyView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //雇佣英雄详情 
    AdvHireHeroDetail: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdvHireHeroDetail",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //雇佣英雄详情 ---技能
    AdvHireHeroSkill: gdk.PanelValue = {
        prefab: "view/adventure/prefab/AdvHireHeroSkill",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //新探险入口
    NewAdventureAccessView: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/NewAdventureAccessView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    ////////////////新奇境探险/////////////////////
    //无尽模式
    NewAdventureMainView: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/NewAdventureMainView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }
    //普通模式
    AdventureMainView2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdventureMainView2",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }
    //关卡战斗
    AdvPlateStagePanel2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdvPlateStagePanel2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //旅行商人
    AdvPlateTravelPanel2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdvPlateTravelPanel2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    //英雄雇佣
    AdvPlateHirePanel2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdvPlateHirePanel2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    //宝藏事件
    AdvPlateTreasurePanel2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdvPlateTreasurePanel2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    //增益遗物选择
    AdvPlateEntryPanel2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdvPlateEntryPanel2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    //主界面泉水回复
    AdventureMainResume2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdventureMainResume2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //指挥官死亡复活提示
    AdventureGeneralDieTip2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdventureGeneralDieTip2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //恭喜通关
    AdventureFinishTip2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdventureFinishTip2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //探险英雄上阵
    AdventureSetUpHeroSelector2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdventureSetUpHeroSelector2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    //随机事件
    AdvPlateRandomEventPanel2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdvPlateRandomEventPanel2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    //存档事件
    AdvPlateSavePanel2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdvPlateSavePanel2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**新奇境探险英雄信息 */
    AdvHeroDetailView2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdventureHeroDetailView2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }
    /**新奇境探险英雄技能信息 */
    AdvHeroDetailSkill2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdventureHeroDetailSkill2",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //新奇境探险增益遗物列表
    AdventureEntryList2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdventureEntryList2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //新奇境探险探险通行证
    AdventurePassPortView2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdvPassPortView2",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    //新奇境探险探险通行证购买界面
    AdvPassPortBuyView2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdvPassPortBuyView2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    //探险英雄上阵(无尽模式)
    NewAdventureSetUpHeroSelector: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/NewAdventureSetUpHeroSelector",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    //探险排行榜
    AdventureRankView2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdventureRankView2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    //探险遗物兑换
    NewAdventureEntryListView: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/NewAdventureEntryListView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //新奇境探险难度奖励
    NewAdventureStageRewardView: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/NewAdventureStageRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //关卡扫荡
    AdventureRaidTip2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdventureRaidTip2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //探险礼包
    AdventureGiftView2: gdk.PanelValue = {
        prefab: "view/adventure2/prefab/AdventureGiftView2",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }


    ///////////////////////////////////////////view/tips
    //7天活动
    HelpTipsPanel: gdk.PanelValue = {
        prefab: "view/tips/prefab/HelpTipsPanel",
        module: [],
        isPopup: true,
        isMask: true,
        // maskAlpha: 180,
        isTouchMaskClose: true,
    }

    // //英雄合成
    // SynthesisPanel: gdk.PanelValue = {
    //     prefab: "view/lottery/prefab/SynthesisPanel",
    //     module: [],
    //     isPopup: true,
    //     isMask: true,
    //     maskAlpha: 255,
    //     isTouchMaskClose: false,
    //     isDisableView: true
    // }

    //战斗失败提升tip 英雄 
    UpgradeHero: gdk.PanelValue = {
        prefab: "view/pve/prefab/upgrade/UpgradeHero",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //战斗失败提升tip 兵营 
    UpgradeBarrack: gdk.PanelValue = {
        prefab: "view/pve/prefab/upgrade/UpgradeBarrack",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //战斗失败提升tip 装备 
    UpgradeEquip: gdk.PanelValue = {
        prefab: "view/pve/prefab/upgrade/UpgradeEquip",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    ReplayView: gdk.PanelValue = {
        prefab: "view/replay/prefab/ReplayView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    //点杀副本雇佣兵技能界面
    MercenaryView: gdk.PanelValue = {
        prefab: "view/instance/prefab/MercenarySkillView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    //点杀副本排行榜界面
    DianshaRankView: gdk.PanelValue = {
        prefab: "view/instance/prefab/DianshaRankView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //伤害统计界面
    DamageStatisticeView: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/DamageStatistice",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // 矿洞大作战入口
    MineCopyActionView: gdk.PanelValue = {
        prefab: "view/act/prefab/MineCopy/MineCopyActionView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // 矿洞大作战
    MineCopyView: gdk.PanelValue = {
        prefab: "view/act/prefab/MineCopy/MineCopyView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }
    // 矿洞大作战兑换界面
    MineExchangeView: gdk.PanelValue = {
        prefab: "view/act/prefab/MineCopy/MineExchangeView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // 矿洞大作战天赋界面
    MineGiftView: gdk.PanelValue = {
        prefab: "view/act/prefab/MineCopy/MineGiftView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    //矿洞大作战探索派遣界面
    MineTansuoSendView: gdk.PanelValue = {
        prefab: "view/act/prefab/MineCopy/MineTansuoSendView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    //矿洞大作战探索英雄选择界面
    MineTansuoHeroSelectView: gdk.PanelValue = {
        prefab: "view/act/prefab/MineCopy/MineTansuoHeroSelectView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }
    //矿洞大作战通行证界面
    MinePassPortView: gdk.PanelValue = {
        prefab: "view/act/prefab/MineCopy/MinePassPortView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }
    //矿洞大作战通行证购买界面
    MinePassPortBuyView: gdk.PanelValue = {
        prefab: "view/act/prefab/MineCopy/MinePassPortBuyView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }
    //矿洞大作战天赋技能详情界面
    MineGiftSkillInfo: gdk.PanelValue = {
        prefab: "view/act/prefab/MineCopy/MineGiftSkillInfo",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }
    // 武魂试炼
    EternalCopyView: gdk.PanelValue = {
        prefab: "view/act/prefab/eternalCopy/EternalCopyView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }
    //限时活动列表
    LimitTimeActivity: gdk.PanelValue = {
        prefab: "view/act/prefab/LimitTimeActivity",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 1,
        isTouchMaskClose: true,
    }

    // 查看奖杯模式英雄信息
    PveCupHeroDetail: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveCupHeroDetailView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    // 英雄试炼入口
    HeroTrialActionView: gdk.PanelValue = {
        prefab: "view/act/prefab/heroTrial/HeroTrialView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 英雄试炼入口
    HeroTrialMonsterView: gdk.PanelValue = {
        prefab: "view/act/prefab/heroTrial/HeroTrialMonsterView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: false,
    }

    // 英雄试炼设置英雄上阵界面
    HeroTrialSetUpHeroSelector: gdk.PanelValue = {
        prefab: "view/act/prefab/heroTrial/HeroTrialSetUpHeroSelector",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // 英雄试炼排行榜
    HeroTrialRankView: gdk.PanelValue = {
        prefab: "view/act/prefab/heroTrial/HeroTrialRankView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // 英雄试炼挑战奖励
    HeroTrialChallengeRewardView: gdk.PanelValue = {
        prefab: "view/act/prefab/heroTrial/HeroTrialChallengeRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // 英雄试炼关卡奖励
    HeroTrialStageRewardView: gdk.PanelValue = {
        prefab: "view/act/prefab/heroTrial/HeroTrialStageRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }


    // 新英雄试炼入口
    NewHeroTrialActionView: gdk.PanelValue = {
        prefab: "view/act/prefab/newHeroTrial/NewHeroTrialView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 新英雄试炼入口
    NewHeroTrialMonsterView: gdk.PanelValue = {
        prefab: "view/act/prefab/newHeroTrial/NewHeroTrialMonsterView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: false,
    }

    // 新英雄试炼排行榜
    NewHeroTrialRankView: gdk.PanelValue = {
        prefab: "view/act/prefab/newHeroTrial/NewHeroTrialRankView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // 新英雄试炼排行榜
    NewHeroTrialDamageView: gdk.PanelValue = {
        prefab: "view/act/prefab/newHeroTrial/NewHeroTrialDamageView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    // 英雄试炼关卡奖励
    NewHeroTrialStageRewardView: gdk.PanelValue = {
        prefab: "view/act/prefab/newHeroTrial/NewHeroTrialStageRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //远航寻宝 
    SailingTreasurePanel: gdk.PanelValue = {
        prefab: "view/act/prefab/sailing/SailingTreasurePanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //远航寻宝 
    SailingCheckView: gdk.PanelValue = {
        prefab: "view/act/prefab/sailing/SailingCheckView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //宝藏旅馆
    HotelTreasureView: gdk.PanelValue = {
        prefab: "view/act/prefab/hotel/HotelTreasureView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    //宝藏旅馆奖励展示
    HotelLayerRewardView: gdk.PanelValue = {
        prefab: "view/act/prefab/hotel/HotelLayerRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //生存训练难度选择界面
    SurvivalSubTypeSetView: gdk.PanelValue = {
        prefab: "view/instance/prefab/survival/SubInstanceSurvivalSelectionView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //生存训练雇佣奖励领取
    InstanceSurvivalHireReward: gdk.PanelValue = {
        prefab: "view/instance/prefab/survival/InstanceSurvivalHireReward",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //生存训练困难模式上阵界面
    SurvivalSetUpHeroSelector: gdk.PanelValue = {
        prefab: "view/instance/prefab/survival/SurvivalSetUpHeroSelector",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //实战演练通关条件详情界面
    PveGateConditionView: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveGateCondition",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //精彩活动  收纳活动图标界面
    StorageActView: gdk.PanelValue = {
        prefab: "view/act/prefab/storageAct/StorageActView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 1,
        isTouchMaskClose: true,
    }

    //七日之战
    SevenDayWarActView: gdk.PanelValue = {
        prefab: "view/act/prefab/sevenDayWar/SevenDayWarActView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    //锦标赛进入界面
    ChampionshipEnterView: gdk.PanelValue = {
        prefab: "view/champion/prefab/ChampionshipEnterView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }
    //锦标赛界面
    ChampionshipView: gdk.PanelValue = {
        prefab: "view/champion/prefab/ChampionshipView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    //锦标赛进入界面
    ChampionshipAttackView: gdk.PanelValue = {
        prefab: "view/champion/prefab/ChampionshipAttackView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //锦标赛晋升奖励界面
    ChampionUpRewardView: gdk.PanelValue = {
        prefab: "view/champion/prefab/ChampionUpRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
        isKeep: true,
        isNoExclusive: true,
    }

    //支援主界面
    SupportMainView: gdk.PanelValue = {
        prefab: "view/resonating/prefab/SupportMainView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    //协战联盟界面
    AssistAllianceView: gdk.PanelValue = {
        prefab: "view/resonating/prefab/AssistAllianceView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //协战联盟英雄选择界面
    AssistAllianceSelectView: gdk.PanelValue = {
        prefab: "view/resonating/prefab/AssistAllianceSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
        isKeep: true,
        isNoExclusive: true,
    }

    //军团界面
    LegionView: gdk.PanelValue = {
        prefab: "view/resonating/prefab/LegionView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //星级专属礼包界面
    AssistStarGiftView: gdk.PanelValue = {
        prefab: "view/resonating/prefab/AssistStarGiftView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //共鸣水晶界面
    ResonatingView: gdk.PanelValue = {
        prefab: "view/resonating/prefab/ResonatingView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    //共鸣水晶选择英雄界面
    ResonatingSelectView: gdk.PanelValue = {
        prefab: "view/resonating/prefab/ResonatingUpHeroSelector",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    //共鸣水晶卸载英雄界面
    ResonatingDownHeroView: gdk.PanelValue = {
        prefab: "view/resonating/prefab/ResonatingDownHeroView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    //共鸣水晶上阵英雄tip
    ResonatingUpHeroTip: gdk.PanelValue = {
        prefab: "view/resonating/prefab/ResonatingUpHeroTip",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //殿堂指挥官
    VaultEnterView: gdk.PanelValue = {
        prefab: "view/vault/prefab/VaultEnterView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }
    //殿堂指挥官挑战界面
    VaultAttackView: gdk.PanelValue = {
        prefab: "view/vault/prefab/VaultAttackView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    //殿堂指挥官挑战记录界面
    VaultAttackListView: gdk.PanelValue = {
        prefab: "view/vault/prefab/VaultAttackListView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    //殿堂指挥官挑战难度选择界面
    VaultSelectView: gdk.PanelValue = {
        prefab: "view/vault/prefab/VaultSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //每日必做界面
    MustDoTaskView: gdk.PanelValue = {
        prefab: "view/task/prefab/mustDo/MustDoTaskView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**跨服狂欢*/
    CServerRankView: gdk.PanelValue = {
        prefab: "view/act/prefab/cServer/CServerRankView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }
    /**跨服狂欢奖励界面*/
    CServerRankRewardView: gdk.PanelValue = {
        prefab: "view/act/prefab/cServer/CServerRankRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**跨服任务*/
    CServerTaskView: gdk.PanelValue = {
        prefab: "view/act/prefab/cServer/CServerTaskView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }
    /**跨服任务本服排行榜*/
    CServerPersonRankView: gdk.PanelValue = {
        prefab: "view/act/prefab/cServer/CServerPersonRankView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**跨服狂欢特权详情*/
    CServerPrivilegeTips: gdk.PanelValue = {
        prefab: "view/act/prefab/cServer/CServerPrivilegeTips",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //跨服狂欢活动整合界面
    CServerActivityMainView: gdk.PanelValue = {
        prefab: "view/act/prefab/cServer/CServerActivityMainView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    // 末日副本界面
    SubInstanceEndRuinView: gdk.PanelValue = {
        prefab: "view/instance/prefab/endRuins/SubInstanceEndRuinsView",
        module: [],
        isPopup: true,
        isDisableView: false,
        isMask: false,
        isTouchMaskClose: false,
    }
    /**末日副本英雄选择界面*/
    EndRuinSetUpHeroSelector: gdk.PanelValue = {
        prefab: "view/instance/prefab/endRuins/EndRuinSetUpHeroSelector",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**末日副本章节奖励界面*/
    EndRuinChapterRewardView: gdk.PanelValue = {
        prefab: "view/instance/prefab/endRuins/EndRuinChapterRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**末日副本每日奖励界面*/
    EndRuinEveryDayTaskView: gdk.PanelValue = {
        prefab: "view/instance/prefab/endRuins/EndRuinEveryDayTaskView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**末日副本章节星星界面*/
    EndRuinStarRewardView: gdk.PanelValue = {
        prefab: "view/instance/prefab/endRuins/EndRuinStarRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**跨服活动列表 */
    CrossActListView: gdk.PanelValue = {
        prefab: "view/crossactlist/prefab/CrossActListView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }

    /**跨服寻宝*/
    CrossTreasureView: gdk.PanelValue = {
        prefab: "view/act/prefab/crossTreasure/CrossTreasureView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 180,
        isTouchMaskClose: false,
    }

    /**跨服寻宝记录界面*/
    CrossTreasureRecordView: gdk.PanelValue = {
        prefab: "view/act/prefab/crossTreasure/CrossTreasureRecordView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**跨服寻宝商城*/
    SubCTreasureStoreView: gdk.PanelValue = {
        prefab: "view/act/prefab/store/SubCTreasureStoreView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**能量站主界面 */
    EnergyStationView: gdk.PanelValue = {
        prefab: "view/energy/prefab/EnergyStationView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    /**能量站操作成功提示界面*/
    EnergySuccView: gdk.PanelValue = {
        prefab: "view/energy/prefab/EnergySuccView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**能量站英雄材料选择界面*/
    EnergyMaterialsView: gdk.PanelValue = {
        prefab: "view/energy/prefab/EnergyMaterialsView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**能量站进阶界面*/
    EnergyAdvanceView: gdk.PanelValue = {
        prefab: "view/energy/prefab/EnergyAdvanceView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**能量站进阶预览界面*/
    EnergyAdvancePreView: gdk.PanelValue = {
        prefab: "view/energy/prefab/EnergyAdvancePreView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**组队竞技场界面 */
    ArenaTeamView: gdk.PanelValue = {
        prefab: "view/arenaTeam/prefab/ArenaTeamView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }

    /**组队竞技场组队大厅界面 */
    ArenaTeamTeamHallView: gdk.PanelValue = {
        prefab: "view/arenaTeam/prefab/TeamHallView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**组队竞技场匹配结果界面 */
    ArenaTeamSeachEnemyView: gdk.PanelValue = {
        prefab: "view/arenaTeam/prefab/ArenaTeamSeachEnemyView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: false,
    }
    /**组队竞技场挑战顺序修改界面 */
    ArenaTeamAttackView: gdk.PanelValue = {
        prefab: "view/arenaTeam/prefab/ArenaTeamAttackView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**组队竞技场挑战记录界面 */
    ArenaTeamRecordView: gdk.PanelValue = {
        prefab: "view/arenaTeam/prefab/ArenaTeamRecordView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**组队竞技场排行榜界面 */
    ArenaTeamRankView: gdk.PanelValue = {
        prefab: "view/arenaTeam/prefab/ArenaTeamRankView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**组队竞技场挑战奖励界面 */
    ArenaTeamChallengeRewardView: gdk.PanelValue = {
        prefab: "view/arenaTeam/prefab/ArenaTeamChallengeRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**荣耀巅峰赛海报界面 */
    ArenahonorPosterView: gdk.PanelValue = {
        prefab: "view/arenahnor/prefab/ArenaHonorPosterView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**荣耀巅峰赛单个公会参赛玩家列表 */
    ArenahonorGuildPlayersView: gdk.PanelValue = {
        prefab: "view/arenahnor/prefab/ArenaHonorGuildPlayersView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**荣耀巅峰赛参赛名单界面 */
    ArenahonorAllParticipantView: gdk.PanelValue = {
        prefab: "view/arenahnor/prefab/ArenaHonorAllParticipantView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**荣耀巅峰赛竞猜记录界面 */
    ArenahonorGuessReportView: gdk.PanelValue = {
        prefab: "view/arenahnor/prefab/ArenaHonorGuessReportView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**巅峰之战界面 */
    PeakView: gdk.PanelValue = {
        prefab: "view/act/prefab/peak/PeakView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }
    /**巅峰之战搜索界面 */
    PeakSearchView: gdk.PanelValue = {
        prefab: "view/act/prefab/peak/PeakSearchView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**巅峰之战搜索界面 */
    PeakSetUpHeroSelector: gdk.PanelValue = {
        prefab: "view/act/prefab/peak/PeakSetUpHeroSelector",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**巅峰之战段位奖励界面 */
    PeakRankRewardView: gdk.PanelValue = {
        prefab: "view/act/prefab/peak/PeakRankRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**巅峰之战挑战奖励界面 */
    PeakChallengeRewardView: gdk.PanelValue = {
        prefab: "view/act/prefab/peak/PeakChallengeRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**巅峰之战段位英雄奖励领取界面 */
    PeakSelectHeroView: gdk.PanelValue = {
        prefab: "view/act/prefab/peak/PeakSelectHeroView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**巅峰之战排行榜界面 */
    PeakRankView: gdk.PanelValue = {
        prefab: "view/act/prefab/peak/PeakRankView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**巅峰之战挑战记录界面 */
    PeakReportView: gdk.PanelValue = {
        prefab: "view/act/prefab/peak/PeakReportView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**巅峰之战英雄列表 */
    PeakHeroListView: gdk.PanelValue = {
        prefab: "view/act/prefab/peak/PeakHeroListView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**巅峰之战英雄列表 */
    PeakDivisionRewardView: gdk.PanelValue = {
        prefab: "view/act/prefab/peak/PeakDivisionRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**巅峰之战英雄信息 */
    PeakHeroDetailView: gdk.PanelValue = {
        prefab: "view/act/prefab/peak/PeakHeroDetailView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }
    /**巅峰之战英雄技能信息 */
    PeakHeroDetailSkill: gdk.PanelValue = {
        prefab: "view/act/prefab/peak/PeakHeroDetailSkill",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }
    /**兵团界面 */
    BYarmyView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/BYarmyView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }
    /**兵团精甲界面 */
    BYarmySkinPanel: gdk.PanelValue = {
        prefab: "view/bingying/prefab/BYarmySkinPanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }
    /**兵团羁绊界面 */
    BYarmyTrammelPanel: gdk.PanelValue = {
        prefab: "view/bingying/prefab/BYarmyTrammelPanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    /**兵团融甲界面 */
    BYarmyResolvePanel: gdk.PanelValue = {
        prefab: "view/bingying/prefab/BYarmyResolvePanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }
    /**兵团精甲解锁Tips */
    BYarmyActivationPanel: gdk.PanelValue = {
        prefab: "view/bingying/prefab/BYarmyActivationPanel",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**兵团精甲详情Tips */
    BYarmySkinInfoPanel: gdk.PanelValue = {
        prefab: "view/bingying/prefab/BYarmySkinInfoPanel",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**兵团精甲穿戴界面 */
    BYarmySetSkinView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/BYarmySetSkinView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**兵团融甲选择材料界面 */
    BYarmyResolveMaterialsView: gdk.PanelValue = {
        prefab: "view/bingying/prefab/BYarmyResolveMaterialsView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    //兵团精甲自主选择礼包--道具开启
    BYarmySkinSelectGift: gdk.PanelValue = {
        prefab: "view/bingying/prefab/BYarmySkinSelectGiftGet",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    /**英雄守护者界面 */
    GuardianView: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/GuardianView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }

    /**英雄守护者许愿池界面 */
    GuardianCallSelectView: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/GuardianCallSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**英雄守护者召唤界面 */
    GuardianCallPanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/GuardianCallPanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    /**英雄守护者召唤物品概率界面 */
    GuardianCallProbabilityView: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/GuardianCallProbabilityView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**英雄守护者列表 */
    GuardianList: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/GuardianList",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**英雄守护者信息 */
    GuardianInfoTip: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/GuardianInfoTip",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**英雄守护者升级界面 */
    GuardianUpgradePanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/GuardianUpgradePanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    /**英雄守护者升星 */
    GuardianStarUp: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/GuardianStarUp",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**英雄守护者升星材料选择 */
    GuardianMaterialsSelectView: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/GuardianMaterialsSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**英雄守护者出战设置 */
    GuardianFightSetView: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/GuardianFightSetView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**英雄守护者分解 */
    GuardianDecomposePanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/GuardianDecomposePanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    /**英雄守护者图鉴 */
    GuardianBookPanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/GuardianBookPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    /**英雄守护者 装备页面 */
    GuardianEquipPanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/equip/GuardianEquipPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    /**英雄守护者 装备操作 主界面 */
    GuardianEquipOperateView: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/equip/GuardianEquipOperateView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    /**英雄守护者 装备操作 强化 */
    GuardianEquipStrengthenPanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/equip/GuardianEquipStrengthenPanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    /**英雄守护者 装备操作 突破 */
    GuardianEquipBreakPanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/equip/GuardianEquipBreakPanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }


    /**英雄守护者  突破 成功*/
    GuardianEquipBreakSuccess: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/equip/GuardianEquipBreakSuccess",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**英雄守护者 星级增加*/
    GuardianEquipStarAddEffect: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/equip/GuardianEquipStarAddEffect",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**装备突破材料选择 */
    GuardianEquipBreakMaterialsSelect: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/equip/GuardianEquipBreakMaterialsSelect",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**英雄守护者 装备 穿戴列表 */
    GuardianEquipSelect: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/equip/GuardianEquipSelect",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**英雄守护者 装备 tips */
    GuardianEquipTips: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/equip/GuardianEquipTips",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**英雄守护者 套装预览界面 */
    GuardianEquipSuitPreView: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/equip/GuardianEquipSuitPreView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    /**英雄守护者 装备总览信息tip */
    GuardianEquipTotalAttrTip: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/equip/GuardianEquipTotalAttrTip",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }


    /**英雄守护者 装备分解界面*/
    GuardianEquipDecomposePanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/equip/GuardianEquipDecomposePanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    /**英雄守护者 回退 */
    GuardianBackView: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/GuardianBackView",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    /**英雄守护者 回退 选择界面 */
    GuardianBackSelectView: gdk.PanelValue = {
        prefab: "view/role/prefab2/guardian/GuardianBackSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //防御阵营地图选择设置界面
    PveDefenderMapSelect: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveDefenderMapSelect",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**护使秘境界面 */
    GuardianTower: gdk.PanelValue = {
        prefab: "view/act/prefab/guardianTower/GuardianTowerPanel",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }

    //护使秘境扫荡提示界面
    GuardianTowerAskPanel: gdk.PanelValue = {
        prefab: "view/act/prefab/guardianTower/GuardianTowerAskPanel",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //护使秘境排行榜
    GuardianTowerRankView: gdk.PanelValue = {
        prefab: "view/act/prefab/guardianTower/GuardianTowerRankView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //守护者召唤有礼活动整合界面
    GuardianActivityMainView: gdk.PanelValue = {
        prefab: "view/act/prefab/callReward/CallRewardActivityMainView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    /**守护者召唤有礼 */
    GuardianCallRewardView: gdk.PanelValue = {
        prefab: "view/act/prefab/callReward/GuardianCallRewardView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**--------------------专属武器----------------------- */

    /**专属武器选择列表 */
    UniqueEquipList: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/uniqueEquip/UniqueEquipList",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    /**专属武器材料选择 */
    UniqueEquipMaterialsSelectView: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/uniqueEquip/UniqueEquipMaterialsSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    /**专属武器升星 */
    UniqueEquipStarUpdate: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/uniqueEquip/UniqueEquipStarUpdate",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    /**专属武器升星 展示效果*/
    UniqueEquipStarUpdateEffect: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/uniqueEquip/UniqueEquipStarUpdateEffect",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**专属武器tip */
    UniqueEquipTip: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/uniqueEquip/UniqueEquipTip",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    /**专属武器分解 */
    UniqueEquipDecomposePanel: gdk.PanelValue = {
        prefab: "view/role/prefab2/main/uniqueEquip/UniqueEquipDecomposePanel",
        module: [],
        isPopup: true,
        isMask: false,
        isTouchMaskClose: false,
    }

    /**-------------------------------------------------- */

    /**英雄觉醒提示界面 */
    PveHeroAwakeningView: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveHeroAwakeningView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }

    /**英雄觉醒副本英雄选择界面*/
    PveHeroAwakeningSetUpHeroSelector: gdk.PanelValue = {
        prefab: "view/pve/prefab/view/PveHeroAwakeningSetUpHeroSelector",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //荣耀巅峰赛主界面
    ArenaHonorView: gdk.PanelValue = {
        prefab: "view/arenahnor/prefab/ArenaHonorView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }
    //荣耀巅峰赛竞猜界面
    ArenaHonorGuessView: gdk.PanelValue = {
        prefab: "view/arenahnor/prefab/ArenaHonorGuessView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }
    /**英雄觉醒副本英雄选择界面*/
    ArenaHonorRewardView: gdk.PanelValue = {
        prefab: "view/arenahnor/prefab/ArenaHonorRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**荣耀巅峰赛竞猜结果*/
    ArenaHonorGuessResultView: gdk.PanelValue = {
        prefab: "view/arenahnor/prefab/ArenaHonorGuessResultView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    //荣耀巅峰赛下注界面
    ArenaHonorBetView: gdk.PanelValue = {
        prefab: "view/arenahnor/prefab/ArenaHonorBetView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }
    /**荣耀巅峰赛竞猜统计*/
    ArenaHonorGuessReportView: gdk.PanelValue = {
        prefab: "view/arenahnor/prefab/ArenaHonorGuessReportView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**荣耀巅峰赛结果*/
    ArenaHonorResultView: gdk.PanelValue = {
        prefab: "view/arenahnor/prefab/ArenaHonorResultView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    //世界巅峰赛主界面
    WorldHonorView: gdk.PanelValue = {
        prefab: "view/worldhonor/prefab/WorldHonorView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }
    //世界巅峰赛竞猜界面
    WorldHonorGuessView: gdk.PanelValue = {
        prefab: "view/worldhonor/prefab/WorldHonorGuessView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
    }
    /**世界巅峰赛奖励界面*/
    WorldHonorRewardView: gdk.PanelValue = {
        prefab: "view/worldhonor/prefab/WorldHonorRewardView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**世界巅峰赛竞猜结果*/
    WorldHonorGuessResultView: gdk.PanelValue = {
        prefab: "view/worldhonor/prefab/WorldHonorGuessResultView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    //世界巅峰赛下注界面
    WorldHonorBetView: gdk.PanelValue = {
        prefab: "view/worldhonor/prefab/WorldHonorBetView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }


    /**世界巅峰赛竞猜统计*/
    WorldHonorGuessReportView: gdk.PanelValue = {
        prefab: "view/worldhonor/prefab/WorldHonorGuessReportView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**世界巅峰赛结果*/
    WorldHonorResultView: gdk.PanelValue = {
        prefab: "view/worldhonor/prefab/WorldHonorResultView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**世界巅峰赛结果*/
    WorldHonorRankView: gdk.PanelValue = {
        prefab: "view/worldhonor/prefab/WorldHonorRankView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: false,
    }

    /**跨服活动列表 */
    HonorListView: gdk.PanelValue = {
        prefab: "view/worldhonor/prefab/HonorListView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }

    /**巅峰赛防守阵容列表 */
    HonorDefenderSetUpHeroSelector: gdk.PanelValue = {
        prefab: "view/worldhonor/prefab/HonorDefenderSetUpHeroSelector",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    // 武魂试炼上阵英雄Halo界面
    EternalHeroHaloView: gdk.PanelValue = {
        prefab: "view/act/prefab/eternalCopy/EternalHeroHaloView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
    }

    //活动整合界面
    AssembledActivityMainView: gdk.PanelValue = {
        prefab: "view/act/prefab/assembled/AssembledActivityMainView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }
    /**灵力者集结 */
    AssembledRewardView: gdk.PanelValue = {
        prefab: "view/act/prefab/assembled/AssembleRewardView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**灵力者集结 */
    AssembledGiftView: gdk.PanelValue = {
        prefab: "view/act/prefab/assembled/AssembledGiftView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**黄金寻宝船 */
    SailingView: gdk.PanelValue = {
        prefab: "view/act/prefab/sailing/SailingView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    //活动整合界面
    SailingActivityMainView: gdk.PanelValue = {
        prefab: "view/act/prefab/sailing/SailingActivityMainView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }


    /**神秘者活动 */
    MysteryView: gdk.PanelValue = {
        prefab: "view/act/prefab/mystery/MysteryView",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    //神秘来客整合界面
    MysteryVisitorActivityMainView: gdk.PanelValue = {
        prefab: "view/act/prefab/mystery/MysteryVisitorActivityMainView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }
    /**神秘来客 */
    MysteryVisitorView1: gdk.PanelValue = {
        prefab: "view/act/prefab/mystery/MysteryVisitorView1",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }

    /**修炼之路 */
    MysteryVisitorView2: gdk.PanelValue = {
        prefab: "view/act/prefab/mystery/MysteryVisitorView2",
        module: [],
        isPopup: true,
        isMask: false,
        maskAlpha: 0,
        isTouchMaskClose: false,
    }


    /**皇家竞技场界面 */
    RoyalArenaView: gdk.PanelValue = {
        prefab: "view/royalArena/prefab/RoyalArenaView",
        module: [],
        isPopup: false,
        isMask: false,
        isTouchMaskClose: false,
        isDisableView: true
    }
    /**皇家竞技场搜索界面 */
    RoyalArenaSearchView: gdk.PanelValue = {
        prefab: "view/royalArena/prefab/RoyalArenaSearchView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**皇家竞技场排行榜 */
    RoyalArenaRank: gdk.PanelValue = {
        prefab: "view/royalArena/prefab/RoyalArenaRank",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**皇家竞技场段位奖励 */
    RoyalArenaRankGetReward: gdk.PanelValue = {
        prefab: "view/royalArena/prefab/RoyalArenaRankGetReward",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    RandomSkillView: gdk.PanelValue = {
        prefab: "view/royalArena/prefab/Fight/RandomSkillView",
        module: [],
        isPopup: true,
        isMask: true,
        isTouchMaskClose: true,
        maskAlpha: 125,
        isKeep: true,
    }

    /**皇家竞技场地图选择界面 */
    RoyalArenaMapSelectView: gdk.PanelValue = {
        prefab: "view/royalArena/prefab/RoyalArenaMapSelectView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**皇家竞技场地图预览界面 */
    RoyalArenaMapView: gdk.PanelValue = {
        prefab: "view/royalArena/prefab/RoyalArenaMapView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    /**皇家竞技场地图预览界面 */
    RoyalArenaUpDivisionView: gdk.PanelValue = {
        prefab: "view/royalArena/prefab/RoyalArenaUpDivisionView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }
    /**皇家竞技战报界面 */
    RoyalArenaReportView: gdk.PanelValue = {
        prefab: "view/royalArena/prefab/RoyalArenaReportView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 180,
        isTouchMaskClose: true,
    }

    // 活动海报
    PosterView: gdk.PanelValue = {
        prefab: "view/act/prefab/poster/PosterView",
        module: [],
        isPopup: true,
        isMask: true,
        maskAlpha: 125,
        isTouchMaskClose: true,
    }
};

//混合进GDK
const PanelId = gdk.Tool.getSingleton(PanelIdClass);
gdk.PanelId.mixins(PanelId);
// 导出默认包
export default PanelId;