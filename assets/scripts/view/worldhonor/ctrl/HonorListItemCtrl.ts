import { Arenahonor_progressCfg, Arenahonor_worldwideCfg } from "../../../a/config";
import ConfigManager from "../../../common/managers/ConfigManager";
import BagUtils from "../../../common/utils/BagUtils";
import GlobalUtil from "../../../common/utils/GlobalUtil";
import JumpUtils from "../../../common/utils/JumpUtils";
import RedPointUtils from "../../../common/utils/RedPointUtils";
import TimerUtils from "../../../common/utils/TimerUtils";
import UiListItem from "../../../common/widgets/UiListItem";
import PanelId from "../../../configs/ids/PanelId";
import ActUtil from "../../act/util/ActUtil";
import ArenaHonorUtils from "../../arenahonor/utils/ArenaHonorUtils";
import WorldHonorUtils from "../utils/WorldHonorUtils";

/**
 * enemy巅峰赛列表界面Item
 * @Author: yaozu.hu
 * @Date: 2019-10-28 10:48:51
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-22 13:52:20
 */
const { ccclass, property, menu } = cc._decorator;
function hasId(v: any): boolean {
    return v.id == this.id;
}
@ccclass
@menu("qszc/view/worldhonor/HonorListItemCtrl")
export default class HonorListItemCtrl extends UiListItem {


    @property(cc.Sprite)
    bgSp: cc.Sprite = null;
    @property(cc.Sprite)
    titleSp: cc.Sprite = null;
    @property(cc.Sprite)
    iconSp: cc.Sprite = null;
    @property(cc.Node)
    redPoint: cc.Node = null;
    @property(cc.Node)
    timeNode: cc.Node = null;
    @property(cc.Sprite)
    itemSp: cc.Sprite = null;
    @property(cc.Label)
    itemNum: cc.Label = null;
    @property(cc.Label)
    endTime: cc.Label = null;
    @property(cc.Label)
    statuLab: cc.Label = null;

    info: any;
    lock: boolean = false;
    updateView() {
        this.info = this.data;
        this.lock = this.data.lock;
        //let reward: number[] = []
        switch (this.info.system) {
            case 2921: {
                //世界巅峰赛
                GlobalUtil.setSpriteIcon(this.node, this.bgSp, "view/worldhonor/texture/sjdfs_shijiedi");
                GlobalUtil.setSpriteIcon(this.node, this.titleSp, "view/worldhonor/texture/sjdfs_shijiebiaoti");
                GlobalUtil.setSpriteIcon(this.node, this.iconSp, "view/worldhonor/texture/sjdfs_shijiehuizhang");
                GlobalUtil.setSpriteIcon(this.node, this.itemSp, "icon/item/main_itemmoney48_s");
                this.itemNum.string = BagUtils.getItemNumById(32) + ''
                break;
            }
            case 2919: {
                //GuideUtil.bindGuideNode(1102, this.bgButton);
                GlobalUtil.setSpriteIcon(this.node, this.bgSp, "view/worldhonor/texture/sjdfs_rongyaodi");
                GlobalUtil.setSpriteIcon(this.node, this.titleSp, "view/worldhonor/texture/sjdfs_rongyaobiaoti");
                GlobalUtil.setSpriteIcon(this.node, this.iconSp, "view/worldhonor/texture/sjdfs_rongyaohuizhang");
                GlobalUtil.setSpriteIcon(this.node, this.itemSp, "icon/item/main_itemmoney46_s");
                this.itemNum.string = BagUtils.getItemNumById(31) + ''
                break;
            }
        }

        this.updateRedPointState();
        this._updatTimeLab();
    }

    updateRedPointState() {
        let result = false;
        switch (this.info.system) {
            case 2919:
                result = RedPointUtils.is_ArenaHonor_show_redPoint()
                break;
            case 2921:
                result = RedPointUtils.is_WorldHonor_show_redPoint()
                break;
        }
        this.redPoint.active = result
    }
    enterInstance() {
        if (this.lock) return;
        switch (this.info.system) {
            case 2919: {

                let proId = ArenaHonorUtils.getCurProgressId()
                if (proId == 1) {
                    JumpUtils.openPanel({
                        panelId: PanelId.ArenahonorPosterView,
                        currId: gdk.gui.getCurrentView()
                    })
                } else {
                    JumpUtils.openPanel({
                        panelId: PanelId.ArenaHonorView,
                        currId: gdk.gui.getCurrentView()
                    })
                }

                break;
            }
            case 2921: {
                //let proId = ArenaHonorUtils.getCurProgressId()
                JumpUtils.openPanel({
                    panelId: PanelId.WorldHonorView,
                    currId: gdk.gui.getCurrentView()
                })
                break;
            }
        }
    }

    _updatTimeLab() {
        //this.tiemNode.active = !this.lock && [2919].indexOf(this.info.system) !== -1;
        switch (this.info.system) {

            case 2919:
                //this.tiemNode.getChildByName('timeLab').color = cc.color().fromHEX('#00FF12');
                this._updateArenaHonorTime();
                this.schedule(this._updateArenaHonorTime, 1);
                break;
            case 2921:
                //this.tiemNode.getChildByName('timeLab').color = cc.color().fromHEX('#00FF12');
                this._updateWorldHonorTime();
                this.schedule(this._updateWorldHonorTime, 1);
                break;
        }
    }


    _updateWorldHonorTime() {
        if (this.lock) {
            this.timeNode.active = false
            this.statuLab.string = `未开启`;
            //let proId = WorldHonorUtils.getCurProgressId()
            return;
        }
        let proId = WorldHonorUtils.getCurProgressId()
        //let lab = this.tiemNode.getChildByName('timeLab').getComponent(cc.Label);
        if (!proId) {
            this.timeNode.active = false
            this.statuLab.string = `已结束`;
            this.unscheduleAllCallbacks();
        }
        else {
            this.timeNode.active = true
            let cfg = ConfigManager.getItemById(Arenahonor_worldwideCfg, proId)
            this.statuLab.string = '进行中:' + cfg.subject_name;
            let curTime = GlobalUtil.getServerTime();
            let ct = ActUtil.getActEndTime(112)
            let leftTime = ct - curTime;
            this.endTime.string = TimerUtils.format1(leftTime / 1000);

        }
    }

    _updateArenaHonorTime() {
        if (this.lock) {
            this.timeNode.active = false
            this.statuLab.string = `未开启`;
            return;
        }
        let proId = ArenaHonorUtils.getCurProgressId()
        //let lab = this.tiemNode.getChildByName('timeLab').getComponent(cc.Label);
        if (!proId) {
            this.timeNode.active = false
            this.statuLab.string = `已结束`;
            this.unscheduleAllCallbacks();
        }
        else {
            this.timeNode.active = true
            let cfg = ConfigManager.getItemById(Arenahonor_progressCfg, proId)
            this.statuLab.string = '进行中:' + cfg.subject_name;
            let curTime = GlobalUtil.getServerTime();
            let ct = ActUtil.getActEndTime(110)
            let leftTime = ct - curTime;
            this.endTime.string = TimerUtils.format1(leftTime / 1000);
        }
    }
}
