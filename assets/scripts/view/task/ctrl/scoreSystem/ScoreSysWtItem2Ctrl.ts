import { Score_problemCfg } from '../../../../a/config';
/**
 * @Author: luoyong
 * @Description:
 * @Date: 2019-08-08 20:00:58
 * @Last Modified by: sthoo.huang
 * @Last Modified time: 2020-12-19 15:11:26
 */



const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/task/scoreSystem/ScoreSysWtItem2Ctrl")
export default class ScoreSysWtItem2Ctrl extends cc.Component {

    @property(cc.RichText)
    descLab: cc.RichText = null;

    _problemCfg: Score_problemCfg

    onEnable() {

    }

    updateViewInfo(cfg: Score_problemCfg) {
        this._problemCfg = cfg
        this.descLab.string = cfg.desc
    }
}