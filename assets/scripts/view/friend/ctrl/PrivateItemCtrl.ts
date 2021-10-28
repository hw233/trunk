import ChatEventCtrl from '../../chat/ctrl/ChatEventCtrl';
import ChatUtils from '../../chat/utils/ChatUtils';
import FriendModel from '../../friend/model/FriendModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import MaskWordUtils from '../../../common/utils/MaskWordUtils';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import StoreModel from '../../store/model/StoreModel';
import VipFlagCtrl from '../../../common/widgets/VipFlagCtrl';
import { BtnMenuType } from '../../../common/widgets/BtnMenuCtrl';

/** 
 * 聊天List子项控制器
 * @Author: weiliang.huang  
 * @Description: 
 * @Date: 2019-03-21 18:03:49 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 11:46:30
 */


let ItemParams = [{
    iconPosX: 8,
    textPosX: 134,
}, {
    iconPosX: 520,
    textPosX: 390,
}];


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/friend/PrivateItemCtrl")
export default class PrivateItemCtrl extends cc.Component {

    @property(cc.RichText)
    chatText: cc.RichText = null;

    @property(cc.Node)
    leftBg: cc.Node = null

    @property(cc.Node)
    rightBg: cc.Node = null

    @property(cc.Node)
    frame: cc.Node = null

    @property(cc.Sprite)
    icon: cc.Sprite = null

    @property(cc.Label)
    timeLab: cc.Label = null

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Label)
    lvLab: cc.Label = null

    @property(cc.Layout)
    layout: cc.Layout = null;

    @property(cc.Node)
    vipFlag: cc.Node = null

    data: icmsg.ChatSendRsp = null

    get model(): RoleModel { return ModelManager.get(RoleModel); }
    get friendModel(): FriendModel { return ModelManager.get(FriendModel); }
    get storeModel(): StoreModel { return ModelManager.get(StoreModel); }

    start() {
        if (!this.chatText.getComponent(ChatEventCtrl)) {
            this.chatText.addComponent(ChatEventCtrl)
        }
    }

    onDisable() {
        this.data = null;
        this.chatText.string = '';
        this.nameLab.string = '';
        this.timeLab.string = '';
    }

    updateView(data) {
        this.data = data;
        GlobalUtil.setSpriteIcon(this.node, this.icon, GlobalUtil.getHeadIconById(this.data.playerHead));
        GlobalUtil.setSpriteIcon(this.node, this.frame, GlobalUtil.getHeadFrameById(this.data.playerFrame));
        this.lvLab.string = `L${this.data.playerLv}`

        let chatTxt = ChatUtils.parseText(this.data);

        //-----------------屏蔽敏感词-----------------
        this.chatText.string = MaskWordUtils.filter(chatTxt);
        let textWidth = this.chatText.node.width;
        let textHeight = this.chatText.node.height;

        let maxWidth = this.chatText.maxWidth;
        let labelSegments = this.chatText['_labelSegments'];
        let labelWidth = 0;
        let lineCount;
        for (let index = 0; index < labelSegments.length; index++) {
            const labelSegment = labelSegments[index];
            lineCount = labelSegment._lineCount;
            if (lineCount == 1) {
                labelWidth += labelSegment.width;
            } else {
                break;
            }
        }
        if (labelWidth != 0) {
            textWidth = labelWidth;
        }

        let sendId = this.data.playerId.toLocaleString();
        let myId = this.model.id.toLocaleString();

        let state = sendId == myId;
        let itemParam;
        textHeight += 13;
        if (sendId == myId) {
            this.nameLab.string = this.model.name;
            itemParam = ItemParams[1];
            this.leftBg.active = false;
            this.rightBg.active = true;
            this.rightBg.width = textWidth + 45;
            this.rightBg.height = textHeight;
            this.chatText.node.color = cc.color('#FFFFFF')
        } else {
            this.nameLab.string = this.data.playerName;
            itemParam = ItemParams[0];
            this.leftBg.active = true;
            this.rightBg.active = false;
            this.leftBg.width = textWidth + 45;
            this.leftBg.height = textHeight;
            this.chatText.node.color = cc.color('#572F02')
        }
        this.icon.node.parent.x = itemParam.iconPosX;
        this.frame.x = itemParam.iconPosX;
        this.chatText.node.anchorX = state ? 1 : 0;

        if (state) {
            this.chatText.node.x = 435 + (maxWidth - textWidth);
        } else {
            this.chatText.node.x = 98;
        }

        // this.timeLab.node.x = itemParam.textPosX;
        this.timeLab.node.anchorX = state ? 1 : 0;
        this.layout.node.anchorX = state ? 1 : 0;

        let vipCtrl = this.vipFlag.getComponent(VipFlagCtrl)

        if (state) {
            // this.nameLab.node.x = itemParam.textPosX - this.timeLab.node.width - 2;
            this.layout.node.x = 438;
            this.layout.horizontalDirection = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT;
            this.nameLab.node.active = false;

            vipCtrl.updateVipLv(this.model.vipLv)
            //this.vipFlag.x = this.layout.node.x + 5

        } else {
            this.layout.node.x = 88;
            this.layout.horizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
            this.nameLab.node.x = itemParam.textPosX + this.timeLab.node.width + 2;
            this.nameLab.node.active = true;
            vipCtrl.updateVipLv(GlobalUtil.getVipLv(this.data.playerVipExp))
            //this.vipFlag.x = this.layout.node.x - 40

        }
        this.nameLab.node.anchorX = state ? 1 : 0;

        let date = new Date(this.data.chatTime);
        this.timeLab.string = `${GlobalUtil.padLeft(date.getHours(), 2)}:${GlobalUtil.padLeft(date.getMinutes(), 2)}`;
        if (textHeight - 65 > 0) {
            this.node.height = 116 + textHeight - 63;
        } else {
            this.node.height = 116;
        }
    }

    _replaceAll(seachValue: string, replaceValue: string, str: string): string {
        let idx = str.indexOf(seachValue);
        while (idx != -1) {
            str = str.replace(seachValue, replaceValue);
            idx = str.indexOf(seachValue, idx + 1);
        }
        return str;
    }

    /**展开菜单栏 */
    onHeadClick() {
        let btns: BtnMenuType[] = [1, 11]
        let id = this.data.playerId
        if (id == ModelManager.get(RoleModel).id) return;
        let friendModel = this.friendModel
        let friendIdList = friendModel.friendIdList
        let idList = friendModel.backIdList
        // 判断添加屏蔽/取消屏蔽按钮
        // if (idList[id.toLocaleString()]) {
        //     btns.splice(1, 0, 5)
        // } else {
        //     btns.splice(1, 0, 4)
        // }
        // 非好友的情况下增加添加好友按钮
        if (!friendIdList[id.toLocaleString()]) {
            btns.splice(1, 0, 2)
        }

        // //非普通成员可 发出 公会邀请
        if (this.model.guildTitle != 0 && !this.data.guildName) {
            btns.push(10)
        }

        let data = this.data
        GlobalUtil.openBtnMenu(this.frame, btns, {
            id: id,
            name: data.playerName,
            headId: data.playerHead,
            headBgId: data.playerFrame,
            level: data.playerLv,
            chatContent: data.content
        })
    }
}
