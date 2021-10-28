import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel from '../../../../common/models/CopyModel';
import CopyUtil from '../../../../common/utils/CopyUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import { Copy_stageCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
 * @Description:末日废墟每日奖励界面
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-01-27 12:00:29
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class EndRuinEveryDayTaskViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;

    list: ListView = null
    get model(): CopyModel { return ModelManager.get(CopyModel); }

    onEnable() {

        this._updateScroll();

    }

    onDisable() {
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
    }

    _updateScroll() {
        this._initListView()
        let listData = []

        //获取最新的3星通关关卡
        let temCfg = this.model.endRuinCfgs[0];
        let firstNums = CopyUtil.getEndRuinStageState(temCfg.id);
        let firstState = firstNums[0] == 1 && firstNums[1] == 3
        this.model.endRuinCfgs.forEach(cfg => {
            let temNums = CopyUtil.getEndRuinStageState(cfg.id);
            if (temNums[0] == 1 && temNums[1] == 3) {
                temCfg = cfg;
                firstState = true;
            }
        })
        let isChapterPlayer = CopyUtil.getIsEndRuinChapterPlayer();
        let stateNum = firstState ? 1 : 3;
        if (firstState && this.model.endRuinStateData.raidsStage == temCfg.id) {
            stateNum = 2;
        }
        let data1 = { cfg: temCfg, state: stateNum, times: this.model.endRuinStateData.raids, isChapterPlayer: isChapterPlayer }
        listData.push(data1);
        let cfg2 = ConfigManager.getItemByField(Copy_stageCfg, 'pre_condition', temCfg.id)
        if (cfg2) {
            let data2 = { cfg: cfg2, state: 3, times: this.model.endRuinStateData.raids, isChapterPlayer: isChapterPlayer }
            listData.push(data2);
            let cfg3 = ConfigManager.getItemByField(Copy_stageCfg, 'pre_condition', cfg2.id)
            if (cfg3) {
                let data3 = { cfg: cfg3, state: 3, times: this.model.endRuinStateData.raids, isChapterPlayer: isChapterPlayer }
                listData.push(data3);
            }
        }

        this.list.set_data(listData);
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scroll,
            mask: this.scroll.node,
            content: this.content,
            item_tpl: this.itemPre,
            cb_host: this,
            column: 1,
            gap_y: 0,
            async: true,
            resize_cb: this._updateDataLater,
            direction: ListViewDir.Vertical,
        })
    }
    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }
}
