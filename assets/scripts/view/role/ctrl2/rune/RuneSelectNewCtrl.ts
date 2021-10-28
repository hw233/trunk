import BagUtils from '../../../../common/utils/BagUtils';
import ConfigManager from '../../../../common/managers/ConfigManager';
import HeroModel from '../../../../common/models/HeroModel';
import ModelManager from '../../../../common/managers/ModelManager';
import RuneModel from '../../../../common/models/RuneModel';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagEvent } from '../../../bag/enum/BagEvent';
import { Global_powerCfg, Rune_unlockCfg, RuneCfg } from '../../../../a/config';
import { ListView, ListViewDir } from '../../../../common/widgets/UiListview';
import { RoleEventId } from '../../enum/RoleEventId';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneSelectNewCtrl")
export default class RuneSelectNewCtrl extends gdk.BasePanel {

    @property([cc.Node])
    runeNodes: cc.Node[] = [];

    @property([cc.Button])
    runeTypeBtns: cc.Button[] = [];

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    selectItemPrefab: cc.Prefab = null;

    selectRuneType: number = 0;

    list: ListView;

    get runeModel(): RuneModel { return ModelManager.get(RuneModel); }
    get heroModel(): HeroModel { return ModelManager.get(HeroModel); }
    get heroInfo(): icmsg.HeroInfo { return this.heroModel.curHeroInfo; }


    onEnable() {

        gdk.e.on(BagEvent.UPDATE_BAG_ITEM, this._refreshViewInfo, this);
        gdk.e.on(BagEvent.UPDATE_ONE_ITEM, this._refreshViewInfo, this);

        let arg = this.args[0]
        this._runeClick(arg);
        //符文
        for (let i = 0; i < this.runeNodes.length; i++) {
            this.runeNodes[i].on(cc.Node.EventType.TOUCH_END, () => {
                this._runeClick(i);
            }, this)
        }
        this._refreshViewInfo()
    }

    onDisable() {
        gdk.e.targetOff(this)
    }

    _refreshViewInfo() {
        this.selectRuneFunc(null, this.selectRuneType)
        this._updateRune()
    }

    _initListView() {
        if (!this.list) {
            this.list = new ListView({
                scrollview: this.scrollView,
                mask: this.scrollView.node,
                content: this.content,
                item_tpl: this.selectItemPrefab,
                cb_host: this,
                async: true,
                column: 5,
                gap_x: 5,
                gap_y: 5,
                direction: ListViewDir.Vertical,
            })
        }
    }

    _updateListData() {
        this._initListView()
        let inHeros = this.runeModel.runeInHeros
        let items = this.runeModel.runeItems
        inHeros = this._sortDatas(inHeros)
        items = this._sortDatas(items)
        let runeItems = [...inHeros, ...items]
        let datas = []
        if (this.selectRuneType == 0) {
            datas = [...runeItems]
        }
        else {
            [...runeItems].forEach(item => {
                let cfg = ConfigManager.getItemById(RuneCfg, parseInt(item.itemId.toString().slice(0, 6)));
                if (cfg.color == this.selectRuneType) {
                    datas.push(item);
                }
            });
        }
        this.list.set_data(datas)
    }

    _sortDatas(datas) {
        datas.sort((a, b) => {
            let cfgA = ConfigManager.getItemById(RuneCfg, parseInt(a.itemId.toString().slice(0, 6)));
            let cfgB = ConfigManager.getItemById(RuneCfg, parseInt(b.itemId.toString().slice(0, 6)));
            if (cfgA.color == cfgB.color) {
                if (cfgA.level == cfgB.level) {
                    return cfgB.rune_id - cfgA.rune_id;
                }
                else {
                    return cfgB.level - cfgA.level;
                }
            }
            else {
                return cfgB.color - cfgA.color;
            }
        });
        return datas
    }

