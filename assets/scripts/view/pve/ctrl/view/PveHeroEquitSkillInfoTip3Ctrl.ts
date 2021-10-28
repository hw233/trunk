import { UniqueCfg, Unique_starCfg } from "../../../../a/config";
import ConfigManager from "../../../../common/managers/ConfigManager";
import GlobalUtil from "../../../../common/utils/GlobalUtil";
import PanelId from "../../../../configs/ids/PanelId";



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/PveHeroEquitSkillInfoTip3Ctrl")
export default class PveHeroEquitSkillInfoTip3Ctrl extends gdk.BasePanel {

    @property(cc.Node)
    skillNode: cc.Node = null;
    @property(cc.Sprite)
    skillBg: cc.Node = null;
    @property(cc.Sprite)
    skillIcon: cc.Node = null;

    @property(cc.Label)
    skillName: cc.Label = null;

    @property(cc.RichText)
    skillDes: cc.RichText = null;

    @property(cc.Node)
    starNode: cc.Node = null;

    @property(cc.Node)
    starInfo: cc.Node = null;

    @property(cc.Node)
    lockNode: cc.Node = null;

    _equipInfo: icmsg.UniqueEquip;
    _uniqueEquipCfg: UniqueCfg;
    _showCareerId = 0;
    _careerIndex = 0;
    heroInfo: icmsg.HeroInfo;

    lock: boolean = false;
    onEnable() {
        let args = gdk.panel.getArgs(PanelId.PveHeroEquitSkillInfoTip3)
        if (args) {
            this.heroInfo = args[0];
            this.lock = args[1];
            this._equipInfo = this.heroInfo.uniqueEquip;
            this._showCareerId = this.heroInfo.careerId;
        }

        if (this.lock) {
            this.lockNode.active = true
            this.skillNode.active = false;
            this.starNode.active = false;
            return;
        }
        this.lockNode.active = false
        this.skillNode.active = true;
        this.starNode.active = true;

        this._uniqueEquipCfg = ConfigManager.getItemById(UniqueCfg, this._equipInfo.itemId)
        this._careerIndex = this._uniqueEquipCfg.career_id.indexOf(this._showCareerId)
        if (this._careerIndex == -1) {
            this._careerIndex = 0
        }
        GlobalUtil.setSpriteIcon(this.node, this.skillBg, `common/texture/role/rune/zd_jinengkuang${this._uniqueEquipCfg.color}`);
        GlobalUtil.setSpriteIcon(this.node, this.skillIcon, `icon/skill/${this._uniqueEquipCfg.skill_icon[this._careerIndex]}`);
        this.skillName.string = this._uniqueEquipCfg.skill_name[this._careerIndex]
        let starCfgs = ConfigManager.getItemsByField(Unique_starCfg, "unique_id", this._uniqueEquipCfg.id)
        this.skillDes.string = this._careerIndex == 0 ? starCfgs[0].des1 : starCfgs[0].des2;

        for (let index = 0; index < this.starNode.childrenCount; index++) {
            const info = this.starNode.children[index];
            info.active = false
        }
        for (let index = 1; index < starCfgs.length; index++) {
            let starInfo: cc.Node = this.starNode[index]
            if (!starInfo) {
                starInfo = cc.instantiate(this.starInfo)
                starInfo.parent = this.starNode
            }
            starInfo.active = true
            this._updateStarInfo(starInfo, starCfgs[index])
        }
    }

    _updateStarInfo(node, starCfg: Unique_starCfg) {
        let onDes = cc.find("on/des", node).getComponent(cc.RichText)
        let offDes = cc.find("off/des", node).getComponent(cc.RichText)
        onDes.node.parent.active = false
        offDes.node.parent.active = false

        if (this._uniqueEquipCfg.unique && this._uniqueEquipCfg.unique.length > 0) {
            let isActive = this.heroInfo ? this.heroInfo.typeId == this._uniqueEquipCfg.unique[0] : false
            if (this._equipInfo.id == -1) {
                isActive = true
            }
            if (this._equipInfo.star >= starCfg.star && isActive) {
                onDes.node.parent.active = true
                onDes.string = `[${starCfg.star}星解锁]` + (this._careerIndex == 0 ? `${starCfg.des1}` : `${starCfg.des2}`)
            } else {
                offDes.node.parent.active = true
                offDes.string = `[${starCfg.star}星解锁]` + (this._careerIndex == 0 ? `${starCfg.des1}` : `${starCfg.des2}`)
            }
        } else {
            if (this._equipInfo.star >= starCfg.star || this._equipInfo.id == -1) {
                onDes.node.parent.active = true
                onDes.string = `[${starCfg.star}星解锁]` + (this._careerIndex == 0 ? `${starCfg.des1}` : `${starCfg.des2}`)
            } else {
                offDes.node.parent.active = true
                offDes.string = `[${starCfg.star}星解锁]` + (this._careerIndex == 0 ? `${starCfg.des1}` : `${starCfg.des2}`)
            }
        }
    }

}
