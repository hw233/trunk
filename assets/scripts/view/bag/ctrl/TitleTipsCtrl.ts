import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import { AttrCfg, Headframe_titleCfg } from '../../../a/config';
import { AttrIconPath } from './EquipsTipsCtrl';
import { AttrType } from '../../../common/utils/EquipUtils';

/** 
 * 称号tips
 * @Author: weiliang.huang  
 * @Description: 
 * @Date: 2019-03-21 09:57:55 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-31 14:19:53
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/TitleTipsCtrl")
export default class TitleTipsCtrl extends gdk.BasePanel {

    @property(cc.Node)
    titleIcon: cc.Node = null

    @property(cc.Label)
    nameLab: cc.Label = null

    @property(cc.Label)
    timeLab: cc.Label = null

    @property(cc.Label)
    activeLab: cc.Label = null

    @property(cc.Label)
    addLab: cc.Label = null

    @property(cc.Node)
    attPanel: cc.Node = null

    @property(cc.Node)
    attNode: cc.Node = null

    _titleCfg: Headframe_titleCfg

    onEnable() {
        this._titleCfg = this.args[0]
        GlobalUtil.setSpriteIcon(this.node, this.titleIcon, GlobalUtil.getHeadTitleById(this._titleCfg.id))
        this.nameLab.string = `${this._titleCfg.name}`
        this.timeLab.string = this._titleCfg.timeliness > 0 ? `${this._titleCfg.timeliness}天` : `永久`
        this.activeLab.string = `${this._titleCfg.desc}`
        this.addLab.string = `${this._titleCfg.attribute_desc}`

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
    }

    _updateOneAtt(attNode: cc.Node, info: AttrType) {
        attNode.active = true
        //let attrIcon = attNode.getChildByName("attrIcon")
        let typeLab = attNode.getChildByName("typeLab").getComponent(cc.Label)
        let numLab = attNode.getChildByName("numLab").getComponent(cc.Label)
        typeLab.string = info.name + ":"
        if (info.type == "w") {
            numLab.string = `${info.value}`
        } else {
            numLab.string = `${info.value / 100}%`
        }
        //GlobalUtil.setSpriteIcon(this.node, attrIcon, `view/role/texture/equipTip2/${AttrIconPath[info.name]}`)
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
}