import ConfigManager from '../managers/ConfigManager';
import GlobalUtil from '../utils/GlobalUtil';
import HeroUtils from '../utils/HeroUtils';
import MathUtil from '../utils/MathUtil';
import { BagItem } from './BagModel';
import { Copy_stageCfg, GlobalCfg, ItemCfg } from '../../a/config';
import { CopyType } from './CopyModel';
import { HeroCfg } from '../../../boot/configs/bconfig';

/**
 * @Description: 角色英雄,装备数据类
 * @Author: weiliang.huang
 * @Date: 2019-03-28 16:53:10
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-15 15:03:33
 */

/**英雄占用锁定类型 */
export enum hero_lock_model {
    //塔防上阵
    PveUpHeroList = 0,
    //竞技场
    PvpArenUpHeroList = 1,
    //据点战
    PvpMilitaryUpHeroList = 2,
    //战争遗迹
    PvpRelicUpHeroList = 3,
    //锦标赛
    PvpChampionUpHeroList = 4,
    //组队竞技场
    PvpArenTeamUpHeroList = 5,
    //永恒水晶
    Resonating = 6,
    //协战联盟
    AssistAllience = 7,
    //公会助战(佣兵)
    Mercenary = 8,
    //锁定
    Lock = 9,
    //专属英雄升星活动
    AwakeStarUp = 10,
    //荣耀巅峰赛
    PvpArenaHonorUpHeroList = 11,
    //士兵科技研发
    SoliderTechResearch = 12,
    //基因链接
    MysticHeroLink = 13,
    //九人阵容
    PveNineUpHeroList = 14,
    //皇家竞技场
    PveRoyalUpHeroList = 15,
}

export type hero_career = {
    careerId: number,
    careerLv: number
}

export default class HeroModel {

    /**英雄服务器数据 */
    heroInfos: Array<BagItem> = [];

    /**ID对应道具的物品表 */
    idItems: any = {};

    heroNumByLv: number[] = [];

    /**英雄id对应的属性表 */
    heroAttrs: { [heroId: number]: icmsg.HeroAttr } = {};

    /**英雄详细信息表 */
    heroDeatils: { [heroId: number]: icmsg.HeroDetail } = {};

    /*英雄职业信息表*/
    heroCareers: any = {}

    /**角色面板,玩家上方点击的装备信息 */
    curEquip: BagItem = null;

    /**角色面板, 当前选择的英雄 */
    private _curHeroInfoId: number = -1;
    set curHeroInfo(v: icmsg.HeroInfo) {
        if (v) {
            this._curHeroInfoId = v.heroId;
            return;
        }
        this._curHeroInfoId = -1;
    }
    get curHeroInfo(): icmsg.HeroInfo {
        if (this._curHeroInfoId >= 0) {
            return HeroUtils.getHeroInfoByHeroId(this._curHeroInfoId);
        }
        return null;
    }

    /**士兵加成信息 */
    soldierAddAttr: any = {} // 士兵id--

    /**职业id后置表 */
    relatedInfos: any = null

    careerInfos: any = null//英雄id-[职业id，职业id]

    /**职业id前置表 */
    careerPreIds: any = {}

    /**每个职业的最大等级信息 */
    careerMaxLv: any = {}

    /**职业面板状态 0:显示升级面板, 1:显示转职面板*/
    panelState: number = 0

    /**转职面板显示的职业id */
    showJobId: number = 0

    /**角色面板英雄排序表 */
    selectHeros: { data: BagItem }[] = [];

    /**查看英雄信息 */
    heroImage: icmsg.HeroImage = null;

    /**职业进阶信息 */
    heroCareerBeforeTranData: any = null//{ heroId: data.heroId, careerId: data.careerId, careerLv: e.careerLv }//记录转职前的职业信息 
    heroCareerUpData: any = null//{ heroId: data.heroId, careerId: data.careerId, careerLv: e.careerLv, oldAttr: e.oldAttr }
    heroCareerUpRecord = {};//{soldire:0,  skill:0, attr:0 }

