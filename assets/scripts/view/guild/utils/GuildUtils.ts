import ConfigManager from '../../../common/managers/ConfigManager';
import FootHoldModel from '../ctrl/footHold/FootHoldModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildModel, { GuildMemberLocal, GuildTitle } from '../model/GuildModel';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import RoleModel from '../../../common/models/RoleModel';
import SiegeModel from '../ctrl/siege/SiegeModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import {
    GlobalCfg,
    Guild_accessCfg,
    Guild_globalCfg,
    Guild_iconCfg
    } from '../../../a/config';
import { GuildEventId } from '../enum/GuildEventId';

export default class GuildUtils {

    static get guildModel(): GuildModel { return ModelManager.get(GuildModel); }
    static get roleModel(): RoleModel { return ModelManager.get(RoleModel); }
    static get footHoldModel(): FootHoldModel { return ModelManager.get(FootHoldModel); }

    /**开启等级 */
    static getOpenLv() {
        return ConfigManager.getItemById(GlobalCfg, "guild_globals").value[0]
    }

    /**最多人数 */
    static getMaxNum() {
        return ConfigManager.getItemById(GlobalCfg, "guild_globals").value[1]
    }

    /**创建消耗 */
    static getCreateCost() {
        return ConfigManager.getItemById(Guild_globalCfg, "create_cost").value[1]
    }

    /**改名消耗 */
    static getChangeNameCost() {
        return ConfigManager.getItemById(GlobalCfg, "guild_globals").value[2]
    }

    /**入会最低等级限制 */
    static getJoinMinLv() {
        return ConfigManager.getItemById(GlobalCfg, "guild_globals").value[4]
    }

    /**创建公会需要的vip等级 */
    static getCreateNeedVipLv() {
        return ConfigManager.getItemById(GlobalCfg, "guild_globals").value[5]
    }

    /**是否会长*/
    static isPresident(playerId) {
        if (!this.guildModel.guildDetail) {
            return false
        }

        let member = this.getMemberInfo(playerId)
        if (member) {
            return member.position == GuildTitle.President
        }
    }


    /**是否副会长 */
    static isVicePresident(playerId) {
        if (!this.guildModel.guildDetail) {
            return false
        }
        let member = this.getMemberInfo(playerId)
        if (member) {
            return member.position == GuildTitle.VicePresident
        }
    }

    /**是否战斗队长 */
    static isTeamLeader(playerId) {
        if (!this.guildModel.guildDetail) {
            return false
        }
        let member = this.getMemberInfo(playerId)
        if (member) {
            return member.position == GuildTitle.TeamLeader
        }
    }

    /**是否普通成员 */
    static isNomalMember(playerId) {
        return !this.isPresident(playerId) && !this.isVicePresident(playerId)
    }


    /**是否会长满员  presidents  第一个会长，后面是两个会长的信息（如果有）*/
    static isFullPresident() {
        if (!this.guildModel.guildDetail) {
            return false
        }
        let count = 0
        let members = this.guildModel.guildDetail.members
        for (let i = 0; i < members.length; i++) {
            if (members[i].position == GuildTitle.VicePresident) {
                count++
            }
        }
        if (count >= 2) {
            return true
        }
        return false
    }

    /**战斗队长是否 满人 */
    static isFullTeamLeader() {
        if (!this.guildModel.guildDetail) {
            return false
        }

        let count = 0
        let members = this.guildModel.guildDetail.members
        for (let i = 0; i < members.length; i++) {
            if (members[i].position == GuildTitle.TeamLeader) {
                count++
            }
        }
        let captain = ConfigManager.getItemById(Guild_globalCfg, "captain").value[0]
        if (count >= captain) {
            return true
        }
        return false
    }

    /**公会成员职位 */
    static getGuildPosition(playerId) {
        let member = this.getMemberInfo(playerId)
        if (member) {
            return member.position
        }
        return GuildTitle.Normal
    }

    /**更新公会成员信息 */
    static updateGuildPresident(playerId, position) {
        if (!this.guildModel.guildDetail) {
            return false
        }
        let members = this.guildModel.guildDetail.members
        let newMembers: GuildMemberLocal[] = []
        for (let i = 0; i < members.length; i++) {
            if (members[i].id == playerId) {
                members[i].position = position
            }
        }
        gdk.e.emit(GuildEventId.UPDATE_GUILD_MEMBERS)
    }

