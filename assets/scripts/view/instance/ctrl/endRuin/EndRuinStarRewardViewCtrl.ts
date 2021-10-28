import ConfigManager from '../../../../common/managers/ConfigManager';
import CopyModel, { CopyEventId } from '../../../../common/models/CopyModel';
import CopyUtil from '../../../../common/utils/CopyUtil';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import { Copy_ruin_rewardCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

/** 
 * @Description:末日废墟星星奖励界面
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-01-21 20:42:44
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/endruin/EndRuinStarRewardViewCtrl")
export default class EndRuinStarRewardViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;

    list: ListView = null
    get model(): CopyModel { return ModelManager.get(CopyModel); }
    chapterId: number = 0;
    curStarNum: number = 0;
    onEnable() {
        gdk.e.on(CopyEventId.CHANGE_COPY_ENDRUIN_CHAPTER, this.close, this);
        let arg = gdk.panel.getArgs(PanelId.EndRuinStarRewardView);
        this.chapterId = arg[0];
        this.curStarNum = arg[1];
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
        let cfgs = ConfigManager.getItemsByField(Copy_ruin_rewardCfg, 'chapter', this.chapterId);
        cfgs.forEach(cfg => {
            let state = 3;
            if (cfg.star <= this.curStarNum) {
                state = 1;
                if (CopyUtil.getEndRuinChapterStarRewardState(this.chapterId, cfg.star)) {
                    state = 2;
                }
            }
            let data = { cfg: cfg, chapterId: this.chapterId, curStarNum: this.curStarNum, state: state };
            listData.push(data);
        })
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
