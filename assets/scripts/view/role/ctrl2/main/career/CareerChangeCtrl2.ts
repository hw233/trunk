import ChangeJobCtrl from './ChangeJobCtrl';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import SkillInfoPanelCtrl from '../skill/SkillInfoPanelCtrl';
import SoldierViewCtrl from '../../../../bingying/ctrl/SoldierViewCtrl';
import StarItemCtrl from '../../../../../common/widgets/StarItemCtrl';
import { BagEvent } from '../../../../bag/enum/BagEvent';
import { Hero_careerCfg, HeroCfg, SoldierCfg } from '../../../../../a/config';
import { RoleEventId } from '../../../enum/RoleEventId';


export const CareerTitlePath = {
    [1]: { title: "view/role/texture/career2/yx_sheshou", bg: "view/role/texture/career2/yx_tongyong" },
    [3]: { title: "view/role/texture/career2/yx_paoshou", bg: "view/role/texture/career2/yx_tongyong" },
    [4]: { title: "view/role/texture/career2/yx_dunwei", bg: "view/role/texture/career2/yx_tongyong" },
}
/*
   //转职
 * @Author: luoyong 
 * @Date: 2020-02-27 10:32:43 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-02-04 20:23:22
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/career/CareerChangeCtrl2")
export default class CareerChangeCtrl2 extends cc.Component {

    @property(cc.Node)
    jobItems: cc.Node[] = []

    @property(cc.Button)
    changeBtn: cc.Button = null

    @property(cc.Node)
    line1: cc.Node = null

    @property(cc.Node)
    line2: cc.Node = null

    @property(cc.Node)
    soldierIcon: cc.Node = null

    @property(cc.Label)
    careerName: cc.Label = null

    @property(StarItemCtrl)
    careerLvNode: Array<StarItemCtrl> = []

    @property(cc.Prefab)
    jobSkillItem: cc.Prefab = null; //技能图标

    @property(cc.Prefab)
    jobSoldierItem: cc.Prefab = null; //士兵、守卫图标

    @property(cc.Node)
    showPanel: cc.Node = null

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    redPoint: cc.Node = null

    curSelect: number = -1
    careerId: number = 0
    itemJobId: number[] = []
    baseHeroCfg: HeroCfg

    get model() {
        return ModelManager.get(HeroModel);
    }

    get heroInfo() {
        return this.model.curHeroInfo;
    }

    onEnable() {
        HeroUtils.initJobRelatedInfo()
        for (let index = 0; index < this.jobItems.length; index++) {
            const element = this.jobItems[index];
            element.on(cc.Node.EventType.TOUCH_END, () => {
                this.selectItem(index)
            }, this)
        }

        this._initJobItems()
        this._updateCareerInfo()

        gdk.e.on(RoleEventId.UPDATE_HERO_ATTR, this._updateCareerInfo, this)
        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._updateCareerInfo, this)
        gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this._updateCareerInfo, this)
        gdk.e.on(BagEvent.REMOVE_ITEM, this._updateCareerInfo, this)

        this.changeBtn.enabled = false
        gdk.Timer.once(500, this, () => {
            this.changeBtn.enabled = true
        })
    }

    onDisable() {
        gdk.e.targetOff(this);
        gdk.Timer.clearAll(this);
    }

    close() {
        gdk.panel.hide(PanelId.ChangeCareerPanel2)
        let node = gdk.panel.get(PanelId.RoleView2)
        if (!node) {
            gdk.panel.setArgs(PanelId.RoleView2, [2])
            gdk.panel.open(PanelId.RoleView2)
        }
    }

    _updateCareerInfo() {
        this.careerId = this.heroInfo.careerId

        if (this.curSelect >= 0) {
            this.selectItem(-1)
        }
        for (let index = 0; index < this.itemJobId.length; index++) {
            const id = this.itemJobId[index];
            if (id == this.careerId) {
                this.selectItem(index)
            }
            this._updateCareerState(index)
        }

        this.spine.node.scaleX = this.spine.node.scaleY = this.baseHeroCfg.size_ui
        this.spine.node.x = this.baseHeroCfg.coordinate[0]
        this.spine.node.y = this.baseHeroCfg.coordinate[1]
        HeroUtils.setSpineData(this.node, this.spine, this.baseHeroCfg.skin, true, false);
        this.spine.paused = true

        this._autoSelectChangeJob()
    }

    /**更新职业是否已激活 */
    _updateCareerState(idx: number) {
        let node = this.jobItems[idx]
        let careerId = this.itemJobId[idx]
        let fullNode = node.getChildByName("fullNode")
        let activeItem = node.getChildByName("activeItem")
        let maxLv = HeroUtils.getJobMaxLv(careerId)
        let level = HeroUtils.getHeroJobLv(this.heroInfo.heroId, careerId)
        // activeItem.active = this._checkActiveItemState(careerId)
        let bg = node.getChildByName("iconBg")
        let icon = node.getChildByName("icon")
        let grayNum: 0 | 1 = level < 0 ? 1 : 0;
        GlobalUtil.setAllNodeGray(bg, grayNum)
        GlobalUtil.setAllNodeGray(icon, grayNum)

        if (idx > 0) {
            let arrowLight = node.getChildByName("arrowLight")
            let arrowDark = node.getChildByName("arrowDark")
            arrowLight.active = level >= 0
            arrowDark.active = !(level >= 0)
        }

        fullNode.active = level >= maxLv

        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, { career_lv: 0 });
        let enoughTip = node.getChildByName("enoughTip")
        enoughTip.active = false
        if (activeItem.active && careerCfg.trans_cost) {
            if (GlobalUtil.getMoneyNum(careerCfg.trans_cost[0]) >= careerCfg.trans_cost[1]) {
                enoughTip.active = true
            }
        }
    }

    /**判断是否显示 转职职业需要的道具  */
    // _checkActiveItemState(careerId) {
    //     let careerPreId = HeroUtils.getJobPreId(careerId)
    //     if (careerPreId) {
    //         let preMaxLv = HeroUtils.getJobMaxLv(careerPreId)
    //         let preLevel = HeroUtils.getHeroJobLv(this.heroInfo.heroId, careerPreId)
    //         if (preLevel >= preMaxLv) {
    //             //转职材料在每个职业层级第一次不消耗
    //             let ids = [] //已激活的职业id
    //             let heroDetail: HeroDetail = HeroUtils.getHeroDetailById(this.heroInfo.heroId)
    //             if (careerId == this.heroInfo.ftcId) {
    //                 return false
    //             }
    //             for (let i = 0; i < heroDetail.careers.length; i++) {
    //                 ids.push(heroDetail.careers[i].careerId)
    //             }
    //             let count1 = 0
    //             let count2 = 0
    //             let preId = HeroUtils.getJobPreId(this.heroInfo.ftcId)
    //             let midAllIds = HeroUtils.getJobBackId(preId)//中层所有职业id
    //             let downAllIds = []
    //             for (let i = 0; i < midAllIds.length; i++) {
    //                 if (ids.indexOf(midAllIds[i]) == -1) {
    //                     if (midAllIds.indexOf(careerId) != -1) {
    //                         count1++
    //                     }
    //                 }
    //                 let backId = HeroUtils.getJobBackId(midAllIds[i])
    //                 downAllIds.push(backId[0])
    //             }

    //             for (let i = 0; i < downAllIds.length; i++) {
    //                 if (ids.indexOf(downAllIds[i]) == -1) {
    //                     if (downAllIds.indexOf(careerId) != -1 && ids.indexOf(careerId) == -1) {
    //                         count2++
    //                     }
    //                 }
    //             }
    //             //有职业分支 判断
    //             if (midAllIds.length > 1) {
    //                 //第一 二 层都有一个已转职的职业，不需要红点提示 改为对应道具图标显示
    //                 if (count1 == 1 || count2 == 1) {
    //                     let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, { career_lv: 0 });
    //                     let itemId = careerCfg.trans_item[0];
    //                     let itemNum = careerCfg.trans_item[1];
    //                     if (itemNum > 0 && BagUtils.getItemNumById(itemId) < itemNum) {
    //                         // 材料不足
    //                         return false;
    //                     }
    //                     return true;
    //                 }
    //             }
    //         }
    //     }
    //     return false
    // }

    /**自动选择可转职的职业 */
    _autoSelectChangeJob() {
        let maxLv = HeroUtils.getJobMaxLv(this.careerId)
        let level = HeroUtils.getHeroJobLv(this.heroInfo.heroId, this.careerId)
        let backId = this.careerId
        if (maxLv == level) {
            backId = HeroUtils.getJobBackId(this.careerId)[0]
        }
        //没有后置id选择当前职业id
        if (!backId) {
            backId = this.careerId
        }

        //从士兵跳转过来的
        if (this.model.selectSoldierCareerId > 0) {
            this.selectTargetJob()
        } else {
            //正常自动选择的
            for (let index = 0; index < this.itemJobId.length; index++) {
                const id = this.itemJobId[index];
                if (id == backId) {
                    this.selectItem(index)
                    break
                }
            }
        }
    }

    selectTargetJob() {
        for (let index = 0; index < this.itemJobId.length; index++) {
            const id = this.itemJobId[index];
            if (id == this.model.selectSoldierCareerId) {
                this.selectItem(index)
                break
            }
        }
    }

    _initSelect() {
        for (let index = 0; index < this.jobItems.length; index++) {
            const element = this.jobItems[index];
            let select = element.getChildByName("select");
            select.active = false;
        }
    }

    /**初始化职业面板信息
     * 并记录下每个item对应的职业id
     */
    _initJobItems() {
        this.itemJobId = []
        this.baseHeroCfg = ConfigManager.getItemById(HeroCfg, this.heroInfo.typeId)
        this.itemJobId[0] = this.baseHeroCfg.career_id
        this._initOneItem(this.jobItems[0], this.baseHeroCfg.career_id)
        let ids = HeroUtils.getJobBackId(this.baseHeroCfg.career_id)
        GlobalUtil.sortArray(ids, (a: number, b: number) => {
            return a - b
        })
        //英雄初始职业的后置id列表
        if (ids.length == 1) {
            this.line1.active = true
            this.line2.active = false
            this._updateLineInfo(this.line1, ids[0])
        } else if (ids.length == 2) {
            this.line1.active = true
            this.line2.active = true
            this._updateLineInfo(this.line1, ids[0])
            this._updateLineInfo(this.line2, ids[1])
        }
        let startIndex = [1, 3]
        if (ids) {
            for (let i = 0; i < ids.length; i++) {
                let index = startIndex[i]
                //中级
                const node = this.jobItems[index];
                let id = ids[i]
                this.itemJobId[index] = id
                this._initOneItem(node, id)
                //高级
                let backNode = this.jobItems[index + 1]
                let backIds = HeroUtils.getJobBackId(id)
                let bId = backIds ? backIds[0] : 0
                this.itemJobId[index + 1] = bId
                this._initOneItem(backNode, bId)

            }
        }
    }

    _updateLineInfo(line: cc.Node, careerId) {
        let cfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId)
        let icon = line.getChildByName("lineIcon")
        let title = line.getChildByName("lineTitle")
        let bg = line.getChildByName("bg")
        GlobalUtil.setSpriteIcon(this.node, icon, GlobalUtil.getSoldierTypeIcon(cfg.career_type))
        GlobalUtil.setSpriteIcon(this.node, title, CareerTitlePath[cfg.career_type].title)
        GlobalUtil.setSpriteIcon(this.node, bg, CareerTitlePath[cfg.career_type].bg)
    }

    /**初始化单项职业信息 */
    _initOneItem(node: cc.Node, jobId: number = 0) {
        if (!jobId) {
            node.active = false
            return
        }
        node.active = true
        let cfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", jobId, null)
        let imgNode = node.getChildByName("icon").getComponent(cc.Sprite)
        let path = `icon/career/${cfg.icon}`
        GlobalUtil.setSpriteIcon(this.node, imgNode, path)

        let select = node.getChildByName("select");
        select.active = false;
    }

    selectItem(idx: number = -1) {
        if (this.curSelect == idx) {
            return
        }
        this._initSelect();

        if (this.jobItems[this.curSelect]) {
            this._updateSelectState(this.curSelect, false)
        }
        if (this.jobItems[idx]) {
            this._updateSelectState(idx, true)
        }
        this.curSelect = idx
    }

    /**更新选中状态和转职按钮状态 */
    _updateSelectState(idx: number, state?: boolean) {
        let node = this.jobItems[idx]
        let image = this.changeBtn.node.getChildByName("yx_zz")
        if (state) {
            let select = node.getChildByName("select");
            select.active = true;
            let id = this.itemJobId[idx]
            if (id) {
                this.model.showJobId = id
                this._updateSelectCareerInfo()
            }
            if (idx == 0) {
                // 第一职业不用转职按钮
                this.changeBtn.interactable = false
                GlobalUtil.setGrayState(image, 1)
                return
            }
            // 如果有后置已开启的职业,则无法转职
            // 必须是该路线最高职业才可以转职
            let ids = HeroUtils.getJobBackId(id)
            for (let index = 0; index < ids.length; index++) {
                const backId = ids[index];
                if (HeroUtils.getHeroJobLv(this.heroInfo.heroId, backId) >= 0) {
                    this.changeBtn.interactable = false
                    GlobalUtil.setGrayState(image, 1)
                    return
                }
            }
            this.changeBtn.interactable = true
            GlobalUtil.setGrayState(image, 0)
        } else {
            this.changeBtn.interactable = false
            GlobalUtil.setGrayState(image, 1)
        }
    }

    /**选中职业信息更新 */
    _updateSelectCareerInfo() {
        let cfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.model.showJobId, null)
        GlobalUtil.setSpriteIcon(this.node, this.soldierIcon, GlobalUtil.getSoldierTypeIcon(cfg.career_type))
        this.careerName.string = cfg.name
        this._updateStarNum()
        this._updateSkill()
        this._updateJobSoldiers()
    }


    _updateStarNum() {
        let eachCount = this.careerLvNode.length
        let careerId = this.model.showJobId
        let curLv = HeroUtils.getHeroJobLv(this.heroInfo.heroId, careerId)
        let maxLv = HeroUtils.getJobMaxLv(careerId)
        let maxNum = Math.max(1, maxLv + 1)
        let starNum = curLv + 1
        for (let index = 0; index < eachCount; index++) {
            let scr = this.careerLvNode[index]
            scr.node.active = index < maxNum;
            let state = starNum > index ? 1 : 0;
            scr.updateState(state)
        }
    }

    _updateSkill() {
        let skillLayer1 = this.showPanel.getChildByName("skillLayer1")
        let skillLayer2 = this.showPanel.getChildByName("skillLayer2")

        let careerId = this.model.showJobId
        let cfgs = ConfigManager.getItemsByField(Hero_careerCfg, "career_id", careerId)

        skillLayer1.destroyAllChildren()
        skillLayer2.destroyAllChildren()

        let ids = []
        for (let index = 0; index < cfgs.length; index++) {
            const cfg = cfgs[index];
            let ul_skill = cfg.ul_skill
            if (ul_skill && ul_skill.length > 0) {
                ids = [...ids, ...ul_skill]
            }
        }

        //初始职业技能
        let baseIds = []
        let baseCfgs = ConfigManager.getItemsByField(Hero_careerCfg, "career_id", this.baseHeroCfg.career_id)
        for (let index = 0; index < baseCfgs.length; index++) {
            const cfg = baseCfgs[index];
            let ul_skill = cfg.ul_skill
            if (ul_skill && ul_skill.length > 0) {
                baseIds = [...baseIds, ...ul_skill]
            }
        }

        //初始职业技能 非普攻技能
        let newIds = []
        for (let i = 0; i < baseIds.length; i++) {
            let skillCfg = GlobalUtil.getSkillCfg(baseIds[i])
            if (skillCfg.show != 1) {
                newIds.push(baseIds[i])
            }
        }

        //起始职业也要显示
        if (careerId == this.baseHeroCfg.career_id) {
            ids = [this.baseHeroCfg.gift_tower_id]//, this.baseHeroCfg.gift_card_id
            ids = ids.concat(newIds)
        }

        for (let index = 0; index < ids.length; index++) {
            const id = ids[index];
            let path = GlobalUtil.getSkillIcon(id)
            let node = cc.instantiate(this.jobSkillItem)
            //设置技能背景框图片
            let bgPath = HeroUtils.isCardSkill(id) ? "common/texture/career/sub_skillbg2" : "common/texture/career/sub_skillbg";
            let bg = node.getChildByName('bg');
            GlobalUtil.setSpriteIcon(this.node, bg, bgPath);
            let icon = node.getChildByName('icon');
            let superNode = node.getChildByName('super')
            let skillcfg = GlobalUtil.getSkillCfg(id)
            if (skillcfg && skillcfg.show == 1) {
                continue;
            }
            //其他职业排除初级职业的技能
            if ((careerId != this.baseHeroCfg.career_id && newIds.indexOf(id) != -1)) {
                continue
            }
            superNode.active = skillcfg ? skillcfg.type == 501 : false;
            node.parent = id < 300000 ? skillLayer1 : skillLayer2
            node.on(cc.Node.EventType.TOUCH_END, () => {
                this._skillIconClick(id)
            }, this)
            GlobalUtil.setSpriteIcon(this.node, icon, path)
        }
    }

    /**更新职业拥有的士兵图标 */
    _updateJobSoldiers() {
        let soldierLayer = this.showPanel.getChildByName("soldierLayer")
        soldierLayer.destroyAllChildren()
        let careerId = this.model.showJobId
        let cfgs = ConfigManager.getItemsByField(Hero_careerCfg, "career_id", careerId)
        for (let index = 0; index < cfgs.length; index++) {
            const cfg = cfgs[index];
            // if (cfg.gain_soldier > 0 && cfg.gain_soldier != this.baseHeroCfg.soldier_id[0]) {
            //     let node = cc.instantiate(this.jobSoldierItem)
            //     node.parent = soldierLayer
            //     node.on(cc.Node.EventType.TOUCH_END, () => {
            //         this._soldierIconClick(cfg.gain_soldier)
            //     }, this)
            //     node.active = true
            //     let spine = node.getChildByName('spine').getComponent(sp.Skeleton)
            //     if (spine) {
            //         let temCfg = ConfigManager.getItemById(SoldierCfg, cfg.gain_soldier)
            //         GlobalUtil.setUiSoldierSpineData(soldierLayer, spine, temCfg.skin, true)
            //     }
            // }
        }
        //起始职业也要显示
        if (careerId == this.baseHeroCfg.career_id) {
            let soldierId = this.baseHeroCfg.soldier_id[0]
            let node = cc.instantiate(this.jobSoldierItem)
            node.parent = soldierLayer
            node.on(cc.Node.EventType.TOUCH_END, () => {
                this._soldierIconClick(soldierId)
            }, this)
            node.active = true
            let spine = node.getChildByName('spine').getComponent(sp.Skeleton)
            if (spine) {
                let temCfg = ConfigManager.getItemById(SoldierCfg, soldierId)
                GlobalUtil.setUiSoldierSpineData(soldierLayer, spine, temCfg.skin, true)
            }
        }

    }

    _soldierIconClick(id) {
        gdk.panel.open(PanelId.SoldierView, (node: cc.Node) => {
            let ctrl = node.getComponent(SoldierViewCtrl)
            ctrl.initSoldierId(id)
        })
    }

    _skillIconClick(id) {
        gdk.panel.open(PanelId.SkillInfoPanel, (node: cc.Node) => {
            node.y = -200
            let comp = node.getComponent(SkillInfoPanelCtrl)
            comp.showSkillInfo(id)
        })
    }

    /**转职按钮函数 */
    changeJobFunc() {
        let careerId = this.itemJobId[this.curSelect]
        if (this.careerId == careerId) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_TIP10"))
            return
        }
        let preId = HeroUtils.getJobPreId(careerId)
        if (preId) {
            let maxLv = HeroUtils.getJobMaxLv(preId)
            let preLv = HeroUtils.getHeroJobLv(this.heroInfo.heroId, preId)
            if (preLv < maxLv) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:PRE_JOB_UNFULL"))
                return
            }
        }

        gdk.panel.open(PanelId.ChangeJob, (node: cc.Node) => {
            let comp = node.getComponent(ChangeJobCtrl)
            comp.initJobInfo(this.heroInfo, careerId)
        })

    }

    openMasterFunc() {
        gdk.panel.open(PanelId.CareerMasterPanel2)
    }

}