import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuildLogDayItemCtrl from './GuildLogDayItemCtrl';
import GuildModel from '../model/GuildModel';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import SiegeModel from './siege/SiegeModel';
import { Guild_logCfg } from '../../../a/config';
import { threadId } from 'worker_threads';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-02-02 18:36:31
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildLogCtrl")
export default class GuildLogCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    dayLogItem: cc.Prefab = null

    @property(cc.Node)
    btnView: cc.Node = null

    @property(cc.Label)
    checkLabs: cc.Label[] = []

    @property(cc.Toggle)
    checkToggles: cc.Toggle[] = []

    _logDayList: any = {}
    _logTypeList: any = {}

    _selectType: number = 0

    get guildModel() { return ModelManager.get(GuildModel); }
    get siegeModel() { return ModelManager.get(SiegeModel); }

    _checkTypes = [1, 3, 4, 5, 6]

    onEnable() {

        let args = this.args
        let type = 0
        if (args && args.length > 0) {
            type = args[0]
        }

        //公会成员最新信息
        let dmsg = new icmsg.GuildDetailReq()
        dmsg.guildId = this.guildModel.guildDetail.info.id
        NetManager.send(dmsg)

        this.btnView.active = false
        this._initCheckLabs()

        let msg = new icmsg.GuildLogListReq()
        NetManager.send(msg, (rsp: icmsg.GuildLogListRsp) => {
            let infos = rsp.list
            // infos.reverse()
            GlobalUtil.sortArray(infos, (a: icmsg.GuildLog, b: icmsg.GuildLog) => {
                return b.time - a.time
            })
            infos.forEach(element => {
                let time = new Date(element.time * 1000)
                let key = `${time.getMonth() + 1}-${time.getDate()}`
                if (this._logDayList[key]) {
                    this._logDayList[key].push(element)
                } else {
                    this._logDayList[key] = []
                    this._logDayList[key].push(element)
                }

                if (this._logTypeList[element.type]) {
                    this._logTypeList[element.type].push(element)
                } else {
                    this._logTypeList[element.type] = []
                    this._logTypeList[element.type].push(element)
                }
            });

            if (type > 0) {
                this.selectCheckFunc(null, type)
            } else {
                this.updateDayLogView()
            }
        }, this)
    }

    _initCheckLabs() {
        for (let i = 0; i < this.checkLabs.length; i++) {
            let cfg = ConfigManager.getItemByField(Guild_logCfg, "type", this._checkTypes[i])
            this.checkLabs[i].string = `${cfg.label}`
        }

        if (this.guildModel.gbOpenTime <= 0 || !JumpUtils.ifSysOpen(2835)) {
            this.checkToggles[2].node.active = false
        }

        if (!this.siegeModel.isActivityOpen) {
            this.checkToggles[4].node.active = false
        }
    }

    updateDayLogView() {
        this.content.removeAllChildren()
        for (let key in this._logDayList) {
            let dayLogItem = cc.instantiate(this.dayLogItem)
            let ctrl = dayLogItem.getComponent(GuildLogDayItemCtrl)
            this.content.addChild(dayLogItem)
            ctrl.updateDayLog(key, this._logDayList[key])
        }
    }

    updateTypeLogView(type) {
        this.content.removeAllChildren()
        let list = this._logTypeList[type] || []
        if (type == 1) {
            list = list.concat(this._logTypeList[2] ? this._logTypeList[2] : [])
        }
        GlobalUtil.sortArray(list, (a: icmsg.GuildLog, b: icmsg.GuildLog) => {
            return b.time - a.time
        })
        let datas = []
        list.forEach(element => {
            let time = new Date(element.time * 1000)
            let key = `${time.getMonth() + 1}-${time.getDate()}`
            if (datas[key]) {
                datas[key].push(element)
            } else {
                datas[key] = []
                datas[key].push(element)
            }
        })

        for (let key in datas) {
            let dayLogItem = cc.instantiate(this.dayLogItem)
            let ctrl = dayLogItem.getComponent(GuildLogDayItemCtrl)
            this.content.addChild(dayLogItem)
            ctrl.updateDayLog(key, datas[key])
        }
    }

    selectCheckFunc(e: cc.Toggle, type) {
        this._selectType = parseInt(type)
        if (e) {
            if (e.isChecked) {
                this.updateTypeLogView(this._selectType)
                if (this._selectType == 5 || this._selectType == 6) {
                    this.btnView.active = false
                } else {
                    this.btnView.active = true
                }
            } else {
                this.updateDayLogView()
                this.btnView.active = false
            }
        } else {
            this.checkToggles[this._checkTypes.indexOf(type)].check()
            this.updateTypeLogView(this._selectType)
            this.btnView.active = false
        }
    }

    openDetailFunc() {
        gdk.panel.setArgs(PanelId.GuildLogDetail, this._selectType)
        gdk.panel.open(PanelId.GuildLogDetail)
    }
}