import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import ModelManager from '../../../../common/managers/ModelManager';
import RuneModel from '../../../../common/models/RuneModel';
import RuneSelectItemCtrl from './RunSelectItemCtrl';
import { BagType } from '../../../../common/models/BagModel';
import { Hero_careerCfg, RuneCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-09 14:02:39 
  */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneSelectCtrl")
export default class RuneSelectCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    runeItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    curUseItem: cc.Node = null;

    list: ListView;
    curPos: number;
    curRuneCfg: RuneCfg;
    onEnable() {
        [this.curRuneCfg, this.curPos] = this.args[0];
        this._updateList();
    }

    onDisable() {
        this.curPos = null;
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    onGetMore() {
        this.close();
        GlobalUtil.openGainWayTips(601101);
    }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.runeItemPrefab,
                cb_host: this,
                async: true,
                gap_y: 3,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList() {
        this._initListView();
        let data = [];
        let temp = [];
        let recommend = [];
        let curUseItem = [];
        let conflictTypeItem = [];
        let curSameTypeItem = [];

        let runeItems = ModelManager.get(RuneModel).runeItems;
        let heroInfo = ModelManager.get(HeroModel).curHeroInfo;
        let careerType = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', heroInfo.careerId).career_type;
        let antherRuneType = [];
        if (heroInfo.runes[1 - this.curPos]) {
            let cfg = ConfigManager.getItemById(RuneCfg, parseInt(heroInfo.runes[1 - this.curPos].toString().slice(0, 6)))
            antherRuneType.push(cfg.type);
            if (cfg.mix_type) {
                antherRuneType.push(cfg.mix_type);
            }
        }

        runeItems.sort((a, b) => {
            let cfgA = ConfigManager.getItemById(RuneCfg, parseInt(a.itemId.toString().slice(0, 6)));
            let cfgB = ConfigManager.getItemById(RuneCfg, parseInt(b.itemId.toString().slice(0, 6)));
            if (cfgA.color == cfgB.color) {
                if (cfgA.level == cfgB.level) {
                    return cfgB.rune_id - cfgA.rune_id;
                }
                else {
                    return cfgB.level - cfgA.level;
                }
            }
            else {
                return cfgB.color - cfgA.color;
            }
        });
        runeItems.forEach(item => {
            if (this.curRuneCfg && item.itemId == this.curRuneCfg.rune_id) {
                curUseItem.push({
                    pos: this.curPos,
                    item: item,
                    isCurUse: true
                })
            }
            else {
                let cfg = ConfigManager.getItemById(RuneCfg, parseInt(item.itemId.toString().slice(0, 6)));
                if (antherRuneType.indexOf(cfg.type) !== -1) {
                    conflictTypeItem.push({
                        pos: this.curPos,
                        item: item,
                        isCurUse: false
                    })
                }
                else if (this.curRuneCfg && this.curRuneCfg.type == cfg.type && this.curRuneCfg.level < cfg.level) {
                    curSameTypeItem.push({
                        pos: this.curPos,
                        item: item,
                        isCurUse: false
                    })
                }
                else if (cfg.recommended.indexOf(careerType) !== -1 && (!this.curRuneCfg || cfg.color >= this.curRuneCfg.color)) {
                    recommend.push({
                        pos: this.curPos,
                        item: item,
                        isCurUse: false
                    })
                }
                else {
                    temp.push({
                        pos: this.curPos,
                        item: item,
                        isCurUse: false
                    })
                }
            }
        });
        if (this.curRuneCfg && curUseItem.length <= 0) {
            let info = new icmsg.RuneInfo();
            info.id = this.curRuneCfg.rune_id;
            info.num = 1;
            let item = {
                series: null,
                itemId: this.curRuneCfg.rune_id,
                itemNum: 1,
                type: BagType.RUNE,
                extInfo: info
            }
            curUseItem.push({
                pos: this.curPos,
                item: item,
                isCurUse: true
            })
        }

        data = [...curSameTypeItem, ...recommend, ...temp, ...conflictTypeItem];

        if (curUseItem[0]) {
            this.scrollView.node.height = 403;
            let ctrl = this.curUseItem.getComponent(RuneSelectItemCtrl);
            ctrl._update(curUseItem[0]);
        }
        else {
            this.curUseItem.active = false;
            this.scrollView.node.height = 585;
        }

        this.list.clear_items();
        this.list.set_data(data);
    }
}
