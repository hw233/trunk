import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildMainCtrl from './GuildMainCtrl';
import GuildModel, { GuildTitle } from '../model/GuildModel';
import GuildUtils from '../utils/GuildUtils';
import MercenaryModel from '../../mercenary/model/MercenaryModel';
import MercenaryUtils from '../../mercenary/utils/MercenaryUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import RoleModel from '../../../common/models/RoleModel';
import { AskInfoCacheType, AskInfoType } from '../../../common/widgets/AskPanel';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildCampItem")
export default class GuildCampItem extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    otherNameLab: cc.Label = null;

    @property(cc.Node)
    operateNode: cc.Node = null;

    @property(cc.Node)
    btnMove: cc.Node = null;

    @property(cc.Node)
    btnSet: cc.Node = null;

    @property(cc.Node)
    hireTip: cc.Node = null;

    pos: number = -1
    curName: string = ""
    mainCtrl: GuildMainCtrl = null

    get model() { return ModelManager.get(GuildModel); }
    get roleModel() { return ModelManager.get(RoleModel); }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this._onClick, this);
    }

    updateData(pos, name, ctrl: GuildMainCtrl) {
        this.operateNode.active = false
        this.btnMove.active = false
        this.hireTip.active = false
        this.pos = pos
        this.curName = name
        this.mainCtrl = ctrl
        if (name) {
            this.icon.active = true
            this.nameLab.string = name
            this.otherNameLab.string = name
            this.nameLab.node.active = name == this.roleModel.name
            this.otherNameLab.node.active = name != this.roleModel.name

            //自己的位置
            if (this._hasPos() && this.curName == this.roleModel.name) {
                if (MercenaryUtils.setHeroLength > MercenaryUtils.hiredHeroLength) {
                    this.hireTip.active = true
                } else {
                    this.hireTip.active = RedPointUtils.has_worker_money_get()
                }
            }

        } else {
            this.nameLab.string = ""
            this.otherNameLab.string = ""
            this.icon.active = false
        }
    }

    updateIcon() {
        let path = 'view/guild/texture/main/gh_paotai0'
        let memberInfo = GuildUtils.getMemberInfoByName(this.curName)
        if (!memberInfo) {
            return
        }
        if (memberInfo.position == GuildTitle.President) {
            GlobalUtil.setSpriteIcon(this.node, this.icon, `${path}1`)
        } else if (memberInfo.position == GuildTitle.VicePresident) {
            GlobalUtil.setSpriteIcon(this.node, this.icon, `${path}2`)
        } else if (memberInfo.position == GuildTitle.TeamLeader) {
            GlobalUtil.setSpriteIcon(this.node, this.icon, `${path}4`)
        } else {
            GlobalUtil.setSpriteIcon(this.node, this.icon, `${path}3`)
        }
    }

    hideOperateNode() {
        this.operateNode.active = false
    }

    _onClick() {
        if (!this.model.guildCamp) {
            return
        }
        this.mainCtrl.showMask()
        this.mainCtrl.refreshCamps()
        if (this._hasPos()) {
            if (this.curName == "" && this.curName !== this.roleModel.name) {
                this.btnMove.active = true
                this.btnSet.active = false
                this.operateNode.active = true
                this.node.zIndex = (this.pos + 99)
            } else {
                if (this.curName == this.roleModel.name) {
                    gdk.panel.open(PanelId.MercenarySetView)
                }
            }
        } else {
            if (this.curName == "") {
                this.btnSet.active = true
                this.btnMove.active = false
                this.operateNode.active = true
                this.node.zIndex = (this.pos + 99)
            }
        }
    }

    _hasPos() {
        let camps = this.model.guildCamp.campers
        for (let i = 0; i < camps.length; i++) {
            if (camps[i] && camps[i].name == this.roleModel.name) {
                return true
            }
        }
        return false
    }

    sendSetCamp() {
        let self = this
        let msg = new icmsg.GuildSetCampReq()
        msg.pos = this.pos
        NetManager.send(msg, (data: icmsg.GuildSetCampRsp) => {
            self.mainCtrl.hideMask()
            if (data.name != "") {
                gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP1"))
                let msg = new icmsg.GuildCampReq()
                NetManager.send(msg)
                return
            }
            gdk.gui.showMessage(gdk.i18n.t("i18n:GUILD_TIP2"))
            let camps = self.model.guildCamp.campers
            for (let i = 0; i < camps.length; i++) {
                if (camps[i].name == self.roleModel.name) {
                    camps.splice(i, 1)
                    break
                }
            }
            let camper: icmsg.GuildCamper = new icmsg.GuildCamper()
            camper.pos = data.pos
            camper.name = self.roleModel.name
            camps.push(camper)
            this.model.guildCamp.campers = camps
            self.updateIcon()
        })
    }


    setFunc() {
        let info: AskInfoType = {
            title: gdk.i18n.t("i18n:GUILD_TIP3"),
            sureCb: () => {
                this.sendSetCamp()
            },
            descText: gdk.i18n.t("i18n:GUILD_TIP4"),
            thisArg: this,
        }
        GlobalUtil.openAskPanel(info)
    }

    cancelFunc() {
        this.operateNode.active = false
    }

    moveFunc() {
        let info: AskInfoType = {
            title: gdk.i18n.t("i18n:GUILD_TIP3"),
            sureCb: () => {
                this.sendSetCamp()
            },
            descText: gdk.i18n.t("i18n:GUILD_TIP4"),
            thisArg: this,
            isShowTip: true,
            tipSaveCache: AskInfoCacheType.guild_setCamp_tip,
        }
        GlobalUtil.openAskPanel(info)
    }
}