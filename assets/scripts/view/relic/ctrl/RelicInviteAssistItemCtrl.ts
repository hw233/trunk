import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RelicModel from '../model/RelicModel';
import StringUtils from '../../../common/utils/StringUtils';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { GuildMemberLocal } from '../../guild/model/GuildModel';
import { Relic_pointCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-31 15:55:05 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicInviteAssistItemCtrl")
export default class RelicInviteAssistItemCtrl extends UiListItem {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    headFrame: cc.Node = null;

    @property(cc.Label)
    lv: cc.Label = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    power: cc.Label = null;

    @property(cc.Label)
    idleLab: cc.Label = null;

    @property(cc.Label)
    pointName: cc.Label = null;

    @property(cc.Label)
    ownerName: cc.Label = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Node)
    inviteBtn: cc.Node = null;

    brief: GuildMemberLocal;
    relicInfo: icmsg.RelicGuildDefender;
    isFull: boolean;
    onDisable() {
        this.unscheduleAllCallbacks();
        NetManager.targetOff(this);
    }

    updateView() {
        [this.brief, this.relicInfo, this.isFull] = [this.data.brief, this.data.relicInfo, this.data.isFull];
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getHeadIconById(this.brief.head));
        GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(this.brief.frame));
        this.lv.string = '.' + this.brief.level;
        this.power.string = this.brief.power + '';
        this.nameLab.string = this.brief.name;
        if (this.relicInfo) {
            this.inviteBtn.active = false;
            this.idleLab.node.active = false;
            this.pointName.node.active = true;
            this.ownerName.node.active = true;
            this.timeLab.node.active = true;
            this.pointName.string = ConfigManager.getItemById(Relic_pointCfg, this.relicInfo.pointType).des;
            this.ownerName.string = this.relicInfo.ownerName;
            this._updateTime();
            this.schedule(this._updateTime, 1);
        }
        else {
            this.inviteBtn.active = true;
            this.idleLab.node.active = true;
            this.pointName.node.active = false;
            this.ownerName.node.active = false;
            this.timeLab.node.active = false;
        }
    }

    onInviteBtnClick() {
        if (this.isFull) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:RELIC_TIP2"));
            return;
        }
        else {
            GlobalUtil.openAskPanel({
                descText: `${StringUtils.format(gdk.i18n.t("i18n:RELIC_TIP3"), this.brief.name)}`,
                sureCb: () => {
                    let req = new icmsg.RelicHelpDefendReq();
                    req.mapType = parseInt(ModelManager.get(RelicModel).curExploreCity.split('-')[0])
                    req.defenderId = this.brief.id;
                    NetManager.send(req, null, this);
                }
            })
        }
    }

    _updateTime() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let leftTime = Math.max(0, this.relicInfo.endTime * 1000 - GlobalUtil.getServerTime());
        if (leftTime <= 0) {
            this.unschedule(this._updateTime);
        }
        else {
            this.timeLab.string = TimerUtils.format2(leftTime / 1000);
        }
    }
}
