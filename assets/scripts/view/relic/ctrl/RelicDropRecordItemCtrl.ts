import BagUtils from '../../../common/utils/BagUtils';
import ChatEventCtrl from '../../chat/ctrl/ChatEventCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import GlobalUtil from '../../../common/utils/GlobalUtil';
import ModelManager from '../../../common/managers/ModelManager';
import RelicModel from '../model/RelicModel';
import { Relic_pointCfg, TipsCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-02-04 17:25:31 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicDropRecordItemCtrl")
export default class RelicDropRecordItemCtrl extends cc.Component {
  @property(cc.Label)
  timeLab1: cc.Label = null;

  @property(cc.Label)
  timeLab2: cc.Label = null;

  @property(cc.RichText)
  content: cc.RichText = null;

  init(info: icmsg.RelicMapDrop) {
    // this.updateView();
    let m = ModelManager.get(RelicModel);
    let des = ConfigManager.getItemById(TipsCfg, 99).desc21;
    let s1 = `${info.playerId}`;
    let s2 = `<u><color=#00FF00>S${GlobalUtil.getSeverIdByPlayerId(info.playerId)}.${info.playerName}</c></u>`;
    let s3 = ConfigManager.getItemById(Relic_pointCfg, m.cityMap[info.pointId].pointType).des;
    let itemCfg = BagUtils.getConfigById(info.itemType)
    let i1 = `<color=${BagUtils.getColorInfo(itemCfg["color"]).color}>${itemCfg.name}</c><color=#00ff00>`;
    des = des.replace('%s', s1).replace('%s', s2).replace('%s', s3).replace('%i', i1);
    let time = new Date(info.dropTime * 1000);
    let mon = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let s = time.getSeconds();
    let timeStr = `${mon >= 10 ? mon : `0${mon}`}/${d >= 10 ? d : `0${d}`} ${h >= 10 ? h : `0${h}`}:${s >= 10 ? s : `0${s}`}`;
    this.updateView(timeStr, des);
  }

  updateView(time: string, desc: string) {
    let strs = time.split(' ');
    this.timeLab1.string = strs[0];
    this.timeLab2.string = strs[1];
    this.content.string = `<color=#F1B77F>${desc}</c>`;
    if (!this.content.getComponent(ChatEventCtrl)) {
      this.content.addComponent(ChatEventCtrl)
    }
  }
}
