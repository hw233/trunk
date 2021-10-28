import BaseController, { GdkEventArray, NetEventArray } from '../../core/BaseController';
import ConfigManager from '../ConfigManager';
import GlobalUtil from '../../utils/GlobalUtil';
import GuideModel from '../../../guide/model/GuideModel';
import HeroModel from '../../models/HeroModel';
import JumpUtils from '../../utils/JumpUtils';
import ModelManager from '../ModelManager';
import NetManager from '../NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel, { AttTypeName, RoleSettingValue } from '../../models/RoleModel';
import SdkTool from '../../../sdk/SdkTool';
import ServerModel from '../../models/ServerModel';
import { GuildTitle } from '../../../view/guild/model/GuildModel';
import { Headframe_titleCfg, HeadframeCfg } from '../../../a/config';
import { LocalSetType } from '../../../scenes/main/ctrl/SettingViewCtrl';
import { RedPointEvent } from '../../utils/RedPointUtils';
import { RoleEventId } from '../../../view/role/enum/RoleEventId';

/**
 * 角色信息控制类
 * @Author: sthoo.huang
 * @Date: 2019-04-08 10:13:10
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-07-31 11:08:43
 */

export default class RoleController extends BaseController {

    model: RoleModel = null;
    heroModel: HeroModel = null;
    guideModel: GuideModel = null

    get gdkEvents(): GdkEventArray[] {
        return [];
    }

    get netEvents(): NetEventArray[] {
        return [
            [icmsg.RoleLoginRsp.MsgType, this.onLoginRspHandle],
            [icmsg.RoleUpdateRsp.MsgType, this.onRoleUpdateRsp],
            [icmsg.RoleHeadRsp.MsgType, this.onChangeHeadRsp],
            [icmsg.RoleFrameRsp.MsgType, this.onChangeHeadFrameRsp],
            [icmsg.RoleAllFramesInfoRsp.MsgType, this.onAllFramesInfoRsp],
            [icmsg.RoleAllFramesAddRsp.MsgType, this.onAllFramesAddRsp],
            [icmsg.RoleSignContentRsp.MsgType, this.onRoleSignContentRsp],
            [icmsg.RoleCookieGetRsp.MsgType, this.onRoleCookieGetRsp],
            [icmsg.GuildSelfTitleRsp.MsgType, this.onGuildSelfTitleRsp],
            [icmsg.RoleVipBoughtFlagRsp.MsgType, this.onRoleVipBoughtFlagRsp],
            [icmsg.RoleRenameNumRsp.MsgType, this._onRoleRenameNumRsp],
            [icmsg.RoleHeadFramesExpireRsp.MsgType, this._onRoleHeadFramesExpireRsp],

            [icmsg.RoleAllTitlesInfoRsp.MsgType, this._onRoleAllTitlesInfoRsp],
            [icmsg.RoleAllTitlesAddRsp.MsgType, this._onRoleAllTitlesAddRsp],
            [icmsg.RoleTitlesExpireRsp.MsgType, this._onRoleTitlesExpireRsp],
            [icmsg.RoleTitleRsp.MsgType, this._onRoleTitleRsp],






        ];
    }

    onStart() {
        this.model = ModelManager.get(RoleModel);
        this.heroModel = ModelManager.get(HeroModel);
        this.guideModel = ModelManager.get(GuideModel);
    }

    onEnd() {
        this.model = null;
    }

