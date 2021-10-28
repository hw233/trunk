import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import HeroModel from '../../../../common/models/HeroModel';
import HeroUtils from '../../../../common/utils/HeroUtils';
import ModelManager from '../../../../common/managers/ModelManager';
import PanelId from '../../../../configs/ids/PanelId';
import UiListItem from '../../../../common/widgets/UiListItem';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { BagItem } from '../../../../common/models/BagModel';
import { Hero_careerCfg, RuneCfg } from '../../../../a/config';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/role2/rune/RuneSelectNewItemCtrl")
export default class RuneSelectNewItemCtrl extends UiListItem {

    @property(UiSlotItem)
    slotItem: UiSlotItem = null

    @property(cc.Node)
    select: cc.Node = null;

    @property(cc.Node)
    heroNode: cc.Node = null;

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Node)
    recommend: cc.Node = null;

    _item: BagItem
    _cfg: RuneCfg
    _runeInfo: icmsg.RuneInfo

    updateView() {
        this._item = this.data
        this._cfg = ConfigManager.getItemById(RuneCfg, parseInt(this._item.itemId.toString().slice(0, 6)));
        this._runeInfo = <icmsg.RuneInfo>this._item.extInfo;
        this.slotItem.updateItemInfo(this._cfg.rune_id, this._item.itemNum);
        this.lvLabel.string = '.' + this._cfg.level + '';

        let curPos = ModelManager.get(HeroModel).curRuneSelectIndex
        let heroInfo = ModelManager.get(HeroModel).curHeroInfo;


        if (this._runeInfo.heroId) {
            this.heroNode.active = true;
            let h_info = HeroUtils.getHeroInfoByHeroId(this._runeInfo.heroId);
            GlobalUtil.setSpriteIcon(this.node, cc.find('New Node/heroIcon', this.heroNode), HeroUtils.getHeroHeadIcon(h_info.typeId, h_info.star));
            this.recommend.active = false
        } else {
            this.heroNode.active = false;
            let curRuneCfg: RuneCfg;
            if (heroInfo.runes[curPos]) {
                curRuneCfg = ConfigManager.getItemById(RuneCfg, parseInt(heroInfo.runes[curPos].toString().slice(0, 6)));
            }
            let careerType = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', heroInfo.careerId).career_type;
            this.recommend.active = this._cfg.recommended.indexOf(careerType) !== -1 && (!curRuneCfg || this._cfg.color >= curRuneCfg.color);
        }

        let otherPos = curPos == 0 ? 1 : 0
        GlobalUtil.setAllNodeGray(this.node, 0)
        let otherRuneCfg: RuneCfg;
        if (heroInfo.runes[otherPos]) {
            otherRuneCfg = ConfigManager.getItemById(RuneCfg, parseInt(heroInfo.runes[otherPos].toString().slice(0, 6)));
        }
        if (otherRuneCfg) {
            let ot = otherRuneCfg.mix_type ? [otherRuneCfg.type, otherRuneCfg.mix_type] : [otherRuneCfg.type];
            let nt = this._cfg.mix_type ? [this._cfg.type, this._cfg.mix_type] : [this._cfg.type];
            let sameType: boolean = false;
            for (let i = 0; i < nt.length; i++) {
                if (ot.indexOf(nt[i]) !== -1) {
                    sameType = true;
                    break;
                }
            }
            if (sameType) {
                if (this._runeInfo.heroId != heroInfo.heroId) {
                    GlobalUtil.setAllNodeGray(this.node, 1)
                }
            }
        }
    }

    _itemSelect() {
        if (this._item) {
            this.select.active = this.ifSelect
        }
    }

    _itemClick() {
        gdk.panel.setArgs(PanelId.RuneInfo, [this._runeInfo.id, ModelManager.get(HeroModel).curRuneSelectIndex, this._runeInfo.heroId]);
        gdk.panel.open(PanelId.RuneInfo);
    }


}