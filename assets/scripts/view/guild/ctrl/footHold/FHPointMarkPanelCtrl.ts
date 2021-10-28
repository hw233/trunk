import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from './FootHoldModel';
import FootHoldUtils from './FootHoldUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import SdkTool from '../../../../sdk/SdkTool';
import StringUtils from '../../../../common/utils/StringUtils';
import { Foothold_globalCfg } from '../../../../a/config';
import { FootHoldEventId } from '../../enum/FootHoldEventId';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-04 20:41:57
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHPointMarkPanelCtrl")
export default class FHPointMarkPanelCtrl extends gdk.BasePanel {

    @property(cc.EditBox)
    inputBox: cc.EditBox = null;

    // @property(cc.Node)
    // btnNotice: cc.Node = null

    @property(cc.Node)
    btnMarkOk: cc.Node = null

    @property(cc.Node)
    btnMarkCancel: cc.Node = null

    notice: string = ""

    get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    onEnable() {
        if (FootHoldUtils.isPlayerCanMark) {
            this.btnMarkOk.active = true
            this.btnMarkCancel.active = true
            // this.btnNotice.active = true
        } else {
            this.btnMarkOk.active = false
            this.btnMarkCancel.active = false
            // this.btnNotice.active = false
        }
        let pos = `${this.footHoldModel.pointDetailInfo.pos.x}-${this.footHoldModel.pointDetailInfo.pos.y}`
        this.notice = this.footHoldModel.markFlagPoints[pos] ? this.footHoldModel.markFlagPoints[pos].msg : gdk.i18n.t("i18n:FOOTHOLD_TIP81")
        this.inputBox.placeholder = this.notice

        let tag_words = ConfigManager.getItemById(Foothold_globalCfg, "tag_words")
        this.inputBox.maxLength = tag_words ? tag_words.value[0] : 20
    }

    /**公会公告设置 */
    onNoticeChange() {
        this.inputBox.string = this.notice
        // this.btnNotice.active = false
        this.inputBox.focus()
    }


    /**标记设置 */
    saveNoticeFunc() {
        if (this.inputBox.string != "" && this.inputBox.string != this.notice) {
            // this.btnNotice.active = true
            SdkTool.tool.hasMaskWord(this.inputBox.string, ret => {
                if (ret) {
                    this.inputBox.string = this.notice
                    gdk.GUIManager.showMessage(gdk.i18n.t("i18n:GUILD_TIP6"));
                    return;
                }
                this.notice = this.inputBox.string
            });
        } else {
            // this.btnNotice.active = true
            this.inputBox.string = this.notice
        }
    }

    onMarkOk() {
        if (this.notice == gdk.i18n.t("i18n:FOOTHOLD_TIP81")) {
            gdk.panel.hide(PanelId.FHPointMarkPanel)
            return
        }

        let pos = new icmsg.FootholdPos()
        pos.x = this.footHoldModel.pointDetailInfo.pos.x
        pos.y = this.footHoldModel.pointDetailInfo.pos.y

        let msg = new icmsg.FootholdAtkFlagSetReq()
        msg.pos = pos
        msg.msg = this.notice
        NetManager.send(msg, () => {
            let info = new icmsg.FootholdAtkFlag()
            info.pos = pos
            info.msg = this.notice
            this.footHoldModel.markFlagPoints[`${pos.x}-${pos.y}`] = info
            gdk.panel.hide(PanelId.FHPointMarkPanel)
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP82"))
            gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)
        }, this)
    }

    onMarkCancel() {
        let msg = new icmsg.FootholdAtkFlagDelReq()
        let pos = new icmsg.FootholdPos()
        pos.x = this.footHoldModel.pointDetailInfo.pos.x
        pos.y = this.footHoldModel.pointDetailInfo.pos.y
        msg.pos = pos
        if (!this.footHoldModel.markFlagPoints[`${pos.x}-${pos.y}`]) {
            gdk.panel.hide(PanelId.FHPointMarkPanel)
            return
        }
        NetManager.send(msg, () => {
            delete this.footHoldModel.markFlagPoints[`${pos.x}-${pos.y}`]
            gdk.panel.hide(PanelId.FHPointMarkPanel)
            gdk.gui.showMessage(gdk.i18n.t("i18n:FOOTHOLD_TIP83"))
            gdk.e.emit(FootHoldEventId.UPDATE_FOOTHOLD_POINT_BROADCAST)
        }, this)
    }

}