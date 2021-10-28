import {
    Copy_stageCfg,
    Global_powerCfg, HeadframeCfg, Headframe_titleCfg, HeroCfg, Hero_careerCfg, ItemCfg, Item_dropCfg,
    Item_equipCfg, Monster2Cfg,
    SkillCfg,
    SoldierCfg,
    Tech_stoneCfg,
    UniqueCfg,
    VipCfg
} from '../../a/config';
import ButtonSoundId from '../../configs/ids/ButtonSoundId';
import PanelId from '../../configs/ids/PanelId';
import GuideModel from '../../guide/model/GuideModel';
import { HeadItemInfo } from '../../scenes/main/ctrl/HeadChangeViewCtrl';
import SdkTool from '../../sdk/SdkTool';
import { EnergyStoneInfo } from '../../view/bingying/model/BYModel';
import GuardianGetCtrl from '../../view/lottery/ctrl/GuardianGetCtrl';
import HeroDetailViewCtrl from '../../view/lottery/ctrl/HeroDetailViewCtrl';
import HeroGetCtrl from '../../view/lottery/ctrl/HeroGetCtrl';
import LotteryModel from '../../view/lottery/model/LotteryModel';
import PveRes from '../../view/pve/const/PveRes';
import { CostumeTipsType } from '../../view/role/ctrl2/costume/CostumeTipsCtrl';
import { GuardianEquipTipsType } from '../../view/role/ctrl2/guardian/equip/GuardianEquipTipsCtrl';
import ConfigManager from '../managers/ConfigManager';
import ModelManager from '../managers/ModelManager';
import NetManager from '../managers/NetManager';
import { BagItem, BagType } from '../models/BagModel';
import { CopyType } from '../models/CopyModel';
import GeneralModel from '../models/GeneralModel';
import LoginModel from '../models/LoginModel';
import RoleModel, { AttTypeName } from '../models/RoleModel';
import ServerModel from '../models/ServerModel';
import AskPanel, { AskInfoCacheType, AskInfoType } from '../widgets/AskPanel';
import BtnMenuCtrl, { BtnMenuType, BtnTypePlayer } from '../widgets/BtnMenuCtrl';
import CareerTipCtrl from '../widgets/CareerTipCtrl';
import CommonInfoTipCtrl from '../widgets/CommonInfoTipCtrl';
import RewardCtrl, { RewardInfoType, RewardType } from '../widgets/RewardCtrl';
import RewardPreviewCtrl from '../widgets/RewardPreviewCtrl';
import TipsPanel, { TipType } from '../widgets/TipsPanel';
import { GuardianCfg } from './../../a/config';
import { EquipTipsType } from './../../view/bag/ctrl/EquipsTipsCtrl';
import BagUtils from './BagUtils';
import CopyUtil from './CopyUtil';
import JumpUtils from './JumpUtils';
import StringUtils from './StringUtils';

/**
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-04-06 13:57:57
 * @Date: 2019-03-25 14:41:33
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-12 10:35:31
 */
class GlobalUtilClass extends iclib.GlobalUtilClass {

    get serverModel() {
        return ModelManager.get(ServerModel);
    }

    get guideModel() {
        return ModelManager.get(GuideModel);
    }

    get lotteryModel() {
        return ModelManager.get(LotteryModel);
    }

    get loginModel() {
        return ModelManager.get(LoginModel);
    }

    /**冒泡排序 */
    sortArray<T>(arr: T[], sortFunc: (a: T, b: T) => number) {
        if (!sortFunc) {
            return arr
        }
        // for (let i = 0; i < arr.length - 1; i++) {
        //     for (let j = 0; j < arr.length - 1 - i; j++) {
        //         if (sortFunc(arr[j], arr[j + 1]) > 0) {
        //             let temp = arr[j];
        //             arr[j] = arr[j + 1];
        //             arr[j + 1] = temp;
        //         }
        //     }
        // }
        return arr.sort(sortFunc);
    }

    /**
     * 补齐函数
     * @param num 原字符
     * @param total 总长度
     * @param pad 补齐字符
     */
    padLeft(num: number | string, total, pad: string = "0") {
        if (num === void 0) {
            return
        }
        let text = ""
        if (typeof (num) == "number") {
            text = num.toString()
        } else if (typeof (num) == "string") {
            text = num
        }
        if (text.length >= total) {
            return text
        }

        return (Array(total).join(pad) + text).slice(-total);
    }

    /**
     * 打开批量使用面板
     * @param item 道具信息
     * @param cb 使用回调,该回调返回批量使用的数字
     * @param maxNum 数量限制
     */
    // openUsePanel(item: BagItem, cb: Function = null, maxNum: number = 0) {
    //     gdk.panel.open(PanelId.Use, (node: cc.Node) => {
    //         let comp = node.getComponent(UsePanel)
    //         comp.updatePanelShow(item, cb, maxNum)
    //     })
    // }

    /**获取服务器时间 */
    getServerTime() {
        return this.serverModel.serverTime
    }

    /**获取开服时间 */
    getServerOpenTime() {
        return this.loginModel.serverOpenTime
    }

    /**
     * 获取根据开服时间获得的周 
     * @param openW 开服
     * @param curW  当前实际
     */
    getCurWeek(): number {
        //周末直接返回0
        let curW = (new Date(this.getServerTime())).getDay();
        if (curW == 0) {
            return 0;
        }
        let openTime = this.getServerOpenTime();
        let curTime = Math.ceil(this.getServerTime() / 1000)
        let res = 0;
        let dayNum = Math.ceil((curTime - openTime) / 86400)
        res = dayNum % 3;
        if (res == 0) res = 3;
        return res;
    }

    /**
     * 获取根据开服时间获得的天数
     */
    getCurDays(): number {
        let openTime = GlobalUtil.getServerOpenTime();
        let curTime = Math.ceil(GlobalUtil.getServerTime() / 1000);
        let dayNum = Math.ceil((curTime - openTime) / 86400);
        return dayNum;
    }

    /**获得已经开启跨服的天数 */
    getCrossOpenDays() {
        let crossTime = ModelManager.get(RoleModel).CrossOpenTime
        let curTime = Math.ceil(GlobalUtil.getServerTime() / 1000);
        let dayNum = Math.ceil((curTime - crossTime) / 86400);
        return dayNum;
    }

