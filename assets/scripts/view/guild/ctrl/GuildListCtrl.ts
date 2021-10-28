import ChatUtils from '../../chat/utils/ChatUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildModel from '../model/GuildModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import { Guild_lvCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-24 14:35:58
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildListCtrl")
export default class GuildListCtrl extends gdk.BasePanel {

    @property(cc.EditBox)
    InputBox: cc.EditBox = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    guildListItem: cc.Prefab = null

    @property(cc.Node)
    btnCreate: cc.Node = null

    @property(cc.Node)
    btnRefresh: cc.Node = null

    @property(cc.Node)
    btnClearSearch: cc.Node = null

    @property(cc.Node)
    noTip: cc.Node = null

    list: ListView = null;

    guildList: Array<icmsg.GuildInfo> = []

    get model() { return ModelManager.get(GuildModel); }

    onLoad() {

    }

    start() {

    }

    onEnable() {
        let args = gdk.panel.getArgs(PanelId.GuildList)
        if (args) {
            let isShow = args[0]
            this.btnCreate.active = isShow
            this.btnRefresh.active = isShow
        }
        let msg = new icmsg.GuildListReq()
        NetManager.send(msg, (data: icmsg.GuildListRsp) => {
            this.model.guildList = this.sortGuildList(data.list)
            this.updateGuildList()
        })
    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    onDestroy() {

    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.guildListItem,
            cb_host: this,
            async: true,
            gap_y: 10,
            direction: ListViewDir.Vertical,
        })
    }

    updateGuildList() {
        this._initListView()
        if (this.InputBox.string != "" && this.model.guildList.length == 0) {
            this.noTip.active = true
            this.list.set_data([])
            return
        }
        this.noTip.active = false

        gdk.Timer.once(50, this, () => {
            this.list.set_data(this.model.guildList)
        })
    }

    createGuildFunc() {
        gdk.panel.open(PanelId.GuildCreate)
    }

    hideBtnClearSearch() {
        this.btnClearSearch.active = false
        this.InputBox.string = ""
        this.InputBox.focus()
    }

    searchFunc() {
        let text = ChatUtils.filter(this.InputBox.string)
        if (text == "") {
            gdk.GUIManager.showMessage(gdk.i18n.t("i18n:GUILD_TIP5"))
            return
        }
        this.btnClearSearch.active = true
        let msg = new icmsg.GuildQueryReq()
        msg.name = this.InputBox.string
        NetManager.send(msg, (data: icmsg.GuildQueryRsp) => {
            this.model.guildList = this.sortGuildList(data.info)
            this.updateGuildList()
        })
    }

    refreshFunc() {
        let msg = new icmsg.GuildListReq()
        NetManager.send(msg, (data: icmsg.GuildListRsp) => {
            this.model.guildList = this.sortGuildList(data.list)
            this.updateGuildList()
        })
    }

    sortGuildList(list) {
        let newlist = []
        let list1 = [] //不能加入的公会
        let list2 = []//有空位可加入的公会
        for (let i = 0; i < list.length; i++) {
            let cfg = ConfigManager.getItemById(Guild_lvCfg, list[i].level)
            if (cfg.number - list[i].num > 0) {
                list2.push(list[i])
            } else {
                list1.push(list[i])
            }
        }

        GlobalUtil.sortArray(list1, (a: any, b: any) => {
            return b.level - a.level
        })

        // 排序规则 ：等级高---已有人数多
        GlobalUtil.sortArray(list2, (a: any, b: any) => {
            if (a.level == b.level) {
                if (a.num == b.num) {
                    return parseInt((a.id + "").slice(4, 9)) - parseInt((b.id + "").slice(4, 9))
                } else {
                    return b.num - a.num
                }
            } else {
                return b.level - a.level
            }
        })
        newlist = list2.concat(list1)
        return newlist;
    }

    onRankBtnClick() {
        gdk.panel.open(PanelId.GuildListRankView);
    }
}