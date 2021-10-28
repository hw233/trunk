import ChampionModel from '../model/ChampionModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import { Champion_dropCfg, Champion_mainCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-25 14:28:20 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/champion/ChampionGradeViewCtrl")
export default class ChampionGradeViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView;
    onEnable() {
        let cfg: Champion_mainCfg = ConfigManager.getItemById(Champion_mainCfg, ModelManager.get(ChampionModel).infoData.seasonId);
        if (cfg) {
            this._updateList(cfg);
        }
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                async: true,
                gap_y: 5,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList(cfg: Champion_mainCfg) {
        let datas = [...ConfigManager.getItemsByField(Champion_dropCfg, 'season', cfg.season)];
        //排除第一个段位
        //datas.splice(0, 1);

        //数据排序
        let tem1 = [];
        let tem2 = [];
        let championModel = ModelManager.get(ChampionModel)
        let infoData = championModel.infoData;
        datas.forEach(cfg => {
            if (cfg.lv != 1) {
                if (cfg.lv <= infoData.lvRewarded) {
                    //temState = 1;
                    tem1.push(cfg);
                } else {
                    tem2.push(cfg)
                }
            }
        })
        let temData = tem2.concat(tem1);
        this._initList();
        this.list.clear_items();
        this.list.set_data(temData);
    }
}
