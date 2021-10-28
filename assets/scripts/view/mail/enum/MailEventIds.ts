/*
 * @Author: your name
 * @Date: 2020-05-04 20:12:25
 * @LastEditTime: 2020-05-04 20:13:06
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\scripts\view\mail\enum\MailEventIds.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

export const MailEventIds = {
  RSP_READ_MAIL: "RSP_READ_MAIL", // 获取邮件内容
  RSP_GET_MAIL: "RSP_GET_MAIL", // 领取附件返回
  RSP_DELETE_MAIL: "RSP_DELETE_MAIL",  // 删除邮件返回
  DELETE_MAIL_LIST:"DELETE_MAIL_LIST", //删除所有已读文件
  UPDATE_READ_MAIL: "UPDATE_READ_MAIL", // 邮件读取状态更新
  UPDATE_MAIL_LIST: "UPDATE_MAIL_LIST", // 更新邮件列表
  UPDATE_ONE_MAIL: "UPDATE_ONE_MAIL", // 更新单个邮件
  RSP_ADD_MAIL: "RSP_ADD_MAIL", // 新增邮件
  RSP_GET_ALL_MAIL: "RSP_GET_ALL_MAIL", // 获取全部邮件
}