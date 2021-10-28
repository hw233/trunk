import ChatModel from '../../../chat/model/ChatModel';
import ChatUtils from '../../../chat/utils/ChatUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import GuildModel from '../../model/GuildModel';
import MaskWordUtils from '../../../../common/utils/MaskWordUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import PanelId from '../../../../configs/ids/PanelId';
import RoleModel from '../../../../common/models/RoleModel';
import ServerModel from '../../../../common/models/ServerModel';
import StringUtils from '../../../../common/utils/StringUtils';
import UiScrollView from '../../../../common/widgets/UiScrollView';
import { ChatChannel } from '../../../chat/enum/ChatChannel';
import { ChatEvent } from '../../../chat/enum/ChatEvent';
import { GlobalCfg } from '../../../../a/config';

/** 
 * 聊天界面控制器
 * @Author: weiliang.huang  
 * @Description: 
 * @Date: 2019-03-21 15:12:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-04 19:57:58
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHChatViewCtrl")
export default class FHChatViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    actPanel: cc.Node = null

    @property(cc.Node)
    InputPanel: cc.Node = null

    @property(cc.EditBox)
    InputBox: cc.EditBox = null;

    @property(cc.ScrollView)
    ChatScroll: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Node)
    nothingTips: cc.Node = null;

    @property(cc.Node)
    FaceBtn: cc.Node = null

    @property(cc.Node)
    bottomTip: cc.Node = null

    @property(cc.Label)
    textLabel: cc.Label = null

    @property(cc.Toggle)
    lockTog: cc.Toggle = null

    @property(cc.Button)
    sendBtn: cc.Button = null

    @property(cc.Label)
    channelLabel: cc.Label = null;

    curList: Array<icmsg.ChatSendRsp> = []
    curChannel: number = ChatChannel.ALLIANCE
    scrollViewCom: UiScrollView = null
    /**是否处于控件最底层 */
    isBottomed: boolean = true
    showTime: number = 0.1
    hideTime: number = 0.1
    startY: number = 0

    get model(): ChatModel { return ModelManager.get(ChatModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel) }
    get serverModel(): ServerModel { return ModelManager.get(ServerModel); }
    get guildModel(): GuildModel { return ModelManager.get(GuildModel); }

    onLoad() {
        this.startY = this.actPanel.y
        this.bottomTip.active = false

        this.lockTog.isChecked = true;

        this.scrollViewCom = this.ChatScroll.node.getComponent(UiScrollView);
        this.ChatScroll.node.on('scrolling', this.scorllEvents, this);
        this.scrollViewCom.init();
        // this.switchFunc(null, 1);
        gdk.e.on(ChatEvent.INPUT_TEXT_INFO, this._addText, this);
        gdk.e.on(ChatEvent.ADD_ALLIANCE_CHAT_INFO, this._addChatInfo, this);
        gdk.e.on(ChatEvent.UPDATE_CHAT_LIST, this._updateChatList, this);
        this.InputBox.string = this.model.chatInputText

    }

    onEnable() {
        this.actPanel.y = this.actPanel.y - this.actPanel.height - 20;
        this.actPanel.runAction(cc.moveTo(this.showTime, cc.v2(0, this.startY)));
        this.updateSendBtn(0, true);
        this.model.allianceMsgCount = 0
        this._updateChatList()
    }

    onDestroy() {
        gdk.e.targetOff(this);
        this.unscheduleAllCallbacks();
    }

    /**刷新聊天界面 */
    async _updateChatPanel() {
        this.scrollViewCom.clear_items()

        let curList = []
        switch (this.curChannel) {
            case ChatChannel.ALLIANCE://联盟
                curList = this.model.AllianceMessages
                //this.channelLabel.string = gdk.i18n.t("i18n:CHAT_TIP1");
                break
            default:
                break;
        }
        let list = []
        for (let index = 0; index < curList.length; index++) {
            const element = curList[index];
            let data = { key: 1, chatInfo: element };
            list.push(data)
        }

        if (list.length == 0) {
            this.nothingTips.active = true;
            let sprite = this.nothingTips.getChildByName("noTips").getComponent(cc.Sprite)
            GlobalUtil.setSpriteIcon(this.node, sprite.node, 'view/chat/texture/text_noTips');
        } else {
            this.nothingTips.active = false;
        }

        this.scrollViewCom.set_data(list)
        this.scheduleOnce(() => {
            this.scrollToBottom()
        })
    }

    /**滑动条拖动监测
     * 不是在最底部时,不自动置底
     */
    scorllEvents(scroll: cc.ScrollView) {
        let offset = scroll.getScrollOffset()
        let listHeight = this.content.height
        let scrollHeight = this.ChatScroll.node.height
        if (listHeight - scrollHeight >= offset.y + 20) {
            this.isBottomed = false
        } else {
            this.isBottomed = true
        }
        if (listHeight > scrollHeight && !this.isBottomed) {
            this.bottomTip.active = true
        } else {
            this.bottomTip.active = false
        }
    }

    /**
     * 更新按钮标签
     * @param dt 
     * @param isAddSchedule 
     */
    updateSendBtn(dt: number, isAddSchedule?: boolean) {
        let text = this.sendBtn.getComponentInChildren(cc.Label);
        let time = (this.serverModel.serverTime - this.model.lastTimeStamp) / 1000;
        let checkTime = 30
        if (this.curChannel == ChatChannel.GUILD) {
            checkTime = 10
        }
        if (time >= checkTime) {
            this.unschedule(this.updateSendBtn);
            this.sendBtn.interactable = true;
            text.string = gdk.i18n.t("i18n:CHAT_TIP11");
        } else {
            this.sendBtn.interactable = false;
            text.string = `${Math.ceil(checkTime - time)} ${gdk.i18n.t("i18n:CHAT_TIP12")}`;
            if (isAddSchedule) {
                this.schedule(this.updateSendBtn, 0.25);
            }
        }
    }

    sendFunc() {
        let lvLimit = ConfigManager.getItem(GlobalCfg, { key: 'chat_min_level' }).value[0];
        if (this.roleModel.level < lvLimit) {
            gdk.GUIManager.showMessage(StringUtils.format(gdk.i18n.t("i18n:CHAT_TIP6"), lvLimit))//`指挥官等级达到${lvLimit}级才可发言`)
            return
        }

        let text = ChatUtils.filter(this.InputBox.string)
        if (text == "") {
            gdk.GUIManager.showMessage(gdk.i18n.t("i18n:CHAT_TIP7"))
            return
        }

        this.model.lastTimeStamp = this.serverModel.serverTime;
        this.sendBtn.interactable = false;
        this.updateSendBtn(0, true);

        // 先把满足条件的文本转换为#<index>的格式
        // 因为有可能出现超文本相同的情况,因此要先转换一遍格式
        for (let index = 0; index < this.model.linkTab.length; index++) {
            const element = this.model.linkTab[index];
            if (text.indexOf(element[0]) >= 0) {
                text = text.replace(element[0], `#<${index}>`)
            }
        }

        // let equips = []
        // for (let index = 0; index < this.model.linkTab.length; index++) {
        //     const element = this.model.linkTab[index];
        //     let linkStr = element[1]
        //     // 装备点击要特殊处理
        //     // 找出param参数,把唯一id改成@equip+对应的装备下标
        //     if (linkStr.indexOf("equipClick") >= 0) {
        //         let id = linkStr.replace(/.*param='{(.+)}'.*/, "$1")
        //         if (id) {
        //             linkStr = linkStr.replace(/{.*}/, `{@equip${equips.length}}`)
        //             equips.push(parseInt(id))
        //         }
        //     }
        //     text = text.replace(`#<${index}>`, linkStr)
        // }

        this.InputBox.string = ""
        this.model.chatInputText = ""
        this.model.linkTab = []

        let msg = new icmsg.ChatSendReq()
        msg.channel = this.curChannel //1:系统 2:世界 3:公会 4:私聊
        msg.content = MaskWordUtils.filter(text);
        msg.targetId = 0;
        NetManager.send(msg);
    }

    testSend(text) {
        let msg = new icmsg.ChatSendReq();
        msg.channel = ChatChannel.WORLD;
        msg.content = MaskWordUtils.filter(text);
        // msg.equips = [];
        msg.targetId = 0;
        NetManager.send(msg);
    }

    /**添加聊天信息 */
    _addChatInfo(e) {
        let info: icmsg.ChatSendRsp = e.data
        if (info.channel != this.curChannel) {
            return
        }
        this.nothingTips.active = false;

        let len = this.scrollViewCom.getItemLength()
        if (len >= this.model.maxNum) {
            this.scrollViewCom.remove_data(0)
        }
        let data = { key: 1, chatInfo: info };

        this.scrollViewCom.append_data([data]);
        this.scheduleOnce(() => {
            this.scrollToBottom()
        })
    }
    /**
     * ScrollView置底
     * 只有玩家在非拖动状态,并且处于最底部,才会置底,并且未锁住
     */
    scrollToBottom(e: cc.Event.EventTouch = null) {
        if (e) {
            this.bottomTip.active = false
            this.isBottomed = true
            this.scrollViewCom.scroll_to_end();
            return
        }
        let listHeight = this.content.height
        let scrollHeight = this.ChatScroll.node.height
        let offset = this.ChatScroll.getScrollOffset()
        // 是否锁住聊天内容
        let isLock = !this.lockTog.isChecked
        if (listHeight > scrollHeight && !this.ChatScroll.isScrolling() && !isLock && !gdk.panel.isOpenOrOpening(PanelId.BtnMenu)) {
            this.scrollViewCom.scroll_to_end();
            this.bottomTip.active = false
            this.isBottomed = true
        } else if (listHeight - scrollHeight >= offset.y + 20) {
            this.bottomTip.active = true
        } else {
            this.bottomTip.active = false
        }
    }

    /**显示表情选择面板 */
    showFaceView() {
        gdk.panel.open('Face', (node: cc.Node) => {
            node.setPosition(cc.v2(35, -425))
        })
    }

    /**插入文字 */
    _addText(e) {
        let str = e.data
        let addStr = str
        let regex = /<.+?\/?>/g
        // 如果这个长度大于0 ,则证明是超链接文本
        const matchArr = str.match(regex);
        let linkTab = this.model.linkTab
        if (matchArr && matchArr.length > 0) {
            if (linkTab.length >= 3) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:CHAT_TIP9"))
                return
            }
            for (let index = 0; index < matchArr.length; index++) {
                const ele = matchArr[index];
                addStr = addStr.replace(ele, "")
            }
            linkTab.push([addStr, str])
        }

        let text = this.textLabel.string
        if (text.length >= 50) {
            return
        }
        this.InputBox.string = text + addStr
        this.model.chatInputText = this.InputBox.string
        // this.textLabel.node.active = false
    }

    onTextChanged() {
        this.onEditEnded();
    }


    /**判断超链接文本是否还存在 */
    onEditEnded() {
        let str = this.InputBox.string;
        if (this.model.linkTab.length) {
            let idx = 0
            while (idx < this.model.linkTab.length) {
                let ele = this.model.linkTab[idx];
                if (str.indexOf(ele[0]) < 0) {
                    this.model.linkTab.splice(idx, 1);
                } else {
                    // 这里替换掉是避免单个文本多次匹配超链接
                    str = str.replace(ele[0], "");
                    idx++;
                }
            }
        }
        if (str) {
            // let len = this.checkValidLen(str);
            if (str.length > 50) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:CHAT_TIP10"));
                str = str.substring(0, 50);
                this.InputBox.string = str;
            }
        }
        this.model.chatInputText = str;
        // console.log(str, this.model.linkTab)
    }

    hideView() {
        let moveAct = cc.moveTo(this.hideTime, cc.v2(0, this.startY - this.actPanel.height - 20))
        let seq = cc.sequence(
            moveAct,
            cc.callFunc(() => {
                this.close()
            })
        )
        this.actPanel.runAction(seq)
    }

    _updateChatList() {
        if (this.curChannel == ChatChannel.DEFAULT) {
            return
        }
        this._updateChatPanel()
    }
}