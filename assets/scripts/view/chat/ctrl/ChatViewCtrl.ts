import ChatModel from '../model/ChatModel';
import ChatUtils from '../utils/ChatUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildModel from '../../guild/model/GuildModel';
import GuildUtils from '../../guild/utils/GuildUtils';
import JumpUtils from '../../../common/utils/JumpUtils';
import MaskWordUtils from '../../../common/utils/MaskWordUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiScrollView from '../../../common/widgets/UiScrollView';
import UiTabMenuCtrl from '../../../common/widgets/UiTabMenuCtrl';
import { ChatChannel } from '../enum/ChatChannel';
import { ChatEvent } from '../enum/ChatEvent';
import { GlobalCfg, SystemCfg, TipsCfg } from '../../../a/config';
import { ParseMainLineId } from '../../instance/utils/InstanceUtil';

/** 
 * 聊天界面控制器
 * @Author: weiliang.huang  
 * @Description: 
 * @Date: 2019-03-21 15:12:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-01 18:57:43
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/chat/ChatViewCtrl")
export default class ChatViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    actPanel: cc.Node = null

    @property(cc.EditBox)
    InputBox: cc.EditBox = null;

    @property(cc.ScrollView)
    ChatScroll: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Node)
    panels: cc.Node[] = [];

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

    @property(cc.Node)
    tabMenu: cc.Node = null

    @property(cc.Node)
    tabList: cc.Node[] = []

    @property(cc.Node)
    noGuildTipNode: cc.Node = null

    @property(cc.RichText)
    noGuildTipLab: cc.RichText = null

    @property(cc.Label)
    guildInviteNumLab: cc.Label = null;

    curList: Array<icmsg.ChatSendRsp> = []
    curChannel: number = -1
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

    channels = [ChatChannel.CROSSACT, ChatChannel.WORLD, ChatChannel.GUILD, ChatChannel.SYS];

    onLoad() {

        if (!JumpUtils.ifSysOpen(2859)) {
            this.tabList[0].active = false
        }

        this.startY = this.actPanel.y
        this.bottomTip.active = false

        this.lockTog.isChecked = true;

        this.scrollViewCom = this.ChatScroll.node.getComponent(UiScrollView);
        this.ChatScroll.node.on('scrolling', this.scorllEvents, this);
        this.scrollViewCom.init();
        // this.switchFunc(null, 1);
        gdk.e.on(ChatEvent.INPUT_TEXT_INFO, this._addText, this);
        gdk.e.on(ChatEvent.ADD_CHAT_INFO, this._addChatInfo, this);
        gdk.e.on(ChatEvent.UPDATE_CHAT_LIST, this._updateChatList, this);
        this.InputBox.string = this.model.chatInputText

        // this.schedule(() => {
        //     let num = MathUtil.rnd(1, 8)
        //     let textIdx = MathUtil.rnd(0, Texts.length - 1)
        //     let text = `#${num}#${Texts[textIdx]}`
        //     this.testSend(text)
        // }, 4);

        let args = this.args
        if (args.length > 0) {
            let index = args[0]
            if (index == 0) {
                if (!JumpUtils.ifSysOpen(2859)) {
                    index = 1
                }
            }
            this.switchFunc(null, index);

        } else {
            this.switchFunc(null, 1);
        }
    }

    onEnable() {
        this.actPanel.y = this.actPanel.y - this.actPanel.height - 20;
        this.actPanel.runAction(cc.moveTo(this.showTime, cc.v2(0, this.startY)));
        this.updateSendBtn(0, true);
        // this.updateTabMenu()
    }

    onDestroy() {
        gdk.e.targetOff(this);
        this.unscheduleAllCallbacks();
    }

    /**刷新聊天界面 */
    async _updateChatPanel() {
        this.scrollViewCom.clear_items()

        let panelBg;
        for (let index = 0; index < this.panels.length; index++) {
            const element = this.panels[index];
            element.active = false
            panelBg = element.getChildByName("bg");
            if (this.curChannel == ChatChannel.SYS) {
                this.panels[0].active = true
            } else {
                this.panels[1].active = true

            }
        }
        // for (let index = 0; index < this.panels.length; index++) {
        //     const element = this.panels[index];
        //     if (this.curChannel == index) {
        //         element.active = true;
        //         panelBg = element.getChildByName("bg");
        //     } else {
        //         element.active = false;
        //     }
        // }
        // this.ChatScroll.node.height = panelBg.height - 8

        let curList = []
        switch (this.curChannel) {
            case ChatChannel.SYS://系统
                curList = this.model.SysMessages
                this.channelLabel.string = gdk.i18n.t("i18n:CHAT_TIP1");
                this.panels[0].getChildByName('label').getComponent(cc.Label).string = gdk.i18n.t("i18n:CHAT_TIP4");
                break
            case ChatChannel.WORLD://世界
                curList = this.model.WorldMessages
                this.channelLabel.string = gdk.i18n.t("i18n:CHAT_TIP2");
                break
            case ChatChannel.GUILD://公会
                curList = this.model.GuildMessages
                let str = gdk.i18n.t("i18n:CHAT_TIP3");
                let info = await GuildUtils.getGuildInfo().catch((e) => { info = null });
                if (info) str = info.name;
                this.channelLabel.string = str;
                break
            case ChatChannel.CROSSACT:
                curList = this.model.CrossactMessages
                this.channelLabel.string = gdk.i18n.t("i18n:CHAT_TIP15");;
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
        } else {
            this.nothingTips.active = false;
        }

        this.noGuildTipNode.active = false
        //公会频道 未加入公会显示信息
        let sprite = this.nothingTips.getChildByName("noTips").getComponent(cc.Sprite)
        if (this.curChannel == ChatChannel.GUILD && this.roleModel.guildId == 0) {
            this.panels[1].active = false
            this.panels[0].active = true
            this.scrollViewCom.set_data([])
            this.nothingTips.active = false
            this.noGuildTipNode.active = true
            let cfg = ConfigManager.getItemById(TipsCfg, 16)
            let systemCfg = ConfigManager.getItemById(SystemCfg, 2400)
            let stageStr = ParseMainLineId(systemCfg.fbId, 1) + "-" + ParseMainLineId(systemCfg.fbId, 2)
            this.noGuildTipLab.string = `${(cfg.desc21 as String).replace("{stage_id}", stageStr)}`
            this.panels[0].getChildByName('label').getComponent(cc.Label).string = gdk.i18n.t("i18n:CHAT_TIP5");
            return
        } else {
            GlobalUtil.setSpriteIcon(this.node, sprite.node, 'view/chat/texture/text_noTips');
        }

        this.scrollViewCom.set_data(list)
        this.scheduleOnce(() => {
            this.scrollToBottom()
        })
    }

    joinGuildFunc() {
        JumpUtils.openView(2400, true)
        this.hideView()
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

        if (this.curChannel == ChatChannel.GUILD && this.roleModel.guildId == 0) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:CHAT_TIP8"))
            this._updateChatPanel()
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

        // let channels = [3, 2, 1, 4];
        let msg = new icmsg.ChatSendReq()
        msg.channel = this.curChannel //1:系统 2:世界 3:公会 4:私聊
        msg.content = MaskWordUtils.filter(text);
        // msg.equips = equips;
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

    onGuildInviteClick() {
        gdk.panel.open(PanelId.GuildInviteListView);
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

    /**频道切换函数 */
    switchFunc(event, index) {
        index = parseInt(index)
        //let 
        if (this.curChannel == this.channels[index]) {
            return
        }
        this.curChannel = this.channels[index];
        this._updateChatPanel()
        this.updateSendBtn(0, true);
        this.tabMenu.getComponent(UiTabMenuCtrl).showSelect(index);
        // for (let idx = 0; idx < this.ChannelBtns.length; idx++) {
        //     const element = this.ChannelBtns[idx];
        //     element.interactable = idx != this.curChannel
        //     let select = element.node.getChildByName("select")
        //     select.active = idx == index
        //     let lab = element.node.getChildByName("Label")
        //     let color = "#aca294"
        //     if (idx == index) {
        //         color = "#ffeb91"
        //     }
        //     lab.color = cc.color(color)
        // }
    }

    /**显示表情选择面板 */
    showFaceView() {
        gdk.panel.open('Face', (node: cc.Node) => {
            node.setPosition(cc.v2(-18, -530))
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

    // checkValidLen(txt) {
    //     let code;
    //     let len = txt.length > 50 ? 50 : txt.length;
    //     let byteLen = len;
    //     for (let i = 0; i < len; i++) {
    //         code = txt.charCodeAt(i);
    //         if (code > 255) { byteLen++; }
    //         if (byteLen > 40) {
    //             gdk.gui.showMessage("最多输入50个文字");
    //             return i + 1;
    //         }
    //     }
    //     return len;
    // }

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


    // @gdk.binding("roleModel.level")
    // updateTabMenu() {
    //     if (this.roleModel.level >= GuildUtils.getOpenLv()) {
    //         this.tabList[0].active = true
    //     }
    // }

    @gdk.binding("guildModel.guildInvitationList")
    updateGuildInviteCount() {
        let len = this.guildModel.guildInvitationList.length;
        this.guildInviteNumLab.node.parent.parent.active = len > 0
        if (len > 0) {
            if (len > 99) {
                len = 99
            }
            this.guildInviteNumLab.string = `${len}`
        }
    }
}