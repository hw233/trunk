import * as vm from '../../../a/vm';
/*
 * @Author: your name
 * @Date: 2020-04-27 19:02:44
 * @LastEditTime: 2020-05-04 13:18:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\scripts\view\mail\model\MailModel.ts
 */


export type MailDesc = {
    id: number;
    content: string;
}
export default class MailModel {

    /**邮件数组列表 */
    @vm.mutable
    mailInfos: Array<icmsg.MailInfo> = []

    /**邮件id表 */
    idMails: any = {}

    /**邮件内容表 */
    mailContents: Object = {}

    /**未读邮件数量 */

    @vm.mutable
    unreadNum: number = 0;

    @vm.mutable
    rewardNum: number = 0;

    @vm.mutable
    readNum: number = 0;

    //MailNoticeRsp
    extraRedpoint: boolean = false;
}