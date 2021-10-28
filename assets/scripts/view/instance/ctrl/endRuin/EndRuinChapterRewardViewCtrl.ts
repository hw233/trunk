import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel, { CopyEventId } from '../../../../common/models/CopyModel';
import CopyUtil from '../../../../common/utils/CopyUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import { Copy_ruin_rewardCfg, Copy_stageCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
 * @Description:末日废墟章节奖励界面
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-01-22 15:24:44
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/endruin/EndRuinChapterRewardViewCtrl")
export default class EndRuinChapterRewardViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;

    list: ListView = null
    get model(): CopyModel { return ModelManager.get(CopyModel); }

    onEnable() {
        gdk.e.on(CopyEventId.CHANGE_COPY_ENDRUIN_CHAPTER, this.close, this);
        this._updateScroll();
    }
    onDisable() {
        gdk.e.targetOff(this)
        if (this.list) {
            this.list.destroy()
            this.list = null;
        }
    }
    _updateScroll() {
        this._initListView()
        let listData = []
        let overData = []
        let cfgs = ConfigManager.getItems(Copy_ruin_rewardCfg);
        let chapterIds: number[] = []
        let maxCfg = ConfigManager.getItemByField(Copy_stageCfg, 'pre_condition', this.model.endRuinStateData.maxStageId, { copy_id: 20 });
        let maxChapterId = 1;
        if (maxCfg) {
            maxChapterId = maxCfg.prize;
        }
        cfgs.forEach(cfg => {
            if (chapterIds.indexOf(cfg.chapter) < 0 && cfg.chapter <= maxChapterId) {
                chapterIds.push(cfg.chapter);
                let starNums = CopyUtil.getEndRuinChapterAllStarNum(cfg.chapter);
                let data = { chapterId: cfg.chapter }
                if (starNums[0] == starNums[1]) {
                    overData.push(data);
                } else {
                    listData.push(data);
                }
            }
        })
        listData = listData.concat(overData)
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
