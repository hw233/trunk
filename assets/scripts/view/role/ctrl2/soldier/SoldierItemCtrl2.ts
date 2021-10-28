import BYModel from '../../../bingying/model/BYModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PveTool from '../../../pve/utils/PveTool';
import SoldierModel, { SoldierType } from '../../../../common/models/SoldierModel';
import UiListItem from '../../../../common/widgets/UiListItem';
import { BarracksCfg, Hero_careerCfg, SoldierCfg } from '../../../../a/config';
import { RoleEventId } from '../../enum/RoleEventId';
import { SoldierEventId } from '../../enum/SoldierEventId';

/** 
 * 士兵选择子项控制器
 * @Author: sthoo.huang 
 * @Date: 2020-01-14 18:00:38
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-12-22 12:33:45
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/soldier/SoliderItemCtrl2")
export default class SoliderItemCtrl extends UiListItem {

    @property(cc.Label)
    titleLab: cc.Label = null

    @property(cc.Node)
    classIcon: cc.Node = null

    @property(cc.Node)
    selectIcon: cc.Node = null

    // @property(cc.Node)
    // iconBg: cc.Node = null

    // @property(cc.Sprite)
    // icon: cc.Sprite = null

    @property(cc.Node)
    changeBtn: cc.Node = null

    @property(cc.Node)
    unGet: cc.Node = null

    @property(cc.Node)
    used: cc.Node = null

    @property(cc.Node)
    unActive: cc.Node = null

    @property(cc.Node)
    redPoint: cc.Node = null

    @property(cc.Node)
    btnRedPoint: cc.Node = null

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    activeIds: number[] = []

    _heroId: number = 0
    _solId: number = 0

    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }
    get model(): SoldierModel { return ModelManager.get(SoldierModel); }
    get byModel(): BYModel { return ModelManager.get(BYModel); }

    onEnable() {
        gdk.e.on(SoldierEventId.RSP_SOLDIER_CHANGE, this._updateUsedState, this)
    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    updateView() {
        this._heroId = this.data.info.heroId
        this._solId = this.data.info.solId

        let cfg = ConfigManager.getItemById(SoldierCfg, this._solId)
        this.titleLab.string = cfg.name
        this.titleLab.node.color = cc.color(GlobalUtil.getSoldierNameColor(cfg.color, false))
        let outLine = this.titleLab.node.getComponent(cc.LabelOutline)
        outLine.color = cc.color(GlobalUtil.getSoldierNameColor(cfg.color, true))
        GlobalUtil.setSpriteIcon(this.node, this.classIcon, GlobalUtil.getSoldierClassIconById(cfg.class))

        this.activeIds = []

        let b_lv = this.byModel.byLevelsData[cfg.type - 1]
        let cfgs = ConfigManager.getItemsByField(BarracksCfg, "type", cfg.type)
        for (let i = 0; i < cfgs.length; i++) {
            if (b_lv >= cfgs[i].barracks_lv && cfgs[i].soldier_id && cfgs[i].soldier_id > 0) {
                this.activeIds.push(cfgs[i].soldier_id)
            }
        }

        this.activeIds.sort((a, b) => {
            return b - a
        })

        this.redPoint.active = false
        this.used.active = false
        this.btnRedPoint.active = false

        //模型偏高，处理下
        if (this._solId == 404 || this._solId == 407) {
            this.spine.node.y = -40
        } else {
            this.spine.node.y = -30
        }

        GlobalUtil.setSoldierSpineData(this.node, this.spine, cfg.skin, true);
        this.spine.node.scale = cfg.size
        this.spine.paused = true
        if (this.activeIds.indexOf(this._solId) != -1 && this.data.isActive) {
            //已获得
            this.unGet.active = false
            this.unActive.active = false
            if (this.heroModel.curHeroInfo.soldierId == this._solId) {
                this.used.active = true
                this.changeBtn.active = false
            }
            PveTool.setSpineShader(this.spine, "")
        } else {
            this.unGet.active = true
            this.unActive.active = true
            this.changeBtn.active = false
            this.used.active = false
            PveTool.setSpineShader(this.spine, "spine_gray")
        }
        if (this.activeIds.indexOf(this._solId) != -1 && this._solId > this.heroModel.curHeroInfo.soldierId && this.heroModel.curHeroInfo.soldierId < this.activeIds[0]) {
            this.redPoint.active = true
            if (this.changeBtn.active) {
                this.btnRedPoint.active = true
            }
        }
    }

    recycleItem() {
        super.recycleItem()
        PveTool.clearSpine(this.spine)
    }

    _itemSelect() {
        if (!this.used.active && this.activeIds.indexOf(this._solId) != -1 && this.data.isActive) {
            this.changeBtn.active = this.ifSelect
        } else {
            this.changeBtn.active = false
        }
        this.selectIcon.active = this.ifSelect
    }

    _itemClick() {
        let heroId = this._heroId
        let solId = this._solId
        let ids = this.heroModel.activeHeroSoldierIds[heroId]
        let sCfg = ConfigManager.getItemById(SoldierCfg, solId)
        let careerCfg = ConfigManager.getItemByField(Hero_careerCfg, "career_id", this.heroModel.curHeroInfo.careerId)
        if (ids && ids.length > 0 && ids.indexOf(solId) != -1) {
            if (sCfg.type == careerCfg.career_type) {
                this.redPoint.active = false
                HeroUtils.deleteHeroActiveSoldier(heroId, solId)
                gdk.e.emit(RoleEventId.UPDATE_HERO_LIST)
            }
        }
    }

    changeFunc() {
        let msg = new icmsg.HeroSoldierChangeReq()
        msg.heroId = this._heroId
        msg.soldierId = this._solId
        NetManager.send(msg, () => {
            gdk.e.emit(RoleEventId.UPDATE_HERO_ATTR);
        })
    }

    _updateUsedState() {
        let curHero = this.heroModel.curHeroInfo
        let soldiers = this.model.heroSoldiers
        let info: SoldierType = soldiers[curHero.heroId]
        if (info && info.curId == this._solId && this.activeIds.indexOf(info.curId) != -1) {
            this.used.active = true
            this.changeBtn.active = false
        } else {
            this.used.active = false
        }
    }
}
