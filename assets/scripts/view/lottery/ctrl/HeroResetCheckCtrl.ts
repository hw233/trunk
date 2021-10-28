import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RewardCtrl, { RewardInfoType, RewardType } from '../../../common/widgets/RewardCtrl';
import RoleModel from '../../../common/models/RoleModel';
import { CommonNumColor } from '../../../common/utils/GlobalUtil';

/**
 * 英雄重置界面
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-29 19:43:48
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 13:32:45
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroResetCheckCtrl")
export default class HeroResetCheckCtrl extends gdk.BasePanel {

    @property(cc.Label)
    costLab: cc.Label = null

    @property(cc.Label)
    ownLab: cc.Label = null

    @property(cc.Node)
    upTips: cc.Node = null;

    get roleModel() { return ModelManager.get(RoleModel); }
    get heroModel() { return ModelManager.get(HeroModel); }

    _heroId: number = 0

    onEnable() {

    }

    updateCheckInfo(cost, heroId) {
        this._heroId = heroId
        this.costLab.string = `${cost}`
        this.ownLab.string = `${this.roleModel.gems}`
        if (this.roleModel.gems >= cost) {
            this.costLab.node.color = CommonNumColor.green
        } else {
            this.costLab.node.color = CommonNumColor.red
        }
        let upList = this.heroModel.curUpHeroList(0);
        this.upTips.active = upList.indexOf(heroId) !== -1;
    }

    confirmFunc() {
        let msg = new icmsg.HeroResetConfirmReq()
        msg.heroIds = [this._heroId]
        NetManager.send(msg, (data: icmsg.HeroResetConfirmRsp) => {
            let datas = []
            let bagHero = HeroUtils.getHeroItemByHeroId(data.heroes[0].heroId)
            let heroItem = {
                typeId: bagHero.itemId,
                num: 1,
                realStar: (bagHero.extInfo as icmsg.HeroInfo).star
            }
            datas.push(heroItem)

            //装备信息
            let allequips = (bagHero.extInfo as icmsg.HeroInfo).slots
            for (let i = 0; i < allequips.length; i++) {
                if (allequips[i].equipId > 0) {
                    // let equip = {
                    //     typeId: allequips[i].equipId,
                    //     num: 1,
                    // }
                    // datas.push(equip)
                    let rubies = allequips[i].rubies
                    for (let j = 0; j < rubies.length; j++) {
                        if (rubies[j] > 0) {
                            let ruby = {
                                typeId: rubies[j],
                                num: 1,
                            }
                            datas.push(ruby)
                        }
                    }
                }
            }
            let info: RewardInfoType = {
                goodList: data.goods,
                showType: RewardType.NORMAL
            }
            gdk.panel.open(PanelId.Reward, (node: cc.Node) => {
                let comp = node.getComponent(RewardCtrl)
                comp.initRewardInfo(info, datas)
            })

            HeroUtils.updateHeroInfo(data.heroes[0].heroId, data.heroes[0])
            HeroUtils.updateHeroAttr(data.heroes[0].heroId, null)
            this.heroModel.curHeroInfo = data.heroes[0]
            //重置清除红点状态
            let skillIds = this.heroModel.activeHeroSkillIds
            delete skillIds[this._heroId]
            this.heroModel.activeHeroSkillIds = skillIds

            let careerIds = this.heroModel.masterHeroCareerIds
            delete careerIds[this._heroId]
            this.heroModel.masterHeroCareerIds = careerIds

            gdk.panel.hide(PanelId.HeroResetCheck)
        })
    }
}