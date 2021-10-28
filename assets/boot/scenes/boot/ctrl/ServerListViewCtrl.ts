import BGlobalUtil from '../../../common/utils/BGlobalUtil';
import BLoginModel from '../../../common/models/BLoginModel';
import BModelManager from '../../../common/managers/BModelManager';
import BSdkTool from '../../../sdk/BSdkTool';
import BServerModel, { ServerGroupModel, ServerItemModel, ServerPlayerItemModel } from '../../../common/models/BServerModel';
import ButtonSoundId from '../../../configs/ids/BButtonSoundId';
import { ListView, ListViewDir } from '../../../common/widgets/BUiListview';

/** 
 * 服务器列表窗口
 * @Author: sthoo.huang  
 * @Date: 2019-07-22 16:06:36 
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-29 11:05:26
 */

const { ccclass, property, menu } = cc._decorator;

interface ITabItem {
    tabNode: cc.Node,
    normalBg: cc.Node,
    selectBg: cc.Node,
    nameLab: cc.Node,
    group: ServerGroupModel,
    tabIdx: number
};

@ccclass
@menu("qszc/scene/login/ServerListViewCtrl")
export default class ServerListViewCtrl extends gdk.BasePanel {
    @property(cc.Prefab)
    serverItem: cc.Prefab = null;
    @property(cc.Prefab)
    serverTabItem: cc.Prefab = null;
    @property(cc.Prefab)
    serverPlayerItem: cc.Prefab = null

    @property(cc.ScrollView)
    tabScrollView: cc.ScrollView = null;
    @property(cc.Node)
    tabContent: cc.Node = null;

    @property(cc.ScrollView)
    listScrollView: cc.ScrollView = null;
    @property(cc.Node)
    listContent: cc.Node = null;

    private list: ListView = null;
    model: BServerModel;