    /**获得在线状态 */
    static getOnLineState(logoutTime) {
        let str = ""
        if (logoutTime == 0) {
            str = "在线"
        } else {
            let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
            let time = curTime - logoutTime
            if (time <= 60) {
                return "1分钟前"
            } else if (time > 60 && time <= 60 * 60) {
                return `${Math.floor(time / 60)}分钟前`
            } else if (time > 60 * 60 && time <= 60 * 60 * 24) {
                return `${Math.floor(time / (60 * 60))}小时前`
            } else if (time > 60 * 60 * 24) {
                return `${Math.min(7, Math.floor(time / (60 * 60 * 24)))}天前`
            }
        }
        return str
    }

    /**公会成员信息 */
    static getMemberInfo(playerId) {
        if (!this.guildModel.guildDetail) {
            return null
        }
        let members = this.guildModel.guildDetail.members
        for (let i = 0; i < members.length; i++) {
            if (members[i].id == playerId) {
                return members[i]
            }
        }
        return null
    }

    /**公会成员信息 */
    static getMemberInfoByName(name) {
        let members = this.guildModel.guildDetail.members
        for (let i = 0; i < members.length; i++) {
            if (members[i].name == name) {
                return members[i]
            }
        }
        return null
    }

    static getIcon(id) {
        let cfg = ConfigManager.getItemById(Guild_iconCfg, id)
        if (!cfg) {
            return
        }
        return `icon/guild/gh_huizhang${cfg.skin}`
    }

    /**获取玩家公会信息 */
    static async getGuildInfo(): Promise<icmsg.GuildInfo> {
        return new Promise((resolve, reject) => {
            let guildList = this.guildModel.guildList
            let self = this
            if (guildList.length == 0) {
                let msg = new icmsg.GuildListReq()
                NetManager.send(msg, (data: icmsg.GuildListRsp) => {
                    self.guildModel.guildList = data.list
                    for (let i = 0; i < data.list.length; i++) {
                        if (data.list[i].id == self.roleModel.guildId) {
                            return resolve(data.list[i]);
                        }
                    }
                    return resolve(null);
                })
            }
            else {
                for (let i = 0; i < guildList.length; i++) {
                    if (guildList[i].id == self.roleModel.guildId) {
                        return resolve(guildList[i]);
                    }
                }
                return resolve(null);
            }

        });
    }

    /**活动结束时间 */
    static getSthwarEndTime() {
        let sthWarTime = ConfigManager.getItemById(GlobalCfg, "guild_sth_war").value;
        let nowDate = new Date(GlobalUtil.getServerTime())
        let day = nowDate.getDay()//获取当前星期X(0-6,0代表星期天)
        let firstDay = sthWarTime[1]
        let secondDay = sthWarTime[3]
        let disDay = 0
        if (day <= firstDay) {
            disDay = firstDay - day
        } else {
            disDay = secondDay - day
        }
        let curTime = Math.floor(GlobalUtil.getServerTime() / 1000)
        let zeroTime = TimerUtils.getTomZerohour(curTime)
        let time = (zeroTime - curTime) + 60 * 60 * 24 * disDay
        return time
    }

    /**是否已经驻扎 */
    static isHoldCamp(): boolean {
        if (this.guildModel.guildCamp) {
            let camps = this.guildModel.guildCamp.campers
            for (let i = 0; i < camps.length; i++) {
                if (camps[i].name == this.roleModel.name) {
                    return true
                }
            }
        }
        return false
    }

    /**成员职位 图片名称 */
    static getMemberTitlePath(title) {
        let path = ''
        switch (title) {
            case GuildTitle.President:
                path = "gh_huizhang"
                break
            case GuildTitle.VicePresident:
                path = "gh_fuhuizhang"
                break
            case GuildTitle.TeamLeader:
                path = "gh_zhandouduizhang"
                break
            default:
                path = "gh_chengyuan"
                break
        }
        return path
    }


    /**是否有相关权限
     * 关联 GuildAccess类型
     */
    static isCanOperate(playerId, accessType) {
        let member = this.getMemberInfo(playerId)
        if (member) {
            let cfg = ConfigManager.getItemById(Guild_accessCfg, accessType)
            if (!cfg) return false
            return member.position >= cfg.position
        }
        return false
    }

    static clearGuildData() {
        this.roleModel.guildId = 0
        this.roleModel.guildTitle = 0
        this.guildModel.guildList = []
        this.guildModel.guildCamp = null
        this.guildModel.applyList = []
        this.guildModel.guildDetail = null

        this.footHoldModel.curMapData = null
        this.footHoldModel.guildMapData = null
        this.footHoldModel.globalMapData = null

        ModelManager.get(SiegeModel).isActivityOpen = false
    }
}