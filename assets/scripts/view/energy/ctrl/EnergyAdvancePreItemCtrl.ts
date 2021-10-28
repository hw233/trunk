import ConfigManager from '../../../common/managers/ConfigManager';
import UiListItem from '../../../common/widgets/UiListItem';
import { Energystation_typeCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-01-27 10:53:03 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/energy/EnergyAdvancePreItemCtrl")
export default class EnergyAdvancePreItemCtrl extends UiListItem {
    @property(cc.Label)
    titleLab: cc.Label = null;

    @property(cc.Label)
    atkLab: cc.Label = null;

    @property(cc.Label)
    hpLab: cc.Label = null;

    @property(cc.Label)
    defLab: cc.Label = null;

    @property(cc.Label)
    campLab: cc.Label = null;

    info: {
        type: number,
        desc: string,
        dAtk: number,
        dHp: number,
        dDef: number,
        dCampStr: string,
        isCurClass: boolean,
    }
    updateView() {
        this.info = this.data;
        let typeCfg = ConfigManager.getItemById(Energystation_typeCfg, this.info.type);
        this.titleLab.string = this.info.desc;
        this.atkLab.string = `${typeCfg.name}${gdk.i18n.t('i18n:ROLE_TIP36')}+${Math.floor(this.info.dAtk)}%`;
        this.hpLab.string = `${typeCfg.name}${gdk.i18n.t('i18n:ROLE_TIP34')}+${Math.floor(this.info.dHp)}%`;
        this.defLab.string = `${typeCfg.name}${gdk.i18n.t('i18n:ROLE_TIP37')}+${Math.floor(this.info.dDef)}%`;
        this.campLab.string = this.info.dCampStr.length == 0 ? '' : `${typeCfg.name}` + this.info.dCampStr;
        cc.find('curFlag', this.node).active = this.info.isCurClass;
        let color = cc.color().fromHEX(this.info.isCurClass ? '#00FF00' : '#F1B77F');
        this.atkLab.node.color = this.hpLab.node.color = this.defLab.node.color = this.campLab.node.color = color;
    }
}
