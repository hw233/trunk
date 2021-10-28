import BagUtils from '../utils/BagUtils';
import ButtonSoundId from '../../configs/ids/ButtonSoundId';
import ConfigManager from '../managers/ConfigManager';
import GlobalUtil from '../utils/GlobalUtil';
import HeroDetailViewCtrl from '../../view/lottery/ctrl/HeroDetailViewCtrl';
import HeroUtils from '../utils/HeroUtils';
import PanelId from '../../configs/ids/PanelId';
import UiListItem from './UiListItem';
import { BagItem, BagType } from '../models/BagModel';
import {
    CostumeCfg,
    Guardian_equip_starCfg,
    GuardianCfg,
    Hero_starCfg,
    HeroCfg,
    Item_equipCfg,
    ItemCfg,
    RuneCfg,
    Tech_stoneCfg
    } from '../../a/config';
import { MoneyType } from '../../view/store/ctrl/StoreViewCtrl';

/**
 * @Description: item项子类
 * @Author: weiliang.huang
 * @Date: 2019-04-01 13:44:01
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-13 15:22:49
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/UiSlotItem")
export default class UiSlotItem extends UiListItem {

    @property(cc.Label)
    UiNumLab: cc.Label = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Sprite)
    UiItemIcon: cc.Sprite = null;

    @property(cc.Node)
    UiQualityIcon: cc.Node = null;

    @property(cc.Node)
    starLayout: cc.Node = null;
    @property(cc.Node)
    maxStarNode: cc.Node = null;
    @property(cc.Label)
    maxStarLb: cc.Label = null;

    @property(cc.Prefab)
    starItem: cc.Prefab = null;

    @property(cc.Node)
    expTips: cc.Node = null;

    @property(cc.Node)
    previewNode: cc.Node = null;

    @property(cc.Node)
    groupIcon: cc.Node = null;

    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Node)
    lvLab: cc.Node = null;

    @property(cc.Node)
    mixRuneBIcon: cc.Node = null;

    @property(cc.Node)
    energyStoneBIcon: cc.Node = null;

    quality: number = -1
    itemId: number = 0;  // 道具id
    itemType: number = 0;    // 道具类型
    itemNum: number = 0; // 道具数量
    starNum: number = 0; //星星数量
    totalStarNum: number = 0//星星总数量
    group: number = 0; //阵营
    career: number = 0; //职业
    lv: number = 0;//等级
    itemIcon: string = "";   // 图标资源路径
    itemNumStr: string = "";
    itemNameStr: string = "";
    onClick: gdk.EventTrigger = gdk.EventTrigger.get();
    itemInfo: BagItem = null;   // 该项不为空时,点击道具会显示提示
    showGainWay = false;    // 是否显示成获取途径
    noBtn: boolean = false; // 是否没有按钮  没有分享
    isOther: boolean = false //是否其他人的

    isEffect: boolean = false;//其否开启品质特效
    hasEffect: boolean = false
    isCanPreview: boolean = false;

    onLoad() {
        // if (this.starLayout) {
        //     this.starLayout.getComponent(cc.Layout).spacingX = -12;
        // }
    }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this._listItemClick, this);
        if (this.itemId != 0) {
            this.updateItemInfo(this.itemId, this.itemNum, this.itemType);
            this.itemNum && this.updateNumLab(this.itemNum > 1 ? this.itemNum + '' : '');
            this.itemNameStr && this.updateItemName(this.itemNameStr);
        } else {
            this.updateItemIcon(this.itemIcon);
            this.updatePreview();
        }
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END, this._listItemClick, this);
        GlobalUtil.setSpriteIcon(this.node, this.UiQualityIcon, null);
        GlobalUtil.setSpriteIcon(this.node, this.UiItemIcon, null);
    }

    onDestroy() {
        this.onClick && this.onClick.release();
        this.onClick = null;
    }

    recycleItem() {
        super.recycleItem();
        this.quality = -1
        this.itemId = null;
        this.itemType = null;
        this.itemNum = null;
        this.starNum = null;
        this.totalStarNum = null
        this.group = null;
        this.itemIcon = "";
        this.itemNumStr = "";
        this.itemNameStr = "";
        this.itemInfo = null;
        this.starLayout.active = false;
        this.hasEffect = false
        this.isEffect = false
        GlobalUtil.setSpriteIcon(this.node, this.UiQualityIcon, null);
        GlobalUtil.setSpriteIcon(this.node, this.UiItemIcon, null);
    }

    /**icon高亮/置灰，0:正常 1:置灰 */
    setGray(state: 0 | 1) {
        GlobalUtil.setGrayState(this.UiItemIcon, state)
    }

    /**
     * 更新格子信息
     * @param id 道具id
     * @param num 道具数量
     * @param type 道具类型
     */
    updateItemInfo(id: number, num: number = 0, type?: BagType) {
        this.itemId = id;
        this.itemNum = num;
        this.itemType = type;
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        // 因为有多个类型,这里强转成any避免下面报红
        let cfg = BagUtils.getConfigById(id, type);

        if (cfg) {
            this.UiItemIcon.node.active = true;
            this.updateQuality(cfg.defaultColor || cfg.color);
            this.updateItemIcon(GlobalUtil.getIconById(id, type));
        } else {
            this.itemInfo = null;
            this.updateQuality();
            this.updateItemIcon();
        }

        this.setGray(0);
        this.updateNumLab(num > 1 ? num + '' : '');
        this.updateItemName('');
        this.updatExpTips(id);
        this.updatePreview();
        this.updateMixRuneIcon();
        this.updateEnergyStoneBIcon();

        if (cfg instanceof ItemCfg && cfg.random_hero_chip && cfg.random_hero_chip.length >= 2) {
            this.updateGroup(cfg.random_hero_chip[0]);
            this.updateStar(cfg.random_hero_chip[1]);
        }
        else {
            this.updateGroup(this.group);
            if (cfg instanceof Item_equipCfg) {
                this.updateStar(cfg.star, this.totalStarNum);
            }
            else if (cfg instanceof GuardianCfg) {
                this.updateStar(cfg.star_min, cfg.star_max);
            }
            else {
                this.updateStar(this.starNum, this.totalStarNum);
            }
        }

        if (cfg instanceof ItemCfg && cfg.career) {
            this.updateCareer(cfg.career);
        }
        else {
            this.updateCareer(this.career);
        }

        if (cfg instanceof CostumeCfg) {
            this.updateCostumeType(cfg.type)
        }

        // if (cfg && cfg instanceof RuneCfg) {
        //     if (!this.lvLab) {
        //         this.lvLab = new cc.Node();
        //         this.lvLab.active = true;
        //         let lab = this.lvLab.addComponent(cc.Label);
        //         this.lvLab.parent = this.node;
        //         this.lvLab.setAnchorPoint(1, .5);
        //         this.lvLab.setPosition(48.01, 34.962);
        //         lab.fontSize = 15;
        //         lab.lineHeight = 25;
        //         let url = "common/font/DengjiWithLFont";
        //         let resId = gdk.Tool.getResIdByNode(this.node);
        //         let res = gdk.rm.getResByUrl(url, cc.Font, resId);
        //         let txt = cfg.level;
        //         if (!res) {
        //             gdk.rm.loadRes(resId, url, cc.Font, (res: cc.Font) => {
        //                 if (!cc.isValid(this.node)) return;
        //                 lab.font = res;
        //                 lab.string = '.' + txt;
        //             });
        //             return;
        //         }
        //     }
        //     else {
        //         this.lvLab.active = true;
        //         this.lvLab.getComponent(cc.Label).string = '.' + cfg.level;
        //     }
        // }
        // else {
        //     this.lvLab && (this.lvLab.active = false);
        // }
        if (this.lvLab) {
            if (cfg && cfg instanceof RuneCfg) {
                this.lvLab.active = true;
                this.lvLab.getComponent(cc.Label).string = '.' + cfg.level;
            } else if (cfg && cfg instanceof GuardianCfg) {
                this.lvLab.active = true;
                this.lvLab.getComponent(cc.Label).string = '.' + 1;
            } else {
                if (this.lv > 0) {
                    this.lvLab.active = true;
                    this.lvLab.getComponent(cc.Label).string = '.' + this.lv;
                } else {
                    this.lvLab.active = false;
                }
            }
        }
    }

    /**更新数量Label */
    updateNumLab(numStr: string = "", scale?: number, color?: cc.Color) {
        if (!numStr) {
            this.UiNumLab.node.active = false;
            return;
        }
        this.itemNumStr = numStr;
        this.UiNumLab.node.active = true;

        //金币显示
        if (this.itemNumStr.indexOf("/") == -1) {
            if (this.itemId == MoneyType.Gold || this.itemId == MoneyType.Exp || this.itemId == MoneyType.HeroExp || (this.itemNumStr.length > 6 && this.itemNumStr.indexOf("/") == -1)) {
                let numInt = parseInt(numStr)
                if (this.UiNumLab.font && (this.UiNumLab.font.name == "bagNumFont" || this.UiNumLab.font.name == "DengjiFont")) {
                    numStr = GlobalUtil.numberToStr(numInt, true, true)
                } else {
                    numStr = GlobalUtil.numberToStr(numInt, true, false)
                }
            }
        }
        this.UiNumLab.string = numStr;
        if (scale) {
            this.UiNumLab.node.scale = scale;
        }
        if (color) {
            this.UiNumLab.node.color = color;
        }

    }

    /**更新icon */
    updateItemIcon(path: string = "") {
        this.itemIcon = path;
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        if (!this.UiItemIcon) return;
        this.UiItemIcon.node.active = !!path
        if (!path) {
            this.mixRuneBIcon && (this.mixRuneBIcon.active = false);
            this.energyStoneBIcon && (this.energyStoneBIcon.active = false);
        }
        else {
            this.updateMixRuneIcon();
            this.updateEnergyStoneBIcon();
        }
        GlobalUtil.setSpriteIcon(this.node, this.UiItemIcon, path);

        let iconBg = this.node.getChildByName("iconBg")
        if (iconBg) {
            iconBg.active = !this.itemIcon
        }
    }

    /**更新品质框 */
    updateQuality(color: number = -1) {
        this.quality = color;
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        if (!this.UiItemIcon) return;
        if (!this.UiQualityIcon) return;
        let path = color >= 0 ? `common/texture/sub_itembg0${color}` : null;
        // 因为有多个类型,这里强转成any避免下面报红
        let temType = this.itemType;
        if (!this.itemType) {
            temType = BagUtils.getItemTypeById(this.itemId)
        }
        if (temType == BagType.ITEM) {
            let cfg = BagUtils.getConfigById(this.itemId, this.itemType) as ItemCfg;
            if (cfg && cfg.style && cfg.style == 1) {//类型为1 显示对应类型碎片底框
                path = color >= 0 ? `common/texture/bb_itembg0${color}` : null;
            }

            if (cfg && cfg["exclusive"] && cfg.color >= 3) {
                path = `common/texture/es_itembg0${color}`
            }

            //兵头像
            if (Math.floor(this.itemId / 1000) == 161) {
                if (this.UiItemIcon.node.scale == 1 && this.UiItemIcon.node.width == this.UiQualityIcon.width && this.UiItemIcon.node.height == this.UiQualityIcon.height) {
                    this.UiItemIcon.node.scale = 0.9
                }
            }
        } else if (temType == BagType.HERO || temType == BagType.GUARDIAN) {
            //修复部分头像过大显示
            if (this.UiItemIcon.node.scale == 1 && this.UiItemIcon.node.width == this.UiQualityIcon.width && this.UiItemIcon.node.height == this.UiQualityIcon.height) {
                this.UiItemIcon.node.scale = 0.9
            }
        }
        this.UiQualityIcon.active = !!path;
        GlobalUtil.setSpriteIcon(this.node, this.UiQualityIcon, path);

        //指定装备显示特效
        let effectNode = this.UiItemIcon.node.getChildByName("effect")
        if (temType == BagType.EQUIP || temType == BagType.ITEM || temType == BagType.RUNE || temType == BagType.UNIQUEEQUIP) {
            let cfg = BagUtils.getConfigById(this.itemId, this.itemType)
            if (cfg && cfg["effects"]) {
                if (!effectNode) {
                    effectNode = new cc.Node()
                    effectNode.name = "effect"
                    let spine = effectNode.addComponent(sp.Skeleton)
                    spine.premultipliedAlpha = false
                    this.UiItemIcon.node.addChild(effectNode)
                    GlobalUtil.setSpineData(effectNode, spine, "spine/ui/UI_zhuangbeiguangxiao/UI_zhuangbeiguangxiao", true, "stand", true)
                } else {
                    effectNode.active = true
                }
            } else {
                if (effectNode) {
                    effectNode.active = false
                }
            }
        } else {
            if (effectNode) {
                effectNode.active = false
            }
        }


        //碎片特效
        let isChipEffect = false
        let chipEffectNode = this.UiItemIcon.node.getChildByName("chipEffect")
        if (chipEffectNode) {
            this.UiItemIcon.node.removeChild(chipEffectNode)
            chipEffectNode = null
        }
        if (temType == BagType.ITEM) {
            let cfg = BagUtils.getConfigById(this.itemId, this.itemType) as ItemCfg
            if (cfg && cfg.style && cfg.style == 1 && cfg.color >= 3) {
                if (!chipEffectNode) {
                    chipEffectNode = new cc.Node()
                    chipEffectNode.name = "chipEffect"
                    let spine = chipEffectNode.addComponent(sp.Skeleton)
                    spine.premultipliedAlpha = false
                    this.UiItemIcon.node.addChild(chipEffectNode)
                    let action = color > 3 ? "stand" : "stand2"
                    GlobalUtil.setSpineData(chipEffectNode, spine, "spine/ui/UI_suipian/UI_suipian", true, action, true)
                } else {
                    chipEffectNode.active = true
                }
                isChipEffect = true
            } else {
                if (chipEffectNode) {
                    chipEffectNode.active = false
                }
            }
        }

        if (this.isEffect && !isChipEffect) {
            this.qualityEffect(color);
        }
    }

    updateGroup(group: number = -1) {
        this.groupIcon && (this.groupIcon.active = false);
        if (!this.itemId || group <= 0) return;
        if (!this.groupIcon) {
            this.groupIcon = new cc.Node();
            this.groupIcon.addComponent(cc.Sprite);
            this.groupIcon.parent = this.node;
            this.groupIcon.setScale(.8);
        }
        // this.group = group;
        this.groupIcon.active = true;
        let pos = this.node.getChildByName('iconBg').getPosition()
        this.groupIcon.setScale(.8);
        this.groupIcon.setPosition(pos.x - 36, pos.y + 37);
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, GlobalUtil.getGroupIcon(group, false));
    }

    updateCareer(career: number = -1) {
        this.careerIcon && (this.careerIcon.active = false);
        if (!this.itemId || career <= 0) return;
        if (!this.careerIcon) {
            this.careerIcon = new cc.Node();
            this.careerIcon.addComponent(cc.Sprite);
            this.careerIcon.parent = this.node;
            this.careerIcon.setScale(.8);
            let pos = this.node.getChildByName('iconBg').getPosition()
            this.careerIcon.setPosition(pos.x - 33, pos.y - 2);
        }
        // this.career = career;
        this.careerIcon.active = true;
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/career_${career}`);
    }

    qualityEffect(color: number) {
        let animNode = this.node.getChildByName("animate");
        let animName;
        switch (color) {
            case 2: animName = "icon_pzgty"; break;
            case 3: animName = "icon_pzgzi"; break;
            case 4: animName = "icon_pzgjin"; break;
            default:
                animNode && (animNode.active = false);
                return;
        }
        let resId = gdk.Tool.getResIdByNode(this.node);
        let playFunc = function (animNode, animName: string) {
            let animation = animNode.getComponent(cc.Animation);
            let url = "common/anim/iconguang/" + animName;
            gdk.rm.loadRes(resId, url, cc.AnimationClip, (clip: cc.AnimationClip) => {
                if (!cc.isValid(this.node)) return;
                if (!cc.isValid(animNode)) return;
                if (clip !== gdk.rm.getResByUrl(url, cc.AnimationClip)) return;
                animation.addClip(clip, animName);
                let animState = animation.play(animName);
                animState.wrapMode = cc.WrapMode.Loop;
                animState.repeatCount = Infinity;
            });
        }

        if (!animNode) {
            let url = "common/anim/iconguang/icon_pzgjin";
            gdk.rm.loadRes(resId, url, cc.Prefab, (prefab: cc.Prefab) => {
                if (!cc.isValid(this.node)) return;
                if (prefab !== gdk.rm.getResByUrl(url, cc.Prefab)) return;
                let animNode = cc.instantiate(prefab);
                if (animNode && !this.hasEffect) {
                    this.hasEffect = true
                    animNode.name = 'animate';
                    this.node.addChild(animNode);
                    playFunc.apply(this, [animNode, animName]);
                }
            })
            return;
        }
        animNode.active = true;
        playFunc.apply(this, [animNode, animName]);
    }

    /**更新名字 */
    updateItemName(name: string = "", scale: number = 0) {
        this.itemNameStr = name;
        if (!this.nameLab) return;
        if (!name) {
            this.nameLab.node.active = false;
        } else {
            this.nameLab.node.active = true;
            this.nameLab.string = name;
            if (scale) {
                this.nameLab.node.scale = scale;
            }
        }
    }

    /**更新星星数量 */
    updateStar(starNum: number = 0, total: number = 5, showbg?: boolean) {
        if (!cc.isValid(this.node)) return;
        if (!this.node.active) return;
        if (starNum == 0 && !showbg) {
            // 不显示星星，也不显示背景
            this.starLayout.active = false;
            this.maxStarNode && (this.maxStarNode.active = false);
            return;
        }
        this.totalStarNum = total
        // this.starNum = starNum;
        // 添加
        this.starLayout.active = true;
        this.maxStarNode ? this.maxStarNode.active = false : 0;
        let starNode = this.starLayout;
        if (starNode.getComponent(cc.Layout)) {
            starNode.removeComponent(cc.Layout);
        }
        let starTxt = starNum > 5 ? '1'.repeat(starNum - 5) : '0'.repeat(starNum);
        let starLabel: cc.Label = starNode.getComponent(cc.Label);
        if (!starLabel) {
            starNode.addComponent(cc.Label);
            starLabel = starNode.getComponent(cc.Label);
            starLabel.fontSize = 20;
            starLabel.spacingX = -10;
            starLabel.lineHeight = 30;
        }
        let resId = gdk.Tool.getResIdByNode(this.node);
        let url = "common/font/HeroStarFont";
        let res = gdk.rm.getResByUrl(url, cc.Font, resId);
        if (!res) {
            gdk.rm.loadRes(resId, url, cc.Font, (res: cc.Font) => {
                if (!cc.isValid(this.node)) return;
                starLabel.font = res;
                starLabel.string = starTxt;
            });
            return;
        }
        starLabel.spacingX = -10;
        starLabel.font = res;
        starLabel.string = starTxt;

        let type = BagUtils.getItemTypeById(this.itemId)
        if (starNum >= 12 && this.maxStarNode) {
            this.starLayout.active = false;
            this.maxStarNode.active = true;
            this.maxStarLb.string = (starNum - 11) + ''
        }
        if (type == BagType.HERO) {
            this.updateQuality(ConfigManager.getItemById(Hero_starCfg, starNum).color);
            if (starNum >= 12) {
                let heroCfg = ConfigManager.getItemById(HeroCfg, this.itemId)
                if (heroCfg.awake) {
                    this.updateItemIcon(HeroUtils.getHeroHeadIcon(this.itemId, starNum))
                }
            }
        } else if (type == BagType.COSTUME || type == BagType.UNIQUEEQUIP) {
            let resId = gdk.Tool.getResIdByNode(this.node);
            let url = "view/role/font/costumeFont";
            let res = gdk.rm.getResByUrl(url, cc.Font, resId);
            if (!res) {
                gdk.rm.loadRes(resId, url, cc.Font, (res: cc.Font) => {
                    if (!cc.isValid(this.node)) return;
                    starLabel.font = res;
                    starLabel.spacingX = 0;
                    starLabel.string = starTxt;
                });
                return;
            }
            starLabel.font = res;
            starLabel.spacingX = 0;
            starLabel.string = starTxt;
        } else if (type == BagType.GUARDIANEQUIP) {
            this.updateQuality(ConfigManager.getItemByField(Guardian_equip_starCfg, "star", starNum).color);
        }
        // let nowCount = this.starLayout.childrenCount;
        // for (let i = nowCount; i < total; i++) {
        //     let item = this._createStar();
        //     item.active = showbg;
        //     this.starLayout.addChild(item);
        // }
        // // 隐藏
        // for (let i = total; i < nowCount; i++) {
        //     let child = this.starLayout.children[i];
        //     child.active = false;
        // }
        // // 刷新
        // for (let i = 0; i < total; i++) {
        //     let child = this.starLayout.children[i];
        //     let scr = child.getComponent(StarItemCtrl);
        //     child.active = showbg || i < starNum;
        //     scr.updateState(i < starNum ? 1 : 0);
        // }
    }

    updatExpTips(id) {
        if (this.expTips) {
            let idx = [100008, 100009, 100010, 100011].indexOf(id);
            if (idx != -1) {
                this.expTips.active = true;
                this.expTips.getChildByName('label').getComponent(cc.Label).string = ['2小时', '6小时', '12小时', '24小时'][idx];
            }
            else {
                this.expTips.active = false;
            }
        }
    }

    updatePreview() {
        if (!this.previewNode) {
            let node = this.node.getChildByName('previewBtn');
            node && (node.active = false);
            return;
        }
        if (this.isCanPreview && this.itemId && BagUtils.getItemTypeById(this.itemId) == BagType.HERO) {
            this.previewNode.active = true;
        }
        else {
            this.previewNode.active = false;
        }
    }

    showHeroTip() {
        if (this.itemId && BagUtils.getItemTypeById(this.itemId) == BagType.HERO) {
            let heroCfg = ConfigManager.getItemById(HeroCfg, this.itemId);
            gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
                let comp = node.getComponent(HeroDetailViewCtrl)
                comp.initHeroInfo(heroCfg)
            })
        }
    }

    // _createStar() {
    //     let item = gdk.pool.get(RolePoolKeys.UI_SLOT_STAR);
    //     if (!item) {
    //         item = cc.instantiate(this.starItem);
    //         item.active = true;
    //     }
    //     let ctrl = item.getComponent(StarItemCtrl);
    //     ctrl.updateSize(24, 24);
    //     return item;
    // }

    _listItemClick() {
        (this.itemId > 0 || this.itemInfo) && gdk.sound.isOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.click)
        // if (this.showGainWay) {
        //     let cfg = ConfigManager.getItemById(ItemCfg, this.itemInfo.itemId)
        //     if (cfg) {
        //         if ((cfg.get && cfg.get.length > 0) ||
        //             (cfg.stage_id && cfg.stage_id.length > 0)
        //         ) {
        //             GlobalUtil.openGainWayTips(this.itemInfo);
        //             this.onClick.emit();
        //             return;
        //         }
        //     }
        // }
        if (this.itemInfo) {
            if (BagUtils.getItemTypeById(this.itemId) == BagType.GUARDIANEQUIP) {
                if (!this.itemInfo.extInfo) {
                    let guardianEquipInfo = new icmsg.GuardianEquip()
                    guardianEquipInfo.id = this.itemId
                    guardianEquipInfo.type = this.itemId
                    guardianEquipInfo.level = 1
                    guardianEquipInfo.star = this.starNum
                    this.itemInfo.extInfo = guardianEquipInfo
                }
            }
            GlobalUtil.openItemTips(this.itemInfo, this.noBtn, this.isOther);
        }
        this.onClick.emit();
    }


    /**更新神装类型  用groupIcon 两者不会共存 */
    updateCostumeType(suitType) {
        if (suitType <= 0) return
        this.groupIcon && (this.groupIcon.active = false);
        if (!this.groupIcon) {
            this.groupIcon = new cc.Node();
            this.groupIcon.addComponent(cc.Sprite);
            this.groupIcon.parent = this.node;
            this.groupIcon.setScale(.8);
        }
        let pos = this.node.getChildByName('iconBg').getPosition()
        this.groupIcon.setPosition(pos.x + 33, pos.y - 38);
        this.groupIcon.active = true;
        GlobalUtil.setSpriteIcon(this.node, this.groupIcon, `view/role/texture/costume/suit/sz_icon_${suitType}_s`);
    }

    updateMixRuneIcon() {
        let cfg = BagUtils.getConfigById(this.itemId);
        if (cfg && cfg instanceof RuneCfg && !!cfg.mix_type) {
            if (!this.mixRuneBIcon) {
                this.mixRuneBIcon = new cc.Node();
                this.mixRuneBIcon.addComponent(cc.Sprite);
                this.mixRuneBIcon.setPosition(35, -38);
                this.mixRuneBIcon.parent = this.node;
            }
            this.mixRuneBIcon.active = true;
            GlobalUtil.setSpriteIcon(this.node, this.mixRuneBIcon, `common/texture/role/rune/${cfg.mix_type}`);
        }
        else {
            this.mixRuneBIcon && (this.mixRuneBIcon.active = false);
        }
    }

    updateEnergyStoneBIcon() {
        let cfg = BagUtils.getConfigById(this.itemId);
        if (cfg && cfg instanceof Tech_stoneCfg) {
            if (!this.energyStoneBIcon) {
                this.energyStoneBIcon = new cc.Node();
                this.energyStoneBIcon.addComponent(cc.Sprite);
                this.energyStoneBIcon.setPosition(0, 0);
                this.energyStoneBIcon.parent = this.node;
            }
            this.energyStoneBIcon.active = true;
            GlobalUtil.setSpriteIcon(this.node, this.energyStoneBIcon, `common/texture/bingying/stone/${cfg.type}`);
        }
        else {
            this.energyStoneBIcon && (this.energyStoneBIcon.active = false);
        }
    }
}
