import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildModel from '../../model/GuildModel';
import GuildUtils from '../../utils/GuildUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import StringUtils from '../../../../common/utils/StringUtils';
import { Foothold_baseCfg } from '../../../../a/config';
import { RedPointEvent } from '../../../../common/utils/RedPointUtils';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-14 13:36:36 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHBaseEnergyGetViewCtrl")
export default class FHBaseEnergyGetViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    iconNode: cc.Node = null;

    @property(cc.RichText)
    tips1: cc.RichText = null;

    @property(cc.RichText)
    tips2: cc.RichText = null;

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get guildModel(): GuildModel { return ModelManager.get(GuildModel); }

    curLvCfg: Foothold_baseCfg;
    onEnable() {
        this._updateView();
    }

    onDisable() {
    }

    async _updateView() {
        this.curLvCfg = ConfigManager.getItemById(Foothold_baseCfg, this.footHoldModel.baseLevel);
        let sM = ModelManager.get(ServerModel);
        await sM.reqServerNameByIds([this.roleModel.guildId], 2);
        this.iconNode.getChildByName('serverName').getComponent(cc.Label).string = `S${GlobalUtil.getSeverIdByGuildId(this.roleModel.guildId)}服 ${sM.serverNameMap[Math.floor(this.roleModel.guildId / 10000)]}`;
        this.iconNode.getChildByName('baseName').getComponent(cc.Label).string = this.curLvCfg.name;
        GlobalUtil.setSpriteIcon(this.node, this.iconNode.getChildByName('icon'), GuildUtils.getIcon(this.guildModel.guildDetail.info.icon))
        GlobalUtil.setSpriteIcon(this.node, this.iconNode.getChildByName('frame'), GuildUtils.getIcon(this.guildModel.guildDetail.info.frame))
        GlobalUtil.setSpriteIcon(this.node, this.iconNode.getChildByName('bottom'), GuildUtils.getIcon(this.guildModel.guildDetail.info.bottom))
        let idx = 0;
        for (let i = 0; i < this.footHoldModel.fhGuilds.length; i++) {
            if (this.footHoldModel.fhGuilds[i].id == this.roleModel.guildId) {
                idx = i;
                break;
            }
        }
        GlobalUtil.setSpriteIcon(this.node, this.iconNode.getChildByName('iconBg'), `view/guild/texture/icon/${this.curLvCfg['skin' + `${idx == 0 ? '' : `${idx}`}`]}`);
        this.tips1.string = StringUtils.format(gdk.i18n.t('i18n:FOOTHOLD_TIP127'), this.curLvCfg.level, this.curLvCfg.privilege2);
        this.tips2.string = StringUtils.format(gdk.i18n.t('i18n:FOOTHOLD_TIP128'), this.curLvCfg.privilege2 - this.footHoldModel.freeEnergy);
    }

    onGetBtnClick() {
        if (this.footHoldModel.energy + this.curLvCfg.privilege2 >= FootHoldUtils.getInitEnergyValue()) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:MILITARY_TIP3"))
            return
        }
        let msg = new icmsg.FootholdFreeEnergyReq()
        msg.isAll = true;
        msg.warId = this.footHoldModel.curMapData.warId;
        NetManager.send(msg, (data: icmsg.FootholdFreeEnergyRsp) => {
            this.close();
            gdk.gui.showMessage(gdk.i18n.t("i18n:MILITARY_TIP4"))
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
        }, this)
    }
}
