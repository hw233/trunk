import GuildLogItemCtrl from './GuildLogItemCtrl';

/*
 * @Author: luoyong 
 * @Date: 2020-02-11 15:03:17 
 * @Last Modified by: luoyong
 * @Last Modified time: 2020-12-22 18:23:48
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("qszc/view/guild/GuildLogDayItemCtrl")
export default class GuildLogDayItemCtrl extends cc.Component {

    @property(cc.Label)
    dayLab: cc.Label = null

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Prefab)
    logItem: cc.Prefab = null

    onEnable() {

    }

    updateDayLog(title, datas: icmsg.GuildLog[]) {
        this.dayLab.string = `${title}`
        this.content.removeAllChildren()
        for (let i = 0; i < datas.length; i++) {
            let item = cc.instantiate(this.logItem)
            let ctrl = item.getComponent(GuildLogItemCtrl)
            this.content.addChild(item)
            ctrl.updateLog(datas[i])
        }
    }
}