import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil, { CommonNumColor } from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from '../skill/SkillInfoPanelCtrl';
import SoldierViewCtrl from '../../../../bingying/ctrl/SoldierViewCtrl';
import StarItemCtrl from '../../../../../common/widgets/StarItemCtrl';
import StringUtils from '../../../../../common/utils/StringUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { AskInfoCacheType } from '../../../../../common/widgets/AskPanel';
import { BagEvent } from '../../../../bag/enum/BagEvent';
import { BagItem, BagType } from '../../../../../common/models/BagModel';
import {
    Hero_career_descCfg,
    Hero_careerCfg,
    HeroCfg,
    Item_composeCfg,
    SoldierCfg
    } from '../../../../../a/config';
import { RoleEventId } from '../../../enum/RoleEventId';

/*
   //职业进阶
 * @Author: luoyong 
 * @Date: 2020-02-27 10:33:07 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-02-04 20:23:54
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/career/RoleCareerCtrl2")
export default class RoleCareerCtrl2 extends gdk.BasePanel {

    @property(cc.Node)
    attNode: cc.Node = null

    @property(cc.Node)
    careerIcon: cc.Node = null

    @property(cc.Label)
    careerLvLab: cc.Label = null

    @property(cc.Node)
    materialNode: cc.Node = null

    @property(cc.Node)
    arrowNode: cc.Node = null

    @property(cc.Node)
    nextLabNode: cc.Node = null

    @property(cc.Node)
    addLabNode: cc.Node = null

    @property(cc.Node)
    unLockNode: cc.Node = null

    @property(cc.Node)
    masterTipNode: cc.Node = null

    @property(StarItemCtrl)
    careerLvNode: Array<StarItemCtrl> = []

    @property(cc.Node)
    soldierTypeIcon: cc.Node = null

    @property(cc.Label)
    careerDesc: cc.Label = null

    @property(cc.Button)
    btnChange: cc.Button = null

    @property(cc.Button)
    btnUp: cc.Button = null

    @property(cc.Node)
    unlockLayout: cc.Node = null

    @property(cc.Prefab)
    skillItem: cc.Prefab = null

    @property(cc.Prefab)
    soldierItem: cc.Prefab = null

    @property(cc.Prefab)
    masterItem: cc.Prefab = null

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Label)
    tipLab: cc.Label = null

    curAttLabs: Array<cc.Label> = []
    nextAttLabs: Array<cc.Label> = []
    addAttLabs: Array<cc.Label> = []
    careerId: number = 0
    curLv: number = 0
    maxLv: number = 0    // 最大等级
    needHeroLv: number = 0  // 升级需要的英雄等级

    mSlots: UiSlotItem[] = []
    materialItems: any[] = []
    itemKey: any = {} // 材料id-index表
    isCanUp: boolean = true

    get heroModel() { return ModelManager.get(HeroModel); }
    get heroInfo() { return this.heroModel.curHeroInfo; }

    onLoad() {
        HeroUtils.initJobRelatedInfo()
        for (let index = 0; index < 5; index++) {
            let node = this.attNode.getChildByName("layout")
            let curNode = node.getChildByName("curNode")
            let nextNode = node.getChildByName("nextNode")
            let addNode = node.getChildByName("addNode")
            let curLab = curNode.getChildByName(`curLab${index + 1}`).getComponent(cc.Label)
            let nextLab = nextNode.getChildByName(`nextLab${index + 1}`).getComponent(cc.Label)
            let addLab = addNode.getChildByName(`addLab${index + 1}`).getComponent(cc.Label)
            this.curAttLabs[index] = curLab
            this.nextAttLabs[index] = nextLab
            this.addAttLabs[index] = addLab
        }
        this.btnChange.enabled = false
    }

    onEnable() {
        gdk.e.on(RoleEventId.UPDATE_HERO_ATTR, this._updateCareerInfo, this)
        gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this._updateCareerInfo, this)
        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, (e: gdk.Event) => {
            if (!this.node.active) {
                return
            }
            this._updateCareerInfo()
            let item: BagItem = e.data
            let idx = this.itemKey[item.itemId]
            if (cc.js.isNumber(idx)) {
                this._updateMaterNum(idx)
            }
        }, this)
        this._updateCareerInfo()

        gdk.e.on(RoleEventId.SHOW_JOB_RESULT_EFFECT, this._showJobResultEffect, this)

        gdk.Timer.once(500, this, () => {
            this.btnChange.enabled = true
        })

    }

    onDisable() {
        gdk.e.targetOff(this);
        gdk.Timer.clearAll(this)
    }

    /**更新职业信息 */
    @gdk.binding("heroModel.curHeroInfo")
    _updateCareerInfo() {
        gdk.Timer.callLater(this, this._updateCareerInfoLater)
    }

    _updateCareerInfoLater() {
        if (!cc.isValid(this.node)) return;

        if (this.careerId != this.heroInfo.careerId) {
            this.careerId = this.heroInfo.careerId
        }

        let level = HeroUtils.getHeroJobLv(this.heroInfo.heroId, this.careerId)
        this.curLv = level
        this.maxLv = HeroUtils.getJobMaxLv(this.careerId)
        let curCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.careerId, { career_lv: level })
        let nextCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.careerId, { career_lv: level + 1 })
        GlobalUtil.setSpriteIcon(this.node, this.soldierTypeIcon, GlobalUtil.getSoldierTypeIcon(curCfg.career_type))
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, GlobalUtil.getCareerIcon(this.careerId))
        // let rankNameArr = ["初级", "中级", "高级"];
        // this.careerLvLab.string = `${rankNameArr[curCfg.rank]}`
        let careerDescCfg = ConfigManager.getItemByField(Hero_career_descCfg, "name", curCfg.name)
        this.careerDesc.string = careerDescCfg ? careerDescCfg.desc : ""
        let image = this.btnUp.node.getChildByName("yx_jj")
        this.tipLab.node.active = false
        if (!nextCfg) {
            this.btnUp.enabled = false
            GlobalUtil.setGrayState(this.btnUp.node, 1)
            GlobalUtil.setGrayState(image, 1)
            this.materialNode.active = false
            this.arrowNode.active = false
            this.nextLabNode.active = false
            this.addLabNode.active = false
            this.unLockNode.active = false
            this.masterTipNode.active = true

        } else {
            this.btnUp.enabled = true
            GlobalUtil.setGrayState(this.btnUp.node, 0)
            GlobalUtil.setGrayState(image, 0)
            this.materialNode.active = true
            this.arrowNode.active = true
            this.nextLabNode.active = true
            this.addLabNode.active = true
            this.unLockNode.active = true
            this.masterTipNode.active = false

            this.needHeroLv = nextCfg.hero_lv
            this._updateMaterials(nextCfg)

            if (this.heroInfo.level < this.needHeroLv) {
                this.tipLab.node.active = true
                this.tipLab.string = StringUtils.format(gdk.i18n.t("i18n:HERO_TIP11"), this.needHeroLv)//`英雄等级Lv.${this.needHeroLv}可继续进阶`
            }
        }

        this._updateNextCareerInfo()
        this._updateAttInfo(curCfg, nextCfg)
        this._updateStarNum()

        let heroConfig = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId);
        this.spine.node.scaleX = this.spine.node.scaleY = heroConfig.size_ui
        this.spine.node.x = heroConfig.coordinate[0]
        this.spine.node.y = heroConfig.coordinate[1]
        HeroUtils.setSpineData(this.node, this.spine, heroConfig.skin, true, false);
        this.spine.paused = true
    }

    _updateNextCareerInfo() {
        let level = HeroUtils.getHeroJobLv(this.heroInfo.heroId, this.careerId)
        let maxLv = HeroUtils.getJobMaxLv(this.careerId)
        let nextLv = level
        let nextCareerId = this.careerId
        if (level < maxLv) {
            nextLv = level + 1
        } else {
            let careers = HeroUtils.getJobBackId(this.careerId);
            nextCareerId = careers.length > 0 ? careers[0] : this.careerId
            nextLv = careers.length > 0 ? 0 : maxLv
        }
        let cfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", nextCareerId, { career_lv: nextLv })

        this.unlockLayout.destroyAllChildren()

        //技能
        if (cfg.ul_skill && cfg.ul_skill.length > 0 && cfg.career_lv != 0) {
            for (let i = 0; i < cfg.ul_skill.length; i++) {
                let skillId = cfg.ul_skill[i]
                if (skillId > 0) {
                    let skillCfg = GlobalUtil.getSkillCfg(skillId)
                    if (skillCfg && skillCfg.show && skillCfg.show == 1) {
                        continue
                    }
                    let node = cc.instantiate(this.skillItem)
                    node.parent = this.unlockLayout
                    let bg = node.getChildByName("bg")
                    let icon = node.getChildByName("icon")
                    let superIcon = node.getChildByName("chaojue")
                    let layout = node.getChildByName("layout")
                    let skillName = layout.getChildByName("skillName").getComponent(cc.Label)
                    let typeIcon = layout.getChildByName("typeIcon")
                    let taPath = "view/role/texture/career2/juese_ta"
                    let kaPath = "view/role/texture/career2/juese_ka"
                    if (HeroUtils.isCardSkill(skillId)) {
                        GlobalUtil.setSpriteIcon(this.node, bg, "common/texture/career/sub_skillbg2")
                        GlobalUtil.setSpriteIcon(this.node, typeIcon, kaPath)
                    } else {
                        GlobalUtil.setSpriteIcon(this.node, bg, "common/texture/career/sub_skillbg")
                        GlobalUtil.setSpriteIcon(this.node, typeIcon, taPath)
                    }
                    let path = GlobalUtil.getSkillIcon(skillId)
                    GlobalUtil.setSpriteIcon(this.node, icon, path)
                    skillName.string = skillCfg.name;
                    superIcon.active = skillCfg.type == 501
                    node.on(cc.Node.EventType.TOUCH_END, () => {
                        this._skillItemClick(skillId)
                    }, this)

                }
            }
        }

        //士兵
        let soldierId = 0
        // if (cfg.gain_soldier > 0) {
        //     soldierId = cfg.gain_soldier
        // }
        if (soldierId > 0) {
            let node = cc.instantiate(this.soldierItem)
            node.parent = this.unlockLayout
            let bg = node.getChildByName("bg")
            let icon = node.getChildByName("soldierIcon")
            let soldierName = node.getChildByName("soldierName").getComponent(cc.Label)
            let path = GlobalUtil.getSoldierIcon(soldierId)
            GlobalUtil.setSpriteIcon(this.node, icon, path)
            let soldierCfg = ConfigManager.getItemById(SoldierCfg, soldierId)
            soldierName.string = soldierCfg.name
            let bgPath = `common/texture/sub_itembg0${soldierCfg.color}`
            GlobalUtil.setSpriteIcon(this.node, bg, bgPath)
            node.on(cc.Node.EventType.TOUCH_END, () => {
                this._soldierItemClick(soldierId)
            }, this)
        }

        if (nextLv == maxLv) {
            let node = cc.instantiate(this.masterItem)
            node.parent = this.unlockLayout
            let icon = node.getChildByName("careerIcon")
            let nameLab = node.getChildByName("careerName").getComponent(cc.Label)
            nameLab.string = cfg.name
            GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getCareerIcon(cfg.career_id))
            node.on(cc.Node.EventType.TOUCH_END, () => {
                gdk.panel.open(PanelId.CareerMasterPanel2)
            }, this)
        }
    }

    _updateStarNum() {
        let eachCount = this.careerLvNode.length
        let maxNum = Math.max(1, this.maxLv + 1)
        let starNum = this.curLv + 1
        for (let index = 0; index < eachCount; index++) {
            let scr = this.careerLvNode[index]
            scr.node.active = index < maxNum;
            let state = starNum > index ? 1 : 0;
            scr.updateState(state)
        }
    }

    _updateMaterials(nextCfg: Hero_careerCfg) {
        cc.js.clear(this.itemKey)
        let parent = this.materialNode
        let children = parent.children
        this.materialItems = []
        this.isCanUp = true
        for (let i = 0; i < 4; i++) {
            let key = 'career_item' + (i + 1)
            let node = children[i]
            if (!node) {
                node = cc.instantiate(children[0])
                node.parent = parent
            }
            node.targetOff(node)
            node.active = true
            this.mSlots[i] = node.getComponent(UiSlotItem)
            if (nextCfg[key]) {
                let itemId = nextCfg[key][0]
                let num = node.getChildByName('numLab');
                let icon = node.getChildByName('icon');
                let qualityIcon = node.getChildByName('qualityIcon');
                num.active = true;
                icon.active = true;
                qualityIcon.active = true;
                this.mSlots[i].updateItemInfo(itemId)
                let needNum = nextCfg[key][1]
                this.mSlots[i].itemInfo = {
                    itemId: itemId,
                    type: BagType.ITEM,
                    series: itemId,
                    itemNum: needNum,
                    extInfo: null,
                }
                this.mSlots[i].showGainWay = true
                this.itemKey[itemId] = i
                this.materialItems[i] = nextCfg[key]
                this._updateMaterNum(i)
            } else {
                node.active = false
            }
        }
    }

    _updateMaterNum(index) {
        if (!this.mSlots[index]) {
            return
        }
        let data = this.materialItems[index]
        let itemId = data[0]
        let needNum = data[1]
        let hasNum = BagUtils.getItemNumById(itemId)
        let color = CommonNumColor.green
        if (hasNum < needNum) {
            this.isCanUp = false
            color = CommonNumColor.red
        }
        let type = BagUtils.getItemTypeById(itemId)
        if (type == BagType.MONEY) {
            //货币判断
            if (!GlobalUtil.checkMoneyEnough(needNum, itemId, this)) {
                this.isCanUp = false
            }
        }
        this.mSlots[index].updateNumLab(`${hasNum}/${needNum}`, 1, color)
    }

    _updateAttInfo(curCfg: Hero_careerCfg, nextCfg: Hero_careerCfg) {
        let typeKeys = ["atk_w", "def_w", "hp_w", "hit_w", "dodge_w"]
        if (!nextCfg) {
            for (let index = 0; index < 5; index++) {
                const _key = typeKeys[index];
                let curVal = curCfg[_key] ? curCfg[_key] : 0
                this.curAttLabs[index].string = `${curVal}`
            }
            return
        }

        for (let index = 0; index < 5; index++) {
            const _key = typeKeys[index];
            let cLv = curCfg.career_lv
            // let rank = curCfg.rank
            let curVal = curCfg[_key] ? curCfg[_key] : 0
            this.curAttLabs[index].string = `${curVal}`
            let nextLab = this.nextAttLabs[index]
            let addLab = this.addAttLabs[index]
            if (nextCfg) {
                cLv = nextCfg.career_lv
                // rank = nextCfg.rank
                nextLab.node.active = true
                let nextVal = nextCfg[_key]
                nextLab.string = `${nextVal}`

                addLab.node.active = true
                addLab.string = `(+${nextVal - curVal})`
            } else {
                nextLab.node.active = false
                addLab.node.active = false
            }
        }
    }

    /**转职 */
    changeFunc() {
        gdk.panel.open(PanelId.ChangeCareerPanel2);
    }

    /**进阶 */
    upCareerFunc() {
        if (!this.isCanUp) {
            //gdk.gui.showMessage("材料不足")

            let chipEoughCount = 0
            let composeItems = []
            //不足弹窗提示
            for (let index = 0; index < 4; index++) {
                let data = this.materialItems[index]
                if (data) {
                    let itemId = data[0]
                    let needNum = data[1]
                    let hasNum = BagUtils.getItemNumById(itemId)

                    let composeCfg = ConfigManager.getItemByField(Item_composeCfg, "target", itemId)
                    if (composeCfg) {
                        let hasChipNum = BagUtils.getItemNumById(composeCfg.id)
                        if (hasChipNum >= composeCfg.amount * needNum || hasNum >= needNum) {
                            chipEoughCount++
                            if (hasChipNum >= composeCfg.amount * needNum) {
                                composeItems.push({ id: composeCfg.id, num: (needNum - hasNum) })
                            }
                            continue
                        }
                    }
                    if (hasNum < needNum) {
                        // GlobalUtil.openGainWayTips(this.mSlots[index].itemInfo)
                        return
                    }
                }
            }

            //材料混合碎片足够
            if (chipEoughCount >= composeItems.length) {
                GlobalUtil.openAskPanel({
                    title: gdk.i18n.t("i18n:TIP_TITLE"),
                    descText: gdk.i18n.t("i18n:HERO_TIP12"),
                    sureText: gdk.i18n.t("i18n:HERO_TIP13"),
                    thisArg: this,
                    isShowTip: true,
                    tipSaveCache: AskInfoCacheType.career_up_item_tip,
                    oneBtn: true,
                    sureCb: () => {
                        for (let i = 0; i < composeItems.length; i++) {
                            let msg = new icmsg.ItemComposeReq()
                            msg.stuffId = composeItems[i].id;
                            msg.num = composeItems[i].num;
                            NetManager.send(msg)
                        }
                    },
                });
            }
            return
        }
        if (this.heroInfo.level < this.needHeroLv) {
            gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:HERO_TIP14"), this.needHeroLv))
            return
        }
        let msg = new icmsg.HeroCareerUpReq()
        msg.heroId = this.heroInfo.heroId
        NetManager.send(msg)
    }


    _showJobResultEffect(e: gdk.Event) {
        let isChange = e.data
        if (!isChange) {
            gdk.panel.open(PanelId.CareerAdvanceTipCtrl2)
        }
    }


    _skillItemClick(id) {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            node.y = -100
            let comp = node.getComponent(SkillInfoPanelCtrl)
            comp.showSkillInfo(id)
        })
    }
    _soldierItemClick(soldierId) {
        gdk.panel.open(PanelId.SoldierView, (node: cc.Node) => {
            let ctrl = node.getComponent(SoldierViewCtrl)
            ctrl.initSoldierId(soldierId)
        })
    }

    /**左右切换当前选择英雄 */
    _changHero(dir: number) {
        let items = this.heroModel.selectHeros;
        let len = items.length;
        if (len == 0) {
            return;
        }
        let heroIdx = -1;
        let curr = this.heroModel.curHeroInfo;
        curr && items.some((item, i) => {
            let info = <icmsg.HeroInfo>item.data.extInfo;
            if (info && info.heroId == curr.heroId) {
                heroIdx = i;
                return true;
            }
            return false;
        });
        let nextIdx = heroIdx + dir;
        if (nextIdx < 0) {
            nextIdx = len - 1;
        } else if (nextIdx >= len) {
            nextIdx = 0;
        }
        if (heroIdx == nextIdx) {
            return;
        }
        this.heroModel.curHeroInfo = items[nextIdx].data.extInfo as icmsg.HeroInfo;
        gdk.e.emit(RoleEventId.UPDATE_CURR_HERO_INFO)
    }


    /**上一个英雄 */
    leftFunc() {
        this._changHero(-1);
    }

    /**下一个英雄 */
    rightFunc() {
        this._changHero(1);
    }

}