    /**打开物品提示窗口 */
    openItemTips(item: BagItem, noBtn: boolean = false, isOther: boolean = false, from?: string | number) {
        switch (item.type) {
            case BagType.MONEY:
            case BagType.ITEM:
                let config = <ItemCfg>BagUtils.getConfigById(item.itemId);
                let dropCfgs = ConfigManager.getItemsByField(Item_dropCfg, 'drop_id', config ? config.func_args[0] : null);
                if (config && dropCfgs && config.use_type == 4 && dropCfgs.length > 0 && !gdk.panel.isOpenOrOpening(PanelId.GiftItemTips)) {
                    gdk.panel.setArgs(PanelId.GiftItemTips, item, noBtn);
                    gdk.panel.open(PanelId.GiftItemTips);
                }
                else {
                    if (config.func_id == `add_title`) {
                        let titleCfg = ConfigManager.getItemById(Headframe_titleCfg, config.func_args[0])
                        gdk.panel.setArgs(PanelId.TitlelTips, titleCfg);
                        gdk.panel.open(PanelId.TitlelTips);
                    } else if (config.func_id == 'add_head_frame') {
                        let item: HeadItemInfo = {
                            type: 1,
                            id: config.func_args[0],
                            isActive: false,
                            isSelect: false
                        }
                        gdk.panel.setArgs(PanelId.FrameDetailsView, item);
                        gdk.panel.open(PanelId.FrameDetailsView)
                    } else {
                        gdk.panel.setArgs(PanelId.ItemTips, item, noBtn);
                        gdk.panel.open(PanelId.ItemTips);
                    }
                }
                break;
            case BagType.EQUIP:
                let tipsArgs: EquipTipsType = {
                    itemInfo: item,
                    noBtn: noBtn,
                    isOther: isOther,
                    from: from,
                };
                gdk.panel.setArgs(PanelId.EquipTips, tipsArgs);
                gdk.panel.open(PanelId.EquipTips);
                break;

            case BagType.JEWEL:
                gdk.panel.setArgs(PanelId.JewelTips, item);
                gdk.panel.open(PanelId.JewelTips);
                break;

            case BagType.HERO:
                // gdk.gui.showMessage(ConfigManager.getItemById(HeroCfg, item.itemId).name);
                gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
                    let comp = node.getComponent(HeroDetailViewCtrl);
                    comp.initHeroInfo(ConfigManager.getItemById(HeroCfg, item.itemId));
                });
                break;

