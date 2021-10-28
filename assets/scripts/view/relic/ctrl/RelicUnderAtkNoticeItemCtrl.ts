import ChatEventCtrl from '../../chat/ctrl/ChatEventCtrl';
import ConfigManager from '../../../common/managers/ConfigManager';
import RelicUtils from '../utils/RelicUtils';
import { Relic_pointCfg, TvCfg } from '../../../a/config';

/** 
  * @Author: jiangping  
  * @Description: 
  * @Date: 2021-02-04 18:05:55 
  */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/relic/RelicGrabRecordViewCtrl")
export default class RelicUnderAtkNoticeItemCtrl extends cc.Component {
  @property(cc.Label)
  timeLab1: cc.Label = null;

  @property(cc.Label)
  timeLab2: cc.Label = null;

  @property(cc.RichText)
  content: cc.RichText = null;

  init(info: icmsg.RelicUnderAttackNoticeRsp) {
    let des = ConfigManager.getItemById(TvCfg, 43).desc;
    let mapId = [1001, 1002, 1003][info.mapType - 1];
    let s1 = ConfigManager.getItemById(Relic_pointCfg, RelicUtils.getTypeByCityId(mapId, info.pointId)).des;
    let s2 = `<color=#00FF00>${info.srvName}</c>`;
    let s3 = `<color=#00FF00>${info.atkName}</c>`;
    let s4 = `${info.ownerHP}`;
    let s5 = `${info.helperHP}`;
    let d1 = `${info.mapType}`;
    let d2 = `${info.pointId}`;
    des = des.replace('%s', s1).replace('%s', s2).replace('%s', s3).replace('%s', s4).replace('%s', s5).replace('%d', d1).replace('%d', d2);
    let time = new Date(info.noticeTime * 1000);
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
