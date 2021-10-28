import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel, { CopyType } from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import StringUtils from '../../../common/utils/StringUtils';
import TaskModel from '../model/TaskModel';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Copy_stageCfg, HeroCfg, Mission_main_lineCfg } from '../../../a/config';


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/MainTaskProgressCtrl")
export default class MainTaskProgressCtrl extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.Node)
    hero: cc.Node = null

    @property(cc.Node)
    reward: cc.Node = null

    @property(cc.Node)
    tipNode: cc.Node = null

    @property(cc.Label)
    proBarLab: cc.Label = null;

    @property(cc.Label)
    targetLab: cc.Label = null;

    @property(cc.Node)
    proBarBg: cc.Node = null;

    @property(cc.Node)
    proBarMask: cc.Node = null;

    @property(cc.Node)
    redPoint: cc.Node = null;

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }
    get copyModel(): CopyModel { return ModelManager.get(CopyModel); }

    _curCfg: Mission_main_lineCfg

    updateProgress(curCfg: Mission_main_lineCfg) {
        let stageCfgs = ConfigManager.getItems(Copy_stageCfg, (cfg: Copy_stageCfg) => {
            if (cfg.copy_id == CopyType.MAIN && cfg.id <= curCfg.number) {
                return true
            }
        })
        this._curCfg = curCfg
        this.proBarLab.string = `${this._getCurIndex()}/${stageCfgs.length}`
        this.targetLab.string = `${curCfg.show_desc}`
        this.proBarMask.width = this.proBarBg.width * (this._getCurIndex() / stageCfgs.length)

        this.icon.active = false
        this.hero.active = false
        this.reward.active = false
        this.tipNode.active = false

        if (curCfg.show && curCfg.show > 0) {
            this.icon.active = true
            GlobalUtil.setSpriteIcon(this.node, this.icon, `view/act/texture/mainTask/zx_huodong0${curCfg.show}`)
        }

        if (curCfg.show_hero && curCfg.show_hero > 0) {
            this.hero.active = true
            let spine = this.hero.getComponent(sp.Skeleton)
            let heroCfg = ConfigManager.getItemById(HeroCfg, curCfg.show_hero)
            let url = StringUtils.format("spine/hero/{0}/0.5/{0}", heroCfg.skin);
            this.hero.scaleX = -1
            GlobalUtil.setSpineData(this.node, spine, url, true, "stand", true, false);
        }

        let solt = cc.find("solt", this.reward).getComponent(UiSlotItem)
        if (curCfg.show_reward && curCfg.show_reward > 0) {
            this.reward.active = true
            solt.updateItemInfo(curCfg.reward1[0], curCfg.reward1[1])
            solt.node.runAction(
                cc.repeatForever(
                    cc.sequence(
                        cc.moveTo(.3, cc.v2(17, 55)),
                        cc.moveTo(.3, cc.v2(17, 50)),
                        cc.moveTo(.3, cc.v2(17, 45)),
                        cc.moveTo(.3, cc.v2(17, 50)),
                    )
                )
            );
        } else {
            solt.node.stopAllActions()
        }

        if (curCfg.resources != '') {
            this.tipNode.active = true
            GlobalUtil.setSpriteIcon(this.node, this.tipNode, `view/act/texture/mainTask/${curCfg.resources}`)
        }

        if (this._getCurIndex() >= stageCfgs.length) {
            this.redPoint.active = true
            this.redPoint.setScale(1);
            this.redPoint.runAction(
                cc.repeatForever(
                    cc.sequence(
                        cc.scaleTo(.5, 1.3, 1.3),
                        cc.scaleTo(.5, 1, 1)
                    )
                )
            );
        } else {
            this.redPoint.active = false;
            this.redPoint.stopAllActions();
        }
    }

    stopAction() {
        this.redPoint.stopAllActions();

        let solt = cc.find("solt", this.reward)
        solt.stopAllActions()
    }

    _getCurIndex() {
        let curStageId = this.copyModel.lastCompleteStageId
        let stageCfgs = ConfigManager.getItems(Copy_stageCfg, (cfg: Copy_stageCfg) => {
            if (cfg.copy_id == CopyType.MAIN && cfg.id <= curStageId) {
                return true
            }
        })
        return stageCfgs.length
    }

    openFunc() {
        if (this._curCfg.show_hero > 0 || this._curCfg.show_reward > 0) {
            gdk.panel.open(PanelId.MainLineShowHero)
            return
        }
        JumpUtils.openPanel({
            panelId: PanelId.Task,
            panelArgs: { args: [2] }
        });
    }
}