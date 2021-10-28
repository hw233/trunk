import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import UiListItem from '../../../../common/widgets/UiListItem';
import { Costume_attrCfg, Costume_compositeCfg, CostumeCfg } from '../../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-07-21 15:20:03 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/act/costumeCustom/CostumeCustomSelectItemCtrl")
export default class CostumeCustomSelectItemCtrl extends UiListItem {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    state1: cc.Node = null;

    @property(cc.Node)
    state2: cc.Node = null;

    //state1
    @property(cc.Label)
    suitName: cc.Label = null;

    @property(cc.Node)
    suitIcon: cc.Node = null;

    @property(cc.Label)
    suitAtrName1: cc.Label = null;

    @property(cc.Label)
    suitAtrName2: cc.Label = null;

    @property(cc.RichText)
    desc1: cc.RichText = null;

    @property(cc.RichText)
    desc2: cc.RichText = null;

    //state2
    @property(cc.Label)
    selectNameLab: cc.Label = null;

    @property(cc.RichText)
    selectDesc: cc.RichText = null;

    bgUrls: string[] = ['common/texture/role/costume/sz_liebiaodiban', 'common/texture/role/costume/sz_liebiaoxuanzhong'];
    info: {
        selectType: number, //0-选择类型 1-选择部位 2-随机属性1 3-随机属性2
        selectInfo: number,
        suitType: number,  //用于type=0
        color: number,     //用于type=0     
        part: number,      //用于type=1
        randomAttr: number, //用于type=2,3
    }
    updateView() {
        this.info = this.data;
        this.state1.active = false;
        this.state2.active = false;
        this.clear();
        if (this.info.selectType == 0) {
            this._updateType0();
        } else if (this.info.selectType == 1) {
            this._updateType1();
        } else {
            this._updateType23();
        }
    }

    clear() {
        this.desc1.string = '';
        this.desc2.string = '';
        this.selectDesc.string = '';
    }

    _updateType0() {
        this.state1.active = true;
        let cfgs = ConfigManager.getItems(Costume_compositeCfg, (cfg: Costume_compositeCfg) => {
            if (cfg.type == this.info.suitType && cfg.color == this.info.color) {
                return true;
            }
        });
        this.suitName.string = cfgs[0].name;
        GlobalUtil.setSpriteIcon(this.node, this.suitIcon, `view/role/texture/costume/suit/sz_icon_${cfgs[0].type}_s`);
        this.suitAtrName1.string = `${cfgs[0].name}${cfgs[0].num}件套:`;
        this.suitAtrName2.string = `${cfgs[1].name}${cfgs[1].num}件套:`;
        this.desc1.string = cfgs[0].des;
        this.desc2.string = cfgs[1].des;
        GlobalUtil.setSpriteIcon(this.node, this.bg, this.bgUrls[this.info.suitType == this.list['curSelect'] ? 1 : 0]);
    }

    _updateType1() {
        this.state2.active = true;
        let partName = [`${gdk.i18n.t("i18n:BAG_TIP18")}`, `${gdk.i18n.t("i18n:BAG_TIP19")}`, `${gdk.i18n.t("i18n:BAG_TIP20")}`, `${gdk.i18n.t("i18n:BAG_TIP21")}`]
        let costumeCfg = ConfigManager.getItem(CostumeCfg, (cfg: CostumeCfg) => {
            if (cfg.type == this.info.suitType && cfg.part == this.info.part && cfg.custom == 1) {
                return true;
            }
        });
        let attrCfg = ConfigManager.getItemById(Costume_attrCfg, costumeCfg.attr);
        this.selectNameLab.string = `${partName[this.info.part]}:`;
        let vStr = attrCfg.attr_type == 'r' ? `${attrCfg.initial_value[0] / 100}%` : `${attrCfg.initial_value[0]}`
        this.selectDesc.string = `基础属性: ${attrCfg.attr_show}+${vStr}`;
        GlobalUtil.setSpriteIcon(this.node, this.bg, this.bgUrls[this.info.part == this.list['curSelect'] ? 1 : 0]);
    }

    _updateType23() {
        this.state2.active = true;
        let attrCfg = ConfigManager.getItemById(Costume_attrCfg, this.info.randomAttr);
        this.selectNameLab.string = `随机属性:`;
        let vStr = attrCfg.attr_type == 'r' ? `${attrCfg.initial_value[0] / 100}%` : `${attrCfg.initial_value[0]}`
        this.selectDesc.string = `${attrCfg.attr_show}+${vStr}`;
        GlobalUtil.setSpriteIcon(this.node, this.bg, this.bgUrls[this.info.randomAttr == this.list['curSelect'] ? 1 : 0]);
    }
}
