import GlobalUtil from '../../../common/utils/GlobalUtil';
import HBItemCtrl from './HBItemCtrl';
import { HBItemType } from './HBViewCtrl';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-11-18 10:14:26 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/lottery/HBHItemCtrl")
export default class HBHItemCtrl extends cc.Component {
    @property(cc.Node)
    careerIcon: cc.Node = null;

    @property(cc.Node)
    careerLab: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    updateView(data, careerType) {
        let datas: HBItemType[] = data;
        let iconUrl = ['view/lottery/texture/book/tj_sheshou', , 'view/lottery/texture/book/tj_paoshou', 'view/lottery/texture/book/tj_shouwei'];
        let titleUrl = ['view/lottery/texture/book/tj_qiangbingyingxiong', , 'view/lottery/texture/book/tj_paobingyingxiong', 'view/lottery/texture/book/tj_shouweiyingxiong'];
        GlobalUtil.setSpriteIcon(this.node, this.careerIcon, iconUrl[careerType - 1]);
        GlobalUtil.setSpriteIcon(this.node, this.careerLab, titleUrl[careerType - 1]);
        this.content.removeAllChildren();
        datas.forEach(d => {
            let node = cc.instantiate(this.itemPrefab);
            node.parent = this.content;
            let ctrl = node.getComponent(HBItemCtrl);
            ctrl.updateView(d);
        });
        // this.content.getComponent(cc.Layout).updateLayout();
        // this.node.getComponent(cc.Layout).updateLayout();
    }
}
