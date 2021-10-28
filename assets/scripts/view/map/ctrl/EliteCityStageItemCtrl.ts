import CopyModel from '../../../common/models/CopyModel';
import CopyUtil from '../../../common/utils/CopyUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import { StageData, StageState } from './CityStageItemCtrl';

/**
 * 精英副本小地图item
 * @Author: yaozu.hu
 * @Date: 2020-04-22 11:00:32
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-01-14 17:39:12
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/map/EliteCityStageItemCtrl")
export default class EliteCityStageItemCtrl extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null;
    @property(cc.Node)
    newIcon: cc.Node = null;
    @property(cc.Label)
    stageName: cc.Label = null;
    @property(cc.Sprite)
    mask: cc.Sprite = null;

    @property(cc.Node)
    cupNode: cc.Node = null;
    @property([cc.Node])
    cupIcons: cc.Node[] = []

    data: StageData = null;
    idx: number = 0;
    scale: number = 1;
    cutIndex: number = 0;

    updateData(data: StageData, idx: number, cutIndex: number) {
        this.data = data;
        this.idx = idx;
        let cfg = data.stageCfg;
        let stageId = cfg.id;
        this.cutIndex = cutIndex;
        let cid = Math.floor((stageId % 10000) / 100);
        let sid = stageId % 100;
        this.stageName.string = `${cid}/${sid}`;
        if (stageId == 630101) {
            GuideUtil.bindGuideNode(7004, this.node)
        }
        // let path = `view/instance/texture/main/gq_gq0${idx % 4 + 1}`
        // GlobalUtil.setSpriteIcon(this.node, this.icon, path)

        //获取当前章节的奖杯数
        let cupNum = CopyUtil.getEliteStageCupNum(stageId, this.cutIndex - 1)

        let model = ModelManager.get(CopyModel);
        let isNewOpen = false;
        let isLock = false;
        this.stageName.node.active = true
        this.cupNode.active = false;
        if (data.state == StageState.Pass) {
            //this.stageName.node.active = false
            this.cupNode.active = true;
            //let cupNum = MathUtil.rnd(1, 3);
            let i = 0;
            this.cupIcons.forEach(icon => {
                icon.active = i < cupNum;
                i++;
            })
        } else if (data.state == StageState.Open) {
            if (model.lastCompleteStageId != stageId) {
                isNewOpen = true;
            }
        } else {
            isLock = true;
        }

        this.newIcon.active = isNewOpen;
        this.icon.active = !this.newIcon.active;
        this.mask.node.active = isLock ? true : false;
    }

    // updateSelect(isSelect) {
    //     this.select.active = isSelect
    // }

    updateScale(scale: number) {
        this.node.scale = this.scale * scale;
    }

    openStage() {
        let data = this.data;
        if (!data) return;
        if (data.state == StageState.Lock) {
            gdk.gui.showMessage(`${data.cityId}-${data.sid}${gdk.i18n.t("i18n:MAP_TIP1")}`);
            return;
        }

        // if (data.stageCfg.copy_id == 13) {
        //     gdk.panel.setArgs(PanelId.SubEliteChallengeView, data.stageCfg.id, data)
        //     gdk.panel.open(PanelId.SubEliteChallengeView)
        //     return;
        // }
        // gdk.panel.open(PanelId.EnterStageView, (node: cc.Node) => {
        //     let ctrl = node.getComponent(EnterStageViewCtrl);
        //     ctrl.updateData(data);
        // });

        gdk.panel.hide(PanelId.SubEliteGroupView);
        gdk.panel.hide(PanelId.SubEliteChallengeView);
        JumpUtils.openInstance(this.data.stageCfg.id);
    }
}
