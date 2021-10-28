import BagUtils from '../../utils/BagUtils';
import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ChatModel from '../../../view/chat/model/ChatModel';
import ChatUtils from '../../../view/chat/utils/ChatUtils';
import ConfigManager from '../ConfigManager';
import FriendModel from '../../../view/friend/model/FriendModel';
import GlobalUtil from '../../utils/GlobalUtil';
import JumpUtils from '../../utils/JumpUtils';
import MaskWordUtils from '../../utils/MaskWordUtils';
import ModelManager from '../ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RedPointUtils from '../../utils/RedPointUtils';
import RoleModel from '../../models/RoleModel';
import SdkTool from '../../../sdk/SdkTool';
import ServerModel from '../../models/ServerModel';
import StringUtils from '../../utils/StringUtils';
import { BagType } from '../../models/BagModel';
import { ChatChannel, ColorType } from '../../../view/chat/enum/ChatChannel';
import { ChatEvent } from '../../../view/chat/enum/ChatEvent';
import { Hero_starCfg, Item_dropCfg, TvCfg } from '../../../a/config';

/**
 * @Description: 聊天通信器
 * @Author: weiliang.huang
 * @Date: 2019-04-08 13:44:49
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-13 16:44:28
 */

export default class ChatController extends BaseController {
    get roleModel(): RoleModel { return ModelManager.get(RoleModel) };
    get gdkEvents(): GdkEventArray[] {
        return [
            [ChatEvent.ADD_FRIEND_CHANGE_NAME_MSG, this._addFriendChangeNameMsg]
        ];
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.ChatSendRsp.MsgType, this.onChatSendRspHandle],
            [icmsg.SystemShowOffRsp.MsgType, this._onSystemShowOffRsp],
            [icmsg.SystemNoticeRsp.MsgType, this._onSystemNoticeRsp],
            [icmsg.BountyListNumRsp.MsgType, this._onBountyListNumRsp],
            [icmsg.SystemManlingKfmsgRsp.MsgType, this._onKfmsgRsp],
        ];
    }

    model: ChatModel = null
    friendModel: FriendModel = null

    onStart() {
        this.model = ModelManager.get(ChatModel)
        this.friendModel = ModelManager.get(FriendModel)
    }

    onEnd() {
        this.model = null
    }

    onChatSendRspHandle(msg: icmsg.ChatSendRsp) {
        // console.log("onChatSendRspHandle")
        let blacIdList = this.friendModel.backIdList
        let rId = msg.playerId.toLocaleString()
        if (blacIdList[rId]) {
            return
        }
        if (rId == this.roleModel.id.toLocaleString()) {
            SdkTool.tool.chatWatch && SdkTool.tool.chatWatch(msg);
        }
        msg.chatTime *= 1000
        switch (msg.channel) {
            case ChatChannel.SYS:
                this._addChatToArray(this.model.SysMessages, msg)
                break;
            case ChatChannel.WORLD:
                //-----------------屏蔽敏感词-----------------
                msg.content = MaskWordUtils.filter(msg.content);
                this._addChatToArray(this.model.WorldMessages, msg)
                break
            case ChatChannel.PRIVATE:
                this._addChatToPrivate(msg)
                gdk.e.emit(ChatEvent.ADD_PRIVATE_CHAT, msg)
                this.model.privateMsgCount += 1
                break
            case ChatChannel.GUILD:
                //-----------------屏蔽敏感词-----------------
                msg.content = MaskWordUtils.filter(msg.content);
                this._addChatToArray(this.model.GuildMessages, msg)
                if (msg.playerId != this.roleModel.id) {
                    this.model.guildMsgCount += 1
                }
                break
            case ChatChannel.ALLIANCE:
                msg.content = MaskWordUtils.filter(msg.content);
                this._addChatToArray(this.model.AllianceMessages, msg)
                if (msg.playerId != this.roleModel.id) {
                    if (!gdk.panel.isOpenOrOpening(PanelId.FHChatView) && msg.chatTime >= ModelManager.get(ServerModel).serverTime - 3000) {
                        this.model.allianceMsgCount += 1
                    }
                }
                break
            case ChatChannel.CROSSACT:
                //-----------------屏蔽敏感词-----------------
                msg.content = MaskWordUtils.filter(msg.content);
                this._addChatToArray(this.model.CrossactMessages, msg)
                if (msg.playerId != this.roleModel.id) {
                    this.model.corssactMsgCount += 1
                }
                break
            default:
                break;
        }

        if (msg.channel != ChatChannel.PRIVATE && msg.channel != ChatChannel.ALLIANCE) {
            this._addChatToArray(this.model.AllMessages, msg)
            gdk.e.emit(ChatEvent.ADD_CHAT_INFO, msg)
        }
        if (msg.channel == ChatChannel.ALLIANCE) {
            gdk.e.emit(ChatEvent.ADD_ALLIANCE_CHAT_INFO, msg)
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

    /**把聊天信息插到对应的表内,大于最大数量时执行删除操作 */
    _addChatToArray(arr: Array<icmsg.ChatSendRsp>, info: icmsg.ChatSendRsp): boolean {
        let flag = false
        if (arr.length >= this.model.maxNum) {
            arr.shift()
            flag = true
        }
        arr.push(info)
        return flag
    }

    /**把聊天信息加入私聊表 */
    _addChatToPrivate(info: icmsg.ChatSendRsp) {
        let pId = info.playerId.toLocaleString()
        let selfId = this.roleModel.id.toLocaleString()
        if (pId == selfId) return
        let mes = this.model.privateMessages
        let unRedMsg = this.model.unRedMessages;
        let recentPlayers = this.model.recentPlayers
        let newChat = true
        for (let index = 0; index < recentPlayers.length; index++) {
            const ele = recentPlayers[index];
            let rId = ele.id.toLocaleString()
            if (rId == pId) {
                newChat = false
                break
            }
        }
        if (newChat) {
            let player = ChatUtils.addChatPlayer(info.playerId, info.playerName, info.playerHead, info.playerFrame, info.playerLv)
            gdk.e.emit(ChatEvent.ADD_NEW_PRIVATE_CHAT, player)
        }
        if (!mes[pId]) {
            mes[pId] = []
        }
        mes[pId].push(info)
        let len = mes[pId].length
        if (len > this.model.maxNum) {
            mes[pId].shift()
        }

        if (!unRedMsg[pId]) {
            unRedMsg[pId] = 0;
        }
        unRedMsg[pId] += 1;
        unRedMsg[pId] = Math.min(unRedMsg[pId], this.model.maxNum);
        //功能已开启，私聊标示红点
        if (JumpUtils.ifSysOpen(2300, false)) {
            // 标记红点
            RedPointUtils.save_state('chat_private', true)
        }
    }

    /**系统掉落提示 */
    _onSystemShowOffRsp(data: icmsg.SystemShowOffRsp) {
        let playerName = data.playerName
        for (let index = 0; index < data.goodsList.length; index++) {
            const dropGood = data.goodsList[index];
            let dropGoods = [];
            dropGoods.push(dropGood);
            this._sendSystemMes(data.playerId, playerName, dropGood.dropId, dropGoods)
        }
    }

    /**发送系统消息 */
    _sendSystemMes(playerId: number, playerName: string, dropId: number, arr: icmsg.DropGoods[]) {
        let dropCfg = ConfigManager.getItemByField(Item_dropCfg, "drop_id", dropId);
        let tvCfg = dropCfg ? ConfigManager.getItemById(TvCfg, dropCfg.tv_id) : null;
        if (!tvCfg) {
            cc.error(dropCfg ? `TvCfg 配置不存在, tv_id: ${dropCfg.tv_id}` : `Item_dropCfg 配置不存在, drop_id: ${dropId}`);
            return;
        }
        let text = tvCfg.desc;
        let colorInfo = ChatUtils.getPanelColorInfo(ColorType.Blue);
        //text = text.replace("{name}", `<color=${colorInfo.color} id=${ColorType.Blue}><on click='playerClick' param='${playerId}'>${playerName}</on></c>`)
        text = text.replace("{name}", `<on click='playerClick' param='${playerId}'>${playerName}</on>`)
        text = text.replace("{run}", dropCfg.run)
        let itemDesc = ""
        let equips = []
        for (let index = 0; index < arr.length; index++) {
            if (index > 0) {
                itemDesc = itemDesc + "、"
            }
            const itemData = arr[index];
            let itemId = itemData.goodsTypeId
            let star;
            if (itemData.goodsTypeId.toString().length >= 8) {
                itemId = parseInt(itemData.goodsTypeId.toString().slice(0, 6));
                star = parseInt(itemData.goodsTypeId.toString().slice(6));
            }
            let cfg = BagUtils.getConfigById(itemId)
            let type = BagUtils.getItemTypeById(itemId)
            let nameText = cfg.name
            if (itemData.goodsNum > 1) {
                nameText = `${nameText}x${itemData.goodsNum}`
            }
            let color = cfg.defaultColor || cfg.color;
            if (star) {
                color = ConfigManager.getItemById(Hero_starCfg, star).color;
            }
            let colorInfo = ChatUtils.getPanelColorInfo(color);
            let str = ""
            if (type == BagType.ITEM || type == BagType.JEWEL) {
                if (color == ColorType.Gold) {
                    str = `<outline width=2 color=#c36c06><color=${colorInfo.color} id=${color}><on click='itemClick' param='{${itemId}}'>[${nameText}]</on></c></outline>`
                } else {
                    str = `<color=${colorInfo.color} id=${color}><on click='itemClick' param='{${itemId}}'>[${nameText}]</on></c>`
                }
            } else if (type == BagType.EQUIP) {
                if (color == ColorType.Gold) {
                    str = `<outline width=2 color=#c36c06><color=${colorInfo.color} id=${color}><on click='equipClick' param='{@equip${equips.length}}'>[${nameText}]</on></c></outline>`
                } else {
                    str = `<color=${colorInfo.color} id=${color}><on click='equipClick' param='{@equip${equips.length}}'>[${nameText}]</on></c>`
                }
                let info = new icmsg.EquipInfo()
                info.equipId = itemId
                info.equipNum = 1
                equips.push(info)
            } else if (type == BagType.HERO) {
                if (color == ColorType.Gold) {
                    str = `<outline width=2 color=#c36c06><color=${colorInfo.color} id=${color}><on click='heroClick' param='{${itemId}}'>[${nameText}]</on></c></outline>`
                } else {
                    str = `<color=${colorInfo.color} id=${color}><on click='heroClick' param='{${itemId}}'>[${nameText}]</on></c>`
                }
            } else if (type == BagType.UNIQUEEQUIP) {
                if (color == ColorType.Red) {
                    str = `<outline width=2 color=#b91314><color=${colorInfo.color} id=${color}><on click='uniqueEquipClick' param='{${itemId}}'>[${nameText}]</on></c></outline>`
                } else if (color == ColorType.Gold) {
                    str = `<outline width=2 color=#c36c06><color=${colorInfo.color} id=${color}><on click='uniqueEquipClick' param='{${itemId}}'>[${nameText}]</on></c></outline>`
                } else {
                    str = `<color=${colorInfo.color} id=${color}><on click='uniqueEquipClick' param='{${itemId}}'>[${nameText}]</on></c>`
                }
            }
            else {
                if (color == ColorType.Gold) {
                    str = `<outline width=2 color=#c36c06><color=${colorInfo.color} id=${color}>[${nameText}]</c></outline>`
                } else {
                    str = `<color=${colorInfo.color} id=${color}>[${nameText}]</c>`
                }
            }
            // let str = `<color=${color.color}>${nameText}</c>`
            itemDesc = itemDesc + str
        }
        text = text.replace("{item}", itemDesc)

        let model = ModelManager.get(ServerModel)
        let info = new icmsg.ChatSendRsp()
        info.playerId = 0
        //系统消息，无需使用playerLv，用playerLv来保存tv_id
        info.playerLv = dropCfg.tv_id
        info.playerName = ""
        info.playerHead = 0
        info.channel = ChatChannel.SYS
        info.chatTime = model.serverTime
        info.playerFrame = 0
        //info.equips = equips
        info.content = text
        this.onChatSendRspHandle(info)

        if (tvCfg.show_type == 1) {
            this.model.noticeList.push(text)
        }
        else {
            this.model.lowEffectNoticeList.push(text)
        }
        gdk.e.emit(ChatEvent.ADD_SYSTEM_NOTICE)
    }

    // 接收系统文字广播
    _onSystemNoticeRsp(data: icmsg.SystemNoticeRsp) {
        // 一些特殊命令的处理
        if (StringUtils.startsWith(data.content, '<update_client>')) {
            // 客户端版本更新
            GlobalUtil.checkClientVer();
            return;
        }
        this.model.noticeList.push(data.content)
        let info = new icmsg.ChatSendRsp()
        info.playerId = 0
        info.playerName = ""
        info.playerHead = 0
        info.channel = ChatChannel.SYS
        info.chatTime = GlobalUtil.getServerTime()
        info.playerFrame = 0
        info.content = data.content
        this.onChatSendRspHandle(info)

        gdk.e.emit(ChatEvent.ADD_SYSTEM_NOTICE)
    }


    _addFriendChangeNameMsg(e: gdk.Event) {
        this.onChatSendRspHandle(e.data)
    }


    _onBountyListNumRsp(data: icmsg.BountyListNumRsp) {
        this.model.bountyListCount = data.num
    }

    _onKfmsgRsp(data: icmsg.SystemManlingKfmsgRsp) {
        this.model.kfMsgCount = data.num;
    }
}
