import ButtonSoundId from '../../../configs/ids/ButtonSoundId';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import PanelId from '../../../configs/ids/PanelId';
import { SoldierCfg } from '../../../a/config';

const typeKeys = ["atk_w", "def_w", "hp_w", "hit_w", "dodge_w"]


const attrKeys = ["ul_hp_w", "ul_atk_w", "ul_def_w", "ul_hit_w", "ul_dodge_w", "ul_crit_w", "ul_atk_r", "ul_hp_r", "ul_def_r"]
const attrKeysText = ["生    命", "攻    击", "防    御", "命    中", "闪    避", "暴    击", "部队攻击", "部队生命", "部队防御"]
/*
//转职提示窗口
 * @Author: luoyong 
 * @Date: 2020-02-27 10:32:43 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-09-22 17:38:31
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYGetSoldierEffectCtrl")
export default class BYGetSoldierEffectCtrl extends cc.Component {


    @property(cc.Node)
    soldierNode: cc.Node = null

    @property(cc.Node)
    soldierTitle: cc.Node = null

    @property(sp.Skeleton)
    soldierSpine: sp.Skeleton = null

    @property(sp.Skeleton)
    soldierEffect: sp.Skeleton = null

    @property(cc.Label)
    soldierName: cc.Label = null

    @property(cc.RichText)
    soldierDesc: cc.RichText = null

    @property(cc.Node)
    maskNode: cc.Node = null

    onLoad() {

    }

    onEnable() {

    }

    showSoldierGetEffect(soldierId: number) {
        this.maskNode.active = true
        this.soldierNode.active = true
        this.soldierEffect.setAnimation(0, "animation", true)

        let cfg = ConfigManager.getItemById(SoldierCfg, soldierId)
        this.soldierName.string = cfg.name
        this.soldierDesc.string = cfg.desc;
        GlobalUtil.setUiSoldierSpineData(this.node, this.soldierSpine, cfg.skin)

        let ani = this.soldierNode.getComponent(cc.Animation)
        ani.play()
        ani.on("finished", () => {
            this.maskNode.active = false
        }, this)
        GlobalUtil.isSoundOn && gdk.sound.play(gdk.Tool.getResIdByNode(this.node), ButtonSoundId.popup);
    }

    closeSoldierNode() {
        gdk.panel.hide(PanelId.BYGetSoldierEffect)
    }
}