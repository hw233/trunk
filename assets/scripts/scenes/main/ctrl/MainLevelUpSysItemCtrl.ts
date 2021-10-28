import GlobalUtil from '../../../common/utils/GlobalUtil';
import { ParseMainLineId } from '../../../view/instance/utils/InstanceUtil';
import { SystemCfg } from '../../../a/config';

/** 
 * 升级提示特效
 * @Author: sthoo.huang  
 * @Date: 2019-10-25 20:31:11 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-11 12:04:33
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/scene/main/MainLevelUpSysItemCtrl")
export default class MainLevelUpSysItemCtrl extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Label)
    nameLab: cc.Label = null;

    @property(cc.Label)
    lvLab: cc.Label = null;

    onEnable() {

    }

    updateViewInfo(cfg: SystemCfg) {
        this.nameLab.string = `${cfg.name}:`
        if (cfg.openLv > 0) {
            this.lvLab.string = `${cfg.openLv}级开启`
        } else {
            let aid = ParseMainLineId(cfg.fbId, 1)//地图id编号
            let sid = ParseMainLineId(cfg.fbId, 2);//关卡编号
            this.lvLab.string = `通关主线${aid}-${sid}`
        }
        GlobalUtil.setSpriteIcon(this.node, this.icon, cfg.icon)
    }
}