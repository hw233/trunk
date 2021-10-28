import AwardScrollCtrl from '../task/ctrl/AwardScrollCtrl';
import ChatEventCtrl from '../chat/ctrl/ChatEventCtrl';
import MailModel, { MailDesc } from './model/MailModel';
import ModelManager from '../../common/managers/ModelManager';
import NetManager from '../../common/managers/NetManager';
import { AwardInfo } from '../task/model/TaskModel';
import { MailEventIds } from '../mail/enum/MailEventIds';
/*
 * @Author: your name
 * @Date: 2020-04-28 19:12:23
 * @LastEditTime: 2020-06-01 18:42:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\scripts\view\mail2\MailInfoView.ts
 */

const { ccclass, property } = cc._decorator;
@ccclass
export default class MailInfoView extends gdk.BasePanel {


    @property(cc.Label)
    mailTitleLab: cc.Label = null

    @property(cc.RichText)
    descText: cc.RichText = null

    @property(cc.Node)
    getRewardBtn: cc.Node = null

    @property(cc.Label)
    getRewardLab: cc.Label = null

    @property(AwardScrollCtrl)
    awardCtrl: AwardScrollCtrl = null



    mailInfo: icmsg.MailInfo = null

    get model(): MailModel { return ModelManager.get(MailModel); }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        gdk.e.on(MailEventIds.RSP_READ_MAIL, (e: gdk.Event) => {
            this._onMailUpdate(e.data)
        }, this)
        gdk.e.on(MailEventIds.UPDATE_READ_MAIL, (e: gdk.Event) => {
            this.updateBtnState()
        }, this)
    }
    start() {

    }
    onDestroy() {
        gdk.e.targetOff(this)
    }

    /**
     * @description: 初始化邮件信息
     * @param {MailInfo} 
     */
    initMailInfo(info: icmsg.MailInfo) {
        this.mailInfo = info
        this.mailTitleLab.string = info.title
        this.updateBtnState()

        //附件列表
        let attachs: Array<icmsg.MailAttach> = info.attachs
        this.awardCtrl.initListView(5)
        let awardInfos: AwardInfo[] = []
        for (let index = 0; index < attachs.length; index++) {
            const item: icmsg.MailAttach = attachs[index];
            awardInfos.push({
                itemId: item.typeId,
                num: item.num
            })
        }
        this.awardCtrl.initAwardInfos(awardInfos)

        //没有附件，打开即认为已读
        if (awardInfos.length == 0 && !this.mailInfo.isRead) {
            this._readMail()
        }

        let mailDesc: MailDesc = this.model.mailContents[this.mailInfo.id]
        if (!mailDesc) {
            let msg = new icmsg.MailReadReq()
            msg.id = this.mailInfo.id
            NetManager.send(msg)
        } else {
            this._onMailUpdate(this.mailInfo.id)
        }
    }

    /**
     * @description:领取奖励
     */
    getReward() {
        if (this.mailInfo.isRead) {
            this.close();
            return;
        }
        if (this.mailInfo.attachs.length == 0) {
            this.close()
        }
        this.getRewardBtn.active = false;
        let msg = new icmsg.MailDrawReq();
        msg.ids = [this.mailInfo.id];
        this.close()
        NetManager.send(msg);
    }

    /**
     * @description: 更新领取按钮状态
     */
    updateBtnState() {
        if (!this.mailInfo) {
            return
        }
        this.getRewardBtn.active = true
        this.getRewardBtn.getComponent(cc.Button).interactable = !(this.mailInfo.isRead && this.mailInfo.attachs.length > 0)
        // this.deleteBtn.active = this.mailInfo.isRead
        if (this.mailInfo.attachs.length > 0) {
            if (this.mailInfo.isRead) {
                this.getRewardLab.string = gdk.i18n.t("i18n:MAIL_TIP1")
            } else {
                this.getRewardLab.string = gdk.i18n.t("i18n:MAIL_TIP2")
            }
        } else {
            this.getRewardLab.string = gdk.i18n.t("i18n:MAIL_TIP3")
        }
    }

    /**
 * @description:阅读邮件 
 */
    _readMail() {
        let msg = new icmsg.MailReadReq()
        msg.id = this.mailInfo.id
        NetManager.send(msg)
    }

    /**
     * @description:邮件更新  
     */
    _onMailUpdate(id: number) {
        let mail: icmsg.MailInfo = this.model.idMails[id]
        let mailDesc: MailDesc = this.model.mailContents[id]
        if (this.mailInfo && this.mailInfo.id == mail.id) {
            this.mailInfo = mail
            this.updateBtnState()
            let enterNum = mailDesc.content.length / 23
            let addNum = 0
            for (let i = 0; i < enterNum; i++) {
                if (addNum + i * 23 + 1 >= 0 && mailDesc.content.charCodeAt(addNum + i * 23 - 1) > 9000 && mailDesc.content.charCodeAt(addNum + i * 23 - 1) < 10000 &&
                    addNum + i * 23 + 1 < mailDesc.content.length - 1 && mailDesc.content.charCodeAt(addNum + i * 23 + 1) > 9000 && mailDesc.content.charCodeAt(addNum + i * 23 + 1) < 10000)
                    mailDesc.content = mailDesc.content.slice(0, i + i * 23) + "<br/>" + mailDesc.content.slice(i + i * 23)
            }
            this.descText.string = mailDesc.content
            if (!this.descText.getComponent(ChatEventCtrl)) {
                this.descText.addComponent(ChatEventCtrl)
            }
        }
    }
    // update (dt) {}
}
