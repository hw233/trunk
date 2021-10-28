import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import StringUtils from '../../../common/utils/StringUtils';
import TaskModel from '../model/TaskModel';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import {
    GlobalCfg,
    Mission_main_lineCfg,
    Store_pushCfg,
    StoreCfg
    } from '../../../a/config';
import { HeroCfg } from '../../../../boot/configs/bconfig';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { TaskEventId } from '../enum/TaskEventId';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/MainLineShowHeroCtrl")
export default class MainLineShowHeroCtrl extends gdk.BasePanel {


    @property(cc.Node)
    bgMask: cc.Node = null;

    @property(cc.Node)
    bg1: cc.Node = null;

    @property(cc.Node)
    bg2: cc.Node = null;

    @property(sp.Skeleton)
    heroSpine: sp.Skeleton = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    giftItem: cc.Prefab = null;

    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;

    @property(cc.Node)
    giftContent: cc.Node = null;

    @property(cc.Label)
    giftNameLab: cc.Label = null;

    @property(cc.ProgressBar)
    proBar: cc.ProgressBar = null;

    @property(cc.Label)
    proLab: cc.Label = null;

    list: ListView = null;

    _speed = 200

    onEnable() {

        gdk.e.on(TaskEventId.UPDATE_TASK_AWARD_STATE, this.updateViewInfo, this)

        let heroCfg = ConfigManager.getItemById(HeroCfg, 300075)
        let url = StringUtils.format("spine/hero/{0}/0.5/{0}", heroCfg.skin);
        this.heroSpine.node.scaleX = -2
        this.heroSpine.node.scaleY = 2
        GlobalUtil.setSpineData(this.node, this.heroSpine, url, true, "run", true, false);

        this.bg1.x = 0
        this.bg2.x = this.bgMask.width

        this.updateViewInfo()
        this._updateGift()
    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    update(dt) {
        this.bg1.x -= dt * this._speed
        if (this.bg1.x <= -this.bgMask.width) {
            this.bg1.x = this.bgMask.width
        }

        this.bg2.x -= dt * this._speed
        if (this.bg2.x <= -this.bgMask.width) {
            this.bg2.x = this.bgMask.width
        }
    }

    updateViewInfo() {
        let cfgs = ConfigManager.getItems(Mission_main_lineCfg)
        let showDatas: Mission_main_lineCfg[] = []
        cfgs.forEach(cfg => {
            if (cfg.show_hero > 0 || cfg.show_reward > 0) {
                showDatas.push(cfg)
            }
        });
        this._initListView()
        this.list.set_data(showDatas)

        let getCount = 0
        for (let i = 0; i < showDatas.length; i++) {
            let geted = ModelManager.get(TaskModel).rewardIds[showDatas[i].id]
            if (geted) {
                getCount++
            }
        }
        this.proBar.progress = getCount / showDatas.length
        this.proLab.string = `${getCount}/${showDatas.length}`
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.giftItem,
            cb_host: this,
            column: 3,
            row: 2,
            gap_x: 0,
            gap_y: 0,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    _updateGift() {
        this.giftContent.removeAllChildren();
        let pushCfg = ConfigManager.getItemById(Store_pushCfg, 670001)
        this.giftNameLab.string = `${pushCfg.name}`
        pushCfg.items.forEach(item => {
            let id = item[0];
            let num = item[1];
            let slot = this.createSlot(id, num);
            this.giftContent.addChild(slot)
        });
    }


    createSlot(id: number, num: number): cc.Node {
        let slot = cc.instantiate(this.slotPrefab);
        slot.scale = 0.7
        let ctrl = slot.getComponent(UiSlotItem);
        ctrl.updateItemInfo(id, num);
        ctrl.itemInfo = {
            series: 0,
            itemId: id,
            itemNum: num,
            type: BagUtils.getItemTypeById(id),
            extInfo: null
        };
        return slot;
    }

    onActiveTip() {
        gdk.panel.setArgs(PanelId.HelpTipsPanel, 160);
        gdk.panel.open(PanelId.HelpTipsPanel)
    }


    onGuideFunc() {
        gdk.panel.hide(PanelId.MainLineShowHero)
        let panel = gdk.panel.get(PanelId.PveReady)
        if (!panel) {
            gdk.panel.open(PanelId.PveReady)
        }
        GuideUtil.setGuideId(106101)
    }

}