    tabList: ITabItem[];
    curTab: ITabItem;
    // snodeList: any[];
    // snodeCache: any[];
    onEnable() {
        this.model = BModelManager.get(BServerModel);
        this.tabList = [];
        this.list = new ListView({
            scrollview: this.listScrollView,
            mask: this.listScrollView.node,
            content: this.listContent,
            item_tpl: this.serverItem,
            cb_host: this,
            async: true,
            auto_scrolling: true,
            select_cb: this._selectItem,
            column: 1,
            gap_y: 2,
            direction: ListViewDir.Vertical,
        });
        // 打开超级英雄秘籍（显示所有服务器列表）
        let pwd = '00110001010';
        let code = '';
        [
            'title',
            'statusNode',
        ].forEach((name, idx) => {
            const n = cc.find(name, this.node);
            if (!cc.isValid(n)) {
                return;
            }
            n.on(cc.Node.EventType.TOUCH_END, () => {
                if (this.model.isSupperMan) {
                    return;
                }
                code += idx;
                if (code === pwd) {
                    // 秘籍正确，打开超级模式
                    CC_DEBUG && cc.log("开启秘籍，显示所有服务器列表");
                    this.model.isSupperMan = true;
                    BSdkTool.tool.can_charge = true;
                    BGlobalUtil.httpGet(`${this.model.host}/${BSdkTool.tool.server_list}`, (err: any, content: string) => {
                        if (!cc.isValid(this.node)) return;
                        if (!this.node.active) return;
                        if (!this.node.activeInHierarchy) return;
                        if (!this.model) return;
                        if (!err && content) {
                            this.tabList = null;
                            this.curTab = null;
                            this.model.timeStamp = Date.now();
                            this.model.parseServerList(content);
                        }
                    });
                } else if (!pwd.startsWith(code)) {
                    // 错误重置
                    code = '';
                }
            }, this, true);
        });
        // 获取角色信息
        let m = BModelManager.get(BLoginModel);
        if (cc.js.isString(m.account) && m.account.length > 0) {
            let baseUrl = this.model.playerserverListUrl;
            let url = `${baseUrl}?a=${m.account}&c=${m.channelId}`;
            BGlobalUtil.httpGet(url, (err: any, content: string) => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                if (err) {
                    cc.error(err);
                }
                if (content) {
                    this.model.parsePlayerServerList(content);
                }
                this.updateView();
            });
            return;
        }
        this.updateView();
    }

    onDisable() {
        this.list && this.list.destroy();
        this.list = null;
        this.model = null;
        // 清除秘籍监听
        [
            'title',
            'statusNode',
        ].forEach(name => {
            const n = cc.find(name, this.node);
            if (cc.isValid(n)) {
                n.targetOff(this);
            }
        });
    }

    updateView() {
        if (this.curTab) {
            let tabIdx = this.curTab.tabIdx;
            this.curTab = null;
            this.setTabIdx(tabIdx);
        } else {
            // 角色服务器列表
            let group = this.model.groups[1];
            if (group.servers.length > 0) {
                this.setTabIdx(1);
                return;
            }
            // 推荐服务器列表
            group = this.model.groups[0];
            if (group.servers.length > 0) {
                this.setTabIdx(0);
                return;
            }
            // 服务器列表
            this.setTabIdx(2);
        }
    }

    @gdk.binding('model.groups')
    _serverGroups(groups: Array<ServerGroupModel>) {
        if (!groups || groups.length == 0) {
            return;
        }
        this.initGroup();
        this.updateView();
    }

    createTab(group: ServerGroupModel): ITabItem {
        let tabNode = cc.instantiate(this.serverTabItem);
        let tab: ITabItem = {
            tabNode: tabNode,
            normalBg: tabNode.getChildByName("normalBg") as cc.Node,
            selectBg: tabNode.getChildByName("selectBg") as cc.Node,
            nameLab: tabNode.getChildByName("nameLab") as cc.Node,
            group: group,
            tabIdx: -1
        };
        let nameLab = tabNode.getChildByName("nameLab") as cc.Node;
        nameLab.getComponent(cc.Label).string = group.name;
        tabNode.on(cc.Node.EventType.TOUCH_END, () => {
            gdk.sound.play(
                gdk.Tool.getResIdByNode(this.node),
                ButtonSoundId.click
            );
            this.setTabIdx(tab.tabIdx);
        }, this);
        return tab;
    }

    //初始化分组界面
    initGroup() {
        if (this.tabList && this.tabList.length > 0) {
            return;
        }
        this.tabContent.removeAllChildren();
        let groups = this.model.groups;
        this.tabList = [];
        for (let i = 0; i < groups.length; i++) {
            const group = groups[i];
            let tab = this.createTab(group);
            tab.tabIdx = i;

            let tabNode = tab.tabNode;
            this.tabContent.addChild(tabNode);
            tabNode.y = -3 - i * 103;
            tabNode.x = 3;
            this.tabList[i] = tab;
        }
        this.tabContent.height = groups.length * 103 + 3;
    }

    //选中某一分组
    setTabIdx(tabIdx: number) {
        tabIdx = tabIdx ? tabIdx : 0;
        if (this.curTab && this.curTab.tabIdx == tabIdx) {
            return;
        }
        let tabsList = this.tabList;
        for (let i = 0; i < tabsList.length; i++) {
            const tab = tabsList[i];
            if (i == tabIdx) {
                this.curTab = tab;
                tab.normalBg.active = false;
                tab.selectBg.active = true;
                tab.nameLab.color = new cc.Color().fromHEX('#FFED4D');
                tab.nameLab.getComponent(cc.LabelOutline).enabled = true;
            } else {
                tab.normalBg.active = true;
                tab.selectBg.active = false;
                tab.nameLab.color = new cc.Color().fromHEX('#BF9973');
                tab.nameLab.getComponent(cc.LabelOutline).enabled = false;
            }
        }
        if (this.curTab && this.curTab.group) {
            let datas = [];
            let servers = this.curTab.group.servers as Array<ServerItemModel>;
            for (let i = 0, n = servers.length; i < n; i++) {
                const server = servers[i];
                server.isShowInfo = false;
                if (datas.indexOf(server) == -1) {
                    datas.push(server);
                }
            }
            this.list.clear_items();
            this.list.set_data(datas);
        }
    }

    /** 选中服务器项 */
    _selectItem(data: ServerItemModel, idx: number) {
        gdk.sound.play(
            gdk.Tool.getResIdByNode(this.node),
            ButtonSoundId.click
        );
        if (data instanceof ServerPlayerItemModel) {
            data = data.server;
        } else if (data.players && data.players.length > 0) {
            // 有玩家详情，展示玩家详情
            this.list.clear_select();
            if (data.isShowInfo) {
                // 当前显示角色信息，则移除
                this.list.remove_data(idx + 1, data.players.length);
            } else {
                // 当前隐藏角色信息，则添加
                this.list.insert_data(idx + 1, ...data.players);
            }
            data.isShowInfo = !data.isShowInfo;
            return;
        }
        this.model.current = data;
        this.close(-1);
    }
}