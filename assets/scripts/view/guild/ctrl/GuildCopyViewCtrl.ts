import ActUtil from '../../act/util/ActUtil';
import ConfigManager from '../../../common/managers/ConfigManager';
import ExpeditionModel from './expedition/ExpeditionModel';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import { Guild_enterCfg, SystemCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-24 16:32:57
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildCopyViewCtrl")
export default class GuildCopyViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    copyItem: cc.Prefab = null;

    list: ListView;

    onEnable() {
        this._updateViewInfo()
    }

    onDisable() {
        ModelManager.get(ExpeditionModel).isEnterCity = false
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.copyItem,
                cb_host: this,
                column: 1,
                gap_x: 0,
                gap_y: 0,
                async: true,
                direction: ListViewDir.Vertical,
            });
        }
    }

    _updateViewInfo() {
        this._initList()
        let cfgs = ConfigManager.getItems(Guild_enterCfg)
        GlobalUtil.sortArray(cfgs, (a, b) => {
            return a.sorting - b.sorting
        })
        let showDatas = []
        for (let i = 0; i < cfgs.length; i++) {
            let sysCfg = ConfigManager.getItemById(SystemCfg, cfgs[i].system)
            if (sysCfg) {
                if (ActUtil.ifActOpen(sysCfg.activity) || [2835, 2922].indexOf(sysCfg.id) !== -1) {
                    showDatas.push(cfgs[i])
                }
            }
        }
        this.list.set_data(showDatas)
    }
}