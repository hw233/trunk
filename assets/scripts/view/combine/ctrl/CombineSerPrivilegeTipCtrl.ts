import CombineUtils from '../util/CombineUtils';
import { Combine_cross_rankCfg } from '../../../a/config';

/**
 * @Description: 合服狂欢 特权tip
 * @Author: luoyong
 * @Date: 2019-07-19 16:45:14
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-05-07 14:00:13
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/combine/CombineSerPrivilegeTipCtrl")
export default class CombineSerPrivilegeTipCtrl extends gdk.BasePanel {

    @property([cc.Label])
    lbList: cc.Label[] = [];
    @property([cc.Label])
    addList: cc.Label[] = [];

    @property([cc.Node])
    desNodes: cc.Node[] = [];

    showNum: boolean = true;
    curCfg: Combine_cross_rankCfg;
    onEnable() {
        let arg = this.args
        if (arg && arg.length > 0) {
            this.showNum = true;
            this.curCfg = arg[0];
        } else {
            this.showNum = false;
        }
        let cfgs = CombineUtils.getCrossRankConfigs();
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
