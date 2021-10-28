import BountyModel from './BountyModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyUtil from '../../../common/utils/CopyUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { Bounty_costCfg, Copy_stageCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
/** 
 * @Description: 赏金求助
 * @Author: weiliang.huang  
 * @Date: 2019-05-07 09:34:24 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-19 11:13:13
*/

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bounty/BountyListItemCtrl")
export default class BountyListItemCtrl extends UiListItem {

    @property(cc.Node)
    moneyBg: cc.Node = null

    @property(cc.Label)
    moneyLab: cc.Label = null;

    @property(cc.Label)
    stageLab: cc.Label = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Node)
    btnFight: cc.Node = null;

    @property(cc.Label)
    stateLab: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    heroItem: cc.Prefab = null;

    @property(cc.Label)
    powerLab: cc.Label = null;

    @property(cc.Label)
    tipsLab: cc.Label = null;

    @property(cc.Node)
    replyNode: cc.Node = null;

    _heroList: ListView
    _info: icmsg.BountyMission

    get roleModel() { return ModelManager.get(RoleModel); }
    get bountyModel() { return ModelManager.get(BountyModel); }

    onDisable() {
        this.unschedule(this._updateTime)
    }

    updateView() {
        this._info = this.data
        this.moneyLab.string = `${this._info.gemsNum}`
        let costCfg = ConfigManager.getItemById(Bounty_costCfg, 3);
        if (this._info.gemsNum == costCfg.first_reward[1]) {
            GlobalUtil.setSpriteIcon(this.node, this.moneyBg, `view/bounty/texture/sjqz_shangjinshuijindi2`)
        } else {
            GlobalUtil.setSpriteIcon(this.node, this.moneyBg, `view/bounty/texture/sjqz_shangjinshuijindi`)
        }
        this.stageLab.string = CopyUtil.getStageConfig(this._info.stageId).name
        let stageCfg = ConfigManager.getItemById(Copy_stageCfg, this._info.stageId);
        let minPower = Math.min(this._info.minPower, Math.floor(stageCfg.power * 0.8));
        this.powerLab.string = this._info.pubPower + '';
        if (this._info.pubPower >= minPower) {
            this.tipsLab.string = `${StringUtils.format(gdk.i18n.t("i18n:BOUNTY_TIP3"), Math.max(1, Math.floor((this._info.pubPower - minPower) / minPower * 100)))}` //`(高于推荐${Math.max(1, Math.floor((this._info.pubPower - minPower) / minPower * 100))}%)`;
            this.tipsLab.node.color = cc.color().fromHEX('#00FF00');
        }
        else {
            this.tipsLab.string = `${StringUtils.format(gdk.i18n.t("i18n:BOUNTY_TIP4"), Math.max(1, Math.floor((this._info.pubPower - minPower) / minPower * 100)))}`//`(低于推荐${Math.max(1, Math.floor((minPower - this._info.pubPower) / minPower * 100))}%)`;
            this.tipsLab.node.color = cc.color().fromHEX('#FF0000');
        }
        this.nameLab.string = `<${this._info.publisher}>${gdk.i18n.t("i18n:BOUNTY_TIP5")}`
        this._updateHeroList()
        this.replyNode.active = false
        if (this._info.committer != "") {
            this.btnFight.active = false
            this.timeLab.node.parent.active = false
            this.stateLab.node.active = true
            this.stateLab.string = `${this._info.committer}\n${gdk.i18n.t("i18n:BOUNTY_TIP6")}`
            this.replyNode.active = true
        } else {
            let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
            let endTime = this._info.endTime
            let leftTime = endTime - curTime
            if (leftTime > 0) {
                this.btnFight.active = true
                this.timeLab.node.parent.active = true
                this.stateLab.string = ``
                this._updateTime()
                this.schedule(this._updateTime, 1)

                GlobalUtil.setAllNodeGray(this.btnFight, 0)
                let btnLab = this.btnFight.getChildByName("lab").getComponent(cc.Label)
                btnLab.string = `${gdk.i18n.t("i18n:BOUNTY_TIP7")}`
                let leftTime = costCfg.earn_limit - this.bountyModel.myBountyInfo.finishedFreeNum
                if (leftTime <= 0 && costCfg.first_reward[1] == this._info.gemsNum && this.bountyModel.myBountyInfo) {
                    btnLab.string = `${gdk.i18n.t("i18n:BOUNTY_TIP8")}`
                    GlobalUtil.setAllNodeGray(this.btnFight, 1)
                }
            } else {
                this.btnFight.active = false
                this.timeLab.node.parent.active = false
                this.stateLab.node.active = true
                this.stateLab.string = `${gdk.i18n.t("i18n:BOUNTY_TIP9")}`
            }
        }
    }

    _updateTime() {
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let endTime = this._info.endTime
        let leftTime = endTime - curTime
        if (leftTime <= 0) {
            this.unschedule(this._updateTime)
            this.btnFight.active = false
            this.timeLab.node.parent.active = false
            this.stateLab.node.active = true
            this.stateLab.string = `${gdk.i18n.t("i18n:BOUNTY_TIP9")}`
        } else {
            this.timeLab.string = `${TimerUtils.format2(leftTime)}`
        }
    }

    _initListView() {
        if (this._heroList) return;
        this._heroList = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.heroItem,
            cb_host: this,
            async: true,
            column: 5,
            gap_x: 10,
            gap_y: 10,
            direction: ListViewDir.Vertical,
        });
    }

    _updateHeroList() {
        this._initListView()
        this._heroList.set_data(this._info.heroList)
    }

    /**开始挑战 */
    startFightFunc() {
        let cfg_b = ConfigManager.getItemById(Bounty_costCfg, 3)
        if (cfg_b.first_reward[1] == this._info.gemsNum && this.bountyModel.myBountyInfo) {
            if (cfg_b.earn_limit - this.bountyModel.myBountyInfo.finishedFreeNum <= 0) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:BOUNTY_TIP10"))
                return
            }
        }

        if (this._info.publisher == this.roleModel.name) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:BOUNTY_TIP11"))
            return
        }

        JumpUtils.openBountyInstance(this._info, () => {
            gdk.panel.hide(PanelId.BountyList)
            gdk.panel.hide(PanelId.BountyPublishView)
        })
    }

    onReplayFunc() {
        let msg = new icmsg.BountyFightReplyReq()
        msg.missionId = this._info.missionId
        NetManager.send(msg, (data: icmsg.BountyFightReplyRsp) => {
            gdk.panel.setArgs(PanelId.BountyItemReplay, this._info, data)
            gdk.panel.open(PanelId.BountyItemReplay)
        })
    }
}