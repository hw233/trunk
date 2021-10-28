import ConfigManager from '../../../../common/managers/ConfigManager';
import FootHoldModel from '../footHold/FootHoldModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import MilitaryRankUtils from './MilitaryRankUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import { Foothold_titleCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-02-05 18:08:12
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/militaryRank/MilitaryRankUpgradeCtrl")
export default class MilitaryRankUpgradeCtrl extends gdk.BasePanel {

    @property(cc.Node)
    bg: cc.Node = null

    @property(cc.Node)
    maskNode: cc.Node = null

    @property(cc.RichText)
    descLab: cc.RichText = null

    @property(cc.Node)
    icon: cc.Node = null

    @property(cc.Label)
    MRNameLab: cc.Label = null

    onEnable() {
        let curLv = ModelManager.get(FootHoldModel).militaryRankLv
        let curCfg = ConfigManager.getItemByField(Foothold_titleCfg, "level", curLv)
        GlobalUtil.setSpriteIcon(this.node, this.icon, MilitaryRankUtils.getIcon(curLv))
        this.descLab.string = `${curCfg.desc1}`
        this.MRNameLab.string = `${curCfg.name}`

        let ani = this.bg.getComponent(cc.Animation)
        ani.play()
        ani.on("finished", () => {
            this.maskNode.active = false
        }, this)
    }
}