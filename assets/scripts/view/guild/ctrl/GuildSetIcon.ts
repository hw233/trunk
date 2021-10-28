import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildModel from '../model/GuildModel';
import GuildUtils from '../utils/GuildUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import { Guild_iconCfg } from '../../../a/config';
import { GuildEventId } from '../enum/GuildEventId';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-24 14:47:00
 */
const { ccclass, property, menu } = cc._decorator;

export type GuildIconType = {
    cfg: Guild_iconCfg,
    isSelect: boolean,
}

@ccclass
@menu("qszc/view/guild/GuildSetIcon")
export default class GuildSetIcon extends gdk.BasePanel {

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Node)
    frame: cc.Node = null;

    @property(cc.Node)
    bottom: cc.Node = null;

    @property(cc.Node)
    selectBtns: Array<cc.Node> = [];

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    guildIconItem: cc.Prefab = null

    list: ListView = null;

    curIndex: number = -1

    isCheck = false

    get model() { return ModelManager.get(GuildModel); }

    onLoad() {

    }

    start() {

    }

    onEnable() {
        if (this.model.guildCamp) {
            this.model.selectIcon = this.model.guildDetail.info.icon
            this.model.selectFrame = this.model.guildDetail.info.frame
            this.model.selectBottom = this.model.guildDetail.info.bottom
        }
        this.selectType(null, 0)
    }

    onDisable() {
        gdk.e.targetOff(this)

        //创建公会  关闭恢复默认
        if (!this.isCheck) {
            this.model.selectIcon = 1
            this.model.selectFrame = 2
            this.model.selectBottom = 3
        }
    }

    onDestroy() {
        if (this.list) {
            this.list.destroy()
        }
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.guildIconItem,
            cb_host: this,
            async: true,
            column: 4,
            direction: ListViewDir.Vertical,
        })
        this.list.onClick.on(this._clickItem, this)
    }

    _clickItem(data: GuildIconType, index) {
        if (data.cfg.type == 1) {
            this.model.selectIcon = data.cfg.id
        } else if (data.cfg.type == 2) {
            this.model.selectFrame = data.cfg.id
        } else {
            this.model.selectBottom = data.cfg.id
        }

        let cfgs = ConfigManager.getItemsByField(Guild_iconCfg, "type", this.curIndex + 1)
        for (let i = 0; i < cfgs.length; i++) {
            let info: GuildIconType = {
                cfg: cfgs[i],
                isSelect: false
            }
            this.list.refresh_item(i, info)
        }

        data.isSelect = true
        this.list.refresh_item(index, data)
    }
    selectType(e, utype) {
        utype = parseInt(utype)
        if (this.curIndex != utype) {
            this.curIndex = utype
            for (let idx = 0; idx < this.selectBtns.length; idx++) {
                const element = this.selectBtns[idx];
                element.getChildByName("on").active = idx == this.curIndex
            }
            this._initListView()
            let cfgs = ConfigManager.getItemsByField(Guild_iconCfg, "type", utype + 1)
            let selectId = this.model.selectIcon
            if (utype + 1 == 1) {
                selectId = this.model.selectIcon
            } else if (utype + 1 == 2) {
                selectId = this.model.selectFrame
            } else {
                selectId = this.model.selectBottom
            }
            let list = []
            for (let i = 0; i < cfgs.length; i++) {
                let isSelect = false
                if (cfgs[i].id == selectId) {
                    isSelect = true
                }
                let info: GuildIconType = {
                    cfg: cfgs[i],
                    isSelect: isSelect
                }
                list.push(info)
            }
            this.list.set_data(list)
        }
    }

    @gdk.binding("model.selectIcon")
    updateIcon() {
        GlobalUtil.setSpriteIcon(this.node, this.icon, GuildUtils.getIcon(this.model.selectIcon))
    }

    @gdk.binding("model.selectFrame")
    updateFrame() {
        GlobalUtil.setSpriteIcon(this.node, this.frame, GuildUtils.getIcon(this.model.selectFrame))
    }

    @gdk.binding("model.selectBottom")
    updateBottom() {
        GlobalUtil.setSpriteIcon(this.node, this.bottom, GuildUtils.getIcon(this.model.selectBottom))
    }

    setFunc() {
        if (this.model.guildCamp) {
            let msg = new icmsg.GuildSetIconReq()
            msg.icon = this.model.selectIcon
            msg.frame = this.model.selectFrame
            msg.bottom = this.model.selectBottom
            let self = this
            NetManager.send(msg, (data: icmsg.GuildSetIconRsp) => {
                self.model.guildCamp.guild.icon = data.icon
                self.model.guildCamp.guild.frame = data.frame
                self.model.guildCamp.guild.bottom = data.bottom
                self.model.guildCamp = this.model.guildCamp

                self.model.guildDetail.info.icon = data.icon
                self.model.guildDetail.info.frame = data.frame
                self.model.guildDetail.info.bottom = data.bottom
                self.model.guildDetail = this.model.guildDetail
                gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP8"))
                this.close()
            })
        } else {
            this.isCheck = true
            this.close()
        }
    }
}