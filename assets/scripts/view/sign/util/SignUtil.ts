import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import GuideUtil from '../../../common/utils/GuideUtil';
import JumpUtils from '../../../common/utils/JumpUtils';
import ModelManager from '../../../common/managers/ModelManager';
import PanelId from '../../../configs/ids/PanelId';
import ServerModel from '../../../common/models/ServerModel';
import SignModel from '../model/SignModel';
import { GlobalCfg, SignCfg } from '../../../a/config';

/** 
  * @Description: 登录工具类
  * @Author: weiliang.huang  
  * @Date: 2019-06-15 09:52:10 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-06-01 10:44:49
*/
export default class SignUtil {
    static cfgs: SignCfg[] = []

    static getSignCfgs() {
        if (this.cfgs.length > 0) {
            return this.cfgs
        }
        let model = ModelManager.get(SignModel)
        let data = ConfigManager.getItemById(GlobalCfg, "month_sign")
        model.max_bu = data.value[0]
        let cfgs = ConfigManager.getItems(SignCfg)
        GlobalUtil.sortArray(cfgs, (a, b) => {
            return a.id - b.id
        })
        this.cfgs = cfgs
        return this.cfgs
    }

    /*获取当月的天数 */
    static getCountDays() {
        let model = ModelManager.get(ServerModel)
        let curDate = new Date(model.serverTime);
        let newData = new Date(curDate.getFullYear(), curDate.getMonth() + 1, 0)
        return newData.getDate()
    }

    /**上线检查是否需要打开签到界面 */
    static CheckOpenSign() {
        //不在主城或者引导真在打开状态
        if (!gdk.panel.isOpenOrOpening(PanelId.MainPanel) || GuideUtil.isGuiding) {
            return;
        }
        let model = ModelManager.get(SignModel)
        let ifOpen = JumpUtils.ifSysOpen(1200, false)
        if (ifOpen && !model.signed && !model.showSign) {
            gdk.panel.open(PanelId.Sign)
            model.showSign = true
        }

    }

    static showSignReward(day) {
        let cfg = this.cfgs[day - 1]
        let info = new icmsg.GoodsInfo()
        info.typeId = cfg.item_id
        info.num = cfg.number
        GlobalUtil.openRewadrView([info])
    }
}