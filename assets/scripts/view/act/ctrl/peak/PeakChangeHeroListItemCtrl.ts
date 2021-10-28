import GlobalUtil from '../../../../common/utils/GlobalUtil';
import PeakChangeViewHeroItemCtrl from './PeakChangeViewHeroItemCtrl';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Peak_conversionCfg } from '../../../../a/config';


/** 
 * @Description: 巅峰之战转换英雄View heroListItem
 * @Author: yaozu.hu
 * @Date: 2021-02-23 10:37:28
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-02-27 17:33:30
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/peak/PeakChangeHeroListItemCtrl")
export default class PeakChangeHeroListItemCtrl extends UiListItem {


    @property(cc.Sprite)
    careerIcon: cc.Sprite = null;
    @property(cc.Sprite)
    careerName: cc.Sprite = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Prefab)
    heroItem: cc.Prefab = null;

    iconStr: string[] = ['tj_sheshou', '', 'tj_paoshou', 'tj_shouwei'];
    nameStr: string[] = ['tj_qiangbingyingxiong', '', 'tj_paobingyingxiong', 'tj_shouweiyingxiong'];
    type: number = 1;

    info: { type: number, heros: Peak_conversionCfg[] }
    updateView() {
        this.info = this.data;
        let path1 = 'view/lottery/texture/book/' + this.iconStr[this.info.type - 1]
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, path1);
        let path2 = 'view/lottery/texture/book/' + this.nameStr[this.info.type - 1]
        GlobalUtil.setSpriteIcon(this.node, this.careerName, path2);
        this.content.removeAllChildren();
        if (this.info.heros.length == 0) {

        } else {
            this.info.heros.forEach(cfg => {
                let node = cc.instantiate(this.heroItem);
                let ctrl = node.getComponent(PeakChangeViewHeroItemCtrl)
                ctrl.data = { cfg: cfg, isGray: false, isList: true }
                ctrl.updateView();
                node.setParent(this.content);
            })
        }
    }

}
