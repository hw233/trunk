import ConfigManager from '../../../common/managers/ConfigManager';
import GuildModel, { GuildAccess } from '../model/GuildModel';
import GuildUtils from '../utils/GuildUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import { Guild_accessCfg } from '../../../a/config';
import { RedPointEvent } from '../../../common/utils/RedPointUtils';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-18 17:08:03
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildSetCheck")
export default class GuildSetCheck extends gdk.BasePanel {

    @property(cc.EditBox)
    InputBox: cc.EditBox = null;

    @property(cc.ToggleContainer)
    checkBtns: cc.ToggleContainer = null;

    @property(cc.Label)
    btnLab: cc.Label = null;

    miniLv = 10
    maxLv = 60
    curLv = 0

    get model() { return ModelManager.get(GuildModel); }

    onLoad() {

    }

    start() {

    }

    onEnable() {
        this.miniLv = GuildUtils.getJoinMinLv()
        let showLv = this.model.guildDetail.minLevel ? this.model.guildDetail.minLevel : this.miniLv
        this.InputBox.string = `${showLv}`
        this.curLv = showLv
        this.checkBtns.toggleItems[0].isChecked = this.model.guildDetail.autoJoin
        this.checkBtns.toggleItems[1].isChecked = !this.model.guildDetail.autoJoin

        let accessCfg = ConfigManager.getItemById(Guild_accessCfg, GuildAccess.Approve)
        if (accessCfg.position == 8) {
            this.btnLab.string = `会长审批`
        } else {
            this.btnLab.string = `(会长.副会长)审批`
        }
    }

    onDisable() {
        // gdk.e.targetOff(this)
    }

    onDestroy() {

    }


    updateLv() {
        let lv = this.curLv;
        if (lv <= this.miniLv) {
            lv = this.miniLv;
            this.curLv = lv;
        } else if (lv >= this.maxLv) {
            lv = this.maxLv;
            this.curLv = lv;
        }
        this.InputBox.string = lv.toString();
    }

    //减等级
    onMinusBtn() {
        this.curLv = this.curLv - 5
        this.updateLv();
    }

    //加等级
    onPlusBtn() {
        this.curLv = this.curLv + 5
        this.updateLv();
    }

    onEditorDidEnded() {
        this.curLv = parseInt(this.InputBox.string) || 15;
        this.updateLv();
    }

    setFunc() {
        let msg = new icmsg.GuildSetCheckReq()
        msg.minLevel = this.curLv
        msg.autoJoin = this.checkBtns.toggleItems[0].isChecked
        NetManager.send(msg, (data: icmsg.GuildSetCheckRsp) => {
            this.model.guildDetail.minLevel = data.minLevel
            this.model.guildDetail.autoJoin = data.autoJoin
            this.model.applyList = []
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
            this.close()
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP8"))
        })
    }

}