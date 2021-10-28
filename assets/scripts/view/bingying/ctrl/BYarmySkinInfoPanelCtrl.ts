import BYModel from '../model/BYModel';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import NetManager from '../../../common/managers/NetManager';
import PanelId from '../../../configs/ids/PanelId';
import StringUtils from '../../../common/utils/StringUtils';
import {
    BarracksCfg,
    GlobalCfg,
    Soldier_army_skinCfg,
    Soldier_army_trammelCfg
    } from '../../../a/config';


/** 
 * @Description: 兵营-兵团精甲详情界面
 * @Author: yaozu.hu
 * @Date: 2019-05-08 14:30:43 
 * @Last Modified by: yaozu.hu
 * @Last Modified time: 2021-03-15 16:42:25
 */


const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bingying/BYarmySkinInfoPanelCtrl")
export default class BYarmySkinInfoPanelCtrl extends gdk.BasePanel {

    @property(sp.Skeleton)
    spine: sp.Skeleton = null;
    @property(cc.Label)
    skinName: cc.Label = null;
    @property(cc.Sprite)
    skinType: cc.Sprite = null;
    @property(cc.Label)
    jibanLb: cc.Label = null;
    @property(cc.Node)
    jihuoBtn: cc.Node = null;
    @property(cc.Label)
    btnLb: cc.Label = null;
    @property(cc.Label)
    typeLb: cc.Label = null;
    @property(cc.Node)
    tipsNode: cc.Node = null;

    skinId: number = 0;
    state: number = 1; //0 背包进入(显示按钮) 1羁绊进入(隐藏按钮)
    get byModel() { return ModelManager.get(BYModel); }
    cfg: Soldier_army_skinCfg;
    onEnable() {
        let arg = gdk.panel.getArgs(PanelId.BYarmySkinInfoPanel);
        if (arg) {
            this.skinId = arg[0];
            this.state = arg[1];
        }

        this.cfg = ConfigManager.getItemByField(Soldier_army_skinCfg, 'skin_id', this.skinId)
        this.jihuoBtn.active = this.state == 0;
        this.tipsNode.active = this.state != 0;
        if (this.state == 0) {
            if (this.byModel.byarmyState.skins.indexOf(this.skinId) >= 0) {
                this.btnLb.string = gdk.i18n.t("i18n:BYARMY_TIP13");
            } else {
                this.btnLb.string = gdk.i18n.t("i18n:BYARMY_TIP2");
            }
        }
        let path = `spine/monster/${this.cfg.skin}/ui/${this.cfg.skin}`
        GlobalUtil.setSpineData(this.node, this.spine, path, true, 'stand_s', true);
        this.skinName.string = this.cfg.name;
        let strs = ['c_type_1', '', 'c_type_3', 'c_type_4']
        let typeStrs = [gdk.i18n.t("i18n:BYARMY_TIP14"), '', gdk.i18n.t("i18n:BYARMY_TIP15"), gdk.i18n.t("i18n:BYARMY_TIP16")]
        let path1 = 'view/role/texture/careerIcon/' + strs[this.cfg.type - 1];
        this.typeLb.string = typeStrs[this.cfg.type - 1]
        GlobalUtil.setSpriteIcon(this.node, this.skinType, path1);
        let cfgs = ConfigManager.getItems(Soldier_army_trammelCfg, (tem: Soldier_army_trammelCfg) => {
            if (tem.skin_id.indexOf(this.cfg.skin_id) >= 0) {
                return true
            }
            return false;
        })
        let jibanStr = ''
        cfgs.forEach((cfg, idx) => {
            if (idx == 0) {
                jibanStr = cfg.trammel_name;
            } else {
                jibanStr += '\n' + cfg.trammel_name;
            }
        })
        this.jibanLb.string = jibanStr;

    }

    onDisable() {
        NetManager.targetOff(this);
    }

    jihuoBtnClick() {

        //判断兵团系统是否开启
        //兵营总等级达到75级后可解锁兵团系统
        let allLv = 0;
        this.byModel.byLevelsData.forEach((lv, index) => {
            let cfg = ConfigManager.getItemByField(BarracksCfg, 'type', index + 1, { 'barracks_lv': lv })
            if (cfg) {
                allLv += cfg.rounds;
            }
        })
        let openLv = ConfigManager.getItemByField(GlobalCfg, 'key', 'army_open').value[0]
        if (allLv < openLv) {
            let str = StringUtils.format(gdk.i18n.t("i18n:BYARMY_TIP17"), openLv)
            gdk.gui.showMessage(str)
            return
        }
        if (this.byModel.byarmyState.skins.indexOf(this.skinId) >= 0) {
            this.btnLb.string = gdk.i18n.t("i18n:BYARMY_TIP13");
            this.close();
            gdk.panel.setArgs(PanelId.BYarmyView, 2)
            gdk.panel.open(PanelId.BYarmyView);
        } else {
            this.close();
            gdk.panel.setArgs(PanelId.BYarmyView, 0, this.skinId)
            gdk.panel.open(PanelId.BYarmyView);
        }
    }

}
