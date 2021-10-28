import BagUtils from '../../../../../common/utils/BagUtils';
import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import HeroLockTipsCtrl from '../common/HeroLockTipsCtrl';
import HeroModel from '../../../../../common/models/HeroModel';
import HeroUtils from '../../../../../common/utils/HeroUtils';
import MercenaryModel from '../../../../mercenary/model/MercenaryModel';
import ModelManager from '../../../../../common/managers/ModelManager';
import PanelId from '../../../../../configs/ids/PanelId';
import ResonatingModel from '../../../../resonating/model/ResonatingModel';
import StarUpHeroSelectItemCtrl from './StarUpHeroSelectItemCtrl';
import { BagType } from '../../../../../common/models/BagModel';
import { HeroCfg } from '../../../../../a/config';
import { ListView, ListViewDir } from '../../../../../common/widgets/UiListview';
import { StartUpMaterialType } from './StarUpdateMaterialsItemCtrl';
import { StarUpEventId } from '../../../enum/StarUpEventId';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-08-25 13:42:23 
  */// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/main/star/MaterialsSelectViewCtrl")
export default class MaterialsSelectViewCtrl extends gdk.BasePanel {
    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    info: StartUpMaterialType;
    selectHeroMap: any = {};  // (材料Idx)idx-number[]  
    list: ListView;
    replaceItemIdMaps: any = {}; //   'group'- {star-itemIds[]} , group:11(3-火<潜力> 4-水<魅力>5-风<灵力>三系) 12(五系)
    onLoad() {
        this.replaceItemIdMaps = ModelManager.get(HeroModel).replaceItemIdMaps;
    }

    onEnable() {
        let args = this.args;
        [this.info, this.selectHeroMap] = [args[0][0], args[0][1]];
        this._updateNum();
        this._updateList();
    }

    onDisable() {
        this.info = null;
        this.selectHeroMap = {};
        if (this.list) {
            this.list.destroy();
            this.list = null;
        }
    }

    onSelectAllBtnClick() {
        let needNum = this.info.materials.num;
        let curIdxList: number[] = this.selectHeroMap[this.info.idx] || [];
        if (curIdxList.length == needNum) {
            return;
        }
        if (this.list.datas.length - 1 < needNum) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_TIP42"));
            return;
        }

        let mercenaryModel = ModelManager.get(MercenaryModel)
        let m_list = mercenaryModel.lentHeroList
        let mercenaryIds = []
        m_list.forEach(element => {
            mercenaryIds.push(element.heroId)
        });

        let crystalModel = ModelManager.get(ResonatingModel);

        let autoList: {
            data: any,
            idx: number
        }[] = [];
        let model = ModelManager.get(HeroModel);
        let upFightList = [...model.curUpHeroList(0), ...model.curUpHeroList(1)];
        let ifFull: boolean = false;
        for (let i = 0; i < this.list.datas.length; i++) {
            let data = this.list.datas[i];
            if (data.itemType) {
                let list = [...upFightList, ...curIdxList];
                if (data.heroInfo) {
                    if ((list.indexOf(data.heroInfo.heroId) !== -1
                        || mercenaryIds.indexOf(data.heroInfo.heroId) !== -1
                        || data.heroInfo.switchFlag)
                        || crystalModel.getHeroInUpList(data.heroInfo.heroId)) {
                        continue;
                    }
                }
                else if (data.itemId) {
                    if (list.indexOf(data.itemId) !== -1) {
                        continue;
                    }
                }

                autoList.push({
                    data: data,
                    idx: i
                });
                if (autoList.length + curIdxList.length == needNum) {
                    ifFull = true;
                    break;
                }
            }
        }

