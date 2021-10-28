import BYModel from '../model/BYModel';
import BYUtils from '../utils/BYUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import HeroModel from '../../../common/models/HeroModel';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import RoleModel from '../../../common/models/RoleModel';
import SoldierModel from '../../../common/models/SoldierModel';
import SoldierUtils from '../../../common/utils/SoldierUtils';
import StringUtils from '../../../common/utils/StringUtils';
import { SoldierCfg } from '../../../a/config';

/**
 * 士兵属性
 * @Author: sthoo.huang
 * @Date: 2020-01-14 17:49:04
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-08-28 17:08:34
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/TechSoldierCtrl")
export default class TechSoldierCtrl extends cc.Component {

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    @property(cc.Node)
    attNode: cc.Node = null;

    @property(cc.Node)
    classIcon: cc.Node = null;

    @property(cc.Label)
    soldierName: cc.Label = null;

    @property(cc.RichText)
    skillDescLabs: cc.RichText[] = [];

    attLabs: Array<cc.Label> = [];
    nextLabs: Array<cc.Label> = [];

    soldierId: number;
    //soldierCfg: SoldierCfg

    get roleModel() { return ModelManager.get(RoleModel); }
    get byModel() { return ModelManager.get(BYModel); }

    onLoad() {
        // 属性文本
        for (let index = 1; index <= 3; index++) {
            let attLab = this.attNode.getChildByName("attLab" + index).getComponent(cc.Label);
            let nextLab = this.attNode.getChildByName("nextLab" + index).getComponent(cc.Label);
            this.attLabs.push(attLab);
            this.nextLabs.push(nextLab);
        }
    }

    onEnable() {
        let args = gdk.panel.getArgs(PanelId.TechSoldier)
        this.soldierId = args[0]
        this._updateSoldierInfo()
        this._updateSkillInfo()
    }

    onDisable() {
        gdk.e.targetOff(this);
    }

    _updateSoldierInfo() {
        let playerLv = this.roleModel.level
        let cfg = ConfigManager.getItemById(SoldierCfg, this.soldierId);
        this.soldierName.string = `${cfg.name}`
        this.soldierName.node.color = cc.color(GlobalUtil.getSoldierNameColor(cfg.color, false))
        let outLine = this.soldierName.node.getComponent(cc.LabelOutline)
        outLine.color = cc.color(GlobalUtil.getSoldierNameColor(cfg.color, true))
        GlobalUtil.setSpriteIcon(this.node, this.classIcon, GlobalUtil.getSoldierClassIconById(cfg.class))
        GlobalUtil.setUiSoldierSpineData(this.node, this.spine, cfg.skin, true)
        let attList = [['hp_w', 'grow_hp'], ['atk_w', 'grow_atk'], ['def_w', 'grow_def'], ['hit_w', 'grow_hit'], ['dodge_w', 'grow_dodge']]
        for (let index = 0; index < this.attLabs.length; index++) {
            //白质属性 = 士兵基础属性 + 英雄成长属性
            let wVal = cfg[attList[index][0]] + Math.floor((playerLv - 1) * cfg[attList[index][1]] / 100);
            this.attLabs[index].string = `${wVal}`;
            this.nextLabs[index].string = ``;
        }
    }

    _updateSkillInfo() {
        for (let i = 0; i < 2; i++) {
            let skillInfo = SoldierUtils.getSkillInfo(this.soldierId, i);
            this.skillDescLabs[i].string = skillInfo.skillId > 0 ? StringUtils.setRichtOutLine(skillInfo.desc, "#432208", 2) : `${StringUtils.setRichtOutLine("无", "#432208", 2)}`;
        }
    }

}
