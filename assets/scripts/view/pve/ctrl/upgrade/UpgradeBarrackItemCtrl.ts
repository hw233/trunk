import BYModel from '../../../bingying/model/BYModel';
import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import RedPointUtils from '../../../../common/utils/RedPointUtils';
import UiListItem from '../../../../common/widgets/UiListItem';
import { BarracksCfg, Common_strongerCfg } from '../../../../a/config';


/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: jiangping
 * @Last Modified time: 2020-12-22 11:53:59
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/upgrade/UpgradeBarrackItemCtrl")
export default class UpgradeBarrackItemCtrl extends UiListItem {

    @property(cc.Node)
    tip: cc.Node = null;

    @property(cc.Sprite)
    colorBg: cc.Sprite = null;

    @property(cc.Node)
    solIcon: cc.Node = null;

    @property(cc.Label)
    solName: cc.Label = null;

    @property(cc.Node)
    redPoint: cc.Node = null

    @property(cc.Label)
    attrLabs: cc.Label[] = []    // 属性label

    get model(): BYModel { return ModelManager.get(BYModel); }

    _soldierId: number = 0
    _isNeedUpgrade = false

    resObj = {
        1: { name: "机枪兵", res: "zd_sheshou" },
        3: { name: "炮兵", res: "zd_paobing" },
        4: { name: "守卫", res: "zd_shouwei" },
    }

    onLoad() {

    }

    updateView() {
        this._soldierId = parseInt(this.data)

        GlobalUtil.setSpriteIcon(this.node, this.colorBg, `view/pve/texture/ui/${this.resObj[this._soldierId].res}`)
        GlobalUtil.setSpriteIcon(this.node, this.solIcon, GlobalUtil.getSoldierTypeIcon(this._soldierId))
        let bCfg = ConfigManager.getItemByField(BarracksCfg, "type", (100 + this._soldierId))
        // this.solName.string = `${bCfg.name}`

        let byTechInfos = this.model.byTechInfos
        let keys = ["hp_g", "atk_g", "def_g", "hp_r", "atk_r", "def_r"]
        let attInfos = {
            "hp_g": 0,
            "atk_g": 0,
            "def_g": 0,
            "hp_r": 0,
            "atk_r": 0,
            "def_r": 0,
        }
        // // 遍历当前已开启的科技
        // for (const key in byTechInfos) {
        //     let info: BarrackTech = byTechInfos[key]    // 科技等级信息
        //     let id = parseInt(key)  // 科技id
        //     let techCfg = ConfigManager.getItemById(Barracks_scienceCfg, id)    // 科技描述信息

        //     let byCfg = ConfigManager.getItemById(Barracks_practiceCfg, techCfg.practice_lv)// 所属兵营信息
        //     if ((100 + this._soldierId) == byCfg.barracks_id) {
        //         let attCfg = ConfigManager.getItemByField(Barracks_science_lvCfg, "science_id", id, { science_lv: info.level }) // 属性信息
        //         if (attCfg && attCfg.soldier_id == 0) {
        //             for (let index = 0; index < keys.length; index++) {
        //                 const _key = keys[index];
        //                 attInfos[_key] += attCfg[_key]
        //             }
        //         }
        //     }
        // }

        let copyModel = ModelManager.get(CopyModel)
        let stageId = copyModel.latelyStageId
        let strongerCfg = ConfigManager.getItemByField(Common_strongerCfg, "index", stageId)
        for (let index = 0; index < this.attrLabs.length; index++) {
            const lab = this.attrLabs[index];
            let _key = keys[index]
            let value = attInfos[_key]
            if (_key.indexOf("_r") >= 0) {
                lab.string = `+${value / 100}%`
            } else {
                lab.string = `+${value}`
            }
            if (value < strongerCfg[_key]) {
                this._isNeedUpgrade = true
            }
        }
        this.tip.active = this._isNeedUpgrade
        this.redPoint.active = RedPointUtils.each_or([0, 1, 2], RedPointUtils.is_can_barracks_practice, (100 + this._soldierId))
    }

    oepnBarrackPanel() {
        gdk.panel.hide(PanelId.UpgradeBarrack)
        gdk.panel.hide(PanelId.PveSceneFailPanel)

        this.model.bySelectType = this._soldierId + 100
        gdk.panel.open(PanelId.BYView)
    }
}