import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import NetManager from '../../../../common/managers/NetManager';
import RuneMaterialsItemCtrl from './RuneMaterialsItemCtrl';
import RuneModel from '../../../../common/models/RuneModel';
import RuneUtils from '../../../../common/utils/RuneUtils';
import StringUtils from '../../../../common/utils/StringUtils';
import { BagItem } from '../../../../common/models/BagModel';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RuneCfg } from '../../../../a/config';
import { RuneEventId } from '../../enum/RuneEventId';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-04 17:35:20 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneMaterialsSelectViewCtrl")
export default class RuneMaterialsSelectViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    tips: cc.Node = null;

    @property(cc.Node)
    titleNode: cc.Node = null;

    @property(cc.Node)
    selectAllBtn: cc.Node = null;

    info: RuneMaterialType;
    selectRuneMap: any = {}; // costType-runeIds[]
    list: ListView;
    cfg: RuneCfg;
    needNum: number;
    onEnable() {
        let args = this.args[0];
        [this.info, this.selectRuneMap] = [args[0], args[1]];
        this.cfg = ConfigManager.getItemById(RuneCfg, parseInt(this.info.targetRuneId.toString().slice(0, 6)));
        this.needNum = [this.cfg.consumption_main[0][1], this.cfg.consumption_material[0][2]][this.info.costTpye];
        GlobalUtil.setSpriteIcon(this.node, this.titleNode, this.info.costTpye == 0 ? 'view/role/texture/rune/gh_xuanzhezhufuwen' : 'view/role/texture/rune/yx_xuanzhecailiaofuwen');
        GlobalUtil.setSpriteIcon(this.node, this.tips, this.info.costTpye == 0 ? 'view/role/texture/rune/yx_fuwentxt03' : 'view/role/texture/rune/yx_fuwentxt02');
        this.node.getChildByName('botTips').getComponent(cc.Label).string = this.info.costTpye == 0 ? gdk.i18n.t('i18n:RUNE_TIP28') : gdk.i18n.t('i18n:RUNE_TIP29');
        this._updateList();
        this._updateNum();
    }

    onDisable() {
        this.info = null;
        this.selectRuneMap = {};
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    onSelectAllBtnClick() {
        let curIdxList: number[] = this.selectRuneMap[this.info.costTpye] || [];
        if (curIdxList.length == this.needNum) {
            return;
        }
        if (this.list.datas.length - 1 < this.needNum) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:RUNE_TIP7"));
            return;
        }
        let autoList: {
            data: any,
            idx: number
        }[] = [];
        let isFull: boolean = false;
        for (let i = 0; i < this.list.datas.length; i++) {
            let data = this.list.datas[i];
            // && data.runeId.toString().length < 12
            if (data.runeId) {
                if (curIdxList.indexOf(data.runeId) == -1) {
                    autoList.push({
                        data: data,
                        idx: i
                    });
                    if (autoList.length + curIdxList.length == this.needNum) {
                        isFull = true;
                        break;
                    }
                }
            }
        }
        if (!isFull) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:RUNE_TIP7"));
        }
        else {
            autoList.forEach(d => {
                this._selectItem(d.data, d.idx);
            });
        }
    }

    onConfirmBtnClick() {
        gdk.e.emit(RuneEventId.RUNE_MERGE_MATERIALS_SELECT, [JSON.parse(JSON.stringify(this.selectRuneMap))]);
        this.close();
    }

    _initList() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.itemPrefab,
                cb_host: this,
                column: 4,
                gap_x: 8,
                gap_y: 10,
                async: true,
                direction: ListViewDir.Vertical,
            })
            this.list.onClick.on(this._selectItem, this);
        }
    }

    _updateNum() {
        let list: number[] = this.selectRuneMap[this.info.costTpye] || [];
        this.num.string = `${list.length}/${this.needNum}`;
    }

    _updateList() {
        this._initList();
        let curIdxList = this.selectRuneMap[this.info.costTpye] || [];
        let otherList = this.selectRuneMap[1 - this.info.costTpye] || [];
        let mainCfg = ConfigManager.getItemByField(RuneCfg, 'rune_id', this.cfg.consumption_main[0][0]);
        let items: BagItem[] = this.info.costTpye == 0 ? RuneUtils.getMaterialsRune([mainCfg.type, mainCfg.color, 0]) : RuneUtils.getMaterialsRune(this.cfg.consumption_material[0]);
        items.sort((a, b) => {
            let cfgA = ConfigManager.getItemById(RuneCfg, parseInt(a.itemId.toString().slice(0, 6)));
            let cfgB = ConfigManager.getItemById(RuneCfg, parseInt(b.itemId.toString().slice(0, 6)));
            if (cfgA.level == cfgB.level) {
                return cfgA.rune_id - cfgB.rune_id;
            }
            else {
                return cfgB.level - cfgA.level;
            }
        });
        let itemIds: number[] = [];
        items.forEach(item => {
            if (item) {
                let num = item.itemNum;
                let id = item.itemId;
                for (let i = 0; i < num; i++) {
                    let customId = parseInt(`${id}${i}`); // id+idx 同一道具保证id的唯一性  固定前6位为id
                    if (itemIds.indexOf(customId) == -1) {
                        itemIds.push(customId);
                    }
                }
            }
        });

        let list = [];
        itemIds.forEach(id => {
            if (otherList.indexOf(id) == -1) {
                let d = {
                    runeId: id,
                    selected: curIdxList.indexOf(id) !== -1,
                    materialType: this.info
                };
                list.push(d);
            }
        });

        //英雄身上的符文(只考虑主符文的选择)
        let itemInHeros: number[] = [];
        if (this.info.costTpye == 0) {
            this.selectAllBtn.active = false
            let bagRuneItems = ModelManager.get(RuneModel).runeInHeros
            bagRuneItems.sort((a, b) => {
                let cfgA = ConfigManager.getItemById(RuneCfg, parseInt(a.itemId.toString().slice(0, 6)));
                let cfgB = ConfigManager.getItemById(RuneCfg, parseInt(b.itemId.toString().slice(0, 6)));
                return cfgB.level - cfgA.level;
            });

            bagRuneItems.forEach(item => {
                let cfg = ConfigManager.getItemById(RuneCfg, parseInt(item.itemId.toString().slice(0, 6)))
                if (cfg.type == this.cfg.type && cfg.color == mainCfg.color) {
                    //唯一id id+heroTypeId+heroId  6+6+n
                    let heroId = (<icmsg.RuneInfo>item.extInfo).heroId;
                    let customId = parseInt(`${item.itemId}${HeroUtils.getHeroInfoByHeroId(heroId).typeId}${heroId}`);
                    itemInHeros.push(customId);
                }
            });
        }

        let list2 = [];
        itemInHeros.forEach(id => {
            if (otherList.indexOf(id) == -1) {
                let d = {
                    runeId: id,
                    selected: curIdxList.indexOf(id) !== -1,
                    materialType: this.info
                };
                list2.push(d);
            }
        });
        //获取更多英雄按钮  占格子
        let first = {
            runeId: null,
            selected: false,
            materialType: this.info,
        }
        let data = [first, ...list2, ...list];
        this.list.clear_items();
        this.list.set_data(data);
        this.tips.active = data.length == 1;
    }

    _selectItem(data, i) {
        if (data.runeId) {
            let curIdxList = this.selectRuneMap[this.info.costTpye] || [];
            let item = this.list.items[i].node;
            let id = data.runeId;
            if (curIdxList.indexOf(id) == -1 && curIdxList.length == this.needNum) {
                gdk.gui.showMessage(gdk.i18n.t("i18n:RUNE_TIP8"));
                return;
            }
            // if (data.runeId.toString().length >= 12) {
            //     gdk.gui.showMessage('该符文已被装备,请先卸下');
            //     return;
            // }


            if (this.info.costTpye == 0) {
                let realItemId = parseInt(id.toString().slice(0, 6));
                let runeCfg = ConfigManager.getItemById(RuneCfg, realItemId)
                if (runeCfg && runeCfg.level < this.cfg.level - 1) {
                    let hasNum = BagUtils.getItemNumById(runeCfg.strengthening[0][0]);
                    let costNum: number = runeCfg.strengthening[0][1];
                    let topLv: number = runeCfg.level + 1;
                    let nextCfg = ConfigManager.getItemByField(RuneCfg, 'id', runeCfg.id, { level: runeCfg.level + 1 });
                    while (nextCfg &&
                        nextCfg.strengthening &&
                        nextCfg.strengthening.length > 0) {
                        costNum += nextCfg.strengthening[0][1];
                        topLv = nextCfg.level + 1;
                        nextCfg = ConfigManager.getItemByField(RuneCfg, 'id', nextCfg.id, { level: nextCfg.level + 1 });
                    }
                    GlobalUtil.openAskPanel({
                        descText: StringUtils.format(gdk.i18n.t('i18n:RUNE_TIP44'), costNum, topLv),
                        sureCb: () => {
                            if (costNum > hasNum) {
                                gdk.gui.showMessage(gdk.i18n.t('i18n:RUNE_TIP45'))
                            } else {
                                let heroId = parseInt(id.toString().slice(12))
                                let req = new icmsg.RuneUpgradeReq();
                                req.heroId = heroId
                                req.runeId = runeCfg.rune_id;
                                req.top = true;
                                NetManager.send(req, (resp: icmsg.RuneUpgradeRsp) => {
                                    if (!cc.isValid(this.node)) return;
                                    if (!this.node.activeInHierarchy) return;
                                    this._updateList()
                                    if (item) {
                                        let ctrl = item.getComponent(RuneMaterialsItemCtrl);
                                        ctrl.check();
                                    }
                                });
                            }
                        }
                    });
                    return
                }
            }

            if (item) {
                let ctrl = item.getComponent(RuneMaterialsItemCtrl);
                ctrl.check();
            }
            else {
                data.selected = !data.selected;
            }
            let idx = curIdxList.indexOf(id);
            if (idx == -1) {
                curIdxList.push(id);
            }
            else {
                curIdxList.splice(idx, 1);
            }
            this.selectRuneMap[this.info.costTpye] = curIdxList;
            this._updateNum();
        }
    }
}

export type RuneMaterialType = {
    targetRuneId: number,
    costTpye: number // 0-main 1-material
}
