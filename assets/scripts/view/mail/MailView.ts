import * as vm from '../../a/vm';
import GlobalUtil from '../../common/utils/GlobalUtil';
import MailInfoView from './MailInfoView';
import MailModel from '../mail/model/MailModel';
import ModelManager from '../../common/managers/ModelManager';
import NetManager from '../../common/managers/NetManager';
import { ListView, ListViewDir } from '../../common/widgets/UiListview';
import { MailEventIds } from '../mail/enum/MailEventIds';
/*
 * @Author: yanshan.gao
 * @Date: 2020-04-28 13:17:24
 * @LastEditTime: 2020-05-26 10:29:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\scripts\view\mail2\MailView.ts
 */

const { ccclass, property } = cc._decorator;


@ccclass
export default class MailView extends gdk.BasePanel {

    model: MailModel


    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    noMailTips: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;


    @vm.bind(cc.Label, "unreadNum")
    unreadLabel: cc.Label = null;

    @property(cc.Node)
    mailList: cc.Node = null;


    @property(cc.Prefab)
    mailItem: cc.Prefab = null;

    @property(cc.Button)
    deleteBtn: cc.Button = null;

    @property(cc.Label)
    deleteLab: cc.Label = null;

    @property(cc.Button)
    rewardBtn: cc.Button = null;

    private list: ListView = null;

    curList: Array<icmsg.MailInfo> = [];

    curIndex: number = -1;   // 当前显示邮件下标
    panelIndex: number = -1; // 面板类型 0:系统邮件 1:建议反馈

