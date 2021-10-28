import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import ScoreSysZyItem2Ctrl from './ScoreSysZyItem2Ctrl';
import TaskModel from '../../model/TaskModel';
import { Score_recourseCfg } from '../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-19 15:11:38
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/scoreSystem/ScoreSysZyItemCtrl")
export default class ScoreSysZyItemCtrl extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    titleLab: cc.Label = null;

    @property(cc.Label)
    descLab: cc.Label = null;

    @property(cc.Node)
    btnOpen: cc.Node = null;

    @property(cc.Node)
    groupContent: cc.Node = null;

    @property(cc.Prefab)
    zyItem2: cc.Prefab = null;

    _isOpen = false

    _recourseCfg: Score_recourseCfg
    _index = 0

    get taskModel(): TaskModel { return ModelManager.get(TaskModel); }

    onEnable() {

    }

    updateViewInfo(cfg: Score_recourseCfg, index) {
        this._recourseCfg = cfg
        this._index = index
        this.titleLab.string = cfg.theme
        this.descLab.string = cfg.desc
        GlobalUtil.setSpriteIcon(this.node, this.icon, `icon/item/${cfg.icon}`)
    }

    openTheme() {
        let btnLab = this.btnOpen.getChildByName("label").getComponent(cc.Label)
        let arrow = this.btnOpen.getChildByName("arrow")

        if (!this._isOpen) {
            btnLab.string = `收起`
            arrow.scaleY = -1
            this._isOpen = true
            this.groupContent.removeAllChildren()
            this.groupContent.height = 0
            let cfgs = ConfigManager.getItemsByField(Score_recourseCfg, "group", this._recourseCfg.group)
            for (let i = 0; i < cfgs.length; i++) {
                if (!cfgs[i].whether_theme) {
                    let item = cc.instantiate(this.zyItem2)
                    let ctrl = item.getComponent(ScoreSysZyItem2Ctrl)
                    ctrl.updateViewInfo(cfgs[i])
                    this.groupContent.addChild(item)
                }
            }
            this.taskModel.scoreSysListScrollIndex = this._index
        } else {
            this._isOpen = false
            btnLab.string = `展开`
            arrow.scaleY = 1
            this.groupContent.removeAllChildren()
            this.groupContent.height = 0

        }

    }
}