    /** 英雄升级界面记录 */
    upExpRecord = false

    //最高战力的英雄列表 最多记录6位
    maxPowerHeroList = [];

    //英雄列表位置记录
    heroListScrollPos: cc.Vec2 = cc.v2()

    //筛选标签记录
    typeSelect: number = 0

    //选择士兵跳转自动选择相应的职业
    selectSoldierCareerId: number = 0
    selectSoldierId: number = 0

    tempOldPower: number = 0
    tempNewPower: number = 0
    //当前激活的士兵id
    _activeHeroSoldierIds = null;//heroId-[soldierId,soldierId,...]

    //当前激活的卡牌技能id
    _activeHeroSkillIds = null; //heroId:[skillId,skillId,...]

    //当前精通的职业id
    _masterHeroCareerIds = null ////heroId:[careerId,careerId,...]

    /**最后升级时间戳 */
    lastUpgradeTime = 0

    //英雄id对应的 碎片合成状态
    heroComposeStatus: any = {}; //isActive,parent,child3满星,child3获取,……,child1获取 0-未领取/未激活 1-领取/激活
    //英雄合成界面 英雄红点开关
    heroComposeRedPointFlag: any = {}; // 0-开启 1-关闭
    //英雄升星材料替代品
    _replaceItemIdMaps: any;

    //时空精粹-英雄兑换次数
    heroConvertInfo: any = {}; // id-times

    //英雄战斗数据
    fightHeroIdxTower: { [hero_id: number]: icmsg.FightHero } = {};
    fightHeroIdx: { [hero_id: number]: icmsg.FightHero } = {};

    bookSelectCareerId = 0
    bookHeroList = []

    resetHeroId: number = 0

    commentLastTimeStamp: number = 0 //评论上一次发送时间
    commentHeroLike: number = 0//英雄喜欢数量
    commentNum: number = 0//英雄评论数量
    commentCurpage: number = 1//评论当前页数
    commentListNum: number = 0
    commentAllList: any = {}
    commentHeroIsLike: boolean = false //是否点了喜欢
    commentUpStarShow: boolean = false
    commentEffectId: number = 0
    commentZhuanLastTime: number = 0

    roleSelectCareer: number = 0
    roleSelectGroup: number = 0

    //当前选择的神装
    curCostume: BagItem = null

    //塔防上阵
    PveUpHeroList: number[] = [];
    //副本卡牌
    PvpCopyUpHeroList: number[] = [];

    //塔防9人上阵
    Pve_9_HeroList: number[] = []

    //塔防9人上阵
    Pve_RoyalDef_HeroList: number[] = []

    //觉醒图鉴信息
    HeroAwakeData: icmsg.HeroAwakeBooksRsp;

    //------------防守阵容--------------------
    //竞技场
    PvpArenUpHeroList: number[] = [];
    //据点战
    PvpMilitaryUpHeroList: number[] = [];
    //战争遗迹
    PvpRelicUpHeroList: number[] = [];
    //锦标赛
    PvpChampionUpHeroList: number[] = [];
    //组队竞技场
    PvpArenTeamUpHeroList: number[] = [];
    //组队竞技场
    PvpArenaHonorUpHeroList: number[] = [];


    curDefendType: number = 1;

    //当前选择符文的序号
    curRuneSelectIndex: number = 0

    heroAwakeStates: { [hero_id: number]: icmsg.HeroAwakeState } = {};

    //英雄合成
    selectHeroMap: { [id: number]: number[] } = {};  // (材料Idx)idx-number[]  

    get activeHeroSkillIds() {
        if (!this._activeHeroSkillIds) {
            let activeSkillIds = GlobalUtil.getLocal('activeHeroSkillIds') || {};
            this._activeHeroSkillIds = activeSkillIds;
        }
        return this._activeHeroSkillIds;
    }

