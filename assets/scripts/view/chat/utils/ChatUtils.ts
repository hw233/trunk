import BagUtils from '../../../common/utils/BagUtils';
import ChatModel, { PrivatePlayer } from '../model/ChatModel';
import ChatViewCtrl from '../ctrl/ChatViewCtrl';
import EquipUtils from '../../../common/utils/EquipUtils';
import FriendModel from '../../friend/model/FriendModel';
import MaskWordUtils from '../../../common/utils/MaskWordUtils';
import MiniChatCtrl from '../ctrl/MiniChatCtrl';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import { BagItem, BagType } from '../../../common/models/BagModel';
import { ChatEvent } from '../enum/ChatEvent';
import { ColorType } from '../enum/ChatChannel';
/** 
 * @Description: 聊天工具
 * @Author: weiliang.huang  
 * @Date: 2019-03-25 14:43:57 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-10-13 16:37:39
 */


const PanelColorInfo = [
    { title: "绿色", color: "#218d00" },
    { title: "蓝色", color: "#009ac1" },
    { title: "紫色", color: "#b800c3" },
    { title: "金色", color: "#f4f100" },
    { title: "红色", color: "#ffa78f" },
]

const SceneColorInfo = [
    { title: "绿色", color: "#31d200" },
    { title: "蓝色", color: "#00bde5" },
    { title: "紫色", color: "#ec50f5" },
    { title: "金色", color: "#e1d900" },
]

export default class ChatUtils {

    static get chatModel(): ChatModel { return ModelManager.get(ChatModel); }
    static get friendModel(): FriendModel { return ModelManager.get(FriendModel); }

    /**获取颜色cc.color */
    static getPanelColor(color: number = 1): cc.Color {
        let str = PanelColorInfo[color - 1].color
        return cc.color(str)
    }

    /**获取颜色信息 */
    static getPanelColorInfo(color: number = 1) {
        return PanelColorInfo[color - 1] || PanelColorInfo[0]
    }

    /**获取颜色cc.color */
    static getSceneColor(color: number = 1): cc.Color {
        let str = SceneColorInfo[color - 1].color
        return cc.color(str)
    }

    /**获取颜色信息 */
    static getSceneColorInfo(color: number = 1) {
        return SceneColorInfo[color - 1] || SceneColorInfo[0]
    }

    static convertSceneColor(txt: string): string {
        let curIdx = 0;
        //切除事件片段
        while (curIdx < txt.length) {
            let sIdx = txt.indexOf("<on click=", curIdx);
            if (sIdx < 0) break;
            let eIdx = txt.indexOf(">", sIdx);
            if (eIdx < 0) break;
            let closeIdx = txt.indexOf("</on>", eIdx);
            if (closeIdx < 0) break;

            txt = txt.substring(0, sIdx) + txt.substring(eIdx + 1, closeIdx) + txt.substring(closeIdx + 5);
            curIdx = sIdx;
        }

        curIdx = 0;
        //切除描边片段
        while (curIdx < txt.length) {
            let sIdx = txt.indexOf("<outline", curIdx);
            if (sIdx < 0) break;
            let eIdx = txt.indexOf(">", sIdx);
            if (eIdx < 0) break;
            let closeIdx = txt.indexOf("</outline>", eIdx);
            if (closeIdx < 0) break;
            txt = txt.substring(0, sIdx) + txt.substring(eIdx + 1, closeIdx) + txt.substring(closeIdx + 10);
            curIdx = sIdx;
        }

        curIdx = 0;
        //更换颜色值
        while (curIdx < txt.length) {
            let sIdx = txt.indexOf("<color=", curIdx);
            if (sIdx < 0) break;
            let eIdx = txt.indexOf(">", sIdx);
            if (eIdx <= sIdx + 6) break;
            let closeIdx = txt.indexOf("</c", eIdx);
            if (closeIdx < 0) break;
            let colorTxt = txt.substring(sIdx + 1, eIdx);
            let params: any = colorTxt.split(" ");
            if (params.length != 2) {
                curIdx = closeIdx;
                continue;
            }
            params = params[1].split("=");
            if (params[0] != "id") {
                curIdx = closeIdx;
                continue;
            }
            let colorId = parseInt(params[1]);
            if (!colorId) {
                curIdx = closeIdx;
                continue;
            }
            let colorInfo = ChatUtils.getSceneColorInfo(colorId);
            let result = `<color=${colorInfo.color}>`;
            txt = txt.substring(0, sIdx) + result + txt.substring(eIdx + 1);
            curIdx = sIdx + result.length;
        }
        return txt;
    }

