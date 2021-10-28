import { Common_carouselCfg } from "../../../../a/config";
import ConfigManager from "../../../../common/managers/ConfigManager";
import ModelManager from "../../../../common/managers/ModelManager";
import RoleModel from "../../../../common/models/RoleModel";
import GlobalUtil from "../../../../common/utils/GlobalUtil";
import JumpUtils from "../../../../common/utils/JumpUtils";
import ActivityModel from "../../model/ActivityModel";

/** 
 * 活动海报界面
 * @Author:  weiliang.huang    
 * @Date: 2019-06-25 09:27:03 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-09-14 17:17:40
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/poster/PosterViewCtrl")
export default class PosterViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bg1Sp: cc.Node = null;
    @property(cc.Node)
    bg2Sp: cc.Node = null;
    @property(cc.Node)
    titleSp: cc.Node = null;
    @property(cc.Node)
    goBtn: cc.Node = null;
    @property(cc.Label)
    desLb: cc.Label = null;

    @property(cc.ToggleContainer)
    lotteryIdxToggleContainer: cc.ToggleContainer = null;

    @property(cc.Prefab)
    idxTogglePrefab: cc.Prefab = null;

    @property(cc.Node)
    skipAniFlag: cc.Node = null;

    @property(cc.Node)
    leftBtn: cc.Node = null;
    @property(cc.Node)
    rightBtn: cc.Node = null;

    curIndex: number = 0;
    cfgs: Common_carouselCfg[] = [];

    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    skipState: boolean = false;

    onLoad() {

        this.lotteryIdxToggleContainer.toggleItems.forEach(item => {
            item.interactable = false;
        });
    }

    onEnable() {
        this.cfgs = []
        let temCfgs = ConfigManager.getItems(Common_carouselCfg);
        for (let i = 0, n = temCfgs.length; i < n; i++) {
            let cfg = temCfgs[i]
            if (JumpUtils.ifSysOpen(cfg.system) && cfg.show) {
                this.cfgs.push(cfg);
            }
        }
        if (this.cfgs.length == 0) {
            this.close()
            return;
        }

        this.leftBtn.active = this.cfgs.length > 1;
        this.rightBtn.active = this.cfgs.length > 1;

        this.cfgs.sort((a, b) => {
            return a.sorting - b.sorting;
        })

        this.actModel.openActPosterState = true;
        let skip = GlobalUtil.getLocal(`activityPoster_skip`);
        if (skip == null) {
            GlobalUtil.setLocal(`activityPoster_skip`, true);
            this.skipState = true;
        } else {
            this.skipState = skip;
        }


        this._initTypeToggle();
    }

    _initTypeToggle() {
        this.lotteryIdxToggleContainer.node.removeAllChildren();
        this.cfgs.forEach((cfg, idx) => {
            let idxToggle = cc.instantiate(this.idxTogglePrefab);
            idxToggle.name = `idxToggle${idx + 1}`;
            idxToggle.parent = this.lotteryIdxToggleContainer.node;
            idxToggle.active = true;
        });
        this.lotteryIdxToggleContainer.toggleItems[0].check();
        this.curIndex = 1;
        this.updateSelectView();
        this.skipAniFlag.active = this.skipState;
    }

    onSkipAniBtnClick() {
        //this.actModel.isSkipAni = !this.actModel.isSkipAni;
        this.skipState = !this.skipState
        this.skipAniFlag.active = this.skipState;
        GlobalUtil.setLocal(`activityPoster_skip`, this.skipState);

    }

    onArrBtnClick(e: cc.Event) {
        let name = e.currentTarget.name;
        switch (name) {
            case 'leftArrow':
                //ctrl.scrollToLeft();
                if (this.curIndex == 1) {
                    this.curIndex = this.cfgs.length;
                } else {
                    this.curIndex -= 1
                }
                break;
            case 'rightArrow':
                if (this.curIndex == this.cfgs.length) {
                    this.curIndex = 1;
                } else {
                    this.curIndex += 1
                }
                break;
            default:
                break;
        }
        let emitToggle = this.lotteryIdxToggleContainer.node.getChildByName(`idxToggle${this.curIndex}`).getComponent(cc.Toggle);
        emitToggle && emitToggle.check();
        this.updateSelectView();
    }

    onToggleContainerClick(toggle: cc.Toggle) {
        let containerName = toggle['_toggleContainer'].node.name;
        if (!containerName) return;
        let toggleName = toggle.node.name;
        let idx = toggleName.charAt(toggleName.length - 1);
        this.curIndex = parseInt(idx);
        let emitToggle;
        switch (containerName) {
            case 'indexNode':
                emitToggle = this.lotteryIdxToggleContainer.node.getChildByName(`idxToggle${parseInt(idx)}`).getComponent(cc.Toggle);
                this.updateSelectView();
                break;
            default:
                break;
        }
        emitToggle && emitToggle.check();
    }

    updateSelectView() {
        let cfg = this.cfgs[this.curIndex - 1];
        let bgPath = 'view/act/texture/bg/poster/' + cfg.background;
        GlobalUtil.setSpriteIcon(this.node, this.bg1Sp, bgPath);
        let titlePath = 'view/act/texture/poster/' + cfg.title;
        GlobalUtil.setSpriteIcon(this.node, this.titleSp, titlePath);
        this.desLb.string = cfg.des;
    }

    goBtnClick() {
        let cfg = this.cfgs[this.curIndex - 1];
        JumpUtils.openView(cfg.system);
        this.close()
    }
}
