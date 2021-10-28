import ConfigManager from '../../../common/managers/ConfigManager';
import InstanceModel from '../model/InstanceModel';
import ModelManager from '../../../common/managers/ModelManager';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { RuneunlockCfg } from '../../../a/config';

/**
 * @Description: 符文副本
 * @Author: yaozu.hu
 * @Date: 2020-09-22 09:59:41
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-10-13 19:03:11
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/SubInstanceRuneShowViewCtrl")
export default class SubInstanceRuneShowViewCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null


    @property(cc.Prefab)
    subHeroItem: cc.Prefab = null;

    list: ListView = null
    listData: any[] = []
    get model() { return ModelManager.get(InstanceModel); }

    onEnable() {
        this._updateDataLater()
    }

    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.subHeroItem,
            cb_host: this,
            resize_cb: this._updateDataLater,
            column: 1,
            gap_x: 0,
            gap_y: 10,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }

    _updateDataLater() {
        gdk.Timer.callLater(this, this._updateScroll)
    }

    _updateScroll(ref: boolean = false) {
        this._initListView()
        this.listData = []
        let cfgs = ConfigManager.getItems(RuneunlockCfg);
        let id = 0;
        let temCfgs = []
        let temData: RuneunlockCfg[][] = []
        cfgs.forEach(cfg => {
            if (id != cfg.star) {
                if (id != 0) {
                    temData.push(temCfgs)
                }
                temCfgs = [cfg]

                id = cfg.star;
            } else {
                temCfgs.push(cfg);
            }
        })
        temData.push(temCfgs)
        temData.forEach(data => {
            let lock = data[0].star > this.model.runeInfo.maxStageId;
            let tem = { cfgs: data, lock: lock }
            this.listData.push(tem);
        })
        this.list.set_data(this.listData)
    }
}