    set activeHeroSkillIds(activeSkillIds) {
        this._activeHeroSkillIds = activeSkillIds;
        GlobalUtil.setLocal('activeHeroSkillIds', activeSkillIds);
    }

    get activeHeroSoldierIds() {
        if (!this._activeHeroSoldierIds) {
            let activeSoldierIds = GlobalUtil.getLocal('activeHeroSoldierIds') || {};
            this._activeHeroSoldierIds = activeSoldierIds;
        }
        return this._activeHeroSoldierIds;
    }

    set activeHeroSoldierIds(activeSoldierIds) {
        this._activeHeroSoldierIds = activeSoldierIds;
        GlobalUtil.setLocal('activeHeroSoldierIds', activeSoldierIds);
    }

    get masterHeroCareerIds() {
        if (!this._masterHeroCareerIds) {
            let ids = GlobalUtil.getLocal('masterHeroCareerIds') || {};
            this._masterHeroCareerIds = ids;
        }
        return this._masterHeroCareerIds;
    }

    set masterHeroCareerIds(ids) {
        this._masterHeroCareerIds = ids;
        GlobalUtil.setLocal('masterHeroCareerIds', ids);
    }

    /** 塔防战斗英雄阵型 */
    get pveSetupHero(): BagItem[] {
        //let n = 'Role_setUpHero_pve';
        let a = this.PveUpHeroList //GlobalUtil.getLocal(n);
        if (!a || a.length == 0) {
            let data = this.heroInfos.concat();
            GlobalUtil.sortArray(data, (a, b) => {
                let infoA: icmsg.HeroInfo = <icmsg.HeroInfo>a.extInfo;
                let infoB: icmsg.HeroInfo = <icmsg.HeroInfo>b.extInfo;
                if (infoA.star == infoB.star) {
                    if (infoA.power == infoB.power) {
                        return infoA.typeId - infoB.typeId;
                    }
                    return infoB.power - infoA.power;
                }
                return infoB.star - infoA.star;
            });
            a = [data[0].series];
        }
        let infos: BagItem[] = [];
        a.forEach(i => {
            let item = HeroUtils.getHeroInfoBySeries(i);
            if (item) {
                infos.push(item);
            }
        });
        return infos;
    }

    //获取玩法防御阵营
    CurTypePvpdefenderSetUpHero(type: number = 1): BagItem[] {
        let a = this.curUpHeroList(type);
        if (!a || a.length == 0) {
            let data = this.heroInfos.concat();
            GlobalUtil.sortArray(data, (a, b) => {
                let infoA: icmsg.HeroInfo = <icmsg.HeroInfo>a.extInfo;
                let infoB: icmsg.HeroInfo = <icmsg.HeroInfo>b.extInfo;
                if (infoA.star == infoB.star) {
                    if (infoA.power == infoB.power) {
                        return infoA.typeId - infoB.typeId;
                    }
                    return infoB.power - infoA.power;
                }
                return infoB.star - infoA.star;
            });
            a = [data[0].series];
        }
        let infos: BagItem[] = [];
        a.forEach(i => {
            let item = HeroUtils.getHeroInfoBySeries(i);
            if (item) {
                infos.push(item);
            } else {
                infos.push(null)
            }
        });
        return infos;
    }


    curUpHeroList(type: number) {
        let list: number[]
        switch (type) {
            case 0:
                list = this.PveUpHeroList;
                break;
            case 1:
                list = this.PvpArenUpHeroList;
                break;
            case 2:
                list = this.PvpMilitaryUpHeroList;
                break;
            case 3:
                list = this.PvpRelicUpHeroList;
                break;
            case 4:
                list = this.PvpChampionUpHeroList;
                break;
            case 5:
                list = this.PvpArenTeamUpHeroList;
                break;
            case 6:
                list = this.PvpArenaHonorUpHeroList;
                break;
            case 7:
                list = this.Pve_9_HeroList;
                break;
            case 8:
                list = this.Pve_RoyalDef_HeroList;
                break;
        }
        return list || [];
    }

