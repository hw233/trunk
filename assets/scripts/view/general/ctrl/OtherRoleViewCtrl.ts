import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GroupItemCtrl from '../../role/ctrl2/main/camp/GroupItemCtrl';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils, { StageKeys } from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import SkillPanelView from './SkillPanelView';
import StarItemCtrl from '../../../common/widgets/StarItemCtrl';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Hero_careerCfg, HeroCfg, Item_equipCfg } from '../../../a/config';

/**
 * @Description: 查看英雄信息
 * @Author: luoyong
 * @Date: 2019-07-19 16:45:14
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 11:50:59
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/general/OtherRoleViewCtrl")
export default class OtherRoleViewCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Label)
    heroName: cc.Label = null;

    @property(cc.Label)
    heroPower: cc.Label = null;

    @property(cc.Node)
    equipNodes: Array<cc.Node> = [];

    @property(cc.Node)
    starLayout: cc.Node = null; // 存放星星的

    @property(cc.Prefab)
    starItem: cc.Prefab = null;

    @property(cc.Node)
    groupLayout: cc.Node = null; // 存放阵营图标的

    @property(cc.Prefab)
    groupItem: cc.Prefab = null;

    @property(SkillPanelView)
    skillPanel: SkillPanelView = null;


    attLabs: Array<cc.Label> = [];      // 白字属性lab数组
    extLabs: Array<cc.Label> = [];      // 绿字属性lab数组
    stageLabs: Array<cc.Sprite> = [];    // 评级lab数组
    heroImge: icmsg.HeroImage = null;
    heroConfig: any = null;
    /**0:TD技能 1:卡牌技能 */
    curType: number = 0;

    equipCtrls: Array<UiSlotItem> = [];
    skillItems: Array<cc.Node> = [];
    kaSkills = [];//卡牌技能
    taSkills = []; //塔防技能

    get heroModel(): HeroModel { return ModelManager.get(HeroModel) }

    onLoad() {
        let labsNode = this.node.getChildByName("down").getChildByName("labs")
        for (let index = 0; index < 6; index++) {
            let stageLab = labsNode.getChildByName(`stageLab${index + 1}`)
            let attLab = labsNode.getChildByName(`attLab${index + 1}`)
            let extLab = labsNode.getChildByName(`extLab${index + 1}`)
            this.stageLabs[index] = stageLab.getComponent(cc.Sprite)
            this.attLabs[index] = attLab.getComponent(cc.Label)
            this.extLabs[index] = extLab.getComponent(cc.Label)
        }

        for (let index = 0; index < this.equipNodes.length; index++) {
            const element = this.equipNodes[index];
            this.equipCtrls[index] = element.getComponent(UiSlotItem)
            element.on(cc.Node.EventType.TOUCH_END, () => {
                this._equipClick(index)
            }, this)
        }

        if (this.starLayout.childrenCount == 0) {
            for (let index = 0; index < 7; index++) {
                let item = this._createStar()
                item.active = false
                this.starLayout.addChild(item)
            }
        }
    }

    onEnable() {

    }

    onDestroy() {
        gdk.e.targetOff(this)
        this.heroModel.heroImage = null;
    }

    start() {

    }

    /**更新英雄属性 */
    _updateHeroArr() {
        if (!this.node.active || !this.heroModel.heroImage) {
            return
        }

        let cfg: Hero_careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.heroModel.heroImage.careerId, null)
        // console.log("baseConfig", cfg)
        // 更新英雄属性等级
        for (let index = 0; index < this.stageLabs.length; index++) {
            const lab = this.stageLabs[index];
            let key = StageKeys[index]
            let val = cfg[key]
            let tInfo = HeroUtils.getGrowInfoById(key, val)
            let show = tInfo ? tInfo.show : "A"
            GlobalUtil.setSpriteIcon(this.node, lab, `common/texture/sub_pingji${show}`)
        }
        let attName = ["hpW", "atk_speed_W", "atkW", "defW", "hitW", "dodgeW"]
        let extName = ["hpG", "atk_speed_G", "atkG", "defG", "hitG", "dodgeG"]
        for (let index = 0; index < attName.length; index++) {
            const key = attName[index];
            const key2 = extName[index];
            if (key == "atk_speed_W") {
                let hero = ConfigManager.getItemById(HeroCfg, this.heroModel.heroImage.typeId)
                this.attLabs[index].string = hero.atk_speed.toString()
                this.extLabs[index].string = ``
            } else {
                let val = this.heroModel.heroImage[key]
                let val2 = this.heroModel.heroImage[key2]
                this.attLabs[index].string = val ? val : "0";
                this.extLabs[index].string = val2 ? `+${val2}` : "+0"
            }
        }
        this._updateEquip();
        this._updateStar();
        this._updateGroupInfo()
    }



    /**英雄装备 */
    _updateEquip() {
        for (let index = 0; index < 4; index++) {
            let ctrl = this.equipCtrls[index]
            let magicIcon = ctrl.node.getChildByName("magicIcon")
            magicIcon.active = false
            // for (let i = 0; i < this.heroImge.equips.length; i++) {
            //     let equipInfo = this.heroImge.equips[i]
            //     if (equipInfo) {
            //         let cfg = ConfigManager.getItemById(Item_equipCfg, equipInfo.typeId)
            //         同一部位
            //         if (cfg.part == index + 1) {
            //             ctrl.updateItemInfo(equipInfo.typeId);
            //             ctrl.updateStar(colorCfg.star + equipInfo.breakStar)
            //             if (equipInfo.magicId > 0) {
            //                 magicIcon.active = true
            //                 GlobalUtil.setSpriteIcon(ctrl.node, magicIcon, GlobalUtil.getMagicIcon(equipInfo.magicId))
            //             }
            //         }
            //     }
            // }
        }
    }

    _updateStar() {
        let nowCount = this.starLayout.childrenCount
        let starNum = this.heroImge.star || 0
        for (let index = 0; index < nowCount; index++) {
            let child = this.starLayout.children[index]
            if (index < this.heroConfig.star_max) {
                let scr: StarItemCtrl = child.getComponent(StarItemCtrl);
                child.active = true;
                // child.active = starNum > index
                scr.updateState(starNum > index ? 1 : 0)
                child.zIndex = -index;
            } else {
                child.active = false;
            }
        }

    }

    _createStar() {
        let item = cc.instantiate(this.starItem)
        let ctrl = item.getComponent(StarItemCtrl)
        ctrl.updateSize(36, 36)
        return item;
    }

    showHeroInfo(info: icmsg.HeroImage) {
        this.heroImge = info;

        this.heroConfig = ConfigManager.getItemById(HeroCfg, info.typeId)
        this.scheduleOnce(() => {
            HeroUtils.setSpineData(this.node, this.spine, this.heroConfig.skin)
        }, 0)

        this.heroName.string = this.heroConfig.name;
        this.heroPower.string = this.heroImge.power.toString();

        this._updateHeroArr();
        let heroInfo = new icmsg.HeroInfo()
        heroInfo.heroId = info.typeId;
        heroInfo.typeId = info.typeId;
        heroInfo.careerId = info.careerId;
        heroInfo.soldierId = info.soldierId;
        heroInfo.star = info.star;
        heroInfo.level = info.level;
        heroInfo.exp = 0
        heroInfo.slots = []
        heroInfo.power = info.power;
        // heroInfo.pveSsid = 0
        // heroInfo.pvpSsid = 0
        heroInfo.careerLv = info.careerLv;
        this.skillPanel.model.heroInfo = heroInfo
        this.skillPanel.model.heroDetail = new icmsg.HeroDetail()
    }

    /**装备点击 */
    _equipClick(index) {
        // for (let i = 0; i < this.heroImge.equips.length; i++) {
        //     let equipInfo = this.heroImge.equips[i]
        //     if (equipInfo) {
        //         let cfg = ConfigManager.getItemById(Item_equipCfg, equipInfo.typeId)
        //         //部位一致 
        //         if (cfg.part == index + 1) {
        //             equipInfo.equipId = equipInfo.typeId
        //             let itemData: BagItem = { series: 0, itemId: equipInfo.typeId, itemNum: 1, type: BagType.EQUIP, extInfo: equipInfo }
        //             GlobalUtil.openItemTips(itemData, true, true)
        //             break;
        //         }

        //     }
        // }
    }

    /**更新阵营图标 */
    _updateGroupInfo() {
        if (this.heroConfig) {
            let hero = this.heroConfig
            if (hero.group && hero.group.length > 0) {
                let nowCount = this.groupLayout.childrenCount
                this.groupLayout.children.forEach(node => {
                    node.active = false;
                })
                if (nowCount < hero.group.length) {
                    let tem = hero.group.length - nowCount
                    for (let index = 0; index < tem; index++) {
                        let item = cc.instantiate(this.groupItem)
                        item.active = false
                        this.groupLayout.addChild(item)
                    }
                }
                for (let i = 0; i < hero.group.length; i++) {
                    let item = this.groupLayout.children[i]
                    item.active = true;
                    let ctrl = item.getComponent(GroupItemCtrl)
                    ctrl.setGruopDate(hero.group[i], hero.id)
                }
            }
        }
    }

}
