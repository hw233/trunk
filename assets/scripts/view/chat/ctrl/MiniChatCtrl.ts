import ChatModel from '../model/ChatModel';
import FootHoldModel from '../../guild/ctrl/footHold/FootHoldModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildModel from '../../guild/model/GuildModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import MiniChatItemCtrl from './MiniChatItemCtrl';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RelicModel from '../../relic/model/RelicModel';
import RoleModel from '../../../common/models/RoleModel';
import { ChatChannel } from '../enum/ChatChannel';
import { ChatEvent } from '../enum/ChatEvent';

/** 
 * @Description: mini聊天窗口
 * @Author: luoyong 
 * @Date: 2020-06-24 15:37:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-07-05 10:29:14
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/chat/MiniChatCtrl")
export default class MiniChatCtrl extends cc.Component {

    @property({ tooltip: "初始位置" })
    initPosition: cc.Vec2 = cc.v2(0, -185);

    @property(cc.Node)
    chatPanel: cc.Node = null
    @property(cc.Node)
    contents: cc.Node[] = []

    @property(cc.Node)
    moveBtn: cc.Node = null
    @property(cc.Node)
    clickBtn: cc.Node = null

    @property(cc.Node)
    bountyBtn: cc.Node = null

    @property(cc.Node)
    msgNode: cc.Node = null
    @property(cc.Node)
    msgLayout: cc.Node = null

    @property(cc.Prefab)
    msgItem: cc.Prefab = null

    @property(cc.Node)
    nothingTips: cc.Node = null
    @property(cc.Label)
    tipLab: cc.Label = null

    @property(cc.Label)
    bountyNumLab: cc.Label = null

    @property(cc.Label)
    bountyNumLab2: cc.Label = null

    @property(cc.Label)
    guildInviteNumLab: cc.Label = null;

    @property(cc.Label)
    guildInviteNumLab2: cc.Label = null;

    @property(cc.Node)
    miniMoveBtn: cc.Node = null

    @property(cc.Node)
    miniShow: cc.Node = null

    @property(cc.Node)
    btnHide: cc.Node = null

    @property(cc.Node)
    relicAtkNotice: cc.Node = null;

    @property(cc.Node)
    relicAtkNotice2: cc.Node = null;

    _oldPosition: cc.Vec2
    _oldContent: cc.Node
    _curSelect: number = 0
    _curChannel: number = 0
    _showStateDef: (gdk.PanelValue | Function)[] = []; // 需显示minichat的窗口定义
    _isHide: boolean = false;   // 是否收缩起来
    _msgBuffer: icmsg.ChatSendRsp[];    // 消息缓冲队列

    get chatModel(): ChatModel { return ModelManager.get(ChatModel); }
    get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    get guildModel(): GuildModel { return ModelManager.get(GuildModel); }
    get relicModel(): RelicModel { return ModelManager.get(RelicModel); }

    _defaultPos: { [index: number]: cc.Vec2 } = {}

    onLoad() {
        this._showStateDef = [
            PanelId.PveReady,
            PanelId.MainPanel,
            PanelId.PveScene,
            PanelId.PvpScene,
            PanelId.GuildMain,
            PanelId.GuildFootHoldView,
            PanelId.GlobalFootHoldView,
            PanelId.RelicMapView,
            PanelId.ExpeditionLayerView,
            PanelId.ExpeditionMainView,
        ];

        this._defaultPos = {
            0: cc.v2(0, -350),//默认位置
            1: cc.v2(0, -450),//主界面
            2: cc.v2(0, 20),//挂机
            3: cc.v2(0, -200),//塔防战斗
            4: cc.v2(0, -185)//卡牌战斗
        };

        this.chatPanel.active = true;
        this.chatPanel.opacity = 0;
        this.nothingTips.active = false;
    }

    onEnable() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;

        let saveLocation = GlobalUtil.getLocal("mini_chat_location");
        if (saveLocation) {
            this.initPosition = saveLocation;
        }

        this._oldPosition = this.chatPanel.getPosition();
        this._oldContent = this.chatPanel.parent;

        this.moveBtn.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.moveBtn.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.moveBtn.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);

        this.miniMoveBtn.on(cc.Node.EventType.TOUCH_MOVE, this._onMiniTouchMove, this);
        this.miniMoveBtn.on(cc.Node.EventType.TOUCH_END, this._onMiniTouchEnd, this);
        this.miniMoveBtn.on(cc.Node.EventType.TOUCH_CANCEL, this._onMiniTouchCancel, this);

        gdk.e.on("popup#Chat#close", this._hideMiniChatRedPoint, this);
        gdk.e.on(ChatEvent.ADD_CHAT_INFO, this._addChatInfo, this);
        gdk.gui.onViewChanged.on(this._onViewChanged, this);
        gdk.gui.onPopupChanged.on(this._updatePanelShowHide, this);
        this._onViewChanged(gdk.gui.getCurrentView());

        if (!this._msgBuffer) {
            this._msgBuffer = [];
            NetManager.send(new icmsg.ChatHistoryReq());
        }
        NetManager.send(new icmsg.BountyListNumReq());
    }

    onDisable() {
        this.moveBtn.targetOff(this);
        this.miniMoveBtn.targetOff(this);
        gdk.Timer.clearAll(this);
        gdk.e.targetOff(this);
        gdk.gui.onViewChanged.targetOff(this);
        gdk.gui.onPopupChanged.targetOff(this);
        gdk.pool.clear('__mini_chat_msg_item__');
        this.unscheduleAllCallbacks();
    }

    _onTouchCancel(touchEvent: cc.Event.EventTouch) {
        this.chatPanel.setPosition(this._oldPosition);
        this.chatPanel.parent = this._oldContent;
        this._updateAlign();
    }

    _onTouchMove(touchEvent: cc.Event.EventTouch) {
        let widget = this.chatPanel.getComponent(cc.Widget);
        if (widget && widget.enabled) {
            widget.enabled = false;
        }
        let camera = cc.Camera.cameras[0];
        let location: cc.Vec2 = camera.getScreenToWorldPoint(touchEvent.getLocation()) as any;
        location.x -= this.moveBtn.width / 2;
        location.y += this.moveBtn.height / 2;
        this.chatPanel.setPosition(this.chatPanel.parent.convertToNodeSpaceAR(location));
    }

    _onTouchEnd(touchEvent: cc.Event.EventTouch) {
        if (this.contents.length == 0) {
            return;
        }
        let camera = cc.Camera.cameras[0];
        let location: cc.Vec2 = camera.getScreenToWorldPoint(touchEvent.getLocation()) as any;
        for (let i = 0; i < this.contents.length; i++) {
            let target = this.contents[i]
            //获取target节点在父容器的包围盒，返回一个矩形对象
            let rect = target.getBoundingBox();
            //使用target容器转换触摸坐标
            let point = target.parent.convertToNodeSpaceAR(location);
            if (rect.contains(point)) {
                // 在目标矩形内，修改节点坐标  
                point = target.convertToNodeSpaceAR(location);
                point.x -= this.moveBtn.width / 2
                point.y += this.moveBtn.height / 2
                if (i == 0) {
                    point.x = 0
                } else {
                    point.x = -this.chatPanel.width
                }
                this._oldPosition = point
                // GlobalUtil.setLocal("mini_chat_location", point)
                this._saveLocalPos(point)
                this._oldContent = target
                this.chatPanel.setPosition(point);
                // 修改父节点
                this.chatPanel.parent = target;
                this._updateAlign();
                return;
            }
        }
        // 不在矩形中，还原节点位置
        this._onTouchCancel(null);
    }

    _onMiniTouchCancel(touchEvent: cc.Event.EventTouch) {
        this.miniShow.setPosition(this._oldPosition);
        this.miniShow.parent = this._oldContent;
        // this._updateAlign();
    }

    _onMiniTouchMove(touchEvent: cc.Event.EventTouch) {
        let widget = this.miniShow.getComponent(cc.Widget);
        if (widget && widget.enabled) {
            widget.enabled = false;
        }
        let camera = cc.Camera.cameras[0];
        let location: cc.Vec2 = camera.getScreenToWorldPoint(touchEvent.getLocation()) as any;
        location.x -= this.moveBtn.width / 2;
        location.y += this.moveBtn.height / 2;
        this.miniShow.setPosition(this.chatPanel.parent.convertToNodeSpaceAR(location));
    }

    _onMiniTouchEnd(touchEvent: cc.Event.EventTouch) {
        if (this.contents.length == 0) {
            return;
        }
        let camera = cc.Camera.cameras[0];
        let location: cc.Vec2 = camera.getScreenToWorldPoint(touchEvent.getLocation()) as any;
        for (let i = 0; i < this.contents.length; i++) {
            let target = this.contents[i]
            //获取target节点在父容器的包围盒，返回一个矩形对象
            let rect = target.getBoundingBox();
            //使用target容器转换触摸坐标
            let point = target.parent.convertToNodeSpaceAR(location);
            if (rect.contains(point)) {
                // 在目标矩形内，修改节点坐标  
                point = target.convertToNodeSpaceAR(location);
                point.x -= this.miniMoveBtn.width / 2
                point.y += this.miniMoveBtn.height / 2
                if (i == 0) {
                    // 左
                    point.x = 0
                } else {
                    // 右
                    point.x = -this.miniShow.width
                }
                this._oldPosition = point
                // GlobalUtil.setLocal("mini_chat_location", point)
                this._saveLocalPos(point)
                this._oldContent = target
                this.miniShow.setPosition(point);
                this.chatPanel.y = this.miniShow.y;
                // 修改父节点
                this.miniShow.parent = target;
                // this._updateAlign();
                return;
            }
        }
        // 不在矩形中，还原节点位置
        this._onMiniTouchCancel(null);
    }

    /**添加聊天信息 */
    _addChatInfo() {
        let showMsgs = this.chatModel.AllMessages;
        let msgsLen = showMsgs.length;
        if (msgsLen > 0) {
            // 添加新收到的消息缓存队列
            this._msgBuffer.push(showMsgs[msgsLen - 1]);
            let n = this._msgBuffer.length;
            if (n == 1 && this.node.activeInHierarchy) {
                // 添加处理循环
                gdk.Timer.frameLoop(1, this, this._addChatInfoLoop);
            } else if (n > 5) {
                // 缓存中最多只保留5条消息
                this._msgBuffer.shift();
            }
        } else if (!this.nothingTips.active) {
            // 没有任何消息
            this._msgBuffer.length = 0;
            this.nothingTips.active = true;
            if (this._curChannel == ChatChannel.GUILD && this.roleModel.guildId == 0) {
                this.tipLab.string = gdk.i18n.t("i18n:CHAT_TIP13");
            } else {
                this.tipLab.string = gdk.i18n.t("i18n:CHAT_TIP14");
            }
        }
    }

    _addChatInfoLoop() {
        if (this._msgBuffer.length <= 0) {
            gdk.Timer.clear(this, this._addChatInfoLoop);
            return;
        }
        // 添加新收到的消息
        let msg = this._msgBuffer.shift();
        let item: cc.Node = gdk.pool.get('__mini_chat_msg_item__');
        if (!item) {
            item = cc.instantiate(this.msgItem);
        }
        this.msgLayout.addChild(item);
        let itemCtrl = item.getComponent(MiniChatItemCtrl);
        itemCtrl.updateView(msg);

        // 更新布局
        let h = this.msgNode.height;
        let l = this.msgLayout.getComponent(cc.Layout);
        l.updateLayout();
        if (l.node.height >= h - 10) {
            this.msgLayout.y = -h;
            this.msgLayout.setAnchorPoint(0, 0);
            // 移除超出的消息
            let a = this.msgLayout.children;
            while (a.length > 0) {
                let item = a[0];
                if (item.y - item.getBoundingBox().height < h) {
                    break;
                }
                item.removeFromParent();
                gdk.pool.put('__mini_chat_msg_item__', item);
            }
        } else {
            this.msgLayout.y = 0;
            this.msgLayout.setAnchorPoint(0, 1);
        }

        if (this.miniShow.active && msg.channel != ChatChannel.SYS) {
            this._showMiniChatRedPoint()
        }
    }

    openChatView() {
        gdk.panel.setArgs(PanelId.Chat, this._curSelect)
        gdk.panel.open(PanelId.Chat)
        this._hideMiniChatRedPoint()
    }

    _showMiniChatRedPoint() {
        let redPoint = this.miniShow.getChildByName('clickNode').getChildByName("chatRedPoint")
        redPoint.active = true
    }

    _hideMiniChatRedPoint() {
        let redPoint = this.miniShow.getChildByName('clickNode').getChildByName("chatRedPoint")
        redPoint.active = false
    }

    @gdk.binding("relicModel.miniChatatkNoticeVisible")
    updateRelicAtkNotice() {
        this.relicAtkNotice.active = this.relicModel.miniChatatkNoticeVisible;
        this.relicAtkNotice2.active = this.relicModel.miniChatatkNoticeVisible;
    }

    @gdk.binding("chatModel.bountyListCount")
    updateBountyListCount() {
        let num = this.chatModel.bountyListCount
        this.bountyNumLab.node.parent.active = num > 0
        this.bountyNumLab2.node.parent.active = num > 0
        if (num > 0) {
            if (num > 99) {
                num = 99
            }
            this.bountyNumLab.string = `${num}`
            this.bountyNumLab2.string = `${num}`
        }
    }

    @gdk.binding("guildModel.guildInvitationList")
    updateGuildInviteCount() {
        let len = this.guildModel.guildInvitationList.length;
        this.guildInviteNumLab.node.parent.active = len > 0
        this.guildInviteNumLab2.node.parent.active = len > 0
        if (len > 0) {
            if (len > 99) {
                len = 99
            }
            this.guildInviteNumLab.string = `${len}`
            this.guildInviteNumLab2.string = `${len}`
        }
    }

    openRelicAtkNoticeView() {
        gdk.panel.open(PanelId.RelicUnderAtkNoticeView);
    }

    openPrivateChat() {
        this.chatModel.privateMsgCount = 0
        JumpUtils.openFriend([3])
    }

    openBountyList() {
        if (!JumpUtils.ifSysOpen(705, true)) {
            return
        }
        gdk.panel.open(PanelId.BountyList)
    }

    setVisible(v: boolean) {
        v = v && this._showStateDef.some((v) => {
            if (typeof v === 'function') {
                return v();
            } else {
                return gdk.panel.isOpenOrOpening(v as any);
            }
        });
        this.chatPanel.opacity = v ? 255 : 0;
        this.moveBtn.active = v;
        this.clickBtn.active = v;
        this.bountyBtn.getComponent(cc.Button).enabled = v
        this.btnHide.getComponent(cc.Button).enabled = v

        if (this.chatPanel.opacity) {
            this._initSetPanelPos()
        }

        if (this._isHide) {
            if (!v) {
                this.miniShow.active = false
            } else {
                this.miniShow.active = true
                let widget = this.chatPanel.getComponent(cc.Widget);
                if (this.chatPanel.parent === this.contents[0]) {
                    widget.isAlignLeft = false
                    this.chatPanel.x = this.chatPanel.x - this.chatPanel.width - 50
                    this.miniShow.anchorX = 0
                    this.miniShow.scaleX = 1
                    this.miniShow.x = 0
                    this.miniShow.y = this.chatPanel.y //- this.btnShow.height / 2
                } else {
                    widget.isAlignRight = false
                    this.chatPanel.x = this.chatPanel.x + this.chatPanel.width + 50
                    this.miniShow.anchorX = 1
                    this.miniShow.scaleX = -1
                    this.miniShow.x = 360 - this.miniShow.width
                    this.miniShow.y = this.chatPanel.y //- this.btnShow.height / 2
                }
            }
        }
    }

    _onViewChanged(node: cc.Node) {
        if (!node) return;
        // 更新显示隐藏状态
        this._updatePanelShowHide();
    }

    // 更新显示或隐藏状态
    _updatePanelShowHide() {
        if (ModelManager.get(FootHoldModel).gatherMode) {
            return
        }
        gdk.Timer.once(100, this, this._updatePanelShowHideLater);
    }

    _updatePanelShowHideLater() {
        if (!cc.isValid(this.node)) return;
        if (!this.node.activeInHierarchy) return;
        this.setVisible(true);
    }

    _initSetPanelPos() {
        let index = 0
        if (gdk.panel.isOpenOrOpening(PanelId.MainPanel)) {
            index = 1
        } else if (gdk.panel.isOpenOrOpening(PanelId.PveReady)) {
            index = 2
        } else if (gdk.panel.isOpenOrOpening(PanelId.PveScene)) {
            index = 3
        } else if (gdk.panel.isOpenOrOpening(PanelId.PvpScene)) {
            index = 4
        }
        let pos = this._defaultPos[index]
        let saveLocation = GlobalUtil.getLocal("mini_chat_location")
        if (saveLocation && saveLocation[index]) {
            this.initPosition = saveLocation[index]
        } else {
            this.initPosition = pos
        }
        this._oldPosition = this.initPosition
        this.chatPanel.setPosition(this.initPosition)
        if (this._oldPosition.x < 0) {
            this._oldContent = this.contents[1]
        } else {
            this._oldContent = this.contents[0]
        }
        this.chatPanel.parent = this._oldContent
        this._updateAlign()

        if (gdk.panel.isOpenOrOpening(PanelId.PveScene) || gdk.panel.isOpenOrOpening(PanelId.PvpScene)) {
            this.hideMiniChat()
        } else {
            if (this.chatModel.miniChatState.other) {
                this.showMiniChat()
            } else {
                this.hideMiniChat()
            }
        }
    }

    _updateAlign() {
        let widget = this.chatPanel.getComponent(cc.Widget);
        let btnWidget = this.miniShow.getComponent(cc.Widget)

        if (this.chatPanel.parent === this.contents[0]) {
            widget.left = 0;
            widget.isAlignLeft = true;
            widget.isAlignRight = false;

            btnWidget.isAlignLeft = true
            btnWidget.isAlignRight = false
            this.btnHide.scaleX = 1
        } else {
            widget.right = 0;
            widget.isAlignLeft = false;
            widget.isAlignRight = true;
            btnWidget.isAlignLeft = false
            btnWidget.isAlignRight = true
            this.btnHide.scaleX = -1
        }
        widget.isAlignBottom = false
        widget.enabled = true;
    }

    _saveLocalPos(point) {
        let index = 0
        if (gdk.panel.isOpenOrOpening(PanelId.MainPanel)) {
            index = 1
        } else if (gdk.panel.isOpenOrOpening(PanelId.PveReady)) {
            index = 2
        } else if (gdk.panel.isOpenOrOpening(PanelId.PveScene)) {
            index = 3
        } else if (gdk.panel.isOpenOrOpening(PanelId.PvpScene)) {
            index = 4
        }
        let saveLocation = GlobalUtil.getLocal("mini_chat_location")
        if (!saveLocation) {
            saveLocation = {}
        }
        saveLocation[index] = point
        GlobalUtil.setLocal("mini_chat_location", saveLocation)
    }


    hideMiniChat() {
        this._isHide = true
        this._setMiniState(false)
        let widget = this.chatPanel.getComponent(cc.Widget)
        widget.enabled = false
        if (this.chatPanel.parent === this.contents[0]) {
            let action = cc.sequence(
                cc.moveTo(0.3, cc.v2(this.chatPanel.x - this.chatPanel.width - 30, this.chatPanel.y)),
                cc.delayTime(0.1),
                cc.callFunc(() => {
                    this.miniShow.active = true
                    this.miniShow.anchorX = 0
                    this.miniShow.scaleX = 1
                    this.miniShow.x = 0
                    this.miniShow.y = this.chatPanel.y
                }, this),
            )
            this.chatPanel.runAction(action)
        } else {
            let action = cc.sequence(
                cc.moveTo(0.3, cc.v2(this.chatPanel.x + this.chatPanel.width + 10, this.chatPanel.y)),
                cc.delayTime(0.1),
                cc.callFunc(() => {
                    this.miniShow.active = true
                    this.miniShow.anchorX = 1
                    this.miniShow.scaleX = -1
                    this.miniShow.x = 360 - this.miniShow.width
                    this.miniShow.y = this.chatPanel.y
                }, this),
            )
            this.chatPanel.runAction(action)
        }
    }

    showMiniChat() {
        this._isHide = false
        this._setMiniState(true)
        JumpUtils.showGuideMask()
        let yPos = this.miniShow.y
        this.chatPanel.y = yPos
        if (this.chatPanel.parent === this.contents[0]) {
            this.miniShow.active = false
            let action = cc.sequence(cc.moveTo(0.3, cc.v2(0, yPos)),
                cc.callFunc(() => {
                    JumpUtils.hideGuideMask()
                }, this))
            this.chatPanel.runAction(action)
        } else {
            this.miniShow.active = false
            let action = cc.sequence(cc.moveTo(0.3, cc.v2(-this.chatPanel.width, yPos)),
                cc.callFunc(() => {
                    JumpUtils.hideGuideMask()
                }, this))
            this.chatPanel.runAction(action)
        }
    }


    _setMiniState(state) {
        this.miniShow.y = this.chatPanel.y
        if (gdk.panel.isOpenOrOpening(PanelId.PveScene) || gdk.panel.isOpenOrOpening(PanelId.PvpScene)) {

        } else {
            this.chatModel.miniChatState.other = state
        }
    }
}
