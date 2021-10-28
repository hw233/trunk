import ActUtil from '../../act/util/ActUtil';
import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import CopyUtil from '../../../common/utils/CopyUtil';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import StringUtils from '../../../common/utils/StringUtils';
import UiSlotItem from '../../../common/widgets/UiSlotItem';
import { SystemCfg } from '../../../a/config';

/** 
 * 物品提示面板
 * @Author: weiliang.huang  
 * @Description: 
 * @Date: 2019-03-21 09:57:55 
 * @Last Modified by: jiangping
 * @Last Modified time: 2021-03-30 14:44:53
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/bag/ItemWayItemCtrl")
export default class ItemWayItemCtrl extends cc.Component {
    @property(cc.Node)
    costSlot: cc.Node = null;

    @property(cc.Label)
    desLab: cc.Label = null

    @property(cc.Label)
    openLab: cc.Label = null

    @property(cc.Node)
    btnGo: cc.Node = null

    _sysId: number = 0

    onEnable() {

    }

    updateWayInfo(wayGet, baseCfg) {
        let [desc, sysId] = [wayGet[0], wayGet[1]];
        this._sysId = sysId
        this.desLab.string = `${desc}`
        let cfg = ConfigManager.getItemById(SystemCfg, sysId);
        if (!cfg) {
            return true;
        }
        if (baseCfg && wayGet[2]) {
            this.costSlot.active = true;
            let ctrl = this.costSlot.getComponent(UiSlotItem);
            ctrl.updateItemInfo(wayGet[2]);
            ctrl.updateItemName(BagUtils.getConfigById(wayGet[2]).name);
            ctrl.itemInfo = {
                series: null,
                itemId: wayGet[2],
                itemNum: 1,
                type: BagUtils.getItemTypeById(wayGet[2]),
                extInfo: null
            }
        }
        else {
            this.costSlot.active = false;
        }

        let openStr = ""
        let model = ModelManager.get(RoleModel);
        // 等级达不到要求
        if (model.level < cfg.openLv) {
            let text = gdk.i18n.t("i18n:BAG_TIP9");
            openStr += text.replace("@level", `${cfg.openLv}`);
        }

        // 已通过指定副本
        if (cc.js.isNumber(cfg.fbId) && cfg.fbId > 0 && !CopyUtil.isFbPassedById(cfg.fbId)) {
            let text = GlobalUtil.getSysFbLimitStr(cfg.fbId);
            openStr += `${openStr.length >= 1 ? '\n' : ''}` + text

        }

        if (cc.js.isNumber(cfg.vip) && cfg.vip > 0 && ModelManager.get(RoleModel).vipLv < cfg.vip) {
            let text = StringUtils.format(gdk.i18n.t("i18n:BAG_TIP10"), cfg.vip)//`vip等级达到${cfg.vip}级开启`;
            openStr += `${openStr.length >= 1 ? '\n' : ''}` + text
        }

        //限时开启的功能 已过活动日期
        if (cc.js.isNumber(cfg.activity) && cfg.activity > 0 && !ActUtil.ifActOpen(cfg.activity)) {
            let text = `${cfg.name}未开启`;
            openStr += `${openStr.length >= 1 ? '\n' : ''}` + text
        }

        if (openStr != "") {
            this.btnGo.active = false
            this.openLab.node.active = true
            this.openLab.string = openStr
        } else {
            this.btnGo.active = true
            this.openLab.node.active = false
        }

    }


    clickGoFunc() {
        gdk.gui.removeAllPopup()
        JumpUtils.openView(this._sysId)
    }
}