    refreshCurHeroList(type: number, list: number[]) {
        switch (type) {
            case 0:
                //进攻列表
                this.PveUpHeroList = list;
                break;
            case 1:
                //竞技场
                this.PvpArenUpHeroList = list;
                break;
            case 2:
                //据点战
                this.PvpMilitaryUpHeroList = list;
                break;
            case 3:
                //战争遗迹
                this.PvpRelicUpHeroList = list;
                break;
            case 4:
                //锦标赛
                this.PvpChampionUpHeroList = list;
                break;
            case 5:
                //组队竞技场
                this.PvpArenTeamUpHeroList = list;
                break;
            case 6:
                //组队竞技场
                this.PvpArenaHonorUpHeroList = list;
                break;
            case 7:
                //9人终极副本
                this.Pve_9_HeroList = list;
                break;
            case 8:
                //皇家竞技场防守阵容
                this.Pve_RoyalDef_HeroList = list;
                break;
        }
    }

    get replaceItemIdMaps() {
        if (!this._replaceItemIdMaps) {
            this._replaceItemIdMaps = {
                '1': {},
                '2': {},
                '3': {},
                '4': {},
                '5': {}
            };
            let cfgs = ConfigManager.getItems(ItemCfg, (cfg: ItemCfg) => {
                if (cfg.func_id == 'hero_star_up') return true;
            });
            cfgs.forEach(cfg => {
                let groups: number[] = [];
                if (cfg.func_args[1] == 11) {
                    groups = [3, 4, 5];
                }
                else if (cfg.func_args[1] == 12) {
                    groups = [1, 2, 3, 4, 5];
                }
                else {
                    groups = [cfg.func_args[1]];
                }
                let star = cfg.func_args[0];
                groups.forEach(group => {
                    if (!this._replaceItemIdMaps[group][star]) {
                        this._replaceItemIdMaps[group][star] = [cfg.id];
                    }
                    else {
                        this._replaceItemIdMaps[group][star].push(cfg.id);
                    }
                });
            });
        }
        return this._replaceItemIdMaps;
    }


    getDefenderStageId(type: number): number {
        //let id = 11;
        let arr: Copy_stageCfg[];
        let temKey = ''
        switch (type) {
            case 1:
                temKey = "arena_invoke";
                break;
            case 2:
                //据点战
                temKey = "guild_invoke";

                break;
            case 3:
                //战争遗迹
                temKey = "relic_invoke";

                break;
            case 4:
                //锦标赛
                temKey = "champion_invoke";

                break;
            case 5:
                //组队竞技场
                temKey = "teamarena_invoke";
            case 6:
                //荣耀巅峰赛
                temKey = "arena_invoke";
            case 7:
                //世界巅峰赛
                temKey = "arena_invoke";
                break;
        }
        let atcfg = ConfigManager.getItemById(GlobalCfg, temKey).value;
        let atval = MathUtil.shuffle(atcfg)[0] as string;
        let atarr = atval.split(',');
        arr = ConfigManager.getItems(Copy_stageCfg, (item: Copy_stageCfg) => {
            return item.copy_id == CopyType.NONE && item.id == parseInt(atarr[0]) + 1;
        });
        let stageCfg: Copy_stageCfg = MathUtil.shuffle(arr)[0];
        return stageCfg.id
    }

    _hasMysticHero: boolean = false;
    get hasMysticHero(): boolean {
        if (this._hasMysticHero) return true;
        for (let i = 0; i < this.heroInfos.length; i++) {
            let cfg = ConfigManager.getItemById(HeroCfg, (<icmsg.HeroInfo>this.heroInfos[i].extInfo).typeId);
            if (cfg.group[0] == 6) {
                this._hasMysticHero = true;
                return true;
            }
        }
        return false;
    }
}