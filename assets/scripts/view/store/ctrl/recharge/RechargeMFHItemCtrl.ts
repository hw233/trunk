import RechargeMFNItemCtrl from './RechargeMFNItemCtrl';
import UiListItem from '../../../../common/widgets/UiListItem';
import { StoreCfg } from '../../../../a/config';
/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-10-29 10:52:06 
  */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/store/recharge/RechargeMFHItemCtrl")
export default class RechargeMFHItemCtrl extends UiListItem {
    @property([cc.Node])
    items: cc.Node[] = [];

    cfgs: StoreCfg[] = [];
    updateView() {
        this.cfgs = this.data[0];
        this.items.forEach((item, idx) => {
            let cfg = this.cfgs[idx];
            if (cfg) {
                item.active = true;
                let c = item.getComponent(RechargeMFNItemCtrl);
                c.updateView(cfg);
            }
            else {
                item.active = false;
            }
        });
    }
}
