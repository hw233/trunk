import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import VaultHeroItem from './VaultHeroItemCtrl';
import VaultModel from '../model/VaultModel';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';
import { VaultCfg } from '../../../a/config';


/** 
 * @Description: 殿堂指挥官挑战记录界面
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-01-12 16:03:33
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class VaultAttackListViewCtrl extends gdk.BasePanel {

    @property(cc.Node)
    heroLayout: cc.Node = null;
    @property(cc.Prefab)
    heroPre: cc.Prefab = null;
    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    itemPre: cc.Prefab = null;

    list: ListView = null

    posData: icmsg.PositionInfo
    cfg: VaultCfg = null;
    get model(): VaultModel { return ModelManager.get(VaultModel); }

    onEnable() {
        let args = gdk.panel.getArgs(PanelId.VaultAttackListView);
        this.cfg = args[0];
        this.posData = args[1];
        this.heroLayout.removeAllChildren()
        for (let i = 1; i <= 6; i++) {
            if (this.cfg['place_' + i]) {
                let node = cc.instantiate(this.heroPre);
                let ctrl = node.getComponent(VaultHeroItem);
                ctrl.data = this.cfg['place_' + i]
                ctrl.updateView();
                node.setParent(this.heroLayout);
            }
        }
        this._updateScroll();
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }


    _updateScroll() {
        this._initListView()
        let temData = []
        this.posData.recordList.forEach(data => {
            if (data.playerId > 0) {
                temData.push(data);
            }
        })
        this.list.set_data(temData);
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
