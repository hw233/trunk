import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import ServerModel from '../../../common/models/ServerModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import UiListItem from '../../../common/widgets/UiListItem';
import {
    Adventure_treasureCfg,
    AttrCfg,
    Headframe_titleCfg,
    HeadframeCfg
    } from '../../../a/config';
import { AttrIconPath } from '../../../view/bag/ctrl/EquipsTipsCtrl';
import { AttrType } from '../../../common/utils/EquipUtils';
import { HeadItemInfo } from './HeadChangeViewCtrl';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/HeadTitleItemCtrl")
export default class HeadTitleItemCtrl extends UiListItem {

    @property(cc.Node)
    titleIcon: cc.Node = null

    @property(cc.Node)
    lockNode: cc.Node = null

    @property(cc.Label)
    timeLab: cc.Label = null

    @property(cc.Node)
    attPanel: cc.Node = null

    @property(cc.Node)
    attNode: cc.Node = null

    @property(cc.Label)
    descLab: cc.Label = null

    @property(cc.Node)
    onState: cc.Node = null

    @property(cc.Node)
    selectIcon: cc.Node = null

    @property(cc.Node)
    lockBg: cc.Node = null

    _info: HeadItemInfo
    _titleCfg: Headframe_titleCfg

    get roleModel(): RoleModel {
        return ModelManager.get(RoleModel)
    }

    updateView() {
        this._info = this.data
        this._titleCfg = ConfigManager.getItemById(Headframe_titleCfg, this._info.id)
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, GlobalUtil.getHeadTitleById(this._titleCfg.id))
        this.descLab.string = `${this._titleCfg.paper}`
        this.selectIcon.active = this._info.isSelect

        this.attPanel.removeAllChildren()
        let attrArr = this._getAttr()
        for (let index = 0; index < attrArr.length; index++) {
            const info: AttrType = attrArr[index];
            if (info.value != 0) {
                let attNode: cc.Node = this.attPanel[index]
                if (!attNode) {
                    attNode = cc.instantiate(this.attNode)
                    attNode.parent = this.attPanel
                }
                this._updateOneAtt(attNode, info)
            }
        }

        if (this.roleModel.titleList[this._titleCfg.id]) {
            this.lockBg.active = false
            this.lockNode.active = false
            this.timeLab.node.active = true
            if (this._titleCfg.timeliness == 0) {
                this._clearTime()
                this.timeLab.string = `使用期限:永久`
            } else {
                this._createTime()
            }
        } else {
            this.lockBg.active = true
            this.lockNode.active = true
            this.timeLab.node.active = false
        }
        this.onState.active = this.roleModel.title == this._titleCfg.id
    }

    _updateOneAtt(attNode: cc.Node, info: AttrType) {
        attNode.active = true
        let attrIcon = attNode.getChildByName("attrIcon")
        let typeLab = attNode.getChildByName("typeLab").getComponent(cc.Label)
        let numLab = attNode.getChildByName("numLab").getComponent(cc.Label)
        typeLab.string = info.name + ":"
        if (info.type == "w") {
            numLab.string = `${info.value}`
        } else {
            numLab.string = `${info.value / 100}%`
        }
        GlobalUtil.setSpriteIcon(this.node, attrIcon, `view/role/texture/equipTip2/${AttrIconPath[info.name]}`)
    }

    _getAttr() {
        let numAttr: Object = {
            atk: this._titleCfg.atk_w || 0,
            hp: this._titleCfg.hp_w || 0,
            def: this._titleCfg.def_w || 0,
            hit: this._titleCfg.hit_w,
            dodge: this._titleCfg.dodge_w || 0,
            crit: this._titleCfg.crit_w || 0
        }

        let percentAttr: Object = {
            atk: this._titleCfg.atk_p || 0,
            hp: this._titleCfg.hp_p || 0,
            def: this._titleCfg.def_p || 0,
            hit: this._titleCfg.hit_p,
            dodge: this._titleCfg.dodge_p || 0,
            crit: this._titleCfg.crit_p || 0
        }

        let attrs = []
        let keys = ["atk_g", "hp_g", "def_g", "hit_g", "dodge_g", "crit_g"]
        for (let i = 0; i < keys.length; i++) {
            let attrCfg = ConfigManager.getItemById(AttrCfg, keys[i])
            if (attrCfg) {
                let info: AttrType = {
                    keyName: keys[i],
                    name: attrCfg.name,
                    value: numAttr[keys[i].replace("_g", "")],
                    type: attrCfg.type,
                }
                attrs.push(info)
            }
        }

        let percnetKeys = ["atk_r", "hp_r", "def_r", "hit_r", "dodge_r", "crit_r"]
        for (let i = 0; i < percnetKeys.length; i++) {
            let attrCfg = ConfigManager.getItemById(AttrCfg, percnetKeys[i])
            if (attrCfg) {
                let info: AttrType = {
                    keyName: percnetKeys[i],
                    name: attrCfg.name,
                    value: percentAttr[percnetKeys[i].replace("_r", "")],
                    type: attrCfg.type,
                }
                attrs.push(info)
            }
        }

        return attrs
    }

    _createTime() {
        this._clearTime()
        this._updateTime()
        this.schedule(this._updateTime, 1)
    }

    _updateTime() {
        let info = this.roleModel.titleList[this._titleCfg.id]
        if (!info) {
            this.timeLab.string = `使用期限:已失效`
            this._clearTime()
            return
        }
        let curTime = Math.floor(ModelManager.get(ServerModel).serverTime / 1000)
        let leftTime = info.endTime - curTime
        if (leftTime > 0) {
            this.timeLab.string = `${TimerUtils.format1(leftTime)}后失效`
        } else {
            this.timeLab.string = `使用期限:已失效`
            this._clearTime()
        }
    }

    _clearTime() {
        this.unschedule(this._updateTime)
    }
}