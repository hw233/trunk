import ConfigManager from '../../../../common/managers/ConfigManager';
import HeroDetailViewCtrl from '../HeroDetailViewCtrl';
import PanelId from '../../../../configs/ids/PanelId';
import UiSlotItem from '../../../../common/widgets/UiSlotItem';
import { HeroCfg } from '../../../../a/config';


const { ccclass, property } = cc._decorator;

@ccclass
export default class GeneTransUpHeroItemCtrl extends cc.Component {

    @property(UiSlotItem)
    slot: UiSlotItem = null;

    heroId: number = 0;

    initHeroInfo(heroId: number) {
        this.heroId = heroId;
        this.slot.updateItemInfo(heroId);
    }

    itemClick() {
        if (this.heroId > 0) {
            gdk.panel.open(PanelId.HeroDetail, (node: cc.Node) => {
                let comp = node.getComponent(HeroDetailViewCtrl)
                let heroCfg = ConfigManager.getItemByField(HeroCfg, 'id', this.heroId)
                comp.initHeroInfo(heroCfg)
            })
        }
    }

}
