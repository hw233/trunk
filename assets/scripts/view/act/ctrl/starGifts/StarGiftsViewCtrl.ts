import ActivityModel from '../../model/ActivityModel';
import ActivityUtils from '../../../../common/utils/ActivityUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import { Activity_star_giftsCfg } from '../../../../a/config';
import { ActivityEventId } from '../../enum/ActivityEventId';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/starGifts/StarGiftsViewCtrl")
export default class StarGiftsViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    turnLab: cc.Label = null;

    @property(cc.Node)
    leftBtn: cc.Node = null;

    @property(cc.Node)
    rightBtn: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    get actModel(): ActivityModel { return ModelManager.get(ActivityModel); }

    list: ListView;
    curTaskRounds: number;
    onEnable() {
        gdk.e.on(ActivityEventId.ACTIVITY_STAR_GIFTS_REWARD_TYPE_UPDATE, this.updateTurn, this);
    }

    onDisable() {
        gdk.e.targetOff(this);
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    onCloseBtnClick() {
        gdk.panel.hide(PanelId.ActivityMainView);
    }

    @gdk.binding('actModel.excitingAcrOfStarGiftRewardType')
    updateList() {
        this._initList();
        this.list.clear_items();
        let rewardType = this.actModel.excitingAcrOfStarGiftRewardType;
        let cfgs = ConfigManager.getItems(Activity_star_giftsCfg, (cfg: Activity_star_giftsCfg) => {
            if (cfg.reward_type == rewardType && cfg.rounds == this.curTaskRounds) return true;
        });
        this.list.set_data(cfgs);
    }

    @gdk.binding('actModel.excitingAcrOfStarGiftRounds')
    updateTurn() {
        let allCfgs = ConfigManager.getItems(Activity_star_giftsCfg, (cfg: Activity_star_giftsCfg) => {
            if (cfg.reward_type == this.actModel.excitingAcrOfStarGiftRewardType) {
                return true;
            }
        })
        let b: boolean = false;
        for (let i = 0; i < allCfgs.length; i++) {
            if (ActivityUtils.getExcitingActTaskState(allCfgs[i].taskid) == 1) {
                b = true;
                this.curTaskRounds = allCfgs[i].rounds;
                break;
            }
        }
        if (!b) {
            this.curTaskRounds = this.actModel.excitingAcrOfStarGiftRounds;
        }
        let str = this.actModel.excitingAcrOfStarGiftRounds > this.curTaskRounds ? `${gdk.i18n.t("i18n:ACT_STAR_TIP2")}` : '';
        this.turnLab.string = `${gdk.i18n.t("i18n:ACT_FLIPCARD_TIP13")}${[gdk.i18n.t("i18n:ACT_FLIPCARD_NUM1"), gdk.i18n.t("i18n:ACT_FLIPCARD_NUM2"), gdk.i18n.t("i18n:ACT_FLIPCARD_NUM3")][this.curTaskRounds - 1]}${gdk.i18n.t("i18n:ACT_FLIPCARD_TIP14")}` + str;
        this.leftBtn.active = this.curTaskRounds > 1;
        this.rightBtn.active = this.curTaskRounds < 3;
        if (this.actModel.excitingAcrOfStarGiftRounds == 3) {
            let cfgs = ConfigManager.getItems(Activity_star_giftsCfg, (cfg: Activity_star_giftsCfg) => {
                if (cfg.reward_type == this.actModel.excitingAcrOfStarGiftRewardType
                    && cfg.rounds == this.actModel.excitingAcrOfStarGiftRounds) {
                    return true;
                }
            });
            if (ActivityUtils.getExcitingActTaskState(cfgs[cfgs.length - 1].taskid) >= 1) {
                this.turnLab.string = gdk.i18n.t("i18n:ACT_STAR_TIP3");
            }
        }
        this.updateList();
    }


    onArrowClcik(e, data) {
        if (data == 'left') {
            this.curTaskRounds = Math.max(1, this.curTaskRounds - 1);
        }
        else if (data == 'right') {
            this.curTaskRounds = Math.min(3, this.curTaskRounds + 1);
        }
        this.leftBtn.active = this.curTaskRounds > 1;
        this.rightBtn.active = this.curTaskRounds < 3;
        let str = this.actModel.excitingAcrOfStarGiftRounds > this.curTaskRounds ? `${gdk.i18n.t("i18n:ACT_STAR_TIP2")}` : '';
        this.turnLab.string = `${gdk.i18n.t("i18n:ACT_FLIPCARD_TIP13")}${[gdk.i18n.t("i18n:ACT_FLIPCARD_NUM1"), gdk.i18n.t("i18n:ACT_FLIPCARD_NUM2"), gdk.i18n.t("i18n:ACT_FLIPCARD_NUM3")][this.curTaskRounds - 1]}${gdk.i18n.t("i18n:ACT_FLIPCARD_TIP14")}` + str;
        if (this.actModel.excitingAcrOfStarGiftRounds == 3) {
            let cfgs = ConfigManager.getItems(Activity_star_giftsCfg, (cfg: Activity_star_giftsCfg) => {
                if (cfg.reward_type == this.actModel.excitingAcrOfStarGiftRewardType
                    && cfg.rounds == this.actModel.excitingAcrOfStarGiftRounds) {
                    return true;
                }
            });
            if (ActivityUtils.getExcitingActTaskState(cfgs[cfgs.length - 1].taskid) >= 1) {
                this.turnLab.string = gdk.i18n.t("i18n:ACT_STAR_TIP3");
            }
        }
        this.updateList();
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                async: true,
                gap_y: 20,
                direction: ListViewDir.Vertical,
            })
        }
    }
}