    addFlag: boolean = false;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.model = ModelManager.get(MailModel)
        gdk.e.on(MailEventIds.UPDATE_MAIL_LIST, this._updateMailInfos, this);
        gdk.e.on(MailEventIds.DELETE_MAIL_LIST, this._deleteMailList, this)
        gdk.e.on(MailEventIds.UPDATE_READ_MAIL, this._onReadState, this);
        gdk.e.on(MailEventIds.UPDATE_ONE_MAIL, this._onInfoChange, this);
        gdk.e.on(MailEventIds.RSP_ADD_MAIL, this._onMailAdd, this);
    }

    onEnable() {
        this.model.extraRedpoint = false;
        gdk.e.emit(MailEventIds.UPDATE_ONE_MAIL);
    }

    start() {
        this.curIndex = 0;
        this.selectPanel(null, 0)
    }

    onDisable() {

    }


    onDestroy() {
        this.list.destroy()
        gdk.e.targetOff(this)
    }

    /**
     * @description: 初始化列表
     */

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.mailItem,
            cb_host: this,
            gap_y: 10,
            async: true,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._selectItem, this)
    }
    /**
     * @description:更新列表 
     * @param {type} 
     * @return: 
     */
    @gdk.binding("model.mailInfos")
    _updateMailScroll(resetPos: boolean = true) {
        this._initListView()
        let tempList = []
        let mailInfos = this.model.mailInfos
        let len = mailInfos.length
        let unreadNum = 0
        let rewardNum = 0
        let readNum = 0

        for (let index = 0; index < len; index++) {
            const element = mailInfos[index];
            if (element) tempList.push(element);
            if (!element.isRead) unreadNum++; else readNum++;
            if (element.attachs.length > 0 && !element.isRead) rewardNum++;
        }

        this.model.unreadNum = unreadNum;
        this.model.readNum = readNum;
        this.curList = tempList;
        this.model.rewardNum = rewardNum;
        this.list.set_data(tempList, resetPos);

        //无邮件提示
        this.noMailTips.active = len <= 0;
    }

    /**
 * @description:选择列表项 
 * @param {type} 
 * @return: 
 */
    _selectItem(data: icmsg.MailInfo) {
        if (this.addFlag) {
            this.addFlag = false;
            return;
        }
        gdk.panel.open("MailInfo", (node: cc.Node) => {
            let script = node.getComponent(MailInfoView)
            script.initMailInfo(data)
        })
    }

    selectPanel(e, utype) {
        utype = parseInt(utype)
        this.panelIndex = utype
        this.mailList.active = utype == 0;
    }

    /**
     * @description:更新列表 
     * @param  
     * @return: 
     */
    _updateMailInfos(e: gdk.Event) {
        let refresh = e.data
        let mailInfos = this.model.mailInfos
        let unreadNum = 0
        let readNum = 0
        let len = mailInfos.length
        for (let index = 0; index < len; index++) {
            const element = mailInfos[index];
            if (!element.isRead) {
                unreadNum++;
            } else {
                readNum++;
            }
        }
        this.model.unreadNum = unreadNum;
        this.model.readNum = readNum;
        if (refresh) {
            this._updateMailScroll(false)
        }
        this.noMailTips.active = len <= 0;
    }


    _onReadState(e: gdk.Event) {
        let mailInfos = this.model.mailInfos
        this.model.unreadNum = this.model.unreadNum - 1
        this.model.unreadNum = Math.max(this.model.unreadNum, 0)
        this.model.rewardNum--
        this.model.readNum++
        this._onInfoChange(e)
        this.noMailTips.active = mailInfos.length <= 0;
    }


    /**
     * @description: 单个邮件信息更新
     * @param {type} 
     * @return: 
     */
    _onInfoChange(e: gdk.Event) {
        if (!e || !e.data) return;
        this.model.unreadNum = Math.max(this.model.unreadNum, 0)
        let id = e.data
        let mailInfos = this.curList
        for (let index = 0; index < mailInfos.length; index++) {
            const mail: icmsg.MailInfo = mailInfos[index];
            if (mail.id == id) {
                this.list.refresh_item(index, mail)
                break
            }
        }
    }


    /**
     * @description:新增邮件 
     * @param {type} 
     * @return: 
     */
    _onMailAdd(e: gdk.Event) {
        this.addFlag = true;
        let mail: icmsg.MailInfo = e.data
        this.list.insert_data(0, mail)
        this.model.unreadNum++
        let mailInfos = this.model.mailInfos
        this.model.rewardNum++;
        this.noMailTips.active = mailInfos.length <= 0;
    }

    /**
     * @description:一键删除 
     * @param {type} 
     * @return: 
     */
    deleteMailFunc() {
        if (this.model.unreadNum == this.model.mailInfos.length) {
            return
        }
        GlobalUtil.openAskPanel({
            descText: gdk.i18n.t("i18n:MAIL_TIP11"),
            sureCb: () => {
                gdk.e.emit(MailEventIds.DELETE_MAIL_LIST)
            },
        })
    }

    /**
     * @description: 一键删除所有已读邮件 
     */
    _deleteMailList() {
        let msg = new icmsg.MailDeleteReq()
        let ids = []
        let mailInfos = this.model.mailInfos
        for (let mail of mailInfos) {
            if (mail.isRead) {
                ids.push(mail.id)
            }
        }
        if (ids.length == 0) return
        msg.ids = ids
        NetManager.send(msg)
    }
    getAllMailReward() {
        let msg = new icmsg.MailDrawReq()
        let ids = []
        let mailInfos = this.model.mailInfos;
        this.rewardBtn.enabled = false;
        for (let mail of mailInfos) {
            if (!mail.isRead && mail.attachs.length > 0) {
                ids.push(mail.id)
            }
        }
        if (ids.length == 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:NO_MAIL_AWARD"))
            return
        }

        msg.ids = ids
        NetManager.send(msg)
    }

    @vm.observe("readNum")
    onReadNum() {
        //改变一键删除的状态
        if (this.model.readNum == 0) {
            this.deleteBtn.enabled = false
            GlobalUtil.setAllNodeGray(this.deleteBtn.node, 1)
        } else {
            this.deleteBtn.enabled = true
            GlobalUtil.setAllNodeGray(this.deleteBtn.node, 0)
        }

    }

    @vm.observe("rewardNum")
    onRewardNum() {
        if (this.model.rewardNum == 0) {
            this.rewardBtn.enabled = false
            GlobalUtil.setAllNodeGray(this.rewardBtn.node, 1)
        } else {
            this.rewardBtn.enabled = true
            GlobalUtil.setAllNodeGray(this.rewardBtn.node, 0)
        }
    }
}
