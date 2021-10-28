import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import ErrorManager from '../../../../../common/managers/ErrorManager';
import GlobalUtil, { CommonNumColor } from '../../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RoleModel from '../../../../../common/models/RoleModel';
import { Hero_careerCfg } from '../../../../../a/config';


/**
 * @Description: 职业转职-确认窗口
 * @Author: weiliang.huang
 * @Date: 2019-04-28 17:52:37
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-22 11:43:40
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role/ChangeJobCtrl")
export default class ChangeJobCtrl extends gdk.BasePanel {

    @property(cc.Label)
    costLab: cc.Label = null

    @property(cc.Sprite)
    icon: cc.Sprite = null

    @property(cc.Node)
    costNode: cc.Node = null

    @property(cc.Label)
    numLab: cc.Label = null

    @property(cc.Sprite)
    career1: cc.Sprite = null;

    @property(cc.Sprite)
    career2: cc.Sprite = null;

    @property(cc.Label)
    careerName1: cc.Label = null

    @property(cc.Label)
    careerName2: cc.Label = null

    @property(cc.Label)
    ownItemLab: cc.Label = null

    @property(cc.Label)
    ownMoneyLab: cc.Label = null

    heroId: number = 0
    careerId: number = 0
    costInfo: any = null
    itemInfo: any = null
    needNum: number = 0
    curCareerId: number = 0//当前英雄的职业

    // ctrl: RoleJobChangeCtrl

    get heroModel(): HeroModel {
        return ModelManager.get(HeroModel)
    }

    get roleModel(): RoleModel {
        return ModelManager.get(RoleModel)
    }

    start() {

    }

    //initJobInfo(heroInfo: HeroInfo, careerId: number, ctrl: RoleJobChangeCtrl) {
    initJobInfo(heroInfo: icmsg.HeroInfo, careerId: number) {
        this.heroId = heroInfo.heroId
        this.curCareerId = heroInfo.careerId
        // this.ctrl = ctrl
        let details = HeroUtils.getHeroDetailById(heroInfo.heroId)
        this.careerId = careerId

        let curCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", heroInfo.careerId, { career_lv: 0 })
        let cfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", careerId, { career_lv: 0 })
        this.title = cfg.name
        this.costInfo = cfg.trans_cost
        // this.itemInfo = cfg.trans_item

        this.costLab.string = `/${GlobalUtil.numberToStr(this.costInfo[1], true)}`
        this.ownMoneyLab.string = `${GlobalUtil.numberToStr(this.roleModel.gold, true)}`
        if (this.roleModel.gold < this.costInfo[1]) {
            this.ownMoneyLab.node.color = CommonNumColor.red
        }

        if (curCfg) {
            GlobalUtil.setSpriteIcon(this.node, this.career1, GlobalUtil.getCareerIcon(heroInfo.careerId))
            this.careerName1.string = `${curCfg.name}`
        }
        if (cfg) {
            GlobalUtil.setSpriteIcon(this.node, this.career2, GlobalUtil.getCareerIcon(careerId))
            this.careerName2.string = `${cfg.name}`
        }
        let needActive = false
        // if (heroInfo.ftcId == 0) {
        //     needActive = false
        // } else {
        //     //let level = HeroUtils.getHeroJobLv(heroInfo.heroId, careerId)
        //     // let backId = HeroUtils.getJobBackId(details.ftcId)
        //     // // 未激活且不是初始转职的职业时,需要消耗额外道具
        //     // if (level < 0 && backId[0] && careerId != backId[0]) {
        //     //     needActive = true
        //     // }
        //     //转职材料在每个职业层级第一次不消耗
        //     let ids = [] //已激活的职业id
        //     let heroDetail: HeroDetail = this.heroModel.heroDeatils[heroInfo.heroId]
        //     for (let i = 0; i < heroDetail.careers.length; i++) {
        //         ids.push(heroDetail.careers[i].careerId)
        //     }
        //     let count1 = 0
        //     let count2 = 0
        //     let preId = HeroUtils.getJobPreId(heroInfo.ftcId)
        //     let midAllIds = HeroUtils.getJobBackId(preId)//中层所有职业id
        //     let downAllIds = []
        //     for (let i = 0; i < midAllIds.length; i++) {
        //         if (ids.indexOf(midAllIds[i]) == -1) {
        //             if (midAllIds.indexOf(careerId) != -1) {
        //                 count1++
        //             }
        //         }
        //         let backId = HeroUtils.getJobBackId(midAllIds[i])
        //         downAllIds.push(backId[0])
        //     }

        //     for (let i = 0; i < downAllIds.length; i++) {
        //         if (ids.indexOf(downAllIds[i]) == -1) {
        //             if (downAllIds.indexOf(careerId) != -1 && ids.indexOf(careerId) == -1) {
        //                 count2++
        //             }
        //         }
        //     }

        //     //每一层的第一职业不需要消耗判断，第二个才需要消耗道具
        //     if (count1 == 1 || count2 == 1) {
        //         needActive = true
        //     }

        //     //只有一个职业不需要判断道具消耗
        //     if (midAllIds.length == 1) {
        //         needActive = false
        //     }
        // }
        let itemId = this.itemInfo[0]

        let path = GlobalUtil.getIconById(itemId)
        GlobalUtil.setSpriteIcon(this.node, this.icon, path)

        this.costNode.active = needActive
        if (needActive) {
            this.needNum = this.itemInfo[1]
            this.numLab.string = `/${this.itemInfo[1]}`
            let ownNum = BagUtils.getItemNumById(itemId)
            this.ownItemLab.string = `${ownNum}`
            if (ownNum < this.needNum) {
                this.ownItemLab.node.color = CommonNumColor.red
            }
        } else {
            this.needNum = 0
        }

    }

    sureFunc() {
        let model = ModelManager.get(RoleModel)
        //金币是否足够判断
        if (!GlobalUtil.checkMoneyEnough(this.costInfo[1], this.costInfo[0], this, [PanelId.ChangeCareerPanel2])) {
            return
        }
        if (this.needNum > 0) {
            let hasNum = BagUtils.getItemNumById(this.itemInfo[0])
            if (hasNum < this.needNum) {
                gdk.gui.showMessage(ErrorManager.get("ERR_STUFF_NOT_ENOUGH"))
                return
            }
        }
        let lv = HeroUtils.getHeroJobLv(this.heroId, this.curCareerId)
        this.heroModel.heroCareerBeforeTranData = { heroId: this.heroId, careerId: this.curCareerId, careerLv: lv }
        this.close()
        // if (this.ctrl) {
        //     JumpUtils.showGuideMask()
        //     this.ctrl.playerChangeEffect(() => {
        //         JumpUtils.hideGuideMask()
        //         let msg = new HeroCareerTransReq()
        //         msg.heroId = this.heroId
        //         msg.careerId = this.careerId
        //         NetManager.send(msg)
        //     })
        // } else {
        let msg = new icmsg.HeroCareerTransReq()
        msg.heroId = this.heroId
        msg.careerId = this.careerId
        NetManager.send(msg)
        // }
    }
}
