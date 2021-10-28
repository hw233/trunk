import CareerIconItemCtrl from '../../../view/role/ctrl2/main/career/CareerIconItemCtrl';
import ChampionModel from '../../../view/champion/model/ChampionModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import UiSlotItem from '../../../common/widgets/UiSlotItem';

/**
 * @Description: 个人名片-英雄子项
 * @Author: weiliang.huang
 * @Date: 2019-03-28 17:21:18
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-18 18:02:05
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainSetHeroItemCtrl")
export default class MainSetHeroItemCtrl extends cc.Component {

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Node)
    careerIconItem: cc.Node = null

    _index: number = 0
    _playerId: number = 0
    _heroShareInfo: icmsg.HeroBriefExt
    _type: number = 0; // 0-查询当前信息，1-查询锦标赛信息

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this._clickHero, this)
    }

    onDestroy() {
        gdk.e.targetOff(this)
    }

    updateView(hero: icmsg.HeroBriefExt, index: number, playerId: number, type: number) {
        this._type = type;
        this._heroShareInfo = hero
        this._playerId = playerId
        let sCtrl = this.slot.getComponent(UiSlotItem)
        sCtrl.updateItemInfo(hero.heroBrief.typeId)
        sCtrl.updateStar(hero.heroBrief.star)
        this.lvLabel.node.active = true
        this.lvLabel.string = `${hero.heroBrief.level}`

        this.careerIconItem.active = true
        let ctrl = this.careerIconItem.getComponent(CareerIconItemCtrl)
        ctrl.updateView(hero.heroBrief.careerId, hero.heroBrief.careerLv, hero.heroBrief.soldierId)
    }

    updateNullHero() {
        let sCtrl = this.slot.getComponent(UiSlotItem)
        sCtrl.updateItemInfo(0)
        this.careerIconItem.active = false
        this.lvLabel.node.active = false
    }

    _clickHero() {
        if (!this._heroShareInfo) return;
        let msg = new icmsg.RoleHeroImageReq()
        msg.playerId = this._playerId
        msg.heroId = this._heroShareInfo.heroBrief.heroId
        msg.type = this._type;
        if (msg.type == 1) {
            msg.index = ModelManager.get(ChampionModel).guessIndex;
        }
        NetManager.send(msg, (data: icmsg.RoleHeroImageRsp) => {
            // gdk.panel.open(PanelId.LookHeroView, (node: cc.Node) => {
            //     let model = ModelManager.get(HeroModel)
            //     model.heroImage = data.hero
            //     let comp = node.getComponent(LookHeroViewCtrl)
            //     comp.updateHeroInfo()
            // })
            gdk.panel.setArgs(PanelId.MainSetHeroInfoTip, data)
            gdk.panel.open(PanelId.MainSetHeroInfoTip);

        })
    }

}