    onLoginRspHandle(msg: icmsg.RoleLoginRsp) {
        if (msg.errCode) return;
        let role = msg.role
        this.model.id = role.id;
        this.model.name = role.name;
        this.model.account = role.account;
        this.model.level = role.level;
        this.model.power = role.power;
        this.model.MaxPower = role.maxPower;
        this.model.payed = role.payed
        this.model.head = role.head
        this.model.frame = role.headFrame
        this.model.title = role.title
        this.model.setting = role.setting
        this.model.createTime = role.createTime + '';
        this.model.guildId = role.guildId
        this.model.worldLevel = msg.worldLevel
        this.model.crossId = msg.crossId
        this.model.CrossOpenTime = msg.crossOpenTime
        this.model.maxHeroStar = msg.role.maxHeroStar
        this.model.serverMegTime = msg.serverMegTime
        this.model.serverMegCount = msg.serverMegCount
        for (const key in role.score) {
            const element = role.score[key];
            if (typeof (element) == "number") {
                this.model[key] = element
            }
        }

        // 保存最后登录的帐户
        GlobalUtil.setLocal('login_userid', this.model.account, false);

        //又改回去了！！
        gdk.sound.isOn = (role.setting & (1 << RoleSettingValue.Effect)) == 0;
        gdk.music.isOn = (role.setting & (1 << RoleSettingValue.Music)) == 0;
        GlobalUtil.setFrameRate((role.setting & (1 << RoleSettingValue.SavePower)) == 0 ? 60 : 30);
        //this._updateSetting()
        cc.log("角色查询成功：" + this.model.name);

        if (role.guildId > 0) {

            let msg = new icmsg.GuildDetailReq()
            msg.guildId = role.guildId
            NetManager.send(msg)

            let reqList = [
                // icmsg.FootholdRoleInfoReq,
                icmsg.FootholdRedPointsReq,
                icmsg.GuildMissionListReq,
                icmsg.GuildSelfTitleReq,
                icmsg.GuildSignInfoReq,
                icmsg.GuildDropStateReq,
                icmsg.GuildDropStoredReq,
                icmsg.GuildBossStateReq,
                icmsg.FootholdGuideQueryReq,
                icmsg.GuildListReq,
                icmsg.GuildGatherStateReq,
                icmsg.GuildAccelerateListReq,
            ]

            if (role.guildTitle == GuildTitle.President) {
                reqList.push(icmsg.GuildRequestsReq)
            }

            reqList.forEach(element => {
                let clz = element;
                let msg = new clz();
                NetManager.send(msg);
            });
        }

        let reqList = [
            icmsg.ChampionGuessListReq,
            icmsg.ChampionRedPointsReq,
            icmsg.GuildInviteInfoReq,
            icmsg.MissionAdventureDiaryRewardInfoReq,
            icmsg.ActivityWeekendGiftInfoReq,
        ]
        reqList.forEach(element => {
            let clz = element;
            let msg = new clz();
            NetManager.send(msg);
        });

        // this._systemReq(); //未获取到服务器时间,无法判断actid

        if (JumpUtils.ifSysOpen(2861)) {
            let req = new icmsg.RelicPointListReq();
            req.mapType = 1;
            req.needPoints = false;
            NetManager.send(req);
        }

        ModelManager.get(ServerModel).reqServerNameByIds([role.id]);
    }

    _systemReq() {
        let map = {
            // 2861: icmsg.RelicPointListReq,
            // 2875: icmsg.ActivityWeekendGiftInfoReq,
        }
        let sysReqList = [];
        for (let key in map) {
            let sysId = parseInt(key);
            if (JumpUtils.ifSysOpen(sysId)) {
                sysReqList.push(map[key]);
            }
        }
        sysReqList.forEach(e => {
            let clz = e;
            let msg = new clz();
            NetManager.send(msg);
        });
    }

    _updateSetting() {
        let music = GlobalUtil.getLocal(LocalSetType.music, true, 1);
        let sound = GlobalUtil.getLocal(LocalSetType.sound, true, 1);
        let power = GlobalUtil.getLocal(LocalSetType.savePower, true, false);
        gdk.music.volume = music;
        gdk.music.isOn = music > 0;
        gdk.sound.volume = sound;
        gdk.sound.isOn = sound > 0;
        GlobalUtil.setFrameRate(power ? 30 : 60);
    }

    onRoleUpdateRsp(msg: icmsg.RoleUpdateRsp) {
        for (let index = 0; index < msg.list.length; index++) {
            let element = msg.list[index];
            let attName = AttTypeName[element.index];
            let oldVal = this.model[attName];
            this.model[attName] = element.value;
            gdk.e.emit(RoleEventId.ROLE_ATT_UPDATE, { ...element, oldv: oldVal });
            if (attName == "level") {
                SdkTool.tool.levelUp();
            }
            else if (['gems', 'gold'].indexOf(attName) != -1) {
                SdkTool.tool.itemChanged && SdkTool.tool.itemChanged({ ...element, oldV: oldVal });
            } else if (attName == "power") {
                if (this.model.MaxPower < element.value) {
                    this.model.MaxPower = element.value
                }
                if (gdk.panel.isOpenOrOpening(PanelId.GeneralWeaponUpgradePanel)
                    || gdk.panel.isOpenOrOpening(PanelId.EnergyStationView)
                    || gdk.panel.isOpenOrOpening(PanelId.BYarmySkinPanel)
                    || gdk.panel.isOpenOrOpening(PanelId.BYarmyTrammelPanel)
                    || gdk.panel.isOpenOrOpening(PanelId.BYarmyResolvePanel)
                    || gdk.panel.isOpenOrOpening(PanelId.GuardianUpgradePanel)
                    || gdk.panel.isOpenOrOpening(PanelId.LegionView)
                    || gdk.panel.isOpenOrOpening(PanelId.AssistAllianceView)
                    || gdk.panel.isOpenOrOpening(PanelId.BYTechView)
                    || gdk.panel.isOpenOrOpening(PanelId.BYTechStoneSelectView)) {
                    JumpUtils.updatePowerTip(oldVal, element.value);
                }
            }
        }
    }

