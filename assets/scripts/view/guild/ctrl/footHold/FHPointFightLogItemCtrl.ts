import ChatEventCtrl from '../../../chat/ctrl/ChatEventCtrl';
import ConfigManager from '../../../../common/managers/ConfigManager';
import GlobalUtil from '../../../../common/utils/GlobalUtil';
import { TvCfg } from '../../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2021-03-03 14:32:45
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/footHold/FHPointFightLogItemCtrl")
export default class FHPointFightLogItemCtrl extends cc.Component {
    @property(cc.Label)
    timeLab1: cc.Label = null;

    @property(cc.Label)
    timeLab2: cc.Label = null;

    @property(cc.RichText)
    content: cc.RichText = null;

    init(info: icmsg.FootholdFightRecord) {
        // let m = ModelManager.get(RelicModel);
        // let des = ConfigManager.getItemById(TipsCfg, 99).desc21;
        // let s1 = ;
        // let s2 = `<u><color=#00FF00>S${GlobalUtil.getSeverIdByPlayerId(info.playerId)}.${info.playerName}</c></u>`;
        // let s3 = ConfigManager.getItemById(Relic_pointCfg, m.cityMap[info.pointId].pointType).des;
        // let itemCfg = BagUtils.getConfigById(info.itemType)
        // let i1 = `<color=${BagUtils.getColorInfo(itemCfg["color"]).color}>${itemCfg.name}</c><color=#00ff00>`;
        // des = des.replace('%s', s1).replace('%s', s2).replace('%s', s3).replace('%i', i1);
        // let time = new Date(info.dropTime * 1000);
        // let mon = time.getMonth() + 1;
        // let d = time.getDate();
        // let h = time.getHours();
        // let s = time.getSeconds();
        // let timeStr = `${mon >= 10 ? mon : `0${mon}`}/${d >= 10 ? d : `0${d}`} ${h >= 10 ? h : `0${h}`}:${s >= 10 ? s : `0${s}`}`;
        // this.updateView(timeStr, des);

        let desc = ConfigManager.getItemById(TvCfg, 46).desc
        let s1 = `<color=#00FF00>[S${GlobalUtil.getSeverIdByPlayerId(info.attackerId)}]</c>`;
        let s2 = `<color=#00FF00>${info.attackerGuild}</c>`
        let s3 = `${info.attackerId}`
        let s4 = `<u><color=#00FF00>${info.attackerName}</c></u>`
        let s5 = `<color=#00FF00>${info.remainPercent}</c>`
        let args = [s1, s2, s3, s4, s5]
        for (let i = 0; i < args.length; i++) {
            desc = desc.replace("%s", `${args[i]}`)
        }
        let time = new Date(info.fightTime * 1000);
        let mon = time.getMonth() + 1;
        let d = time.getDate();
        let h = time.getHours();
        let s = time.getSeconds();
        let timeStr = `${mon >= 10 ? mon : `0${mon}`}/${d >= 10 ? d : `0${d}`} ${h >= 10 ? h : `0${h}`}:${s >= 10 ? s : `0${s}`}`;
        this.updateView(timeStr, desc);
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