import JumpUtils from '../../../common/utils/JumpUtils';
import MathUtil from '../../../common/utils/MathUtil';
import PanelId from '../../../configs/ids/PanelId';
import StringUtils from '../../../common/utils/StringUtils';

/**
 * 主线建筑升级效果
 * @Author: sthoo.huang
 * @Description:
 * @Date: 2021-06-02 15:59:18
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-07 13:53:23
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/map/MainLineBuildUpgradeEffectCtrl")
export default class MainLineBuildUpgradeEffectCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    spine: sp.Skeleton = null

    @property(sp.Skeleton)
    spine2: sp.Skeleton = null

    @property(cc.Node)
    stageNode: cc.Node = null

    onEnable() {

    }

    initEffect(lv, callFunc: Function, thisArg: any) {
        // let baseCfg = ConfigManager.getItemById(BaseCfg, id)
        // let baseInfo = this.mainModel.getBaseInfoBy(id)
        // let lv = baseInfo ? baseInfo.level + 1 : 1
        // this.nameLab.string = `${baseCfg.name}Lv.${lv}`
        JumpUtils.showGuideMask()

        this.spine.setAnimation(0, "stand", false)
        this.spine.setCompleteListener((trackEntry, loopCount) => {
            this.stageNode.active = true
            let rndX = MathUtil.rnd(-125, 125)
            let rndY = MathUtil.rnd(1, 125)
            this.stageNode.x = rndX > 0 ? 100 + rndX : -100 + rndX
            this.stageNode.y = 100 + rndY
            let stageLab = cc.find("stageLab", this.stageNode).getComponent(cc.Label)
            stageLab.string = StringUtils.format(gdk.i18n.t("i18n:MAIN_BUILDING_TIP23"), lv)//`第${lv}章`
            let stage_spine = cc.find(`spine`, this.stageNode).getComponent(sp.Skeleton)
            stage_spine.setAnimation(0, "stand2", false)
            stage_spine.setCompleteListener((trackEntry, loopCount) => {
                this.spine2.setAnimation(0, "stand10", false)
                this.spine2.setCompleteListener((trackEntry, loopCount) => {
                    JumpUtils.hideGuideMask()
                    gdk.panel.hide(PanelId.MainLineBuildUpgradeEffect)
                    if (callFunc) {
                        callFunc.call(thisArg)
                    }
                })
            })
        })
    }

}