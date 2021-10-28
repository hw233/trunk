import BagUtils from '../utils/BagUtils';
import ButtonSoundId from '../../configs/ids/ButtonSoundId';
import ConfigManager from '../managers/ConfigManager';
import GlobalUtil from '../utils/GlobalUtil';
import PanelId from '../../configs/ids/PanelId';
import UiListItem from './UiListItem';
import UiSlotItem from './UiSlotItem';
import { BagType } from '../models/BagModel';
import {
    Hero_starCfg,
    HeroCfg,
    Item_equipCfg,
    ItemCfg,
    RuneCfg,
    UniqueCfg
    } from '../../a/config';

/** 
  * @Description: 恭喜获得道具子项
  * @Author: weiliang.huang  
  * @Date: 2019-05-14 15:09:38 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-13 15:34:40
*/
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/common/widgets/RewardItem")
export default class RewardItem extends UiListItem {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Animation)
    showAni: cc.Animation = null
    @property(cc.Animation)
    jinAni: cc.Animation = null
    @property(cc.Animation)
    ziAni: cc.Animation = null
    @property(cc.Animation)
    tyAni: cc.Animation = null
    @property(sp.Skeleton)
    chipSpine: sp.Skeleton = null;
    @property(cc.Node)
    up: cc.Node = null

    @property(cc.Node)
    getNode: cc.Node = null

    @property(cc.Node)
    dropAddNode: cc.Node = null

    @property(cc.Label)
    lv: cc.Label = null;

    /**
     * data结构 index:xxxx, typeId: xxx, num: xxx, delayShow: xxx, effect: xxx
     */
    updateView() {
        let typeId: number;
        typeId = this.data.typeId.toString().length >= 8 ? parseInt(this.data.typeId.toString().slice(0, 6)) : this.data.typeId;
        let cfg = BagUtils.getConfigById(typeId);
        // 更新物品图标
        this.slot.starNum = 0
        this.slot.updateItemInfo(typeId, this.data.num);
        let itemType = BagUtils.getItemTypeById(typeId)
        let info = null;
        if (this.data.extInfo) {
            info = this.data.extInfo;
        }
        this.lv.node.active = false;
        // 物品为装备时，显示星星
        if (cfg instanceof Item_equipCfg) {
            //装备详情显示
            if (itemType == BagType.EQUIP) {
                if (this.data.extInfo) {
                    info = this.data.extInfo
                    this.slot.starNum = cfg.star;
                } else {
                    info = new icmsg.EquipInfo()
                    info.typeId = this.data.id
                    info.heroId = 0
                    info.equipId = 1
                    info.level = 1
                    this.slot.starNum = cfg.star;
                }
            }
        }
        // 物品为英雄时，显示星星
        if (cfg instanceof HeroCfg) {
            let starNum = 0
            starNum = this.data.typeId.toString().length >= 8 ? parseInt(this.data.typeId.toString().slice(6)) : cfg.star_min;
            if (this.data.realStar && this.data.realStar > 0) {
                starNum = this.data.realStar
            }
            let color = ConfigManager.getItemById(Hero_starCfg, starNum).color;
            this.slot.group = cfg.group[0];
            this.slot.starNum = starNum;
            this.slot.updateGroup(cfg.group[0]);
            this.slot.updateQuality(color);
            this.slot.updateStar(starNum);
            if (!gdk.panel.isOpenOrOpening(PanelId.HeroTransFormView)) {
                this.lv.node.active = true;
                this.lv.string = '1';
            }
        }
        if (cfg instanceof RuneCfg) {
            this.lv.node.active = true;
            this.lv.string = `.${cfg.level}`;
        }
        //守护者装备
        if (itemType == BagType.GUARDIANEQUIP) {
            if (this.data.extInfo) {
                let star = this.data.extInfo.star
                this.slot.updateStar(star)
                this.slot.starNum = star
                this.lv.node.active = true;
                this.lv.string = `.${this.data.extInfo.level}`;
            } else {
                let star = parseInt(this.data.typeId.toString().slice(7))
                this.slot.updateStar(star)
                this.slot.starNum = star
            }

        }

        //特权卡双倍标记
        if (this.up) {
            this.up.active = !!this.data['up'];
        }

        this.slot.itemInfo = {
            itemId: BagUtils.getItemTypeById(typeId) == BagType.RUNE ? this.data.typeId : typeId,
            series: typeId,
            type: BagUtils.getItemTypeById(typeId),
            itemNum: 1,
            extInfo: info,
        };
        this.slot.noBtn = true
        this.slot.isOther = true;


        //显示蒙版
        if (this.getNode) {
            this.getNode.active = this.data.isGet
        }

        //显示加倍效果
        if (this.dropAddNode) {
            if (this.data.dropAddNum) {
                this.dropAddNode.active = this.data.dropAddNum[0] ? true : false
                if (this.dropAddNode.active) {
                    let lab = this.dropAddNode.getChildByName("layout").getChildByName("addLab").getComponent(cc.Label)
                    lab.string = `掉落${this.data.dropAddNum[0]}%`

                    let arrow = this.dropAddNode.getChildByName("layout").getChildByName("arrow")
                    arrow.active = this.data.dropAddNum[1] > 0
                }
            }
        }





        // // 物品为宝石时，显示星星
        // if (cfg instanceof Item_rubyCfg) {
        //     this.slot.updateStar(cfg.level);
        // }
        // 动画效果
        this.ziAni && (this.ziAni.node.active = false);
        this.jinAni && (this.jinAni.node.active = false);
        this.tyAni && (this.tyAni.node.active = false);
        this.showAni && (this.showAni.node.active = false);
        this.chipSpine && (this.chipSpine.node.active = false)
        if (this.data.delayShow) {
            this.node.active = false;
            this.data.delayShow = false;    // 只在第一次延迟显示
            gdk.Timer.once(0.05 * this.data.index * 1000, this, () => {
                if (!cc.isValid(this.node)) return;
                if (!this.node) return;

                if (this.data.effect && GlobalUtil.isSoundOn) {
                    if (cfg.defaultColor == 3 || cfg.defaultColor == 4) {
                        gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.rare)
                    } else {
                        gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.common)

                    }
                }
                this.showEffectAnm();
            });
        } else {
            if (this.data.effect && GlobalUtil.isSoundOn) {
                if (cfg.defaultColor == 3 || cfg.defaultColor == 4) {
                    gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.rare)
                } else {
                    gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.common)

                }
            }
            this.showEffectAnm();
        }
    }

    // 播放出现动画
    showEffectAnm() {
        this.node.active = true;
        if (!this.data.effect) return;
        if (this.data.cxEffect && this.showAni) {
            this.data.cxEffect = false;
            this.showAni.node.active = true;
            this.showAni.on('finished', this.showItemPz, this);
            this.showAni.play();
        } else {
            this.showItemPz();
        }
    }

    // 设置品质动画
    showItemPz() {
        this.showAni && (this.showAni.node.active = false);
        // 播放品质特效
        let cfg = <any>BagUtils.getConfigById(this.data.typeId);

        if (cfg) {
            //碎片不要播放品质特效，本身就有特效了
            if (cfg instanceof ItemCfg && cfg.style && cfg.style == 1) {
                return
            }

            let colors = [[3], [4]];
            if (cfg instanceof UniqueCfg) {
                colors = [[], [4, 5]];
            }

            if (colors[0].indexOf(cfg.color) !== -1) {
                this.ziAni.node.active = true;
                this.ziAni.play();
            } else if (colors[1].indexOf(cfg.color) !== -1) {
                this.jinAni.node.active = true;
                this.jinAni.play();
            } else if (this.data.showCommonEffect) {
                this.tyAni.node.active = true;
                this.tyAni.play();
            }
        }
    }
}