            case BagType.RUNE:
                gdk.panel.setArgs(PanelId.RuneInfo, [item.itemId, null, null]);
                gdk.panel.open(PanelId.RuneInfo);
                break;
            case BagType.COSTUME:
                let tipsInfo: CostumeTipsType = {
                    itemInfo: item,
                    from: from,
                };
                gdk.panel.setArgs(PanelId.CostumeTips, tipsInfo)
                gdk.panel.open(PanelId.CostumeTips)
                break;
            case BagType.GUARDIAN:
                let guardian = item.extInfo as icmsg.Guardian;
                if (!guardian) {
                    let cfg = ConfigManager.getItemById(GuardianCfg, item.itemId);
                    guardian = new icmsg.Guardian();
                    guardian.id = 0;
                    guardian.level = 1;
                    guardian.star = cfg.star_min;
                    guardian.type = cfg.id;
                }
                gdk.panel.setArgs(PanelId.GuardianInfoTip, guardian, guardian.id == 0);
                gdk.panel.open(PanelId.GuardianInfoTip);
                break;
            case BagType.GUARDIANEQUIP:
                let guardianEquip = item.extInfo as icmsg.GuardianEquip
                if (!guardianEquip) {
                    return
                }
                //打开装备提示框
                let guardianEquipTips: GuardianEquipTipsType = {
                    itemInfo: item,
                    from: from,
                };
                gdk.panel.open(PanelId.GuardianEquipTips, null, null, { args: guardianEquipTips });
                break
            case BagType.ENERGSTONE:
                let obj: EnergyStoneInfo = {
                    slot: -2,
                    itemId: item.itemId,
                    itemNum: item.itemNum
                }
                gdk.panel.setArgs(PanelId.BYTechStoneInfoView, [obj, null]);
                gdk.panel.open(PanelId.BYTechStoneInfoView);
                break;
            case BagType.UNIQUEEQUIP:
                let uniqueCfg = ConfigManager.getItemById(UniqueCfg, item.itemId)
                let uniqueEquip = new icmsg.UniqueEquip()
                uniqueEquip.id = -1
                uniqueEquip.itemId = uniqueCfg.id
                uniqueEquip.star = 0//uniqueCfg.star_max
                gdk.panel.setArgs(PanelId.UniqueEquipTip, uniqueEquip)
                gdk.panel.open(PanelId.UniqueEquipTip)
                break;
        }
    }

    /**显示获取途径窗口 */
    openGainWayTips(itemId, target?) {
        gdk.panel.setArgs(PanelId.GainWayTips, itemId, [])
        gdk.panel.open(PanelId.GainWayTips)
        if (target) {
            target.close()
        }
    }

    /**打开2个按钮的询问面板 */
    openAskPanel(info: AskInfoType) {
        if (info.isShowTip && info.tipSaveCache && info.sureCb) {
            let loginModel = ModelManager.get(LoginModel);
            if (loginModel.operateMap[info.tipSaveCache]) {
                if (info.tipSaveCache == AskInfoCacheType.tower_check_tip) {
                    info.closeCb();
                } else {
                    info.sureCb();
                }
                return;
            }
        }

        gdk.panel.open(PanelId.AskPanel, (node: cc.Node) => {
            let comp: AskPanel = node.getComponent(AskPanel)
            comp.updatePanelInfo(info)
        })
    }

    /**打开文本提示面板,支持富文本 */
    openTipsPanel(info: TipType) {
        gdk.panel.open(PanelId.TipsPanel, (node: cc.Node) => {
            let comp: TipsPanel = node.getComponent(TipsPanel)
            comp.showTips(info)
        })
    }

    /**
     * 打开限时礼包界面
     * @param id 
     */
    openLimitGiftPanel() {
        if (gdk.panel.isOpenOrOpening(PanelId.LimitGiftView)) return;
        gdk.panel.open(PanelId.LimitGiftView);
    }

    /**把数字按一定格式转换为字符串(保留小数)
     * number 数量
     * isChange 是否转换 大于万显示K，千万显示M，十亿显示B
     * useFont 使用艺术字，显示要转换( K = : ) (M = ;) (B = <)
    */
    numberToStr2(number: number, isChange: boolean = false, useFont = false) {

        let text = number + ""
        if (isChange) {
            if (number > 1000 * 1000 * 1000 * 1000) {
                text = `${(number / (1000 * 1000 * 1000 * 1000)).toFixed(2)}` + (useFont ? "=" : "T")
            } else if (number > 1000 * 1000 * 1000) {
                text = `${(number / (10 * 10000 * 10000)).toFixed(2)}` + (useFont ? "<" : "B")
            } else if (number >= 1000 * 1000) {
                text = `${(number / 1000000).toFixed(2)}` + (useFont ? ";" : "M")
            } else if (number >= 1000) {
                text = `${(number / 1000).toFixed(1)}` + (useFont ? ":" : "K")
            }
        } else {
            text = `${number}`
        }

        return text
    }

    /**
     * 打开奖励预览界面
     * @param list
     * @param title
     * @param label
     * @param callback
     * @param thisArg
     */
    openRewardPreview(list: icmsg.GoodsInfo[], title?: string, label?: string, callback?: Function, thisArg?: any) {
        if (!list) return;
        if (!list.length) return;
        gdk.panel.open(PanelId.RewardPreview, (node: cc.Node) => {
            let ctrl = node.getComponent(RewardPreviewCtrl);
            ctrl.setRewards(list, title, label, callback, thisArg);
        });
    }

    /**打开恭喜获得面板
     * @param list 奖励列表
     * @param showType 奖励显示类型
     */
    openRewadrView(list: icmsg.GoodsInfo[], showType: RewardType = RewardType.NORMAL, extraInfo: any = {}, bagItems: BagItem[] = [], isSort: boolean = true) {
        if (list.length == 0) {
            return
        }

        let privilegeGoods = [];
        let normalGoods = [];
        list.forEach(goods => {
            if (goods['up']) privilegeGoods.push(goods);
            else normalGoods.push(goods);
        });
        if (isSort) {
            list = this.sortGoodsInfo(privilegeGoods).concat(this.sortGoodsInfo(normalGoods));
        }
        else {
            list = privilegeGoods.concat(normalGoods);
        }

        let heroList = []
        let itemList = []
        let guardianList = [];
        for (let i = 0; i < list.length; i++) {
            let typeId = list[i].typeId.toString().length >= 8 ? parseInt(list[i].typeId.toString().slice(0, 6)) : list[i].typeId;
            let type = BagUtils.getItemTypeById(typeId)
            if (type == BagType.HERO) {
                heroList.push(list[i])
            } else if (type == BagType.GUARDIAN) {
                guardianList.push(list[i])
            } else {
                itemList.push(list[i])
            }
        }
        //let guideModel = this.guideModel
        //物品获得
        let showItemGetView = function () {
            let info: RewardInfoType = {
                goodList: list,
                showType: showType,
                bagItems: bagItems
            }
            gdk.panel.open(PanelId.Reward, (node: cc.Node) => {
                let comp = node.getComponent(RewardCtrl)
                comp.initRewardInfo(info, null, extraInfo)
            })
        }
        if (heroList.length > 0) {
            //有英雄的先播放英雄 在播放道具
            if (guardianList.length > 0) {
                let cb = () => {
                    this.openGuardianRewardView(guardianList, showItemGetView);
                }
                this.openHeroRewardView(heroList, cb)
            }
            else {
                this.openHeroRewardView(heroList, showItemGetView)
            }
        } else if (guardianList.length > 0) {
            //有英雄的先播放英雄 在播放道具
            this.openGuardianRewardView(guardianList, showItemGetView)
        } else {
            //直接播放道具
            showItemGetView()
        }
    }

    /**
     * 获得英雄奖励界面
     * @param id 英雄配表id
     */
    openHeroRewardView(list, callFunc?) {
        this.lotteryModel.resultGoods = list
        this.lotteryModel.showGoodsId = []
        this.lotteryModel.showGoodsInfo = {};

        //转换为id--num格式
        let showGoodsInfo = this.lotteryModel.showGoodsInfo;
        for (let i = 0; i < list.length; i++) {
            let typeId = list[i].typeId.toString().length >= 8 ? parseInt(list[i].typeId.toString().slice(0, 6)) : list[i].typeId;
            let cfg = BagUtils.getConfigById(typeId)
            if (cfg) {
                if (!showGoodsInfo[list[i].typeId]) {
                    showGoodsInfo[list[i].typeId] = list[i].num
                } else {
                    showGoodsInfo[list[i].typeId] += list[i].num
                }
            }
        }
        //特殊的展示效果
        if (Object.keys(showGoodsInfo).length > 0) {
            gdk.panel.open(PanelId.HeroReward, (node: cc.Node) => {
                let comp = node.getComponent(HeroGetCtrl)
                comp.isLotteryShow = true
                if (callFunc) {
                    comp.callFunc = callFunc
                }
                comp.showLotteryResult()

                //音效
                if (this.isSoundOn) {
                    if (list.length > 0) {
                        let info = list[0]
                        let typeId = info.typeId.toString().length >= 8 ? parseInt(info.typeId.toString().slice(0, 6)) : info.typeId;
                        let heroCfg = ConfigManager.getItemById(HeroCfg, typeId)
                        let star = info.typeId.toString().length >= 8 ? parseInt(info.typeId.toString().slice(6)) : heroCfg.star_min;
                        if (star >= 4) {
                            this.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(node), ButtonSoundId.result)
                        } else {
                            this.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(node), ButtonSoundId.common)
                        }
                    }
                }

            })
        } else {
            //常规的物品获得展示
            this.openRewadrView(list)
        }
    }

    /**
     * 获得英雄奖励界面
     * @param id 英雄配表id
     */
    openGuardianRewardView(list, callFunc?) {
        this.lotteryModel.resultGoods = list
        this.lotteryModel.showGoodsId = []
        this.lotteryModel.showGoodsInfo = {};

        //转换为id--num格式
        let showGoodsInfo = this.lotteryModel.showGoodsInfo;
        for (let i = 0; i < list.length; i++) {
            //let typeId = list[i].typeId.toString().length >= 8 ? parseInt(list[i].typeId.toString().slice(0, 6)) : list[i].typeId;
            let cfg = ConfigManager.getItemById(GuardianCfg, list[i].typeId);
            if (cfg) {
                if (!showGoodsInfo[list[i].typeId]) {
                    showGoodsInfo[list[i].typeId] = list[i].num
                } else {
                    showGoodsInfo[list[i].typeId] += list[i].num
                }
            }
        }
        //特殊的展示效果
        let temLength = Object.keys(showGoodsInfo).length
        if (temLength > 0) {
            gdk.panel.open(PanelId.GuardianReward, (node: cc.Node) => {
                let comp = node.getComponent(GuardianGetCtrl)
                comp.isLotteryShow = true
                if (callFunc) {
                    comp.callFunc = callFunc
                }
                comp.showLotteryResult()
            })
        } else {
            //常规的物品获得展示
            this.openRewadrView(list)
        }
    }


    /**获取技能图标
     * @param skillId 技能id
     */
    getSkillIcon(skillId: number) {
        let cfg = ConfigManager.getItemByField(SkillCfg, "skill_id", skillId, null)
        if (!cfg) {
            return ""
        }
        let icon = cfg.icon || ""
        let path = `icon/skill/${icon}`
        return path
    }

    /**英雄的职业类型图标
    * iconType  0 背景  1 图标
   */
    // getCareerSoldierIcon(heroInfo: HeroInfo, iconType: number = 0) {
    //     let careerLv = HeroUtils.getHeroJobLv(heroInfo.heroId, heroInfo.careerId)
    //     if (careerLv == -1) {
    //         let careers = heroInfo.careers
    //         for (let i = 0; i < careers.length; i++) {
    //             if (careers[i].careerId == heroInfo.careerId) {
    //                 careerLv = careers[i].careerLv
    //             }
    //         }
    //     }
    //     let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", heroInfo.careerId, { career_lv: careerLv })
    //     if (iconType == 0) {
    //         return `view/role/texture/careerIcon/rank_${careerCfg.rank}_${careerLv == 0 ? 0 : 1}`
    //     }
    //     let cfg = ConfigManager.getItemById(SoldierCfg, heroInfo.soldierId);
    //     return `view/role/texture/careerIcon/type_${careerCfg.rank}_${cfg.type}`
    // }

    /** 英雄的职业等级*/
    // getCareerLvIcon(heroInfo: HeroInfo) {
    //     let careerLv = HeroUtils.getHeroJobLv(heroInfo.heroId, heroInfo.careerId)
    //     if (careerLv == -1) {
    //         let careers = heroInfo.careers
    //         for (let i = 0; i < careers.length; i++) {
    //             if (careers[i].careerId == heroInfo.careerId) {
    //                 careerLv = careers[i].careerLv
    //             }
    //         }
    //     }
    //     if (careerLv == 0) {
    //         return ""
    //     }
    //     return `view/role/texture/careerIcon/level_${careerLv}`
    // }

    getHeroCareerLv(heroInfo: icmsg.HeroInfo) {
        // let careerLv = HeroUtils.getHeroJobLv(heroInfo.heroId, heroInfo.careerId)
        // if (careerLv == -1) {
        //     let careers = heroInfo.careers
        //     for (let i = 0; i < careers.length; i++) {
        //         if (careers[i].careerId == heroInfo.careerId) {
        //             careerLv = careers[i].careerLv
        //         }
        //     }
        // }
        return heroInfo.careerLv
    }

    // getCareerSoldierIconById(careerId, careerLv, soldierId: number = 0, iconType: number = 0) {
    //     let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, { career_lv: careerLv })
    //     if (iconType == 0) {
    //         return `view/role/texture/careerIcon/rank_${careerCfg.rank}_${careerLv == 0 ? 0 : 1}`
    //     }
    //     let cfg = ConfigManager.getItemById(SoldierCfg, soldierId);
    //     return `view/role/texture/careerIcon/type_${careerCfg.rank}_${cfg.type}`
    // }

    // getCareerLvIconById(careerLv) {
    //     if (careerLv == 0) {
    //         return ""
    //     }
    //     return `view/role/texture/careerIcon/level_${careerLv}`
    // }

    /**士兵评级图标 */
    getSoldierClassIconById(id) {
        if (id == 0) {
            return ""
        }
        return `view/role/texture/soldier2/soldier_class_${id}`
    }

    /**士兵评级图标 */
    getSoldierNameColor(color, isLabeloutLine = false) {
        let colorStr = ""
        switch (color) {
            case 1:
                colorStr = isLabeloutLine ? "#44291e" : "#5effaa"
                break
            case 2:
                colorStr = isLabeloutLine ? "#292d46" : "#2df7f5"
                break
            case 3:
                colorStr = isLabeloutLine ? "#5a0000" : "#fff600"
                break
            default:
                colorStr = isLabeloutLine ? "#44291e" : "#5effaa"
                break
        }
        return colorStr
    }

    /**获取技能配置信息
     * @param skillId 技能id
     */
    getSkillCfg(skillId: number) {
        return ConfigManager.getItemByField(SkillCfg, "skill_id", skillId)
    }

    /**获取技能配置信息
     * @param skillId 技能id
     */
    getSkillLvCfg(skillId: number, lv: number) {
        return ConfigManager.getItemByField(SkillCfg, "skill_id", skillId, { level: lv })
    }

    /**获取技能配置信息
     * @param skillId 技能id
     */
    getSkillMaxLv(skillId: number) {
        let list = ConfigManager.getItemsByField(SkillCfg, "skill_id", skillId)
        return list.length
    }

    /**
     * 显示菜单栏
     * @param target 目标按钮,需要根据node位置动态更改菜单栏位置
     * @param btns 按钮类型组合
     * @param info 按钮透传信息
     */
    openBtnMenu(target: cc.Node = null, btns: BtnMenuType[], info: BtnTypePlayer) {
        if (btns.length == 0) {
            return
        }
        let node = gdk.panel.get(PanelId.BtnMenu)
        if (!node) {
            gdk.panel.open(PanelId.BtnMenu, (node: cc.Node) => {
                let comp = node.getComponent(BtnMenuCtrl)
                comp.showBtns(target, btns, info)
            })
        }
    }


    /**
    * 显示职业tip
    * @param target 目标按钮,需要根据node位置动态更改菜单栏位置
    */
    openCareerTip(target: cc.Node = null, type) {
        let panel = gdk.panel.get(PanelId.CareerTip)
        if (panel) {
            let comp = panel.getComponent(CareerTipCtrl)
            comp.showTip(target, type)
        } else {
            gdk.panel.open(PanelId.CareerTip, (node: cc.Node) => {
                let comp = node.getComponent(CareerTipCtrl)
                comp.showTip(target, type)
            })
        }
    }


    /**
   * 显示通用tip
   * @param target 目标按钮,需要根据node位置动态更改菜单栏位置
   */
    openCommonInfoTip(target: cc.Node = null, itemId, desc = '') {
        let panel = gdk.panel.get(PanelId.CommonInfoTip)
        if (panel) {
            let comp = panel.getComponent(CommonInfoTipCtrl)
            comp.showTip(target, itemId, desc)
        } else {
            gdk.panel.open(PanelId.CommonInfoTip, (node: cc.Node) => {
                let comp = node.getComponent(CommonInfoTipCtrl)
                comp.showTip(target, itemId, desc)
            })
        }
    }

    /**
     * 奖励物品排序   金币 > 指挥官经验 > 英雄经验 > 品质 > 道具id
     * @param list 
     */
    sortGoodsInfo(list: icmsg.GoodsInfo[]): icmsg.GoodsInfo[] {
        // 奖励列表
        let tempList: any[] = [];
        let coin: any[] = [];
        let commandExp: any;
        let heroExp: any[] = [];
        let temp2: any[] = [];
        for (let i = 0, n = list.length; i < n; i++) {
            let typeId = list[i].typeId;
            if (typeId == 1) commandExp = list[i];
            else if (typeId == 3) coin.push(list[i]);
            else if (typeId == 10) heroExp.push(list[i]);
            else temp2.push(list[i]);
        }

        // 金币 > 指挥官经验 > 英雄经验
        tempList = coin;
        commandExp && tempList.push(commandExp);
        tempList = tempList.concat(...heroExp);

        // 品质 > 道具id
        temp2.sort((a, b) => {
            let typeIdA = a.typeId.toString().length >= 8 ? parseInt(a.typeId.toString().slice(0, 6)) : a.typeId;;
            let typeIdB = b.typeId.toString().length >= 8 ? parseInt(b.typeId.toString().slice(0, 6)) : b.typeId;;
            let cfgA = BagUtils.getConfigById(typeIdA);
            let cfgB = BagUtils.getConfigById(typeIdB);
            if (cfgA.defaultColor == cfgB.defaultColor) return cfgB.id - cfgA.id;
            else return cfgB.defaultColor - cfgA.defaultColor;
        })
        return tempList.concat(...temp2);
    }

    /**根据id获取道具/装备的品质框
     * @param id 物品配表id
     * @param type 物品类型
     */
    getQualityById(id: number, type?: BagType): string {
        let itemCfg = BagUtils.getConfigById(id);
        let path = itemCfg.defaultColor > 0 ? `common/texture/sub_itembg0${itemCfg.defaultColor}` : null;
        return path;
    }

    /**根据id获取道具/装备/英雄图标
     * @param id 物品配表id
     * @param type 物品类型
     */
    getIconById(id: number, type?: BagType): string {
        if (!type) {
            type = BagUtils.getItemTypeById(id)
        }
        let path = ""
        let itemConfig = <any>BagUtils.getConfigById(id, type)
        if (!itemConfig) {
            return ""
        }
        switch (type) {
            case BagType.MONEY:
                path = `icon/item/${itemConfig.icon}`
                break;
            case BagType.EQUIP:
            case BagType.COSTUME:
            case BagType.UNIQUEEQUIP:
                path = `icon/equip/${itemConfig.icon}`
                break
            case BagType.HERO:
                path = `icon/hero/${itemConfig.icon}_s`
                break
            case BagType.MONSTER:
                path = `icon/monster/${itemConfig.icon}`
                break
            // case BagType.RUNE:
            //     path = `icon/rune/${itemConfig.icon}`
            //     break
            case BagType.GUARDIAN:
                path = `icon/guardian/${itemConfig.icon}`
                break
            default:
                path = `icon/item/${itemConfig.icon}`
                break;
        }
        return path
    }

    /**货币小图标 */
    getSmallMoneyIcon(id: number) {
        let itemConfig = <any>BagUtils.getConfigById(id, BagType.MONEY)
        if (!itemConfig) {
            return ""
        }
        let path = `common/texture/${itemConfig.icon}`
        return path
    }

    /*获取玩家头像图标*/
    getHeadIconById(head: number) {
        if (!head) {
            return `icon/hero/300000${ModelManager.get(RoleModel).gender == 1 ? 'nv' : ''}_s`;
        }
        let heroCfg = ConfigManager.getItemById(HeroCfg, head);
        if (heroCfg) {
            return this.getIconById(heroCfg.id, BagType.HERO);
        }
        if (head >= 310000) {
            return `icon/hero/${head}_s`
        }
        return `icon/hero/300000${ModelManager.get(RoleModel).gender == 1 ? 'nv' : ''}_s`;
    }

    /*获取玩家头像背景框*/
    getHeadFrameById(headFrame: number) {
        let frameCfg = ConfigManager.getItemById(HeadframeCfg, headFrame);
        if (frameCfg && frameCfg.icon) {
            return `icon/headframe/${frameCfg.icon}`;
        }
        return "common/texture/sub_touxiangkuang";
        // return `common/texture/sub_itembg0${headFrame}`;
    }

    /**获取玩家称号 */
    getHeadTitleById(titleId) {
        let titleCfg = ConfigManager.getItemById(Headframe_titleCfg, titleId);
        if (titleCfg && titleCfg.icon) {
            return `icon/headframe/${titleCfg.icon}`;
        }
        return ''
    }

    /**获取职业图标
     * @param careerId 职业图标
     */
    getCareerIcon(careerId: number): string {
        let icon = ""
        let cfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, null)
        if (cfg) {
            icon = `icon/career/${cfg.icon}`
        }
        return icon
    }

    /**获取职业名字
     * @param careerId
     */
    getCareerName(careerId: number): string {
        let str = ""
        let cfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, null)
        if (cfg) {
            str = cfg.name
        }
        return str
    }

    /**获取职业阶级名字
     * @param careerId 职业id
     */
    getCareerRankName(heroId: number, careerId: number): string {
        let rankName = "";
        // let level = HeroUtils.getHeroJobLv(heroId, careerId)
        // let cfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, { career_lv: level });
        // if (cfg) {
        //     let rankNameArr = ["初级", "中级", "高级"];
        //     rankName = `${rankNameArr[cfg.rank]}`;
        //     //if (cfg.career_lv > 0) {
        //     rankName += `+${cfg.career_lv + 1}`;
        //     //}
        // }
        return rankName
    }

    /**获取士兵图标
     * @param soldierId 士兵图标
     */
    getSoldierIcon(soldierId: number, isSmall: boolean = false): string {
        let icon = "";
        let cfg;
        if (soldierId < 1000) {
            cfg = ConfigManager.getItemById(SoldierCfg, soldierId);
            if (cfg) {
                icon = `icon/soldier/${cfg.icon}`;
            }
            if (isSmall) {
                icon = icon + "_s";
            }
        } else {
            cfg = ConfigManager.getItemById(Monster2Cfg, soldierId);
            if (cfg) {
                icon = `icon/soldier/${cfg.icon}`;
            }
        }
        return icon;
    }

    /**获取士兵类型图标
     * @param soldierId
     */
    getSoldierTypeIcon(soldierId: number): string {
        let icon = "";
        if (soldierId < 1000) {
            let cfg = ConfigManager.getItemById(SoldierCfg, soldierId);
            if (cfg) {
                icon = `icon/soldier/type_${cfg.type}`;
            } else {
                icon = `icon/soldier/type_${soldierId}`;
            }
        } else {
            let cfg = ConfigManager.getItemById(Monster2Cfg, soldierId);
            if (cfg) {
                icon = `icon/soldier/type_${cfg.show_type}`;
            }
        }
        return icon;
    }

    /**把一个节点及其所有子节点置灰
     * @param state 0:正常 1:置灰
     */
    setAllNodeGray(node: cc.Node, state: 0 | 1 = 0) {
        this.setGrayState(node, state);
        let n = node.childrenCount;
        if (n > 0) {
            let children = node.children;
            for (let i = 0; i < n; i++) {
                const child = children[i];
                if (cc.isValid(child) && child.active) {
                    this.setAllNodeGray(child, state);
                }
            }
        }
    }

    /**精灵高亮/置灰
     * @param state 0:正常 1:置灰
     */
    setGrayState(node: cc.Node | cc.Sprite | cc.Label, state: 0 | 1 = 0) {
        if (!node) {
            return
        }
        let sprite: cc.Sprite | cc.Label = null
        if (node instanceof cc.Node) {
            sprite = node.getComponent(cc.Sprite)
            if (!sprite) {
                sprite = node.getComponent(cc.Label)
            }
        } else if (node instanceof cc.Sprite) {
            sprite = node
        } else if (node instanceof cc.Label) {
            sprite = node
        }
        if (sprite && this.getGrayState(sprite) != state) {
            sprite.setMaterial(
                0,
                cc.Material['getBuiltinMaterial'](
                    state == 1 ? '2d-gray-sprite' : '2d-sprite'
                ),
            );
        }
    }

    getGrayState(node: cc.Node | cc.Sprite | cc.Label): 0 | 1 {
        if (!node) {
            return 0
        }
        let sprite: cc.Sprite | cc.Label = null
        if (node instanceof cc.Node) {
            sprite = node.getComponent(cc.Sprite)
        } else if (node instanceof cc.Sprite) {
            sprite = node
        } else if (node instanceof cc.Label) {
            sprite = node
        }
        if (sprite) {
            let m = sprite.getMaterial(0);
            let b = !m || StringUtils.startsWith(m.name, 'builtin-2d-sprite');
            return b ? 0 : 1;
        }
        return 0;
    }

    /**设置士兵spine */
    setSoldierSpineData(resNode: cc.Node, spine: sp.Skeleton, skin: string, release: boolean = true, standDir: string = "stand_s", isFadeIn: boolean = true) {
        let url: string = StringUtils.format(PveRes.PVE_SOLDIER_RES, skin);
        this.setSpineData(resNode, spine, url, release, standDir, true, isFadeIn);
    }

    /**设置士兵spine 用于UI上展示模型，高清*/
    setUiSoldierSpineData(resNode: cc.Node, spine: sp.Skeleton, skin: string, release: boolean = true, standDir: string = "stand_s", isFadeIn: boolean = true) {
        let url: string = StringUtils.format("spine/monster/{0}/ui/{0}", skin);
        this.setSpineData(resNode, spine, url, release, standDir, true, isFadeIn);
    }

    /**
     * 设置spine动画数据
     * @param resNode
     * @param spine
     * @param url
     * @param release
     * @param animation
     * @param loop
     * @param isFadeIn
     * @param callback
     */
    setSpineData(
        resNode: cc.Node,
        spine: sp.Skeleton,
        url: string,
        release?: boolean,
        animation?: string,
        loop?: boolean,
        isFadeIn?: boolean,
        callback?: (spine?: sp.Skeleton) => void,
    ) {
        const flag = '$curr_spine_path$';
        const cbflag = '$curr_spine_callback$';
        const cbargs = '$curr_spine_args$';
        let resId: string = gdk.Tool.getResIdByNode(resNode);
        let res = spine.skeletonData;
        if (res && url && res === gdk.rm.getResByUrl(url, sp.SkeletonData)) {
            // 标记资源为resId所依赖的资源
            gdk.rm.loadRes(resId, url, sp.SkeletonData);
            if (spine.animation != animation) {
                spine.loop = loop;
                spine.animation = animation;
            }
            callback && callback(spine);
        } else if (url && spine[flag] == url) {
            // 正在加载的内容与正在加载的内容相同
            spine[cbflag] = callback;
            spine[cbargs] = [release, animation, loop, isFadeIn];
        } else {
            // 更新SkeletonData资源
            if (release) {
                // 回收旧的资源
                if (res) {
                    // 资源已加载完成
                    gdk.rm.releaseRes(resId, res, sp.SkeletonData);
                } else if (spine[flag] && spine[flag] != url) {
                    // 资源正在加载中
                    gdk.rm.releaseRes(resId, spine[flag], sp.SkeletonData);
                    delete spine[flag];
                }
            }
            spine.node.stopActionByTag(9527);
            spine.node.active = !!url;
            spine.skeletonData = null;
            spine.premultipliedAlpha = false;
            // 标记并加载
            if (url) {
                spine[flag] = url;
                spine[cbflag] = callback;
                spine[cbargs] = [release, animation, loop, isFadeIn];
                gdk.rm.loadRes(resId, url, sp.SkeletonData, (res: sp.SkeletonData) => {
                    let [release, animation, loop, isFadeIn] = spine[cbargs];
                    if (cc.isValid(resNode) &&
                        cc.isValid(spine.node) &&
                        spine[flag] == url) {
                        // 节点有效并且与标记的资源相同
                        spine.skeletonData = res;
                        spine.loop = loop;
                        spine.animation = animation;
                        if (isFadeIn) {
                            let action = cc.fadeIn(0.25);
                            action.setTag(9527);
                            spine.node.opacity = 0;
                            spine.node.runAction(action);
                        }
                        spine[cbflag] && spine[cbflag](spine);
                    } else if (release) {
                        // 销毁资源
                        gdk.rm.releaseRes(resId, res, sp.SkeletonData);
                    }
                    // 清除标记
                    delete spine[flag];
                    delete spine[cbflag];
                    delete spine[cbargs];
                });
            } else {
                // 清除标记
                delete spine[flag];
                delete spine[cbflag];
                delete spine[cbargs];
            }
        }
    }

    /**
     * 保存本地变量
     * @param name
     * @param val
     * @param isSelf 是否每个用户单独保存
     */
    setLocal(name: string, val: any, isSelf: boolean = true) {
        let l = cc.sys.localStorage;
        if (isSelf) {
            let t = SdkTool.tool;
            let s = ModelManager.get(ServerModel).current;
            let m = ModelManager.get(RoleModel);
            let o = JSON.parse(l.getItem(name) || '{}');
            let id = `${s.serverId}#${t.channelId}#${t.account}#${m.id}`;
            o[id] = val;
            l.setItem(name, JSON.stringify(o));
        } else {
            if (typeof val === 'object') {
                val = JSON.stringify(val);
            }
            l.setItem(name, val)
        }
    }

    /**
     * 读取本地保存的变量
     * @param name
     * @param isSelf 是否每个用户独立
     * @param def 默认值
     */
    getLocal(name: string, isSelf: boolean = true, def?: any) {
        let l = cc.sys.localStorage;
        let r: any;
        if (isSelf) {
            let t = SdkTool.tool;
            let s = ModelManager.get(ServerModel).current;
            let m = ModelManager.get(RoleModel);
            let o = JSON.parse(l.getItem(name) || '{}');
            let id = `${s.serverId}#${t.channelId}#${t.account}#${m.id}`;
            r = o[id];
        } else {
            let v = l.getItem(name);
            try {
                v = JSON.parse(v);
            } catch (err) { };
            r = v;
        }
        return (r === void 0 || r === null) ? def : r;
    }



    /**
    * 保存Cookie变量
    * @param name
    * @param val
    */
    setCookie(name: string, val: any) {
        let model = ModelManager.get(RoleModel);
        let cookie = model.cookie;
        let obj = {};
        if (cookie) obj = JSON.parse(cookie);
        if (val) {
            obj[name] = val
        } else {
            if (obj[name]) delete obj[name]
        }
        model.cookie = JSON.stringify(obj);
        let req = new icmsg.RoleCookieSetReq();
        req.cookie = model.cookie;
        NetManager.send(req);
    }

    /**
     * 读取Cookie保存的变量
     * @param name
     */
    getCookie(name: string) {
        let model = ModelManager.get(RoleModel);
        let cookie = model.cookie;
        let obj = {};
        if (cookie) obj = JSON.parse(cookie);
        return obj[name] || null
    }

    getColorStr(str, color) {
        let colorStr = BagUtils.getColorInfo(color).color;
        return `<color=${colorStr}>${str}</c>`
    }

    /**传入数据，解析其中包含的属性，转为战斗力 (相关配置表global_power)
     * _w(white) 基础属性
     * _g(green) 附加属性
     * _r()      百分比 _w*_r值 附加属性2
     * isAddBase 是否把基础值计入 默认计入
     */
    getPowerValue(cfg: any, isAddBase: boolean = true): number {
        if (!cfg) return 0
        let powerValue = 0
        //顺序要一一对应
        let attr_wKeys = ["atk_speed_w", "atk_w", "hp_w", "def_w", "hit_w", "dodge_w", "crit_w", "hurt_w"]
        let attr_gKeys = ["atk_speed_g", "atk_g", "hp_g", "def_g", "hit_g", "dodge_g", "crit_g", "hurt_g"]
        let attr_rKeys = ["atk_speed_r", "atk_r", "hp_r", "def_r", "hit_r", "dodge_r", "crit_r", "hurt_r"]
        let attr_ulKeys = ["ul_atk_speed_w", "ul_atk_w", "ul_hp_w", "ul_def_w", "ul_hit_w", "ul_dodge_w", "ul_crit_w", "ul_hurt_w"]

        let cfg_keys = ["atk_speed", "atk", "hp", "def", "hit", "dodge", "crit", "hurt"]
        let other_keys = ["cold_res", "elec_res", "fire_res", "punc_res", "radi_res", "atk_res", "dmg_cold", "dmg_elec", "dmg_fire", "dmg_punc", "dmg_radi", "atk_dmg",
            "cold_res_fix", "elec_res_fix", "fire_res_fix", "punc_res_fix", "radi_res_fix", "atk_res_fix",
            "dmg_cold_fix", "dmg_elec_fix", "dmg_fire_fix", "dmg_punc_fix", "dmg_radi_fix", "atk_dmg_fix",
            "crit_v", "crit_v_res"]
        let vList = []
        for (let i = 0; i < attr_wKeys.length; i++) {
            let w = cfg[attr_wKeys[i]] ? cfg[attr_wKeys[i]] : 0
            let g = cfg[attr_gKeys[i]] ? cfg[attr_gKeys[i]] : 0
            let r = cfg[attr_rKeys[i]] ? cfg[attr_rKeys[i]] : 0
            let ul = cfg[attr_ulKeys[i]] ? cfg[attr_ulKeys[i]] : 0//精通的属性
            vList.push((isAddBase ? w : 0) * 100 + g * 100 + (w * r / 100) + ul * 100)
        }
        //基础
        for (let j = 0; j < cfg_keys.length; j++) {
            let config = ConfigManager.getItemById(Global_powerCfg, cfg_keys[j])
            powerValue += (cfg[cfg_keys[j]] ? cfg[cfg_keys[j]] : 0) * (config && config.value ? config.value : 0) * 100
        }

        //附加
        for (let j = 0; j < cfg_keys.length; j++) {
            let config = ConfigManager.getItemById(Global_powerCfg, cfg_keys[j])
            powerValue += vList[j] * (config && config.value ? config.value : 0)
        }

        //抗性 伤害战斗力转换计算
        for (let j = 0; j < other_keys.length; j++) {
            let config = ConfigManager.getItemById(Global_powerCfg, other_keys[j])
            powerValue += (cfg[other_keys[j]] ? cfg[other_keys[j]] : 0) * (config && config.value ? config.value : 0) * 100
        }

        return Math.floor(powerValue / 100);
    }

    /**
     * 货币判断 不够弹出提示
     * 金币 ---跳转商店购买
     * 钻石----跳转商店充值
     *
     * targetArg //弹窗
     * popViews [] 数组格式 panelId中的界面
     *
     * 返回 true 表示够钱
     *      false 表示不够钱
     */
    checkMoneyEnough(value, moneyType, targetArg?, popViews?, cancelFunc?: Function, callFunc?: Function): boolean {
        let itemCfg = ConfigManager.getItemById(ItemCfg, moneyType)
        if (!itemCfg) {
            gdk.gui.showMessage("货币类型不存在")
            return;
        }
        let hasNum = BagUtils.getItemNumById(moneyType);
        if (value > hasNum) {
            if ((moneyType != 2 && moneyType != 3) || !SdkTool.tool.can_charge) {
                // this.showMessageAndSound(`${itemCfg.name}不足`);
                GlobalUtil.openGainWayTips(itemCfg.id);
                return;
            }
            gdk.gui.showAskAlert(
                `您的${itemCfg.name}不足，是否前往购买？`,
                "提示",
                "",
                (index: number) => {
                    //关闭按钮
                    if (index == -1) {
                        if (cancelFunc) {
                            cancelFunc.call(this)
                        }
                    } else if (index == 1) {
                        //取消
                        if (cancelFunc) {
                            cancelFunc.call(this)
                        }
                    } else {
                        //确定
                        //关闭上一个窗口
                        if (targetArg) {
                            targetArg.close()
                        }

                        if (callFunc) {
                            callFunc.call(this)
                        }
                        // if (popViews) {
                        //     popViews.forEach(element => {
                        //         gdk.panel.hide(element)
                        //     });
                        // }
                        switch (moneyType) {
                            case 2://钻石
                                {
                                    if (popViews && popViews.length > 0) {
                                        JumpUtils.openPanel({
                                            panelId: PanelId.Recharge,
                                            panelArgs: { args: 3 },
                                            currId: popViews[0],
                                        });
                                    } else {
                                        JumpUtils.openRechargeView([3]);
                                    }

                                    break
                                }
                            case 3://金币
                                {
                                    if (popViews && popViews.length > 0) {
                                        JumpUtils.openPanel({
                                            panelId: PanelId.Alchemy,
                                            currId: popViews[0],
                                        });
                                    } else {
                                        JumpUtils.openAlchemyView(null);
                                        // JumpUtils.openStore([StoreMenuType.Gold])
                                    }
                                    break
                                }
                        }
                    }
                }, this, {
                cancel: "取消",
                ok: "确定"
            }
            )
            return false
        }

        return true
    }

    /**获取货币的数量 */
    getMoneyNum(moneyType): number {
        let roleModel = ModelManager.get(RoleModel);
        return roleModel[AttTypeName[moneyType]];
    }

    /**
     * 设置物品显示特效参数
     * @param list
     * @param delayShow //是否延迟显示
     * @param effect //是否显示特效
     * @param showCommonEffect //是否显示通用转圈特效
     * @param cxEffect //是否显示出现特效
     * @param isGet //是否已获得的，显示蒙版，获得状态
     */
    getEffectItemList(list: Array<icmsg.GoodsInfo>, delayShow: boolean = false, effect: boolean = false, showCommonEffect: boolean = false, cxEffect: boolean = true, isGet: boolean = false) {
        let newList = []
        list.forEach((element, index) => {
            newList.push({
                index: index,
                typeId: element.typeId,
                num: element.num,
                delayShow: delayShow,
                effect: effect,
                showCommonEffect: showCommonEffect,
                cxEffect: cxEffect,
                up: element['up'],
                isGet: isGet,
            });
        });
        return newList
    }

    /**计算装备的战斗力 */
    getEquipPower(bagItem: BagItem) {
        //基础战斗力
        let basePower = 0
        let equipCfg = ConfigManager.getItemById(Item_equipCfg, bagItem.itemId)
        basePower += this.getPowerValue(equipCfg)
        if (equipCfg.power && equipCfg.power > 0) {
            basePower += equipCfg.power
        }
        return basePower
    }

    /**获取system副本id限制提示语 */
    getSysFbLimitStr(id: any) {
        let cfg = CopyUtil.getStageConfig(id);
        let str = '';
        if (cfg.copy_id == CopyType.MAIN) {
            str = `通关主线${CopyUtil.getChapterId(id)}-${CopyUtil.getSectionId(id)}开启`;
        }
        else if (cfg.copy_id == CopyType.Rune) {
            str = `通关符文副本-${cfg.name}开启`;
        }
        return str;
    }

    /**提示瓢字 并播放声音 */
    showMessageAndSound(tips: string, targetNode?: cc.Node, soundId: ButtonSoundId = ButtonSoundId.invalid) {
        gdk.gui.showMessage(tips)
        let currNode = targetNode ? targetNode : gdk.gui.getCurrentView()
        this.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(currNode), soundId);
    }

    // 音效开关
    get isSoundOn(): boolean {
        return gdk.sound.isOn;
        // return (ModelManager.get(RoleModel).setting & (1 << RoleSettingValue.Effect)) == 0;
    }

    // 音乐开关
    get isMusicOn(): boolean {
        return gdk.music.isOn;
        // return (ModelManager.get(RoleModel).setting & (1 << RoleSettingValue.Music)) == 0;
    }

    /**vip经验换算vip等级 */
    getVipLv(exp): number {
        let vigCfgs = ConfigManager.getItems(VipCfg)
        for (let i = vigCfgs.length - 2; i >= 0; i--) {
            if (exp >= vigCfgs[i].exp) {
                return vigCfgs[i].level + 1
            }
        }
        return 0
    }

    saveOperateMap(key: string, isActive: boolean) {
        this.loginModel.operateMap[key] = isActive
    }

    //生成物品的描述
    makeItemDes(item_id: number) {
        let cfg = <ItemCfg>BagUtils.getConfigById(item_id);
        let str = '';
        if (cfg instanceof Tech_stoneCfg) {
            str = GlobalUtil.getSkillCfg(cfg.unique[0]).des;
        } else if (cfg instanceof HeroCfg) {
            str = cfg.desc
        }
        else {
            str = cfg.des;
            let args = cfg.func_args;
            let n: number = args ? args.length : 0;
            let func_args = "func_args";
            let disint_item = "disint_item";
            if (n > 0) {
                for (let i = 0; i < n; i++) {
                    str = StringUtils.replace(str, "{" + func_args + "}", args[i]);
                }
            } else {
                //非分解类型
                if (cfg.func_args == "" && cfg.disint_item.length > 0) {
                    let num = cfg.disint_item[0][1];
                    str = StringUtils.replace(str, "{" + disint_item + "}", num);
                }
            }
        }
        return str;
    }

    /**
     *
     * @param color 根据颜色配置 返回对应的颜色，isLabeloutLine 为 true 返回描边颜色
     * @param isLabeloutLine
     */
    getHeroNameColor(color, isLabeloutLine = false) {
        let colorStr = ""
        switch (color) {
            case 1:
                colorStr = isLabeloutLine ? "#1d620a" : "#d1ffd1"
                break
            case 2:
                colorStr = isLabeloutLine ? "#3171c7" : "#c3f2ff"
                break
            case 3:
                colorStr = isLabeloutLine ? "#b019b6" : "#ffd1fb"
                break
            case 4:
                colorStr = isLabeloutLine ? "#c65827" : "#fff9c3"
                break
            case 5:
                colorStr = isLabeloutLine ? "#b91314" : "#ffa78f"
                break
            default:
                colorStr = isLabeloutLine ? "#b91314" : "#ffa78f"
                break
        }
        return colorStr
    }

    /**
     * 数组 第一位 掉率 第二位 是否显示箭头
     * */
    getDropAddNum(cfg: Copy_stageCfg, itemId) {
        for (let i = 0; i < cfg.bonus.length; i++) {
            if (cfg.bonus[i][0] == itemId) {
                if (cfg.bonus[i][2]) {
                    return [cfg.bonus[i][1], cfg.bonus[i][2]]
                } else {
                    return [cfg.bonus[i][1], 0]
                }

            }
        }
        return [0, 0]
    }

    /**
     * 根据玩家id获取服务器id
     * @param playerId 
     */
    getSeverIdByPlayerId(playerId: number) {
        return Math.floor((playerId % (10000 * 100000)) / 100000)
    }

    /**
    * 根据公会id获取服务器id
    * @param guildId 
    */
    getSeverIdByGuildId(guildId: number) {
        return Math.floor((guildId % (10000 * 10000)) / 10000)
    }

    /** 
     * 根据玩家id获取渠道id
    */
    getChannelIdByPlayerId(playerId: number) {
        return Math.floor((playerId / (10000 * 100000)))
    }

    /**
   * 根据公会id获取渠道id
   * @param guildId 
   */
    getChannelIdByGuildId(guildId: number) {
        return Math.floor((guildId / (10000 * 10000)))
    }

    getGeneralSkillLv(skillId) {
        let lv = 0
        let generalModel = ModelManager.get(GeneralModel)
        let skills = generalModel.generalInfo.skills
        for (let i = 0; i < skills.length; i++) {
            if (skills[i].skillId == skillId) {
                lv = skills[i].skillLv
                break
            }
        }
        return lv
    }

    /**
     * 获取阵营图标
     * @param isBig 大图标
     */
    getGroupIcon(group: number, isBig: boolean = true) {
        return `icon/group/group${group}` + `${isBig ? '' : '_s'}`;
    }
}

// 常用的字体颜色
export const CommonNumColor = {
    red: cc.color("#FF1D1D"),
    green: cc.color("#5EE015"),
    white: cc.color("#FFFFFF"),
}

// 导出默认类
gdk.Tool.destroySingleton(iclib.GlobalUtilClass);
const GlobalUtil = gdk.Tool.getSingleton(GlobalUtilClass);
iclib.addProp('GlobalUtilClass', GlobalUtilClass);
iclib.addProp('GlobalUtil', GlobalUtil);
export default GlobalUtil;