    /**解析聊天字符 */
    static parseText(info: icmsg.ChatSendRsp) {
        let text = info.content
        let result = text.match(/#\d+#/g)
        // console.log("result", result)
        if (result) {
            for (let index = 0; index < result.length; index++) {
                const id = result[index];
                const icon = this.getFaceById(id)
                if (icon) {
                    text = text.replace(id, `<img src=\'${icon}\' />`)
                }
            }
        }
        // if (info.equips.length > 0) {
        //     for (let index = 0; index < info.equips.length; index++) {
        //         const equip = info.equips[index];
        //         text = text.replace(`{@equip${index}}`, JSON.stringify(equip))
        //     }
        // }
        // let headText = ""
        // switch (info.channel) {
        //     case ChatChannel.SYS:
        //         headText = ChannelText.SYS
        //         break
        //     default:
        //         break
        // }
        // if (info.channel != ChatChannel.SYS && info.channel != ChatChannel.PRIVATE) {
        //     headText = `${headText}<color=magenta>[${info.playerName}]</c>`
        // }
        // text = headText + text
        return text
    }


    /**解析GM聊天字符 符号 */
    static parseGMText(msg: string) {
        let text = msg;
        let result = text.match(/#\d+#/g)
        // console.log("result", result)
        if (result) {
            for (let index = 0; index < result.length; index++) {
                const id = result[index];
                const icon = this.getFaceById(id)
                if (icon) {
                    text = text.replace(id, ` <img src=\'${icon}\' /> `)
                }
            }
        }
        return text
    }

    static changeString(data: any) {
        let newTab = {}
        for (const key in data) {
            const ele = data[key];
            if (typeof (ele) != "function") {
                if (typeof (ele) == "object") {
                    newTab[key] = this.changeString(ele)
                } else {
                    newTab[key] = ele
                }
            }
        }
        return newTab
    }
    /**根据id获取表情 */
    static getFaceById(id) {
        if (!this.chatModel._FaceConfig) {
            this.chatModel._FaceConfig = {}
            for (let index = 0; index < this.chatModel.FaceConfig.length; index++) {
                const element = this.chatModel.FaceConfig[index];
                this.chatModel._FaceConfig[element.id] = element.icon
            }
        }
        return this.chatModel._FaceConfig[id]
    }

    /**
     * 进行字符过滤
     * @param input
     * @return 
     */
    static filter(input: string): string {
        input = this.replaceTag(input);
        input = this.replaceSlash(input);
        return input;
    }

    /**
     * 过滤转义字符
     * @param input
     * @return 
     */
    static replaceSlash(input: string): string {
        input = input.replace(/\n/g, "\\n");
        input = input.replace(/\r/g, "\\r");
        input = input.replace(/\t/g, "\\t");
        return input;
    }

    /**  
         *   
         * 基本功能：替换标记以正常显示  
         * @param input  
         * @return String  
         */
    static replaceTag(input: string): string {
        if (!this.hasSpecialChars(input)) {
            return input;
        }
        let filtered: string = "";
        let c: string = "";
        for (let i = 0; i <= input.length - 1; i++) {
            c = input.charAt(i);
            switch (c) {
                case '<':
                    filtered += "&lt;";
                    break;
                case '>':
                    filtered += "&gt;";
                    break;
                case '"':
                    filtered += "&quot;";
                    break;
                case '&':
                    filtered += "&amp;";
                    break;
                default:
                    filtered += c;
            }

        }
        return filtered;
    }

    /**  
     *   
     * 基本功能：判断标记是否存在  
     *   
     * @param input  
     * @return boolean  
     */
    static hasSpecialChars(input: string): Boolean {
        let flag: Boolean = false;
        if ((input != null) && (input.length > 0)) {
            let c: string;
            for (let i = 0; i <= input.length - 1; i++) {
                c = input.charAt(i);
                switch (c) {
                    case '>':
                        flag = true;
                        break;
                    case '<':
                        flag = true;
                        break;
                    case '"':
                        flag = true;
                        break;
                    case '&':
                        flag = true;
                        break;
                }
                if (flag) break;
            }
        }
        return flag;
    }

    /**
     * 发送道具分享到聊天框
     * @param item 道具数据
     */
    static sendShareItem(item: BagItem) {
        let cfg = BagUtils.getConfigById(item.itemId)
        let text = `${cfg.name}`
        let handle = ""
        if (item.type == BagType.ITEM || item.type == BagType.JEWEL) {
            handle = "itemClick"
            text = `${text}`
        } else {
            let equipInBagItem = EquipUtils.getEquipData(item.series)
            if (equipInBagItem) {
                handle = "equipClick"
            } else {
                handle = "itemClick"
            }

        }
        let colorInfo = ChatUtils.getPanelColorInfo(cfg.defaultColor)
        let param = `${item.series}`
        let linkStr;
        if (cfg.defaultColor == ColorType.Gold) {
            linkStr = `<outline width=2 color=#c36c06><color=${colorInfo.color} id=${cfg.defaultColor}><on click='${handle}' param='{${param}}'>[${text}]</on></c></outline>`
        } else {
            linkStr = `<color=${colorInfo.color} id=${cfg.defaultColor}><on click='${handle}' param='{${param}}'>[${text}]</on></c>`
        }
        let panel = gdk.panel.get(PanelId.Chat)
        if (panel) {
            let ctrl = panel.getComponent(ChatViewCtrl);
            ctrl.switchFunc(null, 0);
            gdk.e.emit(ChatEvent.INPUT_TEXT_INFO, linkStr)
            return
        }
        gdk.panel.setArgs(PanelId.Chat, 0);
        gdk.panel.open(PanelId.Chat, () => {
            gdk.e.emit(ChatEvent.INPUT_TEXT_INFO, linkStr)
        })
    }

    /**删除屏蔽列表中的聊天信息 */
    static removeChatInfo() {
        this._removeChatFromArray(this.chatModel.WorldMessages)

        gdk.e.emit(ChatEvent.UPDATE_CHAT_LIST)
    }

    /**删除屏蔽列表中的项 */
    static _removeChatFromArray(arr: Array<icmsg.ChatSendRsp>) {
        let blacIdList = this.friendModel.backIdList
        let index = 0
        while (index < arr.length) {
            const element = arr[index];
            let rId = element.playerId.toLocaleString()
            if (blacIdList[rId]) {
                arr.splice(index, 1)
            } else {
                index++
            }
        }
    }

    /**添加私聊玩家对象 
     * 如果已存在就置顶
    */
    static addChatPlayer(id: number, name: string, head?: number, frame?: number, level?: number): PrivatePlayer {
        let pId = id.toLocaleString()
        let recents = this.chatModel.recentPlayers
        for (let index = 0; index < recents.length; index++) {
            const element = recents[index];
            let rId = element.id.toLocaleString()
            if (pId == rId) {
                recents.splice(index, 1)
                recents.splice(0, 0, element)
                return element
            }
        }
        let player: PrivatePlayer = {
            id: id,
            name: name,
            head: head,
            frame: frame,
            level: level
        }
        recents.splice(0, 0, player)
        if (recents.length > 50) {
            recents.splice(50, 1)
        }
        return player
    }

    /**
     * 检查是否包含敏感词
     */
    static hasMaskWord(input: string): boolean {
        if (!input) return false;
        return !!MaskWordUtils.check(input);
    }

    /**
     * 更新mini聊天窗口显示隐藏状态
     * @param v 
     */
    static updateMiniChatPanel(v: boolean) {
        let chatNode = gdk.panel.get(PanelId.MiniChat);
        if (chatNode) {
            let chatCtrl = chatNode.getComponent(MiniChatCtrl);
            if (chatCtrl) {
                chatCtrl.setVisible(v);
            }
        }
    }
}