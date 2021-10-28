import ConfigManager from '../../../common/managers/ConfigManager';
import HeroUtils from '../../../common/utils/HeroUtils';
import SubEliteChallengeHeroItemCtrl from './SubEliteChallengeHeroItemCtrl';
import UiListItem from '../../../common/widgets/UiListItem';
import { Copycup_heroCfg } from '../../../a/config';

/** 
 * @Description: 新奖杯模式挑战模式选择英雄界面
 * @Author: yaozu.hu  
 * @Date: 2020-08-20 11:06:18 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2020-10-12 11:38:47
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/instance/SubEliteChallengeItemCtrl")
export default class SubEliteChallengeItemCtrl extends UiListItem {

    @property([cc.Node])
    heroNodes: cc.Node[] = [];

    @property([SubEliteChallengeHeroItemCtrl])
    ctrls: SubEliteChallengeHeroItemCtrl[] = []

    heros: number[];

    select: number;

    updateView() {
        this.heros = this.data.heros;
        this.select = this.data.select;
        this.refreshItem();
    }
    refreshItem() {
        let i = 0;
        this.ctrls.forEach(ctrl => {
            let cfg = ConfigManager.getItemById(Copycup_heroCfg, this.heros[i])
            let data = HeroUtils.createCopyCupHeroBagItemBy(cfg.id);
            let isSelect = false;
            let gray = false;
            if (this.select > 0) {
                isSelect = this.select == cfg.id;
                gray = this.select != cfg.id
            }
            ctrl.initData(data, this.heros[i], isSelect, gray, this.changSelect, this)
            i++;
        })
    }

    changSelect(heroId: number) {
        this.select = heroId;
        this.data.select = heroId;
        this.refreshItem();
    }


}
