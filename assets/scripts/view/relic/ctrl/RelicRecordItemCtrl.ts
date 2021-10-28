import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RoleModel from '../../../common/models/RoleModel';
import TimerUtils from '../../../common/utils/TimerUtils';
import { Relic_mainCfg, Tips_relic_logCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2020-12-30 15:27:19 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicRecordItemCtrl")
export default class RelicRecordItemCtrl extends cc.Component {
  @property(cc.RichText)
  content: cc.RichText = null;

  updateView(data: icmsg.RelicRecord, rewards?: icmsg.GoodsInfo[]) {
    let cfg = ConfigManager.getItemById(Tips_relic_logCfg, data.type);
    let text = cfg.text;
    text = text.replace('{%t}', TimerUtils.format6(Math.max(1, GlobalUtil.getServerTime() / 1000 - data.time)));
    text = text.replace('{%t}', TimerUtils.format1(data.value));
    text = text.replace('{%s}', `S${data.serverId1}${gdk.i18n.t("i18n:RELIC_TIP1")}`);
    text = text.replace('{%s}', `S${data.serverId2}${gdk.i18n.t("i18n:RELIC_TIP1")}`);
    if (data.roleName1 == ModelManager.get(RoleModel).name) {
      data.roleName1 = gdk.i18n.t("i18n:RELIC_TIP25");
    }
    if (data.roleName2 == ModelManager.get(RoleModel).name) {
      data.roleName2 = gdk.i18n.t("i18n:RELIC_TIP25");
    }
    text = text.replace('{%r}', `${data.roleName1}`);
    text = text.replace('{%r}', `${data.roleName2}`);
    let v1, v2: string = '';
    if (data.type == 7) {
      v1 = '-' + data.value;
    } else if (data.type == 4 || data.type == 9) {
      let mcfg = ConfigManager.getItemById(Relic_mainCfg, 1);
      v1 = `${mcfg.repair_cost[1]}${gdk.i18n.t("i18n:RELIC_TIP26")}`;
    } else if (data.type == 11) {
      let mcfg = ConfigManager.getItemById(Relic_mainCfg, 1);
      v1 = `${mcfg.atk_cost[1]}${gdk.i18n.t("i18n:RELIC_TIP26")}`;
    } else if (data.type == 12) {
      v1 = `${data.value >> 16}`;
      v2 = `${parseInt(data.value.toString(2).substr(16), 2)}`;
    }
    else {
      v1 = data.value + '';
    }
    text = text.replace('{%v}', `${v1}`);
    text = text.replace('{%v}', `${v2}`);
    if (data.type == 2 && rewards) {
      let goodsList = rewards;
      let str = '';
      if (goodsList.length > 0) {
        for (let j = 0; j < goodsList.length; j++) {
          let itemCfg = BagUtils.getConfigById(goodsList[j].typeId)
          if (j == goodsList.length - 1) {
            str += `<color=${BagUtils.getColorInfo(itemCfg["color"]).color}>${itemCfg.name}</c><color=#00ff00>x${goodsList[j].num}`
          } else {
            str += `<color=${BagUtils.getColorInfo(itemCfg["color"]).color}> ${itemCfg.name} </c><color=#00ff00>x${goodsList[j].num}</c>, `
          }
        }
        text = text.replace("{%i}", str)
      }
    }
    this.content.string = text;
    this.node.height = this.content.node.getContentSize().height
  }
}
