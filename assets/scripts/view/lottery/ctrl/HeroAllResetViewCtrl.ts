import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import HeroAllResetItemCtrl from './HeroAllResetItemCtrl';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RewardCtrl, { RewardInfoType, RewardType } from '../../../common/widgets/RewardCtrl';
import { Hero_resetCfg } from '../../../a/config';
import { LotteryEventId } from '../enum/LotteryEventId';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroAllResetViewCtrl")
export default class HeroAllResetViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    costNode: cc.Node = null;

    ids: number[] = [];
    costNum: number = 0;
    selectIds: number[] = [];
    onEnable() {
        this.ids = this.args[0];
        this.selectIds = this.ids;
        this.costNum = 0;
        this.content.removeAllChildren();
        this.ids.forEach(id => {
            this.costNum += this._getResetCost(id);
            let slot = cc.instantiate(this.slotPrefab);
            slot.parent = this.content;
            let ctrl = slot.getComponent(HeroAllResetItemCtrl);
            ctrl.updateView(id);
        });

        this.scrollView.enabled = this.ids.length > 6;
        this.scrollView.node.width = this.ids.length <= 3 ? this.content.width : 552;

        this.costNode.getChildByName('num').getComponent(cc.Label).string = `x${this.costNum}`;
        gdk.e.on(LotteryEventId.HERO_ALL_RESET_SELECT, this._onSelected, this);
    }

    onDisable() {
        gdk.e.targetOff(this);
    }

    onConfirmBtnClick() {
        if (BagUtils.getItemNumById(2) < this.costNum) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:ACT_EGG_TIP9"));
            return;
        }
        if (this.selectIds.length <= 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:LOTTERY_TIP18"));
            return;
        }

        let req = new icmsg.HeroResetConfirmReq();
        req.heroIds = this.selectIds;
        NetManager.send(req, (resp: icmsg.HeroResetConfirmRsp) => {
            if (cc.isValid(this.node)) {
                this.close();
            }
            let datas = []
            resp.heroes.forEach(hero => {
                let bagHero = HeroUtils.getHeroItemByHeroId(hero.heroId)
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

                HeroUtils.updateHeroInfo(hero.heroId, hero)
                HeroUtils.updateHeroAttr(hero.heroId, null)
                let model = ModelManager.get(HeroModel);
                //重置清除红点状态
                let skillIds = model.activeHeroSkillIds
                delete skillIds[hero.heroId]
                model.activeHeroSkillIds = skillIds

                let careerIds = model.masterHeroCareerIds
                delete careerIds[hero.heroId]
                model.masterHeroCareerIds = careerIds
            });

            let info: RewardInfoType = {
                goodList: resp.goods,
                showType: RewardType.NORMAL
            }
            gdk.panel.open(PanelId.Reward, (node: cc.Node) => {
                let comp = node.getComponent(RewardCtrl)
                comp.initRewardInfo(info, datas)
            })
        });
    }

    onCancelBtnClick() {
        this.close();
    }

    _onSelected(e) {
        let id = e.data[0];
        let idx = this.selectIds.indexOf(id);
        if (idx == -1) {
            this.selectIds.push(id);
        }
        else {
            this.selectIds.splice(idx, 1);
        }
        this.costNum = 0;
        this.selectIds.forEach(id => {
            this.costNum += this._getResetCost(id);
        });
        this.costNode.getChildByName('num').getComponent(cc.Label).string = `x${this.costNum}`;
    }

    _getResetCost(heroId) {
        let heroBagItem = HeroUtils.getHeroInfoBySeries(heroId)
        let cfg = ConfigManager.getItemByField(Hero_resetCfg, "career_lv", (heroBagItem.extInfo as icmsg.HeroInfo).careerLv)
        return cfg.consume[1]
    }
}
