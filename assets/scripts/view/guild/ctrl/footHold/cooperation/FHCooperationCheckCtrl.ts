import GuildUtils from '../../../utils/GuildUtils';
import ModelManager from '../../../../../common/managers/ModelManager';
import NetManager from '../../../../../common/managers/NetManager';
import PanelId from '../../../../../configs/ids/PanelId';
import RoleModel from '../../../../../common/models/RoleModel';
import { GuildAccess } from '../../../model/GuildModel';
/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-18 16:57:45
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/cooperation/FHCooperationCheckCtrl")
export default class FHCooperationCheckCtrl extends gdk.BasePanel {

    @property(cc.EditBox)
    levelInputBox: cc.EditBox = null;

    @property(cc.EditBox)
    powerInputBox: cc.EditBox = null;

    @property(cc.ToggleContainer)
    checkBtns: cc.ToggleContainer = null;

    curLv = 0
    curPower = 0

    miniLv = 10
    maxLv = 160

    minPower = 10000
    maxPower = 20000000
    perPower = 50000

    curTitle = 0

    onEnable() {
        let msg = new icmsg.FootholdCoopApplySettingReq()
        msg.title = -1
        NetManager.send(msg, (data: icmsg.FootholdCoopApplySettingRsp) => {
            let showLv = data.level ? data.level : this.miniLv
            this.levelInputBox.string = `${showLv}`
            this.curLv = showLv

            let showPower = data.power ? data.power : this.minPower
            this.powerInputBox.string = `${showPower}`
            this.curPower = showPower

            this.curTitle = data.title

            this.checkBtns.toggleItems[0].isChecked = data.title == 0
            this.checkBtns.toggleItems[1].isChecked = data.title == 8
            this.checkBtns.toggleItems[2].isChecked = data.title == 7
            this.checkBtns.toggleItems[3].isChecked = data.title == 4


        })
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
        this.levelInputBox.string = lv.toString();
    }

    //减等级
    onLvMinusBtn() {
        this.curLv = this.curLv - 5
        this.updateLv();
    }

    //加等级
    onLvPlusBtn() {
        this.curLv = this.curLv + 5
        this.updateLv();
    }

    onLvEditorDidEnded() {
        this.curLv = parseInt(this.levelInputBox.string) || this.miniLv;
        this.updateLv();
    }


    updatePower() {
        let power = this.curPower;
        if (power <= this.minPower) {
            power = this.minPower;
            this.curPower = power;
        } else if (power >= this.maxPower) {
            power = this.maxPower;
            this.curPower = power;
        }
        this.powerInputBox.string = power.toString();
    }

    //减战力
    onPowerMinusBtn() {
        this.curPower = this.curPower - this.perPower
        this.updatePower();
    }

    //加战力
    onPowerPlusBtn() {
        this.curPower = this.curPower + this.perPower
        this.updatePower();
    }

    onPowerEditorDidEnded() {
        this.curPower = parseInt(this.powerInputBox.string) || this.minPower;
        this.updatePower();
    }

    onSelectTitle(e, title) {
        this.curTitle = parseInt(title)
    }

    setFunc() {
        let msg = new icmsg.FootholdCoopApplySettingReq()
        msg.title = this.curTitle
        msg.power = this.curPower
        msg.level = this.curLv
        NetManager.send(msg, () => {
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP130"))
            gdk.panel.hide(PanelId.FHCooperationCheck)
        })
    }

}