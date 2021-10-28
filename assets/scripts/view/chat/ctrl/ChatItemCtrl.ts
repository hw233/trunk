import ChatEventCtrl from './ChatEventCtrl';
import ChatUtils from '../utils/ChatUtils';
import FriendModel from '../../friend/model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import StoreModel from '../../store/model/StoreModel';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';
import { BtnMenuType } from '../../../common/widgets/BtnMenuCtrl';
import { ChatChannel } from '../enum/ChatChannel';

/** 
 * 聊天List子项控制器
 * @Author: weiliang.huang  
 * @Description: 
 * @Date: 2019-03-21 18:03:49 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-09-01 18:05:48
 */

const { ccclass, property, menu } = cc._decorator;

const ChatItemMode = cc.Enum({
    // NONE: 0,
    /*左边消息 */
    LEFT: 1,
    /*右边消息 */
    RIGHT: 2,
    /*系统消息 */
    SYSTEM: 3,
})

@ccclass
@menu("qszc/view/chat/ChatItemCtrl")
export default class ChatItemCtrl extends cc.Component {

    @property(cc.Node)
    sysNode: cc.Node = null;

    @property(cc.Node)
    chatNode: cc.Node = null;

    @property(cc.Sprite)
    frame: cc.Sprite = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Sprite)
    titleIcon: cc.Sprite = null;

    @property(cc.Label)
    levelLab: cc.Label = null;

    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Node)
    textBg1: cc.Node = null

    @property(cc.Node)
    textBg2: cc.Node = null;

    @property(cc.RichText)
    chatText: cc.RichText = null;

    @property(cc.Layout)
    layout: cc.Layout = null;

    @property(cc.Node)
    vipFlag: cc.Node = null

    // @property(cc.Node)
    // sysTextBg: cc.Node = null;

    // @property(cc.Node)
    // tagIcons: cc.Node[] = [];

    //富文本坐标
    // @property({})
    // _txtPoints: cc.Vec2[] = [];
    // @property({ type: cc.Vec2, displayName: "txtPoints" })
    // get txtPoints(): cc.Vec2[] {
    //     return this._txtPoints;
    // }
    // set txtPoints(value: cc.Vec2[]) {
    //     this._txtPoints = value;
    //     this.updateLayout();
    // }

    // //头像框坐标es
    // @property({})
    // _frameXs: number[] = [];
    // @property({ type: cc.Integer, displayName: "frameXs" })
    // get frameXs(): number[] {
    //     return this._frameXs;
    // }
    // set frameXs(value: number[]) {
    //     this._frameXs = value;
    //     this.updateLayout();
    // }

    // @property({})
    // _mode: number = ChatItemMode.LEFT;
    // @property({ type: ChatItemMode, displayName: "mode" })
    // get mode(): number {
    //     return this._mode;
    // }
    // set mode(value: number) {
    //     this._mode = value;
    //     this.updateLayout();
    // }

    data: icmsg.ChatSendRsp = null

    get model(): RoleModel { return ModelManager.get(RoleModel); }
    get friendModel(): FriendModel { return ModelManager.get(FriendModel); }
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    start() {
        if (!CC_EDITOR) {
            if (!this.chatText.getComponent(ChatEventCtrl)) {
                this.chatText.addComponent(ChatEventCtrl)
            }
        } else {
            // CC_EDITOR && this.updateLayout();
        }
    }

    onDisable() {
        this.data = null;
        this.chatText.string = '';
        this.nameLab.string = '';
        this.levelLab.string = '';
        this.timeLab.string = '';
    }

    updateView(data) {
        this.data = data.chatInfo
        let title = this.sysNode.getChildByName("title")
        if (this.data.channel == ChatChannel.SYS) {
            this.chatNode.active = false;
            this.sysNode.active = true;
            GlobalUtil.setSpriteIcon(this.node, title, "view/chat/texture/lt_xitong_s")
            this._showSysText()
        } else {
            if (this.data.playerId == 0 && this.data.playerName == "") {
                this.chatNode.active = false;
                this.sysNode.active = true;
                let path = "view/chat/texture/bg_liaotiangonhuixiao"
                if (this.data.channel == ChatChannel.CROSSACT) {
                    path = "view/chat/texture/bg_liaotiankuafu"
                }
                GlobalUtil.setSpriteIcon(this.node, title, path)
                this._showSysText()
            } else {
                this.chatNode.active = true;
                this.sysNode.active = false;
                this._showChatText()
            }
        }
    }

    /**展示系统消息 */
    _showSysText() {
        let chatText = this.chatText;
        chatText.node.anchorX = 0;
        chatText.node.anchorY = 1;
        chatText.node.x = -256;
        chatText.node.y = 0;
        chatText.maxWidth = 560;
        chatText.node.color = new cc.Color().fromHEX('#978572');
        chatText.string = ChatUtils.parseText(this.data)
        chatText.fontSize = 22;
        let textHeight = chatText.node.height
        // this.sysTextBg.height = textHeight;
        this.node.height = textHeight;

        // let tv_id = Math.min(this.data.playerLv, 2);
        // tv_id = tv_id ? tv_id - 1 : 0;
        // for (let index = 0; index < this.tagIcons.length; index++) {
        //     const element = this.tagIcons[index];
        //     if (tv_id == index) {
        //         element.active = true;
        //     } else {
        //         element.active = false;
        //     }
        // }
    }

    /**展示玩家聊天信息 */
    _showChatText() {
        let data = this.data;

        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getHeadIconById(data.playerHead));
        GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(data.playerFrame));
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, GlobalUtil.getHeadTitleById(data.playerTitle));


        let guildName = data.guildName ? ` (${data.guildName})` : "";
        if (this.data.channel == ChatChannel.CROSSACT) {
            let serverNum = Math.floor((data.playerId % (10000 * 100000)) / 100000)
            guildName = data.guildName ? ` (S${serverNum} ${data.guildName})` : ` (S${serverNum})`;
        }
        this.nameLab.string = data.playerName + guildName
        this.levelLab.string = `L${data.playerLv}`;

        let date = new Date(data.chatTime);
        this.timeLab.string = GlobalUtil.padLeft(date.getHours(), 2) + ":" + GlobalUtil.padLeft(date.getMinutes(), 2);

        let chatText = this.chatText;
        chatText.node.anchorY = 1;
        chatText.node.y = -38;
        chatText.maxWidth = 370;
        chatText.string = ChatUtils.parseText(data);

        let textWidth = chatText.node.width;
        let textHeight = chatText.node.height;

        let maxWidth = chatText.maxWidth;
        let labelSegments = chatText['_labelSegments'];
        let labelWidth = 0;
        for (let index = 0; index < labelSegments.length; index++) {
            const labelSegment = labelSegments[index];
            const lineCount = labelSegment._lineCount;
            if (lineCount == 1) {
                labelWidth += labelSegment.width;
            } else {
                break;
            }
        }
        if (labelWidth != 0) {
            textWidth = labelWidth;
        }

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)

        let sendId = data.playerId.toLocaleString()
        let myId = this.model.id.toLocaleString();
        chatText.node.color = new cc.Color().fromHEX('#ffffff')
        // textHeight += 13;
        let txtBg;
        if (sendId == myId) {
            this.textBg1.active = false;
            this.textBg2.active = true;
            txtBg = this.textBg2;
            txtBg.width = 30 + textWidth;
            chatText.node.anchorX = 1;
            chatText.node.x = 180 + (maxWidth - textWidth);
            this.frame.node.x = 255;
            this.icon.node.parent.x = 255
            chatText.string = `<color=3ae8ea>${chatText.string}</color>`
        } else {
            this.textBg1.active = true;
            this.textBg2.active = false;
            txtBg = this.textBg1;
            txtBg.width = 33 + textWidth;
            chatText.node.anchorX = 0;
            chatText.node.x = -178;
            this.frame.node.x = -255;
            this.icon.node.parent.x = -255
            chatText.string = `<color=3ae8ea>${chatText.string}</color>`
        }
        txtBg.height = textHeight + 5;
        if (sendId == myId) {
            this.layout.horizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
            // this.timeLab.node.x = 196;
            this.timeLab.node.anchorX = 1;
            this.layout.node.anchorX = 1;
            this.layout.node.x = 181;
            this.nameLab.node.active = false;
            vipCtrl.updateVipLv(this.model.vipLv)
            // this.vipFlag.x = this.layout.node.x + 5
        } else {
            this.layout.horizontalDirection = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT;
            // this.nameLab.node.x = -208;
            this.layout.node.anchorX = 0;
            this.timeLab.node.anchorX = 0;
            this.layout.node.x = -181;
            this.nameLab.node.active = true;
            this.nameLab.node.anchorX = 0;
            // this.timeLab.node.x = -208 + this.nameLab.node.width + 20;
            vipCtrl.updateVipLv(GlobalUtil.getVipLv(data.playerVipExp))
            // this.vipFlag.x = this.layout.node.x - 40
        }

        if (textHeight - 74 > 0) {
            this.node.height = 110 + textHeight - 74;
        } else {
            this.node.height = 110;
        }
    }

    /**展开菜单栏 */
    onHeadClick() {
        let btns: BtnMenuType[] = [1, 0, 11]

        let id = this.data.playerId
        if (id == this.model.id) return;
        let friendIdList = this.friendModel.friendIdList
        let idList = this.friendModel.backIdList
        // // 判断添加屏蔽/取消屏蔽按钮
        if (idList[id.toLocaleString()]) {
            btns.splice(1, 0, 5)
        } else {
            btns.splice(1, 0, 4)
        }
        // 非好友的情况下增加添加好友按钮
        if (!friendIdList[id.toLocaleString()]) {
            btns.splice(1, 0, 2)
        }
        // //非普通成员可 发出 公会邀请
        if (this.model.guildTitle != 0 && !this.data.guildName) {
            btns.push(10)
        }
        if (this.data.channel == ChatChannel.CROSSACT) {
            btns = [1]
        }
        let data = this.data;
        GlobalUtil.openBtnMenu(this.frame.node, btns, {
            id: id,
            name: data.playerName,
            headId: data.playerHead,
            headBgId: data.playerFrame,
            level: data.playerLv,
            chatContent: data.content,
        })
    }
}
