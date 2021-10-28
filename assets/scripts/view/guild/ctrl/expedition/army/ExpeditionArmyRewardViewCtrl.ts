import ActUtil from '../../../../act/util/ActUtil';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import ExpeditionModel from '../ExpeditionModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import UiTabMenuCtrl from '../../../../../common/widgets/UiTabMenuCtrl';
import { Expedition_forcesCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-06-16 11:17:14 
  */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/expedition/army/ExpeditionArmyRewardViewCtrl")
export default class ExpeditionArmyRewardViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    timeLab: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(UiTabMenuCtrl)
    uiTabMenu: UiTabMenuCtrl = null;

    actId: number = 114;
    curSelect: number;
    list: ListView;
    onEnable() {
        let startTime = new Date(ActUtil.getActStartTime(this.actId));
        let endTime = new Date(ActUtil.getActEndTime(this.actId) - 5000); //time为零点,减去5s 返回前一天
        if (!startTime || !endTime) {
            this.timeLab.string = gdk.i18n.t("i18n:ACTIVITY_TIME_TIP1");
        }
        else {
            this.timeLab.string = `${gdk.i18n.t("i18n:ACTIVITY_TIME_TIP2")}${startTime.getFullYear()}.${startTime.getMonth() + 1}.${startTime.getDate()}-${endTime.getFullYear()}.${endTime.getMonth() + 1}.${endTime.getDate()}`;
        }
        let idx = this.args[0] || 0;
        this.uiTabMenu.setSelectIdx(idx, true);
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    onTabMenuSelect(e, data) {
        if (!e) return;
        if (parseInt(data) == this.curSelect) return;
        this.curSelect = parseInt(data);
        this._updateView();
    }

    _updateView() {
        gdk.Timer.callLater(this, this._updateList);
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                gap_y: 5,
                async: true,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateList() {
        this._initList();
        let datas = []
        let cfgs = ConfigManager.getItemsByField(Expedition_forcesCfg, 'type', ModelManager.get(ExpeditionModel).activityType);
        cfgs.forEach(c => {
            datas.push({
                cfg: c,
                type: this.curSelect
            })
        });
        this.list.clear_items();
        this.list.set_data(datas);
        if (this.curSelect == 0) {
            gdk.Timer.callLater(this, () => {
                if (!cc.isValid(this.node)) return;
                if (!this.node.activeInHierarchy) return;
                let curLv = ModelManager.get(ExpeditionModel).armyLv;
                for (let i = 0; i < cfgs.length; i++) {
                    if (cfgs[i].id + 1 == curLv) {
                        this.list.scroll_to(i);
                        break;
                    }
                }
            });
        }
    }
}
