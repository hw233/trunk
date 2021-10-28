import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import LookHeroViewCtrl from '../../role/ctrl2/lookHero/LookHeroViewCtrl';
import MercenaryModel from '../model/MercenaryModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import PveFsmEventId from '../../pve/enum/PveFsmEventId';
import PveSceneCtrl from '../../pve/ctrl/PveSceneCtrl';
import RoleModel from '../../../common/models/RoleModel';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { HeroCfg, WorkerCfg } from '../../../a/config';
import { MercenaryEventId } from '../enum/MercenaryEventId';

/**
 * 英雄雇佣设置 确认界面
 * @Author: luoyong
 * @Description:
 * @Date: 2020-07-10 11:12:08
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-25 09:54:54
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/mercenary/MercenaryGetCheckCtrl")
export default class MercenaryGetCheckCtrl extends gdk.BasePanel {

    @property(UiSlotItem)
    slot: UiSlotItem = null

    @property(cc.Node)
    careerIconItem: cc.Node = null

    @property(cc.Label)
    heroTipLab: cc.Label = null

    @property(cc.Label)
    heroTipLab2: cc.Label = null

    @property(cc.Label)
    heroName: cc.Label = null

    @property(cc.Label)
    playerName: cc.Label = null

    @property(cc.Sprite)
    soldierIcon: cc.Sprite = null;

    @property(cc.Sprite)
    careerIcon: cc.Sprite = null;

    _info: icmsg.MercenaryListHero

    get roleModel() { return ModelManager.get(RoleModel); }
    get mercenaryModel() { return ModelManager.get(MercenaryModel); }

    onEnable() {
        let arg = this.args
        this._info = arg[0]
        this._updateViewInfo()
    }

    onDisable() {
        this.mercenaryModel.isBindSetHereItem = false
        gdk.Timer.clearAll(this)
    }

    _updateViewInfo() {
        gdk.Timer.once(50, this, () => {
            let ctrl = this.slot.getComponent(UiSlotItem)
            ctrl.updateItemInfo(this._info.heroBrief.typeId)
            ctrl.updateStar(this._info.heroBrief.star)
            this._updateCareerInfo()
        })
        let heroCfg = ConfigManager.getItemById(HeroCfg, this._info.heroBrief.typeId)
        this.heroName.string = `${heroCfg.name}`
        this.playerName.string = `${this._info.playerName}`
        this.heroTipLab.string = `${heroCfg.name}${gdk.i18n.t("i18n:MERCENARY_TIP1")}`

        if (this._info.playerId == 0) {
            this.heroTipLab2.string = gdk.i18n.t("i18n:MERCENARY_TIP2")
        } else {
            this.heroTipLab2.string = gdk.i18n.t("i18n:MERCENARY_TIP3")
        }
    }

    _updateCareerInfo() {
        // let ctrl = this.careerIconItem.getComponent(CareerIconItemCtrl)
        // ctrl.updateView(this._info.heroBrief.careerId, this._info.heroBrief.careerLv, this._info.heroBrief.soldierId)

        let heroCfg = ConfigManager.getItemById(HeroCfg, this._info.heroBrief.typeId);
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, `common/texture/role/select/group_${heroCfg.group[0]}`);
        let type = Math.floor(this._info.heroBrief.soldierId / 100);
        let iconPath = `view/role/texture/careerIcon/c_type_${type}`;
        GlobalUtil.setSpriteIcon(this.node, this.soldierIcon, iconPath);

    }

    clickOkFunc() {
        let workerCfg = ConfigManager.getItemById(WorkerCfg, 1)
        let b_limit = workerCfg.lend_limit
        if (this._info.lendNum >= b_limit) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:MERCENARY_TIP4"))
        } else {
            let msg = new icmsg.MercenaryBorrowReq()
            msg.playerId = this._info.playerId
            msg.heroTypeid = this._info.heroBrief.typeId
            NetManager.send(msg, (data: icmsg.MercenaryBorrowRsp) => {
                this._addHero(data.hero)
                this.close()
            })
        }

    }

    /*设置借用的英雄*/
    _addHero(heroData: icmsg.MercenaryBorrowedHero) {
        let addMid = false
        let list = this.mercenaryModel.borrowedListHero
        for (let i = 0; i < list.length; i++) {
            if (list[i] && list[i].index == heroData.index) {
                addMid = true
                this.mercenaryModel.borrowedListHero[i] = heroData
                return
            }
        }
        if (!addMid) {
            this.mercenaryModel.borrowedListHero.push(heroData)
        }
        this.mercenaryModel.borrowedListHero = this.mercenaryModel.borrowedListHero;
        //生存训练困难模式上阵处理
        let copyModel = ModelManager.get(CopyModel);
        let heroIds: number[] = [];
        let mercenary: number[] = [];
        copyModel.survivalStateMsg.heroes.forEach(data => {
            if (data.typeId == 0 && data.heroId > 0) {
                heroIds.push(data.heroId);
            }
        })
        let num = 0;
        if (heroIds.length < 9) {
            num = Math.min(9 - heroIds.length, this.mercenaryModel.borrowedListHero.length);
        }
        let temDatas: icmsg.SurvivalHeroesInfo[] = []
        heroIds.forEach(id => {
            let tem = new icmsg.SurvivalHeroesInfo()
            tem.typeId = 0;
            tem.heroId = id;
            temDatas.push(tem);
        })
        for (let i = 0; i < num; i++) {
            let tem = new icmsg.SurvivalHeroesInfo()
            let data = this.mercenaryModel.borrowedListHero[i]
            tem.typeId = 1;
            tem.heroId = data.index;
            temDatas.push(tem);
        }
        copyModel.survivalStateMsg.heroes = temDatas;
        copyModel.survivalNeedSend = true;
        gdk.e.emit(MercenaryEventId.MERCENARY_GET_REFRESH_HERO)

        copyModel.SurvivalCopyUpHeroList['1'] = null;
        let view = gdk.gui.getCurrentView();
        let ctrl = view.getComponent(PveSceneCtrl);
        ctrl.fsm.broadcastEvent(PveFsmEventId.PVE_SCENE_ONE_KEY);
    }

    /**查看英雄 */
    onHeroViewFunc() {
        let msg = new icmsg.MercenaryImageReq()
        msg.playerId = this._info.playerId
        msg.heroTypeid = this._info.heroBrief.typeId
        NetManager.send(msg, (data: icmsg.MercenaryImageRsp) => {
            gdk.panel.open(PanelId.LookHeroView, (node: cc.Node) => {
                let model = ModelManager.get(HeroModel)
                model.heroImage = data.hero
                let comp = node.getComponent(LookHeroViewCtrl)
                comp.updateHeroInfo()
            })
        })
    }
}