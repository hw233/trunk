import BagUtils from '../../../common/utils/BagUtils';
import EnergyMaterialsItemCtrl from './EnergyMaterialsItemCtrl';
import HeroLockTipsCtrl from '../../role/ctrl2/main/common/HeroLockTipsCtrl';
import HeroModel from '../../../common/models/HeroModel';
import HeroUtils from '../../../common/utils/HeroUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import { EnergyEventId } from '../enum/EnergyEventId';
import { HeroCfg } from '../../../a/config';
import { ListView, ListViewDir } from '../../../common/widgets/UiListview';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-27 10:51:34 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/energy/EnergyMaterialsViewCtrl")
export default class EnergyMaterialsViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    selectNum: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    list: ListView = null
    limit: number[] = [];
    materialIds: number[] = [];
    onEnable() {
        [this.limit, this.materialIds] = this.args[0];
        this._updateScroll();
        this._updateNum();
    }

    onDisable() {
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    onAllSelectBtnClick() {
        if (this.materialIds.length >= this.limit[2]) {
            return;
        }
        let datas = this.list.datas;
        let selectIdx: number[] = [];
        let tempIds = [...this.materialIds];
        for (let i = 0; i < datas.length; i++) {
            let info = <icmsg.HeroInfo>datas[i].info;
            if (!HeroUtils.heroLockCheck(info, false) && tempIds.indexOf(info.heroId) == -1) {
                selectIdx.push(i);
                tempIds.push(info.heroId);
            }
            if (tempIds.length >= this.limit[2]) {
                break;
            }
        }
        if (tempIds.length < this.limit[2]) {
            gdk.gui.showMessage(gdk.i18n.t('i18n:ENERGY_STATION_TIP3'));
            return;
        }
        selectIdx.forEach(idx => {
            this.list.select_item(idx);
        })
    }

    onSelectBtnClick() {
        gdk.e.emit(EnergyEventId.ENERGY_HERO_MATERIALS_SELECT, [...this.materialIds]);
        this.close();
    }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                column: 4,
                gap_x: 40,
                gap_y: 25,
                async: true,
                direction: ListViewDir.Vertical,
            })
            this.list.onClick.on(this._selectItem, this);
        }
    }

    _updateScroll() {
        this._initListView();
        let datas = [];
        let heros = ModelManager.get(HeroModel).heroInfos;
        heros.forEach(h => {
            let info = <icmsg.HeroInfo>h.extInfo;
            if (info.star == this.limit[1]) {
                let cfg = <HeroCfg>BagUtils.getConfigById(info.typeId);
                if (cfg.group[0] == this.limit[0]) {
                    datas.push({
                        info: info,
                        select: this.materialIds.indexOf(info.heroId) !== -1
                    })
                }
            }
        });

        datas.sort((a, b) => { return a.info.typeId - b.info.typeId; })
        this.list['selectIds'] = [...this.materialIds];
        this.list.clear_items();
        this.list.set_data(datas);
    }

    _selectItem(data: { info: icmsg.HeroInfo, select: boolean }, idx: number) {
        let i = this.materialIds.indexOf(data.info.heroId);
        if (i !== -1) {
            this.materialIds.splice(i, 1);
            let item = this.list.items[idx].node;
            let ctrl = item.getComponent(EnergyMaterialsItemCtrl);
            ctrl.check();
            this.list['selectIds'] = [...this.materialIds];
        }
        else {
            if (this.materialIds.length >= this.limit[2]) {
                gdk.gui.showMessage(gdk.i18n.t('i18n:ENERGY_STATION_TIP4'));
                return;
            }
            let b = HeroUtils.heroLockCheck(data.info, false);
            if (!b) {
                let item = this.list.items[idx].node;
                let ctrl = item.getComponent(EnergyMaterialsItemCtrl);
                ctrl.check();
                this.materialIds.push(data.info.heroId);
                this.list['selectIds'] = [...this.materialIds];
            } else {
                gdk.panel.open(PanelId.HeroLockTips, (node: cc.Node) => {
                    let ctrl = node.getComponent(HeroLockTipsCtrl);
                    ctrl.initArgs(data.info.heroId, [], () => { this.list.select_item(idx) });
                });
                return
            }
        }
        this.list.refresh_items();
        this._updateNum();
    }

    _updateNum() {
        this.selectNum.string = `${this.materialIds.length}/${this.limit[2]}`;
    }
}