        if (!ifFull) {
            gdk.gui.showMessage(gdk.i18n.t("i18n:HERO_TIP42"));
        }
        else {
            autoList.forEach(d => {
                this._selectItem(d.data, d.idx);
            });
        }
    }

    onConfirmBtnClick() {
        gdk.e.emit(StarUpEventId.STAR_UPDATE_MATERIALS_HERO_SELECT, [JSON.parse(JSON.stringify(this.selectHeroMap))]);
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
                gap_y: 25,
                async: true,
                direction: ListViewDir.Vertical,
            })
            this.list.onClick.on(this._selectItem, this);
        }
    }

    _updateNum() {
        let list: number[] = this.selectHeroMap[this.info.idx] || [];
        this.num.string = `${list.length}/${this.info.materials.num}`;
    }

    _updateList() {
        this._initList();
        let typeId;
        if (this.info.targetHeroId.toString().length > 6) {
            typeId = parseInt(this.info.targetHeroId.toString().slice(0, 6));
        }
        else {
            typeId = HeroUtils.getHeroInfoByHeroId(this.info.targetHeroId).typeId;
        }
        let curIdxList = [];
        let others = [];
        for (let key in this.selectHeroMap) {
            if (parseInt(key) == this.info.idx) {
                curIdxList = this.selectHeroMap[key];
            }
            else {
                others = others.concat([...this.selectHeroMap[key]]);
            }
        };
        let data = [];
        let fight = [];

        let model = ModelManager.get(HeroModel);
        let heroInfos = model.heroInfos;
        let cfg = ConfigManager.getItemById(HeroCfg, typeId);
        heroInfos.sort((a, b) => {
            let infoA = <icmsg.HeroInfo>a.extInfo;
            let cfgA = <HeroCfg>BagUtils.getConfigById(a.itemId);
            let infoB = <icmsg.HeroInfo>b.extInfo;
            let cfgB = <HeroCfg>BagUtils.getConfigById(b.itemId);
            if (cfgA.group[0] == cfgB.group[0]) {
                return infoA.level - infoB.level;
            }
            else {
                return cfgA.group[0] - cfgB.group[0];
            }
        })
        heroInfos.forEach(item => {
            let info: icmsg.HeroInfo = <icmsg.HeroInfo>item.extInfo;
            if (ConfigManager.getItemById(HeroCfg, info.typeId).group[0] == 6) return;
            //未被其他材料栏选中 且 满足星级
            if ((this.info.materials.type == 3 || this.info.targetHeroId !== info.heroId) && others.indexOf(info.heroId) == -1 && info.star == this.info.materials.star) {
                if (this.info.materials.type == 1 || this.info.materials.type == 3) {
                    //同id 
                    if (info.typeId == cfg.id) {
                        let d = {
                            heroInfo: info,
                            selected: curIdxList.indexOf(info.heroId) == -1 ? false : true,
                            pageType: 1,
                            itemType: BagType.HERO,
                            itemId: null
                        }
                        if (!HeroUtils.heroLockCheck(info, false)) {
                            data.push(d);
                        }
                        else {
                            fight.push(d);
                        }
                    }
                }
                else if (this.info.materials.type == 2) {
                    //同阵营 
                    if (ConfigManager.getItemById(HeroCfg, info.typeId).group[0] == cfg.group[0]) {
                        let d = {
                            heroInfo: info,
                            selected: curIdxList.indexOf(info.heroId) == -1 ? false : true,
                            pageType: 1,
                            itemType: BagType.HERO,
                            itemId: null
                        }
                        if (!HeroUtils.heroLockCheck(info, false)) {
                            data.push(d);
                        }
                        else {
                            fight.push(d);
                        }
                    }
                }
                else {
                    //任意
                    let d = {
                        heroInfo: info,
                        selected: curIdxList.indexOf(info.heroId) == -1 ? false : true,
                        pageType: 1,
                        itemType: BagType.HERO,
                        itemId: null
                    }
                    if (!HeroUtils.heroLockCheck(info, false)) {
                        data.push(d);
                    }
                    else {
                        fight.push(d);
                    }
                }
            }
        });

        //获取更多英雄按钮  占格子
        let first = {
            heroInfo: null,
            selected: false,
            pageType: 1,
            itemType: null,
            itemId: null
        }

        //替代材料
        let itemInfo = [];
        if (this.info.materials.type != 1 && this.info.materials.type != 3) {
            let itemIds: number[] = [];
            let groups: number[] = [cfg.group[0]];
            if (this.info.materials.type == 0) {
                groups = [1, 2, 3, 4, 5];
            }
            groups.forEach(group => {
                let ids = this.replaceItemIdMaps[group][this.info.materials.star];
                if (ids && ids.length > 0) {
                    ids.forEach(id => {
                        let num = BagUtils.getItemNumById(id) || 0;
                        for (let i = 0; i < num; i++) {
                            let customId = parseInt(`${id}${i}`); // id+idx 同一道具保证id的唯一性  前6位固定为id
                            if (itemIds.indexOf(customId) == -1) {
                                itemIds.push(customId);
                            }
                        }
                    });
                }
            });
            itemIds.forEach(id => {
                if (others.indexOf(id) == -1) {
                    itemInfo.push({
                        heroInfo: null,
                        selected: curIdxList.indexOf(id) == -1 ? false : true,
                        pageType: 1,
                        itemType: BagType.ITEM,
                        itemId: id
                    })
                }
            });
        }

        data = [first, ...itemInfo, ...data, ...fight];
        this.list.clear_items();
        this.list.set_data(data);
    }

    _selectItem(data, i) {
        if (data.itemType) {
            let curIdxList: number[] = this.selectHeroMap[this.info.idx] || [];
            let item = this.list.items[i].node;

            if (data.itemType == BagType.HERO) {
                if (HeroUtils.heroLockCheck(data.heroInfo, false)) {
                    gdk.panel.open(PanelId.HeroLockTips, (node: cc.Node) => {
                        let ctrl = node.getComponent(HeroLockTipsCtrl);
                        ctrl.initArgs(data.heroInfo.heroId, [], () => { this.list.select_item(i) });
                    });
                    return
                }
            }

            let id = data.itemType == BagType.HERO ? data.heroInfo.heroId : data.itemId;
            if (curIdxList.indexOf(id) == -1 && curIdxList.length >= this.info.materials.num) {
                GlobalUtil.showMessageAndSound(gdk.i18n.t("i18n:HERO_TIP48"))
                return;
            }
            if (item) {
                let ctrl = item.getComponent(StarUpHeroSelectItemCtrl);
                ctrl.check();
            }
            else {
                data.selected = true;
            }
            let idx = curIdxList.indexOf(id);
            if (idx == -1) {
                curIdxList.push(id);
            }
            else {
                curIdxList.splice(idx, 1);
            }
            this.selectHeroMap[this.info.idx] = curIdxList;
            this._updateNum();
            this.list.refresh_items();
        }
    }
}
