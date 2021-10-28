import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import GlobalUtil from '../../utils/GlobalUtil';
import MailModel, { MailDesc } from '../../../view/mail/model/MailModel';
import ModelManager from '../ModelManager';
import RoleModel from '../../models/RoleModel';
import { MailEventIds } from '../../../view/mail/enum/MailEventIds';

/**
 * 服务器数据管理，例如：服务器列表，服务器时间等
 * @Author: sthoo.huang
 * @Date: 2019-04-08 16:35:36
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-09-15 15:39:29
 */

export default class MailController extends BaseController {
    gdkEvents: GdkEventArray[] = [];
    netEvents: NetEventArray[] = [
        [icmsg.MailListRsp.MsgType, this._onMailListRsp],
        [icmsg.MailDrawRsp.MsgType, this._onMailDrawRsp],
        [icmsg.MailDeleteRsp.MsgType, this._onMailDeleteRsp],
        [icmsg.MailReadRsp.MsgType, this._onMailReadRsp],
        [icmsg.MailUpdateRsp.MsgType, this._onMailUpdateRsp],
        [icmsg.MailNoticeRsp.MsgType, this._onMailNoticeRsp],
    ];

    model: MailModel;
    fsm: gdk.fsm.Fsm;

    onStart(): void {
        this.model = ModelManager.get(MailModel);
    }

    onEnd(): void {
    }

    _onMailListRsp(data: icmsg.MailListRsp) {
        this.model.idMails = {}
        let list = data.list
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            element.startTime *= 1000
            element.endTime *= 1000
            this.model.idMails[element.id] = element
        }
        this.model.mailInfos = list
        this._sortMails()
    }

    _onMailReadRsp(data: icmsg.MailReadRsp) {
        let idMails = this.model.idMails
        let item: icmsg.MailInfo = idMails[data.id]
        if (data.isRead && item && !item.isRead) {
            item.isRead = data.isRead
            gdk.e.emit(MailEventIds.UPDATE_READ_MAIL, data.id);
        }
        let info: MailDesc = {
            id: data.id,
            content: data.content
        }
        this.model.mailContents[data.id] = info
        gdk.e.emit(MailEventIds.RSP_READ_MAIL, data.id)
        this._sortMails();
        gdk.e.emit(MailEventIds.UPDATE_MAIL_LIST, true)
    }

    _onMailDrawRsp(data: icmsg.MailDrawRsp) {
        let idMails = this.model.idMails
        for (let index = 0; index < data.ids.length; index++) {
            const id: number = data.ids[index];
            let item: icmsg.MailInfo = idMails[id]
            if (item && !item.isRead) {
                item.isRead = true
                gdk.e.emit(MailEventIds.UPDATE_READ_MAIL, id)
            }
            // gdk.e.emit(MailEventIds.RSP_READ_MAIL, id)
            // gdk.e.emit(MailEventIds.UPDATE_ONE_MAIL, id)
        }

        gdk.e.emit(MailEventIds.RSP_GET_ALL_MAIL);
        if (data.list.length > 0) {
            GlobalUtil.openRewadrView(data.list);
        }
        this._sortMails()
        gdk.e.emit(MailEventIds.UPDATE_MAIL_LIST, true)

    }

    /**删除邮件回调 */
    _onMailDeleteRsp(data: icmsg.MailDeleteRsp) {
        let mailInfos = this.model.mailInfos
        let idMails = this.model.idMails
        let mailContents = this.model.mailContents
        for (let index = 0; index < data.ids.length; index++) {
            const id: number = data.ids[index];
            let item: icmsg.MailInfo = idMails[id]
            let mailContent: MailDesc = mailContents[id]
            if (item) {
                delete idMails[id]
                for (let i = 0; i < mailInfos.length; i++) {
                    const mail = mailInfos[i];
                    if (mail.id == id) {
                        mailInfos.splice(i, 1)
                        break
                    }
                }
            }
            if (mailContent) {
                delete mailContents[id]
            }
            gdk.e.emit(MailEventIds.RSP_DELETE_MAIL, id)
        }
        gdk.e.emit(MailEventIds.UPDATE_MAIL_LIST, true)
    }

    /**更新邮件 */
    _onMailUpdateRsp(data: icmsg.MailUpdateRsp) {
        let mailInfos = this.model.mailInfos
        let idMails = this.model.idMails
        for (let index = 0; index < data.list.length; index++) {
            let mail: icmsg.MailInfo = data.list[index];
            let item: icmsg.MailInfo = idMails[mail.id]
            if (item) {
                idMails[mail.id] = mail
                for (let idx = 0; idx < mailInfos.length; idx++) {
                    const element = mailInfos[idx];
                    if (element.id == mail.id) {
                        mailInfos[idx] = mail
                        break
                    }
                }
                gdk.e.emit(MailEventIds.UPDATE_ONE_MAIL, mail.id)
            } else {
                mail.startTime *= 1000
                mail.endTime *= 1000
                mailInfos.splice(0, 0, mail)
                idMails[mail.id] = mail
                gdk.e.emit(MailEventIds.RSP_ADD_MAIL, mail)
            }
        }
    }
    /**排序邮件列表 */
    _sortMails() {
        let sort = function (a: icmsg.MailInfo, b: icmsg.MailInfo) {
            if (a.isRead != b.isRead)
                return Number(a.isRead) - Number(b.isRead)
            if (a.startTime != b.startTime)
                return b.startTime - a.startTime
            if (a.attachs.length != b.attachs.length)
                return b.attachs.length - a.attachs.length
        }
        GlobalUtil.sortArray(this.model.mailInfos, sort);
    }

    _onMailNoticeRsp(resp: icmsg.MailNoticeRsp) {
        let rM = ModelManager.get(RoleModel);
        if (resp.receivers && [rM.id, rM.name].indexOf(resp.receivers) !== -1) {
            this.model.extraRedpoint = true;
            gdk.e.emit(MailEventIds.UPDATE_ONE_MAIL);
            return;
        }

        if (resp.levels && resp.levels.indexOf(',') !== -1) {
            let [min, max] = resp.levels.split(',');
            if (rM.level >= parseInt(min) && rM.level <= parseInt(max)) {
                this.model.extraRedpoint = true;
                gdk.e.emit(MailEventIds.UPDATE_ONE_MAIL);
                return;
            }
        }
    }
}