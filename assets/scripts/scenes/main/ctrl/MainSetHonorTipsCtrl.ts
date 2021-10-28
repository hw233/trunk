import MainSethonorItemCtrl from './MainSetHonorItemCtrl';
import PanelId from '../../../configs/ids/PanelId';
import { MainsetHonorData } from './MainSetCtrl';

/**
 * @Description: 个人名片-荣耀展示tips
 * @Author: yaozu.hu
 * @Date: 2019-03-28 17:21:18
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-05-10 11:51:33
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainSetHonorTipsCtrl")
export default class MainSetHonorTipsCtrl extends gdk.BasePanel {

    @property(cc.Node)
    honorList: cc.Node = null;
    @property(cc.Prefab)
    honorItem: cc.Prefab = null;

    honorDatas: MainsetHonorData[] = []

    onEnable() {
        let arg = gdk.panel.getArgs(PanelId.MainSetHonorTips)
        if (arg) {
            this.honorDatas = arg[0];
            this.honorList.removeAllChildren()
            this.honorDatas.forEach(honorData => {
                let node = cc.instantiate(this.honorItem)
                let ctrl = node.getComponent(MainSethonorItemCtrl)
                ctrl.updateView(honorData);
                node.setParent(this.honorList);
            })
        }
    }
}
