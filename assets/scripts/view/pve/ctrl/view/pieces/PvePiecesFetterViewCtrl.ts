import ConfigManager from '../../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../../common/utils/GlobalUtil';
import PiecesUtils from '../../../../pieces/utils/PiecesUtils';
import UiSlotItem from '../../../../../common/widgets/UiSlotItem';
import { Pieces_fetterCfg, Pieces_heroCfg } from '../../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-05-20 13:44:31 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/pve/view/pieces/PvePiecesFetterViewCtrl")
export default class PvePiecesFetterViewCtrl extends gdk.BasePanel {
    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Node)
    heroContent: cc.Node = null;

    @property(cc.Prefab)
    heroPrefab: cc.Prefab = null;

    @property(cc.Node)
    detailsContent: cc.Node = null;

    @property(cc.Node)
    detailItem: cc.Node = null;

    cfgs: Pieces_fetterCfg[] = [];
    onEnable() {
        this.cfgs = this.args[0];
        GlobalUtil.setSpriteIcon(this.node, this.icon, `view/pve/texture/ui/pieces/${this.cfgs[0].icon}`);
        this.nameLab.string = this.cfgs[0].name;
        let heros = PiecesUtils.getSatisfyFetterHero(this.cfgs[0].fetter_type);
        let satisfyTypeId = [];
        heros.forEach(h => { satisfyTypeId.push(h.typeId); });
        this.cfgs[0].hero_id.forEach(l => {
            let item = cc.instantiate(this.heroPrefab);
            item.parent = this.heroContent;
            item.setScale(.73, .73);
            let ctrl = item.getComponent(UiSlotItem);
            ctrl.updateItemInfo(l);
            let c = ConfigManager.getItemByField(Pieces_heroCfg, 'hero_id', l);
            ctrl.updateQuality(c.color);
            GlobalUtil.setAllNodeGray(item, satisfyTypeId.indexOf(l) == -1 ? 1 : 0);
        });

        let curActiveId = PiecesUtils.getCurActiveFetterId(this.cfgs[0].fetter_type);
        this.detailsContent.removeAllChildren();
        this.cfgs.forEach((c, idx) => {
            let n = cc.instantiate(this.detailItem);
            n.parent = this.detailsContent;
            cc.find('condition/num', n).getComponent(cc.Label).string = c.required + '';
            let desc = cc.find('desc', n).getComponent(cc.RichText);
            desc.string = c.effect;
            n.height = desc.node.height + 10;
            desc.node.color = cc.color().fromHEX(curActiveId == c.id ? `#e09724` : `#9D9188`);
        });
    }
}
