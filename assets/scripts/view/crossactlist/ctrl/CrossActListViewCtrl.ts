import { SystemCfg, System_crosslistCfg } from '../../../a/config';
import ConfigManager from '../../../common/managers/ConfigManager';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import RedPointUtils from '../../../common/utils/RedPointUtils';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import ActUtil from '../../act/util/ActUtil';

/**
 * @Description: 跨服活动列表
 * @Author: yaozu.hu
 * @Date: 2021-01-22 17:19:33
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-06-19 10:51:07
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/crossActList/CrossActListViewCtrl")
export default class CrossActListViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    instanceItem: cc.Prefab = null;

    @property(cc.Node)
    dropBtn: cc.Node = null;

    list: ListView;
    recordRedPointIdx: number;
    onEnable() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.instanceItem,
                cb_host: this,
                async: true,
                resize_cb: this.updateListViewContent,
                column: 1,
                gap_x: 0,
                gap_y: -30,
                direction: ListViewDir.Vertical,
            });
            this.scrollView.node.on("scroll-ended", this.on_scrollended, this);
        }

        this._updateListData(true)
    }
    onDisable() {
        this.scrollView.node.off("scroll-ended", this.on_scrollended, this);
        gdk.e.targetOff(this);
        gdk.Timer.clearAll(this);
    }

    onDestroy() {
        this.list && this.list.destroy();
        this.list = null;
    }

    updateListViewContent() {
        gdk.Timer.callLater(this, this._updateListViewContentLater);
    }

    _updateListViewContentLater(resetPos: boolean = true): void {
        this._updateListData(resetPos);
        let guide = GuideUtil.getCurGuide();

        // let bindBtns = [1102, 1101, 1105, 1103, 1106, 1104]//[1100, 1101, 1102, 1103, 1104]
        // if (guide && bindBtns.indexOf(guide.bindBtnId) != -1) {
        //     gdk.Timer.callLater(this, () => {
        //         this.list.scroll_to(bindBtns.indexOf(guide.bindBtnId));
        //     })
        // }
    }

    _updateListData(resetPos: boolean = false) {
        let listData = [];
        let cfgs = ConfigManager.getItems(System_crosslistCfg);

        let lockData = []
        cfgs.forEach(cfg => {

            if (cfg.system == 2877) {
                //let actIds = [76, 77, 78];
                let isInAct = true;
                // for (let i = 0; i < actIds.length; i++) {
                //     if (ActUtil.ifActOpen(actIds[i])) {
                //         isInAct = true;
                //         break;
                //     }
                // }
                if (isInAct && JumpUtils.ifSysOpen(cfg.system, false)) {
                    let data = { cfg: cfg, lock: false };
                    listData.push(data);
                }
                else {
                    let data = { cfg: cfg, lock: true };
                    lockData.push(data);
                }
            } else if (cfg.system == 2919) {
                let roleModel = ModelManager.get(RoleModel);
                let time = roleModel.CrossOpenTime * 1000;
                let startTime = ActUtil.getActStartTime(110);
                let nowTime = GlobalUtil.getServerTime();

                if (!startTime) {
                    if (nowTime - time > (7 * 24 * 60 * 60 - 1) * 1000) {
                        if (ActUtil.checkActOpen(110)) {
                            let data = { cfg: cfg, lock: false };
                            listData.push(data);
                        } else {
                            let data = { cfg: cfg, lock: true };
                            lockData.push(data);
                        }
                    } else {
                        let data = { cfg: cfg, lock: true };
                        lockData.push(data);
                    }
                } else {
                    if (startTime - time > (7 * 24 * 60 * 60 - 1) * 1000) {
                        let data = { cfg: cfg, lock: false };
                        listData.push(data);
                    } else {
                        let data = { cfg: cfg, lock: true };
                        lockData.push(data);
                    }
                }
            } else {
                if (JumpUtils.ifSysOpen(cfg.system, false)) {
                    let data = { cfg: cfg, lock: false };
                    listData.push(data);
                } else {

                    //判断活动时间是否已经结束
                    let sysCfg = ConfigManager.getItemById(SystemCfg, cfg.system);
                    if (cc.js.isNumber(sysCfg.activity) && sysCfg.activity > 0) {
                        if (ActUtil.ifActOpen(sysCfg.activity)) {
                            let data = { cfg: cfg, lock: true };
                            lockData.push(data);
                        } else {
                            let startTime = ActUtil.getNextActStartTime(sysCfg.activity);
                            if (startTime) {
                                let data = { cfg: cfg, lock: true };
                                lockData.push(data);
                            }
                        }
                    }
                }
            }
        })
        listData = listData.concat(lockData)
        if (listData.length == 0) {
            this.close()
            JumpUtils.ifSysOpen(cfgs[1].system, true);
            return;
        }
        this.list.set_data(listData, resetPos);
        this.dropBtn.active = listData.length >= 5;
        if (this.dropBtn.active) {
            this._updateDropBtnRedpoint();
        }
    }

    onDropBtnClick() {
        if (!this.recordRedPointIdx) {
            // let max = this.scrollView.getMaxScrollOffset();
            // let cur = this.scrollView.getScrollOffset();
            // let offset = cc.v2(Math.min(max.x, cur.x), Math.min(max.y, cur.y + 80));
            // this.scrollView.scrollToOffset(offset, .3)
            this.scrollView.scrollToBottom(.3);
        } else {
            this.list.scroll_to(this.recordRedPointIdx);
            this._updateDropBtnRedpoint();
        }
    }

    on_scrollended() {
        this._updateDropBtnRedpoint();
    }

    _updateDropBtnRedpoint() {
        let items = this.list.items;
        let datas = this.list.datas;
        if (datas.length < 5) return;
        let b = false;
        for (let i = items.length - 1; i >= 5; i--) {
            if (items[i].node) {
                break;
            }
            if (!items[i].node) {
                let data = datas[i];
                let r = this._checkUnShowRedPoint(data.cfg.system);
                if (r) {
                    b = r;
                    this.recordRedPointIdx = i;
                    break;
                }
            }
        }
        if (!b) this.recordRedPointIdx = null;
        this.dropBtn.getChildByName('RedPoint').active = b;
    }

    _checkUnShowRedPoint(systemId: number) {
        let result = false;
        switch (systemId) {
            case 2861:
                result = RedPointUtils.is_relic_point_update() || RedPointUtils.has_relic_energy_point() || RedPointUtils.has_relic_reward()
                    || RedPointUtils.has_relic_pass_port_reward() || RedPointUtils.has_relic_task_reward(1) || RedPointUtils.has_relic_task_reward(2)
                break;
            case 2863:
                result = RedPointUtils.is_vault_show_redPoint()
                break;
            case 2868:
                result = RedPointUtils.has_cServer_rank_reward() || RedPointUtils.has_cServer_task_reward() || RedPointUtils.has_cross_treasure_free_times();
                break;
            case 2877:
                result = RedPointUtils.is_ArenaTeam_show_redpoint(true)
                break;
            case 2884:
                result = RedPointUtils.is_peak_show_redPoint()
                break;
            case 2898:
                result = RedPointUtils.is_guardianTower_rain_redpoint()
                break;
            case 2924:
                result = RedPointUtils.is_ArenaHonor_show_redPoint() || RedPointUtils.is_WorldHonor_show_redPoint()
                break;
        }
        return result;
    }
}
