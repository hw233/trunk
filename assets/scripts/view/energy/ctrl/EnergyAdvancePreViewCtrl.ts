import ConfigManager from '../../../common/managers/ConfigManager';
import EnergyModel from '../model/EnergyModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import { Energystation_advancedCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-27 10:52:42 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/energy/EnergyAdvancePreViewCtrl")
export default class EnergyAdvancePreViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    stationType: number;
    onEnable() {
        this.stationType = this.args[0];
        this._updateList();
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                gap_y: 10,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList() {
        this._initListView();
        let datas = [];
        let map: { [adClass: number]: Energystation_advancedCfg[] } = {};
        let curAdvanceCfg = ConfigManager.getItemById(Energystation_advancedCfg, ModelManager.get(EnergyModel).energyStationInfo[this.stationType].advanceId);
        ConfigManager.getItems(Energystation_advancedCfg, (cfg: Energystation_advancedCfg) => {
            if (cfg.type == this.stationType) {
                if (!map[cfg.class]) map[cfg.class] = [];
                map[cfg.class].push(cfg);
            }
        });
        for (let key in map) {
            let c = map[key];
            c.sort((a, b) => { return a.level - b.level; });
            // let dAtk = c[c.length - 1].hero_atk_r - c[0].hero_atk_r;
            // let dHp = c[c.length - 1].hero_hp_r - c[0].hero_hp_r;
            // let dDef = c[c.length - 1].hero_def_r - c[0].hero_def_r;
            let dAtk = c[c.length - 1].hero_atk_r;
            let dHp = c[c.length - 1].hero_hp_r;
            let dDef = c[c.length - 1].hero_def_r;
            let desc = c[0].desc;
            let minStr, maxStr;
            let isCurClass;
            c.forEach(cfg => {
                if (cfg.camp) {
                    // if (!minStr) {
                    //     minStr = GlobalUtil.getSkillCfg(cfg.camp).des;
                    // }
                    maxStr = GlobalUtil.getSkillCfg(cfg.camp).des;
                    isCurClass = cfg.class == curAdvanceCfg.class;
                }
            });
            let dCampStr = '';
            if (maxStr) {
                // let dCamp = parseInt(maxStr.split('+')[1].split('%')[0]) - parseInt(minStr.split('+')[1].split('%')[0]);
                let dCamp = parseInt(maxStr.split('+')[1].split('%')[0]);
                dCampStr = `${maxStr.split('+')[0]}+${dCamp}%`;
            }
            datas.push({
                type: this.stationType,
                desc: desc,
                dAtk: dAtk,
                dHp: dHp,
                dDef: dDef,
                dCampStr: dCampStr,
                isCurClass: isCurClass
            })
        }
        this.list.clear_items();
        this.list.set_data(datas);
    }
}

