import ActUtil from '../../../act/util/ActUtil';
import ConfigManager from '../../../../common/managers/ConfigManager';
import JumpUtils from '../../../../common/utils/JumpUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import TaskModel from '../../model/TaskModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { Mission_daily_ritualCfg, SystemCfg } from '../../../../a/config';

/** 
 * @Description: 殿堂指挥官挑战记录界面
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-18 10:51:24
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class MustDoTaskViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;

    list: ListView = null
    get model(): TaskModel { return ModelManager.get(TaskModel); }

    onEnable() {
        // let msg1 = new icmsg.ArenaInfoReq();
        // NetManager.send(msg1);
        let msg = new icmsg.RitualListReq()
        NetManager.send(msg, (rsp: icmsg.RitualListRsp) => {
            this.model.mustDoData = rsp;
            this._updateScroll();
        }, this);

    }
    _updateScroll() {
        this._initListView()
        let listData = []
        let overData = [];
        let cfgIdList = []
        this.model.mustDoData.list.forEach(data => {
            if (data.id > 0) {
                let cfg = ConfigManager.getItemById(Mission_daily_ritualCfg, data.id);
                if (cfg) {
                    cfgIdList.push(cfg.id);
                    let temData = { cfg: cfg, data: data }
                    if (data.remain == 0 && data.time == 0 && data.total != 0 && !(cfg.id == 4 || cfg.id == 15)) {
                        overData.push(temData)
                    } else {
                        listData.push(temData);
                    }
                }
            }
        })
        listData.sort((a, b) => {
            return a.cfg.index - b.cfg.index;
        })
        overData.sort((a, b) => {
            return a.cfg.index - b.cfg.index;
        })
        let nOpenData = []
        let cfgs = ConfigManager.getItems(Mission_daily_ritualCfg);
        cfgs.sort((a, b) => {
            return a.index - b.index;
        })
        cfgs.forEach(cfg => {
            if (cfgIdList.indexOf(cfg.id) < 0) {
                let systemCfg = ConfigManager.getItemById(SystemCfg, cfg.forward);
                if (cc.js.isNumber(systemCfg.activity)) {
                    if (ActUtil.ifActOpen(systemCfg.activity) && !JumpUtils.ifSysOpen(cfg.forward)) {
                        let tem = new icmsg.RitualInfo()
                        tem.id = cfg.id;
                        tem.remain = 0;
                        tem.time = 0;
                        tem.total = 0;
                        nOpenData.push({ cfg: cfg, data: tem });
                        cfgIdList.push(cfg.id);
                    }
                } else {
                    if (!JumpUtils.ifSysOpen(cfg.forward)) {
                        let tem = new icmsg.RitualInfo()
                        tem.id = cfg.id;
                        tem.remain = 0;
                        tem.time = 0;
                        tem.total = 0;
                        nOpenData.push({ cfg: cfg, data: tem });
                        cfgIdList.push(cfg.id);
                    }
                }
            }

        })

        listData = listData.concat(nOpenData).concat(overData)
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
            gap_y: 10,
            async: true,
            resize_cb: this._updateDataLater,
            direction: ListViewDir.Vertical,
        })

        //this.list.onClick.on(this._selectItem, this);
    }
    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }
}
