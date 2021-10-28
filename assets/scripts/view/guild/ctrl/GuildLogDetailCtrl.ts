import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildModel, { GuildMemberLocal } from '../model/GuildModel';
import GuildUtils from '../utils/GuildUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import StringUtils from '../../../common/utils/StringUtils';
import { GlobalCfg, Guild_globalCfg, Guild_logCfg } from '../../../a/config';
import { GuildEventId } from '../enum/GuildEventId';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-24 18:12:47
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildLogDetailCtrl")
export default class GuildLogDetailCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    logDetailItem: cc.Prefab = null

    @property(cc.Label)
    descLab: cc.Label = null

    @property(cc.Label)
    numLab: cc.Label = null

    @property(cc.Node)
    btnRemind: cc.Node = null

    list: ListView = null;

    get guildModel() { return ModelManager.get(GuildModel); }
    get roleModel() { return ModelManager.get(RoleModel); }
    get serverModel() { return ModelManager.get(ServerModel); }

    _curType: number = 0

    onEnable() {
        let args = this.args
        if (args && args.length) {
            this._curType = args[0]
        }
        gdk.e.on(GuildEventId.UPDATE_GUILD_MEMBERS, this._updateDetailView, this)
        gdk.e.on(GuildEventId.REMOVE_GUILD_MEMBER, this._updateDetailView, this)
        this._updateDetailView()
        this.updateRemindBtn(0, true)
    }

    onDisable() {
        gdk.e.targetOff(this)
        this.unschedule(this.updateRemindBtn);
    }

    _initListView() {
        if (this.list) {
            return
        }

        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.logDetailItem,
            cb_host: this,
            async: true,
            gap_y: 4,
            direction: ListViewDir.Vertical,
        })
    }

    _updateDetailView() {
        this._initListView()
        let datas = this.guildModel.guildDetail.members
        GlobalUtil.sortArray(datas, this.sortPositionFunc)
        let newDatas = []
        datas.forEach(element => {
            newDatas.push({ type: this._curType, info: element })
        });
        this.list.set_data(newDatas, false)

        let logCfg = ConfigManager.getItemByField(Guild_logCfg, "type", this._curType)
        this.descLab.string = `${logCfg.title}:`
        this.numLab.string = this._getNumValue()
    }


    _getNumValue() {
        let datas = this.guildModel.guildDetail.members
        let count = 0
        switch (this._curType) {
            case 1:
                datas.forEach(element => {
                    if (element.fightNum > 0) {
                        count += 1
                    }
                });
                break
            case 3:
                datas.forEach(element => {
                    if (!element.signFlag) {
                        count += 1
                    }
                });
                break
            case 4:
                let guild_boss_times = ConfigManager.getItemById(GlobalCfg, "guild_boss_times").value[0]
                datas.forEach(element => {
                    if (guild_boss_times - element.bossNum > 0) {
                        count += 1
                    }
                });
                break
        }
        return `${count}/${datas.length}`
    }

    /**职位排序 */
    sortPositionFunc(a: any, b: any) {
        let infoA = <GuildMemberLocal>a
        let infoB = <GuildMemberLocal>b
        if (infoA.position == infoB.position) {
            if (infoA.fightNum == infoB.fightNum) {
                if (infoA.logoutTime == infoB.logoutTime) {
                    if (infoA.level == infoB.level) {
                        return parseInt((infoA.id + "").slice(4, 10)) - parseInt((infoB.id + "").slice(4, 10))
                    } else {
                        return infoB.level - infoA.level
                    }
                } else {
                    if ((infoA.logoutTime == 0 && infoB.logoutTime != 0) ||
                        (infoB.logoutTime == 0 && infoA.logoutTime != 0)) {
                        return infoA.logoutTime - infoB.logoutTime
                    } else {
                        return infoB.logoutTime - infoA.logoutTime
                    }
                }
            } else {
                return infoB.fightNum - infoA.fightNum
            }
        }
        return infoB.position - infoA.position
    }


    onRemindFunc() {
        if (!GuildUtils.isPresident(this.roleModel.id)) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP28"))
            return
        }

        let msg = new icmsg.GuildRemindReq()
        msg.type = this._curType
        NetManager.send(msg, (rsp: icmsg.GuildRemindRsp) => {
            let remindCfgTime = ConfigManager.getItemById(Guild_globalCfg, "remind").value[0]
            if (rsp.time > 0) {
                gdk.gui.showMessage(StringUtils.format(gdk.i18n.t("i18n:GUILD_TIP29"), rsp.time))//`休息一下，${rsp.time}秒后再尝试提醒`
                remindCfgTime = rsp.time
            } else {
                gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP30"))
            }
            this.guildModel.remindTime[rsp.type] = remindCfgTime + Math.floor(this.serverModel.serverTime / 1000)
            this.updateRemindBtn(0, true)
        })
    }

    updateRemindBtn(dt: number, isAddSchedule?: boolean) {
        let text = this.btnRemind.getComponentInChildren(cc.Label);
        let tipTime = this.guildModel.remindTime[this._curType] ? this.guildModel.remindTime[this._curType] : 0
        let time = Math.floor(this.serverModel.serverTime / 1000) - tipTime
        if (time > 0) {
            this.unschedule(this.updateRemindBtn);
            text.string = gdk.i18n.t("i18n:GUILD_TIP31");
            GlobalUtil.setAllNodeGray(this.btnRemind, 0)
        } else {
            GlobalUtil.setAllNodeGray(this.btnRemind, 1)
            text.string = gdk.i18n.t("i18n:GUILD_TIP31") + `(${tipTime - Math.floor(this.serverModel.serverTime / 1000)}s)`;
            if (isAddSchedule) {
                this.schedule(this.updateRemindBtn, 1);
            }
        }
    }
}