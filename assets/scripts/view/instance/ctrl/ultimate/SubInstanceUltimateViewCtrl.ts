import ActUtil from '../../../act/util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import ServerModel from '../../../../common/models/ServerModel';
import StoreViewCtrl, { StoreActScoreTabType, StoreBaseScoreTabType } from '../../../store/ctrl/StoreViewCtrl';
import StringUtils from '../../../../common/utils/StringUtils';
import TimerUtils from '../../../../common/utils/TimerUtils';
import { Copyultimate_showCfg, Copyultimate_stageCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../../boot/common/widgets/BUiListview';

/** 
 * @Description: 终极试炼 
 * @Author: luoyong
 * @Date: 2019-04-18 11:02:40
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-08-26 20:14:32
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/ultimate/SubInstanceUltimateViewCtrl")
export default class SubInstanceUltimateViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    rewardItem: cc.Prefab = null

    @property(cc.Label)
    fightleftLab: cc.Label = null

    @property(cc.Node)
    btnFight: cc.Node = null

    @property(cc.Node)
    btnPass: cc.Node = null

    @property(cc.Label)
    resetTime: cc.Label = null

    list: ListView

    get copyModel() { return ModelManager.get(CopyModel); }

    onEnable() {
        NetManager.on(icmsg.DungeonUltimateStateRsp.MsgType, this._updateViewInfo, this)
        this._updateViewInfo()
    }

    onDisable() {
        NetManager.targetOff(this)
        this._clearEndTime()
    }

    _updateViewInfo() {
        this.fightleftLab.node.parent.active = true
        this.fightleftLab.string = `${this.copyModel.ultimateLeftNum}`
        if (this.copyModel.ultimateMaxStageId == 0 || this.copyModel.ultimateMaxStageId < this.maxStageId) {
            this.btnFight.active = true
            this.btnPass.active = false
            if (this.copyModel.ultimateLeftNum == 0 && !this.copyModel.ultimatIsClear) {
                GlobalUtil.setAllNodeGray(this.btnFight, 1)
                cc.find("red", this.btnFight).active = false
            }
        } else {
            this.fightleftLab.node.parent.active = false
            this.btnFight.active = false
            this.btnPass.active = true
        }
        this._createEndTime()
        this._initListView()
        let showCfgs = ConfigManager.getItems(Copyultimate_showCfg)
        this.list.set_data(showCfgs)
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.rewardItem,
            cb_host: this,
            gap_x: 10,
            async: true,
            direction: ListViewDir.Horizontal,
        })
    }

    openStore() {
        JumpUtils.openPanel({
            panelId: PanelId.Store,
            currId: gdk.gui.getCurrentView(),
            callback: (node: cc.Node) => {
                let comp = node.getComponent(StoreViewCtrl)
                comp.menuBtnSelect(null, 1)
                comp.typeBtnSelect(null, StoreActScoreTabType.Ultimate)
            }
        })
    }

    onFightFunc() {
        if (this.copyModel.ultimateLeftNum == 0 && !this.copyModel.ultimatIsClear) {
            gdk.gui.showMessage("无法进行挑战")
            return
        }
        let cfgs = ConfigManager.getItemsByField(Copyultimate_stageCfg, "reward_id", this.curType)
        let stageId = this.copyModel.ultimateMaxStageId
        if (stageId == 0) {
            stageId = cfgs[0].id
        } else {
            stageId += 1
        }
        JumpUtils.openInstance(stageId);
    }

    onPassFunc() {
        gdk.gui.showMessage("已通关")
    }

    get curType() {
        let type = ActUtil.getActRewardType(130)
        let cfgs = ConfigManager.getItems(Copyultimate_stageCfg)
        let maxType = cfgs[cfgs.length - 1].reward_id
        if (type > maxType) {
            type = maxType
        }
        return type
    }

    get maxStageId() {
        let cfgs = ConfigManager.getItemsByField(Copyultimate_stageCfg, "reward_id", this.curType)
        return cfgs[cfgs.length - 1].id
    }

    _createEndTime() {
        this._updateEndTime()
        this._clearEndTime()
        this.schedule(this._updateEndTime, 1)
    }

    _updateEndTime() {
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let endTime = Math.floor(ActUtil.getActEndTime(130) / 1000)
        let leftTime = endTime - curTime
        if (leftTime > 0) {
            if (leftTime > 86400) {
                this.resetTime.string = TimerUtils.format9(leftTime)
            } else {
                this.resetTime.string = TimerUtils.format2(leftTime)
            }
        } else {
            this.resetTime.string = ""
        }
    }

    _clearEndTime() {
        this.unschedule(this._updateEndTime)
    }
}