    //符文槽点击
    _runeClick(idx: number) {
        this._clearSelect()
        this.heroModel.curRuneSelectIndex = idx
        let select = this.runeNodes[idx].getChildByName("select");
        select.active = true
        this.selectRuneFunc(null, this.selectRuneType)
    }

    _clearSelect() {
        for (let i = 0; i < this.runeNodes.length; i++) {
            let select = this.runeNodes[i].getChildByName("select")
            select.active = false
        }
    }

    /**选择页签,*/
    selectRuneFunc(e, utype) {
        this.selectRuneType = parseInt(utype)
        for (let idx = 0; idx < this.runeTypeBtns.length; idx++) {
            const element = this.runeTypeBtns[idx];
            let nodeName = element.name
            let group = parseInt(nodeName.substring('group'.length));
            element.interactable = group != this.selectRuneType
            let select = element.node.getChildByName("select")
            select.active = group == this.selectRuneType
        }
        this._updateListData()
    }

    _updateRune() {
        if (!this.heroInfo) {
            return;
        }
        for (let i = 0; i < this.runeNodes.length; i++) {
            this._refreshRuneInfo(i);
        }
    }

    _refreshRuneInfo(idx: number) {
        let node = this.runeNodes[idx];
        let slot = node.getComponent(UiSlotItem);
        let lock = node.getChildByName('lock');
        let lockLab = lock.getChildByName('limitLab').getComponent(cc.Label);
        let nameLab = cc.find("bg/nameLab", node).getComponent(cc.Label);
        let powerLab = node.getChildByName("powerLab").getComponent(cc.Label);
        let descLab = node.getChildByName("descLab").getComponent(cc.RichText);
        let add = node.getChildByName("add")
        add.active = false

        let lv = node.getChildByName('lv').getComponent(cc.Label);
        let limitCfg = ConfigManager.getItemById(Rune_unlockCfg, `${idx + 1}`);
        let runId = this.heroInfo.runes[idx];
        lv.node.active = false;
        lock.active = false;
        if (limitCfg.level && this.heroInfo.level < limitCfg.level) {
            lock.active = true;
            lockLab.string = `${limitCfg.level}${gdk.i18n.t("i18n:HERO_TIP8")}`;
        }
        else if (limitCfg.star && this.heroInfo.star < limitCfg.star) {
            lock.active = true;
            lockLab.string = `${limitCfg.star}${gdk.i18n.t("i18n:HERO_TIP9")}`;
        }
        if (runId) {
            slot.updateItemInfo(parseInt(runId.toString().slice(0, 6)));
            lv.node.active = true;
            let cfg = ConfigManager.getItemById(RuneCfg, parseInt(runId.toString().slice(0, 6)))
            lv.string = '.' + cfg.level;

            nameLab.string = cfg.name
            let colorInfo = BagUtils.getColorInfo(cfg.color);
            nameLab.node.color = new cc.Color().fromHEX(colorInfo.color);
            nameLab.node.getComponent(cc.LabelOutline).color = new cc.Color().fromHEX(colorInfo.outline);

            let attStr = ['atk', 'hp', 'def', 'hit', 'dodge'];
            let extraPower = 0;
            attStr.forEach(str => {
                let ratio = ConfigManager.getItemByField(Global_powerCfg, 'key', str).value;
                extraPower += Math.floor(ratio * cfg[`hero_${str}`]);
            });
            powerLab.string = `${gdk.i18n.t('i18n:RUNE_TIP17')}:${cfg.power + extraPower}`;
            descLab.string = cfg.des
        }
        else {
            slot.updateQuality(-1);
            slot.updateItemIcon(null);
            powerLab.string = ``
            descLab.string = ``
            if (!lock.active) {
                nameLab.string = gdk.i18n.t('i18n:RUNE_TIP46')
                add.active = true
            } else {
                nameLab.string = gdk.i18n.t('i18n:RUNE_TIP47')
            }
            nameLab.node.color = cc.color("#c0917c")
            nameLab.node.getComponent(cc.LabelOutline).color = cc.color(`#371c14`)
        }
    }

}