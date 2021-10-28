import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import HeroUtils from '../../../common/utils/HeroUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { Hero_careerCfg, HeroCfg } from '../../../a/config';
import { LotteryEventId } from '../enum/LotteryEventId';
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HeroAllResetItemCtrl")
export default class HeroAllResetItemCtrl extends cc.Component {
    @property(UiSlotItem)
    slot: UiSlotItem = null;

    @property(cc.Node)
    select: cc.Node = null;

    id: number;
    isSelect: boolean = true;
    updateView(id: number) {
        this.id = id;
        let info = HeroUtils.getHeroInfoByHeroId(id);
        let cfg = <HeroCfg>BagUtils.getConfigById(info.typeId);
        this.slot.group = cfg.group[0];
        this.slot.starNum = info.star;
        this.slot.career = ConfigManager.getItemByField(Hero_careerCfg, 'career_id', info.careerId).career_type;
        this.slot.updateItemInfo(info.typeId);
        this.slot.node.getChildByName('lvLab').getComponent(cc.Label).string = '.' + info.level + '';
        this.isSelect = true;
        this.select.active = this.isSelect;
    }

    onClick() {
        this.isSelect = !this.isSelect;
        this.select.active = this.isSelect;
        gdk.e.emit(LotteryEventId.HERO_ALL_RESET_SELECT, [this.id]);
    }
}
