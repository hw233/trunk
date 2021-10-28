import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import ResonatingModel from '../model/ResonatingModel';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { RedPointEvent } from '../../../common/utils/RedPointUtils';
import { Store_star_giftCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-04-09 10:15:45 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/resonating/AssistStarGiftViewCtrl")
export default class AssistStarGiftViewCtrl extends gdk.BasePanel {
    @property(cc.ScrollView)
    rewardScrollView: cc.ScrollView = null;

    @property(cc.Node)
    rewardContent: cc.Node = null;

    @property(cc.ScrollView)
    progressScrollView: cc.ScrollView = null;

    @property(cc.Node)
    progressContent: cc.Node = null;

    @property(cc.Prefab)
    rewardItemPrefab: cc.Prefab = null;

    @property(cc.Label)
    starTotalLab: cc.Label = null;

    get model(): ResonatingModel { return ModelManager.get(ResonatingModel); }

    list: ListView = null;
    cfgs: Store_star_giftCfg[] = [];
    onEnable() {
        if (!this.model.giftViewOpened) {
            this.model.giftViewOpened = true;
            gdk.e.emit(RedPointEvent.RED_POINT_STATUS_UPDATE);
        }
        this.cfgs = ConfigManager.getItems(Store_star_giftCfg);
        NetManager.send(new icmsg.AssistAllianceGiftRecordReq(), (resp: icmsg.AssistAllianceGiftRecordRsp) => {
            if (!cc.isValid(this.node)) return;
            if (!this.node.activeInHierarchy) return;
            this.starTotalLab.string = this.model.allianceMaxStar + '';
            this._initList();
        }, this);
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
        gdk.Timer.clearAll(this);
        NetManager.targetOff(this);
        gdk.e.targetOff(this);
    }

    onGoBtnClick() {
        this.close();
        gdk.panel.setArgs(PanelId.SupportMainView, 4);
        gdk.panel.open(PanelId.SupportMainView);
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.rewardScrollView,
                mask: this.rewardScrollView.node,
                content: this.rewardContent,
                item_tpl: this.rewardItemPrefab,
                cb_host: this,
                async: true,
                gap_y: 5,
                direction: ListViewDir.Vertical,
            })
        }

        this.list.clear_items();
        this.list.set_data(this.cfgs);
        gdk.Timer.callLater(this, () => {
            if (!this.list || !cc.isValid(this.node)) return;
            let bg = this.progressContent.getChildByName('progressBg');
            bg.height = this.rewardContent.height - 100;
            this._updateProgress();
            for (let i = 0; i < this.cfgs.length; i++) {
                let star = this.model.allianceMaxStar;
                if (this.cfgs[i].star_total <= star) {
                    let info = this.model.giftRecords[this.cfgs[i].id] || null;
                    if (!info || info.record < 2) {
                        this.list.scroll_to(Math.max(0, i - 1));
                        this.onTaskScroll();
                        return;
                    }
                }
                else {
                    this.list.scroll_to(Math.max(0, i - 1));
                    this.onTaskScroll();
                    return;
                }
            }
        })
    }

    onTaskScroll() {
        this.progressContent.y = this.rewardContent.y - 50;
    }

    _updateProgress() {
        let bg = this.progressContent.getChildByName('progressBg');
        let bar = bg.getChildByName('progressbar');
        bar.height = 0;
        // let dl = bg.height / this.cfgs.length;
        let dl = 126 + 5;
        let star = this.model.allianceMaxStar;
        for (let i = 0; i < this.cfgs.length; i++) {
            if (this.cfgs[i].star_total <= star) {
                bar.height += (i == 0 ? 20 : dl);
            }
            else {
                let preStar = this.cfgs[i - 1] ? this.cfgs[i - 1].star_total : 0;
                let targetScroe = this.cfgs[i].star_total;
                let ddl = dl / (targetScroe - preStar);
                bar.height += (ddl * (star - preStar));
                return;
            }
        }
        bar.height = Math.min(bg.height, dl * star);
    }
}
