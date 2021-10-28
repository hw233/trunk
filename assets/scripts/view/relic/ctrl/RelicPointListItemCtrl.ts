import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { Relic_pointCfg } from '../../../a/config';
import { RelicEventId } from '../enum/RelicEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-31 15:12:50 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicPointListItemCtrl")
export default class RelicPointListItemCtrl extends UiListItem {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    power: cc.Label = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Label)
    guildNameLab: cc.Label = null;

    @property(cc.Label)
    idleLab: cc.Label = null;

    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }

    cityId: number;
    info: icmsg.RelicPoint;
    cfg: Relic_pointCfg;
    onDisable() {
        this.unscheduleAllCallbacks();
    }

    updateView() {
        [this.cityId, this.info, this.cfg] = [this.data.cityId, this.data.info, this.data.cfg];
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/guild/texture/icon/${this.cfg.skin}`);
        this.nameLab.string = this.cfg.des;
        this.power.string = this.cfg.fight + '';
        if (this.info && this.info.ownerName) {
            this.idleLab.node.active = false;
            this.guildNameLab.node.active = true;
            this.timeLab.node.active = true;
            this.guildNameLab.string = `S${this.info.serverId}${gdk.i18n.t("i18n:RELIC_TIP1")} ${this.info.ownerName}`;
            let isEnemy = !this.roleModel.guildId || this.roleModel.guildName !== this.info.guildName;
            this.guildNameLab.node.color = cc.color().fromHEX(isEnemy ? '#FF0000' : '#00FF00');
            this._updateTime();
            this.schedule(this._updateTime, 1);
        }
        else {
            this.idleLab.node.active = true;
            this.guildNameLab.node.active = false;
            this.timeLab.node.active = false;
        }
    }

    onGoBtnClcik() {
        gdk.panel.hide(PanelId.RelicPointListView);
        gdk.e.emit(RelicEventId.MOVE_TO_TARGET_CITY, this.cityId);
    }

    _updateTime() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        let leftTime = Math.max(0, Math.floor((this.info.outputTime * 1000 - GlobalUtil.getServerTime()) * (this.info.exploreRate / 100)));
        if (leftTime == 0) {
            this.unschedule(this._updateTime);
        }
        else {
            this.timeLab.string = TimerUtils.format2(leftTime / 1000);
        }
    }
}
