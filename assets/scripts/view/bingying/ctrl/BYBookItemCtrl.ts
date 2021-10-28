import BYModel from '../model/BYModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PveTool from '../../pve/utils/PveTool';
import SoldierModel from '../../../common/models/SoldierModel';
import UiListItem from '../../../common/widgets/UiListItem';
import { BarracksCfg, SoldierCfg } from '../../../a/config';


/** 
 * 士兵选择子项控制器
 * @Author: sthoo.huang 
 * @Date: 2020-01-14 18:00:38
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-08-31 16:26:05
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYBookItemCtrl")
export default class BYBookItemCtrl extends UiListItem {

    @property(cc.Label)
    titleLab: cc.Label = null

    @property(cc.Node)
    classIcon: cc.Node = null

    @property(cc.Node)
    selectIcon: cc.Node = null

    @property(cc.Node)
    unGet: cc.Node = null

    @property(cc.Node)
    unActive: cc.Node = null

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    activeIds: number[] = []

    _solId: number = 0

    get model(): SoldierModel { return ModelManager.get(SoldierModel); }
    get byModel(): BYModel { return ModelManager.get(BYModel); }

    onEnable() {

    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    updateView() {
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
            PveTool.setSpineShader(this.spine, "")
        } else {
            this.unGet.active = true
            this.unActive.active = true
            PveTool.setSpineShader(this.spine, "spine_gray")
        }
    }

    recycleItem() {
        super.recycleItem()
        PveTool.clearSpine(this.spine)
    }

    _itemSelect() {
        this.selectIcon.active = this.ifSelect
    }
}
