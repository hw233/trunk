import ConfigManager from '../../../common/managers/ConfigManager';
import CopyModel from '../../../common/models/CopyModel';
import EnterStageViewCtrl from './EnterStageViewCtrl';
import GuideUtil from '../../../common/utils/GuideUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import { Copy_stageCfg, SystemCfg } from '../../../a/config';


export enum StageState {
    Pass,
    Open,
    Lock
}

export class StageData {
    stageCfg: Copy_stageCfg;
    state: StageState;
    cityId: number;
    sid: number;
    cupNum: number;
    cupMaxNum: number;
    isDanger: boolean;
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/map/CityStageItemCtrl")
export default class CityStageItemCtrl extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null;
    @property(cc.Node)
    bossIcon: cc.Node = null;
    @property(cc.Node)
    hangIcon: cc.Node = null;
    @property(cc.Node)
    newIcon: cc.Node = null;
    @property(cc.Label)
    stageName: cc.Label = null;
    @property(cc.LabelAtlas)
    normalLevelFont: cc.LabelAtlas = null;
    @property(cc.LabelAtlas)
    bossLevelFont: cc.LabelAtlas = null;
    // @property(cc.Node)
    // select: cc.Node = null;
    @property(cc.Sprite)
    mask: cc.Sprite = null;
    @property(cc.SpriteFrame)
    bossLevelMask: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    normalLevelMak: cc.SpriteFrame = null;
    @property(cc.Node)
    dangerNode: cc.Node = null;
    @property(cc.Node)
    openSystem: cc.Node = null;
    @property(cc.Node)
    trackIcon: cc.Node = null;

    data: StageData = null;
    idx: number = 0;
    scale: number = 1;
    isBindGuide: boolean = false;

    onLoad() {
        // this.select.active = false;
    }

    onDisable() {
        this.trackIcon.stopAllActions();
    }

    updateData(data: StageData, idx) {
        this.data = data;
        this.idx = idx;
        let cfg = data.stageCfg;
        let stageId = cfg.id;

        let cid = Math.floor((stageId % 10000) / 100);
        let sid = stageId % 100;
        this.stageName.string = `${cid}/${sid}`;

        // let path = `view/instance/texture/main/gq_gq0${idx % 4 + 1}`
        // GlobalUtil.setSpriteIcon(this.node, this.icon, path)

        let model = ModelManager.get(CopyModel);
        let isNewOpen = false;
        let isLock = false;
        if (data.state == StageState.Pass) {

        } else if (data.state == StageState.Open) {
            if (model.lastCompleteStageId != stageId) {
                isNewOpen = true;
            }
        } else {
            isLock = true;
        }
        this.newIcon.active = isNewOpen;
        this.dangerNode.active = data.isDanger;
        this.icon.active = !this.newIcon.active;
        this.hangIcon.active = model.hangStageId == stageId;
        this.openSystem.active = false;
        this.setTrackIcon(false);
        if (isLock) {
            let sysCfg = ConfigManager.getItemByField(SystemCfg, 'fbId', stageId, { show: 1 });
            if (sysCfg) {
                this.openSystem.getChildByName('label').getComponent(cc.Label).string = sysCfg.name
                this.openSystem.active = true;
            }
        }
        this.mask.node.active = (isLock && !data.isDanger) ? true : false;
        if (cfg.type_stage == 3) {
            this.bossIcon.active = true;
            this.newIcon.active = this.icon.active = false;
            //this.stageName.string = '';
            this.stageName.node.y = -40;
            if (isLock) {
                this.stageName.font = this.bossLevelFont;
                this.mask.spriteFrame = this.bossLevelMask;
            }
        } else {
            this.stageName.node.y = 0;
            this.bossIcon.active = false;
            if (isLock) {
                this.stageName.font = this.normalLevelFont;
                this.mask.spriteFrame = this.normalLevelMak;
            }
        }
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
        this.setTrackIcon(false);
        if (data.state == StageState.Lock) {
            gdk.gui.showMessage(`${data.cityId}-${data.sid}${gdk.i18n.t("i18n:MAP_TIP1")}`);
            return;
        }
        if (data.stageCfg.copy_id == 7 && data.state == StageState.Pass) {
            gdk.gui.showMessage(`${data.cityId}-${data.sid}${gdk.i18n.t("i18n:MAP_TIP2")}`);
            return;
        }
        gdk.panel.open(PanelId.EnterStageView, (node: cc.Node) => {
            let ctrl = node.getComponent(EnterStageViewCtrl);
            ctrl.updateData(data);
        });
    }

    bindGuide() {
        if (!this.data) return;
        let stageId = this.data.stageCfg.id;
        let curGuideCfg = GuideUtil.getCurGuide();
        if (curGuideCfg && curGuideCfg.bindBtnId) {
            if (parseInt(curGuideCfg.bindBtnId) == stageId) {
                GuideUtil.bindGuideNode(stageId, this.node);
                this.isBindGuide = true;
            }
        }
    }

    setTrackIcon(v: boolean) {
        this.trackIcon.active = v;
        if (v) {
            this.trackIcon.runAction(cc.repeatForever(
                cc.sequence(
                    cc.moveBy(1, 0, -20),
                    cc.moveBy(1, 0, 20)
                )
            ))
        }
        else {
            this.trackIcon.stopAllActions();
        }
    }

    // onClick() {
    //     // this.main.onStageSelect(`${this._stageId}`);
    //     // this.updateSelect(true)
    // }
}