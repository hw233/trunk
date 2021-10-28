import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import { Copy_stageCfg } from '../../../a/config';
import { ParseMainLineId } from '../../../view/instance/utils/InstanceUtil';

/** 
 * 切换章节收益展示界面
 * @Author: sthoo.huang  
 * @Date: 2019-10-25 20:31:11 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-11-26 15:57:30
 */const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainIncomePanelCtrl")
export default class MainIncomePanelCtrl extends gdk.BasePanel {

    @property(cc.Label)
    stageLab: cc.Label = null

    @property(cc.Node)
    iconNodes: cc.Node[] = []

    @property(cc.Label)
    preNums: cc.Label[] = []

    @property(cc.Label)
    curNums: cc.Label[] = []


    get copyModel() { return ModelManager.get(CopyModel); }

    onEnable() {
        this._updateViewInfo()
    }

    onDisable() {
        gdk.Timer.clearAll(this)
        this.node.stopAllActions()
    }

    _updateViewInfo() {
        let preStageId = GlobalUtil.getLocal("income_show_stageId", true, 110106);
        let curStageId = this.copyModel.lastCompleteStageId;
        let curCfg = ConfigManager.getItemById(Copy_stageCfg, curStageId);
        let preCfg = ConfigManager.getItemById(Copy_stageCfg, preStageId);
        for (let i = 0; i < preCfg.drop_show2.length; i++) {
            this.preNums[i].string = `${preCfg.drop_show2[i]}`
            this.curNums[i].string = `${curCfg.drop_show2[i]}/m`
        }
        let aid = ParseMainLineId(curStageId, 1)//地图id编号
        let sid = ParseMainLineId(curStageId, 2);//关卡编号
        this.stageLab.string = `关卡${aid}-${sid}`

        let action = cc.sequence(cc.fadeOut(3), cc.callFunc(() => {
            if (!cc.isValid(this.node)) return;
            this.close(-1);
        }))
        this.node.runAction(action);
        GlobalUtil.setLocal("income_show_stageId", curStageId);
    }
}       