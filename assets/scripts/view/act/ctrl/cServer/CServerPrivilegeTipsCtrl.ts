import CarnivalUtil from '../../util/CarnivalUtil';
import { Carnival_cross_rankCfg } from '../../../../a/config';





/** 
 * @Description:跨服狂欢界面
 * @Author: yaozu.hu
 * @Date: 2021-01-08 14:16:11
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2021-04-01 11:27:42
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
export default class CServerPrivilegeTipsCtrl extends gdk.BasePanel {

    @property([cc.Label])
    lbList: cc.Label[] = [];
    @property([cc.Label])
    addList: cc.Label[] = [];

    @property([cc.Node])
    desNodes: cc.Node[] = [];


    showNum: boolean = true;
    curCfg: Carnival_cross_rankCfg;
    onEnable() {

        let arg = this.args
        if (arg && arg.length > 0) {
            this.showNum = true;
            this.curCfg = arg[0];
        } else {
            this.showNum = false;
        }
        let cfgs = CarnivalUtil.getCrossRankConfigs();
        if (this.showNum) {
            this.lbList.forEach((lb, i) => {
                this.addList[i].node.active = true;
                if (cc.js.isNumber(this.curCfg['privilege' + (i + 1)])) {
                    this.desNodes[i].active = true;
                    this.addList[i].node.active = true;
                    this.addList[i].string = this.curCfg['privilege' + (i + 1)]
                    lb.string = cfgs[i].desc.split('%')[0];
                } else {
                    this.desNodes[i].active = false;
                }
            })
        } else {
            this.lbList.forEach((lb, i) => {
                this.desNodes[i].active = true;
                this.addList[i].node.active = false;
                if (cfgs[i]) {
                    lb.string = cfgs[i].preview
                }
            })
        }
    }
}
