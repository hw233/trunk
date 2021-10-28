import BagUtils from '../../../common/utils/BagUtils';
import ConfigManager from '../../../common/managers/ConfigManager';
import StringUtils from '../../../common/utils/StringUtils';
import { Guild_logCfg } from '../../../a/config';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 19:09:45
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildLogItemCtrl")
export default class GuildLogItemCtrl extends cc.Component {

    @property(cc.RichText)
    logLab: cc.RichText = null

    onEnable() {

    }

    updateLog(info: icmsg.GuildLog) {
        let cfg = ConfigManager.getItemByField(Guild_logCfg, "type", info.type)
        let des = cfg.text
        for (let i = 0; i < info.args.length; i++) {
            des = des.replace("%s", info.args[i])
        }
        let str = ''
        if (info.goodsList.length > 0) {
            for (let j = 0; j < info.goodsList.length; j++) {
                let itemCfg = BagUtils.getConfigById(info.goodsList[j].typeId)
                if (j == info.goodsList.length - 1) {
                    str += `<color=${BagUtils.getColorInfo(itemCfg["color"]).color}>${itemCfg.name}</c><color=#00ff00>x${info.goodsList[j].num}`
                } else {
                    str += `<color=${BagUtils.getColorInfo(itemCfg["color"]).color}> ${itemCfg.name} </c><color=#00ff00>x${info.goodsList[j].num}</c>, `
                }
            }
            des = des.replace("%i", str)
        }
        let time = new Date(info.time * 1000)
        let key = `${time.getHours() < 10 ? "0" + time.getHours() : time.getHours()}:${time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()}`
        this.logLab.string = `${key} ${des}`
        this.node.height = this.logLab.node.getContentSize().height
    }
}