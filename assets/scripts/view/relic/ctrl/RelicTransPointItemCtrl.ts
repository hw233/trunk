import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RelicModel from '../model/RelicModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import { Relic_pointCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-02-20 17:33:56 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicTransPointItemCtrl")
export default class RelicTransPointItemCtrl extends UiListItem {
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
    stateLab: cc.Label = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Node)
    transBtn: cc.Node = null;

    resp: icmsg.RelicGuildExplorer;
    onDisable() {
        this.unscheduleAllCallbacks();
    }

    updateView() {
        this.resp = this.data;
        let brief = this.resp.playerBrief;
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getHeadIconById(brief.head));
        GlobalUtil.setSpriteIcon(this.node, this.headFrame, GlobalUtil.getHeadFrameById(brief.headFrame));
        this.lv.string = '.' + brief.level;
        this.power.string = brief.power + '';
        this.nameLab.string = brief.name;
        this.stateLab.string = this.resp.maxTimes == 0 ? gdk.i18n.t('i18n:RELIC_TIP34') : `${this.resp.remainTimes}/${this.resp.maxTimes}`;
        if (this.resp.endTime > 0) {
            this.timeLab.node.active = true;
            this.transBtn.active = false;
            this._updateTime();
            this.schedule(this._updateTime, 1);
        }
        else {
            let m = ModelManager.get(RelicModel);
            let pointId = m.curExploreCity.split('-')[1];
            let pointCfg = ConfigManager.getItemById(Relic_pointCfg, m.cityMap[parseInt(pointId)].pointType);
            this.timeLab.node.active = false;
            this.transBtn.active = true;
            this.transBtn.getComponent(cc.Button).interactable = this.resp.remainTimes >= pointCfg.consumption;
        }
    }

    onTransBtnClick() {
        let req = new icmsg.RelicTransferReq();
        req.targetId = this.resp.playerBrief.id;
        NetManager.send(req, (resp: icmsg.RelicTransferRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            gdk.gui.showMessage(gdk.i18n.t('i18n:RELIC_TIP35'));
        }, this);
    }

    _updateTime() {
        if (!this.timeLab.node.active) {
            this.unscheduleAllCallbacks();
            return;
        }
        let time = Math.max(0, this.resp.endTime * 1000 - GlobalUtil.getServerTime());
        this.timeLab.string = TimerUtils.format2(time / 1000);
    }
}