    /**换头像 */
    onChangeHeadRsp(data: icmsg.RoleHeadRsp) {
        this.model.head = data.heroId
        gdk.gui.showMessage("更换头像成功")
    }

    /**换头像框 */
    onChangeHeadFrameRsp(data: icmsg.RoleFrameRsp) {
        this.model.frame = data.id
        gdk.gui.showMessage("更换头像框成功")
    }
    /**头像框列表 */
    onAllFramesInfoRsp(data: icmsg.RoleAllFramesInfoRsp) {
        this.model.frameList = {};
        data.headFrames.forEach(info => {
            this.model.frameList[info.id] = info;
        });
    }
    /**增加头像框 */
    onAllFramesAddRsp(data: icmsg.RoleAllFramesAddRsp) {
        this.model.frameList[data.id.id] = data.id;
    }
    /**头像框过期 */
    _onRoleHeadFramesExpireRsp(resp: icmsg.RoleHeadFramesExpireRsp) {
        for (let i = 0; i < resp.id.length; i++) {
            if (this.model.frameList[resp.id[i]]) {
                delete this.model.frameList[resp.id[i]];
            }
        }
        let ids = Object.keys(this.model.frameList);
        ids.sort((a, b) => {
            let cfgA = ConfigManager.getItemById(HeadframeCfg, parseInt(a));
            let cfgB = ConfigManager.getItemById(HeadframeCfg, parseInt(b));
            if (cfgA.order == cfgB.order) {
                return cfgB.sub_order - cfgA.sub_order;
            }
            else {
                return cfgB.order - cfgA.order;
            }
        });
        let req = new icmsg.RoleFrameReq();
        req.id = parseInt(ids[0]);
        NetManager.send(req);
    }

    //称号列表

    /**签名返回 */
    onRoleSignContentRsp(data: icmsg.RoleSignContentRsp) {

    }

    /**角色缓存返回 */
    onRoleCookieGetRsp(data: icmsg.RoleCookieGetRsp) {
        this.model.cookie = data.cookie;
    }

    onGuildSelfTitleRsp(data: icmsg.GuildSelfTitleRsp) {
        this.model.guildTitle = data.title
        if (data.guildName) {
            this.model.guildName = data.guildName
        }
    }

    onRoleVipBoughtFlagRsp(data: icmsg.RoleVipBoughtFlagRsp) {
        this.model.vipGiftBoughtFlag = data.boughtFlag
        this.model.mcRewardTime = data.mCRewardTime
        gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE)
    }

    _onRoleRenameNumRsp(resp: icmsg.RoleRenameNumRsp) {
        this.model.renameNum = resp.num;
    }


    //称号列表
    _onRoleAllTitlesInfoRsp(data: icmsg.RoleAllTitlesInfoRsp) {
        this.model.titleList = {};
        data.titles.forEach(element => {
            this.model.titleList[element.id] = element;
        });
    }

    //称号增加
    _onRoleAllTitlesAddRsp(data: icmsg.RoleAllTitlesAddRsp) {
        if (data.add) {
            this.model.titleList[data.add.id] = data.add;
        }

        if (data.del) {
            delete this.model.titleList[data.del]
        }
    }

    //称号过期
    _onRoleTitlesExpireRsp(data: icmsg.RoleTitlesExpireRsp) {
        for (let i = 0; i < data.id.length; i++) {
            if (this.model.titleList[data.id[i]]) {
                delete this.model.titleList[data.id[i]];
            }
        }
        let ids = Object.keys(this.model.titleList);
        ids.sort((a, b) => {
            let cfgA = ConfigManager.getItemById(Headframe_titleCfg, parseInt(a));
            let cfgB = ConfigManager.getItemById(Headframe_titleCfg, parseInt(b));
            if (cfgA.order == cfgB.order) {
                return cfgB.sub_order - cfgA.sub_order;
            }
            else {
                return cfgB.order - cfgA.order;
            }
        });
        let req = new icmsg.RoleTitleReq();
        req.id = parseInt(ids[0]);
        NetManager.send(req);
    }

    _onRoleTitleRsp(data: icmsg.RoleTitleRsp) {
        this.model.title = data.id
        gdk.gui.showMessage("更换称号成功")
    }
}