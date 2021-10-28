import HeroUtils from '../../../../common/utils/HeroUtils';
import PanelId from '../../../../configs/ids/PanelId';
import PveSceneCtrl from '../PveSceneCtrl';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/upgrade/UpgradeEquipCtrl")
export default class UpgradeEquipCtrl extends gdk.BasePanel {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    equipItem: cc.Prefab = null

    list: ListView = null;

    heroInfos: icmsg.HeroInfo[] = []

    onEnable() {
        this._updateView()
    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    onDestroy() {

    }

    _updateView() {
        let pvePanel = gdk.panel.get(PanelId.PveScene)
        if (pvePanel) {
            let model = pvePanel.getComponent(PveSceneCtrl).model;
            for (let i = 0, n = model.heros.length; i < n; i++) {
                let heroInfo = HeroUtils.getHeroInfoById(model.heros[i].model.id)
                if (heroInfo) {
                    this.heroInfos.push(heroInfo)
                }
            }
        }
        this.heroInfos.sort((a, b) => {
            return b.power - a.power
        })
        this._initListView()
        this.list.set_data(this.heroInfos)
    }


    _initListView() {
        if (this.list) {
            return
        }
        this.list = new ListView({
            scrollview: this.scrollView,
            mask: this.scrollView.node,
            content: this.content,
            item_tpl: this.equipItem,
            cb_host: this,
            async: true,
            direction: ListViewDir.Vertical,
        })
    }
}